import { logEventFromContext } from 'corsair/core';
import type { AmcardsEndpoints } from '..';
import { encodeAmcardsPathId, makeAmcardsRequest } from '../client';
import { AmcardsEndpointOutputSchemas as Out } from './types';

/** GET /api/v1/ — DRF/Tastypie API root (full v1 schema). */
export const getApiSchema: AmcardsEndpoints['getApiSchema'] = async (
	ctx,
	_input,
) => {
	const response = Out.getApiSchema.parse(
		await makeAmcardsRequest('', ctx.key),
	);
	await logEventFromContext(ctx, 'amcards.schema.getApi', {}, 'completed');
	return response;
};

/** GET /api/v1/categories/schema/ — Tastypie Category resource schema. */
export const getCategorySchema: AmcardsEndpoints['getCategorySchema'] = async (
	ctx,
	_input,
) => {
	const response = Out.getCategorySchema.parse(
		await makeAmcardsRequest('categories/schema/', ctx.key),
	);
	await logEventFromContext(ctx, 'amcards.schema.getCategory', {}, 'completed');
	return response;
};

/** GET /api/v1/cards/ */
export const getCards: AmcardsEndpoints['getCards'] = async (ctx, input) => {
	const response = Out.getCards.parse(
		await makeAmcardsRequest('cards/', ctx.key, {
			query: { offset: input.skip, limit: input.limit },
		}),
	);
	await logEventFromContext(
		ctx,
		'amcards.cards.list',
		{ ...input },
		'completed',
	);
	return response;
};

/** GET /api/v1/contacts/ */
export const getContacts: AmcardsEndpoints['getContacts'] = async (
	ctx,
	input,
) => {
	const response = Out.getContacts.parse(
		await makeAmcardsRequest('contacts/', ctx.key, {
			query: {
				offset: input.skip,
				limit: input.limit,
				email: input.email,
				first_name: input.first_name,
				last_name: input.last_name,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'amcards.contacts.list',
		{ ...input },
		'completed',
	);
	return response;
};

/** GET /api/v1/categories/{id}/ */
export const getCategory: AmcardsEndpoints['getCategory'] = async (
	ctx,
	input,
) => {
	const response = Out.getCategory.parse(
		await makeAmcardsRequest(
			`categories/${encodeAmcardsPathId(input.category_id)}/`,
			ctx.key,
		),
	);
	await logEventFromContext(
		ctx,
		'amcards.categories.get',
		{ category_id: input.category_id },
		'completed',
	);
	return response;
};

/** GET /api/v1/categories/ — ordered by priority (1 is highest). */
export const listCategories: AmcardsEndpoints['listCategories'] = async (
	ctx,
	input,
) => {
	const response = Out.listCategories.parse(
		await makeAmcardsRequest('categories/', ctx.key, {
			query: {
				parent__id: input.parent__id,
				title__icontains: input.title__icontains,
				parent__title__icontains: input.parent__title__icontains,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'amcards.categories.list',
		{ ...input },
		'completed',
	);
	return response;
};

/** GET /api/v1/gifts/{id}/ */
export const getGift: AmcardsEndpoints['getGift'] = async (ctx, input) => {
	const response = Out.getGift.parse(
		await makeAmcardsRequest(
			`gifts/${encodeAmcardsPathId(input.id)}/`,
			ctx.key,
			{
				auth: false,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'amcards.gifts.get',
		{ id: input.id },
		'completed',
	);
	return response;
};

/** GET /api/v1/gifts/ — no authorization required. */
export const listGifts: AmcardsEndpoints['listGifts'] = async (ctx, _input) => {
	const response = Out.listGifts.parse(
		await makeAmcardsRequest('gifts/', ctx.key, { auth: false }),
	);
	await logEventFromContext(ctx, 'amcards.gifts.list', {}, 'completed');
	return response;
};

/** GET /api/v1/templates/{id}/ */
export const getPublicTemplate: AmcardsEndpoints['getPublicTemplate'] = async (
	ctx,
	input,
) => {
	const response = Out.getPublicTemplate.parse(
		await makeAmcardsRequest(
			`templates/${encodeAmcardsPathId(input.id)}/`,
			ctx.key,
			{ auth: false },
		),
	);
	await logEventFromContext(
		ctx,
		'amcards.templates.get',
		{ id: input.id },
		'completed',
	);
	return response;
};

/** GET /api/v1/templates/ — no authorization required. */
export const listPublicTemplates: AmcardsEndpoints['listPublicTemplates'] =
	async (ctx, input) => {
		const response = Out.listPublicTemplates.parse(
			await makeAmcardsRequest('templates/', ctx.key, {
				auth: false,
				query: {
					category__id: input.category__id,
					name__icontains: input.name__icontains,
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'amcards.templates.list',
			{ ...input },
			'completed',
		);
		return response;
	};
