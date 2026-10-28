import React from 'react';
import { AnalysisResult } from '../hooks/useRepoAnalysis';
import { GitBranch, Layers, Clock, AlertCircle } from 'lucide-react';

interface RepoHeaderProps {
  analysis: AnalysisResult;
  selectedFile: string | null;
  onClearRepo: () => void;
}

export function RepoHeader({ analysis, selectedFile, onClearRepo }: RepoHeaderProps) {
  const topCore = analysis.rankedFiles[0];

  return (
    <div className="border-b border-brand-border bg-brand-surface/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Repo Identity & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono">
          <button
            onClick={onClearRepo}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            repos
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-semibold">{analysis.owner}</span>
          <span className="text-slate-600">/</span>
          <span className="text-brand-cyan font-bold">{analysis.repo}</span>
          {analysis.ref && (
            <span className="text-[11px] text-slate-400 bg-brand-dark px-1.5 py-0.5 rounded border border-brand-border flex items-center gap-1 ml-1">
              <GitBranch size={11} />
              {analysis.ref}
            </span>
          )}
        </div>

        {/* Snapshot Badge if rate limited or offline */}
        {analysis.isCachedSnapshot && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
            <AlertCircle size={10} />
            <span>Architectural Snapshot</span>
          </span>
        )}
      </div>

      {/* Right: Engine & Graph Metrics */}
      <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
        {topCore && (
          <div className="hidden md:flex items-center gap-1.5 bg-brand-dark px-2.5 py-1 rounded border border-brand-border">
            <span className="text-emerald-400">● Kernel:</span>
            <span className="text-slate-200 truncate max-w-[180px]">
              {topCore.id.split('/').pop()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-slate-300">
          <Layers size={13} className="text-brand-cyan" />
          <span>{analysis.graph.nodes.length} Files</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <span>• {analysis.graph.edges.length} Edges</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400">
          <Clock size={12} />
          <span>{analysis.executionDurationMs}ms</span>
        </div>
      </div>
    </div>
  );
}
