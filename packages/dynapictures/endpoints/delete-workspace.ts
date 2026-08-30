import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const deleteWorkspace: DynapicturesEndpoints['deleteWorkspace'] = async (
	ctx,
	input,
) => {
	await makeDynapicturesRequest(
		`workspaces/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'dynapictures.workspace.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};
