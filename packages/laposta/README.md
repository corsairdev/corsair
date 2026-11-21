# @corsair-dev/laposta

Laposta plugin for Corsair. It exposes **41 typed API operations** for mailing lists, subscribers, custom fields, segments, webhook subscriptions, campaigns, and campaign reports.

## Install and configure

```bash
pnpm add @corsair-dev/laposta
```

Register `laposta()` with `createCorsair`. Store the API key with Corsair setup or pass `key` in plugin options. Laposta uses HTTP Basic authentication with the API key as the username and an empty password.

```ts
import { createCorsair } from 'corsair';
import { laposta } from '@corsair-dev/laposta';

const corsair = createCorsair({ plugins: [laposta()] });
const lists = await corsair.laposta.api.lists.list({});
```

## Operations

All routes use `https://api.laposta.nl/v2`. The method and path below match the [official Laposta API reference](https://api.laposta.nl/doc/index.en.php).

### Lists

| Operation | Method and path | Source |
| --- | --- | --- |
| `lists.list` | `GET /list` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.get` | `GET /list/{list_id}` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.create` | `POST /list` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.update` | `POST /list/{list_id}` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.delete` | `DELETE /list/{list_id}` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.purge_members` | `DELETE /list/{list_id}/members` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |
| `lists.sync_members` | `POST /list/{list_id}/members` | [Lists](https://api.laposta.nl/doc/index.en.php#lists) |

### Members

| Operation | Method and path | Source |
| --- | --- | --- |
| `members.list` | `GET /member` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |
| `members.get` | `GET /member/{member_id}?list_id=...` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |
| `members.create` | `POST /member` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |
| `members.update` | `POST /member/{member_id}` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |
| `members.delete` | `DELETE /member/{member_id}?list_id=...` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |
| `members.history` | `GET /member/{member_id}/history` | [Subscribers](https://api.laposta.nl/doc/index.en.php#members) |

### Fields

| Operation | Method and path | Source |
| --- | --- | --- |
| `fields.list` | `GET /field?list_id=...` | [Fields](https://api.laposta.nl/doc/index.en.php#fields) |
| `fields.get` | `GET /field/{field_id}?list_id=...` | [Fields](https://api.laposta.nl/doc/index.en.php#fields) |
| `fields.create` | `POST /field` | [Fields](https://api.laposta.nl/doc/index.en.php#fields) |
| `fields.update` | `POST /field/{field_id}` | [Fields](https://api.laposta.nl/doc/index.en.php#fields) |
| `fields.delete` | `DELETE /field/{field_id}?list_id=...` | [Fields](https://api.laposta.nl/doc/index.en.php#fields) |

### Segments

| Operation | Method and path | Source |
| --- | --- | --- |
| `segments.list` | `GET /segment?list_id=...` | [Segments](https://api.laposta.nl/doc/index.en.php#segments) |
| `segments.get` | `GET /segment/{segment_id}?list_id=...` | [Segments](https://api.laposta.nl/doc/index.en.php#segments) |
| `segments.create` | `POST /segment` | [Segments](https://api.laposta.nl/doc/index.en.php#segments) |
| `segments.update` | `POST /segment/{segment_id}` | [Segments](https://api.laposta.nl/doc/index.en.php#segments) |
| `segments.delete` | `DELETE /segment/{segment_id}?list_id=...` | [Segments](https://api.laposta.nl/doc/index.en.php#segments) |

### Webhook subscriptions

| Operation | Method and path | Source |
| --- | --- | --- |
| `webhooks.list` | `GET /webhook?list_id=...` | [Webhooks](https://api.laposta.nl/doc/index.en.php#webhooks) |
| `webhooks.get` | `GET /webhook/{webhook_id}?list_id=...` | [Webhooks](https://api.laposta.nl/doc/index.en.php#webhooks) |
| `webhooks.create` | `POST /webhook` | [Webhooks](https://api.laposta.nl/doc/index.en.php#webhooks) |
| `webhooks.update` | `POST /webhook/{webhook_id}` | [Webhooks](https://api.laposta.nl/doc/index.en.php#webhooks) |
| `webhooks.delete` | `DELETE /webhook/{webhook_id}?list_id=...` | [Webhooks](https://api.laposta.nl/doc/index.en.php#webhooks) |

### Campaigns

| Operation | Method and path | Source |
| --- | --- | --- |
| `campaigns.list` | `GET /campaign` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.create` | `POST /campaign` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.get` | `GET /campaign/{campaign_id}` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.update` | `POST /campaign/{campaign_id}` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.delete` | `DELETE /campaign/{campaign_id}` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.history` | `GET /campaign/{campaign_id}/history` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.get_content` | `GET /campaign/{campaign_id}/content` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.update_content` | `POST /campaign/{campaign_id}/content` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.send` | `POST /campaign/{campaign_id}/action/send` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.schedule` | `POST /campaign/{campaign_id}/action/schedule` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |
| `campaigns.send_test` | `POST /campaign/{campaign_id}/action/testmail` | [Campaigns](https://api.laposta.nl/doc/index.en.php#campaigns) |

### Reports

| Operation | Method and path | Source |
| --- | --- | --- |
| `reports.list` | `GET /report` | [Results](https://api.laposta.nl/doc/index.en.php#reports) |
| `reports.get` | `GET /report/{campaign_id}` | [Results](https://api.laposta.nl/doc/index.en.php#reports) |

## Request behavior and cautions

- Single-resource writes use `application/x-www-form-urlencoded`, including documented bracketed nested fields such as `custom_fields[name]` and `from[email]`. `lists.sync_members` uses JSON as Laposta requires. `fields.update` sends `options_full` as JSON as required by its reference.
- `members.list`, `campaigns.list`, and `reports.list` support `limit` (default 100, maximum 1000) and `cursor`; member and campaign history also supports cursor pagination. Send `pagination.next_cursor` back unchanged with the same filters and order.
- Laposta documents 30 requests per minute for free accounts and 120 for paid accounts. A 429 includes `Retry-After`; Corsair's HTTP transport honors it and the plugin's error handler adds no second retry loop.
- `members.create` requires `ip` and may send a double-opt-in confirmation email. It is marked destructive.
- `lists.sync_members` is a paid-account feature. Its `unsubscribe_excluded` action unsubscribes all members omitted from the payload; verify the full list before using it.
- Changing a field's datatype removes values stored in that field. Campaign send, schedule, and test-mail operations send email.
- Laposta documents webhook subscription CRUD and returns a signing secret; keep that secret private. This plugin manages subscriptions only. It does not implement Laposta's separate inbound callback receiver, which requires an application URL to verify `X-Laposta-Signature` and process member events.
- Automation endpoints are a separate API group and are not part of issue #2617's requested lists, members, fields, segments, webhooks, campaigns, and reports scope.

For complete input/output types and examples, see the [Laposta plugin API reference](https://docs.corsair.dev/plugins/laposta/api).

## License

Apache-2.0
