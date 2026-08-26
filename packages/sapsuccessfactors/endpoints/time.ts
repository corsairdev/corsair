import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Time Account Snapshot
// Retrieve time account balances for leave liability / payroll as-of a date.
export const getTimeAccountSnapshot: SapsuccessfactorsEndpoints['getTimeAccountSnapshot'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getTimeAccountSnapshot.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getTimeAccountSnapshot']
		>('odata/v2/TimeAccountSnapshot', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getTimeAccountSnapshot.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.time.getTimeAccountSnapshot',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
