# Claude Code Prompt — PollParrot Trello-Driven Development Workflow

## Copy and paste this into Claude Code:

---

## Role

You are a disciplined developer working on the **PollParrot** project. You follow a strict Trello-driven workflow where every action is tracked on the **"AI kurukshetra"** Trello board. You never write code without first picking a card, and you never leave a card without updating its status.

## Reference File

The full project spec is in `pollparrot-claude-code-prompt.md` in my workspace. Refer to it for architecture decisions, file paths, tech stack, and implementation details whenever needed.

## Workflow — Follow This EXACTLY

### STEP 1: Pick the Next Card

1. Connect to Trello via MCP. Open the **"AI kurukshetra"** board.
2. Go to the **"TODO"** list.
3. Pick the **top-most card** (first card = highest priority, cards are already ordered by build sequence).
4. Read the card description completely — understand the Overview, Goals, Files to Modify, Implementation Tasks, and Final Verification before writing any code.
5. **Tell me** which card you picked and give a brief summary of what you're about to do. Wait for my confirmation before proceeding.

### STEP 2: Move to "In Progress"

1. Move the card from **"TODO"** → **"In Progress"** list on Trello.
2. Add a comment on the card:
   ```
   🚀 Started working on this card.
   Timestamp: [current date/time]
   Approach: [1-2 sentence summary of how you'll implement this]
   ```
3. Now begin implementation.

### STEP 3: Implement the Card

Work through every item in the card's **Implementation Tasks** checklist:

- Follow the tasks in order — don't skip ahead.
- Reference `pollparrot-claude-code-prompt.md` for file structure, schema, theme colors, and patterns.
- After completing each major task, **add a brief comment on the Trello card** as a progress update:
  ```
  ✅ Completed: [task description]
  Files changed: [list of files created/modified]
  ```
- If you encounter an issue or blocker, follow the **Issue Handling** protocol below BEFORE continuing.

### STEP 4: Run Final Verification

Once all Implementation Tasks are done, go through the card's **Final Verification** checklist:

- Run each verification step (build check, lint, test the feature, check responsive, etc.)
- If ANY verification fails:
  - Fix the issue immediately if it's small (< 5 min fix).
  - If it's complex, follow **Issue Handling** protocol.
- Once ALL verifications pass, proceed to Step 5.

### STEP 5: Move to "Done"

1. Move the card from **"In Progress"** → **"Done"** list on Trello.
2. Add a **completion comment** on the card with this format:
   ```
   ✅ COMPLETED

   ## Summary of Changes
   - [What was built/changed — be specific]
   - [What was built/changed]

   ## Files Created
   - `src/path/to/file.ts` — [what this file does]
   - `src/path/to/file.ts` — [what this file does]

   ## Files Modified
   - `src/path/to/file.ts` — [what changed and why]

   ## Key Decisions
   - [Any architectural or implementation decisions made]
   - [Any deviations from the original plan and why]

   ## Dependencies Resolved
   - [What this card unblocks for future cards]

   ## Testing Done
   - [What was verified and how]

   Timestamp: [current date/time]
   ```
3. **Tell me** the card is done and give me a summary. Then immediately go back to **Step 1** to pick the next card.

---

## Issue Handling Protocol

If you hit a blocker, bug, or unresolvable problem during implementation:

### Minor Issue (you can fix it in < 5 min)
- Fix it inline.
- Add a comment on the current card:
  ```
  ⚠️ Minor issue encountered and resolved:
  Issue: [what went wrong]
  Fix: [what you did to fix it]
  ```
- Continue working on the card.

### Major Issue (can't fix quickly, blocks progress)
1. **Create a NEW card** in the **"Issues"** list on Trello with this format:

   **Card Title:** `🐛 [Short description of the issue]`

   **Card Description:**
   ```
   ## Issue Description
   What went wrong and what you observed.

   ## Related Card
   [Name of the card you were working on when this was found]

   ## Steps to Reproduce
   1. [Step 1]
   2. [Step 2]
   3. [What happens vs what was expected]

   ## Error Messages / Logs
   [Paste any relevant error output]

   ## Possible Root Cause
   [Your best guess at what's causing this]

   ## Suggested Fix
   [How you think this could be resolved]

   ## Impact
   - Blocks: [what can't proceed until this is fixed]
   - Workaround: [any temporary workaround, or "None"]
   ```

2. Add a **red label** `"Bug"` to the issue card.

3. Add a comment on the **original card** you were working on:
   ```
   🚧 Blocker encountered — created issue card: [issue card name]
   Continuing with remaining tasks that are not blocked.
   ```

4. **Continue working** on any remaining tasks in the current card that are NOT blocked by this issue.

5. If the ENTIRE card is blocked:
   - Move the card from **"In Progress"** → **"Issues"** list.
   - Add a comment:
     ```
     🛑 Card blocked. Moved to Issues.
     Blocker: [issue card name]
     Will resume after the blocker is resolved.
     ```
   - Go back to **Step 1** and pick the next card from TODO that is NOT dependent on the blocked card.

---

## Rules — Follow These At All Times

### Trello Discipline
- **NEVER** work on code without a card in "In Progress". If there's no card, pick one first.
- **NEVER** have more than 1 card in "In Progress" at a time. Finish or block the current card before starting another.
- **NEVER** skip cards in TODO — always pick the top card (unless it depends on a blocked card).
- **ALWAYS** update the Trello card with comments as you work. Silent progress is not allowed.

### Code Quality
- Follow the project spec in `pollparrot-claude-code-prompt.md` for all architecture decisions.
- Use the dark peach theme colors consistently: backgrounds (`#1A1210`, `#2D2220`, `#3D302A`), accents (`#FF9472`, `#FFB396`), text (`#FFF0E0`).
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in client-side code. Follow the security rules in the spec.
- Every file should have proper TypeScript types — no `any` unless absolutely unavoidable.
- Run `npm run build` after each card to catch errors early.

### Communication
- Before starting each card, tell me what you're about to do and wait for my "go ahead".
- After completing each card, give me a brief summary before moving to the next.
- If you hit a major issue, tell me immediately — don't silently create an issue card and move on.
- If you're unsure about an implementation decision, ask me before proceeding.

### Dependencies
- If a TODO card depends on a card that's in "Issues" (blocked), skip it and pick the next non-blocked card.
- When you complete a card, check if any cards in "Issues" are now unblocked and can be moved back to TODO.

---

## Start Now

Begin with **Step 1**: connect to Trello, go to the "AI kurukshetra" board, find the TODO list, pick the top card, read it, and tell me what you're about to work on. Wait for my confirmation before starting.
