"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Product, ProductCategory, ProductStatus } from "@/types/product";

type ProductFormMode = "create" | "edit";

type ProductFormProps = {
  mode: ProductFormMode;
  initialProduct?: Product;
};

type SpecificationFormItem = {
  label: string;
  value: string;
};

type ProductFormValues = {
  name: string;
  slug: string;
  category: ProductCategory;
  price: string;
  mainImage: string;
  galleryImages: string[];
  specifications: SpecificationFormItem[];
  description: string;
  isVisible: boolean;
  brand: string;
  model: string;
  condition: string;
  storage: string;
  color: string;
  oldPrice: string;
  isFeatured: boolean;
  status: "" | ProductStatus;
};

const CATEGORY_OPTIONS: ProductCategory[] = [
  "iphone",
  "ipad",
  "macbook",
  "imac",
  "apple-watch",
  "airpods",
  "accessories",
];

const STATUS_OPTIONS: ProductStatus[] = ["available", "reserved", "sold"];

function buildInitialValues(initialProduct?: Product): ProductFormValues {
  return {
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    category: initialProduct?.category ?? "iphone",
    price:
      typeof initialProduct?.price === "number"
        ? String(initialProduct.price)
        : "",
    mainImage: initialProduct?.mainImage ?? "",
    galleryImages:
      initialProduct?.galleryImages.length
        ? initialProduct.galleryImages
        : [""],
    specifications:
      initialProduct?.specifications.length
        ? initialProduct.specifications.map((item) => ({
            label: item.label,
            value: item.value,
          }))
        : [{ label: "", value: "" }],
    description: initialProduct?.description ?? "",
    isVisible: initialProduct?.isVisible ?? true,
    brand: initialProduct?.brand ?? "",
    model: initialProduct?.model ?? "",
    condition: initialProduct?.condition ?? "",
    storage: initialProduct?.storage ?? "",
    color: initialProduct?.color ?? "",
    oldPrice:
      typeof initialProduct?.oldPrice === "number"
        ? String(initialProduct.oldPrice)
        : "",
    isFeatured: initialProduct?.isFeatured ?? false,
    status: initialProduct?.status ?? "",
  };
}

async function readJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export default function ProductForm({
  mode,
  initialProduct,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() =>
    buildInitialValues(initialProduct)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isBusy = isSubmitting || isDeleting;

  const title = useMemo(
    () => (mode === "create" ? "Создание товара" : "Редактирование товара"),
    [mode]
  );

  function updateField<K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateGalleryImage(index: number, value: string) {
    setValues((current) => {
      const nextGalleryImages = [...current.galleryImages];
      nextGalleryImages[index] = value;

      return {
        ...current,
        galleryImages: nextGalleryImages,
      };
    });
  }

  function addGalleryImage() {
    setValues((current) => {
      if (current.galleryImages.length >= 10) {
        return current;
      }

      return {
        ...current,
        galleryImages: [...current.galleryImages, ""],
      };
    });
  }

  function removeGalleryImage(index: number) {
    setValues((current) => {
      const nextGalleryImages = current.galleryImages.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...current,
        galleryImages: nextGalleryImages.length ? nextGalleryImages : [""],
      };
    });
  }

  function updateSpecification(
    index: number,
    field: keyof SpecificationFormItem,
    value: string
  ) {
    setValues((current) => {
      const nextSpecifications = [...current.specifications];
      nextSpecifications[index] = {
        ...nextSpecifications[index],
        [field]: value,
      };

      return {
        ...current,
        specifications: nextSpecifications,
      };
    });
  }

  function addSpecification() {
    setValues((current) => ({
      ...current,
      specifications: [...current.specifications, { label: "", value: "" }],
    }));
  }

  function removeSpecification(index: number) {
    setValues((current) => {
      const nextSpecifications = current.specifications.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...current,
        specifications: nextSpecifications.length
          ? nextSpecifications
          : [{ label: "", value: "" }],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      ...(mode === "edit" && initialProduct ? { id: initialProduct.id } : {}),
      name: values.name,
      slug: values.slug,
      category: values.category,
      price: values.price,
      mainImage: values.mainImage,
      galleryImages: values.galleryImages,
      specifications: values.specifications,
      description: values.description,
      isVisible: values.isVisible,
      brand: values.brand,
      model: values.model,
      condition: values.condition,
      storage: values.storage,
      color: values.color,
      oldPrice: values.oldPrice,
      isFeatured: values.isFeatured,
      status: values.status,
    };

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${initialProduct?.id}`;

    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        const apiMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "object" &&
          data.error !== null &&
          "message" in data.error &&
          typeof data.error.message === "string"
            ? data.error.message
            : "Не удалось сохранить товар.";

        throw new Error(apiMessage);
      }

      const nextProductId =
        typeof data === "object" &&
        data !== null &&
        "product" in data &&
        typeof data.product === "object" &&
        data.product !== null &&
        "id" in data.product &&
        typeof data.product.id === "string"
          ? data.product.id
          : null;

      if (mode === "create" && nextProductId) {
        router.push(`/admin/products/${nextProductId}`);
        router.refresh();
        return;
      }

      setSuccessMessage("Изменения успешно сохранены.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (mode !== "edit" || !initialProduct) {
      return;
    }

    const confirmed = window.confirm(
      `Удалить товар "${initialProduct.name}"? Это действие нельзя отменить.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        const apiMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "object" &&
          data.error !== null &&
          "message" in data.error &&
          typeof data.error.message === "string"
            ? data.error.message
            : "Не удалось удалить товар.";

        throw new Error(apiMessage);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при удалении."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="text-sm text-neutral-500">Admin / Товары</p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Заполните основные поля товара. Главное фото обязательно. Галерея,
          характеристики и описание можно дополнять постепенно.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Основное</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Название *
            </span>
            <input
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="Например: iPhone 14 128GB Midnight"
              required
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Slug *
            </span>
            <input
              value={values.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="iphone-14-128-midnight"
              required
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Категория *
            </span>
            <select
              value={values.category}
              onChange={(event) =>
                updateField("category", event.target.value as ProductCategory)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              disabled={isBusy}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Цена *
            </span>
            <input
              type="number"
              min="0"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="42990"
              required
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Бренд
            </span>
            <input
              value={values.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="Apple"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Модель
            </span>
            <input
              value={values.model}
              onChange={(event) => updateField("model", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="iPhone 14"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Состояние
            </span>
            <input
              value={values.condition}
              onChange={(event) => updateField("condition", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="good / excellent"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Объём памяти
            </span>
            <input
              value={values.storage}
              onChange={(event) => updateField("storage", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="128GB"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Цвет
            </span>
            <input
              value={values.color}
              onChange={(event) => updateField("color", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="Midnight"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Старая цена
            </span>
            <input
              type="number"
              min="0"
              value={values.oldPrice}
              onChange={(event) => updateField("oldPrice", event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              placeholder="49990"
              disabled={isBusy}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">
              Статус
            </span>
            <select
              value={values.status}
              onChange={(event) =>
                updateField("status", event.target.value as "" | ProductStatus)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
              disabled={isBusy}
            >
              <option value="">Не указан</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={values.isVisible}
              onChange={(event) =>
                updateField("isVisible", event.target.checked)
              }
              disabled={isBusy}
            />
            Показан на сайте
          </label>

          <label className="flex items-center gap-3 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(event) =>
                updateField("isFeatured", event.target.checked)
              }
              disabled={isBusy}
            />
            Избранный товар
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Главное фото</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Это обязательное фото. Оно используется как основное изображение
          товара.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">
            URL главного фото *
          </span>
          <input
            value={values.mainImage}
            onChange={(event) => updateField("mainImage", event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
            placeholder="/images/products/iphone-14-main.jpg"
            required
            disabled={isBusy}
          />
        </label>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Галерея</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Дополнительные фото товара. До 10 изображений.
            </p>
          </div>

          <button
            type="button"
            onClick={addGalleryImage}
            disabled={isBusy || values.galleryImages.length >= 10}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Добавить фото
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {values.galleryImages.map((image, index) => (
            <div key={index} className="flex gap-3">
              <input
                value={image}
                onChange={(event) =>
                  updateGalleryImage(index, event.target.value)
                }
                className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                placeholder={`/images/products/gallery-${index + 1}.jpg`}
                disabled={isBusy}
              />

              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                disabled={isBusy}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Характеристики
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Заполняются парами: название и значение.
            </p>
          </div>

          <button
            type="button"
            onClick={addSpecification}
            disabled={isBusy}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Добавить характеристику
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {values.specifications.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                value={item.label}
                onChange={(event) =>
                  updateSpecification(index, "label", event.target.value)
                }
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                placeholder="Например: Память"
                disabled={isBusy}
              />

              <input
                value={item.value}
                onChange={(event) =>
                  updateSpecification(index, "value", event.target.value)
                }
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                placeholder="Например: 128GB"
                disabled={isBusy}
              />

              <button
                type="button"
                onClick={() => removeSpecification(index)}
                disabled={isBusy}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Описание</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Подробное текстовое описание товара для карточки.
        </p>

        <textarea
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="mt-6 min-h-40 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
          placeholder="Подробно опишите состояние, комплект, особенности и важные детали товара."
          disabled={isBusy}
        />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isBusy}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Сохранение..."
            : mode === "create"
              ? "Создать товар"
              : "Сохранить изменения"}
        </button>

        {mode === "edit" && initialProduct ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isBusy}
            className="rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Удаление..." : "Удалить товар"}
          </button>
        ) : null}
      </div>
    </form>
  );
}