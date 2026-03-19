import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || !product.isVisible) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-sm text-gray-500">{product.category}</div>

        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>

        <p className="mt-4 text-lg text-gray-600">{product.description}</p>

        <div className="mt-6 text-3xl font-bold">
          {product.price.toLocaleString("ru-RU")} ₽
        </div>

        <div className="mt-8 space-y-2 text-gray-700">
          {product.model && <div>Модель: {product.model}</div>}
          {product.storage && <div>Память: {product.storage}</div>}
          {product.color && <div>Цвет: {product.color}</div>}
          {product.condition && <div>Состояние: {product.condition}</div>}
          {product.status && <div>Статус: {product.status}</div>}
        </div>
      </section>
    </main>
  );
}