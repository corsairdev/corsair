import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const listsApiGetList: BuiltWithEndpoints['listsApiGetList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number> = {
		TECH: input.tech,
	};

	if (input.all !== undefined) query.ALL = input.all ? 'true' : 'false';
	if (input.country !== undefined) query.COUNTRY = input.country;
	if (input.meta !== undefined) query.META = input.meta ? 'yes' : 'no';
	if (input.offset !== undefined) query.OFFSET = input.offset;
	if (input.since !== undefined) query.SINCE = input.since;

	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['listsApiGetList']
	>('lists12/api.json', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'builtwith.lists.api.get_list',
		{ ...input },
		'completed',
	);

	return response;
};
