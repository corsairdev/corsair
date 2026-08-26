import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Form Content
// Retrieve performance form content (filter by template ID, modified date).
export const getFormContent: SapsuccessfactorsEndpoints['getFormContent'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFormContent']
		>('odata/v2/FormContent', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.form.getFormContent',
			input ?? {},
			'completed',
		);
		return response;
	};
