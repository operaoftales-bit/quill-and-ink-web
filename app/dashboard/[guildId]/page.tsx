"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface AuthorizationResponse {
    ok: boolean;
    error?: string;
    user?: {
        id: string;
    };
    guild?: {
        id: string;
        name: string;
    };
    authorization?: {
        owner: boolean;
        administrator: boolean;
        premium: boolean;
    };
}

type PluginCategory =
    | "Moderation"
    | "Community"
    | "Economy"
    | "Games";

interface PluginDefinition {
    id: string;
    name: string;
    description: string;
    category: PluginCategory;
    status: "enabled" | "disabled" | "coming_soon";
    premium?: boolean;
    configure?: boolean;
}

const plugins: PluginDefinition[] = [
    {
        id: "automod",
        name: "AutoMod",
        description:
            "Protect your server with automatic moderation and filtering.",
        category: "Moderation",
        status: "enabled",
        configure: false
    },
    {
        id: "advanced-automod",
        name: "Advanced AutoMod",
        description:
            "Configure detailed spam detection, filters, actions, and protections.",
        category: "Moderation",
        status: "enabled",
        premium: true,
        configure: true
    },
    {
        id: "moderation",
        name: "Moderation",
        description:
            "Manage Quill & Ink's moderation tools and server protection.",
        category: "Moderation",
        status: "coming_soon"
    },
    {
        id: "welcome",
        name: "Welcome",
        description:
            "Configure welcome messages and new-member experiences.",
        category: "Community",
        status: "coming_soon"
    },
    {
        id: "birthday",
        name: "Birthday Tracker",
        description:
            "Let members register birthdays and configure birthday rewards.",
        category: "Community",
        status: "coming_soon"
    },
    {
        id: "economy",
        name: "Economy",
        description:
            "Configure the server's Nickel economy and related systems.",
        category: "Economy",
        status: "coming_soon"
    },
    {
        id: "store",
        name: "Store",
        description:
            "Manage categories, items, purchases, and server store settings.",
        category: "Economy",
        status: "coming_soon"
    },
    {
        id: "bank-locker",
        name: "Bank Locker",
        description:
            "Configure savings, maturity, and interest settings.",
        category: "Economy",
        status: "coming_soon"
    },
    {
        id: "games",
        name: "Games",
        description:
            "Configure Quill & Ink's games and interactive features.",
        category: "Games",
        status: "coming_soon"
    }
];

const categories: PluginCategory[] = [
    "Moderation",
    "Community",
    "Economy",
    "Games"
];

function getErrorMessage(error: string | undefined): string {
    switch (error) {
        case "GUILD_NOT_AUTHORIZED":
            return "This server is not available for your dashboard session.";

        case "BOT_NOT_IN_GUILD":
            return "Quill & Ink is not currently in this server.";

        case "USER_NOT_IN_GUILD":
            return "Your Discord account is no longer a member of this server.";

        case "GUILD_ADMINISTRATOR_REQUIRED":
            return "You need to be the server owner or have Administrator permission.";

        case "PREMIUM_REQUIRED":
            return "This server needs an active Quill & Ink Premium subscription.";

        case "UNAUTHENTICATED":
            return "Your Discord dashboard session has expired. Please sign in again.";

        default:
            return "We couldn't verify your access to this server.";
    }
}

function getCategoryPlugins(
    category: PluginCategory
): PluginDefinition[] {
    return plugins.filter(
        (plugin) => plugin.category === category
    );
}

function getStatusLabel(
    status: PluginDefinition["status"]
): string {
    switch (status) {
        case "enabled":
            return "Enabled";

        case "disabled":
            return "Disabled";

        case "coming_soon":
            return "Coming soon";
    }
}

function getStatusClasses(
    status: PluginDefinition["status"]
): string {
    switch (status) {
        case "enabled":
            return "border-[#65d8eb]/20 bg-[#0a2539] text-[#72d8ed]";

        case "disabled":
            return "border-[#47718c]/25 bg-[#0a1b2d] text-[#7894a8]";

        case "coming_soon":
            return "border-[#47718c]/20 bg-[#0a1b2d] text-[#7894a8]";
    }
}

export default function ServerDashboardPage() {
    const params = useParams();
    const router = useRouter();

    const guildId =
        typeof params.guildId === "string"
            ? params.guildId
            : "";

    const [state, setState] = useState<
        "loading" | "authorized" | "denied"
    >("loading");

    const [result, setResult] =
        useState<AuthorizationResponse | null>(null);

    useEffect(() => {
        if (!guildId) {
            setState("denied");

            setResult({
                ok: false,
                error: "INVALID_GUILD_ID"
            });

            return;
        }

        let cancelled = false;

        async function authorize() {
            try {
                const response =
                    await fetch(
                        "/api/dashboard/authorize",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify({
                                guildId
                            }),
                            cache: "no-store"
                        }
                    );

                const data =
                    (await response.json()) as AuthorizationResponse;

                if (cancelled) {
                    return;
                }

                setResult(data);

                if (
                    response.ok &&
                    data.ok &&
                    data.authorization?.premium
                ) {
                    setState("authorized");
                    return;
                }

                setState("denied");
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "[Dashboard] Authorization request failed.",
                    error
                );

                setResult({
                    ok: false,
                    error:
                        "DASHBOARD_AUTHORIZATION_FAILED"
                });

                setState("denied");
            }
        }

        void authorize();

        return () => {
            cancelled = true;
        };
    }, [guildId]);

    if (state === "loading") {
        return (
            <main className="min-h-screen bg-[#061525] px-6 py-16 text-[#f5f7f8]">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-8 sm:p-12">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                            Quill & Ink Dashboard
                        </p>

                        <h1 className="mt-4 font-serif text-3xl font-semibold">
                            Verifying server access…
                        </h1>

                        <p className="mt-3 text-[#9db5c6]">
                            Checking your current Discord permissions
                            and Premium access.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (state === "denied") {
        return (
            <main className="min-h-screen bg-[#061525] px-6 py-16 text-[#f5f7f8]">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-3xl border border-red-400/20 bg-[#091a2c] p-8 sm:p-12">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                            Quill & Ink Dashboard
                        </p>

                        <h1 className="mt-4 font-serif text-3xl font-semibold">
                            Access unavailable
                        </h1>

                        <p className="mt-4 max-w-2xl text-[#9db5c6]">
                            {getErrorMessage(result?.error)}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard")
                                }
                                className="rounded-full border border-[#537c95]/60 bg-[#0a1b2d] px-6 py-3 text-sm font-medium text-[#eef8fa] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
                            >
                                Back to servers
                            </button>

                            <a
                                href="/api/auth/logout"
                                className="rounded-full border border-[#537c95]/40 px-6 py-3 text-sm text-[#9db5c6] transition hover:border-[#6bd9eb]/50 hover:text-[#f3f8fa]"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const enabledPlugins = plugins.filter(
        (plugin) => plugin.status === "enabled"
    );

    return (
        <main className="min-h-screen bg-[#061525] text-[#f5f7f8]">
            <div className="flex min-h-screen flex-col lg:flex-row">

                {/* Sidebar */}
                <aside className="w-full border-b border-[#47718c]/20 bg-[#071827] lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
                    <div className="p-6">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/dashboard")
                            }
                            className="mb-8 flex w-full items-center gap-3 text-left"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#65d8eb]/30 bg-[#0a2539] text-lg font-semibold text-[#72d8ed]">
                                Q
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#f3f8fa]">
                                    Quill & Ink
                                </p>

                                <p className="text-xs text-[#7894a8]">
                                    Dashboard
                                </p>
                            </div>
                        </button>

                        {/* Server */}
                        <div className="mb-8 rounded-2xl border border-[#47718c]/20 bg-[#091a2c] p-4">
                            <p className="truncate text-sm font-medium text-[#f3f8fa]">
                                {result?.guild?.name}
                            </p>

                            <p className="mt-1 text-xs text-[#7894a8]">
                                Server
                            </p>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            <a
                                href="#overview"
                                className="block rounded-xl bg-[#102b43] px-4 py-3 text-sm font-medium text-[#72d8ed]"
                            >
                                Overview
                            </a>

                            {categories.map((category) => (
                                <a
                                    key={category}
                                    href={`#${category.toLowerCase()}`}
                                    className="block rounded-xl px-4 py-3 text-sm text-[#9db5c6] transition hover:bg-[#0c2237] hover:text-[#f3f8fa]"
                                >
                                    {category}
                                </a>
                            ))}
                        </nav>

                        {/* Server actions */}
                        <div className="mt-8 border-t border-[#47718c]/20 pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard")
                                }
                                className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#7894a8] transition hover:bg-[#0c2237] hover:text-[#f3f8fa]"
                            >
                                Change server
                            </button>

                            <a
                                href="/api/auth/logout"
                                className="mt-2 block rounded-xl px-4 py-3 text-sm text-[#7894a8] transition hover:bg-[#0c2237] hover:text-[#f3f8fa]"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Main dashboard */}
                <section className="min-w-0 flex-1 px-6 py-10 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-6xl">

                        {/* Header */}
                        <header id="overview">
                            <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                                Server Dashboard
                            </p>

                            <h1 className="mt-3 font-serif text-4xl font-semibold">
                                {result?.guild?.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-[#9db5c6]">
                                Manage Quill & Ink's features and
                                settings from one place.
                            </p>
                        </header>

                        {/* Server status */}
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">

                            <div className="rounded-2xl border border-[#47718c]/25 bg-[#091a2c] p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#7894a8]">
                                    Access
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#65d8eb]" />

                                    <p className="font-medium text-[#f3f8fa]">
                                        Verified
                                    </p>
                                </div>

                                <p className="mt-1 text-xs text-[#7894a8]">
                                    Owner / Administrator
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#47718c]/25 bg-[#091a2c] p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#7894a8]">
                                    Bot
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#65d8eb]" />

                                    <p className="font-medium text-[#f3f8fa]">
                                        Connected
                                    </p>
                                </div>

                                <p className="mt-1 text-xs text-[#7894a8]">
                                    Quill & Ink is in this server
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#47718c]/25 bg-[#091a2c] p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#7894a8]">
                                    Premium
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#65d8eb]" />

                                    <p className="font-medium text-[#f3f8fa]">
                                        Active
                                    </p>
                                </div>

                                <p className="mt-1 text-xs text-[#7894a8]">
                                    Premium features available
                                </p>
                            </div>

                        </div>

                        {/* Enabled plugins */}
                        <section className="mt-12">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#75d9eb]">
                                        Your plugins
                                    </p>

                                    <h2 className="mt-2 font-serif text-2xl font-semibold">
                                        Active features
                                    </h2>
                                </div>

                                <span className="text-sm text-[#7894a8]">
                                    {enabledPlugins.length} enabled
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {enabledPlugins.map((plugin) => (
                                    <PluginCard
                                        key={plugin.id}
                                        plugin={plugin}
                                        guildId={guildId}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Plugin categories */}
                        {categories.map((category) => {
                            const categoryPlugins =
                                getCategoryPlugins(category);

                            return (
                                <section
                                    key={category}
                                    id={category.toLowerCase()}
                                    className="mt-14 scroll-mt-8"
                                >
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#7894a8]">
                                            Plugin category
                                        </p>

                                        <h2 className="mt-2 font-serif text-2xl font-semibold">
                                            {category}
                                        </h2>
                                    </div>

                                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {categoryPlugins.map(
                                            (plugin) => (
                                                <PluginCard
                                                    key={plugin.id}
                                                    plugin={plugin}
                                                    guildId={guildId}
                                                />
                                            )
                                        )}
                                    </div>
                                </section>
                            );
                        })}

                        {/* Server settings placeholder */}
                        <section
                            id="settings"
                            className="mt-14 scroll-mt-8"
                        >
                            <div className="rounded-3xl border border-[#47718c]/20 bg-[#091a2c] p-7">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#7894a8]">
                                    Server settings
                                </p>

                                <h2 className="mt-2 font-serif text-2xl font-semibold">
                                    More controls are coming
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9db5c6]">
                                    Plugin management, ignored channels,
                                    ignored roles, and other server-wide
                                    settings will be added here as the
                                    dashboard grows.
                                </p>
                            </div>
                        </section>

                        <footer className="mt-12 border-t border-[#47718c]/20 pt-6 text-sm text-[#7894a8]">
                            Guild ID: {guildId}
                        </footer>

                    </div>
                </section>
            </div>
        </main>
    );
}

function PluginCard({
    plugin,
    guildId
}: {
    plugin: PluginDefinition;
    guildId: string;
}) {
    const isEnabled =
        plugin.status === "enabled";

    const isComingSoon =
        plugin.status === "coming_soon";

    return (
        <article className="flex h-full flex-col rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6 transition hover:border-[#47718c]/45">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#f3f8fa]">
                            {plugin.name}
                        </h3>

                        {plugin.premium && (
                            <span className="rounded-full border border-[#b99b54]/30 bg-[#211d12] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#d8bd79]">
                                Premium
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#9db5c6]">
                        {plugin.description}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${getStatusClasses(
                        plugin.status
                    )}`}
                >
                    {getStatusLabel(plugin.status)}
                </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#47718c]/20 pt-5">
                {isEnabled && plugin.configure ? (
                    <a
                        href={`/dashboard/${guildId}/automod`}
                        className="rounded-full border border-[#537c95]/60 bg-[#0a1b2d] px-5 py-2.5 text-sm font-medium text-[#eef8fa] transition hover:border-[#6bd9eb]/70 hover:bg-[#102b43]"
                    >
                        Configure
                    </a>
                ) : isEnabled ? (
                    <span className="rounded-full border border-[#47718c]/25 bg-[#0a1b2d] px-5 py-2.5 text-sm text-[#7894a8]">
                        Configurable in Discord
                    </span>
                ) : isComingSoon ? (
                    <span className="text-sm text-[#7894a8]">
                        Dashboard controls coming soon
                    </span>
                ) : (
                    <span className="text-sm text-[#7894a8]">
                        Plugin disabled
                    </span>
                )}
            </div>
        </article>
    );
}