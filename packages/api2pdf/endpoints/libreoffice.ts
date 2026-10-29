import { logEventFromContext } from 'corsair/core';
import {
	assertApi2PdfSuccess,
	buildPostPayload,
	makeApi2PdfRequest,
} from '../client';
import type { Api2PdfEndpoints } from '../index';
import { cachePdfJob } from './shared';
import type { Api2PdfJobResponse } from './types';

export const thumbnail: Api2PdfEndpoints['libreOfficeThumbnail'] = async (
	ctx,
	input,
) => {
	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/libreoffice/thumbnail', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(
				{ url: input.url },
				{ inline: input.inline, fileName: input.fileName },
			),
		}),
	);

	await cachePdfJob(ctx, 'libreOfficeThumbnail', response);
	await logEventFromContext(
		ctx,
		'api2pdf.libreoffice.thumbnail',
		{ url: input.url },
		'completed',
	);

	return response;
};

export const pdfToHtml: Api2PdfEndpoints['libreOfficePdfToHtml'] = async (
	ctx,
	input,
) => {
	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/libreoffice/pdf-to-html', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(
				{ url: input.url },
				{ inline: input.inline, fileName: input.fileName },
			),
		}),
	);

	await cachePdfJob(ctx, 'libreOfficePdfToHtml', response);
	await logEventFromContext(
		ctx,
		'api2pdf.libreoffice.pdfToHtml',
		{ url: input.url },
		'completed',
	);

	return response;
};
