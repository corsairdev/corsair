import type { GooglePhotosContext } from './index';
import { googlephotos } from './index';

export const BASE = 'https://photoslibrary.googleapis.com/v1';

/** A context the endpoints read: only `key` matters to them. */
export function makeCtx(): GooglePhotosContext {
	return {
		key: 'test-token', // unknown: endpoints read only `key`.
	} as unknown as GooglePhotosContext;
}

let spy: jest.SpyInstance | undefined;

export function installFetchMock(): void {
	// A call with no queued response must fail the test, not reach Google.
	spy = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
		throw new Error(`Unmocked fetch in a Google Photos test: ${String(input)}`);
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

/** The upload endpoint answers the token as plain text, not JSON. */
export function tokenResponse(token: string): Response {
	return new Response(token, {
		status: 200,
		headers: { 'Content-Type': 'text/plain' },
	});
}

export function lastCall(): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.calls[0]!;
	return { url: String(url), init: init! };
}

/** The call at one index, for an endpoint that makes several requests. */
export function callAt(index: number): { url: string; init: RequestInit } {
	const [url, init] = currentFetch().mock.calls[index]!;
	return { url: String(url), init: init! };
}

export function sentHeader(name: string): string | null {
	return new Headers(lastCall().init.headers).get(name);
}

export const sentBody = (): Record<string, unknown> => {
	const body = lastCall().init.body; // unknown: parsed JSON, read by key.
	if (typeof body !== 'string') {
		throw new Error('expected a JSON string body');
	}
	return JSON.parse(body) as Record<string, unknown>;
};

export const endpoints = googlephotos().endpoints!;

/** A Google error envelope, as the Library API sends it. */
export function googleError(
	code: number,
	status: string,
	message = 'Request failed',
): Response {
	return jsonResponse(
		{
			error: {
				code,
				message,
				status,
				errors: [{ message, domain: 'global', reason: status }],
			},
		},
		{ status: code },
	);
}

const mediaItem = {
	id: 'item-1',
	filename: 'beach.jpg',
	mimeType: 'image/jpeg',
	baseUrl: 'https://lh3.googleusercontent.com/p/abc',
	mediaMetadata: {
		creationTime: '2024-06-01T10:00:00Z',
		width: '4032',
		height: '3024',
	},
};

const album = {
	id: 'album-1',
	title: 'Holiday',
	mediaItemsCount: '12',
	isWriteable: true,
};

export { mediaItem, album };
