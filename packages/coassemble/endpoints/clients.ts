import { logEventFromContext } from 'corsair/core';

import { makeCoassembleRequest, resolveWorkspaceId } from '../client';
import type { CoassembleEndpoints } from '../index';
import type { CoassembleEndpointOutputs } from './types';
import { GetClientsInputSchema, GetClientsResponseSchema } from './types';

export const get: CoassembleEndpoints['getClients'] = async (ctx, rawInput) => {
	const input = GetClientsInputSchema.parse(rawInput);
	const workspaceId = await resolveWorkspaceId(ctx);

	const response = await makeCoassembleRequest<
		CoassembleEndpointOutputs['getClients']
	>('v1/headless/clients', ctx.key, workspaceId, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coassemble.clients.get',
		{ ...input },
		'completed',
	);

	return GetClientsResponseSchema.parse(response);
};
