import { AuthMissingError } from 'corsair/core';
import { STANNP_HOSTS } from './client';
import { baseForRegion } from './endpoints/call';
import { stannp, stannpEndpointSchemas, stannpWebhooksNested } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_webhook_signature: jest.fn().mockResolvedValue(null),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof stannp>,
	ctx: ReturnType<typeof keyContext>,
	// unknown: the fake context is not a full KeyBuilderContext.
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = [
	'account.balance',
	'account.topup',
	'addresses.validate',
	'campaigns.approve',
	'campaigns.availableDates',
	'campaigns.book',
	'campaigns.cost',
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.list',
	'campaigns.sample',
	'events.create',
	'files.createFolder',
	'files.listFolders',
	'files.upload',
	'groups.addRecipients',
	'groups.calculate',
	'groups.create',
	'groups.delete',
	'groups.list',
	'groups.purge',
	'groups.removeRecipients',
	'letters.cancel',
	'letters.create',
	'letters.get',
	'letters.post',
	'postcards.cancel',
	'postcards.create',
	'postcards.get',
	'recipients.create',
	'recipients.delete',
	'recipients.get',
	'recipients.import',
	'recipients.list',
	'reporting.list',
	'reporting.summary',
	'selections.create',
	'sms.create',
	'tools.pdfMerge',
	'tools.templates',
];

const webhookPaths = [
	'campaigns.status',
	'events.created',
	'mailpieces.status',
	'webhooks.testUrl',
];

const riskLevels: Record<string, string> = {
	...Object.fromEntries(operations.map((op) => [op, 'read'])),
	'account.topup': 'write',
	'campaigns.approve': 'write',
	'campaigns.book': 'write',
	'campaigns.create': 'write',
	'campaigns.delete': 'destructive',
	'campaigns.sample': 'write',
	'events.create': 'write',
	'files.createFolder': 'write',
	'files.upload': 'write',
	'groups.addRecipients': 'write',
	'groups.calculate': 'write',
	'groups.create': 'write',
	'groups.delete': 'destructive',
	'groups.purge': 'destructive',
	'groups.removeRecipients': 'write',
	'letters.cancel': 'write',
	'letters.create': 'write',
	'letters.post': 'write',
	'postcards.cancel': 'write',
	'postcards.create': 'write',
	'recipients.create': 'write',
	'recipients.delete': 'destructive',
	'recipients.import': 'write',
	'selections.create': 'write',
	'sms.create': 'write',
};

describe('stannp plugin definition', () => {
	const plugin = stannp();

	it('registers as stannp with api_key auth', () => {
		expect(plugin.id).toBe('stannp');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes exactly the 41 catalog operations across 13 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(13);
	});

	it('exposes the four documented webhook deliveries', () => {
		const nested = Object.entries(stannpWebhooksNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(webhookPaths);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskLevels);
	});

	it('marks irreversible operations', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const op of [
			'campaigns.approve',
			'campaigns.delete',
			'groups.delete',
			'recipients.delete',
		]) {
			expect(meta[op as keyof typeof meta]?.irreversible).toBe(true);
		}
		expect(
			meta['postcards.create' as keyof typeof meta]?.irreversible,
		).toBeUndefined();
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(stannpEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(stannpEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('gives every webhook a description and payload schema', () => {
		const schemas = plugin.webhookSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(webhookPaths);
		for (const entry of Object.values(schemas)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			expect(typeof entry.payload?.safeParse).toBe('function');
			expect(typeof entry.response?.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = stannp({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('stannp key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(stannp({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(stannp(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(stannp(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves the webhook secret from the option before the store', async () => {
		const ctx = keyContext(null);

		await expect(
			buildKey(stannp({ webhookSecret: ' wh-s3cret ' }), ctx, 'webhook'),
		).resolves.toBe('wh-s3cret');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads a stored webhook signature secret', async () => {
		const ctx = keyContext(null);
		ctx.keys.get_webhook_signature = jest
			.fn()
			.mockResolvedValue('stored-s3cret');

		await expect(buildKey(stannp(), ctx, 'webhook')).resolves.toBe(
			'stored-s3cret',
		);
	});

	it('returns an empty secret when none is configured, so deliveries stay verifiable-by-nothing', async () => {
		await expect(buildKey(stannp(), keyContext(null), 'webhook')).resolves.toBe(
			'',
		);
	});

	it('does not fall back to the API key for webhook deliveries', async () => {
		// The webhook source needs the signing secret; the API key never
		// verifies a signature, so it must not stand in for one.
		await expect(
			buildKey(stannp({ key: 'option-key' }), keyContext(null), 'webhook'),
		).resolves.toBe('');
	});
});

describe('region handling', () => {
	it('maps the region option onto the documented hosts', () => {
		expect(baseForRegion(undefined)).toBe(STANNP_HOSTS.us);
		expect(baseForRegion('us')).toBe(STANNP_HOSTS.us);
		expect(baseForRegion('eu')).toBe(STANNP_HOSTS.eu);
	});
});
