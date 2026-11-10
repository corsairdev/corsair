import type { LemonSqueezyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LemonSqueezyEndpointInputSchemas as Inputs,
	LemonSqueezyEndpointOutputSchemas as Outputs,
} from './types';

/** Paging and include, shared by every list here. */
type ListInput = {
	pageNumber?: number;
	pageSize?: number;
	sort?: string;
	include?: readonly string[];
};

function pageQuery(
	parsed: ListInput,
	filters: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {
		'page[number]': parsed.pageNumber,
		'page[size]': parsed.pageSize,
		sort: parsed.sort,
		include: parsed.include?.join(','),
	};
	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined) query[`filter[${key}]`] = value;
	}
	return query;
}

// ── subscriptions ─────────────────────────────────────────────────────────

export const subscriptionsList: LemonSqueezyEndpoints['subscriptionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscriptions.list',
			input: Inputs.subscriptionsList,
			output: Outputs.subscriptionsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/subscriptions',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				order_id: parsed.orderId,
				order_item_id: parsed.orderItemId,
				product_id: parsed.productId,
				variant_id: parsed.variantId,
				user_email: parsed.userEmail,
				status: parsed.status,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const subscriptionsGet: LemonSqueezyEndpoints['subscriptionsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscriptions.get',
			input: Inputs.subscriptionsGet,
			output: Outputs.subscriptionsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/subscriptions/${segment(parsed.subscriptionId)}`,
		}),
		{
			log: (parsed, result) => ({
				subscriptionId: parsed.subscriptionId,
				status: result.data.attributes.status ?? undefined,
			}),
		},
	);

/**
 * Moves a subscription to another variant, pauses or resumes it, or changes its
 * billing date. A plan change prorates the next charge unless
 * `invoiceImmediately` or `disableProrations` says otherwise.
 */
export const subscriptionsUpdate: LemonSqueezyEndpoints['subscriptionsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptions.update',
				input: Inputs.subscriptionsUpdate,
				output: Outputs.subscriptionsUpdate,
			},
			input,
			(parsed) => ({
				method: 'PATCH',
				path: `/v1/subscriptions/${segment(parsed.subscriptionId)}`,
				body: {
					data: {
						type: 'subscriptions',
						id: parsed.subscriptionId,
						attributes: {
							variant_id: parsed.variantId,
							invoice_immediately: parsed.invoiceImmediately,
							disable_prorations: parsed.disableProrations,
							pause:
								parsed.pause === undefined
									? undefined
									: {
											mode: parsed.pause.mode,
											resumes_at: parsed.pause.resumesAt,
										},
							// The API takes `unpause` as a bare flag.
							unpause: parsed.unpause,
							billing_anchor: parsed.billingAnchor,
						},
					},
				},
			}),
			{
				log: (parsed, result) => ({
					subscriptionId: parsed.subscriptionId,
					status: result.data.attributes.status ?? undefined,
					variantId: parsed.variantId,
				}),
			},
		);

/** Cancels an active subscription. A cancelled subscription is not deleted. */
export const subscriptionsCancel: LemonSqueezyEndpoints['subscriptionsCancel'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptions.cancel',
				input: Inputs.subscriptionsCancel,
				output: Outputs.subscriptionsCancel,
			},
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/v1/subscriptions/${segment(parsed.subscriptionId)}`,
			}),
			{
				log: (parsed, result) => ({
					subscriptionId: parsed.subscriptionId,
					status: result.data.attributes.status ?? undefined,
				}),
			},
		);

// ── subscription items ────────────────────────────────────────────────────

export const subscriptionItemsList: LemonSqueezyEndpoints['subscriptionItemsList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionItems.list',
				input: Inputs.subscriptionItemsList,
				output: Outputs.subscriptionItemsList,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/v1/subscription-items',
				query: pageQuery(parsed, {
					subscription_id: parsed.subscriptionId,
					price_id: parsed.priceId,
				}),
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const subscriptionItemsGet: LemonSqueezyEndpoints['subscriptionItemsGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionItems.get',
				input: Inputs.subscriptionItemsGet,
				output: Outputs.subscriptionItemsGet,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/v1/subscription-items/${segment(parsed.subscriptionItemId)}`,
			}),
			{ log: (parsed) => ({ subscriptionItemId: parsed.subscriptionItemId }) },
		);

/** A usage-based item's metered usage so far in the current period. */
export const subscriptionItemsUsage: LemonSqueezyEndpoints['subscriptionItemsUsage'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionItems.usage',
				input: Inputs.subscriptionItemsUsage,
				output: Outputs.subscriptionItemsUsage,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/v1/subscription-items/${segment(parsed.subscriptionItemId)}/current-usage`,
			}),
			{
				log: (parsed, result) => ({
					subscriptionItemId: parsed.subscriptionItemId,
					currentUsage: result.meta?.current_usage ?? undefined,
				}),
			},
		);

export const subscriptionItemsUpdate: LemonSqueezyEndpoints['subscriptionItemsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionItems.update',
				input: Inputs.subscriptionItemsUpdate,
				output: Outputs.subscriptionItemsUpdate,
			},
			input,
			(parsed) => ({
				method: 'PATCH',
				path: `/v1/subscription-items/${segment(parsed.subscriptionItemId)}`,
				body: {
					data: {
						type: 'subscription-items',
						id: parsed.subscriptionItemId,
						attributes: { quantity: parsed.quantity },
					},
				},
			}),
			{
				log: (parsed) => ({
					subscriptionItemId: parsed.subscriptionItemId,
					quantity: parsed.quantity,
				}),
			},
		);

// ── subscription invoices ─────────────────────────────────────────────────

export const subscriptionInvoicesList: LemonSqueezyEndpoints['subscriptionInvoicesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionInvoices.list',
				input: Inputs.subscriptionInvoicesList,
				output: Outputs.subscriptionInvoicesList,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/v1/subscription-invoices',
				query: pageQuery(parsed, {
					store_id: parsed.storeId,
					status: parsed.status,
					refunded: parsed.refunded,
					subscription_id: parsed.subscriptionId,
				}),
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const subscriptionInvoicesGet: LemonSqueezyEndpoints['subscriptionInvoicesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionInvoices.get',
				input: Inputs.subscriptionInvoicesGet,
				output: Outputs.subscriptionInvoicesGet,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/v1/subscription-invoices/${segment(parsed.subscriptionInvoiceId)}`,
			}),
			{
				log: (parsed) => ({
					subscriptionInvoiceId: parsed.subscriptionInvoiceId,
				}),
			},
		);

export const subscriptionInvoicesGenerate: LemonSqueezyEndpoints['subscriptionInvoicesGenerate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionInvoices.generate',
				input: Inputs.subscriptionInvoicesGenerate,
				output: Outputs.subscriptionInvoicesGenerate,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/v1/subscription-invoices/${segment(parsed.subscriptionInvoiceId)}/generate-invoice`,
				body: {
					data: {
						type: 'subscription-invoices',
						id: parsed.subscriptionInvoiceId,
						attributes: { name: parsed.name },
					},
				},
			}),
			{
				log: (parsed) => ({
					subscriptionInvoiceId: parsed.subscriptionInvoiceId,
				}),
			},
		);

/**
 * Refunds a subscription invoice. Irreversible, like an order refund: the API
 * has no way to undo it.
 */
export const subscriptionInvoicesRefund: LemonSqueezyEndpoints['subscriptionInvoicesRefund'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'subscriptionInvoices.refund',
				input: Inputs.subscriptionInvoicesRefund,
				output: Outputs.subscriptionInvoicesRefund,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/v1/subscription-invoices/${segment(parsed.subscriptionInvoiceId)}/refund`,
				body: {
					data: {
						type: 'subscription-invoices',
						id: parsed.subscriptionInvoiceId,
						attributes:
							parsed.amount === undefined ? {} : { amount: parsed.amount },
					},
				},
			}),
			{
				log: (parsed, result) => ({
					subscriptionInvoiceId: parsed.subscriptionInvoiceId,
					amount: parsed.amount,
					refundedAmount: result.data.attributes.refunded_amount ?? undefined,
				}),
			},
		);

// ── usage records ─────────────────────────────────────────────────────────

export const usageRecordsList: LemonSqueezyEndpoints['usageRecordsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'usageRecords.list',
			input: Inputs.usageRecordsList,
			output: Outputs.usageRecordsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/usage-records',
			query: pageQuery(parsed, {
				subscription_item_id: parsed.subscriptionItemId,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const usageRecordsGet: LemonSqueezyEndpoints['usageRecordsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'usageRecords.get',
			input: Inputs.usageRecordsGet,
			output: Outputs.usageRecordsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/usage-records/${segment(parsed.usageRecordId)}`,
		}),
		{ log: (parsed) => ({ usageRecordId: parsed.usageRecordId }) },
	);

/**
 * Records metered usage. `quantity` is additive by default, so calling twice
 * with 5 records 10 for the period; `action: 'set'` replaces the total instead.
 */
export const usageRecordsCreate: LemonSqueezyEndpoints['usageRecordsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'usageRecords.create',
			input: Inputs.usageRecordsCreate,
			output: Outputs.usageRecordsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/usage-records',
			body: {
				data: {
					type: 'usage-records',
					attributes: {
						quantity: parsed.quantity,
						action: parsed.action,
					},
					relationships: {
						'subscription-item': {
							data: {
								type: 'subscription-items',
								id: String(parsed.subscriptionItemId),
							},
						},
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				subscriptionItemId: parsed.subscriptionItemId,
				quantity: result.data.attributes.quantity ?? undefined,
			}),
		},
	);
