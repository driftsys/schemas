# MarkSpec schemas

This directory contains JSON Schema contracts for MarkSpec artifacts.

## Current schemas

- `lock/v1.json` — schema for `.markspec.lock`

## Conventions

- each schema lives in its own subdirectory
- versioned schema files are named `v1.json`, `v2.json`, etc.
- tests for a schema live in `<schema>/tests/`
- schema-local documentation lives in `<schema>/README.md`

## Lock schema

The lock schema defines a machine-managed sidecar file used to persist
traceability metadata that should not pollute Markdown sources:

- ULID-keyed entry metadata
- display ID mapping
- provenance fields (`createdAt`, `createdBy`, `updatedAt`, `updatedBy`)
- external sync mappings (`external.<tool>.ref`, `direction`, `syncedAt`)

See:

- `markspec/lock/v1.json`
- `markspec/lock/README.md`
