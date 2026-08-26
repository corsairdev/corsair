import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Picklist
// Retrieve picklist definitions (selectable value lists).
export const getPicklist: SapsuccessfactorsEndpoints['getPicklist'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		SapsuccessfactorsEndpointInputSchemas.getPicklist.parse(input ?? {});
	const apiBaseUrl =
		(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
	const query = validatedInput as Record<
		string,
		string | number | boolean | undefined
	>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getPicklist']
	>('odata/v2/Picklist', ctx.key, { method: 'GET', query, apiBaseUrl });
	const validatedResponse =
		SapsuccessfactorsEndpointOutputSchemas.getPicklist.parse(response);
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.picklist.getPicklist',
		input ?? {},
		'completed',
	);
	return validatedResponse;
};

// Get Picklist Option
// Retrieve picklist option values with localized labels.
export const getPicklistOption: SapsuccessfactorsEndpoints['getPicklistOption'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getPicklistOption.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPicklistOption']
		>('odata/v2/PicklistOption', ctx.key, { method: 'GET', query, apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getPicklistOption.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.picklist.getPicklistOption',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
