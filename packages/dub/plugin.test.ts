import { AuthMissingError } from 'corsair/core';
import { generatedEndpointMeta } from './endpoints/generated';
import type { DubKeyBuilderContext } from './index';
import { dub, dubEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_webhook_signature: jest.fn().mockResolvedValue('whsec_stored'),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof dub>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(
		ctx as unknown as DubKeyBuilderContext,
		'endpoint',
	);
}

const operations = [
	'analytics.retrieve',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.update',
	'domains.create',
	'domains.delete',
	'domains.list',
	'domains.update',
	'events.list',
	'folders.create',
	'folders.delete',
	'folders.list',
	'folders.update',
	'links.bulkCreate',
	'links.bulkDelete',
	'links.bulkUpdate',
	'links.count',
	'links.create',
	'links.delete',
	'links.get',
	'links.list',
	'links.update',
	'links.upsert',
	'qr.get',
	'tags.create',
	'tags.delete',
	'tags.list',
	'tags.update',
	'track.lead',
	'track.sale',
];

// The 32 generated operations (endpoints/generated.ts): with the 31 above,
// all 63 operations in https://dub.co/openapi.json.
const allOperations = [
	...operations,
	...Object.keys(generatedEndpointMeta),
].sort();

const riskLevels: Record<string, string> = {
	'analytics.retrieve': 'read',
	'customers.delete': 'destructive',
	'customers.get': 'read',
	'customers.list': 'read',
	'customers.update': 'write',
	'domains.create': 'write',
	'domains.delete': 'destructive',
	'domains.list': 'read',
	'domains.update': 'write',
	'events.list': 'read',
	'folders.create': 'write',
	'folders.delete': 'destructive',
	'folders.list': 'read',
	'folders.update': 'write',
	'links.bulkCreate': 'write',
	'links.bulkDelete': 'destructive',
	'links.bulkUpdate': 'write',
	'links.count': 'read',
	'links.create': 'write',
	'links.delete': 'destructive',
	'links.get': 'read',
	'links.list': 'read',
	'links.update': 'write',
	'links.upsert': 'write',
	'qr.get': 'read',
	'tags.create': 'write',
	'tags.delete': 'destructive',
	'tags.list': 'read',
	'tags.update': 'write',
	'track.lead': 'destructive',
	'track.sale': 'destructive',
	...Object.fromEntries(
		Object.entries(generatedEndpointMeta).map(([name, entry]) => [
			name,
			entry.riskLevel,
		]),
	),
};

const irreversible = [
	'customers.delete',
	'domains.delete',
	'folders.delete',
	'links.bulkDelete',
	'links.delete',
	'tags.delete',
	'track.lead',
	'track.sale',
];

describe('dub plugin definition', () => {
	const plugin = dub();

	it('registers as dub with api_key auth and the 14 webhook events', () => {
		expect(plugin.id).toBe('dub');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.webhookSchemas ?? {})).toHaveLength(14);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'dub-signature': 'abc' },
				body: { event: 'link.clicked' },
			} as never),
		).toBe(true);
	});

	it('exposes all 63 spec operations across 17 groups', () => {
		// unknown: the plugin type leaves the endpoints map generic, and the
		// test only reads the group and op names.
		const nested = (plugin.endpoints ?? {}) as Record<
			string,
			Record<string, unknown>
		>;
		expect(Object.keys(nested).sort()).toEqual([
			'analytics',
			'bounties',
			'commissions',
			'customers',
			'discountCodes',
			'domains',
			'embedTokens',
			'events',
			'folders',
			'links',
			'messages',
			'partners',
			'payouts',
			'programApplications',
			'qr',
			'tags',
			'track',
		]);
		const flat = Object.entries(nested).flatMap(([group, fns]) =>
			Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(flat.sort()).toEqual(allOperations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(allOperations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskLevels);
	});

	it('marks deletes and untrackable writes irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const marked = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();
		expect(marked).toEqual(
			[
				...new Set([
					...irreversible,
					'domains.register',
					'discountCodes.delete',
				]),
			].sort(),
		);
		for (const name of marked) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('destructive');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(dubEndpointSchemas).sort()).toEqual(allOperations);
		for (const schemas of Object.values(dubEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = dub({
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

	it('marks the partner program actions that pay, email or ban as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'commissions.create',
			'commissions.update',
			'commissions.bulkUpdate',
			'bounties.approveSubmission',
			'messages.create',
			'partners.ban',
			'programApplications.approve',
			'discountCodes.create',
		] as const) {
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
		expect(meta['partners.list']?.riskLevel).toBe('read');
	});
});

describe('dub key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(dub({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(dub(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(dub(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('gives webhooks the signing secret, from the option first', async () => {
		await expect(
			(
				dub({ webhookSecret: 'whsec_option' }) as ReturnType<typeof dub>
			).keyBuilder?.(
				keyContext('stored-key') as unknown as DubKeyBuilderContext,
				'webhook',
			),
		).resolves.toBe('whsec_option');
		await expect(
			dub().keyBuilder?.(
				keyContext('stored-key') as unknown as DubKeyBuilderContext,
				'webhook',
			),
		).resolves.toBe('whsec_stored');
	});
});
