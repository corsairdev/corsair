import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';

export const get: CoassembleEndpoints['getCourses'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getCourses']
	>('v1/headless/courses', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coassemble.courses.get',
		{ ...input },
		'completed',
	);

	return response;
};
