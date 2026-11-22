# @corsair-dev/mailcoach

Manage Mailcoach email lists, subscribers, campaigns, transactional mails, imports, tags, segments, and delivery statistics through its team-scoped REST API.

## Install

```bash
pnpm add @corsair-dev/mailcoach
```

Store the exact API URL shown in Mailcoach **Account settings → API Tokens** as the account-level `api_url` field alongside the API token (`api_key`). This lets every tenant connect to its own team-specific host. For a single-team setup, the plugin's `apiUrl` option is a fallback:

```ts
import { mailcoach } from '@corsair-dev/mailcoach';

const plugin = mailcoach({
	apiUrl: 'https://<your-team>.mailcoach.app/api',
});
```

For CLI setup, provide both fields: `pnpm corsair setup --plugin=mailcoach api_key=<token> api_url=https://<your-team>.mailcoach.app/api`.

Use an **All API endpoints** token for management. A **Send only** token is suitable only for transactional sends. The token inherits its owner's Mailcoach permissions. Corsair sends `Authorization: Bearer <token>` and `Accept: application/json`; credentials stay server-side.

Only HTTPS team subdomains under `mailcoach.app` are accepted. Self-hosted instances and custom domains are intentionally not supported until the official API reference documents their host format. Arbitrary hosts, extra paths, query strings, credentials, and non-HTTPS URLs are rejected before sending a token.

## Endpoint reference

| Operation | Method | Path | Official reference |
| --- | --- | --- | --- |
| `user.get` | GET | `/user` | [About the API](https://www.mailcoach.app/docs/api/introduction/about-api/) |
| `emailLists.list` | GET | `/email-lists` | [Email lists](https://www.mailcoach.app/docs/api/endpoints/email-lists/) |
| `emailLists.get` | GET | `/email-lists/{emailListUuid}` | [Email lists](https://www.mailcoach.app/docs/api/endpoints/email-lists/) |
| `emailLists.create` | POST | `/email-lists` | [Email lists](https://www.mailcoach.app/docs/api/endpoints/email-lists/) |
| `emailLists.update` | PUT | `/email-lists/{emailListUuid}` | [Email lists](https://www.mailcoach.app/docs/api/endpoints/email-lists/) |
| `emailLists.delete` | DELETE | `/email-lists/{emailListUuid}` | [Email lists](https://www.mailcoach.app/docs/api/endpoints/email-lists/) |
| `subscribers.list` | GET | `/email-lists/{emailListUuid}/subscribers` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.get` | GET | `/subscribers/{subscriberUuid}` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.subscribe` | POST | `/email-lists/{emailListUuid}/subscribers` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.update` | PATCH | `/subscribers/{subscriberUuid}` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.delete` | DELETE | `/subscribers/{subscriberUuid}` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.confirm` | POST | `/subscribers/{subscriberUuid}/confirm` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.confirmByEmail` | POST | `/email-lists/{emailListUuid}/confirm` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.unsubscribe` | POST | `/subscribers/{subscriberUuid}/unsubscribe` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.unsubscribeByEmail` | POST | `/email-lists/{emailListUuid}/unsubscribe` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.resendConfirmation` | POST | `/subscribers/{subscriberUuid}/resend-confirmation` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.resendConfirmationByEmail` | POST | `/email-lists/{emailListUuid}/resend-confirmation` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.addTags` | POST | `/subscribers/{subscriberUuid}/tags` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscribers.removeTags` | DELETE | `/subscribers/{subscriberUuid}/tags` | [Subscribers](https://www.mailcoach.app/docs/api/endpoints/subscribers/) |
| `subscriberImports.list` | GET | `/subscriber-imports` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.get` | GET | `/subscriber-imports/{importUuid}` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.create` | POST | `/subscriber-imports` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.update` | PUT | `/subscriber-imports/{importUuid}` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.delete` | DELETE | `/subscriber-imports/{importUuid}` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.append` | POST | `/subscriber-imports/{importUuid}/append` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `subscriberImports.start` | POST | `/subscriber-imports/{importUuid}/start` | [Subscriber imports](https://www.mailcoach.app/docs/api/endpoints/subscriber-imports/) |
| `tags.list` | GET | `/email-lists/{emailListUuid}/tags` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `tags.get` | GET | `/email-lists/{emailListUuid}/tags/{tagUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `tags.create` | POST | `/email-lists/{emailListUuid}/tags` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `tags.update` | PUT | `/email-lists/{emailListUuid}/tags/{tagUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `tags.delete` | DELETE | `/email-lists/{emailListUuid}/tags/{tagUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `segments.list` | GET | `/email-lists/{emailListUuid}/segments` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `segments.get` | GET | `/email-lists/{emailListUuid}/segments/{segmentUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `segments.create` | POST | `/email-lists/{emailListUuid}/segments` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `segments.update` | PUT | `/email-lists/{emailListUuid}/segments/{segmentUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `segments.delete` | DELETE | `/email-lists/{emailListUuid}/segments/{segmentUuid}` | [Tags & segments](https://www.mailcoach.app/docs/api/endpoints/tags-segments/) |
| `templates.list` | GET | `/templates` | [Templates](https://www.mailcoach.app/docs/api/endpoints/templates/) |
| `templates.get` | GET | `/templates/{templateUuid}` | [Templates](https://www.mailcoach.app/docs/api/endpoints/templates/) |
| `templates.create` | POST | `/templates` | [Templates](https://www.mailcoach.app/docs/api/endpoints/templates/) |
| `templates.update` | PUT | `/templates/{templateUuid}` | [Templates](https://www.mailcoach.app/docs/api/endpoints/templates/) |
| `templates.delete` | DELETE | `/templates/{templateUuid}` | [Templates](https://www.mailcoach.app/docs/api/endpoints/templates/) |
| `campaigns.list` | GET | `/campaigns` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.get` | GET | `/campaigns/{campaignUuid}` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.create` | POST | `/campaigns` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.update` | PUT | `/campaigns/{campaignUuid}` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.delete` | DELETE | `/campaigns/{campaignUuid}` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.sendTest` | POST | `/campaigns/{campaignUuid}/send-test` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.schedule` | PUT | `/campaigns/{campaignUuid}` with `schedule_at` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.send` | POST | `/campaigns/{campaignUuid}/send` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.opens` | GET | `/campaigns/{campaignUuid}/opens` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.clicks` | GET | `/campaigns/{campaignUuid}/clicks` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.unsubscribes` | GET | `/campaigns/{campaignUuid}/unsubscribes` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `campaigns.bounces` | GET | `/campaigns/{campaignUuid}/bounces` | [Campaigns](https://www.mailcoach.app/docs/api/endpoints/campaigns/) |
| `transactionalMails.send` | POST | `/transactional-mails/send` | [Transactional emails](https://www.mailcoach.app/docs/api/endpoints/transactional-mails/) |
| `transactionalMails.listTemplates` | GET | `/transactional-mails/templates` | [Transactional emails](https://www.mailcoach.app/docs/api/endpoints/transactional-mails/) |
| `transactionalMails.getTemplate` | GET | `/transactional-mails/templates/{templateUuid}` | [Transactional emails](https://www.mailcoach.app/docs/api/endpoints/transactional-mails/) |
| `automationMails.list` | GET | `/automation-mails` | [Automation mails](https://www.mailcoach.app/docs/api/endpoints/automation-mails/) |
| `automationMails.get` | GET | `/automation-mails/{automationMailUuid}` | [Automation mails](https://www.mailcoach.app/docs/api/endpoints/automation-mails/) |
| `automationMails.create` | POST | `/automation-mails` | [Automation mails](https://www.mailcoach.app/docs/api/endpoints/automation-mails/) |
| `automationMails.update` | PUT | `/automation-mails/{automationMailUuid}` | [Automation mails](https://www.mailcoach.app/docs/api/endpoints/automation-mails/) |
| `automationMails.delete` | DELETE | `/automation-mails/{automationMailUuid}` | [Automation mails](https://www.mailcoach.app/docs/api/endpoints/automation-mails/) |
| `sends.list` | GET | `/sends` | [Sends](https://www.mailcoach.app/docs/api/endpoints/sends/) |
| `sends.get` | GET | `/sends/{sendUuid}` | [Sends](https://www.mailcoach.app/docs/api/endpoints/sends/) |
| `sends.delete` | DELETE | `/sends/{sendUuid}` | [Sends](https://www.mailcoach.app/docs/api/endpoints/sends/) |
| `links.get` | GET | `/links/{linkUuid}` | [Links](https://www.mailcoach.app/docs/api/endpoints/links/) |
| `suppressions.list` | GET | `/suppressions` | [Suppressions](https://www.mailcoach.app/docs/api/endpoints/suppressions/) |
| `suppressions.get` | GET | `/suppressions/{identifier}` | [Suppressions](https://www.mailcoach.app/docs/api/endpoints/suppressions/) |
| `suppressions.create` | POST | `/suppressions` | [Suppressions](https://www.mailcoach.app/docs/api/endpoints/suppressions/) |
| `suppressions.delete` | DELETE | `/suppressions/{identifier}` | [Suppressions](https://www.mailcoach.app/docs/api/endpoints/suppressions/) |
| `uploads.create` | POST | `/uploads` | [Uploads](https://www.mailcoach.app/docs/api/endpoints/uploads/) |

## Pagination, rate limits, and timeouts

List endpoints return the provider's `data`, `links`, and `meta` envelope. Follow `links.next` until it is `null` by passing that absolute URL as `next`; the plugin verifies the URL uses the configured team origin and original resource path. Do not combine `next` with a fresh query.

Mailcoach Cloud's default is 300 authenticated requests per minute, shared among tokens belonging to the same user. `POST /transactional-mails/send` has a 3,000/minute per-user limit. `GET /campaigns/{campaign}/clicks` and `GET /links/{link}` additionally share a 5 requests/second per-team burst limit. On `429`, Corsair's HTTP transport honors `Retry-After`; the endpoint error handler does not add another retry layer. The standard Corsair transport timeout is 20 seconds. Writes are not retried on network timeouts because the provider may already have accepted them.

Successful `204 No Content` operations return `undefined`; no JSON body is parsed. A stored transactional send returns its UUID at the top level, while `store: false` returns no body. Some send failures are plain text; they retain their HTTP status but error details are redacted.

## Safety and scope notes

- `campaigns.create` and `campaigns.update` only edit drafts. `campaigns.schedule` (destructive) sets `schedule_at`, which makes Mailcoach send at that time. `campaigns.send` sends to the campaign audience; `campaigns.sendTest` sends mail to the supplied test addresses.
- `transactionalMails.send` supports `fake: true` for a no-delivery test and accepts either a saved template (`mail_name`) or inline content (`subject` plus `html` and/or `text`).
- A subscriber import is a draft until `subscriberImports.start`. Imports bypass confirmation; the resubscribe and unsubscribe flags can affect existing contacts. Import only addresses with consent.
- `subscribers.subscribe` can restart an unsubscribed address. Use `subscribers.update` for routine profile changes to opted-out contacts.
- Suppressions block delivery across the team. Hosted Mailcoach forbids deleting spam-complaint suppressions. Deleting a send log cannot recall an email already delivered.
- Only the JSON base64 image-upload form is exposed; it accepts at most ten JPEG, PNG, GIF, or WebP images, up to 8 MB each. SVG and multipart uploads are not exposed.
- `POST /automations/{automation}/trigger` is excluded because the official docs do not specify its successful response body. Full automation workflow CRUD is not documented. No inbound webhook operations are included.

## References

- [API overview and response conventions](https://www.mailcoach.app/docs/api/introduction/about-api/)
- [Authentication and rate limits](https://www.mailcoach.app/docs/api/introduction/authentication/)
- [All endpoint pages](https://www.mailcoach.app/docs/api/introduction/about-api/)

## License

Apache-2.0
