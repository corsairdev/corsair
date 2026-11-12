# TextIt API v2 contract inventory

Source: [TextIt API v2 index](https://textit.com/api/v2/) and its linked resource pages, consulted 2026-11-12. Base URL: `https://textit.com/api/v2`; authenticate with `Authorization: Token <api-token>`. Routes below have a `.json` suffix. GET lists accept `cursor` and return `next`, `previous`, and `results`; workspace is a single object. The archive page also documents `count`. Documented filters and body fields are represented in `endpoints/types.ts`; methods, query/body placement and resource results are in `endpoints/index.ts` and `endpoints/resources.ts`.

| Resource | Documented HTTP methods | Public operations | Success |
| --- | --- | --- | --- |
| archives | GET | `archives.list` | page |
| broadcasts | GET, POST | `broadcasts.list`, `broadcasts.send` | page, broadcast |
| campaigns | GET, POST | `campaigns.list`, `campaigns.create`, `campaigns.update` | page, campaign |
| campaign_events | GET, POST, DELETE | `campaignEvents.list`, `campaignEvents.create`, `campaignEvents.update`, `campaignEvents.delete` | page, event, 204 |
| channels | GET | `channels.list` | page |
| contacts | GET, POST, DELETE | `contacts.list`, `contacts.create`, `contacts.update`, `contacts.delete` | page, contact (201 possible for update by URN), 204 |
| contact_actions | POST | `contactActions.apply` | 204 |
| fields | GET, POST | `fields.list`, `fields.create`, `fields.update` | page, field |
| flow_starts | GET, POST | `flowStarts.list`, `flowStarts.create` | page, flow start |
| flows | GET | `flows.list` | page |
| globals | GET, POST | `globals.list`, `globals.create`, `globals.update` | page, global |
| groups | GET, POST, DELETE | `groups.list`, `groups.create`, `groups.update`, `groups.delete` | page, group, 204 |
| labels | GET, POST, DELETE | `labels.list`, `labels.create`, `labels.update`, `labels.delete` | page, label, 204 |
| media | POST | `media.upload` | media object; multipart `file` |
| messages | GET, POST | `messages.list`, `messages.send` | page, message |
| message_actions | POST | `messageActions.apply` | 204 or 200 with `failures` |
| runs | GET | `runs.list` | page |
| resthooks | GET | `resthooks.list` | page |
| resthook_events | GET | `resthookEvents.list` | page |
| resthook_subscribers | GET, POST, DELETE | `resthookSubscribers.list`, `resthookSubscribers.create`, `resthookSubscribers.delete` | page, subscriber, 204 |
| tickets | GET | `tickets.list` | page |
| ticket_actions | POST | `ticketActions.apply` | 204 |
| topics | GET, POST | `topics.list`, `topics.create` | page, topic |
| users | GET | `users.list` | page |
| workspace | GET | `workspace.get` | workspace |

There are 25 indexed families and 42 distinct HTTP method/resource pairs; the public API has 49 operations because seven POST routes distinguish creation and update. List and workspace operations are read risk; writes are write risk except deletions and bulk operations that can delete, which are destructive. The provider documents 404 for missing deletion targets. API errors retain status and body. Numeric `Retry-After` is exposed in milliseconds on 429; default handlers and transport do not retry. Custom Corsair error handlers can override the default retry policy and should not retry writes.

The catalog's classifiers page is not linked by the current API index and returns 404; classifiers, unindexed boundaries, and deprecated routes are excluded. REST hook subscriber management is outbound; no inbound verification contract was established.

Known documentation inconsistencies: the globals create example uses singular `/global.json` (currently 404), whereas the indexed route and update example use `/globals.json`; subscriber IDs are described as integers but example responses use strings; contact update shows group objects while creation describes UUID strings; run `values` is called an array but illustrated as a keyed object. Both illustrated forms are retained where feasible. TextIt documents `type`, `uuid`, and `note` in places where current RapidPro upstream differs; this plugin follows TextIt's own references rather than assuming that upstream is deployed verbatim. These discrepancies have not been verified against an authenticated TextIt workspace.
