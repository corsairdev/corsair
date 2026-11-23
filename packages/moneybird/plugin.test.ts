import { AuthMissingError } from 'corsair/core';
import {
	moneybird,
	moneybirdAuthConfig,
	moneybirdEndpointSchemas,
} from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_administration_id: jest.fn().mockResolvedValue('107693607045039116'),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof moneybird>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'administrations.list',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'products.create',
	'products.delete',
	'products.get',
	'products.list',
	'products.update',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'salesInvoices.create',
	'salesInvoices.delete',
	'salesInvoices.get',
	'salesInvoices.list',
	'salesInvoices.send',
	'salesInvoices.update',
	'timeEntries.create',
	'timeEntries.delete',
	'timeEntries.get',
	'timeEntries.list',
	'timeEntries.update',
];

const riskLevels: Record<string, string> = {
	'administrations.list': 'read',
	'contacts.list': 'read',
	'contacts.get': 'read',
	'contacts.create': 'write',
	'contacts.update': 'write',
	'contacts.delete': 'destructive',
	'salesInvoices.list': 'read',
	'salesInvoices.get': 'read',
	'salesInvoices.create': 'write',
	'salesInvoices.update': 'write',
	'salesInvoices.send': 'destructive',
	'salesInvoices.delete': 'destructive',
	'timeEntries.list': 'read',
	'timeEntries.get': 'read',
	'timeEntries.create': 'write',
	'timeEntries.update': 'write',
	'timeEntries.delete': 'destructive',
	'products.list': 'read',
	'products.get': 'read',
	'products.create': 'write',
	'products.update': 'write',
	'products.delete': 'destructive',
	'projects.list': 'read',
	'projects.get': 'read',
	'projects.create': 'write',
	'projects.update': 'write',
	'projects.delete': 'destructive',
};

describe('moneybird plugin definition', () => {
	const plugin = moneybird();

	it('registers as moneybird with api_key auth, the administration account field and no webhooks', () => {
		expect(plugin.id).toBe('moneybird');
		expect(plugin.options?.authType).toBe('api_key');
		expect(moneybirdAuthConfig.api_key?.account).toEqual(['administration_id']);
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 27 catalog operations across 6 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(6);
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

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moneybirdEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(moneybirdEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = moneybird({
			errorHandlers: {
				OVERLOADED_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('OVERLOADED_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('moneybird key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(
			buildKey(moneybird({ key: 'option-token' }), ctx),
		).resolves.toBe('option-token');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API token', async () => {
		await expect(
			buildKey(moneybird(), keyContext('stored-token')),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when no API token is stored', async () => {
		await expect(
			buildKey(moneybird(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			moneybird().keyBuilder?.(keyContext('stored-token') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
