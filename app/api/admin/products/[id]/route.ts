import { NextResponse } from "next/server";

import {
  AdminProductsStorageError,
  deleteAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/lib/admin/products-storage";
import {
  AdminProductMapperError,
  mapUpdateAdminProductInput,
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

  console.error("[admin/products/:id] unexpected error", error);

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

async function getRouteId(context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return params.id;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getRouteId(context);
    const product = await getAdminProductById(id);

    if (!product) {
      return jsonResponse(
        {
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: `Product with id "${id}" was not found.`,
          },
        },
        { status: 404 }
      );
    }

    return jsonResponse({ product });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getRouteId(context);
    const existingProduct = await getAdminProductById(id);

    if (!existingProduct) {
      return jsonResponse(
        {
          error: {
            code: "PRODUCT_NOT_FOUND",
            message: `Product with id "${id}" was not found.`,
          },
        },
        { status: 404 }
      );
    }

    const payload: unknown = await request.json();
    const product = mapUpdateAdminProductInput(payload, existingProduct);
    const updatedProduct = await updateAdminProduct(id, product);

    return jsonResponse({ product: updatedProduct });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getRouteId(context);
    const deletedProduct = await deleteAdminProduct(id);

    return jsonResponse({ product: deletedProduct });
  } catch (error) {
    return buildErrorResponse(error);
  }
}