import { logEventFromContext } from 'corsair/core';
import { makeFlexisignRequest } from '../client';
import type { FlexisignEndpoints } from '../index';
import type { FlexisignEndpointOutputs } from './types';

export const listTemplates: FlexisignEndpoints['ListTemplates'] = async (
	ctx,
) => {
	const response = await makeFlexisignRequest<
		FlexisignEndpointOutputs['ListTemplates']
	>('/v1/templates/all', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'flexisign.list.templates', {}, 'completed');

	return response;
};
