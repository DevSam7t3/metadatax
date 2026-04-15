export type SeoRobots = {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
};

export type SeoImage = {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
};

export type OpenGraphInput = {
    type?: string;
    siteName?: string;
    url?: string;
    images?: SeoImage[];
};

export type TwitterInput = {
    card?: "summary" | "summary_large_image" | "app" | "player";
    site?: string;
    creator?: string;
};

export type JsonLdNode = Record<string, unknown>;

export type MetaInput = {
    title?: string | null;
    description?: string | null;
    canonical?: string | null;
    robots?: SeoRobots | null;
    openGraph?: OpenGraphInput | null;
    twitter?: TwitterInput | null;
    jsonLd?: JsonLdNode | JsonLdNode[] | null;
};

export type AutoConfig = {
    titleFromPath?: boolean;
    titleFromH1?: boolean;
    descriptionFromContent?: boolean;
    contentExtractor?: (ctx: ResolveContext) => string | undefined;
};

export type LintConfig = {
    strict?: boolean;
};

export type SeoConfig = MetaInput & {
    baseUrl?: string;
    titleTemplate?: string;
    defaultTitle?: string;
    auto?: AutoConfig;
    lint?: LintConfig;
};

export type ResolveContext = {
    pathname?: string;
    routeKey?: string;
    h1?: string;
    contentText?: string;
    env?: "development" | "production" | "test";
};

export type ResolvedMeta = {
    title?: string;
    description?: string;
    canonical?: string;
    robots?: SeoRobots;
    openGraph?: OpenGraphInput;
    twitter?: TwitterInput;
    jsonLd?: JsonLdNode[];
};

export type LintIssueCode =
    | "missing_title"
    | "missing_description"
    | "missing_opengraph"
    | "missing_canonical"
    | "missing_og_image"
    | "title_too_long"
    | "duplicate_title";

export type LintIssue = {
    code: LintIssueCode;
    message: string;
    level: "warn" | "error";
    routeKey?: string;
};

export type NextMetadataLike = {
    title?: string;
    description?: string;
    alternates?: { canonical?: string };
    robots?: {
        index?: boolean;
        follow?: boolean;
        noarchive?: boolean;
        nosnippet?: boolean;
        [k: string]: unknown;
    };
    openGraph?: OpenGraphInput;
    twitter?: TwitterInput;
};

export type HeadEntry =
    | { type: "title"; content: string; key: string }
    | {
          type: "meta";
          name?: string;
          property?: string;
          content: string;
          key: string;
      }
    | { type: "link"; rel: string; href: string; key: string }
    | {
          type: "script";
          scriptType: "application/ld+json";
          json: string;
          key: string;
      };
