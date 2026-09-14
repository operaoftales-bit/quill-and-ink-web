const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const economyFeatures = [
  {
    icon: "🪙",
    title: "Nickel Economy",
    description:
      "Give your community its own persistent economy with Nickel, wallets, rewards, and server activity.",
  },
  {
    icon: "🎁",
    title: "Daily Rewards",
    description:
      "Keep members coming back with daily Nickel rewards and activity streaks.",
  },
  {
    icon: "💳",
    title: "Opera Card",
    description:
      "Give members a personal Opera Card alongside their server wallet, with secure card balances and transfers.",
  },
  {
    icon: "💰",
    title: "Member Activity",
    description:
      "Reward members for participating in configured channels and keep your community economy active.",
  },
];

const games = [
  {
    icon: "🎲",
    title: "Dice",
    description:
      "A built-in dice game that gives your community another way to enjoy the economy.",
  },
  {
    icon: "🎰",
    title: "Slots",
    description:
      "Bring a classic slots experience directly into your Discord server.",
  },
];

export default function EconomyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] text-[#f4f8ff]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[#176b9c]/20 blur-[150px]" />
        <div className="absolute -right-40 top-[25%] h-[36rem] w-[36rem] rounded-full bg-[#36c9e8]/10 blur-[160px]" />
        <div className="absolute bottom-[15%] left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.04] blur-[150px]" />

        <div className="absolute left-[8%] top-[12%] text-sm text-white/30">
          ✦
        </div>
        <div className="absolute right-[12%] top-[18%] text-xs text-[#73d9eb]/40">
          ✦
        </div>
        <div className="absolute left-[18%] top-[58%] text-xs text-white/20">
          ✦
        </div>
        <div className="absolute right-[20%] bottom-[20%] text-sm text-[#73d9eb]/25">
          ✦
        </div>
        <div className="absolute left-[48%] top-[8%] text-xs text-[#d0b16b]/30">
          ✦
        </div>
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
          <a
            href="/features/premium"
            className="transition hover:text-[#73d9eb]"
          >
            Premium
          </a>
          <a href="/contact" className="transition hover:text-[#73d9eb]">
            Contact
          </a>
        </div>

        <a
          href={DISCORD_INSTALL_URL}
          className="rounded-full border border-[#73d9eb]/30 bg-[#081a2c]/70 px-5 py-2.5 text-sm font-medium text-[#73d9eb] backdrop-blur-md transition hover:border-[#73d9eb]/60 hover:bg-[#0a2035]"
        >
          Add to Discord
        </a>
      </nav>

      <section className="relative px-6 pb-28 pt-20 text-center sm:pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#73d9eb]">
            Economy & Games
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Give your community something to spend.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#aebfce] sm:text-lg">
            Build a persistent server economy where members can earn Nickel,
            manage their balances, collect rewards, and enjoy built-in games.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              className="rounded-full bg-[#f4f8ff] px-8 py-4 text-sm font-semibold text-[#061525] shadow-[0_0_35px_rgba(115,217,235,0.12)] transition hover:bg-[#73d9eb]"
            >
              Add Quill & Ink to Discord
            </a>

            <a
              href="/contact"
              className="rounded-full border border-[#6d89a3]/30 bg-[#081a2c]/50 px-8 py-4 text-sm font-semibold text-[#d8e8f5] backdrop-blur-md transition hover:border-[#73d9eb]/60 hover:text-[#73d9eb]"
            >
              Talk to us
            </a>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <div className="h-px bg-gradient-to-r from-transparent via-[#73d9eb]/40 to-transparent" />
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
              The Economy
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              More than just a balance.
            </h2>

            <p className="mt-4 leading-7 text-[#9eb6ca]">
              Quill & Ink gives your server the tools to build an economy that
              members can actually interact with.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {economyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[#6d89a3]/20 bg-[#081a2c]/70 p-7 shadow-[0_0_50px_rgba(40,180,220,0.03)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#73d9eb]/40 hover:bg-[#0a2035]/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#73d9eb]/20 bg-[#0b2438] text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[#f1f7ff] transition group-hover:text-[#73d9eb]">
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
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
              Built-in Games
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              A little more fun for your server.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#9eb6ca]">
              Turn your economy into something members can actually enjoy with
              games built directly into Quill & Ink.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {games.map((game) => (
              <div
                key={game.title}
                className="rounded-3xl border border-[#6d89a3]/20 bg-[#081a2c]/70 p-8 text-center shadow-[0_0_50px_rgba(40,180,220,0.03)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#d0b16b]/40"
              >
                <div className="text-4xl">{game.icon}</div>

                <h3 className="mt-5 text-2xl font-semibold text-[#f1f7ff]">
                  {game.title}
                </h3>

                <p className="mt-3 leading-7 text-[#9eb6ca]">
                  {game.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-28 pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px max-w-3xl bg-gradient-to-r from-transparent via-[#73d9eb]/30 to-transparent" />

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
            Ready to begin?
          </p>

          <h2 className="mt-5 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Give your server an economy of its own.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#9eb6ca]">
            Add Quill & Ink to your Discord server and start building your
            community experience.
          </p>

          <a
            href={DISCORD_INSTALL_URL}
            className="mt-9 inline-flex rounded-full bg-[#f4f8ff] px-8 py-4 text-sm font-semibold text-[#061525] shadow-[0_0_35px_rgba(115,217,235,0.1)] transition hover:bg-[#73d9eb]"
          >
            Add Quill & Ink
          </a>
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