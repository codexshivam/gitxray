# gitxray - Architectural Ontology & Invariants
> Compiled by GitXray Engine (Nodes: 11, Edges: 9)

## Architectural Gravity Wells (Core Domain Kernels)
These files account for the core domain logic. Any edits here have maximal downstream blast-radius:
- `core/engine.js` (PageRank: 0.0787, Gravity: 0.1515)

## Structural Rules & Invariants
1. **Zero Silent State Drift**: Never introduce implicit circular dependencies crossing module boundaries.
2. **Downstream Blast-Radius Containment**: When touching gravity-well nodes, verify all callers and test cases.
3. **Pure Boundary Contracts**: Public exports must maintain explicit type signatures and handle upstream exceptions.

## Primary Dependency Flow
```text
core/engine.js
```
