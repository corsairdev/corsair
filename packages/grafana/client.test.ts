import {
	GrafanaAPIError,
	makeGrafanaRawRequest,
	makeGrafanaRequest,
} from './client';

describe('makeGrafanaRequest', () => {
	it('refuses to send the bearer token to a non-HTTPS baseUrl', async () => {
		await expect(
			makeGrafanaRequest('/api/health', 'token', 'http://grafana.example.com'),
		).rejects.toThrow(GrafanaAPIError);
	});

	it('rejects a malformed baseUrl', async () => {
		await expect(
			makeGrafanaRequest('/api/health', 'token', 'not-a-url'),
		).rejects.toThrow(GrafanaAPIError);
	});
});

describe('makeGrafanaRawRequest', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('strips a trailing slash from baseUrl before building the request path', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'https://grafana.example.com/',
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://grafana.example.com/ruler/ring',
			expect.any(Object),
		);
	});

	it('strips multiple trailing slashes from baseUrl', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'https://grafana.example.com///',
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://grafana.example.com/ruler/ring',
			expect.any(Object),
		);
	});

	it('leaves a baseUrl without a trailing slash unaffected', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'https://grafana.example.com',
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://grafana.example.com/ruler/ring',
			expect.any(Object),
		);
	});

	it('refuses to send the bearer token to a non-HTTPS baseUrl', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await expect(
			makeGrafanaRawRequest(
				'/ruler/ring',
				'token',
				'http://grafana.example.com',
			),
		).rejects.toThrow(GrafanaAPIError);

		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts an uppercase HTTPS scheme', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await makeGrafanaRawRequest(
			'/ruler/ring',
			'token',
			'HTTPS://grafana.example.com',
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'HTTPS://grafana.example.com/ruler/ring',
			expect.any(Object),
		);
	});

	it('rejects a malformed baseUrl', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));

		await expect(
			makeGrafanaRawRequest('/ruler/ring', 'token', 'not-a-url'),
		).rejects.toThrow(GrafanaAPIError);

		expect(fetchMock).not.toHaveBeenCalled();
	});
});
