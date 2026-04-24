import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-8 overflow-hidden text-center">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-coral/[0.08] blur-[120px]" />
      </div>

      <p className="inline-flex items-center gap-2 px-3 py-1 mb-10 text-[10px] uppercase tracking-[0.18em] text-coral border border-coral/30 rounded-full bg-coral/[0.04]">
        <span className="w-1 h-1 rounded-full bg-coral" />
        404
      </p>
      <h1 className="font-display font-medium text-[40px] sm:text-5xl leading-[1.05] tracking-tight mb-4 max-w-md">
        Rien à cet endroit.
      </h1>
      <p className="text-neutral-400 text-base mb-10 max-w-sm">
        La page que tu cherches n'existe pas — ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-coral-500 to-coral-400 shadow-xl shadow-coral/20 active:scale-[0.99] transition-transform"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
