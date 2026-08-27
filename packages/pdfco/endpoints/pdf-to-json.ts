import type { PdfToJsonInput, PdfToJsonResponse } from './types';
import type { PdfcoContext } from '../index';
import { makePdfcoRequest } from '../client';

export async function pdfToJson(
	ctx: PdfcoContext,
	input: PdfToJsonInput,
): Promise<PdfToJsonResponse> {
	const key = await ctx.getKey('endpoint');
	
	return await makePdfcoRequest<PdfToJsonResponse>(
		'/pdf/convert/to/json',
		key,
		{
			method: 'POST',
			body: {
				url: input.url,
				inline: input.inline,
			},
		},
	);
}
