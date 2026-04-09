import { logEventFromContext } from 'corsair/core';
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

export const getForTeam: FigmaEndpoints['stylesGetForTeam'] = async (
	ctx,
	input,
) => {
	const { team_id, ...queryParams } = input;
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['stylesGetForTeam']
	>(`v1/teams/${team_id}/styles`, ctx.key, {
		method: 'GET',
		query: { ...queryParams },
	});

	await logEventFromContext(
		ctx,
		'figma.styles.getForTeam',
		{ ...input },
		'completed',
	);
	return result;
};
