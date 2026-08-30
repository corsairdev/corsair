import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const createWorkspace: DynapicturesEndpoints['createWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['createWorkspace']
	>('workspaces', ctx.key, { method: 'POST', body: { name: input.name } });

	await logEventFromContext(
		ctx,
		'dynapictures.workspace.create',
		{ ...input },
		'completed',
	);
	return response;
};
