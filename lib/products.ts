import rawProducts from "@/data/products.json";
import type { Product } from "@/types/product";

const products = rawProducts as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getVisibleProducts(): Product[] {
  return products.filter((product) => product.isVisible);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(
    (product) => product.isVisible && product.isFeatured
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}