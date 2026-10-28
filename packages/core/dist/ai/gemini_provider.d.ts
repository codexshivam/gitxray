import { ExplanationRequest, ExplanationResponse } from './types.js';
export declare class GeminiExplanationProvider {
    private static readonly ENDPOINT;
    static explain(req: ExplanationRequest, apiKey: string): Promise<ExplanationResponse>;
}
//# sourceMappingURL=gemini_provider.d.ts.map