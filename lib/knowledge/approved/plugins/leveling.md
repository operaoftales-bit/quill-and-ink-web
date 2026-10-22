QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:26:21.808Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/leveling
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
- This export is scoped to: src/plugins/leveling

EXPORT SUMMARY
================================================================================
Files exported: 6
Files excluded or skipped: 0
Original bytes in exported files: 113769
Bytes after redaction: 109792
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/Leveling/commands/LeaderboardCommand.ts
00002. src/plugins/Leveling/commands/LevelingCommand.ts
00003. src/plugins/Leveling/commands/LevelRoleConfigCommand.ts
00004. src/plugins/Leveling/index.ts
00005. src/plugins/Leveling/LevelRoleHandler.ts
00006. src/plugins/Leveling/plugin.json

SOURCE FILES
================================================================================

FILE: src/plugins/Leveling/commands/LeaderboardCommand.ts
--------------------------------------------------------------------------------
Original size: 12853 bytes
Exported size: 12458 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const PAGE_SIZE = 10;

export const LeaderboardCommand = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription(
            "View the server's leveling leaderboard"
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "❌ This command can only be used in a server."
            });

            return;
        }

        await interaction.deferReply();

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            await interaction.editReply({
                content:
                    "❌ Database service is unavailable."
            });

            return;
        }

        try {
            const totalProfiles =
                await database.db.userProfile.count({
                    where: {
                        guildId:
                            interaction.guild.id
                    }
                });

            if (totalProfiles === 0) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x5865f2)
                            .setTitle(
                                "🏆 Server Leveling Leaderboard"
                            )
                            .setDescription(
                                "No leveling data exists in this server yet."
                            )
                            .setFooter({
                                text:
                                    interaction.guild.name
                            })
                    ]
                });

                return;
            }

            const totalPages =
                Math.ceil(
                    totalProfiles / PAGE_SIZE
                );

            let currentPage = 1;

            const createLeaderboard = async (
                page: number
            ): Promise<{
                embed: EmbedBuilder;
                row: ActionRowBuilder<ButtonBuilder>;
            }> => {

                const skip =
                    (page - 1) * PAGE_SIZE;

                const profiles =
                    await database.db.userProfile.findMany({
                        where: {
                            guildId:
                                interaction.guild!.id
                        },

                        orderBy: [
                            {
                                totalXp:
                                    "desc"
                            },
                            {
                                level:
                                    "desc"
                            }
                        ],

                        skip,
                        take: PAGE_SIZE
                    });

                const entries: string[] = [];

                for (
                    let index = 0;
                    index < profiles.length;
                    index++
                ) {
                    const profile =
                        profiles[index];

                    const globalPosition =
                        skip + index + 1;

                    const member =
                        interaction.guild!.members.cache.get(
                            profile.discordId
                        );

                    let name =
                        member?.displayName;

                    if (!name) {
                        try {
                            const fetchedMember =
                                await interaction.guild!.members.fetch(
                                    profile.discordId
                                );

                            name =
                                fetchedMember.displayName;
                        } catch {
                            name =
                                `User ${profile.discordId}`;
                        }
                    }

                    let positionDisplay: string;

                    if (globalPosition === 1) {
                        positionDisplay = "🥇";
                    } else if (
                        globalPosition === 2
                    ) {
                        positionDisplay = "🥈";
                    } else if (
                        globalPosition === 3
                    ) {
                        positionDisplay = "🥉";
                    } else {
                        positionDisplay =
                            `**${globalPosition}.**`;
                    }

                    entries.push(
                        [
                            `${positionDisplay} **${name}**`,
                            `> Level **${profile.level}**  •  **${profile.totalXp.toLocaleString()} XP**`
                        ].join("\n")
                    );
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setTitle(
                            "🏆 Server Leveling Leaderboard"
                        )
                        .setDescription(
                            entries.join("\n\n")
                        )
                        .setThumbnail(
                            interaction.guild!.iconURL({
                                size: 256
                            }) ?? null
                        )
                        .setFooter({
                            text:
                                `Page ${page} of ${totalPages} • ${totalProfiles.toLocaleString()} ranked players`
                        })
                        .setTimestamp();

                const previousButton =
                    new ButtonBuilder()
                        .setCustomId(
                            "leaderboard_previous"
                        )
                        .setLabel("Previous")
                        .setEmoji("◀️")
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                        .setDisabled(
                            page === 1
                        );

                const nextButton =
                    new ButtonBuilder()
                        .setCustomId(
                            "leaderboard_next"
                        )
                        .setLabel("Next")
                        .setEmoji("▶️")
                        .setStyle(
                            ButtonStyle.Primary
                        )
                        .setDisabled(
                            page === totalPages
                        );

                const row =
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            previousButton,
                            nextButton
                        );

                return {
                    embed,
                    row
                };
            };

            const initial =
                await createLeaderboard(
                    currentPage
                );

            const message =
                await interaction.editReply({
                    embeds: [
                        initial.embed
                    ],
                    components: [
                        initial.row
                    ]
                });

            if (totalPages <= 1) {
                return;
            }

            const collector =
                message.createMessageComponentCollector({
                    componentType:
                        ComponentType.Button,
                    time: 120_000
                });

            collector.on(
                "collect",
                async (
                    buttonInteraction: ButtonInteraction
                ) => {

                    if (
                        buttonInteraction.user.id !==
                        interaction.user.id
                    ) {
                        await buttonInteraction.reply({
                            content:
                                "❌ Only the person who opened this leaderboard can control it.",
                            ephemeral: true
                        });

                        return;
                    }

                    if (
                        buttonInteraction.customId ===
                        "leaderboard_previous"
                    ) {
                        currentPage =
                            Math.max(
                                1,
                                currentPage - 1
                            );
                    }

                    if (
                        buttonInteraction.customId ===
                        "leaderboard_next"
                    ) {
                        currentPage =
                            Math.min(
                                totalPages,
                                currentPage + 1
                            );
                    }

                    try {
                        const updated =
                            await createLeaderboard(
                                currentPage
                            );

                        await buttonInteraction.update({
                            embeds: [
                                updated.embed
                            ],
                            components: [
                                updated.row
                            ]
                        });

                    } catch (error) {
                        console.error(
                            "[Leveling] Failed to update leaderboard:",
                            error
                        );

                        await buttonInteraction.reply({
                            content:
                                "❌ Failed to update the leaderboard.",
                            ephemeral: true
                        });
                    }
                }
            );

            collector.on(
                "end",
                async () => {
                    try {
                        const final =
                            await createLeaderboard(
                                currentPage
                            );

                        const disabledPrevious =
                            ButtonBuilder.from(
                                final.row.components[0]
                            ).setDisabled(true);

                        const disabledNext =
                            ButtonBuilder.from(
                                final.row.components[1]
                            ).setDisabled(true);

                        const disabledRow =
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    disabledPrevious,
                                    disabledNext
                                );

                        await interaction.editReply({
                            components: [
                                disabledRow
                            ]
                        });

                    } catch {
                        // The original interaction/message may no longer exist.
                    }
                }
            );

        } catch (error) {
            console.error(
                "[Leveling] Failed to load leaderboard:",
                error
            );

            await interaction.editReply({
                content:
                    "❌ Failed to load the leveling leaderboard. Please try again later.",
                embeds: [],
                components: []
            });
        }
    }
};

END FILE: src/plugins/Leveling/commands/LeaderboardCommand.ts
================================================================================

FILE: src/plugins/Leveling/commands/LevelingCommand.ts
--------------------------------------------------------------------------------
Original size: 41856 bytes
Exported size: 40454 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

/*
 * =========================================================
 * DEFAULTS
 * =========================================================
 */

const DEFAULT_LEVELING_TITLE =
    "🎉 Level Up!";

const DEFAULT_LEVELING_MESSAGE =
    "{user} leveled up to **Level {level}**!";

const DEFAULT_LEVELING_COLOR =
    "#48D7FF";

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function isValidHttpUrl(
    value: string
): boolean {
    try {
        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}

function replacePlaceholders(
    template: string,
    values: {
        user: string;
        userid: string;
        username: string;
        displayname: string;
        avatar: string;
        server: string;
        servericon: string;
        membercount: string;
        level: string;
    }
): string {
    return template.replace(
        /\{(user|userid|username|displayname|avatar|server|servericon|membercount|level)\}/g,
        (
            _match,
            key: keyof typeof values
        ) => values[key] ?? ""
    );
}

function parseLevelingColor(
    color: string | null
): number {
    const value =
        color ??
        DEFAULT_LEVELING_COLOR;

    if (
        !/^#[0-9A-Fa-f]{6}$/.test(
            value
        )
    ) {
        return parseInt(
            DEFAULT_LEVELING_COLOR.slice(1),
            16
        );
    }

    return parseInt(
        value.slice(1),
        16
    );
}

/*
 * =========================================================
 * COMMAND
 * =========================================================
 */

export const LevelingCommand = {

    data: new SlashCommandBuilder()
        .setName("leveling")
        .setDescription(
            "Configure leveling channels, rich embeds, custom messages, and banner images"
        )

        /*
         * =====================================================
         * ENABLE
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("enable")
                    .setDescription(
                        "Enable level-up announcements"
                    )
        )

        /*
         * =====================================================
         * DISABLE
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("disable")
                    .setDescription(
                        "Disable level-up announcements"
                    )
        )

        /*
         * =====================================================
         * CHANNEL
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("channel")
                    .setDescription(
                        "Add or remove a level-up announcement channel"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("action")
                                .setDescription(
                                    "Choose whether to add or remove a channel"
                                )
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Add",
                                        value: "add"
                                    },
                                    {
                                        name: "Remove",
                                        value: "remove"
                                    }
                                )
                    )
                    .addChannelOption(
                        option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "The channel to add or remove"
                                )
                                .addChannelTypes(
                                    ChannelType.GuildText,
                                    ChannelType.GuildAnnouncement
                                )
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * CHANNEL LIST
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("channels")
                    .setDescription(
                        "List all level-up announcement channels"
                    )
        )

        /*
         * =====================================================
         * MESSAGE
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("message")
                    .setDescription(
                        "Set the level-up announcement message"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("message")
                                .setDescription(
                                    "Message text; placeholders such as {user} and {level} are supported"
                                )
                                .setMaxLength(4000)
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * TITLE
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("title")
                    .setDescription(
                        "Set the level-up announcement embed title"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("title")
                                .setDescription(
                                    "Embed title; placeholders are supported"
                                )
                                .setMaxLength(256)
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * IMAGE
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("image")
                    .setDescription(
                        "Set the level-up announcement banner image"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("url")
                                .setDescription(
                                    "Direct image URL displayed below the announcement text"
                                )
                                .setMaxLength(2000)
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * COLOR
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("color")
                    .setDescription(
                        "Set the level-up announcement embed color"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("color")
                                .setDescription(
                                    "Hex color such as #48D7FF"
                                )
                                .setMaxLength(7)
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * FOOTER
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("footer")
                    .setDescription(
                        "Set the level-up announcement embed footer"
                    )
                    .addStringOption(
                        option =>
                            option
                                .setName("footer")
                                .setDescription(
                                    "Embed footer text; placeholders are supported"
                                )
                                .setMaxLength(2048)
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * THUMBNAIL
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("thumbnail")
                    .setDescription(
                        "Choose whether the user's avatar appears as the thumbnail"
                    )
                    .addBooleanOption(
                        option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Show the user's avatar as the embed thumbnail"
                                )
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * TIMESTAMP
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("timestamp")
                    .setDescription(
                        "Choose whether level-up announcements show a timestamp"
                    )
                    .addBooleanOption(
                        option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Show the current time in the embed"
                                )
                                .setRequired(true)
                    )
        )

        /*
         * =====================================================
         * PREVIEW
         * =====================================================
         */

        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("preview")
                    .setDescription(
                        "Preview the current level-up announcement configuration"
                    )
        )

        /*
         * =====================================================
         * PERMISSIONS
         * =====================================================
         */

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild.toString()
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =====================================================
         * SERVER VALIDATION
         * =====================================================
         */

        if (!interaction.guild) {

            await interaction.reply({
                content:
                    "❌ This command can only be used in a server."
            });

            return;
        }

        /*
         * =====================================================
         * DATABASE
         * =====================================================
         */

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await interaction.reply({
                content:
                    "❌ Database service is unavailable."
            });

            return;
        }

        const guildId =
            interaction.guild.id;

        const subcommand =
            interaction.options.getSubcommand();

        /*
         * =====================================================
         * ENABLE / DISABLE
         * =====================================================
         */

        if (
            subcommand === "enable" ||
            subcommand === "disable"
        ) {

            const enabled =
                subcommand === "enable";

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingEnabled:
                            enabled
                    },

                    update: {
                        levelingEnabled:
                            enabled
                    }
                });

                await interaction.reply({
                    content:
                        enabled
                            ? "✅ Level-up announcements are now **enabled**."
                            : "🔕 Level-up announcements are now **disabled**."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update leveling enabled state:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the leveling configuration. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * CHANNEL ADD / REMOVE
         * =====================================================
         */

        if (subcommand === "channel") {

            const action =
                interaction.options.getString(
                    "action",
                    true
                );

            const channel =
                interaction.options.getChannel(
                    "channel",
                    true
                );

            if (
                channel.type !==
                    ChannelType.GuildText &&
                channel.type !==
                    ChannelType.GuildAnnouncement
            ) {

                await interaction.reply({
                    content:
                        "❌ Please select a text or announcement channel."
                });

                return;
            }

            try {

                /*
                 * ---------------------------------------------
                 * ADD
                 * ---------------------------------------------
                 */

                if (action === "add") {

                    const existing =
                        await database.db.levelingChannel.findUnique({
                            where: {
                                guildId_channelId: {
                                    guildId,
                                    channelId:
                                        channel.id
                                }
                            }
                        });

                    if (existing) {

                        await interaction.reply({
                            content:
                                `⚠️ ${channel} is already configured for level-up announcements.`
                        });

                        return;
                    }

                    await database.db.levelingChannel.create({
                        data: {
                            guildId,
                            channelId:
                                channel.id
                        }
                    });

                    await interaction.reply({
                        content:
                            `✅ ${channel} has been added to the level-up announcement channels.`
                    });

                    return;
                }

                /*
                 * ---------------------------------------------
                 * REMOVE
                 * ---------------------------------------------
                 */

                if (action === "remove") {

                    const existing =
                        await database.db.levelingChannel.findUnique({
                            where: {
                                guildId_channelId: {
                                    guildId,
                                    channelId:
                                        channel.id
                                }
                            }
                        });

                    if (!existing) {

                        await interaction.reply({
                            content:
                                `⚠️ ${channel} is not currently configured for level-up announcements.`
                        });

                        return;
                    }

                    await database.db.levelingChannel.delete({
                        where: {
                            guildId_channelId: {
                                guildId,
                                channelId:
                                    channel.id
                            }
                        }
                    });

                    await interaction.reply({
                        content:
                            `✅ ${channel} has been removed from the level-up announcement channels.`
                    });

                    return;
                }

                await interaction.reply({
                    content:
                        "❌ Invalid channel action."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement channel configuration:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the announcement channel configuration. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * CHANNEL LIST
         * =====================================================
         */

        if (subcommand === "channels") {

            try {

                const channels =
                    await database.db.levelingChannel.findMany({
                        where: {
                            guildId
                        },

                        orderBy: {
                            createdAt:
                                "asc"
                        }
                    });

                if (channels.length === 0) {

                    await interaction.reply({
                        content:
                            "📢 No level-up announcement channels are configured."
                    });

                    return;
                }

                const channelList =
                    channels
                        .map(
                            (entry, index) =>
                                `${index + 1}. <#${entry.channelId}>`
                        )
                        .join("\n");

                await interaction.reply({
                    content:
                        `📢 **Level-Up Announcement Channels**\n\n${channelList}`
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to load announcement channels:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to load the level-up announcement channels. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * MESSAGE
         * =====================================================
         */

        if (subcommand === "message") {

            const message =
                interaction.options.getString(
                    "message",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingMessage:
                            message
                    },

                    update: {
                        levelingMessage:
                            message
                    }
                });

                await interaction.reply({
                    content:
                        "✅ The level-up announcement message has been updated."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement message:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement message. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * TITLE
         * =====================================================
         */

        if (subcommand === "title") {

            const title =
                interaction.options.getString(
                    "title",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingTitle:
                            title
                    },

                    update: {
                        levelingTitle:
                            title
                    }
                });

                await interaction.reply({
                    content:
                        "✅ The level-up announcement title has been updated."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement title:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement title. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * IMAGE
         * =====================================================
         */

        if (subcommand === "image") {

            const imageUrl =
                interaction.options.getString(
                    "url",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingImageUrl:
                            imageUrl
                    },

                    update: {
                        levelingImageUrl:
                            imageUrl
                    }
                });

                await interaction.reply({
                    content:
                        "✅ The level-up announcement banner image has been updated."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement image:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement image. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * COLOR
         * =====================================================
         */

        if (subcommand === "color") {

            const color =
                interaction.options.getString(
                    "color",
                    true
                ).trim();

            if (
                !/^#[0-9A-Fa-f]{6}$/.test(
                    color
                )
            ) {

                await interaction.reply({
                    content:
                        "❌ Invalid color. Please use a six-digit hex color such as `#48D7FF`."
                });

                return;
            }

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingColor:
                            color
                    },

                    update: {
                        levelingColor:
                            color
                    }
                });

                await interaction.reply({
                    content:
                        `✅ The level-up announcement color has been set to \`${color}\`.`
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement color:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement color. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * FOOTER
         * =====================================================
         */

        if (subcommand === "footer") {

            const footer =
                interaction.options.getString(
                    "footer",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingFooter:
                            footer
                    },

                    update: {
                        levelingFooter:
                            footer
                    }
                });

                await interaction.reply({
                    content:
                        "✅ The level-up announcement footer has been updated."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement footer:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement footer. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * THUMBNAIL
         * =====================================================
         */

        if (subcommand === "thumbnail") {

            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingThumbnail:
                            enabled
                    },

                    update: {
                        levelingThumbnail:
                            enabled
                    }
                });

                await interaction.reply({
                    content:
                        enabled
                            ? "✅ The user's avatar will now appear as the level-up announcement thumbnail."
                            : "🔕 The level-up announcement thumbnail has been disabled."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement thumbnail setting:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement thumbnail setting. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * TIMESTAMP
         * =====================================================
         */

        if (subcommand === "timestamp") {

            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            try {

                await database.db.guildConfig.upsert({

                    where: {
                        guildId
                    },

                    create: {
                        guildId,
                        levelingTimestamp:
                            enabled
                    },

                    update: {
                        levelingTimestamp:
                            enabled
                    }
                });

                await interaction.reply({
                    content:
                        enabled
                            ? "✅ Timestamps are now enabled for level-up announcements."
                            : "🔕 Timestamps are now disabled for level-up announcements."
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to update announcement timestamp setting:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to update the level-up announcement timestamp setting. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * PREVIEW
         * =====================================================
         */

        if (subcommand === "preview") {

            try {

                const guildConfig =
                    await database.db.guildConfig.findUnique({
                        where: {
                            guildId
                        },

                        select: {
                            levelingMessage:
                                true,

                            levelingTitle:
                                true,

                            levelingImageUrl:
                                true,

                            levelingColor:
                                true,

                            levelingFooter:
                                true,

                            levelingThumbnail:
                                true,

                            levelingTimestamp:
                                true
                        }
                    });

                /*
                 * ---------------------------------------------
                 * FETCH MEMBER
                 * ---------------------------------------------
                 */

                const member =
                    await interaction.guild.members.fetch(
                        interaction.user.id
                    );

                /*
                 * ---------------------------------------------
                 * FETCH CURRENT LEVEL
                 * ---------------------------------------------
                 *
                 * Preview uses the next level so it looks
                 * like an actual level-up announcement.
                 */

                const profile =
                    await database.db.userProfile.findUnique({
                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    interaction.user.id
                            }
                        },

                        select: {
                            level:
                                true
                        }
                    });

                const previewLevel =
                    (profile?.level ?? 1) + 1;

                /*
                 * ---------------------------------------------
                 * PLACEHOLDER VALUES
                 * ---------------------------------------------
                 */

                const avatar =
                    member.displayAvatarURL({
                        extension: "png",
                        size: 256
                    });

                const serverIcon =
                    interaction.guild.iconURL({
                        extension: "png",
                        size: 256
                    }) ?? "";

                const values = {
                    user:
                        `<@${interaction.user.id}>`,

                    userid:
                        interaction.user.id,

                    username:
                        interaction.user.username,

                    displayname:
                        member.displayName,

                    avatar,

                    server:
                        interaction.guild.name,

                    servericon:
                        serverIcon,

                    membercount:
                        interaction.guild.memberCount.toString(),

                    level:
                        previewLevel.toString()
                };

                /*
                 * ---------------------------------------------
                 * TITLE + DESCRIPTION
                 * ---------------------------------------------
                 */

                const title =
                    replacePlaceholders(
                        guildConfig?.levelingTitle ??
                            DEFAULT_LEVELING_TITLE,
                        values
                    );

                const description =
                    replacePlaceholders(
                        guildConfig?.levelingMessage ??
                            DEFAULT_LEVELING_MESSAGE,
                        values
                    );

                /*
                 * ---------------------------------------------
                 * EMBED
                 * ---------------------------------------------
                 */

                const embed =
                    new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(
                            description
                        )
                        .setColor(
                            parseLevelingColor(
                                guildConfig?.levelingColor ??
                                    null
                            )
                        );

                /*
                 * ---------------------------------------------
                 * IMAGE
                 * ---------------------------------------------
                 */

                if (
                    guildConfig?.levelingImageUrl &&
                    isValidHttpUrl(
                        guildConfig.levelingImageUrl
                    )
                ) {

                    embed.setImage(
                        replacePlaceholders(
                            guildConfig.levelingImageUrl,
                            values
                        )
                    );
                }

                /*
                 * ---------------------------------------------
                 * THUMBNAIL
                 * ---------------------------------------------
                 */

                if (
                    guildConfig?.levelingThumbnail ??
                    true
                ) {

                    embed.setThumbnail(
                        avatar
                    );
                }

                /*
                 * ---------------------------------------------
                 * FOOTER
                 * ---------------------------------------------
                 */

                if (
                    guildConfig?.levelingFooter
                ) {

                    const footer =
                        replacePlaceholders(
                            guildConfig.levelingFooter,
                            values
                        );

                    if (
                        footer.length > 0
                    ) {

                        embed.setFooter({
                            text:
                                footer
                        });
                    }
                }

                /*
                 * ---------------------------------------------
                 * TIMESTAMP
                 * ---------------------------------------------
                 */

                if (
                    guildConfig?.levelingTimestamp
                ) {

                    embed.setTimestamp();
                }

                /*
                 * ---------------------------------------------
                 * SEND PREVIEW
                 * ---------------------------------------------
                 */

                await interaction.reply({
                    content:
                        "🔎 **Level-Up Announcement Preview**",
                    embeds: [
                        embed
                    ]
                });

            } catch (error) {

                console.error(
                    "[Leveling] Failed to generate announcement preview:",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Failed to generate the level-up announcement preview. Please try again later."
                });
            }

            return;
        }

        /*
         * =====================================================
         * FALLBACK
         * =====================================================
         */

        await interaction.reply({
            content:
                "❌ Unknown leveling configuration option."
        });
    }
};

END FILE: src/plugins/Leveling/commands/LevelingCommand.ts
================================================================================

FILE: src/plugins/Leveling/commands/LevelRoleConfigCommand.ts
--------------------------------------------------------------------------------
Original size: 23531 bytes
Exported size: 22680 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const PANEL_TIMEOUT = 120_000;
const MODAL_TIMEOUT = 60_000;

type LevelRoleInteraction =
    | ChatInputCommandInteraction
    | ButtonInteraction
    | ModalSubmitInteraction
    | RoleSelectMenuInteraction;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getDatabase(
    interaction: LevelRoleInteraction
): PrismaService | undefined {
    return (
        interaction.client as BotClient
    ).services.get<PrismaService>("database");
}

function isValidLevel(level: number): boolean {
    return Number.isInteger(level) && level >= 1;
}

function parseLevel(value: string): number | undefined {
    const trimmed = value.trim();

    if (!/^\d+$/.test(trimmed)) {
        return undefined;
    }

    const level = Number(trimmed);

    return isValidLevel(level)
        ? level
        : undefined;
}

function panelButtons(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("levelrole_add")
            .setLabel("Add / Update")
            .setEmoji("➕")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("levelrole_remove")
            .setLabel("Remove")
            .setEmoji("🗑️")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("levelrole_list")
            .setLabel("List")
            .setEmoji("📋")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("levelrole_clear")
            .setLabel("Clear All")
            .setEmoji("🧹")
            .setStyle(ButtonStyle.Secondary)
    );
}

function panelEmbed(): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("🎖️ Level Role Configuration")
        .setDescription(
            [
                "Configure automatic Discord roles awarded at leveling milestones.",
                "",
                "➕ **Add / Update** — Assign or replace a role for a level.",
                "🗑️ **Remove** — Remove a level-role reward.",
                "📋 **List** — View all configured level rewards.",
                "🧹 **Clear All** — Remove every level-role configuration.",
                "",
                "⚠️ Quill & Ink can only assign roles below its highest role.",
                "Managed/integration roles cannot be used."
            ].join("\n")
        )
        .setFooter({
            text: "Quill & Ink • Leveling"
        })
        .setTimestamp();
}

/*
 * =========================================================
 * COMMAND
 * =========================================================
 */

export const LevelRoleConfigCommand = {
    data: new SlashCommandBuilder()
        .setName("levelroleconfig")
        .setDescription(
            "Configure automatic roles awarded at leveling milestones"
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild.toString()
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                ephemeral: true
            });

            return;
        }

        const database = getDatabase(interaction);

        if (!database) {
            await interaction.reply({
                content:
                    "❌ Database service is unavailable.",
                ephemeral: true
            });

            return;
        }

        await interaction.reply({
            embeds: [panelEmbed()],
            components: [panelButtons()],
            ephemeral: true
        });

        const message = await interaction.fetchReply();

        const collector =
            message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: PANEL_TIMEOUT
            });

        collector.on(
            "collect",
            async (button: ButtonInteraction) => {
                if (
                    button.user.id !==
                    interaction.user.id
                ) {
                    await button.reply({
                        content:
                            "❌ This configuration panel belongs to someone else.",
                        ephemeral: true
                    });

                    return;
                }

                try {
                    switch (button.customId) {
                        case "levelrole_add":
                            await openAddModal(button);
                            break;

                        case "levelrole_remove":
                            await openRemoveModal(button);
                            break;

                        case "levelrole_list":
                            await showList(button);
                            break;

                        case "levelrole_clear":
                            await clearAll(button);
                            break;
                    }
                } catch (error) {
                    console.error(
                        "[LevelRoleConfig] Interaction error:",
                        error
                    );

                    if (
                        !button.replied &&
                        !button.deferred
                    ) {
                        await button.reply({
                            content:
                                "❌ Something went wrong while processing that action.",
                            ephemeral: true
                        }).catch(() => undefined);
                    }
                }
            }
        );

        collector.on(
            "end",
            async () => {
                try {
                    await interaction.editReply({
                        components: []
                    });
                } catch {
                    // Ephemeral message may no longer be editable.
                }
            }
        );
    }
};

/*
 * =========================================================
 * ADD / UPDATE
 * =========================================================
 */

async function openAddModal(
    interaction: ButtonInteraction
): Promise<void> {
    const modal = new ModalBuilder()
        .setCustomId("levelrole_add_modal")
        .setTitle("Add / Update Level Role");

    const levelInput = new TextInputBuilder()
        .setCustomId("level")
        .setLabel("Level")
        .setPlaceholder("Example: 5")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(6);

    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(levelInput)
    );

    await interaction.showModal(modal);

    let submitted: ModalSubmitInteraction;

    try {
        submitted =
            await interaction.awaitModalSubmit({
                time: MODAL_TIMEOUT,

                filter: modalInteraction =>
                    modalInteraction.user.id ===
                        interaction.user.id &&
                    modalInteraction.customId ===
                        "levelrole_add_modal"
            });
    } catch {
        return;
    }

    const level = parseLevel(
        submitted.fields.getTextInputValue("level")
    );

    if (level === undefined) {
        await submitted.reply({
            content:
                "❌ Level must be a positive whole number.",
            ephemeral: true
        });

        return;
    }

    const guild = submitted.guild;

    if (!guild) {
        await submitted.reply({
            content:
                "❌ This configuration can only be used in a server.",
            ephemeral: true
        });

        return;
    }

    await submitted.reply({
        content:
            `🎖️ Choose the role to award when a member reaches **Level ${level}**:`,
        components: [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
                .addComponents(
                    new RoleSelectMenuBuilder()
                        .setCustomId(
                            `levelrole_select:${level}:${interaction.user.id}`
                        )
                        .setPlaceholder(
                            "Select an existing server role"
                        )
                        .setMinValues(1)
                        .setMaxValues(1)
                )
        ],
        ephemeral: true
    });

    const roleMessage =
        await submitted.fetchReply();

    const roleCollector =
        roleMessage.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
            time: MODAL_TIMEOUT,
            max: 1
        });

    roleCollector.on(
        "collect",
        async (
            roleInteraction: RoleSelectMenuInteraction
        ) => {
            const roleGuild =
                roleInteraction.guild;

            if (!roleGuild) {
                await roleInteraction.update({
                    content:
                        "❌ This configuration can only be used in a server.",
                    components: []
                });

                return;
            }

            const [
                ,
                levelText,
                ownerId
            ] =
                roleInteraction.customId.split(":");

            if (
                ownerId !==
                interaction.user.id
            ) {
                await roleInteraction.reply({
                    content:
                        "❌ This configuration panel belongs to someone else.",
                    ephemeral: true
                });

                return;
            }

            const selectedLevel =
                Number(levelText);

            if (
                !isValidLevel(selectedLevel)
            ) {
                await roleInteraction.update({
                    content:
                        "❌ The selected level is invalid.",
                    components: []
                });

                return;
            }

            const roleId =
                roleInteraction.values[0];

            const role =
                roleGuild.roles.cache.get(
                    roleId
                );

            if (!role) {
                await roleInteraction.update({
                    content:
                        "❌ That role could not be found.",
                    components: []
                });

                return;
            }

            /*
             * @everyone cannot be assigned as a reward.
             */
            if (role.id === roleGuild.id) {
                await roleInteraction.update({
                    content:
                        "❌ The @everyone role cannot be used as a level reward.",
                    components: []
                });

                return;
            }

            /*
             * Managed/integration roles cannot be
             * manually assigned by the bot.
             */
            if (role.managed) {
                await roleInteraction.update({
                    content:
                        "❌ Managed/integration roles cannot be assigned by Quill & Ink.",
                    components: []
                });

                return;
            }

            const botMember =
                roleGuild.members.me;

            if (!botMember) {
                await roleInteraction.update({
                    content:
                        "❌ I could not determine my highest server role.",
                    components: []
                });

                return;
            }

            /*
             * Discord requires the bot's highest role
             * to be above the role it is assigning.
             */
            if (
                role.position >=
                botMember.roles.highest.position
            ) {
                await roleInteraction.update({
                    content:
                        "❌ I cannot assign that role because it is above or equal to my highest role.",
                    components: []
                });

                return;
            }

            const database =
                getDatabase(roleInteraction);

            if (!database) {
                await roleInteraction.update({
                    content:
                        "❌ Database service is unavailable.",
                    components: []
                });

                return;
            }

            try {
                await database.db.levelRole.upsert({
                    where: {
                        guildId_level: {
                            guildId:
                                roleGuild.id,

                            level:
                                selectedLevel
                        }
                    },

                    create: {
                        guildId:
                            roleGuild.id,

                        level:
                            selectedLevel,

                        roleId:
                            role.id
                    },

                    update: {
                        roleId:
                            role.id
                    }
                });

                await roleInteraction.update({
                    content:
                        `✅ **Level ${selectedLevel}** will now award ${role}.`,
                    components: []
                });
            } catch (error) {
                console.error(
                    "[LevelRoleConfig] Failed to save level role:",
                    error
                );

                await roleInteraction.update({
                    content:
                        "❌ Failed to save this level-role configuration. Please try again.",
                    components: []
                });
            }
        }
    );

    roleCollector.on(
        "end",
        async collected => {
            if (collected.size > 0) {
                return;
            }

            try {
                await submitted.editReply({
                    content:
                        "⌛ Role selection expired. Please use **Add / Update** again.",
                    components: []
                });
            } catch {
                // Interaction may no longer be editable.
            }
        }
    );
}

/*
 * =========================================================
 * REMOVE
 * =========================================================
 */

async function openRemoveModal(
    interaction: ButtonInteraction
): Promise<void> {
    const modal = new ModalBuilder()
        .setCustomId("levelrole_remove_modal")
        .setTitle("Remove Level Role");

    const levelInput = new TextInputBuilder()
        .setCustomId("level")
        .setLabel("Level")
        .setPlaceholder("Example: 5")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(6);

    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(levelInput)
    );

    await interaction.showModal(modal);

    let submitted: ModalSubmitInteraction;

    try {
        submitted =
            await interaction.awaitModalSubmit({
                time: MODAL_TIMEOUT,

                filter: modalInteraction =>
                    modalInteraction.user.id ===
                        interaction.user.id &&
                    modalInteraction.customId ===
                        "levelrole_remove_modal"
            });
    } catch {
        return;
    }

    const level = parseLevel(
        submitted.fields.getTextInputValue("level")
    );

    if (level === undefined) {
        await submitted.reply({
            content:
                "❌ Level must be a positive whole number.",
            ephemeral: true
        });

        return;
    }

    const guild = submitted.guild;

    if (!guild) {
        await submitted.reply({
            content:
                "❌ This configuration can only be used in a server.",
            ephemeral: true
        });

        return;
    }

    const database =
        getDatabase(submitted);

    if (!database) {
        await submitted.reply({
            content:
                "❌ Database service is unavailable.",
            ephemeral: true
        });

        return;
    }

    try {
        const existing =
            await database.db.levelRole.findUnique({
                where: {
                    guildId_level: {
                        guildId:
                            guild.id,

                        level
                    }
                }
            });

        if (!existing) {
            await submitted.reply({
                content:
                    `❌ No role is configured for **Level ${level}**.`,
                ephemeral: true
            });

            return;
        }

        await database.db.levelRole.delete({
            where: {
                guildId_level: {
                    guildId:
                        guild.id,

                    level
                }
            }
        });

        await submitted.reply({
            content:
                `✅ Removed the level-role reward for **Level ${level}**.`,
            ephemeral: true
        });
    } catch (error) {
        console.error(
            "[LevelRoleConfig] Failed to remove level role:",
            error
        );

        await submitted.reply({
            content:
                "❌ Failed to remove that level-role configuration. Please try again.",
            ephemeral: true
        });
    }
}

/*
 * =========================================================
 * LIST
 * =========================================================
 */

async function showList(
    interaction: ButtonInteraction
): Promise<void> {
    const guild = interaction.guild;

    if (!guild) {
        await interaction.reply({
            content:
                "❌ This command can only be used in a server.",
            ephemeral: true
        });

        return;
    }

    const database =
        getDatabase(interaction);

    if (!database) {
        await interaction.reply({
            content:
                "❌ Database service is unavailable.",
            ephemeral: true
        });

        return;
    }

    try {
        const configurations =
            await database.db.levelRole.findMany({
                where: {
                    guildId:
                        guild.id
                },

                orderBy: {
                    level: "asc"
                }
            });

        if (configurations.length === 0) {
            await interaction.reply({
                content:
                    "📋 No level roles have been configured yet.",
                ephemeral: true
            });

            return;
        }

        const lines =
            configurations.map(
                configuration => {
                    const role =
                        guild.roles.cache.get(
                            configuration.roleId
                        );

                    return role
                        ? `**Level ${configuration.level}** → ${role}`
                        : `**Level ${configuration.level}** → ⚠️ Role no longer exists`;
                }
            );

        const embed =
            new EmbedBuilder()
                .setTitle("📋 Level Roles")
                .setDescription(
                    lines.join("\n")
                )
                .setFooter({
                    text:
                        `Quill & Ink • ${configurations.length} configuration${configurations.length === 1 ? "" : "s"}`
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error(
            "[LevelRoleConfig] Failed to load level roles:",
            error
        );

        await interaction.reply({
            content:
                "❌ Failed to load the level-role configurations.",
            ephemeral: true
        });
    }
}

/*
 * =========================================================
 * CLEAR ALL
 * =========================================================
 */

async function clearAll(
    interaction: ButtonInteraction
): Promise<void> {
    const guild = interaction.guild;

    if (!guild) {
        await interaction.reply({
            content:
                "❌ This command can only be used in a server.",
            ephemeral: true
        });

        return;
    }

    const database =
        getDatabase(interaction);

    if (!database) {
        await interaction.reply({
            content:
                "❌ Database service is unavailable.",
            ephemeral: true
        });

        return;
    }

    try {
        const result =
            await database.db.levelRole.deleteMany({
                where: {
                    guildId:
                        guild.id
                }
            });

        await interaction.reply({
            content:
                result.count > 0
                    ? `🧹 Cleared **${result.count}** level-role configuration${result.count === 1 ? "" : "s"}.`
                    : "🧹 There were no level-role configurations to clear.",
            ephemeral: true
        });
    } catch (error) {
        console.error(
            "[LevelRoleConfig] Failed to clear level roles:",
            error
        );

        await interaction.reply({
            content:
                "❌ Failed to clear the level-role configurations.",
            ephemeral: true
        });
    }
}


END FILE: src/plugins/Leveling/commands/LevelRoleConfigCommand.ts
================================================================================

FILE: src/plugins/Leveling/index.ts
--------------------------------------------------------------------------------
Original size: 29816 bytes
Exported size: 28670 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    EmbedBuilder,
    Message
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import { LevelingCommand } from "./commands/LevelingCommand.js";
import { LevelRoleConfigCommand } from "./commands/LevelRoleConfigCommand.js";
import { LevelRoleHandler } from "./LevelRoleHandler.js";
import { LeaderboardCommand } from "./commands/LeaderboardCommand.js";

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

const XP_MIN = 15;
const XP_MAX = 25;

const XP_COOLDOWN = 60_000;

/*
 * Prevents runaway level-up loops if a profile somehow
 * contains corrupted/unexpected XP values.
 */
const MAX_LEVELS_PER_MESSAGE = 100;

/*
 * Keeps the in-memory cooldown map from growing forever.
 */
const COOLDOWN_CLEANUP_INTERVAL = 10 * 60_000;

/*
 * Default leveling announcement values.
 *
 * These are used when a guild has not customized
 * the corresponding setting.
 */
const DEFAULT_LEVELING_TITLE =
    "🎉 Level Up!";

const DEFAULT_LEVELING_MESSAGE =
    "{user} leveled up to **Level {level}**!";

const DEFAULT_LEVELING_COLOR =
    "#48D7FF";

/*
 * =========================================================
 * RUNTIME STATE
 * =========================================================
 */

const cooldowns = new Map<string, number>();

let lastCooldownCleanup = Date.now();

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function randomXP(): number {
    return (
        Math.floor(
            Math.random() *
            (XP_MAX - XP_MIN + 1)
        ) +
        XP_MIN
    );
}

/**
 * XP required to progress from the supplied level
 * to the next level.
 *
 * Level 1 -> 100 XP
 * Level 2 -> 400 XP
 * Level 3 -> 900 XP
 * etc.
 */
function xpForLevel(level: number): number {
    return level * level * 100;
}

function isSameDay(
    first: Date,
    second: Date
): boolean {
    return (
        first.getFullYear() ===
            second.getFullYear() &&
        first.getMonth() ===
            second.getMonth() &&
        first.getDate() ===
            second.getDate()
    );
}

function isYesterday(
    previous: Date,
    current: Date
): boolean {
    const previousDay =
        new Date(previous);

    const currentDay =
        new Date(current);

    previousDay.setHours(
        0,
        0,
        0,
        0
    );

    currentDay.setHours(
        0,
        0,
        0,
        0
    );

    const difference =
        currentDay.getTime() -
        previousDay.getTime();

    return (
        difference ===
        86_400_000
    );
}

/**
 * Removes expired cooldown entries periodically.
 *
 * This keeps the Map from growing indefinitely in
 * larger servers.
 */
function cleanupCooldowns(): void {
    const now = Date.now();

    if (
        now -
            lastCooldownCleanup <
        COOLDOWN_CLEANUP_INTERVAL
    ) {
        return;
    }

    lastCooldownCleanup = now;

    for (
        const [
            key,
            timestamp
        ] of cooldowns
    ) {
        if (
            now - timestamp >=
            XP_COOLDOWN
        ) {
            cooldowns.delete(key);
        }
    }
}

/**
 * Calculates the user's next streak value.
 */
function calculateStreak(
    existingStreak: number,
    lastXpAt: Date | null,
    now: Date
): number {
    if (!lastXpAt) {
        return Math.max(
            existingStreak,
            1
        );
    }

    if (
        isSameDay(
            lastXpAt,
            now
        )
    ) {
        return existingStreak;
    }

    if (
        isYesterday(
            lastXpAt,
            now
        )
    ) {
        return (
            existingStreak + 1
        );
    }

    return 1;
}

/**
 * Checks whether a configured URL is a valid
 * HTTP or HTTPS URL.
 */
function isValidHttpUrl(
    value: string
): boolean {
    try {
        const url =
            new URL(value);

        return (
            url.protocol ===
                "http:" ||
            url.protocol ===
                "https:"
        );
    } catch {
        return false;
    }
}

/**
 * Replaces supported leveling announcement
 * placeholders.
 */
function replacePlaceholders(
    template: string,
    values: {
        user: string;
        userid: string;
        username: string;
        displayname: string;
        avatar: string;
        server: string;
        servericon: string;
        membercount: string;
        level: string;
    }
): string {
    return template.replace(
        /\{(user|userid|username|displayname|avatar|server|servericon|membercount|level)\}/g,
        (
            _match,
            key: keyof typeof values
        ) => values[key] ?? ""
    );
}

/**
 * Converts a configured hexadecimal color into
 * the number expected by Discord.js.
 */
function parseLevelingColor(
    color: string | null
): number {
    const value =
        color ??
        DEFAULT_LEVELING_COLOR;

    if (
        !/^#[0-9A-Fa-f]{6}$/.test(
            value
        )
    ) {
        return parseInt(
            DEFAULT_LEVELING_COLOR.slice(
                1
            ),
            16
        );
    }

    return parseInt(
        value.slice(1),
        16
    );
}

/**
 * Builds the configurable level-up embed.
 */
function buildLevelingEmbed(
    message: Message,
    newLevel: number,
    config: {
        levelingMessage: string | null;
        levelingTitle: string | null;
        levelingImageUrl: string | null;
        levelingColor: string | null;
        levelingFooter: string | null;
        levelingThumbnail: boolean;
        levelingTimestamp: boolean;
    }
): EmbedBuilder {
    const guild =
        message.guild!;

    const member =
        message.member;

    const avatar =
        member?.displayAvatarURL({
            extension: "png",
            size: 256
        }) ??
        message.author.displayAvatarURL({
            extension: "png",
            size: 256
        });

    const serverIcon =
        guild.iconURL({
            extension: "png",
            size: 256
        }) ?? "";

    const values = {
        user:
            `<@${message.author.id}>`,

        userid:
            message.author.id,

        username:
            message.author.username,

        displayname:
            member?.displayName ??
            message.author.displayName,

        avatar,

        server:
            guild.name,

        servericon:
            serverIcon,

        membercount:
            guild.memberCount.toString(),

        level:
            newLevel.toString()
    };

    const title =
        replacePlaceholders(
            config.levelingTitle ??
                DEFAULT_LEVELING_TITLE,
            values
        );

    const description =
        replacePlaceholders(
            config.levelingMessage ??
                DEFAULT_LEVELING_MESSAGE,
            values
        );

    const embed =
        new EmbedBuilder()
            .setTitle(title)
            .setDescription(
                description
            )
            .setColor(
                parseLevelingColor(
                    config.levelingColor
                )
            );

    /*
     * Optional normal Discord embed image.
     *
     * This is deliberately set as the embed image,
     * meaning it appears underneath the text rather
     * than being rendered into a custom card.
     */
    if (
        config.levelingImageUrl &&
        isValidHttpUrl(
            config.levelingImageUrl
        )
    ) {
        embed.setImage(
            replacePlaceholders(
                config.levelingImageUrl,
                values
            )
        );
    }

    /*
     * User avatar thumbnail.
     *
     * Defaults to enabled through Prisma.
     */
    if (
        config.levelingThumbnail
    ) {
        embed.setThumbnail(
            avatar
        );
    }

    /*
     * Optional footer.
     */
    if (
        config.levelingFooter
    ) {
        const footer =
            replacePlaceholders(
                config.levelingFooter,
                values
            );

        if (footer.length > 0) {
            embed.setFooter({
                text: footer
            });
        }
    }

    /*
     * Optional timestamp.
     */
    if (
        config.levelingTimestamp
    ) {
        embed.setTimestamp();
    }

    return embed;
}

/*
 * =========================================================
 * PLUGIN
 * =========================================================
 */

export class LevelingPlugin
    implements Plugin {

    metadata = {
        id: "leveling",
        name: "Leveling",
        version: "1.0.0",
        description:
            "XP, levels, streaks and level-role rewards for Quill & Ink"
    };

    /*
     * =====================================================
     * REGISTER
     * =====================================================
     */

    register(
        context: PluginContext
    ): void {
        context.logger.info(
            "Registering Leveling Plugin"
        );

        context.commands.registerCommand(
            LevelingCommand
        );

        context.commands.registerCommand(
            LevelRoleConfigCommand
        );

        context.commands.registerCommand(
            LeaderboardCommand
        );

        context.on(
            "messageCreate",
            async message => {
                await this.handleMessage(
                    message,
                    context
                );
            }
        );

        context.logger.info(
            "Leveling Plugin registered successfully"
        );
    }

    /*
     * =====================================================
     * LOAD
     * =====================================================
     */

    onLoad(
        context: PluginContext
    ): void {
        context.logger.info(
            "Leveling Plugin loaded"
        );
    }

    /*
     * =====================================================
     * UNLOAD
     * =====================================================
     */

    onUnload(
        context: PluginContext
    ): void {
        cooldowns.clear();

        lastCooldownCleanup =
            Date.now();

        context.logger.info(
            "Leveling Plugin unloaded"
        );
    }

    /*
     * =====================================================
     * MESSAGE HANDLER
     * =====================================================
     */

    private async handleMessage(
        message: Message,
        context: PluginContext
    ): Promise<void> {

        /*
         * =================================================
         * BASIC VALIDATION
         * =================================================
         */

        if (!message.guild) {
            return;
        }

        if (message.author.bot) {
            return;
        }

        /*
         * Ignore messages without an author.
         *
         * This should normally never happen, but keeping
         * the handler defensive prevents unexpected errors.
         */

        if (!message.author.id) {
            return;
        }

        /*
         * =================================================
         * PERIODIC COOLDOWN CLEANUP
         * =================================================
         */

        cleanupCooldowns();

        /*
         * =================================================
         * PLUGIN ENABLE CHECK
         * =================================================
         *
         * This determines whether the leveling system
         * itself is active in this guild.
         */

        const levelingPluginEnabled =
            context.guildPlugins.isEnabled(
                message.guild.id,
                "leveling"
            );

        if (
            !levelingPluginEnabled
        ) {
            return;
        }

        /*
         * =================================================
         * COOLDOWN CHECK
         * =================================================
         */

        const cooldownKey =
            `${message.guild.id}:${message.author.id}`;

        const nowTimestamp =
            Date.now();

        const lastXP =
            cooldowns.get(
                cooldownKey
            );

        if (
            lastXP !== undefined &&
            nowTimestamp -
                lastXP <
            XP_COOLDOWN
        ) {
            return;
        }

        /*
         * =================================================
         * DATABASE
         * =================================================
         */

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            context.logger.error(
                "[Leveling] Database service is unavailable"
            );

            return;
        }

        const now =
            new Date();

        const guildId =
            message.guild.id;

        const userId =
            message.author.id;

        /*
         * =================================================
         * FETCH PROFILE
         * =================================================
         */

        let existingProfile;

        try {
            existingProfile =
                await database.db.userProfile.findUnique({
                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId:
                                userId
                        }
                    }
                });
        } catch (error) {
            context.logger.error(
                `[Leveling] Failed to load profile for ${userId}:`,
                error
            );

            return;
        }

        /*
         * =================================================
         * XP
         * =================================================
         */

        const gainedXP =
            randomXP();

        /*
         * =================================================
         * STREAK
         * =================================================
         */

        const streak =
            existingProfile
                ? calculateStreak(
                    existingProfile.streak,
                    existingProfile.lastXpAt,
                    now
                )
                : 1;

        /*
         * =================================================
         * PROFILE UPDATE
         * =================================================
         */

        let profile;

        try {
            profile =
                await database.db.userProfile.upsert({
                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId:
                                userId
                        }
                    },

                    create: {
                        guildId,

                        discordId:
                            userId,

                        xp:
                            gainedXP,

                        totalXp:
                            gainedXP,

                        level:
                            1,

                        streak,

                        lastXpAt:
                            now
                    },

                    update: {
                        xp: {
                            increment:
                                gainedXP
                        },

                        totalXp: {
                            increment:
                                gainedXP
                        },

                        streak,

                        lastXpAt:
                            now
                    }
                });
        } catch (error) {
            context.logger.error(
                `[Leveling] Failed to update XP for ${userId}:`,
                error
            );

            /*
             * Do not start the cooldown if XP was not
             * successfully saved.
             */
            return;
        }

        /*
         * XP was successfully saved.
         *
         * Start the cooldown only now.
         */
        cooldowns.set(
            cooldownKey,
            nowTimestamp
        );

        /*
         * =================================================
         * LEVEL-UP PROCESSING
         * =================================================
         */

        let currentProfile =
            profile;

        let levelsGained = 0;

        while (
            currentProfile.xp >=
                xpForLevel(
                    currentProfile.level
                ) &&
            levelsGained <
                MAX_LEVELS_PER_MESSAGE
        ) {
            const requiredXP =
                xpForLevel(
                    currentProfile.level
                );

            const newLevel =
                currentProfile.level +
                1;

            try {
                currentProfile =
                    await database.db.userProfile.update({
                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    userId
                            }
                        },

                        data: {
                            level:
                                newLevel,

                            xp: {
                                decrement:
                                    requiredXP
                            }
                        }
                    });
            } catch (error) {
                context.logger.error(
                    `[Leveling] Failed to process level-up for ${userId}:`,
                    error
                );

                return;
            }

            levelsGained++;

            /*
             * =================================================
             * LEVEL ROLE
             * =================================================
             *
             * Only the role configured for this exact level
             * is awarded.
             *
             * Existing roles are intentionally untouched.
             */

            try {
                const member =
                    await message.guild.members.fetch(
                        userId
                    );

                await LevelRoleHandler.handle(
                    member,
                    newLevel,
                    database
                );
            } catch (error) {
                /*
                 * Role failure should never prevent the user's
                 * level from being saved.
                 */
                context.logger.error(
                    `[Leveling] Failed to apply level role for ${userId} at level ${newLevel}:`,
                    error
                );
            }

            /*
             * =================================================
             * ANNOUNCEMENT SETTING
             * =================================================
             *
             * Plugin enabled ≠ announcements enabled.
             *
             * /leveling enable|disable controls the
             * GuildConfig.levelingEnabled setting.
             */

            let announcementsEnabled =
                true;

            let guildConfig:
                | {
                    levelingEnabled: boolean;
                    levelingMessage: string | null;
                    levelingTitle: string | null;
                    levelingImageUrl: string | null;
                    levelingColor: string | null;
                    levelingFooter: string | null;
                    levelingThumbnail: boolean;
                    levelingTimestamp: boolean;
                }
                | null =
                null;

            try {
                guildConfig =
                    await database.db.guildConfig.findUnique({
                        where: {
                            guildId
                        },

                        select: {
                            levelingEnabled:
                                true,

                            levelingMessage:
                                true,

                            levelingTitle:
                                true,

                            levelingImageUrl:
                                true,

                            levelingColor:
                                true,

                            levelingFooter:
                                true,

                            levelingThumbnail:
                                true,

                            levelingTimestamp:
                                true
                        }
                    });

                /*
                 * If a configuration exists, respect it.
                 *
                 * If no configuration exists yet, announcements
                 * remain enabled by default.
                 */
                announcementsEnabled =
                    guildConfig?.levelingEnabled ??
                    true;
            } catch (error) {
                /*
                 * A configuration lookup failure should not
                 * break leveling itself.
                 *
                 * Default to enabled so the user's level-up
                 * is still announced.
                 */
                context.logger.error(
                    `[Leveling] Failed to load announcement configuration for ${guildId}:`,
                    error
                );
            }

            /*
             * =================================================
             * LEVEL-UP ANNOUNCEMENT
             * =================================================
             */

            if (
                announcementsEnabled
            ) {
                try {
                    /*
                     * Load all configured announcement channels.
                     */
                    const configuredChannels =
                        await database.db.levelingChannel.findMany({
                            where: {
                                guildId
                            },

                            orderBy: {
                                createdAt:
                                    "asc"
                            }
                        });

                    /*
                     * Build the embed once.
                     *
                     * The same embed is sent to every configured
                     * channel.
                     */
                    const announcementConfig =
                        guildConfig ?? {
                            levelingEnabled:
                                true,

                            levelingMessage:
                                null,

                            levelingTitle:
                                null,

                            levelingImageUrl:
                                null,

                            levelingColor:
                                null,

                            levelingFooter:
                                null,

                            levelingThumbnail:
                                true,

                            levelingTimestamp:
                                false
                        };

                    const embed =
                        buildLevelingEmbed(
                            message,
                            newLevel,
                            announcementConfig
                        );

                    /*
                     * =================================================
                     * CONFIGURED CHANNELS
                     * =================================================
                     *
                     * If one or more channels are configured,
                     * announcements are sent to all of them.
                     */

                    if (
                        configuredChannels.length >
                        0
                    ) {
                        for (
                            const configuredChannel of
                                configuredChannels
                        ) {
                            try {
                                const channel =
                                    await message.guild.channels.fetch(
                                        configuredChannel.channelId
                                    );

                                /*
                                 * A deleted channel, inaccessible channel,
                                 * or channel without send permissions should
                                 * not break the leveling system.
                                 */
                                if (
                                    !channel ||
                                    !channel.isSendable()
                                ) {
                                    context.logger.warn(
                                        `[Leveling] Configured announcement channel ${configuredChannel.channelId} is unavailable in ${guildId}`
                                    );

                                    continue;
                                }

                                await channel.send({
                                    embeds: [
                                        embed
                                    ]
                                });
                            } catch (error) {
                                context.logger.error(
                                    `[Leveling] Failed to announce level ${newLevel} for ${userId} in configured channel ${configuredChannel.channelId}:`,
                                    error
                                );
                            }
                        }
                    } else if (
                        message.channel.isSendable()
                    ) {
                        /*
                         * =================================================
                         * DEFAULT FALLBACK
                         * =================================================
                         *
                         * No custom announcement channels have been
                         * configured, so preserve the original behavior
                         * and announce in the channel where the user
                         * leveled up.
                         */

                        await message.channel.send({
                            embeds: [
                                embed
                            ]
                        });
                    }
                } catch (error) {
                    /*
                     * Announcement failures must never roll back
                     * XP or levels.
                     */
                    context.logger.error(
                        `[Leveling] Failed to process announcement for level ${newLevel} for ${userId}:`,
                        error
                    );
                }
            }

            /*
             * =================================================
             * LOGGING
             * =================================================
             */

            context.logger.info(
                `[Leveling] ${message.author.tag} reached Level ${newLevel} in ${message.guild.name}`
            );
        }

        /*
         * =================================================
         * SAFETY LOG
         * =================================================
         *
         * This should never normally trigger.
         */

        if (
            levelsGained >=
                MAX_LEVELS_PER_MESSAGE &&
            currentProfile.xp >=
                xpForLevel(
                    currentProfile.level
                )
        ) {
            context.logger.warn(
                `[Leveling] Level-up safety limit reached for ${userId} in ${guildId}`
            );
        }
    }
}

END FILE: src/plugins/Leveling/index.ts
================================================================================

FILE: src/plugins/Leveling/LevelRoleHandler.ts
--------------------------------------------------------------------------------
Original size: 5583 bytes
Exported size: 5405 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { GuildMember } from "discord.js";

import { PrismaService } from "../../core/database/PrismaService.js";

export class LevelRoleHandler {
    /**
     * Assign the role configured for a specific level.
     *
     * This handler intentionally:
     * - Adds only the role configured for the reached level.
     * - Never removes existing roles.
     * - Never replaces previous level roles.
     * - Safely handles deleted, managed, or unassignable roles.
     */
    static async handle(
        member: GuildMember,
        level: number,
        database: PrismaService
    ): Promise<void> {
        if (!Number.isInteger(level) || level < 1) {
            return;
        }

        try {
            /*
             * ================================================
             * LOAD LEVEL ROLE CONFIGURATION
             * ================================================
             */

            const levelRole =
                await database.db.levelRole.findUnique({
                    where: {
                        guildId_level: {
                            guildId: member.guild.id,
                            level
                        }
                    }
                });

            /*
             * No reward is configured for this level.
             */

            if (!levelRole) {
                return;
            }

            /*
             * ================================================
             * RESOLVE DISCORD ROLE
             * ================================================
             */

            const role =
                member.guild.roles.cache.get(
                    levelRole.roleId
                );

            /*
             * The role may have been deleted manually
             * from Discord while remaining in the database.
             */

            if (!role) {
                console.warn(
                    `[LevelRole] Configured role ${levelRole.roleId} for Level ${level} no longer exists in ${member.guild.name}.`
                );

                return;
            }

            /*
             * ================================================
             * ROLE SAFETY CHECKS
             * ================================================
             *
             * @everyone and managed roles cannot be awarded
             * normally.
             */

            if (role.id === member.guild.id) {
                console.warn(
                    `[LevelRole] Cannot assign @everyone as a level reward in ${member.guild.name}.`
                );

                return;
            }

            if (role.managed) {
                console.warn(
                    `[LevelRole] Cannot assign managed role "${role.name}" in ${member.guild.name}.`
                );

                return;
            }

            /*
             * ================================================
             * BOT PERMISSION / HIERARCHY CHECK
             * ================================================
             */

            const botMember =
                member.guild.members.me ??
                await member.guild.members.fetchMe();

            if (!botMember) {
                console.warn(
                    `[LevelRole] Unable to resolve the bot member in ${member.guild.name}.`
                );

                return;
            }

            /*
             * The bot must have Manage Roles and the target
             * role must be strictly below the bot's highest role.
             */

            if (!botMember.permissions.has("ManageRoles")) {
                console.warn(
                    `[LevelRole] Bot is missing Manage Roles permission in ${member.guild.name}.`
                );

                return;
            }

            if (
                role.position >=
                botMember.roles.highest.position
            ) {
                console.warn(
                    `[LevelRole] Cannot assign "${role.name}" in ${member.guild.name}. The role is above or equal to the bot's highest role.`
                );

                return;
            }

            /*
             * ================================================
             * MEMBER SAFETY CHECK
             * ================================================
             *
             * Don't attempt to modify the member if they
             * already have the configured role.
             */

            if (member.roles.cache.has(role.id)) {
                return;
            }

            /*
             * ================================================
             * ASSIGN ROLE
             * ================================================
             */

            await member.roles.add(
                role,
                `Quill & Ink • Reached Level ${level}`
            );

            console.log(
                `[LevelRole] ${member.user.tag} received "${role.name}" for reaching Level ${level} in ${member.guild.name}.`
            );
        } catch (error) {
            /*
             * Leveling should never fail completely just because
             * a role assignment failed.
             */

            console.error(
                `[LevelRole] Failed to assign the Level ${level} role to ${member.user.tag} in ${member.guild.name}:`,
                error
            );
        }
    }
}

END FILE: src/plugins/Leveling/LevelRoleHandler.ts
================================================================================

FILE: src/plugins/Leveling/plugin.json
--------------------------------------------------------------------------------
Original size: 130 bytes
Exported size: 125 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
  "id": "leveling",
  "name": "Leveling",
  "version": "1.0.0",
  "description": "XP and leveling system for Quill & Ink"
}

END FILE: src/plugins/Leveling/plugin.json
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
