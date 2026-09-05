import { logEventFromContext } from 'corsair/core';
import type { CdrPlatformEndpoints } from '..';
import { makeCdrPlatformRequest } from '../client';
import {
	CdrPlatformEndpointInputSchemas,
	CdrPlatformEndpointOutputSchemas,
} from './types';

export const check: CdrPlatformEndpoints['healthCheck'] = async (
	ctx,
	input,
) => {
	const parsedInput = CdrPlatformEndpointInputSchemas.healthCheck.parse(input);
	const rawResponse = await makeCdrPlatformRequest('health/', ctx.key, {
		method: 'GET',
	});
	const response =
		CdrPlatformEndpointOutputSchemas.healthCheck.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'cdrplatform.health.check',
		parsedInput,
		'completed',
	);

	return response;
};
