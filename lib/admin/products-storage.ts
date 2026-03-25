import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Product } from "@/types/product";

const PRODUCTS_FILE_PATH = path.join(process.cwd(), "data", "products.json");

type AdminProductsStorageErrorCode =
  | "INVALID_PRODUCTS_FILE"
  | "PRODUCT_NOT_FOUND"
  | "DUPLICATE_PRODUCT_ID"
  | "DUPLICATE_PRODUCT_SLUG"
  | "PRODUCT_ID_MISMATCH";

export class AdminProductsStorageError extends Error {
  constructor(
    message: string,
    public code: AdminProductsStorageErrorCode
  ) {
    super(message);
    this.name = "AdminProductsStorageError";
  }
}

async function readProductsFile(): Promise<Product[]> {
  const fileContent = await readFile(PRODUCTS_FILE_PATH, "utf8");
  const parsed: unknown = JSON.parse(fileContent);

  if (!Array.isArray(parsed)) {
    throw new AdminProductsStorageError(
      "data/products.json must contain an array of products.",
      "INVALID_PRODUCTS_FILE"
    );
  }

  return parsed as Product[];
}

async function writeProductsFile(products: Product[]): Promise<void> {
  const nextFileContent = `${JSON.stringify(products, null, 2)}\n`;

  await writeFile(PRODUCTS_FILE_PATH, nextFileContent, "utf8");
}

function assertUniqueProduct(
  products: Product[],
  nextProduct: Product,
  currentProductId?: string
): void {
  const duplicateId = products.find(
    (product) =>
      product.id === nextProduct.id && product.id !== currentProductId
  );

  if (duplicateId) {
    throw new AdminProductsStorageError(
      `Product with id "${nextProduct.id}" already exists.`,
      "DUPLICATE_PRODUCT_ID"
    );
  }

  const duplicateSlug = products.find(
    (product) =>
      product.slug === nextProduct.slug && product.id !== currentProductId
  );

  if (duplicateSlug) {
    throw new AdminProductsStorageError(
      `Product with slug "${nextProduct.slug}" already exists.`,
      "DUPLICATE_PRODUCT_SLUG"
    );
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  return readProductsFile();
}

export async function getAdminProductById(
  id: string
): Promise<Product | undefined> {
  const products = await readProductsFile();

  return products.find((product) => product.id === id);
}

export async function createAdminProduct(product: Product): Promise<Product> {
  const products = await readProductsFile();

  assertUniqueProduct(products, product);

  const nextProducts = [...products, product];

  await writeProductsFile(nextProducts);

  return product;
}

export async function updateAdminProduct(
  id: string,
  product: Product
): Promise<Product> {
  if (id !== product.id) {
    throw new AdminProductsStorageError(
      "Product id in the request path must match product.id in the payload.",
      "PRODUCT_ID_MISMATCH"
    );
  }

  const products = await readProductsFile();
  const existingProductIndex = products.findIndex(
    (existingProduct) => existingProduct.id === id
  );

  if (existingProductIndex === -1) {
    throw new AdminProductsStorageError(
      `Product with id "${id}" was not found.`,
      "PRODUCT_NOT_FOUND"
    );
  }

  assertUniqueProduct(products, product, id);

  const nextProducts = [...products];
  nextProducts[existingProductIndex] = product;

  await writeProductsFile(nextProducts);

  return product;
}
export async function deleteAdminProduct(id: string): Promise<Product> {
  const products = await readProductsFile();
  const existingProductIndex = products.findIndex(
    (product) => product.id === id
  );

  if (existingProductIndex === -1) {
    throw new AdminProductsStorageError(
      `Product with id "${id}" was not found.`,
      "PRODUCT_NOT_FOUND"
    );
  }

  const deletedProduct = products[existingProductIndex];
  const nextProducts = products.filter((product) => product.id !== id);

  await writeProductsFile(nextProducts);

  return deletedProduct;
}