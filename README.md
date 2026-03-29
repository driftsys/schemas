# DriftSys Schema Contracts

Validation schemas and agent contracts for DriftSys projects. Each schema is
published to GitHub Pages and available as HTML for humans and raw markdown for
agents.

## Discovery Protocol

1. Identify the schema domain (project or markspec).
2. Navigate to the domain contract page.
3. Use the schema index to find the matching `v1.json`.
4. Validate payload against the schema before processing.
5. Parse required fields first, optional fields second.

## Contracts

| Domain   | Human                  | Agent                                    | Schemas         |
| -------- | ---------------------- | ---------------------------------------- | --------------- |
| Project  | [project/](project/)   | [project/README.md](project/README.md)   | project/v1.json |
| MarkSpec | [markspec/](markspec/) | [markspec/README.md](markspec/README.md) | 12 schemas      |

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
