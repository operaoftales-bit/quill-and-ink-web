QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:31:40.597Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/reactionroles
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
- This export is scoped to: src/plugins/reactionroles

EXPORT SUMMARY
================================================================================
Files exported: 4
Files excluded or skipped: 0
Original bytes in exported files: 67522
Bytes after redaction: 65108
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/reactionroles/commands/SetReactionRoleCommand.ts
00002. src/plugins/reactionroles/plugin.json
00003. src/plugins/reactionroles/ReactionRoleService.ts
00004. src/plugins/reactionroles/ReactionRolesPlugin.ts

SOURCE FILES
================================================================================

FILE: src/plugins/reactionroles/commands/SetReactionRoleCommand.ts
--------------------------------------------------------------------------------
Original size: 40663 bytes
Exported size: 39416 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
      ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    Message,
    PermissionFlagsBits,
    Role,
    RoleSelectMenuBuilder,
    SlashCommandBuilder,
    TextChannel,
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { ReactionRoleService } from "../ReactionRoleService.js";

interface PendingReactionRole {
    role: Role;
    emoji: string;
}

type ReactionRoleDashboardChannel =
    | TextChannel;

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

const DASHBOARD_TIMEOUT = 15 * 60 * 1000;
const ROLE_SELECTION_TIMEOUT = 60_000;
const EMOJI_SELECTION_TIMEOUT = 60_000;

/*
 * =========================================================
 * COMMAND
 * =========================================================
 */

export const SetReactionRoleCommand = {

    data: new SlashCommandBuilder()
        .setName("setreactionrole")
        .setDescription(
            "Create a reaction role dashboard"
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription(
                    "Channel where the reaction role dashboard will appear"
                )
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setRequired(true)
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        /*
         * =====================================================
         * SERVER CHECK
         * =====================================================
         */

        const guild =
            interaction.guild;

        if (!guild) {
            await interaction.reply({
                content:
                    "❌ This command can only be used inside a server.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * PERMISSION CHECK
         * =====================================================
         */

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            await interaction.reply({
                content:
                    "❌ You need the **Manage Roles** permission to configure reaction roles.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * CLIENT
         * =====================================================
         */

        const client =
            interaction.client as BotClient;

        /*
         * =====================================================
         * DATABASE
         * =====================================================
         */

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            await interaction.reply({
                content:
                    "❌ The database service is currently unavailable.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * PLUGIN CHECK
         * =====================================================
         */

        const guildPlugins =
            client.services.get<{
                isEnabled(
                    guildId: string,
                    pluginId: string
                ): boolean;
            }>("guildPlugins");

        if (!guildPlugins) {
            await interaction.reply({
                content:
                    "❌ The guild plugin service is currently unavailable.",
                ephemeral: true,
            });

            return;
        }

        if (
            !guildPlugins.isEnabled(
                guild.id,
                "reactionroles"
            )
        ) {
            await interaction.reply({
                content:
                    "❌ The **Reaction Roles** plugin is disabled for this server.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * CHANNEL
         * =====================================================
         */

        const selectedChannel =
            interaction.options.getChannel(
                "channel",
                true
            );

        const channel =
            guild.channels.cache.get(
                selectedChannel.id
            );

        if (!channel) {
            await interaction.reply({
                content:
                    "❌ I couldn't find the selected channel.",
                ephemeral: true,
            });

            return;
        }

        if (
            channel.type !== ChannelType.GuildText &&
            channel.type !== ChannelType.GuildAnnouncement
        ) {
            await interaction.reply({
                content:
                    "❌ Please select a normal server text or announcement channel.",
                ephemeral: true,
            });

            return;
        }

        /*
         * TypeScript-safe channel reference.
         *
         * At this point the channel is guaranteed to be
         * a text-based guild channel that supports
         * send() and awaitMessages().
         */

        const targetChannel =
            channel as ReactionRoleDashboardChannel;

        /*
         * =====================================================
         * BOT MEMBER
         * =====================================================
         */

        const botMember =
            guild.members.me ??
            await guild.members.fetchMe().catch(
                () => null
            );

        if (!botMember) {
            await interaction.reply({
                content:
                    "❌ I could not determine my server member.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * BOT PERMISSIONS
         * =====================================================
         */

        const botPermissions =
            targetChannel.permissionsFor(
                botMember
            );

        if (!botPermissions) {
            await interaction.reply({
                content:
                    "❌ I could not determine my permissions in that channel.",
                ephemeral: true,
            });

            return;
        }

        const requiredPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AddReactions,
        ];

        const missingPermissions =
            requiredPermissions.filter(
                permission =>
                    !botPermissions.has(
                        permission
                    )
            );

        if (
            missingPermissions.length > 0
        ) {
            await interaction.reply({
                content:
                    [
                        "❌ I don't have the required permissions in that channel.",
                        "",
                        `Missing: **${missingPermissions
                            .map(permissionName)
                            .join(", ")}**`,
                    ].join("\n"),
                ephemeral: true,
            });

            return;
        }

        /*
         * Manage Roles is required for actually
         * assigning reaction roles.
         */

        if (
            !botMember.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {
            await interaction.reply({
                content:
                    "❌ I need the **Manage Roles** permission to assign reaction roles.",
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * PENDING CONFIGURATION
         * =====================================================
         */

        const pendingRoles:
            PendingReactionRole[] = [];

        /*
         * =====================================================
         * EMBED BUILDER
         * =====================================================
         */

        const buildEmbed =
            (): EmbedBuilder => {

                const embed =
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle(
                            "🎭 Reaction Roles"
                        )
                        .setDescription(
                            [
                                "Configure the roles members can receive through reactions.",
                                "",
                                `📍 **Channel:** <#${targetChannel.id}>`,
                                `👤 **Configured by:** <@${interaction.user.id}>`,
                            ].join("\n")
                        );

                if (
                    pendingRoles.length === 0
                ) {
                    embed.addFields({
                        name:
                            "Configured Roles",
                        value:
                            "*No roles configured yet.*",
                    });
                } else {
                    embed.addFields({
                        name:
                            `Configured Roles • ${pendingRoles.length}`,
                        value:
                            pendingRoles
                                .map(
                                    item =>
                                        `${item.emoji} → <@&${item.role.id}>`
                                )
                                .join("\n"),
                    });
                }

                embed.addFields({
                    name:
                        "How it works",
                    value:
                        [
                            "1. Click **Add Role**.",
                            "2. Select a server role.",
                            "3. Send the emoji for that role.",
                            "4. Repeat for additional roles.",
                            "5. Click **Save** when finished.",
                            "",
                            "Members can react to receive the configured role.",
                        ].join("\n"),
                });

                embed.setFooter({
                    text:
                        "Quill & Ink • Reaction Roles",
                });

                embed.setTimestamp();

                return embed;
            };

        /*
         * =====================================================
         * BUTTON BUILDER
         * =====================================================
         */

        const buildButtons =
            (): ActionRowBuilder<ButtonBuilder> => {

                return new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId(
                                "rr_add_role"
                            )
                            .setLabel(
                                "Add Role"
                            )
                            .setEmoji("➕")
                            .setStyle(
                                ButtonStyle.Primary
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                "rr_remove_role"
                            )
                            .setLabel(
                                "Remove Role"
                            )
                            .setEmoji("🗑️")
                            .setStyle(
                                ButtonStyle.Danger
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                "rr_save"
                            )
                            .setLabel(
                                "Save"
                            )
                            .setEmoji("💾")
                            .setStyle(
                                ButtonStyle.Success
                            )
                    );
            };

        /*
         * =====================================================
         * CREATE DASHBOARD
         * =====================================================
         *
         * Explicit Message type fixes:
         *
         * TS7034
         * TS7005
         */

        let dashboard:
            Message<true>;

        try {

            dashboard =
                await targetChannel.send({
                    embeds: [
                        buildEmbed(),
                    ],
                    components: [
                        buildButtons(),
                    ],
                });

        } catch (error) {

            console.error(
                "[ReactionRoles] Dashboard creation failed:",
                error
            );

            await interaction.reply({
                content:
                    [
                        "❌ I couldn't create the reaction role dashboard.",
                        "",
                        "Please make sure I can **View Channel**, **Send Messages**, and **Embed Links** there.",
                    ].join("\n"),
                ephemeral: true,
            });

            return;
        }

        /*
         * =====================================================
         * COMMAND CONFIRMATION
         * =====================================================
         */

        await interaction.reply({
            content:
                `✅ Reaction role dashboard created in <#${targetChannel.id}>.`,
            ephemeral: true,
        });

        /*
         * =====================================================
         * DASHBOARD COLLECTOR
         * =====================================================
         */

        const collector =
            dashboard.createMessageComponentCollector({
                componentType:
                    ComponentType.Button,

                time:
                    DASHBOARD_TIMEOUT,
            });

        /*
         * =====================================================
         * BUTTON COLLECTOR
         * =====================================================
         */

        collector.on(
            "collect",
            async (
                buttonInteraction: ButtonInteraction
            ) => {

                /*
                 * Only the person who created the
                 * dashboard can configure it.
                 */

                if (
                    buttonInteraction.user.id !==
                    interaction.user.id
                ) {
                    await buttonInteraction.reply({
                        content:
                            "❌ Only the administrator who created this dashboard can configure it.",
                        ephemeral: true,
                    });

                    return;
                }

                /*
                 * =================================================
                 * ADD ROLE
                 * =================================================
                 */

                if (
                    buttonInteraction.customId ===
                    "rr_add_role"
                ) {

                    const roleMenu =
                        new RoleSelectMenuBuilder()
                            .setCustomId(
                                "rr_role_select"
                            )
                            .setPlaceholder(
                                "Select a server role"
                            )
                            .setMinValues(1)
                            .setMaxValues(1);

                    const row =
                        new ActionRowBuilder<RoleSelectMenuBuilder>()
                            .addComponents(
                                roleMenu
                            );

                    await buttonInteraction.reply({
                        content:
                            "🎭 **Select the role** members should receive.",
                        components: [
                            row,
                        ],
                        ephemeral: true,
                    });

                    const roleResponse =
                        await buttonInteraction.channel
                            ?.awaitMessageComponent({
                                componentType:
                                    ComponentType.RoleSelect,

                                time:
                                    ROLE_SELECTION_TIMEOUT,

                                filter:
                                    component =>
                                        component.user.id ===
                                        buttonInteraction.user.id &&
                                        component.customId ===
                                        "rr_role_select",
                            })
                            .catch(
                                () => null
                            );

                    if (
                        !roleResponse ||
                        !roleResponse.isRoleSelectMenu()
                    ) {
                        return;
                    }

                    const roleId =
                        roleResponse.values[0];

                    if (!roleId) {
                        await roleResponse.update({
                            content:
                                "❌ No role was selected.",
                            components: [],
                        });

                        return;
                    }

                    const role =
                        guild.roles.cache.get(
                            roleId
                        );

                    if (!role) {
                        await roleResponse.update({
                            content:
                                "❌ I couldn't find that role.",
                            components: [],
                        });

                        return;
                    }

                    /*
                     * @EVERYONE
                     */

                    if (
                        role.id ===
                        guild.id
                    ) {
                        await roleResponse.update({
                            content:
                                "❌ The **@everyone** role cannot be used as a reaction role.",
                            components: [],
                        });

                        return;
                    }

                    /*
                     * MANAGED ROLE
                     */

                    if (role.managed) {
                        await roleResponse.update({
                            content:
                                "❌ Managed/integration roles cannot be assigned by Quill & Ink.",
                            components: [],
                        });

                        return;
                    }

                    /*
                     * BOT ROLE POSITION
                     */

                    if (
                        role.position >=
                        botMember.roles.highest.position
                    ) {
                        await roleResponse.update({
                            content:
                                "❌ I cannot manage that role. My highest role must be above it.",
                            components: [],
                        });

                        return;
                    }

                    /*
                     * =================================================
                     * ASK FOR EMOJI
                     * =================================================
                     */

                    await roleResponse.update({
                        content:
                            [
                                `🎭 **Role selected:** ${role.name}`,
                                "",
                                `Now send the emoji you want to use for this role in <#${targetChannel.id}>.`,
                                "",
                                "Example: 📚",
                                "",
                                `You have **${ROLE_SELECTION_TIMEOUT / 1000} seconds**.`,
                            ].join("\n"),
                        components: [],
                    });

                    /*
                     * Collect only a message from the
                     * dashboard creator.
                     */

                    const emojiMessages =
                        await targetChannel.awaitMessages({
                            filter:
                                (message: Message) =>
                                    message.author.id ===
                                        interaction.user.id &&
                                    message.content
                                        .trim()
                                        .length > 0,

                            max:
                                1,

                            time:
                                EMOJI_SELECTION_TIMEOUT,
                        });

                    const emojiMessage =
                        emojiMessages.first();

                    if (!emojiMessage) {

                        await buttonInteraction
                            .followUp({
                                content:
                                    "⌛ Emoji selection expired. Click **Add Role** to try again.",
                                ephemeral: true,
                            })
                            .catch(
                                () => null
                            );

                        return;
                    }

                    const emoji =
                        emojiMessage.content.trim();

                    /*
                     * =================================================
                     * BASIC EMOJI VALIDATION
                     * =================================================
                     */

                    if (
                        emoji.length > 100
                    ) {
                        await emojiMessage
                            .reply({
                                content:
                                    "❌ That emoji value is too long. Please send a single Unicode or Discord custom emoji.",
                            })
                            .catch(
                                () => null
                            );

                        return;
                    }

                    /*
                     * =================================================
                     * DUPLICATE EMOJI
                     * =================================================
                     */

                    const emojiAlreadyUsed =
                        pendingRoles.some(
                            item =>
                                item.emoji ===
                                    emoji &&
                                item.role.id !==
                                    role.id
                        );

                    if (
                        emojiAlreadyUsed
                    ) {

                        await emojiMessage
                            .reply({
                                content:
                                    "❌ That emoji is already being used for another role.",
                            })
                            .catch(
                                () => null
                            );

                        return;
                    }

                    /*
                     * =================================================
                     * UPDATE / INSERT
                     * =================================================
                     */

                    const existing =
                        pendingRoles.find(
                            item =>
                                item.role.id ===
                                role.id
                        );

                    if (existing) {

                        existing.emoji =
                            emoji;

                    } else {

                        pendingRoles.push({
                            role,
                            emoji,
                        });
                    }

                    /*
                     * Delete the setup message if
                     * the bot has permission to do so.
                     */

                    await emojiMessage
                        .delete()
                        .catch(
                            () => null
                        );

                    /*
                     * =================================================
                     * UPDATE DASHBOARD
                     * =================================================
                     */

                    await dashboard.edit({
                        embeds: [
                            buildEmbed(),
                        ],
                        components: [
                            buildButtons(),
                        ],
                    });

                    await buttonInteraction
                        .followUp({
                            content:
                                `✅ ${emoji} → **${role.name}** has been configured.`,
                            ephemeral: true,
                        })
                        .catch(
                            () => null
                        );

                    return;
                }

                /*
                 * =================================================
                 * REMOVE ROLE
                 * =================================================
                 */

                if (
                    buttonInteraction.customId ===
                    "rr_remove_role"
                ) {

                    if (
                        pendingRoles.length === 0
                    ) {
                        await buttonInteraction.reply({
                            content:
                                "❌ There are no roles currently configured.",
                            ephemeral: true,
                        });

                        return;
                    }

                    const roleMenu =
                        new RoleSelectMenuBuilder()
                            .setCustomId(
                                "rr_remove_role_select"
                            )
                            .setPlaceholder(
                                "Select a configured role"
                            )
                            .setMinValues(1)
                            .setMaxValues(1);

                    const row =
                        new ActionRowBuilder<RoleSelectMenuBuilder>()
                            .addComponents(
                                roleMenu
                            );

                    await buttonInteraction.reply({
                        content:
                            "🗑️ **Select the configured role you want to remove.**",
                        components: [
                            row,
                        ],
                        ephemeral: true,
                    });

                    const removeResponse =
                        await buttonInteraction.channel
                            ?.awaitMessageComponent({
                                componentType:
                                    ComponentType.RoleSelect,

                                time:
                                    ROLE_SELECTION_TIMEOUT,

                                filter:
                                    component =>
                                        component.user.id ===
                                            buttonInteraction.user.id &&
                                        component.customId ===
                                            "rr_remove_role_select",
                            })
                            .catch(
                                () => null
                            );

                    if (
                        !removeResponse ||
                        !removeResponse.isRoleSelectMenu()
                    ) {
                        return;
                    }

                    const roleId =
                        removeResponse.values[0];

                    if (!roleId) {
                        await removeResponse.update({
                            content:
                                "❌ No role was selected.",
                            components: [],
                        });

                        return;
                    }

                    const index =
                        pendingRoles.findIndex(
                            item =>
                                item.role.id ===
                                roleId
                        );

                    if (
                        index === -1
                    ) {
                        await removeResponse.update({
                            content:
                                "❌ That role is not currently configured.",
                            components: [],
                        });

                        return;
                    }

                    const removed =
                        pendingRoles.splice(
                            index,
                            1
                        )[0];

                    await removeResponse.update({
                        content:
                            `🗑️ Removed **${removed.role.name}** from the dashboard.`,
                        components: [],
                    });

                    await dashboard.edit({
                        embeds: [
                            buildEmbed(),
                        ],
                        components: [
                            buildButtons(),
                        ],
                    });

                    return;
                }

                /*
                 * =================================================
                 * SAVE
                 * =================================================
                 */

                if (
                    buttonInteraction.customId ===
                    "rr_save"
                ) {

                    if (
                        pendingRoles.length === 0
                    ) {
                        await buttonInteraction.reply({
                            content:
                                "❌ Add at least one role before saving.",
                            ephemeral: true,
                        });

                        return;
                    }

                    /*
                     * Acknowledge immediately.
                     */

                    await buttonInteraction.deferUpdate();

                    const service =
                        new ReactionRoleService(
                            database
                        );

                    try {

                        /*
                         * Revalidate every role immediately
                         * before writing anything.
                         */

                        for (
                            const item
                            of pendingRoles
                        ) {

                            const currentRole =
                                guild.roles.cache.get(
                                    item.role.id
                                );

                            if (!currentRole) {
                                throw new Error(
                                    `Role ${item.role.id} no longer exists.`
                                );
                            }

                            if (
                                currentRole.managed
                            ) {
                                throw new Error(
                                    `Role ${currentRole.id} is managed.`
                                );
                            }

                            if (
                                currentRole.position >=
                                botMember.roles.highest.position
                            ) {
                                throw new Error(
                                    `Role ${currentRole.name} is above or equal to the bot's highest role.`
                                );
                            }
                        }

                        /*
                         * Save each configured reaction role.
                         */

                        for (
                            const item
                            of pendingRoles
                        ) {

                            const currentRole =
                                guild.roles.cache.get(
                                    item.role.id
                                );

                            if (!currentRole) {
                                continue;
                            }

                            await service.createReactionRole(
                                guild,
                                dashboard,
                                item.emoji,
                                currentRole
                            );
                        }

                        /*
                         * =================================================
                         * FINAL DASHBOARD
                         * =================================================
                         */

                        const finalEmbed =
                            new EmbedBuilder()
                                .setColor(0x57F287)
                                .setTitle(
                                    "🎭 Reaction Roles"
                                )
                                .setDescription(
                                    [
                                        "React below to receive a role.",
                                        "",
                                        pendingRoles
                                            .map(
                                                item =>
                                                    `${item.emoji} → <@&${item.role.id}>`
                                            )
                                            .join("\n"),
                                    ].join("\n")
                                )
                                .addFields({
                                    name:
                                        "How it works",
                                    value:
                                        "React to receive the role. Remove your reaction to remove it.",
                                })
                                .setFooter({
                                    text:
                                        "Quill & Ink • Reaction Roles",
                                })
                                .setTimestamp();

                        await dashboard.edit({
                            content: null,
                            embeds: [
                                finalEmbed,
                            ],
                            components: [],
                        });

                        collector.stop(
                            "saved"
                        );

                    } catch (error) {

                        console.error(
                            "[ReactionRoles] Save error:",
                            error
                        );

                        await dashboard.edit({
                            content:
                                "⚠️ Reaction Roles could not be completely saved. Please check the bot console and verify my role/channel permissions.",
                            embeds: [],
                            components: [],
                        }).catch(
                            () => null
                        );

                        collector.stop(
                            "error"
                        );
                    }

                    return;
                }
            }
        );

        /*
         * =====================================================
         * COLLECTOR ERROR HANDLING
         * =====================================================
         */

        collector.on(
            "end",
            async (
                _collected,
                reason
            ) => {

                if (
                    reason === "saved" ||
                    reason === "error"
                ) {
                    return;
                }

                await dashboard.edit({
                    content:
                        "⏰ Reaction role configuration expired. Run `/setreactionrole` again to create a new dashboard.",
                    embeds: [],
                    components: [],
                }).catch(
                    () => null
                );
            }
        );
    },
};

/*
 * =========================================================
 * PERMISSION NAME HELPER
 * =========================================================
 */

function permissionName(
    permission: bigint
): string {

    switch (permission) {

        case PermissionFlagsBits.ViewChannel:
            return "View Channel";

        case PermissionFlagsBits.SendMessages:
            return "Send Messages";

        case PermissionFlagsBits.EmbedLinks:
            return "Embed Links";

        case PermissionFlagsBits.AddReactions:
            return "Add Reactions";

        default:
            return "Required Permission";
    }
}

END FILE: src/plugins/reactionroles/commands/SetReactionRoleCommand.ts
================================================================================

FILE: src/plugins/reactionroles/plugin.json
--------------------------------------------------------------------------------
Original size: 157 bytes
Exported size: 152 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
    "id": "reactionroles",
    "name": "Reaction Roles",
    "version": "1.0.0",
    "description": "Give and remove Discord roles using reactions."
}

END FILE: src/plugins/reactionroles/plugin.json
================================================================================

FILE: src/plugins/reactionroles/ReactionRoleService.ts
--------------------------------------------------------------------------------
Original size: 14418 bytes
Exported size: 13802 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    Guild,
    GuildMember,
    Message,
    Role,
} from "discord.js";

import { PrismaService } from "../../core/database/PrismaService.js";

export class ReactionRoleService {

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================================================
     * CREATE REACTION ROLE
     * =========================================================
     */

    async createReactionRole(
        guild: Guild,
        message: Message,
        emoji: string,
        role: Role
    ): Promise<void> {

        /*
         * -----------------------------------------------------
         * VALIDATE ROLE
         * -----------------------------------------------------
         */

        if (
            role.id === guild.id
        ) {
            throw new Error(
                "The @everyone role cannot be used as a reaction role."
            );
        }

        if (
            role.managed
        ) {
            throw new Error(
                `Role ${role.name} is managed and cannot be assigned.`
            );
        }

        /*
         * -----------------------------------------------------
         * BOT MEMBER
         * -----------------------------------------------------
         */

        const botMember =
            guild.members.me ??
            await guild.members.fetchMe();

        if (!botMember) {
            throw new Error(
                "Unable to determine the bot's guild member."
            );
        }

        /*
         * -----------------------------------------------------
         * ROLE HIERARCHY
         * -----------------------------------------------------
         */

        if (
            role.position >=
            botMember.roles.highest.position
        ) {
            throw new Error(
                `Role ${role.name} is above or equal to the bot's highest role.`
            );
        }

        /*
         * -----------------------------------------------------
         * DUPLICATE CHECK
         * -----------------------------------------------------
         */

        const existing =
            await this.database.db.reactionRole.findUnique({
                where: {
                    messageId_emoji: {
                        messageId:
                            message.id,

                        emoji,
                    },
                },
            });

        if (existing) {

            /*
             * If the same reaction already exists,
             * don't create another database record.
             */

            if (
                existing.roleId ===
                role.id
            ) {
                return;
            }

            throw new Error(
                `Emoji ${emoji} is already configured on this dashboard.`
            );
        }

        /*
         * -----------------------------------------------------
         * DATABASE
         * -----------------------------------------------------
         */

        await this.database.db.reactionRole.create({
            data: {
                guildId:
                    guild.id,

                channelId:
                    message.channel.id,

                messageId:
                    message.id,

                emoji,

                roleId:
                    role.id,
            },
        });

        /*
         * -----------------------------------------------------
         * ADD REACTION
         * -----------------------------------------------------
         */

        try {

            await message.react(
                emoji
            );

        } catch (error) {

            /*
             * The database entry was created, but Discord
             * rejected the reaction. Remove the orphaned
             * database entry so the system stays consistent.
             */

            await this.database.db.reactionRole.deleteMany({
                where: {
                    messageId:
                        message.id,

                    emoji,
                },
            }).catch(
                cleanupError => {
                    console.error(
                        "[ReactionRoleService] Failed to clean up reaction-role after reaction failure:",
                        cleanupError
                    );
                }
            );

            throw error;
        }
    }

    /*
     * =========================================================
     * GET REACTION ROLE
     * =========================================================
     */

    async getReactionRole(
        messageId: string,
        emoji: string
    ) {

        return this.database.db.reactionRole.findUnique({
            where: {
                messageId_emoji: {
                    messageId,
                    emoji,
                },
            },
        });
    }

    /*
     * =========================================================
     * GET DASHBOARD ROLES
     * =========================================================
     */

    async getDashboardRoles(
        messageId: string
    ) {

        return this.database.db.reactionRole.findMany({
            where: {
                messageId,
            },

            orderBy: {
                id: "asc",
            },
        });
    }

    /*
     * =========================================================
     * GET GUILD REACTION ROLES
     * =========================================================
     */

    async getGuildReactionRoles(
        guildId: string
    ) {

        return this.database.db.reactionRole.findMany({
            where: {
                guildId,
            },

            orderBy: [
                {
                    messageId: "asc",
                },
                {
                    id: "asc",
                },
            ],
        });
    }

    /*
     * =========================================================
     * ADD ROLE
     * =========================================================
     */

    async addRole(
        guild: Guild,
        memberId: string,
        roleId: string
    ): Promise<void> {

        const member =
            await this.fetchMember(
                guild,
                memberId
            );

        if (!member) {
            return;
        }

        const role =
            guild.roles.cache.get(
                roleId
            );

        if (!role) {
            return;
        }

        /*
         * Never attempt to assign managed roles.
         */

        if (
            role.managed
        ) {
            console.warn(
                `[ReactionRoleService] Cannot assign managed role ${role.id} in ${guild.name}.`
            );

            return;
        }

        /*
         * Never attempt to assign @everyone.
         */

        if (
            role.id ===
            guild.id
        ) {
            return;
        }

        /*
         * Bot hierarchy protection.
         */

        const botMember =
            guild.members.me ??
            await guild.members.fetchMe()
                .catch(
                    () => null
                );

        if (!botMember) {
            console.warn(
                `[ReactionRoleService] Bot member unavailable in ${guild.name}.`
            );

            return;
        }

        if (
            role.position >=
            botMember.roles.highest.position
        ) {
            console.warn(
                `[ReactionRoleService] Cannot assign ${role.name} in ${guild.name}; role is above or equal to the bot's highest role.`
            );

            return;
        }

        /*
         * Already has role.
         */

        if (
            member.roles.cache.has(
                role.id
            )
        ) {
            return;
        }

        /*
         * Server owner cannot have roles managed
         * in the normal hierarchy.
         */

        if (
            member.id ===
            guild.ownerId
        ) {
            return;
        }

        try {

            await member.roles.add(
                role,
                "Reaction role assigned"
            );

        } catch (error) {

            console.error(
                `[ReactionRoleService] Failed to assign role ${role.name} to ${member.user.tag}:`,
                error
            );
        }
    }

    /*
     * =========================================================
     * REMOVE ROLE
     * =========================================================
     */

    async removeRole(
        guild: Guild,
        memberId: string,
        roleId: string
    ): Promise<void> {

        const member =
            await this.fetchMember(
                guild,
                memberId
            );

        if (!member) {
            return;
        }

        const role =
            guild.roles.cache.get(
                roleId
            );

        if (!role) {
            return;
        }

        /*
         * Nothing to remove.
         */

        if (
            !member.roles.cache.has(
                role.id
            )
        ) {
            return;
        }

        /*
         * Managed roles cannot be manually removed.
         */

        if (
            role.managed
        ) {
            console.warn(
                `[ReactionRoleService] Cannot remove managed role ${role.id} in ${guild.name}.`
            );

            return;
        }

        /*
         * Server owner cannot normally be modified.
         */

        if (
            member.id ===
            guild.ownerId
        ) {
            return;
        }

        try {

            await member.roles.remove(
                role,
                "Reaction role removed"
            );

        } catch (error) {

            console.error(
                `[ReactionRoleService] Failed to remove role ${role.name} from ${member.user.tag}:`,
                error
            );
        }
    }

    /*
     * =========================================================
     * UPDATE DASHBOARD
     * =========================================================
     */

    async updateDashboard(
        message: Message
    ): Promise<void> {

        const reactionRoles =
            await this.getDashboardRoles(
                message.id
            );

        const lines: string[] = [
            "## 🎭 Reaction Roles",
            "",
            "React to receive a role. Remove your reaction to remove it.",
            "",
        ];

        if (
            reactionRoles.length ===
            0
        ) {

            lines.push(
                "*No roles have been configured yet.*"
            );

        } else {

            for (
                const reactionRole
                of reactionRoles
            ) {

                const role =
                    message.guild?.roles.cache.get(
                        reactionRole.roleId
                    );

                if (role) {

                    lines.push(
                        `${reactionRole.emoji} → ${role}`
                    );

                } else {

                    /*
                     * Keep the dashboard readable even
                     * if the Discord role was deleted.
                     */

                    lines.push(
                        `${reactionRole.emoji} → ⚠️ Role no longer exists`
                    );
                }
            }
        }

        try {

            await message.edit({
                content:
                    lines.join("\n"),
            });

        } catch (error) {

            console.error(
                `[ReactionRoleService] Failed to update dashboard ${message.id}:`,
                error
            );
        }
    }

    /*
     * =========================================================
     * DELETE DASHBOARD ROLES
     * =========================================================
     */

    async deleteMessageRoles(
        messageId: string
    ): Promise<void> {

        try {

            await this.database.db.reactionRole.deleteMany({
                where: {
                    messageId,
                },
            });

        } catch (error) {

            console.error(
                `[ReactionRoleService] Failed to delete reaction roles for message ${messageId}:`,
                error
            );

            throw error;
        }
    }

    /*
     * =========================================================
     * DELETE SINGLE REACTION ROLE
     * =========================================================
     */

    async deleteReactionRole(
        messageId: string,
        emoji: string
    ): Promise<void> {

        await this.database.db.reactionRole.deleteMany({
            where: {
                messageId,
                emoji,
            },
        });
    }

    /*
     * =========================================================
     * FETCH MEMBER
     * =========================================================
     *
     * Centralized member fetching keeps add/remove
     * logic consistent and prevents repeated try/catch
     * blocks throughout the service.
     */

    private async fetchMember(
        guild: Guild,
        memberId: string
    ): Promise<GuildMember | null> {

        return guild.members
            .fetch(memberId)
            .catch(
                error => {

                    console.warn(
                        `[ReactionRoleService] Could not fetch member ${memberId} in ${guild.name}:`,
                        error
                    );

                    return null;
                }
            );
    }
}

END FILE: src/plugins/reactionroles/ReactionRoleService.ts
================================================================================

FILE: src/plugins/reactionroles/ReactionRolesPlugin.ts
--------------------------------------------------------------------------------
Original size: 12284 bytes
Exported size: 11738 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";
import { ReactionRoleService } from "./ReactionRoleService.js";
import { SetReactionRoleCommand } from "./commands/SetReactionRoleCommand.js";

type Reaction =
    | MessageReaction
    | PartialMessageReaction;

type ReactionUser =
    | User
    | PartialUser;

export class ReactionRolesPlugin implements Plugin {

    /*
     * =========================
     * PLUGIN METADATA
     * =========================
     */

    readonly metadata = {
        id: "reactionroles",
        name: "Reaction Roles",
        version: "1.1.0",
        description:
            "Create persistent reaction-role dashboards that automatically assign and remove Discord roles."
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
            "[ReactionRoles] Registering plugin..."
        );

        /*
         * =========================
         * COMMAND
         * =========================
         */

        context.commands.registerCommand(
            SetReactionRoleCommand
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
                "[ReactionRoles] Database service is unavailable. Reaction roles will not start."
            );

            return;
        }

        /*
         * =========================
         * SERVICE
         * =========================
         */

        const service =
            new ReactionRoleService(
                database
            );

        /*
         * =========================
         * REACTION ADD
         * =========================
         */

        context.on(
            "messageReactionAdd",
            async (
                reaction: Reaction,
                user: ReactionUser
            ): Promise<void> => {

                await this.handleReaction(
                    reaction,
                    user,
                    service,
                    context,
                    true
                );
            }
        );

        /*
         * =========================
         * REACTION REMOVE
         * =========================
         */

        context.on(
            "messageReactionRemove",
            async (
                reaction: Reaction,
                user: ReactionUser
            ): Promise<void> => {

                await this.handleReaction(
                    reaction,
                    user,
                    service,
                    context,
                    false
                );
            }
        );

        context.logger.info(
            "[ReactionRoles] Event handlers registered successfully."
        );
    }

    /*
     * =========================
     * REACTION HANDLER
     * =========================
     *
     * Handles both:
     *
     * messageReactionAdd
     *
     * and
     *
     * messageReactionRemove
     *
     */

    private async handleReaction(
        reaction: Reaction,
        user: ReactionUser,
        service: ReactionRoleService,
        context: PluginContext,
        adding: boolean
    ): Promise<void> {

        try {

            /*
             * =========================
             * USER
             * =========================
             */

            const fullUser =
                await this.resolveUser(
                    user
                );

            if (!fullUser) {
                return;
            }

            /*
             * =========================
             * IGNORE BOTS
             * =========================
             */

            if (fullUser.bot) {
                return;
            }

            /*
             * =========================
             * REACTION
             * =========================
             */

            const fullReaction =
                await this.resolveReaction(
                    reaction
                );

            if (!fullReaction) {
                return;
            }

            /*
             * =========================
             * MESSAGE
             * =========================
             */

            const message =
                fullReaction.message;

            if (message.partial) {

                try {

                    await message.fetch();

                } catch (error) {

                    context.logger.error(
                        "[ReactionRoles] Failed to fetch reaction message.",
                        error
                    );

                    return;
                }
            }

            /*
             * =========================
             * GUILD
             * =========================
             */

            const guild =
                message.guild;

            if (!guild) {
                return;
            }

            /*
             * =========================
             * PLUGIN ENABLED CHECK
             * =========================
             */

            if (
                !context.guildPlugins.isEnabled(
                    guild.id,
                    "reactionroles"
                )
            ) {
                return;
            }

            /*
             * =========================
             * EMOJI
             * =========================
             */

            const emoji =
                getEmojiIdentifier(
                    fullReaction
                );

            if (!emoji) {
                return;
            }

            /*
             * =========================
             * DATABASE LOOKUP
             * =========================
             */

            const reactionRole =
                await service.getReactionRole(
                    message.id,
                    emoji
                );

            /*
             * This reaction isn't part
             * of a configured dashboard.
             */

            if (!reactionRole) {
                return;
            }

            /*
             * =========================
             * BOT MEMBER
             * =========================
             */

            const botMember =
                await guild.members
                    .fetchMe()
                    .catch(
                        () => null
                    );

            if (!botMember) {

                context.logger.error(
                    `[ReactionRoles] Could not resolve bot member in ${guild.name}.`
                );

                return;
            }

            /*
             * =========================
             * ROLE
             * =========================
             */

            const role =
                guild.roles.cache.get(
                    reactionRole.roleId
                );

            if (!role) {

                context.logger.warn(
                    `[ReactionRoles] Configured role ${reactionRole.roleId} no longer exists in ${guild.name}.`
                );

                return;
            }

            /*
             * =========================
             * ROLE VALIDATION
             * =========================
             */

            if (role.managed) {

                context.logger.warn(
                    `[ReactionRoles] Cannot manage role ${role.name} because it is managed by Discord.`
                );

                return;
            }

            if (
                role.position >=
                botMember.roles.highest.position
            ) {

                context.logger.warn(
                    `[ReactionRoles] Cannot manage role ${role.name} in ${guild.name}. The bot's highest role must be above it.`
                );

                return;
            }

            /*
             * =========================
             * LOG
             * =========================
             */

            context.logger.info(
                `[ReactionRoles] ${adding ? "Adding" : "Removing"} role ${role.name} for ${fullUser.tag} using ${emoji}.`
            );

            /*
             * =========================
             * APPLY ROLE
             * =========================
             */

            if (adding) {

                await service.addRole(
                    guild,
                    fullUser.id,
                    role.id
                );

            } else {

                await service.removeRole(
                    guild,
                    fullUser.id,
                    role.id
                );
            }

            /*
             * =========================
             * SUCCESS LOG
             * =========================
             */

            context.logger.info(
                `[ReactionRoles] Successfully ${adding ? "added" : "removed"} ${role.name} ${adding ? "from" : "for"} ${fullUser.tag}.`
            );

        } catch (error) {

            context.logger.error(
                `[ReactionRoles] Failed to process reaction ${adding ? "add" : "remove"}.`,
                error
            );
        }
    }

    /*
     * =========================
     * RESOLVE USER
     * =========================
     */

    private async resolveUser(
        user: ReactionUser
    ): Promise<User | null> {

        if (!user.partial) {
            return user;
        }

        try {

            return await user.fetch();

        } catch {

            return null;
        }
    }

    /*
     * =========================
     * RESOLVE REACTION
     * =========================
     */

    private async resolveReaction(
        reaction: Reaction
    ): Promise<MessageReaction | null> {

        if (!reaction.partial) {
            return reaction;
        }

        try {

            return await reaction.fetch();

        } catch {

            return null;
        }
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
            "[ReactionRoles] Plugin loaded successfully."
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
            "[ReactionRoles] Plugin unloaded successfully."
        );
    }
}

/*
 * =========================
 * EMOJI IDENTIFIER
 * =========================
 *
 * Unicode:
 *     📚
 *
 * Custom:
 *     <:books:123456789>
 *
 * Animated:
 *     <a:books:123456789>
 */

function getEmojiIdentifier(
    reaction: MessageReaction
): string | null {

    const emoji =
        reaction.emoji;

    /*
     * =========================
     * CUSTOM EMOJI
     * =========================
     */

    if (emoji.id) {

        if (!emoji.name) {
            return null;
        }

        return emoji.animated
            ? `<a:${emoji.name}:${emoji.id}>`
            : `<:${emoji.name}:${emoji.id}>`;
    }

    /*
     * =========================
     * UNICODE EMOJI
     * =========================
     */

    return emoji.name ?? null;
}


END FILE: src/plugins/reactionroles/ReactionRolesPlugin.ts
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
