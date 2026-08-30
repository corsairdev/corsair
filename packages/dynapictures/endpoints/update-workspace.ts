import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const updateWorkspace: DynapicturesEndpoints['updateWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['updateWorkspace']
	>(`workspaces/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'PUT',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'dynapictures.workspace.update',
		{ ...input },
		'completed',
	);
	return response;
};
