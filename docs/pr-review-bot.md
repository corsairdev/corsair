# PR review bot — runbook

Automated review loop for plugin PRs. Human review is always the last step;
nothing merges automatically, and the loop never edits code. Rules live in
`.github/PLUGIN_PR_RULES.md`.

## How it works

1. **Greptile** reviews every non-draft PR (config: `greptile.json`) and
   re-reviews on every push. Its blocking status check prevents merging with
   unresolved findings.
2. **Gate job** (`plugin-gate` in `pr-checks.yml`) deterministically checks
   R1 scope, R2 tests, R3 description, R4 demo video. It maintains one sticky
   comment (`<!-- corsair-pr-gate -->`) and the `gate:failed` label.
3. **Review loop** (`plugin-pr-review-loop.yml`) fires on each Greptile
   review and reads its round from comment markers
   (`<!-- corsair-review-bot round=N -->`). It is fully templated — no LLM:
   - **Round 1** — posts one consolidated comment with every P0/P1 finding,
     gate failures, and P2s as optional. Label `bot:round-1`.
   - **Escalation** — if P0/P1s remain after the contributor's next push AND
     the gate passes, posts a summary comment + `needs-maintainer` label (the
     maintainer queue, syncs to the internal dashboard). While the gate still
     fails, escalation is deferred and the round-1 comment is refreshed in
     place instead — incomplete PRs never reach the maintainer queue.

   Applying fixes is a human (or the local review harness) — the loop only
   triages and routes.

## Cost guards (by construction)

- The whole loop is templated and deterministic — **zero LLM cost**, no matter
  how many pushes.
- Drafts are skipped everywhere. Greptile is free for this repo (OSS plan).

## Operations

- **Dry run:** repo variable `PR_BOT_DRY_RUN=true` makes the loop post what it
  *would* do as `<!-- corsair-review-bot dry-run -->` comments and take no
  other action. Flip with
  `gh variable set PR_BOT_DRY_RUN -R corsairdev/corsair --body "false"`.
- **Labels used:** `gate:failed`, `bot:round-1`, `needs-maintainer`. Create
  once with `gh label create`.
- **Retired secrets:** `CORSAIR_LLM_KEY` and `PR_BOT_PAT` backed the old Codex
  auto-fix/push jobs and are no longer used by this loop — safe to delete.
- **Required checks:** mark Greptile's status check and `Plugin PR Gate` as
  required branch checks on `main` once live.
- **Tests:** `pnpm exec tsx --test scripts/pr-review/*.test.ts`
  (fixtures in `scripts/pr-review/fixtures/` are real Greptile payloads).

## Dogfood checklist (before going live)

1. With a non-collaborator test account, claim an integration on the OSS
   dashboard and open a plugin PR from a fork with planted violations:
   placeholder base URL, commented-out auth, no tests, unchecked checklist
   box, no video.
2. Verify: Greptile flags the plants → gate fails R2/R3/R4 with label →
   dry-run round-1 comment lists every plant. Anything missed = fix first.
3. Push a partial fix that satisfies the gate but leaves one P1. Verify the
   re-review escalates to `needs-maintainer` (gate green + finding remains).
4. Flip `PR_BOT_DRY_RUN=false`, repeat on a second test PR, verify the real
   round-1 comment and the real escalation label.
5. Mark the required branch checks. Watch the next 3–5 real PRs.
