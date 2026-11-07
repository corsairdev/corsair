import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const listMidInsights: FidelEndpoints['listMidInsights'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['listMidInsights']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/mid-insights',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.mid-insights.listMidInsights',
		input,
		'completed',
	);
	return response;
};
