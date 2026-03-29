# DriftSys Schema Contracts

[![CI](https://github.com/driftsys/schemas/actions/workflows/ci.yaml/badge.svg)](https://github.com/driftsys/schemas/actions/workflows/ci.yaml)
[![Pages](https://img.shields.io/badge/Pages-driftsys.github.io%2Fschemas-0072b2)](https://driftsys.github.io/schemas/)

Validation schemas and agent contracts for DriftSys projects. Each schema is
published to GitHub Pages and available as HTML for humans and raw markdown for
agents.

## Discovery Protocol

1. Identify the schema domain (project or markspec).
2. Navigate to the domain contract page.
3. Use the schema index to find the matching `v1.json`.
4. Validate payload against the schema before processing.
5. Parse required fields first, optional fields second.

## Schema Index

| Contract              | Schema                                                                       | Description                                |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| [project](project/)   | [project/v1.json](project/v1.json)                                           | Project manifest                           |
| [markspec](markspec/) | [markspec/lock/v1.json](markspec/lock/v1.json)                               | Frozen sidecar metadata (`.markspec.lock`) |
| [markspec](markspec/) | [markspec/link-target/v1.json](markspec/link-target/v1.json)                 | Shared resolved-link target object         |
| [markspec](markspec/) | [markspec/entry/v1.json](markspec/entry/v1.json)                             | Typed entry detail payload                 |
| [markspec](markspec/) | [markspec/reference/v1.json](markspec/reference/v1.json)                     | Reference entry payload                    |
| [markspec](markspec/) | [markspec/index/v1.json](markspec/index/v1.json)                             | Entry listing payload                      |
| [markspec](markspec/) | [markspec/search/v1.json](markspec/search/v1.json)                           | Search records for client indexing         |
| [markspec](markspec/) | [markspec/traceability-matrix/v1.json](markspec/traceability-matrix/v1.json) | Full traceability matrix rows              |
| [markspec](markspec/) | [markspec/traceability-graph/v1.json](markspec/traceability-graph/v1.json)   | Graph nodes and edges                      |
| [markspec](markspec/) | [markspec/coverage/v1.json](markspec/coverage/v1.json)                       | Coverage summary and gaps                  |
| [markspec](markspec/) | [markspec/bom/v1.json](markspec/bom/v1.json)                                 | Architecture/BOM tree                      |
| [markspec](markspec/) | [markspec/deps/v1.json](markspec/deps/v1.json)                               | Cross-project dependency payload           |
| [markspec](markspec/) | [markspec/diagnostics/v1.json](markspec/diagnostics/v1.json)                 | Validation and build diagnostics           |

## Contracts

| Contract               | Description                              |
| ---------------------- | ---------------------------------------- |
| [project/](project/)   | Minimal flat project manifest            |
| [markspec/](markspec/) | MarkSpec site API artifacts (12 schemas) |

## Usage

Reference a schema from your project file to get autocompletion and validation
in your editor.

### YAML

Uses the `$schema` key — supported by the Red Hat YAML extension (VS Code) and
IntelliJ.

```yaml
# project.yaml
$schema: https://driftsys.github.io/schemas/project/v1.json

name: com.company.dash
description: Cross-platform SDK for the Dash service
category: library
version: 1.4.2
```

### TOML

Uses the `#:schema` comment directive — supported by taplo and the Even Better
TOML extension (VS Code).

<!-- dprint-ignore -->

```toml
# project.toml
#:schema https://driftsys.github.io/schemas/project/v1.json

name = "com.company.dash"
description = "Cross-platform SDK for the Dash service"
category = "library"
version = "1.4.2"
```

### JSON

Uses the `$schema` property — supported natively by VS Code and IntelliJ.

```json
{
  "$schema": "https://driftsys.github.io/schemas/project/v1.json",
  "name": "com.company.dash",
  "description": "Cross-platform SDK for the Dash service",
  "category": "library",
  "version": "1.4.2"
}
```

## Failure Modes

- **unsupported-version** — schema version is not recognized. Stop processing.
- **schema-unavailable** — schema URL cannot be fetched. Return error.
- **validation-failed** — payload does not match schema. Reject payload.
- **unknown-payload-kind** — payload kind cannot be determined. Return error.

## Version Policy

- Breaking changes create a new major version path (`v2.json`).
- Non-breaking additions stay in the current major version.
- Consumers should pin to a major version.

<!-- git-std:bootstrap -->

## Post-clone setup

Run `./bootstrap` after `git clone` or `git worktree add`.
