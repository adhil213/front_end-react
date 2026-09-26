import { useEffect } from "react";
import {
  BRAND,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  OG_IMAGE_ALT,
  absoluteUrl,
  buildTitle,
} from "../config/seo";

const JSON_LD_ID = "ld-json-page";

const upsertMeta = (attr, key, content) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) {
    el.setAttribute("content", content);
  } else {
    el.removeAttribute("content");
  }
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const upsertJsonLd = (data) => {
  const existing = document.getElementById(JSON_LD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  const script = existing || document.createElement("script");
  script.type = "application/ld+json";
  script.id = JSON_LD_ID;
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
};

/**
 * Keeps document head metadata in sync with the rendered route.
 * @param {object} meta
 * @param {string} [meta.title]        Page title, suffixed with the brand name.
 * @param {string} [meta.description]  Meta description.
 * @param {string} [meta.path]         Site-relative path used for canonical + og:url.
 * @param {string} [meta.image]        Absolute share image URL.
 * @param {string} [meta.imageAlt]
 * @param {string} [meta.type]         Open Graph type, e.g. "product".
 * @param {boolean} [meta.noindex]     Emits robots noindex,nofollow.
 * @param {object|object[]} [meta.jsonLd] Structured data for the page.
 */
export default function useDocumentMeta({
  title,
  titleTemplate = true,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
  type = "website",
  noindex = false,
  jsonLd = null,
} = {}) {
  const fullTitle = titleTemplate ? buildTitle(title) : title || DEFAULT_TITLE;
  const url = absoluteUrl(path);

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", BRAND);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", imageAlt);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", imageAlt);

    upsertCanonical(url);
    upsertJsonLd(jsonLd);
  }, [
    fullTitle,
    description,
    url,
    image,
    imageAlt,
    type,
    noindex,
    jsonLd,
  ]);
}
