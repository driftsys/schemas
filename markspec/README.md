# MarkSpec Schema Contract

JSON Schema contracts for MarkSpec site API artifacts. Validate payloads against
the matching schema before processing.

## Discovery Protocol

1. Determine payload kind (entry, reference, component, index, search, matrix,
   graph, coverage, bom, deps, diagnostics, lock).
2. Select the matching `v1.json` from the schema index below.
3. Validate payload against the schema before parsing.
4. Parse required fields first, optional fields second.
5. Treat all schemas as closed unless they explicitly allow extension.
6. Stop on unknown version.

## Schema Index

| Contract                                                      | JSON Schema                       | What it describes                          | Stable key                |
| ------------------------------------------------------------- | --------------------------------- | ------------------------------------------ | ------------------------- |
| [markspec/lock](lock/README.md)                               | [v1](lock/v1.json)                | Frozen sidecar metadata (`.markspec.lock`) | ULID map key              |
| [markspec/link-target](link-target/README.md)                 | [v1](link-target/v1.json)         | Shared resolved-link target object         | `displayId`               |
| [markspec/entry](entry/README.md)                             | [v1](entry/v1.json)               | Typed entry detail payload                 | `id` (ULID) / `displayId` |
| [markspec/reference](reference/README.md)                     | [v1](reference/v1.json)           | Reference entry payload                    | `id` (ULID) / `displayId` |
| [markspec/index](index/README.md)                             | [v1](index/v1.json)               | Entry listing payload                      | `entries[].displayId`     |
| [markspec/search](search/README.md)                           | [v1](search/v1.json)              | Search records for client indexing         | `displayId`               |
| [markspec/traceability-matrix](traceability-matrix/README.md) | [v1](traceability-matrix/v1.json) | Full traceability matrix rows              | `rows[].displayId`        |
| [markspec/traceability-graph](traceability-graph/README.md)   | [v1](traceability-graph/v1.json)  | Graph nodes and edges                      | `nodes[].id`              |
| [markspec/coverage](coverage/README.md)                       | [v1](coverage/v1.json)            | Coverage summary and gaps                  | `gaps[].displayId`        |
| [markspec/bom](bom/README.md)                                 | [v1](bom/v1.json)                 | BOM index (component summaries)            | `components[].displayId`  |
| [markspec/component](component/README.md)                     | [v1](component/v1.json)           | BOM component detail payload               | `id` (ULID) / `displayId` |
| [markspec/diagnostics](diagnostics/README.md)                 | [v1](diagnostics/v1.json)         | Validation and build diagnostics           | `code + location`         |

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
