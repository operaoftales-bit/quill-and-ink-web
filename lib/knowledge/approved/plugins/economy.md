---
plugin_id: economy
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/economy
---

# Economy

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Economy system for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/card`
*Defined in:* `plugins/economy/commands/CardCommand.ts`

View and manage your Opera Card.
A card where you can store your hard earned nickel can be transfered from wallet but the user need to transfer minimum of 50 nickel and every transfer has transfer fee. which is taken from that nickel.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/daily`
*Defined in:* `plugins/economy/commands/DailyCommand.ts`

Claim your daily Nickel reward. every user can claim their nickel through this command and the daily nickel earning are configured by the admin which he can config the amount and how it increases and how long it can increase. all the nickel earned from this method will come from the server ink bank and when the bank has no nickel users cannot earn nickel through this method and also the users can only claim every 24 hours

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/dailyconfig`
*Defined in:* `plugins/economy/commands/DailyConfigCommand.ts`

Configure the server

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `amount` — The starting amount of Nickel for the daily reward.
- `method` — How the daily reward changes.
- `increment` — The amount added or multiplier applied to the reward.
- `increase_days` — Number of consecutive claims in the increasing phase.
- `decrease_days` — Number of consecutive claims in the decreasing phase.
- `decrease_enabled` — Whether the reward should decrease after the increase phase.

### `/economy`
*Defined in:* `plugins/economy/commands/EconomyCommand.ts`

Manage the Quill & Ink economy.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Subcommands identified:**
- `/economy earn` — Configure Nickel earning.
- `/economy nickel` — Configure channels where members can earn Nickel.
- `/economy reset` — Reset this server, resets all the nickel related things and restores a new bank. every stored nickel from wallet, card, locker will all be deleted.

### `/give`
*Defined in:* `plugins/economy/commands/GiveCommand.ts`

Give Nickel from the Ink Bank to a member. 

admin only command that can give nickel to any users.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `member` — The member receiving the Nickel.
- `amount` — Amount of Nickel to give.

### `/locker`
*Defined in:* `plugins/economy/commands/LockerCommand.ts`

View your Bank Locker.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

### `/lockerdeposit`
*Defined in:* `plugins/economy/commands/LockerDepositCommand.ts`

Deposit Nickel into your Bank Locker. fixed time period where one puts their nickel here and after 30 days the nickel is available to withdraw with interest of 2%

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `amount` — The amount of Nickel to lock away.

### `/lockerwithdraw`
*Defined in:* `plugins/economy/commands/LockerWithdrawCommand.ts`

Withdraw Nickel from a matured Bank Locker deposit.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `deposit` — The deposit number shown in /locker.

### `/pay`
*Defined in:* `plugins/economy/commands/PayCommand.ts`

Send Nickel to another member. people can send their nickel from their wallet to others wallet by simply using their username and has fees for transferring.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `member` — The member you want to pay.
- `amount` — The amount of Nickel to send.


### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `EconomyPlugin`
*File:* `plugins/economy/EconomyPlugin.ts`

**Methods found:** `async()`, `handleEconomyResetConfirm()`, `handleEconomyResetCancel()`, `handleProfileDaily()`, `BigInt()`, `handleProfileCard()`, `handleWalletToCard()`, `handleWalletToCardSubmit()`, `handleMessageActivity()`, `handleAddChannel()`, `handleChannelSelect()`, `handleRemoveChannel()`, `handleRemoveChannelSelect()`, `safeReply()`, `safeUpdate()`

### `EconomyAccountService`
*File:* `plugins/economy/EconomyAccountService.ts`

**Methods found:** `ensureAccounts()`, `async()`, `processWeeklyWalletTax()`, `transferWalletToOperaCard()`, `depositToBankLocker()`, `getBankLocker()`, `getBankLockerDeposits()`, `withdrawMaturedBankLockerDeposit()`, `acquireRobberyLock()`, `releaseRobberyLock()`, `cleanupExpiredRobberyLocks()`, `isRobberyLocked()`, `withdrawForGame()`, `withdrawRpsPvPWagers()`, `withdrawOddEvenPvPWagers()`, `depositForGame()`, `transferRobberyWinnings()`, `transferPoliceRescueReward()`, `ensureOperaCard()`, `ensureOperaCardWithClient()`, `randomUUID()`, `generateCardCode()`, `randomInt()`, `transferWalletToWallet()`, `transferWalletToWalletInTransaction()`, `holdForStoreInTransaction()`, `refundStoreInTransaction()`, `validatePositiveAmount()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **message event handling**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- Tracks members who have already earned Nickel
- PROFILE → DAILY
- ADD CHANNEL
- REMOVE CHANNEL
- ADD CHANNEL SELECT
- REMOVE CHANNEL SELECT
- PERMISSION RE-CHECK
- in-memory earning state must also
- DAILY QUOTES
- PREMIUM CARD EMBED
- DAILY REWARD CALCULATION
- Never allow the reward to fall
- below the configured starting reward.
- SERVER CONFIGURATION
- CALCULATE REWARD
- Daily rewards do not mint
- Nickel.
- Nickel moves from the
- PREMIUM SUCCESS EMBED
- rather than daily accrued interest.
- Nickel is an integer currency,
- therefore fractional Nickel is
- spending the same Nickel from
- No Nickel is created here.
- wallet balance is above 500 Nickel.
- No Nickel is minted.
- If the Ink Bank cannot fund the
- CHECK TAX INTERVAL
- A wallet of 500 Nickel or
- floors fractional Nickel.
- on the actual mutation so only one
- Transfers Nickel from the member's
- Minimum transfer:
- 50 Nickel
- fractional Nickel.

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/economy/EconomyPlugin.ts`
- `plugins/economy/commands/CardCommand.ts`
- `plugins/economy/commands/DailyCommand.ts`
- `plugins/economy/commands/DailyConfigCommand.ts`
- `plugins/economy/commands/EconomyCommand.ts`
- `plugins/economy/commands/GiveCommand.ts`
- `plugins/economy/commands/LockerCommand.ts`
- `plugins/economy/commands/LockerDepositCommand.ts`
- `plugins/economy/commands/LockerWithdrawCommand.ts`
- `plugins/economy/commands/PayCommand.ts`
- `plugins/economy/plugin.json`
- `plugins/economy/services/EconomyAccountService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
