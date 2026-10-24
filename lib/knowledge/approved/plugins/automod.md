---
plugin_id: automod
access: basic-free
premium: false
review_status: source-grounded-draft
source_root: plugins/automod
---

# AutoMod

**Access classification:** Basic/free.

**Basis:** No explicit Premium gate was found in the plugin-scoped source files supplied; classified as basic/free for this documentation pass. Verify shared entitlement enforcement if the plugin is gated outside its own folder.

## Overview

Automatic moderation tools for Quill & Ink.

## User-facing commands

No slash-command builder was found inside this plugin folder. The plugin may be event-driven, or its controls may be registered through shared code.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.
All rules are hardcoded so this feature can't be configured, while a set filter is given by the bot itself and moderates by it.
can be enabled or disabled by /setup command or by simply doing /disable plugin automod.

**Methods found:** `handleAdvancedDetection()`, `handleMessage()`, `handleRepeatedMessage()`, `deleteAndWarn()`, `cleanupTrackers()`, `clearTrackers()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **message event handling**.

### Explicit source comments / rules

- PluginContext owns the interval, so
- the Discord listener and cleanup interval.
- CONFIGURATION
- configured WORD_FILTER rule.
- ADVANCED-ONLY DETECTION
- rule is configured.
- This allows a configured
- available/configured between
- A configured Advanced
- configured Advanced rule.
- is configured.
- a temporary channel message
- the service cannot accumulate

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/automod/AutoModPlugin.ts`
- `plugins/automod/AutoModService.ts`
- `plugins/automod/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
