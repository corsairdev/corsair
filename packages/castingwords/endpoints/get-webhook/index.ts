import { logEventFromContext } from 'corsair/core';
import { makeCastingwordsRequest } from '../../client';
import type { CastingwordsEndpoints } from '..';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getWebhook: CastingwordsEndpoints['getWebhook'] = async (ctx) => {
	const response = await makeCastingwordsRequest<unknown>('webhook', ctx.key);
	const parsed = CastingwordsEndpointOutputSchemas.getWebhook.parse(
		typeof response === 'string' ? { webhook: response } : response,
	);
	await logEventFromContext(ctx, 'castingwords.get_webhook', {}, 'completed');
	return parsed;
};
