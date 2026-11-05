import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';
import { GetCoursesInputSchema, GetCoursesResponseSchema } from './types';

export const get: CoassembleEndpoints['getCourses'] = async (ctx, rawInput) => {
	const input = GetCoursesInputSchema.parse(rawInput);
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getCourses']
	>('v1/headless/courses', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	const parsed = GetCoursesResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'coassemble.courses.get',
		{ ...input },
		'completed',
	);

	return parsed;
};
