import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import {
	HarvestInvoiceEntity,
	HarvestInvoiceItemCategoryEntity,
} from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'invoice';

/* -------------------------------------------------------------------------- */
/*                                  Invoices                                   */
/* -------------------------------------------------------------------------- */

/** Lists invoices, filtered by client, project, state or issue date. */
export const list: HarvestEndpoints['invoicesList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['invoicesList']>(
		ctx,
		'invoices',
		{
			query: compactQuery({
				client_id: input.client_id,
				project_id: input.project_id,
				state: input.state,
				from: input.from,
				to: input.to,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.invoices, HarvestInvoiceEntity, result.invoices, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.list',
		auditPayload(input, [
			'client_id',
			'project_id',
			'state',
			'from',
			'to',
			'page',
			'per_page',
		]),
		'completed',
	);
	return result;
};

/** Retrieves one invoice, including its line items. */
export const get: HarvestEndpoints['invoicesGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['invoicesGet']>(
		ctx,
		`invoices/${input.invoice_id}`,
	);

	await cacheEntity(ctx.db.invoices, HarvestInvoiceEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.get',
		auditPayload(input, ['invoice_id']),
		'completed',
	);
	return result;
};

/**
 * Creates an invoice.
 *
 * The invoice is created as a draft: nothing is sent to the client until an
 * invoice message with `event_type: 'send'` is created for it.
 */
export const create: HarvestEndpoints['invoicesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['invoicesCreate']>(
		ctx,
		'invoices',
		{
			method: 'POST',
			body: compactBody({
				client_id: input.client_id,
				subject: input.subject,
				notes: input.notes,
				number: input.number,
				purchase_order: input.purchase_order,
				currency: input.currency,
				issue_date: input.issue_date,
				due_date: input.due_date,
				payment_term: input.payment_term,
				tax: input.tax,
				tax2: input.tax2,
				discount: input.discount,
				estimate_id: input.estimate_id,
				line_items: input.line_items,
			}),
		},
	);

	await cacheEntity(ctx.db.invoices, HarvestInvoiceEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.create',
		// Subject, notes and line item descriptions are caller-authored.
		{
			client_id: input.client_id,
			invoice_id: result.id,
			line_items: input.line_items?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/**
 * Updates an invoice.
 *
 * Supplying `line_items` replaces the whole set — Harvest does not merge them —
 * so a partial list silently drops the rest.
 */
export const update: HarvestEndpoints['invoicesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['invoicesUpdate']>(
		ctx,
		`invoices/${input.invoice_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				client_id: input.client_id,
				subject: input.subject,
				notes: input.notes,
				number: input.number,
				purchase_order: input.purchase_order,
				currency: input.currency,
				issue_date: input.issue_date,
				due_date: input.due_date,
				payment_term: input.payment_term,
				tax: input.tax,
				tax2: input.tax2,
				discount: input.discount,
				line_items: input.line_items,
			}),
		},
	);

	await cacheEntity(ctx.db.invoices, HarvestInvoiceEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.update',
		auditPayload(input, ['invoice_id', 'client_id']),
		'completed',
	);
	return result;
};

/** Deletes an invoice. Requires invoice-editing permission. */
export const remove: HarvestEndpoints['invoicesDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(ctx, `invoices/${input.invoice_id}`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.delete',
		auditPayload(input, ['invoice_id']),
		'completed',
	);
	return { success: true, id: input.invoice_id };
};

/* -------------------------------------------------------------------------- */
/*                              Invoice messages                               */
/* -------------------------------------------------------------------------- */

/** Lists the messages recorded against an invoice, most recent first. */
export const listMessages: HarvestEndpoints['invoiceMessagesList'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['invoiceMessagesList']
	>(ctx, `invoices/${input.invoice_id}/messages`, {
		query: compactQuery({
			updated_since: input.updated_since,
			page: input.page,
			per_page: input.per_page,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.listMessages',
		auditPayload(input, ['invoice_id', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/**
 * Creates an invoice message.
 *
 * This drives the invoice's state machine, and one of its events sends mail:
 * `send` emails every recipient and marks the invoice open, while `close`,
 * `re-open` and `draft` only change state. Callers should treat `send` as an
 * outbound message to the client, not an internal status change.
 */
export const createMessage: HarvestEndpoints['invoiceMessagesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['invoiceMessagesCreate']
	>(ctx, `invoices/${input.invoice_id}/messages`, {
		method: 'POST',
		body: compactBody({
			event_type: input.event_type,
			subject: input.subject,
			body: input.body,
			include_link_to_client_invoice: input.include_link_to_client_invoice,
			attach_pdf: input.attach_pdf,
			send_me_a_copy: input.send_me_a_copy,
			thank_you: input.thank_you,
			recipients: input.recipients,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.createMessage',
		// Recipient addresses and message body stay out of the log; the count
		// and the event are enough to see what happened.
		{
			invoice_id: input.invoice_id,
			event_type: input.event_type,
			recipients: input.recipients?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/** Deletes an invoice message. */
export const removeMessage: HarvestEndpoints['invoiceMessagesDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(
		ctx,
		`invoices/${input.invoice_id}/messages/${input.message_id}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'harvest.invoices.deleteMessage',
		auditPayload(input, ['invoice_id', 'message_id']),
		'completed',
	);
	return { success: true, id: input.message_id };
};

/* -------------------------------------------------------------------------- */
/*                              Invoice payments                               */
/* -------------------------------------------------------------------------- */

/** Lists payments recorded against an invoice. */
export const listPayments: HarvestEndpoints['invoicePaymentsList'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['invoicePaymentsList']
	>(ctx, `invoices/${input.invoice_id}/payments`, {
		query: compactQuery({
			updated_since: input.updated_since,
			page: input.page,
			per_page: input.per_page,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.listPayments',
		auditPayload(input, ['invoice_id', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/**
 * Records a payment against an invoice.
 *
 * `send_thank_you: true` emails the client a receipt; left unset, the payment
 * is recorded silently.
 */
export const createPayment: HarvestEndpoints['invoicePaymentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['invoicePaymentsCreate']
	>(ctx, `invoices/${input.invoice_id}/payments`, {
		method: 'POST',
		body: compactBody({
			amount: input.amount,
			paid_at: input.paid_at,
			paid_date: input.paid_date,
			notes: input.notes,
			send_thank_you: input.send_thank_you,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.invoices.createPayment',
		{ invoice_id: input.invoice_id, payment_id: result.id },
		'completed',
	);
	return result;
};

/** Deletes a recorded payment. */
export const removePayment: HarvestEndpoints['invoicePaymentsDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(
		ctx,
		`invoices/${input.invoice_id}/payments/${input.payment_id}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'harvest.invoices.deletePayment',
		auditPayload(input, ['invoice_id', 'payment_id']),
		'completed',
	);
	return { success: true, id: input.payment_id };
};

/* -------------------------------------------------------------------------- */
/*                          Invoice item categories                            */
/* -------------------------------------------------------------------------- */

/** Lists invoice item categories and mirrors them into the local cache. */
export const listItemCategories: HarvestEndpoints['invoiceItemCategoriesList'] =
	async (ctx, input) => {
		const result = await harvestCall<
			HarvestEndpointOutputs['invoiceItemCategoriesList']
		>(ctx, 'invoice_item_categories', {
			query: compactQuery({
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		});

		await cacheEntities(
			ctx.db.invoiceItemCategories,
			HarvestInvoiceItemCategoryEntity,
			result.invoice_item_categories,
			{ label: 'invoice item category' },
		);

		await logEventFromContext(
			ctx,
			'harvest.invoices.listItemCategories',
			auditPayload(input, ['page', 'per_page']),
			'completed',
		);
		return result;
	};

/** Creates an invoice item category. */
export const createItemCategory: HarvestEndpoints['invoiceItemCategoriesCreate'] =
	async (ctx, input) => {
		const result = await harvestCall<
			HarvestEndpointOutputs['invoiceItemCategoriesCreate']
		>(ctx, 'invoice_item_categories', {
			method: 'POST',
			body: { name: input.name },
		});

		await cacheEntity(
			ctx.db.invoiceItemCategories,
			HarvestInvoiceItemCategoryEntity,
			result,
			{ label: 'invoice item category' },
		);

		await logEventFromContext(
			ctx,
			'harvest.invoices.createItemCategory',
			{ invoice_item_category_id: result.id },
			'completed',
		);
		return result;
	};

/**
 * Deletes an invoice item category.
 *
 * Harvest only permits this when the category is used for neither services nor
 * expenses — `use_as_service` and `use_as_expense` both false — and answers 422
 * otherwise.
 */
export const removeItemCategory: HarvestEndpoints['invoiceItemCategoriesDelete'] =
	async (ctx, input) => {
		await harvestCall<void>(
			ctx,
			`invoice_item_categories/${input.invoice_item_category_id}`,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'harvest.invoices.deleteItemCategory',
			auditPayload(input, ['invoice_item_category_id']),
			'completed',
		);
		return { success: true, id: input.invoice_item_category_id };
	};
