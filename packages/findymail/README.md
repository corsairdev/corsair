# @corsair-dev/findymail

Findymail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/findymail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.list` | `findymail.api.contacts.list` | `read` | Get contacts saved |
| `excludedDomains.add` | `findymail.api.excludedDomains.add` | `write` | Add excluded domains |
| `excludedDomains.list` | `findymail.api.excludedDomains.list` | `read` | Get excluded domains |
| `excludedDomains.remove` | `findymail.api.excludedDomains.remove` | `write` | Remove excluded domains |
| `exclusionLists.create` | `findymail.api.exclusionLists.create` | `write` | Create a new exclusion list |
| `exclusionLists.delete` | `findymail.api.exclusionLists.delete` | `write` | Delete an exclusion list |
| `exclusionLists.get` | `findymail.api.exclusionLists.get` | `read` | Get exclusion list details |
| `exclusionLists.list` | `findymail.api.exclusionLists.list` | `read` | Get all exclusion lists |
| `exclusionLists.update` | `findymail.api.exclusionLists.update` | `write` | Update an exclusion list |
| `intellimatch.lookalikes` | `findymail.api.intellimatch.lookalikes` | `write` | Search lookalike companies |
| `intellimatch.results` | `findymail.api.intellimatch.results` | `read` | Get results |
| `intellimatch.search` | `findymail.api.intellimatch.search` | `write` | Search leads |
| `intellimatch.status` | `findymail.api.intellimatch.status` | `read` | Get export status |
| `lists.create` | `findymail.api.lists.create` | `write` | Create a new list |
| `lists.delete` | `findymail.api.lists.delete` | `write` | Delete a given list |
| `lists.list` | `findymail.api.lists.list` | `read` | Get the list of contact lists |
| `lists.replace` | `findymail.api.lists.replace` | `write` | Update a contact list |
| `lists.update` | `findymail.api.lists.update` | `write` | Update a contact list (PATCH) |
| `monitors.create` | `findymail.api.monitors.create` | `write` | Create a monitor |
| `monitors.delete` | `findymail.api.monitors.delete` | `write` | Delete a monitor |
| `monitors.list` | `findymail.api.monitors.list` | `read` | List monitors |
| `monitors.update` | `findymail.api.monitors.update` | `write` | Update a monitor |
| `search.businessProfile` | `findymail.api.search.businessProfile` | `write` | Find from business profile |
| `search.company` | `findymail.api.search.company` | `write` | Get company information |
| `search.employees` | `findymail.api.search.employees` | `write` | Find employees |
| `search.name` | `findymail.api.search.name` | `write` | Find from name |
| `search.phone` | `findymail.api.search.phone` | `write` | Find phone |
| `search.reverseEmail` | `findymail.api.search.reverseEmail` | `write` | Reverse email lookup |
| `signals.get` | `findymail.api.signals.get` | `read` | Get a signal |
| `signals.list` | `findymail.api.signals.list` | `read` | List signals |
| `technologies.lookup` | `findymail.api.technologies.lookup` | `write` | Lookup technologies by domain |
| `technologies.search` | `findymail.api.technologies.search` | `read` | Search technologies |
| `usage.credits` | `findymail.api.usage.credits` | `read` | Get remaining credits |
| `usage.summary` | `findymail.api.usage.summary` | `read` | Get usage |
| `usage.teamSummary` | `findymail.api.usage.teamSummary` | `read` | Get team usage |
| `verification.verify` | `findymail.api.verification.verify` | `write` | Verify an email |

## Auth

Findymail uses a bearer API token. Set `FINDYMAIL_API_KEY`, provide `key` to
`findymail({ key })`, or configure the tenant API key in Corsair.

```ts
import { createCorsair } from 'corsair/core';
import { findymail } from '@corsair-dev/findymail';

const corsair = createCorsair({ plugins: [findymail()] });
const result = await corsair.findymail.api.verification.verify({
  email: 'person@example.com',
});
```

## Webhooks

Searches and signal monitors accept documented `webhook_url` parameters for
Findymail's outbound callbacks. This plugin does not implement inbound webhook
verification or processing.

The plugin covers 36 non-deprecated operations. Findymail documents both PUT
and PATCH for updating a contact list, although PATCH is absent from its OpenAPI
file. Deprecated domain search is excluded. The plugin does not automatically
retry requests; Findymail can return 429 when concurrency limits are reached.

## Reference

Provider API reference: https://app.findymail.com/docs/

## License

Apache-2.0
