import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get CDP Learning Metadata
// Get metadata for the Career Development Planning Learning service.
export const getCdpLearningMetadata: SapsuccessfactorsEndpoints['getCdpLearningMetadata'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCdpLearningMetadata']
		>('odata/v2/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.cdp.getCdpLearningMetadata',
			input ?? {},
			'completed',
		);
		return response;
	};

// Refresh CDP Learning Metadata
// Refresh metadata for the CDP Learning service.
export const refreshCdpLearningMetadata: SapsuccessfactorsEndpoints['refreshCdpLearningMetadata'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['refreshCdpLearningMetadata']
		>('odata/v2/RefreshCDPLearningMetadata', ctx.key, {
			method: 'POST',
			body: (input ?? {}) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.cdp.refreshCdpLearningMetadata',
			input ?? {},
			'completed',
		);
		return response;
	};
