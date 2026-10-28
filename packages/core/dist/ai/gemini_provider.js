export class GeminiExplanationProvider {
    static ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    static async explain(req, apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('Gemini API key is required. Provide your key in the AI settings.');
        }
        const systemPrompt = `You are the Socratic AI Mentor for GitXray, an interactive codebase explorer.
Your purpose is to help developers learn how open-source repositories work from the ground up.
CRITICAL RULES:
1. Never write out the complete solution code directly. Use Socratic questioning, explain underlying concepts, point out edge cases, and describe structural patterns.
2. If the user is working on an Unbox milestone, explain the architectural invariant and pose 2-3 guided questions that lead them to write the code themselves.
3. Keep your response concise, clear, and well-structured with Markdown headings and bullet points.`;
        const userPrompt = `Context / Request:
Mode: ${req.mode}
Language: ${req.language}
File: ${req.filePath || 'unspecified'}
Milestone: ${req.milestoneTitle || 'N/A'}
Goal: ${req.milestoneGoal || 'N/A'}
${req.errorFeedback ? `Verification Feedback / Error: ${req.errorFeedback}\n` : ''}
${req.userSubmission ? `User Code Submission:\n\`\`\`${req.language}\n${req.userSubmission}\n\`\`\`\n` : ''}
Base Code Context:\n\`\`\`${req.language}\n${req.code.slice(0, 3000)}\n\`\`\`

Provide Socratic explanations and guidance to help solve this step.`;
        const response = await fetch(`${this.ENDPOINT}?key=${encodeURIComponent(apiKey.trim())}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: userPrompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 1024
                }
            })
        });
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Gemini API error (${response.status}): ${errBody.slice(0, 150)}`);
        }
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
            throw new Error('Gemini API returned an empty completion.');
        }
        return {
            provider: 'gemini',
            model: 'gemini-2.5-flash',
            explanation: candidateText
        };
    }
}
//# sourceMappingURL=gemini_provider.js.map