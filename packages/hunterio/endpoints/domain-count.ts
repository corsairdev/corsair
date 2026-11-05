import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import { toBracketQuery } from './query';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['domainCountGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.domainCountGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainCountGet']
	>('/domain-count', ctx.key, { method: 'GET', query: toBracketQuery(parsed) });

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainCountGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.domainCount.get', {}, 'completed');

	return parsedResponse;
};
