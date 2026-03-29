# AGENTS.md

This file provides guidance to AI coding agents when working with code in this
repository. It is repo-internal and never published to GitHub Pages.

## What This Repo Is

A collection of JSON Schemas for the Driftsys project. Schemas are published to
GitHub Pages at `https://driftsys.github.io/schemas/` in three surfaces:

- `*.html` — human-readable contract pages
- `index.md` — agent-consumable raw markdown contracts (discoverable via
  `<link rel="alternate" type="text/markdown" href="index.md">`)
- `v*.json` — JSON Schema files for validation

## Published Site Model

Each `README.md` at the root, `project/`, and `markspec/` levels is the contract
page for that domain. The build script renders them to HTML and generates
`index.md` for agents (with `README.md` links rewritten to `index.md`).

| Surface  | URL pattern                | Source                    |
| -------- | -------------------------- | ------------------------- |
| Human    | `/<domain>/`               | `<domain>/README.md`      |
| Agent    | `/<domain>/index.md`       | `<domain>/README.md`      |
| Schema   | `/<domain>/<name>/v1.json` | `<domain>/<name>/v1.json` |
| Hub      | `/`                        | `README.md`               |
| Hub (md) | `/index.md`                | `README.md`               |

`AGENTS.md` and `CONTRIBUTING.md` are repo-internal only — never published.

## Repository Layout

```text
schemas/
├── README.md              ← dual-audience hub (published)
├── AGENTS.md              ← repo-internal (this file, never published)
├── CONTRIBUTING.md        ← repo-internal (never published)
├── docs/
│   └── specification.md   ← normative site specification
├── project/
│   ├── README.md          ← dual-audience contract page (published)
│   ├── v1.json
│   └── tests/
├── markspec/
│   ├── README.md          ← dual-audience contract page (published)
│   ├── entry/v1.json
│   ├── lock/v1.json
│   └── ...
├── scripts/
│   ├── publish            ← thin wrapper
│   └── build-site.ts      ← Deno site builder (refhub style)
└── _site/                 ← generated, gitignored
```

## Schema Conventions

- Schemas use **JSON Schema draft-07**
  (`http://json-schema.org/draft-07/schema#`).
- `$id` must match the GitHub Pages URL:
  `https://driftsys.github.io/schemas/<name>/v<N>.json`.
- Versioning is `v1`, `v2`, etc. Breaking changes require a new major version.
  Non-breaking additions are added in place.
- Field names align with Cargo.toml and package.json conventions.
- `additionalProperties: false` is used on root objects.

## Commands

All commands use [just](https://github.com/casey/just):

- `just fmt` — format all files with dprint
- `just check` — run all checks (test + lint)
- `just test` — run bash_unit tests
- `just lint` — run markdownlint and dprint check
- `just build` — generate the site to `_site/`

Always run `just check` before pushing.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:
`feat:`, `fix:`, `docs:`, `chore:`, etc.

## Formatting

- Formatted with **dprint** (`dprint fmt`). Config in `dprint.json`.
- Markdown: wrap prose at 80 columns, use `-` for unordered lists (not `*`).
- Indent with 2 spaces everywhere.

## Testing

Each schema directory has a `tests/` folder with JSON fixtures and bash_unit
tests. When adding or modifying a schema, update the corresponding tests.

## Editing Schemas

When modifying a schema, keep the corresponding `README.md` in sync — it is the
published contract page.

<!-- git-std:bootstrap -->

## Post-clone setup

Run `./bootstrap` after `git clone` or `git worktree add`.
