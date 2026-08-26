import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Background Education
// Retrieve background education records (key: backgroundElementId).
export const getBackgroundEducation: SapsuccessfactorsEndpoints['getBackgroundEducation'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getBackgroundEducation.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getBackgroundEducation']
		>('odata/v2/BackgroundEducation', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getBackgroundEducation.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.background.getBackgroundEducation',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Background Mobility
// Retrieve relocation willingness / geographic mobility preferences.
export const getBackgroundMobility: SapsuccessfactorsEndpoints['getBackgroundMobility'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getBackgroundMobility.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getBackgroundMobility']
		>('odata/v2/BackgroundMobility', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getBackgroundMobility.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.background.getBackgroundMobility',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
