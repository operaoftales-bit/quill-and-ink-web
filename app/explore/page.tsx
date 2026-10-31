"use client";

import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import Link from "next/link";
import {
  categories,
  plugins,
  globalSystems,
  type Plugin,
  type GlobalSystem,
} from "@/app/data/plugins";
import { commandKnowledge } from "@/app/data/commandKnowledge";

type DemoMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
  embed?: {
    color: number;
    author: string;
    title: string;
    description: string;
    fields: { name: string; value: string; inline?: boolean }[];
    footer?: string;
  };
};

function PluginCard({
  plugin,
  expanded,
  onToggle,
}: {
  plugin: Plugin;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isPremium = plugin.tier === "Premium";
  const isUnavailable = plugin.status === "unavailable";

  return (
    <article
      className={`group relative mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border align-top backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 ${
        expanded
          ? "border-[#73d9eb]/30 bg-[#071827]/90 shadow-[0_12px_40px_rgba(0,0,0,0.22),0_0_24px_rgba(115,217,235,0.025)]"
          : "border-[#6d89a3]/15 bg-[#071827]/75 hover:border-[#73d9eb]/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full blur-3xl transition-opacity duration-500 ${
          expanded
            ? "bg-[#73d9eb]/[0.07] opacity-100"
            : "bg-[#d0b16b]/[0.045] opacity-0 group-hover:opacity-100"
        }`}
      />

      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="relative flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold tracking-[-0.015em] text-[#f1f7ff] transition-colors duration-300 group-hover:text-[#73d9eb]">
            {plugin.name}
          </span>

          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-[#6d89a3]/20 bg-[#6d89a3]/[0.07] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#91aabd]">
              {plugin.category}
            </span>

            {plugin.tag && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] ${
                  plugin.tag === "AI Assistant"
                    ? "border-[#73d9eb]/25 bg-[#73d9eb]/[0.07] text-[#73d9eb]"
                    : "border-[#6d89a3]/20 bg-[#6d89a3]/[0.05] text-[#91aabd]"
                }`}
              >
                {plugin.tag}
              </span>
            )}

            {isPremium && (
              <span className="rounded-full border border-[#d0b16b]/30 bg-[#d0b16b]/[0.07] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-[#d0b16b]">
                Premium
              </span>
            )}

            {isUnavailable && (
              <span className="rounded-full border border-[#6d89a3]/20 bg-[#6d89a3]/[0.05] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#8198aa]">
                Unavailable
              </span>
            )}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            expanded
              ? "rotate-180 border-[#73d9eb]/30 bg-[#73d9eb]/[0.08] text-[#73d9eb]"
              : "border-[#6d89a3]/20 text-[#8198aa] group-hover:border-[#73d9eb]/25 group-hover:text-[#73d9eb]"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <div className="mx-4 border-t border-[#6d89a3]/15 sm:mx-5" />

          <div className="relative px-4 pb-4 pt-3.5 sm:px-5">
            {plugin.description && (
              <p className="text-sm leading-6 text-[#91aabd]">
                {plugin.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-2 text-xs ${
                  isUnavailable ? "text-[#8198aa]" : "text-[#91aabd]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    isUnavailable ? "bg-[#8198aa]" : "bg-[#73d9a5]"
                  }`}
                />
                {isUnavailable
                  ? "Experience in preparation"
                  : "Explore this plugin"}
              </span>

              {isUnavailable ? (
                <span className="text-xs font-medium text-[#718ba1]">
                  Coming later
                </span>
              ) : (
                <Link
                  href={`/explore/${plugin.id}`}
                  tabIndex={expanded ? 0 : -1}
                  className="inline-flex items-center gap-2 rounded-full border border-[#73d9eb]/25 bg-[#73d9eb]/[0.06] px-4 py-2 text-xs font-semibold text-[#73d9eb] transition-all duration-300 hover:border-[#d0b16b]/40 hover:bg-[#d0b16b]/[0.08] hover:text-[#d0b16b]"
                >
                  Explore plugin
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function GlobalSystemCard({
  system,
  expanded,
  onToggle,
}: {
  system: GlobalSystem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`group relative mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border align-top backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 ${
        expanded
          ? "border-[#d0b16b]/30 bg-[#071827]/90 shadow-[0_12px_40px_rgba(0,0,0,0.22),0_0_24px_rgba(208,177,107,0.025)]"
          : "border-[#6d89a3]/15 bg-[#071827]/75 hover:border-[#d0b16b]/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-[#d0b16b]/[0.07] blur-3xl transition-opacity duration-500 ${
          expanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="relative flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold tracking-[-0.015em] text-[#f1f7ff] transition-colors duration-300 group-hover:text-[#d0b16b]">
            {system.name}
          </span>

          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-[#d0b16b]/25 bg-[#d0b16b]/[0.07] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-[#d0b16b]">
              {system.tag}
            </span>

            <span className="rounded-full border border-[#6d89a3]/20 bg-[#6d89a3]/[0.05] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-[#91aabd]">
              Global System
            </span>
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            expanded
              ? "rotate-180 border-[#d0b16b]/30 bg-[#d0b16b]/[0.08] text-[#d0b16b]"
              : "border-[#6d89a3]/20 text-[#8198aa] group-hover:border-[#d0b16b]/25 group-hover:text-[#d0b16b]"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <div className="mx-4 border-t border-[#6d89a3]/15 sm:mx-5" />

          <div className="relative px-4 pb-4 pt-3.5 sm:px-5">
            <p className="text-sm leading-6 text-[#91aabd]">
              {system.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs text-[#91aabd]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#d0b16b]"
                />
                Explore this system
              </span>

              <Link
                href={`/docs/${system.id}`}
                tabIndex={expanded ? 0 : -1}
                className="inline-flex items-center gap-2 rounded-full border border-[#d0b16b]/25 bg-[#d0b16b]/[0.06] px-4 py-2 text-xs font-semibold text-[#d0b16b] transition-all duration-300 hover:border-[#73d9eb]/40 hover:bg-[#73d9eb]/[0.08] hover:text-[#73d9eb]"
              >
                Read documentation
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CommandPlayground() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [previewMode, setPreviewMode] = useState<"live" | "demo">("live");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const passiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passiveIndexRef = useRef(0);
  const interactionRef = useRef(false);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, input]);

  function getTimestamp() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function addMessage(
    userContent: string,
    botContent: string,
    embed?: DemoMessage["embed"],
    clearInput = true,
  ) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = getTimestamp();

    setMessages((current) =>
      [
        ...current,
        {
          id: `${id}-user`,
          role: "user" as const,
          content: userContent,
          timestamp,
        },
        {
          id: `${id}-bot`,
          role: "bot" as const,
          content: botContent,
          timestamp: getTimestamp(),
          ...(embed ? { embed } : {}),
        },
      ].slice(-12),
    );

    // Passive demonstrations must not erase an unfinished visitor input.
    if (clearInput) {
      setInput("");
    }
  }

  function runDemo(rawInput: string, clearInput = true) {
    const original = rawInput.trim().replace(/^\/+/, "");

    if (!original) return;

    const [commandName, ...args] = original.split(/\s+/);
    const normalizedName = commandName.toLowerCase();
    const mode = args.join(" ").toLowerCase();

    const command = commandKnowledge.find(
      (item) =>
        item.name.toLowerCase() === normalizedName ||
        item.aliases?.some(
          (alias) => alias.toLowerCase() === normalizedName,
        ),
    );

    if (!command) {
      const terms = original.toLowerCase().split(/\s+/).filter(Boolean);

      const matches = commandKnowledge
        .map((item) => {
          const searchable = [
            item.name,
            item.description,
            item.usage,
            item.category,
            ...(item.aliases ?? []),
            ...(item.details ?? []),
          ]
            .join(" ")
            .toLowerCase();

          const score = terms.reduce(
            (total, term) => total + (searchable.includes(term) ? 1 : 0),
            0,
          );

          return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (!matches.length) {
        addMessage(
          `/${original}`,
          commandKnowledge.length
            ? `No command knowledge matched "${original}". Try a command name such as /daily or search for a feature keyword.`
            : "The command preview is ready, but no command metadata has been added yet.",
          undefined,
          clearInput,
        );

        return;
      }

      addMessage(
        `/${original}`,
        [
          `Command knowledge · ${matches.length} result${matches.length === 1 ? "" : "s"}`,
          "",
          ...matches.flatMap(({ item }, index) => [
            `${index + 1}. /${item.name} — ${item.description}`,
            `Usage: ${item.usage}`,
            `Category: ${item.category}`,
            ...(item.aliases?.length
              ? [`Aliases: ${item.aliases.join(", ")}`]
              : []),
            ...(item.details?.length
              ? item.details.slice(0, 3).map((detail) => `• ${detail}`)
              : []),
            "",
          ]),
          "These are local website examples, not live Discord executions.",
        ].join("\n"),
        undefined,
        clearInput,
      );

      return;
    }

    const demo = command.discordDemo;

    if (demo) {
      if (
        normalizedName === "daily" &&
        (mode.includes("error") || mode.includes("claimed"))
      ) {
        const alreadyClaimed = mode.includes("claimed");

        const selectedError = alreadyClaimed
          ? undefined
          : demo.errors?.find((entry) =>
              mode.includes("bank")
                ? entry.condition.toLowerCase().includes("ink bank")
                : mode.includes("database")
                  ? entry.condition.toLowerCase().includes("database")
                  : mode.includes("server")
                    ? entry.condition.toLowerCase().includes("server")
                    : mode.includes("invalid")
                      ? entry.condition.toLowerCase().includes("invalid")
                      : entry.condition.toLowerCase().includes("unexpected"),
            ) ?? demo.errors?.[demo.errors.length - 1];

        if (alreadyClaimed) {
          const quote = "Keep showing up. Your story is still being written.";

          addMessage(
            `/${original}`,
            "",
            {
              color: demo.color,
              author: demo.author,
              title: "✦ Already Claimed",
              description:
                "You've already collected today's reward, @user.\nCome back tomorrow to continue your streak.",
              fields: [
                {
                  name: "🔥 Current Streak",
                  value: "3 days",
                  inline: true,
                },
              ],
              footer: `“${quote}”`,
            },
            clearInput,
          );
        } else {
          addMessage(
            `/${original}`,
            selectedError?.response ??
              "❌ Something went wrong while processing your daily reward.",
            undefined,
            clearInput,
          );
        }

        return;
      }

      const values = {
        "{displayName}": "@user",
        "{reward}": "10",
        "{streak}": "1",
        "{streakPlural}": "",
        "{dailyQuote}":
          "Every new day is another page waiting to be written.",
      };

      const interpolate = (value: string) =>
        Object.entries(values).reduce(
          (result, [key, replacement]) =>
            result.split(key).join(replacement),
          value,
        );

      addMessage(
        `/${original}`,
        "",
        {
          color: demo.color,
          author: demo.author,
          title: demo.title,
          description: interpolate(demo.description),
          fields: (demo.fields ?? []).map((field) => ({
            ...field,
            value: interpolate(field.value),
          })),
          footer: demo.footer ? interpolate(demo.footer) : undefined,
        },
        clearInput,
      );

      return;
    }

    addMessage(
      `/${original}`,
      [
        `${command.description}`,
        `Usage: ${command.usage}`,
        `Category: ${command.category}`,
        ...(command.details ?? []).map((detail) => `• ${detail}`),
        ...(command.example
          ? [
              "",
              `Example: ${command.example.input}`,
              command.example.response,
            ]
          : []),
        "",
        "This is a local command preview. It does not execute the Discord command.",
      ].join("\n"),
      undefined,
      clearInput,
    );
  }

  function stopPassiveTimer() {
    if (passiveTimerRef.current !== null) {
      clearTimeout(passiveTimerRef.current);
      passiveTimerRef.current = null;
    }
  }

  function stopResumeTimer() {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }

  function schedulePassive() {
    stopPassiveTimer();

    if (interactionRef.current) return;

    // Vary the interval so the preview feels less mechanical.
    const delay = 10000 + Math.floor(Math.random() * 5001);

    passiveTimerRef.current = setTimeout(() => {
      passiveTimerRef.current = null;

      if (interactionRef.current) return;

      const availableCommands = commandKnowledge.filter(
        (item) => item.name.trim().length > 0,
      );

      if (availableCommands.length > 0) {
        const command =
          availableCommands[
            passiveIndexRef.current % availableCommands.length
          ];

        passiveIndexRef.current += 1;

        // Do not clear text the visitor may have left in the input.
        runDemo(`/${command.name}`, false);
      } else {
        runDemo("/daily", false);
      }

      // Continue the passive preview until the visitor interacts.
      schedulePassive();
    }, delay);
  }

  function enterDemoMode() {
    interactionRef.current = true;
    setPreviewMode("demo");

    stopPassiveTimer();
    stopResumeTimer();

    // Resume passive demonstrations 20 seconds after the latest interaction.
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      interactionRef.current = false;
      setPreviewMode("live");
      schedulePassive();
    }, 20000);
  }

  useEffect(() => {
    schedulePassive();

    return () => {
      stopPassiveTimer();
      stopResumeTimer();
    };
  }, []);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;

    enterDemoMode();
    runDemo(input);
  }

  function runExample(example: string) {
    enterDemoMode();
    runDemo(example);
  }

  function resetConversation() {
    enterDemoMode();
    setMessages([]);
    setInput("");
  }

  return (
    <section
      id="command-playground"
      className="relative z-10 scroll-mt-8 px-6 pb-14"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#73d9eb]">
            Interactive preview
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f4f8ff] sm:text-3xl">
            Step inside Quill & Ink.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#91aabd]">
            Try a command to see a locally recreated response based on the
            command knowledge defined for this website.
          </p>
        </div>

        {/* Cosmic outer frame */}
        <div className="relative isolate overflow-hidden rounded-2xl border border-[#73d9eb]/20 bg-[#071827]/75 shadow-[0_24px_80px_rgba(0,0,0,0.32),0_0_40px_rgba(115,217,235,0.035)] backdrop-blur-2xl">
          {/* Subtle cyan and gold ambient lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-40 -z-10 h-80 w-80 rounded-full bg-[#73d9eb]/[0.07] blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -right-24 -z-10 h-80 w-80 rounded-full bg-[#d0b16b]/[0.055] blur-[110px]"
          />

          <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#6d89a3]/15 bg-[#071827]/90 px-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#73d9eb]/25 bg-[#73d9eb]/[0.08] text-[10px] font-bold text-[#73d9eb]">
                Q&I
              </span>

              <span className="truncate text-sm font-semibold text-[#f2f3f5]">
                Quill & Ink Preview
              </span>
            </div>

            <span className="flex shrink-0 items-center gap-2 text-[10px] text-[#91aabd]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  previewMode === "demo"
                    ? "bg-[#d0b16b] shadow-[0_0_8px_rgba(208,177,107,0.4)]"
                    : "bg-[#73d9a5] shadow-[0_0_8px_rgba(115,217,165,0.4)]"
                }`}
              />
              {previewMode === "demo" ? "Demo mode" : "Passive preview"}
            </span>
          </div>

          <div className="flex min-w-0 flex-col bg-[#061321]/65">
            <header className="flex h-[58px] shrink-0 items-center justify-between gap-3 border-b border-[#6d89a3]/15 bg-[#091c2b]/55 px-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="text-2xl font-light leading-none text-[#73d9eb]/75"
                >
                  #
                </span>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[#f2f3f5]">
                    command-preview
                  </h3>

                  <p className="mt-0.5 truncate text-[10px] text-[#8198aa]">
                    Quill & Ink · Local demo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetConversation}
                className="shrink-0 rounded-md border border-transparent px-2.5 py-1.5 text-[10px] font-medium text-[#91aabd] transition hover:border-[#6d89a3]/20 hover:bg-white/[0.04] hover:text-[#f4f8ff]"
              >
                Clear chat
              </button>
            </header>

            <div
              ref={messagesContainerRef}
              aria-label="Command preview messages"
              aria-live="polite"
              className="h-[340px] shrink-0 overflow-y-auto overscroll-contain sm:h-[390px] [scrollbar-color:#294353_#071827] [scrollbar-width:thin]"
            >
              <div className="flex min-h-full flex-col justify-end px-3 pb-4 pt-5 sm:px-5">
                {messages.length === 0 ? (
                  <div className="my-auto flex flex-col items-center justify-center px-4 py-10 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#73d9eb]/20 bg-[#73d9eb]/[0.06] text-3xl font-light text-[#73d9eb] shadow-[0_0_30px_rgba(115,217,235,0.05)]">
                      #
                    </div>

                    <h4 className="text-base font-bold text-[#f2f3f5]">
                      Welcome to #command-preview
                    </h4>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#91aabd]">
                      {commandKnowledge.length
                        ? `${commandKnowledge.length} command${commandKnowledge.length === 1 ? "" : "s"} available. Try /daily or search for a command or feature.`
                        : "No command knowledge has been added yet. Add verified command metadata to commandKnowledge.ts to populate this preview."}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {["/daily", "/daily claimed", "/daily error"].map(
                        (example) => (
                          <button
                            key={example}
                            type="button"
                            onClick={() => runExample(example)}
                            className="rounded-full border border-[#73d9eb]/20 bg-[#73d9eb]/[0.045] px-3 py-1.5 text-[10px] text-[#a8dce5] transition hover:border-[#d0b16b]/35 hover:bg-[#d0b16b]/[0.06] hover:text-[#e5c980]"
                          >
                            {example}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {messages.map((message) => {
                      const isBot = message.role === "bot";

                      return (
                        <article
                          key={message.id}
                          className="flex min-w-0 items-start gap-3"
                        >
                          <div
                            aria-hidden="true"
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              isBot
                                ? "border border-[#73d9eb]/25 bg-[#153744]/80 text-[#73d9eb]"
                                : "border border-[#8b97ff]/25 bg-[#5865f2]/90 text-white"
                            }`}
                          >
                            {isBot ? "Q&I" : "YOU"}
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span
                                className={`text-[13px] font-medium ${
                                  isBot ? "text-[#73d9eb]" : "text-[#f2f3f5]"
                                }`}
                              >
                                {isBot ? "Quill & Ink" : "You"}
                              </span>

                              {isBot && (
                                <span className="rounded-[3px] bg-[#5865f2] px-1 py-0.5 text-[8px] font-bold uppercase leading-none text-white">
                                  BOT
                                </span>
                              )}

                              <time className="text-[9px] text-[#8198aa]">
                                {message.timestamp}
                              </time>
                            </div>

                            {message.embed ? (
                              <div
                                className="mt-2 max-w-lg overflow-hidden rounded-lg border border-[#6d89a3]/20 bg-[#091c2b]/95 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                                style={{
                                  borderLeft: `4px solid #${message.embed.color.toString(16).padStart(6, "0")}`,
                                }}
                              >
                                <div className="p-3.5">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#91aabd]">
                                    {message.embed.author}
                                  </p>

                                  <h4 className="mt-2 text-sm font-bold text-[#f2f3f5]">
                                    {message.embed.title}
                                  </h4>

                                  <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-[1.65] text-[#dbdee1]">
                                    {message.embed.description}
                                  </p>

                                  {message.embed.fields.length > 0 && (
                                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      {message.embed.fields.map(
                                        (field, index) => (
                                          <div
                                            key={`${field.name}-${index}`}
                                            className={
                                              field.inline
                                                ? "min-w-0"
                                                : "col-span-full min-w-0"
                                            }
                                          >
                                            <p className="text-[12px] font-bold text-[#f2f3f5]">
                                              {field.name}
                                            </p>

                                            <p className="mt-1 whitespace-pre-wrap break-words text-[13px] text-[#dbdee1]">
                                              {field.value}
                                            </p>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  {message.embed.footer && (
                                    <p className="mt-4 border-t border-[#6d89a3]/15 pt-3 text-[10px] text-[#91aabd]">
                                      {message.embed.footer}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-[1.65] text-[#dbdee1]">
                                {message.content}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#6d89a3]/10 bg-[#071827]/55 px-3 pb-3 pt-3 sm:px-5 sm:pb-5">
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-[#6d89a3]/20 bg-[#091c2b]/90 px-3 py-2 transition-[border-color,box-shadow] duration-300 focus-within:border-[#73d9eb]/40 focus-within:shadow-[0_0_24px_rgba(115,217,235,0.05)]"
              >
                <label htmlFor="demo-command-input" className="sr-only">
                  Enter a command or search command knowledge
                </label>

                <div className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg font-light text-[#73d9eb]/75"
                  >
                    +
                  </span>

                  <input
                    id="demo-command-input"
                    value={input}
                    onFocus={enterDemoMode}
                    onChange={(event) => {
                      enterDemoMode();
                      setInput(event.target.value.replace(/^\/+/, ""));
                    }}
                    placeholder="Try /daily, /daily claimed, or /daily error"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[13px] text-[#dbdee1] outline-none placeholder:text-[#8198aa]"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Run local command preview"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#73d9eb] transition hover:bg-[#73d9eb]/10 hover:text-[#a0eaf5] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-[18px] w-[18px]"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 12 20 4 14 20 11 13 4 12Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m11 13 9-9"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              <p className="mt-2 px-1 text-[10px] leading-4 text-[#8198aa]">
                Try <span className="text-[#b5bac1]">/daily</span>,{" "}
                <span className="text-[#b5bac1]">/daily claimed</span>,{" "}
                <span className="text-[#b5bac1]">/daily error</span>, or
                search for a command or feature.
              </p>

              <p className="mt-1 px-1 text-[10px] leading-4 text-[#617b90]">
                Responses are reconstructed from local metadata. This panel
                does not execute commands or connect to Discord.
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-center text-[10px] leading-5 text-[#617b90]">
          Prototype only. No live Discord connection, server data, database
          access, or economy actions are used.
        </p>
      </div>
    </section>
  );
}

function GlobalSection({
  expandedSystemId,
  onToggle,
}: {
  expandedSystemId: string | null;
  onToggle: (systemId: string) => void;
}) {
  return (
    <section>
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6d89a3]/15" />
          <span className="text-xs uppercase tracking-[0.28em] text-[#718ba1]">
            Global
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6d89a3]/15" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#f4f8ff] sm:text-3xl">
            Beyond individual servers.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#91aabd]">
            Discover the systems that connect your server to the wider
            Quill & Ink experience.
          </p>
        </div>
      </div>

      <div className="columns-1 gap-3 sm:columns-2 sm:gap-4">
        {globalSystems.map((system) => (
          <GlobalSystemCard
            key={system.id}
            system={system}
            expanded={expandedSystemId === system.id}
            onToggle={() => onToggle(system.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default function ExplorePage() {
  const [expandedPluginId, setExpandedPluginId] = useState<string | null>(
    null,
  );

  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(
    null,
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-[#f4f8ff]">
      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="group text-lg font-semibold tracking-[0.18em] text-[#f4f8ff]"
        >
          <span className="transition duration-300 group-hover:text-[#d0b16b]">
            QUILL & INK
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#8ea8bc] md:flex">
          <Link href="/explore" className="relative text-[#d0b16b]">
            Explore
            <span className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d0b16b]/70 to-transparent" />
          </Link>

          <Link
            href="/pricing"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition duration-300 hover:text-[#d0b16b]"
          >
            Contact
          </Link>
        </div>

        <a
          href="https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot"
          className="rounded-full border border-[#73d9eb]/25 bg-[#071827]/80 px-5 py-2.5 text-sm font-medium text-[#73d9eb] shadow-[0_0_30px_rgba(115,217,235,0.04)] backdrop-blur-xl transition duration-300 hover:border-[#d0b16b]/50 hover:bg-[#0a2035] hover:text-[#d0b16b] hover:shadow-[0_0_30px_rgba(208,177,107,0.08)]"
        >
          Add to Discord
        </a>
      </nav>

      {/* Compact hero */}
      <section className="relative z-10 px-6 pb-12 pt-14 text-center sm:pb-14 sm:pt-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d0b16b]/40" />

            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#d0b16b]">
              The Collection
            </span>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d0b16b]/40" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#73d9eb]/90">
            Explore Quill & Ink
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#f4f8ff] sm:text-5xl">
            Tools for communities.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#91aabd] sm:text-base">
            Discover the systems, tools, and experiences that make up Quill &
            Ink. Start with the essentials, then explore what your community
            can build on top of them.
          </p>
        </div>
      </section>

      {/* Interactive command panel */}
      <CommandPlayground />

      {/* Catalogue */}
      <section className="relative z-10 px-6 pb-14">
        <div className="mx-auto max-w-6xl space-y-12">
          {categories.map((category) => {
            if (category.id === "global") {
              return (
                <GlobalSection
                  key={category.id}
                  expandedSystemId={expandedSystemId}
                  onToggle={(systemId) =>
                    setExpandedSystemId((current) =>
                      current === systemId ? null : systemId,
                    )
                  }
                />
              );
            }

            const categoryPlugins = plugins.filter(
              (plugin) => plugin.category === category.id,
            );

            return (
              <section key={category.id}>
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6d89a3]/15" />

                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#718ba1]">
                      {category.name}
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6d89a3]/15" />
                  </div>

                  <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#f4f8ff] sm:text-3xl">
                      {category.name}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#91aabd]">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="columns-1 gap-3 sm:columns-2 sm:gap-4">
                  {categoryPlugins.map((plugin) => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      expanded={expandedPluginId === plugin.id}
                      onToggle={() =>
                        setExpandedPluginId((current) =>
                          current === plugin.id ? null : plugin.id,
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* Premium note */}
      <section className="relative z-10 px-6 pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#d0b16b]/20 bg-[#071827]/75 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-9">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#d0b16b]">
            Quill & Ink Premium
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-[#f4f8ff] sm:text-3xl">
            More experiences. More possibilities.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#91aabd]">
            Premium plugins are marked throughout the collection. Learn what
            Premium includes and how it works on the pricing page.
          </p>

          <Link
            href="/pricing"
            className="mt-6 inline-flex rounded-full bg-[#d0b16b] px-6 py-3 text-sm font-semibold text-[#061525] transition hover:bg-[#e5c980]"
          >
            Learn about Premium
          </Link>
        </div>
      </section>

      {/* Compact closing */}
      <section className="relative z-10 px-6 pb-16 pt-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#73d9eb]/20" />
            <span className="text-xs text-[#d0b16b]/60">✦</span>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#73d9eb]/20" />
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#d0b16b]">
            Made to grow
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f4f8ff] sm:text-3xl">
            More is always being written.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#91aabd]">
            Quill & Ink is designed to grow with the communities that use it.
            New tools and experiences can become part of the collection over
            time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#6d89a3]/15 bg-[#030a12]/55 px-6 py-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-[#687f91] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wide text-[#dce8ef]">
              Quill & Ink
            </p>

            <p className="mt-1">Built for communities. Made for stories.</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/about"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              About
            </Link>

            <Link
              href="/pricing"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition duration-300 hover:text-[#d0b16b]"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}