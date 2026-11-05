import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['emailInsightGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.emailInsightGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailInsightGet']
	>('/email-insight', ctx.key, {
		method: 'GET',
		query: { email: parsed.email },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailInsightGet.parse(response);

	// The inspected address is PII; the event carries no payload.
	await logEventFromContext(ctx, 'hunterio.emailInsight.get', {}, 'completed');

	return parsedResponse;
};
