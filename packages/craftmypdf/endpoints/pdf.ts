import type { CraftmypdfEndpoints } from '..';
import { call } from './call';
import {
	CraftmypdfEndpointInputSchemas as Inputs,
	CraftmypdfEndpointOutputSchemas as Outputs,
} from './types';

/**
 * CraftMyPDF documents `data` as required on the generation calls, and
 * `load_data_from` as an override of it. Sending an empty object with a URL
 * satisfies the documented requirement without inventing data.
 */
function dataOrEmpty(data: string | object | undefined): string | object {
	return data ?? {};
}

export const create: CraftmypdfEndpoints['pdfCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.create',
			input: Inputs.pdfCreate,
			output: Outputs.pdfCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create',
			body: {
				...parsed,
				data: dataOrEmpty(parsed.data),
			},
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const createAsync: CraftmypdfEndpoints['pdfCreateAsync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.createAsync',
			input: Inputs.pdfCreateAsync,
			output: Outputs.pdfCreateAsync,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create-async',
			body: { ...parsed, data: dataOrEmpty(parsed.data) },
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const createImage: CraftmypdfEndpoints['pdfCreateImage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.createImage',
			input: Inputs.pdfCreateImage,
			output: Outputs.pdfCreateImage,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create-image',
			body: { ...parsed, data: dataOrEmpty(parsed.data) },
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const createMerge: CraftmypdfEndpoints['pdfCreateMerge'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.createMerge',
			input: Inputs.pdfCreateMerge,
			output: Outputs.pdfCreateMerge,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create-merge',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const createParallel: CraftmypdfEndpoints['pdfCreateParallel'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.createParallel',
			input: Inputs.pdfCreateParallel,
			output: Outputs.pdfCreateParallel,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create-parallel',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				count: result.results?.length,
				merged: Boolean(result.merge_result?.file),
			}),
		},
	);

export const addWatermark: CraftmypdfEndpoints['pdfAddWatermark'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.addWatermark',
			input: Inputs.pdfAddWatermark,
			output: Outputs.pdfAddWatermark,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/add-watermark',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const addText: CraftmypdfEndpoints['pdfAddText'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.addText',
			input: Inputs.pdfAddText,
			output: Outputs.pdfAddText,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/add-text-to-pdf',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const updateFields: CraftmypdfEndpoints['pdfUpdateFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.updateFields',
			input: Inputs.pdfUpdateFields,
			output: Outputs.pdfUpdateFields,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/update-pdf-fields',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				fields: result.field_statuses?.length,
			}),
		},
	);

export const merge: CraftmypdfEndpoints['pdfMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.merge',
			input: Inputs.pdfMerge,
			output: Outputs.pdfMerge,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/merge-pdfs',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				transactionRef: result.transaction_ref ?? undefined,
			}),
		},
	);

export const getInfo: CraftmypdfEndpoints['pdfGetInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.getInfo',
			input: Inputs.pdfGetInfo,
			output: Outputs.pdfGetInfo,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/get-pdf-info',
			query: { url: parsed.url },
		}),
		{
			log: (_, result) => ({ totalPages: result.totalPages ?? undefined }),
		},
	);
