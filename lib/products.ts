import { readFileSync } from "node:fs";
import path from "node:path";

import type { Product, ProductSpecification } from "@/types/product";

const PRODUCTS_FILE_PATH = path.join(process.cwd(), "data", "products.json");

type RawProduct = Omit<
  Product,
  "mainImage" | "galleryImages" | "specifications" | "description"
> & {
  mainImage?: unknown;
  galleryImages?: unknown;
  specifications?: unknown;
  description?: unknown;
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    const normalized = normalizeString(item);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function normalizeSpecifications(value: unknown): ProductSpecification[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: ProductSpecification[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const label = normalizeString((item as { label?: unknown }).label);
    const specValue = normalizeString((item as { value?: unknown }).value);

    if (!label || !specValue) {
      continue;
    }

    result.push({ label, value: specValue });
  }

  return result;
}

function normalizeGalleryImages(value: unknown, mainImage: string): string[] {
  return normalizeStringArray(value)
    .filter((image) => image !== mainImage)
    .slice(0, 10);
}

function normalizeProduct(product: RawProduct): Product {
  const images = normalizeStringArray(product.images);
  const mainImage = normalizeString(product.mainImage) || images[0] || "";

  return {
    ...product,
    images,
    mainImage,
    galleryImages: normalizeGalleryImages(product.galleryImages, mainImage),
    specifications: normalizeSpecifications(product.specifications),
    description: normalizeString(product.description),
  };
}

function readProductsFile(): Product[] {
  const fileContent = readFileSync(PRODUCTS_FILE_PATH, "utf8");
  const parsed: unknown = JSON.parse(fileContent);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return (parsed as RawProduct[]).map(normalizeProduct);
}

export function getAllProducts(): Product[] {
  return readProductsFile();
}

export function getVisibleProducts(): Product[] {
  return readProductsFile().filter((product) => product.isVisible);
}

export function getFeaturedProducts(): Product[] {
  return readProductsFile().filter(
    (product) => product.isVisible && product.isFeatured
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return readProductsFile().find((product) => product.slug === slug);
}
