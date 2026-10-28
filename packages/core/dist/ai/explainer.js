import { TemplateExplanationEngine } from './template_engine.js';
import { GeminiExplanationProvider } from './gemini_provider.js';
import { GroqExplanationProvider } from './groq_provider.js';
import { WebGPUExplanationProvider } from './webgpu_provider.js';
export class ExplanationEngine {
    static async explain(req, config, onProgress) {
        if (!config.enabled || config.provider === 'template') {
            return TemplateExplanationEngine.explain(req);
        }
        try {
            switch (config.provider) {
                case 'gemini': {
                    if (!config.apiKey) {
                        return TemplateExplanationEngine.explain({
                            ...req,
                            errorFeedback: 'Gemini API key missing. Using offline template heuristics.'
                        });
                    }
                    return await GeminiExplanationProvider.explain(req, config.apiKey);
                }
                case 'groq': {
                    if (!config.apiKey) {
                        return TemplateExplanationEngine.explain({
                            ...req,
                            errorFeedback: 'Groq API key missing. Using offline template heuristics.'
                        });
                    }
                    return await GroqExplanationProvider.explain(req, config.apiKey);
                }
                case 'webgpu': {
                    if (!WebGPUExplanationProvider.isWebGPUSupported()) {
                        return TemplateExplanationEngine.explain({
                            ...req,
                            errorFeedback: 'WebGPU is not supported in this browser. Showing template explanation.'
                        });
                    }
                    return await WebGPUExplanationProvider.explain(req, config.modelId, onProgress);
                }
                default:
                    return TemplateExplanationEngine.explain(req);
            }
        }
        catch (err) {
            // Fallback gracefully on any failure
            const fallback = TemplateExplanationEngine.explain(req);
            fallback.explanation = `> [!NOTE]\n> *AI Provider (${config.provider}) fallback*: ${err.message}\n\n${fallback.explanation}`;
            return fallback;
        }
    }
}
export * from './types.js';
export * from './template_engine.js';
export * from './gemini_provider.js';
export * from './groq_provider.js';
export * from './webgpu_provider.js';
//# sourceMappingURL=explainer.js.map