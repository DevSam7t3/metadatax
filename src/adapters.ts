import { getGlobalSeoConfig } from "./config";
import { resolveMeta } from "./core/resolve";
import { validateMeta } from "./core/lint";
import { toHeadEntries } from "./core/serialize";
import type {
    BuildFailMode,
    HeadEntry,
    LintIssue,
    MetaInput,
    NextMetadataLike,
    ResolveContext,
    SeoConfig,
} from "./types";

declare const __METADATAX_FAIL_ON__: string | undefined;

function normalizeFailMode(value?: string): BuildFailMode | undefined {
    if (!value) return undefined;
    if (value === "error" || value === "warning" || value === "all") {
        return value;
    }
    return undefined;
}

function selectBuildFatalIssues(
    lintIssues: LintIssue[],
    failOn: BuildFailMode | undefined,
): LintIssue[] {
    if (!failOn) return [];
    if (failOn === "all") return lintIssues;
    if (failOn === "warning") return lintIssues;
    return lintIssues.filter((issue) => issue.level === "error");
}

function readBuildFailMode(): BuildFailMode | undefined {
    if (typeof __METADATAX_FAIL_ON__ === "undefined") return undefined;
    return normalizeFailMode(__METADATAX_FAIL_ON__);
}

function shouldRunLint(context: ResolveContext): boolean {
    if (context.env !== "production") return true;
    return readBuildFailMode() !== undefined;
}

export function createResolvedMeta(
    input: MetaInput,
    context: ResolveContext = {},
    defaults?: SeoConfig,
) {
    const cfg = defaults ?? getGlobalSeoConfig();
    const resolved = resolveMeta(input, cfg, context);
    const lintIssues = shouldRunLint(context)
        ? validateMeta(resolved, cfg.lint, context)
        : [];
    return { resolved, lintIssues };
}

export function createMetadata(
    defaults: SeoConfig,
    input: MetaInput = {},
    context: ResolveContext = {},
): NextMetadataLike {
    const { resolved, lintIssues } = createResolvedMeta(
        input,
        context,
        defaults,
    );

    if (lintIssues.length > 0) {
        for (const issue of lintIssues) {
            const prefix =
                issue.level === "error" ? "⨯ [SEO Error]" : "⚠ [SEO Warning]";
            const routeInfo = issue.routeKey
                ? ` (Route: ${issue.routeKey})`
                : "";
            const msg = `${prefix} ${issue.message}${routeInfo}`;
            if (issue.level === "error") {
                console.error(msg);
            } else {
                console.warn(msg);
            }
        }
    }

    const fatalIssues = selectBuildFatalIssues(lintIssues, readBuildFailMode());
    if (fatalIssues.length > 0) {
        const detail = fatalIssues
            .map((issue) => {
                const routeInfo = issue.routeKey ? ` (${issue.routeKey})` : "";
                return `${issue.code}${routeInfo}: ${issue.message}`;
            })
            .join("; ");
        throw new Error(
            `[MetadataX] Build failed due to SEO lint issues: ${detail}`,
        );
    }

    return {
        title: resolved.title,
        description: resolved.description,
        alternates: { canonical: resolved.canonical },
        robots: resolved.robots,
        openGraph: resolved.openGraph,
        twitter: resolved.twitter,
    };
}

export function createHeadEntries(
    input: MetaInput,
    context: ResolveContext = {},
    defaults?: SeoConfig,
): {
    entries: HeadEntry[];
    lintIssues: LintIssue[];
} {
    const { resolved, lintIssues } = createResolvedMeta(
        input,
        context,
        defaults,
    );
    return { entries: toHeadEntries(resolved), lintIssues };
}
