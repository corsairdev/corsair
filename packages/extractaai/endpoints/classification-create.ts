import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const create: ExtractaaiEndpoints['classificationCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationCreate']
	>('documentClassification/createClassification', ctx.key, {
		method: 'POST',
		body: { classificationDetails: input.classificationDetails },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationCreate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.create response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};
