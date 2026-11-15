# Plugin PR Rules

These rules apply to every PR that adds or changes an integration plugin
(any `packages/<plugin>/` except `corsair`, `cli`, `mcp`, `studio`, `ui`, `app`).
They are enforced by Greptile (`greptile.json`), the deterministic gate job in
`pr-checks.yml`, and the review bot. Human review is the last step; nothing
merges automatically.

## R1 — Scope confinement

A plugin PR may only touch:

- `packages/<plugin>/**` (exactly one plugin per PR)
- the registration edit in `packages/corsair/core/constants.ts`
- `pnpm-lock.yaml`
- `docs/plugins/<plugin>/**` (generated docs for that same plugin)
- `docs/docs.json` (Mintlify nav; `generate:docs` updates this)

Anything else fails the gate. Use `pnpm generate:plugin` to scaffold — it
produces exactly this footprint. Docs for a *different* plugin are still out
of scope.

PRs that only touch `packages/<plugin>/plugin-docs.yaml` and/or
`docs/plugins/<plugin>/**` (and `docs/docs.json` if generate rewrote nav)
are docs PRs: the plugin gate is skipped (no demo video / R2–R4), and CI
uses the documentation skip-heavy lane.

### Team multi-plugin PRs

A change that has to touch several existing plugins at once (risk levels, version bumps, one fix applied to many plugins) can go in one PR when a team member opens it and adds the `multi-plugin` label. The gate accepts it only when both hold: the label is set and the PR author is an org owner, member or collaborator. Contributors can't add labels to their own PRs.

With the label, R1 still checks that every file sits inside the touched plugins' `packages/<plugin>/**` and `docs/plugins/<plugin>/**`, the registry in `constants.ts`, `pnpm-lock.yaml` or `docs/docs.json`. A brand-new plugin package still needs its own PR. R2 applies to every touched plugin (each needs its own `*.test.ts`); R3–R4 don't apply. CI builds and tests every touched package as usual.

The gate reads labels when it runs, so after adding the label to an open PR, use "Re-run failed jobs" on the Plugin PR Gate.

No PR needs a version bump: every merge releases the packages it changed as the next patch (see Versions and Releases in CONTRIBUTING.md).

## R2 — Tests required

At least one `*.test.ts` inside `packages/<plugin>/` (see `packages/slack/`
for `api.test.ts` + `integration.test.ts` examples), with real assertions —
zero `expect()`/`assert()` calls fails the gate; fewer than 5 is flagged.
Every implemented endpoint should have a corresponding test. CI tests must
pass.

## R3 — PR description

Every checklist box in the PR template ticked. Description section filled in
with real content (not the template placeholder comments) that states exactly
what was built — reviewers check the implementation against this. Link the
issue or claim (`Fixes #…`) if one exists.

## R4 — Working proof (required before human merge)

A demo video or recording showing the integration working, in the
"Screenshots / Demos" section. Neither CI nor review bots can call the real
third-party API — the video is that verification.

## R5 — No boilerplate residue

No placeholder base URLs, no commented-out auth headers, no leftover
`endpoints/example.ts`, no TODO stubs left from the generator.

## R6 — Hard prohibitions

No `eval`, no `new Function()`, no execution of dynamically-generated code.
No hardcoded secrets, tokens, or API keys anywhere. Bots never edit outside
the PR's plugin scope. Nothing is ever auto-merged.

## R7 — Production quality

- Inputs and outputs validated with zod schemas on every endpoint.
- Errors routed through the plugin's `error-handlers.ts`, including
  rate-limit (429) handling.
- List endpoints support pagination when the provider API offers it.
- No `any` on exported/public surfaces.
- Follow the structure `pnpm generate:plugin` produces; `validate:plugins`
  must pass.

## R8 — Conventions

Each of these came up as a review finding on five or more plugin PRs. R7 still applies; these add what it doesn't say.

- **Credentials.** Endpoints and the client use `ctx.key`, the key the binder resolved after hooks and the per-tenant lookup, never `options.key` or `ctx.options`.
- **Errors.** Let core's `ApiError` through unchanged. Its `status` and `retryAfter` are what the 429 handler matches and what core reads to refresh an OAuth token after a 401; a wrapper error hides both.
- **Retries.** Core's `request()` already retries a 429 three times, honouring `Retry-After`, so a plugin's 429 handler returns `maxRetries: 0` rather than retrying again. Where a plugin does retry a 429 itself, any method is fine (the provider refused the request before running it), except a 429 that reports an exhausted daily or monthly quota. A 5xx or a network error is retried only for reads and operations marked `replayable`, because a write may already have landed.
- **Response schemas.** Build them from the provider's documented response, documented nulls and empty arrays included. Don't replace a malformed response with a default value or a made-up success.
- **Risk levels.** An operation that sends a message, spends money or credits, or can't be undone is `destructive`.
- **Secrets and personal data.** Keep keys, tokens, email addresses, exact coordinates and customer data out of error messages, log lines and event payloads.
- **Live tests.** `api.test.ts` skips when its credentials are missing, and prints the skip warning from that same check.

## R9 — Decided already (not findings)

Review bots have raised these on many plugin PRs. They are settled, so a plugin PR doesn't change them:

- Retrying a write after a 429 (see R8, Retries), except a 429 that reports an exhausted daily or monthly quota. Only 5xx and network retries need `replayable`.
- Optional or nullish response fields. They keep reads working when a provider adds or drops a field.
- A live suite that skips with a warning when its key is missing.
- Generator-wide output in the generated `docs/plugins/<plugin>/**` pages: type strings that show string literals without quotes or `z.unknown()` as `any`, the shared setup text, and the shared example snippets. They come from the generator, and a fix there changes every page at once. Wrong content that comes from the plugin itself (its `plugin-docs.yaml`, descriptions, schemas) is still a finding.
- The `corsair` peer range `>=0.1.0` in a plugin's `package.json`, which the release tooling owns.
- Risk levels set per input rather than per operation.
- On a plugin PR, checks that belong to core and apply to every plugin: the encryption-key (`kek`) check when `encryptDataAtRest` is on, the order of core's root `DEFAULT` error handler, and redaction of approval arguments. A PR that changes `packages/corsair` itself is reviewed on them as usual.
