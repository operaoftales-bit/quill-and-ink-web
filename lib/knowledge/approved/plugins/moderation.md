QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:27:44.710Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/moderation
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
- This export is scoped to: src/plugins/moderation

EXPORT SUMMARY
================================================================================
Files exported: 18
Files excluded or skipped: 0
Original bytes in exported files: 165751
Bytes after redaction: 160263
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/moderation/commands/AutoRoleCommand.ts
00002. src/plugins/moderation/commands/BanCommand.ts
00003. src/plugins/moderation/commands/CaseCommand.ts
00004. src/plugins/moderation/commands/ClearWarnCommand.ts
00005. src/plugins/moderation/commands/ClearWarningsCommand.ts
00006. src/plugins/moderation/commands/KickCommand.ts
00007. src/plugins/moderation/commands/LockCommand.ts
00008. src/plugins/moderation/commands/PurgeCommand.ts
00009. src/plugins/moderation/commands/SetModLogCommand.ts
00010. src/plugins/moderation/commands/SlowmodeCommand.ts
00011. src/plugins/moderation/commands/TimeoutCommand.ts
00012. src/plugins/moderation/commands/UnbanCommand.ts
00013. src/plugins/moderation/commands/UnlockCommand.ts
00014. src/plugins/moderation/commands/UntimeoutCommand.ts
00015. src/plugins/moderation/commands/WarnCommand.ts
00016. src/plugins/moderation/commands/WarningsCommand.ts
00017. src/plugins/moderation/ModerationPlugin.ts
00018. src/plugins/moderation/plugin.json

SOURCE FILES
================================================================================

FILE: src/plugins/moderation/commands/AutoRoleCommand.ts
--------------------------------------------------------------------------------
Original size: 21893 bytes
Exported size: 21255 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    Role,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const BRAND_COLOR = 0xD4AF37;
const SUCCESS_COLOR = 0x57F287;
const ERROR_COLOR = 0xED4245;
const WARNING_COLOR = 0xFEE75C;
const DISABLED_COLOR = 0x747F8D;

export const AutoRoleCommand = {

    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDescription(
            "Configure the automatic role system."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )

        /*
         * =========================
         * SET
         * =========================
         */

        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription(
                    "Set the role given to new members."
                )
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription(
                            "The role to give new members."
                        )
                        .setRequired(true)
                )
        )

        /*
         * =========================
         * DISABLE
         * =========================
         */

        .addSubcommand(subcommand =>
            subcommand
                .setName("disable")
                .setDescription(
                    "Disable automatic roles."
                )
        )

        /*
         * =========================
         * VIEW
         * =========================
         */

        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription(
                    "View the current automatic role."
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
                embeds: [
                    new EmbedBuilder()
                        .setColor(ERROR_COLOR)
                        .setTitle(
                            "✦ Server Only"
                        )
                        .setDescription(
                            "The Auto Role system can only be configured inside a server."
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Server Management"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(ERROR_COLOR)
                        .setTitle(
                            "✦ Database Unavailable"
                        )
                        .setDescription(
                            "The Auto Role configuration could not be accessed because the database service is currently unavailable."
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • System Status"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });

            return;
        }

        const subcommand =
            interaction.options.getSubcommand();

        /*
         * =========================
         * SET AUTO ROLE
         * =========================
         */

        if (subcommand === "set") {

            try {

                const role =
                    interaction.options.getRole(
                        "role",
                        true
                    ) as Role;

                /*
                 * @everyone
                 */

                if (
                    role.id ===
                    interaction.guild.id
                ) {

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(ERROR_COLOR)
                                .setTitle(
                                    "✦ Invalid Role"
                                )
                                .setDescription(
                                    "The `@everyone` role cannot be used as an Auto Role."
                                )
                                .setFooter({
                                    text:
                                        "Choose a normal server role."
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });

                    return;
                }

                /*
                 * Managed / integration role
                 */

                if (
                    role.managed
                ) {

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(ERROR_COLOR)
                                .setTitle(
                                    "✦ Managed Role"
                                )
                                .setDescription(
                                    "I can't assign a managed or integration role to new members."
                                )
                                .addFields({
                                    name:
                                        "Selected Role",
                                    value:
                                        `${role}`,
                                    inline: true
                                })
                                .setFooter({
                                    text:
                                        "Choose a role managed directly by this server."
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });

                    return;
                }

                /*
                 * Bot role hierarchy
                 */

                const botMember =
                    await interaction.guild.members
                        .fetchMe();

                if (
                    role.position >=
                    botMember.roles.highest.position
                ) {

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(ERROR_COLOR)
                                .setTitle(
                                    "✦ Role Hierarchy Error"
                                )
                                .setDescription(
                                    [
                                        `I can't assign ${role} because it is higher than or equal to my highest role.`,
                                        "",
                                        "Move the role below my highest role and try again."
                                    ].join("\n")
                                )
                                .addFields({
                                    name:
                                        "Selected Role",
                                    value:
                                        `${role}`,
                                    inline: true
                                })
                                .setFooter({
                                    text:
                                        "Quill & Ink • Auto Role"
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });

                    return;
                }

                /*
                 * Save configuration
                 */

                await database.db.guildConfig.upsert({
                    where: {
                        guildId:
                            interaction.guild.id
                    },
                    create: {
                        guildId:
                            interaction.guild.id,
                        autoRoleId:
                            role.id
                    },
                    update: {
                        autoRoleId:
                            role.id
                    }
                });

                const embed =
                    new EmbedBuilder()
                        .setColor(SUCCESS_COLOR)
                        .setTitle(
                            "✦ Auto Role Configured"
                        )
                        .setDescription(
                            [
                                `New members will now automatically receive ${role}.`,
                                "",
                                "The configuration has been saved successfully."
                            ].join("\n")
                        )
                        .addFields(
                            {
                                name:
                                    "Auto Role",
                                value:
                                    `${role}`,
                                inline: true
                            },
                            {
                                name:
                                    "Status",
                                value:
                                    "🟢 Enabled",
                                inline: true
                            }
                        )
                        .setFooter({
                            text:
                                `Configured by ${interaction.user.tag}`
                        })
                        .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            } catch (error) {

                console.error(
                    "[AutoRoleCommand] Failed to set Auto Role:",
                    error
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(ERROR_COLOR)
                            .setTitle(
                                "✦ Auto Role Setup Failed"
                            )
                            .setDescription(
                                "I couldn't save the Auto Role configuration."
                            )
                            .setFooter({
                                text:
                                    "Check the bot logs for more information."
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            return;
        }

        /*
         * =========================
         * DISABLE AUTO ROLE
         * =========================
         */

        if (subcommand === "disable") {

            try {

                await database.db.guildConfig.upsert({
                    where: {
                        guildId:
                            interaction.guild.id
                    },
                    create: {
                        guildId:
                            interaction.guild.id,
                        autoRoleId:
                            null
                    },
                    update: {
                        autoRoleId:
                            null
                    }
                });

                const embed =
                    new EmbedBuilder()
                        .setColor(DISABLED_COLOR)
                        .setTitle(
                            "✦ Auto Role Disabled"
                        )
                        .setDescription(
                            [
                                "New members will no longer receive an automatic role.",
                                "",
                                "The existing server role configuration has been cleared."
                            ].join("\n")
                        )
                        .addFields({
                            name:
                                "Status",
                            value:
                                "⚫ Disabled",
                            inline: true
                        })
                        .setFooter({
                            text:
                                `Changed by ${interaction.user.tag}`
                        })
                        .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            } catch (error) {

                console.error(
                    "[AutoRoleCommand] Failed to disable Auto Role:",
                    error
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(ERROR_COLOR)
                            .setTitle(
                                "✦ Auto Role Disable Failed"
                            )
                            .setDescription(
                                "I couldn't disable the Auto Role system."
                            )
                            .setFooter({
                                text:
                                    "Check the bot logs for more information."
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            return;
        }

        /*
         * =========================
         * VIEW AUTO ROLE
         * =========================
         */

        if (subcommand === "view") {

            try {

                const config =
                    await database.db.guildConfig.findUnique({
                        where: {
                            guildId:
                                interaction.guild.id
                        }
                    });

                if (!config?.autoRoleId) {

                    const embed =
                        new EmbedBuilder()
                            .setColor(DISABLED_COLOR)
                            .setTitle(
                                "✦ Auto Role Settings"
                            )
                            .setDescription(
                                [
                                    "Automatic roles are currently disabled.",
                                    "",
                                    "Use `/autorole set` to choose a role for new members."
                                ].join("\n")
                            )
                            .addFields({
                                name:
                                    "Status",
                                value:
                                    "⚫ Disabled",
                                inline: true
                            })
                            .setFooter({
                                text:
                                    "Quill & Ink • Server Management"
                            })
                            .setTimestamp();

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                    return;
                }

                const role =
                    interaction.guild.roles.cache.get(
                        config.autoRoleId
                    );

                if (!role) {

                    const embed =
                        new EmbedBuilder()
                            .setColor(WARNING_COLOR)
                            .setTitle(
                                "✦ Auto Role Needs Attention"
                            )
                            .setDescription(
                                [
                                    "An Auto Role is configured, but that role no longer exists in this server.",
                                    "",
                                    "Use `/autorole set` to select a new role or `/autorole disable` to clear the configuration."
                                ].join("\n")
                            )
                            .addFields({
                                name:
                                    "Configured Role ID",
                                value:
                                    `\`${config.autoRoleId}\``,
                                inline: true
                            })
                            .setFooter({
                                text:
                                    "Quill & Ink • Server Management"
                            })
                            .setTimestamp();

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                    return;
                }

                const botMember =
                    await interaction.guild.members
                        .fetchMe();

                const canAssign =
                    !role.managed &&
                    role.id !== interaction.guild.id &&
                    role.position <
                        botMember.roles.highest.position;

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            canAssign
                                ? SUCCESS_COLOR
                                : WARNING_COLOR
                        )
                        .setTitle(
                            "✦ Auto Role Settings"
                        )
                        .setDescription(
                            canAssign
                                ? `New members will automatically receive ${role}.`
                                : `The configured role is ${role}, but I can no longer assign it.`
                        )
                        .addFields(
                            {
                                name:
                                    "Auto Role",
                                value:
                                    `${role}`,
                                inline: true
                            },
                            {
                                name:
                                    "Status",
                                value:
                                    canAssign
                                        ? "🟢 Enabled"
                                        : "⚠️ Needs Attention",
                                inline: true
                            }
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Server Management"
                        })
                        .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            } catch (error) {

                console.error(
                    "[AutoRoleCommand] Failed to view Auto Role:",
                    error
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(ERROR_COLOR)
                            .setTitle(
                                "✦ Auto Role Lookup Failed"
                            )
                            .setDescription(
                                "I couldn't retrieve the current Auto Role configuration."
                            )
                            .setFooter({
                                text:
                                    "Check the bot logs for more information."
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            return;
        }
    }
};

END FILE: src/plugins/moderation/commands/AutoRoleCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/BanCommand.ts
--------------------------------------------------------------------------------
Original size: 9380 bytes
Exported size: 9073 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    primary: 0x5865F2,
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

const DEFAULT_REASON = "No reason provided";

export const BanCommand = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * TARGET
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        const reason =
            interaction.options.getString("reason")?.trim() ||
            DEFAULT_REASON;

        if (user.id === interaction.user.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "You cannot ban yourself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        const member =
            await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Member Not Found")
                        .setDescription(
                            `${user} is not currently a member of this server.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * BOT HIERARCHY
         * =========================
         */

        if (!member.bannable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Cannot Ban Member")
                        .setDescription(
                            `I can't ban ${user}.\n\n` +
                            "They may have a role that is higher than or equal to my highest role, " +
                            "or Discord may be preventing the action."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * BAN
         * =========================
         */

        try {
            await member.ban({
                reason
            });
        } catch (error) {
            console.error(
                `[BanCommand] Failed to ban ${user.tag}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Ban Failed")
                        .setDescription(
                            `I couldn't ban ${user}. Discord rejected the moderation action.`
                        )
                        .addFields({
                            name: "Reason",
                            value: reason
                        })
                        .setFooter({
                            text: "No moderation case was created because the ban did not succeed."
                        })
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "BAN",

                    reason
                });

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🔨 Member Banned")
                    .setDescription(
                        `${user} has been banned from the server.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value: `${user.tag} (\`${user.id}\`)`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value: `${interaction.user.tag}`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value: `\`B-${moderationCase.caseNumber}\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: reason
                        }
                    )
                    .setFooter({
                        text: "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            console.error(
                `[BanCommand] Failed to create moderation case for ${user.tag}:`,
                error
            );

            /*
             * The ban already succeeded.
             * Do not report the moderation action
             * itself as failed.
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.warning)
                    .setTitle("🔨 Member Banned")
                    .setDescription(
                        `${user} has been banned successfully, but the moderation case could not be created.`
                    )
                    .addFields({
                        name: "Reason",
                        value: reason
                    })
                    .setFooter({
                        text: "Please check the database and moderation logs."
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/BanCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/CaseCommand.ts
--------------------------------------------------------------------------------
Original size: 5496 bytes
Exported size: 5284 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
ChatInputCommandInteraction,
EmbedBuilder,
PermissionFlagsBits,
SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const COLORS = {
primary: 0x5865F2,
danger: 0xED4245
} as const;

export const CaseCommand = {
data: new SlashCommandBuilder()
.setName("case")
.setDescription("View a moderation case.")
.addIntegerOption(option =>
option
.setName("number")
.setDescription("The moderation case number.")
.setMinValue(1)
.setRequired(true)
)
.setDefaultMemberPermissions(
PermissionFlagsBits.ModerateMembers
),

async execute(
    interaction: ChatInputCommandInteraction
) {
    /*
     * =========================
     * GUILD CHECK
     * =========================
     */

    if (!interaction.guild) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLORS.danger)
                    .setTitle("❌ Server Only")
                    .setDescription(
                        "This command can only be used in a server."
                    )
            ],
            ephemeral: true
        });

        return;
    }

    /*
     * =========================
     * CASE NUMBER
     * =========================
     */

    const caseNumber =
        interaction.options.getInteger(
            "number",
            true
        );

    /*
     * =========================
     * DATABASE
     * =========================
     */

    const database =
        (interaction.client as BotClient)
            .services
            .get<PrismaService>("database");

    if (!database) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLORS.danger)
                    .setTitle("❌ Database Unavailable")
                    .setDescription(
                        "The database service is currently unavailable. Please try again later."
                    )
            ],
            ephemeral: true
        });

        return;
    }

    /*
     * =========================
     * CASE LOOKUP
     * =========================
     */

    let moderationCase;

    try {
        moderationCase =
            await database.db.moderationCase.findUnique({
                where: {
                    guildId_caseNumber: {
                        guildId: interaction.guild.id,
                        caseNumber
                    }
                }
            });
    } catch (error) {
        console.error(
            `[CaseCommand] Failed to load case #${caseNumber}:`,
            error
        );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLORS.danger)
                    .setTitle("❌ Case Lookup Failed")
                    .setDescription(
                        "I couldn't retrieve that moderation case. Please try again later."
                    )
            ],
            ephemeral: true
        });

        return;
    }

    /*
     * =========================
     * CASE NOT FOUND
     * =========================
     */

    if (!moderationCase) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLORS.danger)
                    .setTitle("❌ Case Not Found")
                    .setDescription(
                        `No moderation case **#${caseNumber}** exists in this server.`
                    )
                    .setFooter({
                        text: interaction.guild.name
                    })
            ],
            ephemeral: true
        });

        return;
    }

    /*
     * =========================
     * CASE DISPLAY
     * =========================
     */

    const createdTimestamp =
        Math.floor(
            moderationCase.createdAt.getTime() / 1000
        );

    const embed =
        new EmbedBuilder()
            .setColor(COLORS.primary)
            .setTitle("📋 Moderation Case")
            .setDescription(
                `**Case #${moderationCase.caseNumber}**`
            )
            .addFields(
                {
                    name: "Action",
                    value: `\`${moderationCase.action}\``,
                    inline: true
                },
                {
                    name: "User",
                    value: `<@${moderationCase.userId}>`,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: `<@${moderationCase.moderatorId}>`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: moderationCase.reason
                },
                {
                    name: "Date",
                    value: `<t:${createdTimestamp}:F>\n<t:${createdTimestamp}:R>`
                }
            )
            .setFooter({
                text: `Quill & Ink • ${interaction.guild.name}`
            })
            .setTimestamp(moderationCase.createdAt);

    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}

};

END FILE: src/plugins/moderation/commands/CaseCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/ClearWarnCommand.ts
--------------------------------------------------------------------------------
Original size: 6483 bytes
Exported size: 6259 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const ClearWarnCommand = {
    data: new SlashCommandBuilder()
        .setName("clearwarn")
        .setDescription("Remove a warning from a member.")
        .addStringOption(option =>
            option
                .setName("warning")
                .setDescription("The warning ID to remove.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * WARNING ID
         * =========================
         */

        const warningId =
            interaction.options.getString(
                "warning",
                true
            ).trim();

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * WARNING LOOKUP
         * =========================
         */

        let warning;

        try {
            warning =
                await database.db.warning.findFirst({
                    where: {
                        id: warningId,
                        guildId: interaction.guild.id
                    }
                });
        } catch (error) {
            console.error(
                `[ClearWarnCommand] Failed to find warning ${warningId}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Warning Lookup Failed")
                        .setDescription(
                            "I couldn't retrieve that warning. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * WARNING NOT FOUND
         * =========================
         */

        if (!warning) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Warning Not Found")
                        .setDescription(
                            `No warning with ID \`${warningId}\` exists in this server.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * REMOVE WARNING
         * =========================
         */

        try {
            await database.db.warning.delete({
                where: {
                    id: warning.id
                }
            });
        } catch (error) {
            console.error(
                `[ClearWarnCommand] Failed to remove warning ${warning.id}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Removal Failed")
                        .setDescription(
                            `I couldn't remove warning \`${warning.id}\`. Please try again later.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SUCCESS
         * =========================
         */

        const embed =
            new EmbedBuilder()
                .setColor(COLORS.success)
                .setTitle("✅ Warning Removed")
                .setDescription(
                    `Warning \`${warning.id}\` has been removed successfully.`
                )
                .addFields(
                    {
                        name: "Member",
                        value: `<@${warning.userId}>`,
                        inline: true
                    },
                    {
                        name: "Warning ID",
                        value: `\`${warning.id}\``,
                        inline: true
                    },
                    {
                        name: "Original Reason",
                        value: warning.reason
                    }
                )
                .setFooter({
                    text: `Removed by ${interaction.user.tag}`
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};

END FILE: src/plugins/moderation/commands/ClearWarnCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/ClearWarningsCommand.ts
--------------------------------------------------------------------------------
Original size: 8022 bytes
Exported size: 7758 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const ClearWarningsCommand = {
    data: new SlashCommandBuilder()
        .setName("clearwarnings")
        .setDescription("Clear all warnings for a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "The member whose warnings will be cleared."
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * TARGET
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * CLEAR WARNINGS
         * =========================
         */

        let result;

        try {
            result =
                await database.db.warning.deleteMany({
                    where: {
                        guildId:
                            interaction.guild.id,

                        userId:
                            user.id
                    }
                });
        } catch (error) {
            console.error(
                `[ClearWarningsCommand] Failed to clear warnings for ${user.tag}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Clear Warnings Failed")
                        .setDescription(
                            `I couldn't clear the warnings for ${user}. Please try again later.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * NOTHING TO CLEAR
         * =========================
         */

        if (result.count === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("ℹ️ No Warnings Found")
                        .setDescription(
                            `${user} has no warnings to clear.`
                        )
                        .setFooter({
                            text: interaction.guild.name
                        })
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "CLEAR_WARNINGS",

                    reason:
                        `Cleared ${result.count} warning(s).`
                });

            /*
             * =========================
             * SUCCESS
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🗑️ Warnings Cleared")
                    .setDescription(
                        `All warnings for ${user} have been cleared.`
                    )
                    .addFields(
                        {
                            name: "Member",
                            value: `${user.tag}`,
                            inline: true
                        },
                        {
                            name: "Warnings Removed",
                            value: `${result.count}`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value: `\`CW-${moderationCase.caseNumber}\``,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag
                        }
                    )
                    .setFooter({
                        text: "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            console.error(
                `[ClearWarningsCommand] Failed to create moderation case for ${user.tag}:`,
                error
            );

            /*
             * The warnings were already deleted.
             * Do not report the clearing action as failed.
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.warning)
                    .setTitle("🗑️ Warnings Cleared")
                    .setDescription(
                        `All **${result.count}** warning(s) for ${user} were cleared successfully, but the moderation case could not be created.`
                    )
                    .setFooter({
                        text: "Please check the database and moderation logs."
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/ClearWarningsCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/KickCommand.ts
--------------------------------------------------------------------------------
Original size: 9857 bytes
Exported size: 9537 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

const DEFAULT_REASON = "No reason provided";

export const KickCommand = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to kick.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the kick.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.KickMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * TARGET
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        const reason =
            interaction.options.getString("reason")?.trim() ||
            DEFAULT_REASON;

        if (user.id === interaction.user.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "You cannot kick yourself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (user.id === interaction.client.user?.id) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "I can't kick myself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        const member =
            await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Member Not Found")
                        .setDescription(
                            `${user} is not currently a member of this server.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * BOT HIERARCHY
         * =========================
         */

        if (!member.kickable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Cannot Kick Member")
                        .setDescription(
                            `I can't kick ${user}.\n\n` +
                            "They may have a role that is higher than or equal to my highest role, " +
                            "or Discord may be preventing the action."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * KICK
         * =========================
         */

        try {
            await member.kick(reason);
        } catch (error) {
            console.error(
                `[KickCommand] Failed to kick ${user.tag}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Kick Failed")
                        .setDescription(
                            `I couldn't kick ${user}. Discord rejected the moderation action.`
                        )
                        .addFields({
                            name: "Reason",
                            value: reason
                        })
                        .setFooter({
                            text: "No moderation case was created because the kick did not succeed."
                        })
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "KICK",

                    reason
                });

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("👢 Member Kicked")
                    .setDescription(
                        `${user} has been kicked from the server.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value: `${user.tag} (\`${user.id}\`)`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag,
                            inline: true
                        },
                        {
                            name: "Case",
                            value: `\`K-${moderationCase.caseNumber}\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: reason
                        }
                    )
                    .setFooter({
                        text: "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The kick already succeeded.
             * Do not report the moderation action
             * itself as failed.
             */

            console.error(
                `[KickCommand] Member ${user.id} was kicked, but the moderation case could not be created:`,
                error
            );

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.warning)
                    .setTitle("👢 Member Kicked")
                    .setDescription(
                        `${user} was kicked successfully, but the moderation case could not be created.`
                    )
                    .addFields({
                        name: "Reason",
                        value: reason
                    })
                    .setFooter({
                        text: "Please check the database and moderation logs."
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/KickCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/LockCommand.ts
--------------------------------------------------------------------------------
Original size: 7832 bytes
Exported size: 7576 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

const DEFAULT_REASON = "Channel locked by moderator.";

export const LockCommand = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock the current channel.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for locking the channel.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageChannels
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * CHANNEL
         * =========================
         */

        const channel =
            interaction.channel;

        if (!(channel instanceof TextChannel)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Unsupported Channel")
                        .setDescription(
                            "This channel cannot be locked."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        const reason =
            interaction.options.getString("reason")?.trim() ||
            DEFAULT_REASON;

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * LOCK CHANNEL
         * =========================
         */

        try {
            await channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: false
                },
                {
                    reason
                }
            );
        } catch (error) {
            console.error(
                `[LockCommand] Failed to lock channel ${channel.id}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Channel Lock Failed")
                        .setDescription(
                            "I couldn't lock this channel. Please check my channel permissions."
                        )
                        .addFields({
                            name: "Reason",
                            value: reason
                        })
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        interaction.user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "LOCK",

                    reason:
                        `Channel: ${channel.id} | ${reason}`
                });

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🔒 Channel Locked")
                    .setDescription(
                        `${channel} has been locked.`
                    )
                    .addFields(
                        {
                            name: "Channel",
                            value: `${channel}`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag,
                            inline: true
                        },
                        {
                            name: "Case",
                            value: `\`L-${moderationCase.caseNumber}\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: reason
                        }
                    )
                    .setFooter({
                        text: "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The channel was already locked.
             * Do not report the lock itself as failed.
             */

            console.error(
                `[LockCommand] Channel ${channel.id} was locked, but the moderation case could not be created:`,
                error
            );

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.warning)
                    .setTitle("🔒 Channel Locked")
                    .setDescription(
                        `${channel} was locked successfully, but the moderation case could not be created.`
                    )
                    .addFields({
                        name: "Reason",
                        value: reason
                    })
                    .setFooter({
                        text: "Please check the database and moderation logs."
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/LockCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/PurgeCommand.ts
--------------------------------------------------------------------------------
Original size: 8614 bytes
Exported size: 8335 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const PurgeCommand = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription(
            "Delete multiple messages from this channel."
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription(
                    "Number of messages to delete (1-100)."
                )
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * CHANNEL CHECK
         * =========================
         */

        if (!interaction.channel?.isTextBased()) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Unsupported Channel")
                        .setDescription(
                            "This command can only be used in a text-based channel."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        const channel =
            interaction.channel;

        const amount =
            interaction.options.getInteger(
                "amount",
                true
            );

        if (!("bulkDelete" in channel)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Cannot Delete Messages")
                        .setDescription(
                            "I can't bulk delete messages in this channel."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. The purge was not performed."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * PURGE
         * =========================
         */

        let deleted;

        try {
            deleted =
                await channel.bulkDelete(
                    amount,
                    true
                );
        } catch (error) {
            console.error(
                `[PurgeCommand] Failed to delete messages in ${channel.id}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Purge Failed")
                        .setDescription(
                            "I couldn't delete the messages. Please check my permissions and try again."
                        )
                        .addFields({
                            name: "Requested",
                            value: `${amount} message(s)`,
                            inline: true
                        })
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        interaction.user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "PURGE",

                    reason:
                        `Deleted ${deleted.size} message(s) in #${channel.name}.`
                });

            /*
             * =========================
             * SUCCESS
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🧹 Messages Purged")
                    .setDescription(
                        `Successfully deleted **${deleted.size}** message(s) from ${channel}.`
                    )
                    .addFields(
                        {
                            name: "Channel",
                            value: `${channel}`,
                            inline: true
                        },
                        {
                            name: "Deleted",
                            value: `${deleted.size}`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value: `\`P-${moderationCase.caseNumber}\``,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag
                        }
                    )
                    .setFooter({
                        text: "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } catch (error) {
            /*
             * The messages were already deleted.
             * Do not report the purge itself as failed.
             */

            console.error(
                `[PurgeCommand] Messages were purged from ${channel.id}, but the moderation case could not be created:`,
                error
            );

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.warning)
                    .setTitle("🧹 Messages Purged")
                    .setDescription(
                        `Successfully deleted **${deleted.size}** message(s) from ${channel}.`
                    )
                    .setFooter({
                        text: "⚠️ The moderation case could not be recorded. Please check the database and moderation logs."
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/PurgeCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/SetModLogCommand.ts
--------------------------------------------------------------------------------
Original size: 5641 bytes
Exported size: 5446 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const SetModLogCommand = {
    data: new SlashCommandBuilder()
        .setName("setmodlog")
        .setDescription(
            "Set the channel where moderation logs are sent."
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription(
                    "The channel for moderation logs."
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
    ) {
        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * CHANNEL
         * =========================
         */

        const channel =
            interaction.options.getChannel(
                "channel",
                true
            );

        if (
            channel.type !== ChannelType.GuildText ||
            !(channel instanceof TextChannel)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Channel")
                        .setDescription(
                            "Please select a normal text channel for moderation logs."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SAVE CONFIGURATION
         * =========================
         */

        try {
            await database.db.guildConfig.upsert({
                where: {
                    guildId:
                        interaction.guild.id
                },
                update: {
                    moderationLogId:
                        channel.id
                },
                create: {
                    guildId:
                        interaction.guild.id,

                    moderationLogId:
                        channel.id
                }
            });
        } catch (error) {
            console.error(
                `[SetModLogCommand] Failed to set moderation log channel for ${interaction.guild.id}:`,
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Configuration Failed")
                        .setDescription(
                            "I couldn't save the moderation log configuration. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SUCCESS
         * =========================
         */

        const embed =
            new EmbedBuilder()
                .setColor(COLORS.success)
                .setTitle("📋 Moderation Logs Configured")
                .setDescription(
                    `Moderation cases will now be logged in ${channel}.`
                )
                .addFields({
                    name: "Log Channel",
                    value: `${channel}`,
                    inline: true
                })
                .setFooter({
                    text: `Configured by ${interaction.user.tag}`
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

END FILE: src/plugins/moderation/commands/SetModLogCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/SlowmodeCommand.ts
--------------------------------------------------------------------------------
Original size: 11388 bytes
Exported size: 10996 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { GuildPluginManager } from "../../../core/managers/GuildPluginManager.js";

const COLORS = {
    success: 0x57F287,
    primary: 0x5865F2,
    danger: 0xED4245,
    warning: 0xFEE75C,
    neutral: 0x2ECC71
} as const;

export const SlowmodeCommand = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription(
            "Set the slowmode delay for this channel."
        )
        .addIntegerOption(option =>
            option
                .setName("seconds")
                .setDescription(
                    "Slowmode delay in seconds (0-21600)."
                )
                .setMinValue(0)
                .setMaxValue(21600)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageChannels
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
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
            !(channel instanceof TextChannel)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Channel")
                        .setDescription(
                            "This command can only be used in a standard text channel."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const seconds =
            interaction.options.getInteger(
                "seconds",
                true
            );

        /*
         * =========================
         * CURRENT VALUE
         * =========================
         */

        const oldSeconds =
            channel.rateLimitPerUser;

        /*
         * =========================
         * NO-OP CHECK
         * =========================
         */

        if (oldSeconds === seconds) {
            const currentValue =
                seconds === 0
                    ? "disabled"
                    : `set to **${seconds} second(s)**`;

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.primary)
                        .setTitle("ℹ️ Slowmode Unchanged")
                        .setDescription(
                            `Slowmode is already ${currentValue}.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * UPDATE SLOWMODE
         * =========================
         */

        try {
            await channel.setRateLimitPerUser(
                seconds,
                `Slowmode changed by ${interaction.user.tag}`
            );
        } catch (error) {
            console.error(
                "[SlowmodeCommand] Failed to update slowmode:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Slowmode Update Failed")
                        .setDescription(
                            "I couldn't change slowmode. Please check my permissions and try again."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * COMMAND RESPONSE
         * =========================
         */

        try {
            const embed =
                new EmbedBuilder()
                    .setColor(
                        seconds === 0
                            ? COLORS.neutral
                            : COLORS.primary
                    )
                    .setTitle(
                        seconds === 0
                            ? "🔓 Slowmode Disabled"
                            : "🐌 Slowmode Updated"
                    )
                    .setDescription(
                        seconds === 0
                            ? `Slowmode has been disabled in ${channel}.`
                            : `Slowmode is now **${seconds} second(s)** in ${channel}.`
                    )
                    .setFooter({
                        text:
                            `Changed by ${interaction.user.tag}`
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The Discord change already succeeded.
             * A failed response must not be treated
             * as a failed slowmode operation.
             */

            console.error(
                "[SlowmodeCommand] Failed to send response:",
                error
            );
        }

        /*
         * =========================
         * GENERAL LOGGING
         * =========================
         *
         * Slowmode changes use the general
         * logging channel, not moderationLogId.
         *
         * Logging failure must never make a
         * successful slowmode change appear failed.
         */

        try {
            const client =
                interaction.client as BotClient;

            const plugins =
                client.services.get<GuildPluginManager>(
                    "guildPlugins"
                );

            const database =
                client.services.get<PrismaService>(
                    "database"
                );

            if (!plugins || !database) {
                console.warn(
                    "[SlowmodeCommand] Logging services are unavailable."
                );

                return;
            }

            /*
             * =========================
             * LOGGING PLUGIN
             * =========================
             */

            if (
                !plugins.isEnabled(
                    interaction.guild.id,
                    "logging"
                )
            ) {
                return;
            }

            /*
             * =========================
             * GUILD CONFIG
             * =========================
             */

            const config =
                await database.db.guildConfig.findUnique({
                    where: {
                        guildId:
                            interaction.guild.id
                    }
                });

            if (
                !config ||
                !config.loggingChannelId
            ) {
                return;
            }

            /*
             * =========================
             * LOG CHANNEL
             * =========================
             */

            const logChannel =
                interaction.guild.channels.cache.get(
                    config.loggingChannelId
                );

            if (
                !logChannel ||
                !logChannel.isTextBased() ||
                !("send" in logChannel)
            ) {
                console.warn(
                    "[SlowmodeCommand] Configured logging channel is unavailable."
                );

                return;
            }

            /*
             * =========================
             * DISPLAY VALUES
             * =========================
             */

            const oldValue =
                oldSeconds === 0
                    ? "Disabled"
                    : `${oldSeconds} second(s)`;

            const newValue =
                seconds === 0
                    ? "Disabled"
                    : `${seconds} second(s)`;

            /*
             * =========================
             * LOG EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setTitle("🐌 Slowmode Updated")
                    .setColor(
                        seconds === 0
                            ? COLORS.neutral
                            : COLORS.primary
                    )
                    .setDescription(
                        `Slowmode was changed in ${channel}.`
                    )
                    .addFields(
                        {
                            name: "Previous",
                            value: oldValue,
                            inline: true
                        },
                        {
                            name: "New",
                            value: newValue,
                            inline: true
                        },
                        {
                            name: "Changed By",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation",
                        ...(client.user
                            ? {
                                iconURL:
                                    client.user.displayAvatarURL()
                            }
                            : {})
                    })
                    .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * Logging failure must never make
             * a successful slowmode change
             * appear unsuccessful.
             */

            console.error(
                "[SlowmodeCommand] Failed to send slowmode log:",
                error
            );
        }
    }
};

END FILE: src/plugins/moderation/commands/SlowmodeCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/TimeoutCommand.ts
--------------------------------------------------------------------------------
Original size: 13271 bytes
Exported size: 12833 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C,
    primary: 0x5865F2
} as const;

export const TimeoutCommand = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeouts a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to timeout.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("duration")
                .setDescription("Duration in minutes.")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(40320)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the timeout.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        const duration =
            interaction.options.getInteger(
                "duration",
                true
            );

        const reason =
            (
                interaction.options.getString(
                    "reason"
                ) ?? "No reason provided"
            ).trim();

        /*
         * Discord audit-log reasons have a
         * maximum length of 512 characters.
         */

        const moderationReason =
            reason.length > 512
                ? `${reason.slice(0, 509)}...`
                : reason;

        /*
         * =========================
         * MEMBER
         * =========================
         */

        const member =
            await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Member Not Found")
                        .setDescription(
                            "That user is not in this server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SELF / BOT PROTECTION
         * =========================
         */

        if (
            member.id === interaction.user.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "You can't timeout yourself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (
            member.id === interaction.client.user?.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "I can't timeout myself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATOR HIERARCHY
         * =========================
         */

        const moderator =
            await interaction.guild.members
                .fetch(interaction.user.id)
                .catch(() => null);

        if (!moderator) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Permission Check Failed")
                        .setDescription(
                            "I couldn't verify your server permissions."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * A moderator cannot timeout a member
         * whose highest role is equal to or above
         * the moderator's highest role.
         *
         * Server owners are exempt because Discord
         * gives them authority above the hierarchy.
         */

        if (
            interaction.guild.ownerId !==
                interaction.user.id &&
            member.roles.highest.position >=
                moderator.roles.highest.position
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Role Hierarchy")
                        .setDescription(
                            "You can't timeout that member because their highest role is equal to or higher than yours."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * BOT HIERARCHY
         * =========================
         */

        if (!member.moderatable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Cannot Timeout Member")
                        .setDescription(
                            "I can't timeout that member. They may have a higher role than me."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         *
         * Check the database before applying
         * the timeout so the normal operation has
         * a working case-recording service available.
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable, so the timeout was not applied."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * APPLY TIMEOUT
         * =========================
         */

        try {
            await member.timeout(
                duration * 60 * 1000,
                moderationReason
            );
        } catch (error) {
            console.error(
                "[TimeoutCommand] Failed to timeout member:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Timeout Failed")
                        .setDescription(
                            "I couldn't timeout that member. Please check my permissions and role hierarchy."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "TIMEOUT",

                    reason:
                        moderationReason
                });

            /*
             * =========================
             * SUCCESS RESPONSE
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("⏱️ Member Timed Out")
                    .setDescription(
                        `**${user.tag}** has been timed out successfully.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value: `<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: `${duration} minute(s)`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value:
                                `T-${moderationCase.caseNumber}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value:
                                moderationReason,
                            inline: false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The Discord timeout succeeded,
             * but case creation failed.
             */

            console.error(
                "[TimeoutCommand] Failed to create moderation case:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Timeout Applied — Case Not Recorded")
                        .setDescription(
                            `**${user.tag}** was successfully timed out for **${duration} minute(s)**, but the moderation case could not be recorded.`
                        )
                        .addFields({
                            name: "Reason",
                            value:
                                moderationReason,
                            inline: false
                        })
                        .setFooter({
                            text:
                                "Quill & Ink • Moderation"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/TimeoutCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/UnbanCommand.ts
--------------------------------------------------------------------------------
Original size: 10118 bytes
Exported size: 9779 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const UnbanCommand = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from this server.")
        .addStringOption(option =>
            option
                .setName("user")
                .setDescription("The Discord user ID to unban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the unban.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const userId =
            interaction.options
                .getString("user", true)
                .trim();

        const rawReason =
            interaction.options
                .getString("reason")
                ?.trim() ||
            "No reason provided.";

        /*
         * =========================
         * USER ID VALIDATION
         * =========================
         */

        if (!/^\d{17,20}$/.test(userId)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid User ID")
                        .setDescription(
                            "Please provide a valid Discord user ID."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * Discord audit-log reasons have a
         * maximum length of 512 characters.
         */

        const reason =
            rawReason.length > 512
                ? `${rawReason.slice(0, 509)}...`
                : rawReason;

        /*
         * =========================
         * CHECK BAN
         * =========================
         */

        let ban;

        try {
            ban =
                await interaction.guild.bans
                    .fetch(userId)
                    .catch(() => null);
        } catch (error) {
            console.error(
                "[UnbanCommand] Failed to fetch ban:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Ban Lookup Failed")
                        .setDescription(
                            "I couldn't check whether that user is banned."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (!ban) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ User Not Banned")
                        .setDescription(
                            `<@${userId}> is not currently banned from this server.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         *
         * Check the database before performing
         * the unban so the moderation case can
         * normally be recorded.
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable, so the unban was not applied."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * UNBAN
         * =========================
         */

        try {
            await interaction.guild.members.unban(
                userId,
                reason
            );
        } catch (error) {
            console.error(
                "[UnbanCommand] Failed to unban user:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Unban Failed")
                        .setDescription(
                            "I couldn't unban that user. Please check my permissions and try again."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "UNBAN",

                    reason
                });

            /*
             * =========================
             * SUCCESS RESPONSE
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🔓 User Unbanned")
                    .setDescription(
                        `<@${userId}> has been successfully unbanned.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `<@${userId}>`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value:
                                `UB-${moderationCase.caseNumber}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The Discord unban succeeded,
             * but case creation failed.
             */

            console.error(
                "[UnbanCommand] Failed to create moderation case:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Unban Applied — Case Not Recorded")
                        .setDescription(
                            `<@${userId}> was successfully unbanned, but the moderation case could not be recorded.`
                        )
                        .addFields({
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        })
                        .setFooter({
                            text:
                                "Quill & Ink • Moderation"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/UnbanCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/UnlockCommand.ts
--------------------------------------------------------------------------------
Original size: 9256 bytes
Exported size: 8953 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const UnlockCommand = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock the current channel.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for unlocking the channel.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageChannels
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
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
            !("permissionOverwrites" in channel)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Channel")
                        .setDescription(
                            "This channel cannot be unlocked."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * REASON
         * =========================
         */

        const rawReason =
            interaction.options
                .getString("reason")
                ?.trim() ||
            "Channel unlocked by moderator.";

        /*
         * Discord audit-log reasons have a
         * maximum length of 512 characters.
         */

        const reason =
            rawReason.length > 512
                ? `${rawReason.slice(0, 509)}...`
                : rawReason;

        /*
         * =========================
         * DATABASE
         * =========================
         *
         * Check the database before changing
         * the channel so the moderation case can
         * normally be recorded.
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable, so the channel was not unlocked."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * UNLOCK CHANNEL
         * =========================
         */

        try {
            await channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: null
                },
                {
                    reason
                }
            );
        } catch (error) {
            console.error(
                "[UnlockCommand] Failed to unlock channel:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Unlock Failed")
                        .setDescription(
                            "I couldn't unlock this channel. Check my permissions and channel configuration."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    /*
                     * The affected resource is the
                     * channel, so keep the moderator
                     * as the case subject.
                     */

                    userId:
                        interaction.user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "UNLOCK",

                    reason:
                        `Channel: ${channel.id} | ${reason}`
                });

            /*
             * =========================
             * SUCCESS RESPONSE
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🔓 Channel Unlocked")
                    .setDescription(
                        `This channel has been successfully unlocked.`
                    )
                    .addFields(
                        {
                            name: "Channel",
                            value:
                                `<#${channel.id}>`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value:
                                `UL-${moderationCase.caseNumber}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The channel was successfully unlocked,
             * but case creation failed.
             */

            console.error(
                "[UnlockCommand] Failed to create moderation case:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Channel Unlocked — Case Not Recorded")
                        .setDescription(
                            "The channel was successfully unlocked, but the moderation case could not be recorded."
                        )
                        .addFields({
                            name: "Channel",
                            value:
                                `<#${channel.id}>`,
                            inline: true
                        })
                        .addFields({
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        })
                        .setFooter({
                            text:
                                "Quill & Ink • Moderation"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/UnlockCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/UntimeoutCommand.ts
--------------------------------------------------------------------------------
Original size: 13082 bytes
Exported size: 12645 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C,
    primary: 0x5865F2
} as const;

export const UntimeoutCommand = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Remove a timeout from a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "The member to remove the timeout from."
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription(
                    "Reason for removing the timeout."
                )
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        const rawReason =
            interaction.options
                .getString("reason")
                ?.trim() ||
            "No reason provided.";

        /*
         * Discord audit-log reasons have a
         * maximum length of 512 characters.
         */

        const reason =
            rawReason.length > 512
                ? `${rawReason.slice(0, 509)}...`
                : rawReason;

        /*
         * =========================
         * MEMBER
         * =========================
         */

        const member =
            await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Member Not Found")
                        .setDescription(
                            "That user is not in this server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SELF / BOT PROTECTION
         * =========================
         */

        if (
            member.id === interaction.user.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "You can't remove your own timeout using this command."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (
            member.id === interaction.client.user?.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "I can't remove my own timeout."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATOR HIERARCHY
         * =========================
         */

        const moderator =
            await interaction.guild.members
                .fetch(interaction.user.id)
                .catch(() => null);

        if (!moderator) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Permission Check Failed")
                        .setDescription(
                            "I couldn't verify your server permissions."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (
            interaction.guild.ownerId !==
                interaction.user.id &&
            member.roles.highest.position >=
                moderator.roles.highest.position
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Role Hierarchy")
                        .setDescription(
                            "You can't modify that member because their highest role is equal to or higher than yours."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * BOT HIERARCHY
         * =========================
         */

        if (!member.moderatable) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Cannot Modify Member")
                        .setDescription(
                            "I can't modify that member. They may have a higher role than me."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * TIMEOUT STATUS
         * =========================
         */

        if (
            !member.isCommunicationDisabled()
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.primary)
                        .setTitle("ℹ️ No Active Timeout")
                        .setDescription(
                            `<@${user.id}> is not currently timed out.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         *
         * Check the database before changing
         * the member so the moderation case can
         * normally be recorded.
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable, so the timeout was not removed."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * REMOVE TIMEOUT
         * =========================
         */

        try {
            await member.timeout(
                null,
                reason
            );
        } catch (error) {
            console.error(
                "[UntimeoutCommand] Failed to remove timeout:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Timeout Removal Failed")
                        .setDescription(
                            "I couldn't remove the timeout. Check my permissions and role hierarchy."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "UNTIMEOUT",

                    reason
                });

            /*
             * =========================
             * SUCCESS RESPONSE
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("🔓 Timeout Removed")
                    .setDescription(
                        `The timeout has been successfully removed from <@${user.id}>.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value:
                                `UT-${moderationCase.caseNumber}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * Timeout removal succeeded,
             * but case creation failed.
             */

            console.error(
                "[UntimeoutCommand] Failed to create moderation case:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Timeout Removed — Case Not Recorded")
                        .setDescription(
                            `<@${user.id}>'s timeout was successfully removed, but the moderation case could not be recorded.`
                        )
                        .addFields({
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        })
                        .setFooter({
                            text:
                                "Quill & Ink • Moderation"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/UntimeoutCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/WarnCommand.ts
--------------------------------------------------------------------------------
Original size: 12294 bytes
Exported size: 11885 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ModerationCaseService } from "../../../core/moderation/ModerationCaseService.js";

const COLORS = {
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const WarnCommand = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns a member and saves the warning.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to warn.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the warning.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        const rawReason =
            interaction.options.getString(
                "reason",
                true
            ).trim();

        /*
         * Discord audit-log reasons have a
         * maximum length of 512 characters.
         */

        const reason =
            rawReason.length > 512
                ? `${rawReason.slice(0, 509)}...`
                : rawReason;

        /*
         * =========================
         * MEMBER
         * =========================
         */

        const member =
            await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Member Not Found")
                        .setDescription(
                            "That user is not in this server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * SELF / BOT PROTECTION
         * =========================
         */

        if (
            user.id === interaction.user.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "You can't warn yourself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (
            user.id === interaction.client.user?.id
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Invalid Target")
                        .setDescription(
                            "I can't warn myself."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATOR HIERARCHY
         * =========================
         */

        const moderator =
            await interaction.guild.members
                .fetch(interaction.user.id)
                .catch(() => null);

        if (!moderator) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Permission Check Failed")
                        .setDescription(
                            "I couldn't verify your server permissions."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        if (
            interaction.guild.ownerId !==
                interaction.user.id &&
            member.roles.highest.position >=
                moderator.roles.highest.position
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Role Hierarchy")
                        .setDescription(
                            "You can't warn that member because their highest role is equal to or higher than yours."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable, so the warning was not recorded."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * CREATE WARNING
         * =========================
         */

        let warning;

        try {
            warning =
                await database.db.warning.create({
                    data: {
                        guildId:
                            interaction.guild.id,

                        userId:
                            user.id,

                        moderatorId:
                            interaction.user.id,

                        reason
                    }
                });
        } catch (error) {
            console.error(
                "[WarnCommand] Failed to create warning:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Warning Failed")
                        .setDescription(
                            "I couldn't save the warning to the database. No warning was applied."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * MODERATION CASE
         * =========================
         */

        try {
            const caseService =
                new ModerationCaseService(
                    database,
                    interaction.client
                );

            const moderationCase =
                await caseService.createCase({
                    guildId:
                        interaction.guild.id,

                    userId:
                        user.id,

                    moderatorId:
                        interaction.user.id,

                    action:
                        "WARN",

                    reason
                });

            /*
             * =========================
             * SUCCESS RESPONSE
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.success)
                    .setTitle("⚠️ Member Warned")
                    .setDescription(
                        `<@${user.id}> has been successfully warned.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "Moderator",
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: "Case",
                            value:
                                `W-${moderationCase.caseNumber}`,
                            inline: true
                        },
                        {
                            name: "Warning ID",
                            value:
                                `\`${warning.id}\``,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value:
                                reason,
                            inline: false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Moderation"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            /*
             * The warning was successfully created,
             * but the moderation case failed.
             */

            console.error(
                "[WarnCommand] Failed to create moderation case:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.warning)
                        .setTitle("⚠️ Warning Saved — Case Not Recorded")
                        .setDescription(
                            `<@${user.id}> was successfully warned, but the moderation case could not be recorded.`
                        )
                        .addFields(
                            {
                                name: "Warning ID",
                                value:
                                    `\`${warning.id}\``,
                                inline: true
                            },
                            {
                                name: "Reason",
                                value:
                                    reason,
                                inline: false
                            }
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Moderation"
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/moderation/commands/WarnCommand.ts
================================================================================

FILE: src/plugins/moderation/commands/WarningsCommand.ts
--------------------------------------------------------------------------------
Original size: 6292 bytes
Exported size: 6073 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

const COLORS = {
    primary: 0x5865F2,
    danger: 0xED4245,
    warning: 0xFEE75C
} as const;

export const WarningsCommand = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("View a member's warning history.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "The member whose warnings you want to view."
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ModerateMembers
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =========================
         * GUILD CHECK
         * =========================
         */

        if (!interaction.guild) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Server Only")
                        .setDescription(
                            "This command can only be used in a server."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const user =
            interaction.options.getUser(
                "user",
                true
            );

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>(
                    "database"
                );

        if (!database) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Database Unavailable")
                        .setDescription(
                            "The database service is currently unavailable. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * FETCH WARNINGS
         * =========================
         */

        let warnings;

        try {
            warnings =
                await database.db.warning.findMany({
                    where: {
                        guildId:
                            interaction.guild.id,

                        userId:
                            user.id
                    },
                    orderBy: {
                        createdAt:
                            "desc"
                    }
                });
        } catch (error) {
            console.error(
                "[WarningsCommand] Failed to fetch warnings:",
                error
            );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.danger)
                        .setTitle("❌ Warning History Unavailable")
                        .setDescription(
                            "I couldn't retrieve this member's warning history. Please try again later."
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * NO WARNINGS
         * =========================
         */

        if (warnings.length === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLORS.primary)
                        .setTitle("✅ No Warnings")
                        .setDescription(
                            `<@${user.id}> has no warnings in this server.`
                        )
                ],
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * WARNING LIST
         * =========================
         */

        const warningList =
            warnings
                .map((warning, index) => {
                    const timestamp =
                        Math.floor(
                            warning.createdAt.getTime() /
                            1000
                        );

                    return (
                        `**${index + 1}.** ${warning.reason}\n` +
                        `> **Warning ID:** \`${warning.id}\`\n` +
                        `> **Moderator:** <@${warning.moderatorId}>\n` +
                        `> **Date:** <t:${timestamp}:f> (<t:${timestamp}:R>)`
                    );
                })
                .join("\n\n");

        /*
         * =========================
         * RESPONSE
         * =========================
         */

        const embed =
            new EmbedBuilder()
                .setColor(COLORS.warning)
                .setTitle("⚠️ Warning History")
                .setDescription(
                    `Warning history for <@${user.id}>`
                )
                .addFields({
                    name:
                        `Warnings (${warnings.length})`,
                    value:
                        warningList
                })
                .setFooter({
                    text:
                        "Quill & Ink • Moderation"
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

END FILE: src/plugins/moderation/commands/WarningsCommand.ts
================================================================================

FILE: src/plugins/moderation/ModerationPlugin.ts
--------------------------------------------------------------------------------
Original size: 6690 bytes
Exported size: 6439 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import { Message } from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";

import { KickCommand } from "./commands/KickCommand.js";
import { BanCommand } from "./commands/BanCommand.js";
import { TimeoutCommand } from "./commands/TimeoutCommand.js";
import { WarnCommand } from "./commands/WarnCommand.js";
import { WarningsCommand } from "./commands/WarningsCommand.js";
import { ClearWarningsCommand } from "./commands/ClearWarningsCommand.js";
import { UnbanCommand } from "./commands/UnbanCommand.js";
import { UntimeoutCommand } from "./commands/UntimeoutCommand.js";
import { PurgeCommand } from "./commands/PurgeCommand.js";
import { SlowmodeCommand } from "./commands/SlowmodeCommand.js";
import { LockCommand } from "./commands/LockCommand.js";
import { UnlockCommand } from "./commands/UnlockCommand.js";
import { CaseCommand } from "./commands/CaseCommand.js";
import { SetModLogCommand } from "./commands/SetModLogCommand.js";
import { AutoRoleCommand } from "./commands/AutoRoleCommand.js";

import { AntiSpamService } from "../../commands/moderation/antispamservices.js";

/*
 * =========================================================
 * MODERATION PLUGIN
 * =========================================================
 *
 * Provides:
 *
 * • Moderation commands
 * • Warning management
 * • Punishment management
 * • Message purge
 * • Channel slowmode
 * • Channel locking
 * • Moderation cases
 * • Moderation logging configuration
 * • Automatic roles
 * • Anti-spam protection
 *
 * All listeners and timers are registered through
 * PluginContext so they are automatically cleaned up
 * when the plugin is unloaded.
 */

export class ModerationPlugin implements Plugin {

    metadata = {
        id: "moderation",
        name: "Moderation",
        version: "1.0.0",
        description:
            "Complete server moderation, punishment, warning, logging, and anti-spam tools."
    };

    /*
     * =====================================================
     * PRIVATE STATE
     * =====================================================
     */

    private antiSpam?: AntiSpamService;

    /*
     * =====================================================
     * REGISTER
     * =====================================================
     */

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Moderation] Registering moderation plugin..."
        );

        /*
         * =========================
         * MODERATION COMMANDS
         * =========================
         */

        const commands = [
            KickCommand,
            BanCommand,
            TimeoutCommand,
            WarnCommand,
            WarningsCommand,
            ClearWarningsCommand,
            UnbanCommand,
            UntimeoutCommand,
            PurgeCommand,
            SlowmodeCommand,
            LockCommand,
            UnlockCommand,
            CaseCommand,
            SetModLogCommand,
            AutoRoleCommand
        ];

        for (const command of commands) {

            context.commands.registerCommand(
                command
            );
        }

        /*
         * =========================
         * ANTI-SPAM
         * =========================
         *
         * The service is created once for this plugin
         * instance and reused for every message.
         */

        this.antiSpam =
            new AntiSpamService(
                context.client
            );

        context.on(
            "messageCreate",
            async (
                message: Message
            ): Promise<void> => {

                try {

                    await this.handleMessage(
                        message,
                        context
                    );

                } catch (error) {

                    context.logger.error(
                        "[Moderation] Unhandled message event error.",
                        error
                    );
                }
            }
        );

        context.logger.info(
            `[Moderation] Registered ${commands.length} commands and anti-spam protection.`
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
            "[Moderation] Plugin loaded successfully."
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

        /*
         * PluginContext automatically removes the
         * messageCreate listener when the plugin is
         * destroyed.
         */

        this.antiSpam = undefined;

        context.logger.info(
            "[Moderation] Plugin unloaded successfully."
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
         * Ignore DMs.
         */

        if (!message.guild) {
            return;
        }

        /*
         * Ignore bot messages.
         *
         * This prevents moderation automation from
         * accidentally processing bot-generated messages.
         */

        if (message.author.bot) {
            return;
        }

        /*
         * Anti-spam service should always exist after
         * register() has completed.
         */

        const antiSpam =
            this.antiSpam;

        if (!antiSpam) {

            context.logger.warn(
                "[Moderation] Anti-spam service is unavailable."
            );

            return;
        }

        /*
         * Delegate spam detection to the dedicated service.
         *
         * Keeping this logic outside the plugin makes the
         * moderation plugin easier to maintain and prevents
         * the core from becoming responsible for
         * anti-spam implementation details.
         */

        await antiSpam.handleMessage(
            message
        );
    }
}


END FILE: src/plugins/moderation/ModerationPlugin.ts
================================================================================

FILE: src/plugins/moderation/plugin.json
--------------------------------------------------------------------------------
Original size: 142 bytes
Exported size: 137 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
  "id": "moderation",
  "name": "Moderation",
  "version": "1.0.0",
  "description": "Moderation tools for managing Discord servers."
}

END FILE: src/plugins/moderation/plugin.json
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
