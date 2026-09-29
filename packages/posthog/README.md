# @corsair-dev/posthog

Posthog plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/posthog
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.aliasCreate` | `posthog.api.events.aliasCreate` | `write` | Create an alias linking two distinct user IDs |
| `events.eventCreate` | `posthog.api.events.eventCreate` | `write` | Ingest an analytics event |
| `events.identityCreate` | `posthog.api.events.identityCreate` | `write` | Associate properties with a user identity |
| `events.trackPage` | `posthog.api.events.trackPage` | `write` | Track a page view event |
| `events.trackScreen` | `posthog.api.events.trackScreen` | `write` | Track a screen view event |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/posthog

## License

Apache-2.0
