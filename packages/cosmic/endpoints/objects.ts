import { logEventFromContext } from 'corsair/core';
import type { CosmicEndpoints } from '..';
import {
	encodeQueryFilter,
	makeCosmicReadRequest,
	makeCosmicWriteRequest,
} from '../client';
import { resolveBucketSlug, resolveReadKey } from './helpers';
import type { ObjectsBatchResponse, ObjectsFindResponse } from './types';
import {
	CosmicEndpointInputSchemas,
	CosmicEndpointOutputSchemas,
} from './types';

export const find: CosmicEndpoints['objectsFind'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectsFind.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest<ObjectsFindResponse>(
		`/v3/buckets/${slug}/objects`,
		resolveReadKey(ctx),
		{
			query: encodeQueryFilter({
				...(parsed.query ?? {}),
				...(parsed.type ? { type: parsed.type } : {}),
			}),
			props: parsed.props,
			status: parsed.status,
			sort: parsed.sort,
			limit: parsed.limit,
			skip: parsed.skip,
			after: parsed.after,
			depth: parsed.depth,
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsFind.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.find',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const findOne: CosmicEndpoints['objectsFindOne'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectsFindOne.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest<ObjectsFindResponse>(
		`/v3/buckets/${slug}/objects`,
		resolveReadKey(ctx),
		{
			query: encodeQueryFilter({ type: parsed.type, slug: parsed.slug }),
			props: parsed.props,
			status: parsed.status,
			depth: parsed.depth,
			limit: 1,
		},
	);

	const envelope = CosmicEndpointOutputSchemas.objectsFind.parse(response);
	const object = envelope.objects[0];
	if (!object) {
		throw new Error(
			`Cosmic object not found: type "${parsed.type}" slug "${parsed.slug}"`,
		);
	}

	const validated = CosmicEndpointOutputSchemas.objectsFindOne.parse({
		object,
	});

	await logEventFromContext(
		ctx,
		'cosmic.objects.findOne',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const getById: CosmicEndpoints['objectsGetById'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.objectsGetById.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.id)}`,
		resolveReadKey(ctx),
		{
			props: parsed.props,
			status: parsed.status,
			depth: parsed.depth,
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsGetById.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.getById',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const insert: CosmicEndpoints['objectsInsert'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectsInsert.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/objects`,
		ctx.key,
		{
			method: 'POST',
			body: {
				title: parsed.title,
				type: parsed.type,
				...(parsed.slug ? { slug: parsed.slug } : {}),
				...(parsed.status ? { status: parsed.status } : {}),
				...(parsed.metadata ? { metadata: parsed.metadata } : {}),
				...(parsed.trigger_webhook
					? { trigger_webhook: parsed.trigger_webhook }
					: {}),
			},
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsInsert.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.insert',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const update: CosmicEndpoints['objectsUpdate'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectsUpdate.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsed.title ? { title: parsed.title } : {}),
				...(parsed.slug ? { slug: parsed.slug } : {}),
				...(parsed.status ? { status: parsed.status } : {}),
				...(parsed.metadata ? { metadata: parsed.metadata } : {}),
				...(parsed.trigger_webhook
					? { trigger_webhook: parsed.trigger_webhook }
					: {}),
			},
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.update',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const remove: CosmicEndpoints['objectsDelete'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectsDelete.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'DELETE',
			query: parsed.trigger_webhook
				? { trigger_webhook: parsed.trigger_webhook }
				: undefined,
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.delete',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const batch: CosmicEndpoints['objectsBatch'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.objectsBatch.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest<ObjectsBatchResponse>(
		`/v3/buckets/${slug}/objects/batch`,
		ctx.key,
		{
			method: 'POST',
			body: { operations: parsed.operations },
		},
	);

	const validated = CosmicEndpointOutputSchemas.objectsBatch.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.objects.batch',
		{ ...parsed },
		'completed',
	);

	return validated;
};
