import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynBinaryRequest, makeArynRequest } from '../client';
import { ArynEndpointInputSchemas, ArynEndpointOutputSchemas } from './types';

export const documentGet: ArynEndpoints['documentGet'] = async (ctx, input) => {
	const parsed = ArynEndpointInputSchemas.documentGet.parse(input);
	const response = await makeArynRequest<unknown>(
		`/v1/storage/docsets/${encodeURIComponent(parsed.docset_id)}/docs/${encodeURIComponent(parsed.doc_id)}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				include_elements: parsed.include_elements ?? true,
				include_binary: parsed.include_binary ?? false,
				include_original_elements: parsed.include_original_elements ?? false,
			},
		},
	);
	const output = ArynEndpointOutputSchemas.documentGet.parse(response ?? {});
	await logEventFromContext(
		ctx,
		'aryn.document.get',
		{ docset_id: parsed.docset_id, doc_id: parsed.doc_id },
		'completed',
	);
	return output;
};

export const documentGetBinary: ArynEndpoints['documentGetBinary'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.documentGetBinary.parse(input);
	const buffer = await makeArynBinaryRequest(
		`/v1/storage/docsets/${encodeURIComponent(parsed.docset_id)}/docs/${encodeURIComponent(parsed.doc_id)}/binary`,
		ctx.key,
	);
	const output = ArynEndpointOutputSchemas.documentGetBinary.parse({
		docset_id: parsed.docset_id,
		doc_id: parsed.doc_id,
		contentBase64: Buffer.from(buffer).toString('base64'),
	});
	await logEventFromContext(
		ctx,
		'aryn.document.getBinary',
		{ docset_id: parsed.docset_id, doc_id: parsed.doc_id },
		'completed',
	);
	return output;
};

export const documentPartition: ArynEndpoints['documentPartition'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.documentPartition.parse(input);
	const formData: Record<string, unknown> = {};
	if (parsed.file) {
		formData.file = parsed.file;
	} else if (parsed.file_url) {
		formData.file_url = parsed.file_url;
	}
	if (parsed.options) {
		formData.options = JSON.stringify(parsed.options);
	}
	const response = await makeArynRequest<unknown>(
		'/v1/document/partition',
		ctx.key,
		{
			method: 'POST',
			formData,
			baseUrl: 'https://api.aryn.cloud',
		},
	);
	const output = ArynEndpointOutputSchemas.documentPartition.parse(
		response ?? {},
	);
	await logEventFromContext(ctx, 'aryn.document.partition', {}, 'completed');
	return output;
};

export const documentSubmitAsyncAdd: ArynEndpoints['documentSubmitAsyncAdd'] =
	async (ctx, input) => {
		const parsed = ArynEndpointInputSchemas.documentSubmitAsyncAdd.parse(input);
		const formData: Record<string, unknown> = {};
		if (parsed.file) {
			formData.file = parsed.file;
		} else if (parsed.file_url) {
			formData.file_url = parsed.file_url;
		}
		if (parsed.options) {
			formData.options = JSON.stringify(parsed.options);
		}
		const response = await makeArynRequest<unknown>(
			`/v1/async/submit/storage/docsets/${encodeURIComponent(parsed.docset_id)}/docs`,
			ctx.key,
			{
				method: 'POST',
				formData,
			},
		);
		const output = ArynEndpointOutputSchemas.documentSubmitAsyncAdd.parse(
			response ?? {},
		);
		await logEventFromContext(
			ctx,
			'aryn.document.submitAsyncAdd',
			{ docset_id: parsed.docset_id },
			'completed',
		);
		return output;
	};
