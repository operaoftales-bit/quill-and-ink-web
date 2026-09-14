const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const steps = [
  {
    number: "01",
    title: "Invite Quill & Ink",
    description:
      "Add Quill & Ink to your Discord server using the official invite. The required permissions are requested during installation.",
  },
  {
    number: "02",
    title: "Choose your server",
    description:
      "Select the Discord server where you want to use Quill & Ink. You must have the necessary server permissions to install the bot.",
  },
  {
    number: "03",
    title: "Authorize the bot",
    description:
      "Review the requested permissions and authorize Quill & Ink. Once installation is complete, the bot can begin working in your server.",
  },
  {
    number: "04",
    title: "Configure your server",
    description:
      "Choose the systems your community needs and configure the available plugins for your server.",
  },
  {
    number: "05",
    title: "Start using Quill & Ink",
    description:
      "Once your setup is ready, your members can start using Quill & Ink directly inside Discord.",
  },
];

const featureAreas = [
  {
    icon: "🛡️",
    title: "Moderation",
    description:
      "Keep your server organized with automated protection and structured moderation tools.",
    href: "/features/moderation",
  },
  {
    icon: "🎭",
    title: "Community",
    description:
      "Give members more ways to interact with profiles, roles, leveling, welcome systems, and tickets.",
    href: "/features/community",
  },
  {
    icon: "💰",
    title: "Economy & Games",
    description:
      "Build a persistent Nickel economy with rewards, Opera Cards, activity earning, and games.",
    href: "/features/economy",
  },
  {
    icon: "🌐",
    title: "Global",
    description:
      "Use Quill & Ink's connected systems for announcements, collaborations, banking, and server management.",
    href: "/features/global",
  },
];

const premiumFeatures = [
  { icon: "📜", title: "Bulletin" },
  { icon: "♠️", title: "Pressure" },
  { icon: "🔨", title: "Anchor" },
  { icon: "🔊", title: "Voice Anchor" },
  { icon: "🕵️", title: "Robbery" },
  { icon: "⚙️", title: "Advanced Economy" },
  { icon: "🌐", title: "Server-to-Server" },
  { icon: "🎲", title: "Dice & Slots" },
];

export default function GettingStartedPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] text-[#f4f8ff]">
      {/* Atmospheric background */}
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

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-28 pt-20 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#73d9eb]">
            Getting Started
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Your server&apos;s next chapter starts here.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#aebfce] sm:text-lg">
            Bring Quill &amp; Ink into your server, choose the systems that
            fit your community, and build the experience you want your members
            to have.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              className="rounded-full bg-[#f4f8ff] px-8 py-4 text-sm font-semibold text-[#061525] shadow-[0_0_35px_rgba(115,217,235,0.12)] transition hover:bg-[#73d9eb]"
            >
              Add Quill &amp; Ink to Discord
            </a>

            <a
              href="/pricing"
              className="rounded-full border border-[#6d89a3]/30 bg-[#081a2c]/50 px-8 py-4 text-sm font-semibold text-[#d8e8f5] backdrop-blur-md transition hover:border-[#73d9eb]/60 hover:text-[#73d9eb]"
            >
              View Pricing
            </a>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <div className="h-px bg-gradient-to-r from-transparent via-[#73d9eb]/40 to-transparent" />
        </div>
      </section>

      {/* Journey */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
              The Journey
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              From invite to ready.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#9eb6ca]">
              Getting Quill &amp; Ink running is simple. Follow the setup,
              configure what your server needs, and let your community take it
              from there.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#73d9eb]/30 to-transparent lg:block" />

            <div className="grid gap-8 lg:grid-cols-5">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#73d9eb]/30 bg-[#081a2c]/90 text-sm font-semibold text-[#73d9eb] shadow-[0_0_30px_rgba(54,201,232,0.08)] backdrop-blur-md">
                    {step.number}
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-[#f1f7ff]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8fa8bd]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Areas */}
      <section className="relative border-y border-[#6d89a3]/15 bg-[#07182a]/55 px-6 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
              Choose Your Starting Point
            </p>

            <h2 className="mt-4 text-3xl font-semibold text-[#f1f7ff] sm:text-4xl">
              Start with what your server needs.
            </h2>

            <p className="mt-4 leading-7 text-[#9eb6ca]">
              Quill &amp; Ink brings multiple systems together. Explore each
              area and decide what belongs in your server.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {featureAreas.map((feature) => (
              <a
                key={feature.title}
                href={feature.href}
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

                <p className="mt-6 text-sm font-semibold text-[#73d9eb]">
                  Explore {feature.title} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Premium */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#c6a15b]/20 bg-[#0a1a2a]/80 p-8 shadow-[0_0_80px_rgba(198,161,91,0.05)] backdrop-blur-md sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c6a15b]/[0.06] blur-[90px]" />

            <div className="relative">
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
                  Premium
                </p>

                <h2 className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
                  Take your server further.
                </h2>

                <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#9eb6ca]">
                  Unlock additional plugins and advanced systems for servers
                  that want more from Quill &amp; Ink.
                </p>

                <div className="mt-7">
                  <span className="text-4xl font-semibold text-[#f4f8ff]">
                    ₹700
                  </span>

                  <span className="ml-2 text-[#8198ad]">/ 30 days</span>
                </div>
              </div>

              <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
                {premiumFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-center gap-3 rounded-xl border border-[#6d89a3]/15 bg-[#081a2c]/70 px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="text-lg">{feature.icon}</span>

                    <span className="text-sm font-medium text-[#dceaf5]">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-9 text-center">
                <a
                  href="/features/premium"
                  className="inline-flex rounded-full bg-[#d0b16b] px-8 py-4 text-sm font-semibold text-[#061525] transition hover:bg-[#e5c980]"
                >
                  Explore Premium
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 pb-28 pt-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px max-w-3xl bg-gradient-to-r from-transparent via-[#73d9eb]/30 to-transparent" />

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
            Begin
          </p>

          <h2 className="mt-5 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Give your server more to work with.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#9eb6ca]">
            Invite Quill &amp; Ink and start building your server&apos;s
            experience today.
          </p>

          <a
            href={DISCORD_INSTALL_URL}
            className="mt-9 inline-flex rounded-full bg-[#f4f8ff] px-8 py-4 text-sm font-semibold text-[#061525] shadow-[0_0_35px_rgba(115,217,235,0.1)] transition hover:bg-[#73d9eb]"
          >
            Add Quill &amp; Ink to Discord
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#6d89a3]/15 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-sm text-[#718ba1] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#e9f2f8]">Quill &amp; Ink</p>

            <p className="mt-1">
              A Discord bot built for communities, creativity, and more.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="/features/moderation"
              className="transition hover:text-[#73d9eb]"
            >
              Features
            </a>

            <a
              href="/pricing"
              className="transition hover:text-[#73d9eb]"
            >
              Pricing
            </a>

            <a
              href="/getting-started"
              className="transition hover:text-[#73d9eb]"
            >
              Getting Started
            </a>

            <a
              href="/contact"
              className="transition hover:text-[#73d9eb]"
            >
              Contact
            </a>

            <a
              href="/privacy"
              className="transition hover:text-[#73d9eb]"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-[#73d9eb]"
            >
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