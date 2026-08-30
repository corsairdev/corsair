import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const setWebhook: CastingwordsEndpoints['setWebhook'] = async (ctx, input) => {
	const response = await makeCastingwordsRequest<unknown>('webhook', ctx.key, {
		method: 'POST',
		form: { webhook: input.webhook },
	});
	const parsed = CastingwordsEndpointOutputSchemas.setWebhook.parse(
		typeof response === 'string' ? { webhook: response } : response,
	);
	await logEventFromContext(ctx, 'castingwords.set_webhook', { webhook: input.webhook }, 'completed');
	return parsed;
};
