import Link from "next/link";

export default function HomePage() {
    return (
        <main>
            <h1>MetadataX Next.js Example</h1>
            <p>
                This app shows clean App Router integration using a single
                `seo.config.ts` and route-level `generateMetadata`.
            </p>
            <ul>
                <li>
                    <Link href="/blog/my-first-post">Blog article example</Link>
                    : article + breadcrumb JSON-LD.
                </li>
                <li>
                    <Link href="/products/metadatax-pro">Product example</Link>:
                    product + breadcrumb JSON-LD.
                </li>
                <li>
                    <Link href="/about">About example</Link>: organization
                    JSON-LD.
                </li>
            </ul>
        </main>
    );
}
