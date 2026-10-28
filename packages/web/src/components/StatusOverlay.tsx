import React, { useState } from 'react';
import { Loader2, AlertTriangle, Key, ArrowRight, RotateCcw } from 'lucide-react';
import { PipelinePhase } from '../hooks/useRepoAnalysis';

interface StatusOverlayProps {
  phase: PipelinePhase;
  statusMessage: string;
  error: { message: string; isRateLimit?: boolean } | null;
  onRetry: () => void;
  onSetToken: (token: string) => void;
  onSelectSample: (owner: string, repo: string) => void;
}

export function StatusOverlay({
  phase,
  statusMessage,
  error,
  onRetry,
  onSetToken,
  onSelectSample
}: StatusOverlayProps) {
  const [tokenInput, setTokenInput] = useState('');

  if (phase === 'ready' || phase === 'idle') return null;

  const handleApplyToken = () => {
    if (tokenInput.trim()) {
      onSetToken(tokenInput.trim());
      onRetry();
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Loading State */}
      {phase !== 'error' && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_12px_#06b6d4]" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
              {phase === 'fetching' && 'Phase 1: Ingestion'}
              {phase === 'parsing' && 'Phase 2: AST Analysis'}
              {phase === 'ranking' && 'Phase 3: Centrality & Ranking'}
            </h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              {statusMessage || 'Analyzing repository...'}
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 pt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                phase === 'fetching' ? 'bg-brand-cyan animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                phase === 'parsing'
                  ? 'bg-brand-cyan animate-pulse'
                  : phase === 'ranking'
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full ${
                phase === 'ranking' ? 'bg-brand-cyan animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {phase === 'error' && error && (
        <div className="bg-brand-surface border border-rose-500/30 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-100">
                {error.isRateLimit ? 'GitHub API Rate Limit Hit' : 'Inspection Failed'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {error.message}
              </p>
            </div>
          </div>

          {error.isRateLimit ? (
            <div className="space-y-3 pt-2 border-t border-brand-border">
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub permits only 60 unauthenticated requests/hour. To bypass this, paste a GitHub token (stays 100% in local browser storage):
              </p>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="flex-1 bg-brand-dark border border-brand-border rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan"
                />
                <button
                  onClick={handleApplyToken}
                  className="px-4 py-1.5 bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded flex items-center gap-1 transition-colors shrink-0"
                >
                  <Key size={13} />
                  <span>Apply & Retry</span>
                </button>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                Or explore an instant pre-loaded repository:
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => onSelectSample('pallets', 'flask')}
                    className="px-2.5 py-1 rounded bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-300 text-xs font-mono"
                  >
                    pallets/flask
                  </button>
                  <button
                    onClick={() => onSelectSample('expressjs', 'express')}
                    className="px-2.5 py-1 rounded bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-300 text-xs font-mono"
                  >
                    expressjs/express
                  </button>
                  <button
                    onClick={() => onSelectSample('openai', 'whisper')}
                    className="px-2.5 py-1 rounded bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-300 text-xs font-mono"
                  >
                    openai/whisper
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex justify-end gap-2 border-t border-brand-border">
              <button
                onClick={onRetry}
                className="px-4 py-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-200 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
