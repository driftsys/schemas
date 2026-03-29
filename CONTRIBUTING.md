# Contributing

## Versioning

Schemas are versioned as `v1`, `v2`, etc. A new major version is published when
breaking changes are introduced (required fields added, fields removed, value
constraints changed). Non-breaking additions (new optional fields) are added in
place.

## Adding a Schema

1. Create a directory named after the schema.
2. Add a `v1.json` file containing the JSON Schema (draft-07).
3. Add a `README.md` as a dual-audience contract page (see Writing Style below).
4. Add a `tests/` folder with valid/invalid JSON fixtures and a bash_unit test
   file (`test_v1.sh`).

Each schema lives in its own directory:

```text
<schema-name>/
├── README.md       ← dual-audience contract page (published to Pages)
├── v1.json         ← JSON Schema
└── tests/          ← bash_unit tests and JSON fixtures
```

## Modifying a Schema

- **Non-breaking changes** (new optional fields): edit the existing `v<N>.json`
  in place.
- **Breaking changes** (new required fields, removed fields, changed
  constraints): create a new `v<N+1>.json` file.
- Always update the corresponding `README.md` and test fixtures to match.

## Conventions

- `$id` must match the GitHub Pages URL:
  `https://driftsys.github.io/schemas/<name>/v<N>.json`
- Field names follow Cargo.toml / package.json conventions.
- Use `additionalProperties: false` on root objects.

## Writing Style

README.md files are published to GitHub Pages as both HTML and raw markdown.
Write them agent-first but readable by humans.

Each contract page must follow this structure:

1. **Title** — `# {Domain} Schema Contract`
2. **Purpose** — one sentence describing what the contract covers.
3. **Discovery Protocol** — numbered steps to identify and select schemas.
4. **Schema Index** — table with schema path, description, and stable key.
5. **Validation Contract** — must/should/may rules for payload validation.
6. **Failure Modes** — error names with descriptions and required actions.
7. **Version Policy** — breaking = new major, non-breaking = in-place, pin to
   major.
8. **Quick Example** — one payload kind walked through end to end.

Tone rules:

- Keep sentences short and literal.
- Use one term per concept and reuse it everywhere.
- Prefer must/should/may semantics.
- Put key fields and paths in compact tables.
- Keep examples executable or directly parseable.

## Publishing

`scripts/build-site.ts` generates the `public/` directory from contract pages
and schema files. The publish pipeline:

1. Copies `README.md` files as `index.md` (agent surface).
2. Renders `README.md` files to `index.html` (human surface).
3. Copies all `v*.json` schema files preserving directory structure.
4. Never publishes `AGENTS.md` or `CONTRIBUTING.md`.

Run `just build` to generate the site locally. Run `just check` before pushing.
