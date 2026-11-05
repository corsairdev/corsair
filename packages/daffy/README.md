# @corsair-dev/daffy

Daffy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/daffy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.getBalance` | `daffy.api.accounts.getBalance` | `read` | Retrieve the authenticated user's fund balance. |
| `accounts.getContributions` | `daffy.api.accounts.getContributions` | `read` | List contributions made to the authenticated fund. |
| `accounts.getDonations` | `daffy.api.accounts.getDonations` | `read` | List donations made by the authenticated user. |
| `accounts.getUserCauses` | `daffy.api.accounts.getUserCauses` | `read` | Retrieve a user's supported charitable causes. |
| `accounts.getUserDonations` | `daffy.api.accounts.getUserDonations` | `read` | Retrieve a user's public donations. |
| `accounts.getUserProfile` | `daffy.api.accounts.getUserProfile` | `read` | Retrieve the authenticated user's profile. |
| `accounts.getUserByUsername` | `daffy.api.accounts.getUserByUsername` | `read` | Retrieve a public user profile by username. |
| `gifts.create` | `daffy.api.gifts.create` | `write` | Create a Daffy charitable gift for a beneficiary. |
| `gifts.getByCode` | `daffy.api.gifts.getByCode` | `read` | Retrieve a gift by its unique code. |
| `gifts.list` | `daffy.api.gifts.list` | `read` | List gifts associated with the authenticated user. |
| `nonProfits.getByEin` | `daffy.api.nonProfits.getByEin` | `read` | Retrieve a nonprofit organization by EIN. |
| `nonProfits.search` | `daffy.api.nonProfits.search` | `read` | Search nonprofit organizations by cause or text. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/daffy

## License

Apache-2.0
