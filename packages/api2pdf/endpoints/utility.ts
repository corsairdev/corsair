import { logEventFromContext } from 'corsair/core';
import {
	assertApi2PdfSuccess,
	makeApi2PdfRequest,
	makeApi2PdfTextRequest,
} from '../client';
import type { Api2PdfEndpoints } from '../index';

export const checkStatus: Api2PdfEndpoints['checkStatus'] = async (ctx) => {
	const status = await makeApi2PdfTextRequest('/status', {
		apiKey: ctx.key,
	});

	await logEventFromContext(
		ctx,
		'api2pdf.utility.checkStatus',
		{},
		'completed',
	);

	return { status: status.trim() };
};

export const deletePdf: Api2PdfEndpoints['deletePdf'] = async (ctx, input) => {
	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<{ Success?: boolean; Error?: string }>(
			`/file/${encodeURIComponent(input.responseId)}`,
			{
				apiKey: ctx.key,
				method: 'DELETE',
			},
		),
	);

	await logEventFromContext(
		ctx,
		'api2pdf.utility.deletePdf',
		{ responseId: input.responseId },
		'completed',
	);

	return response;
};
