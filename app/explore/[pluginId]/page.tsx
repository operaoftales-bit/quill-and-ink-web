
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/app/components/motion/Reveal";

import { plugins, type Plugin } from "@/app/data/plugins";
import {
    pluginDetails,
    type PluginDetail,
} from "@/app/data/plugin-details";

const DISCORD_INSTALL_URL =
    "https://discord.com/oauth2/authorize?client_id=1535187211958489208&permissions=2833847071407158&integration_type=0&scope=applications.commands+bot";

function getPlugin(pluginId: string): Plugin | undefined {
    return plugins.find((plugin) => plugin.id === pluginId);
}

function getPluginDetail(pluginId: string): PluginDetail | undefined {
    return pluginDetails.find((detail) => detail.pluginId === pluginId);
}

function getCommandFallbackDescription(command: string): string {
    return `Command reference for ${command}. Run it in Discord and follow the available options.`;
}

function getPluginFaq(
    plugin: Plugin,
    isPremium: boolean,
    isUnavailable: boolean,
) {
    const questions = [
        {
            question: `How do I get started with ${plugin.name}?`,
            answer: isUnavailable
                ? `${plugin.name} is currently marked as unavailable in the catalogue. Its availability may change as development progresses.`
                : `Add Quill & Ink to your Discord server, then use the relevant slash commands in Discord. The commands listed on this page are a reference; availability can depend on the current bot release and server configuration.`,
        },
        {
            question: "Do I need to install a separate bot?",
            answer: "No separate plugin installation is described here. Quill & Ink is the bot, and its catalogue groups the features and systems it provides.",
        },
        {
            question: "Is this plugin free?",
            answer: isPremium
                ? `${plugin.name} is listed as a Premium plugin. Visit the pricing page for the current Premium offering and purchase details.`
                : `${plugin.name} is listed in the Basic tier. Check the plugin's current status and command reference for any requirements.`,
        },
        {
            question: "Why might a command not work in my server?",
            answer: "A command may depend on the current bot release, your permissions, server configuration, or the plugin's availability. Check the command spelling and your server's setup before trying again.",
        },
        {
            question: "Where can I get help?",
            answer: "Visit the Quill & Ink support server for assistance with setup, commands, or troubleshooting.",
        },
    ];

    return questions;
}

export default async function PluginPage({
    params,
}: {
    params: Promise<{ pluginId: string }>;
}) {
    const { pluginId } = await params;
    const plugin = getPlugin(pluginId);

    if (!plugin) {
        notFound();
    }

    const detail = getPluginDetail(plugin.id);
    const isPremium = plugin.tier === "Premium";
    const isUnavailable = plugin.status === "unavailable";

    const commandDetails = detail?.commands ?? [];
    const features = detail?.features ?? [];

    // Prefer richer command descriptions from plugin-details.ts.
    // Fall back to the catalogue's command list when detail data is absent.
    const documentedCommands =
        commandDetails.length > 0
            ? commandDetails
            : (plugin.commands ?? []).map((command) => ({
                  command,
                  description: getCommandFallbackDescription(command),
              }));

    const faq = getPluginFaq(plugin, isPremium, isUnavailable);

    return (
       <main className="relative min-h-screen overflow-hidden text-white">

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/5">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="shrink-0 text-sm font-semibold tracking-[0.14em] text-white transition hover:text-cyan-200 sm:tracking-[0.18em]"
                    >
                        QUILL &amp; INK
                    </Link>

                    <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
                        <Link
                            href="/explore"
                            className="text-slate-200 transition hover:text-white"
                        >
                            Explore
                        </Link>

                        <Link
                            href="/pricing"
                            className="transition hover:text-white"
                        >
                            Pricing
                        </Link>

                        <Link
                            href="/about"
                            className="transition hover:text-white"
                        >
                            About
                        </Link>

                        <Link
                            href="/contact"
                            className="transition hover:text-white"
                        >
                            Contact
                        </Link>
                    </div>

                    <a
                        href={DISCORD_INSTALL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.1] sm:px-4"
                    >
                        Add to Discord
                    </a>
                </div>
            </nav>

            {/* Main content */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
                <Link
                    href="/explore"
                    className="group inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-200"
                >
                    <span
                        aria-hidden="true"
                        className="transition-transform group-hover:-translate-x-1"
                    >
                        ←
                    </span>
                    Back to Explore
                </Link>

                {/* Plugin hero */}
                <Reveal className="mt-9 sm:mt-12">
                    <section
                        aria-labelledby="plugin-title"
                        className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-gradient-to-br from-white/[0.045] via-white/[0.018] to-transparent p-6 sm:p-10 lg:p-12"
                    >
                        <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl ${
                                isPremium
                                    ? "bg-amber-300/[0.07]"
                                    : "bg-cyan-300/[0.055]"
                            }`}
                        />

                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                                    {plugin.category}
                                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                        isPremium
                                            ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-200"
                                            : "border-cyan-300/15 bg-cyan-300/[0.05] text-cyan-200"
                                    }`}
                                >
                                    {plugin.tier}
                                </span>

                                {plugin.tag && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-400">
                                        {plugin.tag}
                                    </span>
                                )}

                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                        isUnavailable
                                            ? "border-red-300/15 bg-red-300/[0.05] text-red-200"
                                            : "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"
                                    }`}
                                >
                                    {isUnavailable
                                        ? "Currently unavailable"
                                        : "Listed in catalogue"}
                                </span>
                            </div>

                            <div className="mt-8 max-w-4xl">
                                <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-300/80">
                                    {detail?.eyebrow ??
                                        `${plugin.category} · ${plugin.tier}`}
                                </p>

                                <h1
                                    id="plugin-title"
                                    className="mt-4 break-words text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
                                >
                                    {detail?.headline ?? plugin.name}
                                </h1>

                                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
                                    {detail?.introduction ??
                                        plugin.description ??
                                        `Discover ${plugin.name}, a Quill & Ink system designed to support your Discord community.`}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {!isUnavailable && (
                                        <a
                                            href={DISCORD_INSTALL_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.16]"
                                        >
                                            Add Quill &amp; Ink
                                            <span aria-hidden="true">
                                                ↗
                                            </span>
                                        </a>
                                    )}

                                    {isPremium && (
                                        <Link
                                            href="/pricing"
                                            className="inline-flex items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/[0.045] px-6 py-3 text-sm font-semibold text-amber-200 transition hover:border-amber-300/35 hover:bg-amber-300/[0.09]"
                                        >
                                            Explore Premium
                                        </Link>
                                    )}

                                    <a
                                        href="https://discord.gg/3qbKqxBJDa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.025] px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                                    >
                                        Get support
                                    </a>
                                </div>

                                {isUnavailable && (
                                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
                                        This plugin is listed for reference but
                                        is currently marked unavailable. Check
                                        back for updates before planning your
                                        server setup around it.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* Features */}
                {features.length > 0 && (
                    <Reveal className="mt-14">
                        <section aria-labelledby="features-title">
                            <div className="mb-7 max-w-2xl">
                                <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-300/70">
                                    A closer look
                                </p>

                                <h2
                                    id="features-title"
                                    className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
                                >
                                    What you can do with it
                                </h2>

                                <p className="mt-3 leading-7 text-slate-500">
                                    Explore the capabilities documented for{" "}
                                    {plugin.name}.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature) => (
                                    <article
                                        key={feature.title}
                                        className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.04]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="block h-1 w-8 rounded-full bg-gradient-to-r from-cyan-300/70 to-amber-300/60 transition-all duration-300 group-hover:w-12"
                                        />

                                        <h3 className="mt-5 text-lg font-semibold text-white">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-slate-400">
                                            {feature.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </Reveal>
                )}

                {/* Commands and sidebar */}
                <Reveal className="mt-14">
                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                        <section
                            aria-labelledby="commands-title"
                            className="min-w-0 rounded-3xl border border-white/[0.09] bg-white/[0.025] p-6 sm:p-8"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/70">
                                        Command reference
                                    </p>

                                    <h2
                                        id="commands-title"
                                        className="mt-3 text-2xl font-semibold text-white"
                                    >
                                        Commands
                                    </h2>

                                    <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                                        Documented commands associated with{" "}
                                        {plugin.name}. Exact availability may
                                        depend on the current release and your
                                        server configuration.
                                    </p>
                                </div>

                                {documentedCommands.length > 0 && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-slate-400">
                                        {documentedCommands.length}{" "}
                                        {documentedCommands.length === 1
                                            ? "command"
                                            : "commands"}
                                    </span>
                                )}
                            </div>

                            {documentedCommands.length > 0 ? (
                                <div className="mt-7 divide-y divide-white/[0.06]">
                                    {documentedCommands.map((command) => (
                                        <div
                                            key={command.command}
                                            className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(150px,0.75fr)_minmax(0,1.25fr)] sm:gap-6"
                                        >
                                            <div className="min-w-0">
                                                <code className="inline-block max-w-full break-all rounded-lg border border-cyan-300/10 bg-cyan-300/[0.045] px-3 py-2 text-sm font-medium text-cyan-100">
                                                    {command.command}
                                                </code>
                                            </div>

                                            <p className="text-sm leading-7 text-slate-400">
                                                {command.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-7 rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-6">
                                    <p className="text-sm font-medium text-slate-300">
                                        Command documentation is being
                                        prepared.
                                    </p>

                                    <p className="mt-2 text-sm leading-7 text-slate-500">
                                        Visit the support server if you need
                                        help identifying the commands currently
                                        available for this plugin.
                                    </p>

                                    <a
                                        href="https://discord.gg/3qbKqxBJDa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex text-sm font-medium text-cyan-200 transition hover:text-white"
                                    >
                                        Visit support ↗
                                    </a>
                                </div>
                            )}
                        </section>

                        {/* Plugin information */}
                        <aside className="space-y-4">
                            <section className="rounded-3xl border border-white/[0.09] bg-white/[0.025] p-6">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                    Plugin overview
                                </p>

                                <h2 className="mt-3 text-xl font-semibold text-white">
                                    {plugin.name}
                                </h2>

                                {plugin.description && (
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {plugin.description}
                                    </p>
                                )}

                                <div className="mt-6 space-y-4 border-t border-white/[0.07] pt-5 text-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-slate-500">
                                            Category
                                        </span>
                                        <span className="text-right text-slate-300">
                                            {plugin.category}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-slate-500">
                                            Tier
                                        </span>
                                        <span
                                            className={
                                                isPremium
                                                    ? "text-right text-amber-200"
                                                    : "text-right text-cyan-200"
                                            }
                                        >
                                            {plugin.tier}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-slate-500">
                                            Status
                                        </span>
                                        <span
                                            className={`text-right ${
                                                isUnavailable
                                                    ? "text-red-200"
                                                    : "text-emerald-200"
                                            }`}
                                        >
                                            {isUnavailable
                                                ? "Unavailable"
                                                : "Listed"}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {!isUnavailable && (
                                <section className="rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.055] to-transparent p-6">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-200/70">
                                        Get started
                                    </p>

                                    <h2 className="mt-3 text-lg font-semibold text-white">
                                        Bring your community together.
                                    </h2>

                                    <p className="mt-2 text-sm leading-7 text-slate-400">
                                        Add Quill &amp; Ink to your Discord
                                        server and explore its available
                                        features.
                                    </p>

                                    <a
                                        href={DISCORD_INSTALL_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.16]"
                                    >
                                        Add Quill &amp; Ink
                                        <span aria-hidden="true">↗</span>
                                    </a>
                                </section>
                            )}

                            {isPremium && (
                                <section className="rounded-3xl border border-amber-300/10 bg-amber-300/[0.025] p-6">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-200/70">
                                        Premium access
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        This plugin is listed as part of
                                        Quill &amp; Ink Premium.
                                    </p>

                                    <Link
                                        href="/pricing"
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition hover:text-amber-100"
                                    >
                                        View Premium
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </section>
                            )}

                            <section className="rounded-3xl border border-white/[0.07] bg-white/[0.015] p-6">
                                <h2 className="text-base font-semibold text-white">
                                    Need a hand?
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-slate-500">
                                    Get help with setup, commands, and
                                    troubleshooting from the community.
                                </p>

                                <a
                                    href="https://discord.gg/3qbKqxBJDa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex text-sm font-medium text-cyan-200 transition hover:text-white"
                                >
                                    Open support server ↗
                                </a>
                            </section>
                        </aside>
                    </div>
                </Reveal>

                {/* Frequently asked questions */}
                <Reveal className="mt-16 sm:mt-20">
                    <section
                        aria-labelledby="faq-title"
                        className="mx-auto max-w-4xl"
                    >
                        <div className="mb-8 text-center">
                            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-300/70">
                                A few answers
                            </p>

                            <h2
                                id="faq-title"
                                className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                            >
                                Frequently asked questions
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                                Useful details before you start using{" "}
                                {plugin.name} in your community.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {faq.map((item, index) => (
                                <details
                                    key={item.question}
                                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-colors open:border-cyan-300/15 open:bg-white/[0.035]"
                                    open={index === 0}
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left text-sm font-medium text-slate-200 marker:hidden transition hover:text-white [&::-webkit-details-marker]:hidden sm:px-6">
                                        <span>{item.question}</span>

                                        <span
                                            aria-hidden="true"
                                            className="shrink-0 text-lg text-cyan-200/70 transition-transform duration-200 group-open:rotate-45"
                                        >
                                            +
                                        </span>
                                    </summary>

                                    <div className="px-5 pb-5 sm:px-6">
                                        <p className="text-sm leading-7 text-slate-400">
                                            {item.answer}
                                        </p>

                                        {index === 0 &&
                                            !isUnavailable && (
                                                <a
                                                    href={DISCORD_INSTALL_URL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 inline-flex text-sm font-medium text-cyan-200 transition hover:text-white"
                                                >
                                                    Add Quill &amp; Ink ↗
                                                </a>
                                            )}

                                        {index === 2 && isPremium && (
                                            <Link
                                                href="/pricing"
                                                className="mt-3 inline-flex text-sm font-medium text-amber-200 transition hover:text-amber-100"
                                            >
                                                View Premium →
                                            </Link>
                                        )}

                                        {index === 4 && (
                                            <a
                                                href="https://discord.gg/3qbKqxBJDa"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex text-sm font-medium text-cyan-200 transition hover:text-white"
                                            >
                                                Visit support server ↗
                                            </a>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </Reveal>

                {/* Closing CTA */}
                <Reveal className="mt-16 sm:mt-20">
                    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-cyan-300/[0.045] via-white/[0.02] to-amber-300/[0.025] px-6 py-10 text-center sm:px-10 sm:py-12">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-cyan-300/[0.045] blur-3xl"
                        />

                        <div className="relative">
                            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-200/80">
                                Built for communities
                            </p>

                            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                Ready to discover what your server can do?
                            </h2>

                            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                                Explore the rest of the collection or bring
                                Quill &amp; Ink into your Discord community.
                            </p>

                            <div className="mt-7 flex flex-wrap justify-center gap-3">
                                {!isUnavailable && (
                                    <a
                                        href={DISCORD_INSTALL_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-[#06111d] transition hover:bg-cyan-100"
                                    >
                                        Add to Discord
                                    </a>
                                )}

                                <Link
                                    href="/explore"
                                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]"
                                >
                                    Explore all plugins
                                </Link>
                            </div>
                        </div>
                    </section>
                </Reveal>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href="/"
                            className="font-semibold tracking-[0.12em] text-slate-300 transition hover:text-white"
                        >
                            QUILL &amp; INK
                        </Link>

                        <p className="mt-2">
                            Built for communities. Made for stories.
                        </p>

                        <p className="mt-2">
                            © {new Date().getFullYear()} Quill &amp; Ink
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-3">
                        <Link
                            href="/explore"
                            className="transition hover:text-slate-300"
                        >
                            Explore
                        </Link>

                        <Link
                            href="/about"
                            className="transition hover:text-slate-300"
                        >
                            About
                        </Link>

                        <Link
                            href="/pricing"
                            className="transition hover:text-slate-300"
                        >
                            Pricing
                        </Link>

                        <Link
                            href="/contact"
                            className="transition hover:text-slate-300"
                        >
                            Contact
                        </Link>

                        <Link
                            href="/privacy"
                            className="transition hover:text-slate-300"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition hover:text-slate-300"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
