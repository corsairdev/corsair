import { logEventFromContext } from 'corsair/core';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpoints } from '../index';
import type { FigmaEndpointOutputs } from './types';

export const getCurrent: FigmaEndpoints['usersGetCurrent'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['usersGetCurrent']
	>(`v1/me`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'figma.users.getCurrent',
		{ ...input },
		'completed',
	);
	return result;
};
