import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const view: ExtractaaiEndpoints['classificationView'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationView']
	>('documentClassification/viewClassification', ctx.key, {
		method: 'POST',
		body: { classificationId: input.classificationId },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationView.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.view response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};
