import React, { useState, useEffect } from 'react';
import {
  UnboxCourse,
  Milestone,
  DeterministicVerifier,
  CheckEvaluationResult,
  UnboxGenerator,
  RankingResult
} from '@gitxray/core';
import { CURATED_COURSES } from '@gitxray/vault';
import {
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Lightbulb,
  Eye,
  AlertTriangle,
  Terminal,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AIExplanationModal } from './AIExplanationModal';

interface UnboxModeProps {
  repo: string;
  files: Map<string, string> | Record<string, string>;
  rankingResult?: RankingResult;
}

export function UnboxMode({ repo, files, rankingResult }: UnboxModeProps) {
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

  // Load curated course if available, or generate from ranking
  const course: UnboxCourse = React.useMemo(() => {
    const key = repo.toLowerCase();
    if (CURATED_COURSES[key]) {
      return CURATED_COURSES[key];
    }
    if (rankingResult) {
      return UnboxGenerator.generateCourse(repo, filesRecord, rankingResult);
    }
    // Fallback minimal course
    return {
      repo,
      title: `Build ${repo.split('/').pop()} from Scratch`,
      language: 'JavaScript',
      isReviewed: false,
      stage0Summary: 'Foundational architectural loop.',
      milestones: [
        {
          id: 'fallback-0',
          title: 'Stage 0: Core Architecture Loop',
          stage: 0,
          description: 'Implement the entrypoint class and core run method.',
          targetFile: 'index.js',
          starterCode: 'export class Engine { run() { return false; } }',
          referenceSolution: 'export class Engine { run() { return true; } }',
          check: {
            type: 'composite',
            expectedSymbols: ['Engine'],
            testSnippet: 'const e = new Engine(); if (!e.run()) throw new Error("Expected run() to return true");'
          },
          hints: ['Return true from run()']
        }
      ]
    };
  }, [repo, filesRecord, rankingResult]);

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [userCode, setUserCode] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<CheckEvaluationResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const activeMilestone: Milestone = course.milestones[activeMilestoneIndex] || course.milestones[0];

  // Initialize or reset code when active milestone changes
  useEffect(() => {
    if (activeMilestone) {
      setUserCode(activeMilestone.starterCode);
      setVerificationResult(null);
      setShowHints(false);
      setShowSolution(false);
    }
  }, [activeMilestoneIndex, activeMilestone]);

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + '    ' + val.substring(end);
      setUserCode(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Run hard invariant check
  const handleRunCheck = () => {
    const res = DeterministicVerifier.evaluateSubmission(
      activeMilestone,
      userCode,
      course.language
    );
    setVerificationResult(res);

    if (res.passed) {
      setCompletedMilestones((prev) => {
        const next = new Set(prev);
        next.add(activeMilestone.id);
        return next;
      });
    }
  };

  const handleResetStarter = () => {
    setUserCode(activeMilestone.starterCode);
    setVerificationResult(null);
  };

  const handleRevealSolution = () => {
    setUserCode(activeMilestone.referenceSolution);
    setShowSolution(true);
  };

  const isCurrentCompleted = completedMilestones.has(activeMilestone.id);
  const codeLines = userCode.split('\n');

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-dark text-slate-100 overflow-hidden select-none">
      {/* Top Course Summary Banner */}
      <div className="border-b border-brand-border bg-brand-surface/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100">{course.title}</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                course.isReviewed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {course.isReviewed ? '✓ Reviewed Course' : '⚡ Auto-Generated Course'}
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
            {course.stage0Summary}
          </span>
        </div>

        {/* Milestone Progress Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Progress:</span>
          <span className="text-brand-cyan font-bold">
            {completedMilestones.size} / {course.milestones.length}
          </span>
          <span>Stages</span>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Milestones Navigation */}
        <aside className="w-64 sm:w-72 border-r border-brand-border bg-brand-surface/60 flex flex-col overflow-hidden">
          <div className="h-10 border-b border-brand-border px-3 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Course Milestones
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {course.milestones.length} Steps
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-xs">
            {course.milestones.map((m, idx) => {
              const isSelected = idx === activeMilestoneIndex;
              const isDone = completedMilestones.has(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-brand-cyan/15 text-slate-100 border-brand-cyan/50 shadow'
                      : isDone
                      ? 'bg-emerald-500/5 text-slate-300 border-emerald-500/20 hover:bg-slate-900/60'
                      : 'bg-brand-dark/40 text-slate-400 border-brand-border hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs truncate">{m.title}</span>
                    {isDone ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={14} className="text-slate-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate pt-1">
                    Target: {m.targetFile}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Code Editor & Invariant Runner */}
        <div className="flex-1 flex flex-col bg-brand-dark overflow-hidden">
          {/* Milestone Details Bar */}
          <div className="p-4 bg-brand-surface/40 border-b border-brand-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-brand-cyan uppercase">
                  Stage {activeMilestone.stage}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">
                  Target File: <code className="text-slate-200">{activeMilestone.targetFile}</code>
                </span>
              </div>

              {isCurrentCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 size={12} />
                  <span>Verified Complete</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeMilestone.description}
            </p>
          </div>

          {/* Interactive Code Editor */}
          <div className="flex-1 relative flex overflow-hidden font-mono text-xs">
            {/* Line numbers column */}
            <div className="w-10 bg-brand-surface/20 border-r border-brand-border/40 py-3 pr-2 text-right text-slate-600 select-none font-mono text-[11px]">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea Code Input */}
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-xs resize-none focus:outline-none leading-5 selection:bg-brand-cyan/30"
              placeholder="// Write your implementation here..."
            />
          </div>

          {/* Editor Action Buttons Bar */}
          <div className="p-3 bg-brand-surface/70 border-t border-brand-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCheck}
                className="px-4 py-2 bg-gradient-to-r from-brand-cyan to-cyan-500 hover:from-cyan-400 hover:to-brand-cyan text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)]"
              >
                <ShieldCheck size={16} />
                <span>Run Hard Invariant Check</span>
              </button>

              <button
                onClick={handleResetStarter}
                className="px-3 py-2 bg-brand-dark hover:bg-slate-850 border border-brand-border rounded text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                title="Reset code"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowHints((p) => !p)}
                className="px-3 py-2 bg-brand-dark hover:bg-slate-850 border border-brand-border rounded text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Lightbulb size={13} />
                <span>{showHints ? 'Hide Hints' : 'Hints'}</span>
              </button>

              <button
                onClick={handleRevealSolution}
                className="px-3 py-2 bg-brand-dark hover:bg-slate-850 border border-brand-border rounded text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <Eye size={13} />
                <span>Solution</span>
              </button>

              <button
                onClick={() => setIsAIModalOpen(true)}
                className="px-3 py-2 bg-brand-dark hover:bg-slate-850 border border-brand-border rounded text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                title="Ask Socratic AI Mentor for guided hints and architectural invariants"
              >
                <Sparkles size={13} className="text-cyan-400" />
                <span>AI Mentor</span>
              </button>
            </div>

            {/* Next Milestone Button */}
            {isCurrentCompleted && activeMilestoneIndex < course.milestones.length - 1 && (
              <button
                onClick={() => setActiveMilestoneIndex((p) => p + 1)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.35)]"
              >
                <span>Next Milestone</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Hints Drawer */}
          {showHints && activeMilestone.hints.length > 0 && (
            <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 text-xs text-amber-300 font-mono space-y-1">
              <div className="font-semibold flex items-center gap-1 text-amber-400">
                <Lightbulb size={13} />
                <span>Architectural Hints:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-300 text-[11px]">
                {activeMilestone.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification Console */}
          {verificationResult && (
            <div
              className={`p-3 border-t font-mono text-xs flex items-start gap-2.5 ${
                verificationResult.passed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <Terminal size={16} className="shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold">
                  {verificationResult.passed
                    ? '✓ PASS: Deterministic Invariants Validated'
                    : '✘ FAIL: Hard Invariant Violation (Exit Code 1)'}
                </div>
                <div className="text-[11px] opacity-90">{verificationResult.feedback}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AIExplanationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        requestContext={{
          mode: 'socratic-hint',
          code: userCode,
          language: course.language.toLowerCase(),
          filePath: activeMilestone.targetFile,
          milestoneTitle: activeMilestone.title,
          milestoneGoal: activeMilestone.description,
          userSubmission: userCode,
          errorFeedback: verificationResult && !verificationResult.passed ? verificationResult.feedback : undefined
        }}
      />
    </div>
  );
}
