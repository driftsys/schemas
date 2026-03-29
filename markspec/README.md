# MarkSpec Schema Contract

JSON Schema contracts for MarkSpec site API artifacts. Validate payloads against
the matching schema before processing.

## Discovery Protocol

1. Determine payload kind (entry, reference, index, search, matrix, graph,
   coverage, bom, deps, diagnostics, lock).
2. Select the matching `v1.json` from the schema index below.
3. Validate payload against the schema before parsing.
4. Parse required fields first, optional fields second.
5. Treat all schemas as closed unless they explicitly allow extension.
6. Stop on unknown version.

## Schema Index

| Schema path                                                | What it describes                          | Stable key                |
| ---------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| [lock/v1.json](lock/v1.json)                               | Frozen sidecar metadata (`.markspec.lock`) | ULID map key              |
| [link-target/v1.json](link-target/v1.json)                 | Shared resolved-link target object         | `displayId`               |
| [entry/v1.json](entry/v1.json)                             | Typed entry detail payload                 | `id` (ULID) / `displayId` |
| [reference/v1.json](reference/v1.json)                     | Reference entry payload                    | `id` (ULID) / `displayId` |
| [index/v1.json](index/v1.json)                             | Entry listing payload                      | `entries[].displayId`     |
| [search/v1.json](search/v1.json)                           | Search records for client indexing         | `displayId`               |
| [traceability-matrix/v1.json](traceability-matrix/v1.json) | Full traceability matrix rows              | `rows[].displayId`        |
| [traceability-graph/v1.json](traceability-graph/v1.json)   | Graph nodes and edges                      | `nodes[].id`              |
| [coverage/v1.json](coverage/v1.json)                       | Coverage summary and gaps                  | `gaps[].displayId`        |
| [bom/v1.json](bom/v1.json)                                 | Architecture/BOM tree                      | `bomNode.displayId`       |
| [deps/v1.json](deps/v1.json)                               | Cross-project dependency payload           | `refs[].from/to`          |
| [diagnostics/v1.json](diagnostics/v1.json)                 | Validation and build diagnostics           | `code + location`         |

## Validation Contract

Validate early so downstream logic stays predictable.

1. Validation must happen before business logic parsing.
2. Missing required fields means hard failure.
3. Unknown optional fields may be ignored only if the schema allows additional
   properties.
4. If schema fetch fails, return a schema-unavailable error.

## Failure Modes

- **unsupported-version** — schema version is not recognized. Stop processing.
- **schema-unavailable** — schema URL cannot be fetched. Return error.
- **validation-failed** — payload does not match schema. Reject payload.
- **unknown-payload-kind** — payload kind cannot be determined. Return error.

## Version Policy

- Breaking changes create a new major version path (`v2.json`).
- Non-breaking additions stay in the current major version.
- Consumers should pin to a major version.

## Conventions

- Each schema lives in `<name>/v1.json`.
- Schema-local docs live in `<name>/README.md`.
- Schema fixtures live in `<name>/tests/`.
- `$id` follows `https://driftsys.github.io/schemas/markspec/<name>/v1.json`.

## Quick Example

Input kind: entry\
Schema: `markspec/entry/v1.json`

1. Validate payload against entry schema.
2. Parse required fields (`displayId`, `type`, `title`).
3. Parse optional fields (`body`, `attributes`, `links`, etc.).
4. Reject if version is unknown.
