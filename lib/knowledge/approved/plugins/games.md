QUILL & INK — TRacebook PROJECT KNOWLEDGE EXPORT
================================================================================

PROJECT METADATA
================================================================================
Project root: C:\Users\acer\quill-and-ink-twin
Generated at: 2026-10-22T14:22:54.418Z
Operating system: win32
Node.js: v24.19.0
Export scope: src/plugins/games
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
- This export is scoped to: src/plugins/games

EXPORT SUMMARY
================================================================================
Files exported: 14
Files excluded or skipped: 0
Original bytes in exported files: 153001
Bytes after redaction: 147198
Lines replaced due to possible sensitive content: 0
Per-file size limit: 5242880 bytes
Maximum files: 20000

CONTENTS
================================================================================
00001. src/plugins/games/GamesPlugin.ts
00002. src/plugins/games/modules/DiceGameModule.ts
00003. src/plugins/games/modules/OddEvenGameModule.ts
00004. src/plugins/games/modules/RpsGameModule.ts
00005. src/plugins/games/modules/SlotsGameModule.ts
00006. src/plugins/games/plugin.json
00007. src/plugins/games/renderers/SlotRenderer.ts
00008. src/plugins/games/services/DiceService.ts
00009. src/plugins/games/services/GameAccessService.ts
00010. src/plugins/games/services/GamesEconomyService.ts
00011. src/plugins/games/services/GamesPayoutService.ts
00012. src/plugins/games/services/OddEvenService.ts
00013. src/plugins/games/services/RpsService.ts
00014. src/plugins/games/services/SlotService.ts

SOURCE FILES
================================================================================

FILE: src/plugins/games/GamesPlugin.ts
--------------------------------------------------------------------------------
Original size: 13367 bytes
Exported size: 12903 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    type ButtonInteraction,
    type Interaction,
    type ModalSubmitInteraction,
    type StringSelectMenuInteraction
} from "discord.js";

import type { Plugin } from "../../core/plugins/Plugin.js";
import type { PluginContext, PluginCommand } from "../../core/plugins/PluginContext.js";

import { PrismaService } from "../../core/database/PrismaService.js";
import { EconomyAccountService } from "../economy/services/EconomyAccountService.js";
import { RobberyHeadquarters } from "../robbery/headquarters/RobberyHeadquarters.js";

import { GamesPayoutService } from "./services/GamesPayoutService.js";

import {
    DiceGameModule
} from "./modules/DiceGameModule.js";

import {
    SlotsGameModule
} from "./modules/SlotsGameModule.js";

import {
    RpsGameModule
} from "./modules/RpsGameModule.js";

import {
    OddEvenGameModule
} from "./modules/OddEvenGameModule.js";

/**
 * Interactions that the game router is responsible for.
 *
 * Slash commands are registered with CommandManager and executed
 * through the existing command infrastructure. This union is for
 * subsequent interactions belonging to an active game.
 */
export type GamesComponentInteraction =
    | ButtonInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction;

/**
 * Dependencies shared by the individual game modules.
 *
 * EconomyAccountService remains responsible for authoritative
 * account operations. GamesPayoutService coordinates game settlement.
 */
export interface GamesModuleDependencies {
    readonly context: PluginContext;
    readonly database: PrismaService;
    readonly economy: EconomyAccountService;
    readonly payouts: GamesPayoutService;

    /**
     * Records a qualifying wager after a successful withdrawal.
     *
     * Game modules must not call this before the wager has actually
     * been collected. Zero-value games must not call it.
     */
    readonly recordQualifyingWager: (
        guildId: string,
        discordId: string
    ) => Promise<void>;
}

/**
 * Contract implemented by each game module.
 *
 * Each module owns its rules, sessions, state transitions,
 * custom interaction IDs, and game-specific presentation.
 */
export interface GamesGameModule {
    readonly id: "dice" | "slots" | "rps" | "odd-even";

    /**
     * Unique namespace for this game's component/modal custom IDs.
     *
     * Examples:
     * games:dice:
     * games:slots:
     * games:rps:
     * games:odd-even:
     */
    readonly customIdPrefix: string;

    /**
     * Slash command registered through the existing plugin command
     * manager. Its execute handler owns the initial command flow.
     */
    readonly command: PluginCommand;

    /**
     * Process a component or modal interaction belonging to this game.
     */
    handleInteraction(
        interaction: GamesComponentInteraction
    ): Promise<void>;

    /**
     * Synchronous cleanup only.
     *
     * PluginManager does not await onUnload(), so cleanup must not
     * depend on asynchronous work finishing later.
     */
    destroy(): void;
}

export class GamesPlugin implements Plugin {
    readonly metadata = {
        id: "games",
        name: "Games",
        version: "2.0.0",
        description:
            "Dice, slots, Rock Paper Scissors, and Odd or Even."
    } as const;

    private context?: PluginContext;
    private modules: GamesGameModule[] = [];

    private interactionListenerRegistered = false;

    private static readonly COMPONENT_PREFIX = "games:";

    register(context: PluginContext): void {
        if (this.context) {
            throw new Error(
                "GAMES_PLUGIN_ALREADY_REGISTERED"
            );
        }

        const database =
            context.services.get<PrismaService>("database");

        if (!database) {
            throw new Error(
                "GAMES_DATABASE_SERVICE_NOT_FOUND"
            );
        }

        const economy =
            new EconomyAccountService(database);

        const payouts =
            new GamesPayoutService(
                database,
                economy
            );

        const dependencies: GamesModuleDependencies = {
            context,
            database,
            economy,
            payouts,

            recordQualifyingWager:
                async (
                    guildId: string,
                    discordId: string
                ): Promise<void> => {
                    await this.recordQualifyingWager(
                        context,
                        guildId,
                        discordId
                    );
                }
        };

        const modules: GamesGameModule[] = [
            new DiceGameModule(dependencies),
            new SlotsGameModule(dependencies),
            new RpsGameModule(dependencies),
            new OddEvenGameModule(dependencies)
        ];

        try {
            this.validateModules(modules);

            for (const module of modules) {
                context.commands.registerCommand(
                    module.command
                );

                context.logger.info(
                    `[Games] Registered /${module.command.data.name}`
                );
            }

            this.modules = modules;
            this.context = context;

            context.on(
                "interactionCreate",
                async (interaction) => {
                    await this.routeInteraction(
                        interaction
                    );
                }
            );

            this.interactionListenerRegistered = true;

            context.logger.info(
                "[Games] Game modules registered successfully."
            );
        } catch (error) {
            for (const module of modules) {
                try {
                    module.destroy();
                } catch {
                    // Preserve the original registration error.
                }
            }

            this.modules = [];
            this.context = undefined;
            this.interactionListenerRegistered = false;

            throw error;
        }
    }

    onLoad(context: PluginContext): void {
        context.logger.info(
            "[Games] Plugin loaded."
        );
    }

    onUnload(context: PluginContext): void {
        /*
         * Game cleanup must remain synchronous because the current
         * PluginManager does not await plugin.onUnload().
         */
        for (const module of this.modules) {
            try {
                module.destroy();
            } catch (error) {
                context.logger.error(
                    `[Games] Failed to clean up ${module.id}.`,
                    error
                );
            }
        }

        this.modules = [];
        this.context = undefined;
        this.interactionListenerRegistered = false;

        context.logger.info(
            "[Games] Plugin unloaded."
        );
    }

    /**
     * Reject duplicate game registrations and malformed routing
     * namespaces before publishing any commands.
     */
    private validateModules(
        modules: readonly GamesGameModule[]
    ): void {
        const moduleIds = new Set<string>();
        const commandNames = new Set<string>();
        const prefixes = new Set<string>();

        for (const module of modules) {
            if (moduleIds.has(module.id)) {
                throw new Error(
                    `GAMES_DUPLICATE_MODULE:${module.id}`
                );
            }

            moduleIds.add(module.id);

            const commandName =
                module.command.data.name.toLowerCase();

            if (commandNames.has(commandName)) {
                throw new Error(
                    `GAMES_DUPLICATE_COMMAND:${commandName}`
                );
            }

            commandNames.add(commandName);

            if (
                !module.customIdPrefix.startsWith(
                    GamesPlugin.COMPONENT_PREFIX
                ) ||
                module.customIdPrefix.length <=
                    GamesPlugin.COMPONENT_PREFIX.length
            ) {
                throw new Error(
                    `GAMES_INVALID_CUSTOM_ID_PREFIX:${module.id}`
                );
            }

            if (prefixes.has(module.customIdPrefix)) {
                throw new Error(
                    `GAMES_DUPLICATE_CUSTOM_ID_PREFIX:${module.customIdPrefix}`
                );
            }

            prefixes.add(module.customIdPrefix);
        }
    }

    /**
     * Routes buttons, string-select menus, and modal submissions.
     *
     * It intentionally does not execute slash commands. Those remain
     * under the existing CommandManager/command-handler contract.
     */
    private async routeInteraction(
        interaction: Interaction
    ): Promise<void> {
        if (
            !interaction.isButton() &&
            !interaction.isModalSubmit() &&
            !interaction.isStringSelectMenu()
        ) {
            return;
        }

        const customId = interaction.customId;

        if (
            !customId.startsWith(
                GamesPlugin.COMPONENT_PREFIX
            )
        ) {
            return;
        }

        const module = this.modules.find(
            (candidate) =>
                customId.startsWith(
                    candidate.customIdPrefix
                )
        );

        if (!module) {
            /*
             * This is likely a stale control from an old game session.
             * Don't respond to unrelated component IDs.
             */
            await this.replyToExpiredInteraction(
                interaction
            );

            return;
        }

        try {
            await module.handleInteraction(
                interaction
            );
        } catch (error) {
            this.context?.logger.error(
                `[Games] Interaction failed for ${module.id}.`,
                error
            );

            await this.replyToInteractionError(
                interaction
            );
        }
    }

    /**
     * Robbery integration is resolved at wager time rather than
     * cached during register(), so registration order does not
     * determine whether the headquarters service can be found.
     *
     * This preserves the existing best-effort behavior: a failure
     * to record a robbery wager is logged and does not reverse an
     * already successful withdrawal.
     */
    private async recordQualifyingWager(
        context: PluginContext,
        guildId: string,
        discordId: string
    ): Promise<void> {
        const headquarters =
            context.services.get<RobberyHeadquarters>(
                "robberyHeadquarters"
            );

        if (!headquarters) {
            context.logger.error(
                "[Games] RobberyHeadquarters service is unavailable; qualifying wager was not recorded."
            );

            return;
        }

        try {
            await headquarters.recordWager(
                guildId,
                discordId
            );
        } catch (error) {
            context.logger.error(
                "[Games] Failed to record qualifying robbery wager.",
                error
            );
        }
    }

    /**
     * A stale control should receive a short, private explanation
     * rather than leaving the user with an interaction failure.
     */
    private async replyToExpiredInteraction(
        interaction: GamesComponentInteraction
    ): Promise<void> {
        try {
            const payload = {
                content:
                    "This game interaction is no longer available. Start a new game to continue.",
                ephemeral: true
            };

            if (
                interaction.deferred ||
                interaction.replied
            ) {
                await interaction.followUp(payload);
            } else {
                await interaction.reply(payload);
            }
        } catch {
            // The interaction may already have expired on Discord.
        }
    }

    private async replyToInteractionError(
        interaction: GamesComponentInteraction
    ): Promise<void> {
        try {
            const payload = {
                content:
                    "Something went wrong while processing this game. Please check the game message before trying again.",
                ephemeral: true
            };

            if (
                interaction.deferred ||
                interaction.replied
            ) {
                await interaction.followUp(payload);
            } else {
                await interaction.reply(payload);
            }
        } catch {
            /*
             * Do not allow a secondary Discord API failure to mask
             * the original game interaction failure.
             */
        }
    }
}


END FILE: src/plugins/games/GamesPlugin.ts
================================================================================

FILE: src/plugins/games/modules/DiceGameModule.ts
--------------------------------------------------------------------------------
Original size: 12996 bytes
Exported size: 12540 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    EmbedBuilder,
    type ChatInputCommandInteraction
} from "discord.js";
import { randomUUID } from "node:crypto";

import type {
    GamesGameModule,
    GamesModuleDependencies
} from "../GamesPlugin.js";

interface DicePrediction {
    type: "exact" | "between";
    target: number;
    target2?: number;
}

interface DiceSession {
    id: string;
    guildId: string;
    playerId: string;
    wager: bigint;
    prediction: DicePrediction;
    status: "playing" | "settling" | "settled";
}

interface DiceRoll {
    firstDie: number;
    secondDie: number;
    total: number;
}

interface DicePayout {
    combinations: number;
    probability: number;
    multiplier: number;
    totalReturn: bigint;
    netProfit: bigint;
}

export class DiceGameModule implements GamesGameModule {
    readonly id = "dice" as const;
    readonly customIdPrefix = "games:dice:";

    readonly command = {
        data: {
            name: "dice",
            toJSON: () => ({
                name: "dice",
                description: "Predict the total of two dice.",
                type: 1,
               
options: [
    {
        type: 3,
        name: "direction",
        description: "Choose an exact number or a range.",
        required: true,
        choices: [
            { name: "Exact number", value: "exact" },
            { name: "Between", value: "between" }
        ]
    },
    {
        type: 4,
        name: "target",
        description: "Exact total or lower end of the range.",
        required: true,
        min_value: 2,
        max_value: 12
    },
    {
        type: 4,
        name: "wager",
        description: "Nickel to wager (20–500).",
        required: true,
        min_value: 20,
        max_value: 500
    },
    {
        type: 4,
        name: "target2",
        description: "Upper end of the range (between only).",
        required: false,
        min_value: 2,
        max_value: 12
    }
]

            })
        },
        execute: async (...args: unknown[]) => {
            const interaction =
                args[0] as ChatInputCommandInteraction;

            await this.startGame(interaction);
        }
    };

    private readonly sessions = new Map<string, DiceSession>();
    private readonly playerSessions = new Map<string, string>();

    constructor(
        private readonly dependencies: GamesModuleDependencies
    ) {}

    async handleInteraction(): Promise<void> {
        // Dice resolves immediately from the slash command.
        // It has no gameplay buttons or modal interactions.
    }

    destroy(): void {
        this.sessions.clear();
        this.playerSessions.clear();
    }

    private async startGame(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "Dice can only be played in a server.",
                ephemeral: true
            });
            return;
        }

        const direction =
            interaction.options.getString("direction", true);

        const target =
            interaction.options.getInteger("target", true);

        const target2 =
            interaction.options.getInteger("target2");

        const wager = BigInt(
            interaction.options.getInteger("wager", true)
        );

        if (wager < 20n || wager > 500n) {
            await interaction.reply({
                content: "Your wager must be between 20 and 500 Nickel.",
                ephemeral: true
            });
            return;
        }

        let prediction: DicePrediction;

        if (direction === "exact") {
            if (target2 !== null) {
                await interaction.reply({
                    content:
                        "The `target2` option is only used with `between`.",
                    ephemeral: true
                });
                return;
            }

            prediction = {
                type: "exact",
                target
            };
        } else if (direction === "between") {
            if (target2 === null) {
                await interaction.reply({
                    content:
                        "Choose `target2` as the upper end of your range.",
                    ephemeral: true
                });
                return;
            }

            if (target2 < target) {
                await interaction.reply({
                    content:
                        "`target2` must be greater than or equal to `target`.",
                    ephemeral: true
                });
                return;
            }

            prediction = {
                type: "between",
                target,
                target2
            };
        } else {
            await interaction.reply({
                content: "Choose either `exact` or `between`.",
                ephemeral: true
            });
            return;
        }

        const playerId = interaction.user.id;
        const guildId = interaction.guildId;
        const playerKey = `${guildId}:${playerId}`;

        if (this.playerSessions.has(playerKey)) {
            await interaction.reply({
                content: "You already have an active Dice game.",
                ephemeral: true
            });
            return;
        }

        const sessionId = randomUUID();

        const session: DiceSession = {
            id: sessionId,
            guildId,
            playerId,
            wager,
            prediction,
            status: "playing"
        };

        this.sessions.set(sessionId, session);
        this.playerSessions.set(playerKey, sessionId);

        let wagerWithdrawn = false;
        let result: DiceRoll | undefined;
        let payout: DicePayout | undefined;
        let won = false;

        try {
            await interaction.deferReply();

            await this.dependencies.payouts.withdrawWager(
                guildId,
                playerId,
                wager
            );

            wagerWithdrawn = true;

            await this.dependencies.recordQualifyingWager(
                guildId,
                playerId
            );

            result = this.rollDice();

            const combinations =
                this.countWinningCombinations(prediction);

            payout = this.calculatePayout(
                wager,
                combinations
            );

            won = this.matchesPrediction(
                result.total,
                prediction
            );

            session.status = "settling";
            
            await this.dependencies.payouts.settleSinglePlayerGame(
    session.id,
    session.guildId,
    session.playerId,
    session.wager,
    won ? payout.totalReturn : 0n,
    won,
);


            session.status = "settled";

            const multiplierText =
                won ? `${payout.multiplier.toFixed(2)}×` : "—";

            const embed = new EmbedBuilder()
                .setColor(won ? 0x35b7a4 : 0x667085)
                .setTitle("Dice")
                .setDescription(
                    won
                        ? "Your prediction was correct."
                        : "The dice didn't land on your prediction."
                )
                .addFields(
                    {
                        name: "Prediction",
                        value: this.formatPrediction(prediction),
                        inline: true
                    },
                    {
                        name: "Dice result",
                        value:
                            `${result.firstDie} + ${result.secondDie} = **${result.total}**`,
                        inline: true
                    },
                    {
                        name: "Wager",
                        value: `${wager.toString()} Nickel`,
                        inline: true
                    },
                    {
                        name: "Multiplier",
                        value: multiplierText,
                        inline: true
                    },
                    {
                        name: "Total return",
                        value:
                            `${(won ? payout.totalReturn : 0n).toString()} Nickel`,
                        inline: true
                    },
                    {
                        name: "Net profit",
                        value:
                            `${(won ? payout.netProfit : -wager).toString()} Nickel`,
                        inline: true
                    }
                )
                .setFooter({
                    text: "Quill & Ink • Games"
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed]
            });
             
        } catch (error) {

            this.dependencies.context.logger.error(
              `[Games:Dice] Game execution or settlement failed: ${
              error instanceof Error ? error.stack ?? error.message : String(error)
               }`
            );

            /*
             * Do not automatically issue a refund here.
             * A failed response can happen after settlement succeeded,
             * and blindly refunding could duplicate the payout.
             */
            const message = wagerWithdrawn
                ? "The game encountered a problem after collecting your wager. Please contact a moderator before retrying."
                : "The game couldn't start. Your wager was not collected.";

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: message,
                    embeds: []
                }).catch(() => undefined);
            } else {
                await interaction.reply({
                    content: message,
                    ephemeral: true
                }).catch(() => undefined);
            }
        } finally {
            this.sessions.delete(sessionId);
            this.playerSessions.delete(playerKey);
        }
    }

    private rollDice(): DiceRoll {
    const firstDie = this.rollDie();
    const secondDie = this.rollDie();

    return {
        firstDie,
        secondDie,
        total: firstDie + secondDie
    };
}

    private rollDie(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    private countWinningCombinations(
        prediction: DicePrediction
    ): number {
        let combinations = 0;

        for (let first = 1; first <= 6; first++) {
            for (let second = 1; second <= 6; second++) {
                const total = first + second;

                if (this.matchesPrediction(total, prediction)) {
                    combinations++;
                }
            }
        }

        return combinations;
    }

    private matchesPrediction(
        total: number,
        prediction: DicePrediction
    ): boolean {
        if (prediction.type === "exact") {
            return total === prediction.target;
        }

        return (
            total >= prediction.target &&
            total <= (prediction.target2 ?? prediction.target)
        );
    }

    private calculatePayout(
        wager: bigint,
        combinations: number
    ): DicePayout {
        if (combinations <= 0) {
            return {
                combinations: 0,
                probability: 0,
                multiplier: 0,
                totalReturn: 0n,
                netProfit: -wager
            };
        }

        const probability = combinations / 36;

        /*
         * Base multiplier = inverse probability, capped at 10×,
         * then halved as agreed. Round down to two decimal places.
         */
        const originalMultiplier = Math.min(
            10,
            Math.floor((36 / combinations) * 100) / 100
        );

        const multiplier =
            Math.floor((originalMultiplier / 2) * 100) / 100;

        const totalReturn =
            (wager * BigInt(Math.round(multiplier * 100))) / 100n;

        return {
            combinations,
            probability,
            multiplier,
            totalReturn,
            netProfit: totalReturn - wager
        };
    }

    private formatPrediction(
        prediction: DicePrediction
    ): string {
        return prediction.type === "exact"
            ? `Exact: **${prediction.target}**`
            : `Between: **${prediction.target}–${prediction.target2}**`;
    }
}

END FILE: src/plugins/games/modules/DiceGameModule.ts
================================================================================

FILE: src/plugins/games/modules/OddEvenGameModule.ts
--------------------------------------------------------------------------------
Original size: 16582 bytes
Exported size: 16038 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";
import { randomUUID } from "node:crypto";
import type {
  GamesGameModule,
  GamesModuleDependencies,
} from "../GamesPlugin.js";

type Side = "odd" | "even";
type GameStage = "choosing-sides" | "choosing-numbers" | "settling";
type NumberChoice = 1 | 2 | 3 | 4 | 5;

interface PlayerState {
  discordId: string;
  username: string;
  side: Side | null;
  number: NumberChoice | null;
}

interface OddEvenSession {
  id: string;
  guildId: string;
  channelId: string;
  messageId: string;
  message: Message;
  wager: bigint;
  players: [PlayerState, PlayerState];
  stage: GameStage;
  createdAt: number;
  expiresAt: number;
  timeout: ReturnType<typeof setTimeout>;
}

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;
const MIN_WAGER = 20;
const MAX_WAGER = 500;
const MAX_SESSIONS = 500;

export class OddEvenGameModule implements GamesGameModule {
  readonly id = "odd-even" as const;
  readonly customIdPrefix = "games:odd-even:";

  readonly command = {
    category: "Games",
    access: "basic" as const,
    data: {
      name: "oddoreven",
      toJSON: () => ({
        name: "oddoreven",
        description: "Challenge a player to Odd or Even.",
        type: 1,
        options: [
          {
            type: 6,
            name: "player",
            description: "The player you want to challenge.",
            required: true,
          },
          {
            type: 4,
            name: "wager",
            description: "Nickel each player wagers (20–500).",
            required: true,
            min_value: MIN_WAGER,
            max_value: MAX_WAGER,
          },
        ],
      }),
    },
    execute: async (...args: unknown[]) => {
      await this.startGame(args[0] as ChatInputCommandInteraction);
    },
  };

  private readonly dependencies: GamesModuleDependencies;
  private readonly sessions = new Map<string, OddEvenSession>();

  constructor(dependencies: GamesModuleDependencies) {
    this.dependencies = dependencies;
  }

  async handleInteraction(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.customId.startsWith(this.customIdPrefix)) return;

    const parts = interaction.customId.split(":");
const sessionId = parts[2];
const action = parts[3];
const value = parts[4];

    if (!sessionId || !action) {
      await this.replyPrivate(interaction, "This game control is invalid.");
      return;
    }

    const session = this.sessions.get(sessionId);

    if (!session || session.stage === "settling") {
      await this.replyPrivate(
        interaction,
        "This Odd or Even game has expired or already finished.",
      );
      return;
    }

    if (Date.now() >= session.expiresAt) {
      await this.expireSession(session);
      await this.replyPrivate(interaction, "This challenge has expired. No wager was collected.");
      return;
    }

    if (interaction.guildId !== session.guildId) {
      await this.replyPrivate(interaction, "This game belongs to a different server.");
      return;
    }

    const player = session.players.find(
      (entry) => entry.discordId === interaction.user.id,
    );

    if (!player) {
      await this.replyPrivate(
        interaction,
        "Only the two challenged players can use these controls.",
      );
      return;
    }

    if (action === "side") {
      if (session.stage !== "choosing-sides") {
        await this.replyPrivate(interaction, "Side selection is already closed.");
        return;
      }

      if (player.side !== null) {
        await this.replyPrivate(interaction, "You've already chosen your side.");
        return;
      }

      if (value !== "odd" && value !== "even") {
        await this.replyPrivate(interaction, "Invalid side selection.");
        return;
      }

      const otherPlayer = session.players.find(
        (entry) => entry.discordId !== player.discordId,
      )!;

      if (otherPlayer.side === value) {
        await this.replyPrivate(
          interaction,
          `Your opponent chose ${value.toUpperCase()}. You must choose ${value === "odd" ? "EVEN" : "ODD"}.`,
        );
        return;
      }

      player.side = value;

      if (session.players.every((entry) => entry.side !== null)) {
        session.stage = "choosing-numbers";
      }

      await interaction.reply({
        content: `You chose **${value.toUpperCase()}**. Now choose your number from 1 to 5. Your choice is private.`,
        components: [this.buildNumberButtons(session.id)],
        ephemeral: true,
      });

      await this.refreshPublicMessage(session);
      return;
    }

    if (action === "number") {
      if (player.side === null || player.number !== null) {
        await this.replyPrivate(
          interaction,
          "You cannot choose a number at this stage, or you've already locked yours in.",
        );
        return;
      }

      const number = Number(value);

      if (!Number.isInteger(number) || number < 1 || number > 5) {
        await this.replyPrivate(interaction, "Choose a number from 1 to 5.");
        return;
      }

      player.number = number as NumberChoice;

      await interaction.update({
        content: `🔒 Your number **${number}** is locked in. Waiting for your opponent.`,
        components: [],
      });

      await this.refreshPublicMessage(session);

      if (session.players.every((entry) => entry.number !== null)) {
        await this.resolveGame(session);
      }

      return;
    }

    await this.replyPrivate(interaction, "Unknown game action.");
  }

  private async startGame(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inGuild() || !interaction.guildId) {
      await interaction.reply({
        content: "Odd or Even can only be played in a server.",
        ephemeral: true,
      });
      return;
    }

    const opponent = interaction.options.getUser("player", true);
    const wagerNumber = interaction.options.getInteger("wager", true);

    if (!Number.isSafeInteger(wagerNumber) || wagerNumber < MIN_WAGER || wagerNumber > MAX_WAGER) {
      await interaction.reply({
        content: `Your wager must be between ${MIN_WAGER} and ${MAX_WAGER} Nickel.`,
        ephemeral: true,
      });
      return;
    }

    if (opponent.bot || opponent.id === interaction.user.id) {
      await interaction.reply({
        content: "Choose another human player.",
        ephemeral: true,
      });
      return;
    }

    if (this.sessions.size >= MAX_SESSIONS) {
      await interaction.reply({
        content: "Too many games are active right now. Try again shortly.",
        ephemeral: true,
      });
      return;
    }

    const id = randomUUID().replaceAll("-", "").slice(0, 16);
    const now = Date.now();

    // The timer is replaced with the actual session timer once the message exists.
    const session = {
      id,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      messageId: "",
      message: null as unknown as Message,
      wager: BigInt(wagerNumber),
      players: [
        {
          discordId: interaction.user.id,
          username: interaction.user.username,
          side: null,
          number: null,
        },
        {
          discordId: opponent.id,
          username: opponent.username,
          side: null,
          number: null,
        },
      ] as [PlayerState, PlayerState],
      stage: "choosing-sides" as GameStage,
      createdAt: now,
      expiresAt: now + SESSION_TIMEOUT_MS,
      timeout: setTimeout(() => undefined, SESSION_TIMEOUT_MS),
    } satisfies OddEvenSession;

    clearTimeout(session.timeout);

    const embed = this.buildChallengeEmbed(session);

    await interaction.reply({
      embeds: [embed],
      components: [this.buildSideButtons(session)],
      allowedMentions: { users: [opponent.id] },
    });

    const message = await interaction.fetchReply();

    session.message = message;
    session.messageId = message.id;
    session.timeout = setTimeout(() => {
      void this.expireSession(session);
    }, SESSION_TIMEOUT_MS);

    this.sessions.set(id, session);
  }

  private async resolveGame(session: OddEvenSession): Promise<void> {
    if (
      session.stage !== "choosing-numbers" ||
      !session.players.every((player) => player.number !== null)
    ) {
      return;
    }

    // Close the session before awaiting database operations to prevent double settlement.
    session.stage = "settling";
    clearTimeout(session.timeout);
    this.sessions.delete(session.id);

    const [first, second] = session.players;
    const total = first.number! + second.number!;
    const winningSide: Side = total % 2 === 0 ? "even" : "odd";
    const winner = session.players.find(
      (player) => player.side === winningSide,
    )!;

    try {
      // Collect both wagers atomically only after both players have locked in.
      await this.dependencies.payouts.withdrawOddEvenPvPWagers(
        session.guildId,
        first.discordId,
        second.discordId,
        session.wager,
      );

      this.dependencies.recordQualifyingWager(session.guildId, first.discordId);
      this.dependencies.recordQualifyingWager(session.guildId, second.discordId);

      const settlement = await this.dependencies.payouts.settleOddEvenPvP(
        session.id,
        session.guildId,
        first.discordId,
        second.discordId,
        session.wager,
        winner.discordId,
      );

      const pot = session.wager * 2n;

      const embed = new EmbedBuilder()
        .setColor(0x39c5bb)
        .setTitle("🎲 Odd or Even — Results")
        .setDescription(
          `**${winner.username}** wins the pot of **${pot.toString()} Nickel**!`,
        )
        .addFields(
          {
            name: first.username,
            value: `Side: **${first.side!.toUpperCase()}**\nNumber: **${first.number}**`,
            inline: true,
          },
          {
            name: second.username,
            value: `Side: **${second.side!.toUpperCase()}**\nNumber: **${second.number}**`,
            inline: true,
          },
          {
            name: "Total",
            value: `${first.number} + ${second.number} = **${total} (${winningSide.toUpperCase()})**`,
            inline: false,
          },
          {
            name: "Pot",
            value: `${pot.toString()} Nickel`,
            inline: true,
          },
          {
            name: "Settlement",
            value: settlement.status === "settled" ? "Completed" : "Already processed",
            inline: true,
          },
        );

      await session.message.edit({ embeds: [embed], components: [] });
    } catch (error) {
      this.dependencies.context.logger.error(
        `[OddEven] Failed to settle session ${session.id}.`,
        error,
      );

      await session.message.edit({
        content:
          "⚠️ The game could not be settled automatically. Please contact a server moderator before retrying.",
        embeds: [],
        components: [],
      });
    }
  }

  private buildChallengeEmbed(session: OddEvenSession): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x39c5bb)
      .setTitle("🎲 Odd or Even Challenge")
      .setDescription(
        `**${session.players[0].username}** challenged **${session.players[1].username}**!\n\n` +
          `**Wager per player:** ${session.wager.toString()} Nickel\n` +
          `**Total pot:** ${(session.wager * 2n).toString()} Nickel\n\n` +
          "Both players must choose opposite sides, then privately lock in a number from **1 to 5**.\n" +
          "The numbers are added together. The matching side wins the entire pot.\n\n" +
          "⏳ This challenge expires in **5 minutes**. No wager is taken before both numbers are locked in.",
      )
      .setFooter({ text: "Choose your side below. Your number will remain private until the result." });
  }

  private buildSideButtons(
    session: OddEvenSession,
  ): ActionRowBuilder<ButtonBuilder> {
    const firstSide = session.players[0].side;
    const secondSide = session.players[1].side;

    const row = new ActionRowBuilder<ButtonBuilder>();

    if (firstSide === null && secondSide === null) {
      row.addComponents(
        this.createSideButton(session.id, "odd"),
        this.createSideButton(session.id, "even"),
      );
      return row;
    }

    const selectedSide = firstSide ?? secondSide;
    const requiredSide: Side = selectedSide === "odd" ? "even" : "odd";

    row.addComponents(
      this.createSideButton(session.id, requiredSide),
    );

    return row;
  }

  private createSideButton(
    sessionId: string,
    side: Side,
  ): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(`${this.customIdPrefix}${sessionId}:side:${side}`)
      .setLabel(side === "odd" ? "Odd" : "Even")
      .setStyle(side === "odd" ? ButtonStyle.Primary : ButtonStyle.Success);
  }

  private buildNumberButtons(
    sessionId: string,
  ): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      ...([1, 2, 3, 4, 5] as const).map((number) =>
        new ButtonBuilder()
          .setCustomId(`${this.customIdPrefix}${sessionId}:number:${number}`)
          .setLabel(String(number))
          .setStyle(ButtonStyle.Secondary),
      ),
    );
  }

  private async refreshPublicMessage(
    session: OddEvenSession,
  ): Promise<void> {
    if (session.stage === "settling") return;

    const allSidesChosen = session.players.every(
      (player) => player.side !== null,
    );

    if (allSidesChosen) {
      session.stage = "choosing-numbers";
    }

    const embed = this.buildChallengeEmbed(session)
      .setDescription(
        `**${session.players[0].username}** vs **${session.players[1].username}**\n\n` +
          `**Wager per player:** ${session.wager.toString()} Nickel\n` +
          `**Total pot:** ${(session.wager * 2n).toString()} Nickel\n\n` +
          session.players
            .map((player) =>
              `${player.username}: ${player.side ? `**${player.side.toUpperCase()}** selected` : "choosing a side"} · ${player.number !== null ? "🔒 Number locked in" : "number not locked in"}`,
            )
            .join("\n") +
          "\n\n" +
          (allSidesChosen
            ? "Both sides are locked. Each player must choose a number privately."
            : "Both players must choose opposite sides.") +
          "\n\n⏳ Expires in 5 minutes. No wager is taken until both numbers are locked in.",
      );

    await session.message.edit({
      embeds: [embed],
      components:
        session.stage === "choosing-sides"
          ? [this.buildSideButtons(session)]
          : [],
    });
  }

  private async expireSession(session: OddEvenSession): Promise<void> {
    if (!this.sessions.has(session.id) || session.stage === "settling") {
      return;
    }

    this.sessions.delete(session.id);
    clearTimeout(session.timeout);

    try {
      await session.message.edit({
        content: "⌛ This Odd or Even challenge expired. No Nickel was collected.",
        embeds: [],
        components: [],
      });
    }catch (error) {
      
            this.dependencies.context.logger.error(
              `[Games:Dice] Game execution or settlement failed: ${
              error instanceof Error ? error.stack ?? error.message : String(error)
               }`
            );
  
}
  }

  private async replyPrivate(
    interaction: ButtonInteraction,
    content: string,
  ): Promise<void> {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content, ephemeral: true });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  }

  destroy(): void {
    for (const session of this.sessions.values()) {
      clearTimeout(session.timeout);
    }

    this.sessions.clear();
  }
}


END FILE: src/plugins/games/modules/OddEvenGameModule.ts
================================================================================

FILE: src/plugins/games/modules/RpsGameModule.ts
--------------------------------------------------------------------------------
Original size: 15295 bytes
Exported size: 14786 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import { randomUUID } from "node:crypto";
import type {
  GamesGameModule,
  GamesModuleDependencies,
} from "../GamesPlugin.js";

type RpsMove = "rock" | "paper" | "scissors";
type RpsMode = "pvp" | "pvb";

interface RpsSession {
  id: string;
  guildId: string;
  challengerId: string;
  challengerName: string;
  challengerMove: RpsMove;
  opponentId: string | null;
  opponentName: string;
  wager: bigint;
  mode: RpsMode;
  messageId: string;
  channelId: string;
  createdAt: number;
  settled: boolean;
}

const MOVE_LABELS: Record<RpsMove, string> = {
  rock: "🪨 Rock",
  paper: "📄 Paper",
  scissors: "✂️ Scissors",
};

const MOVE_CHOICES = [
  { name: "Rock", value: "rock" },
  { name: "Paper", value: "paper" },
  { name: "Scissors", value: "scissors" },
] as const;

const SESSION_TIMEOUT_MS = 60_000;
const MAX_SESSIONS = 500;

export class RpsGameModule implements GamesGameModule {
  readonly id = "rps" as const;
  readonly customIdPrefix = "games:rps:";

  readonly command = {
    category: "Games",
    access: "basic" as const,
    data: {
      name: "rps",
      toJSON: () => ({
        name: "rps",
        description: "Play Rock, Paper, Scissors for Nickel.",
        type: 1,
        options: [
          {
            type: 4,
            name: "wager",
            description: "Nickel to wager (50–1000).",
            required: true,
            min_value: 50,
            max_value: 1000,
          },
          {
            type: 3,
            name: "mode",
            description: "Choose a player or the bank as your opponent.",
            required: true,
            choices: [
              { name: "Player vs Player", value: "pvp" },
              { name: "Player vs Bank", value: "pvb" },
            ],
          },
          {
            type: 3,
            name: "choice",
            description: "Choose your move.",
            required: true,
            choices: [...MOVE_CHOICES],
          },
          {
            type: 6,
            name: "player",
            description: "Player to challenge (required for PvP).",
            required: false,
          },
        ],
      }),
    },
    execute: async (...args: unknown[]) => {
      const interaction = args[0] as ChatInputCommandInteraction;
      await this.startGame(interaction);
    },
  };

  private readonly sessions = new Map<string, RpsSession>();
  private readonly dependencies: GamesModuleDependencies;

  constructor(dependencies: GamesModuleDependencies) {
    this.dependencies = dependencies;
  }

  async handleInteraction(
    interaction: ButtonInteraction,
  ): Promise<void> {
    if (!interaction.customId.startsWith(this.customIdPrefix)) return;

    const [, , sessionId, selectedMove] = interaction.customId.split(":");

    if (
      !sessionId ||
      !selectedMove ||
      !this.isMove(selectedMove)
    ) {
      await interaction.reply({
        content: "That RPS control is invalid or expired. Start a new game.",
        ephemeral: true,
      });
      return;
    }

    const session = this.sessions.get(sessionId);

    if (!session || session.settled) {
      await interaction.reply({
        content: "This RPS game has expired or already finished.",
        ephemeral: true,
      });
      return;
    }

    if (Date.now() - session.createdAt >= SESSION_TIMEOUT_MS) {
      this.sessions.delete(sessionId);
      await interaction.update({
        content: "⌛ This RPS challenge expired. No wager was collected.",
        embeds: [],
        components: [],
      });
      return;
    }

    if (session.mode !== "pvp" || interaction.user.id !== session.opponentId) {
      await interaction.reply({
        content: "These move buttons are reserved for the challenged player.",
        ephemeral: true,
      });
      return;
    }

    if (interaction.guildId !== session.guildId) {
      await interaction.reply({
        content: "This game belongs to a different server.",
        ephemeral: true,
      });
      return;
    }

    // Lock the session before any asynchronous settlement work.
    session.settled = true;
    this.sessions.delete(sessionId);

    await interaction.update({
      content: `⚔️ ${interaction.user.username} chose **${MOVE_LABELS[selectedMove]}**. Resolving the match…`,
      components: [],
    });

    try {
      await this.dependencies.payouts.withdrawRpsPvPWagers(
        session.guildId,
        session.challengerId,
        session.opponentId,
        session.wager,
      );

      this.dependencies.recordQualifyingWager(
        session.guildId,
        session.challengerId,
      );
      this.dependencies.recordQualifyingWager(
        session.guildId,
        session.opponentId,
      );

      const outcome = this.getOutcome(
        session.challengerMove,
        selectedMove,
      );

      const winnerId =
        outcome === "draw"
          ? null
          : outcome === "challenger"
            ? session.challengerId
            : session.opponentId;

      const settlement = await this.dependencies.payouts.settleRpsPvP(
        session.id,
        session.guildId,
        session.challengerId,
        session.opponentId,
        session.wager,
        winnerId,
      );

      const embed = this.buildPvPResult(
        session,
        interaction.user.username,
        selectedMove,
        outcome,
        settlement.status,
      );

      await interaction.editReply({ content: "", embeds: [embed] });
    } catch (error) {
      this.dependencies.context.logger.error(
        `[RPS] Failed to resolve session ${session.id}.`,
        error,
      );

      await interaction.editReply({
        content:
          "⚠️ The match could not be completed automatically. Please contact a server moderator before retrying.",
        embeds: [],
        components: [],
      });
    }
  }

  private async startGame(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inGuild() || !interaction.guildId) {
      await interaction.reply({
        content: "RPS can only be played in a server.",
        ephemeral: true,
      });
      return;
    }

    const guildId = interaction.guildId;
    const wagerNumber = interaction.options.getInteger("wager", true);
    const mode = interaction.options.getString("mode", true) as RpsMode;
    const move = interaction.options.getString("choice", true);
    const opponent = interaction.options.getUser("player");

    if (!this.isMove(move)) {
      await interaction.reply({
        content: "Choose Rock, Paper, or Scissors.",
        ephemeral: true,
      });
      return;
    }

    if (!Number.isSafeInteger(wagerNumber) || wagerNumber < 50 || wagerNumber > 1000) {
      await interaction.reply({
        content: "Your wager must be between 50 and 1000 Nickel.",
        ephemeral: true,
      });
      return;
    }

    if (mode !== "pvp" && mode !== "pvb") {
      await interaction.reply({
        content: "Choose either Player vs Player or Player vs Bank.",
        ephemeral: true,
      });
      return;
    }

    if (mode === "pvp") {
      if (!opponent) {
        await interaction.reply({
          content: "Please tag a player when choosing Player vs Player.",
          ephemeral: true,
        });
        return;
      }

      if (opponent.bot || opponent.id === interaction.user.id) {
        await interaction.reply({
          content: "Choose another human player for your challenge.",
          ephemeral: true,
        });
        return;
      }

      if (this.sessions.size >= MAX_SESSIONS) {
        await interaction.reply({
          content: "Too many RPS games are active right now. Try again shortly.",
          ephemeral: true,
        });
        return;
      }

      const sessionId = randomUUID().replaceAll("-", "").slice(0, 16);
      const session: RpsSession = {
        id: sessionId,
        guildId,
        challengerId: interaction.user.id,
        challengerName: interaction.user.username,
        challengerMove: move,
        opponentId: opponent.id,
        opponentName: opponent.username,
        wager: BigInt(wagerNumber),
        mode,
        messageId: "",
        channelId: interaction.channelId ?? "",
        createdAt: Date.now(),
        settled: false,
      };

      this.sessions.set(sessionId, session);

      const embed = new EmbedBuilder()
        .setColor(0x39c5bb)
        .setTitle("⚔️ Rock, Paper, Scissors")
        .setDescription(
          `**${interaction.user.username}** has challenged **${opponent.username}**!\n\n` +
            `**Wager per player:** ${wagerNumber.toLocaleString()} Nickel\n` +
            `**Your move:** ${MOVE_LABELS[move]}\n\n` +
            `<@${opponent.id}>, choose your move below. Only you can use these buttons.\n` +
            `This challenge expires in 60 seconds.`,
        )
        .setFooter({ text: "The wager is collected only after the opponent chooses." });

      try {
        await interaction.reply({
          embeds: [embed],
          components: [this.buildMoveButtons(sessionId)],
          allowedMentions: { users: [opponent.id] },
        });

        const message = await interaction.fetchReply();
        session.messageId = message.id;
      } catch (error) {
        this.sessions.delete(sessionId);
        throw error;
      }

      return;
    }

    // PvB: collect the wager, record it, then resolve the bank's move.
    await interaction.deferReply();

    try {
      const wager = BigInt(wagerNumber);

      await this.dependencies.payouts.withdrawWager(
        guildId,
        interaction.user.id,
        wager,
      );

      this.dependencies.recordQualifyingWager(guildId, interaction.user.id);

      const bankMove = this.randomMove();
      const outcome = this.getOutcome(move, bankMove);
      const payout =
        outcome === "challenger"
          ? wager * 2n
          : outcome === "draw"
            ? wager
            : 0n;

      const settlement = await this.dependencies.payouts.settleRpsAgainstBank(
        `rps-bank-${randomUUID()}`,
        guildId,
        interaction.user.id,
        wager,
        payout,
        outcome === "challenger" ? "win" : outcome === "draw" ? "draw" : "loss",
      );

      const embed = new EmbedBuilder()
        .setColor(outcome === "challenger" ? 0x57f287 : outcome === "draw" ? 0xfee75c : 0xed4245)
        .setTitle("🎮 Rock, Paper, Scissors — vs Bank")
        .addFields(
          { name: "Your move", value: MOVE_LABELS[move], inline: true },
          { name: "Bank's move", value: MOVE_LABELS[bankMove], inline: true },
          { name: "Wager", value: `${wagerNumber.toLocaleString()} Nickel`, inline: true },
          {
            name: "Result",
            value:
              outcome === "challenger"
                ? "🎉 You won! Your total return is 2× your wager."
                : outcome === "draw"
                  ? "🤝 It's a draw. Your wager has been returned."
                  : "💔 The bank won this round.",
          },
          {
            name: "Settlement",
            value: settlement.status === "settled" ? "Completed" : "Already processed",
            inline: true,
          },
        )
        .setFooter({ text: "Choose your move before the bank reveals its own." });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      
            this.dependencies.context.logger.error(
              `[Games:Dice] Game execution or settlement failed: ${
              error instanceof Error ? error.stack ?? error.message : String(error)
               }`
            );
            
      await interaction.editReply({
        content:
          "⚠️ The game could not be completed automatically. Please contact a server moderator before retrying.",
        embeds: [],
      });
    }
  }

  private buildMoveButtons(
    sessionId: string,
  ): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`${this.customIdPrefix}${sessionId}:rock`)
        .setLabel("Rock")
        .setEmoji("🪨")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`${this.customIdPrefix}${sessionId}:paper`)
        .setLabel("Paper")
        .setEmoji("📄")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`${this.customIdPrefix}${sessionId}:scissors`)
        .setLabel("Scissors")
        .setEmoji("✂️")
        .setStyle(ButtonStyle.Primary),
    );
  }

  private buildPvPResult(
    session: RpsSession,
    opponentName: string,
    opponentMove: RpsMove,
    outcome: "challenger" | "opponent" | "draw",
    settlementStatus: string,
  ): EmbedBuilder {
    const winner =
      outcome === "draw"
        ? "🤝 It's a draw. Both wagers have been returned."
        : outcome === "challenger"
          ? `🏆 **${session.challengerName}** wins the pot of ${(session.wager * 2n).toString()} Nickel!`
          : `🏆 **${opponentName}** wins the pot of ${(session.wager * 2n).toString()} Nickel!`;

    return new EmbedBuilder()
      .setColor(outcome === "draw" ? 0xfee75c : 0x39c5bb)
      .setTitle("🎮 Rock, Paper, Scissors — Result")
      .addFields(
        {
          name: session.challengerName,
          value: MOVE_LABELS[session.challengerMove],
          inline: true,
        },
        {
          name: opponentName,
          value: MOVE_LABELS[opponentMove],
          inline: true,
        },
        {
          name: "Wager per player",
          value: `${session.wager.toString()} Nickel`,
          inline: true,
        },
        { name: "Outcome", value: winner },
        { name: "Settlement", value: settlementStatus },
      );
  }

  private getOutcome(
    challengerMove: RpsMove,
    opponentMove: RpsMove,
  ): "challenger" | "opponent" | "draw" {
    if (challengerMove === opponentMove) return "draw";

    const challengerWins =
      (challengerMove === "rock" && opponentMove === "scissors") ||
      (challengerMove === "paper" && opponentMove === "rock") ||
      (challengerMove === "scissors" && opponentMove === "paper");

    return challengerWins ? "challenger" : "opponent";
  }

  private randomMove(): RpsMove {
    const moves: RpsMove[] = ["rock", "paper", "scissors"];
    return moves[Math.floor(Math.random() * moves.length)]!;
  }

  private isMove(value: string): value is RpsMove {
    return value === "rock" || value === "paper" || value === "scissors";
  }

  destroy(): void {
    this.sessions.clear();
  }
}

END FILE: src/plugins/games/modules/RpsGameModule.ts
================================================================================

FILE: src/plugins/games/modules/SlotsGameModule.ts
--------------------------------------------------------------------------------
Original size: 9926 bytes
Exported size: 9628 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import {
    AttachmentBuilder,
    EmbedBuilder,
    type ChatInputCommandInteraction
} from "discord.js";
import { randomUUID } from "node:crypto";

import type {
    GamesGameModule,
    GamesModuleDependencies
} from "../GamesPlugin.js";

import { SlotRenderer } from "../renderers/SlotRenderer.js";
import { SlotService } from "../services/SlotService.js";

interface SlotSession {
    id: string;
    guildId: string;
    playerId: string;
    wager: bigint;
    status: "playing" | "settling" | "settled";
}

export class SlotsGameModule implements GamesGameModule {
    readonly id = "slots" as const;
    readonly customIdPrefix = "games:slots:";

    readonly command = {
        data: {
            name: "slots",
            toJSON: () => ({
                name: "slots",
                description: "Spin the Quill & Ink slots.",
                type: 1,
                options: [
                    {
                        type: 4,
                        name: "wager",
                        description: "Nickel to wager (20–500).",
                        required: true,
                        min_value: 20,
                        max_value: 500
                    }
                ]
            })
        },
        execute: async (...args: unknown[]) => {
            const interaction =
                args[0] as ChatInputCommandInteraction;

            await this.startGame(interaction);
        }
    };

    private readonly sessions = new Map<string, SlotSession>();
    private readonly playerSessions = new Map<string, string>();

    private readonly slotService = new SlotService();
    private readonly slotRenderer = new SlotRenderer();

    constructor(
        private readonly dependencies: GamesModuleDependencies
    ) {}

    async handleInteraction(): Promise<void> {
        // Slots resolves immediately from its slash command.
    }

    destroy(): void {
        this.sessions.clear();
        this.playerSessions.clear();
    }

    private async startGame(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
        if (!interaction.inGuild() || !interaction.guildId) {
            await interaction.reply({
                content: "Slots can only be played in a server.",
                ephemeral: true
            });
            return;
        }

        const wager = BigInt(
            interaction.options.getInteger("wager", true)
        );

        if (wager < 20n || wager > 500n) {
            await interaction.reply({
                content: "Your wager must be between 20 and 500 Nickel.",
                ephemeral: true
            });
            return;
        }

        const guildId = interaction.guildId;
        const playerId = interaction.user.id;
        const playerKey = `${guildId}:${playerId}`;

        if (this.playerSessions.has(playerKey)) {
            await interaction.reply({
                content: "You already have an active Slots game.",
                ephemeral: true
            });
            return;
        }

        const sessionId = randomUUID();

        const session: SlotSession = {
            id: sessionId,
            guildId,
            playerId,
            wager,
            status: "playing"
        };

        this.sessions.set(sessionId, session);
        this.playerSessions.set(playerKey, sessionId);

        let wagerWithdrawn = false;
        let settlementCompleted = false;

        try {
            await interaction.deferReply();

            // Withdraw the wager before generating the result.
            await this.dependencies.payouts.withdrawWager(
                guildId,
                playerId,
                wager
            );

            wagerWithdrawn = true;

            await this.dependencies.recordQualifyingWager(
                guildId,
                playerId
            );

            // SlotService owns the outcome and payout calculations.
            const result = this.slotService.spin(wager);
            const won = result.payout > 0n;

            session.status = "settling";
             
            await this.dependencies.payouts.settleSinglePlayerGame(
    sessionId,
    guildId,
    playerId,
    wager,
    result.payout,
    won
);

            settlementCompleted = true;
            session.status = "settled";

            const embed = new EmbedBuilder()
                .setColor(won ? 0x35b7a4 : 0x667085)
                .setTitle("Quill & Ink • Slots")
                .setDescription(
                    won
                        ? "A winning combination!"
                        : "No matching combination this time."
                )
                .addFields(
                    {
                        name: "Wager",
                        value: `${wager.toString()} Nickel`,
                        inline: true
                    },
                    {
                        name: "Combination",
                        value: result.winningSymbol
                            ? `${this.slotService.getSymbolName(result.winningSymbol)} × ${result.winningCount}`
                            : "No match",
                        inline: true
                    },
                    {
                        name: "Multiplier",
                        value: won
                            ? `${result.multiplier.toFixed(2)}×`
                            : "—",
                        inline: true
                    },
                    {
                        name: "Total return",
                        value: `${result.payout.toString()} Nickel`,
                        inline: true
                    },
                    {
                        name: "Net profit",
                        value: `${(result.payout - wager).toString()} Nickel`,
                        inline: true
                    }
                )
                .setFooter({
                    text: "Quill & Ink • Games"
                })
                .setTimestamp();

            // Rendering is presentation only. A renderer failure must
            // not cause the wager to be withdrawn or settled again.
            try {
                const rendered = await this.slotRenderer.render(
                    result.reels
                );

                const attachment = new AttachmentBuilder(
                    rendered.buffer,
                    { name: "slots.png" }
                );

                embed
                    .setImage("attachment://slots.png")
                    .addFields({
                        name: "Reels",
                        value: result.reels
                            .map(
                                (symbol) =>
                                    this.slotService.getSymbolEmoji(symbol)
                            )
                            .join("  │  "),
                        inline: false
                    });

                await interaction.editReply({
                    embeds: [embed],
                    files: [attachment]
                });
            } catch (renderError) {
                this.dependencies.context.logger.error(
                    "[Games:Slots] Rendering or image delivery failed.",
                    renderError
                );

                // The game is already settled. Show a text-only result
                // rather than attempting another withdrawal or payout.
                embed
                    .setDescription(
                        won
                            ? "A winning combination! The slot artwork could not be displayed."
                            : "No matching combination this time. The slot artwork could not be displayed."
                    )
                    .addFields({
                        name: "Reels",
                        value: result.reels
                            .map(
                                (symbol) =>
                                    this.slotService.getSymbolEmoji(symbol)
                            )
                            .join("  │  "),
                        inline: false
                    });

                await interaction.editReply({
                    embeds: [embed],
                    files: []
                });
            }
        } catch (error) {
            
            this.dependencies.context.logger.error(
              `[Games:Dice] Game execution or settlement failed: ${
              error instanceof Error ? error.stack ?? error.message : String(error)
               }`
            );
            
            let message: string;

            if (settlementCompleted) {
                message =
                    "Your Slots game was settled, but the result could not be delivered. Please check your balance before retrying.";
            } else if (wagerWithdrawn) {
                message =
                    "Slots encountered a problem after collecting your wager. The settlement status may need to be checked by a moderator. Please do not retry until it has been verified.";
            } else {
                message =
                    "Slots couldn't start. Your wager was not collected.";
            }

            await interaction.editReply({
                content: message,
                embeds: [],
                files: []
            }).catch(() => undefined);
        } finally {
            this.sessions.delete(sessionId);

            if (this.playerSessions.get(playerKey) === sessionId) {
                this.playerSessions.delete(playerKey);
            }
        }
    }
}


END FILE: src/plugins/games/modules/SlotsGameModule.ts
================================================================================

FILE: src/plugins/games/plugin.json
--------------------------------------------------------------------------------
Original size: 115 bytes
Exported size: 111 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
{
    "name": "Games",
    "version": "1.0.0",
    "description": "Games and gambling system for Quill & Ink"
}

END FILE: src/plugins/games/plugin.json
================================================================================

FILE: src/plugins/games/renderers/SlotRenderer.ts
--------------------------------------------------------------------------------
Original size: 25213 bytes
Exported size: 24337 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import sharp from "sharp";

export type SlotRenderSymbol =
    | "mask"
    | "scroll"
    | "inkbottle"
    | "quill"
    | "crown";

export interface SlotRenderResult {
    buffer: Buffer;
    width: number;
    height: number;
}

/*
 * =========================================================
 * PREMIUM QUILL & INK SLOT RENDERER
 * =========================================================
 *
 * Responsibilities:
 *
 * - Render the premium slot-machine UI.
 * - Render symbol artwork as image assets.
 * - Keep symbol sizing consistent.
 * - Cache downloaded assets.
 * - Prevent duplicate simultaneous downloads.
 *
 * This renderer does NOT:
 *
 * - handle Discord interactions
 * - access the database
 * - modify balances
 * - perform slot calculations
 * - depend on Discord.js
 *
 * SlotService remains responsible for game logic.
 * GamesPlugin remains responsible for Discord/economy logic.
 */

export class SlotRenderer {

    /*
     * =========================================================
     * CANVAS
     * =========================================================
     */

    private readonly width = 1000;

    private readonly height = 420;

    /*
     * =========================================================
     * REELS
     * =========================================================
     */

    private readonly reelWidth = 240;

    private readonly reelHeight = 250;

    private readonly reelY = 85;

    private readonly reelPositions = [
        130,
        380,
        630
    ] as const;

    /*
     * =========================================================
     * SYMBOL
     * =========================================================
     *
     * The game internally uses stable SlotSymbol identifiers.
     *
     * The renderer translates those identifiers into Twemoji
     * assets.
     *
     * IMPORTANT:
     *
     * "inkbottle" previously used 🖋️ (fountain pen), which was
     * visually incorrect.
     *
     * It now uses 🫙 as an ink-jar style representation.
     *
     * The internal game symbol remains "inkbottle" so no other
     * part of the slot system needs to change.
     */

    private readonly emojiCodes:
        Record<SlotRenderSymbol, string>= {

        mask:
            "1f3ad",

        scroll:
            "1f4dc",

        inkbottle:
            "1fad9",

        quill:
            "1fab6",

        crown:
            "1f451"
    };

    /*
     * =========================================================
     * SYMBOL SIZE
     * =========================================================
     */

    private readonly symbolSize = 150;

    /*
     * =========================================================
     * EMOJI CACHE
     * =========================================================
     *
     * Downloaded assets remain cached for the lifetime of the
     * renderer.
     *
     * This avoids downloading the same artwork for every spin.
     */

    private readonly emojiCache =
        new Map<SlotRenderSymbol, Buffer>();

    /*
     * Prevent multiple simultaneous downloads of the same
     * symbol when several players spin at once.
     */

    private readonly emojiRequests =
        new Map<SlotRenderSymbol, Promise<Buffer>>();

    /*
     * =========================================================
     * TWEMOJI SOURCE
     * =========================================================
     */

    private readonly emojiBaseUrl =
        "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/";

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    async render(
        symbols: [
             SlotRenderSymbol,
             SlotRenderSymbol,
             SlotRenderSymbol
        ]
    ): Promise<SlotRenderResult> {

        /*
         * =====================================================
         * LOAD SYMBOL ASSETS
         * =====================================================
         */

        const emojiBuffers =
            await Promise.all(
                symbols.map(
                    symbol =>
                        this.getEmojiAsset(
                            symbol
                        )
                )
            );

        /*
         * =====================================================
         * CREATE MACHINE
         * =====================================================
         */

        const svg =
            this.createMachineSvg();

        const base =
            await sharp(
                Buffer.from(svg)
            )
                .png()
                .toBuffer();

        /*
         * =====================================================
         * COMPOSITE SYMBOLS
         * =====================================================
         */

        const composite =
            await Promise.all(

                emojiBuffers.map(
                    async (
                        emojiBuffer,
                        index
                    ) => {

                        const prepared =
                            await this.prepareEmoji(
                                emojiBuffer
                            );

                        const left =
                            this.reelPositions[index] +
                            Math.floor(
                                (
                                    this.reelWidth -
                                    this.symbolSize
                                ) / 2
                            );

                        const top =
                            this.reelY +
                            Math.floor(
                                (
                                    this.reelHeight -
                                    this.symbolSize
                                ) / 2
                            );

                        return {
                            input:
                                prepared,

                            left,

                            top
                        };
                    }
                )
            );

        /*
         * =====================================================
         * FINAL IMAGE
         * =====================================================
         */

        const buffer =
            await sharp(
                base
            )
                .composite(
                    composite
                )
                .png()
                .toBuffer();

        return {
            buffer,

            width:
                this.width,

            height:
                this.height
        };
    }

    /*
     * =========================================================
     * MACHINE SVG
     * =========================================================
     */

    private createMachineSvg(): string {

        return `
            <svg
                width="${this.width}"
                height="${this.height}"
                viewBox="0 0 ${this.width} ${this.height}"
                xmlns="http://www.w3.org/2000/svg"
            >

                <defs>

                    <!-- ===================================== -->
                    <!-- MACHINE SHADOW -->
                    <!-- ===================================== -->

                    <filter
                        id="machineShadow"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="170%"
                    >

                        <feDropShadow
                            dx="0"
                            dy="14"
                            stdDeviation="14"
                            flood-color="#000000"
                            flood-opacity="0.8"
                        />

                    </filter>

                    <!-- ===================================== -->
                    <!-- REEL SHADOW -->
                    <!-- ===================================== -->

                    <filter
                        id="reelShadow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="150%"
                    >

                        <feDropShadow
                            dx="0"
                            dy="7"
                            stdDeviation="7"
                            flood-color="#000000"
                            flood-opacity="0.75"
                        />

                    </filter>

                    <!-- ===================================== -->
                    <!-- GOLD -->
                    <!-- ===================================== -->

                    <linearGradient
                        id="goldGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#76500f"
                        />

                        <stop
                            offset="22%"
                            stop-color="#c99a32"
                        />

                        <stop
                            offset="45%"
                            stop-color="#ffe89a"
                        />

                        <stop
                            offset="55%"
                            stop-color="#fff4c4"
                        />

                        <stop
                            offset="75%"
                            stop-color="#d1a23c"
                        />

                        <stop
                            offset="100%"
                            stop-color="#68460b"
                        />

                    </linearGradient>

                    <!-- ===================================== -->
                    <!-- MACHINE -->
                    <!-- ===================================== -->

                    <linearGradient
                        id="machineGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#292929"
                        />

                        <stop
                            offset="40%"
                            stop-color="#151515"
                        />

                        <stop
                            offset="75%"
                            stop-color="#090909"
                        />

                        <stop
                            offset="100%"
                            stop-color="#030303"
                        />

                    </linearGradient>

                    <!-- ===================================== -->
                    <!-- REEL -->
                    <!-- ===================================== -->

                    <linearGradient
                        id="reelGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#202020"
                        />

                        <stop
                            offset="20%"
                            stop-color="#111111"
                        />

                        <stop
                            offset="50%"
                            stop-color="#050505"
                        />

                        <stop
                            offset="80%"
                            stop-color="#0b0b0b"
                        />

                        <stop
                            offset="100%"
                            stop-color="#191919"
                        />

                    </linearGradient>

                    <!-- ===================================== -->
                    <!-- REEL HIGHLIGHT -->
                    <!-- ===================================== -->

                    <linearGradient
                        id="reelHighlight"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#ffffff"
                            stop-opacity="0.10"
                        />

                        <stop
                            offset="100%"
                            stop-color="#ffffff"
                            stop-opacity="0"
                        />

                    </linearGradient>

                    <!-- ===================================== -->
                    <!-- SYMBOL GLOW -->
                    <!-- ===================================== -->

                    <radialGradient
                        id="symbolGlow"
                    >

                        <stop
                            offset="0%"
                            stop-color="#f4d27a"
                            stop-opacity="0.20"
                        />

                        <stop
                            offset="55%"
                            stop-color="#d8a83e"
                            stop-opacity="0.07"
                        />

                        <stop
                            offset="100%"
                            stop-color="#000000"
                            stop-opacity="0"
                        />

                    </radialGradient>

                </defs>

                <!-- ================================================= -->
                <!-- BACKGROUND -->
                <!-- ================================================= -->

                <rect
                    width="${this.width}"
                    height="${this.height}"
                    fill="#020202"
                />

                <!-- ================================================= -->
                <!-- MACHINE BODY -->
                <!-- ================================================= -->

                <rect
                    x="35"
                    y="30"
                    width="${this.width - 70}"
                    height="${this.height - 60}"
                    rx="38"
                    fill="url(#machineGradient)"
                    stroke="#3b3b3b"
                    stroke-width="3"
                    filter="url(#machineShadow)"
                />

                <rect
                    x="48"
                    y="43"
                    width="${this.width - 96}"
                    height="${this.height - 86}"
                    rx="31"
                    fill="#070707"
                    stroke="#000000"
                    stroke-width="2"
                />

                <!-- ================================================= -->
                <!-- TOP ORNAMENT -->
                <!-- ================================================= -->

                <circle
                    cx="235"
                    cy="54"
                    r="5"
                    fill="#f5d77f"
                />

                <rect
                    x="250"
                    y="52"
                    width="500"
                    height="5"
                    rx="2.5"
                    fill="url(#goldGradient)"
                />

                <circle
                    cx="765"
                    cy="54"
                    r="5"
                    fill="#f5d77f"
                />

                <!-- ================================================= -->
                <!-- MAIN REEL FRAME -->
                <!-- ================================================= -->

                <rect
                    x="96"
                    y="61"
                    width="808"
                    height="298"
                    rx="31"
                    fill="#020202"
                    stroke="#60450f"
                    stroke-width="3"
                />

                <rect
                    x="100"
                    y="65"
                    width="800"
                    height="290"
                    rx="28"
                    fill="#050505"
                    stroke="url(#goldGradient)"
                    stroke-width="5"
                />

                <rect
                    x="112"
                    y="77"
                    width="776"
                    height="266"
                    rx="22"
                    fill="#080808"
                    stroke="#292929"
                    stroke-width="2"
                />

                <!-- ================================================= -->
                <!-- REEL WINDOWS -->
                <!-- ================================================= -->

                ${this.reelPositions
                    .map(
                        x => `
                            <rect
                                x="${x}"
                                y="${this.reelY}"
                                width="${this.reelWidth}"
                                height="${this.reelHeight}"
                                rx="18"
                                fill="url(#reelGradient)"
                                stroke="#353535"
                                stroke-width="3"
                                filter="url(#reelShadow)"
                            />

                            <rect
                                x="${x + 8}"
                                y="${this.reelY + 8}"
                                width="${this.reelWidth - 16}"
                                height="${this.reelHeight - 16}"
                                rx="13"
                                fill="none"
                                stroke="#111111"
                                stroke-width="2"
                            />

                            <!-- Glass reflection -->

                            <rect
                                x="${x + 10}"
                                y="${this.reelY + 10}"
                                width="${this.reelWidth - 20}"
                                height="75"
                                rx="12"
                                fill="url(#reelHighlight)"
                            />

                            <!-- Symbol glow -->

                            <ellipse
                                cx="${x + this.reelWidth / 2}"
                                cy="${this.reelY + this.reelHeight / 2}"
                                rx="91"
                                ry="91"
                                fill="url(#symbolGlow)"
                            />
                        `
                    )
                    .join("")}

                <!-- ================================================= -->
                <!-- REEL DIVIDERS -->
                <!-- ================================================= -->

                <rect
                    x="365"
                    y="82"
                    width="2"
                    height="256"
                    fill="url(#goldGradient)"
                    opacity="0.5"
                />

                <rect
                    x="616"
                    y="82"
                    width="2"
                    height="256"
                    fill="url(#goldGradient)"
                    opacity="0.5"
                />

                <!-- ================================================= -->
                <!-- PAYLINE -->
                <!-- ================================================= -->

                <line
                    x1="118"
                    y1="210"
                    x2="882"
                    y2="210"
                    stroke="#f4d27a"
                    stroke-width="1"
                    opacity="0.15"
                />

                <circle
                    cx="118"
                    cy="210"
                    r="3"
                    fill="#f4d27a"
                    opacity="0.6"
                />

                <circle
                    cx="882"
                    cy="210"
                    r="3"
                    fill="#f4d27a"
                    opacity="0.6"
                />

                <!-- ================================================= -->
                <!-- BOTTOM ORNAMENT -->
                <!-- ================================================= -->

                <circle
                    cx="235"
                    cy="364"
                    r="4"
                    fill="#dcb85d"
                />

                <rect
                    x="250"
                    y="362"
                    width="500"
                    height="4"
                    rx="2"
                    fill="url(#goldGradient)"
                />

                <circle
                    cx="765"
                    cy="364"
                    r="4"
                    fill="#dcb85d"
                />

            </svg>
        `;
    }

    /*
     * =========================================================
     * GET EMOJI ASSET
     * =========================================================
     */

    private async getEmojiAsset(
        symbol:  SlotRenderSymbol
    ): Promise<Buffer> {

        const cached =
            this.emojiCache.get(
                symbol
            );

        if (cached) {
            return cached;
        }

        const existingRequest =
            this.emojiRequests.get(
                symbol
            );

        if (existingRequest) {
            return existingRequest;
        }

        const request =
            this.downloadEmoji(
                symbol
            );

        this.emojiRequests.set(
            symbol,
            request
        );

        try {

            const buffer =
                await request;

            this.emojiCache.set(
                symbol,
                buffer
            );

            return buffer;

        } finally {

            this.emojiRequests.delete(
                symbol
            );
        }
    }

    /*
     * =========================================================
     * DOWNLOAD EMOJI
     * =========================================================
     */

    private async downloadEmoji(
        symbol:  SlotRenderSymbol
    ): Promise<Buffer> {

        const code =
            this.emojiCodes[symbol];

        const url =
            `${this.emojiBaseUrl}${code}.png`;

        const response =
            await fetch(
                url
            );

        if (!response.ok) {

            throw new Error(
                `Failed to download slot symbol "${symbol}". HTTP ${response.status}.`
            );
        }

        const arrayBuffer =
            await response.arrayBuffer();

        return Buffer.from(
            arrayBuffer
        );
    }

    /*
     * =========================================================
     * PREPARE EMOJI
     * =========================================================
     *
     * Every symbol is normalized to the same transparent
     * canvas so that different emoji proportions do not cause
     * inconsistent positioning inside the reels.
     */

    private async prepareEmoji(
        buffer: Buffer
    ): Promise<Buffer> {

        return sharp(
            buffer
        )
            .resize(
                this.symbolSize,
                this.symbolSize,
                {
                    fit: "contain",

                    position: "center",

                    background: {
                        r: 0,
                        g: 0,
                        b: 0,
                        alpha: 0
                    }
                }
            )
            .png()
            .toBuffer();
    }
}


END FILE: src/plugins/games/renderers/SlotRenderer.ts
================================================================================

FILE: src/plugins/games/services/DiceService.ts
--------------------------------------------------------------------------------
Original size: 5627 bytes
Exported size: 5333 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

export interface DiceRollResult {
    firstDie: number;
    secondDie: number;
    total: number;
}

export interface DicePayout {
    probability: number;
    multiplier: number;
    payout: bigint;
}

export class DiceService {

    /*
     * =========================
     * DICE CONFIGURATION
     * =========================
     */

    private static readonly SIDES = 6;

    private static readonly TOTAL_COMBINATIONS =
        DiceService.SIDES *
        DiceService.SIDES;

    private static readonly MAX_MULTIPLIER = 3;

    /*
     * =========================
     * ROLL DICE
     * =========================
     */

    roll(): DiceRollResult {

        const firstDie =
            this.rollDie();

        const secondDie =
            this.rollDie();

        return {
            firstDie,
            secondDie,

            total:
                firstDie +
                secondDie
        };
    }

    /*
     * =========================
     * ROLL SINGLE DIE
     * =========================
     */

    private rollDie(): number {

        return (
            Math.floor(
                Math.random() *
                DiceService.SIDES
            ) + 1
        );
    }

    /*
     * =========================
     * EXACT PREDICTION
     * =========================
     */

    calculateExactPayout(
        number: number,
        wager: bigint
    ): DicePayout {

        this.validateWager(
            wager
        );

        const combinations =
            this.getCombinationsForExact(
                number
            );

        return this.calculatePayout(
            combinations,
            wager
        );
    }

    /*
     * =========================
     * RANGE PREDICTION
     * =========================
     */

    calculateRangePayout(
        low: number,
        high: number,
        wager: bigint
    ): DicePayout {

        this.validateWager(
            wager
        );

        if (
            !Number.isInteger(low) ||
            !Number.isInteger(high)
        ) {

            return {
                probability: 0,
                multiplier: 0,
                payout: 0n
            };
        }

        if (
            low > high
        ) {

            return {
                probability: 0,
                multiplier: 0,
                payout: 0n
            };
        }

        let combinations = 0;

        for (
            let total = low;
            total <= high;
            total++
        ) {

            combinations +=
                this.getCombinationsForExact(
                    total
                );
        }

        return this.calculatePayout(
            combinations,
            wager
        );
    }

    /*
     * =========================
     * COMBINATIONS
     * =========================
     */

    private getCombinationsForExact(
        number: number
    ): number {

        if (
            !Number.isInteger(number) ||
            number < 2 ||
            number > 12
        ) {

            return 0;
        }

        /*
         * Number of combinations for
         * two six-sided dice:
         *
         * 2  -> 1
         * 3  -> 2
         * 4  -> 3
         * 5  -> 4
         * 6  -> 5
         * 7  -> 6
         * 8  -> 5
         * 9  -> 4
         * 10 -> 3
         * 11 -> 2
         * 12 -> 1
         */

        if (
            number <= 7
        ) {

            return number - 1;
        }

        return 13 - number;
    }

    /*
     * =========================
     * PAYOUT
     * =========================
     */

    private calculatePayout(
        combinations: number,
        wager: bigint
    ): DicePayout {

        if (
            combinations <= 0
        ) {

            return {
                probability: 0,
                multiplier: 0,
                payout: 0n
            };
        }

        const probability =
            combinations /
            DiceService.TOTAL_COMBINATIONS;

        /*
         * The multiplier is based on
         * inverse probability, capped at
         * the existing maximum of 3×.
         */

        const rawMultiplier =
            1 /
            probability;

        const multiplier =
            Math.min(
                rawMultiplier,
                DiceService.MAX_MULTIPLIER
            );

        /*
         * Nickel is stored as bigint.
         *
         * The multiplier is calculated as
         * a number, then the final payout is
         * rounded down to whole Nickel.
         */

        const payout =
            BigInt(
                Math.floor(
                    Number(wager) *
                    multiplier
                )
            );

        return {
            probability,
            multiplier,
            payout
        };
    }

    /*
     * =========================
     * WAGER VALIDATION
     * =========================
     */

    private validateWager(
        wager: bigint
    ): void {

        if (
            typeof wager !== "bigint"
        ) {

            throw new TypeError(
                "Dice wager must be a bigint."
            );
        }

        if (
            wager < 0n
        ) {

            throw new RangeError(
                "Dice wager cannot be negative."
            );
        }
    }
}


END FILE: src/plugins/games/services/DiceService.ts
================================================================================

FILE: src/plugins/games/services/GameAccessService.ts
--------------------------------------------------------------------------------
Original size: 1637 bytes
Exported size: 1567 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import type { EconomyAccountService } from "../../economy/services/EconomyAccountService.js";

export type GameWagerType = "dice" | "slots" | "rps" | "odd-even";

export interface GameAccessResult {
  allowed: boolean;
  reason?: string;
}

const WAGER_LIMITS: Record<
  GameWagerType,
  { min: bigint; max: bigint }
> = {
  dice: { min: 20n, max: 500n },
  slots: { min: 20n, max: 500n },
  rps: { min: 50n, max: 1000n },
  "odd-even": { min: 20n, max: 500n },
};

export class GameAccessService {
  constructor(
    private readonly economy: EconomyAccountService,
  ) {}

  async checkWagerAccess(
    game: GameWagerType,
    guildId: string,
    discordId: string,
    wager: bigint,
  ): Promise<GameAccessResult> {
    if (wager < 0n) {
      return {
        allowed: false,
        reason: "A wager cannot be negative.",
      };
    }

    // Free games are allowed even while a robbery/jail lock is active.
    if (wager === 0n) {
      return { allowed: true };
    }

    const limits = WAGER_LIMITS[game];

    if (wager < limits.min || wager > limits.max) {
      return {
        allowed: false,
        reason:
          `The wager for ${game} must be between ` +
          `${limits.min.toString()} and ${limits.max.toString()} Nickel.`,
      };
    }

    const isLocked = await this.economy.isRobberyLocked(
      guildId,
      discordId,
    );

    if (isLocked) {
      return {
        allowed: false,
        reason:
          "You cannot wager while your robbery/jail lock is active.",
      };
    }

    return { allowed: true };
  }
}


END FILE: src/plugins/games/services/GameAccessService.ts
================================================================================

FILE: src/plugins/games/services/GamesEconomyService.ts
--------------------------------------------------------------------------------
Original size: 32228 bytes
Exported size: 30921 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
import { PrismaService } from "../../../core/database/PrismaService.js";
import { EconomyAccountService } from "../../economy/services/EconomyAccountService.js";

export interface GameWagerResult {
    wager: bigint;
    walletAfter: bigint;
    cardAfter: bigint;
    inkBankAfter: bigint;
}

export interface GameSettlementResult {
    wager: bigint;
    payout: bigint;
    won: boolean;
    walletAfter: bigint;
    cardAfter: bigint;
    inkBankAfter: bigint;
}

export interface RpsPvPSettlementResult {
    wager: bigint;
    pot: bigint;
    winnerId: string | null;
    playerOneWalletAfter: bigint;
    playerTwoWalletAfter: bigint;
    inkBankAfter: bigint;
}

export interface RpsPvBSettlementResult {
    wager: bigint;
    pot: bigint;
    won: boolean;
    playerWalletAfter: bigint;
    inkBankAfter: bigint;
}

export interface OddEvenPvPSettlementResult {
    wager: bigint;
    pot: bigint;
    winnerId: string;
    playerOneWalletAfter: bigint;
    playerTwoWalletAfter: bigint;
    inkBankAfter: bigint;
}

export class GamesEconomyService {

    /*
     * =========================
     * WAGER LIMITS
     * =========================
     */

    private static readonly MIN_WAGER = 20n;

    private static readonly MAX_WAGER = 1000n;

    /*
     * =========================
     * RPS WAGER LIMITS
     * =========================
     */

    private static readonly RPS_MIN_WAGER = 50n;

    private static readonly RPS_MAX_WAGER = 1000n;

    /*
     * =========================
     * ODD/EVEN WAGER LIMITS
     * =========================
     */

    private static readonly ODD_EVEN_MIN_WAGER = 20n;

    private static readonly ODD_EVEN_MAX_WAGER = 1000n;

    constructor(
        private readonly database: PrismaService
    ) {}

    /*
     * =========================
     * WAGER VALIDATION
     * =========================
     */

    validateWager(
        wager: bigint
    ): void {

        if (
            typeof wager !== "bigint"
        ) {

            throw new TypeError(
                "Wager must be a bigint."
            );
        }

        if (
            wager <
                GamesEconomyService.MIN_WAGER ||
            wager >
                GamesEconomyService.MAX_WAGER
        ) {

            throw new Error(
                "INVALID_WAGER"
            );
        }
    }

       

    /*
     * =========================
     * RPS WAGER VALIDATION
     * =========================
     */

    validateRpsWager(
        wager: bigint
    ): void {

        if (
            typeof wager !== "bigint"
        ) {

            throw new TypeError(
                "RPS wager must be a bigint."
            );
        }

        if (
            wager === 0n
        ) {
            return;
        }

        if (
            wager <
                GamesEconomyService.RPS_MIN_WAGER ||
            wager >
                GamesEconomyService.RPS_MAX_WAGER
        ) {

            throw new Error(
                "INVALID_RPS_WAGER"
            );
        }
    }

    /*
     * =========================
     * ODD/EVEN WAGER VALIDATION
     * =========================
     */

     validateOddEvenWager(
        wager: bigint
    ): void {

        if (
            typeof wager !== "bigint"
        ) {

            throw new TypeError(
                "Odd or Even wager must be a bigint."
            );
        }

        if (
            wager === 0n
        ) {

            return;
        }

        if (
            wager <
                GamesEconomyService.ODD_EVEN_MIN_WAGER ||
            wager >
                GamesEconomyService.ODD_EVEN_MAX_WAGER
        ) {

            throw new Error(
                "INVALID_ODD_EVEN_WAGER"
            );
        }
    }

    /*
     * =========================
     * ENSURE PLAYER ACCOUNTS
     * =========================
     */

    async ensurePlayer(
        guildId: string,
        discordId: string
    ): Promise<void> {

        const accountService =
            new EconomyAccountService(
                this.database
            );

        await accountService.ensureAccounts(
            guildId,
            discordId
        );
    }

    /*
     * =========================
     * SETTLE GAME
     * =========================
     */

    async settleGame(
        guildId: string,
        discordId: string,
        wager: bigint,
        payout: bigint,
        won: boolean
    ): Promise<GameSettlementResult> {

        this.validateWager(
            wager
        );

        if (
            typeof payout !== "bigint"
        ) {

            throw new TypeError(
                "Payout must be a bigint."
            );
        }

        if (
            payout < 0n
        ) {

            throw new Error(
                "INVALID_PAYOUT"
            );
        }

        const actualPayout =
            won
                ? payout
                : 0n;

        await this.ensurePlayer(
            guildId,
            discordId
        );

        return this.database.db.$transaction(
            async tx => {

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
                        "ACCOUNT_NOT_FOUND"
                    );
                }

                const card =
                    await tx.operaCard.findUnique({
                        where: {
                            discordId
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
                            guildId
                        }
                    });

                if (!inkBank) {

                    throw new Error(
                        "INK_BANK_NOT_FOUND"
                    );
                }

                const totalPlayerFunds =
                    account.wallet +
                    card.balance;

                if (
                    totalPlayerFunds <
                    wager
                ) {

                    throw new Error(
                        "INSUFFICIENT_FUNDS"
                    );
                }

                if (
                    actualPayout >
                    inkBank.balance
                ) {

                    throw new Error(
                        "INSUFFICIENT_INK_BANK"
                    );
                }

                const walletUsed =
                    account.wallet >= wager
                        ? wager
                        : account.wallet;

                const cardUsed =
                    wager -
                    walletUsed;

                const updatedAccount =
                    await tx.economyAccount.update({
                        where: {
                            id:
                                account.id
                        },

                        data: {
                            wallet: {
                                decrement:
                                    walletUsed
                            }
                        }
                    });

                const updatedCard =
                    await tx.operaCard.update({
                        where: {
                            id:
                                card.id
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

                let inkBalance =
                    inkBank.balance +
                    wager;

                let finalWallet =
                    updatedAccount.wallet;

                if (
                    actualPayout > 0n
                ) {

                    const paidAccount =
                        await tx.economyAccount.update({
                            where: {
                                id:
                                    account.id
                            },

                            data: {
                                wallet: {
                                    increment:
                                        actualPayout
                                }
                            }
                        });

                    finalWallet =
                        paidAccount.wallet;

                    inkBalance -=
                        actualPayout;
                }

                const updatedInkBank =
                    await tx.inkBank.update({
                        where: {
                            id:
                                inkBank.id
                        },

                        data: {
                            balance:
                                inkBalance,

                            updatedAt:
                                new Date()
                        }
                    });

                return {
                    wager,

                    payout:
                        actualPayout,

                    won,

                    walletAfter:
                        finalWallet,

                    cardAfter:
                        updatedCard.balance,

                    inkBankAfter:
                        updatedInkBank.balance
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
     * SETTLE EXISTING WAGER
     * =========================
     */

    async settleExistingWager(
        guildId: string,
        discordId: string,
        wager: bigint,
        payout: bigint,
        won: boolean
    ): Promise<GameSettlementResult> {

        this.validateWager(
            wager
        );

        if (
            typeof payout !== "bigint"
        ) {

            throw new TypeError(
                "Payout must be a bigint."
            );
        }

        if (
            payout < 0n
        ) {

            throw new Error(
                "INVALID_PAYOUT"
            );
        }

        const actualPayout =
            won
                ? payout
                : 0n;

        await this.ensurePlayer(
            guildId,
            discordId
        );

        return this.database.db.$transaction(
            async tx => {

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
                        "ACCOUNT_NOT_FOUND"
                    );
                }

                const card =
                    await tx.operaCard.findUnique({
                        where: {
                            discordId
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
                            guildId
                        }
                    });

                if (!inkBank) {

                    throw new Error(
                        "INK_BANK_NOT_FOUND"
                    );
                }

                let inkBalance =
                    inkBank.balance +
                    wager;

                if (
                    actualPayout >
                    inkBalance
                ) {

                    throw new Error(
                        "INSUFFICIENT_INK_BANK"
                    );
                }

                let finalWallet =
                    account.wallet;

                if (
                    actualPayout > 0n
                ) {

                    const updatedAccount =
                        await tx.economyAccount.update({
                            where: {
                                id:
                                    account.id
                            },

                            data: {
                                wallet: {
                                    increment:
                                        actualPayout
                                }
                            }
                        });

                    finalWallet =
                        updatedAccount.wallet;

                    inkBalance -=
                        actualPayout;
                }

                const updatedInkBank =
                    await tx.inkBank.update({
                        where: {
                            id:
                                inkBank.id
                        },

                        data: {
                            balance:
                                inkBalance,

                            updatedAt:
                                new Date()
                        }
                    });

                return {
                    wager,

                    payout:
                        actualPayout,

                    won,

                    walletAfter:
                        finalWallet,

                    cardAfter:
                        card.balance,

                    inkBankAfter:
                        updatedInkBank.balance
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
     * SETTLE RPS PVP
     * =========================
     */

    async settleRpsPvP(
        guildId: string,
        playerOneId: string,
        playerTwoId: string,
        wager: bigint,
        winnerId: string | null
    ): Promise<RpsPvPSettlementResult> {

        this.validateRpsWager(
            wager
        );

        if (
            wager === 0n
        ) {

            throw new Error(
                "RPS_FREE_GAME_NO_SETTLEMENT"
            );
        }

        if (
            playerOneId ===
            playerTwoId
        ) {

            throw new Error(
                "PVP_SAME_PLAYER"
            );
        }

        if (
            winnerId !== null &&
            winnerId !== playerOneId &&
            winnerId !== playerTwoId
        ) {

            throw new Error(
                "INVALID_PVP_WINNER"
            );
        }

        const pot =
            wager * 2n;

        await this.ensurePlayer(
            guildId,
            playerOneId
        );

        await this.ensurePlayer(
            guildId,
            playerTwoId
        );

        return this.database.db.$transaction(
            async tx => {

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
                        "ACCOUNT_NOT_FOUND"
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
                        "ACCOUNT_NOT_FOUND"
                    );
                }

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

                let inkBalance =
                    inkBank.balance +
                    pot;

                let playerOneWallet =
                    playerOne.wallet;

                let playerTwoWallet =
                    playerTwo.wallet;

                if (
                    winnerId === null
                ) {

                    playerOneWallet +=
                        wager;

                    playerTwoWallet +=
                        wager;

                    inkBalance -=
                        pot;

                } else {

                    if (
                        pot >
                        inkBalance
                    ) {

                        throw new Error(
                            "INSUFFICIENT_INK_BANK"
                        );
                    }

                    if (
                        winnerId ===
                        playerOneId
                    ) {

                        playerOneWallet +=
                            pot;

                    } else {

                        playerTwoWallet +=
                            pot;
                    }

                    inkBalance -=
                        pot;
                }

                const updatedPlayerOne =
                    await tx.economyAccount.update({
                        where: {
                            id:
                                playerOne.id
                        },

                        data: {
                            wallet:
                                playerOneWallet
                        }
                    });

                const updatedPlayerTwo =
                    await tx.economyAccount.update({
                        where: {
                            id:
                                playerTwo.id
                        },

                        data: {
                            wallet:
                                playerTwoWallet
                        }
                    });

                const updatedInkBank =
                    await tx.inkBank.update({
                        where: {
                            id:
                                inkBank.id
                        },

                        data: {
                            balance:
                                inkBalance,

                            updatedAt:
                                new Date()
                        }
                    });

                return {
                    wager,

                    pot,

                    winnerId,

                    playerOneWalletAfter:
                        updatedPlayerOne.wallet,

                    playerTwoWalletAfter:
                        updatedPlayerTwo.wallet,

                    inkBankAfter:
                        updatedInkBank.balance
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
     * SETTLE RPS AGAINST BANK
     * =========================
     *
     * The player's wager has already
     * been withdrawn by
     * EconomyAccountService.
     *
     * result:
     *
     * "win"
     * "loss"
     * "draw"
     *
     * WIN:
     *     Player receives 2 × wager.
     *
     * LOSS:
     *     Player's wager remains in
     *     the Ink Bank.
     *
     * DRAW:
     *     Player receives their wager
     *     back.
     *
     * No multiplier system is used.
     */

    async settleRpsAgainstBank(
        guildId: string,
        discordId: string,
        wager: bigint,
        result: "win" | "loss" | "draw"
    ): Promise<RpsPvBSettlementResult> {

        this.validateRpsWager(
            wager
        );

        if (
            wager === 0n
        ) {

            throw new Error(
                "RPS_FREE_GAME_NO_SETTLEMENT"
            );
        }

        await this.ensurePlayer(
            guildId,
            discordId
        );

        return this.database.db.$transaction(
            async tx => {

                /*
                 * =========================
                 * PLAYER
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
                        "ACCOUNT_NOT_FOUND"
                    );
                }

                /*
                 * =========================
                 * INK BANK
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
                 * The wager has already
                 * been removed from the
                 * player's account.
                 *
                 * Move it into the bank.
                 */

                let inkBalance =
                    inkBank.balance +
                    wager;

                let playerWallet =
                    account.wallet;

                const pot =
                    wager * 2n;

                /*
                 * =========================
                 * WIN
                 * =========================
                 *
                 * The bank supplies the
                 * matching wager.
                 *
                 * Player receives the
                 * complete two-wager pot.
                 */

                if (
                    result === "win"
                ) {

                    if (
                        inkBank.balance <
                        wager
                    ) {

                        throw new Error(
                            "INSUFFICIENT_INK_BANK"
                        );
                    }

                    playerWallet +=
                        pot;

                    inkBalance -=
                        pot;
                }

                /*
                 * =========================
                 * DRAW
                 * =========================
                 *
                 * Return the player's
                 * original wager.
                 *
                 * The bank ends exactly
                 * where it started.
                 */

                else if (
                    result === "draw"
                ) {

                    playerWallet +=
                        wager;

                    inkBalance -=
                        wager;
                }

                /*
                 * =========================
                 * LOSS
                 * =========================
                 *
                 * The wager remains in
                 * the Ink Bank.
                 */

                else if (
                    result === "loss"
                ) {

                    /*
                     * No wallet mutation.
                     *
                     * inkBalance already
                     * contains the wager.
                     */
                }

                else {

                    throw new Error(
                        "INVALID_RPS_RESULT"
                    );
                }

                /*
                 * =========================
                 * UPDATE PLAYER
                 * =========================
                 */

                const updatedAccount =
                    await tx.economyAccount.update({
                        where: {
                            id:
                                account.id
                        },

                        data: {
                            wallet:
                                playerWallet
                        }
                    });

                /*
                 * =========================
                 * UPDATE INK BANK
                 * =========================
                 */

                const updatedInkBank =
                    await tx.inkBank.update({
                        where: {
                            id:
                                inkBank.id
                        },

                        data: {
                            balance:
                                inkBalance,

                            updatedAt:
                                new Date()
                        }
                    });

                return {
                    wager,

                    pot,

                    won:
                        result === "win",

                    playerWalletAfter:
                        updatedAccount.wallet,

                    inkBankAfter:
                        updatedInkBank.balance
                };
            },
            {
                isolationLevel:
                    "Serializable"
            }
        );
 
    }

        async settleOddEvenPvP(
        guildId: string,
        playerOneId: string,
        playerTwoId: string,
        wager: bigint,
        winnerId: string
    ): Promise<OddEvenPvPSettlementResult> {

        this.validateOddEvenWager(
            wager
        );

        if (
            wager === 0n
        ) {

            throw new Error(
                "ODD_EVEN_FREE_GAME_NO_SETTLEMENT"
            );
        }

        if (
            playerOneId ===
            playerTwoId
        ) {

            throw new Error(
                "PVP_SAME_PLAYER"
            );
        }

        if (
            winnerId !== playerOneId &&
            winnerId !== playerTwoId
        ) {

            throw new Error(
                "INVALID_PVP_WINNER"
            );
        }

        const pot =
            wager * 2n;

        await this.ensurePlayer(
            guildId,
            playerOneId
        );

        await this.ensurePlayer(
            guildId,
            playerTwoId
        );

        return await this.database.db.$transaction(
            async tx => {

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

                const newWinnerWallet =
                    winnerId === playerOneId
                        ? playerOne.wallet + pot
                        : playerOne.wallet;

                const newPlayerTwoWallet =
                    winnerId === playerTwoId
                        ? playerTwo.wallet + pot
                        : playerTwo.wallet;

                const newInkBankBalance =
                    inkBank.balance + pot - pot;

                await tx.economyAccount.update({

                    where: {
                        id:
                            playerOne.id
                    },

                    data: {
                        wallet:
                            newWinnerWallet
                    }
                });

                await tx.economyAccount.update({

                    where: {
                        id:
                            playerTwo.id
                    },

                    data: {
                        wallet:
                            newPlayerTwoWallet
                    }
                });

                await tx.inkBank.update({

                    where: {
                        id:
                            inkBank.id
                    },

                    data: {
                        balance:
                            newInkBankBalance
                    }
                });

                return {

                    wager,

                    pot,

                    winnerId,

                    playerOneWalletAfter:
                        newWinnerWallet,

                    playerTwoWalletAfter:
                        newPlayerTwoWallet,

                    inkBankAfter:
                        newInkBankBalance
                };
            }
        );
    }
}

END FILE: src/plugins/games/services/GamesEconomyService.ts
================================================================================

FILE: src/plugins/games/services/GamesPayoutService.ts
--------------------------------------------------------------------------------
Original size: 6641 bytes
Exported size: 6376 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

import type { PrismaService } from "../../../core/database/PrismaService.js";
import type { EconomyAccountService } from "../../economy/services/EconomyAccountService.js";
import {
  GamesEconomyService,
  type GameSettlementResult,
  type RpsPvPSettlementResult,
  type RpsPvBSettlementResult,
  type OddEvenPvPSettlementResult,
} from "./GamesEconomyService.js";

export type GamesSettlementStatus = "settled" | "already-settled";

export interface GamesSettlementResponse<T> {
  status: GamesSettlementStatus;
  result?: T;
}

export class GamesPayoutService {
  private readonly gameEconomy: GamesEconomyService;

  /**
   * Protects settlements within this running process.
   *
   * This is deliberately not described as restart-safe idempotency:
   * the existing database schema has no persisted game settlement ID.
   */
  private readonly inFlight = new Map<string, Promise<unknown>>();
  private readonly settledSessions = new Set<string>();

  private static readonly MAX_SETTLED_SESSIONS = 20_000;

  constructor(
    private readonly database: PrismaService,
    private readonly economy: EconomyAccountService,
  ) {
    this.gameEconomy = new GamesEconomyService(database);
  }

  validateWager(wager: bigint): void {
    this.gameEconomy.validateWager(wager);
  }

  validateRpsWager(wager: bigint): void {
    this.gameEconomy.validateRpsWager(wager);
  }

  validateOddEvenWager(wager: bigint): void {
    this.gameEconomy.validateOddEvenWager(wager);
  }

  /**
   * Withdraws a single player's wager using the established wallet-first,
   * Opera Card-second withdrawal implementation.
   *
   * The caller must ensure the wager has not already been withdrawn.
   */
  async withdrawWager(
    guildId: string,
    discordId: string,
    wager: bigint,
  ): Promise<void> {
    this.gameEconomy.validateWager(wager);

    if (wager === 0n) return;

    await this.economy.withdrawForGame(
      guildId,
      discordId,
      wager,
    );
  }

  /**
   * Atomically withdraws both RPS PvP wagers.
   */
  async withdrawRpsPvPWagers(
    guildId: string,
    playerOneId: string,
    playerTwoId: string,
    wager: bigint,
  ): Promise<void> {
    this.gameEconomy.validateRpsWager(wager);

    if (wager === 0n) return;

    await this.economy.withdrawRpsPvPWagers(
      guildId,
      playerOneId,
      playerTwoId,
      wager,
    );
  }

  /**
   * Atomically withdraws both Odd or Even PvP wagers.
   */
  async withdrawOddEvenPvPWagers(
    guildId: string,
    playerOneId: string,
    playerTwoId: string,
    wager: bigint,
  ): Promise<void> {
    this.gameEconomy.validateOddEvenWager(wager);

    if (wager === 0n) return;

    await this.economy.withdrawOddEvenPvPWagers(
      guildId,
      playerOneId,
      playerTwoId,
      wager,
    );
  }

  /**
   * Settles a single-player game whose wager has already been withdrawn.
   *
   * `payout` is the TOTAL return, including the original wager when won.
   */
  async settleSinglePlayerGame(
    sessionId: string,
    guildId: string,
    discordId: string,
    wager: bigint,
    payout: bigint,
    won: boolean,
  ): Promise<GamesSettlementResponse<GameSettlementResult>> {
    return this.runOnce(sessionId, async () => {
      const result = await this.gameEconomy.settleExistingWager(
        guildId,
        discordId,
        wager,
        payout,
        won,
      );

      return result;
    });
  }

  /**
   * Settles RPS PvP after both wagers have been withdrawn.
   *
   * A null winner represents a draw and refunds both wagers.
   */
  async settleRpsPvP(
    sessionId: string,
    guildId: string,
    playerOneId: string,
    playerTwoId: string,
    wager: bigint,
    winnerId: string | null,
  ): Promise<GamesSettlementResponse<RpsPvPSettlementResult>> {
    return this.runOnce(sessionId, async () => {
      return this.gameEconomy.settleRpsPvP(
        guildId,
        playerOneId,
        playerTwoId,
        wager,
        winnerId,
      );
    });
  }

  /**
   * Settles RPS against the bank after the player's wager has been withdrawn.
   *
   * The actual payout is determined by GamesEconomyService:
   * win = 2 × wager, draw = wager returned, loss = 0.
   */
  async settleRpsAgainstBank(
    sessionId: string,
    guildId: string,
    discordId: string,
    wager: bigint,
    _payout: bigint,
    result: "win" | "loss" | "draw",
  ): Promise<GamesSettlementResponse<RpsPvBSettlementResult>> {
    return this.runOnce(sessionId, async () => {
      return this.gameEconomy.settleRpsAgainstBank(
        guildId,
        discordId,
        wager,
        result,
      );
    });
  }

  /**
   * Settles Odd or Even PvP after both wagers have been withdrawn.
   * The winner receives the entire pot.
   */
  async settleOddEvenPvP(
    sessionId: string,
    guildId: string,
    playerOneId: string,
    playerTwoId: string,
    wager: bigint,
    winnerId: string,
  ): Promise<GamesSettlementResponse<OddEvenPvPSettlementResult>> {
    return this.runOnce(sessionId, async () => {
      return this.gameEconomy.settleOddEvenPvP(
        guildId,
        playerOneId,
        playerTwoId,
        wager,
        winnerId,
      );
    });
  }

  private async runOnce<T>(
    sessionId: string,
    operation: () => Promise<T>,
  ): Promise<GamesSettlementResponse<T>> {
    if (!sessionId.trim()) {
      throw new Error("INVALID_GAME_SESSION_ID");
    }

    if (this.settledSessions.has(sessionId)) {
      return { status: "already-settled" };
    }

    const existing = this.inFlight.get(sessionId);

    if (existing) {
      await existing;
      return { status: "already-settled" };
    }

    const settlement = operation();
    this.inFlight.set(sessionId, settlement);

    try {
      const result = await settlement;

      this.settledSessions.add(sessionId);

      // Keep memory bounded for long-running bot processes.
      if (
        this.settledSessions.size >
        GamesPayoutService.MAX_SETTLED_SESSIONS
      ) {
        const oldest = this.settledSessions.values().next().value;

        if (oldest !== undefined) {
          this.settledSessions.delete(oldest);
        }
      }

      return {
        status: "settled",
        result,
      };
    } finally {
      this.inFlight.delete(sessionId);
    }
  }

  destroy(): void {
    this.inFlight.clear();
    this.settledSessions.clear();
  }
}


END FILE: src/plugins/games/services/GamesPayoutService.ts
================================================================================

FILE: src/plugins/games/services/OddEvenService.ts
--------------------------------------------------------------------------------
Original size: 2952 bytes
Exported size: 2792 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
export type OddEvenChoice =
    | "odd"
    | "even";

export type OddEvenResult =
    | "host"
    | "opponent";

export class OddEvenService {

    /*
     * =========================
     * VALIDATE CHOICE
     * =========================
     */

    validateChoice(
        choice: OddEvenChoice
    ): void {

        if (
            choice !== "odd" &&
            choice !== "even"
        ) {

            throw new Error(
                "INVALID_ODD_EVEN_CHOICE"
            );
        }
    }

    /*
     * =========================
     * VALIDATE NUMBER
     * =========================
     */

    validateNumber(
        number: number
    ): void {

        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > 5
        ) {

            throw new Error(
                "INVALID_ODD_EVEN_NUMBER"
            );
        }
    }

    /*
     * =========================
     * DETERMINE WINNER
     * =========================
     *
     * Both players choose a number
     * between 1 and 5.
     *
     * The two numbers are added.
     *
     * Odd total:
     *     Odd player wins.
     *
     * Even total:
     *     Even player wins.
     *
     * There is intentionally no
     * draw state.
     */

    determineWinner(
        hostChoice: OddEvenChoice,
        hostNumber: number,
        opponentChoice: OddEvenChoice,
        opponentNumber: number
    ): OddEvenResult {

        this.validateChoice(
            hostChoice
        );

        this.validateChoice(
            opponentChoice
        );

        this.validateNumber(
            hostNumber
        );

        this.validateNumber(
            opponentNumber
        );

        const total =
            hostNumber +
            opponentNumber;

        const totalIsEven =
            total % 2 === 0;

        if (
            totalIsEven
        ) {

            return opponentChoice === "even"
                ? "opponent"
                : "host";
        }

        return opponentChoice === "odd"
            ? "opponent"
            : "host";
    }

    /*
     * =========================
     * CHOICE NAME
     * =========================
     */

    getChoiceName(
        choice: OddEvenChoice
    ): string {

        switch (
            choice
        ) {

            case "odd":
                return "Odd";

            case "even":
                return "Even";
        }
    }

    /*
     * =========================
     * CHOICE EMOJI
     * =========================
     */

    getChoiceEmoji(
        choice: OddEvenChoice
    ): string {

        switch (
            choice
        ) {

            case "odd":
                return "🔴";

            case "even":
                return "🔵";
        }
    }
}

END FILE: src/plugins/games/services/OddEvenService.ts
================================================================================

FILE: src/plugins/games/services/RpsService.ts
--------------------------------------------------------------------------------
Original size: 1763 bytes
Exported size: 1668 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------
export type RpsMove =
    | "rock"
    | "paper"
    | "scissors";

export type RpsResult =
    | "host"
    | "opponent"
    | "draw";

export class RpsService {

    /*
     * =========================
     * DETERMINE WINNER
     * =========================
     */

    determineWinner(
        hostMove: RpsMove,
        opponentMove: RpsMove
    ): RpsResult {

        if (
            hostMove ===
            opponentMove
        ) {
            return "draw";
        }

        if (
            (
                hostMove === "rock" &&
                opponentMove === "scissors"
            ) ||
            (
                hostMove === "paper" &&
                opponentMove === "rock"
            ) ||
            (
                hostMove === "scissors" &&
                opponentMove === "paper"
            )
        ) {
            return "host";
        }

        return "opponent";
    }

    /*
     * =========================
     * MOVE NAME
     * =========================
     */

    getMoveName(
        move: RpsMove
    ): string {

        switch (move) {

            case "rock":
                return "Rock";

            case "paper":
                return "Paper";

            case "scissors":
                return "Scissors";
        }
    }

    /*
     * =========================
     * MOVE EMOJI
     * =========================
     */

    getMoveEmoji(
        move: RpsMove
    ): string {

        switch (move) {

            case "rock":
                return "🪨";

            case "paper":
                return "📄";

            case "scissors":
                return "✂️";
        }
    }
}

END FILE: src/plugins/games/services/RpsService.ts
================================================================================

FILE: src/plugins/games/services/SlotService.ts
--------------------------------------------------------------------------------
Original size: 8659 bytes
Exported size: 8198 bytes
Sensitive-looking lines redacted: 0
--------------------------------------------------------------------------------

/*
 * =========================
 * SLOT SERVICE
 * =========================
 *
 * Contains all slot-machine
 * game logic.
 *
 * This service does NOT:
 * - handle Discord interactions
 * - access the database
 * - modify player balances
 * - depend on Discord.js
 * - depend on DiceService
 */

export type SlotSymbol =
    | "mask"
    | "scroll"
    | "inkbottle"
    | "quill"
    | "crown";

export interface SlotSpinResult {

    reels: [
        SlotSymbol,
        SlotSymbol,
        SlotSymbol
    ];

    won: boolean;

    multiplier: number;

    payout: bigint;

    winningSymbol?: SlotSymbol;

    winningCount: number;
}

export class SlotService {

    /*
     * =========================
     * SYMBOL CONFIGURATION
     * =========================
     *
     * Higher weight =
     * more common symbol.
     *
     * Crown is intentionally
     * extremely rare.
     */

    private readonly symbols: {
        symbol: SlotSymbol;
        weight: number;
    }[] = [

        {
            symbol: "mask",
            weight: 40
        },

        {
            symbol: "scroll",
            weight: 30
        },

        {
            symbol: "inkbottle",
            weight: 18
        },

        {
            symbol: "quill",
            weight: 10
        },

        {
            symbol: "crown",
            weight: 2
        }
    ];

    /*
     * =========================
     * SPIN
     * =========================
     */

    spin(
        wager: bigint
    ): SlotSpinResult {

        if (
            wager <= 0n
        ) {

            throw new Error(
                "INVALID_WAGER"
            );
        }

        const reels: [
            SlotSymbol,
            SlotSymbol,
            SlotSymbol
        ] = [

            this.randomSymbol(),

            this.randomSymbol(),

            this.randomSymbol()
        ];

        /*
         * =========================
         * THREE OF A KIND
         * =========================
         */

        if (
            reels[0] === reels[1] &&
            reels[1] === reels[2]
        ) {

            const winningSymbol =
                reels[0];

            const multiplier =
                this.getThreeMatchMultiplier(
                    winningSymbol
                );

            return {

                reels,

                won:
                    true,

                multiplier,

                payout:
                    this.calculatePayout(
                        wager,
                        multiplier
                    ),

                winningSymbol,

                winningCount:
                    3
            };
        }

        /*
         * =========================
         * TWO OF A KIND
         * =========================
         *
         * Any matching pair wins.
         */

        if (
            reels[0] === reels[1] ||
            reels[0] === reels[2] ||
            reels[1] === reels[2]
        ) {

            const winningSymbol =
                reels[0] === reels[1]
                    ? reels[0]
                    : reels[0] === reels[2]
                        ? reels[0]
                        : reels[1];

            const multiplier =
                this.getTwoMatchMultiplier(
                    winningSymbol
                );

            return {

                reels,

                won:
                    true,

                multiplier,

                payout:
                    this.calculatePayout(
                        wager,
                        multiplier
                    ),

                winningSymbol,

                winningCount:
                    2
            };
        }

        /*
         * =========================
         * LOSS
         * =========================
         */

        return {

            reels,

            won:
                false,

            multiplier:
                0,

            payout:
                0n,

            winningCount:
                0
        };
    }

    /*
     * =========================
     * RANDOM SYMBOL
     * =========================
     */

    private randomSymbol(): SlotSymbol {

        const totalWeight =
            this.symbols.reduce(
                (
                    total,
                    entry
                ) =>
                    total +
                    entry.weight,

                0
            );

        let random =
            Math.random() *
            totalWeight;

        for (
            const entry
            of this.symbols
        ) {

            random -=
                entry.weight;

            if (
                random < 0
            ) {

                return entry.symbol;
            }
        }

        /*
         * Defensive fallback.
         */

        return this.symbols[
            this.symbols.length - 1
        ].symbol;
    }

    /*
     * =========================
     * THREE MATCH PAYOUT
     * =========================
     */

    private getThreeMatchMultiplier(
        symbol: SlotSymbol
    ): number {

        switch (
            symbol
        ) {

            case "mask":
                return 3;

            case "scroll":
                return 4;

            case "inkbottle":
                return 6;

            case "quill":
                return 12;

            case "crown":
                return 50;

            default:
                return 0;
        }
    }

    /*
     * =========================
     * TWO MATCH PAYOUT
     * =========================
     */

    private getTwoMatchMultiplier(
        symbol: SlotSymbol
    ): number {

        switch (
            symbol
        ) {

            case "mask":
                return 1.2;

            case "scroll":
                return 1.3;

            case "inkbottle":
                return 1.5;

            case "quill":
                return 2;

            case "crown":
                return 5;

            default:
                return 0;
        }
    }

    /*
     * =========================
     * PAYOUT
     * =========================
     *
     * Decimal multipliers are
     * represented using thousandths
     * to keep Nickel calculations
     * entirely integer-based.
     */

    private calculatePayout(
        wager: bigint,
        multiplier: number
    ): bigint {

        const multiplierScaled =
            BigInt(
                Math.round(
                    multiplier * 1000
                )
            );

        return (
            wager *
            multiplierScaled
        ) / 1000n;
    }

    /*
     * =========================
     * SYMBOL EMOJI
     * =========================
     *
     * Kept as a public helper because
     * GamesPlugin uses it for Discord
     * messages.
     *
     * The renderer does NOT use this
     * for the slot artwork.
     */

    getSymbolEmoji(
        symbol: SlotSymbol
    ): string {

        switch (
            symbol
        ) {

            case "mask":
                return "🎭";

            case "scroll":
                return "📜";

            /*
             * This is the ink bottle symbol.
             *
             * Do not use 🖋️ here — that is
             * the fountain pen emoji.
             */

            case "inkbottle":
                return "🖋️";

            case "quill":
                return "🪶";

            case "crown":
                return "👑";

            default:
                return "❓";
        }
    }

    /*
     * =========================
     * SYMBOL NAME
     * =========================
     */

    getSymbolName(
        symbol: SlotSymbol
    ): string {

        switch (
            symbol
        ) {

            case "mask":
                return "Theatrical Mask";

            case "scroll":
                return "Scroll";

            case "inkbottle":
                return "Ink Bottle";

            case "quill":
                return "Quill";

            case "crown":
                return "Crown";

            default:
                return "Unknown";
        }
    }
}


END FILE: src/plugins/games/services/SlotService.ts
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
