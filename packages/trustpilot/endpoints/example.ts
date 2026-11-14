import { logEventFromContext } from 'corsair/core';
import type { TrustpilotEndpoints } from '..';
import type { TrustpilotEndpointOutputs } from './types';
import { makeTrustpilotRequest } from '../client';

export const get: TrustpilotEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTrustpilotRequest<TrustpilotEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'trustpilot.example.get', { ...input }, 'completed');
	return response;
};
