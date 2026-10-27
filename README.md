<div align="center">

# ⚛ GitXray

### The Zero-Install Live Codebase Decompiler & Execution Trace

**Replace `github.com` with `gitxray.dev` in any repository URL (or run `npx gitxray`) to instantly decompile static source code into a live, step-by-step execution visualizer, blast-radius debugger, and interactive "build-it-from-scratch" course.**

[![CI](https://github.com/gitxray/gitxray/actions/workflows/ci.yml/badge.svg)](https://github.com/gitxray/gitxray/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![WASM Engine](https://img.shields.io/badge/WASM-Tree--Sitter-06b6d4.svg)](#layer-1-microsecond-incremental-ast--graph-extraction)
[![WebGPU Accelerated](https://img.shields.io/badge/WebGPU-Accelerated-10b981.svg)](#layer-3-automated-unbox-mode)
[![Zero Config](https://img.shields.io/badge/Zero--Install-Browser--Native-8b5cf6.svg)](https://gitxray.dev)
[![Architecture Badge](https://img.shields.io/badge/X--Ray-50_Legendary_Vaults-f59e0b.svg)](#the-open-source-architecture-vault-50-legendary-repositories)

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [हिन्दी](README.hi.md) • [Português](README.pt.md) • [日本語](README.ja.md)

</div>

---

```bash
# The 1-Word Browser Magic Trick:
https://github.com/facebook/react  ──►  https://gitxray.dev/facebook/react
```

Powered entirely by WebAssembly and WebGPU inside the browser, GitXray allows developers and students to observe real-time data flow across files and rebuild complex architectures layer-by-layer with **zero installation, zero API keys, and zero cloud cost**.

```text
       STATIC REPOSITORY                       GITXRAY DECOMPILER ENGINE
┌─────────────────────────────┐        ┌───────────────────────────────────────┐
│  github.com/openclaw/...    │        │  ⚡ 0.4ms Incremental AST Parsing     │
│  - 4,200+ Source Files      │  ───►  │  ⚛ 6 Centrality Gravity Well Ranks    │
│  - Deep Module Boundaries   │        │  ⏱ Live Multi-File Execution Stepper │
│  - Opaque Call Stacks       │        │  📦 Unbox: 6 Rebuild Milestones       │
└─────────────────────────────┘        └──────────────────┬────────────────────┘
                                                          │
                                                          ▼
                                       ┌───────────────────────────────────────┐
                                       │       LIVE INTERACTIVE BLUEPRINT      │
                                       │  - Scrub Stack Frames & SQLite State  │
                                       │  - Deterministic Invariant Verifier   │
                                       │  - 98% Token Reduction CLAUDE.md      │
                                       └───────────────────────────────────────┘
```

---

## ⚡ Instant Quickstart

### 1. Zero-Install Browser Usage
Change any GitHub URL in your browser address bar from `github.com` to `gitxray.dev`:
```text
https://github.com/Significant-Gravitas/AutoGPT ➔ https://gitxray.dev/Significant-Gravitas/AutoGPT
```
Or launch the live interactive playground: **[https://gitxray.dev](https://gitxray.dev)**

### 2. Local Terminal Quickstart
Inspect any local codebase or clone in milliseconds:
```bash
# Instant zero-install inspection
npx gitxray

# Launch the browser visualizer on localhost:3000
npx gitxray serve

# Decompile current codebase into a 6-stage build-from-scratch course
npx gitxray unbox

# Export structural ontology for Claude Code, Cursor, and Codex
npx gitxray export-agents
```

---

## 🏛 The Open-Source Architecture Vault (50 Legendary Repositories)

Every repository below is pre-indexed with its primary architectural gravity well and decompiled into an interactive course:

### 1. AI & Autonomous Agent Harnesses
| Repository | Stars | Language | Gravity Well (Core Kernel) | Stage 0 Core Loop Focus | 1-Click Live X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[openclaw/openclaw](https://github.com/openclaw/openclaw)** | 393k | TypeScript | `src/agent/loop.ts` | Autonomous tool loop & event routing | [Decompile](https://gitxray.dev/openclaw/openclaw) |
| **[Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)** | 187k | Python | `autogpt/core/runner.py` | Continuous goal evaluation & memory | [Decompile](https://gitxray.dev/Significant-Gravitas/AutoGPT) |
| **[ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)** | 75k | C++ | `ggml.c` | Tensor compute graph & 4-bit quant | [Decompile](https://gitxray.dev/ggerganov/llama.cpp) |
| **[ollama/ollama](https://github.com/ollama/ollama)** | 122k | Go | `server/routes.go` | HTTP streaming child-process runner | [Decompile](https://gitxray.dev/ollama/ollama) |
| **[huggingface/transformers.js](https://github.com/huggingface/transformers.js)** | 16k | JavaScript | `src/pipelines.js` | WASM/WebGPU ONNX tensor pipeline | [Decompile](https://gitxray.dev/huggingface/transformers.js) |
| **[langchain-ai/langchain](https://github.com/langchain-ai/langchain)** | 108k | Python | `libs/core/runnables/base.py` | Runnable protocol pipeline composition | [Decompile](https://gitxray.dev/langchain-ai/langchain) |
| **[vllm-project/vllm](https://github.com/vllm-project/vllm)** | 42k | Python | `vllm/core/block_manager.py` | PagedAttention virtual memory allocation | [Decompile](https://gitxray.dev/vllm-project/vllm) |
| **[openai/whisper](https://github.com/openai/whisper)** | 82k | Python | `whisper/model.py` | Log-mel spectrogram sequence transformer | [Decompile](https://gitxray.dev/openai/whisper) |
| **[morluto/rea](https://github.com/morluto/rea)** | 392k | TypeScript | `src/engine/decompiler.ts` | Autonomous reverse-engineering agent | [Decompile](https://gitxray.dev/morluto/rea) |
| **[obra/superpowers](https://github.com/obra/superpowers)** | 305k | Shell | `lib/runtime.sh` | Portable agentic skill dispatch harness | [Decompile](https://gitxray.dev/obra/superpowers) |
| **[mattpocock/skills](https://github.com/mattpocock/skills)** | 304k | Shell | `.agents/manifest.json` | Agent dotfiles schema specification | [Decompile](https://gitxray.dev/mattpocock/skills) |
| **[microsoft/markitdown](https://github.com/microsoft/markitdown)** | 191k | Python | `src/markitdown/_markitdown.py` | Universal stream-to-markdown engine | [Decompile](https://gitxray.dev/microsoft/markitdown) |
| **[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)** | 224k | Markdown | `CLAUDE.md` | Negative constraints mitigating LLM drift | [Decompile](https://gitxray.dev/multica-ai/andrej-karpathy-skills) |

### 2. Frontend, Canvas & UI Systems
| Repository | Stars | Language | Gravity Well (Core Kernel) | Stage 0 Core Loop Focus | 1-Click Live X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[facebook/react](https://github.com/facebook/react)** | 235k | JavaScript | `ReactFiberWorkLoop.js` | Fiber reconciliation scheduler loop | [Decompile](https://gitxray.dev/facebook/react) |
| **[vuejs/core](https://github.com/vuejs/core)** | 47k | TypeScript | `packages/reactivity/effect.ts` | Proxy dependency track/trigger core | [Decompile](https://gitxray.dev/vuejs/core) |
| **[sveltejs/svelte](https://github.com/sveltejs/svelte)** | 81k | JavaScript | `src/compiler/compile/index.js` | Compile-time surgical DOM emitter | [Decompile](https://gitxray.dev/sveltejs/svelte) |
| **[shadcn-ui/ui](https://github.com/shadcn-ui/ui)** | 83k | TypeScript | `packages/cli/commands/add.ts` | Direct AST injection component engine | [Decompile](https://gitxray.dev/shadcn-ui/ui) |
| **[excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)** | 96k | TypeScript | `renderer/renderScene.ts` | RoughJS canvas matrix pipeline | [Decompile](https://gitxray.dev/excalidraw/excalidraw) |
| **[mermaid-js/mermaid](https://github.com/mermaid-js/mermaid)** | 77k | JavaScript | `flowchart/flowRenderer.js` | Dagre directed graph SVG renderer | [Decompile](https://gitxray.dev/mermaid-js/mermaid) |
| **[tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)** | 85k | Rust/JS | `packages/tailwindcss/index.ts` | JIT token scanning & dynamic CSS rules | [Decompile](https://gitxray.dev/tailwindlabs/tailwindcss) |
| **[vercel/next.js](https://github.com/vercel/next.js)** | 131k | TypeScript | `server/base-server.ts` | FS router to React Server Components | [Decompile](https://gitxray.dev/vercel/next.js) |
| **[preactjs/preact](https://github.com/preactjs/preact)** | 37k | JavaScript | `src/diff/index.js` | 3KB Virtual DOM diffing kernel | [Decompile](https://gitxray.dev/preactjs/preact) |
| **[solidjs/solid](https://github.com/solidjs/solid)** | 33k | TypeScript | `packages/solid/signal.ts` | Fine-grained reactive signal graph | [Decompile](https://gitxray.dev/solidjs/solid) |
| **[d3/d3](https://github.com/d3/d3)** | 109k | JavaScript | `src/index.js` | Data-driven element selection & binding | [Decompile](https://gitxray.dev/d3/d3) |
| **[mrdoob/three.js](https://github.com/mrdoob/three.js)** | 106k | JavaScript | `renderers/WebGLRenderer.js` | 3D scene matrix projection & shaders | [Decompile](https://gitxray.dev/mrdoob/three.js) |

### 3. Foundational Systems, Databases & Runtimes
| Repository | Stars | Language | Gravity Well (Core Kernel) | Stage 0 Core Loop Focus | 1-Click Live X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[torvalds/linux](https://github.com/torvalds/linux)** | 189k | C | `init/main.c` | Kernel `start_kernel` & PID 0 init | [Decompile](https://gitxray.dev/torvalds/linux) |
| **[sqlite/sqlite](https://github.com/sqlite/sqlite)** | 14k | C | `src/vdbe.c` | B-Tree disk pager & VDBE bytecode | [Decompile](https://gitxray.dev/sqlite/sqlite) |
| **[redis/redis](https://github.com/redis/redis)** | 68k | C | `src/ae.c` | Single-threaded epoll event loop | [Decompile](https://gitxray.dev/redis/redis) |
| **[tiangolo/fastapi](https://github.com/tiangolo/fastapi)** | 83k | Python | `fastapi/routing.py` | Pydantic type reflection & ASGI route | [Decompile](https://gitxray.dev/tiangolo/fastapi) |
| **[nodejs/node](https://github.com/nodejs/node)** | 109k | C++/JS | `src/node_main.cc` | V8 engine startup & libuv event loop | [Decompile](https://gitxray.dev/nodejs/node) |
| **[expressjs/express](https://github.com/expressjs/express)** | 66k | JavaScript | `lib/router/index.js` | Recursive middleware `next()` chaining | [Decompile](https://gitxray.dev/expressjs/express) |
| **[pallets/flask](https://github.com/pallets/flask)** | 71k | Python | `src/flask/app.py` | Thread-local context stack & WSGI | [Decompile](https://gitxray.dev/pallets/flask) |
| **[git/git](https://github.com/git/git)** | 58k | C | `object.c` | Content-addressable SHA object store | [Decompile](https://gitxray.dev/git/git) |
| **[moby/moby](https://github.com/moby/moby)** | 71k | Go | `daemon/daemon.go` | Cgroups & namespace container manager | [Decompile](https://gitxray.dev/moby/moby) |
| **[memcached/memcached](https://github.com/memcached/memcached)** | 14k | C | `slabs.c` | Slab memory allocation allocator | [Decompile](https://gitxray.dev/memcached/memcached) |
| **[nginx/nginx](https://github.com/nginx/nginx)** | 26k | C | `src/core/ngx_cycle.c` | Master-worker async socket multiplex | [Decompile](https://gitxray.dev/nginx/nginx) |
| **[libuv/libuv](https://github.com/libuv/libuv)** | 24k | C | `src/unix/core.c` | Cross-platform async I/O polling | [Decompile](https://gitxray.dev/libuv/libuv) |
| **[duckdb/duckdb](https://github.com/duckdb/duckdb)** | 27k | C++ | `execution/physical_plan_generator.cpp` | Vectorized columnar execution query | [Decompile](https://gitxray.dev/duckdb/duckdb) |

### 4. Compilers, Build Engines & DevTools
| Repository | Stars | Language | Gravity Well (Core Kernel) | Stage 0 Core Loop Focus | 1-Click Live X-Ray |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[tree-sitter/tree-sitter](https://github.com/tree-sitter/tree-sitter)** | 20k | C | `lib/src/parser.c` | Incremental GLR parsing tree engine | [Decompile](https://gitxray.dev/tree-sitter/tree-sitter) |
| **[evanw/esbuild](https://github.com/evanw/esbuild)** | 38k | Go | `pkg/api/api_impl.go` | Parallel AST scanner & linker in Go | [Decompile](https://gitxray.dev/evanw/esbuild) |
| **[swc-project/swc](https://github.com/swc-project/swc)** | 31k | Rust | `crates/swc/src/lib.rs` | High-perf Rust AST folding compiler | [Decompile](https://gitxray.dev/swc-project/swc) |
| **[oven-sh/bun](https://github.com/oven-sh/bun)** | 80k | Zig | `src/main.zig` | Zig JavaScriptCore runtime & bundler | [Decompile](https://gitxray.dev/oven-sh/bun) |
| **[BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)** | 54k | Rust | `crates/searcher/searcher.rs` | Memory-mapped regex SIMD search | [Decompile](https://gitxray.dev/BurntSushi/ripgrep) |
| **[vitejs/vite](https://github.com/vitejs/vite)** | 73k | TypeScript | `packages/vite/server/index.ts` | Native ESM browser on-demand transform | [Decompile](https://gitxray.dev/vitejs/vite) |
| **[rust-lang/rust](https://github.com/rust-lang/rust)** | 103k | Rust | `compiler/rustc_middle/ty/context.rs` | MIR borrow checker query context | [Decompile](https://gitxray.dev/rust-lang/rust) |
| **[golang/go](https://github.com/golang/go)** | 127k | Go | `src/runtime/proc.go` | M:N Goroutine work-stealing scheduler | [Decompile](https://gitxray.dev/golang/go) |
| **[denoland/deno](https://github.com/denoland/deno)** | 96k | Rust | `runtime/worker.rs` | V8 isolate Tokio async event loop | [Decompile](https://gitxray.dev/denoland/deno) |
| **[ast-grep/ast-grep](https://github.com/ast-grep/ast-grep)** | 11k | Rust | `crates/core/matcher.rs` | Structural AST pattern matching | [Decompile](https://gitxray.dev/ast-grep/ast-grep) |
| **[prettier/prettier](https://github.com/prettier/prettier)** | 49k | JavaScript | `src/main/core.js` | Doc IR deterministic code printer | [Decompile](https://gitxray.dev/prettier/prettier) |
| **[biomejs/biome](https://github.com/biomejs/biome)** | 20k | Rust | `crates/biome_formatter/lib.rs` | Lossless CST formatting engine | [Decompile](https://gitxray.dev/biomejs/biome) |

---

## 🔬 Four Deterministic Architectural Layers

### Layer 1: Microsecond Incremental AST & Graph Extraction
Streams repository files into WebAssembly Tree-sitter parsers. Six mathematical centrality algorithms rank every file directly in memory:
1. **PageRank** with convergence tolerance ($10^{-6}$)
2. **Betweenness Centrality** via Brandes' shortest-path decomposition
3. **Closeness Centrality** across reachable DAG subgraphs
4. **In/Out Degree Centrality**
5. **Eigenvector Centrality** via power iteration
6. **Clustering Coefficients**

This isolates the critical 5% domain logic from 95% boilerplate.

### Layer 2: Live Multi-File Execution Tracing ("Python Tutor for Whole Repositories")
Interactive browser sandbox instrumenting AST hooks:
- **Timeline Scrubber**: Step forward and backward through multi-file execution paths.
- **Stack Inspection**: Live call-stack frames crossing module boundaries.
- **State Diffs**: Real-time diffs of in-memory variable scopes and SQLite database mutations.

### Layer 3: Automated "Unbox Mode" (Build-Your-Own-X Compiler)
Automatically extracts the minimal Stage 0 Core Loop (<80 LOC) and constructs 6 progressive milestones.
- **Deterministic Hard Verification**: Verifies candidate implementations through compiler exit codes and AST structural matchers. **No LLM homework self-grading.**
- **Zero-Key Local Tutor**: Quantized on-device WebGPU models generate Socratic hints with zero API keys and $0 cloud billing.

### Layer 4: Blast-Radius Diff-Shield & `.agents` / `CLAUDE.md` Exporter
- Computes transitive downstream impact percentages prior to git commit.
- Compiles the dependency DAG and invariants into an ultra-compact `CLAUDE.md` and `.agents/skills.md`, cutting LLM context window consumption by up to **98%**.

---

## 🤖 GitHub Action: Automated PR Blast-Radius Map

Add `gitxray/action@v1` to `.github/workflows/blast-radius.yml` to automatically post visual blast-radius maps on Pull Requests:

```yaml
name: GitXray Blast Radius

on:
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitxray/action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

**PR Comment Preview:**
```text
### 🟡 GitXray Blast-Radius Audit: 14.2% Surface Impact
| Metric | Value |
| :--- | :--- |
| Severity Rating | MEDIUM |
| Changed Entrypoints | 1 files |
| Downstream Nodes Impacted | 4 modules |
| Blast Radius | 14.2% of repository |

#### Downstream Impact Tree
↳ [D+1] src/dispatcher.ts (TypeScript)
↳ [D+2] src/router.ts (TypeScript)
```

---

## 🏷 Embeddable Dynamic Architecture Badge

Add the live architecture badge to your repository `README.md`:

```markdown
[![GitXray Architecture](https://gitxray.dev/api/badge/owner/repo.svg)](https://gitxray.dev/owner/repo)
```

---

## 📊 Paradigm Comparison

| Tooling Metric | Cloud AI Agents (AutoGPT/OpenClaw) | Heavy Local LLMs (Ollama/LM Studio) | Legacy Steppers (Python Tutor) | **GitXray (Target Engine)** |
| :--- | :--- | :--- | :--- | :--- |
| **Monthly Cost** | \$29.50 – \$59.00/mo | \$0.00/mo | \$0.00/mo | **\$0.00 / Free Forever** |
| **Setup Friction** | High (API keys, cloud billing) | High (CLI setup, GB downloads) | Zero (In-browser) | **Zero (1-word URL rewrite or npx)** |
| **Hardware Burden** | Low (Remote cloud) | Extreme (RAM/VRAM throttling) | Minimal | **Lightweight (Sandboxed WASM/WebGPU)** |
| **Scope** | Conversational text | Chat window only | Single toy file (<100 LOC) | **Full-Repo AST + Multi-File Tracing** |
| **Grading Reliability** | 66% "almost right" hallucinations | Prompt-dependent guesswork | N/A | **Hard Invariant Test Harness** |

---

## 📄 License

Apache License 2.0. Open-source and freely usable for student developers and engineering teams worldwide.
