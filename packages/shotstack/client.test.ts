import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	attributesList,
	attributesOf,
	describeShotstackError,
	makeShotstackRequest,
	queuedResourceId,
	segment,
	shotstackRequestFacts,
} from './client';
import {
	errorsForbidden,
	generationPlanError,
	RENDER_ID,
	rateLimitedBody,
} from './test-fixtures';
import { API_KEY, captureError } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await captureError(promise);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

async function anyFailure(promise: Promise<unknown>): Promise<Error> {
	const error = await captureError(promise);
	expect(error).toBeInstanceOf(Error);
	if (!(error instanceof Error)) throw error;
	return error;
}

function codeOf(error: ApiError): unknown {
	return (error.body as { code?: unknown } | undefined)?.code;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeShotstackRequest', () => {
	it('sends the key in x-api-key and calls the production edit path', async () => {
		respond({ ok: true }, 200);

		const result = await makeShotstackRequest(API_KEY, {
			method: 'GET',
			service: 'edit',
			path: `/render/${RENDER_ID}`,
		});

		expect(result).toEqual({ ok: true });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.shotstack.io/edit/v1/render/2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7',
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
	});

	it.each([
		['ingest', '/sources'],
		['serve', '/assets'],
	] as const)(
		'prefixes %s with its own service path',
		async (service, path) => {
			respond({ ok: true }, 200);

			await makeShotstackRequest(API_KEY, { method: 'GET', service, path });

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://api.shotstack.io/${service}/v1${path}`);
		},
	);

	it('POSTs a JSON body', async () => {
		respond({ ok: true }, 200);

		await makeShotstackRequest(API_KEY, {
			method: 'POST',
			service: 'edit',
			path: '/render',
			body: { timeline: { tracks: [] }, output: { format: 'mp4' } },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			timeline: { tracks: [] },
			output: { format: 'mp4' },
		});
	});

	it('sends the Idempotency-Key header when set and drops it when undefined', async () => {
		respond({ ok: true }, 200);
		respond({ ok: true }, 200);

		await makeShotstackRequest(API_KEY, {
			method: 'POST',
			service: 'edit',
			path: '/generate',
			body: {},
			headers: { 'Idempotency-Key': 'key-1' },
		});
		await makeShotstackRequest(API_KEY, {
			method: 'POST',
			service: 'edit',
			path: '/generate',
			body: {},
			headers: { 'Idempotency-Key': undefined },
		});

		const first = fetchMock.mock.calls[0] as [string, RequestInit];
		const second = fetchMock.mock.calls[1] as [string, RequestInit];
		expect(new Headers(first[1].headers).get('idempotency-key')).toBe('key-1');
		expect(new Headers(second[1].headers).get('idempotency-key')).toBeNull();
	});

	it('resolves a 204 as undefined', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			makeShotstackRequest(API_KEY, {
				method: 'DELETE',
				service: 'serve',
				path: `/assets/${RENDER_ID}`,
			}),
		).resolves.toBeUndefined();
	});

	it('reads the json:api error body', async () => {
		respond(errorsForbidden, 403);

		const error = await failure(
			makeShotstackRequest(API_KEY, {
				method: 'GET',
				service: 'ingest',
				path: '/sources',
			}),
		);
		expect(error.status).toBe(403);
		expect(shotstackRequestFacts(error)).toEqual({
			method: 'GET',
			idempotent: false,
			transport: false,
		});
		expect(error.message).toContain('Shotstack 403');
		expect(error.message).toContain('Invalid or disabled API key');
	});

	it('reads the code of a bare generate error', async () => {
		respond(generationPlanError, 403);

		const error = await failure(
			makeShotstackRequest(API_KEY, {
				method: 'POST',
				service: 'edit',
				path: '/generate',
				body: {},
			}),
		);
		expect(error.status).toBe(403);
		expect(codeOf(error)).toBe('AiCapabilityNotIncluded');
		expect(shotstackRequestFacts(error)?.idempotent).toBe(false);
	});

	it('reads the code from a json:api rate limit body', async () => {
		respond(rateLimitedBody, 429, { 'Retry-After': '30' });

		const error = await failure(
			makeShotstackRequest(API_KEY, {
				method: 'GET',
				service: 'edit',
				path: '/render/x',
			}),
		);
		expect(error.status).toBe(429);
		expect(codeOf(error)).toBe('rate_limit_error');
		expect(error.retryAfter).toBe(30_000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('marks network failures as transport errors', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await anyFailure(
			makeShotstackRequest(API_KEY, {
				method: 'GET',
				service: 'edit',
				path: '/templates',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error).not.toBeInstanceOf(ApiError);
		expect(shotstackRequestFacts(error)).toEqual({
			method: 'GET',
			idempotent: false,
			transport: true,
		});
	});

	it('keeps the idempotency flag on a transport failure of a keyed create', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await anyFailure(
			makeShotstackRequest(API_KEY, {
				method: 'POST',
				service: 'edit',
				path: '/generate',
				body: {},
				headers: { 'Idempotency-Key': 'key-1' },
			}),
		);
		expect(shotstackRequestFacts(error)).toMatchObject({
			transport: true,
			idempotent: true,
		});
	});

	it('leaves the API key out of the error message, JSON and inspect output', async () => {
		respond(errorsForbidden, 403);

		const error = await failure(
			makeShotstackRequest(API_KEY, {
				method: 'GET',
				service: 'edit',
				path: '/templates',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.request)).not.toContain(API_KEY);
	});
});

describe('error messages', () => {
	it('never carries the serialized body of an unmapped status', async () => {
		respond({ echo: 'timeline text from the request' }, 422);
		const error = await failure(
			makeShotstackRequest(API_KEY, {
				method: 'POST',
				service: 'edit',
				path: '/render',
				body: {},
			}),
		);
		expect(error.status).toBe(422);
		expect(error.message).not.toContain('timeline text');
		expect(JSON.stringify(error.body)).not.toContain('timeline text');
	});
});

describe('describeShotstackError', () => {
	it('falls back when the body has no error text', () => {
		expect(
			describeShotstackError(503, '<html>down</html>', 'Unavailable'),
		).toEqual({
			message: 'Shotstack 503: Unavailable',
			code: undefined,
		});
		expect(describeShotstackError(undefined, undefined, 'timeout')).toEqual({
			message: 'timeout',
			code: undefined,
		});
	});
});

describe('json:api unwraps', () => {
	it('attributesOf throws on a body with no resource', async () => {
		const error = await anyFailure(
			Promise.resolve().then(() => attributesOf({ data: {} })),
		);
		expect(error.message).toContain('no json:api resource attributes');
	});

	it('attributesList throws on a body with no array', async () => {
		const error = await anyFailure(
			Promise.resolve().then(() => attributesList({ data: null })),
		);
		expect(error.message).toContain('no json:api resource array');
	});

	it('attributesList maps each resource to its attributes', () => {
		const list = attributesList({
			data: [
				{ type: 'source', id: 'a', attributes: { id: 'a', status: 'ready' } },
				{ type: 'source', id: 'b', attributes: { id: 'b', status: 'queued' } },
			],
		});
		expect(list).toEqual([
			{ id: 'a', status: 'ready' },
			{ id: 'b', status: 'queued' },
		]);
	});

	it('queuedResourceId throws when the id is missing', async () => {
		const error = await anyFailure(
			Promise.resolve().then(() =>
				queuedResourceId({ data: { type: 'source' } }),
			),
		);
		expect(error.message).toContain('no resource id');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('https://a.example/b.mp4?c=1')).toBe(
			'https%3A%2F%2Fa.example%2Fb.mp4%3Fc%3D1',
		);
	});
});
