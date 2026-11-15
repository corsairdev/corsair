# GoDial for Corsair

This package exposes two GoDial external API routes: listing lists and adding a
contact to a list. GoDial's reference at
[godial.stoplight.io](https://godial.stoplight.io/) documents more routes
(teams, accounts, contacts, lists, tasks, call logs) that are not part of this
package yet.

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

The contact-add input follows GoDial's Contact - Add reference: `listId` and
`phone` are required; `name`, `email`, `secondPhone`, `companyName`, `note`,
`remarks`, `extra`, `assignmentMode` (`default` or `roundrobin`),
`customFields` (`[{ name, value }]`), `accountsId`, `source`, `address` and
`source_marketing` (UTM fields) are optional. A contact assigned to an agent
(round robin or `accountsId`) joins that agent's calling queue.

```ts
const lists = await corsair.godial.api.lists.list({});
const result = await corsair.godial.api.contacts.add({
	listId: 'list-id-from-lists-list',
	name: 'Ada Lovelace',
	phone: '+15555550123',
});
```

## Limits and incomplete inventory

GoDial's reference shows an empty example for every response and documents no
pagination or rate limits. Responses are validated as JSON but stay
structurally opaque; the plugin does not invent a list/contact shape. A 429 is
retried by Corsair's transport (three times, honouring `Retry-After`); server
errors are not retried because a contact write may already have landed.
GoDial answers a missing or revoked token with HTTP 500, which the client
reports as a 401. Contact details sent in a request are removed from error
messages and bodies. Webhooks are not included.

## Official references

- [GoDial API overview](https://godial.cc/blog/integrating-your-website-or-crm-with-godial-using-api/)
- [GoDial External API reference (Stoplight)](https://godial.stoplight.io/docs/godial/cd4edf0828dd6-go-dial-crm-external-api)
