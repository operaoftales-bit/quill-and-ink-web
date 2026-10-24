---
plugin_id: advanced-automod
premium: True
access: premium
review_status: source-analysis-draft
source_basis: uploaded static Tracebook export
---

# Advanced AutoMod

**Access:** Premium required

Premium-gated: this export contains an explicit `premium: true` marker. The feature requires Premium according to the project's stated marker convention.

## Overview

Configurable advanced moderation tools for Quill & Ink.

## How to read this document

This document was reconstructed from the source files listed below. It distinguishes declared command definitions from helper code. The export is static: it does not prove that a command is registered in a live bot, that the current server has enabled a feature, or that runtime permissions/configuration allow a specific action.

## Commands

No standalone slash-command source file was found in this export. This plugin may be event-driven, register commands elsewhere, or have command definitions omitted from this scoped export. This is not a claim that the plugin has no user-facing controls.

## Services and implementation components

The following classes are present in the exported source. Their method names indicate the responsibilities implemented; method names alone are not treated as proof of user-visible behaviour.

### `AdvancedAutoModPlugin`
*Source file:* `AdvancedAutoModPlugin.ts`
*Role inferred from source structure:* Plugin registration and event/interaction orchestration.

### `AdvancedAutoModService`
*Source file:* `AdvancedAutoModService.ts`
*Role inferred from source structure:* Supporting service/manager.

**Methods found:** `trackMessageSpam()`, `isCapsSpam()`, `isEmojiSpam()`, `clearTrackers()`, `handleMentionSpam()`, `handleWordFilter()`, `handleDetection()`, `isIgnored()`, `executeRule()`, `executeAction()`, `deleteMessage()`, `createWarning()`, `sendWarningMessage()`, `timeoutMember()`, `kickMember()`, `banMember()`

## Important behaviour and limitations

- The implementation references the database layer; actual database state was not inspected.
- The implementation contains timer/scheduled-work code; exact live timing depends on runtime lifecycle and configuration.
- there are no commands that can work on the discord so all the configurations should be done on the dashboard.

DASHBOARD_URL=`"https://quill-and-ink-web.vercel.app/dashboard"`.

## Source files analysed

- `src/plugins/advanced-automod/AdvancedAutoModPlugin.ts`
- `src/plugins/advanced-automod/AdvancedAutoModService.ts`

## Review notes

- Confirm command registration and permission checks in the running bot before publishing as definitive user documentation.
- Confirm any server setup steps and required Discord permissions from the relevant handler/configuration code.
- Premium classification follows the requested file-marker rule (`premium: true` anywhere in this plugin export). No marker means basic/free.
