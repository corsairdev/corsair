import type { ApolloEndpoints } from '..';
import { savePerson } from './cache';
import { call } from './call';

export const search: ApolloEndpoints['peopleSearch'] = (ctx, input) =>
	call(
		ctx,
		'peopleSearch',
		'people.search',
		'POST',
		'mixed_people/api_search',
		input,
	);

export const enrich: ApolloEndpoints['peopleEnrich'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'peopleEnrich',
		'people.enrich',
		'POST',
		'people/match',
		input,
	);
	if (result.person) await savePerson(ctx, result.person);
	return result;
};

export const get: ApolloEndpoints['peopleGet'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'peopleGet',
		'people.get',
		'GET',
		'people/{id}',
		input,
		['id'],
	);
	await savePerson(ctx, result.person);
	return result;
};
