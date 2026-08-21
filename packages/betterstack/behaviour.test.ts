/**
 * Asserts request bodies: `undefined` omitted, notification defaults fail
 * safe, mirroring into the right store, and eviction on delete.
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

/**
 * Every operation that answers with the paginated list envelope, and so must
 * accept the page controls that make anything past page one reachable.
 */
function isListOperation(op: { handler: string; group: string }) {
	return (
		op.handler === 'list' ||
		op.handler === 'monitors' ||
		op.handler === 'events' ||
		op.handler === 'statusPages' ||
		op.handler === 'timeline' ||
		op.handler === 'relations' ||
		op.group === 'integrations'
	);
}

/** Picks the envelope an operation is expected to return. */
function envelopeFor(op: {
	handler: string;
	group: string;
	method: string | null;
}) {
	if (op.method === 'DELETE') return {};
	return isListOperation(op) ? LIST : SINGLE;
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

import { compactBody, compactQuery } from './client';

/**
 * Creates only. A create decides the record's starting state, so defaulting an
 * unnamed channel to false is a safe choice; a PATCH does not, and the same
 * default there would silently disable a live alert. See PARTIAL_UPDATE_CASES.
 */
const FAIL_SAFE_CASES: ReadonlyArray<readonly [string, readonly string[]]> = [
	['monitors.create', ['email', 'sms', 'call', 'push', 'critical_alert']],
	['heartbeats.create', ['email', 'sms', 'call', 'push', 'critical_alert']],
	['incidents.create', ['call', 'sms', 'email', 'push', 'critical_alert']],
	['statusPageReports.create', ['notify_subscribers']],
	['statusUpdates.create', ['notify_subscribers']],
];

/** The PATCH counterparts, which must leave an unnamed channel untouched. */
const PARTIAL_UPDATE_CASES: ReadonlyArray<
	readonly [string, readonly string[]]
> = [
	['monitors.update', ['email', 'sms', 'call', 'push', 'critical_alert']],
	['heartbeats.update', ['email', 'sms', 'call', 'push', 'critical_alert']],
	['statusUpdates.update', ['notify_subscribers']],
];

describe('request building', () => {
	it('drops undefined but keeps an explicit false', () => {
		expect(compactBody({ a: undefined, b: false, c: 0, d: '' })).toEqual({
			b: false,
			c: 0,
			d: '',
		});
	});

	it('returns undefined rather than an empty body', () => {
		expect(compactBody({ a: undefined })).toBeUndefined();
		expect(compactBody(undefined)).toBeUndefined();
		expect(compactQuery({ a: undefined })).toBeUndefined();
	});

	it('omits unsupplied optional fields from the wire body', async () => {
		const { ctx } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('monitorGroups.create')(ctx, { name: 'group' });
		const req = requested();

		expect(req.body).toEqual({ name: 'group' });
		expect(Object.keys(req.body)).not.toContain('team_name');
		expect(Object.keys(req.body)).not.toContain('sort_index');
	});
});

describe('fail-safe notification defaults', () => {
	it('has a case for every create that can page a human', () => {
		expect(FAIL_SAFE_CASES.length).toBe(5);
	});

	it.each(FAIL_SAFE_CASES)(
		'%s defaults every notification channel to false',
		async (key, fields) => {
			const { ctx } = makeCtx();
			mockResponse(SINGLE);

			const op = OPERATION_TABLE.find((row) => row.key === key);
			if (!op) throw new Error(`no operation row for ${key}`);

			await handlerFor(key)(ctx, inputFor(op));
			const req = requested();

			expect(fields.length).toBeGreaterThan(0);
			for (const field of fields) {
				expect(req.body?.[field]).toBe(false);
			}
		},
	);

	it('still honours an explicit true', async () => {
		const { ctx } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('monitors.create')(ctx, {
			url: 'https://example.com',
			email: true,
		});
		expect(requested().body?.email).toBe(true);
	});

	it('creating a monitor without naming email does not inherit the provider default', async () => {
		// Better Stack defaults monitor.email to true, so omission would
		// silently subscribe the team to alert mail.
		const { ctx } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('monitors.create')(ctx, { url: 'https://example.com' });
		expect(requested().body?.email).toBe(false);
	});
});

describe('partial updates preserve notification settings', () => {
	it('has a case for every update that can page a human', () => {
		expect(PARTIAL_UPDATE_CASES.length).toBe(3);
	});

	it.each(PARTIAL_UPDATE_CASES)(
		'%s omits every notification channel the caller did not name',
		async (key, fields) => {
			const { ctx } = makeCtx();
			mockResponse(SINGLE);

			const op = OPERATION_TABLE.find((row) => row.key === key);
			if (!op) throw new Error(`no operation row for ${key}`);

			await handlerFor(key)(ctx, inputFor(op));
			const body = requested().body ?? {};

			expect(fields.length).toBeGreaterThan(0);
			for (const field of fields) {
				expect(Object.keys(body)).not.toContain(field);
			}
		},
	);

	it.each(PARTIAL_UPDATE_CASES)(
		'%s still sends a channel the caller set explicitly',
		async (key, fields) => {
			const { ctx } = makeCtx();
			mockResponse(SINGLE);

			const op = OPERATION_TABLE.find((row) => row.key === key);
			if (!op) throw new Error(`no operation row for ${key}`);

			const field = fields[0];
			if (!field) throw new Error(`no fields for ${key}`);

			await handlerFor(key)(ctx, { ...inputFor(op), [field]: false });
			expect(requested().body?.[field]).toBe(false);
		},
	);

	it('editing a monitor url leaves its alerting alone', async () => {
		// The regression this guards: a caller renaming a monitor would otherwise
		// PATCH email/sms/call/push/critical_alert to false and mute a live alert.
		const { ctx } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('monitors.update')(ctx, {
			monitor_id: 1234567,
			url: 'https://example.com/new',
		});

		expect(requested().body).toEqual({ url: 'https://example.com/new' });
	});
});

describe('pagination', () => {
	const collections = OPERATION_TABLE.filter(
		(op) => op.api !== 'local' && isListOperation(op),
	);

	it('covers every operation returning the list envelope', () => {
		expect(collections.length).toBe(37);
	});

	it.each(collections.map((op) => [op.key, op] as const))(
		'%s forwards page and per_page',
		async (key, op) => {
			const { ctx } = makeCtx();
			mockResponse(LIST);

			await handlerFor(key)(ctx, { ...inputFor(op), page: 3, per_page: 25 });
			const params = new URL(requested().url).searchParams;

			expect(params.get('page')).toBe('3');
			expect(params.get('per_page')).toBe('25');
		},
	);

	it.each(collections.map((op) => [op.key, op] as const))(
		'%s sends no page controls when the caller does not paginate',
		async (key, op) => {
			const { ctx } = makeCtx();
			mockResponse(LIST);

			await handlerFor(key)(ctx, inputFor(op));
			const params = new URL(requested().url).searchParams;

			expect(params.has('page')).toBe(false);
			expect(params.has('per_page')).toBe(false);
		},
	);

	it('keeps a list filter alongside the page controls', async () => {
		const { ctx } = makeCtx();
		mockResponse(LIST);

		await handlerFor('monitors.list')(ctx, {
			url: 'https://example.com',
			page: 2,
		});
		const params = new URL(requested().url).searchParams;

		expect(params.get('url')).toBe('https://example.com');
		expect(params.get('page')).toBe('2');
	});
});

describe('local mirroring', () => {
	const mirrored = [
		['monitors', 'monitors'],
		['monitorGroups', 'monitorGroups'],
		['heartbeats', 'heartbeats'],
		['heartbeatGroups', 'heartbeatGroups'],
		['policies', 'policies'],
		['urgencies', 'urgencies'],
		['statusPages', 'statusPages'],
		['onCalls', 'onCallSchedules'],
	] as const;

	it('mirrors a fetched resource into its own store', async () => {
		expect(mirrored.length).toBe(8);
		for (const [group, store] of mirrored) {
			const { ctx, db } = makeCtx();
			mockResponse(SINGLE);
			const op = OPERATION_TABLE.find(
				(row) => row.group === group && row.handler === 'get',
			);
			if (!op) throw new Error(`no get operation for ${group}`);

			await handlerFor(op.key)(ctx, inputFor(op));
			expect(storeOf(db, store).upsertByEntityId).toHaveBeenCalledWith(
				'1234567',
				expect.objectContaining({ id: '1234567' }),
			);
		}
	});

	it('mirrors every row of a list response', async () => {
		const { ctx, db } = makeCtx();
		mockResponse({
			data: [
				{ id: '1', type: 'monitor', attributes: { pronounceable_name: 'a' } },
				{ id: '2', type: 'monitor', attributes: { pronounceable_name: 'b' } },
			],
		});

		await handlerFor('monitors.list')(ctx, {});
		expect(storeOf(db, 'monitors').upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('evicts on delete', async () => {
		for (const [group, store] of mirrored) {
			const op = OPERATION_TABLE.find(
				(row) => row.group === group && row.handler === 'remove',
			);
			if (!op) continue;
			const { ctx, db } = makeCtx();
			mockResponse({}, 204);

			await handlerFor(op.key)(ctx, inputFor(op));
			expect(storeOf(db, store).deleteByEntityId).toHaveBeenCalled();
		}
	});

	it('does not evict on a read', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('monitors.get')(ctx, { monitor_id: 1234567 });
		expect(storeOf(db, 'monitors').deleteByEntityId).not.toHaveBeenCalled();
	});

	it('survives a cache write that throws', async () => {
		const { ctx, db } = makeCtx();
		storeOf(db, 'monitors').upsertByEntityId.mockRejectedValueOnce(
			new Error('disk full'),
		);
		mockResponse(SINGLE);

		await expect(
			handlerFor('monitors.get')(ctx, { monitor_id: 1234567 }),
		).resolves.toBeDefined();
	});

	it('never mirrors a transactional entity', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(SINGLE);

		await handlerFor('incidents.get')(ctx, { incident_id: 1234571 });
		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});
});
