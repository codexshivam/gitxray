import { ExplanationRequest, ExplanationResponse, ModelDownloadProgress } from './types.js';

export class WebGPUExplanationProvider {
  private static pipelineInstance: any = null;
  private static isDownloading = false;
  public static readonly DEFAULT_MODEL = 'onnx-community/Qwen2.5-0.5B-Instruct';

  public static isWebGPUSupported(): boolean {
    if (typeof navigator === 'undefined') return false;
    return 'gpu' in navigator && !!(navigator as any).gpu;
  }

  public static async getPipeline(
    modelId: string = this.DEFAULT_MODEL,
    onProgress?: (progress: ModelDownloadProgress) => void
  ): Promise<any> {
    if (this.pipelineInstance) {
      return this.pipelineInstance;
    }

    if (!this.isWebGPUSupported()) {
      throw new Error('WebGPU is not supported in this browser or environment.');
    }

    this.isDownloading = true;
    try {
      // Browser-native ESM dynamic import to avoid bundling hundreds of MB of native node addons
      const moduleUrl = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3';
      const transformersModule: any = await import(
        /* @vite-ignore */ moduleUrl
      );

      const { pipeline, env } = transformersModule;
      if (env) {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }

      this.pipelineInstance = await pipeline('text-generation', modelId, {
        device: 'webgpu',
        dtype: 'q4',
        progress_callback: (info: any) => {
          if (onProgress) {
            onProgress({
              status: info.status || 'progress',
              file: info.file,
              progress: typeof info.progress === 'number' ? Math.round(info.progress) : undefined,
              loaded: info.loaded,
              total: info.total
            });
          }
        }
      });

      this.isDownloading = false;
      return this.pipelineInstance;
    } catch (err: any) {
      this.isDownloading = false;
      throw new Error(`Failed to initialize WebGPU model (${modelId}): ${err.message}`);
    }
  }

  public static async explain(
    req: ExplanationRequest,
    modelId: string = this.DEFAULT_MODEL,
    onProgress?: (progress: ModelDownloadProgress) => void
  ): Promise<ExplanationResponse> {
    const generator = await this.getPipeline(modelId, onProgress);

    const prompt = `System: You are GitXray Socratic Mentor. Give concise architectural hints and questions. Do not write full solutions.
User: In ${req.language}, file ${req.filePath || 'module'}, for milestone ${req.milestoneTitle || 'Invariant'}:
${req.code.slice(0, 1000)}
${req.errorFeedback ? `Error: ${req.errorFeedback}` : ''}
Assistant:`;

    const output = await generator(prompt, {
      max_new_tokens: 256,
      temperature: 0.3,
      do_sample: false
    });

    const generatedText = Array.isArray(output) ? output[0]?.generated_text : output?.generated_text;
    const cleanText = (generatedText || '')
      .replace(prompt, '')
      .replace(/^Assistant:\s*/i, '')
      .trim();

    return {
      provider: 'webgpu',
      model: modelId,
      explanation: cleanText || 'Examine the relationship between inputs and outputs.'
    };
  }
}
