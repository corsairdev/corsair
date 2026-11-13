import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type { CreditsGetResponse } from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const get: FolkEndpoints['creditsGet'] = async (ctx, input) => {
	FolkEndpointInputSchemas.creditsGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<CreditsGetResponse>(
		'/credits',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.creditsGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.credits.get',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};
