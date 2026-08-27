import type { PdfSplitInput, PdfSplitResponse } from './types';
import type { PdfcoContext } from '../index';
import { makePdfcoRequest } from '../client';

export async function pdfSplit(
	ctx: PdfcoContext,
	input: PdfSplitInput,
): Promise<PdfSplitResponse> {
	const key = ctx.key;
	
	return await makePdfcoRequest<PdfSplitResponse>(
		'/pdf/split',
		key,
		{
			method: 'POST',
			body: {
				url: input.url,
				pages: input.pages,
			},
		},
	);
}
