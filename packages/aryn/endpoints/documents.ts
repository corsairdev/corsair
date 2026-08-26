import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import type { ArynEndpointOutputs } from './types';

export const documentGet: ArynEndpoints['documentGet'] = async (ctx, input) => {
	const response = await makeArynRequest<ArynEndpointOutputs['documentGet']>(
		`/v1/storage/docsets/${input.docset_id}/docs/${input.doc_id}`,
		ctx.key,
		{
			method: 'GET',
			body: {
				include_elements: input.include_elements ?? true,
				include_binary: input.include_binary ?? false,
				include_original_elements: input.include_original_elements ?? false,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'aryn.document.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const documentGetBinary: ArynEndpoints['documentGetBinary'] = async (
	ctx,
	input,
) => {
	const response = await makeArynRequest<
		ArynEndpointOutputs['documentGetBinary']
	>(
		`/v1/storage/docsets/${input.docset_id}/docs/${input.doc_id}/binary`,
		ctx.key,
		{
			method: 'GET',
			responseType: 'binary',
		},
	);

	await logEventFromContext(
		ctx,
		'aryn.document.getBinary',
		{ ...input },
		'completed',
	);
	return response;
};

export const documentPartition: ArynEndpoints['documentPartition'] = async (
	ctx,
	input,
) => {
	const formData: Record<string, unknown> = {};
	if (input.file) {
		formData.file = input.file;
	} else if (input.file_url) {
		formData.file_url = input.file_url;
	}

	if (input.options) {
		formData.options = JSON.stringify(input.options);
	}

	const response = await makeArynRequest<
		ArynEndpointOutputs['documentPartition']
	>('/v1/document/partition', ctx.key, {
		method: 'POST',
		formData,
		baseUrl: 'https://api.aryn.cloud',
	});

	await logEventFromContext(
		ctx,
		'aryn.document.partition',
		{ ...input },
		'completed',
	);
	return response;
};

export const documentSubmitAsyncAdd: ArynEndpoints['documentSubmitAsyncAdd'] =
	async (ctx, input) => {
		const formData: Record<string, unknown> = {};
		if (input.file) {
			formData.file = input.file;
		} else if (input.file_url) {
			formData.file_url = input.file_url;
		}

		if (input.options) {
			formData.options = JSON.stringify(input.options);
		}

		const response = await makeArynRequest<
			ArynEndpointOutputs['documentSubmitAsyncAdd']
		>(`/v1/async/submit/storage/docsets/${input.docset_id}/docs`, ctx.key, {
			method: 'POST',
			formData,
		});

		await logEventFromContext(
			ctx,
			'aryn.document.submitAsyncAdd',
			{ ...input },
			'completed',
		);
		return response;
	};
