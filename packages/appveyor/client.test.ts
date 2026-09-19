import {
	makeAppVeyorRequest,
	makeAppVeyorTextRequest,
	parseRetryAfterMs,
} from './client';

describe('AppVeyor client', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	it('uses bearer token and GET requests', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => [],
		});
		global.fetch = fetchMock;

		await makeAppVeyorRequest('/projects', 'test-key');

		expect(fetchMock).toHaveBeenCalledWith(
			'https://ci.appveyor.com/api/projects',
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Authorization: 'Bearer test-key',
					Accept: 'application/json',
				}),
			}),
		);
	});

	it('sends text accept headers for log requests', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'Content-Type': 'text/plain' }),
			text: async () => 'log',
		});
		global.fetch = fetchMock;

		const result = await makeAppVeyorTextRequest(
			'/buildjobs/1/log',
			'test-key',
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://ci.appveyor.com/api/buildjobs/1/log',
			expect.objectContaining({
				headers: expect.objectContaining({ Accept: 'text/plain' }),
			}),
		);
		expect(result).toBe('log');
	});

	it('parses Retry-After delta-seconds and HTTP-date', () => {
		expect(parseRetryAfterMs('2')).toBe(2000);

		const until = new Date(Date.now() + 4000).toUTCString();
		const delay = parseRetryAfterMs(until);
		expect(delay).toBeGreaterThanOrEqual(0);
		expect(delay).toBeLessThanOrEqual(4000);
	});

	it('retries HTTP 429 using HTTP-date Retry-After before succeeding', async () => {
		const until = new Date(Date.now() + 50).toUTCString();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				headers: new Headers({
					'Retry-After': until,
					'Content-Type': 'application/json',
				}),
				json: async () => ({}),
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => [{ projectId: 1 }],
			});
		global.fetch = fetchMock;

		const result = await makeAppVeyorRequest('/projects', 'test-key');

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(result).toEqual([{ projectId: 1 }]);
	});

	it('throws ApiError with retryAfter when retries are exhausted', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'Retry-After': '0',
				'Content-Type': 'application/json',
			}),
			json: async () => ({}),
		});
		global.fetch = fetchMock;

		await expect(
			makeAppVeyorRequest('/projects', 'test-key'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 0,
		});

		expect(fetchMock).toHaveBeenCalledTimes(4);
	});
});
