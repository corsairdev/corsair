import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Person by ID
// Retrieve core person info for an employee by external person ID.
export const getPerPersonById: SapsuccessfactorsEndpoints['getPerPersonById'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getPerPersonById.parse(input ?? {});
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { person_id_external, ...query } = (validatedInput ?? {}) as {
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
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getPerPersonById.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.getPerPersonById',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// List Person Records
// Retrieve person records (latest active record per person).
export const listPerPerson: SapsuccessfactorsEndpoints['listPerPerson'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.listPerPerson.parse(input ?? {});
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['listPerPerson']
		>('odata/v2/PerPerson', ctx.key, { method: 'GET', query, apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.listPerPerson.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.listPerPerson',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Personal Information Records
// Retrieve biographical info, emergency contacts, social/email data.
export const getPerPersonal: SapsuccessfactorsEndpoints['getPerPersonal'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getPerPersonal.parse(input ?? {});
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPerPersonal']
		>('odata/v2/PerPersonal', ctx.key, { method: 'GET', query, apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getPerPersonal.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.per.getPerPersonal',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
