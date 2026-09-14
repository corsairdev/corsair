import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const filterDataset: BrightDataEndpoints['filterDataset'] = async (
	ctx,
	input,
) => {
	const response = await makeBrightDataRequest<unknown>(
		'/datasets/filter',
		requireBrightDataKey(ctx.key),
		{
			method: 'POST',
			body: {
				dataset_id: input.dataset_id,
				filter: input.filter,
				records_limit: input.records_limit,
			},
		},
	);
	const parsed = BrightDataEndpointOutputSchemas.filterDataset.parse(response);
	await logEventFromContext(
		ctx,
		'brightdata.filter_dataset',
		{ dataset_id: input.dataset_id, snapshot_id: parsed.snapshot_id },
		'completed',
	);
	return parsed;
};
