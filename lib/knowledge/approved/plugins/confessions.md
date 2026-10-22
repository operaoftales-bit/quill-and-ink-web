QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:19:08.435Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/confessions
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
- This export is scoped to: src/plugins/confessions

EXPORT SUMMARY
================================================================================
Files exported: 5
Files excluded or skipped: 0
Original bytes in exported files: 32067
Bytes after redaction: 30859
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/confessions/commands/ConfessionChannelCommand.ts
00002. src/plugins/confessions/commands/ConfessionDeclinedDeleteCommand.ts
00003. src/plugins/confessions/commands/ConfessionsCommand.ts
00004. src/plugins/confessions/index.ts
00005. src/plugins/confessions/services/ConfessionService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/confessions/commands/ConfessionChannelCommand.ts
--------------------------------------------------------------------------------
Original size: 2835 bytes
Exported size: 2733 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    ChannelType,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ConfessionService } from "../services/ConfessionService.js";

export const ConfessionChannelCommand = {

    data:
        new SlashCommandBuilder()
            .setName(
                "confessionchanneladd"
            )
            .setDescription(
                "Configure the public confession channel."
            )
            .addChannelOption(option =>
                option
                    .setName(
                        "channel"
                    )
                    .setDescription(
                        "The channel where approved confessions will be published."
                    )
                    .addChannelTypes(
                        ChannelType.GuildText
                    )
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(
                PermissionFlagsBits.ManageGuild
            ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "This command can only be used in a server.",
                ephemeral: true
            });
            return;
        }

        const channel =
            interaction.options.getChannel(
                "channel",
                true
            );

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service not found."
            );
        }

        const service =
            new ConfessionService(
                database
            );

        await interaction.deferReply({
            ephemeral: true
        });

        try {

            await service.configureChannel(
                interaction.guild,
                channel.id
            );

            await interaction.editReply({
                content:
                    `Confessions are now configured in <#${channel.id}>. A private moderation thread has also been created.`
            });

        } catch (error) {

            await interaction.editReply({
                content:
                    error instanceof Error
                        ? error.message
                        : "Failed to configure confessions."
            });
        }
    }
};

END FILE: src/plugins/confessions/commands/ConfessionChannelCommand.ts
================================================================================

FILE: src/plugins/confessions/commands/ConfessionDeclinedDeleteCommand.ts
--------------------------------------------------------------------------------
Original size: 1923 bytes
Exported size: 1854 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ConfessionService } from "../services/ConfessionService.js";

export const ConfessionDeclinedDeleteCommand = {

    data:
        new SlashCommandBuilder()
            .setName(
                "confessiondeclineddelete"
            )
            .setDescription(
                "Delete all declined confessions."
            )
            .setDefaultMemberPermissions(
                PermissionFlagsBits.ManageMessages
            ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "This command can only be used in a server.",
                ephemeral: true
            });
            return;
        }

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service not found."
            );
        }

        const service =
            new ConfessionService(
                database
            );

        const deleted =
            await service.deleteDeclined(
                interaction.guild.id
            );

        await interaction.reply({
            content:
                deleted === 0
                    ? "There are no declined confessions to delete."
                    : `Deleted ${deleted} declined confession${deleted === 1 ? "" : "s"}.`,
            ephemeral: true
        });
    }
};

END FILE: src/plugins/confessions/commands/ConfessionDeclinedDeleteCommand.ts
================================================================================

FILE: src/plugins/confessions/commands/ConfessionsCommand.ts
--------------------------------------------------------------------------------
Original size: 3181 bytes
Exported size: 3058 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ConfessionService } from "../services/ConfessionService.js";

export const ConfessionsCommand = {

    data:
        new SlashCommandBuilder()
            .setName(
                "confessions"
            )
            .setDescription(
                "Submit an anonymous confession."
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(
                        "submit"
                    )
                    .setDescription(
                        "Submit an anonymous confession."
                    )
            ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "This command can only be used in a server.",
                ephemeral: true
            });

            return;
        }

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service not found."
            );
        }

        const service =
            new ConfessionService(
                database
            );

        const config =
            await service.getConfig(
                interaction.guild.id
            );

        if (!config) {
            await interaction.reply({
                content:
                    "Confessions have not been configured in this server yet.",
                ephemeral: true
            });

            return;
        }

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "confession:submit"
                )
                .setTitle(
                    "Anonymous Confession"
                );

        const input =
            new TextInputBuilder()
                .setCustomId(
                    "content"
                )
                .setLabel(
                    "Your confession"
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setPlaceholder(
                    "Write your confession..."
                )
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(4000);

        const row =
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    input
                );

        modal.addComponents(
            row
        );

        await interaction.showModal(
            modal
        );
    }
};

END FILE: src/plugins/confessions/commands/ConfessionsCommand.ts
================================================================================

FILE: src/plugins/confessions/index.ts
--------------------------------------------------------------------------------
Original size: 11133 bytes
Exported size: 10700 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionsBitField,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import { ConfessionChannelCommand } from "./commands/ConfessionChannelCommand.js";
import { ConfessionsCommand } from "./commands/ConfessionsCommand.js";
import { ConfessionDeclinedDeleteCommand } from "./commands/ConfessionDeclinedDeleteCommand.js";

import { ConfessionService } from "./services/ConfessionService.js";

export class ConfessionsPlugin implements Plugin {

    metadata = {
        id:
            "confessions",

        name:
            "Confessions",

        version:
            "1.0.0",

        description:
            "Anonymous confession submissions with private moderation and public publishing."
    };

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "Registering Confessions Plugin"
        );

        context.commands.registerCommand(
            ConfessionChannelCommand
        );

        context.commands.registerCommand(
            ConfessionsCommand
        );

        context.commands.registerCommand(
            ConfessionDeclinedDeleteCommand
        );

        context.on(
            "interactionCreate",
            async interaction => {

                if (
                    interaction.isButton()
                ) {

                    await this.handleButton(
                        context,
                        interaction
                    );

                    return;
                }

                if (
                    interaction.isModalSubmit()
                ) {

                    await this.handleModal(
                        context,
                        interaction
                    );
                }
            }
        );

        context.logger.info(
            "Confessions Plugin registered successfully"
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Confessions Plugin loaded"
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "Confessions Plugin unloaded"
        );
    }

    private async handleButton(
        context: PluginContext,
        interaction: ButtonInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            return;
        }

        if (
            !interaction.customId.startsWith(
                "confession:"
            )
        ) {
            return;
        }

        const parts =
            interaction.customId.split(":");

        const action =
            parts[1];

        const confessionId =
            parts[2];

        if (
            !action ||
            !confessionId
        ) {
            return;
        }

        if (
            !interaction.memberPermissions?.has(
                PermissionsBitField.Flags.ManageMessages
            ) &&
            !interaction.memberPermissions?.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {

            await interaction.reply({
                content:
                    "You are not authorized to moderate confessions.",
                ephemeral: true
            });

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service not found."
            );
        }

        const service =
            new ConfessionService(
                database
            );

        if (
            action === "accept"
        ) {

            await interaction.deferUpdate();

            try {

                await service.accept(
                    interaction.guild,
                    confessionId,
                    interaction.user.id
                );

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                "✅ Confession Accepted"
                            )
                            .setDescription(
                                "This confession has been published anonymously."
                            )
                            .setTimestamp()
                    ],
                    components: []
                });

            } catch (error) {

                await interaction.followUp({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Failed to accept confession.",
                    ephemeral: true
                });
            }

            return;
        }

        if (
            action === "decline"
        ) {

            const modal =
                new ModalBuilder()
                    .setCustomId(
                        `confession:decline:${confessionId}`
                    )
                    .setTitle(
                        "Decline Confession"
                    );

            const reason =
                new TextInputBuilder()
                    .setCustomId(
                        "reason"
                    )
                    .setLabel(
                        "Reason for declining"
                    )
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setPlaceholder(
                        "Explain why this confession was declined..."
                    )
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(1000);

            const row =
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        reason
                    );

            modal.addComponents(
                row
            );

            await interaction.showModal(
                modal
            );

            return;
        }
    }

    private async handleModal(
        context: PluginContext,
        interaction: ModalSubmitInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            return;
        }

        if (
            interaction.customId ===
            "confession:submit"
        ) {

            const content =
                interaction.fields.getTextInputValue(
                    "content"
                ).trim();

            if (!content) {

                await interaction.reply({
                    content:
                        "Your confession cannot be empty.",
                    ephemeral: true
                });

                return;
            }

            const database =
                context.services.get<PrismaService>(
                    "database"
                );

            if (!database) {
                throw new Error(
                    "Database service not found."
                );
            }

            const service =
                new ConfessionService(
                    database
                );

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                await service.submit(
                    interaction.guild,
                    interaction.user.id,
                    content
                );

                await interaction.editReply({
                    content:
                        "Your confession has been submitted anonymously for moderation."
                });

            } catch (error) {

                await interaction.editReply({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Failed to submit your confession."
                });
            }

            return;
        }

        if (
            interaction.customId.startsWith(
                "confession:decline:"
            )
        ) {

            if (
                !interaction.memberPermissions?.has(
                    PermissionsBitField.Flags.ManageMessages
                ) &&
                !interaction.memberPermissions?.has(
                    PermissionsBitField.Flags.Administrator
                )
            ) {

                await interaction.reply({
                    content:
                        "You are not authorized to moderate confessions.",
                    ephemeral: true
                });

                return;
            }

            const confessionId =
                interaction.customId.split(":")[2];

            const reason =
                interaction.fields.getTextInputValue(
                    "reason"
                ).trim();

            if (
                !confessionId ||
                !reason
            ) {

                await interaction.reply({
                    content:
                        "A valid confession and decline reason are required.",
                    ephemeral: true
                });

                return;
            }

            const database =
                context.services.get<PrismaService>(
                    "database"
                );

            if (!database) {
                throw new Error(
                    "Database service not found."
                );
            }

            const service =
                new ConfessionService(
                    database
                );

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                await service.decline(
                    interaction.guild,
                    confessionId,
                    interaction.user.id,
                    reason
                );

                await interaction.editReply({
                    content:
                        "The confession has been declined and the submitter has been notified."
                });

            } catch (error) {

                await interaction.editReply({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Failed to decline confession."
                });
            }
        }
    }
}

END FILE: src/plugins/confessions/index.ts
================================================================================

FILE: src/plugins/confessions/services/ConfessionService.ts
--------------------------------------------------------------------------------
Original size: 12995 bytes
Exported size: 12514 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChannelType,
    EmbedBuilder,
    Guild,
    TextChannel,
    ThreadChannel
} from "discord.js";

import { PrismaService } from "../../../core/database/PrismaService.js";

export class ConfessionService {

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * CONFIGURATION
     * =========================
     */

    async configureChannel(
        guild: Guild,
        channelId: string
    ): Promise<void> {

        const channel =
            await guild.channels.fetch(
                channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {
            throw new Error(
                "Confessions can only be configured in a text channel."
            );
        }

        const existing =
            await this.database.db.confessionConfig.findUnique({
                where: {
                    guildId: guild.id
                }
            });

        if (
            existing?.channelId === channel.id &&
            existing.moderationThreadId
        ) {

            const existingThread =
                await guild.channels.fetch(
                    existing.moderationThreadId
                ).catch(() => null);

            if (
                existingThread &&
                existingThread.isThread()
            ) {
                throw new Error(
                    "Confessions are already configured in this channel."
                );
            }
        }

        if (
            existing?.moderationThreadId
        ) {

            const oldThread =
                await guild.channels.fetch(
                    existing.moderationThreadId
                ).catch(() => null);

            if (
                oldThread &&
                oldThread.isThread()
            ) {

                await oldThread.delete(
                    "Confession moderation channel reconfigured"
                ).catch(() => undefined);
            }
        }

        const moderationThread =
            await channel.threads.create({
                name:
                    "confession-moderation",
                type:
                    ChannelType.PrivateThread,
                autoArchiveDuration:
                    1440,
                reason:
                    "Confession moderation thread"
            });

        try {

            const moderators =
                await this.getModerators(
                    guild
                );

            for (
                const moderatorId
                of moderators
            ) {

                await moderationThread.members.add(
                    moderatorId
                ).catch(() => undefined);
            }

            await moderationThread.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "📝 Confession Moderation"
                        )
                        .setDescription(
                            [
                                "Pending anonymous confessions will appear here.",
                                "",
                                "Moderators can accept or decline submissions.",
                                "The submitter's identity is intentionally hidden."
                            ].join("\n")
                        )
                        .setTimestamp()
                ]
            });

            await this.database.db.confessionConfig.upsert({
                where: {
                    guildId: guild.id
                },
                create: {
                    guildId: guild.id,
                    channelId: channel.id,
                    moderationThreadId:
                        moderationThread.id
                },
                update: {
                    channelId: channel.id,
                    moderationThreadId:
                        moderationThread.id
                }
            });

        } catch (error) {

            await moderationThread.delete()
                .catch(() => undefined);

            throw error;
        }
    }

    async getConfig(
        guildId: string
    ) {
        return this.database.db.confessionConfig.findUnique({
            where: {
                guildId
            }
        });
    }

    /*
     * =========================
     * MODERATION
     * =========================
     */

    async submit(
        guild: Guild,
        authorDiscordId: string,
        content: string
    ): Promise<void> {

        const config =
            await this.getConfig(
                guild.id
            );

        if (!config) {
            throw new Error(
                "Confessions have not been configured in this server."
            );
        }

        const moderationChannel =
            await guild.channels.fetch(
                config.moderationThreadId ?? ""
            ).catch(() => null);

        if (
            !moderationChannel ||
            !moderationChannel.isThread()
        ) {
            throw new Error(
                "The confession moderation thread is no longer available. Please ask an administrator to run /confessionchanneladd again."
            );
        }

        const confession =
            await this.database.db.confession.create({
                data: {
                    guildId: guild.id,
                    authorDiscordId,
                    content,
                    status: "PENDING"
                }
            });

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "📝 Pending Confession"
                )
                .setDescription(
                    content
                )
                .addFields({
                    name: "Confession ID",
                    value:
                        `\`${confession.id}\``
                })
                .setFooter({
                    text:
                        "The author's identity is hidden."
                })
                .setTimestamp();

        const message =
            await moderationChannel.send({
                embeds: [
                    embed
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                custom_id:
                                    `confession:accept:${confession.id}`,
                                label:
                                    "Accept",
                                style:
                                    3
                            },
                            {
                                type: 2,
                                custom_id:
                                    `confession:decline:${confession.id}`,
                                label:
                                    "Decline",
                                style:
                                    4
                            }
                        ]
                    }
                ]
            });

        await this.database.db.confession.update({
            where: {
                id: confession.id
            },
            data: {
                moderationMessageId:
                    message.id
            }
        });
    }

    async accept(
        guild: Guild,
        confessionId: string,
        moderatorId: string
    ): Promise<void> {

        const confession =
            await this.database.db.confession.findFirst({
                where: {
                    id: confessionId,
                    guildId: guild.id
                }
            });

        if (!confession) {
            throw new Error(
                "That confession could not be found."
            );
        }

        if (
            confession.status !== "PENDING"
        ) {
            throw new Error(
                "That confession has already been reviewed."
            );
        }

        const config =
            await this.getConfig(
                guild.id
            );

        if (!config) {
            throw new Error(
                "Confessions have not been configured in this server."
            );
        }

        const channel =
            await guild.channels.fetch(
                config.channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {
            throw new Error(
                "The confession public channel is no longer available."
            );
        }

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "💭 Anonymous Confession"
                )
                .setDescription(
                    confession.content
                )
                .setTimestamp();

        const published =
            await channel.send({
                embeds: [
                    embed
                ]
            });

        await this.database.db.confession.update({
            where: {
                id: confession.id
            },
            data: {
                status: "ACCEPTED",
                publishedMessageId:
                    published.id,
                reviewedBy:
                    moderatorId,
                reviewedAt:
                    new Date()
            }
        });
    }

    async decline(
        guild: Guild,
        confessionId: string,
        moderatorId: string,
        reason: string
    ): Promise<void> {

        const confession =
            await this.database.db.confession.findFirst({
                where: {
                    id: confessionId,
                    guildId: guild.id
                }
            });

        if (!confession) {
            throw new Error(
                "That confession could not be found."
            );
        }

        if (
            confession.status !== "PENDING"
        ) {
            throw new Error(
                "That confession has already been reviewed."
            );
        }

        await this.database.db.confession.update({
            where: {
                id: confession.id
            },
            data: {
                status: "DECLINED",
                declineReason:
                    reason,
                reviewedBy:
                    moderatorId,
                reviewedAt:
                    new Date()
            }
        });

        const user =
            await guild.client.users.fetch(
                confession.authorDiscordId
            ).catch(() => null);

        if (user) {

            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "📝 Confession Declined"
                        )
                        .setDescription(
                            [
                                "Your anonymous confession was not accepted.",
                                "",
                                `**Reason:** ${reason}`
                            ].join("\n")
                        )
                        .setTimestamp()
                ]
            }).catch(() => undefined);
        }
    }

    async deleteDeclined(
        guildId: string
    ): Promise<number> {

        const result =
            await this.database.db.confession.deleteMany({
                where: {
                    guildId,
                    status: "DECLINED"
                }
            });

        return result.count;
    }

    /*
     * =========================
     * MODERATORS
     * =========================
     */

    private async getModerators(
        guild: Guild
    ): Promise<string[]> {

        const members =
            await guild.members.fetch();

        return [
            ...new Set(
                members
                    .filter(member =>
                        member.permissions.has(
                            "ManageMessages"
                        ) ||
                        member.permissions.has(
                            "Administrator"
                        )
                    )
                    .map(member =>
                        member.id
                    )
            )
        ];
    }
}

END FILE: src/plugins/confessions/services/ConfessionService.ts
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
