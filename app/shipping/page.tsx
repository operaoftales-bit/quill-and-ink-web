export default function ShippingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] px-6 py-20 text-[#f4f8ff]">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-[#176b9c]/20 blur-[140px]" />
        <div className="absolute -right-40 top-[35%] h-[34rem] w-[34rem] rounded-full bg-[#36c9e8]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#c6a15b]/[0.04] blur-[140px]" />

        <div className="absolute left-[8%] top-[14%] text-sm text-white/30">
          ✦
        </div>
        <div className="absolute right-[12%] top-[22%] text-xs text-[#73d9eb]/40">
          ✦
        </div>
        <div className="absolute left-[18%] top-[62%] text-xs text-white/20">
          ✦
        </div>
        <div className="absolute right-[20%] bottom-[18%] text-sm text-[#73d9eb]/25">
          ✦
        </div>
      </div>

      <article className="relative mx-auto max-w-4xl">
        <a
          href="/"
          className="text-sm text-[#9eb6ca] transition hover:text-[#73d9eb]"
        >
          ← Back to Quill & Ink
        </a>

        <div className="mt-10 rounded-3xl border border-[#6d89a3]/20 bg-[#081a2c]/75 p-8 shadow-[0_0_80px_rgba(40,180,220,0.05)] backdrop-blur-md sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
            Legal
          </p>

          <h1 className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
            Shipping Policy
          </h1>

          <p className="mt-4 text-sm text-[#8198ad]">
            Last Updated: September 14, 2026
          </p>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#73d9eb]/40 to-transparent" />
        </div>

        <div className="mt-12 space-y-10 leading-8 text-[#aebfce]">
          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              1. Digital Service
            </h2>

            <p className="mt-4">
              Quill & Ink is a digital software service provided through
              Discord. We do not sell physical products through this website.
            </p>

            <p className="mt-4">
              Because our services are digital, there are no physical
              shipments, shipping charges, delivery addresses, or courier
              deliveries associated with Quill & Ink Premium.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              2. Premium Delivery
            </h2>

            <p className="mt-4">
              Quill & Ink Premium provides digital access to Premium features
              for the applicable Discord server.
            </p>

            <p className="mt-4">
              After a successful payment is captured and verified, Premium
              access is provisioned digitally through the Quill & Ink service.
            </p>

            <p className="mt-4">
              No physical item is sent to the purchaser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              3. Delivery Time
            </h2>

            <p className="mt-4">
              Premium access is normally provisioned after successful payment
              verification.
            </p>

            <p className="mt-4">
              The exact time required may depend on payment-provider
              processing, Discord availability, and our service infrastructure.
            </p>

            <p className="mt-4">
              If Premium access does not appear after a successful payment,
              please contact us using the contact information provided on this
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              4. Shipping Charges
            </h2>

            <p className="mt-4">
              There are no shipping or delivery charges because Quill & Ink
              does not provide physical goods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              5. Delivery Information
            </h2>

            <p className="mt-4">
              Premium access is associated with the applicable Discord server
              and is delivered electronically through the Quill & Ink service.
            </p>

            <p className="mt-4">
              Customers are responsible for providing accurate information
              required to identify the relevant Discord server and complete
              their purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              6. Third-Party Services
            </h2>

            <p className="mt-4">
              Quill & Ink relies on third-party services such as Discord,
              payment providers, hosting providers, and other infrastructure
              providers.
            </p>

            <p className="mt-4">
              Delays caused by third-party outages or technical problems may
              affect digital service availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              7. Contact
            </h2>

            <p className="mt-4">
              If you have completed a Premium purchase but have not received
              access, please contact us using the contact information provided
              on this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              8. Changes to This Policy
            </h2>

            <p className="mt-4">
              We may update this Shipping Policy when necessary to reflect
              changes to our services or business practices.
            </p>

            <p className="mt-4">
              The latest version will always be published on this website with
              its updated date.
            </p>
          </section>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4 text-[#73d9eb]/50">
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#73d9eb]/40" />
          <span className="text-sm text-[#d0b16b]/70">✦</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#73d9eb]/40" />
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-[0.25em] text-[#6f879b]">
          Quill & Ink • Written for communities
        </p>
      </article>
    </main>
  );
}