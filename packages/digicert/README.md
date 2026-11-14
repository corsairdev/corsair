# @corsair-dev/digicert

DigiCert integration plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/digicert
```

## Implemented operations

See [`route-inventory.md`](./route-inventory.md) for per-family counts, exclusions, and sources.

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

CertCentral defaults to the US API base URL. Set `certCentralRegion: 'eu'` for CertCentral Europe. Report Library uses separate regional hosts selected by `reportRegion` (`us` or `eu`). DigiCert ONE calls default to the US hostname; `digicertOneRegion` selects the documented US, Japan, Switzerland, Netherlands, Australia, or India production hostname.

CertCentral documents rolling rate limits of 100 requests per 5 seconds and 1,000 per 3 minutes, per API key. A 429 response uses an `errors` array with `request_limit_exceeded`; this client leaves rate-limit retries to Corsair's HTTP transport. See [rate limits](https://dev.digicert.com/certcentral-apis/services-api/rate-limits.html) and [error formats](https://dev.digicert.com/certcentral-apis/services-api/errors.html).

## Authentication and coverage

CertCentral Services and Report Library use the CertCentral `api_key`, sent as `X-DC-DEVKEY`. DigiCert ONE Account Manager, Private CA, TLM, and CSC API-key routes use the separate `digicert_one_api_key`, sent as `x-api-key`; credentials are never reused across products. Public TLM version and CSC info calls send no key. CSC routes whose OpenAPI security permits OAuth2 also support `authType: 'oauth_2'` and send the access token as a Bearer credential. OAuth2 is not used for other API families. Private CA SCEP GET relies on the SCEP profile challenge/authentication encoded by the protocol request, rather than a DigiCert ONE API-key header. DigiCert ONE also documents mTLS, which this plugin does not implement.

The current official route inventory is implemented: **656/656 distinct HTTP endpoints and 663/663 documented operation modes**, including the two Custom Reports GraphQL query modes on one endpoint. Nine webhook subscription/configuration operations, five deprecated TLM operations, and 14 discontinued CertCentral Discovery catalog operations are excluded as requested. The [`route-inventory.md`](./route-inventory.md) summary records per-family counts, the excluded routes, the credential for each family, and the official source links. Response schemas are generated from OpenAPI or official parameter tables where available; routes whose references publish no response model validate JSON values dynamically. This worktree has not run live API calls because no credentials were supplied, and the Draft PR still requires genuine R4 proof and review completion.

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
