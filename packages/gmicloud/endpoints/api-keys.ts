import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const getCurrent: GmicloudEndpoints['apiKeysGetCurrent'] = async (
	ctx,
	input,
) => {
	GmicloudEndpointInputSchemas.apiKeysGetCurrent.parse(input);
	const result = GmicloudEndpointOutputSchemas.apiKeysGetCurrent.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/me/api-keys/current',
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.apiKeys.getCurrent',
		{},
		'completed',
	);
	return result;
};
