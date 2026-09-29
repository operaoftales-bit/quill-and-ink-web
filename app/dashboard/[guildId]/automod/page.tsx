"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useParams,
    useRouter
} from "next/navigation";

type RuleType =
    | "WORD_FILTER"
    | "INVITE"
    | "MENTION_SPAM"
    | "REPEATED_MESSAGE"
    | "MESSAGE_SPAM"
    | "CAPS_SPAM"
    | "EMOJI_SPAM"
    | "LINK_FILTER"
    | "ATTACHMENT_FILTER";

type RuleAction =
    | "DELETE"
    | "WARN"
    | "TIMEOUT"
    | "KICK"
    | "BAN";

interface RuleActionData {
    id: string;
    action: RuleAction;
    order: number;
    timeoutDuration: number | null;
    reason: string | null;
}

interface AutoModRule {
    id: string;
    name: string;
    type: RuleType;
    enabled: boolean;
    action: RuleAction;
    deleteMessage: boolean;
    createWarning: boolean;
    threshold: number | null;
    windowMs: number | null;
    timeoutDuration: number | null;
    reason: string | null;
    actions: RuleActionData[];
}

interface AutoModConfig {
    id: string | null;
    guildId: string;
    enabled: boolean;
    logChannelId: string | null;
    warningEnabled: boolean;
    warningMessage: string | null;
    rules: AutoModRule[];
    blockedWords: {
        id: string;
        word: string;
        enabled: boolean;
    }[];
    ignoredChannels: {
        id: string;
        channelId: string;
    }[];
    ignoredRoles: {
        id: string;
        roleId: string;
    }[];
    ignoredUsers: {
        id: string;
        userId: string;
    }[];
}

interface AutoModResponse {
    ok: boolean;
    error?: string;
    guild?: {
        id: string;
        name: string;
    };
    automod?: AutoModConfig;
}

const RULES: {
    type: RuleType;
    name: string;
    description: string;
    advanced?: boolean;
    threshold?: boolean;
    window?: boolean;
}[] = [
    {
        type: "WORD_FILTER",
        name: "Word Filter",
        description:
            "Block configured words and phrases.",
    },
    {
        type: "INVITE",
        name: "Invite",
        description:
            "Detect Discord invite links.",
    },
    {
        type: "MENTION_SPAM",
        name: "Mention Spam",
        description:
            "Detect excessive user and role mentions.",
        threshold: true
    },
    {
        type: "REPEATED_MESSAGE",
        name: "Repeated Message",
        description:
            "Detect repeated messages from the same user."
    },
    {
        type: "MESSAGE_SPAM",
        name: "Message Spam",
        description:
            "Detect rapid message bursts.",
        advanced: true,
        threshold: true,
        window: true
    },
    {
        type: "CAPS_SPAM",
        name: "Caps Spam",
        description:
            "Detect excessive uppercase text.",
        advanced: true,
        threshold: true
    },
    {
        type: "EMOJI_SPAM",
        name: "Emoji Spam",
        description:
            "Detect excessive emoji usage.",
        advanced: true,
        threshold: true
    },
    {
        type: "LINK_FILTER",
        name: "Link Filter",
        description:
            "Detect links in messages.",
        advanced: true
    },
    {
        type: "ATTACHMENT_FILTER",
        name: "Attachment Filter",
        description:
            "Detect message attachments.",
        advanced: true
    }
];

const DEFAULT_RULES: AutoModRule[] =
    RULES.map(
        (definition, index) => ({
            id:
                `local-${definition.type}-${index}`,
            name:
                definition.name,
            type:
                definition.type,
            enabled:
                false,
            action:
                "DELETE",
            deleteMessage:
                true,
            createWarning:
                false,
            threshold:
                definition.threshold
                    ? 5
                    : null,
            windowMs:
                definition.window
                    ? 5000
                    : null,
            timeoutDuration:
                null,
            reason:
                null,
            actions: []
        })
    );

function cloneRules(
    rules: AutoModRule[]
): AutoModRule[] {
    return rules.map(
        rule => ({
            ...rule,
            actions:
                rule.actions.map(
                    action => ({
                        ...action
                    })
                )
        })
    );
}

function getInitialConfig(
    config: AutoModConfig
): AutoModConfig {
    const existing =
        new Map(
            config.rules.map(
                rule => [
                    rule.type,
                    rule
                ]
            )
        );

    const rules =
        DEFAULT_RULES.map(
            fallback => {
                const saved =
                    existing.get(
                        fallback.type
                    );

                return saved
                    ? {
                        ...fallback,
                        ...saved,
                        actions:
                            saved.actions.map(
                                action => ({
                                    ...action
                                })
                            )
                    }
                    : {
                        ...fallback
                    };
            }
        );

    return {
        ...config,
        rules
    };
}

function formatDuration(
    milliseconds: number | null
): string {
    if (
        !milliseconds ||
        milliseconds <= 0
    ) {
        return "—";
    }

    if (
        milliseconds >=
        60 * 60 * 1000
    ) {
        return `${Math.round(
            milliseconds /
            (60 * 60 * 1000)
        )}h`;
    }

    if (
        milliseconds >=
        60 * 1000
    ) {
        return `${Math.round(
            milliseconds /
            (60 * 1000)
        )}m`;
    }

    return `${Math.round(
        milliseconds / 1000
    )}s`;
}

export default function AutoModPage() {

    const params =
        useParams<{
            guildId: string;
        }>();

    const router =
        useRouter();

    const guildId =
        params.guildId;

    const [
        config,
        setConfig
    ] =
        useState<AutoModConfig | null>(
            null
        );

    const [
        guildName,
        setGuildName
    ] =
        useState(
            "Server"
        );

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        saving,
        setSaving
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState<string | null>(
            null
        );

    const [
        saved,
        setSaved
    ] =
        useState(false);

    const [
        blockedWordInput,
        setBlockedWordInput
    ] =
        useState("");

    const [
        ignoredChannelInput,
        setIgnoredChannelInput
    ] =
        useState("");

    const [
        ignoredRoleInput,
        setIgnoredRoleInput
    ] =
        useState("");

    const [
        ignoredUserInput,
        setIgnoredUserInput
    ] =
        useState("");

    useEffect(() => {

        let cancelled =
            false;

        async function load() {

            try {

                setLoading(true);
                setError(null);

                const response =
                    await fetch(
                        `/api/dashboard/automod?guildId=${encodeURIComponent(
                            guildId
                        )}`,
                        {
                            method:
                                "GET",
                            cache:
                                "no-store"
                        }
                    );

                const data =
                    (await response.json()) as AutoModResponse;

                if (
                    cancelled
                ) {
                    return;
                }

                if (
                    !response.ok ||
                    !data.ok ||
                    !data.automod
                ) {
                    throw new Error(
                        data.error ??
                        "Failed to load AutoMod."
                    );
                }

                setGuildName(
                    data.guild?.name ??
                    "Server"
                );

                setConfig(
                    getInitialConfig(
                        data.automod
                    )
                );

            } catch (loadError) {

                if (
                    cancelled
                ) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load AutoMod."
                );

            } finally {

                if (
                    !cancelled
                ) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };

    }, [guildId]);

    const enabledRuleCount =
        useMemo(
            () =>
                config?.rules.filter(
                    rule =>
                        rule.enabled
                ).length ?? 0,
            [config]
        );

    function updateConfig(
        update: Partial<AutoModConfig>
    ) {

        setConfig(
            current =>
                current
                    ? {
                        ...current,
                        ...update
                    }
                    : current
        );

        setSaved(false);
    }

    function updateRule(
        type: RuleType,
        update: Partial<AutoModRule>
    ) {

        setConfig(
            current => {

                if (!current) {
                    return current;
                }

                return {
                    ...current,
                    rules:
                        current.rules.map(
                            rule =>
                                rule.type === type
                                    ? {
                                        ...rule,
                                        ...update
                                    }
                                    : rule
                        )
                };
            }
        );

        setSaved(false);
    }

    function addBlockedWord() {

        const word =
            blockedWordInput.trim();

        if (
            !word ||
            !config
        ) {
            return;
        }

        if (
            config.blockedWords.some(
                entry =>
                    entry.word.toLowerCase() ===
                    word.toLowerCase()
            )
        ) {
            setBlockedWordInput("");
            return;
        }

        updateConfig({
            blockedWords: [
                ...config.blockedWords,
                {
                    id:
                        `local-${Date.now()}`,
                    word,
                    enabled:
                        true
                }
            ]
        });

        setBlockedWordInput("");
    }

    function addIgnored(
        kind:
            | "channel"
            | "role"
            | "user"
    ) {

        if (!config) {
            return;
        }

        const input =
            kind === "channel"
                ? ignoredChannelInput.trim()
                : kind === "role"
                    ? ignoredRoleInput.trim()
                    : ignoredUserInput.trim();

        if (
            !/^\d{15,25}$/.test(
                input
            )
        ) {
            return;
        }

        if (
            kind === "channel" &&
            !config.ignoredChannels.some(
                entry =>
                    entry.channelId ===
                    input
            )
        ) {
            updateConfig({
                ignoredChannels: [
                    ...config.ignoredChannels,
                    {
                        id:
                            `local-${Date.now()}`,
                        channelId:
                            input
                    }
                ]
            });
        }

        if (
            kind === "role" &&
            !config.ignoredRoles.some(
                entry =>
                    entry.roleId ===
                    input
            )
        ) {
            updateConfig({
                ignoredRoles: [
                    ...config.ignoredRoles,
                    {
                        id:
                            `local-${Date.now()}`,
                        roleId:
                            input
                    }
                ]
            });
        }

        if (
            kind === "user" &&
            !config.ignoredUsers.some(
                entry =>
                    entry.userId ===
                    input
            )
        ) {
            updateConfig({
                ignoredUsers: [
                    ...config.ignoredUsers,
                    {
                        id:
                            `local-${Date.now()}`,
                        userId:
                            input
                    }
                ]
            });
        }

        if (
            kind === "channel"
        ) {
            setIgnoredChannelInput("");
        }

        if (
            kind === "role"
        ) {
            setIgnoredRoleInput("");
        }

        if (
            kind === "user"
        ) {
            setIgnoredUserInput("");
        }
    }

    async function save() {

        if (!config) {
            return;
        }

        try {

            setSaving(true);
            setError(null);
            setSaved(false);

            const payload = {
                enabled:
                    config.enabled,

                logChannelId:
                    config.logChannelId,

                warningEnabled:
                    config.warningEnabled,

                warningMessage:
                    config.warningMessage,

                rules:
                    config.rules.map(
                        rule => ({
                            type:
                                rule.type,
                            name:
                                rule.name,
                            enabled:
                                rule.enabled,
                            action:
                                rule.action,
                            deleteMessage:
                                rule.deleteMessage,
                            createWarning:
                                rule.createWarning,
                            threshold:
                                rule.threshold,
                            windowMs:
                                rule.windowMs,
                            timeoutDuration:
                                rule.timeoutDuration,
                            reason:
                                rule.reason,

                            actions:
                                rule.actions.map(
                                    action => ({
                                        action:
                                            action.action,
                                        order:
                                            action.order,
                                        timeoutDuration:
                                            action.timeoutDuration,
                                        reason:
                                            action.reason
                                    })
                                )
                        })
                    ),

                blockedWords:
                    config.blockedWords
                        .filter(
                            entry =>
                                entry.enabled
                        )
                        .map(
                            entry =>
                                entry.word
                        ),

                ignoredChannels:
                    config.ignoredChannels.map(
                        entry =>
                            entry.channelId
                    ),

                ignoredRoles:
                    config.ignoredRoles.map(
                        entry =>
                            entry.roleId
                    ),

                ignoredUsers:
                    config.ignoredUsers.map(
                        entry =>
                            entry.userId
                    )
            };

            const response =
                await fetch(
                    `/api/dashboard/automod?guildId=${encodeURIComponent(
                        guildId
                    )}`,
                    {
                        method:
                            "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

            const data =
                (await response.json()) as AutoModResponse;

            if (
                !response.ok ||
                !data.ok ||
                !data.automod
            ) {
                throw new Error(
                    data.error ??
                    "Failed to save AutoMod."
                );
            }

            setConfig(
                getInitialConfig(
                    data.automod
                )
            );

            setSaved(true);

        } catch (saveError) {

            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save AutoMod."
            );

        } finally {

            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#061525] px-6 py-16 text-[#f5f7f8]">
                <div className="mx-auto max-w-6xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                        Quill & Ink Dashboard
                    </p>

                    <h1 className="mt-3 font-serif text-4xl font-semibold">
                        Loading AutoMod
                    </h1>

                    <p className="mt-4 text-[#9db5c6]">
                        Verifying access and loading your server configuration…
                    </p>
                </div>
            </main>
        );
    }

    if (error && !config) {
        return (
            <main className="min-h-screen bg-[#061525] px-6 py-16 text-[#f5f7f8]">
                <div className="mx-auto max-w-3xl">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/dashboard/${guildId}`
                            )
                        }
                        className="text-sm text-[#75d9eb] hover:text-[#b9edf5]"
                    >
                        ← Back to dashboard
                    </button>

                    <div className="mt-8 rounded-3xl border border-red-400/20 bg-[#170f16] p-8">
                        <h1 className="text-2xl font-semibold">
                            AutoMod could not be loaded
                        </h1>

                        <p className="mt-3 text-[#d7b8c1]">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!config) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#061525] px-4 py-8 text-[#f5f7f8] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                <header className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/dashboard/${guildId}`
                            )
                        }
                        className="text-sm text-[#7894a8] transition hover:text-[#75d9eb]"
                    >
                        ← {guildName}
                    </button>

                    <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-[#75d9eb]">
                                Moderation
                            </p>

                            <h1 className="mt-2 font-serif text-4xl font-semibold">
                                AutoMod
                            </h1>

                            <p className="mt-3 max-w-2xl text-[#9db5c6]">
                                Configure automatic protection using the same
                                AutoMod system used by Quill & Ink at runtime.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            <span className="rounded-full border border-[#47718c]/30 bg-[#091a2c] px-4 py-2 text-sm text-[#9db5c6]">
                                {enabledRuleCount} rules enabled
                            </span>

                            <button
                                type="button"
                                onClick={save}
                                disabled={saving}
                                className="rounded-full border border-[#65d8eb]/60 bg-[#0d3445] px-6 py-2.5 text-sm font-medium text-[#eefcff] transition hover:bg-[#124459] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving…"
                                    : saved
                                        ? "Saved"
                                        : "Save changes"}
                            </button>

                        </div>

                    </div>
                </header>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-400/20 bg-[#170f16] px-5 py-4 text-sm text-[#e2bec7]">
                        {error}
                    </div>
                )}

                <section className="grid gap-5 lg:grid-cols-3">

                    <article className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6 lg:col-span-2">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    AutoMod protection
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-[#9db5c6]">
                                    Turn the AutoMod configuration on or off
                                    for this server.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    updateConfig({
                                        enabled:
                                            !config.enabled
                                    })
                                }
                                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                                    config.enabled
                                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                        : "border-[#47718c]/30 bg-[#0a1b2d] text-[#7894a8]"
                                }`}
                            >
                                {config.enabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </button>

                        </div>

                    </article>

                    <article className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6">

                        <p className="text-xs uppercase tracking-[0.2em] text-[#7894a8]">
                            Status
                        </p>

                        <p className="mt-3 text-2xl font-semibold">
                            {config.enabled
                                ? "Protected"
                                : "Inactive"}
                        </p>

                        <p className="mt-2 text-sm text-[#9db5c6]">
                            {enabledRuleCount} of {config.rules.length} detection
                            rules currently enabled.
                        </p>

                    </article>

                </section>

                <section className="mt-8 rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6">

                    <div className="max-w-2xl">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#7894a8]">
                            Warnings & logging
                        </p>

                        <h2 className="mt-2 text-xl font-semibold">
                            Moderation feedback
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#9db5c6]">
                            Control warning messages and where AutoMod logs
                            should be sent.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">

                        <label className="block">
                            <span className="text-sm font-medium">
                                Log channel ID
                            </span>

                            <input
                                value={
                                    config.logChannelId ?? ""
                                }
                                onChange={event =>
                                    updateConfig({
                                        logChannelId:
                                            event.target.value ||
                                            null
                                    })
                                }
                                placeholder="Discord channel ID"
                                className="mt-2 w-full rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-4 py-3 text-sm text-[#f3f8fa] outline-none transition placeholder:text-[#526f82] focus:border-[#65d8eb]/60"
                            />
                        </label>

                        <div className="rounded-2xl border border-[#47718c]/20 bg-[#071a2b] p-4">

                            <div className="flex items-center justify-between gap-4">

                                <div>
                                    <p className="text-sm font-medium">
                                        Warning messages
                                    </p>

                                    <p className="mt-1 text-xs text-[#7894a8]">
                                        Show AutoMod warning messages.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateConfig({
                                            warningEnabled:
                                                !config.warningEnabled
                                        })
                                    }
                                    className={`rounded-full border px-4 py-2 text-xs font-medium ${
                                        config.warningEnabled
                                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                            : "border-[#47718c]/30 text-[#7894a8]"
                                    }`}
                                >
                                    {config.warningEnabled
                                        ? "Enabled"
                                        : "Disabled"}
                                </button>

                            </div>

                        </div>

                        <label className="block md:col-span-2">
                            <span className="text-sm font-medium">
                                Warning message
                            </span>

                            <textarea
                                value={
                                    config.warningMessage ?? ""
                                }
                                onChange={event =>
                                    updateConfig({
                                        warningMessage:
                                            event.target.value ||
                                            null
                                    })
                                }
                                rows={3}
                                placeholder="Example: {user}, your message was removed because it violated {reason}."
                                className="mt-2 w-full resize-y rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-4 py-3 text-sm text-[#f3f8fa] outline-none transition placeholder:text-[#526f82] focus:border-[#65d8eb]/60"
                            />

                            <p className="mt-2 text-xs text-[#617e91]">
                                Supported placeholders: {"{user}"}, {"{reason}"},
                                {" {warningId}"}
                            </p>
                        </label>

                    </div>

                </section>

                <section className="mt-8">

                    <div className="mb-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#7894a8]">
                            Detection
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                            Rules
                        </h2>

                        <p className="mt-2 text-sm text-[#9db5c6]">
                            Configure each detection rule individually.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">

                        {config.rules.map(
                            rule => {

                                const definition =
                                    RULES.find(
                                        item =>
                                            item.type ===
                                            rule.type
                                    );

                                return (
                                    <article
                                        key={rule.type}
                                        className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h3 className="text-lg font-semibold">
                                                        {rule.name}
                                                    </h3>

                                                    {definition?.advanced && (
                                                        <span className="rounded-full border border-[#b99b54]/30 bg-[#211d12] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#d8bd79]">
                                                            Advanced
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="mt-2 text-sm leading-6 text-[#9db5c6]">
                                                    {definition?.description}
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateRule(
                                                        rule.type,
                                                        {
                                                            enabled:
                                                                !rule.enabled
                                                        }
                                                    )
                                                }
                                                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium ${
                                                    rule.enabled
                                                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                                        : "border-[#47718c]/30 bg-[#0a1b2d] text-[#7894a8]"
                                                }`}
                                            >
                                                {rule.enabled
                                                    ? "Enabled"
                                                    : "Disabled"}
                                            </button>

                                        </div>

                                        <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                            <label>
                                                <span className="text-xs uppercase tracking-[0.15em] text-[#7894a8]">
                                                    Action
                                                </span>

                                                <select
                                                    value={
                                                        rule.action
                                                    }
                                                    onChange={event =>
                                                        updateRule(
                                                            rule.type,
                                                            {
                                                                action:
                                                                    event.target.value as RuleAction
                                                            }
                                                        )
                                                    }
                                                    className="mt-2 w-full rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-3 py-3 text-sm text-[#f3f8fa] outline-none focus:border-[#65d8eb]/60"
                                                >
                                                    <option value="DELETE">
                                                        Delete
                                                    </option>
                                                    <option value="WARN">
                                                        Warn
                                                    </option>
                                                    <option value="TIMEOUT">
                                                        Timeout
                                                    </option>
                                                    <option value="KICK">
                                                        Kick
                                                    </option>
                                                    <option value="BAN">
                                                        Ban
                                                    </option>
                                                </select>
                                            </label>

                                            <label>
                                                <span className="text-xs uppercase tracking-[0.15em] text-[#7894a8]">
                                                    Reason
                                                </span>

                                                <input
                                                    value={
                                                        rule.reason ?? ""
                                                    }
                                                    onChange={event =>
                                                        updateRule(
                                                            rule.type,
                                                            {
                                                                reason:
                                                                    event.target.value ||
                                                                    null
                                                            }
                                                        )
                                                    }
                                                    placeholder="Moderation reason"
                                                    className="mt-2 w-full rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-3 py-3 text-sm text-[#f3f8fa] outline-none placeholder:text-[#526f82] focus:border-[#65d8eb]/60"
                                                />
                                            </label>

                                            {definition?.threshold && (
                                                <label>
                                                    <span className="text-xs uppercase tracking-[0.15em] text-[#7894a8]">
                                                        Threshold
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={
                                                            rule.threshold ??
                                                            ""
                                                        }
                                                        onChange={event =>
                                                            updateRule(
                                                                rule.type,
                                                                {
                                                                    threshold:
                                                                        event.target.value
                                                                            ? Number(
                                                                                event.target.value
                                                                            )
                                                                            : null
                                                                }
                                                            )
                                                        }
                                                        className="mt-2 w-full rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-3 py-3 text-sm text-[#f3f8fa] outline-none focus:border-[#65d8eb]/60"
                                                    />
                                                </label>
                                            )}

                                            {definition?.window && (
                                                <label>
                                                    <span className="text-xs uppercase tracking-[0.15em] text-[#7894a8]">
                                                        Window
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min={1000}
                                                        value={
                                                            rule.windowMs ??
                                                            ""
                                                        }
                                                        onChange={event =>
                                                            updateRule(
                                                                rule.type,
                                                                {
                                                                    windowMs:
                                                                        event.target.value
                                                                            ? Number(
                                                                                event.target.value
                                                                            )
                                                                            : null
                                                                }
                                                            )
                                                        }
                                                        className="mt-2 w-full rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-3 py-3 text-sm text-[#f3f8fa] outline-none focus:border-[#65d8eb]/60"
                                                    />

                                                    <p className="mt-1 text-xs text-[#617e91]">
                                                        Milliseconds · current: {formatDuration(
                                                            rule.windowMs
                                                        )}
                                                    </p>
                                                </label>
                                            )}

                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-5 border-t border-[#47718c]/20 pt-5">

                                            <label className="flex items-center gap-2 text-sm text-[#b4c7d2]">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        rule.deleteMessage
                                                    }
                                                    onChange={event =>
                                                        updateRule(
                                                            rule.type,
                                                            {
                                                                deleteMessage:
                                                                    event.target.checked
                                                            }
                                                        )
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                Delete message
                                            </label>

                                            <label className="flex items-center gap-2 text-sm text-[#b4c7d2]">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        rule.createWarning
                                                    }
                                                    onChange={event =>
                                                        updateRule(
                                                            rule.type,
                                                            {
                                                                createWarning:
                                                                    event.target.checked
                                                            }
                                                        )
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                Create warning
                                            </label>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>

                </section>

                <section className="mt-8 grid gap-5 lg:grid-cols-2">

                    <ListEditor
                        title="Blocked words"
                        description="Words and phrases used by the Word Filter."
                        values={
                            config.blockedWords.map(
                                entry => ({
                                    id:
                                        entry.id,
                                    value:
                                        entry.word
                                })
                            )
                        }
                        inputValue={
                            blockedWordInput
                        }
                        setInputValue={
                            setBlockedWordInput
                        }
                        onAdd={
                            addBlockedWord
                        }
                        onRemove={id =>
                            updateConfig({
                                blockedWords:
                                    config.blockedWords.filter(
                                        entry =>
                                            entry.id !==
                                            id
                                    )
                            })
                        }
                        placeholder="Word or phrase"
                    />

                    <ListEditor
                        title="Ignored channels"
                        description="Channels where AutoMod will not act."
                        values={
                            config.ignoredChannels.map(
                                entry => ({
                                    id:
                                        entry.id,
                                    value:
                                        entry.channelId
                                })
                            )
                        }
                        inputValue={
                            ignoredChannelInput
                        }
                        setInputValue={
                            setIgnoredChannelInput
                        }
                        onAdd={() =>
                            addIgnored(
                                "channel"
                            )
                        }
                        onRemove={id =>
                            updateConfig({
                                ignoredChannels:
                                    config.ignoredChannels.filter(
                                        entry =>
                                            entry.id !==
                                            id
                                    )
                            })
                        }
                        placeholder="Channel ID"
                    />

                    <ListEditor
                        title="Ignored roles"
                        description="Roles whose members are ignored by AutoMod."
                        values={
                            config.ignoredRoles.map(
                                entry => ({
                                    id:
                                        entry.id,
                                    value:
                                        entry.roleId
                                })
                            )
                        }
                        inputValue={
                            ignoredRoleInput
                        }
                        setInputValue={
                            setIgnoredRoleInput
                        }
                        onAdd={() =>
                            addIgnored(
                                "role"
                            )
                        }
                        onRemove={id =>
                            updateConfig({
                                ignoredRoles:
                                    config.ignoredRoles.filter(
                                        entry =>
                                            entry.id !==
                                            id
                                    )
                            })
                        }
                        placeholder="Role ID"
                    />

                    <ListEditor
                        title="Ignored users"
                        description="Users who should be excluded from AutoMod."
                        values={
                            config.ignoredUsers.map(
                                entry => ({
                                    id:
                                        entry.id,
                                    value:
                                        entry.userId
                                })
                            )
                        }
                        inputValue={
                            ignoredUserInput
                        }
                        setInputValue={
                            setIgnoredUserInput
                        }
                        onAdd={() =>
                            addIgnored(
                                "user"
                            )
                        }
                        onRemove={id =>
                            updateConfig({
                                ignoredUsers:
                                    config.ignoredUsers.filter(
                                        entry =>
                                            entry.id !==
                                            id
                                    )
                            })
                        }
                        placeholder="User ID"
                    />

                </section>

                <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#47718c]/20 pt-6 pb-10">

                    <p className="text-xs text-[#617e91]">
                        Guild ID: {guildId}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/dashboard/${guildId}`
                            )
                        }
                        className="text-sm text-[#7894a8] hover:text-[#75d9eb]"
                    >
                        Back to dashboard
                    </button>

                </footer>

            </div>
        </main>
    );
}

function ListEditor({
    title,
    description,
    values,
    inputValue,
    setInputValue,
    onAdd,
    onRemove,
    placeholder
}: {
    title: string;
    description: string;
    values: {
        id: string;
        value: string;
    }[];
    inputValue: string;
    setInputValue:
        (value: string) => void;
    onAdd: () => void;
    onRemove:
        (id: string) => void;
    placeholder: string;
}) {

    return (
        <article className="rounded-3xl border border-[#47718c]/25 bg-[#091a2c] p-6">

            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#9db5c6]">
                {description}
            </p>

            <div className="mt-5 flex gap-2">

                <input
                    value={inputValue}
                    onChange={event =>
                        setInputValue(
                            event.target.value
                        )
                    }
                    onKeyDown={event => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            event.preventDefault();
                            onAdd();
                        }
                    }}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 rounded-2xl border border-[#47718c]/30 bg-[#071a2b] px-4 py-3 text-sm text-[#f3f8fa] outline-none placeholder:text-[#526f82] focus:border-[#65d8eb]/60"
                />

                <button
                    type="button"
                    onClick={onAdd}
                    className="rounded-2xl border border-[#47718c]/40 bg-[#0a2032] px-4 py-3 text-sm text-[#dcecf2] hover:border-[#65d8eb]/50"
                >
                    Add
                </button>

            </div>

            <div className="mt-4 space-y-2">

                {values.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#47718c]/20 px-4 py-4 text-sm text-[#617e91]">
                        Nothing configured yet.
                    </p>
                ) : (
                    values.map(
                        entry => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-[#47718c]/20 bg-[#071a2b] px-4 py-3"
                            >

                                <code className="min-w-0 truncate text-sm text-[#b8d4df]">
                                    {entry.value}
                                </code>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            entry.id
                                        )
                                    }
                                    className="shrink-0 text-xs text-[#a47b86] hover:text-[#e2a8b5]"
                                >
                                    Remove
                                </button>

                            </div>
                        )
                    )
                )}

            </div>

        </article>
    );
}