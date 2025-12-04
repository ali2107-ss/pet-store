export default function LocationPage() {
    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Контакты</h1>
            <p className="mb-2">Здесь вы можете найти наш адрес, часы работы и способы связи.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Адрес</h2>
                    <p>г. Москва, ул. Примерная, 12</p>
                    <p className="mt-2">Телефон: +7 (495) 123-45-67</p>
                    <p>Email: info@petpalace.example</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Часы работы</h2>
                    <ul className="list-disc list-inside">
                        <li>Пн–Пт: 10:00 — 20:00</li>
                        <li>Сб–Вс: 10:00 — 18:00</li>
                    </ul>
                    <div className="mt-4 text-sm text-gray-500">(Здесь можно встроить карту или iframe)</div>
                </div>
            </div>
        </section>
    );
}