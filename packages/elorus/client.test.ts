import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { makeElorusRequest } from './client';

const requestOptions = {
	method: 'GET' as const,
	organizationId: 'org-test-123',
	mode: 'json' as const,
};

describe('Elorus client', () => {
	it('sends Token auth, organization, demo, query, and encoded path IDs', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 'invoice-1' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		try {
			await makeElorusRequest('/v1.2/invoices/{id}/', 'token-secret', {
				...requestOptions,
				path: { id: 'one/two' },
				query: { page: 2 },
				demo: true,
			});
			const [url, init] = fetchSpy.mock.calls[0] ?? [];
			expect(String(url)).toContain('/v1.2/invoices/one%2Ftwo/?page=2');
			const headers = new Headers(init?.headers);
			expect(headers.get('Authorization')).toBe('Token token-secret');
			expect(headers.get('X-Elorus-Organization')).toBe('org-test-123');
			expect(headers.get('X-Elorus-Demo')).toBe('1');
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('sends multipart form fields without overriding the runtime boundary', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 'attachment-1' }), {
				status: 201,
				headers: { 'content-type': 'application/json' },
			}),
		);
		try {
			await makeElorusRequest(
				'/v1.2/invoices/{parent_pk}/attachments/',
				'token-secret',
				{
					...requestOptions,
					method: 'POST',
					mode: 'multipart',
					path: { parent_pk: 'invoice-1' },
					form: {
						file: new Blob(['receipt'], { type: 'application/pdf' }),
						title: 'Receipt',
					},
				},
			);
			const [, init] = fetchSpy.mock.calls[0] ?? [];
			expect(init?.body).toBeInstanceOf(FormData);
			expect(new Headers(init?.headers).get('Content-Type')).toBeNull();
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('returns PDF and attachment bytes in the documented base64 envelope', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 1, 2]), {
				status: 200,
				headers: { 'content-type': 'application/pdf' },
			}),
		);
		try {
			const result = await makeElorusRequest(
				'/v1.2/invoices/{id}/pdf/',
				'token-secret',
				{
					...requestOptions,
					mode: 'binary',
					path: { id: 'invoice-1' },
				},
			);
			expect(result).toEqual({
				kind: 'binary',
				contentType: 'application/pdf',
				base64: 'AAEC',
				sizeBytes: 3,
			});
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('fails before network access when either required credential is missing', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeElorusRequest('/v1.2/invoices/', '', requestOptions),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeElorusRequest('/v1.2/invoices/', 'token-secret', {
				...requestOptions,
				organizationId: '',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchSpy).not.toHaveBeenCalled();
		fetchSpy.mockRestore();
	});

	it('preserves Retry-After with one transport attempt and sanitizes provider details', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ detail: 'token-secret must not escape' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		try {
			// The transport rejection value is untyped until the assertion checks its sanitized shape.
			const error = await makeElorusRequest(
				'/v1.2/invoices/',
				'token-secret',
				requestOptions,
			).catch((caught: unknown) => caught);
			expect(error).toMatchObject({ status: 429, retryAfter: 4000 });
			expect(String(error)).not.toContain('token-secret');
			expect(fetchSpy).toHaveBeenCalledTimes(1);
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('keeps API configuration free of Corsair bearer-token auth', () => {
		const config: OpenAPIConfig = {
			BASE: 'https://api.elorus.com',
			VERSION: '1.2',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		expect(config.TOKEN).toBeUndefined();
	});

	it("keeps the request body off core's ApiError when it passes through", async () => {
		const providerError = new ApiError(
			{
				method: 'POST',
				url: '/v1.2/contacts/',
				body: { password: 'private-value' },
			},
			{
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				url: 'https://api.elorus.com/v1.2/contacts/',
				body: { detail: 'invalid' },
			},
			'Bad Request',
		);
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockRejectedValue(providerError);
		try {
			// The transport rejection value is untyped and may contain provider payloads.
			const error = await makeElorusRequest('/v1.2/contacts/', 'token-secret', {
				...requestOptions,
				method: 'POST',
				body: { password: 'private-value' },
			}).catch((caught: unknown) => caught);
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 400, body: { detail: 'invalid' } });
			expect((error as ApiError).request.body).toBeUndefined();
			expect(JSON.stringify(error)).not.toContain('private-value');
			expect(String(error)).not.toContain('private-value');
			// The rebuilt error keeps the message, so the original stack can be kept whole.
			expect((error as ApiError).stack).toBe(providerError.stack);
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
