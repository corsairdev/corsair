import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const listNewsChannels: BenzingaEndpoints['listNewsChannels'] = async (
	ctx,
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.listNewsChannels.parse(rawInput);
	const raw = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listNewsChannels']
	>('/api/v2.1/news/channels', ctx.key);
	const response = BenzingaEndpointOutputSchemas.listNewsChannels.parse(raw);

	await persistEntities(ctx.db.newsChannels, response.data, (r) =>
		String(r.id),
	);

	await logEventFromContext(
		ctx,
		'benzinga.news.listChannels',
		{ ...input },
		'completed',
	);

	return response;
};
