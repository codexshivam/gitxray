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
    coreSnippet: 'export async function runAgentLoop(prompt: string, tools: ToolRegistry) { while (!context.completed) { const action = await planner.nextStep(); await tools.execute(action); } }'
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
    repo: 'ggerganov/llama.cpp',
    name: 'llama.cpp',
    category: 'AI & Autonomous Agents',
    language: 'C++',
    stars: '75k',
    gravityWell: 'ggml.c',
    stage0Summary: 'Pure tensor compute graph engine with 4-bit quantization and SIMD kernels',
    coreSnippet: 'struct ggml_tensor* ggml_mul_mat(struct ggml_context* ctx, struct ggml_tensor* a, struct ggml_tensor* b);'
  },
  {
    repo: 'ollama/ollama',
    name: 'Ollama',
    category: 'AI & Autonomous Agents',
    language: 'Go',
    stars: '122k',
    gravityWell: 'server/routes.go',
    stage0Summary: 'Local HTTP streaming server wrapping model runner child process',
    coreSnippet: 'func (s *Server) GenerateHandler(c *gin.Context) { req := readReq(c); s.sched.Process(req, c.Writer) }'
  },
  {
    repo: 'huggingface/transformers.js',
    name: 'Transformers.js',
    category: 'AI & Autonomous Agents',
    language: 'JavaScript',
    stars: '16k',
    gravityWell: 'src/pipelines.js',
    stage0Summary: 'WASM & WebGPU ONNX pipeline running tokenization and tensor inference',
    coreSnippet: 'export async function pipeline(task, model) { const tokenizer = await loadTokenizer(model); return (text) => model.forward(tokenizer(text)); }'
  },
  {
    repo: 'langchain-ai/langchain',
    name: 'LangChain',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '108k',
    gravityWell: 'libs/core/langchain_core/runnables/base.py',
    stage0Summary: 'Runnable protocol pipeline chaining prompts, LLMs, and output parsers',
    coreSnippet: 'class Runnable:\n    def __or__(self, other):\n        return RunnableSequence(self, other)\n    def invoke(self, input_val):\n        return self._call(input_val)'
  },
  {
    repo: 'vllm-project/vllm',
    name: 'vLLM',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '42k',
    gravityWell: 'vllm/core/block_manager.py',
    stage0Summary: 'PagedAttention virtual memory allocation for high-throughput LLM serving',
    coreSnippet: 'class BlockSpaceManager:\n    def allocate(self, seq_group):\n        return [self.gpu_allocator.allocate() for _ in seq_group]'
  },
  {
    repo: 'openai/whisper',
    name: 'Whisper',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '82k',
    gravityWell: 'whisper/model.py',
    stage0Summary: 'Audio log-mel spectrogram encoder-decoder sequence transformer',
    coreSnippet: 'class Whisper(nn.Module):\n    def forward(self, mel, tokens):\n        audio_features = self.encoder(mel)\n        return self.decoder(tokens, audio_features)'
  },
  {
    repo: 'morluto/rea',
    name: 'Rea',
    category: 'AI & Autonomous Agents',
    language: 'TypeScript',
    stars: '392k',
    gravityWell: 'src/engine/decompiler.ts',
    stage0Summary: 'Autonomous reverse-engineering agent with binary disassembler hooks',
    coreSnippet: 'export class DecompilerSession { async traceBinary(entrypoint: string) { return this.agent.inspectAST(entrypoint); } }'
  },
  {
    repo: 'obra/superpowers',
    name: 'Superpowers',
    category: 'AI & Autonomous Agents',
    language: 'Shell',
    stars: '305k',
    gravityWell: 'lib/runtime.sh',
    stage0Summary: 'Lightweight agentic skill runner and command dispatch harness',
    coreSnippet: 'run_skill() { local skill="$1"; shift; source "${SKILL_DIR}/${skill}.sh"; exec_step "$@"; }'
  },
  {
    repo: 'mattpocock/skills',
    name: 'Skills',
    category: 'AI & Autonomous Agents',
    language: 'Shell',
    stars: '304k',
    gravityWell: '.agents/manifest.json',
    stage0Summary: 'Portable agent dotfiles specification and schema validator',
    coreSnippet: '{"schemaVersion": "1.0.0", "skills": ["typecheck", "refactor", "ast-grep"]}'
  },
  {
    repo: 'microsoft/markitdown',
    name: 'MarkItDown',
    category: 'AI & Autonomous Agents',
    language: 'Python',
    stars: '191k',
    gravityWell: 'src/markitdown/_markitdown.py',
    stage0Summary: 'Universal multi-format stream-to-markdown converter for LLM feeding',
    coreSnippet: 'class MarkItDown:\n    def convert(self, source):\n        converter = self._get_converter(source)\n        return converter.to_markdown(source)'
  },
  {
    repo: 'multica-ai/andrej-karpathy-skills',
    name: 'Karpathy Skills',
    category: 'AI & Autonomous Agents',
    language: 'Markdown',
    stars: '224k',
    gravityWell: 'CLAUDE.md',
    stage0Summary: 'Deterministic negative-prompt constraints mitigating LLM coding hallucination',
    coreSnippet: '# Guidelines\n- Never write speculative stubs\n- Always verify via compiler exit code\n- Keep changes localized'
  },

  // --- Category 2: Frontend, Canvas & UI Systems ---
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
    repo: 'vuejs/core',
    name: 'Vue.js Core',
    category: 'Frontend & UI Systems',
    language: 'TypeScript',
    stars: '47k',
    gravityWell: 'packages/reactivity/src/effect.ts',
    stage0Summary: 'Proxy-based dependency tracking (track/trigger) reactivity core',
    coreSnippet: 'export function effect(fn) { const _effect = new ReactiveEffect(fn); _effect.run(); return _effect; }'
  },
  {
    repo: 'sveltejs/svelte',
    name: 'Svelte',
    category: 'Frontend & UI Systems',
    language: 'JavaScript',
    stars: '81k',
    gravityWell: 'src/compiler/compile/index.js',
    stage0Summary: 'Compile-time reactive AST transformer generating surgical DOM mutations',
    coreSnippet: 'export function compile(source, options) { const ast = parse(source); return transform(ast, options); }'
  },
  {
    repo: 'shadcn-ui/ui',
    name: 'shadcn/ui',
    category: 'Frontend & UI Systems',
    language: 'TypeScript',
    stars: '83k',
    gravityWell: 'packages/cli/src/commands/add.ts',
    stage0Summary: 'Direct AST code injection replacing black-box node_modules libraries',
    coreSnippet: 'export async function addComponent(name: string, targetDir: string) { const code = await fetchRegistry(name); fs.writeFileSync(targetDir, code); }'
  },
  {
    repo: 'excalidraw/excalidraw',
    name: 'Excalidraw',
    category: 'Frontend & UI Systems',
    language: 'TypeScript',
    stars: '96k',
    gravityWell: 'packages/excalidraw/renderer/renderScene.ts',
    stage0Summary: 'RoughJS 2D canvas drawing pipeline with linear matrix math',
    coreSnippet: 'export const renderScene = (elements, rc, canvas) => { elements.forEach(el => drawElement(el, rc)); };'
  },
  {
    repo: 'mermaid-js/mermaid',
    name: 'Mermaid',
    category: 'Frontend & UI Systems',
    language: 'JavaScript',
    stars: '77k',
    gravityWell: 'src/diagrams/flowchart/flowRenderer.js',
    stage0Summary: 'Jison/Dagre directed graph layout and SVG node generator',
    coreSnippet: 'export const draw = (text, id, version) => { const graph = parser.parse(text); renderD3Graph(graph, id); };'
  },
  {
    repo: 'tailwindlabs/tailwindcss',
    name: 'Tailwind CSS',
    category: 'Frontend & UI Systems',
    language: 'Rust/JS',
    stars: '85k',
    gravityWell: 'packages/tailwindcss/src/index.ts',
    stage0Summary: 'Just-in-time regex class scanning and dynamic CSS rule generation',
    coreSnippet: 'export function compile(candidates) { return candidates.map(c => generateRule(c)).filter(Boolean).join("\\n"); }'
  },
  {
    repo: 'vercel/next.js',
    name: 'Next.js',
    category: 'Frontend & UI Systems',
    language: 'TypeScript',
    stars: '131k',
    gravityWell: 'packages/next/src/server/base-server.ts',
    stage0Summary: 'Request router matching filesystem route tree to RSC render tree',
    coreSnippet: 'async handleRequest(req, res) { const match = this.router.match(req.url); return match.execute(req, res); }'
  },
  {
    repo: 'preactjs/preact',
    name: 'Preact',
    category: 'Frontend & UI Systems',
    language: 'JavaScript',
    stars: '37k',
    gravityWell: 'src/diff/index.js',
    stage0Summary: '3KB Virtual DOM diffing algorithm with direct browser DOM updates',
    coreSnippet: 'export function diff(dom, newVNode, oldVNode, context) { return diffChildren(dom, newVNode.props.children); }'
  },
  {
    repo: 'solidjs/solid',
    name: 'SolidJS',
    category: 'Frontend & UI Systems',
    language: 'TypeScript',
    stars: '33k',
    gravityWell: 'packages/solid/src/reactive/signal.ts',
    stage0Summary: 'Fine-grained signal graph without virtual DOM reconciliation overhead',
    coreSnippet: 'export function createSignal(value) { const s = new Signal(value); return [() => s.read(), v => s.write(v)]; }'
  },
  {
    repo: 'd3/d3',
    name: 'D3.js',
    category: 'Frontend & UI Systems',
    language: 'JavaScript',
    stars: '109k',
    gravityWell: 'src/index.js',
    stage0Summary: 'Data-driven DOM element joining and dynamic attribute transformation',
    coreSnippet: 'export function select(selector) { return new Selection([document.querySelector(selector)]); }'
  },
  {
    repo: 'mrdoob/three.js',
    name: 'Three.js',
    category: 'Frontend & UI Systems',
    language: 'JavaScript',
    stars: '106k',
    gravityWell: 'src/renderers/WebGLRenderer.js',
    stage0Summary: '3D scene graph, perspective camera matrix projection, and shader pipeline',
    coreSnippet: 'render(scene, camera) { this.initGLContext(); scene.traverse(obj => this.renderBufferDirect(camera, obj)); }'
  },

  // --- Category 3: Foundational Systems, Databases & Runtimes ---
  {
    repo: 'torvalds/linux',
    name: 'Linux Kernel',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '189k',
    gravityWell: 'init/main.c',
    stage0Summary: 'Kernel start loop (start_kernel), page table setup, and PID 0 init',
    coreSnippet: 'asmlinkage __visible void __init __no_sanitize_address start_kernel(void) { setup_arch(&command_line); rest_init(); }'
  },
  {
    repo: 'sqlite/sqlite',
    name: 'SQLite',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '14k',
    gravityWell: 'src/vdbe.c',
    stage0Summary: 'B-Tree disk pager and Virtual Database Engine (VDBE) bytecode interpreter',
    coreSnippet: 'int sqlite3VdbeExec(Vdbe *p) { for (;;) { switch (pOp->opcode) { case OP_Goto: goto jump; } } }'
  },
  {
    repo: 'redis/redis',
    name: 'Redis',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '68k',
    gravityWell: 'src/ae.c',
    stage0Summary: 'Single-threaded non-blocking epoll/kqueue event loop and dict hash table',
    coreSnippet: 'void aeMain(aeEventLoop *eventLoop) { while (!eventLoop->stop) { aeProcessEvents(eventLoop, AE_ALL_EVENTS); } }'
  },
  {
    repo: 'tiangolo/fastapi',
    name: 'FastAPI',
    category: 'Foundational Systems & Runtimes',
    language: 'Python',
    stars: '83k',
    gravityWell: 'fastapi/routing.py',
    stage0Summary: 'Pydantic type annotation reflection and Starlette ASGI route handling',
    coreSnippet: 'class APIRoute:\n    async def handle(self, scope, receive, send):\n        params = await self.parse_body(receive)\n        return await self.endpoint(**params)'
  },
  {
    repo: 'nodejs/node',
    name: 'Node.js',
    category: 'Foundational Systems & Runtimes',
    language: 'C++/JS',
    stars: '109k',
    gravityWell: 'src/node_main.cc',
    stage0Summary: 'V8 JavaScript engine initialization bound to libuv I/O loop',
    coreSnippet: 'int main(int argc, char *argv[]) { return node::Start(argc, argv); }'
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
    repo: 'git/git',
    name: 'Git',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '58k',
    gravityWell: 'object.c',
    stage0Summary: 'Content-addressable SHA object store (blob, tree, commit, tag)',
    coreSnippet: 'struct object *parse_object(struct repository *r, const struct object_id *oid);'
  },
  {
    repo: 'moby/moby',
    name: 'Docker / Moby',
    category: 'Foundational Systems & Runtimes',
    language: 'Go',
    stars: '71k',
    gravityWell: 'daemon/daemon.go',
    stage0Summary: 'Linux cgroups and namespaces isolation container supervisor',
    coreSnippet: 'func (daemon *Daemon) containerStart(container *container.Container) error { return daemon.execdriver.Run(container) }'
  },
  {
    repo: 'memcached/memcached',
    name: 'Memcached',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '14k',
    gravityWell: 'slabs.c',
    stage0Summary: 'Slab memory allocator preventing RAM fragmentation under high-frequency writes',
    coreSnippet: 'void *slabs_alloc(size_t size, unsigned int id) { return do_slabs_alloc(size, id); }'
  },
  {
    repo: 'nginx/nginx',
    name: 'Nginx',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '26k',
    gravityWell: 'src/core/ngx_cycle.c',
    stage0Summary: 'Master-worker process model with asynchronous socket multiplexing',
    coreSnippet: 'void ngx_master_process_cycle(ngx_cycle_t *cycle) { ngx_start_worker_processes(cycle, ccf->workers); }'
  },
  {
    repo: 'libuv/libuv',
    name: 'libuv',
    category: 'Foundational Systems & Runtimes',
    language: 'C',
    stars: '24k',
    gravityWell: 'src/unix/core.c',
    stage0Summary: 'Cross-platform epoll/kqueue/IOCP asynchronous I/O polling loop',
    coreSnippet: 'int uv_run(uv_loop_t* loop, uv_run_mode mode) { while (loop->stop_flag == 0) { uv__io_poll(loop, timeout); } }'
  },
  {
    repo: 'duckdb/duckdb',
    name: 'DuckDB',
    category: 'Foundational Systems & Runtimes',
    language: 'C++',
    stars: '27k',
    gravityWell: 'src/execution/physical_plan_generator.cpp',
    stage0Summary: 'Vectorized columnar query engine processing 2048-tuple vector chunks',
    coreSnippet: 'unique_ptr<PhysicalOperator> PhysicalPlanGenerator::CreatePlan(LogicalOperator &op);'
  },

  // --- Category 4: Compilers, Build Engines & DevTools ---
  {
    repo: 'tree-sitter/tree-sitter',
    name: 'Tree-sitter',
    category: 'Compilers & DevTools',
    language: 'C',
    stars: '20k',
    gravityWell: 'lib/src/parser.c',
    stage0Summary: 'Incremental GLR parsing engine maintaining reusable syntax tree state',
    coreSnippet: 'TSTree *ts_parser_parse(TSParser *self, const TSTree *old_tree, TSInput input);'
  },
  {
    repo: 'evanw/esbuild',
    name: 'esbuild',
    category: 'Compilers & DevTools',
    language: 'Go',
    stars: '38k',
    gravityWell: 'pkg/api/api_impl.go',
    stage0Summary: 'Parallel AST scanner, symbol linker, and JS/CSS printer in pure Go',
    coreSnippet: 'func (b *bundle) build() BuildResult { b.parseFilesParallel(); b.linkModules(); return b.generateOutput() }'
  },
  {
    repo: 'swc-project/swc',
    name: 'SWC',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '31k',
    gravityWell: 'crates/swc/src/lib.rs',
    stage0Summary: 'High-performance Rust compiler folding JavaScript/TypeScript ASTs',
    coreSnippet: 'pub fn process_js_file(&self, fm: Arc<SourceFile>) -> Result<TransformOutput, Error>;'
  },
  {
    repo: 'oven-sh/bun',
    name: 'Bun',
    category: 'Compilers & DevTools',
    language: 'Zig',
    stars: '80k',
    gravityWell: 'src/main.zig',
    stage0Summary: 'Zig-based JavaScriptCore runtime, ultra-fast bundler, and package manager',
    coreSnippet: 'pub fn main() void { JSC.initialize(); runScript(std.os.argv[1]); }'
  },
  {
    repo: 'BurntSushi/ripgrep',
    name: 'ripgrep',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '54k',
    gravityWell: 'crates/searcher/src/searcher.rs',
    stage0Summary: 'Memory-mapped file reader and DFA regex SIMD search accelerator',
    coreSnippet: 'pub fn search_path(&mut self, matcher: &Matcher, path: &Path, sink: &mut Sink) -> Result<()>;'
  },
  {
    repo: 'vitejs/vite',
    name: 'Vite',
    category: 'Compilers & DevTools',
    language: 'TypeScript',
    stars: '73k',
    gravityWell: 'packages/vite/src/node/server/index.ts',
    stage0Summary: 'Native ES Modules dev server serving on-demand transpiled browser requests',
    coreSnippet: 'export async function createServer(config) { const server = http.createServer(transformMiddleware); return server; }'
  },
  {
    repo: 'rust-lang/rust',
    name: 'Rust Compiler',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '103k',
    gravityWell: 'compiler/rustc_middle/src/ty/context.rs',
    stage0Summary: 'Mid-level Intermediate Representation (MIR) borrow checker and query engine',
    coreSnippet: 'pub fn enter<F, R>(&self, f: F) -> R where F: FnOnce(TyCtxt) -> R;'
  },
  {
    repo: 'golang/go',
    name: 'Go Compiler & Runtime',
    category: 'Compilers & DevTools',
    language: 'Go',
    stars: '127k',
    gravityWell: 'src/runtime/proc.go',
    stage0Summary: 'M:N Goroutine cooperative scheduler with work-stealing runqueues',
    coreSnippet: 'func schedule() { mp := getg().m; gp, inheritTime := runqget(mp.p.ptr()); execute(gp, inheritTime); }'
  },
  {
    repo: 'denoland/deno',
    name: 'Deno',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '96k',
    gravityWell: 'runtime/worker.rs',
    stage0Summary: 'Secure V8 isolate sandbox with Rust Tokio asynchronous ops binding',
    coreSnippet: 'pub async fn run_event_loop(&mut self, wait_for_inspector: bool) -> Result<(), AnyError>;'
  },
  {
    repo: 'ast-grep/ast-grep',
    name: 'ast-grep',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '11k',
    gravityWell: 'crates/core/src/matcher.rs',
    stage0Summary: 'Structural syntax tree pattern matching using tree-sitter nodes',
    coreSnippet: 'pub trait Matcher<L: Language> { fn match_node_with_env(&self, node: Node, env: &mut MetaVarEnv<L>) -> Option<Node>; }'
  },
  {
    repo: 'prettier/prettier',
    name: 'Prettier',
    category: 'Compilers & DevTools',
    language: 'JavaScript',
    stars: '49k',
    gravityWell: 'src/main/core.js',
    stage0Summary: 'Doc intermediate representation printer enforcing deterministic formatting',
    coreSnippet: 'function format(text, options) { const ast = parse(text, options); return printDocToString(astToDoc(ast)); }'
  },
  {
    repo: 'biomejs/biome',
    name: 'Biome',
    category: 'Compilers & DevTools',
    language: 'Rust',
    stars: '20k',
    gravityWell: 'crates/biome_formatter/src/lib.rs',
    stage0Summary: 'Rust-native ultra-fast formatter and linter processing lossless CSTs',
    coreSnippet: 'pub fn format_node<L: Language>(options: FormatOptions, node: &SyntaxNode<L>) -> Formatted<L>;'
  }
];
