import { GoogleSlidesEndpointOutputSchemas } from './endpoints/types';
import type { GoogleSlidesContext } from './index';
import type { ProviderJson } from './types';

/**
 * A context stub covering the subset the handlers touch: the token, the account
 * id the event log needs, and the db.
 *
 * The real context carries hub, keys, database and OAuth plumbing, and building
 * one is not feasible in a unit test. The handlers only read these fields, so
 * the cast is narrowed here once instead of at every call site.
 */
export function makeContext(
	overrides: Partial<{
		key: string;
		db: Record<string, ReturnType<typeof makeStore>>;
		refreshAuth: () => Promise<string>;
	}> = {},
): GoogleSlidesContext {
	const ctx: Record<string, unknown> = {
		// unknown: partial fixture.
		key: overrides.key ?? 'test-access-token',
		$getAccountId: async () => 'test-account-id',
		db: overrides.db ?? {},
	};
	if (overrides.refreshAuth) ctx._refreshAuth = overrides.refreshAuth;
	return ctx as unknown as GoogleSlidesContext; // unknown: cast once, here.
}

export function makeStore() {
	return {
		// Typed with its real argument shape so a test can read back what was
		// written; jest otherwise infers a zero-length tuple for the call list.
		upsertByEntityId: jest.fn<
			Promise<undefined>, // the real method resolves to the stored row
			[string, Record<string, unknown>] // unknown: the row's fields vary per test
		>(async () => undefined),
		// A test queues a stored row, which is what a merge reads back.
		findByEntityId: jest.fn<
			Promise<unknown>, // unknown: the stored row, or undefined
			[string]
		>(async () => undefined),
		deleteByEntityId: jest.fn<Promise<boolean>, [string]>(async () => true),
	};
}

/**
 * Parses a hand-built provider reply through the endpoint's own output schema,
 * so a test cannot assert on a shape the API would never satisfy.
 */
export function asOutput<
	K extends keyof typeof GoogleSlidesEndpointOutputSchemas,
>(key: K, value: unknown): unknown {
	// unknown: fixture input and parsed output.
	return GoogleSlidesEndpointOutputSchemas[key].parse(value);
}

/** Wraps a hand-written fixture body for the fetch mock. */
// unknown: a hand-written fixture body, JSON-encoded by the mock transport.
export function respondJson(body: unknown) {
	// unknown: hand-written fixture body.
	return { ok: true, status: 200, statusText: 'OK', body, url: '' };
}

/** Capture a rejection without narrowing at the call site. */
export async function captureError(promise: Promise<unknown>) {
	// unknown: any reason.
	// unknown: a promise can reject with any value; callers narrow the reason.
	return promise.catch((caught: unknown) => caught); // unknown: rejection reason.
}

/** A raw request body as the mocked corsair/http received it. */
export type SentBody = {
	requests?: ProviderJson[];
	writeControl?: ProviderJson;
};
