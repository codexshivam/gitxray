import React, { useState } from 'react';
import { AnalysisResult } from '../hooks/useRepoAnalysis';
import { GitBranch, Layers, Clock, AlertCircle, Cpu, PlayCircle, PackageCheck, Sparkles } from 'lucide-react';
import { AIExplanationModal } from './AIExplanationModal';

interface RepoHeaderProps {
  analysis: AnalysisResult;
  selectedFile: string | null;
  activeView: 'graph' | 'tracer' | 'unbox';
  onViewChange: (view: 'graph' | 'tracer' | 'unbox') => void;
  onClearRepo: () => void;
}

export function RepoHeader({
  analysis,
  selectedFile,
  activeView,
  onViewChange,
  onClearRepo
}: RepoHeaderProps) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const topCore = analysis.rankedFiles[0];

  return (
    <div className="border-b border-brand-border bg-brand-surface/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Repo Identity & Breadcrumbs */}
      <div className="flex items-center gap-4">
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

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-brand-dark p-0.5 border border-brand-border">
          <button
            onClick={() => onViewChange('graph')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              activeView === 'graph'
                ? 'bg-brand-surface text-brand-cyan font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={13} />
            <span>Architecture Graph</span>
          </button>
          <button
            onClick={() => onViewChange('tracer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              activeView === 'tracer'
                ? 'bg-brand-surface text-brand-cyan font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle size={13} />
            <span>Execution Stepper</span>
          </button>
          <button
            onClick={() => onViewChange('unbox')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              activeView === 'unbox'
                ? 'bg-brand-surface text-brand-cyan font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackageCheck size={13} />
            <span>Unbox Mode (Build It)</span>
          </button>
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

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-colors ml-1"
          title="Configure AI Mentor (WebGPU / Gemini / Groq / Heuristics)"
        >
          <Sparkles size={12} />
          <span>AI Mentor</span>
        </button>
      </div>

      <AIExplanationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        requestContext={{
          mode: 'architecture-explainer',
          code: `// Repository: ${analysis.owner}/${analysis.repo}\n// Files count: ${analysis.graph.nodes.length}\n// Edges count: ${analysis.graph.edges.length}`,
          language: 'markdown',
          filePath: `${analysis.owner}/${analysis.repo}`
        }}
      />
    </div>
  );
}
