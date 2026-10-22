QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:27:05.109Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/logging
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
- This export is scoped to: src/plugins/logging

EXPORT SUMMARY
================================================================================
Files exported: 2
Files excluded or skipped: 0
Original bytes in exported files: 36341
Bytes after redaction: 34998
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/logging/LoggingPlugin.ts
00002. src/plugins/logging/plugin.json

SOURCE FILES
================================================================================

FILE: src/plugins/logging/LoggingPlugin.ts
--------------------------------------------------------------------------------
Original size: 36205 bytes
Exported size: 34868 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    EmbedBuilder,
    GuildMember,
    PartialGuildMember,
    Message,
    PartialMessage,
    VoiceState,
    User
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";
import { LoggingCommand } from "../../commands/logging/LoggingCommand.js";

type LoggingConfig = {
    loggingChannelId: string | null;
    logMemberJoin: boolean;
    logMemberLeave: boolean;
    logMessageDelete: boolean;
    logMessageEdit: boolean;
    logVoice: boolean;
    logModeration: boolean;
};

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C,
    primary: 0x5865F2
} as const;

export class LoggingPlugin implements Plugin {

    metadata = {
        id: "logging",
        name: "Logging",
        version: "2.0.0",
        description:
            "Professional server event, message, voice, and moderation logging."
    };

    /*
     * =========================================================
     * REGISTER
     * =========================================================
     */

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Logging] Registering logging plugin..."
        );

        /*
         * =========================
         * COMMAND
         * =========================
         */

        context.commands.registerCommand(
            LoggingCommand
        );

        /*
         * =========================
         * MEMBER EVENTS
         * =========================
         */

        context.on(
            "guildMemberAdd",
            async (
                member
            ) => {

                try {
                    await this.handleMemberJoin(
                        member,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        `[Logging] Unhandled member join event error in guild ${member.guild.id}.`,
                        error
                    );
                }
            }
        );

        context.on(
            "guildMemberRemove",
            async (
                member
            ) => {

                try {
                    await this.handleMemberLeave(
                        member,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        `[Logging] Unhandled member leave event error in guild ${member.guild.id}.`,
                        error
                    );
                }
            }
        );

        /*
         * =========================
         * MESSAGE EVENTS
         * =========================
         */

        context.on(
            "messageDelete",
            async (
                message
            ) => {

                try {
                    await this.handleMessageDelete(
                        message,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        "[Logging] Unhandled message delete event error.",
                        error
                    );
                }
            }
        );

        context.on(
            "messageUpdate",
            async (
                oldMessage,
                newMessage
            ) => {

                try {
                    await this.handleMessageUpdate(
                        oldMessage,
                        newMessage,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        "[Logging] Unhandled message update event error.",
                        error
                    );
                }
            }
        );

        /*
         * =========================
         * VOICE EVENTS
         * =========================
         */

        context.on(
            "voiceStateUpdate",
            async (
                oldState,
                newState
            ) => {

                try {
                    await this.handleVoiceStateUpdate(
                        oldState,
                        newState,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        `[Logging] Unhandled voice state event error in guild ${newState.guild.id}.`,
                        error
                    );
                }
            }
        );

        /*
         * =========================
         * MODERATION EVENTS
         * =========================
         */

        context.on(
            "guildBanAdd",
            async (
                ban
            ) => {

                try {
                    await this.handleBanAdd(
                        ban.guild.id,
                        ban.user,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        `[Logging] Unhandled ban event error in guild ${ban.guild.id}.`,
                        error
                    );
                }
            }
        );

        context.on(
            "guildBanRemove",
            async (
                ban
            ) => {

                try {
                    await this.handleBanRemove(
                        ban.guild.id,
                        ban.user,
                        context
                    );
                } catch (error) {
                    context.logger.error(
                        `[Logging] Unhandled unban event error in guild ${ban.guild.id}.`,
                        error
                    );
                }
            }
        );

        context.logger.info(
            "[Logging] Registered logging command and event listeners."
        );
    }

    /*
     * =========================================================
     * LOAD
     * =========================================================
     */

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Logging] Plugin loaded successfully."
        );
    }

    /*
     * =========================================================
     * UNLOAD
     * =========================================================
     */

    onUnload(
        context: PluginContext
    ): void {

        /*
         * PluginContext owns the event listeners and
         * removes them automatically during unload.
         */

        context.logger.info(
            "[Logging] Plugin unloaded successfully."
        );
    }

    /*
     * =========================================================
     * DATABASE
     * =========================================================
     */

    private getDatabase(
        context: PluginContext
    ): PrismaService | undefined {

        return context.services.get<PrismaService>(
            "database"
        );
    }

    /*
     * =========================================================
     * LOAD CONFIGURATION
     * =========================================================
     */

    private async getConfig(
        guildId: string,
        context: PluginContext
    ): Promise<LoggingConfig | null> {

        const database =
            this.getDatabase(context);

        if (!database) {

            context.logger.error(
                "[Logging] Database service is unavailable."
            );

            return null;
        }

        try {

            const config =
                await database.db.guildConfig.findUnique({
                    where: {
                        guildId
                    }
                });

            if (!config) {
                return null;
            }

            /*
             * General logging requires a configured
             * logging channel.
             *
             * moderationLogId is intentionally not used
             * here. Moderation cases have their own
             * dedicated destination.
             */

            if (!config.loggingChannelId) {
                return null;
            }

            return {
                loggingChannelId:
                    config.loggingChannelId,

                logMemberJoin:
                    config.logMemberJoin,

                logMemberLeave:
                    config.logMemberLeave,

                logMessageDelete:
                    config.logMessageDelete,

                logMessageEdit:
                    config.logMessageEdit,

                logVoice:
                    config.logVoice,

                logModeration:
                    config.logModeration
            };

        } catch (error) {

            context.logger.error(
                `[Logging] Failed to load configuration for guild ${guildId}.`,
                error
            );

            return null;
        }
    }

    /*
     * =========================================================
     * SEND LOG
     * =========================================================
     */

    private async sendLog(
        guildId: string,
        embed: EmbedBuilder,
        context: PluginContext
    ): Promise<void> {

        const config =
            await this.getConfig(
                guildId,
                context
            );

        if (!config?.loggingChannelId) {
            return;
        }

        const channel =
            context.client.channels.cache.get(
                config.loggingChannelId
            );

        if (!channel) {

            context.logger.warn(
                `[Logging] Configured logging channel ${config.loggingChannelId} was not found in guild ${guildId}.`
            );

            return;
        }

        if (!channel.isSendable()) {

            context.logger.warn(
                `[Logging] Configured logging channel ${config.loggingChannelId} is not sendable in guild ${guildId}.`
            );

            return;
        }

        try {

            await channel.send({
                embeds: [
                    embed
                ]
            });

        } catch (error) {

            context.logger.error(
                `[Logging] Failed to send log for guild ${guildId}.`,
                error
            );
        }
    }

    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    private truncate(
        value: string,
        limit = 1024
    ): string {

        if (value.length <= limit) {
            return value;
        }

        return `${value.slice(0, limit - 3)}...`;
    }

    private getUserIdentity(
        user: User
    ): string {

        return [
            `<@${user.id}>`,
            `**${user.displayName}**`,
            `@${user.username}`,
            `\`${user.id}\``
        ].join("\n");
    }

    private getUserAvatar(
        user: User
    ): string {

        return user.displayAvatarURL({
            size: 256
        });
    }

    private getTimestamp(
        timestamp: number | null | undefined
    ): string {

        if (!timestamp) {
            return "Unknown";
        }

        const unix =
            Math.floor(
                timestamp / 1000
            );

        return `<t:${unix}:F>\n(<t:${unix}:R>)`;
    }

    private getMemberCount(
        member:
            GuildMember |
            PartialGuildMember
    ): string {

        return member.guild.memberCount
            .toLocaleString();
    }

    /*
     * =========================================================
     * MEMBER JOIN
     * =========================================================
     */

    private async handleMemberJoin(
        member:
            GuildMember |
            PartialGuildMember,
        context: PluginContext
    ): Promise<void> {

        if (member.partial) {

            try {

                member =
                    await member.fetch();

            } catch (error) {

                context.logger.error(
                    `[Logging] Failed to fetch member ${member.id} for join logging.`,
                    error
                );

                return;
            }
        }

        const config =
            await this.getConfig(
                member.guild.id,
                context
            );

        if (
            !config ||
            !config.logMemberJoin
        ) {
            return;
        }

        const accountCreated =
            this.getTimestamp(
                member.user.createdTimestamp
            );

        const joinedAt =
            this.getTimestamp(
                member.joinedTimestamp
            );

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.success
                )
                .setTitle(
                    "📥 Member Joined"
                )
                .setThumbnail(
                    this.getUserAvatar(
                        member.user
                    )
                )
                .setDescription(
                    `${member} **${member.user.displayName}** has joined the server.`
                )
                .addFields(
                    {
                        name: "User",
                        value:
                            this.getUserIdentity(
                                member.user
                            ),
                        inline: true
                    },
                    {
                        name: "Account Created",
                        value:
                            accountCreated,
                        inline: true
                    },
                    {
                        name: "Joined Server",
                        value:
                            joinedAt,
                        inline: true
                    },
                    {
                        name: "Member Count",
                        value:
                            this.getMemberCount(
                                member
                            ),
                        inline: true
                    },
                    {
                        name: "Server",
                        value:
                            `${member.guild.name}\n\`${member.guild.id}\``,
                        inline: true
                    }
                )
                .setFooter({
                    text:
                        `User ID: ${member.id}`
                })
                .setTimestamp();

        await this.sendLog(
            member.guild.id,
            embed,
            context
        );
    }

    /*
     * =========================================================
     * MEMBER LEAVE
     * =========================================================
     */

    private async handleMemberLeave(
        member:
            GuildMember |
            PartialGuildMember,
        context: PluginContext
    ): Promise<void> {

        const config =
            await this.getConfig(
                member.guild.id,
                context
            );

        if (
            !config ||
            !config.logMemberLeave
        ) {
            return;
        }

        const joinedAt =
            this.getTimestamp(
                member.joinedTimestamp
            );

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.danger
                )
                .setTitle(
                    "📤 Member Left"
                )
                .setThumbnail(
                    this.getUserAvatar(
                        member.user
                    )
                )
                .setDescription(
                    `${member} **${member.user.displayName}** has left the server.`
                )
                .addFields(
                    {
                        name: "User",
                        value:
                            this.getUserIdentity(
                                member.user
                            ),
                        inline: true
                    },
                    {
                        name: "Joined Server",
                        value:
                            joinedAt,
                        inline: true
                    },
                    {
                        name: "Member Count",
                        value:
                            this.getMemberCount(
                                member
                            ),
                        inline: true
                    },
                    {
                        name: "Server",
                        value:
                            `${member.guild.name}\n\`${member.guild.id}\``,
                        inline: true
                    }
                )
                .setFooter({
                    text:
                        `User ID: ${member.id}`
                })
                .setTimestamp();

        await this.sendLog(
            member.guild.id,
            embed,
            context
        );
    }

    /*
     * =========================================================
     * MESSAGE DELETE
     * =========================================================
     */

    private async handleMessageDelete(
        message:
            Message |
            PartialMessage,
        context: PluginContext
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        const config =
            await this.getConfig(
                message.guild.id,
                context
            );

        if (
            !config ||
            !config.logMessageDelete
        ) {
            return;
        }

        if (message.author?.bot) {
            return;
        }

        const content =
            message.content?.trim();

        const displayContent =
            content
                ? this.truncate(content)
                : "*Message content unavailable.*";

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.danger
                )
                .setTitle(
                    "🗑️ Message Deleted"
                )
                .setThumbnail(
                    message.author
                        ? this.getUserAvatar(
                            message.author
                        )
                        : null
                )
                .setDescription(
                    message.author
                        ? `A message from ${message.author} was deleted in <#${message.channelId}>.`
                        : `A message was deleted in <#${message.channelId}>.`
                )
                .addFields(
                    {
                        name: "Author",
                        value:
                            message.author
                                ? this.getUserIdentity(
                                    message.author
                                )
                                : "Unknown user",
                        inline: true
                    },
                    {
                        name: "Channel",
                        value:
                            `<#${message.channelId}>`,
                        inline: true
                    },
                    {
                        name: "Message ID",
                        value:
                            `\`${message.id}\``,
                        inline: true
                    },
                    {
                        name: "Content",
                        value:
                            displayContent
                    }
                );

        if (
            message.attachments &&
            message.attachments.size > 0
        ) {

            const attachments =
                message.attachments
                    .map(
                        attachment =>
                            `[${attachment.name ?? "Attachment"}](${attachment.url})`
                    )
                    .join("\n");

            embed.addFields({
                name:
                    `Attachments (${message.attachments.size})`,
                value:
                    this.truncate(
                        attachments
                    )
            });
        }

        embed
            .setFooter({
                text:
                    `Message ID: ${message.id}`
            })
            .setTimestamp();

        await this.sendLog(
            message.guild.id,
            embed,
            context
        );
    }

    /*
     * =========================================================
     * MESSAGE EDIT
     * =========================================================
     */

    private async handleMessageUpdate(
        oldMessage:
            Message |
            PartialMessage,
        newMessage:
            Message |
            PartialMessage,
        context: PluginContext
    ): Promise<void> {

        if (!newMessage.guild) {
            return;
        }

        const config =
            await this.getConfig(
                newMessage.guild.id,
                context
            );

        if (
            !config ||
            !config.logMessageEdit
        ) {
            return;
        }

        if (newMessage.author?.bot) {
            return;
        }

        if (
            oldMessage.content ===
            newMessage.content
        ) {
            return;
        }

        const oldContent =
            oldMessage.content?.trim()
                || "*Previous content unavailable.*";

        const newContent =
            newMessage.content?.trim()
                || "*New content unavailable.*";

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.warning
                )
                .setTitle(
                    "✏️ Message Edited"
                )
                .setURL(
                    newMessage.url
                )
                .setThumbnail(
                    newMessage.author
                        ? this.getUserAvatar(
                            newMessage.author
                        )
                        : null
                )
                .setDescription(
                    newMessage.author
                        ? `A message from ${newMessage.author} was edited in <#${newMessage.channelId}>.`
                        : `A message was edited in <#${newMessage.channelId}>.`
                )
                .addFields(
                    {
                        name: "Author",
                        value:
                            newMessage.author
                                ? this.getUserIdentity(
                                    newMessage.author
                                )
                                : "Unknown user",
                        inline: true
                    },
                    {
                        name: "Channel",
                        value:
                            `<#${newMessage.channelId}>`,
                        inline: true
                    },
                    {
                        name: "Message",
                        value:
                            `[Jump to message](${newMessage.url})`,
                        inline: true
                    },
                    {
                        name: "Before",
                        value:
                            this.truncate(
                                oldContent
                            )
                    },
                    {
                        name: "After",
                        value:
                            this.truncate(
                                newContent
                            )
                    }
                )
                .setFooter({
                    text:
                        `Message ID: ${newMessage.id}`
                })
                .setTimestamp();

        await this.sendLog(
            newMessage.guild.id,
            embed,
            context
        );
    }

    /*
     * =========================================================
     * VOICE STATE UPDATE
     * =========================================================
     */

    private async handleVoiceStateUpdate(
        oldState: VoiceState,
        newState: VoiceState,
        context: PluginContext
    ): Promise<void> {

        const guild =
            newState.guild;

        const config =
            await this.getConfig(
                guild.id,
                context
            );

        if (
            !config ||
            !config.logVoice
        ) {
            return;
        }

        const member =
            newState.member ??
            oldState.member;

        if (!member) {
            return;
        }

        if (member.user.bot) {
            return;
        }

        /*
         * =========================
         * JOIN
         * =========================
         */

        if (
            !oldState.channelId &&
            newState.channelId
        ) {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        COLORS.success
                    )
                    .setTitle(
                        "🔊 Voice Channel Joined"
                    )
                    .setThumbnail(
                        this.getUserAvatar(
                            member.user
                        )
                    )
                    .setDescription(
                        `${member} **${member.user.displayName}** joined <#${newState.channelId}>.`
                    )
                    .addFields(
                        {
                            name: "Member",
                            value:
                                this.getUserIdentity(
                                    member.user
                                ),
                            inline: true
                        },
                        {
                            name: "Channel",
                            value:
                                `<#${newState.channelId}>`,
                            inline: true
                        },
                        {
                            name: "Server",
                            value:
                                guild.name,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            `User ID: ${member.id}`
                    })
                    .setTimestamp();

            await this.sendLog(
                guild.id,
                embed,
                context
            );

            return;
        }

        /*
         * =========================
         * LEAVE
         * =========================
         */

        if (
            oldState.channelId &&
            !newState.channelId
        ) {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        COLORS.danger
                    )
                    .setTitle(
                        "🔇 Voice Channel Left"
                    )
                    .setThumbnail(
                        this.getUserAvatar(
                            member.user
                        )
                    )
                    .setDescription(
                        `${member} **${member.user.displayName}** left <#${oldState.channelId}>.`
                    )
                    .addFields(
                        {
                            name: "Member",
                            value:
                                this.getUserIdentity(
                                    member.user
                                ),
                            inline: true
                        },
                        {
                            name: "Channel",
                            value:
                                `<#${oldState.channelId}>`,
                            inline: true
                        },
                        {
                            name: "Server",
                            value:
                                guild.name,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            `User ID: ${member.id}`
                    })
                    .setTimestamp();

            await this.sendLog(
                guild.id,
                embed,
                context
            );

            return;
        }

        /*
         * =========================
         * CHANNEL SWITCH
         * =========================
         */

        if (
            oldState.channelId &&
            newState.channelId &&
            oldState.channelId !==
                newState.channelId
        ) {

            const embed =
                new EmbedBuilder()
                    .setColor(
                        COLORS.primary
                    )
                    .setTitle(
                        "🔄 Voice Channel Switched"
                    )
                    .setThumbnail(
                        this.getUserAvatar(
                            member.user
                        )
                    )
                    .setDescription(
                        `${member} **${member.user.displayName}** moved to another voice channel.`
                    )
                    .addFields(
                        {
                            name: "Member",
                            value:
                                this.getUserIdentity(
                                    member.user
                                ),
                            inline: true
                        },
                        {
                            name: "From",
                            value:
                                `<#${oldState.channelId}>`,
                            inline: true
                        },
                        {
                            name: "To",
                            value:
                                `<#${newState.channelId}>`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            `User ID: ${member.id}`
                    })
                    .setTimestamp();

            await this.sendLog(
                guild.id,
                embed,
                context
            );
        }
    }

    /*
     * =========================================================
     * BAN
     * =========================================================
     */

    private async handleBanAdd(
        guildId: string,
        user: User,
        context: PluginContext
    ): Promise<void> {

        const config =
            await this.getConfig(
                guildId,
                context
            );

        if (
            !config ||
            !config.logModeration
        ) {
            return;
        }

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.danger
                )
                .setTitle(
                    "🔨 Member Banned"
                )
                .setThumbnail(
                    this.getUserAvatar(
                        user
                    )
                )
                .setDescription(
                    `${user} **${user.displayName}** has been banned from the server.`
                )
                .addFields(
                    {
                        name: "User",
                        value:
                            this.getUserIdentity(
                                user
                            ),
                        inline: true
                    },
                    {
                        name: "Action",
                        value:
                            "Ban",
                        inline: true
                    }
                )
                .setFooter({
                    text:
                        `User ID: ${user.id}`
                })
                .setTimestamp();

        await this.sendLog(
            guildId,
            embed,
            context
        );
    }

    /*
     * =========================================================
     * UNBAN
     * =========================================================
     */

    private async handleBanRemove(
        guildId: string,
        user: User,
        context: PluginContext
    ): Promise<void> {

        const config =
            await this.getConfig(
                guildId,
                context
            );

        if (
            !config ||
            !config.logModeration
        ) {
            return;
        }

        const embed =
            new EmbedBuilder()
                .setColor(
                    COLORS.success
                )
                .setTitle(
                    "🔓 Member Unbanned"
                )
                .setThumbnail(
                    this.getUserAvatar(
                        user
                    )
                )
                .setDescription(
                    `${user} **${user.displayName}** has been unbanned from the server.`
                )
                .addFields(
                    {
                        name: "User",
                        value:
                            this.getUserIdentity(
                                user
                            ),
                        inline: true
                    },
                    {
                        name: "Action",
                        value:
                            "Unban",
                        inline: true
                    }
                )
                .setFooter({
                    text:
                        `User ID: ${user.id}`
                })
                .setTimestamp();

        await this.sendLog(
            guildId,
            embed,
            context
        );
    }
}

END FILE: src/plugins/logging/LoggingPlugin.ts
================================================================================

FILE: src/plugins/logging/plugin.json
--------------------------------------------------------------------------------
Original size: 136 bytes
Exported size: 130 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
    "id": "logging",
    "name": "Logging",
    "version": "1.0.0",
    "description": "Server event and moderation logging."
}


END FILE: src/plugins/logging/plugin.json
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
