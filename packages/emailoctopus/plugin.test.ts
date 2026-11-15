import { AuthMissingError } from 'corsair/core';
import { emailOctopusEndpointSchemas, emailoctopus } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof emailoctopus>,
	ctx: ReturnType<typeof keyContext>,
) {
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'automations.start',
	'campaigns.get',
	'campaigns.list',
	'campaigns.reportContacts',
	'campaigns.reportLinks',
	'campaigns.reportSummary',
	'contacts.batch',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'contacts.upsert',
	'fields.create',
	'fields.delete',
	'fields.update',
	'lists.create',
	'lists.delete',
	'lists.get',
	'lists.list',
	'lists.update',
	'tags.create',
	'tags.delete',
	'tags.list',
	'tags.update',
];

const risks: Record<string, string> = {
	'automations.start': 'write',
	'campaigns.get': 'read',
	'campaigns.list': 'read',
	'campaigns.reportContacts': 'read',
	'campaigns.reportLinks': 'read',
	'campaigns.reportSummary': 'read',
	'contacts.batch': 'write',
	'contacts.create': 'write',
	'contacts.delete': 'destructive',
	'contacts.get': 'read',
	'contacts.list': 'read',
	'contacts.update': 'write',
	'contacts.upsert': 'write',
	'fields.create': 'write',
	'fields.delete': 'destructive',
	'fields.update': 'write',
	'lists.create': 'write',
	'lists.delete': 'destructive',
	'lists.get': 'read',
	'lists.list': 'read',
	'lists.update': 'write',
	'tags.create': 'write',
	'tags.delete': 'destructive',
	'tags.list': 'read',
	'tags.update': 'write',
};

describe('emailoctopus plugin definition', () => {
	const plugin = emailoctopus();

	it('registers as emailoctopus with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('emailoctopus');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the v2 operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect((entry.description ?? '').length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(risks);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(emailOctopusEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(emailOctopusEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = emailoctopus({
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
	});
});

describe('emailoctopus key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');
		await expect(
			buildKey(emailoctopus({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(emailoctopus(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(emailoctopus(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			emailoctopus().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
