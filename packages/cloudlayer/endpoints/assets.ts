import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest } from '../client';
import type { AssetsGetOutput, AssetsListOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/assets/ — GET /v2/assets
export const assetsList: CloudlayerEndpoints['assets']['list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['assets.list'].parse(input);

	const response = await makeCloudlayerRequest<AssetsListOutput>(
		'/assets',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: parsedInput.limit,
				startAfterId: parsedInput.startAfterId,
			},
		},
	);

	const parsed = CloudlayerEndpointOutputSchemas['assets.list'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.assets.list',
		{ count: parsed.length },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/assets/ — GET /v2/assets/:id
export const assetsGet: CloudlayerEndpoints['assets']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput = CloudlayerEndpointInputSchemas['assets.get'].parse(input);

	const response = await makeCloudlayerRequest<AssetsGetOutput>(
		`/assets/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CloudlayerEndpointOutputSchemas['assets.get'].parse(response);

	// The asset's download URL is pre-authenticated, so it is never logged.
	await logEventFromContext(
		ctx,
		'cloudlayer.assets.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};
