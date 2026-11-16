import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	GetBillingBalanceInputSchema,
	GetBillingBalanceOutputSchema,
	GetBillingEntitlementsInputSchema,
	GetBillingEntitlementsOutputSchema,
	GetBillingLedgerInputSchema,
	GetBillingLedgerOutputSchema,
	GetBillingUsageInputSchema,
	GetBillingUsageOutputSchema,
} from './types';
export const entitlements = defineEndpoint({
	event: 'deepline.billing.entitlements',
	input: GetBillingEntitlementsInputSchema,
	output: GetBillingEntitlementsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/entitlements`, ctx.key, {
			method: 'GET',
		}),
});
export const balance = defineEndpoint({
	event: 'deepline.billing.balance',
	input: GetBillingBalanceInputSchema,
	output: GetBillingBalanceOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/balance`, ctx.key, {
			method: 'GET',
			query: { view: input.view },
		}),
});
export const usage = defineEndpoint({
	event: 'deepline.billing.usage',
	input: GetBillingUsageInputSchema,
	output: GetBillingUsageOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/usage`, ctx.key, {
			method: 'GET',
			query: {
				run_id: input.run_id,
				request_id: input.request_id,
				recent_limit: input.recent_limit,
				recent_offset: input.recent_offset,
				recent_cursor: input.recent_cursor,
			},
		}),
});
export const ledger = defineEndpoint({
	event: 'deepline.billing.ledger',
	input: GetBillingLedgerInputSchema,
	output: GetBillingLedgerOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/ledger`, ctx.key, {
			method: 'GET',
			query: {
				limit: input.limit,
				since_at: input.since_at,
				before_at: input.before_at,
				cursor: input.cursor,
				run_id: input.run_id,
				operation: input.operation,
			},
		}),
});
