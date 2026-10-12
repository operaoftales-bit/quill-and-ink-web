
import Link from "next/link";

const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const DISCORD_SUPPORT_URL = "https://discord.gg/v95scy728";

const exploreLinks = [
  {
    title: "Explore Quill & Ink",
    description:
      "See the plugins and tools you can use to build your Discord community.",
    href: "/explore",
    label: "Explore",
    accent: "cyan",
  },
  {
    title: "Premium",
    description:
      "See what's included in Premium and learn about the available plans.",
    href: "/pricing",
    label: "Pricing",
    accent: "gold",
  },
];

const informationLinks = [
  {
    title: "Privacy",
    description:
      "Learn what information the bot uses and how it is handled.",
    href: "/privacy",
  },
  {
    title: "Terms & Conditions",
    description:
      "Read the rules for using Quill & Ink and its services.",
    href: "/terms",
  },
  {
    title: "Refunds",
    description:
      "Find out about refunds and cancellations for Premium purchases.",
    href: "/refunds",
  },
  {
    title: "Shipping",
    description:
      "Learn how digital services are delivered and what to expect after a purchase.",
    href: "/shipping",
  },
  {
    title: "Contact",
    description:
      "Need help or have a question? Find out how to reach us.",
    href: "/contact",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040d18] text-[#f4f8ff]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#176b9c]/20 blur-[150px]" />

        <div className="absolute -left-56 top-[30%] h-[34rem] w-[34rem] rounded-full bg-[#176b9c]/10 blur-[150px]" />

        <div className="absolute -right-56 top-[50%] h-[38rem] w-[38rem] rounded-full bg-[#36c9e8]/[0.04] blur-[160px]" />

        <div className="absolute bottom-[-18rem] left-1/2 h-[40rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.05] blur-[160px]" />

        <div className="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(#eafaff_0.6px,transparent_0.6px)] [background-size:26px_26px]" />
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-6 sm:py-7"
      >
        <Link
          href="/"
          className="text-base font-semibold tracking-[0.14em] text-[#f4f8ff] transition duration-300 hover:text-[#d0b16b] sm:text-lg"
        >
          QUILL & INK
        </Link>

        <div className="hidden items-center gap-7 text-sm text-[#9ab0c1] md:flex">
          <Link href="/" className="transition hover:text-[#d0b16b]">
            Home
          </Link>

          <Link
            href="/explore"
            className="transition hover:text-[#d0b16b]"
          >
            Explore
          </Link>

          <Link
            href="/pricing"
            className="transition hover:text-[#d0b16b]"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            aria-current="page"
            className="text-[#d0b16b]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-[#d0b16b]"
          >
            Contact
          </Link>
        </div>

        <a
          href={DISCORD_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#73d9eb]/25 bg-[#071827]/75 px-4 py-2.5 text-sm font-medium text-[#73d9eb] transition duration-300 hover:border-[#d0b16b]/50 hover:bg-[#0a2035] hover:text-[#d0b16b] sm:px-5"
        >
          Add to Discord
        </a>
      </nav>

      <article className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        {/* Introduction */}
        <header className="relative overflow-hidden rounded-3xl border border-[#56859f]/20 bg-[#091b2d]/65 p-6 backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#55d5e8]/[0.06] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#c6a15b]/[0.04] blur-3xl" />

          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#73d9eb] sm:text-sm sm:tracking-[0.24em]">
              About the project
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-[#f4f8ff] sm:text-5xl lg:text-6xl">
              A little more life for your Discord server.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#b0c2cf] sm:text-lg sm:leading-8">
              Quill & Ink brings community tools, moderation, games, and
              progression systems together in one Discord bot. It is built
              to help communities grow, have fun, and make memories together.
            </p>

            <p className="mt-5 font-serif text-lg text-[#d8bd78] sm:text-xl">
              Built for communities. Made for stories.
            </p>
          </div>
        </header>

        {/* About the bot */}
        <section className="mt-14 sm:mt-16">
          <SectionHeading label="The project" />

          <div className="rounded-3xl border border-[#56859f]/15 bg-[#071827]/60 p-6 backdrop-blur-md sm:p-9">
            <h2 className="font-serif text-2xl font-semibold text-[#f1f8fa] sm:text-3xl">
              One bot, many possibilities.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-[#a9bdca] sm:text-base sm:leading-8">
              <p>
                Quill & Ink is a modular Discord bot. That means it has
                different plugins for different needs, from keeping a
                community safe to giving members games and ways to earn
                rewards.
              </p>

              <p>
                The aim is simple: give server owners useful tools without
                making them manage a collection of separate bots.
              </p>

              <p>
                Quill & Ink is still growing. New ideas, improvements, and
                features will be added as the project develops.
              </p>
            </div>
          </div>
        </section>

        {/* Explore links */}
        <section className="mt-14 sm:mt-16">
          <SectionHeading label="Take a look around" />

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {exploreLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-3xl border border-[#56859f]/15 bg-[#071827]/65 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#d0b16b]/40 hover:bg-[#0b1c2b]/80 hover:shadow-[0_20px_60px_rgba(208,177,107,0.06)] sm:p-7"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#d0b16b]/[0.03] blur-3xl transition duration-500 group-hover:bg-[#d0b16b]/[0.1]" />

                <div className="relative">
                  <p
                    className={
                      item.accent === "gold"
                        ? "text-xs font-medium uppercase tracking-[0.16em] text-[#d0b16b]"
                        : "text-xs font-medium uppercase tracking-[0.16em] text-[#73d9eb]"
                    }
                  >
                    {item.label}
                  </p>

                  <h3 className="mt-4 font-serif text-2xl font-semibold text-[#f1f8fa] transition-colors duration-300 group-hover:text-[#d0b16b]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#9bb0bf]">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#73d9eb] transition-colors group-hover:text-[#d0b16b]">
                    {item.title === "Premium" ? "View plans" : "Browse plugins"}

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Useful information */}
        <section className="mt-14 sm:mt-16">
          <SectionHeading label="Useful information" />

          <div className="grid gap-4 sm:grid-cols-2">
            {informationLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-[#56859f]/15 bg-[#071827]/60 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#d0b16b]/35 hover:bg-[#0b1c2b]/80 sm:p-6"
              >
                <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d0b16b]/60 to-transparent transition-all duration-500 group-hover:w-[80%]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#f1f8fa] transition-colors group-hover:text-[#d0b16b]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#9bb0bf]">
                      {item.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[#73d9eb] transition duration-300 group-hover:translate-x-1 group-hover:text-[#d0b16b]"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="mt-14 sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#56859f]/15 bg-[#071827]/65 p-7 text-center backdrop-blur-md sm:p-10">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#73d9eb]/[0.04] blur-3xl" />

            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d0b16b]">
                We're here to help
              </p>

              <h2 className="mt-4 font-serif text-3xl font-semibold text-[#f1f8fa] sm:text-4xl">
                Have a question?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#a9bdca] sm:text-base">
                If you need help with Quill & Ink or want to get in touch,
                visit our contact page or join our Discord support server.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-w-36 items-center justify-center rounded-full border border-[#73d9eb]/30 bg-[#0a1b2d]/70 px-5 py-3 text-sm font-medium text-[#73d9eb] transition duration-300 hover:border-[#d0b16b]/50 hover:bg-[#102236] hover:text-[#d0b16b]"
                >
                  Contact us
                </Link>

                <a
                  href={DISCORD_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-36 items-center justify-center rounded-full border border-[#56859f]/30 bg-[#0a1b2d]/70 px-5 py-3 text-sm font-medium text-[#dce8ef] transition duration-300 hover:border-[#d0b16b]/45 hover:text-[#d0b16b]"
                >
                  Join support
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-[#56859f]/15 pt-6 text-center sm:mt-16 sm:pt-8">
          <p className="text-xs leading-6 text-[#7891a4]">
            Quill & Ink
            <span className="mx-2 text-[#d0b16b]/70">·</span>
            Built for communities. Made for stories.
          </p>
        </footer>
      </article>
    </main>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-4 sm:mb-7">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#56859f]/25" />

      <span className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#8199ab] sm:text-xs sm:tracking-[0.2em]">
        {label}
      </span>

      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#56859f]/25" />
    </div>
  );
}
