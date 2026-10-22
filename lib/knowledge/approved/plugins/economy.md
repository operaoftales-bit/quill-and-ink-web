QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:21:49.155Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/economy
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
- This export is scoped to: src/plugins/economy

EXPORT SUMMARY
================================================================================
Files exported: 12
Files excluded or skipped: 0
Original bytes in exported files: 306654
Bytes after redaction: 295603
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/economy/commands/CardCommand.ts
00002. src/plugins/economy/commands/DailyCommand.ts
00003. src/plugins/economy/commands/DailyConfigCommand.ts
00004. src/plugins/economy/commands/EconomyCommand.ts
00005. src/plugins/economy/commands/GiveCommand.ts
00006. src/plugins/economy/commands/LockerCommand.ts
00007. src/plugins/economy/commands/LockerDepositCommand.ts
00008. src/plugins/economy/commands/LockerWithdrawCommand.ts
00009. src/plugins/economy/commands/PayCommand.ts
00010. src/plugins/economy/EconomyPlugin.ts
00011. src/plugins/economy/plugin.json
00012. src/plugins/economy/services/EconomyAccountService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/economy/commands/CardCommand.ts
--------------------------------------------------------------------------------
Original size: 6925 bytes
Exported size: 6665 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";
import { EconomyAccountService } from "../services/EconomyAccountService.js";

export const CardCommand = {

    data: new SlashCommandBuilder()
        .setName("card")
        .setDescription(
            "View and manage your Opera Card."
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
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
                    "❌ The banking service is currently unavailable.",
                flags: 64
            });

            return;
        }

        try {

            /*
             * =========================
             * ENSURE OPERA CARD
             * =========================
             */

            const accountService =
                new EconomyAccountService(
                    database
                );

            await accountService.ensureOperaCard(
                interaction.user.id
            );

            /*
             * =========================
             * GET GLOBAL CARD
             * =========================
             */

            const card =
                await database.db.operaCard.findUnique({

                    where: {
                        discordId:
                            interaction.user.id
                    }
                });

            if (!card) {

                await interaction.reply({
                    content:
                        "❌ Your Opera Card could not be created or retrieved.",
                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * GET SERVER WALLET
             * =========================
             */

            const account =
                await database.db.economyAccount.findUnique({

                    where: {
                        guildId_discordId: {

                            guildId:
                                interaction.guild.id,

                            discordId:
                                interaction.user.id
                        }
                    },

                    select: {
                        wallet:
                            true
                    }
                });

            const walletBalance =
                account?.wallet ??
                0n;

            /*
             * =========================
             * TRANSFER BUTTON
             * =========================
             */

            const transferButton =
                new ButtonBuilder()
                    .setCustomId(
                        "card_wallet_transfer"
                    )
                    .setLabel(
                        "Transfer from Wallet"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            const row =
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        transferButton
                    );

            /*
             * =========================
             * PREMIUM CARD EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(0xC9A227)
                    .setAuthor({
                        name:
                            "QUILL & INK  •  OPERA BANKING"
                    })
                    .setTitle(
                        "✦ Opera Card"
                    )
                    .setDescription(
                        `Your global Nickel reserve, **${interaction.user.displayName}**.`
                    )
                    .addFields(

                        {
                            name:
                                "💳 Card Balance",

                            value:
                                `**${card.balance.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "◇ Server Wallet",

                            value:
                                `**${walletBalance.toString()} Nickel**`,

                            inline:
                                true
                        }
                    )
                    .setFooter({
                        text:
                            `Opera Card • ${card.cardCode}`
                    });

            /*
             * =========================
             * RESPONSE
             * =========================
             */

            await interaction.reply({

                embeds: [
                    embed
                ],

                components: [
                    row
                ],

                flags: 64
            });

        } catch (error) {

            console.error(
                "[Economy] Failed to open Opera Card:",
                error
            );

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.editReply({
                    content:
                        "❌ Something went wrong while opening your Opera Card.",
                    embeds: [],
                    components: []
                });

                return;
            }

            await interaction.reply({
                content:
                    "❌ Something went wrong while opening your Opera Card.",
                flags: 64
            });
        }
    }
};

END FILE: src/plugins/economy/commands/CardCommand.ts
================================================================================

FILE: src/plugins/economy/commands/DailyCommand.ts
--------------------------------------------------------------------------------
Original size: 25344 bytes
Exported size: 24469 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

/*
 * =========================
 * DAILY QUOTES
 * =========================
 */

const DAILY_QUOTES = [
    "Every new day is another page waiting to be written.",
    "A small reward today. A stronger streak tomorrow.",
    "Consistency turns small moments into great stories.",
    "Another day, another page in your journey.",
    "Keep showing up. Your story is still being written.",
    "Fortune favours those who return.",
    "The finest journeys are built one day at a time.",
    "Another day has been added to your tale."
];

function getDailyQuote(): string {
    const index =
        Math.floor(
            Math.random() *
            DAILY_QUOTES.length
        );

    return DAILY_QUOTES[index];
}

/*
 * =========================
 * BIGINT POWER
 * =========================
 *
 * Used for MULTIPLY progression.
 */

function bigintPower(
    base: bigint,
    exponent: number
): bigint {

    if (exponent <= 0) {
        return 1n;
    }

    return base ** BigInt(exponent);
}

/*
 * =========================
 * DAILY REWARD CALCULATION
 * =========================
 */

function calculateDailyReward(
    startingReward: bigint,
    method: "ADD" | "MULTIPLY",
    increment: bigint,
    increaseDays: number,
    decreaseDays: number,
    decreaseEnabled: boolean,
    streak: number
): {
    reward: bigint;
    direction: number;
} {

    const safeIncreaseDays =
        Math.max(
            1,
            increaseDays
        );

    const safeDecreaseDays =
        Math.max(
            1,
            decreaseDays
        );

    const cycleLength =
        decreaseEnabled
            ? safeIncreaseDays + safeDecreaseDays
            : safeIncreaseDays;

    const cyclePosition =
        (streak - 1) %
        cycleLength;

    /*
     * =========================
     * INCREASING PHASE
     * =========================
     */

    if (
        cyclePosition <
        safeIncreaseDays
    ) {

        const step =
            cyclePosition;

        if (method === "MULTIPLY") {

            return {
                reward:
                    startingReward *
                    bigintPower(
                        increment,
                        step
                    ),

                direction:
                    1
            };
        }

        return {
            reward:
                startingReward +
                (
                    BigInt(step) *
                    increment
                ),

            direction:
                1
        };
    }

    /*
     * =========================
     * DECREASING PHASE
     * =========================
     */

    const decreaseStep =
        cyclePosition -
        safeIncreaseDays;

    if (method === "MULTIPLY") {

        const peakReward =
            startingReward *
            bigintPower(
                increment,
                safeIncreaseDays - 1
            );

        const divisor =
            bigintPower(
                increment,
                decreaseStep + 1
            );

        let reward =
            peakReward /
            divisor;

        /*
         * Never allow the reward to fall
         * below the configured starting reward.
         */

        if (
            reward <
            startingReward
        ) {
            reward =
                startingReward;
        }

        return {
            reward,
            direction:
                -1
        };
    }

    const peakReward =
        startingReward +
        (
            BigInt(
                safeIncreaseDays - 1
            ) *
            increment
        );

    const decreaseAmount =
        BigInt(
            decreaseStep + 1
        ) *
        increment;

    let reward =
        peakReward -
        decreaseAmount;

    if (
        reward <
        startingReward
    ) {
        reward =
            startingReward;
    }

    return {
        reward,
        direction:
            -1
    };
}

export const DailyCommand = {

    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription(
            "Claim your daily Nickel reward."
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * ACKNOWLEDGE
         * =========================
         */

        try {

            await interaction.deferReply({
                flags: 64
            });

        } catch (error) {

            console.error(
                "[Economy] Failed to acknowledge /daily interaction:",
                error
            );

            return;
        }

        /*
         * =========================
         * DATABASE
         * =========================
         */

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await interaction.editReply({
                content:
                    "❌ Database service is currently unavailable."
            });

            return;
        }

        const now =
            new Date();

        /*
         * =========================
         * PROCESS CLAIM
         * =========================
         */

        try {

            const result =
                await database.db.$transaction(
                    async tx => {

                        /*
                         * =========================
                         * SERVER CONFIGURATION
                         * =========================
                         */

                        const guildConfig =
                            await tx.guildConfig.findUnique({

                                where: {
                                    guildId:
                                        interaction.guild!.id
                                },

                                select: {

                                    dailyReward:
                                        true,

                                    dailyRewardMethod:
                                        true,

                                    dailyRewardIncrement:
                                        true,

                                    dailyRewardIncreaseDays:
                                        true,

                                    dailyRewardDecreaseDays:
                                        true,

                                    dailyRewardDecreaseEnabled:
                                        true
                                }
                            });

                        const startingReward =
                            guildConfig?.dailyReward ??
                            10n;

                        const method =
                            guildConfig?.dailyRewardMethod ??
                            "ADD";

                        const increment =
                            guildConfig?.dailyRewardIncrement ??
                            2n;

                        const increaseDays =
                            guildConfig?.dailyRewardIncreaseDays ??
                            1000;

                        const decreaseDays =
                            guildConfig?.dailyRewardDecreaseDays ??
                            1000;

                        const decreaseEnabled =
                            guildConfig?.dailyRewardDecreaseEnabled ??
                            true;

                        /*
                         * =========================
                         * ECONOMY ACCOUNT
                         * =========================
                         */

                        const account =
                            await tx.economyAccount.upsert({

                                where: {
                                    guildId_discordId: {
                                        guildId:
                                            interaction.guild!.id,

                                        discordId:
                                            interaction.user.id
                                    }
                                },

                                update: {},

                                create: {

                                    guildId:
                                        interaction.guild!.id,

                                    discordId:
                                        interaction.user.id,

                                    wallet:
                                        0n,

                                    dailyStreak:
                                        0,

                                    dailyDirection:
                                        1
                                }
                            });

                        /*
                         * =========================
                         * ALREADY CLAIMED TODAY
                         * =========================
                         */

                        if (
                            account.lastDailyAt
                        ) {

                            const lastClaim =
                                new Date(
                                    account.lastDailyAt
                                );

                            const sameDay =
                                lastClaim.getFullYear() ===
                                    now.getFullYear() &&

                                lastClaim.getMonth() ===
                                    now.getMonth() &&

                                lastClaim.getDate() ===
                                    now.getDate();

                            if (sameDay) {

                                throw new Error(
                                    "ALREADY_CLAIMED"
                                );
                            }
                        }

                        /*
                         * =========================
                         * DETERMINE STREAK
                         * =========================
                         */

                        let streak =
                            1;

                        if (
                            account.lastDailyAt
                        ) {

                            const lastClaim =
                                new Date(
                                    account.lastDailyAt
                                );

                            const currentDateStart =
                                new Date(
                                    now.getFullYear(),
                                    now.getMonth(),
                                    now.getDate()
                                );

                            const lastDateStart =
                                new Date(
                                    lastClaim.getFullYear(),
                                    lastClaim.getMonth(),
                                    lastClaim.getDate()
                                );

                            const difference =
                                currentDateStart.getTime() -
                                lastDateStart.getTime();

                            const daysSinceLastClaim =
                                Math.floor(
                                    difference /
                                    (
                                        24 *
                                        60 *
                                        60 *
                                        1000
                                    )
                                );

                            if (
                                daysSinceLastClaim ===
                                1
                            ) {

                                streak =
                                    account.dailyStreak +
                                    1;

                            } else {

                                streak =
                                    1;
                            }
                        }

                        /*
                         * =========================
                         * CALCULATE REWARD
                         * =========================
                         */

                        const {
                            reward,
                            direction
                        } =
                            calculateDailyReward(
                                startingReward,
                                method,
                                increment,
                                increaseDays,
                                decreaseDays,
                                decreaseEnabled,
                                streak
                            );

                        if (
                            reward <=
                            0n
                        ) {

                            throw new Error(
                                "INVALID_DAILY_REWARD"
                            );
                        }

                        /*
                         * =========================
                         * FUND FROM INK BANK
                         * =========================
                         *
                         * Daily rewards do not mint
                         * Nickel.
                         *
                         * Nickel moves from the
                         * server's Ink Bank reserve
                         * into the member wallet.
                         */

                        const inkBank =
                            await tx.inkBank.findUnique({

                                where: {
                                    guildId:
                                        interaction.guild!.id
                                },

                                select: {
                                    id:
                                        true,

                                    balance:
                                        true
                                }
                            });

                        if (!inkBank) {

                            throw new Error(
                                "INK_BANK_NOT_FOUND"
                            );
                        }

                        const reserveUpdate =
                            await tx.inkBank.updateMany({

                                where: {

                                    guildId:
                                        interaction.guild!.id,

                                    balance: {
                                        gte:
                                            reward
                                    }
                                },

                                data: {

                                    balance: {
                                        decrement:
                                            reward
                                    }
                                }
                            });

                        if (
                            reserveUpdate.count !==
                            1
                        ) {

                            throw new Error(
                                "INK_BANK_INSUFFICIENT"
                            );
                        }

                        /*
                         * =========================
                         * CREDIT MEMBER
                         * =========================
                         */

                        await tx.economyAccount.update({

                            where: {
                                id:
                                    account.id
                            },

                            data: {

                                wallet: {
                                    increment:
                                        reward
                                },

                                dailyStreak:
                                    streak,

                                dailyDirection:
                                    direction,

                                lastDailyAt:
                                    now
                            }
                        });

                        return {
                            reward,
                            streak
                        };
                    }
                );

            /*
             * =========================
             * PREMIUM SUCCESS EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setColor(0xC9A227)
                    .setAuthor({
                        name:
                            "QUILL & INK  •  DAILY"
                    })
                    .setTitle(
                        "✦ Your Daily Reward"
                    )
                    .setDescription(
                        `Welcome back, **${interaction.user.displayName}**.\n` +
                        `Your reward has been added to your wallet.`
                    )
                    .addFields(

                        {
                            name:
                                "🎁 Reward",

                            value:
                                `**${result.reward.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🔥 Streak",

                            value:
                                `**${result.streak} day${result.streak === 1 ? "" : "s"}**`,

                            inline:
                                true
                        }
                    )
                    .setFooter({
                        text:
                            `“${getDailyQuote()}”`
                    });

            await interaction.editReply({
                embeds: [
                    embed
                ]
            });

            console.log(
                `[Economy] ${interaction.user.tag} claimed ${result.reward.toString()} Nickel daily reward in ${interaction.guild.name}. Streak: ${result.streak}.`
            );

        } catch (error) {

            /*
             * =========================
             * ALREADY CLAIMED
             * =========================
             */

            if (
                error instanceof Error &&
                error.message ===
                    "ALREADY_CLAIMED"
            ) {

                try {

                    const account =
                        await database.db.economyAccount.findUnique({

                            where: {
                                guildId_discordId: {

                                    guildId:
                                        interaction.guild.id,

                                    discordId:
                                        interaction.user.id
                                }
                            },

                            select: {
                                dailyStreak:
                                    true
                            }
                        });

                    const currentStreak =
                        account?.dailyStreak ??
                        0;

                    const embed =
                        new EmbedBuilder()
                            .setColor(0xC9A227)
                            .setAuthor({
                                name:
                                    "QUILL & INK  •  DAILY"
                            })
                            .setTitle(
                                "✦ Already Claimed"
                            )
                            .setDescription(
                                `You've already collected today's reward, **${interaction.user.displayName}**.\n` +
                                `Come back tomorrow to continue your streak.`
                            )
                            .addFields({
                                name:
                                    "🔥 Current Streak",

                                value:
                                    `**${currentStreak} day${currentStreak === 1 ? "" : "s"}**`,

                                inline:
                                    true
                            })
                            .setFooter({
                                text:
                                    `“${getDailyQuote()}”`
                            });

                    await interaction.editReply({
                        embeds: [
                            embed
                        ]
                    });

                } catch (accountError) {

                    console.error(
                        "[Economy] Failed to load daily account after duplicate claim:",
                        accountError
                    );

                    await interaction.editReply({
                        content:
                            "⏰ You've already claimed today's daily reward. Come back tomorrow to continue your streak.",
                        embeds: []
                    });
                }

                return;
            }

            /*
             * =========================
             * KNOWN ECONOMY ERRORS
             * =========================
             */

            if (
                error instanceof Error &&
                error.message ===
                    "INK_BANK_NOT_FOUND"
            ) {

                await interaction.editReply({
                    content:
                        "❌ This server's Ink Bank is unavailable. Please contact an administrator.",
                    embeds: []
                });

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INK_BANK_INSUFFICIENT"
            ) {

                await interaction.editReply({
                    content:
                        "❌ The server's Ink Bank does not currently have enough Nickel to fund today's reward.",
                    embeds: []
                });

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INVALID_DAILY_REWARD"
            ) {

                await interaction.editReply({
                    content:
                        "❌ The server's daily reward configuration produced an invalid reward.",
                    embeds: []
                });

                return;
            }

            /*
             * =========================
             * UNKNOWN ERROR
             * =========================
             */

            console.error(
                "[Economy] Daily reward failed:",
                error
            );

            try {

                await interaction.editReply({
                    content:
                        "❌ Something went wrong while processing your daily reward.",
                    embeds: []
                });

            } catch (replyError) {

                console.error(
                    "[Economy] Failed to send daily error response:",
                    replyError
                );
            }
        }
    }
};

END FILE: src/plugins/economy/commands/DailyCommand.ts
================================================================================

FILE: src/plugins/economy/commands/DailyConfigCommand.ts
--------------------------------------------------------------------------------
Original size: 10883 bytes
Exported size: 10464 bytes
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

export const DailyConfigCommand = {

data: new SlashCommandBuilder()
    .setName("dailyconfig")
    .setDescription(
        "Configure the server's daily Nickel reward system."
    )
    .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
    )
    .addIntegerOption(
        option =>
            option
                .setName("amount")
                .setDescription(
                    "The starting amount of Nickel for the daily reward."
                )
                .setRequired(true)
                .setMinValue(1)
    )
    .addStringOption(
        option =>
            option
                .setName("method")
                .setDescription(
                    "How the daily reward changes."
                )
                .setRequired(false)
                .addChoices(
                    {
                        name: "Add",
                        value: "ADD"
                    },
                    {
                        name: "Multiply",
                        value: "MULTIPLY"
                    }
                )
    )
    .addIntegerOption(
        option =>
            option
                .setName("increment")
                .setDescription(
                    "The amount added or multiplier applied to the reward."
                )
                .setRequired(false)
                .setMinValue(1)
    )
    .addIntegerOption(
        option =>
            option
                .setName("increase_days")
                .setDescription(
                    "Number of consecutive claims in the increasing phase."
                )
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100000)
    )
    .addIntegerOption(
        option =>
            option
                .setName("decrease_days")
                .setDescription(
                    "Number of consecutive claims in the decreasing phase."
                )
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100000)
    )
    .addBooleanOption(
        option =>
            option
                .setName("decrease_enabled")
                .setDescription(
                    "Whether the reward should decrease after the increase phase."
                )
                .setRequired(false)
    ),

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

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.Administrator
        )
    ) {

        await interaction.reply({
            content:
                "❌ You must have the **Administrator** permission to configure daily rewards.",
            flags: 64
        });

        return;
    }

    const amountNumber =
        interaction.options.getInteger(
            "amount",
            true
        );

    const method =
        interaction.options.getString(
            "method"
        );

    const incrementNumber =
        interaction.options.getInteger(
            "increment"
        );

    const increaseDays =
        interaction.options.getInteger(
            "increase_days"
        );

    const decreaseDays =
        interaction.options.getInteger(
            "decrease_days"
        );

    const decreaseEnabled =
        interaction.options.getBoolean(
            "decrease_enabled"
        );

    const amount =
        BigInt(
            amountNumber
        );

    const increment =
        BigInt(
            incrementNumber ?? 2
        );

    const client =
        interaction.client as BotClient;

    const database =
        client.services.get<PrismaService>(
            "database"
        );

    if (!database) {

        await interaction.reply({
            content:
                "❌ The economy database service is currently unavailable.",
            flags: 64
        });

        return;
    }

    try {

        const previousConfig =
            await database.db.guildConfig.findUnique({

                where: {
                    guildId:
                        interaction.guild.id
                },

                select: {

                    dailyReward:
                        true,

                    dailyRewardMethod:
                        true,

                    dailyRewardIncrement:
                        true,

                    dailyRewardIncreaseDays:
                        true,

                    dailyRewardDecreaseDays:
                        true,

                    dailyRewardDecreaseEnabled:
                        true
                }
            });

        const finalMethod =
            method ??
            previousConfig?.dailyRewardMethod ??
            "ADD";

        const finalIncreaseDays =
            increaseDays ??
            previousConfig?.dailyRewardIncreaseDays ??
            1000;

        const finalDecreaseDays =
            decreaseDays ??
            previousConfig?.dailyRewardDecreaseDays ??
            1000;

        const finalDecreaseEnabled =
            decreaseEnabled ??
            previousConfig?.dailyRewardDecreaseEnabled ??
            true;

        if (
            finalMethod !== "ADD" &&
            finalMethod !== "MULTIPLY"
        ) {

            throw new Error(
                "INVALID_DAILY_REWARD_METHOD"
            );
        }

        await database.db.guildConfig.upsert({

            where: {
                guildId:
                    interaction.guild.id
            },

            update: {

                dailyReward:
                    amount,

                dailyRewardMethod:
                    finalMethod === "MULTIPLY"
                        ? "MULTIPLY"
                        : "ADD",

                dailyRewardIncrement:
                    increment,

                dailyRewardIncreaseDays:
                    finalIncreaseDays,

                dailyRewardDecreaseDays:
                    finalDecreaseDays,

                dailyRewardDecreaseEnabled:
                    finalDecreaseEnabled
            },

            create: {

                guildId:
                    interaction.guild.id,

                dailyReward:
                    amount,

                dailyRewardMethod:
                    finalMethod === "MULTIPLY"
                        ? "MULTIPLY"
                        : "ADD",

                dailyRewardIncrement:
                    increment,

                dailyRewardIncreaseDays:
                    finalIncreaseDays,

                dailyRewardDecreaseDays:
                    finalDecreaseDays,

                dailyRewardDecreaseEnabled:
                    finalDecreaseEnabled
            }
        });

        const methodDisplay =
            finalMethod === "MULTIPLY"
                ? `×${increment.toString()}`
                : `+${increment.toString()} Nickel`;

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "⚙️ Daily Reward Configuration Updated"
                )
                .setDescription(
                    "The server's daily Nickel reward configuration has been updated."
                )
                .addFields(

                    {
                        name:
                            "💰 Starting Reward",

                        value:
                            `**${amount.toString()} Nickel**`,

                        inline:
                            true
                    },

                    {
                        name:
                            "📈 Change Method",

                        value:
                            `**${finalMethod === "MULTIPLY" ? "Multiply" : "Add"}**`,

                        inline:
                            true
                    },

                    {
                        name:
                            "🔢 Change",

                        value:
                            `**${methodDisplay}**`,

                        inline:
                            true
                    },

                    {
                        name:
                            "📈 Increase Phase",

                        value:
                            `**${finalIncreaseDays} claims**`,

                        inline:
                            true
                    },

                    {
                        name:
                            "📉 Decrease Phase",

                        value:
                            finalDecreaseEnabled
                                ? `**${finalDecreaseDays} claims**`
                                : "**Disabled**",

                        inline:
                            true
                    }
                )
                .setFooter({
                    text:
                        "Quill & Ink • Economy Administration"
                })
                .setTimestamp();

        await interaction.reply({

            embeds: [
                embed
            ],

            flags: 64
        });

        console.info(
            `[Economy] ${interaction.user.tag} configured the daily reward for ${interaction.guild.name}. ` +
            `Starting: ${amount.toString()} Nickel. ` +
            `Method: ${finalMethod}. ` +
            `Increment: ${increment.toString()}. ` +
            `Increase: ${finalIncreaseDays} claims. ` +
            `Decrease: ${finalDecreaseEnabled ? `${finalDecreaseDays} claims` : "disabled"}.`
        );

    } catch (error) {

        console.error(
            "[Economy] Failed to configure daily reward:",
            error
        );

        if (
            interaction.replied ||
            interaction.deferred
        ) {

            return;
        }

        await interaction.reply({
            content:
                "❌ Something went wrong while saving the daily reward configuration.",
            flags: 64
        });
    }
}

};

END FILE: src/plugins/economy/commands/DailyConfigCommand.ts
================================================================================

FILE: src/plugins/economy/commands/EconomyCommand.ts
--------------------------------------------------------------------------------
Original size: 10019 bytes
Exported size: 9702 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

export const EconomyCommand = {

    data: new SlashCommandBuilder()
        .setName("economy")
        .setDescription(
            "Manage the Quill & Ink economy."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )
        .addSubcommandGroup(
            group =>
                group
                    .setName("earn")
                    .setDescription(
                        "Configure Nickel earning."
                    )
                    .addSubcommand(
                        subcommand =>
                            subcommand
                                .setName("nickel")
                                .setDescription(
                                    "Configure channels where members can earn Nickel."
                                )
                    )
        )
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName("reset")
                    .setDescription(
                        "Reset this server's entire Nickel economy."
                    )
        ),

    async execute(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            await interaction.reply({
                content: "❌ This command can only be used in a server.",
                flags: 64
            });
            return;
        }

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {
            await interaction.reply({
                content:
                    "❌ You need the **Manage Server** permission to configure the economy.",
                flags: 64
            });
            return;
        }

        const client = interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>("database");

        if (!database) {
            await interaction.reply({
                content:
                    "❌ Database service is currently unavailable.",
                flags: 64
            });
            return;
        }

        const subcommandGroup =
            interaction.options.getSubcommandGroup();

        const subcommand =
            interaction.options.getSubcommand();

        try {

            if (
                subcommandGroup === "earn" &&
                subcommand === "nickel"
            ) {
                await this.showPanel(
                    interaction,
                    database
                );
                return;
            }

            if (
                !subcommandGroup &&
                subcommand === "reset"
            ) {
                await this.showResetConfirmation(
                    interaction
                );
                return;
            }

        } catch (error) {

            console.error(
                "[Economy] Failed to execute economy command:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {
                await interaction.reply({
                    content:
                        "❌ Something went wrong while processing the economy command.",
                    flags: 64
                });
            }
        }
    },

    async showPanel(
        interaction: ChatInputCommandInteraction,
        database: PrismaService
    ): Promise<void> {

        const channels =
            await database.db.nickelEarningChannel.findMany({
                where: {
                    guildId: interaction.guild!.id
                },
                orderBy: {
                    createdAt: "asc"
                }
            });

        const channelList =
            channels.length > 0
                ? channels
                    .map(
                        (channel, index) =>
                            `\`${index + 1}.\` <#${channel.channelId}>`
                    )
                    .join("\n")
                : "*No Nickel earning channels are configured yet.*";

        const addButton =
            new ButtonBuilder()
                .setCustomId(
                    "economy_nickel_add"
                )
                .setLabel(
                    "Add Channel"
                )
                .setEmoji("➕")
                .setStyle(
                    ButtonStyle.Primary
                );

        const removeButton =
            new ButtonBuilder()
                .setCustomId(
                    "economy_nickel_remove"
                )
                .setLabel(
                    "Remove Channel"
                )
                .setEmoji("➖")
                .setStyle(
                    ButtonStyle.Danger
                )
                .setDisabled(
                    channels.length === 0
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    addButton,
                    removeButton
                );

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "💰 Nickel Earning Configuration"
                )
                .setDescription(
                    "Configure the channels where members can earn Nickel through message activity."
                )
                .addFields(
                    {
                        name: "📈 How It Works",
                        value:
                            "Members can earn Nickel by sending messages in the configured channels. Each member can receive an earning reward once per minute.",
                        inline: false
                    },
                    {
                        name:
                            `🪙 Earning Channels (${channels.length})`,
                        value: channelList,
                        inline: false
                    }
                )
                .setFooter({
                    text:
                        "Quill & Ink • Economy Administration"
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64
        });
    },

    async showResetConfirmation(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {

        const confirmButton =
            new ButtonBuilder()
                .setCustomId(
                    `economy_reset_confirm_${interaction.guild!.id}_${interaction.user.id}`
                )
                .setLabel(
                    "Confirm Reset"
                )
                .setEmoji("⚠️")
                .setStyle(
                    ButtonStyle.Danger
                );

        const cancelButton =
            new ButtonBuilder()
                .setCustomId(
                    `economy_reset_cancel_${interaction.guild!.id}_${interaction.user.id}`
                )
                .setLabel(
                    "Cancel"
                )
                .setStyle(
                    ButtonStyle.Secondary
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    confirmButton,
                    cancelButton
                );

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "⚠️ Reset Server Economy"
                )
                .setDescription(
                    "This will completely reset this server's **InkBank economy** and start it fresh."
                )
                .addFields(
                    {
                        name: "🗑️ What Will Be Removed",
                        value:
                            "• All member wallet Nickel\n" +
                            "• All Bank Locker balances and deposits\n" +
                            "• All departed-member economy funds\n" +
                            "• Any pending Ink return for this server\n" +
                            "• The server's current InkBank balance and allocation",
                        inline: false
                    },
                    {
                        name: "🔒 What Will Stay",
                        value:
                            "• Global QuillBank\n" +
                            "• Opera Cards\n" +
                            "• Transaction history\n" +
                            "• Economy configuration\n" +
                            "• XP, robbery progression, and other server data",
                        inline: false
                    },
                    {
                        name: "🏦 After Reset",
                        value:
                            "The server will be initialized again through the normal Banker funding process using its current member count.",
                        inline: false
                    }
                )
                .setFooter({
                    text:
                        "This action cannot be undone."
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64
        });
    }
};


END FILE: src/plugins/economy/commands/EconomyCommand.ts
================================================================================

FILE: src/plugins/economy/commands/GiveCommand.ts
--------------------------------------------------------------------------------
Original size: 6642 bytes
Exported size: 6408 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

export const GiveCommand = {

    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription(
            "Give Nickel from the Ink Bank to a member."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )
        .addUserOption(
            option =>
                option
                    .setName("member")
                    .setDescription(
                        "The member receiving the Nickel."
                    )
                    .setRequired(true)
        )
        .addIntegerOption(
            option =>
                option
                    .setName("amount")
                    .setDescription(
                        "Amount of Nickel to give."
                    )
                    .setRequired(true)
                    .setMinValue(1)
        ),

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

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            await interaction.reply({
                content:
                    "❌ You must be a server administrator to use this command.",
                flags: 64
            });

            return;
        }

        const member =
            interaction.options.getUser(
                "member",
                true
            );

        const amount =
            BigInt(
                interaction.options.getInteger(
                    "amount",
                    true
                )
            );

        const client =
            interaction.client as BotClient;

        const database =
            client.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await interaction.reply({
                content:
                    "❌ Database service is unavailable.",
                flags: 64
            });

            return;
        }

        try {

            await database.db.$transaction(
                async (tx) => {

                    const inkBank =
                        await tx.inkBank.findUnique({
                            where: {
                                guildId:
                                    interaction.guild!.id
                            }
                        });

                    if (!inkBank) {
                        throw new Error(
                            "INK_BANK_NOT_FOUND"
                        );
                    }

                    const reserveUpdate =
                        await tx.inkBank.updateMany({
                            where: {
                                guildId:
                                    interaction.guild!.id,

                                balance: {
                                    gte: amount
                                }
                            },

                            data: {
                                balance: {
                                    decrement: amount
                                }
                            }
                        });

                    if (reserveUpdate.count !== 1) {
                        throw new Error(
                            "INK_BANK_INSUFFICIENT"
                        );
                    }

                    await tx.economyAccount.upsert({

                        where: {
                            guildId_discordId: {
                                guildId:
                                    interaction.guild!.id,

                                discordId:
                                    member.id
                            }
                        },

                        update: {
                            wallet: {
                                increment: amount
                            }
                        },

                        create: {
                            guildId:
                                interaction.guild!.id,

                            discordId:
                                member.id,

                            wallet:
                                amount
                        }
                    });
                }
            );

            await interaction.reply({

                content:
                    `💰 **Nickel Award**\n\n` +
                    `👤 ${member}\n` +
                    `💵 Awarded **${amount.toString()} Nickel** from the Ink Bank.\n\n` +
                    `🏦 The Ink Bank funded this reward.`,

                flags: 64
            });

            console.log(
                `[ADMIN] ${interaction.user.tag} gave ${amount.toString()} Nickel to ${member.tag} in ${interaction.guild.name}.`
            );

        } catch (error) {

            if (
                error instanceof Error &&
                error.message === "INK_BANK_NOT_FOUND"
            ) {

                await interaction.reply({
                    content:
                        "❌ This server's Ink Bank is unavailable.",
                    flags: 64
                });

                return;
            }

            if (
                error instanceof Error &&
                error.message === "INK_BANK_INSUFFICIENT"
            ) {

                await interaction.reply({
                    content:
                        "🏦 The Ink Bank does not have enough Nickel to fund this reward.",
                    flags: 64
                });

                return;
            }

            console.error(
                "[ADMIN] Failed to give Nickel:",
                error
            );

            await interaction.reply({
                content:
                    "❌ Failed to award Nickel.",
                flags: 64
            });
        }
    }
};

END FILE: src/plugins/economy/commands/GiveCommand.ts
================================================================================

FILE: src/plugins/economy/commands/LockerCommand.ts
--------------------------------------------------------------------------------
Original size: 9406 bytes
Exported size: 9073 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { EconomyAccountService } from "../services/EconomyAccountService.js";

export const LockerCommand = {

    data: new SlashCommandBuilder()
        .setName("locker")
        .setDescription(
            "View your Bank Locker."
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * ECONOMY SERVICE
         * =========================
         */

        const client =
            interaction.client as BotClient;

        const accountService =
            client.services.get<EconomyAccountService>(
                "economyAccountService"
            );

        if (!accountService) {

            await interaction.reply({
                content:
                    "❌ Economy service is currently unavailable.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * LOAD LOCKER
         * =========================
         */

        try {

            const locker =
                await accountService.getBankLocker(
                    interaction.guild.id,
                    interaction.user.id
                );

            const balance =
                locker.locker.balance;

            const capacity =
                locker.locker.capacity;

            const capacityPercent =
                capacity > 0n
                    ? Number(
                        (
                            balance *
                            100n
                        ) /
                        capacity
                    )
                    : 0;

            const clampedPercent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        capacityPercent
                    )
                );

            const barLength =
                20;

            const filledLength =
                Math.round(
                    (
                        clampedPercent /
                        100
                    ) *
                    barLength
                );

            const progressBar =
                "█".repeat(
                    filledLength
                ) +
                "░".repeat(
                    barLength -
                    filledLength
                );

            /*
             * =========================
             * INTEREST
             * =========================
             *
             * Interest is fixed at maturity.
             * Therefore this represents the interest
             * that the current active deposits can earn,
             * rather than daily accrued interest.
             */

            const interestAtMaturity =
                locker.deposits.reduce(
                    (
                        total,
                        deposit
                    ) =>
                        total +
                        deposit.interest,
                    0n
                );

            /*
             * =========================
             * WITHDRAWABLE
             * =========================
             */

            const withdrawable =
                locker.maturedAmount;

            /*
             * =========================
             * NEXT WITHDRAWAL
             * =========================
             */

            const upcomingDeposits =
                locker.deposits
                    .filter(
                        deposit =>
                            !deposit.matured
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            first.maturityAt.getTime() -
                            second.maturityAt.getTime()
                    );

            const nextDeposit =
                upcomingDeposits[0];

            let nextWithdrawalText =
                "Nothing currently locked.";

            if (
                withdrawable > 0n
            ) {

                nextWithdrawalText =
                    "Available now.";

            } else if (
                nextDeposit
            ) {

                nextWithdrawalText =
                    `<t:${Math.floor(
                        nextDeposit.maturityAt.getTime() /
                        1000
                    )}:F>\n` +
                    `<t:${Math.floor(
                        nextDeposit.maturityAt.getTime() /
                        1000
                    )}:R>`;
            }

            /*
             * =========================
             * UPCOMING DEPOSITS
             * =========================
             */

            const upcomingLines =
                upcomingDeposits
                    .slice(
                        0,
                        5
                    )
                    .map(
                        deposit =>
                            `• **${deposit.amount.toString()} Nickel** → <t:${Math.floor(
                                deposit.maturityAt.getTime() /
                                1000
                            )}:d>`
                    );

            const upcomingText =
                upcomingLines.length > 0
                    ? upcomingLines.join("\n")
                    : "No Nickel is currently waiting for maturity.";

            /*
             * =========================
             * EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🔒 Bank Locker"
                    )
                    .setDescription(
                        `Your Nickel is safely locked away, **${interaction.user.displayName}**.\n\n` +
                        `**${balance.toString()} / ${capacity.toString()} Nickel**\n` +
                        `${progressBar} **${clampedPercent}%**`
                    )
                    .addFields(

                        {
                            name:
                                "💰 Withdrawable",

                            value:
                                `**${withdrawable.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📈 Interest",

                            value:
                                `**+${interestAtMaturity.toString()} Nickel** at maturity`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📦 Available Space",

                            value:
                                `**${(
                                    capacity -
                                    balance
                                ).toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "⏳ Next Withdrawal",

                            value:
                                nextWithdrawalText,

                            inline:
                                false
                        },

                        {
                            name:
                                "⏳ Upcoming",

                            value:
                                upcomingText,

                            inline:
                                false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Bank Locker"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                flags: 64
            });

        } catch (error) {

            console.error(
                "[Economy] Failed to open Bank Locker:",
                error
            );

            await interaction.reply({
                content:
                    "❌ Something went wrong while opening your Bank Locker. Please try again.",
                flags: 64
            });
        }
    }
};

END FILE: src/plugins/economy/commands/LockerCommand.ts
================================================================================

FILE: src/plugins/economy/commands/LockerDepositCommand.ts
--------------------------------------------------------------------------------
Original size: 5631 bytes
Exported size: 5430 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { EconomyAccountService } from "../services/EconomyAccountService.js";

export const LockerDepositCommand = {

    data: new SlashCommandBuilder()
        .setName("lockerdeposit")
        .setDescription(
            "Deposit Nickel into your Bank Locker."
        )
        .addIntegerOption(
            option =>
                option
                    .setName("amount")
                    .setDescription(
                        "The amount of Nickel to lock away."
                    )
                    .setRequired(true)
                    .setMinValue(1)
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const amountNumber =
            interaction.options.getInteger(
                "amount",
                true
            );

        const amount =
            BigInt(
                amountNumber
            );

        /*
         * =========================
         * ECONOMY SERVICE
         * =========================
         */

        const client =
            interaction.client as BotClient;

        const accountService =
            client.services.get<EconomyAccountService>(
                "economyAccountService"
            );

        if (!accountService) {

            await interaction.reply({
                content:
                    "❌ Economy service is currently unavailable.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * DEPOSIT
         * =========================
         */

        try {

            const result =
                await accountService.depositToBankLocker(
                    interaction.guild.id,
                    interaction.user.id,
                    amount
                );

            const maturityTimestamp =
                Math.floor(
                    result.maturityAt.getTime() /
                    1000
                );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🔒 Nickel Locked"
                    )
                    .setDescription(
                        `**${amount.toString()} Nickel** has been placed into your Bank Locker.`
                    )
                    .addFields(

                        {
                            name:
                                "💰 Deposited",

                            value:
                                `**${result.amount.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🔒 Locker Balance",

                            value:
                                `**${result.lockerBalance.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "⏳ Available",

                            value:
                                `<t:${maturityTimestamp}:F>\n<t:${maturityTimestamp}:R>`,

                            inline:
                                false
                        },

                        {
                            name:
                                "📈 Interest",

                            value:
                                `**+${(
                                    result.amount *
                                    2n /
                                    100n
                                ).toString()} Nickel** at maturity`,

                            inline:
                                false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Bank Locker"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                flags: 64
            });

            console.info(
                `[Economy] ${interaction.user.tag} deposited ${amount.toString()} Nickel into their Bank Locker in ${interaction.guild.name}.`
            );

        } catch (error) {

            console.error(
                "[Economy] Bank Locker deposit failed:",
                error
            );

            await interaction.reply({
                content:
                    "❌ Your Nickel could not be deposited into the Bank Locker. Please check your wallet balance and available locker space.",
                flags: 64
            });
        }
    }
};

END FILE: src/plugins/economy/commands/LockerDepositCommand.ts
================================================================================

FILE: src/plugins/economy/commands/LockerWithdrawCommand.ts
--------------------------------------------------------------------------------
Original size: 6909 bytes
Exported size: 6666 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { EconomyAccountService } from "../services/EconomyAccountService.js";

export const LockerWithdrawCommand = {

    data: new SlashCommandBuilder()
        .setName("lockerwithdraw")
        .setDescription(
            "Withdraw Nickel from a matured Bank Locker deposit."
        )
        .addIntegerOption(
            option =>
                option
                    .setName("deposit")
                    .setDescription(
                        "The deposit number shown in /locker."
                    )
                    .setRequired(true)
                    .setMinValue(1)
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * INPUT
         * =========================
         */

        const depositNumber =
            interaction.options.getInteger(
                "deposit",
                true
            );

        /*
         * =========================
         * ECONOMY SERVICE
         * =========================
         */

        const client =
            interaction.client as BotClient;

        const accountService =
            client.services.get<EconomyAccountService>(
                "economyAccountService"
            );

        if (!accountService) {

            await interaction.reply({
                content:
                    "❌ Economy service is currently unavailable.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * LOAD ACTIVE DEPOSITS
         * =========================
         */

        try {

            const locker =
                await accountService.getBankLocker(
                    interaction.guild.id,
                    interaction.user.id
                );

            const activeDeposits =
                locker.deposits
                    .filter(
                        deposit =>
                            !deposit.withdrawnAt
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            first.maturityAt.getTime() -
                            second.maturityAt.getTime()
                    );

            const selectedDeposit =
                activeDeposits[
                    depositNumber - 1
                ];

            if (!selectedDeposit) {

                await interaction.reply({
                    content:
                        "❌ That deposit could not be found. Use `/locker` to see your current deposits.",
                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * MATURITY CHECK
             * =========================
             */

            if (
                !selectedDeposit.matured
            ) {

                const maturityTimestamp =
                    Math.floor(
                        selectedDeposit.maturityAt.getTime() /
                        1000
                    );

                await interaction.reply({
                    content:
                        `⏳ This Nickel is still locked.\n\nYou can withdraw it <t:${maturityTimestamp}:R>.`,
                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * WITHDRAW
             * =========================
             */

            const result =
                await accountService.withdrawMaturedBankLockerDeposit(
                    interaction.guild.id,
                    interaction.user.id,
                    selectedDeposit.id
                );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "💰 Locker Withdrawal"
                    )
                    .setDescription(
                        `Your matured Nickel has been returned to your wallet, **${interaction.user.displayName}**.`
                    )
                    .addFields(

                        {
                            name:
                                "💰 Principal",

                            value:
                                `**${result.amount.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "📈 Interest",

                            value:
                                `**+${result.interest.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💵 Total",

                            value:
                                `**${result.total.toString()} Nickel**`,

                            inline:
                                true
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Bank Locker"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                flags: 64
            });

            console.info(
                `[Economy] ${interaction.user.tag} withdrew ${result.total.toString()} Nickel from their Bank Locker in ${interaction.guild.name}.`
            );

        } catch (error) {

            console.error(
                "[Economy] Bank Locker withdrawal failed:",
                error
            );

            await interaction.reply({
                content:
                    "❌ This Bank Locker withdrawal could not be completed. Please use `/locker` to check your deposits and try again.",
                flags: 64
            });
        }
    }
};

END FILE: src/plugins/economy/commands/LockerWithdrawCommand.ts
================================================================================

FILE: src/plugins/economy/commands/PayCommand.ts
--------------------------------------------------------------------------------
Original size: 21187 bytes
Exported size: 20482 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

export const PayCommand = {

    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription(
            "Send Nickel to another member."
        )
        .addUserOption(
            option =>
                option
                    .setName("member")
                    .setDescription(
                        "The member you want to pay."
                    )
                    .setRequired(true)
        )
        .addIntegerOption(
            option =>
                option
                    .setName("amount")
                    .setDescription(
                        "The amount of Nickel to send."
                    )
                    .setRequired(true)
                    .setMinValue(1)
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
                content:
                    "❌ This command can only be used in a server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * GET INPUT
         * =========================
         */

        const recipient =
            interaction.options.getUser(
                "member",
                true
            );

        const amountNumber =
            interaction.options.getInteger(
                "amount",
                true
            );

        const amount =
            BigInt(
                amountNumber
            );

        /*
         * =========================
         * BASIC VALIDATION
         * =========================
         */

        if (
            recipient.id ===
            interaction.user.id
        ) {

            await interaction.reply({
                content:
                    "❌ You cannot pay yourself.",
                flags: 64
            });

            return;
        }

        if (
            recipient.bot
        ) {

            await interaction.reply({
                content:
                    "❌ You cannot pay a bot.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * SERVER MEMBER CHECK
         * =========================
         */

        const recipientMember =
            await interaction.guild.members
                .fetch(recipient.id)
                .catch(() => null);

        if (!recipientMember) {

            await interaction.reply({
                content:
                    "❌ That member is not in this server.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * PAYMENT FEE
         * =========================
         *
         * 2% transaction fee.
         *
         * Nickel is an integer currency,
         * therefore fractional Nickel is
         * rounded down.
         */

        const fee =
            (amount * 2n) / 100n;

        const totalCost =
            amount +
            fee;

        /*
         * =========================
         * DATABASE
         * =========================
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
                    "❌ Database service is unavailable.",
                flags: 64
            });

            return;
        }

        /*
         * =========================
         * TRANSACTION
         * =========================
         */

        try {

            const result =
                await database.db.$transaction(
                    async (tx) => {

                        /*
                         * =========================
                         * SENDER ACCOUNT
                         * =========================
                         */

                        const senderAccount =
                            await tx.economyAccount.findUnique({

                                where: {
                                    guildId_discordId: {
                                        guildId:
                                            interaction.guild!.id,

                                        discordId:
                                            interaction.user.id
                                    }
                                }
                            });

                        if (!senderAccount) {

                            throw new Error(
                                "SENDER_ACCOUNT_NOT_FOUND"
                            );
                        }

                        /*
                         * =========================
                         * RECIPIENT ACCOUNT
                         * =========================
                         *
                         * Create automatically if
                         * the recipient doesn't have
                         * an economy account yet.
                         */

                        const recipientAccount =
                            await tx.economyAccount.upsert({

                                where: {
                                    guildId_discordId: {
                                        guildId:
                                            interaction.guild!.id,

                                        discordId:
                                            recipient.id
                                    }
                                },

                                create: {
                                    guildId:
                                        interaction.guild!.id,

                                    discordId:
                                        recipient.id,

                                    wallet:
                                        0n
                                },

                                update: {}
                            });

                        /*
                         * =========================
                         * DETERMINE FUNDING
                         * =========================
                         *
                         * Wallet is always used first.
                         *
                         * Opera Card covers any
                         * remaining amount.
                         */

                        const walletUsed =
                            senderAccount.wallet >=
                            totalCost
                                ? totalCost
                                : senderAccount.wallet;

                        const cardUsed =
                            totalCost -
                            walletUsed;

                        /*
                         * =========================
                         * GET OPERA CARD
                         * =========================
                         */

                        let senderCard = null;

                        if (
                            cardUsed > 0n
                        ) {

                            senderCard =
                                await tx.operaCard.findUnique({

                                    where: {
                                        discordId:
                                            interaction.user.id
                                    }
                                });

                            if (!senderCard) {

                                throw new Error(
                                    "SENDER_CARD_NOT_FOUND"
                                );
                            }

                            if (
                                senderCard.balance <
                                cardUsed
                            ) {

                                throw new Error(
                                    "INSUFFICIENT_FUNDS"
                                );
                            }
                        }

                        /*
                         * =========================
                         * REMOVE WALLET FUNDS
                         * =========================
                         *
                         * Conditional update prevents
                         * spending the same Nickel from
                         * concurrent transactions.
                         */

                        if (
                            walletUsed > 0n
                        ) {

                            const walletUpdate =
                                await tx.economyAccount.updateMany({

                                    where: {
                                        id:
                                            senderAccount.id,

                                        wallet: {
                                            gte:
                                                walletUsed
                                        }
                                    },

                                    data: {
                                        wallet: {
                                            decrement:
                                                walletUsed
                                        }
                                    }
                                });

                            if (
                                walletUpdate.count !== 1
                            ) {

                                throw new Error(
                                    "INSUFFICIENT_FUNDS"
                                );
                            }
                        }

                        /*
                         * =========================
                         * REMOVE CARD FUNDS
                         * =========================
                         */

                        if (
                            cardUsed > 0n
                        ) {

                            const cardUpdate =
                                await tx.operaCard.updateMany({

                                    where: {
                                        id:
                                            senderCard!.id,

                                        balance: {
                                            gte:
                                                cardUsed
                                        }
                                    },

                                    data: {
                                        balance: {
                                            decrement:
                                                cardUsed
                                        },

                                        updatedAt:
                                            new Date()
                                    }
                                });

                            if (
                                cardUpdate.count !== 1
                            ) {

                                throw new Error(
                                    "INSUFFICIENT_FUNDS"
                                );
                            }
                        }

                        /*
                         * =========================
                         * CREDIT RECIPIENT
                         * =========================
                         */

                        const updatedRecipient =
                            await tx.economyAccount.update({

                                where: {
                                    id:
                                        recipientAccount.id
                                },

                                data: {
                                    wallet: {
                                        increment:
                                            amount
                                    }
                                }
                            });

                        return {
                            walletUsed,
                            cardUsed,

                            recipientBalance:
                                updatedRecipient.wallet
                        };
                    }
                );

            /*
             * =========================
             * FUNDING DISPLAY
             * =========================
             */

            const fundingFields = [];

            if (
                result.walletUsed > 0n
            ) {

                fundingFields.push({
                    name:
                        "👛 Wallet",

                    value:
                        `**${result.walletUsed.toString()} Nickel**`,

                    inline:
                        true
                });
            }

            if (
                result.cardUsed > 0n
            ) {

                fundingFields.push({
                    name:
                        "💳 Opera Card",

                    value:
                        `**${result.cardUsed.toString()} Nickel**`,

                    inline:
                        true
                });
            }

            /*
             * =========================
             * SUCCESS EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "💸 Payment Successful"
                    )
                    .setDescription(
                        `You successfully sent **${amount.toString()} Nickel** to ${recipient}.`
                    )
                    .addFields(

                        {
                            name:
                                "👤 Recipient",

                            value:
                                `${recipient}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💰 Amount Sent",

                            value:
                                `**${amount.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🧾 Transaction Fee",

                            value:
                                `**${fee.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💸 Total Charged",

                            value:
                                `**${totalCost.toString()} Nickel**`,

                            inline:
                                true
                        },

                        ...fundingFields
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Nickel Economy"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                flags: 64
            });

            /*
             * =========================
             * LOGGING
             * =========================
             *
             * BotClient does not expose a logger,
             * so use the runtime console here.
             */

            console.info(
                `[Economy] ${interaction.user.tag} paid ${amount.toString()} Nickel to ${recipient.tag} in ${interaction.guild.name}. ` +
                `Fee: ${fee.toString()} Nickel. ` +
                `Total: ${totalCost.toString()} Nickel. ` +
                `Wallet used: ${result.walletUsed.toString()}. ` +
                `Card used: ${result.cardUsed.toString()}.`
            );

        } catch (error) {

            /*
             * =========================
             * SENDER ACCOUNT ERROR
             * =========================
             */

            if (
                error instanceof Error &&
                error.message ===
                    "SENDER_ACCOUNT_NOT_FOUND"
            ) {

                await interaction.reply({
                    content:
                        "❌ Your economy account could not be found. Please use an economy command first to initialize your account.",
                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * CARD ERROR
             * =========================
             */

            if (
                error instanceof Error &&
                error.message ===
                    "SENDER_CARD_NOT_FOUND"
            ) {

                await interaction.reply({
                    content:
                        "❌ You don't have enough Nickel in your wallet, and your Opera Card could not be found to cover the remaining amount.",
                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * INSUFFICIENT FUNDS
             * =========================
             */

            if (
                error instanceof Error &&
                error.message ===
                    "INSUFFICIENT_FUNDS"
            ) {

                const embed =
                    new EmbedBuilder()
                        .setTitle(
                            "❌ Insufficient Nickel"
                        )
                        .setDescription(
                            "You don't have enough Nickel to complete this payment."
                        )
                        .addFields(

                            {
                                name:
                                    "💰 Payment",

                                value:
                                    `**${amount.toString()} Nickel**`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧾 Fee",

                                value:
                                    `**${fee.toString()} Nickel**`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "💸 Required",

                                value:
                                    `**${totalCost.toString()} Nickel**`,

                                inline:
                                    true
                            }
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Nickel Economy"
                        })
                        .setTimestamp();

                await interaction.reply({
                    embeds: [
                        embed
                    ],

                    flags: 64
                });

                return;
            }

            /*
             * =========================
             * UNKNOWN ERROR
             * =========================
             */

            console.error(
                "[Economy] Payment failed:",
                error
            );

            await interaction.reply({
                content:
                    "❌ Something went wrong while processing the payment. Please try again.",
                flags: 64
            });
        }
    }
};


END FILE: src/plugins/economy/commands/PayCommand.ts
================================================================================

FILE: src/plugins/economy/EconomyPlugin.ts
--------------------------------------------------------------------------------
Original size: 80862 bytes
Exported size: 77973 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
    EmbedBuilder,
    Interaction,
    Message,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { Plugin } from "../../core/plugins/Plugin.js";
import { PluginContext } from "../../core/plugins/PluginContext.js";
import { PrismaService } from "../../core/database/PrismaService.js";
import { EconomyAccountService } from "./services/EconomyAccountService.js";

import { EconomyCommand } from "./commands/EconomyCommand.js";
import { CardCommand } from "./commands/CardCommand.js";
import { PayCommand } from "./commands/PayCommand.js";
import { GiveCommand } from "./commands/GiveCommand.js";
import { DailyConfigCommand } from "./commands/DailyConfigCommand.js";
import { DailyCommand } from "./commands/DailyCommand.js";
import { LockerCommand } from "./commands/LockerCommand.js";
import { LockerDepositCommand } from "./commands/LockerDepositCommand.js";
import { LockerWithdrawCommand } from "./commands/LockerWithdrawCommand.js";

/*
 * Tracks members who have already earned Nickel
 * during the current earning minute.
 *
 * Key:
 * guildId:userId
 *
 * Value:
 * Unix minute number
 */
const activeMembers =
    new Map<string, number>();

export class EconomyPlugin implements Plugin {

    metadata = {
        id: "economy",
        name: "Economy",
        version: "1.0.0",
        description:
            "Economy system for Quill & Ink"
    };

    register(
        context: PluginContext
    ): void {

        context.logger.info(
            "Economy Plugin registered"
        );

        /*
         * =========================
         * ECONOMY ACCOUNT SERVICE
         * =========================
         */

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            throw new Error(
                "Database service is not registered."
            );
        }

        const economyAccountService =
            new EconomyAccountService(
                database
            );

        context.services.register(
            "economyAccountService",
            economyAccountService
        );

        /*
         * =========================
         * ROBBERY LOCK RECOVERY
         * =========================
         */

        void economyAccountService
            .cleanupExpiredRobberyLocks()
            .then(
                cleanedCount => {

                    if (
                        cleanedCount > 0
                    ) {

                        context.logger.info(
                            `[Economy] Cleaned up ${cleanedCount} expired robbery lock(s).`
                        );
                    }
                }
            )
            .catch(
                error => {

                    context.logger.error(
                        "[Economy] Failed to clean up expired robbery locks:",
                        error
                    );
                }
            );

        /*
         * =========================
         * COMMANDS
         * =========================
         */

        context.commands.registerCommand(
            EconomyCommand
        );

        context.commands.registerCommand(
            CardCommand
        );

        context.commands.registerCommand(
            PayCommand
        );

        context.commands.registerCommand(
            GiveCommand
        );

        context.commands.registerCommand(
            DailyConfigCommand
        );

        context.commands.registerCommand(
            DailyCommand
        );

        context.commands.registerCommand(
            LockerCommand
        );

        context.commands.registerCommand(
            LockerDepositCommand
        );

        context.commands.registerCommand(
            LockerWithdrawCommand
        );

        /*
         * =========================
         * INTERACTION HANDLER
         * =========================
         */

        context.on(
            "interactionCreate",
            async (interaction: Interaction) => {

                /*
                 * =========================
                 * PROFILE → DAILY
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "profile_claim_daily"
                ) {

                    await this.handleProfileDaily(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * PROFILE → CARD
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "profile_view_card"
                ) {

                    await this.handleProfileCard(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * WALLET → CARD
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "card_wallet_transfer"
                ) {

                    await this.handleWalletToCard(
                        interaction as ButtonInteraction
                    );

                    return;
                }

                /*
                 * =========================
                 * WALLET → CARD MODAL
                 * =========================
                 */

                if (
                    interaction.isModalSubmit() &&
                    interaction.customId ===
                        "card_wallet_transfer_modal"
                ) {

                    await this.handleWalletToCardSubmit(
                        interaction as ModalSubmitInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * ECONOMY → RESET CONFIRM
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId.startsWith(
                        "economy_reset_confirm_"
                    )
                ) {

                    await this.handleEconomyResetConfirm(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * ECONOMY → RESET CANCEL
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId.startsWith(
                        "economy_reset_cancel_"
                    )
                ) {

                    await this.handleEconomyResetCancel(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * ADD CHANNEL
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "economy_nickel_add"
                ) {

                    await this.handleAddChannel(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * REMOVE CHANNEL
                 * =========================
                 */

                if (
                    interaction.isButton() &&
                    interaction.customId ===
                        "economy_nickel_remove"
                ) {

                    await this.handleRemoveChannel(
                        interaction as ButtonInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * ADD CHANNEL SELECT
                 * =========================
                 */

                if (
                    interaction.isChannelSelectMenu() &&
                    interaction.customId ===
                        "economy_nickel_channel_select"
                ) {

                    await this.handleChannelSelect(
                        interaction as ChannelSelectMenuInteraction,
                        context
                    );

                    return;
                }

                /*
                 * =========================
                 * REMOVE CHANNEL SELECT
                 * =========================
                 */

                if (
                    interaction.isChannelSelectMenu() &&
                    interaction.customId ===
                        "economy_nickel_remove_select"
                ) {

                    await this.handleRemoveChannelSelect(
                        interaction as ChannelSelectMenuInteraction,
                        context
                    );

                    return;
                }
            }
        );

        /*
         * =========================
         * MESSAGE ACTIVITY
         * =========================
         */

        context.on(
            "messageCreate",
            async (message) => {

                try {

                    await this.handleMessageActivity(
                        message,
                        context
                    );

                } catch (error) {

                    context.logger.error(
                        "[Economy] Message activity handler failed:",
                        error
                    );
                }
            }
        );
    }

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Economy Plugin loaded"
        );
    }

    onUnload(
        context: PluginContext
    ): void {

        activeMembers.clear();

        context.services.remove(
            "economyAccountService"
        );

        context.logger.info(
            "Economy Plugin unloaded"
        );
    }

    /*
     * =========================
     * ECONOMY → RESET CONFIRM
     * =========================
     */

    private async handleEconomyResetConfirm(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const customId =
            interaction.customId;

        const prefix =
            "economy_reset_confirm_";

        if (
            !customId.startsWith(prefix)
        ) {
            return;
        }

        const parts =
            customId
                .slice(prefix.length)
                .split("_");

        const guildId =
            parts[0];

        const userId =
            parts[1];

        /*
         * =========================
         * CONFIRMATION OWNERSHIP
         * =========================
         */

        if (
            guildId !==
            interaction.guild.id
        ) {

            await this.safeReply(
                interaction,
                "❌ This reset confirmation belongs to another server."
            );

            return;
        }

        if (
            userId !==
            interaction.user.id
        ) {

            await this.safeReply(
                interaction,
                "❌ Only the person who started this reset can confirm it."
            );

            return;
        }

        /*
         * =========================
         * PERMISSION RE-CHECK
         * =========================
         */

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageGuild
            )
        ) {

            await this.safeReply(
                interaction,
                "❌ You need the **Manage Server** permission to reset the economy."
            );

            return;
        }

        /*
         * =========================
         * ACKNOWLEDGE
         * =========================
         */

        try {

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "⏳ Resetting Server Economy"
                        )
                        .setDescription(
                            "The server's Nickel economy is being cleared and reinitialized.\n\n" +
                            "Please wait while the Banker completes the reset."
                        )
                        .setTimestamp()
                ],
                components: []
            });

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to acknowledge economy reset:",
                error
            );

            return;
        }

        try {

            /*
             * =========================
             * GLOBAL CORE
             * =========================
             *
             * Banker owns the actual economy
             * reset and normal initial funding.
             */

            const client =
                interaction.client as import(
                    "../../core/client/BotClient.js"
                ).BotClient;

            await client.globalCore.resetServerEconomy(
                interaction.guild.id,
                interaction.guild.memberCount
            );

            /*
             * =========================
             * ACTIVE MINUTE STATE
             * =========================
             *
             * A successful reset means the
             * in-memory earning state must also
             * be cleared for this guild.
             */

            const guildPrefix =
                `${interaction.guild.id}:`;

            for (
                const key of activeMembers.keys()
            ) {

                if (
                    key.startsWith(
                        guildPrefix
                    )
                ) {

                    activeMembers.delete(
                        key
                    );
                }
            }

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "✅ Economy Reset Complete"
                    )
                    .setDescription(
                        "This server's **InkBank economy has been completely reset and reinitialized**."
                    )
                    .addFields(
                        {
                            name:
                                "🗑️ Previous Economy",
                            value:
                                "All server-owned Nickel was removed from wallets, Bank Lockers, departed-member funds, pending returns, and the previous InkBank.",
                            inline:
                                false
                        },
                        {
                            name:
                                "🏦 New InkBank",
                            value:
                                "The Banker has initialized a fresh InkBank using the server's current member count and normal funding rules.",
                            inline:
                                false
                        },
                        {
                            name:
                                "🔒 Preserved",
                            value:
                                "Global QuillBank, Opera Cards, transaction history, economy configuration, XP, robbery progression, and other unrelated server data were left untouched.",
                            inline:
                                false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Economy Administration"
                    })
                    .setTimestamp();

            await interaction.editReply({
                embeds: [
                    embed
                ],
                components: []
            });

            context.logger.info(
                `[Economy] ${interaction.user.tag} reset the Nickel economy for ${interaction.guild.name} (${interaction.guild.id}).`
            );

        } catch (error) {

            context.logger.error(
                "[Economy] Server economy reset failed:",
                error
            );

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "❌ Economy Reset Failed"
                        )
                        .setDescription(
                            "The server economy could not be reset.\n\n" +
                            "No further changes were made after the reset operation failed."
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Economy Administration"
                        })
                        .setTimestamp()
                ],
                components: []
            });
        }
    }

    /*
     * =========================
     * ECONOMY → RESET CANCEL
     * =========================
     */

    private async handleEconomyResetCancel(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        const prefix =
            "economy_reset_cancel_";

        if (
            !interaction.customId.startsWith(prefix)
        ) {
            return;
        }

        const parts =
            interaction.customId
                .slice(prefix.length)
                .split("_");

        const guildId =
            parts[0];

        const userId =
            parts[1];

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        if (
            guildId !==
            interaction.guild.id
        ) {

            await this.safeReply(
                interaction,
                "❌ This reset confirmation belongs to another server."
            );

            return;
        }

        if (
            userId !==
            interaction.user.id
        ) {

            await this.safeReply(
                interaction,
                "❌ Only the person who started this reset can cancel it."
            );

            return;
        }

        try {

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "✅ Economy Reset Cancelled"
                        )
                        .setDescription(
                            "No changes were made to this server's economy."
                        )
                        .setFooter({
                            text:
                                "Quill & Ink • Economy Administration"
                        })
                        .setTimestamp()
                ],
                components: []
            });

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to cancel economy reset:",
                error
            );
        }
    }

    /*
     * =========================
     * PROFILE → DAILY
     * =========================
     */

    private async handleProfileDaily(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            if (
                interaction.replied ||
                interaction.deferred
            ) {
                return;
            }

            try {

                await interaction.reply({
                    content:
                        "❌ This can only be used in a server.",
                    flags: 64
                });

            } catch (error) {

                context.logger.error(
                    "[Economy] Failed to respond to profile daily server check:",
                    error
                );
            }

            return;
        }

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

            try {

                await interaction.deferReply({
                    flags: 64
                });

            } catch (error) {

                context.logger.error(
                    "[Economy] Profile daily interaction could not be acknowledged:",
                    error
                );

                return;
            }

        } else if (
            interaction.replied
        ) {

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            try {

                await interaction.editReply({
                    content:
                        "❌ Database service is currently unavailable."
                });

            } catch (error) {

                context.logger.error(
                    "[Economy] Failed to send database unavailable response:",
                    error
                );
            }

            return;
        }

        const now =
            new Date();

        const REWARD_STEP =
            2n;

        const PHASE_LENGTH =
            1000;

        const CYCLE_LENGTH =
            PHASE_LENGTH * 2;

        try {

            const result =
                await database.db.$transaction(
                    async (tx) => {

                        const guildConfig =
                            await tx.guildConfig.findUnique({
                                where: {
                                    guildId:
                                        interaction.guild!.id
                                }
                            });

                        const startingReward =
                            guildConfig?.dailyReward ??
                            10n;

                        const account =
                            await tx.economyAccount.upsert({

                                where: {
                                    guildId_discordId: {
                                        guildId:
                                            interaction.guild!.id,

                                        discordId:
                                            interaction.user.id
                                    }
                                },

                                update: {},

                                create: {
                                    guildId:
                                        interaction.guild!.id,

                                    discordId:
                                        interaction.user.id,

                                    wallet:
                                        0n,

                                    dailyStreak:
                                        0,

                                    dailyDirection:
                                        1
                                }
                            });

                        if (account.lastDailyAt) {

                            const lastClaim =
                                new Date(
                                    account.lastDailyAt
                                );

                            const sameDay =
                                lastClaim.getFullYear() ===
                                    now.getFullYear() &&
                                lastClaim.getMonth() ===
                                    now.getMonth() &&
                                lastClaim.getDate() ===
                                    now.getDate();

                            if (sameDay) {

                                throw new Error(
                                    "ALREADY_CLAIMED"
                                );
                            }
                        }

                        let streak =
                            1;

                        if (account.lastDailyAt) {

                            const lastClaim =
                                new Date(
                                    account.lastDailyAt
                                );

                            const currentDateStart =
                                new Date(
                                    now.getFullYear(),
                                    now.getMonth(),
                                    now.getDate()
                                );

                            const lastDateStart =
                                new Date(
                                    lastClaim.getFullYear(),
                                    lastClaim.getMonth(),
                                    lastClaim.getDate()
                                );

                            const difference =
                                currentDateStart.getTime() -
                                lastDateStart.getTime();

                            const daysSinceLastClaim =
                                Math.floor(
                                    difference /
                                    (24 * 60 * 60 * 1000)
                                );

                            if (
                                daysSinceLastClaim ===
                                1
                            ) {

                                streak =
                                    account.dailyStreak +
                                    1;

                            } else {

                                streak =
                                    1;
                            }
                        }

                        const cyclePosition =
                            (
                                (streak - 1) %
                                CYCLE_LENGTH
                            );

                        let reward =
                            startingReward;

                        let direction =
                            1;

                        if (
                            cyclePosition <=
                            PHASE_LENGTH
                        ) {

                            reward =
                                startingReward +
                                (
                                    BigInt(
                                        cyclePosition
                                    ) *
                                    REWARD_STEP
                                );

                            if (
                                cyclePosition ===
                                PHASE_LENGTH
                            ) {

                                direction =
                                    -1;
                            }

                        } else {

                            const decreaseSteps =
                                cyclePosition -
                                PHASE_LENGTH;

                            reward =
                                startingReward +
                                (
                                    BigInt(
                                        PHASE_LENGTH -
                                        decreaseSteps
                                    ) *
                                    REWARD_STEP
                                );

                            direction =
                                -1;

                            if (
                                cyclePosition ===
                                CYCLE_LENGTH - 1
                            ) {

                                direction =
                                    1;
                            }
                        }

                        const reserveUpdate =
                            await tx.inkBank.updateMany({

                                where: {
                                    guildId:
                                        interaction.guild!.id,

                                    balance: {
                                        gte:
                                            reward
                                    }
                                },

                                data: {
                                    balance: {
                                        decrement:
                                            reward
                                    }
                                }
                            });

                        if (
                            reserveUpdate.count !==
                            1
                        ) {

                            throw new Error(
                                "INSUFFICIENT_INK_BANK"
                            );
                        }

                        const updatedAccount =
                            await tx.economyAccount.update({

                                where: {
                                    id:
                                        account.id
                                },

                                data: {

                                    wallet: {
                                        increment:
                                            reward
                                    },

                                    dailyStreak:
                                        streak,

                                    dailyDirection:
                                        direction,

                                    lastDailyAt:
                                        now
                                }
                            });

                        return {
                            reward,
                            streak,
                            direction,

                            wallet:
                                updatedAccount.wallet
                        };
                    }
                );

            let nextReward =
                result.reward;

            if (
                result.direction ===
                1
            ) {

                nextReward =
                    result.reward +
                    REWARD_STEP;

            } else {

                nextReward =
                    result.reward -
                    REWARD_STEP;

                if (
                    nextReward < 0n
                ) {

                    nextReward =
                        0n;
                }
            }

            const embed =
                new EmbedBuilder()
                    .setColor(0xC9A227)
                    .setTitle(
                        "✦ Daily Reward"
                    )
                    .setDescription(
                        `Welcome back, **${interaction.user.displayName}**.\n\n` +
                        "Your daily reward has been added to your journey."
                    )
                    .addFields(

                        {
                            name:
                                "🎁 Today's Claim",

                            value:
                                `**${result.reward.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🔥 Current Streak",

                            value:
                                `**${result.streak} day${result.streak === 1 ? "" : "s"}**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💬 Today's Thought",

                            value:
                                `*“${getDailyQuote()}”*`,

                            inline:
                                false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Daily Rewards"
                    });

            await interaction.editReply({
                embeds: [
                    embed
                ]
            });

            context.logger.info(
                `[Economy] ${interaction.user.tag} claimed ${result.reward.toString()} Nickel through the profile button in ${interaction.guild.name}. Streak: ${result.streak}.`
            );

        } catch (error) {

            if (
                error instanceof Error &&
                error.message ===
                    "ALREADY_CLAIMED"
            ) {

                try {

                    const account =
                        await database.db.economyAccount.findUnique({
                            where: {
                                guildId_discordId: {
                                    guildId:
                                        interaction.guild.id,

                                    discordId:
                                        interaction.user.id
                                }
                            }
                        });

                    const currentStreak =
                        account?.dailyStreak ??
                        0;

                    const embed =
                        new EmbedBuilder()
                            .setColor(0xC9A227)
                            .setTitle(
                                "✦ Daily Reward"
                            )
                            .setDescription(
                                `You've already claimed today's reward, **${interaction.user.displayName}**.\n\n` +
                                "Return tomorrow to continue your journey."
                            )
                            .addFields(

                                {
                                    name:
                                        "🎁 Today's Claim",

                                    value:
                                        "**Already Claimed**",

                                    inline:
                                        true
                                },

                                {
                                    name:
                                        "🔥 Current Streak",

                                    value:
                                        `**${currentStreak} day${currentStreak === 1 ? "" : "s"}**`,

                                    inline:
                                        true
                                },

                                {
                                    name:
                                        "💬 Today's Thought",

                                    value:
                                        `*“${getDailyQuote()}”*`,

                                    inline:
                                        false
                                }
                            )
                            .setFooter({
                                text:
                                    "Quill & Ink • Daily Rewards"
                            });

                    await interaction.editReply({
                        embeds: [
                            embed
                        ]
                    });

                } catch (accountError) {

                    context.logger.error(
                        "[Economy] Failed to load daily account after duplicate claim:",
                        accountError
                    );

                    await interaction.editReply({
                        content:
                            "⏰ You've already claimed today's daily reward. Come back tomorrow to continue your streak.",
                        embeds: []
                    });
                }

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INSUFFICIENT_INK_BANK"
            ) {

                await interaction.editReply({
                    content:
                        "⚠️ Your server's Ink Bank does not currently have enough Nickel to fund this daily reward.",
                    embeds: []
                });

                return;
            }

            context.logger.error(
                "[Economy] Profile daily reward failed:",
                error
            );

            try {

                await interaction.editReply({
                    content:
                        "❌ Something went wrong while processing your daily reward.",
                    embeds: []
                });

            } catch (replyError) {

                context.logger.error(
                    "[Economy] Failed to send profile daily error response:",
                    replyError
                );
            }
        }
    }

    /*
     * =========================
     * PROFILE → CARD
     * =========================
     */

    private async handleProfileCard(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await this.safeReply(
                interaction,
                "❌ Database service is currently unavailable."
            );

            return;
        }

        try {

            const accountService =
                context.services.get<EconomyAccountService>(
                    "economyAccountService"
                );

            if (!accountService) {

                await this.safeReply(
                    interaction,
                    "❌ Economy account service is currently unavailable."
                );

                return;
            }

            await accountService.processWeeklyWalletTax(
                interaction.guild.id,
                interaction.user.id
            );

            await accountService.ensureOperaCard(
                interaction.user.id
            );

            const card =
                await database.db.operaCard.findUnique({
                    where: {
                        discordId:
                            interaction.user.id
                    }
                });

            if (!card) {

                await this.safeReply(
                    interaction,
                    "❌ Failed to create or retrieve your Opera Card."
                );

                return;
            }

            const account =
                await database.db.economyAccount.findUnique({
                    where: {
                        guildId_discordId: {
                            guildId:
                                interaction.guild.id,

                            discordId:
                                interaction.user.id
                        }
                    }
                });

            const walletBalance =
                account?.wallet ??
                0n;

            const walletButton =
                new ButtonBuilder()
                    .setCustomId(
                        "card_wallet_transfer"
                    )
                    .setLabel(
                        "Transfer from Wallet"
                    )
                    .setEmoji(
                        "💰"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            const row =
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        walletButton
                    );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "💳 Opera Card"
                    )
                    .setDescription(
                        `Your personal **Opera Card** is ready, **${interaction.user.displayName}**.\n\n` +
                        "Move Nickel from your wallet into your card balance whenever you need it."
                    )
                    .addFields(

                        {
                            name:
                                "🪪 Card ID",

                            value:
                                `\`${card.cardCode}\``,

                            inline:
                                false
                        },

                        {
                            name:
                                "💳 Card Balance",

                            value:
                                `**${card.balance.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "👛 Wallet Balance",

                            value:
                                `**${walletBalance.toString()} Nickel**`,

                            inline:
                                true
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Opera Banking"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                components: [
                    row
                ],

                flags: 64
            });

            context.logger.info(
                `[Economy] ${interaction.user.tag} opened their Opera Card through the profile button in ${interaction.guild.name}.`
            );

        } catch (error) {

            context.logger.error(
                "[Economy] Profile card failed:",
                error
            );

            await this.safeReply(
                interaction,
                "❌ Something went wrong while opening your Opera Card."
            );
        }
    }

    /*
     * =========================
     * WALLET → CARD
     * =========================
     */

    private async handleWalletToCard(
        interaction: ButtonInteraction
    ): Promise<void> {

        const modal =
            new ModalBuilder()
                .setCustomId(
                    "card_wallet_transfer_modal"
                )
                .setTitle(
                    "Transfer Nickel to Card"
                );

        const amountInput =
            new TextInputBuilder()
                .setCustomId(
                    "card_wallet_transfer_amount"
                )
                .setLabel(
                    "Amount of Nickel"
                )
                .setPlaceholder(
                    "Minimum transfer: 50 Nickel"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(20);

        const row =
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    amountInput
                );

        modal.addComponents(
            row
        );

        try {

            await interaction.showModal(
                modal
            );

        } catch (error) {

            console.error(
                "[Economy] Failed to show wallet-to-card modal:",
                error
            );
        }
    }

    /*
     * =========================
     * WALLET → CARD SUBMIT
     * =========================
     */

    private async handleWalletToCardSubmit(
        interaction: ModalSubmitInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await this.safeReply(
                interaction,
                "❌ Database service is currently unavailable."
            );

            return;
        }

        const amountText =
            interaction.fields.getTextInputValue(
                "card_wallet_transfer_amount"
            ).trim();

        if (
            !/^\d+$/.test(
                amountText
            )
        ) {

            await this.safeReply(
                interaction,
                "❌ Please enter a valid whole-number Nickel amount."
            );

            return;
        }

        let amount: bigint;

        try {

            amount =
                BigInt(
                    amountText
                );

        } catch {

            await this.safeReply(
                interaction,
                "❌ The entered Nickel amount is invalid."
            );

            return;
        }

        const MINIMUM_TRANSFER =
            50n;

        if (
            amount <
            MINIMUM_TRANSFER
        ) {

            await this.safeReply(
                interaction,
                "❌ The minimum Opera Card transfer is 50 Nickel."
            );

            return;
        }

        const TRANSFER_TAX_PERCENT =
            5n;

        const PERCENT_BASE =
            100n;

        const tax =
            (
                amount *
                TRANSFER_TAX_PERCENT
            ) /
            PERCENT_BASE;

        const cardAmount =
            amount -
            tax;

        try {

            const result =
                await database.db.$transaction(
                    async (tx) => {

                        const account =
                            await tx.economyAccount.findUnique({
                                where: {
                                    guildId_discordId: {
                                        guildId:
                                            interaction.guild!.id,

                                        discordId:
                                            interaction.user.id
                                    }
                                }
                            });

                        if (!account) {

                            throw new Error(
                                "ACCOUNT_NOT_FOUND"
                            );
                        }

                        if (
                            account.wallet <
                            amount
                        ) {

                            throw new Error(
                                "INSUFFICIENT_WALLET"
                            );
                        }

                        const card =
                            await tx.operaCard.findUnique({
                                where: {
                                    discordId:
                                        interaction.user.id
                                }
                            });

                        if (!card) {

                            throw new Error(
                                "CARD_NOT_FOUND"
                            );
                        }

                        const inkBank =
                            await tx.inkBank.findUnique({
                                where: {
                                    guildId:
                                        interaction.guild!.id
                                }
                            });

                        if (!inkBank) {

                            throw new Error(
                                "INK_BANK_NOT_FOUND"
                            );
                        }

                        const updatedAccount =
                            await tx.economyAccount.update({

                                where: {
                                    id:
                                        account.id
                                },

                                data: {
                                    wallet: {
                                        decrement:
                                            amount
                                    }
                                }
                            });

                        if (
                            tax >
                            0n
                        ) {

                            await tx.inkBank.update({

                                where: {
                                    id:
                                        inkBank.id
                                },

                                data: {
                                    balance: {
                                        increment:
                                            tax
                                    }
                                }
                            });
                        }

                        const updatedCard =
                            await tx.operaCard.update({

                                where: {
                                    id:
                                        card.id
                                },

                                data: {

                                    balance: {
                                        increment:
                                            cardAmount
                                    },

                                    updatedAt:
                                        new Date()
                                }
                            });

                        return {
                            wallet:
                                updatedAccount.wallet,

                            card:
                                updatedCard.balance,

                            tax,

                            cardAmount
                        };
                    }
                );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "✅ Transfer Successful"
                    )
                    .setDescription(
                        "Your Nickel has been transferred from your wallet to your Opera Card."
                    )
                    .addFields(

                        {
                            name:
                                "💰 Wallet Deducted",

                            value:
                                `**${amount.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🏦 Bank Tax",

                            value:
                                `**${result.tax.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💳 Card Received",

                            value:
                                `**${result.cardAmount.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "👛 Wallet",

                            value:
                                `**${result.wallet.toString()} Nickel**`,

                            inline:
                                true
                        },

                        {
                            name:
                                "💳 Opera Card",

                            value:
                                `**${result.card.toString()} Nickel**`,

                            inline:
                                true
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Opera Banking • 5% Transfer Tax"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],

                flags: 64
            });

            context.logger.info(
                `[Economy] ${interaction.user.tag} transferred ${amount.toString()} Nickel from wallet to Opera Card in ${interaction.guild.name}. Tax: ${result.tax.toString()} Nickel. Card received: ${result.cardAmount.toString()} Nickel.`
            );

        } catch (error) {

            if (
                error instanceof Error &&
                error.message ===
                    "ACCOUNT_NOT_FOUND"
            ) {

                await this.safeReply(
                    interaction,
                    "❌ Your wallet account could not be found."
                );

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INSUFFICIENT_WALLET"
            ) {

                await this.safeReply(
                    interaction,
                    "❌ You don't have enough Nickel in your wallet for this transfer."
                );

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "CARD_NOT_FOUND"
            ) {

                await this.safeReply(
                    interaction,
                    "❌ Your Opera Card could not be found."
                );

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INK_BANK_NOT_FOUND"
            ) {

                await this.safeReply(
                    interaction,
                    "❌ Your server's Ink Bank could not be found."
                );

                return;
            }

            context.logger.error(
                "[Economy] Wallet to card transfer failed:",
                error
            );

            await this.safeReply(
                interaction,
                "❌ Something went wrong while processing the transfer."
            );
        }
    }

    /*
     * =========================
     * MESSAGE ACTIVITY
     * =========================
     */

    private async handleMessageActivity(
        message: Message,
        context: PluginContext
    ): Promise<void> {

        if (!message.guild) {
            return;
        }

        if (message.author.bot) {
            return;
        }

        const economyEnabled =
            context.guildPlugins.isEnabled(
                message.guild.id,
                "economy"
            );

        if (!economyEnabled) {
            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            context.logger.error(
                "[Economy] Database service not found."
            );

            return;
        }

        try {

            const accountService =
                context.services.get<EconomyAccountService>(
                    "economyAccountService"
                );

            if (
                accountService
            ) {

                await accountService.processWeeklyWalletTax(
                    message.guild.id,
                    message.author.id
                );
            }

        } catch (error) {

            context.logger.error(
                "[Economy] Weekly wallet tax processing failed:",
                error
            );
        }

        const earningChannel =
            await database.db.nickelEarningChannel.findUnique({
                where: {
                    guildId_channelId: {
                        guildId:
                            message.guild.id,

                        channelId:
                            message.channel.id
                    }
                }
            });

        if (!earningChannel) {
            return;
        }

        const currentMinute =
            Math.floor(
                Date.now() / 60_000
            );

        const activityKey =
            `${message.guild.id}:${message.author.id}`;

        const previousMinute =
            activeMembers.get(
                activityKey
            );

        if (
            previousMinute ===
            currentMinute
        ) {
            return;
        }

        activeMembers.set(
            activityKey,
            currentMinute
        );

        const reward =
            BigInt(
                Math.floor(
                    Math.random() * 5
                ) + 2
            );

        try {

            await database.db.$transaction(
                async (tx) => {

                    const account =
                        await tx.economyAccount.upsert({

                            where: {
                                guildId_discordId: {
                                    guildId:
                                        message.guild!.id,

                                    discordId:
                                        message.author.id
                                }
                            },

                            update: {},

                            create: {
                                guildId:
                                    message.guild!.id,

                                discordId:
                                    message.author.id,

                                wallet:
                                    0n
                            }
                        });

                    const inkBank =
                        await tx.inkBank.findUnique({

                            where: {
                                guildId:
                                    message.guild!.id
                            }
                        });

                    if (!inkBank) {

                        throw new Error(
                            "INK_BANK_NOT_FOUND"
                        );
                    }

                    const reserveUpdate =
                        await tx.inkBank.updateMany({

                            where: {
                                guildId:
                                    message.guild!.id,

                                balance: {
                                    gte:
                                        reward
                                }
                            },

                            data: {
                                balance: {
                                    decrement:
                                        reward
                                }
                            }
                        });

                    if (
                        reserveUpdate.count !==
                        1
                    ) {

                        throw new Error(
                            "INSUFFICIENT_INK_BANK"
                        );
                    }

                    await tx.economyAccount.update({

                        where: {
                            id:
                                account.id
                        },

                        data: {
                            wallet: {
                                increment:
                                    reward
                            }
                        }
                    });
                }
            );

            context.logger.info(
                `[Economy] ${message.author.tag} earned ${reward.toString()} Nickel in ${message.guild.name} during minute ${currentMinute}.`
            );

        } catch (error) {

            activeMembers.delete(
                activityKey
            );

            if (
                error instanceof Error &&
                error.message ===
                    "INSUFFICIENT_INK_BANK"
            ) {

                context.logger.warn(
                    `[Economy] Unable to award ${reward.toString()} Nickel to ${message.author.tag} in ${message.guild.name}: insufficient Ink Bank reserve.`
                );

                return;
            }

            if (
                error instanceof Error &&
                error.message ===
                    "INK_BANK_NOT_FOUND"
            ) {

                context.logger.warn(
                    `[Economy] Unable to award message activity reward in ${message.guild.name}: Ink Bank not found.`
                );

                return;
            }

            context.logger.error(
                "[Economy] Failed to award message activity reward:",
                error
            );
        }
    }

    /*
     * =========================
     * ADD CHANNEL
     * =========================
     */

    private async handleAddChannel(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const selector =
            new ChannelSelectMenuBuilder()
                .setCustomId(
                    "economy_nickel_channel_select"
                )
                .setPlaceholder(
                    "Select a channel where Nickel can be earned"
                )
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement
                )
                .setMinValues(1)
                .setMaxValues(1);

        const row =
            new ActionRowBuilder<ChannelSelectMenuBuilder>()
                .addComponents(
                    selector
                );

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "💰 Nickel Earning Channels"
                )
                .setDescription(
                    "Choose a channel where members can earn Nickel by participating in conversations.\n\n" +
                    "Members can earn **once per minute**, regardless of how many messages they send during that minute."
                )
                .addFields({
                    name:
                        "🎯 Reward",

                    value:
                        "**2–6 Nickel** per eligible minute",

                    inline:
                        true
                })
                .setFooter({
                    text:
                        "Quill & Ink • Economy Configuration"
                });

        try {

            await interaction.reply({
                embeds: [
                    embed
                ],

                components: [
                    row
                ],

                flags: 64
            });

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to open add Nickel channel selector:",
                error
            );
        }
    }

    /*
     * =========================
     * ADD CHANNEL SELECT
     * =========================
     */

    private async handleChannelSelect(
        interaction: ChannelSelectMenuInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const channelId =
            interaction.values[0];

        if (!channelId) {

            await this.safeUpdate(
                interaction,
                "❌ No channel was selected."
            );

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await this.safeUpdate(
                interaction,
                "❌ Database service is currently unavailable."
            );

            return;
        }

        try {

            const existing =
                await database.db.nickelEarningChannel.findUnique({
                    where: {
                        guildId_channelId: {
                            guildId:
                                interaction.guild.id,

                            channelId
                        }
                    }
                });

            if (existing) {

                await this.safeUpdate(
                    interaction,
                    `⚠️ <#${channelId}> is already a Nickel earning channel.`
                );

                return;
            }

            await database.db.nickelEarningChannel.create({
                data: {
                    guildId:
                        interaction.guild.id,

                    channelId
                }
            });

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "✅ Earning Channel Added"
                    )
                    .setDescription(
                        `<#${channelId}> can now generate Nickel for active members.`
                    )
                    .addFields({
                        name:
                            "💰 Reward Rate",

                        value:
                            "**2–6 Nickel per minute**",

                        inline:
                            true
                    })
                    .setFooter({
                        text:
                            "Quill & Ink • Economy Configuration"
                    });

            await interaction.update({
                embeds: [
                    embed
                ],

                content:
                    "",

                components: []
            });

            context.logger.info(
                `[Economy] Nickel earning channel added: ${channelId} in ${interaction.guild.id}`
            );

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to add Nickel earning channel:",
                error
            );

            await this.safeUpdate(
                interaction,
                "❌ Something went wrong while adding that Nickel earning channel."
            );
        }
    }

    /*
     * =========================
     * REMOVE CHANNEL
     * =========================
     */

    private async handleRemoveChannel(
        interaction: ButtonInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await this.safeReply(
                interaction,
                "❌ Database service is currently unavailable."
            );

            return;
        }

        try {

            const channels =
                await database.db.nickelEarningChannel.findMany({
                    where: {
                        guildId:
                            interaction.guild.id
                    },

                    orderBy: {
                        createdAt:
                            "asc"
                    }
                });

            if (
                channels.length ===
                0
            ) {

                await this.safeReply(
                    interaction,
                    "⚠️ There are currently no Nickel earning channels to remove."
                );

                return;
            }

            const selector =
                new ChannelSelectMenuBuilder()
                    .setCustomId(
                        "economy_nickel_remove_select"
                    )
                    .setPlaceholder(
                        "Select a Nickel earning channel to remove"
                    )
                    .addChannelTypes(
                        ChannelType.GuildText,
                        ChannelType.GuildAnnouncement
                    )
                    .setMinValues(1)
                    .setMaxValues(1);

            const row =
                new ActionRowBuilder<ChannelSelectMenuBuilder>()
                    .addComponents(
                        selector
                    );

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🗑️ Remove Nickel Earning Channel"
                    )
                    .setDescription(
                        "Select the channel you want to remove from the Nickel earning system."
                    )
                    .addFields({
                        name:
                            "⚠️ Important",

                        value:
                            "Removing a channel stops members from earning Nickel there. Existing Nickel is not affected.",

                        inline:
                            false
                    })
                    .setFooter({
                        text:
                            "Quill & Ink • Economy Configuration"
                    });

            await interaction.reply({
                embeds: [
                    embed
                ],

                components: [
                    row
                ],

                flags: 64
            });

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to load Nickel earning channels:",
                error
            );

            await this.safeReply(
                interaction,
                "❌ Something went wrong while loading the Nickel earning channels."
            );
        }
    }

    /*
     * =========================
     * REMOVE CHANNEL SELECT
     * =========================
     */

    private async handleRemoveChannelSelect(
        interaction: ChannelSelectMenuInteraction,
        context: PluginContext
    ): Promise<void> {

        if (!interaction.guild) {

            await this.safeReply(
                interaction,
                "❌ This can only be used in a server."
            );

            return;
        }

        const channelId =
            interaction.values[0];

        if (!channelId) {

            await this.safeUpdate(
                interaction,
                "❌ No channel was selected."
            );

            return;
        }

        const database =
            context.services.get<PrismaService>(
                "database"
            );

        if (!database) {

            await this.safeUpdate(
                interaction,
                "❌ Database service is currently unavailable."
            );

            return;
        }

        try {

            const existing =
                await database.db.nickelEarningChannel.findUnique({
                    where: {
                        guildId_channelId: {
                            guildId:
                                interaction.guild.id,

                            channelId
                        }
                    }
                });

            if (!existing) {

                await this.safeUpdate(
                    interaction,
                    `⚠️ <#${channelId}> is not currently a Nickel earning channel.`
                );

                return;
            }

            await database.db.nickelEarningChannel.delete({
                where: {
                    guildId_channelId: {
                        guildId:
                            interaction.guild.id,

                        channelId
                    }
                }
            });

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "✅ Earning Channel Removed"
                    )
                    .setDescription(
                        `<#${channelId}> has been removed from the Nickel earning system.`
                    )
                    .addFields({
                        name:
                            "💰 Existing Nickel",

                        value:
                            "Members keep all Nickel they have already earned.",

                        inline:
                            false
                    })
                    .setFooter({
                        text:
                            "Quill & Ink • Economy Configuration"
                    });

            await interaction.update({
                embeds: [
                    embed
                ],

                content:
                    "",

                components: []
            });

            context.logger.info(
                `[Economy] Nickel earning channel removed: ${channelId} in ${interaction.guild.id}`
            );

        } catch (error) {

            context.logger.error(
                "[Economy] Failed to remove Nickel earning channel:",
                error
            );

            await this.safeUpdate(
                interaction,
                "❌ Something went wrong while removing that Nickel earning channel."
            );
        }
    }

    /*
     * =========================
     * SAFE REPLY
     * =========================
     */

    private async safeReply(
        interaction:
            ButtonInteraction |
            ChannelSelectMenuInteraction |
            ModalSubmitInteraction,

        content: string
    ): Promise<void> {

        try {

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.editReply({
                    content,
                    embeds: [],
                    components: []
                });

                return;
            }

            await interaction.reply({
                content,
                flags: 64
            });

        } catch {
            /*
             * Interaction token may have expired.
             */
        }
    }

    /*
     * =========================
     * SAFE UPDATE
     * =========================
     */

    private async safeUpdate(
        interaction:
            ChannelSelectMenuInteraction,

        content: string
    ): Promise<void> {

        try {

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.editReply({
                    content,
                    embeds: [],
                    components: []
                });

                return;
            }

            await interaction.update({
                content,
                embeds: [],
                components: []
            });

        } catch {
            /*
             * Interaction may have expired.
             */
        }
    }
}

/*
 * =========================
 * DAILY QUOTES
 * =========================
 */

const DAILY_QUOTES = [
    "Every new day is another page waiting to be written.",
    "A small reward today. A stronger streak tomorrow.",
    "Consistency turns small moments into great stories.",
    "Another day, another page in your journey.",
    "Keep showing up. Your story is still being written.",
    "Fortune favours those who return.",
    "The finest journeys are built one day at a time.",
    "Another day has been added to your tale."
];

function getDailyQuote(): string {

    const index =
        Math.floor(
            Math.random() *
            DAILY_QUOTES.length
        );

    return DAILY_QUOTES[index];
}


END FILE: src/plugins/economy/EconomyPlugin.ts
================================================================================

FILE: src/plugins/economy/plugin.json
--------------------------------------------------------------------------------
Original size: 120 bytes
Exported size: 115 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
  "id": "economy",
  "name": "Economy",
  "version": "1.0.0",
  "description": "Economy system for Quill & Ink"
}

END FILE: src/plugins/economy/plugin.json
================================================================================

FILE: src/plugins/economy/services/EconomyAccountService.ts
--------------------------------------------------------------------------------
Original size: 122726 bytes
Exported size: 118156 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    randomInt,
    randomUUID
} from "node:crypto";

import { PrismaService } from "../../../core/database/PrismaService.js";

export class EconomyAccountService {

    private static readonly BANK_CAPACITY =
        100_000n;

    private static readonly BANK_MATURITY_DAYS =
        30;

    private static readonly BANK_INTEREST_PERCENT =
        2n;

    private static readonly BANK_INTEREST_BASE =
        100n;

    private static readonly CARD_CODE_LENGTH =
        25;

    private static readonly ROBBERY_MINIMUM_WALLET =
        100n;

    private static readonly ROBBERY_STEAL_PERCENT =
        25n;

    private static readonly POLICE_RESCUE_PERCENT =
        5n;

    private static readonly PERCENT_BASE =
        100n;

    /*
     * =========================
     * WALLET TAX
     * =========================
     */

    private static readonly WALLET_TAX_PERCENT =
        5n;

    private static readonly WALLET_TAX_THRESHOLD =
        500n;

    private static readonly WALLET_TAX_INTERVAL_DAYS =
        7;

    /*
     * =========================
     * WALLET -> OPERA CARD TAX
     * =========================
     */

    private static readonly CARD_TRANSFER_TAX_PERCENT =
        5n;

    private static readonly CARD_TRANSFER_MINIMUM =
        50n;

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * ENSURE ACCOUNTS
     * =========================
     *
     * Makes sure the member has:
     *
     * - Economy Account
     * - Bank Locker
     * - Opera Card
     *
     * Safe to call repeatedly.
     *
     * No Nickel is created here.
     */

    async ensureAccounts(
        guildId: string,
        discordId: string
    ): Promise<void> {

        await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * ECONOMY ACCOUNT
                 * =========================
                 */

                await tx.economyAccount.upsert({

                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId
                        }
                    },

                    create: {
                        guildId,
                        discordId,
                        wallet: 0n
                    },

                    update: {}
                });

                /*
                 * =========================
                 * BANK LOCKER
                 * =========================
                 */

                const now =
                    new Date();

                await tx.bankLocker.upsert({

                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId
                        }
                    },

                    create: {
                        guildId,
                        discordId,
                        balance: 0n,
                        capacity:
                            EconomyAccountService.BANK_CAPACITY,
                        depositedAt:
                            now,
                        maturityAt:
                            new Date(
                                now.getTime() +
                                EconomyAccountService.BANK_MATURITY_DAYS *
                                24 *
                                60 *
                                60 *
                                1000
                            )
                    },

                    update: {}
                });

                /*
                 * =========================
                 * OPERA CARD
                 * =========================
                 */

                await this.ensureOperaCardWithClient(
                    tx,
                    discordId
                );
            }
        );
    }

    /*
     * =========================
     * WEEKLY WALLET TAX
     * =========================
     *
     * Applies a fixed 5% tax once every
     * 7 days when the member's current
     * wallet balance is above 500 Nickel.
     *
     * The tax is calculated from the
     * wallet balance at the moment the
     * tax runs.
     *
     * 100% of the tax goes into the
     * server's Ink Bank.
     *
     * This is a system deduction and
     * therefore does NOT respect robbery
     * locks.
     *
     * No Nickel is minted.
     *
     * The operation is fully atomic.
     *
     * If the Ink Bank cannot fund the
     * corresponding transfer, the entire
     * transaction is rolled back.
     */

    async processWeeklyWalletTax(
        guildId: string,
        discordId: string
    ): Promise<{
        applied: boolean;
        tax: bigint;
        walletBefore: bigint;
        walletAfter: bigint;
        nextTaxAt: Date | null;
    }> {

        return await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * FIND ACCOUNT
                 * =========================
                 */

                const account =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        }
                    });

                if (!account) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                const now =
                    new Date();

                /*
                 * =========================
                 * CHECK TAX INTERVAL
                 * =========================
                 */

                if (
                    account.lastWalletTaxAt
                ) {

                    const nextTaxAt =
                        new Date(
                            account.lastWalletTaxAt.getTime() +
                            EconomyAccountService.WALLET_TAX_INTERVAL_DAYS *
                            24 *
                            60 *
                            60 *
                            1000
                        );

                    if (
                        nextTaxAt >
                        now
                    ) {

                        return {

                            applied:
                                false,

                            tax:
                                0n,

                            walletBefore:
                                account.wallet,

                            walletAfter:
                                account.wallet,

                            nextTaxAt
                        };
                    }
                }

                /*
                 * =========================
                 * TAX DUE CONDITION
                 * =========================
                 *
                 * The actual mutation below must
                 * also verify that the tax is still
                 * due. This prevents two concurrent
                 * requests from both applying the
                 * same weekly tax.
                 */

                const taxDueCondition =
                    account.lastWalletTaxAt === null
                        ? {
                            lastWalletTaxAt:
                                null
                        }
                        : {
                            lastWalletTaxAt: {
                                lte:
                                    now
                            }
                        };

                /*
                 * =========================
                 * THRESHOLD CHECK
                 * =========================
                 *
                 * A wallet of 500 Nickel or
                 * less is not taxed.
                 */

                if (
                    account.wallet <=
                    EconomyAccountService.WALLET_TAX_THRESHOLD
                ) {

                    const taxCycleUpdate =
                        await tx.economyAccount.updateMany({

                            where: {

                                id:
                                    account.id,

                                ...taxDueCondition
                            },

                            data: {

                                lastWalletTaxAt:
                                    now
                            }
                        });

                    if (
                        taxCycleUpdate.count !== 1
                    ) {

                        const latestAccount =
                            await tx.economyAccount.findUnique({

                                where: {
                                    id:
                                        account.id
                                }
                            });

                        if (!latestAccount) {

                            throw new Error(
                                "ECONOMY_ACCOUNT_NOT_FOUND"
                            );
                        }

                        const latestNextTaxAt =
                            latestAccount.lastWalletTaxAt
                                ? new Date(
                                    latestAccount.lastWalletTaxAt.getTime() +
                                    EconomyAccountService.WALLET_TAX_INTERVAL_DAYS *
                                    24 *
                                    60 *
                                    60 *
                                    1000
                                )
                                : null;

                        return {

                            applied:
                                false,

                            tax:
                                0n,

                            walletBefore:
                                latestAccount.wallet,

                            walletAfter:
                                latestAccount.wallet,

                            nextTaxAt:
                                latestNextTaxAt
                        };
                    }

                    const nextTaxAt =
                        new Date(
                            now.getTime() +
                            EconomyAccountService.WALLET_TAX_INTERVAL_DAYS *
                            24 *
                            60 *
                            60 *
                            1000
                        );

                    return {

                        applied:
                            false,

                        tax:
                            0n,

                        walletBefore:
                            account.wallet,

                        walletAfter:
                            account.wallet,

                        nextTaxAt
                    };
                }

                /*
                 * =========================
                 * CALCULATE TAX
                 * =========================
                 *
                 * BigInt division intentionally
                 * floors fractional Nickel.
                 *
                 * Example:
                 *
                 * 1,000 -> 50 tax
                 * 501   -> 25 tax
                 */

                const walletBefore =
                    account.wallet;

                const tax =
                    (
                        walletBefore *
                        EconomyAccountService.WALLET_TAX_PERCENT
                    ) /
                    EconomyAccountService.PERCENT_BASE;

                /*
                 * =========================
                 * FIND INK BANK
                 * =========================
                 */

                const inkBank =
                    await tx.inkBank.findUnique({

                        where: {
                            guildId
                        }
                    });

                if (!inkBank) {

                    throw new Error(
                        "INK_BANK_NOT_FOUND"
                    );
                }

                /*
                 * =========================
                 * MOVE TAX TO INK BANK
                 * =========================
                 *
                 * The tax is removed from the
                 * player's wallet and transferred
                 * to the server reserve.
                 *
                 * The tax-due condition is repeated
                 * on the actual mutation so only one
                 * concurrent request can claim the
                 * current tax cycle.
                 */

                const walletUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                account.id,

                            wallet: {
                                gte:
                                    tax
                            },

                            ...taxDueCondition
                        },

                        data: {

                            wallet: {
                                decrement:
                                    tax
                            },

                            lastWalletTaxAt:
                                now
                        }
                    });

                if (
                    walletUpdate.count !== 1
                ) {

                    const latestAccount =
                        await tx.economyAccount.findUnique({

                            where: {
                                id:
                                    account.id
                            }
                        });

                    if (!latestAccount) {

                        throw new Error(
                            "ECONOMY_ACCOUNT_NOT_FOUND"
                        );
                    }

                    const latestNextTaxAt =
                        latestAccount.lastWalletTaxAt
                            ? new Date(
                                latestAccount.lastWalletTaxAt.getTime() +
                                EconomyAccountService.WALLET_TAX_INTERVAL_DAYS *
                                24 *
                                60 *
                                60 *
                                1000
                            )
                            : null;

                    return {

                        applied:
                            false,

                        tax:
                            0n,

                        walletBefore:
                            latestAccount.wallet,

                        walletAfter:
                            latestAccount.wallet,

                        nextTaxAt:
                            latestNextTaxAt
                    };
                }

                await tx.inkBank.update({

                    where: {
                        guildId
                    },

                    data: {

                        balance: {
                            increment:
                                tax
                        }
                    }
                });

                const walletAfter =
                    walletBefore -
                    tax;

                const nextTaxAt =
                    new Date(
                        now.getTime() +
                        EconomyAccountService.WALLET_TAX_INTERVAL_DAYS *
                        24 *
                        60 *
                        60 *
                        1000
                    );

                return {

                    applied:
                        true,

                    tax,

                    walletBefore,

                    walletAfter,

                    nextTaxAt
                };
            }
        );
    }

    /*
     * =========================
     * WALLET -> OPERA CARD
     * =========================
     *
     * Transfers Nickel from the member's
     * server wallet into their GLOBAL
     * Opera Card.
     *
     * Minimum transfer:
     *
     * 50 Nickel
     *
     * Fixed tax:
     *
     * 5%
     *
     * The requested amount is fully removed
     * from the wallet.
     *
     * The tax goes to the server's Ink Bank.
     *
     * The remaining 95% goes to the global
     * Opera Card.
     *
     * BigInt division floors fractional tax.
     *
     * Example:
     *
     * 1,000 requested
     *
     * Wallet:
     * -1,000
     *
     * Tax:
     * +50 Ink Bank
     *
     * Opera Card:
     * +950
     *
     * Example:
     *
     * 50 requested
     *
     * Tax:
     * 2
     *
     * Opera Card:
     * 48
     *
     * The operation is fully atomic.
     *
     * No Nickel is minted.
     *
     * Robbery locks are respected because
     * this is an outgoing wallet mutation.
     */

    async transferWalletToOperaCard(
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<{
        requested: bigint;
        tax: bigint;
        cardReceived: bigint;
        walletBefore: bigint;
        walletAfter: bigint;
        cardBalance: bigint;
    }> {

        this.validatePositiveAmount(
            amount,
            "Opera Card transfer"
        );

        if (
            amount <
            EconomyAccountService.CARD_TRANSFER_MINIMUM
        ) {

            throw new Error(
                "OPERA_CARD_TRANSFER_BELOW_MINIMUM"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * FIND ACCOUNT
                 * =========================
                 */

                const account =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        }
                    });

                if (!account) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                const now =
                    new Date();

                /*
                 * =========================
                 * ROBBERY LOCK CHECK
                 * =========================
                 */

                if (
                    account.robberyLockSessionId &&
                    account.robberyLockUntil &&
                    account.robberyLockUntil >
                    now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                /*
                 * =========================
                 * WALLET BALANCE CHECK
                 * =========================
                 */

                if (
                    account.wallet <
                    amount
                ) {

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * CALCULATE TAX
                 * =========================
                 *
                 * Fixed 5% tax.
                 *
                 * BigInt division floors any
                 * fractional Nickel.
                 */

                const tax =
                    (
                        amount *
                        EconomyAccountService.CARD_TRANSFER_TAX_PERCENT
                    ) /
                    EconomyAccountService.PERCENT_BASE;

                const cardReceived =
                    amount -
                    tax;

                /*
                 * =========================
                 * FIND INK BANK
                 * =========================
                 */

                const inkBank =
                    await tx.inkBank.findUnique({

                        where: {
                            guildId
                        }
                    });

                if (!inkBank) {

                    throw new Error(
                        "INK_BANK_NOT_FOUND"
                    );
                }

                /*
                 * =========================
                 * ENSURE GLOBAL OPERA CARD
                 * =========================
                 */

                const card =
                    await this.ensureOperaCardWithClient(
                        tx,
                        discordId
                    );

                /*
                 * =========================
                 * WALLET WITHDRAWAL
                 * =========================
                 *
                 * Repeat the robbery-lock and
                 * balance conditions directly
                 * on the mutation so the actual
                 * withdrawal remains atomic.
                 */

                const walletUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                account.id,

                            wallet: {
                                gte:
                                    amount
                            },

                            OR: [

                                {
                                    robberyLockSessionId:
                                        null
                                },

                                {
                                    robberyLockUntil:
                                        null
                                },

                                {
                                    robberyLockUntil: {
                                        lte:
                                            new Date()
                                    }
                                }
                            ]
                        },

                        data: {

                            wallet: {
                                decrement:
                                    amount
                            }
                        }
                    });

                if (
                    walletUpdate.count !== 1
                ) {

                    const latestAccount =
                        await tx.economyAccount.findUnique({

                            where: {
                                id:
                                    account.id
                            },

                            select: {

                                robberyLockSessionId:
                                    true,

                                robberyLockUntil:
                                    true
                            }
                        });

                    if (
                        latestAccount?.robberyLockSessionId &&
                        latestAccount.robberyLockUntil &&
                        latestAccount.robberyLockUntil >
                        new Date()
                    ) {

                        throw new Error(
                            "ROBBERY_LOCKED"
                        );
                    }

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * ADD TAX TO INK BANK
                 * =========================
                 */

                await tx.inkBank.update({

                    where: {
                        guildId
                    },

                    data: {

                        balance: {
                            increment:
                                tax
                        }
                    }
                });

                /*
                 * =========================
                 * ADD NET AMOUNT TO CARD
                 * =========================
                 *
                 * Opera Card is global.
                 *
                 * There is intentionally
                 * no card capacity.
                 */

                const cardUpdate =
                    await tx.operaCard.update({

                        where: {
                            id:
                                card.id
                        },

                        data: {

                            balance: {
                                increment:
                                    cardReceived
                            },

                            updatedAt:
                                new Date()
                        }
                    });

                const walletAfter =
                    account.wallet -
                    amount;

                return {

                    requested:
                        amount,

                    tax,

                    cardReceived,

                    walletBefore:
                        account.wallet,

                    walletAfter,

                    cardBalance:
                        cardUpdate.balance
                };
            }
        );
    }

    /*
     * =========================
     * BANK LOCKER DEPOSIT
     * =========================
     *
     * Deposits Nickel from the member's
     * server wallet into the Bank Locker.
     *
     * Every deposit receives its own
     * independent 30-day maturity date.
     *
     * Example:
     *
     * Sep 16 -> Oct 16
     * Sep 20 -> Oct 20
     *
     * Deposits do not reset or extend
     * one another.
     *
     * The Opera Card is never involved.
     *
     * Depositing is an outgoing wallet
     * mutation and therefore respects
     * an active robbery lock.
     *
     * No Nickel is created here.
     */

    async depositToBankLocker(
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<{
        depositId: string;
        amount: bigint;
        maturityAt: Date;
        lockerBalance: bigint;
    }> {

        this.validatePositiveAmount(
            amount,
            "Bank Locker deposit"
        );

        return await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * FIND ECONOMY ACCOUNT
                 * =========================
                 */

                const account =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        }
                    });

                if (!account) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                const now =
                    new Date();

                /*
                 * =========================
                 * ROBBERY LOCK CHECK
                 * =========================
                 */

                if (
                    account.robberyLockSessionId &&
                    account.robberyLockUntil &&
                    account.robberyLockUntil > now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                /*
                 * =========================
                 * WALLET BALANCE CHECK
                 * =========================
                 */

                if (
                    account.wallet <
                    amount
                ) {

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * ENSURE BANK LOCKER
                 * =========================
                 */

                const locker =
                    await tx.bankLocker.upsert({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        },

                        create: {
                            guildId,
                            discordId,
                            balance: 0n,
                            capacity:
                                EconomyAccountService.BANK_CAPACITY,
                            depositedAt:
                                now,
                            maturityAt:
                                new Date(
                                    now.getTime() +
                                    EconomyAccountService.BANK_MATURITY_DAYS *
                                    24 *
                                    60 *
                                    60 *
                                    1000
                                )
                        },

                        update: {}
                    });

                /*
                 * =========================
                 * CAPACITY CHECK
                 * =========================
                 */

                if (
                    locker.balance +
                    amount >
                    locker.capacity
                ) {

                    throw new Error(
                        "BANK_LOCKER_CAPACITY_EXCEEDED"
                    );
                }

                /*
                 * =========================
                 * MATURITY DATE
                 * =========================
                 */

                const maturityAt =
                    new Date(
                        now.getTime() +
                        EconomyAccountService.BANK_MATURITY_DAYS *
                        24 *
                        60 *
                        60 *
                        1000
                    );

                /*
                 * =========================
                 * WALLET WITHDRAWAL
                 * =========================
                 *
                 * Repeat the robbery-lock and
                 * balance conditions directly
                 * on the UPDATE so the actual
                 * mutation remains atomic.
                 */

                const walletUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                account.id,

                            wallet: {
                                gte:
                                    amount
                            },

                            OR: [

                                {
                                    robberyLockSessionId:
                                        null
                                },

                                {
                                    robberyLockUntil:
                                        null
                                },

                                {
                                    robberyLockUntil: {
                                        lte:
                                            new Date()
                                    }
                                }
                            ]
                        },

                        data: {

                            wallet: {
                                decrement:
                                    amount
                            }
                        }
                    });

                if (
                    walletUpdate.count !== 1
                ) {

                    const latestAccount =
                        await tx.economyAccount.findUnique({

                            where: {
                                id:
                                    account.id
                            },

                            select: {

                                robberyLockSessionId:
                                    true,

                                robberyLockUntil:
                                    true
                            }
                        });

                    if (
                        latestAccount?.robberyLockSessionId &&
                        latestAccount.robberyLockUntil &&
                        latestAccount.robberyLockUntil >
                        new Date()
                    ) {

                        throw new Error(
                            "ROBBERY_LOCKED"
                        );
                    }

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * CREATE INDEPENDENT DEPOSIT
                 * =========================
                 */

                const deposit =
                    await tx.bankLockerDeposit.create({

                        data: {

                            lockerId:
                                locker.id,

                            amount,

                            depositedAt:
                                now,

                            maturityAt
                        }
                    });

                /*
                 * =========================
                 * UPDATE LOCKER TOTAL
                 * =========================
                 *
                 * BankLocker.balance is kept as
                 * the authoritative total currently
                 * held by the locker.
                 */

                const updatedLocker =
                    await tx.bankLocker.update({

                        where: {
                            id:
                                locker.id
                        },

                        data: {

                            balance: {
                                increment:
                                    amount
                            }
                        }
                    });

                return {

                    depositId:
                        deposit.id,

                    amount:
                        deposit.amount,

                    maturityAt:
                        deposit.maturityAt,

                    lockerBalance:
                        updatedLocker.balance
                };
            }
        );
    }

    /*
     * =========================
     * GET BANK LOCKER
     * =========================
     *
     * Returns the member's current
     * locker and all active deposits.
     *
     * Deposits are independent and are
     * evaluated against their own maturity
     * timestamps.
     *
     * Interest shown here is calculated
     * for display only.
     *
     * No Nickel is created by this method.
     */

    async getBankLocker(
        guildId: string,
        discordId: string
    ): Promise<{
        locker: {
            id: string;
            guildId: string;
            discordId: string;
            balance: bigint;
            capacity: bigint;
        };
        deposits: Array<{
            id: string;
            amount: bigint;
            depositedAt: Date;
            maturityAt: Date;
            withdrawnAt: Date | null;
            interest: bigint;
            total: bigint;
            matured: boolean;
        }>;
        maturedAmount: bigint;
        upcomingAmount: bigint;
    }> {

        const locker =
            await this.database.db.bankLocker.findUnique({

                where: {
                    guildId_discordId: {
                        guildId,
                        discordId
                    }
                },

                select: {

                    id:
                        true,

                    guildId:
                        true,

                    discordId:
                        true,

                    balance:
                        true,

                    capacity:
                        true,

                    deposits: {

                        where: {
                            withdrawnAt:
                                null
                        },

                        orderBy: {
                            maturityAt:
                                "asc"
                        }
                    }
                }
            });

        if (!locker) {

            throw new Error(
                "BANK_LOCKER_NOT_FOUND"
            );
        }

        const now =
            new Date();

        let maturedAmount =
            0n;

        let upcomingAmount =
            0n;

        const deposits =
            locker.deposits.map(
                (deposit) => {

                    const interest =
                        (
                            deposit.amount *
                            EconomyAccountService.BANK_INTEREST_PERCENT
                        ) /
                        EconomyAccountService.BANK_INTEREST_BASE;

                    const total =
                        deposit.amount +
                        interest;

                    const matured =
                        deposit.maturityAt <=
                        now;

                    if (matured) {

                        maturedAmount +=
                            total;

                    } else {

                        upcomingAmount +=
                            deposit.amount;
                    }

                    return {

                        id:
                            deposit.id,

                        amount:
                            deposit.amount,

                        depositedAt:
                            deposit.depositedAt,

                        maturityAt:
                            deposit.maturityAt,

                        withdrawnAt:
                            deposit.withdrawnAt,

                        interest,

                        total,

                        matured
                    };
                }
            );

        return {

            locker: {

                id:
                    locker.id,

                guildId:
                    locker.guildId,

                discordId:
                    locker.discordId,

                balance:
                    locker.balance,

                capacity:
                    locker.capacity
            },

            deposits,

            maturedAmount,

            upcomingAmount
        };
    }

    /*
     * =========================
     * GET BANK LOCKER DEPOSITS
     * =========================
     *
     * Returns all deposits belonging
     * to the member's Bank Locker.
     *
     * Withdrawn deposits remain in the
     * database as historical records.
     *
     * Interest is calculated for display
     * only and is not minted here.
     */

    async getBankLockerDeposits(
        guildId: string,
        discordId: string
    ) {

        const locker =
            await this.database.db.bankLocker.findUnique({

                where: {
                    guildId_discordId: {
                        guildId,
                        discordId
                    }
                },

                select: {
                    id:
                        true
                }
            });

        if (!locker) {

            throw new Error(
                "BANK_LOCKER_NOT_FOUND"
            );
        }

        const deposits =
            await this.database.db.bankLockerDeposit.findMany({

                where: {
                    lockerId:
                        locker.id
                },

                orderBy: [
                    {
                        withdrawnAt:
                            "asc"
                    },
                    {
                        maturityAt:
                            "asc"
                    }
                ]
            });

        const now =
            new Date();

        return deposits.map(
            (deposit) => {

                const interest =
                    (
                        deposit.amount *
                        EconomyAccountService.BANK_INTEREST_PERCENT
                    ) /
                    EconomyAccountService.BANK_INTEREST_BASE;

                const total =
                    deposit.amount +
                    interest;

                return {

                    id:
                        deposit.id,

                    amount:
                        deposit.amount,

                    depositedAt:
                        deposit.depositedAt,

                    maturityAt:
                        deposit.maturityAt,

                    withdrawnAt:
                        deposit.withdrawnAt,

                    interest,

                    total,

                    matured:
                        deposit.withdrawnAt === null &&
                        deposit.maturityAt <=
                        now
                };
            }
        );
    }

    /*
     * =========================
     * WITHDRAW MATURED BANK
     * LOCKER DEPOSIT
     * =========================
     *
     * Withdraws one matured deposit.
     *
     * The original deposit amount is
     * returned from the member's Bank Locker.
     *
     * The 2% interest is funded by the
     * server's Ink Bank.
     *
     * Deposits cannot be withdrawn before
     * their own maturity date.
     *
     * The Opera Card is never involved.
     *
     * The operation is fully atomic.
     */

    async withdrawMaturedBankLockerDeposit(
        guildId: string,
        discordId: string,
        depositId: string
    ): Promise<{
        amount: bigint;
        interest: bigint;
        total: bigint;
    }> {

        return await this.database.db.$transaction(
            async (tx) => {

                const locker =
                    await tx.bankLocker.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        }
                    });

                if (!locker) {

                    throw new Error(
                        "BANK_LOCKER_NOT_FOUND"
                    );
                }

                const deposit =
                    await tx.bankLockerDeposit.findUnique({

                        where: {
                            id:
                                depositId
                        }
                    });

                if (!deposit) {

                    throw new Error(
                        "BANK_LOCKER_DEPOSIT_NOT_FOUND"
                    );
                }

                if (
                    deposit.lockerId !==
                    locker.id
                ) {

                    throw new Error(
                        "BANK_LOCKER_DEPOSIT_NOT_FOUND"
                    );
                }

                if (
                    deposit.withdrawnAt
                ) {

                    throw new Error(
                        "BANK_LOCKER_DEPOSIT_ALREADY_WITHDRAWN"
                    );
                }

                const now =
                    new Date();

                if (
                    deposit.maturityAt >
                    now
                ) {

                    throw new Error(
                        "BANK_LOCKER_DEPOSIT_NOT_MATURED"
                    );
                }

                const interest =
                    (
                        deposit.amount *
                        EconomyAccountService.BANK_INTEREST_PERCENT
                    ) /
                    EconomyAccountService.BANK_INTEREST_BASE;

                const total =
                    deposit.amount +
                    interest;

                const inkBank =
                    await tx.inkBank.findUnique({

                        where: {
                            guildId
                        }
                    });

                if (!inkBank) {

                    throw new Error(
                        "INK_BANK_NOT_FOUND"
                    );
                }

                const inkBankUpdate =
                    await tx.inkBank.updateMany({

                        where: {

                            guildId,

                            balance: {
                                gte:
                                    interest
                            }
                        },

                        data: {

                            balance: {
                                decrement:
                                    interest
                            }
                        }
                    });

                if (
                    inkBankUpdate.count !== 1
                ) {

                    throw new Error(
                        "INK_BANK_INSUFFICIENT"
                    );
                }

                const depositUpdate =
                    await tx.bankLockerDeposit.updateMany({

                        where: {

                            id:
                                deposit.id,

                            lockerId:
                                locker.id,

                            withdrawnAt:
                                null,

                            maturityAt: {
                                lte:
                                    now
                            }
                        },

                        data: {

                            withdrawnAt:
                                now
                        }
                    });

                if (
                    depositUpdate.count !== 1
                ) {

                    throw new Error(
                        "BANK_LOCKER_DEPOSIT_ALREADY_WITHDRAWN"
                    );
                }

                const lockerUpdate =
                    await tx.bankLocker.updateMany({

                        where: {

                            id:
                                locker.id,

                            balance: {
                                gte:
                                    deposit.amount
                            }
                        },

                        data: {

                            balance: {
                                decrement:
                                    deposit.amount
                            }
                        }
                    });

                if (
                    lockerUpdate.count !== 1
                ) {

                    throw new Error(
                        "BANK_LOCKER_BALANCE_INCONSISTENT"
                    );
                }

                const walletUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            guildId,

                            discordId
                        },

                        data: {

                            wallet: {
                                increment:
                                    total
                            }
                        }
                    });

                if (
                    walletUpdate.count !== 1
                ) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                return {

                    amount:
                        deposit.amount,

                    interest,

                    total
                };
            }
        );
    }

    /*
     * =========================
     * ROBBERY LOCK
     * =========================
     */

    async acquireRobberyLock(
        guildId: string,
        discordId: string,
        sessionId: string,
        expiresAt: Date
    ): Promise<void> {

        const now =
            new Date();

        const result =
            await this.database.db.economyAccount.updateMany({

                where: {

                    guildId,
                    discordId,

                    OR: [

                        {
                            robberyLockSessionId:
                                null
                        },

                        {
                            robberyLockUntil:
                                null
                        },

                        {
                            robberyLockUntil: {
                                lte:
                                    now
                            }
                        },

                        {
                            robberyLockSessionId:
                                sessionId
                        }
                    ]
                },

                data: {

                    robberyLockSessionId:
                        sessionId,

                    robberyLockUntil:
                        expiresAt
                }
            });

        if (
            result.count !== 1
        ) {

            throw new Error(
                "ROBBERY_LOCK_ALREADY_ACTIVE"
            );
        }
    }

    /*
     * =========================
     * ROBBERY LOCK RELEASE
     * =========================
     */

    async releaseRobberyLock(
        guildId: string,
        discordId: string,
        sessionId: string
    ): Promise<void> {

        await this.database.db.economyAccount.updateMany({

            where: {

                guildId,
                discordId,

                robberyLockSessionId:
                    sessionId
            },

            data: {

                robberyLockSessionId:
                    null,

                robberyLockUntil:
                    null
            }
        });
    }

    /*
     * =========================
     * CLEANUP EXPIRED ROBBERY LOCKS
     * =========================
     */

    async cleanupExpiredRobberyLocks(): Promise<number> {

        const result =
            await this.database.db.economyAccount.updateMany({

                where: {

                    robberyLockSessionId: {
                        not: null
                    },

                    robberyLockUntil: {
                        lte:
                            new Date()
                    }
                },

                data: {

                    robberyLockSessionId:
                        null,

                    robberyLockUntil:
                        null
                }
            });

        return result.count;
    }

    /*
     * =========================
     * ROBBERY LOCK CHECK
     * =========================
     */

    async isRobberyLocked(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        const account =
            await this.database.db.economyAccount.findUnique({

                where: {
                    guildId_discordId: {
                        guildId,
                        discordId
                    }
                },

                select: {

                    robberyLockSessionId:
                        true,

                    robberyLockUntil:
                        true
                }
            });

        if (
            !account
        ) {

            return false;
        }

        if (
            !account.robberyLockSessionId ||
            !account.robberyLockUntil
        ) {

            return false;
        }

        return (
            account.robberyLockUntil >
            new Date()
        );
    }

    /*
     * =========================
     * GAME WITHDRAWAL
     * =========================
     */

    async withdrawForGame(
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<{
        walletUsed: bigint;
        cardUsed: bigint;
    }> {

        this.validatePositiveAmount(
            amount,
            "Withdrawal"
        );

        return await this.database.db.$transaction(
            async (tx) => {

                const account =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId
                            }
                        }
                    });

                if (!account) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                const now =
                    new Date();

                if (
                    account.robberyLockSessionId &&
                    account.robberyLockUntil &&
                    account.robberyLockUntil >
                    now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                const card =
                    await this.ensureOperaCardWithClient(
                        tx,
                        discordId
                    );

                const walletBalance =
                    account.wallet;

                const cardBalance =
                    card.balance;

                if (
                    walletBalance +
                    cardBalance <
                    amount
                ) {

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                const walletUsed =
                    walletBalance >= amount
                        ? amount
                        : walletBalance;

                const cardUsed =
                    amount -
                    walletUsed;

                if (
                    walletUsed > 0n
                ) {

                    const walletUpdate =
                        await tx.economyAccount.updateMany({

                            where: {

                                id:
                                    account.id,

                                wallet: {
                                    gte:
                                        walletUsed
                                },

                                OR: [

                                    {
                                        robberyLockSessionId:
                                            null
                                    },

                                    {
                                        robberyLockUntil:
                                            null
                                    },

                                    {
                                        robberyLockUntil: {
                                            lte:
                                                new Date()
                                        }
                                    }
                                ]
                            },

                            data: {

                                wallet: {
                                    decrement:
                                        walletUsed
                                }
                            }
                        });

                    if (
                        walletUpdate.count !== 1
                    ) {

                        const latestAccount =
                            await tx.economyAccount.findUnique({

                                where: {
                                    id:
                                        account.id
                                },

                                select: {

                                    robberyLockSessionId:
                                        true,

                                    robberyLockUntil:
                                        true
                                }
                            });

                        if (
                            latestAccount?.robberyLockSessionId &&
                            latestAccount.robberyLockUntil &&
                            latestAccount.robberyLockUntil >
                            new Date()
                        ) {

                            throw new Error(
                                "ROBBERY_LOCKED"
                            );
                        }

                        throw new Error(
                            "INSUFFICIENT_FUNDS"
                        );
                    }
                }

                if (
                    cardUsed > 0n
                ) {

                    const latestAccount =
                        await tx.economyAccount.findUnique({

                            where: {
                                id:
                                    account.id
                            },

                            select: {

                                robberyLockSessionId:
                                    true,

                                robberyLockUntil:
                                    true
                            }
                        });

                    if (
                        latestAccount?.robberyLockSessionId &&
                        latestAccount.robberyLockUntil &&
                        latestAccount.robberyLockUntil >
                        new Date()
                    ) {

                        throw new Error(
                            "ROBBERY_LOCKED"
                        );
                    }

                    const cardUpdate =
                        await tx.operaCard.updateMany({

                            where: {

                                id:
                                    card.id,

                                balance: {
                                    gte:
                                        cardUsed
                                }
                            },

                            data: {

                                balance: {
                                    decrement:
                                        cardUsed
                                },

                                updatedAt:
                                    new Date()
                            }
                        });

                    if (
                        cardUpdate.count !== 1
                    ) {

                        throw new Error(
                            "INSUFFICIENT_FUNDS"
                        );
                    }
                }

                return {
                    walletUsed,
                    cardUsed
                };
            }
        );
    }

    /*
     * =========================
     * RPS PVP GAME WITHDRAWAL
     * =========================
     *
     * Withdraws the same wager from
     * both RPS PvP participants inside
     * ONE database transaction.
     *
     * This is intentionally separate from
     * withdrawForGame(), because calling
     * withdrawForGame() twice would allow
     * the first player's withdrawal to
     * complete before the second player's
     * withdrawal fails.
     *
     * Either:
     *
     * Player One wager
     * +
     * Player Two wager
     *
     * are both withdrawn,
     *
     * OR
     *
     * neither withdrawal happens.
     *
     * Wallet is always used first.
     * Opera Card supplies the remainder.
     *
     * Active robbery locks prevent the
     * corresponding player from wagering.
     *
     * The entire operation is Serializable.
     */

    async withdrawRpsPvPWagers(
        guildId: string,
        playerOneId: string,
        playerTwoId: string,
        wager: bigint
    ): Promise<{
        playerOne: {
            walletUsed: bigint;
            cardUsed: bigint;
        };
        playerTwo: {
            walletUsed: bigint;
            cardUsed: bigint;
        };
    }> {

        this.validatePositiveAmount(
            wager,
            "RPS wager"
        );

        if (
            playerOneId ===
            playerTwoId
        ) {

            throw new Error(
                "RPS_SAME_PLAYER"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * FIND BOTH ACCOUNTS
                 * =========================
                 */

                const playerOne =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    playerOneId
                            }
                        }
                    });

                if (!playerOne) {

                    throw new Error(
                        "PLAYER_ONE_ACCOUNT_NOT_FOUND"
                    );
                }

                const playerTwo =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    playerTwoId
                            }
                        }
                    });

                if (!playerTwo) {

                    throw new Error(
                        "PLAYER_TWO_ACCOUNT_NOT_FOUND"
                    );
                }

                /*
                 * =========================
                 * ROBBERY LOCK CHECK
                 * =========================
                 */

                const now =
                    new Date();

                if (
                    playerOne.robberyLockSessionId &&
                    playerOne.robberyLockUntil &&
                    playerOne.robberyLockUntil >
                    now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                if (
                    playerTwo.robberyLockSessionId &&
                    playerTwo.robberyLockUntil &&
                    playerTwo.robberyLockUntil >
                    now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                /*
                 * =========================
                 * FIND BOTH OPERA CARDS
                 * =========================
                 *
                 * Cards are global, so only
                 * the Discord user ID identifies
                 * each card.
                 */

                const playerOneCard =
                    await this.ensureOperaCardWithClient(
                        tx,
                        playerOneId
                    );

                const playerTwoCard =
                    await this.ensureOperaCardWithClient(
                        tx,
                        playerTwoId
                    );

                /*
                 * =========================
                 * CHECK BOTH BALANCES
                 * =========================
                 */

                const playerOneTotal =
                    playerOne.wallet +
                    playerOneCard.balance;

                if (
                    playerOneTotal <
                    wager
                ) {

                    throw new Error(
                        "PLAYER_ONE_INSUFFICIENT_FUNDS"
                    );
                }

                const playerTwoTotal =
                    playerTwo.wallet +
                    playerTwoCard.balance;

                if (
                    playerTwoTotal <
                    wager
                ) {

                    throw new Error(
                        "PLAYER_TWO_INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * CALCULATE BOTH DEDUCTIONS
                 * =========================
                 *
                 * Wallet is used first.
                 */

                const playerOneWalletUsed =
                    playerOne.wallet >= wager
                        ? wager
                        : playerOne.wallet;

                const playerOneCardUsed =
                    wager -
                    playerOneWalletUsed;

                const playerTwoWalletUsed =
                    playerTwo.wallet >= wager
                        ? wager
                        : playerTwo.wallet;

                const playerTwoCardUsed =
                    wager -
                    playerTwoWalletUsed;

                /*
                 * =========================
                 * DETERMINISTIC MUTATION ORDER
                 * =========================
                 *
                 * If two concurrent RPS games
                 * happen to involve the same
                 * users, mutate accounts in
                 * Discord ID order to reduce
                 * deadlock risk.
                 */

                const firstPlayer =
                    playerOneId <
                    playerTwoId
                        ? {
                            accountId:
                                playerOne.id,

                            playerId:
                                playerOneId,

                            walletUsed:
                                playerOneWalletUsed,

                            cardId:
                                playerOneCard.id,

                            cardUsed:
                                playerOneCardUsed
                        }
                        : {
                            accountId:
                                playerTwo.id,

                            playerId:
                                playerTwoId,

                            walletUsed:
                                playerTwoWalletUsed,

                            cardId:
                                playerTwoCard.id,

                            cardUsed:
                                playerTwoCardUsed
                        };

                const secondPlayer =
                    playerOneId <
                    playerTwoId
                        ? {
                            accountId:
                                playerTwo.id,

                            playerId:
                                playerTwoId,

                            walletUsed:
                                playerTwoWalletUsed,

                            cardId:
                                playerTwoCard.id,

                            cardUsed:
                                playerTwoCardUsed
                        }
                        : {
                            accountId:
                                playerOne.id,

                            playerId:
                                playerOneId,

                            walletUsed:
                                playerOneWalletUsed,

                            cardId:
                                playerOneCard.id,

                            cardUsed:
                                playerOneCardUsed
                        };

                /*
                 * =========================
                 * WITHDRAW FIRST PLAYER
                 * =========================
                 */

                if (
                    firstPlayer.walletUsed >
                    0n
                ) {

                    const walletUpdate =
                        await tx.economyAccount.updateMany({

                            where: {

                                id:
                                    firstPlayer.accountId,

                                wallet: {
                                    gte:
                                        firstPlayer.walletUsed
                                },

                                OR: [

                                    {
                                        robberyLockSessionId:
                                            null
                                    },

                                    {
                                        robberyLockUntil:
                                            null
                                    },

                                    {
                                        robberyLockUntil: {
                                            lte:
                                                new Date()
                                        }
                                    }
                                ]
                            },

                            data: {

                                wallet: {
                                    decrement:
                                        firstPlayer.walletUsed
                                }
                            }
                        });

                    if (
                        walletUpdate.count !== 1
                    ) {

                        throw new Error(
                            "RPS_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                if (
                    firstPlayer.cardUsed >
                    0n
                ) {

                    const cardUpdate =
                        await tx.operaCard.updateMany({

                            where: {

                                id:
                                    firstPlayer.cardId,

                                balance: {
                                    gte:
                                        firstPlayer.cardUsed
                                }
                            },

                            data: {

                                balance: {
                                    decrement:
                                        firstPlayer.cardUsed
                                },

                                updatedAt:
                                    new Date()
                            }
                        });

                    if (
                        cardUpdate.count !== 1
                    ) {

                        throw new Error(
                            "RPS_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * WITHDRAW SECOND PLAYER
                 * =========================
                 */

                if (
                    secondPlayer.walletUsed >
                    0n
                ) {

                    const walletUpdate =
                        await tx.economyAccount.updateMany({

                            where: {

                                id:
                                    secondPlayer.accountId,

                                wallet: {
                                    gte:
                                        secondPlayer.walletUsed
                                },

                                OR: [

                                    {
                                        robberyLockSessionId:
                                            null
                                    },

                                    {
                                        robberyLockUntil:
                                            null
                                    },

                                    {
                                        robberyLockUntil: {
                                            lte:
                                                new Date()
                                        }
                                    }
                                ]
                            },

                            data: {

                                wallet: {
                                    decrement:
                                        secondPlayer.walletUsed
                                }
                            }
                        });

                    if (
                        walletUpdate.count !== 1
                    ) {

                        throw new Error(
                            "RPS_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                if (
                    secondPlayer.cardUsed >
                    0n
                ) {

                    const cardUpdate =
                        await tx.operaCard.updateMany({

                            where: {

                                id:
                                    secondPlayer.cardId,

                                balance: {
                                    gte:
                                        secondPlayer.cardUsed
                                }
                            },

                            data: {

                                balance: {
                                    decrement:
                                        secondPlayer.cardUsed
                                },

                                updatedAt:
                                    new Date()
                            }
                        });

                    if (
                        cardUpdate.count !== 1
                    ) {

                        throw new Error(
                            "RPS_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * RETURN BOTH DEDUCTIONS
                 * =========================
                 */

                return {

                    playerOne: {

                        walletUsed:
                            playerOneWalletUsed,

                        cardUsed:
                            playerOneCardUsed
                    },

                    playerTwo: {

                        walletUsed:
                            playerTwoWalletUsed,

                        cardUsed:
                            playerTwoCardUsed
                    }
                };
            },
            {
                isolationLevel:
                    "Serializable"
            }
        );
    }

        /*
     * =========================
     * ODD OR EVEN PVP WAGERS
     * =========================
     *
     * Withdraws both players'
     * wagers atomically.
     *
     * Priority:
     *
     * 1. Server wallet
     * 2. Global Opera Card
     *
     * Both players must have enough
     * combined funds.
     *
     * The entire operation is atomic.
     */

    async withdrawOddEvenPvPWagers(
        guildId: string,
        playerOneId: string,
        playerTwoId: string,
        wager: bigint
    ): Promise<{
        playerOne: {
            walletUsed: bigint;
            cardUsed: bigint;
        };
        playerTwo: {
            walletUsed: bigint;
            cardUsed: bigint;
        };
    }> {

        this.validatePositiveAmount(
            wager,
            "Odd or Even wager"
        );

        if (
            playerOneId ===
            playerTwoId
        ) {

            throw new Error(
                "ODD_EVEN_SAME_PLAYER"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {

                /*
                 * =========================
                 * FIND BOTH ACCOUNTS
                 * =========================
                 */

                const playerOne =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    playerOneId
                            }
                        }
                    });

                if (!playerOne) {

                    throw new Error(
                        "PLAYER_ONE_ACCOUNT_NOT_FOUND"
                    );
                }

                const playerTwo =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    playerTwoId
                            }
                        }
                    });

                if (!playerTwo) {

                    throw new Error(
                        "PLAYER_TWO_ACCOUNT_NOT_FOUND"
                    );
                }

                /*
                 * =========================
                 * ROBBERY LOCK CHECK
                 * =========================
                 *
                 * A player with an active
                 * robbery lock cannot spend
                 * Nickel on the game.
                 */

                const now =
                    new Date();

                if (
                    playerOne.robberyLockUntil &&
                    playerOne.robberyLockUntil > now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                if (
                    playerTwo.robberyLockUntil &&
                    playerTwo.robberyLockUntil > now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                /*
                 * =========================
                 * ENSURE OPERA CARDS
                 * =========================
                 */

                const playerOneCard =
                    await this.ensureOperaCardWithClient(
                        tx,
                        playerOneId
                    );

                const playerTwoCard =
                    await this.ensureOperaCardWithClient(
                        tx,
                        playerTwoId
                    );

                /*
                 * =========================
                 * CALCULATE FUNDS
                 * =========================
                 */

                const playerOneWallet =
                    playerOne.wallet;

                const playerOneCardBalance =
                    playerOneCard.balance;

                const playerTwoWallet =
                    playerTwo.wallet;

                const playerTwoCardBalance =
                    playerTwoCard.balance;

                /*
                 * =========================
                 * PLAYER ONE FUNDS CHECK
                 * =========================
                 */

                if (
                    playerOneWallet +
                    playerOneCardBalance <
                    wager
                ) {

                    throw new Error(
                        "PLAYER_ONE_INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * PLAYER TWO FUNDS CHECK
                 * =========================
                 */

                if (
                    playerTwoWallet +
                    playerTwoCardBalance <
                    wager
                ) {

                    throw new Error(
                        "PLAYER_TWO_INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * CALCULATE PLAYER ONE USAGE
                 * =========================
                 */

                const playerOneWalletUsed =
                    playerOneWallet >= wager
                        ? wager
                        : playerOneWallet;

                const playerOneCardUsed =
                    wager -
                    playerOneWalletUsed;

                /*
                 * =========================
                 * CALCULATE PLAYER TWO USAGE
                 * =========================
                 */

                const playerTwoWalletUsed =
                    playerTwoWallet >= wager
                        ? wager
                        : playerTwoWallet;

                const playerTwoCardUsed =
                    wager -
                    playerTwoWalletUsed;

                /*
                 * =========================
                 * DETERMINISTIC ORDER
                 * =========================
                 *
                 * Mutate accounts in Discord ID
                 * order to reduce deadlock risk
                 * when two games involve the same
                 * players concurrently.
                 */

                const firstPlayerIsOne =
                    playerOneId <
                    playerTwoId;

                const firstPlayer =
                    firstPlayerIsOne
                        ? {
                            accountId:
                                playerOne.id,
                            cardId:
                                playerOneCard.id,
                            walletUsed:
                                playerOneWalletUsed,
                            cardUsed:
                                playerOneCardUsed
                        }
                        : {
                            accountId:
                                playerTwo.id,
                            cardId:
                                playerTwoCard.id,
                            walletUsed:
                                playerTwoWalletUsed,
                            cardUsed:
                                playerTwoCardUsed
                        };

                const secondPlayer =
                    firstPlayerIsOne
                        ? {
                            accountId:
                                playerTwo.id,
                            cardId:
                                playerTwoCard.id,
                            walletUsed:
                                playerTwoWalletUsed,
                            cardUsed:
                                playerTwoCardUsed
                        }
                        : {
                            accountId:
                                playerOne.id,
                            cardId:
                                playerOneCard.id,
                            walletUsed:
                                playerOneWalletUsed,
                            cardUsed:
                                playerOneCardUsed
                        };

                /*
                 * =========================
                 * FIRST WALLET WITHDRAWAL
                 * =========================
                 */

                if (
                    firstPlayer.walletUsed >
                    0n
                ) {

                    const walletUpdate =
                        await tx.economyAccount.updateMany({

                            where: {
                                id:
                                    firstPlayer.accountId,

                                wallet: {
                                    gte:
                                        firstPlayer.walletUsed
                                }
                            },

                            data: {
                                wallet: {
                                    decrement:
                                        firstPlayer.walletUsed
                                }
                            }
                        });

                    if (
                        walletUpdate.count !==
                        1
                    ) {

                        throw new Error(
                            "ODD_EVEN_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * FIRST CARD WITHDRAWAL
                 * =========================
                 */

                if (
                    firstPlayer.cardUsed >
                    0n
                ) {

                    const cardUpdate =
                        await tx.operaCard.updateMany({

                            where: {
                                id:
                                    firstPlayer.cardId,

                                balance: {
                                    gte:
                                        firstPlayer.cardUsed
                                }
                            },

                            data: {

                                balance: {
                                    decrement:
                                        firstPlayer.cardUsed
                                },

                                updatedAt:
                                    new Date()
                            }
                        });

                    if (
                        cardUpdate.count !==
                        1
                    ) {

                        throw new Error(
                            "ODD_EVEN_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * SECOND WALLET WITHDRAWAL
                 * =========================
                 */

                if (
                    secondPlayer.walletUsed >
                    0n
                ) {

                    const walletUpdate =
                        await tx.economyAccount.updateMany({

                            where: {
                                id:
                                    secondPlayer.accountId,

                                wallet: {
                                    gte:
                                        secondPlayer.walletUsed
                                }
                            },

                            data: {
                                wallet: {
                                    decrement:
                                        secondPlayer.walletUsed
                                }
                            }
                        });

                    if (
                        walletUpdate.count !==
                        1
                    ) {

                        throw new Error(
                            "ODD_EVEN_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * SECOND CARD WITHDRAWAL
                 * =========================
                 */

                if (
                    secondPlayer.cardUsed >
                    0n
                ) {

                    const cardUpdate =
                        await tx.operaCard.updateMany({

                            where: {
                                id:
                                    secondPlayer.cardId,

                                balance: {
                                    gte:
                                        secondPlayer.cardUsed
                                }
                            },

                            data: {

                                balance: {
                                    decrement:
                                        secondPlayer.cardUsed
                                },

                                updatedAt:
                                    new Date()
                            }
                        });

                    if (
                        cardUpdate.count !==
                        1
                    ) {

                        throw new Error(
                            "ODD_EVEN_PLAYER_FUNDS_CHANGED"
                        );
                    }
                }

                /*
                 * =========================
                 * RESULT
                 * =========================
                 */

                return {

                    playerOne: {
                        walletUsed:
                            playerOneWalletUsed,

                        cardUsed:
                            playerOneCardUsed
                    },

                    playerTwo: {
                        walletUsed:
                            playerTwoWalletUsed,

                        cardUsed:
                            playerTwoCardUsed
                    }
                };
            }
        );
    }
    
    /*
     * =========================
     * GAME DEPOSIT
     * =========================
     */

    async depositForGame(
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<void> {

        this.validatePositiveAmount(
            amount,
            "Deposit"
        );

        await this.database.db.economyAccount.upsert({

            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            create: {
                guildId,
                discordId,
                wallet:
                    amount
            },

            update: {
                wallet: {
                    increment:
                        amount
                }
            }
        });
    }

    /*
     * =========================
     * ROBBERY WINNINGS TRANSFER
     * =========================
     */

    async transferRobberyWinnings(
        guildId: string,
        victimId: string,
        robberId: string
    ): Promise<bigint> {

        if (
            victimId ===
            robberId
        ) {

            throw new Error(
                "ROBBERY_TRANSFER_SAME_ACCOUNT"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {

                const victim =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    victimId
                            }
                        },

                        select: {

                            id:
                                true,

                            wallet:
                                true
                        }
                    });

                if (!victim) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                if (
                    victim.wallet <
                    EconomyAccountService.ROBBERY_MINIMUM_WALLET
                ) {

                    throw new Error(
                        "INSUFFICIENT_ROBBERY_FUNDS"
                    );
                }

                const winnings =
                    (
                        victim.wallet *
                        EconomyAccountService.ROBBERY_STEAL_PERCENT
                    ) /
                    EconomyAccountService.PERCENT_BASE;

                if (
                    winnings <= 0n
                ) {

                    throw new Error(
                        "ROBBERY_WINNINGS_ZERO"
                    );
                }

                const victimUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                victim.id,

                            wallet: {
                                gte:
                                    winnings
                            }
                        },

                        data: {

                            wallet: {
                                decrement:
                                    winnings
                            }
                        }
                    });

                if (
                    victimUpdate.count !== 1
                ) {

                    throw new Error(
                        "INSUFFICIENT_ROBBERY_FUNDS"
                    );
                }

                await tx.economyAccount.upsert({

                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId:
                                robberId
                        }
                    },

                    create: {

                        guildId,
                        discordId:
                            robberId,

                        wallet:
                            winnings
                    },

                    update: {

                        wallet: {
                            increment:
                                winnings
                        }
                    }
                });

                return winnings;
            }
        );
    }

    /*
     * =========================
     * POLICE RESCUE REWARD
     * =========================
     */

    async transferPoliceRescueReward(
        guildId: string,
        victimId: string,
        policeId: string
    ): Promise<bigint> {

        if (
            victimId ===
            policeId
        ) {

            throw new Error(
                "POLICE_RESCUE_TRANSFER_SAME_ACCOUNT"
            );
        }

        return await this.database.db.$transaction(
            async (tx) => {

                const victim =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    victimId
                            }
                        },

                        select: {

                            id:
                                true,

                            wallet:
                                true
                        }
                    });

                if (!victim) {

                    throw new Error(
                        "ECONOMY_ACCOUNT_NOT_FOUND"
                    );
                }

                const reward =
                    (
                        victim.wallet *
                        EconomyAccountService.POLICE_RESCUE_PERCENT
                    ) /
                    EconomyAccountService.PERCENT_BASE;

                if (
                    reward <= 0n
                ) {

                    throw new Error(
                        "POLICE_RESCUE_REWARD_ZERO"
                    );
                }

                const victimUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                victim.id,

                            wallet: {
                                gte:
                                    reward
                            }
                        },

                        data: {

                            wallet: {
                                decrement:
                                    reward
                            }
                        }
                    });

                if (
                    victimUpdate.count !== 1
                ) {

                    throw new Error(
                        "INSUFFICIENT_POLICE_RESCUE_FUNDS"
                    );
                }

                await tx.economyAccount.upsert({

                    where: {
                        guildId_discordId: {
                            guildId,
                            discordId:
                                policeId
                        }
                    },

                    create: {

                        guildId,
                        discordId:
                            policeId,

                        wallet:
                            reward
                    },

                    update: {

                        wallet: {
                            increment:
                                reward
                        }
                    }
                });

                return reward;
            }
        );
    }

    /*
     * =========================
     * OPERA CARD
     * =========================
     *
     * Ensures that a member has a
     * global Opera Card.
     *
     * Safe to call repeatedly.
     *
     * Card creation starts at zero Nickel.
     *
     * There is no card balance cap.
     */

    async ensureOperaCard(
        discordId: string
    ): Promise<void> {

        await this.ensureOperaCardWithClient(
            this.database.db,
            discordId
        );
    }

    /*
     * =========================
     * INTERNAL CARD ENSURANCE
     * =========================
     */

    private async ensureOperaCardWithClient(
        client: any,
        discordId: string
    ) {

        const existingCard =
            await client.operaCard.findUnique({

                where: {
                    discordId
                }
            });

        if (existingCard) {

            return existingCard;
        }

        const cardCode =
            await this.generateCardCode(
                client
            );

        try {

            return await client.operaCard.create({

                data: {

                    id:
                        randomUUID(),

                    discordId,

                    cardCode,

                    balance:
                        0n,

                    updatedAt:
                        new Date()
                }
            });

        } catch (error) {

            const existingAfterRace =
                await client.operaCard.findUnique({

                    where: {
                        discordId
                    }
                });

            if (
                existingAfterRace
            ) {

                return existingAfterRace;
            }

            throw error;
        }
    }

    /*
     * =========================
     * CARD CODE GENERATOR
     * =========================
     *
     * Generates a unique 25-digit
     * numeric Opera Card code.
     */

    private async generateCardCode(
        client: any
    ): Promise<string> {

        while (true) {

            let code =
                "";

            for (
                let index = 0;
                index <
                EconomyAccountService.CARD_CODE_LENGTH;
                index++
            ) {

                code +=
                    randomInt(
                        0,
                        10
                    ).toString();
            }

            const existing =
                await client.operaCard.findUnique({

                    where: {
                        cardCode:
                            code
                    },

                    select: {
                        id:
                            true
                    }
                });

            if (!existing) {

                return code;
            }
        }
    }

        /*
     * =========================
     * WALLET -> WALLET TRANSFER
     * =========================
     *
     * Transfers Nickel from one
     * member's server wallet to
     * another member's server wallet.
     *
     * This is used by systems such
     * as Inventory trading.
     *
     * No tax is applied.
     * No Nickel is created.
     *
     * The sender must not have an
     * active robbery lock.
     *
     * The entire operation is atomic.
     */

    async transferWalletToWallet(
        guildId: string,
        senderDiscordId: string,
        receiverDiscordId: string,
        amount: bigint
    ): Promise<void> {

        this.validatePositiveAmount(
            amount,
            "Wallet transfer"
        );

        if (
            senderDiscordId ===
            receiverDiscordId
        ) {

            throw new Error(
                "WALLET_TRANSFER_SAME_ACCOUNT"
            );
        }

        await this.database.db.$transaction(
            async (tx) => {

                const sender =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    senderDiscordId
                            }
                        }
                    });

                if (!sender) {

                    throw new Error(
                        "SENDER_ACCOUNT_NOT_FOUND"
                    );
                }

                const receiver =
                    await tx.economyAccount.findUnique({

                        where: {
                            guildId_discordId: {
                                guildId,
                                discordId:
                                    receiverDiscordId
                            }
                        }
                    });

                if (!receiver) {

                    throw new Error(
                        "RECEIVER_ACCOUNT_NOT_FOUND"
                    );
                }

                const now =
                    new Date();

                /*
                 * =========================
                 * ROBBERY LOCK CHECK
                 * =========================
                 */

                if (
                    sender.robberyLockSessionId &&
                    sender.robberyLockUntil &&
                    sender.robberyLockUntil >
                    now
                ) {

                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                /*
                 * =========================
                 * BALANCE CHECK
                 * =========================
                 */

                if (
                    sender.wallet <
                    amount
                ) {

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * SENDER WITHDRAWAL
                 * =========================
                 *
                 * Repeat the robbery-lock and
                 * balance conditions directly
                 * on the mutation.
                 */

                const senderUpdate =
                    await tx.economyAccount.updateMany({

                        where: {

                            id:
                                sender.id,

                            wallet: {
                                gte:
                                    amount
                            },

                            OR: [

                                {
                                    robberyLockSessionId:
                                        null
                                },

                                {
                                    robberyLockUntil:
                                        null
                                },

                                {
                                    robberyLockUntil: {
                                        lte:
                                            new Date()
                                    }
                                }
                            ]
                        },

                        data: {

                            wallet: {
                                decrement:
                                    amount
                            }
                        }
                    });

                if (
                    senderUpdate.count !== 1
                ) {

                    const latestSender =
                        await tx.economyAccount.findUnique({

                            where: {
                                id:
                                    sender.id
                            },

                            select: {

                                robberyLockSessionId:
                                    true,

                                robberyLockUntil:
                                    true
                            }
                        });

                    if (
                        latestSender?.robberyLockSessionId &&
                        latestSender.robberyLockUntil &&
                        latestSender.robberyLockUntil >
                        new Date()
                    ) {

                        throw new Error(
                            "ROBBERY_LOCKED"
                        );
                    }

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                /*
                 * =========================
                 * RECEIVER DEPOSIT
                 * =========================
                 */

                await tx.economyAccount.update({

                    where: {
                        id:
                            receiver.id
                    },

                    data: {

                        wallet: {
                            increment:
                                amount
                        }
                    }
                });
            }
        );
    }

      public async transferWalletToWalletInTransaction(
    transaction: any,
    guildId: string,
    senderDiscordId: string,
    receiverDiscordId: string,
    amount: bigint
  ): Promise<void> {
    this.validatePositiveAmount(
      amount,
      "Wallet transfer"
    );

    if (
      senderDiscordId ===
      receiverDiscordId
    ) {
      throw new Error(
        "WALLET_TRANSFER_SAME_ACCOUNT"
      );
    }

    const sender =
      await transaction.economyAccount.findUnique({
        where: {
          guildId_discordId: {
            guildId,
            discordId:
              senderDiscordId
          }
        }
      });

    if (!sender) {
      throw new Error(
        "SENDER_ACCOUNT_NOT_FOUND"
      );
    }

    const receiver =
      await transaction.economyAccount.findUnique({
        where: {
          guildId_discordId: {
            guildId,
            discordId:
              receiverDiscordId
          }
        }
      });

    if (!receiver) {
      throw new Error(
        "RECEIVER_ACCOUNT_NOT_FOUND"
      );
    }

    const now = new Date();

    if (
      sender.robberyLockSessionId &&
      sender.robberyLockUntil &&
      sender.robberyLockUntil > now
    ) {
      throw new Error(
        "ROBBERY_LOCKED"
      );
    }

    if (
      sender.wallet < amount
    ) {
      throw new Error(
        "INSUFFICIENT_FUNDS"
      );
    }

    /*
     * Update accounts in deterministic
     * order to reduce deadlock risk when
     * two opposite transfers happen at once.
     */

    const senderFirst =
      sender.id.localeCompare(
        receiver.id
      ) < 0;

    const updateSender =
      async (): Promise<void> => {
        const result =
          await transaction.economyAccount.updateMany({
            where: {
              id: sender.id,
              wallet: {
                gte: amount
              },
              OR: [
                {
                  robberyLockSessionId:
                    null
                },
                {
                  robberyLockUntil:
                    null
                },
                {
                  robberyLockUntil: {
                    lte: new Date()
                  }
                }
              ]
            },
            data: {
              wallet: {
                decrement:
                  amount
              }
            }
          });

        if (result.count !== 1) {
          throw new Error(
            "WALLET_TRANSFER_REVALIDATION_FAILED"
          );
        }
      };

    const updateReceiver =
      async (): Promise<void> => {
        await transaction.economyAccount.update({
          where: {
            id:
              receiver.id
          },
          data: {
            wallet: {
              increment:
                amount
            }
          }
        });
      };

    if (senderFirst) {
      await updateSender();
      await updateReceiver();
    } else {
      await updateReceiver();
      await updateSender();
    }
  }
  
      /*
     * =========================
     * STORE PAYMENT HOLD
     * =========================
     *
     * Holds Nickel for a Store purchase.
     *
     * Priority:
     *
     * 1. Server Wallet
     * 2. Global Opera Card
     *
     * The amount is fully removed from the
     * available balances immediately.
     *
     * The StorePurchase record becomes the
     * authoritative record that the Nickel
     * is being held.
     *
     * This method MUST be called inside an
     * existing database transaction.
     *
     * No tax is applied.
     * No Nickel is created.
     *
     * Active robbery locks are respected.
     */

    public async holdForStoreInTransaction(
        transaction: any,
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<{
        walletUsed: bigint;
        cardUsed: bigint;
    }> {
        this.validatePositiveAmount(
            amount,
            "Store purchase"
        );

        const account =
            await transaction.economyAccount.findUnique({
                where: {
                    guildId_discordId: {
                        guildId,
                        discordId
                    }
                }
            });

        if (!account) {
            throw new Error(
                "ECONOMY_ACCOUNT_NOT_FOUND"
            );
        }

        const now =
            new Date();

        /*
         * =========================
         * ROBBERY LOCK
         * =========================
         */

        if (
            account.robberyLockSessionId &&
            account.robberyLockUntil &&
            account.robberyLockUntil > now
        ) {
            throw new Error(
                "ROBBERY_LOCKED"
            );
        }

        /*
         * =========================
         * OPERA CARD
         * =========================
         */

        const card =
            await this.ensureOperaCardWithClient(
                transaction,
                discordId
            );

        const walletBalance =
            account.wallet;

        const cardBalance =
            card.balance;

        /*
         * =========================
         * TOTAL FUNDS CHECK
         * =========================
         */

        if (
            walletBalance +
            cardBalance <
            amount
        ) {
            throw new Error(
                "INSUFFICIENT_FUNDS"
            );
        }

        /*
         * =========================
         * WALLET FIRST
         * =========================
         */

        const walletUsed =
            walletBalance >= amount
                ? amount
                : walletBalance;

        const cardUsed =
            amount -
            walletUsed;

        /*
         * =========================
         * WALLET WITHDRAWAL
         * =========================
         *
         * Revalidate the wallet and robbery
         * lock directly on the mutation.
         */

        if (
            walletUsed > 0n
        ) {
            const walletUpdate =
                await transaction.economyAccount.updateMany({
                    where: {
                        id: account.id,

                        wallet: {
                            gte: walletUsed
                        },

                        OR: [
                            {
                                robberyLockSessionId:
                                    null
                            },
                            {
                                robberyLockUntil:
                                    null
                            },
                            {
                                robberyLockUntil: {
                                    lte:
                                        new Date()
                                }
                            }
                        ]
                    },

                    data: {
                        wallet: {
                            decrement:
                                walletUsed
                        }
                    }
                });

            if (
                walletUpdate.count !== 1
            ) {
                const latestAccount =
                    await transaction.economyAccount.findUnique({
                        where: {
                            id:
                                account.id
                        },

                        select: {
                            robberyLockSessionId:
                                true,

                            robberyLockUntil:
                                true
                        }
                    });

                if (
                    latestAccount?.robberyLockSessionId &&
                    latestAccount.robberyLockUntil &&
                    latestAccount.robberyLockUntil > new Date()
                ) {
                    throw new Error(
                        "ROBBERY_LOCKED"
                    );
                }

                throw new Error(
                    "INSUFFICIENT_FUNDS"
                );
            }
        }

        /*
         * =========================
         * OPERA CARD WITHDRAWAL
         * =========================
         */

        if (
            cardUsed > 0n
        ) {
            const cardUpdate =
                await transaction.operaCard.updateMany({
                    where: {
                        id:
                            card.id,

                        balance: {
                            gte:
                                cardUsed
                        }
                    },

                    data: {
                        balance: {
                            decrement:
                                cardUsed
                        },

                        updatedAt:
                            new Date()
                    }
                });

            if (
                cardUpdate.count !== 1
            ) {
                throw new Error(
                    "INSUFFICIENT_FUNDS"
                );
            }
        }

        return {
            walletUsed,
            cardUsed
        };
    }

    /*
     * =========================
     * STORE REFUND
     * =========================
     *
     * Returns the complete held amount
     * to the member's SERVER WALLET.
     *
     * The original payment source is
     * intentionally not remembered.
     *
     * No tax is applied.
     * No Nickel is created.
     *
     * This method MUST be called inside
     * an existing transaction.
     */

    public async refundStoreInTransaction(
        transaction: any,
        guildId: string,
        discordId: string,
        amount: bigint
    ): Promise<void> {
        this.validatePositiveAmount(
            amount,
            "Store refund"
        );

        await transaction.economyAccount.upsert({
            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            create: {
                guildId,
                discordId,
                wallet:
                    amount
            },

            update: {
                wallet: {
                    increment:
                        amount
                }
            }
        });
    }
    
    /*
     * =========================
     * VALIDATION
     * =========================
     */

    private validatePositiveAmount(
        amount: bigint,
        operation: string
    ): void {

        if (
            amount <= 0n
        ) {

            throw new Error(
                `${operation} amount must be greater than zero.`
            );
        }
    }
}

END FILE: src/plugins/economy/services/EconomyAccountService.ts
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
