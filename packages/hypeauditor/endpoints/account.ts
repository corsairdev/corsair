import type { HypeAuditorEndpoints } from '..';
import { call } from './call';
import {
	HypeAuditorEndpointInputSchemas as Inputs,
	HypeAuditorEndpointOutputSchemas as Outputs,
} from './types';

/** Credits and discovery calls left in the plan. API subscriptions only. */
export const planInfo: HypeAuditorEndpoints['accountPlanInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.planInfo',
			input: Inputs['account.planInfo'],
			output: Outputs['account.planInfo'],
		},
		input,
		() => ({ action: 'auditor.planInfo/' }),
	);

/**
 * Reports unlocked on the account, newest first. `refunded` says whether the
 * credit was returned because the report could not be built, so this is the
 * read that explains a credit that seems to have gone missing.
 */
export const unlockedReports: HypeAuditorEndpoints['accountUnlockedReports'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.unlockedReports',
			input: Inputs['account.unlockedReports'],
			output: Outputs['account.unlockedReports'],
		},
		input,
		({ limit, offset, date_from, date_to }) => ({
			action: 'auditor.reportsUnlocked',
			query: { limit, offset, date_from, date_to },
		}),
	);

/** Suggests a channel name from a partial one. */
export const suggester: HypeAuditorEndpoints['suggesterGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'suggester.get',
			input: Inputs['suggester.get'],
			output: Outputs['suggester.get'],
		},
		input,
		({ search, st, exclSt }) => ({
			action: 'auditor.suggester',
			query: { search, st, exclSt },
		}),
	);

/**
 * The category, thematics and language ids the discovery filters take.
 *
 * The page documents no parameters, while the OpenAPI block embedded in the
 * same page shows `v=1`. Sending `v=1` would pin a version the prose never
 * mentions, so this follows the prose and lets the client's `v` apply. Both
 * answers are identical without a key, so this could not be settled by probing.
 */
export const taxonomy: HypeAuditorEndpoints['taxonomyGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'taxonomy.get',
			input: Inputs['taxonomy.get'],
			output: Outputs['taxonomy.get'],
		},
		input,
		() => ({ action: 'auditor.taxonomy/' }),
	);
