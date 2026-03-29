# Project Schema Contract

A minimal, flat project manifest. Describes what the project is and where it
lives — nothing more. Validate payloads against this schema before processing.

**Schema URL:** `https://driftsys.github.io/schemas/project/v1.json`

## Discovery Protocol

1. Detect a `project.yaml`, `project.toml`, or `project.json` file.
2. Resolution order: YAML → TOML → JSON (first found wins).
3. Validate against `project/v1.json` before reading fields.
4. Parse required fields (`name`, `version`) first.
5. Parse optional fields second.
6. Treat the schema as closed (`additionalProperties: false`).

## Schema Index

| Schema path        | What it describes | Stable key |
| ------------------ | ----------------- | ---------- |
| [v1.json](v1.json) | Project manifest  | `name`     |

## Validation Contract

Validate early so downstream logic stays predictable.

1. Validation must happen before any business logic.
2. Missing required fields (`name`, `version`) means hard failure.
3. Unknown properties must be rejected (schema is closed).
4. If schema fetch fails, return a schema-unavailable error.

## Fields

### `name` (required)

Reverse-domain project identifier. Globally unique, used as the canonical name
across all ecosystems.

```yaml
name: com.company.dash
```

Must match `^[a-z][a-z0-9.-]*$`. Tooling derives ecosystem-specific names from
this value — for example, `@company/dash` for npm or `company-dash` for Cargo.

### `version` (required)

Canonical version. Single source of truth — all ecosystem version files
(`Cargo.toml`, `package.json`, `build.gradle.kts`) are derived from this value.

```yaml
version: 1.4.2
```

### `category`

Project classification. Accepts a single value or a list.

```yaml
category: library
```

Values:

| Category        | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `manifest`      | Integration root — assembles components, ships to customer |
| `specification` | Requirements, features, safety concepts                    |
| `application`   | Deployable end-user product                                |
| `service`       | Backend service or API                                     |
| `library`       | Reusable dependency                                        |
| `tool`          | Developer tool, CLI, build plugin (source code)            |
| `binary`        | Precompiled executables, firmware, vendor tools            |
| `distribution`  | Release artifacts, install packs                           |
| `configuration` | Graphic assets, system config, calibration data            |

### `description`

One-line summary of the project.

```yaml
description: Cross-platform SDK for the Dash service
```

### `license`

SPDX license expression.

```yaml
license: Apache-2.0
```

### `keywords`

Discovery tags.

```yaml
keywords:
  - sdk
  - cross-platform
```

### `authors`

Project authors in `Name <email>` format.

```yaml
authors:
  - Core Platform Team <core-platform@company.com>
```

### `homepage`

Project website or documentation portal URL.

### `bugs`

Issue tracker URL.

### `repository`

Source repository URL.

### `upstream`

Upstream repository for forks. Append `#branch` to track a specific branch.

```yaml
upstream: https://github.com/nicegui/nicegui#develop
```

### `metadata`

Freeform key-value block for org-specific information. The standard never reads
or validates contents.

```yaml
metadata:
  department: platform-engineering
  cost-center: CC-4200
```

### `config`

Freeform key-value block for tooling configuration. Tools namespace themselves
as keys.

```yaml
config:
  sonar:
    project-key: dash-platform
```

## Failure Modes

- **unsupported-version** — schema version is not recognized. Stop processing.
- **schema-unavailable** — schema URL cannot be fetched. Return error.
- **validation-failed** — payload does not match schema. Reject payload.

## Version Policy

- Breaking changes create a new major version path (`v2.json`).
- Non-breaking additions stay in the current major version.
- Consumers should pin to a major version.

## Quick Example

Input: `project.yaml`\
Schema: `project/v1.json`

1. Validate payload against schema.
2. Parse `name` and `version` (required).
3. Parse optional fields (`category`, `description`, `license`, etc.).
4. Reject if unknown properties are present.
