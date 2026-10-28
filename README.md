<div align="center">

# ⚛ GitXray

### Zero-install, browser-native codebase visualizer, execution tracer, and interactive course generator.

**Turn any public GitHub repository into a ranked architecture graph, a step-through multi-file execution trace, and an interactive "build it from scratch" course — running completely client-side in your browser.**

[![CI](https://github.com/codexshivam/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/codexshivam/gitxray/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-06b6d4.svg)](https://gitxray.dev)
[![Architecture Badge](https://img.shields.io/badge/Architecture-50_Vault_Repos-10b981.svg)](#-the-open-source-architecture-vault-50-repositories)

</div>

---

## ⚡ The 1-Word Browser Trick

Replace `github.com` with `gitxray.dev` (or `gitxray.shivm.co`) in any repository URL:

```text
https://github.com/pallets/flask   ──►   https://gitxray.dev/pallets/flask
```

Everything runs client-side inside your browser:
- **No server required**
- **No API keys needed**
- **Zero cloud cost**

---

## 🚀 Quickstart

### 1. In Your Browser
Navigate to **[https://gitxray.dev](https://gitxray.dev)** (or [gitxray.shivm.co](https://gitxray.shivm.co)) and paste any public repository URL, or click any pre-indexed repository in the Vault below.

### 2. From Your Terminal
Inspect local directories or export context for AI coding agents:

```bash
# Instant local codebase inspection (ranks core modules by PageRank & Centrality)
npx gitxray [path]

# Export high-density CLAUDE.md and .agents/skills.md context
npx gitxray export [path]
```

---

## 🏛 The Open-Source Architecture Vault (50 Repositories)

Every repository below is pre-indexed with its primary architectural gravity well, PageRank centrality ranking, and interactive Unbox course:

### 1. AI & Autonomous Agents
| Repository | Stars | Language | Core Gravity Well | Stage 0 Core Loop Focus | 1-Click X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[openclaw/openclaw](https://github.com/openclaw/openclaw)** | 393k | TypeScript | `src/agent/loop.ts` | Autonomous tool loop & event routing | [Launch](https://gitxray.dev/openclaw/openclaw) |
| **[Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)** | 187k | Python | `autogpt/core/runner.py` | Continuous goal evaluation & memory | [Launch](https://gitxray.dev/Significant-Gravitas/AutoGPT) |
| **[huggingface/transformers](https://github.com/huggingface/transformers)** | 141k | Python | `src/transformers/pipelines/__init__.py` | AutoTokenizer & AutoModel instantiation | [Launch](https://gitxray.dev/huggingface/transformers) |
| **[ollama/ollama](https://github.com/ollama/ollama)** | 124k | TypeScript | `src/index.ts` | Local GGUF/llama streaming client | [Launch](https://gitxray.dev/ollama/ollama) |
| **[openai/whisper](https://github.com/openai/whisper)** | 111k | Python | `whisper/model.py` | Spectrogram encoder-decoder transformer | [Launch](https://gitxray.dev/openai/whisper) |
| **[hwchase17/langchain](https://github.com/hwchase17/langchain)** | 98k | Python | `libs/langchain/langchain/chains/base.py` | Composable prompt-to-model chain | [Launch](https://gitxray.dev/hwchase17/langchain) |
| **[karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)** | 48k | Python | `model.py` | Transformer block forward computation | [Launch](https://gitxray.dev/karpathy/nanoGPT) |
| **[microsoft/autogen](https://github.com/microsoft/autogen)** | 45k | Python | `autogen/agentchat/conversable_agent.py` | Multi-agent conversation turn-taking | [Launch](https://gitxray.dev/microsoft/autogen) |
| **[karpathy/micrograd](https://github.com/karpathy/micrograd)** | 42k | Python | `micrograd/engine.py` | Scalar autograd engine & backpropagation | [Launch](https://gitxray.dev/karpathy/micrograd) |
| **[run-llama/llama_index](https://github.com/run-llama/llama_index)** | 41k | Python | `llama_index/core/indices/vector_store/base.py` | Vector store retriever & synthesizer | [Launch](https://gitxray.dev/run-llama/llama_index) |
| **[vllm-project/vllm](https://github.com/vllm-project/vllm)** | 39k | Python | `vllm/engine/llm_engine.py` | PagedAttention virtual memory scheduler | [Launch](https://gitxray.dev/vllm-project/vllm) |
| **[coqui-ai/TTS](https://github.com/coqui-ai/TTS)** | 36k | Python | `TTS/api.py` | Text-to-speech audio synthesis pipeline | [Launch](https://gitxray.dev/coqui-ai/TTS) |
| **[BerriAI/litellm](https://github.com/BerriAI/litellm)** | 26k | Python | `litellm/main.py` | Universal OpenAI-format multi-provider proxy | [Launch](https://gitxray.dev/BerriAI/litellm) |
| **[chroma-core/chroma](https://github.com/chroma-core/chroma)** | 19k | Python | `chromadb/api/segment.py` | Vector segment coordinator & HNSW query | [Launch](https://gitxray.dev/chroma-core/chroma) |
| **[xorbitsai/inference](https://github.com/xorbitsai/inference)** | 6k | Python | `xinference/core/model.py` | Distributed model worker lifecycle | [Launch](https://gitxray.dev/xorbitsai/inference) |

### 2. Frontend & Web Systems
| Repository | Stars | Language | Core Gravity Well | Stage 0 Core Loop Focus | 1-Click X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[facebook/react](https://github.com/facebook/react)** | 235k | JavaScript | `packages/react/src/ReactElement.js` | Virtual DOM node factory & reconciler | [Launch](https://gitxray.dev/facebook/react) |
| **[vercel/next.js](https://github.com/vercel/next.js)** | 128k | TypeScript | `packages/next/src/server/next-server.ts` | Server Components & App Router runtime | [Launch](https://gitxray.dev/vercel/next.js) |
| **[axios/axios](https://github.com/axios/axios)** | 106k | JavaScript | `lib/core/Axios.js` | Interceptor chain promise queue | [Launch](https://gitxray.dev/axios/axios) |
| **[tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)** | 84k | JavaScript | `src/index.js` | Just-in-time utility class AST compiler | [Launch](https://gitxray.dev/tailwindlabs/tailwindcss) |
| **[sveltejs/svelte](https://github.com/sveltejs/svelte)** | 80k | JavaScript | `src/runtime/internal/Component.js` | DOM fragment update bitmask batcher | [Launch](https://gitxray.dev/sveltejs/svelte) |
| **[vitejs/vite](https://github.com/vitejs/vite)** | 73k | TypeScript | `packages/vite/src/node/server/index.ts` | On-demand native ES module dev server | [Launch](https://gitxray.dev/vitejs/vite) |
| **[chartjs/Chart.js](https://github.com/chartjs/Chart.js)** | 64k | JavaScript | `src/core/core.controller.js` | Canvas animation scale coordinator | [Launch](https://gitxray.dev/chartjs/Chart.js) |
| **[reduxjs/redux](https://github.com/reduxjs/redux)** | 61k | JavaScript | `src/createStore.ts` | Store dispatcher & subscriber callbacks | [Launch](https://gitxray.dev/reduxjs/redux) |
| **[lodash/lodash](https://github.com/lodash/lodash)** | 60k | JavaScript | `get.js` | Deep nested object path resolution | [Launch](https://gitxray.dev/lodash/lodash) |
| **[facebook/docusaurus](https://github.com/facebook/docusaurus)** | 56k | TypeScript | `packages/docusaurus/src/server/index.ts` | Documentation static site compiler | [Launch](https://gitxray.dev/facebook/docusaurus) |
| **[zustandjs/zustand](https://github.com/zustandjs/zustand)** | 50k | TypeScript | `src/vanilla.ts` | Minimal state container with sync listeners | [Launch](https://gitxray.dev/zustandjs/zustand) |
| **[vuejs/core](https://github.com/vuejs/core)** | 47k | TypeScript | `packages/reactivity/src/reactive.ts` | Proxy reactive effect & dep tracking | [Launch](https://gitxray.dev/vuejs/core) |
| **[TanStack/query](https://github.com/TanStack/query)** | 45k | TypeScript | `packages/query-core/src/queryCache.ts` | Async query cache invalidation | [Launch](https://gitxray.dev/TanStack/query) |
| **[preactjs/preact](https://github.com/preactjs/preact)** | 37k | JavaScript | `src/diff/index.js` | 3kB DOM diffing & component lifecycle | [Launch](https://gitxray.dev/preactjs/preact) |
| **[solidjs/solid](https://github.com/solidjs/solid)** | 34k | TypeScript | `packages/solid/src/reactive/signal.ts` | Fine-grained reactive signals without VDOM | [Launch](https://gitxray.dev/solidjs/solid) |
| **[pmndrs/three-fiber](https://github.com/pmndrs/three-fiber)** | 27k | TypeScript | `packages/fiber/src/core/renderer.ts` | React reconciler mapping JSX to Three.js | [Launch](https://gitxray.dev/pmndrs/three-fiber) |
| **[lucide-icons/lucide](https://github.com/lucide-icons/lucide)** | 18k | TypeScript | `packages/lucide/src/createLucideIcon.ts` | Tree-shakeable SVG icon renderer | [Launch](https://gitxray.dev/lucide-icons/lucide) |
| **[radix-ui/primitives](https://github.com/radix-ui/primitives)** | 17k | TypeScript | `packages/react/primitive/src/Primitive.tsx` | Accessible unstyled UI component primitives | [Launch](https://gitxray.dev/radix-ui/primitives) |

### 3. Backend, APIs & Runtimes
| Repository | Stars | Language | Core Gravity Well | Stage 0 Core Loop Focus | 1-Click X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[django/django](https://github.com/django/django)** | 81k | Python | `django/core/handlers/wsgi.py` | WSGI request dispatcher & ORM pipeline | [Launch](https://gitxray.dev/django/django) |
| **[fastapi/fastapi](https://github.com/fastapi/fastapi)** | 79k | Python | `fastapi/applications.py` | ASGI router with Pydantic DI resolver | [Launch](https://gitxray.dev/fastapi/fastapi) |
| **[pallets/flask](https://github.com/pallets/flask)** | 71k | Python | `src/flask/app.py` | WSGI dispatch & thread-local request ctx | [Launch](https://gitxray.dev/pallets/flask) |
| **[nestjs/nest](https://github.com/nestjs/nest)** | 68k | TypeScript | `packages/core/nest-factory.ts` | Decorator dependency injection container | [Launch](https://gitxray.dev/nestjs/nest) |
| **[expressjs/express](https://github.com/expressjs/express)** | 66k | JavaScript | `lib/router/index.js` | Recursive middleware next() pipeline | [Launch](https://gitxray.dev/expressjs/express) |
| **[strapi/strapi](https://github.com/strapi/strapi)** | 64k | JavaScript | `packages/core/strapi/src/Strapi.js` | Headless CMS bootstrap & dynamic schema | [Launch](https://gitxray.dev/strapi/strapi) |
| **[prisma/prisma](https://github.com/prisma/prisma)** | 41k | TypeScript | `packages/client/src/generation/TSClient/TSClient.ts` | Type-safe query engine code generator | [Launch](https://gitxray.dev/prisma/prisma) |
| **[colinhacks/zod](https://github.com/colinhacks/zod)** | 35k | TypeScript | `src/types.ts` | Type-inference schema validation engine | [Launch](https://gitxray.dev/colinhacks/zod) |
| **[koajs/koa](https://github.com/koajs/koa)** | 35k | JavaScript | `lib/application.js` | Async onion middleware composition | [Launch](https://gitxray.dev/koajs/koa) |
| **[typeorm/typeorm](https://github.com/typeorm/typeorm)** | 34k | TypeScript | `src/repository/Repository.ts` | Data Mapper & Active Record ORM repo | [Launch](https://gitxray.dev/typeorm/typeorm) |
| **[fastify/fastify](https://github.com/fastify/fastify)** | 33k | JavaScript | `fastify.js` | High-speed JSON schema serializer | [Launch](https://gitxray.dev/fastify/fastify) |
| **[tj/commander.js](https://github.com/tj/commander.js)** | 27k | JavaScript | `lib/command.js` | Option parser & argv token scanner | [Launch](https://gitxray.dev/tj/commander.js) |
| **[pydantic/pydantic](https://github.com/pydantic/pydantic)** | 23k | Python | `pydantic/main.py` | Rust core validator & BaseModel metadata | [Launch](https://gitxray.dev/pydantic/pydantic) |
| **[honojs/hono](https://github.com/honojs/hono)** | 22k | TypeScript | `src/hono-base.ts` | Edge-optimized trie router & dispatch | [Launch](https://gitxray.dev/honojs/hono) |
| **[tiangolo/sqlmodel](https://github.com/tiangolo/sqlmodel)** | 15k | Python | `sqlmodel/main.py` | Pydantic fields integrated with SQLAlchemy | [Launch](https://gitxray.dev/tiangolo/sqlmodel) |
| **[encode/starlette](https://github.com/encode/starlette)** | 11k | Python | `starlette/applications.py` | Asyncio ASGI framework toolkit | [Launch](https://gitxray.dev/encode/starlette) |
| **[encode/uvicorn](https://github.com/encode/uvicorn)** | 8k | Python | `uvicorn/server.py` | High-performance ASGI server event loop | [Launch](https://gitxray.dev/encode/uvicorn) |

---

## 🔬 Core Capabilities

### 1. Ranked Architecture Graph (What Matters vs. Boilerplate)
Instead of overwhelming you with thousands of source files, GitXray evaluates:
- **PageRank Centrality**: Identifying foundational gravity wells that everything relies on.
- **Betweenness Centrality**: Finding bridge modules that connect disparate subsystems.
- **Automatic Boilerplate Discounting**: De-prioritizing configuration, test runners, migrations, and wrappers.
- **Tarjan's Topological DAG Ordering**: Partitioning codebases into dependency stages (Stage 0 foundation ➔ Stage N consumers).

### 2. Multi-File Execution Stepper ("Python Tutor for Whole Repos")
- Uses Pyodide in a sandboxed Web Worker.
- Emits execution trace events (call, return, line execution, frame locals snapshots).
- Interactive timeline scrubber with dynamic call stack inspection and scope state diffing.
- Guarded by strict step caps and wall-clock execution timeouts.

### 3. Unbox Mode (Build It From Scratch)
- Partitions the repository into a Stage 0 Core Loop (minimal runnable implementation) plus 5–10 milestones.
- Each milestone has starter code, target files, and a **hard deterministic test check**.
- **Zero LLM Grading**: Correctness is verified strictly via AST validation and deterministic test suites.

### 4. Socratic AI Explanations (Off by Default)
- Provides guided questions and architectural invariants without giving away solution code.
- Works 100% offline via deterministic template heuristics.
- Optional WebGPU local inference via Transformers.js with in-browser caching.
- Optional Bring-Your-Own-Key (BYOK) for Google Gemini and Groq with keys stored strictly in `localStorage`.

### 5. AI Agent Exporters & Viral Surfaces
- **CLAUDE.md / .agents/skills.md Exporter**: Instant 1-click context export summarizing dependency flow, gravity wells, entry points, and blast-radius invariants for Claude Code and Antigravity agents.
- **SVG Architecture Badge**: Embeddable live badge preview for repository READMEs:
  ```markdown
  [![GitXray](https://gitxray.dev/badge/pallets/flask.svg)](https://gitxray.dev/pallets/flask)
  ```
- **GitHub Action (`gitxray/action@v1`)**: Computes PR blast radius diffs and posts a single sticky Mermaid comment mapping changed files to affected downstream dependents.

---

## 🛡️ Honest Sandbox & Execution Limitations

GitXray executes code entirely client-side inside the browser sandbox:
1. **Python**: Runs in a sandboxed Pyodide WebAssembly worker. Pure Python standard library modules execute natively. C-extensions requiring native system compilation, raw sockets, or local hardware access are unsupported in the sandbox.
2. **JavaScript / TypeScript**: Runs in an isolated web worker. Node.js native bindings (e.g. `libuv`, raw filesystem handles) are simulated or mocked.
3. **Deterministic Constraints**: When repos exceed browser sandbox limits, GitXray clearly notifies you rather than silently fabricating mock results.

---

## 🛠️ Contributing

Contributions are welcome! Read our **[CONTRIBUTING.md](CONTRIBUTING.md)** for development guidelines, architecture documentation, and **25 scoped Good First Issues**.

---

## 📄 License

MIT © [GitXray Contributors](LICENSE)
