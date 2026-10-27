# Contributing to GitXray

Thank you for contributing to GitXray!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/gitxray/gitxray.git
   cd gitxray
   ```
2. Run test suites:
   ```bash
   npm test
   ```
3. Run the local live decompiler visualizer:
   ```bash
   npm start
   ```

## Contribution Areas

1. **Parser Support**: Add AST symbol and import extractors for additional languages in `core/parser.js`.
2. **Centrality Algorithms**: Optimize graph calculations in `core/graph.js`.
3. **Architecture Vault**: Submit new decompiled course blueprints for iconic repositories in `core/vault_data.js`.
4. **Execution Tracers**: Expand step simulation and state diffing in `core/tracer.js`.
