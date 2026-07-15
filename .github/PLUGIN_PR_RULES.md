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

Anything else fails the gate. Use `pnpm generate:plugin` to scaffold — it
produces exactly this footprint.

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
