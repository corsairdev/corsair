import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs, ExtractaJsonObject } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const create: ExtractaaiEndpoints['extractionCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['extractionCreate']
	>('createExtraction', ctx.key, {
		method: 'POST',
		body: { extractionDetails: input.extractionDetails },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.extractionCreate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai extraction.create response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const view: ExtractaaiEndpoints['extractionView'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['extractionView']
	>('viewExtraction', ctx.key, {
		method: 'POST',
		body: { extractionId: input.extractionId },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.extractionView.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai extraction.view response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const update: ExtractaaiEndpoints['extractionUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['extractionUpdate']
	>('updateExtraction', ctx.key, {
		method: 'PATCH',
		body: {
			extractionId: input.extractionId,
			extractionDetails: input.extractionDetails,
		},
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.extractionUpdate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai extraction.update response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const deleteExtraction: ExtractaaiEndpoints['extractionDelete'] = async (
	ctx,
	input,
) => {
	const body: ExtractaJsonObject = { extractionId: input.extractionId };
	if (input.batchId !== undefined) {
		body['batchId'] = input.batchId;
	}
	if (input.fileId !== undefined) {
		body['fileId'] = input.fileId;
	}

	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['extractionDelete']
	>('deleteExtraction', ctx.key, {
		method: 'DELETE',
		body,
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.extractionDelete.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai extraction.delete response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const getBatchResults: ExtractaaiEndpoints['extractionGetBatchResults'] =
	async (ctx, input) => {
		const body: ExtractaJsonObject = {
			extractionId: input.extractionId,
			batchId: input.batchId,
		};
		if (input.fileId !== undefined) {
			body['fileId'] = input.fileId;
		}

		const response = await makeExtractaaiRequest<
			ExtractaaiEndpointOutputs['extractionGetBatchResults']
		>('getBatchResults', ctx.key, {
			method: 'POST',
			body,
		});

		const parsed =
			ExtractaaiEndpointOutputSchemas.extractionGetBatchResults.safeParse(
				response,
			);
		if (parsed.success === false) {
			throw new Error(
				`Extracta.ai extraction.getBatchResults response failed schema validation: ${parsed.error.message}`,
			);
		}
		return parsed.data;
	};
