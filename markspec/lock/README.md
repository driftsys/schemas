# MarkSpec lock schema (`markspec/lock/v1.json`)

This schema defines `.markspec.lock`, a machine-managed file that stores frozen
traceability metadata outside Markdown source files.

## Purpose

- preserve provenance metadata even when git history is rewritten
- keep author-facing Markdown concise
- persist external tool synchronization references

## Key structure

- `entries`: object keyed by ULID
- each entry stores at least `displayId`
- optional provenance fields: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`
- optional external mappings under `external.<tool>` with `ref`, `direction`,
  and `syncedAt`

## Field descriptions

### Top-level

- `$schema` (optional): URI of the schema used by this lock file.
- `entries` (required): object containing one record per ULID.

### `entries` map

- key: ULID string for an entry/reference.
- value: metadata object for that ULID.

### Entry metadata fields

- `displayId` (required): current display ID mapped to the ULID.
- `createdAt` (optional): creation timestamp (ISO 8601, date-time).
- `createdBy` (optional): creation author identifier.
- `updatedAt` (optional): latest content update timestamp (ISO 8601).
- `updatedBy` (optional): latest content update author identifier.
- `external` (optional): per-tool sync metadata object.

### `external.<tool>` fields

- key: tool name (for example `jira`, `polarion`).
- `ref` (required): external record identifier in that tool.
- `direction` (required): one of `import`, `export`, `bidirectional`.
- `syncedAt` (optional): last successful sync timestamp (ISO 8601).

## Notes

- this schema is referenced by:
  - `https://driftsys.github.io/schemas/markspec/lock/v1.json`
- lock files are machine-managed and committed to VCS.
