import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeThanksIoRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

beforeEach(() => mockedRequest.mockReset());

it('sends the bearer token and exact method, query and JSON body', async () => {
	mockedRequest.mockResolvedValue({ id: 7 });
	await expect(
		makeThanksIoRequest('secret', {
			method: 'POST',
			path: '/recipients',
			query: { page: 2 },
			body: { mailing_list_id: 1, email: 'a@example.com' },
		}),
	).resolves.toEqual({ id: 7 });
	expect(mockedRequest).toHaveBeenCalledWith(
		expect.objectContaining({
			BASE: 'https://api.thanks.io/api/v2',
			HEADERS: { Authorization: 'Bearer secret' },
		}),
		expect.objectContaining({
			method: 'POST',
			url: '/recipients',
			query: { page: 2 },
			body: { mailing_list_id: 1, email: 'a@example.com' },
			mediaType: 'application/json',
		}),
		expect.objectContaining({
			rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
		}),
	);
});

it('rejects missing credentials before making a request', async () => {
	await expect(
		makeThanksIoRequest(' ', { method: 'GET', path: '/orders/list' }),
	).rejects.toBeInstanceOf(AuthMissingError);
	expect(mockedRequest).not.toHaveBeenCalled();
});

it('lets transport errors through unchanged without retrying writes', async () => {
	const failure = new Error('upstream unavailable');
	mockedRequest.mockRejectedValue(failure);
	await expect(
		makeThanksIoRequest('secret', {
			method: 'POST',
			path: '/send/postcard',
			body: {},
		}),
	).rejects.toBe(failure);
	expect(mockedRequest).toHaveBeenCalledTimes(1);
});

it("passes core's ApiError through unchanged so status and body survive", async () => {
	const failure = new ApiError(
		{ method: 'POST', url: '/recipients' },
		{
			url: 'https://api.thanks.io/api/v2/recipients',
			ok: false,
			status: 422,
			statusText: 'Unprocessable Content',
			body: { message: 'The address field is required.' },
		},
		'Unprocessable Content',
	);
	mockedRequest.mockRejectedValue(failure);
	await expect(
		makeThanksIoRequest('secret', { method: 'POST', path: '/recipients' }),
	).rejects.toBe(failure);
	expect(errorHandlers.VALIDATION_ERROR.match(failure)).toBe(true);
	expect(errorHandlers.RATE_LIMIT_ERROR.match(failure)).toBe(false);
});
