import { logEventFromContext } from 'corsair/core';
import type { LangbaseEndpoints } from '..';
import type { LangbaseEndpointOutputs } from './types';
import { makeLangbaseRequest } from '../client';

export const get: LangbaseEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLangbaseRequest<LangbaseEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'langbase.example.get', { ...input }, 'completed');
	return response;
};
