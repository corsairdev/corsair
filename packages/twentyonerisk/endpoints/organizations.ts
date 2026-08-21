import { logEventFromContext } from 'corsair/core';
import type { TwentyOneRiskEndpoints } from '..';
import { makeTwentyOneRiskRequest } from '../client';
import type { TwentyOneRiskEndpointOutputs } from './types';
import { TwentyOneRiskEndpointOutputSchemas } from './types';

/** `GET /odata/v5/organizations` — organizations visible to the API key. */
export const get: TwentyOneRiskEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeTwentyOneRiskRequest<
		TwentyOneRiskEndpointOutputs['organizationsGet']
	>('organizations', ctx.key, {
		method: 'GET',
		query: input,
		schema: TwentyOneRiskEndpointOutputSchemas.organizationsGet,
	});

	await logEventFromContext(
		ctx,
		'twentyonerisk.organizations.get',
		{ resultCount: response.value.length },
		'completed',
	);

	return response;
};
