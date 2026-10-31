
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Gem,
  HelpCircle,
  Sparkles,
  CreditCard,
  Clock,
  RefreshCw,
  Zap,
} from "lucide-react";
import { categories, plugins } from "@/app/data/plugins";

const basicPlugins = plugins.filter((plugin) => plugin.tier === "Basic");
const premiumPlugins = plugins.filter((plugin) => plugin.tier === "Premium");

function PluginGroup({
  title,
  items,
}: {
  title: string;
  items: typeof plugins;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((plugin) => (
          <div
            key={plugin.id}
            className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-cyan-200/20"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium text-white">{plugin.name}</h4>

              {plugin.status === "unavailable" && (
                <span className="rounded-full bg-amber-200/10 px-2 py-1 text-[10px] text-amber-200">
                  Unavailable
                </span>
              )}
            </div>

            {plugin.description && (
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {plugin.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const purchaseSteps = [
  {
    number: "01",
    title: "Open your Discord server",
    description:
      "Go to the server where you want to unlock Premium access.",
  },
  {
    number: "02",
    title: "Run /setup",
    description:
      "Use the /setup command to open your Quill & Ink server dashboard.",
  },
  {
    number: "03",
    title: "Choose Premium",
    description:
      "Find and press the Premium button in your dashboard. This will generate your checkout page.",
  },
  {
    number: "04",
    title: "Complete your payment",
    description:
      "Follow the checkout link and complete the ₹ / ~$4 payment.",
  },
];

export default function TiersPage() {
  const basicCount = basicPlugins.length;
  const premiumCount = premiumPlugins.length;

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

        {/* Hero */}
        <header className="relative overflow-hidden rounded-3xl border border-cyan-200/10 bg-gradient-to-br from-[#12364a] via-[#0b2639] to-[#091a2a] p-7 sm:p-12">
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/5 px-3 py-1.5 text-xs font-medium text-cyan-200">
              <Gem size={14} />
              Plans & access
            </span>

            <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              The right tools for{" "}
              <span className="text-cyan-200">your community.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Quill & Ink offers two plugin tiers. Start with Basic, explore
              what your server needs, and unlock Premium plugins when you're
              ready for more.
            </p>

            <a
              href="#compare"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061525] transition hover:bg-cyan-100"
            >
              Compare the tiers
              <ArrowRight size={16} />
            </a>
          </div>
        </header>

        {/* Tier comparison */}
        <section id="compare" className="mt-16 scroll-mt-24">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Understanding access
            </span>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Two ways to build your server
            </h2>

            <p className="mt-4 max-w-3xl leading-8 text-slate-400">
              The difference between Basic and Premium is the plugins you can
              use. Your server can begin with Basic features and add Premium
              access whenever it needs those extra tools.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Basic */}
            <div className="rounded-2xl border border-cyan-200/15 bg-gradient-to-br from-cyan-200/[0.07] to-transparent p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-200">
                <Sparkles size={23} />
              </div>

              <h3 className="mt-5 font-serif text-2xl">Basic</h3>

              <p className="mt-3 leading-7 text-slate-400">
                The starting point for your community. Basic gives you access
                to a wide range of everyday community, economy, and moderation
                plugins.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white">
                  {basicCount}
                </span>

                <span className="text-sm text-slate-400">
                  Basic plugins currently listed
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                  Community features
                </p>

                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                  Economy and progression
                </p>

                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                  Everyday moderation tools
                </p>
              </div>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-200/[0.07] to-transparent p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/20 bg-amber-200/10 text-amber-200">
                <Crown size={23} />
              </div>

              <h3 className="mt-5 font-serif text-2xl">Premium</h3>

              <p className="mt-3 leading-7 text-slate-400">
                For communities that want additional tools. Premium unlocks
                the plugins marked as Premium in our Explore catalogue.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white">
                  {premiumCount}
                </span>

                <span className="text-sm text-slate-400">
                  Premium plugins currently listed
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-amber-200" />
                  Premium community features
                </p>

                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-amber-200" />
                  Additional games and experiences
                </p>

                <p className="flex items-start gap-2">
                  <Check size={17} className="mt-0.5 shrink-0 text-amber-200" />
                  Advanced tools for your server
                </p>
              </div>

              <p className="mt-6 text-xs leading-6 text-amber-100/60">
                Premium access is required for Premium-tier plugins.
              </p>
            </div>
          </div>
        </section>

        {/* Premium pricing */}
        <section id="premium-purchase" className="mt-20 scroll-mt-24">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Getting Premium
            </span>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Unlock more for your community.
            </h2>

            <p className="mt-4 max-w-3xl leading-8 text-slate-400">
              Ready to unlock Premium? You can purchase it directly through
              your Discord server. No complicated setup or separate account
              is needed.
            </p>
          </div>

          {/* Price card */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-br from-[#342d25] via-[#1e2932] to-[#0b2030] p-7 sm:p-10">
           
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-xs font-medium text-amber-200">
                  <Crown size={14} />
                  Premium access
                </div>

                <h3 className="mt-5 font-serif text-3xl sm:text-4xl">
                  One payment. 30 days.
                </h3>

                <p className="mt-3 max-w-xl leading-7 text-slate-300">
                  Get access to Premium-tier plugins for 30 days from the
                  moment your payment succeeds.
                </p>

                <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-200" />
                    30 days of access
                  </span>

                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} className="text-amber-200" />
                    Manual renewal
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl border border-amber-200/15 bg-black/20 p-6 text-center md:min-w-52">
                <p className="text-sm text-amber-100/60">
                  One-time payment
                </p>

                <p className="mt-2 text-5xl font-semibold text-white">
                  ₹350 / ~$4
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  for 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Purchase steps */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl">
              How to purchase Premium
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-slate-400">
              Follow these four steps to unlock Premium for your server.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {purchaseSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
                >
                  <span className="text-xs font-semibold tracking-widest text-amber-200">
                    STEP {step.number}
                  </span>

                  <h4 className="mt-3 font-serif text-xl">
                    {step.title}
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activation */}
          <div className="mt-8 rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.04] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Zap size={22} className="text-cyan-200" />

              <h3 className="font-serif text-xl">
                Premium activates automatically
              </h3>
            </div>

            <p className="mt-4 leading-7 text-slate-300">
              Once your payment is successful, Quill & Ink automatically
              unlocks Premium for your server. This usually happens in less
              than two seconds, so you can start using your Premium features
              almost immediately.
            </p>
          </div>

          {/* Non-recurring payment */}
          <div className="mt-5 rounded-2xl border border-amber-200/15 bg-amber-200/[0.04] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <CreditCard size={22} className="text-amber-200" />

              <h3 className="font-serif text-xl">
                No automatic renewals or recurring charges
              </h3>
            </div>

            <p className="mt-4 leading-7 text-slate-300">
              Your Premium purchase is a one-time payment for 30 days. It
              will not automatically renew, and you will not be charged again
              when the access period ends.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              When your Premium access expires, you can simply repeat the
              purchase process whenever you want another 30 days.
            </p>
          </div>
        </section>

        {/* Plugin breakdown */}
        <section className="mt-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            The full breakdown
          </span>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
            Which plugins belong to each tier?
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            Here's the current plugin list, organised by category. These lists
            are taken directly from the website's plugin catalogue.
          </p>

          {/* Basic plugins */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <Sparkles className="text-cyan-200" size={21} />

              <h3 className="font-serif text-2xl">
                Basic plugins
              </h3>
            </div>

            {categories
              .filter((category) => category.id !== "global")
              .map((category) => {
                const items = basicPlugins.filter(
                  (plugin) => plugin.category === category.id
                );

                return (
                  <PluginGroup
                    key={category.id}
                    title={category.name}
                    items={items}
                  />
                );
              })}
          </div>

          <div className="my-12 border-t border-white/10" />

          {/* Premium plugins */}
          <div>
            <div className="flex items-center gap-3">
              <Crown className="text-amber-200" size={21} />

              <h3 className="font-serif text-2xl">
                Premium plugins
              </h3>
            </div>

            {categories
              .filter((category) => category.id !== "global")
              .map((category) => {
                const items = premiumPlugins.filter(
                  (plugin) => plugin.category === category.id
                );

                return (
                  <PluginGroup
                    key={category.id}
                    title={category.name}
                    items={items}
                  />
                );
              })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <HelpCircle size={21} className="text-cyan-200" />

            <h2 className="font-serif text-2xl">
              A few things to remember
            </h2>
          </div>

          <div className="mt-7 space-y-6">
            <div>
              <h3 className="font-medium text-white">
                Are global systems part of Basic or Premium?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                No. Global Collaboration and InkBank are separate global
                systems, not plugins assigned to either tier.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white">
                Do I need Premium to use Quill & Ink?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                No. You can use the Basic plugins without Premium. You only
                need Premium access for the plugins assigned to that tier.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white">
                Does Premium automatically renew?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                No. Premium is non-recurring. You pay once for 30 days and
                decide yourself whether you want to purchase another period.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white">
                How long does Premium activation take?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                After successful payment, Premium is usually unlocked in less
                than two seconds.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white">
                Can the plugin list change?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                Yes. New plugins may be introduced, and existing plugins may
                change tiers or availability. The catalogue above reflects
                the current website data.
              </p>
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section className="mt-16 rounded-3xl border border-cyan-200/10 bg-gradient-to-br from-[#103044] to-[#091c2c] p-7 sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Keep exploring
          </span>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
            Find the features your community needs.
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-slate-300">
            Take a closer look at the plugins, read their individual
            descriptions, and decide what works best for your server.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061525] transition hover:bg-cyan-100"
            >
              Explore plugins
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/docs/commands"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-200/30 hover:text-cyan-200"
            >
              Read the command guide
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
