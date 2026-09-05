import { logEventFromContext } from 'corsair/core';
import type { CdrPlatformEndpoints } from '..';
import { makeCdrPlatformRequest } from '../client';
import {
	CdrPlatformEndpointInputSchemas,
	CdrPlatformEndpointOutputSchemas,
} from './types';

export const get: CdrPlatformEndpoints['certificateGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CdrPlatformEndpointInputSchemas.certificateGet.parse(input);
	const rawResponse = await makeCdrPlatformRequest(
		`v1/certificate/${parsedInput.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	const response =
		CdrPlatformEndpointOutputSchemas.certificateGet.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'cdrplatform.certificate.get',
		{ certificate_id: parsedInput.id },
		'completed',
	);

	return response;
};
