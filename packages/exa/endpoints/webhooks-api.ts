import { logEventFromContext } from 'corsair/core';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const listWebhooks: ExaEndpoints['webhooksApiList'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['webhooksApiList']>(
		'websets/v0/webhooks',
		ctx.key,
		{
			method: 'GET',
			query: input as Record<string, string | number | boolean | undefined>,
		},
	);

	if (result.data && ctx.db.webhookConfigs) {
		try {
			for (const webhook of result.data) {
				await ctx.db.webhookConfigs.upsertByEntityId(webhook.id, {
					...webhook,
					createdAt: new Date(webhook.createdAt),
					updatedAt: webhook.updatedAt
						? new Date(webhook.updatedAt)
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save webhook configs to database:', error);
		}
	}

	await logEventFromContext(ctx, 'exa.webhooksApi.list', {}, 'completed');
	return result;
};
