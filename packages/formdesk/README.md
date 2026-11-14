# @corsair-dev/formdesk

Formdesk REST v1 integration for Corsair. The API key is sent as `Authorization: Bearer <key>`.

```ts
import { formdesk } from '@corsair-dev/formdesk';

const plugin = formdesk();
```

Call `connect.apiKey` with the account `domain` and stored API key, or `connect.credentials` with a Formdesk username/password. Connect returns the account `host`; pass that host and the account domain to subsequent operations. Credential Connect returns the API key as well, so do not expose or log its output.

## REST v1 coverage

The implementation follows [Formdesk's official REST v1 collection](https://documenter.getpostman.com/view/9848031/SWEDyDrC), linked from its [Webservice API page](https://formdesk.com/en/features/webservice-api/). That page describes the separate SOAP service; this package implements the linked REST collection, not SOAP.

- **Connect (2):** `GET /{domain}/connect` (API key), `POST /connect` (credentials).
- **Forms (4):** `GET /{domain}/forms`, `POST /{domain}/park`, `GET /{domain}/forms/{form}/items`, and `GET /{domain}/forms/{form}/filters`.
- **Results (14):** export, list IDs, get/add/update/remove a result, increment a numeric field, mark processed, generate a PDF, list workflows/files, and delete result files or all files for a form. Routes match `/forms/{form}/results[/export]`, `/formresults/{entryId}[/{increment|processed|pdf|workflow|files}]`, and `/forms/{form}/files`.
- **Users (7):** list/get/get external/add/update/remove and single sign-on, under `/users`, `/users/{userId}`, `/users/external/{externalUserId}`, and `/signon`.
- **Visitors (8):** list/get/get external, list visitor results, add/update/remove and single sign-on, under `/visitors`, `/visitors/{visitorId}`, `/visitors/external/{externalUserId}`, `/visitors/{visitorId}/formresults`, and `/forms/{form}/signon`.
- **Files (4):** list/get/download/remove under `/files` and `/files/{fileId}[/content]`.

`results.add` accepts one result or up to 10 in an array. Form field identifiers and result values are account-defined; their contents are preserved as JSON while operation envelopes remain strict. Formdesk lists complete result sets and supports result filters, but the collection documents no page/cursor pagination. All operations validate their inputs and outputs. Binary PDF/file responses use `{ kind: 'binary', contentType, base64, filename?, byteLength }`, capped at 25 MiB.

Formdesk's collection states that calls cost one credit each except Connect, with two explicit exceptions: result exports cost one credit per completed form downloaded, and marking a result processed is free. Remaining credits are returned in the `Credits` response header and recorded in Corsair event metadata. Writes and deletes are not automatically retried; safe GET calls can retry on 429 using `Retry-After`.

User provisioning, updates, deletion, and user single sign-on are documented as Supervisor-only; visitor provisioning, updates, and deletion are also Supervisor-only. User types are `internal`, `external`, and `API` (case-sensitive). `results.add` and `results.update` default `process_messages` to false. Marking results processed is Formdesk's synchronization step; removed results remain retrievable for up to 30 days before purge. The collection publishes no rate-limit threshold or Retry-After policy; the client honors the header if a 429 response supplies it. Formdesk documents 200 success responses, 201 creates, and 204 deletes. Provider error JSON uses `meta`, `code`, `description`, and `reason`; Corsair errors expose status only to avoid propagating a reason that might echo submitted data.

The collection's export format list says `excel`, `excel-plain`, `xml`, `text`, `csv`, and `csv-comma`, but its example request uses `excel2007`. Both spellings are accepted because the published collection is inconsistent. SOAP methods and webhooks are not included.
