import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonEndpoints } from '../index';
import type { Operation } from './types';

export const get: NeonEndpoints['operationsGet'] = async (ctx, input) => {
	const { projectId, operationId } = input;
	const endpoint = `/projects/${projectId}/operations/${operationId}`;
	const result = await makeNeonRequest<Operation>(endpoint, ctx);

	await logEventFromContext(
		ctx,
		'neon.operations.get',
		{ ...input },
		'completed',
	);
	return result;
};
