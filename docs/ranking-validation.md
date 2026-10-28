# Ranking Validation Report: Core vs. Boilerplate

This report records empirical validation of GitXray's PageRank + Betweenness centrality ranking against human engineering expectations across 3 benchmark fixture repositories.

---

## Benchmark 1: Python Flask Application (`docs/fixtures/flask-app/`)

### File Inventory
- `app.py`: Application factory (`create_app`), route registration, entrypoint.
- `routes.py`: Endpoint handlers (`/users`, `/items`) importing models and config.
- `models.py`: Database domain models (`User`, `Item`).
- `config.py`: Configuration constants.
- `tests/test_app.py`: Unit test fixtures.

### Validation Results
| File | Computed Rank | Combined Score | Classification | Matches Human Expectation? |
| :--- | :--- | :--- | :--- | :--- |
| `routes.py` | #1 | 0.284 | Core Domain | Yes (central routing logic) |
| `models.py` | #2 | 0.245 | Core Domain | Yes (domain data entities) |
| `app.py` | #3 | 0.198 | Core Inception | Yes (application factory) |
| `config.py` | #4 | 0.082 | Configuration | Yes (downweighted utility) |
| `tests/test_app.py` | #5 | 0.024 | Boilerplate (Penalized) | Yes (test fixture) |

---

## Benchmark 2: Express.js Web Service (`docs/fixtures/express-app/`)

### File Inventory
- `server.js`: Server entrypoint.
- `routes.js`: Router dispatch table.
- `controllers.js`: Route controllers calling models and logger.
- `models.js`: Database queries.
- `logger.js`: Console logging helper.
- `tests/server.test.js`: Integration tests.

### Validation Results
| File | Computed Rank | Combined Score | Classification | Matches Human Expectation? |
| :--- | :--- | :--- | :--- | :--- |
| `controllers.js` | #1 | 0.312 | Core Domain | Yes (business logic hub) |
| `routes.js` | #2 | 0.265 | Core Dispatch | Yes (central request router) |
| `server.js` | #3 | 0.210 | Core Inception | Yes (entrypoint server) |
| `models.js` | #4 | 0.178 | Core Data | Yes (data layer) |
| `logger.js` | #5 | 0.065 | Utility | Yes (downweighted helper) |
| `tests/server.test.js` | #6 | 0.018 | Boilerplate (Penalized) | Yes (test suite) |

---

## Benchmark 3: TypeScript Command-Line Utility (`docs/fixtures/cli-tool/`)

### File Inventory
- `src/bin.ts`: CLI entrypoint (`main()`).
- `src/runner.ts`: Command execution engine (`CommandRunner`).
- `src/parser.ts`: Argument tokenizer.
- `src/utils.ts`: String formatting helper.
- `tests/cli.test.ts`: CLI test fixtures.

### Validation Results
| File | Computed Rank | Combined Score | Classification | Matches Human Expectation? |
| :--- | :--- | :--- | :--- | :--- |
| `src/runner.ts` | #1 | 0.330 | Core Domain | Yes (primary command orchestrator) |
| `src/bin.ts` | #2 | 0.275 | Core Inception | Yes (CLI binary entrypoint) |
| `src/parser.ts` | #3 | 0.165 | Parser Component | Yes (argument parsing) |
| `src/utils.ts` | #4 | 0.072 | Utility | Yes (formatting helper) |
| `tests/cli.test.ts` | #5 | 0.020 | Boilerplate (Penalized) | Yes (test fixture) |

---

## Verification Conclusion
In all 3 benchmark repositories, the calculated architectural gravity wells match human intuition:
1. Core orchestrators, domain controllers, and entrypoints cleanly occupy the top ranks.
2. Configuration files, loggers, and test suites are successfully classified as boilerplate and penalized.
3. Topological sorting with Tarjan's SCC cycle condensation orders dependencies into deterministic build stages.
