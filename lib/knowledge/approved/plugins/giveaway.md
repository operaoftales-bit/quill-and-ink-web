QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:23:39.353Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/giveaway
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
- This export is scoped to: src/plugins/giveaway

EXPORT SUMMARY
================================================================================
Files exported: 3
Files excluded or skipped: 0
Original bytes in exported files: 93117
Bytes after redaction: 89788
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/giveaway/commands/GiveawayCommand.ts
00002. src/plugins/giveaway/index.ts
00003. src/plugins/giveaway/services/GiveawayService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/giveaway/commands/GiveawayCommand.ts
--------------------------------------------------------------------------------
Original size: 29420 bytes
Exported size: 28539 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
premium: True

import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    Role,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

import { PrismaService } from "../../../core/database/PrismaService.js";
import { BotClient } from "../../../core/client/BotClient.js";
import { GiveawayService } from "../services/GiveawayService.js";

function parseDuration(value: string): number {
    const match =
        value
            .trim()
            .toLowerCase()
            .match(/^(\d+)\s*(s|m|h|d|w)$/);

    if (!match) {
        throw new Error(
            "Invalid duration. Use formats such as `30s`, `10m`, `2h`, `3d`, or `1w`."
        );
    }

    const amount = Number(match[1]);
    const unit = match[2];

    if (
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {
        throw new Error(
            "Duration must contain a positive whole number."
        );
    }

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000
    };

    const duration =
        amount * multipliers[unit];

    const minimumDuration =
        10 * 1000;

    const maximumDuration =
        30 * 24 * 60 * 60 * 1000;

    if (duration < minimumDuration) {
        throw new Error(
            "Giveaway duration must be at least 10 seconds."
        );
    }

    if (duration > maximumDuration) {
        throw new Error(
            "Giveaway duration cannot exceed 30 days."
        );
    }

    return duration;
}

export const GiveawayCommand = {
    data:
        new SlashCommandBuilder()
            .setName("giveaway")
            .setDescription(
                "Create and manage giveaways."
            )

            // =========================
            // START
            // =========================
            .addSubcommand(
                subcommand =>
                    subcommand
                        .setName("start")
                        .setDescription(
                            "Start a giveaway in this channel."
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("name")
                                    .setDescription(
                                        "Name of the giveaway."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(100)
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("text")
                                    .setDescription(
                                        "The text shown in the giveaway."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(2000)
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("prize")
                                    .setDescription(
                                        "The prize being given away."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(1000)
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("duration")
                                    .setDescription(
                                        "Duration, for example 30m, 2h, or 3d."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(10)
                        )

                        .addIntegerOption(
                            option =>
                                option
                                    .setName("winners")
                                    .setDescription(
                                        "Number of winners."
                                    )
                                    .setRequired(true)
                                    .setMinValue(1)
                                    .setMaxValue(10)
                        )
            )

            // =========================
            // CONFIG
            // =========================
            .addSubcommandGroup(
                group =>
                    group
                        .setName("config")
                        .setDescription(
                            "Configure server-wide giveaway entry bonuses."
                        )

                        // LEVEL
                        .addSubcommand(
                            subcommand =>
                                subcommand
                                    .setName("level")
                                    .setDescription(
                                        "Add or update a server-wide level bonus."
                                    )

                                    .addIntegerOption(
                                        option =>
                                            option
                                                .setName("level")
                                                .setDescription(
                                                    "Minimum level required."
                                                )
                                                .setRequired(true)
                                                .setMinValue(1)
                                                .setMaxValue(1000000)
                                    )

                                    .addIntegerOption(
                                        option =>
                                            option
                                                .setName("entries")
                                                .setDescription(
                                                    "Bonus entries granted at this level."
                                                )
                                                .setRequired(true)
                                                .setMinValue(0)
                                                .setMaxValue(1000000)
                                    )
                        )

                        // ROLE
                        .addSubcommand(
                            subcommand =>
                                subcommand
                                    .setName("role")
                                    .setDescription(
                                        "Add or update a server-wide role bonus."
                                    )

                                    .addRoleOption(
                                        option =>
                                            option
                                                .setName("role")
                                                .setDescription(
                                                    "Role receiving bonus entries."
                                                )
                                                .setRequired(true)
                                    )

                                    .addIntegerOption(
                                        option =>
                                            option
                                                .setName("entries")
                                                .setDescription(
                                                    "Bonus entries granted by this role."
                                                )
                                                .setRequired(true)
                                                .setMinValue(0)
                                                .setMaxValue(1000000)
                                    )
                        )

                        // REMOVE LEVEL
                        .addSubcommand(
                            subcommand =>
                                subcommand
                                    .setName("remove-level")
                                    .setDescription(
                                        "Remove a server-wide level bonus."
                                    )

                                    .addIntegerOption(
                                        option =>
                                            option
                                                .setName("level")
                                                .setDescription(
                                                    "Level bonus to remove."
                                                )
                                                .setRequired(true)
                                                .setMinValue(1)
                                                .setMaxValue(1000000)
                                    )
                        )

                        // REMOVE ROLE
                        .addSubcommand(
                            subcommand =>
                                subcommand
                                    .setName("remove-role")
                                    .setDescription(
                                        "Remove a server-wide role bonus."
                                    )

                                    .addRoleOption(
                                        option =>
                                            option
                                                .setName("role")
                                                .setDescription(
                                                    "Role bonus to remove."
                                                )
                                                .setRequired(true)
                                    )
                        )

                        // VIEW
                        .addSubcommand(
                            subcommand =>
                                subcommand
                                    .setName("view")
                                    .setDescription(
                                        "View the server-wide giveaway configuration."
                                    )
                        )
            )

            // =========================
            // CANCEL
            // =========================
            .addSubcommand(
                subcommand =>
                    subcommand
                        .setName("cancel")
                        .setDescription(
                            "Cancel an active giveaway."
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("giveaway")
                                    .setDescription(
                                        "Giveaway ID."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(100)
                        )
            )

            // =========================
            // REROLL
            // =========================
            .addSubcommand(
                subcommand =>
                    subcommand
                        .setName("reroll")
                        .setDescription(
                            "Reroll a winner from the giveaway's top 10 finalists."
                        )

                        .addStringOption(
                            option =>
                                option
                                    .setName("giveaway")
                                    .setDescription(
                                        "Giveaway ID."
                                    )
                                    .setRequired(true)
                                    .setMaxLength(100)
                        )

                        .addIntegerOption(
                            option =>
                                option
                                    .setName("winner")
                                    .setDescription(
                                        "Winner number to reroll."
                                    )
                                    .setRequired(true)
                                    .setMinValue(1)
                                    .setMaxValue(10)
                        )
            ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        // =========================
        // SERVER CHECK
        // =========================

        if (!interaction.guild) {
            await interaction.reply({
                content:
                    "Giveaways can only be used inside a server.",
                ephemeral: true
            });

            return;
        }

        // =========================
        // DATABASE
        // =========================

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {
            await interaction.reply({
                content:
                    "The giveaway database service is unavailable.",
                ephemeral: true
            });

            return;
        }

        const service =
            new GiveawayService(database);

        const subcommandGroup =
            interaction.options.getSubcommandGroup(false);

        const subcommand =
            interaction.options.getSubcommand();

        // =========================
        // PERMISSION HELPER
        // =========================

        const requireManageGuild =
            async (): Promise<boolean> => {

                if (
                    !interaction.memberPermissions?.has(
                        PermissionFlagsBits.ManageGuild
                    )
                ) {
                    await interaction.reply({
                        content:
                            "You need the **Manage Server** permission to use this giveaway management command.",
                        ephemeral: true
                    });

                    return false;
                }

                return true;
            };

        // =========================
        // START
        // =========================

        if (subcommand === "start") {

            if (
                !interaction.channel ||
                !interaction.channel.isTextBased() ||
                interaction.channel.isDMBased()
            ) {
                await interaction.reply({
                    content:
                        "Giveaways must be started in a server text channel.",
                    ephemeral: true
                });

                return;
            }

            if (!interaction.channel.isSendable()) {
                await interaction.reply({
                    content:
                        "I cannot send messages in this channel.",
                    ephemeral: true
                });

                return;
            }

            const name =
                interaction.options.getString(
                    "name",
                    true
                );

            const text =
                interaction.options.getString(
                    "text",
                    true
                );

            const prize =
                interaction.options.getString(
                    "prize",
                    true
                );

            const duration =
                interaction.options.getString(
                    "duration",
                    true
                );

            const winnerCount =
                interaction.options.getInteger(
                    "winners",
                    true
                );

            let durationMs: number;

            try {
                durationMs =
                    parseDuration(duration);
            } catch (error) {
                await interaction.reply({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Invalid duration.",
                    ephemeral: true
                });

                return;
            }

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                const giveaway =
                    await service.createGiveaway(
                        interaction.channel as TextChannel,
                        interaction.user.id,
                        name,
                        text,
                        prize,
                        durationMs,
                        winnerCount
                    );

                await interaction.editReply({
                    content:
                        `🎉 Giveaway started successfully!\n\n` +
                        `**${giveaway.name}**\n` +
                        `Giveaway ID: \`${giveaway.id}\``
                });

            } catch (error) {

                await interaction.editReply({
                    content:
                        error instanceof Error
                            ? `Failed to start the giveaway: ${error.message}`
                            : "Failed to start the giveaway."
                });
            }

            return;
        }

        // =========================
        // CONFIG
        // =========================

        if (subcommandGroup === "config") {

            if (!(await requireManageGuild())) {
                return;
            }

            // LEVEL
            if (subcommand === "level") {

                const level =
                    interaction.options.getInteger(
                        "level",
                        true
                    );

                const entries =
                    interaction.options.getInteger(
                        "entries",
                        true
                    );

                try {

                    await service.setConfigLevelBonus(
                        interaction.guild.id,
                        level,
                        entries
                    );

                    await interaction.reply({
                        content:
                            `✅ Level **${level}** now grants **+${entries}** bonus entries for future giveaways in this server.`,
                        ephemeral: true
                    });

                } catch (error) {

                    await interaction.reply({
                        content:
                            error instanceof Error
                                ? error.message
                                : "Failed to configure the level bonus.",
                        ephemeral: true
                    });
                }

                return;
            }

            // ROLE
            if (subcommand === "role") {

                const role =
                    interaction.options.getRole(
                        "role",
                        true
                    ) as Role;

                const entries =
                    interaction.options.getInteger(
                        "entries",
                        true
                    );

                try {

                    await service.setConfigRoleBonus(
                        interaction.guild.id,
                        role.id,
                        entries
                    );

                    await interaction.reply({
                        content:
                            `✅ ${role} now grants **+${entries}** bonus entries for future giveaways in this server.`,

                        ephemeral: true,

                        allowedMentions: {
                            roles: []
                        }
                    });

                } catch (error) {

                    await interaction.reply({
                        content:
                            error instanceof Error
                                ? error.message
                                : "Failed to configure the role bonus.",
                        ephemeral: true
                    });
                }

                return;
            }

            // REMOVE LEVEL
            if (subcommand === "remove-level") {

                const level =
                    interaction.options.getInteger(
                        "level",
                        true
                    );

                try {

                    await service.removeConfigLevelBonus(
                        interaction.guild.id,
                        level
                    );

                    await interaction.reply({
                        content:
                            `✅ Removed the server-wide level **${level}** bonus.`,
                        ephemeral: true
                    });

                } catch (error) {

                    await interaction.reply({
                        content:
                            error instanceof Error
                                ? error.message
                                : "Failed to remove the level bonus.",
                        ephemeral: true
                    });
                }

                return;
            }

            // REMOVE ROLE
            if (subcommand === "remove-role") {

                const role =
                    interaction.options.getRole(
                        "role",
                        true
                    ) as Role;

                try {

                    await service.removeConfigRoleBonus(
                        interaction.guild.id,
                        role.id
                    );

                    await interaction.reply({
                        content:
                            `✅ Removed the server-wide ${role} bonus.`,

                        ephemeral: true,

                        allowedMentions: {
                            roles: []
                        }
                    });

                } catch (error) {

                    await interaction.reply({
                        content:
                            error instanceof Error
                                ? error.message
                                : "Failed to remove the role bonus.",
                        ephemeral: true
                    });
                }

                return;
            }

            // VIEW
            if (subcommand === "view") {

                try {

                    const configuration =
                        await service.getGiveawayConfig(
                            interaction.guild.id
                        );

                    if (!configuration) {
                        await interaction.reply({
                            content:
                                "**Giveaway Configuration**\n\n" +
                                "No server-wide giveaway bonuses are configured yet.",
                            ephemeral: true
                        });

                        return;
                    }

                    const levelText =
                        configuration.levelBonuses.length
                            ? configuration.levelBonuses
                                .map(
                                    bonus =>
                                        `Level ${bonus.level}: +${bonus.bonusEntries}`
                                )
                                .join("\n")
                            : "None";

                    const roleText =
                        configuration.roleBonuses.length
                            ? configuration.roleBonuses
                                .map(
                                    bonus =>
                                        `<@&${bonus.roleId}>: +${bonus.bonusEntries}`
                                )
                                .join("\n")
                            : "None";

                    await interaction.reply({
                        content:
                            `**Giveaway Configuration**\n\n` +
                            `These bonuses are used when a **new giveaway is created**. Existing giveaways keep their original configuration snapshot.\n\n` +
                            `**Level bonuses**\n${levelText}\n\n` +
                            `**Role bonuses**\n${roleText}`,

                        ephemeral: true,

                        allowedMentions: {
                            roles: []
                        }
                    });

                } catch (error) {

                    await interaction.reply({
                        content:
                            error instanceof Error
                                ? error.message
                                : "Failed to view the giveaway configuration.",
                        ephemeral: true
                    });
                }

                return;
            }

            return;
        }

        // =========================
        // CANCEL
        // =========================

        if (subcommand === "cancel") {

            if (!(await requireManageGuild())) {
                return;
            }

            const giveawayId =
                interaction.options.getString(
                    "giveaway",
                    true
                );

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                await service.cancelGiveaway(
                    interaction.guild,
                    giveawayId
                );

                await interaction.editReply({
                    content:
                        "❌ Giveaway cancelled successfully."
                });

            } catch (error) {

                await interaction.editReply({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Failed to cancel the giveaway."
                });
            }

            return;
        }

        // =========================
        // REROLL
        // =========================

        if (subcommand === "reroll") {

            if (!(await requireManageGuild())) {
                return;
            }

            const giveawayId =
                interaction.options.getString(
                    "giveaway",
                    true
                );

            const winnerNumber =
                interaction.options.getInteger(
                    "winner",
                    true
                );

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                const newWinner =
                    await service.rerollWinner(
                        interaction.guild,
                        giveawayId,
                        winnerNumber
                    );

                await interaction.editReply({
                    content:
                        `🔄 Winner #${winnerNumber} has been rerolled successfully.\n\n` +
                        `New winner: <@${newWinner}>`
                });

            } catch (error) {

                await interaction.editReply({
                    content:
                        error instanceof Error
                            ? error.message
                            : "Failed to reroll the winner."
                });
            }

            return;
        }

        // =========================
        // FALLBACK
        // =========================

        await interaction.reply({
            content:
                "Unknown giveaway command.",
            ephemeral: true
        });
    }
};


END FILE: src/plugins/giveaway/commands/GiveawayCommand.ts
================================================================================

FILE: src/plugins/giveaway/index.ts
--------------------------------------------------------------------------------
Original size: 17589 bytes
Exported size: 16929 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ButtonInteraction,
    EmbedBuilder
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";

import { GiveawayCommand } from "./commands/GiveawayCommand.js";
import { GiveawayService } from "./services/GiveawayService.js";

export class GiveawayPlugin implements Plugin {

    readonly metadata = {
        id:
            "giveaway",

        name:
            "Giveaway",

        version:
            "1.0.0",

        description:
            "Persistent giveaways with weighted entries, finalists, winners and rerolls."
    };

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "Registering Giveaway Plugin"
        );

        /*
         * Giveaway is a Premium plugin.
         *
         * Command entitlement enforcement is handled
         * by the central command access system.
         */
        context.commands.registerCommand({
            ...GiveawayCommand,
            access: "premium" as const
        });

        /*
         * Giveaway buttons are also Premium.
         *
         * Interaction entitlement enforcement is handled
         * by the central interaction access system.
         */
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
                        "giveaway:"
                    )
                ) {
                    return;
                }

                try {

                    await this.handleButton(
                        context,
                        interaction
                    );

                } catch (error) {

                    context.logger.error(
                        "[Giveaway] Unhandled button interaction error.",
                        error
                    );

                    /*
                     * Final safety boundary for unexpected
                     * errors that were not handled inside
                     * the individual interaction flow.
                     */
                    if (
                        !interaction.replied &&
                        !interaction.deferred
                    ) {

                        try {

                            await interaction.reply({
                                content:
                                    "Something went wrong while processing this giveaway.",
                                ephemeral: true
                            });

                        } catch (replyError) {

                            context.logger.error(
                                "[Giveaway] Failed to send interaction error response.",
                                replyError
                            );
                        }
                    }
                }
            },
            "premium"
        );

        /*
         * =========================
         * AUTOMATIC FINALIZATION
         * =========================
         *
         * While the bot is running, periodically
         * check for giveaways whose end time has passed.
         *
         * This is an internal system task and does not
         * depend on an incoming user interaction.
         */
        context.setInterval(
            () => {

                void this.finalizeExpiredGiveaways(
                    context
                );

            },
            15_000
        );

        context.logger.info(
            "Giveaway Plugin registered successfully"
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Giveaway Plugin loaded"
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        context.logger.info(
            "Giveaway Plugin unloaded"
        );
    }

    private async handleButton(
        context: PluginContext,
        interaction: ButtonInteraction
    ): Promise<void> {

        if (
            !interaction.guild
        ) {
            return;
        }

        const parts =
            interaction.customId.split(
                ":"
            );

        /*
         * Expected formats:
         *
         * giveaway:join:<giveawayId>
         * giveaway:entries:<giveawayId>:<page>
         * giveaway:entries-prev:<giveawayId>:<page>
         * giveaway:entries-next:<giveawayId>:<page>
         */
        if (
            parts[0] !== "giveaway"
        ) {
            return;
        }

        const action =
            parts[1];

        const giveawayId =
            parts[2];

        if (
            !action ||
            !giveawayId
        ) {

            context.logger.warn(
                `[Giveaway] Ignoring malformed component ID: ${interaction.customId}`
            );

            return;
        }

        /*
         * Only handle actions that belong to this plugin.
         *
         * This prevents arbitrary giveaway:* component IDs
         * from reaching the service layer.
         */
        if (
            action !== "join" &&
            action !== "entries" &&
            action !== "entries-prev" &&
            action !== "entries-next"
        ) {
            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            context.logger.error(
                "[Giveaway] Database service is unavailable."
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content:
                        "The giveaway system is temporarily unavailable.",
                    ephemeral: true
                });
            }

            return;
        }

        const service =
            new GiveawayService(
                database
            );

        /*
         * =========================
         * JOIN
         * =========================
         */

        if (
            action === "join"
        ) {

            await interaction.deferReply({
                ephemeral: true
            });

            try {

                const result =
                    await service.joinGiveaway(
                        interaction.guild.id,
                        giveawayId,
                        interaction.user.id
                    );

                /*
                 * Recalculate the giveaway and refresh
                 * its public message so participant and
                 * entry totals update immediately.
                 */
                await service.getEntries(
                    interaction.guild,
                    giveawayId,
                    1
                );

                await interaction.editReply({
                    content:
                        result.message
                });

            } catch (error) {

                const message =
                    error instanceof Error
                        ? error.message
                        : "You could not join this giveaway.";

                await interaction.editReply({
                    content:
                        message
                });

                context.logger.warn(
                    `[Giveaway] Join failed for giveaway ${giveawayId} in guild ${interaction.guild.id}.`
                );
            }

            return;
        }

        /*
         * =========================
         * ENTRIES
         * =========================
         */

        if (
            action === "entries"
        ) {

            const page =
                this.parsePage(
                    parts[3]
                );

            await this.showEntries(
                context,
                interaction,
                service,
                giveawayId,
                page
            );

            return;
        }

        /*
         * =========================
         * ENTRY PAGINATION
         * =========================
         */

        if (
            action === "entries-prev" ||
            action === "entries-next"
        ) {

            const page =
                this.parsePage(
                    parts[3]
                );

            const targetPage =
                action === "entries-prev"
                    ? Math.max(
                        1,
                        page - 1
                    )
                    : page + 1;

            await this.showEntries(
                context,
                interaction,
                service,
                giveawayId,
                targetPage
            );
        }
    }

    private parsePage(
        value: string | undefined
    ): number {

        if (
            !value
        ) {
            return 1;
        }

        const page =
            Number(
                value
            );

        if (
            !Number.isInteger(page) ||
            page < 1
        ) {
            return 1;
        }

        return page;
    }

    private async showEntries(
        context: PluginContext,
        interaction: ButtonInteraction,
        service: GiveawayService,
        giveawayId: string,
        page: number
    ): Promise<void> {

        if (
            !interaction.guild
        ) {
            return;
        }

        try {

            const result =
                await service.getEntries(
                    interaction.guild,
                    giveawayId,
                    page
                );

            const description =
                result.entries.length > 0
                    ? result.entries
                        .map(
                            (entry, index) =>
                                `${(
                                    (result.page - 1) *
                                    10
                                ) + index + 1}. <@${entry.discordUserId}> — **${entry.effectiveEntries}** entries`
                        )
                        .join("\n")
                    : "No participants have entered this giveaway yet.";

            const embed =
                new EmbedBuilder()
                    .setColor(
                        0xC9A227
                    )
                    .setAuthor({
                        name:
                            "GIVEAWAY • ENTRIES"
                    })
                    .setTitle(
                        "Participant Entries"
                    )
                    .setDescription(
                        description
                    )
                    .addFields(
                        {
                            name:
                                "Participants",
                            value:
                                String(
                                    result.totalParticipants
                                ),
                            inline: true
                        },
                        {
                            name:
                                "Total Entries",
                            value:
                                String(
                                    result.totalEntries
                                ),
                            inline: true
                        },
                        {
                            name:
                                "Page",
                            value:
                                `${result.page}/${result.totalPages}`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Giveaways"
                    });

            /*
             * Previous and Next always receive different
             * custom IDs, even when only one page exists.
             *
             * Discord requires every component custom_id
             * in the same message to be unique.
             */
            const components = [
                {
                    type: 1 as const,
                    components: [
                        {
                            type: 2 as const,
                            custom_id:
                                `giveaway:entries-prev:${giveawayId}:${result.page}`,
                            label:
                                "Previous",
                            style:
                                2 as const,
                            disabled:
                                result.page <= 1
                        },
                        {
                            type: 2 as const,
                            custom_id:
                                `giveaway:entries-next:${giveawayId}:${result.page}`,
                            label:
                                "Next",
                            style:
                                2 as const,
                            disabled:
                                result.page >=
                                result.totalPages
                        }
                    ]
                }
            ];

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.editReply({
                    embeds: [
                        embed
                    ],
                    components
                });

            } else {

                await interaction.reply({
                    embeds: [
                        embed
                    ],
                    components,
                    ephemeral: true
                });
            }

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to load giveaway entries.";

            context.logger.warn(
                `[Giveaway] Failed to load entries for giveaway ${giveawayId} in guild ${interaction.guild.id}: ${message}`
            );

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.editReply({
                    content:
                        message,
                    embeds: [],
                    components: []
                });

            } else {

                await interaction.reply({
                    content:
                        message,
                    ephemeral: true
                });
            }
        }
    }

    private async finalizeExpiredGiveaways(
        context: PluginContext
    ): Promise<void> {

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            context.logger.error(
                "[Giveaway] Database service is unavailable."
            );

            return;
        }

        const service =
            new GiveawayService(
                database
            );

        try {

            const expired =
                await service.getExpiredGiveaways();

            if (
                expired.length === 0
            ) {
                return;
            }

            for (
                const giveaway
                of expired
            ) {

                const guild =
                    context.client.guilds.cache.get(
                        giveaway.guildId
                    );

                if (!guild) {

                    context.logger.warn(
                        `[Giveaway] Could not finalize giveaway ${giveaway.id}: guild ${giveaway.guildId} is not cached.`
                    );

                    continue;
                }

                try {

                    await service.finalizeGiveaway(
                        guild,
                        giveaway.id
                    );

                    context.logger.info(
                        `[Giveaway] Finalized giveaway ${giveaway.id} in ${guild.id}.`
                    );

                } catch (error) {

                    context.logger.error(
                        `[Giveaway] Failed to finalize giveaway ${giveaway.id} in ${guild.id}.`,
                        error
                    );
                }
            }

        } catch (error) {

            context.logger.error(
                "[Giveaway] Failed to check expired giveaways.",
                error
            );
        }
    }
}


END FILE: src/plugins/giveaway/index.ts
================================================================================

FILE: src/plugins/giveaway/services/GiveawayService.ts
--------------------------------------------------------------------------------
Original size: 46108 bytes
Exported size: 44320 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Guild,
    TextChannel
} from "discord.js";

import { PrismaService } from "../../../core/database/PrismaService.js";

const GIVEAWAY_ACCENT =
    0xC9A227;

const GIVEAWAY_FOOTER =
    "Quill & Ink • Giveaways";

export class GiveawayService {

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * CREATE GIVEAWAY
     * =========================
     */

    async createGiveaway(
        channel: TextChannel,
        hostId: string,
        name: string,
        text: string,
        prize: string,
        durationMs: number,
        winnerCount: number
    ) {

        const endsAt =
            new Date(
                Date.now() + durationMs
            );

        /*
         * Snapshot the current server-wide
         * configuration into this giveaway.
         *
         * Future configuration changes do not
         * affect an existing giveaway.
         */

        const configuration =
            await this.database.db.giveawayConfig.findUnique({
                where: {
                    guildId: channel.guild.id
                },
                include: {
                    roleBonuses: true,
                    levelBonuses: true
                }
            });

        const safeWinnerCount =
            Math.min(
                Math.max(
                    winnerCount,
                    1
                ),
                10
            );

        const giveaway =
            await this.database.db.giveaway.create({
                data: {
                    guildId: channel.guild.id,
                    channelId: channel.id,
                    messageId: "",
                    hostId,
                    name,
                    text,
                    reward: prize,
                    winnerCount: safeWinnerCount,
                    endsAt,
                    status: "ACTIVE"
                }
            });

        try {

            /*
             * Snapshot server-wide level bonuses.
             */

            if (
                configuration?.levelBonuses.length
            ) {

                await this.database.db.giveawayLevelBonus.createMany({
                    data:
                        configuration.levelBonuses.map(
                            bonus => ({
                                giveawayId:
                                    giveaway.id,
                                level:
                                    bonus.level,
                                bonusEntries:
                                    bonus.bonusEntries
                            })
                        )
                });
            }

            /*
             * Snapshot server-wide role bonuses.
             */

            if (
                configuration?.roleBonuses.length
            ) {

                await this.database.db.giveawayRoleBonus.createMany({
                    data:
                        configuration.roleBonuses.map(
                            bonus => ({
                                giveawayId:
                                    giveaway.id,
                                roleId:
                                    bonus.roleId,
                                bonusEntries:
                                    bonus.bonusEntries
                            })
                        )
                });
            }

            const embed =
                this.buildActiveEmbed(
                    name,
                    text,
                    prize,
                    safeWinnerCount,
                    endsAt,
                    0,
                    0
                );

            const message =
                await channel.send({
                    embeds: [
                        embed
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                ...this.buildButtons(
                                    giveaway.id
                                )
                            )
                    ]
                });

            const updatedGiveaway =
                await this.database.db.giveaway.update({
                    where: {
                        id: giveaway.id
                    },
                    data: {
                        messageId:
                            message.id
                    }
                });

            return updatedGiveaway;

        } catch (error) {

            /*
             * GiveawayRoleBonus and GiveawayLevelBonus
             * are cascade-linked to the giveaway.
             */

            await this.database.db.giveaway.delete({
                where: {
                    id: giveaway.id
                }
            }).catch(
                () => undefined
            );

            throw error;
        }
    }

    /*
     * =========================
     * JOIN
     * =========================
     */

    async joinGiveaway(
        guildId: string,
        giveawayId: string,
        discordUserId: string
    ): Promise<{
        joined: boolean;
        message: string;
    }> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId
                }
            });

        if (!giveaway) {
            throw new Error(
                "That giveaway could not be found."
            );
        }

        if (
            giveaway.status !== "ACTIVE"
        ) {
            return {
                joined: false,
                message:
                    giveaway.status === "CANCELLED"
                        ? "This giveaway has been cancelled."
                        : "This giveaway has already ended."
            };
        }

        if (
            giveaway.endsAt.getTime() <=
            Date.now()
        ) {
            return {
                joined: false,
                message:
                    "This giveaway has ended."
            };
        }

        const existing =
            await this.database.db.giveawayEntry.findUnique({
                where: {
                    giveawayId_discordUserId: {
                        giveawayId,
                        discordUserId
                    }
                }
            });

        if (existing) {
            return {
                joined: false,
                message:
                    "You are already entered in this giveaway."
            };
        }

        await this.database.db.giveawayEntry.create({
            data: {
                giveawayId,
                discordUserId,
                baseEntries: 1,
                bonusEntries: 0,
                effectiveEntries: 1
            }
        });

        /*
         * Entry bonuses are recalculated by the plugin
         * immediately after a successful join.
         */

        return {
            joined: true,
            message:
                "You have been entered into the giveaway."
        };
    }

    /*
     * =========================
     * GET ENTRIES
     * =========================
     */

    async getEntries(
        guild: Guild,
        giveawayId: string,
        page: number
    ) {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id
                }
            });

        if (!giveaway) {
            throw new Error(
                "That giveaway could not be found."
            );
        }

        if (
            giveaway.status === "ACTIVE"
        ) {
            await this.recalculateEntries(
                guild,
                giveawayId
            );

            await this.refreshActiveGiveawayMessage(
                guild,
                giveawayId
            );
        }

        const entries =
            await this.database.db.giveawayEntry.findMany({
                where: {
                    giveawayId
                },
                orderBy: [
                    {
                        effectiveEntries: "desc"
                    },
                    {
                        joinedAt: "asc"
                    }
                ]
            });

        const totalParticipants =
            entries.length;

        const totalEntries =
            entries.reduce(
                (sum, entry) =>
                    sum + entry.effectiveEntries,
                0
            );

        const perPage =
            10;

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    totalParticipants /
                    perPage
                )
            );

        const safePage =
            Math.min(
                Math.max(page, 1),
                totalPages
            );

        const start =
            (safePage - 1) *
            perPage;

        const pageEntries =
            entries.slice(
                start,
                start + perPage
            );

        return {
            giveaway,
            entries: pageEntries,
            page: safePage,
            totalPages,
            totalParticipants,
            totalEntries
        };
    }

    /*
     * =========================
     * RECALCULATE ENTRIES
     * =========================
     */

    async recalculateEntries(
        guild: Guild,
        giveawayId: string
    ): Promise<void> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id
                },
                include: {
                    roleBonuses: true,
                    levelBonuses: true
                }
            });

        if (!giveaway) {
            throw new Error(
                "That giveaway could not be found."
            );
        }

        const entries =
            await this.database.db.giveawayEntry.findMany({
                where: {
                    giveawayId
                }
            });

        if (!entries.length) {
            return;
        }

        const userIds =
            entries.map(
                entry =>
                    entry.discordUserId
            );

        const profiles =
            await this.database.db.userProfile.findMany({
                where: {
                    guildId: guild.id,
                    discordId: {
                        in: userIds
                    }
                }
            });

        const profileMap =
            new Map(
                profiles.map(
                    profile => [
                        profile.discordId,
                        profile
                    ]
                )
            );

        const members =
            await Promise.all(
                userIds.map(
                    async userId =>
                        guild.members
                            .fetch(userId)
                            .catch(
                                () => null
                            )
                )
            );

        const memberMap =
            new Map(
                members
                    .filter(
                        (
                            member
                        ): member is NonNullable<typeof member> =>
                            member !== null
                    )
                    .map(
                        member => [
                            member.id,
                            member
                        ]
                    )
            );

        for (const entry of entries) {

            const member =
                memberMap.get(
                    entry.discordUserId
                );

            const profile =
                profileMap.get(
                    entry.discordUserId
                );

            let roleBonus =
                0;

            /*
             * All matching role bonuses stack.
             */

            for (
                const configuredRole
                of giveaway.roleBonuses
            ) {

                if (
                    member?.roles.cache.has(
                        configuredRole.roleId
                    )
                ) {
                    roleBonus +=
                        configuredRole.bonusEntries;
                }
            }

            /*
             * Only the highest matching
             * level bonus applies.
             */

            let levelBonus =
                0;

            const level =
                profile?.level ?? 1;

            const matchingLevels =
                giveaway.levelBonuses
                    .filter(
                        configuredLevel =>
                            configuredLevel.level <=
                            level
                    )
                    .sort(
                        (a, b) =>
                            b.level -
                            a.level
                    );

            if (
                matchingLevels.length
            ) {
                levelBonus =
                    matchingLevels[0]
                        .bonusEntries;
            }

            const bonusEntries =
                roleBonus +
                levelBonus;

            const effectiveEntries =
                entry.baseEntries +
                bonusEntries;

            await this.database.db.giveawayEntry.update({
                where: {
                    id: entry.id
                },
                data: {
                    bonusEntries,
                    effectiveEntries
                }
            });
        }
    }

    /*
     * =========================
     * SERVER-WIDE CONFIGURATION
     * =========================
     */

    async setConfigLevelBonus(
        guildId: string,
        level: number,
        bonusEntries: number
    ): Promise<void> {

        const configuration =
            await this.database.db.giveawayConfig.upsert({
                where: {
                    guildId
                },
                create: {
                    guildId
                },
                update: {}
            });

        await this.database.db.giveawayConfigLevelBonus.upsert({
            where: {
                configId_level: {
                    configId:
                        configuration.id,
                    level
                }
            },
            create: {
                configId:
                    configuration.id,
                level,
                bonusEntries
            },
            update: {
                bonusEntries
            }
        });
    }

    async removeConfigLevelBonus(
        guildId: string,
        level: number
    ): Promise<void> {

        const configuration =
            await this.database.db.giveawayConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!configuration) {
            return;
        }

        await this.database.db.giveawayConfigLevelBonus.deleteMany({
            where: {
                configId:
                    configuration.id,
                level
            }
        });
    }

    async setConfigRoleBonus(
        guildId: string,
        roleId: string,
        bonusEntries: number
    ): Promise<void> {

        const configuration =
            await this.database.db.giveawayConfig.upsert({
                where: {
                    guildId
                },
                create: {
                    guildId
                },
                update: {}
            });

        await this.database.db.giveawayConfigRoleBonus.upsert({
            where: {
                configId_roleId: {
                    configId:
                        configuration.id,
                    roleId
                }
            },
            create: {
                configId:
                    configuration.id,
                roleId,
                bonusEntries
            },
            update: {
                bonusEntries
            }
        });
    }

    async removeConfigRoleBonus(
        guildId: string,
        roleId: string
    ): Promise<void> {

        const configuration =
            await this.database.db.giveawayConfig.findUnique({
                where: {
                    guildId
                }
            });

        if (!configuration) {
            return;
        }

        await this.database.db.giveawayConfigRoleBonus.deleteMany({
            where: {
                configId:
                    configuration.id,
                roleId
            }
        });
    }

    async getGiveawayConfig(
        guildId: string
    ) {

        return this.database.db.giveawayConfig.findUnique({
            where: {
                guildId
            },
            include: {
                levelBonuses: {
                    orderBy: {
                        level: "asc"
                    }
                },
                roleBonuses: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
    }

    /*
     * =========================
     * FINALIZE
     * =========================
     */

    async finalizeGiveaway(
        guild: Guild,
        giveawayId: string
    ): Promise<void> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id
                }
            });

        if (!giveaway) {
            return;
        }

        if (
            giveaway.status !== "ACTIVE"
        ) {
            return;
        }

        if (
            giveaway.endsAt.getTime() >
            Date.now()
        ) {
            return;
        }

        /*
         * Final entry calculation.
         * After finalization these values become
         * the historical entry snapshot.
         */

        await this.recalculateEntries(
            guild,
            giveawayId
        );

        const entries =
            await this.database.db.giveawayEntry.findMany({
                where: {
                    giveawayId
                },
                orderBy: [
                    {
                        effectiveEntries: "desc"
                    },
                    {
                        joinedAt: "asc"
                    }
                ]
            });

        /*
         * Only the top 10 become finalists.
         */

        const finalists =
            entries.slice(
                0,
                Math.min(
                    10,
                    entries.length
                )
            );

        await this.database.db.giveawayFinalist.deleteMany({
            where: {
                giveawayId
            }
        });

        for (
            let index = 0;
            index < finalists.length;
            index++
        ) {

            const finalist =
                finalists[index];

            await this.database.db.giveawayFinalist.create({
                data: {
                    giveawayId,
                    discordUserId:
                        finalist.discordUserId,
                    effectiveEntries:
                        finalist.effectiveEntries,
                    rank:
                        index + 1
                }
            });
        }

        /*
         * Winners are selected randomly
         * from the top 10 finalists.
         */

        const selected =
            this.selectRandomWinners(
                finalists,
                giveaway.winnerCount
            );

        await this.database.db.giveawayWinner.deleteMany({
            where: {
                giveawayId
            }
        });

        for (
            let index = 0;
            index < selected.length;
            index++
        ) {

            await this.database.db.giveawayWinner.create({
                data: {
                    giveawayId,
                    discordUserId:
                        selected[index].discordUserId,
                    winnerNumber:
                        index + 1
                }
            });
        }

        /*
         * The prize remains a manual reward.
         * No automatic prize distribution.
         */

        await this.database.db.giveawayReward.deleteMany({
            where: {
                giveawayId
            }
        });

        await this.database.db.giveawayReward.create({
            data: {
                giveawayId,
                type: "MANUAL",
                description:
                    giveaway.reward
            }
        });

        const endedGiveaway =
            await this.database.db.giveaway.update({
                where: {
                    id: giveawayId
                },
                data: {
                    status: "ENDED",
                    finalizedAt:
                        new Date()
                }
            });

        await this.publishFinalResult(
            guild,
            endedGiveaway,
            selected
        );
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    async cancelGiveaway(
        guild: Guild,
        giveawayId: string
    ): Promise<void> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id
                }
            });

        if (!giveaway) {
            throw new Error(
                "That giveaway could not be found."
            );
        }

        if (
            giveaway.status !== "ACTIVE"
        ) {
            throw new Error(
                giveaway.status === "CANCELLED"
                    ? "That giveaway has already been cancelled."
                    : "That giveaway has already ended."
            );
        }

        await this.database.db.giveaway.update({
            where: {
                id: giveawayId
            },
            data: {
                status: "CANCELLED",
                finalizedAt:
                    new Date()
            }
        });

        await this.publishCancellation(
            guild,
            giveaway
        );
    }

    /*
     * =========================
     * REROLL
     * =========================
     */

    async rerollWinner(
        guild: Guild,
        giveawayId: string,
        winnerNumber: number
    ): Promise<string> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id,
                    status: "ENDED"
                },
                include: {
                    winners: true,
                    finalists: {
                        orderBy: {
                            rank: "asc"
                        }
                    }
                }
            });

        if (!giveaway) {
            throw new Error(
                "That ended giveaway could not be found."
            );
        }

        const currentWinner =
            giveaway.winners.find(
                winner =>
                    winner.winnerNumber ===
                    winnerNumber
            );

        if (!currentWinner) {
            throw new Error(
                "That winner number does not exist."
            );
        }

        const otherWinnerIds =
            new Set(
                giveaway.winners
                    .filter(
                        winner =>
                            winner.winnerNumber !==
                            winnerNumber
                    )
                    .map(
                        winner =>
                            winner.discordUserId
                    )
            );

        const candidates =
            giveaway.finalists.filter(
                finalist =>
                    finalist.discordUserId !==
                    currentWinner.discordUserId &&
                    !otherWinnerIds.has(
                        finalist.discordUserId
                    )
            );

        if (!candidates.length) {
            throw new Error(
                "There are no other finalists available for a reroll."
            );
        }

        const replacement =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
            ];

        await this.database.db.giveawayWinner.update({
            where: {
                id: currentWinner.id
            },
            data: {
                discordUserId:
                    replacement.discordUserId,
                selectedAt:
                    new Date()
            }
        });

        await this.publishRerollResult(
            guild,
            giveaway,
            winnerNumber,
            replacement.discordUserId
        );

        return replacement.discordUserId;
    }

    /*
     * =========================
     * FIND EXPIRED GIVEAWAYS
     * =========================
     */

    async getExpiredGiveaways() {

        return this.database.db.giveaway.findMany({
            where: {
                status: "ACTIVE",
                endsAt: {
                    lte: new Date()
                }
            }
        });
    }

    /*
     * =========================
     * HELPERS
     * =========================
     */

    private selectRandomWinners<
        T extends {
            discordUserId: string;
        }
    >(
        finalists: T[],
        winnerCount: number
    ): T[] {

        const pool =
            [...finalists];

        const selected: T[] = [];

        const count =
            Math.min(
                winnerCount,
                pool.length,
                10
            );

        while (
            selected.length <
            count
        ) {

            const index =
                Math.floor(
                    Math.random() *
                    pool.length
                );

            const winner =
                pool.splice(
                    index,
                    1
                )[0];

            if (winner) {
                selected.push(
                    winner
                );
            }
        }

        return selected;
    }

    /*
     * =========================
     * ACTIVE EMBED
     * =========================
     */

    private buildActiveEmbed(
        name: string,
        text: string,
        prize: string,
        winnerCount: number,
        endsAt: Date,
        participantCount: number,
        totalEntries: number
    ): EmbedBuilder {

        const timestamp =
            Math.floor(
                endsAt.getTime() /
                1000
            );

        return new EmbedBuilder()
            .setColor(
                GIVEAWAY_ACCENT
            )
            .setAuthor({
                name:
                    "GIVEAWAY"
            })
            .setTitle(
                name
            )
            .setDescription(
                text
            )
            .addFields(
                {
                    name:
                        "Prize",
                    value:
                        prize
                },
                {
                    name:
                        "Winners",
                    value:
                        String(
                            winnerCount
                        ),
                    inline: true
                },
                {
                    name:
                        "Participants",
                    value:
                        String(
                            participantCount
                        ),
                    inline: true
                },
                {
                    name:
                        "Entries",
                    value:
                        String(
                            totalEntries
                        ),
                    inline: true
                },
                {
                    name:
                        "Ends",
                    value:
                        `<t:${timestamp}:F>\n<t:${timestamp}:R>`
                }
            )
            .setFooter({
                text:
                    GIVEAWAY_FOOTER
            })
            .setTimestamp();
    }

    /*
     * =========================
     * BUTTONS
     * =========================
     */

    private buildButtons(
        giveawayId: string
    ) {

        return [
            new ButtonBuilder()
                .setCustomId(
                    `giveaway:join:${giveawayId}`
                )
                .setLabel(
                    "Enter Giveaway"
                )
                .setStyle(
                    ButtonStyle.Primary
                ),

            new ButtonBuilder()
                .setCustomId(
                    `giveaway:entries:${giveawayId}:1`
                )
                .setLabel(
                    "View Entries"
                )
                .setStyle(
                    ButtonStyle.Secondary
                )
        ];
    }

    /*
     * =========================
     * REFRESH ACTIVE MESSAGE
     * =========================
     */

    private async refreshActiveGiveawayMessage(
        guild: Guild,
        giveawayId: string
    ): Promise<void> {

        const giveaway =
            await this.database.db.giveaway.findFirst({
                where: {
                    id: giveawayId,
                    guildId: guild.id,
                    status: "ACTIVE"
                }
            });

        if (!giveaway) {
            return;
        }

        const entries =
            await this.database.db.giveawayEntry.findMany({
                where: {
                    giveawayId
                }
            });

        const totalParticipants =
            entries.length;

        const totalEntries =
            entries.reduce(
                (sum, entry) =>
                    sum + entry.effectiveEntries,
                0
            );

        const channel =
            await guild.channels.fetch(
                giveaway.channelId
            ).catch(
                () => null
            );

        if (
            !channel ||
            channel.type !==
                ChannelType.GuildText
        ) {
            return;
        }

        const message =
            await channel.messages.fetch(
                giveaway.messageId
            ).catch(
                () => null
            );

        if (!message) {
            return;
        }

        const embed =
            this.buildActiveEmbed(
                giveaway.name,
                giveaway.text,
                giveaway.reward,
                giveaway.winnerCount,
                giveaway.endsAt,
                totalParticipants,
                totalEntries
            );

        await message.edit({
            embeds: [
                embed
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        ...this.buildButtons(
                            giveaway.id
                        )
                    )
            ]
        }).catch(
            () => undefined
        );
    }

    /*
     * =========================
     * FINAL RESULT
     * =========================
     */

    private async publishFinalResult(
        guild: Guild,
        giveaway: {
            id: string;
            channelId: string;
            messageId: string;
            name: string;
            text: string;
            reward: string;
        },
        winners: {
            discordUserId: string;
        }[]
    ): Promise<void> {

        const channel =
            await guild.channels.fetch(
                giveaway.channelId
            ).catch(
                () => null
            );

        if (
            !channel ||
            channel.type !==
                ChannelType.GuildText
        ) {
            return;
        }

        const message =
            await channel.messages.fetch(
                giveaway.messageId
            ).catch(
                () => null
            );

        const winnerMembers =
            await Promise.all(
                winners.map(
                    async winner => ({
                        winner,
                        member:
                            await guild.members
                                .fetch(
                                    winner.discordUserId
                                )
                                .catch(
                                    () => null
                                )
                    })
                )
            );

        const embed =
            new EmbedBuilder()
                .setColor(
                    GIVEAWAY_ACCENT
                )
                .setAuthor({
                    name:
                        "GIVEAWAY RESULT"
                })
                .setTitle(
                    giveaway.name
                )
                .setDescription(
                    [
                        giveaway.text,
                        "",
                        winners.length
                            ? "The giveaway has ended. Congratulations to the selected winners."
                            : "The giveaway has ended without any participants."
                    ].join("\n")
                )
                .addFields({
                    name:
                        "Prize",
                    value:
                        giveaway.reward
                })
                .setFooter({
                    text:
                        GIVEAWAY_FOOTER
                })
                .setTimestamp();

        if (winners.length) {

            const winnerLines =
                winnerMembers.map(
                    (
                        {
                            winner,
                            member
                        },
                        index
                    ) => {

                        const displayName =
                            member?.displayName ??
                            member?.user.username ??
                            winner.discordUserId;

                        return [
                            `**Winner #${index + 1}**`,
                            `<@${winner.discordUserId}>`,
                            `**${displayName}**`
                        ].join("\n");
                    }
                );

            embed.addFields({
                name:
                    "Winners",
                value:
                    winnerLines.join("\n\n")
            });

            const firstMember =
                winnerMembers[0]?.member;

            if (firstMember) {
                embed.setThumbnail(
                    firstMember.displayAvatarURL({
                        size: 256
                    })
                );
            }

            embed.addFields({
                name:
                    "Prize Claim",
                value:
                    "Winners should contact the server staff to claim their prize. The prize will be fulfilled manually."
            });

            if (message) {

                await message.edit({
                    embeds: [
                        embed
                    ],
                    components: []
                }).catch(
                    () => undefined
                );
            }

            await channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            GIVEAWAY_ACCENT
                        )
                        .setAuthor({
                            name:
                                "GIVEAWAY RESULT"
                        })
                        .setTitle(
                            giveaway.name
                        )
                        .setDescription(
                            winnerMembers
                                .map(
                                    (
                                        {
                                            winner,
                                            member
                                        },
                                        index
                                    ) => {

                                        const displayName =
                                            member?.displayName ??
                                            member?.user.username ??
                                            "Winner";

                                        return [
                                            `**Winner #${index + 1}**`,
                                            `<@${winner.discordUserId}>`,
                                            `**${displayName}**`
                                        ].join("\n");
                                    }
                                )
                                .join("\n\n")
                        )
                        .addFields({
                            name:
                                "Prize",
                            value:
                                giveaway.reward
                        })
                        .addFields({
                            name:
                                "Prize Claim",
                            value:
                                "Please contact the server staff to claim your prize."
                        })
                        .setThumbnail(
                            firstMember?.displayAvatarURL({
                                size: 256
                            }) ?? null
                        )
                        .setFooter({
                            text:
                                GIVEAWAY_FOOTER
                        })
                        .setTimestamp()
                ],
                allowedMentions: {
                    users:
                        winners.map(
                            winner =>
                                winner.discordUserId
                        ),
                    roles: []
                }
            }).catch(
                () => undefined
            );

            return;
        }

        if (message) {

            await message.edit({
                embeds: [
                    embed
                ],
                components: []
            }).catch(
                () => undefined
            );
        }
    }

    /*
     * =========================
     * CANCELLATION RESULT
     * =========================
     */

    private async publishCancellation(
        guild: Guild,
        giveaway: {
            channelId: string;
            messageId: string;
            name: string;
            text: string;
            reward: string;
        }
    ): Promise<void> {

        const channel =
            await guild.channels.fetch(
                giveaway.channelId
            ).catch(
                () => null
            );

        if (
            !channel ||
            channel.type !==
                ChannelType.GuildText
        ) {
            return;
        }

        const message =
            await channel.messages.fetch(
                giveaway.messageId
            ).catch(
                () => null
            );

        const embed =
            new EmbedBuilder()
                .setColor(
                    GIVEAWAY_ACCENT
                )
                .setAuthor({
                    name:
                        "GIVEAWAY"
                })
                .setTitle(
                    giveaway.name
                )
                .setDescription(
                    [
                        giveaway.text,
                        "",
                        "This giveaway has been cancelled."
                    ].join("\n")
                )
                .addFields({
                    name:
                        "Prize",
                    value:
                        giveaway.reward
                })
                .setFooter({
                    text:
                        GIVEAWAY_FOOTER
                })
                .setTimestamp();

        if (message) {

            await message.edit({
                embeds: [
                    embed
                ],
                components: []
            }).catch(
                () => undefined
            );
        }
    }

    /*
     * =========================
     * REROLL RESULT
     * =========================
     */

    private async publishRerollResult(
        guild: Guild,
        giveaway: {
            channelId: string;
            name: string;
            reward: string;
        },
        winnerNumber: number,
        discordUserId: string
    ): Promise<void> {

        const member =
            await guild.members
                .fetch(
                    discordUserId
                )
                .catch(
                    () => null
                );

        const displayName =
            member?.displayName ??
            member?.user.username ??
            "Winner";

        const channel =
            await guild.channels.fetch(
                giveaway.channelId
            ).catch(
                () => null
            );

        if (
            !channel ||
            channel.type !==
                ChannelType.GuildText
        ) {
            return;
        }

        const embed =
            new EmbedBuilder()
                .setColor(
                    GIVEAWAY_ACCENT
                )
                .setAuthor({
                    name:
                        "GIVEAWAY REROLL"
                })
                .setTitle(
                    giveaway.name
                )
                .setDescription(
                    [
                        `Winner #${winnerNumber}`,
                        "",
                        `<@${discordUserId}>`,
                        `**${displayName}**`,
                        "",
                        "The winner has been replaced through a reroll."
                    ].join("\n")
                )
                .addFields(
                    {
                        name:
                            "Prize",
                        value:
                            giveaway.reward
                    },
                    {
                        name:
                            "Prize Claim",
                        value:
                            "Please contact the server staff to claim the prize."
                    }
                )
                .setThumbnail(
                    member?.displayAvatarURL({
                        size: 256
                    }) ?? null
                )
                .setFooter({
                    text:
                        GIVEAWAY_FOOTER
                })
                .setTimestamp();

        /*
         * Use the exact giveaway channel.
         * Do not search by guild + name because
         * multiple giveaways may share the same name.
         */

        await channel.send({
            embeds: [
                embed
            ],
            allowedMentions: {
                users: [
                    discordUserId
                ],
                roles: []
            }
        }).catch(
            () => undefined
        );
    }
}


END FILE: src/plugins/giveaway/services/GiveawayService.ts
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
