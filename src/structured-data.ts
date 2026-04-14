export type ArticleJsonLdInput = {
    headline: string;
    description?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    image?: string;
    url?: string;
};

export function articleJsonLd(
    input: ArticleJsonLdInput,
): Record<string, unknown> {
    return {
        "@type": "Article",
        headline: input.headline,
        description: input.description,
        datePublished: input.datePublished,
        dateModified: input.dateModified,
        author: input.author
            ? { "@type": "Person", name: input.author }
            : undefined,
        image: input.image,
        url: input.url,
    };
}
