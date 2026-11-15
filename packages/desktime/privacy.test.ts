/**
 * What may leave the plugin besides the response itself.
 *
 * DeskTime returns what people did at work: names, emails, the apps and window
 * titles they had open, the projects they tracked. The response goes to the
 * caller; none of it belongs in the event log or on the console. The API key
 * belongs in one place only, the `X-API-Key` header.
 */
import { inspect } from 'node:util';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { DeskTimeAPIError } from './client';
import { desktime } from './index';
import {
	COMPANY_BODY,
	EMPLOYEE_ARRIVED,
	INVALID_KEY_ERROR,
	PING_BODY,
} from './test-fixtures';
import { rejection } from './test-helpers';

const API_KEY = 'desktime-canary-key-7f3a91';

/** Values distinctive enough that finding one in a log proves a leak. */
const PERSONAL = {
	name: 'Jane Canary',
	email: 'jane.canary@example.com',
	app: 'CanaryBrowser',
	title: 'canary-window-title payroll.xlsx',
	project: 'Canary Project',
	task: 'Canary Task',
	note: 'canary note text',
};

const PERSON = {
	...EMPLOYEE_ARRIVED,
	name: PERSONAL.name,
	email: PERSONAL.email,
	notes: [{ note: PERSONAL.note }],
	activeProject: [{ project: PERSONAL.project, task: PERSONAL.task }],
};

const TRACKED_APP = { app: PERSONAL.app, title: PERSONAL.title, time: 120 };

const BODIES = {
	employees: {
		employees: { '2026-11-08': { '789760': PERSON } },
		__request_time: '1794135991',
	},
	apps: {
		...PERSON,
		apps: { '-1': [TRACKED_APP], '0': [TRACKED_APP], '1': [TRACKED_APP] },
	},
	projects: {
		...PERSON,
		projects: [{ project: PERSONAL.project, task: PERSONAL.task, time: 60 }],
	},
	projectList: {
		projects: [{ id: 104211, name: 'Client work' }],
		__request_time: '1794136000',
	},
};

let fetchMock: jest.SpyInstance;
let consoleSpies: jest.SpyInstance[];

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape that the output schema under test validates.
 */
function respondJson(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

/** Everything written to the console during the test, as one string. */
function consoleOutput(): string {
	return consoleSpies
		.flatMap((spy) => spy.mock.calls)
		.map((args) => inspect(args, { depth: 8 }))
		.join('\n');
}

async function createClient(options: Parameters<typeof desktime>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'desktime', 'default');
	const corsair = createCorsair({
		plugins: [desktime(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	// A call no test queued a response for must fail here, never reach the
	// network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch: queue a response for every request');
	});
	consoleSpies = (['log', 'info', 'warn', 'error', 'debug'] as const).map(
		(method) => jest.spyOn(console, method).mockImplementation(() => undefined),
	);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('what a successful call leaves behind', () => {
	it('keeps the key in the header and personal data out of events and the console', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.desktime.keys.issue_new_dek();
			await corsair.desktime.keys.set_api_key(API_KEY);

			const api = corsair.desktime.api;
			respondJson(PING_BODY);
			await api.ping.get({});
			respondJson(COMPANY_BODY);
			await api.company.get({});
			respondJson(BODIES.employees);
			await api.employees.list({ date: '2026-11-08', period: 'day' });
			respondJson(PERSON);
			await api.employee.basic({ id: 789760, date: '2026-11-08' });
			respondJson(BODIES.apps);
			const apps = await api.employee.apps({ id: 789760 });
			respondJson(BODIES.projects);
			await api.employee.projects({ id: 789760 });
			respondJson(BODIES.projectList);
			await api.projects.list({});

			// The caller still gets the data: this is about logs, not the result.
			expect(apps.apps_by_productivity?.productive?.[0]?.title).toBe(
				PERSONAL.title,
			);

			expect(fetchMock).toHaveBeenCalledTimes(7);
			for (const [rawUrl, init] of fetchMock.mock.calls as [
				string,
				RequestInit,
			][]) {
				expect(String(rawUrl)).not.toContain(API_KEY);
				expect(String(rawUrl).toLowerCase()).not.toContain('apikey');
				expect(new Headers(init.headers).get('X-API-Key')).toBe(API_KEY);
			}

			const events = await testDb.db
				.selectFrom('corsair_events')
				.selectAll()
				.execute();
			expect(events).toHaveLength(7);
			const written = `${JSON.stringify(events)}\n${consoleOutput()}`;
			expect(written).not.toContain(API_KEY);
			for (const value of Object.values(PERSONAL)) {
				expect(written).not.toContain(value);
			}
		} finally {
			testDb.cleanup();
		}
	});
});

describe('what a failed call leaves behind', () => {
	it('keeps the key out of a rejected-key error, the events and the console', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respondJson(INVALID_KEY_ERROR, 401);
			const error = await rejection<DeskTimeAPIError>(
				corsair.desktime.api.company.get({}),
			);

			expect(error).toBeInstanceOf(DeskTimeAPIError);
			const events = await testDb.db
				.selectFrom('corsair_events')
				.selectAll()
				.execute();
			const written = [
				error.message,
				error.stack ?? '',
				JSON.stringify(error),
				inspect(error, { depth: 8 }),
				JSON.stringify(events),
				consoleOutput(),
			].join('\n');
			expect(written).not.toContain(API_KEY);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps the key out of a transport failure, whose cause is kept', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValue(new TypeError('fetch failed'));
			const pending = rejection<DeskTimeAPIError>(
				corsair.desktime.api.employees.list({}),
			);
			// Transport failures are retried with a backoff; run the timers out.
			await jest.advanceTimersByTimeAsync(120_000);
			const error = await pending;

			expect(error).toBeInstanceOf(DeskTimeAPIError);
			expect(error.transport).toBe(true);
			const written = [
				error.message,
				JSON.stringify(error),
				inspect(error, { depth: 8 }),
				consoleOutput(),
			].join('\n');
			expect(written).not.toContain(API_KEY);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});

describe('which key a tenant sends', () => {
	async function createTenants(options: Parameters<typeof desktime>[0] = {}) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'desktime', 'acme');
		const now = new Date();
		await testDb.db
			.insertInto('corsair_accounts')
			// never: the test helper inserts its row the same way; the generated
			// column types want sealed values this test does not need.
			.values({
				id: 'desktime-account-globex',
				created_at: now,
				updated_at: now,
				tenant_id: 'globex',
				integration_id: 'desktime-integration',
				config: {},
				dek: undefined,
			} as never)
			.execute();
		const corsair = createCorsair({
			plugins: [desktime(options)],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
			multiTenancy: true,
		});
		return { corsair, testDb };
	}

	function sentKey(index: number): string | null {
		const [, init] = fetchMock.mock.calls[index] as [string, RequestInit];
		return new Headers(init.headers).get('X-API-Key');
	}

	it('sends each tenant its own saved key', async () => {
		const { corsair, testDb } = await createTenants();
		try {
			const acme = corsair.withTenant('acme');
			const globex = corsair.withTenant('globex');
			await acme.desktime.keys.issue_new_dek();
			await acme.desktime.keys.set_api_key('acme-key');
			await globex.desktime.keys.issue_new_dek();
			await globex.desktime.keys.set_api_key('globex-key');

			respondJson(COMPANY_BODY);
			await acme.desktime.api.company.get({});
			respondJson(COMPANY_BODY);
			await globex.desktime.api.company.get({});

			expect(sentKey(0)).toBe('acme-key');
			expect(sentKey(1)).toBe('globex-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('sends a key passed at registration for every tenant, over their saved keys', async () => {
		// This is why the overview says to pass `key` only when the whole app
		// reads one DeskTime account: every tenant reads that account's people.
		const { corsair, testDb } = await createTenants({ key: 'shared-key' });
		try {
			const acme = corsair.withTenant('acme');
			const globex = corsair.withTenant('globex');
			await globex.desktime.keys.issue_new_dek();
			await globex.desktime.keys.set_api_key('globex-key');

			respondJson(COMPANY_BODY);
			await acme.desktime.api.company.get({});
			respondJson(COMPANY_BODY);
			await globex.desktime.api.company.get({});

			expect(sentKey(0)).toBe('shared-key');
			expect(sentKey(1)).toBe('shared-key');
		} finally {
			testDb.cleanup();
		}
	});
});
