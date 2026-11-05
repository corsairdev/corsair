import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	ClientaryAPIError,
	getClientaryBaseUrl,
	getClientaryCredentials,
	makeClientaryRequest,
	tryGetStoredValue,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as unknown as jest.Mock;

describe('getClientaryBaseUrl', () => {
	it('builds the v2 URL for a subdomain', () => {
		expect(getClientaryBaseUrl('acme')).toBe(
			'https://acme.clientary.com/api/v2',
		);
	});

	it('preserves dashes in the subdomain', () => {
		expect(getClientaryBaseUrl('my-account')).toBe(
			'https://my-account.clientary.com/api/v2',
		);
	});

	it.each(['evil.com/foo', '169.254.169.254', 'acme?x', 'acme#frag', '-acme'])(
		'rejects %s as a subdomain',
		(domain) => {
			expect(() => getClientaryBaseUrl(domain)).toThrow(/invalid/);
		},
	);
});

describe('tryGetStoredValue', () => {
	it('returns the value when the getter resolves', async () => {
		await expect(
			tryGetStoredValue(() => Promise.resolve('acme')),
		).resolves.toBe('acme');
	});

	it('returns undefined when the getter resolves to null', async () => {
		await expect(
			tryGetStoredValue(() => Promise.resolve(null)),
		).resolves.toBeUndefined();
	});

	it('swallows the "no dek found" error (account has no DEK yet)', async () => {
		await expect(
			tryGetStoredValue(() =>
				Promise.reject(
					new Error(
						'No DEK found for account (tenant: "t", integration: "clientary")',
					),
				),
			),
		).resolves.toBeUndefined();
	});

	it('propagates any other error (decryption failure, db error, ...)', async () => {
		const boom = new Error('database is down');
		await expect(tryGetStoredValue(() => Promise.reject(boom))).rejects.toBe(
			boom,
		);
	});
});

describe('getClientaryCredentials', () => {
	it('uses the key from ctx and the domain option', async () => {
		const creds = await getClientaryCredentials({
			key: 'token-123',
			options: { domain: 'acme' },
		});
		expect(creds).toEqual({ apiKey: 'token-123', domain: 'acme' });
	});

	it('falls back to the stored account domain when no option is set', async () => {
		const creds = await getClientaryCredentials({
			key: 'token-123',
			keys: { get_domain: () => Promise.resolve('stored-co') },
		});
		expect(creds.domain).toBe('stored-co');
	});

	it('prefers the domain option over the stored domain', async () => {
		const creds = await getClientaryCredentials({
			key: 'token-123',
			options: { domain: 'option-co' },
			keys: { get_domain: () => Promise.resolve('stored-co') },
		});
		expect(creds.domain).toBe('option-co');
	});

	it('throws AuthMissingError when no API key is present', async () => {
		await expect(
			getClientaryCredentials({ options: { domain: 'acme' } }),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws a helpful error when no domain can be resolved', async () => {
		await expect(
			getClientaryCredentials({
				key: 'token-123',
				keys: { get_domain: () => Promise.resolve(null) },
			}),
		).rejects.toThrow(/subdomain is not configured/);
	});

	it('rejects a stored domain that is not a single DNS label', async () => {
		await expect(
			getClientaryCredentials({
				key: 'token-123',
				keys: { get_domain: () => Promise.resolve('evil.com/foo') },
			}),
		).rejects.toThrow(/invalid/);
	});

	it('treats a missing DEK as "no stored domain"', async () => {
		await expect(
			getClientaryCredentials({
				key: 'token-123',
				keys: {
					get_domain: () =>
						Promise.reject(
							new Error(
								'No DEK found for account (tenant: "t", integration: "clientary")',
							),
						),
				},
			}),
		).rejects.toThrow(/subdomain is not configured/);
	});
});

describe('makeClientaryRequest', () => {
	beforeEach(() => mockRequest.mockReset());

	it('uses Basic auth with the token as both username and password', async () => {
		mockRequest.mockResolvedValueOnce({ ok: true });

		await makeClientaryRequest('clients', 'secret-token', 'acme');

		const [config] = mockRequest.mock.calls[0]!;
		expect(config.BASE).toBe('https://acme.clientary.com/api/v2');
		expect(config.USERNAME).toBe('secret-token');
		expect(config.PASSWORD).toBe('secret-token');
		expect(config.HEADERS.Accept).toBe('application/json');
	});

	it('sends JSON bodies for POST/PUT and none for GET', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeClientaryRequest('clients', 't', 'acme', {
			method: 'POST',
			body: { client: { name: 'Acme' } },
		});
		await makeClientaryRequest('clients', 't', 'acme', { method: 'GET' });

		const postOptions = mockRequest.mock.calls[0]![1];
		const getOptions = mockRequest.mock.calls[1]![1];
		expect(postOptions.method).toBe('POST');
		expect(postOptions.body).toEqual({ client: { name: 'Acme' } });
		expect(getOptions.method).toBe('GET');
		expect(getOptions.body).toBeUndefined();
	});

	it('passes query parameters through', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeClientaryRequest('clients', 't', 'acme', {
			query: { page: 1, page_size: 50, updated_since: '2024-01-01' },
		});

		const [, requestOptions] = mockRequest.mock.calls[0]!;
		expect(requestOptions.query).toEqual({
			page: 1,
			page_size: 50,
			updated_since: '2024-01-01',
		});
	});

	it('wraps ApiError into ClientaryAPIError preserving status and body', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'clients' },
			{
				url: 'https://acme.clientary.com/api/v2/clients',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'slow down' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		const error = (await makeClientaryRequest('clients', 't', 'acme').catch(
			(e) => e,
		)) as ClientaryAPIError;

		expect(error).toBeInstanceOf(ClientaryAPIError);
		expect(error.status).toBe(429);
		expect(error.statusText).toBe('Too Many Requests');
		expect(error.body).toEqual({ error: 'slow down' });
	});

	it('wraps non-ApiError failures too', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		const error = (await makeClientaryRequest('clients', 't', 'acme').catch(
			(e) => e,
		)) as ClientaryAPIError;

		expect(error).toBeInstanceOf(ClientaryAPIError);
		expect(error.message).toContain('network down');
	});
});
