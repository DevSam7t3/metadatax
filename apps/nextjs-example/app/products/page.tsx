import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@avenra/metadatax";
import { seo } from "../../seo.config";

export const metadata: Metadata = createMetadata(seo, {
    title: "Products",
    canonical: "/products",
    description: "Browse demo product pages using MetadataX.",
});

export default function ProductsPage() {
    return (
        <main>
            <h1>Products</h1>
            <p>Open a sample product route:</p>
            <ul>
                <li>
                    <Link href="/products/metadatax-pro">MetadataX Pro</Link>
                </li>
            </ul>
        </main>
    );
}
