import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

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
