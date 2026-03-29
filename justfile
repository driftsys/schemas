# Format all files
fmt:
    dprint fmt

# Run all checks (test + lint)
check: test lint

# Lint all files
lint:
    markdownlint '**/*.md'
    dprint check

# Validate schemas and test examples
test:
    bash_unit project/tests/test_*.sh

# Build: generate site to public/
build:
    ./scripts/publish
