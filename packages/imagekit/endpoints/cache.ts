import type { ImageKitEndpoints } from '..';
import { call } from './call';
import {
	ImageKitEndpointInputSchemas as Inputs,
	ImageKitEndpointOutputSchemas as Outputs,
} from './types';

export const purge: ImageKitEndpoints['cachePurge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cache.purge',
			input: Inputs.cachePurge,
			output: Outputs.cachePurge,
		},
		input,
		({ url }) => ({
			method: 'POST',
			path: '/v1/files/purge',
			body: { url },
		}),
		{
			log: ({ url }, result) => ({ url, requestId: result.requestId }),
		},
	);

export const getPurgeStatus: ImageKitEndpoints['cacheGetPurgeStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'cache.getPurgeStatus',
			input: Inputs.cacheGetPurgeStatus,
			output: Outputs.cacheGetPurgeStatus,
		},
		input,
		({ requestId }) => ({
			method: 'GET',
			path: `/v1/files/purge/${requestId}`,
			replaySafe: true,
		}),
	);
