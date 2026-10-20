import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['accountGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.accountGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['accountGet']
	>('/account', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.accountGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.account.get', {}, 'completed');

	return parsedResponse;
};

export const update: HunterioEndpoints['accountUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.accountUpdate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['accountUpdate']
	>('/account', ctx.key, { method: 'PUT', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.accountUpdate.parse(response);

	await logEventFromContext(ctx, 'hunterio.account.update', {}, 'completed');

	return parsedResponse;
};
