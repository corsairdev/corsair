import { makeStormglassRequest, StormglassAPIError } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

let captured: Captured | undefined;
const originalFetch = global.fetch;

type MockResponse = {
	status?: number;
	statusText?: string;
	body?: unknown;
};

function mockFetch(response: MockResponse) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		if (init?.headers instanceof Headers) {
			init.headers.forEach((value, key) => {
				headers[key] = value;
			});
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
		};
		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: status < 400,
			status,
			statusText: response.statusText ?? 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeStormglassRequest', () => {
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('sends the raw API key in the Authorization header (no Bearer prefix)', async () => {
		mockFetch({ body: { hours: [], meta: {} } });

		await makeStormglassRequest('weather/point', 'raw-api-key', {
			query: { lat: 58.7984, lng: 17.8081, params: 'waveHeight' },
		});

		expect(captured?.url).toBe(
			'https://api.stormglass.io/v2/weather/point?lat=58.7984&lng=17.8081&params=waveHeight',
		);
		expect(captured?.headers.authorization).toBe('raw-api-key');
		expect(captured?.method).toBe('GET');
	});

	it('drops undefined query values', async () => {
		mockFetch({ body: { data: [], meta: {} } });

		await makeStormglassRequest('tide/extremes/point', 'raw-api-key', {
			query: { lat: 1, lng: 2, start: undefined, end: undefined },
		});

		expect(captured?.url).toBe(
			'https://api.stormglass.io/v2/tide/extremes/point?lat=1&lng=2',
		);
	});

	it('wraps a non-2xx response in StormglassAPIError with status and body', async () => {
		mockFetch({
			status: 403,
			statusText: 'Forbidden',
			body: { errors: { key: 'API key is invalid' } },
		});

		await expect(
			makeStormglassRequest('elevation/point', 'bad-key', {
				query: { lat: 1, lng: 2 },
			}),
		).rejects.toMatchObject({
			name: 'StormglassAPIError',
			status: 403,
			body: { errors: { key: 'API key is invalid' } },
		});
	});

	it('is thrown as an instance of StormglassAPIError', async () => {
		mockFetch({ status: 500, statusText: 'Internal Server Error', body: {} });

		const err = await makeStormglassRequest('weather/point', 'raw-api-key', {
			query: { lat: 1, lng: 2, params: 'waveHeight' },
		}).catch((error: unknown) => error);

		expect(err).toBeInstanceOf(StormglassAPIError);
		expect((err as StormglassAPIError).status).toBe(500);
	});
});
