const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const features = [
  {
    title: "Moderation",
    description:
      "Keep your community organized with powerful tools built for everyday server management.",
    href: "/features/moderation",
  },
  {
    title: "Community",
    description:
      "Give your members interactive features that make your Discord server feel alive.",
    href: "/features/community",
  },
  {
    title: "Economy & Games",
    description:
      "Build your own server economy with Nickel, cards, games, and community experiences.",
    href: "/features/economy",
  },
  {
    title: "Global",
    description:
      "Quill & Ink's global systems work together to keep your server experience consistent.",
    href: "/features/global",
  },
  {
    title: "Premium",
    description:
      "Unlock advanced plugins and enhanced features designed for servers that want more.",
    href: "/features/premium",
  },
];

const stars = [
  { left: "8%", top: "18%", delay: "0s", size: "text-xs" },
  { left: "17%", top: "72%", delay: "1.4s", size: "text-sm" },
  { left: "29%", top: "26%", delay: "2.2s", size: "text-[10px]" },
  { left: "72%", top: "20%", delay: "0.8s", size: "text-sm" },
  { left: "84%", top: "62%", delay: "1.8s", size: "text-xs" },
  { left: "91%", top: "31%", delay: "2.8s", size: "text-[10px]" },
  { left: "64%", top: "78%", delay: "1.1s", size: "text-xs" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061525] text-[#f5f7f8] selection:bg-[#65d9ee]/25 selection:text-[#ffffff]">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-22rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#174b72]/30 blur-3xl" />
        <div className="absolute left-[10%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-[#38bfd9]/[0.07] blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-12rem] h-[38rem] w-[38rem] rounded-full bg-[#123f69]/35 blur-3xl" />
        <div className="absolute right-[-14rem] top-[34%] h-[36rem] w-[36rem] rounded-full bg-[#315080]/20 blur-3xl" />
        <div className="absolute right-[15%] top-[8%] h-[20rem] w-[20rem] rounded-full bg-[#c6a15b]/[0.035] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#eafaff_0.6px,transparent_0.6px)] [background-size:24px_24px]" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-[#6da8c8]/15 bg-[#061525]/80 px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 py-5">
          <a
            href="/"
            className="group flex shrink-0 items-center gap-3 text-lg font-semibold tracking-wide"
          >
            <span className="text-[#72d8ed] transition group-hover:scale-110 group-hover:text-[#bceff7]">
              ✦
            </span>

            <span className="text-[#f5f7f8]">Quill & Ink</span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-[#91a9bd] sm:flex">
            <a
              href="/#features"
              className="transition hover:text-[#eafaff]"
            >
              Features
            </a>

            <a
              href="/pricing"
              className="transition hover:text-[#eafaff]"
            >
              Pricing
            </a>

            <a
              href="/#premium"
              className="transition hover:text-[#eafaff]"
            >
              Premium
            </a>

            <a
              href="/getting-started"
              className="transition hover:text-[#eafaff]"
            >
              Getting Started
            </a>

            <a
              href="/contact"
              className="transition hover:text-[#eafaff]"
            >
              Contact
            </a>
          </div>

          <a
            href={DISCORD_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-[#65d8eb]/55 bg-[#0a2539]/80 px-4 py-2 text-sm font-medium text-[#eafcff] transition hover:border-[#a9edf6] hover:bg-[#12344d]"
          >
            Add to Discord
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-77px)] items-center justify-center px-6 py-24">
        {/* Decorative stars */}
        <div className="pointer-events-none absolute inset-0">
          {stars.map((star, index) => (
            <span
              key={index}
              className={`absolute ${star.size} animate-pulse text-[#eefcff]/70 drop-shadow-[0_0_8px_rgba(105,221,240,0.35)]`}
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#62d8ed]/[0.09] shadow-[0_0_80px_rgba(70,197,222,0.025)] sm:h-[42rem] sm:w-[42rem]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9f7ff]/[0.055] sm:h-[34rem] sm:w-[34rem]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c6a15b]/[0.045] sm:h-[27rem] sm:w-[27rem]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.45em] text-[#78d9eb]">
            <span className="hidden h-px w-12 bg-gradient-to-r from-transparent to-[#6fd8ec]/60 sm:block" />
            <span>Discord • Community • Experience</span>
            <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-[#6fd8ec]/60 sm:block" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="whitespace-nowrap bg-gradient-to-b from-[#73dced]/[0.055] via-[#b8ecf5]/[0.025] to-transparent bg-clip-text text-[7rem] font-serif font-semibold tracking-[0.12em] text-transparent sm:text-[11rem] lg:text-[15rem]">
              Q&I
            </div>
          </div>

          <p className="mb-5 text-sm font-medium uppercase tracking-[0.5em] text-[#eaf8fb]/75">
            ✦ Welcome ✦
          </p>

          <h1 className="bg-gradient-to-r from-[#f7fbfc] via-[#bcecf5] to-[#d5b66e] bg-clip-text font-serif text-6xl font-semibold tracking-tight text-transparent drop-shadow-[0_0_35px_rgba(84,204,226,0.08)] sm:text-7xl lg:text-8xl">
            Quill & Ink
          </h1>

          <div className="mx-auto mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#67d8eb]/60" />
            <span className="text-[#f2fbfd]/80">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#d0b16b]/60" />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#b9cedb] sm:text-xl">
            A modular Discord bot built to bring moderation, community,
            economy, games, and more together in one place.
          </p>

          <div className="mt-11 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#76dcec]/60 bg-gradient-to-r from-[#4cbfd8] to-[#63d6e9] px-7 py-3.5 font-medium text-[#061525] shadow-[0_0_35px_rgba(76,191,216,0.12)] transition hover:border-[#b7f1f8] hover:from-[#69d8e9] hover:to-[#8be4f0]"
            >
              Add Quill & Ink to Discord
            </a>

            <a
              href="/getting-started"
              className="rounded-full border border-[#587c99]/70 bg-[#0a1b2e]/70 px-7 py-3.5 font-medium text-[#edf8fb] backdrop-blur-sm transition hover:border-[#d0b16b]/70 hover:bg-[#102b43]"
            >
              Get Started
            </a>
          </div>

          <div className="mt-16 text-xs uppercase tracking-[0.35em] text-[#718da3]">
            <span className="text-[#8fe3ef]">✦</span>
            <span className="mx-3">Written for communities</span>
            <span className="text-[#d0b16b]">✦</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative border-t border-[#6c9fbb]/10 px-6 py-28 sm:py-36"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#65d8eb]/55 to-transparent" />

        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#75d9eb]">
              <span>✦</span>
              <span>Features</span>
            </div>

            <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#f3f8fa] sm:text-5xl">
              Everything your server needs.
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-20 bg-gradient-to-r from-[#65d8eb]/50 to-[#c6a15b]/35" />
              <span className="text-xs text-[#75d9eb]/80">✦</span>
            </div>

            <p className="mt-6 text-lg leading-8 text-[#9db5c6]">
              Quill & Ink is designed as a collection of modular experiences,
              allowing each server to build the community experience it wants.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => {
              const card = (
                <article
                  className="group relative overflow-hidden rounded-2xl border border-[#47718c]/25 bg-[#0a1b2d]/80 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#63d7ea]/45 hover:bg-[#0d2238]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#55d2e8]/[0.045] blur-3xl transition group-hover:bg-[#55d2e8]/[0.09]" />

                  <div className="pointer-events-none absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-[#c6a15b]/[0.025] blur-3xl transition group-hover:bg-[#c6a15b]/[0.05]" />

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-lg text-[#e9fbff] drop-shadow-[0_0_8px_rgba(91,211,233,0.3)]">
                        ✦
                      </span>

                      <span className="text-xs tracking-[0.25em] text-[#68869d]">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-medium text-[#f2f8fa]">
                      {feature.title}
                    </h3>

                    <div className="mt-4 h-px w-12 bg-gradient-to-r from-[#63d7ea]/50 to-[#c6a15b]/35 transition-all duration-300 group-hover:w-20 group-hover:from-[#6edcec]/80 group-hover:to-[#d2b66e]/60" />

                    <p className="mt-5 leading-7 text-[#9db4c4]">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );

              return feature.href ? (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="block"
                >
                  {card}
                </a>
              ) : (
                <div key={feature.title}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Atmospheric divider */}
      <div className="px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5d8199]/25" />
          <span className="text-sm text-[#72d9eb]/75">✦</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c6a15b]/20" />
        </div>
      </div>

      {/* Premium */}
      <section id="premium" className="relative px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#63c9df]/25 bg-[#091a2c]">
            <div className="pointer-events-none absolute right-[-8rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#58d6e9]/[0.065] blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#174d7b]/30 blur-3xl" />

            <div className="pointer-events-none absolute right-[15%] bottom-[-8rem] h-[22rem] w-[22rem] rounded-full bg-[#c6a15b]/[0.035] blur-3xl" />

            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#78d9eb]">
                <span>✦</span>
                <span>Quill & Ink Premium</span>
              </div>

              <div className="mt-7 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="font-serif text-4xl font-semibold text-[#f3f8fa] sm:text-5xl">
                    Take your server further.
                  </h2>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-20 bg-gradient-to-r from-[#63d7ea]/55 to-[#c6a15b]/45" />
                    <span className="text-xs text-[#72d9eb]">✦</span>
                  </div>

                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[#a7bdcb]">
                    Unlock advanced plugins and features for servers looking
                    for more control, customization, and community
                    experiences.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#b8cbd6]">
                    <span>
                      <span className="mr-2 text-[#8ee3ef]">✦</span>
                      Advanced features
                    </span>

                    <span>
                      <span className="mr-2 text-[#8ee3ef]">✦</span>
                      Premium plugins
                    </span>

                    <span>
                      <span className="mr-2 text-[#d6b86f]">✦</span>
                      Greater control
                    </span>
                  </div>
                </div>

                <div className="relative min-w-[220px] overflow-hidden rounded-2xl border border-[#6ac9df]/25 bg-[#071525]/75 p-7 text-center backdrop-blur-sm lg:text-right">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#55d4e9]/10 blur-3xl" />

                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#7894a8]">
                      Premium Access
                    </p>

                    <p className="mt-3 bg-gradient-to-r from-[#f4fbfd] via-[#aee9f3] to-[#d8b96f] bg-clip-text font-serif text-5xl font-semibold text-transparent">
                      ₹350
                    </p>

                    <p className="mt-2 text-sm text-[#9aafbe]">
                      30 days of Premium
                    </p>

                    <a
                      href="/pricing"
                      className="mt-6 inline-block rounded-full border border-[#d0ae67]/70 bg-gradient-to-r from-[#c8a45d] to-[#dfc27d] px-7 py-3.5 font-medium text-[#071525] shadow-[0_0_25px_rgba(198,161,91,0.08)] transition hover:border-[#f0d994] hover:from-[#d8b86f] hover:to-[#ecd28e]"
                    >
                      View Premium
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="relative border-t border-[#56849d]/10 px-6 py-28 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#47718c]/25 bg-[#091a2c]">
            <div className="pointer-events-none absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#55d4e9]/[0.045] blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#c6a15b]/[0.035] blur-3xl" />

            <div className="relative flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#75d9eb]">
                  <span>✦</span>
                  <span>Getting Started</span>
                </div>

                <h2 className="mt-5 font-serif text-3xl font-semibold text-[#f3f8fa] sm:text-4xl">
                  Ready to bring Quill & Ink to your server?
                </h2>

                <p className="mt-5 text-lg leading-8 text-[#9db5c6]">
                  Start with the basics, configure the features you need, and
                  build your server experience from there.
                </p>
              </div>

              <a
                href="/getting-started"
                className="shrink-0 rounded-full border border-[#65d8eb]/55 bg-[#0a2539]/80 px-7 py-3.5 text-center font-medium text-[#eafcff] transition hover:border-[#a9edf6] hover:bg-[#12344d]"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative border-t border-[#56849d]/10 px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#75d9eb]">
            <span>✦</span>
            <span>Ready when you are</span>
            <span className="text-[#d0b16b]">✦</span>
          </div>

          <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#f3f8fa] sm:text-5xl">
            Give your community something more.
          </h2>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#63d7ea]/45" />
            <span className="text-xs text-[#75d9eb]/80">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#d0b16b]/40" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#9db5c5]">
            Quill & Ink is built to grow alongside your Discord community.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={DISCORD_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#76dcec]/60 bg-gradient-to-r from-[#4cbfd8] to-[#63d6e9] px-7 py-3.5 font-medium text-[#061525] shadow-[0_0_35px_rgba(76,191,216,0.1)] transition hover:border-[#b7f1f8] hover:from-[#69d8e9] hover:to-[#8be4f0]"
            >
              Add Quill & Ink to Discord
            </a>

            <a
              href="/contact"
              className="rounded-full border border-[#537c95]/60 bg-[#0a1b2d]/70 px-7 py-3.5 font-medium text-[#eef8fa] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
            >
              Contact Quill & Ink
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#5c8aa4]/15 bg-[#04101d] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 text-sm text-[#70899d]">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <a
                href="/"
                className="flex items-center gap-3 text-base font-semibold text-[#eaf8fb] transition hover:text-white"
              >
                <span className="text-[#70d9eb]">✦</span>
                <span>Quill & Ink</span>
              </a>

              <p className="mt-3 max-w-sm leading-6">
                A modular Discord bot built for communities, experiences, and
                more.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <a
                href="/#features"
                className="transition hover:text-[#eaf8fb]"
              >
                Features
              </a>

              <a
                href="/pricing"
                className="transition hover:text-[#eaf8fb]"
              >
                Pricing
              </a>

              <a
                href="/getting-started"
                className="transition hover:text-[#eaf8fb]"
              >
                Getting Started
              </a>

              <a
                href="/contact"
                className="transition hover:text-[#eaf8fb]"
              >
                Contact
              </a>

              <a
                href="/terms"
                className="transition hover:text-[#eaf8fb]"
              >
                Terms & Conditions
              </a>

              <a
                href="/privacy"
                className="transition hover:text-[#eaf8fb]"
              >
                Privacy Policy
              </a>

              <a
                href="/refunds"
                className="transition hover:text-[#eaf8fb]"
              >
                Cancellation & Refunds
              </a>

              <a
                href="/shipping"
                className="transition hover:text-[#eaf8fb]"
              >
                Shipping Policy
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#527991]/20" />
            <span className="text-xs text-[#71d9eb]/65">✦</span>
            <span className="h-px flex-1 bg-[#c6a15b]/15" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="mailto:quillandinkofficial@gmail.com"
              className="transition hover:text-[#eaf8fb]"
            >
              quillandinkofficial@gmail.com
            </a>

            <a
              href={DISCORD_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#537c95]/50 bg-[#0a1b2d]/70 px-4 py-2 text-[#dff8fc] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
            >
              <span className="text-[#72d9eb]">✦</span>
              Add to Discord
            </a>
          </div>

          <p className="text-xs text-[#536d80]">
            © {new Date().getFullYear()} Quill & Ink. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}