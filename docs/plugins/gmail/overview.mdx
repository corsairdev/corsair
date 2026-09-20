---
title: Overview
description: "Gmail plugin for Corsair"
---

Use **Gmail** through Corsair: one client, typed API calls, optional local DB sync, and incoming webhooks documented below.

**What you get:**

- 25 typed API operations
- 4 database entities synced for fast `.search()` / `.list()` queries
- 1 incoming webhook event types

## Setup

<Steps>

<Step title="Install">
```bash
pnpm install @corsair-dev/gmail
```

</Step>

<Step title="Add the plugin">
<Tabs>
<Tab title="Solo">
```ts corsair.ts
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';

export const corsair = createCorsair({
	// ... other config options,
	multiTenancy: false,
    plugins: [gmail()],
});
```
</Tab>
<Tab title="Multi-Tenant">
```ts corsair.ts
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';

export const corsair = createCorsair({
	// ... other config options,
    multiTenancy: true,
    plugins: [gmail()],
});
```

See [Multi-tenancy](/concepts/multi-tenancy) for account isolation.

</Tab>
</Tabs>

</Step>

<Step title="Get credentials">
Follow [Get Credentials](/plugins/gmail/get-credentials) if you need help getting keys.

</Step>

<Step title="Store credentials">
<Tabs>
<Tab title="Solo">
```bash
pnpm corsair setup --plugin=gmail
```

Use the key names documented in [Get Credentials](/plugins/gmail/get-credentials) (for example `api_key=`, `bot_token=`, or OAuth client fields).
</Tab>
<Tab title="Multi-Tenant">
```bash
pnpm corsair setup --plugin=gmail --tenant=<tenantId>
```

Store per-tenant secrets after you create the tenant record. See [Multi-tenancy](/concepts/multi-tenancy).
</Tab>
</Tabs>

</Step>

</Steps>

## Authentication

Each tab shows how to register the plugin for that authentication method. The default `authType` from the plugin does not need to appear in the factory call.

<Tabs>
<Tab title="OAuth 2.0 (Default)">

```ts corsair.ts
gmail()
```

Store credentials with `pnpm corsair setup --plugin=gmail` (see [Get Credentials](/plugins/gmail/get-credentials) for field names). For OAuth, you typically store integration keys at the provider level and tokens per account or tenant.

More: [OAuth 2.0](/concepts/oauth)

</Tab>
</Tabs>

## Webhooks

This plugin registers **1** webhook handler(s). Configure your provider to POST events to your Corsair HTTP endpoint, then use `webhookHooks` in the plugin factory for custom logic.

See [Webhooks](/plugins/gmail/webhooks) for every event path and payload shape, and [Webhooks concept](/concepts/webhooks) for how to set up routing.


## Query synced data

Synced entities support `corsair.gmail.db.<entity>.search()` and `.list()`. See [Database](/plugins/gmail/database) for filters and operators.


## Example API calls

**Read-style (read):** `drafts.get`

```ts
await corsair.gmail.api.drafts.get({});
```


**Write-style (write):** `drafts.create`

```ts
await corsair.gmail.api.drafts.create({});
```


See the full list on the [API](/plugins/gmail/api) page. Use `pnpm corsair list --plugin=gmail` and `pnpm corsair schema <path>` locally to inspect schemas.

---

## Hooks

Use `hooks` on API calls and `webhookHooks` on incoming events to add logging, approvals, or side effects. See [Hooks](/concepts/hooks) and the [Webhooks](/plugins/gmail/webhooks) page for payload types.

---

## Reference

| Topic | Link |
|-------|------|
| API | [API](/plugins/gmail/api) |
| Database | [Database](/plugins/gmail/database) |
| Webhooks | [Webhooks](/plugins/gmail/webhooks) |
| Credentials | [Get credentials](/plugins/gmail/get-credentials) |

