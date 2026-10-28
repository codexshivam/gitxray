# Contributing to GitXray

Thank you for your interest in contributing to **GitXray**! GitXray is a zero-install, browser-native tool that turns any public GitHub repository into an interactive architecture graph, a step-through execution tracer, and a "build it from scratch" course.

---

## 1. Development Setup

GitXray is organized as a strict TypeScript `pnpm` monorepo:

```bash
# Clone repository
git clone https://github.com/codexshivam/gitxray.git
cd gitxray

# Install dependencies
pnpm install

# Build all workspace packages
pnpm -r build

# Run all test suites
pnpm -r test

# Start the web app locally
pnpm --filter @gitxray/web dev
```

### Monorepo Structure
```text
packages/
  core/        # Parsing, graphology AST graph, ranking engine, tracer schema, exporters (zero DOM)
  web/         # Vite + React + Tailwind frontend (gitxray.dev)
  cli/         # npx gitxray CLI & local filesystem scanner
  action/      # GitHub Action for PR blast-radius maps (gitxray/action@v1)
  vault/       # 50 pre-built repository courses and curated milestones
docs/
  PROGRESS.md
  ranking-validation.md
```

---

## 2. Working Agreement & Standards

- **Vertical Slices**: Code must run end-to-end. Never stub things silently.
- **Run Before Claiming**: Run `pnpm run typecheck && pnpm -r build && pnpm -r test` before submitting changes.
- **Conventional Commits**: `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- **Pure Deterministic Verification**: In Unbox Mode, correctness is evaluated with deterministic AST inspection and test assertions, **never** LLM guessing.
- **Zero Heavy Native Dependencies**: Browser bundles must remain lightweight (<300 kB).

---

## 3. How to Add a New Language Adapter

GitXray parses codebases using tree-sitter adapters adhering to the `LanguageAdapter` interface in `packages/core/src/parsing/adapter.ts`:

1. Create `packages/core/src/parsing/adapters/<language>.ts`.
2. Implement the `LanguageAdapter` interface:
   ```typescript
   export interface LanguageAdapter {
     name: string;
     extensions: string[];
     parse(filePath: string, content: string): FileParseResult;
   }
   ```
3. Extract imports, definitions (functions, classes), and call sites.
4. Register the adapter in `packages/core/src/parsing/parser.ts`.
5. Add unit and golden-file tests in `packages/core/test/`.

---

## 4. How to Add a Curated Vault Course

1. Open `packages/vault/src/vault_data.ts`.
2. Add an entry to `CURATED_COURSES`:
   ```typescript
   'owner/repo': {
     repo: 'owner/repo',
     title: 'Build RepoName from Scratch',
     language: 'JavaScript', // or 'Python', 'TypeScript'
     isReviewed: true,
     stage0Summary: 'Brief summary of the foundational loop',
     milestones: [
       {
         id: 'stage-0',
         title: 'Stage 0: The Core Loop',
         stage: 0,
         description: 'Milestone objective description',
         targetFile: 'src/index.js',
         starterCode: '...',
         referenceSolution: '...',
         check: {
           type: 'composite',
           expectedSymbols: ['CoreClass'],
           testSnippet: '...'
         },
         hints: ['Clue 1', 'Clue 2']
       }
     ]
   }
   ```
3. Verify that `referenceSolution` passes the test suite by running:
   ```bash
   pnpm --filter @gitxray/vault test
   ```

---

## 5. Curated Good First Issues (25 Selected Tasks)

Looking for a place to start? Choose one of these scoped, high-impact tasks:

### Language Adapters
- `[GFI-01]` **Add Go LanguageAdapter**: Parse Go imports (`import (...)`), functions (`func ...`), and structs.
- `[GFI-02]` **Add Rust LanguageAdapter**: Parse Rust `use` statements, `fn`, `struct`, and `impl` blocks.
- `[GFI-03]` **Add Java LanguageAdapter**: Parse package declarations, imports, class hierarchies, and methods.
- `[GFI-04]` **Add C/C++ LanguageAdapter**: Parse `#include` directives, structs, and function signatures.
- `[GFI-05]` **Add Ruby LanguageAdapter**: Parse `require_relative`, classes, and modules.

### Curated Vault Courses
- `[GFI-06]` **Curated Course: `tiangolo/fastapi` Stage 1 & 2**: Add middleware pipeline and response serialization milestones.
- `[GFI-07]` **Curated Course: `huggingface/transformers`**: Create minimal AutoTokenizer BPE byte-pair encoding milestone.
- `[GFI-08]` **Curated Course: `vuejs/core`**: Build `reactive()` Proxy getter/setter effect tracker milestone.
- `[GFI-09]` **Curated Course: `sveltejs/svelte`**: Build dirty flag bitmask DOM fragment updater.
- `[GFI-10]` **Curated Course: `colinhacks/zod`**: Build string and number schema validator with `.parse()`.
- `[GFI-11]` **Curated Course: `zustandjs/zustand`**: Build vanilla store with `getState`, `setState`, and listener sets.
- `[GFI-12]` **Curated Course: `axios/axios`**: Build interceptor chain promise queue reducer.
- `[GFI-13]` **Curated Course: `chalk/chalk`**: Build ANSI escape code color wrapper chain.
- `[GFI-14]` **Curated Course: `preactjs/preact`**: Build minimal 50-line VNode diffing function.
- `[GFI-15]` **Curated Course: `honojs/hono`**: Build RegExp router tree matching algorithm.

### Core & Execution Tracing
- `[GFI-16]` **JavaScript Sandboxed Worker Tracer**: Implement line-by-line AST instrumented tracer for JS/TS via Web Worker.
- `[GFI-17]` **Graph Layout Optimizer**: Add Barnes-Hut quadtree repulsion to `GraphCanvas.tsx` for 100+ node graphs.
- `[GFI-18]` **Closeness Centrality Metric**: Implement normalized geodesic distance in `CentralityEngine`.
- `[GFI-19]` **Local File Drag-and-Drop Ingestion**: Allow users to drag a local `.zip` of a repository directly into GitXray.
- `[GFI-20]` **Offline PWA Service Worker**: Cache tree-sitter WASM grammars for complete offline usage.

### Exporters & Integrations
- `[GFI-21]` **Cursor Rules Exporter**: Add `.cursorrules` export format highlighting core modules and invariants.
- `[GFI-22]` **GitHub Action PR Summary Badge**: Add an SVG sparkline badge in the GitHub Action PR comment.
- `[GFI-23]` **Mermaid Interactive Drill-down**: Clickable links in exported Mermaid diagrams pointing directly to GitXray.
- `[GFI-24]` **CLI Color Output**: Add color highlighting for PageRank percentages in `gitxray inspect`.
- `[GFI-25]` **CLI JSON Output**: Add `--json` flag to `gitxray inspect` for programmatic pipeline integrations.
