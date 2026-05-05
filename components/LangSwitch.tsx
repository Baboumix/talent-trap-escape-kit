import Link from "next/link";

/**
 * Language toggle FR / EN.
 *
 * Defaults route to home of each language. Pass `frHref` / `enHref` to deep-link
 * to the localized equivalent of the current page (so the user stays in context
 * when switching languages, e.g. /light/resultat ↔ /en/light/resultat).
 */
export function LangSwitch({
  current,
  frHref = "/",
  enHref = "/en",
}: {
  current: "fr" | "en";
  frHref?: string;
  enHref?: string;
}) {
  return (
    <nav
      className="absolute top-5 right-5 z-20 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-medium"
      aria-label="Langue"
    >
      <Link
        href={frHref}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          current === "fr"
            ? "text-ink bg-ink/[0.06] border border-ink/15"
            : "text-neutral-500 hover:text-ink border border-transparent"
        }`}
        aria-current={current === "fr" ? "page" : undefined}
      >
        FR
      </Link>
      <Link
        href={enHref}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          current === "en"
            ? "text-ink bg-ink/[0.06] border border-ink/15"
            : "text-neutral-500 hover:text-ink border border-transparent"
        }`}
        aria-current={current === "en" ? "page" : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
