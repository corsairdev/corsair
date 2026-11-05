import {
	describePlacidError,
	makePlacidRequest,
	PlacidAPIError,
	segment,
} from './client';
import {
	imageQueued,
	notFound,
	unauthenticated,
	validationFailed,
} from './test-fixtures';

const API_KEY = 'placid-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<PlacidAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(PlacidAPIError);
	if (!(error instanceof PlacidAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePlacidRequest', () => {
	it('authenticates with a Bearer token against the documented base URL', async () => {
		respond(imageQueued, 200);

		await makePlacidRequest(API_KEY, { method: 'GET', path: '/images/1' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.placid.app/api/rest/images/1');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(imageQueued, 200);

		await makePlacidRequest(API_KEY, {
			method: 'POST',
			path: '/images',
			body: { template_uuid: 'ospo24ysn' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			template_uuid: 'ospo24ysn',
		});
	});

	it('sends multipart without a JSON content type', async () => {
		respond({ media: [] }, 200);

		const file = new File([new Uint8Array([1, 2, 3])], 'logo.jpg', {
			type: 'image/jpeg',
		});
		await makePlacidRequest(API_KEY, {
			method: 'POST',
			path: '/media',
			formData: { file },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		// fetch sets the boundary; a declared type would break the parse.
		expect(new Headers(init.headers).get('content-type')).toBeNull();
		expect(init.body).toBeInstanceOf(FormData);
		expect((init.body as FormData).get('file')).toBeInstanceOf(File);
	});

	it('serializes query parameters and drops undefined ones', async () => {
		respond({ data: [] }, 200);

		await makePlacidRequest(API_KEY, {
			method: 'GET',
			path: '/templates',
			query: {
				tag: 'social/instagram',
				order_by: 'title-asc',
				collection_id: undefined,
			},
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('tag=social%2Finstagram');
		expect(url).toContain('order_by=title-asc');
		expect(url).not.toContain('collection_id');
	});

	it('resolves a 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makePlacidRequest(API_KEY, { method: 'DELETE', path: '/images/1' }),
		).resolves.toBeUndefined();
	});

	it('reads the message of an error body', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(401);
		expect(error.method).toBe('GET');
		expect(error.message).toBe('Placid 401: Unauthenticated.');
	});

	it('keeps per-field validation messages', async () => {
		respond(validationFailed, 422);

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'POST', path: '/images', body: {} }),
		);
		expect(error.status).toBe(422);
		expect(error.validationErrors).toEqual({
			template_uuid: ['The template uuid field is required.'],
			'layers.title.text': ['The layers.title.text must be a string.'],
		});
		// The message names the first field so the caller sees the reason.
		expect(error.message).toBe(
			'Placid 422: The template uuid field is required.',
		);
	});

	it('leaves validationErrors unset when the body has no errors', async () => {
		respond(notFound, 404);

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'GET', path: '/images/9' }),
		);
		expect(error.validationErrors).toBeUndefined();
		expect(error.message).toBe('Placid 404: Not Found');
	});

	it('reads Retry-After into the error', async () => {
		respond({ message: 'Too Many Attempts.' }, 429, { 'Retry-After': '2' });

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'POST', path: '/images', body: {} }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		// error-handlers.ts owns retries, so the client makes one attempt.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'GET', path: '/images/1' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'POST', path: '/images', body: {} }),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('keeps the API key out of errors', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makePlacidRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
	});

	it('does not retain the request body on an API error', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makePlacidRequest(API_KEY, {
				method: 'POST',
				path: '/images',
				body: { layers: { title: { text: 'customer secret' } } },
			}),
		);

		// ApiError holds `request.body`; keeping it as the cause would keep the
		// caller's layer content alive for as long as the error is referenced.
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('customer secret');
		// The details a caller branches on are still here.
		expect(error.status).toBe(401);
		expect(error.method).toBe('POST');
	});
});

describe('describePlacidError', () => {
	it('prefers the message the API sent', () => {
		expect(describePlacidError(400, { message: 'Bad template' }, 'x')).toBe(
			'Placid 400: Bad template',
		);
	});

	it('falls back when the body has no message', () => {
		expect(describePlacidError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Placid 503: Unavailable',
		);
		expect(describePlacidError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});

	it('reads the first validation message when there is no message', () => {
		expect(
			describePlacidError(
				422,
				{ errors: { title: ['Title is required.'] } },
				'x',
			),
		).toBe('Placid 422: Title is required.');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
