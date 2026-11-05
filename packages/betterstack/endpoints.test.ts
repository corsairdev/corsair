/**
 * Registry invariants: coverage, risk levels, the non-idempotent set, error
 * handler ordering and audit-payload redaction.
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

import { auditPayload } from './endpoints/logging';
import { errorHandlers, formatBetterstackError } from './error-handlers';
import {
	BETTERSTACK_NON_IDEMPOTENT_OPERATIONS,
	betterstack,
	betterstackAuthConfig,
	betterstackEndpointSchemas,
} from './index';

describe('registry coverage', () => {
	it('registers exactly the catalogued operations', () => {
		expect(OPERATION_TABLE.length).toBe(117);
		expect(Object.keys(betterstackEndpointSchemas).length).toBe(117);
	});

	it('exercised equals registered', () => {
		const registered = new Set<string>(Object.keys(betterstackEndpointSchemas));
		const tabled = new Set<string>(OPERATION_TABLE.map((op) => op.key));
		expect(registered.size).toBeGreaterThan(0);
		expect([...tabled].filter((k) => !registered.has(k))).toEqual([]);
		expect([...registered].filter((k) => !tabled.has(k))).toEqual([]);
	});

	it('resolves a handler function for every operation', () => {
		expect(OPERATION_TABLE.length).toBeGreaterThan(0);
		for (const op of OPERATION_TABLE) {
			expect(typeof handlerFor(op.key)).toBe('function');
		}
	});

	it('declares a risk level and description for every operation', () => {
		const plugin = betterstack();
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string; description: string }
		>;
		expect(Object.keys(meta).length).toBe(117);
		for (const op of OPERATION_TABLE) {
			const entry = meta[op.key];
			expect(entry).toBeDefined();
			expect(entry?.riskLevel).toBe(op.tier);
			expect((entry?.description ?? '').length).toBeGreaterThan(3);
		}
	});

	it('has no duplicate slugs or registry keys', () => {
		const slugs = OPERATION_TABLE.map((op) => op.slug);
		const keys = OPERATION_TABLE.map((op) => op.key);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(new Set(keys).size).toBe(keys.length);
	});
});

describe('non-idempotent operations', () => {
	it('is exactly the set of POST operations', () => {
		const expected = OPERATION_TABLE.filter((op) => op.method === 'POST')
			.map((op) => op.key)
			.sort();
		expect(expected.length).toBeGreaterThan(0);
		expect([...BETTERSTACK_NON_IDEMPOTENT_OPERATIONS].sort()).toEqual(expected);
	});

	it('contains no read operation', () => {
		const reads = new Set<string>(
			OPERATION_TABLE.filter((op) => op.tier === 'read').map((op) => op.key),
		);
		expect(BETTERSTACK_NON_IDEMPOTENT_OPERATIONS.length).toBeGreaterThan(0);
		for (const key of BETTERSTACK_NON_IDEMPOTENT_OPERATIONS) {
			expect(reads.has(key)).toBe(false);
		}
	});
});

describe('auth', () => {
	it('declares a single api_key and no second credential', () => {
		expect(betterstackAuthConfig).toEqual({ api_key: {} });
	});

	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = betterstack();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
	});

	it('prefers an explicitly supplied key', async () => {
		const plugin = betterstack({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'from-store' },
		} as never;
		await expect(keyBuilder?.(ctx, 'endpoint')).resolves.toBe('explicit-key');
	});
});

describe('error handlers', () => {
	it('orders specific handlers before DEFAULT', () => {
		const names = Object.keys(errorHandlers);
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('PLAN_OR_PERMISSION_ERROR');
		expect(names).toContain('VALIDATION_ERROR');
		expect(names).toContain('NOT_FOUND_ERROR');
	});

	it('does not retry a 403, which is plan gating rather than a transient fault', async () => {
		const result = await errorHandlers.PLAN_OR_PERMISSION_ERROR.handler(
			new Error('Please upgrade your account'),
			{ operation: 'statusPages.update' } as never,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a validation failure', async () => {
		const result = await errorHandlers.VALIDATION_ERROR.handler(
			new Error('unprocessable'),
			{ operation: 'monitors.create' } as never,
		);
		expect(result.maxRetries).toBe(0);
	});
});

describe('error body formatting', () => {
	// Every case below is a body captured live on 2026-08-16.
	it('handles the string form', () => {
		expect(
			formatBetterstackError({
				errors: 'Resource type monitor with id = 999999999 was not found',
			}),
		).toBe('Resource type monitor with id = 999999999 was not found');
	});

	it('handles the field-map form without yielding [object Object]', () => {
		const message = formatBetterstackError({
			errors: { url: ["can't be blank"] },
		});
		expect(message).toBe("url: can't be blank");
		expect(message).not.toContain('[object Object]');
	});

	it('folds in required_attributes', () => {
		expect(
			formatBetterstackError({
				errors: 'Sorry, you are missing some required attributes',
				required_attributes: ['step_members'],
			}),
		).toBe(
			'Sorry, you are missing some required attributes (required attributes: step_members)',
		);
	});

	it('folds in invalid_attributes', () => {
		expect(
			formatBetterstackError({
				errors: 'Sorry, you misspelled some attributes',
				invalid_attributes: ['on_incident_started', 'on_incident_resolved'],
			}),
		).toContain('on_incident_started, on_incident_resolved');
	});

	it('handles a nested field key', () => {
		expect(
			formatBetterstackError({
				errors: { 'status_updates.message': ["can't be blank"] },
			}),
		).toBe("status_updates.message: can't be blank");
	});

	it('returns undefined for a body it cannot read', () => {
		expect(formatBetterstackError(undefined)).toBeUndefined();
		expect(formatBetterstackError('plain text')).toBeUndefined();
		expect(formatBetterstackError({})).toBeUndefined();
	});
});

describe('audit payloads', () => {
	it('records named identifiers and field names, never values', () => {
		const payload = auditPayload(
			{
				incident_id: 1234571,
				summary: 'Database is down and here is a customer name',
				requester_email: 'someone@example.com',
			},
			['incident_id'],
		);

		expect(payload.incident_id).toBe(1234571);
		expect(payload.fields).toEqual([
			'incident_id',
			'summary',
			'requester_email',
		]);
		expect(JSON.stringify(payload)).not.toContain('Database is down');
		expect(JSON.stringify(payload)).not.toContain('someone@example.com');
	});

	it('omits keys that were not supplied', () => {
		const input: Record<string, unknown> = { monitor_id: 1 };
		const payload = auditPayload(input, ['monitor_id', 'policy_id']);
		expect(payload.monitor_id).toBe(1);
		expect(payload).not.toHaveProperty('policy_id');
	});

	it('never carries free text into the audit row', async () => {
		// A representative write whose content field is user-authored free text.
		const { ctx } = makeCtx();
		mockResponse(SINGLE);
		// Capture what logEventFromContext writes to corsair_events.
		const rows: unknown[] = [];
		const db = {
			insertInto: () => ({
				values: (row: unknown) => {
					rows.push(row);
					return { execute: async () => undefined };
				},
			}),
		};
		const spy = { ...(ctx as object), database: { db } } as unknown as never;

		await handlerFor('incidentComments.create')(spy, {
			incident_id: 1234571,
			content: 'secret customer detail',
		});
		// The comment body reaches the API but must not reach the audit row.
		expect(requested().body?.content).toBe('secret customer detail');
		expect(rows.length).toBe(1);
		expect(JSON.stringify(rows)).not.toContain('secret customer detail');
	});
});

describe('token introspection', () => {
	it('reports the token as configured without disclosing it', async () => {
		const { ctx } = makeCtx();
		const result = (await handlerFor('token.describe')(ctx, {})) as Record<
			string,
			unknown
		>;

		expect(result.configured).toBe(true);
		expect(result.token_length).toBe(TEST_TOKEN.length);
		expect(result.token_suffix).toBe(`...${TEST_TOKEN.slice(-4)}`);
		expect(JSON.stringify(result)).not.toContain(TEST_TOKEN);
	});

	it('makes no network call', async () => {
		const { ctx } = makeCtx();
		lastCall = undefined;
		await handlerFor('token.describe')(ctx, {});
		expect(lastCall).toBeUndefined();
	});
});
