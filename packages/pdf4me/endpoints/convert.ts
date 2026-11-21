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
		({ docContent, docName, ocrWhenNeeded, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertPdfToWord',
			// The docs type ocrWhenNeeded as a string the API parses.
			body: {
				docContent,
				docName,
				...rest,
				...(ocrWhenNeeded === undefined
					? {}
					: { ocrWhenNeeded: String(ocrWhenNeeded) }),
			},
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
		// The API reads the HTML from docContent, base64-encoded.
		({ htmlContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertHtmlToPdf',
			body: {
				docContent: Buffer.from(htmlContent, 'utf8').toString('base64'),
				docName,
				...rest,
			},
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
		({ docContent, docName, ocrWhenNeeded, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ConvertOcrPdf',
			body: {
				docContent,
				docName,
				...rest,
				...(ocrWhenNeeded === undefined
					? {}
					: { ocrWhenNeeded: String(ocrWhenNeeded) }),
			},
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);
