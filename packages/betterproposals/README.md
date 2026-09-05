# @corsair-dev/betterproposals

BetterProposals plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/betterproposals
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.create` | `betterproposals.api.companies.create` | `write` | Create a new company record |
| `companies.get` | `betterproposals.api.companies.get` | `read` | Get details for a specific company by ID |
| `companies.list` | `betterproposals.api.companies.list` | `read` | Get all companies in the account with optional pagination |
| `currencies.get` | `betterproposals.api.currencies.get` | `read` | Get details for a specific currency by ID |
| `currencies.list` | `betterproposals.api.currencies.list` | `read` | Get all currencies supported in Better Proposals |
| `documentTypes.create` | `betterproposals.api.documentTypes.create` | `write` | Create a new document type with name and colour |
| `documentTypes.list` | `betterproposals.api.documentTypes.list` | `read` | Get all document types available in the account |
| `proposals.createCover` | `betterproposals.api.proposals.createCover` | `write` | Create a proposal cover design with custom colours, headline, and button |
| `proposals.get` | `betterproposals.api.proposals.get` | `read` | Get detailed information for a specific proposal by ID |
| `proposals.getCount` | `betterproposals.api.proposals.getCount` | `read` | Get total proposal count across account |
| `proposals.getNew` | `betterproposals.api.proposals.getNew` | `read` | Get new proposals that have not yet been sent |
| `proposals.getOpened` | `betterproposals.api.proposals.getOpened` | `read` | Get proposals that have been opened by recipients |
| `proposals.getPaid` | `betterproposals.api.proposals.getPaid` | `read` | Get proposals that have been paid |
| `proposals.getSent` | `betterproposals.api.proposals.getSent` | `read` | Get sent proposals |
| `proposals.getSigned` | `betterproposals.api.proposals.getSigned` | `read` | Get signed proposals |
| `proposals.list` | `betterproposals.api.proposals.list` | `read` | Get all proposals with optional pagination and document type filtering |
| `quotes.get` | `betterproposals.api.quotes.get` | `read` | Get details for a specific quote by ID |
| `quotes.list` | `betterproposals.api.quotes.list` | `read` | Get all quotes with optional pagination |
| `settings.get` | `betterproposals.api.settings.get` | `read` | Get account settings including tax and timezone information |
| `settings.getBrand` | `betterproposals.api.settings.getBrand` | `read` | Get brand settings including default currency, tax, and company styling |
| `settings.listMergeTags` | `betterproposals.api.settings.listMergeTags` | `read` | List custom merge tags configured in the account |
| `templates.get` | `betterproposals.api.templates.get` | `read` | Get details for a specific proposal template by ID |
| `templates.list` | `betterproposals.api.templates.list` | `read` | Get all proposal templates with optional pagination |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/betterproposals

## License

Apache-2.0
