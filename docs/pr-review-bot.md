# PR review bot — runbook

Automated review loop for plugin PRs. Human review is always the last step;
nothing merges automatically. Rules live in `.github/PLUGIN_PR_RULES.md`.

## How it works

1. **Greptile** reviews every non-draft PR (config: `greptile.json`) and
   re-reviews on every push. Its blocking status check prevents merging with
   unresolved findings.
2. **Gate job** (`plugin-gate` in `pr-checks.yml`) deterministically checks
   R1 scope, R2 tests, R3 description, R4 demo video. It maintains one sticky
   comment (`<!-- corsair-pr-gate -->`) and the `gate:failed` label.
3. **Review loop** (`plugin-pr-review-loop.yml`) fires on each Greptile
   review and reads its round from comment markers
   (`<!-- corsair-review-bot round=N -->`):
   - **Round 1** — posts one consolidated comment with every P0/P1 finding,
     gate failures, and P2s as optional. Templated, no LLM. Label `bot:round-1`.
   - **Round 2** — if P0/P1s remain after the contributor's next push AND the
     gate passes, headless Claude Code fixes only the listed findings, runs
     lint/typecheck, and pushes one commit. Label `bot:round-2`.
   - **Round 3** — hard stop: summary comment + `needs-maintainer` label.
     This label is the maintainer queue (syncs to the internal dashboard).

## Cost guards (by construction)

- Round-1 comments are templated — zero LLM cost, no matter how many pushes.
- The LLM fix runs **at most once per PR**: the `round=2` marker is a ratchet;
  after it exists the loop can only escalate or stop.
- The fix round is deferred while the gate fails (incomplete PRs never spend
  LLM tokens).
- Drafts are skipped everywhere. Greptile is free for this repo (OSS plan).

## Operations

- **Dry run:** repo variable `PR_BOT_DRY_RUN=true` makes the loop post what it
  *would* do as `<!-- corsair-review-bot dry-run -->` comments and never push.
  Flip with `gh variable set PR_BOT_DRY_RUN -R corsairdev/corsair --body "false"`.
- **Secrets:** `ANTHROPIC_API_KEY` (fix step), `PR_BOT_PAT` (fine-grained PAT
  with `contents: read/write` — the default `GITHUB_TOKEN` cannot push to fork
  branches). Rotate via `gh secret set <NAME> -R corsairdev/corsair`.
- **Labels used:** `gate:failed`, `bot:round-1`, `bot:round-2`,
  `needs-maintainer`. Create once with `gh label create`.
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
3. Push a partial fix (leave one P1, add one new small bug). Verify re-review,
   round advances, dry-run fix diff is correct and in-scope.
4. Flip `PR_BOT_DRY_RUN=false`, repeat on a second test PR, verify the real
   comment, the real bot commit, its re-review, and the escalation label.
5. Mark the required branch checks. Watch the next 3–5 real PRs closely and
   record actual cost (Anthropic console) per PR.
