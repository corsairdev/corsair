import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type { KeysStatusResponse } from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Key operations, documented at https://litescrape.com/docs/key-status.

export const status: LitescrapeEndpoints['keysStatus'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.keysStatus.parse(input);

	const response = await makeLitescrapeRequest<KeysStatusResponse>(
		'/api/keys/status',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = LitescrapeEndpointOutputSchemas.keysStatus.parse(response);

	// The key status payload is account-scoped billing data, not request
	// content, so nothing from it is logged beyond completion.
	await logEventFromContext(ctx, 'litescrape.keys.status', {}, 'completed');

	return parsed;
};
