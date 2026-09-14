export default function PrivacyPage() {
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
            Privacy Policy
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
              1. Introduction
            </h2>

            <p className="mt-4">
              This Privacy Policy explains how Quill & Ink collects, uses,
              stores, and protects information when you use the Quill & Ink
              Discord bot, website, Premium services, and related features.
            </p>

            <p className="mt-4">
              By using Quill & Ink, you acknowledge that information may be
              processed as described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              2. Information We May Collect
            </h2>

            <p className="mt-4">
              Depending on which Quill & Ink features you use, we may process
              information necessary to provide those features.
            </p>

            <h3 className="mt-6 text-xl font-medium text-[#dff7ff]">
              Discord Information
            </h3>

            <ul className="mt-4 space-y-2 pl-2">
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Discord user IDs.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Discord server IDs.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Channel IDs and role IDs used for configuration.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Discord usernames or other information required to display
                features.
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-[#dff7ff]">
              Server Configuration
            </h3>

            <p className="mt-4">
              We may store configuration information provided by server
              administrators so that Quill & Ink can remember server settings
              between sessions and deployments.
            </p>

            <h3 className="mt-6 text-xl font-medium text-[#dff7ff]">
              Economy and Game Data
            </h3>

            <p className="mt-4">
              If your server uses Quill & Ink&apos;s economy, games, or related
              features, we may store information such as balances, experience,
              levels, cards, transactions, game records, and other data
              necessary to provide those features.
            </p>

            <h3 className="mt-6 text-xl font-medium text-[#dff7ff]">
              Premium and Payment Information
            </h3>

            <p className="mt-4">
              When Premium is purchased, we may process information necessary
              to identify the purchase, verify payment, and provide Premium
              access.
            </p>

            <p className="mt-4">
              Payment processing is handled by our third-party payment
              provider. We do not intend to store complete payment-card or
              banking credentials on Quill & Ink&apos;s own systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              3. How We Use Information
            </h2>

            <p className="mt-4">Information may be used to:</p>

            <ul className="mt-4 space-y-2 pl-2">
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Provide and operate Quill & Ink.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Remember Discord server configuration.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Maintain economy, game, and progression systems.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Process and verify Premium purchases.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Prevent fraud, abuse, and unauthorized access.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Investigate security incidents and technical problems.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Maintain and improve the service.
              </li>
              <li>
                <span className="mr-3 text-[#73d9eb]">✦</span>
                Provide support when requested.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              4. Discord
            </h2>

            <p className="mt-4">
              Quill & Ink operates through Discord and may interact with
              Discord&apos;s APIs and services.
            </p>

            <p className="mt-4">
              Your use of Discord remains subject to Discord&apos;s own Terms
              of Service and Privacy Policy.
            </p>

            <p className="mt-4">
              Quill & Ink is not responsible for how Discord independently
              processes information through its own platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              5. Payment Processing
            </h2>

            <p className="mt-4">
              Premium payments are processed through a third-party payment
              provider.
            </p>

            <p className="mt-4">
              Payment providers may collect and process payment and transaction
              information according to their own privacy policies and terms.
            </p>

            <p className="mt-4">
              Quill & Ink may receive information such as payment identifiers,
              order identifiers, payment status, amount, currency, and other
              information necessary to verify and provide Premium access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              6. Data Storage
            </h2>

            <p className="mt-4">
              Quill & Ink may store persistent service data in a database so
              that information such as server configuration, progression,
              economy data, game data, and Premium entitlements can survive
              bot restarts and deployments.
            </p>

            <p className="mt-4">
              We take reasonable measures to protect stored information from
              unauthorized access, alteration, or disclosure.
            </p>

            <p className="mt-4">
              However, no internet-connected system can be guaranteed to be
              completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              7. Data Sharing
            </h2>

            <p className="mt-4">
              We do not sell your personal information.
            </p>

            <p className="mt-4">
              Information may be shared with service providers when reasonably
              necessary to operate Quill & Ink. These may include hosting,
              database, payment, infrastructure, security, and other technical
              service providers.
            </p>

            <p className="mt-4">
              Information may also be disclosed where required by applicable
              law or where reasonably necessary to protect the service, its
              users, or our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              8. Data Retention
            </h2>

            <p className="mt-4">
              We retain information for as long as reasonably necessary to
              provide Quill & Ink and its features, maintain records, prevent
              abuse, resolve disputes, comply with legal obligations, and
              maintain legitimate business records.
            </p>

            <p className="mt-4">
              Different types of information may have different retention
              periods depending on their purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              9. Data Deletion
            </h2>

            <p className="mt-4">
              If you believe Quill & Ink is storing information that should no
              longer be retained, you may contact us using the contact
              information provided on this website.
            </p>

            <p className="mt-4">
              Requests may be subject to verification and applicable legal or
              operational requirements.
            </p>

            <p className="mt-4">
              Certain records may need to be retained for legitimate purposes,
              including transaction records, security records, fraud
              prevention, or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              10. Children's Privacy
            </h2>

            <p className="mt-4">
              Quill & Ink is not intended to circumvent Discord&apos;s age
              requirements or applicable laws relating to minors.
            </p>

            <p className="mt-4">
              Users must comply with Discord&apos;s applicable age requirements
              and policies when using Quill & Ink.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              11. Security
            </h2>

            <p className="mt-4">
              We take reasonable technical and organizational measures to
              protect information handled by Quill & Ink.
            </p>

            <p className="mt-4">
              This includes reasonable measures designed to protect service
              credentials, stored information, payment-related records, and
              infrastructure from unauthorized access.
            </p>

            <p className="mt-4">
              No security system is completely immune from risks, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              12. Third-Party Services
            </h2>

            <p className="mt-4">
              Quill & Ink may rely on third-party services including Discord,
              payment providers, hosting providers, database providers, and
              other infrastructure services.
            </p>

            <p className="mt-4">
              Those providers may process information according to their own
              policies. We encourage you to review their respective privacy
              policies when using their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              13. Changes to This Privacy Policy
            </h2>

            <p className="mt-4">
              We may update this Privacy Policy from time to time to reflect
              changes to Quill & Ink, our services, legal requirements, or our
              data practices.
            </p>

            <p className="mt-4">
              When significant changes are made, the updated version will be
              published on this website with a new &quot;Last Updated&quot;
              date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              14. Contact
            </h2>

            <p className="mt-4">
              If you have questions about this Privacy Policy or how Quill &
              Ink handles information, please contact us using the contact
              information provided on this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f7ff]">
              <span className="mr-2 text-[#73d9eb]">✦</span>
              15. Acceptance
            </h2>

            <p className="mt-4">
              By using Quill & Ink, you acknowledge that you have read and
              understood this Privacy Policy.
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