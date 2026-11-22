import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest, toLexofficeFileResponse } from '../client';
import type { DownPaymentInvoiceDetails } from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const get: LexofficeEndpoints['downPaymentInvoicesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.downPaymentInvoicesGet.parse(input);
	const response = await makeLexofficeRequest<DownPaymentInvoiceDetails>(
		`/down-payment-invoices/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		LexofficeEndpointOutputSchemas.downPaymentInvoicesGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.downPaymentInvoices.get',
		{ invoiceId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const download: LexofficeEndpoints['downPaymentInvoicesDownload'] =
	async (ctx, input) => {
		const parsedInput =
			LexofficeEndpointInputSchemas.downPaymentInvoicesDownload.parse(input);
		const response = await makeLexofficeRequest<BinaryResponse>(
			`/down-payment-invoices/${encodeURIComponent(parsedInput.id)}/file`,
			ctx.key,
			{
				method: 'GET',
				headers: { Accept: parsedInput.accept ?? '*/*' },
				responseType: 'binary',
			},
		);
		const parsed =
			LexofficeEndpointOutputSchemas.downPaymentInvoicesDownload.parse(
				toLexofficeFileResponse(response),
			);
		await logEventFromContext(
			ctx,
			'lexoffice.downPaymentInvoices.download',
			{ invoiceId: parsedInput.id, sizeBytes: parsed.sizeBytes },
			'completed',
		);
		return parsed;
	};
