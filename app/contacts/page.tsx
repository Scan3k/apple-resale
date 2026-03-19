export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Контакты</h1>

        <p className="mt-4 text-lg text-gray-600">
          Здесь будет страница с контактами магазина.
        </p>

        <div className="mt-8 space-y-3 text-gray-700">
          <p>Что позже должно появиться на этой странице:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>телефон</li>
            <li>Telegram / WhatsApp</li>
            <li>адрес в Москве</li>
            <li>режим работы</li>
            <li>карта или описание локации</li>
          </ul>
        </div>
      </section>
    </main>
  );
}