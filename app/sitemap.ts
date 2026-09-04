import type { MetadataRoute } from "next";
import { getAllProducts, getAllCollections } from "@/lib/products";

const BASE_URL = "https://www.justonpointng.com";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/shop/men",
  "/shop/women",
  "/shop/accessories",
  "/shop/new-arrivals",
  "/collections",
  "/bespoke",
  "/active",
  "/about",
];

// Legal/utility pages: real, indexable content, but not primary discovery
// paths — kept separate from STATIC_ROUTES so they can carry a lower
// priority and changeFrequency without affecting the main routes above.
const LEGAL_ROUTES = ["/privacy", "/terms", "/returns"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getAllProducts(), getAllCollections()]);
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = LEGAL_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${BASE_URL}/collections/${collection.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...legalEntries, ...productEntries, ...collectionEntries];
}
