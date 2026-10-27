export const ARCHITECTURE_VAULT = [
    // --- Category 1: AI & Autonomous Agent Harnesses ---
    {
        repo: 'openclaw/openclaw',
        name: 'OpenClaw',
        category: 'AI & Autonomous Agents',
        language: 'TypeScript',
        stars: '393k',
        gravityWell: 'src/agent/loop.ts',
        stage0Summary: 'Autonomous execution loop with tool invocation hooks and event dispatching',
        coreSnippet: 'export async function runAgentLoop(prompt: string, tools: any) { while (!context.completed) { const action = await planner.nextStep(); await tools.execute(action); } }'
    },
    {
        repo: 'Significant-Gravitas/AutoGPT',
        name: 'AutoGPT',
        category: 'AI & Autonomous Agents',
        language: 'Python',
        stars: '187k',
        gravityWell: 'autogpt/core/runner.py',
        stage0Summary: 'Continuous goal evaluation, memory persistence, and workspace isolation',
        coreSnippet: 'class AgentLoop:\n    def step(self):\n        thought = self.llm.decide(self.memory.get_context())\n        return self.workspace.apply(thought.command)'
    },
    {
        repo: 'openai/whisper',
        name: 'Whisper',
        category: 'AI & Autonomous Agents',
        language: 'Python',
        stars: '111k',
        gravityWell: 'whisper/model.py',
        stage0Summary: 'Audio log-mel spectrogram encoder-decoder sequence transformer',
        coreSnippet: 'class Whisper(nn.Module):\n    def forward(self, mel, tokens):\n        audio_features = self.encoder(mel)\n        return self.decoder(tokens, audio_features)'
    },
    {
        repo: 'facebook/react',
        name: 'React',
        category: 'Frontend & UI Systems',
        language: 'JavaScript',
        stars: '235k',
        gravityWell: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
        stage0Summary: 'Fiber node tree traversal, concurrent scheduler, and commit phase',
        coreSnippet: 'function workLoopConcurrent() { while (workInProgress !== null && !shouldYield()) { performUnitOfWork(workInProgress); } }'
    },
    {
        repo: 'pallets/flask',
        name: 'Flask',
        category: 'Foundational Systems & Runtimes',
        language: 'Python',
        stars: '71k',
        gravityWell: 'src/flask/app.py',
        stage0Summary: 'Thread-local request context stack pushing to WSGI callable',
        coreSnippet: 'def wsgi_app(self, environ, start_response):\n    ctx = self.request_context(environ)\n    ctx.push()\n    return self.full_dispatch_request()'
    },
    {
        repo: 'expressjs/express',
        name: 'Express',
        category: 'Foundational Systems & Runtimes',
        language: 'JavaScript',
        stars: '66k',
        gravityWell: 'lib/router/index.js',
        stage0Summary: 'Recursive middleware pipeline with next() continuation chaining',
        coreSnippet: 'function next(err) { const layer = stack[idx++]; if (layer) layer.handle_request(req, res, next); }'
    }
];
//# sourceMappingURL=vault_data.js.map