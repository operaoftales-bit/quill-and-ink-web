---
plugin_id: voice
premium: true
access: premium
review_status: source-analysis-draft
source_basis: uploaded static Tracebook export
---

# Voice

**Access:** Premium required

Premium-gated: this export contains an explicit `premium: true` marker. The feature requires Premium according to the project's stated marker convention.

## Overview

Temporary voice channel management for Quill & Ink.

## How to read this document

This document was reconstructed from the source files listed below. It distinguishes declared command definitions from helper code. The export is static: it does not prove that a command is registered in a live bot, that the current server has enabled a feature, or that runtime permissions/configuration allow a specific action.

## Commands

No standalone slash-command source file was found in this export. This plugin may be event-driven, register commands elsewhere, or have command definitions omitted from this scoped export. This is not a claim that the plugin has no user-facing controls.

This event driven when a user clicks the voice channel which named "Creat Voice Channel" exactly, creates a temporary voice channel which is then moves the user to that channel so only one voice channel is needed and the temporary channels will be deleted when the owner of the channel left, making the temporary channel delete itself, no limit for the channel creation and works perfectly when the main channel which has that name has permission for the bot to view channe, manage channel, move members.

## Services and implementation components

The following classes are present in the exported source. Their method names indicate the responsibilities implemented; method names alone are not treated as proof of user-visible behaviour.

### `VoicePlugin`
*Source file:* `VoicePlugin.ts`
*Role inferred from source structure:* Plugin registration and event/interaction orchestration.

### `from`
*Source file:* `VoiceService.ts`
*Role inferred from source structure:* Supporting implementation class.

**Methods found:** `info()`, `warn()`, `error()`, `handleVoiceState()`, `deleteEmptyTemporaryChannel()`, `findTemporaryChannelForMember()`, `fetchMember()`, `createTemporaryChannelName()`, `isTemporaryChannel()`

### `VoiceService`
*Source file:* `VoiceService.ts`
*Role inferred from source structure:* Supporting service/manager.

**Methods found:** `info()`, `warn()`, `error()`, `handleVoiceState()`, `deleteEmptyTemporaryChannel()`, `findTemporaryChannelForMember()`, `fetchMember()`, `createTemporaryChannelName()`, `isTemporaryChannel()`

## Important behaviour and limitations

- The export does not provide enough evidence to summarize additional runtime behaviour without inspecting the relevant method bodies in more detail.

## Source files analysed

- `src/plugins/voice/plugin.json`
- `src/plugins/voice/VoicePlugin.ts`
- `src/plugins/voice/VoiceService.ts`

## Review notes

- Confirm command registration and permission checks in the running bot before publishing as definitive user documentation.
- Confirm any server setup steps and required Discord permissions from the relevant handler/configuration code.
- Premium classification follows the requested file-marker rule (`premium: true` anywhere in this plugin export). No marker means basic/free.
