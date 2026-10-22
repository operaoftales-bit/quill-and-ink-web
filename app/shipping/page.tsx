
export default function ShippingPage() {
  const sections = [
    {
      title: "1. Digital Service",
      paragraphs: [
        "Quill & Ink is a digital software service provided through Discord. We do not sell or ship physical products through this website.",
        "Because our services are digital, there are no physical packages, shipping fees, delivery addresses, or courier deliveries associated with Quill & Ink Premium."
      ]
    },
    {
      title: "2. Premium Delivery",
      paragraphs: [
        "Quill & Ink Premium provides time-limited access to Premium features for the applicable Discord server.",
        "After a payment is successfully verified and processed, Premium access is provisioned digitally through the Quill & Ink service.",
        "No physical item is sent to the purchaser. Digital delivery takes place through the bot and its supporting systems."
      ]
    },
    {
      title: "3. Delivery Time",
      paragraphs: [
        "Premium access is normally provisioned after successful payment verification and processing.",
        "The time required may vary depending on payment-provider confirmation, Discord availability, and the operation of our service infrastructure.",
        "If your payment is successful but Premium access does not appear, please contact our support team with your transaction reference and the relevant Discord server information. We can review the available details and help resolve the issue.",
        "Please do not make another purchase simply because activation is delayed until you have checked the original transaction's status."
      ]
    },
    {
      title: "4. Shipping and Delivery Charges",
      paragraphs: [
        "There are no physical shipping or courier charges because Quill & Ink does not deliver physical goods.",
        "Any price or payment-related charge associated with a Premium purchase will be shown or handled through the applicable checkout process. Payment-provider terms may apply."
      ]
    },
    {
      title: "5. Delivery Information",
      paragraphs: [
        "Premium access is associated with the applicable Discord server and is delivered electronically through the Quill & Ink service.",
        "Customers are responsible for selecting or identifying the correct Discord server and providing the information needed to complete and verify their purchase.",
        "Please check the selected server and purchase details carefully before completing payment. If you believe you selected the wrong server or provided incorrect information, contact support as soon as possible."
      ]
    },
    {
      title: "6. Third-Party Services",
      paragraphs: [
        "Quill & Ink relies on third-party services, including Discord, payment providers, hosting providers, and supporting infrastructure.",
        "Outages, payment-processing delays, network interruptions, or technical problems involving these services may affect the timing or availability of Premium access.",
        "If a third-party issue affects your purchase, contact support so we can review the situation and explain the available next steps."
      ]
    },
    {
      title: "7. Support and Delivery Issues",
      paragraphs: [
        "If you have completed a Premium purchase but have not received access, please contact us through the official Quill & Ink Support Server.",
        "To help us investigate, provide your transaction reference, approximate payment date, and the Discord server involved. Do not share passwords, full card details, banking credentials, or other sensitive payment information.",
        "We will review the information available to us and help determine whether the payment was confirmed and whether Premium access was successfully provisioned."
      ]
    },
    {
      title: "8. Changes to This Policy",
      paragraphs: [
        "We may update this Shipping Policy when our services, delivery process, or business practices change.",
        "The latest version will be published on this website with its updated date. We encourage customers to review it when necessary."
      ]
    }
  ];

  return (
      <main className="relative min-h-screen overflow-hidden px-5 py-14 text-[#f4f8ff] sm:px-6 sm:py-20">

      <article className="relative mx-auto max-w-4xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#9eb6ca] transition-colors hover:text-[#73d9eb]"
        >
          <span aria-hidden="true">←</span>
          Back to Quill & Ink
        </a>

        <header className="mt-8 rounded-3xl border border-[#6d89a3]/20 bg-[#081a2c]/75 p-6 shadow-[0_0_80px_rgba(40,180,220,0.05)] backdrop-blur-md sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#73d9eb]">
            Legal
          </p>

          <h1 className="mt-4 bg-gradient-to-r from-[#f7fbff] via-[#cfefff] to-[#d0b16b] bg-clip-text font-serif text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Shipping Policy
          </h1>

          <p className="mt-5 text-sm text-[#8198ad]">
            Last Updated: October 12, 2026
          </p>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#73d9eb]/40 to-transparent" />

          <p className="mt-7 max-w-2xl text-base leading-7 text-[#b9cbd9] sm:text-lg sm:leading-8">
            Quill & Ink delivers Premium digitally through Discord. Here is
            how activation works and what to do if your access is delayed.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-[#9eb6ca]">Delivery type</p>
            <p className="mt-2 text-lg font-medium text-[#f1f7ff]">
              Digital access
            </p>
            <p className="mt-2 text-sm leading-6 text-[#aebfce]">
              Premium features are provisioned through the bot after payment
              verification.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-[#9eb6ca]">Shipping charges</p>
            <p className="mt-2 text-lg font-medium text-[#f1f7ff]">
              None
            </p>
            <p className="mt-2 text-sm leading-6 text-[#aebfce]">
              No physical products, parcels, or courier deliveries are
              involved.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#73d9eb]/15 bg-[#081a2c]/60 px-5 py-5 sm:px-7">
          <p className="text-sm font-semibold text-[#f1f7ff]">
            Paid, but Premium is not active?
          </p>

          <p className="mt-2 text-sm leading-7 text-[#aebfce]">
            Check the status of your original transaction first. If payment
            was successful and access is still missing, contact support with
            your transaction reference. Avoid making a second payment just
            because activation is delayed.
          </p>

          <a
            href="https://discord.gg/3qbKqxBJDa"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#73d9eb] transition-colors hover:text-[#d0b16b]"
          >
            Visit the Support Server
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-6 sm:px-8 sm:py-7"
            >
              <h2 className="font-serif text-xl font-medium leading-snug text-[#f1f7ff] sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#b4c4d2] sm:text-base sm:leading-8">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-white/[0.09] pt-8 text-center">
          <div className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-[#73d9eb]/60 to-transparent" />

          <p className="font-serif text-lg text-[#dce9f4]">
            Quill & Ink
          </p>

          <p className="mt-2 text-sm text-[#8198ad]">
            Written for communities. Built with care.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm">
            <a
              href="/terms"
              className="text-[#9eb6ca] transition-colors hover:text-[#73d9eb]"
            >
              Terms & Conditions
            </a>

            <a
              href="/privacy"
              className="text-[#9eb6ca] transition-colors hover:text-[#73d9eb]"
            >
              Privacy Policy
            </a>

            <a
              href="/refunds"
              className="text-[#9eb6ca] transition-colors hover:text-[#73d9eb]"
            >
              Cancellation & Refunds
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
