const DISCORD_SUPPORT_URL = "https://discord.gg/v95scy728";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] px-6 py-20 text-[#f4f8ff]">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-[36rem] w-[36rem] rounded-full bg-[#176b9c]/20 blur-[150px]" />
        <div className="absolute right-[-12rem] top-[25%] h-[38rem] w-[38rem] rounded-full bg-[#36c9e8]/12 blur-[160px]" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.04] blur-[150px]" />

        <div className="absolute left-[8%] top-[18%] text-sm text-white/30">
          ✦
        </div>
        <div className="absolute right-[10%] top-[12%] text-xs text-[#73d9eb]/40">
          ✦
        </div>
        <div className="absolute left-[15%] bottom-[22%] text-xs text-[#73d9eb]/25">
          ✦
        </div>
        <div className="absolute right-[18%] bottom-[14%] text-sm text-white/20">
          ✦
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-[#9eb6ca] transition hover:text-[#73d9eb]"
        >
          ← Back to Quill & Ink
        </a>

        <div className="mt-16 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
            Contact
          </p>

          <h1 className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
            Get in touch.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#aebfce]">
            Have a question about Quill & Ink, Premium, payments, or the
            service? We&apos;re happy to hear from you.
          </p>
        </div>

        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          <article className="group relative overflow-hidden rounded-3xl border border-[#73d9eb]/20 bg-[#081a2c]/80 p-8 shadow-[0_0_70px_rgba(50,190,225,0.04)] backdrop-blur-md transition duration-300 hover:border-[#73d9eb]/35 hover:shadow-[0_0_80px_rgba(50,190,225,0.08)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#36c9e8]/10 blur-[70px]" />

            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#73d9eb]">
                Email
              </p>

              <h2 className="mt-4 text-2xl font-medium text-[#f1f7ff]">
                Quill & Ink Support
              </h2>

              <p className="mt-4 leading-7 text-[#aebfce]">
                For general questions, Premium enquiries, payment questions, or
                other service-related matters.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:quillandinkofficial@gmail.com"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-[#73d9eb] to-[#b8f0fa] px-6 py-3 font-medium text-[#061525] transition hover:brightness-110"
                >
                  Email us
                </a>

                <a
                  href={DISCORD_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-[#73d9eb]/35 px-6 py-3 font-medium text-[#73d9eb] transition hover:border-[#73d9eb]/70 hover:bg-[#73d9eb]/[0.06] hover:text-[#dff7ff]"
                >
                  Support Server
                </a>
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-3xl border border-[#d0b16b]/20 bg-[#081a2c]/80 p-8 shadow-[0_0_70px_rgba(50,190,225,0.04)] backdrop-blur-md transition duration-300 hover:border-[#d0b16b]/35 hover:shadow-[0_0_80px_rgba(198,161,91,0.07)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#d0b16b]/[0.06] blur-[70px]" />

            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#d0b16b]">
                Premium & Payments
              </p>

              <h2 className="mt-4 text-2xl font-medium text-[#f1f7ff]">
                Need help with a purchase?
              </h2>

              <p className="mt-4 leading-7 text-[#aebfce]">
                If you have a question about Premium access, a payment, or a
                transaction, contact us using the email address provided here.
              </p>

              <a
                href="/pricing"
                className="mt-6 inline-flex items-center rounded-full border border-[#d0b16b]/35 px-6 py-3 font-medium text-[#d0b16b] transition hover:border-[#d0b16b]/70 hover:bg-[#d0b16b]/[0.06]"
              >
                View Pricing
              </a>
            </div>
          </article>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold text-[#f1f7ff]">
            <span className="mr-2 text-[#73d9eb]">✦</span>
            Before contacting us
          </h2>

          <p className="mt-4 leading-7 text-[#aebfce]">
            For questions about purchases, refunds, privacy, or use of the
            service, you may also find the answer in our policies.
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
          <p>
            Quill & Ink is a digital service. For support or business
            enquiries, contact us at{" "}
            <a
              href="mailto:quillandinkofficial@gmail.com"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              quillandinkofficial@gmail.com
            </a>
            .
          </p>

          <p className="mt-3">
            You may also join our{" "}
            <a
              href={DISCORD_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#73d9eb] transition hover:text-[#dff7ff]"
            >
              Support Server
            </a>{" "}
            on Discord for assistance.
          </p>
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