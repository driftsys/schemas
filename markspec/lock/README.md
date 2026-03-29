# `markspec/lock/v1.json`

Schema for `.markspec.lock`, a machine-managed sidecar for frozen metadata.

## Agent quick guide

- Use lock data as durable metadata, separate from markdown authoring text.
- Join lock records to entries/references by ULID map key.
- Treat missing optional provenance/sync fields as unknown, not invalid.

## Required top-level field

- `entries`: object map keyed by ULID.

## Optional top-level field

- `$schema`: schema URI.

## Entry metadata fields

- `displayId` (required): current display ID for the ULID.
- `createdAt`, `createdBy` (optional): creation provenance.
- `updatedAt`, `updatedBy` (optional): latest update provenance.
- `external` (optional): per-tool sync metadata map.

## `external.<tool>` fields

- `ref` (required): external system identifier.
- `direction` (required): `import`, `export`, or `bidirectional`.
- `syncedAt` (optional): last sync timestamp.

## Common pitfall

Do not assume all entries in markdown are already present in lock during partial
workflows; validation should report drift explicitly.
