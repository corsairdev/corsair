import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { RetailedContext } from '..';
import { makeRetailedRequest } from '../client';
import type { RetailedEndpointInputs, RetailedEndpointOutputs } from './types';
import { RetailedEndpointOutputSchemas } from './types';

export const get: CorsairEndpoint<
	RetailedContext,
	RetailedEndpointInputs['getUsage'],
	RetailedEndpointOutputs['getUsage']
> = async (ctx) => {
	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['getUsage']
	>('usage', ctx.key, {
		method: 'GET',
	});

	const parsed = RetailedEndpointOutputSchemas.getUsage.parse(response);

	await logEventFromContext(ctx, 'retailed.usage.get', {}, 'completed');

	return parsed;
};
