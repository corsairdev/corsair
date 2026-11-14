import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	CardsCategoriesResponse,
	CardsGetResponse,
	CardsListResponse,
	CardsSectionsResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['cards.list'] = async (ctx, input) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['cards.list'].parse(input);
	const response = await makeHandwryttenRequest<CardsListResponse>(
		'/cards/list',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed = HandwryttenEndpointOutputSchemas['cards.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.cards.list',
		{ count: parsed.cards?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const get: HandwryttenEndpoints['cards.get'] = async (ctx, input) => {
	const parsedInput = HandwryttenEndpointInputSchemas['cards.get'].parse(input);
	const response = await makeHandwryttenRequest<CardsGetResponse>(
		'/cards/view',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed = HandwryttenEndpointOutputSchemas['cards.get'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.cards.get',
		{ cardId: parsedInput.card_id },
		'completed',
	);
	return parsed;
};

export const sections: HandwryttenEndpoints['cards.sections'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['cards.sections'].parse(input);
	const response = await makeHandwryttenRequest<CardsSectionsResponse>(
		'/cards/list/sections',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['cards.sections'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.cards.sections',
		{ categoryId: parsedInput.category_id },
		'completed',
	);
	return parsed;
};

export const categories: HandwryttenEndpoints['cards.categories'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['cards.categories'].parse(input);
	const response = await makeHandwryttenRequest<CardsCategoriesResponse>(
		'/categories/list',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['cards.categories'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.cards.categories',
		{ count: parsed.categories?.length ?? 0 },
		'completed',
	);
	return parsed;
};
