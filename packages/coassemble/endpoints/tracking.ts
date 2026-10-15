import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';

export const get: CoassembleEndpoints['getTrackings'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getTrackings']
	>('v1/headless/trackings', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coassemble.trackings.get',
		{ ...input },
		'completed',
	);

	return response;
};
