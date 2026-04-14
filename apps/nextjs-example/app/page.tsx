import Link from "next/link";

export default function HomePage() {
    return (
        <main>
            <h1>MetadataX Next.js Example</h1>
            <p>
                This route inherits defaults from defineSeoConfig and layout
                metadata.
            </p>
            <p>
                Open the dynamic blog page to see route metadata and JSON-LD in
                action:
                <br />
                <Link href="/blog/my-first-post">/blog/my-first-post</Link>
            </p>
        </main>
    );
}
