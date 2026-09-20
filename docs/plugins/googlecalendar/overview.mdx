---
title: Overview
description: "Google calendar plugin for Corsair"
---

Use **Google calendar** through Corsair: one client, typed API calls, optional local DB sync, and incoming webhooks documented below.

**What you get:**

- 6 typed API operations
- 2 database entities synced for fast `.search()` / `.list()` queries
- 1 incoming webhook event types

## Setup

<Steps>

<Step title="Install">
```bash
pnpm install @corsair-dev/googlecalendar
```

</Step>

<Step title="Add the plugin">
<Tabs>
<Tab title="Solo">
```ts corsair.ts
import { createCorsair } from 'corsair';
import { googlecalendar } from '@corsair-dev/googlecalendar';

export const corsair = createCorsair({
	// ... other config options,
	multiTenancy: false,
    plugins: [googlecalendar()],
});
```
</Tab>
<Tab title="Multi-Tenant">
```ts corsair.ts
import { createCorsair } from 'corsair';
import { googlecalendar } from '@corsair-dev/googlecalendar';

export const corsair = createCorsair({
	// ... other config options,
    multiTenancy: true,
    plugins: [googlecalendar()],
});
```

See [Multi-tenancy](/concepts/multi-tenancy) for account isolation.

</Tab>
</Tabs>

</Step>

<Step title="Get credentials">
Follow [Get Credentials](/plugins/googlecalendar/get-credentials) if you need help getting keys.

</Step>

<Step title="Store credentials">
<Tabs>
<Tab title="Solo">
```bash
pnpm corsair setup --plugin=googlecalendar
```

Use the key names documented in [Get Credentials](/plugins/googlecalendar/get-credentials) (for example `api_key=`, `bot_token=`, or OAuth client fields).
</Tab>
<Tab title="Multi-Tenant">
```bash
pnpm corsair setup --plugin=googlecalendar --tenant=<tenantId>
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
googlecalendar()
```

Store credentials with `pnpm corsair setup --plugin=googlecalendar` (see [Get Credentials](/plugins/googlecalendar/get-credentials) for field names). For OAuth, you typically store integration keys at the provider level and tokens per account or tenant.

More: [OAuth 2.0](/concepts/oauth)

</Tab>
</Tabs>

## Webhooks

This plugin registers **1** webhook handler(s). Configure your provider to POST events to your Corsair HTTP endpoint, then use `webhookHooks` in the plugin factory for custom logic.

See [Webhooks](/plugins/googlecalendar/webhooks) for every event path and payload shape, and [Webhooks concept](/concepts/webhooks) for how to set up routing.


## Query synced data

Synced entities support `corsair.googlecalendar.db.<entity>.search()` and `.list()`. See [Database](/plugins/googlecalendar/database) for filters and operators.


## Example API calls

**Read-style (read):** `calendar.getAvailability`

```ts
await corsair.googlecalendar.api.calendar.getAvailability({});
```


**Write-style (write):** `events.create`

```ts
await corsair.googlecalendar.api.events.create({});
```


See the full list on the [API](/plugins/googlecalendar/api) page. Use `pnpm corsair list --plugin=googlecalendar` and `pnpm corsair schema <path>` locally to inspect schemas.

---

## Hooks

Use `hooks` on API calls and `webhookHooks` on incoming events to add logging, approvals, or side effects. See [Hooks](/concepts/hooks) and the [Webhooks](/plugins/googlecalendar/webhooks) page for payload types.

---

## Reference

| Topic | Link |
|-------|------|
| API | [API](/plugins/googlecalendar/api) |
| Database | [Database](/plugins/googlecalendar/database) |
| Webhooks | [Webhooks](/plugins/googlecalendar/webhooks) |
| Credentials | [Get credentials](/plugins/googlecalendar/get-credentials) |

