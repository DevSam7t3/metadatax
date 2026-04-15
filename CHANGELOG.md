# Changelog

All notable changes to this project will be documented in this file.

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
