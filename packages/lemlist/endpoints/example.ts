import { logEventFromContext } from 'corsair/core';
import type { LemlistEndpoints } from '..';
import type { LemlistEndpointOutputs } from './types';
import { makeLemlistRequest } from '../client';

export const get: LemlistEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLemlistRequest<LemlistEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'lemlist.example.get', { ...input }, 'completed');
	return response;
};
