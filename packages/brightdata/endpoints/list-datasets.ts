import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const listDatasets: BrightDataEndpoints['listDatasets'] = async (
	ctx,
	input,
) => {
	const response = await makeBrightDataRequest<unknown>(
		'/datasets/list',
		requireBrightDataKey(ctx.key),
	);
	const parsed = BrightDataEndpointOutputSchemas.listDatasets.parse(response);
	await logEventFromContext(
		ctx,
		'brightdata.list_datasets',
		{ ...input, count: parsed.length },
		'completed',
	);
	return parsed;
};
