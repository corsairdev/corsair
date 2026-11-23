import { AuthMissingError } from 'corsair/core';
import { moco, mocoAuthConfig, mocoEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_subdomain: jest.fn().mockResolvedValue('beachy'),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof moco>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'activities.create',
	'activities.delete',
	'activities.get',
	'activities.list',
	'activities.update',
	'companies.archive',
	'companies.create',
	'companies.get',
	'companies.list',
	'companies.unarchive',
	'companies.update',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'deals.create',
	'deals.delete',
	'deals.get',
	'deals.list',
	'deals.update',
	'invoices.get',
	'invoices.list',
	'invoices.updateStatus',
	'profile.get',
	'projects.archive',
	'projects.create',
	'projects.get',
	'projects.list',
	'projects.report',
	'projects.unarchive',
	'projects.update',
	'session.verify',
	'users.get',
	'users.list',
];

const riskLevels: Record<string, string> = {
	'session.verify': 'read',
	'profile.get': 'read',
	'activities.list': 'read',
	'activities.get': 'read',
	'activities.create': 'write',
	'activities.update': 'write',
	'activities.delete': 'destructive',
	'projects.list': 'read',
	'projects.get': 'read',
	'projects.create': 'write',
	'projects.update': 'write',
	'projects.archive': 'write',
	'projects.unarchive': 'write',
	'projects.report': 'read',
	'companies.list': 'read',
	'companies.get': 'read',
	'companies.create': 'write',
	'companies.update': 'write',
	'companies.archive': 'write',
	'companies.unarchive': 'write',
	'contacts.list': 'read',
	'contacts.get': 'read',
	'contacts.create': 'write',
	'contacts.update': 'write',
	'contacts.delete': 'destructive',
	'deals.list': 'read',
	'deals.get': 'read',
	'deals.create': 'write',
	'deals.update': 'write',
	'deals.delete': 'destructive',
	'invoices.list': 'read',
	'invoices.get': 'read',
	'invoices.updateStatus': 'write',
	'users.list': 'read',
	'users.get': 'read',
};

describe('moco plugin definition', () => {
	const plugin = moco();

	it('registers as moco with api_key auth, the subdomain account field and no webhooks', () => {
		expect(plugin.id).toBe('moco');
		expect(plugin.options?.authType).toBe('api_key');
		expect(mocoAuthConfig.api_key?.account).toEqual(['subdomain']);
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 35 catalog operations across 9 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(9);
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
		expect(Object.keys(mocoEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(mocoEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = moco({
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

describe('moco key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(moco({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(moco(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(moco(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			moco().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
