# @corsair-dev/blackbaud

Blackbaud plugin for Corsair (SKY API: Raiser's Edge NXT, SKY Payments, OneRoster discovery).

## Install

```bash
pnpm add @corsair-dev/blackbaud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.addGiftsToBatch` | `blackbaud.api.batch.addGiftsToBatch` | `write` | Add gifts to an open gift batch; returns the added gifts and per-gift errors |
| `gifts.getGiftById` | `blackbaud.api.gifts.getGiftById` | `read` | Get a gift record by gift ID |
| `membership.getMembershipDetails` | `blackbaud.api.membership.getMembershipDetails` | `read` | Get membership details by member junction ID |
| `payments.getPaymentTransaction` | `blackbaud.api.payments.getPaymentTransaction` | `read` | Get a SKY Payments transaction by transaction ID |
| `oneRoster.oneRosterOAuth2BaseApi` | `blackbaud.api.oneRoster.oneRosterOAuth2BaseApi` | `read` | Read OneRoster OAuth2 discovery metadata (openid-configuration, public keys) |

## Auth

Auth: OAuth 2.0. Set `authType` on the plugin factory to pick one. SKY API calls also send `Bb-Api-Subscription-Key` from `subscriptionKey`.

## Webhooks

No webhooks. The plugin matcher denies all inbound webhook requests.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/blackbaud

## License

Apache-2.0
