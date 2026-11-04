import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['teamMembersList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.teamMembersList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['teamMembersList']
	>('/team/members', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.teamMembersList.parse(response);

	await logEventFromContext(ctx, 'hunterio.teamMembers.list', {}, 'completed');

	return parsedResponse;
};
