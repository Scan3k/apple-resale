export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Оплата</h1>

        <p className="mt-4 text-lg text-gray-600">
          Здесь будет страница с условиями оплаты.
        </p>

        <div className="mt-8 space-y-3 text-gray-700">
          <p>Что позже должно появиться на этой странице:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>доступные способы оплаты</li>
            <li>условия оплаты</li>
            <li>варианты для Москвы и регионов</li>
            <li>ответы на частые вопросы</li>
          </ul>
        </div>
      </section>
    </main>
  );
}