import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PostOnceRequestOptions } from '../client';
import {
	compactBody,
	compactQuery,
	makePostOnceRequest,
	segment,
} from '../client';
import type { PostOnceEndpoints } from '../index';
import { PostOnceAccount, PostOncePost } from '../schema/database';
import type { PostOnceEndpointOutputs } from './types';

type CallCtx = {
	key: string;
};

type Store<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

async function postonceCall<T>(
	ctx: CallCtx,
	endpoint: string,
	options: PostOnceRequestOptions = {},
): Promise<T> {
	return await makePostOnceRequest<T>(endpoint, ctx.key, options);
}

/**
 * Event payload: the identifiers named, plus which fields were sent. Post
 * text, media URLs and account ids are left out.
 */
function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const fields = Object.keys(input).filter((key) => input[key] !== undefined);
	if (fields.length > 0) payload.fields = fields;
	return payload;
}

async function cacheEntity<Schema extends z.ZodType>(
	store: Store<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	label: string,
): Promise<void> {
	if (!store || record == null) return;
	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[POSTONCE] skipped caching a ${label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}
	const rawId = (parsed.data as { id?: unknown }).id;
	const id = typeof rawId === 'string' && rawId.length > 0 ? rawId : undefined;
	if (!id) return;
	try {
		await store.upsertByEntityId(id, parsed.data);
	} catch (error) {
		console.warn(`[POSTONCE] failed to cache ${label} ${id}:`, error);
	}
}

async function cacheEntities<Schema extends z.ZodType>(
	store: Store<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	label: string,
): Promise<void> {
	if (!store || !records?.length) return;
	await Promise.all(
		records.map((record) => cacheEntity(store, schema, record, label)),
	);
}

/** GET /v1/accounts */
export const listAccounts: PostOnceEndpoints['listAccounts'] = async (
	ctx,
	input,
) => {
	const result = await postonceCall<PostOnceEndpointOutputs['listAccounts']>(
		ctx,
		'accounts',
	);

	await cacheEntities(ctx.db.accounts, PostOnceAccount, result.data, 'account');

	await logEventFromContext(
		ctx,
		'postonce.accounts.list',
		{ ...auditPayload(input, []), count: result.data?.length ?? 0 },
		'completed',
	);
	return result;
};

/** POST /v1/posts */
export const createPost: PostOnceEndpoints['createPost'] = async (
	ctx,
	input,
) => {
	const result = await postonceCall<PostOnceEndpointOutputs['createPost']>(
		ctx,
		'posts',
		{
			method: 'POST',
			idempotencyKey: input.idempotencyKey,
			body: compactBody({
				content: input.content,
				targets: input.targets,
				media: input.media,
				publish_at: input.publish_at,
				external_id: input.external_id,
			}),
		},
	);

	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');

	await logEventFromContext(
		ctx,
		'postonce.posts.create',
		{
			...auditPayload(input, ['publish_at']),
			postId: result.data?.id,
			targets: input.targets.length,
		},
		'completed',
	);
	return result;
};

/** GET /v1/posts/{id} */
export const getPost: PostOnceEndpoints['getPost'] = async (ctx, input) => {
	const result = await postonceCall<PostOnceEndpointOutputs['getPost']>(
		ctx,
		`posts/${segment(input.id)}`,
	);

	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');

	await logEventFromContext(
		ctx,
		'postonce.posts.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};

/** GET /v1/posts */
export const listPosts: PostOnceEndpoints['listPosts'] = async (ctx, input) => {
	const result = await postonceCall<PostOnceEndpointOutputs['listPosts']>(
		ctx,
		'posts',
		{
			query: compactQuery({
				limit: input.limit,
				after: input.after,
			}),
		},
	);

	await cacheEntities(ctx.db.posts, PostOncePost, result.data, 'post');

	await logEventFromContext(
		ctx,
		'postonce.posts.list',
		{ ...auditPayload(input, ['limit']), count: result.data?.length ?? 0 },
		'completed',
	);
	return result;
};

/** POST /v1/posts/{id}/cancel */
export const cancelPost: PostOnceEndpoints['cancelPost'] = async (
	ctx,
	input,
) => {
	const result = await postonceCall<PostOnceEndpointOutputs['cancelPost']>(
		ctx,
		`posts/${segment(input.id)}/cancel`,
		{ method: 'POST' },
	);

	// The post record is kept with status `cancelled`, so refresh it rather
	// than evicting it.
	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');

	await logEventFromContext(
		ctx,
		'postonce.posts.cancel',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};
