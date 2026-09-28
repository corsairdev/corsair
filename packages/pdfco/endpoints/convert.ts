import { makePdfcoRequest } from '../client';
import type {
	PdfcoEndpointContext,
	PdfToCsvInput,
	PdfToCsvResponse,
	PdfToHtmlInput,
	PdfToHtmlResponse,
	PdfToImageInput,
	PdfToImageResponse,
	PdfToTextInput,
	PdfToTextResponse,
	PdfToXlsInput,
	PdfToXlsResponse,
	PdfToXlsxInput,
	PdfToXlsxResponse,
	PdfToXmlInput,
	PdfToXmlResponse,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function pdfToCsv(
	ctx: PdfcoEndpointContext,
	input: PdfToCsvInput,
): Promise<PdfToCsvResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToCsv.parse(input);
	return await makePdfcoRequest<PdfToCsvResponse>(
		'/v1/pdf/convert/to/csv',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToCsv,
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

export async function pdfToHtml(
	ctx: PdfcoEndpointContext,
	input: PdfToHtmlInput,
): Promise<PdfToHtmlResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToHtml.parse(input);
	return await makePdfcoRequest<PdfToHtmlResponse>(
		'/v1/pdf/convert/to/html',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToHtml,
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

export async function pdfToImage(
	ctx: PdfcoEndpointContext,
	input: PdfToImageInput,
): Promise<PdfToImageResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToImage.parse(input);
	const format = args.format ?? 'png';
	return await makePdfcoRequest<PdfToImageResponse>(
		`/v1/pdf/convert/to/${format}`,
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToImage,
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

export async function pdfToText(
	ctx: PdfcoEndpointContext,
	input: PdfToTextInput,
): Promise<PdfToTextResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToText.parse(input);
	return await makePdfcoRequest<PdfToTextResponse>(
		'/v1/pdf/convert/to/text',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToText,
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

export async function pdfToXls(
	ctx: PdfcoEndpointContext,
	input: PdfToXlsInput,
): Promise<PdfToXlsResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToXls.parse(input);
	return await makePdfcoRequest<PdfToXlsResponse>(
		'/v1/pdf/convert/to/xls',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToXls,
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

export async function pdfToXlsx(
	ctx: PdfcoEndpointContext,
	input: PdfToXlsxInput,
): Promise<PdfToXlsxResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToXlsx.parse(input);
	return await makePdfcoRequest<PdfToXlsxResponse>(
		'/v1/pdf/convert/to/xlsx',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToXlsx,
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

export async function pdfToXml(
	ctx: PdfcoEndpointContext,
	input: PdfToXmlInput,
): Promise<PdfToXmlResponse> {
	const args = PdfcoEndpointInputSchemas.pdfToXml.parse(input);
	return await makePdfcoRequest<PdfToXmlResponse>(
		'/v1/pdf/convert/to/xml',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.pdfToXml,
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
