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
