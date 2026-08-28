import { logEventFromContext } from 'corsair/core';
import type { DevinMcpContext } from '..';
import { makeDevinMcpRequest } from '../client';
import { create, get, list, sendMessage } from './session';
import { DevinMcpEndpointOutputSchemas, SessionResponseSchema } from './types';

jest.mock('../client', () => ({
	makeDevinMcpRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = makeDevinMcpRequest as jest.Mock;
const mockedLog = logEventFromContext as jest.Mock;

const ctx = { key: 'test-api-key' } as DevinMcpContext;

const session = {
	session_id: 'devin-123',
	url: 'https://app.devin.ai/sessions/devin-123',
	status: 'running',
	tags: [] as string[],
	org_id: 'org-abc',
	created_at: 1_700_000_000,
	updated_at: 1_700_000_100,
	acus_consumed: 0,
	pull_requests: [] as { url?: string }[],
	title: null,
	status_detail: null,
};

describe('DevinMcp session endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLog.mockReset();
	});

	it('accepts a documented session payload with null title and extra fields', () => {
		const parsed = SessionResponseSchema.safeParse({
			...session,
			messages: [],
			status_enum: null,
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.title).toBeNull();
			expect(parsed.data.status).toBe('running');
		}
	});

	it('create calls POST /v3/organizations/{org}/sessions and returns the session', async () => {
		mockedRequest.mockResolvedValueOnce(session);

		const input = { org_id: 'org-abc', prompt: 'Fix the login bug' };
		const result = await create(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'v3/organizations/org-abc/sessions',
			'test-api-key',
			{
				method: 'POST',
				body: { prompt: 'Fix the login bug' },
			},
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'devinmcp.session.create',
			input,
			'completed',
		);
		expect(result).toEqual(session);
		expect(
			DevinMcpEndpointOutputSchemas.createSession.safeParse(result).success,
		).toBe(true);
	});

	it('get encodes the session id on GET /v3/organizations/{org}/sessions/{id}', async () => {
		mockedRequest.mockResolvedValueOnce(session);

		const input = { org_id: 'org-abc', session_id: 'devin/123' };
		const result = await get(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'v3/organizations/org-abc/sessions/devin%2F123',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'devinmcp.session.get',
			input,
			'completed',
		);
		expect(result).toEqual(session);
	});

	it('list calls GET /v3/organizations/{org}/sessions with serialized qs filters', async () => {
		const fakeResponse = {
			items: [session],
			end_cursor: null,
			has_next_page: false,
		};
		mockedRequest.mockResolvedValueOnce(fakeResponse);

		const input = {
			org_id: 'org-abc',
			first: 10,
			after: 'cursor-1',
			tags: ['ci'],
		};
		const result = await list(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'v3/organizations/org-abc/sessions',
			'test-api-key',
			{
				method: 'GET',
				query: {
					qs: JSON.stringify({ first: 10, after: 'cursor-1', tags: ['ci'] }),
				},
			},
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'devinmcp.session.list',
			input,
			'completed',
		);
		expect(result).toEqual(fakeResponse);
		expect(
			DevinMcpEndpointOutputSchemas.listSessions.safeParse(result).success,
		).toBe(true);
	});

	it('sendMessage calls POST /v3/organizations/{org}/sessions/{id}/messages', async () => {
		mockedRequest.mockResolvedValueOnce(session);

		const input = {
			org_id: 'org-abc',
			session_id: 'devin-123',
			message: 'Please proceed',
		};
		const result = await sendMessage(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'v3/organizations/org-abc/sessions/devin-123/messages',
			'test-api-key',
			{ method: 'POST', body: { message: 'Please proceed' } },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'devinmcp.session.sendMessage',
			input,
			'completed',
		);
		expect(result).toEqual(session);
		expect(
			DevinMcpEndpointOutputSchemas.sendMessage.safeParse(result).success,
		).toBe(true);
	});

	it('propagates errors from the underlying request', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('rate limited'));

		await expect(
			get(ctx, { org_id: 'org-abc', session_id: 'devin-123' }),
		).rejects.toThrow('rate limited');
	});
});
