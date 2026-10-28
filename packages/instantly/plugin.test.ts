import type { ErrorContext } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { InstantlyAPIError } from './client';
import { instantly, instantlyEndpointSchemas } from './index';
import { webhookPayload } from './test-fixtures';

const READS = [
	'accounts.list',
	'accounts.get',
	'accounts.getWarmupAnalytics',
	'campaigns.list',
	'campaigns.get',
	'campaigns.getAnalytics',
	'campaigns.getAnalyticsOverview',
	'campaigns.getStepAnalytics',
	'leads.list',
	'leads.get',
	'leadLists.list',
	'emails.list',
	'emails.get',
	'emails.countUnread',
	'blocklist.list',
	'webhooks.list',
	'webhooks.listEventTypes',
	'workspace.get',
];

const WRITES = [
	'accounts.pause',
	'accounts.resume',
	'accounts.enableWarmup',
	'accounts.disableWarmup',
	'campaigns.create',
	'campaigns.update',
	'campaigns.activate',
	'campaigns.pause',
	'leads.create',
	'leads.addBulk',
	'leads.update',
	'leads.updateInterestStatus',
	'leadLists.create',
	'emails.reply',
	'emails.markThreadRead',
	'blocklist.add',
	'webhooks.create',
];

const DESTRUCTIVE = ['leads.delete', 'blocklist.remove', 'webhooks.delete'];

const OPERATIONS = [...READS, ...WRITES, ...DESTRUCTIVE].sort();

const WEBHOOK_PATHS = [
	'emails.sent',
	'emails.opened',
	'emails.linkClicked',
	'emails.bounced',
	'emails.replyReceived',
	'emails.autoReplyReceived',
	'leads.unsubscribed',
	'leads.interested',
	'leads.notInterested',
	'leads.neutral',
	'leads.meetingBooked',
	'leads.meetingCompleted',
	'leads.closed',
	'leads.outOfOffice',
	'leads.wrongPerson',
	'leads.noShow',
	'leads.customLabel',
	'campaigns.completed',
	'accounts.error',
].sort();

// unknown: walks a nested endpoint or webhook tree of any shape.
function leafPaths(tree: Record<string, unknown>): string[] {
	return Object.entries(tree).flatMap(([group, leaves]) =>
		Object.keys(leaves as Record<string, unknown>).map(
			(name) => `${group}.${name}`,
		),
	);
}

// The key builder only reads authType and keys.
function keyContext(fields: {
	apiKey?: string | null;
	webhookSignature?: string | null;
}) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null),
			get_webhook_signature: jest
				.fn()
				.mockResolvedValue(fields.webhookSignature ?? null),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof instantly>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

describe('instantly plugin definition', () => {
	const plugin = instantly();

	it('registers as instantly with API key auth', () => {
		expect(plugin.id).toBe('instantly');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
	});

	it('exposes 38 operations', () => {
		expect(leafPaths(plugin.endpoints ?? {}).sort()).toEqual(OPERATIONS);
		expect(OPERATIONS).toHaveLength(38);
	});

	it('gives every operation a risk level and a description', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(OPERATIONS);
		for (const [path, entry] of Object.entries(meta)) {
			const expected = READS.includes(path)
				? 'read'
				: DESTRUCTIVE.includes(path)
					? 'destructive'
					: 'write';
			expect({ path, risk: entry?.riskLevel }).toEqual({
				path,
				risk: expected,
			});
			expect(entry?.description?.length).toBeGreaterThan(20);
		}
	});

	it('marks every delete and removal destructive, never write', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [path, entry] of Object.entries(meta)) {
			if (/\.(delete|remove)$/.test(path)) {
				expect({ path, risk: entry?.riskLevel }).toEqual({
					path,
					risk: 'destructive',
				});
			}
		}
	});

	it('says which calls send real email or spend the contact limit', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['emails.reply']?.description).toMatch(/SENDS A REAL EMAIL/);
		expect(meta['emails.reply']?.irreversible).toBe(true);
		expect(meta['campaigns.activate']?.description).toMatch(/SENDS REAL EMAIL/);
		for (const path of ['leads.create', 'leads.addBulk'] as const) {
			expect(meta[path]?.description).toMatch(/lifetime contact limit/);
			expect(meta[path]?.description).toMatch(/restarts their sequence/);
			expect(meta[path]?.irreversible).toBe(true);
		}
		expect(meta['leads.updateInterestStatus']?.description).toMatch(
			/stops its follow-ups/,
		);
		expect(meta['webhooks.create']?.description).toMatch(/Hypergrowth/);
		expect(meta['emails.list']?.description).toMatch(/20 requests a minute/);
	});

	it('has input and output schemas for every operation', () => {
		expect(Object.keys(instantlyEndpointSchemas).sort()).toEqual(OPERATIONS);
		for (const schemas of Object.values(instantlyEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('declares a schema for every webhook path', () => {
		expect(leafPaths(plugin.webhooks ?? {}).sort()).toEqual(WEBHOOK_PATHS);
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual(
			WEBHOOK_PATHS,
		);
		for (const schema of Object.values(plugin.webhookSchemas ?? {})) {
			expect(schema?.description).toMatch(/Hypergrowth/);
		}
	});

	it('claims Instantly deliveries and routes them by workspace', () => {
		const body = webhookPayload('reply_received');
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body })).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: { type: 'event', event_type: 'message.received' },
			}),
		).toBe(false);
		expect(plugin.pluginTenantWebhookMatcher?.({ headers: {}, body })).toEqual({
			linkType: 'tenant_external_id',
			externalId: body.workspace,
		});
	});
});

describe('retry policy wiring', () => {
	const handlers = instantly().errorHandlers ?? {};
	const rateLimited = new InstantlyAPIError('Instantly 429', {
		status: 429,
		retryAfter: 2000,
	});

	function retriesFor(operation: string) {
		const context: ErrorContext = {
			pluginId: 'instantly',
			operation,
			input: {},
			originalError: rateLimited,
		};
		return handlers.RATE_LIMIT_ERROR?.handler(rateLimited, context);
	}

	it.each(READS)('retries a rate-limited %s', async (operation) => {
		expect((await retriesFor(operation))?.maxRetries).toBe(3);
	});

	it.each([...WRITES, ...DESTRUCTIVE])(
		'does not retry a rate-limited %s',
		async (operation) => {
			expect(await retriesFor(operation)).toEqual({ maxRetries: 0 });
		},
	);

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = instantly({
			errorHandlers: {
				QUOTA_ERROR: { match: () => false, handler: async () => ({}) },
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
	});
});

describe('instantly key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ apiKey: 'stored' });
		await expect(buildKey(instantly({ key: 'option' }), ctx)).resolves.toBe(
			'option',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(instantly(), keyContext({ apiKey: 'stored' })),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(instantly(), keyContext({ apiKey: null })),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('uses the webhookSecret option, then the stored signature, for webhooks', async () => {
		const ctx = keyContext({ webhookSignature: 'stored-secret' });
		await expect(
			buildKey(instantly({ webhookSecret: 'option-secret' }), ctx, 'webhook'),
		).resolves.toBe('option-secret');
		await expect(buildKey(instantly(), ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
	});

	it('returns an empty webhook key when none is set, so verification fails closed', async () => {
		await expect(
			buildKey(instantly(), keyContext({}), 'webhook'),
		).resolves.toBe('');
	});
});
