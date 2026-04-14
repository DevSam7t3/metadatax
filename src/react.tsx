import React from "react";
import { createHeadEntries } from "./adapters";
import type { HeadEntry, MetaInput, ResolveContext } from "./types";

function renderEntry(entry: HeadEntry): React.ReactElement {
    if (entry.type === "title") {
        return <title key={entry.key}>{entry.content}</title>;
    }
    if (entry.type === "meta") {
        return (
            <meta
                key={entry.key}
                name={entry.name}
                property={entry.property}
                content={entry.content}
            />
        );
    }
    if (entry.type === "link") {
        return <link key={entry.key} rel={entry.rel} href={entry.href} />;
    }
    return (
        <script
            key={entry.key}
            type={entry.scriptType}
            dangerouslySetInnerHTML={{ __html: entry.json }}
        />
    );
}

export function Meta(
    props: MetaInput & { context?: ResolveContext },
): React.ReactElement {
    const { context, ...input } = props;
    const { entries, lintIssues } = createHeadEntries(input, context);

    if (context?.env !== "production") {
        lintIssues.forEach((issue) => {
            const label = `[metadatax:${issue.code}] ${issue.message}`;
            if (issue.level === "error") {
                // Keep this non-throwing to avoid disrupting dev rendering.
                console.error(label);
            } else {
                console.warn(label);
            }
        });
    }

    return <>{entries.map(renderEntry)}</>;
}

export function JsonLd({
    data,
}: {
    data: Record<string, unknown> | Record<string, unknown>[];
}): React.ReactElement {
    const payload = Array.isArray(data) ? data : [data];
    return (
        <>
            {payload.map((node, index) => (
                <script
                    key={`jsonld-inline:${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            ...node,
                        }),
                    }}
                />
            ))}
        </>
    );
}
