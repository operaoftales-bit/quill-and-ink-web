
export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Introduction",
      paragraphs: [
        "Quill & Ink is a Discord bot built to support communities through moderation, community tools, games, and progression features. This Privacy Policy explains what information may be processed when you use the bot, why it is needed, and how it may be handled.",
        "By using Quill & Ink, you acknowledge that information may be processed as described in this policy. If you do not agree with these practices, please stop using the bot."
      ]
    },
    {
      title: "2. Information We May Collect",
      paragraphs: [
        "Depending on the features you use, Quill & Ink may process the following types of information:",
        "Discord information: Discord user IDs, server IDs, channel IDs, role IDs, usernames, and other basic information made available through Discord when needed for a feature to work.",
        "Server configuration: Settings saved by server administrators, such as enabled features, moderation preferences, and other bot configuration options.",
        "Economy and game data: Information needed to operate features such as balances, rewards, inventories, game progress, statistics, and other saved gameplay data.",
        "Premium information: Information needed to check Premium status, manage access to paid features, and confirm a purchase. This may include transaction references and payment status.",
        "Interaction information: Information included in commands, buttons, or other interactions you send to the bot, where processing that information is necessary to respond or provide the requested feature.",
        "The exact information processed depends on which features are enabled and how you interact with the bot. We do not intend to collect information that is unrelated to providing or maintaining its features."
      ]
    },
    {
      title: "3. How We Use Information",
      paragraphs: [
        "Information may be used to operate Quill & Ink, respond to commands, save settings and progress, provide moderation and community features, manage Premium access, troubleshoot errors, prevent abuse, and maintain the reliability and security of the service.",
        "We may also use relevant operational information to investigate reported problems and improve existing features. Information should be used for these purposes rather than for unrelated activities."
      ]
    },
    {
      title: "4. Discord and Your Interactions",
      paragraphs: [
        "Quill & Ink operates through Discord and relies on the permissions and information made available by Discord. The bot can only provide certain features when it has the required permissions and access.",
        "Messages, commands, and other activity you share in Discord may be visible to other members of your server depending on where and how you use them. This Privacy Policy does not make those Discord conversations private.",
        "Your use of Discord is also subject to Discord's own terms and privacy policy. Quill & Ink is a separate service and is not a replacement for those policies."
      ]
    },
    {
      title: "5. Payments and Premium",
      paragraphs: [
        "Quill & Ink offers paid Premium access. When you purchase Premium, the payment provider used for the transaction processes your payment according to its own terms and privacy policy.",
        "Quill & Ink may process purchase confirmations, transaction references, payment status, and the Discord account information needed to activate and manage Premium access.",
        "Payment details such as card or bank credentials should be provided through the payment provider's checkout process, not through Discord messages to the bot. The information Quill & Ink receives depends on the provider and the payment flow used.",
        "If you have a question about a payment or Premium activation, contact us through the official support server. Please do not share passwords, full card details, or other sensitive payment credentials in support messages."
      ]
    },
    {
      title: "6. Data Storage",
      paragraphs: [
        "Some information must be stored so that Quill & Ink can remember server settings, economy balances, game progress, and other information between interactions or restarts.",
        "Stored information may be held in the service's database or supporting infrastructure. Access to that information should be limited to what is needed to operate, maintain, and support the service.",
        "No online service can guarantee that storage or transmission will be completely secure. We aim to handle stored information responsibly and take reasonable steps to protect it."
      ]
    },
    {
      title: "7. Data Sharing",
      paragraphs: [
        "We do not intend to sell your personal information. Information may be processed by infrastructure, hosting, database, payment, or other service providers where necessary to operate Quill & Ink.",
        "Information may also need to be disclosed where required by applicable law, to respond to valid legal requests, or to protect the service and its users against abuse or security threats.",
        "Information shared within Discord features may be visible to server members or other people who can access the relevant channel or message. Please consider this before submitting information through public commands or interactions."
      ]
    },
    {
      title: "8. Data Retention",
      paragraphs: [
        "Information may be retained for as long as it is needed to provide the relevant feature, preserve saved settings or progress, manage Premium access, maintain security, or meet applicable legal obligations.",
        "Retention periods may differ depending on the type of information and the feature involved. We do not promise that every category of information is deleted immediately when it is no longer actively used.",
        "Where information is no longer needed, it should be deleted or otherwise handled appropriately, subject to technical limitations and any applicable legal requirements."
      ]
    },
    {
      title: "9. Data Deletion Requests",
      paragraphs: [
        "If you would like information associated with your Discord account or server to be reviewed for deletion, contact us through the official Quill & Ink support server.",
        "Please identify the relevant Discord account or server and describe the information you want reviewed. Do not share passwords, payment credentials, or unnecessary personal information.",
        "We may need to verify that you are authorised to make the request. Some information may need to be retained for legitimate operational, security, financial, or legal reasons. We will review requests in light of those requirements and the technical capabilities of the service.",
        "Removing the bot from a server or leaving a Discord server does not necessarily delete information already stored by Quill & Ink. If you want stored information reviewed, please submit a deletion request."
      ]
    },
    {
      title: "10. Your Choices and Rights",
      paragraphs: [
        "Depending on where you live and the laws that apply, you may have rights to request access to, correction of, or deletion of certain personal information, or to object to or restrict some forms of processing.",
        "You can stop using the bot, remove it from a server where you have permission to do so, and contact us with questions about information associated with your account or server.",
        "We will consider applicable requests and explain any relevant limitations. The availability and scope of these rights depend on applicable law and the information involved."
      ]
    },
    {
      title: "11. Server Administrators",
      paragraphs: [
        "Server administrators are responsible for choosing which Quill & Ink features to enable, configuring the bot appropriately, and managing the permissions granted to it.",
        "Administrators should consider how enabled features operate and whether messages or activity may be visible to other members. They should also explain relevant server practices to their members where appropriate.",
        "A server administrator's control over server settings does not automatically give them the right to access or request deletion of another person's information in every circumstance."
      ]
    },
    {
      title: "12. Children's Privacy",
      paragraphs: [
        "Quill & Ink is not intended to be used in a way that violates Discord's minimum age requirements or applicable laws relating to children's privacy.",
        "We do not knowingly seek to collect children's personal information beyond what is necessary for the service to operate. If you believe information has been processed inappropriately, please contact us so that the matter can be reviewed."
      ]
    },
    {
      title: "13. Security",
      paragraphs: [
        "We aim to use reasonable safeguards to protect information handled by Quill & Ink against unauthorised access, misuse, loss, or alteration.",
        "However, no application, database, or internet transmission method is completely secure. We cannot guarantee absolute security, and users should avoid sharing sensitive information through bot commands, public channels, or support messages."
      ]
    },
    {
      title: "14. Third-Party Services",
      paragraphs: [
        "Quill & Ink depends on third-party services to provide some of its functionality. These may include Discord, hosting and database providers, and payment processors.",
        "Those providers may process information according to their own policies and terms. Quill & Ink does not control every aspect of their systems or privacy practices, so we encourage you to review the policies of the services you use."
      ]
    },
    {
      title: "15. When You Stop Using Quill & Ink",
      paragraphs: [
        "You may stop using Quill & Ink at any time. A server owner or an administrator with the necessary permissions can remove the bot from their server.",
        "Stopping use of the bot or removing it from a server may prevent further processing for features that depend on that server, but it does not automatically erase previously stored records. Stored information is handled according to the retention and deletion sections of this policy."
      ]
    },
    {
      title: "16. Changes to This Privacy Policy",
      paragraphs: [
        "This Privacy Policy may be updated as Quill & Ink changes, new features are introduced, or legal and operational requirements evolve.",
        "When changes are made, the date at the top of this page will be updated. We encourage you to review this page occasionally so you understand how information may be handled."
      ]
    },
    {
      title: "17. Contact",
      paragraphs: [
        "If you have questions about this Privacy Policy, want to raise a privacy concern, or would like to submit a data request, contact us through the official Quill & Ink support server."
      ]
    },
    {
      title: "18. Acceptance",
      paragraphs: [
        "By using Quill & Ink, you acknowledge that you have read this Privacy Policy and understand how information may be processed as described here. If you do not agree with the policy, please discontinue use of the service."
      ]
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061525] px-5 py-14 text-[#f4f8ff] sm:px-6 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-3xl" />
        <div className="absolute -right-40 top-[35rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/[0.06] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-400/[0.035] blur-3xl" />
      </div>

      <article className="relative mx-auto max-w-4xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#9fb7c9] transition-colors hover:text-cyan-200"
        >
          <span aria-hidden="true">←</span>
          Back to Quill & Ink
        </a>

        <header className="mt-8 rounded-3xl border border-white/[0.09] bg-white/[0.035] px-6 py-9 shadow-2xl shadow-black/10 backdrop-blur-sm sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Legal
          </p>

          <h1 className="mt-4 bg-gradient-to-r from-white via-cyan-100 to-amber-200 bg-clip-text font-serif text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-5 text-sm text-[#aebfce]">
            Last Updated: October 12, 2026
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-cyan-400/60 via-white/10 to-transparent" />

          <p className="mt-7 max-w-2xl text-base leading-7 text-[#c1cfdb] sm:text-lg sm:leading-8">
            Your trust matters to us. This policy explains what information
            Quill & Ink may handle, how it is used, and the choices available
            to you.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#091b2b]/70 px-5 py-5 sm:px-7">
          <p className="text-sm leading-7 text-[#aebfce]">
            <span className="font-semibold text-[#e3edf5]">
              A note about accuracy:
            </span>{" "}
            This policy describes the intended handling of information. The
            actual information processed depends on the features you use and
            the service providers involved. Please contact us if you have a
            question about a particular type of data.
          </p>
        </div>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-6 sm:px-8 sm:py-7"
            >
              <h2 className="font-serif text-xl font-medium leading-snug text-[#edf6ff] sm:text-2xl">
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

        <footer className="mt-12 border-t border-white/[0.09] pt-7 text-center">
          <div className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <p className="font-serif text-lg text-[#dce9f4]">
            Quill & Ink
          </p>

          <p className="mt-2 text-sm text-[#8197aa]">
            Written for communities. Built with care.
          </p>

          <a
            href="https://discord.gg/v95scy728"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex text-sm text-cyan-300 transition-colors hover:text-cyan-100"
          >
            Contact Support
            <span className="ml-2" aria-hidden="true">
              ↗
            </span>
          </a>
        </footer>
      </article>
    </main>
  );
}
