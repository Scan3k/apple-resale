import { randomUUID } from "node:crypto";

import type {
  Product,
  ProductCategory,
  ProductSpecification,
  ProductStatus,
} from "@/types/product";

const PRODUCT_CATEGORIES = [
  "iphone",
  "ipad",
  "macbook",
  "imac",
  "apple-watch",
  "airpods",
  "accessories",
] as const satisfies readonly ProductCategory[];

const PRODUCT_STATUSES = [
  "available",
  "reserved",
  "sold",
] as const satisfies readonly ProductStatus[];

type AdminProductMapperErrorCode =
  | "INVALID_PRODUCT_INPUT"
  | "REQUIRED_FIELD_MISSING"
  | "INVALID_PRODUCT_CATEGORY"
  | "INVALID_PRODUCT_STATUS"
  | "INVALID_PRODUCT_PRICE"
  | "INVALID_PRODUCT_OLD_PRICE"
  | "INVALID_PRODUCT_BOOLEAN";

export class AdminProductMapperError extends Error {
  constructor(
    message: string,
    public code: AdminProductMapperErrorCode,
    public field?: string
  ) {
    super(message);
    this.name = "AdminProductMapperError";
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getInputRecord(input: unknown): Record<string, unknown> {
  if (!isPlainObject(input)) {
    throw new AdminProductMapperError(
      "Admin product payload must be an object.",
      "INVALID_PRODUCT_INPUT"
    );
  }

  return input;
}

function hasOwnField(record: Record<string, unknown>, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, field);
}

function pickValue<T>(
  record: Record<string, unknown>,
  field: string,
  fallback: T
): unknown {
  return hasOwnField(record, field) ? record[field] : fallback;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRequiredString(value: unknown, field: string): string {
  const normalized = normalizeString(value);

  if (!normalized) {
    throw new AdminProductMapperError(
      `Field "${field}" is required.`,
      "REQUIRED_FIELD_MISSING",
      field
    );
  }

  return normalized;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = normalizeString(value);

  return normalized || undefined;
}

function normalizeBoolean(
  value: unknown,
  field: string,
  fallback: boolean
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1") {
      return true;
    }

    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  throw new AdminProductMapperError(
    `Field "${field}" must be a boolean.`,
    "INVALID_PRODUCT_BOOLEAN",
    field
  );
}

function normalizeRequiredPrice(value: unknown, field: string): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (normalized) {
      const parsed = Number(normalized);

      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
      }
    }
  }

  throw new AdminProductMapperError(
    `Field "${field}" must be a valid non-negative number.`,
    "INVALID_PRODUCT_PRICE",
    field
  );
}

function normalizeOptionalPrice(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (!normalized) {
      return undefined;
    }

    const parsed = Number(normalized);

    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  throw new AdminProductMapperError(
    `Field "${field}" must be a valid non-negative number.`,
    "INVALID_PRODUCT_OLD_PRICE",
    field
  );
}

function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

function normalizeCategory(value: unknown, fallback?: ProductCategory): ProductCategory {
  if (value === undefined && fallback) {
    return fallback;
  }

  const normalized = normalizeRequiredString(value, "category");

  if (!isProductCategory(normalized)) {
    throw new AdminProductMapperError(
      `Field "category" must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`,
      "INVALID_PRODUCT_CATEGORY",
      "category"
    );
  }

  return normalized;
}

function isProductStatus(value: string): value is ProductStatus {
  return PRODUCT_STATUSES.includes(value as ProductStatus);
}

function normalizeStatus(value: unknown, fallback?: ProductStatus): ProductStatus | undefined {
  if (value === undefined) {
    return fallback;
  }

  const normalized = normalizeString(value);

  if (!normalized) {
    return undefined;
  }

  if (!isProductStatus(normalized)) {
    throw new AdminProductMapperError(
      `Field "status" must be one of: ${PRODUCT_STATUSES.join(", ")}.`,
      "INVALID_PRODUCT_STATUS",
      "status"
    );
  }

  return normalized;
}

function normalizeStringArray(value: unknown): string[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new AdminProductMapperError(
      "Field must be an array of strings.",
      "INVALID_PRODUCT_INPUT"
    );
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
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new AdminProductMapperError(
      'Field "specifications" must be an array.',
      "INVALID_PRODUCT_INPUT",
      "specifications"
    );
  }

  const result: ProductSpecification[] = [];

  for (const item of value) {
    if (!isPlainObject(item)) {
      continue;
    }

    const label = normalizeString(item.label);
    const specValue = normalizeString(item.value);

    if (!label || !specValue) {
      continue;
    }

    result.push({ label, value: specValue });
  }

  return result;
}

function getExistingMainImage(product?: Product): string {
  if (!product) {
    return "";
  }

  const mainImage = normalizeString(product.mainImage);

  if (mainImage) {
    return mainImage;
  }

  const legacyImages = Array.isArray(product.images) ? product.images : [];
  const firstLegacyImage = legacyImages
    .map((image) => normalizeString(image))
    .find(Boolean);

  return firstLegacyImage ?? "";
}

function normalizeGalleryImages(value: unknown, mainImage: string): string[] {
  return normalizeStringArray(value)
    .filter((image) => image !== mainImage)
    .slice(0, 10);
}

function buildLegacyImages(mainImage: string, galleryImages: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const image of [mainImage, ...galleryImages]) {
    const normalized = normalizeString(image);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function buildProductId(category: ProductCategory): string {
  return `${category}-${randomUUID().slice(0, 8)}`;
}

function buildCreateBase(record: Record<string, unknown>): Product {
  const category = normalizeCategory(record.category);
  const mainImage = normalizeRequiredString(record.mainImage, "mainImage");
  const galleryImages = normalizeGalleryImages(record.galleryImages, mainImage);
  const now = new Date().toISOString();

  return {
    id: normalizeString(record.id) || buildProductId(category),
    slug: normalizeRequiredString(record.slug, "slug"),
    name: normalizeRequiredString(record.name, "name"),
    category,
    price: normalizeRequiredPrice(record.price, "price"),
    images: buildLegacyImages(mainImage, galleryImages),
    mainImage,
    galleryImages,
    specifications: normalizeSpecifications(record.specifications),
    description: normalizeString(record.description),
    isVisible: normalizeBoolean(record.isVisible, "isVisible", true),
    brand: normalizeOptionalString(record.brand),
    model: normalizeOptionalString(record.model),
    condition: normalizeOptionalString(record.condition),
    storage: normalizeOptionalString(record.storage),
    color: normalizeOptionalString(record.color),
    oldPrice: normalizeOptionalPrice(record.oldPrice, "oldPrice"),
    isFeatured: normalizeBoolean(record.isFeatured, "isFeatured", false),
    status: normalizeStatus(record.status),
    createdAt: now,
    updatedAt: now,
  };
}

function buildUpdateBase(
  record: Record<string, unknown>,
  existingProduct: Product
): Product {
  const category = normalizeCategory(
    pickValue(record, "category", existingProduct.category),
    existingProduct.category
  );

  const mainImage = normalizeRequiredString(
    pickValue(record, "mainImage", getExistingMainImage(existingProduct)),
    "mainImage"
  );

  const galleryImages = normalizeGalleryImages(
    pickValue(record, "galleryImages", existingProduct.galleryImages),
    mainImage
  );

  return {
    id: normalizeRequiredString(
      pickValue(record, "id", existingProduct.id),
      "id"
    ),
    slug: normalizeRequiredString(
      pickValue(record, "slug", existingProduct.slug),
      "slug"
    ),
    name: normalizeRequiredString(
      pickValue(record, "name", existingProduct.name),
      "name"
    ),
    category,
    price: normalizeRequiredPrice(
      pickValue(record, "price", existingProduct.price),
      "price"
    ),
    images: buildLegacyImages(mainImage, galleryImages),
    mainImage,
    galleryImages,
    specifications: normalizeSpecifications(
      pickValue(record, "specifications", existingProduct.specifications)
    ),
    description: normalizeString(
      pickValue(record, "description", existingProduct.description)
    ),
    isVisible: normalizeBoolean(
      pickValue(record, "isVisible", existingProduct.isVisible),
      "isVisible",
      existingProduct.isVisible
    ),
    brand: normalizeOptionalString(
      pickValue(record, "brand", existingProduct.brand)
    ),
    model: normalizeOptionalString(
      pickValue(record, "model", existingProduct.model)
    ),
    condition: normalizeOptionalString(
      pickValue(record, "condition", existingProduct.condition)
    ),
    storage: normalizeOptionalString(
      pickValue(record, "storage", existingProduct.storage)
    ),
    color: normalizeOptionalString(
      pickValue(record, "color", existingProduct.color)
    ),
    oldPrice: normalizeOptionalPrice(
      pickValue(record, "oldPrice", existingProduct.oldPrice),
      "oldPrice"
    ),
    isFeatured: normalizeBoolean(
      pickValue(record, "isFeatured", existingProduct.isFeatured),
      "isFeatured",
      existingProduct.isFeatured ?? false
    ),
    status: normalizeStatus(
      pickValue(record, "status", existingProduct.status),
      existingProduct.status
    ),
    createdAt: existingProduct.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function mapCreateAdminProductInput(input: unknown): Product {
  const record = getInputRecord(input);

  return buildCreateBase(record);
}

export function mapUpdateAdminProductInput(
  input: unknown,
  existingProduct: Product
): Product {
  const record = getInputRecord(input);

  return buildUpdateBase(record, existingProduct);
}

