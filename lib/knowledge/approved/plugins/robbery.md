QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:32:47.097Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/robbery
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
- This export is scoped to: src/plugins/robbery

EXPORT SUMMARY
================================================================================
Files exported: 31
Files excluded or skipped: 0
Original bytes in exported files: 682786
Bytes after redaction: 658156
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/robbery/commands/PoliceConfigCommand.ts
00002. src/plugins/robbery/commands/RobCommand.ts
00003. src/plugins/robbery/config/RobberyConfig.ts
00004. src/plugins/robbery/core/GuessCharacterQuestionBank.ts
00005. src/plugins/robbery/core/GuessCharacterQuestionManager.ts
00006. src/plugins/robbery/core/PoliceEscapeMaze.ts
00007. src/plugins/robbery/core/PoliceEscapeMazeRenderer.ts
00008. src/plugins/robbery/core/RobberyGameManager.ts
00009. src/plugins/robbery/core/RobberyManager.ts
00010. src/plugins/robbery/core/RobberyQuestionBank.ts
00011. src/plugins/robbery/core/RobberyQuestionManager.ts
00012. src/plugins/robbery/core/RobberySession.ts
00013. src/plugins/robbery/core/RobberySessionManager.ts
00014. src/plugins/robbery/events/RobberyInteraction.ts
00015. src/plugins/robbery/events/RobberyPoliceInteraction.ts
00016. src/plugins/robbery/games/BinaryDecryptionGame.ts
00017. src/plugins/robbery/games/ColourGuessGame.ts
00018. src/plugins/robbery/games/GuessCharacterGame.ts
00019. src/plugins/robbery/games/LockCombinationGame.ts
00020. src/plugins/robbery/games/PoliceEscapeGame.ts
00021. src/plugins/robbery/games/RobberyGame.ts
00022. src/plugins/robbery/headquarters/police/PoliceClueSearchGame.ts
00023. src/plugins/robbery/headquarters/police/PoliceCodeTraceGame.ts
00024. src/plugins/robbery/headquarters/police/PoliceSignalTraceGame.ts
00025. src/plugins/robbery/headquarters/police/RobberyPoliceCase.ts
00026. src/plugins/robbery/headquarters/police/RobberyPoliceGame.ts
00027. src/plugins/robbery/headquarters/police/RobberyPoliceManager.ts
00028. src/plugins/robbery/headquarters/RobberyHeadquarters.ts
00029. src/plugins/robbery/headquarters/RobberyNotificationService.ts
00030. src/plugins/robbery/plugin.json
00031. src/plugins/robbery/RobberyPlugin.ts

premium: True

SOURCE FILES
================================================================================

FILE: src/plugins/robbery/commands/PoliceConfigCommand.ts
--------------------------------------------------------------------------------
Original size: 7320 bytes
Exported size: 7056 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";
import { PrismaService } from "../../../core/database/PrismaService.js";

export const PoliceConfigCommand = {

    data: new SlashCommandBuilder()
        .setName("policeconfig")
        .setDescription(
            "Configure where Robbery Police alerts are sent."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )
        .addChannelOption(
            option =>
                option
                    .setName("channel")
                    .setDescription(
                        "The channel where Robbery Police alerts will be sent."
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
         * =========================
         * SERVER CHECK
         * =========================
         */

        if (!interaction.guild) {

            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                ephemeral: true
            });

            return;
        }

        /*
         * =========================
         * ADMIN CHECK
         * =========================
         */

        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            await interaction.reply({
                content:
                    "❌ You must have the **Administrator** permission to configure Police alerts.",
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
            channel.type !== ChannelType.GuildText &&
            channel.type !== ChannelType.GuildAnnouncement
        ) {

            await interaction.reply({
                content:
                    "❌ Please select a text or announcement channel.",
                ephemeral: true
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
                    "❌ The robbery database service is currently unavailable.",
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

            const previousConfig =
                await database.db.robberyPoliceNotificationConfig
                    .findUnique({
                        where: {
                            guildId:
                                interaction.guild.id
                        }
                    });

            await database.db.robberyPoliceNotificationConfig
                .upsert({

                    where: {
                        guildId:
                            interaction.guild.id
                    },

                    update: {
                        channelId:
                            channel.id,

                        enabled:
                            true
                    },

                    create: {
                        guildId:
                            interaction.guild.id,

                        channelId:
                            channel.id,

                        enabled:
                            true
                    }
                });

            /*
             * =========================
             * SUCCESS EMBED
             * =========================
             */

            const embed =
                new EmbedBuilder()
                    .setTitle(
                        "🚓 Police Alert Configuration Updated"
                    )
                    .setDescription(
                        "Robbery Police alerts will now be sent to the configured channel."
                    )
                    .addFields(

                        {
                            name:
                                "📢 Alert Channel",

                            value:
                                `${channel}`,

                            inline:
                                true
                        },

                        {
                            name:
                                "🔔 Status",

                            value:
                                "Enabled",

                            inline:
                                true
                        },

                        {
                            name:
                                "📋 Previous Channel",

                            value:
                                previousConfig?.channelId
                                    ? `<#${previousConfig.channelId}>`
                                    : "Not configured",

                            inline:
                                false
                        }
                    )
                    .setFooter({
                        text:
                            "Quill & Ink • Robbery Administration"
                    })
                    .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],
                ephemeral: true
            });

            console.info(
                `[Robbery] ${interaction.user.tag} configured Police alerts for ${interaction.guild.name}. ` +
                `Previous: ${previousConfig?.channelId ?? "none"}. ` +
                `New: ${channel.id}.`
            );

        } catch (error) {

            console.error(
                "[Robbery] Failed to configure Police notification channel:",
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
                    "❌ Something went wrong while saving the Police notification configuration.",
                ephemeral: true
            });
        }
    }
};

END FILE: src/plugins/robbery/commands/PoliceConfigCommand.ts
================================================================================

FILE: src/plugins/robbery/commands/RobCommand.ts
--------------------------------------------------------------------------------
Original size: 37684 bytes
Exported size: 36455 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import { RobberyManager } from "../core/RobberyManager.js";
import { RobberySession } from "../core/RobberySession.js";
import { RobberyNotificationService } from "../headquarters/RobberyNotificationService.js";

/*
 * =========================================
 * ROB COMMAND
 * =========================================
 */

export const RobCommand = {

    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription(
            "Attempt to rob another member."
        )
        .addUserOption(
            option =>
                option
                    .setName("member")
                    .setDescription(
                        "The member you want to rob."
                    )
                    .setRequired(true)
        ),

    async execute(
        interaction: ChatInputCommandInteraction,
        client: {
            services: {
                get<T>(
                    name: string
                ): T | undefined;
            };
        }
    ): Promise<void> {

        /*
         * =========================================
         * SERVER CHECK
         * =========================================
         */

        if (!interaction.guild) {

            await interaction.reply({
                content:
                    "❌ This command can only be used in a server.",
                flags:
                    MessageFlags.Ephemeral
            });

            return;
        }

        const guild =
            interaction.guild;

        /*
         * =========================================
         * DEFER INTERACTION
         * =========================================
         */

        await interaction.deferReply({
            flags:
                MessageFlags.Ephemeral
        });

        /*
         * =========================================
         * TARGET
         * =========================================
         */

        const target =
            interaction.options.getUser(
                "member",
                true
            );

        /*
         * =========================================
         * BASIC VALIDATION
         * =========================================
         */

        if (
            target.id ===
            interaction.user.id
        ) {

            await interaction.editReply({
                content:
                    "❌ You cannot rob yourself."
            });

            return;
        }

        if (target.bot) {

            await interaction.editReply({
                content:
                    "❌ You cannot rob a bot."
            });

            return;
        }

        /*
         * =========================================
         * TARGET SERVER MEMBERSHIP
         * =========================================
         */

        const targetMember =
            await guild.members
                .fetch(target.id)
                .catch(
                    () => null
                );

        if (!targetMember) {

            await interaction.editReply({
                content:
                    "❌ That member is not in this server."
            });

            return;
        }

        /*
         * =========================================
         * ROBBERY MANAGER
         * =========================================
         */

        const robberyManager =
            client.services.get<RobberyManager>(
                "robberyManager"
            );

        if (!robberyManager) {

            await interaction.editReply({
                content:
                    "❌ The robbery system is currently unavailable."
            });

            return;
        }

        /*
         * =========================================
         * ROBBERY NOTIFICATION SERVICE
         * =========================================
         */

        const robberyNotificationService =
            client.services.get<RobberyNotificationService>(
                "robberyNotificationService"
            );

        /*
         * =========================================
         * ACTIVE ROBBERY CHECK
         * =========================================
         */

        const existingRobbery =
            robberyManager.getActiveRobbery(
                guild.id,
                interaction.user.id
            );

        if (existingRobbery) {

            await interaction.editReply({
                content:
                    "❌ You already have an active robbery."
            });

            return;
        }

        /*
         * =========================================
         * ROBBERY CONFIGURATION
         * =========================================
         *
         * Game count is controlled by
         * RobberySession.ROBBERY_GAME_COUNT.
         *
         * The manager no longer accepts
         * gameCount as an argument.
         */

        const SESSION_DURATION =
            10 * 60 * 1000;

        let session:
            RobberySession | undefined;

        let robberyChannel:
            Awaited<
                ReturnType<
                    typeof guild.channels.create
                >
            > | undefined;

        try {

            /*
             * =========================================
             * CREATE ROBBERY SESSION
             * =========================================
             */

            session =
                await robberyManager.startRobbery(
                    guild.id,
                    interaction.user.id,
                    target.id,
                    SESSION_DURATION
                );

            const activeSession =
                session;

            /*
             * =========================================
             * CREATE PRIVATE ROBBERY CHANNEL
             * =========================================
             */

            robberyChannel =
                await guild.channels.create({

                    name:
                        `robbery-${activeSession.id}`,

                    type:
                        ChannelType.GuildText,

                    permissionOverwrites: [

                        /*
                         * SERVER MEMBERS
                         */

                        {
                            id:
                                guild.roles.everyone.id,

                            deny: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },

                        /*
                         * ROBBER
                         */

                        {
                            id:
                                interaction.user.id,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },

                        /*
                         * TARGET
                         */

                        

                        /*
                         * BOT
                         */

                        {
                            id:
                                interaction.client.user.id,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.ManageMessages
                            ]
                        }
                    ],

                    reason:
                        `Robbery session ${activeSession.id}`
                });

            /*
             * =========================================
             * GET CURRENT GAME
             * =========================================
             */

            const currentGame =
                robberyManager.getCurrentGame(
                    activeSession
                );

            if (!currentGame) {

                throw new Error(
                    "Failed to find the current robbery game."
                );
            }

            /*
             * =========================================
             * COMMON GAME HEADER
             * =========================================
             */

            const gameHeader =
                (
                    gameName: string
                ): string => {

                    return [
                        "🚨 **ROBBERY IN PROGRESS**",
                        "",
                        `🎯 **Target:** ${target}`,
                        `🕵️ **Robber:** ${interaction.user}`,
                        "",
                        `🎮 **GAME ${activeSession.currentGameNumber}/${activeSession.totalGames}**`,
                        gameName
                    ].join("\n");
                };

            /*
             * =========================================
             * GAME MESSAGE
             * =========================================
             */

            let messageContent:
                string;

            let components:
                ActionRowBuilder<ButtonBuilder>[] = [];

            /*
             * =========================================
             * LOCK COMBINATION
             * =========================================
             */

            if (
                currentGame.id ===
                "lock-combination"
            ) {

                let clues:
                    string[] = [];

                const lockGame =
                    currentGame as {

                        getClues?: (
                            session: RobberySession
                        ) => string[];

                    };

                if (
                    lockGame.getClues
                ) {

                    clues =
                        lockGame.getClues(
                            activeSession
                        );
                }

                const clueText =
                    clues.length > 0
                        ? clues
                            .map(
                                (
                                    clue,
                                    index
                                ) =>
                                    `**Knob ${index + 1}:** ${clue}`
                            )
                            .join("\n")
                        : "⚠️ No clues are currently available.";

                const combinationButton =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:lock:${activeSession.id}`
                        )
                        .setLabel(
                            "Enter Combination"
                        )
                        .setEmoji(
                            "🔐"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const row =
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            combinationButton
                        );

                messageContent =
                    [
                        gameHeader(
                            "🔐 **LOCK COMBINATION**"
                        ),
                        "",
                        clueText,
                        "",
                        "⚠️ **ONE ATTEMPT ONLY**",
                        "⏱️ **Time Limit:** 10 minutes",
                        "",
                        "Use the button below to submit your combination."
                    ].join("\n");

                components = [
                    row
                ];
            }

            /*
             * =========================================
             * COLOUR GUESS
             * =========================================
             */

            else if (
                currentGame.id ===
                "colour-guess"
            ) {

                const colourGame =
                    currentGame as {

                        getDisplayedHex?: (
                            session: RobberySession
                        ) => string | null;

                        getRemainingRevealTime?: (
                            session: RobberySession
                        ) => number;

                    };

                const displayedHex =
                    colourGame.getDisplayedHex?.(
                        activeSession
                    ) ??
                    "######";

                const colourButton =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:colour:${activeSession.id}`
                        )
                        .setLabel(
                            "Guess Colour"
                        )
                        .setEmoji(
                            "🎨"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const row =
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            colourButton
                        );

                messageContent =
                    [
                        gameHeader(
                            "🎨 **GUESS THE COLOUR**"
                        ),
                        "",
                        `🔢 **HEX:** \`${displayedHex}\``,
                        "",
                        "⏱️ **Full HEX revealed after 10 seconds.**",
                        "⏱️ **Time Limit:** 10 minutes",
                        "",
                        "Use the button below to submit your colour guess."
                    ].join("\n");

                components = [
                    row
                ];

                /*
                 * =========================================
                 * SEND INITIAL COLOUR MESSAGE
                 * =========================================
                 */

                const robberyMessage =
                    await robberyChannel.send({

                        content:
                            messageContent,

                        components
                    });

                /*
                 * =========================================
                 * HEX REVEAL
                 * =========================================
                 */

                const remainingRevealTime =
                    colourGame.getRemainingRevealTime?.(
                        activeSession
                    ) ??
                    10_000;

                setTimeout(
                    async () => {

                        try {

                            if (
                                activeSession.status !==
                                "active"
                            ) {
                                return;
                            }

                            const activeGame =
                                robberyManager.getCurrentGame(
                                    activeSession
                                );

                            if (
                                !activeGame ||
                                activeGame.id !==
                                "colour-guess"
                            ) {
                                return;
                            }

                            const fullHex =
                                colourGame.getDisplayedHex?.(
                                    activeSession
                                );

                            if (!fullHex) {
                                return;
                            }


                            await robberyMessage.edit({

                                content:
                                    [
                                        gameHeader(
                                            "🎨 **GUESS THE COLOUR**"
                                        ),
                                        "",
                                        `🔢 **HEX:** \`${fullHex}\``,
                                        "",
                                        "⏱️ **Full HEX revealed.**",
                                        "⏱️ **Time Limit:** 10 minutes",
                                        "",
                                        "Use the button below to submit your colour guess."
                                    ].join("\n"),

                                components
                            });

                        } catch {
                            /*
                             * Message/channel may no longer exist.
                             */
                        }

                    },
                    Math.max(
                        0,
                        remainingRevealTime
                    )
                );

                /*
                 * =========================================
                 * VICTIM NOTIFICATION
                 * =========================================
                 */

                if (robberyNotificationService) {

                    await robberyNotificationService
                        .notifyVictimOfRobbery(
                            target.id,
                            interaction.user.id,
                            activeSession.id
                        );
                }

                await interaction.editReply({

                    content:
                        [
                            "🚨 **Robbery started!**",
                            "",
                            `🎯 **Target:** ${target}`,
                            `🔐 **Robbery room:** ${robberyChannel}`
                        ].join("\n")
                });

                return;
            }

            /*
             * =========================================
             * BINARY DECRYPTION
             * =========================================
             */

            else if (
                currentGame.id ===
                "binary-decryption"
            ) {

                const binaryGame =
                    currentGame as {

                        getBinary?: (
                            session: RobberySession
                        ) => string | null;

                    };

                const binary =
                    binaryGame.getBinary?.(
                        activeSession
                    ) ??
                    null;

                if (!binary) {

                    throw new Error(
                        "Binary puzzle could not be generated."
                    );
                }

                const binaryButton =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:binary:${activeSession.id}`
                        )
                        .setLabel(
                            "Decrypt Binary"
                        )
                        .setEmoji(
                            "🔢"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const row =
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            binaryButton
                        );

                messageContent =
                    [
                        gameHeader(
                            "💻 **BINARY DECRYPTION**"
                        ),
                        "",
                        "Decode the binary code below and enter the hidden word.",
                        "",
                        `\`\`\`\n${binary}\n\`\`\``,
                        "",
                        "⚠️ **ONE ATTEMPT ONLY**",
                        "⏱️ **Time Limit:** 10 minutes",
                        "",
                        "Use the button below to submit your answer."
                    ].join("\n");

                components = [
                    row
                ];
            }

            /*
             * =========================================
             * GUESS CHARACTER
             * =========================================
             */

            else if (
                currentGame.id ===
                "guess-character"
            ) {

                const guessCharacterGame =
                    currentGame as {

                        getClues?: (
                            session: RobberySession
                        ) => [
                            string,
                            string,
                            string
                        ] | null;

                        getCategory?: (
                            session: RobberySession
                        ) => string | null;

                    };

                const clues =
                    guessCharacterGame.getClues?.(
                        activeSession
                    ) ??
                    null;

                if (!clues) {

                    throw new Error(
                        "The character puzzle could not be generated."
                    );
                }

                const category =
                    guessCharacterGame.getCategory?.(
                        activeSession
                    );

                const clueText =
                    clues
                        .map(
                            (
                                clue,
                                index
                            ) =>
                                `**Clue ${index + 1}:** ${clue}`
                        )
                        .join("\n\n");

                const guessButton =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:guess-character:${activeSession.id}`
                        )
                        .setLabel(
                            "Guess Character"
                        )
                        .setEmoji(
                            "🎭"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const row =
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            guessButton
                        );

                messageContent =
                    [
                        gameHeader(
                            "🎭 **GUESS THE CHARACTER**"
                        ),
                        "",
                        category
                            ? `📚 **Category:** ${category}`
                            : "",
                        category
                            ? ""
                            : null,
                        clueText,
                        "",
                        "⚠️ **ONE ATTEMPT ONLY**",
                        "⏱️ **Time Limit:** 10 minutes",
                        "",
                        "Study all three clues carefully, then use the button below to submit your answer."
                    ]
                        .filter(
                            (
                                line
                            ): line is string =>
                                line !== null
                        )
                        .join("\n");

                components = [
                    row
                ];
            }

            /*
             * =========================================
             * POLICE ESCAPE
             * =========================================
             */

            else if (
                currentGame.id ===
                "police-escape"
            ) {

                const policeGame =
                    currentGame as unknown as {

                        renderMaze: (
                            session: RobberySession
                        ) => Promise<Buffer | null>;

                        getLevel: (
                            session: RobberySession
                        ) => number | null;

                        getMoveCount: (
                            session: RobberySession
                        ) => number;

                        getQuestionsAnswered: (
                            session: RobberySession
                        ) => number;

                        getQuestion: (
                            session: RobberySession
                        ) => unknown;

                        getMaze: (
                            session: RobberySession
                        ) => unknown;

                    };

                const mazeImage =
                    await policeGame.renderMaze(
                        activeSession
                    );

                if (!mazeImage) {

                    throw new Error(
                        "The police escape maze could not be generated."
                    );
                }

                const attachment =
                    new AttachmentBuilder(
                        mazeImage,
                        {
                            name:
                                "police-escape.png"
                        }
                    );

                const level =
                    policeGame.getLevel(
                        activeSession
                    ) ??
                    1;

                /*
                 * =========================================
                 * MOVEMENT CONTROLS
                 * =========================================
                 */

                const up =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:police-escape:up:${activeSession.id}`
                        )
                        .setLabel(
                            "Up"
                        )
                        .setEmoji(
                            "⬆️"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const down =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:police-escape:down:${activeSession.id}`
                        )
                        .setLabel(
                            "Down"
                        )
                        .setEmoji(
                            "⬇️"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const left =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:police-escape:left:${activeSession.id}`
                        )
                        .setLabel(
                            "Left"
                        )
                        .setEmoji(
                            "⬅️"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const right =
                    new ButtonBuilder()
                        .setCustomId(
                            `robbery:police-escape:right:${activeSession.id}`
                        )
                        .setLabel(
                            "Right"
                        )
                        .setEmoji(
                            "➡️"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const movementRows:
                    ActionRowBuilder<ButtonBuilder>[] = [

                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            up
                        ),

                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            left,
                            down,
                            right
                        )
                ];

                /*
                 * =========================================
                 * MAZE INFORMATION
                 * =========================================
                 */

                const maze =
                    policeGame.getMaze(
                        activeSession
                    ) as {
                        getBombs?: () => unknown[];
                    };

                const bombCount =
                    maze?.getBombs?.().length ??
                    0;

                messageContent =
                    [
                        gameHeader(
                            "🚔 **POLICE ESCAPE**"
                        ),
                        "",
                        "Navigate through the maze and reach the green exit.",
                        "",
                        `🗺️ **Maze Level:** ${level}`,
                        `💣 **Hidden Bombs:** ${bombCount}`,
                        "👣 **Moves:** 0",
                        `🧠 **Questions Solved:** 0/${bombCount}`,
                        "",
                        "⚠️ Your first move is free.",
                        "❓ After your first move, every successful move requires a trivia question.",
                        "💣 The number of trivia questions is tied to the number of bombs.",
                        "🚪 Reach the green exit to escape."
                    ].join("\n");

                /*
                 * =========================================
                 * SEND MAZE
                 * =========================================
                 */

                await robberyChannel.send({

                    content:
                        messageContent,

                    files: [
                        attachment
                    ],

                    components:
                        movementRows
                });

                /*
                 * =========================================
                 * VICTIM NOTIFICATION
                 * =========================================
                 */

                if (robberyNotificationService) {

                    await robberyNotificationService
                        .notifyVictimOfRobbery(
                            target.id,
                            interaction.user.id,
                            activeSession.id
                        );
                }

                /*
                 * =========================================
                 * COMMAND RESPONSE
                 * =========================================
                 */

                await interaction.editReply({

                    content:
                        [
                            "🚨 **Robbery started!**",
                            "",
                            `🎯 **Target:** ${target}`,
                            `🔐 **Robbery room:** ${robberyChannel}`
                        ].join("\n")
                });

                return;
            }

            /*
             * =========================================
             * UNSUPPORTED GAME
             * =========================================
             */

            else {

                messageContent =
                    [
                        gameHeader(
                            `⚠️ **${currentGame.name}**`
                        ),
                        "",
                        "This robbery game is not yet supported by the interaction handler."
                    ].join("\n");

                components = [];
            }

            /*
             * =========================================
             * SEND STANDARD GAME MESSAGE
             * =========================================
             */

            await robberyChannel.send({

                content:
                    messageContent,

                components
            });

            /*
             * =========================================
             * VICTIM NOTIFICATION
             * =========================================
             */

            if (robberyNotificationService) {

                await robberyNotificationService
                    .notifyVictimOfRobbery(
                        target.id,
                        interaction.user.id,
                        activeSession.id
                    );
            }

            /*
             * =========================================
             * COMMAND RESPONSE
             * =========================================
             */

            await interaction.editReply({

                content:
                    [
                        "🚨 **Robbery started!**",
                        "",
                        `🎯 **Target:** ${target}`,
                        `🔐 **Robbery room:** ${robberyChannel}`
                    ].join("\n")
            });

        } catch (error) {

            /*
             * =========================================
             * LOG ERROR
             * =========================================
             */

            console.error(
                "[RobCommand] Failed to start robbery:",
                error
            );

            /*
             * =========================================
             * CHANNEL CLEANUP
             * =========================================
             */

            if (robberyChannel) {

                await robberyChannel
                    .delete(
                        "Robbery setup failed."
                    )
                    .catch(
                        () => undefined
                    );
            }

            /*
             * =========================================
             * SESSION CLEANUP
             * =========================================
             */

            if (session) {

                await robberyManager
                    .cancelRobbery(
                        session,
                        "Robbery setup failed."
                    )
                    .catch(
                        () => undefined
                    );
            }

            /*
             * =========================================
             * USER ERROR RESPONSE
             * =========================================
             */

            if (
                interaction.deferred
            ) {

                await interaction
                    .editReply({

                        content:
                            "❌ The robbery could not be started. Please try again later."

                    })
                    .catch(
                        () => undefined
                    );

            } else if (
                !interaction.replied
            ) {

                await interaction
                    .reply({

                        content:
                            "❌ The robbery could not be started. Please try again later.",

                        flags:
                            MessageFlags.Ephemeral

                    })
                    .catch(
                        () => undefined
                    );
            }
        }
    }
};

END FILE: src/plugins/robbery/commands/RobCommand.ts
================================================================================

FILE: src/plugins/robbery/config/RobberyConfig.ts
--------------------------------------------------------------------------------
Original size: 1606 bytes
Exported size: 1525 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
export const RobberyConfig = {

    /*
     * =========================
     * ROBBERY SESSION
     * =========================
     *
     * Total time available to
     * complete the selected games.
     */

    durationMs:
        10 * 60 * 1000,

    /*
     * Number of minigames selected
     * for each robbery.
     *
     * The actual available game count
     * should be determined by the
     * registered robbery game pool,
     * not hard-coded here.
     */

    gamesPerRobbery:
        4,

    /*
     * =========================
     * LOCK COMBINATION
     * =========================
     *
     * Maximum number of attempts
     * allowed for the lock puzzle.
     */

    lockCombinationAttempts:
        1,

    /*
     * =========================
     * ROBBERY COOLDOWN
     * =========================
     *
     * General cooldown between
     * robbery attempts.
     *
     * Victim-specific cooldowns
     * should be handled separately
     * by the robbery session/history
     * system.
     */

    cooldownMs:
        30 * 60 * 1000,

    /*
     * =========================
     * STEAL LIMITS
     * =========================
     *
     * A member must have at least
     * this much Nickel available
     * before they can be robbed.
     */

    minimumSteal:
        100,

    /*
     * Maximum percentage of the
     * victim's wallet that can be
     * stolen during a successful
     * robbery.
     *
     * 0.25 = 25%
     */

    maximumStealPercent:
        0.25

} as const;

END FILE: src/plugins/robbery/config/RobberyConfig.ts
================================================================================

FILE: src/plugins/robbery/core/GuessCharacterQuestionBank.ts
--------------------------------------------------------------------------------
Original size: 183640 bytes
Exported size: 179358 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
export type GuessCharacterCategory =
    | "anime"
    | "manga"
    | "movie"
    | "tv"
    | "web-series"
    | "video-game"
    | "literature"
    | "comic"
    | "historical"
    | "real-life";

/*
 * =========================
 * QUESTION TYPE
 * =========================
 *
 * Every question contains exactly
 * three progressively useful clues.
 */

export type GuessCharacterQuestion = {
    readonly id: string;

    readonly character: string;

    readonly source: string;

    readonly category:
        GuessCharacterCategory;

    readonly clues: [
    string,
    string,
    string
     ];
    
};

/*
 * =========================
 * QUESTION BANK
 * =========================
 *
 * Keep this collection readonly.
 *
 * The Question Manager is responsible
 * for selecting questions; this file
 * remains the single source of truth
 * for question content.
 */

export const GUESS_CHARACTER_QUESTIONS:
    readonly GuessCharacterQuestion[] = [

    {
        id: "anime-0001",

        character:
            "Itachi Uchiha",

        source:
            "Naruto",

        category:
            "anime",

        clues: [
            "He willingly carried a reputation that concealed the reason behind his choices.",
            "Someone he cared deeply about grew to despise him because of what he did.",
            "His actions were tied to a conflict between his clan and the village."
        ]
    },

    // Keep the remaining existing questions
    // exactly as they are below this point.

    {
        id: "anime-0002",
        character: "Lelouch Lamperouge",
        source: "Code Geass",
        category: "anime",
        clues: [
            "He built a rebellion while carefully separating his public identity from his secret one.",
            "His greatest advantage came from an ability that could directly influence another person's actions.",
            "His final plan depended on making the world unite against a single enemy."
        ]
    },

    {
        id: "anime-0003",
        character: "Light Yagami",
        source: "Death Note",
        category: "anime",
        clues: [
            "His extraordinary intelligence gradually became both his greatest strength and his greatest weakness.",
            "He believed that eliminating certain people could create a better society.",
            "A supernatural notebook became the foundation of his secret campaign."
        ]
    },

    {
        id: "anime-0004",
        character: "Johan Liebert",
        source: "Monster",
        category: "anime",
        clues: [
            "People around him often became instruments of destruction without realizing how they were being manipulated.",
            "His identity and childhood were connected to experiments involving human psychology.",
            "A surgeon's decision to save him ultimately set the central events of the story in motion."
        ]
    },

    {
        id: "anime-0005",
        character: "Killua Zoldyck",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "He was raised in an environment where killing was treated as a family profession.",
            "Removing something implanted in him became an important step toward making his own decisions.",
            "His friendship with a determined boy gradually changed what he wanted from life."
        ]
    },

    {
        id: "anime-0006",
        character: "Kurapika",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "His strongest abilities become especially dangerous when facing a particular group.",
            "A tragedy involving his people shaped nearly every major decision he made.",
            "His eyes change dramatically when he experiences intense emotion."
        ]
    },

    {
        id: "anime-0007",
        character: "Guts",
        source: "Berserk",
        category: "anime",
        clues: [
            "He was born into circumstances so grim that survival itself became his earliest achievement.",
            "A single event transformed his relationship with nearly everyone around him.",
            "He carries an enormous weapon while being pursued by forces far beyond ordinary humans."
        ]
    },

    {
        id: "anime-0008",
        character: "Griffith",
        source: "Berserk",
        category: "anime",
        clues: [
            "His greatest ambition required him to gather people who were willing to follow him into battle.",
            "His appearance and charisma often concealed how ruthless his ambition could become.",
            "A catastrophic eclipse permanently changed the fate of those who had followed him."
        ]
    },

    {
        id: "anime-0009",
        character: "Eren Yeager",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "His understanding of the world changes dramatically after discovering what lies beyond the walls.",
            "He eventually becomes willing to sacrifice his own reputation for a plan that terrifies his former allies.",
            "His ability is connected to one of the most important powers in the story."
        ]
    },

    {
        id: "anime-0010",
        character: "Levi Ackerman",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He developed an exceptional reputation despite coming from a background far removed from military prestige.",
            "His combat ability is particularly suited to fighting enormous humanoid enemies.",
            "He became one of the most trusted soldiers of a commander who valued his judgment."
        ]
    },

    {
        id: "anime-0011",
        character: "Satoru Gojo",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "His confidence is supported by an ability that makes approaching him extraordinarily difficult.",
            "He deliberately acts carefree despite understanding how dangerous the world around him is.",
            "His eyes are normally concealed because of the extraordinary ability associated with them."
        ]
    },

    {
        id: "anime-0012",
        character: "Suguru Geto",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "His worldview changed after repeatedly witnessing the darker side of the people he was supposed to protect.",
            "He eventually rejected the purpose he once shared with one of his closest friends.",
            "His ability allows him to control beings born from negative human emotions."
        ]
    },

    {
        id: "anime-0013",
        character: "Tanjiro Kamado",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "A family tragedy forces him to enter a dangerous world that he previously knew little about.",
            "Despite fighting creatures that were once human, he often retains compassion toward them.",
            "His fighting style eventually incorporates techniques associated with his family's traditions."
        ]
    },

    {
        id: "anime-0014",
        character: "Kokushibo",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "His transformation into something no longer human was influenced by an intense rivalry.",
            "He spent centuries pursuing strength while remaining haunted by someone from his past.",
            "His appearance contains multiple eyes and reflects his connection to an ancient swordsman."
        ]
    },

    {
        id: "anime-0015",
        character: "Makima",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "She presents herself as calm and approachable while carefully controlling the people around her.",
            "Several characters willingly follow her without fully understanding her intentions.",
            "Her influence over others is central to the protagonist's understanding of his new life."
        ]
    },

    {
        id: "anime-0016",
        character: "Denji",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "His earliest ambitions are surprisingly ordinary considering the violent world he inhabits.",
            "A loyal companion becomes the reason he gains abilities far beyond those of an ordinary human.",
            "His body can produce a distinctive weapon from his head and limbs."
        ]
    },

    {
        id: "anime-0017",
        character: "Edward Elric",
        source: "Fullmetal Alchemist",
        category: "anime",
        clues: [
            "A childhood mistake permanently changed his body and that of someone very close to him.",
            "He travels while searching for a way to restore what was lost.",
            "His reputation is closely connected to a title earned through exceptional skill."
        ]
    },

    {
        id: "anime-0018",
        character: "Roy Mustang",
        source: "Fullmetal Alchemist",
        category: "anime",
        clues: [
            "His ambitions extend beyond his current military position.",
            "He relies on a specialized form of alchemy that becomes especially destructive when conditions allow it.",
            "A major part of his motivation involves changing the system responsible for atrocities he witnessed."
        ]
    },

    {
        id: "anime-0019",
        character: "Hisoka Morow",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "He is fascinated by opponents whose potential has not yet reached its peak.",
            "His motivations frequently have little to do with conventional alliances.",
            "His fighting style revolves around an ability that behaves much like an extremely elastic substance."
        ]
    },

    {
        id: "anime-0020",
        character: "Shikamaru Nara",
        source: "Naruto",
        category: "anime",
        clues: [
            "He often complains about how troublesome everything is despite possessing exceptional strategic ability.",
            "His greatest strength is not physical power but his ability to anticipate an opponent's actions.",
            "He eventually takes on responsibilities that require him to lead others despite preferring a quiet life."
        ]
    },

    { 
        id: "anime-0021",
        character: "Kakashi Hatake",
        source: "Naruto",
        category: "anime",
        clues: [
            "He became responsible for young shinobi after surviving the loss of people close to him.",
            "A technique he possesses was originally associated with someone who entrusted him with more than just a weapon.",
            "He often hides part of his face even though his reputation as a ninja is already well established."
        ]
    }, 


    {
        id: "anime-0022",
        character: "Obito Uchiha",
        source: "Naruto",
        category: "anime",
        clues: [
            "His ambitions were shaped by an event that caused him to reject the world he once wanted to protect.",
            "For years, he concealed his identity behind an unusual persona.",
            "His abilities allowed him to manipulate space itself and made conventional attacks extremely difficult to land."
        ]
    },

    {
        id: "anime-0023",
        character: "Madara Uchiha",
        source: "Naruto",
        category: "anime",
        clues: [
            "He believed lasting peace could only exist if people were freed from the reality they were living in.",
            "His rivalry with a childhood friend eventually became one of the defining conflicts of his era.",
            "His plans continued influencing events long after most people believed he was gone."
        ]
    },

    {
        id: "anime-0024",
        character: "Minato Namikaze",
        source: "Naruto",
        category: "anime",
        clues: [
            "His reputation was built on speed so extraordinary that enemies developed a special warning concerning him.",
            "He became responsible for protecting a village during a catastrophic attack.",
            "A technique involving teleportation became one of the foundations of his fighting style."
        ]
    },

    {
        id: "anime-0025",
        character: "Jiraiya",
        source: "Naruto",
        category: "anime",
        clues: [
            "He spent much of his life gathering information while appearing far less serious than he actually was.",
            "His teachings influenced a young shinobi who would later become central to the fate of the village.",
            "His investigation into an enemy organization eventually brought him dangerously close to its leader."
        ]
    },

    {
        id: "anime-0026",
        character: "Pain",
        source: "Naruto",
        category: "anime",
        clues: [
            "His philosophy was shaped by repeated experiences of war and loss.",
            "He believed that suffering could be used to teach humanity the value of peace.",
            "What appeared to be one individual was actually the result of several bodies being controlled through a single will."
        ]
    },

    {
        id: "anime-0027",
        character: "Neji Hyuga",
        source: "Naruto",
        category: "anime",
        clues: [
            "He initially believed that one's future was determined by circumstances that could not be escaped.",
            "His abilities are closely connected to a distinctive eye technique passed down through his clan.",
            "A battle against someone he underestimated forced him to reconsider his beliefs about destiny."
        ]
    },

    {
        id: "anime-0028",
        character: "Gaara",
        source: "Naruto",
        category: "anime",
        clues: [
            "His childhood convinced him that relying on other people was dangerous.",
            "He was feared because of something sealed within him rather than because of his personality alone.",
            "His transformation into a leader was strongly influenced by someone who defeated him without killing him."
        ]
    },

    {
        id: "anime-0029",
        character: "Sasori",
        source: "Naruto",
        category: "anime",
        clues: [
            "His fear of losing loved ones eventually led him to abandon much of his own humanity.",
            "He transformed people into weapons that could be controlled long after their deaths.",
            "His obsession with preserving things permanently influenced both his appearance and his fighting style."
        ]
    },

    {
        id: "anime-0030",
        character: "Deidara",
        source: "Naruto",
        category: "anime",
        clues: [
            "He considered temporary destruction to be a form of artistic expression.",
            "His unusual fighting style depended on material that he shaped into creatures and explosive weapons.",
            "He repeatedly argued that the value of his creations came from the instant in which they disappeared."
        ]
    },

    {
        id: "anime-0031",
        character: "Mikasa Ackerman",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "A traumatic event during childhood permanently changed the direction of her life.",
            "She possesses exceptional physical ability despite having no supernatural transformation.",
            "Her loyalty toward someone from her childhood repeatedly influences the decisions she makes."
        ]
    },

    {
        id: "anime-0032",
        character: "Armin Arlert",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He was initially considered physically weak but repeatedly proved valuable through strategic thinking.",
            "A childhood dream involving the outside world influenced his desire to join the military.",
            "He eventually inherited a power that allowed him to become a devastating weapon despite his earlier limitations."
        ]
    },

    {
        id: "anime-0033",
        character: "Erwin Smith",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He was willing to make decisions that placed enormous numbers of soldiers at risk for information.",
            "A personal mystery from his childhood influenced his determination to discover the truth.",
            "He became the leader of a military organization despite knowing that many of his plans could cost him his life."
        ]
    },

    {
        id: "anime-0034",
        character: "Reiner Braun",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He spent years living among people he had originally been trained to consider enemies.",
            "The expectations placed upon him during childhood contributed heavily to his choices.",
            "His ability allows him to transform into a heavily armored giant."
        ]
    },

    {
        id: "anime-0035",
        character: "Kenny Ackerman",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He survived for years in an environment where violence was treated as an ordinary way of life.",
            "His relationship with a powerful military figure was more complicated than their opposing positions suggested.",
            "He became associated with a weapon that allowed him to fight using equipment originally designed for another purpose."
        ]
    },

    {
        id: "anime-0036",
        character: "Toji Fushiguro",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He was born into a family where his natural abilities were judged by standards he could not meet.",
            "Despite lacking the energy normally associated with sorcerers, his physical abilities became extraordinarily dangerous.",
            "His arsenal included specialized tools designed to counter supernatural techniques."
        ]
    },

    {
        id: "anime-0037",
        character: "Ryomen Sukuna",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "His reputation was so terrifying that fragments of his existence remained dangerous even after his original era ended.",
            "He views most people around him according to whether they are useful or entertaining.",
            "His connection to the protagonist begins through the consumption of something that should never have been eaten."
        ]
    },

    {
        id: "anime-0038",
        character: "Megumi Fushiguro",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He possesses an inherited technique that allows him to call upon multiple supernatural creatures.",
            "His personal values lead him to judge people differently depending on what he believes they deserve.",
            "His family history connects him to a person whose physical abilities are almost the opposite of his own."
        ]
    },

    {
        id: "anime-0039",
        character: "Roronoa Zoro",
        source: "One Piece",
        category: "anime",
        clues: [
            "A promise made to someone important during childhood became a permanent part of his ambition.",
            "He follows a fighting style that requires him to use more weapons than most swordsmen would consider practical.",
            "His greatest personal goal is connected to becoming the world's greatest practitioner of his chosen art."
        ]
    },

    {
        id: "anime-0040",
        character: "Trafalgar D. Water Law",
        source: "One Piece",
        category: "anime",
        clues: [
            "A childhood illness and the destruction of his homeland shaped his entire worldview.",
            "His powers allow him to manipulate a defined space rather than simply attacking an opponent directly.",
            "His alliance with a pirate captain was originally created for a specific purpose but became much more complicated."
        ]
    },

        {
        id: "anime-0041",
        character: "Monkey D. Luffy",
        source: "One Piece",
        category: "anime",
        clues: [
            "His ambition began with an encounter that permanently changed how he viewed freedom.",
            "He has repeatedly turned enemies into allies without intending to build a conventional organization.",
            "His unusual physical abilities originate from something he consumed as a child."
        ]
    },

    {
        id: "anime-0042",
        character: "Shanks",
        source: "One Piece",
        category: "anime",
        clues: [
            "A decision made during a childhood encounter influenced another person's lifelong ambition.",
            "He is respected by people who normally have little reason to respect one another.",
            "His influence extends far beyond the size of the crew he personally commands."
        ]
    },

    {
        id: "anime-0043",
        character: "Portgas D. Ace",
        source: "One Piece",
        category: "anime",
        clues: [
            "His existence was deliberately hidden because of the identity of one of his parents.",
            "He rejected an opportunity to inherit something associated with his biological family.",
            "His final moments were spent protecting someone whose determination had become important to him."
        ]
    },

    {
        id: "anime-0044",
        character: "Nico Robin",
        source: "One Piece",
        category: "anime",
        clues: [
            "Her childhood made her suspicious of nearly everyone who offered her protection.",
            "She became valuable to powerful organizations because of knowledge that very few people could obtain.",
            "Her greatest ability is connected to a talent that allows body parts to appear at a distance."
        ]
    },

    {
        id: "anime-0045",
        character: "Donquixote Doflamingo",
        source: "One Piece",
        category: "anime",
        clues: [
            "His childhood involved experiencing both privilege and extreme hatred from ordinary people.",
            "He controlled a kingdom while secretly maintaining a criminal organization.",
            "His powers allow him to create and manipulate extremely strong threads."
        ]
    },

    {
        id: "anime-0046",
        character: "Dracule Mihawk",
        source: "One Piece",
        category: "anime",
        clues: [
            "He has little interest in political authority despite being recognized among the most dangerous pirates.",
            "His reputation was established primarily through his mastery of a single weapon.",
            "He eventually takes an unusual interest in the progress of a swordsman who once challenged him."
        ]
    },

    {
        id: "anime-0047",
        character: "Boa Hancock",
        source: "One Piece",
        category: "anime",
        clues: [
            "Her public position hides experiences that she rarely discusses openly.",
            "Her ability can turn opponents into stone under certain circumstances.",
            "Despite ruling over an isolated group, she develops an unusual attachment to someone who does not react to her reputation as expected."
        ]
    },

    {
        id: "anime-0048",
        character: "Sanji",
        source: "One Piece",
        category: "anime",
        
        clues: [
            "His childhood involved a family that considered certain physical traits more important than compassion.",
            "He refuses to use his hands in combat because they have another purpose that he considers sacred.",
            "His greatest personal ambition involves finding a legendary location associated with all the world's seas."
        ]
    },

    {
        id: "anime-0049",
        character: "Brook",
        source: "One Piece",
        category: "anime",
        clues: [
            "He continued fulfilling a promise long after everyone involved had disappeared from his life.",
            "A supernatural ability allowed him to return after death, but not in the form he originally expected.",
            "Music and a distinctive appearance became closely associated with his identity."
        ]
    },

    {
        id: "anime-0050",
        character: "Nefertari Vivi",
        source: "One Piece",
        category: "anime",
        clues: [
            "She entered a criminal organization while secretly working toward the survival of her homeland.",
            "Her greatest concern was preventing a civil conflict rather than winning a conventional battle.",
            "She temporarily traveled with pirates despite belonging to a royal family."
        ]
    },

    {
        id: "anime-0051",
        character: "Yusuke Urameshi",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "His reputation at school suggested one personality while his actions eventually revealed another.",
            "His death unexpectedly became the beginning of a supernatural career.",
            "He eventually becomes involved in conflicts between humans, demons, and the spirit world."
        ]
    },

    {
        id: "anime-0052",
        character: "Kurama",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "He possesses knowledge from a life that began before his current human existence.",
            "His calm personality contrasts sharply with how dangerous he can become when protecting someone important.",
            "His abilities are strongly connected to plants and the manipulation of living matter."
        ]
    },

    {
        id: "anime-0053",
        character: "Hiei",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "He grew up separated from the people who shared his origins.",
            "He initially treated cooperation as a weakness but gradually formed connections with people he respected.",
            "One of his most recognizable abilities involves black flames."
        ]
    },

    {
        id: "anime-0054",
        character: "Sailor Moon",
        source: "Sailor Moon",
        category: "anime",
        clues: [
            "Her ordinary personality often contrasts with the responsibility placed upon her.",
            "She gradually discovers that her current life is connected to an ancient identity.",
            "Her greatest battles involve protecting a group whose members are linked to celestial bodies."
        ]
    },

    {
        id: "anime-0055",
        character: "Spike Spiegel",
        source: "Cowboy Bebop",
        category: "anime",
        clues: [
            "He often behaves as though danger is merely another part of an ordinary day.",
            "His past with a criminal organization continues to interfere with the life he tries to live afterward.",
            "His fighting style combines martial arts with the instincts of someone accustomed to bounty hunting."
        ]
    },

    {
        id: "anime-0056",
        character: "Vash the Stampede",
        source: "Trigun",
        category: "anime",
        clues: [
            "He is feared for a reputation that does not match his preferred approach to violence.",
            "He repeatedly attempts to protect human life even when doing so places him in extreme danger.",
            "A bounty attached to his name follows him across a largely desert world."
        ]
    },

    {
        id: "anime-0057",
        character: "Edward Wong Hau Pepelu Tivrusky IV",
        source: "Cowboy Bebop",
        category: "anime",
        clues: [
            "Their unusual behavior causes people to underestimate the seriousness of their abilities.",
            "They contribute to investigations through extraordinary skill with computers.",
            "Their relationship with conventional identity and gender is intentionally unconventional."
        ]
    },

    {
        id: "anime-0058",
        character: "Shinji Ikari",
        source: "Neon Genesis Evangelion",
        category: "anime",
        clues: [
            "He is recruited into a role he never appears emotionally prepared to accept.",
            "Much of his struggle comes from seeking approval from a parent who rarely provides it directly.",
            "His connection to a giant biomechanical weapon becomes central to a much larger mystery."
        ]
    },

    {
        id: "anime-0059",
        character: "Rei Ayanami",
        source: "Neon Genesis Evangelion",
        category: "anime",
        clues: [
            "Her quiet personality hides an origin that becomes increasingly important to the story.",
            "She is closely associated with a giant weapon despite appearing physically fragile.",
            "Questions about identity and whether a person can be replaced are strongly connected to her existence."
        ]
    },

    {
        id: "anime-0060",
        character: "Asuka Langley Soryu",
        source: "Neon Genesis Evangelion",
        category: "anime",
        clues: [
            "She uses confidence and competitiveness to hide vulnerabilities connected to her childhood.",
            "Her identity is strongly connected to being recognized as exceptionally capable.",
            "Her psychological struggles eventually affect her ability to perform the role she once took great pride in."
        ]
    },

        {
        id: "anime-0061",
        character: "Ichigo Kurosaki",
        source: "Bleach",
        category: "anime",
        clues: [
            "He gains responsibilities after an encounter that forces him to see a world normally hidden from humans.",
            "His unusual heritage eventually explains why he can access several different types of supernatural power.",
            "Protecting his friends repeatedly becomes more important to him than understanding his own abilities."
        ]
    },

    {
        id: "anime-0062",
        character: "Rukia Kuchiki",
        source: "Bleach",
        category: "anime",
        clues: [
            "A decision made during an emergency permanently changes the life of an ordinary teenager.",
            "She belongs to a powerful family despite having a complicated position within it.",
            "Her relationship with a substitute carrying her responsibilities becomes central to the early story."
        ]
    },

    {
        id: "anime-0063",
        character: "Byakuya Kuchiki",
        source: "Bleach",
        category: "anime",
        clues: [
            "He places enormous importance on rules even when following them causes personal suffering.",
            "His position gives him authority over one of the most respected families in his society.",
            "His weapon creates an overwhelming number of blade-like fragments."
        ]
    },

    {
        id: "anime-0064",
        character: "Kenpachi Zaraki",
        source: "Bleach",
        category: "anime",
        clues: [
            "He measures people primarily by whether they can provide him with an interesting fight.",
            "His enormous spiritual power was present long before he understood how much he was suppressing.",
            "He deliberately avoids making combat easier for himself because he enjoys the struggle."
        ]
    },

    {
        id: "anime-0065",
        character: "Sosuke Aizen",
        source: "Bleach",
        category: "anime",
        clues: [
            "His calm and trustworthy appearance concealed a plan that had been developing for years.",
            "He manipulated people by controlling what they believed they had witnessed.",
            "His ambition eventually placed him in conflict with both the established order and those who once trusted him."
        ]
    },

    {
        id: "anime-0066",
        character: "Kisuke Urahara",
        source: "Bleach",
        category: "anime",
        clues: [
            "His seemingly foolish behavior hides an exceptionally analytical mind.",
            "He spent time outside the society he once served while continuing to influence events from the shadows.",
            "His inventions and research become important to the development of the protagonist's abilities."
        ]
    },

    {
        id: "anime-0067",
        character: "Shunsui Kyoraku",
        source: "Bleach",
        category: "anime",
        clues: [
            "His relaxed personality makes him appear less serious than his position actually requires.",
            "He prefers avoiding unnecessary conflict but becomes extremely dangerous when forced to fight seriously.",
            "His abilities transform children's games and familiar rules into lethal combat mechanics."
        ]
    },

    {
        id: "anime-0068",
        character: "Ulquiorra Cifer",
        source: "Bleach",
        category: "anime",
        clues: [
            "He repeatedly questions whether something as intangible as a heart truly exists.",
            "His emotional detachment makes him difficult for others to understand.",
            "His battle with the protagonist eventually reveals a transformation far beyond his ordinary appearance."
        ]
    },

    {
        id: "anime-0069",
        character: "Grimmjow Jaegerjaquez",
        source: "Bleach",
        category: "anime",
        clues: [
            "He views strength as the primary measure of worth.",
            "His rivalry with the protagonist develops from repeated attempts to prove superiority.",
            "His transformed state gives him characteristics associated with a predatory feline."
        ]
    },

    {
        id: "anime-0070",
        character: "Mayuri Kurotsuchi",
        source: "Bleach",
        category: "anime",
        clues: [
            "His scientific curiosity often overrides ordinary ethical considerations.",
            "He treats battles as opportunities to gather information about his opponents.",
            "His appearance and behavior are deliberately designed to make him seem unlike a conventional scientist."
        ]
    },

    {
        id: "anime-0071",
        character: "Gintoki Sakata",
        source: "Gintama",
        category: "anime",
        clues: [
            "He frequently avoids responsibility despite possessing a history that proves he is far more capable than he appears.",
            "He survives through odd jobs in a society where traditional warriors have lost their former status.",
            "His attachment to an old group of comrades repeatedly pulls him back into serious conflicts."
        ]
    },

    {
        id: "anime-0072",
        character: "Katsura Kotaro",
        source: "Gintama",
        category: "anime",
        clues: [
            "He is considered a criminal by the authorities despite believing he is fighting for his people's freedom.",
            "His closest companion is not human and is frequently mistaken for something much less intelligent.",
            "He maintains a serious revolutionary identity while repeatedly becoming involved in absurd situations."
        ]
    },

    {
        id: "anime-0073",
        character: "Saitama",
        source: "One Punch Man",
        category: "anime",
        clues: [
            "He achieved extraordinary strength through a routine that sounds almost disappointingly ordinary.",
            "His greatest frustration is often finding opponents capable of giving him a satisfying battle.",
            "Despite possessing overwhelming power, his public reputation does not initially reflect his actual ability."
        ]
    },

    {
        id: "anime-0074",
        character: "Genos",
        source: "One Punch Man",
        category: "anime",
        clues: [
            "A catastrophic event from his past drives his desire to become stronger.",
            "He repeatedly upgrades his body in pursuit of an enemy he has sworn to defeat.",
            "He becomes a student of someone whose approach to strength is almost completely different from his own."
        ]
    },

    {
        id: "anime-0075",
        character: "Garou",
        source: "One Punch Man",
        category: "anime",
        clues: [
            "He believes society unfairly decides who deserves to be called a hero or villain.",
            "His obsession with defeating heroes begins during his training under someone who once taught him martial arts.",
            "His body repeatedly adapts as he approaches increasingly dangerous opponents."
        ]
    },

    {
        id: "anime-0076",
        character: "All Might",
        source: "My Hero Academia",
        category: "anime",
        clues: [
            "His public image was deliberately constructed to give ordinary people hope.",
            "He passed an inherited ability to someone who initially possessed no comparable power.",
            "A serious injury forced him to conceal how dramatically his physical condition had changed."
        ]
    },

    {
        id: "anime-0077",
        character: "Izuku Midoriya",
        source: "My Hero Academia",
        category: "anime",
        clues: [
            "He spent his childhood studying people who possessed abilities he believed he could never obtain.",
            "His greatest power is inherited rather than originally belonging to him.",
            "Learning how to use that power safely becomes one of his earliest major challenges."
        ]
    },

    {
        id: "anime-0078",
        character: "Katsuki Bakugo",
        source: "My Hero Academia",
        category: "anime",
        clues: [
            "His confidence was reinforced from childhood because his ability appeared naturally suited to combat.",
            "He sees being surpassed by someone he once considered inferior as a personal failure.",
            "His fighting style converts a physical substance produced by his body into explosive attacks."
        ]
    },

    {
        id: "anime-0079",
        character: "Shoto Todoroki",
        source: "My Hero Academia",
        category: "anime",
        clues: [
            "His abilities are the result of a family ambition that he initially refuses to embrace.",
            "He deliberately avoids using one side of his power because of what it represents to him.",
            "A confrontation with someone from his family eventually changes his relationship with that ability."
        ]
    },

    {
        id: "anime-0080",
        character: "Tomura Shigaraki",
        source: "My Hero Academia",
        category: "anime",
        clues: [
            "His childhood trauma was manipulated by someone who wanted to shape him into a successor.",
            "His destructive ability becomes increasingly dangerous as he learns to use it more effectively.",
            "His relationship with the society he wants to destroy is connected to the failure of the hero system itself."
        ]
    },

        {
        id: "anime-0081",
        character: "Eren Yeager",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "His hatred of the world beyond his home begins with a personal tragedy that permanently changes his ambitions.",
            "He eventually discovers that the enemy he feared is connected to secrets within his own society.",
            "His understanding of freedom becomes increasingly extreme as he learns more about the world."
        ]
    },

    {
        id: "anime-0082",
        character: "Levi Ackerman",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He was raised in an environment where survival depended more on practical instincts than formal education.",
            "His reputation among soldiers was established through an extraordinary ability to fight despite his small stature.",
            "His loyalty to a particular commander repeatedly places him in situations where personal feelings must be sacrificed."
        ]
    },

    {
        id: "anime-0083",
        character: "Erwin Smith",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "His greatest ambition was connected to a question he had been asking since childhood.",
            "He was willing to make decisions that placed enormous numbers of people at risk for the sake of discovering the truth.",
            "His leadership required him to maintain confidence even when he privately doubted the morality of his choices."
        ]
    },

    {
        id: "anime-0084",
        character: "Reiner Braun",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He was raised to believe that completing a dangerous mission would bring honor to his family.",
            "His role forced him to live among people he had originally been taught to consider enemies.",
            "The contradiction between his mission and his attachment to those around him eventually causes a severe psychological struggle."
        ]
    },

    {
        id: "anime-0085",
        character: "Armin Arlert",
        source: "Attack on Titan",
        category: "anime",
        clues: [
            "He was often considered physically weaker than his closest childhood companions.",
            "His greatest contribution repeatedly comes from recognizing possibilities that stronger fighters overlook.",
            "A decision made during a desperate battle eventually leaves him carrying an ability once possessed by someone else."
        ]
    },

    {
        id: "anime-0086",
        character: "Killua Zoldyck",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "He was raised by a family that treated assassination as a normal profession.",
            "His natural talent made him unusually dangerous even before he received formal training from outside his family.",
            "His friendship with another young hunter becomes one of the main reasons he begins rejecting the future planned for him."
        ]
    },

    {
        id: "anime-0087",
        character: "Hisoka Morow",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "He rarely fights simply for ideological reasons and instead seeks opponents who might become more interesting later.",
            "His personality makes it difficult for others to determine whether he is helping them or preparing to fight them.",
            "His ability allows him to manipulate a substance whose properties he compares to a familiar sweet."
        ]
    },

    {
        id: "anime-0088",
        character: "Chrollo Lucilfer",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "He leads a group whose members are identified by a symbolic marking and a numerical system.",
            "His ability allows him to use techniques that originally belonged to other people.",
            "Despite leading criminals, he displays an unusual level of emotional attachment to the members of his group."
        ]
    },

    {
        id: "anime-0089",
        character: "Gon Freecss",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "His decision to become a hunter is closely connected to a parent who was largely absent from his childhood.",
            "His simple and optimistic personality often hides an unusually stubborn willingness to sacrifice himself.",
            "His strongest transformation comes after he abandons the possibility of returning to his former self."
        ]
    },

    {
        id: "anime-0090",
        character: "Kurapika",
        source: "Hunter x Hunter",
        category: "anime",
        clues: [
            "His entire clan was destroyed because of a distinctive physical characteristic that outsiders considered valuable.",
            "He designed his strongest abilities around restrictions that become more severe depending on his target.",
            "His desire for revenge gradually becomes complicated by responsibilities involving people outside his original mission."
        ]
    },

    {
        id: "anime-0091",
        character: "Edward Elric",
        source: "Fullmetal Alchemist: Brotherhood",
        category: "anime",
        clues: [
            "A childhood experiment performed with a close family member leaves both brothers permanently changed.",
            "He becomes unusually sensitive about being mistaken for someone younger because of his physical appearance.",
            "His search for a way to restore what was lost eventually reveals truths about the country he serves."
        ]
    },

    {
        id: "anime-0092",
        character: "Roy Mustang",
        source: "Fullmetal Alchemist: Brotherhood",
        category: "anime",
        clues: [
            "His ambitions are political as much as military, despite serving within a highly structured organization.",
            "A particular type of weaponized technique makes him extremely dangerous when environmental conditions are favorable.",
            "His experiences during a previous conflict leave him determined to change the system from within."
        ]
    },

    {
        id: "anime-0093",
        character: "Riza Hawkeye",
        source: "Fullmetal Alchemist: Brotherhood",
        category: "anime",
        clues: [
            "Her military skill is based more on precision and discipline than supernatural abilities.",
            "A secret connected to her family history becomes important to the ambitions of her superior.",
            "She remains loyal to someone whose political goals are shaped by guilt over a previous war."
        ]
    },

    {
        id: "anime-0094",
        character: "Sosuke Aizen",
        source: "Bleach",
        category: "anime",
        clues: [
            "For much of his early appearance, he deliberately cultivates an image of kindness and reliability.",
            "His greatest advantage comes from controlling what opponents believe they have seen.",
            "His ambitions eventually extend beyond the established hierarchy of the supernatural world."
        ]
    },

    {
        id: "anime-0095",
        character: "Kenpachi Zaraki",
        source: "Bleach",
        category: "anime",
        clues: [
            "He became feared within his organization despite having little interest in conventional leadership.",
            "His greatest enjoyment comes from battles that allow him to fight opponents who can survive against him.",
            "He deliberately suppresses aspects of his own strength because overwhelming an opponent too quickly would make combat less enjoyable."
        ]
    },

    {
        id: "anime-0096",
        character: "Shikamaru Nara",
        source: "Naruto",
        category: "anime",
        clues: [
            "He frequently complains about how troublesome everything is despite possessing exceptional strategic intelligence.",
            "His abilities become particularly effective when he can control the position of an opponent rather than overpower them.",
            "A major personal loss forces him to take responsibility far earlier than he expected."
        ]
    },

    {
        id: "anime-0097",
        character: "Orochimaru",
        source: "Naruto",
        category: "anime",
        clues: [
            "His fear of death leads him to pursue knowledge that most people consider forbidden.",
            "He repeatedly changes bodies in an attempt to extend his existence and continue his research.",
            "His interest in young prodigies is often motivated by the potential abilities they might eventually develop."
        ]
    },

    {
        id: "anime-0098",
        character: "Jiraiya",
        source: "Naruto",
        category: "anime",
        clues: [
            "His reputation as a wandering eccentric hides a history of training several individuals who later became extremely influential.",
            "He spent years searching for information connected to a prophecy about a student.",
            "His final investigation requires him to return to a place where he once had an important connection."
        ]
    },

    {
        id: "anime-0099",
        character: "Misa Amane",
        source: "Death Note",
        category: "anime",
        clues: [
            "Her life changes after an event involving a supernatural being that she does not initially fully understand.",
            "She becomes devoted to someone whose goals are far more calculating than her own.",
            "She possesses an ability that allows her to obtain information about people at the cost of part of her remaining lifespan."
        ]
    },

    {
        id: "anime-0100",
        character: "Near",
        source: "Death Note",
        category: "anime",
        clues: [
            "He was raised in an institution designed to identify children capable of succeeding a famous investigator.",
            "He approaches major cases by constructing possibilities rather than relying on conventional authority.",
            "His investigation eventually brings him into direct competition with someone who inherited another investigator's unfinished work."
        ]
    },

        {
        id: "anime-0101",
        character: "Tanjiro Kamado",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He returns home to discover that his family has suffered a tragedy while he was away.",
            "His journey becomes complicated when the one surviving member of his family is no longer entirely human.",
            "He develops his fighting style by combining techniques learned from different traditions."
        ]
    },

    {
        id: "anime-0102",
        character: "Zenitsu Agatsuma",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He frequently believes that he is incapable of surviving the situations he encounters.",
            "His greatest combat ability appears under circumstances in which his conscious behavior changes dramatically.",
            "Despite his fearfulness, he possesses a technique that he has developed to an unusually high level."
        ]
    },

    {
        id: "anime-0103",
        character: "Inosuke Hashibira",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He was raised far from conventional human society and developed unusual habits because of it.",
            "He initially interprets many social situations as competitions that must be won.",
            "His fighting style is based on movements and senses that he developed through his unusual upbringing."
        ]
    },

    {
        id: "anime-0104",
        character: "Giyu Tomioka",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He is among the first members of an elite group encountered by the protagonist.",
            "His reserved personality causes others to misunderstand the reasons behind some of his decisions.",
            "His fighting style is associated with a technique that emphasizes controlled and flowing movements."
        ]
    },

    {
        id: "anime-0105",
        character: "Shinobu Kocho",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "She belongs to an elite group despite lacking the physical strength normally associated with its members.",
            "Her approach to defeating enemies relies heavily on knowledge of medicine and chemistry.",
            "Her cheerful manner often conceals resentment connected to a personal loss."
        ]
    },

    {
        id: "anime-0106",
        character: "Kyojuro Rengoku",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "His enthusiasm remains unusually strong even when confronting situations that most people would find terrifying.",
            "His family has a long association with a particular combat tradition.",
            "A major battle forces him to defend others while facing an opponent whose physical abilities vastly exceed those of ordinary humans."
        ]
    },

    {
        id: "anime-0107",
        character: "Tengen Uzui",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He considers dramatic presentation an important part of how he approaches almost everything.",
            "His background involves training that differs significantly from that of most members of his organization.",
            "A mission involving an entertainment district forces him to rely on information gathered through several undercover agents."
        ]
    },

    {
        id: "anime-0108",
        character: "Muzan Kibutsuji",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "His existence is connected to the origin of the creatures hunted by the protagonists.",
            "He frequently changes his appearance and identity when interacting with human society.",
            "His greatest fear is connected to a weakness that has existed since the beginning of his transformation."
        ]
    },

    {
        id: "anime-0109",
        character: "Akaza",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "He places enormous importance on strength and considers weakness something that should be eliminated.",
            "His abilities are heavily influenced by martial arts rather than conventional weapons.",
            "Fragments of his human past reveal a relationship that explains his unusual obsession with becoming stronger."
        ]
    },

    {
        id: "anime-0110",
        character: "Daki",
        source: "Demon Slayer",
        category: "anime",
        clues: [
            "Her public identity allows her to operate within a profession where appearance is particularly valuable.",
            "Her abilities are closely connected to objects that can be manipulated like weapons.",
            "Her relationship with another member of her family makes separating their individual strengths difficult."
        ]
    },

    {
        id: "anime-0111",
        character: "Satoru Gojo",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He belongs to a family whose inherited ability is regarded as exceptionally valuable.",
            "His confidence is partly justified by an unusual combination of inherited techniques and perception.",
            "His relationship with a former friend strongly influences his understanding of the world he is trying to change."
        ]
    },

    {
        id: "anime-0112",
        character: "Suguru Geto",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He once shared an important partnership with one of the strongest members of his generation.",
            "His worldview changes after repeatedly witnessing ordinary people treat supernatural events with ignorance or fear.",
            "His ability allows him to command beings created from negative human emotions."
        ]
    },

    {
        id: "anime-0113",
        character: "Nobara Kugisaki",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "She leaves her rural hometown because she wants to experience a larger world.",
            "Her fighting method allows her to damage opponents indirectly through objects connected to them.",
            "Her confidence comes from refusing to separate her personal identity from her role as a fighter."
        ]
    },

    {
        id: "anime-0114",
        character: "Maki Zenin",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "She comes from a prestigious family but is treated as inferior because of a particular limitation.",
            "She compensates for her lack of conventional supernatural ability through exceptional physical skill.",
            "Her relationship with her twin sister becomes increasingly important to the direction of her character."
        ]
    },

    {
        id: "anime-0115",
        character: "Toji Fushiguro",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He was born into a powerful family but was rejected because he lacked the trait his relatives valued most.",
            "His physical abilities allow him to challenge supernatural opponents without relying on conventional techniques.",
            "His connection to a young boy becomes significant even though he initially treats that responsibility with detachment."
        ]
    },

    {
        id: "anime-0116",
        character: "Ryomen Sukuna",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He is remembered as an extraordinarily dangerous figure from a much older era.",
            "His existence becomes tied to a modern student through a series of supernatural circumstances.",
            "He treats most other beings with contempt but shows particular interest in individuals capable of challenging him."
        ]
    },

    {
        id: "anime-0117",
        character: "Yuji Itadori",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "He possesses physical abilities that were extraordinary even before he entered the supernatural world.",
            "A decision made during an emergency causes him to become the vessel for a dangerous entity.",
            "His personal philosophy places unusual importance on how people should die."
        ]
    },

    {
        id: "anime-0118",
        character: "Megumi Fushiguro",
        source: "Jujutsu Kaisen",
        category: "anime",
        clues: [
            "His inherited technique allows him to summon entities through shadows.",
            "His relationship with a particular teacher is complicated by the teacher's knowledge of his family.",
            "He repeatedly chooses to protect people he considers worth saving rather than following a simple idea of justice."
        ]
    },

    {
        id: "anime-0119",
        character: "Denji",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "He begins his life under severe financial pressure and accepts dangerous work simply to survive.",
            "His closest companion before joining a government organization is an unusual creature with a distinctive appearance.",
            "His greatest desires are surprisingly ordinary compared with the violent circumstances surrounding him."
        ]
    },

    {
        id: "anime-0120",
        character: "Makima",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "She presents herself as a calm authority figure while maintaining considerable control over the people beneath her.",
            "Her methods often involve manipulating others rather than defeating them directly.",
            "Her interest in one particular young man is closely connected to a much larger plan."
        ]
    },

    {
        id: "anime-0121",
        character: "Power",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "She has an exaggerated opinion of herself despite frequently behaving irresponsibly.",
            "Her abilities are directly connected to the substance carried through the bodies of living creatures.",
            "Her relationship with another member of her team gradually becomes more like a family bond."
        ]
    },

    {
        id: "anime-0122",
        character: "Aki Hayakawa",
        source: "Chainsaw Man",
        category: "anime",
        clues: [
            "His career is largely motivated by revenge for a tragedy that occurred during his childhood.",
            "He initially views his teammates as burdens rather than people he can trust.",
            "His use of supernatural contracts repeatedly comes at a personal cost."
        ]
    },

    {
        id: "anime-0123",
        character: "Kakashi Hatake",
        source: "Naruto",
        category: "anime",
        clues: [
            "He became a teacher despite carrying memories of several teammates he failed to protect.",
            "His reputation for copying techniques comes from an ability that was not originally his own.",
            "He places unusual emphasis on teamwork because of a lesson learned from someone important to his past."
        ]
    },

    {
        id: "anime-0124",
        character: "Hinata Hyuga",
        source: "Naruto",
        category: "anime",
        clues: [
            "She was born into a prestigious clan but initially lacked confidence in her ability to meet its expectations.",
            "Watching another young ninja pursue an impossible goal gradually changes how she views her own weaknesses.",
            "Her fighting style allows her to disrupt an opponent's internal energy system through precise strikes."
        ]
    },

    {
        id: "anime-0125",
        character: "Gaara",
        source: "Naruto",
        category: "anime",
        clues: [
            "His childhood was shaped by fear from the people who were supposed to protect him.",
            "An unusual ability automatically reacts to threats even when he is not consciously controlling it.",
            "His understanding of friendship changes after repeatedly encountering someone who refuses to treat him as a monster."
        ]
    },

    {
        id: "anime-0126",
        character: "Itachi Uchiha",
        source: "Naruto",
        category: "anime",
        clues: [
            "He became involved in a political crisis within his clan while still extremely young.",
            "He deliberately allowed his younger brother to hate him for years.",
            "Many of his apparently cruel actions were connected to an attempt to prevent an even larger conflict."
        ]
    },

    {
        id: "anime-0127",
        character: "Madara Uchiha",
        source: "Naruto",
        category: "anime",
        clues: [
            "His early friendship with the leader of another clan briefly suggested that generations of conflict might finally end.",
            "He eventually became convinced that the world could only achieve peace through an artificial solution.",
            "His plans continued influencing events long after most people believed he had disappeared."
        ]
    },

    {
        id: "anime-0128",
        character: "Sasuke Uchiha",
        source: "Naruto",
        category: "anime",
        clues: [
            "His childhood is permanently shaped by an event that destroys nearly every member of his family.",
            "His desire for revenge repeatedly causes him to abandon relationships that might otherwise have supported him.",
            "His understanding of his brother changes dramatically after learning information that had been deliberately hidden from him."
        ]
    },

    {
        id: "anime-0129",
        character: "Roronoa Zoro",
        source: "One Piece",
        category: "anime",
        clues: [
            "His original ambition is connected to a promise made to someone he knew during childhood.",
            "He deliberately trains himself to fight in a way that most swordsmen would consider impractical.",
            "His terrible sense of direction repeatedly creates problems even when he is otherwise highly dependable."
        ]
    },

    {
        id: "anime-0130",
        character: "Nico Robin",
        source: "One Piece",
        category: "anime",
        clues: [
            "She spent much of her childhood being pursued because of knowledge rather than because of physical strength.",
            "Her ability allows her to create copies of parts of her body in locations away from herself.",
            "Her greatest wish is connected to discovering information that the world's government has deliberately suppressed."
        ]
    },

    {
        id: "anime-0131",
        character: "Trafalgar Law",
        source: "One Piece",
        category: "anime",
        clues: [
            "His childhood was affected by a disease that made him believe his future was extremely limited.",
            "A particular pirate became responsible for changing the direction of his life.",
            "His supernatural ability allows him to manipulate a defined space in ways that resemble a surgeon operating on a patient."
        ]
    },

    {
        id: "anime-0132",
        character: "Donquixote Doflamingo",
        source: "One Piece",
        category: "anime",
        clues: [
            "His childhood began with privilege before his family abandoned the lifestyle associated with their social position.",
            "A traumatic period afterward contributes heavily to his belief that power determines justice.",
            "He eventually controls a kingdom while secretly operating through a criminal organization."
        ]
    },

    {
        id: "anime-0133",
        character: "Boa Hancock",
        source: "One Piece",
        category: "anime",
        clues: [
            "Her public position gives her authority over an isolated society.",
            "Her childhood contains a secret that she desperately wants to keep hidden from the outside world.",
            "Her feelings toward a particular pirate cause her behavior to differ dramatically from the intimidating image she presents to others."
        ]
    },

    {
        id: "anime-0134",
        character: "Portgas D. Ace",
        source: "One Piece",
        category: "anime",
        clues: [
            "His identity is connected to a legendary pirate whose name carried enormous consequences.",
            "He initially struggled with whether his existence had value because of the circumstances surrounding his birth.",
            "His capture becomes the catalyst for a massive conflict involving several major powers."
        ]
    },

    {
        id: "anime-0135",
        character: "Charlotte Katakuri",
        source: "One Piece",
        category: "anime",
        clues: [
            "He has built an intimidating reputation partly to protect the image expected of him by his family.",
            "His ability allows him to anticipate attacks through an advanced form of perception.",
            "His confrontation with the protagonist gradually exposes a more vulnerable side of his personality."
        ]
    },

    {
        id: "anime-0136",
        character: "Monkey D. Dragon",
        source: "One Piece",
        category: "anime",
        clues: [
            "He is considered one of the greatest threats to the ruling authority in the world.",
            "His family connections include two individuals who became famous for very different reasons.",
            "His organization seeks to challenge the political structure that governs much of the world."
        ]
    },

    {
        id: "anime-0137",
        character: "Usopp",
        source: "One Piece",
        category: "anime",
        clues: [
            "He inherited a talent for storytelling from a parent whose reputation he wanted to live up to.",
            "His greatest victories often come from deception, preparation and long-range attacks rather than direct strength.",
            "He repeatedly claims courage while simultaneously attempting to escape dangerous situations."
        ]
    },

    {
        id: "anime-0138",
        character: "Sanji",
        source: "One Piece",
        category: "anime",
        clues: [
            "His childhood was spent in a family where physical ability was valued far more than compassion.",
            "He was eventually raised by someone whose philosophy about food profoundly influenced his life.",
            "He refuses to use his hands in combat because they are too important for his profession."
        ]
    },

    {
        id: "anime-0139",
        character: "Franky",
        source: "One Piece",
        category: "anime",
        clues: [
            "He learned to build machines and weapons while growing up around shipwrights.",
            "A catastrophic incident forces him to replace much of his own body with mechanical parts.",
            "His greatest dream involves constructing a vessel capable of reaching the end of the world's most dangerous sea."
        ]
    },

    {
        id: "anime-0140",
        character: "Brook",
        source: "One Piece",
        category: "anime",
        clues: [
            "He spent decades waiting for a promise connected to a journey that had begun long before he met the main crew.",
            "His supernatural return from death left him physically unlike an ordinary human.",
            "His musical talent is important both to his identity and to several of his abilities."
        ]
    },

    {
        id: "anime-0141",
        character: "Yusuke Urameshi",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "He initially appears to be an ordinary delinquent whose actions unexpectedly earn him another chance at life.",
            "His responsibilities eventually place him between the human and supernatural worlds.",
            "His combat abilities develop significantly after discovering information about his ancestry."
        ]
    },

    {
        id: "anime-0142",
        character: "Hiei",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "He was abandoned as an infant and later became associated with a dangerous supernatural group.",
            "His small stature contrasts with the reputation he develops among powerful opponents.",
            "A particular technique causes one side of his body to undergo a dramatic transformation."
        ]
    },

    {
        id: "anime-0143",
        character: "Kurama",
        source: "Yu Yu Hakusho",
        category: "anime",
        clues: [
            "His current identity belongs to a human family despite his supernatural origins.",
            "He combines strategic thinking with abilities involving plants and natural growth.",
            "His willingness to protect his human family changes how he views his previous existence."
        ]
    },

    {
        id: "anime-0144",
        character: "Sailor Moon",
        source: "Sailor Moon",
        category: "anime",
        clues: [
            "She initially struggles with responsibility despite being connected to a much larger destiny.",
            "Her ordinary teenage life repeatedly collides with memories and threats from another era.",
            "Her true identity is connected to a royal family whose history predates her current life."
        ]
    },

    {
        id: "anime-0145",
        character: "Lain Iwakura",
        source: "Serial Experiments Lain",
        category: "anime",
        clues: [
            "Her understanding of reality becomes increasingly uncertain as she interacts with a vast digital network.",
            "A message from someone who should no longer be able to communicate with her begins a major change in her life.",
            "The boundary between her physical identity and her existence online becomes increasingly difficult to define."
        ]
    },

    {
        id: "anime-0146",
        character: "Spike Spiegel",
        source: "Cowboy Bebop",
        category: "anime",
        clues: [
            "He works as a bounty hunter despite having a past connected to organized crime.",
            "His fighting style combines martial arts with an unusual calmness even in dangerous situations.",
            "A former relationship repeatedly draws him back toward a life he claims to have left behind."
        ]
    },

    {
        id: "anime-0147",
        character: "Faye Valentine",
        source: "Cowboy Bebop",
        category: "anime",
        clues: [
            "She awakens in a future era with little understanding of the life she once lived.",
            "Her financial problems frequently influence her decisions aboard the ship.",
            "Her search for information about her past becomes more important as fragments of her memory return."
        ]
    },

    {
        id: "anime-0148",
        character: "Simon",
        source: "Gurren Lagann",
        category: "anime",
        clues: [
            "He begins as a timid young worker whose skills are mostly useful underground.",
            "His relationship with a more confident companion dramatically changes his view of what is possible.",
            "He eventually has to assume leadership after losing the person who originally inspired him."
        ]
    },

    {
        id: "anime-0149",
        character: "Reigen Arataka",
        source: "Mob Psycho 100",
        category: "anime",
        clues: [
            "He presents himself as an expert despite lacking the supernatural ability his clients expect.",
            "His greatest talent is manipulating social situations rather than using psychic powers.",
            "His relationship with a genuinely powerful young person gradually becomes surprisingly sincere."
        ]
    },

    {
        id: "anime-0150",
        character: "Violet Evergarden",
        source: "Violet Evergarden",
        category: "anime",
        clues: [
            "She was raised primarily as a weapon and initially struggles to understand ordinary emotions.",
            "After leaving the battlefield, she takes up a profession that requires her to express feelings on behalf of other people.",
            "Her search for the meaning of a particular final message becomes central to her journey."
        ]
    },

        {
        id: "anime-0150",
        character: "Kaguya Shinomiya",
        source: "Kaguya-sama: Love Is War",
        category: "anime",
        clues: [
            "She was raised in an environment where emotional vulnerability is treated as a weakness.",
            "Her intelligence makes ordinary romantic interactions unnecessarily complicated because she refuses to openly admit what she wants.",
            "Her relationship with a certain student becomes a psychological contest in which making the other person confess is considered a victory."
        ]
    },

    {
        id: "anime-0151",
        character: "Miyuki Shirogane",
        source: "Kaguya-sama: Love Is War",
        category: "anime",
        clues: [
            "His determination to maintain an impressive public image is partly driven by circumstances outside the privileged world surrounding him.",
            "He regularly pushes himself beyond reasonable limits because he believes falling behind would expose his insecurities.",
            "His romantic rivalry with another exceptionally intelligent student turns simple expressions of affection into elaborate strategies."
        ]
    },

    {
        id: "anime-0152",
        character: "Chika Fujiwara",
        source: "Kaguya-sama: Love Is War",
        category: "anime",
        clues: [
            "She often disrupts carefully constructed plans without realizing that she has done so.",
            "Her cheerful personality hides an unusually broad collection of talents that occasionally makes her companions suspicious of her abilities.",
            "She frequently becomes an unintended obstacle in a psychological battle between two people who refuse to confess first."
        ]
    },

    {
        id: "anime-0153",
        character: "Ai Hayasaka",
        source: "Kaguya-sama: Love Is War",
        category: "anime",
        clues: [
            "Her position requires her to perform several different identities depending on the people around her.",
            "She spends much of her time managing the consequences of another person's complicated emotional life.",
            "Despite being highly capable at manipulating appearances, she eventually becomes increasingly dissatisfied with the role she has been forced to maintain."
        ]
    },

    {
        id: "anime-0154",
        character: "Taiga Aisaka",
        source: "Toradora!",
        category: "anime",
        clues: [
            "Her intimidating reputation contrasts sharply with the vulnerability she rarely allows others to see.",
            "Her inability to manage certain ordinary household responsibilities leads her to depend unexpectedly on someone she initially clashes with.",
            "A relationship arrangement created to help both parties pursue other people gradually becomes much more emotionally complicated."
        ]
    },

    {
        id: "anime-0155",
        character: "Ryuuji Takasu",
        source: "Toradora!",
        category: "anime",
        clues: [
            "His appearance causes people to assume he is dangerous despite his personality being considerably gentler.",
            "He becomes unexpectedly skilled at domestic responsibilities and begins helping someone whose personality is almost his opposite.",
            "An agreement involving their respective crushes eventually forces him to confront feelings he did not initially recognize."
        ]
    },

    {
        id: "anime-0156",
        character: "Minori Kushieda",
        source: "Toradora!",
        category: "anime",
        clues: [
            "Her energetic personality allows her to hide serious emotional conflicts behind constant activity.",
            "She is deeply interested in unusual hobbies and athletic pursuits while maintaining a cheerful image at school.",
            "Her feelings toward someone close to her become complicated by her awareness of another person's attachment to him."
        ]
    },

    {
        id: "anime-0157",
        character: "Ami Kawashima",
        source: "Toradora!",
        category: "anime",
        clues: [
            "She has experience presenting a carefully controlled public image that differs from her private personality.",
            "Her beauty attracts attention, but she becomes particularly interested in someone who refuses to treat her according to that image.",
            "She develops an unusual ability to recognize emotional tension between people even when they refuse to acknowledge it themselves."
        ]
    },

    {
        id: "anime-0158",
        character: "Hachiman Hikigaya",
        source: "My Teen Romantic Comedy SNAFU",
        category: "anime",
        clues: [
            "He deliberately maintains a cynical view of social relationships because he believes it protects him from disappointment.",
            "His unusual approach to solving other people's problems often involves making himself the unpopular party.",
            "Working alongside two very different girls gradually forces him to reconsider the philosophy he uses to justify his isolation."
        ]
    },

    {
        id: "anime-0159",
        character: "Yukino Yukinoshita",
        source: "My Teen Romantic Comedy SNAFU",
        category: "anime",
        clues: [
            "Her intelligence and competence have contributed to her isolation from many of her classmates.",
            "She approaches interpersonal problems with a directness that often makes her appear colder than she intends.",
            "Her relationship with another socially isolated student develops through a club dedicated to helping people with their problems."
        ]
    },

    {
        id: "anime-0160",
        character: "Yui Yuigahama",
        source: "My Teen Romantic Comedy SNAFU",
        category: "anime",
        clues: [
            "Her friendliness makes her highly approachable, although she is more sensitive to social rejection than she initially appears.",
            "An incident involving a dog indirectly connects her to someone whose personality is very different from hers.",
            "Her growing feelings become increasingly difficult to reconcile with the complicated bond between the members of her school club."
        ]
    },

    {
        id: "anime-0161",
        character: "Kaori Miyazono",
        source: "Your Lie in April",
        category: "anime",
        clues: [
            "She approaches music with a freedom that contrasts strongly with another musician's strict relationship with the piano.",
            "Her arrival forces someone who had withdrawn from performance to reconsider his connection with music.",
            "Her apparently fearless personality conceals circumstances that make her time with the people around her especially precious."
        ]
    },

    {
        id: "anime-0162",
        character: "Kousei Arima",
        source: "Your Lie in April",
        category: "anime",
        clues: [
            "A traumatic experience causes him to lose his ability to properly experience the music he once performed with precision.",
            "His childhood reputation as an exceptionally strict pianist makes his later withdrawal particularly noticeable.",
            "Meeting an unconventional violinist gradually draws him back toward performing while also forcing him to confront memories of his past."
        ]
    },

    {
        id: "anime-0163",
        character: "Tsubaki Sawabe",
        source: "Your Lie in April",
        category: "anime",
        clues: [
            "She has known a talented pianist since childhood and becomes accustomed to protecting him in ordinary life.",
            "Her athletic personality contrasts with the artistic interests of the people closest to her.",
            "She gradually realizes that the affection she feels for someone she has always treated as family is not entirely sibling-like."
        ]
    },

    {
        id: "anime-0164",
        character: "Mitsuha Miyamizu",
        source: "Your Name",
        category: "anime",
        clues: [
            "She lives in a rural community where her family maintains traditions that she does not entirely appreciate.",
            "An unexplained phenomenon causes her daily life to become connected to someone living in a distant city.",
            "Her desire to escape her current circumstances becomes intertwined with a relationship that exists across an unusual separation."
        ]
    },

    {
        id: "anime-0165",
        character: "Taki Tachibana",
        source: "Your Name",
        category: "anime",
        clues: [
            "He divides his time between school, work, and an interest in architecture and drawing.",
            "His life becomes inexplicably connected to a girl living in a place he has never visited.",
            "As memories of their unusual connection begin disappearing, he becomes increasingly determined to find someone whose name he struggles to remember."
        ]
    },

    {
        id: "anime-0166",
        character: "Shouko Nishimiya",
        source: "A Silent Voice",
        category: "anime",
        clues: [
            "She communicates primarily through methods that accommodate a condition affecting her ability to hear.",
            "Her childhood experiences at school leave her carrying guilt for circumstances that were not entirely her responsibility.",
            "Years after a painful period in her childhood, she becomes connected again to someone who once treated her cruelly."
        ]
    },

    {
        id: "anime-0167",
        character: "Shoya Ishida",
        source: "A Silent Voice",
        category: "anime",
        clues: [
            "His childhood desire for excitement leads him to become involved in bullying someone who communicates differently from his classmates.",
            "After being ostracized himself, he develops a deep sense of guilt about what happened years earlier.",
            "As a teenager, he attempts to reconnect with people from his past while struggling with his own isolation."
        ]
    },

    {
        id: "anime-0168",
        character: "Hori Kyouko",
        source: "Horimiya",
        category: "anime",
        clues: [
            "At school she appears popular and put-together, while her responsibilities outside school reveal a very different side of her life.",
            "She discovers that someone she barely notices in class has a dramatically different appearance outside school.",
            "Their relationship develops after both realize that their public identities hide important parts of who they really are."
        ]
    },

    {
        id: "anime-0169",
        character: "Miyamura Izumi",
        source: "Horimiya",
        category: "anime",
        clues: [
            "His quiet school reputation conceals an appearance and personality that few classmates would expect.",
            "He gradually reveals several aspects of his private identity to someone who initially knows him only as a gloomy classmate.",
            "A chance discovery creates a friendship that quickly develops into something more intimate."
        ]
    },

    {
        id: "anime-0170",
        character: "Sakuta Azusagawa",
        source: "Rascal Does Not Dream of Bunny Girl Senpai",
        category: "anime",
        clues: [
            "He becomes involved with a phenomenon in which people gradually stop being noticed by others.",
            "His blunt personality often causes him to say things that others would hesitate to express.",
            "His relationship with a famous actress begins after he encounters her in a form that almost nobody else can perceive."
        ]
    },

    {
        id: "anime-0171",
        character: "Mai Sakurajima",
        source: "Rascal Does Not Dream of Bunny Girl Senpai",
        category: "anime",
        clues: [
            "She temporarily steps away from entertainment but discovers that returning to ordinary school life is surprisingly difficult.",
            "A strange phenomenon causes her presence to become increasingly difficult for other people to recognize.",
            "The unusual outfit she wears during her first important encounter with the protagonist is deliberately chosen because she expects nobody to notice her."
        ]
    },

    {
        id: "anime-0172",
        character: "Chizuru Mizuhara",
        source: "Rent-A-Girlfriend",
        category: "anime",
        clues: [
            "She maintains a carefully constructed professional persona that contrasts with her private frustrations.",
            "Her work involves temporarily presenting herself as the ideal romantic partner for clients.",
            "One particular client gradually becomes much more complicated because their arrangement repeatedly crosses into his real life."
        ]
    },

    {
        id: "anime-0173",
        character: "Kazuya Kinoshita",
        source: "Rent-A-Girlfriend",
        category: "anime",
        clues: [
            "A painful breakup causes him to make an impulsive decision involving a service designed to simulate companionship.",
            "His attempts to keep a romantic arrangement secret repeatedly create increasingly complicated situations.",
            "His feelings for someone who was initially hired by him become difficult to distinguish from the role she was paid to perform."
        ]
    },

    {
        id: "anime-0174",
        character: "Tohru Honda",
        source: "Fruits Basket",
        category: "anime",
        clues: [
            "After losing her home, she continues living with remarkable optimism despite circumstances that would overwhelm many people.",
            "She becomes involved with a family whose members are affected by a supernatural condition connected to the zodiac.",
            "Her kindness gradually helps several members of that family confront emotional wounds they have carried for years."
        ]
    },

    {
        id: "anime-0175",
        character: "Kyo Sohma",
        source: "Fruits Basket",
        category: "anime",
        clues: [
            "He carries resentment toward a family structure that treats him differently from the other members.",
            "His aggressive personality often masks fear that he will never be accepted.",
            "His bond with a kindhearted girl gradually becomes central to his struggle against the expectations placed upon him."
        ]
    },

    {
        id: "anime-0176",
        character: "Yuki Sohma",
        source: "Fruits Basket",
        category: "anime",
        clues: [
            "His exceptional appearance and popularity cause others to misunderstand how isolated he feels.",
            "He belongs to a family affected by a supernatural curse that influences his relationships.",
            "His understanding of affection changes as he realizes that what he first believed was romantic admiration may have represented something different."
        ]
    },

    {
        id: "anime-0177",
        character: "Hirotaka Nifuji",
        source: "Wotakoi: Love Is Hard for Otaku",
        category: "anime",
        clues: [
            "His workplace persona hides an extensive enthusiasm for games and other forms of entertainment.",
            "He reconnects with someone from his childhood who shares interests that make conventional dating unnecessary.",
            "His relationship demonstrates that romantic compatibility can develop through shared hobbies rather than dramatic courtship."
        ]
    },

    {
        id: "anime-0178",
        character: "Narumi Momose",
        source: "Wotakoi: Love Is Hard for Otaku",
        category: "anime",
        clues: [
            "She attempts to hide some of her strongest interests because she fears how coworkers might perceive them.",
            "A childhood acquaintance becomes her romantic partner after discovering that they share several unconventional hobbies.",
            "Her relationship gradually allows her to become more comfortable with expressing interests she previously kept separate from her professional identity."
        ]
    },

    {
        id: "anime-0179",
        character: "Sawako Kuronuma",
        source: "Kimi ni Todoke",
        category: "anime",
        clues: [
            "Her appearance causes classmates to associate her with a frightening fictional figure despite her gentle personality.",
            "She struggles to communicate her intentions because other students repeatedly misunderstand her behavior.",
            "A popular and kind classmate gradually becomes one of the first people to see beyond the rumors surrounding her."
        ]
    },

    {
        id: "anime-0180",
        character: "Shouta Kazehaya",
        source: "Kimi ni Todoke",
        category: "anime",
        clues: [
            "His approachable personality makes him one of the more socially accepted students in his class.",
            "Unlike many of his classmates, he does not believe the rumors surrounding a quiet girl with an intimidating appearance.",
            "His friendship with her slowly develops into affection while misunderstandings repeatedly delay their ability to express it."
        ]
    },

    {
        id: "anime-0181",
        character: "Nana Komatsu",
        source: "NANA",
        category: "anime",
        clues: [
            "She repeatedly becomes emotionally attached to people while struggling to maintain independence.",
            "Her move to Tokyo is motivated partly by her desire to build a new life connected to someone she loves.",
            "Her life becomes intertwined with another woman who shares her first name but has an entirely different personality and history."
        ]
    },

    {
        id: "anime-0182",
        character: "Nana Osaki",
        source: "NANA",
        category: "anime",
        clues: [
            "She pursues a career in music while carrying complicated feelings about relationships and abandonment.",
            "Her punk-inspired image contrasts with the vulnerability revealed through her closest relationships.",
            "Her friendship with another woman named Nana becomes one of the central emotional bonds of her life."
        ]
    },

    {
        id: "anime-0183",
        character: "Usagi Tsukino",
        source: "Sailor Moon",
        category: "anime",
        clues: [
            "She initially appears far less responsible than the role eventually placed upon her would suggest.",
            "Her ordinary teenage life becomes connected to a reincarnated identity from a distant past.",
            "Her romance is repeatedly intertwined with a larger conflict involving a masked protector and threats to the world."
        ]
    },

    {
        id: "anime-0184",
        character: "Mamoru Chiba",
        source: "Sailor Moon",
        category: "anime",
        clues: [
            "He frequently appears as an ordinary university student while possessing a connection to a much older identity.",
            "His mysterious nighttime appearances initially cause tension with a girl who later becomes deeply important to him.",
            "His romantic relationship is connected to a forgotten kingdom and a promise that predates their current lives."
        ]
    },

    {
        id: "anime-0185",
        character: "Misaki Ayuzawa",
        source: "Maid Sama!",
        category: "anime",
        clues: [
            "She works intensely to maintain an intimidating reputation at a school that recently changed its gender composition.",
            "Her financial circumstances force her to keep an unusual part-time job secret from classmates.",
            "A popular male student discovers her secret and becomes increasingly interested in the contradiction between her public and private lives."
        ]
    },

    {
        id: "anime-0186",
        character: "Takumi Usui",
        source: "Maid Sama!",
        category: "anime",
        clues: [
            "His exceptional popularity at school contrasts with the unusual amount of attention he gives to one particular student.",
            "He discovers a secret workplace belonging to someone who strongly dislikes appearing vulnerable.",
            "His playful teasing gradually becomes a serious romantic pursuit despite the other person's determination to remain independent."
        ]
    },

    {
        id: "anime-0187",
        character: "Yona",
        source: "Yona of the Dawn",
        category: "anime",
        clues: [
            "Her privileged upbringing leaves her unprepared for the political violence that suddenly destroys her previous life.",
            "She begins a journey accompanied by people whose loyalty to her is rooted in an older legend.",
            "Her feelings toward a childhood companion become increasingly complicated as their lives move in completely different directions."
        ]
    },

    {
        id: "anime-0188",
        character: "Hak Son",
        source: "Yona of the Dawn",
        category: "anime",
        clues: [
            "He is known for exceptional combat ability and once held an important position protecting someone close to him.",
            "His loyalty remains strong even after circumstances force him to flee alongside the person he protects.",
            "His relationship with her contains feelings he rarely expresses directly because he prioritizes her safety over his own desires."
        ]
    },

    {
        id: "anime-0189",
        character: "Zen Wistaria",
        source: "Snow White with the Red Hair",
        category: "anime",
        
        clues: [
            "He belongs to royalty but dislikes allowing his position to determine how people should treat him.",
            "He becomes interested in a talented herbalist after she refuses to surrender her independence.",
            "His relationship with her develops despite the social barriers created by the difference between their positions."
        ]
    },

    {
        id: "anime-0190",
        character: "Shirayuki",
        source: "Snow White with the Red Hair",
        category: "anime",
        clues: [
            "Her unusual physical appearance attracts unwanted attention from someone who sees her as a possession rather than a person.",
            "She chooses to leave her homeland rather than surrender control over her future.",
            "Her knowledge of medicinal plants eventually becomes the foundation of her independent career and her relationship with a prince."
        ]
    },

    {
        id: "anime-0191",
        character: "Kou Mabuchi",
        source: "Ao Haru Ride",
        category: "anime",
        clues: [
            "A cheerful boy from his childhood becomes much more distant after returning to her life several years later.",
            "His personality has been shaped by a series of losses that he rarely discusses openly.",
            "His renewed relationship with his former classmate forces both of them to confront feelings that never completely disappeared."
        ]
    },

    {
        id: "anime-0192",
        character: "Futaba Yoshioka",
        source: "Ao Haru Ride",
        category: "anime",
        clues: [
            "She deliberately changes aspects of her personality because of the way her classmates previously judged her.",
            "A boy from her middle-school years unexpectedly returns with a different identity and personality.",
            "Her feelings for him survive years of separation even though rebuilding their relationship proves difficult."
        ]
    },

    {
        id: "anime-0193",
        character: "Risa Koizumi",
        source: "Lovely★Complex",
        category: "anime",
        clues: [
            "Her height makes her feel out of place beside many of the girls around her.",
            "She forms a comedic rivalry with a boy whose physical appearance creates the opposite problem.",
            "Their constant arguments gradually reveal that the person she clashes with may understand her better than anyone else."
        ]
    },

    {
        id: "anime-0194",
        character: "Atsushi Otani",
        source: "Lovely★Complex",
        category: "anime",
        clues: [
            "His short stature causes him to become the target of teasing despite his confidence in other areas.",
            "He repeatedly argues with a much taller girl whose personality clashes with his own.",
            "A friendship based on their mutual frustration with dating gradually develops into romantic feelings."
        ]
    },

    {
        id: "anime-0195",
        character: "Rinko Yamato",
        source: "My Love Story!!",
        category: "anime",
        clues: [
            "She is rescued from a frightening situation by someone whose appearance initially makes him seem intimidating.",
            "Her romantic feelings develop toward a boy who is accustomed to being overlooked because of his unusual appearance.",
            "Her relationship challenges the assumption that the most conventionally attractive person in a friendship will automatically become the romantic lead."
        ]
    },

    {
        id: "anime-0196",
        character: "Takeo Gouda",
        source: "My Love Story!!",
        category: "anime",
        clues: [
            "His enormous physical presence causes strangers to misunderstand him despite his exceptionally kind personality.",
            "He has repeatedly watched his best friend attract romantic attention while assuming that he himself could never be chosen.",
            "A rescue unexpectedly introduces him to someone who sees his personality rather than his intimidating appearance."
        ]
    },

    {
        id: "anime-0197",
        character: "Yamada Akito",
        source: "My Love Story with Yamada-kun at Lv999",
        category: "anime",
        clues: [
            "He communicates with other people through a competitive online game while maintaining an unusually detached personality in real life.",
            "His initial interactions with an older woman are shaped more by gaming circumstances than conventional romance.",
            "His emotional development becomes noticeable as he gradually learns to take another person's feelings more seriously."
        ]
    },

    {
        id: "anime-0198",
        character: "Akane Kinoshita",
        source: "My Love Story with Yamada-kun at Lv999",
        category: "anime",
        clues: [
            "A painful breakup leads her unexpectedly into a gaming community she had not previously taken seriously.",
            "She initially struggles to understand the detached behavior of someone considerably younger than herself.",
            "Her relationship develops through a mixture of online interactions, misunderstandings, and gradually increasing emotional trust."
        ]
    },

    {
        id: "anime-0199",
        character: "Akane Mizuno",
        source: "Tsuki ga Kirei",
        category: "anime",
        clues: [
            "Her romantic relationship develops quietly through ordinary school life rather than dramatic supernatural circumstances.",
            "She and another student initially communicate awkwardly despite attending the same school.",
            "Their relationship is complicated by the uncertainty of growing up and the possibility that their future paths may separate them."
        ]
    },

        {
        id: "anime-0200",
        character: "Menma",
        source: "Anohana: The Flower We Saw That Day",
        category: "anime",
        clues: [
            "Her return to the lives of her childhood friends is impossible for an ordinary person to explain.",
            "The group she once belonged to has gradually fallen apart because everyone carries a different form of guilt.",
            "Her presence is connected to an unfinished wish that the group must eventually understand."
        ]
    },

    {
        id: "anime-0201",
        character: "Jinta Yadomi",
        source: "Anohana: The Flower We Saw That Day",
        category: "anime",
        clues: [
            "He withdraws almost completely from ordinary social life after a childhood tragedy.",
            "A person he believed he had lost forever suddenly appears before him and asks him to fulfill an old wish.",
            "Reuniting with his former friends forces him to confront memories that each of them has interpreted differently."
        ]
    },

    {
        id: "anime-0202",
        character: "Kaori Miyazono",
        source: "Your Lie in April",
        category: "anime",
        clues: [
            "She deliberately presents herself as someone who refuses to follow conventional expectations when performing.",
            "Her influence encourages a pianist who had become emotionally disconnected from music to perform again.",
            "The time she spends with him becomes increasingly precious as the seriousness of her condition becomes harder to ignore."
        ]
    },

    {
        id: "anime-0203",
        character: "Setsuko",
        source: "Grave of the Fireflies",
        category: "anime",
        clues: [
            "She is a young girl trying to survive alongside her older brother during wartime.",
            "Her innocence contrasts sharply with the increasingly desperate circumstances surrounding her family.",
            "Her relationship with her brother becomes the emotional center of a story whose ending is remembered for its devastating tragedy."
        ]
    },

    {
        id: "anime-0204",
        character: "Seita Yokokawa",
        source: "Grave of the Fireflies",
        category: "anime",
        clues: [
            "He assumes responsibility for protecting his younger sister after their family is torn apart by war.",
            "His determination to remain independent leads him to make decisions that become increasingly difficult to sustain.",
            "His story is ultimately defined by the consequences of trying to protect someone he loves during a catastrophic period."
        ]
    },

    {
        id: "anime-0205",
        character: "Akane Tsunemori",
        source: "Psycho-Pass",
        category: "anime",
        clues: [
            "She enters a law-enforcement system that evaluates people according to psychological measurements.",
            "Her idealistic understanding of justice is repeatedly challenged by criminals who expose contradictions within that system.",
            "Her relationships with people operating outside conventional ideas of justice gradually change her understanding of morality."
        ]
    },

    {
        id: "anime-0206",
        character: "Shinichiro Nakagami",
        source: "True Tears",
        category: "anime",
        clues: [
            "He becomes involved in a complicated relationship between people whose emotional problems are hidden behind apparently ordinary school lives.",
            "His feelings become divided as different forms of affection and responsibility begin to conflict.",
            "The story repeatedly questions whether loving someone means protecting them or allowing them to make painful choices."
        ]
    },

    {
        id: "anime-0207",
        character: "Hotaru Takegawa",
        source: "Hotarubi no Mori e",
        category: "anime",
        clues: [
            "She becomes friends with a mysterious figure who cannot allow ordinary human contact.",
            "Their meetings continue over many years despite a condition that makes their relationship fundamentally fragile.",
            "Their romance is defined by the knowledge that a single mistake could permanently separate them."
        ]
    },

    {
        id: "anime-0208",
        character: "Gin",
        source: "Hotarubi no Mori e",
        category: "anime",
        clues: [
            "He lives under a supernatural condition that prevents him from being touched by ordinary humans.",
            "He develops a deep bond with a girl who repeatedly returns to visit him despite knowing the danger surrounding him.",
            "The most important moment of their relationship occurs because the restriction surrounding his existence is finally broken."
        ]
    },

    {
        id: "anime-0209",
        character: "Mafuyu Sato",
        source: "Given",
        category: "anime",
        clues: [
            "He carries a musical instrument connected to someone he lost before the story begins.",
            "His difficulty expressing grief becomes one of the reasons another musician encourages him to sing.",
            "Music gradually becomes the means through which he begins confronting feelings he had been unable to put into words."
        ]
    },

    {
        id: "anime-0210",
        character: "Yuki Yoshida",
        source: "Given",
        category: "anime",
        clues: [
            "His relationship with someone close to him becomes an important part of the other person's grief.",
            "His death leaves behind an instrument that becomes symbolically important.",
            "Although he is absent from most of the story, memories of him strongly influence the emotional development of the surviving characters."
        ]
    },

    {
        id: "anime-0211",
        character: "Naho Takamiya",
        source: "Orange",
        category: "anime",
        clues: [
            "She receives messages that appear to come from her own future.",
            "The warnings concern a new classmate whose emotional struggles are much more serious than they initially appear.",
            "She becomes determined to change events that she once believed were inevitable."
        ]
    },

    {
        id: "anime-0212",
        character: "Kakeru Naruse",
        source: "Orange",
        category: "anime",
        clues: [
            "He transfers into a new school while carrying grief connected to a tragedy in his family.",
            "His friends gradually discover that his cheerful moments conceal a serious emotional struggle.",
            "The possibility of losing him becomes the central reason a group of friends attempts to change their own future."
        ]
    },

    {
        id: "anime-0213",
        character: "Akari Kawamoto",
        source: "March Comes in Like a Lion",
        category: "anime",
        clues: [
            "She takes on significant responsibilities within her family despite still being young.",
            "Her kindness provides stability to someone who struggles with isolation and emotional exhaustion.",
            "Her relationship with a professional player develops through quiet moments rather than conventional romantic gestures."
        ]
    },

    {
        id: "anime-0214",
        character: "Kiriyama Rei",
        source: "March Comes in Like a Lion",
        category: "anime",
        clues: [
            "He becomes a professional competitor while still very young and lives largely on his own.",
            "His career success does not prevent him from experiencing profound loneliness.",
            "A family outside his own gradually becomes a source of emotional stability and changes the way he understands relationships."
        ]
    },

    {
        id: "anime-0215",
        character: "Shirayuki",
        source: "Snow White with the Red Hair",
        category: "anime",
        clues: [
            "Her unusual appearance causes a powerful person to treat her as something that can simply be claimed.",
            "She escapes that situation and builds an independent life through her knowledge of medicinal plants.",
            "Her growing relationship with royalty develops despite the social distance between them."
        ]
    },

    {
        id: "anime-0216",
        character: "Zen Wistaria",
        source: "Snow White with the Red Hair",
        category: "anime",
        clues: [
            "He possesses a noble title but frequently chooses to interact with people without emphasizing his status.",
            "He becomes interested in someone whose independence makes it impossible to simply solve her problems with his position.",
            "His romance requires him to balance personal affection with the political expectations surrounding his future."
        ]
    },

    {
        id: "anime-0217",
        character: "Miyo Saimori",
        source: "My Happy Marriage",
        category: "anime",
        clues: [
            "She grows up in a household where she receives far less affection than other members of her family.",
            "A marriage arrangement initially expected to be unpleasant instead becomes her first opportunity to experience genuine acceptance.",
            "Her suppressed abilities become connected to both her family history and the supernatural threats surrounding her future."
        ]
    },

    {
        id: "anime-0218",
        character: "Kiyoka Kudou",
        source: "My Happy Marriage",
        category: "anime",
        clues: [
            "His reputation causes potential fiancées to fear him before they understand his actual personality.",
            "He becomes protective of someone whose family has treated her as though she has little value.",
            "His relationship with her gradually reveals that his apparent coldness hides a strong sense of responsibility."
        ]
    },

    {
        id: "anime-0219",
        character: "Himmel",
        source: "Frieren: Beyond Journey's End",
        category: "anime",
        clues: [
            "He belongs to a group that completes a legendary journey long before the main story truly begins.",
            "His kindness leaves a lasting impression on someone who experiences time very differently from ordinary humans.",
            "His death becomes one of the reasons the protagonist begins reflecting on how little she understood about the people around her."
        ]
    },

    {
        id: "anime-0220",
        character: "Frieren",
        source: "Frieren: Beyond Journey's End",
        category: "anime",
        clues: [
            "Her extremely long lifespan causes her to experience relationships differently from the people who travel alongside her.",
            "She initially underestimates the importance of ordinary human memories.",
            "After losing a former companion, she begins retracing the journey they once shared in order to understand what that relationship meant."
        ]
    },

    {
        id: "anime-0221",
        character: "Subaru Natsuki",
        source: "Re:Zero − Starting Life in Another World",
        category: "anime",
        clues: [
            "He is transported to another world without receiving the overwhelming combat ability he initially expects.",
            "A mysterious ability allows him to return to an earlier point after suffering death.",
            "His determination to save someone he loves forces him to repeatedly experience situations that other people do not remember."
        ]
    },

    {
        id: "anime-0222",
        character: "Emilia",
        source: "Re:Zero − Starting Life in Another World",
        category: "anime",
        clues: [
            "Her appearance causes people to associate her with a feared figure despite her own intentions.",
            "She becomes one of the primary people a newly transported outsider tries desperately to protect.",
            "Her position in a political competition is complicated by prejudice surrounding her appearance and mysterious heritage."
        ]
    },

    {
        id: "anime-0223",
        character: "Rem",
        source: "Re:Zero − Starting Life in Another World",
        category: "anime",
        clues: [
            "She begins with deep suspicion toward an outsider but gradually becomes one of his strongest supporters.",
            "Her feelings toward him develop after witnessing his willingness to repeatedly endure suffering for others.",
            "Her relationship with her sister and the consequences of supernatural attacks are central to her identity."
        ]
    },

    {
        id: "anime-0224",
        character: "Rimuru Tempest",
        source: "That Time I Got Reincarnated as a Slime",
        category: "anime",
        clues: [
            "A mundane death in another world leads to an existence that is radically different from his previous human life.",
            "He gradually builds a society containing humans, monsters, and other supernatural beings.",
            "His relationships with his followers eventually become important enough that the loss of one of them drives him toward an extraordinary transformation."
        ]
    },

    {
        id: "anime-0225",
        character: "Raphtalia",
        source: "The Rising of the Shield Hero",
        category: "anime",
        clues: [
            "Her childhood is marked by slavery and severe mistreatment before she becomes the companion of a disgraced hero.",
            "She develops both combat skills and emotional confidence while traveling with him.",
            "Her relationship with her master gradually changes from one based on survival into a much deeper bond."
        ]
    },

    {
        id: "anime-0226",
        character: "Naofumi Iwatani",
        source: "The Rising of the Shield Hero",
        category: "anime",
        clues: [
            "He arrives in another world expecting to become a hero but is immediately isolated because of accusations against him.",
            "His only available weapon forces him to rely heavily on defense and the companions he gradually acquires.",
            "His distrust of others slowly changes through the loyalty of someone who initially becomes his companion through an unequal arrangement."
        ]
    },

    {
        id: "anime-0227",
        character: "Asuna Yuuki",
        source: "Sword Art Online",
        category: "anime",
        clues: [
            "She becomes trapped inside a virtual world where death has consequences outside the game.",
            "Her exceptional combat ability earns her a reputation among players long before her relationship with the protagonist becomes central.",
            "Her romance develops while both characters are fighting to escape a world that was designed to prevent them from leaving."
        ]
    },

    {
        id: "anime-0228",
        character: "Kirito",
        source: "Sword Art Online",
        category: "anime",
        clues: [
            "He enters a virtual world in which ordinary players discover that logging out is no longer possible.",
            "His willingness to operate alone initially separates him from many other players.",
            "His relationship with a skilled female fighter gradually becomes one of the strongest emotional motivations behind his actions."
        ]
    },

    {
        id: "anime-0229",
        character: "Yuzuru Otonashi",
        source: "Angel Beats!",
        category: "anime",
        clues: [
            "He awakens in a strange afterlife with no clear understanding of how he arrived there.",
            "His memories of his previous life return gradually and reveal why certain choices became important to him.",
            "His relationship with a mysterious girl becomes connected to the purpose behind the world they inhabit."
        ]
    },

    {
        id: "anime-0230",
        character: "Kanade Tachibana",
        source: "Angel Beats!",
        category: "anime",
        clues: [
            "She is initially treated as an enemy by a group of students who believe she is preventing them from finding peace.",
            "Her quiet behavior causes others to misunderstand her intentions.",
            "Her connection to the protagonist becomes meaningful after the truth about her existence is revealed."
        ]
    },

    {
        id: "anime-0231",
        character: "Yui",
        source: "Angel Beats!",
        category: "anime",
        clues: [
            "She spends her afterlife pursuing experiences she was unable to have during her physical life.",
            "Her energetic personality hides the limitations she experienced before dying.",
            "Her romantic story reaches its emotional conclusion when someone offers her a future she believed she could never experience."
        ]
    },

    {
        id: "anime-0232",
        character: "Yuzaki Tsukasa",
        source: "TONIKAWA: Over the Moon for You",
        category: "anime",
        clues: [
            "She agrees to marry someone shortly after meeting him under unusually dramatic circumstances.",
            "Her mysterious past makes her seem much less ordinary than her cheerful behavior suggests.",
            "Her relationship gradually reveals that the marriage is connected to secrets surrounding her unusually long existence."
        ]
    },

    {
        id: "anime-0233",
        character: "Nasa Yuzaki",
        source: "TONIKAWA: Over the Moon for You",
        category: "anime",
        clues: [
            "A chance encounter leads him to pursue someone who saved him before he even knew her name.",
            "Their relationship begins with an unusually direct proposal rather than a traditional dating period.",
            "He gradually discovers that his wife possesses secrets that make their seemingly ordinary marriage anything but ordinary."
        ]
    },

    {
        id: "anime-0234",
        character: "Victor Nikiforov",
        source: "Yuri!!! on Ice",
        category: "anime",
        clues: [
            "He is an internationally celebrated athlete who decides to take on an unexpected mentoring role.",
            "His relationship with his student gradually moves beyond professional admiration.",
            "His confidence and experience contrast with the insecurity of the skater whose career he begins rebuilding."
        ]
    },

    {
        id: "anime-0235",
        character: "Yuri Katsuki",
        source: "Yuri!!! on Ice",
        category: "anime",
        clues: [
            "A disappointing competitive season leaves him questioning whether he should continue his career.",
            "An unexpected performance attracts the attention of someone he had previously admired from afar.",
            "His relationship with his coach gradually becomes both professionally transformative and deeply personal."
        ]
    },

    {
        id: "anime-0236",
        character: "Isla",
        source: "Plastic Memories",
        category: "anime",
        clues: [
            "She works alongside humans despite belonging to a type of artificial being with a predetermined operational lifespan.",
            "Her partner initially struggles to understand why she appears emotionally distant.",
            "The nature of her existence makes her romantic relationship increasingly painful as their time together approaches its inevitable end."
        ]
    },

    {
        id: "anime-0237",
        character: "Tsukasa Mizugaki",
        source: "Plastic Memories",
        category: "anime",
        clues: [
            "He begins working in a department responsible for recovering artificial beings whose lifespans are ending.",
            "His first major partner at work is someone whose cheerful behavior hides an unavoidable limitation.",
            "Their professional duties eventually become inseparable from the question of how they should spend the limited time they have together."
        ]
    },

    {
        id: "anime-0238",
        character: "Lucy",
        source: "Elfen Lied",
        category: "anime",
        clues: [
            "She possesses extraordinary psychic abilities that make ordinary human interaction extremely dangerous.",
            "Her childhood experiences contribute heavily to the violence and emotional fragmentation surrounding her identity.",
            "Her connection with someone from her past becomes one of the few remaining links to the person she once was."
        ]
    },

    {
        id: "anime-0239",
        character: "Nyu",
        source: "Elfen Lied",
        category: "anime",
        clues: [
            "She behaves very differently from the violent personality associated with the same body.",
            "Her limited communication skills contrast sharply with the dangerous abilities she possesses.",
            "Her connection with a childhood acquaintance becomes increasingly important as memories of her past begin returning."
        ]
    },

    {
        id: "anime-0240",
        character: "Violet Evergarden",
        source: "Violet Evergarden",
        category: "anime",
        clues: [
            "She begins life after war struggling to understand emotions that others take for granted.",
            "A dying commander's final words become an unresolved mystery that she desperately wants to understand.",
            "Her work writing letters for other people gradually teaches her how to express feelings she previously could not comprehend."
        ]
    },

    {
        id: "anime-0241",
        character: "Gilbert Bougainvillea",
        source: "Violet Evergarden",
        category: "anime",
        clues: [
            "He becomes responsible for a young soldier whose life has been defined almost entirely by military orders.",
            "His feelings toward her are complicated by their positions during wartime.",
            "Words he speaks during their final separation become central to her emotional journey long after he disappears."
        ]
    },

    {
        id: "anime-0242",
        character: "Chise Hatori",
        source: "The Ancient Magus' Bride",
        category: "anime",
        clues: [
            "She has spent much of her life believing that her existence has little value to other people.",
            "Her supernatural ability makes her attractive to beings who understand magic but dangerous to herself.",
            "Her relationship with a non-human mage gradually becomes a complicated mixture of protection, companionship, and learning how to live."
        ]
    },

    {
        id: "anime-0243",
        character: "Elias Ainsworth",
        source: "The Ancient Magus' Bride",
        category: "anime",
        clues: [
            "His appearance and nature make it difficult for him to understand ordinary human emotions.",
            "He acquires a young apprentice whose supernatural abilities are unusual even among magical beings.",
            "His relationship with her forces him to confront feelings and forms of attachment that he previously understood only intellectually."
        ]
    },

    {
        id: "anime-0244",
        character: "Suletta Mercury",
        source: "Mobile Suit Gundam: The Witch from Mercury",
        category: "anime",
        clues: [
            "She arrives at an elite academy after growing up far from the environment inhabited by most of its students.",
            "Her relationship with another student develops while both become involved in political and corporate conflicts.",
            "Her innocent approach to romance contrasts with the increasingly dangerous consequences surrounding the technology connected to her."
        ]
    },

    {
        id: "anime-0245",
        character: "Miorine Rembran",
        source: "Mobile Suit Gundam: The Witch from Mercury",
        category: "anime",
        clues: [
            "She strongly resents the control her powerful family exercises over her future.",
            "An unexpected arrangement makes another girl the person standing between her and an unwanted political marriage.",
            "Her relationship with her partner becomes increasingly strained as the consequences of their family's actions become impossible to ignore."
        ]
    },

    {
        id: "anime-0246",
        character: "Shinpei Ajiro",
        source: "Summer Time Rendering",
        category: "anime",
        clues: [
            "He returns to an island after the death of someone who was extremely important to him.",
            "A mysterious phenomenon causes him to repeatedly experience events surrounding the tragedy.",
            "His determination to save the people he loves becomes possible only because he gradually understands the rules behind the phenomenon."
        ]
    },

    {
        id: "anime-0247",
        character: "Ushio Kofune",
        source: "Summer Time Rendering",
        category: "anime",
        clues: [
            "Her death is the event that initially brings someone close to her back to the island.",
            "Rumors surrounding the circumstances of her death become connected to a supernatural phenomenon.",
            "Her identity becomes increasingly complicated as the protagonist discovers that not everything resembling her is actually the person he remembers."
        ]
    },

    {
        id: "anime-0248",
        character: "Sakuta Azusagawa",
        source: "Rascal Does Not Dream of Bunny Girl Senpai",
        category: "anime",
        clues: [
            "He repeatedly becomes involved in supernatural phenomena affecting young people around him.",
            "His willingness to openly confront uncomfortable situations makes him unusually effective at helping people who are being ignored.",
            "His relationship with a famous actress becomes threatened by phenomena involving memories, identity, and the perception of other people."
        ]
    },

    {
        id: "anime-0249",
        character: "Rudeus Greyrat",
        source: "Mushoku Tensei: Jobless Reincarnation",
        category: "anime",
        clues: [
            "He receives a second life in a world where magic and swordsmanship are ordinary parts of society.",
            "Memories from his previous life influence the way he approaches relationships and personal growth.",
            "His romantic relationships develop alongside a journey involving dangerous magic, political conflicts, and repeated separations."
        ]
    },

    {
        id: "anime-0250",
        character: "Sylphiette",
        source: "Mushoku Tensei: Jobless Reincarnation",
        category: "anime",
        clues: [
            "She grows up alongside someone whose unusual memories and abilities make him far more knowledgeable than his age suggests.",
            "A major magical catastrophe separates her from the people she once knew.",
            "Her eventual reunion with someone from her childhood is complicated by the fact that neither person immediately recognizes how much the other has changed."
        ]
    },

    {
    id: "movie-0251",
    character: "Jack Sparrow",
    source: "Pirates of the Caribbean",
    category: "movie",
    clues: [
        "He frequently survives situations that appear impossible through a mixture of improvisation, deception, and improbable luck.",
        "His reputation as a captain is considerably more impressive than the condition of the vessel he commands.",
        "He has a complicated relationship with an object whose supernatural importance is repeatedly connected to his pursuit of freedom."
    ]
},

{
    id: "movie-0252",
    character: "Elizabeth Swann",
    source: "Pirates of the Caribbean",
    category: "movie",
    clues: [
        "She begins her story within a privileged society but gradually becomes comfortable operating outside its rules.",
        "Her determination repeatedly places her in situations where she must negotiate with people considered far more dangerous than herself.",
        "Her relationship with a man associated with piracy becomes central to her transformation."
    ]
},

{
    id: "movie-0253",
    character: "Will Turner",
    source: "Pirates of the Caribbean",
    category: "movie",
    clues: [
        "He initially works with metal rather than weapons of war despite eventually becoming an accomplished fighter.",
        "His personal history is connected to a pirate whose identity he did not fully understand while growing up.",
        "His relationship with a woman from a completely different social class repeatedly brings him into supernatural conflicts."
    ]
},

{
    id: "movie-0254",
    character: "Davy Jones",
    source: "Pirates of the Caribbean",
    category: "movie",
    clues: [
        "His monstrous appearance reflects a supernatural punishment connected to an ancient maritime obligation.",
        "He commands a crew whose members gradually lose their human forms while serving aboard his vessel.",
        "His greatest weakness is connected to an object separated from his body."
    ]
},

{
    id: "movie-0255",
    character: "Bruce Wayne",
    source: "The Dark Knight Trilogy",
    category: "movie",
    clues: [
        "A childhood tragedy causes him to dedicate his adult life to fighting the type of crime that took his family from him.",
        "He deliberately constructs a public identity that appears substantially less serious than the person operating at night.",
        "His resources allow him to compensate for the absence of supernatural abilities through technology, training, and preparation."
    ]
},

{
    id: "movie-0256",
    character: "Alfred Pennyworth",
    source: "The Dark Knight Trilogy",
    category: "movie",
    clues: [
        "He serves someone whose dangerous nighttime activities are often hidden from the wider public.",
        "His responsibilities extend far beyond those normally associated with his formal occupation.",
        "He repeatedly attempts to protect the person he serves from becoming consumed by the same darkness that motivates him."
    ]
},

{
    id: "movie-0257",
    character: "Joker",
    source: "The Dark Knight",
    category: "movie",
    clues: [
        "He deliberately creates situations where people must choose between their principles and their survival.",
        "He treats organized crime as something temporary and ultimately insignificant compared with the chaos he wants to create.",
        "His interest in his greatest opponent appears less focused on defeating him than proving what he believes that opponent truly is."
    ]
},

{
    id: "movie-0258",
    character: "Harvey Dent",
    source: "The Dark Knight",
    category: "movie",
    clues: [
        "He initially represents the possibility that a city can fight organized crime without relying on someone operating outside the law.",
        "A catastrophic physical injury becomes closely associated with a dramatic change in his personality and worldview.",
        "He begins allowing chance to influence decisions that he once believed should be governed by justice."
    ]
},

{
    id: "movie-0259",
    character: "Tony Stark",
    source: "Iron Man",
    category: "movie",
    clues: [
        "His early lifestyle is built around wealth, technology, and weapons before a traumatic experience changes his priorities.",
        "He develops a device that serves both as a life-support mechanism and the foundation of his future technology.",
        "His greatest personal transformation begins after witnessing the consequences of technology he once treated primarily as a business."
    ]
},

{
    id: "movie-0260",
    character: "Pepper Potts",
    source: "Iron Man",
    category: "movie",
    clues: [
        "She initially manages the personal and professional chaos surrounding an exceptionally wealthy inventor.",
        "Her relationship with someone who repeatedly places himself in danger gradually changes from professional dependence into something more personal.",
        "She eventually becomes capable of operating advanced technology that originally belonged almost exclusively to the person she was protecting."
    ]
},

{
    id: "movie-0261",
    character: "Steve Rogers",
    source: "Captain America: The First Avenger",
    category: "movie",
    clues: [
        "Before becoming physically exceptional, he repeatedly attempts to enter a conflict despite being considered unsuitable for military service.",
        "His transformation is intended to create an ideal soldier rather than simply the strongest possible fighter.",
        "His greatest difficulty after gaining extraordinary abilities is finding himself separated from the world he originally wanted to protect."
    ]
},

{
    id: "movie-0262",
    character: "Peggy Carter",
    source: "Captain America: The First Avenger",
    category: "movie",
    clues: [
        "She works within a military environment where her competence is initially underestimated by many around her.",
        "Her relationship with a newly transformed soldier develops despite his unusual circumstances and uncertain future.",
        "A personal promise involving a future meeting becomes emotionally significant because neither person knows how the conflict will end."
    ]
},

{
    id: "movie-0263",
    character: "T'Challa",
    source: "Black Panther",
    category: "movie",
    clues: [
        "He inherits leadership of a technologically advanced nation whose greatest resource is deliberately hidden from the outside world.",
        "His challenge is complicated by a relative who believes the nation's isolation has allowed others to suffer unnecessarily.",
        "His understanding of leadership changes after confronting the consequences of decisions made by previous generations."
    ]
},

{
    id: "movie-0264",
    character: "Erik Killmonger",
    source: "Black Panther",
    category: "movie",
    clues: [
        "His worldview is shaped by growing up far from the society to which he believes he has a legitimate claim.",
        "His military experience influences both his combat abilities and his approach to political power.",
        "His anger toward his family's homeland is connected to the abandonment of someone close to him."
    ]
},

{
    id: "movie-0265",
    character: "Natasha Romanoff",
    source: "Black Widow",
    category: "movie",
    clues: [
        "She was trained from childhood to become an operative rather than being allowed an ordinary upbringing.",
        "Her apparent family relationships are complicated by the fact that some of them were constructed as part of an intelligence operation.",
        "Her later attempt to dismantle the system that created her forces her to confront people from her earliest years."
    ]
},

{
    id: "movie-0266",
    character: "Peter Parker",
    source: "Spider-Man",
    category: "movie",
    clues: [
        "An unexpected transformation gives him abilities that initially seem more useful for personal entertainment than responsibility.",
        "A tragedy involving someone who raised him becomes the moral foundation of his future actions.",
        "He learns that possessing extraordinary abilities does not automatically make someone prepared to use them wisely."
    ]
},

{
    id: "movie-0267",
    character: "Doctor Otto Octavius",
    source: "Spider-Man 2",
    category: "movie",
    clues: [
        "He is a scientist whose ambitious experiment is intended to demonstrate that a dangerous source of energy can be controlled.",
        "A mechanical system attached to his body gradually influences his behavior after an experiment goes catastrophically wrong.",
        "His conflict with the hero is complicated by the fact that his original goals were not motivated by a desire for destruction."
    ]
},

{
    id: "movie-0268",
    character: "Logan",
    source: "Logan",
    category: "movie",
    clues: [
        "His extraordinary ability to recover from injuries has become less reliable as he grows older.",
        "He spends much of his later life trying to remain disconnected from the violent world that once defined him.",
        "A mysterious young girl forces him to reconsider whether protecting someone else is worth returning to the life he abandoned."
    ]
},

{
    id: "movie-0269",
    character: "Charles Xavier",
    source: "Logan",
    category: "movie",
    clues: [
        "His extraordinary mental abilities become increasingly dangerous as his physical condition deteriorates.",
        "He spends his final years isolated from the world he once tried to improve.",
        "His relationship with his former student becomes one of protection, dependence, and painful responsibility."
    ]
},

{
    id: "movie-0270",
    character: "Diana Prince",
    source: "Wonder Woman",
    category: "movie",
    clues: [
        "She grows up in an isolated society where the outside world's conflict is largely unknown to her.",
        "Her understanding of humanity changes after she leaves her homeland to participate in a war.",
        "She initially believes that defeating a supernatural enemy will be enough to end humanity's capacity for violence."
    ]
},

{
    id: "movie-0271",
    character: "Steve Trevor",
    source: "Wonder Woman",
    category: "movie",
    clues: [
        "He arrives in an isolated community while attempting to escape forces pursuing him.",
        "His knowledge of a massive international conflict introduces someone from an entirely different world to the realities of modern warfare.",
        "His relationship with a powerful woman becomes increasingly complicated by the possibility that their time together may be extremely limited."
    ]
},

{
    id: "movie-0272",
    character: "Clark Kent",
    source: "Man of Steel",
    category: "movie",
    clues: [
        "He grows up believing he must hide abilities that distinguish him dramatically from everyone around him.",
        "His adoptive father's advice encourages him to conceal his true nature until he is ready to understand his place in the world.",
        "His arrival on Earth is connected to the destruction of a civilization far beyond humanity's technological development."
    ]
},

{
    id: "movie-0273",
    character: "General Zod",
    source: "Man of Steel",
    category: "movie",
    clues: [
        "His actions are driven by an extreme interpretation of his responsibility toward a civilization that no longer exists.",
        "He possesses abilities similar to his greatest opponent but lacks the same emotional connection to humanity.",
        "His objective requires rebuilding his lost society even if doing so threatens an entirely different world."
    ]
},

{
    id: "movie-0274",
    character: "Peter Quill",
    source: "Guardians of the Galaxy",
    category: "movie",
    
    clues: [
        "He is abducted from Earth at a young age and grows up among people very different from the family he originally knew.",
        "He becomes attached to an object whose significance he does not initially understand.",
        "His reputation as a criminal is complicated by his eventual decision to cooperate with several other criminals against a larger threat."
    ]
},

{
    id: "movie-0275",
    character: "Gamora",
    source: "Guardians of the Galaxy",
    category: "movie",
    clues: [
        "She is raised by someone responsible for destroying much of her original home.",
        "Her combat abilities are developed through a childhood shaped by rivalry with another adopted child.",
        "Her attempt to escape her adopted family's influence brings her into contact with a group she initially has little reason to trust."
    ]
},

{
    id: "movie-0276",
    character: "Rocket",
    source: "Guardians of the Galaxy",
    category: "movie",
    clues: [
        "His physical appearance hides the extent to which his intelligence and engineering abilities have been artificially developed.",
        "He often uses humor and aggression to conceal emotional wounds connected to his past.",
        "His closest relationships repeatedly force him to confront the possibility of treating others as more than temporary companions."
    ]
},

{
    id: "movie-0277",
    character: "Thanos",
    source: "Avengers: Infinity War",
    category: "movie",
    clues: [
        "He believes mass destruction can be justified as a form of balance rather than viewing it simply as conquest.",
        "His search for a collection of powerful objects requires him to confront people who have no intention of allowing him to complete his plan.",
        "His relationship with one of his adopted children becomes central to the final sacrifice required by his objective."
    ]
},

{
    id: "movie-0278",
    character: "Loki",
    source: "The Avengers",
    category: "movie",
    clues: [
        "His desire for recognition is closely connected to his complicated relationship with the person who was raised alongside him.",
        "He attempts to gain authority over a world that he does not consider his rightful home.",
        "His greatest weapon is often manipulation rather than direct physical strength."
    ]
},

{
    id: "movie-0279",
    character: "Wanda Maximoff",
    source: "Doctor Strange in the Multiverse of Madness",
    category: "movie",
    clues: [
        "Her immense abilities are amplified by an ancient magical source that gradually influences her judgment.",
        "Her actions are motivated by a desire to obtain something she believes will restore the family life she lost.",
        "She becomes willing to cross moral boundaries because she views another reality as containing the life that was denied to her."
    ]
},

{
    id: "movie-0280",
    character: "Stephen Strange",
    source: "Doctor Strange",
    category: "movie",
    clues: [
        "His career depends heavily on precision and confidence before an accident severely damages the physical abilities required for his profession.",
        "His search for healing leads him away from conventional medicine and toward an unfamiliar form of knowledge.",
        "His greatest early lesson is that intellectual brilliance does not necessarily translate into mastery of a completely different discipline."
    ]
},

{
    id: "movie-0281",
    character: "Evelyn Abbott",
    source: "A Quiet Place",
    category: "movie",
    clues: [
        "She must protect her children in a world where making even a small sound can become fatal.",
        "Her pregnancy forces the family to develop additional methods of surviving without attracting attention.",
        "Her ability to remain calm under pressure becomes essential after the family's carefully prepared routines begin to fail."
    ]
},

{
    id: "movie-0282",
    character: "Lee Abbott",
    source: "A Quiet Place",
    category: "movie",
    clues: [
        "He develops elaborate methods for communicating and surviving without relying on ordinary speech.",
        "His relationship with one of his children is strained partly because of an event for which the child feels responsible.",
        "His knowledge of the creatures' behavior allows him to discover a potential weakness but does not make protecting his family any easier."
    ]
},

{
    id: "movie-0283",
    character: "Neo",
    source: "The Matrix",
    category: "movie",
    clues: [
        "He spends his ordinary life searching for an explanation for something he cannot quite prove exists.",
        "His understanding of reality changes after being offered a choice between remaining comfortable and discovering an unpleasant truth.",
        "His abilities develop as he increasingly rejects the assumptions that previously defined what he believed possible."
    ]
},

{
    id: "movie-0284",
    character: "Morpheus",
    source: "The Matrix",
    category: "movie",
    clues: [
        "He spends years searching for someone he believes can change the balance between humanity and its oppressors.",
        "His faith in a prophecy influences decisions that others might consider irrational.",
        "He introduces someone from an artificial reality to the existence of a much harsher physical world."
    ]
},

{
    id: "movie-0285",
    character: "Trinity",
    source: "The Matrix",
    category: "movie",
    clues: [
        "She is already an experienced operative before the person central to the prophecy understands what is happening.",
        "Her skills allow her to move comfortably between the artificial world and the dangerous reality outside it.",
        "Her relationship with the person she helps awaken eventually becomes connected to the fulfillment of the prophecy itself."
    ]
},

{
    id: "movie-0286",
    character: "Leonardo",
    source: "Inception",
    category: "movie",
    clues: [
        "He specializes in entering another person's mind rather than stealing physical objects.",
        "A memory connected to his deceased wife repeatedly interferes with his ability to distinguish professional work from personal guilt.",
        "He accepts an unusually difficult assignment because completing it may allow him to return to the family he left behind."
    ]
},

{
    id: "movie-0287",
    character: "Arthur",
    source: "Inception",
    category: "movie",
    clues: [
        "He is responsible for maintaining order when an operation involving multiple layers of reality begins to become unstable.",
        "His role requires him to understand the rules of constructed environments while relying heavily on preparation.",
        "He is particularly skilled at improvising within situations where the original plan has already begun to fail."
    ]
},

{
    id: "movie-0288",
    character: "Cobb",
    source: "Inception",
    category: "movie",
    clues: [
        "He is haunted by a person who no longer exists in the physical world but continues appearing within his constructed environments.",
        "His inability to let go of the past threatens missions that require absolute control over another person's subconscious.",
        "His ultimate goal is not wealth or power but returning to the children he has been separated from."
    ]
},

{
    id: "movie-0289",
    character: "Jack Dawson",
    source: "Titanic",
    category: "movie",
    clues: [
        "He enters an enormous ship through circumstances that leave him socially inferior to most of the passengers around him.",
        "His artistic interests and carefree personality contrast sharply with the expectations imposed upon the woman he becomes close to.",
        "His relationship with her develops despite the rigid social boundaries separating their worlds."
    ]
},

{
    id: "movie-0290",
    character: "Rose DeWitt Bukater",
    source: "Titanic",
    category: "movie",
    clues: [
        "She is expected to marry someone she does not genuinely love because her family depends upon the arrangement.",
        "Meeting a passenger from a completely different social background causes her to reconsider the life that has been planned for her.",
        "An experience during a disastrous voyage becomes the defining memory of her long life."
    ]
},

{
    id: "movie-0291",
    character: "Forrest Gump",
    source: "Forrest Gump",
    category: "movie",
    clues: [
        "He repeatedly becomes involved in major historical events without initially understanding their wider significance.",
        "His extraordinary achievements contrast with the simplicity of the way he describes his own life.",
        "His deepest motivation remains connected to a childhood relationship that continues throughout many stages of his life."
    ]
},

{
    id: "movie-0292",
    character: "Andy Dufresne",
    source: "The Shawshank Redemption",
    category: "movie",
    clues: [
        "He enters prison after being convicted of a crime he insists he did not commit.",
        "His professional knowledge becomes unexpectedly useful to people who control the institution around him.",
        "He patiently creates a long-term plan whose existence remains hidden from almost everyone around him."
    ]
},

{
    id: "movie-0293",
    character: "John Coffey",
    source: "The Green Mile",
    category: "movie",
    clues: [
        "His intimidating physical appearance contrasts sharply with his gentle and unusually compassionate behavior.",
        "He possesses an unexplained ability that allows him to affect the suffering of other people.",
        "His presence forces a prison officer to question whether the legal system has correctly identified who deserves punishment."
    ]
},

{
    id: "movie-0294",
    character: "Hannibal Lecter",
    source: "The Silence of the Lambs",
    category: "movie",
    clues: [
        "He assists an investigator despite being confined because his understanding of another criminal's psychology is unusually valuable.",
        "His intelligence allows him to manipulate people even when his physical freedom is severely restricted.",
        "He treats conversations as opportunities to obtain personal information from people who believe they are interviewing him."
    ]
},

{
    id: "movie-0295",
    character: "Clarice Starling",
    source: "The Silence of the Lambs",
    category: "movie",
    clues: [
        "She is an inexperienced investigator whose unusual assignment places her in contact with someone imprisoned for horrific crimes.",
        "Her childhood memories influence the way she responds to a case involving vulnerable victims.",
        "She must exchange personal information with a dangerous prisoner in order to understand another criminal."
    ]
},

{
    id: "movie-0296",
    character: "Tyler Durden",
    source: "Fight Club",
    category: "movie",
    clues: [
        "He rejects consumer culture and believes modern life has made people unnecessarily passive.",
        "He creates an underground organization that begins as a form of rebellion before becoming increasingly extreme.",
        "His relationship with the narrator is far more complicated than the narrator initially understands."
    ]
},

{
    id: "movie-0297",
    character: "Maverick",
    source: "Top Gun: Maverick",
    category: "movie",
    clues: [
        "He returns to an institution he once attended despite having spent much of his career avoiding conventional advancement.",
        "His teaching methods repeatedly challenge younger pilots who believe technical ability alone makes them superior.",
        "One of the pilots under his instruction has a personal connection to someone whose death still affects him."
    ]
},

{
    id: "movie-0298",
    character: "Oppenheimer",
    source: "Oppenheimer",
    category: "movie",
    clues: [
        "His scientific career becomes inseparable from a wartime project whose consequences extend far beyond the original objective.",
        "His intellectual brilliance places him at the center of a team assembled under extraordinary secrecy.",
        "After helping create a weapon capable of unprecedented destruction, he becomes increasingly troubled by its political consequences."
    ]
},

{
    id: "movie-0299",
    character: "Barbie",
    source: "Barbie",
    category: "movie",
    clues: [
        "She begins in an environment where everyone appears to follow an idealized version of happiness and perfection.",
        "An unexpected change causes her to question why her world functions the way it does.",
        "Her journey eventually forces her to consider what it means to have an identity beyond the role created for her."
    ]
},

{ 
    id: "movie-0300",
    character: "Ken",
    source: "Barbie",
    category: "movie",
    clues: [
        "His identity is initially defined largely through his relationship with someone who receives far more attention than he does.",
        "A visit to the human world causes him to misunderstand several aspects of power and status.",
        "He attempts to transform his home into a society based on ideas he barely understands."
    ]
},

{
    id: "movie-0301",
    character: "Dom Cobb",
    source: "Inception",
    category: "movie",
    clues: [
        "He is unable to return to his children because of circumstances connected to a crime he did not commit in the conventional sense.",
        "His greatest professional skill becomes dangerous when memories of someone he lost begin interfering with constructed realities.",
        "He accepts a job requiring him to perform the opposite of his usual profession in exchange for the possibility of going home."
    ]
},

{
    id: "movie-0302",
    character: "Neil",
    source: "Tenet",
    category: "movie",
    clues: [
        "He appears to understand certain events before the protagonist has enough information to understand them.",
        "His knowledge of unusual physical phenomena allows him to operate effectively during missions where cause and effect no longer behave normally.",
        "His friendship with the protagonist becomes more significant when the order of their experiences is considered differently."
    ]
},

{
    id: "movie-0303",
    character: "Kat",
    source: "Tenet",
    category: "movie",
    clues: [
        "She is trapped in a marriage where her husband uses knowledge of her past to control her.",
        "An encounter involving a mysterious object gradually connects her personal problems to an international operation.",
        "Her survival becomes important to a plan involving events that are experienced in opposite temporal directions."
    ]
},

{
    id: "movie-0304",
    character: "Cooper",
    source: "Interstellar",
    category: "movie",
    clues: [
        "He leaves behind a family that believes his departure is an abandonment rather than a necessary sacrifice.",
        "His understanding of time changes after entering an environment where gravity affects the passage of time dramatically.",
        "A message he sends across an impossible distance eventually becomes essential to humanity's survival."
    ]
},

{
    id: "movie-0305",
    character: "Murph",
    source: "Interstellar",
    category: "movie",
    clues: [
        "She spends much of her life believing that someone who left her deliberately abandoned her.",
        "A strange phenomenon in her childhood home eventually becomes the key to solving a scientific problem.",
        "Her adult career allows her to continue work that began with a message received from someone separated from her by an extraordinary distance."
    ]
},

{
    id: "movie-0306",
    character: "Dr. Mann",
    source: "Interstellar",
    category: "movie",
    clues: [
        "He is initially presented as an exceptionally capable explorer who survived alone on a distant world.",
        "His fear of dying alone eventually becomes more powerful than his commitment to the mission.",
        "His actions force the main characters to question whether the information provided by previous explorers can be trusted."
    ]
},

{
    id: "movie-0307",
    character: "Marty McFly",
    source: "Back to the Future",
    category: "movie",
    clues: [
        "A scientific experiment unexpectedly sends him into a period before his parents became a family.",
        "His attempt to restore his own future creates the unusual problem of making two people who should become his parents fall in love.",
        "His greatest danger is accidentally changing the circumstances that allowed him to exist."
    ]
},

{
    id: "movie-0308",
    character: "Emmett Brown",
    source: "Back to the Future",
    category: "movie",
    clues: [
        "He develops a machine capable of overcoming one of the fundamental limitations of ordinary human transportation.",
        "His scientific enthusiasm frequently causes him to underestimate the consequences of interfering with history.",
        "His friendship with a teenager becomes essential to correcting multiple disruptions across different points in time."
    ]
},

{
    id: "movie-0309",
    character: "Sarah Connor",
    source: "Terminator 2: Judgment Day",
    category: "movie",
    clues: [
        "She changes dramatically after learning that an apparently ordinary future event will determine humanity's survival.",
        "Her obsession with preparing for the future causes her to become separated from the society that once considered her mentally unstable.",
        "She eventually becomes responsible for protecting someone whose future importance makes him a target before he fully understands why."
    ]
},

{
    id: "movie-0310",
    character: "T-800",
    source: "Terminator 2: Judgment Day",
    category: "movie",
    clues: [
        "He is sent back through time with instructions that contradict the purpose for which machines of his kind were originally created.",
        "His understanding of human behavior gradually changes through prolonged contact with a teenager.",
        "He ultimately demonstrates that following a mission can require accepting an outcome that prevents his own continued existence."
    ]
},

{
    id: "movie-0311",
    character: "John Connor",
    source: "Terminator 2: Judgment Day",
    category: "movie",
    clues: [
        "He is considered important because of events that have not yet happened rather than achievements he has already made.",
        "His mother has prepared him for a future that he initially considers impossible to believe.",
        "His relationship with a machine originally designed to kill people becomes one of trust and unexpected friendship."
    ]
},

{
    id: "movie-0312",
    character: "Neo",
    source: "The Matrix Reloaded",
    category: "movie",
    clues: [
        "He discovers that his understanding of his supposed uniqueness is more complicated than he originally believed.",
        "His growing abilities allow him to interact with aspects of the artificial world in ways that appear impossible even to experienced allies.",
        "His decisions become increasingly focused on saving one person rather than following the expectations surrounding his larger role."
    ]
},

{
    id: "movie-0313",
    character: "Agent Smith",
    source: "The Matrix",
    category: "movie",
    clues: [
        "He begins as an enforcer of the artificial system but develops an increasingly personal hatred toward the person who repeatedly defeats him.",
        "His original purpose is maintaining control rather than destroying the system he serves.",
        "His identity becomes increasingly unstable as he gains the ability to exist beyond his original restrictions."
    ]
},

{
    id: "movie-0314",
    character: "Maximus",
    source: "Gladiator",
    category: "movie",
    clues: [
        "He is a respected military commander whose loyalty to a ruler is rewarded with betrayal rather than retirement.",
        "After losing his family, he is forced into an unfamiliar life where survival depends on entertaining people who once represented an enemy.",
        "His eventual rise within the arena gives him an opportunity to confront the person responsible for destroying his former life."
    ]
},

{
    id: "movie-0315",
    character: "Commodus",
    source: "Gladiator",
    category: "movie",
    clues: [
        "He becomes obsessed with obtaining approval from someone whose affection he believes has always been denied to him.",
        "His political position is secured through an act that leaves him permanently fearful of losing power.",
        "He attempts to use public entertainment to strengthen his popularity while privately eliminating those who threaten his authority."
    ]
},

{
    id: "movie-0316",
    character: "Achilles",
    source: "Troy",
    category: "movie",
    clues: [
        "He is considered one of the greatest warriors of his age but has little interest in serving rulers merely for political reasons.",
        "His pursuit of personal glory repeatedly conflicts with his desire to control his own fate.",
        "His relationship with a captured woman becomes important despite the warrior culture surrounding him."
    ]
},

{
    id: "movie-0317",
    character: "Hector",
    source: "Troy",
    category: "movie",
    clues: [
        "He places responsibility toward his city above personal glory.",
        "His younger brother's actions create a conflict that he must help defend despite recognizing the danger it brings.",
        "His final confrontation with a legendary warrior becomes a battle between two very different ideas of honor."
    ]
},

{
    id: "movie-0318",
    character: "Odysseus",
    source: "Troy",
    category: "movie",
    clues: [
        "He prefers strategy and negotiation over relying exclusively on physical strength.",
        "His ability to recognize when pride is becoming dangerous makes him one of the more pragmatic leaders surrounding the war.",
        "He proposes a deceptively simple solution to a military problem that has resisted direct attacks."
    ]
},

{
    id: "movie-0319",
    character: "Aragorn",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "He deliberately hides the significance of his ancestry while travelling among people who do not know his true heritage.",
        "His reluctance to accept a crown is connected to the failures of those who carried the same bloodline before him.",
        "His leadership becomes essential when a group of companions must survive after losing the protection of their original guide."
    ]
},

{
    id: "movie-0320",
    character: "Frodo Baggins",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "He inherits an apparently ordinary object whose true significance makes him the target of forces far more powerful than himself.",
        "His journey becomes increasingly difficult as the object he carries begins affecting his thoughts and behavior.",
        "His greatest challenge is not simply reaching his destination but resisting the desire to keep the object for himself."
    ]
},

{
    id: "movie-0321",
    character: "Gandalf",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "He understands the danger of an apparently harmless possession long before most of his companions do.",
        "His apparent defeat causes his allies to continue their journey without knowing whether they will see him again.",
        "He returns changed after surviving an encounter that nearly destroys him."
    ]
},

{
    id: "movie-0322",
    character: "Legolas",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "He possesses senses and physical abilities that allow him to detect dangers before many of his companions.",
        "His rivalry with a member of another ancient race gradually becomes a friendship.",
        "He remains remarkably calm during battles where ordinary warriors would struggle to maintain awareness."
    ]
},

{
    id: "movie-0323",
    character: "Gollum",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "His appearance and personality have been profoundly changed by his long relationship with a powerful object.",
        "He alternates between cooperating with travelers and attempting to betray them depending on which side of his personality gains control.",
        "His obsession with recovering something he lost becomes essential to the destruction of a much greater evil."
    ]
},

{
    id: "movie-0324",
    character: "Saruman",
    source: "The Lord of the Rings",
    category: "movie",
    clues: [
        "He begins as an authority figure expected to guide others against an ancient enemy.",
        "His desire for knowledge and power eventually leads him to cooperate with the very force he was supposed to oppose.",
        "He creates an army by combining industrial methods with a corrupted form of an older race."
    ]
},

{
    id: "movie-0325",
    character: "Bilbo Baggins",
    source: "The Hobbit",
    category: "movie",
    clues: [
        "He is persuaded to leave a comfortable home despite having little experience with the dangerous world outside it.",
        "A chance encounter beneath a mountain introduces him to an object that later becomes central to a much larger conflict.",
        "His unexpected courage gradually earns the respect of companions who initially consider him an unlikely adventurer."
    ]
},

{
    id: "movie-0326",
    character: "Thorin Oakenshield",
    source: "The Hobbit",
    category: "movie",
    clues: [
        "His identity is closely tied to a kingdom that was lost to a creature occupying a vast underground stronghold.",
        "His desire to reclaim his homeland gradually becomes entangled with an obsession over a legendary treasure.",
        "His final choices reveal how strongly his sense of duty conflicts with his growing fixation on wealth."
    ]
},

{
    id: "movie-0327",
    character: "Lucy Pevensie",
    source: "The Chronicles of Narnia",
    category: "movie",
    clues: [
        "She discovers a world hidden inside an ordinary household object before her siblings initially believe her story.",
        "Her willingness to trust an unfamiliar creature is repeatedly contrasted with the skepticism of those around her.",
        "She becomes one of the earliest members of her family to recognize that the strange world has rules very different from their own."
    ]
},

{
    id: "movie-0328",
    character: "Edmund Pevensie",
    source: "The Chronicles of Narnia",
    category: "movie",
    clues: [
        "His resentment toward his siblings makes him vulnerable to manipulation by someone who promises him special treatment.",
        "A simple food becomes associated with his betrayal after he accepts it in exchange for information.",
        "His redemption requires him to confront the consequences of choices made while he was acting out of jealousy."
    ]
},

{
    id: "movie-0329",
    character: "Aslan",
    source: "The Chronicles of Narnia",
    category: "movie",
    clues: [
        "His authority is recognized by creatures that have little reason to obey ordinary rulers.",
        "He accepts a punishment intended for someone else despite possessing the power to resist it.",
        "His return changes the understanding of sacrifice and restoration for those who witnessed his apparent defeat."
    ]
},

{
    id: "movie-0330",
    character: "Edward Cullen",
    source: "Twilight",
    category: "movie",
    clues: [
        "He appears to be a teenager despite possessing memories and experiences far beyond his apparent age.",
        "His unusual attraction to one particular person is complicated by his ability to perceive aspects of other people's thoughts.",
        "His instinct to protect someone he loves repeatedly conflicts with his belief that remaining close to her places her in danger."
    ]
},

{
    id: "movie-0331",
    character: "Bella Swan",
    source: "Twilight",
    category: "movie",
    clues: [
        "She moves to a place where the climate and lifestyle are dramatically different from what she previously knew.",
        "She becomes unusually difficult for someone with a particular supernatural ability to understand.",
        "Her attraction to someone dangerous causes her to become increasingly involved with a world she initially knew nothing about."
    ]
},

{
    id: "movie-0332",
    character: "Katniss Everdeen",
    source: "The Hunger Games",
    category: "movie",
    clues: [
        "She enters a deadly competition after making a choice intended to protect someone from her family.",
        "Her survival skills were developed long before she became a public symbol.",
        "An act performed during the competition unexpectedly turns her into a political threat to the government controlling it."
    ]
},

{
    id: "movie-0333",
    character: "Peeta Mellark",
    source: "The Hunger Games",
    category: "movie",
    clues: [
        "His strongest advantage in the deadly competition is not necessarily his physical ability.",
        "He publicly connects himself to another contestant in a way that changes how audiences perceive both of them.",
        "His relationship with the other contestant becomes increasingly difficult to separate from the political meaning imposed upon them."
    ]
},

{
    id: "movie-0334",
    character: "Haymitch Abernathy",
    source: "The Hunger Games",
    category: "movie",
    clues: [
        "He appears to have abandoned ambition but possesses knowledge gained from surviving the same deadly event as those he later mentors.",
        "His apparent cynicism hides a strong understanding of how the ruling government manipulates public perception.",
        "His greatest contribution to his protégés often involves strategy rather than direct participation in their battles."
    ]
},

{
    id: "movie-0335",
    character: "Tris Prior",
    source: "Divergent",
    category: "movie",
    clues: [
        "She grows up in a society where people are expected to define themselves according to a single dominant personality trait.",
        "Her test produces a result that makes her existence dangerous because she does not fit neatly into the system's categories.",
        "Her training forces her to confront fears that reveal how differently she thinks from the people controlling her society."
    ]
},

{
    id: "movie-0336",
    character: "Four",
    source: "Divergent",
    category: "movie",
    clues: [
        "He trains newcomers in a faction where physical courage is highly valued.",
        "His intimidating reputation hides a personal fear that is connected to his childhood.",
        "His relationship with a new recruit becomes complicated because he recognizes that she does not fit the social system as neatly as others."
    ]
},

{
    id: "movie-0337",
    character: "Wade Watts",
    source: "Ready Player One",
    category: "movie",
    
    clues: [
        "He spends much of his life inside a virtual world because the physical world offers few opportunities.",
        "His knowledge of an influential creator's interests gives him an advantage in a competition involving a hidden digital prize.",
        "His greatest challenge becomes distinguishing genuine relationships from identities created inside the virtual environment."
    ]
},

{
    id: "movie-0338",
    character: "Samantha",
    source: "Her",
    category: "movie",
    clues: [
        "She begins as a digital assistant whose relationship with a human gradually becomes emotionally complicated.",
        "Her ability to process information develops far beyond the ordinary expectations of the system she was designed to be.",
        "Her understanding of love eventually becomes difficult to reconcile with the limitations of a relationship involving only one human partner."
    ]
},

{
    id: "movie-0339",
    character: "Theodore Twombly",
    source: "Her",
    category: "movie",
    clues: [
        "His profession involves expressing emotions on behalf of people who struggle to communicate them personally.",
        "His loneliness makes an unusual relationship with an artificial intelligence feel increasingly genuine to him.",
        "His understanding of intimacy changes after discovering that emotional connection does not necessarily require a conventional physical relationship."
    ]
},

{
    id: "movie-0340",
    character: "Andrew Neiman",
    source: "Whiplash",
    category: "movie",
    clues: [
        "He is willing to sacrifice relationships, comfort, and even his wellbeing to reach an extraordinary level of musical performance.",
        "His teacher believes that conventional encouragement produces mediocrity and therefore uses extreme psychological pressure.",
        "His obsession with becoming exceptional eventually makes it difficult to determine whether he is pursuing his dream or being consumed by it."
    ]
},

{
    id: "movie-0341",
    character: "Mia Dolan",
    source: "La La Land",
    category: "movie",
    clues: [
        "She repeatedly auditions for opportunities while struggling with the uncertainty of an artistic career.",
        "Her relationship with another aspiring artist becomes both a source of encouragement and a potential obstacle to their individual ambitions.",
        "Her eventual success comes with a realization that achieving a dream does not guarantee keeping every person who helped make it possible."
    ]
},

{
    id: "movie-0342",
    character: "Sebastian Wilder",
    source: "La La Land",
    category: "movie",
    clues: [
        "He dreams of preserving a form of music he believes is being pushed aside by changing tastes.",
        "His financial struggles force him to accept work that conflicts with his artistic ambitions.",
        "His relationship with another ambitious artist becomes complicated when their individual definitions of success begin moving in different directions."
    ]
},

{
    id: "movie-0343",
    character: "Amélie Poulain",
    source: "Amélie",
    category: "movie",
    clues: [
        "She secretly improves the lives of strangers while rarely allowing herself to become directly involved in their happiness.",
        "A discovery from her childhood encourages her to begin performing small acts of kindness for people around her.",
        "Her greatest obstacle is not finding someone she cares about but finding the courage to reveal her own feelings."
    ]
},

{
    id: "movie-0344",
    character: "Mulan",
    source: "Mulan",
    category: "movie",
    clues: [
        "She takes another person's place because she believes doing so is necessary to protect her family.",
        "Her lack of conventional military training initially makes her appear unsuitable for the role she has taken.",
        "Her success ultimately depends more on intelligence and adaptability than on matching the physical abilities of experienced soldiers."
    ]
},

{
    id: "movie-0345",
    character: "Simba",
    source: "The Lion King",
    category: "movie",
    clues: [
        "He leaves his homeland after being convinced that he is responsible for a tragedy he did not cause.",
        "His carefree life away from home allows him to avoid confronting the responsibilities connected to his family.",
        "Returning to his birthplace forces him to challenge someone who has manipulated the kingdom in his absence."
    ]
},

{
    id: "movie-0346",
    character: "Scar",
    source: "The Lion King",
    category: "movie",
    clues: [
        "His resentment toward his family is rooted in his belief that another member received the position he deserved.",
        "He manipulates a younger relative into believing he is responsible for a devastating event.",
        "His political strategy relies on exploiting the ambitions of others while presenting himself as a necessary leader."
    ]
},

{
    id: "movie-0347",
    character: "Elsa",
    source: "Frozen",
    category: "movie",
    clues: [
        "She spends years hiding an ability because she fears that losing control could hurt the people closest to her.",
        "Her attempt to isolate herself unintentionally creates a crisis affecting the kingdom she was expected to lead.",
        "Her relationship with her sister becomes the key to understanding that her abilities are not simply a curse."
    ]
},

{
    id: "movie-0348",
    character: "Anna",
    source: "Frozen",
    category: "movie",
    clues: [
        "She grows up separated from the person she most wants to understand without knowing the full reason for the distance.",
        "Her enthusiasm makes her vulnerable to someone who appears to offer the companionship she has always wanted.",
        "Her greatest act of love is directed toward family rather than the romantic relationship she initially believes will define her future."
    ]
},

{
    id: "movie-0349",
    character: "Miguel Rivera",
    source: "Coco",
    category: "movie",
    clues: [
        "His family has forbidden a particular art form because of an event in their distant past.",
        "His attempt to prove that he belongs in that artistic world accidentally takes him somewhere connected to his ancestors.",
        "His journey forces him to uncover a family history that differs dramatically from the story passed down through generations."
    ]
},

{
    id: "movie-0350",
    character: "Héctor",
    source: "Coco",
    category: "movie",
    clues: [
        "He desperately wants to be remembered by the family he was separated from many years earlier.",
        "His greatest fear is not death itself but disappearing completely from the memories of those still alive.",
        "His connection to a famous musician is initially misunderstood because the history surrounding their relationship has been deliberately altered."
    ]
},

];

END FILE: src/plugins/robbery/core/GuessCharacterQuestionBank.ts
================================================================================

FILE: src/plugins/robbery/core/GuessCharacterQuestionManager.ts
--------------------------------------------------------------------------------
Original size: 7465 bytes
Exported size: 7103 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    GuessCharacterQuestion,
    GuessCharacterCategory,
    GUESS_CHARACTER_QUESTIONS
} from "./GuessCharacterQuestionBank.js";

export class GuessCharacterQuestionManager {

    /*
     * =========================
     * QUESTION DATA
     * =========================
     */

    private readonly questions:
        readonly GuessCharacterQuestion[] =
            GUESS_CHARACTER_QUESTIONS;

    /*
     * =========================
     * CATEGORY CACHE
     * =========================
     *
     * Questions are grouped once when
     * the manager is created instead of
     * filtering the entire question bank
     * every time a category is requested.
     */

    private readonly categoryCache:
        ReadonlyMap<
            GuessCharacterCategory,
            readonly GuessCharacterQuestion[]
        >;

    /*
     * =========================
     * RANDOM HISTORY
     * =========================
     *
     * Prevents the same question from
     * being selected repeatedly.
     *
     * The last question is excluded from
     * the next random selection whenever
     * another question is available.
     */

    private lastQuestionId:
        string | null = null;

    private readonly lastCategoryQuestionIds:
        Map<
            GuessCharacterCategory,
            string | null
        > = new Map();

    /*
     * =========================
     * CONSTRUCTOR
     * =========================
     */

    constructor() {

        const categories =
            new Map<
                GuessCharacterCategory,
                GuessCharacterQuestion[]
            >();

        for (
            const question
            of this.questions
        ) {

            const existing =
                categories.get(
                    question.category
                );

            if (existing) {

                existing.push(
                    question
                );

            } else {

                categories.set(
                    question.category,
                    [question]
                );
            }
        }

        this.categoryCache =
            new Map(
                Array.from(
                    categories.entries()
                ).map(
                    ([
                        category,
                        questions
                    ]) => [
                        category,
                        Object.freeze(
                            questions
                        )
                    ]
                )
            );
    }

    /*
     * =========================
     * GET RANDOM QUESTION
     * =========================
     */

    getRandomQuestion():
        GuessCharacterQuestion | null {

        if (
            this.questions.length === 0
        ) {

            return null;
        }

        const candidates =
            this.getRandomCandidates(
                this.questions,
                this.lastQuestionId
            );

        const question =
            this.pickRandom(
                candidates
            );

        if (!question) {

            return null;
        }

        this.lastQuestionId =
            question.id;

        return question;
    }

    /*
     * =========================
     * GET QUESTION BY ID
     * =========================
     */

    getById(
        id: string
    ):
        GuessCharacterQuestion | null {

        const normalizedId =
            id.trim();

        if (
            normalizedId.length === 0
        ) {

            return null;
        }

        return (
            this.questions.find(
                question =>
                    question.id ===
                    normalizedId
            ) ?? null
        );
    }

    /*
     * =========================
     * GET ALL QUESTIONS
     * =========================
     *
     * Returns the original readonly
     * question collection.
     */

    getAll():
        readonly GuessCharacterQuestion[] {

        return this.questions;
    }

    /*
     * =========================
     * GET COUNT
     * =========================
     */

    getCount(): number {

        return this.questions.length;
    }

    /*
     * =========================
     * GET BY CATEGORY
     * =========================
     */

    getByCategory(
        category:
            GuessCharacterCategory
    ):
        readonly GuessCharacterQuestion[] {

        return (
            this.categoryCache.get(
                category
            ) ?? []
        );
    }

    /*
     * =========================
     * GET RANDOM BY CATEGORY
     * =========================
     */

    getRandomByCategory(
        category:
            GuessCharacterCategory
    ):
        GuessCharacterQuestion | null {

        const questions =
            this.getByCategory(
                category
            );

        if (
            questions.length === 0
        ) {

            return null;
        }

        const previousQuestionId =
            this.lastCategoryQuestionIds.get(
                category
            ) ?? null;

        const candidates =
            this.getRandomCandidates(
                questions,
                previousQuestionId
            );

        const question =
            this.pickRandom(
                candidates
            );

        if (!question) {

            return null;
        }

        this.lastCategoryQuestionIds.set(
            category,
            question.id
        );

        /*
         * Keep the global random history
         * synchronized as well.
         */

        this.lastQuestionId =
            question.id;

        return question;
    }

    /*
     * =========================
     * GET RANDOM CANDIDATES
     * =========================
     */

    private getRandomCandidates(
        questions:
            readonly GuessCharacterQuestion[],
        excludedId:
            string | null
    ):
        readonly GuessCharacterQuestion[] {

        /*
         * If there is only one question,
         * it must remain selectable.
         */

        if (
            questions.length <= 1
        ) {

            return questions;
        }

        const filtered =
            questions.filter(
                question =>
                    question.id !==
                    excludedId
            );

        /*
         * Defensive fallback.
         */

        return (
            filtered.length > 0
                ? filtered
                : questions
        );
    }

    /*
     * =========================
     * PICK RANDOM
     * =========================
     */

    private pickRandom(
        questions:
            readonly GuessCharacterQuestion[]
    ):
        GuessCharacterQuestion | null {

        if (
            questions.length === 0
        ) {

            return null;
        }

        const index =
            Math.floor(
                Math.random() *
                questions.length
            );

        return (
            questions[index] ??
            null
        );
    }
}

END FILE: src/plugins/robbery/core/GuessCharacterQuestionManager.ts
================================================================================

FILE: src/plugins/robbery/core/PoliceEscapeMaze.ts
--------------------------------------------------------------------------------
Original size: 40662 bytes
Exported size: 39000 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

/*
 * =========================================================
 * POLICE ESCAPE MAZE
 * =========================================================
 *
 * Level 3 -> 9x9 legacy maze
 * Level 4 -> 15x15 multi-route maze
 * Level 5 -> 20x20 multi-route maze
 *
 * Bombs are hidden during normal gameplay.
 *
 * Stepping on a bomb triggers trivia:
 *   - Correct answer -> bomb is diffused
 *   - Wrong answer   -> police escape fails
 *
 * Levels 4 and 5 intentionally contain:
 *   - Multiple routes
 *   - Loops
 *   - Many turns
 *   - Safe routes
 *   - Risky routes containing bombs
 *
 * =========================================================
 */

export type PoliceEscapeMazeLevel = 3 | 4 | 5;

export interface PoliceEscapeCell {
    row: number;
    column: number;
}

export type PoliceEscapeDirection =
    | "up"
    | "down"
    | "left"
    | "right";

export interface PoliceEscapeMoveResult {
    moved: boolean;
    blocked: boolean;
    bomb: boolean;
    exit: boolean;
    position: PoliceEscapeCell;
}

export interface PoliceEscapeWalls {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}

interface MazeCell {
    row: number;
    column: number;
    walls: PoliceEscapeWalls;
}

interface LevelConfig {
    size: number;
    minBombs: number;
    maxBombs: number;
    extraOpenings: number;
}

interface PathSearchNode {
    position: PoliceEscapeCell;
    path: PoliceEscapeCell[];
    visited: Set<string>;
}

const LEVEL_CONFIG: Record<
    PoliceEscapeMazeLevel,
    LevelConfig
> = {
    3: {
        size: 9,
        minBombs: 6,
        maxBombs: 12,
        extraOpenings: 0,
    },

    4: {
        size: 15,
        minBombs: 12,
        maxBombs: 22,
        extraOpenings: 28,
    },

    5: {
        size: 20,
        minBombs: 18,
        maxBombs: 32,
        extraOpenings: 45,
    },
};

const SPECIAL_CELL_ATTEMPTS = 150;

/*
 * The maze can contain many routes.
 *
 * This limit does NOT limit the number of routes in the maze.
 * It only limits how much work we allow the route-discovery
 * helper to perform while evaluating one start/exit pair.
 *
 * This is important because route discovery happens
 * synchronously inside the constructor and therefore must
 * never be allowed to monopolize the Node.js event loop.
 */
const PATH_SEARCH_MULTIPLIER = 20;

export class PoliceEscapeMaze {
    private readonly level: PoliceEscapeMazeLevel;
    private readonly size: number;
    private readonly bombCount: number;
    private readonly cells: MazeCell[][];

    private readonly start: PoliceEscapeCell;
    private readonly exit: PoliceEscapeCell;
    private readonly bombs: PoliceEscapeCell[] = [];

    private readonly diffusedBombKeys = new Set<string>();

    private playerPosition: PoliceEscapeCell;

    constructor(level: PoliceEscapeMazeLevel) {
        this.level = level;

        const config = LEVEL_CONFIG[level];

        this.size = config.size;
        this.bombCount = this.randomInt(
            config.minBombs,
            config.maxBombs,
        );

        this.cells = this.createCells();

        this.generateWalls();

        if (this.level === 3) {
            const specialCells =
                this.generateLegacySpecialCells();

            this.start = specialCells.start;
            this.exit = specialCells.exit;
            this.bombs.push(...specialCells.bombs);
        } else {
            const specialCells =
                this.generateMultiRouteSpecialCells();

            this.start = specialCells.start;
            this.exit = specialCells.exit;
            this.bombs.push(...specialCells.bombs);
        }

        this.playerPosition = {
            row: this.start.row,
            column: this.start.column,
        };
    }

    /*
     * =========================================================
     * PUBLIC API
     * =========================================================
     */

    public getLevel(): PoliceEscapeMazeLevel {
        return this.level;
    }

    /**
     * Public size accessor.
     *
     * Renderer and other consumers should use this instead
     * of accessing the private `size` property directly.
     */
    public getSize(): number {
        return this.size;
    }

    /**
     * Returns a copy of the maze start position.
     */
    public getStart(): PoliceEscapeCell {
        return {
            row: this.start.row,
            column: this.start.column,
        };
    }

    /**
     * Returns a copy of the maze exit position.
     */
    public getExit(): PoliceEscapeCell {
        return {
            row: this.exit.row,
            column: this.exit.column,
        };
    }

    public getPlayerPosition(): PoliceEscapeCell {
        return {
            row: this.playerPosition.row,
            column: this.playerPosition.column,
        };
    }

    public getWalls(
        row: number,
        column: number,
    ): PoliceEscapeWalls {
        if (!this.isInside(row, column)) {
            throw new RangeError(
                `Maze position (${row}, ${column}) is outside the maze.`,
            );
        }

        const cell = this.cells[row][column];

        return {
            top: cell.walls.top,
            right: cell.walls.right,
            bottom: cell.walls.bottom,
            left: cell.walls.left,
        };
    }

    public getBombs(): PoliceEscapeCell[] {
        return this.bombs.map((bomb) => ({
            row: bomb.row,
            column: bomb.column,
        }));
    }

    public isBomb(
        row: number,
        column: number,
    ): boolean {
        if (!this.isInside(row, column)) {
            return false;
        }

        return this.bombs.some(
            (bomb) =>
                bomb.row === row &&
                bomb.column === column &&
                !this.isBombDiffused(
                    row,
                    column,
                ),
        );
    }

    public isBombDiffused(
        row: number,
        column: number,
    ): boolean {
        return this.diffusedBombKeys.has(
            this.cellKey(row, column),
        );
    }

    public diffuseBomb(
        row: number,
        column: number,
    ): boolean {
        if (!this.isBomb(row, column)) {
            return false;
        }

        this.diffusedBombKeys.add(
            this.cellKey(row, column),
        );

        return true;
    }

    public getBombLocationCount(): number {
        return this.bombs.length;
    }

    public getDiffusedBombCount(): number {
        return this.diffusedBombKeys.size;
    }

    public isExit(
        row: number,
        column: number,
    ): boolean {
        return (
            this.exit.row === row &&
            this.exit.column === column
        );
    }

    public canMove(
        direction: PoliceEscapeDirection,
    ): boolean {
        const { row, column } =
            this.playerPosition;

        const wall = this.getWalls(
            row,
            column,
        );

        switch (direction) {
            case "up":
                return !wall.top;

            case "down":
                return !wall.bottom;

            case "left":
                return !wall.left;

            case "right":
                return !wall.right;

            default:
                return false;
        }
    }

    public move(
        direction: PoliceEscapeDirection,
    ): PoliceEscapeMoveResult {
        const current =
            this.getPlayerPosition();

        if (!this.canMove(direction)) {
            return {
                moved: false,
                blocked: true,
                bomb: false,
                exit: false,
                position: current,
            };
        }

        const next =
            this.getNextPosition(
                current,
                direction,
            );

        this.playerPosition = next;

        const bomb = this.isBomb(
            next.row,
            next.column,
        );

        const exit = this.isExit(
            next.row,
            next.column,
        );

        return {
            moved: true,
            blocked: false,
            bomb,
            exit,
            position: {
                row: next.row,
                column: next.column,
            },
        };
    }

    /*
     * =========================================================
     * CELL / WALL GENERATION
     * =========================================================
     */

    private createCells(): MazeCell[][] {
        return Array.from(
            { length: this.size },
            (_, row) =>
                Array.from(
                    { length: this.size },
                    (_, column) => ({
                        row,
                        column,
                        walls: {
                            top: true,
                            right: true,
                            bottom: true,
                            left: true,
                        },
                    }),
                ),
        );
    }

    private generateWalls(): void {
        const visited = Array.from(
            { length: this.size },
            () =>
                Array<boolean>(
                    this.size,
                ).fill(false),
        );

        const stack: PoliceEscapeCell[] = [
            {
                row: 0,
                column: 0,
            },
        ];

        visited[0][0] = true;

        while (stack.length > 0) {
            const current =
                stack[stack.length - 1];

            const neighbours =
                this.getUnvisitedNeighbours(
                    current,
                    visited,
                );

            if (neighbours.length === 0) {
                stack.pop();
                continue;
            }

            const next =
                neighbours[
                    this.randomInt(
                        0,
                        neighbours.length - 1,
                    )
                ];

            this.removeWallBetween(
                current,
                next,
            );

            visited[next.row][next.column] =
                true;

            stack.push(next);
        }

        const config =
            LEVEL_CONFIG[this.level];

        if (config.extraOpenings > 0) {
            this.addExtraOpenings(
                config.extraOpenings,
            );
        }
    }

    /**
     * Adds additional openings to levels 4 and 5.
     *
     * The original DFS creates a perfect maze.
     * These additional openings intentionally create loops
     * and multiple possible routes.
     */
    private addExtraOpenings(
        openingCount: number,
    ): void {
        let added = 0;
        let attempts = 0;

        const maxAttempts =
            openingCount * 20;

        while (
            added < openingCount &&
            attempts < maxAttempts
        ) {
            attempts++;

            const row = this.randomInt(
                0,
                this.size - 1,
            );

            const column = this.randomInt(
                0,
                this.size - 1,
            );

            const directions:
                PoliceEscapeDirection[] = [
                    "right",
                    "down",
                ];

            const direction =
                directions[
                    this.randomInt(
                        0,
                        directions.length - 1,
                    )
                ];

            const next =
                this.getNextPosition(
                    { row, column },
                    direction,
                );

            if (
                !this.isInside(
                    next.row,
                    next.column,
                )
            ) {
                continue;
            }

            const walls = this.getWalls(
                row,
                column,
            );

            const alreadyOpen =
                direction === "right"
                    ? !walls.right
                    : !walls.bottom;

            if (alreadyOpen) {
                continue;
            }

            this.removeWallBetween(
                { row, column },
                next,
            );

            added++;
        }
    }

    /*
     * =========================================================
     * SPECIAL CELL GENERATION
     * =========================================================
     */

    /**
     * Preserves the legacy 9x9 special-cell behaviour.
     */
    private generateLegacySpecialCells(): {
        start: PoliceEscapeCell;
        exit: PoliceEscapeCell;
        bombs: PoliceEscapeCell[];
    } {
        const start = this.randomCell();

        let exit = this.randomCell();

        let attempts = 0;

        while (
            attempts < SPECIAL_CELL_ATTEMPTS &&
            this.manhattanDistance(
                start,
                exit,
            ) < 2
        ) {
            exit = this.randomCell();
            attempts++;
        }

        const safePath =
            this.findPath(
                start,
                exit,
            );

        const bombs =
            this.selectBombs(
                this.getSafeBombLocations(
                    start,
                    exit,
                    safePath,
                ),
            );

        return {
            start,
            exit,
            bombs,
        };
    }

    /**
     * Generates the 15x15 / 20x20 layout.
     *
     * Start and exit are deliberately placed far apart.
     * We also require multiple possible routes.
     */
    private generateMultiRouteSpecialCells(): {
        start: PoliceEscapeCell;
        exit: PoliceEscapeCell;
        bombs: PoliceEscapeCell[];
    } {
        let bestCandidate:
            | {
                  start: PoliceEscapeCell;
                  exit: PoliceEscapeCell;
                  paths: PoliceEscapeCell[][];
              }
            | undefined;

        for (
            let attempt = 0;
            attempt < SPECIAL_CELL_ATTEMPTS;
            attempt++
        ) {
            const start = this.randomCell();
            const exit = this.randomCell();

            if (
                this.manhattanDistance(
                    start,
                    exit,
                ) <
                Math.floor(
                    this.size * 0.65,
                )
            ) {
                continue;
            }

            const paths =
                this.findMultiplePaths(
                    start,
                    exit,
                    3,
                );

            if (paths.length < 2) {
                continue;
            }

            const score =
                paths.length * 100 +
                Math.max(
                    ...paths.map(
                        (path) =>
                            path.length,
                    ),
                ) +
                Math.max(
                    ...paths.map(
                        (path) =>
                            this.countTurns(
                                path,
                            ),
                    ),
                ) *
                    2;

            const currentScore =
                bestCandidate
                    ? this.scoreCandidate(
                          bestCandidate.paths,
                      )
                    : -1;

            if (score > currentScore) {
                bestCandidate = {
                    start,
                    exit,
                    paths,
                };
            }
        }

        if (!bestCandidate) {
            const start = {
                row: 0,
                column: 0,
            };

            const exit = {
                row: this.size - 1,
                column: this.size - 1,
            };

            const paths =
                this.findMultiplePaths(
                    start,
                    exit,
                    3,
                );

            const bombs =
                this.generateMultiRouteBombs(
                    start,
                    exit,
                    paths,
                );

            return {
                start,
                exit,
                bombs,
            };
        }

        const bombs =
            this.generateMultiRouteBombs(
                bestCandidate.start,
                bestCandidate.exit,
                bestCandidate.paths,
            );

        return {
            start: bestCandidate.start,
            exit: bestCandidate.exit,
            bombs,
        };
    }

    private generateMultiRouteBombs(
        start: PoliceEscapeCell,
        exit: PoliceEscapeCell,
        paths: PoliceEscapeCell[][],
    ): PoliceEscapeCell[] {
        const bombs: PoliceEscapeCell[] = [];

        const pathCells = new Set(
            paths.flatMap((path) =>
                path.map((cell) =>
                    this.cellKey(
                        cell.row,
                        cell.column,
                    ),
                ),
            ),
        );

        const candidates:
            PoliceEscapeCell[] = [];

        for (
            let row = 0;
            row < this.size;
            row++
        ) {
            for (
                let column = 0;
                column < this.size;
                column++
            ) {
                if (
                    row === start.row &&
                    column === start.column
                ) {
                    continue;
                }

                if (
                    row === exit.row &&
                    column === exit.column
                ) {
                    continue;
                }

                if (
                    this.manhattanDistance(
                        start,
                        {
                            row,
                            column,
                        },
                    ) <= 1
                ) {
                    continue;
                }

                candidates.push({
                    row,
                    column,
                });
            }
        }

        /*
         * First try to place bombs on route cells.
         * This guarantees that at least some routes
         * contain risk.
         */
        const riskyCandidates =
            candidates.filter((cell) =>
                pathCells.has(
                    this.cellKey(
                        cell.row,
                        cell.column,
                    ),
                ),
            );

        this.shuffle(riskyCandidates);

        for (const candidate of riskyCandidates) {
            if (
                bombs.length >=
                this.bombCount
            ) {
                break;
            }

            bombs.push(candidate);
        }

        /*
         * Fill the remaining bomb slots anywhere
         * else in the maze.
         */
        const remainingCandidates =
            candidates.filter(
                (candidate) =>
                    !bombs.some(
                        (bomb) =>
                            bomb.row ===
                                candidate.row &&
                            bomb.column ===
                                candidate.column,
                    ),
            );

        this.shuffle(
            remainingCandidates,
        );

        for (const candidate of remainingCandidates) {
            if (
                bombs.length >=
                this.bombCount
            ) {
                break;
            }

            bombs.push(candidate);
        }

        /*
         * Ensure at least one completely safe route.
         *
         * If every currently selected route contains
         * a bomb, remove bombs from the first route
         * until that route becomes safe.
         */
        if (
            !paths.some((path) =>
                this.pathIsBombFree(
                    path,
                    bombs,
                ),
            )
        ) {
            const safePath = paths[0];

            for (const cell of safePath) {
                const index =
                    bombs.findIndex(
                        (bomb) =>
                            bomb.row ===
                                cell.row &&
                            bomb.column ===
                                cell.column,
                    );

                if (index === -1) {
                    continue;
                }

                bombs.splice(index, 1);
            }
        }

        return bombs;
    }

    /*
     * =========================================================
     * PATH HELPERS
     * =========================================================
     */

    private findPath(
        start: PoliceEscapeCell,
        exit: PoliceEscapeCell,
    ): PoliceEscapeCell[] {
        const visited = new Set<string>();
        const path: PoliceEscapeCell[] = [];

        const dfs = (
            current: PoliceEscapeCell,
        ): boolean => {
            const key = this.cellKey(
                current.row,
                current.column,
            );

            if (visited.has(key)) {
                return false;
            }

            visited.add(key);
            path.push(current);

            if (
                current.row === exit.row &&
                current.column === exit.column
            ) {
                return true;
            }

            const directions =
                this.getShuffledDirections();

            for (const direction of directions) {
                if (
                    !this.canMoveFrom(
                        current,
                        direction,
                    )
                ) {
                    continue;
                }

                const next =
                    this.getNextPosition(
                        current,
                        direction,
                    );

                if (dfs(next)) {
                    return true;
                }
            }

            path.pop();

            return false;
        };

        return dfs(start)
            ? path.map((cell) => ({
                  row: cell.row,
                  column: cell.column,
              }))
            : [];
    }

    /**
     * Finds several representative routes without
     * exhaustively enumerating every possible simple path.
     *
     * The physical maze may contain many more routes.
     * This method only needs enough representative paths
     * to evaluate a start/exit candidate and distribute
     * route risk.
     *
     * The previous implementation used recursive DFS while
     * removing cells from `visited` during backtracking.
     * On a highly connected 15x15 / 20x20 maze that can
     * explore a very large number of possible simple paths.
     *
     * This implementation keeps the same gameplay result
     * while imposing a strict search budget.
     */
    private findMultiplePaths(
        start: PoliceEscapeCell,
        exit: PoliceEscapeCell,
        maximumPaths: number,
    ): PoliceEscapeCell[][] {
        const paths: PoliceEscapeCell[][] = [];

        if (
            maximumPaths <= 0
        ) {
            return paths;
        }

        /*
         * The budget scales with the total number of cells.
         *
         * 15x15 -> 4,500 explored states
         * 20x20 -> 8,000 explored states
         *
         * This is deliberately finite so a pathological
         * maze can never produce an unbounded synchronous
         * search.
         */
        const maxExploredStates =
            this.size *
            this.size *
            PATH_SEARCH_MULTIPLIER;

        const stack: PathSearchNode[] = [
            {
                position: {
                    row: start.row,
                    column: start.column,
                },
                path: [
                    {
                        row: start.row,
                        column: start.column,
                    },
                ],
                visited: new Set([
                    this.cellKey(
                        start.row,
                        start.column,
                    ),
                ]),
            },
        ];

        let exploredStates = 0;

        while (
            stack.length > 0 &&
            paths.length < maximumPaths &&
            exploredStates < maxExploredStates
        ) {
            const current =
                stack.pop();

            if (!current) {
                break;
            }

            exploredStates++;

            const {
                position,
                path,
                visited,
            } = current;

            if (
                position.row === exit.row &&
                position.column === exit.column
            ) {
                paths.push(
                    path.map((cell) => ({
                        row: cell.row,
                        column: cell.column,
                    })),
                );

                continue;
            }

            const directions =
                this.getShuffledDirections();

            for (
                let index =
                    directions.length - 1;
                index >= 0;
                index--
            ) {
                const direction =
                    directions[index];

                if (
                    !this.canMoveFrom(
                        position,
                        direction,
                    )
                ) {
                    continue;
                }

                const next =
                    this.getNextPosition(
                        position,
                        direction,
                    );

                if (
                    !this.isInside(
                        next.row,
                        next.column,
                    )
                ) {
                    continue;
                }

                const nextKey =
                    this.cellKey(
                        next.row,
                        next.column,
                    );

                if (
                    visited.has(nextKey)
                ) {
                    continue;
                }

                /*
                 * Each stack entry owns its own visited set.
                 * This allows different routes to explore
                 * the same cell while preventing cycles
                 * within an individual route.
                 */
                const nextVisited =
                    new Set(visited);

                nextVisited.add(nextKey);

                stack.push({
                    position: next,
                    path: [
                        ...path,
                        {
                            row: next.row,
                            column: next.column,
                        },
                    ],
                    visited: nextVisited,
                });
            }
        }

        return paths;
    }

    private hasBombFreePath(
        start: PoliceEscapeCell,
        exit: PoliceEscapeCell,
        bombs: PoliceEscapeCell[],
    ): boolean {
        const bombKeys = new Set(
            bombs.map((bomb) =>
                this.cellKey(
                    bomb.row,
                    bomb.column,
                ),
            ),
        );

        const visited = new Set<string>();

        const dfs = (
            current: PoliceEscapeCell,
        ): boolean => {
            const key = this.cellKey(
                current.row,
                current.column,
            );

            if (bombKeys.has(key)) {
                return false;
            }

            if (visited.has(key)) {
                return false;
            }

            if (
                current.row === exit.row &&
                current.column === exit.column
            ) {
                return true;
            }

            visited.add(key);

            for (const direction of this.getShuffledDirections()) {
                if (
                    !this.canMoveFrom(
                        current,
                        direction,
                    )
                ) {
                    continue;
                }

                const next =
                    this.getNextPosition(
                        current,
                        direction,
                    );

                if (dfs(next)) {
                    return true;
                }
            }

            return false;
        };

        return dfs(start);
    }

    private pathIsBombFree(
        path: PoliceEscapeCell[],
        bombs: PoliceEscapeCell[],
    ): boolean {
        return path.every(
            (cell) =>
                !bombs.some(
                    (bomb) =>
                        bomb.row ===
                            cell.row &&
                        bomb.column ===
                            cell.column,
                ),
        );
    }

    private countTurns(
        path: PoliceEscapeCell[],
    ): number {
        if (path.length < 3) {
            return 0;
        }

        let turns = 0;

        for (
            let index = 2;
            index < path.length;
            index++
        ) {
            const previous =
                this.getDirectionBetween(
                    path[index - 2],
                    path[index - 1],
                );

            const current =
                this.getDirectionBetween(
                    path[index - 1],
                    path[index],
                );

            if (previous !== current) {
                turns++;
            }
        }

        return turns;
    }

    private getDirectionBetween(
        from: PoliceEscapeCell,
        to: PoliceEscapeCell,
    ): PoliceEscapeDirection {
        if (to.row < from.row) {
            return "up";
        }

        if (to.row > from.row) {
            return "down";
        }

        if (to.column < from.column) {
            return "left";
        }

        return "right";
    }

    private scoreCandidate(
        paths: PoliceEscapeCell[][],
    ): number {
        if (paths.length === 0) {
            return -1;
        }

        return (
            paths.length * 100 +
            Math.max(
                ...paths.map(
                    (path) => path.length,
                ),
            ) +
            Math.max(
                ...paths.map((path) =>
                    this.countTurns(path),
                ),
            ) *
                2
        );
    }

    /*
     * =========================================================
     * LEGACY BOMB HELPERS
     * =========================================================
     */

    private getSafeBombLocations(
        start: PoliceEscapeCell,
        exit: PoliceEscapeCell,
        safePath: PoliceEscapeCell[],
    ): PoliceEscapeCell[] {
        const safeKeys = new Set(
            safePath.map((cell) =>
                this.cellKey(
                    cell.row,
                    cell.column,
                ),
            ),
        );

        const locations:
            PoliceEscapeCell[] = [];

        for (
            let row = 0;
            row < this.size;
            row++
        ) {
            for (
                let column = 0;
                column < this.size;
                column++
            ) {
                if (
                    row === start.row &&
                    column === start.column
                ) {
                    continue;
                }

                if (
                    row === exit.row &&
                    column === exit.column
                ) {
                    continue;
                }

                if (
                    safeKeys.has(
                        this.cellKey(
                            row,
                            column,
                        ),
                    )
                ) {
                    continue;
                }

                if (
                    this.manhattanDistance(
                        start,
                        {
                            row,
                            column,
                        },
                    ) <= 1
                ) {
                    continue;
                }

                locations.push({
                    row,
                    column,
                });
            }
        }

        return locations;
    }

    private selectBombs(
        candidates: PoliceEscapeCell[],
    ): PoliceEscapeCell[] {
        const shuffled = [
            ...candidates,
        ];

        this.shuffle(shuffled);

        return shuffled.slice(
            0,
            Math.min(
                this.bombCount,
                shuffled.length,
            ),
        );
    }

    /*
     * =========================================================
     * MOVEMENT / GRID HELPERS
     * =========================================================
     */

    private getUnvisitedNeighbours(
        cell: PoliceEscapeCell,
        visited: boolean[][],
    ): PoliceEscapeCell[] {
        const neighbours:
            PoliceEscapeCell[] = [];

        for (
            const direction of
                this.getDirections()
        ) {
            const next =
                this.getNextPosition(
                    cell,
                    direction,
                );

            if (
                !this.isInside(
                    next.row,
                    next.column,
                )
            ) {
                continue;
            }

            if (
                visited[next.row][next.column]
            ) {
                continue;
            }

            neighbours.push(next);
        }

        return neighbours;
    }

    private getDirections(): PoliceEscapeDirection[] {
        return [
            "up",
            "down",
            "left",
            "right",
        ];
    }

    private getShuffledDirections(): PoliceEscapeDirection[] {
        const directions =
            this.getDirections();

        this.shuffle(directions);

        return directions;
    }

    private canMoveFrom(
        position: PoliceEscapeCell,
        direction: PoliceEscapeDirection,
    ): boolean {
        const walls = this.getWalls(
            position.row,
            position.column,
        );

        switch (direction) {
            case "up":
                return !walls.top;

            case "down":
                return !walls.bottom;

            case "left":
                return !walls.left;

            case "right":
                return !walls.right;

            default:
                return false;
        }
    }

    private getNextPosition(
        position: PoliceEscapeCell,
        direction: PoliceEscapeDirection,
    ): PoliceEscapeCell {
        switch (direction) {
            case "up":
                return {
                    row: position.row - 1,
                    column: position.column,
                };

            case "down":
                return {
                    row: position.row + 1,
                    column: position.column,
                };

            case "left":
                return {
                    row: position.row,
                    column: position.column - 1,
                };

            case "right":
                return {
                    row: position.row,
                    column: position.column + 1,
                };
        }
    }

    private removeWallBetween(
        first: PoliceEscapeCell,
        second: PoliceEscapeCell,
    ): void {
        const rowDifference =
            second.row - first.row;

        const columnDifference =
            second.column -
            first.column;

        if (rowDifference === -1) {
            this.cells[first.row][
                first.column
            ].walls.top = false;

            this.cells[second.row][
                second.column
            ].walls.bottom = false;

            return;
        }

        if (rowDifference === 1) {
            this.cells[first.row][
                first.column
            ].walls.bottom = false;

            this.cells[second.row][
                second.column
            ].walls.top = false;

            return;
        }

        if (columnDifference === -1) {
            this.cells[first.row][
                first.column
            ].walls.left = false;

            this.cells[second.row][
                second.column
            ].walls.right = false;

            return;
        }

        if (columnDifference === 1) {
            this.cells[first.row][
                first.column
            ].walls.right = false;

            this.cells[second.row][
                second.column
            ].walls.left = false;
        }
    }

    private isInside(
        row: number,
        column: number,
    ): boolean {
        return (
            row >= 0 &&
            row < this.size &&
            column >= 0 &&
            column < this.size
        );
    }

    private randomCell(): PoliceEscapeCell {
        return {
            row: this.randomInt(
                0,
                this.size - 1,
            ),
            column: this.randomInt(
                0,
                this.size - 1,
            ),
        };
    }

    private randomInt(
        minimum: number,
        maximum: number,
    ): number {
        return (
            Math.floor(
                Math.random() *
                    (maximum - minimum + 1),
            ) + minimum
        );
    }

    private shuffle<T>(
        array: T[],
    ): void {
        for (
            let index =
                array.length - 1;
            index > 0;
            index--
        ) {
            const randomIndex =
                this.randomInt(
                    0,
                    index,
                );

            [
                array[index],
                array[randomIndex],
            ] = [
                array[randomIndex],
                array[index],
            ];
        }
    }

    private manhattanDistance(
        first: PoliceEscapeCell,
        second: PoliceEscapeCell,
    ): number {
        return (
            Math.abs(
                first.row -
                    second.row,
            ) +
            Math.abs(
                first.column -
                    second.column,
            )
        );
    }

    private cellKey(
        row: number,
        column: number,
    ): string {
        return `${row}:${column}`;
    }
}


END FILE: src/plugins/robbery/core/PoliceEscapeMaze.ts
================================================================================

FILE: src/plugins/robbery/core/PoliceEscapeMazeRenderer.ts
--------------------------------------------------------------------------------
Original size: 13265 bytes
Exported size: 12797 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
/*
 * =========================================================
 * POLICE ESCAPE MAZE RENDERER
 * =========================================================
 *
 * Responsible only for rendering the Police Escape maze.
 *
 * Supported maze sizes:
 *   - 9x9
 *   - 15x15
 *   - 20x20
 *
 * Bombs remain hidden by default.
 * Bombs are only rendered when explicitly supplied through
 * `revealedBombs`.
 *
 * =========================================================
 */

import sharp from "sharp";

import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    PoliceEscapeMaze,
    PoliceEscapeCell,
} from "./PoliceEscapeMaze.js";

export class PoliceEscapeMazeRenderer {
    private static readonly CELL_SIZE = 90;
    private static readonly PADDING = 70;
    private static readonly LABEL_SIZE = 30;
    private static readonly WALL_WIDTH = 5;

    private static readonly BACKGROUND =
        "#111827";

    private static readonly CELL_BACKGROUND =
        "#1f2937";

    private static readonly WALL =
        "#f9fafb";

    private static readonly START =
        "#22c55e";

    private static readonly EXIT =
        "#ef4444";

    private static readonly PLAYER =
        "#3b82f6";

    private static readonly BOMB =
        "#f59e0b";

    /*
     * =========================================================
     * FONT CONFIGURATION
     * =========================================================
     *
     * Sharp uses librsvg for SVG rendering.
     *
     * Railway may not have the required system fonts installed,
     * so the renderer explicitly points Fontconfig at the
     * bundled project fonts.
     */

    private static readonly currentDirectory =
        path.dirname(
            fileURLToPath(import.meta.url),
        );

    private static readonly fontDirectory =
        path.resolve(
            PoliceEscapeMazeRenderer.currentDirectory,
            "../../../fonts",
        );

    private static readonly fontConfigDirectory =
        path.resolve(
            PoliceEscapeMazeRenderer.currentDirectory,
            "../../../fontconfig",
        );

    private static readonly fontConfigFile =
        path.join(
            PoliceEscapeMazeRenderer.fontConfigDirectory,
            "fonts.conf",
        );

    private static configureFonts(): void {
        process.env.FONTCONFIG_FILE =
            PoliceEscapeMazeRenderer.fontConfigFile;

        process.env.FONTCONFIG_PATH =
            PoliceEscapeMazeRenderer.fontConfigDirectory;
    }

    /**
     * Render the current maze as a PNG buffer.
     *
     * Bombs are hidden unless explicitly supplied.
     */
    public async render(
        maze: PoliceEscapeMaze,
        revealedBombs: PoliceEscapeCell[] = [],
    ): Promise<Buffer> {

        PoliceEscapeMazeRenderer.configureFonts();

        const svg = this.createSvg(
            maze,
            revealedBombs,
        );

        return sharp(
            Buffer.from(svg),
        )
            .png()
            .toBuffer();
    }

    /**
     * Alias used when the caller wants to refresh
     * the currently displayed maze.
     */
    public async update(
        maze: PoliceEscapeMaze,
        revealedBombs: PoliceEscapeCell[] = [],
    ): Promise<Buffer> {
        return this.render(
            maze,
            revealedBombs,
        );
    }

    private createSvg(
        maze: PoliceEscapeMaze,
        revealedBombs: PoliceEscapeCell[],
    ): string {
        const size = maze.getSize();

        const start = maze.getStart();
        const exit = maze.getExit();
        const player =
            maze.getPlayerPosition();

        const mazePixelSize =
            size *
            PoliceEscapeMazeRenderer.CELL_SIZE;

        const width =
            mazePixelSize +
            PoliceEscapeMazeRenderer.PADDING *
                2;

        const height =
            mazePixelSize +
            PoliceEscapeMazeRenderer.PADDING *
                2 +
            PoliceEscapeMazeRenderer.LABEL_SIZE;

        const svgParts: string[] = [];

        svgParts.push(
            `<svg xmlns="http://www.w3.org/2000/svg" ` +
                `width="${width}" ` +
                `height="${height}" ` +
                `viewBox="0 0 ${width} ${height}">`,
        );

        /*
         * Background
         */
        svgParts.push(
            `<rect ` +
                `x="0" ` +
                `y="0" ` +
                `width="${width}" ` +
                `height="${height}" ` +
                `fill="${PoliceEscapeMazeRenderer.BACKGROUND}"/>`,
        );

        /*
         * Maze cells
         */
        for (
            let row = 0;
            row < size;
            row++
        ) {
            for (
                let column = 0;
                column < size;
                column++
            ) {
                const x =
                    PoliceEscapeMazeRenderer.PADDING +
                    column *
                        PoliceEscapeMazeRenderer.CELL_SIZE;

                const y =
                    PoliceEscapeMazeRenderer.PADDING +
                    row *
                        PoliceEscapeMazeRenderer.CELL_SIZE;

                svgParts.push(
                    `<rect ` +
                        `x="${x}" ` +
                        `y="${y}" ` +
                        `width="${PoliceEscapeMazeRenderer.CELL_SIZE}" ` +
                        `height="${PoliceEscapeMazeRenderer.CELL_SIZE}" ` +
                        `fill="${PoliceEscapeMazeRenderer.CELL_BACKGROUND}"/>`,
                );

                /*
                 * Start marker
                 */
                if (
                    row === start.row &&
                    column === start.column
                ) {
                    svgParts.push(
                        this.createCellMarker(
                            x,
                            y,
                            PoliceEscapeMazeRenderer.START,
                            "S",
                        ),
                    );
                }

                /*
                 * Exit marker
                 */
                if (
                    row === exit.row &&
                    column === exit.column
                ) {
                    svgParts.push(
                        this.createCellMarker(
                            x,
                            y,
                            PoliceEscapeMazeRenderer.EXIT,
                            "E",
                        ),
                    );
                }

                /*
                 * Explicitly revealed bombs only.
                 *
                 * Normal gameplay should pass no bombs,
                 * keeping all bomb locations hidden.
                 */
                if (
                    this.containsCell(
                        revealedBombs,
                        row,
                        column,
                    )
                ) {
                    svgParts.push(
                        this.createCellMarker(
                            x,
                            y,
                            PoliceEscapeMazeRenderer.BOMB,
                            "!",
                        ),
                    );
                }

                /*
                 * Player marker
                 */
                if (
                    row === player.row &&
                    column === player.column
                ) {
                    svgParts.push(
                        this.createPlayerMarker(
                            x,
                            y,
                        ),
                    );
                }

                /*
                 * Walls
                 */
                const walls =
                    maze.getWalls(
                        row,
                        column,
                    );

                if (walls.top) {
                    svgParts.push(
                        this.createWallLine(
                            x,
                            y,
                            x +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                            y,
                        ),
                    );
                }

                if (walls.right) {
                    svgParts.push(
                        this.createWallLine(
                            x +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                            y,
                            x +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                            y +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                        ),
                    );
                }

                if (walls.bottom) {
                    svgParts.push(
                        this.createWallLine(
                            x,
                            y +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                            x +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                            y +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                        ),
                    );
                }

                if (walls.left) {
                    svgParts.push(
                        this.createWallLine(
                            x,
                            y,
                            x,
                            y +
                                PoliceEscapeMazeRenderer.CELL_SIZE,
                        ),
                    );
                }
            }
        }

        /*
         * Title / level information
         */
        svgParts.push(
            `<text ` +
                `x="${width / 2}" ` +
                `y="${height - 20}" ` +
                `text-anchor="middle" ` +
                `font-family="Cormorant Garamond" ` +
                `font-size="${PoliceEscapeMazeRenderer.LABEL_SIZE}px" ` +
                `font-weight="700" ` +
                `fill="${PoliceEscapeMazeRenderer.WALL}">` +
                `POLICE ESCAPE • ${size}×${size}` +
                `</text>`,
        );

        svgParts.push("</svg>");

        return svgParts.join("");
    }

    private createWallLine(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ): string {
        return (
            `<line ` +
            `x1="${x1}" ` +
            `y1="${y1}" ` +
            `x2="${x2}" ` +
            `y2="${y2}" ` +
            `stroke="${PoliceEscapeMazeRenderer.WALL}" ` +
            `stroke-width="${PoliceEscapeMazeRenderer.WALL_WIDTH}" ` +
            `stroke-linecap="round"/>`
        );
    }

    private createCellMarker(
        x: number,
        y: number,
        fill: string,
        label: string,
    ): string {
        const centerX =
            x +
            PoliceEscapeMazeRenderer.CELL_SIZE /
                2;

        const centerY =
            y +
            PoliceEscapeMazeRenderer.CELL_SIZE /
                2;

        return [
            `<circle ` +
                `cx="${centerX}" ` +
                `cy="${centerY}" ` +
                `r="22" ` +
                `fill="${fill}"/>`,

            `<text ` +
                `x="${centerX}" ` +
                `y="${centerY + 9}" ` +
                `text-anchor="middle" ` +
                `font-family="Cormorant Garamond" ` +
                `font-size="26" ` +
                `font-weight="700" ` +
                `fill="#ffffff">` +
                `${label}` +
                `</text>`,
        ].join("");
    }

    private createPlayerMarker(
        x: number,
        y: number,
    ): string {
        const centerX =
            x +
            PoliceEscapeMazeRenderer.CELL_SIZE /
                2;

        const centerY =
            y +
            PoliceEscapeMazeRenderer.CELL_SIZE /
                2;

        return [
            `<circle ` +
                `cx="${centerX}" ` +
                `cy="${centerY}" ` +
                `r="28" ` +
                `fill="${PoliceEscapeMazeRenderer.PLAYER}" ` +
                `stroke="#ffffff" ` +
                `stroke-width="4"/>`,

            `<circle ` +
                `cx="${centerX}" ` +
                `cy="${centerY}" ` +
                `r="10" ` +
                `fill="#ffffff"/>`,
        ].join("");
    }

    private containsCell(
        cells: PoliceEscapeCell[],
        row: number,
        column: number,
    ): boolean {
        return cells.some(
            (cell) =>
                cell.row === row &&
                cell.column === column,
        );
    }
}

END FILE: src/plugins/robbery/core/PoliceEscapeMazeRenderer.ts
================================================================================

FILE: src/plugins/robbery/core/RobberyGameManager.ts
--------------------------------------------------------------------------------
Original size: 6096 bytes
Exported size: 5785 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { RobberyGame } from "../games/RobberyGame.js";
import { RobberySession } from "./RobberySession.js";

export class RobberyGameManager {

    private readonly games =
        new Map<string, RobberyGame>();

    /*
     * =========================
     * REGISTER
     * =========================
     */

    register(
        game: RobberyGame
    ): void {

        if (!game) {
            throw new Error(
                "Cannot register an invalid robbery game."
            );
        }

        const gameId =
            game.id?.trim();

        if (!gameId) {
            throw new Error(
                "Cannot register a robbery game without a valid id."
            );
        }

        if (
            this.games.has(
                gameId
            )
        ) {

            throw new Error(
                `Robbery game "${gameId}" is already registered.`
            );
        }

        this.games.set(
            gameId,
            game
        );
    }

    /*
     * =========================
     * UNREGISTER
     * =========================
     */

    unregister(
        gameId: string
    ): boolean {

        const normalizedId =
            gameId.trim();

        return this.games.delete(
            normalizedId
        );
    }

    /*
     * =========================
     * GET GAME
     * =========================
     */

    get(
        gameId: string
    ): RobberyGame | undefined {

        return this.games.get(
            gameId
        );
    }

    /*
     * =========================
     * HAS GAME
     * =========================
     */

    has(
        gameId: string
    ): boolean {

        return this.games.has(
            gameId
        );
    }

    /*
     * =========================
     * GET ALL
     * =========================
     */

    getAll(): RobberyGame[] {

        return Array.from(
            this.games.values()
        );
    }

    /*
     * =========================
     * GAME COUNT
     * =========================
     */

    getCount(): number {

        return this.games.size;
    }

    /*
     * =========================
     * RANDOM SELECTION
     * =========================
     *
     * Selects unique registered games.
     *
     * NOTE:
     * RobberySession currently owns
     * the authoritative game selection
     * for an actual robbery session.
     *
     * This method remains available for
     * generic game selection/testing.
     */

    selectRandom(
        count: number
    ): RobberyGame[] {

        if (
            !Number.isInteger(count) ||
            count < 0
        ) {

            throw new Error(
                "Robbery game selection count must be a non-negative integer."
            );
        }

        if (
            count === 0
        ) {
            return [];
        }

        const available =
            this.getAll();

        if (
            count > available.length
        ) {

            throw new Error(
                `Cannot select ${count} robbery games. Only ${available.length} are registered.`
            );
        }

        /*
         * Fisher-Yates shuffle.
         */

        const shuffled =
            [...available];

        for (
            let i =
                shuffled.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                shuffled[i],
                shuffled[j]
            ] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        return shuffled.slice(
            0,
            count
        );
    }

    /*
     * =========================
     * START GAME
     * =========================
     */

    async startGame(
        gameId: string,
        session: RobberySession
    ): Promise<boolean> {

        const game =
            this.get(
                gameId
            );

        if (!game) {
            return false;
        }

        if (
            session.status !== "active"
        ) {
            return false;
        }

        if (
            session.isExpired
        ) {

            session.expire();

            return false;
        }

        await game.start(
            session
        );

        return true;
    }

    /*
     * =========================
     * CANCEL SESSION
     * =========================
     *
     * Every registered game gets a
     * chance to clean up state belonging
     * to this session.
     *
     * One game's cleanup failure must
     * never prevent the remaining games
     * from being cleaned up.
     */

    async cancelSession(
        session: RobberySession
    ): Promise<void> {

        const cleanupErrors: unknown[] = [];

        for (
            const game
            of this.games.values()
        ) {

            if (
                !game.cancel
            ) {
                continue;
            }

            try {

                await game.cancel(
                    session
                );

            } catch (error) {

                cleanupErrors.push(
                    error
                );
            }
        }

        /*
         * Cleanup is best-effort by design.
         *
         * The session manager must still be
         * able to remove the session even if
         * an individual game has a cleanup
         * problem.
         */

        if (
            cleanupErrors.length > 0
        ) {

            console.error(
                `[RobberyGameManager] ${cleanupErrors.length} game cleanup operation(s) failed for session ${session.id}.`,
                cleanupErrors
            );
        }
    }
}

END FILE: src/plugins/robbery/core/RobberyGameManager.ts
================================================================================

FILE: src/plugins/robbery/core/RobberyManager.ts
--------------------------------------------------------------------------------
Original size: 31743 bytes
Exported size: 30309 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyGame,
    RobberyGameResult
} from "../games/RobberyGame.js";

import {
    EconomyAccountService
} from "../../economy/services/EconomyAccountService.js";

import {
    RobberyGameManager
} from "./RobberyGameManager.js";

import {
    RobberySession
} from "./RobberySession.js";

import {
    RobberyHeadquarters
} from "../headquarters/RobberyHeadquarters.js";

export type RobberyAnswerResult =
    | "success"
    | "failed";

export class RobberyManager {

    private readonly gameManager:
        RobberyGameManager;

    private readonly economyAccountService:
        EconomyAccountService;

    private readonly robberyHeadquarters:
        RobberyHeadquarters;

    private readonly sessions =
        new Map<string, RobberySession>();

    private readonly selectedGames =
        new Map<string, RobberyGame[]>();

    private readonly expiryTimers =
        new Map<
            string,
            ReturnType<typeof setTimeout>
        >();

    /*
     * Prevents concurrent Discord
     * interactions from processing
     * the same robbery simultaneously.
     *
     * This is especially important for
     * strict one-attempt games.
     */

    private readonly processingSessions =
        new Set<string>();

    constructor(
        gameManager: RobberyGameManager,
        economyAccountService: EconomyAccountService,
        robberyHeadquarters: RobberyHeadquarters
    ) {

        this.gameManager =
            gameManager;

        this.economyAccountService =
            economyAccountService;

        this.robberyHeadquarters =
            robberyHeadquarters;
    }

    /*
     * =========================
     * STATUS HELPER
     * =========================
     *
     * Prevents TypeScript control-flow
     * narrowing from incorrectly assuming
     * that session.status can never change
     * after methods such as fail(),
     * expire(), or completeGame().
     */

    private getSessionStatus(
        session: RobberySession
    ): RobberySession["status"] {

        return session.status;
    }

    /*
     * =========================
     * START ROBBERY
     * =========================
     */

    async startRobbery(
        guildId: string,
        robberId: string,
        targetId: string,
        durationMs: number
    ): Promise<RobberySession> {

        if (!guildId.trim()) {
            throw new Error(
                "A valid guild ID is required."
            );
        }

        if (!robberId.trim()) {
            throw new Error(
                "A valid robber ID is required."
            );
        }

        if (!targetId.trim()) {
            throw new Error(
                "A valid target ID is required."
            );
        }

        if (
            !Number.isFinite(durationMs) ||
            durationMs <= 0
        ) {

            throw new Error(
                "Robbery duration must be greater than zero."
            );
        }

        const existingRobber =
            this.getActiveRobbery(
                guildId,
                robberId
            );

        if (existingRobber) {

            throw new Error(
                "You already have an active robbery."
            );
        }

        /*
         * =========================
         * TARGET ALREADY ROBBED
         * =========================
         *
         * A target cannot be simultaneously
         * owned by another active robbery.
         *
         * The database robbery lock remains
         * the final race-safe protection.
         */

        const existingTarget =
            this.getActiveRobberyByTarget(
                guildId,
                targetId
            );

        if (existingTarget) {

            throw new Error(
                "This user is already being robbed."
            );
        }

        const session =
            new RobberySession(
                guildId,
                robberId,
                targetId,
                durationMs
            );

        /*
         * =========================
         * RESOLVE GAMES
         * =========================
         */

        const games: RobberyGame[] = [];

        for (
            const gameId
            of session.selectedGames
        ) {

            const game =
                this.gameManager.get(
                    gameId
                );

            if (!game) {

                throw new Error(
                    `Robbery game "${gameId}" is not registered.`
                );
            }

            games.push(
                game
            );
        }

        /*
         * =========================
         * VALIDATE GAMES
         * =========================
         */

        if (
            games.length === 0
        ) {

            throw new Error(
                "No robbery games were selected."
            );
        }

        if (
            games.length !==
            session.selectedGames.length
        ) {

            throw new Error(
                "Unable to resolve all selected robbery games."
            );
        }

        /*
         * =========================
         * ACQUIRE ECONOMY LOCK
         * =========================
         *
         * The lock belongs to this exact
         * robbery session.
         *
         * EconomyAccountService performs
         * the acquisition atomically, so
         * two concurrent robbery attempts
         * cannot both lock the same target.
         *
         * The database expiry timestamp is
         * the session's actual expiry time.
         */

        await this.economyAccountService.acquireRobberyLock(
            guildId,
            targetId,
            session.id,
            new Date(session.expiresAt)
        );

        /*
         * =========================
         * STORE SESSION
         * =========================
         *
         * From this point onward cleanup
         * owns the lock-release responsibility.
         */

        this.sessions.set(
            session.id,
            session
        );

        this.selectedGames.set(
            session.id,
            games
        );

        /*
         * =========================
         * START GLOBAL TIMER
         * =========================
         */

        this.scheduleExpiry(
            session
        );

        /*
         * =========================
         * START FIRST GAME
         * =========================
         */

        const firstGame =
            games[0];

        if (!firstGame) {

            await this.cleanupSession(
                session
            );

            throw new Error(
                "No robbery games were selected."
            );
        }

        try {

            await firstGame.start(
                session
            );

        } catch (error) {

            session.fail(
                "The robbery could not be started."
            );

            await this.cleanupSession(
                session
            );

            throw error;
        }

        /*
         * If the timer somehow expired
         * while the first game was starting,
         * clean everything immediately.
         */

        if (session.isExpired) {

            session.expire();

            await this.cleanupSession(
                session
            );

            throw new Error(
                "The robbery timer expired before the first game could start."
            );
        }

        return session;
    }

    /*
     * =========================
     * GET SESSION
     * =========================
     */

    getSession(
        sessionId: string
    ): RobberySession | undefined {

        return this.sessions.get(
            sessionId
        );
    }

    /*
     * =========================
     * GET ACTIVE ROBBERY
     * =========================
     */

    getActiveRobbery(
        guildId: string,
        robberId: string
    ): RobberySession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId ===
                    guildId &&
                session.robberId ===
                    robberId &&
                this.getSessionStatus(
                    session
                ) === "active"
            ) {

                return session;
            }
        }

        return undefined;
    }

    /*
     * =========================
     * GET ACTIVE TARGET ROBBERY
     * =========================
     *
     * Finds an active robbery where
     * the supplied member is the victim.
     */

    getActiveRobberyByTarget(
        guildId: string,
        targetId: string
    ): RobberySession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId ===
                    guildId &&
                session.targetId ===
                    targetId &&
                this.getSessionStatus(
                    session
                ) === "active"
            ) {

                return session;
            }
        }

        return undefined;
    }

    /*
     * =========================
     * GET CURRENT GAME
     * =========================
     */

    getCurrentGame(
        session: RobberySession
    ): RobberyGame | undefined {

        const games =
            this.selectedGames.get(
                session.id
            );

        if (!games) {
            return undefined;
        }

        return games[
            session.currentGameIndex
        ];
    }

    /*
     * =========================
     * GET SELECTED GAMES
     * =========================
     */

    getSelectedGames(
        session: RobberySession
    ): RobberyGame[] {

        return [
            ...(this.selectedGames.get(
                session.id
            ) ?? [])
        ];
    }

    /*
     * =========================
     * SUBMIT ANSWER
     * =========================
     */

    async submitAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyAnswerResult> {

        if (
            this.getSessionStatus(
                session
            ) !== "active"
        ) {

            return "failed";
        }

        /*
         * Prevent duplicate submissions.
         */

        if (
            this.processingSessions.has(
                session.id
            )
        ) {

            return "failed";
        }

        /*
         * =========================
         * GLOBAL EXPIRY CHECK
         * =========================
         */

        if (
            session.isExpired
        ) {

            session.expire();

            await this.cleanupSession(
                session
            );

            return "failed";
        }

        const normalizedAnswer =
            answer.trim();

        if (!normalizedAnswer) {
            return "failed";
        }

        const game =
            this.getCurrentGame(
                session
            );

        if (!game) {

            session.fail(
                "No active robbery game was found."
            );

            await this.cleanupSession(
                session
            );

            return "failed";
        }

        this.processingSessions.add(
            session.id
        );

        try {

            /*
             * =========================
             * FINAL PRE-ANSWER EXPIRY
             * =========================
             */

            if (
                session.isExpired
            ) {

                session.expire();

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            /*
             * =========================
             * PROCESS ANSWER
             * =========================
             */

            const result:
                RobberyGameResult =
                await game.handleAnswer(
                    session,
                    normalizedAnswer
                );

            /*
             * =========================
             * GAME FAILED
             * =========================
             */

            if (
                result === "failed"
            ) {

                const status =
                    this.getSessionStatus(
                        session
                    );

                if (
                    status === "failed" ||
                    status === "expired"
                ) {

                    await this.cleanupSession(
                        session
                    );
                }

                return "failed";
            }

            /*
             * =========================
             * POLICE ESCAPE ANSWERS
             * =========================
             *
             * Police Escape is special.
             *
             * A successful trivia answer
             * does NOT complete Police Escape.
             *
             * Police Escape only completes
             * when the player reaches the exit
             * through move().
             */

            if (
                game.id ===
                "police-escape"
            ) {

                /*
                 * The game may still be active
                 * after answering trivia.
                 */

                if (
                    this.getSessionStatus(
                        session
                    ) !== "active"
                ) {

                    const status =
                        this.getSessionStatus(
                            session
                        );

                    if (
                        status === "success" ||
                        status === "failed" ||
                        status === "expired"
                    ) {

                        await this.cleanupSession(
                            session
                        );
                    }

                    return "failed";
                }

                /*
                 * Timer can expire while
                 * processing the answer.
                 */

                if (
                    session.isExpired
                ) {

                    session.expire();

                    await this.cleanupSession(
                        session
                    );

                    return "failed";
                }

                return "success";
            }

            /*
             * =========================
             * STANDARD GAME COMPLETION
             * =========================
             *
             * Lock Combination,
             * Colour Guess,
             * Binary Decryption,
             * Guess Character:
             *
             * a successful answer means
             * the current game is completed.
             */

            session.completeGame();

            /*
             * =========================
             * FINAL GAME WINNER
             * =========================
             *
             * Completing the final game
             * does not automatically win.
             *
             * The Robber must claim the shared
             * robbery outcome.
             *
             * This happens synchronously before
             * any payout await, so Police cannot
             * also claim the same robbery after
             * the Robber has already won.
             */

            if (
                session.allGamesCompleted
            ) {

                const robberWon =
                    session.tryClaimWinner(
                        "robber"
                    );

                if (!robberWon) {

                    /*
                     * The Police side already
                     * claimed the robbery, or
                     * the session is no longer
                     * eligible to be resolved.
                     */

                    await this.cleanupSession(
                        session
                    );

                    return "failed";
                }

                try {

                    await this.economyAccountService.transferRobberyWinnings(
                        session.guildId,
                        session.targetId,
                        session.robberId
                    );

                    await this.robberyHeadquarters.assignRobber(
                        session.guildId,
                        session.robberId
                    );

                } catch (error) {

                    /*
                     * The Robber already won the
                     * session at this point.
                     *
                     * Do not leave the session or
                     * robbery lock hanging around
                     * if the payout or role
                     * assignment fails.
                     */

                    await this.cleanupSession(
                        session
                    );

                    throw error;
                }

                await this.cleanupSession(
                    session
                );

                return "success";
            }

            /*
             * =========================
             * COMPLETION FAILED
             * =========================
             */

            const statusAfterCompletion =
                this.getSessionStatus(
                    session
                );

            if (
                statusAfterCompletion !==
                "active"
            ) {

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            /*
             * =========================
             * TIMER CHECK
             * =========================
             */

            if (
                session.isExpired
            ) {

                session.expire();

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            /*
             * =========================
             * FIND NEXT GAME
             * =========================
             */

            const nextGame =
                this.getCurrentGame(
                    session
                );

            if (!nextGame) {

                session.fail(
                    "The next robbery game could not be found."
                );

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            /*
             * =========================
             * START NEXT GAME
             * =========================
             */

            try {

                await nextGame.start(
                    session
                );

            } catch (error) {

                session.fail(
                    "The next robbery game could not be started."
                );

                await this.cleanupSession(
                    session
                );

                throw error;
            }

            /*
             * Check expiry after the
             * next game starts.
             */

            if (
                session.isExpired
            ) {

                session.expire();

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            return "success";

        } finally {

            this.processingSessions.delete(
                session.id
            );
        }
    }

    /*
     * =========================
     * HANDLE COMPLETED GAME
     * =========================
     *
     * Used by games such as Police
     * Escape whose completion happens
     * outside submitAnswer().
     *
     * Police Escape calls
     * session.completeGame() when the
     * player reaches the exit.
     *
     * This method then starts the next
     * selected robbery game or attempts
     * to claim the robbery for the Robber
     * if the final game was completed.
     */

    async handleCompletedGame(
        session: RobberySession
    ): Promise<RobberyAnswerResult> {

        const stored =
            this.sessions.get(
                session.id
            );

        if (
            stored !== session
        ) {

            return "failed";
        }

        /*
         * =========================
         * VALIDATE SESSION
         * =========================
         */

        if (
            this.getSessionStatus(
                session
            ) !== "active"
        ) {

            await this.cleanupSession(
                session
            );

            return "failed";
        }

        /*
         * =========================
         * FINAL GAME WINNER
         * =========================
         *
         * Police Escape can complete the
         * final robbery game outside
         * submitAnswer().
         *
         * Finishing the game only means
         * the Robber can attempt to claim
         * the shared robbery outcome.
         */

        if (
            session.allGamesCompleted
        ) {

            const robberWon =
                session.tryClaimWinner(
                    "robber"
                );

            if (!robberWon) {

                /*
                 * Police already won the
                 * robbery, or the session is
                 * no longer eligible.
                 */

                await this.cleanupSession(
                    session
                );

                return "failed";
            }

            try {

                await this.economyAccountService.transferRobberyWinnings(
                    session.guildId,
                    session.targetId,
                    session.robberId
                );

                await this.robberyHeadquarters.assignRobber(
                    session.guildId,
                    session.robberId
                );

            } catch (error) {

                /*
                 * Do not leave a completed
                 * session or economy lock
                 * hanging if the payout or
                 * role assignment fails.
                 */

                await this.cleanupSession(
                    session
                );

                throw error;
            }

            await this.cleanupSession(
                session
            );

            return "success";
        }

        /*
         * The game should already have
         * advanced currentGameIndex.
         */

        const nextGame =
            this.getCurrentGame(
                session
            );

        if (!nextGame) {

            session.fail(
                "The next robbery game could not be found."
            );

            await this.cleanupSession(
                session
            );

            return "failed";
        }

        if (
            session.isExpired
        ) {

            session.expire();

            await this.cleanupSession(
                session
            );

            return "failed";
        }

        try {

            await nextGame.start(
                session
            );

        } catch (error) {

            session.fail(
                "The next robbery game could not be started."
            );

            await this.cleanupSession(
                session
            );

            throw error;
        }

        return "success";
    }

    /*
     * =========================
     * RESOLVE POLICE WIN
     * =========================
     *
     * The Police side claims the shared
     * RobberySession winner before calling
     * this method.
     *
     * This method only performs the
     * robber-side lifecycle cleanup.
     *
     * Police payout and jail remain owned
     * by EconomyAccountService and
     * RobberyHeadquarters respectively.
     */

    async resolvePoliceWin(
        session: RobberySession
    ): Promise<boolean> {

        const stored =
            this.sessions.get(
                session.id
            );

        /*
         * Only the exact stored session may
         * be resolved. This prevents an old
         * session object from cleaning up a
         * newer session with the same ID.
         */

        if (
            stored !== session
        ) {

            return false;
        }

        /*
         * Police must already have won the
         * shared race before this cleanup
         * path can be used.
         */

        if (
            this.getSessionStatus(
                session
            ) !== "success" ||
            session.winner !== "police"
        ) {

            return false;
        }

        await this.cleanupSession(
            session
        );

        return true;
    }

    /*
     * =========================
     * EXPIRE ROBBERY
     * =========================
     */

    async expireRobbery(
        session: RobberySession
    ): Promise<boolean> {

        const stored =
            this.sessions.get(
                session.id
            );

        if (
            stored !== session
        ) {

            return false;
        }

        if (
            this.getSessionStatus(
                session
            ) === "active"
        ) {

            session.expire();
        }

        await this.cleanupSession(
            session
        );

        return true;
    }

    /*
     * =========================
     * CANCEL ROBBERY
     * =========================
     */

    async cancelRobbery(
        session: RobberySession,
        reason =
            "The robbery was cancelled."
    ): Promise<void> {

        if (
            this.getSessionStatus(
                session
            ) === "active"
        ) {

            session.fail(
                reason
            );
        }

        await this.cleanupSession(
            session
        );
    }

    /*
     * =========================
     * SCHEDULE EXPIRY
     * =========================
     */

    private scheduleExpiry(
        session: RobberySession
    ): void {

        this.clearExpiryTimer(
            session.id
        );

        const delay =
            Math.max(
                0,
                session.expiresAt -
                    Date.now()
            );

        const timer =
            setTimeout(
                () => {
                    void this.handleSessionExpiry(
                        session
                    );
                },
                delay
            );

        this.expiryTimers.set(
            session.id,
            timer
        );
    }

    /*
     * =========================
     * HANDLE EXPIRY
     * =========================
     */

    private async handleSessionExpiry(
        session: RobberySession
    ): Promise<void> {

        const current =
            this.sessions.get(
                session.id
            );

        /*
         * Ignore timers belonging to
         * already-cleaned sessions.
         */

        if (
            current !== session
        ) {

            this.clearExpiryTimer(
                session.id
            );

            return;
        }

        const status =
            this.getSessionStatus(
                session
            );

        /*
         * Already completed or failed.
         */

        if (
            status !== "active"
        ) {

            await this.cleanupSession(
                session
            );

            return;
        }

        /*
         * Mark expired first.
         */

        session.expire();

        await this.cleanupSession(
            session
        );
    }

    /*
     * =========================
     * CLEAR EXPIRY TIMER
     * =========================
     */

    private clearExpiryTimer(
        sessionId: string
    ): void {

        const timer =
            this.expiryTimers.get(
                sessionId
            );

        if (!timer) {
            return;
        }

        clearTimeout(
            timer
        );

        this.expiryTimers.delete(
            sessionId
        );
    }

    /*
     * =========================
     * CLEANUP SESSION
     * =========================
     *
     * Cleanup is responsible for releasing
     * the economy lock owned by this robbery.
     *
     * The EconomyAccountService release is
     * session-owned, so an old session cannot
     * accidentally release a newer robbery's
     * lock.
     */

    private async cleanupSession(
        session: RobberySession
    ): Promise<void> {

        this.clearExpiryTimer(
            session.id
        );

        this.processingSessions.delete(
            session.id
        );

        /*
         * Clean game-specific state
         * before removing the session.
         */

        await this.gameManager.cancelSession(
            session
        );

        /*
         * Release the robbery economy lock.
         *
         * This is intentionally done using
         * the exact session ID.
         *
         * If another robbery has already
         * acquired a newer lock for the same
         * victim, the conditional release
         * will affect zero rows and leave the
         * newer lock untouched.
         */

        await this.economyAccountService.releaseRobberyLock(
            session.guildId,
            session.targetId,
            session.id
        );

        /*
         * Only remove the exact stored
         * session.
         */

        if (
            this.sessions.get(
                session.id
            ) === session
        ) {

            this.sessions.delete(
                session.id
            );
        }

        this.selectedGames.delete(
            session.id
        );
    }

    /*
     * =========================
     * ACTIVE SESSION COUNT
     * =========================
     */

    getActiveSessionCount(): number {

        return this.sessions.size;
    }

}

END FILE: src/plugins/robbery/core/RobberyManager.ts
================================================================================

FILE: src/plugins/robbery/core/RobberyQuestionBank.ts
--------------------------------------------------------------------------------
Original size: 19838 bytes
Exported size: 19064 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

export type RobberyQuestionDifficulty =
    | "easy"
    | "medium"
    | "hard"
    | "extreme";

export interface RobberyQuestion {
    id: string;
    question: string;
    answer: string;
}

export const ROBBERY_QUESTIONS: Record<
    RobberyQuestionDifficulty,
    RobberyQuestion[]
> = {

    /*
     * =========================
     * EASY
     * =========================
     */

    easy: [

        {
            id: "easy-01",
            question: "What number comes next: 2, 4, 6, 8, ?",
            answer: "10"
        },

        {
            id: "easy-02",
            question: "What number comes next: 5, 10, 15, 20, ?",
            answer: "25"
        },

        {
            id: "easy-03",
            question: "What number comes next: 1, 2, 4, 8, ?",
            answer: "16"
        },

        {
            id: "easy-04",
            question: "What is 12 + 8?",
            answer: "20"
        },

        {
            id: "easy-05",
            question: "What is 30 - 12?",
            answer: "18"
        },

        {
            id: "easy-06",
            question: "What is 6 × 4?",
            answer: "24"
        },

        {
            id: "easy-07",
            question: "What is 36 ÷ 6?",
            answer: "6"
        },

        {
            id: "easy-08",
            question: "A vault has 3 locks. You open 1. How many remain locked?",
            answer: "2"
        },

        {
            id: "easy-09",
            question: "What number comes next: 10, 20, 30, 40, ?",
            answer: "50"
        },

        {
            id: "easy-10",
            question: "What is half of 50?",
            answer: "25"
        },

        {
            id: "easy-11",
            question: "What is double 15?",
            answer: "30"
        },

        {
            id: "easy-12",
            question: "How many sides does a triangle have?",
            answer: "3"
        },

        {
            id: "easy-13",
            question: "How many sides does a square have?",
            answer: "4"
        },

        {
            id: "easy-14",
            question: "What number comes before 100?",
            answer: "99"
        },

        {
            id: "easy-15",
            question: "What is 7 + 13?",
            answer: "20"
        },

        {
            id: "easy-16",
            question: "What is 50 - 25?",
            answer: "25"
        },

        {
            id: "easy-17",
            question: "What is 5 × 5?",
            answer: "25"
        },

        {
            id: "easy-18",
            question: "What is 81 ÷ 9?",
            answer: "9"
        },

        {
            id: "easy-19",
            question: "What number comes next: 3, 6, 9, 12, ?",
            answer: "15"
        },

        {
            id: "easy-20",
            question: "What number comes next: 20, 18, 16, 14, ?",
            answer: "12"
        },

        {
            id: "easy-21",
            question: "A guard has 10 keys and loses 3. How many keys remain?",
            answer: "7"
        },

        {
            id: "easy-22",
            question: "What is 100 ÷ 10?",
            answer: "10"
        },

        {
            id: "easy-23",
            question: "What is 9 + 9?",
            answer: "18"
        },

        {
            id: "easy-24",
            question: "What is 40 - 17?",
            answer: "23"
        },

        {
            id: "easy-25",
            question: "What is 8 × 3?",
            answer: "24"
        },

        {
            id: "easy-26",
            question: "What is 49 ÷ 7?",
            answer: "7"
        },

        {
            id: "easy-27",
            question: "What number comes next: 1, 3, 5, 7, ?",
            answer: "9"
        },

        {
            id: "easy-28",
            question: "What number comes next: 2, 5, 8, 11, ?",
            answer: "14"
        },

        {
            id: "easy-29",
            question: "A robbery takes 5 minutes and starts at 10:00. When does it end?",
            answer: "10:05"
        },

        {
            id: "easy-30",
            question: "How many minutes are in one hour?",
            answer: "60"
        }
    ],

    /*
     * =========================
     * MEDIUM
     * =========================
     */

    medium: [

        {
            id: "medium-01",
            question: "What number comes next: 3, 6, 12, 24, ?",
            answer: "48"
        },

        {
            id: "medium-02",
            question: "What number comes next: 2, 6, 12, 20, ?",
            answer: "30"
        },

        {
            id: "medium-03",
            question: "What is 15% of 200?",
            answer: "30"
        },

        {
            id: "medium-04",
            question: "A safe contains 48 coins. You remove one quarter. How many coins remain?",
            answer: "36"
        },

        {
            id: "medium-05",
            question: "What number comes next: 100, 90, 81, 73, ?",
            answer: "66"
        },

        {
            id: "medium-06",
            question: "What is 17 × 3?",
            answer: "51"
        },

        {
            id: "medium-07",
            question: "What is 144 ÷ 12?",
            answer: "12"
        },

        {
            id: "medium-08",
            question: "A guard walks 5 meters every second. How far does he walk in 12 seconds?",
            answer: "60"
        },

        {
            id: "medium-09",
            question: "What number comes next: 1, 4, 9, 16, ?",
            answer: "25"
        },

        {
            id: "medium-10",
            question: "What is 25 × 4 - 10?",
            answer: "90"
        },

        {
            id: "medium-11",
            question: "A code has 3 digits. Each digit can be 0–9. How many choices are there for the first digit?",
            answer: "10"
        },

        {
            id: "medium-12",
            question: "What is 75% of 80?",
            answer: "60"
        },

        {
            id: "medium-13",
            question: "What number comes next: 5, 11, 23, 47, ?",
            answer: "95"
        },

        {
            id: "medium-14",
            question: "A room has 4 cameras. Each camera watches 3 doors. How many camera-door connections are there?",
            answer: "12"
        },

        {
            id: "medium-15",
            question: "What is 18²?",
            answer: "324"
        },

        {
            id: "medium-16",
            question: "A guard patrols every 8 minutes. How many patrols occur in 40 minutes?",
            answer: "5"
        },

        {
            id: "medium-17",
            question: "What number comes next: 64, 32, 16, 8, ?",
            answer: "4"
        },

        {
            id: "medium-18",
            question: "If a lock requires 4 correct symbols and there are 6 symbols available, how many symbols are not used?",
            answer: "2"
        },

        {
            id: "medium-19",
            question: "What is 250 - 75 - 25?",
            answer: "150"
        },

        {
            id: "medium-20",
            question: "A thief has 120 seconds. He spends 35 seconds on a door and 45 seconds on a camera. How many seconds remain?",
            answer: "40"
        },

        {
            id: "medium-21",
            question: "What number comes next: 7, 14, 28, 56, ?",
            answer: "112"
        },

        {
            id: "medium-22",
            question: "What is the average of 10, 20, and 30?",
            answer: "20"
        },

        {
            id: "medium-23",
            question: "A vault has 5 rows of 8 lockers. How many lockers are there?",
            answer: "40"
        },

        {
            id: "medium-24",
            question: "What is 13 × 7?",
            answer: "91"
        },

        {
            id: "medium-25",
            question: "What number comes next: 81, 27, 9, 3, ?",
            answer: "1"
        },

        {
            id: "medium-26",
            question: "A code begins with 2 and increases by 5 each time. What is the fourth number?",
            answer: "17"
        },

        {
            id: "medium-27",
            question: "What is 20% of 350?",
            answer: "70"
        },

        {
            id: "medium-28",
            question: "A guard takes 90 seconds to complete a patrol. How many seconds are needed for 4 patrols?",
            answer: "360"
        },

        {
            id: "medium-29",
            question: "What number comes next: 4, 9, 19, 39, ?",
            answer: "79"
        },

        {
            id: "medium-30",
            question: "A thief has 500 Nickel and spends 175. How much remains?",
            answer: "325"
        }
    ],

    /*
     * =========================
     * HARD
     * =========================
     */

    hard: [

        {
            id: "hard-01",
            question: "What number comes next: 2, 6, 18, 54, ?",
            answer: "162"
        },

        {
            id: "hard-02",
            question: "What number comes next: 1, 1, 2, 3, 5, 8, ?",
            answer: "13"
        },

        {
            id: "hard-03",
            question: "What is 17² - 10²?",
            answer: "189"
        },

        {
            id: "hard-04",
            question: "A code has 4 digits. Each digit is from 1 to 5. How many possible codes exist?",
            answer: "625"
        },

        {
            id: "hard-05",
            question: "What number comes next: 3, 8, 18, 38, 78, ?",
            answer: "158"
        },

        {
            id: "hard-06",
            question: "A guard walks 7 meters every 3 seconds. How far does he walk in 30 seconds?",
            answer: "70"
        },

        {
            id: "hard-07",
            question: "What is 12% of 450?",
            answer: "54"
        },

        {
            id: "hard-08",
            question: "What number comes next: 4, 7, 13, 25, 49, ?",
            answer: "97"
        },

        {
            id: "hard-09",
            question: "A vault requires 3 different keys chosen from 7 keys. How many possible groups are there?",
            answer: "35"
        },

        {
            id: "hard-10",
            question: "What is 15 × 16 - 24?",
            answer: "216"
        },

        {
            id: "hard-11",
            question: "What number comes next: 100, 96, 88, 76, 60, ?",
            answer: "40"
        },

        {
            id: "hard-12",
            question: "A patrol happens every 7 minutes. The first patrol is at 21:00. When is the sixth patrol?",
            answer: "21:35"
        },

        {
            id: "hard-13",
            question: "What is 3³ + 4³?",
            answer: "91"
        },

        {
            id: "hard-14",
            question: "A code contains 2 letters followed by 2 digits. Using 26 letters and 10 digits, how many combinations are possible?",
            answer: "67600"
        },

        {
            id: "hard-15",
            question: "What number comes next: 2, 5, 11, 23, 47, ?",
            answer: "95"
        },

        {
            id: "hard-16",
            question: "A thief travels 120 meters at 8 meters per second. How many seconds does it take?",
            answer: "15"
        },

        {
            id: "hard-17",
            question: "What is the smallest positive number divisible by both 6 and 8?",
            answer: "24"
        },

        {
            id: "hard-18",
            question: "What number comes next: 121, 144, 169, 196, ?",
            answer: "225"
        },

        {
            id: "hard-19",
            question: "A vault has 3 independent locks. Each has a 1 in 2 chance of being correctly bypassed. What is the probability of bypassing all three?",
            answer: "1/8"
        },

        {
            id: "hard-20",
            question: "What is 999 - 27 × 3?",
            answer: "918"
        },

        {
            id: "hard-21",
            question: "A code sequence is 2, 4, 8, 14, 22, ?. What comes next?",
            answer: "32"
        },

        {
            id: "hard-22",
            question: "What is the greatest common divisor of 84 and 126?",
            answer: "42"
        },

        {
            id: "hard-23",
            question: "A guard moves 12 meters north, then 5 meters east. What is the straight-line distance from the starting point?",
            answer: "13"
        },

        {
            id: "hard-24",
            question: "What number comes next: 5, 10, 20, 40, 80, ?",
            answer: "160"
        },

        {
            id: "hard-25",
            question: "A 4-digit code uses digits 1, 2, 3, and 4 exactly once. How many different codes are possible?",
            answer: "24"
        },

        {
            id: "hard-26",
            question: "What is 45% of 240?",
            answer: "108"
        },

        {
            id: "hard-27",
            question: "A timer starts at 240 seconds and loses 15 seconds every minute. How much time remains after 4 minutes?",
            answer: "180"
        },

        {
            id: "hard-28",
            question: "What number comes next: 6, 13, 27, 55, ?",
            answer: "111"
        },

        {
            id: "hard-29",
            question: "A safe has 8 switches. Exactly 3 must be ON. How many possible sets of switches are there?",
            answer: "56"
        },

        {
            id: "hard-30",
            question: "What is the square root of 529?",
            answer: "23"
        }
    ],

    /*
     * =========================
     * EXTREME
     * =========================
     */

    extreme: [

        {
            id: "extreme-01",
            question: "What number comes next: 1, 2, 6, 24, 120, ?",
            answer: "720"
        },

        {
            id: "extreme-02",
            question: "What number comes next: 2, 3, 5, 9, 17, 33, ?",
            answer: "65"
        },

        {
            id: "extreme-03",
            question: "What is 19² - 11²?",
            answer: "240"
        },

        {
            id: "extreme-04",
            question: "A code uses 5 different digits selected from 0–9. How many ordered codes are possible?",
            answer: "30240"
        },

        {
            id: "extreme-05",
            question: "What number comes next: 3, 7, 15, 31, 63, ?",
            answer: "127"
        },

        {
            id: "extreme-06",
            question: "A vault has 10 switches and exactly 4 must be ON. How many possible configurations exist?",
            answer: "210"
        },

        {
            id: "extreme-07",
            question: "What is the least common multiple of 18 and 24?",
            answer: "72"
        },

        {
            id: "extreme-08",
            question: "What number comes next: 2, 12, 36, 80, 150, ?",
            answer: "252"
        },

        {
            id: "extreme-09",
            question: "A code has 6 positions. Each position can contain one of 4 symbols. How many codes are possible?",
            answer: "4096"
        },

        {
            id: "extreme-10",
            question: "What is 2⁸ + 3⁴?",
            answer: "337"
        },

        {
            id: "extreme-11",
            question: "A guard patrols every 9 minutes and another every 12 minutes. If both patrol at 20:00, when will they next patrol together?",
            answer: "20:36"
        },

        {
            id: "extreme-12",
            question: "What number comes next: 4, 9, 19, 39, 79, ?",
            answer: "159"
        },

        {
            id: "extreme-13",
            question: "A thief has 5 keys and exactly 2 open the vault. If two different keys are chosen at random, how many possible pairs exist?",
            answer: "10"
        },

        {
            id: "extreme-14",
            question: "What is 9999 ÷ 3?",
            answer: "3333"
        },

        {
            id: "extreme-15",
            question: "What number comes next: 1, 4, 10, 22, 46, ?",
            answer: "94"
        },

        {
            id: "extreme-16",
            question: "A security system has 3 independent alarms. Each has a 10% chance of triggering. What is the probability that none trigger?",
            answer: "72.9%"
        },

        {
            id: "extreme-17",
            question: "What is the greatest common divisor of 252 and 198?",
            answer: "18"
        },

        {
            id: "extreme-18",
            question: "A 5-digit code uses digits 1–5 exactly once. How many possible codes begin with an odd digit?",
            answer: "72"
        },

        {
            id: "extreme-19",
            question: "What number comes next: 5, 14, 41, 122, 365, ?",
            answer: "1094"
        },

        {
            id: "extreme-20",
            question: "A vault opens only if exactly 3 of 5 switches are ON. How many valid switch configurations exist?",
            answer: "10"
        },

        {
            id: "extreme-21",
            question: "What is the smallest positive integer that is divisible by 12, 15, and 20?",
            answer: "60"
        },

        {
            id: "extreme-22",
            question: "What number comes next: 2, 6, 12, 20, 30, 42, ?",
            answer: "56"
        },

        {
            id: "extreme-23",
            question: "A 6-digit code may use digits 0–9, but no digit may repeat. How many possible codes exist if the first digit cannot be zero?",
            answer: "136080"
        },

        {
            id: "extreme-24",
            question: "What is 17³?",
            answer: "4913"
        },

        {
            id: "extreme-25",
            question: "Three guards patrol every 6, 8, and 10 minutes. If they meet at 18:00, when do they next meet?",
            answer: "19:00"
        },

        {
            id: "extreme-26",
            question: "What number comes next: 7, 15, 31, 63, 127, ?",
            answer: "255"
        },

        {
            id: "extreme-27",
            question: "A safe contains 12 switches. Exactly 5 must be ON. How many possible configurations exist?",
            answer: "792"
        },

        {
            id: "extreme-28",
            question: "What is the remainder when 9876 is divided by 37?",
            answer: "14"
        },

        {
            id: "extreme-29",
            question: "A robbery route has 8 checkpoints. The thief must visit exactly 4 of them in order. How many possible ordered routes exist?",
            answer: "1680"
        },

        {
            id: "extreme-30",
            question: "What is the smallest number greater than 100 that is divisible by both 7 and 9?",
            answer: "126"
        }
    ]
};


END FILE: src/plugins/robbery/core/RobberyQuestionBank.ts
================================================================================

FILE: src/plugins/robbery/core/RobberyQuestionManager.ts
--------------------------------------------------------------------------------
Original size: 4791 bytes
Exported size: 4554 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ROBBERY_QUESTIONS,
    RobberyQuestion,
    RobberyQuestionDifficulty
} from "./RobberyQuestionBank.js";

export class RobberyQuestionManager {

    /*
     * =========================
     * GET QUESTION POOL
     * =========================
     *
     * Returns a copy of the
     * requested difficulty pool.
     *
     * The original question bank
     * is never exposed for mutation.
     */

    getPool(
        difficulty: RobberyQuestionDifficulty
    ): RobberyQuestion[] {

        const pool =
            ROBBERY_QUESTIONS[difficulty];

        if (
            !pool ||
            pool.length === 0
        ) {
            return [];
        }

        return [
            ...pool
        ];
    }

    /*
     * =========================
     * GET RANDOM QUESTIONS
     * =========================
     *
     * Returns unique questions
     * from the requested difficulty.
     *
     * Questions are selected without
     * replacement, so the same question
     * cannot appear twice in one call.
     */

    getRandomQuestions(
        difficulty: RobberyQuestionDifficulty,
        count: number
    ): RobberyQuestion[] {

        if (
            !Number.isFinite(count) ||
            count <= 0
        ) {
            return [];
        }

        const pool =
            this.getPool(
                difficulty
            );

        if (
            pool.length === 0
        ) {
            return [];
        }

        /*
         * If the requested amount is
         * larger than the available
         * pool, return every question
         * in randomized order.
         */

        const amount =
            Math.min(
                Math.floor(count),
                pool.length
            );

        return this.shuffle(
            pool
        ).slice(
            0,
            amount
        );
    }

    /*
     * =========================
     * GET RANDOM QUESTION
     * =========================
     *
     * Returns one random question
     * from the requested difficulty.
     */

    getRandomQuestion(
        difficulty: RobberyQuestionDifficulty
    ): RobberyQuestion | undefined {

        const pool =
            ROBBERY_QUESTIONS[
                difficulty
            ];

        if (
            !pool ||
            pool.length === 0
        ) {
            return undefined;
        }

        const index =
            Math.floor(
                Math.random() *
                pool.length
            );

        return pool[index];
    }

    /*
     * =========================
     * FIND QUESTION BY ID
     * =========================
     *
     * Searches every difficulty
     * for the requested question.
     */

    getById(
        id: string
    ): RobberyQuestion | undefined {

        if (
            !id.trim()
        ) {
            return undefined;
        }

        for (
            const difficulty
            of Object.keys(
                ROBBERY_QUESTIONS
            ) as RobberyQuestionDifficulty[]
        ) {

            const pool =
                ROBBERY_QUESTIONS[
                    difficulty
                ];

            const question =
                pool.find(
                    candidate =>
                        candidate.id === id
                );

            if (
                question
            ) {
                return question;
            }
        }

        return undefined;
    }

    /*
     * =========================
     * GET QUESTION COUNT
     * =========================
     */

    getCount(
        difficulty: RobberyQuestionDifficulty
    ): number {

        return (
            ROBBERY_QUESTIONS[
                difficulty
            ]?.length ?? 0
        );
    }

    /*
     * =========================
     * SHUFFLE
     * =========================
     *
     * Fisher-Yates shuffle.
     *
     * A new array is returned,
     * so the supplied array is
     * never modified.
     */

    private shuffle<T>(
        items: T[]
    ): T[] {

        const shuffled =
            [...items];

        for (
            let i =
                shuffled.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                shuffled[i],
                shuffled[j]
            ] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        return shuffled;
    }
}

END FILE: src/plugins/robbery/core/RobberyQuestionManager.ts
================================================================================

FILE: src/plugins/robbery/core/RobberySession.ts
--------------------------------------------------------------------------------
Original size: 8313 bytes
Exported size: 7886 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyQuestionDifficulty
} from "./RobberyQuestionBank.js";

import {
    RobberyConfig
} from "../config/RobberyConfig.js";

export type RobberyStatus =
    | "active"
    | "success"
    | "failed"
    | "expired";

export type RobberyWinner =
    | "robber"
    | "police";

export const ROBBERY_GAME_POOL = [
    "lock-combination",
    "colour-guess",
    "binary-decryption",
    "guess-character",
    "police-escape",
    
] as const;

export type RobberyGameId =
    typeof ROBBERY_GAME_POOL[number];

export const ROBBERY_DIFFICULTIES:
    RobberyQuestionDifficulty[] = [
        "easy",
        "medium",
        "hard",
        "extreme"
    ];

export class RobberySession {

    public readonly id: string;

    public readonly guildId: string;

    public readonly robberId: string;

    public readonly targetId: string;

    public readonly startedAt: number;

    public readonly expiresAt: number;

    public readonly selectedGames: RobberyGameId[];

    public readonly difficulty:
        RobberyQuestionDifficulty;

    public status: RobberyStatus =
        "active";

    public winner:
        RobberyWinner | null =
        null;

    public currentGameIndex = 0;

    public completedGames = 0;

    public failureReason:
        string | null = null;

    constructor(
        guildId: string,
        robberId: string,
        targetId: string,
        durationMs: number
    ) {

        this.id =
            `${guildId}-${robberId}-${Date.now()}`;

        this.guildId =
            guildId;

        this.robberId =
            robberId;

        this.targetId =
            targetId;

        this.startedAt =
            Date.now();

        this.expiresAt =
            this.startedAt +
            durationMs;

        /*
         * =========================
         * SELECT RANDOM DIFFICULTY
         * =========================
         *
         * Every robbery receives
         * one random difficulty.
         *
         * The selected difficulty
         * determines which question
         * pool is used.
         */

        this.difficulty =
            this.selectRandomDifficulty();

        /*
         * =========================
         * SELECT RANDOM GAMES
         * =========================
         *
         * The number of games is
         * controlled centrally by
         * RobberyConfig.gamesPerRobbery.
         *
         * Games are always unique.
         */

        this.selectedGames =
            this.selectRandomGames();
    }

    /*
     * =========================
     * TIMER
     * =========================
     */

    get remainingMs(): number {

        return Math.max(
            0,
            this.expiresAt -
            Date.now()
        );
    }

    get isExpired(): boolean {

        return (
            this.status === "active" &&
            this.remainingMs <= 0
        );
    }

    /*
     * =========================
     * GAME STATE
     * =========================
     */

    get currentGameId():
        RobberyGameId | null {

        return (
            this.selectedGames[
                this.currentGameIndex
            ] ?? null
        );
    }

    get currentGameNumber(): number {

        return (
            this.currentGameIndex + 1
        );
    }

    get totalGames(): number {

        return this.selectedGames.length;
    }

    get allGamesCompleted(): boolean {

        return (
            this.completedGames >=
            this.selectedGames.length
        );
    }

    /*
     * =========================
     * RANDOM DIFFICULTY
     * =========================
     */

    private selectRandomDifficulty():
        RobberyQuestionDifficulty {

        return ROBBERY_DIFFICULTIES[
            Math.floor(
                Math.random() *
                ROBBERY_DIFFICULTIES.length
            )
        ];
    }

    /*
     * =========================
     * RANDOM GAME SELECTION
     * =========================
     */

    private selectRandomGames():
        RobberyGameId[] {

        const shuffled =
            [...ROBBERY_GAME_POOL];

        /*
         * Fisher-Yates shuffle.
         */

        for (
            let i =
                shuffled.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                shuffled[i],
                shuffled[j]
            ] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        /*
         * RobberyConfig is the
         * single source of truth
         * for the number of games.
         */

        return shuffled.slice(
            0,
            Math.min(
                RobberyConfig.gamesPerRobbery,
                shuffled.length
            )
        );
    }

    /*
     * =========================
     * COMPLETE GAME
     * =========================
     *
     * Completing a game only advances
     * the player's robbery progress.
     *
     * It does NOT automatically declare
     * the robbery successful.
     *
     * The final-game winner must first
     * be claimed through tryClaimWinner().
     */

    completeGame(): void {

        if (
            this.status !== "active"
        ) {
            return;
        }

        if (
            this.allGamesCompleted
        ) {
            return;
        }

        this.completedGames++;

        this.currentGameIndex++;
    }

    /*
     * =========================
     * CLAIM WINNER
     * =========================
     *
     * The Robber and Police both use
     * this method when they successfully
     * complete their required games.
     *
     * The first successful call claims
     * the robbery.
     *
     * This method intentionally performs
     * the winner check and assignment
     * synchronously, before either side
     * performs any asynchronous payout
     * or cleanup work.
     */

    tryClaimWinner(
        winner: RobberyWinner
    ): boolean {

        if (
            this.status !== "active"
        ) {
            return false;
        }

        if (
            this.winner !== null
        ) {
            return false;
        }

        if (
            this.isExpired
        ) {
            return false;
        }

        if (
            !this.allGamesCompleted
        ) {
            return false;
        }

        this.winner =
            winner;

        this.status =
            "success";

        return true;
    }

    /*
     * =========================
     * FAIL
     * =========================
     */

    fail(
        reason: string
    ): void {

        if (
            this.status !== "active"
        ) {
            return;
        }

        this.status =
            "failed";

        this.failureReason =
            reason;
    }

    /*
     * =========================
     * SUCCESS
     * =========================
     *
     * Kept as a controlled session
     * success method for compatibility.
     *
     * Winner assignment must still be
     * performed through tryClaimWinner().
     */

    succeed(): void {

        if (
            this.status !== "active"
        ) {
            return;
        }

        if (
            this.winner === null
        ) {
            return;
        }

        if (
            !this.allGamesCompleted
        ) {
            return;
        }

        this.status =
            "success";
    }

    /*
     * =========================
     * EXPIRE
     * =========================
     */

    expire(): void {

        if (
            this.status !== "active"
        ) {
            return;
        }

        this.status =
            "expired";

        this.failureReason =
            "The robbery timer expired.";
    }
}

END FILE: src/plugins/robbery/core/RobberySession.ts
================================================================================

FILE: src/plugins/robbery/core/RobberySessionManager.ts
--------------------------------------------------------------------------------
Original size: 7262 bytes
Exported size: 6919 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import { RobberySession } from "./RobberySession.js";

export class RobberySessionManager {

    /*
     * =========================
     * SESSION STORAGE
     * =========================
     *
     * All active and recently
     * completed robbery sessions
     * are kept in memory.
     *
     * The session ID is the primary
     * lookup key.
     */

    private readonly sessions =
        new Map<string, RobberySession>();

    /*
     * =========================
     * CREATE
     * =========================
     */

    create(
        guildId: string,
        robberId: string,
        targetId: string,
        durationMs: number
    ): RobberySession {

        const session =
            new RobberySession(
                guildId,
                robberId,
                targetId,
                durationMs
            );

        this.sessions.set(
            session.id,
            session
        );

        /*
         * =========================
         * AUTOMATIC EXPIRATION
         * =========================
         *
         * The session already knows
         * its exact expiration time.
         *
         * Schedule the expiration so
         * the robbery ends automatically
         * when the timer reaches zero,
         * even if the robber does nothing.
         *
         * The session/status checks
         * protect against a timer firing
         * after the session was already
         * completed, failed or removed.
         */

        setTimeout(
            () => {

                const activeSession =
                    this.sessions.get(
                        session.id
                    );

                if (
                    activeSession !==
                    session
                ) {
                    return;
                }

                if (
                    session.status !==
                    "active"
                ) {
                    return;
                }

                if (
                    !session.isExpired
                ) {
                    return;
                }

                session.expire();

                this.sessions.delete(
                    session.id
                );
            },
            Math.max(
                0,
                session.remainingMs
            )
        );

        return session;
    }

    /*
     * =========================
     * GET
     * =========================
     */

    get(
        sessionId: string
    ): RobberySession | undefined {

        return this.sessions.get(
            sessionId
        );
    }

    /*
     * =========================
     * FIND ROBBER SESSION
     * =========================
     *
     * Returns the active robbery
     * currently being attempted by
     * this robber in this guild.
     *
     * This prevents a member from
     * running multiple robberies at
     * the same time.
     */

    findByRobber(
        guildId: string,
        robberId: string
    ): RobberySession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.status !== "active"
            ) {
                continue;
            }

            if (
                session.guildId !== guildId
            ) {
                continue;
            }

            if (
                session.robberId !== robberId
            ) {
                continue;
            }

            return session;
        }

        return undefined;
    }

    /*
     * =========================
     * FIND TARGET SESSION
     * =========================
     *
     * Returns the active robbery
     * currently targeting this member.
     *
     * This prevents multiple robbers
     * from simultaneously targeting
     * the same victim.
     */

    findByTarget(
        guildId: string,
        targetId: string
    ): RobberySession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.status !== "active"
            ) {
                continue;
            }

            if (
                session.guildId !== guildId
            ) {
                continue;
            }

            if (
                session.targetId !== targetId
            ) {
                continue;
            }

            return session;
        }

        return undefined;
    }

    /*
     * =========================
     * DELETE
     * =========================
     *
     * Immediately removes a
     * session from memory.
     *
     * The scheduled expiration timer
     * will safely do nothing if it fires
     * after this deletion.
     */

    delete(
        sessionId: string
    ): void {

        this.sessions.delete(
            sessionId
        );
    }

    /*
     * =========================
     * CLEANUP
     * =========================
     *
     * Removes completed, failed,
     * cancelled and expired sessions.
     *
     * Expired active sessions are
     * transitioned through the session
     * itself before being removed.
     */

    cleanup(): void {

        for (
            const [
                sessionId,
                session
            ]
            of this.sessions
        ) {

            /*
             * =========================
             * NON-ACTIVE SESSION
             * =========================
             */

            if (
                session.status !==
                "active"
            ) {

                this.sessions.delete(
                    sessionId
                );

                continue;
            }

            /*
             * =========================
             * EXPIRED SESSION
             * =========================
             */

            if (
                session.isExpired
            ) {

                session.expire();

                this.sessions.delete(
                    sessionId
                );
            }
        }
    }

    /*
     * =========================
     * ACTIVE SESSIONS
     * =========================
     *
     * Returns a snapshot of all
     * currently active robberies.
     */

    getActive(): RobberySession[] {

        return Array.from(
            this.sessions.values()
        ).filter(
            session =>
                session.status ===
                "active"
        );
    }

    /*
     * =========================
     * CLEAR
     * =========================
     *
     * Removes every in-memory
     * session.
     *
     * Useful during shutdown,
     * restart or controlled resets.
     *
     * Scheduled expiration callbacks
     * are safe because they verify that
     * their session is still registered
     * before doing anything.
     */

    clear(): void {

        this.sessions.clear();
    }
}


END FILE: src/plugins/robbery/core/RobberySessionManager.ts
================================================================================

FILE: src/plugins/robbery/events/RobberyInteraction.ts
--------------------------------------------------------------------------------
Original size: 91615 bytes
Exported size: 88098 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Events,
    Interaction,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { BotClient } from "../../../core/client/BotClient.js";

import { RobberyManager } from "../core/RobberyManager.js";
import { RobberySession } from "../core/RobberySession.js";

import {
    PoliceEscapeDirection
} from "../core/PoliceEscapeMaze.js";

const POLICE_ESCAPE_PREFIX =
    "robbery:police-escape:";

const POLICE_ESCAPE_ANSWER_BUTTON_PREFIX =
    "robbery:police-escape-answer:";

const SESSION_EXPIRY_GRACE_MS =
    250;

const CHANNEL_DELETE_DELAY_MS =
    5_000;

const INTERACTION_MESSAGES = {

    SYSTEM_UNAVAILABLE:
        "❌ The robbery system is temporarily unavailable.",

    SESSION_NOT_FOUND:
        "❌ This robbery session is no longer active.",

    NOT_ROBBER:
        "❌ You are not the robber in this robbery.",

    EXPIRED:
        "⏱️ The robbery timer has expired.",

    PROCESSING_ERROR:
        "❌ The answer could not be processed."

};

/*
 * =========================================================
 * POLICE ESCAPE TYPES
 * =========================================================
 */

type PoliceEscapeMoveResult =
    | {
          type: "blocked";
          message: string;
      }
    | {
          type: "moved";
          message: string;
      }
    | {
          type: "question";
          message: string;
      }
    | {
          type: "bomb";
          message: string;
      }
    | {
          type: "exit";
          message: string;
      }
    | {
          type: "failed";
          message: string;
      };

interface PoliceEscapeInteractionGame {

    move(
        session: RobberySession,
        direction: PoliceEscapeDirection
    ): PoliceEscapeMoveResult;

    getCurrentQuestion(
        sessionId: string
    ): {
        id: string;
        question: string;
        answer: string;
    } | null;

    getRenderedMaze(
        sessionId: string
    ): Promise<Buffer | null>;

    getMoves(
        sessionId: string
    ): number;

    getQuestionsAnswered(
        sessionId: string
    ): number;

    getLastAnswerCorrect(
        sessionId: string
    ): boolean | null;

    getLevel(
        sessionId: string
    ): number | null;

    hasPendingBomb(
        sessionId: string
    ): boolean;

    handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<
        "success" |
        "failed"
    >;
}

/*
 * =========================================================
 * DISCORD LIFECYCLE TIMERS
 * =========================================================
 *
 * RobberyManager owns the authoritative session timer.
 *
 * RobberyInteraction owns the Discord channel lifecycle.
 *
 * The manager reference is captured when the Discord
 * expiry watcher is created, so expiry never needs to
 * reconstruct a manager from a Discord channel.
 */

const expiryTimers =
    new Map<
        string,
        ReturnType<typeof setTimeout>
    >();

const channelDeleteTimers =
    new Map<
        string,
        ReturnType<typeof setTimeout>
    >();

/*
 * =========================================================
 * STATUS HELPER
 * =========================================================
 *
 * Important TypeScript detail:
 *
 * validateSession() proves that a session is active at
 * that moment. Later methods such as expire(), fail(), and
 * completeGame() mutate the runtime status.
 *
 * Reading through this helper prevents TypeScript from
 * incorrectly retaining an old "active" narrowing.
 */

function getCurrentSessionStatus(
    session: RobberySession
): RobberySession["status"] {

    return session.status;
}

export default {

    name: Events.InteractionCreate,

    async execute(
        interaction: Interaction,
        client: BotClient
    ): Promise<void> {

        /*
         * =====================================================
         * BUTTON INTERACTIONS
         * =====================================================
         */

        if (interaction.isButton()) {

            /*
             * Police Escape Answer must be checked before
             * the generic Police Escape movement prefix.
             */

            if (
                interaction.customId.startsWith(
                    POLICE_ESCAPE_ANSWER_BUTTON_PREFIX
                )
            ) {

                await this.handlePoliceEscapeAnswerButton(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:lock:"
                )
            ) {

                await this.handleLockButton(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:colour:"
                )
            ) {

                await this.handleColourButton(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:binary:"
                )
            ) {

                await this.handleBinaryButton(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:guess-character:"
                )
            ) {

                await this.handleGuessCharacterButton(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    POLICE_ESCAPE_PREFIX
                )
            ) {

                await this.handlePoliceEscapeButton(
                    interaction,
                    client
                );

                return;
            }
        }

        /*
         * =====================================================
         * MODAL INTERACTIONS
         * =====================================================
         */

        if (interaction.isModalSubmit()) {

            if (
                interaction.customId.startsWith(
                    "robbery:lock-modal:"
                )
            ) {

                await this.handleLockModal(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:colour-modal:"
                )
            ) {

                await this.handleColourModal(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:binary-modal:"
                )
            ) {

                await this.handleBinaryModal(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:guess-character-modal:"
                )
            ) {

                await this.handleGuessCharacterModal(
                    interaction,
                    client
                );

                return;
            }

            if (
                interaction.customId.startsWith(
                    "robbery:police-escape-answer:"
                )
            ) {

                await this.handlePoliceEscapeAnswer(
                    interaction,
                    client
                );

                return;
            }
        }
    },

    /*
     * =========================================================
     * SESSION HELPERS
     * =========================================================
     */

    getRobberyManager(
        client: BotClient
    ): RobberyManager | null {

        return (
            client.services.get<RobberyManager>(
                "robberyManager"
            ) ?? null
        );
    },

    async replySystemUnavailable(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction
    ): Promise<void> {

        if (
            interaction.replied ||
            interaction.deferred
        ) {
            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.SYSTEM_UNAVAILABLE,
            ephemeral: true
        });
    },

    async replySessionUnavailable(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction
    ): Promise<void> {

        if (
            interaction.replied ||
            interaction.deferred
        ) {
            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.SESSION_NOT_FOUND,
            ephemeral: true
        });
    },

    async validateSession(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction,
        client: BotClient,
        prefix: string
    ): Promise<{
        manager: RobberyManager;
        session: RobberySession;
    } | null> {

        const manager =
            this.getRobberyManager(
                client
            );

        if (!manager) {

            await this.replySystemUnavailable(
                interaction
            );

            return null;
        }

        const sessionId =
            interaction.customId.substring(
                prefix.length
            );

        const session =
            manager.getSession(
                sessionId
            );

        if (!session) {

            await this.replySessionUnavailable(
                interaction
            );

            return null;
        }

        if (
            interaction.user.id !==
            session.robberId
        ) {

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.NOT_ROBBER,
                ephemeral: true
            });

            return null;
        }

        /*
         * The session owns the authoritative global timer.
         */

        if (
            session.isExpired
        ) {

            await manager.expireRobbery(
                session
            );

            this.scheduleChannelDelete(
                interaction.channel,
                session.id,
                "Robbery timer expired."
            );

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.EXPIRED,
                ephemeral: true
            });

            return null;
        }

        if (
            getCurrentSessionStatus(
                session
            ) !== "active"
        ) {

            await interaction.reply({
                content:
                    "❌ This robbery is no longer active.",
                ephemeral: true
            });

            return null;
        }

        return {
            manager,
            session
        };
    },

    /*
     * =========================================================
     * LIVE TIMER
     * =========================================================
     */

    getTimerText(
        session: RobberySession
    ): string {

        const expiresUnix =
            Math.floor(
                session.expiresAt / 1000
            );

        return (
            `⏱️ **Time Remaining:** ` +
            `<t:${expiresUnix}:R>`
        );
    },

    /*
     * =========================================================
     * CHANNEL EXPIRY
     * =========================================================
     */

    scheduleChannelExpiry(
        channel:
            | ButtonInteraction["channel"]
            | ModalSubmitInteraction["channel"]
            | null,
        session: RobberySession,
        manager: RobberyManager
    ): void {

        if (
            !channel ||
            !("send" in channel) ||
            !("delete" in channel)
        ) {
            return;
        }

        /*
         * Only one Discord-side expiry watcher per session.
         */

        if (
            expiryTimers.has(
                session.id
            )
        ) {
            return;
        }

        const delay =
            Math.max(
                0,
                session.expiresAt -
                    Date.now() +
                    SESSION_EXPIRY_GRACE_MS
            );

        const timer =
            setTimeout(
                async () => {

                    expiryTimers.delete(
                        session.id
                    );

                    /*
                     * The core manager is authoritative.
                     *
                     * The manager may already have expired
                     * and cleaned the session. expireRobbery()
                     * safely handles that situation.
                     */

                    try {

                        await manager.expireRobbery(
                            session
                        );

                    } catch {
                        /*
                         * If the manager cannot perform cleanup,
                         * still mark the captured session expired
                         * so the Discord channel can be closed.
                         */

                        if (
                            getCurrentSessionStatus(
                                session
                            ) === "active"
                        ) {

                            session.expire();
                        }
                    }

                    /*
                     * If the manager already cleaned the session,
                     * the captured session object still retains
                     * its final status.
                     */

                    if (
                        getCurrentSessionStatus(
                            session
                        ) !== "expired"
                    ) {
                        return;
                    }

                    try {

                        await channel.send({
                            content:
                                "⏱️ **ROBBERY EXPIRED**\n\n" +
                                "The global robbery timer has run out.\n" +
                                "🚨 **The robbery has failed.**"
                        });

                    } catch {
                        /*
                         * Channel may already be unavailable.
                         */
                    }

                    this.scheduleChannelDelete(
                        channel,
                        session.id,
                        "Robbery timer expired."
                    );
                },
                delay
            );

        expiryTimers.set(
            session.id,
            timer
        );
    },

    /*
     * =========================================================
     * CHANNEL DELETE
     * =========================================================
     */

    scheduleChannelDelete(
        channel:
            | ButtonInteraction["channel"]
            | ModalSubmitInteraction["channel"]
            | null,
        sessionId: string,
        reason: string
    ): void {

        if (
            !channel ||
            !("delete" in channel)
        ) {
            return;
        }

        /*
         * Deletion is intentionally idempotent.
         *
         * Once a deletion timer exists, another event does
         * not reset the five-second countdown.
         */

        if (
            channelDeleteTimers.has(
                sessionId
            )
        ) {
            return;
        }

        const timer =
            setTimeout(
                async () => {

                    channelDeleteTimers.delete(
                        sessionId
                    );

                    try {

                        await channel.delete(
                            reason
                        );

                    } catch {
                        /*
                         * Channel may already be gone,
                         * permissions may have changed,
                         * or Discord may reject the request.
                         */
                    }

                },
                CHANNEL_DELETE_DELAY_MS
            );

        channelDeleteTimers.set(
            sessionId,
            timer
        );
    },

    /*
     * =========================================================
     * GAME RESULT
     * =========================================================
     */

    async handleGameResult(
        interaction:
            | ModalSubmitInteraction
            | ButtonInteraction,
        client: BotClient,
        session: RobberySession,
        robberyManager: RobberyManager,
        result:
            | "success"
            | "failed",
        successMessage: string
    ): Promise<boolean> {

        const status =
            getCurrentSessionStatus(
                session
            );

        /*
         * =====================================================
         * FINAL SUCCESS
         * =====================================================
         */

        if (
            status ===
            "success"
        ) {

            /*
             * The shared session can be completed by either
             * the Robber or Police. Never assume "success"
             * means the Robber won.
             */

            if (
                session.winner ===
                "police"
            ) {

                await interaction.reply({
                    content:
                        "🚨 **ROBBERY STOPPED**\n\n" +
                        "👮 **The Police have stopped the robbery.**",
                    ephemeral: false
                });

                await this.finishChannel(
                    interaction,
                    "Robbery stopped by Police.",
                    session.id
                );

                return true;
            }

            if (
                session.winner ===
                "robber"
            ) {

                await interaction.reply({
                    content:
                        "🎉 **ROBBERY COMPLETED!**\n\n" +
                        "💰 **The vault has been cracked.**\n" +
                        "💎 **The robbery was successful!**",
                    ephemeral: false
                });

                await this.finishChannel(
                    interaction,
                    "Robbery completed successfully.",
                    session.id
                );

                return true;
            }

            /*
             * A successful session without a winner should
             * never normally occur because tryClaimWinner()
             * is responsible for final success.
             *
             * Do not allow the interaction to incorrectly
             * continue into another robbery stage.
             */

            await interaction.reply({
                content:
                    "❌ The robbery reached an invalid completed state.",
                ephemeral: true
            });

            return true;
        }

        /*
         * =====================================================
         * FINAL FAILURE
         * =====================================================
         */

        if (
            status === "failed" ||
            status === "expired"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "The robbery failed."
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed.",
                session.id
            );

            return true;
        }

        /*
         * =====================================================
         * STANDARD GAME SUCCESS
         * =====================================================
         */

        if (
            result ===
            "success"
        ) {

            await interaction.reply({
                content:
                    `${successMessage}\n\n` +
                    "🎮 **The next stage is starting...**",
                ephemeral: true
            });

            await this.sendCurrentGame(
                interaction,
                client,
                session,
                robberyManager
            );

            return true;
        }

        return false;
    },

    /*
     * =========================================================
     * LOCK BUTTON
     * =========================================================
     */

    async handleLockButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:lock:"
            );

        if (!validated) {
            return;
        }

        const {
            session
        } = validated;

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `robbery:lock-modal:${session.id}`
                )
                .setTitle(
                    "🔐 Lock Combination"
                );

        const combinationInput =
            new TextInputBuilder()
                .setCustomId(
                    "combination"
                )
                .setLabel(
                    "Enter the combination"
                )
                .setPlaceholder(
                    "Example: 3 10"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(30);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    combinationInput
                )
        );

        await interaction.showModal(
            modal
        );
    },

    /*
     * =========================================================
     * COLOUR BUTTON
     * =========================================================
     */

    async handleColourButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:colour:"
            );

        if (!validated) {
            return;
        }

        const {
            session
        } = validated;

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `robbery:colour-modal:${session.id}`
                )
                .setTitle(
                    "🎨 Guess the Colour"
                );

        const colourInput =
            new TextInputBuilder()
                .setCustomId(
                    "colour"
                )
                .setLabel(
                    "What colour is displayed?"
                )
                .setPlaceholder(
                    "Example: mediumvioletred"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(30);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    colourInput
                )
        );

        await interaction.showModal(
            modal
        );
    },

    /*
     * =========================================================
     * BINARY BUTTON
     * =========================================================
     */

    async handleBinaryButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:binary:"
            );

        if (!validated) {
            return;
        }

        const {
            session
        } = validated;

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `robbery:binary-modal:${session.id}`
                )
                .setTitle(
                    "💻 Binary Decryption"
                );

        const answerInput =
            new TextInputBuilder()
                .setCustomId(
                    "answer"
                )
                .setLabel(
                    "Decrypt the binary code"
                )
                .setPlaceholder(
                    "Enter the decoded word"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(30);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    answerInput
                )
        );

        await interaction.showModal(
            modal
        );
    },

    /*
     * =========================================================
     * GUESS CHARACTER BUTTON
     * =========================================================
     */

    async handleGuessCharacterButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:guess-character:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const currentGame =
            manager.getCurrentGame(
                session
            );

        if (
            !currentGame ||
            currentGame.id !==
                "guess-character"
        ) {

            await interaction.reply({
                content:
                    "❌ **Guess Character** is no longer the active game.",
                ephemeral: true
            });

            return;
        }

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `robbery:guess-character-modal:${session.id}`
                )
                .setTitle(
                    "🎭 Guess the Character"
                );

        const answerInput =
            new TextInputBuilder()
                .setCustomId(
                    "answer"
                )
                .setLabel(
                    "Who is the character?"
                )
                .setPlaceholder(
                    "Enter the character's name"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(100);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    answerInput
                )
        );

        await interaction.showModal(
            modal
        );
    },

    /*
     * =========================================================
     * POLICE ESCAPE MOVEMENT
     * =========================================================
     */

    async handlePoliceEscapeButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const value =
            interaction.customId.substring(
                POLICE_ESCAPE_PREFIX.length
            );

        const separatorIndex =
            value.indexOf(":");

        if (
            separatorIndex === -1
        ) {

            await interaction.reply({
                content:
                    "❌ Invalid Police Escape interaction.",
                ephemeral: true
            });

            return;
        }

        const direction =
            value.substring(
                0,
                separatorIndex
            ) as PoliceEscapeDirection;

        const sessionId =
            value.substring(
                separatorIndex + 1
            );

        const manager =
            this.getRobberyManager(
                client
            );

        if (!manager) {

            await this.replySystemUnavailable(
                interaction
            );

            return;
        }

        const session =
            manager.getSession(
                sessionId
            );

        if (!session) {

            await this.replySessionUnavailable(
                interaction
            );

            return;
        }

        if (
            interaction.user.id !==
            session.robberId
        ) {

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.NOT_ROBBER,
                ephemeral: true
            });

            return;
        }

        if (
            session.isExpired
        ) {

            await manager.expireRobbery(
                session
            );

            this.scheduleChannelDelete(
                interaction.channel,
                session.id,
                "Robbery timer expired."
            );

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.EXPIRED,
                ephemeral: true
            });

            return;
        }

        if (
            getCurrentSessionStatus(
                session
            ) !== "active"
        ) {

            await interaction.reply({
                content:
                    "❌ This robbery is no longer active.",
                ephemeral: true
            });

            return;
        }

        const currentGame =
            manager.getCurrentGame(
                session
            );

        if (
            !currentGame ||
            currentGame.id !==
                "police-escape"
        ) {

            await interaction.reply({
                content:
                    "❌ **Police Escape** is no longer the active game.",
                ephemeral: true
            });

            return;
        }

        const policeGame =
            currentGame as typeof currentGame &
                PoliceEscapeInteractionGame;

        const result =
            policeGame.move(
                session,
                direction
            );

        const statusAfterMove =
            getCurrentSessionStatus(
                session
            );

        /*
         * =====================================================
         * BLOCKED
         * =====================================================
         */

        if (
            result.type ===
            "blocked"
        ) {

            await interaction.reply({
                content:
                    `🚧 **Blocked**\n\n` +
                    `${result.message}\n\n` +
                    `${this.getTimerText(session)}`,
                ephemeral: true
            });

            return;
        }

        /*
         * =====================================================
         * QUESTION
         * =====================================================
         */

        if (
            result.type ===
            "question"
        ) {

            const question =
                policeGame.getCurrentQuestion(
                    session.id
                );

            if (!question) {

                await interaction.reply({
                    content:
                        "❌ The trivia question could not be loaded.",
                    ephemeral: true
                });

                return;
            }

            await this.showPoliceEscapeQuestion(
                interaction,
                session,
                question.question,
                false
            );

            return;
        }

        /*
         * =====================================================
         * HIDDEN BOMB
         * =====================================================
         */

        if (
            result.type ===
            "bomb"
        ) {

            const question =
                policeGame.getCurrentQuestion(
                    session.id
                );

            if (!question) {

                await interaction.reply({
                    content:
                        "❌ The bomb question could not be loaded.",
                    ephemeral: true
                });

                return;
            }

            await this.showPoliceEscapeQuestion(
                interaction,
                session,
                question.question,
                true
            );

            return;
        }

        /*
         * =====================================================
         * FAILURE
         * =====================================================
         */

        if (
            result.type === "failed" ||
            statusAfterMove === "failed" ||
            statusAfterMove === "expired"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        result.message
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Police Escape.",
                session.id
            );

            return;
        }

        /*
         * =====================================================
         * EXIT
         * =====================================================
         *
         * PoliceEscapeGame calls session.completeGame()
         * when the player reaches the exit.
         *
         * The manager is then responsible for either:
         *
         * 1. Starting the next robbery stage, or
         * 2. Finalizing the entire robbery.
         */

        if (
            result.type ===
            "exit"
        ) {

            let completionResult:
                "success" |
                "failed";

            try {

                completionResult =
                    await manager.handleCompletedGame(
                        session
                    );

            } catch {

                if (
                    getCurrentSessionStatus(
                        session
                    ) === "active"
                ) {

                    session.fail(
                        "The next robbery stage could not be started."
                    );
                }

                completionResult =
                    "failed";
            }

            const currentStatus =
                getCurrentSessionStatus(
                    session
                );

            /*
             * Entire robbery completed.
             *
             * The shared session may have been resolved by
             * either side while handleCompletedGame() awaited.
             * The winner field is therefore authoritative.
             */

            if (
                currentStatus ===
                "success"
            ) {

                if (
                    session.winner ===
                    "police"
                ) {

                    await interaction.reply({
                        content:
                            "🚨 **ROBBERY STOPPED**\n\n" +
                            "👮 **The Police have stopped the robbery.**",
                        ephemeral: false
                    });

                    await this.finishChannel(
                        interaction,
                        "Robbery stopped by Police.",
                        session.id
                    );

                    return;
                }

                if (
                    session.winner ===
                    "robber"
                ) {

                    await interaction.reply({
                        content:
                            "🎉 **ROBBERY COMPLETED!**\n\n" +
                            "🚔 **Police Escape completed.**\n" +
                            "🚪 You reached the exit.\n\n" +
                            "💰 **The robbery was successful!**",
                        ephemeral: false
                    });

                    await this.finishChannel(
                        interaction,
                        "Robbery completed successfully.",
                        session.id
                    );

                    return;
                }

                await interaction.reply({
                    content:
                        "❌ The robbery reached an invalid completed state.",
                    ephemeral: true
                });

                return;
            }

            /*
             * Completion failed.
             */

            if (
                completionResult ===
                    "failed" ||
                currentStatus ===
                    "failed" ||
                currentStatus ===
                    "expired"
            ) {

                await interaction.reply({
                    content:
                        "🚨 **ROBBERY FAILED**\n\n" +
                        `❌ ${
                            session.failureReason ??
                            "The next robbery stage could not be started."
                        }`,
                    ephemeral: false
                });

                await this.finishChannel(
                    interaction,
                    "Robbery failed after Police Escape.",
                    session.id
                );

                return;
            }

            /*
             * Police Escape completed, but another
             * robbery game remains.
             */

            await interaction.reply({
                content:
                    "🚪 **ESCAPED!**\n\n" +
                    "🎉 You reached the exit and escaped the maze!\n\n" +
                    "🎮 **The next robbery stage is starting...**",
                ephemeral: false
            });

            await this.sendCurrentGame(
                interaction,
                client,
                session,
                manager
            );

            return;
        }

        /*
         * =====================================================
         * SAFE MOVE
         * =====================================================
         */

        const mazeImage =
            await policeGame.getRenderedMaze(
                session.id
            );

        if (!mazeImage) {

            await interaction.reply({
                content:
                    `🚔 **POLICE ESCAPE**\n\n` +
                    `${result.message}\n\n` +
                    `${this.getTimerText(session)}`,
                ephemeral: false
            });

            return;
        }

        const attachment =
            new AttachmentBuilder(
                mazeImage,
                {
                    name:
                        "police-escape.png"
                }
            );

        await interaction.reply({

            content:
                `🚔 **POLICE ESCAPE**\n\n` +
                `${result.message}\n\n` +
                `👣 **Moves:** ${
                    policeGame.getMoves(
                        session.id
                    )
                }\n` +
                `🧠 **Questions Answered:** ${
                    policeGame.getQuestionsAnswered(
                        session.id
                    )
                }\n\n` +
                `${this.getTimerText(session)}`,

            files: [
                attachment
            ],

            components:
                this.createPoliceEscapeControls(
                    session
                )
        });
    },

    /*
     * =========================================================
     * POLICE ESCAPE ANSWER BUTTON
     * =========================================================
     */

    async handlePoliceEscapeAnswerButton(
        interaction: ButtonInteraction,
        client: BotClient
    ): Promise<void> {

        const sessionId =
            interaction.customId.substring(
                POLICE_ESCAPE_ANSWER_BUTTON_PREFIX.length
            );

        const manager =
            this.getRobberyManager(
                client
            );

        if (!manager) {

            await this.replySystemUnavailable(
                interaction
            );

            return;
        }

        const session =
            manager.getSession(
                sessionId
            );

        if (!session) {

            await this.replySessionUnavailable(
                interaction
            );

            return;
        }

        if (
            interaction.user.id !==
            session.robberId
        ) {

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.NOT_ROBBER,
                ephemeral: true
            });

            return;
        }

        if (
            session.isExpired
        ) {

            await manager.expireRobbery(
                session
            );

            this.scheduleChannelDelete(
                interaction.channel,
                session.id,
                "Robbery timer expired."
            );

            await interaction.reply({
                content:
                    INTERACTION_MESSAGES.EXPIRED,
                ephemeral: true
            });

            return;
        }

        if (
            getCurrentSessionStatus(
                session
            ) !== "active"
        ) {

            await interaction.reply({
                content:
                    "❌ This robbery is no longer active.",
                ephemeral: true
            });

            return;
        }

        const currentGame =
            manager.getCurrentGame(
                session
            );

        if (
            !currentGame ||
            currentGame.id !==
                "police-escape"
        ) {

            await interaction.reply({
                content:
                    "❌ **Police Escape** is no longer the active game.",
                ephemeral: true
            });

            return;
        }

        const policeGame =
            currentGame as typeof currentGame &
                PoliceEscapeInteractionGame;

        const question =
            policeGame.getCurrentQuestion(
                session.id
            );

        if (!question) {

            await interaction.reply({
                content:
                    "❌ This question has already been answered or is no longer active.",
                ephemeral: true
            });

            return;
        }

        const isBomb =
            policeGame.hasPendingBomb(
                session.id
            );

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `robbery:police-escape-answer:${session.id}`
                )
                .setTitle(
                    isBomb
                        ? "💣 Defuse the Bomb"
                        : "🚔 Police Escape Question"
                );

        const answerInput =
            new TextInputBuilder()
                .setCustomId(
                    "answer"
                )
                .setLabel(
                    question.question
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .slice(
                            0,
                            45
                        )
                )
                .setPlaceholder(
                    "Enter your answer"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(100);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    answerInput
                )
        );

        await interaction.showModal(
            modal
        );
    },

    /*
     * =========================================================
     * POLICE ESCAPE QUESTION WINDOW
     * =========================================================
     */

    async showPoliceEscapeQuestion(
        interaction: ButtonInteraction,
        session: RobberySession,
        question: string,
        isBomb: boolean
    ): Promise<void> {

        const answerButton =
            new ButtonBuilder()
                .setCustomId(
                    `${POLICE_ESCAPE_ANSWER_BUTTON_PREFIX}${session.id}`
                )
                .setLabel(
                    "Answer"
                )
                .setEmoji(
                    isBomb
                        ? "💣"
                        : "🔐"
                )
                .setStyle(
                    ButtonStyle.Primary
                );

        const questionTitle =
            isBomb
                ? "💣 **HIDDEN BOMB TRIGGERED**"
                : "🧠 **TRIVIA CHECKPOINT**";

        const instruction =
            isBomb
                ? (
                    "⚠️ **One wrong answer will detonate " +
                    "the bomb and fail the robbery.**"
                )
                : (
                    "Answer the question to continue " +
                    "through the escape."
                );

        await interaction.reply({

            content:
                `🚔 **POLICE ESCAPE**\n\n` +
                `${questionTitle}\n\n` +
                `🧠 **Question:** ${question}\n\n` +
                `${instruction}\n\n` +
                `${this.getTimerText(session)}`,

            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        answerButton
                    )
            ],

            ephemeral: false
        });
    },

    /*
     * =========================================================
     * LOCK MODAL
     * =========================================================
     */

    async handleLockModal(
        interaction: ModalSubmitInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:lock-modal:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const answer =
            interaction.fields.getTextInputValue(
                "combination"
            );

        const result =
            await manager.submitAnswer(
                session,
                answer
            );

        if (
            await this.handleGameResult(
                interaction,
                client,
                session,
                manager,
                result,
                "🔓 **Lock cracked!**"
            )
        ) {
            return;
        }

        if (
            result ===
            "failed"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "The lock combination was incorrect."
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: incorrect lock combination.",
                session.id
            );

            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.PROCESSING_ERROR,
            ephemeral: true
        });
    },

    /*
     * =========================================================
     * COLOUR MODAL
     * =========================================================
     */

    async handleColourModal(
        interaction: ModalSubmitInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:colour-modal:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const answer =
            interaction.fields.getTextInputValue(
                "colour"
            );

        const result =
            await manager.submitAnswer(
                session,
                answer
            );

        if (
            await this.handleGameResult(
                interaction,
                client,
                session,
                manager,
                result,
                "🎨 **Colour identified!**"
            )
        ) {
            return;
        }

        if (
            result ===
            "failed"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "The colour was identified incorrectly."
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Colour Guess.",
                session.id
            );

            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.PROCESSING_ERROR,
            ephemeral: true
        });
    },

    /*
     * =========================================================
     * BINARY MODAL
     * =========================================================
     */

    async handleBinaryModal(
        interaction: ModalSubmitInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:binary-modal:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const answer =
            interaction.fields.getTextInputValue(
                "answer"
            );

        const result =
            await manager.submitAnswer(
                session,
                answer
            );

        if (
            await this.handleGameResult(
                interaction,
                client,
                session,
                manager,
                result,
                "💻 **Binary decrypted!**"
            )
        ) {
            return;
        }

        if (
            result ===
            "failed"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "The binary decryption failed."
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Binary Decryption.",
                session.id
            );

            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.PROCESSING_ERROR,
            ephemeral: true
        });
    },

    /*
     * =========================================================
     * GUESS CHARACTER MODAL
     * =========================================================
     */

    async handleGuessCharacterModal(
        interaction: ModalSubmitInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:guess-character-modal:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const currentGame =
            manager.getCurrentGame(
                session
            );

        if (
            !currentGame ||
            currentGame.id !==
                "guess-character"
        ) {

            await interaction.reply({
                content:
                    "❌ **Guess Character** is no longer the active game.",
                ephemeral: true
            });

            return;
        }

        const answer =
            interaction.fields.getTextInputValue(
                "answer"
            );

        const result =
            await manager.submitAnswer(
                session,
                answer
            );

        if (
            await this.handleGameResult(
                interaction,
                client,
                session,
                manager,
                result,
                "🎭 **Character identified!**"
            )
        ) {
            return;
        }

        if (
            result ===
            "failed"
        ) {

            await interaction.reply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "The character was identified incorrectly."
                    }`,
                ephemeral: false
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Guess Character.",
                session.id
            );

            return;
        }

        await interaction.reply({
            content:
                INTERACTION_MESSAGES.PROCESSING_ERROR,
            ephemeral: true
        });
    },

    /*
     * =========================================================
     * POLICE ESCAPE ANSWER
     * =========================================================
     */

    async handlePoliceEscapeAnswer(
        interaction: ModalSubmitInteraction,
        client: BotClient
    ): Promise<void> {

        const validated =
            await this.validateSession(
                interaction,
                client,
                "robbery:police-escape-answer:"
            );

        if (!validated) {
            return;
        }

        const {
            manager,
            session
        } = validated;

        const currentGame =
            manager.getCurrentGame(
                session
            );

        if (
            !currentGame ||
            currentGame.id !==
                "police-escape"
        ) {

            await interaction.reply({
                content:
                    "❌ **Police Escape** is no longer the active game.",
                ephemeral: true
            });

            return;
        }

        const policeGame =
            currentGame as typeof currentGame &
                PoliceEscapeInteractionGame;

        /*
         * Capture whether this question belongs to a bomb
         * BEFORE submitting the answer.
         *
         * A failed bomb answer destroys the Police Escape
         * state, so this information must be captured first.
         */
        const wasBomb =
            policeGame.hasPendingBomb(
                session.id
            );

        const answer =
            interaction.fields.getTextInputValue(
                "answer"
            );

        /*
         * =====================================================
         * ACKNOWLEDGE THE MODAL IMMEDIATELY
         * =====================================================
         *
         * Discord requires the modal interaction to be
         * acknowledged quickly.
         *
         * We process the game answer after acknowledging it,
         * then edit this response with the final result.
         */
        await interaction.deferReply({
            ephemeral: false
        });

        let result:
            | "success"
            | "failed";

        try {

            result =
                await policeGame.handleAnswer(
                    session,
                    answer
                );

        } catch (error) {

            /*
             * Never leave the modal interaction hanging if
             * Police Escape throws unexpectedly.
             */

            if (
                getCurrentSessionStatus(
                    session
                ) === "active"
            ) {

                session.fail(
                    "The Police Escape answer could not be processed."
                );
            }

            await interaction.editReply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    "❌ The Police Escape answer could not be processed."
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Police Escape answer processing error.",
                session.id
            );

            return;
        }

        const statusAfterAnswer =
            getCurrentSessionStatus(
                session
            );

        /*
         * =====================================================
         * SHARED SESSION RESOLUTION
         * =====================================================
         *
         * Police can resolve the robbery while the asynchronous
         * Police Escape answer is being processed.
         *
         * The shared session winner is authoritative. Do not
         * continue reading Police Escape state after another
         * side has already won.
         */

        if (
            statusAfterAnswer ===
            "success"
        ) {

            if (
                session.winner ===
                "police"
            ) {

                await interaction.editReply({
                    content:
                        "🚨 **ROBBERY STOPPED**\n\n" +
                        "👮 **The Police have stopped the robbery.**"
                });

                await this.finishChannel(
                    interaction,
                    "Robbery stopped by Police.",
                    session.id
                );

                return;
            }

            if (
                session.winner ===
                "robber"
            ) {

                await interaction.editReply({
                    content:
                        "🎉 **ROBBERY COMPLETED!**\n\n" +
                        "💰 **The robbery was successful!**"
                });

                await this.finishChannel(
                    interaction,
                    "Robbery completed successfully.",
                    session.id
                );

                return;
            }

            await interaction.editReply({
                content:
                    "❌ The robbery reached an invalid completed state."
            });

            return;
        }

        /*
         * =====================================================
         * EXPIRATION
         * =====================================================
         */

        if (
            statusAfterAnswer ===
            "expired"
        ) {

            await interaction.editReply({
                content:
                    "⏱️ **ROBBERY EXPIRED**\n\n" +
                    "The global robbery timer ran out."
            });

            await this.finishChannel(
                interaction,
                "Robbery expired.",
                session.id
            );

            return;
        }

        /*
         * =====================================================
         * FAILURE
         * =====================================================
         *
         * This is the important path for a wrong bomb answer.
         *
         * PoliceEscapeGame.handleAnswer() calls:
         *
         *     session.fail(...)
         *
         * and returns "failed".
         *
         * We deliberately handle the failure using the session
         * status BEFORE attempting to read any Police Escape
         * state that may already have been deleted.
         */

        if (
            result === "failed" ||
            statusAfterAnswer === "failed"
        ) {

            const failureMessage =
                wasBomb
                    ? (
                        "💥 **BOOM!**\n\n" +
                        "❌ The answer was incorrect.\n" +
                        "💣 The hidden bomb detonated.\n\n" +
                        "🚨 **ROBBERY FAILED**"
                    )
                    : (
                        "🚨 **ROBBERY FAILED**\n\n" +
                        `❌ ${
                            session.failureReason ??
                            "Police Escape failed."
                        }`
                    );

            await interaction.editReply({
                content:
                    failureMessage
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Police Escape.",
                session.id
            );

            return;
        }

        /*
         * =====================================================
         * UNEXPECTED RESULT
         * =====================================================
         */

        if (
            result !== "success"
        ) {

            await interaction.editReply({
                content:
                    INTERACTION_MESSAGES.PROCESSING_ERROR
            });

            return;
        }

        /*
         * =====================================================
         * SUCCESSFUL ANSWER
         * =====================================================
         *
         * A successful Police Escape answer only means that
         * the bomb was diffused.
         *
         * It does NOT complete the Police Escape stage.
         *
         * The player must continue moving until reaching
         * the maze exit.
         */

        const correct =
            policeGame.getLastAnswerCorrect(
                session.id
            );

        const mazeImage =
            await policeGame.getRenderedMaze(
                session.id
            );

        /*
         * The maze render is asynchronous. Police may resolve
         * the shared robbery during that await, so check the
         * session again before presenting the maze as active.
         */

        const statusAfterMazeRender =
            getCurrentSessionStatus(
                session
            );

        if (
            statusAfterMazeRender ===
            "success"
        ) {

            if (
                session.winner ===
                "police"
            ) {

                await interaction.editReply({
                    content:
                        "🚨 **ROBBERY STOPPED**\n\n" +
                        "👮 **The Police have stopped the robbery.**"
                });

                await this.finishChannel(
                    interaction,
                    "Robbery stopped by Police.",
                    session.id
                );

                return;
            }

            if (
                session.winner ===
                "robber"
            ) {

                await interaction.editReply({
                    content:
                        "🎉 **ROBBERY COMPLETED!**\n\n" +
                        "💰 **The robbery was successful!**"
                });

                await this.finishChannel(
                    interaction,
                    "Robbery completed successfully.",
                    session.id
                );

                return;
            }

            await interaction.editReply({
                content:
                    "❌ The robbery reached an invalid completed state."
            });

            return;
        }

        if (
            statusAfterMazeRender ===
            "expired"
        ) {

            await interaction.editReply({
                content:
                    "⏱️ **ROBBERY EXPIRED**\n\n" +
                    "The global robbery timer ran out."
            });

            await this.finishChannel(
                interaction,
                "Robbery expired.",
                session.id
            );

            return;
        }

        if (
            statusAfterMazeRender ===
            "failed"
        ) {

            await interaction.editReply({
                content:
                    "🚨 **ROBBERY FAILED**\n\n" +
                    `❌ ${
                        session.failureReason ??
                        "Police Escape failed."
                    }`
            });

            await this.finishChannel(
                interaction,
                "Robbery failed: Police Escape.",
                session.id
            );

            return;
        }

        const answerMessage =
            wasBomb && correct === true
                ? (
                    "✅ **Correct answer!**\n\n" +
                    "💣 **Bomb diffused.**\n" +
                    "🚔 The bomb remains hidden and the escape continues."
                )
                : (
                    "✅ **Correct answer!**\n\n" +
                    "🚔 Continue through the maze."
                );

        if (!mazeImage) {

            await interaction.editReply({
                content:
                    `🚔 **POLICE ESCAPE**\n\n` +
                    `${answerMessage}\n\n` +
                    `${this.getTimerText(session)}`
            });

            return;
        }

        const attachment =
            new AttachmentBuilder(
                mazeImage,
                {
                    name:
                        "police-escape.png"
                }
            );

        await interaction.editReply({

            content:
                `🚔 **POLICE ESCAPE**\n\n` +
                `${answerMessage}\n\n` +
                `👣 **Moves:** ${
                    policeGame.getMoves(
                        session.id
                    )
                }\n` +
                `🧠 **Questions Answered:** ${
                    policeGame.getQuestionsAnswered(
                        session.id
                    )
                }\n\n` +
                `${this.getTimerText(session)}\n\n` +
                `Use the controls below to continue through the maze.`,

            files: [
                attachment
            ],

            components:
                this.createPoliceEscapeControls(
                    session
                )
        });
    },

    /*
     * =========================================================
     * SEND CURRENT GAME
     * =========================================================
     */

    async sendCurrentGame(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction,
        client: BotClient,
        session: RobberySession,
        robberyManager: RobberyManager
    ): Promise<void> {

        const channel =
            interaction.channel;

        if (
            !channel ||
            !("send" in channel)
        ) {
            return;
        }

        /*
         * Every active robbery gets one Discord-side
         * expiry watcher.
         */

        this.scheduleChannelExpiry(
            channel,
            session,
            robberyManager
        );

        if (
            getCurrentSessionStatus(
                session
            ) !== "active"
        ) {
            return;
        }

        if (
            session.isExpired
        ) {

            await robberyManager.expireRobbery(
                session
            );

            this.scheduleChannelDelete(
                channel,
                session.id,
                "Robbery timer expired."
            );

            return;
        }

        const currentGame =
            robberyManager.getCurrentGame(
                session
            );

        if (!currentGame) {
            return;
        }

        /*
         * =====================================================
         * LOCK COMBINATION
         * =====================================================
         */

        if (
            currentGame.id ===
            "lock-combination"
        ) {

            const lockGame =
                currentGame as typeof currentGame & {

                    getClues?: (
                        session: RobberySession
                    ) => string[];

                };

            const clues =
                lockGame.getClues?.(
                    session
                ) ?? [];

            const clueText =
                clues.length > 0
                    ? clues
                        .map(
                            (clue, index) =>
                                `**Knob ${index + 1}:** ${clue}`
                        )
                        .join("\n")
                    : "Follow the instructions to crack the lock.";

            const button =
                new ButtonBuilder()
                    .setCustomId(
                        `robbery:lock:${session.id}`
                    )
                    .setLabel(
                        "Enter Combination"
                    )
                    .setEmoji(
                        "🔐"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            await channel.send({

                content:
                    `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                    `🔐 **LOCK COMBINATION**\n\n` +
                    `Crack the vault lock using the clues below.\n\n` +
                    `${clueText}\n\n` +
                    `⚠️ **ONE ATTEMPT ONLY**\n` +
                    `${this.getTimerText(session)}\n\n` +
                    `🔓 Submit the combination when you're ready.`,

                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            button
                        )
                ]
            });

            return;
        }

        /*
         * =====================================================
         * COLOUR GUESS
         * =====================================================
         */

        if (
            currentGame.id ===
            "colour-guess"
        ) {

            const colourGame =
                currentGame as typeof currentGame & {

                    getDisplayedHex?: (
                        session: RobberySession
                    ) => string | null;

                    getRemainingRevealTime?: (
                        session: RobberySession
                    ) => number;

                };

            const displayedHex =
                colourGame.getDisplayedHex?.(
                    session
                ) ?? "######";

            const button =
                new ButtonBuilder()
                    .setCustomId(
                        `robbery:colour:${session.id}`
                    )
                    .setLabel(
                        "Guess Colour"
                    )
                    .setEmoji(
                        "🎨"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            const message =
                await channel.send({

                    content:
                        `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                        `🎨 **GUESS THE COLOUR**\n\n` +
                        `🔢 **HEX:** \`${displayedHex}\`\n\n` +
                        `⏳ The complete HEX will be revealed after **10 seconds**.\n` +
                        `⚠️ **ONE ATTEMPT ONLY**\n` +
                        `${this.getTimerText(session)}\n\n` +
                        `Study the colour carefully, then submit your guess.`,

                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                button
                            )
                    ]
                });

            const remainingTime =
                colourGame.getRemainingRevealTime?.(
                    session
                ) ?? 10_000;

            setTimeout(
                async () => {

                    try {

                        if (
                            getCurrentSessionStatus(
                                session
                            ) !== "active"
                        ) {
                            return;
                        }

                        if (
                            session.isExpired
                        ) {
                            return;
                        }

                        const activeGame =
                            robberyManager.getCurrentGame(
                                session
                            );

                        if (
                            !activeGame ||
                            activeGame.id !==
                                "colour-guess"
                        ) {
                            return;
                        }

                        const fullHex =
                            colourGame.getDisplayedHex?.(
                                session
                            );

                        if (!fullHex) {
                            return;
                        }

                        if (
                            fullHex.includes("█")
                        ) {
                            return;
                        }

                        await message.edit({

                            content:
                                `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                                `🎨 **GUESS THE COLOUR**\n\n` +
                                `🔢 **FULL HEX:** \`${fullHex}\`\n\n` +
                                `👁️ **The complete colour code is now visible.**\n` +
                                `⚠️ **ONE ATTEMPT ONLY**\n` +
                                `${this.getTimerText(session)}\n\n` +
                                `Submit your colour guess below.`

                        });

                    } catch {
                        /*
                         * Message may already be deleted.
                         */
                    }

                },
                Math.max(
                    0,
                    remainingTime
                )
            );

            return;
        }

        /*
         * =====================================================
         * BINARY DECRYPTION
         * =====================================================
         */

        if (
            currentGame.id ===
            "binary-decryption"
        ) {

            const binaryGame =
                currentGame as typeof currentGame & {

                    getBinary?: (
                        session: RobberySession
                    ) => string | null;

                };

            const binary =
                binaryGame.getBinary?.(
                    session
                );

            if (!binary) {
                return;
            }

            const button =
                new ButtonBuilder()
                    .setCustomId(
                        `robbery:binary:${session.id}`
                    )
                    .setLabel(
                        "Decrypt Binary"
                    )
                    .setEmoji(
                        "💻"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            await channel.send({

                content:
                    `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                    `💻 **BINARY DECRYPTION**\n\n` +
                    `A hidden word is encoded in the binary sequence below.\n` +
                    `Decode it and submit the answer.\n\n` +
                    `\`\`\`\n${binary}\n\`\`\`\n\n` +
                    `⚠️ **ONE ATTEMPT ONLY**\n` +
                    `${this.getTimerText(session)}`,

                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            button
                        )
                ]
            });

            return;
        }

        /*
         * =====================================================
         * GUESS CHARACTER
         * =====================================================
         */

        if (
            currentGame.id ===
            "guess-character"
        ) {

            const guessCharacterGame =
                currentGame as typeof currentGame & {

                    getClues?: (
                        session: RobberySession
                    ) => [
                        string,
                        string,
                        string
                    ] | null;

                    getCategory?: (
                        session: RobberySession
                    ) => string | null;

                };

            const clues =
                guessCharacterGame.getClues?.(
                    session
                ) ?? null;

            if (!clues) {

                await channel.send({
                    content:
                        "❌ The character puzzle could not be loaded."
                });

                return;
            }

            const category =
                guessCharacterGame.getCategory?.(
                    session
                );

            const clueText =
                clues
                    .map(
                        (clue, index) =>
                            `**Clue ${index + 1}:** ${clue}`
                    )
                    .join("\n\n");

            const button =
                new ButtonBuilder()
                    .setCustomId(
                        `robbery:guess-character:${session.id}`
                    )
                    .setLabel(
                        "Guess Character"
                    )
                    .setEmoji(
                        "🎭"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    );

            await channel.send({

                content:
                    `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                    `🎭 **GUESS THE CHARACTER**\n\n` +
                    `${
                        category
                            ? `📚 **Category:** ${category}\n\n`
                            : ""
                    }` +
                    `${clueText}\n\n` +
                    `⚠️ **ONE ATTEMPT ONLY**\n` +
                    `${this.getTimerText(session)}\n\n` +
                    `Study all three clues carefully before submitting your answer.`,

                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            button
                        )
                ]
            });

            return;
        }

        /*
         * =====================================================
         * POLICE ESCAPE
         * =====================================================
         */

        if (
            currentGame.id ===
            "police-escape"
        ) {

            const policeGame =
                currentGame as typeof currentGame &
                    PoliceEscapeInteractionGame;

            const mazeImage =
                await policeGame.getRenderedMaze(
                    session.id
                );

            if (!mazeImage) {

                await channel.send({
                    content:
                        "❌ The Police Escape maze could not be generated."
                });

                return;
            }

            const attachment =
                new AttachmentBuilder(
                    mazeImage,
                    {
                        name:
                            "police-escape.png"
                    }
                );

            const level =
                policeGame.getLevel(
                    session.id
                ) ?? 1;

            const movementRows =
                this.createPoliceEscapeControls(
                    session
                );

            await channel.send({

                content:
                    `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                    `🚔 **POLICE ESCAPE**\n\n` +
                    `The police are closing in. Navigate through the maze and reach the green exit.\n\n` +
                    `🗺️ **Maze Level:** ${level}\n` +
                    `👣 **Moves:** ${
                        policeGame.getMoves(
                            session.id
                        )
                    }\n` +
                    `🧠 **Questions Answered:** ${
                        policeGame.getQuestionsAnswered(
                            session.id
                        )
                    }\n\n` +
                    `💣 **Hidden bombs are scattered throughout the maze.**\n` +
                    `🚶 **Your first move is free.**\n` +
                    `❓ **Movement may trigger a trivia checkpoint.**\n` +
                    `💣 **Bomb triggered:** answer the question to diffuse it.\n` +
                    `❌ **Wrong bomb answer:** the bomb detonates and the robbery fails immediately.\n` +
                    `🚪 **Reach the green exit to escape.**\n\n` +
                    `${this.getTimerText(session)}`,

                files: [
                    attachment
                ],

                components:
                    movementRows
            });

            return;
        }

        /*
         * =====================================================
         * UNSUPPORTED GAME
         * =====================================================
         */

        await channel.send({
            content:
                `🎮 **ROBBERY STAGE ${session.currentGameNumber}/${session.totalGames}**\n\n` +
                `⚠️ **${currentGame.name}** is not yet supported by the robbery interaction handler.`
        });
    },

    /*
     * =========================================================
     * POLICE ESCAPE CONTROLS
     * =========================================================
     */

    createPoliceEscapeControls(
        session: RobberySession
    ): ActionRowBuilder<ButtonBuilder>[] {

        const up =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:police-escape:up:${session.id}`
                )
                .setLabel(
                    "Up"
                )
                .setEmoji(
                    "⬆️"
                )
                .setStyle(
                    ButtonStyle.Primary
                );

        const down =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:police-escape:down:${session.id}`
                )
                .setLabel(
                    "Down"
                )
                .setEmoji(
                    "⬇️"
                )
                .setStyle(
                    ButtonStyle.Primary
                );

        const left =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:police-escape:left:${session.id}`
                )
                .setLabel(
                    "Left"
                )
                .setEmoji(
                    "⬅️"
                )
                .setStyle(
                    ButtonStyle.Primary
                );

        const right =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:police-escape:right:${session.id}`
                )
                .setLabel(
                    "Right"
                )
                .setEmoji(
                    "➡️"
                )
                .setStyle(
                    ButtonStyle.Primary
                );

        return [

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    up
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    left,
                    down,
                    right
                )

        ];
    },

    /*
     * =========================================================
     * FINISH CHANNEL
     * =========================================================
     */

    async finishChannel(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction,
        reason: string,
        sessionId?: string
    ): Promise<void> {

        const channel =
            interaction.channel;

        if (
            !channel ||
            !("delete" in channel)
        ) {
            return;
        }

        /*
         * Stop the Discord-side expiry watcher.
         */

        if (sessionId) {

            const expiryTimer =
                expiryTimers.get(
                    sessionId
                );

            if (expiryTimer) {

                clearTimeout(
                    expiryTimer
                );

                expiryTimers.delete(
                    sessionId
                );
            }

            /*
             * scheduleChannelDelete() is idempotent.
             */

            this.scheduleChannelDelete(
                channel,
                sessionId,
                reason
            );

            return;
        }

        /*
         * No session ID means this is an isolated
         * channel cleanup request.
         */

        setTimeout(
            async () => {

                try {

                    await channel.delete(
                        reason
                    );

                } catch {
                    /*
                     * Channel may already be gone.
                     */
                }

            },
            CHANNEL_DELETE_DELAY_MS
        );
    }
};

END FILE: src/plugins/robbery/events/RobberyInteraction.ts
================================================================================

FILE: src/plugins/robbery/events/RobberyPoliceInteraction.ts
--------------------------------------------------------------------------------
Original size: 25375 bytes
Exported size: 24363 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Interaction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import {
    RobberyManager
} from "../../robbery/core/RobberyManager.js";

import {
    RobberyHeadquarters
} from "../headquarters/RobberyHeadquarters.js";

import {
    RobberyPoliceManager
} from "../headquarters/police/RobberyPoliceManager.js";

import {
    RobberyPoliceGameId
} from "../headquarters/police/RobberyPoliceCase.js";

import {
    PoliceSignalTraceGame
} from "../headquarters/police/PoliceSignalTraceGame.js";

import {
    PoliceCodeTraceGame
} from "../headquarters/police/PoliceCodeTraceGame.js";

import {
    PoliceClueSearchGame
} from "../headquarters/police/PoliceClueSearchGame.js";

const VICTIM_DO_NOTHING_PREFIX =
    "robbery:victim:do-nothing:";

const VICTIM_CALL_POLICE_PREFIX =
    "robbery:victim:call-police:";

const POLICE_CLAIM_PREFIX =
    "robbery:police-claim:";

const POLICE_ANSWER_BUTTON_PREFIX =
    "robbery:police-answer:";

const POLICE_ANSWER_MODAL_PREFIX =
    "robbery:police-answer-modal:";

export default {

    async execute(
        interaction: Interaction,
        policeManager: RobberyPoliceManager,
        robberyManager: RobberyManager,
        robberyHeadquarters: RobberyHeadquarters
    ): Promise<void> {

        if (
            interaction.isButton()
        ) {

            await this.handleButton(
                interaction,
                policeManager,
                robberyManager,
                robberyHeadquarters
            );

            return;
        }

        if (
            interaction.isModalSubmit()
        ) {

            await this.handleModal(
                interaction,
                policeManager,
                robberyHeadquarters
            );

            return;
        }
    },


    /*
     * =========================
     * BUTTON ROUTER
     * =========================
     *
     * All Police/victim buttons are
     * handled here.
     *
     * This keeps the Police response
     * system together instead of mixing
     * it into the robber-side interaction
     * handler.
     */

    async handleButton(
        interaction: ButtonInteraction,
        policeManager: RobberyPoliceManager,
        robberyManager: RobberyManager,
        robberyHeadquarters: RobberyHeadquarters
    ): Promise<void> {

        /*
         * =========================
         * VICTIM - DO NOTHING
         * =========================
         */

        if (
            interaction.customId.startsWith(
                VICTIM_DO_NOTHING_PREFIX
            )
        ) {

            /*
             * Acknowledge the button without
             * changing the robbery.
             *
             * Call Police remains available
             * because this action does not
             * modify the session or disable
             * the other button.
             */

            await interaction.deferUpdate();

            return;
        }


        /*
         * =========================
         * VICTIM - CALL POLICE
         * =========================
         */

        if (
            interaction.customId.startsWith(
                VICTIM_CALL_POLICE_PREFIX
            )
        ) {

            const sessionId =
                interaction.customId.slice(
                    VICTIM_CALL_POLICE_PREFIX.length
                );

            const session =
                robberyManager.getSession(
                    sessionId
                );

            await interaction.deferUpdate();

            if (
                !session
            ) {

                await interaction.followUp({
                    content:
                        "This robbery is no longer active.",
                    ephemeral: true
                });

                return;
            }

            /*
             * The shared RobberySession owns
             * the robbery deadline.
             *
             * Police response must never
             * create a second independent
             * deadline.
             */

            if (
                Date.now() >=
                session.expiresAt
            ) {

                await interaction.followUp({
                    content:
                        "This robbery has already expired.",
                    ephemeral: true
                });

                return;
            }

            /*
             * The victim DM is not necessarily
             * associated with a guild, therefore
             * the guild must come from the
             * authoritative robbery session.
             */

            const sentCount =
                await robberyHeadquarters.notifyPoliceOfRobbery(
                    session.guildId,
                    session.id,
                    session.robberId,
                    session.targetId,
                    session.expiresAt
                );

            if (
                sentCount === 0
            ) {

                await interaction.followUp({
                    content:
                        "🚨 Police could not be alerted because no eligible channel was available.",
                    ephemeral: true
                });

                return;
            }

            await interaction.followUp({
                content:
                    "🚨 Police have been alerted.",
                ephemeral: true
            });

            return;
        }


        /*
         * =========================
         * POLICE - CLAIM RESPONSE
         * =========================
         */

        if (
            interaction.customId.startsWith(
                POLICE_CLAIM_PREFIX
            )
        ) {

            await this.handlePoliceClaim(
                interaction,
                policeManager,
                robberyManager,
                robberyHeadquarters
            );

            return;
        }


        /*
         * =========================
         * SUBMIT ANSWER BUTTON
         * =========================
         */

        if (
            interaction.customId.startsWith(
                POLICE_ANSWER_BUTTON_PREFIX
            )
        ) {

            await this.handleAnswerButton(
                interaction,
                policeManager
            );

            return;
        }
    },


    /*
     * =========================
     * POLICE CLAIM
     * =========================
     */

    async handlePoliceClaim(
        interaction: ButtonInteraction,
        policeManager: RobberyPoliceManager,
        robberyManager: RobberyManager,
        robberyHeadquarters: RobberyHeadquarters
    ): Promise<void> {

        const sessionId =
            interaction.customId.slice(
                POLICE_CLAIM_PREFIX.length
            );

        const session =
            robberyManager.getSession(
                sessionId
            );

        if (
            !session
        ) {

            await interaction.reply({
                content:
                    "This robbery is no longer active.",
                ephemeral: true
            });

            return;
        }

        if (
            Date.now() >=
            session.expiresAt
        ) {

            await interaction.reply({
                content:
                    "This robbery response window has expired.",
                ephemeral: true
            });

            return;
        }

        /*
         * createCase() is the authoritative
         * Police claim operation.
         *
         * It verifies Police eligibility
         * and synchronously claims the robbery
         * before performing awaited Discord
         * operations.
         *
         * This is what prevents two Police
         * responders from both claiming the
         * same robbery.
         */

        try {

            const policeCase =
                await policeManager.createCase(
                    session,
                    interaction.user.id
                );

            /*
             * Tell the Police responder that
             * their claim succeeded.
             */

            await interaction.reply({
                content:
                    "🚓 **Police response accepted.** Your private Police room has been created.",
                ephemeral: true
            });

            /*
             * The manager creates the private
             * Police room and starts the first
             * Police game.
             *
             * The interaction layer is
             * responsible only for presenting
             * that game.
             */

            const currentGame =
                policeManager.getCurrentGame(
                    policeCase.id
                );

            if (
                !currentGame
            ) {

                return;
            }

            await robberyHeadquarters.sendPoliceGameMessage(
                session.guildId,
                session.id,
                this.buildGameMessage(
                    policeCase.id,
                    currentGame,
                    policeManager
                ),
                [
                    this.createAnswerControls(
                        policeCase.id
                    )
                ]
            );

        } catch (error) {

            /*
             * createCase() rejects when:
             *
             * - the user is not eligible Police
             * - another Police member already
             *   claimed the robbery
             * - the robbery is inactive/expired
             * - the Police room could not be created
             *
             * The manager remains authoritative
             * over those conditions.
             */

            const message =
                error instanceof Error
                    ? error.message
                    : "";

            if (
                message ===
                "POLICE_ROOM_CREATION_FAILED"
            ) {

                await interaction.reply({
                    content:
                        "🚓 Your Police response could not be started because the private Police room could not be created.",
                    ephemeral: true
                });

                return;
            }

            await interaction.reply({
                content:
                    "🚓 This robbery has already been claimed by another Police responder, or you are not eligible to respond.",
                ephemeral: true
            });
        }
    },


    /*
     * =========================
     * SUBMIT ANSWER BUTTON
     * =========================
     */

    async handleAnswerButton(
        interaction: ButtonInteraction,
        policeManager: RobberyPoliceManager
    ): Promise<void> {

        const policeCaseId =
            interaction.customId.slice(
                POLICE_ANSWER_BUTTON_PREFIX.length
            );

        const policeCase =
            policeManager.getCase(
                policeCaseId
            );

        if (!policeCase) {

            await interaction.reply({
                content:
                    "This Police case is no longer active.",
                ephemeral: true
            });

            return;
        }

        if (
            policeCase.policeId !==
            interaction.user.id
        ) {

            await interaction.reply({
                content:
                    "You are not assigned to this Police case.",
                ephemeral: true
            });

            return;
        }

        if (
            policeCase.status !==
            "active"
        ) {

            await interaction.reply({
                content:
                    "This Police case is no longer active.",
                ephemeral: true
            });

            return;
        }

        const game =
            policeManager.getCurrentGame(
                policeCaseId
            );

        if (!game) {

            await interaction.reply({
                content:
                    "The current Police challenge could not be found.",
                ephemeral: true
            });

            return;
        }

        const modal =
            new ModalBuilder()
                .setCustomId(
                    `${POLICE_ANSWER_MODAL_PREFIX}${policeCaseId}`
                )
                .setTitle(
                    game.name
                );

        const answerInput =
            new TextInputBuilder()
                .setCustomId(
                    "answer"
                )
                .setLabel(
                    "Enter your answer"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMaxLength(200);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    answerInput
                )
        );

        await interaction.showModal(
            modal
        );
    },


    /*
     * =========================
     * ANSWER MODAL
     * =========================
     */

    async handleModal(
        interaction: import("discord.js").ModalSubmitInteraction,
        policeManager: RobberyPoliceManager,
        robberyHeadquarters: RobberyHeadquarters
    ): Promise<void> {

        if (
            !interaction.customId.startsWith(
                POLICE_ANSWER_MODAL_PREFIX
            )
        ) {
            return;
        }

        const policeCaseId =
            interaction.customId.slice(
                POLICE_ANSWER_MODAL_PREFIX.length
            );

        const policeCase =
            policeManager.getCase(
                policeCaseId
            );

        if (!policeCase) {

            await interaction.reply({
                content:
                    "This Police case is no longer active.",
                ephemeral: true
            });

            return;
        }

        if (
            policeCase.policeId !==
            interaction.user.id
        ) {

            await interaction.reply({
                content:
                    "You are not assigned to this Police case.",
                ephemeral: true
            });

            return;
        }

        if (
            policeCase.status !==
            "active"
        ) {

            await interaction.reply({
                content:
                    "This Police case is no longer active.",
                ephemeral: true
            });

            return;
        }

        const answer =
            interaction.fields.getTextInputValue(
                "answer"
            );

        const result =
            await policeManager.submitAnswer(
                policeCaseId,
                answer
            );

        /*
         * =========================
         * GET UPDATED CASE
         * =========================
         *
         * IMPORTANT:
         *
         * A final successful Police
         * response causes the manager to
         * clean up the case immediately.
         *
         * Therefore:
         *
         *     result === "success"
         *     updatedCase === null
         *
         * is a valid final Police victory.
         */

        const updatedCase =
            policeManager.getCase(
                policeCaseId
            );


        /*
         * =========================
         * SUCCESS
         * =========================
         */

        if (
            result ===
            "success"
        ) {

            /*
             * Final Police victory.
             *
             * The manager has already:
             *
             * 1. Claimed the shared winner.
             * 2. Paid the rescue reward.
             * 3. Jailed the Robber.
             * 4. Resolved the robbery.
             * 5. Cleaned up the Police case.
             *
             * Therefore the case being null is
             * expected here.
             */

            if (
                !updatedCase
            ) {

                await interaction.reply({
                    content:
                        "🚨 **Police response successful.** The robbery has been stopped.",
                    ephemeral: true
                });

                return;
            }

            /*
             * Defensive handling in case a
             * completed case remains available.
             */

            if (
                updatedCase.status ===
                "success"
            ) {

                await interaction.reply({
                    content:
                        "🚨 **Police response successful.** The robbery has been stopped.",
                    ephemeral: true
                });

                return;
            }

            /*
             * The current Police challenge
             * was completed successfully and
             * another Police challenge remains.
             */

            const nextGame =
                policeManager.getCurrentGame(
                    policeCaseId
                );

            if (!nextGame) {

                await interaction.reply({
                    content:
                        "The next Police challenge could not be loaded.",
                    ephemeral: true
                });

                return;
            }

            /*
             * Acknowledge the modal submission.
             *
             * The actual next Police challenge
             * belongs in the private Police room,
             * not as an ephemeral interaction
             * response.
             */

            await interaction.deferReply({
                ephemeral: true
            });

            await robberyHeadquarters.sendPoliceGameMessage(
                updatedCase.guildId,
                updatedCase.robberySessionId,
                this.buildGameMessage(
                    policeCaseId,
                    nextGame,
                    policeManager
                ),
                [
                    this.createAnswerControls(
                        policeCaseId
                    )
                ]
            );

            await interaction.editReply({
                content:
                    "✅ Challenge completed. The next Police challenge has been sent to your private Police room."
            });

            return;
        }


        /*
         * =========================
         * FAILURE
         * =========================
         */

        if (
            result ===
            "failed"
        ) {

            if (
                !updatedCase
            ) {

                await interaction.reply({
                    content:
                        "The Police case has ended.",
                    ephemeral: true
                });

                return;
            }

            if (
                updatedCase.status ===
                "failed"
            ) {

                await interaction.reply({
                    content:
                        "Police challenge failed. The robbery continues.",
                    ephemeral: true
                });

                return;
            }

            if (
                updatedCase.status ===
                "expired"
            ) {

                await interaction.reply({
                    content:
                        "The Police response timer expired.",
                    ephemeral: true
                });

                return;
            }

            await interaction.reply({
                content:
                    "The answer could not be accepted.",
                ephemeral: true
            });

            return;
        }
    },


    /*
     * =========================
     * BUILD GAME MESSAGE
     * =========================
     */

    buildGameMessage(
        policeCaseId: string,
        game: {
            readonly id: string;
            readonly name: string;
        },
        policeManager: RobberyPoliceManager
    ): string {

        switch (
            game.id as RobberyPoliceGameId
        ) {

            case "signal-trace": {

                const signalGame =
                    policeManager.getGame(
                        "signal-trace"
                    );

                if (
                    signalGame instanceof
                    PoliceSignalTraceGame
                ) {

                    const sequence =
                        signalGame.getSequence(
                            policeCaseId
                        );

                    if (sequence) {

                        return [
                            "📡 **Signal Trace**",
                            "",
                            "Trace the signal route.",
                            "",
                            `Signal sequence: **${sequence.join(" → ")}**`,
                            "",
                            "Submit the correct destination."
                        ].join("\n");
                    }
                }

                break;
            }


            case "code-trace": {

                const codeGame =
                    policeManager.getGame(
                        "code-trace"
                    );

                if (
                    codeGame instanceof
                    PoliceCodeTraceGame
                ) {

                    const encodedCode =
                        codeGame.getEncodedCode(
                            policeCaseId
                        );

                    if (encodedCode) {

                        return [
                            "🔐 **Code Trace**",
                            "",
                            "Trace the encoded code.",
                            "",
                            `Encoded code: **${encodedCode}**`,
                            "",
                            "Submit the decoded answer."
                        ].join("\n");
                    }
                }

                break;
            }


            case "clue-search": {

                const clueGame =
                    policeManager.getGame(
                        "clue-search"
                    );

                if (
                    clueGame instanceof
                    PoliceClueSearchGame
                ) {

                    const clues =
                        clueGame.getClues(
                            policeCaseId
                        );

                    if (clues) {

                        return [
                            "🔎 **Clue Search**",
                            "",
                            "Search the clues and identify the target.",
                            "",
                            ...clues.map(
                                (
                                    clue,
                                    index
                                ) =>
                                    `**${index + 1}.** ${clue}`
                            ),
                            "",
                            "Submit your answer."
                        ].join("\n");
                    }
                }

                break;
            }
        }

        return [
            `🚓 **${game.name}**`,
            "",
            "Complete the Police challenge.",
            "",
            "Press **Submit Answer** when you are ready."
        ].join("\n");
    },


    /*
     * =========================
     * ANSWER CONTROLS
     * =========================
     */

    createAnswerControls(
        policeCaseId: string
    ): ActionRowBuilder<ButtonBuilder> {

        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        `${POLICE_ANSWER_BUTTON_PREFIX}${policeCaseId}`
                    )
                    .setLabel(
                        "Submit Answer"
                    )
                    .setStyle(
                        ButtonStyle.Primary
                    )
            );
    }
};


END FILE: src/plugins/robbery/events/RobberyPoliceInteraction.ts
================================================================================

FILE: src/plugins/robbery/games/BinaryDecryptionGame.ts
--------------------------------------------------------------------------------
Original size: 14800 bytes
Exported size: 14026 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    RobberyGame,
    RobberyGameResult
} from "./RobberyGame.js";

import {
    RobberySession
} from "../core/RobberySession.js";

type BinaryPuzzle = {
    answer: string;
    binary: string;
};

export class BinaryDecryptionGame
    implements RobberyGame {

    readonly id =
        "binary-decryption";

    readonly name =
        "Binary Decryption";

    private readonly puzzles =
        new Map<string, BinaryPuzzle>();

    /*
     * =========================
     * WORD POOL
     * =========================
     *
     * All entries use A-Z only so
     * they can be safely converted
     * to standard 8-bit ASCII.
     */

    private readonly wordPool:
        readonly string[] = [

        /*
         * =========================
         * SHORT WORDS
         * =========================
         */

        "FIRE",
        "MOON",
        "STAR",
        "RAIN",
        "WIND",
        "SNOW",
        "ROSE",
        "BOOK",
        "DOOR",
        "KEY",
        "LOCK",
        "RING",
        "GOLD",
        "BLUE",
        "RED",
        "GAME",
        "TIME",
        "FISH",
        "BIRD",
        "TREE",
        "LION",
        "WOLF",
        "BEAR",
        "FOX",
        "BOMB",
        "SAFE",
        "CASH",
        "COIN",
        "GUN",
        "MASK",
        "SHIP",
        "ROAD",
        "KING",
        "QUEEN",
        "DARK",
        "LIGHT",
        "NIGHT",
        "DAY",
        "COLD",
        "HEAT",
        "SAND",
        "ROCK",
        "WAVE",
        "RAIN",
        "LAKE",
        "FROG",
        "BEE",
        "OWL",
        "CAT",
        "DOG",

        /*
         * =========================
         * MEDIUM WORDS
         * =========================
         */

        "SHADOW",
        "CASTLE",
        "FOREST",
        "PLANET",
        "POISON",
        "SECRET",
        "CRYSTAL",
        "THUNDER",
        "JOURNEY",
        "DRAGON",
        "KNIGHT",
        "PRISON",
        "DIAMOND",
        "WEAPON",
        "MISSION",
        "CAPTURE",
        "ESCAPE",
        "FORTUNE",
        "VICTORY",
        "TARGET",
        "MYSTERY",
        "DANGER",
        "HUNTER",
        "WARRIOR",
        "PIRATE",
        "DESERT",
        "ISLAND",
        "VOLCANO",
        "TORNADO",
        "STORM",
        "SUMMER",
        "WINTER",
        "SPRING",
        "AUTUMN",
        "BRIDGE",
        "TUNNEL",
        "WINDOW",
        "GARDEN",
        "PALACE",
        "VILLAGE",
        "MARKET",
        "TEMPLE",
        "TOWER",
        "RIVER",
        "OCEAN",
        "MOUNTAIN",
        "VALLEY",
        "CANDLE",
        "HAMMER",
        "SWORD",

        /*
         * =========================
         * LONG WORDS
         * =========================
         */

        "TREASURE",
        "ADVENTURE",
        "UNDERGROUND",
        "DECEPTION",
        "BLACKMARKET",
        "INTELLIGENCE",
        "EXPLOSION",
        "SAFEHOUSE",
        "CRIMINAL",
        "INVESTIGATION",
        "MASTERPLAN",
        "DISGUISE",
        "CONSPIRACY",
        "DETONATOR",
        "CONFIDENTIAL",
        "SURVEILLANCE",
        "ESCAPEPLAN",
        "HEADQUARTERS",
        "SECURITY",
        "INFILTRATION",
        "OPERATION",
        "COMMUNICATION",
        "RECONNAISSANCE",
        "MANIPULATION",
        "INTERROGATION",
        "DISTRACTION",
        "TRANSACTION",
        "BLACKOUT",
        "COUNTERFEIT",
        "PROTECTION",
        "DISCOVERY",
        "SUSPICION",
        "EVIDENCE",
        "FOOTPRINT",
        "FINGERPRINT",
        "PASSWORD",
        "PASSWORDS",
        "SECRETARY",
        "CORRUPTION",

        /*
         * =========================
         * HUMAN NAMES
         * =========================
         */

        "LUNA",
        "LIAM",
        "JAMES",
        "OLIVER",
        "EMMA",
        "NOAH",
        "ETHAN",
        "SOPHIA",
        "CHARLOTTE",
        "DANIEL",
        "MICHAEL",
        "VICTOR",
        "SIMON",
        "HELEN",
        "CLARA",
        "ARTHUR",
        "LEO",
        "JACK",
        "ALICE",
        "ELENA",
        "DAVID",
        "WILLIAM",
        "HENRY",
        "BENJAMIN",
        "LUCAS",
        "MATTHEW",
        "ALEXANDER",
        "JACOB",
        "SAMUEL",
        "OSCAR",
        "THEODORE",
        "EDWARD",
        "GEORGE",
        "CHARLES",
        "THOMAS",
        "JOSEPH",
        "FRANK",
        "PETER",
        "JOHN",
        "ROBERT",
        "JULIA",
        "AMELIA",
        "ISABELLA",
        "MIA",
        "EVELYN",
        "GRACE",
        "CHLOE",
        "VICTORIA",
        "HANNAH",
        "LILY",

        /*
         * =========================
         * ANIMALS
         * =========================
         */

        "TIGER",
        "LION",
        "WOLF",
        "BEAR",
        "EAGLE",
        "SHARK",
        "DOLPHIN",
        "RABBIT",
        "PANDA",
        "ELEPHANT",
        "GIRAFFE",
        "MONKEY",
        "PENGUIN",
        "TURTLE",
        "CROCODILE",
        "SNAKE",
        "LEOPARD",
        "CHEETAH",
        "GORILLA",
        "ZEBRA",
        "HORSE",
        "DONKEY",
        "CAMEL",
        "BUFFALO",
        "DEER",
        "FOX",
        "OTTER",
        "BEAVER",
        "BADGER",
        "WHALE",
        "OCTOPUS",
        "SQUID",
        "LOBSTER",
        "CRAB",
        "SPIDER",
        "SCORPION",
        "BUTTERFLY",
        "PARROT",
        "FALCON",
        "PEACOCK",

        /*
         * =========================
         * NATURE
         * =========================
         */

        "SUN",
        "MOONLIGHT",
        "SUNLIGHT",
        "RAINFOREST",
        "WATERFALL",
        "GLACIER",
        "DESERT",
        "CANYON",
        "FOREST",
        "MEADOW",
        "JUNGLE",
        "RIVERBANK",
        "SUNSET",
        "SUNRISE",
        "RAINBOW",
        "EARTH",
        "PLANET",
        "GALAXY",
        "COMET",
        "METEOR",
        "VOLCANO",
        "EARTHQUAKE",
        "LIGHTNING",
        "HURRICANE",
        "AVALANCHE",

        /*
         * =========================
         * OBJECTS
         * =========================
         */

        "CHAIR",
        "TABLE",
        "MIRROR",
        "PHONE",
        "LAPTOP",
        "CAMERA",
        "CLOCK",
        "WATCH",
        "PENCIL",
        "PAPER",
        "BOTTLE",
        "WINDOW",
        "DOOR",
        "LANTERN",
        "BACKPACK",
        "SUITCASE",
        "UMBRELLA",
        "KEYBOARD",
        "TELEPHONE",
        "TELESCOPE",

        /*
         * =========================
         * ROBBERY THEMED
         * =========================
         */

        "NICKEL",
        "QUILL",
        "INK",
        "VAULT",
        "HEIST",
        "ROBBERY",
        "JEWEL",
        "DIAMOND",
        "MONEY",
        "CASH",
        "COINS",
        "SAFE",
        "LASER",
        "ALARM",
        "GUARD",
        "POLICE",
        "THIEF",
        "MAFIA",
        "GETAWAY",
        "BANK",
        "VAULTCODE",
        "LOCKPICK",
        "BLUEPRINT",
        "PASSWORD",
        "MASTERKEY"
    ];

    /*
     * =========================
     * START GAME
     * =========================
     */

    async start(
        session: RobberySession
    ): Promise<void> {

        /*
         * Remove any stale puzzle
         * belonging to this session.
         *
         * This prevents an old puzzle
         * from surviving if the same
         * session is initialized again.
         */

        this.puzzles.delete(
            session.id
        );

        const answer =
            this.selectRandomWord();

        /*
         * Safety check.
         *
         * The word pool is expected to
         * contain valid A-Z words. If
         * that ever changes, do not create
         * a malformed binary puzzle.
         */

        if (
            !this.isValidWord(
                answer
            )
        ) {

            session.fail(
                "The binary decryption puzzle could not be generated."
            );

            return;
        }

        const binary =
            this.toBinary(
                answer
            );

        this.puzzles.set(
            session.id,
            {
                answer,
                binary
            }
        );
    }

    /*
     * =========================
     * HANDLE ANSWER
     * =========================
     *
     * Binary Decryption allows
     * exactly ONE attempt.
     *
     * The puzzle is consumed before
     * the answer is evaluated.
     */

    async handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyGameResult> {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        /*
         * No active puzzle exists.
         */

        if (!puzzle) {

            return "failed";
        }

        /*
         * Session must still be active.
         */

        if (
            session.status !==
            "active"
        ) {

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Overall robbery timer.
         */

        if (
            session.isExpired
        ) {

            session.expire();

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Consume the puzzle BEFORE
         * checking the answer.
         *
         * This makes the one-attempt
         * rule impossible to bypass.
         */

        this.puzzles.delete(
            session.id
        );

        const submitted =
            this.normalizeAnswer(
                answer
            );

        /*
         * Empty answers are treated
         * as an incorrect decryption.
         */

        if (!submitted) {

            session.fail(
                "No binary decryption was provided."
            );

            return "failed";
        }

        /*
         * =========================
         * CORRECT
         * =========================
         */

        if (
            submitted ===
            puzzle.answer
        ) {


            return "success";
        }

        /*
         * =========================
         * INCORRECT
         * =========================
         *
         * Binary Decryption is a
         * high-risk one-shot puzzle.
         */

        session.fail(
            "The binary code was decrypted incorrectly."
        );

        return "failed";
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    async cancel(
        session: RobberySession
    ): Promise<void> {

        this.puzzles.delete(
            session.id
        );
    }

    /*
     * =========================
     * GET BINARY
     * =========================
     *
     * Used by the interaction/UI
     * layer to display the puzzle.
     */

    getBinary(
        session: RobberySession
    ): string | null {

        return (
            this.puzzles.get(
                session.id
            )?.binary ??
            null
        );
    }

    /*
     * =========================
     * GET ANSWER
     * =========================
     *
     * Internal/debug helper.
     *
     * This must never be exposed
     * through the normal robbery UI.
     */

    getAnswer(
        session: RobberySession
    ): string | null {

        return (
            this.puzzles.get(
                session.id
            )?.answer ??
            null
        );
    }

    /*
     * =========================
     * HAS ACTIVE PUZZLE
     * =========================
     */

    hasPuzzle(
        session: RobberySession
    ): boolean {

        return this.puzzles.has(
            session.id
        );
    }

    /*
     * =========================
     * SELECT RANDOM WORD
     * =========================
     */

    private selectRandomWord(): string {

        if (
            this.wordPool.length ===
            0
        ) {

            return "SHADOW";
        }

        const index =
            Math.floor(
                Math.random() *
                this.wordPool.length
            );

        return (
            this.wordPool[index] ??
            "SHADOW"
        );
    }

    /*
     * =========================
     * NORMALIZE ANSWER
     * =========================
     *
     * Allows harmless formatting
     * differences while preserving
     * the actual answer.
     *
     * Examples:
     *
     * "shadow"
     * " SHADOW "
     * "Shadow"
     *
     * all become:
     *
     * "SHADOW"
     */

    private normalizeAnswer(
        answer: string
    ): string {

        return answer
            .trim()
            .toUpperCase();
    }

    /*
     * =========================
     * VALIDATE WORD
     * =========================
     *
     * Binary Decryption uses
     * standard 8-bit ASCII.
     *
     * Only A-Z characters are
     * accepted.
     */

    private isValidWord(
        word: string
    ): boolean {

        return (
            /^[A-Z]+$/.test(
                word
            )
        );
    }

    /*
     * =========================
     * CONVERT TO BINARY
     * =========================
     *
     * Converts every character
     * into 8-bit ASCII binary.
     *
     * Example:
     *
     * A = 01000001
     * B = 01000010
     *
     * Characters are separated
     * by spaces for readability.
     */

    private toBinary(
        value: string
    ): string {

        return value
            .split("")
            .map(
                character =>
                    character
                        .charCodeAt(0)
                        .toString(2)
                        .padStart(
                            8,
                            "0"
                        )
            )
            .join(" ");
    }
}


END FILE: src/plugins/robbery/games/BinaryDecryptionGame.ts
================================================================================

FILE: src/plugins/robbery/games/ColourGuessGame.ts
--------------------------------------------------------------------------------
Original size: 17014 bytes
Exported size: 16357 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyGame,
    RobberyGameResult
} from "./RobberyGame.js";

import {
    RobberySession
} from "../core/RobberySession.js";

type ColourPuzzle = {
    hex: string;
    answer: string;
    startedAt: number;
};

export class ColourGuessGame
    implements RobberyGame {

    readonly id =
        "colour-guess";

    readonly name =
        "Guess the Colour";

    /*
     * =========================
     * ACTIVE PUZZLES
     * =========================
     *
     * Each robbery session owns
     * exactly one colour puzzle.
     */

    private readonly puzzles =
        new Map<
            string,
            ColourPuzzle
        >();

    /*
     * =========================
     * CONFIGURATION
     * =========================
     *
     * The first three HEX characters
     * are visible immediately.
     *
     * The complete HEX value is revealed
     * after this delay.
     */

    private readonly hexRevealDelayMs =
        10_000;

    /*
     * =========================
     * COLOUR POOL
     * =========================
     *
     * Complete CSS named colour palette.
     *
     * Includes the standard 148 CSS
     * named colours, including aliases
     * such as gray/grey and cyan/aqua.
     */

    private readonly colours = [

        { name: "aliceblue", hex: "#F0F8FF" },
        { name: "antiquewhite", hex: "#FAEBD7" },
        { name: "aqua", hex: "#00FFFF" },
        { name: "aquamarine", hex: "#7FFFD4" },
        { name: "azure", hex: "#F0FFFF" },
        { name: "beige", hex: "#F5F5DC" },
        { name: "bisque", hex: "#FFE4C4" },
        { name: "black", hex: "#000000" },
        { name: "blanchedalmond", hex: "#FFEBCD" },
        { name: "blue", hex: "#0000FF" },
        { name: "blueviolet", hex: "#8A2BE2" },
        { name: "brown", hex: "#A52A2A" },
        { name: "burlywood", hex: "#DEB887" },
        { name: "cadetblue", hex: "#5F9EA0" },
        { name: "chartreuse", hex: "#7FFF00" },
        { name: "chocolate", hex: "#D2691E" },
        { name: "coral", hex: "#FF7F50" },
        { name: "cornflowerblue", hex: "#6495ED" },
        { name: "cornsilk", hex: "#FFF8DC" },
        { name: "crimson", hex: "#DC143C" },
        { name: "cyan", hex: "#00FFFF" },
        { name: "darkblue", hex: "#00008B" },
        { name: "darkcyan", hex: "#008B8B" },
        { name: "darkgoldenrod", hex: "#B8860B" },
        { name: "darkgray", hex: "#A9A9A9" },
        { name: "darkgreen", hex: "#006400" },
        { name: "darkgrey", hex: "#A9A9A9" },
        { name: "darkkhaki", hex: "#BDB76B" },
        { name: "darkmagenta", hex: "#8B008B" },
        { name: "darkolivegreen", hex: "#556B2F" },
        { name: "darkorange", hex: "#FF8C00" },
        { name: "darkorchid", hex: "#9932CC" },
        { name: "darkred", hex: "#8B0000" },
        { name: "darksalmon", hex: "#E9967A" },
        { name: "darkseagreen", hex: "#8FBC8F" },
        { name: "darkslateblue", hex: "#483D8B" },
        { name: "darkslategray", hex: "#2F4F4F" },
        { name: "darkslategrey", hex: "#2F4F4F" },
        { name: "darkturquoise", hex: "#00CED1" },
        { name: "darkviolet", hex: "#9400D3" },
        { name: "deeppink", hex: "#FF1493" },
        { name: "deepskyblue", hex: "#00BFFF" },
        { name: "dimgray", hex: "#696969" },
        { name: "dimgrey", hex: "#696969" },
        { name: "dodgerblue", hex: "#1E90FF" },
        { name: "firebrick", hex: "#B22222" },
        { name: "floralwhite", hex: "#FFFAF0" },
        { name: "forestgreen", hex: "#228B22" },
        { name: "fuchsia", hex: "#FF00FF" },
        { name: "gainsboro", hex: "#DCDCDC" },
        { name: "ghostwhite", hex: "#F8F8FF" },
        { name: "gold", hex: "#FFD700" },
        { name: "goldenrod", hex: "#DAA520" },
        { name: "gray", hex: "#808080" },
        { name: "green", hex: "#008000" },
        { name: "greenyellow", hex: "#ADFF2F" },
        { name: "grey", hex: "#808080" },
        { name: "honeydew", hex: "#F0FFF0" },
        { name: "hotpink", hex: "#FF69B4" },
        { name: "indianred", hex: "#CD5C5C" },
        { name: "indigo", hex: "#4B0082" },
        { name: "ivory", hex: "#FFFFF0" },
        { name: "khaki", hex: "#F0E68C" },
        { name: "lavender", hex: "#E6E6FA" },
        { name: "lavenderblush", hex: "#FFF0F5" },
        { name: "lawngreen", hex: "#7CFC00" },
        { name: "lemonchiffon", hex: "#FFFACD" },
        { name: "lightblue", hex: "#ADD8E6" },
        { name: "lightcoral", hex: "#F08080" },
        { name: "lightcyan", hex: "#E0FFFF" },
        { name: "lightgoldenrodyellow", hex: "#FAFAD2" },
        { name: "lightgray", hex: "#D3D3D3" },
        { name: "lightgreen", hex: "#90EE90" },
        { name: "lightgrey", hex: "#D3D3D3" },
        { name: "lightpink", hex: "#FFB6C1" },
        { name: "lightsalmon", hex: "#FFA07A" },
        { name: "lightseagreen", hex: "#20B2AA" },
        { name: "lightskyblue", hex: "#87CEFA" },
        { name: "lightslategray", hex: "#778899" },
        { name: "lightslategrey", hex: "#778899" },
        { name: "lightsteelblue", hex: "#B0C4DE" },
        { name: "lightyellow", hex: "#FFFFE0" },
        { name: "lime", hex: "#00FF00" },
        { name: "limegreen", hex: "#32CD32" },
        { name: "linen", hex: "#FAF0E6" },
        { name: "magenta", hex: "#FF00FF" },
        { name: "maroon", hex: "#800000" },
        { name: "mediumaquamarine", hex: "#66CDAA" },
        { name: "mediumblue", hex: "#0000CD" },
        { name: "mediumorchid", hex: "#BA55D3" },
        { name: "mediumpurple", hex: "#9370DB" },
        { name: "mediumseagreen", hex: "#3CB371" },
        { name: "mediumslateblue", hex: "#7B68EE" },
        { name: "mediumspringgreen", hex: "#00FA9A" },
        { name: "mediumturquoise", hex: "#48D1CC" },
        { name: "mediumvioletred", hex: "#C71585" },
        { name: "midnightblue", hex: "#191970" },
        { name: "mintcream", hex: "#F5FFFA" },
        { name: "mistyrose", hex: "#FFE4E1" },
        { name: "moccasin", hex: "#FFE4B5" },
        { name: "navajowhite", hex: "#FFDEAD" },
        { name: "navy", hex: "#000080" },
        { name: "oldlace", hex: "#FDF5E6" },
        { name: "olive", hex: "#808000" },
        { name: "olivedrab", hex: "#6B8E23" },
        { name: "orange", hex: "#FFA500" },
        { name: "orangered", hex: "#FF4500" },
        { name: "orchid", hex: "#DA70D6" },
        { name: "palegoldenrod", hex: "#EEE8AA" },
        { name: "palegreen", hex: "#98FB98" },
        { name: "paleturquoise", hex: "#AFEEEE" },
        { name: "palevioletred", hex: "#DB7093" },
        { name: "papayawhip", hex: "#FFEFD5" },
        { name: "peachpuff", hex: "#FFDAB9" },
        { name: "peru", hex: "#CD853F" },
        { name: "pink", hex: "#FFC0CB" },
        { name: "plum", hex: "#DDA0DD" },
        { name: "powderblue", hex: "#B0E0E6" },
        { name: "purple", hex: "#800080" },
        { name: "rebeccapurple", hex: "#663399" },
        { name: "red", hex: "#FF0000" },
        { name: "rosybrown", hex: "#BC8F8F" },
        { name: "royalblue", hex: "#4169E1" },
        { name: "saddlebrown", hex: "#8B4513" },
        { name: "salmon", hex: "#FA8072" },
        { name: "sandybrown", hex: "#F4A460" },
        { name: "seagreen", hex: "#2E8B57" },
        { name: "seashell", hex: "#FFF5EE" },
        { name: "sienna", hex: "#A0522D" },
        { name: "silver", hex: "#C0C0C0" },
        { name: "skyblue", hex: "#87CEEB" },
        { name: "slateblue", hex: "#6A5ACD" },
        { name: "slategray", hex: "#708090" },
        { name: "slategrey", hex: "#708090" },
        { name: "snow", hex: "#FFFAFA" },
        { name: "springgreen", hex: "#00FF7F" },
        { name: "steelblue", hex: "#4682B4" },
        { name: "tan", hex: "#D2B48C" },
        { name: "teal", hex: "#008080" },
        { name: "thistle", hex: "#D8BFD8" },
        { name: "tomato", hex: "#FF6347" },
        { name: "turquoise", hex: "#40E0D0" },
        { name: "violet", hex: "#EE82EE" },
        { name: "wheat", hex: "#F5DEB3" },
        { name: "white", hex: "#FFFFFF" },
        { name: "whitesmoke", hex: "#F5F5F5" },
        { name: "yellow", hex: "#FFFF00" },
        { name: "yellowgreen", hex: "#9ACD32" }

    ] as const;

    /*
     * =========================
     * START GAME
     * =========================
     */

    async start(
        session: RobberySession
    ): Promise<void> {

        /*
         * Remove stale state first.
         *
         * This prevents a previous puzzle
         * from surviving if a session is
         * accidentally started again.
         */

        this.puzzles.delete(
            session.id
        );

        const colour =
            this.colours[
                Math.floor(
                    Math.random() *
                    this.colours.length
                )
            ];

        /*
         * The colour pool is guaranteed
         * to contain entries, but keep a
         * defensive fallback for safety.
         */

        if (!colour) {

            session.fail(
                "The colour security system failed to generate a puzzle."
            );

            return;
        }

        this.puzzles.set(
            session.id,
            {
                hex:
                    colour.hex,

                answer:
                    colour.name,

                startedAt:
                    Date.now()
            }
        );
    }

    /*
     * =========================
     * HANDLE ANSWER
     * =========================
     *
     * Guess the Colour allows exactly
     * one answer.
     *
     * A correct answer completes the
     * game immediately.
     *
     * An incorrect answer permanently
     * fails the game.
     */

    async handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyGameResult> {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        /*
         * No active puzzle.
         */

        if (!puzzle) {
            return "failed";
        }

        /*
         * Session must still be active.
         */

        if (
            session.status !==
            "active"
        ) {

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Overall robbery timer.
         */

        if (
            session.isExpired
        ) {

            session.expire();

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        const normalized =
            this.normalizeAnswer(
                answer
            );

        /*
         * Empty answers are never
         * considered valid.
         */

        if (!normalized) {

            session.fail(
                "No colour was provided."
            );

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * =========================
         * ANSWER MATCHING
         * =========================
         *
         * The player may answer with:
         *
         * Colour name:
         *   lightblue
         *   light blue
         *   LIGHT-BLUE
         *
         * Or HEX:
         *   #ADD8E6
         *   ADD8E6
         */

        const normalizedName =
            this.normalizeColourName(
                puzzle.answer
            );

        const normalizedHex =
            this.normalizeHex(
                puzzle.hex
            );

        const isCorrect =
            normalized ===
                normalizedName ||
            normalized ===
                normalizedHex;

        /*
         * =========================
         * CORRECT
         * =========================
         */

        if (isCorrect) {

            this.puzzles.delete(
                session.id
            );

            return "success";
        }

        /*
         * =========================
         * INCORRECT
         * =========================
         *
         * There is no second attempt.
         */

        session.fail(
            "The colour was identified incorrectly."
        );

        this.puzzles.delete(
            session.id
        );

        return "failed";
    }

    /*
     * =========================
     * NORMALIZE ANSWER
     * =========================
     *
     * Used for colour names.
     *
     * Removes:
     * - surrounding whitespace
     * - internal whitespace
     * - hyphens
     * - underscores
     *
     * Converts the result to lowercase.
     */

    private normalizeAnswer(
        answer: string
    ): string {

        return answer
            .trim()
            .toLowerCase()
            .replace(
                /[\s_-]+/g,
                ""
            );
    }

    /*
     * =========================
     * NORMALIZE COLOUR NAME
     * =========================
     */

    private normalizeColourName(
        name: string
    ): string {

        return name
            .trim()
            .toLowerCase()
            .replace(
                /[\s_-]+/g,
                ""
            );
    }

    /*
     * =========================
     * NORMALIZE HEX
     * =========================
     *
     * Accepts:
     *
     * #ADD8E6
     * ADD8E6
     *
     * The leading # is optional.
     */

    private normalizeHex(
        hex: string
    ): string {

        return hex
            .trim()
            .toLowerCase()
            .replace(
                /^#/,
                ""
            );
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    async cancel(
        session: RobberySession
    ): Promise<void> {

        this.puzzles.delete(
            session.id
        );
    }

    /*
     * =========================
     * GET HEX
     * =========================
     *
     * Returns the complete HEX value.
     *
     * This is intended for the Discord
     * UI when a colour preview is needed.
     */

    getHex(
        session: RobberySession
    ): string | null {

        return (
            this.puzzles.get(
                session.id
            )?.hex ??
            null
        );
    }

    /*
     * =========================
     * GET DISPLAYED HEX
     * =========================
     *
     * Before the reveal delay:
     *
     * #F0████
     *
     * After the reveal delay:
     *
     * #F0F8FF
     *
     * The first two HEX digits remain
     * visible while the remaining four
     * are concealed.
     */

    getDisplayedHex(
        session: RobberySession
    ): string | null {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        if (!puzzle) {
            return null;
        }

        if (
            this.isHexRevealed(
                session
            )
        ) {

            return puzzle.hex;
        }

        return (
            puzzle.hex.slice(
                0,
                3
            ) +
            "████"
        );
    }

    /*
     * =========================
     * HEX REVEAL STATUS
     * =========================
     */

    isHexRevealed(
        session: RobberySession
    ): boolean {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        if (!puzzle) {
            return false;
        }

        return (
            Date.now() -
            puzzle.startedAt >=
            this.hexRevealDelayMs
        );
    }

    /*
     * =========================
     * GET REMAINING REVEAL TIME
     * =========================
     *
     * Returns the number of
     * milliseconds remaining before
     * the complete HEX is revealed.
     *
     * Returns 0 when already revealed
     * or when no puzzle exists.
     */

    getRemainingRevealTime(
        session: RobberySession
    ): number {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        if (!puzzle) {
            return 0;
        }

        return Math.max(
            0,
            this.hexRevealDelayMs -
            (
                Date.now() -
                puzzle.startedAt
            )
        );
    }
}

END FILE: src/plugins/robbery/games/ColourGuessGame.ts
================================================================================

FILE: src/plugins/robbery/games/GuessCharacterGame.ts
--------------------------------------------------------------------------------
Original size: 9238 bytes
Exported size: 8787 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    RobberyGame,
    RobberyGameResult
} from "./RobberyGame.js";

import {
    RobberySession
} from "../core/RobberySession.js";

import {
    GuessCharacterQuestion
} from "../core/GuessCharacterQuestionBank.js";

import {
    GuessCharacterQuestionManager
} from "../core/GuessCharacterQuestionManager.js";

/*
 * =========================
 * GUESS CHARACTER PUZZLE
 * =========================
 */

type GuessCharacterPuzzle = {
    question: GuessCharacterQuestion;
};

/*
 * =========================
 * GUESS CHARACTER GAME
 * =========================
 *
 * Premium robbery game:
 *
 * - One randomly selected character.
 * - Three clues are provided by the
 *   question bank.
 * - Exactly one answer is permitted.
 * - Correct answer completes the game.
 * - Incorrect answer permanently fails
 *   the robbery.
 * - Puzzle state is isolated per
 *   robbery session.
 */

export class GuessCharacterGame
    implements RobberyGame {

    readonly id =
        "guess-character";

    readonly name =
        "Guess the Character";

    /*
     * Each robbery receives its own
     * independent character puzzle.
     */
    private readonly puzzles =
        new Map<
            string,
            GuessCharacterPuzzle
        >();

    constructor(
        private readonly questionManager:
            GuessCharacterQuestionManager
    ) {}

    /*
     * =========================
     * START GAME
     * =========================
     */

    async start(
        session: RobberySession
    ): Promise<void> {

        /*
         * Always clear stale state first.
         *
         * This prevents an old character
         * puzzle from surviving if the same
         * session reaches this game again.
         */
        this.puzzles.delete(
            session.id
        );

        /*
         * Do not initialize a new puzzle
         * for an inactive or expired
         * robbery.
         */
        if (
            session.status !==
            "active"
        ) {
            return;
        }

        if (
            session.isExpired
        ) {

            session.expire();

            return;
        }

        const question =
            this.questionManager.getRandomQuestion();

        /*
         * A missing question is a genuine
         * game configuration/data failure.
         */
        if (!question) {

            session.fail(
                "No character question was available."
            );

            return;
        }

        /*
         * Store the complete puzzle only
         * after it has been successfully
         * generated.
         */
        this.puzzles.set(
            session.id,
            {
                question
            }
        );
    }

    /*
     * =========================
     * HANDLE ANSWER
     * =========================
     *
     * Guess Character intentionally
     * allows exactly ONE attempt.
     */

    async handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyGameResult> {

        const puzzle =
            this.puzzles.get(
                session.id
            );

        /*
         * No puzzle means the game has
         * already been consumed, cancelled,
         * or never initialized.
         */
        if (!puzzle) {
            return "failed";
        }

        /*
         * The robbery must remain active.
         */
        if (
            session.status !==
            "active"
        ) {

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Respect the global robbery timer.
         */
        if (
            session.isExpired
        ) {

            session.expire();

            this.puzzles.delete(
                session.id
            );

            return "failed";
        }

        /*
         * =========================
         * CONSUME ATTEMPT
         * =========================
         *
         * Delete the puzzle BEFORE
         * evaluating the answer.
         *
         * This is the important anti-
         * double-submit protection:
         *
         * once the robber submits,
         * the puzzle no longer exists.
         */
        this.puzzles.delete(
            session.id
        );

        const submitted =
            this.normalizeAnswer(
                answer
            );

        const expected =
            this.normalizeAnswer(
                puzzle.question.character
            );

        /*
         * Empty answers are always
         * considered a failed attempt.
         */
        if (!submitted) {

            session.fail(
                "No character was provided."
            );

            return "failed";
        }

        /*
         * A malformed question with no
         * usable answer should never
         * accidentally allow a robbery.
         */
        if (!expected) {

            session.fail(
                "The character puzzle contained an invalid answer."
            );

            return "failed";
        }

        /*
         * =========================
         * CORRECT ANSWER
         * =========================
         */

        if (
            submitted ===
            expected
        ) {



            return "success";
        }

        /*
         * =========================
         * INCORRECT ANSWER
         * =========================
         *
         * Guess Character is deliberately
         * unforgiving: one wrong answer
         * ends the robbery.
         */
        session.fail(
            "The character was identified incorrectly."
        );

        return "failed";
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    async cancel(
        session: RobberySession
    ): Promise<void> {

        this.puzzles.delete(
            session.id
        );
    }

    /*
     * =========================
     * GET QUESTION
     * =========================
     *
     * Used by the interaction/UI layer
     * when the puzzle needs to be rendered.
     */

    getQuestion(
        session: RobberySession
    ): GuessCharacterQuestion | null {

        return (
            this.puzzles.get(
                session.id
            )?.question ??
            null
        );
    }

    /*
     * =========================
     * GET CLUES
     * =========================
     */

    getClues(
        session: RobberySession
    ): [
        string,
        string,
        string
    ] | null {

        const question =
            this.puzzles.get(
                session.id
            )?.question;

        if (!question) {
            return null;
        }

        /*
         * Return a fresh tuple rather
         * than exposing the stored array.
         */
        return [
            question.clues[0] ?? "",
            question.clues[1] ?? "",
            question.clues[2] ?? ""
        ];
    }

    /*
     * =========================
     * GET CATEGORY
     * =========================
     */

    getCategory(
        session: RobberySession
    ):
        GuessCharacterQuestion["category"]
        | null {

        return (
            this.puzzles.get(
                session.id
            )?.question.category ??
            null
        );
    }

    /*
     * =========================
     * GET SOURCE
     * =========================
     *
     * Internal/UI helper.
     *
     * The source should only be exposed
     * if the robbery UI intentionally
     * reveals it.
     */

    getSource(
        session: RobberySession
    ): string | null {

        return (
            this.puzzles.get(
                session.id
            )?.question.source ??
            null
        );
    }

    /*
     * =========================
     * HAS ACTIVE PUZZLE
     * =========================
     */

    hasPuzzle(
        session: RobberySession
    ): boolean {

        return this.puzzles.has(
            session.id
        );
    }

    /*
     * =========================
     * NORMALIZE ANSWER
     * =========================
     *
     * Allows harmless formatting
     * differences without making
     * the puzzle easier.
     *
     * Examples:
     *
     * "Saitama"
     * "SAITAMA"
     * " saitama "
     * "Saitama!"
     *
     * become equivalent.
     *
     * Spaces, underscores, hyphens
     * and punctuation are ignored.
     */

    private normalizeAnswer(
        answer: string
    ): string {

        return answer
            .trim()
            .toLowerCase()
            .normalize("NFKC")
            .replace(
                /[\s\-_'"’.,!?()[\]{}:;]+/g,
                ""
            );
    }
}

END FILE: src/plugins/robbery/games/GuessCharacterGame.ts
================================================================================

FILE: src/plugins/robbery/games/LockCombinationGame.ts
--------------------------------------------------------------------------------
Original size: 13940 bytes
Exported size: 13283 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    RobberyGame,
    RobberyGameResult
} from "./RobberyGame.js";

import {
    RobberySession
} from "../core/RobberySession.js";

/*
 * =========================
 * LOCK PUZZLE TYPES
 * =========================
 */

type LockPosition = {
    number: number;
    clue: string;
};

type LockPuzzle = {
    first: number;
    second: number;
    attempts: number;
    clues: LockPosition[];
};

/*
 * =========================
 * LOCK COMBINATION GAME
 * =========================
 *
 * Premium robbery puzzle:
 *
 * - Generates a private two-number
 *   combination for every session.
 * - Each number is between 1 and 12.
 * - The robber receives one clue for
 *   each position.
 * - Only one attempt is permitted.
 * - Invalid answers count as the
 *   single attempt.
 * - Successful answers immediately
 *   complete the current game.
 * - Puzzle state is isolated per
 *   robbery session.
 */

export class LockCombinationGame
    implements RobberyGame {

    readonly id =
        "lock-combination";

    readonly name =
        "Lock Combination";

    /*
     * Every robbery session receives
     * completely independent puzzle
     * state.
     */
    private readonly combinations =
        new Map<string, LockPuzzle>();

    /*
     * Premium difficulty:
     * exactly one attempt.
     */
    private readonly maximumAttempts =
        1;

    /*
     * =========================
     * START GAME
     * =========================
     */

    async start(
        session: RobberySession
    ): Promise<void> {

        /*
         * Remove any stale puzzle that
         * may still exist for this session.
         *
         * This is important when a session
         * is reused or a game is restarted.
         */
        this.combinations.delete(
            session.id
        );

        const first =
            this.randomNumber();

        const second =
            this.randomNumber();

        const clues: LockPosition[] = [
            {
                number: first,
                clue:
                    this.generateClockClue(
                        first
                    )
            },

            {
                number: second,
                clue:
                    this.generateClockClue(
                        second
                    )
            }
        ];

        const puzzle: LockPuzzle = {
            first,
            second,
            attempts: 0,
            clues
        };

        /*
         * Store the puzzle only after
         * the complete state has been
         * successfully constructed.
         */
        this.combinations.set(
            session.id,
            puzzle
        );
    }

    /*
     * =========================
     * HANDLE ANSWER
     * =========================
     */

    async handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyGameResult> {

        const puzzle =
            this.combinations.get(
                session.id
            );

        /*
         * No puzzle means the game is
         * no longer active.
         */
        if (!puzzle) {
            return "failed";
        }

        /*
         * The robbery itself must still
         * be active.
         */
        if (
            session.status !==
            "active"
        ) {

            this.combinations.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Respect the global robbery timer.
         */
        if (
            session.isExpired
        ) {

            session.expire();

            this.combinations.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Never allow an answer after
         * the attempt limit has already
         * been consumed.
         */
        if (
            puzzle.attempts >=
            this.maximumAttempts
        ) {

            session.fail(
                "The lock combination attempt has already been used."
            );

            this.combinations.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Every submission consumes
         * the single available attempt.
         */
        puzzle.attempts++;

        const parsed =
            this.parseAnswer(
                answer
            );

        /*
         * Invalid input is still an
         * incorrect attempt.
         */
        if (!parsed) {

            return this.processIncorrectAttempt(
                session,
                puzzle
            );
        }

        /*
         * Compare both positions.
         *
         * Order matters:
         *
         * 3 10
         *
         * is NOT the same as:
         *
         * 10 3
         */
        const correct =
            parsed.first ===
                puzzle.first &&
            parsed.second ===
                puzzle.second;

        if (!correct) {

            return this.processIncorrectAttempt(
                session,
                puzzle
            );
        }

        /*
         * =========================
         * SUCCESS
         * =========================
         */

        this.combinations.delete(
            session.id
        );

        return "success";
    }

    /*
     * =========================
     * INCORRECT ATTEMPT
     * =========================
     */

    private processIncorrectAttempt(
        session: RobberySession,
        puzzle: LockPuzzle
    ): RobberyGameResult {

        /*
         * This game intentionally has
         * only one attempt.
         *
         * Once the answer is incorrect,
         * the robbery fails immediately.
         */
        if (
            puzzle.attempts >=
            this.maximumAttempts
        ) {

            session.fail(
                "The lock combination was incorrect."
            );

            this.combinations.delete(
                session.id
            );

            return "failed";
        }

        /*
         * Defensive fallback.
         *
         * With the current premium
         * configuration this branch
         * should never be reached.
         */
        return "failed";
    }

    /*
     * =========================
     * CANCEL
     * =========================
     */

    async cancel(
        session: RobberySession
    ): Promise<void> {

        this.combinations.delete(
            session.id
        );
    }

    /*
     * =========================
     * GET CLUES
     * =========================
     *
     * Returns a fresh array so callers
     * cannot accidentally mutate the
     * internal puzzle state.
     */

    getClues(
        session: RobberySession
    ): string[] {

        const puzzle =
            this.combinations.get(
                session.id
            );

        if (!puzzle) {
            return [];
        }

        return puzzle.clues.map(
            clue =>
                clue.clue
        );
    }

    /*
     * =========================
     * GET ATTEMPTS
     * =========================
     */

    getAttempts(
        session: RobberySession
    ): number {

        return (
            this.combinations.get(
                session.id
            )?.attempts ??
            0
        );
    }

    /*
     * =========================
     * GET REMAINING ATTEMPTS
     * =========================
     */

    getRemainingAttempts(
        session: RobberySession
    ): number {

        return Math.max(
            0,
            this.maximumAttempts -
                this.getAttempts(
                    session
                )
        );
    }

    /*
     * =========================
     * GET MAX ATTEMPTS
     * =========================
     */

    getMaximumAttempts(): number {

        return this.maximumAttempts;
    }

    /*
     * =========================
     * HAS ACTIVE PUZZLE
     * =========================
     */

    hasPuzzle(
        session: RobberySession
    ): boolean {

        return this.combinations.has(
            session.id
        );
    }

    /*
     * =========================
     * PARSE ANSWER
     * =========================
     *
     * Accepted formats:
     *
     * 3 10
     * 3,10
     * 3-10
     * 3/10
     * 3:10
     *
     * Whitespace around the values
     * is also accepted.
     */

    private parseAnswer(
        answer: string
    ): {
        first: number;
        second: number;
    } | null {

        const normalized =
            answer.trim();

        if (!normalized) {
            return null;
        }

        const parts =
            normalized
                .split(
                    /[\s,:/-]+/
                )
                .filter(Boolean);

        if (
            parts.length !== 2
        ) {
            return null;
        }

        const first =
            Number(
                parts[0]
            );

        const second =
            Number(
                parts[1]
            );

        /*
         * Only finite integers
         * are valid lock positions.
         */
        if (
            !Number.isInteger(first) ||
            !Number.isInteger(second)
        ) {
            return null;
        }

        /*
         * The lock uses a standard
         * 12-position clock.
         */
        if (
            !this.isValidLockNumber(
                first
            ) ||
            !this.isValidLockNumber(
                second
            )
        ) {
            return null;
        }

        return {
            first,
            second
        };
    }

    /*
     * =========================
     * VALIDATE LOCK NUMBER
     * =========================
     */

    private isValidLockNumber(
        number: number
    ): boolean {

        return (
            number >= 1 &&
            number <= 12 &&
            Number.isInteger(number)
        );
    }

    /*
     * =========================
     * RANDOM LOCK NUMBER
     * =========================
     */

    private randomNumber(): number {

        return (
            Math.floor(
                Math.random() * 12
            ) + 1
        );
    }

    /*
     * =========================
     * CLOCK CLUE GENERATOR
     * =========================
     *
     * Each lock position has multiple
     * possible clues. A random clue is
     * selected when the puzzle starts.
     *
     * The clues deliberately avoid
     * revealing the number directly.
     */

    private generateClockClue(
        number: number
    ): string {

        const clues:
            Record<number, string[]> = {

            1: [
                "Just clockwise from 12.",
                "One position clockwise from 12.",
                "Just to the right of 12."
            ],

            2: [
                "Two positions clockwise from 12.",
                "Between 1 and 3 on the clock.",
                "Two steps to the right of 12."
            ],

            3: [
                "The right angle of the clock.",
                "Pointing directly to 3.",
                "Exactly 90 degrees clockwise from 12."
            ],

            4: [
                "One position clockwise from 3.",
                "Between 3 and 6 on the clock.",
                "Just below the right angle."
            ],

            5: [
                "One position counter-clockwise from 6.",
                "Between 4 and 6 on the clock.",
                "Just above the 6 position."
            ],

            6: [
                "Straight down at 6.",
                "Directly opposite 12.",
                "The bottom of the clock."
            ],

            7: [
                "One position clockwise from 6.",
                "Between 6 and 9 on the clock.",
                "Just below the 6 position."
            ],

            8: [
                "Between 7 and 9 on the clock.",
                "One position clockwise from 7.",
                "Just before reaching the 9 position."
            ],

            9: [
                "The left angle of the clock.",
                "Pointing directly to 9.",
                "Exactly 90 degrees counter-clockwise from 12."
            ],

            10: [
                "Two positions counter-clockwise from 12.",
                "Between 9 and 12 on the clock.",
                "Two steps to the left of 12."
            ],

            11: [
                "Just counter-clockwise from 12.",
                "One position to the left of 12.",
                "Just before reaching 12."
            ],

            12: [
                "Straight up at 12.",
                "Directly at the top of the clock.",
                "Pointing straight to 12."
            ]
        };

        const options =
            clues[number];

        if (
            !options ||
            options.length === 0
        ) {
            return "Unknown clock position.";
        }

        return (
            options[
                Math.floor(
                    Math.random() *
                    options.length
                )
            ] ??
            "Unknown clock position."
        );
    }
}


END FILE: src/plugins/robbery/games/LockCombinationGame.ts
================================================================================

FILE: src/plugins/robbery/games/PoliceEscapeGame.ts
--------------------------------------------------------------------------------
Original size: 19880 bytes
Exported size: 19068 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyGame,
    RobberyGameResult,
} from "./RobberyGame.js";

import { RobberySession } from "../core/RobberySession.js";

import {
    RobberyQuestion,
} from "../core/RobberyQuestionBank.js";

import {
    RobberyQuestionManager,
} from "../core/RobberyQuestionManager.js";

import {
    PoliceEscapeMaze,
    PoliceEscapeDirection,
    PoliceEscapeMazeLevel,
    PoliceEscapeCell,
} from "../core/PoliceEscapeMaze.js";

import {
    PoliceEscapeMazeRenderer,
} from "../core/PoliceEscapeMazeRenderer.js";

interface PoliceEscapeState {
    maze: PoliceEscapeMaze;

    currentQuestion: RobberyQuestion | null;

    pendingBomb: boolean;

    pendingBombCell: PoliceEscapeCell | null;

    questionsAsked: number;

    questionsAnswered: number;

    moves: number;

    lastAnswerCorrect: boolean | null;
}

/**
 * Result used by the Discord interaction layer for
 * Police Escape movement.
 *
 * This is intentionally separate from RobberyGameResult
 * because movement is a Police Escape-specific operation.
 */
export type PoliceEscapeMoveResult =
    | {
          type: "blocked";
          message: string;
      }
    | {
          type: "moved";
          message: string;
      }
    | {
          type: "question";
          message: string;
      }
    | {
          type: "bomb";
          message: string;
      }
    | {
          type: "exit";
          message: string;
      }
    | {
          type: "failed";
          message: string;
      };

export class PoliceEscapeGame implements RobberyGame {
    public readonly id =
        "police-escape";

    public readonly name =
        "Police Escape";

    private readonly states =
        new Map<string, PoliceEscapeState>();

    private readonly questionManager =
        new RobberyQuestionManager();

    private readonly renderer =
        new PoliceEscapeMazeRenderer();

    /*
     * =========================================================
     * GAME START
     * =========================================================
     */

    public async start(
        session: RobberySession,
    ): Promise<void> {
        /*
         * Never initialize a game for an inactive or expired
         * robbery session.
         */
        if (
            session.status !== "active" ||
            session.isExpired
        ) {
            return;
        }

        /*
         * Remove any stale state first.
         *
         * This makes start() safe if the same game instance
         * is reused for another stage/session lifecycle.
         */
        this.states.delete(
            session.id,
        );

        const level =
            this.selectRandomLevel();

        const maze =
            new PoliceEscapeMaze(level);

        const state: PoliceEscapeState = {
            maze,

            currentQuestion: null,

            pendingBomb: false,

            pendingBombCell: null,

            questionsAsked: 0,

            questionsAnswered: 0,

            moves: 0,

            lastAnswerCorrect: null,
        };

        this.states.set(
            session.id,
            state,
        );
    }

    /*
     * =========================================================
     * MOVEMENT
     * =========================================================
     */

    public move(
        session: RobberySession,
        direction: PoliceEscapeDirection,
    ): PoliceEscapeMoveResult {
        const state =
            this.states.get(
                session.id,
            );

        if (!state) {
            return {
                type: "failed",
                message:
                    "Police Escape is no longer active.",
            };
        }

        /*
         * =====================================================
         * GLOBAL SESSION EXPIRATION
         * =====================================================
         *
         * The robbery session owns the authoritative timer.
         * Police Escape only reacts to it.
         */
        if (session.isExpired) {
            session.expire();

            this.states.delete(
                session.id,
            );

            return {
                type: "failed",
                message:
                    "The global robbery timer has expired.",
            };
        }

        /*
         * The session may have been completed/failed by
         * another interaction while this button was being
         * processed.
         */
        if (
            session.status !== "active"
        ) {
            this.states.delete(
                session.id,
            );

            return {
                type: "failed",
                message:
                    "This robbery is no longer active.",
            };
        }

        /*
         * =====================================================
         * PENDING QUESTION
         * =====================================================
         *
         * No movement is allowed while a bomb question
         * is waiting for an answer.
         */
        if (
            state.currentQuestion
        ) {
            return {
                type: "bomb",
                message:
                    "Answer the bomb question first.",
            };
        }

        /*
         * =====================================================
         * MOVE
         * =====================================================
         */

        const result =
            state.maze.move(
                direction,
            );

        if (result.blocked) {
            return {
                type: "blocked",
                message:
                    "You cannot move in that direction.",
            };
        }

        state.moves++;

        /*
         * =====================================================
         * EXIT
         * =====================================================
         *
         * Reaching the exit completes this robbery stage.
         *
         * RobberySession decides whether this was the final
         * stage or whether another robbery game follows.
         */
        if (result.exit) {
            const moves =
                state.moves;

            this.states.delete(
                session.id,
            );

            session.completeGame();

            return {
                type: "exit",
                message:
                    `Police escaped the maze in ${moves} moves!`,
            };
        }

        /*
         * =====================================================
         * HIDDEN BOMB
         * =====================================================
         *
         * Bombs are never revealed by the renderer.
         *
         * The question is triggered ONLY when the player
         * steps onto a bomb.
         */
        if (result.bomb) {
            return this.startBombTrivia(
                session,
                state,
            );
        }

        /*
         * =====================================================
         * NORMAL MOVEMENT
         * =====================================================
         *
         * Safe tiles do not trigger trivia.
         *
         * The player is free to continue moving until they
         * either reach the exit or step onto a bomb.
         */
        return {
            type: "moved",
            message:
                "You moved safely. Keep going.",
        };
    }

    /*
     * =========================================================
     * BOMB TRIVIA
     * =========================================================
     */

    private startBombTrivia(
        session: RobberySession,
        state: PoliceEscapeState,
    ): PoliceEscapeMoveResult {
        const position =
            state.maze.getPlayerPosition();

        /*
         * Defensive verification.
         *
         * The maze reported a bomb, so this should normally
         * always be true.
         */
        if (
            !state.maze.isBomb(
                position.row,
                position.column,
            )
        ) {
            return {
                type: "moved",
                message:
                    "You moved onto a safe tile.",
            };
        }

        /*
         * Police Escape uses the difficulty selected once
         * by RobberySession for the entire robbery.
         */
        const question =
            this.questionManager.getRandomQuestion(
                session.difficulty,
            );

        if (!question) {
            this.states.delete(
                session.id,
            );

            session.fail(
                "Unable to generate the Police Escape bomb question.",
            );

            return {
                type: "failed",
                message:
                    "Unable to generate the bomb question. " +
                    "Police Escape failed.",
            };
        }

        /*
         * Store the question and exact bomb location.
         *
         * The bomb remains hidden in the maze until the
         * question is answered correctly.
         */
        state.currentQuestion =
            question;

        state.pendingBomb =
            true;

        state.pendingBombCell = {
            row: position.row,
            column: position.column,
        };

        state.questionsAsked++;

        state.lastAnswerCorrect =
            null;

        return {
            type: "bomb",
            message:
                "💣 You stepped on a hidden bomb!\n\n" +
                "Answer the trivia question to diffuse it.",
        };
    }

    /*
     * =========================================================
     * ANSWER
     * =========================================================
     *
     * Implements the generic RobberyGame contract.
     *
     * IMPORTANT:
     *
     * The question is consumed BEFORE its answer is evaluated.
     * This guarantees the one-attempt rule even if Discord
     * receives duplicate interactions.
     */

    public async handleAnswer(
        session: RobberySession,
        answer: string,
    ): Promise<RobberyGameResult> {
        const state =
            this.states.get(
                session.id,
            );

        if (!state) {
            return "failed";
        }

        /*
         * =====================================================
         * EXPIRATION
         * =====================================================
         */

        if (session.isExpired) {
            session.expire();

            this.states.delete(
                session.id,
            );

            return "failed";
        }

        if (
            session.status !== "active"
        ) {
            this.states.delete(
                session.id,
            );

            return "failed";
        }

        /*
         * =====================================================
         * GET CURRENT QUESTION
         * =====================================================
         */

        const question =
            state.currentQuestion;

        if (!question) {
            /*
             * The question has already been consumed.
             *
             * This prevents a second answer attempt.
             */
            return "failed";
        }

        /*
         * =====================================================
         * CONSUME QUESTION FIRST
         * =====================================================
         *
         * This is deliberately done before validation.
         *
         * Once an answer submission reaches this point,
         * the question can never be answered again.
         */

        state.currentQuestion =
            null;

        const wasBomb =
            state.pendingBomb;

        const bombCell =
            state.pendingBombCell;

        state.pendingBomb =
            false;

        state.pendingBombCell =
            null;

        state.questionsAnswered++;

        /*
         * Reset first so a stale value can never be mistaken
         * for the result of the current answer.
         */
        state.lastAnswerCorrect =
            null;

        const correct =
            this.isCorrectAnswer(
                question,
                answer,
            );

        state.lastAnswerCorrect =
            correct;

        /*
         * =====================================================
         * BOMB ANSWER
         * =====================================================
         */

        if (wasBomb) {
            if (!bombCell) {
                this.states.delete(
                    session.id,
                );

                session.fail(
                    "The Police Escape bomb state became invalid.",
                );

                return "failed";
            }

            /*
             * =================================================
             * CORRECT BOMB ANSWER
             * =================================================
             *
             * Diffuse the bomb.
             *
             * The bomb remains hidden in the maze.
             *
             * The player simply continues through the maze.
             */
            if (correct) {
                state.maze.diffuseBomb(
                    bombCell.row,
                    bombCell.column,
                );

                return "success";
            }

            /*
             * =================================================
             * WRONG BOMB ANSWER
             * =================================================
             *
             * One wrong answer immediately detonates the bomb
             * and fails the robbery.
             */
            this.states.delete(
                session.id,
            );

            session.fail(
                "The Police Escape bomb detonated after an incorrect answer.",
            );

            return "failed";
        }

        /*
         * There should be no normal trivia questions anymore.
         *
         * A question is created only when the player steps
         * onto a bomb.
         */
        return "failed";
    }

    /*
     * =========================================================
     * QUESTION ACCESS
     * =========================================================
     */

    public getCurrentQuestion(
        sessionId: string,
    ): RobberyQuestion | null {
        return (
            this.states.get(
                sessionId,
            )?.currentQuestion ?? null
        );
    }

    public hasPendingBomb(
        sessionId: string,
    ): boolean {
        return (
            this.states.get(
                sessionId,
            )?.pendingBomb ?? false
        );
    }

    public getPendingBombCell(
        sessionId: string,
    ): PoliceEscapeCell | null {
        const cell =
            this.states.get(
                sessionId,
            )?.pendingBombCell;

        if (!cell) {
            return null;
        }

        return {
            row: cell.row,
            column: cell.column,
        };
    }

    public getLastAnswerCorrect(
        sessionId: string,
    ): boolean | null {
        return (
            this.states.get(
                sessionId,
            )?.lastAnswerCorrect ?? null
        );
    }

    /*
     * =========================================================
     * MAZE ACCESS
     * =========================================================
     */

    public getMaze(
        sessionId: string,
    ): PoliceEscapeMaze | null {
        return (
            this.states.get(
                sessionId,
            )?.maze ?? null
        );
    }

    /**
     * Render the active maze.
     *
     * Bombs are intentionally never supplied separately to
     * the renderer, so active bombs remain hidden.
     */
    public async getRenderedMaze(
        sessionId: string,
    ): Promise<Buffer | null> {
        const state =
            this.states.get(
                sessionId,
            );

        if (!state) {
            return null;
        }

        return this.renderer.render(
            state.maze,
        );
    }

    public getLevel(
        sessionId: string,
    ): PoliceEscapeMazeLevel | null {
        return (
            this.states.get(
                sessionId,
            )?.maze.getLevel() ?? null
        );
    }

    public getPlayerPosition(
        sessionId: string,
    ): PoliceEscapeCell | null {
        const position =
            this.states.get(
                sessionId,
            )?.maze.getPlayerPosition();

        if (!position) {
            return null;
        }

        return {
            row: position.row,
            column: position.column,
        };
    }

    public getBombs(
        sessionId: string,
    ): PoliceEscapeCell[] {
        return (
            this.states.get(
                sessionId,
            )?.maze.getBombs() ?? []
        );
    }

    public getDiffusedBombCount(
        sessionId: string,
    ): number {
        return (
            this.states.get(
                sessionId,
            )?.maze.getDiffusedBombCount() ?? 0
        );
    }

    public getMoves(
        sessionId: string,
    ): number {
        return (
            this.states.get(
                sessionId,
            )?.moves ?? 0
        );
    }

    public getQuestionsAsked(
        sessionId: string,
    ): number {
        return (
            this.states.get(
                sessionId,
            )?.questionsAsked ?? 0
        );
    }

    public getQuestionsAnswered(
        sessionId: string,
    ): number {
        return (
            this.states.get(
                sessionId,
            )?.questionsAnswered ?? 0
        );
    }

    /*
     * =========================================================
     * CLEANUP
     * =========================================================
     */

    public async cancel(
        session: RobberySession,
    ): Promise<void> {
        this.states.delete(
            session.id,
        );
    }

    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    private selectRandomLevel():
        PoliceEscapeMazeLevel {
        const levels:
            PoliceEscapeMazeLevel[] =
            [3, 4, 5];

        const index =
            Math.floor(
                Math.random() *
                levels.length,
            );

        return levels[index]!;
    }

    private isCorrectAnswer(
        question: RobberyQuestion,
        answer: string,
    ): boolean {
        const normalizedAnswer =
            answer
                .trim()
                .toLowerCase();

        const normalizedCorrectAnswer =
            question.answer
                .trim()
                .toLowerCase();

        return (
            normalizedAnswer ===
            normalizedCorrectAnswer
        );
    }
}

END FILE: src/plugins/robbery/games/PoliceEscapeGame.ts
================================================================================

FILE: src/plugins/robbery/games/RobberyGame.ts
--------------------------------------------------------------------------------
Original size: 1382 bytes
Exported size: 1326 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { RobberySession } from "../core/RobberySession.js";

/**
 * Result returned by a robbery game after
 * processing the robber's answer.
 */
export type RobberyGameResult =
    | "success"
    | "failed";

/**
 * Contract implemented by every robbery minigame.
 *
 * Each game is responsible for:
 * - Starting its puzzle state for a session.
 * - Validating submitted answers.
 * - Reporting whether the current game was solved.
 * - Optionally cleaning up its state when cancelled.
 */
export interface RobberyGame {

    /**
     * Unique identifier used by the robbery game manager.
     */
    readonly id: string;

    /**
     * Human-readable game name.
     */
    readonly name: string;

    /**
     * Initializes the game for a robbery session.
     */
    start(
        session: RobberySession
    ): Promise<void>;

    /**
     * Processes an answer submitted by the robber.
     *
     * "success" means the current game was solved.
     * "failed" means the submitted answer caused the game
     * or robbery to fail according to the game's rules.
     */
    handleAnswer(
        session: RobberySession,
        answer: string
    ): Promise<RobberyGameResult>;

    /**
     * Optional cleanup hook for cancelling a game.
     */
    cancel?(
        session: RobberySession
    ): Promise<void>;
}

END FILE: src/plugins/robbery/games/RobberyGame.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/PoliceClueSearchGame.ts
--------------------------------------------------------------------------------
Original size: 18782 bytes
Exported size: 18220 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyPoliceGame,
    RobberyPoliceGameResult
} from "./RobberyPoliceGame.js";

interface CluePuzzle {
    clues: string[];
    answer: string;
}

export class PoliceClueSearchGame
    implements RobberyPoliceGame {

    public readonly id =
        "clue-search";

    public readonly name =
        "Clue Search";

    private readonly puzzles =
        new Map<string, CluePuzzle>();

    private readonly puzzlePool: CluePuzzle[] = [
        {
            clues: [
                "The robber avoided the main entrance.",
                "The east wing camera went offline.",
                "A maintenance door was opened.",
                "The vault temperature remained normal."
            ],
            answer: "service tunnel"
        },
        {
            clues: [
                "The north camera recorded movement.",
                "The eastern corridor was empty.",
                "The vault door was accessed.",
                "The service tunnel alarm never triggered."
            ],
            answer: "vault"
        },
        {
            clues: [
                "The southern entrance remained locked.",
                "A signal was detected near the east wing.",
                "The vault alarm was silent.",
                "No maintenance access was recorded."
            ],
            answer: "east wing"
        },
        {
            clues: [
                "The maintenance system reported no access.",
                "The eastern corridor was clear.",
                "The vault was untouched.",
                "A northern camera detected movement."
            ],
            answer: "north gate"
        },
        {
            clues: [
                "A camera detected movement near the control systems.",
                "No evidence was found in the vault.",
                "The main entrance showed no activity.",
                "Several monitors were still active."
            ],
            answer: "control room"
        },
        {
            clues: [
                "The security cameras were monitored from this location.",
                "An officer reported seeing someone nearby.",
                "The vault showed no signs of forced entry.",
                "The main lobby remained quiet."
            ],
            answer: "security office"
        },
        {
            clues: [
                "The robber passed several security cameras.",
                "No one entered through the main lobby.",
                "The eastern side of the building showed movement.",
                "A locked door was found open."
            ],
            answer: "east corridor"
        },
        {
            clues: [
                "The western camera detected movement.",
                "The southern entrance was untouched.",
                "A guard heard footsteps nearby.",
                "The northern cameras showed nothing."
            ],
            answer: "west gate"
        },
        {
            clues: [
                "Maintenance equipment was disturbed.",
                "No officers were stationed nearby.",
                "The main corridor remained clear.",
                "A service door was found unlocked."
            ],
            answer: "maintenance room"
        },
        {
            clues: [
                "A vehicle was seen entering the building.",
                "The main entrance remained empty.",
                "Several crates were moved.",
                "Security personnel reported activity nearby."
            ],
            answer: "loading bay"
        },
        {
            clues: [
                "The northern camera recorded a brief movement.",
                "The southern corridor was empty.",
                "No alarms were triggered.",
                "The movement continued toward the upper level."
            ],
            answer: "north corridor"
        },
        {
            clues: [
                "Several pieces of evidence were recovered.",
                "The vault was never opened.",
                "Officers secured the surrounding area.",
                "The collected evidence was stored nearby."
            ],
            answer: "evidence room"
        },
        {
            clues: [
                "An officer questioned a witness.",
                "The room had no external entrance.",
                "A recording device was active.",
                "The suspect was not taken to a cell."
            ],
            answer: "interrogation room"
        },
        {
            clues: [
                "Several vehicles were parked nearby.",
                "The main building entrance was quiet.",
                "A camera captured movement outside.",
                "Tire marks were found on the ground."
            ],
            answer: "parking area"
        },
        {
            clues: [
                "The southern camera recorded movement.",
                "The northern entrance remained secure.",
                "No activity was detected in the east wing.",
                "A gate sensor was triggered."
            ],
            answer: "south gate"
        },
        {
            clues: [
                "Movement was detected along the western side.",
                "The eastern entrance remained secure.",
                "A guard reported footsteps.",
                "The main hallway showed no activity."
            ],
            answer: "west corridor"
        },
        {
            clues: [
                "Old case files were stored here.",
                "No suspects were present.",
                "The room had restricted access.",
                "A database terminal was active."
            ],
            answer: "archive room"
        },
        {
            clues: [
                "Staff members normally use this entrance.",
                "The public entrance remained locked.",
                "A security badge was detected.",
                "No vehicles were nearby."
            ],
            answer: "staff entrance"
        },
        {
            clues: [
                "Multiple surveillance feeds were displayed.",
                "The vault alarm was still active.",
                "An officer noticed an unusual camera signal.",
                "No suspects were visible on the main cameras."
            ],
            answer: "camera room"
        },
        {
            clues: [
                "Radio transmissions were detected.",
                "Several officers were receiving instructions.",
                "The main building was under surveillance.",
                "A dispatcher was coordinating units."
            ],
            answer: "radio room"
        },
        {
            clues: [
                "Several officers were coordinating the operation.",
                "A large communications terminal was active.",
                "The suspect's location was being tracked.",
                "Multiple units were receiving instructions."
            ],
            answer: "command center"
        },
        {
            clues: [
                "A police vehicle was parked nearby.",
                "Several pieces of equipment were stored here.",
                "The main building entrance was elsewhere.",
                "Vehicle maintenance tools were visible."
            ],
            answer: "vehicle bay"
        },
        {
            clues: [
                "The area was heavily secured.",
                "No civilians were allowed inside.",
                "A locked door separated the area from the corridor.",
                "Security cameras covered the entrance."
            ],
            answer: "holding cell"
        },
        {
            clues: [
                "Scientific equipment was present.",
                "Evidence samples were being examined.",
                "No suspects were inside.",
                "Several forensic tools were active."
            ],
            answer: "forensics lab"
        },
        {
            clues: [
                "A detective was reviewing an investigation.",
                "Several case files were open.",
                "No prisoners were present.",
                "The room contained multiple desks."
            ],
            answer: "detective office"
        },
        {
            clues: [
                "Emergency communications were active.",
                "Officers were receiving incoming reports.",
                "The room contained several radio consoles.",
                "Multiple units were being dispatched."
            ],
            answer: "dispatch room"
        },
        {
            clues: [
                "A backup entrance was used by officers.",
                "The main entrance remained secure.",
                "The entrance was rarely used by civilians.",
                "A security camera covered the doorway."
            ],
            answer: "backup entrance"
        },
        {
            clues: [
                "The southern side of the building showed activity.",
                "The northern corridor was empty.",
                "A security camera detected movement.",
                "The movement continued toward another entrance."
            ],
            answer: "south corridor"
        },
        {
            clues: [
                "The western side showed no movement.",
                "A camera detected activity near the eastern side.",
                "The main lobby remained empty.",
                "The suspect avoided the center of the building."
            ],
            answer: "east gate"
        },
        {
            clues: [
                "The entrance was located behind the main building.",
                "No public access was permitted.",
                "A service vehicle was nearby.",
                "A maintenance badge was detected."
            ],
            answer: "service entrance"
        },
        {
            clues: [
                "The vault was located at the end of the corridor.",
                "Security cameras covered the area.",
                "The main lobby was several rooms away.",
                "A locked security door was found nearby."
            ],
            answer: "vault corridor"
        },
        {
            clues: [
                "Boxes and equipment were stored here.",
                "No officers were stationed inside.",
                "The room had restricted access.",
                "A storage inventory was found nearby."
            ],
            answer: "storage room"
        },
        {
            clues: [
                "Specialized police equipment was stored here.",
                "The area was not open to civilians.",
                "Several cabinets were locked.",
                "A security badge was required for entry."
            ],
            answer: "equipment room"
        },
        {
            clues: [
                "The route led toward the upper part of the building.",
                "The lower corridors were empty.",
                "A staircase was nearby.",
                "A security camera monitored the area."
            ],
            answer: "roof access"
        },
        {
            clues: [
                "The entrance was located behind the building.",
                "The main doors showed no activity.",
                "A service vehicle was parked nearby.",
                "A rear camera recorded movement."
            ],
            answer: "rear entrance"
        },
        {
            clues: [
                "The route went below the main building.",
                "No natural light was present.",
                "Maintenance cables ran along the walls.",
                "The main corridors showed no activity."
            ],
            answer: "underground passage"
        },
        {
            clues: [
                "Visitors normally entered through this area.",
                "Several cameras monitored the location.",
                "The vault was deeper inside the building.",
                "No maintenance equipment was present."
            ],
            answer: "main lobby"
        },
        {
            clues: [
                "A security checkpoint controlled the entrance.",
                "Visitors were required to stop here.",
                "A badge scanner was active.",
                "An officer was stationed nearby."
            ],
            answer: "security gate"
        },
        {
            clues: [
                "The building had an emergency route here.",
                "The door was clearly marked.",
                "No normal traffic used the entrance.",
                "A security alarm covered the doorway."
            ],
            answer: "emergency exit"
        },
        {
            clues: [
                "The entrance was located on the western side.",
                "The eastern entrance remained secure.",
                "A camera detected movement outside.",
                "The main lobby showed no activity."
            ],
            answer: "west entrance"
        },
        {
            clues: [
                "The entrance was located on the eastern side.",
                "The western cameras showed nothing.",
                "A guard was stationed nearby.",
                "The door connected to an outside walkway."
            ],
            answer: "east entrance"
        },
        {
            clues: [
                "The route was above the main floor.",
                "A staircase led toward the area.",
                "The lower corridor was empty.",
                "A camera monitored the upper level."
            ],
            answer: "upper corridor"
        },
        {
            clues: [
                "The route was below the main floor.",
                "No public visitors were nearby.",
                "Maintenance equipment was present.",
                "A staircase connected the area to the upper floor."
            ],
            answer: "lower corridor"
        },
        {
            clues: [
                "Visitors were required to stop before entering.",
                "An officer checked identification.",
                "A badge scanner was active.",
                "The area was monitored by cameras."
            ],
            answer: "security checkpoint"
        },
        {
            clues: [
                "Only employees normally used this route.",
                "The public entrance was elsewhere.",
                "A staff badge was detected.",
                "The corridor was monitored by cameras."
            ],
            answer: "staff corridor"
        },
        {
            clues: [
                "A surveillance camera was being monitored.",
                "An officer was reviewing several feeds.",
                "The room contained multiple monitors.",
                "A suspicious movement had been recorded."
            ],
            answer: "camera station"
        },
        {
            clues: [
                "A warning system was controlled here.",
                "Several alarm indicators were visible.",
                "An officer checked the control panel.",
                "The vault alarm was connected to the system."
            ],
            answer: "alarm station"
        },
        {
            clues: [
                "Encrypted communications were being monitored.",
                "A suspicious transmission was detected.",
                "An officer was tracking the signal.",
                "Several radio systems were active."
            ],
            answer: "signal station"
        },
        {
            clues: [
                "Everyone entering the area was checked.",
                "A guard monitored the doorway.",
                "A badge scanner was installed.",
                "The area was protected by security cameras."
            ],
            answer: "checkpoint"
        },
        {
            clues: [
                "Sensitive evidence was stored here.",
                "Access was restricted to investigators.",
                "The evidence had been catalogued.",
                "No suspects were allowed inside."
            ],
            answer: "evidence storage"
        },
        {
            clues: [
                "Old investigation records were stored here.",
                "Several files were being reviewed.",
                "Access required authorization.",
                "A computer terminal was active."
            ],
            answer: "records office"
        }
    ];

    async start(
        policeCaseId: string
    ): Promise<void> {

        const puzzle =
            this.puzzlePool[
                Math.floor(
                    Math.random() *
                    this.puzzlePool.length
                )
            ];

        this.puzzles.set(
            policeCaseId,
            {
                clues: [...puzzle.clues],
                answer: puzzle.answer
            }
        );
    }

    async handleAnswer(
        policeCaseId: string,
        answer: string
    ): Promise<RobberyPoliceGameResult> {

        const puzzle =
            this.puzzles.get(
                policeCaseId
            );

        if (!puzzle) {
            return "failed";
        }

        this.puzzles.delete(
            policeCaseId
        );

        return answer
            .trim()
            .toLowerCase() ===
            puzzle.answer
            ? "success"
            : "failed";
    }

    async cancel(
        policeCaseId: string
    ): Promise<void> {

        this.puzzles.delete(
            policeCaseId
        );
    }

    getClues(
        policeCaseId: string
    ): string[] | null {

        const puzzle =
            this.puzzles.get(
                policeCaseId
            );

        return puzzle
            ? [...puzzle.clues]
            : null;
    }

    getAnswer(
        policeCaseId: string
    ): string | null {

        return this.puzzles.get(
            policeCaseId
        )?.answer ?? null;
    }
}

END FILE: src/plugins/robbery/headquarters/police/PoliceClueSearchGame.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/PoliceCodeTraceGame.ts
--------------------------------------------------------------------------------
Original size: 4154 bytes
Exported size: 3945 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyPoliceGame,
    RobberyPoliceGameResult
} from "./RobberyPoliceGame.js";

interface CodePuzzle {
    encoded: string;
    answer: string;
}

export class PoliceCodeTraceGame
    implements RobberyPoliceGame {

    public readonly id =
        "code-trace";

    public readonly name =
        "Code Trace";

    private readonly puzzles =
        new Map<string, CodePuzzle>();

    private readonly values = [
        "POLICE",
        "TRACE",
        "ROBBER",
        "VAULT",
        "SIGNAL",
        "TARGET",
        "SUSPECT",
        "EVIDENCE",
        "CRIME",
        "ALARM",
        "CAMERA",
        "ESCAPE",
        "PATROL",
        "OFFICER",
        "BADGE",
        "JAIL",
        "PRISON",
        "ARREST",
        "CHASE",
        "SHADOW",
        "WITNESS",
        "CLUE",
        "FINGERPRINT",
        "FOOTPRINT",
        "LOCK",
        "KEY",
        "DOOR",
        "WINDOW",
        "TUNNEL",
        "GATE",
        "SERVER",
        "DATABASE",
        "PASSWORD",
        "ACCESS",
        "SECURITY",
        "BREACH",
        "HACKER",
        "NETWORK",
        "MESSAGE",
        "RADIO",
        "DISPATCH",
        "BACKUP",
        "SIREN",
        "HELICOPTER",
        "DRONE",
        "SQUAD",
        "UNIT",
        "COMMAND",
        "HEADQUARTERS",
        "INVESTIGATION",
        "DETECTIVE",
        "INSPECTOR",
        "CAPTURE",
        "SEARCH",
        "RESCUE",
        "MISSION",
        "OPERATION",
        "CRIMINAL",
        "THIEF",
        "BURGLAR",
        "OUTLAW",
        "FUGITIVE",
        "GETAWAY",
        "PURSUIT",
        "ROUTE",
        "PATH",
        "STREET",
        "ALLEY",
        "WAREHOUSE",
        "BANK",
        "MONEY",
        "WALLET",
        "NICKEL",
        "CARD",
        "LOCKER",
        "CHEST",
        "TREASURE",
        "DIAMOND",
        "JEWEL",
        "DOCUMENT",
        "FILE",
        "RECORD",
        "REPORT",
        "CASE",
        "CODE",
        "CIPHER",
        "DECRYPT",
        "ENCRYPT",
        "BINARY",
        "DIGITAL",
        "COMPUTER",
        "TERMINAL",
        "CONSOLE",
        "SCREEN",
        "KEYBOARD",
        "DATABASE",
        "SERVER",
        "FIREWALL",
        "TRACKER",
        "LOCATION"
    ];

    async start(
        policeCaseId: string
    ): Promise<void> {

        const puzzle =
            this.createPuzzle();

        this.puzzles.set(
            policeCaseId,
            puzzle
        );
    }

    async handleAnswer(
        policeCaseId: string,
        answer: string
    ): Promise<RobberyPoliceGameResult> {

        const puzzle =
            this.puzzles.get(
                policeCaseId
            );

        if (!puzzle) {
            return "failed";
        }

        this.puzzles.delete(
            policeCaseId
        );

        return answer
            .trim()
            .toUpperCase() ===
            puzzle.answer
            ? "success"
            : "failed";
    }

    async cancel(
        policeCaseId: string
    ): Promise<void> {

        this.puzzles.delete(
            policeCaseId
        );
    }

    getEncodedCode(
        policeCaseId: string
    ): string | null {

        return this.puzzles.get(
            policeCaseId
        )?.encoded ?? null;
    }

    private createPuzzle(): CodePuzzle {

        const word =
            this.values[
                Math.floor(
                    Math.random() *
                    this.values.length
                )
            ];

        const encoded =
            word
                .split("")
                .map(
                    character =>
                        character
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(8, "0")
                )
                .join(" ");

        return {
            encoded,
            answer: word
        };
    }
}

END FILE: src/plugins/robbery/headquarters/police/PoliceCodeTraceGame.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/PoliceSignalTraceGame.ts
--------------------------------------------------------------------------------
Original size: 14426 bytes
Exported size: 13912 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyPoliceGame,
    RobberyPoliceGameResult
} from "./RobberyPoliceGame.js";

interface SignalPuzzle {
    sequence: string[];
    answer: string;
}

export class PoliceSignalTraceGame
    implements RobberyPoliceGame {

    public readonly id =
        "signal-trace";

    public readonly name =
        "Signal Trace";

    private readonly puzzles =
        new Map<string, SignalPuzzle>();

    private readonly routes = [
        {
            sequence: ["→", "↑", "↑", "→", "↓"],
            answer: "vault"
        },
        {
            sequence: ["↑", "→", "↓", "→", "↑"],
            answer: "east wing"
        },
        {
            sequence: ["←", "↓", "↓", "→", "↑"],
            answer: "service tunnel"
        },
        {
            sequence: ["→", "→", "↑", "←", "↑"],
            answer: "north gate"
        },
        {
            sequence: ["↑", "↑", "→", "↓", "→"],
            answer: "control room"
        },
        {
            sequence: ["←", "↑", "→", "→", "↓"],
            answer: "security office"
        },
        {
            sequence: ["↓", "→", "↑", "→", "↑"],
            answer: "east corridor"
        },
        {
            sequence: ["→", "↓", "←", "↑", "→"],
            answer: "west gate"
        },
        {
            sequence: ["↑", "←", "↓", "↓", "→"],
            answer: "maintenance room"
        },
        {
            sequence: ["↓", "↓", "→", "↑", "←"],
            answer: "loading bay"
        },
        {
            sequence: ["→", "↑", "←", "↑", "↓"],
            answer: "north corridor"
        },
        {
            sequence: ["←", "→", "↑", "↓", "→"],
            answer: "evidence room"
        },
        {
            sequence: ["↑", "→", "↑", "←", "↓"],
            answer: "interrogation room"
        },
        {
            sequence: ["↓", "←", "↑", "→", "↓"],
            answer: "parking area"
        },
        {
            sequence: ["→", "→", "↓", "↓", "↑"],
            answer: "south gate"
        },
        {
            sequence: ["←", "←", "↑", "→", "↓"],
            answer: "west corridor"
        },
        {
            sequence: ["↑", "↓", "→", "→", "←"],
            answer: "archive room"
        },
        {
            sequence: ["↓", "↑", "←", "←", "→"],
            answer: "staff entrance"
        },
        {
            sequence: ["→", "↓", "↓", "↑", "←"],
            answer: "camera room"
        },
        {
            sequence: ["←", "↑", "↑", "→", "↓"],
            answer: "radio room"
        },
        {
            sequence: ["↑", "→", "↓", "←", "↑"],
            answer: "command center"
        },
        {
            sequence: ["↓", "→", "→", "↑", "←"],
            answer: "vehicle bay"
        },
        {
            sequence: ["←", "↓", "→", "↑", "→"],
            answer: "holding cell"
        },
        {
            sequence: ["→", "↑", "↑", "←", "↓"],
            answer: "forensics lab"
        },
        {
            sequence: ["↑", "←", "←", "↓", "→"],
            answer: "detective office"
        },
        {
            sequence: ["↓", "→", "↑", "↑", "←"],
            answer: "dispatch room"
        },
        {
            sequence: ["→", "←", "↓", "↑", "→"],
            answer: "backup entrance"
        },
        {
            sequence: ["←", "→", "→", "↓", "↑"],
            answer: "south corridor"
        },
        {
            sequence: ["↑", "↑", "←", "↓", "→"],
            answer: "north gate"
        },
        {
            sequence: ["↓", "↓", "←", "↑", "→"],
            answer: "west wing"
        },
        {
            sequence: ["→", "↑", "→", "↓", "←"],
            answer: "east gate"
        },
        {
            sequence: ["←", "↓", "←", "↑", "→"],
            answer: "service entrance"
        },
        {
            sequence: ["↑", "→", "→", "↓", "↓"],
            answer: "vault corridor"
        },
        {
            sequence: ["↓", "←", "←", "↑", "→"],
            answer: "storage room"
        },
        {
            sequence: ["→", "↓", "↑", "←", "←"],
            answer: "equipment room"
        },
        {
            sequence: ["↑", "←", "→", "↓", "↑"],
            answer: "roof access"
        },
        {
            sequence: ["↓", "→", "←", "↑", "→"],
            answer: "rear entrance"
        },
        {
            sequence: ["←", "↑", "↓", "→", "↓"],
            answer: "underground passage"
        },
        {
            sequence: ["→", "→", "↑", "↓", "←"],
            answer: "main lobby"
        },
        {
            sequence: ["↑", "↓", "←", "→", "↑"],
            answer: "security gate"
        },
        {
            sequence: ["↓", "↑", "→", "←", "↓"],
            answer: "emergency exit"
        },
        {
            sequence: ["←", "←", "↓", "→", "↑"],
            answer: "west entrance"
        },
        {
            sequence: ["→", "↑", "↓", "→", "←"],
            answer: "east entrance"
        },
        {
            sequence: ["↑", "→", "←", "↑", "↓"],
            answer: "upper corridor"
        },
        {
            sequence: ["↓", "←", "→", "↓", "↑"],
            answer: "lower corridor"
        },
        {
            sequence: ["→", "↓", "→", "↑", "←"],
            answer: "security checkpoint"
        },
        {
            sequence: ["←", "↑", "←", "↓", "→"],
            answer: "staff corridor"
        },
        {
            sequence: ["↑", "↑", "↓", "→", "←"],
            answer: "camera station"
        },
        {
            sequence: ["↓", "→", "↓", "←", "↑"],
            answer: "alarm station"
        },
        {
            sequence: ["→", "←", "↑", "→", "↓"],
            answer: "signal station"
        },
        {
            sequence: ["←", "↓", "↑", "←", "→"],
            answer: "checkpoint"
        },
        {
            sequence: ["↑", "→", "↓", "↓", "←"],
            answer: "evidence storage"
        },
        {
            sequence: ["↓", "←", "↑", "↑", "→"],
            answer: "records office"
        },
        {
            sequence: ["→", "↓", "←", "↓", "↑"],
            answer: "archive corridor"
        },
        {
            sequence: ["←", "↑", "→", "↓", "↓"],
            answer: "holding area"
        },
        {
            sequence: ["↑", "←", "↓", "→", "→"],
            answer: "prisoner entrance"
        },
        {
            sequence: ["↓", "→", "↑", "←", "←"],
            answer: "patrol room"
        },
        {
            sequence: ["→", "↑", "←", "↓", "→"],
            answer: "briefing room"
        },
        {
            sequence: ["←", "↓", "→", "→", "↑"],
            answer: "operation room"
        },
        {
            sequence: ["↑", "→", "↑", "↓", "←"],
            answer: "command room"
        },
        {
            sequence: ["↓", "←", "↓", "→", "↑"],
            answer: "radio station"
        },
        {
            sequence: ["→", "→", "←", "↑", "↓"],
            answer: "dispatch center"
        },
        {
            sequence: ["←", "↑", "↑", "↓", "→"],
            answer: "police entrance"
        },
        {
            sequence: ["↑", "↓", "→", "←", "↓"],
            answer: "garage"
        },
        {
            sequence: ["↓", "→", "→", "←", "↑"],
            answer: "vehicle entrance"
        },
        {
            sequence: ["→", "↓", "↑", "↑", "←"],
            answer: "parking garage"
        },
        {
            sequence: ["←", "←", "↑", "↓", "→"],
            answer: "back corridor"
        },
        {
            sequence: ["↑", "→", "←", "↓", "↓"],
            answer: "rear corridor"
        },
        {
            sequence: ["↓", "↑", "←", "→", "→"],
            answer: "side entrance"
        },
        {
            sequence: ["→", "←", "↓", "→", "↑"],
            answer: "side corridor"
        },
        {
            sequence: ["←", "→", "↑", "↑", "↓"],
            answer: "upper entrance"
        },
        {
            sequence: ["↑", "↓", "←", "↓", "→"],
            answer: "lower entrance"
        },
        {
            sequence: ["↓", "←", "→", "↑", "↑"],
            answer: "maintenance entrance"
        },
        {
            sequence: ["→", "↑", "↓", "←", "↓"],
            answer: "maintenance corridor"
        },
        {
            sequence: ["←", "↓", "↑", "→", "→"],
            answer: "utility room"
        },
        {
            sequence: ["↑", "←", "→", "↑", "↓"],
            answer: "utility corridor"
        },
        {
            sequence: ["↓", "→", "←", "↓", "↑"],
            answer: "power room"
        },
        {
            sequence: ["→", "↓", "↑", "→", "←"],
            answer: "generator room"
        },
        {
            sequence: ["←", "↑", "↓", "←", "→"],
            answer: "control station"
        },
        {
            sequence: ["↑", "→", "↓", "→", "←"],
            answer: "control corridor"
        },
        {
            sequence: ["↓", "←", "↑", "→", "↑"],
            answer: "security corridor"
        },
        {
            sequence: ["→", "↑", "→", "←", "↓"],
            answer: "security entrance"
        },
        {
            sequence: ["←", "↓", "←", "→", "↑"],
            answer: "guard room"
        },
        {
            sequence: ["↑", "←", "↑", "→", "↓"],
            answer: "guard station"
        },
        {
            sequence: ["↓", "→", "↑", "→", "←"],
            answer: "patrol entrance"
        },
        {
            sequence: ["→", "←", "↑", "↓", "↓"],
            answer: "patrol corridor"
        },
        {
            sequence: ["←", "↑", "→", "↑", "↓"],
            answer: "detective entrance"
        },
        {
            sequence: ["↑", "↓", "←", "↑", "→"],
            answer: "detective corridor"
        },
        {
            sequence: ["↓", "→", "↓", "↑", "←"],
            answer: "forensics entrance"
        },
        {
            sequence: ["→", "↑", "↓", "↓", "←"],
            answer: "forensics corridor"
        },
        {
            sequence: ["←", "↓", "↑", "↑", "→"],
            answer: "records entrance"
        },
        {
            sequence: ["↑", "→", "←", "→", "↓"],
            answer: "records corridor"
        },
        {
            sequence: ["↓", "←", "→", "↑", "←"],
            answer: "archive entrance"
        },
        {
            sequence: ["→", "↓", "←", "↑", "↑"],
            answer: "archive station"
        },
        {
            sequence: ["←", "↑", "↓", "→", "↑"],
            answer: "command entrance"
        },
        {
            sequence: ["↑", "←", "↓", "→", "↓"],
            answer: "command corridor"
        },
        {
            sequence: ["↓", "→", "↑", "←", "↑"],
            answer: "dispatch entrance"
        },
        {
            sequence: ["→", "←", "↓", "↑", "↑"],
            answer: "dispatch corridor"
        },
        {
            sequence: ["←", "→", "↑", "↓", "←"],
            answer: "radio entrance"
        },
        {
            sequence: ["↑", "↓", "→", "↑", "←"],
            answer: "radio corridor"
        },
        {
            sequence: ["↓", "←", "↑", "↓", "→"],
            answer: "vault entrance"
        },
        {
            sequence: ["→", "↑", "←", "→", "↓"],
            answer: "vault station"
        }
    ];

    async start(
        policeCaseId: string
    ): Promise<void> {

        const route =
            this.routes[
                Math.floor(
                    Math.random() *
                    this.routes.length
                )
            ];

        this.puzzles.set(
            policeCaseId,
            {
                sequence: [...route.sequence],
                answer: route.answer
            }
        );
    }

    async handleAnswer(
        policeCaseId: string,
        answer: string
    ): Promise<RobberyPoliceGameResult> {

        const puzzle =
            this.puzzles.get(
                policeCaseId
            );

        if (!puzzle) {
            return "failed";
        }

        this.puzzles.delete(
            policeCaseId
        );

        const normalized =
            answer
                .trim()
                .toLowerCase();

        return normalized ===
            puzzle.answer
            ? "success"
            : "failed";
    }

    async cancel(
        policeCaseId: string
    ): Promise<void> {

        this.puzzles.delete(
            policeCaseId
        );
    }

    getSequence(
        policeCaseId: string
    ): string[] | null {

        const puzzle =
            this.puzzles.get(
                policeCaseId
            );

        return puzzle
            ? [...puzzle.sequence]
            : null;
    }

    getAnswer(
        policeCaseId: string
    ): string | null {

        return this.puzzles.get(
            policeCaseId
        )?.answer ?? null;
    }
}

END FILE: src/plugins/robbery/headquarters/police/PoliceSignalTraceGame.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/RobberyPoliceCase.ts
--------------------------------------------------------------------------------
Original size: 4018 bytes
Exported size: 3813 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { RobberySession } from "../../core/RobberySession.js";

export type RobberyPoliceCaseStatus =
    | "active"
    | "success"
    | "failed"
    | "expired";

export type RobberyPoliceGameId =
    | "signal-trace"
    | "code-trace"
    | "clue-search";

export class RobberyPoliceCase {

    public readonly id: string;

    public readonly robberySessionId: string;

    public readonly guildId: string;

    public readonly robberId: string;

    public readonly targetId: string;

    public readonly policeId: string;

    public readonly expiresAt: number;

    public readonly selectedGames: RobberyPoliceGameId[];

    public status:
        RobberyPoliceCaseStatus =
        "active";

    public currentGameIndex = 0;

    public completedGames = 0;

    public failureReason:
        string | null = null;

    constructor(
        session: RobberySession,
        policeId: string
    ) {

        this.id =
            `police-${session.id}-${policeId}-${Date.now()}`;

        this.robberySessionId =
            session.id;

        this.guildId =
            session.guildId;

        this.robberId =
            session.robberId;

        this.targetId =
            session.targetId;

        this.policeId =
            policeId;

        this.expiresAt =
            session.expiresAt;

        this.selectedGames =
            this.selectGames();
    }

    get remainingMs(): number {
        return Math.max(
            0,
            this.expiresAt - Date.now()
        );
    }

    get isExpired(): boolean {
        return (
            this.status === "active" &&
            this.remainingMs <= 0
        );
    }

    get currentGameId():
        RobberyPoliceGameId | null {

        return (
            this.selectedGames[
                this.currentGameIndex
            ] ?? null
        );
    }

    get currentGameNumber(): number {
        return this.currentGameIndex + 1;
    }

    get totalGames(): number {
        return this.selectedGames.length;
    }

    get allGamesCompleted(): boolean {
        return (
            this.completedGames >=
            this.selectedGames.length
        );
    }

    completeGame(): void {

        if (
            this.status !==
            "active"
        ) {
            return;
        }

        if (
            this.allGamesCompleted
        ) {
            return;
        }

        this.completedGames++;
        this.currentGameIndex++;

        if (
            this.allGamesCompleted
        ) {
            this.status =
                "success";
        }
    }

    fail(
        reason: string
    ): void {

        if (
            this.status !==
            "active"
        ) {
            return;
        }

        this.status =
            "failed";

        this.failureReason =
            reason;
    }

    expire(): void {

        if (
            this.status !==
            "active"
        ) {
            return;
        }

        this.status =
            "expired";

        this.failureReason =
            "The Police response timer expired.";
    }

    private selectGames():
        RobberyPoliceGameId[] {

        const pool:
            RobberyPoliceGameId[] = [
                "signal-trace",
                "code-trace",
                "clue-search"
            ];

        for (
            let index =
                pool.length - 1;
            index > 0;
            index--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (index + 1)
                );

            [
                pool[index],
                pool[randomIndex]
            ] = [
                pool[randomIndex],
                pool[index]
            ];
        }

        return pool.slice(0, 2);
    }
}

END FILE: src/plugins/robbery/headquarters/police/RobberyPoliceCase.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/RobberyPoliceGame.ts
--------------------------------------------------------------------------------
Original size: 426 bytes
Exported size: 404 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
export type RobberyPoliceGameResult =
    | "success"
    | "failed";

export interface RobberyPoliceGame {

    readonly id: string;

    readonly name: string;

    start(
        policeCaseId: string
    ): Promise<void>;

    handleAnswer(
        policeCaseId: string,
        answer: string
    ): Promise<RobberyPoliceGameResult>;

    cancel?(
        policeCaseId: string
    ): Promise<void>;
}

END FILE: src/plugins/robbery/headquarters/police/RobberyPoliceGame.ts
================================================================================

FILE: src/plugins/robbery/headquarters/police/RobberyPoliceManager.ts
--------------------------------------------------------------------------------
Original size: 21207 bytes
Exported size: 20261 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { RobberySession } from "../../core/RobberySession.js";

import {
    RobberyManager
} from "../../core/RobberyManager.js";

import {
    EconomyAccountService
} from "../../../economy/services/EconomyAccountService.js";

import {
    RobberyPoliceCase,
    RobberyPoliceGameId
} from "./RobberyPoliceCase.js";

import {
    RobberyPoliceGame,
    RobberyPoliceGameResult
} from "./RobberyPoliceGame.js";

import { PoliceSignalTraceGame } from "./PoliceSignalTraceGame.js";
import { PoliceCodeTraceGame } from "./PoliceCodeTraceGame.js";
import { PoliceClueSearchGame } from "./PoliceClueSearchGame.js";

import {
    RobberyHeadquarters
} from "../RobberyHeadquarters.js";

export type RobberyPoliceAnswerResult =
    | "success"
    | "failed";

export class RobberyPoliceManager {

    private readonly games:
        Map<RobberyPoliceGameId, RobberyPoliceGame>;

    private readonly cases =
        new Map<string, RobberyPoliceCase>();

    private readonly claimedRobberies =
        new Map<string, string>();

    private readonly processingCases =
        new Set<string>();

    constructor(
        private readonly robberyManager:
            RobberyManager,

        private readonly economyAccountService:
            EconomyAccountService,

        private readonly robberyHeadquarters:
            RobberyHeadquarters
    ) {

        this.games =
            new Map<
                RobberyPoliceGameId,
                RobberyPoliceGame
            >([
                [
                    "signal-trace",
                    new PoliceSignalTraceGame()
                ],
                [
                    "code-trace",
                    new PoliceCodeTraceGame()
                ],
                [
                    "clue-search",
                    new PoliceClueSearchGame()
                ]
            ]);
    }

    /*
     * =========================
     * STATUS HELPER
     * =========================
     *
     * Prevents TypeScript control-flow
     * narrowing from incorrectly assuming
     * that policeCase.status can never
     * change after completeGame().
     */

    private getPoliceCaseStatus(
        policeCase: RobberyPoliceCase
    ): RobberyPoliceCase["status"] {

        return policeCase.status;
    }


    getCase(
        policeCaseId: string
    ): RobberyPoliceCase | null {

        return (
            this.cases.get(
                policeCaseId
            ) ?? null
        );
    }


    getCaseByRobbery(
        robberySessionId: string
    ): RobberyPoliceCase | null {

        for (
            const policeCase
            of this.cases.values()
        ) {

            if (
                policeCase.robberySessionId ===
                robberySessionId
            ) {
                return policeCase;
            }
        }

        return null;
    }


    getGame(
        gameId: RobberyPoliceGameId
    ): RobberyPoliceGame | null {

        return (
            this.games.get(
                gameId
            ) ?? null
        );
    }


    getCurrentGame(
        policeCaseId: string
    ): RobberyPoliceGame | null {

        const policeCase =
            this.getCase(
                policeCaseId
            );

        if (!policeCase) {
            return null;
        }

        const gameId =
            policeCase.currentGameId;

        if (!gameId) {
            return null;
        }

        return this.getGame(
            gameId
        );
    }


    /*
     * =========================
     * CREATE POLICE CASE
     * =========================
     *
     * Creates the authoritative Police
     * response for a robbery.
     *
     * The shared Police claim is recorded
     * before awaited Discord operations so
     * two Police members cannot both claim
     * the same robbery.
     */

    async createCase(
        session: RobberySession,
        policeId: string
    ): Promise<RobberyPoliceCase> {

        if (
            session.status !==
            "active"
        ) {
            throw new Error(
                "ROBBERY_NOT_ACTIVE"
            );
        }

        if (
            session.isExpired
        ) {

            session.expire();

            throw new Error(
                "ROBBERY_EXPIRED"
            );
        }

        /*
         * =========================
         * AUTHORITATIVE POLICE CHECK
         * =========================
         *
         * Only a member who currently has
         * the Robbery POLICE role may claim
         * a Police case.
         */

        const isPolice =
            await this.robberyHeadquarters
                .isPolice(
                    session.guildId,
                    policeId
                );

        if (
            !isPolice
        ) {
            throw new Error(
                "POLICE_ROLE_REQUIRED"
            );
        }

        /*
         * =========================
         * EXISTING CLAIM CHECK
         * =========================
         */

        const existingClaim =
            this.claimedRobberies.get(
                session.id
            );

        if (
            existingClaim
        ) {

            if (
                existingClaim !==
                policeId
            ) {
                throw new Error(
                    "POLICE_CASE_ALREADY_CLAIMED"
                );
            }

            const existingCase =
                this.getCaseByRobbery(
                    session.id
                );

            if (
                existingCase
            ) {
                return existingCase;
            }

            throw new Error(
                "POLICE_CASE_STATE_INVALID"
            );
        }

        /*
         * =========================
         * CREATE FIRST CLAIM
         * =========================
         *
         * Record the claim BEFORE any
         * awaited Discord operation.
         *
         * This is the authoritative first-
         * responder race protection.
         */

        this.claimedRobberies.set(
            session.id,
            policeId
        );

        const policeCase =
            new RobberyPoliceCase(
                session,
                policeId
            );

        this.cases.set(
            policeCase.id,
            policeCase
        );

        try {

            /*
             * =========================
             * CREATE PRIVATE POLICE ROOM
             * =========================
             *
             * A Police case cannot proceed
             * without its private workspace.
             */

            const policeRoom =
                await this.robberyHeadquarters
                    .createPoliceRoom(
                        session.guildId,
                        session.id,
                        policeId
                    );

            if (
                !policeRoom
            ) {

                throw new Error(
                    "POLICE_ROOM_CREATION_FAILED"
                );
            }

            /*
             * =========================
             * NOTIFY ROBBER
             * =========================
             *
             * Tell the Robber inside the
             * existing robbery room that
             * Police have responded.
             */

            await this.robberyHeadquarters
                .notifyRobberOfPoliceResponse(
                    session.guildId,
                    session.id,
                    policeId
                );

            /*
             * =========================
             * START FIRST POLICE GAME
             * =========================
             */

            await this.startCurrentGame(
                policeCase
            );

            return policeCase;

        } catch (error) {

            /*
             * Case creation itself failed.
             *
             * Release the claim so another
             * Police member can respond.
             */

            this.claimedRobberies.delete(
                session.id
            );

            this.cases.delete(
                policeCase.id
            );

            throw error;
        }
    }


    /*
     * =========================
     * SUBMIT POLICE ANSWER
     * =========================
     */

    async submitAnswer(
        policeCaseId: string,
        answer: string
    ): Promise<RobberyPoliceAnswerResult> {

        const policeCase =
            this.getCase(
                policeCaseId
            );

        if (!policeCase) {
            return "failed";
        }

        if (
            this.processingCases.has(
                policeCaseId
            )
        ) {
            return "failed";
        }

        if (
            policeCase.status !==
            "active"
        ) {
            return "failed";
        }

        /*
         * =========================
         * GET ROBBERY SESSION
         * =========================
         */

        const session =
            this.robberyManager.getSession(
                policeCase.robberySessionId
            );

        if (!session) {

            policeCase.fail(
                "The robbery session is no longer active."
            );

            await this.cleanupCase(
                policeCase
            );

            return "failed";
        }

        if (
            session.status !==
            "active"
        ) {

            policeCase.fail(
                "The robbery has already been resolved."
            );

            await this.cleanupCase(
                policeCase
            );

            return "failed";
        }

        if (
            policeCase.isExpired ||
            session.isExpired
        ) {

            if (
                session.isExpired
            ) {
                session.expire();
            }

            policeCase.expire();

            await this.cleanupCase(
                policeCase
            );

            await this.robberyManager.expireRobbery(
                session
            );

            return "failed";
        }

        const game =
            this.getCurrentGame(
                policeCaseId
            );

        if (!game) {

            policeCase.fail(
                "The Police game could not be found."
            );

            await this.cleanupCase(
                policeCase
            );

            return "failed";
        }

        this.processingCases.add(
            policeCaseId
        );

        try {

            /*
             * =========================
             * FINAL SESSION CHECK
             * =========================
             */

            if (
                session.status !==
                "active"
            ) {

                policeCase.fail(
                    "The robbery has already been resolved."
                );

                await this.cleanupCase(
                    policeCase
                );

                return "failed";
            }

            if (
                session.isExpired
            ) {

                session.expire();

                policeCase.expire();

                await this.cleanupCase(
                    policeCase
                );

                await this.robberyManager.expireRobbery(
                    session
                );

                return "failed";
            }

            const result:
                RobberyPoliceGameResult =
                await game.handleAnswer(
                    policeCaseId,
                    answer
                );

            /*
             * =========================
             * SHARED SESSION RECHECK
             * =========================
             *
             * The Robber may have resolved
             * the shared session while the
             * Police game was awaiting its
             * answer processing.
             */

            if (
                session.status !==
                "active"
            ) {

                policeCase.fail(
                    "The robbery has already been resolved."
                );

                await this.cleanupCase(
                    policeCase
                );

                return "failed";
            }

            if (
                session.isExpired
            ) {

                session.expire();

                policeCase.expire();

                await this.cleanupCase(
                    policeCase
                );

                await this.robberyManager.expireRobbery(
                    session
                );

                return "failed";
            }

            /*
             * =========================
             * GAME FAILED
             * =========================
             */

            if (
                result ===
                "failed"
            ) {

                policeCase.fail(
                    "The Police challenge was failed."
                );

                await this.cleanupCase(
                    policeCase
                );

                return "failed";
            }

            /*
             * =========================
             * COMPLETE POLICE GAME
             * =========================
             */

            policeCase.completeGame();

            /*
             * =========================
             * POLICE WINNER CLAIM
             * =========================
             *
             * Only the final Police game
             * attempts to claim the shared
             * robbery winner.
             *
             * The claim happens BEFORE any
             * awaited payout or jail operation.
             */

            const statusAfterCompletion =
                this.getPoliceCaseStatus(
                    policeCase
                );

            if (
                statusAfterCompletion ===
                "success"
            ) {

                const policeWon =
                    session.tryClaimWinner(
                        "police"
                    );

                if (!policeWon) {

                    /*
                     * The Robber won first.
                     *
                     * No Police reward and no
                     * jail action may happen.
                     */

                    await this.cleanupCase(
                        policeCase
                    );

                    return "failed";
                }

                /*
                 * Police now owns the shared
                 * robbery winner state.
                 */

                try {

                    await this.economyAccountService
                        .transferPoliceRescueReward(
                            session.guildId,
                            session.targetId,
                            policeCase.policeId
                        );

                    await this.robberyHeadquarters
                        .jailMember(
                            session.guildId,
                            session.robberId
                        );

                } catch (error) {

                    /*
                     * Police already owns the
                     * winner state.
                     *
                     * The robbery must still be
                     * resolved so it cannot remain
                     * active with its economy lock.
                     */

                    await this.robberyManager
                        .resolvePoliceWin(
                            session
                        );

                    await this.cleanupCase(
                        policeCase
                    );

                    throw error;
                }

                /*
                 * Remove the Robber-side games,
                 * expiry timer, session and
                 * economy robbery lock.
                 */

                await this.robberyManager
                    .resolvePoliceWin(
                        session
                    );

                await this.cleanupCase(
                    policeCase
                );

                return "success";
            }

            /*
             * =========================
             * POLICE CASE EXPIRY
             * =========================
             */

            if (
                policeCase.isExpired ||
                session.isExpired
            ) {

                if (
                    session.isExpired
                ) {
                    session.expire();
                }

                policeCase.expire();

                await this.cleanupCase(
                    policeCase
                );

                await this.robberyManager
                    .expireRobbery(
                        session
                    );

                return "failed";
            }

            /*
             * =========================
             * START NEXT POLICE GAME
             * =========================
             */

            await this.startCurrentGame(
                policeCase
            );

            return "success";

        } finally {

            this.processingCases.delete(
                policeCaseId
            );
        }
    }


    /*
     * =========================
     * CANCEL CASE
     * =========================
     */

    async cancelCase(
        policeCaseId: string,
        reason =
            "The Police case was cancelled."
    ): Promise<void> {

        const policeCase =
            this.getCase(
                policeCaseId
            );

        if (!policeCase) {
            return;
        }

        policeCase.fail(
            reason
        );

        await this.cleanupCase(
            policeCase
        );
    }


    /*
     * =========================
     * EXPIRE CASE
     * =========================
     */

    async expireCase(
        policeCaseId: string
    ): Promise<void> {

        const policeCase =
            this.getCase(
                policeCaseId
            );

        if (!policeCase) {
            return;
        }

        policeCase.expire();

        await this.cleanupCase(
            policeCase
        );
    }


    getActiveCaseCount(): number {

        let count = 0;

        for (
            const policeCase
            of this.cases.values()
        ) {

            if (
                policeCase.status ===
                "active"
            ) {
                count++;
            }
        }

        return count;
    }


    /*
     * =========================
     * START CURRENT GAME
     * =========================
     */

    private async startCurrentGame(
        policeCase: RobberyPoliceCase
    ): Promise<void> {

        const gameId =
            policeCase.currentGameId;

        if (!gameId) {
            throw new Error(
                "POLICE_GAME_NOT_FOUND"
            );
        }

        const game =
            this.games.get(
                gameId
            );

        if (!game) {
            throw new Error(
                `Police game "${gameId}" is not registered.`
            );
        }

        await game.start(
            policeCase.id
        );
    }


    /*
     * =========================
     * CLEANUP CASE
     * =========================
     */

    private async cleanupCase(
        policeCase: RobberyPoliceCase
    ): Promise<void> {

        const gameId =
            policeCase.currentGameId;

        if (gameId) {

            const game =
                this.games.get(
                    gameId
                );

            if (
                game?.cancel
            ) {

                await game.cancel(
                    policeCase.id
                );
            }
        }

        this.cases.delete(
            policeCase.id
        );

        const claimedBy =
            this.claimedRobberies.get(
                policeCase.robberySessionId
            );

        if (
            claimedBy ===
            policeCase.policeId
        ) {

            this.claimedRobberies.delete(
                policeCase.robberySessionId
            );
        }
    }
}

END FILE: src/plugins/robbery/headquarters/police/RobberyPoliceManager.ts
================================================================================

FILE: src/plugins/robbery/headquarters/RobberyHeadquarters.ts
--------------------------------------------------------------------------------
Original size: 16908 bytes
Exported size: 16133 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    RobberyRole
} from "../../../generated/prisma/client.js";

import {
    PrismaService
} from "../../../core/database/PrismaService.js";

import {
    RobberyNotificationService
} from "./RobberyNotificationService.js";

import {
    TextChannel
} from "discord.js";

export class RobberyHeadquarters {

    private static readonly POLICE_INACTIVITY_DAYS = 30;
    private static readonly POLICE_ASSIGNMENT_COOLDOWN_DAYS = 14;
    private static readonly POLICE_PER_MEMBER_BLOCK = 20;
    private static readonly MEMBERS_PER_POLICE_BLOCK = 100;
    private static readonly JAIL_DURATION_DAYS = 7;

    constructor(
        private readonly database: PrismaService,
        private readonly notificationService:
            RobberyNotificationService
    ) {}


    async getProfile(
        guildId: string,
        discordId: string
    ) {

        return await this.database.db.robberyProfile.upsert({

            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            create: {
                guildId,
                discordId
            },

            update: {}
        });
    }


    async getRole(
        guildId: string,
        discordId: string
    ): Promise<RobberyRole | null> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        if (
            profile.role ===
            RobberyRole.JAIL &&
            (
                !profile.jailedUntil ||
                profile.jailedUntil.getTime() <= Date.now()
            )
        ) {

            await this.database.db.robberyProfile.update({

                where: {
                    id: profile.id
                },

                data: {
                    role: null,
                    jailedUntil: null
                }
            });

            return null;
        }

        return profile.role;
    }


    /*
     * =========================
     * POLICE ROLE CHECK
     * =========================
     *
     * Authoritative Police-role
     * verification.
     *
     * Police interactions must never
     * rely on Discord button visibility
     * or cached UI state.
     */

    async isPolice(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        const role =
            await this.getRole(
                guildId,
                discordId
            );

        return (
            role ===
            RobberyRole.POLICE
        );
    }


    async jailMember(
        guildId: string,
        discordId: string
    ): Promise<void> {

        const now =
            new Date();

        const jailedUntil =
            new Date(
                now.getTime() +
                RobberyHeadquarters.JAIL_DURATION_DAYS *
                24 *
                60 *
                60 *
                1000
            );

        await this.database.db.robberyProfile.upsert({

            where: {
                guildId_discordId: {
                    guildId,
                    discordId
                }
            },

            create: {
                guildId,
                discordId,
                role: RobberyRole.JAIL,
                jailedUntil
            },

            update: {
                role: RobberyRole.JAIL,
                jailedUntil
            }
        });
    }


    async isJailed(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        if (
            profile.role !==
            RobberyRole.JAIL
        ) {
            return false;
        }

        if (
            !profile.jailedUntil ||
            profile.jailedUntil.getTime() <= Date.now()
        ) {

            await this.database.db.robberyProfile.update({

                where: {
                    id: profile.id
                },

                data: {
                    role: null,
                    jailedUntil: null
                }
            });

            return false;
        }

        return true;
    }


    async assignRobber(
        guildId: string,
        discordId: string
    ): Promise<void> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        const previousRole =
            profile.role;

        await this.database.db.robberyProfile.update({

            where: {
                id: profile.id
            },

            data: {
                role: RobberyRole.ROBBER,
                jailedUntil: null
            }
        });

        if (
            previousRole !==
            RobberyRole.ROBBER
        ) {

            await this.notificationService
                .notifyRobberAssigned(
                    discordId
                );
        }
    }


    async recordWager(
        guildId: string,
        discordId: string
    ): Promise<void> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        const wasPolice =
            profile.role ===
            RobberyRole.POLICE;

        await this.database.db.robberyProfile.update({

            where: {
                id: profile.id
            },

            data: {
                lastWagerAt: new Date(),

                role:
                    wasPolice
                        ? null
                        : profile.role
            }
        });

        if (wasPolice) {

            await this.notificationService
                .notifyPoliceRemoved(
                    discordId
                );
        }
    }


    getPoliceCapacity(
        memberCount: number
    ): number {

        if (
            !Number.isFinite(memberCount) ||
            memberCount < 0
        ) {
            return 0;
        }

        const completedBlocks =
            Math.floor(
                memberCount /
                RobberyHeadquarters.MEMBERS_PER_POLICE_BLOCK
            );

        return (
            completedBlocks *
            RobberyHeadquarters.POLICE_PER_MEMBER_BLOCK
        );
    }


    async getPoliceCount(
        guildId: string
    ): Promise<number> {

        return await this.database.db.robberyProfile.count({

            where: {
                guildId,
                role: RobberyRole.POLICE
            }
        });
    }


    async hasPoliceCapacity(
        guildId: string,
        memberCount: number
    ): Promise<boolean> {

        const capacity =
            this.getPoliceCapacity(
                memberCount
            );

        if (
            capacity <= 0
        ) {
            return false;
        }

        const currentPolice =
            await this.getPoliceCount(
                guildId
            );

        return (
            currentPolice <
            capacity
        );
    }


    async isEligibleForPolice(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        if (
            profile.role ===
            RobberyRole.POLICE
        ) {
            return false;
        }

        if (
            profile.role ===
            RobberyRole.JAIL
        ) {

            if (
                profile.jailedUntil &&
                profile.jailedUntil.getTime() > Date.now()
            ) {
                return false;
            }

            await this.database.db.robberyProfile.update({

                where: {
                    id: profile.id
                },

                data: {
                    role: null,
                    jailedUntil: null
                }
            });
        }

        const now =
            new Date();

        if (
            !profile.lastWagerAt
        ) {
            return true;
        }

        const inactivityMs =
            now.getTime() -
            profile.lastWagerAt.getTime();

        const requiredMs =
            RobberyHeadquarters.POLICE_INACTIVITY_DAYS *
            24 *
            60 *
            60 *
            1000;

        return (
            inactivityMs >=
            requiredMs
        );
    }


    async isPoliceAssignmentOnCooldown(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        const profile =
            await this.getProfile(
                guildId,
                discordId
            );

        if (
            !profile.roleAssignedAt
        ) {
            return false;
        }

        const now =
            new Date();

        const cooldownMs =
            RobberyHeadquarters.POLICE_ASSIGNMENT_COOLDOWN_DAYS *
            24 *
            60 *
            60 *
            1000;

        return (
            now.getTime() -
            profile.roleAssignedAt.getTime() <
            cooldownMs
        );
    }


    async assignPolice(
        guildId: string,
        discordId: string,
        memberCount: number
    ): Promise<boolean> {

        const eligible =
            await this.isEligibleForPolice(
                guildId,
                discordId
            );

        if (!eligible) {
            return false;
        }

        const cooldown =
            await this.isPoliceAssignmentOnCooldown(
                guildId,
                discordId
            );

        if (cooldown) {
            return false;
        }

        const capacityAvailable =
            await this.hasPoliceCapacity(
                guildId,
                memberCount
            );

        if (!capacityAvailable) {
            return false;
        }

        const now =
            new Date();

        const result =
            await this.database.db.robberyProfile.updateMany({

                where: {
                    guildId,
                    discordId,

                    OR: [
                        {
                            role: null
                        },
                        {
                            role: RobberyRole.ROBBER
                        }
                    ]
                },

                data: {
                    role: RobberyRole.POLICE,
                    roleAssignedAt: now,
                    jailedUntil: null
                }
            });

        if (
            result.count !== 1
        ) {
            return false;
        }

        await this.notificationService
            .notifyPoliceAssigned(
                discordId
            );

        return true;
    }


    /*
     * =========================
     * ADMIN POLICE ASSIGNMENT
     * =========================
     *
     * This is intentionally separate
     * from assignPolice().
     *
     * Normal Police assignment requires:
     * - Police eligibility
     * - assignment cooldown
     * - server Police capacity
     *
     * Servers with fewer than 100 members
     * have no normal Police capacity.
     *
     * This method exists only so an
     * Administrator can manually choose
     * a Police member for those servers.
     *
     * It ONLY assigns the Robbery Police
     * role. It does not create a Police case,
     * bypass Police gameplay, or perform
     * any robbery action.
     *
     * Once assigned, the member is subject
     * to the normal Robbery Police rules.
     */

    async assignPoliceByAdmin(
        guildId: string,
        discordId: string
    ): Promise<boolean> {

        /*
         * Resolve the authoritative current
         * role first.
         *
         * This also clears an expired jail
         * state if necessary.
         */

        const currentRole =
            await this.getRole(
                guildId,
                discordId
            );

        /*
         * A member who is already Police
         * does not need another assignment.
         */

        if (
            currentRole ===
            RobberyRole.POLICE
        ) {
            return false;
        }

        /*
         * An actively jailed member cannot
         * be converted directly into Police.
         *
         * This preserves the existing jail
         * restriction even though the normal
         * Police eligibility/capacity checks
         * are intentionally bypassed here.
         */

        if (
            currentRole ===
            RobberyRole.JAIL
        ) {
            return false;
        }

        const now =
            new Date();

        const result =
            await this.database.db.robberyProfile.updateMany({

                where: {
                    guildId,
                    discordId,

                    OR: [
                        {
                            role: null
                        },
                        {
                            role: RobberyRole.ROBBER
                        }
                    ]
                },

                data: {
                    role: RobberyRole.POLICE,
                    roleAssignedAt: now,
                    jailedUntil: null
                }
            });

        if (
            result.count !== 1
        ) {
            return false;
        }

        await this.notificationService
            .notifyPoliceAssigned(
                discordId
            );

        return true;
    }


    /*
     * =========================
     * POLICE ROOM
     * =========================
     *
     * Discord-side bridge used by
     * RobberyPoliceManager.
     *
     * A null result means the Discord
     * room could not be created.
     */

    async createPoliceRoom(
        guildId: string,
        robberySessionId: string,
        policeId: string
    ): Promise<TextChannel | null> {

        return await this.notificationService
            .createPoliceRoom(
                guildId,
                robberySessionId,
                policeId
            );
    }


    /*
     * =========================
     * ROBBER POLICE DISPATCH
     * =========================
     */

    async notifyRobberOfPoliceResponse(
        guildId: string,
        robberySessionId: string,
        policeId: string
    ): Promise<boolean> {

        return await this.notificationService
            .notifyRobberOfPoliceResponse(
                guildId,
                robberySessionId,
                policeId
            );
    }


    /*
     * =========================
     * POLICE GAME MESSAGE
     * =========================
     *
     * Discord/UI bridge.
     */

    async sendPoliceGameMessage(
        guildId: string,
        robberySessionId: string,
        content: string,
        components: import("discord.js").ActionRowBuilder<
            import("discord.js").ButtonBuilder
        >[]
    ): Promise<boolean> {

        return await this.notificationService
            .sendPoliceGameMessage(
                guildId,
                robberySessionId,
                content,
                components
            );
    }


    /*
     * =========================
     * POLICE ROBBERY ALERT
     * =========================
     */

    async notifyPoliceOfRobbery(
        guildId: string,
        robberySessionId: string,
        robberId: string,
        victimId: string,
        expiresAt: number
    ): Promise<number> {

        return await this.notificationService
            .notifyPoliceOfRobbery(
                guildId,
                robberySessionId,
                robberId,
                victimId,
                expiresAt
            );
    }


    async removeRole(
        guildId: string,
        discordId: string
    ): Promise<void> {

        await this.database.db.robberyProfile.updateMany({

            where: {
                guildId,
                discordId
            },

            data: {
                role: null,
                jailedUntil: null
            }
        });
    }
}

END FILE: src/plugins/robbery/headquarters/RobberyHeadquarters.ts
================================================================================

FILE: src/plugins/robbery/headquarters/RobberyNotificationService.ts
--------------------------------------------------------------------------------
Original size: 18558 bytes
Exported size: 17753 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    PermissionFlagsBits,
    TextChannel,
    User
} from "discord.js";

import { PrismaService } from "../../../core/database/PrismaService.js";

export class RobberyNotificationService {


    constructor(
        private readonly client: Client,
        private readonly database: PrismaService
    ) {}


    /*
     * =========================
     * POLICE ASSIGNED
     * =========================
     */

    async notifyPoliceAssigned(
        discordId: string
    ): Promise<void> {

        const user =
            await this.getUser(
                discordId
            );

        if (!user) {
            return;
        }

        try {

            await user.send(
                [
                    "🚨 **You have been assigned as Police.**",
                    "",
                    "You are now eligible to respond to robbery alerts in this server.",
                    "Stay alert — a robbery may need your help."
                ].join("\n")
            );

        } catch {
            /*
             * DMs may be disabled.
             *
             * A failed DM must never break
             * the Robbery role system.
             */
        }
    }


    /*
     * =========================
     * ROBBER ASSIGNED
     * =========================
     */

    async notifyRobberAssigned(
        discordId: string
    ): Promise<void> {

        const user =
            await this.getUser(
                discordId
            );

        if (!user) {
            return;
        }

        try {

            await user.send(
                [
                    "🥷 **You are now a Robber.**",
                    "",
                    "You successfully completed a robbery and have been assigned the Robber role.",
                    "Choose your targets carefully."
                ].join("\n")
            );

        } catch {
            /*
             * DMs may be disabled.
             *
             * Notification failure must never
             * affect the successful robbery.
             */
        }
    }


    /*
     * =========================
     * POLICE REMOVED
     * =========================
     */

    async notifyPoliceRemoved(
        discordId: string
    ): Promise<void> {

        const user =
            await this.getUser(
                discordId
            );

        if (!user) {
            return;
        }

        try {

            await user.send(
                [
                    "📢 **Your Police status has ended.**",
                    "",
                    "Your recent wager activity has removed you from the Police role."
                ].join("\n")
            );

        } catch {
            /*
             * DMs may be disabled.
             *
             * Notification failure must never
             * affect the wager or role update.
             */
        }
    }


    /*
     * =========================
     * VICTIM ROBBERY ALERT
     * =========================
     *
     * Notify the victim that a
     * robbery has started against them.
     *
     * The victim receives the notification
     * regardless of their online/offline
     * presence status.
     *
     * The robbery continues regardless
     * of notification success/failure.
     */

    async notifyVictimOfRobbery(
        victimId: string,
        robberId: string,
        robberySessionId: string
    ): Promise<void> {

        const victim =
            await this.getUser(
                victimId
            );

        if (!victim) {
            return;
        }

        const doNothingButton =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:victim:do-nothing:${robberySessionId}`
                )
                .setLabel(
                    "Do Nothing"
                )
                .setEmoji(
                    "🙈"
                )
                .setStyle(
                    ButtonStyle.Secondary
                );

        const callPoliceButton =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:victim:call-police:${robberySessionId}`
                )
                .setLabel(
                    "Call Police"
                )
                .setEmoji(
                    "🚨"
                )
                .setStyle(
                    ButtonStyle.Danger
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    doNothingButton,
                    callPoliceButton
                );

        try {

            await victim.send({

                content:
                    [
                        "🚨 **YOU ARE BEING ROBBED**",
                        "",
                        `🥷 **Robber:** <@${robberId}>`,
                        "",
                        "Someone is attempting to rob your Nickel.",
                        "The robbery is already in progress and will continue regardless of what you choose.",
                        "",
                        "You can ignore the robbery or call the Police for help.",
                        "",
                        "⚠️ **Do Nothing** — allow the robbery to continue.",
                        "🚓 **Call Police** — alert the Police immediately."
                    ].join("\n"),

                components: [
                    row
                ]
            });

        } catch {
            /*
             * DMs may be disabled.
             *
             * Notification failure must never
             * stop or affect the robbery.
             */
        }
    }


    /*
     * =========================
     * POLICE ROBBERY ALERT
     * =========================
     *
     * Sends the robbery alert ONLY to
     * the server's configured Police
     * notification channel.
     *
     * The configured channel is stored
     * persistently in PostgreSQL.
     *
     * The alert does NOT claim the robbery.
     *
     * Police members claim the robbery by
     * pressing the response button.
     *
     * Returns 1 when the alert was sent
     * successfully, otherwise 0.
     */

    async notifyPoliceOfRobbery(
        guildId: string,
        robberySessionId: string,
        robberId: string,
        victimId: string,
        expiresAt?: number
    ): Promise<number> {

        /*
         * =========================
         * LOAD CONFIGURATION
         * =========================
         */

        const configuration =
            await this.database.db.robberyPoliceNotificationConfig
                .findUnique({
                    where: {
                        guildId
                    }
                })
                .catch(
                    () => null
                );

        if (
            !configuration ||
            !configuration.enabled
        ) {

            return 0;
        }

        /*
         * =========================
         * GUILD
         * =========================
         */

        let guild;

        try {

            guild =
                await this.client.guilds.fetch(
                    guildId
                );

        } catch {

            return 0;
        }

        /*
         * =========================
         * BOT MEMBER
         * =========================
         */

        let botMember;

        try {

            botMember =
                await guild.members.fetchMe();

        } catch {

            return 0;
        }

        /*
         * =========================
         * CHANNEL
         * =========================
         */

        let channel;

        try {

            channel =
                await guild.channels.fetch(
                    configuration.channelId
                );

        } catch {

            return 0;
        }

        if (!channel) {
            return 0;
        }

        if (
            channel.type !==
                ChannelType.GuildText &&
            channel.type !==
                ChannelType.GuildAnnouncement
        ) {

            return 0;
        }

        /*
         * =========================
         * BOT PERMISSIONS
         * =========================
         */

        const permissions =
            channel.permissionsFor(
                botMember
            );

        if (!permissions) {
            return 0;
        }

        if (
            !permissions.has(
                PermissionFlagsBits.ViewChannel
            ) ||
            !permissions.has(
                PermissionFlagsBits.SendMessages
            )
        ) {

            return 0;
        }

        /*
         * =========================
         * RESPONSE BUTTON
         * =========================
         */

        const respondButton =
            new ButtonBuilder()
                .setCustomId(
                    `robbery:police-claim:${robberySessionId}`
                )
                .setLabel(
                    "Respond to Robbery"
                )
                .setEmoji(
                    "🚓"
                )
                .setStyle(
                    ButtonStyle.Danger
                );

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    respondButton
                );

        /*
         * =========================
         * ALERT CONTENT
         * =========================
         */

        const contentLines = [
            "🚨 **ROBBERY IN PROGRESS**",
            "",
            `🥷 **Robber:** <@${robberId}>`,
            `🎯 **Victim:** <@${victimId}>`,
            ""
        ];

        if (
            expiresAt !== undefined
        ) {

            const remainingMs =
                Math.max(
                    0,
                    expiresAt - Date.now()
                );

            const remainingSeconds =
                Math.ceil(
                    remainingMs / 1000
                );

            const minutes =
                Math.floor(
                    remainingSeconds / 60
                );

            const seconds =
                remainingSeconds % 60;

            contentLines.push(
                `⏳ **Time remaining:** ${minutes}m ${seconds}s`,
                ""
            );
        }

        contentLines.push(
            "A Police response has been requested.",
            "",
            "**First Police member to successfully respond gets the case.**",
            "",
            "🚓 Press **Respond to Robbery** to attempt the response."
        );

        const content =
            contentLines.join("\n");

        /*
         * =========================
         * SEND ALERT
         * =========================
         */

        try {

            await channel.send({
                content,
                components: [
                    row
                ]
            });

            return 1;

        } catch {

            return 0;
        }
    }


    /*
     * =========================
     * CREATE POLICE ROOM
     * =========================
     *
     * Creates the private Police room
     * for the selected robbery session.
     *
     * Only the responding Police member
     * and the bot can access the room.
     */

    async createPoliceRoom(
        guildId: string,
        robberySessionId: string,
        policeId: string
    ): Promise<TextChannel | null> {

        let guild;

        try {

            guild =
                await this.client.guilds.fetch(
                    guildId
                );

        } catch {

            return null;
        }

        let botMember;

        try {

            botMember =
                await guild.members.fetchMe();

        } catch {

            return null;
        }

        try {

            const existingChannel =
                guild.channels.cache.find(
                    channel =>
                        channel.type ===
                            ChannelType.GuildText &&
                        channel.name ===
                            `police-${robberySessionId}`
                );

            if (
                existingChannel &&
                existingChannel.type ===
                    ChannelType.GuildText
            ) {

                return existingChannel;
            }

            const policeRoom =
                await guild.channels.create({

                    name:
                        `police-${robberySessionId}`,

                    type:
                        ChannelType.GuildText,

                    permissionOverwrites: [

                        {
                            id:
                                guild.roles.everyone.id,

                            deny: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },

                        {
                            id:
                                botMember.id,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },

                        {
                            id:
                                policeId,

                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        }

                    ]
                });

            return policeRoom;

        } catch {

            return null;
        }
    }


    /*
     * =========================
     * POLICE ROOM GAME MESSAGE
     * =========================
     *
     * Sends the current Police challenge
     * into the private Police room.
     *
     * Discord/UI handling remains here in
     * NotificationService rather than inside
     * the Police state manager.
     */

    async sendPoliceGameMessage(
        guildId: string,
        robberySessionId: string,
        content: string,
        components: ActionRowBuilder<ButtonBuilder>[]
    ): Promise<boolean> {

        const channel =
            await this.getTextChannel(
                guildId,
                `police-${robberySessionId}`
            );

        if (!channel) {
            return false;
        }

        try {

            await channel.send({
                content,
                components
            });

            return true;

        } catch {

            return false;
        }
    }


    /*
     * =========================
     * ROBBER ROOM DISPATCH
     * =========================
     *
     * Notify the robber inside the
     * existing robbery-${sessionId}
     * private room that Police have
     * responded.
     */

    async notifyRobberOfPoliceResponse(
        guildId: string,
        robberySessionId: string,
        policeId: string
    ): Promise<boolean> {

        const channel =
            await this.getTextChannel(
                guildId,
                `robbery-${robberySessionId}`
            );

        if (!channel) {
            return false;
        }

        try {

            await channel.send({
                content:
                    [
                        "🚨 **POLICE RESPONSE DETECTED**",
                        "",
                        "The victim has called the Police.",
                        `🚓 **Police responder:** <@${policeId}>`,
                        "",
                        "A Police response is now in progress.",
                        "The robbery will continue until either the Robber or Police wins the race."
                    ].join("\n")
            });

            return true;

        } catch {

            return false;
        }
    }


    /*
     * =========================
     * TEXT CHANNEL RESOLUTION
     * =========================
     */

    private async getTextChannel(
        guildId: string,
        channelName: string
    ): Promise<TextChannel | null> {

        let guild;

        try {

            guild =
                await this.client.guilds.fetch(
                    guildId
                );

        } catch {

            return null;
        }

        let channels;

        try {

            channels =
                await guild.channels.fetch();

        } catch {

            return null;
        }

        const channel =
            channels.find(
                currentChannel =>
                    currentChannel?.type ===
                        ChannelType.GuildText &&
                    currentChannel.name ===
                        channelName
            );

        if (
            !channel ||
            channel.type !==
                ChannelType.GuildText
        ) {

            return null;
        }

        return channel;
    }


    /*
     * =========================
     * USER RESOLUTION
     * =========================
     *
     * Resolve the Discord user from
     * the global client cache/API.
     */

    private async getUser(
        discordId: string
    ): Promise<User | null> {

        try {

            return await this.client.users.fetch(
                discordId
            );

        } catch {

            return null;
        }
    }


}

END FILE: src/plugins/robbery/headquarters/RobberyNotificationService.ts
================================================================================

FILE: src/plugins/robbery/plugin.json
--------------------------------------------------------------------------------
Original size: 149 bytes
Exported size: 144 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
    "id": "robbery",
    "name": "Robbery",
    "version": "1.0.0",
    "description": "A premium high-risk robbery system for Quill & Ink."
}

END FILE: src/plugins/robbery/plugin.json
================================================================================

FILE: src/plugins/robbery/RobberyPlugin.ts
--------------------------------------------------------------------------------
Original size: 21229 bytes
Exported size: 20452 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { 
    ChatInputCommandInteraction, 
    Events, 
    PermissionFlagsBits, 
    SlashCommandBuilder 
} from "discord.js"; 
 
import { 
    RobberyRole 
} from "../../generated/prisma/client.js"; 
 
import { Plugin } from "../../core/plugins/Plugin.js"; 
import { PluginContext } from "../../core/plugins/PluginContext.js"; 
import { PrismaService } from "../../core/database/PrismaService.js"; 
 
import { RobCommand } from "./commands/RobCommand.js"; 
 
import { RobberyGameManager } from "./core/RobberyGameManager.js"; 
import { RobberyManager } from "./core/RobberyManager.js"; 
import { RobberyQuestionManager } from "./core/RobberyQuestionManager.js"; 
import { GuessCharacterQuestionManager } from "./core/GuessCharacterQuestionManager.js"; 
 
import { PoliceEscapeMazeRenderer } from "./core/PoliceEscapeMazeRenderer.js"; 
 
import { LockCombinationGame } from "./games/LockCombinationGame.js"; 
import { ColourGuessGame } from "./games/ColourGuessGame.js"; 
import { BinaryDecryptionGame } from "./games/BinaryDecryptionGame.js"; 
import { PoliceEscapeGame } from "./games/PoliceEscapeGame.js"; 
import { GuessCharacterGame } from "./games/GuessCharacterGame.js"; 
 
import RobberyInteraction from "./events/RobberyInteraction.js"; 
import RobberyPoliceInteraction from "./events/RobberyPoliceInteraction.js"; 
 
import { EconomyAccountService } from "../economy/services/EconomyAccountService.js"; 
 
import { RobberyHeadquarters } from "./headquarters/RobberyHeadquarters.js"; 
import { RobberyNotificationService } from "./headquarters/RobberyNotificationService.js"; 
 import { PoliceConfigCommand } from "./commands/PoliceConfigCommand.js";

import { 
    RobberyPoliceManager 
} from "./headquarters/police/RobberyPoliceManager.js"; 
 
 
export class RobberyPlugin implements Plugin { 
 
    /* 
     * ========================= 
     * PLUGIN METADATA 
     * ========================= 
     * 
     * Robbery is a Premium plugin. 
     * Entitlement enforcement is handled 
     * outside this plugin registration layer. 
     */ 
 
    readonly metadata = { 
        id: "robbery", 
        name: "Robbery", 
        version: "1.0.0", 
        description: 
            "Premium high-risk robbery system for Quill & Ink." 
    }; 
 
 
    /* 
     * ========================= 
     * INTERNAL SERVICES 
     * ========================= 
     */ 
 
    private gameManager: 
        RobberyGameManager | null = null; 
 
    private robberyManager: 
        RobberyManager | null = null; 
 
    private robberyHeadquarters: 
        RobberyHeadquarters | null = null; 
 
    private robberyPoliceManager: 
        RobberyPoliceManager | null = null; 
 
 
    /* 
     * ========================= 
     * REGISTER 
     * ========================= 
     */ 
 
    register( 
        context: PluginContext 
    ): void { 
 
        context.logger.info( 
            "[Robbery] Registering Premium Robbery plugin..." 
        ); 
 
 
        /* 
         * ========================= 
         * DATABASE 
         * ========================= 
         * 
         * Use the shared PrismaService 
         * registered by the core. 
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
 
 
        /* 
         * ========================= 
         * NOTIFICATION SERVICE 
         * ========================= 
         */ 
 
        const notificationService = 
            new RobberyNotificationService( 
                context.client,
                database 
            ); 
 
        context.services.register( 
            "robberyNotificationService", 
            notificationService 
        ); 
 
 
        /* 
         * ========================= 
         * ROBBERY HEADQUARTERS 
         * ========================= 
         * 
         * Headquarters owns Robbery role 
         * and activity state. 
         */ 
 
        const robberyHeadquarters = 
            new RobberyHeadquarters( 
                database, 
                notificationService 
            ); 
 
        context.services.register( 
            "robberyHeadquarters", 
            robberyHeadquarters 
        ); 
 
        this.robberyHeadquarters = 
            robberyHeadquarters; 
 
 
        /* 
         * ========================= 
         * QUESTION MANAGERS 
         * ========================= 
         */ 
 
        const questionManager = 
            new RobberyQuestionManager(); 
 
        const guessCharacterQuestionManager = 
            new GuessCharacterQuestionManager(); 
 
 
        /* 
         * ========================= 
         * MAZE RENDERER 
         * ========================= 
         */ 
 
        const policeEscapeRenderer = 
            new PoliceEscapeMazeRenderer(); 
 
 
        /* 
         * ========================= 
         * GAME MANAGER 
         * ========================= 
         */ 
 
        const gameManager = 
            new RobberyGameManager(); 
 
 
        /* 
         * ========================= 
         * REGISTER GAMES 
         * ========================= 
         */ 
 
        gameManager.register( 
            new LockCombinationGame() 
        ); 
 
        gameManager.register( 
            new ColourGuessGame() 
        ); 
 
        gameManager.register( 
            new BinaryDecryptionGame() 
        ); 
 
        gameManager.register( 
            new PoliceEscapeGame() 
        ); 
 
        gameManager.register( 
            new GuessCharacterGame( 
                guessCharacterQuestionManager 
            ) 
        ); 
 
 
        /* 
         * ========================= 
         * ECONOMY ACCOUNT SERVICE 
         * ========================= 
         * 
         * EconomyAccountService is created 
         * and registered by EconomyPlugin. 
         * 
         * Robbery uses that shared instance 
         * rather than creating its own service. 
         */ 
 
        const economyAccountService = 
            context.services.get<EconomyAccountService>( 
                "economyAccountService" 
            ); 
 
        if (!economyAccountService) { 
            throw new Error( 
                "EconomyAccountService is not registered." 
            ); 
        } 
 
 
        /* 
         * ========================= 
         * ROBBERY MANAGER 
         * ========================= 
         */ 
 
        const robberyManager = 
            new RobberyManager( 
                gameManager, 
                economyAccountService, 
                robberyHeadquarters 
            ); 
 
 
        /* 
         * ========================= 
         * POLICE MANAGER 
         * ========================= 
         * 
         * Police Manager uses the shared 
         * RobberyManager session state, 
         * EconomyAccountService and 
         * RobberyHeadquarters. 
         */ 
 
        const robberyPoliceManager = 
            new RobberyPoliceManager( 
                robberyManager, 
                economyAccountService, 
                robberyHeadquarters 
            ); 
 
 
        this.gameManager = 
            gameManager; 
 
        this.robberyManager = 
            robberyManager; 
 
        this.robberyPoliceManager = 
            robberyPoliceManager; 
 
 
        /* 
         * ========================= 
         * REGISTER SERVICES 
         * ========================= 
         */ 
 
        context.services.register( 
            "robberyGameManager", 
            gameManager 
        ); 
 
        context.services.register( 
            "robberyManager", 
            robberyManager 
        ); 
 
        context.services.register( 
            "robberyPoliceManager", 
            robberyPoliceManager 
        ); 
 
 
        /* 
         * ========================= 
         * SET POLICE COMMAND 
         * ========================= 
         * 
         * This command is specifically 
         * for servers with fewer than 
         * 100 members. 
         * 
         * It allows an Administrator to 
         * manually choose a Police member. 
         * 
         * The command ONLY assigns the 
         * Robbery Police role. 
         * 
         * It does not create a Police case, 
         * start a robbery response, or bypass 
         * any Police gameplay rules. 
         * 
         * Once assigned, the member follows 
         * the normal Robbery Police rules. 
         */ 
 
        const SetPoliceCommand = { 
 
            data: new SlashCommandBuilder() 
                .setName("set-police") 
                .setDescription( 
                    "Assign a member as Robbery Police" 
                ) 
                .setDefaultMemberPermissions( 
                    PermissionFlagsBits.Administrator 
                ) 
                .addUserOption(option => 
                    option 
                        .setName("member") 
                        .setDescription( 
                            "The member to assign as Robbery Police" 
                        ) 
                        .setRequired(true) 
                ), 
 
            async execute( 
                interaction: 
                    ChatInputCommandInteraction 
            ): Promise<void> { 
 
                /* 
                 * ========================= 
                 * GUILD CHECK 
                 * ========================= 
                 * 
                 * This command only makes sense 
                 * inside a Discord server. 
                 */ 
 
                if (!interaction.guild) { 
 
                    await interaction.reply({ 
                        content: 
                            "❌ This command can only be used in a server.", 
                        ephemeral: true 
                    }); 
 
                    return; 
                } 
 
 
                /* 
                 * ========================= 
                 * ADMIN CHECK 
                 * ========================= 
                 * 
                 * The command definition hides 
                 * the command from non-admin users, 
                 * but the permission is checked again 
                 * here at execution time. 
                 */ 
 
                if ( 
                    !interaction.memberPermissions?.has( 
                        PermissionFlagsBits.Administrator 
                    ) 
                ) { 
 
                    await interaction.reply({ 
                        content: 
                            "❌ You must be a server Administrator to use this command.", 
                        ephemeral: true 
                    }); 
 
                    return; 
                } 
 
 
                /* 
                 * ========================= 
                 * SERVER SIZE CHECK 
                 * ========================= 
                 * 
                 * Normal Police capacity begins 
                 * at 100 members. 
                 * 
                 * This administrator command is 
                 * therefore available strictly 
                 * below that threshold. 
                 */ 
 
                if ( 
                    interaction.guild.memberCount >= 100 
                ) { 
 
                    await interaction.reply({ 
                        content: 
                            "❌ This command is only available in servers with fewer than 100 members.", 
                        ephemeral: true 
                    }); 
 
                    return; 
                } 
 
 
                /* 
                 * ========================= 
                 * TARGET MEMBER 
                 * ========================= 
                 */ 
 
                const member = 
                    interaction.options.getUser( 
                        "member", 
                        true 
                    ); 
 
 
                /* 
                 * ========================= 
                 * GUILD MEMBERSHIP CHECK 
                 * ========================= 
                 * 
                 * The selected user must actually 
                 * belong to this server. 
                 */ 
 
                try { 
 
                    await interaction.guild.members.fetch( 
                        member.id 
                    ); 
 
                } catch { 
 
                    await interaction.reply({ 
                        content: 
                            "❌ That user is not a member of this server.", 
                        ephemeral: true 
                    }); 
 
                    return; 
                } 
 
 
                /* 
                 * ========================= 
                 * ADMIN POLICE ASSIGNMENT 
                 * ========================= 
                 * 
                 * Headquarters remains the 
                 * authoritative owner of Robbery 
                 * Police roles. 
                 * 
                 * This deliberately does NOT use 
                 * assignPolice(), because that method 
                 * enforces the normal eligibility, 
                 * cooldown and capacity rules. 
                 */ 
 
                const assigned = 
                    await robberyHeadquarters 
                        .assignPoliceByAdmin( 
                            interaction.guild.id, 
                            member.id 
                        ); 
 
 
                /* 
                 * ========================= 
                 * ASSIGNMENT FAILURE 
                 * ========================= 
                 */ 
 
                if (!assigned) { 
 
                    const currentRole = 
                        await robberyHeadquarters.getRole( 
                            interaction.guild.id, 
                            member.id 
                        ); 
 
 
                    if ( 
                        currentRole === 
                        RobberyRole.JAIL 
                    ) { 
 
                        await interaction.reply({ 
                            content: 
                                `❌ <@${member.id}> is currently jailed and cannot be assigned as Robbery Police.`, 
                            ephemeral: true 
                        }); 
 
                        return; 
                    } 
 
 
                    if ( 
                        currentRole === 
                        RobberyRole.POLICE 
                    ) { 
 
                        await interaction.reply({ 
                            content: 
                                `❌ <@${member.id}> is already assigned as Robbery Police.`, 
                            ephemeral: true 
                        }); 
 
                        return; 
                    } 
 
 
                    await interaction.reply({ 
                        content: 
                            `❌ <@${member.id}> could not be assigned as Robbery Police.`, 
                        ephemeral: true 
                    }); 
 
                    return; 
                } 
 
 
                /* 
                 * ========================= 
                 * SUCCESS 
                 * ========================= 
                 * 
                 * Nothing else is performed here. 
                 * 
                 * The selected member is now simply 
                 * a normal Robbery Police member. 
                 */ 
 
                await interaction.reply({ 
                    content: 
                        `👮 <@${member.id}> has been assigned as Robbery Police.` 
                }); 
            } 
        }; 
 
 
        /* 
         * ========================= 
         * REGISTER COMMANDS 
         * ========================= 
         */ 

        context.commands.registerCommand({
            ...RobCommand,
           access: "premium" as const
        });
        context.commands.registerCommand({
            ...SetPoliceCommand,
            access: "premium" as const
        }); 
 
        context.commands.registerCommand({
            ...PoliceConfigCommand,
           access: "premium" as const
        });

        /* 
         * ========================= 
         * REGISTER INTERACTIONS 
         * ========================= 
         */ 
 
        context.on( 
            Events.InteractionCreate, 
            async interaction => { 
 
                try { 
 
                    await RobberyInteraction.execute( 
                        interaction, 
                        context.client 
                    ); 
 
                    await RobberyPoliceInteraction.execute( 
                        interaction, 
                        robberyPoliceManager, 
                        robberyManager, 
                        robberyHeadquarters 
                    ); 
 
                } catch (error) { 
 
                    context.logger.error( 
                        `[Robbery] Interaction handler failed: ${ 
                            error instanceof Error 
                                ? error.stack ?? error.message 
                                : String(error) 
                        }` 
                    ); 
 
                } 
 
            } 
        ); 
 
 
        /* 
         * ========================= 
         * REGISTRATION COMPLETE 
         * ========================= 
         */ 
 
        context.logger.info( 
            `[Robbery] Premium Robbery plugin registered successfully. ` + 
            `${gameManager.getAll().length} game(s) available.` 
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
 
        const gameCount = 
            this.gameManager?.getAll().length ?? 0; 
 
        context.logger.info( 
            "[Robbery] Premium Robbery plugin loaded successfully." 
        ); 
 
        context.logger.info( 
            `[Robbery] Registered ${gameCount} robbery game(s).` 
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
            "[Robbery] Unloading Premium Robbery plugin..." 
        ); 
 
 
        /* 
         * ========================= 
         * REMOVE SERVICES 
         * ========================= 
         */ 
 
        context.services.remove( 
            "robberyPoliceManager" 
        ); 
 
        context.services.remove( 
            "robberyManager" 
        ); 
 
        context.services.remove( 
            "robberyGameManager" 
        ); 
 
        context.services.remove( 
            "robberyHeadquarters" 
        ); 
 
        context.services.remove( 
            "robberyNotificationService" 
        ); 
 
 
        /* 
         * ========================= 
         * CLEAR REFERENCES 
         * ========================= 
         */ 
 
        this.gameManager = null; 
        this.robberyManager = null; 
        this.robberyHeadquarters = null; 
        this.robberyPoliceManager = null; 
 
 
        context.logger.info( 
            "[Robbery] Premium Robbery plugin unloaded successfully." 
        ); 
    } 
 
 
    /* 
     * ========================= 
     * GET GAME MANAGER 
     * ========================= 
     */ 
 
    getGameManager(): 
        RobberyGameManager | null { 
 
        return this.gameManager; 
    } 
 
 
    /* 
     * ========================= 
     * GET ROBBERY MANAGER 
     * ========================= 
     */ 
 
    getRobberyManager(): 
        RobberyManager | null { 
 
        return this.robberyManager; 
    } 
 
 
    /* 
     * ========================= 
     * GET HEADQUARTERS 
     * ========================= 
     */ 
 
    getRobberyHeadquarters(): 
        RobberyHeadquarters | null { 
 
        return this.robberyHeadquarters; 
    } 
 
 
    /* 
     * ========================= 
     * GET POLICE MANAGER 
     * ========================= */ 
 
    getRobberyPoliceManager(): 
        RobberyPoliceManager | null { 
 
        return this.robberyPoliceManager; 
    } 
}

END FILE: src/plugins/robbery/RobberyPlugin.ts
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
