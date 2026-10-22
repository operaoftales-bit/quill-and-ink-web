QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:29:47.681Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/premium-tickets
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
- This export is scoped to: src/plugins/premium-tickets

EXPORT SUMMARY
================================================================================
Files exported: 3
Files excluded or skipped: 0
Original bytes in exported files: 48754
Bytes after redaction: 47082
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/premium-tickets/commands/PremiumTicketCommand.ts
00002. src/plugins/premium-tickets/PremiumTicketsPlugin.ts
00003. src/plugins/premium-tickets/PremiumTicketsService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/premium-tickets/commands/PremiumTicketCommand.ts
--------------------------------------------------------------------------------
Original size: 17095 bytes
Exported size: 16570 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
premium: True
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PremiumTicketsService } from "../PremiumTicketsService.js";

export const PremiumTicketCommand = {

    data: new SlashCommandBuilder()
        .setName("premium-ticket")
        .setDescription(
            "Manage the Premium Ticket system."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription(
                    "Create the Premium Ticket panel in this channel."
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("category")
                .setDescription(
                    "Manage Premium Ticket categories."
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("add")
                        .setDescription(
                            "Add a Premium Ticket category."
                        )
                        .addStringOption(option =>
                            option
                                .setName("name")
                                .setDescription(
                                    "The category name."
                                )
                                .setRequired(true)
                                .setMaxLength(100)
                        )
                        .addStringOption(option =>
                            option
                                .setName("description")
                                .setDescription(
                                    "Explain what this category is for."
                                )
                                .setRequired(true)
                                .setMaxLength(500)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("remove")
                        .setDescription(
                            "Remove a Premium Ticket category."
                        )
                        .addStringOption(option =>
                            option
                                .setName("name")
                                .setDescription(
                                    "The category name to remove."
                                )
                                .setRequired(true)
                                .setMaxLength(100)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription(
                            "List Premium Ticket categories."
                        )
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("staff")
                .setDescription(
                    "Manage Premium Ticket staff."
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-add")
                        .setDescription(
                            "Add a staff role."
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "The role authorized to access Premium Tickets."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-remove")
                        .setDescription(
                            "Remove a staff role."
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "The staff role to remove."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role-list")
                        .setDescription(
                            "List configured staff roles."
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-add")
                        .setDescription(
                            "Add a staff member."
                        )
                        .addUserOption(option =>
                            option
                                .setName("member")
                                .setDescription(
                                    "The member authorized to access Premium Tickets."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-remove")
                        .setDescription(
                            "Remove a staff member."
                        )
                        .addUserOption(option =>
                            option
                                .setName("member")
                                .setDescription(
                                    "The staff member to remove."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("member-list")
                        .setDescription(
                            "List configured staff members."
                        )
                )
        ),

    access: "premium" as const,

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        await interaction.deferReply({
            flags: 64
        });

        try {

            const service =
                new PremiumTicketsService(
                    interaction.client as BotClient
                );

            const subcommandGroup =
                interaction.options.getSubcommandGroup();

            const subcommand =
                interaction.options.getSubcommand();

            /*
             * ---------------------------------------------------------
             * SETUP
             * ---------------------------------------------------------
             */

            if (
                !subcommandGroup &&
                subcommand === "setup"
            ) {

                if (!interaction.channel) {
                    await interaction.editReply({
                        content:
                            "❌ This command must be used in a channel."
                    });

                    return;
                }

                await service.createPanel(
                    interaction.guild,
                    interaction.channel
                );

                await interaction.editReply({
                    content:
                        "✅ Premium Ticket panel created successfully."
                });

                return;
            }

            /*
             * ---------------------------------------------------------
             * CATEGORY
             * ---------------------------------------------------------
             */

            if (
                subcommandGroup === "category" &&
                subcommand === "add"
            ) {

                const name =
                    interaction.options.getString(
                        "name",
                        true
                    );

                const description =
                    interaction.options.getString(
                        "description",
                        true
                    );

                await service.addCategory(
                    interaction.guild,
                    name,
                    description
                );

                await interaction.editReply({
                    content:
                        `✅ Premium Ticket category **${name}** added.`
                });

                return;
            }

            if (
                subcommandGroup === "category" &&
                subcommand === "remove"
            ) {

                const name =
                    interaction.options.getString(
                        "name",
                        true
                    );

                await service.removeCategory(
                    interaction.guild,
                    name
                );

                await interaction.editReply({
                    content:
                        `✅ Premium Ticket category **${name}** removed.`
                });

                return;
            }

            if (
                subcommandGroup === "category" &&
                subcommand === "list"
            ) {

                const categories =
                    await service.listCategories(
                        interaction.guild
                    );

                if (categories.length === 0) {
                    await interaction.editReply({
                        content:
                            "📭 No Premium Ticket categories have been configured yet."
                    });

                    return;
                }

                const lines =
                    categories.map(
                        (category, index) =>
                            `${index + 1}. **${category.name}** — ${category.description ?? "No description"}`
                    );

                await interaction.editReply({
                    content:
                        `🎫 **Premium Ticket Categories**\n\n${lines.join("\n")}`
                });

                return;
            }

            /*
             * ---------------------------------------------------------
             * STAFF
             * ---------------------------------------------------------
             */

            if (subcommandGroup === "staff") {

                if (subcommand === "role-add") {

                    const role =
                        interaction.options.getRole(
                            "role",
                            true
                        );

                    await service.addStaffRole(
                        interaction.guild,
                        role.id
                    );

                    await interaction.editReply({
                        content:
                            `✅ ${role} is now authorized to access Premium Tickets.`
                    });

                    return;
                }

                if (subcommand === "role-remove") {

                    const role =
                        interaction.options.getRole(
                            "role",
                            true
                        );

                    await service.removeStaffRole(
                        interaction.guild,
                        role.id
                    );

                    await interaction.editReply({
                        content:
                            `✅ ${role} has been removed from Premium Ticket staff.`
                    });

                    return;
                }

                if (subcommand === "role-list") {

                    const roles =
                        await service.listStaffRoles(
                            interaction.guild
                        );

                    if (roles.length === 0) {
                        await interaction.editReply({
                            content:
                                "📭 No Premium Ticket staff roles have been configured."
                        });

                        return;
                    }

                    await interaction.editReply({
                        content:
                            [
                                "🛡️ **Premium Ticket Staff Roles**",
                                "",
                                roles
                                    .map(
                                        role =>
                                            `• <@&${role.roleId}>`
                                    )
                                    .join("\n")
                            ].join("\n")
                    });

                    return;
                }

                if (subcommand === "member-add") {

                    const member =
                        interaction.options.getUser(
                            "member",
                            true
                        );

                    await service.addStaffMember(
                        interaction.guild,
                        member.id
                    );

                    await interaction.editReply({
                        content:
                            `✅ <@${member.id}> is now authorized to access Premium Tickets.`
                    });

                    return;
                }

                if (subcommand === "member-remove") {

                    const member =
                        interaction.options.getUser(
                            "member",
                            true
                        );

                    await service.removeStaffMember(
                        interaction.guild,
                        member.id
                    );

                    await interaction.editReply({
                        content:
                            `✅ <@${member.id}> has been removed from Premium Ticket staff.`
                    });

                    return;
                }

                if (subcommand === "member-list") {

                    const members =
                        await service.listStaffMembers(
                            interaction.guild
                        );

                    if (members.length === 0) {
                        await interaction.editReply({
                            content:
                                "📭 No individual Premium Ticket staff members have been configured."
                        });

                        return;
                    }

                    await interaction.editReply({
                        content:
                            [
                                "👤 **Premium Ticket Staff Members**",
                                "",
                                members
                                    .map(
                                        member =>
                                            `• <@${member.discordId}>`
                                    )
                                    .join("\n")
                            ].join("\n")
                    });

                    return;
                }
            }

            /*
             * ---------------------------------------------------------
             * FALLBACK
             * ---------------------------------------------------------
             */

            await interaction.editReply({
                content:
                    "❌ Unknown Premium Ticket action."
            });

        } catch (error) {

            console.error(
                "[Premium Tickets] Command failed:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.";

            await interaction.editReply({
                content:
                    `❌ ${message}`
            });
        }
    }
};


END FILE: src/plugins/premium-tickets/commands/PremiumTicketCommand.ts
================================================================================

FILE: src/plugins/premium-tickets/PremiumTicketsPlugin.ts
--------------------------------------------------------------------------------
Original size: 9351 bytes
Exported size: 9058 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    Interaction
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";

import { PremiumTicketCommand } from "./commands/PremiumTicketCommand.js";
import { PremiumTicketsService } from "./PremiumTicketsService.js";

export class PremiumTicketsPlugin implements Plugin {

    readonly metadata = {
        id: "premium-tickets",
        name: "Premium Tickets",
        version: "1.0.0",
        description:
            "Advanced private support tickets with persistent configuration."
    };

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Premium Tickets] Registering plugin..."
        );

        context.commands.registerCommand(
            PremiumTicketCommand
        );

        const service =
            new PremiumTicketsService(
                context.client
            );

        context.on(
            "interactionCreate",
            async (
                interaction: Interaction
            ): Promise<void> => {

                /*
                 * ---------------------------------------------------------
                 * CREATE TICKET BUTTON
                 * ---------------------------------------------------------
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "premium_ticket:create"
                ) {

                    if (!interaction.guild) {
                        await interaction.reply({
                            content:
                                "❌ This can only be used in a server.",
                            flags: 64
                        });

                        return;
                    }

                    try {

                        const row =
                            await service.createCategoryMenu(
                                interaction.guild
                            );

                        await interaction.reply({
                            content:
                                [
                                    "🎫 **Premium Support**",
                                    "",
                                    "What do you need help with?",
                                    "Select a category below to create your private ticket."
                                ].join("\n"),
                            components: [
                                row
                            ],
                            flags: 64
                        });

                    } catch (error) {

                        console.error(
                            "[Premium Tickets] Failed to show category menu:",
                            error
                        );

                        const message =
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred.";

                        await interaction.reply({
                            content:
                                `❌ ${message}`,
                            flags: 64
                        });
                    }

                    return;
                }

                /*
                 * ---------------------------------------------------------
                 * CATEGORY SELECTION
                 * ---------------------------------------------------------
                 */

                if (
                    interaction.isStringSelectMenu() &&
                    interaction.customId ===
                        "premium_ticket:category"
                ) {

                    if (!interaction.guild) {
                        await interaction.reply({
                            content:
                                "❌ This can only be used in a server.",
                            flags: 64
                        });

                        return;
                    }

                    const categoryId =
                        interaction.values[0];

                    if (!categoryId) {
                        await interaction.reply({
                            content:
                                "❌ No ticket category was selected.",
                            flags: 64
                        });

                        return;
                    }

                    await interaction.deferReply({
                        flags: 64
                    });

                    try {

                        const threadId =
                            await service.createTicket(
                                interaction.guild,
                                interaction.user.id,
                                categoryId
                            );

                        await interaction.editReply({
                            content:
                                `✅ Your Premium Ticket has been created: <#${threadId}>`
                        });

                    } catch (error) {

                        console.error(
                            "[Premium Tickets] Failed to create ticket:",
                            error
                        );

                        const message =
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred.";

                        await interaction.editReply({
                            content:
                                `❌ ${message}`
                        });
                    }

                    return;
                }

                /*
                 * ---------------------------------------------------------
                 * CLOSE TICKET BUTTON
                 * ---------------------------------------------------------
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId.startsWith(
                        "premium_ticket:close:"
                    )
                ) {

                    if (!interaction.guild) {
                        await interaction.reply({
                            content:
                                "❌ This can only be used in a server.",
                            flags: 64
                        });

                        return;
                    }

                    const ticketId =
                        interaction.customId.substring(
                            "premium_ticket:close:".length
                        );

                    if (!ticketId) {
                        await interaction.reply({
                            content:
                                "❌ Invalid Premium Ticket."
                        });

                        return;
                    }

                    await interaction.deferReply({
                        flags: 64
                    });

                    try {

                        if (
                            !interaction.channel ||
                            !interaction.channel.isThread()
                        ) {
                            throw new Error(
                                "This button can only be used inside a Premium Ticket thread."
                            );
                        }

                        await service.closeTicket(
                            interaction.guild,
                            interaction.channel.id,
                            interaction.user.id
                        );

                        await interaction.editReply({
                            content:
                                "🔒 Premium Ticket closed successfully."
                        });

                    } catch (error) {

                        console.error(
                            "[Premium Tickets] Failed to close ticket:",
                            error
                        );

                        const message =
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred.";

                        await interaction.editReply({
                            content:
                                `❌ ${message}`
                        });
                    }

                    return;
                }
            },
            "premium"
        );

        context.logger.info(
            "[Premium Tickets] Plugin registered."
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Premium Tickets] Plugin loaded."
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Premium Tickets] Plugin unloaded."
        );
    }
}


END FILE: src/plugins/premium-tickets/PremiumTicketsPlugin.ts
================================================================================

FILE: src/plugins/premium-tickets/PremiumTicketsService.ts
--------------------------------------------------------------------------------
Original size: 22308 bytes
Exported size: 21454 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Channel,
    ChannelType,
    EmbedBuilder,
    Guild,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel,
    ThreadAutoArchiveDuration
} from "discord.js";

import { PrismaService } from "../../core/database/PrismaService.js";
import { BotClient } from "../../core/client/BotClient.js";

export class PremiumTicketsService {

    private readonly database: PrismaService;

    constructor(
        private readonly client: BotClient
    ) {

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            throw new Error(
                "Database service not found."
            );
        }

        this.database = database;
    }

    async createPanel(
        guild: Guild,
        channel: Channel
    ): Promise<void> {

        if (
            channel.type !== ChannelType.GuildText
        ) {
            throw new Error(
                "Premium Ticket panels can only be created in text channels."
            );
        }

        const existingPanel =
            await this.database.db.ticketPanel.findFirst({
                where: {
                    guildId: guild.id,
                    enabled: true
                }
            });

        if (existingPanel) {
            throw new Error(
                "This server already has an active Premium Ticket panel."
            );
        }

        const textChannel =
            channel as TextChannel;

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "🎫 Premium Support"
                )
                .setDescription(
                    [
                        "Need help from the server staff?",
                        "",
                        "Click the button below to contact the appropriate staff team.",
                        "",
                        "Your ticket will be created privately and only you and authorized staff will be able to access it."
                    ].join("\n")
                )
                .setTimestamp();

        const button =
            new ButtonBuilder()
                .setCustomId(
                    "premium_ticket:create"
                )
                .setLabel(
                    "Contact Staff"
                )
                .setEmoji("🎫")
                .setStyle(
                    ButtonStyle.Primary
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    button
                );

        const message =
            await textChannel.send({
                embeds: [
                    embed
                ],
                components: [
                    row
                ]
            });

        try {

            await this.database.db.ticketPanel.create({
                data: {
                    guildId: guild.id,
                    channelId: textChannel.id,
                    messageId: message.id
                }
            });

        } catch (error) {

            await message.delete()
                .catch(() => undefined);

            throw error;
        }
    }

    async addCategory(
        guild: Guild,
        name: string,
        description: string
    ): Promise<void> {

        const panel =
            await this.database.db.ticketPanel.findFirst({
                where: {
                    guildId: guild.id,
                    enabled: true
                }
            });

        if (!panel) {
            throw new Error(
                "Create the Premium Ticket panel before adding categories."
            );
        }

        const existing =
            await this.database.db.ticketCategory.findFirst({
                where: {
                    guildId: guild.id,
                    name
                }
            });

        if (existing) {
            throw new Error(
                `A Premium Ticket category named "${name}" already exists.`
            );
        }

        const lastCategory =
            await this.database.db.ticketCategory.findFirst({
                where: {
                    guildId: guild.id
                },
                orderBy: {
                    position: "desc"
                }
            });

        const position =
            lastCategory
                ? lastCategory.position + 1
                : 0;

        await this.database.db.ticketCategory.create({
            data: {
                guildId: guild.id,
                name,
                description,
                position,
                panelId: panel.id
            }
        });
    }

    async removeCategory(
        guild: Guild,
        name: string
    ): Promise<void> {

        const category =
            await this.database.db.ticketCategory.findFirst({
                where: {
                    guildId: guild.id,
                    name
                }
            });

        if (!category) {
            throw new Error(
                `Premium Ticket category "${name}" was not found.`
            );
        }

        const activeTickets =
            await this.database.db.ticket.count({
                where: {
                    categoryId: category.id,
                    status: "OPEN"
                }
            });

        if (activeTickets > 0) {
            throw new Error(
                `Cannot remove "${name}" because it has ${activeTickets} open ticket(s).`
            );
        }

        await this.database.db.ticketCategory.delete({
            where: {
                id: category.id
            }
        });
    }

    async listCategories(
        guild: Guild
    ): Promise<
        Array<{
            id: string;
            name: string;
            description: string | null;
            position: number;
        }>
    > {

        return this.database.db.ticketCategory.findMany({
            where: {
                guildId: guild.id,
                enabled: true
            },
            orderBy: {
                position: "asc"
            },
            select: {
                id: true,
                name: true,
                description: true,
                position: true
            }
        });
    }

    async createCategoryMenu(
        guild: Guild
    ): Promise<
        ActionRowBuilder<StringSelectMenuBuilder>
    > {

        const categories =
            await this.listCategories(
                guild
            );

        if (categories.length === 0) {
            throw new Error(
                "No Premium Ticket categories have been configured yet."
            );
        }

        if (categories.length > 25) {
            throw new Error(
                "A Premium Ticket panel cannot have more than 25 categories."
            );
        }

        const menu =
            new StringSelectMenuBuilder()
                .setCustomId(
                    "premium_ticket:category"
                )
                .setPlaceholder(
                    "Select a reason for your ticket"
                )
                .setMinValues(1)
                .setMaxValues(1);

        for (const category of categories) {

            const option =
                new StringSelectMenuOptionBuilder()
                    .setLabel(
                        category.name
                    )
                    .setValue(
                        category.id
                    )
                    .setDescription(
                        category.description ??
                        "Contact staff regarding this category."
                    );

            menu.addOptions(
                option
            );
        }

        return new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                menu
            );
    }

    async addStaffRole(
        guild: Guild,
        roleId: string
    ): Promise<void> {

        const role =
            await guild.roles.fetch(
                roleId
            );

        if (!role) {
            throw new Error(
                "That role could not be found in this server."
            );
        }

        if (role.id === guild.id) {
            throw new Error(
                "The @everyone role cannot be used as Premium Ticket staff."
            );
        }

        if (role.managed) {
            throw new Error(
                "Managed/integration roles cannot be used as Premium Ticket staff."
            );
        }

        const existing =
            await this.database.db.ticketStaffRole.findUnique({
                where: {
                    guildId_roleId: {
                        guildId: guild.id,
                        roleId: role.id
                    }
                }
            });

        if (existing) {
            throw new Error(
                `${role.name} is already configured as Premium Ticket staff.`
            );
        }

        await this.database.db.ticketStaffRole.create({
            data: {
                guildId: guild.id,
                roleId: role.id
            }
        });
    }

    async removeStaffRole(
        guild: Guild,
        roleId: string
    ): Promise<void> {

        const existing =
            await this.database.db.ticketStaffRole.findUnique({
                where: {
                    guildId_roleId: {
                        guildId: guild.id,
                        roleId
                    }
                }
            });

        if (!existing) {
            throw new Error(
                "That role is not configured as Premium Ticket staff."
            );
        }

        await this.database.db.ticketStaffRole.delete({
            where: {
                id: existing.id
            }
        });
    }

    async listStaffRoles(
        guild: Guild
    ): Promise<
        Array<{
            id: string;
            roleId: string;
        }>
    > {

        return this.database.db.ticketStaffRole.findMany({
            where: {
                guildId: guild.id
            },
            orderBy: {
                createdAt: "asc"
            },
            select: {
                id: true,
                roleId: true
            }
        });
    }

    async addStaffMember(
        guild: Guild,
        discordId: string
    ): Promise<void> {

        const member =
            await guild.members.fetch(
                discordId
            ).catch(() => null);

        if (!member) {
            throw new Error(
                "That user is not a member of this server."
            );
        }

        const existing =
            await this.database.db.ticketStaffMember.findUnique({
                where: {
                    guildId_discordId: {
                        guildId: guild.id,
                        discordId
                    }
                }
            });

        if (existing) {
            throw new Error(
                `<@${discordId}> is already configured as Premium Ticket staff.`
            );
        }

        await this.database.db.ticketStaffMember.create({
            data: {
                guildId: guild.id,
                discordId
            }
        });
    }

    async removeStaffMember(
        guild: Guild,
        discordId: string
    ): Promise<void> {

        const existing =
            await this.database.db.ticketStaffMember.findUnique({
                where: {
                    guildId_discordId: {
                        guildId: guild.id,
                        discordId
                    }
                }
            });

        if (!existing) {
            throw new Error(
                `<@${discordId}> is not configured as Premium Ticket staff.`
            );
        }

        await this.database.db.ticketStaffMember.delete({
            where: {
                id: existing.id
            }
        });
    }

    async listStaffMembers(
        guild: Guild
    ): Promise<
        Array<{
            id: string;
            discordId: string;
        }>
    > {

        return this.database.db.ticketStaffMember.findMany({
            where: {
                guildId: guild.id
            },
            orderBy: {
                createdAt: "asc"
            },
            select: {
                id: true,
                discordId: true
            }
        });
    }

    async getAuthorizedStaffIds(
        guild: Guild
    ): Promise<string[]> {

        const [
            configuredRoles,
            configuredMembers
        ] = await Promise.all([
            this.database.db.ticketStaffRole.findMany({
                where: {
                    guildId: guild.id
                },
                select: {
                    roleId: true
                }
            }),
            this.database.db.ticketStaffMember.findMany({
                where: {
                    guildId: guild.id
                },
                select: {
                    discordId: true
                }
            })
        ]);

        const staffIds =
            new Set<string>(
                configuredMembers.map(
                    member =>
                        member.discordId
                )
            );

        if (configuredRoles.length > 0) {

            const members =
                await guild.members.fetch();

            for (const member of members.values()) {

                if (
                    configuredRoles.some(
                        role =>
                            member.roles.cache.has(
                                role.roleId
                            )
                    )
                ) {
                    staffIds.add(
                        member.id
                    );
                }
            }
        }

        return [
            ...staffIds
        ];
    }

    async createTicket(
        guild: Guild,
        creatorId: string,
        categoryId: string
    ): Promise<string> {

        const category =
            await this.database.db.ticketCategory.findFirst({
                where: {
                    id: categoryId,
                    guildId: guild.id,
                    enabled: true
                }
            });

        if (!category) {
            throw new Error(
                "That Premium Ticket category is no longer available."
            );
        }

        const existingTicket =
            await this.database.db.ticket.findFirst({
                where: {
                    guildId: guild.id,
                    creatorId,
                    status: "OPEN"
                }
            });

        if (existingTicket) {
            throw new Error(
                "You already have an open Premium Ticket."
            );
        }

        if (!category.panelId) {
            throw new Error(
                "This ticket category is not connected to a Premium Ticket panel."
            );
        }

        const panel =
            await this.database.db.ticketPanel.findFirst({
                where: {
                    id: category.panelId,
                    guildId: guild.id,
                    enabled: true
                }
            });

        if (!panel) {
            throw new Error(
                "The Premium Ticket panel for this category is no longer available."
            );
        }

        const parentChannel =
            await guild.channels.fetch(
                panel.channelId
            );

        if (
            !parentChannel ||
            parentChannel.type !== ChannelType.GuildText
        ) {
            throw new Error(
                "The Premium Ticket panel channel is no longer available."
            );
        }

        const thread =
            await parentChannel.threads.create({
                name:
                    `ticket-${creatorId}`,
                type:
                    ChannelType.PrivateThread,
                autoArchiveDuration:
                    ThreadAutoArchiveDuration.OneDay,
                reason:
                    `Premium Ticket created by ${creatorId}`
            });

        try {

            await thread.members.add(
                creatorId
            );

            const staffIds =
                await this.getAuthorizedStaffIds(
                    guild
                );

            for (const staffId of staffIds) {

                if (staffId === creatorId) {
                    continue;
                }

                await thread.members.add(
                    staffId
                ).catch(error => {

                    console.error(
                        `[Premium Tickets] Failed to add staff member ${staffId} to ticket ${thread.id}:`,
                        error
                    );
                });
            }

            const ticket =
                await this.database.db.ticket.create({
                    data: {
                        guildId: guild.id,
                        threadId: thread.id,
                        creatorId,
                        categoryId: category.id
                    }
                });

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🎫 Premium Ticket"
                    )
                    .setDescription(
                        [
                            `**Category:** ${category.name}`,
                            "",
                            "Your ticket has been created.",
                            "Please describe your issue and a member of the staff team will assist you.",
                            "",
                            `Ticket ID: \`${ticket.id}\``
                        ].join("\n")
                    )
                    .setTimestamp();

            const closeButton =
                new ButtonBuilder()
                    .setCustomId(
                        `premium_ticket:close:${ticket.id}`
                    )
                    .setLabel(
                        "Close Ticket"
                    )
                    .setEmoji("🔒")
                    .setStyle(
                        ButtonStyle.Danger
                    );

            const actionRow =
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        closeButton
                    );

            await thread.send({
                content:
                    `<@${creatorId}>`,
                embeds: [
                    embed
                ],
                components: [
                    actionRow
                ]
            });

            return thread.id;

        } catch (error) {

            await thread.delete()
                .catch(() => undefined);

            throw error;
        }
    }

    async closeTicket(
        guild: Guild,
        threadId: string,
        closedBy: string
    ): Promise<void> {

        const ticket =
            await this.database.db.ticket.findFirst({
                where: {
                    guildId: guild.id,
                    threadId
                }
            });

        if (!ticket) {
            throw new Error(
                "This thread is not a Premium Ticket."
            );
        }

        if (ticket.status === "CLOSED") {
            throw new Error(
                "This Premium Ticket is already closed."
            );
        }

        const authorizedStaffIds =
            await this.getAuthorizedStaffIds(
                guild
            );

        if (
            !authorizedStaffIds.includes(
                closedBy
            )
        ) {
            throw new Error(
                "You are not authorized to close Premium Tickets."
            );
        }

        const updated =
            await this.database.db.ticket.updateMany({
                where: {
                    id: ticket.id,
                    status: "OPEN"
                },
                data: {
                    status: "CLOSED",
                    closedAt: new Date(),
                    closedBy
                }
            });

        if (updated.count === 0) {
            throw new Error(
                "This Premium Ticket was already closed."
            );
        }

        const thread =
            await guild.channels.fetch(
                threadId
            );

        if (
            !thread ||
            !thread.isThread()
        ) {
            throw new Error(
                "The Premium Ticket thread could not be found."
            );
        }

        await thread.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(
                        "🔒 Ticket Closed"
                    )
                    .setDescription(
                        `This Premium Ticket has been closed by <@${closedBy}>.`
                    )
                    .setTimestamp()
            ]
        });

        await thread.setLocked(
            true,
            `Premium Ticket closed by ${closedBy}`
        );

        await thread.setArchived(
            true,
            `Premium Ticket closed by ${closedBy}`
        );
    }
}


END FILE: src/plugins/premium-tickets/PremiumTicketsService.ts
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
