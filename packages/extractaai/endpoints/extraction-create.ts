import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
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
