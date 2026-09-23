import { makePdfcoRequest } from '../client';
import type {
	PdfcoEndpointContext,
	PdfMergeInput,
	PdfMergeResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfMerge(
	ctx: PdfcoEndpointContext,
	input: PdfMergeInput,
): Promise<PdfMergeResponse> {
	const args = PdfcoEndpointInputSchemas.pdfMerge.parse(input);
	return await makePdfcoRequest<PdfMergeResponse>('/v1/pdf/merge', ctx.key, {
		schema: PdfcoEndpointOutputSchemas.pdfMerge,
		body: {
			url: args.url,
			name: args.name,
			expiration: args.expiration,
			async: args.async,
			profiles: args.profiles,
		},
	});
}
