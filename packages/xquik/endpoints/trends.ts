import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const get: XquikEndpoints['trendsGet'] = async (ctx, input) => {
	const response = await makeXquikRequest<XquikEndpointOutputs['trendsGet']>(
		'/x/trends',
		ctx.key,
		{
			baseUrl: baseUrlFromOptions(ctx.options),
			query: { count: input.count, woeid: input.woeid },
		},
	);

	await logEventFromContext(
		ctx,
		'xquik.trends.get',
		{ woeid: input.woeid ?? 1 },
		'completed',
	);

	return response;
};
