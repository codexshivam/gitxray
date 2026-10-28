import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { RepoHeader } from './components/RepoHeader';
import { RankingsSidebar } from './components/RankingsSidebar';
import { GraphCanvas } from './components/GraphCanvas';
import { FileInspector } from './components/FileInspector';
import { ExecutionStepper } from './components/ExecutionStepper';
import { UnboxMode } from './components/UnboxMode';
import { StatusOverlay } from './components/StatusOverlay';
import { useRepoAnalysis } from './hooks/useRepoAnalysis';
import {
  getRepoFromBrowserUrl,
  setBrowserRepo,
  clearBrowserRepo
} from './utils/url';

export function App() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gitxray_github_token') || '';
    }
    return '';
  });

  const [activeRepo, setActiveRepo] = useState<{
    owner: string;
    repo: string;
    ref?: string;
  } | null>(() => getRepoFromBrowserUrl());

  const [activeView, setActiveView] = useState<'graph' | 'tracer' | 'unbox'>('graph');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [maxNodes, setMaxNodes] = useState(20);

  // Sync token to localStorage
  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('gitxray_github_token', newToken);
      } else {
        localStorage.removeItem('gitxray_github_token');
      }
    }
  };

  // Run Core Repo Analysis Pipeline
  const { phase, statusMessage, result, error, retry } = useRepoAnalysis({
    owner: activeRepo?.owner,
    repo: activeRepo?.repo,
    ref: activeRepo?.ref,
    token
  });

  // Default selection to top-ranked core kernel when result loads
  useEffect(() => {
    if (result && result.rankedFiles.length > 0) {
      setSelectedFile(result.rankedFiles[0].id);
    } else {
      setSelectedFile(null);
    }
  }, [result]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = getRepoFromBrowserUrl();
      setActiveRepo(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Search/Select a new repository
  const handleSelectRepo = useCallback(
    (owner: string, repo: string, ref?: string) => {
      setActiveRepo({ owner, repo, ref });
      setBrowserRepo(owner, repo, ref);
    },
    []
  );

  // Clear repo and return to landing hero
  const handleClearRepo = useCallback(() => {
    setActiveRepo(null);
    setSelectedFile(null);
    clearBrowserRepo();
  }, []);

  const selectedFileRank = result?.rankedFiles.find((rf) => rf.id === selectedFile);
  const selectedSourceCode = selectedFile && result?.files.get(selectedFile) ? result.files.get(selectedFile)! : '';

  return (
    <div className="flex flex-col h-screen w-screen bg-brand-dark text-slate-100 overflow-hidden select-none">
      {/* Top Navbar */}
      <Navbar
        currentRepo={activeRepo ? `${activeRepo.owner}/${activeRepo.repo}` : ''}
        onSearchRepo={handleSelectRepo}
        token={token}
        onTokenChange={handleTokenChange}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Status Overlay (Loading / Error) */}
        <StatusOverlay
          phase={phase}
          statusMessage={statusMessage}
          error={error}
          onRetry={retry}
          onSetToken={handleTokenChange}
          onSelectSample={handleSelectRepo}
        />

        {/* If no repo selected, show Landing Hero */}
        {!activeRepo && <LandingHero onSelectRepo={handleSelectRepo} />}

        {/* If repo selected and ready, show interactive workspace */}
        {activeRepo && result && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Repo Header & Metrics */}
            <RepoHeader
              analysis={result}
              selectedFile={selectedFile}
              activeView={activeView}
              onViewChange={setActiveView}
              onClearRepo={handleClearRepo}
            />

            {/* View 1: Architecture Graph View */}
            {activeView === 'graph' && (
              <div className="flex-1 flex relative overflow-hidden">
                {/* Left Rankings Sidebar */}
                <RankingsSidebar
                  rankedFiles={result.rankedFiles}
                  selectedFile={selectedFile}
                  onSelectFile={(path) => setSelectedFile(path)}
                  isOpen={isSidebarOpen}
                  onToggle={() => setIsSidebarOpen((prev) => !prev)}
                />

                {/* Center Graph Canvas */}
                <div className="flex-1 relative flex flex-col overflow-hidden">
                  <GraphCanvas
                    nodes={result.graph.nodes}
                    edges={result.graph.edges}
                    rankedFiles={result.rankedFiles}
                    selectedNodeId={selectedFile}
                    onSelectNode={(nodeId) => setSelectedFile(nodeId)}
                    maxNodes={maxNodes}
                    onMaxNodesChange={setMaxNodes}
                  />
                </div>

                {/* Right File & Source Code Inspector */}
                {selectedFile && (
                  <FileInspector
                    filePath={selectedFile}
                    sourceCode={selectedSourceCode}
                    fileRank={selectedFileRank}
                    edges={result.graph.edges}
                    onSelectNode={(nodeId) => setSelectedFile(nodeId)}
                    onClose={() => setSelectedFile(null)}
                  />
                )}
              </div>
            )}

            {/* View 2: Live Execution Stepper (Python Tutor Mode) */}
            {activeView === 'tracer' && (
              <div className="flex-1 flex relative overflow-hidden">
                <ExecutionStepper
                  files={result.files}
                  activeFile={selectedFile || undefined}
                  onSelectFile={(f) => setSelectedFile(f)}
                />
              </div>
            )}

            {/* View 3: Unbox Mode (Build It From Scratch) */}
            {activeView === 'unbox' && (
              <div className="flex-1 flex relative overflow-hidden">
                <UnboxMode
                  repo={`${result.owner}/${result.repo}`}
                  files={result.files}
                  rankingResult={{
                    rankedFiles: result.rankedFiles,
                    stages: result.stages,
                    gravityWells: result.rankedFiles.filter((rf) => !rf.isBoilerplate).slice(0, 3)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
