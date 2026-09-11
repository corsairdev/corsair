# @corsair-dev/blackbaud

Blackbaud plugin for Corsair (SKY API: Raiser's Edge NXT, SKY Payments, OneRoster discovery).

## Install

```bash
pnpm add @corsair-dev/blackbaud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.addGiftsToBatch` | `blackbaud.api.batch.addGiftsToBatch` | `write` | Add gifts to an open gift batch (success returns status_code 200; failures throw) |
| `gifts.getGiftById` | `blackbaud.api.gifts.getGiftById` | `read` | Get a gift record by gift ID |
| `membership.listMemberships` | `blackbaud.api.membership.listMemberships` | `read` | List memberships for a constituent; junction lookups scan 500-record pages and throw past 10,000 rather than report absence (an exact 10,000-record collection is fully scanned and reports absence) |
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
