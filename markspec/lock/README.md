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
- optional external mappings under `external.<tool>` with `ref`, `direction`, and `syncedAt`

## Notes

- this schema is referenced by:
  - `https://driftsys.github.io/schemas/markspec/lock/v1.json`
- lock files are machine-managed and committed to VCS.
