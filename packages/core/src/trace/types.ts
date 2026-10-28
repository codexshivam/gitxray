export type TraceEventType = 'call' | 'line' | 'return' | 'exception';

export type TraceRunStatus = 'completed' | 'timeout' | 'step_cap_reached' | 'error';

export interface VariableSnapshot {
  name: string;
  type: string;
  value: string;
}

export interface StackFrame {
  file: string;
  functionName: string;
  line: number;
  locals: Record<string, VariableSnapshot>;
}

export interface TraceStep {
  stepIndex: number;
  event: TraceEventType;
  file: string;
  line: number;
  functionName: string;
  callStack: StackFrame[];
  locals: Record<string, VariableSnapshot>;
  returnValue?: VariableSnapshot;
  exception?: string;
  explanation?: string;
}

export interface TraceRunOptions {
  entryPointFile: string;
  entryPointFunction?: string;
  entryPointArgs?: any[];
  maxSteps?: number;
  timeoutMs?: number;
}

export interface TraceResult {
  version: string;
  status: TraceRunStatus;
  steps: TraceStep[];
  totalSteps: number;
  durationMs: number;
  error?: string;
  unsupportedFeaturesNotice?: string;
}
