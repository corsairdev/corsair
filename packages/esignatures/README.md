# @corsair-dev/esignatures

eSignatures plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/esignatures
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contracts.addSigner` | `esignatures.api.contracts.addSigner` | `write` | Add a signer to a contract without sending a sign request; use contracts.resendToSigner to send one |
| `contracts.create` | `esignatures.api.contracts.create` | `write` | Create and send a contract from a template, filling placeholder fields; set save_as_draft to create without sending |
| `contracts.deleteSigner` | `esignatures.api.contracts.deleteSigner` | `destructive` | Remove a signer from a contract |
| `contracts.get` | `esignatures.api.contracts.get` | `read` | Read a contract's status, signers, labels and, once signed, an expiring PDF URL; contracts older than two weeks may return incomplete data |
| `contracts.resendToSigner` | `esignatures.api.contracts.resendToSigner` | `write` | Send or resend the sign request to one signer |
| `contracts.sendDraft` | `esignatures.api.contracts.sendDraft` | `write` | Send a draft contract to its signers |
| `contracts.updateSigner` | `esignatures.api.contracts.updateSigner` | `write` | Update a signer's contact details or signing settings |
| `contracts.withdraw` | `esignatures.api.contracts.withdraw` | `destructive` | Withdraw a sent contract so it can no longer be signed; signed contracts cannot be withdrawn |
| `templates.create` | `esignatures.api.templates.create` | `write` | Create a template from markdown with placeholder fields |
| `templates.delete` | `esignatures.api.templates.delete` | `destructive` | Permanently delete a template |
| `templates.get` | `esignatures.api.templates.get` | `read` | Read a template's title, creation time, placeholder fields and signer field IDs |
| `templates.list` | `esignatures.api.templates.list` | `read` | List the templates with their IDs and titles |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/esignatures

## License

Apache-2.0
