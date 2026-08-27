import type { PdfMergeInput, PdfMergeResponse } from './types';
import type { PdfcoContext } from '../index';
import { makePdfcoRequest } from '../client';

export async function pdfMerge(
	ctx: PdfcoContext,
	input: PdfMergeInput,
): Promise<PdfMergeResponse> {
	const key = await ctx.getKey('endpoint');
	
	return await makePdfcoRequest<PdfMergeResponse>(
		'/pdf/merge',
		key,
		{
			method: 'POST',
			body: {
				url: input.url,
				name: input.name,
			},
		},
	);
}
