# @corsair-dev/codereadr

CodeREADr plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/codereadr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `databases.clear` | `codereadr.api.databases.clear` | `destructive` | Delete every value in a database while keeping the database itself; the values cannot be restored |
| `databases.create` | `codereadr.api.databases.create` | `write` | Create a database for validating barcode values; case sensitivity is fixed at creation |
| `databases.delete` | `codereadr.api.databases.delete` | `destructive` | Permanently delete a database and every value in it; refused while a service still uses it |
| `databases.list` | `codereadr.api.databases.list` | `read` | List validation databases with their stored value count and linked services, optionally at a lighter info level |
| `databases.showValues` | `codereadr.api.databases.showValues` | `read` | Search and page through the barcode values stored in a database, with exact and partial match filters and a validity filter |
| `databases.update` | `codereadr.api.databases.update` | `write` | Rename a validation database; its stored barcode values and linked services are unchanged |
| `databases.upsertValue` | `codereadr.api.databases.upsertValue` | `write` | Insert or update one barcode value with its response text and validity, without checking whether it already exists |
| `databases.upsertValues` | `codereadr.api.databases.upsertValues` | `write` | Insert or update up to 100 barcode values in one request, each with its own database, response text, validity and trim setting |
| `devices.list` | `codereadr.api.devices.list` | `read` | List the devices that have activated the app, with their UDID |
| `devices.update` | `codereadr.api.devices.update` | `write` | Rename a device, which changes how the device appears in scan records and the account device list |
| `limits.retrieve` | `codereadr.api.limits.retrieve` | `read` | Read the account API request limits remaining for the current minute and day |
| `questions.create` | `codereadr.api.questions.create` | `write` | Create a data collection question, shown to the app user before or after a scan; choice types need answer options added separately |
| `questions.list` | `codereadr.api.questions.list` | `read` | List data collection questions with their type and answer options |
| `scans.delete` | `codereadr.api.scans.delete` | `destructive` | Permanently delete one or more scan records; deleted scans cannot be restored |
| `scans.list` | `codereadr.api.scans.list` | `read` | Search and page through scan records with filters on date, service, device, user, status, barcode value and scan properties, returning each scan with its answers |
| `services.create` | `codereadr.api.services.create` | `write` | Create a service: how scans are validated (record, database, postback, webview) plus scan behaviour such as symbologies, auto-sync and scanner configuration |
| `services.delete` | `codereadr.api.services.delete` | `destructive` | Permanently delete one or more services, or every service with `all`; deleted services cannot be restored |
| `services.list` | `codereadr.api.services.list` | `read` | List services with their validation method, postback URL, linked database and authorized users and questions |
| `services.update` | `codereadr.api.services.update` | `write` | Update a service; omitted variables keep their current value, except symbologies, which reset to the default set when left out |
| `uploads.list` | `codereadr.api.uploads.list` | `read` | List scan uploads from devices, with the device, service, user, status and scan count for each |
| `users.create` | `codereadr.api.users.create` | `write` | Create an app user; an email address sends an invitation and requires the user to accept it before signing in |
| `users.delete` | `codereadr.api.users.delete` | `destructive` | Permanently delete app users, or every app user with `all`; the account owner cannot be deleted |
| `users.list` | `codereadr.api.users.list` | `read` | List app users with their authorized services, device limit and creation date |
| `users.update` | `codereadr.api.users.update` | `write` | Update an app user: rename, change the password, or set the device limit |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/codereadr

## License

Apache-2.0
