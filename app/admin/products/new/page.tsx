import ProductForm from "@/components/admin/product-form";

export default function AdminNewProductPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <ProductForm mode="create" />
    </main>
  );
}