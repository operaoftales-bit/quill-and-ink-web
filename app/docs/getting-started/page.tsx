
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Compass,
  MessageCircle,
  Puzzle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add Quill & Ink to your server",
    icon: Bot,
    description:
      "Start by inviting Quill & Ink to your Discord server through the official website.",
    details: [
      "Open the Quill & Ink website.",
      "Choose the option to add the bot to your server.",
      "Select the Discord server you manage.",
      "Review the permissions shown by Discord and authorize the bot.",
    ],
    note: "You need permission to manage the server to add a bot to it.",
  },
  {
    number: "02",
    title: "Check the bot's permissions",
    icon: ShieldCheck,
    description:
      "Quill & Ink needs the right permissions to perform its tasks. Without them, some features may not work as expected.",
    details: [
      "Make sure the bot can view the channels where you want to use it.",
      "Check that it can send messages and embed links where needed.",
      "Allow additional permissions only when the features you use require them.",
      "If a command fails, check the bot's role and channel permissions first.",
    ],
    note: "Discord channel permissions can override permissions granted at the server level.",
  },
  {
    number: "03",
    title: "Explore the available plugins",
    icon: Puzzle,
    description:
      "You don't need to use every feature. Start with the plugins that suit your community.",
    details: [
      "Visit the Explore page to see the available plugins.",
      "Read about what each plugin does.",
      "Check whether the feature is available on Basic or requires Premium.",
      "Set up the features you actually want to use.",
    ],
    note: "Some features may need additional configuration before they are ready to use.",
    link: {
      label: "Explore plugins",
      href: "/explore",
    },
  },
  {
    number: "04",
    title: "Learn how commands work",
    icon: MessageCircle,
    description:
      "Commands are how you interact with Quill & Ink. Discord will show command options and descriptions as you use them.",
    details: [
      "Type / in a server channel to open Discord's command picker.",
      "Find the Quill & Ink command you want to use.",
      "Fill in the options shown by Discord.",
      "Submit the command and follow the response.",
    ],
    note: "A command may only be available to members with the required server permissions.",
    link: {
      label: "Read the commands guide",
      href: "/docs/commands",
    },
  },
  {
    number: "05",
    title: "Make yourself at home",
    icon: Sparkles,
    description:
      "Once the basics are ready, explore the wider Quill & Ink experience and make it your own.",
    details: [
      "Try the features your community will enjoy.",
      "Read the individual guides when you need help.",
      "Explore global systems that connect participating servers.",
      "Consider Premium if your community needs its additional features.",
    ],
    note: "You can start small and expand your server's setup whenever you're ready.",
  },
];

const toc = [
  { id: "before-starting", label: "Before you begin" },
  { id: "getting-started", label: "Your first five steps" },
  { id: "need-help", label: "Need a little help?" },
  { id: "next-steps", label: "Where to go next" },
];

export default function GettingStartedPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8 lg:px-10">
        <Link
          href="/docs"
          className="mb-10 inline-flex items-center gap-2 text-sm text-cyan-200/70 transition hover:text-cyan-200"
        >
          <ArrowLeft size={16} />
          Back to documentation
        </Link>

        <header className="relative overflow-hidden rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-[#103044] via-[#0b2437] to-[#091a2a] p-7 sm:p-12">
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/5 px-3 py-1.5 text-xs font-medium text-cyan-200">
              <Compass size={14} />
              Getting started
            </span>

            <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Your journey with{" "}
              <span className="text-cyan-200">Quill & Ink</span> begins here.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              New around here? No worries. We'll walk you through the basics,
              from inviting the bot to discovering the features that make your
              community feel like home.
            </p>

            <a
              href="#getting-started"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061525] transition hover:bg-cyan-100"
            >
              Let's get started
              <ArrowRight size={16} />
            </a>
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                On this page
              </p>

              <nav className="space-y-2 border-l border-white/10">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block border-l border-transparent py-2 pl-4 text-sm text-slate-400 transition hover:border-cyan-200 hover:text-cyan-200"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <section id="before-starting" className="scroll-mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl">
                Before you begin
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate-300">
                You only need a Discord server and permission to manage it.
                It's also helpful to have an idea of what you want Quill & Ink
                to do for your community. You can always explore more features
                later.
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-200/10 bg-cyan-200/[0.04] p-5">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-200" size={20} />
                  <div>
                    <h3 className="font-medium text-white">
                      A little preparation goes a long way
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      Make sure you can manage your server's roles, channels,
                      and integrations. You may need these when configuring
                      individual features.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="getting-started" className="mt-16 scroll-mt-24">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  The walkthrough
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                  Your first five steps
                </h2>
                <p className="mt-4 leading-8 text-slate-400">
                  Take your time. There's no need to configure everything at
                  once.
                </p>
              </div>

              <div className="space-y-5">
                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <section
                      key={step.number}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-cyan-200/20 sm:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.07] text-cyan-200">
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold tracking-widest text-cyan-200/60">
                            STEP {step.number}
                          </span>
                          <h3 className="mt-1 font-serif text-xl text-white sm:text-2xl">
                            {step.title}
                          </h3>
                          <p className="mt-3 leading-7 text-slate-400">
                            {step.description}
                          </p>

                          <ol className="mt-5 space-y-3">
                            {step.details.map((detail, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm leading-7 text-slate-300"
                              >
                                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs text-cyan-200">
                                  {index + 1}
                                </span>
                                {detail}
                              </li>
                            ))}
                          </ol>

                          <div className="mt-5 rounded-xl border border-amber-200/10 bg-amber-200/[0.04] px-4 py-3">
                            <p className="text-sm leading-6 text-amber-100/75">
                              <span className="font-semibold text-amber-200">
                                Good to know:
                              </span>{" "}
                              {step.note}
                            </p>
                          </div>

                          {step.link && (
                            <Link
                              href={step.link.href}
                              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                            >
                              {step.link.label}
                              <ArrowRight size={15} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>

            <section id="need-help" className="mt-16 scroll-mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl">
                Need a little help?
              </h2>
              <p className="mt-4 leading-8 text-slate-400">
                If something isn't working, don't worry. Most setup problems
                come down to permissions or configuration.
              </p>

              <div className="mt-6 space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-medium text-white">
                    The bot isn't responding to my command.
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Check that the bot is online, that the command is available
                    in your server, and that it has permission to access the
                    channel.
                  </p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-medium text-white">
                    I can't see a command.
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Some commands depend on the enabled features or your
                    Discord permissions. Check the relevant command guide.
                  </p>
                </div>

                <div className="pb-2">
                  <h3 className="font-medium text-white">
                    A feature isn't working as expected.
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Visit that feature's guide and check its setup instructions
                    and requirements.
                  </p>
                </div>
              </div>
            </section>

            <section id="next-steps" className="mt-16 scroll-mt-24">
              <div className="rounded-3xl border border-cyan-200/10 bg-gradient-to-br from-[#103044] to-[#0a1d2d] p-6 sm:p-9">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  What's next?
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                  There's plenty more to discover.
                </h2>
                <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                  Now that you've got the basics, take a look at the guides
                  below. They'll help you understand the tools and systems
                  available to your community.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/docs/commands"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/25 hover:bg-white/[0.07]"
                  >
                    <span>
                      <span className="block font-medium text-white">
                        Command guide
                      </span>
                      <span className="mt-1 block text-sm text-slate-400">
                        Learn how to use commands.
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-cyan-200 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/docs/tiers"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/25 hover:bg-white/[0.07]"
                  >
                    <span>
                      <span className="block font-medium text-white">
                        Basic & Premium
                      </span>
                      <span className="mt-1 block text-sm text-slate-400">
                        Understand the available tiers.
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-cyan-200 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/docs/collaboration"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/25 hover:bg-white/[0.07]"
                  >
                    <span>
                      <span className="block font-medium text-white">
                        Global Collaboration
                      </span>
                      <span className="mt-1 block text-sm text-slate-400">
                        Learn about connecting servers.
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-cyan-200 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/docs/inkbank"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-200/25 hover:bg-white/[0.07]"
                  >
                    <span>
                      <span className="block font-medium text-white">
                        InkBank
                      </span>
                      <span className="mt-1 block text-sm text-slate-400">
                        Understand your server's reserve.
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-cyan-200 transition group-hover:translate-x-1" />
                  </Link>
                </div>

                <Link
                  href="/docs"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Back to all documentation
                  <ArrowRight size={15} />
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
