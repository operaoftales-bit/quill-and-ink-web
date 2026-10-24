---
plugin_id: games
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/games
---

# Games

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Games and gambling system for Quill & Ink.

## User-facing commands

**Commands identifier**
/rps - play rock paper scissors with user. includes wager gameplay and can be played between player vs player and player vs bank.
/slots - spin a slot wager between 20-500.
/oddoreven - play a game odd or even with another player and choose wager.
/dice - roll a dice and multiply your nickel, contains player vs player and player vs bank.


### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.


## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `GamesPlugin`
*File:* `plugins/games/GamesPlugin.ts`

**Methods found:** `handleInteraction()`, `destroy()`, `async()`, `validateModules()`, `routeInteraction()`, `recordQualifyingWager()`, `replyToExpiredInteraction()`, `replyToInteractionError()`

### `DiceGameModule`
*File:* `plugins/games/DiceGameModule.ts`

**Methods found:** `handleInteraction()`, `destroy()`, `startGame()`, `rollDice()`, `rollDie()`, `countWinningCombinations()`, `matchesPrediction()`, `calculatePayout()`, `formatPrediction()`

### `OddEvenGameModule`
*File:* `plugins/games/OddEvenGameModule.ts`

**Methods found:** `clearTimeout()`

### `RpsGameModule`
*File:* `plugins/games/RpsGameModule.ts`

### `SlotsGameModule`
*File:* `plugins/games/SlotsGameModule.ts`

**Methods found:** `handleInteraction()`, `destroy()`, `startGame()`

### `SlotRenderer`
*File:* `plugins/games/SlotRenderer.ts`

**Methods found:** `render()`, `async()`, `createMachineSvg()`, `getEmojiAsset()`, `downloadEmoji()`, `prepareEmoji()`

### `DiceService`
*File:* `plugins/games/DiceService.ts`

**Methods found:** `roll()`, `rollDie()`, `calculateExactPayout()`, `calculateRangePayout()`, `getCombinationsForExact()`, `calculatePayout()`, `BigInt()`, `Number()`, `validateWager()`

### `GameAccessService`
*File:* `plugins/games/GameAccessService.ts`

### `GamesEconomyService`
*File:* `plugins/games/GamesEconomyService.ts`

**Methods found:** `validateWager()`, `validateRpsWager()`, `validateOddEvenWager()`, `ensurePlayer()`, `settleGame()`, `settleExistingWager()`, `settleRpsPvP()`, `settleRpsAgainstBank()`, `settleOddEvenPvP()`

### `GamesPayoutService`
*File:* `plugins/games/GamesPayoutService.ts`

### `OddEvenService`
*File:* `plugins/games/OddEvenService.ts`

**Methods found:** `validateChoice()`, `validateNumber()`, `determineWinner()`, `getChoiceName()`, `getChoiceEmoji()`

### `RpsService`
*File:* `plugins/games/RpsService.ts`

**Methods found:** `determineWinner()`, `getMoveName()`, `getMoveEmoji()`

### `SlotService`
*File:* `plugins/games/SlotService.ts`

**Methods found:** `spin()`, `randomSymbol()`, `getThreeMatchMultiplier()`, `getTwoMatchMultiplier()`, `calculatePayout()`, `BigInt()`, `getSymbolEmoji()`, `getSymbolName()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.

### Explicit source comments / rules

- Records a qualifying wager after a successful withdrawal.
- Game modules must not call this before the wager has actually
- been collected. Zero-value games must not call it.
- PluginManager does not await onUnload(), so cleanup must not
- Game cleanup must remain synchronous because the current
- Robbery integration is resolved at wager time rather than
- to record a robbery wager is logged and does not reverse an
- PREMIUM QUILL & INK SLOT RENDERER
- - Render the premium slot-machine UI.
- DICE CONFIGURATION
- the existing maximum of 3×.
- Nickel is stored as bigint.
- rounded down to whole Nickel.
- WAGER VALIDATION
- WAGER LIMITS
- RPS WAGER LIMITS
- ODD/EVEN WAGER LIMITS
- RPS WAGER VALIDATION
- ODD/EVEN WAGER VALIDATION
- SETTLE EXISTING WAGER
- The player's wager has already
- Player receives 2 × wager.
- Player's wager remains in
- Player receives their wager
- The wager has already
- matching wager.
- complete two-wager pot.
- original wager.
- The wager remains in
- contains the wager.
- Withdraws a single player's wager using the established wallet-first,
- The caller must ensure the wager has not already been withdrawn.
- Atomically withdraws both RPS PvP wagers.
- Atomically withdraws both Odd or Even PvP wagers.
- Settles a single-player game whose wager has already been withdrawn.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/games/GamesPlugin.ts`
- `plugins/games/modules/DiceGameModule.ts`
- `plugins/games/modules/OddEvenGameModule.ts`
- `plugins/games/modules/RpsGameModule.ts`
- `plugins/games/modules/SlotsGameModule.ts`
- `plugins/games/plugin.json`
- `plugins/games/renderers/SlotRenderer.ts`
- `plugins/games/services/DiceService.ts`
- `plugins/games/services/GameAccessService.ts`
- `plugins/games/services/GamesEconomyService.ts`
- `plugins/games/services/GamesPayoutService.ts`
- `plugins/games/services/OddEvenService.ts`
- `plugins/games/services/RpsService.ts`
- `plugins/games/services/SlotService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
