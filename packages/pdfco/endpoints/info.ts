import { makePdfcoRequest } from '../client';
import type {
	PdfChangeTextSearchableInput,
	PdfChangeTextSearchableResponse,
	PdfcoEndpointContext,
	PdfExtractAttachmentsInput,
	PdfExtractAttachmentsResponse,
	PdfFindInput,
	PdfFindResponse,
	PdfFormsInfoReaderInput,
	PdfFormsInfoReaderResponse,
	PdfInfoReaderInput,
	PdfInfoReaderResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfInfoReader(
	ctx: PdfcoEndpointContext,
	input: PdfInfoReaderInput,
): Promise<PdfInfoReaderResponse> {
	const args = PdfcoEndpointInputSchemas.pdfInfoReader.parse(input);
	return await makePdfcoRequest<PdfInfoReaderResponse>(
		'/v1/pdf/info',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfInfoReader,
			body: {
				url: args.url,
				password: args.password,
				async: args.async,
				profiles: args.profiles,
			},
		},
	);
}

export async function pdfFormsInfoReader(
	ctx: PdfcoEndpointContext,
	input: PdfFormsInfoReaderInput,
): Promise<PdfFormsInfoReaderResponse> {
	const args = PdfcoEndpointInputSchemas.pdfFormsInfoReader.parse(input);
	return await makePdfcoRequest<PdfFormsInfoReaderResponse>(
		'/v1/pdf/info/fields',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfFormsInfoReader,
			body: {
				url: args.url,
				password: args.password,
				async: args.async,
				profiles: args.profiles,
			},
		},
	);
}

export async function pdfFind(
	ctx: PdfcoEndpointContext,
	input: PdfFindInput,
): Promise<PdfFindResponse> {
	const args = PdfcoEndpointInputSchemas.pdfFind.parse(input);
	return await makePdfcoRequest<PdfFindResponse>('/v1/pdf/find', ctx.key, {
		schema: PdfcoEndpointOutputSchemas.pdfFind,
		body: {
			url: args.url,
			searchString: args.searchString,
			pages: args.pages,
			regexSearch: args.regexSearch,
			password: args.password,
			async: args.async,
			profiles: args.profiles,
		},
	});
}

export async function pdfExtractAttachments(
	ctx: PdfcoEndpointContext,
	input: PdfExtractAttachmentsInput,
): Promise<PdfExtractAttachmentsResponse> {
	const args = PdfcoEndpointInputSchemas.pdfExtractAttachments.parse(input);
	return await makePdfcoRequest<PdfExtractAttachmentsResponse>(
		'/v1/pdf/attachments/extract',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfExtractAttachments,
			body: {
				url: args.url,
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

export async function pdfChangeTextSearchable(
	ctx: PdfcoEndpointContext,
	input: PdfChangeTextSearchableInput,
): Promise<PdfChangeTextSearchableResponse> {
	const args = PdfcoEndpointInputSchemas.pdfChangeTextSearchable.parse(input);
	return await makePdfcoRequest<PdfChangeTextSearchableResponse>(
		'/v1/pdf/makesearchable',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfChangeTextSearchable,
			body: {
				url: args.url,
				lang: args.lang,
				pages: args.pages,
				password: args.password,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}
