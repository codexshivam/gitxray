# GitXray Progress Log

## Phase Overview
- **Phase 0: Scaffold** — In Progress
- **Phase 1: Repo Ingestion + Parsing (core)** — In Progress
- **Phase 2: Graph + Ranking (core)** — Pending
- **Phase 3: Web App Shell + Graph View (web)** — Pending
- **Phase 4: Execution Tracing (Python Pyodide)** — Pending
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
- **Status**: In Progress
- **What's Done**:
  - Defined `LanguageAdapter` interface with support for Python, JavaScript, and TypeScript.
  - Extracted imports, definitions (functions, classes), and call sites per file.
  - Handled GitHub tree ingestion via `/git/trees/:sha?recursive=1` and `raw.githubusercontent.com`.
  - Implemented client-side caching abstraction (IndexedDB in browser, Memory in Node).
  - Rate-limit detection with token prompt hook.
  - Golden-file fixtures and tests created for Python, TypeScript, and JavaScript.
  - Graceful syntax-error tolerance without crashing parsing pipeline.
- **Known Gaps / Stubbed**:
  - WebAssembly tree-sitter binaries bundled for browser serving; Node fallback parser provides immediate AST extraction.
