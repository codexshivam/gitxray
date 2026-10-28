import { UnboxCourse } from '@gitxray/core';

export interface VaultCourse {
  repo: string;
  name: string;
  category: string;
  language: string;
  stars: string;
  gravityWell: string;
  stage0Summary: string;
  coreSnippet: string;
}

export const ARCHITECTURE_VAULT: VaultCourse[] = [
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

export const CURATED_COURSES: Record<string, UnboxCourse> = {
  'pallets/flask': {
    repo: 'pallets/flask',
    title: 'Build Flask from Scratch',
    language: 'Python',
    isReviewed: true,
    stage0Summary: 'The 50-line WSGI router and thread-local request dispatcher core loop.',
    milestones: [
      {
        id: 'flask-stage-0',
        title: 'Stage 0: The WSGI Dispatcher Core Loop',
        stage: 0,
        description: 'Build the foundational Flask class with a route decorator and path-based request dispatcher.',
        targetFile: 'src/app.py',
        starterCode: `class Flask:
    def __init__(self, name: str):
        self.name = name
        self.routes = {}

    def route(self, path: str):
        def decorator(f):
            # TODO: Register handler function for path
            return f
        return decorator

    def dispatch(self, path: str):
        # TODO: Execute registered handler or return 404
        pass
`,
        referenceSolution: `class Flask:
    def __init__(self, name: str):
        self.name = name
        self.routes = {}

    def route(self, path: str):
        def decorator(f):
            self.routes[path] = f
            return f
        return decorator

    def dispatch(self, path: str):
        handler = self.routes.get(path)
        if handler:
            return handler()
        return {"status": 404, "error": "Not Found"}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['Flask'],
          requiredPatterns: ['def route', 'def dispatch'],
          testSnippet: `
app = Flask('test')
@app.route('/hello')
def index():
    return 'world'

assert app.dispatch('/hello') == 'world'
assert app.dispatch('/unknown')['status'] == 404
`
        },
        hints: [
          'Store handler functions inside self.routes dictionary keyed by path',
          'Call handler() when route matches or return a 404 dictionary'
        ]
      },
      {
        id: 'flask-stage-1',
        title: 'Stage 1: Thread-Local Request Context Stack',
        stage: 1,
        description: 'Implement the RequestContext stack enabling global "request" access without passing arguments down every function.',
        targetFile: 'src/ctx.py',
        starterCode: `class RequestContext:
    def __init__(self, path: str):
        self.path = path
        self.active = False

    def push(self):
        # TODO: Mark active
        pass

    def pop(self):
        # TODO: Mark inactive
        pass
`,
        referenceSolution: `class RequestContext:
    def __init__(self, path: str):
        self.path = path
        self.active = False

    def push(self):
        self.active = True
        return self

    def pop(self):
        self.active = False
`,
        check: {
          type: 'composite',
          expectedSymbols: ['RequestContext'],
          requiredPatterns: ['def push', 'def pop'],
          testSnippet: `
ctx = RequestContext('/api')
assert ctx.active is False
ctx.push()
assert ctx.active is True
ctx.pop()
assert ctx.active is False
`
        },
        hints: [
          'Toggle self.active between True and False during push/pop'
        ]
      }
    ]
  },

  'expressjs/express': {
    repo: 'expressjs/express',
    title: 'Build Express from Scratch',
    language: 'JavaScript',
    isReviewed: true,
    stage0Summary: 'The recursive middleware pipeline with next() continuation chaining.',
    milestones: [
      {
        id: 'express-stage-0',
        title: 'Stage 0: The Recursive next() Middleware Pipeline',
        stage: 0,
        description: 'Implement the core express runner that chains asynchronous middleware layers using next().',
        targetFile: 'lib/express.js',
        starterCode: `export function createApplication() {
  const stack = [];

  function use(fn) {
    stack.push(fn);
  }

  function handle(req, res) {
    let index = 0;
    function next() {
      // TODO: Chain to next layer in stack
    }
    next();
  }

  return { use, handle };
}
`,
        referenceSolution: `export function createApplication() {
  const stack = [];

  function use(fn) {
    stack.push(fn);
  }

  function handle(req, res) {
    let index = 0;
    function next() {
      const layer = stack[index++];
      if (layer) {
        layer(req, res, next);
      }
    }
    next();
  }

  return { use, handle };
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['createApplication'],
          requiredPatterns: ['function use', 'function handle'],
          testSnippet: `
const app = createApplication();
let count = 0;
app.use((req, res, next) => { count += 1; next(); });
app.use((req, res, next) => { count += 10; });
app.handle({}, {});
if (count !== 11) throw new Error("Expected count to be 11, got: " + count);
`
        },
        hints: [
          'Increment index and call layer(req, res, next) if layer exists'
        ]
      }
    ]
  }
};
