import { logEventFromContext } from 'corsair/core';
import type { CloroEndpoints } from '..';
import { makeCloroRequest } from '../client';
import { CloroEndpointInputSchemas, CloroEndpointOutputSchemas } from './types';

export const countries: CloroEndpoints['utilityCountries'] = async (
	ctx,
	input,
) => {
	const { model } = CloroEndpointInputSchemas.utilityCountries.parse(
		input ?? {},
	);
	const result = CloroEndpointOutputSchemas.utilityCountries.parse(
		await makeCloroRequest('v1/countries', ctx.key, {
			query: { model },
		}),
	);
	await logEventFromContext(
		ctx,
		'cloro.utility.countries',
		{ model, count: result.length },
		'completed',
	);
	return result;
};

export const states: CloroEndpoints['utilityStates'] = async (ctx, input) => {
	const { country } = CloroEndpointInputSchemas.utilityStates.parse(input);
	const result = CloroEndpointOutputSchemas.utilityStates.parse(
		await makeCloroRequest('v1/states', ctx.key, {
			query: { country },
		}),
	);
	await logEventFromContext(
		ctx,
		'cloro.utility.states',
		{ country, count: result.length },
		'completed',
	);
	return result;
};

export const credits: CloroEndpoints['utilityCredits'] = async (ctx, input) => {
	CloroEndpointInputSchemas.utilityCredits.parse(input ?? {});
	const result = CloroEndpointOutputSchemas.utilityCredits.parse(
		await makeCloroRequest('v1/credits', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'cloro.utility.credits',
		{ remaining: result.remaining },
		'completed',
	);
	return result;
};
