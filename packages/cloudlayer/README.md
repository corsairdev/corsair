# @corsair-dev/cloudlayer

Cloudlayer plugin for Corsair. It exposes the documented v2 API and v1
generation routes. V2 returns JSON job responses, including completed jobs for
`async: false`; v1 generation responses are returned as base64 artifacts.

## Install

```bash
pnpm add @corsair-dev/cloudlayer
```

## Operations

| Operation | Method and path | Provider reference |
| --- | --- | --- |
| `html.toPdf` | `POST /v2/html/pdf` | [HTML to PDF](https://cloudlayer.io/docs/html-to-pdf/) |
| `html.toPdfV1` | `POST /v1/html/pdf` | [HTML to PDF](https://cloudlayer.io/docs/html-to-pdf/) |
| `html.toImage` | `POST /v2/html/image` | [HTML to Image](https://cloudlayer.io/docs/html-to-image/) |
| `html.toImageV1` | `POST /v1/html/image` | [HTML to Image](https://cloudlayer.io/docs/html-to-image/) |
| `url.toPdf` | `POST /v2/url/pdf` | [URL to PDF](https://cloudlayer.io/docs/url-to-pdf/) |
| `url.toPdfV1` | `POST /v1/url/pdf` | [URL to PDF](https://cloudlayer.io/docs/url-to-pdf/) |
| `url.toPdfQuick` | `GET /v2/url/pdf` | [URL to PDF](https://cloudlayer.io/docs/url-to-pdf/) |
| `url.toPdfQuickV1` | `GET /v1/url/pdf` | [URL to PDF](https://cloudlayer.io/docs/url-to-pdf/) |
| `url.toImage` | `POST /v2/url/image` | [URL to Image](https://cloudlayer.io/docs/url-to-image/) |
| `url.toImageV1` | `POST /v1/url/image` | [URL to Image](https://cloudlayer.io/docs/url-to-image/) |
| `url.toImageQuick` | `GET /v2/url/image` | [URL to Image](https://cloudlayer.io/docs/url-to-image/) |
| `url.toImageQuickV1` | `GET /v1/url/image` | [URL to Image](https://cloudlayer.io/docs/url-to-image/) |
| `template.toPdf` | `POST /v2/template/pdf` | [Template to PDF](https://cloudlayer.io/docs/template-to-pdf/) |
| `template.toPdfV1` | `POST /v1/template/pdf` | [Template to PDF](https://cloudlayer.io/docs/template-to-pdf/) |
| `template.toImage` | `POST /v2/template/image` | [Template to Image](https://cloudlayer.io/docs/template-to-image/) |
| `template.toImageV1` | `POST /v1/template/image` | [Template to Image](https://cloudlayer.io/docs/template-to-image/) |
| `account.get` | `GET /v2/account` | [Account](https://cloudlayer.io/docs/account/) |
| `assets.list` | `GET /v2/assets` | [Assets](https://cloudlayer.io/docs/assets/) |
| `assets.get` | `GET /v2/assets/{id}` | [Assets](https://cloudlayer.io/docs/assets/) |
| `jobs.list` | `GET /v1/jobs` | [Jobs](https://cloudlayer.io/docs/jobs/) |
| `jobs.listV2` | `GET /v2/jobs` | [Jobs](https://cloudlayer.io/docs/jobs/) |
| `jobs.get` | `GET /v2/jobs/{id}` | [Jobs](https://cloudlayer.io/docs/jobs/) |
| `storage.create` | `POST /v2/storage` | [Storage](https://cloudlayer.io/docs/storage/) |
| `storage.getCurrent` | `GET /v2/storage` | [Storage](https://cloudlayer.io/docs/storage/) |
| `storage.get` | `GET /v2/storage/{id}` | [Storage](https://cloudlayer.io/docs/storage/) |
| `storage.remove` | `DELETE /v2/storage/{id}` | [Storage](https://cloudlayer.io/docs/storage/) |

Generation inputs follow the provider's JSON contract. Encode HTML and custom
templates as base64 strings; predefined templates use `templateId`. The
template-to-PDF and template-to-image operations also accept multipart input
with a `Blob` in `template` and JSON object `data`; the plugin serializes `data`
as the provider's JSON-string form field. These multipart requests send only
the documented `template` and `data` fields. URL captures support their
documented POST options and GET shortcuts. Jobs and assets list inputs support
the documented `limit` and `startAfterId` parameters. V2 generation defaults
to JSON job responses; `async: false` waits for completion and returns a
completed job per the API overview. The explicitly versioned v1 generation
operations return `BinaryArtifact` values with base64-encoded bytes and the
response content type.

## Binary response handling

Synchronous v1 routes are fetched through a plugin-local transport and
returned as `{ kind: 'binary', contentType, base64 }`; the shared `corsair/http`
transport decodes non-JSON responses as text. Synchronous v2 requests use the
same bounded transport so long renders can finish; JSON responses are parsed
as completed jobs. Current provider API overview docs specify JSON for v2,
though some endpoint-page introductions still describe raw bytes, so the
transport also adapts a raw v2 file response if returned. V2 template multipart
requests accept only the documented `template` and `data` parts and remain in
job mode; the plugin does not add an `async` part to the multipart schema. See
[Template to PDF](https://cloudlayer.io/docs/template-to-pdf/) and
[Template to Image](https://cloudlayer.io/docs/template-to-image/).

The v2 URL GET shortcuts accept only `url` and the documented optional
`timeout`; they return job JSON. The v1 GET shortcuts return binary artifacts.

The API overview index does not list a status operation, so the plugin does not
expose a status route: [API overview](https://cloudlayer.io/docs/api-overview/).

## Authentication

Auth: API key. Corsair sends it in the `X-API-Key` header. Create or manage keys
in the [Cloudlayer dashboard](https://beta-app.cloudlayer.io/).

## Provider documentation

- [API overview, authentication, rate limits, and errors](https://cloudlayer.io/docs/api-overview/)
- [HTML to PDF](https://cloudlayer.io/docs/html-to-pdf/)
- [URL to PDF](https://cloudlayer.io/docs/url-to-pdf/)
- [Template to PDF](https://cloudlayer.io/docs/template-to-pdf/)
- [HTML to Image](https://cloudlayer.io/docs/html-to-image/)
- [URL to Image](https://cloudlayer.io/docs/url-to-image/)
- [Template to Image](https://cloudlayer.io/docs/template-to-image/)
- [Account](https://cloudlayer.io/docs/account/)
- [Assets](https://cloudlayer.io/docs/assets/)
- [Async jobs](https://cloudlayer.io/docs/jobs/)
- [Storage](https://cloudlayer.io/docs/storage/)

## License

Apache-2.0
