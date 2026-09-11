import type { ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { PdfcoAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'request failed'): ApiError {
	const result: ApiResult = {
		url: 'https://api.pdf.co/v1/pdf/merge',
		ok: false,
		status,
		statusText: '',
		body: { error: true, message },
	};
	return new ApiError(
		{ method: 'POST', url: '/v1/pdf/merge' },
		result,
		message,
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Pdfco error handlers', () => {
	it('classifies 429 as rate limit', () => {
		expect(classify(apiError(429, 'Too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('classifies 401 and 403 as auth errors', () => {
		expect(classify(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(apiError(403, 'Access forbidden'))).toBe('AUTH_ERROR');
	});

	it('classifies 404 and job-not-found as not found', () => {
		expect(classify(apiError(404, 'Job not found'))).toBe('NOT_FOUND_ERROR');
		expect(classify(new PdfcoAPIError('Job not found'))).toBe(
			'NOT_FOUND_ERROR',
		);
	});

	it('classifies 400 as bad request', () => {
		expect(classify(apiError(400, 'Bad request'))).toBe('BAD_REQUEST_ERROR');
	});

	it('routes anything else to default', () => {
		expect(classify(new Error('some unexpected failure'))).toBe('DEFAULT');
	});

	it('does not re-execute rate-limited endpoints (transport owns 429 retries) and never retries auth failures', async () => {
		const rateLimited = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429),
		);
		expect(rateLimited.maxRetries).toBe(0);
		const auth = await errorHandlers.AUTH_ERROR.handler();
		expect(auth.maxRetries).toBe(0);
	});
});
