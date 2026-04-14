import type { SeoConfig } from "./types";

const globalConfig: { current?: SeoConfig } = {};

export function defineSeoConfig(config: SeoConfig): SeoConfig {
    globalConfig.current = config;
    return config;
}

export function getGlobalSeoConfig(): SeoConfig {
    return globalConfig.current ?? {};
}

export function defineSeoDefaults(config: SeoConfig): SeoConfig {
    return config;
}
