import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseCategoryEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'category';

/** Lists categories. */
export const list: LoyverseEndpoints['categoriesList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['categoriesList']>(
		ctx,
		'categories',
		{ query: listQuery(input, { categories_ids: csv(input.categories_ids) }) },
	);

	await cacheEntities(
		ctx.db.categories,
		LoyverseCategoryEntity,
		result.categories,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.categories.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one category by id. */
export const get: LoyverseEndpoints['categoriesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['categoriesGet']>(
		ctx,
		`categories/${input.category_id}`,
	);

	await cacheEntity(ctx.db.categories, LoyverseCategoryEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.categories.get',
		auditPayload(input, ['category_id']),
		'completed',
	);
	return result;
};

/** Creates or updates a category. `id` present means update. */
export const upsert: LoyverseEndpoints['categoriesUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['categoriesUpsert']
	>(ctx, 'categories', {
		method: 'POST',
		body: compactBody({
			id: input.id,
			name: input.name,
			color: input.color,
		}),
	});

	await cacheEntity(ctx.db.categories, LoyverseCategoryEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.categories.upsert',
		{ category_id: result.id, created: input.id === undefined },
		'completed',
	);
	return result;
};

/** Deletes a category and drops it from the mirror. */
export const remove: LoyverseEndpoints['categoriesDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['categoriesDelete']
	>(ctx, `categories/${input.category_id}`, { method: 'DELETE' });

	await evictEntity(ctx.db.categories, input.category_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.categories.delete',
		auditPayload(input, ['category_id']),
		'completed',
	);
	return result;
};
