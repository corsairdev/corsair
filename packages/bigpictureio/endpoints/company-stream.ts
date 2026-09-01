import { logEventFromContext } from 'corsair/core';
import type { BigpictureioEndpoints } from '..';
import {
	BIGPICTUREIO_STREAM_TIMEOUT_MS,
	makeBigpictureioRequest,
} from '../client';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './types';

export const stream: BigpictureioEndpoints['companyStream'] = async (
	ctx,
	input,
) => {
	const parsed = BigpictureioEndpointInputSchemas.companyStream.parse(input);
	const response = await makeBigpictureioRequest<unknown>(
		'/v1/companies/find/stream',
		ctx.key,
		{
			method: 'GET',
			query: {
				domain: parsed.domain,
			},
			timeoutMs: BIGPICTUREIO_STREAM_TIMEOUT_MS,
			acceptPending: true,
		},
	);
	const output = BigpictureioEndpointOutputSchemas.companyStream.parse(
		response ?? {},
	);
	await logEventFromContext(
		ctx,
		'bigpictureio.company.stream',
		{ domain: parsed.domain },
		'completed',
	);
	return output;
};
