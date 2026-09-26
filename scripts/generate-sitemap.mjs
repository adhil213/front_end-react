/**
 * Generates public/sitemap.xml from the live product catalog.
 * Runs automatically before `vite build` (see package.json "prebuild").
 *
 * The catalog fetch is allowed to fail: a network outage must not delete an
 * already-published sitemap, so static routes are still written and product
 * URLs are simply skipped for that run.
 */
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SITE_URL = "https://ezbuy.m-s.site";
const API_URL = "https://backend-sk0h.onrender.com/products";
const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

const CATEGORIES = [
  "Laptops",
  "Smartphones",
  "Headphones",
  "Tablets",
  "Accessories",
  "Wearables",
];

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const today = () => new Date().toISOString().slice(0, 10);

const urlEntry = ({ loc, lastmod, priority, changefreq, image }) => {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
  ];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  if (image) {
    lines.push("    <image:image>");
    lines.push(`      <image:loc>${escapeXml(image)}</image:loc>`);
    lines.push("    </image:image>");
  }
  lines.push("  </url>");
  return lines.join("\n");
};

const fetchProducts = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } finally {
    clearTimeout(timer);
  }
};

const build = (products) => {
  const lastmod = today();
  const entries = [
    urlEntry({
      loc: `${SITE_URL}/`,
      lastmod,
      changefreq: "daily",
      priority: "1.0",
    }),
    urlEntry({
      loc: `${SITE_URL}/products`,
      lastmod,
      changefreq: "daily",
      priority: "0.9",
    }),
  ];

  for (const category of CATEGORIES) {
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/products?category=${encodeURIComponent(category)}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.8",
      })
    );
  }

  for (const product of products) {
    if (!product?._id) continue;
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/products/${product._id}`,
        lastmod,
        changefreq: "weekly",
        priority: "0.7",
        image: product.image,
      })
    );
  }

  entries.push(
    urlEntry({
      loc: `${SITE_URL}/aboutus`,
      lastmod,
      changefreq: "monthly",
      priority: "0.5",
    }),
    urlEntry({
      loc: `${SITE_URL}/contact`,
      lastmod,
      changefreq: "monthly",
      priority: "0.5",
    })
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
};

const main = async () => {
  let products = [];
  try {
    products = await fetchProducts();
    console.log(`[sitemap] ${products.length} products fetched`);
  } catch (err) {
    console.warn(`[sitemap] catalog fetch failed (${err.message}); writing static routes only`);
  }

  const xml = build(products);

  if (!products.length) {
    try {
      const existing = await readFile(OUT, "utf8");
      const kept = (existing.match(/<url>/g) || []).length;
      console.warn(`[sitemap] keeping existing ${OUT} (${kept} urls)`);
      return;
    } catch {
      // no previous sitemap — write what we have
    }
  }

  await writeFile(OUT, xml, "utf8");
  const total = (xml.match(/<url>/g) || []).length;
  console.log(`[sitemap] wrote ${OUT} (${total} urls)`);
};

main().catch((err) => {
  console.warn(`[sitemap] skipped: ${err.message}`);
});
