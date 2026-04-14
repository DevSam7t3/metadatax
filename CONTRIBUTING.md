# Contributing to @avenra/metadatax

Thanks for your interest in improving `@avenra/metadatax`.

## Before You Start

- Search existing issues and pull requests before opening a new one.
- For larger API or behavior changes, open an issue first to align on direction.

## Local Setup

```bash
npm install
npm test
npm run build
```

## Project Structure

- `src/` core library code
- `src/core/` derivation, merge, serialization, lint internals
- `tests/` unit and regression tests
- `apps/nextjs-example/` Next.js App Router integration example

## Development Workflow

1. Create a branch from `main`.
2. Make focused changes for a single concern.
3. Add or update tests for any behavior changes.
4. Run validation locally:

```bash
npm test
npm run build
cd apps/nextjs-example && npm run build
```

5. Open a pull request with a clear description and migration notes if needed.

## Pull Request Checklist

- [ ] Tests added/updated for changed behavior
- [ ] Build succeeds locally
- [ ] Public API changes documented in `README.md`
- [ ] Breaking changes called out clearly

## Coding Guidelines

- Keep adapters thin and framework-specific logic isolated from core.
- Preserve SSR-safe behavior; do not introduce client-only metadata mutations by default.
- Keep defaults deterministic to avoid hydration mismatch and metadata flicker.
- Prefer additive, backward-compatible changes unless a breaking change is intentional.

## Communication

- Be respectful and specific in review discussions.
- If blocked, share minimal reproduction details to speed up triage.
