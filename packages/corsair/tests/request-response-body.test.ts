import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
};

const options: ApiRequestOptions = {
	method: 'GET',
	url: '/things',
};

function mockFetch(response: Response) {
	jest.spyOn(globalThis, 'fetch').mockResolvedValue(response);
}

function respondWith(body: string, contentType: string, status = 200) {
	mockFetch(
		new Response(body, {
			status,
			headers: { 'content-type': contentType },
		}),
	);
}

// Plugin tests often mock fetch with a partial object (json() only, no text(),
// sometimes no headers). Start from a real Response and redefine those members
// on the instance so the shape matches without a type assertion.
function partialResponse(
	init: ResponseInit,
	overrides: PropertyDescriptorMap,
): Response {
	const response = new Response(null, init);
	Object.defineProperties(response, overrides);
	return response;
}

async function apiErrorFrom(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.then(
		() => undefined,
		(e: unknown) => e,
	);
	if (!(error instanceof ApiError)) {
		throw new Error('expected request() to reject with an ApiError');
	}
	return error;
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request() response body parsing', () => {
	it('parses application/json', async () => {
		respondWith('{"id":1}', 'application/json; charset=utf-8');

		await expect(request(config, options)).resolves.toEqual({ id: 1 });
	});

	it('parses JSON:API (application/vnd.api+json)', async () => {
		respondWith(
			'{"data":{"type":"incidents","id":"1"}}',
			'application/vnd.api+json',
		);

		await expect(request(config, options)).resolves.toEqual({
			data: { type: 'incidents', id: '1' },
		});
	});

	it('parses other +json media types with parameters', async () => {
		respondWith('{"ok":true}', 'application/vnd.github.v3+json; charset=utf-8');

		await expect(request(config, options)).resolves.toEqual({ ok: true });
	});

	it('exposes a parsed +json error body on ApiError', async () => {
		respondWith(
			'{"errors":[{"title":"Not found"}]}',
			'application/vnd.api+json',
			404,
		);

		const error = await apiErrorFrom(request(config, options));

		expect(error.body).toEqual({
			errors: [{ title: 'Not found' }],
		});
	});

	it('keeps the raw error text when a +json body is not valid JSON', async () => {
		respondWith('upstream timed out', 'application/vnd.api+json', 502);

		const error = await apiErrorFrom(request(config, options));

		expect(error.body).toBe('upstream timed out');
	});

	it('keeps an empty +json error body as text', async () => {
		respondWith('', 'application/vnd.api+json', 500);

		const error = await apiErrorFrom(request(config, options));

		expect(error.body).toBe('');
	});

	it('keeps non-JSON responses as text', async () => {
		respondWith('hello', 'text/plain');

		await expect(request(config, options)).resolves.toBe('hello');
	});

	it('reads an ok JSON body with json() only, without clone() or text()', async () => {
		const payload = Object.assign([{ id: 1 }], { total: 1 });
		const json = jest.fn(async () => payload);
		const text = jest.fn(async () => '');
		const clone = jest.fn();
		mockFetch(
			partialResponse(
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
				{
					json: { value: json },
					text: { value: text },
					clone: { value: clone },
				},
			),
		);

		await expect(request(config, options)).resolves.toBe(payload);
		expect(json).toHaveBeenCalledTimes(1);
		expect(text).not.toHaveBeenCalled();
		expect(clone).not.toHaveBeenCalled();
	});

	it('reads an error body from a stub that only implements json()', async () => {
		mockFetch(
			partialResponse(
				{
					status: 400,
					statusText: 'Bad Request',
					headers: { 'Content-Type': 'application/json' },
				},
				{
					json: { value: async () => ({ message: 'bad input' }) },
					text: { value: undefined },
				},
			),
		);

		const error = await apiErrorFrom(request(config, options));

		expect(error.body).toEqual({ message: 'bad input' });
	});

	it('returns no body for a stub without headers', async () => {
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(
			partialResponse(
				{ status: 200 },
				{
					headers: { value: undefined },
					json: { value: async () => ({ id: 1 }) },
				},
			),
		);

		await expect(request(config, options)).resolves.toBeUndefined();
		expect(consoleError).not.toHaveBeenCalled();
	});
});
