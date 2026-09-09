import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

export const list: LeexiEndpoints['teamsList'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.teamsList.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	const raw = await makeLeexiRequest<unknown>('teams', credentials, {
		method: 'GET',
		query: parsed,
	});
	const response = LeexiEndpointOutputSchemas.teamsList.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.teams.list',
		{ ...parsed },
		'completed',
	);
	return response;
};
