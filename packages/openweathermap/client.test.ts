import {
	makeOpenWeatherMapRequest,
	OPENWEATHERMAP_DATA_25_BASE,
	OPENWEATHERMAP_GEO_BASE,
	OPENWEATHERMAP_MAPS_2_BASE,
	OPENWEATHERMAP_ONE_CALL_3_BASE,
	OpenWeatherMapAPIError,
} from './client';
import { errorHandlers } from './error-handlers';

type Captured = {
	url: string;
	method: string;
};

let captured: Captured | undefined;
const originalFetch = global.fetch;

type MockResponse = {
	ok?: boolean;
	status?: number;
	statusText?: string;
	body?: unknown;
	text?: string;
	arrayBuffer?: ArrayBuffer;
	headers?: Record<string, string>;
};

function mockFetch(response: MockResponse) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = { url: String(url), method: init?.method ?? 'GET' };
		const status = response.status ?? 200;
		const headers = new Headers({
			'Content-Type': 'application/json',
			...response.headers,
		});
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: response.statusText ?? 'OK',
			url: String(url),
			headers,
			json: async () => payload,
			text: async () =>
				response.text ??
				(typeof payload === 'string' ? payload : JSON.stringify(payload)),
			arrayBuffer: async () =>
				response.arrayBuffer ?? new TextEncoder().encode('png').buffer,
		};
	}) as unknown as typeof global.fetch;
}

describe('makeOpenWeatherMapRequest', () => {
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('sends appid and uses the One Call 3.0 host by default', async () => {
		mockFetch({ body: { lat: 1 } });
		await makeOpenWeatherMapRequest('onecall', 'test-key', {
			query: { lat: 51.5, lon: -0.12 },
		});
		expect(captured?.url).toContain(OPENWEATHERMAP_ONE_CALL_3_BASE);
		expect(captured?.url).toContain('appid=test-key');
		expect(captured?.url).toContain('lat=51.5');
		expect(captured?.method).toBe('GET');
	});

	it('routes current weather to data/2.5', async () => {
		mockFetch({ body: { name: 'London' } });
		await makeOpenWeatherMapRequest('weather', 'test-key', {
			api: 'data25',
			query: { q: 'London' },
		});
		expect(
			captured?.url.startsWith(`${OPENWEATHERMAP_DATA_25_BASE}/weather`),
		).toBe(true);
	});

	it('routes geocoding to geo/1.0', async () => {
		mockFetch({ body: [] });
		await makeOpenWeatherMapRequest('direct', 'test-key', {
			api: 'geo',
			query: { q: 'London' },
		});
		expect(captured?.url.startsWith(`${OPENWEATHERMAP_GEO_BASE}/direct`)).toBe(
			true,
		);
	});

	it('posts station bodies as JSON', async () => {
		mockFetch({ body: { id: 'st-1' } });
		await makeOpenWeatherMapRequest('stations', 'test-key', {
			method: 'POST',
			body: { name: 'Test', altitude: 10 },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toContain('/stations');
	});

	it('treats empty DELETE as success', async () => {
		mockFetch({ status: 204, ok: true, body: undefined, headers: {} });
		const response = await makeOpenWeatherMapRequest<{ success: true }>(
			'stations/abc',
			'test-key',
			{ method: 'DELETE', responseType: 'empty' },
		);
		expect(response).toEqual({ success: true });
		expect(captured?.method).toBe('DELETE');
	});

	it('returns map tiles as base64 with the response content type', async () => {
		mockFetch({
			headers: { 'Content-Type': 'image/png' },
			arrayBuffer: new Uint8Array([1, 2, 3]).buffer,
		});
		const response = await makeOpenWeatherMapRequest<{
			contentType: string;
			dataBase64: string;
		}>('weather/TA2/1/0/0', 'test-key', {
			api: 'maps2',
			responseType: 'binary',
		});
		expect(
			captured?.url.startsWith(`${OPENWEATHERMAP_MAPS_2_BASE}/weather/`),
		).toBe(true);
		expect(captured?.url).toContain('appid=test-key');
		expect(response.contentType).toBe('image/png');
		expect(response.dataBase64).toBe(Buffer.from([1, 2, 3]).toString('base64'));
	});

	it('sets status on binary HTTP errors so rate-limit handlers match', async () => {
		mockFetch({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			text: '{"message":"rate limit"}',
			headers: { 'Retry-After': '2', 'Content-Type': 'application/json' },
		});
		await expect(
			makeOpenWeatherMapRequest('weather/TA2/1/0/0', 'test-key', {
				api: 'maps2',
				responseType: 'binary',
			}),
		).rejects.toMatchObject({
			name: 'OpenWeatherMapAPIError',
			status: 429,
		});
	});
});

describe('errorHandlers', () => {
	it('classifies a binary 429 OpenWeatherMapAPIError as RATE_LIMIT_ERROR', () => {
		const error = new OpenWeatherMapAPIError('rate limit', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});
});
