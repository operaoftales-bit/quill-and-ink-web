QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:30:46.296Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/pressure
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
- This export is scoped to: src/plugins/pressure

EXPORT SUMMARY
================================================================================
Files exported: 12
Files excluded or skipped: 0
Original bytes in exported files: 275072
Bytes after redaction: 263538
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/pressure/commands/PressureCommand.ts
00002. src/plugins/pressure/commands/PressureRemoveCommand.ts
00003. src/plugins/pressure/handlers/PressureInteractionHandler.ts
00004. src/plugins/pressure/models/PressureCard.ts
00005. src/plugins/pressure/models/PressurePlayer.ts
00006. src/plugins/pressure/models/PressureSession.ts
00007. src/plugins/pressure/PressurePlugin.ts
00008. src/plugins/pressure/services/PressureCardRenderer.ts
00009. src/plugins/pressure/services/PressureDeckService.ts
00010. src/plugins/pressure/services/PressureInteraction.ts
00011. src/plugins/pressure/services/PressureService.ts
00012. src/plugins/pressure/services/PressureTableRenderer.ts

SOURCE FILES
================================================================================

FILE: src/plugins/pressure/commands/PressureCommand.ts
--------------------------------------------------------------------------------
Original size: 18595 bytes
Exported size: 18007 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
premium: True
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import {
    Command
} from "../../../core/loader/CommandLoader.js";

import {
    PressureService
} from "../services/PressureService.js";

import {
    PressureTableRenderer
} from "../services/PressureTableRenderer.js";

/*
 * =========================================================
 * PRESSURE COMMAND
 * =========================================================
 *
 * Creates the public Pressure table.
 *
 * IMPORTANT:
 *
 * /pressure:
 *
 * - Is administrator-only.
 * - Is guild-only.
 * - Creates an EMPTY persistent table.
 * - Does NOT automatically join the command user.
 * - Does NOT create a host.
 * - Does NOT start a match.
 *
 * Players join through the JOIN TABLE button.
 *
 * PressureService owns the authoritative table state.
 *
 * PressureTableRenderer is responsible only for the
 * public visual representation of the table.
 *
 * PressurePlugin owns the Discord channel lifecycle.
 *
 * The command uses the same PressureService instance
 * owned by PressurePlugin.
 * =========================================================
 */

/*
 * =========================================================
 * BUTTON IDENTIFIERS
 * =========================================================
 *
 * These IDs intentionally contain the session ID.
 *
 * The current PressureInteractionHandler accepts this
 * dynamic format:
 *
 * pressure:<action>:<sessionId>
 *
 * Keeping the session ID attached to every button makes
 * stale buttons safely identifiable by the handler.
 * =========================================================
 */

const JOIN_ACTION = "join";
const LEAVE_ACTION = "leave";
const HOW_TO_PLAY_ACTION = "how-to-play";

/*
 * =========================================================
 * CREATE PRESSURE COMMAND
 * =========================================================
 *
 * onTableCreated:
 *
 * Called only after the persistent Discord table message
 * has been successfully created and its message ID has been
 * stored in the PressureSession.
 *
 * PressurePlugin uses this callback to immediately apply
 * the dedicated Pressure channel permissions.
 *
 * The command itself does not own Discord channel permissions.
 * =========================================================
 */

export function createPressureCommand(
    pressure: PressureService,
    tableRenderer: PressureTableRenderer,
    onTableCreated?: (
        sessionId: string
    ) => Promise<void>
): Command {

    return {

        /*
         * =====================================================
         * COMMAND DATA
         * =====================================================
         */

        data:
            new SlashCommandBuilder()
                .setName("pressure")
                .setDescription(
                    "Create a public Pressure table."
                )
                .setDefaultMemberPermissions(
                    PermissionFlagsBits.Administrator.toString()
                ),

        /*
         * =====================================================
         * EXECUTE
         * =====================================================
         */

        async execute(
            ...args: unknown[]
        ): Promise<void> {

            const interaction =
                args[0] as
                    | ChatInputCommandInteraction
                    | undefined;

            /*
             * =================================================
             * INTERACTION VALIDATION
             * =================================================
             */

            if (
                !interaction ||
                !interaction.isChatInputCommand()
            ) {

                throw new Error(
                    "Pressure command received an invalid interaction."
                );
            }

            /*
             * =================================================
             * GUILD VALIDATION
             * =================================================
             *
             * Pressure is a server-side multiplayer game.
             */

            if (!interaction.guildId) {

                await interaction.reply({
                    content:
                        "🎴 **Pressure** can only be created inside a server.",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * ADMIN VALIDATION
             * =================================================
             *
             * The slash-command permission is already restricted
             * to administrators.
             *
             * This runtime check provides a second protection layer
             * and prevents accidental execution if the command is
             * invoked through an unusual registration state.
             */

            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                await interaction.reply({
                    content:
                        "🔒 **Pressure** tables can only be created by server administrators.",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * CHANNEL VALIDATION
             * =================================================
             *
             * Pressure requires a concrete Discord channel because
             * the table is represented by a persistent public
             * message in that channel.
             */

            if (!interaction.channelId) {

                await interaction.reply({
                    content:
                        "🎴 **Pressure** could not determine the current game channel.",
                    ephemeral: true
                });

                return;
            }

                        /*
             * =================================================
             * ACKNOWLEDGE INTERACTION
             * =================================================
             *
             * Rendering the table and applying channel
             * permissions may take longer than Discord's
             * initial interaction response deadline.
             *
             * Defer before beginning that asynchronous work.
             */

            await interaction.deferReply({
                ephemeral: false
            });

            /*
             * =================================================
             * CREATE SESSION
             * =================================================
             *
             * PressureService is the authoritative source for
             * duplicate-table protection.
             *
             * It checks for ANY active persistent table in this
             * guild/channel, including a finished table waiting
             * for its next match.
             *
             * This is intentionally delegated to the service
             * rather than performing a separate pre-check here.
             *
             * That keeps the actual creation operation as the
             * single source of truth.
             */

            let session;

            try {

                session =
                    pressure.createSession(
                        interaction.guildId,
                        interaction.channelId
                    );

            } catch (error) {

                /*
                 * =============================================
                 * EXISTING TABLE
                 * =============================================
                 */

             if (
    error instanceof Error &&
    error.message === "LOBBY_ALREADY_EXISTS"
) {
    await interaction.editReply({
        content:
            "🎴 **Pressure already has a table in this channel.**\n\n" +
            "The existing table must be removed before creating another one.",
        embeds: [],
        components: [],
        files: []
    });

    return;
}

                throw error;
            }

            /*
             * =================================================
             * RENDER INITIAL TABLE
             * =================================================
             *
             * The newly-created session intentionally contains
             * zero players.
             *
             * No hand information is available or rendered.
             *
             * The renderer only receives public table state.
             */

            let tableAttachment;

            try {

                tableAttachment =
                    await tableRenderer.renderTable({
                        players: [],
                        pot: session.pot,
                        currentTurn: undefined,
                        status: "WAITING FOR PLAYERS"
                    });

            } catch (error) {

                /*
                 * The session exists only in memory at this point.
                 *
                 * If rendering fails, cancel and remove it so the
                 * channel is not left with an invisible orphaned
                 * Pressure table.
                 */

                try {

                    pressure.cancelSession(
                        session.id
                    );

                    pressure.deleteSession(
                        session.id
                    );

                } catch {
                    /*
                     * Preserve the original rendering error.
                     */
                }

                throw error;
            }

            /*
             * =================================================
             * PUBLIC TABLE EMBED
             * =================================================
             *
             * This is the initial public lobby.
             *
             * It intentionally contains no private information.
             */

            const embed =
                new EmbedBuilder()
                    .setColor(0xD8AD55)
                    .setTitle(
                        "🎴 PRESSURE"
                    )
                    .setDescription(
                        [
                            "**Four players. One table. Every decision increases the pressure.**",
                            "",
                            "Build a **High Pressure** or **Super Pressure** hand while managing your Nickel and passing cards clockwise.",
                            "",
                            `🎴 **Seats:** \`${session.players.length} / ${pressure.maxPlayers}\``,
                            "💰 **Buy-in:** `100–10,000 Nickel`",
                            "",
                            "The table is ready.",
                            "Select **JOIN TABLE** to enter the game."
                        ].join("\n")
                    )
                    .setImage(
                        "attachment://pressure-table.png"
                    )
                    .setFooter({
                        text:
                            "Pressure • Quill & Ink"
                    });

            /*
             * =================================================
             * TABLE BUTTONS
             * =================================================
             *
             * The session ID is embedded in each button.
             *
             * LEAVE is disabled because the table currently
             * contains no player.
             *
             * The interaction handler will enable/disable the
             * appropriate controls as the table changes.
             */

            const row =
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId(
                                `pressure:${JOIN_ACTION}:${session.id}`
                            )
                            .setLabel(
                                "JOIN TABLE"
                            )
                            .setEmoji(
                                "🎴"
                            )
                            .setStyle(
                                ButtonStyle.Success
                            ),

                        new ButtonBuilder()
                            .setCustomId(
                                `pressure:${LEAVE_ACTION}:${session.id}`
                            )
                            .setLabel(
                                "CASH OUT"
                            )
                            .setEmoji(
                                "💰"
                            )
                            .setStyle(
                                ButtonStyle.Danger
                            )
                            .setDisabled(true),

                        new ButtonBuilder()
                            .setCustomId(
                                `pressure:${HOW_TO_PLAY_ACTION}:${session.id}`
                            )
                            .setLabel(
                                "HOW TO PLAY"
                            )
                            .setEmoji(
                                "❔"
                            )
                            .setStyle(
                                ButtonStyle.Secondary
                            )
                    );

            /*
             * =================================================
             * SEND PUBLIC TABLE MESSAGE
             * =================================================
             *
             * The message itself becomes the persistent Discord
             * representation of this Pressure table.
             */

            let message;

            try {

                                await interaction.editReply({
                    embeds: [
                        embed
                    ],
                    files: [
                        tableAttachment
                    ],
                    components: [
                        row
                    ]
                });

                /*
                 * =================================================
                 * STORE TABLE MESSAGE ID
                 * =================================================
                 *
                 * The session must remember the exact Discord
                 * message so future interactions can update the
                 * same table rather than creating replacements.
                 */

                message =
                    await interaction.fetchReply();

                session.tableMessageId =
                    message.id;

            } catch (error) {

                /*
                 * =================================================
                 * CREATION ROLLBACK
                 * =================================================
                 *
                 * If Discord message creation or retrieval fails,
                 * remove the newly-created session.
                 *
                 * No player has joined yet, so there is no Economy
                 * balance to refund at this stage.
                 */

                try {

                    pressure.cancelSession(
                        session.id
                    );

                    pressure.deleteSession(
                        session.id
                    );

                } catch {
                    /*
                     * Preserve the original Discord error.
                     */
                }

                throw error;
            }

            /*
             * =================================================
             * TABLE CREATED LIFECYCLE CALLBACK
             * =================================================
             *
             * At this point:
             *
             * - The session exists.
             * - The public table message exists.
             * - The session knows the message ID.
             *
             * PressurePlugin can now safely lock the dedicated
             * game channel.
             *
             * If the lifecycle operation fails, roll the table
             * creation back instead of leaving an unusable table
             * behind.
             */

            if (onTableCreated) {

                try {

                    await onTableCreated(
                        session.id
                    );

                } catch (error) {

                    /*
                     * Attempt to remove the public table message
                     * because the table could not complete its
                     * creation lifecycle.
                     */

                    try {

                        await message.delete();

                    } catch {
                        /*
                         * Preserve the original lifecycle error.
                         */
                    }

                    /*
                     * Remove the orphaned session.
                     */

                    try {

                        pressure.cancelSession(
                            session.id
                        );

                        pressure.deleteSession(
                            session.id
                        );

                    } catch {
                        /*
                         * Preserve the original lifecycle error.
                         */
                    }

                    throw error;
                }
            }
        }
    };
}

END FILE: src/plugins/pressure/commands/PressureCommand.ts
================================================================================

FILE: src/plugins/pressure/commands/PressureRemoveCommand.ts
--------------------------------------------------------------------------------
Original size: 14223 bytes
Exported size: 13763 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

import {
    Command
} from "../../../core/loader/CommandLoader.js";

import {
    EconomyAccountService
} from "../../economy/services/EconomyAccountService.js";

import {
    PressureService
} from "../services/PressureService.js";

/*
 * =========================================================
 * PRESSURE REMOVE COMMAND
 * =========================================================
 *
 * Permanently removes the Pressure table from the current
 * channel.
 *
 * IMPORTANT:
 *
 * - Administrator-only.
 * - Works while waiting, active, finished, or during cooldown.
 * - Stops/cancels the session before processing refunds.
 * - Refunds every seated player's current table balance.
 * - Never refunds the same balance twice.
 * - Deletes the persistent Discord table message.
 * - Deletes the Pressure session only after all refunds
 *   have succeeded.
 *
 * PressurePlugin remains responsible for:
 *
 * - Channel permissions
 * - Discord timers
 * - Local lifecycle bookkeeping
 *
 * The command therefore reports successful table removal
 * through onTableRemoved().
 * =========================================================
 */

/*
 * =========================================================
 * TABLE REMOVED CALLBACK
 * =========================================================
 *
 * channelId is intentionally provided because the session is
 * deleted before the callback executes.
 *
 * The plugin therefore does not need to retrieve information
 * from a session that no longer exists.
 * =========================================================
 */

type TableRemovedCallback = (
    sessionId: string,
    channelId: string
) => Promise<void>;

/*
 * =========================================================
 * CREATE PRESSURE REMOVE COMMAND
 * =========================================================
 */

export function createPressureRemoveCommand(
    pressure: PressureService,
    economy: EconomyAccountService,
    onTableRemoved?: TableRemovedCallback
): Command {

    return {

        /*
         * =====================================================
         * COMMAND DATA
         * =====================================================
         */

        data:
            new SlashCommandBuilder()
                .setName("pressure-remove")
                .setDescription(
                    "Remove the Pressure table from this channel."
                )
                .setDefaultMemberPermissions(
                    PermissionFlagsBits.Administrator.toString()
                ),

        /*
         * =====================================================
         * EXECUTE
         * =====================================================
         */

        async execute(
            ...args: unknown[]
        ): Promise<void> {

            const interaction =
                args[0] as
                    | ChatInputCommandInteraction
                    | undefined;

            /*
             * =================================================
             * INTERACTION VALIDATION
             * =================================================
             */

            if (
                !interaction ||
                !interaction.isChatInputCommand()
            ) {

                throw new Error(
                    "Pressure remove command received an invalid interaction."
                );
            }

            /*
             * =================================================
             * GUILD VALIDATION
             * =================================================
             */

            if (!interaction.guildId) {

                await interaction.reply({
                    content:
                        "🎴 **Pressure** tables can only be removed inside a server.",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * ADMIN VALIDATION
             * =================================================
             *
             * The slash-command registration already restricts
             * this command to administrators.
             *
             * This runtime check provides the second protection
             * layer.
             */

            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                await interaction.reply({
                    content:
                        "🔒 Only server administrators can remove a **Pressure** table.",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * CHANNEL VALIDATION
             * =================================================
             */

            if (!interaction.channelId) {

                await interaction.reply({
                    content:
                        "🎴 **Pressure** could not determine the current game channel.",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * FIND TABLE
             * =================================================
             *
             * PressureService remains the authoritative source
             * for the persistent table in this channel.
             */

            const session =
                pressure.getTable(
                    interaction.guildId,
                    interaction.channelId
                );

            if (!session) {

                await interaction.reply({
                    content:
                        "🎴 **There is no Pressure table in this channel.**",
                    ephemeral: true
                });

                return;
            }

            /*
             * =================================================
             * CAPTURE LIFECYCLE DATA
             * =================================================
             *
             * These values must be captured before the session
             * is deleted.
             */

            const sessionId =
                session.id;

            const channelId =
                session.channelId;

            /*
             * =================================================
             * ACKNOWLEDGE THE COMMAND
             * =================================================
             *
             * Refund processing may require asynchronous
             * database operations.
             */

            await interaction.deferReply({
                ephemeral: true
            });

            /*
             * =================================================
             * CANCEL FIRST
             * =================================================
             *
             * Cancelling before refunds prevents active gameplay
             * from continuing while balances are being returned.
             *
             * PressureService owns gameplay cancellation.
             */

            try {

                pressure.cancelSession(
                    sessionId
                );

            } catch (error) {

                await interaction.editReply({
                    content:
                        "❌ **Pressure** could not safely stop the current game.\n\n" +
                        "No balances were refunded and the table was not removed."
                });

                throw error;
            }

            /*
             * =================================================
             * REFUND PLAYERS
             * =================================================
             *
             * Every seated player's CURRENT table balance is
             * returned to Economy.
             *
             * The balance is only zeroed AFTER a successful
             * deposit.
             *
             * This makes the operation retry-safe if one refund
             * fails part-way through the process.
             */

            try {

                for (
                    const player
                    of session.players
                ) {

                    const amount =
                        player.balance;

                    /*
                     * Nothing needs to be deposited for a player
                     * whose table balance is already zero.
                     */

                    if (
                        amount <= 0n
                    ) {

                        continue;
                    }

                    await economy.depositForGame(
                        session.guildId,
                        player.id,
                        amount
                    );

                    /*
                     * Only clear the in-memory balance AFTER the
                     * Economy deposit has succeeded.
                     */

                    player.balance =
                        0n;
                }

            } catch (error) {

                /*
                 * IMPORTANT:
                 *
                 * Do NOT delete the session if a refund fails.
                 *
                 * The session remains available so the command
                 * can safely be retried.
                 */

                await interaction.editReply({
                    content:
                        "⚠️ **Pressure** was stopped, but at least one player refund failed.\n\n" +
                        "The table has **not** been deleted so the remaining balances can be recovered safely.\n\n" +
                        "Please run `/pressure-remove` again after resolving the Economy issue."
                });

                throw error;
            }

            /*
             * =================================================
             * DELETE SESSION
             * =================================================
             *
             * All seated player balances have now been returned
             * successfully.
             *
             * It is now safe to remove the authoritative session.
             */

            pressure.deleteSession(
                sessionId
            );

            /*
             * =================================================
             * DELETE PUBLIC TABLE MESSAGE
             * =================================================
             *
             * The session no longer exists, so the persistent
             * Discord representation should also be removed.
             */

            if (
                session.tableMessageId
            ) {

                try {

                    const channel =
                        await interaction.guild?.channels.fetch(
                            channelId
                        );

                    if (
                        channel &&
                        "messages" in channel
                    ) {

                        const message =
                            await channel.messages.fetch(
                                session.tableMessageId
                            );

                        await message.delete();
                    }

                } catch {
                    /*
                     * The financial/session cleanup has already
                     * succeeded.
                     *
                     * A missing or already-deleted Discord message
                     * does not invalidate the table removal.
                     */
                }
            }

            /*
             * =================================================
             * TABLE REMOVED LIFECYCLE CALLBACK
             * =================================================
             *
             * At this point:
             *
             * - All player balances were refunded.
             * - The session was deleted.
             * - The public table message was removed when possible.
             *
             * PressurePlugin receives the captured session and
             * channel IDs so it can clean its own Discord
             * lifecycle state.
             */

            if (onTableRemoved) {

                try {

                    await onTableRemoved(
                        sessionId,
                        channelId
                    );

                } catch (error) {

                    /*
                     * The actual table removal already succeeded.
                     *
                     * Report the lifecycle cleanup issue separately.
                     */

                    await interaction.editReply({
                        content:
                            "⚠️ **Pressure** was removed successfully, but some channel cleanup could not be completed automatically.\n\n" +
                            "Please check the Pressure channel permissions."
                    });

                    throw error;
                }
            }

            /*
             * =================================================
             * SUCCESS
             * =================================================
             */

            await interaction.editReply({
                content:
                    "✅ **Pressure table removed successfully.**\n\n" +
                    "All seated player balances were returned to their Economy accounts."
            });
        }
    };
}


END FILE: src/plugins/pressure/commands/PressureRemoveCommand.ts
================================================================================

FILE: src/plugins/pressure/handlers/PressureInteractionHandler.ts
--------------------------------------------------------------------------------
Original size: 42044 bytes
Exported size: 40476 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    Message,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

import { PressureService } from "../services/PressureService.js";
import { PressureCardRenderer } from "../services/PressureCardRenderer.js";
import { PressureTableRenderer } from "../services/PressureTableRenderer.js";
import { EconomyAccountService } from "../../economy/services/EconomyAccountService.js";
import { RobberyHeadquarters } from "../../robbery/headquarters/RobberyHeadquarters.js";

const MIN_BUY_IN = 100n;
const MAX_BUY_IN = 10_000n;

const JOIN_BUTTON = "pressure_join";
const LEAVE_BUTTON = "pressure_leave";
const HOW_TO_PLAY_BUTTON = "pressure_how_to_play";
const VIEW_HAND_BUTTON = "pressure_view_hand";
const BUY_IN_MODAL = "pressure_buyin";
const BUY_IN_INPUT = "pressure_buyin_amount";

export class PressureInteractionHandler {

    private readonly pendingBuyIns = new Set<string>();

    private readonly finishedSessionsNotified = new Set<string>();

    constructor(
        private readonly pressure: PressureService,
        private readonly cardRenderer: PressureCardRenderer,
        private readonly tableRenderer: PressureTableRenderer,
        private readonly economy: EconomyAccountService,
        private readonly onGameStarted?: (
            sessionId: string
        ) => Promise<void>,
        private readonly onGameFinished?: (
            sessionId: string
        ) => Promise<void>,
        private readonly onTurnChanged?: (
            sessionId: string
        ) => Promise<void>
    ) {}

    async handleInteraction(
        interaction: ButtonInteraction | ModalSubmitInteraction
    ): Promise<void> {

        if (!interaction.guild) {
            return;
        }

        if (interaction.isButton()) {
            await this.handleButton(interaction);
            return;
        }

        await this.handleModal(interaction);
    }

    async handleMessage(message: Message): Promise<void> {

        if (!message.guild || message.author.bot) {
            return;
        }

        const session = this.pressure.getPlayerSession(
            message.guild.id,
            message.author.id
        );

        if (!session || session.channelId !== message.channelId) {
            return;
        }

        if (session.status !== "playing") {
            return;
        }

        const command = this.parseGameplayCommand(
            message.content
        );

        if (!command) {
            return;
        }

        try {

            switch (command.type) {

                case "pass":
                    this.pressure.passCard(
                        session.id,
                        message.author.id,
                        command.symbol,
                        command.handPosition
                    );
                    break;

                case "raise":
                    this.pressure.raise(
                        session.id,
                        message.author.id,
                        command.amount
                    );
                    break;

                case "call":
                    this.pressure.call(
                        session.id,
                        message.author.id
                    );
                    break;

                case "allin":
                    this.pressure.allIn(
                        session.id,
                        message.author.id
                    );
                    break;

                case "fold":
                    this.pressure.fold(
                        session.id,
                        message.author.id
                    );
                    break;

                case "high-pressure":
                    this.pressure.claimHighPressure(
                        session.id,
                        message.author.id
                    );
                    break;

                case "super-pressure":
                    this.pressure.claimSuperPressure(
                        session.id,
                        message.author.id
                    );
                    break;
            }

            const updated =
                this.pressure.getSession(
                    session.id
                );

            await this.updateTableMessage(
                message,
                session.id
            );

            if (
                updated?.status === "finished" &&
                !this.finishedSessionsNotified.has(
                    session.id
                )
            ) {

                this.finishedSessionsNotified.add(
                    session.id
                );

                await this.onGameFinished?.(
                    session.id
                );

            } else if (
                updated?.status === "playing"
            ) {

                try {

                    await this.onTurnChanged?.(
                        session.id
                    );

                } catch {
                    /*
                     * Notification failure must never
                     * interrupt successful gameplay.
                     */
                }
            }

        } catch (error) {

            await this.sendGameplayError(
                message,
                error
            );
        }
    }

    private parseGameplayCommand(
        content: string
    ):
        | {
            type: "pass";
            symbol: string;
            handPosition: number;
        }
        | {
            type: "raise";
            amount: bigint;
        }
        | {
            type: "call";
        }
        | {
            type: "allin";
        }
        | {
            type: "fold";
        }
        | {
            type: "high-pressure";
        }
        | {
            type: "super-pressure";
        }
        | undefined {

        const text =
            content.trim();

        const passMatch =
            text.match(
                /^pass\s+([HDCSJ])(\d+)$/i
            );

        if (passMatch) {

            const handPosition =
                Number(
                    passMatch[2]
                );

            if (
                !Number.isSafeInteger(
                    handPosition
                ) ||
                handPosition < 1
            ) {
                return undefined;
            }

            return {
                type: "pass",
                symbol:
                    passMatch[1].toUpperCase(),
                handPosition
            };
        }

        const raiseMatch =
            text.match(
                /^raise\s+(\d+)$/i
            );

        if (raiseMatch) {

            try {

                const amount =
                    BigInt(
                        raiseMatch[1]
                    );

                return amount > 0n
                    ? {
                        type: "raise",
                        amount
                    }
                    : undefined;

            } catch {

                return undefined;
            }
        }

        if (/^call$/i.test(text)) {
            return {
                type: "call"
            };
        }

        if (/^all[- ]?in$/i.test(text)) {
            return {
                type: "allin"
            };
        }

        if (/^fold$/i.test(text)) {
            return {
                type: "fold"
            };
        }

        if (
            /^high\s+pressure$/i.test(text)
        ) {

            return {
                type: "high-pressure"
            };
        }

        if (
            /^super\s+pressure$/i.test(text)
        ) {

            return {
                type: "super-pressure"
            };
        }

        return undefined;
    }

    private async handleButton(
        interaction: ButtonInteraction
    ): Promise<void> {

        const [
            base,
            action
        ] =
            interaction.customId.split(":");

        if (
            interaction.customId === JOIN_BUTTON ||
            (
                base === "pressure" &&
                action === "join"
            )
        ) {

            await this.openBuyInModal(
                interaction
            );

            return;
        }

        if (
            interaction.customId === LEAVE_BUTTON ||
            (
                base === "pressure" &&
                action === "leave"
            )
        ) {

            await this.leaveLobby(
                interaction
            );

            return;
        }

        if (
            interaction.customId === HOW_TO_PLAY_BUTTON ||
            (
                base === "pressure" &&
                action === "how-to-play"
            )
        ) {

            await this.showHowToPlay(
                interaction
            );

            return;
        }

        if (
            interaction.customId === VIEW_HAND_BUTTON ||
            (
                base === "pressure" &&
                action === "view-hand"
            )
        ) {

            await this.showPrivateHand(
                interaction
            );
        }
    }

    private async handleModal(
        interaction: ModalSubmitInteraction
    ): Promise<void> {

        if (
            interaction.customId !==
            BUY_IN_MODAL
        ) {
            return;
        }

        await this.handleBuyIn(
            interaction
        );
    }

    private async openBuyInModal(
        interaction: ButtonInteraction
    ): Promise<void> {

        const guildId =
            interaction.guildId;

        if (!guildId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a server."
            );

            return;
        }

        const channelId =
            interaction.channelId;

        if (!channelId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a valid channel."
            );

            return;
        }

        const session =
            this.pressure.getAvailableTable(
                guildId,
                channelId
            );

        if (!session) {

            await this.replyError(
                interaction,
                "❌ There is no available Pressure table in this channel."
            );

            return;
        }

        if (
            session.players.some(
                player =>
                    player.id ===
                    interaction.user.id
            )
        ) {

            await this.replyError(
                interaction,
                "❌ You are already seated at this Pressure table."
            );

            return;
        }

        if (
            session.players.length >=
            this.pressure.maxPlayers
        ) {

            await this.replyError(
                interaction,
                "❌ This Pressure table is full."
            );

            return;
        }

        const modal =
            new ModalBuilder()
                .setCustomId(
                    BUY_IN_MODAL
                )
                .setTitle(
                    "Pressure • Buy-In"
                );

        const amountInput =
            new TextInputBuilder()
                .setCustomId(
                    BUY_IN_INPUT
                )
                .setLabel(
                    `Buy-in • ${MIN_BUY_IN}–${MAX_BUY_IN} Nickel`
                )
                .setPlaceholder(
                    "Example: 1000"
                )
                .setStyle(
                    TextInputStyle.Short
                )
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(10);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    amountInput
                )
        );

        await interaction.showModal(
            modal
        );
    }

    private async handleBuyIn(
        interaction: ModalSubmitInteraction
    ): Promise<void> {

        const guildId =
            interaction.guildId;

        if (!guildId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a server."
            );

            return;
        }

        const channelId =
            interaction.channelId;

        if (!channelId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a valid channel."
            );

            return;
        }

        const lockKey =
            `${guildId}:${channelId}:${interaction.user.id}`;

        if (
            this.pendingBuyIns.has(
                lockKey
            )
        ) {

            await this.replyError(
                interaction,
                "⏳ Your previous Pressure buy-in is still being processed."
            );

            return;
        }

        this.pendingBuyIns.add(
            lockKey
        );

        try {

            const session =
                this.pressure.getAvailableTable(
                    guildId,
                    channelId
                );

            if (!session) {

                await this.replyError(
                    interaction,
                    "❌ There is no available Pressure table in this channel."
                );

                return;
            }

            if (
                session.players.length >=
                this.pressure.maxPlayers
            ) {

                await this.replyError(
                    interaction,
                    "❌ This Pressure table is full."
                );

                return;
            }

            if (
                session.players.some(
                    player =>
                        player.id ===
                        interaction.user.id
                )
            ) {

                await this.replyError(
                    interaction,
                    "❌ You are already seated at this Pressure table."
                );

                return;
            }

            const rawAmount =
                interaction.fields
                    .getTextInputValue(
                        BUY_IN_INPUT
                    )
                    .trim();

            if (!/^\d+$/.test(rawAmount)) {

                await this.replyError(
                    interaction,
                    "❌ Buy-in must be a whole Nickel amount."
                );

                return;
            }

            const amount =
                BigInt(rawAmount);

            if (
                amount < MIN_BUY_IN ||
                amount > MAX_BUY_IN
            ) {

                await this.replyError(
                    interaction,
                    `❌ Buy-in must be between ${MIN_BUY_IN} and ${MAX_BUY_IN} Nickel.`
                );

                return;
            }

            let withdrawn = false;
            let playerAdded = false;
            let gameStarted = false;

            try {

                await this.economy.withdrawForGame(
                    guildId,
                    interaction.user.id,
                    amount
                );

                withdrawn = true;

                this.pressure.addPlayer(
                    session.id,
                    interaction.user.id,
                    interaction.user.username,
                    guildId,
                    amount
                );

                playerAdded = true;

                const robberyHeadquarters =
                    this.getRobberyHeadquarters(
                        interaction
                    );

                if (robberyHeadquarters) {

                    await robberyHeadquarters.recordWager(
                        guildId,
                        interaction.user.id
                    );
                }

                const updated =
                    this.pressure.getSession(
                        session.id
                    );

                if (!updated) {

                    throw new Error(
                        "PRESSURE_SESSION_NOT_FOUND"
                    );
                }

                const cooldownExpired =
                    updated.status === "waiting" ||
                    updated.nextGameStartsAt === undefined ||
                    Date.now() >=
                        updated.nextGameStartsAt;

                if (
                    updated.players.length ===
                        this.pressure.maxPlayers &&
                    cooldownExpired
                ) {

                    this.pressure.startSession(
                        updated.id
                    );

                    gameStarted = true;

                    await this.onGameStarted?.(
                        updated.id
                    );
                }

                await interaction.reply({
                    content:
                        gameStarted
                            ? "🎴 **Buy-in confirmed.** Four seats are filled — Pressure is starting."
                            : "💰 **Buy-in confirmed.** You are now seated at the Pressure table.",
                    ephemeral: true
                });

                await this.updateTableMessage(
                    interaction,
                    session.id
                );

            } catch (error) {

                if (
                    playerAdded &&
                    !gameStarted
                ) {

                    try {

                        const current =
                            this.pressure.getSession(
                                session.id
                            );

                        const addedPlayer =
                            current?.players.find(
                                player =>
                                    player.id ===
                                    interaction.user.id
                            );

                        if (addedPlayer) {

                            this.pressure.removePlayer(
                                session.id,
                                interaction.user.id
                            );
                        }

                    } catch {
                        /*
                         * Preserve the original error.
                         * The table may already be in a
                         * valid state.
                         */
                    }
                }

                if (
                    withdrawn &&
                    !gameStarted
                ) {

                    try {

                        await this.economy.depositForGame(
                            guildId,
                            interaction.user.id,
                            amount
                        );

                    } catch {
                        /*
                         * Preserve the original error.
                         * External reconciliation is
                         * required if this fails.
                         */
                    }
                }

                await this.replyError(
                    interaction,
                    error
                );
            }

        } finally {

            this.pendingBuyIns.delete(
                lockKey
            );
        }
    }

    private getRobberyHeadquarters(
        interaction: ButtonInteraction | ModalSubmitInteraction
    ): RobberyHeadquarters | undefined {

        const client =
            interaction.client as unknown as {
                services?: {
                    get<T>(
                        name: string
                    ): T | undefined;
                };
            };

        return client.services?.get<RobberyHeadquarters>(
            "robberyHeadquarters"
        );
    }

    private async leaveLobby(
        interaction: ButtonInteraction
    ): Promise<void> {

        const guildId =
            interaction.guildId;

        if (!guildId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a server."
            );

            return;
        }

        const channelId =
            interaction.channelId;

        if (!channelId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a valid channel."
            );

            return;
        }

        const session =
            this.pressure.getAvailableTable(
                guildId,
                channelId
            );

        if (!session) {

            await this.replyError(
                interaction,
                "❌ There is no available Pressure table in this channel."
            );

            return;
        }

        const player =
            session.players.find(
                current =>
                    current.id ===
                    interaction.user.id
            );

        if (!player) {

            await this.replyError(
                interaction,
                "❌ You are not seated at this Pressure table."
            );

            return;
        }

        try {

            const removedPlayer =
                this.pressure.removePlayer(
                    session.id,
                    interaction.user.id
                );

            await this.economy.depositForGame(
                guildId,
                interaction.user.id,
                removedPlayer.balance
            );

            await interaction.reply({
                content:
                    `💰 **Cash-out complete.** ${removedPlayer.balance} Nickel was returned to your Economy balance.`,
                ephemeral: true
            });

            await this.updateTableMessage(
                interaction,
                session.id
            );

        } catch (error) {

            await this.replyError(
                interaction,
                error
            );
        }
    }

    private async showPrivateHand(
        interaction: ButtonInteraction
    ): Promise<void> {

        const guildId =
            interaction.guildId;

        if (!guildId) {

            await this.replyError(
                interaction,
                "❌ Pressure can only be used inside a server."
            );

            return;
        }

        const session =
            this.pressure.getPlayerSession(
                guildId,
                interaction.user.id
            );

        if (
            !session ||
            session.channelId !==
            interaction.channelId
        ) {

            await this.replyError(
                interaction,
                "❌ You are not seated at a Pressure table in this channel."
            );

            return;
        }

        const player =
            session.players.find(
                current =>
                    current.id ===
                    interaction.user.id
            );

        if (!player) {

            await this.replyError(
                interaction,
                "❌ You are not seated at this Pressure table."
            );

            return;
        }

        if (
            session.status !==
            "playing"
        ) {

            await this.replyError(
                interaction,
                "❌ Your private hand is only available during an active match."
            );

            return;
        }

        try {

            const attachment =
                this.cardRenderer.renderHand(
                    player.hand
                );

            await interaction.reply({
                content:
                    "🃏 **Your Pressure hand** — keep this view private.",
                files: [
                    attachment
                ],
                ephemeral: true
            });

        } catch (error) {

            await this.replyError(
                interaction,
                error
            );
        }
    }

    private async showHowToPlay(
        interaction: ButtonInteraction
    ): Promise<void> {

        const embed =
            new EmbedBuilder()
                .setColor(
                    0xD8AD55
                )
                .setTitle(
                    "🎴 Pressure • How to Play"
                )
                .setDescription(
                    [
                        "**Four players. One table. Every decision increases the pressure.**",
                        "",
                        "### 🎴 Passing",
                        "Cards move clockwise. Use `pass H3` to pass the card in **hand position 3** only when that card is Hearts.",
                        "",
                        "`H` Hearts • `D` Diamonds • `C` Clubs • `S` Spades • `J` Joker",
                        "The number is the **1-based hand position**, not the card's rank.",
                        "",
                        "### 💰 Wagering",
                        "Every match opens with an automatic **25 Nickel** contribution from each player.",
                        "",
                        "`raise 50` • Start a wagering cycle with a 50 Nickel raise.",
                        "`call` • Match the current raise.",
                        "`allin` • Commit your remaining table balance.",
                        "`fold` • Fold from the current match.",
                        "",
                        "Each player may raise a maximum of **3 times per match**.",
                        "",
                        "### 👑 Claims",
                        "`high pressure` • Four cards of one suit. Pays 75% to the winner; the remaining 25% is shared among eligible players.",
                        "`super pressure` • Four cards of one suit + Joker. Pays the entire pot.",
                        "",
                        "Claims do not consume your turn and can be made whenever the match is active.",
                        "",
                        "### 🔄 Table Rules",
                        "Players stay seated after a match. Remaining table balances stay at the table.",
                        "Cash out only while waiting or after a match has finished.",
                        "A **60-second cooldown** separates consecutive matches."
                    ].join("\n")
                )
                .setFooter({
                    text:
                        "Pressure • Quill & Ink"
                });

        await interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: true
        });
    }

    private async updateTableMessage(
        source:
            | ButtonInteraction
            | ModalSubmitInteraction
            | Message,
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (
            !session ||
            !session.tableMessageId ||
            !source.guild
        ) {
            return;
        }

        const channel =
            source.guild.channels.cache.get(
                session.channelId
            );

        if (
            !channel ||
            !channel.isTextBased() ||
            !("messages" in channel)
        ) {
            return;
        }

        const tableMessage =
            await channel.messages
                .fetch(
                    session.tableMessageId
                )
                .catch(
                    () => null
                );

        if (!tableMessage) {
            return;
        }

        const players =
            await Promise.all(
                session.players.map(
                    async player => {

                        const member =
                            await source.guild!.members
                                .fetch(player.id)
                                .catch(
                                    () => null
                                );

                        return {
                            player,
                            avatarUrl:
                                member?.displayAvatarURL({
                                    extension:
                                        "png",
                                    size:
                                        128
                                })
                        };
                    }
                )
            );

        const tableAttachment =
            await this.tableRenderer.renderTable({
                players,
                pot:
                    session.pot,
                currentTurn:
                    session.status ===
                    "playing"
                        ? session.currentTurn
                        : undefined,
                status:
                    this.getTableStatus(
                        session
                    )
            });

        const joinEnabled =
            (
                session.status ===
                    "waiting" ||
                session.status ===
                    "finished"
            ) &&
            session.players.length <
            this.pressure.maxPlayers;

        const leaveEnabled =
            session.status ===
            "waiting" ||
            session.status ===
            "finished";

        const viewHandEnabled =
            session.status ===
            "playing";

        const row =
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(
                            JOIN_BUTTON
                        )
                        .setLabel(
                            "JOIN TABLE"
                        )
                        .setEmoji(
                            "🎴"
                        )
                        .setStyle(
                            ButtonStyle.Success
                        )
                        .setDisabled(
                            !joinEnabled
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            LEAVE_BUTTON
                        )
                        .setLabel(
                            "CASH OUT"
                        )
                        .setEmoji(
                            "💰"
                        )
                        .setStyle(
                            ButtonStyle.Danger
                        )
                        .setDisabled(
                            !leaveEnabled
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            VIEW_HAND_BUTTON
                        )
                        .setLabel(
                            "MY HAND"
                        )
                        .setEmoji(
                            "🃏"
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        )
                        .setDisabled(
                            !viewHandEnabled
                        ),

                    new ButtonBuilder()
                        .setCustomId(
                            HOW_TO_PLAY_BUTTON
                        )
                        .setLabel(
                            "HOW TO PLAY"
                        )
                        .setEmoji(
                            "❔"
                        )
                        .setStyle(
                            ButtonStyle.Secondary
                        )
                );

        const embed =
            new EmbedBuilder()
                .setColor(
                    session.status ===
                    "playing"
                        ? 0x08734C
                        : 0xD8AD55
                )
                .setTitle(
                    "🎴 PRESSURE"
                )
                .setDescription(
                    this.getTableDescription(
                        session
                    )
                )
                .setImage(
                    "attachment://pressure-table.png"
                )
                .setFooter({
                    text:
                        "Pressure • Quill & Ink"
                });

        await tableMessage.edit({
            embeds: [
                embed
            ],
            files: [
                tableAttachment
            ],
            components: [
                row
            ]
        });
    }

    private getTableStatus(
        session:
            ReturnType<
                PressureService["getSession"]
            >
    ): string {

        if (!session) {
            return "PRESSURE";
        }

        if (
            session.status ===
            "waiting"
        ) {

            return session.players.length === 0
                ? "WAITING FOR PLAYERS"
                : "WAITING FOR SEATS";
        }

        if (
            session.status ===
            "dealing"
        ) {
            return "DEALING";
        }

        if (
            session.status ===
            "playing"
        ) {
            return "MATCH IN PROGRESS";
        }

        if (
            session.status ===
            "cancelled"
        ) {
            return "TABLE CLOSED";
        }

        if (
            session.nextGameStartsAt &&
            Date.now() <
            session.nextGameStartsAt
        ) {

            const remaining =
                Math.max(
                    1,
                    Math.ceil(
                        (
                            session.nextGameStartsAt -
                            Date.now()
                        ) /
                        1000
                    )
                );

            return `NEXT MATCH IN ${remaining}s`;
        }

        return "READY FOR NEXT MATCH";
    }

    private getTableDescription(
        session:
            NonNullable<
                ReturnType<
                    PressureService["getSession"]
                >
            >
    ): string {

        const seats =
            `${session.players.length}/${this.pressure.maxPlayers}`;

        const pot =
            `${session.pot.toString()} Nickel`;

        if (
            session.status ===
            "playing"
        ) {

            return [
                "**The match is live.**",
                `🎴 **Seats:** ${seats}`,
                `💰 **Pot:** ${pot}`,
                "",
                "Use `pass`, `raise`, `call`, `allin`, or `fold` in the channel.",
                "Claim `high pressure` or `super pressure` whenever you have the winning hand."
            ].join("\n");
        }

        if (
            session.status ===
            "finished"
        ) {

            const cooldown =
                session.nextGameStartsAt &&
                Date.now() <
                session.nextGameStartsAt
                    ? "A one-minute cooldown is active before the next match."
                    : "The table is ready for the next match.";

            return [
                "**The previous match has finished.**",
                `🎴 **Seats:** ${seats}`,
                `💰 **Table pot:** ${pot}`,
                "",
                cooldown,
                "Players remain seated and may cash out before the next match."
            ].join("\n");
        }

        return [
            "**A four-player Pressure table.**",
            `🎴 **Seats:** ${seats}`,
            "",
            session.players.length === 0
                ? "Choose **JOIN TABLE** to take the first seat."
                : "Choose **JOIN TABLE** to take an open seat.",
            "Buy-in: **100–10,000 Nickel**."
        ].join("\n");
    }

    private async sendGameplayError(
        message: Message,
        error: unknown
    ): Promise<void> {

        await message.reply({
            content:
                this.getErrorMessage(
                    error
                )
        }).catch(
            () => undefined
        );
    }

    private async replyError(
        interaction:
            | ButtonInteraction
            | ModalSubmitInteraction,
        error: unknown
    ): Promise<void> {

        const content =
            this.getErrorMessage(
                error
            );

        if (
            interaction.replied ||
            interaction.deferred
        ) {

            await interaction.followUp({
                content,
                ephemeral: true
            }).catch(
                () => undefined
            );

            return;
        }

        await interaction.reply({
            content,
            ephemeral: true
        }).catch(
            () => undefined
        );
    }

    private getErrorMessage(
        error: unknown
    ): string {

        if (!(error instanceof Error)) {

            return "❌ Something went wrong while processing Pressure.";
        }

        switch (error.message) {

            case "LOBBY_ALREADY_EXISTS":
                return "❌ A Pressure table already exists in this channel.";

            case "GAME_NOT_IN_LOBBY":
                return "❌ This Pressure table is not accepting players right now.";

            case "GAME_ALREADY_STARTED":
                return "❌ The Pressure match has already started.";

            case "GAME_FULL":
            case "LOBBY_FULL":
                return "❌ The Pressure table is full.";

            case "PLAYER_ALREADY_IN_GAME":
            case "PLAYER_ALREADY_IN_LOBBY":
                return "❌ You are already seated at this Pressure table.";

            case "PLAYER_NOT_IN_GAME":
            case "PLAYER_NOT_FOUND":
                return "❌ You are not seated at this Pressure table.";

            case "GAME_IN_PROGRESS":
                return "❌ You cannot cash out during an active match.";

            case "WRONG_GUILD":
                return "❌ This Pressure table belongs to another server.";

            case "NOT_YOUR_TURN":
                return "❌ It is not your turn.";

            case "INVALID_CARD":
                return "❌ That card is not valid.";

            case "CARD_SYMBOL_MISMATCH":
                return "❌ The card symbol does not match the card in that hand position.";

            case "INVALID_HAND_POSITION":
                return "❌ That hand position is invalid.";

            case "INVALID_RAISE":
                return "❌ That raise amount is invalid.";

            case "INSUFFICIENT_BALANCE":
                return "❌ You do not have enough Nickel on the Pressure table.";

            case "MAX_RAISES_REACHED":
                return "❌ You have already used all 3 of your raises.";

            case "NO_ACTIVE_RAISE":
                return "❌ There is no active raise to call.";

            case "ALREADY_RESPONDED":
                return "❌ You have already responded to the current raise.";

            case "GAME_NOT_ACTIVE":
                return "❌ There is no active Pressure match.";

            case "CLAIM_NOT_VALID":
            case "HIGH_PRESSURE_NOT_FOUND":
                return "❌ You do not currently have High Pressure.";

            case "SUPER_PRESSURE_NOT_FOUND":
                return "❌ You do not currently have Super Pressure.";

            case "COOLDOWN_ACTIVE":
                return "❌ The next Pressure match is still on cooldown.";

            case "PRESSURE_REQUIRES_FOUR_PLAYERS":
                return "❌ Pressure requires exactly four seated players to start.";

            case "PRESSURE_SESSION_NOT_FOUND":
                return "❌ The Pressure table could not be found.";

            case "PRESSURE_CANNOT_RENDER_EMPTY_HAND":
                return "❌ Your hand is not available to display right now.";

            default:
                return `❌ ${error.message}`;
        }
    }
}

END FILE: src/plugins/pressure/handlers/PressureInteractionHandler.ts
================================================================================

FILE: src/plugins/pressure/models/PressureCard.ts
--------------------------------------------------------------------------------
Original size: 1287 bytes
Exported size: 1216 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

/*
 * =========================================================
 * PRESSURE CARD
 * =========================================================
 *
 * Represents one card in the Pressure deck.
 *
 * Pressure uses:
 *
 * - 4 Hearts
 * - 4 Diamonds
 * - 4 Clubs
 * - 4 Spades
 * - 1 Joker
 *
 * Total: 17 cards.
 */

/*
 * =========================================================
 * PRESSURE SUIT
 * =========================================================
 */

export type PressureSuit =
    | "hearts"
    | "diamonds"
    | "clubs"
    | "spades"
    | "joker";

/*
 * =========================================================
 * PRESSURE SYMBOL
 * =========================================================
 */

export type PressureSymbol =
    | "H"
    | "D"
    | "C"
    | "S"
    | "J";

/*
 * =========================================================
 * PRESSURE CARD
 * =========================================================
 */

export interface PressureCard {

    /*
     * Unique identifier for this physical card.
     */

    readonly id: string;

    /*
     * Card suit.
     */

    readonly suit: PressureSuit;

    /*
     * Display/game symbol.
     */

    readonly symbol: PressureSymbol;
}


END FILE: src/plugins/pressure/models/PressureCard.ts
================================================================================

FILE: src/plugins/pressure/models/PressurePlayer.ts
--------------------------------------------------------------------------------
Original size: 3119 bytes
Exported size: 2990 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { PressureCard } from "./PressureCard.js";

/*
 * =========================================================
 * PRESSURE PLAYER
 * =========================================================
 *
 * Represents one player seated at a Pressure table.
 *
 * IMPORTANT:
 *
 * The player remains associated with the Pressure table
 * across multiple matches.
 *
 * Their balance is their current Pressure table balance.
 *
 * It is NOT their Economy wallet balance.
 */

export interface PressurePlayer {

    /*
     * =====================================================
     * IDENTITY
     * =====================================================
     */

    readonly id: string;

    readonly username: string;

    /*
     * =====================================================
     * TABLE POSITION
     * =====================================================
     *
     * 0 = first player
     * 1 = clockwise
     * 2 = clockwise
     * 3 = clockwise
     */

    position: number;

    /*
     * =====================================================
     * HAND
     * =====================================================
     *
     * The player's private cards.
     *
     * These cards must never be exposed publicly
     * through the Discord table UI.
     */

    hand: PressureCard[];

    /*
     * =====================================================
     * TABLE BALANCE
     * =====================================================
     *
     * Nickel currently held by the player at the
     * Pressure table.
     *
     * This balance survives between matches.
     *
     * It is returned to the Economy system only when
     * the player leaves the Pressure table.
     */

    balance: bigint;

    /*
     * =====================================================
     * MATCH WAGER
     * =====================================================
     *
     * Total Nickel committed by this player to the
     * current Pressure match.
     *
     * This resets when a new match starts.
     */

    wagered: bigint;

    /*
     * =====================================================
     * RAISES
     * =====================================================
     *
     * Number of raises used by this player in the
     * current Pressure match.
     *
     * Every new match starts with 0 raises used.
     *
     * Each player has a maximum of 3 raises.
     */

    raiseCount: number;

    /*
     * =====================================================
     * STATE
     * =====================================================
     */

    /*
     * Whether the player is still eligible for
     * normal gameplay.
     */

    active: boolean;

    /*
     * Whether the player has folded from the
     * current match.
     *
     * A folded player remains seated at the table.
     */

    folded: boolean;

    /*
     * Whether the player has committed their entire
     * available table balance to the current match.
     */

    allIn: boolean;
}

END FILE: src/plugins/pressure/models/PressurePlayer.ts
================================================================================

FILE: src/plugins/pressure/models/PressureSession.ts
--------------------------------------------------------------------------------
Original size: 8514 bytes
Exported size: 8174 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { PressureCard } from "./PressureCard.js";
import { PressurePlayer } from "./PressurePlayer.js";

/*
 * =========================================================
 * PRESSURE GAME STATUS
 * =========================================================
 *
 * The session represents the persistent Pressure table.
 *
 * "finished" means the CURRENT MATCH has finished.
 *
 * The table and seated players may remain available
 * for another match.
 */

export type PressureStatus =
    | "waiting"
    | "dealing"
    | "playing"
    | "finished"
    | "cancelled";

/*
 * =========================================================
 * PRESSURE PHASE
 * =========================================================
 *
 * Pressure has two gameplay phases:
 *
 * - passing
 * - wagering
 *
 * IMPORTANT:
 *
 * There are NO fixed rounds.
 *
 * Passing continues normally until a player chooses
 * a wagering action that creates a wagering cycle.
 *
 * A wagering cycle exists only when a player raises.
 */

export type PressurePhase =
    | "passing"
    | "wagering";

/*
 * =========================================================
 * PRESSURE SESSION
 * =========================================================
 *
 * Represents the persistent Pressure table.
 *
 * IMPORTANT:
 *
 * Pressure has NO host.
 *
 * The session contains the seated players and their
 * table balances.
 *
 * A single session may contain multiple matches.
 * =========================================================
 */

export interface PressureSession {

    /*
     * =====================================================
     * IDENTITY
     * =====================================================
     */

    readonly id: string;

    readonly guildId: string;

    readonly channelId: string;

    /*
     * =====================================================
     * PLAYERS
     * =====================================================
     *
     * Pressure requires exactly 4 players to start
     * a match.
     *
     * Array order represents table position.
     *
     * 0 → first player
     * 1 → second player
     * 2 → third player
     * 3 → fourth player
     */

    players: PressurePlayer[];

    /*
     * =====================================================
     * DECK
     * =====================================================
     *
     * Remaining cards for the CURRENT match.
     */

    deck: PressureCard[];

    /*
     * =====================================================
     * DISCARD
     * =====================================================
     *
     * Cards that have left a player's hand and are no
     * longer part of active player hands.
     *
     * Normal Pressure passing does NOT discard cards.
     *
     * Passed cards move directly to another player's hand.
     */

    discarded: PressureCard[];

    /*
     * =====================================================
     * GAME STATE
     * =====================================================
     */

    status: PressureStatus;

    /*
     * =====================================================
     * CURRENT PHASE
     * =====================================================
     *
     * "passing":
     *
     * Players are performing the normal clockwise
     * passing cycle.
     *
     * "wagering":
     *
     * A player has raised and the other players are
     * responding to that raise.
     *
     * There are NO fixed phase rounds.
     */

    phase: PressurePhase;

    /*
     * =====================================================
     * CURRENT TURN
     * =====================================================
     *
     * Position of the player whose turn it is.
     */

    currentTurn: number;

    /*
     * =====================================================
     * PASSING CYCLE
     * =====================================================
     *
     * Tracks the players who have completed their
     * card-passing turn in the CURRENT passing cycle.
     *
     * A complete passing cycle is:
     *
     * 0 → 1 → 2 → 3
     *
     * Once all eligible players have passed, the next
     * normal gameplay decision becomes available.
     */

    passingActedPlayerIds: string[];

    /*
     * =====================================================
     * WAGERING CYCLE
     * =====================================================
     *
     * A wagering cycle is created ONLY when a player
     * chooses RAISE.
     *
     * The first player who raises becomes the cycle starter.
     *
     * The cycle starter does NOT get reopened because
     * another player raises later.
     */

    wageringStarterId?: string;

    /*
     * =====================================================
     * WAGERING RESPONSES
     * =====================================================
     *
     * Players who have already settled against the
     * CURRENT raise during the active wagering cycle.
     *
     * If a player raises again, the relevant response
     * state is recalculated for the remaining players.
     *
     * The original wagering starter remains the starter
     * and is never reopened during that wagering cycle.
     */

    wageringRespondedPlayerIds: string[];

    /*
     * =====================================================
     * CURRENT RAISE
     * =====================================================
     *
     * This is NOT the player's total match contribution.
     *
     * It represents the additional Nickel amount created
     * by the current raise.
     *
     * Example:
     *
     * Opening contribution:
     *
     * P0 = 25
     * P1 = 25
     * P2 = 25
     * P3 = 25
     *
     * Pot = 100
     *
     * P0 raises 50:
     *
     * P0 contributes another 50.
     *
     * currentRaise = 50
     *
     * P1 calling means P1 contributes 50.
     *
     * It does NOT mean P1 contributes 75.
     */

    currentRaise: bigint;

    /*
     * =====================================================
     * WAGERING STATE
     * =====================================================
     *
     * Whether a raise has been made during the current
     * wagering decision.
     *
     * This determines whether players are responding
     * to a raise or are still making an initial decision.
     */

    wageringActive: boolean;

    /*
     * =====================================================
     * CHECK AVAILABILITY
     * =====================================================
     *
     * Reserved for a future Pressure rule.
     * Check is currently disabled and is not a legal action.
     */

    checkAvailable: boolean;

    /*
     * =====================================================
     * POT
     * =====================================================
     *
     * Nickel committed to the CURRENT match.
     *
     * This includes:
     *
     * - automatic opening contributions
     * - raises
     * - calls
     * - all-in contributions
     */

    pot: bigint;

    /*
     * =====================================================
     * TURN TIMER
     * =====================================================
     */

    turnStartedAt?: number;

    turnExpiresAt?: number;

    /*
     * =====================================================
     * TABLE MESSAGE
     * =====================================================
     *
     * Discord message containing the public Pressure
     * table UI.
     */

    tableMessageId?: string;

    /*
     * =====================================================
     * TIMESTAMPS
     * =====================================================
     */

    readonly createdAt: number;

    /*
     * Timestamp of the current match start.
     */

    startedAt?: number;

    /*
     * Timestamp of the current match finish.
     */

    finishedAt?: number;

    /*
     * Timestamp at which the next match may start.
     *
     * This is used for the persistent table's
     * one-minute post-match cooldown.
     *
     * The PressureService only stores this timestamp.
     * Discord timers/channel permissions are handled
     * outside the service.
     */

    nextGameStartsAt?: number;
}

END FILE: src/plugins/pressure/models/PressureSession.ts
================================================================================

FILE: src/plugins/pressure/PressurePlugin.ts
--------------------------------------------------------------------------------
Original size: 47112 bytes
Exported size: 45152 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits
} from "discord.js";

import {
    Plugin
} from "../../core/plugins/Plugin.js";

import {
    PluginContext
} from "../../core/plugins/PluginContext.js";

import {
    PrismaService
} from "../../core/database/PrismaService.js";

import {
    createPressureCommand
} from "./commands/PressureCommand.js";

import {
    createPressureRemoveCommand
} from "./commands/PressureRemoveCommand.js";

import {
    PressureService
} from "./services/PressureService.js";

import {
    PressureCardRenderer
} from "./services/PressureCardRenderer.js";

import {
    PressureTableRenderer
} from "./services/PressureTableRenderer.js";

import {
    PressureInteractionHandler
} from "./handlers/PressureInteractionHandler.js";

import {
    PressureSession
} from "./models/PressureSession.js";

import {
    EconomyAccountService
} from "../economy/services/EconomyAccountService.js";

/*
 * =========================================================
 * PRESSURE PLUGIN
 * =========================================================
 *
 * Pressure is a persistent four-player multiplayer game.
 *
 * The plugin owns:
 *
 * - PressureService lifecycle
 * - Discord channel permissions
 * - Discord timers
 * - Interaction handler lifecycle
 * - Command registration
 * - Discord listeners
 * - Match cooldowns
 * - Player notifications
 *
 * PressureService owns:
 *
 * - Sessions
 * - Players
 * - Hands
 * - Deck state
 * - Passing
 * - Wagering
 * - Settlement
 *
 * Renderers own:
 *
 * - Public table visuals
 * - Private hand visuals
 *
 * Commands own:
 *
 * - Slash-command entry points
 *
 * InteractionHandler owns:
 *
 * - Button interactions
 * - Modal interactions
 * - Message-based gameplay actions
 * =========================================================
 */

export class PressurePlugin implements Plugin {

    /*
     * =====================================================
     * METADATA
     * =====================================================
     */

    readonly metadata = {

        id:
            "pressure",

        name:
            "Pressure",

        version:
            "1.0.0",

        description:
            "Multiplayer wagered card game for Quill & Ink"
    };

    /*
     * =====================================================
     * CORE SERVICE
     * =====================================================
     */

    readonly pressure =
        new PressureService();

    /*
     * =====================================================
     * RENDERERS
     * =====================================================
     */

    readonly cardRenderer =
        new PressureCardRenderer();

    readonly tableRenderer =
        new PressureTableRenderer();

    /*
     * =====================================================
     * ECONOMY
     * =====================================================
     */

    private economy:
        EconomyAccountService | null = null;

    /*
     * =====================================================
     * DATABASE
     * =====================================================
     *
     * Pressure settlement bookkeeping uses the same shared
     * PrismaService instance provided by the plugin context.
     */

    private database:
        PrismaService | null = null;

    /*
     * =====================================================
     * SETTLEMENT STATE
     * =====================================================
     *
     * Prevents the same completed Pressure match from
     * returning its Ink Bank remainder more than once.
     */

    private readonly persistedSettlementSessions =
        new Set<string>();

    /*
     * =====================================================
     * INTERACTION HANDLER
     * =====================================================
     */

    private interactionHandler:
        PressureInteractionHandler | null = null;

    /*
     * =====================================================
     * PLUGIN CONTEXT
     * =====================================================
     */

    private context:
        PluginContext | null = null;

    /*
     * =====================================================
     * COOLDOWN TIMERS
     * =====================================================
     */

    private readonly cooldownTimers =
        new Map<
            string,
            ReturnType<PluginContext["setTimeout"]>
        >();

    /*
     * =====================================================
     * TURN TIMERS
     * =====================================================
     *
     * One runtime timer exists for the current turn.
     *
     * The timer captures:
     *
     * - session id
     * - player id
     * - turn index
     * - expiration timestamp
     *
     * PressureService validates all four values before
     * allowing the timeout to fold the player.
     *
     * This prevents an old timeout from affecting a later
     * turn.
     */

    private readonly turnTimers =
        new Map<
            string,
            ReturnType<PluginContext["setTimeout"]>
        >();

    /*
     * =====================================================
     * ACTIVE PLAYER PERMISSIONS
     * =====================================================
     */

    private readonly permittedPlayers =
        new Map<
            string,
            Set<string>
        >();

    /*
     * =====================================================
     * ORIGINAL PERMISSION SNAPSHOTS
     * =====================================================
     */

    private readonly permissionSnapshots =
        new Map<
            string,
            {
                everyone: {
                    exists: boolean;
                    sendMessages: boolean | null;
                };

                players: Map<
                    string,
                    {
                        exists: boolean;
                        sendMessages: boolean | null;
                    }
                >;
            }
        >();

    /*
     * =====================================================
     * NOTIFICATION STATE
     * =====================================================
     *
     * Prevents duplicate notifications for the same
     * authoritative turn state.
     */

    private readonly notifiedTurns =
        new Set<string>();

    /*
     * =====================================================
     * REGISTER
     * =====================================================
     */

    register(
        context: PluginContext
    ): void {

        this.context =
            context;

        context.logger.info(
            "Pressure Plugin registered"
        );

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

            throw new Error(
                "Pressure Plugin requires the database service."
            );
        }

        this.database =
            database;

        /*
         * =================================================
         * ECONOMY
         * =================================================
         */

        const economy =
            new EconomyAccountService(
                database
            );

        this.economy =
            economy;

        /*
         * =================================================
         * INTERACTION HANDLER
         * =================================================
         */

        this.interactionHandler =
            new PressureInteractionHandler(
                this.pressure,
                this.cardRenderer,
                this.tableRenderer,
                economy,

                async (
                    sessionId: string
                ): Promise<void> => {

                    await this.handleGameStarted(
                        sessionId
                    );
                },

                async (
                    sessionId: string
                ): Promise<void> => {

                    await this.handleGameFinished(
                        sessionId
                    );
                },

                async (
                    sessionId: string
                ): Promise<void> => {

                    await this.handleTurnChanged(
                        sessionId
                    );
                }
            );

        /*
         * =================================================
         * /PRESSURE
         * =================================================
         *
         * Pressure gameplay is Premium.
         *
         * Entitlement is enforced centrally by the command
         * executor through the command access declaration.
         */

        const pressureCommand =
            createPressureCommand(
                this.pressure,
                this.tableRenderer,

                async (
                    sessionId: string
                ): Promise<void> => {

                    await this.handleTableCreated(
                        sessionId
                    );
                }
            );

        context.commands.registerCommand({
            ...pressureCommand,
            access:
                "premium" as const
        });

        /*
         * =================================================
         * /PRESSURE-REMOVE
         * =================================================
         *
         * This remains available for administration/cleanup.
         * It should not become unusable merely because Premium
         * expires.
         */

        context.commands.registerCommand(
            createPressureRemoveCommand(
                this.pressure,
                economy,

                async (
                    sessionId: string,
                    channelId: string
                ): Promise<void> => {

                    await this.handleTableRemoved(
                        sessionId,
                        channelId
                    );
                }
            )
        );

        /*
         * =================================================
         * INTERACTION LISTENER
         * =================================================
         *
         * Exactly one interactionCreate listener belongs
         * to Pressure.
         */

        context.on(
            "interactionCreate",
            async interaction => {

                if (
                    !interaction.isButton() &&
                    !interaction.isModalSubmit()
                ) {

                    return;
                }

                try {

                    await this.interactionHandler?.handleInteraction(
                        interaction
                    );

                } catch (error) {

                    context.logger.error(
                        "Pressure interaction handling failed.",
                        error
                    );
                }
            }
        );

        /*
         * =================================================
         * MESSAGE LISTENER
         * =================================================
         */

        context.on(
            "messageCreate",
            async message => {

                try {

                    await this.interactionHandler?.handleMessage(
                        message
                    );

                } catch (error) {

                    context.logger.error(
                        "Pressure message handling failed.",
                        error
                    );
                }
            }
        );
    }

    /*
     * =====================================================
     * TABLE CREATED
     * =====================================================
     */

    private async handleTableCreated(
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {

            throw new Error(
                "Pressure session was not found after table creation."
            );
        }

        await this.setChannelPermissions(
            session.channelId,
            [],
            false,
            session.id
        );
    }

    /*
     * =====================================================
     * GAME STARTED
     * =====================================================
     */

    private async handleGameStarted(
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {

            throw new Error(
                "Pressure session was not found when starting a game."
            );
        }

        this.clearCooldownTimer(
            session.id
        );

        this.clearTurnTimer(
            session.id
        );

        this.clearSessionNotificationState(
            session.id
        );

        const playerIds =
            session.players.map(
                player =>
                    player.id
            );

        await this.setChannelPermissions(
            session.channelId,
            playerIds,
            true,
            session.id
        );

        /*
         * Match-start notification.
         *
         * All four players are explicitly mentioned.
         */

        try {

            await this.notifyGameStarted(
                session
            );

        } catch (error) {

            this.context?.logger.warn(
                `Pressure game start notification failed: ${String(error)}`
            );
        }

        /*
         * Start the runtime timer for the opening turn.
         */

        this.scheduleTurnTimer(
            session
        );

        /*
         * First turn notification.
         */

        try {

            await this.notifyCurrentTurn(
                session
            );

        } catch (error) {

            this.context?.logger.warn(
                `Pressure initial turn notification failed: ${String(error)}`
            );
        }
    }

    /*
     * =====================================================
     * TURN CHANGED
     * =====================================================
     */

    private async handleTurnChanged(
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {
            return;
        }

        if (
            session.status !==
            "playing"
        ) {

            this.clearTurnTimer(
                session.id
            );

            return;
        }

        /*
         * Replace the previous turn timer with the timer
         * belonging to the new authoritative turn.
         */

        this.scheduleTurnTimer(
            session
        );

        try {

            await this.notifyCurrentTurn(
                session
            );

        } catch (error) {

            /*
             * Notification failure must never interrupt
             * successful gameplay.
             */

            this.context?.logger.warn(
                `Pressure turn notification failed: ${String(error)}`
            );
        }
    }

    /*
     * =====================================================
     * SCHEDULE TURN TIMER
     * =====================================================
     */

    private scheduleTurnTimer(
        session: PressureSession
    ): void {

        if (!this.context) {
            return;
        }

        if (
            session.status !==
            "playing"
        ) {

            this.clearTurnTimer(
                session.id
            );

            return;
        }

        const currentPlayer =
            session.players.find(
                player =>
                    player.position ===
                    session.currentTurn &&
                    player.active &&
                    !player.folded
            );

        if (!currentPlayer) {

            this.clearTurnTimer(
                session.id
            );

            return;
        }

        const expiresAt =
            session.turnExpiresAt;

        if (
            typeof expiresAt !==
            "number"
        ) {

            this.context.logger.warn(
                `Pressure turn ${session.id} has no expiration timestamp.`
            );

            return;
        }

        this.clearTurnTimer(
            session.id
        );

        const expectedPlayerId =
            currentPlayer.id;

        const expectedTurn =
            session.currentTurn;

        const expectedExpiresAt =
            expiresAt;

        const delay =
            Math.max(
                0,
                expectedExpiresAt -
                    Date.now()
            );

        const timer =
            this.context.setTimeout(
                async (): Promise<void> => {

                    this.turnTimers.delete(
                        session.id
                    );

                    try {

                        const updatedSession =
                            this.pressure.expireCurrentTurn(
                                session.id,
                                expectedPlayerId,
                                expectedTurn,
                                expectedExpiresAt
                            );

                        /*
                         * The timeout folds the current player
                         * through the normal PressureService
                         * fold path.
                         */

                        if (
                            updatedSession.status ===
                            "finished"
                        ) {

                            await this.handleGameFinished(
                                updatedSession.id
                            );

                            return;
                        }

                        /*
                         * If the match continues, notify the
                         * newly active player and schedule the
                         * new turn timer.
                         */

                        await this.handleTurnChanged(
                            updatedSession.id
                        );

                    } catch (error) {

                        /*
                         * A stale timer is expected when the
                         * player acts before the timeout.
                         */

                        if (
                            error instanceof Error &&
                            (
                                error.message ===
                                    "STALE_TURN_TIMER" ||
                                error.message ===
                                    "TURN_NOT_EXPIRED"
                            )
                        ) {

                            return;
                        }

                        this.context?.logger.error(
                            "Pressure turn timeout processing failed.",
                            error
                        );
                    }
                },
                delay
            );

        this.turnTimers.set(
            session.id,
            timer
        );
    }

    /*
     * =====================================================
     * CURRENT TURN NOTIFICATION
     * =====================================================
     */

    private async notifyCurrentTurn(
        session: PressureSession
    ): Promise<void> {

        if (!this.context) {
            return;
        }

        const currentPlayer =
            session.players.find(
                player =>
                    player.position ===
                    session.currentTurn &&
                    player.active &&
                    !player.folded
            );

        if (!currentPlayer) {
            return;
        }

        const notificationKey =
            [
                session.id,
                currentPlayer.id,
                session.phase,
                session.wageringActive
                    ? "active"
                    : "open",
                session.currentRaise.toString(),
                session.checkAvailable
                    ? "check"
                    : "no-check",
                currentPlayer.raiseCount.toString(),
                currentPlayer.balance.toString()
            ].join(":");

        if (
            this.notifiedTurns.has(
                notificationKey
            )
        ) {

            return;
        }

        const channel =
            await this.context.client.channels.fetch(
                session.channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {

            return;
        }

        const actions =
            this.getAvailableActions(
                session,
                currentPlayer
            );

        const actionText =
            actions.length > 0
                ? actions.join(" • ")
                : "No standard action available";

        /*
         * Intentionally compact.
         *
         * There is no chat countdown. The authoritative
         * 30-second deadline exists in PressureService and
         * the runtime timer above.
         */

        await channel.send({
            content:
                [
                    `<@${currentPlayer.id}>`,
                    `**Your turn — act within 30 seconds.**`,
                    `Actions: ${actionText}`
                ].join("\n"),

            allowedMentions: {
                users: [
                    currentPlayer.id
                ]
            }
        });

        /*
         * Only mark the notification as delivered after
         * Discord successfully accepts the message.
         */

        this.notifiedTurns.add(
            notificationKey
        );
    }

    /*
     * =====================================================
     * GAME START NOTIFICATION
     * =====================================================
     */

    private async notifyGameStarted(
        session: PressureSession
    ): Promise<void> {

        if (!this.context) {
            return;
        }

        const channel =
            await this.context.client.channels.fetch(
                session.channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {
            return;
        }

        const playerIds =
            session.players.map(
                player =>
                    player.id
            );

        const mentions =
            playerIds
                .map(
                    id =>
                        `<@${id}>`
                )
                .join(" ");

        const embed =
            new EmbedBuilder()
                .setColor(
                    0x08734C
                )
                .setTitle(
                    "🎴 Pressure Match Started"
                )
                .setDescription(
                    [
                        "All four seats are filled and the match has begun.",
                        "",
                        `**Opening turn:** <@${session.players.find(
                            player =>
                                player.position ===
                                session.currentTurn
                        )?.id ?? session.players[0]?.id}>`,
                        "",
                        "Use **MY HAND** to privately view your cards.",
                        "Your turn notification will tell you when to act."
                    ].join("\n")
                )
                .addFields(
                    {
                        name:
                            "Opening Contribution",
                        value:
                            "Each player contributed **25 Nickel**.",
                        inline:
                            true
                    },
                    {
                        name:
                            "Starting Pot",
                        value:
                            `${session.pot.toString()} Nickel`,
                        inline:
                            true
                    }
                )
                .setFooter({
                    text:
                        "Pressure • Quill & Ink"
                });

        await channel.send({
            content:
                mentions,
            embeds: [
                embed
            ],
            allowedMentions: {
                users:
                    playerIds
            }
        });
    }

    /*
     * =====================================================
     * AVAILABLE ACTIONS
     * =====================================================
     *
     * Every option is derived from authoritative session
     * and player state.
     */

    private getAvailableActions(
        session: PressureSession,
        player: PressureSession["players"][number]
    ): string[] {

        if (
            session.phase ===
            "passing"
        ) {

            return [
                "`pass H/D/C/S/J<position>`"
            ];
        }

        const actions: string[] = [];

        if (
            session.wageringActive &&
            session.wageringStarterId !==
                player.id
        ) {

            actions.push(
                `\`call\` (${session.currentRaise.toString()} Nickel)`
            );
        }

        if (
            player.raiseCount < 3
        ) {

            actions.push(
                "`raise <amount>`"
            );
        }

        if (
            player.balance > 0n &&
            !player.allIn
        ) {

            actions.push(
                "`allin`"
            );
        }

        if (
            !player.folded &&
            player.active
        ) {

            actions.push(
                "`fold`"
            );
        }

        if (
            !session.wageringActive &&
            session.checkAvailable
        ) {

            actions.unshift(
                "`check`"
            );
        }

        return actions;
    }

    /*
     * =====================================================
     * GAME FINISHED
     * =====================================================
     */

    private async handleGameFinished(
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {
            return;
        }

        /*
         * Persist the settlement result before continuing
         * with the post-match lifecycle.
         *
         * PressureService has already calculated the
         * authoritative settlement and stored it against
         * the session.
         *
         * Only the portion represented by inkBankAmount is
         * returned to the persistent Ink Bank.
         *
         * This is existing Nickel from the Pressure pot.
         * No Nickel is minted here.
         */

        await this.persistSettlementResult(
            session.id
        );

        this.clearTurnTimer(
            session.id
        );

        await this.setChannelPermissions(
            session.channelId,
            [],
            false,
            session.id
        );

        this.clearCooldownTimer(
            session.id
        );

        const cooldownMs =
            this.pressure.postMatchCooldownMs;

        const timer =
            this.context!.setTimeout(
                async (): Promise<void> => {

                    this.cooldownTimers.delete(
                        session.id
                    );

                    try {

                        await this.handleCooldownExpired(
                            session.id
                        );

                    } catch (error) {

                        this.context?.logger.error(
                            "Pressure cooldown processing failed.",
                            error
                        );
                    }
                },
                cooldownMs
            );

        this.cooldownTimers.set(
            session.id,
            timer
        );
    }

    /*
     * =====================================================
     * PERSIST SETTLEMENT RESULT
     * =====================================================
     *
     * High Pressure can produce an integer-division
     * remainder when the remaining 25% cannot be divided
     * evenly among eligible players.
     *
     * If there are no eligible players for the remaining
     * portion, that entire remaining amount is also returned
     * to the Ink Bank.
     *
     * Super Pressure and Last Player normally produce zero.
     *
     * This operation only moves existing Nickel into the
     * server reserve. It never mints Nickel.
     */

    private async persistSettlementResult(
        sessionId: string
    ): Promise<void> {

        if (
            this.persistedSettlementSessions.has(
                sessionId
            )
        ) {

            return;
        }

        const result =
            this.pressure.getSettlementResult(
                sessionId
            );

        if (!result) {

            throw new Error(
                "PRESSURE_SETTLEMENT_RESULT_NOT_FOUND"
            );
        }

        /*
         * A zero remainder still represents a successfully
         * processed settlement. Mark it as consumed so a
         * duplicate finish callback cannot process it again.
         */

        if (
            result.inkBankAmount <= 0n
        ) {

            this.persistedSettlementSessions.add(
                sessionId
            );

            return;
        }

        const database =
            this.database;

        if (!database) {

            throw new Error(
                "Pressure Plugin database service is unavailable."
            );
        }

        await database.db.$transaction(
            async transaction => {

                const updated =
                    await transaction.inkBank.updateMany({
                        where: {
                            guildId:
                                this.getSettlementGuildId(
                                    sessionId
                                )
                        },

                        data: {
                            balance: {
                                increment:
                                    result.inkBankAmount
                            }
                        }
                    });

                if (
                    updated.count !== 1
                ) {

                    throw new Error(
                        "PRESSURE_INK_BANK_NOT_FOUND"
                    );
                }
            }
        );

        this.persistedSettlementSessions.add(
            sessionId
        );

        this.context?.logger.info(
            [
                "Pressure settlement persisted.",
                `session=${sessionId}`,
                `inkBankAmount=${result.inkBankAmount.toString()}`
            ].join(" ")
        );
    }

    /*
     * =====================================================
     * GET SETTLEMENT GUILD
     * =====================================================
     */

    private getSettlementGuildId(
        sessionId: string
    ): string {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {

            throw new Error(
                "PRESSURE_SESSION_NOT_FOUND_FOR_SETTLEMENT"
            );
        }

        return session.guildId;
    }

    /*
     * =====================================================
     * COOLDOWN EXPIRED
     * =====================================================
     */

    private async handleCooldownExpired(
        sessionId: string
    ): Promise<void> {

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {
            return;
        }

        session.nextGameStartsAt =
            undefined;

        if (
            session.status !== "finished" &&
            session.status !== "waiting"
        ) {

            return;
        }

        if (
            session.players.length ===
            this.pressure.maxPlayers
        ) {

            try {

                this.pressure.startSession(
                    session.id
                );

            } catch (error) {

                await this.setChannelPermissions(
                    session.channelId,
                    [],
                    false,
                    session.id
                );

                throw error;
            }

            await this.handleGameStarted(
                session.id
            );

            return;
        }

        await this.setChannelPermissions(
            session.channelId,
            [],
            false,
            session.id
        );
    }

    /*
     * =====================================================
     * TABLE REMOVED
     * =====================================================
     */

    private async handleTableRemoved(
        sessionId: string,
        channelId: string
    ): Promise<void> {

        this.clearCooldownTimer(
            sessionId
        );

        this.clearTurnTimer(
            sessionId
        );

        await this.restoreChannelPermissions(
            channelId,
            sessionId
        );

        this.permittedPlayers.delete(
            sessionId
        );

        this.permissionSnapshots.delete(
            sessionId
        );

        this.persistedSettlementSessions.delete(
            sessionId
        );

        this.clearSessionNotificationState(
            sessionId
        );
    }

    /*
     * =====================================================
     * CLEAR NOTIFICATION STATE
     * =====================================================
     */

    private clearSessionNotificationState(
        sessionId: string
    ): void {

        for (
            const key
            of this.notifiedTurns
        ) {

            if (
                key.startsWith(
                    `${sessionId}:`
                )
            ) {

                this.notifiedTurns.delete(
                    key
                );
            }
        }
    }

    /*
     * =====================================================
     * SET CHANNEL PERMISSIONS
     * =====================================================
     */

    private async setChannelPermissions(
        channelId: string,
        playerIds: string[],
        active: boolean,
        sessionId: string
    ): Promise<void> {

        if (!this.context) {

            throw new Error(
                "Pressure plugin context is unavailable."
            );
        }

        const channel =
            await this.context.client.channels.fetch(
                channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {

            throw new Error(
                "Pressure channel must be a guild text channel."
            );
        }

        let snapshot =
            this.permissionSnapshots.get(
                sessionId
            );

        if (!snapshot) {

            const everyoneOverwrite =
                channel.permissionOverwrites.cache.get(
                    channel.guild.roles.everyone.id
                );

            snapshot = {

                everyone: {

                    exists:
                        Boolean(
                            everyoneOverwrite
                        ),

                    sendMessages:
                        this.getSendMessagesPermission(
                            everyoneOverwrite
                        )
                },

                players:
                    new Map()
            };

            this.permissionSnapshots.set(
                sessionId,
                snapshot
            );
        }

        for (
            const playerId
            of playerIds
        ) {

            if (
                snapshot.players.has(
                    playerId
                )
            ) {

                continue;
            }

            const playerOverwrite =
                channel.permissionOverwrites.cache.get(
                    playerId
                );

            snapshot.players.set(
                playerId,
                {

                    exists:
                        Boolean(
                            playerOverwrite
                        ),

                    sendMessages:
                        this.getSendMessagesPermission(
                            playerOverwrite
                        )
                }
            );
        }

        await channel.permissionOverwrites.edit(
            channel.guild.roles.everyone,
            {
                SendMessages: false
            }
        );

        const previousPlayers =
            this.permittedPlayers.get(
                sessionId
            );

        if (previousPlayers) {

            for (
                const playerId
                of previousPlayers
            ) {

                if (
                    active &&
                    playerIds.includes(
                        playerId
                    )
                ) {

                    continue;
                }

                try {

                    await channel.permissionOverwrites.edit(
                        playerId,
                        {
                            SendMessages: null
                        }
                    );

                } catch {

                    this.context.logger.warn(
                        `Failed to clear Pressure SendMessages permission for player ${playerId}.`
                    );
                }
            }
        }

        if (active) {

            const permitted =
                new Set<string>();

            for (
                const playerId
                of playerIds
            ) {

                await channel.permissionOverwrites.edit(
                    playerId,
                    {
                        SendMessages: true
                    }
                );

                permitted.add(
                    playerId
                );
            }

            this.permittedPlayers.set(
                sessionId,
                permitted
            );

            return;
        }

        this.permittedPlayers.delete(
            sessionId
        );
    }

    /*
     * =====================================================
     * GET SEND MESSAGES PERMISSION
     * =====================================================
     */

    private getSendMessagesPermission(
        overwrite:
            import("discord.js").PermissionOverwrites | undefined
    ): boolean | null {

        if (!overwrite) {
            return null;
        }

        if (
            overwrite.allow.has(
                PermissionFlagsBits.SendMessages
            )
        ) {

            return true;
        }

        if (
            overwrite.deny.has(
                PermissionFlagsBits.SendMessages
            )
        ) {

            return false;
        }

        return null;
    }

    /*
     * =====================================================
     * RESTORE CHANNEL PERMISSIONS
     * =====================================================
     */

    private async restoreChannelPermissions(
        channelId: string,
        sessionId: string
    ): Promise<void> {

        if (!this.context) {

            throw new Error(
                "Pressure plugin context is unavailable."
            );
        }

        const channel =
            await this.context.client.channels.fetch(
                channelId
            );

        if (
            !channel ||
            channel.type !== ChannelType.GuildText
        ) {

            throw new Error(
                "Pressure channel must be a guild text channel."
            );
        }

        const snapshot =
            this.permissionSnapshots.get(
                sessionId
            );

        if (!snapshot) {

            this.context.logger.warn(
                `No Pressure permission snapshot exists for session ${sessionId}.`
            );

            return;
        }

        for (
            const [
                playerId,
                playerSnapshot
            ]
            of snapshot.players
        ) {

            try {

                if (
                    playerSnapshot.exists
                ) {

                    await channel.permissionOverwrites.edit(
                        playerId,
                        {
                            SendMessages:
                                playerSnapshot.sendMessages
                        }
                    );

                } else {

                    await channel.permissionOverwrites.delete(
                        playerId
                    );
                }

            } catch {

                this.context.logger.warn(
                    `Failed to restore original Pressure player permission for player ${playerId}.`
                );
            }
        }

        try {

            if (
                snapshot.everyone.exists
            ) {

                await channel.permissionOverwrites.edit(
                    channel.guild.roles.everyone,
                    {
                        SendMessages:
                            snapshot.everyone.sendMessages
                    }
                );

            } else {

                await channel.permissionOverwrites.delete(
                    channel.guild.roles.everyone
                );
            }

        } catch {

            this.context.logger.warn(
                "Failed to restore original Pressure @everyone permission."
            );
        }
    }

    /*
     * =====================================================
     * CLEAR COOLDOWN TIMER
     * =====================================================
     */

    private clearCooldownTimer(
        sessionId: string
    ): void {

        const timer =
            this.cooldownTimers.get(
                sessionId
            );

        if (!timer) {
            return;
        }

        if (this.context) {

            this.context.clearTimeout(
                timer
            );
        }

        this.cooldownTimers.delete(
            sessionId
        );
    }

    /*
     * =====================================================
     * CLEAR TURN TIMER
     * =====================================================
     */

    private clearTurnTimer(
        sessionId: string
    ): void {

        const timer =
            this.turnTimers.get(
                sessionId
            );

        if (!timer) {
            return;
        }

        if (this.context) {

            this.context.clearTimeout(
                timer
            );
        }

        this.turnTimers.delete(
            sessionId
        );
    }

    /*
     * =====================================================
     * ON LOAD
     * =====================================================
     */

    onLoad(
        context: PluginContext
    ): void {

        context.logger.info(
            "Pressure Plugin loaded"
        );
    }

    /*
     * =====================================================
     * ON UNLOAD
     * =====================================================
     */

    onUnload(
        context: PluginContext
    ): void {

        for (
            const timer
            of this.cooldownTimers.values()
        ) {

            context.clearTimeout(
                timer
            );
        }

        for (
            const timer
            of this.turnTimers.values()
        ) {

            context.clearTimeout(
                timer
            );
        }

        this.cooldownTimers.clear();

        this.turnTimers.clear();

        this.permittedPlayers.clear();

        this.permissionSnapshots.clear();

        this.notifiedTurns.clear();

        this.persistedSettlementSessions.clear();

        this.interactionHandler =
            null;

        this.economy =
            null;

        this.database =
            null;

        this.context =
            null;

        context.logger.info(
            "Pressure Plugin unloaded"
        );
    }
}

END FILE: src/plugins/pressure/PressurePlugin.ts
================================================================================

FILE: src/plugins/pressure/services/PressureCardRenderer.ts
--------------------------------------------------------------------------------
Original size: 26597 bytes
Exported size: 25463 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
/*
 * =========================================================
 * PRESSURE CARD RENDERER
 * =========================================================
 *
 * Responsible only for rendering Pressure cards.
 *
 * This renderer does NOT:
 *
 * - Manage game state
 * - Modify player hands
 * - Handle Discord interactions
 * - Handle wagers
 * - Handle turns
 *
 * It receives cards and produces a visual representation
 * suitable for the private ephemeral card viewer.
 *
 * =========================================================
 */

import {
    createCanvas,
    registerFont,
    CanvasRenderingContext2D
} from "canvas";

import {
    AttachmentBuilder
} from "discord.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    PressureCard
} from "../models/PressureCard.js";

/*
 * =========================================================
 * BUNDLED FONT SETUP
 * =========================================================
 *
 * Railway/container environments may not have the required
 * system fonts installed.
 *
 * Register the bundled Cormorant Garamond files explicitly
 * so node-canvas can render the card text reliably.
 *
 * =========================================================
 */

const currentDirectory =
    path.dirname(
        fileURLToPath(import.meta.url)
    );

const fontDirectory =
    path.resolve(
        currentDirectory,
        "../../../fonts"
    );

registerFont(
    path.join(
        fontDirectory,
        "CormorantGaramond-Regular.ttf"
    ),
    {
        family: "Cormorant Garamond",
        weight: "400"
    }
);

registerFont(
    path.join(
        fontDirectory,
        "CormorantGaramond-Bold.ttf"
    ),
    {
        family: "Cormorant Garamond",
        weight: "700"
    }
);

/*
 * =========================================================
 * RENDER OPTIONS
 * =========================================================
 */

interface PressureCardRenderOptions {

    /*
     * Width of each individual card.
     */

    cardWidth?: number;

    /*
     * Height of each individual card.
     */

    cardHeight?: number;

    /*
     * Gap between cards.
     */

    gap?: number;
}

/*
 * =========================================================
 * PRESSURE CARD RENDERER
 * =========================================================
 */

export class PressureCardRenderer {

    /*
     * =====================================================
     * DEFAULT CARD SIZE
     * =====================================================
     */

    readonly defaultCardWidth = 220;

    readonly defaultCardHeight = 310;

    readonly defaultGap = 24;

    /*
     * =====================================================
     * RENDER HAND
     * =====================================================
     *
     * Renders a player's complete private hand.
     *
     * The returned AttachmentBuilder can be directly
     * attached to an ephemeral Discord response.
     */

    renderHand(
        cards: PressureCard[],
        options: PressureCardRenderOptions = {}
    ): AttachmentBuilder {

        /*
         * =================================================
         * CARD DIMENSIONS
         * =================================================
         */

        const cardWidth =
            options.cardWidth ??
            this.defaultCardWidth;

        const cardHeight =
            options.cardHeight ??
            this.defaultCardHeight;

        const gap =
            options.gap ??
            this.defaultGap;

        /*
         * =================================================
         * EMPTY HAND
         * =================================================
         */

        if (
            cards.length === 0
        ) {

            throw new Error(
                "PRESSURE_CANNOT_RENDER_EMPTY_HAND"
            );
        }

        /*
         * =================================================
         * CANVAS DIMENSIONS
         * =================================================
         *
         * The hand is rendered horizontally.
         */

        const padding = 40;

        const width =
            padding * 2 +
            (
                cardWidth *
                cards.length
            ) +
            (
                gap *
                Math.max(
                    cards.length - 1,
                    0
                )
            );

        const height =
            cardHeight +
            padding * 2;

        /*
         * =================================================
         * CREATE CANVAS
         * =================================================
         */

        const canvas =
            createCanvas(
                width,
                height
            );

        const context =
            canvas.getContext(
                "2d"
            );

        /*
         * =================================================
         * BACKGROUND
         * =================================================
         */

        this.drawBackground(
            context,
            width,
            height
        );

        /*
         * =================================================
         * DRAW CARDS
         * =================================================
         */

        cards.forEach(
            (
                card,
                index
            ) => {

                const x =
                    padding +
                    (
                        cardWidth +
                        gap
                    ) *
                    index;

                const y =
                    padding;

                this.drawCard(
                    context,
                    card,
                    x,
                    y,
                    cardWidth,
                    cardHeight
                );
            }
        );

        /*
         * =================================================
         * CONVERT TO DISCORD ATTACHMENT
         * =================================================
         */

        const buffer =
            canvas.toBuffer(
                "image/png"
            );

        return new AttachmentBuilder(
            buffer,
            {
                name:
                    "pressure-private-hand.png"
            }
        );
    }

    /*
     * =========================================================
     * DRAW BACKGROUND
     * =========================================================
     */

    private drawBackground(
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ): void {

        /*
         * Base background.
         */

        const background =
            context.createLinearGradient(
                0,
                0,
                width,
                height
            );

        background.addColorStop(
            0,
            "#0b0d12"
        );

        background.addColorStop(
            0.5,
            "#151923"
        );

        background.addColorStop(
            1,
            "#090b10"
        );

        context.fillStyle =
            background;

        context.fillRect(
            0,
            0,
            width,
            height
        );

        /*
         * Subtle inner highlight.
         */

        const glow =
            context.createRadialGradient(
                width / 2,
                height / 2,
                20,
                width / 2,
                height / 2,
                Math.max(
                    width,
                    height
                )
            );

        glow.addColorStop(
            0,
            "rgba(255,255,255,0.035)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        context.fillStyle =
            glow;

        context.fillRect(
            0,
            0,
            width,
            height
        );
    }

    /*
     * =========================================================
     * DRAW CARD
     * =========================================================
     */

    private drawCard(
        context: CanvasRenderingContext2D,
        card: PressureCard,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {

        /*
         * =================================================
         * CARD SHADOW
         * =================================================
         */

        context.save();

        context.shadowColor =
            "rgba(0, 0, 0, 0.55)";

        context.shadowBlur =
            18;

        context.shadowOffsetY =
            8;

        /*
         * =================================================
         * CARD BODY
         * =================================================
         */

        this.roundRect(
            context,
            x,
            y,
            width,
            height,
            20
        );

        context.fillStyle =
            "#f8f8f5";

        context.fill();

        context.restore();

        /*
         * =================================================
         * CARD BORDER
         * =================================================
         */

        this.roundRect(
            context,
            x,
            y,
            width,
            height,
            20
        );

        context.lineWidth =
            3;

        context.strokeStyle =
            "#d8d8d2";

        context.stroke();

        /*
         * =================================================
         * CARD CONTENT
         * =================================================
         */

        const color =
            this.getCardColor(
                card
            );

        /*
         * =================================================
         * TOP-LEFT SUIT
         * =================================================
         *
         * Do NOT use a Unicode suit glyph here.
         *
         * The suit is drawn directly with Canvas paths so
         * rendering does not depend on the installed glyph
         * coverage of Cormorant Garamond.
         */

        this.drawSuit(
            context,
            card.suit,
            color,
            x + 43,
            y + 50,
            23
        );

        /*
         * =================================================
         * CENTER SUIT
         * =================================================
         */

        this.drawSuit(
            context,
            card.suit,
            color,
            x + width / 2,
            y + height / 2,
            64
        );

        /*
         * =================================================
         * BOTTOM-RIGHT SUIT
         * =================================================
         *
         * Rotate the entire suit so it follows the
         * traditional playing-card corner orientation.
         */

        context.save();

        context.translate(
            x + width - 43,
            y + height - 50
        );

        context.rotate(
            Math.PI
        );

        this.drawSuit(
            context,
            card.suit,
            color,
            0,
            0,
            23
        );

        context.restore();

        /*
         * =================================================
         * JOKER LABEL
         * =================================================
         */

        if (
            card.suit === "joker"
        ) {

            context.textAlign =
                "center";

            context.textBaseline =
                "bottom";

            context.font =
                "bold 20px 'Cormorant Garamond'";

            context.fillStyle =
                "#20242c";

            context.fillText(
                "JOKER",
                x + width / 2,
                y + height - 24
            );
        }
    }

    /*
     * =========================================================
     * DRAW SUIT
     * =========================================================
     *
     * Draws the suit directly using Canvas primitives.
     *
     * This intentionally avoids Unicode characters such as
     * ♥ ♦ ♣ ♠ because the bundled Cormorant Garamond font
     * does not reliably provide those glyphs in every
     * node-canvas/Pango environment.
     *
     * =========================================================
     */

    private drawSuit(
        context: CanvasRenderingContext2D,
        suit: PressureCard["suit"],
        color: string,
        centerX: number,
        centerY: number,
        size: number
    ): void {

        context.save();

        context.fillStyle =
            color;

        context.beginPath();

        switch (suit) {

            /*
             * =============================================
             * HEARTS
             * =============================================
             */

            case "hearts": {

                const top =
                    centerY -
                    size * 0.55;

                const bottom =
                    centerY +
                    size * 0.65;

                const half =
                    size * 0.75;

                context.moveTo(
                    centerX,
                    bottom
                );

                context.bezierCurveTo(
                    centerX -
                        half * 0.35,
                    centerY +
                        size * 0.18,
                    centerX -
                        half,
                    centerY -
                        size * 0.02,
                    centerX -
                        half,
                    top +
                        size * 0.28
                );

                context.bezierCurveTo(
                    centerX -
                        half,
                    top,
                    centerX -
                        half * 0.25,
                    top,
                    centerX,
                    top +
                        size * 0.30
                );

                context.bezierCurveTo(
                    centerX +
                        half * 0.25,
                    top,
                    centerX +
                        half,
                    top,
                    centerX +
                        half,
                    top +
                        size * 0.28
                );

                context.bezierCurveTo(
                    centerX +
                        half,
                    centerY -
                        size * 0.02,
                    centerX +
                        half * 0.35,
                    centerY +
                        size * 0.18,
                    centerX,
                    bottom
                );

                context.closePath();

                context.fill();

                break;
            }

            /*
             * =============================================
             * DIAMONDS
             * =============================================
             */

            case "diamonds": {

                const halfWidth =
                    size * 0.72;

                const halfHeight =
                    size * 0.90;

                context.moveTo(
                    centerX,
                    centerY -
                        halfHeight
                );

                context.lineTo(
                    centerX +
                        halfWidth,
                    centerY
                );

                context.lineTo(
                    centerX,
                    centerY +
                        halfHeight
                );

                context.lineTo(
                    centerX -
                        halfWidth,
                    centerY
                );

                context.closePath();

                context.fill();

                break;
            }

            /*
             * =============================================
             * CLUBS
             * =============================================
             */

            case "clubs": {

                const radius =
                    size * 0.40;

                const leftX =
                    centerX -
                    size * 0.42;

                const rightX =
                    centerX +
                    size * 0.42;

                const topY =
                    centerY -
                    size * 0.30;

                const lowerY =
                    centerY +
                    size * 0.10;

                context.arc(
                    centerX,
                    topY,
                    radius,
                    0,
                    Math.PI * 2
                );

                context.moveTo(
                    centerX -
                        size * 0.18,
                    lowerY +
                        size * 0.15
                );

                context.arc(
                    leftX,
                    lowerY,
                    radius,
                    0,
                    Math.PI * 2
                );

                context.moveTo(
                    centerX +
                        size * 0.18,
                    lowerY +
                        size * 0.15
                );

                context.arc(
                    rightX,
                    lowerY,
                    radius,
                    0,
                    Math.PI * 2
                );

                context.fill();

                /*
                 * Club stem.
                 */

                context.beginPath();

                context.moveTo(
                    centerX -
                        size * 0.12,
                    centerY +
                        size * 0.08
                );

                context.lineTo(
                    centerX -
                        size * 0.28,
                    centerY +
                        size * 0.72
                );

                context.lineTo(
                    centerX +
                        size * 0.28,
                    centerY +
                        size * 0.72
                );

                context.lineTo(
                    centerX +
                        size * 0.12,
                    centerY +
                        size * 0.08
                );

                context.closePath();

                context.fill();

                break;
            }

            /*
             * =============================================
             * SPADES
             * =============================================
             */

            case "spades": {

                const top =
                    centerY -
                    size * 0.82;

                const bottom =
                    centerY +
                    size * 0.72;

                const half =
                    size * 0.72;

                context.moveTo(
                    centerX,
                    top
                );

                context.bezierCurveTo(
                    centerX -
                        half * 0.15,
                    centerY -
                        size * 0.45,
                    centerX -
                        half,
                    centerY -
                        size * 0.12,
                    centerX -
                        half,
                    centerY +
                        size * 0.16
                );

                context.bezierCurveTo(
                    centerX -
                        half,
                    centerY +
                        size * 0.45,
                    centerX -
                        half * 0.35,
                    centerY +
                        size * 0.42,
                    centerX -
                        size * 0.10,
                    centerY +
                        size * 0.25
                );

                context.lineTo(
                    centerX -
                        size * 0.28,
                    bottom
                );

                context.lineTo(
                    centerX +
                        size * 0.28,
                    bottom
                );

                context.lineTo(
                    centerX +
                        size * 0.10,
                    centerY +
                        size * 0.25
                );

                context.bezierCurveTo(
                    centerX +
                        half * 0.35,
                    centerY +
                        size * 0.42,
                    centerX +
                        half,
                    centerY +
                        size * 0.45,
                    centerX +
                        half,
                    centerY +
                        size * 0.16
                );

                context.bezierCurveTo(
                    centerX +
                        half,
                    centerY -
                        size * 0.12,
                    centerX +
                        half * 0.15,
                    centerY -
                        size * 0.45,
                    centerX,
                    top
                );

                context.closePath();

                context.fill();

                break;
            }

            /*
             * =============================================
             * JOKER
             * =============================================
             */

            case "joker": {

                const outer =
                    size * 0.78;

                const inner =
                    size * 0.34;

                for (
                    let index = 0;
                    index < 10;
                    index++
                ) {

                    const angle =
                        -Math.PI / 2 +
                        index *
                        Math.PI / 5;

                    const radius =
                        index % 2 === 0
                            ? outer
                            : inner;

                    const pointX =
                        centerX +
                        Math.cos(angle) *
                        radius;

                    const pointY =
                        centerY +
                        Math.sin(angle) *
                        radius;

                    if (
                        index === 0
                    ) {

                        context.moveTo(
                            pointX,
                            pointY
                        );

                    } else {

                        context.lineTo(
                            pointX,
                            pointY
                        );
                    }
                }

                context.closePath();

                context.fill();

                break;
            }
        }

        context.restore();
    }

    /*
     * =========================================================
     * CARD COLOR
     * =========================================================
     */

    private getCardColor(
        card: PressureCard
    ): string {

        /*
         * Hearts and diamonds are red.
         */

        if (
            card.suit === "hearts" ||
            card.suit === "diamonds"
        ) {

            return "#c62828";
        }

        /*
         * Clubs and spades are black.
         */

        if (
            card.suit === "clubs" ||
            card.suit === "spades"
        ) {

            return "#17191f";
        }

        /*
         * Joker.
         */

        return "#6c4cc3";
    }

    /*
     * =========================================================
     * ROUNDED RECTANGLE
     * =========================================================
     *
     * Compatibility helper so the renderer does not
     * depend on newer Canvas APIs.
     */

    private roundRect(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ): void {

        const safeRadius =
            Math.min(
                radius,
                width / 2,
                height / 2
            );

        context.beginPath();

        context.moveTo(
            x + safeRadius,
            y
        );

        context.lineTo(
            x + width - safeRadius,
            y
        );

        context.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + safeRadius
        );

        context.lineTo(
            x + width,
            y + height - safeRadius
        );

        context.quadraticCurveTo(
            x + width,
            y + height,
            x + width - safeRadius,
            y + height
        );

        context.lineTo(
            x + safeRadius,
            y + height
        );

        context.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - safeRadius
        );

        context.lineTo(
            x,
            y + safeRadius
        );

        context.quadraticCurveTo(
            x,
            y,
            x + safeRadius,
            y
        );

        context.closePath();
    }
}

END FILE: src/plugins/pressure/services/PressureCardRenderer.ts
================================================================================

FILE: src/plugins/pressure/services/PressureDeckService.ts
--------------------------------------------------------------------------------
Original size: 8564 bytes
Exported size: 8168 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import { PressureCard } from "../models/PressureCard.js";

/*
 * =========================================================
 * PRESSURE DECK SERVICE
 * =========================================================
 *
 * Responsible only for:
 *
 * - Creating the Pressure deck
 * - Shuffling the deck
 * - Drawing cards
 * - Dealing cards
 *
 * No Discord logic.
 * No economy logic.
 * No game rules.
 */

/*
 * =========================================================
 * PRESSURE DECK SERVICE
 * =========================================================
 */

export class PressureDeckService {

    /*
     * =====================================================
     * CONSTANTS
     * =====================================================
     */

    readonly deckSize = 17;

    readonly playerCount = 4;

    readonly standardHandSize = 4;

    /*
     * =====================================================
     * CREATE DECK
     * =====================================================
     *
     * Pressure uses 17 cards:
     *
     *     H H H H
     *     D D D D
     *     C C C C
     *     S S S S
     *     J
     *
     * Each normal card has a unique ID.
     */

    createDeck(): PressureCard[] {

        const deck: PressureCard[] = [];

        const suits = [
            {
                suit: "hearts" as const,
                symbol: "H" as const
            },
            {
                suit: "diamonds" as const,
                symbol: "D" as const
            },
            {
                suit: "clubs" as const,
                symbol: "C" as const
            },
            {
                suit: "spades" as const,
                symbol: "S" as const
            }
        ];

        /*
         * Four cards of each suit.
         */

        for (
            const { suit, symbol }
            of suits
        ) {

            for (
                let index = 1;
                index <= 4;
                index++
            ) {

                deck.push({
                    id:
                        `${symbol}-${index}-${this.createCardId()}`,

                    suit,

                    symbol
                });
            }
        }

        /*
         * One Joker.
         */

        deck.push({
            id:
                `J-1-${this.createCardId()}`,

            suit:
                "joker",

            symbol:
                "J"
        });

        return deck;
    }

    /*
     * =====================================================
     * SHUFFLE
     * =====================================================
     *
     * Fisher-Yates shuffle.
     *
     * Returns a new array.
     * The original deck is not modified.
     */

    shuffle(
        deck: PressureCard[]
    ): PressureCard[] {

        const shuffled = [
            ...deck
        ];

        for (
            let index = shuffled.length - 1;
            index > 0;
            index--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (index + 1)
                );

            [
                shuffled[index],
                shuffled[randomIndex]
            ] = [
                shuffled[randomIndex],
                shuffled[index]
            ];
        }

        return shuffled;
    }

    /*
     * =====================================================
     * DRAW
     * =====================================================
     *
     * Removes cards from the beginning of the deck.
     */

    draw(
        deck: PressureCard[],
        amount = 1
    ): PressureCard[] {

        if (
            !Number.isInteger(amount) ||
            amount < 1
        ) {

            throw new Error(
                "Pressure draw amount must be a positive integer."
            );
        }

        if (
            deck.length < amount
        ) {

            throw new Error(
                "Not enough cards remaining in the Pressure deck."
            );
        }

        return deck.splice(
            0,
            amount
        );
    }

    /*
     * =====================================================
     * DEAL
     * =====================================================
     *
     * Pressure always has exactly 4 players.
     *
     * The 17-card deck is distributed as:
     *
     *     Player 1 → 4 cards
     *     Player 2 → 4 cards
     *     Player 3 → 4 cards
     *     Player 4 → 5 cards
     *
     * The player receiving 5 cards is selected
     * randomly after shuffling.
     *
     * The returned array follows player order.
     */

    deal(
        playerCount: number
    ): {
        hands: PressureCard[][];
        deck: PressureCard[];
        extraCardPlayer: number;
    } {

        if (
            playerCount !== this.playerCount
        ) {

            throw new Error(
                "Pressure requires exactly 4 players."
            );
        }

        let deck =
            this.createDeck();

        deck =
            this.shuffle(deck);

        /*
         * Randomly choose which player receives
         * the fifth card.
         */

        const extraCardPlayer =
            Math.floor(
                Math.random() *
                playerCount
            );

        const hands: PressureCard[][] = [];

        /*
         * Deal four cards to every player.
         */

        for (
            let playerIndex = 0;
            playerIndex < playerCount;
            playerIndex++
        ) {

            hands.push(
                this.draw(
                    deck,
                    this.standardHandSize
                )
            );
        }

        /*
         * Give the remaining card to one player.
         */

        hands[extraCardPlayer].push(
            ...this.draw(
                deck,
                1
            )
        );

        return {
            hands,
            deck,
            extraCardPlayer
        };
    }

    /*
     * =====================================================
     * DEAL FROM EXISTING DECK
     * =====================================================
     *
     * This method is useful when PressureService already
     * owns a shuffled deck and needs to deal from it.
     *
     * The supplied deck is modified directly.
     */

    dealFromDeck(
        deck: PressureCard[],
        playerCount: number
    ): {
        hands: PressureCard[][];
        extraCardPlayer: number;
    } {

        if (
            playerCount !== this.playerCount
        ) {

            throw new Error(
                "Pressure requires exactly 4 players."
            );
        }

        if (
            deck.length < this.deckSize
        ) {

            throw new Error(
                "Pressure deck does not contain enough cards."
            );
        }

        const extraCardPlayer =
            Math.floor(
                Math.random() *
                playerCount
            );

        const hands: PressureCard[][] = [];

        for (
            let playerIndex = 0;
            playerIndex < playerCount;
            playerIndex++
        ) {

            hands.push(
                this.draw(
                    deck,
                    this.standardHandSize
                )
            );
        }

        hands[extraCardPlayer].push(
            ...this.draw(
                deck,
                1
            )
        );

        return {
            hands,
            extraCardPlayer
        };
    }

    /*
     * =====================================================
     * REMAINING CARDS
     * =====================================================
     */

    getRemainingCards(
        deck: PressureCard[]
    ): number {

        return deck.length;
    }

    /*
     * =====================================================
     * CARD ID
     * =====================================================
     */

    private createCardId(): string {

        return (
            `${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .slice(2, 8)}`
        );
    }
}


END FILE: src/plugins/pressure/services/PressureDeckService.ts
================================================================================

FILE: src/plugins/pressure/services/PressureInteraction.ts
--------------------------------------------------------------------------------
Original size: 9617 bytes
Exported size: 9226 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

/*
 * =========================================================
 * PRESSURE INTERACTION
 * =========================================================
 *
 * Responsible for Discord-side Pressure interactions.
 *
 * PressureInteraction connects:
 *
 * Discord Component
 *        ↓
 * PressureService
 *        ↓
 * CardRenderer
 *        ↓
 * Private Ephemeral Card Viewer
 *
 * PressureService remains responsible for game state.
 * CardRenderer remains responsible for card visuals.
 *
 * =========================================================
 */

import {
    ButtonInteraction,
    Client
} from "discord.js";

import {
    PressureService
} from "./PressureService.js";

import {
    PressureCardRenderer
} from "./PressureCardRenderer.js";

/*
 * =========================================================
 * PRESSURE INTERACTION
 * =========================================================
 */

export class PressureInteraction {

    /*
     * =====================================================
     * SERVICES
     * =====================================================
     */

    private readonly pressure:
        PressureService;

    private readonly cardRenderer:
        PressureCardRenderer;

    /*
     * =====================================================
     * CONSTRUCTOR
     * =====================================================
     */

    constructor(
        pressure: PressureService,
        cardRenderer: PressureCardRenderer
    ) {

        this.pressure =
            pressure;

        this.cardRenderer =
            cardRenderer;
    }

    /*
     * =====================================================
     * REGISTER
     * =====================================================
     *
     * Registers the Discord interaction listener.
     */

    register(
        client: Client
    ): void {

        client.on(
            "interactionCreate",
            async interaction => {

                /*
                 * We only handle button
                 * interactions here.
                 */

                if (
                    !interaction.isButton()
                ) {

                    return;
                }

                /*
                 * Ignore interactions that
                 * do not belong to Pressure.
                 */

                if (
                    !interaction.customId.startsWith(
                        "pressure:"
                    )
                ) {

                    return;
                }

                try {

                    await this.handleButton(
                        interaction
                    );

                } catch (error) {

                    console.error(
                        "[Pressure] Interaction error:",
                        error
                    );

                    /*
                     * Discord only allows one initial
                     * response to an interaction.
                     *
                     * If we already responded, use
                     * followUp instead.
                     */

                    if (
                        interaction.replied ||
                        interaction.deferred
                    ) {

                        await interaction.followUp({
                            content:
                                "❌ Something went wrong while handling this Pressure action.",
                            ephemeral:
                                true
                        });

                    } else {

                        await interaction.reply({
                            content:
                                "❌ Something went wrong while handling this Pressure action.",
                            ephemeral:
                                true
                        });
                    }
                }
            }
        );
    }

    /*
     * =====================================================
     * HANDLE BUTTON
     * =====================================================
     *
     * Supported structure:
     *
     * pressure:view-cards:SESSION_ID
     *
     * Future actions:
     *
     * pressure:join:SESSION_ID
     * pressure:leave:SESSION_ID
     * pressure:start:SESSION_ID
     */

    private async handleButton(
        interaction: ButtonInteraction
    ): Promise<void> {

        const parts =
            interaction.customId.split(":");

        const action =
            parts[1];

        const sessionId =
            parts[2];

        /*
         * Invalid component ID.
         */

        if (
            !action ||
            !sessionId
        ) {

            await interaction.reply({
                content:
                    "❌ Invalid Pressure interaction.",
                ephemeral:
                    true
            });

            return;
        }

        /*
         * =================================================
         * VIEW CARDS
         * =================================================
         */

        if (
            action === "view-cards"
        ) {

            await this.viewCards(
                interaction,
                sessionId
            );

            return;
        }

        /*
         * =================================================
         * UNKNOWN ACTION
         * =================================================
         */

        await interaction.reply({
            content:
                "⚠️ This Pressure action is not wired yet.",
            ephemeral:
                true
        });
    }

    /*
     * =====================================================
     * VIEW PRIVATE CARDS
     * =====================================================
     *
     * Shows ONLY the interacting player's cards.
     *
     * The response is ephemeral.
     *
     * Other players cannot see this response.
     */

    private async viewCards(
        interaction: ButtonInteraction,
        sessionId: string
    ): Promise<void> {

        /*
         * =================================================
         * GET SESSION
         * =================================================
         */

        const session =
            this.pressure.getSession(
                sessionId
            );

        if (!session) {

            await interaction.reply({
                content:
                    "❌ This Pressure game no longer exists.",
                ephemeral:
                    true
            });

            return;
        }

        /*
         * =================================================
         * FIND PLAYER
         * =================================================
         */

        const player =
            session.players.find(
                currentPlayer =>
                    currentPlayer.id ===
                    interaction.user.id
            );

        if (!player) {

            await interaction.reply({
                content:
                    "❌ You are not part of this Pressure game.",
                ephemeral:
                    true
            });

            return;
        }

        /*
         * =================================================
         * GET PRIVATE HAND
         * =================================================
         *
         * PressureService returns a COPY of the
         * player's hand.
         */

        const hand =
            this.pressure.getPlayerHand(
                sessionId,
                interaction.user.id
            );

        /*
         * =================================================
         * HAND NOT DEALT
         * =================================================
         */

        if (
            hand.length === 0
        ) {

            await interaction.reply({
                content:
                    "🃏 Your cards have not been dealt yet.",
                ephemeral:
                    true
            });

            return;
        }

        /*
         * =================================================
         * RENDER HAND
         * =================================================
         *
         * CardRenderer creates the visual card image.
         *
         * The renderer is responsible only for
         * presentation.
         */

        const rendered =
            await this.cardRenderer.renderHand(
                hand
            );

        /*
         * =================================================
         * PRIVATE EPHEMERAL RESPONSE
         * =================================================
         *
         * IMPORTANT:
         *
         * CardRenderer returns an AttachmentBuilder.
         *
         * Discord.js expects the AttachmentBuilder
         * directly inside the files array.
         *
         * DO NOT use:
         *
         * {
         *     attachment: rendered
         * }
         *
         * because that expects a BufferResolvable
         * or Stream.
         */

        await interaction.reply({
            files: [
                rendered
            ],
            ephemeral:
                true
        });
    }
}


END FILE: src/plugins/pressure/services/PressureInteraction.ts
================================================================================

FILE: src/plugins/pressure/services/PressureService.ts
--------------------------------------------------------------------------------
Original size: 67726 bytes
Exported size: 64470 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
/*
 * =========================================================
 * PRESSURE SERVICE
 * =========================================================
 *
 * Responsible for managing Pressure tables and matches.
 *
 * PressureSession is the single source of truth for:
 *
 * - Players
 * - Player hands
 * - Deck
 * - Discard pile
 * - Table balances
 * - Wagers
 * - Pot
 * - Turn state
 * - Match lifecycle
 * - Turn deadlines
 *
 * Discord UI / interaction handling does NOT belong here.
 *
 * IMPORTANT:
 *
 * Pressure has NO HOST.
 *
 * Creating a Pressure session creates an EMPTY table.
 *
 * Players enter the table through addPlayer().
 *
 * A Pressure session represents the TABLE, not just one match.
 *
 * Therefore:
 *
 *     Table created
 *          ↓
 *     Players join
 *          ↓
 *     Match starts
 *          ↓
 *     Match finishes
 *          ↓
 *     Players remain seated
 *          ↓
 *     Another match may start
 *
 * Player table balances survive between matches.
 *
 * A player's remaining table balance is returned to
 * Economy only when that player leaves the table.
 *
 * TURN TIMER:
 *
 * Every active turn has exactly 30 seconds.
 *
 * The service owns the authoritative turn deadline.
 *
 * PressurePlugin is responsible for scheduling the Discord/runtime
 * timeout and calling expireCurrentTurn() when that timeout fires.
 *
 * There is intentionally NO countdown message in Discord.
 * =========================================================
 */

import {
    PressureCard
} from "../models/PressureCard.js";

import {
    PressurePlayer
} from "../models/PressurePlayer.js";

import {
    PressureSession
} from "../models/PressureSession.js";

import {
    PressureDeckService
} from "./PressureDeckService.js";

/*
 * =========================================================
 * SETTLEMENT RESULT
 * =========================================================
 */

export interface PressureSettlementResult {

    winnerId?: string;

    pot: bigint;

    payouts: Map<string, bigint>;

    /*
     * Nickel that must return to the server's Ink Bank
     * instead of being paid to a player.
     *
     * This is existing Nickel from the Pressure pot.
     * It is NOT newly minted Nickel.
     */
    inkBankAmount: bigint;

    reason:
        | "high-pressure"
        | "super-pressure"
        | "dead-game"
        | "last-player";
}

/*
 * =========================================================
 * PRESSURE SERVICE
 * =========================================================
 */

export class PressureService {

    /*
     * =====================================================
     * ACTIVE TABLES
     * =====================================================
     */

    private readonly sessions =
        new Map<string, PressureSession>();

    /*
     * =====================================================
     * SETTLEMENT RESULTS
     * =====================================================
     *
     * Stores the authoritative result of the most recent
     * settlement for each persistent table.
     *
     * PressurePlugin uses this result to perform persistent
     * Ink Bank bookkeeping.
     *
     * High Pressure:
     *
     *     75% → winner
     *     25% → eligible players
     *     integer remainder → Ink Bank
     *
     * Super Pressure:
     *
     *     100% → winner
     *
     * Last Player:
     *
     *     100% → winner
     *
     * No Nickel is created by settlement.
     */

    private readonly settlementResults =
        new Map<
            string,
            PressureSettlementResult
        >();

    /*
     * =====================================================
     * DECK SERVICE
     * =====================================================
     */

    private readonly deckService =
        new PressureDeckService();

    /*
     * =====================================================
     * PLAYER LIMITS
     * =====================================================
     */

    readonly minPlayers = 4;

    readonly maxPlayers = 4;

    /*
     * =====================================================
     * OPENING WAGER
     * =====================================================
     */

    readonly openingWager = 25n;

    /*
     * =====================================================
     * MAX RAISES
     * =====================================================
     */

    readonly maxRaisesPerPlayer = 3;

    /*
     * =====================================================
     * TURN TIMER
     * =====================================================
     */

    readonly turnDurationMs = 30_000;

    /*
     * =====================================================
     * POST-MATCH COOLDOWN
     * =====================================================
     */

    readonly postMatchCooldownMs = 60_000;

    /*
     * =========================================================
     * CREATE SESSION
     * =========================================================
     */

    createSession(
        guildId: string,
        channelId: string
    ): PressureSession {

        const existingTable =
            this.getTable(
                guildId,
                channelId
            );

        if (existingTable) {

            throw new Error(
                "LOBBY_ALREADY_EXISTS"
            );
        }

        const session: PressureSession = {

            id:
                this.createSessionId(),

            guildId,

            channelId,

            players:
                [],

            deck:
                [],

            discarded:
                [],

            status:
                "waiting",

            phase:
                "passing",

            currentTurn:
                0,

            passingActedPlayerIds:
                [],

            wageringRespondedPlayerIds:
                [],

            currentRaise:
                0n,

            wageringActive:
                false,

            checkAvailable:
                false,

            pot:
                0n,

            createdAt:
                Date.now()
        };

        this.sessions.set(
            session.id,
            session
        );

        return session;
    }

    /*
     * =========================================================
     * GET SESSION
     * =========================================================
     */

    getSession(
        sessionId: string
    ): PressureSession | undefined {

        return this.sessions.get(
            sessionId
        );
    }

    /*
     * =========================================================
     * GET SETTLEMENT RESULT
     * =========================================================
     *
     * Returns the authoritative settlement result generated
     * when the most recent match for this session finished.
     *
     * PressurePlugin uses this to persist an Ink Bank remainder.
     */

    getSettlementResult(
        sessionId: string
    ): PressureSettlementResult | undefined {

        return this.settlementResults.get(
            sessionId
        );
    }

    /*
     * =========================================================
     * GET WAITING LOBBY
     * =========================================================
     */

    getWaitingLobby(
        guildId: string,
        channelId?: string
    ): PressureSession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId !== guildId
            ) {

                continue;
            }

            if (
                session.status !== "waiting"
            ) {

                continue;
            }

            if (
                channelId &&
                session.channelId !== channelId
            ) {

                continue;
            }

            return session;
        }

        return undefined;
    }

    /*
     * =========================================================
     * GET TABLE
     * =========================================================
     */

    getTable(
        guildId: string,
        channelId: string
    ): PressureSession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId !== guildId
            ) {

                continue;
            }

            if (
                session.channelId !== channelId
            ) {

                continue;
            }

            if (
                session.status === "cancelled"
            ) {

                continue;
            }

            return session;
        }

        return undefined;
    }

    /*
     * =========================================================
     * GET AVAILABLE TABLE
     * =========================================================
     */

    getAvailableTable(
        guildId: string,
        channelId: string
    ): PressureSession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId !== guildId
            ) {

                continue;
            }

            if (
                session.channelId !== channelId
            ) {

                continue;
            }

            if (
                session.status !== "waiting" &&
                session.status !== "finished"
            ) {

                continue;
            }

            if (
                session.players.length >=
                this.maxPlayers
            ) {

                continue;
            }

            return session;
        }

        return undefined;
    }

    /*
     * =========================================================
     * GET PLAYER SESSION
     * =========================================================
     */

    getPlayerSession(
        guildId: string,
        userId: string
    ): PressureSession | undefined {

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.guildId !== guildId
            ) {

                continue;
            }

            if (
                session.status === "cancelled"
            ) {

                continue;
            }

            const player =
                session.players.find(
                    currentPlayer =>
                        currentPlayer.id === userId
                );

            if (player) {

                return session;
            }
        }

        return undefined;
    }

    /*
     * =========================================================
     * ADD PLAYER
     * =========================================================
     */

    addPlayer(
        sessionId: string,
        playerId: string,
        username: string,
        guildId: string,
        balance: bigint
    ): PressureSession {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status !== "waiting" &&
            session.status !== "finished"
        ) {

            throw new Error(
                "GAME_NOT_IN_LOBBY"
            );
        }

        if (
            session.guildId !== guildId
        ) {

            throw new Error(
                "WRONG_GUILD"
            );
        }

        if (
            session.players.some(
                player =>
                    player.id === playerId
            )
        ) {

            throw new Error(
                "PLAYER_ALREADY_IN_GAME"
            );
        }

        if (
            session.players.length >=
            this.maxPlayers
        ) {

            throw new Error(
                "GAME_FULL"
            );
        }

        const existingSession =
            this.getPlayerSession(
                guildId,
                playerId
            );

        if (existingSession) {

            throw new Error(
                "PLAYER_ALREADY_IN_GAME"
            );
        }

        const position =
            session.players.length;

        const player: PressurePlayer = {

            id:
                playerId,

            username,

            position,

            hand:
                [],

            balance,

            wagered:
                0n,

            raiseCount:
                0,

            active:
                true,

            folded:
                false,

            allIn:
                false
        };

        session.players.push(
            player
        );

        return session;
    }

    /*
     * =========================================================
     * REMOVE PLAYER
     * =========================================================
     */

    removePlayer(
        sessionId: string,
        playerId: string
    ): PressurePlayer {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status !== "waiting" &&
            session.status !== "finished"
        ) {

            throw new Error(
                "GAME_IN_PROGRESS"
            );
        }

        const playerIndex =
            session.players.findIndex(
                player =>
                    player.id === playerId
            );

        if (
            playerIndex === -1
        ) {

            throw new Error(
                "PLAYER_NOT_IN_GAME"
            );
        }

        const removedPlayers =
            session.players.splice(
                playerIndex,
                1
            );

        const removedPlayer =
            removedPlayers[0];

        if (!removedPlayer) {

            throw new Error(
                "PLAYER_NOT_IN_GAME"
            );
        }

        session.players =
            session.players.map(
                (
                    player,
                    index
                ) => ({

                    ...player,

                    position:
                        index
                })
            );

        session.currentTurn =
            0;

        return removedPlayer;
    }

    /*
     * =========================================================
     * START SESSION / MATCH
     * =========================================================
     */

    startSession(
        sessionId: string
    ): PressureSession {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status !== "waiting" &&
            session.status !== "finished"
        ) {

            throw new Error(
                "GAME_NOT_IN_LOBBY"
            );
        }

        if (
            session.players.length !==
            this.minPlayers
        ) {

            throw new Error(
                "PRESSURE_REQUIRES_FOUR_PLAYERS"
            );
        }

        if (
            session.status === "finished" &&
            session.nextGameStartsAt !== undefined &&
            Date.now() < session.nextGameStartsAt
        ) {

            throw new Error(
                "GAME_COOLDOWN_ACTIVE"
            );
        }

        for (
            const player
            of session.players
        ) {

            if (
                player.balance <
                this.openingWager
            ) {

                throw new Error(
                    "INSUFFICIENT_BALANCE"
                );
            }
        }

        session.status =
            "dealing";

        session.deck =
            [];

        session.discarded =
            [];

        session.pot =
            0n;

        session.currentRaise =
            0n;

        session.phase =
            "passing";

        session.passingActedPlayerIds =
            [];

        session.wageringStarterId =
            undefined;

        session.wageringRespondedPlayerIds =
            [];

        session.wageringActive =
            false;

        session.checkAvailable =
            false;

        session.currentTurn =
            0;

        session.turnStartedAt =
            undefined;

        session.turnExpiresAt =
            undefined;

        session.nextGameStartsAt =
            undefined;

        for (
            const player
            of session.players
        ) {

            player.hand =
                [];

            player.wagered =
                0n;

            player.raiseCount =
                0;

            player.active =
                true;

            player.folded =
                false;

            player.allIn =
                false;
        }

        let deck =
            this.deckService.createDeck();

        deck =
            this.deckService.shuffle(
                deck
            );

        const dealt =
            this.deckService.dealFromDeck(
                deck,
                session.players.length
            );

        session.deck =
            deck;

        for (
            let index = 0;
            index < session.players.length;
            index++
        ) {

            const player =
                session.players[index];

            const hand =
                dealt.hands[index];

            if (
                !player ||
                !hand
            ) {

                throw new Error(
                    "FAILED_TO_DEAL_PLAYER_HAND"
                );
            }

            player.hand = [
                ...hand
            ];
        }

        for (
            const player
            of session.players
        ) {

            player.balance -=
                this.openingWager;

            player.wagered =
                this.openingWager;

            session.pot +=
                this.openingWager;
        }

        session.phase =
            "passing";

        session.currentTurn =
            0;

        session.passingActedPlayerIds =
            [];

        const now =
            Date.now();

        session.startedAt =
            now;

        session.finishedAt =
            undefined;

        session.status =
            "playing";

        this.resetTurnTimer(
            session
        );

        return session;
    }

    /*
     * =========================================================
     * GET PLAYER
     * =========================================================
     */

    getPlayer(
        session: PressureSession,
        playerId: string
    ): PressurePlayer {

        const player =
            session.players.find(
                currentPlayer =>
                    currentPlayer.id === playerId
            );

        if (!player) {

            throw new Error(
                "PLAYER_NOT_IN_GAME"
            );
        }

        return player;
    }

    /*
     * =========================================================
     * GET PLAYER HAND
     * =========================================================
     */

    getPlayerHand(
        sessionId: string,
        playerId: string
    ): PressureCard[] {

        const session =
            this.requireSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        return [
            ...player.hand
        ];
    }

    /*
     * =========================================================
     * GET ALL HANDS
     * =========================================================
     */

    getHands(
        sessionId: string
    ): Map<string, PressureCard[]> {

        const session =
            this.requireSession(
                sessionId
            );

        const hands =
            new Map<
                string,
                PressureCard[]
            >();

        for (
            const player
            of session.players
        ) {

            hands.set(
                player.id,
                [
                    ...player.hand
                ]
            );
        }

        return hands;
    }

    /*
     * =========================================================
     * GET REMAINING DECK
     * =========================================================
     */

    getRemainingDeck(
        sessionId: string
    ): PressureCard[] {

        const session =
            this.requireSession(
                sessionId
            );

        return [
            ...session.deck
        ];
    }

    /*
     * =========================================================
     * GET DISCARD PILE
     * =========================================================
     */

    getDiscardedCards(
        sessionId: string
    ): PressureCard[] {

        const session =
            this.requireSession(
                sessionId
            );

        return [
            ...session.discarded
        ];
    }

    /*
     * =========================================================
     * GET CURRENT PLAYER
     * =========================================================
     */

    getCurrentPlayer(
        sessionId: string
    ): PressurePlayer {

        const session =
            this.requireSession(
                sessionId
            );

        const player =
            session.players[
                session.currentTurn
            ];

        if (!player) {

            throw new Error(
                "CURRENT_PLAYER_NOT_FOUND"
            );
        }

        return player;
    }

    /*
     * =========================================================
     * GET PLAYER BY POSITION
     * =========================================================
     */

    getPlayerByPosition(
        sessionId: string,
        position: number
    ): PressurePlayer {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            !Number.isInteger(position) ||
            position < 0
        ) {

            throw new Error(
                "INVALID_PLAYER_POSITION"
            );
        }

        const player =
            session.players[
                position
            ];

        if (!player) {

            throw new Error(
                "PLAYER_POSITION_NOT_FOUND"
            );
        }

        return player;
    }

    /*
     * =========================================================
     * PASS CARD
     * =========================================================
     */

    passCard(
        sessionId: string,
        playerId: string,
        symbol: string,
        handPosition: number
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        if (
            session.phase !== "passing"
        ) {

            throw new Error(
                "NOT_PASSING_PHASE"
            );
        }

        const player =
            this.getPlayer(
                session,
                playerId
            );

        this.requireCurrentTurn(
            session,
            player
        );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            !Number.isInteger(handPosition) ||
            handPosition < 1
        ) {

            throw new Error(
                "INVALID_CARD_POSITION"
            );
        }

        const index =
            handPosition - 1;

        const card =
            player.hand[index];

        if (!card) {

            throw new Error(
                "CARD_POSITION_NOT_FOUND"
            );
        }

        const normalizedSymbol =
            symbol.trim().toUpperCase();

        if (
            card.symbol.toUpperCase() !==
            normalizedSymbol
        ) {

            throw new Error(
                "CARD_SYMBOL_MISMATCH"
            );
        }

        const recipient =
            this.getNextEligiblePlayer(
                session,
                player.position
            );

        if (!recipient) {

            throw new Error(
                "NO_NEXT_PLAYER"
            );
        }

        player.hand.splice(
            index,
            1
        );

        recipient.hand.push(
            card
        );

        this.addPassingAction(
            session,
            player.id
        );

        this.advanceToNextPassingPlayer(
            session,
            player.position
        );

        return session;
    }

    /*
     * =========================================================
     * RAISE
     * =========================================================
     */

    raise(
        sessionId: string,
        playerId: string,
        amount: bigint
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        this.requireCurrentTurn(
            session,
            player
        );

        this.validateRaiseAmount(
            amount
        );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            player.allIn
        ) {

            throw new Error(
                "PLAYER_ALREADY_ALL_IN"
            );
        }

        if (
            player.raiseCount >=
            this.maxRaisesPerPlayer
        ) {

            throw new Error(
                "MAX_RAISES_REACHED"
            );
        }

        if (
            player.balance <= 0n
        ) {

            throw new Error(
                "NO_BALANCE_TO_RAISE"
            );
        }

        if (
            amount >
            player.balance
        ) {

            throw new Error(
                "INSUFFICIENT_BALANCE"
            );
        }

        player.balance -=
            amount;

        player.wagered +=
            amount;

        session.pot +=
            amount;

        player.raiseCount +=
            1;

        session.currentRaise =
            amount;

        if (
            !session.wageringActive
        ) {

            session.phase =
                "wagering";

            session.wageringStarterId =
                player.id;

            session.wageringActive =
                true;
        }

        const starterId =
            session.wageringStarterId;

        if (!starterId) {

            throw new Error(
                "WAGERING_STARTER_NOT_FOUND"
            );
        }

        session.wageringRespondedPlayerIds = [
            starterId,
            player.id
        ];

        this.advanceToNextWageringPlayer(
            session,
            player.position
        );

        return session;
    }

    /*
     * =========================================================
     * CALL
     * =========================================================
     */

    call(
        sessionId: string,
        playerId: string
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        if (
            !session.wageringActive
        ) {

            throw new Error(
                "NO_ACTIVE_WAGER"
            );
        }

        const player =
            this.getPlayer(
                session,
                playerId
            );

        this.requireCurrentTurn(
            session,
            player
        );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            player.allIn
        ) {

            throw new Error(
                "PLAYER_ALREADY_ALL_IN"
            );
        }

        if (
            session.wageringStarterId ===
            player.id
        ) {

            throw new Error(
                "WAGERING_STARTER_CANNOT_CALL"
            );
        }

        const amount =
            session.currentRaise;

        if (
            amount <= 0n
        ) {

            throw new Error(
                "NO_ACTIVE_RAISE"
            );
        }

        if (
            player.balance <
            amount
        ) {

            throw new Error(
                "INSUFFICIENT_BALANCE"
            );
        }

        player.balance -=
            amount;

        player.wagered +=
            amount;

        session.pot +=
            amount;

        this.markWageringResponse(
            session,
            player.id
        );

        this.advanceAfterWageringResponse(
            session,
            player.position
        );

        return session;
    }

    /*
     * =========================================================
     * ALL-IN
     * =========================================================
     */

    allIn(
        sessionId: string,
        playerId: string
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        this.requireCurrentTurn(
            session,
            player
        );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            player.allIn
        ) {

            throw new Error(
                "PLAYER_ALREADY_ALL_IN"
            );
        }

        const amount =
            player.balance;

        if (
            amount <= 0n
        ) {

            throw new Error(
                "NO_BALANCE_FOR_ALL_IN"
            );
        }

        player.balance =
            0n;

        player.wagered +=
            amount;

        session.pot +=
            amount;

        player.allIn =
            true;

        if (
            session.wageringActive
        ) {

            this.markWageringResponse(
                session,
                player.id
            );

            this.advanceAfterWageringResponse(
                session,
                player.position
            );

            return session;
        }

        if (
            session.phase === "passing"
        ) {

            this.addPassingAction(
                session,
                player.id
            );

            this.advanceToNextPassingPlayer(
                session,
                player.position
            );

            return session;
        }

        throw new Error(
            "INVALID_GAME_PHASE"
        );
    }

    /*
     * =========================================================
     * FOLD
     * =========================================================
     */

    fold(
        sessionId: string,
        playerId: string
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        this.requireCurrentTurn(
            session,
            player
        );

        if (
            player.folded
        ) {

            throw new Error(
                "PLAYER_ALREADY_FOLDED"
            );
        }

        player.folded =
            true;

        player.active =
            false;

        if (
            session.wageringActive
        ) {

            this.markWageringResponse(
                session,
                player.id
            );

            if (
                this.getEligiblePlayers(session).length <=
                1
            ) {

                this.settleLastPlayer(
                    session
                );

                return session;
            }

            this.advanceAfterWageringResponse(
                session,
                player.position
            );

            return session;
        }

        if (
            session.phase === "passing"
        ) {

            this.addPassingAction(
                session,
                player.id
            );

            const eligible =
                this.getEligiblePlayers(
                    session
                );

            if (
                eligible.length <= 1
            ) {

                this.settleLastPlayer(
                    session
                );

                return session;
            }

            this.advanceToNextPassingPlayer(
                session,
                player.position
            );

            return session;
        }

        throw new Error(
            "INVALID_GAME_PHASE"
        );
    }

    /*
     * =========================================================
     * EXPIRE CURRENT TURN
     * =========================================================
     */

    expireCurrentTurn(
        sessionId: string,
        expectedPlayerId: string,
        expectedTurn: number,
        expectedExpiresAt: number
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        if (
            session.currentTurn !==
            expectedTurn
        ) {

            throw new Error(
                "STALE_TURN_TIMER"
            );
        }

        const currentPlayer =
            session.players[
                session.currentTurn
            ];

        if (!currentPlayer) {

            throw new Error(
                "CURRENT_PLAYER_NOT_FOUND"
            );
        }

        if (
            currentPlayer.id !==
            expectedPlayerId
        ) {

            throw new Error(
                "STALE_TURN_TIMER"
            );
        }

        if (
            session.turnExpiresAt !==
            expectedExpiresAt
        ) {

            throw new Error(
                "STALE_TURN_TIMER"
            );
        }

        if (
            Date.now() <
            expectedExpiresAt
        ) {

            throw new Error(
                "TURN_NOT_EXPIRED"
            );
        }

        return this.fold(
            sessionId,
            expectedPlayerId
        );
    }

    /*
     * =========================================================
     * HIGH PRESSURE
     * =========================================================
     */

    claimHighPressure(
        sessionId: string,
        playerId: string
    ): PressureSettlementResult {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            !this.hasHighPressure(
                player.hand
            )
        ) {

            throw new Error(
                "INVALID_HIGH_PRESSURE"
            );
        }

        return this.settleHighPressure(
            session,
            player
        );
    }

    /*
     * =========================================================
     * SUPER PRESSURE
     * =========================================================
     */

    claimSuperPressure(
        sessionId: string,
        playerId: string
    ): PressureSettlementResult {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const player =
            this.getPlayer(
                session,
                playerId
            );

        if (
            player.folded ||
            !player.active
        ) {

            throw new Error(
                "PLAYER_NOT_ELIGIBLE"
            );
        }

        if (
            !this.hasSuperPressure(
                player.hand
            )
        ) {

            throw new Error(
                "INVALID_SUPER_PRESSURE"
            );
        }

        return this.settleSuperPressure(
            session,
            player
        );
    }

    /*
     * =========================================================
     * HAS HIGH PRESSURE
     * =========================================================
     */

    hasHighPressure(
        hand: PressureCard[]
    ): boolean {

        const suitCounts =
            new Map<string, number>();

        for (
            const card
            of hand
        ) {

            if (
                card.symbol.toUpperCase() ===
                "J"
            ) {

                continue;
            }

            const symbol =
                card.symbol.toUpperCase();

            const count =
                (
                    suitCounts.get(symbol) ??
                    0
                ) + 1;

            suitCounts.set(
                symbol,
                count
            );

            if (
                count >= 4
            ) {

                return true;
            }
        }

        return false;
    }

    /*
     * =========================================================
     * HAS SUPER PRESSURE
     * =========================================================
     */

    hasSuperPressure(
        hand: PressureCard[]
    ): boolean {

        let hasJoker =
            false;

        const suitCounts =
            new Map<string, number>();

        for (
            const card
            of hand
        ) {

            const symbol =
                card.symbol.toUpperCase();

            if (
                symbol === "J"
            ) {

                hasJoker =
                    true;

                continue;
            }

            const count =
                (
                    suitCounts.get(symbol) ??
                    0
                ) + 1;

            suitCounts.set(
                symbol,
                count
            );
        }

        if (!hasJoker) {

            return false;
        }

        for (
            const count
            of suitCounts.values()
        ) {

            if (
                count >= 4
            ) {

                return true;
            }
        }

        return false;
    }

    /*
     * =========================================================
     * ADVANCE TURN
     * =========================================================
     */

    advanceTurn(
        sessionId: string
    ): PressureSession {

        const session =
            this.requirePlayingSession(
                sessionId
            );

        const next =
            this.getNextEligiblePlayer(
                session,
                session.currentTurn
            );

        if (!next) {

            throw new Error(
                "NO_NEXT_PLAYER"
            );
        }

        session.currentTurn =
            next.position;

        this.resetTurnTimer(
            session
        );

        return session;
    }

    /*
     * =========================================================
     * FINISH MATCH
     * =========================================================
     */

    finishSession(
        sessionId: string
    ): PressureSession {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status === "cancelled"
        ) {

            throw new Error(
                "GAME_ALREADY_CANCELLED"
            );
        }

        session.status =
            "finished";

        const finishedAt =
            Date.now();

        session.finishedAt =
            finishedAt;

        session.nextGameStartsAt =
            finishedAt +
            this.postMatchCooldownMs;

        session.turnExpiresAt =
            undefined;

        session.turnStartedAt =
            undefined;

        return session;
    }

    /*
     * =========================================================
     * CANCEL SESSION
     * =========================================================
     */

    cancelSession(
        sessionId: string
    ): PressureSession {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status === "cancelled"
        ) {

            throw new Error(
                "GAME_ALREADY_CANCELLED"
            );
        }

        session.status =
            "cancelled";

        session.finishedAt =
            Date.now();

        session.nextGameStartsAt =
            undefined;

        session.turnExpiresAt =
            undefined;

        session.turnStartedAt =
            undefined;

        return session;
    }

    /*
     * =========================================================
     * DELETE SESSION
     * =========================================================
     */

    deleteSession(
        sessionId: string
    ): void {

        const session =
            this.sessions.get(
                sessionId
            );

        if (!session) {

            return;
        }

        if (
            session.status !== "cancelled"
        ) {

            throw new Error(
                "CANNOT_DELETE_ACTIVE_GAME"
            );
        }

        this.sessions.delete(
            sessionId
        );

        this.settlementResults.delete(
            sessionId
        );
    }

    /*
     * =========================================================
     * GET ACTIVE SESSIONS
     * =========================================================
     */

    getActiveSessions(
        guildId?: string
    ): PressureSession[] {

        const sessions:
            PressureSession[] = [];

        for (
            const session
            of this.sessions.values()
        ) {

            if (
                session.status === "cancelled"
            ) {

                continue;
            }

            if (
                guildId &&
                session.guildId !== guildId
            ) {

                continue;
            }

            sessions.push(
                session
            );
        }

        return sessions;
    }

    /*
     * =========================================================
     * PRIVATE: WAGER RESPONSE
     * =========================================================
     */

    private markWageringResponse(
        session: PressureSession,
        playerId: string
    ): void {

        if (
            !session.wageringRespondedPlayerIds.includes(
                playerId
            )
        ) {

            session.wageringRespondedPlayerIds.push(
                playerId
            );
        }
    }

    /*
     * =========================================================
     * PRIVATE: ADVANCE TO NEXT WAGERING PLAYER
     * =========================================================
     */

    private advanceToNextWageringPlayer(
        session: PressureSession,
        fromPosition: number
    ): void {

        const eligible =
            this.getEligiblePlayers(
                session
            );

        if (
            eligible.length <= 1
        ) {

            this.settleLastPlayer(
                session
            );

            return;
        }

        const starterId =
            session.wageringStarterId;

        if (!starterId) {

            throw new Error(
                "WAGERING_STARTER_NOT_FOUND"
            );
        }

        const responders =
            eligible.filter(
                player =>
                    player.id !== starterId
            );

        const allResponded =
            responders.every(
                player =>
                    session.wageringRespondedPlayerIds.includes(
                        player.id
                    )
            );

        if (allResponded) {

            this.completeWageringCycle(
                session
            );

            return;
        }

        const next =
            this.findNextUnrespondedPlayer(
                session,
                fromPosition,
                responders
            );

        if (!next) {

            this.completeWageringCycle(
                session
            );

            return;
        }

        session.currentTurn =
            next.position;

        this.resetTurnTimer(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: ADVANCE AFTER WAGER RESPONSE
     * =========================================================
     */

    private advanceAfterWageringResponse(
        session: PressureSession,
        fromPosition: number
    ): void {

        const eligible =
            this.getEligiblePlayers(
                session
            );

        const starterId =
            session.wageringStarterId;

        if (!starterId) {

            throw new Error(
                "WAGERING_STARTER_NOT_FOUND"
            );
        }

        const responders =
            eligible.filter(
                player =>
                    player.id !== starterId
            );

        const allResponded =
            responders.every(
                player =>
                    session.wageringRespondedPlayerIds.includes(
                        player.id
                    )
            );

        if (allResponded) {

            this.completeWageringCycle(
                session
            );

            return;
        }

        const next =
            this.findNextUnrespondedPlayer(
                session,
                fromPosition,
                responders
            );

        if (!next) {

            this.completeWageringCycle(
                session
            );

            return;
        }

        session.currentTurn =
            next.position;

        this.resetTurnTimer(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: ADVANCE PASSING
     * =========================================================
     */

    private advanceToNextPassingPlayer(
        session: PressureSession,
        fromPosition: number
    ): void {

        const eligible =
            this.getEligiblePlayers(
                session
            );

        const allPassed =
            eligible.every(
                player =>
                    session.passingActedPlayerIds.includes(
                        player.id
                    )
            );

        if (allPassed) {

            this.completePassingCycle(
                session
            );

            return;
        }

        const next =
            this.findNextUnactedPassingPlayer(
                session,
                fromPosition
            );

        if (!next) {

            this.completePassingCycle(
                session
            );

            return;
        }

        session.currentTurn =
            next.position;

        this.resetTurnTimer(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: ADD PASSING ACTION
     * =========================================================
     */

    private addPassingAction(
        session: PressureSession,
        playerId: string
    ): void {

        if (
            !session.passingActedPlayerIds.includes(
                playerId
            )
        ) {

            session.passingActedPlayerIds.push(
                playerId
            );
        }
    }

    /*
     * =========================================================
     * PRIVATE: COMPLETE PASSING CYCLE
     * =========================================================
     */

    private completePassingCycle(
        session: PressureSession
    ): void {

        this.beginNextPassingCycle(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: COMPLETE WAGERING CYCLE
     * =========================================================
     */

    private completeWageringCycle(
        session: PressureSession
    ): void {

        session.wageringActive =
            false;

        session.wageringStarterId =
            undefined;

        session.wageringRespondedPlayerIds =
            [];

        session.currentRaise =
            0n;

        this.beginNextPassingCycle(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: BEGIN NEXT PASSING CYCLE
     * =========================================================
     */

    private beginNextPassingCycle(
        session: PressureSession
    ): void {

        session.phase =
            "passing";

        session.passingActedPlayerIds =
            [];

        session.wageringActive =
            false;

        session.wageringStarterId =
            undefined;

        session.wageringRespondedPlayerIds =
            [];

        session.currentRaise =
            0n;

        const first =
            this.getFirstEligiblePlayer(
                session
            );

        if (!first) {

            this.settleLastPlayer(
                session
            );

            return;
        }

        session.currentTurn =
            first.position;

        this.resetTurnTimer(
            session
        );
    }

    /*
     * =========================================================
     * PRIVATE: FIND NEXT PASSING PLAYER
     * =========================================================
     */

    private findNextUnactedPassingPlayer(
        session: PressureSession,
        fromPosition: number
    ): PressurePlayer | undefined {

        const count =
            session.players.length;

        for (
            let offset = 1;
            offset <= count;
            offset++
        ) {

            const position =
                (
                    fromPosition +
                    offset
                ) % count;

            const player =
                session.players[
                    position
                ];

            if (!player) {

                continue;
            }

            if (
                player.folded ||
                !player.active
            ) {

                continue;
            }

            if (
                session.passingActedPlayerIds.includes(
                    player.id
                )
            ) {

                continue;
            }

            return player;
        }

        return undefined;
    }

    /*
     * =========================================================
     * PRIVATE: FIND NEXT WAGER RESPONDER
     * =========================================================
     */

    private findNextUnrespondedPlayer(
        session: PressureSession,
        fromPosition: number,
        responders: PressurePlayer[]
    ): PressurePlayer | undefined {

        const count =
            session.players.length;

        const responderIds =
            new Set(
                responders.map(
                    player =>
                        player.id
                )
            );

        for (
            let offset = 1;
            offset <= count;
            offset++
        ) {

            const position =
                (
                    fromPosition +
                    offset
                ) % count;

            const player =
                session.players[
                    position
                ];

            if (!player) {

                continue;
            }

            if (
                !responderIds.has(
                    player.id
                )
            ) {

                continue;
            }

            if (
                session.wageringRespondedPlayerIds.includes(
                    player.id
                )
            ) {

                continue;
            }

            return player;
        }

        return undefined;
    }

    /*
     * =========================================================
     * PRIVATE: GET NEXT ELIGIBLE PLAYER
     * =========================================================
     */

    private getNextEligiblePlayer(
        session: PressureSession,
        fromPosition: number
    ): PressurePlayer | undefined {

        const count =
            session.players.length;

        for (
            let offset = 1;
            offset <= count;
            offset++
        ) {

            const position =
                (
                    fromPosition +
                    offset
                ) % count;

            const player =
                session.players[
                    position
                ];

            if (
                player &&
                !player.folded &&
                player.active
            ) {

                return player;
            }
        }

        return undefined;
    }

    /*
     * =========================================================
     * PRIVATE: GET FIRST ELIGIBLE PLAYER
     * =========================================================
     */

    private getFirstEligiblePlayer(
        session: PressureSession
    ): PressurePlayer | undefined {

        return session.players.find(
            player =>
                !player.folded &&
                player.active
        );
    }

    /*
     * =========================================================
     * PRIVATE: GET ELIGIBLE PLAYERS
     * =========================================================
     */

    private getEligiblePlayers(
        session: PressureSession
    ): PressurePlayer[] {

        return session.players.filter(
            player =>
                !player.folded &&
                player.active
        );
    }

    /*
     * =========================================================
     * PRIVATE: PLAYER BY POSITION
     * =========================================================
     */

    private getPlayerByPositionInternal(
        session: PressureSession,
        position: number
    ): PressurePlayer {

        const player =
            session.players[
                position
            ];

        if (!player) {

            throw new Error(
                "PLAYER_POSITION_NOT_FOUND"
            );
        }

        return player;
    }

    /*
     * =========================================================
     * PRIVATE: CURRENT TURN VALIDATION
     * =========================================================
     */

    private requireCurrentTurn(
        session: PressureSession,
        player: PressurePlayer
    ): void {

        if (
            session.currentTurn !==
            player.position
        ) {

            throw new Error(
                "NOT_YOUR_TURN"
            );
        }
    }

    /*
     * =========================================================
     * PRIVATE: RAISE VALIDATION
     * =========================================================
     */

    private validateRaiseAmount(
        amount: bigint
    ): void {

        if (
            amount <= 0n
        ) {

            throw new Error(
                "INVALID_RAISE_AMOUNT"
            );
        }
    }

    /*
     * =========================================================
     * PRIVATE: PLAYING SESSION
     * =========================================================
     */

    private requirePlayingSession(
        sessionId: string
    ): PressureSession {

        const session =
            this.requireSession(
                sessionId
            );

        if (
            session.status !== "playing"
        ) {

            throw new Error(
                "GAME_NOT_PLAYING"
            );
        }

        return session;
    }

    /*
     * =========================================================
     * PRIVATE: RESET TURN TIMER
     * =========================================================
     */

    private resetTurnTimer(
        session: PressureSession
    ): void {

        const now =
            Date.now();

        session.turnStartedAt =
            now;

        session.turnExpiresAt =
            now +
            this.turnDurationMs;
    }

    /*
     * =========================================================
     * PRIVATE: SETTLE HIGH PRESSURE
     * =========================================================
     */

    private settleHighPressure(
        session: PressureSession,
        winner: PressurePlayer
    ): PressureSettlementResult {

        const pot =
            session.pot;

        const winnerAmount =
            (
                pot * 75n
            ) / 100n;

        const remaining =
            pot -
            winnerAmount;

        const eligible =
            this.getEligiblePlayers(
                session
            ).filter(
                player =>
                    player.id !== winner.id
            );

        const payouts =
            new Map<string, bigint>();

        payouts.set(
            winner.id,
            winnerAmount
        );

        if (
            eligible.length > 0
        ) {

            const share =
                remaining /
                BigInt(
                    eligible.length
                );

            const remainder =
                remaining %
                BigInt(
                    eligible.length
                );

            for (
                const player
                of eligible
            ) {

                payouts.set(
                    player.id,
                    share
                );
            }

            this.applyPayouts(
                session,
                payouts
            );

            return this.finishWithSettlement(
                session,
                {
                    winnerId:
                        winner.id,

                    pot,

                    payouts,

                    inkBankAmount:
                        remainder,

                    reason:
                        "high-pressure"
                }
            );
        }

        this.applyPayouts(
            session,
            payouts
        );

        return this.finishWithSettlement(
            session,
            {
                winnerId:
                    winner.id,

                pot,

                payouts,

                inkBankAmount:
                    remaining,

                reason:
                    "high-pressure"
            }
        );
    }

    /*
     * =========================================================
     * PRIVATE: SETTLE SUPER PRESSURE
     * =========================================================
     */

    private settleSuperPressure(
        session: PressureSession,
        winner: PressurePlayer
    ): PressureSettlementResult {

        const pot =
            session.pot;

        const payouts =
            new Map<string, bigint>();

        payouts.set(
            winner.id,
            pot
        );

        this.applyPayouts(
            session,
            payouts
        );

        return this.finishWithSettlement(
            session,
            {
                winnerId:
                    winner.id,

                pot,

                payouts,

                inkBankAmount:
                    0n,

                reason:
                    "super-pressure"
            }
        );
    }

    /*
     * =========================================================
     * PRIVATE: LAST PLAYER
     * =========================================================
     */

    private settleLastPlayer(
        session: PressureSession
    ): PressureSettlementResult {

        const eligible =
            this.getEligiblePlayers(
                session
            );

        if (
            eligible.length !== 1
        ) {

            throw new Error(
                "INVALID_LAST_PLAYER_SETTLEMENT"
            );
        }

        const winner =
            eligible[0];

        if (!winner) {

            throw new Error(
                "LAST_PLAYER_NOT_FOUND"
            );
        }

        const pot =
            session.pot;

        const payouts =
            new Map<string, bigint>();

        payouts.set(
            winner.id,
            pot
        );

        this.applyPayouts(
            session,
            payouts
        );

        return this.finishWithSettlement(
            session,
            {
                winnerId:
                    winner.id,

                pot,

                payouts,

                inkBankAmount:
                    0n,

                reason:
                    "last-player"
            }
        );
    }

    /*
     * =========================================================
     * PRIVATE: APPLY PAYOUTS
     * =========================================================
     */

    private applyPayouts(
        session: PressureSession,
        payouts: Map<string, bigint>
    ): void {

        for (
            const [
                playerId,
                amount
            ]
            of payouts
        ) {

            if (
                amount <= 0n
            ) {

                continue;
            }

            const player =
                session.players.find(
                    currentPlayer =>
                        currentPlayer.id ===
                        playerId
                );

            if (!player) {

                throw new Error(
                    "PAYOUT_PLAYER_NOT_FOUND"
                );
            }

            player.balance +=
                amount;
        }

        session.pot =
            0n;
    }

    /*
     * =========================================================
     * PRIVATE: FINISH SETTLEMENT
     * =========================================================
     */

    private finishWithSettlement(
        session: PressureSession,
        result: PressureSettlementResult
    ): PressureSettlementResult {

        /*
         * Store the authoritative settlement result while
         * the table remains alive.
         *
         * PressurePlugin consumes this result and persists
         * any Ink Bank remainder.
         */

        this.settlementResults.set(
            session.id,
            result
        );

        session.status =
            "finished";

        const finishedAt =
            Date.now();

        session.finishedAt =
            finishedAt;

        session.nextGameStartsAt =
            finishedAt +
            this.postMatchCooldownMs;

        session.turnExpiresAt =
            undefined;

        session.turnStartedAt =
            undefined;

        session.phase =
            "passing";

        session.passingActedPlayerIds =
            [];

        session.wageringStarterId =
            undefined;

        session.wageringRespondedPlayerIds =
            [];

        session.currentRaise =
            0n;

        session.wageringActive =
            false;

        session.checkAvailable =
            false;

        session.currentTurn =
            0;

        return result;
    }

    /*
     * =========================================================
     * PRIVATE: SESSION
     * =========================================================
     */

    private requireSession(
        sessionId: string
    ): PressureSession {

        const session =
            this.sessions.get(
                sessionId
            );

        if (!session) {

            throw new Error(
                "GAME_NOT_FOUND"
            );
        }

        return session;
    }

    /*
     * =========================================================
     * SESSION ID
     * =========================================================
     */

    private createSessionId(): string {

        return (
            `${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .slice(2, 10)}`
        );
    }
}

END FILE: src/plugins/pressure/services/PressureService.ts
================================================================================

FILE: src/plugins/pressure/services/PressureTableRenderer.ts
--------------------------------------------------------------------------------
Original size: 27674 bytes
Exported size: 26433 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import {
    createCanvas,
    loadImage,
    registerFont,
    CanvasRenderingContext2D
} from "canvas";

import { AttachmentBuilder } from "discord.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { PressurePlayer } from "../models/PressurePlayer.js";

/*
 * =========================================================
 * BUNDLED FONT SETUP
 * =========================================================
 *
 * Railway/container environments may not have the required
 * system fonts installed.
 *
 * Register the bundled Cormorant Garamond files explicitly
 * so node-canvas can render the table text reliably.
 *
 * =========================================================
 */

const currentDirectory =
    path.dirname(
        fileURLToPath(import.meta.url)
    );

const fontDirectory =
    path.resolve(
        currentDirectory,
        "../../../fonts"
    );

registerFont(
    path.join(
        fontDirectory,
        "CormorantGaramond-Regular.ttf"
    ),
    {
        family: "Cormorant Garamond",
        weight: "400"
    }
);

registerFont(
    path.join(
        fontDirectory,
        "CormorantGaramond-Bold.ttf"
    ),
    {
        family: "Cormorant Garamond",
        weight: "700"
    }
);

/*
 * =========================================================
 * PRESSURE TABLE RENDERER
 * =========================================================
 *
 * Responsible only for rendering the PUBLIC Pressure table.
 *
 * This renderer:
 *
 * - Renders the poker table
 * - Renders four fixed seats
 * - Renders Discord avatars
 * - Renders usernames
 * - Renders table balances
 * - Highlights the active player's turn
 * - Renders the current pot
 * - Renders empty seats
 *
 * IMPORTANT:
 *
 * This renderer NEVER renders player hands.
 * This renderer NEVER changes game state.
 * This renderer NEVER performs economy operations.
 * This renderer NEVER handles Discord interactions.
 *
 * Private hands belong exclusively to PressureCardRenderer.
 *
 * =========================================================
 */

export interface PressureTablePlayer {
    readonly player: PressurePlayer;
    readonly avatarUrl?: string;
}

export interface PressureTableRenderData {
    readonly players: PressureTablePlayer[];

    readonly pot: bigint;

    /**
     * Player position whose turn it currently is.
     *
     * undefined means there is currently no active turn.
     */
    readonly currentTurn?: number;

    /**
     * Optional table status displayed in the center.
     *
     * Examples:
     *
     * "WAITING FOR PLAYERS"
     * "DEALING"
     * "YOUR TURN"
     * "PLAYER'S TURN"
     */
    readonly status?: string;
}

export interface PressureTableRenderOptions {
    readonly width?: number;
    readonly height?: number;
}

/*
 * =========================================================
 * INTERNAL CONSTANTS
 * =========================================================
 */

const DEFAULT_WIDTH = 1400;
const DEFAULT_HEIGHT = 850;

const TABLE_MARGIN = 45;
const FRAME_RADIUS = 90;
const FELT_RADIUS = 72;

const SEAT_RADIUS = 72;

const WOOD_DARK = "#32170d";
const WOOD_MID = "#6d3518";
const WOOD_LIGHT = "#a85d2a";

const FELT_DARK = "#063b2a";
const FELT_MID = "#08734c";
const FELT_LIGHT = "#0b8b5c";

const GOLD = "#d8ad55";
const GOLD_LIGHT = "#f2d27c";

const EMPTY_RED = "#9b2d35";
const EMPTY_RED_DARK = "#48161b";

const TEXT_LIGHT = "#f5f1e8";
const TEXT_MUTED = "#b9c4bd";

/*
 * =========================================================
 * SEAT POSITIONS
 * =========================================================
 *
 * Four fixed positions.
 *
 *       1                 2
 *
 *
 *
 *       0                 3
 *
 * =========================================================
 */

interface SeatPosition {
    readonly x: number;
    readonly y: number;
}

export class PressureTableRenderer {

    /*
     * =====================================================
     * PUBLIC API
     * =====================================================
     */

    async renderTable(
        data: PressureTableRenderData,
        options: PressureTableRenderOptions = {}
    ): Promise<AttachmentBuilder> {

        const width = options.width ?? DEFAULT_WIDTH;
        const height = options.height ?? DEFAULT_HEIGHT;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        this.drawBackground(ctx, width, height);

        const table = {
            x: TABLE_MARGIN,
            y: TABLE_MARGIN,
            width: width - TABLE_MARGIN * 2,
            height: height - TABLE_MARGIN * 2
        };

        this.drawWoodenFrame(ctx, table);
        this.drawFelt(ctx, table);
        this.drawFeltDetails(ctx, table);

        const seats = this.getSeatPositions(table);

        /*
         * -------------------------------------------------
         * SEATS
         * -------------------------------------------------
         */

        for (let position = 0; position < 4; position++) {

            const seat = seats[position];

            const player = data.players.find(
                entry => entry.player.position === position
            );

            const isActive =
                data.currentTurn !== undefined &&
                data.currentTurn === position;

            if (player) {
                await this.drawOccupiedSeat(
                    ctx,
                    seat,
                    player,
                    isActive
                );
            } else {
                this.drawEmptySeat(
                    ctx,
                    seat
                );
            }
        }

        /*
         * -------------------------------------------------
         * CENTER
         * -------------------------------------------------
         */

        this.drawCenter(
            ctx,
            table,
            data.pot,
            data.status
        );

        const attachment = new AttachmentBuilder(
            canvas.toBuffer("image/png"),
            {
                name: "pressure-table.png"
            }
        );

        return attachment;
    }

    /*
     * =====================================================
     * BACKGROUND
     * =====================================================
     */

    private drawBackground(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ): void {

        const gradient = ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

        gradient.addColorStop(0, "#090909");
        gradient.addColorStop(0.5, "#17120f");
        gradient.addColorStop(1, "#050505");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        /*
         * Subtle vignette.
         */

        const vignette = ctx.createRadialGradient(
            width / 2,
            height / 2,
            100,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.7
        );

        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.55)");

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
    }

    /*
     * =====================================================
     * WOODEN FRAME
     * =====================================================
     */

    private drawWoodenFrame(
        ctx: CanvasRenderingContext2D,
        table: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ): void {

        /*
         * Outer shadow.
         */

        ctx.save();

        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 18;

        this.roundRect(
            ctx,
            table.x,
            table.y,
            table.width,
            table.height,
            FRAME_RADIUS
        );

        ctx.fillStyle = WOOD_DARK;
        ctx.fill();

        ctx.restore();

        /*
         * Main wooden gradient.
         */

        const woodGradient = ctx.createLinearGradient(
            table.x,
            table.y,
            table.x,
            table.y + table.height
        );

        woodGradient.addColorStop(0, WOOD_LIGHT);
        woodGradient.addColorStop(0.25, WOOD_MID);
        woodGradient.addColorStop(0.5, WOOD_DARK);
        woodGradient.addColorStop(0.75, WOOD_MID);
        woodGradient.addColorStop(1, WOOD_DARK);

        this.roundRect(
            ctx,
            table.x,
            table.y,
            table.width,
            table.height,
            FRAME_RADIUS
        );

        ctx.fillStyle = woodGradient;
        ctx.fill();

        /*
         * Outer golden trim.
         */

        ctx.save();

        this.roundRect(
            ctx,
            table.x + 9,
            table.y + 9,
            table.width - 18,
            table.height - 18,
            FRAME_RADIUS - 8
        );

        ctx.strokeStyle = "rgba(216, 173, 85, 0.45)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }

    /*
     * =====================================================
     * FELT
     * =====================================================
     */

    private drawFelt(
        ctx: CanvasRenderingContext2D,
        table: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ): void {

        const feltX = table.x + 28;
        const feltY = table.y + 28;
        const feltWidth = table.width - 56;
        const feltHeight = table.height - 56;

        const feltGradient = ctx.createRadialGradient(
            table.x + table.width / 2,
            table.y + table.height / 2,
            40,
            table.x + table.width / 2,
            table.y + table.height / 2,
            table.width * 0.65
        );

        feltGradient.addColorStop(0, FELT_LIGHT);
        feltGradient.addColorStop(0.55, FELT_MID);
        feltGradient.addColorStop(1, FELT_DARK);

        this.roundRect(
            ctx,
            feltX,
            feltY,
            feltWidth,
            feltHeight,
            FELT_RADIUS
        );

        ctx.fillStyle = feltGradient;
        ctx.fill();

        /*
         * Felt inner shadow.
         */

        ctx.save();

        this.roundRect(
            ctx,
            feltX,
            feltY,
            feltWidth,
            feltHeight,
            FELT_RADIUS
        );

        ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
        ctx.lineWidth = 12;
        ctx.stroke();

        ctx.restore();
    }

    /*
     * =====================================================
     * FELT DETAILS
     * =====================================================
     */

    private drawFeltDetails(
        ctx: CanvasRenderingContext2D,
        table: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ): void {

        const centerX = table.x + table.width / 2;
        const centerY = table.y + table.height / 2;

        /*
         * Decorative inner oval.
         */

        ctx.save();

        ctx.beginPath();

        ctx.ellipse(
            centerX,
            centerY,
            table.width * 0.32,
            table.height * 0.30,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(216, 173, 85, 0.12)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();

        /*
         * Subtle center glow.
         */

        const glow = ctx.createRadialGradient(
            centerX,
            centerY,
            20,
            centerX,
            centerY,
            260
        );

        glow.addColorStop(
            0,
            "rgba(255, 255, 255, 0.035)"
        );

        glow.addColorStop(
            1,
            "rgba(255, 255, 255, 0)"
        );

        ctx.fillStyle = glow;
        ctx.fillRect(
            table.x,
            table.y,
            table.width,
            table.height
        );
    }

    /*
     * =====================================================
     * SEAT POSITIONS
     * =====================================================
     */

    private getSeatPositions(
        table: {
            x: number;
            y: number;
            width: number;
            height: number;
        }
    ): SeatPosition[] {

        return [
            {
                /*
                 * Position 0
                 * Bottom-left
                 */
                x: table.x + table.width * 0.22,
                y: table.y + table.height * 0.78
            },

            {
                /*
                 * Position 1
                 * Top-left
                 */
                x: table.x + table.width * 0.22,
                y: table.y + table.height * 0.22
            },

            {
                /*
                 * Position 2
                 * Top-right
                 */
                x: table.x + table.width * 0.78,
                y: table.y + table.height * 0.22
            },

            {
                /*
                 * Position 3
                 * Bottom-right
                 */
                x: table.x + table.width * 0.78,
                y: table.y + table.height * 0.78
            }
        ];
    }

    /*
     * =====================================================
     * EMPTY SEAT
     * =====================================================
     */

    private drawEmptySeat(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition
    ): void {

        /*
         * Outer glow.
         */

        ctx.save();

        ctx.shadowColor = "rgba(155, 45, 53, 0.45)";
        ctx.shadowBlur = 22;

        ctx.beginPath();

        ctx.arc(
            seat.x,
            seat.y,
            SEAT_RADIUS,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = EMPTY_RED_DARK;
        ctx.fill();

        ctx.restore();

        /*
         * Main empty seat.
         */

        const gradient = ctx.createRadialGradient(
            seat.x - 15,
            seat.y - 15,
            5,
            seat.x,
            seat.y,
            SEAT_RADIUS
        );

        gradient.addColorStop(0, "#c84b53");
        gradient.addColorStop(0.65, EMPTY_RED);
        gradient.addColorStop(1, EMPTY_RED_DARK);

        ctx.beginPath();

        ctx.arc(
            seat.x,
            seat.y,
            SEAT_RADIUS - 4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = gradient;
        ctx.fill();

        /*
         * Inner ring.
         */

        ctx.beginPath();

        ctx.arc(
            seat.x,
            seat.y,
            SEAT_RADIUS - 13,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();

        /*
         * Empty seat symbol.
         */

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 34px 'Cormorant Garamond'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            "+",
            seat.x,
            seat.y - 4
        );

        ctx.font = "bold 13px 'Cormorant Garamond'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";

        ctx.fillText(
            "EMPTY",
            seat.x,
            seat.y + 30
        );
    }

    /*
     * =====================================================
     * OCCUPIED SEAT
     * =====================================================
     */

    private async drawOccupiedSeat(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition,
        entry: PressureTablePlayer,
        isActive: boolean
    ): Promise<void> {

        /*
         * Active player gets a green glow.
         */

        if (isActive) {

            ctx.save();

            ctx.shadowColor = "rgba(60, 255, 150, 0.9)";
            ctx.shadowBlur = 32;

            ctx.beginPath();

            ctx.arc(
                seat.x,
                seat.y,
                SEAT_RADIUS + 8,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle = "#4dff9a";
            ctx.lineWidth = 8;
            ctx.stroke();

            ctx.restore();
        }

        /*
         * Standard avatar ring.
         */

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            seat.x,
            seat.y,
            SEAT_RADIUS,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = isActive
            ? "#4dff9a"
            : "rgba(216, 173, 85, 0.8)";

        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.restore();

        /*
         * Avatar.
         */

        if (entry.avatarUrl) {
            try {
                const avatar = await loadImage(entry.avatarUrl);

                ctx.save();

                ctx.beginPath();

                ctx.arc(
                    seat.x,
                    seat.y,
                    SEAT_RADIUS - 6,
                    0,
                    Math.PI * 2
                );

                ctx.clip();

                ctx.drawImage(
                    avatar,
                    seat.x - (SEAT_RADIUS - 6),
                    seat.y - (SEAT_RADIUS - 6),
                    (SEAT_RADIUS - 6) * 2,
                    (SEAT_RADIUS - 6) * 2
                );

                ctx.restore();

            } catch {
                this.drawAvatarFallback(
                    ctx,
                    seat,
                    entry.player.username
                );
            }

        } else {

            this.drawAvatarFallback(
                ctx,
                seat,
                entry.player.username
            );
        }

        /*
         * Username.
         */

        this.drawUsername(
            ctx,
            seat,
            entry.player.username
        );

        /*
         * Balance.
         */

        this.drawBalance(
            ctx,
            seat,
            entry.player.balance
        );

        /*
         * Active indicator.
         */

        if (isActive) {
            this.drawActiveLabel(
                ctx,
                seat
            );
        }
    }

    /*
     * =====================================================
     * AVATAR FALLBACK
     * =====================================================
     */

    private drawAvatarFallback(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition,
        username: string
    ): void {

        const gradient = ctx.createLinearGradient(
            seat.x - SEAT_RADIUS,
            seat.y - SEAT_RADIUS,
            seat.x + SEAT_RADIUS,
            seat.y + SEAT_RADIUS
        );

        gradient.addColorStop(0, "#40516b");
        gradient.addColorStop(1, "#1c2638");

        ctx.beginPath();

        ctx.arc(
            seat.x,
            seat.y,
            SEAT_RADIUS - 7,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = gradient;
        ctx.fill();

        const initial =
            username.trim().charAt(0).toUpperCase() || "?";

        ctx.fillStyle = TEXT_LIGHT;
        ctx.font = "bold 48px 'Cormorant Garamond'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            initial,
            seat.x,
            seat.y
        );
    }

    /*
     * =====================================================
     * USERNAME
     * =====================================================
     */

    private drawUsername(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition,
        username: string
    ): void {

        const displayName =
            username.length > 18
                ? `${username.slice(0, 17)}…`
                : username;

        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.font = "bold 20px 'Cormorant Garamond'";
        ctx.fillStyle = TEXT_LIGHT;

        ctx.fillText(
            displayName,
            seat.x,
            seat.y + SEAT_RADIUS + 13
        );
    }

    /*
     * =====================================================
     * BALANCE
     * =====================================================
     */

    private drawBalance(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition,
        balance: bigint
    ): void {

        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.font = "bold 17px 'Cormorant Garamond'";
        ctx.fillStyle = GOLD_LIGHT;

        ctx.fillText(
            `${this.formatNickel(balance)} Nickel`,
            seat.x,
            seat.y + SEAT_RADIUS + 39
        );
    }

    /*
     * =====================================================
     * ACTIVE LABEL
     * =====================================================
     */

    private drawActiveLabel(
        ctx: CanvasRenderingContext2D,
        seat: SeatPosition
    ): void {

        const width = 100;
        const height = 28;

        const x = seat.x - width / 2;
        const y = seat.y - SEAT_RADIUS - 43;

        this.roundRect(
            ctx,
            x,
            y,
            width,
            height,
            14
        );

        ctx.fillStyle = "rgba(27, 145, 78, 0.95)";
        ctx.fill();

        ctx.strokeStyle = "rgba(105, 255, 170, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 12px 'Cormorant Garamond'";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "YOUR TURN",
            seat.x,
            y + height / 2
        );
    }

    /*
     * =====================================================
     * CENTER
     * =====================================================
     */

    private drawCenter(
        ctx: CanvasRenderingContext2D,
        table: {
            x: number;
            y: number;
            width: number;
            height: number;
        },
        pot: bigint,
        status?: string
    ): void {

        const centerX =
            table.x + table.width / 2;

        const centerY =
            table.y + table.height / 2;

        /*
         * Center decorative circle.
         */

        ctx.save();

        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 20;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            108,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(0, 40, 28, 0.45)";
        ctx.fill();

        ctx.restore();

        /*
         * Outer gold ring.
         */

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            108,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(216, 173, 85, 0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();

        /*
         * POT.
         */

        ctx.textAlign = "center";

        ctx.font = "bold 17px 'Cormorant Garamond'";
        ctx.fillStyle = GOLD_LIGHT;

        ctx.fillText(
            "POT",
            centerX,
            centerY - 34
        );

        ctx.font = "bold 30px 'Cormorant Garamond'";
        ctx.fillStyle = TEXT_LIGHT;

        ctx.fillText(
            this.formatNickel(pot),
            centerX,
            centerY + 4
        );

        ctx.font = "15px 'Cormorant Garamond'";
        ctx.fillStyle = TEXT_MUTED;

        ctx.fillText(
            "Nickel",
            centerX,
            centerY + 31
        );

        /*
         * Optional status.
         */

        if (status) {

            const statusWidth = 210;
            const statusHeight = 32;

            const statusX =
                centerX - statusWidth / 2;

            const statusY =
                centerY + 58;

            this.roundRect(
                ctx,
                statusX,
                statusY,
                statusWidth,
                statusHeight,
                16
            );

            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fill();

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = "bold 12px 'Cormorant Garamond'";
            ctx.fillStyle = TEXT_MUTED;

            ctx.fillText(
                status.toUpperCase(),
                centerX,
                statusY + statusHeight / 2
            );
        }
    }

    /*
     * =====================================================
     * NUMBER FORMATTING
     * =====================================================
     */

    private formatNickel(
        amount: bigint
    ): string {

        return amount
            .toLocaleString("en-US");
    }

    /*
     * =====================================================
     * ROUNDED RECTANGLE
     * =====================================================
     */

    private roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ): void {

        const safeRadius = Math.min(
            radius,
            width / 2,
            height / 2
        );

        ctx.beginPath();

        ctx.moveTo(
            x + safeRadius,
            y
        );

        ctx.lineTo(
            x + width - safeRadius,
            y
        );

        ctx.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + safeRadius
        );

        ctx.lineTo(
            x + width,
            y + height - safeRadius
        );

        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - safeRadius,
            y + height
        );

        ctx.lineTo(
            x + safeRadius,
            y + height
        );

        ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - safeRadius
        );

        ctx.lineTo(
            x,
            y + safeRadius
        );

        ctx.quadraticCurveTo(
            x,
            y,
            x + safeRadius,
            y
        );

        ctx.closePath();
    }
}

END FILE: src/plugins/pressure/services/PressureTableRenderer.ts
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
