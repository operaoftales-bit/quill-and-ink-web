---
plugin_id: store
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/store
---

# Store

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Server stores with Nickel purchases and configurable Store staff.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/store`
*Defined in:* `plugins/store/commands/StoreCommand.ts`

Set up and manage the server Store.

**Access/permission metadata in command source:**
- `basic`

**Subcommands identified:**
- `/store setup` — Create the persistent Store panel in this channel.
- `/store recover` — Recover the Store panel in this channel without resetting Store data.
- `/store edit` — Manage Store categories and items.
- `/store action` — Choose the Store operation.
- `/store staff` — Manage Store staff.
- `/store role-add` — Add a Store staff role.
- `/store role` — The role authorized to manage Store purchases.
- `/store role-remove` — Remove a Store staff role.
- `/store role` — The Store staff role to remove.
- `/store role-list` — List configured Store staff roles.
- `/store member-add` — Add an individual Store staff member.
- `/store member` — The member authorized to manage Store purchases.
- `/store member-remove` — Remove an individual Store staff member.
- `/store member` — The Store staff member to remove.
- `/store member-list` — List configured Store staff members.

**Options identified:**
- `action` — Choose the Store operation.
- `item-code` — Item code used to identify the item.
- `name` — Category or item name.
- `description` — Item description.
- `price` — Item price in Nickel.
- `stock` — Native item stock.
- `type` — Item type.
- `category-id` — Category ID.
- `image-url` — Optional image URL.
- `role` — The role authorized to manage Store purchases.
- `role` — The Store staff role to remove.
- `member` — The member authorized to manage Store purchases.
- `member` — The Store staff member to remove.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `StorePlugin`
*File:* `plugins/store/StorePlugin.ts`

**Methods found:** `async()`, `handleInteraction()`, `handleItemSelection()`, `handlePurchase()`, `handlePurchaseConfirmation()`, `handlePurchaseCancellation()`, `handleAccept()`, `handleCancel()`, `handleComplete()`, `isStaffAuthorized()`, `updatePurchaseMessage()`, `getItemForPurchase()`, `handleInteractionError()`, `sendFollowUpError()`, `getPurchaseErrorMessage()`, `getPurchaseActionErrorMessage()`, `buildPurchaseThreadName()`

### `StoreRenderer`
*File:* `plugins/store/StoreRenderer.ts`

**Methods found:** `refreshStorePanel()`, `buildPanel()`, `buildItemDetails()`, `buildPurchaseConfirmation()`, `buildPurchaseThreadMessage()`, `getSafePage()`, `formatNickel()`, `truncate()`

### `StoreService`
*File:* `plugins/store/StoreService.ts`

**Methods found:** `getStoreConfig()`, `createStoreConfig()`, `recoverStore()`, `getStoreCategories()`, `getStoreCategoryById()`, `createStoreCategory()`, `removeStoreCategory()`, `async()`, `getStoreItems()`, `getItem()`, `getItemById()`, `getItemByCode()`, `createStoreItem()`, `updateStoreItem()`, `removeStoreItem()`, `getPurchasesToday()`, `validatePurchase()`, `createPurchase()`, `createNativePurchase()`, `acceptPurchase()`, `cancelPurchase()`, `completePurchase()`, `addStaffRole()`, `removeStaffRole()`, `listStaffRoles()`, `addStaffMember()`, `removeStaffMember()`, `listStaffMembers()`, `isAuthorizedStaff()`, `validateStockValue()`, `resolveCreateStock()`, `normalizeItemImageUrl()`, `toItemEntry()`, `toPurchaseResult()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **select menus**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- The Purchase button only opens
- This handler only validates that the
- then StoreService holds Nickel and
- No Store channel or thread is
- Nickel and inventory transaction.
- Buyer must always be able to access
- Load configured Store staff.
- configured staff roles.
- Add configured staff members.
- only after the private thread exists.
- StoreService performs the Nickel hold
- held Nickel is refunded before cleanup.
- stock must be supplied in the same edit unless
- Only add the navigation row when pagination
- STORE CONFIGURATION
- - stock must always be a valid integer.
- stock must be explicitly supplied.
- - stock must always be null.
- Every External item must have
- Hold the buyer's Nickel.
- Move the held Nickel into the

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/store/StorePlugin.ts`
- `plugins/store/commands/StoreCommand.ts`
- `plugins/store/renderers/StoreRenderer.ts`
- `plugins/store/services/StoreService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
