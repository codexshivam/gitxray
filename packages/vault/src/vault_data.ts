import { UnboxCourse } from '@gitxray/core';

export interface VaultCourse {
  repo: string;
  name: string;
  category: 'AI & Autonomous Agents' | 'Frontend & Web Systems' | 'Backend & Runtimes';
  language: 'Python' | 'JavaScript' | 'TypeScript';
  stars: string;
  gravityWell: string;
  stage0Summary: string;
  coreSnippet: string;
  isReviewed?: boolean;
}

export const ARCHITECTURE_VAULT: VaultCourse[] = [
  // ==========================================
  // Category 1: AI & Autonomous Agents (15 Repos)
  // ==========================================
  {
    repo: 'openclaw/openclaw',
    name: 'OpenClaw',
    category: 'AI & Autonomous Agents',
    language: 'TypeScript',
    stars: '393k',
    gravityWell: 'src/agent/loop.ts',
    stage0Summary: 'Autonomous execution loop with tool invocation hooks and event dispatching',
    coreSnippet: 'export async function runAgentLoop(prompt: string, tools: any) { while (!context.completed) { const action = await planner.nextStep(); await tools.execute(action); } }',
    isReviewed: true
  },
  {
    repo: 'Significant-Gravitas/AutoGPT',
    name: 'AutoGPT',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '187k',
    gravityWell: 'autogpt/core/runner.py',
    stage0Summary: 'Continuous goal evaluation, memory persistence, and workspace isolation',
    coreSnippet: 'class AgentLoop:\n    def step(self):\n        thought = self.llm.decide(self.memory.get_context())\n        return self.workspace.apply(thought.command)',
    isReviewed: true
  },
  {
    repo: 'openai/whisper',
    name: 'Whisper',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '111k',
    gravityWell: 'whisper/model.py',
    stage0Summary: 'Audio log-mel spectrogram encoder-decoder sequence transformer',
    coreSnippet: 'class Whisper(nn.Module):\n    def forward(self, mel, tokens):\n        audio_features = self.encoder(mel)\n        return self.decoder(tokens, audio_features)',
    isReviewed: false
  },
  {
    repo: 'karpathy/micrograd',
    name: 'micrograd',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '42k',
    gravityWell: 'micrograd/engine.py',
    stage0Summary: 'Tiny scalar autograd engine with topological backpropagation',
    coreSnippet: 'class Value:\n    def backward(self):\n        topo = []\n        visited = set()\n        def build_topo(v):\n            if v not in visited:\n                visited.add(v)\n                for child in v._prev:\n                    build_topo(child)\n                topo.append(v)\n        build_topo(self)\n        self.grad = 1.0\n        for node in reversed(topo):\n            node._backward()',
    isReviewed: true
  },
  {
    repo: 'karpathy/nanoGPT',
    name: 'nanoGPT',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '48k',
    gravityWell: 'model.py',
    stage0Summary: 'Cleanest, fastest PyTorch repository for training/finetuning medium GPTs',
    coreSnippet: 'class GPT(nn.Module):\n    def forward(self, idx, targets=None):\n        b, t = idx.size()\n        pos = torch.arange(0, t, dtype=torch.long, device=device)\n        tok_emb = self.transformer.wte(idx)\n        pos_emb = self.transformer.wpe(pos)\n        x = tok_emb + pos_emb',
    isReviewed: false
  },
  {
    repo: 'hwchase17/langchain',
    name: 'LangChain',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '98k',
    gravityWell: 'libs/langchain/langchain/chains/base.py',
    stage0Summary: 'Composable prompt-to-model pipeline with callback streaming',
    coreSnippet: 'class Chain(ABC):\n    def run(self, *args, **kwargs):\n        return self(args[0] if len(args) == 1 else kwargs)[self.output_keys[0]]',
    isReviewed: false
  },
  {
    repo: 'run-llama/llama_index',
    name: 'LlamaIndex',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '41k',
    gravityWell: 'llama_index/core/indices/vector_store/base.py',
    stage0Summary: 'Vector store similarity retriever and text chunk synthesizers',
    coreSnippet: 'class VectorStoreIndex:\n    def as_query_engine(self):\n        return RetrieverQueryEngine.from_args(self.as_retriever())',
    isReviewed: false
  },
  {
    repo: 'microsoft/autogen',
    name: 'AutoGen',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '45k',
    gravityWell: 'autogen/agentchat/conversable_agent.py',
    stage0Summary: 'Multi-agent conversational turn-taking and tool execution dispatcher',
    coreSnippet: 'class ConversableAgent:\n    def generate_reply(self, messages, sender):\n        return self._reply_func(messages, sender)',
    isReviewed: false
  },
  {
    repo: 'BerriAI/litellm',
    name: 'LiteLLM',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '26k',
    gravityWell: 'litellm/main.py',
    stage0Summary: 'Unified OpenAI-format proxy across 100+ LLMs with fallback routing',
    coreSnippet: 'def completion(model, messages, **kwargs):\n    model_response = openai_chat_completion(model=model, messages=messages, **kwargs)\n    return model_response',
    isReviewed: false
  },
  {
    repo: 'chroma-core/chroma',
    name: 'ChromaDB',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '19k',
    gravityWell: 'chromadb/api/segment.py',
    stage0Summary: 'Embedding segment coordinator with HNSW approximate nearest neighbors',
    coreSnippet: 'class SegmentAPI:\n    def query(self, collection_id, embeddings, n_results):\n        return self.vector_segment.query(embeddings, n_results)',
    isReviewed: false
  },
  {
    repo: 'vllm-project/vllm',
    name: 'vLLM',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '39k',
    gravityWell: 'vllm/engine/llm_engine.py',
    stage0Summary: 'PagedAttention high-throughput memory management and scheduler',
    coreSnippet: 'class LLMEngine:\n    def step(self):\n        seq_group_metadata_list, scheduler_outputs = self.scheduler.schedule()\n        return self.model_executor.execute_model(seq_group_metadata_list)',
    isReviewed: false
  },
  {
    repo: 'coqui-ai/TTS',
    name: 'Coqui TTS',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '36k',
    gravityWell: 'TTS/api.py',
    stage0Summary: 'Deep learning text-to-speech synthesis and voice cloning pipeline',
    coreSnippet: 'class TTS:\n    def tts(self, text, speaker_wav=None):\n        wav = self.synthesizer.tts(text, speaker_wav)\n        return wav',
    isReviewed: false
  },
  {
    repo: 'ollama/ollama',
    name: 'Ollama',
    category: 'AI & Autonomous Agents',
    language: 'TypeScript',
    stars: '124k',
    gravityWell: 'src/index.ts',
    stage0Summary: 'Streaming client interface for local GGUF/llama.cpp inference server',
    coreSnippet: 'export class Ollama {\n  async chat(request) {\n    return this.post("/api/chat", request);\n  }\n}',
    isReviewed: false
  },
  {
    repo: 'huggingface/transformers',
    name: 'Transformers',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '141k',
    gravityWell: 'src/transformers/pipelines/__init__.py',
    stage0Summary: 'AutoTokenizer and AutoModel dynamic architecture instantiation pipeline',
    coreSnippet: 'def pipeline(task, model=None, **kwargs):\n    targeted_task, task_options = get_task(task)\n    return targeted_task(model=model, **task_options)',
    isReviewed: false
  },
  {
    repo: 'xorbitsai/inference',
    name: 'Xinference',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '6k',
    gravityWell: 'xinference/core/model.py',
    stage0Summary: 'Distributed inference model worker orchestration and lifecycle manager',
    coreSnippet: 'class ModelActor:\n    async def generate(self, prompt, **kwargs):\n        return await self._model.generate(prompt, **kwargs)',
    isReviewed: false
  },

  // ==========================================
  // Category 2: Frontend & Web Systems (18 Repos)
  // ==========================================
  {
    repo: 'facebook/react',
    name: 'React',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '235k',
    gravityWell: 'packages/react/src/ReactElement.js',
    stage0Summary: 'createElement virtual node factory and workLoop reconciler unit of work',
    coreSnippet: 'export function createElement(type, config, children) { return { $$typeof: Symbol.for("react.element"), type, props: config }; }',
    isReviewed: true
  },
  {
    repo: 'reduxjs/redux',
    name: 'Redux',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '61k',
    gravityWell: 'src/createStore.ts',
    stage0Summary: 'Immutable state tree container with sync dispatch and subscriber notifications',
    coreSnippet: 'export function createStore(reducer, preloadedState) {\n  let state = preloadedState;\n  let listeners = [];\n  function getState() { return state; }\n  function dispatch(action) { state = reducer(state, action); listeners.forEach(l => l()); return action; }\n  function subscribe(listener) { listeners.push(listener); return () => listeners.splice(listeners.indexOf(listener), 1); }\n  return { getState, dispatch, subscribe };\n}',
    isReviewed: true
  },
  {
    repo: 'lodash/lodash',
    name: 'Lodash',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '60k',
    gravityWell: 'get.js',
    stage0Summary: 'Deep nested object path navigation with dot/bracket token resolution',
    coreSnippet: 'export function get(object, path, defaultValue) {\n  const keys = Array.isArray(path) ? path : path.replace(/\\[(\\d+)\\]/g, ".$1").split(".");\n  let result = object;\n  for (const key of keys) {\n    if (result == null) return defaultValue;\n    result = result[key];\n  }\n  return result === undefined ? defaultValue : result;\n}',
    isReviewed: true
  },
  {
    repo: 'vuejs/core',
    name: 'Vue 3 Core',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '47k',
    gravityWell: 'packages/reactivity/src/reactive.ts',
    stage0Summary: 'Proxy-based reactive effect tracking and dep trigger dependency graph',
    coreSnippet: 'export function reactive(target) { return new Proxy(target, mutableHandlers); }',
    isReviewed: false
  },
  {
    repo: 'sveltejs/svelte',
    name: 'Svelte',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '80k',
    gravityWell: 'src/runtime/internal/Component.js',
    stage0Summary: 'Zero-runtime compiler DOM fragment update batching',
    coreSnippet: 'export function init(component, options, instance, create_fragment, not_equal) { ... }',
    isReviewed: false
  },
  {
    repo: 'vercel/next.js',
    name: 'Next.js',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '128k',
    gravityWell: 'packages/next/src/server/next-server.ts',
    stage0Summary: 'App Router incremental static revalidation and React Server Components runtime',
    coreSnippet: 'class NextNodeServer extends BaseServer { async renderToResponse(req, res, page) { ... } }',
    isReviewed: false
  },
  {
    repo: 'vitejs/vite',
    name: 'Vite',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '73k',
    gravityWell: 'packages/vite/src/node/server/index.ts',
    stage0Summary: 'On-demand native ES module dev server with Rollup production builds',
    coreSnippet: 'export async function createServer(inlineConfig = {}) { const server = { middlewares: connect() }; return server; }',
    isReviewed: false
  },
  {
    repo: 'preactjs/preact',
    name: 'Preact',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '37k',
    gravityWell: 'src/diff/index.js',
    stage0Summary: '3kB alternative to React with direct DOM diffing and component lifecycle',
    coreSnippet: 'export function diff(dom, newVNode, oldVNode) { ... }',
    isReviewed: false
  },
  {
    repo: 'TanStack/query',
    name: 'TanStack Query',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '45k',
    gravityWell: 'packages/query-core/src/queryCache.ts',
    stage0Summary: 'Declarative async state manager with background cache invalidation',
    coreSnippet: 'export class QueryCache { build(client, options, state) { ... } }',
    isReviewed: false
  },
  {
    repo: 'solidjs/solid',
    name: 'SolidJS',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '34k',
    gravityWell: 'packages/solid/src/reactive/signal.ts',
    stage0Summary: 'Fine-grained reactive signals without a virtual DOM',
    coreSnippet: 'export function createSignal(value) { return [() => readSignal(value), (v) => writeSignal(v)]; }',
    isReviewed: false
  },
  {
    repo: 'zustandjs/zustand',
    name: 'Zustand',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '50k',
    gravityWell: 'src/vanilla.ts',
    stage0Summary: 'Barebones state store using Object.is equality and useSyncExternalStore',
    coreSnippet: 'export const createStore = (createState) => { let state; const listeners = new Set(); return { getState, setState, subscribe }; };',
    isReviewed: false
  },
  {
    repo: 'axios/axios',
    name: 'Axios',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '106k',
    gravityWell: 'lib/core/Axios.js',
    stage0Summary: 'Promise-based HTTP client with request/response interceptor queues',
    coreSnippet: 'Axios.prototype.request = function(config) { const chain = [dispatchRequest, undefined]; return promise; };',
    isReviewed: false
  },
  {
    repo: 'tailwindlabs/tailwindcss',
    name: 'Tailwind CSS',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '84k',
    gravityWell: 'src/index.js',
    stage0Summary: 'Just-in-time CSS utility class parser and AST generator',
    coreSnippet: 'export default function tailwindcss() { return { postcssPlugin: "tailwindcss", plugins: [] }; }',
    isReviewed: false
  },
  {
    repo: 'facebook/docusaurus',
    name: 'Docusaurus',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '56k',
    gravityWell: 'packages/docusaurus/src/server/index.ts',
    stage0Summary: 'Static site generator optimized for documentation websites',
    coreSnippet: 'export async function build(siteDir) { ... }',
    isReviewed: false
  },
  {
    repo: 'lucide-icons/lucide',
    name: 'Lucide',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '18k',
    gravityWell: 'packages/lucide/src/createLucideIcon.ts',
    stage0Summary: 'Universal SVG icon node renderer with tree-shaking support',
    coreSnippet: 'export const createLucideIcon = (iconName, iconNode) => (props) => ...',
    isReviewed: false
  },
  {
    repo: 'chartjs/Chart.js',
    name: 'Chart.js',
    category: 'Frontend & Web Systems',
    language: 'JavaScript',
    stars: '64k',
    gravityWell: 'src/core/core.controller.js',
    stage0Summary: 'HTML5 Canvas animated data chart controller and scale coordinator',
    coreSnippet: 'export class Chart { update(mode) { this.animator.start(); } }',
    isReviewed: false
  },
  {
    repo: 'pmndrs/three-fiber',
    name: 'React Three Fiber',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '27k',
    gravityWell: 'packages/fiber/src/core/renderer.ts',
    stage0Summary: 'Custom reconciler mapping JSX element trees to Three.js scene graphs',
    coreSnippet: 'export const createRenderer = () => Reconciler({ createInstance(type, props) { ... } });',
    isReviewed: false
  },
  {
    repo: 'radix-ui/primitives',
    name: 'Radix UI Primitives',
    category: 'Frontend & Web Systems',
    language: 'TypeScript',
    stars: '17k',
    gravityWell: 'packages/react/primitive/src/Primitive.tsx',
    stage0Summary: 'Unstyled, accessible UI component primitives with composition slots',
    coreSnippet: 'export const Primitive = NODES.reduce((primitive, node) => ({ ...primitive, [node]: ... }), {});',
    isReviewed: false
  },

  // ==========================================
  // Category 3: Backend & Runtimes (17 Repos)
  // ==========================================
  {
    repo: 'pallets/flask',
    name: 'Flask',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '71k',
    gravityWell: 'src/flask/app.py',
    stage0Summary: 'Thread-local request context stack pushing to WSGI callable',
    coreSnippet: 'def wsgi_app(self, environ, start_response):\n    ctx = self.request_context(environ)\n    ctx.push()\n    return self.full_dispatch_request()',
    isReviewed: true
  },
  {
    repo: 'expressjs/express',
    name: 'Express',
    category: 'Backend & Runtimes',
    language: 'JavaScript',
    stars: '66k',
    gravityWell: 'lib/router/index.js',
    stage0Summary: 'Recursive middleware pipeline with next() continuation chaining',
    coreSnippet: 'function next(err) { const layer = stack[idx++]; if (layer) layer.handle_request(req, res, next); }',
    isReviewed: true
  },
  {
    repo: 'fastapi/fastapi',
    name: 'FastAPI',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '79k',
    gravityWell: 'fastapi/applications.py',
    stage0Summary: 'ASGI app decorator with Pydantic type validation and OpenAPI doc generator',
    coreSnippet: 'class FastAPI(Starlette):\n    def get(self, path: str):\n        return self.router.get(path)',
    isReviewed: true
  },
  {
    repo: 'tj/commander.js',
    name: 'Commander.js',
    category: 'Backend & Runtimes',
    language: 'JavaScript',
    stars: '27k',
    gravityWell: 'lib/command.js',
    stage0Summary: 'Command-line argument parser with subcommands, flags, and help formatting',
    coreSnippet: 'export class Command {\n  constructor(name) { this.name = name; this.options = []; }\n  option(flags, desc) { this.options.push({ flags, desc }); return this; }\n  parse(argv) { /* Parse flags and invoke action */ return this; }\n}',
    isReviewed: true
  },
  {
    repo: 'encode/starlette',
    name: 'Starlette',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '11k',
    gravityWell: 'starlette/applications.py',
    stage0Summary: 'Lightweight ASGI framework toolkit for high-performance asyncio services',
    coreSnippet: 'class Starlette:\n    async def __call__(self, scope, receive, send):\n        await self.middleware_stack(scope, receive, send)',
    isReviewed: false
  },
  {
    repo: 'encode/uvicorn',
    name: 'Uvicorn',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '8k',
    gravityWell: 'uvicorn/server.py',
    stage0Summary: 'Lightning-fast ASGI server implementation using uvloop and httptools',
    coreSnippet: 'class Server:\n    async def serve(self):\n        config = self.config\n        await self.startup()',
    isReviewed: false
  },
  {
    repo: 'django/django',
    name: 'Django',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '81k',
    gravityWell: 'django/core/handlers/wsgi.py',
    stage0Summary: 'Batteries-included web framework with ORM query builder and WSGI pipeline',
    coreSnippet: 'class WSGIHandler(base.BaseHandler):\n    def __call__(self, environ, start_response):\n        request = self.request_class(environ)\n        response = self.get_response(request)\n        return response',
    isReviewed: false
  },
  {
    repo: 'honojs/hono',
    name: 'Hono',
    category: 'Backend & Runtimes',
    language: 'TypeScript',
    stars: '22k',
    gravityWell: 'src/hono-base.ts',
    stage0Summary: 'Ultrafast web framework for Cloudflare Workers, Deno, Bun, and Node.js',
    coreSnippet: 'export class Hono { fetch = (request, env) => this.dispatch(request, env); }',
    isReviewed: false
  },
  {
    repo: 'fastify/fastify',
    name: 'Fastify',
    category: 'Backend & Runtimes',
    language: 'JavaScript',
    stars: '33k',
    gravityWell: 'fastify.js',
    stage0Summary: 'High-speed Node server with JSON Schema compilation via fast-json-stringify',
    coreSnippet: 'function fastify(options) { const app = { route, listen }; return app; }',
    isReviewed: false
  },
  {
    repo: 'koajs/koa',
    name: 'Koa',
    category: 'Backend & Runtimes',
    language: 'JavaScript',
    stars: '35k',
    gravityWell: 'lib/application.js',
    stage0Summary: 'Next-gen Node framework using async functions and onion middleware flow',
    coreSnippet: 'class Application extends Emitter { use(fn) { this.middleware.push(fn); return this; } }',
    isReviewed: false
  },
  {
    repo: 'nestjs/nest',
    name: 'NestJS',
    category: 'Backend & Runtimes',
    language: 'TypeScript',
    stars: '68k',
    gravityWell: 'packages/core/nest-factory.ts',
    stage0Summary: 'Progressive Node.js framework with dependency injection and decorators',
    coreSnippet: 'export class NestFactoryStatic { async create(module) { ... } }',
    isReviewed: false
  },
  {
    repo: 'colinhacks/zod',
    name: 'Zod',
    category: 'Backend & Runtimes',
    language: 'TypeScript',
    stars: '35k',
    gravityWell: 'src/types.ts',
    stage0Summary: 'TypeScript-first schema declaration and static type inference engine',
    coreSnippet: 'export abstract class ZodType { parse(data) { ... } }',
    isReviewed: false
  },
  {
    repo: 'pydantic/pydantic',
    name: 'Pydantic',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '23k',
    gravityWell: 'pydantic/main.py',
    stage0Summary: 'Data validation and settings management using Python type hints',
    coreSnippet: 'class BaseModel(metaclass=ModelMetaclass):\n    def __init__(self, **data):\n        self.__pydantic_validator__.validate_python(data, self_instance=self)',
    isReviewed: false
  },
  {
    repo: 'prisma/prisma',
    name: 'Prisma',
    category: 'Backend & Runtimes',
    language: 'TypeScript',
    stars: '41k',
    gravityWell: 'packages/client/src/generation/TSClient/TSClient.ts',
    stage0Summary: 'Next-generation ORM generating type-safe database queries via Rust engine',
    coreSnippet: 'export class PrismaClient { constructor() { this._engine = new QueryEngine(); } }',
    isReviewed: false
  },
  {
    repo: 'typeorm/typeorm',
    name: 'TypeORM',
    category: 'Backend & Runtimes',
    language: 'TypeScript',
    stars: '34k',
    gravityWell: 'src/repository/Repository.ts',
    stage0Summary: 'Active Record and Data Mapper ORM supporting PostgreSQL, MySQL, and SQLite',
    coreSnippet: 'export class Repository { async find(options) { ... } }',
    isReviewed: false
  },
  {
    repo: 'strapi/strapi',
    name: 'Strapi',
    category: 'Backend & Runtimes',
    language: 'JavaScript',
    stars: '64k',
    gravityWell: 'packages/core/strapi/src/Strapi.js',
    stage0Summary: 'Headless CMS platform with dynamic schema builder and REST/GraphQL APIs',
    coreSnippet: 'class Strapi { async start() { await this.bootstrap(); } }',
    isReviewed: false
  },
  {
    repo: 'tiangolo/sqlmodel',
    name: 'SQLModel',
    category: 'Backend & Runtimes',
    language: 'Python',
    stars: '15k',
    gravityWell: 'sqlmodel/main.py',
    stage0Summary: 'SQL databases in Python with Pydantic data models and SQLAlchemy ORM',
    coreSnippet: 'class SQLModel(BaseModel):\n    # Integrates SQLAlchemy metadata with Pydantic fields\n    pass',
    isReviewed: false
  }
];

// ========================================================
// 10 Reviewed Courses with Hard Deterministic Verification
// ========================================================
export const CURATED_COURSES: Record<string, UnboxCourse> = {
  // Course 1: pallets/flask
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

    def dispatch_request(self, path: str) -> str:
        # TODO: Lookup handler and call it
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

    def dispatch_request(self, path: str) -> str:
        if path in self.routes:
            return self.routes[path]()
        return "404 Not Found"
`,
        check: {
          type: 'composite',
          expectedSymbols: ['Flask'],
          requiredPatterns: ['def route', 'def dispatch_request'],
          testSnippet: `
app = Flask('test_app')
@app.route('/hello')
def hello():
    return 'world'

assert app.dispatch_request('/hello') == 'world'
assert app.dispatch_request('/nonexistent') == '404 Not Found'
`
        },
        hints: [
          'Store handler functions in self.routes[path]',
          'Return 404 Not Found if path is not in self.routes'
        ]
      },
      {
        id: 'flask-stage-1',
        title: 'Stage 1: Thread-Local Request Context',
        stage: 1,
        description: 'Implement RequestContext with push() and pop() lifecycle transitions.',
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

  // Course 2: expressjs/express
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
  },

  // Course 3: reduxjs/redux
  'reduxjs/redux': {
    repo: 'reduxjs/redux',
    title: 'Build Redux from Scratch',
    language: 'JavaScript',
    isReviewed: true,
    stage0Summary: 'The predictable state container with getState, dispatch, and subscribe.',
    milestones: [
      {
        id: 'redux-stage-0',
        title: 'Stage 0: The Core Store Dispatcher',
        stage: 0,
        description: 'Build createStore(reducer, initialState) that manages immutable state transitions and subscriber callbacks.',
        targetFile: 'src/store.js',
        starterCode: `export function createStore(reducer, preloadedState) {
  let state = preloadedState;
  const listeners = [];

  function getState() {
    // TODO: Return current state
    return null;
  }

  function dispatch(action) {
    // TODO: Mutate state via reducer and notify listeners
  }

  function subscribe(listener) {
    // TODO: Register listener and return unsubscribe callback
    return () => {};
  }

  return { getState, dispatch, subscribe };
}
`,
        referenceSolution: `export function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (const l of listeners) {
      l();
    }
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { getState, dispatch, subscribe };
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['createStore'],
          requiredPatterns: ['function getState', 'function dispatch', 'function subscribe'],
          testSnippet: `
function counterReducer(state = 0, action) {
  if (action.type === 'INCREMENT') return state + 1;
  return state;
}
const store = createStore(counterReducer, 0);
let notified = 0;
const unsub = store.subscribe(() => { notified += 1; });
store.dispatch({ type: 'INCREMENT' });
if (store.getState() !== 1) throw new Error("Expected state 1");
if (notified !== 1) throw new Error("Expected notification");
unsub();
store.dispatch({ type: 'INCREMENT' });
if (notified !== 1) throw new Error("Expected unsubscribe to work");
`
        },
        hints: ['Call reducer(state, action) and store new state']
      }
    ]
  },

  // Course 4: karpathy/micrograd
  'karpathy/micrograd': {
    repo: 'karpathy/micrograd',
    title: 'Build micrograd from Scratch',
    language: 'Python',
    isReviewed: true,
    stage0Summary: 'Scalar autograd engine with topological backward propagation.',
    milestones: [
      {
        id: 'micrograd-stage-0',
        title: 'Stage 0: The Value Scalar and Additive Autograd',
        stage: 0,
        description: 'Implement Value with addition and backward gradient propagation.',
        targetFile: 'src/engine.py',
        starterCode: `class Value:
    def __init__(self, data: float, _children=()):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._backward = lambda: None

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other))
        # TODO: Define _backward for addition
        return out
`,
        referenceSolution: `class Value:
    def __init__(self, data: float, _children=()):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._backward = lambda: None

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other))
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out
`,
        check: {
          type: 'composite',
          expectedSymbols: ['Value'],
          requiredPatterns: ['def __add__'],
          testSnippet: `
a = Value(2.0)
b = Value(3.0)
c = a + b
assert c.data == 5.0
c.grad = 1.0
c._backward()
assert a.grad == 1.0
assert b.grad == 1.0
`
        },
        hints: ['During addition, both inputs receive the gradient of out']
      }
    ]
  },

  // Course 5: tj/commander.js
  'tj/commander.js': {
    repo: 'tj/commander.js',
    title: 'Build Commander from Scratch',
    language: 'JavaScript',
    isReviewed: true,
    stage0Summary: 'CLI argument and flag parsing engine.',
    milestones: [
      {
        id: 'commander-stage-0',
        title: 'Stage 0: Option Registration and Argv Parsing',
        stage: 0,
        description: 'Implement a Command class that parses boolean flags from argv array.',
        targetFile: 'lib/command.js',
        starterCode: `export class Command {
  constructor(name) {
    this.name = name;
    this.options = {};
  }

  parse(args) {
    // TODO: Extract flags like --port into this.options
  }
}
`,
        referenceSolution: `export class Command {
  constructor(name) {
    this.name = name;
    this.options = {};
  }

  parse(args) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          this.options[key] = next;
          i++;
        } else {
          this.options[key] = true;
        }
      }
    }
    return this;
  }
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['Command'],
          requiredPatterns: ['parse'],
          testSnippet: `
const cmd = new Command('serve');
cmd.parse(['--verbose', '--port', '8080']);
if (cmd.options.verbose !== true) throw new Error("Expected verbose: true");
if (cmd.options.port !== '8080') throw new Error("Expected port 8080");
`
        },
        hints: ['Check if next arg exists and does not start with --']
      }
    ]
  },

  // Course 6: lodash/lodash
  'lodash/lodash': {
    repo: 'lodash/lodash',
    title: 'Build Lodash from Scratch',
    language: 'JavaScript',
    isReviewed: true,
    stage0Summary: 'Deep property path resolution and safe object navigation.',
    milestones: [
      {
        id: 'lodash-stage-0',
        title: 'Stage 0: The get() Deep Path Resolver',
        stage: 0,
        description: 'Implement get(object, path, defaultValue) supporting dot notation.',
        targetFile: 'get.js',
        starterCode: `export function get(object, path, defaultValue) {
  // TODO: Traverse object along path (e.g. 'a.b.c')
  return undefined;
}
`,
        referenceSolution: `export function get(object, path, defaultValue) {
  if (object == null) return defaultValue;
  const segments = Array.isArray(path) ? path : path.split('.');
  let current = object;
  for (const seg of segments) {
    if (current == null) return defaultValue;
    current = current[seg];
  }
  return current === undefined ? defaultValue : current;
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['get'],
          testSnippet: `
const obj = { a: { b: { c: 42 } } };
if (get(obj, 'a.b.c') !== 42) throw new Error("Expected 42");
if (get(obj, 'a.missing.c', 'default') !== 'default') throw new Error("Expected fallback default");
`
        },
        hints: ['Split path on dot and step through current[seg]']
      }
    ]
  },

  // Course 7: fastapi/fastapi
  'fastapi/fastapi': {
    repo: 'fastapi/fastapi',
    title: 'Build FastAPI from Scratch',
    language: 'Python',
    isReviewed: true,
    stage0Summary: 'HTTP routing with dependency injection resolver.',
    milestones: [
      {
        id: 'fastapi-stage-0',
        title: 'Stage 0: Dependency Injection Container',
        stage: 0,
        description: 'Build Depends(dependency) and resolve_dependencies(fn, context).',
        targetFile: 'fastapi/depends.py',
        starterCode: `class Depends:
    def __init__(self, dependency):
        self.dependency = dependency

def resolve_dependency(dep):
    # TODO: Execute dependency and return result
    return None
`,
        referenceSolution: `class Depends:
    def __init__(self, dependency):
        self.dependency = dependency

def resolve_dependency(dep):
    if isinstance(dep, Depends):
        return dep.dependency()
    return dep()
`,
        check: {
          type: 'composite',
          expectedSymbols: ['Depends', 'resolve_dependency'],
          testSnippet: `
def get_db():
    return {'connection': 'ok'}

dep = Depends(get_db)
res = resolve_dependency(dep)
assert res == {'connection': 'ok'}
`
        },
        hints: ['Invoke dep.dependency() to produce the injected value']
      }
    ]
  },

  // Course 8: openclaw/openclaw
  'openclaw/openclaw': {
    repo: 'openclaw/openclaw',
    title: 'Build OpenClaw from Scratch',
    language: 'TypeScript',
    isReviewed: true,
    stage0Summary: 'Autonomous tool dispatcher and action harness.',
    milestones: [
      {
        id: 'openclaw-stage-0',
        title: 'Stage 0: The Tool Dispatcher Registry',
        stage: 0,
        description: 'Build a ToolRegistry that registers tools and executes JSON actions.',
        targetFile: 'src/tools.ts',
        starterCode: `export class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  register(name, fn) {
    // TODO: Store tool
  }

  execute(name, params) {
    // TODO: Execute tool
    return null;
  }
}
`,
        referenceSolution: `export class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  register(name, fn) {
    this.tools.set(name, fn);
  }

  execute(name, params) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(\`Tool \${name} not found\`);
    return tool(params);
  }
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['ToolRegistry'],
          requiredPatterns: ['register', 'execute'],
          testSnippet: `
const reg = new ToolRegistry();
reg.register('add', ({ a, b }) => a + b);
const res = reg.execute('add', { a: 10, b: 20 });
if (res !== 30) throw new Error("Expected 30, got: " + res);
`
        },
        hints: ['Store fn in this.tools.set(name, fn)']
      }
    ]
  },

  // Course 9: Significant-Gravitas/AutoGPT
  'Significant-Gravitas/AutoGPT': {
    repo: 'Significant-Gravitas/AutoGPT',
    title: 'Build AutoGPT from Scratch',
    language: 'Python',
    isReviewed: true,
    stage0Summary: 'Autonomous goal evaluation step loop.',
    milestones: [
      {
        id: 'autogpt-stage-0',
        title: 'Stage 0: The Autonomous Loop Stepper',
        stage: 0,
        description: 'Build AgentStepLoop that steps until is_complete is True.',
        targetFile: 'autogpt/runner.py',
        starterCode: `class AgentStepLoop:
    def __init__(self, max_steps: int = 5):
        self.max_steps = max_steps
        self.step_count = 0

    def step(self, is_complete: bool) -> bool:
        # TODO: Return True if loop should continue, False if done or max_steps hit
        return False
`,
        referenceSolution: `class AgentStepLoop:
    def __init__(self, max_steps: int = 5):
        self.max_steps = max_steps
        self.step_count = 0

    def step(self, is_complete: bool) -> bool:
        if is_complete:
            return False
        if self.step_count >= self.max_steps:
            return False
        self.step_count += 1
        return True
`,
        check: {
          type: 'composite',
          expectedSymbols: ['AgentStepLoop'],
          requiredPatterns: ['def step'],
          testSnippet: `
loop = AgentStepLoop(max_steps=2)
assert loop.step(is_complete=False) is True
assert loop.step(is_complete=False) is True
assert loop.step(is_complete=False) is False  # Hit max steps
`
        },
        hints: ['Check is_complete first, then increment self.step_count']
      }
    ]
  },

  // Course 10: facebook/react
  'facebook/react': {
    repo: 'facebook/react',
    title: 'Build React from Scratch',
    language: 'JavaScript',
    isReviewed: true,
    stage0Summary: 'Virtual DOM element factory and basic props normalization.',
    milestones: [
      {
        id: 'react-stage-0',
        title: 'Stage 0: createElement Virtual DOM Node Factory',
        stage: 0,
        description: 'Implement createElement(type, props, ...children) producing standardized virtual DOM descriptors.',
        targetFile: 'packages/react/src/ReactElement.js',
        starterCode: `export function createElement(type, props, ...children) {
  // TODO: Return virtual DOM element descriptor
  return null;
}
`,
        referenceSolution: `export function createElement(type, props, ...children) {
  return {
    $$typeof: Symbol.for('react.element'),
    type,
    props: {
      ...(props || {}),
      children: children.length === 1 ? children[0] : children
    }
  };
}
`,
        check: {
          type: 'composite',
          expectedSymbols: ['createElement'],
          testSnippet: `
const el = createElement('div', { id: 'root' }, 'Hello World');
if (el.type !== 'div') throw new Error("Expected div type");
if (el.props.id !== 'root') throw new Error("Expected id root");
if (el.props.children !== 'Hello World') throw new Error("Expected Hello World child");
`
        },
        hints: ['Return an object with type and props containing children']
      }
    ]
  }
};
