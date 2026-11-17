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
import {
	CancelBillingSubscriptionInputSchema,
	CancelBillingSubscriptionOutputSchema,
	CreateBillingCreditPurchaseInputSchema,
	CreateBillingCreditPurchaseOutputSchema,
	CreateBillingPlanTransitionInputSchema,
	CreateBillingPlanTransitionOutputSchema,
	CreateBillingPortalSessionInputSchema,
	CreateBillingPortalSessionOutputSchema,
	GetBillingAutoRechargeInputSchema,
	GetBillingAutoRechargeOutputSchema,
	GetBillingCatalogInputSchema,
	GetBillingCatalogOutputSchema,
	GetBillingIncludedComputeInputSchema,
	GetBillingIncludedComputeOutputSchema,
	GetBillingPlansInputSchema,
	GetBillingPlansOutputSchema,
	GetBillingQuoteInputSchema,
	GetBillingQuoteOutputSchema,
	GetBillingStatusInputSchema,
	GetBillingStatusOutputSchema,
	GetBillingSubscriptionStatusInputSchema,
	GetBillingSubscriptionStatusOutputSchema,
	ListBillingInvoicesInputSchema,
	ListBillingInvoicesOutputSchema,
	ListBillingUsageEventsInputSchema,
	ListBillingUsageEventsOutputSchema,
	RecoverBillingCreditPurchaseInputSchema,
	RecoverBillingCreditPurchaseOutputSchema,
	TopUpBillingInputSchema,
	TopUpBillingOutputSchema,
	UpdateBillingAutoRechargeInputSchema,
	UpdateBillingAutoRechargeOutputSchema,
} from './types-billing';
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

// Some billing writes wrap their result as { data, request_id }; the SDK
// returns data, so these ops do too.
function unwrapData(response: unknown): unknown {
	if (
		response &&
		typeof response === 'object' &&
		'data' in response &&
		response.data &&
		typeof response.data === 'object'
	)
		return response.data;
	return response;
}

// ---- Reads -----------------------------------------------------------------

export const catalog = defineEndpoint({
	event: 'deepline.billing.catalog',
	input: GetBillingCatalogInputSchema,
	output: GetBillingCatalogOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/billing/catalog/current`, ctx.key, {
			method: 'GET',
		}),
});
export const plans = defineEndpoint({
	event: 'deepline.billing.plans',
	input: GetBillingPlansInputSchema,
	output: GetBillingPlansOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/plans`, ctx.key, {
			method: 'GET',
			query: { promo_code: input.promo_code },
		}),
});
export const status = defineEndpoint({
	event: 'deepline.billing.status',
	input: GetBillingStatusInputSchema,
	output: GetBillingStatusOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/billing/status`, ctx.key, { method: 'GET' }),
});
export const invoices = defineEndpoint({
	event: 'deepline.billing.invoices',
	input: ListBillingInvoicesInputSchema,
	output: ListBillingInvoicesOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/invoices`, ctx.key, {
			method: 'GET',
			query: { limit: input.limit },
		}),
});
export const usageEvents = defineEndpoint({
	event: 'deepline.billing.usageEvents',
	input: ListBillingUsageEventsInputSchema,
	output: ListBillingUsageEventsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/usage/events`, ctx.key, {
			method: 'GET',
			query: {
				request_id: input.request_id,
				limit: input.limit,
				cursor: input.cursor,
				run_id: input.run_id,
			},
		}),
});
export const includedCompute = defineEndpoint({
	event: 'deepline.billing.includedCompute',
	input: GetBillingIncludedComputeInputSchema,
	output: GetBillingIncludedComputeOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/included-compute`, ctx.key, {
			method: 'GET',
			// Only GET: POST to this path permanently turns included compute on.
			query: { include_overage: input.include_overage ? 'true' : undefined },
		}),
});
/** POST, but a pure estimate: it never starts a sandbox or spends credits. */
export const quote = defineEndpoint({
	event: 'deepline.billing.quote',
	input: GetBillingQuoteInputSchema,
	output: GetBillingQuoteOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/quote`, ctx.key, {
			method: 'POST',
			body: {
				quantity: input.quantity,
				sandbox_runtime: input.sandbox_runtime ?? {},
			},
		}),
});

const subscriptionStatus = defineEndpoint({
	event: 'deepline.billing.subscription.status',
	input: GetBillingSubscriptionStatusInputSchema,
	output: GetBillingSubscriptionStatusOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/billing/subscription/status`, ctx.key, {
			method: 'GET',
		}),
});
const subscriptionCancel = defineEndpoint({
	event: 'deepline.billing.subscription.cancel',
	input: CancelBillingSubscriptionInputSchema,
	output: CancelBillingSubscriptionOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/subscription/cancel`, ctx.key, {
			method: 'POST',
			body: { action: input.action },
		}),
});
export const subscription = {
	status: subscriptionStatus,
	cancel: subscriptionCancel,
};

const autoRechargeGet = defineEndpoint({
	event: 'deepline.billing.autoRecharge.get',
	input: GetBillingAutoRechargeInputSchema,
	output: GetBillingAutoRechargeOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/billing/auto-recharge`, ctx.key, {
			method: 'GET',
		}),
});
const autoRechargeUpdate = defineEndpoint({
	event: 'deepline.billing.autoRecharge.update',
	input: UpdateBillingAutoRechargeInputSchema,
	output: UpdateBillingAutoRechargeOutputSchema,
	run: async (ctx, input) =>
		unwrapData(
			await makeDeeplineRequest(`/api/v2/billing/auto-recharge`, ctx.key, {
				method: 'PUT',
				body: input.enabled
					? {
							enabled: true,
							threshold_credits: input.threshold_credits,
							refill_to_credits: input.refill_to_credits,
							...(input.purchase_limit_credits !== undefined
								? { purchase_limit_credits: input.purchase_limit_credits }
								: {}),
						}
					: { enabled: false },
				headers: { 'Idempotency-Key': input.idempotencyKey },
			}),
		),
});
export const autoRecharge = {
	get: autoRechargeGet,
	update: autoRechargeUpdate,
};

// ---- Money-moving writes -----------------------------------------------------
// Each one requires the caller's idempotency key, so retrying an uncertain call
// with the same input replays the original operation instead of charging twice.

export const topUp = defineEndpoint({
	event: 'deepline.billing.topUp',
	input: TopUpBillingInputSchema,
	output: TopUpBillingOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/top-up`, ctx.key, {
			method: 'POST',
			body: { credits: input.credits, idempotency_key: input.idempotencyKey },
			headers: {
				'Idempotency-Key': input.idempotencyKey,
				'x-deepline-top-up-receipt': input.receipt ? 'operation-v1' : undefined,
			},
		}),
});

const creditPurchaseCreate = defineEndpoint({
	event: 'deepline.billing.creditPurchases.create',
	input: CreateBillingCreditPurchaseInputSchema,
	output: CreateBillingCreditPurchaseOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/credit-purchases`, ctx.key, {
			method: 'POST',
			body: { credits: input.credits },
			headers: { 'Idempotency-Key': input.idempotencyKey },
		}),
});
/** Never charges: it retires a purchase that never started or returns the existing one. */
const creditPurchaseRecover = defineEndpoint({
	event: 'deepline.billing.creditPurchases.recover',
	input: RecoverBillingCreditPurchaseInputSchema,
	output: RecoverBillingCreditPurchaseOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/credit-purchases/recover`, ctx.key, {
			method: 'POST',
			body: { credits: input.credits, org_id: input.org_id },
			headers: { 'Idempotency-Key': input.idempotencyKey },
		}),
});
export const creditPurchases = {
	create: creditPurchaseCreate,
	recover: creditPurchaseRecover,
};

const planTransitionCreate = defineEndpoint({
	event: 'deepline.billing.planTransitions.create',
	input: CreateBillingPlanTransitionInputSchema,
	output: CreateBillingPlanTransitionOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/billing/plan-transitions`, ctx.key, {
			method: 'POST',
			body:
				input.action === 'start_or_change'
					? {
							action: input.action,
							target_plan_sku: input.target_plan_sku,
							...(input.billing_email
								? { billing_email: input.billing_email }
								: {}),
							...(input.promo_code ? { promo_code: input.promo_code } : {}),
						}
					: { action: input.action },
			headers: { 'Idempotency-Key': input.idempotencyKey },
		}),
});
export const planTransitions = { create: planTransitionCreate };

const portalSessionCreate = defineEndpoint({
	event: 'deepline.billing.portalSessions.create',
	input: CreateBillingPortalSessionInputSchema,
	output: CreateBillingPortalSessionOutputSchema,
	run: async (ctx, input) =>
		unwrapData(
			await makeDeeplineRequest(`/api/v2/billing/portal-sessions`, ctx.key, {
				method: 'POST',
				query: { flow: input.flow },
				body: {},
			}),
		),
});
export const portalSessions = { create: portalSessionCreate };
