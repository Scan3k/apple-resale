import { NextResponse } from "next/server";

import {
  AdminProductsStorageError,
  createAdminProduct,
  getAdminProducts,
} from "@/lib/admin/products-storage";
import {
  AdminProductMapperError,
  mapCreateAdminProductInput,
} from "@/lib/admin/product-mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");

  return new NextResponse(JSON.stringify(data), {
    ...init,
    headers,
  });
}

function buildErrorResponse(error: unknown) {
  if (error instanceof AdminProductMapperError) {
    return jsonResponse(
      {
        error: {
          code: error.code,
          field: error.field ?? null,
          message: error.message,
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof AdminProductsStorageError) {
    const status =
      error.code === "DUPLICATE_PRODUCT_ID" ||
      error.code === "DUPLICATE_PRODUCT_SLUG"
        ? 409
        : error.code === "PRODUCT_NOT_FOUND"
          ? 404
          : error.code === "PRODUCT_ID_MISMATCH"
            ? 400
            : 500;

    return jsonResponse(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status }
    );
  }

  console.error("[admin/products] unexpected error", error);

  return jsonResponse(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error.",
      },
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const products = await getAdminProducts();

    return jsonResponse({ products });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const product = mapCreateAdminProductInput(payload);
    const createdProduct = await createAdminProduct(product);

    return jsonResponse({ product: createdProduct }, { status: 201 });
  } catch (error) {
    return buildErrorResponse(error);
  }
}