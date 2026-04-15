import type { BuildFailMode } from "./types";

type WebpackConfigLike = {
    plugins?: unknown[];
    [k: string]: unknown;
};

type NextWebpackContext = {
    dev?: boolean;
    webpack?: {
        DefinePlugin?: new (definitions: Record<string, string>) => {
            apply(compiler: unknown): void;
        };
    };
};

type NextConfigLike = {
    webpack?: (
        config: WebpackConfigLike,
        context: NextWebpackContext,
    ) => WebpackConfigLike;
    [k: string]: unknown;
};

export type MetadataXNextPluginOptions = {
    failOn?: BuildFailMode;
};

function normalizeFailOn(input: BuildFailMode | undefined): BuildFailMode {
    if (input === "warning" || input === "all") return input;
    return "error";
}

export function withMetadataX(
    nextConfig: NextConfigLike,
    options: MetadataXNextPluginOptions = {},
): NextConfigLike {
    const failOn = normalizeFailOn(options.failOn);
    const existingWebpack = nextConfig.webpack;

    return {
        ...nextConfig,
        webpack(config: WebpackConfigLike, context: NextWebpackContext) {
            const baseConfig = existingWebpack
                ? (existingWebpack(config, context) ?? config)
                : config;

            if (!context.dev && context.webpack?.DefinePlugin) {
                baseConfig.plugins ??= [];
                baseConfig.plugins.push(
                    new context.webpack.DefinePlugin({
                        __METADATAX_FAIL_ON__: JSON.stringify(failOn),
                    }),
                );
            }

            return baseConfig;
        },
    };
}
