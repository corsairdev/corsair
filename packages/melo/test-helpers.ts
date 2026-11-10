import type { MeloJson } from './client';
import type { MeloContext } from './index';

export const API_KEY = 'melo-secret-test-key';

/** The content type the API answers a Hydra collection with. */
export const LD_JSON = 'application/ld+json; charset=utf-8';

/** Queues a JSON body, labelled the way the real API labels it. */
export function respondLd(
	fetchMock: jest.SpyInstance,
	body: object,
	status = 200,
	headers: Record<string, string> = {},
): void {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': LD_JSON, ...headers },
		}),
	);
}

/** Queues a plain-text or HTML body, as a wrong key (401) and a 404 are. */
export function respondText(
	fetchMock: jest.SpyInstance,
	text: string,
	status: number,
	contentType = 'text/html; charset=UTF-8',
	headers: Record<string, string> = {},
): void {
	fetchMock.mockResolvedValueOnce(
		new Response(text, {
			status,
			headers: { 'Content-Type': contentType, ...headers },
		}),
	);
}

/** Queues a bodyless answer such as the 204 of DELETE /searches/{id}. */
export function respondEmpty(fetchMock: jest.SpyInstance, status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller narrows it to the fields it asserts on.
export async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	// unknown: see above.
	return promise.catch((caught: unknown) => caught);
}

/**
 * A context with just what the endpoints read: the key and the log path's
 * account lookup. The real bound context is exercised in retry.test.ts.
 */
export function makeContext(): MeloContext {
	const ctx = {
		key: API_KEY,
		$getAccountId: jest.fn(async () => 'account-1'),
	} as const;
	// unknown: only `key` and the log path's account lookup are read; the
	// endpoints never touch the rest of the context.
	return ctx as unknown as MeloContext;
}

export type RecordedCall = {
	url: string;
	parsed: URL;
	method: string | undefined;
	headers: Headers;
	body: { [key: string]: MeloJson | undefined } | undefined;
	/** Query parameters by name, each with every value sent. */
	query: Record<string, string[]>;
};

export function lastCall(fetchMock: jest.SpyInstance): RecordedCall {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const query: Record<string, string[]> = {};
	for (const [name, value] of parsed.searchParams.entries()) {
		query[name] = [...(query[name] ?? []), value];
	}
	return {
		url,
		parsed,
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body
			? (JSON.parse(String(init.body)) as {
					[key: string]: MeloJson | undefined;
				})
			: undefined,
		query,
	};
}

/**
 * The docs' collection examples carry a schema-placeholder `hydra:view`
 * (`"hydra:next": "string"`). This swaps in a view shaped like a real one,
 * with a next link when `nextPage` is given and none on the last page.
 */
export function withView<T extends object>(
	body: T,
	path: string,
	nextPage?: number,
): T & { 'hydra:view': object } {
	return {
		...body,
		'hydra:view': {
			'@id': `${path}?page=1`,
			'@type': 'hydra:PartialCollectionView',
			'hydra:first': `${path}?page=1`,
			'hydra:last': `${path}?page=9`,
			...(nextPage === undefined
				? {}
				: { 'hydra:next': `${path}?page=${nextPage}` }),
		},
	};
}
