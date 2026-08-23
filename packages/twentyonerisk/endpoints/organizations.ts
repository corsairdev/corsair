import { logEventFromContext } from 'corsair/core';
import type { TwentyOneRiskEndpoints } from '..';
import { makeTwentyOneRiskRequest } from '../client';
import type { TwentyOneRiskEndpointOutputs } from './types';
import {
	TwentyOneRiskEndpointInputSchemas,
	TwentyOneRiskEndpointOutputSchemas,
} from './types';

/** `GET /odata/v5/organizations` — organizations visible to the API key. */
export const get: TwentyOneRiskEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	// Endpoint inputs are not parsed by the binder, so an untyped caller could
	// otherwise send a non-positive $top or negative $skip straight to 21RISK.
	// Parsing here also applies the declared coercions.
	// Endpoint inputs are not parsed by the binder, so an untyped caller could
	// otherwise send a non-positive $top or negative $skip straight to 21RISK.
	// Parsing here also applies the declared coercions.
	const query = TwentyOneRiskEndpointInputSchemas.organizationsGet.parse(input);

	const response = await makeTwentyOneRiskRequest<
		TwentyOneRiskEndpointOutputs['organizationsGet']
	>('organizations', ctx.key, {
		method: 'GET',
		query,
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
