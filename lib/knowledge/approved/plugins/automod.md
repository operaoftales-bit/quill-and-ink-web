QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:02:03.382Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/automod
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
- This export is scoped to: src/plugins/automod

EXPORT SUMMARY
================================================================================
Files exported: 3
Files excluded or skipped: 0
Original bytes in exported files: 21041
Bytes after redaction: 20072
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/automod/AutoModPlugin.ts
00002. src/plugins/automod/AutoModService.ts
00003. src/plugins/automod/plugin.json

SOURCE FILES
================================================================================

FILE: src/plugins/automod/AutoModPlugin.ts
--------------------------------------------------------------------------------
Original size: 4994 bytes
Exported size: 4792 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    Message
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";

import { AutoModService } from "./AutoModService.js";

export class AutoModPlugin implements Plugin {

    /*
     * =========================================================
     * PLUGIN METADATA
     * =========================================================
     */

    readonly metadata = {
        id: "automod",
        name: "AutoMod",
        version: "1.0.0",
        description:
            "Automatic moderation tools for Quill & Ink."
    };

    /*
     * =========================================================
     * SERVICE
     * =========================================================
     */

    private autoMod:
        AutoModService | null = null;

    /*
     * =========================================================
     * REGISTER
     * =========================================================
     */

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[AutoMod] Registering AutoMod plugin..."
        );

        /*
         * =========================
         * CREATE SERVICE
         * =========================
         *
         * Create one service instance for this
         * plugin lifecycle and reuse it for every
         * incoming message.
         *
         * The Advanced AutoMod service is looked
         * up when needed rather than captured here.
         *
         * This means Advanced AutoMod can be loaded
         * or unloaded independently without creating
         * a second message listener.
         */

        const autoMod =
            new AutoModService(
                () =>
                    context.services.get(
                        "advancedAutoMod"
                    )
            );

        this.autoMod =
            autoMod;

        /*
         * =========================
         * MESSAGE LISTENER
         * =========================
         *
         * PluginContext owns this listener and
         * removes it automatically when the
         * plugin is unloaded.
         */

        context.on(
            "messageCreate",
            async (
                message: Message
            ): Promise<void> => {

                try {

                    await autoMod.handleMessage(
                        message
                    );

                } catch (error) {

                    context.logger.error(
                        "[AutoMod] Failed to process message.",
                        error
                    );
                }
            }
        );

        /*
         * =========================
         * TRACKER CLEANUP
         * =========================
         *
         * AutoModService maintains temporary
         * tracker state. Clean that state
         * periodically.
         *
         * PluginContext owns the interval, so
         * it is automatically cleared when the
         * plugin is unloaded.
         */

        context.setInterval(
            () => {

                try {

                    autoMod.cleanupTrackers();

                } catch (error) {

                    context.logger.error(
                        "[AutoMod] Failed to clean up trackers.",
                        error
                    );
                }

            },
            60_000
        );

        context.logger.info(
            "[AutoMod] Registered message listener and tracker cleanup."
        );
    }

    /*
     * =========================================================
     * ON LOAD
     * =========================================================
     */

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "[AutoMod] Plugin loaded successfully."
        );
    }

    /*
     * =========================================================
     * ON UNLOAD
     * =========================================================
     */

    onUnload(
        context: PluginContext
    ): void {

        /*
         * Clear any remaining in-memory tracker state.
         *
         * PluginContext is responsible for removing
         * the Discord listener and cleanup interval.
         */

        if (this.autoMod) {

            try {

                this.autoMod.clearTrackers();

            } catch (error) {

                context.logger.error(
                    "[AutoMod] Failed to clear tracker state during unload.",
                    error
                );
            }
        }

        this.autoMod =
            null;

        context.logger.info(
            "[AutoMod] Plugin unloaded successfully."
        );
    }
}


END FILE: src/plugins/automod/AutoModPlugin.ts
================================================================================

FILE: src/plugins/automod/AutoModService.ts
--------------------------------------------------------------------------------
Original size: 15915 bytes
Exported size: 15153 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Message
} from "discord.js";

import {
    AutoModRuleType
} from "../../generated/prisma/client.js";

import {
    AdvancedAutoModService
} from "../advanced-automod/AdvancedAutoModService.js";

/*
 * =========================
 * MESSAGE TRACKER
 * =========================
 */

interface MessageTracker {

    content: string;

    count: number;

    lastMessageAt: number;

}

/*
 * =========================
 * AUTOMOD SERVICE
 * =========================
 */

export class AutoModService {

    /*
     * =========================
     * CONFIGURATION
     * =========================
     */

    private readonly maxMentions =
        10;

    private readonly repeatLimit =
        3;

    private readonly repeatWindow =
        10_000;

    /*
     * =========================
     * BLOCKED WORDS
     * =========================
     *
     * Temporary static fallback list.
     *
     * This is used when Advanced
     * AutoMod does not have a
     * configured WORD_FILTER rule.
     */

    private readonly blockedWords:
        readonly string[] = [

            "fuck",

            "fucking",

            "fucker",

            "shit",

            "bitch",

            "asshole",

            "bastard",

            "dick",

            "piss",

            "cunt",

            "sex",

            "nigger",

            "nigga",

            "shitass"

        ];

    /*
     * =========================
     * PRECOMPILED REGEX
     * =========================
     */

    private readonly blockedWordRegex:
        RegExp;

    private readonly inviteRegex =
        /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.com\/invite)\/[A-Za-z0-9-]+/i;

    /*
     * =========================
     * TRACKERS
     * =========================
     */

    private readonly trackers =
        new Map<
            string,
            MessageTracker
        >();

    /*
     * =========================
     * ADVANCED AUTOMOD
     * =========================
     *
     * The service is looked up lazily
     * through this provider.
     *
     * This prevents Basic AutoMod from
     * depending on Advanced AutoMod's
     * plugin load order.
     */

    private readonly getAdvancedAutoMod:
        () => AdvancedAutoModService | undefined;

    /*
     * =========================
     * CONSTRUCTOR
     * =========================
     */

    constructor(
        getAdvancedAutoMod:
            () => AdvancedAutoModService | undefined
    ) {

        this.getAdvancedAutoMod =
            getAdvancedAutoMod;

        const escapedWords =
            this.blockedWords.map(
                word =>
                    word.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    )
            );

        this.blockedWordRegex =
            new RegExp(
                `\\b(?:${escapedWords.join("|")})\\b`,
                "i"
            );

    }

    /*
     * =========================
     * ADVANCED DETECTION
     * =========================
     *
     * Delegates a detected rule to
     * Advanced AutoMod when available.
     *
     * Returns true when Advanced
     * AutoMod owns the detection.
     *
     * Returns false when:
     *
     * - Advanced AutoMod is unavailable
     * - Advanced AutoMod fails to process
     *   the detection
     *
     * In those cases Basic AutoMod
     * remains the fallback.
     */

    private async handleAdvancedDetection(
        message: Message,
        ruleType: AutoModRuleType
    ): Promise<boolean> {

        const advancedAutoMod =
            this.getAdvancedAutoMod();

        if (!advancedAutoMod) {
            return false;
        }

        try {

            return await advancedAutoMod.handleDetection(
                message,
                ruleType
            );

        } catch (error) {

            console.error(
                "[AutoModService] Failed to delegate detection to Advanced AutoMod:",
                error
            );

            return false;

        }

    }

    /*
     * =========================
     * HANDLE MESSAGE
     * =========================
     */

    async handleMessage(
        message: Message
    ): Promise<void> {

        /*
         * =========================
         * BASIC VALIDATION
         * =========================
         */

        if (!message.guild) {
            return;
        }

        if (message.author.bot) {
            return;
        }

        const content =
            message.content;

        /*
         * Ignore empty messages.
         */

        if (
            content.trim().length === 0
        ) {
            return;
        }

        /*
         * =========================
         * ADVANCED-ONLY DETECTION
         * =========================
         *
         * Advanced AutoMod handles:
         *
         * - MESSAGE_SPAM
         * - CAPS_SPAM
         * - EMOJI_SPAM
         * - LINK_FILTER
         * - ATTACHMENT_FILTER
         *
         * If Advanced AutoMod handles
         * the message, Basic AutoMod stops
         * processing it.
         */

        const advancedAutoMod =
            this.getAdvancedAutoMod();

        if (advancedAutoMod) {

            try {

                const handled =
                    await advancedAutoMod.handleAdvancedMessage(
                        message
                    );

                if (handled) {
                    return;
                }

            } catch (error) {

                console.error(
                    "[AutoModService] Failed to process Advanced AutoMod detection:",
                    error
                );

            }

        }

        /*
         * =========================
         * INVITE DETECTION
         * =========================
         */

        if (
            this.inviteRegex.test(
                content
            )
        ) {

            /*
             * Advanced AutoMod takes
             * ownership when an INVITE
             * rule is configured.
             */

            if (
                await this.handleAdvancedDetection(
                    message,
                    AutoModRuleType.INVITE
                )
            ) {
                return;
            }

            await this.deleteAndWarn(
                message,
                "Discord invite links are not allowed here."
            );

            return;

        }

        /*
         * =========================
         * MENTION SPAM
         * =========================
         *
         * Advanced AutoMod is checked
         * before the Basic threshold.
         *
         * This allows a configured
         * MENTION_SPAM rule to use its
         * own threshold.
         */

        if (advancedAutoMod) {

            try {

                const handled =
                    await advancedAutoMod.handleMentionSpam(
                        message
                    );

                if (handled) {
                    return;
                }

            } catch (error) {

                console.error(
                    "[AutoModService] Failed to process Advanced mention spam detection:",
                    error
                );

            }

        }

        const mentionCount =
            message.mentions.users.size +
            message.mentions.roles.size;

        if (
            mentionCount >
            this.maxMentions
        ) {

            /*
             * Fallback delegation in case
             * the Advanced service becomes
             * available/configured between
             * the initial check and here.
             */

            if (
                await this.handleAdvancedDetection(
                    message,
                    AutoModRuleType.MENTION_SPAM
                )
            ) {
                return;
            }

            await this.deleteAndWarn(
                message,
                "Too many mentions in one message are not allowed."
            );

            return;

        }

        /*
         * =========================
         * BLOCKED WORD DETECTION
         * =========================
         *
         * Advanced AutoMod is checked
         * before the static fallback.
         *
         * A configured Advanced
         * WORD_FILTER rule therefore
         * uses database blocked words.
         */

        if (advancedAutoMod) {

            try {

                const handled =
                    await advancedAutoMod.handleWordFilter(
                        message
                    );

                if (handled) {
                    return;
                }

            } catch (error) {

                console.error(
                    "[AutoModService] Failed to process Advanced word filter detection:",
                    error
                );

            }

        }

        if (
            this.blockedWordRegex.test(
                content
            )
        ) {

            /*
             * Fallback delegation for the
             * configured Advanced rule.
             */

            if (
                await this.handleAdvancedDetection(
                    message,
                    AutoModRuleType.WORD_FILTER
                )
            ) {
                return;
            }

            await this.deleteAndWarn(
                message,
                "That language is not allowed here."
            );

            return;

        }

        /*
         * =========================
         * REPEATED MESSAGE DETECTION
         * =========================
         *
         * Keep the existing Basic tracker.
         *
         * Advanced AutoMod is still given
         * ownership when the existing
         * tracker actually detects the
         * repeated message.
         */

        await this.handleRepeatedMessage(
            message
        );

    }

    /*
     * =========================
     * REPEATED MESSAGE HANDLER
     * =========================
     */

    private async handleRepeatedMessage(
        message: Message
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const key =
            `${message.guild.id}:${message.author.id}`;

        const now =
            Date.now();

        const existing =
            this.trackers.get(key);

        /*
         * Start a new tracking window when:
         *
         * - No tracker exists
         * - The previous window expired
         * - The message content changed
         */

        if (
            !existing ||
            now - existing.lastMessageAt >
                this.repeatWindow ||
            existing.content !==
                message.content
        ) {

            this.trackers.set(
                key,
                {
                    content:
                        message.content,

                    count:
                        1,

                    lastMessageAt:
                        now
                }
            );

            return;

        }

        /*
         * =========================
         * UPDATE TRACKER
         * =========================
         */

        existing.count++;

        existing.lastMessageAt =
            now;

        /*
         * Not enough repetitions yet.
         */

        if (
            existing.count <
            this.repeatLimit
        ) {
            return;
        }

        /*
         * =========================
         * TRIGGER AUTOMOD
         * =========================
         */

        this.trackers.delete(
            key
        );

        /*
         * Advanced AutoMod takes
         * ownership when a
         * REPEATED_MESSAGE rule
         * is configured.
         */

        if (
            await this.handleAdvancedDetection(
                message,
                AutoModRuleType.REPEATED_MESSAGE
            )
        ) {
            return;
        }

        /*
         * Basic fallback.
         */

        await this.deleteAndWarn(
            message,
            "Repeated messages are not allowed."
        );

    }

    /*
     * =========================
     * DELETE + TEMPORARY WARN
     * =========================
     *
     * Discord does not support true
     * ephemeral messages from a
     * messageCreate event.
     *
     * Therefore Basic AutoMod uses
     * a temporary channel message
     * which is deleted automatically.
     */

    private async deleteAndWarn(
        message: Message,
        reason: string
    ): Promise<void> {

        /*
         * =========================
         * DELETE MESSAGE
         * =========================
         */

        try {

            if (
                message.deletable
            ) {

                await message.delete();

            }

        } catch (error) {

            console.error(
                "[AutoModService] Failed to delete message:",
                error
            );

        }

        /*
         * =========================
         * SEND TEMPORARY WARNING
         * =========================
         */

        try {

            if (
                !message.channel.isSendable()
            ) {
                return;
            }

            const warningMessage =
                await message.channel.send({
                    content:
                        `⚠️ <@${message.author.id}>, ${reason}`
                });

            /*
             * Delete the warning after
             * five seconds.
             */

            setTimeout(
                () => {

                    if (
                        warningMessage.deletable
                    ) {

                        warningMessage
                            .delete()
                            .catch(
                                () => undefined
                            );

                    }

                },
                5_000
            );

        } catch (error) {

            console.error(
                "[AutoModService] Failed to send warning:",
                error
            );

        }

    }

    /*
     * =========================
     * CLEAN TRACKERS
     * =========================
     *
     * Removes expired entries so
     * the service cannot accumulate
     * stale users indefinitely.
     */

    cleanupTrackers(): void {

        const now =
            Date.now();

        for (
            const [
                key,
                tracker
            ]
            of this.trackers
        ) {

            if (
                now - tracker.lastMessageAt >
                this.repeatWindow
            ) {

                this.trackers.delete(
                    key
                );

            }

        }

    }

    /*
     * =========================
     * CLEAR ALL TRACKERS
     * =========================
     *
     * Useful when unloading the
     * plugin or resetting state.
     */

    clearTrackers(): void {

        this.trackers.clear();

    }

}

END FILE: src/plugins/automod/AutoModService.ts
================================================================================

FILE: src/plugins/automod/plugin.json
--------------------------------------------------------------------------------
Original size: 132 bytes
Exported size: 127 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
  "id": "automod",
  "name": "AutoMod",
  "version": "1.0.0",
  "description": "Automatic moderation tools for Quill & Ink"
}

END FILE: src/plugins/automod/plugin.json
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
