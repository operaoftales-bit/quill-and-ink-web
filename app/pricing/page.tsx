const DISCORD_INSTALL_URL =
  "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

const DISCORD_SUPPORT_URL = "https://discord.gg/v95scy728";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] px-6 py-20 text-[#f4f8ff]">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-[36rem] w-[36rem] rounded-full bg-[#176b9c]/20 blur-[150px]" />
        <div className="absolute right-[-12rem] top-[18%] h-[38rem] w-[38rem] rounded-full bg-[#36c9e8]/12 blur-[160px]" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.045] blur-[150px]" />

        <div className="absolute left-[7%] top-[18%] text-sm text-white/30">
          ✦
        </div>
        <div className="absolute right-[10%] top-[12%] text-xs text-[#73d9eb]/40">
          ✦
        </div>
        <div className="absolute bottom-[24%] left-[14%] text-xs text-[#73d9eb]/25">
          ✦
        </div>
        <div className="absolute bottom-[15%] right-[18%] text-sm text-white/20">
          ✦
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-5 border-b border-[#6d89a3]/15 pb-6">
          <a
            href="/"
            className="flex items-center gap-3 text-base font-semibold text-[#f4f8ff] transition hover:text-[#eafcff]"
          >
            <span className="text-[#73d9eb]">✦</span>
            <span>Quill & Ink</span>
          </a>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#91a9bd]">
            <a href="/" className="transition hover:text-[#eafaff]">
              Home
            </a>

            <a
              href="/#features"
              className="transition hover:text-[#eafaff]"
            >
              Features
            </a>

            <a
              href="/contact"
              className="transition hover:text-[#eafaff]"
            >
              Contact
            </a>

            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#eafaff]"
            >
              Support Server
            </a>

            <a
              href={DISCORD_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#65d8eb]/50 bg-[#0a2539]/70 px-4 py-2 font-medium text-[#eafcff] transition hover:border-[#a9edf6] hover:bg-[#12344d]"
            >
              Add to Discord
            </a>
          </div>
        </nav>

        <div className="mt-16 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
            Pricing
          </p>

          <h1 className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
            Simple, transparent pricing.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#aebfce]">
            Quill & Ink Premium gives your Discord server access to advanced
            features and greater customization for a fixed 30-day period.
          </p>
        </div>

        <section className="mt-16 max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#73d9eb]/25 bg-[#081a2c]/85 p-8 shadow-[0_0_100px_rgba(50,190,225,0.08)] backdrop-blur-md sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#36c9e8]/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#c6a15b]/[0.06] blur-[80px]" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#73d9eb]">
                  Quill & Ink Premium
                </p>

                <span className="rounded-full border border-[#d0b16b]/30 bg-[#d0b16b]/[0.06] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#d0b16b]">
                  Premium
                </span>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <span className="bg-gradient-to-r from-[#f7fbff] to-[#cfefff] bg-clip-text text-5xl font-semibold text-transparent">
                  ₹350
                </span>
                <span className="text-2xl font-medium text-[#73d9eb] line-through">
                </span>
                <span className="pb-1 text-[#8198ad]">/ 30 days</span>
              </div>

              <p className="mt-6 leading-7 text-[#aebfce]">
                Premium is a fixed-duration access plan. Your server receives
                Premium access for 30 days after the payment has been
                successfully verified.
              </p>

              <div className="mt-8 h-px bg-gradient-to-r from-[#73d9eb]/30 via-[#6d89a3]/20 to-transparent" />

              <div className="mt-8">
                <h2 className="text-xl font-medium text-[#f1f7ff]">
                  Premium includes
                </h2>

                <ul className="mt-5 space-y-3 text-[#aebfce]">
                  <li className="flex gap-3">
                    <span className="text-[#73d9eb]">✦</span>
                    <span>Access to Premium plugins and features</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-[#73d9eb]">✦</span>
                    <span>Advanced server customization options</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-[#73d9eb]">✦</span>
                    <span>Premium community and gameplay experiences</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-[#73d9eb]">✦</span>
                    <span>
                      Features designed for servers that want more control
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 rounded-2xl border border-[#6d89a3]/20 bg-[#061525]/70 p-5">
                <p className="text-sm leading-6 text-[#9eb6ca]">
                  Premium currently does not renew automatically. A new
                  purchase is required when your current 30-day access period
                  ends.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={DISCORD_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#73d9eb]/55 bg-gradient-to-r from-[#4cbfd8] to-[#63d6e9] px-6 py-3 text-center font-medium text-[#061525] transition hover:border-[#b7f1f8] hover:from-[#69d8e9] hover:to-[#8be4f0]"
                >
                  Add Quill & Ink to Discord
                </a>

                <a
                  href="/contact"
                  className="rounded-full border border-[#537c95]/60 bg-[#061525]/70 px-6 py-3 text-center font-medium text-[#eef8fa] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
                >
                  Questions?
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold text-[#f1f7ff]">
            Before purchasing
          </h2>

          <p className="mt-4 leading-7 text-[#aebfce]">
            Please review our Terms & Conditions, Privacy Policy, and
            Cancellation & Refunds Policy before purchasing Premium.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a
              href="/terms"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              Terms & Conditions →
            </a>

            <a
              href="/privacy"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              Privacy Policy →
            </a>

            <a
              href="/refunds"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              Cancellation & Refunds →
            </a>

            <a
              href="/shipping"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              Shipping Policy →
            </a>
          </div>
        </section>

        <footer className="mt-24 border-t border-[#6d89a3]/15 pt-8 text-sm text-[#71889b]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Questions about Premium or payments? Contact us at{" "}
              <a
                href="mailto:quillandinkofficial@gmail.com"
                className="text-[#73d9eb] transition hover:text-[#dff7ff]"
              >
                quillandinkofficial@gmail.com
              </a>
              .
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={DISCORD_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-full border border-[#537c95]/50 bg-[#0a1b2d]/70 px-4 py-2 text-[#dff8fc] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
              >
                Support Server
              </a>

              <a
                href={DISCORD_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-full border border-[#537c95]/50 bg-[#0a1b2d]/70 px-4 py-2 text-[#dff8fc] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
              >
                Add to Discord
              </a>
            </div>
          </div>
        </footer>

        <div className="mt-12 flex items-center justify-center gap-4 text-[#73d9eb]/50">
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#73d9eb]/40" />
          <span className="text-sm text-[#d0b16b]/70">✦</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#73d9eb]/40" />
        </div>
      </div>
    </main>
  );
}