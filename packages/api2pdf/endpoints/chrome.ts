import { logEventFromContext } from 'corsair/core';
import {
	assertApi2PdfSuccess,
	buildPostPayload,
	makeApi2PdfRequest,
} from '../client';
import type { Api2PdfEndpoints } from '../index';
import { cachePdfJob } from './shared';
import type { Api2PdfJobResponse } from './types';

export const addHeaderFooter: Api2PdfEndpoints['addHeaderFooter'] = async (
	ctx,
	input,
) => {
	// Chrome options bag is open-ended (API accepts arbitrary Headless Chrome flags);
	// Record<string, unknown> is required because the upstream schema is not fixed.
	const chromeOptions: Record<string, unknown> = {
		displayHeaderFooter: input.displayHeaderFooter ?? true,
	};

	if (input.headerTemplate) {
		chromeOptions.headerTemplate = input.headerTemplate;
	}
	if (input.footerTemplate) {
		chromeOptions.footerTemplate = input.footerTemplate;
	}

	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/chrome/pdf/html', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(
				{ html: input.html },
				{
					inline: input.inline,
					fileName: input.fileName,
					chromeOptions,
				},
			),
		}),
	);

	await cachePdfJob(ctx, 'addHeaderFooter', response);
	await logEventFromContext(
		ctx,
		'api2pdf.chrome.addHeaderFooter',
		{},
		'completed',
	);

	return response;
};
