import { makeGrafanaRawRequest } from './client';

describe('makeGrafanaRawRequest', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('strips a trailing slash from baseUrl before building the request path', async () => {
		let requestedUrl = '';
		global.fetch = (async (url: unknown) => {
			requestedUrl = String(url);
			return {
				text: async () => '',
				headers: { get: () => 'text/html' },
				status: 200,
			};
		}) as unknown as typeof fetch;

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'https://grafana.example.com/',
		);

		expect(requestedUrl).toBe('https://grafana.example.com/ruler/ring');
	});

	it('leaves a baseUrl without a trailing slash unaffected', async () => {
		let requestedUrl = '';
		global.fetch = (async (url: unknown) => {
			requestedUrl = String(url);
			return {
				text: async () => '',
				headers: { get: () => 'text/html' },
				status: 200,
			};
		}) as unknown as typeof fetch;

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'https://grafana.example.com',
		);

		expect(requestedUrl).toBe('https://grafana.example.com/ruler/ring');
	});
});
