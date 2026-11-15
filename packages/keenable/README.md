# @corsair-dev/keenable

Keenable plugin for Corsair.

Web search and page fetching for AI agents: ranked results in `realtime` or `pro` mode, and markdown page content by URL.

## Install

```bash
pnpm add @corsair-dev/keenable
```

## Usage

```ts
import { createCorsair } from 'corsair';
import { keenable } from '@corsair-dev/keenable';

const corsair = createCorsair({
	plugins: [keenable({ key: process.env.KEENABLE_API_KEY })],
	// database, kek, hub ...
});

const tenant = corsair.withTenant('acme');

const results = await tenant.keenable.api.search.post({
	query: 'typescript best practices',
	max_results: 5,
});

const page = await tenant.keenable.api.fetch.get({
	url: 'https://example.com',
	max_chars: 20000,
});
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `search.post` | `keenable.api.search.post` | `read` | Search the web and return ranked results (realtime or pro mode) |
| `fetch.get` | `keenable.api.fetch.get` | `read` | Fetch a page as markdown by URL, optionally extracting with a prompt |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use. Keys are issued in the Keenable console (https://app.keenable.ai/console) and sent as the `X-API-Key` header.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/keenable

## License

Apache-2.0
