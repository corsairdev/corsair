import type { Pdf4meEndpoints } from '..';
import { call } from './call';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
	pageList,
	shapeBinaryFile,
} from './types';

export const merge: Pdf4meEndpoints['pdfMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.merge',
			input: Inputs.pdfMerge,
			output: Outputs.pdfMerge,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/Merge',
			body: {
				docContent,
				docName,
				...rest,
				// jobIdExt/isAsync/callBackUrl stay at top level only when set.
			},
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const split: Pdf4meEndpoints['pdfSplit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.split',
			input: Inputs.pdfSplit,
			output: Outputs.pdfSplit,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/SplitPDF',
			body: { docContent, docName, ...rest },
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const compress: Pdf4meEndpoints['pdfCompress'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.compress',
			input: Inputs.pdfCompress,
			output: Outputs.pdfCompress,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/Optimize',
			body: { docContent, docName, ...rest },
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const extractPages: Pdf4meEndpoints['pdfExtractPages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.extractPages',
			input: Inputs.pdfExtractPages,
			output: Outputs.pdfExtractPages,
		},
		input,
		({ docContent, docName, pageNumbers, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/Extract',
			body: {
				docContent,
				docName,
				pageNumbers: pageList(pageNumbers),
				...rest,
			},
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const deletePages: Pdf4meEndpoints['pdfDeletePages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.deletePages',
			input: Inputs.pdfDeletePages,
			output: Outputs.pdfDeletePages,
		},
		input,
		({ docContent, docName, pageNumbers, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/DeletePages',
			body: {
				docContent,
				docName,
				pageNumbers: pageList(pageNumbers),
				...rest,
			},
			binary: true,
		}),
		{
			shape: shapeBinaryFile,
			log: (_, file) => ({ bytes: file.fileContent?.length ?? 0 }),
		},
	);

export const getInfo: Pdf4meEndpoints['pdfGetInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.getInfo',
			input: Inputs.pdfGetInfo,
			output: Outputs.pdfGetInfo,
		},
		input,
		// The docs page says GetPdfInformation, which answers 404 to any body
		// (live, 2026-11-21); GetPdfMetadata takes the same body.
		({ docContent, docName }) => ({
			method: 'POST',
			path: '/api/v2/GetPdfMetadata',
			body: { docContent, docName },
		}),
		{ log: (_, info) => ({ pageCount: info.pageCount ?? undefined }) },
	);
