import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import { TimelyAccountIdMissingError } from './client';
import {
	Accounts,
	Clients,
	Projects,
	Reports,
	Tags,
	Teams,
	TimeEntries,
	Users,
	Webhooks,
} from './endpoints';
import {
	clearDiscoveredTimelyAccountIds,
	redactSecrets,
	resolveTimelyAccountId,
} from './endpoints/shared';
import {
	TimelyEndpointInputSchemas,
	TimelyEndpointOutputSchemas,
} from './endpoints/types';
import type { TimelyContext, TimelyKeyBuilderContext } from './index';
import { timely, timelyAuthConfig, timelyEndpointSchemas } from './index';
import { TimelyWebhookHandlers } from './webhooks';
import {
	extractRawPayload,
	isTimelyWebhookBody,
	verifyTimelyWebhookSignature,
} from './webhooks/types';

const BASE = 'https://api.timelyapp.com/1.1';
const ACCOUNT = '1147097';
const TOKEN = 'test-access-token';

function jsonResponse(body: unknown, status = 200) {
	return {
		ok: status < 400,
		status,
		statusText: status < 400 ? 'OK' : 'Error',
		headers: new Headers({ 'content-type': 'application/json' }),
		text: async () => JSON.stringify(body),
		json: async () => body,
		arrayBuffer: async () => Buffer.from(JSON.stringify(body)),
	};
}

type Call = { url: URL; method: string; body: unknown; auth: string | null };

const originalFetch = globalThis.fetch;
let calls: Call[] = [];
let responses: Array<{ body: unknown; status?: number }> = [];

function respondWith(...items: Array<{ body: unknown; status?: number }>) {
	responses = items;
}

beforeEach(() => {
	calls = [];
	responses = [];
	clearDiscoveredTimelyAccountIds();
	globalThis.fetch = jest.fn(
		async (input: string | URL | Request, init?: RequestInit) => {
			const headers = new Headers(
				init?.headers as ConstructorParameters<typeof Headers>[0],
			);
			calls.push({
				url: new URL(String(input)),
				method: init?.method ?? 'GET',
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
				auth: headers.get('authorization'),
			});
			const next = responses.shift() ?? { body: {} };
			return jsonResponse(next.body, next.status ?? 200);
		},
	) as unknown as typeof fetch;
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

function makeCtx(
	overrides: {
		options?: Record<string, unknown>;
		storedAccountId?: string | null;
		key?: string;
	} = {},
): TimelyContext {
	const ctx = {
		key: overrides.key ?? TOKEN,
		options: overrides.options ?? {},
		keys: {
			get_account_id: async () =>
				overrides.storedAccountId === undefined
					? ACCOUNT
					: overrides.storedAccountId,
		},
		$getAccountId: async () => 'account-row',
		database: undefined,
	};
	// Necessity: endpoint handlers take the full plugin context; tests supply only
	// the fields the handlers read (key, options, keys, logging hooks).
	return ctx as unknown as TimelyContext;
}

// unknown: each endpoint has its own input/output types; the route table below
// checks requests generically.
type AnyEndpoint = (ctx: TimelyContext, input: never) => Promise<unknown>;

type RouteCase = {
	name: string;
	fn: AnyEndpoint;
	input: Record<string, unknown>;
	method: string;
	path: string;
	query?: Record<string, string>;
	body?: unknown;
	response: unknown;
};

const entry = {
	id: 11,
	day: '2026-11-06',
	note: 'n',
	duration: { hours: 1, minutes: 15, formatted: '01:15' },
	timer_state: 'stop',
};
const project = { id: 21, name: 'P', rate_type: 'project', client: { id: 31 } };
const client = { id: 31, name: 'C', active: true, external_id: null };
const label = { id: 41, name: 'L', parent_id: null, children: [] };
const webhook = {
	id: 51,
	account_id: 1147097,
	url: 'https://example.com/hook',
	subscriptions: ['hours:created'],
	secret_token: 'super-secret-signing-token',
	active: true,
	custom_headers: {},
};
const bulkResult = {
	created_ids: [1],
	updated_ids: [],
	deleted_ids: [],
	errors: { create: [], update: [], delete: [] },
	job: null,
};

const A = `/${ACCOUNT}`;
const routes: RouteCase[] = [
	{
		name: 'accounts.list',
		fn: Accounts.list,
		input: {},
		method: 'GET',
		path: '/accounts',
		response: [{ id: 1147097, name: 'W' }],
	},
	{
		name: 'accounts.get',
		fn: Accounts.get,
		input: {},
		method: 'GET',
		path: `/accounts/${ACCOUNT}`,
		response: { id: 1147097 },
	},
	{
		name: 'clients.list',
		fn: Clients.list,
		input: { limit: 10, offset: 5, order: 'desc', show: 'archived' },
		method: 'GET',
		path: `${A}/clients`,
		query: { limit: '10', offset: '5', order: 'desc', show: 'archived' },
		response: [client],
	},
	{
		name: 'clients.get',
		fn: Clients.get,
		input: { id: 31 },
		method: 'GET',
		path: `${A}/clients/31`,
		response: client,
	},
	{
		name: 'clients.create',
		fn: Clients.create,
		input: { name: 'Acme', color: 'a020f0', external_id: 'crm-1' },
		method: 'POST',
		path: `${A}/clients`,
		body: { client: { name: 'Acme', color: 'a020f0', external_id: 'crm-1' } },
		response: client,
	},
	{
		name: 'clients.update',
		fn: Clients.update,
		input: { id: '31', active: false },
		method: 'PUT',
		path: `${A}/clients/31`,
		body: { client: { active: false } },
		response: client,
	},
	{
		name: 'projects.list',
		fn: Projects.list,
		input: {
			limit: 50,
			offset: 0,
			state: 'active',
			relation: 'assigned',
			totals: false,
		},
		method: 'GET',
		path: `${A}/projects`,
		query: {
			limit: '50',
			offset: '0',
			state: 'active',
			relation: 'assigned',
			totals: 'false',
		},
		response: [project],
	},
	{
		name: 'projects.get',
		fn: Projects.get,
		input: { id: 21 },
		method: 'GET',
		path: `${A}/projects/21`,
		response: project,
	},
	{
		name: 'projects.create',
		fn: Projects.create,
		input: {
			name: 'Site',
			rate_type: 'user',
			client_id: '31',
			users: [{ user_id: 7, hour_rate: 150 }],
			budget_type: 'H',
			budget: 40,
		},
		method: 'POST',
		path: `${A}/projects`,
		body: {
			project: {
				name: 'Site',
				rate_type: 'user',
				client_id: 31,
				users: [{ user_id: 7, hour_rate: 150 }],
				budget_type: 'H',
				budget: 40,
			},
		},
		response: project,
	},
	{
		name: 'projects.update',
		fn: Projects.update,
		input: { id: 21, name: 'Site v2', active: false },
		method: 'PUT',
		path: `${A}/projects/21`,
		body: { project: { name: 'Site v2', active: false } },
		response: project,
	},
	{
		name: 'projects.delete',
		fn: Projects.remove,
		input: { id: 21 },
		method: 'DELETE',
		path: `${A}/projects/21`,
		response: {},
	},
	{
		name: 'timeEntries.list',
		fn: TimeEntries.list,
		input: {
			since: '2026-11-01',
			upto: '2026-11-07',
			project_id: 21,
			user_id: '7',
			hour_ids: [1, 2],
			sort: 'day',
			order: 'asc',
			page: 2,
			per_page: 100,
		},
		method: 'GET',
		path: `${A}/hours`,
		query: {
			since: '2026-11-01',
			upto: '2026-11-07',
			project_id: '21',
			user_id: '7',
			hour_ids: '1,2',
			sort: 'day',
			order: 'asc',
			page: '2',
			per_page: '100',
		},
		response: [entry],
	},
	{
		name: 'timeEntries.get',
		fn: TimeEntries.get,
		input: { id: 11 },
		method: 'GET',
		path: `${A}/hours/11`,
		response: entry,
	},
	{
		name: 'timeEntries.create',
		fn: TimeEntries.create,
		input: {
			project_id: 21,
			day: '2026-11-06',
			hours: 1,
			minutes: 15,
			note: 'Standup',
			from: '09:00',
			to: '10:15',
			label_ids: [41],
		},
		method: 'POST',
		path: `${A}/hours`,
		body: {
			event: {
				project_id: 21,
				day: '2026-11-06',
				hours: 1,
				minutes: 15,
				note: 'Standup',
				from: '09:00',
				to: '10:15',
				label_ids: [41],
			},
		},
		response: entry,
	},
	{
		name: 'timeEntries.update',
		fn: TimeEntries.update,
		input: { id: 11, note: 'edited', billed: true },
		method: 'PUT',
		path: `${A}/hours/11`,
		body: { event: { note: 'edited', billed: true } },
		response: entry,
	},
	{
		name: 'timeEntries.delete',
		fn: TimeEntries.remove,
		input: { id: 11 },
		method: 'DELETE',
		path: `${A}/hours/11`,
		response: {},
	},
	{
		name: 'timeEntries.bulk',
		fn: TimeEntries.bulk,
		input: {
			create: [{ project_id: 21, day: '2026-11-06', hours: 2 }],
			update: [{ id: 12, note: 'x' }],
			delete: ['13'],
		},
		method: 'POST',
		path: `${A}/bulk/hours`,
		body: {
			create: [{ project_id: 21, day: '2026-11-06', hours: 2 }],
			update: [{ id: 12, note: 'x' }],
			delete: [13],
		},
		response: bulkResult,
	},
	{
		name: 'timeEntries.startTimer',
		fn: TimeEntries.startTimer,
		input: { id: 11 },
		method: 'PUT',
		path: `${A}/hours/11/start`,
		response: { ...entry, timer_state: 'start' },
	},
	{
		name: 'timeEntries.stopTimer',
		fn: TimeEntries.stopTimer,
		input: { id: 11 },
		method: 'PUT',
		path: `${A}/hours/11/stop`,
		response: entry,
	},
	{
		name: 'tags.list',
		fn: Tags.list,
		input: { filter: 'active', parent_id: 40, limit: 20 },
		method: 'GET',
		path: `${A}/labels`,
		query: { filter: 'active', parent_id: '40', limit: '20' },
		response: [label],
	},
	{
		name: 'tags.get',
		fn: Tags.get,
		input: { id: 41 },
		method: 'GET',
		path: `${A}/labels/41`,
		response: label,
	},
	{
		name: 'tags.create',
		fn: Tags.create,
		input: { name: 'Design', parent_id: 40 },
		method: 'POST',
		path: `${A}/labels`,
		body: { label: { name: 'Design', parent_id: 40 } },
		response: label,
	},
	{
		name: 'tags.update',
		fn: Tags.update,
		input: { id: 41, active: false },
		method: 'PUT',
		path: `${A}/labels/41`,
		body: { label: { active: false } },
		response: label,
	},
	{
		name: 'tags.delete',
		fn: Tags.remove,
		input: { id: 41 },
		method: 'DELETE',
		path: `${A}/labels/41`,
		response: {},
	},
	{
		name: 'teams.list',
		fn: Teams.list,
		input: { limit: 5, order: 'asc' },
		method: 'GET',
		path: `${A}/teams`,
		query: { limit: '5', order: 'asc' },
		response: [{ id: 61, name: 'T' }],
	},
	{
		name: 'teams.get',
		fn: Teams.get,
		input: { id: 61 },
		method: 'GET',
		path: `${A}/teams/61`,
		response: { id: 61, name: 'T' },
	},
	{
		name: 'users.list',
		fn: Users.list,
		input: { kind: 'all', filter: 'deleted', limit: 100 },
		method: 'GET',
		path: `${A}/users`,
		query: { kind: 'all', filter: 'deleted', limit: '100' },
		response: [{ id: 7, name: 'U' }],
	},
	{
		name: 'users.get',
		fn: Users.get,
		input: { id: 7 },
		method: 'GET',
		path: `${A}/users/7`,
		response: { id: 7 },
	},
	{
		name: 'users.current',
		fn: Users.current,
		input: {},
		method: 'GET',
		path: `${A}/users/current`,
		response: { id: 7 },
	},
	{
		name: 'reports.totals',
		fn: Reports.totals,
		input: { since: '2026-11-01', until: '2026-11-07', client_ids: [31, 32] },
		method: 'GET',
		path: `${A}/reports`,
		query: { since: '2026-11-01', until: '2026-11-07', client_ids: '31,32' },
		response: [{ id: 31, name: 'C', projects: [] }],
	},
	{
		name: 'reports.filter',
		fn: Reports.filter,
		input: {
			since: '2026-11-01',
			until: '2026-11-07',
			group_by: ['users', 'days'],
			scope: 'totals',
			billed: false,
			label_ids: [41],
		},
		method: 'GET',
		path: `${A}/reports/filter`,
		query: {
			since: '2026-11-01',
			until: '2026-11-07',
			group_by: 'users,days',
			scope: 'totals',
			billed: 'false',
			label_ids: '41',
		},
		response: { totals: {}, clients: [] },
	},
	{
		name: 'webhooks.list',
		fn: Webhooks.list,
		input: { limit: 10, offset: 0 },
		method: 'GET',
		path: `${A}/webhooks`,
		query: { limit: '10', offset: '0' },
		response: [webhook],
	},
	{
		name: 'webhooks.get',
		fn: Webhooks.get,
		input: { id: 51 },
		method: 'GET',
		path: `${A}/webhooks/51`,
		response: webhook,
	},
	{
		name: 'webhooks.create',
		fn: Webhooks.create,
		input: {
			url: 'https://example.com/hook',
			subscriptions: ['hours:created', 'labels:deleted'],
			secret_token: 'super-secret-signing-token',
		},
		method: 'POST',
		path: `${A}/webhooks`,
		body: {
			webhook: {
				url: 'https://example.com/hook',
				subscriptions: ['hours:created', 'labels:deleted'],
				secret_token: 'super-secret-signing-token',
			},
		},
		response: webhook,
	},
	{
		name: 'webhooks.update',
		fn: Webhooks.update,
		input: { id: 51, active: false },
		method: 'PUT',
		path: `${A}/webhooks/51`,
		body: { webhook: { active: false } },
		response: webhook,
	},
	{
		name: 'webhooks.delete',
		fn: Webhooks.remove,
		input: { id: 51 },
		method: 'DELETE',
		path: `${A}/webhooks/51`,
		response: {},
	},
];

describe('Timely routes (method, path, query, body)', () => {
	it('covers every operation the plugin exposes', () => {
		expect(routes.map((r) => r.name).sort()).toEqual(
			Object.keys(timelyEndpointSchemas).sort(),
		);
	});

	it.each(routes)('$name -> $method $path', async (route) => {
		respondWith({ body: route.response });
		const result = await route.fn(makeCtx(), route.input as never);
		expect(calls).toHaveLength(1);
		const call = calls[0]!;
		expect(call.method).toBe(route.method);
		expect(`${call.url.origin}${call.url.pathname}`).toBe(
			`${BASE}${route.path}`,
		);
		expect(Object.fromEntries(call.url.searchParams)).toEqual(
			route.query ?? {},
		);
		expect(call.body).toEqual(route.body);
		expect(call.auth).toBe(`Bearer ${TOKEN}`);
		expect(result).toBeDefined();
	});

	it('deletes return { id, deleted: true } instead of Timely’s empty {}', async () => {
		respondWith({ body: {} });
		await expect(TimeEntries.remove(makeCtx(), { id: 11 })).resolves.toEqual({
			id: '11',
			deleted: true,
		});
	});
});

describe('workspace (account_id) resolution', () => {
	it('prefers the call’s accountId over the plugin option and stored id', async () => {
		respondWith({ body: [] });
		await Clients.list(
			makeCtx({ options: { accountId: 222 }, storedAccountId: '333' }),
			{ accountId: 111 },
		);
		expect(calls[0]!.url.pathname).toBe('/1.1/111/clients');
	});

	it('uses timely({ accountId }) before the stored account_id', async () => {
		respondWith({ body: [] });
		await Clients.list(
			makeCtx({ options: { accountId: '222' }, storedAccountId: '333' }),
			{},
		);
		expect(calls[0]!.url.pathname).toBe('/1.1/222/clients');
	});

	it('uses the stored account_id when no id is configured', async () => {
		respondWith({ body: [] });
		await Projects.list(makeCtx({ storedAccountId: '333' }), {});
		expect(calls[0]!.url.pathname).toBe('/1.1/333/projects');
	});

	it('discovers the only workspace from GET /accounts and caches it per token', async () => {
		respondWith({ body: [{ id: 444 }] }, { body: [] }, { body: [] });
		const ctx = makeCtx({ storedAccountId: null });
		await Tags.list(ctx, {});
		await Tags.list(ctx, {});
		expect(calls.map((c) => c.url.pathname)).toEqual([
			'/1.1/accounts',
			'/1.1/444/labels',
			'/1.1/444/labels',
		]);
	});

	it.each([
		[0, []],
		[2, [{ id: 1 }, { id: 2 }]],
	])(
		'throws TimelyAccountIdMissingError when the token reaches %i workspaces (never calls /undefined)',
		async (_count, accounts) => {
			respondWith({ body: accounts });
			await expect(
				TimeEntries.list(makeCtx({ storedAccountId: null }), {}),
			).rejects.toBeInstanceOf(TimelyAccountIdMissingError);
			expect(calls.map((c) => c.url.pathname)).toEqual(['/1.1/accounts']);
			expect(calls.some((c) => c.url.pathname.includes('undefined'))).toBe(
				false,
			);
		},
	);

	it('rejects a non-numeric accountId before any request', async () => {
		await expect(
			resolveTimelyAccountId(makeCtx(), '1/../../users' as never),
		).rejects.toThrow(/numeric/);
		expect(calls).toHaveLength(0);
	});
});

describe('input validation', () => {
	it('rejects unknown keys (catches projectId vs project_id)', () => {
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesCreate.parse({
				project_id: 1,
				day: '2026-11-06',
				projectId: 1,
			}),
		).toThrow(/Unrecognized key/);
	});

	it('needs both since and upto for a range', () => {
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesList.parse({ since: '2026-11-01' }),
		).toThrow(/since.*upto/);
	});

	it('checks date and time formats', () => {
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesCreate.parse({
				project_id: 1,
				day: '06/11/2026',
			}),
		).toThrow(/YYYY-MM-DD/);
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesCreate.parse({
				project_id: 1,
				day: '2026-11-06',
				from: '9am',
			}),
		).toThrow(/HH:MM/);
	});

	it('caps per_page and limit at 100', () => {
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesList.parse({ per_page: 101 }),
		).toThrow();
		expect(() =>
			TimelyEndpointInputSchemas.clientsList.parse({ limit: 101 }),
		).toThrow();
	});

	it('requires a change on updates', () => {
		expect(() =>
			TimelyEndpointInputSchemas.projectsUpdate.parse({ id: 1 }),
		).toThrow(/at least one field/);
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesUpdate.parse({ id: 1 }),
		).toThrow(/at least one field/);
	});

	it('limits bulk requests to 1–100 records', () => {
		expect(() => TimelyEndpointInputSchemas.timeEntriesBulk.parse({})).toThrow(
			/at least one/,
		);
		expect(() =>
			TimelyEndpointInputSchemas.timeEntriesBulk.parse({
				delete: Array.from({ length: 101 }, (_, i) => i + 1),
			}),
		).toThrow(/at most 100/);
	});

	it('requires projects to name a client and rate type (Timely 422s without a client)', () => {
		expect(() =>
			TimelyEndpointInputSchemas.projectsCreate.parse({ name: 'X' }),
		).toThrow();
	});

	it('requires an https URL and a signing secret for webhooks', () => {
		expect(() =>
			TimelyEndpointInputSchemas.webhooksCreate.parse({
				url: 'http://example.com',
				subscriptions: ['hours:created'],
				secret_token: 'super-secret-signing-token',
			}),
		).toThrow(/https/);
		expect(() =>
			TimelyEndpointInputSchemas.webhooksCreate.parse({
				url: 'https://example.com',
				subscriptions: ['hours:created'],
			}),
		).toThrow();
		expect(() =>
			TimelyEndpointInputSchemas.webhooksCreate.parse({
				url: 'https://example.com',
				subscriptions: ['hours:archived'],
				secret_token: 'super-secret-signing-token',
			}),
		).toThrow();
	});

	it('sends numeric strings as numbers', () => {
		expect(
			TimelyEndpointInputSchemas.timeEntriesCreate.parse({
				project_id: '21',
				day: '2026-11-06',
			}).project_id,
		).toBe(21);
	});
});

describe('outputs', () => {
	it('redacts the webhook signing secret in results', async () => {
		respondWith({ body: [webhook] });
		const [hook] = await Webhooks.list(makeCtx(), {});
		expect(hook!.secret_token).toBe('[redacted]');
		expect(JSON.stringify(hook)).not.toContain('super-secret-signing-token');
	});

	it('redactSecrets leaves null secrets and other fields alone', () => {
		expect(
			redactSecrets({
				secret_token: null,
				nested: [{ secret_token: 's' }],
				a: 1,
			}),
		).toEqual({
			secret_token: null,
			nested: [{ secret_token: '[redacted]' }],
			a: 1,
		});
	});

	it('accepts values Timely may add later (no closed output enums)', () => {
		expect(() =>
			TimelyEndpointOutputSchemas.timeEntriesGet.parse({
				...entry,
				timer_state: 'paused',
				brand_new_field: { x: 1 },
			}),
		).not.toThrow();
		expect(() =>
			TimelyEndpointOutputSchemas.projectsGet.parse({
				...project,
				rate_type: 'flat-fee',
			}),
		).not.toThrow();
	});

	it('reports.filter accepts both the totals object and the events list', () => {
		expect(() =>
			TimelyEndpointOutputSchemas.reportsFilter.parse({
				totals: {},
				users: [],
			}),
		).not.toThrow();
		expect(() =>
			TimelyEndpointOutputSchemas.reportsFilter.parse([entry]),
		).not.toThrow();
	});
});

describe('auth', () => {
	const plugin = timely();

	it('is OAuth 2.0 only, with Timely’s documented authorize and token URLs', () => {
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(timelyAuthConfig)).toEqual(['oauth_2']);
		expect(timelyAuthConfig.oauth_2.account).toEqual(['account_id']);
		expect(plugin.oauthConfig).toEqual({
			providerName: 'Timely',
			authUrl: 'https://api.timelyapp.com/1.1/oauth/authorize',
			tokenUrl: 'https://api.timelyapp.com/1.1/oauth/token',
			scopes: ['manage'],
		});
	});

	// Necessity: keyBuilder is optional on the plugin type and its context type
	// depends on each factory call's options; tests call it with one shared shape.
	function buildKey(
		p: { keyBuilder?: unknown },
		ctx: TimelyKeyBuilderContext,
		source: 'endpoint' | 'webhook',
	): Promise<string> {
		const fn = p.keyBuilder as (
			c: TimelyKeyBuilderContext,
			s: 'endpoint' | 'webhook',
		) => Promise<string>;
		return fn(ctx, source);
	}

	type Keys = {
		access?: string | null;
		refresh?: string | null;
		clientSecret?: string | null;
		webhook?: string | null;
	};

	function keyCtx(keys: Keys, hub: unknown = null) {
		const stored = { ...keys };
		const ctx = {
			authType: 'oauth_2',
			tenantId: 'default',
			hub,
			keys: {
				get_access_token: async () => stored.access ?? null,
				get_refresh_token: async () => stored.refresh ?? null,
				get_expires_at: async () => null,
				get_webhook_signature: async () => stored.webhook ?? null,
				get_integration_credentials: async () => ({
					client_id: 'cid',
					client_secret: stored.clientSecret ?? null,
				}),
				set_access_token: async (v: string) => {
					stored.access = v;
				},
				set_refresh_token: async (v: string) => {
					stored.refresh = v;
				},
				set_expires_at: async () => undefined,
				set_scope: async () => undefined,
			},
		};
		// Necessity: keyBuilder takes the full key-builder context; tests supply the key accessors it reads.
		return { ctx: ctx as unknown as TimelyKeyBuilderContext, stored };
	}

	it('returns the stored access token (Timely tokens do not expire)', async () => {
		const { ctx } = keyCtx({ access: 'tok', clientSecret: 'sec' });
		await expect(buildKey(plugin, ctx, 'endpoint')).resolves.toBe('tok');
		expect(calls).toHaveLength(0);
	});

	it('still works with only a stored token (no client secret, no hub)', async () => {
		const { ctx } = keyCtx({ access: 'tok' });
		await expect(buildKey(plugin, ctx, 'endpoint')).resolves.toBe('tok');
	});

	it('raises AuthMissingError when nothing is stored', async () => {
		const { ctx } = keyCtx({});
		await expect(buildKey(plugin, ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		const withSecret = keyCtx({ clientSecret: 'sec' });
		await expect(
			buildKey(plugin, withSecret.ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refreshes against Timely’s token URL and stores the rotated refresh token', async () => {
		respondWith({
			body: {
				access_token: 'new-tok',
				refresh_token: 'new-refresh',
				token_type: 'Bearer',
				scope: 'manage',
				created_at: 1,
			},
		});
		const { ctx, stored } = keyCtx({
			refresh: 'old-refresh',
			clientSecret: 'sec',
		});
		await expect(buildKey(plugin, ctx, 'endpoint')).resolves.toBe('new-tok');
		expect(calls[0]!.url.toString()).toBe(
			'https://api.timelyapp.com/1.1/oauth/token',
		);
		expect(stored.refresh).toBe('new-refresh');
	});

	it('uses timely({ key }) when given', async () => {
		const { ctx } = keyCtx({});
		await expect(
			buildKey(timely({ key: 'direct' }), ctx, 'endpoint'),
		).resolves.toBe('direct');
	});

	it('webhook secret: option first, then stored webhook_signature, else empty (fail closed)', async () => {
		const { ctx } = keyCtx({ webhook: 'stored-secret' });
		await expect(
			buildKey(timely({ webhookSecret: 'opt-secret' }), ctx, 'webhook'),
		).resolves.toBe('opt-secret');
		await expect(buildKey(plugin, ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
		await expect(buildKey(plugin, keyCtx({}).ctx, 'webhook')).resolves.toBe('');
	});
});

describe('webhooks', () => {
	const SECRET = 'test-webhook-secret-0123456789';
	// Byte-for-byte the shape of a live hours:created delivery (2026-11-07).
	const rawBody =
		'{"event":"hours:created","payload":{"entity_id":299530752,"entity_type":"Hour","entity_path":"/hours/299530752","updated_from":"Corsair Plugin Test","updated_at":"2026-11-07T01:01:12+05:30","status":"logged","date":"2026-11-06","entity_external_id":null}}';
	const rawPayload = rawBody.slice(rawBody.indexOf('{', 1), -1);
	const signature = createHmac('sha256', SECRET)
		.update(rawPayload)
		.digest('hex');
	const headers = {
		'content-type': 'application/json',
		'x-signature': signature,
	};

	function request(body = rawBody, hdrs: Record<string, string> = headers) {
		return { payload: JSON.parse(body), headers: hdrs, rawBody: body };
	}

	function webhookCtx(key: string) {
		// Necessity: handlers take the full plugin context; tests supply key + logging hooks.
		return {
			key,
			$getAccountId: async () => 'account-row',
			database: undefined,
		} as unknown as TimelyContext;
	}

	it('signs the payload object, not the whole body', () => {
		expect(extractRawPayload(rawBody)).toBe(rawPayload);
	});

	it('accepts a correctly signed delivery', () => {
		expect(verifyTimelyWebhookSignature(request(), SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts a delivery that only has parsed JSON (no raw body)', () => {
		expect(
			verifyTimelyWebhookSignature(
				{ payload: JSON.parse(rawBody), headers },
				SECRET,
			).valid,
		).toBe(true);
	});

	it('rejects tampered payloads, wrong secrets, missing headers and missing secrets', () => {
		const tampered = rawBody.replace('299530752,', '1,');
		expect(verifyTimelyWebhookSignature(request(tampered), SECRET)).toEqual({
			valid: false,
			error: 'Signature mismatch',
		});
		expect(verifyTimelyWebhookSignature(request(), 'other-secret').valid).toBe(
			false,
		);
		expect(
			verifyTimelyWebhookSignature(
				request(rawBody, { 'content-type': 'application/json' }),
				SECRET,
			).error,
		).toMatch(/X-Signature/);
		expect(verifyTimelyWebhookSignature(request(), '').error).toMatch(
			/Missing Timely webhook secret/,
		);
	});

	it('verifies only the top-level payload, never a nested or duplicate one', () => {
		const evil =
			'{"entity_id":1,"entity_type":"Hour","entity_path":"/hours/1","status":"deleted"}';
		// The genuinely signed payload hidden in an earlier nested object.
		const nested = `{"event":"hours:created","x":{"payload":${rawPayload}},"payload":${evil}}`;
		expect(extractRawPayload(nested)).toBe(evil);
		expect(verifyTimelyWebhookSignature(request(nested), SECRET)).toEqual({
			valid: false,
			error: 'Signature mismatch',
		});
		// Two top-level payload keys: JSON.parse keeps the last, so refuse both.
		const duplicate = `{"event":"hours:created","payload":${rawPayload},"payload":${evil}}`;
		expect(extractRawPayload(duplicate)).toBeUndefined();
		expect(verifyTimelyWebhookSignature(request(duplicate), SECRET).valid).toBe(
			false,
		);
	});

	it('finds the payload when other values hold braces, quotes or a "payload" string', () => {
		const tricky = `{"note":"a } \\" { \\"payload\\": {}","list":[{"payload":{"x":1}}],"payload":${rawPayload}}`;
		expect(extractRawPayload(tricky)).toBe(rawPayload);
		expect(verifyTimelyWebhookSignature(request(tricky), SECRET).valid).toBe(
			true,
		);
	});

	it('trusts hub-verified deliveries', () => {
		expect(
			verifyTimelyWebhookSignature(
				{ ...request(rawBody, {}), hubVerified: true },
				'',
			).valid,
		).toBe(true);
	});

	it('matches Timely bodies at plugin level and each event to its handler', () => {
		const plugin = timely();
		const raw = { headers, body: rawBody };
		expect(plugin.pluginWebhookMatcher?.(raw)).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers,
				body: { type: 'issue.created' },
			}),
		).toBe(false);
		expect(
			isTimelyWebhookBody({
				event: 'hours:archived',
				payload: { entity_type: 'Hour' },
			}),
		).toBe(false);
		expect(TimelyWebhookHandlers.timeEntries.created.match(raw)).toBe(true);
		expect(TimelyWebhookHandlers.timeEntries.updated.match(raw)).toBe(false);
		const labelBody = rawBody.replace('hours:created', 'labels:deleted');
		expect(
			TimelyWebhookHandlers.tags.deleted.match({ headers, body: labelBody }),
		).toBe(true);
		const taskBody = rawBody.replace('hours:created', 'forecasts:updated');
		expect(
			TimelyWebhookHandlers.tasks.updated.match({ headers, body: taskBody }),
		).toBe(true);
	});

	it('handler returns the payload when signed and 401 otherwise', async () => {
		const ok = await TimelyWebhookHandlers.timeEntries.created.handler(
			webhookCtx(SECRET),
			request(),
		);
		expect(ok).toMatchObject({
			success: true,
			data: { event: 'hours:created', payload: { entity_id: 299530752 } },
		});
		const bad = await TimelyWebhookHandlers.timeEntries.created.handler(
			webhookCtx('wrong'),
			request(),
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
	});
});

describe('plugin metadata', () => {
	const plugin = timely();

	it('has schemas and meta for every endpoint', () => {
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
		expect(metaKeys).toEqual(Object.keys(timelyEndpointSchemas).sort());
		expect(metaKeys).toHaveLength(36);
	});

	it('marks every delete and bulk import destructive and irreversible', () => {
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		for (const op of [
			'projects.delete',
			'timeEntries.delete',
			'timeEntries.bulk',
			'tags.delete',
			'webhooks.delete',
		]) {
			expect(meta[op]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
		const reads = Object.entries(meta).filter(([k]) =>
			/\.(list|get|current|totals|filter)$/.test(k),
		);
		for (const [, m] of reads) expect(m.riskLevel).toBe('read');
	});
});
