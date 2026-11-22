import type { Pdf4meEndpoints } from '..';
import { call } from './call';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
	shapeBinaryFile,
} from './types';

/** A JSON answer as is; a 202 job answer (isAsync) as its job fields. */
// unknown: raw is the response body; the output schema checks the result.
function shapeExtract(raw: unknown): unknown {
	const record =
		raw && typeof raw === 'object' && !Array.isArray(raw)
			? (raw as Record<string, unknown>)
			: undefined;
	// Sync answers carry a jobId too; only the 202 job answer has a statusUrl.
	return record && typeof record.statusUrl === 'string'
		? shapeBinaryFile(raw)
		: raw;
}

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
		{ shape: shapeExtract, log: () => ({}) },
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
		{ shape: shapeExtract, log: () => ({}) },
	);
