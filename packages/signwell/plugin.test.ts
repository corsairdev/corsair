import { AuthMissingError } from 'corsair/core';
import type { SignwellKeyBuilderContext } from './index';
import { signwell, signwellEndpointSchemas } from './index';

/** The key builder only reads authType, keys and options. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof signwell>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SignwellKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'account.get',
	'account.update',
	'apiApplications.delete',
	'apiApplications.get',
	'bulkSends.create',
	'bulkSends.get',
	'bulkSends.getCsvTemplate',
	'bulkSends.getDocuments',
	'bulkSends.list',
	'bulkSends.validateCsv',
	'documents.create',
	'documents.createFromTemplate',
	'documents.delete',
	'documents.get',
	'documents.getCompletedPdf',
	'documents.getNom151Certificate',
	'documents.send',
	'documents.sendReminder',
	'documents.updateAuthentication',
	'documents.updateRecipients',
	'me.get',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.update',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
];

describe('signwell plugin definition', () => {
	const plugin = signwell();

	it('registers as signwell with api_key auth', () => {
		expect(plugin.id).toBe('signwell');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes exactly the twenty-eight catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks every operation that notifies recipients destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'documents.create',
			'documents.createFromTemplate',
			'documents.send',
			'documents.sendReminder',
			'documents.updateRecipients',
			'bulkSends.create',
		]) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('destructive');
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
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		expect(deletes).toEqual([
			{
				name: 'apiApplications.delete',
				riskLevel: 'destructive',
				irreversible: true,
			},
			{
				name: 'documents.delete',
				riskLevel: 'destructive',
				irreversible: true,
			},
			{
				name: 'templates.delete',
				riskLevel: 'destructive',
				irreversible: true,
			},
			{ name: 'webhooks.delete', riskLevel: 'destructive', irreversible: true },
		]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(signwellEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(signwellEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('registers a webhook for every documented event type', () => {
		const webhookGroups = plugin.webhooks as
			| Record<string, Record<string, unknown>> // unknown: webhook tree
			| undefined;
		const paths = Object.entries(webhookGroups ?? {}).flatMap(([group, fns]) =>
			Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(paths.sort()).toEqual([
			'document.canceled',
			'document.completed',
			'document.created',
			'document.declined',
			'document.expired',
			'document.inProgress',
			'document.recipientsUpdated',
			'document.sent',
			'document.signed',
			'document.viewed',
		]);
	});

	it('matches a SignWell envelope with type, time and hash', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: {
					event: { type: 'document_signed', time: 1700000000, hash: 'abc' },
					data: {},
				},
			} as never),
		).toBe(true);
		// Another provider's `{ event: { type } }` delivery is not SignWell's.
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: { event: { type: 'invoice.paid' }, data: {} },
			} as never),
		).toBe(false);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: JSON.stringify({
					event: { type: 'document_sent', time: 1700000000, hash: 'abc' },
				}),
			} as never),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: 'not json' } as never),
		).toBe(false);
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = signwell({
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
		expect(names).toContain('VALIDATION_ERROR');
	});
});

describe('signwell key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(signwell({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(signwell(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(signwell(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('reads the stored webhook id for the webhook source', async () => {
		const ctx = keyContext('stored-key');
		// The webhook source reads get_webhook_signature instead of get_api_key.
		// A test fixture cannot be a full AccountKeyManager, so it is widened here.
		const keys = ctx.keys as unknown as Record<string, jest.Mock>; // unknown: partial
		keys.get_webhook_signature = jest
			.fn()
			.mockResolvedValue('webhook-id-from-account');

		await expect(buildKey(signwell(), ctx, 'webhook')).resolves.toBe(
			'webhook-id-from-account',
		);
	});

	it('prefers the webhookSecret option for the webhook source', async () => {
		await expect(
			buildKey(
				signwell({ webhookSecret: 'opt-id' }),
				keyContext('k'),
				'webhook',
			),
		).resolves.toBe('opt-id');
	});

	it('throws AuthMissingError for a webhook with no id', async () => {
		await expect(
			buildKey(signwell(), keyContext('k'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
