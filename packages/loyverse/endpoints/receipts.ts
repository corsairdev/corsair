import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { compactBody, compactQuery, csv, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Receipts - the transactional core of the API.
 *
 * Not mirrored. A receipt is appended on every sale and is only meaningful
 * against a date range, so a local copy would mirror a moving target without
 * serving any lookup. The reference data a receipt points at - items, variants,
 * customers, stores, payment types - is mirrored instead, which is what makes a
 * receipt readable after the fact.
 *
 * Receipts are keyed by `receipt_number`, a sequential string such as `"0001"`,
 * not by a UUID like every other resource.
 *
 * Both writes here are genuinely non-idempotent: each call produces a new
 * numbered receipt, and Loyverse accepts no idempotency key, so neither is
 * retried after a network failure. See `error-handlers.ts`.
 */

/**
 * Lists receipts.
 *
 * The richest filter set in the API: by receipt number, by a range of receipt
 * numbers, by store, by the `order` or `source` recorded on the sale, and by
 * created or updated timestamps.
 *
 * **The date filters are plan-limited.** On an account without Unlimited sales
 * history, asking for receipts created more than 31 days ago returns
 * `402 PAYMENT_REQUIRED  Unable to retrieve receipts created earlier than 31 days
 * ago` rather than an empty page. An unfiltered list still succeeds and returns
 * whatever is inside the retention window, so a 402 here means the filter reached
 * past the plan's limit rather than that the subscription has lapsed.
 */
export const list: LoyverseEndpoints['receiptsList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['receiptsList']>(
		ctx,
		'receipts',
		{
			query: compactQuery({
				cursor: input.cursor,
				limit: input.limit,
				receipt_numbers: csv(input.receipt_numbers),
				since_receipt_number: input.since_receipt_number,
				before_receipt_number: input.before_receipt_number,
				store_id: input.store_id,
				order: input.order,
				source: input.source,
				created_at_min: input.created_at_min,
				created_at_max: input.created_at_max,
				updated_at_min: input.updated_at_min,
				updated_at_max: input.updated_at_max,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.receipts.list',
		auditPayload(input, ['cursor', 'limit', 'store_id']),
		'completed',
	);
	return result;
};

/** Retrieves one receipt by its number. */
export const get: LoyverseEndpoints['receiptsGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['receiptsGet']>(
		ctx,
		`receipts/${input.receipt_number}`,
	);

	await logEventFromContext(
		ctx,
		'loyverse.receipts.get',
		auditPayload(input, ['receipt_number']),
		'completed',
	);
	return result;
};

/**
 * Records a sale.
 *
 * Loyverse accepts exactly one payment per POST, which the input schema bounds.
 * Line-level taxes, discounts and modifiers reference existing records by id; a
 * receipt-level discount generates the matching line discounts automatically.
 */
export const create: LoyverseEndpoints['receiptsCreate'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['receiptsCreate']>(
		ctx,
		'receipts',
		{
			method: 'POST',
			body: compactBody({
				store_id: input.store_id,
				employee_id: input.employee_id,
				customer_id: input.customer_id,
				order: input.order,
				source: input.source,
				receipt_date: input.receipt_date,
				note: input.note,
				dining_option: input.dining_option,
				total_discounts: input.total_discounts,
				line_items: input.line_items,
				payments: input.payments,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.receipts.create',
		// Line items carry item names and per-line notes, and the receipt itself
		// carries a free-text note, so the shape of the sale is recorded rather
		// than its contents.
		{
			receipt_number: result.receipt_number,
			store_id: input.store_id,
			line_item_count: countOf(input.line_items),
			payment_count: countOf(input.payments),
		},
		'completed',
	);
	return result;
};

/**
 * Refunds part or all of an existing receipt.
 *
 * Each refunded line must name the `id` of the line on the original receipt, not
 * just its `variant_id` - sending only the variant is answered with
 * `MISSING_REQUIRED_PARAMETER  field: object.line_items[0].id`. The result is a
 * new receipt of type `REFUND` whose `refund_for` names the original.
 *
 * Loyverse only refunds receipts that were paid by a single payment method, and
 * not those settled through an integrated card terminal - an integrated payment
 * has to be reversed through the terminal itself. The input schema bounds
 * `payments` to one entry for the same reason the create does.
 */
export const refund: LoyverseEndpoints['receiptsRefund'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['receiptsRefund']>(
		ctx,
		`receipts/${input.receipt_number}/refund`,
		{
			method: 'POST',
			body: compactBody({
				store_id: input.store_id,
				employee_id: input.employee_id,
				note: input.note,
				line_items: input.line_items,
				payments: input.payments,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.receipts.refund',
		{
			receipt_number: result.receipt_number,
			refund_for: input.receipt_number,
			store_id: input.store_id,
			line_item_count: countOf(input.line_items),
		},
		'completed',
	);
	return result;
};
