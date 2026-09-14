export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061525] px-6 py-20 text-[#f5f7f8] selection:bg-[#65d9ee]/25 selection:text-white">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#174b72]/30 blur-3xl" />

        <div className="absolute left-[-12rem] top-[30%] h-[32rem] w-[32rem] rounded-full bg-[#38bfd9]/[0.055] blur-3xl" />

        <div className="absolute bottom-[-18rem] right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-[#123f69]/35 blur-3xl" />

        <div className="absolute right-[12%] top-[12%] h-[20rem] w-[20rem] rounded-full bg-[#c6a15b]/[0.025] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#eafaff_0.6px,transparent_0.6px)] [background-size:24px_24px]" />
      </div>

      {/* Decorative stars */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <span className="absolute left-[9%] top-[18%] text-xs text-[#eafcff]/50">
          ✦
        </span>

        <span className="absolute left-[18%] top-[68%] text-sm text-[#70d9eb]/40">
          ✦
        </span>

        <span className="absolute right-[12%] top-[24%] text-xs text-[#d9f8fc]/50">
          ✦
        </span>

        <span className="absolute right-[7%] top-[61%] text-sm text-[#d0b16b]/40">
          ✦
        </span>
      </div>

      {/* Page */}
      <article className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <a
          href="/"
          className="group inline-flex items-center gap-3 text-sm text-[#8faabd] transition hover:text-[#eafaff]"
        >
          <span className="text-[#70d9eb] transition group-hover:-translate-x-1">
            ←
          </span>

          <span>Back to Quill & Ink</span>
        </a>

        {/* Header */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-[#56859f]/20 bg-[#091b2d]/65 p-8 backdrop-blur-sm sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#55d5e8]/[0.055] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#c6a15b]/[0.025] blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#73d9eb]">
              <span>✦</span>
              <span>Legal</span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-16 bg-gradient-to-r from-[#69d9eb]/60 to-transparent" />

              <span className="text-xs text-[#d0b16b]/70">✦</span>
            </div>

            <h1 className="mt-6 bg-gradient-to-r from-[#f5fafb] via-[#c4edf4] to-[#d4b66d] bg-clip-text font-serif text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 text-sm text-[#718da2]">
              Last Updated: September 14, 2026
            </p>
          </div>
        </div>

        {/* Legal content */}
        <div className="mt-12 space-y-12 text-[#a9bdca] leading-8">
          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              1. About Quill & Ink
            </h2>

            <p className="mt-4">
              Quill & Ink is a Discord bot providing community, moderation,
              economy, games, automation, and other Discord server features.
              Features may change, be added, removed, modified, or
              discontinued over time.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              2. Discord Terms and Policies
            </h2>

            <p className="mt-4">
              Your use of Quill & Ink is also subject to Discord&apos;s
              applicable Terms of Service, Community Guidelines, Developer
              Policy, and other applicable Discord rules and policies.
            </p>

            <p className="mt-4">
              You must not use Quill & Ink in a way that violates Discord&apos;s
              rules or policies.
            </p>

            <p className="mt-4">
              If Discord restricts, suspends, terminates, or otherwise limits
              your account or server, Quill & Ink is not responsible for that
              action.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              3. Acceptable Use
            </h2>

            <p className="mt-4">
              You agree to use Quill & Ink responsibly and only for legitimate
              purposes.
            </p>

            <p className="mt-4">You must not use Quill & Ink to:</p>

            <ul className="mt-4 space-y-3 pl-1">
              {[
                "Conduct, facilitate, or promote illegal activities.",
                "Harass, threaten, abuse, or target other users.",
                "Distribute malicious software, malware, viruses, or harmful content.",
                "Attempt to damage, disrupt, overload, or interfere with the bot or its infrastructure.",
                "Attempt to gain unauthorized access to Quill & Ink, its database, infrastructure, accounts, or other systems.",
                "Attempt to bypass Premium restrictions, payment verification, access controls, rate limits, or other security mechanisms.",
                "Exploit bugs or vulnerabilities for abuse, financial gain, or unauthorized access.",
                "Manipulate, forge, or interfere with payment, transaction, entitlement, or webhook information.",
                "Reverse engineer, modify, copy, or redistribute Quill & Ink or its proprietary components except where expressly permitted by applicable law.",
                "Use automated systems or other methods to abuse the service or intentionally generate excessive traffic or requests.",
                "Use Quill & Ink to facilitate scams, fraud, phishing, or other deceptive activity.",
                "Use the service in a manner that could reasonably harm Quill & Ink, its users, Discord, or third-party services.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#72d9eb]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              Finding a bug does not give you permission to exploit it. Please
              report security issues responsibly.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              4. Server Owner and Administrator Responsibility
            </h2>

            <p className="mt-4">
              Server owners and administrators are responsible for how Quill &
              Ink is configured and used within their Discord servers.
            </p>

            <p className="mt-4">
              You are responsible for ensuring that your server&apos;s use of
              Quill & Ink complies with Discord&apos;s rules and applicable law.
            </p>

            <p className="mt-4">
              Quill & Ink does not take responsibility for content created or
              submitted by individual Discord users.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              5. Premium Services
            </h2>

            <p className="mt-4">
              Quill & Ink may provide Premium features for eligible Discord
              servers.
            </p>

            <p className="mt-4">
              The current Premium price is:
            </p>

            <p className="mt-4 font-serif text-2xl font-semibold text-[#d8bd78]">
              ₹700 for 30 days of Premium access.
            </p>

            <p className="mt-4">
              Premium access is associated with the applicable Discord server
              and is subject to the Premium system&apos;s rules and
              availability.
            </p>

            <p className="mt-4">
              Premium access does not grant ownership of Quill & Ink or any of
              its software, intellectual property, infrastructure, or
              underlying systems.
            </p>

            <p className="mt-4">
              Premium features may be changed, improved, restricted, or
              discontinued when reasonably necessary.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              6. Payments
            </h2>

            <p className="mt-4">
              Payments for Premium services are processed through our
              third-party payment provider.
            </p>

            <p className="mt-4">
              You are responsible for providing accurate information when
              completing a purchase.
            </p>

            <p className="mt-4">
              We do not store your complete payment-card or banking credentials
              on Quill & Ink&apos;s own systems when payment processing is
              handled by the payment provider.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              7. Refund Policy
            </h2>

            <p className="mt-4 font-medium text-[#f1f8fa]">
              Premium purchases are generally non-refundable.
            </p>

            <p className="mt-4">
              Once Premium access has been purchased and provisioned, we
              generally do not provide refunds for:
            </p>

            <ul className="mt-4 space-y-3 pl-1">
              {[
                "Change of mind.",
                "Failure to use the Premium features.",
                "Unused Premium time.",
                "Leaving or being removed from a Discord server.",
                "Losing access to a Discord account or server.",
                "Discord account or server restrictions.",
                "Failure to configure or use Premium features.",
                "Removal of a server's Premium access because of a violation of these Terms.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#72d9eb]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              This does not limit any refund, cancellation, or consumer rights
              that cannot legally be excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              8. Suspension and Termination
            </h2>

            <p className="mt-4">
              We may suspend or terminate access to Quill & Ink, including
              Premium access, if we reasonably believe that you:
            </p>

            <ul className="mt-4 space-y-3 pl-1">
              {[
                "Violated these Terms.",
                "Violated Discord's applicable rules or policies.",
                "Abused or attempted to exploit the service.",
                "Attempted to bypass security or Premium restrictions.",
                "Engaged in fraudulent or unlawful activity.",
                "Created a significant risk to the service, other users, or our infrastructure.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#72d9eb]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              Where appropriate, we may also restrict access while
              investigating suspected abuse or security incidents.
            </p>

            <p className="mt-4">
              Termination or suspension resulting from a violation of these
              Terms does not automatically create a right to a refund.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              9. Service Availability
            </h2>

            <p className="mt-4">
              We aim to keep Quill & Ink available and reliable, but we do not
              guarantee uninterrupted service.
            </p>

            <p className="mt-4">
              The service may occasionally be unavailable because of:
            </p>

            <ul className="mt-4 space-y-3 pl-1">
              {[
                "Maintenance.",
                "Updates.",
                "Infrastructure or hosting problems.",
                "Discord outages or API limitations.",
                "Third-party service failures.",
                "Security incidents.",
                "Circumstances beyond our reasonable control.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#72d9eb]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5">
              We may modify or temporarily suspend parts of the service when
              necessary.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              10. Third-Party Services
            </h2>

            <p className="mt-4">
              Quill & Ink may depend on third-party services, including
              Discord, payment providers, hosting providers, databases, and
              other infrastructure providers.
            </p>

            <p className="mt-4">
              We are not responsible for outages, policy changes, restrictions,
              or failures caused by third-party services.
            </p>

            <p className="mt-4">
              Your use of third-party services remains subject to their own
              terms and policies.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              11. Intellectual Property
            </h2>

            <p className="mt-4">
              Quill & Ink, including its branding, software, original content,
              design, and proprietary systems, belongs to its respective owners
              unless otherwise stated.
            </p>

            <p className="mt-4">
              You may use Quill & Ink through the service as intended, but such
              use does not transfer ownership or intellectual property rights to
              you.
            </p>

            <p className="mt-4">
              You must not copy, sell, redistribute, or commercially exploit
              proprietary parts of Quill & Ink without permission.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              12. User Content
            </h2>

            <p className="mt-4">
              You retain ownership of content that you create and submit
              through Discord.
            </p>

            <p className="mt-4">
              By using Quill & Ink, you grant the service only the permissions
              reasonably necessary to process that content and provide the
              requested functionality.
            </p>

            <p className="mt-4">
              Quill & Ink does not claim ownership of your Discord messages,
              stories, images, or other original user content.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              13. Limitation of Liability
            </h2>

            <p className="mt-4">
              To the extent permitted by applicable law, Quill & Ink and its
              operators will not be responsible for indirect, incidental,
              consequential, or other losses arising from your use of the
              service.
            </p>

            <p className="mt-4">
              This includes losses resulting from Discord outages, server
              configuration mistakes, third-party service failures, loss of
              access to a Discord account or server, or misuse of the service.
            </p>

            <p className="mt-4">
              Nothing in these Terms excludes liability that cannot legally be
              excluded.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              14. Changes to These Terms
            </h2>

            <p className="mt-4">
              We may update these Terms from time to time.
            </p>

            <p className="mt-4">
              When significant changes are made, the updated version will be
              published on this website with a new &quot;Last Updated&quot;
              date.
            </p>

            <p className="mt-4">
              Continuing to use Quill & Ink after changes take effect means you
              accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              15. Contact
            </h2>

            <p className="mt-4">
              If you have questions regarding these Terms, Quill & Ink, or our
              services, please contact us through the contact information
              provided on our website.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-[#f1f8fa]">
              <span className="text-sm text-[#70d9eb]">✦</span>
              16. Acceptance
            </h2>

            <p className="mt-4">
              By adding, using, purchasing, or otherwise accessing Quill & Ink,
              you acknowledge that you have read and agree to these Terms &
              Conditions.
            </p>

            <p className="mt-4">
              If you do not agree with these Terms, you should stop using Quill
              & Ink.
            </p>
          </section>
        </div>

        {/* Bottom ornament */}
        <div className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5b849b]/25" />

          <span className="text-sm text-[#70d9eb]/70">✦</span>

          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c6a15b]/20" />
        </div>

        <div className="pb-10 pt-8 text-center text-xs uppercase tracking-[0.3em] text-[#617d92]">
          Quill & Ink • Written for communities
        </div>
      </article>
    </main>
  );
}