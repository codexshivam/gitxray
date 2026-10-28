import { AIProviderConfig, ExplanationRequest, ExplanationResponse, ModelDownloadProgress } from './types.js';
export declare class ExplanationEngine {
    static explain(req: ExplanationRequest, config: AIProviderConfig, onProgress?: (progress: ModelDownloadProgress) => void): Promise<ExplanationResponse>;
}
export * from './types.js';
export * from './template_engine.js';
export * from './gemini_provider.js';
export * from './groq_provider.js';
export * from './webgpu_provider.js';
//# sourceMappingURL=explainer.d.ts.map