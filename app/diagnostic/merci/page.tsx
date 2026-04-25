import Link from "next/link";

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCxQtPK0hRbXC8Rvb_j4OgeA";
const APPLE_PODCAST_URL =
  "https://podcasts.apple.com/fr/podcast/mon-expansion/id1689127397";
const SPOTIFY_URL = "https://open.spotify.com/show/0i55bBSIvvOiwcJiz9PBKC";
const INSTAGRAM_URL = "https://instagram.com/monexpansion";
const TIKTOK_URL = "https://tiktok.com/@monexpansion.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/julienklein/";

export default function MerciPage() {
  return (
    <main className="relative min-h-[100svh] flex flex-col px-6 py-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.12] blur-[120px]" />
      </div>

      <header className="flex justify-center pt-2 mb-10">
        <p className="inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
          <span className="w-1 h-1 rounded-full bg-coral" />
          Envoyé
        </p>
      </header>

      <section className="max-w-md mx-auto w-full text-center mb-10 animate-fade-up">
        <h1 className="font-display font-medium text-[34px] sm:text-4xl md:text-5xl leading-[1.05] tracking-tight mb-4">
          Ton diagnostic est en route.
        </h1>
        <p className="text-neutral-300 text-base leading-relaxed">
          Vérifie ton inbox dans quelques secondes.
        </p>
        <p className="text-neutral-500 text-sm leading-relaxed mt-1">
          (Le dossier spam aussi, on sait jamais.)
        </p>
      </section>

      <section
        className="max-w-md mx-auto w-full mb-10 animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-coral mb-3 text-center">
          En attendant ton email
        </p>
        <p className="text-center text-neutral-400 text-sm mb-6">
          3 choses pour rester dans le sujet et continuer à creuser.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-coral/30 bg-coral/[0.05] hover:border-coral/60 hover:bg-coral/[0.10] active:scale-[0.995] transition-all"
          >
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-coral mb-1">
                1 · Le plus utile
              </span>
              <span className="block font-medium text-base md:text-lg leading-tight">
                Abonne-toi sur YouTube
              </span>
              <span className="block text-xs text-neutral-400 mt-0.5">
                Une vidéo par semaine sur les pièges du talent senior.
              </span>
            </span>
            <svg
              className="shrink-0 w-4 h-4 text-coral group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <div className="px-5 py-4 rounded-2xl border border-white/12 bg-white/[0.02]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-2">
              2 · Pour tes trajets
            </p>
            <p className="font-medium text-base mb-3">
              Écoute le podcast monExpansion
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={APPLE_PODCAST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-coral/60 hover:text-coral transition-colors"
              >
                Apple Podcasts
              </a>
              <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-coral/60 hover:text-coral transition-colors"
              >
                Spotify
              </a>
            </div>
          </div>

          <div className="px-5 py-4 rounded-2xl border border-white/12 bg-white/[0.02]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-2">
              3 · Pour rester proche
            </p>
            <p className="font-medium text-base mb-3">
              Suis monExpansion sur tes réseaux
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-coral/60 hover:text-coral transition-colors"
              >
                Instagram
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-coral/60 hover:text-coral transition-colors"
              >
                TikTok
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-coral/60 hover:text-coral transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="max-w-md mx-auto w-full text-center mb-10 animate-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-coral/30 bg-coral/[0.05]">
          <span className="font-display font-semibold text-coral text-2xl leading-none">
            10%
          </span>
          <p className="text-xs text-neutral-300 text-left leading-snug max-w-[240px]">
            Seuls les meilleurs professionnels prennent le temps de se
            réajuster en route. Tu en fais partie.
          </p>
        </div>
      </section>

      <footer className="max-w-md mx-auto w-full text-center mt-auto">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </footer>
    </main>
  );
}
