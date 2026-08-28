import { logEventFromContext } from 'corsair/core';
import type { FlexisignEndpoints } from '..';
import { makeFlexisignRequest } from '../client';
import type { FlexisignEndpointOutputs } from './types';

export const listTemplates: FlexisignEndpoints['ListTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeFlexisignRequest<
		FlexisignEndpointOutputs['ListTemplates']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'flexisign.list.templates',
		{ ...input },
		'completed',
	);
	return response;
};
