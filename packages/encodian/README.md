# @corsair-dev/encodian

Encodian Flowr document processing, utility, and electronic-signature operations for Corsair.

## Install

```bash
pnpm add @corsair-dev/encodian
```

## Authentication

Configure an Encodian subscription API key. The official Swagger defines the API-key header as `X-ApiKey`; Corsair stores the key per tenant and sends it only to `https://api.apps-encodian.com`. Keys are issued from Encodian's account portal after starting a subscription or trial.

## Coverage

This package wraps 262 user-facing, non-webhook operations from the ten official Flowr Swagger specifications:

| API group | Operations |
| --- | ---: |
| barcodes | 10 |
| conversion | 23 |
| excel | 21 |
| general | 26 |
| image | 15 |
| pdf | 54 |
| powerPoint | 6 |
| sign | 12 |
| trigr | 1 |
| utilities | 62 |
| word | 32 |

Every request and response is validated against schemas generated from the official Swagger definitions. Routes use JSON request/response envelopes; file inputs and outputs are represented using the provider's base64 `fileContent` fields. The Swagger declares 200, 202, and 400 responses for most actions; 202 may indicate queued processing. It does not publish shared pagination or retry semantics for these actions, so the client does not retry POST operations automatically and preserves HTTP 429 `Retry-After` metadata for the caller.

The ten specifications expose 363 route operations in total. The 262 operations above are the user-facing actions implemented here; the remaining routes are excluded as follows:

- 98 routes marked `x-ms-visibility: internal`: 82 operation-status helpers, 11 dynamic-schema helpers, 4 webhook-management lifecycle routes, and the internal Trigr subscription-status route.
- 2 user-facing webhook/trigger routes are omitted because webhook support is out of scope.
- `Utilities.SendHttpRequest` is a user-facing action but is omitted because it proxies caller-supplied URLs and credentials, creating arbitrary outbound-request/SSRF risk.

## Scope and limitations

- Internal dynamic-schema and operation-status endpoints are not exposed; they are connector plumbing, not Flowr actions.
- Webhook/trigger routes are excluded by scope. This plugin registers no webhooks.
- `Utilities.SendHttpRequest` is excluded because it proxies caller-supplied URLs and credentials, creating arbitrary outbound-request/SSRF risk.
- Every Flowr action spends Encodian credits (1 credit for a standard action, 0.05 for a utility action, more for AI actions), so all of them are `destructive`. Only the two subscription-status calls are free (`read`).
- The Flowr API also exposes subscription credit purchase; it is `destructive` and is not automatically retried. It charges the subscription.
- Sign operations that create envelopes or add recipients email the signers and are `destructive`; deleting a recipient is `destructive` too.
- The catalog listing is not the coverage source; official Swagger specifications are.

## Official references

- [Swagger UI](https://api.apps-encodian.com/index.html)
- [Direct API Integration](https://support.encodian.com/hc/en-gb/articles/13253632800284-Direct-API-Integration)
- [API key and trial setup](https://support.encodian.com/hc/en-gb/articles/360034587474-Get-an-API-Key-30-Day-Trial-Subscription)
- [Barcode Swagger](https://api.apps-encodian.com/swagger/Barcode/swagger.json)
- [Conversion Swagger](https://api.apps-encodian.com/swagger/Conversion/swagger.json)
- [Excel Swagger](https://api.apps-encodian.com/swagger/Excel/swagger.json)
- [General Swagger](https://api.apps-encodian.com/swagger/General/swagger.json)
- [Image Swagger](https://api.apps-encodian.com/swagger/Image/swagger.json)
- [PDF Swagger](https://api.apps-encodian.com/swagger/PDF/swagger.json)
- [PowerPoint Swagger](https://api.apps-encodian.com/swagger/PowerPoint/swagger.json)
- [Utilities Swagger](https://api.apps-encodian.com/swagger/Utilities/swagger.json)
- [Word Swagger](https://api.apps-encodian.com/swagger/Word/swagger.json)
- [Sign Swagger](https://api.apps-encodian.com/swagger/Sign/swagger.json)

## License

Apache-2.0
