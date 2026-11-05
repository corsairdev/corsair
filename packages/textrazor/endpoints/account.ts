import type { TextrazorEndpoints } from '../index';
import { textrazorCall } from './call';
import { GetAccountInputSchema, GetAccountOutputSchema } from './types';

export const get: TextrazorEndpoints['getAccount'] = async (ctx, input) => {
	const parsed = GetAccountInputSchema.parse(input ?? {});
	const result = await textrazorCall(
		ctx,
		'textrazor.account.get',
		'account/',
		'GET',
		parsed,
	);
	const output = GetAccountOutputSchema.parse(result);
	const account = output.response;
	if (account) {
		try {
			await ctx.db.accounts.upsertByEntityId('current', {
				id: 'current',
				plan: account.plan,
				concurrentRequestLimit: account.concurrentRequestLimit,
				concurrentRequestsUsed: account.concurrentRequestsUsed,
				planDailyRequestsIncluded: account.planDailyRequestsIncluded,
				requestsUsedToday: account.requestsUsedToday,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[textrazor] Failed to cache account:', error);
		}
	}
	return output;
};
