import { logEventFromContext } from 'corsair/core';
import { assertApi2PdfSuccess, makeApi2PdfRequest } from '../client';
import type { Api2PdfEndpoints } from '../index';
import { cachePdfJob } from './shared';
import type { Api2PdfJobResponse } from './types';

export const generateBarcode: Api2PdfEndpoints['generateBarcode'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		format: input.format,
		value: input.value,
	};

	if (input.height != null) query.height = input.height;
	if (input.width != null) query.width = input.width;
	if (input.showLabel != null) query.showlabel = input.showLabel;
	// JSON payload with FileUrl (default SDK uses outputBinary=true for /zebra).
	query.outputBinary = false;

	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/zebra', {
			apiKey: ctx.key,
			method: 'GET',
			query,
		}),
	);

	await cachePdfJob(ctx, 'generateBarcode', response);
	await logEventFromContext(
		ctx,
		'api2pdf.zebra.generateBarcode',
		{ format: input.format },
		'completed',
	);

	return response;
};
