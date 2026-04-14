import type { Metadata } from "next";
import { createMetadata } from "@avenra/metadatax";
import { seo } from "../seo.config";
import "./globals.css";

export const metadata: Metadata = createMetadata(seo, {});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
