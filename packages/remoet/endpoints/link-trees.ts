import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Lists the user's link tree pages (GET /user/linktrees). */
export const list: RemoetEndpoints['linkTreesList'] = async (ctx, input) => {
	RemoetEndpointInputSchemas.linkTreesList.parse(input);
	const response = await makeRemoetRequest('/user/linktrees', ctx.key, {
		method: 'GET',
	});
	const validated = RemoetEndpointOutputSchemas.linkTreesList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.linkTrees.list',
		{ resultCount: validated.length },
		'completed',
	);
	return validated;
};

/** Reads one of the user's link tree pages by slug (GET /user/linktrees/:slug). */
export const get: RemoetEndpoints['linkTreesGet'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.linkTreesGet.parse(input);
	const response = await makeRemoetRequest(
		`/user/linktrees/${encodeURIComponent(parsed.slug)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const validated = RemoetEndpointOutputSchemas.linkTreesGet.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.linkTrees.get',
		{ id: validated.id, slug: validated.slug },
		'completed',
	);
	return validated;
};
