import Link from "next/link";
import { getVisibleProducts } from "@/lib/products";

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

export default function CatalogPage() {
  const products = getVisibleProducts();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-6 sm:pt-10 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
            Каталог Apple
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Выбирай устройство из актуального ассортимента
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Здесь собраны все доступные б/у устройства Apple, которые сейчас
            видны на сайте. Можно быстро оценить ассортимент, посмотреть
            характеристики и перейти в карточку конкретного товара.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              Товаров в каталоге: {products.length}
            </div>

            <Link
              href="/trade-in"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Перейти в trade-in
            </Link>

            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const categoryLabel = product.category
                ? categoryLabels[product.category] ?? product.category
                : "Apple";

              const conditionLabel = product.condition
                ? conditionLabels[product.condition] ?? product.condition
                : null;

              return (
                <article
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-[4/3] border-b border-slate-200 bg-slate-50">
                    {product.mainImage ? (
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                        Фото товара пока не добавлено
                      </div>
                    )}
                  </div>

                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        {categoryLabel}
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-semibold tracking-tight text-slate-950">
                          {product.price.toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                    </div>

                    <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                      <Link
                        href={`/catalog/${product.slug}`}
                        className="transition group-hover:text-slate-700"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {product.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
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
                    </div>

                    <div className="mt-auto pt-8">
                      <Link
                        href={`/catalog/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                      >
                        Открыть товар
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
              Сейчас каталог временно пуст
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Товары еще не добавлены или пока не опубликованы. Можно перейти в
              trade-in, чтобы оценить свое устройство, или связаться с нами.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/trade-in"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Перейти в trade-in
              </Link>

              <Link
                href="/contacts"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Открыть контакты
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
