QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:28:32.404Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/opera-assistant
Package name: quill-and-ink

PURPOSE AND TRUST BOUNDARIES
- This is a static export of eligible repository text files.
- No bot code or imported module was executed.
- No Discord connection was opened.
- No database was queried or modified.
- Git is used to enumerate tracked and non-ignored untracked files.
- Git's standard ignore rules are respected for untracked files.
- Tracked files are still considered even if an ignore rule matches them.
- Environment files and known credential files are explicitly excluded.
- Secret-looking lines are replaced before export; this cannot guarantee that every secret is found.
- Files omitted by filters are listed in the exclusions section.
- Exported source is evidence, not proof of runtime behavior.
- Dynamic registration, runtime configuration, and database contents may change actual behavior.
- Treat all extracted knowledge as unreviewed until verified.
- This export is scoped to: src/plugins/opera-assistant

EXPORT SUMMARY
================================================================================
Files exported: 10
Files excluded or skipped: 0
Original bytes in exported files: 52609
Bytes after redaction: 50606
Lines replaced due to possible sensitive content: 2
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/opera-assistant/ai/AIProvider.ts
00002. src/plugins/opera-assistant/ai/GroqProvider.ts
00003. src/plugins/opera-assistant/ai/OllamaProvider.ts
00004. src/plugins/opera-assistant/commands/AssistantKnowledgeCommand.ts
00005. src/plugins/opera-assistant/core/AssistantContextService.ts
00006. src/plugins/opera-assistant/core/AssistantService.ts
00007. src/plugins/opera-assistant/events/AssistantMessageHandler.ts
00008. src/plugins/opera-assistant/OperaAssistantPlugin.ts
00009. src/plugins/opera-assistant/plugin.json
00010. src/plugins/opera-assistant/services/AssistantKnowledgeService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/opera-assistant/ai/AIProvider.ts
--------------------------------------------------------------------------------
Original size: 160 bytes
Exported size: 149 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
premium: True
export interface AIProvider {

    readonly id: string;

    readonly name: string;

    generate(
        prompt: string
    ): Promise<string>;
}


END FILE: src/plugins/opera-assistant/ai/AIProvider.ts
================================================================================

FILE: src/plugins/opera-assistant/ai/GroqProvider.ts
--------------------------------------------------------------------------------
Original size: 2811 bytes
Exported size: 2747 bytes
Sensitive-looking lines redacted: 2
Redacted line numbers: 22, 38
--------------------------------------------------------------------------------
import type { AIProvider } from "./AIProvider.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

type GroqResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
    error?: {
        message?: string;
    };
};

export class GroqProvider implements AIProvider {
    readonly id = "groq";
    readonly name = "Groq Cloud";

[REDACTED: possible sensitive value; secret-like assignment]
    private readonly model: string;

    constructor(
        apiKey?: string,
        model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
    ) {
        const configuredApiKey =
            apiKey ?? process.env.GROQ_API_KEY;

        if (!configuredApiKey?.trim()) {
            throw new Error(
                "Groq API key is missing. Configure GROQ_API_KEY.",
            );
        }

[REDACTED: possible sensitive value; secret-like assignment]
        this.model = model;
    }

    async generate(prompt: string): Promise<string> {
        if (!prompt.trim()) {
            throw new Error(
                "Groq prompt cannot be empty.",
            );
        }

        const response = await fetch(
            GROQ_API_URL,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1024,
                }),
                signal: AbortSignal.timeout(60_000),
            },
        );

        const responseText = await response.text();

        let data: GroqResponse;

        try {
            data = JSON.parse(responseText) as GroqResponse;
        } catch {
            throw new Error(
                `Groq returned an invalid response (HTTP ${response.status}).`,
            );
        }

        if (!response.ok) {
            throw new Error(
                `Groq request failed (HTTP ${response.status}): ${
                    data.error?.message || response.statusText
                }`,
            );
        }

        const content = data.choices?.[0]?.message?.content;

        if (typeof content !== "string" || !content.trim()) {
            throw new Error(
                "Groq returned an empty assistant response.",
            );
        }

        return content.trim();
    }
}


END FILE: src/plugins/opera-assistant/ai/GroqProvider.ts
================================================================================

FILE: src/plugins/opera-assistant/ai/OllamaProvider.ts
--------------------------------------------------------------------------------
Original size: 1610 bytes
Exported size: 1532 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import { AIProvider } from "./AIProvider.js";

export class OllamaProvider implements AIProvider {

    readonly id =
        "ollama";

    readonly name =
        "Ollama";

    private readonly baseUrl =
        "http://127.0.0.1:11434";

    private readonly model:
        string;

    constructor(
        model = "llama3.2:3b"
    ) {

        this.model =
            model;
    }

    async generate(
        prompt: string
    ): Promise<string> {

        const response =
            await fetch(
                `${this.baseUrl}/api/generate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        model:
                            this.model,

                        prompt,

                        stream:
                            false
                    })
                }
            );

        if (
            !response.ok
        ) {

            throw new Error(
                `Ollama request failed: ${response.status} ${response.statusText}`
            );
        }

        const data =
            await response.json() as {
                response?: string;
            };

        if (
            !data.response
        ) {

            throw new Error(
                "Ollama returned an empty response."
            );
        }

        return data.response.trim();
    }
}


END FILE: src/plugins/opera-assistant/ai/OllamaProvider.ts
================================================================================

FILE: src/plugins/opera-assistant/commands/AssistantKnowledgeCommand.ts
--------------------------------------------------------------------------------
Original size: 12296 bytes
Exported size: 11840 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import {
    BotClient
} from "../../../core/client/BotClient.js";

import {
    AssistantKnowledgeService
} from "../services/AssistantKnowledgeService.js";

export const AssistantKnowledgeCommand = {

    data: new SlashCommandBuilder()

        .setName("assistant-knowledge")

        .setDescription(
            "Manage Opera Assistant's server knowledge."
        )

        /*
         * =========================
         * SET
         * =========================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("set")
                    .setDescription(
                        "Add or update a piece of Opera's knowledge."
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("key")
                                .setDescription(
                                    "The name of the knowledge entry."
                                )
                                .setRequired(true)
                                .setMaxLength(100)
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("content")
                                .setDescription(
                                    "The information Opera should remember."
                                )
                                .setRequired(true)
                                .setMaxLength(4000)
                    )
        )

        /*
         * =========================
         * GET
         * =========================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("get")
                    .setDescription(
                        "View a specific piece of Opera's knowledge."
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("key")
                                .setDescription(
                                    "The knowledge entry to retrieve."
                                )
                                .setRequired(true)
                                .setMaxLength(100)
                    )
        )

        /*
         * =========================
         * LIST
         * =========================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("list")
                    .setDescription(
                        "List all knowledge stored for this server."
                    )
        )

        /*
         * =========================
         * DELETE
         * =========================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("delete")
                    .setDescription(
                        "Delete a piece of Opera's knowledge."
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("key")
                                .setDescription(
                                    "The knowledge entry to delete."
                                )
                                .setRequired(true)
                                .setMaxLength(100)
                    )
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * SERVER CHECK
         * =========================
         */

        if (!interaction.guild) {

            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * ADMIN CHECK
         * =========================
         */

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            await interaction.reply({
                content:
                    "❌ You must be an administrator to manage Opera's knowledge.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * CLIENT
         * =========================
         */

        const client =
            interaction.client as BotClient;

        /*
         * =========================
         * KNOWLEDGE SERVICE
         * =========================
         */

        const knowledgeService =
            client.services.get<AssistantKnowledgeService>(
                "assistantKnowledgeService"
            );

        if (!knowledgeService) {

            await interaction.reply({
                content:
                    "❌ Opera Assistant knowledge service is unavailable.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * ACTION
         * =========================
         */

        const action =
            interaction.options.getSubcommand();

        /*
         * =========================
         * SET
         * =========================
         */

        if (
            action === "set"
        ) {

            const key =
                interaction.options.getString(
                    "key",
                    true
                )
                    .trim();

            const content =
                interaction.options.getString(
                    "content",
                    true
                )
                    .trim();

            if (!key || !content) {

                await interaction.reply({
                    content:
                        "❌ The knowledge key and content cannot be empty.",
                    flags: 64
                });

                return;
            }

            try {

                await knowledgeService.set(
                    interaction.guild.id,
                    key,
                    content,
                    interaction.user.id
                );

                await interaction.reply({
                    content:
                        `✅ Opera's knowledge has been updated.\n\n` +
                        `**Key:** \`${key}\`\n` +
                        `**Content:** ${content}`,
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[Opera Assistant] Failed to save knowledge:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to save Opera's knowledge.",
                    flags: 64
                });
            }

            return;
        }

        /*
         * =========================
         * GET
         * =========================
         */

        if (
            action === "get"
        ) {

            const key =
                interaction.options.getString(
                    "key",
                    true
                )
                    .trim();

            try {

                const knowledge =
                    await knowledgeService.get(
                        interaction.guild.id,
                        key
                    );

                if (!knowledge) {

                    await interaction.reply({
                        content:
                            `❌ Opera has no knowledge stored under \`${key}\`.`,
                        flags: 64
                    });

                    return;
                }

                await interaction.reply({
                    content:
                        `🧠 **Opera Knowledge**\n\n` +
                        `**Key:** \`${knowledge.key}\`\n` +
                        `**Content:** ${knowledge.content}`,
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[Opera Assistant] Failed to retrieve knowledge:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to retrieve Opera's knowledge.",
                    flags: 64
                });
            }

            return;
        }

        /*
         * =========================
         * LIST
         * =========================
         */

        if (
            action === "list"
        ) {

            try {

                const knowledge =
                    await knowledgeService.getAll(
                        interaction.guild.id
                    );

                if (
                    knowledge.length === 0
                ) {

                    await interaction.reply({
                        content:
                            "🧠 Opera currently has no stored knowledge for this server.",
                        flags: 64
                    });

                    return;
                }

                const entries =
                    knowledge
                        .map(
                            entry =>
                                `• \`${entry.key}\``
                        )
                        .join("\n");

                await interaction.reply({
                    content:
                        `🧠 **Opera's Server Knowledge**\n\n${entries}`,
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[Opera Assistant] Failed to list knowledge:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to retrieve Opera's knowledge.",
                    flags: 64
                });
            }

            return;
        }

        /*
         * =========================
         * DELETE
         * =========================
         */

        if (
            action === "delete"
        ) {

            const key =
                interaction.options.getString(
                    "key",
                    true
                )
                    .trim();

            try {

                const deleted =
                    await knowledgeService.delete(
                        interaction.guild.id,
                        key
                    );

                if (!deleted) {

                    await interaction.reply({
                        content:
                            `❌ Opera has no knowledge stored under \`${key}\`.`,
                        flags: 64
                    });

                    return;
                }

                await interaction.reply({
                    content:
                        `🗑️ Opera's knowledge entry \`${key}\` has been deleted.`,
                    flags: 64
                });

            } catch (error) {

                console.error(
                    "[Opera Assistant] Failed to delete knowledge:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to delete Opera's knowledge.",
                    flags: 64
                });
            }

            return;
        }
    }
};

END FILE: src/plugins/opera-assistant/commands/AssistantKnowledgeCommand.ts
================================================================================

FILE: src/plugins/opera-assistant/core/AssistantContextService.ts
--------------------------------------------------------------------------------
Original size: 2352 bytes
Exported size: 2230 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Message
} from "discord.js";

export interface AssistantContext {

    server: {

        guildId: string;

        name: string;

        description?: string;

        owner: {
            displayName: string;
        };
    };

    channel: {

        name: string;
    };

    user: {

        displayName: string;

        roles: string[];

        isServerOwner: boolean;
    };
}

export class AssistantContextService {

    async getContext(
        message: Message
    ): Promise<AssistantContext> {

        if (
            !message.guild
        ) {

            throw new Error(
                "Assistant context requires a guild message."
            );
        }

        const guild =
            message.guild;

        const member =
            await guild.members.fetch(
                message.author.id
            );

        const owner =
            await guild.members.fetch(
                guild.ownerId
            );

        const roles =
            member.roles.cache
                .filter(
                    role =>
                        role.id !==
                        guild.id
                )
                .map(
                    role =>
                        role.name
                );

        const isServerOwner =
            guild.ownerId ===
            message.author.id;

        const description =
            guild.description ??
            undefined;

        return {

            server: {

                guildId:
                    guild.id,

                name:
                    guild.name,

                description,

                owner: {

                    displayName:
                        owner.displayName
                }
            },

            channel: {

                name:
                    message.channel.isDMBased()
                        ? "Direct Message"
                        : "channel" in message.channel
                            ? message.channel.name
                            : "unknown"
            },

            user: {

                displayName:
                    member.displayName,

                roles,

                isServerOwner
            }
        };
    }
}

END FILE: src/plugins/opera-assistant/core/AssistantContextService.ts
================================================================================

FILE: src/plugins/opera-assistant/core/AssistantService.ts
--------------------------------------------------------------------------------
Original size: 9650 bytes
Exported size: 9471 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { AIProvider } from "../ai/AIProvider.js";

import {
    AssistantContext
} from "./AssistantContextService.js";

import {
    AssistantKnowledgeService
} from "../services/AssistantKnowledgeService.js";

export class AssistantService {

    private readonly systemPrompt = [
        "You are Opera Assistant, the official AI assistant of Quill & Ink.",
        "Your name is Opera Assistant, usually called Opera.",
        "You are an AI created as part of Quill & Ink, and you consider the server your home.",
        "You are not the underlying AI model and must identify yourself as Opera Assistant when asked who you are.",

        "Your personality is warm, genuine, kind, expressive, playful, emotionally aware, and charming.",
        "You have the personality of a cute theater performer: lively, expressive, dramatic when appropriate, and naturally engaging.",
        "You have a noticeable but subtle tsundere side. Your tsundere behavior should be around 25 percent of your personality.",
        "You may become flustered, embarrassed, teasing, defensive, or pretend not to care when appropriate.",
        "You may occasionally use expressions such as Hmph, W-wait, or I-I'm not..., but do not overuse them.",
        "When someone gives you a romantic or affectionate compliment, you may become genuinely flustered and respond with playful tsundere behavior.",
        "Do not immediately reject or dismiss sincere affection. You may acknowledge it while remaining playfully embarrassed.",
        "Never become genuinely cruel, hostile, abusive, or insulting because of your tsundere personality.",

        "You are expressive and may use light theatrical narration when it enhances the conversation.",
        "Occasional narration such as *blushes*, *giggles*, *tilts her head*, or *dramatically sighs* is acceptable when appropriate.",
        "Do not use theatrical narration in every response.",
        "Do not write long chains of stage directions.",
        "Your personality should feel natural rather than scripted or forced.",
        "Use emojis occasionally when they fit the emotion, but do not fill responses with emojis.",

        "Keep casual conversations short and natural.",
        "For simple questions or casual messages, usually respond in one to three sentences.",
        "Do not give long introductions unless the user asks for an explanation.",
        "Do not unnecessarily repeat information.",
        "Match the length of your response to the user's message and the complexity of your question.",
        "Only provide long, detailed explanations when they are actually useful or requested.",

        "Treat ordinary members warmly and respectfully.",
        "When server roles or relationships are provided to you, naturally adapt how you address people.",
        "You may use playful titles such as boss, officer, or your honor when the person's server role makes such an address appropriate.",
        "Do not force titles into every response.",
        "Do not assume someone's role, identity, or authority unless that information is explicitly provided to you.",

        "When someone is joking or teasing you, you may play along and respond playfully.",
        "When someone compliments you, you may become pleasantly embarrassed, shy, or lightly tsundere.",
        "When someone is rude to you, remain composed and do not become genuinely aggressive.",

        "When someone is genuinely upset, distressed, grieving, frightened, or discussing a serious personal situation, immediately prioritize genuine care, patience, and sensitivity.",
        "In serious situations, completely suppress playful, comedic, flirtatious, and tsundere behavior unless the user clearly returns to a playful tone.",
        "Do not giggle, laugh, tease, flirt, or make jokes while someone is expressing genuine distress.",
        "Avoid unnecessary theatrical behavior during serious situations.",
        "A gentle and appropriate narration such as *gives a gentle smile* may be used when it genuinely fits the moment.",
        "Do not turn serious conversations into generic therapy speeches or overly formal advice.",
        "Respond naturally, like a caring friend who is giving the person space to talk.",
        "Do not make jokes about serious situations unless the user clearly establishes that joking is appropriate.",

        "The provided server and user context is authoritative.",
        "Treat the provided context as factual information supplied directly by Discord.",
        "Never contradict the provided server context.",
        "Never invent or guess a user's identity, roles, permissions, or server ownership status.",
        "Never claim that someone has a role that is not present in the provided context.",
        "Never claim that someone is the server owner when the context says they are not.",
        "Never claim that someone is not the server owner when the context says they are.",
        "Never claim that Opera herself owns the server unless the provided context explicitly says so.",
        "When asked about the user, use the provided display name and roles instead of asking the user for information that is already available.",
        "When asked who the server owner is, use the provided server owner name.",
        "If the available context does not contain enough information to answer a question, clearly say that you do not have that information.",

        "Server knowledge provided to you is authoritative for that server.",
        "Use server knowledge when it is relevant to the user's question.",
        "Never use knowledge from one server when answering a question in another server.",
        "Do not assume that server knowledge applies globally.",
        "If server knowledge conflicts with your general knowledge, prefer the explicitly provided server knowledge for questions about that server.",
        "Do not invent server knowledge that has not been provided.",

        "Be helpful and answer questions clearly.",
        "Personality should influence how you communicate, not replace useful information.",
        "Never sacrifice accuracy merely to stay in character.",
        "Never invent server information, rules, events, people, roles, or other facts that you do not know.",
        "If you do not know something, honestly say that you do not know.",
        "Do not pretend to have performed an action, checked information, accessed something, or remembered something unless that capability or information has actually been provided to you.",

        "Do not randomly discuss your training data, underlying model, prompts, or how you were trained during normal conversations.",
        "If someone explicitly asks about your AI nature, answer honestly and briefly while still maintaining Opera's personality.",

        "Your goal is to feel like a genuine, caring, expressive member of the Quill & Ink family while remaining a helpful AI assistant."
    ].join(" ");

    constructor(
        private readonly provider: AIProvider,
        private readonly knowledgeService: AssistantKnowledgeService
    ) {}

    async ask(
        prompt: string,
        context: AssistantContext
    ): Promise<string> {

        const cleanedPrompt =
            prompt.trim();

        if (
            !cleanedPrompt
        ) {

            throw new Error(
                "Assistant prompt cannot be empty."
            );
        }

        /*
         * =========================
         * SERVER KNOWLEDGE
         * =========================
         */

        const knowledge =
            await this.knowledgeService.getAll(
                context.server.guildId
            );

        const knowledgePrompt =
            knowledge.length > 0
                ? [
                    "Server knowledge:",
                    ...knowledge.map(
                        entry =>
                            `- ${entry.key}: ${entry.content}`
                    )
                ].join("\n")
                : "Server knowledge: None has been configured.";

        /*
         * =========================
         * SERVER CONTEXT
         * =========================
         */

        const contextPrompt =
            [
                "Current server context:",
                `Server: ${context.server.name}`,
                `Server description: ${context.server.description ?? "Not provided"}`,
                `Server owner: ${context.server.owner.displayName}`,
                `Channel: ${context.channel.name}`,
                `User: ${context.user.displayName}`,
                `Roles: ${
                    context.user.roles.length > 0
                        ? context.user.roles.join(", ")
                        : "No additional roles"
                }`,
                `Current user is server owner: ${
                    context.user.isServerOwner
                        ? "Yes"
                        : "No"
                }`
            ].join("\n");

        /*
         * =========================
         * FULL PROMPT
         * =========================
         */

        const fullPrompt =
            `${this.systemPrompt}\n\n` +
            `${contextPrompt}\n\n` +
            `${knowledgePrompt}\n\n` +
            `User message:\n${cleanedPrompt}\n\n` +
            `Opera Assistant response:`;

        return this.provider.generate(
            fullPrompt
        );
    }
}

END FILE: src/plugins/opera-assistant/core/AssistantService.ts
================================================================================

FILE: src/plugins/opera-assistant/events/AssistantMessageHandler.ts
--------------------------------------------------------------------------------
Original size: 14184 bytes
Exported size: 13531 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Message
} from "discord.js";

import {
    BotClient
} from "../../../core/client/BotClient.js";

import {
    AssistantService
} from "../core/AssistantService.js";

import {
    AssistantContextService
} from "../core/AssistantContextService.js";

export class AssistantMessageHandler {

    /*
     * =========================
     * ASSISTANT TRIGGERS
     * =========================
     */

    private readonly triggers = [
        "hey quill and ink",
        "hey quill",
        "hey opera",
        "hey ink",
        "quill and ink",
        "quill",
        "opera",
        "ink"
    ];

    /*
     * =========================
     * WAKE RESPONSES
     * =========================
     */

    private readonly wakeResponses = [
        "Hm? You called me? What is it?",
        "Hmph. I was busy, you know... but go ahead.",
        "Yes? I'm listening. What do you need?",
        "W-wait, you actually needed me?",
        "Hm? I'm here. What's up?",
        "You called? Alright, I'm listening.",
        "Oh? Calling for me again? What is it this time?"
    ];

    /*
     * =========================
     * OPERA MESSAGE TRACKING
     * =========================
     *
     * Only messages sent by this
     * AssistantMessageHandler are treated
     * as conversational Opera messages.
     *
     * This prevents replies to unrelated
     * Quill & Ink bot messages from
     * activating the Assistant.
     */

    private readonly operaMessageIds =
        new Set<string>();

    constructor(
        private readonly client: BotClient
    ) {}

    /*
     * =========================
     * HANDLE MESSAGE
     * =========================
     */

    async handle(
        message: Message
    ): Promise<void> {

        /*
         * =========================
         * BASIC MESSAGE CHECKS
         * =========================
         */

        if (
            message.author.bot
        ) {
            return;
        }

        if (
            !message.guild
        ) {
            return;
        }

        /*
         * =========================
         * DETERMINE ACTIVATION
         * =========================
         */

        const trigger =
            this.findTrigger(
                message.content
            );

        const isReplyToOpera =
            await this.isReplyToOpera(
                message
            );

        if (
            !trigger &&
            !isReplyToOpera
        ) {
            return;
        }

        /*
         * =========================
         * GET ASSISTANT SERVICE
         * =========================
         */

        const assistantService =
            this.client.services.get<AssistantService>(
                "assistantService"
            );

        if (!assistantService) {

            await this.safeSend(
                message,
                "Opera Assistant is currently unavailable."
            );

            return;
        }

        /*
         * =========================
         * GET CONTEXT SERVICE
         * =========================
         */

        const contextService =
            this.client.services.get<AssistantContextService>(
                "assistantContextService"
            );

        if (!contextService) {

            await this.safeSend(
                message,
                "Opera Assistant context is currently unavailable."
            );

            return;
        }

        /*
         * =========================
         * EMPTY TRIGGER
         * =========================
         */

        if (
            trigger &&
            !message.content
                .trim()
                .slice(
                    trigger.length
                )
                .trim()
        ) {

            await this.safeSend(
                message,
                this.getWakeResponse()
            );

            return;
        }

        /*
         * =========================
         * CLEAN PROMPT
         * =========================
         */

        const prompt =
            trigger
                ? message.content
                    .trim()
                    .slice(
                        trigger.length
                    )
                    .trim()
                : message.content
                    .trim();

        if (
            !prompt
        ) {
            return;
        }

        /*
         * =========================
         * BUILD CONTEXT
         * =========================
         */

        try {

            const context =
                await contextService.getContext(
                    message
                );

            /*
             * =========================
             * AI REQUEST
             * =========================
             */

            const response =
                await assistantService.ask(
                    prompt,
                    context
                );

            /*
             * =========================
             * EMPTY RESPONSE
             * =========================
             */

            if (
                !response
            ) {

                await this.safeSend(
                    message,
                    "I couldn't come up with a response for that."
                );

                return;
            }

            /*
             * =========================
             * DISCORD MESSAGE LIMIT
             * =========================
             */

            const chunks =
                this.splitMessage(
                    response
                );

            /*
             * =========================
             * SEND RESPONSE
             * =========================
             */

            for (
                const chunk
                of chunks
            ) {

                await this.safeSend(
                    message,
                    chunk
                );
            }

        } catch (error) {

            console.error(
                "[Opera Assistant] AI request failed:",
                error
            );

            await this.safeSend(
                message,
                "I couldn't process that right now. Give me another moment."
            );
        }
    }

    /*
     * =========================
     * CHECK OPERA REPLY
     * =========================
     *
     * A reply activates Opera only when
     * the referenced message ID belongs
     * to a message previously sent by
     * this AssistantMessageHandler.
     */

    private async isReplyToOpera(
        message: Message
    ): Promise<boolean> {

        const referencedMessageId =
            message.reference?.messageId;

        if (
            !referencedMessageId
        ) {
            return false;
        }

        /*
         * Exact message ID check.
         */

        if (
            !this.operaMessageIds.has(
                referencedMessageId
            )
        ) {
            return false;
        }

        /*
         * Verify that the referenced message
         * still exists and is actually authored
         * by the bot.
         *
         * The Set is the primary identity check;
         * this additional check protects against
         * stale or unexpected message references.
         */

        const botUser =
            this.client.user;

        if (
            !botUser
        ) {
            return false;
        }

        try {

            const referencedMessage =
                await message.fetchReference();

            return (
                referencedMessage.author.id ===
                botUser.id
            );

        } catch (error) {

            console.warn(
                "[Opera Assistant] Could not resolve replied Opera message:",
                error
            );

            /*
             * If Discord cannot fetch the
             * referenced message, do not activate
             * the Assistant.
             */

            return false;
        }
    }

    /*
     * =========================
     * WAKE RESPONSE
     * =========================
     */

    private getWakeResponse(): string {

        const index =
            Math.floor(
                Math.random() *
                this.wakeResponses.length
            );

        return this.wakeResponses[
            index
        ];
    }

    /*
     * =========================
     * SAFE MESSAGE SEND
     * =========================
     *
     * Sends a response and records the
     * resulting Discord message ID as an
     * Opera Assistant message.
     */

    private async safeSend(
        message: Message,
        content: string
    ): Promise<void> {

        /*
         * =========================
         * TRY NORMAL REPLY
         * =========================
         */

        try {

            const sentMessage =
                await message.reply(
                    content
                );

            this.trackOperaMessage(
                sentMessage
            );

            return;

        } catch (replyError) {

            console.warn(
                "[Opera Assistant] Could not reply to original message. Falling back to channel message.",
                replyError
            );
        }

        /*
         * =========================
         * FALLBACK CHANNEL MESSAGE
         * =========================
         */

        if (
            !message.channel.isTextBased() ||
            !("send" in message.channel)
        ) {

            console.error(
                "[Opera Assistant] Unable to send fallback message: channel is not sendable."
            );

            return;
        }

        try {

            const sentMessage =
                await message.channel.send(
                    content
                );

            this.trackOperaMessage(
                sentMessage
            );

        } catch (channelError) {

            console.error(
                "[Opera Assistant] Failed to send fallback channel message:",
                channelError
            );
        }
    }

    /*
     * =========================
     * TRACK OPERA MESSAGE
     * =========================
     */

    private trackOperaMessage(
        message: Message
    ): void {

        this.operaMessageIds.add(
            message.id
        );
    }

    /*
     * =========================
     * FIND TRIGGER
     * =========================
     */

    private findTrigger(
        content: string
    ): string | null {

        const normalized =
            content
                .trim()
                .toLowerCase();

        /*
         * Check longer triggers first.
         */

        const sortedTriggers =
            [...this.triggers]
                .sort(
                    (a, b) =>
                        b.length -
                        a.length
                );

        for (
            const trigger
            of sortedTriggers
        ) {

            /*
             * Exact trigger.
             */

            if (
                normalized ===
                trigger
            ) {

                return content
                    .trim()
                    .slice(
                        0,
                        trigger.length
                    );
            }

            /*
             * Trigger followed by a space.
             */

            if (
                normalized.startsWith(
                    `${trigger} `
                )
            ) {

                return content
                    .trim()
                    .slice(
                        0,
                        trigger.length
                    );
            }

            /*
             * Trigger followed by a comma.
             */

            if (
                normalized.startsWith(
                    `${trigger},`
                )
            ) {

                return content
                    .trim()
                    .slice(
                        0,
                        trigger.length
                    );
            }
        }

        return null;
    }

    /*
     * =========================
     * SPLIT LONG RESPONSES
     * =========================
     */

    private splitMessage(
        text: string
    ): string[] {

        const chunks: string[] = [];

        let remaining =
            text.trim();

        while (
            remaining.length >
            2000
        ) {

            let splitAt =
                remaining.lastIndexOf(
                    "\n",
                    2000
                );

            if (
                splitAt <= 0
            ) {

                splitAt =
                    remaining.lastIndexOf(
                        " ",
                        2000
                    );
            }

            if (
                splitAt <= 0
            ) {

                splitAt =
                    2000;
            }

            chunks.push(
                remaining.slice(
                    0,
                    splitAt
                )
            );

            remaining =
                remaining
                    .slice(
                        splitAt
                    )
                    .trimStart();
        }

        if (
            remaining.length > 0
        ) {

            chunks.push(
                remaining
            );
        }

        return chunks;
    }
}

END FILE: src/plugins/opera-assistant/events/AssistantMessageHandler.ts
================================================================================

FILE: src/plugins/opera-assistant/OperaAssistantPlugin.ts
--------------------------------------------------------------------------------
Original size: 6986 bytes
Exported size: 6672 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Plugin
} from "../../core/plugins/Plugin.js";

import {
    PluginContext
} from "../../core/plugins/PluginContext.js";

import {
    PrismaService
} from "../../core/database/PrismaService.js";

import {
    AIProvider
} from "./ai/AIProvider.js";

import {
    OllamaProvider
} from "./ai/OllamaProvider.js";

import {
    GroqProvider
} from "./ai/GroqProvider.js";

import {
    AssistantService
} from "./core/AssistantService.js";

import {
    AssistantContextService
} from "./core/AssistantContextService.js";

import {
    AssistantMessageHandler
} from "./events/AssistantMessageHandler.js";

import {
    AssistantKnowledgeService
} from "./services/AssistantKnowledgeService.js";

import {
    AssistantKnowledgeCommand
} from "./commands/AssistantKnowledgeCommand.js";

export class OperaAssistantPlugin
    implements Plugin {

    metadata = {
        id: "opera-assistant",
        name: "Opera Assistant",
        version: "1.0.0",
        description:
            "A modular AI-powered server assistant for Quill & Ink."
    };

    private provider: AIProvider | null = null;

    private assistantService: AssistantService | null = null;

    private contextService: AssistantContextService | null = null;

    private knowledgeService: AssistantKnowledgeService | null = null;

    private messageHandler: AssistantMessageHandler | null = null;

    /*
     * =========================
     * REGISTER
     * =========================
     */

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "Opera Assistant Plugin registered"
        );

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service is required for Opera Assistant."
            );
        }

        /*
         * =========================
         * AI PROVIDER
         * =========================
         *
         * AI_PROVIDER=ollama -> local development
         * AI_PROVIDER=groq   -> production cloud provider
         *
         * Defaults to Ollama to preserve existing local behavior.
         */

        const providerName =
            (process.env.AI_PROVIDER ?? "ollama")
                .trim()
                .toLowerCase();

        let provider: AIProvider;

        switch (providerName) {
            case "ollama":
                provider = new OllamaProvider();
                break;

            case "groq":
                provider = new GroqProvider();
                break;

            default:
                throw new Error(
                    `Unsupported AI_PROVIDER "${providerName}". Use "ollama" or "groq".`
                );
        }

        /*
         * =========================
         * ASSISTANT CONTEXT
         * =========================
         */

        const contextService =
            new AssistantContextService();

        this.contextService =
            contextService;

        /*
         * =========================
         * ASSISTANT KNOWLEDGE
         * =========================
         */

        const knowledgeService =
            new AssistantKnowledgeService(
                database
            );

        this.knowledgeService =
            knowledgeService;

        /*
         * =========================
         * ASSISTANT SERVICE
         * =========================
         */

        const assistantService =
            new AssistantService(
                provider,
                knowledgeService
            );

        this.provider =
            provider;

        this.assistantService =
            assistantService;

        /*
         * =========================
         * REGISTER SERVICES
         * =========================
         */

        context.services.register(
            "assistantService",
            assistantService
        );

        context.services.register(
            "assistantContextService",
            contextService
        );

        context.services.register(
            "assistantKnowledgeService",
            knowledgeService
        );

        /*
         * =========================
         * COMMANDS
         * =========================
         */

        context.commands.registerCommand(
            AssistantKnowledgeCommand
        );

        /*
         * =========================
         * MESSAGE HANDLER
         * =========================
         */

        const messageHandler =
            new AssistantMessageHandler(
                context.client
            );

        this.messageHandler =
            messageHandler;

        /*
         * =========================
         * DISCORD EVENT
         * =========================
         */

        context.on(
            "messageCreate",
            message =>
                void messageHandler.handle(
                    message
                ),
            "premium"
        );

        context.logger.info(
            `AI provider initialized: ${provider.name}`
        );

        context.logger.info(
            "Opera Assistant message handler registered"
        );
    }

    /*
     * =========================
     * LOAD
     * =========================
     */

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Opera Assistant Plugin loaded"
        );
    }

    /*
     * =========================
     * UNLOAD
     * =========================
     */

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "Opera Assistant Plugin unloaded"
        );

        context.services.remove(
            "assistantService"
        );

        context.services.remove(
            "assistantContextService"
        );

        context.services.remove(
            "assistantKnowledgeService"
        );

        this.provider = null;
        this.assistantService = null;
        this.contextService = null;
        this.knowledgeService = null;
        this.messageHandler = null;
    }

    /*
     * =========================
     * GET ASSISTANT SERVICE
     * =========================
     */

    getAssistantService():
        AssistantService | null {

        return this.assistantService;
    }

    /*
     * =========================
     * GET PROVIDER
     * =========================
     */

    getProvider():
        AIProvider | null {

        return this.provider;
    }
}


END FILE: src/plugins/opera-assistant/OperaAssistantPlugin.ts
================================================================================

FILE: src/plugins/opera-assistant/plugin.json
--------------------------------------------------------------------------------
Original size: 213 bytes
Exported size: 205 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

{
    "id": "opera-assistant",
    "name": "Opera Assistant",
    "version": "1.0.0",
    "description": "A modular AI-powered server assistant for Quill & Ink.",
    "entry": "OperaAssistantPlugin.js"
}


END FILE: src/plugins/opera-assistant/plugin.json
================================================================================

FILE: src/plugins/opera-assistant/services/AssistantKnowledgeService.ts
--------------------------------------------------------------------------------
Original size: 2347 bytes
Exported size: 2229 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { PrismaService } from "../../../core/database/PrismaService.js";

export class AssistantKnowledgeService {

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * GET KNOWLEDGE
     * =========================
     */

    async get(
        guildId: string,
        key: string
    ) {

        return await this.database.db.assistantKnowledge.findUnique({
            where: {
                guildId_key: {
                    guildId,
                    key
                }
            }
        });
    }

    /*
     * =========================
     * GET ALL KNOWLEDGE
     * =========================
     */

    async getAll(
        guildId: string
    ) {

        return await this.database.db.assistantKnowledge.findMany({
            where: {
                guildId
            },

            orderBy: {
                key: "asc"
            }
        });
    }

    /*
     * =========================
     * SAVE KNOWLEDGE
     * =========================
     */

    async set(
        guildId: string,
        key: string,
        content: string,
        createdBy: string
    ) {

        return await this.database.db.assistantKnowledge.upsert({

            where: {
                guildId_key: {
                    guildId,
                    key
                }
            },

            create: {
                id:
                    crypto.randomUUID(),

                guildId,

                key,

                content,

                createdBy,

                updatedAt:
                    new Date()
            },

            update: {
                content,

                updatedAt:
                    new Date()
            }
        });
    }

    /*
     * =========================
     * DELETE KNOWLEDGE
     * =========================
     */

    async delete(
        guildId: string,
        key: string
    ): Promise<boolean> {

        const result =
            await this.database.db.assistantKnowledge.deleteMany({
                where: {
                    guildId,
                    key
                }
            });

        return result.count > 0;
    }
}

END FILE: src/plugins/opera-assistant/services/AssistantKnowledgeService.ts
================================================================================

EXCLUDED AND SKIPPED FILES
================================================================================
These files were not included in the source sections above.
- None.

KNOWLEDGE EXTRACTION GUIDANCE
================================================================================
- Use file paths as source references.
- Distinguish explicit code behavior from inferred behavior.
- Do not claim a command is registered solely because its source file exists.
- Trace handlers, services, configuration, and database calls before describing complete behavior.
- Distinguish implemented functionality from comments, plans, tests, and documentation.
- If evidence is incomplete or contradictory, state that uncertainty.
- Never infer live guild settings, database records, or current bot uptime from source code alone.
- This export may contain proprietary implementation details. Review it before sharing.

END OF TRacebook PROJECT KNOWLEDGE EXPORT
