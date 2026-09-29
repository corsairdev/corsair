import { makePdfcoRequest } from '../client';
import type {
	FileUploadInput,
	FileUploadResponse,
	PdfcoEndpointContext,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function fileUpload(
	ctx: PdfcoEndpointContext,
	input: FileUploadInput,
): Promise<FileUploadResponse> {
	const args = PdfcoEndpointInputSchemas.fileUpload.parse(input);
	return await makePdfcoRequest<FileUploadResponse>(
		'/v1/file/upload/url',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.fileUpload,
			body: {
				url: args.url,
				name: args.name,
			},
		},
	);
}
