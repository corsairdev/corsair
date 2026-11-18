import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { VercelTeamSchema } from '../schema/database';
import { getTeam, getTeamMembers, getTeams } from './teams';

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

const upsert = jest.fn();
const makeCtx = (
	options: { teamId?: string } = {},
	storedTeam: string | null = null,
) =>
	({
		key: 'test-token',
		options,
		keys: { get_team_id: async () => storedTeam },
		db: { teams: { upsertByEntityId: upsert } },
	}) as unknown as VercelContext;

const team = {
	id: 'team_1',
	slug: 'acme',
	name: null,
	avatar: null,
	createdAt: 1,
	updatedAt: 2,
	limited: false,
	membership: { uid: 'u1', role: 'OWNER', confirmed: true, createdAt: 1 },
	platformVersion: null,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('teams', () => {
	it('getTeams pages without a team scope and stores teams the store accepts', async () => {
		const ctx = makeCtx({ teamId: 'team_default' });
		request.mockResolvedValueOnce({
			teams: [
				team,
				{ id: 'team_2', slug: 'other', name: 'Other', limited: true },
			],
			pagination: { count: 2, next: null, prev: 5 },
		});
		const result = await getTeams(ctx, { limit: 20, until: 10 });
		expect(request).toHaveBeenCalledWith('/v2/teams', ctx, {
			teamScope: false,
			query: { limit: 20, until: 10 },
		});
		expect(result.teams[0]?.membership?.role).toBe('OWNER');
		expect(result.teams[0]?.platformVersion).toBeNull();
		expect(result.teams[1]?.limited).toBe(true);
		expect(result.pagination?.prev).toBe(5);
		expect(upsert).toHaveBeenCalledTimes(2);
		// A null team name is left out: the store types it as a string.
		expect(upsert.mock.calls[0]?.[1]).not.toHaveProperty('name');
		for (const [, record] of upsert.mock.calls) {
			expect(() => VercelTeamSchema.parse(record)).not.toThrow();
		}
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.teams.getTeams',
			{ limit: 20, until: 10 },
			'completed',
		);
	});

	it('getTeams rejects a page size over 100 before calling Vercel', async () => {
		await expect(getTeams(makeCtx(), { limit: 500 })).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getTeam puts the given team (id or slug) in the path, not the query', async () => {
		const ctx = makeCtx({ teamId: 'team_default' });
		request.mockResolvedValueOnce(team);
		const result = await getTeam(ctx, { teamId: 'acme' });
		expect(request).toHaveBeenCalledWith('/v2/teams/acme', ctx, {
			teamScope: false,
		});
		expect(result.id).toBe('team_1');
		expect(upsert).toHaveBeenCalledWith('team_1', expect.any(Object));
	});

	it('getTeam falls back to the connection’s stored team, then the plugin option', async () => {
		request.mockResolvedValue(team);
		const stored = makeCtx({ teamId: 'team_default' }, 'team_stored');
		await getTeam(stored, {});
		expect(request).toHaveBeenLastCalledWith('/v2/teams/team_stored', stored, {
			teamScope: false,
		});

		const optionOnly = makeCtx({ teamId: 'team_default' });
		await getTeam(optionOnly, {});
		expect(request).toHaveBeenLastCalledWith(
			'/v2/teams/team_default',
			optionOnly,
			{ teamScope: false },
		);
	});

	it('getTeam without any team throws before calling Vercel', async () => {
		await expect(getTeam(makeCtx(), {})).rejects.toThrow(/pass teamId/);
		expect(request).not.toHaveBeenCalled();
	});

	it('getTeam rejects a response without an id', async () => {
		request.mockResolvedValueOnce({ slug: 'acme' });
		await expect(getTeam(makeCtx(), { teamId: 'team_1' })).rejects.toThrow();
	});

	it('getTeamMembers sends filters, tolerates an empty pagination block and keeps the search out of the log', async () => {
		const ctx = makeCtx({}, 'team_stored');
		request.mockResolvedValueOnce({
			members: [
				{
					uid: 'u1',
					email: 'person@example.com',
					role: 'OWNER',
					confirmed: true,
					name: null,
					mfaEnabled: true,
				},
			],
			pagination: {},
			totalCount: 1,
		});
		const result = await getTeamMembers(ctx, {
			limit: 5,
			role: 'OWNER',
			search: 'person@example.com',
			excludeProject: 'prj_1',
		});
		expect(request).toHaveBeenCalledWith('/v3/teams/team_stored/members', ctx, {
			teamScope: false,
			query: {
				limit: 5,
				search: 'person@example.com',
				role: 'OWNER',
				excludeProject: 'prj_1',
			},
		});
		expect(result.members[0]?.email).toBe('person@example.com');
		expect(result.members[0]?.mfaEnabled).toBe(true);
		expect(result.totalCount).toBe(1);
		const loggedInput = logEvent.mock.calls[0]?.[2];
		expect(loggedInput).toEqual({
			limit: 5,
			role: 'OWNER',
			excludeProject: 'prj_1',
		});
		expect(JSON.stringify(loggedInput)).not.toContain('person@example.com');
	});

	it('getTeamMembers uses an explicit team in the path', async () => {
		const ctx = makeCtx({ teamId: 'team_default' });
		request.mockResolvedValueOnce({
			members: [],
			pagination: { hasNext: false },
		});
		await getTeamMembers(ctx, { teamId: 'team_9' });
		expect(request).toHaveBeenCalledWith('/v3/teams/team_9/members', ctx, {
			teamScope: false,
			query: {},
		});
	});

	it('getTeamMembers rejects an unknown role before calling Vercel', async () => {
		await expect(
			getTeamMembers(makeCtx({ teamId: 'team_1' }), {
				role: 'ADMIN',
			} as unknown as Parameters<typeof getTeamMembers>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
