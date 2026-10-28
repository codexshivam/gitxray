export type AIProviderType = 'template' | 'webgpu' | 'gemini' | 'groq';

export type ExplanationMode = 'socratic-hint' | 'architecture-explainer' | 'concept' | 'milestone-guide';

export interface ExplanationRequest {
  mode: ExplanationMode;
  code: string;
  language: string;
  filePath?: string;
  milestoneTitle?: string;
  milestoneGoal?: string;
  userSubmission?: string;
  errorFeedback?: string;
  context?: string;
}

export interface ExplanationResponse {
  provider: AIProviderType;
  model: string;
  explanation: string;
  guidingQuestions?: string[];
  keyInvariants?: string[];
  cached?: boolean;
}

export interface AIProviderConfig {
  provider: AIProviderType;
  enabled: boolean;
  apiKey?: string;
  modelId?: string;
}

export interface ModelDownloadProgress {
  status: 'initiate' | 'download' | 'progress' | 'done' | 'ready';
  file?: string;
  progress?: number; // 0 to 100
  loaded?: number;
  total?: number;
}
