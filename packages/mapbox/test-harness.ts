import type { MapboxContext } from './index';

/**
 * Shared doubles for the offline suites. Nothing here talks to Mapbox; live
 * coverage lives in `api.test.ts`, which CI excludes by filename.
 */

/** A token-shaped string that must never appear in an error or a log. */
export const API_KEY =
	'pk.eyJ1IjoidGVzdCIsImEiOiJzZWNyZXQtdGVzdC10b2tlbiJ9.sig';

export type FetchMock = jest.SpyInstance<
	ReturnType<typeof fetch>,
	Parameters<typeof fetch>
>;

export function installFetchMock(): FetchMock {
	// The default rejects rather than falling through to the real `fetch`: once
	// the responses queued by `respond` run out, a stray request or a retry would
	// otherwise reach Mapbox and let an offline test pass on live data.
	return jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('Unexpected fetch call in an offline test'));
}

/**
 * Queues one response. Mapbox serves geocoding as `application/vnd.geo+json`,
 * which the shared client reads as text, so tests pass that type to match.
 */
export function respond(
	fetchMock: FetchMock,
	body: object | string,
	status = 200,
	options: { headers?: Record<string, string>; contentType?: string } = {},
): void {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': options.contentType ?? 'application/json',
				...options.headers,
			},
		}),
	);
}

export const GEO_JSON = 'application/vnd.geo+json; charset=utf-8';

/** The request made by the most recent fetch call. */
export type RecordedRequest = {
	url: string;
	parsed: URL;
	init: RequestInit;
	query: URLSearchParams;
	headers: Headers;
};

export function lastRequest(fetchMock: FetchMock): RecordedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url,
		parsed,
		init,
		query: parsed.searchParams,
		headers: new Headers(init.headers),
	};
}

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(
	promise: Promise<T>,
): Promise<unknown /* unknown: a rejection reason has no static type */> {
	return promise.catch((caught: unknown /* unknown: see above */) => caught);
}

export type LoggedContext = {
	ctx: MapboxContext;
	accountIdRequested: () => boolean;
};

/**
 * The endpoints read `key` and the log path reads `$getAccountId` and
 * `database`. The log writer tolerates a missing database, so it is left out and
 * only the account lookup is asserted. The real context runs in retry.test.ts.
 */
export function makeContext(key: string = API_KEY): LoggedContext {
	let requested = false;
	const ctx = {
		key,
		$getAccountId: jest.fn(async () => {
			requested = true;
			return 'account-1';
		}),
	};
	return {
		// Only `key` and the log path's account lookup are read.
		ctx: ctx as never,
		accountIdRequested: () => requested,
	};
}
