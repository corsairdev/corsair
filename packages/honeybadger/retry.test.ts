import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { HoneybadgerAPIError, JsonValue } from './client';
import { honeybadger } from './index';
import { rejection } from './test-helpers';

/**
 * The endpoints send one attempt because the client sets `maxRetries: 0`; only
 * the bound client retries, using this plugin's error handlers. This file goes
 * through `createCorsair` so that retry layer actually runs. It is not named
 * `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'honeybadger', 'default');
	const corsair = createCorsair({
		plugins: [honeybadger({ key: 'hbu_test' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** A response as Honeybadger sends it. */
function respond(
	body: JsonValue,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const project = {
	id: 'Xk9mZp',
	account_id: 'Ab3kL9',
	name: 'Billing API',
	asana_workspace_id: null,
	active: true,
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp' },
	disable_public_links: false,
	environments: ['production'],
	language: null,
	resolve_errors_on_deploy: true,
	user_url: null,
	source_url: null,
	user_search_field: null,
	customer_throttle: null,
	fault_count: 3,
	unresolved_fault_count: 1,
	last_notice_at: null,
	earliest_notice_at: null,
	purge_days: null,
	created_at: '2025-01-01T00:00:00Z',
};

const rateLimited = {
	error: { code: 'rate_limit_exceeded', message: 'Slow down.' },
	meta: { request_id: 'r1' },
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the project', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '0' });
			respond({ data: project, meta: { request_id: 'r2' } });

			const result = await corsair.honeybadger.api.projects.get({
				project_id: 'Xk9mZp',
			});

			expect(result.data.name).toBe('Billing API');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a write, which the provider refused before acting', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '0' });
			respond({ data: project, meta: { request_id: 'r2' } }, 201);

			const result = await corsair.honeybadger.api.projects.create({
				name: 'Billing API',
			});

			expect(result.data.id).toBe('Xk9mZp');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimited, 429, { 'Retry-After': '0' });
			}

			await expect(
				corsair.honeybadger.api.projects.list({}),
			).rejects.toMatchObject({ status: 429 });
			// One attempt plus the three RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on a create', async () => {
		// A POST creates something, and Honeybadger has acted on it by the time
		// it answers 5xx, so a replay could create a second project.
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'service_unavailable', message: 'Later.' } },
				503,
			);

			await expect(
				corsair.honeybadger.api.projects.create({ name: 'Billing' }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 'service_unavailable', message: 'Later.' } },
				503,
			);
			respond({ data: project, meta: { request_id: 'r2' } });

			const result = await corsair.honeybadger.api.projects.get({
				project_id: 'Xk9mZp',
			});

			expect(result.data.id).toBe('Xk9mZp');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400, a 401 or a 422', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Valid inputs, so each call reaches fetch and gets its own status.
			const calls = [
				[400, () => corsair.honeybadger.api.projects.list({ per_page: 10 })],
				[401, () => corsair.honeybadger.api.projects.get({ project_id: 'x' })],
				[
					422,
					() => corsair.honeybadger.api.projects.create({ name: 'Billing' }),
				],
			] as const;
			for (const [status, call] of calls) {
				respond({ error: { code: 'refused', message: 'Refused' } }, status);
				const before = fetchMock.mock.calls.length;
				const error = (await rejection(call())) as HoneybadgerAPIError;
				expect(error.status).toBe(status);
				expect(fetchMock.mock.calls.length - before).toBe(1);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused input, because no request is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// `per_page` is capped at 100 by the schema, so this fails before fetch.
			await expect(
				corsair.honeybadger.api.projects.list({ per_page: 101 }),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
