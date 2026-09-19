import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { BonsaiEndpoints } from '..';
import { makeBonsaiRequest } from '../client';
import {
	BonsaiEndpointInputSchemas,
	BonsaiEndpointOutputSchemas,
} from './types';

export const get: BonsaiEndpoints['clustersGet'] = async (ctx, input) => {
	const parsed = BonsaiEndpointInputSchemas.clustersGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('bonsai', 'api_key');
	}
	const response = await makeBonsaiRequest(
		`/clusters/${parsed.slug}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'bonsai.clusters.get',
		{ slug: parsed.slug },
		'completed',
	);
	return BonsaiEndpointOutputSchemas.clustersGet.parse(response);
};

export const Clusters = {
	get,
} as const;
