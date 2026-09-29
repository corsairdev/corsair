import { ApiError } from 'corsair/http';
import { getUploadIframe } from './general';

type Ctx = Parameters<typeof getUploadIframe>[0];

function ctx(): Ctx {
	return {
		key: 'test-api-token',
		$getAccountId: () => 'test-account-id',
		// unknown: fixture omits unrelated runtime context fields.
	} as unknown as Ctx;
}

describe('Cincopa general.getUploadIframe', () => {
	it('fetches HTML and returns a credential-free iframe URL', async () => {
		const html =
			"<iframe src='https://api.cincopa.com/v2/upload.iframe'></iframe>";
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(html, { status: 200 }));

		const result = await getUploadIframe(ctx(), {
			fid: 'fid-1',
		});

		expect(fetchSpy).toHaveBeenCalled();
		const requested = String(fetchSpy.mock.calls[0]?.[0]);
		expect(requested).toContain('api_token=test-api-token');
		expect(result.html).toBe(html);
		expect(result.url).toContain('upload.iframe');
		expect(result.url).toContain('fid=fid-1');
		expect(result.url).not.toContain('api_token');
		expect(result.url).not.toContain('test-api-token');
		fetchSpy.mockRestore();
	});

	it('redacts api tokens echoed in provider HTML', async () => {
		const html =
			"<iframe src='https://api.cincopa.com/v2/upload.iframe?api_token=test-api-token'></iframe>";
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(html, { status: 200 }));

		const result = await getUploadIframe(ctx(), {});

		expect(result.html).not.toContain('test-api-token');
		expect(result.html).toContain('[REDACTED]');
		fetchSpy.mockRestore();
	});

	it('throws ApiError with status and Retry-After on 429', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('slow down', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'Retry-After': '3' },
			}),
		);

		try {
			await getUploadIframe(ctx(), {});
			throw new Error('expected ApiError');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(429);
			expect((error as ApiError).retryAfter).toBe(3000);
		}

		fetchSpy.mockRestore();
	});

	it('throws ApiError with status on 401 auth failures', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('unauthorized', {
				status: 401,
				statusText: 'Unauthorized',
			}),
		);

		try {
			await getUploadIframe(ctx(), {});
			throw new Error('expected ApiError');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
		}

		fetchSpy.mockRestore();
	});
});
