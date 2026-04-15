# @avenra/metadatax

[![npm version](https://img.shields.io/npm/v/@avenra/metadatax)](https://www.npmjs.com/package/@avenra/metadatax)
[![license](https://img.shields.io/npm/l/@avenra/metadatax)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/devsam7t3/metadatax/ci.yml?branch=main)](https://github.com/devsam7t3/metadatax/actions/workflows/ci.yml)

Production-ready SEO and metadata utilities for Next.js and React with a single API surface.

## Table of Contents

- [Why MetadataX](#why-metadatax)
- [Package Entry Points](#package-entry-points)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Smart Defaults Behavior](#smart-defaults-behavior)
- [SEO Linting Rules](#seo-linting-rules)
- [Example App](#example-app)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Why MetadataX

- Works with Next.js App Router and Pages Router.
- Supports React component usage for head tag rendering.
- Provides smart default generation for missing metadata.
- Includes development linting for common SEO problems.
- Ships tree-shakable exports.

## Package Entry Points

- App Router and default exports: `@avenra/metadatax`
- Pages Router exports: `@avenra/metadatax/pages`
- Next.js build plugin: `@avenra/metadatax/next-plugin`

## Installation

```bash
npm install @avenra/metadatax
```

## Quick Start

### App Router

```ts
// seo.config.ts
import { defineSeoConfig } from "@avenra/metadatax";

export const seo = defineSeoConfig({
    baseUrl: "https://example.com",
    title: "Example Site",
    description: "Production-ready metadata defaults.",
    canonical: "/",
    titleTemplate: "%s | Example",
    openGraph: {
        type: "website",
        images: [{ url: "/og/default.png" }],
    },
    auto: {
        titleFromPath: true,
        descriptionFromContent: true,
    },
    lint: {
        strict: true,
        rules: {
            titleLength: 100,
            duplicate_title: "warn",
        },
    },
});
```

```mjs
// next.config.mjs
import { withMetadataX } from "@avenra/metadatax/next-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withMetadataX(nextConfig, {
    failOn: "error",
});
```

```ts
// app/layout.tsx
import type { Metadata } from "next";
import { createMetadata } from "@avenra/metadatax";
import { seo } from "../seo.config";

export const metadata: Metadata = createMetadata(seo, {});
```

```tsx
// app/blog/[slug]/page.tsx
import { JsonLd, articleJsonLd } from "@avenra/metadatax";

export default function BlogPage() {
    return (
        <JsonLd
            data={articleJsonLd({
                headline: "My First Post",
                author: "Avenra Team",
                datePublished: "2026-04-14",
            })}
        />
    );
}
```

### Pages Router

```tsx
import { Meta, defineSeoConfig } from "@avenra/metadatax/pages";

defineSeoConfig({
    baseUrl: "https://example.com",
    auto: { titleFromPath: true },
});

export default function AboutPage() {
    return <Meta canonical="/about" />;
}
```

## API Reference

### Root Exports (`@avenra/metadatax`)

- `defineSeoConfig`
- `defineSeoDefaults`
- `createMetadata`
- `createHeadEntries`
- `createResolvedMeta`
- `Meta`
- `JsonLd`
- `articleJsonLd`
- `breadcrumbJsonLd`
- `organizationJsonLd`
- `productJsonLd`

### Plugin Exports (`@avenra/metadatax/next-plugin`)

- `withMetadataX`

### Pages Exports (`@avenra/metadatax/pages`)

- `defineSeoConfig`
- `createHeadEntries`
- `Meta`
- `JsonLd`

### `defineSeoConfig(config)`

Stores and returns global runtime config.

| Prop            | Type                                 | Required | Notes                                         |
| --------------- | ------------------------------------ | -------- | --------------------------------------------- |
| `baseUrl`       | `string`                             | No       | Used to absolutize canonical and OG URLs.     |
| `titleTemplate` | `string`                             | No       | Supports `%s` placeholder.                    |
| `defaultTitle`  | `string`                             | No       | Fallback title when none is provided/derived. |
| `title`         | `string \| null`                     | No       | Global default title.                         |
| `description`   | `string \| null`                     | No       | Global default description.                   |
| `canonical`     | `string \| null`                     | No       | Global canonical URL/path.                    |
| `robots`        | `SeoRobots \| null`                  | No       | Robots defaults.                              |
| `openGraph`     | `OpenGraphInput \| null`             | No       | Open Graph defaults.                          |
| `twitter`       | `TwitterInput \| null`               | No       | Twitter defaults.                             |
| `jsonLd`        | `JsonLdNode \| JsonLdNode[] \| null` | No       | Global JSON-LD nodes.                         |
| `auto`          | `AutoConfig`                         | No       | Smart defaults controls.                      |
| `lint`          | `LintConfig`                         | No       | Dev lint behavior controls.                   |

When `lint.strict` is set to `true`, `title`, `description`, `canonical`, and `openGraph` become required in config typing.

#### `AutoConfig`

| Prop                     | Type                           | Required | Notes                                               |
| ------------------------ | ------------------------------ | -------- | --------------------------------------------------- |
| `titleFromPath`          | `boolean`                      | No       | Derives title from route segment.                   |
| `titleFromH1`            | `boolean`                      | No       | Uses `ResolveContext.h1` when available.            |
| `descriptionFromContent` | `boolean`                      | No       | Uses extractor/content text with fallback behavior. |
| `contentExtractor`       | `(ctx) => string \| undefined` | No       | Custom extraction logic.                            |

#### `LintConfig`

| Prop     | Type        | Required | Notes                                                       |
| -------- | ----------- | -------- | ----------------------------------------------------------- |
| `strict` | `boolean`   | No       | Default level fallback. `true` elevates unconfigured rules. |
| `rules`  | `LintRules` | No       | Per-rule override map and threshold controls.               |

`LintRules` supports issue-level overrides: `missing_title`, `missing_description`, `missing_opengraph`, `missing_canonical`, `missing_og_image`, `title_too_long`, and `duplicate_title`.

Rule values:

- `"warn"` to force warning level
- `"error"` to force error level
- `false` to disable a rule

Special threshold rule:

- `titleLength: number | false` (`60` by default)

### `withMetadataX(nextConfig, options?)`

Wraps Next.js config and injects build-time lint fail mode.

| Prop      | Type                                     | Required | Notes                                           |
| --------- | ---------------------------------------- | -------- | ----------------------------------------------- |
| `options` | `{ failOn?: "error"\|"warning"\|"all" }` | No       | Build failure threshold. Defaults to `"error"`. |

Fail mode behavior:

- `error`: fail build on lint issues with `level === "error"`
- `warning`: fail build on warnings and errors
- `all`: fail build on any lint issue

### `defineSeoDefaults(config)`

Returns config for server-focused usage patterns (for example factory-based metadata composition).

| Prop     | Type        | Required | Notes                            |
| -------- | ----------- | -------- | -------------------------------- |
| `config` | `SeoConfig` | Yes      | Same shape as `defineSeoConfig`. |

### `createMetadata(defaults, input?, context?)`

Returns a Next.js-compatible metadata object.

| Prop       | Type             | Required | Notes                                      |
| ---------- | ---------------- | -------- | ------------------------------------------ |
| `defaults` | `SeoConfig`      | Yes      | Base config source.                        |
| `input`    | `MetaInput`      | No       | Route/page overrides.                      |
| `context`  | `ResolveContext` | No       | Route/runtime context for derivation/lint. |

### `createResolvedMeta(input, context?, defaults?)`

Resolves metadata and returns lint results.

| Prop       | Type             | Required | Notes                                                        |
| ---------- | ---------------- | -------- | ------------------------------------------------------------ |
| `input`    | `MetaInput`      | Yes      | Route/page metadata input.                                   |
| `context`  | `ResolveContext` | No       | Includes `pathname`, `routeKey`, `h1`, `contentText`, `env`. |
| `defaults` | `SeoConfig`      | No       | Falls back to global config when omitted.                    |

Return shape:

| Field        | Type           | Notes                  |
| ------------ | -------------- | ---------------------- |
| `resolved`   | `ResolvedMeta` | Final merged metadata. |
| `lintIssues` | `LintIssue[]`  | Dev lint findings.     |

### `createHeadEntries(input, context?, defaults?)`

Serializes resolved metadata into renderable head entries.

| Prop       | Type             | Required | Notes                             |
| ---------- | ---------------- | -------- | --------------------------------- |
| `input`    | `MetaInput`      | Yes      | Route/page metadata input.        |
| `context`  | `ResolveContext` | No       | Context for derive/lint behavior. |
| `defaults` | `SeoConfig`      | No       | Optional config override.         |

Return shape:

| Field        | Type          | Notes                         |
| ------------ | ------------- | ----------------------------- |
| `entries`    | `HeadEntry[]` | Title/meta/link/script nodes. |
| `lintIssues` | `LintIssue[]` | Dev lint findings.            |

### `<Meta />`

React component that renders computed head tags and emits dev lint logs.

| Prop          | Type                                 | Required | Notes                         |
| ------------- | ------------------------------------ | -------- | ----------------------------- |
| `title`       | `string \| null`                     | No       | Page title override.          |
| `description` | `string \| null`                     | No       | Page description override.    |
| `canonical`   | `string \| null`                     | No       | Canonical URL/path override.  |
| `robots`      | `SeoRobots \| null`                  | No       | Robots override.              |
| `openGraph`   | `OpenGraphInput \| null`             | No       | Open Graph override.          |
| `twitter`     | `TwitterInput \| null`               | No       | Twitter override.             |
| `jsonLd`      | `JsonLdNode \| JsonLdNode[] \| null` | No       | JSON-LD override.             |
| `context`     | `ResolveContext`                     | No       | Optional derive/lint context. |

### `<JsonLd />`

Renders one or multiple `application/ld+json` script tags.

| Prop   | Type                                                   | Required | Notes                                      |
| ------ | ------------------------------------------------------ | -------- | ------------------------------------------ |
| `data` | `Record<string, unknown> \| Record<string, unknown>[]` | Yes      | JSON-LD node(s). `@context` is auto-added. |

### `articleJsonLd(input)`

Structured helper for article schema data.

| Prop            | Type     | Required | Notes                         |
| --------------- | -------- | -------- | ----------------------------- |
| `headline`      | `string` | Yes      | Article headline.             |
| `description`   | `string` | No       | Article summary.              |
| `datePublished` | `string` | No       | ISO timestamp/date.           |
| `dateModified`  | `string` | No       | ISO timestamp/date.           |
| `author`        | `string` | No       | Emits `Person` author object. |
| `image`         | `string` | No       | Image URL.                    |
| `url`           | `string` | No       | Canonical article URL.        |

### `breadcrumbJsonLd(input)`

Structured helper for breadcrumb schema data.

| Prop             | Type                 | Required | Notes                                 |
| ---------------- | -------------------- | -------- | ------------------------------------- |
| `items`          | `BreadcrumbItem[]`   | No       | Single breadcrumb trail.              |
| `multipleTrails` | `BreadcrumbItem[][]` | No       | Multiple trails, emitted as `@graph`. |

`BreadcrumbItem`

| Prop   | Type     | Required | Notes                    |
| ------ | -------- | -------- | ------------------------ |
| `name` | `string` | Yes      | Breadcrumb display name. |
| `item` | `string` | No       | URL for breadcrumb item. |

### `organizationJsonLd(input)`

Structured helper for organization schema data.

| Prop           | Type                                                           | Required | Notes                     |
| -------------- | -------------------------------------------------------------- | -------- | ------------------------- |
| `name`         | `string`                                                       | Yes      | Organization name.        |
| `type`         | `"Organization" \| "OnlineStore"`                              | No       | Schema type override.     |
| `url`          | `string`                                                       | No       | Organization URL.         |
| `logo`         | `string`                                                       | No       | Organization logo URL.    |
| `description`  | `string`                                                       | No       | Organization description. |
| `sameAs`       | `string[]`                                                     | No       | Social/profile URLs.      |
| `contactPoint` | `{ contactType?: string; telephone?: string; email?: string }` | No       | Contact point details.    |

### `productJsonLd(input)`

Structured helper for product schema data.

| Prop          | Type                                                                                      | Required | Notes                              |
| ------------- | ----------------------------------------------------------------------------------------- | -------- | ---------------------------------- |
| `name`        | `string`                                                                                  | Yes      | Product name.                      |
| `description` | `string`                                                                                  | No       | Product description.               |
| `image`       | `string \| string[]`                                                                      | No       | Product image URL(s).              |
| `sku`         | `string`                                                                                  | No       | Product SKU.                       |
| `brand`       | `string`                                                                                  | No       | Brand name, emitted as `Brand`.    |
| `offers`      | `{ price: number \| string; priceCurrency: string; availability?: string; url?: string }` | No       | Offer details, emitted as `Offer`. |

## Smart Defaults Behavior

- `titleFromPath` derives from route/path segment:
    - `/` -> `Home`
    - `/posts/my-first-post` -> `My First Post`
- `titleFromH1` has priority over path-derived title when `context.h1` is provided.
- `descriptionFromContent` uses extractor/content text and truncates to 160 chars.
- If description source is missing, it falls back to a derived label (`<Title> page`).

## SEO Linting Rules

Current dev lint checks:

- `missing_canonical`
- `missing_og_image`
- `title_too_long` (over 60 chars)
- `duplicate_title` (best-effort dev route registry)

Each check can be overridden or disabled through `lint.rules`.

## Example App

Reference app: `apps/nextjs-example`.

```bash
cd apps/nextjs-example
npm install
npm run dev
```

## Migration Guide

If you are moving from `next-seo`, use the migration document:

- `docs/migrating-from-next-seo.md`

## Contributing

See `CONTRIBUTING.md`.

## Security

See `SECURITY.md`.

## License

MIT. See `LICENSE`.
