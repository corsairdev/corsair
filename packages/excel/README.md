# Excel plugin for Corsair

Read and write Excel workbooks stored in OneDrive for Business or SharePoint through Microsoft Graph.

The workbook API covers sessions, worksheets, ranges, tables, and worksheet functions such as `SUM` and `VLOOKUP`. A new file is a blank `.xlsx` uploaded to the drive. Graph has no separate "create workbook" method.

## Setup

Sign in with Microsoft OAuth. The plugin requests `offline_access`, `User.Read`, and `Files.ReadWrite`.

Application permissions are not supported. The Excel overview says workbooks on personal OneDrive are not supported, even though some method pages list personal accounts.

```typescript
import { createCorsair } from 'corsair';
import { excel } from '@corsair-dev/excel';

export const corsair = createCorsair({
  plugins: [excel()],
});
```

Pass `itemId` (a drive item id) or `itemPath` (for example `Reports/Book.xlsx`), not both. Set `driveId` when the file is not in the signed-in user's default drive. Pass `sessionId` from `sessions.create` on later calls. Without a session, Graph still runs the call and saves the change.

## Endpoints

| Endpoint | What it does |
| --- | --- |
| `files.create` / `files.find` | Upload a blank workbook, or search for `.xlsx` files |
| `sessions.create` / `close` / `refresh` | Open, close, or keep a workbook session |
| `worksheets.list` / `get` / `add` / `update` / `delete` | Worksheet CRUD |
| `ranges.get` / `usedRange` / `update` / `clear` | Read and write cells |
| `tables.list` / `get` / `add` / `update` / `delete` | Table CRUD |
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

Excel allows 5,000 requests per 10 seconds per app, and 1,500 per 10 seconds per app per tenant. A `429` includes `Retry-After`. This plugin retries that up to 4 attempts and caps the wait at 60 seconds.

`504` is retried up to 3 attempts only for `sessions.create`, `tables.add`, and `tables.addRows`, which Graph says to repeat. Other `5xx` responses fail fast. `401`, `403`, `404`, and `409` fail fast. A `404` is a missing file, sheet, or session, not an empty result.

Only `.xlsx` files work. `.xls` does not.

There is no per-call charge. The signed-in account needs a work or school Microsoft 365 license that includes Excel.

## Not implemented

- Pivot tables, cell fonts, fills, borders, filters, and chart images. Graph has them. They are formatting and pivot depth, not required to read, write, chart, or name a range.
- Creating or deleting a comment. Graph v1.0 can list comments and post a reply. Creating the first comment is beta only.
- Excel content webhooks. Graph can notify on drive changes; that belongs to the OneDrive plugin.
- The long-running `Prefer: respond-async` row insert. Calls use the synchronous response.
- Personal OneDrive, and application-only (client credentials) access. Graph's Excel pages mark application permissions as not supported.
- Word and PowerPoint. Those have no content API on Graph.
