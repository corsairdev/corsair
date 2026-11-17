import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** Create an embedded url for a project */
export const embeddingCreatePresignedUrl: HexEndpoints['embeddingCreatePresignedUrl'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.embeddingCreatePresignedUrl.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['embeddingCreatePresignedUrl']
		>(
			`/v1/embedding/createPresignedUrl/${encodeURIComponent(String(parsedInput.projectId))}`,
			ctx.key,
			{
				method: 'POST',
				body: {
					hexUserAttributes: parsedInput.hexUserAttributes,
					scope: parsedInput.scope,
					inputParameters: parsedInput.inputParameters,
					expiresIn: parsedInput.expiresIn,
					displayOptions: parsedInput.displayOptions,
					testMode: parsedInput.testMode,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.embeddingCreatePresignedUrl.parse(response);
		await logEventFromContext(
			ctx,
			'hex.embedding.createPresignedUrl',
			{ operation: 'embedding.createPresignedUrl' },
			'completed',
		);
		return parsed;
	};
