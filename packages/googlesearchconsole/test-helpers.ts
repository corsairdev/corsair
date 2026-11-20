import type { GoogleSearchConsoleContext } from './index';
import { googlesearchconsole } from './index';

export const BASE = 'https://searchconsole.googleapis.com';

/** A context the endpoints read: only `key` matters to them. */
export function makeCtx(): GoogleSearchConsoleContext {
	// unknown: the endpoints read only `key`, so the rest is absent by design.
	return { key: 'test-token' } as unknown as GoogleSearchConsoleContext;
}

let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Google.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(
			`Unmocked fetch in a Search Console test: ${String(input)}`,
		);
	});
}

export function restoreFetchMock(): void {
	jest.restoreAllMocks();
	spy = undefined;
}

export function currentFetch(): jest.SpyInstance {
	if (!spy)
		throw new Error('installFetchMock() must run before currentFetch()');
	return spy;
}

export function mockFetch(response: Response): void {
	currentFetch().mockResolvedValueOnce(response);
}

export function jsonResponse(
	body: unknown, // unknown: response bodies are arbitrary JSON per test.
	init: ResponseInit = {},
): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

/** The bodyless success that sites.add, sites.delete and both sitemap writes answer. */
export function emptyResponse(status = 200): Response {
	return new Response(null, { status });
}

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

/** The JSON body of the last request, as a plain record. */
export function sentBody(): Record<string, unknown> {
	// unknown: parsed JSON.
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>; // unknown: parsed JSON.
}

export const endpoints = googlesearchconsole().endpoints!;

/** A Google error envelope, as Search Console sends it. */
export function consoleError(
	code: number,
	status: string,
	reason: string,
	message = 'Request failed',
): Response {
	return jsonResponse(
		{
			error: {
				code,
				message,
				status,
				errors: [{ message, domain: 'global', reason }],
			},
		},
		{ status: code },
	);
}

export const PROPERTY = 'https://example.com/';
export const DOMAIN_PROPERTY = 'sc-domain:example.com';
export const FEED = 'https://example.com/sitemap.xml';
