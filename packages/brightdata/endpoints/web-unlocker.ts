import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const webUnlocker: BrightDataEndpoints['webUnlocker'] = async (
	ctx,
	input,
) => {
	const response = await makeBrightDataRequest<unknown>(
		'/request',
		requireBrightDataKey(ctx.key),
		{
			method: 'POST',
			body: {
				zone: input.zone,
				url: input.url,
				format: input.format ?? 'raw',
				country: input.country,
				data_format: input.data_format,
			},
		},
	);
	const parsed = BrightDataEndpointOutputSchemas.webUnlocker.parse(response);
	await logEventFromContext(
		ctx,
		'brightdata.web_unlocker',
		{ zone: input.zone, url: input.url },
		'completed',
	);
	return parsed;
};
