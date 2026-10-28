import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { ARCHITECTURE_VAULT } from '@gitxray/vault';
import { parseRepoInput } from '../utils/url';

interface LandingHeroProps {
  onSelectRepo: (owner: string, repo: string) => void;
}

export function LandingHero({ onSelectRepo }: LandingHeroProps) {
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepoInput(urlInput);
    if (parsed) {
      onSelectRepo(parsed.owner, parsed.repo);
    }
  };

  const showcaseRepos = ARCHITECTURE_VAULT.slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark flex flex-col items-center justify-start p-6 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Hero Headline */}
      <div className="text-center space-y-4 max-w-3xl pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-xs font-mono text-brand-cyan shadow-sm">
          <Sparkles size={13} className="text-brand-cyan" />
          <span>Zero-Install Browser-Native Engine</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Decompile any GitHub repo into a{' '}
          <span className="bg-gradient-to-r from-brand-cyan via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            ranked architecture graph
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Replace <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">github.com</code> with{' '}
          <code className="text-brand-cyan bg-cyan-950/40 border border-brand-cyan/30 px-1.5 py-0.5 rounded font-mono">
            gitxray.dev
          </code>{' '}
          to instantly isolate core domain logic from boilerplate, visualize call graphs, and trace dependencies.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="flex items-center rounded-xl bg-brand-surface border border-brand-border hover:border-brand-cyan/60 focus-within:border-brand-cyan focus-within:shadow-[0_0_20px_rgba(6,182,212,0.25)] p-1.5 transition-all">
            <span className="pl-3 pr-1 text-slate-500 font-mono text-xs hidden sm:inline">
              gitxray.dev/
            </span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. pallets/flask or full GitHub URL"
              className="w-full bg-transparent px-2 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] shrink-0"
            >
              <span>X-Ray</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* Showcase Vault Section */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-200">Pre-Decompiled Architecture Vault</h2>
            <p className="text-xs text-slate-500">
              Select an iconic repository to explore its core gravity wells and dependency DAG
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcaseRepos.map((item) => (
            <div
              key={item.repo}
              onClick={() => {
                const [owner, repo] = item.repo.split('/');
                onSelectRepo(owner, repo);
              }}
              className="p-4 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-cyan/50 hover:bg-brand-elevated/40 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-dark text-slate-400 border border-brand-border">
                    {item.language}
                  </span>
                  <span className="text-xs font-mono font-medium text-amber-400">
                    ★ {item.stars}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-brand-cyan transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{item.repo}</p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.stage0Summary}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-mono text-brand-cyan border-t border-brand-border/60 mt-3">
                <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  Core: {item.gravityWell.split('/').pop()}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Value Props */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-border/70 text-slate-300">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-cyan h-fit">
            <Cpu size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Core Gravity Wells
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Separates the 5% core domain logic from 95% boilerplate using PageRank and betweenness centrality.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-emerald-400 h-fit">
            <Layers size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Topological Stages
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collapses cyclic dependency imports into clean topological stages so you can learn repositories in order.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-amber-400 h-fit">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Zero Server & API Keys
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% browser-native execution. No backend telemetry, no server credentials, completely zero cloud footprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
