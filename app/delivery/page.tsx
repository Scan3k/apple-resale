export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Доставка</h1>

        <p className="mt-4 text-lg text-gray-600">
          Здесь будет страница с условиями доставки по Москве и по всей России.
        </p>

        <div className="mt-8 space-y-3 text-gray-700">
          <p>Что позже должно появиться на этой странице:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>доставка по Москве</li>
            <li>доставка по России</li>
            <li>сроки и условия</li>
            <li>стоимость доставки</li>
            <li>ответы на частые вопросы</li>
          </ul>
        </div>
      </section>
    </main>
  );
}