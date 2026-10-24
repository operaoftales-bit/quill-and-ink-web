---
plugin_id: pressure
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/pressure
---

# Pressure

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

Multiplayer wagered card game for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

This is not protected by redeployments so when the bot is redeployed the table will no longer work, maybe fixed on future

### `/pressure`
*Defined in:* `plugins/pressure/commands/PressureCommand.ts`

Create a public Pressure table.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/pressure-remove`
*Defined in:* `plugins/pressure/commands/PressureRemoveCommand.ts`

Remove the Pressure table from this channel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `PressurePlugin`
*File:* `plugins/pressure/PressurePlugin.ts`

**Methods found:** `async()`, `createPressureCommand()`, `createPressureRemoveCommand()`, `handleTableCreated()`, `handleGameStarted()`, `handleTurnChanged()`, `scheduleTurnTimer()`, `notifyCurrentTurn()`, `notifyGameStarted()`, `getAvailableActions()`, `handleGameFinished()`, `persistSettlementResult()`, `getSettlementGuildId()`, `handleCooldownExpired()`, `handleTableRemoved()`, `clearSessionNotificationState()`, `setChannelPermissions()`, `Boolean()`, `getSendMessagesPermission()`, `import()`, `restoreChannelPermissions()`, `clearCooldownTimer()`, `clearTurnTimer()`

### `PressureInteractionHandler`
*File:* `plugins/pressure/PressureInteractionHandler.ts`

**Methods found:** `handleInteraction()`, `handleMessage()`, `parseGameplayCommand()`, `Number()`, `BigInt()`, `handleButton()`, `handleModal()`, `openBuyInModal()`, `handleBuyIn()`, `getRobberyHeadquarters()`, `leaveLobby()`, `showPrivateHand()`, `showHowToPlay()`, `updateTableMessage()`, `getTableStatus()`, `getTableDescription()`, `sendGameplayError()`, `replyError()`, `getErrorMessage()`

### `PressureCardRenderer`
*File:* `plugins/pressure/PressureCardRenderer.ts`

**Methods found:** `fileURLToPath()`, `renderHand()`, `createCanvas()`, `drawBackground()`, `drawCard()`, `drawSuit()`, `getCardColor()`, `roundRect()`

### `PressureDeckService`
*File:* `plugins/pressure/PressureDeckService.ts`

**Methods found:** `createDeck()`, `shuffle()`, `draw()`, `deal()`, `dealFromDeck()`, `getRemainingCards()`, `createCardId()`

### `PressureInteraction`
*File:* `plugins/pressure/PressureInteraction.ts`

**Methods found:** `handleButton()`, `viewCards()`

### `PressureService`
*File:* `plugins/pressure/PressureService.ts`

**Methods found:** `createSession()`, `getSession()`, `getSettlementResult()`, `getWaitingLobby()`, `getTable()`, `getAvailableTable()`, `getPlayerSession()`, `addPlayer()`, `removePlayer()`, `startSession()`, `getPlayer()`, `getPlayerHand()`, `getHands()`, `getRemainingDeck()`, `getDiscardedCards()`, `getCurrentPlayer()`, `getPlayerByPosition()`, `passCard()`, `raise()`, `call()`, `allIn()`, `fold()`, `expireCurrentTurn()`, `claimHighPressure()`, `claimSuperPressure()`, `hasHighPressure()`, `hasSuperPressure()`, `advanceTurn()`, `finishSession()`, `cancelSession()`, `deleteSession()`, `getActiveSessions()`, `markWageringResponse()`, `advanceToNextWageringPlayer()`, `advanceAfterWageringResponse()` …

### `PressureTableRenderer`
*File:* `plugins/pressure/PressureTableRenderer.ts`

**Methods found:** `fileURLToPath()`, `renderTable()`, `drawBackground()`, `drawWoodenFrame()`, `drawFelt()`, `drawFeltDetails()`, `getSeatPositions()`, `drawEmptySeat()`, `drawOccupiedSeat()`, `drawAvatarFallback()`, `drawUsername()`, `drawBalance()`, `drawActiveLabel()`, `drawCenter()`, `formatNickel()`, `roundRect()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **message event handling**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- - Discord channel permissions
- - Match cooldowns
- - Wagering
- COOLDOWN TIMERS
- allowing the timeout to fold the player.
- This prevents an old timeout from affecting a later
- ACTIVE PLAYER PERMISSIONS
- ORIGINAL PERMISSION SNAPSHOTS
- Pressure gameplay is Premium.
- It should not become unusable merely because Premium
- Notification failure must never interrupt
- The timeout folds the current player
- player acts before the timeout.
- Only mark the notification as delivered after
- Only the portion represented by inkBankAmount is
- This is existing Nickel from the Pressure pot.
- No Nickel is minted here.
- remainder when the remaining 25% cannot be divided
- This operation only moves existing Nickel into the
- server reserve. It never mints Nickel.
- duplicate finish callback cannot process it again.
- COOLDOWN EXPIRED
- SET CHANNEL PERMISSIONS
- GET SEND MESSAGES PERMISSION
- RESTORE CHANNEL PERMISSIONS
- CLEAR COOLDOWN TIMER
- PressureTableRenderer is responsible only for the
- PressurePlugin owns the Discord channel lifecycle.
- Called only after the persistent Discord table message
- the dedicated Pressure channel permissions.
- The command itself does not own Discord channel permissions.
- The slash-command permission is already restricted
- CHANNEL VALIDATION
- Pressure requires a concrete Discord channel because
- message in that channel.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/pressure/PressurePlugin.ts`
- `plugins/pressure/commands/PressureCommand.ts`
- `plugins/pressure/commands/PressureRemoveCommand.ts`
- `plugins/pressure/handlers/PressureInteractionHandler.ts`
- `plugins/pressure/models/PressureCard.ts`
- `plugins/pressure/models/PressurePlayer.ts`
- `plugins/pressure/models/PressureSession.ts`
- `plugins/pressure/services/PressureCardRenderer.ts`
- `plugins/pressure/services/PressureDeckService.ts`
- `plugins/pressure/services/PressureInteraction.ts`
- `plugins/pressure/services/PressureService.ts`
- `plugins/pressure/services/PressureTableRenderer.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
