import { ApiError } from 'corsair/http';
import { makeElorusRequest } from './client';
import { errorHandlers } from './error-handlers';

// unknown: the mocked provider bodies are arbitrary JSON, success or error.
function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

describe('Elorus provider errors', () => {
	it("passes core's ApiError through with its status and the provider's validation body", async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				jsonResponse({ client: ['This field is required.'] }, 400),
			);
		try {
			const error = await makeElorusRequest('/v1.2/invoices/', 'token', {
				method: 'POST',
				body: { items: [] },
				organizationId: 'org',
				mode: 'json',
			}).catch((caught: unknown) => caught);
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({
				status: 400,
				body: { client: ['This field is required.'] },
			});
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error as Error)).toBe(true);
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('leaves the sent body and query off the ApiError', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ detail: 'Invalid input.' }, 400));
		try {
			const error = await makeElorusRequest('/v1.2/contacts/', 'token', {
				method: 'POST',
				body: { email: 'customer@example.com', company: 'Private Co' },
				query: { search: 'Private Co' },
				organizationId: 'org',
				mode: 'json',
			}).catch((caught: unknown) => caught);
			expect(error).toBeInstanceOf(ApiError);
			const apiError = error as ApiError;
			expect(apiError.status).toBe(400);
			expect(apiError.request.body).toBeUndefined();
			expect(apiError.request.query).toBeUndefined();
			expect(apiError.request.formData).toBeUndefined();
			const serialized = JSON.stringify({
				...apiError,
				message: apiError.message,
			});
			expect(serialized).not.toContain('customer@example.com');
			expect(serialized).not.toContain('Private');
			expect(serialized).not.toContain('token');
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('matches ApiError statuses in every handler', async () => {
		const apiError = (status: number) =>
			new ApiError(
				{ method: 'GET', url: '/v1.2/invoices/' },
				{
					ok: false,
					status,
					statusText: '',
					url: 'https://api.elorus.com/v1.2/invoices/',
					body: {},
				},
				'failed',
				status === 429 ? { retryAfter: 2000 } : undefined,
			);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError(429)),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 2000 });
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(422))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(502))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(400))).toBe(false);
	});
});
