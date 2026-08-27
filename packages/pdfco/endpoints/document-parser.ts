import type { DocumentParserInput, DocumentParserResponse } from './types';
import type { PdfcoContext } from '../index';
import { makePdfcoRequest } from '../client';

export async function documentParser(
	ctx: PdfcoContext,
	input: DocumentParserInput,
): Promise<DocumentParserResponse> {
	const key = await ctx.getKey('endpoint');
	
	return await makePdfcoRequest<DocumentParserResponse>(
		'/pdf/documentparser',
		key,
		{
			method: 'POST',
			body: {
				url: input.url,
				templateId: input.templateId,
			},
		},
	);
}
