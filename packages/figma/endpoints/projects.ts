import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const getTeamProjects: FigmaEndpoints['projectsGetTeamProjects'] =
	async (ctx, input) => {
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['projectsGetTeamProjects']
		>(`v1/teams/${input.team_id}/projects`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'figma.projects.getTeamProjects',
			{ ...input },
			'completed',
		);
		return result;
	};
