import { makePdfcoRequest } from '../client';
import type {
	ExcelToCsvInput,
	ExcelToCsvResponse,
	ExcelToHtmlInput,
	ExcelToHtmlResponse,
	ExcelToJsonInput,
	ExcelToJsonResponse,
	ExcelToTextInput,
	ExcelToTextResponse,
	ExcelToXmlInput,
	ExcelToXmlResponse,
	PdfcoEndpointContext,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

function excelBody(input: ExcelToCsvInput) {
	return {
		url: input.url,
		inline: input.inline,
		worksheetIndex: input.worksheetIndex,
		async: input.async,
		name: input.name,
		expiration: input.expiration,
		profiles: input.profiles,
	};
}

export async function excelToCsv(
	ctx: PdfcoEndpointContext,
	input: ExcelToCsvInput,
): Promise<ExcelToCsvResponse> {
	const args = PdfcoEndpointInputSchemas.excelToCsv.parse(input);
	return await makePdfcoRequest<ExcelToCsvResponse>(
		'/v1/xls/convert/to/csv',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.excelToCsv,
			body: excelBody(args),
		},
	);
}

export async function excelToHtml(
	ctx: PdfcoEndpointContext,
	input: ExcelToHtmlInput,
): Promise<ExcelToHtmlResponse> {
	const args = PdfcoEndpointInputSchemas.excelToHtml.parse(input);
	return await makePdfcoRequest<ExcelToHtmlResponse>(
		'/v1/xls/convert/to/html',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.excelToHtml,
			body: excelBody(args),
		},
	);
}

export async function excelToJson(
	ctx: PdfcoEndpointContext,
	input: ExcelToJsonInput,
): Promise<ExcelToJsonResponse> {
	const args = PdfcoEndpointInputSchemas.excelToJson.parse(input);
	return await makePdfcoRequest<ExcelToJsonResponse>(
		'/v1/xls/convert/to/json',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.excelToJson,
			body: excelBody(args),
		},
	);
}

export async function excelToText(
	ctx: PdfcoEndpointContext,
	input: ExcelToTextInput,
): Promise<ExcelToTextResponse> {
	const args = PdfcoEndpointInputSchemas.excelToText.parse(input);
	return await makePdfcoRequest<ExcelToTextResponse>(
		'/v1/xls/convert/to/txt',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.excelToText,
			body: excelBody(args),
		},
	);
}

export async function excelToXml(
	ctx: PdfcoEndpointContext,
	input: ExcelToXmlInput,
): Promise<ExcelToXmlResponse> {
	const args = PdfcoEndpointInputSchemas.excelToXml.parse(input);
	return await makePdfcoRequest<ExcelToXmlResponse>(
		'/v1/xls/convert/to/xml',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.excelToXml,
			body: excelBody(args),
		},
	);
}
