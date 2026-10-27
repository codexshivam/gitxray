# GitXray Engineering Specification & Guidelines

## 1. What we are building
GitXray: a zero-install, browser-native tool that turns any public GitHub repo into:
- a ranked architecture graph (what matters vs. boilerplate),
- a step-through execution trace across files ("Python Tutor for whole repos"),
- Unbox Mode: an auto-generated "build it from scratch" course (Stage 0 core loop + 5–10 milestones) checked by deterministic tests,
- a one-click CLAUDE.md / .agents/skills.md exporter,
- an embeddable SVG architecture badge and a GitHub Action that comments a blast-radius map on PRs.

Pitch: replace github.com with gitxray.dev in any repo URL (or run npx gitxray).
Everything runs client-side: no server, no API keys required, no cloud cost.

## 2. Working agreement
- Ship vertical slices. After each phase the app must run end to end, even if narrow.
- Never claim something works without running it. Run the build, tests, and the app. Paste real command output in summary.
- Small commits, conventional messages (feat:, fix:, test:, docs:).
- Tests required for every core function. Use Vitest. Golden-file tests for graph output.
- Pin dependency versions. Prefer well-maintained packages. Check licenses before adding anything.
- No fake engagement. No star buying, no bot accounts, no fabricated metrics or testimonials in the README.
- Ask before large scope changes, adding a paid service, or adding a dependency with a restrictive license.
- When blocked, write what you tried and the exact error, then propose 2 options. Don't silently stub things.
- Keep a docs/PROGRESS.md log: phase, what's done, what's stubbed, known issues.

## 3. Tech stack
- Monorepo: pnpm workspaces + TypeScript (strict)
- Web app: Vite + React + Tailwind
- Parsing: web-tree-sitter + prebuilt grammar WASM files
- Graph + ranking: TypeScript with graphology (+ graphology-metrics)
- Graph store: In-memory (graphology)
- Graph rendering: Cytoscape.js or d3-force on canvas
- Python execution: Pyodide in a Web Worker
- JS/TS execution: Sandboxed iframe + Web Worker with instrumented code
- Local AI: Transformers.js + WebGPU, small instruct model, behind a toggle
- CLI: Node, commander, shares core
- Tests: Vitest, Playwright for web e2e

## 4. Repo layout
```text
gitxray/
  packages/
    core/        # parsing, graph, ranking, trace schema, exporters (no DOM)
    web/         # Vite app (gitxray.dev)
    cli/         # npx gitxray
    action/      # GitHub Action (gitxray/action@v1)
    vault/       # pre-built course JSON for 50 famous repos
  docs/
  AGENTS.md
  README.md
```

## 5. Phases
- Phase 0: Scaffold (pnpm monorepo, strict TS, ESLint, Prettier, Vitest, CI)
- Phase 1: Repo ingestion + parsing (core)
- Phase 2: Graph + ranking (core)
- Phase 3: Web app shell + graph view (web)
- Phase 4: Execution tracing (start with Python)
- Phase 5: Unbox Mode (the signature feature)
- Phase 6: Explanations (optional layer, off by default until stable)
- Phase 7: Exporters + viral surfaces
- Phase 8: Vault + README
- Phase 9: Hardening

## 6. Definition of done (per phase)
- Code merged to main with CI green.
- Tests added and passing; e2e where UI is involved.
- docs/PROGRESS.md updated, including known gaps.
- A short demo note: exact commands to see the feature working.
