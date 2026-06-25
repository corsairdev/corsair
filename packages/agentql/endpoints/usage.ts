import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import type { AgentQLGetUsageResponse } from './types';

export const get: AgentQLEndpoints['getUsage'] = async (ctx) => {
	const response = await makeAgentQLRequest<AgentQLGetUsageResponse>(
		'/v1/usage',
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (ctx.db.accountUsage) {
		try {
			await ctx.db.accountUsage.upsertByEntityId('current', {
				currentSubscription: response.data.current_subscription ?? null,
				apiKeyUsage: response.data.api_key_usage,
				totalAccountUsage: response.data.total_account_usage,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[agentql] Failed to save account usage to database:',
				error,
			);
		}
	}

	await logEventFromContext(ctx, 'agentql.usage.get', {}, 'completed');

	return response;
};
