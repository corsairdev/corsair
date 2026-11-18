import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import type { LexofficeEndpointOutputs } from './types';
import { makeLexofficeRequest } from '../client';

export const get: LexofficeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLexofficeRequest<LexofficeEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'lexoffice.example.get', { ...input }, 'completed');
	return response;
};
