import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { PAGE_QUERY, PAGES_QUERY } from './types';

export const listPages: HashnodeEndpoints['listPages'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['listPages']
	>(PAGES_QUERY, ctx.key, { host: input.host });

	await logEventFromContext(
		ctx,
		'hashnode.listPages',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPage: HashnodeEndpoints['getPage'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getPage']
	>(PAGE_QUERY, ctx.key, { host: input.host, slug: input.slug });

	await logEventFromContext(ctx, 'hashnode.getPage', { ...input }, 'completed');
	return response;
};
