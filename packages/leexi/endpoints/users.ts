import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

export const list: LeexiEndpoints['usersList'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.usersList.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>('users', credentials, {
		method: 'GET',
		query: parsed,
	});
	const response = LeexiEndpointOutputSchemas.usersList.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.users.list',
		{ ...parsed },
		'completed',
	);
	return response;
};
