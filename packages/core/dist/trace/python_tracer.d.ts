import { TraceResult, TraceRunOptions } from './types.js';
export declare class PythonTracer {
    /**
     * Generates the Python tracing harness code.
     * Can be injected into Pyodide (browser) or executed natively with python3 (Node/CLI).
     */
    static generateHarnessScript(files: Record<string, string>, entryPoint: string, funcName?: string, args?: any[], maxSteps?: number): string;
    /**
     * Runs Python execution trace across a collection of files.
     * In Node.js / CLI / Test environment, executes python3 in an isolated temp directory.
     */
    static traceCodebase(files: Record<string, string>, options: TraceRunOptions): Promise<TraceResult>;
}
//# sourceMappingURL=python_tracer.d.ts.map