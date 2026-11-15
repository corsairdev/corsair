import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const retrieveMid: FidelEndpoints['retrieveMid'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['retrieveMid']>(
		ctx,
		fidelPathParameter(
			fidelPathParameter(
				'/v1/programs/{programId}/mids/{midId}',
				'programId',
				input.programId,
			),
			'midId',
			input.midId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'fidel.mids.retrieveMid', input, 'completed');
	return response;
};

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
