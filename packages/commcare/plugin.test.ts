import { AuthMissingError } from 'corsair/core';
import { commCareEndpointSchemas, commcare } from './index';

// The key builder reads authType, options and keys.
function keyContext(
	apiKey: string | null,
	options: Record<string, unknown> = {},
) {
	return {
		authType: 'api_key' as const,
		options,
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof commcare>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'cases.bulkFetch',
	'cases.get',
	'cases.getByExternalId',
	'cases.list',
	'detExports.list',
	'forms.bulkAction',
	'forms.bulkActionStatus',
	'forms.get',
	'forms.list',
	'groups.create',
	'groups.get',
	'groups.list',
	'groups.update',
	'locationTypes.get',
	'locationTypes.list',
	'locations.get',
	'locations.list',
	'lookupTables.get',
	'lookupTables.list',
	'ota.restore',
	'fixtures.getItem',
	'fixtures.list',
	'reports.getData',
	'reports.list',
	'submissions.submit',
	'users.create',
	'users.delete',
	'users.get',
	'users.list',
	'users.sendPasswordReset',
	'users.update',
	'webUsers.list',
];

describe('commcare plugin definition', () => {
	const plugin = commcare();

	it('registers as commcare with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('commcare');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 32 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const risk = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risk['forms.list']).toBe('read');
		expect(risk['cases.list']).toBe('read');
		expect(risk['reports.getData']).toBe('read');
		expect(risk['users.create']).toBe('write');
		expect(risk['users.sendPasswordReset']).toBe('write');
		expect(risk['submissions.submit']).toBe('write');
		expect(risk['forms.bulkAction']).toBe('destructive');
		expect(risk['users.delete']).toBe('destructive');
	});

	it('marks irreversible deletes', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const op of ['users.delete', 'forms.bulkAction']) {
			expect(meta[op as keyof typeof meta]).toMatchObject({
				irreversible: true,
			});
		}
	});

	it('registers schemas for every operation', () => {
		expect(Object.keys(commCareEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const entry of Object.values(commCareEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('returns the explicit key over the stored one', async () => {
		const plugin = commcare({ key: 'explicit-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'explicit-key',
		);
	});

	it('reads the stored key when no explicit key is set', async () => {
		const plugin = commcare();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key exists', async () => {
		const plugin = commcare();
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
