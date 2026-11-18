# Doppler Marketing Automation

This integration targets Doppler Marketing Automation. It is distinct from the Doppler secrets-management plugin.

The API uses `Authorization: token <API_KEY>` against `https://restapi.fromdoppler.com`. Obtain an API key from Doppler and pass it as `key` or configure Corsair's API-key storage.

```ts
import { dopplermarketingautomation } from '@corsair-dev/dopplermarketingautomation';

const plugin = dopplermarketingautomation({ key: process.env.DOPPLER_MARKETING_API_KEY });
```

## Implemented operations

- Lists: `list`, `create`, `get`, `update`, `delete`.
- Subscribers: `list`, `listForList`, `get`, `exists`, `create`, `associate`, `removeFromList`, `archive`, `listUnsubscribed`, `unsubscribe`, `import`, `importToList`, `importCsv`, `doubleOptIn`, `listByOrigin`, `permissionsHistory`, `deliveries`, `importUnsubscribed`.
- Campaigns: `list`, `create`, `get`, `update`, `delete`, `approve`, `deliveries`, `preview`, `resultsSummary`, `unsubscribed`, `getContent`, `updateContent`, `getTextAlternative`, `updateTextAlternative`, `deleteTextAlternative`, `getRecipients`, `updateRecipients`, `createShipping`, `getShipping`, `deleteShipping`, `getSocial`, `updateSocial`.
- Automations: `list`, `summary`, `opensAndClicks`, `deliverabilityRate`, `linksTracking`, `unsubscribeActivity`.
- Double opt-in templates: `create`, `get`, `updateContent`.
- Fields: `list`. Home: `get`, `account`. Tasks: `list`, `get`, `importErrors`. Integrations: `get`, `update`, `delete`.

List endpoints expose Doppler's `page` and `per_page` parameters where supported. The `exists` endpoint is a `HEAD` request and returns no body. HTML and CSV inputs are sent as raw text; binary image previews return `Uint8Array`. Mutations are never automatically retried by the default error handlers; custom handlers can override that policy.

## Scope and contract

The source is [Doppler's Swagger](https://restapi.fromdoppler.com/swagger/current/swagger.json) and its [API documentation](https://restapi.fromdoppler.com/docs/). The Swagger contains 75 operations; this plugin implements 63 marketing operations. Account creation, password authentication, token generation, client-manager administration and plan listing (12 operations) are excluded.

No inbound webhook behavior is implemented. This package has not yet been tested against a live account.
