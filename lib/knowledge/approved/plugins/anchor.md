QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-18T07:11:48.291Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/anchor
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
- This export is scoped to: src/plugins/anchor

EXPORT SUMMARY
================================================================================
Files exported: 3
Files excluded or skipped: 0
Original bytes in exported files: 17320
Bytes after redaction: 16623
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/anchor/AnchorPlugin.ts
00002. src/plugins/anchor/AnchorService.ts
00003. src/plugins/anchor/commands/AnchorCommand.ts

SOURCE FILES
================================================================================

FILE: src/plugins/anchor/AnchorPlugin.ts
--------------------------------------------------------------------------------
Original size: 8400 bytes
Exported size: 8075 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    Interaction,
    ChannelType,
} from "discord.js";


import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import { AnchorCommand } from "./commands/AnchorCommand.js";
import { AnchorService } from "./AnchorService.js";

export class AnchorPlugin implements Plugin {

    /*
     * =========================
     * PLUGIN METADATA
     * =========================
     */

    readonly metadata = {
        id: "anchor",
        name: "Anchor",
        version: "1.0.0",
        premium: True
        description:
            "Create persistent custom embed messages for your server."
    };

    /*
     * =========================
     * REGISTER
     * =========================
     */

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "Anchor Plugin registered"
        );

        /*
         * =========================
         * COMMAND
         * =========================
         */

        context.commands.registerCommand(
            AnchorCommand
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

            context.logger.error(
                "Database service not found"
            );

            return;
        }

        /*
         * =========================
         * SERVICE
         * =========================
         */

        const service =
            new AnchorService(
                database
            );

        /*
         * =========================
         * MODAL SUBMISSION
         * =========================
         */

        context.on(
            "interactionCreate",
            async (
                interaction: Interaction
            ): Promise<void> => {

                if (
                    !interaction.isModalSubmit()
                ) {
                    return;
                }

                if (
                    !interaction.customId.startsWith(
                        "anchor_create:"
                    )
                ) {
                    return;
                }

                /*
                 * =========================
                 * SERVER ONLY
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
                 * CHANNEL CHECK
                 * =========================
                 */

                const channel =
                    interaction.channel;

                if (
                    !channel ||
                    (
                        channel.type !==
                            ChannelType.GuildText &&
                        channel.type !==
                            ChannelType.GuildAnnouncement
                    )
                ) {

                    await interaction.reply({
                        content:
                            "❌ Anchors can only be created in a text channel.",
                        flags: 64
                    });

                    return;
                }

                /*
                 * =========================
                 * VERIFY MODAL USER
                 * =========================
                 */

                const [, userId] =
                    interaction.customId.split(
                        ":"
                    );

                if (
                    userId !==
                    interaction.user.id
                ) {

                    await interaction.reply({
                        content:
                            "❌ This Anchor builder belongs to another user.",
                        flags: 64
                    });

                    return;
                }

                /*
                 * =========================
                 * READ INPUTS
                 * =========================
                 */

                const title =
                    interaction.fields.getTextInputValue(
                        "anchor_title"
                    ).trim();

                const description =
                    interaction.fields.getTextInputValue(
                        "anchor_description"
                    ).trim();

                const url =
                    interaction.fields.getTextInputValue(
                        "anchor_url"
                    ).trim();

                const imageUrl =
                    interaction.fields.getTextInputValue(
                        "anchor_image"
                    ).trim();

                const footer =
                    interaction.fields.getTextInputValue(
                        "anchor_footer"
                    ).trim();

                /*
                 * =========================
                 * VALIDATION
                 * =========================
                 */

                if (!title) {

                    await interaction.reply({
                        content:
                            "❌ Anchor title cannot be empty.",
                        flags: 64
                    });

                    return;
                }

                if (!description) {

                    await interaction.reply({
                        content:
                            "❌ Anchor description cannot be empty.",
                        flags: 64
                    });

                    return;
                }

                /*
                 * =========================
                 * SAVE
                 * ========================= */

                try {

                    await service.createAnchor({
                        guildId:
                            interaction.guild.id,

                        channel:
                            channel,

                        title,
                        description,

                        url:
                            url || undefined,

                        imageUrl:
                            imageUrl || undefined,

                        footer:
                            footer || undefined
                    });

                    await interaction.reply({
                        content:
                            "✅ Anchor created successfully.",
                        flags: 64
                    });

                } catch (error) {

                    context.logger.error(
                        "Failed to create Anchor.",
                        error
                    );

                    const message =
                        error instanceof Error
                            ? error.message
                            : "An unexpected error occurred.";

                    await interaction.reply({
                        content:
                            `❌ Failed to create Anchor: ${message}`,
                        flags: 64
                    });
                }
            },
            "premium"
        );
    }

    /*
     * =========================
     * ON LOAD
     * =========================
     */

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Anchor Plugin loaded"
        );
    }

    /*
     * =========================
     * ON UNLOAD
     * =========================
     */

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "Anchor Plugin unloaded"
        );
    }
}

END FILE: src/plugins/anchor/AnchorPlugin.ts
================================================================================

FILE: src/plugins/anchor/AnchorService.ts
--------------------------------------------------------------------------------
Original size: 3362 bytes
Exported size: 3201 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    EmbedBuilder,
    NewsChannel,
    TextChannel
} from "discord.js";

import { PrismaService } from "../../core/database/PrismaService.js";

export interface CreateAnchorData {
    guildId: string;
    channel: TextChannel | NewsChannel;
    title: string;
    description: string;
    url?: string;
    imageUrl?: string;
    footer?: string;
}

export class AnchorService {

    constructor(
        private readonly database: PrismaService
    ) {}

    async createAnchor(
        data: CreateAnchorData
    ): Promise<void> {

        const embed =
            new EmbedBuilder()
                .setTitle(data.title)
                .setDescription(data.description);

        /*
         * =========================
         * TITLE URL
         * =========================
         */

        if (data.url) {

            const url =
                this.validateUrl(
                    data.url
                );

            embed.setURL(url);
        }

        /*
         * =========================
         * IMAGE
         * =========================
         */

        if (data.imageUrl) {

            const imageUrl =
                this.validateUrl(
                    data.imageUrl
                );

            embed.setImage(
                imageUrl
            );
        }

        /*
         * =========================
         * FOOTER
         * =========================
         */

        if (data.footer) {

            embed.setFooter({
                text: data.footer
            });
        }

        /*
         * =========================
         * SEND ANCHOR MESSAGE
         * =========================
         */

        const message =
            await data.channel.send({
                embeds: [
                    embed
                ]
            });

        /*
         * =========================
         * SAVE ANCHOR
         * =========================
         */

        try {

            await this.database.db.anchor.create({
                data: {
                    guildId:
                        data.guildId,

                    channelId:
                        data.channel.id,

                    messageId:
                        message.id
                }
            });

        } catch (error) {

            /*
             * If persistence fails after the
             * Discord message was created, remove
             * the orphaned message so Discord and
             * PostgreSQL do not disagree.
             */

            await message.delete()
                .catch(() => undefined);

            throw error;
        }
    }

    private validateUrl(
        value: string
    ): string {

        let parsed: URL;

        try {

            parsed =
                new URL(value);

        } catch {

            throw new Error(
                "The provided URL is invalid."
            );
        }

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {

            throw new Error(
                "Only HTTP and HTTPS URLs are supported."
            );
        }

        return parsed.toString();
    }
}

END FILE: src/plugins/anchor/AnchorService.ts
================================================================================

FILE: src/plugins/anchor/commands/AnchorCommand.ts
--------------------------------------------------------------------------------
Original size: 5558 bytes
Exported size: 5347 bytes
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

export const AnchorCommand = {

    data: new SlashCommandBuilder()
        .setName("anchor")
        .setDescription(
            "Create and manage persistent Anchor messages."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription(
                    "Create a persistent Anchor message in this channel."
                )
        ),

    access: "premium" as const,

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * SERVER ONLY
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
         * CREATE ANCHOR MODAL
         * =========================
         */

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `anchor_create:${interaction.user.id}`
                )
                .setTitle(
                    "⚓ Create Anchor"
                );

        /*
         * =========================
         * TITLE
         * =========================
         */

        const titleInput =
            new TextInputBuilder()
                .setCustomId(
                    "anchor_title"
                )
                .setLabel(
                    "Title"
                )
                .setPlaceholder(
                    "Enter the Anchor title"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(256);

        /*
         * =========================
         * DESCRIPTION
         * =========================
         */

        const descriptionInput =
            new TextInputBuilder()
                .setCustomId(
                    "anchor_description"
                )
                .setLabel(
                    "Description"
                )
                .setPlaceholder(
                    "Write the content of your Anchor. Links are supported."
                )
                .setStyle(
                    TextInputStyle.Paragraph
                )
                .setRequired(true)
                .setMaxLength(4000);

        /*
         * =========================
         * URL
         * =========================
         */

        const urlInput =
            new TextInputBuilder()
                .setCustomId(
                    "anchor_url"
                )
                .setLabel(
                    "Title URL (optional)"
                )
                .setPlaceholder(
                    "https://example.com"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setMaxLength(2048);

        /*
         * =========================
         * IMAGE
         * =========================
         */

        const imageInput =
            new TextInputBuilder()
                .setCustomId(
                    "anchor_image"
                )
                .setLabel(
                    "Image URL (optional)"
                )
                .setPlaceholder(
                    "https://example.com/image.png"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setMaxLength(2048);

        /*
         * =========================
         * FOOTER
         * =========================
         */

        const footerInput =
            new TextInputBuilder()
                .setCustomId(
                    "anchor_footer"
                )
                .setLabel(
                    "Footer (optional)"
                )
                .setPlaceholder(
                    "Optional footer text"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(false)
                .setMaxLength(2048);

        /*
         * =========================
         * MODAL ROWS
         * =========================
         */

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(titleInput),

            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(descriptionInput),

            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(urlInput),

            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(imageInput),

            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(footerInput)
        );

        await interaction.showModal(
            modal
        );
    }
};



END FILE: src/plugins/anchor/commands/AnchorCommand.ts
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
