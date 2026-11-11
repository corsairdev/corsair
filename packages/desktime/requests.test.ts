import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { desktime } from './index';
import {
	COMPANY_BODY,
	EMPLOYEE,
	EMPLOYEE_APPS_FILLED_BODY,
	EMPLOYEE_PROJECTS_BODY,
	EMPLOYEES_BODY,
	PING_BODY,
	PROJECTS_BODY,
} from './test-fixtures';

async function createClient(options: Parameters<typeof desktime>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'desktime', 'default');
	const corsair = createCorsair({
		plugins: [desktime({ key: 'desktime-test-key', ...options })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape; the output schema under test is what validates it,
 * so a per-call-site type would add ceremony without adding a check.
 */
function respondJson(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function sentCall(index = 0): { url: URL; init: RequestInit } {
	const [rawUrl, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	return { url: new URL(rawUrl), init };
}

beforeEach(() => {
	// A call no test queued a response for must fail here, never reach the
	// network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch: queue a response for every request');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

/**
 * One test per operation, asserting the path DeskTime routes on plus the query
 * it sends. DeskTime ignores an unknown `date` or `period` and answers with
 * today's data, so a wrong value is a silent wrong result rather than an error.
 */
describe('request shape per operation', () => {
	it('ping.get hits /ping with the key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(PING_BODY);

			const result = await corsair.desktime.api.ping.get({});

			const { url, init } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/ping');
			expect(new Headers(init.headers).get('X-API-Key')).toBe(
				'desktime-test-key',
			);
			expect(result.pong).toBe('1794135987');
		} finally {
			testDb.cleanup();
		}
	});

	it('company.get hits /company with the key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(COMPANY_BODY);

			const result = await corsair.desktime.api.company.get({});

			const { url, init } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/company');
			expect(new Headers(init.headers).get('X-API-Key')).toBe(
				'desktime-test-key',
			);
			expect(result.name).toBe('corsair test company');
			expect(result.timezone_identifier).toBe('Asia/Kolkata');
		} finally {
			testDb.cleanup();
		}
	});

	it('employees.list sends date and period', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(EMPLOYEES_BODY);

			await corsair.desktime.api.employees.list({
				date: '2026-11-08',
				period: 'week',
			});

			const { url } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/employees');
			expect(url.searchParams.get('date')).toBe('2026-11-08');
			expect(url.searchParams.get('period')).toBe('week');
		} finally {
			testDb.cleanup();
		}
	});

	it('employee.basic sends the id and date', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(EMPLOYEE);

			const result = await corsair.desktime.api.employee.basic({
				id: 789760,
				date: '2026-11-08',
			});

			const { url } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/employee/basic');
			expect(url.searchParams.get('id')).toBe('789760');
			expect(url.searchParams.get('date')).toBe('2026-11-08');
			expect(result.id).toBe(789760);
		} finally {
			testDb.cleanup();
		}
	});

	it('employee.apps sends the id and date', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(EMPLOYEE_APPS_FILLED_BODY);

			await corsair.desktime.api.employee.apps({
				id: 789760,
				date: '2026-11-08',
			});

			const { url } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/employee/apps');
			expect(url.searchParams.get('id')).toBe('789760');
			expect(url.searchParams.get('date')).toBe('2026-11-08');
		} finally {
			testDb.cleanup();
		}
	});

	it('employee.apps omits the date when it is not given', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(EMPLOYEE_APPS_FILLED_BODY);

			await corsair.desktime.api.employee.apps({ id: 789760 });

			const { url } = sentCall();
			expect(url.searchParams.get('id')).toBe('789760');
			// DeskTime defaults to today, so sending an empty date would be wrong.
			expect(url.searchParams.has('date')).toBe(false);
		} finally {
			testDb.cleanup();
		}
	});

	it('employee.projects sends the id and date', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(EMPLOYEE_PROJECTS_BODY);

			await corsair.desktime.api.employee.projects({
				id: 789760,
				date: '2026-11-08',
			});

			const { url } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/employee/projects');
			expect(url.searchParams.get('id')).toBe('789760');
			expect(url.searchParams.get('date')).toBe('2026-11-08');
		} finally {
			testDb.cleanup();
		}
	});

	it('projects.list hits /projects', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(PROJECTS_BODY);

			const result = await corsair.desktime.api.projects.list({});

			const { url } = sentCall();
			expect(url.pathname).toBe('/api/v2/json/projects');
			expect(result.projects).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a malformed date before sending, because DeskTime ignores it', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.desktime.api.employees.list({ date: '08/11/2026' }),
			).rejects.toThrow(/YYYY-MM-DD/);
			// Nothing reached the network, so no API call was spent.
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects an unknown period before sending', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				// unknown: the value is deliberately outside the enum under test.
				corsair.desktime.api.employees.list({ period: 'quarter' as never }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
