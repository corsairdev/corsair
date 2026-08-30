import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const listWorkspaces: DynapicturesEndpoints['listWorkspaces'] = async (
	ctx,
	input,
) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['listWorkspaces']
	>('workspaces', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'dynapictures.workspaces.list',
		{ ...input },
		'completed',
	);
	return response;
};
