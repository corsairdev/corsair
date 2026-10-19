import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';
import { GetTrackingsInputSchema, GetTrackingsResponseSchema } from './types';

export const get: CoassembleEndpoints['getTrackings'] = async (
	ctx,
	rawInput,
) => {
	const input = GetTrackingsInputSchema.parse(rawInput);
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getTrackings']
	>('v1/headless/trackings', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	const parsed = GetTrackingsResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'coassemble.trackings.get',
		{ ...input },
		'completed',
	);

	return parsed;
};
