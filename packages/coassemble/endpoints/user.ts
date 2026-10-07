import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';

export const get: CoassembleEndpoints['getUsers'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getUsers']
	>('v1/headless/users', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coassemble.users.get',
		{ ...input },
		'completed',
	);

	return response;
};
