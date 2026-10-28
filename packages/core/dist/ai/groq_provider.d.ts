import { ExplanationRequest, ExplanationResponse } from './types.js';
export declare class GroqExplanationProvider {
    private static readonly ENDPOINT;
    static explain(req: ExplanationRequest, apiKey: string): Promise<ExplanationResponse>;
}
//# sourceMappingURL=groq_provider.d.ts.map