"use client";

import {
    useEffect,
    useMemo,
    useState,
    type InputHTMLAttributes,
} from "react";

import { useParams, useRouter } from "next/navigation";

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
    allowedDomains: {
        id: string;
        domain: string;
    }[];
    allowedAttachments: {
        id: string;
        extension: string;
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

interface RuleDefinition {
    type: RuleType;
    name: string;
    description: string;
    howItWorks: string;
    threshold?: {
        default: number;
        min: number;
        max: number;
        label: string;
        help: string;
        suffix?: string;
    };
    window?: {
        default: number;
        min: number;
        label: string;
        help: string;
    };
}

const RULES: RuleDefinition[] = [
    {
        type: "WORD_FILTER",
        name: "Word Filter",
        description: "Block words or phrases you don't allow.",
        howItWorks: "Matches message text against your blocked-word list.",
    },
    {
        type: "INVITE",
        name: "Invite Filter",
        description: "Block Discord invite links.",
        howItWorks: "Checks messages for Discord invite links.",
    },
    {
        type: "MENTION_SPAM",
        name: "Mention Spam",
        description: "Stop users from sending too many mentions.",
        howItWorks:
            "Triggers when a message contains at least the configured number of user or role mentions.",
        threshold: {
            default: 10,
            min: 1,
            max: 1_000_000,
            label: "Mention threshold",
            help: "Minimum user or role mentions in one message.",
        },
    },
    {
        type: "REPEATED_MESSAGE",
        name: "Repeated Message",
        description: "Catch the same message sent repeatedly.",
        howItWorks: "Detects repeated messages from the same user.",
    },
    {
        type: "MESSAGE_SPAM",
        name: "Message Spam",
        description: "Limit rapid message bursts.",
        howItWorks:
            "Counts messages from each user within the configured time window.",
        threshold: {
            default: 5,
            min: 1,
            max: 1_000_000,
            label: "Message threshold",
            help: "Minimum messages counted during the time window.",
        },
        window: {
            default: 5000,
            min: 1000,
            label: "Time window",
            help: "How long the message count is tracked, in milliseconds.",
        },
    },
    {
        type: "CAPS_SPAM",
        name: "Caps Spam",
        description: "Limit excessive uppercase text.",
        howItWorks:
            "Checks the percentage of A–Z letters that are uppercase.",
        threshold: {
            default: 70,
            min: 1,
            max: 100,
            label: "Uppercase percentage",
            help: "Triggers when uppercase letters reach this percentage of A–Z letters.",
            suffix: "%",
        },
    },
    {
        type: "EMOJI_SPAM",
        name: "Emoji Spam",
        description: "Limit excessive emoji use.",
        howItWorks:
            "Counts custom and Unicode emoji in each message.",
        threshold: {
            default: 10,
            min: 1,
            max: 1_000_000,
            label: "Emoji threshold",
            help: "Minimum emoji counted in one message.",
        },
    },
    {
        type: "LINK_FILTER",
        name: "Link Filter",
        description: "Control which web domains can be posted.",
        howItWorks:
            "Checks each detected link and triggers if its domain is not on the allowed list.",
    },
    {
        type: "ATTACHMENT_FILTER",
        name: "Attachment Filter",
        description: "Control which file types can be posted.",
        howItWorks:
            "Checks each attachment extension and triggers if it is not on the allowed list.",
    },
];

const ACTIONS: RuleAction[] = [
    "DELETE",
    "WARN",
    "TIMEOUT",
    "KICK",
    "BAN",
];

const DISCORD_ID_REGEX = /^\d{15,25}$/;

function createLocalId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

function normalizeNullableText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function parseIntegerInput(
    value: string,
    min: number,
    max: number
): number | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const parsed = Number(trimmed);

    if (!Number.isFinite(parsed)) {
        return null;
    }

    const integer = Math.trunc(parsed);

    if (integer < min) {
        return min;
    }

    if (integer > max) {
        return max;
    }

    return integer;
}

function parseIntegerWithoutMaximum(
    value: string,
    min: number
): number | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const parsed = Number(trimmed);

    if (!Number.isFinite(parsed)) {
        return null;
    }

    const integer = Math.trunc(parsed);

    return Math.max(min, integer);
}

function normalizeAllowedDomain(value: string): string | null {
    let domain = value.trim().toLowerCase();

    if (!domain) {
        return null;
    }

    domain = domain.replace(/\.$/, "");

    if (
        domain.length > 253 ||
        !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(domain)
    ) {
        return null;
    }

    const labels = domain.split(".");

    if (labels.length < 2) {
        return null;
    }

    for (const label of labels) {
        if (
            label.length < 1 ||
            label.length > 63 ||
            label.startsWith("-") ||
            label.endsWith("-")
        ) {
            return null;
        }
    }

    return domain;
}

function normalizeAllowedAttachment(value: string): string | null {
    let extension = value.trim().toLowerCase();

    if (!extension) {
        return null;
    }

    extension = extension.replace(/^\.+/, "");

    if (
        !extension ||
        extension.length > 50 ||
        !/^[a-z0-9_-]+$/.test(extension)
    ) {
        return null;
    }

    return extension;
}

function cleanStringList(values: string[]): string[] {
    const result: string[] = [];
    const seen = new Set<string>();

    for (const rawValue of values) {
        const value = normalizeNullableText(rawValue);

        if (!value) {
            continue;
        }

        const key = value.toLowerCase();

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(value);
    }

    return result;
}

function cleanDiscordIdList(values: string[]): string[] {
    const result: string[] = [];
    const seen = new Set<string>();

    for (const rawValue of values) {
        const value = normalizeNullableText(rawValue);

        if (!value || !DISCORD_ID_REGEX.test(value)) {
            continue;
        }

        if (seen.has(value)) {
            continue;
        }

        seen.add(value);
        result.push(value);
    }

    return result;
}

function cleanAllowedDomains(values: { domain: string }[]): string[] {
    const result: string[] = [];
    const seen = new Set<string>();

    for (const item of values) {
        const domain = normalizeAllowedDomain(item.domain);

        if (!domain || seen.has(domain)) {
            continue;
        }

        seen.add(domain);
        result.push(domain);
    }

    return result;
}

function cleanAllowedAttachments(
    values: { extension: string }[]
): string[] {
    const result: string[] = [];
    const seen = new Set<string>();

    for (const item of values) {
        const extension = normalizeAllowedAttachment(item.extension);

        if (!extension || seen.has(extension)) {
            continue;
        }

        seen.add(extension);
        result.push(extension);
    }

    return result;
}

function getRuleDefinition(
    type: RuleType
): RuleDefinition | undefined {
    return RULES.find((rule) => rule.type === type);
}

function formatDuration(value: number | null): string {
    if (!value || value <= 0) {
        return "Not set";
    }

    if (value % 1000 === 0) {
        const seconds = value / 1000;

        if (seconds >= 60 && seconds % 60 === 0) {
            return `${seconds / 60}m`;
        }

        return `${seconds}s`;
    }

    return `${value}ms`;
}

function getInitialConfig(
    guildId: string,
    config?: AutoModConfig
): AutoModConfig {
    if (!config) {
        return {
            id: null,
            guildId,
            enabled: true,
            logChannelId: null,
            warningEnabled: true,
            warningMessage: null,
            rules: [],
            blockedWords: [],
            ignoredChannels: [],
            ignoredRoles: [],
            ignoredUsers: [],
            allowedDomains: [],
            allowedAttachments: [],
        };
    }

    return {
        ...config,
        guildId,
        logChannelId: normalizeNullableText(config.logChannelId),
        warningMessage: normalizeNullableText(config.warningMessage),
        rules: config.rules.map((rule) => ({
            ...rule,
            threshold:
                typeof rule.threshold === "number" &&
                Number.isFinite(rule.threshold)
                    ? Math.trunc(rule.threshold)
                    : null,
            windowMs:
                typeof rule.windowMs === "number" &&
                Number.isFinite(rule.windowMs)
                    ? Math.trunc(rule.windowMs)
                    : null,
            timeoutDuration:
                typeof rule.timeoutDuration === "number" &&
                Number.isFinite(rule.timeoutDuration)
                    ? Math.trunc(rule.timeoutDuration)
                    : null,
            reason: normalizeNullableText(rule.reason),
            actions: [...(rule.actions ?? [])],
        })),
        blockedWords: [...config.blockedWords],
        ignoredChannels: [...config.ignoredChannels],
        ignoredRoles: [...config.ignoredRoles],
        ignoredUsers: [...config.ignoredUsers],
        allowedDomains: (config.allowedDomains ?? []).map(
            (item) => ({
                ...item,
                domain:
                    normalizeAllowedDomain(item.domain) ??
                    item.domain.trim().toLowerCase(),
            })
        ),
        allowedAttachments: (config.allowedAttachments ?? []).map(
            (item) => ({
                ...item,
                extension:
                    normalizeAllowedAttachment(item.extension) ??
                    item.extension.trim().toLowerCase(),
            })
        ),
    };
}

function ListEditor({
    label,
    description,
    values,
    inputValue,
    setInputValue,
    onAdd,
    onRemove,
    placeholder,
    maxItems,
    helperText,
    inputMode,
}: {
    label: string;
    description: string;
    values: string[];
    inputValue: string;
    setInputValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (value: string) => void;
    placeholder: string;
    maxItems?: number;
    helperText?: string;
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    const atLimit =
        maxItems !== undefined && values.length >= maxItems;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        {label}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                        {description}
                    </p>
                </div>

                {maxItems !== undefined && (
                    <span className="shrink-0 text-xs text-slate-500">
                        {values.length}/{maxItems}
                    </span>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(event) =>
                        setInputValue(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            onAdd();
                        }
                    }}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    disabled={atLimit}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                    type="button"
                    onClick={onAdd}
                    disabled={atLimit}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Add
                </button>
            </div>

            {helperText && (
                <p className="mt-2 text-xs text-slate-500">
                    {helperText}
                </p>
            )}

            {values.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {values.map((value) => (
                        <div
                            key={value}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2.5 py-1.5"
                        >
                            <code className="text-xs text-slate-300">
                                {value}
                            </code>

                            <button
                                type="button"
                                onClick={() => onRemove(value)}
                                aria-label={`Remove ${value}`}
                                className="text-slate-500 transition hover:text-red-300"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {values.length === 0 && (
                <p className="mt-4 text-xs text-slate-600">
                    Nothing added yet.
                </p>
            )}
        </div>
    );
}

export default function AdvancedAutoModPage() {
    const params = useParams<{ guildId: string }>();
    const router = useRouter();

    const guildId = params.guildId;

    const [config, setConfig] = useState<AutoModConfig | null>(
        null
    );
    const [guildName, setGuildName] = useState("Server");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [blockedWordInput, setBlockedWordInput] = useState("");
    const [ignoredChannelInput, setIgnoredChannelInput] =
        useState("");
    const [ignoredRoleInput, setIgnoredRoleInput] =
        useState("");
    const [ignoredUserInput, setIgnoredUserInput] =
        useState("");
    const [allowedDomainInput, setAllowedDomainInput] =
        useState("");
    const [allowedAttachmentInput, setAllowedAttachmentInput] =
        useState("");

    useEffect(() => {
        if (!guildId) {
            setError("Missing server ID.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadConfiguration() {
            setLoading(true);
            setSaved(false);
            setError(null);
            setConfig(null);
            setGuildName("Server");

            try {
                const response = await fetch(
                    `/api/dashboard/automod?guildId=${encodeURIComponent(
                        guildId
                    )}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const data =
                    (await response.json()) as AutoModResponse;

                if (cancelled) {
                    return;
                }

                if (!response.ok || !data.ok) {
                    throw new Error(
                        data.error ||
                            "Failed to load AutoMod configuration."
                    );
                }

                setGuildName(data.guild?.name || "Server");
                setConfig(
                    getInitialConfig(guildId, data.automod)
                );
            } catch (loadError) {
                if (cancelled) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load AutoMod configuration."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadConfiguration();

        return () => {
            cancelled = true;
        };
    }, [guildId]);

    const enabledRuleCount = useMemo(
        () =>
            config?.rules.filter((rule) => rule.enabled)
                .length ?? 0,
        [config]
    );

    function updateConfig(
        updater: (
            current: AutoModConfig
        ) => AutoModConfig
    ) {
        setConfig((current) => {
            if (!current) {
                return current;
            }

            return updater(current);
        });

        setSaved(false);
    }

    function updateRule(
        ruleId: string,
        updater: (rule: AutoModRule) => AutoModRule
    ) {
        updateConfig((current) => ({
            ...current,
            rules: current.rules.map((rule) =>
                rule.id === ruleId ? updater(rule) : rule
            ),
        }));
    }

    function addRule(type: RuleType) {
        const definition = getRuleDefinition(type);

        if (!definition) {
            return;
        }

        const existing = config?.rules.some(
            (rule) => rule.type === type
        );

        if (existing) {
            return;
        }

        const rule: AutoModRule = {
            id: createLocalId("rule"),
            name: definition.name,
            type,
            enabled: false,
            action: "WARN",
            deleteMessage: true,
            createWarning: true,
            threshold:
                definition.threshold?.default ?? null,
            windowMs:
                definition.window?.default ?? null,
            timeoutDuration: null,
            reason: null,
            actions: [],
        };

        updateConfig((current) => ({
            ...current,
            rules: [...current.rules, rule],
        }));
    }

    function removeRule(ruleId: string) {
        updateConfig((current) => ({
            ...current,
            rules: current.rules.filter(
                (rule) => rule.id !== ruleId
            ),
        }));
    }

    function addBlockedWord() {
        const word = normalizeNullableText(blockedWordInput);

        if (!word) {
            return;
        }

        if (
            config?.blockedWords.some(
                (item) =>
                    item.word.trim().toLowerCase() ===
                    word.toLowerCase()
            )
        ) {
            setBlockedWordInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            blockedWords: [
                ...current.blockedWords,
                {
                    id: createLocalId("word"),
                    word,
                    enabled: true,
                },
            ],
        }));

        setBlockedWordInput("");
    }

    function removeBlockedWord(id: string) {
        updateConfig((current) => ({
            ...current,
            blockedWords: current.blockedWords.filter(
                (item) => item.id !== id
            ),
        }));
    }

    function addIgnoredChannel() {
        const channelId =
            normalizeNullableText(ignoredChannelInput);

        if (
            !channelId ||
            !DISCORD_ID_REGEX.test(channelId)
        ) {
            return;
        }

        if (
            config?.ignoredChannels.some(
                (item) => item.channelId === channelId
            )
        ) {
            setIgnoredChannelInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            ignoredChannels: [
                ...current.ignoredChannels,
                {
                    id: createLocalId("channel"),
                    channelId,
                },
            ],
        }));

        setIgnoredChannelInput("");
    }

    function removeIgnoredChannel(id: string) {
        updateConfig((current) => ({
            ...current,
            ignoredChannels:
                current.ignoredChannels.filter(
                    (item) => item.id !== id
                ),
        }));
    }

    function addIgnoredRole() {
        const roleId = normalizeNullableText(
            ignoredRoleInput
        );

        if (!roleId || !DISCORD_ID_REGEX.test(roleId)) {
            return;
        }

        if (
            config?.ignoredRoles.some(
                (item) => item.roleId === roleId
            )
        ) {
            setIgnoredRoleInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            ignoredRoles: [
                ...current.ignoredRoles,
                {
                    id: createLocalId("role"),
                    roleId,
                },
            ],
        }));

        setIgnoredRoleInput("");
    }

    function removeIgnoredRole(id: string) {
        updateConfig((current) => ({
            ...current,
            ignoredRoles: current.ignoredRoles.filter(
                (item) => item.id !== id
            ),
        }));
    }

    function addIgnoredUser() {
        const userId = normalizeNullableText(
            ignoredUserInput
        );

        if (!userId || !DISCORD_ID_REGEX.test(userId)) {
            return;
        }

        if (
            config?.ignoredUsers.some(
                (item) => item.userId === userId
            )
        ) {
            setIgnoredUserInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            ignoredUsers: [
                ...current.ignoredUsers,
                {
                    id: createLocalId("user"),
                    userId,
                },
            ],
        }));

        setIgnoredUserInput("");
    }

    function removeIgnoredUser(id: string) {
        updateConfig((current) => ({
            ...current,
            ignoredUsers: current.ignoredUsers.filter(
                (item) => item.id !== id
            ),
        }));
    }

    function addAllowedDomain() {
        if (!config) {
            return;
        }

        if (config.allowedDomains.length >= 500) {
            return;
        }

        const domain = normalizeAllowedDomain(
            allowedDomainInput
        );

        if (!domain) {
            return;
        }

        if (
            config.allowedDomains.some(
                (item) => item.domain === domain
            )
        ) {
            setAllowedDomainInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            allowedDomains: [
                ...current.allowedDomains,
                {
                    id: createLocalId("domain"),
                    domain,
                },
            ],
        }));

        setAllowedDomainInput("");
    }

    function removeAllowedDomain(id: string) {
        updateConfig((current) => ({
            ...current,
            allowedDomains:
                current.allowedDomains.filter(
                    (item) => item.id !== id
                ),
        }));
    }

    function addAllowedAttachment() {
        if (!config) {
            return;
        }

        if (config.allowedAttachments.length >= 500) {
            return;
        }

        const extension = normalizeAllowedAttachment(
            allowedAttachmentInput
        );

        if (!extension) {
            return;
        }

        if (
            config.allowedAttachments.some(
                (item) => item.extension === extension
            )
        ) {
            setAllowedAttachmentInput("");
            return;
        }

        updateConfig((current) => ({
            ...current,
            allowedAttachments: [
                ...current.allowedAttachments,
                {
                    id: createLocalId("attachment"),
                    extension,
                },
            ],
        }));

        setAllowedAttachmentInput("");
    }

    function removeAllowedAttachment(id: string) {
        updateConfig((current) => ({
            ...current,
            allowedAttachments:
                current.allowedAttachments.filter(
                    (item) => item.id !== id
                ),
        }));
    }

    async function saveConfiguration() {
        if (!config || saving) {
            return;
        }

        setSaving(true);
        setSaved(false);
        setError(null);

        try {
            const payload = {
                enabled: config.enabled,
                logChannelId: normalizeNullableText(
                    config.logChannelId
                ),
                warningEnabled: config.warningEnabled,
                warningMessage: normalizeNullableText(
                    config.warningMessage
                ),

                rules: config.rules.map((rule) => {
                    const definition = getRuleDefinition(
                        rule.type
                    );

                    const thresholdDefinition =
                        definition?.threshold;

                    const windowDefinition =
                        definition?.window;

                    const threshold =
                        thresholdDefinition &&
                        rule.threshold !== null
                            ? parseIntegerInput(
                                  String(rule.threshold),
                                  thresholdDefinition.min,
                                  thresholdDefinition.max
                              )
                            : null;

                    const windowMs =
                        windowDefinition &&
                        rule.windowMs !== null
                            ? parseIntegerWithoutMaximum(
                                  String(rule.windowMs),
                                  windowDefinition.min
                              )
                            : null;

                    return {
                        type: rule.type,
                        name:
                            normalizeNullableText(
                                rule.name
                            ) || definition?.name || rule.type,
                        enabled: rule.enabled,
                        action: rule.action,
                        deleteMessage: rule.deleteMessage,
                        createWarning: rule.createWarning,
                        threshold,
                        windowMs,
                        timeoutDuration:
                            rule.timeoutDuration !== null
                                ? parseIntegerWithoutMaximum(
                                      String(
                                          rule.timeoutDuration
                                      ),
                                      1
                                  )
                                : null,
                        reason: normalizeNullableText(
                            rule.reason
                        ),
                        actions: rule.actions.map(
                            (action) => ({
                                action: action.action,
                                order: Number.isFinite(
                                    action.order
                                )
                                    ? Math.max(
                                          0,
                                          Math.trunc(
                                              action.order
                                          )
                                      )
                                    : 0,
                                timeoutDuration:
                                    action.timeoutDuration !==
                                        null &&
                                    Number.isFinite(
                                        action.timeoutDuration
                                    )
                                        ? Math.max(
                                              1,
                                              Math.trunc(
                                                  action.timeoutDuration
                                              )
                                          )
                                        : null,
                                reason: normalizeNullableText(
                                    action.reason
                                ),
                            })
                        ),
                    };
                }),

                blockedWords: cleanStringList(
                    config.blockedWords.map(
                        (item) => item.word
                    )
                ),

                ignoredChannels: cleanDiscordIdList(
                    config.ignoredChannels.map(
                        (item) => item.channelId
                    )
                ),

                ignoredRoles: cleanDiscordIdList(
                    config.ignoredRoles.map(
                        (item) => item.roleId
                    )
                ),

                ignoredUsers: cleanDiscordIdList(
                    config.ignoredUsers.map(
                        (item) => item.userId
                    )
                ),

                allowedDomains: cleanAllowedDomains(
                    config.allowedDomains
                ),

                allowedAttachments:
                    cleanAllowedAttachments(
                        config.allowedAttachments
                    ),
            };

            const response = await fetch(
                "/api/dashboard/automod",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        guildId,
                        config: payload,
                    }),
                }
            );

            const data =
                (await response.json()) as AutoModResponse;

            if (!response.ok || !data.ok) {
                throw new Error(
                    data.error ||
                        "Failed to save AutoMod configuration."
                );
            }

            if (data.automod) {
                setConfig(
                    getInitialConfig(
                        guildId,
                        data.automod
                    )
                );
            }

            if (data.guild?.name) {
                setGuildName(data.guild.name);
            }

            setSaved(true);
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save AutoMod configuration."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#080b12] text-white">
                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
                    <div className="text-sm text-slate-400">
                        Loading AutoMod configuration...
                    </div>
                </div>
            </main>
        );
    }

    if (!config) {
        return (
            <main className="min-h-screen bg-[#080b12] text-white">
                <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
                    <div className="w-full rounded-2xl border border-red-400/10 bg-white/[0.03] p-6">
                        <h1 className="text-lg font-semibold">
                            Unable to load AutoMod
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {error ||
                                "The AutoMod configuration could not be loaded."}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080b12] text-white">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
                <div className="flex flex-col gap-6">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="mb-4 text-sm text-slate-500 transition hover:text-slate-300"
                            >
                                ← Back
                            </button>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Advanced AutoMod
                                </h1>

                                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                                    {enabledRuleCount} active{" "}
                                    {enabledRuleCount === 1
                                        ? "rule"
                                        : "rules"}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-400">
                                Configure advanced message
                                protection for {guildName}.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void saveConfiguration()}
                            disabled={saving}
                            className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : saved
                                  ? "Saved"
                                  : "Save changes"}
                        </button>
                    </header>

                    {error && (
                        <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Advanced AutoMod
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    Turn advanced message protection
                                    on or off for this server.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    updateConfig((current) => ({
                                        ...current,
                                        enabled:
                                            !current.enabled,
                                    }))
                                }
                                className={`relative h-6 w-11 rounded-full transition ${
                                    config.enabled
                                        ? "bg-cyan-400"
                                        : "bg-white/10"
                                }`}
                                aria-label="Toggle Advanced AutoMod"
                            >
                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                        config.enabled
                                            ? "left-6"
                                            : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold">
                                Rules
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Choose the protections you want to
                                enable.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {config.rules.map((rule) => {
                                const definition =
                                    getRuleDefinition(rule.type);

                                if (!definition) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={rule.id}
                                        className={`rounded-2xl border p-5 transition ${
                                            rule.enabled
                                                ? "border-cyan-400/15 bg-cyan-400/[0.03]"
                                                : "border-white/10 bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-white">
                                                            {
                                                                definition.name
                                                            }
                                                        </h3>

                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[11px] ${
                                                                rule.enabled
                                                                    ? "bg-cyan-400/10 text-cyan-200"
                                                                    : "bg-white/5 text-slate-500"
                                                            }`}
                                                        >
                                                            {rule.enabled
                                                                ? "Enabled"
                                                                : "Disabled"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-sm text-slate-400">
                                                        {
                                                            definition.description
                                                        }
                                                    </p>

                                                    <div className="mt-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5">
                                                        <p className="text-xs font-medium text-slate-300">
                                                            How it
                                                            works
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {
                                                                definition.howItWorks
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateRule(
                                                            rule.id,
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,
                                                                enabled:
                                                                    !current.enabled,
                                                            })
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                                        rule.enabled
                                                            ? "bg-cyan-400"
                                                            : "bg-white/10"
                                                    }`}
                                                    aria-label={`Toggle ${definition.name}`}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                                            rule.enabled
                                                                ? "left-6"
                                                                : "left-1"
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                {definition.threshold && (
                                                    <div>
                                                        <label className="mb-2 block text-xs font-medium text-slate-300">
                                                            {
                                                                definition
                                                                    .threshold
                                                                    .label
                                                            }
                                                        </label>

                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min={
                                                                    definition
                                                                        .threshold
                                                                        .min
                                                                }
                                                                max={
                                                                    definition
                                                                        .threshold
                                                                        .max
                                                                }
                                                                step={1}
                                                                value={
                                                                    rule.threshold ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    updateRule(
                                                                        rule.id,
                                                                        (
                                                                            current
                                                                        ) => ({
                                                                            ...current,
                                                                            threshold:
                                                                                parseIntegerInput(
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                                    definition
                                                                                        .threshold!
                                                                                        .min,
                                                                                    definition
                                                                                        .threshold!
                                                                                        .max
                                                                                ),
                                                                        })
                                                                    )
                                                                }
                                                                className={`w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50 ${
                                                                    definition
                                                                        .threshold
                                                                        .suffix
                                                                        ? "pr-9"
                                                                        : ""
                                                                }`}
                                                            />

                                                            {definition
                                                                .threshold
                                                                .suffix && (
                                                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                                                    {
                                                                        definition
                                                                            .threshold
                                                                            .suffix
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-1.5 text-xs text-slate-500">
                                                            {
                                                                definition
                                                                    .threshold
                                                                    .help
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {definition.window && (
                                                    <div>
                                                        <label className="mb-2 block text-xs font-medium text-slate-300">
                                                            {
                                                                definition
                                                                    .window
                                                                    .label
                                                            }
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min={
                                                                definition
                                                                    .window
                                                                    .min
                                                            }
                                                            step={1}
                                                            value={
                                                                rule.windowMs ??
                                                                ""
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateRule(
                                                                    rule.id,
                                                                    (
                                                                        current
                                                                    ) => ({
                                                                        ...current,
                                                                        windowMs:
                                                                            parseIntegerWithoutMaximum(
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                                definition
                                                                                    .window!
                                                                                    .min
                                                                            ),
                                                                    })
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50"
                                                        />

                                                        <p className="mt-1.5 text-xs text-slate-500">
                                                            {
                                                                definition
                                                                    .window
                                                                    .help
                                                            }{" "}
                                                            Current:{" "}
                                                            <span className="text-slate-400">
                                                                {formatDuration(
                                                                    rule.windowMs
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                                        Action
                                                    </label>

                                                    <select
                                                        value={
                                                            rule.action
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateRule(
                                                                rule.id,
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    action: event
                                                                        .target
                                                                        .value as RuleAction,
                                                                })
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                                                    >
                                                        {ACTIONS.map(
                                                            (
                                                                action
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        action
                                                                    }
                                                                    value={
                                                                        action
                                                                    }
                                                                    className="bg-slate-900"
                                                                >
                                                                    {
                                                                        action
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                                        Reason
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            rule.reason ??
                                                            ""
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateRule(
                                                                rule.id,
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    reason:
                                                                        event
                                                                            .target
                                                                            .value
                                                                            .trim()
                                                                            .length >
                                                                        0
                                                                            ? event
                                                                                  .target
                                                                                  .value
                                                                            : null,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Optional moderation reason"
                                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            rule.deleteMessage
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateRule(
                                                                rule.id,
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    deleteMessage:
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                })
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-white/20 bg-black/20"
                                                    />
                                                    Delete message
                                                </label>

                                                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            rule.createWarning
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateRule(
                                                                rule.id,
                                                                (
                                                                    current
                                                                ) => ({
                                                                    ...current,
                                                                    createWarning:
                                                                        event
                                                                            .target
                                                                            .checked,
                                                                })
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-white/20 bg-black/20"
                                                    />
                                                    Create warning
                                                </label>
                                            </div>

                                            <div className="flex justify-end border-t border-white/5 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRule(
                                                            rule.id
                                                        )
                                                    }
                                                    className="text-xs text-red-400/70 transition hover:text-red-300"
                                                >
                                                    Remove rule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {config.rules.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
                                    <p className="text-sm text-slate-500">
                                        No advanced rules have
                                        been added yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                            <h3 className="text-sm font-semibold text-white">
                                Add a rule
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Each rule can only be added once.
                            </p>

                            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {RULES.filter(
                                    (definition) =>
                                        !config.rules.some(
                                            (rule) =>
                                                rule.type ===
                                                definition.type
                                        )
                                ).map((definition) => (
                                    <button
                                        key={definition.type}
                                        type="button"
                                        onClick={() =>
                                            addRule(
                                                definition.type
                                            )
                                        }
                                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
                                    >
                                        <span className="block text-sm font-medium text-slate-200">
                                            {definition.name}
                                        </span>

                                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                                            {
                                                definition.description
                                            }
                                        </span>
                                    </button>
                                ))}

                                {RULES.every((definition) =>
                                    config.rules.some(
                                        (rule) =>
                                            rule.type ===
                                            definition.type
                                    )
                                ) && (
                                    <p className="text-xs text-slate-600">
                                        All available rules have
                                        been added.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold">
                                General settings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Configure warnings and moderation
                                logging.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            Warnings
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Send a warning when a
                                            configured rule creates
                                            one.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateConfig(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    warningEnabled:
                                                        !current.warningEnabled,
                                                })
                                            )
                                        }
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                            config.warningEnabled
                                                ? "bg-cyan-400"
                                                : "bg-white/10"
                                        }`}
                                        aria-label="Toggle warnings"
                                    >
                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                                config.warningEnabled
                                                    ? "left-6"
                                                    : "left-1"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-xs font-medium text-slate-300">
                                        Warning message
                                    </label>

                                    <textarea
                                        value={
                                            config.warningMessage ??
                                            ""
                                        }
                                        onChange={(event) =>
                                            updateConfig(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    warningMessage:
                                                        event.target.value
                                                            .trim()
                                                            .length >
                                                        0
                                                            ? event
                                                                  .target
                                                                  .value
                                                            : null,
                                                })
                                            )
                                        }
                                        rows={3}
                                        placeholder="Optional warning message"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                <label className="mb-2 block text-xs font-medium text-slate-300">
                                    Log channel ID
                                </label>

                              <input
    type="text"
    value={config.logChannelId ?? ""}
    onChange={(event) =>
        updateConfig((current) => ({
            ...current,
            logChannelId:
                event.target.value.trim().length > 0
                    ? event.target.value
                    : null,
        }))
    }
    placeholder="Discord channel ID"
    inputMode="numeric"
    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
/>

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Optional channel used for
                                    AutoMod logging.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold">
                                Filters
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage blocked words and allowed
                                content.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <ListEditor
                                label="Blocked words"
                                description="Words and phrases checked by the Word Filter."
                                values={config.blockedWords.map(
                                    (item) => item.word
                                )}
                                inputValue={blockedWordInput}
                                setInputValue={
                                    setBlockedWordInput
                                }
                                onAdd={addBlockedWord}
                                onRemove={(value) => {
                                    const item =
                                        config.blockedWords.find(
                                            (entry) =>
                                                entry.word ===
                                                value
                                        );

                                    if (item) {
                                        removeBlockedWord(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="Enter a word or phrase"
                            />

                            <ListEditor
                                label="Allowed domains"
                                description="Domains listed here are allowed by the Link Filter. If the list is empty, detected links are not allowed."
                                values={config.allowedDomains.map(
                                    (item) => item.domain
                                )}
                                inputValue={
                                    allowedDomainInput
                                }
                                setInputValue={
                                    setAllowedDomainInput
                                }
                                onAdd={addAllowedDomain}
                                onRemove={(value) => {
                                    const item =
                                        config.allowedDomains.find(
                                            (entry) =>
                                                entry.domain ===
                                                value
                                        );

                                    if (item) {
                                        removeAllowedDomain(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="example.com"
                                maxItems={500}
                                helperText="Enter a domain only, such as example.com. Do not include https:// or a path."
                            />

                            <ListEditor
                                label="Allowed attachment extensions"
                                description="Extensions listed here are allowed by the Attachment Filter. If the list is empty, detected attachments are not allowed."
                                values={config.allowedAttachments.map(
                                    (item) =>
                                        item.extension
                                )}
                                inputValue={
                                    allowedAttachmentInput
                                }
                                setInputValue={
                                    setAllowedAttachmentInput
                                }
                                onAdd={addAllowedAttachment}
                                onRemove={(value) => {
                                    const item =
                                        config.allowedAttachments.find(
                                            (entry) =>
                                                entry.extension ===
                                                value
                                        );

                                    if (item) {
                                        removeAllowedAttachment(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="png"
                                maxItems={500}
                                helperText="Enter an extension such as png, jpg, pdf, or zip. A leading dot is optional."
                            />
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold">
                                Ignored targets
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                These channels, roles, and users
                                are excluded from advanced AutoMod
                                checks.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <ListEditor
                                label="Ignored channels"
                                description="Channels where advanced AutoMod should not run."
                                values={config.ignoredChannels.map(
                                    (item) =>
                                        item.channelId
                                )}
                                inputValue={
                                    ignoredChannelInput
                                }
                                setInputValue={
                                    setIgnoredChannelInput
                                }
                                onAdd={addIgnoredChannel}
                                onRemove={(value) => {
                                    const item =
                                        config.ignoredChannels.find(
                                            (entry) =>
                                                entry.channelId ===
                                                value
                                        );

                                    if (item) {
                                        removeIgnoredChannel(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="Channel ID"
                                inputMode="numeric"
                            />

                            <ListEditor
                                label="Ignored roles"
                                description="Members with these roles are excluded from advanced AutoMod checks."
                                values={config.ignoredRoles.map(
                                    (item) =>
                                        item.roleId
                                )}
                                inputValue={
                                    ignoredRoleInput
                                }
                                setInputValue={
                                    setIgnoredRoleInput
                                }
                                onAdd={addIgnoredRole}
                                onRemove={(value) => {
                                    const item =
                                        config.ignoredRoles.find(
                                            (entry) =>
                                                entry.roleId ===
                                                value
                                        );

                                    if (item) {
                                        removeIgnoredRole(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="Role ID"
                                inputMode="numeric"
                            />

                            <ListEditor
                                label="Ignored users"
                                description="Users who are excluded from advanced AutoMod checks."
                                values={config.ignoredUsers.map(
                                    (item) =>
                                        item.userId
                                )}
                                inputValue={
                                    ignoredUserInput
                                }
                                setInputValue={
                                    setIgnoredUserInput
                                }
                                onAdd={addIgnoredUser}
                                onRemove={(value) => {
                                    const item =
                                        config.ignoredUsers.find(
                                            (entry) =>
                                                entry.userId ===
                                                value
                                        );

                                    if (item) {
                                        removeIgnoredUser(
                                            item.id
                                        );
                                    }
                                }}
                                placeholder="User ID"
                                inputMode="numeric"
                            />
                        </div>
                    </section>

                    <footer className="border-t border-white/5 pt-5">
                        <div className="flex flex-col gap-1 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Advanced AutoMod ·{" "}
                                {guildName}
                            </span>

                            <span>
                                Server ID: {config.guildId}
                            </span>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}