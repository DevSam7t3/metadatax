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

export type BreadcrumbItem = {
    name: string;
    item?: string;
};

export type BreadcrumbJsonLdInput = {
    items?: BreadcrumbItem[];
    multipleTrails?: BreadcrumbItem[][];
};

function mapBreadcrumbTrail(items: BreadcrumbItem[]): Record<string, unknown> {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: entry.name,
            item: entry.item,
        })),
    };
}

export function breadcrumbJsonLd(
    input: BreadcrumbJsonLdInput,
): Record<string, unknown> {
    if (input.multipleTrails?.length) {
        return {
            "@graph": input.multipleTrails.map((trail) =>
                mapBreadcrumbTrail(trail),
            ),
        };
    }

    const items = input.items ?? [];
    return mapBreadcrumbTrail(items);
}

export type OrganizationJsonLdInput = {
    type?: "Organization" | "OnlineStore";
    name: string;
    url?: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
        contactType?: string;
        telephone?: string;
        email?: string;
    };
};

export function organizationJsonLd(
    input: OrganizationJsonLdInput,
): Record<string, unknown> {
    return {
        "@type": input.type ?? "Organization",
        name: input.name,
        url: input.url,
        logo: input.logo,
        description: input.description,
        sameAs: input.sameAs,
        contactPoint: input.contactPoint
            ? {
                  "@type": "ContactPoint",
                  ...input.contactPoint,
              }
            : undefined,
    };
}

export type ProductOfferInput = {
    price: number | string;
    priceCurrency: string;
    availability?: string;
    url?: string;
};

export type ProductJsonLdInput = {
    name: string;
    description?: string;
    image?: string | string[];
    sku?: string;
    brand?: string;
    offers?: ProductOfferInput;
};

export function productJsonLd(
    input: ProductJsonLdInput,
): Record<string, unknown> {
    return {
        "@type": "Product",
        name: input.name,
        description: input.description,
        image: input.image,
        sku: input.sku,
        brand: input.brand
            ? { "@type": "Brand", name: input.brand }
            : undefined,
        offers: input.offers
            ? {
                  "@type": "Offer",
                  ...input.offers,
              }
            : undefined,
    };
}
