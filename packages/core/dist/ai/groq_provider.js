export class GroqExplanationProvider {
    static ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
    static async explain(req, apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('Groq API key is required. Provide your key in the AI settings.');
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
        const response = await fetch(this.ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.4,
                max_tokens: 1024
            })
        });
        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Groq API error (${response.status}): ${errBody.slice(0, 150)}`);
        }
        const data = await response.json();
        const messageContent = data.choices?.[0]?.message?.content;
        if (!messageContent) {
            throw new Error('Groq API returned an empty completion.');
        }
        return {
            provider: 'groq',
            model: 'llama-3.1-8b-instant',
            explanation: messageContent
        };
    }
}
//# sourceMappingURL=groq_provider.js.map