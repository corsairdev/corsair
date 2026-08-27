import type { FileUploadInput, FileUploadResponse } from './types';
import type { PdfcoContext } from '../index';
import { makePdfcoRequest } from '../client';

export async function fileUpload(
	ctx: PdfcoContext,
	input: FileUploadInput,
): Promise<FileUploadResponse> {
	const key = await ctx.getKey('endpoint');
	
	return await makePdfcoRequest<FileUploadResponse>(
		'/file/upload/url',
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
