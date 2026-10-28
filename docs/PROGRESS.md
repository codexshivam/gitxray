# GitXray Progress Log

## Phase Overview
- **Phase 0: Scaffold** — Completed
- **Phase 1: Repo Ingestion + Parsing (core)** — Completed
- **Phase 2: Graph + Ranking (core)** — Completed
- **Phase 3: Web App Shell + Graph View (web)** — Completed
- **Phase 4: Execution Tracing (Python Pyodide)** — Completed
- **Phase 5: Unbox Mode** — Pending
- **Phase 6: Explanations (Local AI)** — Pending
- **Phase 7: Exporters + Viral Surfaces** — Pending
- **Phase 8: Vault + README** — Pending
- **Phase 9: Hardening** — Pending

---

### Phase 0: Scaffold
- **Status**: Completed
- **What's Done**:
  - pnpm monorepo initialized with `packages/core`, `packages/web`, `packages/cli`, `packages/action`, `packages/vault`.
  - Strict TypeScript config (`tsconfig.base.json`), ESLint, Prettier configured.
  - Vitest test runner integrated across workspaces.
  - CI workflow (`.github/workflows/ci.yml`) set up for lint, typecheck, test, and build.
  - `LICENSE` (MIT), `docs/PROGRESS.md`, `docs/LICENSES.md` created.
- **Known Gaps / Stubbed**: None.

---

### Phase 1: Repo Ingestion + Parsing (core)
- **Status**: Completed
- **What's Done**:
  - Defined `LanguageAdapter` interface with support for Python, JavaScript, and TypeScript.
  - Extracted imports, definitions (functions, classes), and call sites per file.
  - Handled GitHub tree ingestion via `/git/trees/:sha?recursive=1` and `raw.githubusercontent.com`.
  - Implemented client-side caching abstraction (IndexedDB in browser, Memory in Node).
  - Rate-limit detection with token prompt hook.
  - Golden-file fixtures and tests created for Python, TypeScript, and JavaScript.
  - Graceful syntax-error tolerance without crashing parsing pipeline.
- **Known Gaps / Stubbed**: None.

---

### Phase 2: Graph + Ranking (core)
- **Status**: Completed
- **What's Done**:
  - Built file-level and symbol-level graphs (`CodeGraph`) with intra-file and cross-file resolution.
  - Implemented PageRank with convergence detection and dangling node redistribution (`CentralityEngine`).
  - Implemented Brandes' betweenness centrality for directed graphs.
  - Implemented normalized in-degree and out-degree centrality.
  - Implemented "Core vs. Boilerplate" combined scoring algorithm with automatic penalty discounts for test/config/migration patterns.
  - Implemented Tarjan's Strongly Connected Components (SCC) condensation and topological stage ordering, collapsing cyclic cliques into composite stages.
  - Validated rankings on 3 benchmark fixtures (Flask, Express, and CLI tool) matching human expectations; documented in `docs/ranking-validation.md`.
- **Known Gaps / Stubbed**:
  - Eigenvector, closeness, and clustering metrics intentionally skipped until later phases as instructed.

---

### Phase 3: Web App Shell + Graph View (web)
- **Status**: Completed
- **What's Done**:
  - Configured Tailwind CSS, PostCSS, responsive design tokens, and custom scrollbar theme.
  - Implemented client-side routing & URL parsing (`/:owner/:repo`, `?repo=owner/repo`, `#/owner/repo`, full GitHub URLs).
  - Built Landing Page hero with 1-click showcase repository cards from `@gitxray/vault`.
  - Implemented `useRepoAnalysis` hook streaming files into `@gitxray/core` parser, graph builder, centrality engine, and ranking pipeline.
  - High-performance force-directed canvas graph renderer with Top-N node density slider (default 20), pan, zoom, auto-center, node drag, and glowing gravity well halos.
  - Interactive file inspector drawer with source code line viewer and clickable bidirectional dependency traversal (inbound callers & outbound imports).
  - Left collapsible sidebar ranking hierarchy displaying core kernels vs supporting modules.
  - Token manager with `localStorage` persistence and rate-limit error overlay offering instant sample fallback.
  - Playwright and Vitest test suites verifying URL handling, sample loading, graph rendering, and code inspection.
- **Known Gaps / Stubbed**: None.

---

### Phase 4: Execution Tracing (Python Pyodide)
- **Status**: Completed
- **What's Done**:
  - Defined versioned trace schema (`TraceStep`, `StackFrame`, `VariableSnapshot`, `TraceRunOptions`, `TraceResult`) in `@gitxray/core`.
  - Implemented Python execution tracer harness with `sys.settrace` capturing call, return, line events, frame locals snapshots, and return values.
  - Implemented multi-file Python execution tracing across modules (`main.py` -> `service.py` -> `helper.py`).
  - Added infinite loop & recursion guards with step cap (default 500) and wall-clock execution timeout (default 4000ms).
  - Built `ExecutionStepper` UI in `@gitxray/web` with timeline scrubber (play/pause, step forward/backward, speed controls, step slider).
  - Added active line pointer `▶` with highlighted code lines, Dynamic Call Stack panel, Variables & Scope inspector, and honest sandbox limitations banner.
  - Created Vitest trace unit tests in `@gitxray/core` and Playwright e2e tests in `@gitxray/web`.
- **Known Gaps / Stubbed**:
  - JS/TS tracer will follow in subsequent phases using the same trace schema.
