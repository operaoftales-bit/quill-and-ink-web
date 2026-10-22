
"use client";

import OperaLogoAnimation from "./components/OperaLogoAnimation";

export default function AssistantPage() {
  return (
    <main className="relative flex min-h-[220vh] w-full flex-1 flex-col items-center px-6 py-12">
      <div className="pointer-events-none relative z-10 mb-10 max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-200/65">
          Quill &amp; Ink
        </p>

        <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
          Meet Opera
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          Your little guide beneath the stars. Click Opera whenever
          you need a hand with Quill &amp; Ink.
        </p>

        <p className="mt-6 text-xs text-slate-500">
          Opera is your companion throughout the website. Scroll around
          and she'll stay by your side.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <OperaLogoAnimation />
      </div>
    </main>
  );
}
