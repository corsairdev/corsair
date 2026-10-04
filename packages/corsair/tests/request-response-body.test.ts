import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

const originalFetch = global.fetch;

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

function respondWith(body: string, contentType: string, status = 200) {
	global.fetch = jest.fn(
		async () =>
			new Response(body, {
				status,
				headers: { 'content-type': contentType },
			}),
	) as typeof fetch;
}

afterEach(() => {
	global.fetch = originalFetch;
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

		const error = await request(config, options).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).body).toEqual({
			errors: [{ title: 'Not found' }],
		});
	});

	it('keeps the raw error text when a +json body is not valid JSON', async () => {
		respondWith('upstream timed out', 'application/vnd.api+json', 502);

		const error = await request(config, options).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).body).toBe('upstream timed out');
	});

	it('keeps an empty +json error body as text', async () => {
		respondWith('', 'application/vnd.api+json', 500);

		const error = await request(config, options).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).body).toBe('');
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
		global.fetch = jest.fn(async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'https://api.example.com/things',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json,
			text,
			clone,
		})) as unknown as typeof fetch;

		await expect(request(config, options)).resolves.toBe(payload);
		expect(json).toHaveBeenCalledTimes(1);
		expect(text).not.toHaveBeenCalled();
		expect(clone).not.toHaveBeenCalled();
	});

	it('reads an error body from a stub that only implements json()', async () => {
		global.fetch = jest.fn(async () => ({
			ok: false,
			status: 400,
			statusText: 'Bad Request',
			url: 'https://api.example.com/things',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({ message: 'bad input' }),
		})) as unknown as typeof fetch;

		const error = await request(config, options).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).body).toEqual({ message: 'bad input' });
	});

	it('returns no body for a stub without headers', async () => {
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		global.fetch = jest.fn(async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'https://api.example.com/things',
			json: async () => ({ id: 1 }),
		})) as unknown as typeof fetch;

		await expect(request(config, options)).resolves.toBeUndefined();
		expect(consoleError).not.toHaveBeenCalled();
		consoleError.mockRestore();
	});
});
