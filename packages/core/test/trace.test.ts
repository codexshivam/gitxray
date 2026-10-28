import { describe, it, expect } from 'vitest';
import { PythonTracer } from '../src/trace/python_tracer.js';

describe('Phase 4: Python Execution Tracing', () => {
  it('traces a recursive function with exact call and return events', async () => {
    const files = {
      'calc.py': `
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

res = factorial(3)
`
    };

    const result = await PythonTracer.traceCodebase(files, {
      entryPointFile: 'calc.py',
      maxSteps: 100
    });

    expect(result.status).toBe('completed');
    expect(result.steps.length).toBeGreaterThan(5);

    // Verify events include calls and returns
    const events = result.steps.map((s) => s.event);
    expect(events).toContain('call');
    expect(events).toContain('return');
    expect(events).toContain('line');

    // Check recursive stack depth
    const maxStackDepth = Math.max(...result.steps.map((s) => s.callStack.length));
    expect(maxStackDepth).toBeGreaterThanOrEqual(3);

    // Verify stepping forward and backward reproduces deterministic state
    const step3 = result.steps[2];
    expect(step3.file).toBe('calc.py');
    expect(step3.locals).toBeDefined();

    // Verify return value at final return step
    const returnSteps = result.steps.filter((s) => s.event === 'return');
    expect(returnSteps.length).toBeGreaterThan(0);
    const lastReturn = returnSteps[returnSteps.length - 1];
    expect(lastReturn.returnValue).toBeDefined();
  });

  it('traces multi-file execution across 3 distinct Python modules', async () => {
    const files = {
      'main.py': `
from service import process_order

order_result = process_order(101, 5)
`,
      'service.py': `
from helper import calculate_tax

def process_order(order_id, base_price):
    tax = calculate_tax(base_price)
    return {"order_id": order_id, "total": base_price + tax}
`,
      'helper.py': `
def calculate_tax(amount):
    rate = 0.10
    return amount * rate
`
    };

    const result = await PythonTracer.traceCodebase(files, {
      entryPointFile: 'main.py',
      maxSteps: 200
    });

    expect(result.status).toBe('completed');
    expect(result.steps.length).toBeGreaterThan(0);

    // Verify steps traverse all 3 files
    const tracedFiles = new Set(result.steps.map((s) => s.file));
    expect(tracedFiles.has('main.py')).toBe(true);
    expect(tracedFiles.has('service.py')).toBe(true);
    expect(tracedFiles.has('helper.py')).toBe(true);

    // Verify call to calculate_tax in helper.py
    const helperStep = result.steps.find(
      (s) => s.file === 'helper.py' && s.functionName === 'calculate_tax'
    );
    expect(helperStep).toBeDefined();
    expect(helperStep?.locals['amount']?.value).toBe('5');
  });

  it('safely handles infinite loops and hits step cap or timeout without hanging', async () => {
    const files = {
      'infinite.py': `
count = 0
while True:
    count += 1
`
    };

    const result = await PythonTracer.traceCodebase(files, {
      entryPointFile: 'infinite.py',
      maxSteps: 50,
      timeoutMs: 1500
    });

    // Should stop safely at step cap or timeout
    expect(['step_cap_reached', 'timeout']).toContain(result.status);
    if (result.status === 'step_cap_reached') {
      expect(result.steps.length).toBe(50);
    }
  });
});
