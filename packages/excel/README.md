# Excel plugin for Corsair

Read and write `.xlsx` workbooks in OneDrive for Business or SharePoint through Microsoft Graph.

## Setup

Sign in with Microsoft OAuth. Scopes: `offline_access`, `User.Read`, and `Files.ReadWrite`.

Application permissions are not supported. Personal OneDrive is not supported.

```typescript
import { createCorsair } from 'corsair';
import { excel } from '@corsair-dev/excel';

export const corsair = createCorsair({
  plugins: [excel()],
});
```

Pass `itemId` or `itemPath` (for example `Reports/Book.xlsx`), not both. Set `driveId` when the file is not in the signed-in user's default drive. Pass `sessionId` from `sessions.create` on later calls.

## Endpoints

| Endpoint | What it does |
| --- | --- |
| `files.create` / `files.find` | Upload a blank `.xlsx`, or search for `.xlsx` files |
| `sessions.create` / `close` / `refresh` | Open, close, or keep a workbook session |
| `worksheets.list` / `get` / `add` / `update` / `delete` | Worksheets |
| `ranges.get` / `usedRange` / `update` / `clear` | Read and write cells |
| `tables.list` / `get` / `add` / `update` / `delete` | Tables |
| `tables.listRows` / `addRows` / `deleteRow` | Table rows |
| `tables.listColumns` / `addColumn` / `deleteColumn` | Table columns |
| `charts.list` / `get` / `add` / `update` / `delete` / `setData` | Charts |
| `names.list` / `get` / `add` / `update` / `range` | Named ranges |
| `comments.list` / `get` / `listReplies` / `reply` | Comments and replies |
| `functions.calculate` | Run one worksheet function |

## Auth

`Authorization: Bearer {token}`. Optional header `workbook-session-id`. Close and refresh require that header.

Token URL: `https://login.microsoftonline.com/common/oauth2/v2.0/token`.

## Limits and errors

5,000 requests per 10 seconds per app, and 1,500 per 10 seconds per app per tenant. A `429` includes `Retry-After`. This plugin retries that up to 4 attempts and waits at most 60 seconds.

`504` is retried up to 3 attempts for `sessions.create`, `tables.add`, and `tables.addRows`. Other `5xx` fail immediately, as do `401`, `403`, `404`, and `409`. A `404` means the file, sheet, or session is missing.

`files.create` fails when that path already exists. `files.find` returns another page as `nextLink`. `.xls` is not supported.

The account needs a work or school Microsoft 365 license that includes Excel.

## Not implemented

- Pivot tables, fonts, fills, borders, filters, and chart images
- Creating or deleting a comment (v1.0 can list and reply; creating one is beta)
- Excel content webhooks
- `Prefer: respond-async` on row insert
- Personal OneDrive and application-only access
