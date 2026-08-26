import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Background Education
// Retrieve background education records (key: backgroundElementId).
export const getBackgroundEducation: SapsuccessfactorsEndpoints['getBackgroundEducation'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getBackgroundEducation']
		>('odata/v2/BackgroundEducation', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.background.getBackgroundEducation',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Background Mobility
// Retrieve relocation willingness / geographic mobility preferences.
export const getBackgroundMobility: SapsuccessfactorsEndpoints['getBackgroundMobility'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getBackgroundMobility']
		>('odata/v2/BackgroundMobility', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.background.getBackgroundMobility',
			input ?? {},
			'completed',
		);
		return response;
	};
