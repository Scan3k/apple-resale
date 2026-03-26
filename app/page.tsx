import Link from "next/link";
import { getVisibleProducts } from "@/lib/products";

const conditionLabels: Record<string, string> = {
  excellent: "Отличное",
  good: "Хорошее",
  fair: "Хорошее",
  new: "Как новое",
};

const categoryLabels: Record<string, string> = {
  iphone: "iPhone",
  macbook: "MacBook",
  ipad: "iPad",
  "apple-watch": "Apple Watch",
  airpods: "AirPods",
  imac: "iMac",
};

export default function Home() {
  const products = getVisibleProducts();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-6 sm:pt-10 lg:px-8 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              Продажа и выкуп техники Apple
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Проверенные б/у устройства Apple без лишнего риска и хаоса
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Помогаем купить и выгодно продать б/у технику Apple по всей России
              с основным фокусом на Москву. Понятный каталог, прозрачное
              состояние устройств и удобный trade-in.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Перейти в каталог
              </Link>

              <Link
                href="/trade-in"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Оценить trade-in
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-slate-900">
                  Проверенные устройства
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Понятное описание состояния и ключевых характеристик.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-slate-900">
                  Быстрый выбор
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Удобный каталог без перегруза и лишней путаницы.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-slate-900">
                  Trade-in и выкуп
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Можно сразу перейти от старого устройства к новому.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
              Почему это удобно
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Один сайт для покупки, продажи и быстрого апгрейда Apple
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-900">
                  Покупка
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Выбираешь устройство из каталога с понятной подачей и
                  характеристиками.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-900">Продажа</div>
                <p className="mt-1 text-sm text-slate-600">
                  Можно быстро перейти в trade-in или оформить выкуп старого
                  устройства.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-medium text-slate-900">
                  Доверие
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Отдельные страницы по доставке, оплате и контактам снижают
                  сомнения перед покупкой.
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

              <Link
                href="/contacts"
                className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8 lg:pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
              Актуальные предложения
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Популярные устройства из каталога
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Несколько актуальных позиций, чтобы быстро понять ассортимент и
              перейти к выбору.
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            Смотреть весь каталог
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {products.map((product) => {
              const conditionLabel = product.condition
                ? conditionLabels[product.condition] ?? product.condition
                : null;

              const categoryLabel = product.category
                ? categoryLabels[product.category] ?? product.category
                : "Apple";

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
                    <div className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {categoryLabel}
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {product.description}
                    </p>

                    <div className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </div>

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

                    <div className="mt-6 pt-2">
                      <Link
                        href={`/catalog/${product.slug}`}
                        className="inline-flex items-center text-sm font-medium text-slate-900 transition group-hover:text-slate-700"
                      >
                        Перейти к выбору в каталоге
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-950">
              Каталог скоро будет наполнен
            </h3>
            <p className="mt-3 text-slate-600">
              Пока товары не добавлены, но можно перейти в раздел trade-in или
              связаться с нами.
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
