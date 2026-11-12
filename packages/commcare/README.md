# @corsair-dev/commcare

CommCare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/commcare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cases.bulkFetch` | `commcare.api.cases.bulkFetch` | `read` | Fetch many cases by ID in one call, optionally limited to specific fields and properties |
| `cases.get` | `commcare.api.cases.get` | `read` | Read one case with its properties and indices |
| `cases.getByExternalId` | `commcare.api.cases.getByExternalId` | `read` | Look up a case by the external id the application assigned it |
| `cases.list` | `commcare.api.cases.list` | `read` | List cases (Case Data API v2) with cursor paging and filters for case type, owner, name, closed state and indices |
| `detExports.list` | `commcare.api.detExports.list` | `read` | List the Data Export Tool export instances in the project |
| `fixtures.getItem` | `commcare.api.fixtures.getItem` | `read` | Read one fixture item by id |
| `fixtures.list` | `commcare.api.fixtures.list` | `read` | List lookup-table fixture items, optionally filtered by fixture type |
| `forms.bulkAction` | `commcare.api.forms.bulkAction` | `destructive` | Archive, unarchive, or permanently delete up to 5000 forms in one background job (delete needs the forms archived first); follow with forms.bulkActionStatus until status is complete or failed |
| `forms.bulkActionStatus` | `commcare.api.forms.bulkActionStatus` | `read` | Where a bulk form action stands: pending, complete, or failed, with processed and succeeded counts |
| `forms.get` | `commcare.api.forms.get` | `read` | Read one submitted form, including its XForm content and metadata |
| `forms.list` | `commcare.api.forms.list` | `read` | List submitted forms with paging and time-window or xmlns filters |
| `groups.create` | `commcare.api.groups.create` | `write` | Create a group, optionally with an initial member list |
| `groups.get` | `commcare.api.groups.get` | `read` | Read one group: name, reporting flag and member user ids |
| `groups.list` | `commcare.api.groups.list` | `read` | List the reporting and case-sharing groups in the project with their members |
| `groups.update` | `commcare.api.groups.update` | `write` | Rename a group, toggle reporting, or replace its member list |
| `locations.get` | `commcare.api.locations.get` | `read` | Read one location with its type and parent |
| `locations.list` | `commcare.api.locations.list` | `read` | List project locations with site code, name and location type filters |
| `locationTypes.get` | `commcare.api.locationTypes.get` | `read` | Read one location type by id |
| `locationTypes.list` | `commcare.api.locationTypes.list` | `read` | List the location types defined in the project |
| `lookupTables.get` | `commcare.api.lookupTables.get` | `read` | Read one lookup table with its field definitions |
| `lookupTables.list` | `commcare.api.lookupTables.list` | `read` | List the lookup tables defined in the project |
| `ota.restore` | `commcare.api.ota.restore` | `read` | Pull the OTA restore XML (user registration plus case blocks) for the API key owner in the domain; large payloads. HQ accepts the ApiKey header here and restores the account that owns the key. The password hash in the registration block is replaced with [removed] |
| `reports.getData` | `commcare.api.reports.getData` | `read` | Run a configurable report and read its rows, with offset, limit (max 50) and the report filter parameters |
| `reports.list` | `commcare.api.reports.list` | `read` | List the configurable reports defined in the project, with their ids |
| `submissions.submit` | `commcare.api.submissions.submit` | `write` | Submit a complete XForm XML document to the OpenRosa receiver. Fails when HQ received the form but did not process it (nature submit_error or processing_failure); otherwise answers the message and its nature |
| `users.create` | `commcare.api.users.create` | `write` | Create a mobile worker account with an initial password |
| `users.delete` | `commcare.api.users.delete` | `destructive` | Permanently delete a mobile worker account |
| `users.get` | `commcare.api.users.get` | `read` | Read one mobile worker: username, names, email, phones and user data |
| `users.list` | `commcare.api.users.list` | `read` | List the mobile workers in the project with paging |
| `users.sendPasswordReset` | `commcare.api.users.sendPasswordReset` | `write` | Email a password reset link to the mobile worker |
| `users.update` | `commcare.api.users.update` | `write` | Change a mobile worker: names, email, phone number or custom user data |
| `webUsers.list` | `commcare.api.webUsers.list` | `read` | List the web users (dashboard accounts) in the project with their roles |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/commcare

## License

Apache-2.0
