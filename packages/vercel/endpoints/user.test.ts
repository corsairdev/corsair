import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { getUser } from './user';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'test-token',
	options: { teamId: 'team_default' },
	db: {},
} as unknown as VercelContext;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('user', () => {
	it('getUser reads /v2/user without a team scope and keeps new fields', async () => {
		request.mockResolvedValueOnce({
			user: {
				id: 'u1',
				email: 'person@example.com',
				name: null,
				username: 'person',
				avatar: null,
				defaultTeamId: 'team_1',
				softBlock: null,
				mfa: { enabled: true },
			},
		});
		const result = await getUser(ctx, {});
		expect(request).toHaveBeenCalledWith('/v2/user', ctx, { teamScope: false });
		expect(result.user.id).toBe('u1');
		expect(result.user.defaultTeamId).toBe('team_1');
		expect(result.user.mfa).toEqual({ enabled: true });
		// Only the (empty) input is logged, never the returned email.
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.user.getUser',
			{},
			'completed',
		);
	});

	it('getUser accepts the limited user form', async () => {
		request.mockResolvedValueOnce({
			user: {
				id: 'u1',
				limited: true,
				email: 'p@example.com',
				defaultTeamId: null,
			},
		});
		const result = await getUser(ctx, {});
		expect(result.user.limited).toBe(true);
		expect(result.user.defaultTeamId).toBeNull();
	});

	it('getUser rejects a response without the user wrapper', async () => {
		request.mockResolvedValueOnce({ id: 'u1' });
		await expect(getUser(ctx, {})).rejects.toThrow();
	});

	it('getUser rejects a non-object input before calling Vercel', async () => {
		await expect(
			getUser(ctx, 'u1' as unknown as Parameters<typeof getUser>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
