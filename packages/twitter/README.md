# @corsair-dev/twitter

Twitter plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/twitter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tweets.create` | `twitter.api.tweets.create` | `write` | Post a new tweet |
| `tweets.createReply` | `twitter.api.tweets.createReply` | `write` | Post a reply to an existing tweet |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twitter

## License

Apache-2.0
