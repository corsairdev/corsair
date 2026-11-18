import { AuthMissingError } from 'corsair/core';
import { happyScribeEndpointSchemas, happyscribe } from './index';

// The key builder only reads authType, options and keys.
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
	plugin: ReturnType<typeof happyscribe>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = [
	'companies.get',
	'companies.list',
	'exports.create',
	'exports.get',
	'glossaries.list',
	'meetings.create',
	'memberships.add',
	'memberships.list',
	'memberships.remove',
	'memberships.updateRole',
	'meetings.get',
	'orders.confirm',
	'orders.create',
	'orders.createTranslation',
	'orders.get',
	'organizations.list',
	'people.get',
	'people.list',
	'styleGuides.list',
	'transcriptions.create',
	'transcriptions.delete',
	'transcriptions.getDetails',
	'transcriptions.getSummary',
	'transcriptions.list',
	'transcriptions.updateDetails',
	'translations.createTask',
	'translations.getTask',
	'uploads.getSignedUrl',
];

describe('happyscribe plugin definition', () => {
	const plugin = happyscribe();

	it('registers as happyscribe with api_key auth and webhook receivers', () => {
		expect(plugin.id).toBe('happyscribe');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toMatchObject({
			api_key: { account: ['tenant_external_id'] },
		});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-happyscribe-signature': 't=1,v1=abc' },
				body: {},
			} as never),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 28 catalog operations', () => {
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
		expect(risk['transcriptions.list']).toBe('read');
		expect(risk['transcriptions.getDetails']).toBe('read');
		expect(risk['uploads.getSignedUrl']).toBe('read');
		expect(risk['orders.get']).toBe('read');
		expect(risk['transcriptions.create']).toBe('write');
		expect(risk['exports.create']).toBe('write');
		expect(risk['meetings.create']).toBe('write');
		expect(risk['memberships.add']).toBe('write');
		// Each of these can charge the organization (create and
		// createTranslation through confirm: true), so cautious mode asks first.
		expect(risk['orders.confirm']).toBe('destructive');
		expect(risk['orders.create']).toBe('destructive');
		expect(risk['orders.createTranslation']).toBe('destructive');
		expect(risk['transcriptions.delete']).toBe('destructive');
		expect(risk['memberships.remove']).toBe('destructive');
	});

	it('marks irreversible operations', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const op of ['transcriptions.delete', 'orders.confirm']) {
			expect(meta[op as keyof typeof meta]).toMatchObject({
				irreversible: true,
			});
		}
	});

	it('registers schemas for every operation', () => {
		expect(Object.keys(happyScribeEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const entry of Object.values(happyScribeEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('returns the explicit key over the stored one', async () => {
		const plugin = happyscribe({ key: 'explicit-key' });
		await expect(
			buildKey(plugin, keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('explicit-key');
	});

	it('reads the stored key when no explicit key is set', async () => {
		const plugin = happyscribe();
		await expect(
			buildKey(plugin, keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('uses the webhook secret for webhook sources', async () => {
		const plugin = happyscribe({ webhookSecret: 'whsec_option' });
		await expect(
			buildKey(plugin, keyContext('whsec_stored'), 'webhook'),
		).resolves.toBe('whsec_option');

		const fallback = happyscribe();
		await expect(buildKey(fallback, keyContext(null), 'webhook')).resolves.toBe(
			'whsec_stored',
		);
	});

	it('throws AuthMissingError when no endpoint key exists', async () => {
		const plugin = happyscribe();
		await expect(
			buildKey(plugin, keyContext(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
