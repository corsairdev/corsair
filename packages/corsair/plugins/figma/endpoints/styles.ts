import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const get: FigmaEndpoints['stylesGet'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['stylesGet']>(
		`v1/styles/${input.key}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.styles.get', { ...input }, 'completed');
	return result;
};

export const getForTeam: FigmaEndpoints['stylesGetForTeam'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['stylesGetForTeam']>(
		`v1/teams/${input.team_id}/styles`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page_size: input.page_size,
				after: input.after,
				before: input.before,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.styles.getForTeam', { ...input }, 'completed');
	return result;
};
