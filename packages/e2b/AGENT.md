# E2B Plugin — Agent Completion Guide

> **Auto-generated from scraped API spec.** The Zod schemas, types, and plugin wiring
> are complete. Your job is to fill in the actual HTTP details and write tests.

## About this integration

E2B provides isolated cloud sandboxes for secure code execution.

- **Auth mode:** `API_KEY` → mapped to Corsair `api_key`
- **Key field:** `api_key` (API Key)
- **Total operations:** 1

---

## Step 1 — Find the docs

Search for: **"E2B API documentation"** or **"E2B developer docs"**

You're looking for:
1. The **base API URL** (e.g., `https://api.e2b.com/v1`)
2. The **authentication format** — how the key is passed (header name, query param, Bearer prefix)
3. The **endpoint paths** for each operation below

---

## Step 2 — Fill in `client.ts`

Open `client.ts` and:

- [ ] Replace `https://api.TODO_e2b.com` with the real base URL
- [ ] Update the `HEADERS` block to use the correct auth format

Common patterns to look for in the docs:
```
Authorization: Bearer {api_key}       ← most common
X-Api-Key: {api_key}                  ← also common
?api_key={api_key}                    ← query param (add to query object instead)
Authorization: Basic base64(key:)     ← for BASIC auth
```

---

## Step 3 — Fill in each endpoint

The functions are in `endpoints/{group}.ts`. Each has a `TODO_PATH` and `TODO_METHOD` placeholder.
Replace them with the real path and method from the docs.

### All operations (1 total)

| Endpoint | Name | Risk | Description |
|---|---|---|---|
| `health.getHealth` | Check API Health | `read` | Check the health status of the E2B API |

---

### `health.getHealth` — Check API Health
- **Description:** Check the health status of the E2B API.
- **File:** `endpoints/health.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/healths` or `/health/getHealth`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

---

## Step 4 — Webhooks


This integration does not have documented webhook triggers in the scraped spec.

Check the docs to confirm:
- [ ] Does E2B support webhooks? If yes, add them following the Resend plugin as a reference (`packages/resend/webhooks/`).
- [ ] If no webhooks, the empty `webhooksNested` in `index.ts` is correct.

## Webhook tenant routing

Corsair routes multi-tenant webhooks using three linked pieces. **linkType must match across all three:**

| Piece | File | Purpose |
|---|---|---|
| `pluginTenantWebhookMatcher` | `webhooks/tenant-matcher.ts` | Extract id from incoming webhook |
| `authConfig.{authType}.account` | `index.ts` | Field name stored on `corsair_accounts.config` |
| `oauthWebhookTenantLinkResolver` | `webhooks/oauth-tenant-link.ts` | Populate field after OAuth (if applicable) |

- [ ] Rename `tenant_external_id` to the provider's real field (e.g. `team_id`, `installation_id`)
- [ ] Update `match{Plugin}TenantWebhook` to parse the webhook payload (return `null` for handshakes)
- [ ] Update `{plugin}AuthConfig` account fields to use the same linkType
- [ ] If OAuth: implement `resolve{Plugin}OAuthWebhookTenantLink` (token response and/or post-OAuth API call)
- [ ] Wire `pluginTenantWebhookMatcher` and `oauthWebhookTenantLinkResolver` on the plugin return object
- [ ] Reference: `packages/slack/webhooks/tenant-matcher.ts` and `packages/slack/webhooks/oauth-tenant-link.ts`



---

## Step 5 — Typecheck

```bash
cd packages/e2b && pnpm typecheck
# or from the root:
pnpm typecheck
```

Fix any TypeScript errors before moving on.

---

## Step 6 — Write tests

Create a `tests/` directory in this package. Write at minimum:

1. **Schema validation tests** — confirm the Zod schemas accept valid payloads and reject invalid ones
2. **Endpoint stub tests** — mock `makeE2bRequest` and verify the correct path/method/params are passed
3. **At least one happy-path integration test** if you have access to a E2B sandbox/test account

Reference: look at existing test files in `packages/resend/` or `packages/slack/` for patterns.

---

## Step 7 — Register in your corsair instance

After the plugin is complete, add it to your app's `corsair.ts`:

```ts
import { e2b } from '@corsair-dev/e2b';

export const corsair = createCorsair({
  plugins: [
    e2b({ key: process.env.E2B_API_KEY }),
    // ... other plugins
  ],
});
```
