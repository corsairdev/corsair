import { makePdfcoRequest } from '../client';
import type {
	PdfcoEndpointContext,
	PdfSplitInput,
	PdfSplitResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfSplit(
	ctx: PdfcoEndpointContext,
	input: PdfSplitInput,
): Promise<PdfSplitResponse> {
	const args = PdfcoEndpointInputSchemas.pdfSplit.parse(input);
	return await makePdfcoRequest<PdfSplitResponse>('/v1/pdf/split', ctx.key, {
		schema: PdfcoEndpointOutputSchemas.pdfSplit,
		body: {
			url: args.url,
			pages: args.pages,
			password: args.password,
			async: args.async,
			name: args.name,
			expiration: args.expiration,
			profiles: args.profiles,
		},
	});
}
