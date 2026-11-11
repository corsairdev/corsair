import { GoogleSlidesEndpointOutputSchemas } from './endpoints/types';
import type { GoogleSlidesContext } from './index';
import type { ProviderJson } from './types';

/**
 * A context stub covering the subset the handlers touch: the token, the
 * account id the event log needs, and the db.
 *
 * unknown: the real context carries hub, keys, database and OAuth plumbing, and
 * building one is not feasible in a unit test. The handlers only read these
 * fields, so the cast is narrowed here once instead of at every call site.
 */
export function makeContext(
	overrides: Partial<{
		key: string;
		db: Record<string, ReturnType<typeof makeStore>>;
		refreshAuth: () => Promise<string>;
	}> = {},
): GoogleSlidesContext {
	const ctx: Record<string, unknown> = {
		// unknown: fixture, cast to the context below.
		key: overrides.key ?? 'test-access-token',
		$getAccountId: async () => 'test-account-id',
		db: overrides.db ?? {},
	};
	if (overrides.refreshAuth) ctx._refreshAuth = overrides.refreshAuth;
	return ctx as unknown as GoogleSlidesContext; // unknown: partial fixture, cast once.
}

export function makeStore() {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		findByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

/**
 * Parses a hand-built provider reply through the endpoint's own output schema,
 * so a test cannot assert on a shape the API would never satisfy.
 *
 * unknown: the fixture is written by hand; the schema decides whether it is a
 * reply the provider could have sent.
 */
export function asOutput<
	K extends keyof typeof GoogleSlidesEndpointOutputSchemas,
>(key: K, value: unknown): unknown {
	// unknown: hand-written fixture, schema-checked.
	return GoogleSlidesEndpointOutputSchemas[key].parse(value);
}

/**
 * unknown: a hand-written fixture body, JSON-encoded for the fetch mock; the
 * test asserts on what the endpoint made of it.
 */
export function respondJson(body: unknown) {
	// unknown: fixture body, JSON-encoded.
	return { ok: true, status: 200, statusText: 'OK', body, url: '' };
}

/**
 * Capture a rejection without narrowing at the call site.
 *
 * unknown: a promise can reject with any value, so the reason has no static
 * type; each caller narrows it to the fields it asserts on.
 */
export async function captureError(
	promise: Promise<unknown>,
): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

/** A raw request body as the mocked corsair/http received it. */
export type SentBody = {
	requests?: ProviderJson[];
	writeControl?: ProviderJson;
};
