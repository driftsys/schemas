# Changelog

## [0.3.0] (2026-03-29)

### Features

- remove generated timestamps, drop deps schema, reorder schema index
  ([b36f8be])

### Documentation

- add changelog generated with git-std ([84f7263])

[0.3.0]: https://github.com/driftsys/schemas/compare/v0.2.0...v0.3.0
[b36f8be]: https://github.com/driftsys/schemas/commit/b36f8be
[84f7263]: https://github.com/driftsys/schemas/commit/84f7263

## [0.2.0] (2026-03-30)

### Features

- add process, dependencies, references, classification, and labels to project
  schema ([d3cf6cb])
- add component schema, flatten BOM, and improve docs ([4791470])
- add CI badge to README and strip GitHub Actions badges from site ([5849cc6])

[0.2.0]: https://github.com/driftsys/schemas/compare/v0.1.0...v0.2.0
[d3cf6cb]: https://github.com/driftsys/schemas/commit/d3cf6cb
[4791470]: https://github.com/driftsys/schemas/commit/4791470
[5849cc6]: https://github.com/driftsys/schemas/commit/5849cc6

## 0.1.0 (2026-03-29)

### Bug Fixes

- repair corrupted verify workflow YAML ([6636c90])
- repair corrupted deploy workflow YAML ([dd41ff8])
- repair corrupted CI workflow YAML ([c2b56ea])
- use relative README.md links and rewrite to directory paths in HTML
  ([60977fc])
- correct GitHub Pages URL typo in verify workflow ([34d3332])

### Documentation

- update AGENTS.md with hooks, CI, and PR checklist ([0984e0b])
- add Pages badge to README ([27c9ab1])

### Features

- add git-std, improve build pipeline, and restructure schema index ([36a8d3b])
- dual-format contract site with agent markdown and human HTML ([803d959])
- **markspec:** add site API schemas v1 and docs ([497cc89])
- **markspec:** add lock schema v1 ([#1]) ([2661f5b])
- add manual workflow to force deploy schemas to GitHub Pages ([72b4862])
- require only name and version, make category and license optional ([a689bb7])
- add manual workflow to verify published schema URLs ([4827b41])
- skip deploy when no schema changes, verify URLs post-deploy ([a21a77d])
- add bash_unit schema validation tests ([2c01ee7])
- project manifest schema v1 ([3f35059])

[6636c90]: https://github.com/driftsys/schemas/commit/6636c90
[dd41ff8]: https://github.com/driftsys/schemas/commit/dd41ff8
[c2b56ea]: https://github.com/driftsys/schemas/commit/c2b56ea
[60977fc]: https://github.com/driftsys/schemas/commit/60977fc
[34d3332]: https://github.com/driftsys/schemas/commit/34d3332
[0984e0b]: https://github.com/driftsys/schemas/commit/0984e0b
[27c9ab1]: https://github.com/driftsys/schemas/commit/27c9ab1
[36a8d3b]: https://github.com/driftsys/schemas/commit/36a8d3b
[803d959]: https://github.com/driftsys/schemas/commit/803d959
[497cc89]: https://github.com/driftsys/schemas/commit/497cc89
[2661f5b]: https://github.com/driftsys/schemas/commit/2661f5b
[#1]: https://github.com/driftsys/schemas/issues/1
[72b4862]: https://github.com/driftsys/schemas/commit/72b4862
[a689bb7]: https://github.com/driftsys/schemas/commit/a689bb7
[4827b41]: https://github.com/driftsys/schemas/commit/4827b41
[a21a77d]: https://github.com/driftsys/schemas/commit/a21a77d
[2c01ee7]: https://github.com/driftsys/schemas/commit/2c01ee7
[3f35059]: https://github.com/driftsys/schemas/commit/3f35059
