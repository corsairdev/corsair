import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import { cacheAnimals, cachePlanets, cacheStars } from './persist';
import { asArray } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Species, astronomy, history and people.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/** Returns up to 10 results matching the input name parameter. */
export const animals: ApiNinjasEndpoints['referenceAnimals'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceAnimals']
	>('animals', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
		},
	});

	await cacheAnimals(ctx.db.animals, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.reference.animals',
		withCount(auditPayload(input, ['name']), result),
		'completed',
	);
	return result;
};

/**
 * Get a list of cat breeds matching specified parameters. Returns at most
 * 20 results. To access more than 20 results, use the offset parameter to
 * offset results in multiple API calls.
 */
export const cats: ApiNinjasEndpoints['referenceCats'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceCats']
	>('cats', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			min_weight: input.min_weight,
			max_weight: input.max_weight,
			min_life_expectancy: input.min_life_expectancy,
			max_life_expectancy: input.max_life_expectancy,
			shedding: input.shedding,
			family_friendly: input.family_friendly,
			playfulness: input.playfulness,
			grooming: input.grooming,
			other_pets_friendly: input.other_pets_friendly,
			children_friendly: input.children_friendly,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.reference.cats',
		withCount(
			auditPayload(input, [
				'name',
				'min_weight',
				'max_weight',
				'min_life_expectancy',
				'max_life_expectancy',
				'shedding',
				'family_friendly',
				'playfulness',
				'grooming',
				'other_pets_friendly',
				'children_friendly',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get a list of dog breeds matching specified parameters. Returns at most
 * 20 results. To access more than 20 results, use the offset parameter to
 * offset results in multiple API calls.
 */
export const dogs: ApiNinjasEndpoints['referenceDogs'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceDogs']
	>('dogs', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			min_height: input.min_height,
			max_height: input.max_height,
			min_weight: input.min_weight,
			max_weight: input.max_weight,
			min_life_expectancy: input.min_life_expectancy,
			max_life_expectancy: input.max_life_expectancy,
			shedding: input.shedding,
			barking: input.barking,
			energy: input.energy,
			protectiveness: input.protectiveness,
			trainability: input.trainability,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.reference.dogs',
		withCount(
			auditPayload(input, [
				'name',
				'min_height',
				'max_height',
				'min_weight',
				'max_weight',
				'min_life_expectancy',
				'max_life_expectancy',
				'shedding',
				'barking',
				'energy',
				'protectiveness',
				'trainability',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get a list of planets matching specified parameters. Returns at most 30
 * results. To access more than 30 results, use the offset parameter to
 * offset results in multiple API calls.
 */
export const planets: ApiNinjasEndpoints['referencePlanets'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referencePlanets']
	>('planets', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			min_mass: input.min_mass,
			max_mass: input.max_mass,
			min_radius: input.min_radius,
			max_radius: input.max_radius,
			min_period: input.min_period,
			max_period: input.max_period,
			min_temperature: input.min_temperature,
			max_temperature: input.max_temperature,
			min_distance_light_year: input.min_distance_light_year,
			max_distance_light_year: input.max_distance_light_year,
			min_semi_major_axis: input.min_semi_major_axis,
			max_semi_major_axis: input.max_semi_major_axis,
			offset: input.offset,
		},
	});

	await cachePlanets(ctx.db.planets, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.reference.planets',
		withCount(
			auditPayload(input, [
				'name',
				'min_mass',
				'max_mass',
				'min_radius',
				'max_radius',
				'min_period',
				'max_period',
				'min_temperature',
				'max_temperature',
				'min_distance_light_year',
				'max_distance_light_year',
				'min_semi_major_axis',
				'max_semi_major_axis',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get a list of stars matching specified parameters. Returns at most 30
 * results. To access more than 30 results, use the offset parameter to
 * offset results in multiple API calls.
 */
export const stars: ApiNinjasEndpoints['referenceStars'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceStars']
	>('stars', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			constellation: input.constellation,
			min_apparent_magnitude: input.min_apparent_magnitude,
			max_apparent_magnitude: input.max_apparent_magnitude,
			min_absolute_magnitude: input.min_absolute_magnitude,
			max_absolute_magnitude: input.max_absolute_magnitude,
			min_distance_light_year: input.min_distance_light_year,
			max_distance_light_year: input.max_distance_light_year,
			offset: input.offset,
		},
	});

	await cacheStars(ctx.db.stars, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.reference.stars',
		withCount(
			auditPayload(input, [
				'name',
				'constellation',
				'min_apparent_magnitude',
				'max_apparent_magnitude',
				'min_absolute_magnitude',
				'max_absolute_magnitude',
				'min_distance_light_year',
				'max_distance_light_year',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns a list of up to 10 events that match the search parameters. Use
 * the offset parameter to paginate through more results.
 */
export const historicalEvents: ApiNinjasEndpoints['referenceHistoricalEvents'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['referenceHistoricalEvents']
		>('historicalevents', ctx.key, {
			version: 'v1',
			query: {
				text: input.text,
				year: input.year,
				month: input.month,
				day: input.day,
				offset: input.offset,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.reference.historicalEvents',
			withCount(
				auditPayload(input, ['year', 'month', 'day', 'offset']),
				result,
			),
			'completed',
		);
		return result;
	};

/** Returns a list of up to 10 people that match the search parameters. */
export const historicalFigures: ApiNinjasEndpoints['referenceHistoricalFigures'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['referenceHistoricalFigures']
		>('historicalfigures', ctx.key, {
			version: 'v1',
			query: {
				name: input.name,
				offset: input.offset,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.reference.historicalFigures',
			withCount(auditPayload(input, ['name', 'offset']), result),
			'completed',
		);
		return result;
	};

/**
 * Returns historical events that occurred on a specific date. If no date
 * parameters are provided, returns events for today's date.
 */
export const dayInHistory: ApiNinjasEndpoints['referenceDayInHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceDayInHistory']
	>('dayinhistory', ctx.key, {
		version: 'v1',
		query: {
			month: input.month,
			day: input.day,
			offset: input.offset,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.reference.dayInHistory',
		withCount(auditPayload(input, ['month', 'day', 'offset', 'limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of up to 30 celebrities that match the search parameters.
 * To get more than 30 results, use the offset parameter.
 */
export const celebrities: ApiNinjasEndpoints['referenceCelebrities'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceCelebrities']
	>('celebrity', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			min_net_worth: input.min_net_worth,
			max_net_worth: input.max_net_worth,
			nationality: input.nationality,
			min_height: input.min_height,
			max_height: input.max_height,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.reference.celebrities',
		withCount(
			auditPayload(input, [
				'name',
				'min_net_worth',
				'max_net_worth',
				'nationality',
				'min_height',
				'max_height',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/** Returns 10 baby name results. */
export const babyNames: ApiNinjasEndpoints['referenceBabyNames'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['referenceBabyNames']
	>('babynames', ctx.key, {
		version: 'v1',
		query: {
			gender: input.gender,
			popular_only: input.popular_only,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.reference.babyNames',
		withCount(auditPayload(input, ['gender', 'popular_only']), result),
		'completed',
	);
	return result;
};
