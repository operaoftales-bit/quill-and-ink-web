
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { globalSystems } from "@/app/data/plugins";

const guideSections = [
  {
    number: "01",
    title: "Getting Started",
    description:
      "New to Quill & Ink? Start here. Learn how to add the bot, get it ready, and begin using it in your server.",
    href: "/docs/getting-started",
    label: "New to Quill & Ink",
    icon: "✦",
    keywords: "setup invite installation configuration beginner",
  },
  {
    number: "02",
    title: "Basic & Premium",
    description:
      "Understand the difference between Basic and Premium, what each tier includes, and how access works.",
    href: "/docs/tiers",
    label: "Plans and access",
    icon: "◇",
    keywords: "basic premium subscription features plans access pricing",
  },
  {
    number: "03",
    title: "Commands",
    description:
      "Find the commands you need, understand their options, and learn how to use them with examples.",
    href: "/docs/commands",
    label: "Using Quill & Ink",
    icon: "⌘",
    keywords: "slash commands usage examples arguments permissions",
  },
];

const helpTopics = [
  {
    title: "Setting up your server",
    description:
      "Learn the first steps after inviting Quill & Ink and preparing it for your community.",
    href: "/docs/getting-started",
    keywords: "setup permissions invite configuration",
  },
  {
    title: "Understanding Premium",
    description:
      "Find out how tiers work and what changes when your server has Premium access.",
    href: "/docs/tiers",
    keywords: "premium basic upgrade subscription",
  },
  {
    title: "Finding the right command",
    description:
      "Learn where to find commands and how to understand their usage.",
    href: "/docs/commands",
    keywords: "commands slash help usage",
  },
];

const systemDetails: Record<
  string,
  {
    icon: string;
    introduction: string;
    sections: { title: string; description: string }[];
    note?: string;
    keywords: string;
  }
> = {
  "global-collaboration": {
    icon: "✧",
    introduction:
      "Bring communities together without requiring their members to join the same Discord server. Global Collaboration gives server administrators a way to discover and communicate with other communities.",
    sections: [
      {
        title: "1. Create an invitation",
        description:
          "Use /collab to publish a collaboration invitation. You can introduce your server, explain what you're looking for, and share the details of your proposed collaboration.",
      },
      {
        title: "2. Let other communities join",
        description:
          "The invitation is shared with servers using Quill & Ink. An administrator from another interested server can choose to join your collaboration.",
      },
      {
        title: "3. Get connected",
        description:
          "When another server joins, Quill & Ink creates a private communication channel for the participating administrators and notifies them.",
      },
      {
        title: "4. Communicate across servers",
        description:
          "Messages sent by the participating administrators are relayed between their servers. This lets both communities coordinate without their administrators having to join each other's servers.",
      },
    ],
    note:
      "The relay is for text messages. Attachments and embeds are not relayed between participating servers.",
    keywords:
      "collaboration collab invite invitation communities servers administrators join private channel communication relay messages",
  },

  inkbank: {
    icon: "◇",
    introduction:
      "InkBank is a shared community fund associated with each server. It gives a server a Nickel balance connected to its membership, helping communities build a fund as they grow.",
    sections: [
      {
        title: "A fund for your server",
        description:
          "Each server has its own InkBank balance. It is separate from the Nickel held in individual members' wallets.",
      },
      {
        title: "How the allocation works",
        description:
          "When a member joins, up to 10,000 Nickel is allocated to the server's InkBank through the Quill Bank. The allocation is based on the number of members in the server.",
      },
      {
        title: "When members leave",
        description:
          "When a member leaves, their allocated amount can be returned, up to 10,000 Nickel. If the available amount is lower, the remaining shortfall is tracked.",
      },
    ],
    note:
      "InkBank is a community fund, not a separate source of newly created Nickel. Its balance is tied to the server's membership.",
    keywords:
      "inkbank nickel community fund server balance members joining leaving allocation quill bank",
  },
};

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [expandedSystems, setExpandedSystems] = useState<string[]>([]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    if (!normalizedSearch) return guideSections;

    return guideSections.filter((guide) =>
      [guide.title, guide.description, guide.label, guide.keywords]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const filteredSystems = useMemo(() => {
    if (!normalizedSearch) return globalSystems;

    return globalSystems.filter((system) => {
      const details = systemDetails[system.id];

      return [
        system.name,
        system.description,
        system.tag,
        details?.introduction,
        details?.keywords,
        ...(details?.sections.map(
          (section) => `${section.title} ${section.description}`,
        ) ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const filteredHelpTopics = useMemo(() => {
    if (!normalizedSearch) return helpTopics;

    return helpTopics.filter((topic) =>
      `${topic.title} ${topic.description} ${topic.keywords}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const hasResults =
    filteredGuides.length > 0 ||
    filteredSystems.length > 0 ||
    filteredHelpTopics.length > 0;

  function toggleSystem(id: string) {
    setExpandedSystems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 lg:px-12">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
            Quill & Ink Help Centre
          </div>

          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            A little help
            <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-amber-200 bg-clip-text text-transparent">
              along the way.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Whether you're setting up your server, learning a command,
            or wondering how a feature works, you'll find the answers
            and explanations here.
          </p>

          {/* Documentation search */}
          <div className="mx-auto mt-10 max-w-2xl">
            <label htmlFor="docs-search" className="sr-only">
              Search documentation
            </label>

            <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b2033]/90 px-5 py-4 shadow-2xl shadow-black/20 transition focus-within:border-cyan-300/50">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-cyan-200"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id="docs-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="What would you like to know?"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="shrink-0 text-xs text-slate-400 transition hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Search guides, commands, and global systems.
            </p>

            <div className="mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-xl border border-cyan-200/10 bg-cyan-200/[0.035] px-4 py-3 text-left">
  <span className="mt-0.5 shrink-0 text-cyan-200">ⓘ</span>
  <p className="text-xs leading-6 text-slate-400 sm:text-sm">
    <span className="font-medium text-cyan-100">
      A note about this documentation:{" "}
    </span>
    Our documentation is reviewed against Quill & Ink's bot code
    to keep information accurate and up to date. However, some
    automated interpretations or simplified explanations may not
    fully reflect the bot's actual behaviour. If something seems
    unclear or incorrect, please let us know.
  </p>
</div>
          </div>
        </section>

        {/* Getting started */}
        <section className="mt-24">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              A good place to begin
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Let's take it one step at a time.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              You don't need to know everything at once. Start with
              the guide that matches what you're trying to do.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <Link
                key={guide.number}
                href={guide.href}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#10283d] to-[#091b2c] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:shadow-xl hover:shadow-cyan-950/20 sm:p-7"
              >
                <div className="absolute right-5 top-3 font-serif text-6xl text-white/[0.035] transition group-hover:text-cyan-200/[0.08]">
                  {guide.number}
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.07] text-xl text-cyan-200">
                  {guide.icon}
                </div>

                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
                  {guide.label}
                </p>

                <h3 className="mt-2 font-serif text-2xl transition group-hover:text-cyan-100">
                  {guide.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {guide.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan-200">
                  Read this guide
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Help topics */}
        <section className="mt-28">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Need a hand?
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Common things to learn.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              A few useful starting points for everyday questions.
              Each guide explains things in simple steps.
            </p>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {filteredHelpTopics.map((topic) => (
              <Link
                key={topic.title}
                href={topic.href}
                className="group flex items-center justify-between gap-5 py-5 transition hover:bg-white/[0.015] sm:px-4"
              >
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-100 transition group-hover:text-cyan-200">
                    {topic.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {topic.description}
                  </p>
                </div>

                <span className="shrink-0 text-lg text-cyan-200/70 transition group-hover:translate-x-1 group-hover:text-cyan-100">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Global systems */}
        <section className="mt-28" id="global-systems">
          <div className="mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Beyond one server
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              More than one community.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Some features connect communities or help a server grow
              its shared resources. Open a section below to learn
              what each system does and how it works.
            </p>
          </div>

          <div className="space-y-4">
            {filteredSystems.map((system, index) => {
              const details = systemDetails[system.id];
              const isExpanded = expandedSystems.includes(system.id);

              return (
                <article
                  key={system.id}
                  className="overflow-hidden rounded-2xl border border-amber-200/10 bg-gradient-to-br from-[#172a3a] to-[#0b1d2d] transition duration-300 hover:border-amber-200/25"
                >
                  <button
                    type="button"
                    onClick={() => toggleSystem(system.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between gap-5 p-6 text-left sm:p-7"
                  >
                    <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-200/[0.06] font-serif text-2xl text-amber-200">
                        {details?.icon ?? "✧"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif text-xs text-amber-200/50">
                            0{index + 1}
                          </span>

                          <span className="rounded-full border border-amber-200/20 bg-amber-200/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                            {system.tag}
                          </span>
                        </div>

                        <h3 className="mt-3 font-serif text-xl text-white transition group-hover:text-amber-100 sm:text-2xl">
                          {system.name}
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                          {system.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200/15 text-lg text-amber-200 transition duration-300 ${
                        isExpanded ? "rotate-180 bg-amber-200/10" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ⌄
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-white/[0.07] px-6 pb-7 pt-6 sm:px-7">
                      {details ? (
                        <>
                          <p className="max-w-3xl text-sm leading-7 text-slate-300">
                            {details.introduction}
                          </p>

                          <div className="mt-7 grid gap-5 sm:grid-cols-2">
                            {details.sections.map((item, sectionIndex) => (
                              <div
                                key={item.title}
                                className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5"
                              >
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                                  {String(sectionIndex + 1).padStart(2, "0")}
                                </p>

                                <h4 className="mt-3 font-medium text-slate-100">
                                  {item.title}
                                </h4>

                                <p className="mt-2 text-sm leading-7 text-slate-400">
                                  {item.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          {details.note && (
                            <div className="mt-5 rounded-xl border border-amber-200/10 bg-amber-200/[0.04] p-4">
                              <p className="text-sm leading-7 text-slate-300">
                                <span className="font-semibold text-amber-200">
                                  Good to know:{" "}
                                </span>
                                {details.note}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm leading-7 text-slate-400">
                          {system.description}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Empty search state */}
        {!hasResults && (
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <div className="text-3xl text-cyan-200">⌕</div>

            <h3 className="mt-4 font-serif text-2xl">
              We couldn't find that just yet.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Try another word or clear your search to see all the guides.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 rounded-full border border-cyan-200/20 px-5 py-2 text-sm text-cyan-200 transition hover:bg-cyan-200/10"
            >
              Show all guides
            </button>
          </div>
        )}

        {/* Bottom callout */}
        <section className="mt-28 overflow-hidden rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-[#102d43] via-[#0b2236] to-[#101f30] px-7 py-12 text-center sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Still finding your way?
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              Every question
              <span className="block text-amber-200">
                deserves a clear answer.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Take your time, explore the guides, and learn Quill & Ink
              at your own pace. There's no need to figure it all out
              in one go.
            </p>

            <Link
              href="/docs/getting-started"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-[#061525] transition hover:bg-white"
            >
              Start with the basics
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
