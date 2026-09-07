import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const crawlApi: BrightDataEndpoints['crawlApi'] = async (ctx, input) => {
	const response = await makeBrightDataRequest<unknown>(
		'/datasets/v3/trigger',
		requireBrightDataKey(ctx.key),
		{
			method: 'POST',
			query: {
				dataset_id: input.dataset_id,
				include_errors: input.include_errors,
				custom_output_fields: input.custom_output_fields,
			},
			body: input.items,
		},
	);
	const parsed = BrightDataEndpointOutputSchemas.crawlApi.parse(response);
	await logEventFromContext(
		ctx,
		'brightdata.crawl_api',
		{ dataset_id: input.dataset_id, snapshot_id: parsed.snapshot_id },
		'completed',
	);
	return parsed;
};
