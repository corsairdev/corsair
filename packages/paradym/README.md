# @corsair-dev/paradym

Paradym verifiable-credential infrastructure: manage wallets, SD-JWT VC credential and presentation templates, create OpenID4VC issuance offers and verification requests, batch-revoke credentials, and manage trusted entities and webhook subscriptions. Deliveries are HMAC-verified; DIDComm routes are not covered.

## Install

```bash
pnpm add @corsair-dev/paradym
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `credentialTemplates.archive` | `paradym.api.credentialTemplates.archive` | `destructive` | Archive an SD-JWT VC credential template |
| `credentialTemplates.create` | `paradym.api.credentialTemplates.create` | `write` | Create an SD-JWT VC credential template with its attributes |
| `credentialTemplates.get` | `paradym.api.credentialTemplates.get` | `read` | Read one SD-JWT VC credential template |
| `credentialTemplates.list` | `paradym.api.credentialTemplates.list` | `read` | List SD-JWT VC credential templates |
| `credentialTemplates.unarchive` | `paradym.api.credentialTemplates.unarchive` | `write` | Unarchive an SD-JWT VC credential template |
| `credentialTemplates.update` | `paradym.api.credentialTemplates.update` | `write` | Update an SD-JWT VC credential template |
| `issuance.createOffer` | `paradym.api.issuance.createOffer` | `write` | Create a credential offer a holder wallet can accept |
| `issuance.getSession` | `paradym.api.issuance.getSession` | `read` | Read one OpenID4VC issuance session |
| `issuance.listSessions` | `paradym.api.issuance.listSessions` | `read` | List OpenID4VC issuance sessions with their statuses |
| `presentationTemplates.archive` | `paradym.api.presentationTemplates.archive` | `destructive` | Archive a presentation template |
| `presentationTemplates.create` | `paradym.api.presentationTemplates.create` | `write` | Create a presentation template defining what a holder must present |
| `presentationTemplates.get` | `paradym.api.presentationTemplates.get` | `read` | Read one presentation template |
| `presentationTemplates.list` | `paradym.api.presentationTemplates.list` | `read` | List presentation templates |
| `presentationTemplates.update` | `paradym.api.presentationTemplates.update` | `write` | Update a presentation template |
| `revocation.batch` | `paradym.api.revocation.batch` | `destructive` | Revoke issued credentials in one batch; revocation cannot be undone |
| `trustedEntities.create` | `paradym.api.trustedEntities.create` | `write` | Create a trusted entity from DIDs or X.509 certificates |
| `trustedEntities.delete` | `paradym.api.trustedEntities.delete` | `destructive` | Delete a trusted entity |
| `trustedEntities.get` | `paradym.api.trustedEntities.get` | `read` | Read one trusted entity |
| `trustedEntities.list` | `paradym.api.trustedEntities.list` | `read` | List trusted entities with their DIDs and certificates |
| `verification.complete` | `paradym.api.verification.complete` | `write` | Mark a succeeded verification session as completed |
| `verification.createRequest` | `paradym.api.verification.createRequest` | `write` | Create a verification session a holder wallet responds to |
| `verification.getSession` | `paradym.api.verification.getSession` | `read` | Read one OpenID4VC verification session, including presented credentials |
| `verification.listSessions` | `paradym.api.verification.listSessions` | `read` | List OpenID4VC verification sessions with their statuses |
| `wallets.create` | `paradym.api.wallets.create` | `write` | Create a wallet with its own agent, templates and credentials |
| `wallets.get` | `paradym.api.wallets.get` | `read` | Read one wallet by id |
| `wallets.list` | `paradym.api.wallets.list` | `read` | List wallets, searched by name or filtered by id and name |
| `wallets.update` | `paradym.api.wallets.update` | `write` | Rename a wallet or change its verification data access |
| `webhooks.createSubscription` | `paradym.api.webhooks.createSubscription` | `write` | Create a webhook subscription for the event types you choose |
| `webhooks.deleteSubscription` | `paradym.api.webhooks.deleteSubscription` | `destructive` | Delete a webhook subscription; deliveries stop until it is created again |
| `webhooks.getDelivery` | `paradym.api.webhooks.getDelivery` | `read` | Read one webhook delivery with its attempt history |
| `webhooks.listDeliveries` | `paradym.api.webhooks.listDeliveries` | `read` | List webhook deliveries with their statuses |
| `webhooks.listSubscriptions` | `paradym.api.webhooks.listSubscriptions` | `read` | List the wallet webhook subscriptions |
| `webhooks.redeliverDelivery` | `paradym.api.webhooks.redeliverDelivery` | `write` | Redeliver a pending or failed webhook delivery |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/paradym

## License

Apache-2.0
