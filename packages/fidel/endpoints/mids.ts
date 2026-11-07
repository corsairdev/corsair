import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const listMids: FidelEndpoints['listMids'] = async (ctx, input) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<FidelEndpointOutputs['listMids']>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/mids',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(ctx, 'fidel.mids.listMids', input, 'completed');
	return response;
};
