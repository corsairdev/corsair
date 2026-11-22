# @corsair-dev/payhip

Payhip is a digital products storefront. This plugin creates and manages discount coupons and verifies, enables, disables and counts software license keys; coupon calls authenticate with the account API key and license calls with the per-product secret key.

## Install

```bash
pnpm add @corsair-dev/payhip
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `coupons.create` | `payhip.api.coupons.create` | `write` | Create a discount coupon for one product, all products or a collection |
| `coupons.get` | `payhip.api.coupons.get` | `read` | Read one coupon by id |
| `coupons.list` | `payhip.api.coupons.list` | `read` | List the coupons of the account, paged by limit and offset |
| `license.decreaseUsage` | `payhip.api.license.decreaseUsage` | `write` | Decrease the usage count of a license key (a deactivation) |
| `license.disable` | `payhip.api.license.disable` | `write` | Disable a license key so it stops validating |
| `license.enable` | `payhip.api.license.enable` | `write` | Enable a license key that was disabled |
| `license.increaseUsage` | `payhip.api.license.increaseUsage` | `write` | Increase the usage count of a license key (an activation) |
| `license.verify` | `payhip.api.license.verify` | `read` | Verify a license key against a product secret; read-only check |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/payhip

## License

Apache-2.0
