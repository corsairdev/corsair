import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PlainAPIError } from './client';
import { plain } from './index';

// Live tests run only with a real key. Writes are never exercised here —
// mocked `endpoints.test.ts` covers every mutation. This file proves the
// queries actually work against Plain with real pagination and follow-up
// fetches.
//
// Keys carry per-scope permissions, so a read that the key is not scoped for
// fails with HTTP 403 (`Insufficient permissions, missing "<scope>:read"`).
// That is a key-scope gap, not a code bug: the query, variables, and parsing
// are identical to the paths that return 200. `liveOrSkip` turns exactly
// that case into a loud skip (console.warn names the missing scope) while
// every other failure — 401, 404, GraphQL validation errors, schema
// mismatches — still fails the test.
const LIVE_KEY = process.env.PLAIN_API_KEY ?? '';
const LIVE_KEK = process.env.CORSAIR_KEK ?? '';
const describeLive =
	LIVE_KEY !== '' && LIVE_KEK !== '' ? describe : describe.skip;

const MISSING_SCOPE_RE = /missing\s+"([^"]+)"/i;

// A transport-level 403 surfaces as `PlainAPIError: Forbidden`, which hides
// the scope. The scope name lives in the transport body
// (`{ errors: [{ message: 'Insufficient permissions, missing "x:y"' }] }`),
// so read it back through `cause` with narrowing only — no casts.
function scopeFromTransportBody(error: unknown): string | null {
	if (error instanceof PlainAPIError) {
		const cause: unknown = error.cause;
		if (cause instanceof ApiError) {
			const body: unknown = cause.body;
			if (body !== null && typeof body === 'object' && 'errors' in body) {
				const errors: unknown = body.errors;
				if (Array.isArray(errors)) {
					const first: unknown = errors[0];
					if (
						first !== null &&
						typeof first === 'object' &&
						'message' in first &&
						typeof first.message === 'string'
					) {
						return first.message.match(MISSING_SCOPE_RE)?.[1] ?? null;
					}
				}
			}
		}
	}
	return null;
}

function missingScope(error: unknown): string | null {
	if (error instanceof PlainAPIError) {
		if (/insufficient permissions|forbidden/i.test(error.message)) {
			return (
				error.message.match(MISSING_SCOPE_RE)?.[1] ??
				scopeFromTransportBody(error) ??
				'unknown scope'
			);
		}
	}
	return null;
}

async function liveOrSkip(
	name: string,
	fn: () => Promise<void>,
): Promise<void> {
	try {
		await fn();
	} catch (error) {
		const scope = missingScope(error);
		if (scope === null) {
			throw error;
		}
		console.warn(
			`[live] SKIP ${name}: API key lacks ${scope} — grant it in Plain → Settings → API keys to cover this path.`,
		);
	}
}

async function createPlainClient() {
	const { createIntegrationAndAccount, createTestDatabase } = await import(
		'corsair/tests'
	);

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'plain', 'default');

	const corsair = createCorsair({
		plugins: [plain({})],
		database: testDb.db,
		kek: LIVE_KEK,
	});

	await corsair.plain.keys.issue_new_dek();
	await corsair.plain.keys.set_api_key(LIVE_KEY);

	return { corsair, testDb };
}

describeLive('Plain live API (read-only)', () => {
	it('lists tiers and fetches the first tier by id', async () => {
		await liveOrSkip('tiers.list', async () => {
			const setup = await createPlainClient();
			const { corsair, testDb } = setup;
			try {
				const tiers = await corsair.plain.api.tiers.list({ first: 5 });
				expect(Array.isArray(tiers.tiers)).toBe(true);

				const firstTier = tiers.tiers[0];
				if (firstTier !== undefined) {
					const fetched = await corsair.plain.api.tiers.fetch({
						tierId: firstTier.id,
					});
					expect(fetched.tier?.id).toBe(firstTier.id);
				}
			} finally {
				testDb.cleanup();
			}
		});
	});

	it('lists customer groups', async () => {
		await liveOrSkip('customerGroups.list', async () => {
			const setup = await createPlainClient();
			const { corsair, testDb } = setup;
			try {
				const groups = await corsair.plain.api.customerGroups.list({
					first: 5,
				});
				expect(Array.isArray(groups.customerGroups)).toBe(true);
				expect(groups.pageInfo.hasNextPage).toBeDefined();
			} finally {
				testDb.cleanup();
			}
		});
	});

	it('queries threads and fetches the first thread by id', async () => {
		await liveOrSkip('threads.query', async () => {
			const setup = await createPlainClient();
			const { corsair, testDb } = setup;
			try {
				const threads = await corsair.plain.api.threads.query({ first: 5 });
				expect(Array.isArray(threads.threads)).toBe(true);

				const firstThread = threads.threads[0];
				if (firstThread !== undefined) {
					const fetched = await corsair.plain.api.threads.getById({
						threadId: firstThread.id,
					});
					expect(fetched.thread?.id).toBe(firstThread.id);
				}

				const { createCorsairOrm } = await import('corsair/orm');
				const orm = createCorsairOrm(testDb.database);
				const events = await orm.events.findMany({
					where: { event_type: 'plain.threads.query' },
				});
				expect(events.length).toBeGreaterThan(0);
			} finally {
				testDb.cleanup();
			}
		});
	});

	it('lists customers and fetches the first customer by id', async () => {
		await liveOrSkip('customers.list', async () => {
			const setup = await createPlainClient();
			const { corsair, testDb } = setup;
			try {
				const customers = await corsair.plain.api.customers.list({ first: 1 });
				expect(Array.isArray(customers.customers)).toBe(true);

				const firstCustomer = customers.customers[0];
				if (firstCustomer !== undefined) {
					const fetched = await corsair.plain.api.customers.getById({
						customerId: firstCustomer.id,
					});
					expect(fetched.customer?.id).toBe(firstCustomer.id);
				}
			} finally {
				testDb.cleanup();
			}
		});
	});

	it('runs an arbitrary GraphQL query', async () => {
		await liveOrSkip('graphql.run', async () => {
			const setup = await createPlainClient();
			const { corsair, testDb } = setup;
			try {
				const result = await corsair.plain.api.graphql.run({
					query:
						'query GetUsers($first: Int) { users(first: $first) { edges { node { id fullName email } } } }',
					variables: { first: 1 },
					operationName: 'GetUsers',
				});
				expect(result.data).toBeDefined();
			} finally {
				testDb.cleanup();
			}
		});
	});
});
