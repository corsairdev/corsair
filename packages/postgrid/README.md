# @corsair-dev/postgrid

Print and mail API for sending letters, postcards, self mailers and cheques, exposed by Corsair.

## Install

```bash
pnpm add @corsair-dev/postgrid
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.create` | `postgrid.api.contacts.create` | `write` | Create a contact. PostGrid corrects and verifies the address, so the stored one may differ from the one sent |
| `contacts.delete` | `postgrid.api.contacts.delete` | `destructive` | Delete a contact. Orders already created from it keep their own copy of the address |
| `contacts.get` | `postgrid.api.contacts.get` | `read` | Read one contact with its address verification status |
| `contacts.list` | `postgrid.api.contacts.list` | `read` | List contacts, optionally with a plain or structured search, paged by `skip` and `limit` |
| `letters.cancel` | `postgrid.api.letters.cancel` | `destructive` | Cancel a letter while it is still `ready`. After that it is already printing |
| `letters.create` | `postgrid.api.letters.create` | `destructive` | Print and mail a letter, which costs postage and cannot be recalled once it leaves `ready`. Pass `idempotencyKey` so a retry prints one letter, not two |
| `letters.get` | `postgrid.api.letters.get` | `read` | Read one letter, optionally with its template expanded inline |
| `letters.list` | `postgrid.api.letters.list` | `read` | List letters with their status, paged by `skip` and `limit` |
| `postcards.cancel` | `postgrid.api.postcards.cancel` | `destructive` | Cancel a postcard while it is still `ready` |
| `postcards.create` | `postgrid.api.postcards.create` | `destructive` | Print and mail a postcard with a front and a back face, which costs postage and cannot be recalled once printing |
| `postcards.get` | `postgrid.api.postcards.get` | `read` | Read one postcard, optionally with its template expanded |
| `postcards.list` | `postgrid.api.postcards.list` | `read` | List postcards with their status, paged by `skip` and `limit` |
| `selfMailers.create` | `postgrid.api.selfMailers.create` | `destructive` | Print and mail a folded self mailer with inside and outside panels, which costs postage and cannot be recalled once printing |
| `selfMailers.get` | `postgrid.api.selfMailers.get` | `read` | Read one self mailer, optionally with its template expanded |
| `selfMailers.list` | `postgrid.api.selfMailers.list` | `read` | List self mailers with their status, paged by `skip` and `limit` |
| `templates.create` | `postgrid.api.templates.create` | `write` | Create a template whose `{{variableName}}` marks are filled from merge variables |
| `templates.delete` | `postgrid.api.templates.delete` | `destructive` | Delete a template. Orders already created from it are unaffected |
| `templates.get` | `postgrid.api.templates.get` | `read` | Read one template and its HTML |
| `templates.list` | `postgrid.api.templates.list` | `read` | List print templates, paged by `skip` and `limit` |
| `templates.update` | `postgrid.api.templates.update` | `write` | Change a template's HTML, description or metadata |
| `trackers.get` | `postgrid.api.trackers.get` | `read` | Read one order's position in its lifecycle, and on live US mail the USPS intelligent-mail stage |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postgrid

## License

Apache-2.0
