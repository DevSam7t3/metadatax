import type {
    LintConfig,
    LintIssue,
    LintIssueCode,
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

function pickRuleLevel(
    config: LintConfig | undefined,
    code: LintIssueCode,
): "warn" | "error" | undefined {
    const override = config?.rules?.[code];
    if (override === false) return undefined;
    if (override === "warn" || override === "error") return override;
    return pickLevel(config);
}

function pushRuleIssue(
    findings: LintIssue[],
    config: LintConfig | undefined,
    code: LintIssueCode,
    message: string,
    routeKey?: string,
): void {
    const level = pickRuleLevel(config, code);
    if (!level) return;
    findings.push(issue(level, code, message, routeKey));
}

export function validateMeta(
    resolved: ResolvedMeta,
    lint: LintConfig | undefined,
    ctx: ResolveContext = {},
): LintIssue[] {
    const findings: LintIssue[] = [];
    const maxTitleLength =
        lint?.rules?.titleLength === undefined ? 60 : lint.rules.titleLength;

    if (!resolved.title) {
        pushRuleIssue(
            findings,
            lint,
            "missing_title",
            "Missing title",
            ctx.routeKey,
        );
    }

    if (!resolved.description) {
        pushRuleIssue(
            findings,
            lint,
            "missing_description",
            "Missing description",
            ctx.routeKey,
        );
    }

    if (!resolved.openGraph) {
        pushRuleIssue(
            findings,
            lint,
            "missing_opengraph",
            "Missing Open Graph metadata",
            ctx.routeKey,
        );
    }

    if (!resolved.openGraph?.images?.length) {
        pushRuleIssue(
            findings,
            lint,
            "missing_og_image",
            "Open Graph image is missing",
            ctx.routeKey,
        );
    }

    if (!resolved.canonical) {
        pushRuleIssue(
            findings,
            lint,
            "missing_canonical",
            "Missing canonical URL",
            ctx.routeKey,
        );
    }

    if (
        maxTitleLength !== false &&
        resolved.title &&
        resolved.title.length > maxTitleLength
    ) {
        pushRuleIssue(
            findings,
            lint,
            "title_too_long",
            `Title exceeds ${maxTitleLength} characters`,
            ctx.routeKey,
        );
    }

    if (resolved.title && ctx.routeKey) {
        const previous = duplicateRegistry.get(resolved.title);
        if (previous && previous !== ctx.routeKey) {
            pushRuleIssue(
                findings,
                lint,
                "duplicate_title",
                `Duplicate title detected for routes: ${previous} and ${ctx.routeKey}`,
                ctx.routeKey,
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
