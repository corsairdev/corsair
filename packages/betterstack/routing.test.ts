/**
 * Asserts every operation against a mocked transport: base URL, auth header,
 * HTTP method, that the credential never reaches the query string, and that no
 * "undefined" is interpolated into a path.
 */
import {
	Catalog,
	HeartbeatGroups,
	Heartbeats,
	IncidentComments,
	Incidents,
	Integrations,
	Metadata,
	MonitorGroups,
	Monitors,
	OnCalls,
	OutgoingWebhooks,
	Policies,
	PolicyGroups,
	SourceGroups,
	StatusPageGroups,
	StatusPageReports,
	StatusPageResources,
	StatusPageSections,
	StatusPages,
	StatusUpdates,
	Token,
	Urgencies,
	UrgencyGroups,
} from './endpoints';
import { OPERATION_TABLE } from './operation-table-fixture';

/** Fictional token; never a real credential. */
const TEST_TOKEN = 'test-token-not-a-real-credential';

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

const MIRRORED_STORES = [
	'monitors',
	'monitorGroups',
	'heartbeats',
	'heartbeatGroups',
	'policies',
	'urgencies',
	'statusPages',
	'onCallSchedules',
] as const;

function makeCtx() {
	const db: Record<string, Store> = {};
	for (const name of MIRRORED_STORES) db[name] = makeStore();
	const ctx = {
		key: TEST_TOKEN,
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as never;
	return { ctx, db };
}

/** Looks a spying store up by name, failing loudly if the fixture lacks it. */
function storeOf(db: Record<string, Store>, name: string): Store {
	const store = db[name];
	if (!store) throw new Error(`no fixture store named ${name}`);
	return store;
}

let lastCall: { url: string; init: RequestInit } | undefined;

function mockResponse(body: unknown, status = 200) {
	global.fetch = (async (url: string, init: RequestInit) => {
		lastCall = { url, init };
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

function requested() {
	if (!lastCall) throw new Error('no request was made');
	return {
		url: lastCall.url,
		method: lastCall.init.method,
		headers: lastCall.init.headers as Record<string, string>,
		body: lastCall.init.body
			? JSON.parse(String(lastCall.init.body))
			: undefined,
	};
}

/** A single resource envelope, shaped as Better Stack returns it. */
const RESOURCE = {
	id: '1234567',
	type: 'monitor',
	attributes: { name: 'fixture' },
};
const SINGLE = { data: RESOURCE };
const LIST = {
	data: [RESOURCE],
	pagination: { first: null, last: null, prev: null, next: null },
};

/** Picks the envelope an operation is expected to return. */
function envelopeFor(op: {
	handler: string;
	group: string;
	method: string | null;
}) {
	if (op.method === 'DELETE') return {};
	const listy =
		op.handler === 'list' ||
		op.handler === 'monitors' ||
		op.handler === 'events' ||
		op.handler === 'statusPages' ||
		op.handler === 'timeline' ||
		op.handler === 'relations' ||
		op.group === 'integrations';
	return listy ? LIST : SINGLE;
}

const registry: Record<string, Record<string, unknown>> = {
	monitors: Monitors as unknown as Record<string, unknown>,
	monitorGroups: MonitorGroups as unknown as Record<string, unknown>,
	heartbeats: Heartbeats as unknown as Record<string, unknown>,
	heartbeatGroups: HeartbeatGroups as unknown as Record<string, unknown>,
	incidents: Incidents as unknown as Record<string, unknown>,
	incidentComments: IncidentComments as unknown as Record<string, unknown>,
	policies: Policies as unknown as Record<string, unknown>,
	policyGroups: PolicyGroups as unknown as Record<string, unknown>,
	onCalls: OnCalls as unknown as Record<string, unknown>,
	urgencies: Urgencies as unknown as Record<string, unknown>,
	urgencyGroups: UrgencyGroups as unknown as Record<string, unknown>,
	statusPages: StatusPages as unknown as Record<string, unknown>,
	statusPageSections: StatusPageSections as unknown as Record<string, unknown>,
	statusPageResources: StatusPageResources as unknown as Record<
		string,
		unknown
	>,
	statusPageReports: StatusPageReports as unknown as Record<string, unknown>,
	statusUpdates: StatusUpdates as unknown as Record<string, unknown>,
	statusPageGroups: StatusPageGroups as unknown as Record<string, unknown>,
	metadata: Metadata as unknown as Record<string, unknown>,
	outgoingWebhooks: OutgoingWebhooks as unknown as Record<string, unknown>,
	sourceGroups: SourceGroups as unknown as Record<string, unknown>,
	integrations: Integrations as unknown as Record<string, unknown>,
	catalog: Catalog as unknown as Record<string, unknown>,
	token: Token as unknown as Record<string, unknown>,
};

/** Resolves a registry key like `monitors.create` to its handler function. */
function handlerFor(key: string) {
	const [group, name] = key.split('.');
	if (!group || !name) throw new Error(`malformed registry key: ${key}`);
	const fn = registry[group]?.[name];
	if (typeof fn !== 'function') throw new Error(`no handler for ${key}`);
	return fn as (ctx: unknown, input: unknown) => Promise<unknown>;
}

const originalFetch = global.fetch;
afterAll(() => {
	global.fetch = originalFetch;
});
beforeEach(() => {
	lastCall = undefined;
});

/** Fictional values only - no real ids, e-mails or phone numbers. */
const FIXTURE: Record<string, string | number> = {
	monitor_id: 1234567,
	monitor_group_id: 1234568,
	heartbeat_id: 1234569,
	heartbeat_group_id: 1234570,
	incident_id: 1234571,
	comment_id: 1234572,
	policy_id: 1234573,
	policy_group_id: 1234574,
	schedule_id: 1234575,
	urgency_id: 1234576,
	urgency_group_id: 1234577,
	status_page_id: 1234578,
	status_page_group_id: 1234579,
	section_id: 1234580,
	resource_id: 1234581,
	status_report_id: 1234582,
	status_update_id: 1234583,
	source_group_id: 1234584,
	outgoing_webhook_id: 1234585,
};

function inputFor(op: {
	pathParams: readonly string[];
}): Record<string, unknown> {
	const input: Record<string, unknown> = {};
	for (const name of op.pathParams) {
		input[name] = FIXTURE[name] ?? 42;
	}
	return input;
}

const UPTIME = 'https://uptime.betterstack.com';
const TELEMETRY = 'https://telemetry.betterstack.com';

const remote = OPERATION_TABLE.filter((op) => op.api !== 'local');

describe('routing', () => {
	it('covers every registered operation', () => {
		expect(OPERATION_TABLE.length).toBe(117);
		expect(remote.length).toBe(116);
	});

	it.each(remote.map((op) => [op.key, op] as const))(
		'%s routes to the documented endpoint',
		async (_key, op) => {
			const { ctx } = makeCtx();
			mockResponse(envelopeFor(op));

			await handlerFor(op.key)(ctx, inputFor(op));
			const req = requested();

			const base = op.api === 'telemetry' ? TELEMETRY : UPTIME;
			expect(new URL(req.url).origin).toBe(base);
			expect(req.method).toBe(op.method);
		},
	);

	it.each(remote.map((op) => [op.key, op] as const))(
		'%s sends the token as a bearer header and never in the query',
		async (_key, op) => {
			const { ctx } = makeCtx();
			mockResponse(envelopeFor(op));

			await handlerFor(op.key)(ctx, inputFor(op));
			const req = requested();

			const auth = new Headers(req.headers).get('authorization');
			expect(auth).toBe(`Bearer ${TEST_TOKEN}`);
			expect(req.url).not.toContain(TEST_TOKEN);
			expect(req.url.split('?')[1] ?? '').not.toContain('token');
		},
	);

	it.each(remote.map((op) => [op.key, op] as const))(
		'%s interpolates every path parameter',
		async (_key, op) => {
			const { ctx } = makeCtx();
			mockResponse(envelopeFor(op));

			await handlerFor(op.key)(ctx, inputFor(op));
			const req = requested();

			expect(req.url).not.toContain('undefined');
			expect(req.url).not.toContain('{');
			expect(req.url).not.toContain('null');
		},
	);

	it.each(
		remote
			.filter((op) => op.pathParams.length > 0)
			.map((op) => [op.key, op] as const),
	)(
		'%s refuses a missing path parameter instead of building a bad URL',
		async (_key, op) => {
			const { ctx } = makeCtx();
			mockResponse(envelopeFor(op));

			await expect(handlerFor(op.key)(ctx, {})).rejects.toThrow(
				/missing path parameter/,
			);
		},
	);

	it('reads use GET and destructive operations use DELETE', () => {
		const reads = OPERATION_TABLE.filter(
			(op) => op.tier === 'read' && op.api !== 'local',
		);
		const destructive = OPERATION_TABLE.filter(
			(op) => op.tier === 'destructive',
		);
		expect(reads.length).toBeGreaterThan(0);
		expect(destructive.length).toBeGreaterThan(0);
		for (const op of reads) expect(op.method).toBe('GET');
		for (const op of destructive) expect(op.method).toBe('DELETE');
	});

	it('routes the three source-group operations at the telemetry host', () => {
		const telemetry = OPERATION_TABLE.filter((op) => op.api === 'telemetry');
		expect(telemetry.map((op) => op.key).sort()).toEqual([
			'sourceGroups.create',
			'sourceGroups.remove',
			'sourceGroups.update',
		]);
	});

	it('uses v3 for incidents, metadata and escalation policies', () => {
		const v3 = OPERATION_TABLE.filter((op) => op.path?.startsWith('/api/v3'));
		const groups = [...new Set(v3.map((op) => op.group))].sort();
		expect(groups).toEqual(['incidents', 'metadata', 'policies']);
	});

	it('keeps incident comments on v2 even though the incident is v3', () => {
		const comments = OPERATION_TABLE.filter(
			(op) => op.group === 'incidentComments',
		);
		expect(comments.length).toBe(5);
		for (const op of comments)
			expect(op.path).toMatch(/^\/api\/v2\/incidents\//);
	});
});
