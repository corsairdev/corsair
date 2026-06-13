import { logEventFromContext } from 'corsair/core';
import type { SupabaseEndpoints } from '..';
import type { SupabaseEndpointOutputs } from './types';
import { makeSupabaseRequest } from '../client';

export const get: SupabaseEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeSupabaseRequest<SupabaseEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'supabase.example.get', { ...input }, 'completed');
	return response;
};
