# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-04-15

### Added

- Granular lint rule configuration via `lint.rules`.
- Per-rule severity overrides (`warn`/`error`) and rule disabling (`false`).
- Configurable title length lint threshold with `lint.rules.titleLength`.
- Next.js plugin entry point: `@avenra/metadatax/next-plugin`.
- `withMetadataX(nextConfig, { failOn })` with fail modes `error`, `warning`, and `all`.
- Plugin tests for fail mode injection and webpack composition.

### Changed

- `defineSeoConfig` strict mode now provides stronger typing: when `lint.strict` is `true`, required defaults are enforced for `title`, `description`, `canonical`, and `openGraph`.
- Lint engine now resolves issue levels per rule and supports disabled checks.

### Fixed

- Production build lint escalation now runs when plugin fail mode is configured, enabling build-time enforcement of SEO lint policies.

## [0.1.1] - 2026-04-15

### Added

- New root-exported structured-data helpers:
    - `breadcrumbJsonLd`
    - `organizationJsonLd`
    - `productJsonLd`
- Tests for structured-data helper outputs
- Migration guide: `docs/migrating-from-next-seo.md`
- Release process checklist: `RELEASE_CHECKLIST.md`

## [0.1.0] - 2026-04-14

### Added

- Core metadata resolution pipeline
- Smart defaults engine (`titleFromPath`, `titleFromH1`, `descriptionFromContent`)
- Dev SEO linting engine with strict mode
- Root and pages exports (`@avenra/metadatax`, `@avenra/metadatax/pages`)
- Root structured helper export (`articleJsonLd`)
- Next.js App Router example app
