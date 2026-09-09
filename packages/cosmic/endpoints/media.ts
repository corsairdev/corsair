import { logEventFromContext } from 'corsair/core';
import type { CosmicEndpoints } from '..';
import {
	encodeQueryFilter,
	makeCosmicReadRequest,
	makeCosmicUploadRequest,
	makeCosmicWriteRequest,
} from '../client';
import { resolveBucketSlug, resolveReadKey } from './helpers';
import {
	CosmicEndpointInputSchemas,
	CosmicEndpointOutputSchemas,
} from './types';

function decodeBase64(input: string): Uint8Array {
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(input, 'base64');
	}
	const binary = atob(input);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export const find: CosmicEndpoints['mediaFind'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.mediaFind.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/media`,
		resolveReadKey(ctx),
		{
			query: parsed.query ? encodeQueryFilter(parsed.query) : undefined,
			props: parsed.props,
			sort: parsed.sort,
			limit: parsed.limit,
			skip: parsed.skip,
		},
	);

	const validated = CosmicEndpointOutputSchemas.mediaFind.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.media.find',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const findOne: CosmicEndpoints['mediaFindOne'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.mediaFindOne.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicReadRequest(
		`/v3/buckets/${slug}/media`,
		resolveReadKey(ctx),
		{
			query: encodeQueryFilter({ name: parsed.name }),
			props: parsed.props,
			limit: 1,
		},
	);

	const envelope = CosmicEndpointOutputSchemas.mediaFind.parse(response);
	const media = envelope.media[0];
	if (!media) {
		throw new Error(`Cosmic media not found: name "${parsed.name}"`);
	}

	const validated = CosmicEndpointOutputSchemas.mediaFindOne.parse({ media });

	await logEventFromContext(
		ctx,
		'cosmic.media.findOne',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const insert: CosmicEndpoints['mediaInsert'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.mediaInsert.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicUploadRequest(
		`/v3/buckets/${slug}/media`,
		ctx.key,
		{
			media: {
				filename: parsed.filename,
				contentType: parsed.contentType,
				data: decodeBase64(parsed.data),
			},
			...(parsed.folder ? { folder: parsed.folder } : {}),
			...(parsed.alt_text !== undefined ? { alt_text: parsed.alt_text } : {}),
			...(parsed.metadata ? { metadata: parsed.metadata } : {}),
			...(parsed.trigger_webhook ? { trigger_webhook: true } : {}),
		},
	);

	const validated = CosmicEndpointOutputSchemas.mediaInsert.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.media.insert',
		{ filename: parsed.filename, folder: parsed.folder },
		'completed',
	);

	return validated;
};

export const update: CosmicEndpoints['mediaUpdate'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.mediaUpdate.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/media/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsed.folder ? { folder: parsed.folder } : {}),
				...(parsed.alt_text !== undefined ? { alt_text: parsed.alt_text } : {}),
				...(parsed.metadata ? { metadata: parsed.metadata } : {}),
				...(parsed.trigger_webhook
					? { trigger_webhook: parsed.trigger_webhook }
					: {}),
			},
		},
	);

	const validated = CosmicEndpointOutputSchemas.mediaUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.media.update',
		{ ...parsed },
		'completed',
	);

	return validated;
};

export const remove: CosmicEndpoints['mediaDelete'] = async (ctx, input) => {
	const parsed = CosmicEndpointInputSchemas.mediaDelete.parse(input);
	const slug = resolveBucketSlug(parsed, ctx);
	const response = await makeCosmicWriteRequest(
		`/v3/buckets/${slug}/media/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'DELETE',
			query: parsed.trigger_webhook
				? { trigger_webhook: parsed.trigger_webhook }
				: undefined,
		},
	);

	const validated = CosmicEndpointOutputSchemas.mediaDelete.parse(response);

	await logEventFromContext(
		ctx,
		'cosmic.media.delete',
		{ ...parsed },
		'completed',
	);

	return validated;
};
