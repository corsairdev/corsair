import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { SquarePluginOptions } from './index';
import { square } from './index';

export const TOKEN = 'EAAAl-test-access-token';
export const BASE = 'https://connect.squareup.com';
export const SANDBOX_BASE = 'https://connect.squareupsandbox.com';
export const VERSION = '2026-09-16';

/** A Corsair client with the plugin registered and an access token stored. */
export async function createClient(options: SquarePluginOptions = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'square', 'default');
	const corsair = createCorsair({
		plugins: [square(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.square.keys.issue_new_dek();
	await corsair.square.keys.set_api_key(TOKEN);
	return { corsair, testDb };
}

/**
 * A fetch spy that fails any call a test did not queue a response for, so
 * nothing reaches the network.
 */
export function mockFetch() {
	return jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
}

// unknown: response bodies are arbitrary JSON, as Square sends them.
export function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

/** One fetch call a test recorded: its URL pieces, method, headers and body. */
export type SentRequest = {
	origin: string;
	pathname: string;
	query: Record<string, string>;
	method: string;
	headers: Headers;
	body: RequestInit['body'];
};

/** Reads the `index`th fetch call made through `mockFetch`. */
export function sentRequest(
	fetchMock: jest.SpyInstance,
	index = 0,
): SentRequest {
	const call = fetchMock.mock.calls[index];
	if (!call) throw new Error(`fetch was not called ${index + 1} times`);
	const [url, init] = call;
	if (typeof url !== 'string') throw new Error('expected fetch(url, init)');
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		pathname: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams.entries()),
		method: String(init?.method),
		headers: new Headers(init?.headers),
		body: init?.body,
	};
}

/** The JSON body of a recorded request. */
// unknown: a request body is whatever JSON the operation sent.
export function jsonBody(sent: SentRequest): unknown {
	if (typeof sent.body !== 'string') throw new Error('expected a JSON body');
	return JSON.parse(sent.body);
}
