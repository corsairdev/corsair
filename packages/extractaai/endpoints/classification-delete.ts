import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const deleteClassification: ExtractaaiEndpoints['classificationDelete'] =
	async (ctx, input) => {
		const response = await makeExtractaaiRequest<
			ExtractaaiEndpointOutputs['classificationDelete']
		>('documentClassification/deleteClassification', ctx.key, {
			method: 'DELETE',
			body: { classificationId: input.classificationId },
		});

		const parsed =
			ExtractaaiEndpointOutputSchemas.classificationDelete.safeParse(response);
		if (parsed.success === false) {
			throw new Error(
				`Extracta.ai classification.delete response failed schema validation: ${parsed.error.message}`,
			);
		}
		return parsed.data;
	};
