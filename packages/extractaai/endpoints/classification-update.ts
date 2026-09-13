import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const update: ExtractaaiEndpoints['classificationUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationUpdate']
	>('documentClassification/updateClassification', ctx.key, {
		method: 'PATCH',
		body: {
			classificationId: input.classificationId,
			classificationDetails: input.classificationDetails,
		},
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationUpdate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.update response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};
