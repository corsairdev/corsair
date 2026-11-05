import { logEventFromContext } from 'corsair/core';
import type { AmbeeQuery } from '../client';
import { makeAmbeeRequest, toAmbeeTimestamp } from '../client';
import type { AmbeeEndpoints } from '../index';
import type { PollenResponse } from './types';
import {
	PollenGetForecastInputSchema,
	PollenGetHistoryInputSchema,
	PollenGetLatestInputSchema,
	PollenResponseSchema,
} from './types';

/**
 * Pollen endpoints are addressed either geospatially or by place name. Both
 * forms share every other parameter, so the location half of the query is
 * resolved once here. Callers must already be a validated exclusive union —
 * `'place' in input` is only safe after that check.
 */
function pollenLocationQuery(
	input: { lat: number; lng: number } | { place: string },
): AmbeeQuery {
	return 'place' in input
		? { place: input.place }
		: { lat: input.lat, lng: input.lng };
}

/** Ambee omits `speciesRisk` rather than accepting `false` as a default. */
function speciesRiskQuery(speciesRisk: boolean | undefined): AmbeeQuery {
	return speciesRisk === undefined ? {} : { speciesRisk };
}

/**
 * Latest pollen counts and risk levels for a location.
 *
 * API: GET api.ambeedata.com/v3/pollen/latest
 * Docs: https://docs.ambeedata.com/apis/pollen
 */
export const getLatest: AmbeeEndpoints['pollenGetLatest'] = async (
	ctx,
	rawInput,
) => {
	const input = PollenGetLatestInputSchema.parse(rawInput);
	const location = pollenLocationQuery(input);

	const raw = await makeAmbeeRequest<PollenResponse>(
		'v3/pollen/latest',
		ctx.key,
		{ query: { ...location, ...speciesRiskQuery(input.speciesRisk) } },
	);

	const response = PollenResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.pollen.getLatest',
		{ ...location, speciesRisk: input.speciesRisk },
		'completed',
	);

	return response;
};

/**
 * Historical pollen counts for a location (up to 48 hours per request).
 *
 * API: GET api.ambeedata.com/v3/pollen/history
 * Docs: https://docs.ambeedata.com/apis/pollen
 */
export const getHistory: AmbeeEndpoints['pollenGetHistory'] = async (
	ctx,
	rawInput,
) => {
	const input = PollenGetHistoryInputSchema.parse(rawInput);
	const location = pollenLocationQuery(input);
	const from = toAmbeeTimestamp(input.from);
	const to = toAmbeeTimestamp(input.to);

	const raw = await makeAmbeeRequest<PollenResponse>(
		'v3/pollen/history',
		ctx.key,
		{
			query: {
				...location,
				from,
				to,
				...speciesRiskQuery(input.speciesRisk),
			},
		},
	);

	const response = PollenResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.pollen.getHistory',
		{ ...location, from, to, speciesRisk: input.speciesRisk },
		'completed',
	);

	return response;
};

/**
 * Pollen forecast for a location — 48 hours at hourly intervals (default) or
 * 120 hours at 3-hourly intervals.
 *
 * API: GET api.ambeedata.com/v3/pollen/forecast/{48hrs|120hrs}
 * Docs: https://docs.ambeedata.com/apis/pollen
 */
export const getForecast: AmbeeEndpoints['pollenGetForecast'] = async (
	ctx,
	rawInput,
) => {
	const input = PollenGetForecastInputSchema.parse(rawInput);
	const location = pollenLocationQuery(input);
	const hours = input.hours ?? 48;

	const raw = await makeAmbeeRequest<PollenResponse>(
		`v3/pollen/forecast/${hours}hrs`,
		ctx.key,
		{ query: { ...location, ...speciesRiskQuery(input.speciesRisk) } },
	);

	const response = PollenResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.pollen.getForecast',
		{ ...location, hours, speciesRisk: input.speciesRisk },
		'completed',
	);

	return response;
};
