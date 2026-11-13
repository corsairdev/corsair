import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const getTokenInfo: GosquaredEndpoints['auth.getTokenInfo'] = async (
	ctx,
	input,
) => {
	GosquaredEndpointInputSchemas['auth.getTokenInfo'].parse(input);

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['auth.getTokenInfo']
	>('/auth/v1/tokeninfo', ctx.key, {
		method: 'GET',
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['auth.getTokenInfo'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.auth.getTokenInfo',
		{ scopes: parsedResponse.scopes },
		'completed',
	);

	return parsedResponse;
};
