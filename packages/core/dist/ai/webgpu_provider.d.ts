import { ExplanationRequest, ExplanationResponse, ModelDownloadProgress } from './types.js';
export declare class WebGPUExplanationProvider {
    private static pipelineInstance;
    private static isDownloading;
    static readonly DEFAULT_MODEL = "onnx-community/Qwen2.5-0.5B-Instruct";
    static isWebGPUSupported(): boolean;
    static getPipeline(modelId?: string, onProgress?: (progress: ModelDownloadProgress) => void): Promise<any>;
    static explain(req: ExplanationRequest, modelId?: string, onProgress?: (progress: ModelDownloadProgress) => void): Promise<ExplanationResponse>;
}
//# sourceMappingURL=webgpu_provider.d.ts.map