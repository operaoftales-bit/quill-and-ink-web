
import Link from "next/link";

const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2253294731390128&integration_type=0&scope=bot+applications.commands"
  const DISCORD_SUPPORT_URL = "https://discord.gg/3qbKqxBJDa";


function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
        {eyebrow}
      </p>

      <h2 className="mt-3 font-serif text-3xl tracking-tight text-white sm:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.07]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-10"
        >
          <Link
            href="/"
            className="shrink-0 font-serif text-xl tracking-wide text-white transition hover:text-cyan-200"
          >
            Quill <span className="text-cyan-300">&</span> Ink
          </Link>

          <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/explore" className="transition hover:text-white">
              Explore
            </Link>
            <Link
              href="/pricing"
              aria-current="page"
              className="text-cyan-200"
            >
              Pricing
            </Link>
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>

          <a
            href={DISCORD_INSTALL_URL}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-2.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/[0.14] sm:px-5 sm:text-sm"
          >
            Add to Discord
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3.5 py-2 text-xs font-medium tracking-wide text-cyan-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Simple, one-time-at-a-time pricing
            </p>

            <h1 className="mt-7 max-w-2xl font-serif text-4xl leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              More room for
              <span className="block text-cyan-200">your community’s story.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Quill & Ink Premium unlocks additional experiences for your
              server. Choose Premium when you are ready, enjoy it for 30 days,
              and renew only when you want to.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={DISCORD_INSTALL_URL}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#06101a] transition hover:bg-cyan-200"
              >
                Add Quill & Ink to Discord
              </a>

              <a
                href="#how-to-buy"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                How to get Premium
              </a>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              Premium is purchased through the bot in Discord, not directly
              through this website.
            </p>
          </div>

          {/* Pricing card */}
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-cyan-400/[0.07] blur-2xl"
            />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1120]/90 p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.06] blur-3xl"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      Quill & Ink
                    </p>
                    <h2 className="mt-3 font-serif text-3xl text-white">
                      Premium
                    </h2>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-3 py-1.5 text-xs font-medium text-amber-200">
                    30 days
                  </span>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                    ₹350/~$4
                  </span>
                  <span className="text-sm text-slate-400">/ 30 days</span>
                </div>

                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                  Extra experiences for communities that want to get more out
                  of Quill & Ink.
                </p>

                <div className="my-7 h-px bg-white/[0.08]" />

                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-cyan-300">✓</span>
                    <span>Access to Premium plugins and experiences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-cyan-300">✓</span>
                    <span>30 days of Premium access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-cyan-300">✓</span>
                    <span>No automatic renewal</span>
                  </li>
                </ul>

                <a
                  href={DISCORD_INSTALL_URL}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#06101a] transition hover:bg-cyan-200"
                >
                  Get started on Discord
                </a>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Open the bot and use{" "}
                  <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-cyan-200">
                    /setup
                  </code>{" "}
                  to find the Premium option.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase instructions */}
      <section
        id="how-to-buy"
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
      >
        <SectionHeading
          eyebrow="Getting started"
          title="How to get Premium."
          description="You can start from this website, but the purchase itself is handled through Quill & Ink in Discord."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-sm font-semibold text-cyan-200">
              01
            </span>

            <h3 className="mt-5 font-serif text-xl text-white">
              Add the bot
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Invite Quill & Ink to your Discord server if you have not already
              added it.
            </p>

            <a
              href={DISCORD_INSTALL_URL}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              Add to Discord <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-sm font-semibold text-cyan-200">
              02
            </span>

            <h3 className="mt-5 font-serif text-xl text-white">
              Open the setup panel
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              In your server, run{" "}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-cyan-200">
                /setup
              </code>{" "}
              and select the Premium button.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-sm font-semibold text-cyan-200">
              03
            </span>

            <h3 className="mt-5 font-serif text-xl text-white">
              Follow the purchase steps
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Follow the options shown by the bot to purchase Premium for your
              server. Your access lasts for 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* Before purchasing */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="grid gap-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0d1628] to-[#080d18] p-6 sm:p-9 lg:grid-cols-[1fr_0.8fr] lg:gap-12 lg:p-10">
          <div>
            <SectionHeading
              eyebrow="Before you purchase"
              title="Know what to expect."
              description="Take a moment to review the details before purchasing Premium."
            />

            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">•</span>
                <span>
                  Premium is priced at ₹350/around $4 for a 30-day period.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">•</span>
                <span>
                  Access does not renew automatically. You can choose whether
                  to purchase again when your period ends.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">•</span>
                <span>
                  Read the relevant policies so you understand the purchase
                  terms before proceeding.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-white/[0.07] bg-black/15 p-5 sm:p-6">
            <h3 className="font-serif text-xl text-white">
              Review our policies
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Find the information you need before making a purchase.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Refunds", href: "/refunds" },
                { label: "Shipping", href: "/shipping" },
              ].map((policy) => (
                <Link
                  key={policy.href}
                  href={policy.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-300/25 hover:text-cyan-200"
                >
                  {policy.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Need a hand?
            </p>

            <h2 className="mt-3 font-serif text-2xl text-white">
              We’re here to help.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">
              If you have questions about Premium or need help using the bot,
              visit our support server.
            </p>
          </div>

          <a
            href={DISCORD_SUPPORT_URL}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05]"
          >
            Join support server
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} Quill & Ink. Built for communities.
            Made for stories.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/about" className="transition hover:text-slate-300">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-slate-300">
              Contact
            </Link>
            <Link href="/terms" className="transition hover:text-slate-300">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/refunds" className="transition hover:text-slate-300">
              Refunds
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
