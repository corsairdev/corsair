import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const yesnoList: MixmaxEndpoints['yesnoList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['yesnoList']>(
		ctx,
		'/v1/yesno',
		{
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
				fields: input.fields,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.yesno.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const yesnoGet: MixmaxEndpoints['yesnoGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['yesnoGet']>(
		ctx,
		mixmaxPathParameter('/v1/yesno/{id}', 'id', input.id),
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mixmax.yesno.get', { ...input }, 'completed');
	return result;
};
