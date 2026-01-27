import { logEventFromContext } from '../../utils/events';
import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type { TeamGetResponse, TeamsListResponse } from './types';

const TEAMS_LIST_QUERY = `
  query Teams($first: Int!, $after: String) {
    teams(first: $first, after: $after) {
      nodes {
        id
        name
        key
        description
        icon
        color
        private
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const TEAM_GET_QUERY = `
  query Team($id: String!) {
    team(id: $id) {
      id
      name
      key
      description
      icon
      color
      private
      createdAt
      updatedAt
    }
  }
`;

export const list: LinearEndpoints['teamsList'] = async (ctx, input) => {
	const response = await makeLinearRequest<TeamsListResponse>(
		TEAMS_LIST_QUERY,
		ctx.options.credentials.apiKey,
		{
			first: input.first || 50,
			after: input.after,
		},
	);

	const result = response.teams;

	if (result.nodes && ctx.db.teams) {
		try {
			for (const team of result.nodes) {
				await ctx.db.teams.upsert(team.id, {
					id: team.id,
					name: team.name,
					key: team.key,
					description: team.description,
					icon: team.icon,
					color: team.color,
					private: team.private,
					createdAt: new Date(team.createdAt),
					updatedAt: new Date(team.updatedAt),
					archivedAt: team.archivedAt,
				});
			}
		} catch (error) {
			console.warn('Failed to save teams to database:', error);
		}
	}

	await logEventFromContext(ctx, 'linear.teams.list', { ...input }, 'completed');
	return result;
};

export const get: LinearEndpoints['teamsGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<TeamGetResponse>(
		TEAM_GET_QUERY,
		ctx.options.credentials.apiKey,
		{ id: input.id },
	);

	const result = response.team;

	if (result && ctx.db.teams) {
		try {
			await ctx.db.teams.upsert(result.id, {
				id: result.id,
				name: result.name,
				key: result.key,
				description: result.description,
				icon: result.icon,
				color: result.color,
				private: result.private,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archivedAt: result.archivedAt,
			});
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(ctx, 'linear.teams.get', { ...input }, 'completed');
	return result;
};
