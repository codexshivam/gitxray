import React, { useState } from 'react';
import { Sparkles, Key, Github, Search, Check, ExternalLink } from 'lucide-react';
import { parseRepoInput } from '../utils/url';

interface NavbarProps {
  currentRepo?: string;
  onSearchRepo: (owner: string, repo: string, ref?: string) => void;
  token?: string;
  onTokenChange: (token: string) => void;
}

export function Navbar({ currentRepo, onSearchRepo, token = '', onTokenChange }: NavbarProps) {
  const [inputValue, setInputValue] = useState(currentRepo || '');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tempToken, setTempToken] = useState(token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepoInput(inputValue);
    if (parsed) {
      onSearchRepo(parsed.owner, parsed.repo, parsed.ref);
    }
  };

  const handleSaveToken = () => {
    onTokenChange(tempToken.trim());
    setShowTokenModal(false);
  };

  return (
    <header className="h-14 border-b border-brand-border bg-brand-surface/90 backdrop-blur-md px-4 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-emerald flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] transition-shadow">
            <Sparkles size={18} className="text-slate-950 font-bold" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              GitXray
            </span>
            <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded border border-brand-cyan/20 hidden sm:inline-block">
              gitxray.dev
            </span>
          </div>
        </a>
      </div>

      {/* Center Search Pill */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-xl flex items-center">
        <div className="relative w-full flex items-center rounded-lg bg-brand-dark border border-brand-border focus-within:border-brand-cyan/70 focus-within:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all">
          <div className="pl-3 pr-2 text-slate-500 flex items-center select-none text-xs font-mono hidden sm:flex">
            gitxray.dev/
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="owner/repo (e.g. pallets/flask)"
            className="w-full bg-transparent py-1.5 px-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="m-1 px-3 py-1 bg-gradient-to-r from-brand-cyan to-cyan-500 hover:from-cyan-400 hover:to-brand-cyan text-slate-950 text-xs font-semibold rounded flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(6,182,212,0.3)] shrink-0"
          >
            <Sparkles size={12} />
            <span>X-Ray</span>
          </button>
        </div>
      </form>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Token Config Button */}
        <button
          onClick={() => setShowTokenModal(true)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition-colors ${
            token
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-brand-dark border-brand-border text-slate-400 hover:text-slate-200'
          }`}
          title={token ? 'GitHub token configured' : 'Add GitHub token to bypass rate limit'}
        >
          <Key size={13} />
          <span className="hidden md:inline">{token ? 'Token Active' : 'API Token'}</span>
        </button>

        {/* GitHub Star */}
        <a
          href="https://github.com/codexshivam/gitxray"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-brand-dark hover:bg-slate-850 border border-brand-border text-slate-300 hover:text-slate-100 transition-colors"
        >
          <Github size={13} />
          <span className="hidden md:inline">GitHub</span>
          <ExternalLink size={10} className="text-slate-500" />
        </a>
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Key size={16} className="text-brand-cyan" />
                GitHub Personal Access Token (Optional)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                GitHub enforces a 60 req/hr unauthenticated rate limit. Supplying a token increases the limit to 5,000 req/hr.
                Your token is stored strictly in your browser's <code className="text-slate-300">localStorage</code> and never sent to any server.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Personal Access Token (classic or fine-grained with public repo read)
              </label>
              <input
                type="password"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full bg-brand-dark border border-brand-border rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTokenModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveToken}
                className="px-4 py-1.5 bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
              >
                <Check size={14} />
                <span>Save Token</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
