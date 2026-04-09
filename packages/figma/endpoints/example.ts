import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

// This file is kept for backwards compatibility with the template structure.
// Real endpoints are implemented in their respective files (comments.ts, files.ts, etc.)

export const get: FigmaEndpoints['usersGetCurrent'] = async (ctx, input) => {
	const response = await makeFigmaRequest<
		FigmaEndpointOutputs['usersGetCurrent']
	>(`v1/me`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'figma.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
