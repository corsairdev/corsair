import { logEventFromContext } from 'corsair/core';
import type { FathomAiEndpoints } from '..';
import { makeFathomAiRequest } from '../client';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './types';

export const list: FathomAiEndpoints['usersList'] = async (ctx, input) => {
	const query = FathomAiEndpointInputSchemas.usersList.parse(input);
	const response = FathomAiEndpointOutputSchemas.usersList.parse(
		await makeFathomAiRequest('/users', ctx.key, { method: 'GET', query }),
	);
	for (const user of response.items) {
		await ctx.db.users.upsertByEntityId(user.email, user);
	}
	await logEventFromContext(
		ctx,
		'fathomai.users.list',
		{ count: response.items.length },
		'completed',
	);
	return response;
};
