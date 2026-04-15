# Release Checklist

Use this checklist for every release.

## Pre-release Validation

- [ ] Update `CHANGELOG.md`
- [ ] Confirm package version in `package.json`
- [ ] Run tests:

```bash
npm test
```

- [ ] Build library:

```bash
npm run build
```

- [ ] Build example app:

```bash
cd apps/nextjs-example
npm run build
```

- [ ] Verify publish payload:

```bash
npm pack --dry-run
```

- [ ] Run full release gate:

```bash
npm run release:check
```

## Documentation

- [ ] README reflects current API exports
- [ ] Migration guide is updated (`docs/migrating-from-next-seo.md`)
- [ ] Security and contributing docs have valid contact/process details

## Release Execution

- [ ] Create git tag matching version (for example `v0.1.1`)
- [ ] Publish GitHub release notes
- [ ] Trigger release workflow or publish manually
- [ ] Verify package on npm (`npm view @avenra/metadatax version`)

## Post-release

- [ ] Smoke-test install in a clean project
- [ ] Check issue tracker for immediate regressions
- [ ] Announce release with migration highlights
