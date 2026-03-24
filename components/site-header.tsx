import Link from "next/link";

const navigation = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог", featured: true },
  { href: "/trade-in", label: "Trade-in" },
  { href: "/delivery", label: "Доставка" },
  { href: "/payment", label: "Оплата" },
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit flex-col transition hover:opacity-90"
          >
            <span className="text-xl font-semibold tracking-tight text-slate-950">
              Apple Resale
            </span>
            <span className="text-sm text-slate-500">
              Продажа и выкуп техники Apple
            </span>
          </Link>

          <nav
            aria-label="Основная навигация"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.featured
                    ? "inline-flex items-center rounded-full bg-slate-950 px-4 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                    : "inline-flex items-center rounded-full px-3.5 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}