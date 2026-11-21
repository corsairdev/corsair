# @corsair-dev/fingertip

Fingertip REST API connectivity plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fingertip
```

## Authentication

Create an API key at [fingertip.com/api-keys](https://fingertip.com/api-keys) and connect it to Corsair. The plugin sends the key as `Authorization: Bearer <API_KEY>`.

## Operation

| Operation | Method and path | Risk | Official reference |
| --- | --- | --- | --- |
| `ping.get` | `GET https://api.fingertip.com/v1/ping` | `read` | [REST API — Health check](https://docs.fingertip.com/rest-api) |

The ping request has no inputs, query parameters, body, or pagination. The REST guide says a successful response confirms the API key and service availability. It does not publish a response schema; the official [Node.js SDK guide](https://docs.fingertip.com/node-sdk) reads `response.message`, which the plugin validates as a string.

## Retries and limitations

The operation is a safe read. A `429` response is retried once by Corsair's endpoint error handler, honoring `Retry-After` when supplied. Authentication failures (`401`/`403`) are not retried. No pagination is applicable.

The REST reference currently documents only `GET /v1/ping`. Although the OSS catalog lists additional Fingertip actions, their method/path and request/response contracts are not present in the official REST reference, so they are not implemented. No routes are inferred from SDK methods or MCP tools. Webhook receiver support is excluded.

## License

Apache-2.0
