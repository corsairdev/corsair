import type { SquareEndpoints } from '../index';
import { buildUploadForm, callSquare, decodeBase64 } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/invoices/{invoice_id}/cancel (CancelInvoice). */
export const cancel: SquareEndpoints['invoicesCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesCancel.parse(rawInput);
	const { invoice_id, ...body } = input;
	return callSquare(ctx, '/v2/invoices/{invoice_id}/cancel', {
		method: 'POST',
		body,
		path: { invoice_id },
		output: SquareEndpointOutputSchemas.invoicesCancel,
		event: 'invoices.cancel',
		logged: { invoice_id },
	});
};

/**
 * POST /v2/invoices/{invoice_id}/attachments (CreateInvoiceAttachment) as multipart/form-data: a JSON
 * `request` form field and the file in `image_file`. The file arrives as base64
 * and malformed base64 is refused before anything is sent.
 */
export const createAttachment: SquareEndpoints['invoicesCreateAttachment'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.invoicesCreateAttachment.parse(rawInput);
		const { invoice_id, file_base64, filename, content_type, ...request } =
			input;
		const bytes = decodeBase64(file_base64, 'file_base64');

		const formData = buildUploadForm(request, {
			bytes,
			contentType: content_type ?? 'image/jpeg',
			filename,
		});

		return callSquare(ctx, '/v2/invoices/{invoice_id}/attachments', {
			method: 'POST',
			formData,
			path: { invoice_id: input.invoice_id },
			output: SquareEndpointOutputSchemas.invoicesCreateAttachment,
			event: 'invoices.createAttachment',
			logged: { invoice_id: input.invoice_id, bytes: bytes.length },
		});
	};

/** DELETE /v2/invoices/{invoice_id} (DeleteInvoice). */
export const remove: SquareEndpoints['invoicesDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesDelete.parse(rawInput);
	const { invoice_id, ...query } = input;
	return callSquare(ctx, '/v2/invoices/{invoice_id}', {
		method: 'DELETE',
		query,
		path: { invoice_id },
		output: SquareEndpointOutputSchemas.invoicesDelete,
		event: 'invoices.delete',
		logged: { invoice_id },
	});
};

/** DELETE /v2/invoices/{invoice_id}/attachments/{attachment_id} (DeleteInvoiceAttachment). */
export const deleteAttachment: SquareEndpoints['invoicesDeleteAttachment'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.invoicesDeleteAttachment.parse(rawInput);
		return callSquare(
			ctx,
			'/v2/invoices/{invoice_id}/attachments/{attachment_id}',
			{
				method: 'DELETE',
				path: {
					invoice_id: input.invoice_id,
					attachment_id: input.attachment_id,
				},
				output: SquareEndpointOutputSchemas.invoicesDeleteAttachment,
				event: 'invoices.deleteAttachment',
				logged: {
					invoice_id: input.invoice_id,
					attachment_id: input.attachment_id,
				},
			},
		);
	};

/** GET /v2/invoices/{invoice_id} (GetInvoice). */
export const get: SquareEndpoints['invoicesGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.invoicesGet.parse(rawInput);
	return callSquare(ctx, '/v2/invoices/{invoice_id}', {
		path: { invoice_id: input.invoice_id },
		output: SquareEndpointOutputSchemas.invoicesGet,
		event: 'invoices.get',
		logged: { invoice_id: input.invoice_id },
	});
};

/** GET /v2/invoices (ListInvoices). */
export const list: SquareEndpoints['invoicesList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.invoicesList.parse(rawInput);
	return callSquare(ctx, '/v2/invoices', {
		query: input,
		output: SquareEndpointOutputSchemas.invoicesList,
		event: 'invoices.list',
	});
};

/** POST /v2/invoices (CreateInvoice). */
export const create: SquareEndpoints['invoicesCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesCreate.parse(rawInput);
	return callSquare(ctx, '/v2/invoices', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.invoicesCreate,
		event: 'invoices.create',
	});
};

/** POST /v2/invoices/{invoice_id}/publish (PublishInvoice). */
export const publish: SquareEndpoints['invoicesPublish'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesPublish.parse(rawInput);
	const { invoice_id, ...body } = input;
	return callSquare(ctx, '/v2/invoices/{invoice_id}/publish', {
		method: 'POST',
		body,
		path: { invoice_id },
		output: SquareEndpointOutputSchemas.invoicesPublish,
		event: 'invoices.publish',
		logged: { invoice_id },
	});
};

/** PUT /v2/invoices/{invoice_id} (UpdateInvoice). */
export const update: SquareEndpoints['invoicesUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesUpdate.parse(rawInput);
	const { invoice_id, ...body } = input;
	return callSquare(ctx, '/v2/invoices/{invoice_id}', {
		method: 'PUT',
		body,
		path: { invoice_id },
		output: SquareEndpointOutputSchemas.invoicesUpdate,
		event: 'invoices.update',
		logged: { invoice_id },
	});
};

/** POST /v2/invoices/search (SearchInvoices). */
export const search: SquareEndpoints['invoicesSearch'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.invoicesSearch.parse(rawInput);
	return callSquare(ctx, '/v2/invoices/search', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.invoicesSearch,
		event: 'invoices.search',
	});
};
