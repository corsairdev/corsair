---
title: API Key Authentication
description: Use static API keys and tokens with Corsair plugins.
---

API key authentication is the simplest auth type in Corsair. You provide a static credential — an API key, personal access token, or bot token — and Corsair stores it encrypted in your database, then injects it into every request automatically.

## How it works

Corsair stores your key using [envelope encryption](https://docs.cloud.google.com/kms/docs/envelope-encryption). Your KEK encrypts a per-connection DEK, which encrypts the key itself. The key is never stored in plaintext.

```ts corsair.ts
import { createCorsair } from "corsair";
import { linear } from "@corsair-dev/linear";

export const corsair = createCorsair({
    plugins: [linear()],
    kek: process.env.CORSAIR_KEK!,
});
```

Store your key once with the CLI:

```bash
pnpm corsair setup --plugin=linear api_key=your-api-key
```

Every `corsair.linear.api.*` call will use the stored key automatically.

---

## Solo setup

Solo mode means one API key shared across your entire application. This is the default — no extra configuration needed.

```ts corsair.ts
export const corsair = createCorsair({
    plugins: [
        linear({ authType: "api_key" }),
    ],
    kek: process.env.CORSAIR_KEK!,
});
```

Store the key:

```bash
pnpm corsair setup --plugin=linear api_key=lin_api_your-key-here
```

All API calls use this key:

```ts usage.ts
const issues = await corsair.linear.api.issues.list({ teamId: "team-id" });
```

---

## Multi-tenant setup

In multi-tenant mode, each user supplies their own API key. Keys are stored and encrypted separately per tenant.

```ts corsair.ts
export const corsair = createCorsair({
    multiTenancy: true,
    plugins: [linear()],
    kek: process.env.CORSAIR_KEK!,
});
```

Store each tenant's key — for example, after collecting it during onboarding:

```ts onboarding.ts
await corsair
    .withTenant("user_abc123")
    .linear.keys.set_api_key("lin_api_their-key");
```

Or via the CLI during development:

```bash
pnpm corsair setup --plugin=linear api_key=lin_api_tenant_key --tenant=user_abc123
```

Use `withTenant` to scope all API calls to a specific user:

```ts usage.ts
const tenant = corsair.withTenant("user_abc123");

// Uses user_abc123's stored key — not your app's key
const issues = await tenant.linear.api.issues.list({ teamId: "team-id" });
```

Each tenant's key is independently encrypted. Compromising one does not expose others.

---

## Bring Your Own Key

If you manage your own decryption (e.g., AWS KMS or Google Cloud KMS), pass the decrypted key directly instead of using database storage:

```ts corsair.ts
linear({
    key: await kms.decrypt(encryptedKey),
})
```

See [Authentication](/concepts/auth#bring-your-own-kms) for details.
