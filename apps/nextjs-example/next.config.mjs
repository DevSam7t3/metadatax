import { withMetadataX } from "@avenra/metadatax/next-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withMetadataX(nextConfig, {
    failOn: "warning",
});
