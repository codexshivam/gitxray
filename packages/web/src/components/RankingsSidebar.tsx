import React, { useState } from 'react';
import { RankedFileNode } from '@gitxray/core';
import { Layers, ChevronRight } from 'lucide-react';

interface RankingsSidebarProps {
  rankedFiles: RankedFileNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function RankingsSidebar({
  rankedFiles,
  selectedFile,
  onSelectFile,
  isOpen,
  onToggle
}: RankingsSidebarProps) {
  const [filter, setFilter] = useState('');

  const filtered = rankedFiles.filter((rf) =>
    rf.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <aside
      className={`border-r border-brand-border bg-brand-surface/90 backdrop-blur-md flex flex-col transition-all duration-300 z-10 ${
        isOpen ? 'w-64 sm:w-72' : 'w-10'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-10 border-b border-brand-border px-3 flex items-center justify-between">
        {isOpen ? (
          <>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Layers size={14} className="text-brand-cyan" />
              <span>Ranked Hierarchy</span>
              <span className="text-[10px] text-slate-500 font-mono">({rankedFiles.length})</span>
            </div>
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
              title="Collapse Sidebar"
            >
              <ChevronRight size={14} className="rotate-180" />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-full flex justify-center text-slate-400 hover:text-slate-200 py-1"
            title="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Quick Filter */}
          <div className="p-2 border-b border-brand-border">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter files..."
              className="w-full bg-brand-dark border border-brand-border rounded px-2.5 py-1 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* List of Ranked Files */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
            {filtered.map((rf, idx) => {
              const fileName = rf.id.split('/').pop() || rf.id;
              const isSelected = rf.id === selectedFile;
              const isTopCore = !rf.isBoilerplate && idx < 3;

              return (
                <button
                  key={rf.id}
                  onClick={() => onSelectFile(rf.id)}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between gap-2 transition-all ${
                    isSelected
                      ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 font-semibold'
                      : 'hover:bg-slate-900/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="truncate flex-1">
                    <div className="truncate text-xs">{fileName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{rf.id}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isTopCore && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded font-sans font-bold">
                        CORE
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">
                      #{idx + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}
