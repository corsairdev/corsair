import { AuthMissingError } from 'corsair/core';
import { spondyr, spondyrAuthConfig, spondyrEndpointSchemas } from './index';

// The key builder only reads authType, options and keys.
function keyContext(apiKey: string | null, applicationToken: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_application_token: jest.fn().mockResolvedValue(applicationToken),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof spondyr>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'batch.send',
	'batch.status',
	'conditions.create',
	'conditions.delete',
	'conditions.get',
	'conditions.list',
	'conditions.update',
	'correspondence.deliver',
	'correspondence.retry',
	'correspondence.search',
	'correspondence.send',
	'correspondence.status',
	'eventTypes.create',
	'eventTypes.delete',
	'eventTypes.get',
	'eventTypes.list',
	'eventTypes.update',
	'recipients.create',
	'recipients.delete',
	'recipients.get',
	'recipients.list',
	'recipients.update',
	'searchFilters.create',
	'searchFilters.delete',
	'searchFilters.get',
	'searchFilters.list',
	'searchFilters.update',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.update',
	'templates.uploadContent',
	'transactionTypes.create',
	'transactionTypes.delete',
	'transactionTypes.get',
	'transactionTypes.list',
	'transactionTypes.update',
];

describe('spondyr plugin definition', () => {
	const plugin = spondyr();

	it('registers as spondyr with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('spondyr');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the Application Token on the account, not the integration', () => {
		// An api_key account has no get_integration_credentials, so a token
		// declared under `integration` would throw on the first call.
		expect(spondyrAuthConfig.api_key.account).toEqual(['application_token']);
		expect(spondyrAuthConfig.api_key).not.toHaveProperty('integration');
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const writes = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();
		expect(writes).toEqual([
			'batch.status',
			'conditions.get',
			'conditions.list',
			'correspondence.search',
			'correspondence.status',
			'eventTypes.get',
			'eventTypes.list',
			'recipients.get',
			'recipients.list',
			'searchFilters.get',
			'searchFilters.list',
			'templates.get',
			'templates.list',
			'transactionTypes.get',
			'transactionTypes.list',
		]);
	});

	it('marks every delete as destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = Object.entries(meta)
			.filter(([name]) => name.endsWith('.delete'))
			.map(([name, entry]) => ({ name, risk: entry.riskLevel }));
		expect(deletes).toHaveLength(6);
		for (const entry of deletes) {
			expect(entry.risk).toBe('destructive');
		}
	});

	it('marks the operations that generate and deliver correspondence as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		// They email, fax, mail or text real recipients (R8: sends are destructive).
		for (const name of [
			'correspondence.send',
			'correspondence.deliver',
			'correspondence.retry',
			'batch.send',
		] as const) {
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
		expect(meta['templates.uploadContent']?.riskLevel).toBe('write');
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(spondyrEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(spondyrEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('spondyr key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = spondyr({ key: 'inline-key' });
		await expect(
			buildKey(plugin, keyContext('stored-key', 'token')),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		const plugin = spondyr();
		await expect(
			buildKey(plugin, keyContext('stored-key', 'token')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when the key is missing', async () => {
		const plugin = spondyr();
		await expect(
			buildKey(plugin, keyContext(null, 'token')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('resolves the key even when the token is missing, so the endpoint can report it', async () => {
		// The token check belongs in the endpoint, where the message can name it.
		const plugin = spondyr();
		await expect(
			buildKey(plugin, keyContext('stored-key', null)),
		).resolves.toBe('stored-key');
	});
});
