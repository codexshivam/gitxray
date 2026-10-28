import React, { useState, useMemo } from 'react';
import {
  ClaudeMdExporter,
  AgentsSkillsExporter,
  SvgBadgeGenerator,
  CoreGraphOutput,
  RankingResult
} from '@gitxray/core';
import { Copy, Check, Download, FileText, Shield, Sparkles, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  repo: string;
  graph: CoreGraphOutput;
  ranking: RankingResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  repo,
  graph,
  ranking
}) => {
  const [activeTab, setActiveTab] = useState<'claude' | 'skills' | 'badge'>('claude');
  const [copied, setCopied] = useState(false);

  const [owner, repoName] = repo.includes('/') ? repo.split('/') : ['unknown', repo];

  const claudeContent = useMemo(() => {
    return ClaudeMdExporter.export(graph, ranking, { repoName: repo });
  }, [graph, ranking, repo]);

  const skillsContent = useMemo(() => {
    return AgentsSkillsExporter.export(graph, ranking, { repoName: repo });
  }, [graph, ranking, repo]);

  const topCore = ranking.rankedFiles.find((f) => !f.isBoilerplate)?.id || 'core';

  const badgeSvg = useMemo(() => {
    return SvgBadgeGenerator.generateBadge({
      owner,
      repo: repoName,
      fileCount: graph.nodes.length,
      stageCount: ranking.stages.length,
      coreKernel: topCore
    });
  }, [owner, repoName, graph.nodes.length, ranking.stages.length, topCore]);

  const badgeMarkdown = `[![GitXray Architecture](https://gitxray.dev/badge/${repo}.svg)](https://gitxray.dev/${repo})`;

  const activeContent = activeTab === 'claude' ? claudeContent : activeTab === 'skills' ? skillsContent : badgeMarkdown;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'claude'
        ? 'CLAUDE.md'
        : activeTab === 'skills'
        ? 'skills.md'
        : `${repoName}-badge.svg`;

    const blob = new Blob(
      [activeTab === 'badge' ? badgeSvg : activeContent],
      { type: activeTab === 'badge' ? 'image/svg+xml' : 'text/markdown;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-xl">📦</span>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                Export Architecture Context & Badges
              </h2>
              <p className="text-xs text-slate-400">
                Turn your codebase graph into AI agent instructions and repository badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('claude')}
            className={`flex items-center gap-2 pb-3 px-3 font-medium border-b-2 transition-all ${
              activeTab === 'claude'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={14} />
            <span>CLAUDE.md</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 pb-3 px-3 font-medium border-b-2 transition-all ${
              activeTab === 'skills'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>.agents/skills.md</span>
          </button>
          <button
            onClick={() => setActiveTab('badge')}
            className={`flex items-center gap-2 pb-3 px-3 font-medium border-b-2 transition-all ${
              activeTab === 'badge'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={14} />
            <span>SVG Architecture Badge</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4">
          {activeTab === 'badge' ? (
            <div className="space-y-4">
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-4">
                <span className="text-xs text-slate-400 font-sans">Live Badge Preview:</span>
                <div
                  className="shadow-lg"
                  dangerouslySetInnerHTML={{ __html: badgeSvg }}
                />
              </div>

              <div>
                <label className="text-[11px] font-sans font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Markdown for your README.md:
                </label>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 break-all select-all">
                  {badgeMarkdown}
                </div>
              </div>
            </div>
          ) : (
            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {activeContent}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {activeTab === 'claude'
              ? 'Place CLAUDE.md at the repo root for Claude Code and Antigravity'
              : activeTab === 'skills'
              ? 'Place in .agents/skills.md for agent skills routing'
              : 'Add to README.md to show live architecture stats'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow"
            >
              <Download size={14} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
