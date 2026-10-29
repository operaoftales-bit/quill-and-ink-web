
export default function TermsPage() {
  const sections = [
    {
      title: "1. About Quill & Ink",
      paragraphs: [
        "Quill & Ink is a Discord bot that provides community tools, moderation, economy features, games, automation, and other server features.",
        "Features may be updated, changed, added, restricted, or discontinued as the project develops. The availability of a particular feature is not guaranteed indefinitely."
      ]
    },
    {
      title: "2. Discord Terms and Policies",
      paragraphs: [
        "Your use of Quill & Ink is also subject to Discord's applicable Terms of Service, Community Guidelines, Developer Policy, and other relevant rules.",
        "You must not use Quill & Ink in a way that violates Discord's rules or applicable law.",
        "Discord independently manages its platform and accounts. We cannot control Discord's decisions to restrict, suspend, or terminate an account or server."
      ]
    },
    {
      title: "3. Acceptable Use",
      paragraphs: [
        "You agree to use Quill & Ink responsibly, lawfully, and in accordance with these Terms.",
        "You must not use Quill & Ink to:"
      ],
      bullets: [
        "Conduct, facilitate, or promote illegal activities.",
        "Harass, threaten, abuse, or deliberately target other users.",
        "Distribute malware, malicious software, or other harmful content.",
        "Damage, disrupt, overload, or interfere with the bot or its infrastructure.",
        "Attempt to gain unauthorised access to the bot, its database, infrastructure, accounts, or related systems.",
        "Bypass Premium restrictions, payment verification, access controls, rate limits, or other security measures.",
        "Exploit bugs or vulnerabilities for abuse, financial gain, or unauthorised access.",
        "Forge or manipulate payment, transaction, entitlement, or webhook information.",
        "Copy, modify, reverse engineer, or redistribute proprietary components except where expressly permitted by applicable law.",
        "Abuse automated requests or deliberately generate excessive traffic.",
        "Use the service to facilitate scams, fraud, phishing, or other deceptive activities.",
        "Use the service in ways that could reasonably harm Quill & Ink, its users, Discord, or third-party services."
      ],
      after: [
        "Finding a bug does not give you permission to exploit it. Please report suspected security issues responsibly through our support channels."
      ]
    },
    {
      title: "4. Server Owner and Administrator Responsibilities",
      paragraphs: [
        "Server owners and administrators are responsible for how Quill & Ink is configured and used within their Discord servers.",
        "You are responsible for choosing appropriate settings, reviewing the permissions granted to the bot, and ensuring that your server's use of the service complies with Discord's rules and applicable law.",
        "Server administrators should also consider how enabled features affect their members and what information may be visible through server channels or bot interactions.",
        "Quill & Ink does not automatically endorse or take responsibility for content submitted by individual Discord users."
      ]
    },
    {
      title: "5. Premium Services",
      paragraphs: [
        "Quill & Ink may offer paid Premium features for eligible Discord servers.",
        "The current Premium price is ₹350 / around $4 for 30 days of access.",
        "Premium access is associated with the applicable Discord server and is subject to successful payment verification, activation, and the availability of the relevant features.",
        "Premium does not automatically renew. If you want additional access after the purchased period expires, you must make another purchase through the Premium option in the bot's /setup command.",
        "Purchasing Premium does not give you ownership of Quill & Ink, its software, branding, infrastructure, or intellectual property.",
        "Premium features may be updated, changed, restricted, or discontinued when reasonably necessary. This does not remove any rights or remedies that cannot legally be excluded."
      ],
      highlight: "₹350/~$4 for 30 days"
    },
    {
      title: "6. Payments",
      paragraphs: [
        "Payments for Premium are handled through the payment provider used at checkout.",
        "You are responsible for checking your purchase details and providing the information required to complete the transaction.",
        "Payment processing, verification, and transaction records may be subject to the payment provider's own terms and policies.",
        "Quill & Ink should not receive your full payment-card or banking credentials through ordinary bot commands or support messages. The payment information handled by our systems depends on the checkout integration and the information returned by the provider.",
        "A payment must be successfully verified before Premium access can be activated. If you encounter a payment problem, contact support rather than repeatedly submitting the same purchase."
      ]
    },
    {
      title: "7. Cancellation and Refunds",
      paragraphs: [
        "Premium purchases are generally non-refundable once access has been successfully provisioned, subject to applicable law.",
        "We generally do not provide refunds solely because a user:"
      ],
      bullets: [
        "Changes their mind after purchasing Premium.",
        "Does not use the available Premium features.",
        "Uses only part of the purchased period.",
        "Leaves or is removed from a Discord server.",
        "Loses access to their Discord account or server.",
        "Has their Discord account or server restricted.",
        "Does not configure or use the available Premium features.",
        "Has Premium access terminated because of a violation of these Terms."
      ],
      after: [
        "Payment failures, confirmed duplicate charges, and other exceptional circumstances may require individual review.",
        "Nothing in these Terms overrides a refund, cancellation, or consumer right that cannot legally be excluded. See our Cancellation & Refunds Policy for more information."
      ]
    },
    {
      title: "8. Suspension and Termination",
      paragraphs: [
        "We may restrict, suspend, or terminate access to Quill & Ink, including Premium access, if we reasonably believe that:"
      ],
      bullets: [
        "These Terms or applicable Discord rules have been violated.",
        "The service has been abused or deliberately exploited.",
        "Someone has attempted to bypass security or Premium restrictions.",
        "Fraudulent, unlawful, or unauthorised activity has occurred.",
        "The activity creates a significant risk to the service, its users, or its infrastructure."
      ],
      after: [
        "Where appropriate, we may temporarily restrict access while investigating a suspected security incident or serious abuse.",
        "Suspension or termination resulting from a violation does not automatically entitle a user to a refund. Applicable legal rights remain unaffected."
      ]
    },
    {
      title: "9. Service Availability",
      paragraphs: [
        "We aim to keep Quill & Ink reliable and available, but uninterrupted or error-free operation cannot be guaranteed.",
        "The service may occasionally be unavailable or limited because of maintenance, updates, hosting or database problems, Discord outages or API limitations, third-party failures, security incidents, or circumstances beyond our reasonable control.",
        "We may modify, maintain, or temporarily suspend parts of the service when necessary to protect or maintain its operation.",
        "We will make reasonable efforts to address issues, but we cannot guarantee a particular resolution time."
      ]
    },
    {
      title: "10. Third-Party Services",
      paragraphs: [
        "Quill & Ink relies on third-party services, which may include Discord, payment providers, hosting providers, database services, and other infrastructure.",
        "These services operate independently and may change their features, terms, availability, or policies.",
        "We cannot control every aspect of third-party services or guarantee their continued availability. Your use of those services remains subject to their own applicable terms and policies."
      ]
    },
    {
      title: "11. Intellectual Property",
      paragraphs: [
        "Quill & Ink's original software, branding, design, documentation, and proprietary components belong to their respective owners unless otherwise stated.",
        "You may use Quill & Ink through the service as intended. Doing so does not transfer ownership or intellectual property rights to you.",
        "You must not copy, sell, redistribute, or commercially exploit proprietary parts of Quill & Ink without permission, except where applicable law allows it.",
        "Nothing in this section is intended to remove rights that users have under applicable law."
      ]
    },
    {
      title: "12. User Content",
      paragraphs: [
        "You retain whatever rights you hold in the original content you create or submit through Discord, subject to any rights or restrictions that already apply to that content.",
        "When you use a Quill & Ink feature that processes your content, you allow the service to handle that content only as reasonably necessary to provide the requested feature, operate the service, and maintain its security.",
        "Quill & Ink does not claim ownership of your original stories, messages, images, or other user-created content merely because you use the bot.",
        "You are responsible for ensuring that content you submit is lawful and does not violate another person's rights or Discord's rules."
      ]
    },
    {
      title: "13. Limitation of Liability",
      paragraphs: [
        "To the extent permitted by applicable law, Quill & Ink and its operators are not responsible for indirect or consequential losses arising from the use of, inability to use, or interruption of the service.",
        "Examples may include losses connected with Discord outages, third-party service failures, server configuration mistakes, loss of access to a Discord account or server, or misuse of the service.",
        "This section does not exclude or limit liability where doing so would be unlawful. Your rights under applicable law remain unaffected."
      ]
    },
    {
      title: "14. Changes to These Terms",
      paragraphs: [
        "We may update these Terms as Quill & Ink, its features, or its operating requirements change.",
        "The latest version will be published on this website with its updated date. We encourage you to review the Terms periodically, particularly before making a Premium purchase.",
        "Where appropriate, significant changes may be communicated through our available channels.",
        "Changes to these Terms do not remove rights or protections that already apply under applicable law."
      ]
    },
    {
      title: "15. Contact",
      paragraphs: [
        "If you have questions about these Terms, Premium access, or the operation of Quill & Ink, please contact us through the official support server."
      ],
      support: true
    },
    {
      title: "16. Acceptance",
      paragraphs: [
        "By adding, accessing, or using Quill & Ink, you acknowledge that you have had the opportunity to read these Terms.",
        "If you do not agree with these Terms, please stop using the service. A Premium purchase is also subject to the applicable purchase and refund policies."
      ]
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-14 text-[#f5f7f8] selection:bg-[#65d9ee]/25 selection:text-white sm:px-6 sm:py-20">

      <article className="relative mx-auto max-w-4xl">
        <a
          href="/"
          className="group inline-flex items-center gap-3 text-sm text-[#8faabd] transition-colors hover:text-[#eafaff]"
        >
          <span className="text-[#70d9eb] transition-transform group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to Quill & Ink</span>
        </a>

        <header className="relative mt-8 overflow-hidden rounded-3xl border border-[#56859f]/20 bg-[#091b2d]/75 p-6 shadow-[0_0_80px_rgba(40,180,220,0.05)] backdrop-blur-sm sm:mt-10 sm:p-10 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#55d5e8]/[0.055] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#c6a15b]/[0.025] blur-3xl"
          />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#73d9eb]">
              Legal
            </p>

            <h1 className="mt-5 bg-gradient-to-r from-[#f5fafb] via-[#c4edf4] to-[#d4b66d] bg-clip-text font-serif text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 text-sm text-[#8198ad]">
              Last Updated: October 29, 2026
            </p>

            <div className="mt-8 h-px bg-gradient-to-r from-[#69d9eb]/50 via-white/[0.08] to-transparent" />

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#b9cbd9] sm:text-lg sm:leading-8">
              These Terms explain the rules for using Quill & Ink, including
              its community features, Premium access, and supporting services.
            </p>
          </div>
        </header>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#091b2d]/55 px-5 py-5 sm:px-7">
          <p className="text-sm leading-7 text-[#aebfce]">
            <span className="font-semibold text-[#f1f8fa]">
              Using Premium?
            </span>{" "}
            Premium currently costs ₹350 / around $4 for 30 days and does not automatically
            renew. Please review our{" "}
            <a
              href="/refunds"
              className="text-[#73d9eb] underline decoration-[#73d9eb]/30 underline-offset-4 transition-colors hover:text-[#d0b16b]"
            >
              Cancellation & Refunds Policy
            </a>{" "}
            before purchasing.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-6 sm:px-8 sm:py-7"
            >
              <h2 className="font-serif text-xl font-medium leading-snug text-[#f1f8fa] sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#b4c4d2] sm:text-base sm:leading-8">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      section.highlight && index === 0
                        ? "font-semibold text-[#d8bd78]"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="space-y-3 pt-1">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-sm text-[#70d9eb]"
                        >
                          ✦
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.after?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.support && (
                  <a
                    href="https://discord.gg/3qbKqxBJDa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#537c95]/60 bg-[#0a1b2d]/70 px-5 py-2.5 text-sm font-medium text-[#eaf8fb] transition-colors hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
                  >
                    <span className="text-[#72d9eb]">✦</span>
                    Join Support Server
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-white/[0.09] pt-8 text-center">
          <div className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-[#70d9eb]/60 to-transparent" />

          <p className="font-serif text-lg text-[#dce9f4]">
            Quill & Ink
          </p>

          <p className="mt-2 text-sm text-[#8198ad]">
            Written for communities. Built with care.
          </p>

          <nav
            aria-label="Legal pages"
            className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm"
          >
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
            <a
              href="/shipping"
              className="text-[#9eb6ca] transition-colors hover:text-[#73d9eb]"
            >
              Shipping Policy
            </a>
          </nav>
        </footer>
      </article>
    </main>
  );
}
