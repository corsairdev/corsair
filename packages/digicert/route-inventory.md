# DigiCert API coverage

Coverage summary for the DigiCert plugin. DigiCert publishes no single API
catalog, so the surface was replayed from the official sources below on
2026-11-12: the CertCentral sitemap for Services API pages, the Report Library
route pages, the Custom Reports API pages, and the four published OpenAPI
documents for Account Manager, Private CA, Trust Lifecycle Manager, and Content
Trust/CSC.

Routes are counted as **endpoints** (distinct HTTP method + path) and as
**modes** (distinct documented request shapes). Where an official CertCentral
page documents the same method and path with two request modes, both modes are
implemented as separate operations.

## Totals

| Family | Endpoints | Modes | Implemented (endpoints / modes) |
|---|---:|---:|---:|
| CertCentral Services | 271 | 277 | 271 / 277 |
| Report Library | 13 | 13 | 13 / 13 |
| Account Manager | 23 | 23 | 23 / 23 |
| Private CA | 117 | 117 | 117 / 117 |
| Trust Lifecycle Manager | 177 | 177 | 177 / 177 |
| Content Trust / CSC | 54 | 54 | 54 / 54 |
| Custom Reports (GraphQL) | 1 | 2 | 1 / 2 |
| **Total** | **656** | **663** | **656 / 663** |

`generatedOpenApiEndpointCount` (364) plus `generatedDocEndpointCount` (282)
plus the 17 hand-written operations in `endpoints/*.ts` is the 663 implemented
operations. The 6 CertCentral method/path pairs with two documented modes and
the Custom Reports pair account for the 7 modes beyond the 656 endpoints.

## Exclusions

- **CertCentral webhooks (9 routes)** — outbound subscription/configuration
  behavior; inbound webhook delivery is a separate concern. All 9 methods are
  excluded from the plugin.
- **Deprecated Trust Lifecycle Manager routes (5)** — marked deprecated in the
  official OpenAPI document. Every other current TLM route, including EST, is
  implemented.
- **CertCentral Discovery catalog (14 operations)** — DigiCert discontinued the
  Discovery API on 2026-10-01, so the routes are retired rather than
  implemented.
- **mTLS for DigiCert ONE** — documented by DigiCert as an alternative
  credential type; not implemented. The plugin implements API-key and, where
  documented, OAuth2 access tokens.

## Credentials

| Family | Credential | Header |
|---|---|---|
| CertCentral Services, Custom Reports, Report Library | `api_key` | `X-DC-DEVKEY` |
| Account Manager, Private CA, Trust Lifecycle Manager | `digicert_one_api_key` (service user token) | `x-api-key` |
| Content Trust / CSC | `digicert_one_api_key` (or OAuth2 bearer for the 18 operations that document it) | `x-api-key` / `Authorization` |
| Public Trust Lifecycle version and CSC `info` routes | none | — |

CertCentral and Report Library each have a US and an EU host; DigiCert ONE has
US, JP, CH, NL, AU, and IN hosts. Regions are selected per plugin option, not
per call.

## Schema fidelity

- Path parameters and the call envelope (`path`, `query`, `headers`, `cookies`,
  `body`) are strict, so a missing or misspelled path parameter fails before any
  network request.
- OpenAPI-derived inputs and outputs are generated from the published
  components. Homes for bodies are strict where the published schema defines a
  complete field set.
- CertCentral and Report Library outputs come from the official reference
  tables and examples. Those tables are inventories of documented fields rather
  than nested models, so table-derived objects validate the documented fields
  and preserve additional provider fields with `passthrough` instead of
  rejecting undocumented ones.
- Where DigiCert publishes no response model at all, the plugin validates a JSON
  value dynamically rather than inventing fields.
- Content Trust/CSC lists API-key and OAuth2 as alternatives for 18 operations;
  both are wired up, and OAuth2 uses the documented `service` scope.

## Sources

- CertCentral Services sitemap: <https://dev.digicert.com/sitemap.xml>
- CertCentral Services API index: <https://dev.digicert.com/certcentral-apis/services-api.html>
- Report Library API: <https://dev.digicert.com/certcentral-apis/report-library-api.html>
- Custom Reports API: <https://dev.digicert.com/certcentral-apis/custom-reports-api.html>
- Discovery API (retired): <https://dev.digicert.com/certcentral-apis/discovery-api.html>
- Account Manager OpenAPI: <https://dev.digicert.com/api-reference/openapi/account-manager.json>
- Private CA OpenAPI: <https://dev.digicert.com/api-reference/openapi/digicert-private-ca.json>
- Trust Lifecycle Manager OpenAPI: <https://dev.digicert.com/api-reference/openapi/trust-lifecycle.json>
- Content Trust OpenAPI: <https://dev.digicert.com/api-reference/openapi/document-trust.json>
