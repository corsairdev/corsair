import type { FreshBooksEndpoints } from '..';
import { segment } from '../client';
import { FreshBooksEndpointInputSchemas as Inputs, FreshBooksEndpointOutputSchemas as Outputs } from './types';
import { call } from './call';

const base = (accountId: string) =>
	`/accounting/account/${segment(accountId)}/invoices/invoices`;

export const list: FreshBooksEndpoints['invoicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
			envelope: 'accounting',
		},
		input,
		({ accountId, page, per_page }) => ({
			method: 'GET',
			path: base(accountId),
			query: { page, per_page },
		}),
		{ log: ({ accountId }) => ({ accountId }) },
	);

export const get: FreshBooksEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoiceId }) => ({
			method: 'GET',
			path: `${base(accountId)}/${segment(invoiceId)}`,
		}),
		{ log: ({ accountId, invoiceId }) => ({ accountId, invoiceId }) },
	);

export const create: FreshBooksEndpoints['invoicesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.create',
			input: Inputs.invoicesCreate,
			output: Outputs.invoicesCreate,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoice }) => ({
			method: 'POST',
			path: base(accountId),
			body: { invoice },
		}),
		{
			// Creating invoices concurrently without invoice_number can collide
			// (409); error-handlers.ts retries that one case, per the docs.
			log: ({ accountId, invoice }) => ({
				accountId,
				customerId: invoice.customerid,
				invoiceNumber: invoice.invoice_number,
			}),
		},
	);

export const update: FreshBooksEndpoints['invoicesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.update',
			input: Inputs.invoicesUpdate,
			output: Outputs.invoicesUpdate,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoiceId, invoice }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(invoiceId)}`,
			body: { invoice },
		}),
		{ log: ({ accountId, invoiceId }) => ({ accountId, invoiceId }) },
	);

// Marks a draft sent without emailing anyone. The client-facing status
// changes, but nothing goes out.
export const markSent: FreshBooksEndpoints['invoicesMarkSent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.markSent',
			input: Inputs.invoicesMarkSent,
			output: Outputs.invoicesMarkSent,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoiceId }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(invoiceId)}`,
			body: { invoice: { action_mark_as_sent: true } },
		}),
		{ log: ({ accountId, invoiceId }) => ({ accountId, invoiceId }) },
	);

export const sendEmail: FreshBooksEndpoints['invoicesSendEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.sendEmail',
			input: Inputs.invoicesSendEmail,
			output: Outputs.invoicesSendEmail,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoiceId, ...email }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(invoiceId)}`,
			body: { invoice: { action_email: true, ...email } },
		}),
		{ log: ({ accountId, invoiceId }) => ({ accountId, invoiceId }) },
	);

// Soft delete, same vis_state semantics as the other accounting resources.
export const remove: FreshBooksEndpoints['invoicesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.delete',
			input: Inputs.invoicesDelete,
			output: Outputs.invoicesDelete,
			envelope: 'accounting',
		},
		input,
		({ accountId, invoiceId }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(invoiceId)}`,
			body: { invoice: { vis_state: 1 } },
		}),
		{ log: ({ accountId, invoiceId }) => ({ accountId, invoiceId }) },
	);
