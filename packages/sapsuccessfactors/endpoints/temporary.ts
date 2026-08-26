import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Temporary Time Information
// Retrieve temporary work schedules assigned to employees.
export const getTemporaryTimeInformation: SapsuccessfactorsEndpoints['getTemporaryTimeInformation'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getTemporaryTimeInformation.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getTemporaryTimeInformation']
		>('odata/v2/TemporaryTimeInfo', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getTemporaryTimeInformation.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.temporary.getTemporaryTimeInformation',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
