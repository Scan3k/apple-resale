import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/product-form";
import { getAdminProductById } from "@/lib/admin/products-storage";

type AdminEditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <ProductForm mode="edit" initialProduct={product} />
    </main>
  );
}
