import {
  TraceResult,
  TraceRunOptions
} from './types.js';

export class PythonTracer {
  /**
   * Generates the Python tracing harness code.
   * Can be injected into Pyodide (browser) or executed natively with python3 (Node/CLI).
   */
  static generateHarnessScript(
    files: Record<string, string>,
    entryPoint: string,
    funcName?: string,
    args: any[] = [],
    maxSteps: number = 500
  ): string {
    const filesJson = JSON.stringify(files);
    const argsJson = JSON.stringify(args);

    return `
import sys
import os
import json
import time

FILES = ${filesJson}
ENTRY_FILE = ${JSON.stringify(entryPoint)}
FUNC_NAME = ${funcName ? JSON.stringify(funcName) : 'None'}
ARGS = ${argsJson}
MAX_STEPS = ${maxSteps}

class StepCapReached(Exception):
    pass

class Tracer:
    def __init__(self, target_files, max_steps):
        self.target_files = {f.replace('\\\\', '/') for f in target_files}
        self.max_steps = max_steps
        self.steps = []
        self.step_count = 0
        self.stopped = False

    def snapshot_val(self, val):
        tname = type(val).__name__
        try:
            r = repr(val)
            if len(r) > 100:
                r = r[:97] + '...'
            return {"name": "", "type": tname, "value": r}
        except Exception:
            return {"name": "", "type": tname, "value": "<unprintable>"}

    def snapshot_locals(self, frame_locals):
        res = {}
        for k, v in frame_locals.items():
            if k.startswith('__') and k.endswith('__'):
                continue
            item = self.snapshot_val(v)
            item["name"] = k
            res[k] = item
        return res

    def extract_stack(self, frame):
        stack = []
        curr = frame
        while curr:
            cfile = curr.f_code.co_filename.replace('\\\\', '/')
            matched = None
            for tf in self.target_files:
                if tf in cfile or cfile.endswith(tf):
                    matched = tf
                    break
            if matched:
                stack.append({
                    "file": matched,
                    "functionName": curr.f_code.co_name,
                    "line": curr.f_lineno,
                    "locals": self.snapshot_locals(curr.f_locals)
                })
            curr = curr.f_back
        return list(reversed(stack))

    def trace_hook(self, frame, event, arg):
        if self.stopped:
            return None
        if self.step_count >= self.max_steps:
            self.stopped = True
            raise StepCapReached("step_cap_reached")

        filename = frame.f_code.co_filename.replace('\\\\', '/')
        matched_file = None
        for tf in self.target_files:
            if tf in filename or filename.endswith(tf):
                matched_file = tf
                break

        if not matched_file:
            return self.trace_hook

        self.step_count += 1
        stack = self.extract_stack(frame)
        current_locals = self.snapshot_locals(frame.f_locals)

        step = {
            "stepIndex": self.step_count,
            "event": event,
            "file": matched_file,
            "line": frame.f_lineno,
            "functionName": frame.f_code.co_name,
            "callStack": stack,
            "locals": current_locals
        }

        if event == 'return':
            step["returnValue"] = self.snapshot_val(arg)
        elif event == 'exception':
            step["exception"] = str(arg[1]) if isinstance(arg, tuple) and len(arg) > 1 else str(arg)

        self.steps.append(step)
        return self.trace_hook

tracer = Tracer(FILES.keys(), MAX_STEPS)
status = 'completed'
err_msg = None

try:
    sys.settrace(tracer.trace_hook)
    
    # Execute entry module
    if ENTRY_FILE in FILES:
        mod_code = compile(FILES[ENTRY_FILE], ENTRY_FILE, 'exec')
        mod_globals = {
            '__name__': '__main__',
            '__file__': ENTRY_FILE
        }
        exec(mod_code, mod_globals)

        # If a specific function is specified, call it
        if FUNC_NAME and FUNC_NAME in mod_globals and callable(mod_globals[FUNC_NAME]):
            mod_globals[FUNC_NAME](*ARGS)
except StepCapReached:
    status = 'step_cap_reached'
except Exception as e:
    status = 'error'
    err_msg = f"{type(e).__name__}: {str(e)}"
finally:
    sys.settrace(None)

output = {
    "version": "1.0.0",
    "status": status,
    "steps": tracer.steps,
    "totalSteps": len(tracer.steps),
    "error": err_msg,
    "unsupportedFeaturesNotice": "Native extensions (C/Rust), socket networking, and external filesystem are not available in browser sandbox."
}

print("###GITXRAY_TRACE_START###")
print(json.dumps(output))
print("###GITXRAY_TRACE_END###")
`;
  }

  /**
   * Runs Python execution trace across a collection of files.
   * In Node.js / CLI / Test environment, executes python3 in an isolated temp directory.
   */
  static async traceCodebase(
    files: Record<string, string>,
    options: TraceRunOptions
  ): Promise<TraceResult> {
    const startTime = performance.now();
    const maxSteps = options.maxSteps || 500;
    const timeoutMs = options.timeoutMs || 4000;

    // Dynamically import node modules to preserve browser-bundle compatibility
    const cpMod = 'node:child_process';
    const fsMod = 'node:fs';
    const pathMod = 'node:path';
    const osMod = 'node:os';

    const { spawn } = await import(/* @vite-ignore */ cpMod);
    const fs = await import(/* @vite-ignore */ fsMod);
    const path = await import(/* @vite-ignore */ pathMod);
    const os = await import(/* @vite-ignore */ osMod);

    // Create temporary execution sandbox directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitxray-trace-'));

    try {
      // Write all repository files into sandbox maintaining folder hierarchy
      for (const [relPath, content] of Object.entries(files)) {
        const fullPath = path.join(tempDir, relPath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf8');
      }

      // Generate runner script in temp directory
      const harnessScript = this.generateHarnessScript(
        files,
        options.entryPointFile,
        options.entryPointFunction,
        options.entryPointArgs,
        maxSteps
      );

      const runnerPath = path.join(tempDir, '_gitxray_runner.py');
      fs.writeFileSync(runnerPath, harnessScript, 'utf8');

      // Execute with timeout safeguard
      const runPromise = new Promise<string>((resolve, reject) => {
        const proc = spawn('python3', [runnerPath], {
          cwd: tempDir,
          env: {
            ...process.env,
            PYTHONPATH: tempDir
          }
        });

        let stdout = '';
        let stderr = '';
        let timedOut = false;

        const timer = setTimeout(() => {
          timedOut = true;
          proc.kill('SIGKILL');
          reject(new Error('EXECUTION_TIMEOUT'));
        }, timeoutMs);

        proc.stdout.on('data', (data: any) => {
          stdout += data.toString();
        });

        proc.stderr.on('data', (data: any) => {
          stderr += data.toString();
        });

        proc.on('close', (code: number) => {
          clearTimeout(timer);
          if (timedOut) return;
          if (code !== 0 && !stdout.includes('###GITXRAY_TRACE_START###')) {
            reject(new Error(stderr || `Process exited with code ${code}`));
          } else {
            resolve(stdout);
          }
        });
      });

      try {
        const rawOutput = await runPromise;
        const startMarker = '###GITXRAY_TRACE_START###';
        const endMarker = '###GITXRAY_TRACE_END###';

        const startIndex = rawOutput.indexOf(startMarker);
        const endIndex = rawOutput.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) {
          throw new Error('Trace output delimiter not found in stdout');
        }

        const jsonStr = rawOutput.substring(startIndex + startMarker.length, endIndex).trim();
        const parsed = JSON.parse(jsonStr);

        return {
          version: parsed.version || '1.0.0',
          status: parsed.status,
          steps: parsed.steps,
          totalSteps: parsed.steps.length,
          durationMs: Math.round(performance.now() - startTime),
          error: parsed.error,
          unsupportedFeaturesNotice: parsed.unsupportedFeaturesNotice
        };
      } catch (err: any) {
        if (err.message === 'EXECUTION_TIMEOUT') {
          return {
            version: '1.0.0',
            status: 'timeout',
            steps: [],
            totalSteps: 0,
            durationMs: Math.round(performance.now() - startTime),
            error: `Execution timed out after ${timeoutMs}ms (infinite loop prevented).`,
            unsupportedFeaturesNotice: 'Hard timeout triggered to preserve environment stability.'
          };
        }
        throw err;
      }
    } finally {
      // Clean up temporary sandbox directory
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }
  }
}
