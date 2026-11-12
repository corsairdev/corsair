# @corsair-dev/digicert

DigiCert integration plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/digicert
```

## Implemented operations

See [`route-inventory.md`](./route-inventory.md) for catalog reconciliation and exclusions.

| Operation | DigiCert route | Auth | Official route documentation |
|---|---|---|---|
| `users.list` | `GET /services/v2/user` | `X-DC-DEVKEY` | [List users](https://dev.digicert.com/certcentral-apis/services-api/users/list-users.html) |
| `orders.list` | `GET /services/v2/order/certificate` | `X-DC-DEVKEY` | [List orders](https://dev.digicert.com/certcentral-apis/services-api/orders/list-orders.html) |
| `organizations.list` | `GET /services/v2/organization` | `X-DC-DEVKEY` | [List organizations](https://dev.digicert.com/certcentral-apis/services-api/organizations/list-organizations.html) |
| `certificates.listIntermediates` | `GET /services/v2/certificate/intermediates` | `X-DC-DEVKEY` | [List intermediates](https://dev.digicert.com/certcentral-apis/services-api/certificates/list-intermediates.html) |
| `accountManager.locales` | `GET /account/api/v1/locales` | `x-api-key` (DigiCert ONE service-user token) | [Account Manager OpenAPI](https://dev.digicert.com/api-reference/openapi/account-manager.json) |
| `privateCA.helper` | `GET /certificate-authority/api/v1/helper` | `x-api-key` (DigiCert ONE service-user token) | [Private CA OpenAPI](https://dev.digicert.com/api-reference/openapi/digicert-private-ca.json) |
| `trustLifecycle.addCertificateTags` | `POST /mpki/api/v1/certificate/{certificate_id}/tag` | `x-api-key` (DigiCert ONE service-user token) | [Trust Lifecycle OpenAPI](https://dev.digicert.com/api-reference/openapi/trust-lifecycle.json) |
| `privateCA.verifyTemplate` | `POST /certificate-authority/api/v1/template/verify` | `x-api-key` (DigiCert ONE service-user token) | [Private CA OpenAPI](https://dev.digicert.com/api-reference/openapi/digicert-private-ca.json) |
| `reportLibrary.names` | `GET /report/names` on the Report Library base | `X-DC-DEVKEY` | [List report names](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-names.html) |
| `reportLibrary.types` | `GET /report/types` on the Report Library base | `X-DC-DEVKEY` | [List report types](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-types.html) |
| `reportLibrary.history` | `GET /report/history` on the Report Library base | `X-DC-DEVKEY` | [List report history](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-history.html) |
| `reportLibrary.details` | `GET /report/{report_identifier}` on the Report Library base | `X-DC-DEVKEY` | [Report details](https://dev.digicert.com/certcentral-apis/report-library-api/report-details.html) |
| `customReports.orders` | `POST /services/v2/reports/query` (`order_details` mode) | `X-DC-DEVKEY` | [order_details](https://dev.digicert.com/certcentral-apis/custom-reports-api/order_details.html) |
| `customReports.orderById` | `POST /services/v2/reports/query` (`order_details_by_id` mode) | `X-DC-DEVKEY` | [order_details_by_id](https://dev.digicert.com/certcentral-apis/custom-reports-api/order_details_by_id.html) |
| `trustLifecycle.version` | `GET /mpki/api/v1/version` | Public | [Trust Lifecycle API reference](https://dev.digicert.com/trust-lifecycle-api/api-reference.html) |
| `contentTrust.infoV0` | `POST /documentmanager/csc/v0/info` | Public | [Content Trust OpenAPI](https://dev.digicert.com/api-reference/openapi/document-trust.json) |
| `contentTrust.infoV1` | `POST /documentmanager/csc/v1/info` | Public | [Content Trust OpenAPI](https://dev.digicert.com/api-reference/openapi/document-trust.json) |

CertCentral defaults to the US API base URL. Set `certCentralRegion: 'eu'` for CertCentral Europe. Report Library uses separate regional hosts selected by `reportRegion` (`us` or `eu`). DigiCert ONE calls default to the US hostname; `digicertOneRegion` selects the documented US, Japan, Switzerland, Netherlands, or Australia production hostname.

CertCentral documents rolling rate limits of 100 requests per 5 seconds and 1,000 per 3 minutes, per API key. A 429 response uses an `errors` array with `request_limit_exceeded`; this client leaves rate-limit retries to Corsair's HTTP transport. See [rate limits](https://dev.digicert.com/certcentral-apis/services-api/rate-limits.html) and [error formats](https://dev.digicert.com/certcentral-apis/services-api/errors.html).

## Auth and coverage limitations

CertCentral operations use the CertCentral key in `api_key`, sent as `X-DC-DEVKEY`. Account Manager and Private CA use a separate DigiCert ONE service-user token in `digicert_one_api_key`, sent as `x-api-key`. Corsair requires both fields for this combined plugin; provision both credentials for the connected tenant. A single credential is never reused across product families. Public Trust Lifecycle version and CSC info calls send no key. DigiCert ONE documents mTLS as an alternative, but this plugin uses its documented default API-token method; it does not implement client-certificate handling.

This implementation is **partial**. The full official API audit covers about 660 distinct HTTP endpoints across DigiCert product families, plus two Custom Reports GraphQL query modes on one endpoint. Nine CertCentral webhook subscription/configuration routes are excluded as requested; five deprecated TLM routes and the 14 discontinued CertCentral Discovery catalog operations are not current. The audited target is about 651 non-webhook HTTP endpoints (about 652 operation modes), of which 16 routes / 17 modes are implemented and approximately 635 endpoints remain. Of the 87 currently supported OSS catalog operation IDs, 12 are implemented (GraphQL has two query modes), leaving 75 catalog operation IDs pending. Do not treat this package as complete coverage.

DigiCert discontinued the CertCentral Discovery API on October 1, 2026. Its routes are excluded; Trust Lifecycle Manager is not a drop-in replacement. See the [official notice](https://dev.digicert.com/certcentral-apis/discovery-api.html).

## Tests

```bash
pnpm --dir packages/digicert test
```

The live test is read-only and runs only when `DIGICERT_API_KEY` is set:

```bash
pnpm --dir packages/digicert test:live
```

## License

Apache-2.0
