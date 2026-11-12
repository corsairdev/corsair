import type { MeloEndpoints } from '..';
import { call } from './call';
import { withNextPage } from './pagination';
import {
	MeloEndpointInputSchemas as Inputs,
	MeloEndpointOutputSchemas as Outputs,
} from './types';

export const pricePerMeter: MeloEndpoints['indicatorsPricePerMeter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'indicators.pricePerMeter',
			input: Inputs.indicatorsPricePerMeter,
			output: Outputs.indicatorsPricePerMeter,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/indicators/price_per_meter',
			query,
		}),
		{
			shape: (raw) => withNextPage(raw),
			log: (_, result) => ({ count: result['hydra:member'].length }),
		},
	);

export const pointsOfInterest: MeloEndpoints['indicatorsPointsOfInterest'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'indicators.pointsOfInterest',
			input: Inputs.indicatorsPointsOfInterest,
			output: Outputs.indicatorsPointsOfInterest,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/indicators/points_of_interest',
			query,
		}),
		{ log: (_, result) => ({ count: result['hydra:member'].length }) },
	);

/** Backed by `/public/location-autocomplete`, the spec's "Location autocomplete". */
export const locations: MeloEndpoints['indicatorsLocations'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'indicators.locations',
			input: Inputs.indicatorsLocations,
			output: Outputs.indicatorsLocations,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/public/location-autocomplete',
			query,
		}),
		{ log: (_, result) => ({ count: result['hydra:member'].length }) },
	);

export const cities: MeloEndpoints['indicatorsCities'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'indicators.cities',
			input: Inputs.indicatorsCities,
			output: Outputs.indicatorsCities,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/cities',
			query,
		}),
		{
			shape: (raw) => withNextPage(raw),
			log: (_, result) => ({ count: result['hydra:member'].length }),
		},
	);
