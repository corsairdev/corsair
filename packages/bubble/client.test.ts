/**
 * Exercises makeBubbleRequest in isolation: base URL resolution, bearer
 * auth, query serialization, JSON vs text-plain bodies, timeouts, and error
 * wrapping. The shared transport (`corsair/http`) is real; only `fetch` is
 * stubbed.
 */
import { BubbleAPIError, makeBubbleRequest } from './client';

function jsonResponse(body: unknown, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		headers: {
			get: () => 'application/json',
		},
		json: async () => body,
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

function textResponse(body: string, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		headers: {
			get: () => 'text/plain',
		},
		json: async () => {
			throw new Error('not json');
		},
		text: async () => body,
	} as unknown as Response;
}

// The shared transport dispatches a `Request` whose `headers` is a real
// `Headers` instance and whose `body` is a stream - normalize both so the
// assertions below read plain values.
async function captureInit(init?: RequestInit): Promise<{
	headers: Record<string, string>;
	body: string | undefined;
}> {
	const headers: Record<string, string> = {};
	if (init?.headers) {
		const raw = init.headers as Headers;
		if (typeof raw.get === 'function') {
			for (const [name, value] of raw.entries()) headers[name] = value;
		} else {
			Object.assign(headers, raw);
		}
	}
	let body: string | undefined;
	if (init?.body != null) {
		body =
			typeof init.body === 'string'
				? init.body
				: await new (
						globalThis as unknown as {
							Response: new (b: unknown) => { text(): Promise<string> };
						}
					).Response(init.body).text();
	}
	return { headers, body };
}

let fetchMock: jest.Mock;
let lastUrl: string | undefined;
type Captured = Awaited<ReturnType<typeof captureInit>>;
let lastCaptured: Captured = { headers: {}, body: undefined };

function header(
	headers: Record<string, string>,
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name.toLowerCase()) return value;
	}
	return undefined;
}

beforeEach(() => {
	lastUrl = undefined;
	lastCaptured = { headers: {}, body: undefined };
	fetchMock = jest.fn(async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastCaptured = await captureInit(init);
		return jsonResponse({ ok: true });
	});
	global.fetch = fetchMock as unknown as typeof global.fetch;
});

describe('makeBubbleRequest', () => {
	it('targets https://{appName}.bubbleapps.io and authenticates with a bearer token', async () => {
		const result = await makeBubbleRequest<{ ok: boolean }>(
			'obj/unit',
			'rentalunits',
			'test-secret',
			{ method: 'GET' },
		);

		expect(result).toEqual({ ok: true });
		expect(lastUrl).toBe('https://rentalunits.bubbleapps.io/api/1.1/obj/unit');
		expect(header(lastCaptured.headers, 'Authorization')).toBe(
			'Bearer test-secret',
		);
	});

	it('allows a custom baseUrl override for custom domains and the dev branch', async () => {
		await makeBubbleRequest('obj/unit', '', 'key', {
			method: 'GET',
			baseUrl: 'https://app.example.com/version-test',
		});

		expect(lastUrl).toBe(
			'https://app.example.com/version-test/api/1.1/obj/unit',
		);
	});

	it('rejects a custom baseUrl that is not HTTPS', async () => {
		await expect(
			makeBubbleRequest('obj/unit', '', 'key', {
				method: 'GET',
				baseUrl: 'http://app.example.com',
			}),
		).rejects.toThrow('HTTPS');
	});

	it('spreads GET query params into the URL', async () => {
		await makeBubbleRequest('obj/unit', 'rentalunits', 'key', {
			method: 'GET',
			query: { limit: 10, cursor: 3, descending: true },
		});

		expect(lastUrl).toBe(
			'https://rentalunits.bubbleapps.io/api/1.1/obj/unit?limit=10&cursor=3&descending=true',
		);
	});

	it('serializes an object body as JSON with the application/json content type', async () => {
		await makeBubbleRequest('obj/unit', 'rentalunits', 'key', {
			method: 'POST',
			body: { 'Unit name': 'Unit A', beds: 3 },
		});

		expect(header(lastCaptured.headers, 'Content-Type')).toBe(
			'application/json',
		);
		expect(lastCaptured.body).toBe('{"Unit name":"Unit A","beds":3}');
	});

	it('sends a string body verbatim as text/plain (bulk create)', async () => {
		const body = '{"a":1}\n{"a":2}';
		await makeBubbleRequest('obj/unit/bulk', 'rentalunits', 'key', {
			method: 'POST',
			body,
			mediaType: 'text/plain',
			timeout: 260_000,
		});

		expect(header(lastCaptured.headers, 'Content-Type')).toBe('text/plain');
		expect(lastCaptured.body).toBe(body);
	});

	it('requires a non-empty api key and app name (unless baseUrl overrides)', async () => {
		await expect(
			makeBubbleRequest('obj/unit', '', '', { method: 'GET' }),
		).rejects.toThrow(BubbleAPIError);

		await expect(
			makeBubbleRequest('obj/unit', 'rentalunits', '', { method: 'GET' }),
		).rejects.toThrow(BubbleAPIError);

		await expect(
			makeBubbleRequest('obj/unit', 'rentalunits', 'key', {
				method: 'GET',
			}),
		).resolves.toBeDefined();
	});

	it('rejects appName values that could hijack the request host', async () => {
		for (const appName of [
			'x@evil.example#',
			'foo.bar.example',
			'..',
			'foo/bar',
		]) {
			await expect(
				makeBubbleRequest('obj/unit', appName, 'key', {
					method: 'GET',
				}),
			).rejects.toThrow(/Invalid Bubble app name/);
		}

		await expect(
			makeBubbleRequest('obj/unit', 'rental-units2', 'key', {
				method: 'GET',
			}),
		).resolves.toBeDefined();
	});

	it('wraps non-2xx responses in a BubbleAPIError carrying the status', async () => {
		fetchMock.mockImplementation(async () =>
			jsonResponse(
				{
					statusCode: 404,
					body: { status: 'MISSING_DATA', message: 'no such thing' },
				},
				404,
			),
		);

		try {
			await makeBubbleRequest('obj/unit/abc', 'rentalunits', 'key', {
				method: 'GET',
			});
			throw new Error('expected the request to reject');
		} catch (error) {
			expect(error).toBeInstanceOf(BubbleAPIError);
			expect((error as BubbleAPIError).status).toBe(404);
		}
	});

	it('returns raw text for text/plain responses (bulk create)', async () => {
		fetchMock.mockImplementation(async () =>
			textResponse('{"status":"success","id":"1"}'),
		);

		const result = await makeBubbleRequest<string>(
			'obj/unit/bulk',
			'rentalunits',
			'key',
			{ method: 'POST', body: '{}', mediaType: 'text/plain' },
		);

		expect(result).toBe('{"status":"success","id":"1"}');
	});
});
