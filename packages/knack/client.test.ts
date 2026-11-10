import { inspect } from 'node:util';
import {
	buildFilterQuery,
	KnackAPIError,
	makeKnackRequest,
	packKnackCredentials,
	parseKnackCredentials,
	segment,
} from './client';
import {
	invalidApiKey,
	malformedAppId,
	malformedRecordId,
	rateLimited,
	record,
} from './test-fixtures';

const CREDENTIALS = {
	applicationId: '6af358626e7887956647723f',
	apiKey: 'b81e8bc4-4519-4257-82fc-b0508a6728a2',
};

let fetchMock: jest.SpyInstance;

// unknown: a failure body may be JSON or plain text, and both are exercised.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	const isText = typeof body === 'string';
	fetchMock.mockResolvedValueOnce(
		new Response(isText ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': isText ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<KnackAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(KnackAPIError);
	if (!(error instanceof KnackAPIError)) throw error;
	return error;
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('credentials', () => {
	it('round-trips the app id and key through the packed key', () => {
		const packed = packKnackCredentials(CREDENTIALS);
		expect(parseKnackCredentials(packed)).toEqual(CREDENTIALS);
	});

	// Knack needs both headers, so a half-filled pair is no pair.
	it('rejects a key that is not a packed pair', () => {
		expect(parseKnackCredentials('just-a-value')).toBeNull();
		expect(parseKnackCredentials(undefined)).toBeNull();
		expect(parseKnackCredentials('')).toBeNull();
		expect(parseKnackCredentials('{"applicationId":"only-id"}')).toBeNull();
		expect(
			parseKnackCredentials('{"applicationId":"","apiKey":"k"}'),
		).toBeNull();
	});

	it('rejects a packed pair that is not JSON', () => {
		expect(parseKnackCredentials('{not json')).toBeNull();
	});
});

describe('segment', () => {
	it('encodes a value so it cannot escape its path position', () => {
		expect(segment('object_3')).toBe('object_3');
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('makeKnackRequest', () => {
	it('sends both Knack headers and no Authorization', async () => {
		respond(record, 200);

		const result = await makeKnackRequest(CREDENTIALS, {
			method: 'GET',
			path: '/objects/object_3/records',
		});

		expect(result).toEqual(record);
		const { url, init, headers } = lastRequest();
		expect(url).toBe('https://api.knack.com/v1/objects/object_3/records');
		expect(init.method).toBe('GET');
		expect(headers.get('x-knack-application-id')).toBe(
			CREDENTIALS.applicationId,
		);
		expect(headers.get('x-knack-rest-api-key')).toBe(CREDENTIALS.apiKey);
		expect(headers.get('authorization')).toBeNull();
	});

	// Knack silently drops a body sent with any other content type and still
	// answers 200, so the write content type is pinned.
	it('sets the JSON content type on a write', async () => {
		respond(record, 200);

		await makeKnackRequest(CREDENTIALS, {
			method: 'POST',
			path: '/objects/object_3/records',
			body: { field_23: 'Acme' },
		});

		const { init, headers } = lastRequest();
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({ field_23: 'Acme' });
	});

	it('sets no content type on a read', async () => {
		respond(record, 200);

		await makeKnackRequest(CREDENTIALS, {
			method: 'GET',
			path: '/objects/object_3/records',
		});

		expect(lastRequest().headers.get('content-type')).toBeNull();
	});

	// The transport drops an array index, and Knack silently ignores the
	// unindexed form and answers every record, so the indexed names are built
	// explicitly and this pins them.
	it('builds indexed filter parameters that Knack actually applies', async () => {
		respond(record, 200);

		await makeKnackRequest(CREDENTIALS, {
			method: 'GET',
			path: '/objects/object_3/records',
			query: buildFilterQuery([
				{ field: 'field_23', operator: 'is', value: 'Acme' },
				{ field: 'field_24', operator: 'contains', value: 'abc' },
			]),
		});

		const url = new URL(lastRequest().url);
		expect(url.searchParams.get('filters[0][field]')).toBe('field_23');
		expect(url.searchParams.get('filters[0][operator]')).toBe('is');
		expect(url.searchParams.get('filters[0][value]')).toBe('Acme');
		expect(url.searchParams.get('filters[1][field]')).toBe('field_24');
		expect(url.searchParams.get('filters[1][operator]')).toBe('contains');
		// The unindexed spelling must never appear: Knack ignores it.
		expect(url.search).not.toContain('filters[field]');
	});

	// 429 arrives as plain text, and treating it as JSON would leave no message.
	it('reads a plain-text rate limit and its reset header', async () => {
		respond(rateLimited, 429, {
			'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 30),
			'X-RateLimit-Remaining': '0',
		});

		const error = await failure(
			makeKnackRequest(CREDENTIALS, { method: 'GET', path: '/objects' }),
		);

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		expect(error.messages).toEqual(['Rate limit exceeded']);
		expect(error.message).toContain('Rate limit exceeded');
		expect(error.retryAfter).toBeGreaterThan(0);
	});

	it('reads a plain-text 401', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makeKnackRequest(CREDENTIALS, { method: 'GET', path: '/objects' }),
		);

		expect(error.status).toBe(401);
		expect(error.messages).toEqual(['Invalid API Key']);
	});

	it('reads a plain-text 400 for a malformed app id', async () => {
		respond(malformedAppId, 400);

		const error = await failure(
			makeKnackRequest(CREDENTIALS, { method: 'GET', path: '/applications' }),
		);

		expect(error.messages).toEqual(['Malformed App ID.']);
	});

	// The same API answers some 400s as JSON, so both shapes must be read.
	it('reads a JSON 400 for a malformed record id', async () => {
		respond(malformedRecordId, 400);

		const error = await failure(
			makeKnackRequest(CREDENTIALS, {
				method: 'GET',
				path: '/objects/object_3/records/zzz',
			}),
		);

		expect(error.messages).toEqual(['Malformed Record ID.']);
	});

	it('keeps the request method so a write is not replayed', async () => {
		respond('Server error', 500);

		const error = await failure(
			makeKnackRequest(CREDENTIALS, {
				method: 'POST',
				path: '/objects/object_3/records',
				body: { field_23: 'Acme' },
			}),
		);

		expect(error.method).toBe('POST');
		expect(error.status).toBe(500);
	});

	// The app id and key travel in headers, and the write body is a caller's
	// business data, so neither may be reachable from the error.
	it('keeps a failed write body and both credentials out of the error', async () => {
		const fields = { field_23: 'Acme Confidential' };
		respond({ errors: ['Invalid field'] }, 400);

		const error = await failure(
			makeKnackRequest(CREDENTIALS, {
				method: 'POST',
				path: '/objects/object_3/records',
				body: fields,
			}),
		);

		expect(error.cause).toBeUndefined();
		for (const view of [
			error.message,
			inspect(error, { depth: 10, showHidden: true }),
			JSON.stringify(error),
		]) {
			expect(view).not.toContain('Acme Confidential');
			expect(view).not.toContain(CREDENTIALS.apiKey);
		}
	});

	it('wraps a transport failure and keeps no response', async () => {
		fetchMock.mockRejectedValueOnce(new Error('socket hang up'));

		const error = await failure(
			makeKnackRequest(CREDENTIALS, { method: 'GET', path: '/objects' }),
		);

		expect(error.status).toBe(0);
		expect(error.message).toContain('socket hang up');
		expect(error.messages).toEqual([]);
	});
});
