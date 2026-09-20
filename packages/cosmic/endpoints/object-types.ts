import { logEventFromContext } from 'corsair/core';
import type { CosmicEndpoints } from '..';
import { makeCosmicReadRequest, makeCosmicWriteRequest } from '../client';
import { resolveBucketSlug, resolveReadKey } from './helpers';
import {
	CosmicEndpointInputSchemas,
	CosmicEndpointOutputSchemas,
} from './types';

export const find: CosmicEndpoints['objectTypesFind'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectTypesFind.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/object-types`,
		resolveReadKey(ctx),
		{},
	);

	const validated = CosmicEndpointOutputSchemas.objectTypesFind.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objectTypes.find',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const findOne: CosmicEndpoints['objectTypesFindOne'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectTypesFindOne.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/object-types/${encodeURIComponent(parsed.slug)}`,
		resolveReadKey(ctx),
		{},
	);

	const validated =
		CosmicEndpointOutputSchemas.objectTypesFindOne.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objectTypes.findOne',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const insert: CosmicEndpoints['objectTypesInsert'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectTypesInsert.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/object-types`,
		ctx.key,
		{
			method: 'POST',
			body: {
				title: parsed.title,
				...(parsed.slug ? { slug: parsed.slug } : {}),
				...(parsed.singular ? { singular: parsed.singular } : {}),
				...(parsed.singleton !== undefined
					? { singleton: parsed.singleton }
					: {}),
				...(parsed.emoji ? { emoji: parsed.emoji } : {}),
				...(parsed.metafields ? { metafields: parsed.metafields } : {}),
				...(parsed.localization !== undefined
					? { localization: parsed.localization }
					: {}),
				...(parsed.options ? { options: parsed.options } : {}),
			},
		},
	);

	const validated =
		CosmicEndpointOutputSchemas.objectTypesInsert.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objectTypes.insert',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const update: CosmicEndpoints['objectTypesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectTypesUpdate.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/object-types/${encodeURIComponent(parsed.slug)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsed.title ? { title: parsed.title } : {}),
				...(parsed.singular ? { singular: parsed.singular } : {}),
				...(parsed.singleton !== undefined
					? { singleton: parsed.singleton }
					: {}),
				...(parsed.emoji ? { emoji: parsed.emoji } : {}),
				...(parsed.metafields ? { metafields: parsed.metafields } : {}),
			},
		},
	);

	const validated =
		CosmicEndpointOutputSchemas.objectTypesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objectTypes.update',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const remove: CosmicEndpoints['objectTypesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectTypesDelete.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/object-types/${encodeURIComponent(parsed.slug)}`,
		ctx.key,
		{
			method: 'DELETE',
			query: parsed.trigger_webhook
				? { trigger_webhook: parsed.trigger_webhook }
				: undefined,
		},
	);

	const validated =
		CosmicEndpointOutputSchemas.objectTypesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objectTypes.delete',
		{ ...parsed },
		'completed',
	);

	return validated;
};
