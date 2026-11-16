import { AuthMissingError } from 'corsair/core';
import type { SupersaasKeyBuilderContext } from './index';
import { supersaas, supersaasEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof supersaas>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SupersaasKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'bookings.create',
	'bookings.delete',
	'bookings.get',
	'bookings.list',
	'bookings.update',
	'schedules.agenda',
	'schedules.changes',
	'schedules.free',
	'schedules.range',
	'slots.create',
	'slots.delete',
	'slots.get',
	'slots.list',
	'slots.update',
	'users.create',
	'users.createWithKey',
	'users.delete',
	'users.get',
	'users.list',
	'users.update',
];

describe('supersaas plugin definition', () => {
	const plugin = supersaas();

	it('registers as supersaas with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('supersaas');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the account name as a second account credential', () => {
		// HTTP Basic needs the account name as the username and the key as the
		// password, so neither works alone.
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['account_name'] },
		});
	});

	it('exposes exactly the twenty catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(20);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks every delete irreversible and destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = Object.entries(meta)
			.filter(([name]) => name.endsWith('.delete'))
			.map(([name, entry]) => ({
				name,
				riskLevel: entry.riskLevel,
				irreversible: entry.irreversible,
			}));
		expect(deletes).toHaveLength(3);
		for (const entry of deletes) {
			expect(entry.riskLevel).toBe('destructive');
			expect(entry.irreversible).toBe(true);
		}
	});

	it('marks booking creates and updates destructive, since they can email the customer', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['bookings.create']?.riskLevel).toBe('destructive');
		expect(meta['bookings.update']?.riskLevel).toBe('destructive');
	});

	it('marks the schedule reads as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'schedules.changes',
			'schedules.range',
			'schedules.agenda',
			'schedules.free',
		]) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(supersaasEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(supersaasEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = supersaas({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('NOT_FOUND_ERROR');
	});
});

describe('supersaas key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(supersaas({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(supersaas(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(supersaas(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(supersaas(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
