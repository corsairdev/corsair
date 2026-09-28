import { makePdfcoRequest } from '../client';
import type {
	PdfcoEndpointContext,
	PdfFromEmailInput,
	PdfFromEmailResponse,
	PdfFromHtmlInput,
	PdfFromHtmlResponse,
	PdfFromTextInput,
	PdfFromTextResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfFromHtml(
	ctx: PdfcoEndpointContext,
	input: PdfFromHtmlInput,
): Promise<PdfFromHtmlResponse> {
	const args = PdfcoEndpointInputSchemas.pdfFromHtml.parse(input);
	return await makePdfcoRequest<PdfFromHtmlResponse>(
		'/v1/pdf/convert/from/html',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfFromHtml,
			body: {
				html: args.html,
				margins: args.margins,
				paperSize: args.paperSize,
				orientation: args.orientation,
				printBackground: args.printBackground,
				header: args.header,
				footer: args.footer,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}

export async function pdfFromEmail(
	ctx: PdfcoEndpointContext,
	input: PdfFromEmailInput,
): Promise<PdfFromEmailResponse> {
	const args = PdfcoEndpointInputSchemas.pdfFromEmail.parse(input);
	return await makePdfcoRequest<PdfFromEmailResponse>(
		'/v1/pdf/convert/from/email',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfFromEmail,
			body: {
				url: args.url,
				embedAttachments: args.embedAttachments,
				convertAttachments: args.convertAttachments,
				margins: args.margins,
				paperSize: args.paperSize,
				orientation: args.orientation,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}

export async function pdfFromText(
	ctx: PdfcoEndpointContext,
	input: PdfFromTextInput,
): Promise<PdfFromTextResponse> {
	const args = PdfcoEndpointInputSchemas.pdfFromText.parse(input);
	return await makePdfcoRequest<PdfFromTextResponse>(
		'/v1/pdf/convert/from/doc',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfFromText,
			body: {
				url: args.url,
				pages: args.pages,
				autosize: args.autosize,
				async: args.async,
				name: args.name,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}
