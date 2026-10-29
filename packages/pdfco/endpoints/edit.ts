import { makePdfcoRequest } from '../client';
import type {
	PdfAddInput,
	PdfAddResponse,
	PdfcoEndpointContext,
	PdfDeletePagesInput,
	PdfDeletePagesResponse,
	PdfRotateInput,
	PdfRotateResponse,
	PdfSearchAndDeleteTextInput,
	PdfSearchAndDeleteTextResponse,
	PdfSearchAndReplaceTextInput,
	PdfSearchAndReplaceTextResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfAdd(
	ctx: PdfcoEndpointContext,
	input: PdfAddInput,
): Promise<PdfAddResponse> {
	const args = PdfcoEndpointInputSchemas.pdfAdd.parse(input);
	return await makePdfcoRequest<PdfAddResponse>('/v1/pdf/edit/add', ctx.key, {
		schema: PdfcoEndpointOutputSchemas.pdfAdd,
		body: {
			url: args.url,
			annotations: args.annotations,
			images: args.images,
			fields: args.fields,
			annotationsString: args.annotationsString,
			imagesString: args.imagesString,
			fieldsString: args.fieldsString,
			password: args.password,
			async: args.async,
			name: args.name,
			expiration: args.expiration,
			profiles: args.profiles,
		},
	});
}

export async function pdfDeletePages(
	ctx: PdfcoEndpointContext,
	input: PdfDeletePagesInput,
): Promise<PdfDeletePagesResponse> {
	const args = PdfcoEndpointInputSchemas.pdfDeletePages.parse(input);
	return await makePdfcoRequest<PdfDeletePagesResponse>(
		'/v1/pdf/edit/delete-pages',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfDeletePages,
			body: {
				url: args.url,
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

export async function pdfRotate(
	ctx: PdfcoEndpointContext,
	input: PdfRotateInput,
): Promise<PdfRotateResponse> {
	const args = PdfcoEndpointInputSchemas.pdfRotate.parse(input);
	return await makePdfcoRequest<PdfRotateResponse>(
		'/v1/pdf/edit/rotate',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfRotate,
			body: {
				url: args.url,
				pages: args.pages,
				angle: args.angle,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}

export async function pdfSearchAndReplaceText(
	ctx: PdfcoEndpointContext,
	input: PdfSearchAndReplaceTextInput,
): Promise<PdfSearchAndReplaceTextResponse> {
	const args = PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse(input);
	return await makePdfcoRequest<PdfSearchAndReplaceTextResponse>(
		'/v1/pdf/edit/replace-text',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfSearchAndReplaceText,
			body: {
				url: args.url,
				searchString: args.searchString,
				replaceString: args.replaceString,
				searchStrings: args.searchStrings,
				replaceStrings: args.replaceStrings,
				caseSensitive: args.caseSensitive,
				regex: args.regex,
				replacementLimit: args.replacementLimit,
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

export async function pdfSearchAndDeleteText(
	ctx: PdfcoEndpointContext,
	input: PdfSearchAndDeleteTextInput,
): Promise<PdfSearchAndDeleteTextResponse> {
	const args = PdfcoEndpointInputSchemas.pdfSearchAndDeleteText.parse(input);
	return await makePdfcoRequest<PdfSearchAndDeleteTextResponse>(
		'/v1/pdf/edit/delete-text',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfSearchAndDeleteText,
			body: {
				url: args.url,
				searchString: args.searchString,
				searchStrings: args.searchStrings,
				caseSensitive: args.caseSensitive,
				regex: args.regex,
				replacementLimit: args.replacementLimit,
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
