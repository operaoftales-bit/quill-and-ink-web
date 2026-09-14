const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const premiumFeatures = [
  {
    icon: "📜",
    title: "Bulletin",
    description:
      "Give your server a more powerful announcement experience with Premium Bulletin features.",
  },
  {
    icon: "♠️",
    title: "Pressure",
    description:
      "Bring a dedicated Premium game experience to your community with Pressure.",
  },
  {
    icon: "⚙️",
    title: "Advanced Economy",
    description:
      "Take greater control over your server economy with advanced configuration options.",
  },
  {
    icon: "🔊",
    title: "Voice",
    description:
      "Enhance your server's voice experience with Voice, a Premium voice-focused plugin.",
  },
  {
    icon: "🔨",
    title: "Anchor",
    description:
      "Add the Premium Anchor plugin to give your server another dedicated community experience.",
  },
  {
    icon: "🕵️",
    title: "Robbery",
    description:
      "Add a deeper layer of interaction to your server economy with the Premium Robbery experience.",
  },
  {
    icon: "🌐",
    title: "Server-to-Server",
    description:
      "Unlock Premium capabilities that let your economy extend beyond a single Discord server.",
  },
];

export default function PremiumPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] text-[#f4f8ff]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[#176b9c]/20 blur-[150px]" />
        <div className="absolute -right-40 top-[25%] h-[36rem] w-[36rem] rounded-full bg-[#36c9e8]/10 blur-[160px]" />
        <div className="absolute bottom-[15%] left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.06] blur-[150px]" />

        <div className="absolute left-[8%] top-[12%] text-sm text-white/30">✦</div>
        <div className="absolute right-[12%] top-[18%] text-xs text-[#73d9eb]/40">✦</div>
        <div className="absolute left-[18%] top-[58%] text-xs text-white/20">✦</div>
        <div className="absolute right-[20%] bottom-[20%] text-sm text-[#73d9eb]/25">✦</div>
        <div className="absolute left-[48%] top-[8%] text-xs text-[#d0b16b]/30">✦</div>
      </div>

      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
        <a
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-[#f4f8ff]"
        >
          QUILL & INK
        </a>

        <div className="hidden items-center gap-8 text-sm text-[#9eb6ca] md:flex">
          <a
            href="/features/moderation"
            className="transition hover:text-[#73d9eb]"
          >
            Features
          </a>
          <a href="/pricing" className="transition hover:text-[#73d9eb]">
            Pricing
          </a>
          <a href="/features/premium" className="text-[#73d9eb]">
            Premium
          </a>
          <a href="/contact" className="transition hover:text-[#73d9eb]">
            Contact
          </a>
        </div>

        <a
          href={DISCORD_INSTALL_URL}
          className="rounded-full border border-[#d0b16b]/30 bg-[#d0b16b]/[0.06] px-5 py-2.5 text-sm font-medium text-[#d0b16b] backdrop-blur-md transition hover:border-[#d0b16b]/60 hover:bg-[#d0b16b]/[0.1]"
        >
          Add to Discord
        </a>
      </nav>

      <section className="relative px-6 pb-20 pt-20 text-center sm:pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#d0b16b]">
            Quill & Ink Premium
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Give your server more to work with.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#aebfce] sm:text-lg">
            Premium unlocks advanced Quill & Ink features built for communities
            that want more control, more experiences, and more possibilities.
          </p>
        </div>
      </section>

      <section className="relative px-6 pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#c6a15b]/20 bg-[#081a2c]/80 p-8 shadow-[0_0_80px_rgba(198,161,91,0.05)] backdrop-blur-md sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c6a15b]/[0.07] blur-[90px]" />

          <div className="relative grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
                One Premium Plan
              </p>

              <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
                Everything Premium. One simple price.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[#9eb6ca]">
                No complicated tiers. Quill & Ink Premium is designed around a
                straightforward access period for your server.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#aebfce]">
                <span>✓ Premium access</span>
                <span>✓ 30-day period</span>
                <span>✓ Centralized entitlement</span>
              </div>
            </div>

            <div className="text-left md:min-w-[190px] md:text-center">
              <div className="text-5xl font-semibold tracking-tight text-[#f4f8ff]">
                ₹700
              </div>

              <p className="mt-2 text-sm text-[#8198ad]">per 30 days</p>

              <a
                href={DISCORD_INSTALL_URL}
                className="mt-7 inline-flex w-full justify-center rounded-full bg-[#d0b16b] px-7 py-3.5 text-sm font-semibold text-[#061525] transition hover:bg-[#e5c980]"
              >
                Get Premium
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
              What&apos;s Included
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              Built for servers that want more.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#9eb6ca]">
              Premium expands Quill & Ink beyond its core community tools with
              advanced experiences and capabilities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {premiumFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[#6d89a3]/20 bg-[#081a2c]/70 p-7 shadow-[0_0_50px_rgba(40,180,220,0.03)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#d0b16b]/40 hover:bg-[#0a2035]/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d0b16b]/20 bg-[#172334] text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#f1f7ff] transition group-hover:text-[#d0b16b]">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-[#9eb6ca]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-[#6d89a3]/15 bg-[#07182a]/55 px-6 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
              Beyond the Basics
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              Premium should feel like an upgrade.
            </h2>

            <p className="mt-6 leading-8 text-[#9eb6ca]">
              Core Quill & Ink tools remain useful on their own. Premium is for
              communities that want to take their server further with
              additional systems and deeper capabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-28 pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px max-w-3xl bg-gradient-to-r from-transparent via-[#d0b16b]/40 to-transparent" />

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
            Unlock Premium
          </p>

          <h2 className="mt-5 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Ready to take your server further?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#9eb6ca]">
            Get Quill & Ink Premium for ₹700 and unlock 30 days of advanced
            features for your server.
          </p>

          <a
            href={DISCORD_INSTALL_URL}
            className="mt-9 inline-flex rounded-full bg-[#d0b16b] px-8 py-4 text-sm font-semibold text-[#061525] transition hover:bg-[#e5c980]"
          >
            Add Quill & Ink
          </a>

          <p className="mt-5 text-xs text-[#6f879b]">
            Premium access is subject to the applicable Quill & Ink terms.
          </p>
        </div>
      </section>

      <footer className="relative border-t border-[#6d89a3]/15 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-sm text-[#718ba1] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#e9f2f8]">Quill & Ink</p>
            <p className="mt-1">Discord tools for communities.</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="/features/moderation"
              className="transition hover:text-[#73d9eb]"
            >
              Features
            </a>
            <a href="/pricing" className="transition hover:text-[#73d9eb]">
              Pricing
            </a>
            <a
              href="/features/premium"
              className="transition hover:text-[#73d9eb]"
            >
              Premium
            </a>
            <a
              href="/getting-started"
              className="transition hover:text-[#73d9eb]"
            >
              Getting Started
            </a>
            <a href="/contact" className="transition hover:text-[#73d9eb]">
              Contact
            </a>
            <a href="/privacy" className="transition hover:text-[#73d9eb]">
              Privacy
            </a>
            <a href="/terms" className="transition hover:text-[#73d9eb]">
              Terms
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl items-center justify-center gap-4 text-[#73d9eb]/40">
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#73d9eb]/30" />
          <span className="text-xs text-[#d0b16b]/70">✦</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#73d9eb]/30" />
        </div>
      </footer>
    </main>
  );
}