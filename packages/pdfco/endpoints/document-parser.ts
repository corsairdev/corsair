import { makePdfcoRequest } from '../client';
import type {
	DocumentParserInput,
	DocumentParserResponse,
	PdfcoEndpointContext,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function documentParser(
	ctx: PdfcoEndpointContext,
	input: DocumentParserInput,
): Promise<DocumentParserResponse> {
	const args = PdfcoEndpointInputSchemas.documentParser.parse(input);
	return await makePdfcoRequest<DocumentParserResponse>(
		'/v1/pdf/documentparser',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.documentParser,
			body: {
				url: args.url,
				templateId: args.templateId,
				template: args.template,
				password: args.password,
				inline: args.inline,
				pages: args.pages,
				outputFormat: args.outputFormat,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}
