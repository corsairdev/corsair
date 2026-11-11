import type { ImageKitEndpoints } from '..';
import { segment } from '../client';
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
			// The query can hold a signed URL's ik-s signature, which grants
			// access to a private file until it expires; keep it out of events.
			log: ({ url }, result) => ({
				url: withoutQuery(url),
				requestId: result.requestId,
			}),
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
			path: `/v1/files/purge/${segment(requestId)}`,
			replaySafe: true,
		}),
	);

function withoutQuery(url: string): string {
	const cut = url.search(/[?#]/);
	return cut === -1 ? url : url.slice(0, cut);
}
