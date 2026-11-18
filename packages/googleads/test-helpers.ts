import type { GoogleAdsContext } from './index';
import { googleads } from './index';

/** The version Google Ads puts in every path, pinned by the plugin. */
export const VERSION = 'v26';
export const BASE = `https://googleads.googleapis.com/${VERSION}`;

/**
 * A context the endpoints read: `key` is the OAuth token, and the integration
 * credentials supply the developer token.
 */
export function makeCtx(): GoogleAdsContext {
	// unknown: the endpoints read only `key` and the two integration fields.
	return {
		key: 'test-token',
		keys: {
			get_integration_credentials: async () => ({
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_url: null,
				developer_token: 'dev-token',
				login_customer_id: '9999999999',
			}),
		},
	} as unknown as GoogleAdsContext; // unknown: a partial manager by design.
}

/** A context with no developer token, to prove the call fails before the request. */
export function makeCtxWithoutDeveloperToken(): GoogleAdsContext {
	// unknown: same partial manager, with the one field this test omits.
	return {
		key: 'test-token',
		keys: {
			get_integration_credentials: async () => ({
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_url: null,
				developer_token: null,
				login_customer_id: null,
			}),
		},
	} as unknown as GoogleAdsContext; // unknown: a partial manager by design.
}

let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Google.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Google Ads test: ${String(input)}`);
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
	// unknown: response bodies are arbitrary JSON; each test states its own.
	body: unknown, // unknown: response bodies are arbitrary JSON per test.
	init: ResponseInit = {},
): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

/** The JSON body of the last request, as a plain record. */
export const sentBody = (): Record<string, unknown> => {
	// unknown: parsed JSON.
	// unknown: parsed JSON.
	const body = lastCall().init.body;
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>; // unknown: parsed JSON.
};

export const endpoints = googleads().endpoints!;

/**
 * A Google Ads failure envelope. Google returns the canonical status plus a
 * `GoogleAdsFailure` detail carrying the specific error.
 */
export function adsError(
	code: number,
	status: string,
	errorCode: Record<string, string> = {},
	message = 'Request failed',
): Response {
	return jsonResponse(
		{
			error: {
				code,
				message,
				status,
				details: [
					{
						'@type':
							'type.googleapis.com/google.ads.googleads.v26.errors.GoogleAdsFailure',
						errors: [
							{
								errorCode,
								message,
								location: {
									fieldPathElements: [{ fieldName: 'operations', index: 0 }],
								},
							},
						],
						requestId: 'req-1',
					},
				],
			},
		},
		{ status: code },
	);
}
