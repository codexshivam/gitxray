import React, { useState, useEffect, useRef } from 'react';
import { TraceResult, TraceStep } from '@gitxray/core';
import { BrowserPythonTracer } from '../utils/browserTracer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Layers,
  Variable,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ExecutionStepperProps {
  files: Map<string, string> | Record<string, string>;
  activeFile?: string;
  onSelectFile?: (file: string) => void;
}

export function ExecutionStepper({
  files,
  activeFile: initialFile,
  onSelectFile
}: ExecutionStepperProps) {
  // Convert files Map to Record if necessary
  const filesRecord: Record<string, string> = React.useMemo(() => {
    if (files instanceof Map) {
      const rec: Record<string, string> = {};
      files.forEach((v, k) => {
        rec[k] = v;
      });
      return rec;
    }
    return files;
  }, [files]);

  const fileKeys = Object.keys(filesRecord);
  const defaultEntry = initialFile || fileKeys.find((f) => f.endsWith('.py')) || fileKeys[0] || 'main.py';

  // Preset Execution Scenarios
  const [selectedScenario, setSelectedScenario] = useState<'current' | 'recursive' | 'multifile' | 'infinite'>('current');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(750); // ms per step
  const [isLoading, setIsLoading] = useState(false);
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null);

  // Run or re-run trace
  const handleRunTrace = async (scenario: 'current' | 'recursive' | 'multifile' | 'infinite') => {
    setIsLoading(true);
    setIsPlaying(false);

    let traceFiles: Record<string, string> = { ...filesRecord };
    let entryPoint = defaultEntry;

    if (scenario === 'recursive') {
      traceFiles = {
        'calc.py': `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(3)\n`
      };
      entryPoint = 'calc.py';
    } else if (scenario === 'multifile') {
      traceFiles = {
        'main.py': `from service import process_order\n\norder = process_order(101, 5)\n`,
        'service.py': `from helper import calculate_tax\n\ndef process_order(order_id, base_price):\n    tax = calculate_tax(base_price)\n    return {"order_id": order_id, "total": base_price + tax}\n`,
        'helper.py': `def calculate_tax(amount):\n    rate = 0.10\n    return amount * rate\n`
      };
      entryPoint = 'main.py';
    } else if (scenario === 'infinite') {
      traceFiles = {
        'infinite.py': `count = 0\nwhile True:\n    count += 1\n`
      };
      entryPoint = 'infinite.py';
    }

    try {
      const res = await BrowserPythonTracer.trace(traceFiles, {
        entryPointFile: entryPoint,
        maxSteps: 100,
        timeoutMs: 3000
      });
      setTraceResult(res);
      setCurrentStepIndex(0);
    } catch (err: any) {
      console.error('Trace execution failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial trace run on mount
  useEffect(() => {
    handleRunTrace(selectedScenario);
  }, []);

  // Keyboard navigation (Left/Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!traceResult || traceResult.steps.length === 0) return;
      if (e.key === 'ArrowRight') {
        setCurrentStepIndex((prev) => Math.min(prev + 1, traceResult.steps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [traceResult]);

  // Play / Pause auto stepper
  useEffect(() => {
    if (!isPlaying || !traceResult) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= traceResult.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, traceResult, playbackSpeed]);

  const currentStep: TraceStep | undefined = traceResult?.steps[currentStepIndex];
  const totalSteps = traceResult?.steps.length || 0;

  // Active file source code
  const activeFileName = currentStep?.file || defaultEntry;
  const activeFileContent =
    selectedScenario === 'recursive'
      ? `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(3)\n`
      : selectedScenario === 'multifile'
      ? activeFileName === 'service.py'
        ? `from helper import calculate_tax\n\ndef process_order(order_id, base_price):\n    tax = calculate_tax(base_price)\n    return {"order_id": order_id, "total": base_price + tax}\n`
        : activeFileName === 'helper.py'
        ? `def calculate_tax(amount):\n    rate = 0.10\n    return amount * rate\n`
        : `from service import process_order\n\norder = process_order(101, 5)\n`
      : selectedScenario === 'infinite'
      ? `count = 0\nwhile True:\n    count += 1\n`
      : filesRecord[activeFileName] || '';

  const activeLines = activeFileContent.split('\n');

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-dark text-slate-100 overflow-hidden select-none">
      {/* Top Scrubber & Controls Toolbar */}
      <div className="border-b border-brand-border bg-brand-surface/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">Trace Scenario:</span>
          <select
            value={selectedScenario}
            onChange={(e) => {
              const val = e.target.value as any;
              setSelectedScenario(val);
              handleRunTrace(val);
            }}
            className="bg-brand-dark border border-brand-border rounded px-2.5 py-1 text-slate-200 font-mono focus:outline-none focus:border-brand-cyan"
          >
            <option value="current">Current Repo Entrypoint ({defaultEntry.split('/').pop()})</option>
            <option value="recursive">Recursive Factorial (Stack Unwinding)</option>
            <option value="multifile">3-File Cross-Module Pipeline (main → service → helper)</option>
            <option value="infinite">Infinite Loop Protection (Timeout/Cap)</option>
          </select>
        </div>

        {/* Playback & Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(0)}
            disabled={totalSteps === 0}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-40 transition-colors"
            title="Reset to Start"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentStepIndex === 0 || totalSteps === 0}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-40 transition-colors"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack size={15} />
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            disabled={totalSteps === 0}
            className="px-3 py-1 bg-brand-cyan hover:bg-cyan-400 text-slate-950 rounded font-semibold flex items-center gap-1 transition-colors shadow-[0_0_8px_rgba(6,182,212,0.3)]"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1))}
            disabled={currentStepIndex >= totalSteps - 1 || totalSteps === 0}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-40 transition-colors"
            title="Next Step (Right Arrow)"
          >
            <SkipForward size={15} />
          </button>

          {/* Step Indicator */}
          <div className="font-mono text-xs text-slate-400 px-2">
            Step <span className="text-brand-cyan font-bold">{totalSteps > 0 ? currentStepIndex + 1 : 0}</span> / {totalSteps}
          </div>

          {/* Event Badge */}
          {currentStep && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                currentStep.event === 'call'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : currentStep.event === 'return'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : currentStep.event === 'exception'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {currentStep.event}
            </span>
          )}
        </div>
      </div>

      {/* Timeline Slider Bar */}
      <div className="bg-brand-surface/40 px-4 py-1.5 border-b border-brand-border flex items-center gap-3">
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
          disabled={totalSteps === 0}
          className="flex-1 accent-brand-cyan cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <span>Speed:</span>
          <button
            onClick={() => setPlaybackSpeed(1200)}
            className={`px-1 rounded ${playbackSpeed === 1200 ? 'text-brand-cyan font-bold' : 'hover:text-slate-300'}`}
          >
            0.5x
          </button>
          <button
            onClick={() => setPlaybackSpeed(750)}
            className={`px-1 rounded ${playbackSpeed === 750 ? 'text-brand-cyan font-bold' : 'hover:text-slate-300'}`}
          >
            1x
          </button>
          <button
            onClick={() => setPlaybackSpeed(300)}
            className={`px-1 rounded ${playbackSpeed === 300 ? 'text-brand-cyan font-bold' : 'hover:text-slate-300'}`}
          >
            2x
          </button>
        </div>
      </div>

      {/* Main Execution Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Code Stage */}
        <div className="flex-1 flex flex-col border-r border-brand-border bg-brand-dark overflow-hidden">
          {/* Active File Header */}
          <div className="px-4 py-2 bg-brand-surface/60 border-b border-brand-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Executing:</span>
              <span className="text-brand-cyan font-semibold">{activeFileName}</span>
              {currentStep && (
                <span className="text-slate-500">({currentStep.functionName}(): Line {currentStep.line})</span>
              )}
            </div>

            {currentStep?.explanation && (
              <span className="text-slate-400 italic text-[11px] truncate max-w-md">
                {currentStep.explanation}
              </span>
            )}
          </div>

          {/* Code Viewer with Glowing Active Line */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            <div className="bg-brand-surface/30 rounded-lg border border-brand-border/60 overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  {activeLines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isActive = currentStep?.line === lineNum;

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isActive
                            ? 'bg-cyan-950/40 border-l-2 border-brand-cyan'
                            : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <td
                          className={`w-10 pr-3 text-right select-none text-[11px] font-mono ${
                            isActive ? 'text-brand-cyan font-bold' : 'text-slate-600'
                          }`}
                        >
                          {isActive ? '▶' : ''} {lineNum}
                        </td>
                        <td
                          className={`py-0.5 px-2 whitespace-pre font-mono ${
                            isActive ? 'text-slate-100 font-medium' : 'text-slate-400'
                          }`}
                        >
                          {line || ' '}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Unsupported Features Disclaimer */}
          <div className="px-4 py-2 border-t border-brand-border bg-brand-surface/40 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <Info size={13} className="text-slate-400 shrink-0" />
            <span>
              Sandbox limitations: Native C/Rust extensions, network sockets, and filesystem are simulated in-browser.
            </span>
          </div>
        </div>

        {/* Right Stack & Variables Inspector */}
        <div className="w-72 sm:w-80 md:w-96 flex flex-col bg-brand-surface border-l border-brand-border overflow-hidden">
          {/* Call Stack Section */}
          <div className="flex-1 border-b border-brand-border flex flex-col overflow-hidden">
            <div className="px-3 py-2 bg-brand-elevated/40 border-b border-brand-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Layers size={14} className="text-brand-cyan" />
                <span>Call Stack</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Depth: {currentStep?.callStack.length || 0}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-xs">
              {currentStep && currentStep.callStack.length > 0 ? (
                currentStep.callStack
                  .slice()
                  .reverse()
                  .map((frame, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded border transition-colors ${
                        idx === 0
                          ? 'bg-brand-cyan/10 border-brand-cyan/40 text-slate-100'
                          : 'bg-brand-dark/50 border-brand-border text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-cyan">{frame.functionName}()</span>
                        <span className="text-[10px] text-slate-500">Line {frame.line}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate pt-0.5">
                        {frame.file}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-slate-500 text-xs italic p-2">Empty stack</div>
              )}
            </div>
          </div>

          {/* Variables Inspector Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2 bg-brand-elevated/40 border-b border-brand-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Variable size={14} className="text-emerald-400" />
                <span>Variables & Scope</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {currentStep ? Object.keys(currentStep.locals).length : 0} items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-xs">
              {currentStep && Object.keys(currentStep.locals).length > 0 ? (
                Object.entries(currentStep.locals).map(([key, item]) => (
                  <div
                    key={key}
                    className="p-2 rounded bg-brand-dark/60 border border-brand-border flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-slate-200">{key}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-brand-cyan text-[11px] truncate max-w-[140px] font-mono text-right">
                      {item.value}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-xs italic p-2">No variables in scope</div>
              )}

              {currentStep?.returnValue && (
                <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">return value</span>
                  <span className="font-mono text-emerald-300">{currentStep.returnValue.value}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
