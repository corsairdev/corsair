import type { Pdf4meEndpoints } from '..';
import { call } from './call';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
} from './types';

export const tableFromPdf: Pdf4meEndpoints['extractTableFromPdf'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extract.tableFromPdf',
			input: Inputs.extractTableFromPdf,
			output: Outputs.extractTableFromPdf,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ExtractTableFromPdf',
			body: { docContent, docName, ...rest },
		}),
		{ log: () => ({}) },
	);

export const pdfFormData: Pdf4meEndpoints['extractPdfFormData'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extract.pdfFormData',
			input: Inputs.extractPdfFormData,
			output: Outputs.extractPdfFormData,
		},
		input,
		({ docContent, docName, ...rest }) => ({
			method: 'POST',
			path: '/api/v2/ExtractPdfFormData',
			body: { docContent, docName, ...rest },
		}),
		{ log: () => ({}) },
	);
