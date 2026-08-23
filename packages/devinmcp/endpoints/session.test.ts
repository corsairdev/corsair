import { logEventFromContext } from 'corsair/core';
import { makeDevinMcpRequest } from '../client';
import { create, get, list, sendMessage } from './session';

jest.mock('../client', () => ({
	makeDevinMcpRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = makeDevinMcpRequest as jest.Mock;
const mockedLog = logEventFromContext as jest.Mock;

const ctx = { key: 'test-api-key' } as any;

describe('DevinMcp session endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLog.mockReset();
	});

	it('create calls POST /v1/sessions with the prompt and returns the response', async () => {
		const fakeResponse = {
			session_id: 'devin-123',
			url: 'https://app.devin.ai/sessions/devin-123',
			is_new_session: true,
		};
		mockedRequest.mockResolvedValueOnce(fakeResponse);

		const result = await create(ctx, { prompt: 'Fix the login bug' });

		expect(mockedRequest).toHaveBeenCalledWith('v1/sessions', 'test-api-key', {
			method: 'POST',
			body: { prompt: 'Fix the login bug' },
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'devinmcp.session.create',
			{ prompt: 'Fix the login bug' },
			'completed',
		);
		expect(result).toEqual(fakeResponse);
	});

	it('get calls GET /v1/sessions/{id} and returns the response', async () => {
		const fakeResponse = { session_id: 'devin-123', status_enum: 'running' };
		mockedRequest.mockResolvedValueOnce(fakeResponse);

		const result = await get(ctx, { session_id: 'devin-123' });

		expect(mockedRequest).toHaveBeenCalledWith(
			'v1/sessions/devin-123',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(fakeResponse);
	});

	it('list calls GET /v1/sessions with query params and returns the response', async () => {
		const fakeResponse = {
			sessions: [{ session_id: 'devin-123', status_enum: 'finished' }],
		};
		mockedRequest.mockResolvedValueOnce(fakeResponse);

		const result = await list(ctx, { limit: 10, offset: 0 });

		expect(mockedRequest).toHaveBeenCalledWith('v1/sessions', 'test-api-key', {
			method: 'GET',
			query: { limit: 10, offset: 0 },
		});
		expect(result).toEqual(fakeResponse);
	});

	it('sendMessage calls POST /v1/session/{id}/message and returns the response', async () => {
		const fakeResponse = { success: true };
		mockedRequest.mockResolvedValueOnce(fakeResponse);

		const result = await sendMessage(ctx, {
			session_id: 'devin-123',
			message: 'Please proceed',
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'v1/session/devin-123/message',
			'test-api-key',
			{ method: 'POST', body: { message: 'Please proceed' } },
		);
		expect(result).toEqual(fakeResponse);
	});

	it('propagates errors from the underlying request', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('rate limited'));

		await expect(get(ctx, { session_id: 'devin-123' })).rejects.toThrow(
			'rate limited',
		);
	});
});
