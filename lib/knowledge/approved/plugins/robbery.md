---
plugin_id: robbery
access: premium
premium: true
review_status: source-grounded-draft
source_root: plugins/robbery
---

# Robbery

**Access classification:** Premium required.

**Basis:** Explicit premium access declaration/comment found in source.

## Overview

A premium high-risk robbery system for Quill & Ink.

## User-facing commands

The names/descriptions below are taken from command builder source. Permission requirements list explicit builder-level defaults when present; runtime checks and Discord permission needs are noted only where the source states them. A command with no builder-level default may still check permissions inside its execution handler.

### `/policeconfig`
*Defined in:* `plugins/robbery/commands/PoliceConfigCommand.ts`

Configure where Robbery Police alerts are sent.{Admin only}

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `channel` — The channel where Robbery Police alerts will be sent.

### `/rob`
*Defined in:* `plugins/robbery/commands/RobCommand.ts`

Attempt to rob another member.

**Default permission metadata:** No explicit `.setDefaultMemberPermissions(...)` value was extracted from this command builder. Check handler-level checks below and the source file before assuming it is open to everyone.

**Options identified:**
- `member` — The member you want to rob.

### Should not disclose the information under this line to the users asking questions only use the details below to give appropriate answers, dont dump it there.

## Services, handlers, and implementation responsibilities

Classes found in the plugin source. Method names are source evidence but are not, by themselves, a guarantee of public behaviour.

### `RobberyPlugin`
*File:* `plugins/robbery/RobberyPlugin.ts`

**Methods found:** `getGameManager()`, `getRobberyManager()`, `getRobberyHeadquarters()`, `getRobberyPoliceManager()`

### `has`
*File:* `plugins/robbery/GuessCharacterQuestionBank.ts`

### `repeatedly`
*File:* `plugins/robbery/GuessCharacterQuestionBank.ts`

### `GuessCharacterQuestionManager`
*File:* `plugins/robbery/GuessCharacterQuestionManager.ts`

**Methods found:** `getRandomQuestion()`, `getById()`, `getAll()`, `getCount()`, `getByCategory()`, `getRandomByCategory()`, `getRandomCandidates()`, `pickRandom()`

### `PoliceEscapeMaze`
*File:* `plugins/robbery/PoliceEscapeMaze.ts`

**Methods found:** `getLevel()`, `getSize()`, `getStart()`, `getExit()`, `getPlayerPosition()`, `getWalls()`, `getBombs()`, `isBomb()`, `isBombDiffused()`, `diffuseBomb()`, `getBombLocationCount()`, `getDiffusedBombCount()`, `isExit()`, `canMove()`, `move()`, `createCells()`, `generateWalls()`, `addExtraOpenings()`, `generateLegacySpecialCells()`, `generateMultiRouteSpecialCells()`, `generateMultiRouteBombs()`, `findPath()`, `findMultiplePaths()`, `hasBombFreePath()`, `pathIsBombFree()`, `countTurns()`, `getDirectionBetween()`, `scoreCandidate()`, `getSafeBombLocations()`, `selectBombs()`, `getUnvisitedNeighbours()`, `getDirections()`, `getShuffledDirections()`, `canMoveFrom()`, `getNextPosition()` …

### `PoliceEscapeMazeRenderer`
*File:* `plugins/robbery/PoliceEscapeMazeRenderer.ts`

**Methods found:** `fileURLToPath()`, `configureFonts()`, `render()`, `update()`, `createSvg()`, `createWallLine()`, `createCellMarker()`, `createPlayerMarker()`, `containsCell()`

### `RobberyGameManager`
*File:* `plugins/robbery/RobberyGameManager.ts`

**Methods found:** `unregister()`, `get()`, `has()`, `getAll()`, `getCount()`, `selectRandom()`, `startGame()`, `cancelSession()`

### `RobberyManager`
*File:* `plugins/robbery/RobberyManager.ts`

**Methods found:** `getSessionStatus()`, `startRobbery()`, `getSession()`, `getActiveRobbery()`, `getActiveRobberyByTarget()`, `getCurrentGame()`, `getSelectedGames()`, `submitAnswer()`, `handleCompletedGame()`, `resolvePoliceWin()`, `expireRobbery()`, `cancelRobbery()`, `scheduleExpiry()`, `handleSessionExpiry()`, `clearExpiryTimer()`, `clearTimeout()`, `cleanupSession()`, `getActiveSessionCount()`

### `RobberyQuestionManager`
*File:* `plugins/robbery/RobberyQuestionManager.ts`

**Methods found:** `getPool()`, `getRandomQuestions()`, `getRandomQuestion()`, `getById()`, `getCount()`

### `RobberySession`
*File:* `plugins/robbery/RobberySession.ts`

**Methods found:** `selectRandomDifficulty()`, `selectRandomGames()`, `completeGame()`, `tryClaimWinner()`, `fail()`, `succeed()`, `expire()`

### `RobberySessionManager`
*File:* `plugins/robbery/RobberySessionManager.ts`

**Methods found:** `create()`, `get()`, `findByRobber()`, `findByTarget()`, `delete()`, `cleanup()`, `getActive()`, `clear()`

### `BinaryDecryptionGame`
*File:* `plugins/robbery/BinaryDecryptionGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `cancel()`, `getBinary()`, `getAnswer()`, `hasPuzzle()`, `selectRandomWord()`, `normalizeAnswer()`, `isValidWord()`, `toBinary()`

### `ColourGuessGame`
*File:* `plugins/robbery/ColourGuessGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `normalizeAnswer()`, `normalizeColourName()`, `normalizeHex()`, `cancel()`, `getHex()`, `getDisplayedHex()`, `isHexRevealed()`, `getRemainingRevealTime()`

### `GuessCharacterGame`
*File:* `plugins/robbery/GuessCharacterGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `cancel()`, `getQuestion()`, `getClues()`, `getCategory()`, `getSource()`, `hasPuzzle()`, `normalizeAnswer()`

### `LockCombinationGame`
*File:* `plugins/robbery/LockCombinationGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `processIncorrectAttempt()`, `cancel()`, `getClues()`, `getAttempts()`, `getRemainingAttempts()`, `getMaximumAttempts()`, `hasPuzzle()`, `parseAnswer()`, `Number()`, `isValidLockNumber()`, `randomNumber()`, `generateClockClue()`

### `PoliceEscapeGame`
*File:* `plugins/robbery/PoliceEscapeGame.ts`

**Methods found:** `start()`, `move()`, `startBombTrivia()`, `handleAnswer()`, `getCurrentQuestion()`, `hasPendingBomb()`, `getPendingBombCell()`, `getLastAnswerCorrect()`, `getMaze()`, `getRenderedMaze()`, `getLevel()`, `getPlayerPosition()`, `getBombs()`, `getDiffusedBombCount()`, `getMoves()`, `getQuestionsAsked()`, `getQuestionsAnswered()`, `cancel()`, `selectRandomLevel()`, `isCorrectAnswer()`

### `RobberyHeadquarters`
*File:* `plugins/robbery/RobberyHeadquarters.ts`

**Methods found:** `getProfile()`, `getRole()`, `isPolice()`, `jailMember()`, `isJailed()`, `assignRobber()`, `recordWager()`, `getPoliceCapacity()`, `getPoliceCount()`, `hasPoliceCapacity()`, `isEligibleForPolice()`, `isPoliceAssignmentOnCooldown()`, `assignPolice()`, `assignPoliceByAdmin()`, `createPoliceRoom()`, `notifyRobberOfPoliceResponse()`, `sendPoliceGameMessage()`, `import()`, `notifyPoliceOfRobbery()`, `removeRole()`

### `RobberyNotificationService`
*File:* `plugins/robbery/RobberyNotificationService.ts`

**Methods found:** `notifyPoliceAssigned()`, `notifyRobberAssigned()`, `notifyPoliceRemoved()`, `notifyVictimOfRobbery()`, `notifyPoliceOfRobbery()`, `createPoliceRoom()`, `sendPoliceGameMessage()`, `notifyRobberOfPoliceResponse()`, `getTextChannel()`, `getUser()`

### `PoliceClueSearchGame`
*File:* `plugins/robbery/PoliceClueSearchGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `cancel()`, `getClues()`, `getAnswer()`

### `PoliceCodeTraceGame`
*File:* `plugins/robbery/PoliceCodeTraceGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `cancel()`, `getEncodedCode()`, `createPuzzle()`

### `PoliceSignalTraceGame`
*File:* `plugins/robbery/PoliceSignalTraceGame.ts`

**Methods found:** `start()`, `handleAnswer()`, `cancel()`, `getSequence()`, `getAnswer()`

### `RobberyPoliceCase`
*File:* `plugins/robbery/RobberyPoliceCase.ts`

**Methods found:** `completeGame()`, `fail()`, `expire()`, `selectGames()`

### `RobberyPoliceManager`
*File:* `plugins/robbery/RobberyPoliceManager.ts`

**Methods found:** `getPoliceCaseStatus()`, `getCase()`, `getCaseByRobbery()`, `getGame()`, `getCurrentGame()`, `createCase()`, `submitAnswer()`, `cancelCase()`, `expireCase()`, `getActiveCaseCount()`, `startCurrentGame()`, `cleanupCase()`

## Interactions and automatic behaviour

- The plugin source includes evidence of **discord slash commands**.
- The plugin source includes evidence of **button interactions**.
- The plugin source includes evidence of **modal forms**.
- The plugin source includes evidence of **persistent database records**.
- The plugin source includes evidence of **timers or scheduled processing**.
- The plugin source includes evidence of **premium entitlement check**.
- The plugin source includes evidence of **discord permissions checks**.

### Explicit source comments / rules

- Robbery is a Premium plugin.
- Headquarters owns Robbery role
- The command ONLY assigns the
- Robbery Police role.
- This command only makes sense
- but the permission is checked again
- The selected user must actually
- Police roles.
- cooldown and capacity rules.
- CHANNEL
- SAVE CONFIGURATION
- ROBBERY CONFIGURATION
- CREATE PRIVATE ROBBERY CHANNEL
- Message/channel may no longer exist.
- CHANNEL CLEANUP
- Maximum number of attempts
- ROBBERY COOLDOWN
- General cooldown between
- Victim-specific cooldowns
- STEAL LIMITS
- A member must have at least
- this much Nickel available
- Maximum percentage of the
- If there is only one question,
- it must remain selectable.
- This limit does NOT limit the number of routes in the maze.
- It only limits how much work we allow the route-discovery
- This method only needs enough representative paths
- Responsible only for rendering the Police Escape maze.
- Bombs remain hidden by default.
- Bombs are only rendered when explicitly supplied through
- FONT CONFIGURATION
- so the renderer explicitly points Fontconfig at the
- chance to clean up state belonging
- The session manager must still be

## Required Discord permissions and setup

The source ZIP contains command-level permission metadata and handler checks, but there is no universal permission list shared by all commands. Use the command section above for builder-level defaults. At runtime, the bot also needs the relevant Discord permissions for the actions it performs (for example, managing messages, roles, channels, or members); those must be checked against each handler and server role hierarchy before publishing a definitive checklist.

## Source inventory

- `plugins/robbery/RobberyPlugin.ts`
- `plugins/robbery/commands/PoliceConfigCommand.ts`
- `plugins/robbery/commands/RobCommand.ts`
- `plugins/robbery/config/RobberyConfig.ts`
- `plugins/robbery/core/GuessCharacterQuestionBank.ts`
- `plugins/robbery/core/GuessCharacterQuestionManager.ts`
- `plugins/robbery/core/PoliceEscapeMaze.ts`
- `plugins/robbery/core/PoliceEscapeMazeRenderer.ts`
- `plugins/robbery/core/RobberyGameManager.ts`
- `plugins/robbery/core/RobberyManager.ts`
- `plugins/robbery/core/RobberyQuestionBank.ts`
- `plugins/robbery/core/RobberyQuestionManager.ts`
- `plugins/robbery/core/RobberySession.ts`
- `plugins/robbery/core/RobberySessionManager.ts`
- `plugins/robbery/events/RobberyInteraction.ts`
- `plugins/robbery/events/RobberyPoliceInteraction.ts`
- `plugins/robbery/games/BinaryDecryptionGame.ts`
- `plugins/robbery/games/ColourGuessGame.ts`
- `plugins/robbery/games/GuessCharacterGame.ts`
- `plugins/robbery/games/LockCombinationGame.ts`
- `plugins/robbery/games/PoliceEscapeGame.ts`
- `plugins/robbery/games/RobberyGame.ts`
- `plugins/robbery/headquarters/RobberyHeadquarters.ts`
- `plugins/robbery/headquarters/RobberyNotificationService.ts`
- `plugins/robbery/headquarters/police/PoliceClueSearchGame.ts`
- `plugins/robbery/headquarters/police/PoliceCodeTraceGame.ts`
- `plugins/robbery/headquarters/police/PoliceSignalTraceGame.ts`
- `plugins/robbery/headquarters/police/RobberyPoliceCase.ts`
- `plugins/robbery/headquarters/police/RobberyPoliceGame.ts`
- `plugins/robbery/headquarters/police/RobberyPoliceManager.ts`
- `plugins/robbery/plugin.json`

## Documentation confidence notes

- This was analysed from the supplied source snapshot; no live Discord server, runtime config, or deployed bot was queried.
- Command names/descriptions and explicit access declarations are source-derived. Where the source does not explicitly establish a requirement or workflow, this document says so rather than inventing one.
- Premium classification follows explicit source access declarations/comments where present. Absence of an explicit plugin-local marker is not proof that an external global entitlement layer does not gate it.
