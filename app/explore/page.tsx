import Link from "next/link";
import { categories, plugins, type Plugin } from "@/app/data/plugins";

const stars = [
  { left: "7%", top: "12%", size: "2px", delay: "0s", duration: "7s" },
  { left: "14%", top: "42%", size: "1px", delay: "2s", duration: "9s" },
  { left: "21%", top: "22%", size: "2px", delay: "4s", duration: "8s" },
  { left: "29%", top: "67%", size: "1px", delay: "1s", duration: "10s" },
  { left: "37%", top: "14%", size: "1px", delay: "5s", duration: "8s" },
  { left: "44%", top: "34%", size: "2px", delay: "3s", duration: "11s" },
  { left: "52%", top: "18%", size: "1px", delay: "0s", duration: "9s" },
  { left: "59%", top: "61%", size: "2px", delay: "6s", duration: "10s" },
  { left: "67%", top: "28%", size: "1px", delay: "2s", duration: "8s" },
  { left: "73%", top: "72%", size: "2px", delay: "4s", duration: "12s" },
  { left: "81%", top: "17%", size: "1px", delay: "1s", duration: "9s" },
  { left: "88%", top: "45%", size: "2px", delay: "5s", duration: "11s" },
  { left: "94%", top: "24%", size: "1px", delay: "3s", duration: "8s" },
  { left: "10%", top: "79%", size: "1px", delay: "6s", duration: "10s" },
  { left: "25%", top: "89%", size: "2px", delay: "2s", duration: "9s" },
  { left: "48%", top: "83%", size: "1px", delay: "4s", duration: "12s" },
  { left: "63%", top: "91%", size: "1px", delay: "1s", duration: "10s" },
  { left: "84%", top: "84%", size: "2px", delay: "5s", duration: "11s" },
];

const constellationPoints = [
  { left: "11%", top: "25%" },
  { left: "16%", top: "20%" },
  { left: "22%", top: "24%" },
  { left: "27%", top: "18%" },
  { left: "32%", top: "22%" },
  { left: "79%", top: "26%" },
  { left: "84%", top: "31%" },
  { left: "89%", top: "27%" },
];

function PluginCard({ plugin }: { plugin: Plugin }) {
  const isPremium = plugin.tier === "Premium";
  const isUnavailable = plugin.status === "unavailable";

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-500 sm:p-8 ${
        isUnavailable
          ? "border-[#6d89a3]/12 bg-[#071827]/55"
          : "border-[#6d89a3]/15 bg-[#071827]/70 hover:-translate-y-1 hover:border-[#d0b16b]/45 hover:bg-[#0b1b29]/80 hover:shadow-[0_24px_90px_rgba(208,177,107,0.10)]"
      }`}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#d0b16b]/[0.025] blur-3xl transition duration-700 group-hover:bg-[#d0b16b]/[0.12]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d0b16b]/70 to-transparent transition-all duration-700 group-hover:w-[85%]" />

      <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d0b16b]/0 to-transparent transition-all duration-700 group-hover:via-[#d0b16b]/35" />

      <div className="absolute right-6 top-6 flex flex-wrap justify-end gap-2">
        {plugin.tag && (
          <span
            className={
              plugin.tag === "AI Assistant"
                ? "rounded-full border border-[#73d9eb]/30 bg-[#73d9eb]/[0.08] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#73d9eb]"
                : "rounded-full border border-[#73d9eb]/20 bg-[#73d9eb]/[0.045] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#73d9eb]"
            }
          >
            {plugin.tag}
          </span>
        )}

        {isPremium && (
          <span className="rounded-full border border-[#d0b16b]/35 bg-[#d0b16b]/[0.08] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#d0b16b]">
            Premium
          </span>
        )}

        {isUnavailable && (
          <span className="rounded-full border border-[#6d89a3]/20 bg-[#6d89a3]/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8198aa]">
            Currently unavailable
          </span>
        )}
      </div>

      <div className="relative pr-32">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#617b90]">
          {plugin.category}
        </p>

        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#f1f7ff] transition duration-500 group-hover:text-[#d0b16b]">
          {plugin.name}
        </h3>
      </div>

      {plugin.description && (
        <p className="relative mt-5 max-w-xl leading-7 text-[#91aabd]">
          {plugin.description}
        </p>
      )}

      {isUnavailable ? (
        <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6f8495]">
          Preparing the experience
        </span>
      ) : (
        <Link
          href={`/explore/${plugin.id}`}
          className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#73d9eb] transition-all duration-300 group-hover:gap-3 group-hover:text-[#d0b16b]"
        >
          Explore {plugin.name}

          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      )}
    </article>
  );
}

function GlobalSection() {
  return (
    <section>
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6d89a3]/15" />

          <span className="text-xs uppercase tracking-[0.28em] text-[#718ba1]">
            Global
          </span>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6d89a3]/15" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#f4f8ff] sm:text-4xl">
            The foundation beneath Quill & Ink.
          </h2>

          <p className="mt-4 leading-7 text-[#91aabd]">
            Global systems provide the shared foundation that allows Quill &
            Ink&apos;s different experiences to work together consistently
            across your server.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Shared Foundation",
            description:
              "Core systems that provide the foundation used by Quill & Ink across its different modules.",
          },
          {
            title: "Connected Systems",
            description:
              "Community, economy, and moderation experiences are designed to work together rather than feel isolated.",
          },
          {
            title: "Consistent Experience",
            description:
              "Persistent configuration and shared systems help Quill & Ink remain familiar as your server grows.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-[1.75rem] border border-[#6d89a3]/12 bg-[#071827]/55 p-7 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#73d9eb]/[0.025] blur-3xl" />

            <p className="relative text-[10px] font-medium uppercase tracking-[0.28em] text-[#73d9eb]">
              Global System
            </p>

            <h3 className="relative mt-4 text-xl font-semibold text-[#f1f7ff]">
              {item.title}
            </h3>

            <p className="relative mt-4 text-sm leading-7 text-[#91aabd]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030a12] text-[#f4f8ff]">
      {/* Living celestial background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="explore-nebula explore-nebula--cyan absolute left-[-15%] top-[-12%] h-[55rem] w-[55rem] rounded-full" />

        <div className="explore-nebula explore-nebula--blue absolute right-[-18%] top-[18%] h-[50rem] w-[50rem] rounded-full" />

        <div className="explore-nebula explore-nebula--gold absolute bottom-[-25%] left-[20%] h-[50rem] w-[60rem] rounded-full" />

        <div className="explore-celestial-veil absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

        {stars.map((star, index) => (
          <span
            key={index}
            className="explore-star absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}

        <span className="explore-celestial-point absolute left-[18%] top-[30%]" />
        <span className="explore-celestial-point absolute left-[74%] top-[17%]" />
        <span className="explore-celestial-point absolute left-[91%] top-[63%]" />

        <span className="explore-celestial-point explore-celestial-point--gold absolute left-[31%] top-[74%]" />
        <span className="explore-celestial-point explore-celestial-point--gold absolute left-[69%] top-[82%]" />

        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M11 25 L16 20 L22 24 L27 18 L32 22"
            fill="none"
            stroke="rgba(115,217,235,0.13)"
            strokeWidth="0.08"
          />

          <path
            d="M79 26 L84 31 L89 27"
            fill="none"
            stroke="rgba(208,177,107,0.12)"
            strokeWidth="0.08"
          />
        </svg>

        {constellationPoints.map((point, index) => (
          <span
            key={index}
            className="explore-constellation-point absolute"
            style={{
              left: point.left,
              top: point.top,
            }}
          />
        ))}

        <div className="absolute left-1/2 top-[36%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#73d9eb]/[0.018] blur-[140px]" />

        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#73d9eb]/[0.035] via-transparent to-[#d0b16b]/[0.025]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,10,18,0.18)_48%,rgba(3,10,18,0.72)_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <Link
          href="/"
          className="group text-lg font-semibold tracking-[0.18em] text-[#f4f8ff]"
        >
          <span className="transition duration-300 group-hover:text-[#d0b16b]">
            QUILL & INK
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#8ea8bc] md:flex">
          <Link href="/explore" className="relative text-[#d0b16b]">
            Explore
            <span className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d0b16b]/70 to-transparent" />
          </Link>

          <Link
            href="/pricing"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            Contact
          </Link>
        </div>

        <a
          href="https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot"
          className="rounded-full border border-[#73d9eb]/25 bg-[#071827]/75 px-5 py-2.5 text-sm font-medium text-[#73d9eb] shadow-[0_0_30px_rgba(115,217,235,0.04)] backdrop-blur-md transition duration-300 hover:border-[#d0b16b]/50 hover:bg-[#0a2035] hover:text-[#d0b16b] hover:shadow-[0_0_30px_rgba(208,177,107,0.08)]"
        >
          Add to Discord
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pb-20 pt-24 text-center sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d0b16b]/40" />

            <span className="text-xs font-medium uppercase tracking-[0.4em] text-[#d0b16b]">
              The Collection
            </span>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d0b16b]/40" />
          </div>

          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#73d9eb]/90">
            Explore Quill & Ink
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.03em] text-[#f4f8ff] sm:text-6xl">
            Tools for communities.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#91aabd] sm:text-lg">
            Discover the systems, tools, and experiences that make up Quill &
            Ink. Start with the essentials, then explore what your community
            can build on top of them.
          </p>
        </div>
      </section>

      {/* Catalogue */}
      <section className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-20">
          {categories.map((category) => {
            if (category.id === "global") {
              return <GlobalSection key={category.id} />;
            }

            const categoryPlugins = plugins.filter(
              (plugin) => plugin.category === category.id,
            );

            return (
              <section key={category.id}>
                <div className="mb-8">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6d89a3]/15" />

                    <span className="text-xs uppercase tracking-[0.28em] text-[#718ba1]">
                      {category.name}
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6d89a3]/15" />
                  </div>

                  <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#f4f8ff] sm:text-4xl">
                      {category.name}
                    </h2>

                    <p className="mt-4 leading-7 text-[#91aabd]">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {categoryPlugins.map((plugin) => (
                    <PluginCard key={plugin.id} plugin={plugin} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* Premium note */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#d0b16b]/15 bg-[#071827]/55 p-8 text-center backdrop-blur-xl sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#d0b16b]">
            Quill & Ink Premium
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#f4f8ff] sm:text-4xl">
            More experiences. More possibilities.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#91aabd]">
            Premium plugins are marked throughout the collection. Learn what
            Premium includes and how it works on the pricing page.
          </p>

          <Link
            href="/pricing"
            className="mt-8 inline-flex rounded-full bg-[#d0b16b] px-7 py-3.5 text-sm font-semibold text-[#061525] transition hover:bg-[#e5c980]"
          >
            Learn about Premium
          </Link>
        </div>
      </section>

      {/* Closing */}
      <section className="relative z-10 px-6 pb-32 pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-10 flex items-center justify-center gap-4">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#73d9eb]/20" />

            <span className="text-xs text-[#d0b16b]/60">✦</span>

            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#73d9eb]/20" />
          </div>

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
            Made to grow
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#f4f8ff] sm:text-4xl">
            More is always being written.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#91aabd]">
            Quill & Ink is designed to grow with the communities that use it.
            New tools and experiences can become part of the collection over
            time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#6d89a3]/10 bg-[#030a12]/30 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-[#687f91] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wide text-[#dce8ef]">
              Quill & Ink
            </p>

            <p className="mt-1">
              Built for communities. Made for stories.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/about"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              About
            </Link>

            <Link
              href="/pricing"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}