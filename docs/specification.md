# Site Specification

This document is the normative specification for the `driftsys/schemas`
published site. It defines the source layout, URL contract, site style, and
publish pipeline.

## Principle

One markdown source per page. The publish script emits both `.md` (agent) and
`.html` (human) to the same URL namespace. Schema JSON URLs stay unchanged. No
repo-internal docs are published.

## Source Layout

```text
schemas/
├── README.md                          ← dual-target hub (published)
├── AGENTS.md                          ← repo-internal only, never published
├── CONTRIBUTING.md                    ← repo-internal only, never published
├── project/
│   ├── v1.json
│   ├── README.md                      ← dual-audience contract page (published)
│   └── tests/
├── markspec/
│   ├── README.md                      ← dual-audience contract page (published)
│   ├── entry/v1.json
│   ├── lock/v1.json
│   └── ...
├── scripts/
│   ├── publish                        ← thin wrapper
│   └── build-site.ts                  ← Deno site builder
└── public/                            ← generated, gitignored, never committed
    ├── index.html                     ← generated from README.md
    ├── index.md                       ← copied from README.md
    ├── project/
    │   ├── index.html                 ← generated from project/README.md
    │   ├── index.md                   ← copied from project/README.md
    │   └── v1.json                    ← schema (unchanged URL)
    └── markspec/
        ├── index.html                 ← generated from markspec/README.md
        ├── index.md                   ← copied from markspec/README.md
        ├── entry/v1.json              ← schema (unchanged URL)
        ├── lock/v1.json
        └── ...
```

## URL Contract

| What                      | URL                             | Format   |
| ------------------------- | ------------------------------- | -------- |
| Hub (human)               | /schemas/                       | HTML     |
| Hub (agent)               | /schemas/index.md               | Markdown |
| Project contract (human)  | /schemas/project/               | HTML     |
| Project contract (agent)  | /schemas/project/index.md       | Markdown |
| Project schema            | /schemas/project/v1.json        | JSON     |
| MarkSpec contract (human) | /schemas/markspec/              | HTML     |
| MarkSpec contract (agent) | /schemas/markspec/index.md      | Markdown |
| MarkSpec entry schema     | /schemas/markspec/entry/v1.json | JSON     |

## Page Template

Each contract page follows this structure:

1. `# {Domain} Schema Contract` — title.
2. Purpose — one sentence describing what the contract covers.
3. `## Discovery Protocol` — numbered deterministic steps.
4. `## Schema Index` — table with schema path, description, stable key.
5. `## Validation Contract` — must/should/may rules.
6. `## Failure Modes` — error names with descriptions.
7. `## Version Policy` — three rules.
8. `## Quick Example` — one payload kind walked through.

## Site Style

Match the RefHub site (`driftsys.github.io/refhub`) exactly:

- **CSS**: Pico CSS classless (`pico.classless.min.css`) + custom overrides.
- **Fonts**: IBM Plex Sans (body), IBM Plex Mono (code/IDs).
- **Layout**: `layoutHtml()` shell — header with nav + GitHub icon, breadcrumbs,
  main content, footer with DriftSys · Source · MIT.
- **Colors**: MarkSpec document palette (`--pico-primary: #0072b2`, etc.).
- **No search** — small number of schemas.

## Publish Pipeline

The build script (`scripts/build-site.ts`) generates `public/` from contract
pages and schema files:

1. Copies `README.md` files as `index.md` and `README.md` for agent consumption.
2. Renders `README.md` files to `index.html` using `layoutHtml()`.
3. Copy all `v*.json` schema files preserving directory structure.
4. Write `assets/` (Pico CSS, style.css).
5. Generate root `index.html` as the hub page.
6. Never copy `AGENTS.md` or `CONTRIBUTING.md` into `public/`.

The existing bash `scripts/publish` calls the Deno build script.

## Verify

CI checks both schema URLs and contract page URLs after deploy:

- `index.md`, `index.html`
- `project/index.md`, `project/index.html`
- `markspec/index.md`, `markspec/index.html`
- All `v*.json` schema files

## Writing Style

Dual-audience: agent-first but readable by humans.

- Keep sentences short and literal.
- Use one term per concept and reuse it everywhere.
- Prefer must/should/may semantics.
- Put key fields and paths in compact tables.
- Keep examples executable or directly parseable.
