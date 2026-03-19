import Link from "next/link";
import { getVisibleProducts } from "@/lib/products";

export default function CatalogPage() {
  const products = getVisibleProducts();

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold">Каталог</h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Все доступные товары б/у Apple, которые сейчас видны на сайте.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="text-sm text-gray-500">{product.category}</div>

              <h2 className="mt-2 text-2xl font-semibold">{product.name}</h2>

              <p className="mt-3 text-gray-600">{product.description}</p>

              <div className="mt-4 text-xl font-bold">
                {product.price.toLocaleString("ru-RU")} ₽
              </div>

              <div className="mt-6">
                <Link
                  href={`/catalog/${product.slug}`}
                  className="inline-flex rounded-xl bg-black px-5 py-3 text-white"
                >
                  Открыть товар
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}