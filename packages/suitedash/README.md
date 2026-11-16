# @corsair-dev/suitedash

Client portal CRM from SuiteDash: manage companies, contacts and projects, read the account custom field definitions, list worlds, and subscribe contacts to marketing audiences.

## Install

```bash
pnpm add @corsair-dev/suitedash
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.create` | `suitedash.api.companies.create` | `write` | Create a company, optionally with its first contact in the same call. The role decides what the client portal shows it |
| `companies.get` | `suitedash.api.companies.get` | `read` | Read one company by uid or exact name, with its category, address, primary contact and custom fields |
| `companies.list` | `suitedash.api.companies.list` | `read` | List companies with filters for when they were created, an order, and whether to include the paging and custom field meta |
| `companies.meta` | `suitedash.api.companies.meta` | `read` | Read the meta attributes of the company custom fields, which is where the uuid keys a write uses come from |
| `companies.update` | `suitedash.api.companies.update` | `write` | Change a company's details, phones, address, tags or custom fields. Only the fields sent change |
| `contacts.create` | `suitedash.api.contacts.create` | `destructive` | Create a contact. First name, last name, email and role are required, and the role decides portal access. send_welcome_email sends the portal invitation |
| `contacts.get` | `suitedash.api.contacts.get` | `read` | Read one contact by uid or email, with their roles, phones, addresses and custom fields |
| `contacts.list` | `suitedash.api.contacts.list` | `read` | List contacts with filters for when they were created, an order, and whether to include the meta block |
| `contacts.meta` | `suitedash.api.contacts.meta` | `read` | Read the meta attributes of the contact custom fields, which is where the uuid keys a write uses come from |
| `contacts.update` | `suitedash.api.contacts.update` | `destructive` | Change a contact's details, addresses, tags or custom fields, optionally sending the portal welcome email |
| `marketing.subscribe` | `suitedash.api.marketing.subscribe` | `destructive` | Subscribe contacts to marketing audiences, which can start the emails those audiences send. A partial failure throws, with the per-subscriber results on the error body |
| `projects.get` | `suitedash.api.projects.get` | `read` | Find one project by uid, exact name, a name fragment, or the most recent one, with its clients, team and custom fields |
| `projects.list` | `suitedash.api.projects.list` | `read` | List projects with filters for when they were created, an order, and whether to include the meta block |
| `projects.meta` | `suitedash.api.projects.meta` | `read` | Read the meta attributes of the project custom fields |
| `projects.update` | `suitedash.api.projects.update` | `write` | Change a project's name, status, dates, information text or custom fields. SuiteDash's update schema is open, so only the documented fields are typed |
| `worlds.list` | `suitedash.api.worlds.list` | `read` | List the worlds on the account, which is a Power-up and answers a bare array rather than the CRM list envelope |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/suitedash

## License

Apache-2.0
