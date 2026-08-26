import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get CDP Learning Metadata
// Get metadata for the Career Development Planning Learning service.
export const getCdpLearningMetadata: SapsuccessfactorsEndpoints['getCdpLearningMetadata'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCdpLearningMetadata.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCdpLearningMetadata']
		>('odata/v2/$metadata', ctx.key, { method: 'GET', apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCdpLearningMetadata.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.cdp.getCdpLearningMetadata',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Refresh CDP Learning Metadata
// Refresh metadata for the CDP Learning service.
export const refreshCdpLearningMetadata: SapsuccessfactorsEndpoints['refreshCdpLearningMetadata'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.refreshCdpLearningMetadata.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['refreshCdpLearningMetadata']
		>('odata/v2/RefreshCDPLearningMetadata', ctx.key, {
			method: 'POST',
			body: (validatedInput ?? {}) as Record<string, unknown>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.refreshCdpLearningMetadata.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.cdp.refreshCdpLearningMetadata',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
