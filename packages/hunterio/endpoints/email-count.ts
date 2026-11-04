import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['emailCountGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.emailCountGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailCountGet']
	>('/email-count', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailCountGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.emailCount.get', {}, 'completed');

	return parsedResponse;
};
