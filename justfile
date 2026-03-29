@_default:
    just --list

# Remove generated build artifacts
clean:
    rm -rf _site/

# Format all files
fmt:
    markdownlint-cli2 --fix '**/*.md'
    dprint fmt

# Run all checks (test + lint)
check: test lint

# Lint all files
lint:
    markdownlint-cli2 '**/*.md'
    dprint check

# Validate schemas and test examples
test:
    bash_unit project/tests/test_*.sh

# Build: generate site to _site/
build:
    ./scripts/publish

# Watch and serve locally (rebuild on changes)
dev:
    #!/usr/bin/env bash
    set -m
    trap 'kill %1 2>/dev/null || true; wait' EXIT INT TERM
    # Initial build
    just build
    # Watch for changes (using stat polling as fallback)
    (while true; do
        find README.md project/ markspec/ -type f -newer /tmp/.dev-watch-marker 2>/dev/null | grep -q . && {
            just build
            touch /tmp/.dev-watch-marker
        } || true
        sleep 2
    done) &
    # Give server a moment to start before opening
    (sleep 1 && open http://localhost:8000) &
    # Serve _site directory
    cd "$PWD/_site" && deno run --allow-net jsr:@std/http/file-server --port 8000
