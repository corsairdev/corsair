import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import type { EchtpostEndpointOutputs } from './types';

export const listTemplates: EchtpostEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeEchtpostRequest<
		EchtpostEndpointOutputs['listTemplates']
	>('templates', ctx.key, {
		method: 'GET',
		query: { source: input.source, page: input.page, per_page: input.per_page },
	});
	await logEventFromContext(ctx, 'echtpost.templates.list', {}, 'completed');
	return response;
};
