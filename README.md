# @avenra/metadatax

[![npm version](https://img.shields.io/npm/v/@avenra/metadatax)](https://www.npmjs.com/package/@avenra/metadatax)
[![license](https://img.shields.io/npm/l/@avenra/metadatax)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/avenra/metadatax/ci.yml?branch=main)](https://github.com/avenra/metadatax/actions/workflows/ci.yml)

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
        strict: false,
    },
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

#### `AutoConfig`

| Prop                     | Type                           | Required | Notes                                               |
| ------------------------ | ------------------------------ | -------- | --------------------------------------------------- |
| `titleFromPath`          | `boolean`                      | No       | Derives title from route segment.                   |
| `titleFromH1`            | `boolean`                      | No       | Uses `ResolveContext.h1` when available.            |
| `descriptionFromContent` | `boolean`                      | No       | Uses extractor/content text with fallback behavior. |
| `contentExtractor`       | `(ctx) => string \| undefined` | No       | Custom extraction logic.                            |

#### `LintConfig`

| Prop     | Type      | Required | Notes                                       |
| -------- | --------- | -------- | ------------------------------------------- |
| `strict` | `boolean` | No       | Upgrades lint level from `warn` to `error`. |

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

## Example App

Reference app: `apps/nextjs-example`.

```bash
cd apps/nextjs-example
npm install
npm run dev
```

## Contributing

See `CONTRIBUTING.md`.

## Security

See `SECURITY.md`.

## License

MIT. See `LICENSE`.
