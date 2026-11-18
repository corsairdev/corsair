import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const MEMBER = {
	memberId: 'member-1',
	userId: 'user-1',
	email: 'jane@example.com',
	name: 'Jane Doe',
	role: 'admin',
	accepted: true,
	acceptedAt: '2026-10-14T22:27:04.869Z',
	createdAt: '2026-10-14T22:27:04.869Z',
	invitedAt: '2026-10-14T22:27:04.869Z',
};

const TEAM = {
	_id: 'team-1',
	name: 'Sales team',
	createdAt: '2026-10-14T22:27:04.869Z',
	modifiedAt: '2026-10-14T22:27:36.768Z',
	members: [MEMBER],
};

describe('Mixmax teams endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('teams.list sends GET /v1/teams with documented query params', async () => {
		const page = { results: [TEAM], hasNext: false, hasPrevious: false };
		request.mockResolvedValue(page);
		const result = await endpoints.teams.list(ctx, {
			expand: 'members,members.userId',
			accessThrough: 'myself',
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams', {
			method: 'GET',
			query: {
				expand: 'members,members.userId',
				accessThrough: 'myself',
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('teams.create posts /v1/teams with the documented body', async () => {
		request.mockResolvedValue(TEAM);
		const result = await endpoints.teams.create(ctx, {
			name: 'Sales team',
			members: [{ email: 'john@example.com', role: 'member' }],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams', {
			method: 'POST',
			body: {
				name: 'Sales team',
				orgId: undefined,
				members: [{ email: 'john@example.com', role: 'member' }],
			},
		});
		expect(result).toEqual(TEAM);
	});

	it('teams.get sends GET /v1/teams/:id with the expand query', async () => {
		request.mockResolvedValue(TEAM);
		const result = await endpoints.teams.get(ctx, {
			id: 'team-1',
			expand: 'members',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams/team-1', {
			method: 'GET',
			query: {
				expand: 'members',
			},
		});
		expect(result).toEqual(TEAM);
	});

	it('teams.update patches /v1/teams/:id with the name body and reads the _id string', async () => {
		// The provider answers with the team's `_id` as a JSON string.
		request.mockResolvedValue('team-1');
		const result = await endpoints.teams.update(ctx, {
			id: 'team-1',
			name: 'Sales team EMEA',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams/team-1', {
			method: 'PATCH',
			body: {
				name: 'Sales team EMEA',
			},
		});
		expect(result).toBe('team-1');
	});

	it('teams.delete sends DELETE /v1/teams/:id', async () => {
		const result = await endpoints.teams.delete(ctx, { id: 'team-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams/team-1', {
			method: 'DELETE',
		});
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('teams.members.list sends GET /v1/teams/:id/members and reads the results envelope', async () => {
		const response = { results: [MEMBER] };
		request.mockResolvedValue(response);
		const result = await endpoints.teams.members.list(ctx, {
			id: 'team-1',
			expand: 'members.userId',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams/team-1/members', {
			method: 'GET',
			query: {
				expand: 'members.userId',
			},
		});
		expect(result).toEqual(response);
	});

	it('teams.members.add posts /v1/teams/:id/members with the invites body', async () => {
		const added = [MEMBER, { ...MEMBER, memberId: 'member-2' }];
		request.mockResolvedValue(added);
		const result = await endpoints.teams.members.add(ctx, {
			id: 'team-1',
			members: [{ email: 'john@example.com', role: 'member' }],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/teams/team-1/members', {
			method: 'POST',
			body: {
				members: [{ email: 'john@example.com', role: 'member' }],
			},
		});
		expect(result).toEqual(added);
	});

	it('teams.members.remove sends DELETE /v1/teams/:id/members/:memberId with both substitutions', async () => {
		// The provider answers with the literal `true`.
		request.mockResolvedValue(true);
		const result = await endpoints.teams.members.remove(ctx, {
			id: 'team-1',
			memberId: 'member-2',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/teams/team-1/members/member-2',
			{
				method: 'DELETE',
			},
		);
		expect(result).toBe(true);
	});

	it('teams.members.update patches /v1/teams/:id/members/:memberId with the role body', async () => {
		// The provider answers with the literal `true`.
		request.mockResolvedValue(true);
		const result = await endpoints.teams.members.update(ctx, {
			id: 'team-1',
			memberId: 'member-2',
			role: 'admin',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/teams/team-1/members/member-2',
			{
				method: 'PATCH',
				body: {
					role: 'admin',
				},
			},
		);
		expect(result).toBe(true);
	});

	it('rejects missing ids and bodies before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.teams.get(ctx, {} as never),
		).rejects.toThrow();
		await expect(endpoints.teams.update(ctx, {} as never)).rejects.toThrow();
		await expect(endpoints.teams.delete(ctx, {} as never)).rejects.toThrow();
		await expect(
			endpoints.teams.members.remove(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.teams.members.update(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe path ids before any request', async () => {
		await expect(endpoints.teams.get(ctx, { id: '../admin' })).rejects.toThrow(
			'Invalid Mixmax id',
		);
		// The second path position names its own parameter, so a crafted
		// memberId cannot slip past the team id's guard message.
		await expect(
			endpoints.teams.members.remove(ctx, {
				id: 'team-1',
				memberId: '../admin',
			}),
		).rejects.toThrow('Invalid Mixmax memberId');
		expect(request).not.toHaveBeenCalled();
	});
});
