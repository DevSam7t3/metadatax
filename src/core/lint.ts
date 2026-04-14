import type {
    LintConfig,
    LintIssue,
    ResolvedMeta,
    ResolveContext,
} from "../types";

const duplicateRegistry = new Map<string, string>();

function issue(
    level: "warn" | "error",
    code: LintIssue["code"],
    message: string,
    routeKey?: string,
): LintIssue {
    return { level, code, message, routeKey };
}

function pickLevel(config?: LintConfig): "warn" | "error" {
    return config?.strict ? "error" : "warn";
}

export function validateMeta(
    resolved: ResolvedMeta,
    lint: LintConfig | undefined,
    ctx: ResolveContext = {},
): LintIssue[] {
    const findings: LintIssue[] = [];
    const level = pickLevel(lint);

    if (!resolved.canonical) {
        findings.push(
            issue(
                level,
                "missing_canonical",
                "Missing canonical URL",
                ctx.routeKey,
            ),
        );
    }

    if (!resolved.openGraph?.images?.length) {
        findings.push(
            issue(
                level,
                "missing_og_image",
                "Open Graph image is missing",
                ctx.routeKey,
            ),
        );
    }

    if (resolved.title && resolved.title.length > 60) {
        findings.push(
            issue(
                level,
                "title_too_long",
                "Title exceeds 60 characters",
                ctx.routeKey,
            ),
        );
    }

    if (resolved.title && ctx.routeKey) {
        const previous = duplicateRegistry.get(resolved.title);
        if (previous && previous !== ctx.routeKey) {
            findings.push(
                issue(
                    level,
                    "duplicate_title",
                    `Duplicate title detected for routes: ${previous} and ${ctx.routeKey}`,
                    ctx.routeKey,
                ),
            );
        } else {
            duplicateRegistry.set(resolved.title, ctx.routeKey);
        }
    }

    return findings;
}

export function __resetLintRegistryForTests(): void {
    duplicateRegistry.clear();
}
