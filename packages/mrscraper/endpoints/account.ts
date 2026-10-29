import { logEventFromContext } from 'corsair/core';
import type { MrscraperEndpoints } from '..';
import { makeMrscraperRequest } from '../client';
import type { MrscraperEndpointOutputs } from './types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './types';

export const get: MrscraperEndpoints['accountGet'] = async (ctx, input) => {
	MrscraperEndpointInputSchemas.accountGet.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['accountGet']
	>('/subscription-accounts', ctx.key, { method: 'GET' });

	const parsed = MrscraperEndpointOutputSchemas.accountGet.parse(response);

	await logEventFromContext(ctx, 'mrscraper.account.get', {}, 'completed');

	return parsed;
};
