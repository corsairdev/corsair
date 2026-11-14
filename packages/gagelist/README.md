# @corsair-dev/gagelist

GageList plugin for Corsair: manage gages and their calibration records, read calibration certificates, and manage manufacturers, custom field values and the account's plan limits.

## Install

```bash
pnpm add @corsair-dev/gagelist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.status` | `gagelist.api.account.status` | `read` | The site’s plan limits and usage: gage and user counts, gages due and past due, and what the client may change |
| `calibrations.certificate` | `gagelist.api.calibrations.certificate` | `read` | Render a calibration certificate PDF for a record, returned base64-encoded with its content type |
| `calibrations.create` | `gagelist.api.calibrations.create` | `write` | Record a calibration against a gage, with the readings, standard used and next due date |
| `calibrations.delete` | `gagelist.api.calibrations.delete` | `destructive` | Delete a calibration record |
| `calibrations.get` | `gagelist.api.calibrations.get` | `read` | One calibration record with its as-found and as-left readings |
| `calibrations.list` | `gagelist.api.calibrations.list` | `read` | Calibration records, paged; each names the gage it was run on through `EquipmentRefId` |
| `calibrations.update` | `gagelist.api.calibrations.update` | `write` | Update a calibration record |
| `customFields.list` | `gagelist.api.customFields.list` | `read` | The account’s custom fields: each `Id` is the `FieldId` a value write takes, and `ForType` says whether it belongs on gages or calibrations |
| `customFields.updateValues` | `gagelist.api.customFields.updateValues` | `write` | Create or update custom field values on a gage or a calibration. `RefType` is `1` for a gage and `2` for a calibration |
| `gages.create` | `gagelist.api.gages.create` | `write` | Add a gage, with its serial and control numbers, calibration interval and responsible user |
| `gages.delete` | `gagelist.api.gages.delete` | `destructive` | Delete a gage. GageList marks it deleted rather than erasing it, but it stops appearing in the active list |
| `gages.get` | `gagelist.api.gages.get` | `read` | One gage with its calibration dates, interval and assigned user |
| `gages.list` | `gagelist.api.gages.list` | `read` | Gages on the site, paged by `start` and `record_number` in the request body; `next_start` gives the next page |
| `gages.update` | `gagelist.api.gages.update` | `write` | Update a gage. The body is the whole record with its `Id`, not a partial patch |
| `manufacturers.create` | `gagelist.api.manufacturers.create` | `write` | Add a manufacturer with its address and contact details |
| `manufacturers.delete` | `gagelist.api.manufacturers.delete` | `destructive` | Delete a manufacturer |
| `manufacturers.list` | `gagelist.api.manufacturers.list` | `read` | Instrument manufacturers, paged |
| `manufacturers.update` | `gagelist.api.manufacturers.update` | `write` | Update a manufacturer |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gagelist

## License

Apache-2.0
