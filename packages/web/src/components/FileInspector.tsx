import React, { useState } from 'react';
import { RankedFileNode, CoreGraphEdge } from '@gitxray/core';
import { X, Code, GitFork, Copy, Check, FileText, Compass } from 'lucide-react';

interface FileInspectorProps {
  filePath: string;
  sourceCode: string;
  fileRank?: RankedFileNode;
  edges: CoreGraphEdge[];
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}

export function FileInspector({
  filePath,
  sourceCode,
  fileRank,
  edges,
  onSelectNode,
  onClose
}: FileInspectorProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'deps'>('code');
  const [copied, setCopied] = useState(false);

  // Inbound dependencies: edges pointing to filePath (filePath is imported by source)
  const inboundFiles = edges
    .filter((e) => e.target === filePath)
    .map((e) => e.source);

  // Outbound dependencies: edges originating from filePath (filePath imports target)
  const outboundFiles = edges
    .filter((e) => e.source === filePath)
    .map((e) => e.target);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = sourceCode ? sourceCode.split('\n') : [];
  const fileName = filePath.split('/').pop() || filePath;

  return (
    <div className="w-full md:w-[480px] lg:w-[540px] h-full flex flex-col bg-brand-surface border-l border-brand-border z-20 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-brand-border flex items-start justify-between bg-brand-elevated/40">
        <div className="space-y-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-brand-cyan shrink-0" />
            <h3 className="font-mono text-sm font-semibold text-slate-100 truncate" title={filePath}>
              {fileName}
            </h3>
            {fileRank && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                  !fileRank.isBoilerplate && fileRank.score > 0.05
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {!fileRank.isBoilerplate && fileRank.score > 0.05 ? 'Core Kernel' : 'Module'}
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-slate-400 truncate" title={filePath}>
            {filePath}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Metrics Row */}
      {fileRank && (
        <div className="grid grid-cols-4 gap-2 p-3 border-b border-brand-border bg-brand-dark/40 text-center text-xs">
          <div className="bg-slate-900/60 p-2 rounded border border-brand-border/60">
            <div className="text-slate-500 text-[10px]">PAGERANK</div>
            <div className="font-mono font-semibold text-brand-cyan">
              {(fileRank.metrics.pageRank * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-brand-border/60">
            <div className="text-slate-500 text-[10px]">CENTRALITY</div>
            <div className="font-mono font-semibold text-emerald-400">
              {(fileRank.metrics.betweenness * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-brand-border/60">
            <div className="text-slate-500 text-[10px]">DEPENDENTS</div>
            <div className="font-mono font-semibold text-amber-400">
              {inboundFiles.length}
            </div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-brand-border/60">
            <div className="text-slate-500 text-[10px]">STAGE</div>
            <div className="font-mono font-semibold text-slate-200">
              S{fileRank.stage ?? 0}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-border bg-slate-950/40 text-xs">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'code'
              ? 'border-brand-cyan text-brand-cyan bg-brand-elevated/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code size={14} />
          <span>Source Code</span>
          <span className="text-[10px] text-slate-500 font-mono">({codeLines.length}L)</span>
        </button>
        <button
          onClick={() => setActiveTab('deps')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'deps'
              ? 'border-brand-cyan text-brand-cyan bg-brand-elevated/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitFork size={14} />
          <span>Dependencies</span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({inboundFiles.length + outboundFiles.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs">
        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1">
              <span>{filePath}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-brand-dark rounded-lg border border-brand-border p-3 overflow-x-auto leading-relaxed">
              <table className="w-full border-collapse">
                <tbody>
                  {codeLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="text-slate-600 select-none pr-4 text-right w-8 text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="text-slate-300 whitespace-pre font-mono">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deps' && (
          <div className="space-y-6">
            {/* Inbound (Dependents) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Compass size={14} className="text-brand-cyan" />
                <span>Imported By (Blast Radius Dependents)</span>
                <span className="text-slate-500 font-mono">({inboundFiles.length})</span>
              </div>
              {inboundFiles.length === 0 ? (
                <div className="text-slate-500 text-xs italic pl-2">
                  No incoming dependencies (leaf or entrypoint module).
                </div>
              ) : (
                <div className="space-y-1.5">
                  {inboundFiles.map((dep) => (
                    <button
                      key={dep}
                      onClick={() => onSelectNode(dep)}
                      className="w-full text-left p-2 rounded bg-brand-dark hover:bg-slate-900 border border-brand-border hover:border-brand-cyan/50 text-slate-300 hover:text-brand-cyan text-xs font-mono transition-colors truncate block"
                    >
                      ← {dep}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Outbound (Imports) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <GitFork size={14} className="text-emerald-400" />
                <span>Imports (Upstream Dependencies)</span>
                <span className="text-slate-500 font-mono">({outboundFiles.length})</span>
              </div>
              {outboundFiles.length === 0 ? (
                <div className="text-slate-500 text-xs italic pl-2">
                  No internal module imports (foundation file).
                </div>
              ) : (
                <div className="space-y-1.5">
                  {outboundFiles.map((dep) => (
                    <button
                      key={dep}
                      onClick={() => onSelectNode(dep)}
                      className="w-full text-left p-2 rounded bg-brand-dark hover:bg-slate-900 border border-brand-border hover:border-emerald-400/50 text-slate-300 hover:text-emerald-400 text-xs font-mono transition-colors truncate block"
                    >
                      → {dep}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
