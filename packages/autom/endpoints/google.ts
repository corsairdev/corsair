import { logEventFromContext } from 'corsair/core';
import type { AutomEndpoints } from '..';
import { makeAutomRequest } from '../client';
import type { AutomEndpointOutputs } from './types';

export const countries: AutomEndpoints['googleCountries'] = async (
	ctx,
	input,
) => {
	const response = await makeAutomRequest<
		AutomEndpointOutputs['googleCountries']
	>('/v1/finder/google-countries', ctx.key, {
		method: 'GET',
		query: { query: input.query },
	});

	await logEventFromContext(
		ctx,
		'autom.google.countries',
		{ query: input.query },
		'completed',
	);
	return response;
};

export const languages: AutomEndpoints['googleLanguages'] = async (
	ctx,
	input,
) => {
	const response = await makeAutomRequest<
		AutomEndpointOutputs['googleLanguages']
	>('/v1/finder/google-languages', ctx.key, {
		method: 'GET',
		query: { query: input.query },
	});

	await logEventFromContext(
		ctx,
		'autom.google.languages',
		{ query: input.query },
		'completed',
	);
	return response;
};

export const locations: AutomEndpoints['googleLocations'] = async (
	ctx,
	input,
) => {
	const response = await makeAutomRequest<
		AutomEndpointOutputs['googleLocations']
	>('/v1/finder/google-locations', ctx.key, {
		method: 'GET',
		query: { query: input.query },
	});

	await logEventFromContext(
		ctx,
		'autom.google.locations',
		{ query: input.query },
		'completed',
	);
	return response;
};

export const images: AutomEndpoints['googleImages'] = async (ctx, input) => {
	const response = await makeAutomRequest<AutomEndpointOutputs['googleImages']>(
		'/v1/google/images',
		ctx.key,
		{
			method: 'GET',
			query: {
				query: input.query,
				page: input.page,
				gl: input.gl,
				hl: input.hl,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'autom.google.images',
		{ query: input.query },
		'completed',
	);
	return response;
};
