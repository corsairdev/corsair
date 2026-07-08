# Corsair — agent guide

Corsair is an open-source integration layer for agents (~70 plugin packages).

## Layout

- `packages/<plugin>/` — one integration each (slack, gmail, …). Everything
  except `corsair`, `cli`, `mcp`, `studio`, `ui`, `app` is a plugin.
- `packages/corsair/` — core; plugins register in `core/constants.ts`.
- `www/` — corsair.dev site incl. the OSS contributor dashboard (`src/app/oss/`).
- `scripts/pr-review/` — automated PR review loop (see `docs/pr-review-bot.md`).

## Commands

- `pnpm lint` / `pnpm lint:fix` (biome), `pnpm typecheck`, `pnpm build`, `pnpm test`
- `pnpm generate:plugin` — scaffold a new plugin (correct footprint: its own
  package + one registration edit in `packages/corsair/core/constants.ts`)
- `pnpm run validate:plugins` — structural plugin checks

## PR rules

`.github/PLUGIN_PR_RULES.md` is the source of truth for plugin PRs
(scope, tests, description, demo video). Greptile + the gate job enforce it.
Never auto-merge; never use `eval`/`new Function()` on generated content.

## LLM gateway

Model calls go through `llm.corsair.dev` (LiteLLM, OpenAI-compatible) with
budget-limited keys — never provider SDKs or personal provider keys.
Docs: docs.corsair.dev/llm-gateway.

## Product note

The hosted product moved from `corsairdev/hosted` to `corsairdev/hub`.
`hosted` receives documentation updates only.
