import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

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
