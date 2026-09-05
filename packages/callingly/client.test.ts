import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import {
	CALLINGLY_API_BASE,
	CallinglyAPIError,
	makeCallinglyRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeCallinglyRequest', () => {
	it('sends Bearer token auth and correct base url', async () => {
		mockRequest.mockResolvedValue({ id: '123' });

		await makeCallinglyRequest('leads', 'secret-key');

		const [config, req] = lastCall();
		expect(config.BASE).toBe(CALLINGLY_API_BASE);
		expect(config.TOKEN).toBe('secret-key');
		expect(config.HEADERS).toMatchObject({
			Authorization: 'Bearer secret-key',
			'Content-Type': 'application/json',
		});
		expect(req.url).toBe('/leads');
		expect(req.method).toBe('GET');
	});

	it('includes X-Account-Id header when accountId is provided', async () => {
		mockRequest.mockResolvedValue({ id: '123' });

		await makeCallinglyRequest('calls', 'secret-key', {
			method: 'POST',
			body: { lead_id: '456' },
			accountId: 'acc_999',
		});

		const [config, req] = lastCall();
		expect(config.HEADERS).toMatchObject({
			'X-Account-Id': 'acc_999',
			Authorization: 'Bearer secret-key',
		});
		expect(req.body).toEqual({ lead_id: '456' });
		expect(req.method).toBe('POST');
	});

	it('wraps errors into CallinglyAPIError', async () => {
		mockRequest.mockRejectedValue({
			status: 404,
			message: 'Lead not found',
			body: { detail: 'Not Found' },
		});

		await expect(
			makeCallinglyRequest('leads/999', 'secret-key'),
		).rejects.toThrow(CallinglyAPIError);
	});
});

describe('errorHandlers', () => {
	it('matches 429 rate limit errors', () => {
		const err = new CallinglyAPIError('Rate limit exceeded', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
	});

	it('matches 401 and 403 auth errors', () => {
		const err401 = new CallinglyAPIError('Unauthorized', 401);
		const err403 = new CallinglyAPIError('Forbidden', 403);
		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
	});

	it('matches 404 not found errors', () => {
		const err = new CallinglyAPIError('Lead not found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(err)).toBe(true);
	});

	it('matches 400 validation errors', () => {
		const err = new CallinglyAPIError('Invalid phone number', 400);
		expect(errorHandlers.VALIDATION_ERROR.match(err)).toBe(true);
	});

	it('matches 500 server errors and specifies retry', async () => {
		const err = new CallinglyAPIError('Internal error', 500);
		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.SERVER_ERROR.handler();
		expect(res.maxRetries).toBe(2);
	});
});
