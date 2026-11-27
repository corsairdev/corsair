import { AuthMissingError } from 'corsair/core';
import { dub, dubEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof dub>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
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
	'track.lead': 'write',
	'track.sale': 'write',
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

	it('registers as dub with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('dub');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 31 catalog operations across 9 groups', () => {
		// unknown: the plugin type leaves the endpoints map generic, and the
		// test only reads the group and op names.
		const nested = (plugin.endpoints ?? {}) as Record<
			string,
			Record<string, unknown>
		>;
		expect(Object.keys(nested).sort()).toEqual([
			'analytics',
			'customers',
			'domains',
			'events',
			'folders',
			'links',
			'qr',
			'tags',
			'track',
		]);
		const flat = Object.entries(nested).flatMap(([group, fns]) =>
			Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(flat.sort()).toEqual(operations);
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

	it('marks deletes and untrackable writes irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const marked = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();
		expect(marked).toEqual([...new Set(irreversible)].sort());
		for (const name of irreversible) {
			expect(meta[name].riskLevel).toBe(
				name.startsWith('track.') ? 'write' : 'destructive',
			);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(dubEndpointSchemas).sort()).toEqual(operations);
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

	it('keeps the partners program surface out of scope', () => {
		const flat = Object.keys(dubEndpointSchemas);
		for (const excluded of [
			'partners.list',
			'commissions.list',
			'payouts.list',
			'discountCodes.list',
			'bounties.submissions.list',
			'messages.list',
			'programApplications.list',
			'tokens.embedReferrals.create',
			'domains.register',
			'domains.status',
			'track.open',
		]) {
			expect(flat).not.toContain(excluded);
		}
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

	it('refuses webhook keys: Dub sends this plugin no inbound webhooks', async () => {
		await expect(
			dub().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
