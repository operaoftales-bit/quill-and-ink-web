# Quill & Ink — Core, Global Systems, Events, and Bot-wide Behaviour

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

> Source-grounded reference for the supplied `src.zip`. This document covers cross-plugin behaviour, command routing, lifecycle, events, and systems that can affect multiple plugins. It is not a substitute for checking the deployed environment variables or live Discord configuration.

## Command registration and interaction routing

### `core/events/MessageCreate.ts`
**Event names referenced:** `MessageCreate`, `messageCreate`

### `core/events/GuildMemberAdd.ts`
**Event names referenced:** `GuildMemberAdd`, `guildMemberAdd`

**Relevant source lines (short excerpts):**
- `GuildMember,`
- `export const GuildMemberAdd = {`
- `name: "guildMemberAdd",`
- `member: GuildMember,`
- `const plugins =`
- `client.services.get<GuildPluginManager>(`
- `"guildPlugins"`
- `if (!plugins) {`
- `"[GuildMemberAdd] Database service is unavailable."`
- `plugins.isEnabled(`
- `member.guild.id,`
- `await database.db.guildConfig.findUnique({`
- `guildId:`
- `member.guild.id`
- `member.guild.roles.cache.get(`
- `\`[AutoRole] Configured role ${config.autoRoleId} no longer exists in ${member.guild.name}.\``
- `member.guild.members.me;`
- `member.guild.name`

### `core/events/InteractionCreate.ts`
**Event names referenced:** `Events.InteractionCreate`, `InteractionCreate`

**Relevant source lines (short excerpts):**
- `Events.InteractionCreate,`
- `* GUILD ONBOARDING DISMISS`
- `"guild_onboarding_dismiss:"`
- `.handleGuildOnboardingDismissButton(`
- `"[InteractionCreate] Failed to handle guild onboarding dismissal:",`
- `* PREMIUM PANEL`
- `"setup_premium"`
- `!interaction.guild`
- `const hasPremium =`
- `await client.globalCore.hasPremium(`
- `interaction.guild.id`
- `const premiumStatus =`
- `hasPremium`
- `? "◆ **Premium is active**\n\n" +`
- `"Your server currently has an active Premium entitlement."`
- `"Your server does not currently have an active Premium entitlement.";`
- `"QUILL & INK · PREMIUM"`
- `"The Premium Collection"`

### `core/loader/CommandLoader.js`

**Relevant source lines (short excerpts):**
- `exports.CommandLoader = void 0;`
- `var CommandLoader = /** @class */ (function () {`
- `function CommandLoader() {`
- `CommandLoader.prototype.load = function (commandsPath) {`
- `var commands, folders, _i, folders_1, folder, folderPath, files, _a, files_1, file, filePath, command, _b, _c, key, commandData;`
- `commands = new discord_js_1.Collection();`
- `return [4 /*yield*/, (0, promises_1.readdir)(commandsPath)];`
- `folderPath = (0, node_path_1.join)(commandsPath, folder);`
- `command = _d.sent();`
- `for (_b = 0, _c = Object.keys(command); _b < _c.length; _b++) {`
- `commandData = command[key];`
- `if ((commandData === null || commandData === void 0 ? void 0 : commandData.data) && (commandData === null || commandData === void 0 ? void 0 : commandData.execute)) {`
- `commands.set(commandData.data.name, commandData);`
- `case 8: return [2 /*return*/, commands];`
- `return CommandLoader;`
- `exports.CommandLoader = CommandLoader;`

### `core/loader/PluginLoader.ts`
**Classes:** `PluginLoader`, `prototype`

**Relevant source lines (short excerpts):**
- `Plugin,`
- `PluginMetadata`
- `} from "../plugins/Plugin.js";`
- `export class PluginLoader {`
- `pluginsPath: string`
- `): Promise<Plugin[]> {`
- `const plugins: Plugin[] = [];`
- `* READ PLUGIN DIRECTORY`
- `pluginsPath,`
- `\`[PluginLoader] Failed to read plugins directory "${pluginsPath}":\`,`
- `return plugins;`
- `* LOAD PLUGIN FOLDERS`
- `* plugin.json is optional.`
- `* If it does not exist, the plugin's`
- `"plugin.json"`
- `Partial<PluginMetadata> = {};`
- `"plugin.json must contain a JSON object."`
- `parsed as Partial<PluginMetadata>;`

### `core/loader/EventLoader.ts`
**Classes:** `EventLoader`

**Relevant source lines (short excerpts):**
- `this.registeredEvents.has(`
- `client.once(`
- `client.on(`
- `this.registeredEvents.add(`

### `core/loader/CommandLoader.ts`
**Classes:** `CommandLoader`

**Relevant source lines (short excerpts):**
- `* COMMAND DATA`
- `export interface CommandData {`
- `* COMMAND`
- `export interface Command {`
- `readonly data: CommandData;`
- `access?: "basic" | "premium";`
- `* COMMAND LOADER`
- `* 1. Category-based Core commands`
- `*    commands/`
- `* 2. Root-level Global commands`
- `*    global/commands/`
- `*    └── bankcommand.js`
- `export class CommandLoader {`
- `* LOAD CATEGORY COMMANDS`
- `commandsPath: string`
- `): Promise<Collection<string, Command>> {`
- `const commands =`
- `new Collection<string, Command>();`

### `core/loader/EventLoader.js`

**Relevant source lines (short excerpts):**
- `client.once(eventData.name, function () {`
- `client.on(eventData.name, function () {`

### `core/loader/PluginLoader.js`

**Relevant source lines (short excerpts):**
- `exports.PluginLoader = void 0;`
- `var PluginLoader = /** @class */ (function () {`
- `function PluginLoader() {`
- `PluginLoader.prototype.load = function (pluginsPath) {`
- `var plugins, folders, _i, folders_1, folder, folderPath, metadataPath, fileMetadata, json, _a, files, _b, files_1, file, filePath, pluginModule, _c, _d, key, PluginClass, plugin;`
- `plugins = [];`
- `return [4 /*yield*/, (0, promises_1.readdir)(pluginsPath, {`
- `folderPath = (0, node_path_1.join)(pluginsPath, folder.name);`
- `metadataPath = (0, node_path_1.join)(folderPath, "plugin.json");`
- `pluginModule = _g.sent();`
- `* Find plugin classes.`
- `for (_c = 0, _d = Object.keys(pluginModule); _c < _d.length; _c++) {`
- `PluginClass = pluginModule[key];`
- `if (typeof PluginClass !==`
- `if (!((_e = PluginClass.prototype) === null || _e === void 0 ? void 0 : _e.register)) {`
- `plugin = new PluginClass();`
- `* plugin.ts metadata provides`
- `* plugin.json can override them.`

### `core/client/BotClient.js`
**Event names referenced:** `Ready`

**Relevant source lines (short excerpts):**
- `var CommandManager_js_1 = require("../managers/CommandManager.js");`
- `var GuildPluginManager_js_1 = require("../managers/GuildPluginManager.js");`
- `var PluginManager_js_1 = require("../plugins/PluginManager.js");`
- `discord_js_1.GatewayIntentBits.Guilds,`
- `discord_js_1.GatewayIntentBits.GuildMessages,`
- `_this.services.register("logger", new logger_js_1.Logger());`
- `_this.services.register("events", new EventManager_js_1.EventManager(_this));`
- `_this.services.register("commands", new CommandManager_js_1.CommandManager(_this));`
- `// Guild plugin configuration`
- `// must be registered BEFORE PluginManager`
- `_this.services.register("guildPlugins", new GuildPluginManager_js_1.GuildPluginManager());`
- `// Plugin manager can now safely`
- `// access GuildPluginManager`
- `_this.services.register("plugins", new PluginManager_js_1.PluginManager(_this));`
- `var logger, events, commands, plugins;`
- `commands = this.services.get("commands");`
- `return [4 /*yield*/, (events === null || events === void 0 ? void 0 : events.register())];`
- `return [4 /*yield*/, (commands === null || commands === void 0 ? void 0 : commands.register())];`

### `core/client/BotClient.ts`
**Classes:** `BotClient`
**Event names referenced:** `Ready`

**Relevant source lines (short excerpts):**
- `GatewayIntentBits.Guilds,`
- `GatewayIntentBits.GuildMessages,`
- `GatewayIntentBits.GuildMessageReactions,`
- `GatewayIntentBits.GuildMembers,`
- `GatewayIntentBits.GuildVoiceStates`
- `this.services.register(`
- `"commands",`
- `new CommandManager(this)`
- `* Guild plugin configuration`
- `* PluginManager.`
- `"guildPlugins",`
- `new GuildPluginManager()`
- `* Plugin manager`
- `"plugins",`
- `new PluginManager(this)`
- `await events?.register();`
- `* Register commands`
- `*     Core commands`

### `core/plugins/PluginContext.ts`
**Classes:** `PluginContext`, `PluginCommandManager`

**Relevant source lines (short excerpts):**
- `* PLUGIN COMMAND`
- `* Plugins use the same command`
- `* contract as the core command system.`
- `export type PluginCommand = Command;`
- `export type PluginAccess =`
- `| "premium";`
- `* PLUGIN CONTEXT`
- `export class PluginContext {`
- `public readonly commands: PluginCommandManager;`
- `public readonly guildPlugins: GuildPluginManager;`
- `pluginId: string`
- `* COMMAND MANAGER`
- `const commandManager =`
- `this.services.get<CommandManager>(`
- `"commands"`
- `if (!commandManager) {`
- `"CommandManager service is not registered."`
- `* GUILD PLUGINS`

### `core/plugins/PluginManager.js`

**Relevant source lines (short excerpts):**
- `exports.PluginManager = void 0;`
- `var PluginLoader_js_1 = require("../loader/PluginLoader.js");`
- `var PluginContext_js_1 = require("./PluginContext.js");`
- `var PluginRegistry_js_1 = require("./PluginRegistry.js");`
- `var PluginManager = /** @class */ (function () {`
- `function PluginManager(client) {`
- `this.plugins = new Map();`
- `new PluginRegistry_js_1.PluginRegistry();`
- `this.guildPlugins =`
- `client.services.get("guildPlugins");`
- `PluginManager.prototype.register = function (plugin) {`
- `var id = plugin.metadata.id;`
- `if (this.plugins.has(id)) {`
- `throw new Error("Plugin \"".concat(id, "\" is already loaded"));`
- `var context = new PluginContext_js_1.PluginContext(this.client, id);`
- `this.registry.register(plugin);`
- `this.guildPlugins.registerDefaultPlugin(id);`
- `this.plugins.set(id, plugin);`

### `core/plugins/PluginManager.ts`
**Classes:** `PluginManager`

**Relevant source lines (short excerpts):**
- `export class PluginManager {`
- `private readonly plugins =`
- `new Map<string, Plugin>();`
- `new Map<string, PluginContext>();`
- `public readonly registry: PluginRegistry;`
- `private readonly guildPlugins: GuildPluginManager;`
- `new PluginRegistry();`
- `const guildPlugins =`
- `client.services.get<GuildPluginManager>(`
- `"guildPlugins"`
- `if (!guildPlugins) {`
- `"GuildPluginManager service is not registered."`
- `this.guildPlugins =`
- `guildPlugins;`
- `register(`
- `plugin: Plugin`
- `plugin.metadata.id`
- `"Cannot register a plugin without a valid ID."`

### `core/plugins/PluginContext.js`

**Relevant source lines (short excerpts):**
- `exports.PluginContext = void 0;`
- `var PluginContext = /** @class */ (function () {`
- `function PluginContext(client, pluginId) {`
- `var commandManager = this.services.get("commands");`
- `this.guildPlugins =`
- `this.services.get("guildPlugins");`
- `this.commands =`
- `new PluginCommandManager(commandManager, pluginId);`
- `PluginContext.prototype.on = function (event, listener) {`
- `this.client.on(event, listener);`
- `PluginContext.prototype.once = function (event, listener) {`
- `this.client.once(event, listener);`
- `PluginContext.prototype.removeListeners = function () {`
- `return PluginContext;`
- `exports.PluginContext = PluginContext;`
- `var PluginCommandManager = /** @class */ (function () {`
- `function PluginCommandManager(commandManager, pluginId) {`
- `this.commandManager = commandManager;`

### `core/plugins/PluginRegistry.ts`
**Classes:** `PluginRegistry`

**Relevant source lines (short excerpts):**
- `export interface PluginState {`
- `readonly plugin: Plugin;`
- `export class PluginRegistry {`
- `private readonly plugins =`
- `new Map<string, PluginState>();`
- `register(`
- `plugin: Plugin`
- `plugin.metadata.id`
- `"Cannot register a plugin without a valid ID."`
- `this.plugins.has(id)`
- `\`Plugin with id "${id}" is already registered.\``
- `this.plugins.set(`
- `plugin,`
- `unregister(`
- `return this.plugins.delete(`
- `): PluginState | undefined {`
- `return this.plugins.get(`
- `getAll(): PluginState[] {`

### `core/plugins/PluginRegistry.js`

**Relevant source lines (short excerpts):**
- `exports.PluginRegistry = void 0;`
- `var PluginRegistry = /** @class */ (function () {`
- `function PluginRegistry() {`
- `this.plugins = new Map();`
- `PluginRegistry.prototype.register = function (plugin) {`
- `var id = plugin.metadata.id;`
- `if (this.plugins.has(id)) {`
- `throw new Error("Plugin with id \"".concat(id, "\" is already registered"));`
- `this.plugins.set(id, {`
- `plugin: plugin,`
- `PluginRegistry.prototype.unregister = function (id) {`
- `this.plugins.delete(id);`
- `PluginRegistry.prototype.get = function (id) {`
- `return this.plugins.get(id);`
- `PluginRegistry.prototype.getAll = function () {`
- `return Array.from(this.plugins.values());`
- `PluginRegistry.prototype.has = function (id) {`
- `return this.plugins.has(id);`

## Event and lifecycle inventory

### `core/events/GuildMemberAdd.ts`
- AUTO ROLE
- WELCOME
- Welcome Channel
- Welcome DM
- MEMBER JOIN LOG

### `core/events/InteractionCreate.ts`
- SETUP PANEL BUTTONS
- GUILD ONBOARDING DISMISS
- PREMIUM PANEL
- PREMIUM UNLOCK
- Premium payment record and then
- Prevent unnecessary purchases when
- the server already has Premium.
- OTHER SETUP BUTTONS

### `core/events/MessageCreate.ts`

### `core/events/VoiceStateUpdate.ts`

## Environment and runtime configuration

### `web.ts`
**Environment variables referenced:** `PORT`

### `core/config/Env.js`
**Environment variables referenced:** `BOT_TOKEN`, `CLIENT_ID`, `GUILD_ID`

### `core/config/Env.ts`
**Environment variables referenced:** `BOT_TOKEN`, `CLIENT_ID`, `DASHBOARD_API_SECRET`, `GLOBAL_OWNER_ID`, `GUILD_ID`

## Global services

### `global/GlobalCore.ts`
**Environment variables referenced:** `PORT`, `PREMIUM_CHECKOUT_HOST`, `PREMIUM_CHECKOUT_PORT`
**Classes:** `GlobalCore`

### `global/GlobalHttpServer.ts`
**Classes:** `GlobalHttpServer`

### `global/GuildOnboardingService.ts`
**Classes:** `GuildOnboardingService`

### `global/DashboardServer.ts`
**Classes:** `DashboardServer`

### `global/SiteStatsService.ts`
**Classes:** `SiteStatsService`

### `global/DashboardAutoModService.ts`
**Classes:** `DashboardAutoModService`

### `global/DashboardAuthService.ts`
**Classes:** `DashboardAuthService`

### `global/announcements/GlobalAnnouncementManager.ts`
**Classes:** `GlobalAnnouncementManager`

### `global/events/GlobalEventManager.ts`
**Classes:** `GlobalEventManager`

### `global/server/ServerManager.ts`
**Classes:** `ServerManager`

### `global/payments/GlobalPaymentService.ts`
**Classes:** `GlobalPaymentService`

### `global/payments/GlobalPaymentProcessor.ts`
**Classes:** `GlobalPaymentProcessor`

### `global/commands/GivePremiumCommand.ts`

### `global/commands/GivePremiumApplyCommand.ts`

### `global/commands/GlobalOwnerCommand.ts`

### `global/commands/GlobalCollabCommand.ts`

### `global/commands/BankCommand.ts`

### `global/commands/GlobalAnnouncementCommand.ts`

### `global/banking/Banker.ts`
**Classes:** `Banker`

### `global/premium/PremiumConfig.ts`

### `global/premium/PremiumEntitlementService.ts`
**Classes:** `PremiumEntitlementService`

### `global/premium/PremiumWebhookProcessor.ts`
**Classes:** `PremiumWebhookProcessor`

### `global/premium/PremiumWebhookService.ts`
**Classes:** `PremiumWebhookService`

### `global/premium/PremiumPurchaseClient.ts`
**Classes:** `PremiumPurchaseClient`

### `global/premium/PremiumPaymentFinalizationService.ts`
**Classes:** `PremiumPaymentFinalizationService`

### `global/premium/PremiumPaymentService.ts`
**Classes:** `PremiumPaymentService`

### `global/premium/PremiumPaymentRecoveryService.ts`
**Classes:** `PremiumPaymentRecoveryService`

### `global/premium/PremiumAccessService.ts`
**Classes:** `PremiumAccessService`

### `global/premium/PremiumCheckoutServer.ts`
**Classes:** `PremiumCheckoutServer`

### `global/premium/PremiumPurchaseService.ts`
**Classes:** `PremiumPurchaseService`

### `global/owner/GlobalOwnerService.ts`
**Classes:** `GlobalOwnerService`

### `global/collab/CollabManager.ts`
**Classes:** `CollabManager`

### `global/premium/providers/RazorpayPaymentProvider.ts`
**Classes:** `RazorpayPaymentProvider`

## Cross-cutting permission guidance

- Slash-command builder defaults (where defined) are not the same as every runtime check. Some handlers additionally verify server context, user permissions, bot permissions, role hierarchy, channel type, database availability, or ownership.
- Discord bot permissions required depend on enabled features and actions. Do not assume Administrator is universally required unless a specific setup flow states it.
- Plugin access can be enforced through command metadata or shared plugin/global entitlement logic. The per-plugin docs identify explicit source evidence and flag uncertainty.
- This source snapshot does not include secrets and does not establish which environment variables are configured in production. Never place tokens or API keys in public docs.

## Plugin document index

- [`Leveling`](./leveling.md) — `basic-free`
- [`Tickets`](./tickets.md) — `basic-free`
- [`Advanced AutoMod`](./advanced-automod.md) — `premium`
- [`Anchor`](./anchor.md) — `premium`
- [`AutoMod`](./automod.md) — `basic-free`
- [`Birthday Tracker`](./birthday.md) — `basic-free`
- [`Bulletin`](./bulletin.md) — `premium`
- [`Confessions`](./confessions.md) — `basic-free`
- [`Economy`](./economy.md) — `basic-free`
- [`Games`](./games.md) — `basic-free`
- [`Giveaway`](./giveaway.md) — `premium`
- [`Inventory`](./inventory.md) — `basic-free`
- [`Logging`](./logging.md) — `basic-free`
- [`Moderation`](./moderation.md) — `basic-free`
- [`Opera Assistant`](./opera-assistant.md) — `premium`
- [`Premium Tickets`](./premium-tickets.md) — `premium`
- [`Pressure`](./pressure.md) — `premium`
- [`Reaction Roles`](./reactionroles.md) — `basic-free`
- [`Robbery`](./robbery.md) — `premium`
- [`Store`](./store.md) — `basic-free`
- [`TCG`](./tcg.md) — `basic-free`
- [`Test Plugin`](./test.md) — `basic-free`
- [`Utility`](./utility.md) — `basic-free`
- [`Voice`](./voice.md) — `premium`
- [`Welcome`](./welcome.md) — `basic-free`