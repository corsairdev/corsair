/**
 * Exercises all 53 endpoint wrappers: the HTTP method and path each one
 * builds, the scoping headers they attach, the cache writes they perform, and
 * what reaches the event log. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Account,
	Billing,
	Bots,
	Chat,
	Files,
	Hub,
	Integrations,
	KnowledgeBases,
	Plugins,
	Tools,
	Workspaces,
} from './endpoints';
import { resolveWorkspaceId } from './endpoints/shared';
import { isNonIdempotent } from './error-handlers';
import { botpressEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Account.get>[0];

function makeCtx() {
	const db = {
		workspaces: makeStore(),
		bots: makeStore(),
		integrations: makeStore(),
	};
	const ctx = {
		key: 'test-botpress-token',
		options: { workspaceId: 'wkspace_test' },
		db,
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastHeaders: Record<string, string> = {};
let lastBody: string | undefined;

/**
 * A response carrying every key any operation's unwrap step reads, so one
 * fixture serves every entry in the routing table below. Object-shaped keys
 * are non-null so `.field` access on a wrapped response never throws.
 */
const RESPONSE_BODY = {
	account: { id: 'acc_1', email: 'a@example.com' },
	id: 'wkspace_1',
	name: 'Test',
	workspaces: [{ id: 'wkspace_2', name: 'Listed' }],
	bot: { id: 'bot_1' },
	integration: { id: 'int_1', name: 'n', version: '1.0.0' },
	integrations: [{ id: 'int_2', name: 'n2', version: '1.0.0' }],
	conversation: { id: 'conv_1' },
	conversations: [],
	message: { id: 'msg_1' },
	workflow: { id: 'wf_1' },
	invoices: [],
	usages: [],
	data: [],
	issues: [],
	iaks: [],
	tags: [],
	values: [],
	knowledgeBases: [],
	row: { id: 1 },
	plugin: { id: 'plug_1', name: 'n', version: '1.0.0' },
	plugins: [],
	interface: { id: 'iface_1', name: 'n', version: '1.0.0' },
	interfaces: [],
	code: 'export default {}',
	quota: { period: 'monthly', value: 0, type: 'bot_count' },
	total: 0,
	lineItems: [],
	chargedInvoices: [],
	failedInvoices: [],
	available: true,
	suggestions: [],
	value: null,
	result: {},
	// Present on every paginated list response so the routing table's list
	// operations all get a token to preserve; see "pagination" below.
	meta: { nextToken: 'next_abc' },
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastHeaders = {};
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		lastHeaders = headers;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected path] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['account.get', (c) => Account.get(c, {}), 'GET', '/v1/admin/account/me'],
	[
		'account.update',
		(c) => Account.update(c, { displayName: 'A' }),
		'PUT',
		'/v1/admin/account/me',
	],
	[
		'account.getPreference',
		(c) => Account.getPreference(c, { key: 'theme' }),
		'GET',
		'/v1/admin/account/preferences/theme',
	],
	[
		'account.setPreference',
		(c) => Account.setPreference(c, { key: 'theme', value: 'dark' }),
		'POST',
		'/v1/admin/account/preferences/theme',
	],

	[
		'workspaces.create',
		(c) => Workspaces.create(c, { name: 'W' }),
		'POST',
		'/v1/admin/workspaces',
	],
	[
		'workspaces.get',
		(c) => Workspaces.get(c, { id: 'w1' }),
		'GET',
		'/v1/admin/workspaces/w1',
	],
	[
		'workspaces.update',
		(c) => Workspaces.update(c, { id: 'w1', name: 'Renamed' }),
		'PUT',
		'/v1/admin/workspaces/w1',
	],
	[
		'workspaces.delete',
		(c) => Workspaces.delete(c, { id: 'w1' }),
		'DELETE',
		'/v1/admin/workspaces/w1',
	],
	[
		'workspaces.list',
		(c) => Workspaces.list(c, {}),
		'GET',
		'/v1/admin/workspaces',
	],
	[
		'workspaces.listPublic',
		(c) => Workspaces.listPublic(c, {}),
		'GET',
		'/v1/admin/workspaces/public',
	],
	[
		'workspaces.checkHandleAvailability',
		(c) => Workspaces.checkHandleAvailability(c, { handle: 'acme' }),
		'PUT',
		'/v1/admin/workspaces/handle-availability',
	],
	[
		'workspaces.setPreference',
		(c) => Workspaces.setPreference(c, { key: 'theme', value: 'dark' }),
		'POST',
		'/v1/admin/workspaces/preferences/theme',
	],
	[
		'workspaces.getQuota',
		(c) => Workspaces.getQuota(c, { id: 'w1', type: 'bot_count' }),
		'GET',
		'/v1/admin/workspaces/w1/quota',
	],
	[
		'workspaces.getAllQuotaCompletion',
		(c) => Workspaces.getAllQuotaCompletion(c, {}),
		'GET',
		'/v1/admin/workspaces/usages/quota-completion',
	],
	[
		'workspaces.breakDownUsageByBot',
		(c) => Workspaces.breakDownUsageByBot(c, { id: 'w1', type: 'bot_count' }),
		'GET',
		'/v1/admin/workspaces/w1/usages/by-bot',
	],

	[
		'billing.listInvoices',
		(c) => Billing.listInvoices(c, { workspaceId: 'w1' }),
		'GET',
		'/v1/admin/workspaces/w1/billing/invoices',
	],
	[
		'billing.getUpcomingInvoice',
		(c) => Billing.getUpcomingInvoice(c, { workspaceId: 'w1' }),
		'GET',
		'/v1/admin/workspaces/w1/billing/upcoming-invoice',
	],
	[
		'billing.chargeUnpaidInvoices',
		(c) =>
			Billing.chargeUnpaidInvoices(c, {
				workspaceId: 'w1',
				invoiceIds: ['i1'],
			}),
		'POST',
		'/v1/admin/workspaces/w1/billing/invoices/charge-unpaid',
	],
	[
		'billing.listUsageHistory',
		(c) => Billing.listUsageHistory(c, { id: 'w1', type: 'bot_count' }),
		'GET',
		'/v1/admin/usages/w1/history',
	],

	[
		'bots.create',
		(c) => Bots.create(c, { name: 'B' }),
		'POST',
		'/v1/admin/bots',
	],
	[
		'bots.update',
		(c) => Bots.update(c, { id: 'bot1', name: 'Renamed' }),
		'PUT',
		'/v1/admin/bots/bot1',
	],
	[
		'bots.listActionRuns',
		(c) => Bots.listActionRuns(c, { id: 'bot1' }),
		'GET',
		'/v1/admin/bots/bot1/action-runs',
	],
	[
		'bots.listIssues',
		(c) => Bots.listIssues(c, { id: 'bot1' }),
		'GET',
		'/v1/admin/bots/bot1/issues',
	],

	[
		'chat.createConversation',
		(c) =>
			Chat.createConversation(c, {
				botId: 'bot1',
				channel: 'webchat',
				tags: {},
			}),
		'POST',
		'/v1/chat/conversations',
	],
	[
		'chat.listConversations',
		(c) => Chat.listConversations(c, { botId: 'bot1' }),
		'GET',
		'/v1/chat/conversations',
	],
	[
		'chat.sendMessage',
		(c) =>
			Chat.sendMessage(c, {
				botId: 'bot1',
				conversationId: 'conv1',
				userId: 'user1',
				type: 'text',
				payload: { text: 'hi' },
				tags: {},
			}),
		'POST',
		'/v1/chat/messages',
	],
	[
		'chat.updateWorkflow',
		(c) =>
			Chat.updateWorkflow(c, { botId: 'bot1', id: 'wf1', status: 'completed' }),
		'PUT',
		'/v1/chat/workflows/wf1',
	],

	[
		'integrations.create',
		(c) => Integrations.create(c, { name: 'n', version: '1.0.0' }),
		'POST',
		'/v1/admin/integrations',
	],
	[
		'integrations.get',
		(c) => Integrations.get(c, { name: 'n', version: '1.0.0' }),
		'GET',
		'/v1/admin/integrations/n/1.0.0',
	],
	[
		'integrations.list',
		(c) => Integrations.list(c, {}),
		'GET',
		'/v1/admin/integrations',
	],
	[
		'integrations.validateUpdate',
		(c) => Integrations.validateUpdate(c, { id: 'int1' }),
		'PUT',
		'/v1/admin/integrations/int1/validate',
	],
	[
		'integrations.requestVerification',
		(c) => Integrations.requestVerification(c, { integrationId: 'int1' }),
		'POST',
		'/v1/admin/integrations/request-verification',
	],
	[
		'integrations.listApiKeys',
		(c) => Integrations.listApiKeys(c, { integrationId: 'int1' }),
		'GET',
		'/v1/admin/integrations/iaks',
	],
	[
		'integrations.deleteShareableId',
		(c) =>
			Integrations.deleteShareableId(c, {
				botId: 'bot1',
				integrationId: 'int1',
			}),
		'DELETE',
		'/v1/admin/bots/bot1/integrations/int1/shareable-id',
	],

	[
		'hub.listIntegrations',
		(c) => Hub.listIntegrations(c, {}),
		'GET',
		'/v1/admin/hub/integrations',
	],
	[
		'hub.getIntegration',
		(c) => Hub.getIntegration(c, { name: 'n', version: '1.0.0' }),
		'GET',
		'/v1/admin/hub/integrations/n/1.0.0',
	],
	[
		'hub.getIntegrationById',
		(c) => Hub.getIntegrationById(c, { id: 'int1' }),
		'GET',
		'/v1/admin/hub/integrations/int1',
	],
	[
		'hub.listInterfaces',
		(c) => Hub.listInterfaces(c, {}),
		'GET',
		'/v1/admin/hub/interfaces',
	],
	[
		'hub.getInterface',
		(c) => Hub.getInterface(c, { name: 'n', version: '1.0.0' }),
		'GET',
		'/v1/admin/hub/interfaces/n/1.0.0',
	],
	[
		'hub.getInterfaceById',
		(c) => Hub.getInterfaceById(c, { id: 'iface1' }),
		'GET',
		'/v1/admin/hub/interfaces/iface1',
	],
	[
		'hub.listPlugins',
		(c) => Hub.listPlugins(c, {}),
		'GET',
		'/v1/admin/hub/plugins',
	],
	[
		'hub.getPlugin',
		(c) => Hub.getPlugin(c, { name: 'n', version: '1.0.0' }),
		'GET',
		'/v1/admin/hub/plugins/n/1.0.0',
	],
	[
		'hub.getPluginById',
		(c) => Hub.getPluginById(c, { id: 'plug1' }),
		'GET',
		'/v1/admin/hub/plugins/plug1',
	],
	[
		'hub.getPluginCode',
		(c) => Hub.getPluginCode(c, { id: 'plug1', platform: 'node' }),
		'GET',
		'/v1/admin/hub/plugins/plug1/code/node',
	],
	[
		'hub.getDereferencedPluginById',
		(c) =>
			Hub.getDereferencedPluginById(c, {
				id: 'plug1',
				interfaces: { hitl: 'int1' },
			}),
		'GET',
		'/v1/admin/hub/plugins/plug1/dereferenced',
	],

	['plugins.list', (c) => Plugins.list(c, {}), 'GET', '/v1/admin/plugins'],

	[
		'files.delete',
		(c) => Files.delete(c, { botId: 'bot1', id: 'file1' }),
		'DELETE',
		'/v1/files/file1',
	],
	[
		'files.listTags',
		(c) => Files.listTags(c, { botId: 'bot1' }),
		'GET',
		'/v1/files/tags',
	],
	[
		'files.listTagValues',
		(c) => Files.listTagValues(c, { botId: 'bot1', tag: 'color' }),
		'GET',
		'/v1/files/tags/color/values',
	],

	[
		'knowledgeBases.list',
		(c) => KnowledgeBases.list(c, { botId: 'bot1' }),
		'GET',
		'/v1/files/knowledge-bases',
	],
	[
		'knowledgeBases.delete',
		(c) => KnowledgeBases.delete(c, { botId: 'bot1', id: 'kb1' }),
		'DELETE',
		'/v1/files/knowledge-bases/kb1',
	],

	[
		'tools.runVrl',
		(c) => Tools.runVrl(c, { data: { a: 1 }, script: '. = .' }),
		'POST',
		'/v1/admin/helper/vrl',
	],
	[
		'tools.getTableRow',
		(c) => Tools.getTableRow(c, { botId: 'bot1', table: 't1', id: 1 }),
		'GET',
		'/v1/tables/t1/row',
	],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('scoping headers', () => {
	const workspaceScoped = [
		'bots.create',
		'integrations.create',
		'integrations.get',
		'integrations.list',
		'integrations.requestVerification',
		'integrations.listApiKeys',
		'plugins.list',
		'workspaces.setPreference',
		'tools.runVrl',
	];
	const botScoped = [
		'chat.createConversation',
		'chat.listConversations',
		'chat.sendMessage',
		'chat.updateWorkflow',
		'files.delete',
		'files.listTags',
		'files.listTagValues',
		'knowledgeBases.list',
		'knowledgeBases.delete',
		'tools.getTableRow',
	];

	it('attaches x-workspace-id to every workspace-scoped operation', async () => {
		const matched = OPERATIONS.filter(([p]) => workspaceScoped.includes(p));
		// Without this, a renamed/removed operation would silently shrink the
		// loop below to zero iterations and the test would still pass.
		expect(matched).toHaveLength(workspaceScoped.length);

		for (const [path, invoke] of matched) {
			const { ctx } = makeCtx();
			await invoke(ctx);
			expect(lastHeaders['x-workspace-id']).toBe('wkspace_test');
		}
	});

	it('attaches x-bot-id to every bot-scoped operation', async () => {
		const matched = OPERATIONS.filter(([p]) => botScoped.includes(p));
		expect(matched).toHaveLength(botScoped.length);

		for (const [path, invoke] of matched) {
			const { ctx } = makeCtx();
			await invoke(ctx);
			expect(lastHeaders['x-bot-id']).toBe('bot1');
		}
	});

	it('sends neither scoping header for public hub browsing', async () => {
		const matched = OPERATIONS.filter(([p]) => p.startsWith('hub.'));
		expect(matched).toHaveLength(11);

		for (const [path, invoke] of matched) {
			const { ctx } = makeCtx();
			await invoke(ctx);
			expect(lastHeaders['x-workspace-id']).toBeUndefined();
			expect(lastHeaders['x-bot-id']).toBeUndefined();
		}
	});
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(botpressEndpointSchemas).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(53);
	});

	it('treats the confirmed non-idempotent POSTs, and only those, as unsafe to retry', () => {
		// `error-handlers.ts` decides whether a network failure may be retried.
		// `runVrl` and the `setPreference` routes are POST but excluded there
		// (VRL has no persisted side effect; the preference routes are absolute
		// setters) — this asserts the predicate against the routing table
		// including that carve-out, so neither can drift unnoticed.
		const posts = OPERATIONS.filter(([, , method]) => method === 'POST')
			.map(([path]) => path)
			.sort();
		const idempotentPosts = [
			'account.setPreference',
			'tools.runVrl',
			'workspaces.setPreference',
		];
		const expectedNonIdempotent = posts
			.filter((path) => !idempotentPosts.includes(path))
			.sort();
		const nonIdempotent = OPERATIONS.map(([path]) => path)
			.filter(isNonIdempotent)
			.sort();

		expect(nonIdempotent).toEqual(expectedNonIdempotent);
		expect(posts).toHaveLength(10);
		expect(nonIdempotent).toHaveLength(7);
	});
});

describe('pagination', () => {
	// Every list operation whose real Botpress response carries a
	// `meta.nextToken` (confirmed from `@botpress/client` v2.2.0's type
	// declarations - `billing.listInvoices`, `billing.listUsageHistory`,
	// `workspaces.breakDownUsageByBot` and `integrations.listApiKeys` are
	// deliberately excluded: their real responses have no `meta` at all).
	const paginatedPaths = [
		'workspaces.list',
		'workspaces.listPublic',
		'bots.listActionRuns',
		'bots.listIssues',
		'chat.listConversations',
		'integrations.list',
		'hub.listIntegrations',
		'hub.listInterfaces',
		'hub.listPlugins',
		'plugins.list',
		'files.listTags',
		'files.listTagValues',
		'knowledgeBases.list',
	];
	const paginatedOperations = OPERATIONS.filter(([path]) =>
		paginatedPaths.includes(path),
	);

	it('covers exactly the operations whose real response carries a continuation token', () => {
		expect(paginatedOperations.map(([path]) => path).sort()).toEqual(
			[...paginatedPaths].sort(),
		);
		expect(paginatedOperations).toHaveLength(13);
	});

	it('preserves the continuation token instead of discarding it', async () => {
		for (const [path, invoke] of paginatedOperations) {
			const { ctx } = makeCtx();
			const result = (await invoke(ctx)) as { nextToken?: string };
			expect(result.nextToken).toBe('next_abc');
		}
	});
});

describe('caching', () => {
	it('mirrors a workspace on create, get, update and list', async () => {
		const { ctx, db } = makeCtx();

		await Workspaces.create(ctx, { name: 'W' });
		await Workspaces.get(ctx, { id: 'w1' });
		await Workspaces.update(ctx, { id: 'w1', name: 'Renamed' });
		await Workspaces.list(ctx, {});

		expect(db.workspaces.upsertByEntityId).toHaveBeenCalledTimes(4);
	});

	it('evicts a workspace on delete', async () => {
		const { ctx, db } = makeCtx();

		await Workspaces.delete(ctx, { id: 'w1' });

		expect(db.workspaces.deleteByEntityId).toHaveBeenCalledWith('w1');
	});

	it('mirrors a bot on create and update', async () => {
		const { ctx, db } = makeCtx();

		await Bots.create(ctx, { name: 'B' });
		await Bots.update(ctx, { id: 'bot1', name: 'Renamed' });

		expect(db.bots.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('mirrors an integration on create, get and list', async () => {
		const { ctx, db } = makeCtx();

		await Integrations.create(ctx, { name: 'n', version: '1.0.0' });
		await Integrations.get(ctx, { name: 'n', version: '1.0.0' });
		await Integrations.list(ctx, {});

		expect(db.integrations.upsertByEntityId).toHaveBeenCalledTimes(3);
	});
});

describe('event log', () => {
	it('keeps free text out of the payload when auditPayload names the fields', async () => {
		const { ctx } = makeCtx();
		await Workspaces.update(ctx, { id: 'w1', about: 'a long free-text bio' });

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({ id: 'w1', fields: ['id', 'about'] });
	});

	it('never logs a VRL script or its data', async () => {
		const { ctx } = makeCtx();
		await Tools.runVrl(ctx, {
			data: { secret: 'x' },
			script: '.secret = null',
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({ fields: ['data', 'script'] });
	});

	it('logs the invoice count, not the invoice ids, for a charge', async () => {
		const { ctx } = makeCtx();
		await Billing.chargeUnpaidInvoices(ctx, {
			workspaceId: 'w1',
			invoiceIds: ['i1', 'i2'],
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({
			workspaceId: 'w1',
			fields: ['workspaceId', 'invoiceIds'],
			invoiceCount: 2,
		});
	});
});

describe('request bodies', () => {
	it('omits fields the caller did not supply', async () => {
		const { ctx } = makeCtx();
		await Workspaces.update(ctx, { id: 'w1', name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
		expect(body).not.toHaveProperty('about');
		expect(body).not.toHaveProperty('handle');
	});

	it('sends no body on a delete', async () => {
		const { ctx } = makeCtx();
		await Workspaces.delete(ctx, { id: 'w1' });

		expect(lastBody).toBeUndefined();
	});
});

describe('delete results', () => {
	it('reports an empty object rather than the provider-empty body', async () => {
		const { ctx } = makeCtx();

		await expect(Workspaces.delete(ctx, { id: 'w1' })).resolves.toEqual({});
		await expect(
			Files.delete(ctx, { botId: 'bot1', id: 'file1' }),
		).resolves.toEqual({});
	});
});

describe('input schemas', () => {
	it('rejects a blank invoice id', () => {
		const schema =
			botpressEndpointSchemas['billing.chargeUnpaidInvoices'].input;

		expect(
			schema.safeParse({ workspaceId: 'w1', invoiceIds: [''] }).success,
		).toBe(false);
		expect(
			schema.safeParse({ workspaceId: 'w1', invoiceIds: ['   '] }).success,
		).toBe(false);
		expect(
			schema.safeParse({ workspaceId: 'w1', invoiceIds: ['i1'] }).success,
		).toBe(true);
	});

	it('rejects a whitespace id', () => {
		const schema = botpressEndpointSchemas['workspaces.get'].input;

		expect(schema.safeParse({ id: '   ' }).success).toBe(false);
		expect(schema.safeParse({ id: 'w1' }).success).toBe(true);
	});
});

describe('resolveWorkspaceId', () => {
	it('ignores a whitespace configured id', async () => {
		await expect(
			resolveWorkspaceId({
				key: 'test-botpress-token',
				options: { workspaceId: '   ' },
			}),
		).resolves.toBe('wkspace_2');
	});

	it('trims a stored workspace id', async () => {
		await expect(
			resolveWorkspaceId({
				key: 'test-botpress-token',
				options: {},
				keys: { get_workspace_id: async () => '  stored_ws  ' },
			}),
		).resolves.toBe('stored_ws');
	});
});
