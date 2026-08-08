import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const getBalance: AimlApiEndpoints['billingGetBalance'] = async (
	ctx,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['billingGetBalance']
	>(`/v2/billing`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.billingGetBalance,
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.billing.getBalance',
		{ hasBalance: response !== null },
		'completed',
	);
	return response;
};
