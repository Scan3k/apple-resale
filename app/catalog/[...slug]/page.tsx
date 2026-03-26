import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

import ProductImageGallery from "@/components/product-image-gallery";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const categoryLabels: Record<string, string> = {
  iphone: "iPhone",
  macbook: "MacBook",
  ipad: "iPad",
  "apple-watch": "Apple Watch",
  airpods: "AirPods",
  imac: "iMac",
};

const conditionLabels: Record<string, string> = {
  excellent: "Отличное",
  good: "Хорошее",
  fair: "Хорошее",
  new: "Как новое",
};

const statusLabels: Record<string, string> = {
  available: "В наличии",
  reserved: "Зарезервирован",
  sold: "Продан",
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const decodedSlug = slug.map((segment) => decodeURIComponent(segment)).join("/");
  const product = getProductBySlug(decodedSlug) ?? getProductBySlug(slugPath);

  if (!product || !product.isVisible) {
    notFound();
  }

  const categoryLabel = categoryLabels[product.category] ?? product.category;

  const conditionLabel = product.condition
    ? conditionLabels[product.condition] ?? product.condition
    : null;

  const statusLabel = product.status
    ? statusLabels[product.status] ?? product.status
    : null;

  const galleryImages = [product.mainImage, ...product.galleryImages].filter(
    (image, index, images) => Boolean(image) && images.indexOf(image) === index
  );

  const fallbackSpecs = [
    product.model ? { label: "Модель", value: product.model } : null,
    product.storage ? { label: "Память", value: product.storage } : null,
    product.color ? { label: "Цвет", value: product.color } : null,
    conditionLabel ? { label: "Состояние", value: conditionLabel } : null,
    statusLabel ? { label: "Статус", value: statusLabel } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const specifications =
    product.specifications.length > 0 ? product.specifications : fallbackSpecs;

  const descriptionParagraphs = product.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-6 sm:pt-10 lg:px-8">
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Назад в каталог
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {categoryLabel}
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <ProductImageGallery
                images={galleryImages}
                productName={product.name}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.storage && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  Память: {product.storage}
                </span>
              )}

              {product.color && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  Цвет: {product.color}
                </span>
              )}

              {conditionLabel && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  Состояние: {conditionLabel}
                </span>
              )}

              {statusLabel && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  {statusLabel}
                </span>
              )}
            </div>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                Что важно по устройству
              </div>

              {specifications.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {specifications.map((spec, index) => (
                    <div
                      key={`${spec.label}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="text-sm text-slate-500">{spec.label}</div>
                      <div className="mt-1 text-base font-medium text-slate-950">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Основные характеристики будут уточняться в описании и при
                  консультации.
                </p>
              )}
            </div>

            <div className="mt-10 max-w-3xl space-y-4 text-base leading-8 text-slate-600 sm:text-lg">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, index) => (
                  <p key={`${product.id}-paragraph-${index}`}>{paragraph}</p>
                ))
              ) : (
                <p>
                  Подробное описание пока не заполнено. Основную информацию по
                  устройству можно посмотреть выше или уточнить перед покупкой.
                </p>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-950">
                  Понятная подача
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Карточка показывает ключевые параметры без лишней перегрузки.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-950">
                  Trade-in и выкуп
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Можно перейти к обмену текущего устройства на новое.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-950">
                  Поддержка до покупки
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Страницы оплаты, доставки и контактов помогают быстрее принять
                  решение.
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                Цена устройства
              </div>

              <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {product.price.toLocaleString("ru-RU")} ₽
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Подробности по способам покупки, доставке и оплате можно быстро
                уточнить на соответствующих публичных страницах.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Связаться по товару
                </Link>

                <Link
                  href="/trade-in"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Рассчитать trade-in
                </Link>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-950">
                    Доставка
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Подробные условия доставки вынесены в отдельный публичный
                    раздел.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-950">
                    Оплата
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Способы оплаты и сценарий покупки можно заранее посмотреть
                    на сайте.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-950">
                    Контакты
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Если нужен быстрый ответ по устройству, можно сразу перейти
                    в раздел контактов.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/delivery"
                  className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Доставка
                </Link>
                <Link
                  href="/payment"
                  className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Оплата
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
