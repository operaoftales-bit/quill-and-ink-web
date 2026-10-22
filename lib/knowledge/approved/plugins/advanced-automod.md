QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T13:59:14.680Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/advanced-automod
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
- This export is scoped to: src/plugins/advanced-automod

EXPORT SUMMARY
================================================================================
Files exported: 2
Files excluded or skipped: 0
Original bytes in exported files: 42571
Bytes after redaction: 40520
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/advanced-automod/AdvancedAutoModPlugin.ts
00002. src/plugins/advanced-automod/AdvancedAutoModService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/advanced-automod/AdvancedAutoModPlugin.ts
--------------------------------------------------------------------------------
Original size: 2121 bytes
Exported size: 2034 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import { AdvancedAutoModService } from "./AdvancedAutoModService.js";

export class AdvancedAutoModPlugin implements Plugin {

    readonly metadata = {
        id: "advanced-automod",
        name: "Advanced AutoMod",
        version: "1.0.0",
        premium: True
        description:
            "Configurable advanced moderation tools for Quill & Ink."
    };

    private advancedAutoMod:
        AdvancedAutoModService | null = null;

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[AdvancedAutoMod] Registering Advanced AutoMod plugin..."
        );

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "PrismaService is not registered."
            );
        }

        const advancedAutoMod =
            new AdvancedAutoModService(
                database,
                context.client
            );

        context.services.register(
            "advancedAutoMod",
            advancedAutoMod
        );

        this.advancedAutoMod =
            advancedAutoMod;

        context.logger.info(
            "[AdvancedAutoMod] Service registered."
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "[AdvancedAutoMod] Plugin loaded successfully."
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        if (
            context.services.has(
                "advancedAutoMod"
            )
        ) {
            context.services.remove(
                "advancedAutoMod"
            );
        }

        this.advancedAutoMod =
            null;

        context.logger.info(
            "[AdvancedAutoMod] Plugin unloaded successfully."
        );
    }
}

END FILE: src/plugins/advanced-automod/AdvancedAutoModPlugin.ts
================================================================================

FILE: src/plugins/advanced-automod/AdvancedAutoModService.ts
--------------------------------------------------------------------------------
Original size: 40450 bytes
Exported size: 38486 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Client,
    Message
} from "discord.js";

import {
    AutoModAction,
    AutoModRuleType
} from "../../generated/prisma/client.js";

import { PrismaService } from "../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../core/moderation/ModerationCaseService.js";

export interface AdvancedAutoModRule {

    readonly id: string;

    readonly configId: string;

    readonly name: string;

    readonly type: AutoModRuleType;

    readonly enabled: boolean;

    readonly action: AutoModAction;

    readonly deleteMessage: boolean;

    readonly createWarning: boolean;

    readonly threshold: number | null;

    readonly windowMs: number | null;

    readonly timeoutDuration: number | null;

    readonly reason: string | null;

}

export interface AdvancedAutoModRuleAction {

    readonly id: string;

    readonly ruleId: string;

    readonly action: AutoModAction;

    readonly order: number;

    readonly timeoutDuration: number | null;

    readonly reason: string | null;

}

interface MessageSpamTracker {

    readonly guildId: string;

    readonly userId: string;

    windowMs: number;

    timestamps: number[];

}

export class AdvancedAutoModService {

    private readonly database: PrismaService;

    private readonly client: Client;

    /*
     * =========================
     * DETECTION TRACKERS
     * =========================
     */

    private readonly messageSpamTrackers =
        new Map<
            string,
            MessageSpamTracker
        >();

    /*
     * =========================
     * DEFAULT DETECTION VALUES
     * =========================
     *
     * These are only fallbacks when
     * a configured rule does not provide
     * a threshold/window.
     */

    private readonly defaultMessageSpamThreshold =
        5;

    private readonly defaultMessageSpamWindowMs =
        5_000;

    private readonly defaultCapsThreshold =
        70;

    private readonly defaultEmojiThreshold =
        10;

    /*
     * =========================
     * LINK DETECTION
     * =========================
     */

    private readonly linkRegex =
        /https?:\/\/[^\s<]+/i;

    /*
     * =========================
     * EMOJI DETECTION
     * =========================
     */

    private readonly customEmojiRegex =
        /<a?:[A-Za-z0-9_~]+:\d+>/g;

    private readonly unicodeEmojiRegex =
        /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

    /*
     * =========================
     * CONSTRUCTOR
     * =========================
     */

    constructor(
        database: PrismaService,
        client: Client
    ) {

        this.database =
            database;

        this.client =
            client;

    }

    get db() {
        return this.database.db;
    }

    /*
     * =========================
     * GET RULE
     * =========================
     */

    async getRule(
        guildId: string,
        ruleType: AutoModRuleType
    ): Promise<AdvancedAutoModRule | null> {

        const config =
            await this.db.autoModConfig.findUnique({

                where: {
                    guildId
                }

            });

        if (
            !config ||
            !config.enabled
        ) {
            return null;
        }

        const rule =
            await this.db.autoModRule.findUnique({

                where: {
                    configId_type: {
                        configId:
                            config.id,

                        type:
                            ruleType
                    }
                }

            });

        if (
            !rule ||
            !rule.enabled
        ) {
            return null;
        }

        return {

            id:
                rule.id,

            configId:
                rule.configId,

            name:
                rule.name,

            type:
                rule.type,

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
                rule.reason

        };

    }

    /*
     * =========================
     * RULE CONFIGURATION CHECK
     * =========================
     */

    async isRuleConfigured(
        guildId: string,
        ruleType: AutoModRuleType
    ): Promise<boolean> {

        const rule =
            await this.getRule(
                guildId,
                ruleType
            );

        return rule !== null;

    }

    /*
     * =========================
     * GET RULE ACTIONS
     * =========================
     */

    async getRuleActions(
        ruleId: string
    ): Promise<AdvancedAutoModRuleAction[]> {

        const actions =
            await this.db.autoModRuleAction.findMany({

                where: {
                    ruleId
                },

                orderBy: {
                    order:
                        "asc"
                }

            });

        return actions.map(
            action => ({

                id:
                    action.id,

                ruleId:
                    action.ruleId,

                action:
                    action.action,

                order:
                    action.order,

                timeoutDuration:
                    action.timeoutDuration,

                reason:
                    action.reason

            })
        );

    }

    /*
     * =========================
     * ADVANCED MESSAGE PROCESSING
     * =========================
     *
     * Handles advanced-only detections
     * that Basic AutoMod does not detect.
     *
     * Returns true when an advanced rule
     * actually handled the message.
     *
     * Returns false when:
     *
     * - No advanced rule triggered
     * - No advanced rule is configured
     * - The message does not match an
     *   advanced detection
     */

    async handleAdvancedMessage(
        message: Message
    ): Promise<boolean> {

        if (!message.guild) {
            return false;
        }

        if (message.author.bot) {
            return false;
        }

        /*
         * =========================
         * MESSAGE SPAM
         * =========================
         */

        const messageSpamRule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.MESSAGE_SPAM
            );

        if (messageSpamRule) {

            const triggered =
                this.trackMessageSpam(
                    message,
                    messageSpamRule
                );

            if (triggered) {

                if (
                    await this.isIgnored(
                        message
                    )
                ) {
                    return true;
                }

                try {

                    await this.executeRule(
                        message,
                        messageSpamRule
                    );

                } catch (error) {

                    console.error(
                        "[AdvancedAutoModService] Failed to execute MESSAGE_SPAM rule:",
                        error
                    );

                }

                return true;

            }

        }

        /*
         * =========================
         * CAPS SPAM
         * =========================
         */

        const capsRule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.CAPS_SPAM
            );

        if (capsRule) {

            if (
                this.isCapsSpam(
                    message,
                    capsRule
                )
            ) {

                if (
                    await this.isIgnored(
                        message
                    )
                ) {
                    return true;
                }

                try {

                    await this.executeRule(
                        message,
                        capsRule
                    );

                } catch (error) {

                    console.error(
                        "[AdvancedAutoModService] Failed to execute CAPS_SPAM rule:",
                        error
                    );

                }

                return true;

            }

        }

        /*
         * =========================
         * EMOJI SPAM
         * =========================
         */

        const emojiRule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.EMOJI_SPAM
            );

        if (emojiRule) {

            if (
                this.isEmojiSpam(
                    message,
                    emojiRule
                )
            ) {

                if (
                    await this.isIgnored(
                        message
                    )
                ) {
                    return true;
                }

                try {

                    await this.executeRule(
                        message,
                        emojiRule
                    );

                } catch (error) {

                    console.error(
                        "[AdvancedAutoModService] Failed to execute EMOJI_SPAM rule:",
                        error
                    );

                }

                return true;

            }

        }

        /*
         * =========================
         * LINK FILTER
         * =========================
         */

        const linkRule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.LINK_FILTER
            );

        if (linkRule) {

            if (
                this.linkRegex.test(
                    message.content
                )
            ) {

                if (
                    await this.isIgnored(
                        message
                    )
                ) {
                    return true;
                }

                try {

                    await this.executeRule(
                        message,
                        linkRule
                    );

                } catch (error) {

                    console.error(
                        "[AdvancedAutoModService] Failed to execute LINK_FILTER rule:",
                        error
                    );

                }

                return true;

            }

        }

        /*
         * =========================
         * ATTACHMENT FILTER
         * =========================
         */

        const attachmentRule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.ATTACHMENT_FILTER
            );

        if (attachmentRule) {

            if (
                message.attachments.size > 0
            ) {

                if (
                    await this.isIgnored(
                        message
                    )
                ) {
                    return true;
                }

                try {

                    await this.executeRule(
                        message,
                        attachmentRule
                    );

                } catch (error) {

                    console.error(
                        "[AdvancedAutoModService] Failed to execute ATTACHMENT_FILTER rule:",
                        error
                    );

                }

                return true;

            }

        }

        return false;

    }

    /*
     * =========================
     * MESSAGE SPAM TRACKING
     * =========================
     *
     * The threshold represents the
     * maximum number of messages allowed
     * inside the configured time window.
     *
     * Example with threshold = 5:
     *
     * Messages 1–5 → allowed
     * Message 6    → triggers
     */

    private trackMessageSpam(
        message: Message,
        rule: AdvancedAutoModRule
    ): boolean {

        if (!message.guild) {
            return false;
        }

        const threshold =
            Math.max(
                1,
                rule.threshold ??
                    this.defaultMessageSpamThreshold
            );

        const windowMs =
            Math.max(
                1_000,
                rule.windowMs ??
                    this.defaultMessageSpamWindowMs
            );

        const key =
            `${message.guild.id}:${message.author.id}`;

        const now =
            Date.now();

        let tracker =
            this.messageSpamTrackers.get(
                key
            );

        if (!tracker) {

            tracker = {

                guildId:
                    message.guild.id,

                userId:
                    message.author.id,

                windowMs,

                timestamps: []

            };

            this.messageSpamTrackers.set(
                key,
                tracker
            );

        }

        tracker.windowMs =
            windowMs;

        const cutoff =
            now - windowMs;

        tracker.timestamps =
            tracker.timestamps.filter(
                timestamp =>
                    timestamp >= cutoff
            );

        tracker.timestamps.push(
            now
        );

        /*
         * The configured threshold is the
         * number of messages allowed.
         */

        if (
            tracker.timestamps.length >
            threshold
        ) {

            tracker.timestamps = [];

            return true;

        }

        return false;

    }

    /*
     * =========================
     * CAPS SPAM
     * =========================
     */

    private isCapsSpam(
        message: Message,
        rule: AdvancedAutoModRule
    ): boolean {

        const content =
            message.content;

        let uppercaseCount =
            0;

        let lowercaseCount =
            0;

        for (
            const character
            of content
        ) {

            if (
                character >= "A" &&
                character <= "Z"
            ) {

                uppercaseCount++;

                continue;

            }

            if (
                character >= "a" &&
                character <= "z"
            ) {

                lowercaseCount++;

            }

        }

        const letterCount =
            uppercaseCount +
            lowercaseCount;

        if (
            letterCount === 0
        ) {
            return false;
        }

        const percentage =
            (
                uppercaseCount /
                letterCount
            ) *
            100;

        const threshold =
            Math.min(
                100,
                Math.max(
                    1,
                    rule.threshold ??
                        this.defaultCapsThreshold
                )
            );

        return (
            percentage >=
            threshold
        );

    }

    /*
     * =========================
     * EMOJI SPAM
     * =========================
     */

    private isEmojiSpam(
        message: Message,
        rule: AdvancedAutoModRule
    ): boolean {

        const content =
            message.content;

        const customMatches =
            content.match(
                this.customEmojiRegex
            ) ?? [];

        const unicodeMatches =
            content.match(
                this.unicodeEmojiRegex
            ) ?? [];

        const emojiCount =
            customMatches.length +
            unicodeMatches.length;

        const threshold =
            Math.max(
                1,
                rule.threshold ??
                    this.defaultEmojiThreshold
            );

        return (
            emojiCount >=
            threshold
        );

    }

    /*
     * =========================
     * CLEANUP TRACKERS
     * =========================
     */

    cleanupTrackers(): void {

        const now =
            Date.now();

        for (
            const [
                key,
                tracker
            ]
            of this.messageSpamTrackers
        ) {

            const lastTimestamp =
                tracker.timestamps[
                    tracker.timestamps.length - 1
                ];

            if (
                lastTimestamp === undefined ||
                now - lastTimestamp >
                    tracker.windowMs
            ) {

                this.messageSpamTrackers.delete(
                    key
                );

            }

        }

    }

    /*
     * =========================
     * CLEAR TRACKERS
     * =========================
     */

    clearTrackers(): void {

        this.messageSpamTrackers.clear();

    }

    /*
     * =========================
     * MENTION SPAM
     * =========================
     *
     * Called by Basic AutoMod before
     * its hardcoded mention threshold.
     *
     * When a MENTION_SPAM rule exists,
     * Advanced AutoMod owns the detection.
     */

    async handleMentionSpam(
        message: Message
    ): Promise<boolean> {

        if (
            !message.guild ||
            message.author.bot
        ) {
            return false;
        }

        const rule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.MENTION_SPAM
            );

        if (!rule) {
            return false;
        }

        const threshold =
            Math.max(
                1,
                rule.threshold ?? 10
            );

        const mentionCount =
            message.mentions.users.size +
            message.mentions.roles.size;

        /*
         * The rule is configured, so
         * Advanced AutoMod owns this
         * detection even when the
         * threshold has not been reached.
         */

        if (
            mentionCount < threshold
        ) {
            return true;
        }

        if (
            await this.isIgnored(
                message
            )
        ) {
            return true;
        }

        try {

            await this.executeRule(
                message,
                rule
            );

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to execute MENTION_SPAM rule:",
                error
            );

        }

        return true;

    }

    /*
     * =========================
     * WORD FILTER
     * =========================
     *
     * Uses guild-specific
     * AutoModBlockedWord records.
     *
     * When a WORD_FILTER rule exists,
     * Advanced AutoMod owns the detection
     * even if no blocked words match.
     */

    async handleWordFilter(
        message: Message
    ): Promise<boolean> {

        if (
            !message.guild ||
            message.author.bot
        ) {
            return false;
        }

        const rule =
            await this.getRule(
                message.guild.id,
                AutoModRuleType.WORD_FILTER
            );

        if (!rule) {
            return false;
        }

        const config =
            await this.db.autoModConfig.findUnique({

                where: {
                    guildId:
                        message.guild.id
                },

                select: {
                    id: true
                }

            });

        if (!config) {
            return true;
        }

        const blockedWords =
            await this.db.autoModBlockedWord.findMany({

                where: {

                    configId:
                        config.id,

                    enabled:
                        true

                },

                select: {

                    normalized:
                        true

                }

            });

        if (
            blockedWords.length === 0
        ) {
            return true;
        }

        const content =
            message.content;

        const matchesBlockedWord =
            blockedWords.some(
                blockedWord => {

                    const word =
                        blockedWord.normalized
                            .trim()
                            .toLocaleLowerCase();

                    if (!word) {
                        return false;
                    }

                    const escaped =
                        word.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );

                    const expression =
                        new RegExp(
                            `(?:^|[^\\p{L}\\p{N}_])${escaped}(?=$|[^\\p{L}\\p{N}_])`,
                            "iu"
                        );

                    return expression.test(
                        content
                    );

                }
            );

        if (!matchesBlockedWord) {
            return true;
        }

        if (
            await this.isIgnored(
                message
            )
        ) {
            return true;
        }

        try {

            await this.executeRule(
                message,
                rule
            );

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to execute WORD_FILTER rule:",
                error
            );

        }

        return true;

    }

    /*
     * =========================
     * ADVANCED DETECTION
     * =========================
     *
     * Called by the existing
     * Basic AutoMod message listener
     * for detections already supported
     * by Basic AutoMod.
     *
     * Returns true when an enabled
     * Advanced rule exists and therefore
     * owns this detection.
     */

    async handleDetection(
        message: Message,
        ruleType: AutoModRuleType
    ): Promise<boolean> {

        if (!message.guild) {
            return false;
        }

        if (message.author.bot) {
            return false;
        }

        const rule =
            await this.getRule(
                message.guild.id,
                ruleType
            );

        if (!rule) {
            return false;
        }

        if (
            await this.isIgnored(
                message
            )
        ) {
            return true;
        }

        try {

            await this.executeRule(
                message,
                rule
            );

        } catch (error) {

            console.error(
                `[AdvancedAutoModService] Failed to execute ${ruleType} rule:`,
                error
            );

        }

        return true;

    }

    /*
     * =========================
     * IGNORE CHECK
     * =========================
     */

    private async isIgnored(
        message: Message
    ): Promise<boolean> {

        if (!message.guild) {
            return true;
        }

        const config =
            await this.db.autoModConfig.findUnique({

                where: {
                    guildId:
                        message.guild.id
                },

                select: {
                    id:
                        true
                }

            });

        if (!config) {
            return false;
        }

        const [
            ignoredChannel,
            ignoredUser,
            member
        ] = await Promise.all([

            this.db.autoModIgnoredChannel.findUnique({

                where: {
                    configId_channelId: {

                        configId:
                            config.id,

                        channelId:
                            message.channel.id

                    }
                }

            }),

            this.db.autoModIgnoredUser.findUnique({

                where: {
                    configId_userId: {

                        configId:
                            config.id,

                        userId:
                            message.author.id

                    }
                }

            }),

            message.guild.members.fetch(
                message.author.id
            ).catch(
                () => null
            )

        ]);

        if (
            ignoredChannel ||
            ignoredUser
        ) {
            return true;
        }

        if (!member) {
            return false;
        }

        for (
            const roleId
            of member.roles.cache.keys()
        ) {

            const ignoredRole =
                await this.db.autoModIgnoredRole.findUnique({

                    where: {
                        configId_roleId: {

                            configId:
                                config.id,

                            roleId

                        }
                    }

                });

            if (ignoredRole) {
                return true;
            }

        }

        return false;

    }

    /*
     * =========================
     * RULE EXECUTION
     * =========================
     */

    private async executeRule(
        message: Message,
        rule: AdvancedAutoModRule
    ): Promise<void> {

        const actions =
            await this.getRuleActions(
                rule.id
            );

        const executionActions =
            actions.length > 0
                ? actions
                : [{

                    id:
                        `${rule.id}:default`,

                    ruleId:
                        rule.id,

                    action:
                        rule.action,

                    order:
                        0,

                    timeoutDuration:
                        rule.timeoutDuration,

                    reason:
                        rule.reason

                }];

        let warningCreated =
            false;

        const hasDeleteAction =
            executionActions.some(
                action =>
                    action.action ===
                    AutoModAction.DELETE
            );

        if (
            rule.deleteMessage &&
            !hasDeleteAction
        ) {

            await this.deleteMessage(
                message
            );

        }

        for (
            const action
            of executionActions
        ) {

            const createdWarning =
                await this.executeAction(
                    message,
                    rule,
                    action.action,
                    action.timeoutDuration,
                    action.reason
                );

            if (
                createdWarning
            ) {

                warningCreated =
                    true;

            }

        }

        if (
            rule.createWarning &&
            !warningCreated
        ) {

            await this.createWarning(
                message,
                rule.reason
            );

        }

    }

    /*
     * =========================
     * ACTION EXECUTION
     * =========================
     */

    private async executeAction(
        message: Message,
        rule: AdvancedAutoModRule,
        action: AutoModAction,
        timeoutDuration: number | null,
        actionReason: string | null
    ): Promise<boolean> {

        switch (action) {

            case AutoModAction.DELETE:

                await this.deleteMessage(
                    message
                );

                return false;

            case AutoModAction.WARN:

                await this.createWarning(
                    message,
                    actionReason ??
                        rule.reason
                );

                return true;

            case AutoModAction.TIMEOUT:

                await this.timeoutMember(
                    message,
                    timeoutDuration ??
                        rule.timeoutDuration,
                    actionReason ??
                        rule.reason
                );

                return false;

            case AutoModAction.KICK:

                await this.kickMember(
                    message,
                    actionReason ??
                        rule.reason
                );

                return false;

            case AutoModAction.BAN:

                await this.banMember(
                    message,
                    actionReason ??
                        rule.reason
                );

                return false;

        }

    }

    /*
     * =========================
     * DELETE
     * =========================
     */

    private async deleteMessage(
        message: Message
    ): Promise<void> {

        if (
            !message.deletable
        ) {
            return;
        }

        try {

            await message.delete();

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to delete message:",
                error
            );

        }

    }

    /*
     * =========================
     * WARNING
     * =========================
     */

    private async createWarning(
        message: Message,
        reason: string | null
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const moderatorId =
            this.client.user?.id;

        if (!moderatorId) {

            console.error(
                "[AdvancedAutoModService] Bot user is unavailable; cannot create warning."
            );

            return;

        }

        const warningReason =
            reason?.trim() ||
            "Automatic moderation rule triggered.";

        try {

            const warning =
                await this.db.warning.create({

                    data: {

                        guildId:
                            message.guild.id,

                        userId:
                            message.author.id,

                        moderatorId,

                        reason:
                            warningReason

                    }

                });

            const moderationCase =
                new ModerationCaseService(
                    this.database,
                    this.client
                );

            await moderationCase.createCase({

                guildId:
                    message.guild.id,

                userId:
                    message.author.id,

                moderatorId,

                action:
                    "WARN",

                reason:
                    warningReason

            });

            await this.sendWarningMessage(
                message,
                warningReason,
                warning.id
            );

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to create warning:",
                error
            );

        }

    }

    /*
     * =========================
     * TEMPORARY WARNING MESSAGE
     * =========================
     */

    private async sendWarningMessage(
        message: Message,
        reason: string,
        warningId: string
    ): Promise<void> {

        const config =
            message.guild
                ? await this.db.autoModConfig.findUnique({

                    where: {
                        guildId:
                            message.guild.id
                    },

                    select: {

                        warningEnabled:
                            true,

                        warningMessage:
                            true

                    }

                })
                : null;

        if (
            !config?.warningEnabled
        ) {
            return;
        }

        if (
            !message.channel.isSendable()
        ) {
            return;
        }

        const configuredMessage =
            config.warningMessage?.trim();

        const content =
            configuredMessage
                ? configuredMessage

                    .replace(
                        /\{user\}/gi,
                        `<@${message.author.id}>`
                    )

                    .replace(
                        /\{reason\}/gi,
                        reason
                    )

                    .replace(
                        /\{warningId\}/gi,
                        warningId
                    )

                : `⚠️ <@${message.author.id}>, ${reason}`;

        try {

            const warningMessage =
                await message.channel.send({

                    content

                });

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
                "[AdvancedAutoModService] Failed to send warning message:",
                error
            );

        }

    }

    /*
     * =========================
     * TIMEOUT
     * =========================
     */

    private async timeoutMember(
        message: Message,
        duration: number | null,
        reason: string | null
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const member =
            await message.guild.members.fetch(
                message.author.id
            ).catch(
                () => null
            );

        if (
            !member ||
            !member.moderatable
        ) {
            return;
        }

        const moderatorId =
            this.client.user?.id;

        if (!moderatorId) {
            return;
        }

        const timeoutDuration =
            Math.max(
                1_000,
                duration ??
                    60_000
            );

        const moderationReason =
            reason?.trim() ||
            "Automatic moderation rule triggered.";

        try {

            await member.timeout(
                timeoutDuration,
                moderationReason
            );

            const moderationCase =
                new ModerationCaseService(
                    this.database,
                    this.client
                );

            await moderationCase.createCase({

                guildId:
                    message.guild.id,

                userId:
                    message.author.id,

                moderatorId,

                action:
                    "TIMEOUT",

                reason:
                    moderationReason

            });

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to timeout member:",
                error
            );

        }

    }

    /*
     * =========================
     * KICK
     * =========================
     */

    private async kickMember(
        message: Message,
        reason: string | null
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const member =
            await message.guild.members.fetch(
                message.author.id
            ).catch(
                () => null
            );

        if (
            !member ||
            !member.kickable
        ) {
            return;
        }

        const moderatorId =
            this.client.user?.id;

        if (!moderatorId) {
            return;
        }

        const moderationReason =
            reason?.trim() ||
            "Automatic moderation rule triggered.";

        try {

            await member.kick(
                moderationReason
            );

            const moderationCase =
                new ModerationCaseService(
                    this.database,
                    this.client
                );

            await moderationCase.createCase({

                guildId:
                    message.guild.id,

                userId:
                    message.author.id,

                moderatorId,

                action:
                    "KICK",

                reason:
                    moderationReason

            });

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to kick member:",
                error
            );

        }

    }

    /*
     * =========================
     * BAN
     * =========================
     */

    private async banMember(
        message: Message,
        reason: string | null
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const member =
            await message.guild.members.fetch(
                message.author.id
            ).catch(
                () => null
            );

        if (
            !member ||
            !member.bannable
        ) {
            return;
        }

        const moderatorId =
            this.client.user?.id;

        if (!moderatorId) {
            return;
        }

        const moderationReason =
            reason?.trim() ||
            "Automatic moderation rule triggered.";

        try {

            await member.ban({

                reason:
                    moderationReason

            });

            const moderationCase =
                new ModerationCaseService(
                    this.database,
                    this.client
                );

            await moderationCase.createCase({

                guildId:
                    message.guild.id,

                userId:
                    message.author.id,

                moderatorId,

                action:
                    "BAN",

                reason:
                    moderationReason

            });

        } catch (error) {

            console.error(
                "[AdvancedAutoModService] Failed to ban member:",
                error
            );

        }

    }

}

END FILE: src/plugins/advanced-automod/AdvancedAutoModService.ts
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
