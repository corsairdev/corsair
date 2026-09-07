import { logEventFromContext } from 'corsair/core';
import type { ClassmarkerEndpoints } from '..';
import { makeClassmarkerRequest } from '../client';
import type { ClassmarkerEndpointOutputs } from './types';

export const get: ClassmarkerEndpoints['exampleGet'] = async (ctx) => {
	const response = await makeClassmarkerRequest<
		ClassmarkerEndpointOutputs['exampleGet']
	>('v1/tests', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'classmarker.tests.list', {}, 'completed');

	return response;
};
