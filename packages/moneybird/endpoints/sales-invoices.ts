import type { MoneybirdEndpoints } from '..';
import { idSegment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MoneybirdEndpoints['salesInvoicesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'salesInvoices.list',
			input: Inputs.salesInvoicesList,
			output: Outputs.salesInvoicesList,
		},
		input,
		({ page, per_page, filter }) => ({
			replayable: true,
			method: 'GET',
			path: '/sales_invoices.json',
			query: { page, per_page, filter },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page, parsed.per_page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MoneybirdEndpoints['salesInvoicesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'salesInvoices.get',
			input: Inputs.salesInvoicesGet,
			output: Outputs.salesInvoicesGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/sales_invoices/${idSegment(id)}.json`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const create: MoneybirdEndpoints['salesInvoicesCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'salesInvoices.create',
			input: Inputs.salesInvoicesCreate,
			output: Outputs.salesInvoicesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/sales_invoices.json',
			body: { sales_invoice: parsed },
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id, state: result.state ?? undefined }),
		},
	);

export const update: MoneybirdEndpoints['salesInvoicesUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'salesInvoices.update',
			input: Inputs.salesInvoicesUpdate,
			output: Outputs.salesInvoicesUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/sales_invoices/${idSegment(id)}.json`,
			body: { sales_invoice: rest },
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

/**
 * Sends the invoice now or schedules it for invoice_date. Destructive: it
 * sends a message to a customer.
 */
export const send: MoneybirdEndpoints['salesInvoicesSend'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'salesInvoices.send',
			input: Inputs.salesInvoicesSend,
			output: Outputs.salesInvoicesSend,
		},
		input,
		({
			id,
			sending_scheduled,
			invoice_date,
			delivery_method,
			email,
			message,
		}) => ({
			// A lost answer may still have emailed the customer.
			replayable: false,
			method: 'PATCH',
			path: `/sales_invoices/${idSegment(id)}/send_invoice.json`,
			body: {
				sales_invoice_sending: {
					sending_scheduled,
					invoice_date,
					delivery_method,
					email,
					message,
				},
			},
			mediaType: 'application/json',
		}),
		{
			log: ({ id, sending_scheduled }) => ({
				id,
				scheduled: sending_scheduled ?? false,
			}),
		},
	);

export const remove: MoneybirdEndpoints['salesInvoicesDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'salesInvoices.delete',
			input: Inputs.salesInvoicesDelete,
			output: Outputs.salesInvoicesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/sales_invoices/${idSegment(id)}.json`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, String(id)),
			log: ({ id }) => ({ id }),
		},
	);
