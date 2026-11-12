# Svix integration

This integration targets Svix's webhook delivery API. Configure an API key and
the region containing your Svix environment (`eu`, `us`, `ca`, or `au`); the
default is `eu`. Requests use `https://api.<region>.svix.com` and bearer
authentication. Store credentials securely; never commit them to source control.

```ts
import { svix } from '@corsair-dev/svix';

const plugin = svix({ key: process.env.SVIX_API_KEY, region: 'us' });
```

The integration exposes **61 operations**: applications (6), endpoints (21), event
types (7), messages and pollers (11), delivery attempts (7), and operational
webhook endpoints (9). Request parameters retain Svix wire names; JSON request
bodies are provided in `body`. Pagination cursors and idempotency keys are
passed through where supported. Writes are not automatically retried. See
[`README.md`](./README.md) for the endpoint list.

Streaming, ingest, other administration APIs, and inbound Corsair webhook
receivers are outside this initial scope. Managing Svix's outbound and
operational webhook endpoints does not create an inbound receiver.

The implementation is based on the [Svix OpenAPI 1.960.0 contract at commit
5103d75d](https://github.com/svix/svix-webhooks/blob/5103d75d062dd49a2305939c2c93cba00e8f9919/codegen/lib-openapi.json).
The OSS catalog and claim step were skipped on request, so catalog availability
was not verified.
