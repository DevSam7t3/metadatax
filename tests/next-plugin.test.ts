import { describe, expect, test } from "vitest";
import { withMetadataX } from "../src/next-plugin";

class FakeDefinePlugin {
    definitions: Record<string, string>;

    constructor(definitions: Record<string, string>) {
        this.definitions = definitions;
    }

    apply(): void {
        // noop for tests
    }
}

describe("withMetadataX", () => {
    test("injects default errors-only fail mode on production builds", () => {
        const wrapped = withMetadataX({ reactStrictMode: true });
        const initialConfig = { plugins: [] as unknown[] };

        const out = wrapped.webpack?.(initialConfig, {
            dev: false,
            webpack: { DefinePlugin: FakeDefinePlugin },
        });

        expect(out?.plugins).toBeDefined();
        expect(out?.plugins?.length).toBe(1);
        expect((out?.plugins?.[0] as FakeDefinePlugin).definitions).toEqual({
            __METADATAX_FAIL_ON__: '"error"',
        });
    });

    test("supports warning and all fail modes", () => {
        const warningWrapped = withMetadataX(
            { reactStrictMode: true },
            { failOn: "warning" },
        );
        const warningOut = warningWrapped.webpack?.(
            { plugins: [] as unknown[] },
            { dev: false, webpack: { DefinePlugin: FakeDefinePlugin } },
        );

        expect(
            (warningOut?.plugins?.[0] as FakeDefinePlugin).definitions
                .__METADATAX_FAIL_ON__,
        ).toBe('"warning"');

        const allWrapped = withMetadataX(
            { reactStrictMode: true },
            { failOn: "all" },
        );
        const allOut = allWrapped.webpack?.(
            { plugins: [] as unknown[] },
            { dev: false, webpack: { DefinePlugin: FakeDefinePlugin } },
        );

        expect(
            (allOut?.plugins?.[0] as FakeDefinePlugin).definitions
                .__METADATAX_FAIL_ON__,
        ).toBe('"all"');
    });

    test("does not inject plugin in dev mode", () => {
        const wrapped = withMetadataX({ reactStrictMode: true });
        const out = wrapped.webpack?.(
            { plugins: [] as unknown[] },
            { dev: true, webpack: { DefinePlugin: FakeDefinePlugin } },
        );

        expect(out?.plugins).toEqual([]);
    });

    test("preserves existing webpack config callback", () => {
        const wrapped = withMetadataX({
            reactStrictMode: true,
            webpack(config) {
                config.plugins ??= [];
                config.plugins.push("existing");
                return config;
            },
        });

        const out = wrapped.webpack?.(
            { plugins: [] as unknown[] },
            { dev: false, webpack: { DefinePlugin: FakeDefinePlugin } },
        );

        expect(out?.plugins?.[0]).toBe("existing");
        expect((out?.plugins?.[1] as FakeDefinePlugin).definitions).toEqual({
            __METADATAX_FAIL_ON__: '"error"',
        });
    });
});
