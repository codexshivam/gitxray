export type SymbolKind = 'function' | 'class' | 'interface' | 'variable' | 'type';

export interface SymbolDefinition {
  name: string;
  kind: SymbolKind;
  line: number;
}

export interface ImportDeclaration {
  source: string;
  specifiers: string[];
  line: number;
}

export interface CallSite {
  callee: string;
  line: number;
}

export interface FileParseResult {
  filePath: string;
  language: string;
  lineCount: number;
  imports: ImportDeclaration[];
  symbols: SymbolDefinition[];
  callSites: CallSite[];
  hasSyntaxErrors: boolean;
}

export interface RepoTreeItem {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
  sha: string;
}

export interface IngestionOptions {
  token?: string;
  maxFiles?: number;
  maxFileSizeKb?: number;
}

export interface IngestionResult {
  owner: string;
  repo: string;
  ref: string;
  files: Map<string, string>;
  totalBlobs: number;
  ingestedBlobs: number;
  rateLimited: boolean;
}

export interface LanguageAdapter {
  name: string;
  extensions: string[];
  parse(filePath: string, content: string): FileParseResult;
}

export interface CoreGraphNode {
  id: string;
  language: string;
  lineCount: number;
  symbols: SymbolDefinition[];
}

export interface CoreGraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface CoreGraphOutput {
  nodes: CoreGraphNode[];
  edges: CoreGraphEdge[];
}

export interface CentralityMetrics {
  pageRank: number;
  betweenness: number;
  inDegree: number;
  outDegree: number;
}

export interface RankedFileNode {
  id: string;
  language: string;
  lineCount: number;
  isBoilerplate: boolean;
  score: number;
  metrics: CentralityMetrics;
  stage: number;
}

export interface RankingResult {
  rankedFiles: RankedFileNode[];
  stages: string[][];
  gravityWells: RankedFileNode[];
}

export interface SymbolGraphNode {
  id: string; // e.g. "app.py#process_data"
  file: string;
  name: string;
  kind: SymbolKind;
  line: number;
}

export interface SymbolGraphEdge {
  source: string;
  target: string;
}

export interface SymbolGraphOutput {
  nodes: SymbolGraphNode[];
  edges: SymbolGraphEdge[];
}
