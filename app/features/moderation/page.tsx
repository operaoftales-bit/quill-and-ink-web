import Link from "next/link";

const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const moderationFeatures = [
  {
    title: "Anti-Spam",
    description:
      "Quill & Ink watches message activity and automatically reacts when a member sends more than 5 messages within a 5-second window.",
    details: [
      "Spam messages are automatically deleted.",
      "The member is automatically timed out for 1 minute when possible.",
      "The action is recorded as a moderation case.",
    ],
  },
  {
    title: "Invite Protection",
    description:
      "Automatically detect Discord invite links and remove them before they become an unwanted source of outside promotion.",
    details: [
      "Discord invite links are detected automatically.",
      "Detected messages are deleted when possible.",
      "The member receives an automatic warning.",
    ],
  },
  {
    title: "Mention Protection",
    description:
      "Prevent excessive mention spam from disrupting your server.",
    details: [
      "Messages containing more than 10 user or role mentions are detected.",
      "The offending message is deleted when possible.",
      "The member receives an automatic warning.",
    ],
  },
  {
    title: "Blocked Language",
    description:
      "A built-in blocked-language filter helps keep conversations within the standards you want for your community.",
    details: [
      "Blocked terms are detected automatically.",
      "Matching messages are deleted when possible.",
      "The member receives an automatic warning.",
    ],
  },
  {
    title: "Repeated Messages",
    description:
      "Catch members repeatedly sending the exact same message in a short period of time.",
    details: [
      "Three identical messages within 10 seconds trigger the protection.",
      "The repeated message is deleted when possible.",
      "The member receives an automatic warning.",
    ],
  },
];

const caseTypes = [
  ["BAN", "B"],
  ["KICK", "K"],
  ["WARN", "W"],
  ["TIMEOUT", "T"],
  ["UNTIMEOUT", "UT"],
  ["UNBAN", "UB"],
  ["LOCK", "L"],
  ["UNLOCK", "UL"],
  ["PURGE", "P"],
  ["CLEAR WARNINGS", "CW"],
  ["ANTI-SPAM TIMEOUT", "AST"],
];

export default function ModerationPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061525] text-[#f5f7f8]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-[#17365d]/30 blur-[120px]" />
        <div className="absolute right-[-10%] top-[25%] h-[450px] w-[450px] rounded-full bg-[#2a1d46]/25 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[25%] h-[450px] w-[450px] rounded-full bg-[#16314d]/25 blur-[120px]" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-semibold tracking-wide text-[#f5f1e8]"
        >
          Quill & Ink
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#aeb8c4] md:flex">
          <Link
            href="/#features"
            className="transition hover:text-[#f5f1e8]"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="transition hover:text-[#f5f1e8]"
          >
            Pricing
          </Link>
          <Link
            href="/#premium"
            className="transition hover:text-[#f5f1e8]"
          >
            Premium
          </Link>
          <Link
            href="/contact"
            className="transition hover:text-[#f5f1e8]"
          >
            Contact
          </Link>
        </div>

        <a
          href={DISCORD_INSTALL_URL}
          className="rounded-full border border-[#8ea5bc]/30 bg-[#10263d]/70 px-5 py-2.5 text-sm font-medium text-[#f5f7f8] backdrop-blur transition hover:border-[#c7d4e2]/50 hover:bg-[#173653]"
        >
          Add to Discord
        </a>
      </nav>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-28">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-[#9eb4c8]">
          Quill & Ink · Moderation
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-[#f5f1e8] sm:text-6xl lg:text-7xl">
          Moderation, built into the experience.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#aeb8c4]">
          Keep your community organized with automatic protection, structured
          moderation records, and tools designed to handle everyday server
          management.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={DISCORD_INSTALL_URL}
            className="rounded-full bg-[#f5f1e8] px-7 py-3.5 text-sm font-semibold text-[#061525] transition hover:bg-white"
          >
            Add Quill & Ink
          </a>

          <Link
            href="/#features"
            className="rounded-full border border-[#8ea5bc]/30 px-7 py-3.5 text-sm font-medium text-[#d6dee6] transition hover:border-[#c7d4e2]/50 hover:bg-[#10263d]/60"
          >
            Explore Features
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8fa9c0]">
            Automatic protection
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#f5f1e8] sm:text-4xl">
            Let Quill & Ink handle the noise.
          </h2>

          <p className="mt-4 max-w-2xl text-[#9eabb8]">
            Auto moderation works quietly in the background, responding to
            common sources of disruption without requiring constant manual
            intervention.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {moderationFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-[#8ea5bc]/15 bg-[#0b1c2d]/75 p-7 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-[#f5f1e8]">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-[#aeb8c4]">
                {feature.description}
              </p>

              <ul className="mt-5 space-y-2.5 text-sm leading-6 text-[#8f9eac]">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9eb4c8]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-3xl border border-[#8ea5bc]/15 bg-[#0b1c2d]/75 p-8 backdrop-blur-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8fa9c0]">
              Moderation cases
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-[#f5f1e8]">
              Keep moderation actions organized.
            </h2>

            <p className="mt-4 leading-7 text-[#aeb8c4]">
              Moderation actions can be persisted as structured cases, giving
              your server a consistent record of what happened, who was
              involved, and why the action was taken.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {caseTypes.map(([name, prefix]) => (
              <div
                key={name}
                className="rounded-full border border-[#8ea5bc]/15 bg-[#061525]/60 px-4 py-2 text-sm text-[#c1ccd6]"
              >
                <span className="font-medium text-[#f5f1e8]">{name}</span>
                <span className="ml-2 text-[#718294]">{prefix}</span>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-2xl text-sm leading-6 text-[#7f8e9d]">
            When a moderation log channel is configured, Quill & Ink can also
            send structured moderation logs after cases are created.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-28 text-center lg:px-8">
        <div className="rounded-3xl border border-[#8ea5bc]/15 bg-[#0b1c2d]/70 px-7 py-12 backdrop-blur-sm sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[#f5f1e8] sm:text-4xl">
            Give your server a stronger foundation.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#9eabb8]">
            Add Quill & Ink and bring moderation, community features, economy,
            and more into one modular Discord bot.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              className="rounded-full bg-[#f5f1e8] px-7 py-3.5 text-sm font-semibold text-[#061525] transition hover:bg-white"
            >
              Add to Discord
            </a>

            <Link
              href="/contact"
              className="rounded-full border border-[#8ea5bc]/30 px-7 py-3.5 text-sm font-medium text-[#d6dee6] transition hover:border-[#c7d4e2]/50 hover:bg-[#10263d]/60"
            >
              Contact Quill & Ink
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#8ea5bc]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-[#718294] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Quill & Ink. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-[#b8c5d1]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-[#b8c5d1]"
            >
              Terms
            </Link>
            <Link
              href="/refunds"
              className="transition hover:text-[#b8c5d1]"
            >
              Refunds
            </Link>
            <Link
              href="/contact"
              className="transition hover:text-[#b8c5d1]"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}