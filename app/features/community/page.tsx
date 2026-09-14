const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const features = [
  {
    number: "01",
    title: "Leveling & Progression",
    description:
      "Give members a reason to stay active. Eligible messages can earn XP, build levels, maintain activity streaks, and unlock role rewards.",
    details: [
      "15–25 XP from eligible messages",
      "60-second XP cooldown",
      "Persistent levels and total XP",
      "Daily activity streaks",
      "Optional level-up announcements",
      "Level-based role rewards",
      "Server leaderboard",
    ],
  },
  {
    number: "02",
    title: "Member Profiles",
    description:
      "Turn member activity into a profile that shows their progress and place in the community.",
    details: [
      "Level and current XP",
      "Total XP",
      "Server rank",
      "Activity streak",
      "Join date",
      "Profile role",
      "Wallet balance",
      "View other members' profiles",
    ],
  },
  {
    number: "03",
    title: "Reaction Roles",
    description:
      "Let members choose configured roles through persistent reaction-role dashboards.",
    details: [
      "Persistent reaction-role dashboards",
      "React to receive a configured role",
      "Remove the reaction to remove the role",
      "Unicode emoji support",
      "Custom emoji support",
      "Animated emoji support",
      "Role hierarchy validation",
    ],
  },
  {
    number: "04",
    title: "Welcome & Leave",
    description:
      "Make joining and leaving your server feel more organized with automated welcome and leave messages.",
    details: [
      "Automated welcome messages",
      "Automated leave messages",
      "Server-specific configuration",
      "Managed through Quill & Ink",
    ],
  },
  {
    number: "05",
    title: "Support Tickets",
    description:
      "Give members a dedicated way to create support tickets when they need help from your server team.",
    details: [
      "Members can create support tickets",
      "Dedicated ticket workflow",
      "Built for organized server support",
    ],
  },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061525] text-[#f5f7f8]">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#1c6075]/10 blur-3xl" />
        <div className="absolute bottom-[-20rem] right-[-10rem] h-[35rem] w-[35rem] rounded-full bg-[#b58a3a]/8 blur-3xl" />

        <div className="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-[#63d7ea]/70" />
        <div className="absolute left-[18%] top-[42%] h-1 w-1 rounded-full bg-[#f5f1e8]/40" />
        <div className="absolute right-[14%] top-[24%] h-1 w-1 rounded-full bg-[#63d7ea]/60" />
        <div className="absolute right-[25%] top-[55%] h-1 w-1 rounded-full bg-[#f5f1e8]/30" />
        <div className="absolute left-[42%] top-[72%] h-1 w-1 rounded-full bg-[#d6b36a]/50" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-[#f5f1e8]"
        >
          QUILL & INK
        </a>

        <div className="hidden items-center gap-8 text-sm text-[#b8c5ce] md:flex">
          <a className="transition hover:text-[#63d7ea]" href="/#features">
            Features
          </a>
          <a className="transition hover:text-[#63d7ea]" href="/pricing">
            Pricing
          </a>
          <a className="transition hover:text-[#63d7ea]" href="/pricing">
            Premium
          </a>
          <a className="transition hover:text-[#63d7ea]" href="/contact">
            Contact
          </a>
        </div>

        <a
          href={DISCORD_INSTALL_URL}
          className="rounded-xl border border-[#63d7ea]/35 bg-[#0a2436]/80 px-4 py-2 text-sm font-medium text-[#dffaff] transition hover:border-[#63d7ea]/70 hover:bg-[#10334a]"
        >
          Add to Discord
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-20 text-center md:pb-28 md:pt-28">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-[#63d7ea]">
          Community
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-[#f5f1e8] sm:text-5xl md:text-6xl">
          Give your members more reasons to participate.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#aebdc7] md:text-lg">
          Quill & Ink turns everyday Discord activity into progression,
          profiles, roles, support, and a more connected community.
        </p>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-2xl border border-[#47718c]/25 bg-[#0a1b2d]/80 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#63d7ea]/45 hover:bg-[#0d2238] md:p-9"
            >
              <div className="grid gap-8 md:grid-cols-[110px_1fr_1fr] md:items-start">
                <div className="text-sm font-medium tracking-[0.2em] text-[#d6b36a]">
                  {feature.number}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-[#f5f1e8] md:text-3xl">
                    {feature.title}
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-[#aebdc7]">
                    {feature.description}
                  </p>
                </div>

                <ul className="grid gap-3 text-sm text-[#c8d3da]">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#63d7ea]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="rounded-3xl border border-[#47718c]/30 bg-[#091c2e]/90 px-6 py-14 text-center backdrop-blur-sm md:px-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#63d7ea]">
            Build your community
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#f5f1e8] md:text-4xl">
            Give your server a little more life.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#aebdc7]">
            Add Quill & Ink and bring progression, profiles, roles, welcome
            messages, and support tools together in one Discord bot.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              className="rounded-xl bg-[#63d7ea] px-6 py-3 font-semibold text-[#061525] transition hover:bg-[#8be5f3]"
            >
              Add to Discord
            </a>

            <a
              href="/contact"
              className="rounded-xl border border-[#47718c]/40 px-6 py-3 font-semibold text-[#dce8ed] transition hover:border-[#63d7ea]/60 hover:bg-[#0d263b]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#47718c]/15 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#7f929f] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Quill & Ink. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <a className="transition hover:text-[#63d7ea]" href="/privacy">
              Privacy
            </a>
            <a className="transition hover:text-[#63d7ea]" href="/terms">
              Terms
            </a>
            <a className="transition hover:text-[#63d7ea]" href="/refunds">
              Refunds
            </a>
            <a className="transition hover:text-[#63d7ea]" href="/shipping">
              Shipping
            </a>
            <a className="transition hover:text-[#63d7ea]" href="/contact">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}