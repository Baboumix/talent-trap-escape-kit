import Link from "next/link";

export function LangSwitch({ current }: { current: "fr" | "en" }) {
  return (
    <nav
      className="absolute top-5 right-5 z-20 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-medium"
      aria-label="Langue"
    >
      <Link
        href="/"
        className={`px-2.5 py-1 rounded-full transition-colors ${
          current === "fr"
            ? "text-white bg-white/10 border border-white/15"
            : "text-neutral-500 hover:text-white border border-transparent"
        }`}
        aria-current={current === "fr" ? "page" : undefined}
      >
        FR
      </Link>
      <Link
        href="/en"
        className={`px-2.5 py-1 rounded-full transition-colors ${
          current === "en"
            ? "text-white bg-white/10 border border-white/15"
            : "text-neutral-500 hover:text-white border border-transparent"
        }`}
        aria-current={current === "en" ? "page" : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
