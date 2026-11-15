import type { QuadernoEndpoints } from '..';
import { segment } from '../client';
import { call, requireArray, wrap } from './call';
import {
	QuadernoEndpointInputSchemas as Inputs,
	nextCreatedBefore,
	QuadernoEndpointOutputSchemas as Outputs,
} from './types';

// Invoices

export const list: QuadernoEndpoints['invoicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
			toRequest: ({
				q,
				date,
				state,
				contact,
				processor_id,
				limit,
				created_before,
			}) => ({
				method: 'GET',
				path: '/invoices',
				query: { q, date, state, contact, processor_id, limit, created_before },
			}),
		},
		input,
		{
			shape: (raw, { limit }) => {
				const invoices = requireArray(raw, 'invoices');
				return {
					invoices,
					next_created_before: nextCreatedBefore(
						invoices as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({
				count: result.invoices.length,
				hasNext: result.next_created_before !== null,
			}),
		},
	);

export const create: QuadernoEndpoints['invoicesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.create',
			input: Inputs.invoicesCreate,
			output: Outputs.invoicesCreate,
			toRequest: (body) => ({ method: 'POST', path: '/invoices', body }),
		},
		input,
		{
			shape: (raw) => wrap('invoice', raw),
			log: ({ payment_method }, result) => ({
				invoiceId: result.invoice.id,
				number: result.invoice.number ?? undefined,
				state: result.invoice.state ?? undefined,
				paidOnCreate: payment_method !== undefined,
			}),
		},
	);

export const get: QuadernoEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/invoices/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('invoice', raw),
			log: ({ id }) => ({ invoiceId: id }),
		},
	);

export const update: QuadernoEndpoints['invoicesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.update',
			input: Inputs.invoicesUpdate,
			output: Outputs.invoicesUpdate,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/invoices/${segment(id)}`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('invoice', raw),
			log: ({ id }) => ({ invoiceId: id }),
		},
	);

/**
 * Voiding does not delete. Quaderno keeps every invoice for tax law and
 * reverses it: the response shows the invoice settled by an `offset` payment
 * and a new credit note beside it. `void_reason` is required, and the API
 * answers 422 without it.
 */
export const voidInvoice: QuadernoEndpoints['invoicesVoid'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.void',
			input: Inputs.invoicesVoid,
			output: Outputs.invoicesVoid,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/invoices/${segment(id)}/void`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('invoice', raw),
			log: ({ id }, result) => ({
				invoiceId: id,
				state: result.invoice.state ?? undefined,
				credits: result.invoice.number ?? undefined,
			}),
		},
	);

export const markUncollectible: QuadernoEndpoints['invoicesMarkUncollectible'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'invoices.markUncollectible',
				input: Inputs.invoicesMarkUncollectible,
				output: Outputs.invoicesMarkUncollectible,
				toRequest: ({ id }) => ({
					method: 'PUT',
					path: `/invoices/${segment(id)}/mark_uncollectible`,
				}),
			},
			input,
			{
				shape: (raw) => wrap('invoice', raw),
				log: ({ id }, result) => ({
					invoiceId: id,
					state: result.invoice.state ?? undefined,
				}),
			},
		);

/**
 * Verified live: this returns the **payment**, not the invoice, as
 * `{id, date, payment_method, amount_cents, processor, processor_id, url}`.
 * `created_at` is absent on every live response, so the payment schema does not
 * require it.
 */
export const recordPayment: QuadernoEndpoints['invoicesRecordPayment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.recordPayment',
			input: Inputs.invoicesRecordPayment,
			output: Outputs.invoicesRecordPayment,
			toRequest: ({ id, ...body }) => ({
				method: 'POST',
				path: `/invoices/${segment(id)}/payments`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('payment', raw),
			log: ({ id, payment_method }, result) => ({
				invoiceId: id,
				paymentMethod: payment_method,
				paymentId: result.payment.id ?? undefined,
			}),
		},
	);

/**
 * A GET that sends email, which is why it is a write here, not a read.
 *
 * The four deliver routes answer 200 with **no body**, so there is no document
 * to return: the result only confirms Quaderno accepted the request. Parsing a
 * document out of an empty response would throw after the email had gone, and
 * the caller would deliver it a second time.
 */
const delivered = () => ({ delivered: true as const });

export const deliver: QuadernoEndpoints['invoicesDeliver'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.deliver',
			input: Inputs.invoicesDeliver,
			output: Outputs.invoicesDeliver,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/invoices/${segment(id)}/deliver`,
			}),
		},
		input,
		{
			shape: delivered,
			log: ({ id }) => ({ invoiceId: id }),
		},
	);

// Receipts

export const receiptsList: QuadernoEndpoints['receiptsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'receipts.list',
			input: Inputs.receiptsList,
			output: Outputs.receiptsList,
			toRequest: ({ q, date, state, contact, limit, created_before }) => ({
				method: 'GET',
				path: '/receipts',
				query: { q, date, state, contact, limit, created_before },
			}),
		},
		input,
		{
			shape: (raw, { limit }) => {
				const receipts = requireArray(raw, 'receipts');
				return {
					receipts,
					next_created_before: nextCreatedBefore(
						receipts as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({ count: result.receipts.length }),
		},
	);

export const receiptsCreate: QuadernoEndpoints['receiptsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'receipts.create',
			input: Inputs.receiptsCreate,
			output: Outputs.receiptsCreate,
			toRequest: (body) => ({ method: 'POST', path: '/receipts', body }),
		},
		input,
		{
			shape: (raw) => wrap('receipt', raw),
			log: (_, result) => ({
				receiptId: result.receipt.id,
				number: result.receipt.number ?? undefined,
			}),
		},
	);

export const receiptsGet: QuadernoEndpoints['receiptsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'receipts.get',
			input: Inputs.receiptsGet,
			output: Outputs.receiptsGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/receipts/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('receipt', raw),
			log: ({ id }) => ({ receiptId: id }),
		},
	);

export const receiptsVoid: QuadernoEndpoints['receiptsVoid'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'receipts.void',
			input: Inputs.receiptsVoid,
			output: Outputs.receiptsVoid,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/receipts/${segment(id)}/void`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('receipt', raw),
			log: ({ id }) => ({ receiptId: id }),
		},
	);

export const receiptsDeliver: QuadernoEndpoints['receiptsDeliver'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'receipts.deliver',
			input: Inputs.receiptsDeliver,
			output: Outputs.receiptsDeliver,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/receipts/${segment(id)}/deliver`,
			}),
		},
		input,
		{
			shape: delivered,
			log: ({ id }) => ({ receiptId: id }),
		},
	);

// Credit notes

export const creditsList: QuadernoEndpoints['creditsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.list',
			input: Inputs.creditsList,
			output: Outputs.creditsList,
			toRequest: ({ q, date, state, contact, limit, created_before }) => ({
				method: 'GET',
				path: '/credits',
				query: { q, date, state, contact, limit, created_before },
			}),
		},
		input,
		{
			shape: (raw, { limit }) => {
				const credits = requireArray(raw, 'credits');
				return {
					credits,
					next_created_before: nextCreatedBefore(
						credits as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({ count: result.credits.length }),
		},
	);

export const creditsCreate: QuadernoEndpoints['creditsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.create',
			input: Inputs.creditsCreate,
			output: Outputs.creditsCreate,
			toRequest: (body) => ({ method: 'POST', path: '/credits', body }),
		},
		input,
		{
			shape: (raw) => wrap('credit', raw),
			log: ({ invoice_id }, result) => ({
				creditId: result.credit.id,
				invoiceId: invoice_id,
			}),
		},
	);

export const creditsGet: QuadernoEndpoints['creditsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.get',
			input: Inputs.creditsGet,
			output: Outputs.creditsGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/credits/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('credit', raw),
			log: ({ id }) => ({ creditId: id }),
		},
	);

export const creditsUpdate: QuadernoEndpoints['creditsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.update',
			input: Inputs.creditsUpdate,
			output: Outputs.creditsUpdate,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/credits/${segment(id)}`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('credit', raw),
			log: ({ id }) => ({ creditId: id }),
		},
	);

export const creditsVoid: QuadernoEndpoints['creditsVoid'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.void',
			input: Inputs.creditsVoid,
			output: Outputs.creditsVoid,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/credits/${segment(id)}/void`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('credit', raw),
			log: ({ id }) => ({ creditId: id }),
		},
	);

export const creditsDeliver: QuadernoEndpoints['creditsDeliver'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'credits.deliver',
			input: Inputs.creditsDeliver,
			output: Outputs.creditsDeliver,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/credits/${segment(id)}/deliver`,
			}),
		},
		input,
		{
			shape: delivered,
			log: ({ id }) => ({ creditId: id }),
		},
	);

// Proformas

export const proformasList: QuadernoEndpoints['proformasList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'proformas.list',
			input: Inputs.proformasList,
			output: Outputs.proformasList,
			toRequest: ({ q, date, state, contact, limit, created_before }) => ({
				method: 'GET',
				path: '/proformas',
				query: { q, date, state, contact, limit, created_before },
			}),
		},
		input,
		{
			shape: (raw, { limit }) => {
				const proformas = requireArray(raw, 'proformas');
				return {
					proformas,
					next_created_before: nextCreatedBefore(
						proformas as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({ count: result.proformas.length }),
		},
	);

export const proformasCreate: QuadernoEndpoints['proformasCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'proformas.create',
			input: Inputs.proformasCreate,
			output: Outputs.proformasCreate,
			toRequest: (body) => ({ method: 'POST', path: '/proformas', body }),
		},
		input,
		{
			shape: (raw) => wrap('proforma', raw),
			log: (_, result) => ({ proformaId: result.proforma.id }),
		},
	);

export const proformasGet: QuadernoEndpoints['proformasGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'proformas.get',
			input: Inputs.proformasGet,
			output: Outputs.proformasGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/proformas/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('proforma', raw),
			log: ({ id }) => ({ proformaId: id }),
		},
	);

export const proformasUpdate: QuadernoEndpoints['proformasUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'proformas.update',
			input: Inputs.proformasUpdate,
			output: Outputs.proformasUpdate,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/proformas/${segment(id)}`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('proforma', raw),
			log: ({ id }) => ({ proformaId: id }),
		},
	);

/** The three state actions share one request shape and one response. */
function proformaAction(
	event: string,
	action: 'accept' | 'decline' | 'revert',
) {
	return (
		ctx: Parameters<QuadernoEndpoints['proformasAccept']>[0],
		// unknown: raw caller input, parsed by call() against the action's schema.
		input: unknown,
	) =>
		call(
			ctx,
			{
				event,
				input: Inputs.proformasAccept,
				output: Outputs.proformasAccept,
				toRequest: ({ id }) => ({
					method: 'PUT',
					path: `/proformas/${segment(id)}/${action}`,
				}),
			},
			// unknown: raw caller input, parsed by call().
			input,
			{
				shape: (raw) => wrap('proforma', raw),
				log: (_, result) => ({
					proformaId: result.proforma.id,
					state: result.proforma.state ?? undefined,
				}),
			},
		);
}

export const proformasAccept: QuadernoEndpoints['proformasAccept'] =
	proformaAction('proformas.accept', 'accept');

export const proformasDecline: QuadernoEndpoints['proformasDecline'] =
	proformaAction('proformas.decline', 'decline');

export const proformasRevert: QuadernoEndpoints['proformasRevert'] =
	proformaAction('proformas.revert', 'revert');

/**
 * Converting issues a real invoice, and the response is that **new invoice**
 * (201), not the proforma: the reference documents `invoice` as the body. It is
 * therefore returned under `invoice`, with the invoice's own id and number.
 */
export const proformasConvert: QuadernoEndpoints['proformasConvert'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'proformas.convert',
			input: Inputs.proformasConvert,
			output: Outputs.proformasConvert,
			toRequest: ({ id }) => ({
				method: 'PUT',
				path: `/proformas/${segment(id)}/convert`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('invoice', raw),
			log: ({ id }, result) => ({
				proformaId: id,
				invoiceId: result.invoice.id,
				number: result.invoice.number ?? undefined,
			}),
		},
	);

export const proformasDeliver: QuadernoEndpoints['proformasDeliver'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'proformas.deliver',
			input: Inputs.proformasDeliver,
			output: Outputs.proformasDeliver,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/proformas/${segment(id)}/deliver`,
			}),
		},
		input,
		{
			shape: delivered,
			log: ({ id }) => ({ proformaId: id }),
		},
	);
