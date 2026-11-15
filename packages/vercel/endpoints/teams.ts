import { makeAuthenticatedVercelRequest, resolveTeam, seg } from '../client';
import type { VercelContext } from '../index';
import { defineEndpoint, pickQuery } from './common';
import {
	VercelTeamsInputSchemas as In,
	VercelTeamsOutputSchemas as Out,
} from './teams-types';

type TeamRecord = { id?: unknown; [key: string]: unknown };

// Fields the local store types as non-null; Vercel sends a null name for a
// team without a display name.
const STRICT_FIELDS = ['slug', 'name', 'createdAt'];

async function saveTeam(ctx: VercelContext, team: unknown) {
	const source = team as TeamRecord | undefined;
	if (typeof source?.id !== 'string' || !ctx.db.teams) return;
	const record = Object.fromEntries(
		Object.entries(source).filter(
			([field, value]) => !(value === null && STRICT_FIELDS.includes(field)),
		),
	);
	await ctx.db.teams.upsertByEntityId(source.id, { ...record, id: source.id });
}

/**
 * These routes name the team in the path (an id or a slug both work), so the
 * team comes from the input, else the connected team; with neither there is
 * nothing to ask for.
 */
async function teamForPath(ctx: VercelContext, inputTeamId?: string) {
	const team = await resolveTeam(ctx, inputTeamId);
	if (!team) {
		throw new Error(
			'No team to look up: pass teamId (team_… or the team slug), or connect Vercel with a team.',
		);
	}
	return team;
}

export const getTeams = defineEndpoint({
	event: 'vercel.teams.getTeams',
	input: In.getTeams,
	output: Out.getTeams,
	run: async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<{ teams?: unknown[] }>(
			'/v2/teams',
			ctx,
			{
				teamScope: false,
				query: pickQuery(input, ['limit', 'since', 'until']),
			},
		);
		for (const team of result?.teams ?? []) await saveTeam(ctx, team);
		return result;
	},
});

export const getTeam = defineEndpoint({
	event: 'vercel.teams.getTeam',
	input: In.getTeam,
	output: Out.getTeam,
	run: async (ctx, input) => {
		const team = await teamForPath(ctx, input.teamId);
		const result = await makeAuthenticatedVercelRequest(
			`/v2/teams/${seg(team)}`,
			ctx,
			{ teamScope: false },
		);
		await saveTeam(ctx, result);
		return result;
	},
});

export const getTeamMembers = defineEndpoint({
	event: 'vercel.teams.getTeamMembers',
	input: In.getTeamMembers,
	output: Out.getTeamMembers,
	run: async (ctx, input) => {
		const team = await teamForPath(ctx, input.teamId);
		return makeAuthenticatedVercelRequest(
			`/v3/teams/${seg(team)}/members`,
			ctx,
			{
				teamScope: false,
				query: pickQuery(input, [
					'limit',
					'since',
					'until',
					'search',
					'role',
					'excludeProject',
					'eligibleMembersForProjectId',
				]),
			},
		);
	},
	// A search term can be someone's email address.
	logInput: ({ search: _search, ...rest }) => rest,
});
