import { ApiError } from 'corsair/http';
import { DocusignApiError } from './client';
import { docusignErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	body?: unknown,
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: 'https://demo.docusign.net/restapi/v2.1/accounts/12345/test',
			ok: false,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'Error',
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function docusignError(
	status: number,
	message: string,
	body?: unknown,
	retryAfter?: number,
) {
	return new DocusignApiError(apiError(status, message, body, retryAfter));
}

describe('docusignErrorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches structured 429 errors', () => {
			const error = docusignError(429, 'Too Many Requests', {
				errorCode: 'RATE_LIMIT_EXCEEDED',
			});
			expect(docusignErrorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('retries with the upstream retry delay', async () => {
			const error = docusignError(429, 'Too Many Requests', {}, 2000);
			const result =
				await docusignErrorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(2000);
		});

		it('matches rate-limit messages without a status', () => {
			const error = new Error('RATE_LIMIT_EXCEEDED for this account');
			expect(docusignErrorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('does not retry when status exists without rate limiting', () => {
			const error = docusignError(400, 'field value 429 is invalid');
			expect(docusignErrorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		});

		it('does not match unrelated errors', () => {
			expect(
				docusignErrorHandlers.RATE_LIMIT_ERROR.match(
					docusignError(400, 'Bad request'),
				),
			).toBe(false);
			expect(
				docusignErrorHandlers.RATE_LIMIT_ERROR.match(new Error('boom')),
			).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches structured 401 errors', async () => {
			const error = docusignError(401, 'Unauthorized', {
				errorCode: 'INVALID_AUTHENTICATION',
			});
			expect(docusignErrorHandlers.AUTH_ERROR.match(error)).toBe(true);
			const result = await docusignErrorHandlers.AUTH_ERROR.handler(error);
			expect(result.maxRetries).toBe(0);
		});

		it('matches authentication messages without a status', () => {
			const error = new Error('INVALID_AUTHENTICATION token expired');
			expect(docusignErrorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(
				docusignErrorHandlers.AUTH_ERROR.match(docusignError(403, 'Forbidden')),
			).toBe(false);
			expect(
				docusignErrorHandlers.AUTH_ERROR.match(
					docusignError(500, 'Server error'),
				),
			).toBe(false);
			expect(docusignErrorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(
				false,
			);
		});
	});

	describe('VALIDATION_ERROR', () => {
		it('matches structured 400 errors', async () => {
			const error = docusignError(400, 'Bad request');
			expect(docusignErrorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
			const result =
				await docusignErrorHandlers.VALIDATION_ERROR.handler(error);
			expect(result.maxRetries).toBe(0);
		});

		it('does not match unrelated errors', () => {
			expect(
				docusignErrorHandlers.VALIDATION_ERROR.match(
					docusignError(500, 'Server error'),
				),
			).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('matches everything with no retries', async () => {
			expect(docusignErrorHandlers.DEFAULT.match(new Error('boom'))).toBe(true);
			const result = await docusignErrorHandlers.DEFAULT.handler(
				new Error('boom'),
			);
			expect(result.maxRetries).toBe(0);
		});
	});
});
