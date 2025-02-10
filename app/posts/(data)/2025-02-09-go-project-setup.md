---
title: 'Git Hooks and Makefile for My Go Projects'
summary: 'My current setup for Go projects for things I do not want to do twice.'
createdAt: 2025-02-09 21:51:52 +0800
publishedAt: 2025-02-09
categories: [go, ci]
---

## What's Good?

- Makefile to set up the project and alias common commands
- Pre-commit hook includes the below; fixable diffs are added to the staged
  - `go mod tidy`
  - `go fmt`
  - `golangci-lint run --fix` (v1.63.4)
  - `go test`
- Pre-push hook includes the below
  - `golangci-lint run` (v1.63.4)
  - `go test -race`

## Show Me The Files

### /Makefile

```make
.PHONY: all
all: flight-check build run-build

.PHONY: run
# Modify the commands to your needs
run: flight-check
	@echo "Running the app on port $${PORT:-8080}..."
	@PORT=$${PORT:-8080} go run main.go

.PHONY: build
# Modify the commands to your needs
build: flight-check
	@echo "Building the app..."
	@mkdir -p bin
	@go build -o bin/app

.PHONY: run-build
# Modify the commands to your needs
run-build: flight-check
	@echo "Running ./bin/app on port $${PORT:-8080}..."
	@PORT=$${PORT:-8080} ./bin/app

.PHONY:  test
test: flight-check
	@echo "Running tests..."
	@go test -race -cover ./...

.PHONY: lint
lint: flight-check
	@echo "Running golangci-lint..."
	@./bin/golangci-lint run

.PHONY: clean
# Modify the commands to your needs
clean: flight-check
	@echo "Cleaning up..."
	@rm -rf bin/app

.PHONY: pre-flight
# Clean install; not setting the below as make build targets
# Modify the commands to your needs
pre-flight:
	@echo "Setting up Git hooks..."
	@mkdir -p bin
	@echo "Installing golangci-lint to ./bin..."
	@curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b ./bin v1.63.4
	@cp scripts/git/pre-commit .git/hooks/pre-commit
	@cp scripts/git/pre-push .git/hooks/pre-push
	@chmod +x .git/hooks/pre-commit .git/hooks/pre-push
	@git config core.hooksPath .git/hooks
	@echo "Git hooks set up successfully!"

.PHONY: flight-check
flight-check:
	@echo "Performing flight check..."
	@if [ ! -f ".git/hooks/pre-commit" ] || \
		[ ! -f ".git/hooks/pre-push" ] || \
		[ ! -x "./bin/golangci-lint" ]; then \
			echo "Git hooks or golangci-lint are missing. Run 'make pre-flight'"; \
			exit 1; \
	fi
```

### /scripts/git/pre-commit

```sh
#!/bin/sh
set -e

echo "Running pre-commit checks - go mod tidy..."
go mod tidy

MOD_DIFF=$(git diff --name-only go.mod go.sum)
if [ -n "$MOD_DIFF" ]; then
  echo "go.mod or go.sum changed, adding them to staging..."
  git add go.mod go.sum
fi

echo "Running pre-commit checks - staged Go files..."

STAGED_GO_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.go$' || true)

if [ -z "$STAGED_GO_FILES" ]; then
  echo "No Go files staged for commit."
  exit 0
fi

echo "$STAGED_GO_FILES" | xargs -r gofmt -s -w

echo "$STAGED_GO_FILES" | xargs -r -I {} dirname {} | sort -u | xargs -r ./bin/golangci-lint run --fix

echo "$STAGED_GO_FILES" | xargs -r git add

go test ./...

echo "Pre-commit checks passed!"
```

### /scripts/git/pre-push

```sh
#!/bin/sh
set -e

echo "Running pre-push checks..."

# Run all unit tests with race condition detection
go test -race ./...

# Run static analysis
./bin/golangci-lint run

echo "Pre-push checks passed!"
```
