# @corsair-dev/googlesheets

Google sheets plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googlesheets
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `sheets.appendOrUpdateRow` | `googlesheets.api.sheets.appendOrUpdateRow` | `write` | Append a new row or update an existing one |
| `sheets.appendRow` | `googlesheets.api.sheets.appendRow` | `write` | Append a new row to a sheet |
| `sheets.clearSheet` | `googlesheets.api.sheets.clearSheet` | `destructive` | Clear all data from a sheet [DESTRUCTIVE] |
| `sheets.createSheet` | `googlesheets.api.sheets.createSheet` | `write` | Add a new sheet tab to a spreadsheet |
| `sheets.deleteRowsOrColumns` | `googlesheets.api.sheets.deleteRowsOrColumns` | `destructive` | Delete rows or columns from a sheet [DESTRUCTIVE] |
| `sheets.deleteSheet` | `googlesheets.api.sheets.deleteSheet` | `destructive` | Delete a sheet tab and all its data [DESTRUCTIVE · IRREVERSIBLE] |
| `sheets.getRows` | `googlesheets.api.sheets.getRows` | `read` | Read rows from a sheet |
| `sheets.listSheetsInSpreadsheet` | `googlesheets.api.sheets.listSheetsInSpreadsheet` | `read` | List all sheet tabs in a spreadsheet |
| `sheets.updateRow` | `googlesheets.api.sheets.updateRow` | `write` | Update an existing row in a sheet |
| `spreadsheets.create` | `googlesheets.api.spreadsheets.create` | `write` | Create a new spreadsheet |
| `spreadsheets.delete` | `googlesheets.api.spreadsheets.delete` | `destructive` | Permanently delete a spreadsheet [DESTRUCTIVE · IRREVERSIBLE] |
| `spreadsheets.list` | `googlesheets.api.spreadsheets.list` | `read` | List all spreadsheets in Google Drive |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlesheets

## License

Apache-2.0
