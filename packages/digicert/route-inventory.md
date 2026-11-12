# DigiCert catalog route reconciliation

Scope is the current official API surface audited across DigiCert product docs and OpenAPI references, not only the 101-operation OSS catalog. The audit counts about 660 distinct HTTP endpoints: CertCentral Services 275, Report Library 13, Account Manager 23, Private CA 117, Trust Lifecycle Manager 177 (after five deprecated routes), Content Trust/CSC 54, and Custom Reports GraphQL 1 endpoint. The GraphQL endpoint has two distinct query modes, so the operation-mode count is about 661. CertCentral webhook subscription/configuration routes are excluded as requested (9 operations in the official Services API webhook section). This yields about 651 non-webhook HTTP endpoints (including GraphQL) and 652 operation modes. This file currently details implemented routes and key exclusions only; many route rows remain pending.

| Catalog operation | Route | Product/API | Auth | Status / official source |
|---|---|---|---|---|
| `DIGICERT_LIST_USERS` | `GET /services/v2/user` | CertCentral Services API | `X-DC-DEVKEY` | Implemented — [docs](https://dev.digicert.com/certcentral-apis/services-api/users/list-users.html) |
| `DIGICERT_LIST_CERTIFICATE_ORDERS` | `GET /services/v2/order/certificate` | CertCentral Services API | `X-DC-DEVKEY` | Implemented — [docs](https://dev.digicert.com/certcentral-apis/services-api/orders/list-orders.html) |
| `DIGICERT_LIST_ORGANIZATIONS` | `GET /services/v2/organization` | CertCentral Services API | `X-DC-DEVKEY` | Implemented — [docs](https://dev.digicert.com/certcentral-apis/services-api/organizations/list-organizations.html) |
| `DIGICERT_LIST_INTERMEDIATE_CERTIFICATES` | `GET /services/v2/certificate/intermediates` | CertCentral Services API | `X-DC-DEVKEY` | Implemented — [docs](https://dev.digicert.com/certcentral-apis/services-api/certificates/list-intermediates.html) |
| `DIGICERT_LIST_LOCALES` | `GET /account/api/v1/locales` | DigiCert ONE Account Manager | `x-api-key` using `digicert_one_api_key` | Implemented — [OpenAPI](https://dev.digicert.com/api-reference/openapi/account-manager.json) |
| `DIGICERT_GET_CERTIFICATE_AUTHORITY_HELPER` | `GET /certificate-authority/api/v1/helper` | DigiCert ONE Private CA | `x-api-key` using `digicert_one_api_key` | Implemented — [OpenAPI](https://dev.digicert.com/api-reference/openapi/digicert-private-ca.json); [product auth docs](https://dev.digicert.com/digicert-private-ca-api.html) document API-token auth |
| `DIGICERT_ADD_TAGS_TO_CERTIFICATE` | `POST /mpki/api/v1/certificate/{certificate_id}/tag` | DigiCert ONE Trust Lifecycle Manager | `x-api-key` using `digicert_one_api_key` | Implemented — [Trust Lifecycle OpenAPI](https://dev.digicert.com/api-reference/openapi/trust-lifecycle.json) |
| `DIGICERT_VERIFY_TEMPLATE` | `POST /certificate-authority/api/v1/template/verify` | DigiCert ONE Private CA | `x-api-key` using `digicert_one_api_key` | Implemented — [Private CA OpenAPI](https://dev.digicert.com/api-reference/openapi/digicert-private-ca.json); body `{ template: string }`, 204 response |
| `DIGICERT_EXECUTE_GRAPHQL_QUERY` (`order_details` mode) | `POST /services/v2/reports/query` with a GraphQL `order_details` query | CertCentral Custom Reports API | `X-DC-DEVKEY` | Implemented — [order_details](https://dev.digicert.com/certcentral-apis/custom-reports-api/order_details.html) |
| `DIGICERT_EXECUTE_GRAPHQL_QUERY` (`order_details_by_id` mode) | `POST /services/v2/reports/query` with a GraphQL `order_details_by_id` query | CertCentral Custom Reports API | `X-DC-DEVKEY` | Implemented — [order_details_by_id](https://dev.digicert.com/certcentral-apis/custom-reports-api/order_details_by_id.html) |
| `DIGICERT_GET_MPKI_VERSION` | `GET /mpki/api/v1/version` | Trust Lifecycle Manager | Public per OpenAPI | Implemented — [OpenAPI](https://dev.digicert.com/api-reference/openapi/trust-lifecycle.json) |
| `DIGICERT_GET_REMOTE_SERVICE_INFO` | `POST /documentmanager/csc/v0/info` | Content Trust CSC v0 | Public per OpenAPI | Implemented — [OpenAPI](https://dev.digicert.com/api-reference/openapi/document-trust.json) |
| `DIGICERT_GET_INFO` | `POST /documentmanager/csc/v1/info` | Content Trust CSC v1 | Public per OpenAPI | Implemented — [OpenAPI](https://dev.digicert.com/api-reference/openapi/document-trust.json) |

## Additional current Report Library API routes

These are official current REST routes not exposed as separate operations in the OSS catalog. All use `X-DC-DEVKEY`; the US base is `https://api.digicert.com/reports/v1` and Europe is `https://report.digicert.eu/reports/v1`. The per-route references are linked below. `PUT /report/{report_identifier}` is the catalog `DIGICERT_UPDATE_REPORT`, not an additional operation.

| Operation | Route | Status | Official source |
|---|---|---|---|
| Report Library create report | `POST /report` | Pending | [Create report](https://dev.digicert.com/certcentral-apis/report-library-api/create-report.html) |
| Report Library update report (`DIGICERT_UPDATE_REPORT`) | `PUT /report/{report_identifier}` | Pending | [Edit report](https://dev.digicert.com/certcentral-apis/report-library-api/edit-report.html) |
| Report Library report details | `GET /report/{report_identifier}` | Implemented | [Report details](https://dev.digicert.com/certcentral-apis/report-library-api/report-details.html) |
| Report Library start run | `POST /report/{report_identifier}/run` | Pending | [Start report run](https://dev.digicert.com/certcentral-apis/report-library-api/start-report-run.html) |
| Report Library download | `GET /report/{report_identifier}/{report_run_identifier}/download` | Pending; binary/ZIP limits required | [Download report](https://dev.digicert.com/certcentral-apis/report-library-api/download-report.html) |
| Report Library JSON results | `GET /report/{report_identifier}/{report_run_identifier}/json` | Pending; may return ZIP over 2 MB | [Get JSON report](https://dev.digicert.com/certcentral-apis/report-library-api/get-json-report.html) |
| Report Library history | `GET /report/history` | Implemented | [List report history](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-history.html) |
| Report Library delete scheduled report | `DELETE /report/scheduled/{report_identifier}` | Pending | [Delete scheduled report](https://dev.digicert.com/certcentral-apis/report-library-api/delete-scheduled-report.html) |
| Report Library delete report | `DELETE /report/{report_identifier}` | Pending; deletes report and all associated runs | [Delete report](https://dev.digicert.com/certcentral-apis/report-library-api/delete-report.html) |
| Report Library delete report run | `DELETE /report/{report_identifier}/{report_run_identifier}` | Pending; destructive | [Delete report run](https://dev.digicert.com/certcentral-apis/report-library-api/delete-report-run.html) |
| Report Library report names | `GET /report/names` | Implemented | [List report names](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-names.html) |
| Report Library report types | `GET /report/types` | Implemented | [List report types](https://dev.digicert.com/certcentral-apis/report-library-api/list-report-types.html) |
| Report Library columns | `GET /report/types/{report_type}/supported-columns` | Pending | [List columns](https://dev.digicert.com/certcentral-apis/report-library-api/list-columns.html) |

## Coverage counts

| Catalog family/status | Count |
|---|---:|
| Current documented distinct HTTP endpoints before webhook exclusion | ~660 |
| CertCentral webhook subscription/configuration endpoints excluded | 9 |
| Current non-webhook HTTP endpoint target (including GraphQL endpoint) | ~651 |
| Current non-webhook operation modes (GraphQL has two query modes) | ~652 |
| Retired CertCentral Discovery catalog operations (not current) | 14 |
| Deprecated TLM routes excluded from current audit | 5 |
| Current OSS catalog operation IDs implemented | 12 (GraphQL has two query modes) |
| Current OSS catalog operation IDs remaining | 75 |
| Additional Report Library routes implemented | 4 |
| Unique HTTP endpoints implemented | 16 |
| Implemented operation modes | 17 |
| Current documented HTTP endpoints outside catalog + listed Report Library routes | ~552 |
| Current HTTP endpoints still pending (approximate) | ~635 |
| Current operation modes still pending (approximate) | ~635 |

The 9 CertCentral webhook subscription/configuration routes excluded are the documented Create webhook, Send test event, Send challenge token, Verify challenge token, Activate webhook, Deactivate webhook, Update webhook endpoint, List webhooks, and Webhook event logs operations in the [official webhook index](https://dev.digicert.com/certcentral-apis/services-api/webhooks.html). The 14 retired Discovery catalog operations are `DIGICERT_DELETE_CERTIFICATE`, `DIGICERT_DELETE_REPORTS_ENDPOINTS`, `DIGICERT_DELETE_KEY`, `DIGICERT_FILTER_KEYS`, `DIGICERT_GET_AGENT_IP_PORT`, `DIGICERT_GET_ALERT_COUNT`, `DIGICERT_GET_CERTIFICATE_RATING`, `DIGICERT_GET_CLOUD_SCAN`, `DIGICERT_GET_SCAN_SUBDOMAINS`, `DIGICERT_LIST_CERTIFICATE_FILTER_VALUES`, `DIGICERT_LIST_CERTIFICATES`, `DIGICERT_CREATE_SCAN_LIST`, `DIGICERT_LIST_SENSORS`, and `DIGICERT_UPDATE_RENEWAL_EMAIL_PREFERENCE`. DigiCert discontinued this API on 2026-10-01; it is not replaced route-for-route by TLM. [Official notice](https://dev.digicert.com/certcentral-apis/discovery-api.html)

The implemented authenticated routes select their own documented credential: CertCentral and Report Library use `api_key`, while authenticated DigiCert ONE routes use `digicert_one_api_key`. Public routes do not read either field. The remaining ~635 current non-webhook HTTP endpoints still require implementation and tests before claiming complete coverage. Catalog route counts and the independent full API audit must not be conflated.

CertCentral regional bases are `https://www.digicert.com/services/v2` (US) and `https://certcentral.digicert.eu/services/v2` (Europe), with `X-DC-DEVKEY`. DigiCert ONE public routes use the regional hostname matrix documented [here](https://dev.digicert.com/get-started/environments-base-urls.html); the plugin defaults to US and accepts the listed production region codes.
