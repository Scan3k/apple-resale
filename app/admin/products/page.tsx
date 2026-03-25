import Link from "next/link";

import { getAdminProducts } from "@/lib/admin/products-storage";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

export default async function AdminProductsPage() {
  try {
    const products = await getAdminProducts();

    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Admin / Товары</p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
              Управление товарами
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Здесь вы будете видеть все товары и переходить к созданию или
              редактированию карточек.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Создать товар
          </Link>
        </div>

        {products.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8">
            <h2 className="text-xl font-medium text-neutral-900">
              Товаров пока нет
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Создайте первый товар, чтобы начать наполнение каталога.
            </p>

            <div className="mt-6">
              <Link
                href="/admin/products/new"
                className="inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Перейти к созданию
              </Link>
            </div>
          </section>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-neutral-50">
                  <tr className="text-sm text-neutral-600">
                    <th className="px-4 py-3 font-medium">Товар</th>
                    <th className="px-4 py-3 font-medium">Цена</th>
                    <th className="px-4 py-3 font-medium">Видимость</th>
                    <th className="px-4 py-3 font-medium">Главное фото</th>
                    <th className="px-4 py-3 font-medium">Галерея</th>
                    <th className="px-4 py-3 font-medium">Характеристики</th>
                    <th className="px-4 py-3 font-medium">Описание</th>
                    <th className="px-4 py-3 font-medium">Действие</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const hasMainImage = Boolean(product.mainImage);
                    const galleryCount = product.galleryImages.length;
                    const specsCount = product.specifications.length;
                    const hasDescription = Boolean(product.description.trim());

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-neutral-200 text-sm text-neutral-800"
                      >
                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-neutral-900">
                            {product.name}
                          </div>
                          <div className="mt-1 text-xs text-neutral-500">
                            ID: {product.id}
                          </div>
                          <div className="mt-1 text-xs text-neutral-500">
                            {product.category}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          {formatPrice(product.price)} ₽
                        </td>

                        <td className="px-4 py-4 align-top">
                          {product.isVisible ? "Показан" : "Скрыт"}
                        </td>

                        <td className="px-4 py-4 align-top">
                          {hasMainImage ? "Есть" : "Нет"}
                        </td>

                        <td className="px-4 py-4 align-top">
                          {galleryCount}
                        </td>

                        <td className="px-4 py-4 align-top">
                          {specsCount}
                        </td>

                        <td className="px-4 py-4 align-top">
                          {hasDescription ? "Есть" : "Нет"}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Редактировать
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("[admin/products/page] failed to load products", error);

    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">Ошибка загрузки</p>
          <h1 className="mt-2 text-2xl font-semibold text-red-900">
            Не удалось открыть список товаров
          </h1>
          <p className="mt-2 text-sm text-red-700">
            Проверьте терминал разработки: там должна быть причина ошибки.
          </p>
        </section>
      </main>
    );
  }
}