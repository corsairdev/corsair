import { AuthMissingError } from 'corsair/core';
import type { RateLimitConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeGorgiasRequest } from './client';
import { gorgiasOperationDefinitions } from './endpoints/definitions';
import type { GorgiasContext } from './index';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function buildContext(
	values: {
		key?: string;
		email?: string | null;
		subdomain?: string | null;
	} = {},
): GorgiasContext {
	const ctx: GorgiasContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: values.key ?? 'private-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(values.key ?? 'private-api-key'),
			set_api_key: () => Promise.resolve(),
			get_email: () => Promise.resolve(values.email ?? 'agent@acme.test'),
			set_email: () => Promise.resolve(),
			get_tenant_external_id: () =>
				Promise.resolve(values.subdomain ?? 'acme-helpdesk'),
			set_tenant_external_id: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

describe('Gorgias client', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('uses Basic Auth credentials and the validated tenant-specific API host', async () => {
		mockedRequest.mockResolvedValue({});
		const ctx = buildContext({ subdomain: 'company_name' });
		const definition = gorgiasOperationDefinitions.account.getAccount;

		await makeGorgiasRequest(ctx, definition, {});

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://company_name.gorgias.com',
				USERNAME: 'agent@acme.test',
				PASSWORD: 'private-api-key',
				WITH_CREDENTIALS: false,
			}),
			expect.objectContaining({ method: 'GET', url: '/api/account' }),
		);
	});

	it('encodes slashes in string path values such as metric card slugs', async () => {
		mockedRequest.mockResolvedValue({});
		const definition = gorgiasOperationDefinitions.metricCards.getMetricCard;

		await makeGorgiasRequest(buildContext(), definition, {
			path: { slug: '../tickets/1' },
		});

		const config = mockedRequest.mock.calls[0]?.[0];
		expect(config?.ENCODE_PATH?.('../tickets/1')).toBe('..%2Ftickets%2F1');
	});

	it('fails with AuthMissingError when the private-app key is empty', async () => {
		await expect(
			makeGorgiasRequest(
				buildContext({ key: '' }),
				gorgiasOperationDefinitions.account.getAccount,
				{},
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid tenant host values before making a request', async () => {
		await expect(
			makeGorgiasRequest(
				buildContext({ subdomain: 'attacker.invalid' }),
				gorgiasOperationDefinitions.account.getAccount,
				{},
			),
		).rejects.toThrow('configured Gorgias subdomain is invalid');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('builds multipart uploads without setting a JSON content type', async () => {
		mockedRequest.mockResolvedValue([]);
		const definition = gorgiasOperationDefinitions.files.uploadFiles;

		await makeGorgiasRequest(buildContext(), definition, {
			body: {
				files: [
					{
						filename: 'receipt.txt',
						contentType: 'text/plain',
						contentBase64: 'SGVsbG8=',
					},
				],
			},
		});

		const requestOptions = mockedRequest.mock.calls[0]?.[1];
		expect(requestOptions?.mediaType).toBeUndefined();
		expect(requestOptions?.body).toBeInstanceOf(FormData);
		const form = requestOptions?.body;
		expect(form).toBeInstanceOf(FormData);
		if (!(form instanceof FormData))
			throw new Error('Expected multipart form data.');
		const file = form.get('receipt.txt');
		expect(file).toBeInstanceOf(Blob);
		if (!(file instanceof Blob))
			throw new Error('Expected uploaded file blob.');
		expect(await file.text()).toBe('Hello');
	});

	it('returns downloaded binary bytes as bounded base64 data', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 255, 1]), {
				headers: { 'content-type': 'image/png' },
			}),
		);
		try {
			const result = await makeGorgiasRequest(
				buildContext(),
				gorgiasOperationDefinitions.files.downloadFile,
				{
					path: {
						file_type: 'attachment',
						domain_hash: 'safe-hash',
						resource_name: 'file.png',
					},
				},
			);
			expect(result).toEqual({
				kind: 'binary',
				contentType: 'image/png',
				base64: 'AP8B',
				sizeBytes: 3,
			});
			expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
				'https://acme-helpdesk.gorgias.com/api/attachment/download/safe-hash/file.png',
			);
			expect(fetchSpy.mock.calls[0]?.[1]?.redirect).toBe('follow');
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('honors Retry-After on binary-download rate limits', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('rate limited', {
					status: 429,
					headers: { 'retry-after': '0' },
				}),
			)
			.mockResolvedValueOnce(new Response(new Uint8Array([1])));
		try {
			const result = await makeGorgiasRequest(
				buildContext(),
				gorgiasOperationDefinitions.files.downloadFile,
				{
					path: {
						file_type: 'attachment',
						domain_hash: 'safe-hash',
						resource_name: 'file.png',
					},
				},
			);
			expect(fetchSpy).toHaveBeenCalledTimes(2);
			expect(result).toEqual({
				kind: 'binary',
				contentType: 'application/octet-stream',
				base64: 'AQ==',
				sizeBytes: 1,
			});
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('redacts private message fields from propagated ApiError data without losing status', async () => {
		const providerError = new ApiError(
			{
				method: 'POST',
				url: '/api/tickets',
				body: {
					customer: { email: 'person@acme.test' },
					message: 'private text',
				},
			},
			{
				url: 'https://acme-helpdesk.gorgias.com/api/tickets',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { detail: 'person@acme.test private text' },
			},
			'Provider echoed private data',
		);
		mockedRequest.mockRejectedValue(providerError);

		// `unknown` because a rejected request can carry any runtime value.
		const caught: unknown = await makeGorgiasRequest(
			buildContext(),
			gorgiasOperationDefinitions.tickets.createTicket,
			{ body: { subject: 'private text' } },
		).catch((error: unknown) => error);
		if (!(caught instanceof ApiError))
			throw new Error('Expected Corsair ApiError.');
		expect(caught).toBe(providerError);
		expect(caught.status).toBe(422);
		expect(caught.message).toBe('Gorgias request failed with HTTP 422.');
		expect(caught.body).toBe('[REDACTED]');
		expect(caught.request).toEqual({ method: 'POST', url: '/api/tickets' });
		expect(JSON.stringify(caught)).not.toContain('person@acme.test');
		expect(JSON.stringify(caught)).not.toContain('private text');
		expect(caught.stack).not.toContain('person@acme.test');
		expect(caught.stack).not.toContain('private text');
	});

	it('preserves Retry-After metadata from the real Corsair transport', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': '1' },
			}),
		);
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		try {
			// `unknown` because the real transport rejects provider responses as runtime errors.
			const result: unknown = await actualRequest(
				{
					BASE: 'https://acme-helpdesk.gorgias.com',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
				},
				{ method: 'GET', url: '/api/account' },
				{ rateLimitConfig },
			).catch((error: unknown) => error);
			if (!(result instanceof ApiError))
				throw new Error('Expected a rate-limit ApiError.');
			expect(result.status).toBe(429);
			expect(result.retryAfter).toBe(1000);
			expect(fetchSpy).toHaveBeenCalledTimes(1);
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
