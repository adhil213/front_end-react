export const SITE_URL = "https://ezbuy.m-s.site";
export const BRAND = "Ezbuy";
export const CURRENCY = "INR";
export const CATEGORIES = [
  "Laptops",
  "Smartphones",
  "Headphones",
  "Tablets",
  "Accessories",
  "Wearables",
];

export const DEFAULT_TITLE = "Ezbuy — Buy Once. Buy Right. Curated Tech & Gadgets";
export const DEFAULT_DESCRIPTION =
  "Ezbuy curates laptops, phones, headphones, cameras and wearables we would buy ourselves. Honest pricing, free express shipping, 30-day returns, 2-year warranty.";

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_IMAGE_ALT = "Ezbuy — curated laptops, smartphones, audio and wearables";
export const ORG_LOGO = `${SITE_URL}/icon-512.png`;

export const absoluteUrl = (path = "/") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const trimmed = clean === "/" ? "" : clean.replace(/\/+$/, "");
  return `${SITE_URL}${trimmed}`;
};

export const buildTitle = (title) => (title ? `${title} | ${BRAND}` : DEFAULT_TITLE);

export const truncate = (text = "", max = 155) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/**
 * Product structured data for a single product detail page.
 * @param {object} product Product document as returned by the products API.
 */
export const buildProductJsonLd = (product) => {
  if (!product?.name) return null;

  const url = absoluteUrl(`/products/${product._id}`);
  const description = truncate(
    product.description || DEFAULT_DESCRIPTION
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description,
    image: product.image ? [product.image] : undefined,
    sku: product.id || product._id,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.category || undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: CURRENCY,
      price: Number(product.price || 0).toFixed(2),
      availability:
        Number(product.stock) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: BRAND },
    },
  };
};

export const buildBreadcrumbJsonLd = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});
