import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CERTCENTRAL_BASES,
	DIGICERT_ONE_HOSTS,
	makeDigicertRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => mockRequest.mockReset());

describe('makeDigicertRequest', () => {
	it('uses CertCentral X-DC-DEVKEY and the Europe host when selected', async () => {
		mockRequest.mockResolvedValue({
			users: [],
			page: { total: 0, limit: 1000, offset: 0 },
		});
		await makeDigicertRequest('certcentral', '/user', 'certcentral-secret', {
			method: 'GET',
			region: 'eu',
			query: { limit: 20 },
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CERTCENTRAL_BASES.eu,
			HEADERS: { 'X-DC-DEVKEY': 'certcentral-secret' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				url: '/user',
				method: 'GET',
				query: { limit: 20 },
			}),
		);
	});

	it('does not send credentials to public Trust Lifecycle and CSC info routes', async () => {
		mockRequest.mockResolvedValue({ version: '1.0.0' });
		await makeDigicertRequest(
			'trustLifecycle',
			'/mpki/api/v1/version',
			undefined,
			{ public: true },
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: `https://${DIGICERT_ONE_HOSTS.us}`,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'x-api-key',
		);

		mockRequest.mockResolvedValue({ name: 'CSC service' });
		await makeDigicertRequest('contentTrust', '/csc/v1/info', undefined, {
			method: 'POST',
			body: { lang: 'en-US' },
			public: true,
			digicertOneRegion: 'nl',
		});
		expect(mockRequest.mock.calls[1]?.[0]).toMatchObject({
			BASE: `https://${DIGICERT_ONE_HOSTS.nl}/documentmanager`,
		});
		expect(mockRequest.mock.calls[1]?.[0]?.HEADERS).not.toHaveProperty(
			'x-api-key',
		);
		expect(mockRequest.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({ url: '/csc/v1/info', body: { lang: 'en-US' } }),
		);
	});

	it('uses the distinct DigiCert ONE service-user token for authenticated product families', async () => {
		mockRequest.mockResolvedValue([]);
		await makeDigicertRequest(
			'accountManager',
			'/account/api/v1/locales',
			'one-service-token',
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: `https://${DIGICERT_ONE_HOSTS.us}`,
			HEADERS: { 'x-api-key': 'one-service-token' },
		});
		mockRequest.mockResolvedValue({ version: '1.2.3' });
		await makeDigicertRequest(
			'privateCA',
			'/certificate-authority/api/v1/helper',
			'one-service-token',
		);
		expect(mockRequest.mock.calls[1]?.[0]).toMatchObject({
			HEADERS: { 'x-api-key': 'one-service-token' },
		});
		expect(mockRequest.mock.calls[1]?.[0]?.HEADERS).not.toHaveProperty(
			'X-DC-DEVKEY',
		);
	});

	it('uses X-DC-DEVKEY and the regional Report Library host', async () => {
		mockRequest.mockResolvedValue({ report_names: [] });
		await makeDigicertRequest(
			'reportLibrary',
			'/report/names',
			'certcentral-secret',
			{
				method: 'GET',
				reportRegion: 'eu',
			},
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://report.digicert.eu/reports/v1',
			HEADERS: { 'X-DC-DEVKEY': 'certcentral-secret' },
		});
	});

	it('uses the CertCentral host and API key for Custom Reports GraphQL requests', async () => {
		mockRequest.mockResolvedValue({ data: { order_details: [] } });
		await makeDigicertRequest(
			'certcentral',
			'/reports/query',
			'certcentral-secret',
			{
				method: 'POST',
				body: { query: '{order_details{id}}' },
			},
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CERTCENTRAL_BASES.us,
			HEADERS: { 'X-DC-DEVKEY': 'certcentral-secret' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/reports/query',
			method: 'POST',
			body: { query: '{order_details{id}}' },
		});
	});

	it('uses a Bearer access token for CSC OAuth2 operations', async () => {
		mockRequest.mockResolvedValue({ data: { credentials: [] } });
		await makeDigicertRequest(
			'contentTrust',
			'/csc/v1/credentials/list',
			'access-token',
			{
				authScheme: 'oauth_2',
				method: 'POST',
				body: { userID: 'user-123' },
			},
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			HEADERS: { Authorization: 'Bearer access-token' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/csc/v1/credentials/list',
			method: 'POST',
		});
	});

	it('supports the documented India DigiCert ONE region', async () => {
		mockRequest.mockResolvedValue([]);
		await makeDigicertRequest(
			'accountManager',
			'/account/api/v1/locales',
			'one-service-token',
			{ digicertOneRegion: 'in' },
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://one.digicert.co.in',
		});
	});

	it('uses Bearer authorization for documented Content Trust OAuth2 routes', async () => {
		mockRequest.mockResolvedValue({ data: { credentials: [] } });
		await makeDigicertRequest(
			'contentTrust',
			'/csc/v1/credentials/list',
			'access-token',
			{
				authScheme: 'oauth_2',
				method: 'POST',
				body: { userID: 'user-123' },
			},
		);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			HEADERS: { Authorization: 'Bearer access-token' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/csc/v1/credentials/list',
			method: 'POST',
			body: { userID: 'user-123' },
		});
	});

	it('rejects an empty CertCentral key before network I/O', async () => {
		await expect(
			makeDigicertRequest('certcentral', '/user', ''),
		).rejects.toThrow(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('returns certificate download bytes without decoding them as text', async () => {
		const payload = Uint8Array.from([0x30, 0x82, 0x01, 0x00, 0xff, 0x00]);
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response(payload, {
					status: 200,
					headers: { 'Content-Type': 'application/octet-stream' },
				}),
		) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{
						method: 'GET',
						path: { id: 'ca-1' },
						binary: true,
					},
				),
			).resolves.toEqual([0x30, 0x82, 0x01, 0x00, 0xff, 0x00]);
			expect(global.fetch).toHaveBeenCalledWith(
				'https://one.digicert.com/certificate-authority/api/v1/ca/ca-1/download',
				expect.objectContaining({ method: 'GET' }),
			);
			const init = (global.fetch as jest.Mock).mock.calls[0]?.[1] as
				| { headers?: Headers }
				| undefined;
			expect(init?.headers?.get('x-api-key')).toBe('one-token');
			expect(mockRequest).not.toHaveBeenCalled();
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('returns JSON report downloads as bytes even when content type is JSON', async () => {
		const originalFetch = global.fetch;
		const payload = Uint8Array.from([
			0x7b, 0x22, 0x69, 0x64, 0x22, 0x3a, 0x31, 0x7d,
		]);
		global.fetch = jest.fn(
			async () =>
				new Response(payload, {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
		) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'reportLibrary',
					'/report/{report_identifier}/{report_run_identifier}/download',
					'report-key',
					{
						method: 'GET',
						path: {
							report_identifier: 'report-1',
							report_run_identifier: 'run-1',
						},
						query: { report_format: 'JSON' },
						binary: true,
					},
				),
			).resolves.toEqual(Array.from(payload));
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('keeps path parameters inside one encoded URL segment', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response(Uint8Array.from([0x30]), {
					status: 200,
					headers: { 'Content-Type': 'application/octet-stream' },
				}),
		) as typeof fetch;
		try {
			await makeDigicertRequest(
				'privateCA',
				'/certificate-authority/api/v1/ca/{id}/download',
				'one-token',
				{ binary: true, path: { id: '../account/123' } },
			);
			expect(global.fetch).toHaveBeenCalledWith(
				'https://one.digicert.com/certificate-authority/api/v1/ca/..%2Faccount%2F123/download',
				expect.anything(),
			);
			mockRequest.mockResolvedValueOnce({});
			await makeDigicertRequest('certcentral', '/user/{id}', 'key', {
				method: 'GET',
				path: { id: '../account/123' },
			});
			expect(
				mockRequest.mock.calls[0]?.[0]?.ENCODE_PATH?.('../account/123'),
			).toBe('..%2Faccount%2F123');
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{ binary: true, path: { id: '..' } },
				),
			).rejects.toThrow('dot segments');
			expect(global.fetch).toHaveBeenCalledTimes(1);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('cancels a binary stream when it exceeds the limit without Content-Length', async () => {
		const originalFetch = global.fetch;
		const chunk = new Uint8Array(16 * 1024 * 1024);
		let canceled = false;
		const body = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(chunk);
				controller.enqueue(chunk);
				controller.enqueue(new Uint8Array(1));
			},
			cancel() {
				canceled = true;
			},
		});
		global.fetch = jest.fn(
			async () => new Response(body, { status: 200 }),
		) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{ binary: true, path: { id: 'ca-1' } },
				),
			).rejects.toThrow('binary response exceeds');
			expect(canceled).toBe(true);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('does not retry a rate-limited binary write', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response('slow down', {
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'retry-after': '4' },
				}),
		) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{ binary: true, method: 'POST', path: { id: 'ca-1' } },
				),
			).rejects.toMatchObject({ status: 429, retryAfter: 4000 });
			expect(global.fetch).toHaveBeenCalledTimes(1);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('retries binary GETs after 429 and honors Retry-After', async () => {
		const originalFetch = global.fetch;
		const payload = Uint8Array.from([0x30, 0x82, 0xff]);
		global.fetch = jest
			.fn()
			.mockResolvedValueOnce(
				new Response('slow down', {
					status: 429,
					headers: { 'retry-after': '0' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(payload, {
					status: 200,
					headers: { 'Content-Type': 'application/octet-stream' },
				}),
			) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{ binary: true, path: { id: 'ca-1' } },
				),
			).resolves.toEqual([0x30, 0x82, 0xff]);
			expect(global.fetch).toHaveBeenCalledTimes(2);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('caps binary GET retries at three attempts after the initial request', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response('slow down', {
					status: 429,
					headers: { 'retry-after': '0' },
				}),
		) as typeof fetch;
		try {
			await expect(
				makeDigicertRequest(
					'privateCA',
					'/certificate-authority/api/v1/ca/{id}/download',
					'one-token',
					{ binary: true, path: { id: 'ca-1' } },
				),
			).rejects.toMatchObject({ status: 429, retryAfter: 0 });
			expect(global.fetch).toHaveBeenCalledTimes(4);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('passes provider 429 retry metadata without wrapping it', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/user' },
			{
				url: 'https://www.digicert.com/services/v2/user',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 4000 },
		);
		mockRequest.mockRejectedValue(apiError);
		await expect(
			makeDigicertRequest('certcentral', '/user', 'secret'),
		).rejects.toBe(apiError);
	});
});
