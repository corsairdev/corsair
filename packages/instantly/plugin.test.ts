import { AuthMissingError } from 'corsair/core';
import {
	INSTANTLY_WRITE_OPERATIONS,
	InstantlyEndpointInputSchemas,
} from './endpoints/types';
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

// The cold-email core, with its exact risk levels. The rest of the API is
// checked by the naming rules below.
const CORE = [...READS, ...WRITES, ...DESTRUCTIVE];

const plugin = instantly();
const META = plugin.endpointMeta ?? {};
const OPERATIONS = Object.keys(META).sort();
const riskOf = (path: string) => META[path as keyof typeof META]?.riskLevel;
const descriptionOf = (path: string) =>
	META[path as keyof typeof META]?.description ?? '';

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
	'campaigns.completed',
	'accounts.error',
	'events.other',
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
	it('registers as instantly with API key auth', () => {
		expect(plugin.id).toBe('instantly');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
	});

	it('exposes 165 operations, the core 38 among them', () => {
		expect(leafPaths(plugin.endpoints ?? {}).sort()).toEqual(OPERATIONS);
		expect(OPERATIONS).toHaveLength(165);
		for (const path of CORE) expect(OPERATIONS).toContain(path);
	});

	it('keeps the risk level of every core operation', () => {
		for (const path of CORE) {
			const expected = READS.includes(path)
				? 'read'
				: DESTRUCTIVE.includes(path)
					? 'destructive'
					: 'write';
			expect({ path, risk: riskOf(path) }).toEqual({ path, risk: expected });
		}
	});

	it('gives every operation a description', () => {
		for (const path of OPERATIONS) {
			expect({ path, long: descriptionOf(path).length > 15 }).toEqual({
				path,
				long: true,
			});
		}
	});

	it('marks every delete, removal and merge destructive', () => {
		const destructiveName =
			/\.(delete\w*|remove\w*|merge|scheduleRemoval|changeOwner)$/;
		for (const path of OPERATIONS) {
			if (destructiveName.test(path)) {
				expect({ path, risk: riskOf(path) }).toEqual({
					path,
					risk: 'destructive',
				});
			}
		}
		expect(riskOf('workspace.cancelRemoval')).toBe('write');
	});

	it('marks lookups read, including the POSTs that only read', () => {
		const readName = /\.(list\w*|get\w*|count\w*|search\w*|download\w*)$/;
		const postReads = [
			'accounts.getWarmupAnalytics',
			'accounts.testVitals',
			'campaigns.export',
			'leads.list',
			'leadLabels.testAiReplyLabel',
		];
		for (const path of OPERATIONS) {
			if (readName.test(path) || postReads.includes(path)) {
				expect({ path, risk: riskOf(path) }).toEqual({ path, risk: 'read' });
			}
		}
	});

	it('says which calls send real email, spend credits or the contact limit', () => {
		const sends = [
			'emails.reply',
			'emails.forward',
			'emails.sendTest',
			'campaigns.activate',
			'subsequences.resume',
			'leads.moveToSubsequence',
			'inboxPlacementTests.create',
		];
		for (const path of sends) {
			expect({
				path,
				says: /SENDS (A )?REAL( test)? EMAIL/.test(descriptionOf(path)),
			}).toEqual({
				path,
				says: true,
			});
		}
		expect(META['emails.reply']?.irreversible).toBe(true);
		expect(descriptionOf('emailVerification.verify')).toMatch(
			/SPENDS Instantly email-verification credits/,
		);
		for (const path of ['leads.create', 'leads.addBulk']) {
			expect(descriptionOf(path)).toMatch(/lifetime contact limit/);
			expect(descriptionOf(path)).toMatch(/restarts their sequence/);
			expect(META[path as keyof typeof META]?.irreversible).toBe(true);
		}
		expect(descriptionOf('leads.move')).toMatch(/restarts their sequence/);
		expect(descriptionOf('leads.updateInterestStatus')).toMatch(
			/stops its follow-ups/,
		);
		expect(descriptionOf('webhooks.create')).toMatch(/Hypergrowth/);
		expect(descriptionOf('emails.list')).toMatch(/20 requests a minute/);
		expect(descriptionOf('apiKeys.create')).toMatch(/only time it is returned/);
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
		// The plan limit is stated once, on webhooks.create; an event says only
		// what happened.
		for (const [path, schema] of Object.entries(plugin.webhookSchemas ?? {})) {
			expect({
				path,
				planNote: /Hypergrowth|Growth|poll /.test(schema?.description ?? ''),
			}).toEqual({ path, planNote: false });
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

// leads.addBulk -> leadsAddBulk, the key used in the schema maps.
const operationKey = (path: string) =>
	path.replace(/\.(\w)/, (_, letter: string) => letter.toUpperCase());

describe('writes and retries', () => {
	it('treats exactly the write and destructive operations as writes', () => {
		const writes = OPERATIONS.filter((path) => riskOf(path) !== 'read')
			.map(operationKey)
			.sort();
		expect([...INSTANTLY_WRITE_OPERATIONS].sort()).toEqual(writes);
		for (const key of INSTANTLY_WRITE_OPERATIONS) {
			expect(key in InstantlyEndpointInputSchemas).toBe(true);
		}
	});

	it('lets every write output carry a parse_warning', () => {
		const warning = { parse_warning: 'unexpected shape' };
		for (const path of OPERATIONS.filter((p) => riskOf(p) !== 'read')) {
			const schema =
				instantlyEndpointSchemas[path as keyof typeof instantlyEndpointSchemas]
					.output;
			expect({ path, accepts: schema.safeParse(warning).success }).toEqual({
				path,
				accepts: true,
			});
		}
	});

	it('registers only prefixed error handlers with the catch-all last', () => {
		const names = Object.keys(instantly().errorHandlers ?? {});
		for (const name of names) expect(name).toMatch(/^INSTANTLY_/);
		expect(names.at(-1)).toBe('INSTANTLY_FALLBACK');
	});

	it('keeps INSTANTLY_FALLBACK last when caller handlers are merged', () => {
		const custom = instantly({
			errorHandlers: {
				QUOTA_ERROR: { match: () => false, handler: async () => ({}) },
				DEFAULT: { match: () => true, handler: async () => ({}) },
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).not.toContain('DEFAULT');
		expect(names.at(-1)).toBe('INSTANTLY_FALLBACK');
	});

	it('describes attach_secret as failing, not skipping, without a secret', () => {
		const description =
			InstantlyEndpointInputSchemas.webhooksCreate.shape.attach_secret
				.description;
		expect(description).toMatch(/fails before anything is created/);
		expect(description).not.toMatch(/skipped/);
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

	it('trims the webhook secret it hands to verification', async () => {
		await expect(
			buildKey(
				instantly(),
				keyContext({ webhookSignature: ' stored-secret\n' }),
				'webhook',
			),
		).resolves.toBe('stored-secret');
	});

	it('returns an empty webhook key when none is set, so verification fails closed', async () => {
		await expect(
			buildKey(instantly(), keyContext({}), 'webhook'),
		).resolves.toBe('');
	});
});
