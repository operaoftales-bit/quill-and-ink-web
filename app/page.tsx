
import type { CSSProperties } from "react";
import Link from "next/link";
import CommunityStats from "./components/CommunityStats";

const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2253294731390128&integration_type=0&scope=bot+applications.commands";

const DISCORD_SUPPORT_URL = "https://discord.gg/3qbKqxBJDa";

const stars = [
  { left: "7%", top: "17%", delay: "0s" },
  { left: "16%", top: "72%", delay: "1.4s" },
  { left: "28%", top: "24%", delay: "2.2s" },
  { left: "73%", top: "19%", delay: "0.8s" },
  { left: "85%", top: "63%", delay: "1.8s" },
  { left: "92%", top: "30%", delay: "2.8s" },
  { left: "65%", top: "79%", delay: "1.1s" },
  { left: "43%", top: "12%", delay: "3.1s" },
  { left: "55%", top: "88%", delay: "2.5s" },
];

const cinematicStars = [
  { left: "92%", top: "3%", size: "2px", duration: "6.4s", delay: "0s", opacity: ".55" },
  { left: "78%", top: "8%", size: "1px", duration: "5.6s", delay: ".7s", opacity: ".65" },
  { left: "67%", top: "2%", size: "2px", duration: "7s", delay: "1.4s", opacity: ".5" },
  { left: "88%", top: "17%", size: "1px", duration: "5.3s", delay: "2s", opacity: ".7" },
  { left: "98%", top: "27%", size: "2px", duration: "6.8s", delay: ".4s", opacity: ".5" },
  { left: "73%", top: "25%", size: "1px", duration: "5.8s", delay: "1.8s", opacity: ".65" },
  { left: "83%", top: "36%", size: "2px", duration: "7.2s", delay: "2.7s", opacity: ".45" },
  { left: "58%", top: "9%", size: "1px", duration: "6.1s", delay: "2.5s", opacity: ".45" },
  { left: "96%", top: "48%", size: "1px", duration: "5.4s", delay: "1.1s", opacity: ".7" },
  { left: "69%", top: "46%", size: "2px", duration: "6.7s", delay: "1.5s", opacity: ".45" },
  { left: "84%", top: "61%", size: "1px", duration: "5.7s", delay: ".9s", opacity: ".6" },
  { left: "51%", top: "20%", size: "2px", duration: "7.1s", delay: "2.2s", opacity: ".5" },
  { left: "62%", top: "58%", size: "1px", duration: "5.9s", delay: "1.7s", opacity: ".65" },
  { left: "77%", top: "73%", size: "2px", duration: "6.5s", delay: "2.9s", opacity: ".45" },
  { left: "43%", top: "6%", size: "1px", duration: "6.3s", delay: "3.2s", opacity: ".5" },
];

const constellationPoints = [
  { left: "24%", top: "34%", duration: "4.8s", delay: "0.2s" },
  { left: "31%", top: "27%", duration: "5.7s", delay: "1.1s" },
  { left: "37%", top: "31%", duration: "4.4s", delay: "2.3s" },
  { left: "68%", top: "28%", duration: "5.3s", delay: "0.7s" },
  { left: "74%", top: "34%", duration: "4.7s", delay: "1.8s" },
  { left: "79%", top: "29%", duration: "6.2s", delay: "2.5s" },
  { left: "18%", top: "53%", duration: "5.5s", delay: "1.5s" },
  { left: "82%", top: "54%", duration: "4.9s", delay: "0.9s" },
  { left: "28%", top: "68%", duration: "6.1s", delay: "2.2s" },
  { left: "72%", top: "66%", duration: "5.2s", delay: "1.2s" },
];

const featureCards = [
  {
    number: "01",
    eyebrow: "COMMUNITY",
    title: "Make yourself at home.",
    description:
      "Give members ways to take part, get involved, and feel like they belong.",
    accent: "from-[#68d9eb]/20 via-[#68d9eb]/5 to-transparent",
    glow: "bg-[#68d9eb]/15",
    line: "from-[#68d9eb]/70",
  },
  {
    number: "02",
    eyebrow: "ECONOMY",
    title: "Give every Nickel a purpose.",
    description:
      "Let members earn, save, and spend their way through a shared server economy.",
    accent: "from-[#d0b16b]/20 via-[#d0b16b]/5 to-transparent",
    glow: "bg-[#d0b16b]/15",
    line: "from-[#d0b16b]/70",
  },
  {
    number: "03",
    eyebrow: "GAMES",
    title: "Make room for play.",
    description:
      "Bring games and friendly competition into the conversations your members already enjoy.",
    accent: "from-[#9d9cf4]/20 via-[#9d9cf4]/5 to-transparent",
    glow: "bg-[#9d9cf4]/15",
    line: "from-[#aaa8ff]/70",
  },
  {
    number: "04",
    eyebrow: "MODERATION",
    title: "Keep things running smoothly.",
    description:
      "Manage your server with tools that help keep your community welcoming and under control.",
    accent: "from-[#77c8b3]/20 via-[#77c8b3]/5 to-transparent",
    glow: "bg-[#77c8b3]/15",
    line: "from-[#77c8b3]/70",
  },
];

const sectionLabelStyle =
  "text-[10px] font-medium uppercase tracking-[0.3em] text-[#79d9e9] sm:text-[11px]";

const sectionHeadingStyle =
  "font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-[#f3f4f0] sm:text-4xl lg:text-5xl";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-[#f5f7f8] selection:bg-[#65d9ee]/25 selection:text-white">
      {/* Cinematic hero — preserved */}
      <section
        aria-labelledby="home-heading"
        className="hero-cinematic relative flex min-h-[min(900px,100svh)] items-center justify-center overflow-hidden px-5 py-24 sm:px-6 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          {stars.map((star, index) => (
            <span
              key={`static-star-${index}`}
              className="hero-static-star"
              style={
                {
                  left: star.left,
                  top: star.top,
                  "--static-star-size": index % 2 === 0 ? "2px" : "1px",
                  "--static-star-duration": index % 2 === 0 ? "3.8s" : "4.8s",
                  "--static-star-delay": star.delay,
                  "--static-star-opacity": index % 3 === 0 ? ".72" : ".52",
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Cinematic painting stage */}
        <div className="hero-cinematic__stage" aria-hidden="true">
          {cinematicStars.map((star, index) => (
            <span
              key={`cinematic-star-${index}`}
              className="hero-background-star"
              style={
                {
                  left: star.left,
                  top: star.top,
                  "--star-size": star.size,
                  "--star-duration": star.duration,
                  "--star-delay": star.delay,
                  "--star-opacity": star.opacity,
                } as CSSProperties
              }
            />
          ))}

          <div className="hero-night-paint" />
          <div className="hero-cosmic-arc" />

          {constellationPoints.map((point, index) => (
            <span
              key={`constellation-${index}`}
              className="hero-constellation"
              style={
                {
                  left: point.left,
                  top: point.top,
                  "--constellation-duration": point.duration,
                  "--constellation-delay": point.delay,
                } as CSSProperties
              }
            />
          ))}

          <div className="hero-light-well" />
          <div className="hero-writing-thread" />
          <div className="hero-orbit hero-orbit--gold" />
          <div className="hero-orbit hero-orbit--cyan" />
          <div className="hero-orbit hero-orbit--broken" />
          <div className="hero-golden-dust" />

          <img
            src="/images/quill-icon.png"
            alt=""
            aria-hidden="true"
            className="hero-cinematic__logo"
          />
        </div>

        {/* Background monogram */}
        <div aria-hidden="true" className="hero-background-monogram">
          <span>Q&amp;I</span>
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div className="hero-cinematic__division hero-cinematic__division--hero">
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#78d9eb] sm:text-xs sm:tracking-[0.42em]">
              <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-[#6fd8ec]/60 sm:block" />
              <span>Made for your corner of Discord</span>
              <span className="hidden h-px w-8 bg-gradient-to-l from-transparent to-[#6fd8ec]/60 sm:block" />
            </div>

            <h1
              id="home-heading"
              className="mt-4 bg-gradient-to-r from-[#f8fbfc] via-[#c4edf3] to-[#d6b66f] bg-clip-text font-serif text-5xl font-medium tracking-[-0.045em] text-transparent drop-shadow-[0_0_35px_rgba(84,204,226,0.08)] sm:mt-5 sm:text-7xl lg:text-8xl"
            >
              Quill <span className="font-normal italic">&amp;</span> Ink
            </h1>

            <div
              aria-hidden="true"
              className="mx-auto mt-5 flex items-center justify-center gap-3 sm:mt-6"
            >
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#67d8eb]/60 sm:w-16" />
              <span className="text-sm text-[#f2fbfd]/80 sm:text-base">
                ✦
              </span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d0b16b]/60 sm:w-16" />
            </div>

            <p className="mx-auto mt-4 max-w-2xl px-2 font-serif text-base italic leading-7 text-[#d1e1e8] sm:mt-5 sm:text-2xl sm:leading-9">
              Built for communities. Made for stories.
            </p>

            <p className="mx-auto mt-4 max-w-xl px-3 text-sm leading-7 text-[#a7bdca] sm:mt-5 sm:px-2 sm:text-base sm:leading-8">
              Give your Discord server more to do, from moderation and useful
              tools to games and a shared economy. Start with what you need
              and make it your own.
            </p>
          </div>

          <div className="hero-cinematic__division hero-cinematic__division--actions mt-8 w-full sm:mt-10">
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href={DISCORD_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 overflow-hidden rounded-full border border-[#9aeaf3]/70 bg-gradient-to-r from-[#62cfe1] via-[#6ad7e8] to-[#86e2eb] px-7 py-3.5 text-sm font-semibold text-[#061525] shadow-[0_8px_35px_rgba(76,191,216,0.14)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d0f8fc] hover:from-[#83e0eb] hover:via-[#91e5ed] hover:to-[#b0edf0] hover:shadow-[0_12px_45px_rgba(76,191,216,0.23)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9aeaf3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061525] sm:w-auto sm:min-w-[220px]"
              >
                <span className="relative z-10">Add to Discord</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[-45%] w-1/3 rotate-12 bg-white/35 blur-md transition-all duration-700 group-hover:left-[125%]"
                />
              </a>

              <Link
                href="/explore"
                className="group inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-[#64869b]/45 bg-[#0a1b2e]/60 px-7 py-3.5 text-sm font-medium text-[#e3f0f4] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#d0b16b]/65 hover:bg-[#102b43]/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0b16b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061525] sm:w-auto sm:min-w-[190px]"
              >
                Explore features
                <span
                  aria-hidden="true"
                  className="text-[#d0b16b] transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="hero-cinematic__whisper mt-7 text-[9px] uppercase tracking-[0.24em] text-[#8199a9] sm:mt-9 sm:text-[10px] sm:tracking-[0.35em]">
            <span className="text-[#8fe3ef]">✦</span>
            <span className="mx-2">Your community. Your story.</span>
            <span className="text-[#d0b16b]">✦</span>
          </div>
        </div>

        <a
          href="#discover"
          aria-label="Scroll to discover Quill and Ink"
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#7895a7] transition-colors hover:text-[#c3eaf0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79d9e9] sm:bottom-7"
        >
          <span>Discover</span>
          <span
            aria-hidden="true"
            className="h-7 w-px bg-gradient-to-b from-[#79d9e9]/70 to-transparent"
          />
        </a>
      </section>
{/* Community statistics */}
<CommunityStats />
      {/* Features */}
      <section
        id="discover"
        aria-labelledby="discover-heading"
        className="relative scroll-mt-10 px-5 py-14 sm:px-8 sm:py-16 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(84%,900px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6bcddd]/30 to-transparent"
        />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className={sectionLabelStyle}>A little of everything</p>
            <h2 id="discover-heading" className={`${sectionHeadingStyle} mt-3`}>
              The tools you need.
              <br />
              <span className="bg-gradient-to-r from-[#8be0ec] via-[#c5eaf0] to-[#d4b879] bg-clip-text text-transparent">
                The fun you didn&apos;t know you needed.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#9eb5c4] sm:text-base sm:leading-7">
              Every server is different. Pick the features that suit yours,
              whether you&apos;re keeping things organised, building an
              economy, or giving members something fun to do.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <article
                key={feature.number}
                className="group relative isolate flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-[#45647b]/30 bg-[#091a2a]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#73cedd]/45 hover:bg-[#0c2032]/95 sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${feature.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full ${feature.glow} opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-90`}
                />

                <div
                  aria-hidden="true"
                  className={`absolute left-6 right-6 top-0 h-px bg-gradient-to-r ${feature.line} via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.22em] text-[#9aafbd]">
                    {feature.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#8bdce9]/70 shadow-[0_0_12px_rgba(139,220,233,0.4)] transition-transform duration-300 group-hover:scale-150"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#78d4e4]">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-2 font-serif text-xl leading-snug text-[#edf4f5] sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#a5b8c4]">
                    {feature.description}
                  </p>
                </div>

                <div aria-hidden="true" className="mt-auto pt-4">
                  <div className="h-px w-full bg-gradient-to-r from-[#71d4e4]/35 via-[#d0b16b]/15 to-transparent transition-colors duration-300 group-hover:from-[#71d4e4]/65" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex justify-center sm:mt-8">
            <Link
              href="/explore"
              className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#64869b]/35 px-6 py-3 text-sm text-[#d8e7ec] transition duration-300 hover:border-[#d0b16b]/60 hover:bg-[#0b1e30]/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79d9e9]"
            >
              Browse all plugins
              <span
                aria-hidden="true"
                className="text-[#d0b16b] transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Basic and Premium */}
      <section
        aria-labelledby="plans-heading"
        className="relative border-y border-[#45647b]/20 bg-[#081827]/65 px-5 py-14 sm:px-8 sm:py-16 lg:py-20"
      >
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className={sectionLabelStyle}>
              Start free. Go further when ready.
            </p>
            <h2 id="plans-heading" className={`${sectionHeadingStyle} mt-3`}>
              Find what fits your server.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#9eb5c4] sm:text-base sm:leading-7">
              Explore the Basic features first. If you want more, you can
              check out what Premium adds before making a decision.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-10">
            <article className="group relative isolate overflow-hidden rounded-2xl border border-[#55778a]/30 bg-[#0a1b2b]/80 p-5 transition duration-300 hover:border-[#70cddd]/40 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 -z-10 h-44 w-44 rounded-full bg-[#66d5e7]/[0.08] blur-3xl transition-opacity duration-300 group-hover:bg-[#66d5e7]/[0.13]"
              />

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#83dbe9]">
                A good place to start
              </p>
              <h3 className="mt-3 font-serif text-3xl text-[#f0f5f5]">
                Basic
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#a5b8c4]">
                Get started with the available Basic plugins and choose the
                tools your server actually needs.
              </p>

              <Link
                href="/explore"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#a8e7ef] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79d9e9]"
              >
                Explore plugins
                <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="group relative isolate overflow-hidden rounded-2xl border border-[#d0b16b]/35 bg-gradient-to-br from-[#19283a]/95 via-[#0c1e2e]/95 to-[#111b29]/95 p-5 transition duration-300 hover:border-[#d0b16b]/60 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-10 -z-10 h-52 w-52 rounded-full bg-[#d0b16b]/[0.09] blur-3xl transition-opacity duration-300 group-hover:bg-[#d0b16b]/[0.14]"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#ddc487]">
                  For those who want more
                </p>
                <span className="rounded-full border border-[#d0b16b]/30 bg-[#d0b16b]/[0.08] px-3 py-1 text-[9px] uppercase tracking-[0.15em] text-[#e4cd96]">
                  Premium
                </span>
              </div>

              <h3 className="mt-3 font-serif text-3xl text-[#f5f0e4]">
                Take it further.
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#b1bec8]">
                See which extra plugins come with Premium, what they offer,
                and whether they&apos;re right for your community.
              </p>

              <Link
                href="/pricing"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#e3cc92] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0b16b]"
              >
                View Premium and pricing
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Closing invitation */}
      <section className="relative px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#6f91a2]/25 bg-gradient-to-br from-[#10273a]/90 via-[#091a2a]/95 to-[#101b2a]/95 px-5 py-8 text-center shadow-[0_25px_100px_rgba(0,0,0,0.15)] sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d0b16b]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a9bb7]/[0.07] blur-3xl"
          />

          <div className="relative">
            <p className={sectionLabelStyle}>
              Give your server a little more
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-[#f3f4f0] sm:text-5xl">
              Let&apos;s make your server feel like yours.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#a8bdca] sm:text-base sm:leading-7">
              Add Quill &amp; Ink, try out the features, and see what works
              for your community. You can start small.
            </p>

            <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href={DISCORD_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-[#d0b16b] px-7 py-3.5 text-sm font-semibold text-[#101a22] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e3cc91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3cc91] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1d2c] sm:w-auto"
              >
                Add Quill &amp; Ink
                <span aria-hidden="true">↗</span>
              </a>

              <Link
                href="/explore"
                className="inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-full border border-[#7391a2]/40 px-7 py-3.5 text-sm font-medium text-[#e0ebef] transition duration-300 hover:border-[#8bdce9]/55 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79d9e9] sm:w-auto"
              >
                Browse features
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#819bab]">
              <Link
                href="/about"
                className="transition-colors hover:text-white"
              >
                About Quill &amp; Ink
              </Link>
              <span aria-hidden="true" className="text-[#d0b16b]/50">
                ·
              </span>
              <Link
                href="/pricing"
                className="transition-colors hover:text-white"
              >
                Free and Premium
              </Link>
              <span aria-hidden="true" className="text-[#d0b16b]/50">
                ·
              </span>
              <a
                href={DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Get support
              </a>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
