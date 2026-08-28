import { logEventFromContext } from 'corsair/core';
import type { FlexisignEndpoints } from '..';
import { makeFlexisignRequest } from '../client';
import type { FlexisignEndpointOutputs } from './types';

export const templates: FlexisignEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeFlexisignRequest<
		FlexisignEndpointOutputs['listTemplates']
	>('templates', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'flexisign.list.templates',
		{ ...input },
		'completed',
	);
	return response;
};
