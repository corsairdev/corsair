import { logEventFromContext } from 'corsair/core';
import type { CosmicEndpoints } from '..';
import { makeCosmicReadRequest, makeCosmicWriteRequest } from '../client';
import { resolveBucketSlug, resolveReadKey } from './helpers';
import {
	CosmicEndpointInputSchemas,
	CosmicEndpointOutputSchemas,
} from './types';

export const find: CosmicEndpoints['revisionsFind'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.revisionsFind.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.objectId)}/revisions`,
		resolveReadKey(ctx),
		{
			props: parsed.props,
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
		},
	);

	const validated = CosmicEndpointOutputSchemas.revisionsFind.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.revisions.find',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const findOne: CosmicEndpoints['revisionsFindOne'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.revisionsFindOne.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.objectId)}/revisions/${encodeURIComponent(parsed.revisionId)}`,
		resolveReadKey(ctx),
		{ props: parsed.props },
	);

	const validated =
		CosmicEndpointOutputSchemas.revisionsFindOne.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.revisions.findOne',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const insert: CosmicEndpoints['revisionsInsert'] = async (
	ctx,
	input,
) => {
	const parsed = CosmicEndpointInputSchemas.revisionsInsert.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/objects/${encodeURIComponent(parsed.objectId)}/revisions`,
		ctx.key,
		{
			method: 'POST',
			body: {
				...(parsed.title ? { title: parsed.title } : {}),
				...(parsed.slug ? { slug: parsed.slug } : {}),
				...(parsed.metadata ? { metadata: parsed.metadata } : {}),
				...(parsed.trigger_webhook
					? { trigger_webhook: parsed.trigger_webhook }
					: {}),
			},
		},
	);

	const validated = CosmicEndpointOutputSchemas.revisionsInsert.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.revisions.insert',
		{ ...parsed },
		'completed',
	);

	return validated;
};
