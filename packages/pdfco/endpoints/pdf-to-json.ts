import { makePdfcoRequest } from '../client';
import type {
	PdfcoEndpointContext,
	PdfToJsonInput,
	PdfToJsonResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfToJson(
	ctx: PdfcoEndpointContext,
	input: PdfToJsonInput,
): Promise<PdfToJsonResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToJson.parse(input);
	return await makePdfcoRequest<PdfToJsonResponse>(
		'/v1/pdf/convert/to/json',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToJson,
			body: {
				url: args.url,
				pages: args.pages,
				inline: args.inline,
				password: args.password,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}
