
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { commandKnowledge } from "@/app/data/commandKnowledge";

type CommandEntry = (typeof commandKnowledge)[number];

const documentedCommands: CommandEntry[] = commandKnowledge.filter(
  (command, index, array) =>
    array.findIndex((item) => item.name === command.name) === index
);

const categories = [
  "All",
  ...Array.from(
    new Set(documentedCommands.map((command) => command.category))
  ),
];

const cleanText = (value: string) => {
  const replacements: [RegExp, string][] = [
    [/\bdatabase\b/gi, "account information"],
    [/\bDB\b/g, "account information"],
    [/\bservice(s)?\b/gi, "feature"],
    [/\bhandler(s)?\b/gi, "system"],
    [/\bcallback(s)?\b/gi, "follow-up"],
    [/\btransaction(s)?\b/gi, "payment process"],
    [/\bephemeral\b/gi, "private"],
    [/\bcollector(s)?\b/gi, "interactive buttons"],
    [/\bpermission overwrite(s)?\b/gi, "channel permissions"],
    [/\bmoderation case\b/gi, "moderation record"],
    [/\bmoderation cases\b/gi, "moderation records"],
    [/\bchannel ID\b/gi, "channel"],
    [/\buser ID\b/gi, "user"],
    [/\bexecute(d|s)?\b/gi, "run"],
    [/\bconfigured\b/gi, "set up"],
    [/\bconfiguration\b/gi, "settings"],
    [/\binteraction\b/gi, "command"],
    [/\binteractions\b/gi, "commands"],
  ];

  let result = value;

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
};

const cleanDetails = (details?: string[]) => {
  if (!details) return [];

  const hiddenPatterns = [
    /database/i,
    /\bDB\b/,
    /handler/i,
    /callback/i,
    /transaction/i,
    /collector/i,
    /permission overwrite/i,
    /partial success/i,
    /implementation/i,
    /internal/i,
    /method/i,
    /function/i,
    /execute method/i,
    /lifecycle/i,
    /cleanup callback/i,
    /interaction handler/i,
    /stores message/i,
    /saves .* ID/i,
    /creates .* record after/i,
    /record creation fails/i,
    /if .* fails/i,
    /logging failure/i,
  ];

  return details
    .filter(
      (detail) => !hiddenPatterns.some((pattern) => pattern.test(detail))
    )
    .map(cleanText)
    .filter(Boolean);
};

function getCommandTier(command: CommandEntry) {
  const name = command.name.toLowerCase();

  const premiumCommands = [
    "anchor",
    "setbulletinchannel",
    "setbulletinemoji",
    "premium-ticket",
    "rob",
    "pressure",
    "pressure remove",
    "giveaway",
  ];

  const basicCommands = [
    "daily",
    "card",
    "locker",
    "lockerdeposit",
    "lockerwithdraw",
    "pay",
    "birthday",
    "setreactionrole",
    "confessions",
    "confessionchanneladd",
    "leaderboard",
    "leveling",
    "autorole",
    "ban",
    "case",
    "clearwarn",
    "kick",
    "purge",
    "lock",
    "setmodlog",
    "slowmode",
    "unlock",
    "timeout",
    "untimeout",
    "warn",
    "ticket",
    "tcg",
    "tcg-remove",
    "store",
    "dice",
    "oddoreven",
    "rps",
    "slots",
    "logging",
    "welcome",
  ];

  if (premiumCommands.includes(name)) return "Premium";
  if (basicCommands.includes(name)) return "Basic";

  return "Core";
}

function CommandCard({
  command,
}: {
  command: CommandEntry;
}) {
  const [expanded, setExpanded] = useState(false);

  const details = cleanDetails(command.details);
  const description = cleanText(command.description);
  const tier = getCommandTier(command);

  return (
    <article className="group mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] align-top transition hover:border-cyan-300/25 hover:bg-white/[0.055]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full p-5 text-left sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
            {command.category}
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              tier === "Premium"
                ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                : tier === "Basic"
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                  : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            {tier}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl text-white sm:text-2xl">
              /{command.name}
            </h3>

            <p className="mt-2 text-sm leading-7 text-white/65">
              {description}
            </p>
          </div>

          <span
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/40">
          <span>Command guide</span>
          <span>•</span>
          <span>{expanded ? "Show less" : "View details"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-5 pb-6 pt-5 sm:px-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              How to use
            </h4>

            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <code className="break-words text-sm leading-7 text-cyan-100">
                {command.usage}
              </code>
            </div>
          </div>

          {command.aliases && command.aliases.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Also known as
              </h4>

              <div className="mt-2 flex flex-wrap gap-2">
                {command.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70"
                  >
                    /{alias}
                  </span>
                ))}
              </div>
            </div>
          )}

          {details.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Good to know
              </h4>

              <ul className="mt-3 space-y-2">
                {details.map((detail, detailIndex) => (
                  <li
                    key={`${command.name}-${detailIndex}`}
                    className="flex gap-3 text-sm leading-7 text-white/65"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {command.example && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Example
              </h4>

              <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <div>
                  <p className="mb-1 text-xs text-white/35">You</p>
                  <p className="text-sm text-cyan-100">
                    {cleanText(command.example.input)}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="mb-1 text-xs text-white/35">Opera</p>
                  <p className="whitespace-pre-line text-sm leading-7 text-white/70">
                    {cleanText(command.example.response)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {command.discordDemo && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Discord preview
              </h4>

              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#202225]">
                <div
                  className="border-l-4 p-4"
                  style={{
                    borderColor: `#${command.discordDemo.color
                      .toString(16)
                      .padStart(6, "0")}`,
                  }}
                >
                  <p className="text-xs text-white/45">
                    {cleanText(command.discordDemo.author)}
                  </p>

                  <h5 className="mt-2 font-semibold text-white">
                    {cleanText(command.discordDemo.title)}
                  </h5>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/75">
                    {cleanText(command.discordDemo.description)}
                  </p>

                  {command.discordDemo.fields &&
                    command.discordDemo.fields.length > 0 && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {command.discordDemo.fields.map((field) => (
                          <div key={field.name}>
                            <p className="text-xs font-semibold text-white/55">
                              {cleanText(field.name)}
                            </p>

                            <p className="mt-1 whitespace-pre-line text-sm text-white/75">
                              {cleanText(field.value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  {command.discordDemo.footer && (
                    <p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/40">
                      {cleanText(command.discordDemo.footer)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function CommandsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTier, setActiveTier] = useState("All");

  const filteredCommands = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documentedCommands.filter((command) => {
      const matchesSearch =
        !query ||
        command.name.toLowerCase().includes(query) ||
        command.description.toLowerCase().includes(query) ||
        command.category.toLowerCase().includes(query) ||
        command.usage.toLowerCase().includes(query) ||
        command.aliases?.some((alias) =>
          alias.toLowerCase().includes(query)
        );

      const matchesCategory =
        activeCategory === "All" ||
        command.category === activeCategory;

      const matchesTier =
        activeTier === "All" ||
        getCommandTier(command) === activeTier;

      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [search, activeCategory, activeTier]);

  const totalCommands = documentedCommands.length;

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
            Quill & Ink Documentation
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            The Command Library
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Everything you need to know about Quill & Ink commands.
            Find a command, learn how to use it, and discover what
            it can do for your community.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Documented commands",
              value: totalCommands.toString(),
            },
            {
              label: "Command categories",
              value: (categories.length - 1).toString(),
            },
            {
              label: "Easy to explore",
              value: "One library",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <p className="text-sm text-white/45">{item.label}</p>
              <p className="mt-2 font-serif text-2xl text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-white sm:text-3xl">
                Find your command
              </h2>

              <p className="mt-2 text-sm leading-7 text-white/50">
                Search by name, category, or what you want to do.
              </p>
            </div>

            <p className="text-sm text-white/40">
              Showing {filteredCommands.length} of {totalCommands} commands
            </p>
          </div>

          <div className="mt-6">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search commands..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40 focus:bg-white/[0.06]"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeCategory === category
                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                    : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              Access
            </span>

            {["All", "Core", "Basic", "Premium"].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`rounded-lg px-3 py-1.5 text-xs transition ${
                  activeTier === tier
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {filteredCommands.length > 0 ? (
            <div className="mt-8 columns-1 gap-4 lg:columns-2">
              {filteredCommands.map((command) => (
                <CommandCard
                  key={command.name}
                  command={command}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-14 text-center">
              <h3 className="font-serif text-2xl text-white">
                No commands found
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/50">
                Try another search or choose a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActiveTier("All");
                }}
                className="mt-5 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="mt-20 rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.08] to-white/[0.02] p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/70">
            New to Quill & Ink?
          </p>

          <h2 className="mt-4 font-serif text-3xl text-white sm:text-4xl">
            Your next chapter starts here.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            Start with the essentials, explore the available features,
            and build a community that feels like your own.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started"
              className="rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-[#061525] transition hover:bg-cyan-100"
            >
              Getting Started
            </Link>

            <Link
              href="/docs/tiers"
              className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm text-white transition hover:bg-white/[0.08]"
            >
              Explore Tiers
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
