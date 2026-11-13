import { logEventFromContext } from 'corsair/core';
import type { GoogleClassroomEndpoints } from '..';
import type { GoogleClassroomEndpointOutputs } from './types';
import { makeGoogleClassroomRequest } from '../client';

export const get: GoogleClassroomEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGoogleClassroomRequest<GoogleClassroomEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'googleclassroom.example.get', { ...input }, 'completed');
	return response;
};
