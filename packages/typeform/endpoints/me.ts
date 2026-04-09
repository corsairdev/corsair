import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const get: TypeformEndpoints['meGet'] = async (ctx, _input) => {
	const response = await makeTypeformRequest<TypeformEndpointOutputs['meGet']>(
		'/me',
		ctx.key,
	);

	await logEventFromContext(ctx, 'typeform.me.get', {}, 'completed');

	return response;
};
