
export default function RefundsPage() {
  const sections = [
    {
      title: "1. Overview",
      paragraphs: [
        "This Cancellation & Refunds Policy explains how cancellations, refunds, and payment-related issues are handled for Quill & Ink Premium.",
        "Please read this policy before purchasing Premium. By completing a purchase, you acknowledge this policy, subject to any rights that apply to you under the law."
      ]
    },
    {
      title: "2. Premium Access",
      paragraphs: [
        "Quill & Ink Premium is currently sold as a fixed-duration digital service.",
        "₹350 for 30 days of Premium access.",
        "Premium access begins after the payment has been successfully verified and the purchase has been processed.",
        "Premium does not automatically renew. If you want additional Premium time after your current period ends, you must make another purchase through the Premium option in the bot's /setup command."
      ],
      highlight: true
    },
    {
      title: "3. Cancellation",
      paragraphs: [
        "Because Premium is currently purchased for a fixed 30-day period, there is no recurring subscription to cancel.",
        "After a purchase is completed, the access period normally remains active until it expires, unless access is otherwise suspended or terminated under our Terms & Conditions.",
        "Choosing not to use Premium does not cancel the purchased period or automatically qualify the purchase for a refund.",
        "If you no longer want Premium, you can simply choose not to purchase another period."
      ]
    },
    {
      title: "4. Refund Policy",
      paragraphs: [
        "Premium purchases are generally non-refundable once the access has been successfully provisioned.",
        "We generally do not provide refunds solely because a user changes their mind, chooses not to use Premium, or uses only part of the purchased 30-day period.",
        "This general policy also applies when a user leaves a Discord server, is removed from a server, loses access to their Discord account or server, or does not configure or use the available Premium features.",
        "A refund is not normally provided merely because a feature does not meet a user's personal expectations.",
        "If Premium access is terminated because of a violation of our Terms & Conditions, the purchase does not automatically qualify for a refund.",
        "These conditions do not override any refund or other remedy required by applicable law. We will review payment errors, confirmed duplicate charges, and other exceptional circumstances separately."
      ]
    },
    {
      title: "5. Failed or Unsuccessful Payments",
      paragraphs: [
        "A payment that is declined, fails, is cancelled, or is not successfully confirmed does not qualify for Premium activation.",
        "If money appears to have been deducted but Premium has not been activated, please allow time for the payment provider to update the transaction status. Some payment statuses take time to resolve.",
        "If the transaction remains unresolved, contact our support team with the transaction reference and a description of the issue. We can review the information available to us and help determine the appropriate next step.",
        "If the payment provider confirms that the transaction failed and the amount is eligible for reversal, the reversal will generally be handled through the provider's payment process."
      ]
    },
    {
      title: "6. Duplicate Payments",
      paragraphs: [
        "If you believe you were charged more than once for a single Premium purchase, please contact us so the transactions can be checked.",
        "Include the relevant transaction references, dates, and amounts. Do not send passwords, full card numbers, banking credentials, or other sensitive payment information.",
        "We will review the available payment records and, where a duplicate charge is confirmed, work towards an appropriate resolution in accordance with the payment provider's process and applicable law."
      ]
    },
    {
      title: "7. Service Interruptions and Technical Problems",
      paragraphs: [
        "We aim to keep Quill & Ink reliable and available, but interruptions may occur because of maintenance, Discord outages, hosting or database issues, network problems, or failures involving third-party services.",
        "A temporary interruption does not automatically qualify a purchase for a refund.",
        "If a significant or prolonged problem prevents you from receiving the Premium service you purchased, contact support with details of the issue. We may review the circumstances and consider an appropriate resolution, subject to applicable law.",
        "Please understand that not every technical issue can be resolved immediately, particularly when it depends on Discord or another external provider."
      ]
    },
    {
      title: "8. Abuse, Fraud, and Policy Violations",
      paragraphs: [
        "We may suspend or terminate Premium access when reasonably necessary to address suspected fraud, payment manipulation, unauthorised access attempts, exploitation of bugs, abuse, or other violations of our Terms & Conditions.",
        "A suspension or termination resulting from a policy violation does not automatically qualify the purchase for a refund.",
        "This section does not remove any rights or remedies that cannot legally be excluded."
      ]
    },
    {
      title: "9. Your Legal Rights",
      paragraphs: [
        "Nothing in this policy is intended to remove, restrict, or replace any consumer, cancellation, refund, or other legal right that cannot lawfully be excluded or waived.",
        "Where applicable law requires a refund, replacement, additional service period, or another remedy, that legal requirement takes precedence over any conflicting part of this policy."
      ]
    },
    {
      title: "10. How to Contact Support",
      paragraphs: [
        "If you experience a payment failure, a possible duplicate charge, missing Premium access, or another purchase-related problem, contact us through the official Quill & Ink Support Server.",
        "Please provide your Discord user ID if relevant, the approximate purchase date, the transaction reference, and a short explanation of the issue. Share only the information needed to investigate your request.",
        "We will review the details available to us and explain the next steps. Contacting support does not guarantee that a refund will be approved."
      ]
    },
    {
      title: "11. Changes to This Policy",
      paragraphs: [
        "We may update this policy when Quill & Ink, its Premium offering, payment processes, or applicable requirements change.",
        "The latest version will be published on this website with its updated date. We encourage you to review the policy before making a purchase.",
        "Changes to this policy do not remove rights that already apply to a transaction under applicable law."
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
            Cancellation & Refunds
          </h1>

          <p className="mt-5 text-sm text-[#8198ad]">
            Last Updated: October 12, 2026
          </p>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#73d9eb]/40 to-transparent" />

          <p className="mt-7 max-w-2xl text-base leading-7 text-[#b9cbd9] sm:text-lg sm:leading-8">
            Clear information about Premium purchases, cancellations, and
            payment problems, so you know what to expect before you buy.
          </p>

          <div className="mt-7 rounded-2xl border border-[#d0b16b]/20 bg-[#d0b16b]/[0.05] p-5">
            <p className="text-sm font-semibold text-[#e8cb8c]">
              Premium at a glance
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#f7fbff]">
              ₹350 <span className="text-base font-normal text-[#b9cbd9]">/ 30 days</span>
            </p>

            <p className="mt-2 text-sm leading-6 text-[#aebfce]">
              Fixed-duration access. No automatic renewal. Purchases are
              generally non-refundable once access has been provisioned,
              subject to applicable law.
            </p>
          </div>
        </header>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#081a2c]/55 px-5 py-5 sm:px-7">
          <p className="text-sm leading-7 text-[#aebfce]">
            <span className="font-semibold text-[#f1f7ff]">
              Need help with a purchase?
            </span>{" "}
            If payment was deducted but Premium was not activated, or you
            believe you were charged twice, contact our support team so the
            transaction can be reviewed.
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

              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#aebfce] sm:text-base sm:leading-8">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      section.highlight && index === 1
                        ? "text-lg font-semibold text-[#d0b16b] sm:text-xl"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
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
              href="https://discord.gg/3qbKqxBJDa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#73d9eb] transition-colors hover:text-[#d0b16b]"
            >
              Contact Support ↗
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
