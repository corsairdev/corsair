# Combo page data

One JSON file per pair. Next loads every `*.json` in this folder. A new combo is a new file. Do not edit `combined-integrations.ts` for that.

`slack-linear.json` is the format.

## Write these

| Field | What it is |
|---|---|
| `slugA/B`, `displayA/B`, `title` | Pair identity. Title: `{A} and {B} integration`. |
| `description` | Unique meta / OG description. |
| `introA` | SEO opener. Skeleton: "Save yourself the work of writing custom integrations for {A} and {B}. Connect both in Corsair and {value}." |
| `introB` | Typed code, agents, triggers/actions, OAuth/webhooks/MCP. |
| `counts` | `[{ id, ops, triggers }, …]` for both slugs, from the catalog. Skip non-subscribable webhooks (Slack `challenge.challenge`). |
| `worksWith.a` | Blurb on A's catalog page, about pairing with B. |
| `worksWith.b` | Blurb on B's catalog page, about pairing with A. |
| `triggers`, `actions` | Curated subset. IDs are raw plugin schema keys, never prefixed. |
| `workflows[]` | Trigger → action pairs with titles. Nested objects repeat the picker entries. |
| `connectSteps[]` | Five steps. 1–2 and 5 are per-app; 3–4 name the pair. |
| `appDetails[]` | Two or three sentences per app, plus `pageHref` and `docsHref`. |
| `kb` | Sample agent run: `asker`, `query`, `answer`, `tools[]` (real op IDs), `sources[]`. |
| `faqs[]` | Nine formula questions. Per-app API rows use ids `app-a-api` and `app-b-api`. |

`_meta` is optional notes. The loader strips it.

## Code derives these

Canonical URL (`/{slugA}/and/{slugB}`), reversed-route redirects, sitemap, JSON-LD, metadata from `title` + `description`, works-with cards from `worksWith`.

## Before shipping a file

1. Every trigger, action, workflow, and kb op id exists on that plugin.
2. `counts` match the catalog and include both slugs.
3. FAQ questions stay; answers name both apps.
4. No em dashes.
5. Invalid shape fails the Next build (`comboDataSchema.parse`).

This sample uses first names because it is the live v1 page. Generated files should use fictional ones.
