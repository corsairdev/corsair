import { AuthMissingError } from 'corsair/core';
import { baseForBusiness } from './client';
import { storeganise, storeganiseEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_webhook_signature: jest.fn().mockResolvedValue(null),
			get_business_code: jest.fn().mockResolvedValue('spaceup'),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof storeganise>,
	ctx: ReturnType<typeof keyContext>,
	// unknown: the fake context is not a full KeyBuilderContext.
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = [
	'addons.get',
	'addons.list',
	'invoices.list',
	'jobs.get',
	'settings.get',
	'sites.get',
	'sites.list',
	'unitRentals.get',
	'unitRentals.list',
	'unitRentals.update',
	'units.list',
	'users.get',
	'users.list',
];

const riskLevels: Record<string, string> = {
	...Object.fromEntries(operations.map((op) => [op, 'read'])),
	'unitRentals.update': 'write',
};

describe('storeganise plugin definition', () => {
	const plugin = storeganise();

	it('registers as storeganise with api_key auth', () => {
		expect(plugin.id).toBe('storeganise');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes exactly the 13 documented operations across 8 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares every operation in endpointSchemas', () => {
		expect(Object.keys(storeganiseEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares risk levels matching the real side effects', () => {
		const meta = plugin.endpointMeta ?? {};
		const declared = Object.fromEntries(
			operations.map((op) => [
				op,
				(meta as Record<string, { riskLevel: string }>)[op]?.riskLevel,
			]),
		);
		expect(declared).toEqual(riskLevels);
	});

	it('marks the one documented write non-irreversible', () => {
		const meta = (
			plugin.endpointMeta as Record<
				string,
				{ riskLevel: string; irreversible?: boolean } | undefined
			>
		)['unitRentals.update'];
		expect(meta?.riskLevel).toBe('write');
		// Setting custom fields can be undone by another update.
		expect(meta?.irreversible).toBeUndefined();
	});

	it('registers the single event webhook', () => {
		const webhooks = Object.entries(plugin.webhooks ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(webhooks).toEqual(['storeganise.event']);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: webhookBody() }),
		).toBe(true);
	});

	it('declares the business code as an account credential', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['business_code'] },
		});
	});
});

describe('storeganise keyBuilder', () => {
	const plugin = storeganise();

	it('prefers the inline key', async () => {
		const inline = storeganise({ key: 'inline-key' });
		await expect(buildKey(inline, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('resolves the webhook secret from the stored key manager', async () => {
		const ctx = keyContext('stored-key');
		(ctx.keys.get_webhook_signature as jest.Mock).mockResolvedValue(
			'wh-s3cret',
		);
		await expect(buildKey(plugin, ctx, 'webhook')).resolves.toBe('wh-s3cret');
	});

	it('returns an empty webhook secret when none is stored', async () => {
		await expect(
			buildKey(plugin, keyContext('stored-key'), 'webhook'),
		).resolves.toBe('');
	});

	it('prefers the webhookSecret option', async () => {
		const configured = storeganise({ webhookSecret: 'option-secret' });
		const ctx = keyContext('stored-key');
		(ctx.keys.get_webhook_signature as jest.Mock).mockResolvedValue(
			'wh-s3cret',
		);
		await expect(buildKey(configured, ctx, 'webhook')).resolves.toBe(
			'option-secret',
		);
	});
});

describe('base URL routing', () => {
	it('routes the account through its own subdomain', () => {
		expect(baseForBusiness('spaceup')).toBe(
			'https://spaceup.storeganise.com/api/v1',
		);
	});
});

// unknown: a delivery body can be any object until the matcher narrows it.
function webhookBody() {
	return {
		id: '5bf48bd975970f170a8e42b7',
		created: '2021-11-21T11:26:32.105Z',
		type: 'user.created',
		data: {},
	};
}
