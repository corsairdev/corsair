import { logEventFromContext } from 'corsair/core';
import type { CloudinaryEndpoints } from '..';
import type { CloudinaryEndpointOutputs } from './types';
import { makeCloudinaryRequest } from '../client';

export const get: CloudinaryEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCloudinaryRequest<CloudinaryEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'cloudinary.example.get', { ...input }, 'completed');
	return response;
};
