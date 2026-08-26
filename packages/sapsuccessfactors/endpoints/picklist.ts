import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Picklist
// Retrieve picklist definitions (selectable value lists).
export const getPicklist: SapsuccessfactorsEndpoints['getPicklist'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getPicklist']
	>('odata/v2/Picklist', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.picklist.getPicklist',
		input ?? {},
		'completed',
	);
	return response;
};

// Get Picklist Option
// Retrieve picklist option values with localized labels.
export const getPicklistOption: SapsuccessfactorsEndpoints['getPicklistOption'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPicklistOption']
		>('odata/v2/PicklistOption', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.picklist.getPicklistOption',
			input ?? {},
			'completed',
		);
		return response;
	};
