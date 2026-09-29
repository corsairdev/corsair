# @corsair-dev/boldsign

Boldsign plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/boldsign
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.get` | `boldsign.api.brands.get` | `read` | Get details of one brand by brandId. |
| `brands.list` | `boldsign.api.brands.list` | `read` | List all brands available to the account. |
| `customFields.create` | `boldsign.api.customFields.create` | `write` | Create a reusable custom field under a BoldSign brand. |
| `customFields.edit` | `boldsign.api.customFields.edit` | `write` | Update a brand custom field by customFieldId. |
| `documents.createEmbeddedRequestLink` | `boldsign.api.documents.createEmbeddedRequestLink` | `write` | Create an embedded document request URL for draft/send flows. |
| `documents.editBeta` | `boldsign.api.documents.editBeta` | `write` | Edit an existing document request (beta endpoint). |
| `documents.extendExpiry` | `boldsign.api.documents.extendExpiry` | `write` | Extend document expiry window for pending signers. |
| `documents.list` | `boldsign.api.documents.list` | `read` | List documents with filters and pagination. |
| `documents.listBehalf` | `boldsign.api.documents.listBehalf` | `read` | List documents sent on behalf of users. |
| `documents.listTeam` | `boldsign.api.documents.listTeam` | `read` | List documents across teams/users with filters. |
| `documents.removeAuthentication` | `boldsign.api.documents.removeAuthentication` | `write` | Remove signer authentication from a document recipient. |
| `documents.send` | `boldsign.api.documents.send` | `write` | Send a document for signature. |
| `helpers.uploadFile` | `boldsign.api.helpers.uploadFile` | `read` | Prepare a file payload for BoldSign multipart/json send APIs using base64 data URI. |
| `plan.getApiCreditsCount` | `boldsign.api.plan.getApiCreditsCount` | `read` | Get remaining API credits count. |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/boldsign

## License

Apache-2.0
