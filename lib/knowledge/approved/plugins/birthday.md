QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:13:40.465Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/birthday
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
- This export is scoped to: src/plugins/birthday

EXPORT SUMMARY
================================================================================
Files exported: 3
Files excluded or skipped: 0
Original bytes in exported files: 77012
Bytes after redaction: 73978
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/birthday/BirthdayPlugin.ts
00002. src/plugins/birthday/commands/BirthdayCommand.ts
00003. src/plugins/birthday/services/BirthdayService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/birthday/BirthdayPlugin.ts
--------------------------------------------------------------------------------
Original size: 21483 bytes
Exported size: 20573 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Guild,
    User
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import {
    BirthdayCommand
} from "./commands/BirthdayCommand.js";

import {
    BirthdayService
} from "./services/BirthdayService.js";

export class BirthdayPlugin implements Plugin {

    metadata = {
        id: "birthday",
        name: "Birthday Tracker",
        version: "1.0.0",
        premium: True
        description:
            "Birthday tracking with timezone-aware reminders, announcements, roles, DMs, and optional gifts."
    };

    private birthdayService:
        BirthdayService | null = null;

    private readonly processedDates =
        new Map<string, string>();

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "[Birthday] Registering birthday tracker plugin..."
        );

        context.commands.registerCommand(
            BirthdayCommand
        );

        context.on(
            "interactionCreate",
            async interaction => {

                if (
                    !interaction.isButton()
                ) {
                    return;
                }

                if (
                    !interaction.customId.startsWith(
                        "birthday:"
                    )
                ) {
                    return;
                }

                if (
                    interaction.customId.startsWith(
                        "birthday:list-"
                    )
                ) {

                    await BirthdayCommand.handleListButton(
                        interaction
                    );

                    return;
                }

                if (
                    interaction.customId.startsWith(
                        "birthday:claim:"
                    )
                ) {

                    await this.handleRewardClaim(
                        interaction,
                        context
                    );
                }
            }
        );

        context.setInterval(
            () => {
                void this.processBirthdays(
                    context
                );
            },
            30_000
        );

        context.logger.info(
            "[Birthday] Birthday tracker plugin registered."
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            context.logger.error(
                "[Birthday] Database service is unavailable."
            );

            return;
        }

        this.birthdayService =
            new BirthdayService(
                database
            );

        context.logger.info(
            "[Birthday] Plugin loaded successfully."
        );

        void this.processBirthdays(
            context
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        this.processedDates.clear();

        this.birthdayService =
            null;

        context.logger.info(
            "[Birthday] Plugin unloaded successfully."
        );
    }

    /*
     * =========================
     * SCHEDULER
     * =========================
     */

    private async processBirthdays(
        context: PluginContext
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {
            return;
        }

        try {

            const configs =
                await service.getEnabledConfigs();

            const now =
                new Date();

            for (
                const config of configs
            ) {

                const local =
                    service.getLocalDateTime(
                        config.timezone,
                        now
                    );

                if (
                    local.hour !== 0 ||
                    local.minute !== 0
                ) {
                    continue;
                }

                const previousDate =
                    this.processedDates.get(
                        config.guildId
                    );

                if (
                    previousDate ===
                    local.dateKey
                ) {
                    continue;
                }

                this.processedDates.set(
                    config.guildId,
                    local.dateKey
                );

                await this.processGuildBirthdays(
                    context,
                    config,
                    local.year,
                    local.month,
                    local.day
                );
            }

        } catch (error) {

            if (error instanceof Error) {

                const details: Record<string, unknown> = {};

                for (
                    const key of Object.getOwnPropertyNames(error)
                ) {

                    details[key] = (
                        error as unknown as Record<string, unknown>
                    )[key];
                }

                const prismaError =
                    error as Error & {
                        code?: unknown;
                        meta?: unknown;
                        clientVersion?: unknown;
                    };

                context.logger.error(
                    "[Birthday] Birthday scheduler failed:",
                    {
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                        cause: error.cause,
                        code: prismaError.code,
                        meta: prismaError.meta,
                        clientVersion:
                            prismaError.clientVersion,
                        properties: details
                    }
                );

            } else {

                context.logger.error(
                    "[Birthday] Birthday scheduler failed with a non-Error value:",
                    error
                );
            }
        }
    }

    private async processGuildBirthdays(
        context: PluginContext,
        config: Awaited<
            ReturnType<
                BirthdayService["getEnabledConfigs"]
            >
        >[number],
        year: number,
        month: number,
        day: number
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {
            return;
        }

        const birthdays =
            await service.getBirthdaysForDate(
                config.guildId,
                month,
                day
            );

        if (
            birthdays.length === 0
        ) {
            return;
        }

        let guild:
            Guild | undefined =
            context.client.guilds.cache.get(
                config.guildId
            );

        if (!guild) {

            try {

                guild =
                    await context.client.guilds.fetch(
                        config.guildId
                    );

            } catch (error) {

                context.logger.error(
                    `[Birthday] Failed to fetch guild ${config.guildId}:`,
                    error
                );

                return;
            }
        }

        for (
            const birthday of birthdays
        ) {

            try {

                await this.processMemberBirthday(
                    context,
                    guild,
                    config,
                    birthday.discordId,
                    year
                );

            } catch (error) {

                context.logger.error(
                    `[Birthday] Failed to process birthday for ${birthday.discordId} in ${guild.name}:`,
                    error
                );
            }
        }
    }

    private async processMemberBirthday(
        context: PluginContext,
        guild: Guild,
        config: Awaited<
            ReturnType<
                BirthdayService["getEnabledConfigs"]
            >
        >[number],
        discordId: string,
        year: number
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {
            return;
        }

        let member;

        try {

            member =
                await guild.members.fetch(
                    discordId
                );

        } catch {

            context.logger.warn(
                `[Birthday] User ${discordId} is no longer available in ${guild.name}.`
            );

            return;
        }

        /*
         * =========================
         * ANNOUNCEMENT
         * =========================
         */

        if (
            config.announcementEnabled &&
            config.announcementChannelId
        ) {

            await this.sendAnnouncement(
                context,
                config,
                member.user,
                guild.name
            );
        }

        /*
         * =========================
         * ROLE
         * =========================
         */

        if (
            config.roleEnabled &&
            config.roleId
        ) {

            await this.grantBirthdayRole(
                context,
                guild,
                member,
                config.roleId,
                year
            );
        }

        /*
         * =========================
         * DM
         * =========================
         */

        if (
            config.dmEnabled &&
            config.dmMessage
        ) {

            await this.sendBirthdayDm(
                context,
                config,
                member.user,
                guild.name,
                year
            );
        }
    }

    /*
     * =========================
     * ANNOUNCEMENT
     * =========================
     */

    private async sendAnnouncement(
        context: PluginContext,
        config: Awaited<
            ReturnType<
                BirthdayService["getEnabledConfigs"]
            >
        >[number],
        user: User,
        guildName: string
    ): Promise<void> {

        if (
            !config.announcementChannelId
        ) {
            return;
        }

        const channel =
            await context.client.channels.fetch(
                config.announcementChannelId
            );

        if (
            !channel ||
            !channel.isTextBased() ||
            channel.isDMBased()
        ) {

            context.logger.warn(
                `[Birthday] Announcement channel ${config.announcementChannelId} is unavailable.`
            );

            return;
        }

        const message =
            replaceBirthdayPlaceholders(
                config.announcementMessage ??
                    "Happy birthday, {user}! 🎉",
                user,
                guildName
            );

        await channel.send({
            content:
                message,

            allowedMentions: {
                users: [
                    user.id
                ]
            }
        });
    }

    /*
     * =========================
     * ROLE
     * =========================
     */

    private async grantBirthdayRole(
        context: PluginContext,
        guild: Guild,
        member: import("discord.js").GuildMember,
        roleId: string,
        year: number
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {
            return;
        }

        const existingGrant =
            await service.getBirthdayRoleGrant(
                guild.id,
                member.id,
                year
            );

        if (existingGrant) {
            return;
        }

        const role =
            await guild.roles.fetch(
                roleId
            );

        if (!role) {

            context.logger.warn(
                `[Birthday] Birthday role ${roleId} could not be found in ${guild.name}.`
            );

            return;
        }

        if (
            role.managed
        ) {

            context.logger.warn(
                `[Birthday] Birthday role ${roleId} is managed and cannot be assigned.`
            );

            return;
        }

        try {

            await member.roles.add(
                role,
                "Birthday Tracker"
            );

            await service.recordBirthdayRoleGrant(
                guild.id,
                member.id,
                role.id,
                year
            );

        } catch (error) {

            context.logger.error(
                `[Birthday] Failed to grant birthday role ${role.id} to ${member.id}:`,
                error
            );
        }
    }

    /*
     * =========================
     * BIRTHDAY DM
     * =========================
     */

    private async sendBirthdayDm(
        context: PluginContext,
        config: Awaited<
            ReturnType<
                BirthdayService["getEnabledConfigs"]
            >
        >[number],
        user: User,
        guildName: string,
        year: number
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {
            return;
        }

        const rewardEnabled =
            config.prizeEnabled &&
            config.prizeAmount !== null &&
            config.prizeAmount > 0n;

        let claim:
            Awaited<
                ReturnType<
                    BirthdayService["prepareBirthdayRewardClaim"]
                >
            > | null = null;

        /*
         * =========================
         * PREPARE REWARD
         * =========================
         */

        if (rewardEnabled) {

            claim =
                await service.prepareBirthdayRewardClaim(
                    config.guildId,
                    user.id,
                    year,
                    config.prizeAmount!
                );

            if (
                claim.dmSentAt
            ) {
                return;
            }
        }

        const message =
            replaceBirthdayPlaceholders(
                config.dmMessage!,
                user,
                guildName
            );

        const components:
            ActionRowBuilder<ButtonBuilder>[] = [];

        /*
         * =========================
         * CLAIM BUTTON
         * =========================
         */

        if (
            rewardEnabled &&
            claim
        ) {

            const claimButton =
                new ButtonBuilder()
                    .setCustomId(
                        `birthday:claim:${config.guildId}:${user.id}:${year}`
                    )
                    .setLabel(
                        `Claim ${claim.amount.toString()} Nickel`
                    )
                    .setStyle(
                        ButtonStyle.Success
                    );

            const row =
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        claimButton
                    );

            components.push(
                row
            );
        }

        /*
         * =========================
         * SEND DM
         * =========================
         */

        try {

            const sent =
                await user.send({
                    content:
                        message,

                    components
                });

            if (
                rewardEnabled &&
                claim
            ) {

                await service.markBirthdayRewardDmSent(
                    config.guildId,
                    user.id,
                    year,
                    sent.id
                );
            }

        } catch (error) {

            context.logger.error(
                `[Birthday] Failed to send birthday DM to ${user.id}:`,
                error
            );
        }
    }

    /*
     * =========================
     * REWARD CLAIM
     * =========================
     */

    private async handleRewardClaim(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        const service =
            this.birthdayService;

        if (!service) {

            await interaction.reply({
                content:
                    "The Birthday Tracker is currently unavailable.",
                ephemeral: true
            });

            return;
        }

        const parts =
            interaction.customId.split(":");

        if (
            parts.length !== 5
        ) {

            await interaction.reply({
                content:
                    "This birthday reward button is invalid.",
                ephemeral: true
            });

            return;
        }

        const [
            ,
            ,
            guildId,
            userId,
            yearValue
        ] = parts;

        if (
            interaction.user.id !==
            userId
        ) {

            await interaction.reply({
                content:
                    "This birthday gift belongs to another member.",
                ephemeral: true
            });

            return;
        }

        const year =
            Number.parseInt(
                yearValue,
                10
            );

        if (
            !Number.isInteger(year)
        ) {

            await interaction.reply({
                content:
                    "This birthday reward is invalid.",
                ephemeral: true
            });

            return;
        }

        try {

            const result =
                await service.claimBirthdayReward(
                    guildId,
                    userId,
                    year
                );

            await interaction.update({
                content:
                    `🎁 **Birthday gift claimed!** You received **${result.amount.toString()} Nickel**.\n\nYour wallet now contains **${result.wallet.toString()} Nickel**.`,

                components: []
            });

            context.logger.info(
                `[Birthday] ${userId} claimed ${result.amount.toString()} Nickel for their ${year} birthday reward in ${guildId}.`
            );

        } catch (error) {

            if (
                error instanceof Error
            ) {

                switch (
                    error.message
                ) {

                    case "BIRTHDAY_REWARD_ALREADY_CLAIMED":

                        await interaction.reply({
                            content:
                                "🎁 You have already claimed this birthday gift.",
                            ephemeral: true
                        });

                        return;

                    case "BIRTHDAY_REWARD_NOT_FOUND":

                        await interaction.reply({
                            content:
                                "This birthday gift could not be found.",
                            ephemeral: true
                        });

                        return;

                    case "BIRTHDAY_REWARD_NOT_READY":

                        await interaction.reply({
                            content:
                                "This birthday gift is not ready to be claimed yet.",
                            ephemeral: true
                        });

                        return;
                }
            }

            context.logger.error(
                "[Birthday] Failed to claim birthday reward:",
                error
            );

            await interaction.reply({
                content:
                    "Something went wrong while claiming your birthday gift. Please try again later.",
                ephemeral: true
            });
        }
    }
}

function replaceBirthdayPlaceholders(
    message: string,
    user: User,
    guildName: string
): string {

    return message
        .replaceAll(
            "{user}",
            `<@${user.id}>`
        )
        .replaceAll(
            "{username}",
            user.username
        )
        .replaceAll(
            "{server}",
            guildName
        );
}


END FILE: src/plugins/birthday/BirthdayPlugin.ts
================================================================================

FILE: src/plugins/birthday/commands/BirthdayCommand.ts
--------------------------------------------------------------------------------
Original size: 33393 bytes
Exported size: 32283 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { BirthdayService } from "../services/BirthdayService.js";

const BIRTHDAYS_PER_PAGE = 10;

type BirthdayListInteraction =
    | ChatInputCommandInteraction
    | ButtonInteraction;

export const BirthdayCommand = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription(
            "Manage birthdays and birthday settings."
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription(
                    "Set your birthday."
                )
                .addIntegerOption(option =>
                    option
                        .setName("month")
                        .setDescription(
                            "Your birth month (1-12)."
                        )
                        .setMinValue(1)
                        .setMaxValue(12)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName("day")
                        .setDescription(
                            "Your birth day."
                        )
                        .setMinValue(1)
                        .setMaxValue(31)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName("year")
                        .setDescription(
                            "Your birth year (optional)."
                        )
                        .setMinValue(1)
                        .setMaxValue(9999)
                        .setRequired(false)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription(
                    "View your registered birthday."
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription(
                    "Remove your registered birthday."
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription(
                    "View birthdays registered in this server."
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("config")
                .setDescription(
                    "Configure the birthday tracker."
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("enabled")
                        .setDescription(
                            "Enable or disable the birthday tracker."
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Whether birthday processing is enabled."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("timezone")
                        .setDescription(
                            "Set the server timezone used for birthday processing."
                        )
                        .addStringOption(option =>
                            option
                                .setName("timezone")
                                .setDescription(
                                    "Timezone, for example Asia/Kolkata."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("announcement")
                        .setDescription(
                            "Configure birthday announcements."
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Whether birthday announcements are enabled."
                                )
                                .setRequired(true)
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Channel where birthday announcements are sent."
                                )
                                .addChannelTypes(
                                    ChannelType.GuildText,
                                    ChannelType.GuildAnnouncement
                                )
                                .setRequired(false)
                        )
                        .addStringOption(option =>
                            option
                                .setName("message")
                                .setDescription(
                                    "The birthday announcement message."
                                )
                                .setRequired(false)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("role")
                        .setDescription(
                            "Configure the birthday role."
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Whether the birthday role is enabled."
                                )
                                .setRequired(true)
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "Role granted to members on their birthday."
                                )
                                .setRequired(false)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("dm")
                        .setDescription(
                            "Configure birthday direct messages."
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Whether birthday DMs are enabled."
                                )
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("message")
                                .setDescription(
                                    "The birthday DM message."
                                )
                                .setRequired(false)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("prize")
                        .setDescription(
                            "Configure the birthday Nickel reward."
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("enabled")
                                .setDescription(
                                    "Whether the birthday reward is enabled."
                                )
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName("amount")
                                .setDescription(
                                    "Nickel awarded when the birthday gift is claimed."
                                )
                                .setMinValue(1)
                                .setRequired(false)
                        )
                )

                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription(
                            "View the current birthday configuration."
                        )
                )
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "This command can only be used inside a server.",
                ephemeral: true
            });

            return;
        }

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                content:
                    "The birthday database service is currently unavailable.",
                ephemeral: true
            });

            return;
        }

        const birthdayService =
            new BirthdayService(database);

        const subcommandGroup =
            interaction.options.getSubcommandGroup();

        const subcommand =
            interaction.options.getSubcommand();

        try {
            if (subcommandGroup === "config") {
                await this.handleConfig(
                    interaction,
                    birthdayService,
                    subcommand
                );

                return;
            }

            if (subcommand === "set") {
                await this.handleSet(
                    interaction,
                    birthdayService
                );

                return;
            }

            if (subcommand === "view") {
                await this.handleView(
                    interaction,
                    birthdayService
                );

                return;
            }

            if (subcommand === "remove") {
                await this.handleRemove(
                    interaction,
                    birthdayService
                );

                return;
            }

            if (subcommand === "list") {
                await this.handleList(
                    interaction,
                    birthdayService,
                    0
                );

                return;
            }

            await interaction.reply({
                content:
                    "Unknown birthday command.",
                ephemeral: true
            });

        } catch (error) {
            await this.handleError(
                interaction,
                error
            );
        }
    },

    async handleSet(
        interaction: ChatInputCommandInteraction,
        birthdayService: BirthdayService
    ): Promise<void> {

        const month =
            interaction.options.getInteger(
                "month",
                true
            );

        const day =
            interaction.options.getInteger(
                "day",
                true
            );

        const year =
            interaction.options.getInteger(
                "year"
            ) ?? undefined;

        await birthdayService.setBirthday(
            interaction.guild!.id,
            interaction.user.id,
            month,
            day,
            year
        );

        await interaction.reply({
            content:
                `Your birthday has been set to **${formatBirthday(
                    month,
                    day,
                    year
                )}**.`,
            ephemeral: true
        });
    },

    async handleView(
        interaction: ChatInputCommandInteraction,
        birthdayService: BirthdayService
    ): Promise<void> {

        const birthday =
            await birthdayService.getBirthday(
                interaction.guild!.id,
                interaction.user.id
            );

        if (!birthday) {
            await interaction.reply({
                content:
                    "You do not have a birthday registered in this server.",
                ephemeral: true
            });

            return;
        }

        const embed =
            new EmbedBuilder()
                .setTitle("Your Birthday")
                .setDescription(
                    `Your registered birthday is **${formatBirthday(
                        birthday.month,
                        birthday.day,
                        birthday.year ?? undefined
                    )}**.`
                )
                .addFields({
                    name: "Status",
                    value:
                        birthday.enabled
                            ? "Enabled"
                            : "Disabled",
                    inline: true
                });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    },

    async handleRemove(
        interaction: ChatInputCommandInteraction,
        birthdayService: BirthdayService
    ): Promise<void> {

        await birthdayService.removeBirthday(
            interaction.guild!.id,
            interaction.user.id
        );

        await interaction.reply({
            content:
                "Your birthday has been removed from this server.",
            ephemeral: true
        });
    },

    async handleList(
        interaction: ChatInputCommandInteraction,
        birthdayService: BirthdayService,
        page: number
    ): Promise<void> {

        const birthdays =
            await birthdayService.getGuildBirthdays(
                interaction.guild!.id
            );

        await this.showBirthdayList(
            interaction,
            birthdays,
            page
        );
    },

    async handleListButton(
        interaction: ButtonInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "This button can only be used inside a server.",
                ephemeral: true
            });

            return;
        }

        const parts =
            interaction.customId.split(":");

        if (parts.length !== 4) {
            await interaction.reply({
                content:
                    "This birthday list button is invalid.",
                ephemeral: true
            });

            return;
        }

        const [, action, userId, pageValue] =
            parts;

        if (
            userId !== interaction.user.id
        ) {
            await interaction.reply({
                content:
                    "Only the member who opened this birthday list can use these buttons.",
                ephemeral: true
            });

            return;
        }

        const currentPage =
            parsePage(pageValue);

        if (currentPage === null) {
            await interaction.reply({
                content:
                    "This birthday list page is invalid.",
                ephemeral: true
            });

            return;
        }

        const database =
            (interaction.client as BotClient)
                .services
                .get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                content:
                    "The birthday database service is currently unavailable.",
                ephemeral: true
            });

            return;
        }

        const birthdayService =
            new BirthdayService(database);

        const birthdays =
            await birthdayService.getGuildBirthdays(
                interaction.guild.id
            );

        let targetPage =
            currentPage;

        if (action === "prev") {
            targetPage =
                Math.max(
                    0,
                    currentPage - 1
                );
        } else if (action === "next") {
            const totalPages =
                Math.max(
                    1,
                    Math.ceil(
                        birthdays.length /
                        BIRTHDAYS_PER_PAGE
                    )
                );

            targetPage =
                Math.min(
                    totalPages - 1,
                    currentPage + 1
                );
        } else {
            await interaction.reply({
                content:
                    "This birthday list button is invalid.",
                ephemeral: true
            });

            return;
        }

        await this.showBirthdayList(
            interaction,
            birthdays,
            targetPage
        );
    },

    async showBirthdayList(
        interaction: BirthdayListInteraction,
        birthdays: Awaited<
            ReturnType<BirthdayService["getGuildBirthdays"]>
        >,
        page: number
    ): Promise<void> {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    birthdays.length /
                    BIRTHDAYS_PER_PAGE
                )
            );

        const safePage =
            Math.min(
                Math.max(page, 0),
                totalPages - 1
            );

        const start =
            safePage *
            BIRTHDAYS_PER_PAGE;

        const entries =
            birthdays.slice(
                start,
                start + BIRTHDAYS_PER_PAGE
            );

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "Server Birthdays"
                )
                .setFooter({
                    text:
                        `Page ${safePage + 1} of ${totalPages} • ${birthdays.length} birthday${birthdays.length === 1 ? "" : "s"}`
                });

        if (entries.length === 0) {
            embed.setDescription(
                "No birthdays have been registered in this server."
            );
        } else {
            embed.setDescription(
                entries
                    .map(
                        (birthday, index) =>
                            `**${start + index + 1}.** <@${birthday.discordId}> — **${formatBirthday(
                                birthday.month,
                                birthday.day,
                                birthday.year ?? undefined
                            )}**`
                    )
                    .join("\n")
            );
        }

        const previousButton =
            new ButtonBuilder()
                .setCustomId(
                    `birthday:list-prev:${interaction.user.id}:${safePage}`
                )
                .setLabel("Previous")
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    safePage === 0
                );

        const nextButton =
            new ButtonBuilder()
                .setCustomId(
                    `birthday:list-next:${interaction.user.id}:${safePage}`
                )
                .setLabel("Next")
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(
                    safePage >= totalPages - 1
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    previousButton,
                    nextButton
                );

        if (
            interaction.isButton()
        ) {
            await interaction.update({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    },

    async handleConfig(
        interaction: ChatInputCommandInteraction,
        birthdayService: BirthdayService,
        subcommand: string
    ): Promise<void> {

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            await interaction.reply({
                content:
                    "You need the **Manage Server** permission to configure the Birthday Tracker.",
                ephemeral: true
            });

            return;
        }

        const guildId =
            interaction.guild!.id;

        if (subcommand === "enabled") {
            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            await birthdayService.setEnabled(
                guildId,
                enabled
            );

            await interaction.reply({
                content:
                    `Birthday Tracker is now **${enabled ? "enabled" : "disabled"}**.`,
                ephemeral: true
            });

            return;
        }

        if (subcommand === "timezone") {
            const timezone =
                interaction.options.getString(
                    "timezone",
                    true
                );

            await birthdayService.setTimezone(
                guildId,
                timezone
            );

            await interaction.reply({
                content:
                    `Birthday processing timezone has been set to **${timezone.trim()}**.`,
                ephemeral: true
            });

            return;
        }

        if (subcommand === "announcement") {
            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            const channel =
                interaction.options.getChannel(
                    "channel"
                );

            const message =
                interaction.options.getString(
                    "message"
                ) ?? undefined;

            await birthdayService.configureAnnouncement(
                guildId,
                enabled,
                channel?.id,
                message
            );

            await interaction.reply({
                content:
                    enabled
                        ? `Birthday announcements are enabled in <#${channel!.id}>.`
                        : "Birthday announcements are now disabled.",
                ephemeral: true
            });

            return;
        }

        if (subcommand === "role") {
            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            const role =
                interaction.options.getRole(
                    "role"
                );

            await birthdayService.configureRole(
                guildId,
                enabled,
                role?.id
            );

            await interaction.reply({
                content:
                    enabled
                        ? `The birthday role is enabled: <@&${role!.id}>.`
                        : "The birthday role is now disabled.",
                ephemeral: true
            });

            return;
        }

        if (subcommand === "dm") {
            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            const message =
                interaction.options.getString(
                    "message"
                ) ?? undefined;

            await birthdayService.configureDm(
                guildId,
                enabled,
                message
            );

            await interaction.reply({
                content:
                    enabled
                        ? "Birthday DMs are enabled."
                        : "Birthday DMs are now disabled.",
                ephemeral: true
            });

            return;
        }

        if (subcommand === "prize") {
            const enabled =
                interaction.options.getBoolean(
                    "enabled",
                    true
                );

            const amount =
                interaction.options.getInteger(
                    "amount"
                );

            await birthdayService.configurePrize(
                guildId,
                enabled,
                amount === null
                    ? undefined
                    : BigInt(amount)
            );

            await interaction.reply({
                content:
                    enabled
                        ? `Birthday rewards are enabled with a reward of **${amount!.toLocaleString()} Nickel**.`
                        : "Birthday rewards are now disabled.",
                ephemeral: true
            });

            return;
        }

        if (subcommand === "view") {
            const config =
                await birthdayService.getOrCreateConfig(
                    guildId
                );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "Birthday Tracker Configuration"
                    )
                    .addFields(
                        {
                            name: "Tracker",
                            value:
                                config.enabled
                                    ? "Enabled"
                                    : "Disabled",
                            inline: true
                        },
                        {
                            name: "Timezone",
                            value:
                                `\`${config.timezone}\``,
                            inline: true
                        },
                        {
                            name: "Announcements",
                            value:
                                config.announcementEnabled
                                    ? `Enabled\nChannel: <#${config.announcementChannelId}>`
                                    : "Disabled",
                            inline: true
                        },
                        {
                            name: "Birthday Role",
                            value:
                                config.roleEnabled
                                    ? `Enabled\nRole: <@&${config.roleId}>`
                                    : "Disabled",
                            inline: true
                        },
                        {
                            name: "Birthday DM",
                            value:
                                config.dmEnabled
                                    ? "Enabled"
                                    : "Disabled",
                            inline: true
                        },
                        {
                            name: "Birthday Reward",
                            value:
                                config.prizeEnabled
                                    ? `Enabled\nAmount: ${config.prizeAmount?.toString() ?? "Not configured"} Nickel`
                                    : "Disabled",
                            inline: true
                        }
                    );

            if (config.announcementEnabled) {
                embed.addFields({
                    name: "Announcement Message",
                    value:
                        config.announcementMessage ??
                        "Not configured."
                });
            }

            if (config.dmEnabled) {
                embed.addFields({
                    name: "DM Message",
                    value:
                        config.dmMessage ??
                        "Not configured."
                });
            }

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            return;
        }

        await interaction.reply({
            content:
                "Unknown birthday configuration option.",
            ephemeral: true
        });
    },

    async handleError(
        interaction: ChatInputCommandInteraction,
        error: unknown
    ): Promise<void> {

        let message =
            "Something went wrong while processing the birthday command.";

        if (error instanceof Error) {
            switch (error.message) {
                case "BIRTHDAY_NOT_FOUND":
                    message =
                        "You do not have a birthday registered in this server.";
                    break;

                case "BIRTHDAY_INVALID_MONTH":
                    message =
                        "The birthday month must be between 1 and 12.";
                    break;

                case "BIRTHDAY_INVALID_DAY":
                    message =
                        "The birthday day must be between 1 and 31.";
                    break;

                case "BIRTHDAY_INVALID_DATE":
                    message =
                        "That is not a valid calendar date.";
                    break;

                case "BIRTHDAY_INVALID_YEAR":
                    message =
                        "The birth year must be between 1 and 9999.";
                    break;

                case "BIRTHDAY_INVALID_TIMEZONE":
                    message =
                        "Please provide a valid non-empty timezone.";
                    break;

                case "BIRTHDAY_ANNOUNCEMENT_CHANNEL_REQUIRED":
                    message =
                        "You must provide an announcement channel when announcements are enabled.";
                    break;

                case "BIRTHDAY_ROLE_REQUIRED":
                    message =
                        "You must provide a role when the birthday role is enabled.";
                    break;

                case "BIRTHDAY_PRIZE_AMOUNT_REQUIRED":
                    message =
                        "You must provide a positive Nickel amount when birthday rewards are enabled.";
                    break;

                case "BIRTHDAY_DM_MESSAGE_REQUIRED":
                    message =
                        "You must provide a DM message when birthday DMs are enabled.";
                    break;
            }
        }

        if (
            interaction.replied ||
            interaction.deferred
        ) {
            await interaction.editReply({
                content: message
            });

            return;
        }

        await interaction.reply({
            content: message,
            ephemeral: true
        });
    }
};

function formatBirthday(
    month: number,
    day: number,
    year?: number
): string {

    const date =
        new Date(
            2000,
            month - 1,
            day
        );

    const monthName =
        date.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );

    if (year !== undefined) {
        return `${monthName} ${day}, ${year}`;
    }

    return `${monthName} ${day}`;
}

function parsePage(
    value: string
): number | null {

    const page =
        Number.parseInt(
            value,
            10
        );

    if (
        !Number.isInteger(page) ||
        page < 0
    ) {
        return null;
    }

    return page;
}

END FILE: src/plugins/birthday/commands/BirthdayCommand.ts
================================================================================

FILE: src/plugins/birthday/services/BirthdayService.ts
--------------------------------------------------------------------------------
Original size: 22136 bytes
Exported size: 21122 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { PrismaService } from "../../../core/database/PrismaService.js";

export class BirthdayService {

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * BIRTHDAY
     * =========================
     */

    async getBirthday(
        guildId: string,
        discordId: string
    ) {
        return this.database.db.birthday.findUnique({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            }
        });
    }

    async setBirthday(
        guildId: string,
        discordId: string,
        month: number,
        day: number,
        year?: number
    ): Promise<void> {

        this.validateBirthdayDate(
            month,
            day
        );

        this.validateBirthYear(
            year
        );

        await this.database.db.birthday.upsert({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            update: {
                month,
                day,
                year,
                enabled: true
            },

            create: {
                guildId,
                discordId,
                month,
                day,
                year,
                enabled: true
            }
        });
    }

    async removeBirthday(
        guildId: string,
        discordId: string
    ): Promise<void> {

        const existing =
            await this.getBirthday(
                guildId,
                discordId
            );

        if (!existing) {
            throw new Error(
                "BIRTHDAY_NOT_FOUND"
            );
        }

        await this.database.db.birthday.delete({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            }
        });
    }

    async setBirthdayEnabled(
        guildId: string,
        discordId: string,
        enabled: boolean
    ): Promise<void> {

        const existing =
            await this.getBirthday(
                guildId,
                discordId
            );

        if (!existing) {
            throw new Error(
                "BIRTHDAY_NOT_FOUND"
            );
        }

        await this.database.db.birthday.update({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            data: {
                enabled
            }
        });
    }

    /*
     * =========================
     * BIRTHDAY LIST
     * =========================
     */

    async getBirthdaysForDate(
        guildId: string,
        month: number,
        day: number
    ) {

        this.validateMonth(month);
        this.validateDay(day);

        return this.database.db.birthday.findMany({
            where: {
                guildId,
                month,
                day,
                enabled: true
            },

            orderBy: {
                discordId: "asc"
            }
        });
    }

    async getGuildBirthdays(
        guildId: string
    ) {

        return this.database.db.birthday.findMany({
            where: {
                guildId,
                enabled: true
            },

            orderBy: [
                {
                    month: "asc"
                },
                {
                    day: "asc"
                },
                {
                    discordId: "asc"
                }
            ]
        });
    }

    /*
     * =========================
     * BIRTHDAY CONFIG
     * =========================
     */

    async getConfig(
        guildId: string
    ) {

        return this.database.db.birthdayConfig.findUnique({
            where: {
                guildId
            }
        });
    }

    async getOrCreateConfig(
        guildId: string
    ) {

        return this.database.db.birthdayConfig.upsert({
            where: {
                guildId
            },

            update: {},

            create: {
                guildId
            }
        });
    }

    async getEnabledConfigs() {

        return this.database.db.birthdayConfig.findMany({
            where: {
                enabled: true
            }
        });
    }

    async setEnabled(
        guildId: string,
        enabled: boolean
    ): Promise<void> {

        await this.getOrCreateConfig(
            guildId
        );

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                enabled
            }
        });
    }

    async setTimezone(
        guildId: string,
        timezone: string
    ): Promise<void> {

        const normalizedTimezone =
            timezone.trim();

        if (
            normalizedTimezone.length === 0
        ) {
            throw new Error(
                "BIRTHDAY_INVALID_TIMEZONE"
            );
        }

        this.validateTimezone(
            normalizedTimezone
        );

        await this.getOrCreateConfig(
            guildId
        );

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                timezone:
                    normalizedTimezone
            }
        });
    }

    /*
     * =========================
     * ANNOUNCEMENTS
     * =========================
     */

    async configureAnnouncement(
        guildId: string,
        enabled: boolean,
        channelId?: string,
        message?: string
    ): Promise<void> {

        await this.getOrCreateConfig(
            guildId
        );

        if (
            enabled &&
            !channelId
        ) {
            throw new Error(
                "BIRTHDAY_ANNOUNCEMENT_CHANNEL_REQUIRED"
            );
        }

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                announcementEnabled:
                    enabled,

                announcementChannelId:
                    enabled
                        ? channelId ?? null
                        : null,

                announcementMessage:
                    enabled
                        ? message?.trim() || null
                        : null
            }
        });
    }

    /*
     * =========================
     * BIRTHDAY ROLE
     * =========================
     */

    async configureRole(
        guildId: string,
        enabled: boolean,
        roleId?: string
    ): Promise<void> {

        await this.getOrCreateConfig(
            guildId
        );

        if (
            enabled &&
            !roleId
        ) {
            throw new Error(
                "BIRTHDAY_ROLE_REQUIRED"
            );
        }

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                roleEnabled:
                    enabled,

                roleId:
                    enabled
                        ? roleId ?? null
                        : null
            }
        });
    }

    /*
     * =========================
     * BIRTHDAY PRIZE
     * =========================
     */

    async configurePrize(
        guildId: string,
        enabled: boolean,
        amount?: bigint
    ): Promise<void> {

        await this.getOrCreateConfig(
            guildId
        );

        if (
            enabled &&
            (
                amount === undefined ||
                amount <= 0n
            )
        ) {
            throw new Error(
                "BIRTHDAY_PRIZE_AMOUNT_REQUIRED"
            );
        }

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                prizeEnabled:
                    enabled,

                prizeAmount:
                    enabled
                        ? amount ?? null
                        : null
            }
        });
    }

    /*
     * =========================
     * BIRTHDAY DM
     * =========================
     */

    async configureDm(
        guildId: string,
        enabled: boolean,
        message?: string
    ): Promise<void> {

        await this.getOrCreateConfig(
            guildId
        );

        if (
            enabled &&
            !message?.trim()
        ) {
            throw new Error(
                "BIRTHDAY_DM_MESSAGE_REQUIRED"
            );
        }

        await this.database.db.birthdayConfig.update({
            where: {
                guildId
            },

            data: {
                dmEnabled:
                    enabled,

                dmMessage:
                    enabled
                        ? message?.trim() ?? null
                        : null
            }
        });
    }

    /*
     * =========================
     * TIMEZONE
     * =========================
     */

    getLocalDateTime(
        timezone: string,
        date = new Date()
    ): {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        dateKey: string;
    } {

        this.validateTimezone(
            timezone
        );

        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone: timezone,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hourCycle: "h23"
                }
            );

        const parts =
            formatter.formatToParts(
                date
            );

        const values =
            new Map(
                parts
                    .filter(
                        part =>
                            part.type !== "literal"
                    )
                    .map(
                        part => [
                            part.type,
                            part.value
                        ]
                    )
            );

        const year =
            Number(
                values.get("year")
            );

        const month =
            Number(
                values.get("month")
            );

        const day =
            Number(
                values.get("day")
            );

        const hour =
            Number(
                values.get("hour")
            );

        const minute =
            Number(
                values.get("minute")
            );

        const second =
            Number(
                values.get("second")
            );

        return {
            year,
            month,
            day,
            hour,
            minute,
            second,
            dateKey:
                `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        };
    }

    isLocalMidnight(
        timezone: string,
        date = new Date()
    ): boolean {

        const local =
            this.getLocalDateTime(
                timezone,
                date
            );

        return (
            local.hour === 0 &&
            local.minute === 0
        );
    }

    /*
     * =========================
     * REWARD CLAIM
     * =========================
     */

    async getBirthdayRewardClaim(
        guildId: string,
        discordId: string,
        year: number
    ) {

        return this.database.db.birthdayRewardClaim.findUnique({
            where: {
                guildId_discordId_year: {
                    guildId,
                    discordId,
                    year
                }
            }
        });
    }

    async prepareBirthdayRewardClaim(
        guildId: string,
        discordId: string,
        year: number,
        amount: bigint
    ) {

        if (
            amount <= 0n
        ) {
            throw new Error(
                "BIRTHDAY_PRIZE_AMOUNT_REQUIRED"
            );
        }

        const existing =
            await this.getBirthdayRewardClaim(
                guildId,
                discordId,
                year
            );

        if (existing) {
            return existing;
        }

        try {

            return await this.database.db.birthdayRewardClaim.create({
                data: {
                    guildId,
                    discordId,
                    year,
                    amount
                }
            });

        } catch (error) {

            if (
                this.isUniqueConstraintError(
                    error
                )
            ) {

                const created =
                    await this.getBirthdayRewardClaim(
                        guildId,
                        discordId,
                        year
                    );

                if (created) {
                    return created;
                }
            }

            throw error;
        }
    }

    async markBirthdayRewardDmSent(
        guildId: string,
        discordId: string,
        year: number,
        dmMessageId: string
    ): Promise<void> {

        const now =
            new Date();

        const result =
            await this.database.db.birthdayRewardClaim.updateMany({
                where: {
                    guildId,
                    discordId,
                    year,
                    dmSentAt: null
                },

                data: {
                    dmSentAt:
                        now,

                    dmMessageId
                }
            });

        if (
            result.count !== 1
        ) {
            throw new Error(
                "BIRTHDAY_REWARD_DM_ALREADY_SENT"
            );
        }
    }

    async setBirthdayRewardMessageId(
        guildId: string,
        discordId: string,
        year: number,
        dmMessageId: string
    ): Promise<void> {

        await this.database.db.birthdayRewardClaim.update({
            where: {
                guildId_discordId_year: {
                    guildId,
                    discordId,
                    year
                }
            },

            data: {
                dmMessageId
            }
        });
    }

    async claimBirthdayReward(
        guildId: string,
        discordId: string,
        year: number
    ): Promise<{
        amount: bigint;
        wallet: bigint;
    }> {

        return this.database.db.$transaction(
            async tx => {

                const claim =
                    await tx.birthdayRewardClaim.findUnique({
                        where: {
                            guildId_discordId_year: {
                                guildId,
                                discordId,
                                year
                            }
                        }
                    });

                if (!claim) {
                    throw new Error(
                        "BIRTHDAY_REWARD_NOT_FOUND"
                    );
                }

                if (!claim.dmSentAt) {
                    throw new Error(
                        "BIRTHDAY_REWARD_NOT_READY"
                    );
                }

                if (claim.claimedAt) {
                    throw new Error(
                        "BIRTHDAY_REWARD_ALREADY_CLAIMED"
                    );
                }

                const claimedAt =
                    new Date();

                const claimUpdate =
                    await tx.birthdayRewardClaim.updateMany({
                        where: {
                            id:
                                claim.id,

                            claimedAt:
                                null
                        },

                        data: {
                            claimedAt
                        }
                    });

                if (
                    claimUpdate.count !== 1
                ) {
                    throw new Error(
                        "BIRTHDAY_REWARD_ALREADY_CLAIMED"
                    );
                }

                const account =
                    await tx.economyAccount.upsert({
                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        },

                        update: {},

                        create: {
                            guildId,
                            discordId,
                            wallet: 0n
                        }
                    });

                const updatedAccount =
                    await tx.economyAccount.update({
                        where: {
                            id:
                                account.id
                        },

                        data: {
                            wallet: {
                                increment:
                                    claim.amount
                            }
                        }
                    });

                return {
                    amount:
                        claim.amount,

                    wallet:
                        updatedAccount.wallet
                };
            }
        );
    }

    /*
     * =========================
     * BIRTHDAY ROLE
     * =========================
     */

    async getBirthdayRoleGrant(
        guildId: string,
        discordId: string,
        year: number
    ) {

        return this.database.db.birthdayRoleGrant.findUnique({
            where: {
                guildId_discordId_year: {
                    guildId,
                    discordId,
                    year
                }
            }
        });
    }

    async recordBirthdayRoleGrant(
        guildId: string,
        discordId: string,
        roleId: string,
        year: number
    ): Promise<void> {

        try {

            await this.database.db.birthdayRoleGrant.create({
                data: {
                    guildId,
                    discordId,
                    roleId,
                    year
                }
            });

        } catch (error) {

            if (
                this.isUniqueConstraintError(
                    error
                )
            ) {
                return;
            }

            throw error;
        }
    }

    /*
     * =========================
     * VALIDATION
     * =========================
     */

    private validateBirthdayDate(
        month: number,
        day: number
    ): void {

        this.validateMonth(
            month
        );

        this.validateDay(
            day
        );

        const daysInMonth =
            new Date(
                2000,
                month,
                0
            ).getDate();

        if (
            day >
            daysInMonth
        ) {
            throw new Error(
                "BIRTHDAY_INVALID_DATE"
            );
        }
    }

    private validateMonth(
        month: number
    ): void {

        if (
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12
        ) {
            throw new Error(
                "BIRTHDAY_INVALID_MONTH"
            );
        }
    }

    private validateDay(
        day: number
    ): void {

        if (
            !Number.isInteger(day) ||
            day < 1 ||
            day > 31
        ) {
            throw new Error(
                "BIRTHDAY_INVALID_DAY"
            );
        }
    }

    private validateBirthYear(
        year?: number
    ): void {

        if (
            year === undefined
        ) {
            return;
        }

        if (
            !Number.isInteger(year) ||
            year < 1 ||
            year > 9999
        ) {
            throw new Error(
                "BIRTHDAY_INVALID_YEAR"
            );
        }
    }

    private validateTimezone(
        timezone: string
    ): void {

        try {

            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        timezone
                }
            ).format();

        } catch {

            throw new Error(
                "BIRTHDAY_INVALID_TIMEZONE"
            );
        }
    }

    private isUniqueConstraintError(
        error: unknown
    ): boolean {

        if (
            !error ||
            typeof error !== "object"
        ) {
            return false;
        }

        const candidate =
            error as {
                code?: unknown;
            };

        return (
            candidate.code ===
            "P2002"
        );
    }
}

END FILE: src/plugins/birthday/services/BirthdayService.ts
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
