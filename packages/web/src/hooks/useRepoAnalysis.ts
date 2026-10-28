import { useState, useEffect, useCallback } from 'react';
import {
  CodebaseParser,
  CodeGraph,
  RankingEngine,
  GitHubIngestion,
  FileParseResult,
  RankedFileNode,
  CoreGraphNode,
  CoreGraphEdge
} from '@gitxray/core';
import { SAMPLE_REPOSITORIES } from '../utils/samples';

export type PipelinePhase = 'idle' | 'fetching' | 'parsing' | 'ranking' | 'ready' | 'error';

export interface AnalysisResult {
  owner: string;
  repo: string;
  ref?: string;
  files: Map<string, string>;
  graph: {
    nodes: CoreGraphNode[];
    edges: CoreGraphEdge[];
  };
  rankedFiles: RankedFileNode[];
  stages: string[][];
  executionDurationMs: number;
  isCachedSnapshot?: boolean;
}

export interface UseRepoAnalysisOptions {
  owner?: string;
  repo?: string;
  ref?: string;
  token?: string;
}

export function useRepoAnalysis({ owner, repo, ref, token }: UseRepoAnalysisOptions) {
  const [phase, setPhase] = useState<PipelinePhase>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<{ message: string; isRateLimit?: boolean } | null>(null);

  const analyze = useCallback(
    async (targetOwner: string, targetRepo: string, targetRef?: string) => {
      if (!targetOwner || !targetRepo) {
        setPhase('idle');
        setResult(null);
        setError(null);
        return;
      }

      const startTime = performance.now();
      setPhase('fetching');
      setError(null);
      setStatusMessage(`Fetching repository tree for ${targetOwner}/${targetRepo}...`);

      const repoKey = `${targetOwner}/${targetRepo}`.toLowerCase();
      let files = new Map<string, string>();
      let isCached = false;

      // 1. Fetch via GitHubIngestion or fallback to local sample
      try {
        const ingestion = new GitHubIngestion();
        const ingestResult = await ingestion.fetchRepo(targetOwner, targetRepo, targetRef, {
          token: token || undefined,
          maxFiles: 500
        });

        if (ingestResult.rateLimited && ingestResult.files.size === 0) {
          throw new Error('GitHub unauthenticated API rate limit (403) reached.');
        }

        if (ingestResult.files.size > 0) {
          files = ingestResult.files;
        } else if (SAMPLE_REPOSITORIES[repoKey]) {
          const sample = SAMPLE_REPOSITORIES[repoKey];
          Object.entries(sample.files).forEach(([p, content]) => files.set(p, content));
          isCached = true;
        } else {
          throw new Error('No supported source files found in this repository.');
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Failed to fetch repository';
        const is403 = errMsg.includes('403') || errMsg.includes('rate limit');

        // Check if sample fallback is available
        if (SAMPLE_REPOSITORIES[repoKey]) {
          const sample = SAMPLE_REPOSITORIES[repoKey];
          Object.entries(sample.files).forEach(([p, content]) => files.set(p, content));
          isCached = true;
          setStatusMessage(`Loaded architectural snapshot for ${targetOwner}/${targetRepo}.`);
        } else {
          setPhase('error');
          setError({
            message: errMsg,
            isRateLimit: is403
          });
          return;
        }
      }

      // 2. Parse Codebase
      setPhase('parsing');
      setStatusMessage(`Parsing AST and extracting symbols across ${files.size} files...`);

      const parser = new CodebaseParser();
      const parsedMap = new Map<string, FileParseResult>();

      for (const [filePath, content] of files.entries()) {
        const parsed = parser.parseFile(filePath, content);
        if (parsed) {
          parsedMap.set(filePath, parsed);
        }
      }

      // 3. Build Graph and Centrality
      setPhase('ranking');
      setStatusMessage('Building dependency graph and calculating PageRank & betweenness centrality...');

      const codeGraph = CodeGraph.fromParsedFiles(parsedMap);
      const rankingResult = RankingEngine.rank(codeGraph);
      const fileGraphOutput = codeGraph.toFileGraphOutput();

      const endTime = performance.now();
      const durationMs = Math.round(endTime - startTime);

      setResult({
        owner: targetOwner,
        repo: targetRepo,
        ref: targetRef,
        files,
        graph: fileGraphOutput,
        rankedFiles: rankingResult.rankedFiles,
        stages: rankingResult.stages,
        executionDurationMs: durationMs,
        isCachedSnapshot: isCached
      });

      setPhase('ready');
      setStatusMessage('');
    },
    [token]
  );

  useEffect(() => {
    if (owner && repo) {
      analyze(owner, repo, ref);
    } else {
      setPhase('idle');
      setResult(null);
      setError(null);
    }
  }, [owner, repo, ref, analyze]);

  return {
    phase,
    statusMessage,
    result,
    error,
    retry: () => owner && repo && analyze(owner, repo, ref)
  };
}
