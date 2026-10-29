import { defineOperation } from './call';

// Unipile shows an API key once, in the create response. The list only has
// a prefix today; any full key that appears there is dropped all the same.
// unknown: the raw list response; only its `data` items are rewritten.
function withoutKeys(raw: unknown): unknown {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return raw;
	// Narrowed to a plain object by the checks above.
	const page = raw as Record<string, unknown>;
	if (!Array.isArray(page.data)) return page;
	return {
		...page,
		data: page.data.map((item: unknown) => {
			if (item === null || typeof item !== 'object' || Array.isArray(item)) {
				return item;
			}
			// Narrowed to a plain object by the checks above.
			const {
				api_key: _key,
				token: _token,
				...rest
			} = item as Record<string, unknown>;
			return rest;
		}),
	};
}

// List API Keys (GET /v2/api-keys/)
export const list = defineOperation(
	'apiKeysList',
	'apiKeys.list',
	{
		method: 'GET',
		path: '/v2/api-keys/',
		query: ['access', 'account_scope_id', 'offset', 'limit'],
	},
	withoutKeys,
);

// Create an API Key (POST /v2/api-keys/). The only response with the key.
export const create = defineOperation('apiKeysCreate', 'apiKeys.create', {
	method: 'POST',
	path: '/v2/api-keys/',
	body: 'rest',
});

// Delete an API Key (DELETE /v2/api-keys/{api_key_id})
export const remove = defineOperation('apiKeysDelete', 'apiKeys.delete', {
	method: 'DELETE',
	path: '/v2/api-keys/{api_key_id}',
});
