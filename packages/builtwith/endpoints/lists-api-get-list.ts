import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const listsApiGetList: BuiltWithEndpoints['listsApiGetList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string> = {
		TECH: input.tech,
	};

	if (input.otherTechs?.length) query.OTHERTECHS = input.otherTechs.join(',');
	if (input.all) query.ALL = 'yes';
	if (input.country) query.COUNTRY = input.country;
	if (input.meta) query.META = 'yes';
	if (input.offset) query.OFFSET = input.offset;
	if (input.since) query.SINCE = input.since;

	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['listsApiGetList']
	>('lists13/api.json', ctx.key, {
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
