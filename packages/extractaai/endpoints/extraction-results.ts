import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs, ExtractaJsonObject } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

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
