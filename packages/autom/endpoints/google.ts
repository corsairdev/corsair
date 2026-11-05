import { logEventFromContext } from 'corsair/core';
import type { AutomEndpoints } from '..';
import { makeAutomRequest } from '../client';
import { AutomEndpointInputSchemas, AutomEndpointOutputSchemas } from './types';

export const countries: AutomEndpoints['googleCountries'] = async (
	ctx,
	input,
) => {
	const parsedInput = AutomEndpointInputSchemas.googleCountries.parse(input);
	const response = await makeAutomRequest(
		'/v1/finder/google-countries',
		ctx.key,
		{
			method: 'GET',
			query: { query: parsedInput.query },
		},
	);
	const parsed = AutomEndpointOutputSchemas.googleCountries.parse(response);

	await logEventFromContext(
		ctx,
		'autom.google.countries',
		{ query: parsedInput.query },
		'completed',
	);
	return parsed;
};

export const languages: AutomEndpoints['googleLanguages'] = async (
	ctx,
	input,
) => {
	const parsedInput = AutomEndpointInputSchemas.googleLanguages.parse(input);
	const response = await makeAutomRequest(
		'/v1/finder/google-languages',
		ctx.key,
		{
			method: 'GET',
			query: { query: parsedInput.query },
		},
	);
	const parsed = AutomEndpointOutputSchemas.googleLanguages.parse(response);

	await logEventFromContext(
		ctx,
		'autom.google.languages',
		{ query: parsedInput.query },
		'completed',
	);
	return parsed;
};

export const locations: AutomEndpoints['googleLocations'] = async (
	ctx,
	input,
) => {
	const parsedInput = AutomEndpointInputSchemas.googleLocations.parse(input);
	const response = await makeAutomRequest(
		'/v1/finder/google-locations',
		ctx.key,
		{
			method: 'GET',
			query: { query: parsedInput.query },
		},
	);
	const parsed = AutomEndpointOutputSchemas.googleLocations.parse(response);

	await logEventFromContext(
		ctx,
		'autom.google.locations',
		{ query: parsedInput.query },
		'completed',
	);
	return parsed;
};

export const images: AutomEndpoints['googleImages'] = async (ctx, input) => {
	const parsedInput = AutomEndpointInputSchemas.googleImages.parse(input);
	const response = await makeAutomRequest('/v1/google/images', ctx.key, {
		method: 'GET',
		query: {
			query: parsedInput.query,
			page: parsedInput.page,
			gl: parsedInput.gl,
			hl: parsedInput.hl,
		},
	});
	const parsed = AutomEndpointOutputSchemas.googleImages.parse(response);

	await logEventFromContext(
		ctx,
		'autom.google.images',
		{ query: parsedInput.query },
		'completed',
	);
	return parsed;
};
