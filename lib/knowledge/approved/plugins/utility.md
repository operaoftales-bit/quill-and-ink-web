---
plugin_id: utility
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/utility
---

# Utility

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Useful information and utility commands.

## User-facing commands

**Commands identifier**
/profile - views the profile of user 
/userinfo - views the information about the user.
/botinfo - views the information about the bot.
/serverinfo - views the information about the server.
/bankinfo - views the information about the ink bank.
/networkinfo - views the overall Discord network on the Quill and Ink.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `ProfileRoleStore`
*File:* `plugins/utility/ProfileRoleStore.ts`

**Methods found:** `get()`, `set()`, `remove()`, `importFromJson()`

### `UtilityPlugin`
*File:* `plugins/utility/UtilityPlugin.ts`

**Methods found:** `formatNickel()`

### `ProfileRenderer`
*File:* `plugins/utility/ProfileRenderer.ts`

**Methods found:** `fileURLToPath()`, `render()`, `sharp()`, `reject()`, `createAvatar()`, `clearTimeout()`, `createCard()`, `Number()`, `escape()`

### `ProfileCardService`
*File:* `plugins/utility/ProfileCardService.ts`

**Methods found:** `fileURLToPath()`, `registerFonts()`, `registerFont()`, `create()`, `createCanvas()`, `Number()`, `truncateText()`, `formatNumber()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.

### Explicit source comments / rules

- Fontconfig configuration instead of relying on
- These environment variables must be configured
- Sharp is loaded dynamically after Fontconfig
- has been configured above.
- FONT CONFIGURATION

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/utility/ProfileRoleStore.ts`
- `plugins/utility/UtilityPlugin.ts`
- `plugins/utility/plugin.json`
- `plugins/utility/profile/ProfileRenderer.ts`
- `plugins/utility/services/ProfileCardService.ts`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
