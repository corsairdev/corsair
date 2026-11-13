# GoDial for Corsair

This package exposes the two GoDial external API routes whose paths and request
details are available in GoDial's public API overview. It is intentionally a
partial integration: the linked Stoplight reference is currently unavailable,
so additional routes and response fields are not inferred.

## Install and configure

```bash
pnpm add @corsair-dev/godial
```

Create an External API access token in the GoDial dashboard under
**Integration → External API**, then provide it as the account API key:

```ts
import { createCorsair } from 'corsair';
import { godial } from '@corsair-dev/godial';

const corsair = createCorsair({
	plugins: [godial()],
});
```

Store the token as the GoDial account API key through Corsair setup or Hub.

GoDial requires `access_token` in the query string on every request. Corsair's
HTTP transport redacts this credential from error URLs and request metadata.

## Verified operations

| Corsair operation | HTTP route | Purpose |
| --- | --- | --- |
| `lists.list` | `GET https://enterprise.godial.cc/meta/api/externals/lists/list` | List the account's lists |
| `contacts.add` | `POST https://enterprise.godial.cc/meta/api/externals/contact/add` | Add a contact to a list |

The contact-add input accepts `listId` and the fields shown in GoDial's example:
`name`, `email`, `phone`, `secondPhone`, `companyName`, `note`, `remarks`,
`extra`, and `assignmentMode`. Only `listId` is required by this wrapper based
on the overview's description; GoDial does not publish per-field validation
constraints in that overview.

```ts
const lists = await corsair.godial.api.lists.list({});
const result = await corsair.godial.api.contacts.add({
	listId: 'list-id-from-lists-list',
	name: 'Ada Lovelace',
	phone: '+15555550123',
});
```

## Limits and incomplete inventory

The public overview does not specify response envelopes, response fields,
pagination, rate limits, or endpoint-specific retry behavior. Responses are
validated as JSON but remain structurally opaque; the plugin does not invent a
list/contact shape. The transport extracts `Retry-After` from HTTP 429 responses
for callers, but automatic retries are disabled because GoDial's retry policy is
undocumented. Contact-add server errors are also not retried because a write may
already have succeeded.

GoDial's overview says further team, agent, list, and contact operations exist.
Its Stoplight workspace home also describes accounts, teams, lists, contacts,
call logs, and reporting calls. Their route paths and contracts were not
available for verification, so they are excluded. Webhooks are not included.

## Official references

- [GoDial API overview](https://godial.cc/blog/integrating-your-website-or-crm-with-godial-using-api/)
- [GoDial Stoplight workspace](https://godial.stoplight.io/)
- The workspace's own start link points to
  [`https://godial.stoplight.io/docs/godial/`](https://godial.stoplight.io/docs/godial/),
  which currently returns 404.
