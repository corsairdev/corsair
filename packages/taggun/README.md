# @corsair-dev/taggun

Taggun plugin for Corsair: scan receipts and invoices into structured data, and validate them against campaign rules or inline rules, through the Taggun receipt OCR API.

## Install

```bash
pnpm add @corsair-dev/taggun
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.create` | `taggun.api.campaigns.create` | `write` | Store a new set of validation rules under a campaign ID you choose; rejected if that ID already exists |
| `campaigns.delete` | `taggun.api.campaigns.delete` | `destructive` | Remove a campaign's validation rules permanently; later submissions against that campaign cannot evaluate them |
| `campaigns.get` | `taggun.api.campaigns.get` | `read` | Read one campaign's stored validation rules; sections with no rules may be omitted from the answer |
| `campaigns.list` | `taggun.api.campaigns.list` | `read` | List the campaign IDs that have validation settings stored on the account; needs the Campaign Validation feature |
| `campaigns.update` | `taggun.api.campaigns.update` | `destructive` | Replace a campaign's stored validation rules wholesale: every section left out is removed, so re-send the response from `campaigns.get` with your changes |
| `campaigns.validateFile` | `taggun.api.campaigns.validateFile` | `write` | Check an uploaded receipt against a campaign's stored rules and return pass/fail per rule; a failed rule is a successful call reporting `successful: false` |
| `campaigns.validateUrl` | `taggun.api.campaigns.validateUrl` | `write` | Check a receipt at an HTTPS URL against a campaign's stored rules; a failed rule is a successful call reporting `successful: false` |
| `receiptValidation.file` | `taggun.api.receiptValidation.file` | `write` | Check an uploaded receipt against rules sent with this request, storing nothing; a failed rule is a successful call reporting `successful: false` |
| `receiptValidation.url` | `taggun.api.receiptValidation.url` | `write` | Check a receipt at an HTTPS URL against rules sent with this request, storing nothing; a failed rule is a successful call reporting `successful: false` |
| `simple.encoded` | `taggun.api.simple.encoded` | `write` | Scan a base64-encoded receipt or invoice and return the four core fields; each call is one billable scan |
| `simple.file` | `taggun.api.simple.file` | `write` | Scan an uploaded receipt or invoice file and return the four core fields; each call is one billable scan |
| `simple.url` | `taggun.api.simple.url` | `write` | Scan a receipt at an HTTPS URL and return the four core fields with confidence levels; each call is one billable scan and the receipt is stored unless `incognito` is set |
| `verbose.encoded` | `taggun.api.verbose.encoded` | `write` | Scan a base64-encoded receipt or invoice and return the full extraction, including product line items unless `extractLineItems` is false |
| `verbose.file` | `taggun.api.verbose.file` | `write` | Scan an uploaded receipt or invoice file and return the full extraction, including product line items unless `extractLineItems` is false |
| `verbose.url` | `taggun.api.verbose.url` | `write` | Scan a receipt at an HTTPS URL and return the full extraction: line items, text, helper arrays, per-field confidence and enabled feature blocks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/taggun

## License

Apache-2.0
