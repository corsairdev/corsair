import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Fitness, nutrition and food.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns the calories burned per hour and total calories burned according
 * to given parameters for given activities (up to 10).
 */
export const caloriesBurned: ApiNinjasEndpoints['healthCaloriesBurned'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['healthCaloriesBurned']
		>('caloriesburned', ctx.key, {
			version: 'v1',
			query: {
				activity: input.activity,
				weight: input.weight,
				duration: input.duration,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.health.caloriesBurned',
			withCount(auditPayload(input, ['activity', 'duration']), result),
			'completed',
		);
		return result;
	};

/**
 * This endpoint uses AI to automatically read any text and extract every
 * food item it contains, along with the right portion for each. It can
 * process multiple food items at once - simply copy and paste any text,
 * such as a recipe or your food journal, directly, and it will return the
 * nutrition data for every food item found. Items without a specified
 * amount default to a 100g serving.
 */
export const nutrition: ApiNinjasEndpoints['healthNutrition'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['healthNutrition']
	>('nutrition', ctx.key, {
		version: 'v1',
		query: {
			query: input.query,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.health.nutrition',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns up to 5 exercises that satisfy the given parameters. */
export const exercises: ApiNinjasEndpoints['healthExercises'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['healthExercises']
	>('exercises', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			type: input.type,
			muscle: input.muscle,
			difficulty: input.difficulty,
			equipments: input.equipments,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.health.exercises',
		withCount(
			auditPayload(input, [
				'name',
				'type',
				'muscle',
				'difficulty',
				'equipments',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get a list of recipes for a given recipe name or ingredient(s). Returns
 * a list of recipes. To access more results, use the limit parameter to
 * limit the number of results and the offset parameter to offset results
 * for pagination in multiple API calls.
 */
export const recipes: ApiNinjasEndpoints['healthRecipes'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['healthRecipes']
	>('recipe', ctx.key, {
		version: 'v3',
		query: {
			title: input.title,
			ingredients: input.ingredients,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.health.recipes',
		withCount(auditPayload(input, ['limit', 'offset']), result),
		'completed',
	);
	return result;
};

/** Returns up to 10 cocktail recipes matching the search parameters. */
export const cocktails: ApiNinjasEndpoints['healthCocktails'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['healthCocktails']
	>('cocktail', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			ingredients: input.ingredients,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.health.cocktails',
		withCount(auditPayload(input, ['name']), result),
		'completed',
	);
	return result;
};
