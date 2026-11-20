import type { Pdf4meContext, Pdf4meEndpoints } from '..';
import { call } from './call';
import type { ConvertPdfToWordInput } from './types';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
	shapeBinaryFile,
} from './types';

export const pdfToWord: Pdf4meEndpoints['convertPdfToWord'] = (
	ctx: Pdf4meContext,
	input: ConvertPdfToWordInput,
) =>
	call(
		ctx,
		{
			event: 'convert.pdfToWord',
			input: Inputs.convertPdfToWord,
			output: Outputs.convertPdfToWord,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertPdfToWord',
			body: { docContent, docName, ...rest },
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const htmlToPdf: Pdf4meEndpoints['convertHtmlToPdf'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'convert.htmlToPdf',
			input: Inputs.convertHtmlToPdf,
			output: Outputs.convertHtmlToPdf,
		},
		input,
		({ htmlContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertHtmlToPdf',
			body: { htmlContent, docName, ...rest },
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const ocrPdf: Pdf4meEndpoints['convertOcrPdf'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'convert.ocrPdf',
			input: Inputs.convertOcrPdf,
			output: Outputs.convertOcrPdf,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertOcrPdf',
			body: { docContent, docName, ...rest },
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);
