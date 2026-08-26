import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Person by ID
// Retrieve core person info for an employee by external person ID.
export const getPerPersonById: SapsuccessfactorsEndpoints['getPerPersonById'] =
	async (ctx, input) => {
		const { person_id_external, ...query } = (input ?? {}) as {
			person_id_external?: string;
		};
		const resourcePath = person_id_external
			? `odata/v2/PerPerson('${person_id_external}')`
			: 'odata/v2/PerPerson';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPerPersonById']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.getPerPersonById',
			input ?? {},
			'completed',
		);
		return response;
	};

// List Person Records
// Retrieve person records (latest active record per person).
export const listPerPerson: SapsuccessfactorsEndpoints['listPerPerson'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['listPerPerson']
		>('odata/v2/PerPerson', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.listPerPerson',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Personal Information Records
// Retrieve biographical info, emergency contacts, social/email data.
export const getPerPersonal: SapsuccessfactorsEndpoints['getPerPersonal'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPerPersonal']
		>('odata/v2/PerPersonal', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.getPerPersonal',
			input ?? {},
			'completed',
		);
		return response;
	};
