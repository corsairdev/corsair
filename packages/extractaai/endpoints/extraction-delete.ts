import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs, ExtractaJsonObject } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

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
