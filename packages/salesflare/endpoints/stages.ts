import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listStages: SalesflareEndpoints['listStages'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listStages']
	>(ctx, '/stages', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.stages.listStages',
		input,
		'completed',
	);
	return response;
};

export const retrieveStage: SalesflareEndpoints['retrieveStage'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveStage']
	>(
		ctx,
		salesflarePathParameter('/stages/{stage_id}', 'stage_id', input.stageId),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.stages.retrieveStage',
		input,
		'completed',
	);
	return response;
};
