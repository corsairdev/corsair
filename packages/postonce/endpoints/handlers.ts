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
import {
	PostOnceEndpointInputSchemas,
	PostOnceEndpointOutputSchemas,
} from './types';

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
 * Core does not parse endpoint input or output, so each handler checks its
 * input before building the request and its reply before caching, logging or
 * returning it. The parsed input is a fresh copy, so the request and the
 * event log see the same values.
 */
function parseInput<K extends keyof PostOnceEndpointOutputs>(
	operation: K,
	input: unknown,
): z.infer<(typeof PostOnceEndpointInputSchemas)[K]> {
	return PostOnceEndpointInputSchemas[operation].parse(input) as z.infer<
		(typeof PostOnceEndpointInputSchemas)[K]
	>;
}

function parseOutput<K extends keyof PostOnceEndpointOutputs>(
	operation: K,
	raw: unknown,
): PostOnceEndpointOutputs[K] {
	return PostOnceEndpointOutputSchemas[operation].parse(
		raw,
	) as PostOnceEndpointOutputs[K];
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
	input = parseInput('listAccounts', input);
	const result = parseOutput(
		'listAccounts',
		await postonceCall<unknown>(ctx, 'accounts'),
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
	input = parseInput('createPost', input);
	const result = parseOutput(
		'createPost',
		await postonceCall<unknown>(ctx, 'posts', {
			method: 'POST',
			idempotencyKey: input.idempotencyKey,
			body: compactBody({
				content: input.content,
				targets: input.targets,
				media: input.media,
				publish_at: input.publish_at,
				external_id: input.external_id,
			}),
		}),
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
	input = parseInput('getPost', input);
	const result = parseOutput(
		'getPost',
		await postonceCall<unknown>(ctx, `posts/${segment(input.id)}`),
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
	input = parseInput('listPosts', input);
	const result = parseOutput(
		'listPosts',
		await postonceCall<unknown>(ctx, 'posts', {
			query: compactQuery({
				limit: input.limit,
				after: input.after,
			}),
		}),
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
	input = parseInput('cancelPost', input);
	const result = parseOutput(
		'cancelPost',
		await postonceCall<unknown>(ctx, `posts/${segment(input.id)}/cancel`, {
			method: 'POST',
		}),
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

/**
 * Calls PostOnce, checks the reply against the operation's output schema,
 * and logs the event with identifiers only (no post text, URLs or secrets).
 */
async function run<K extends keyof PostOnceEndpointOutputs>(
	ctx: Parameters<PostOnceEndpoints[K]>[0],
	operation: K,
	event: string,
	endpoint: string,
	options: PostOnceRequestOptions,
	payload: Record<string, unknown>,
): Promise<PostOnceEndpointOutputs[K]> {
	const raw = await postonceCall<unknown>(ctx, endpoint, options);
	const result = PostOnceEndpointOutputSchemas[operation].parse(
		raw,
	) as PostOnceEndpointOutputs[K];
	await logEventFromContext(ctx, event, payload, 'completed');
	return result;
}

/** PATCH /v1/posts/{id} */
export const updatePost: PostOnceEndpoints['updatePost'] = async (
	ctx,
	input,
) => {
	input = parseInput('updatePost', input);
	const { id, ...fields } = input;
	const result = await run(
		ctx,
		'updatePost',
		'postonce.posts.update',
		`posts/${segment(id)}`,
		{ method: 'PATCH', body: compactBody(fields) },
		auditPayload(input, ['id', 'publish_at']),
	);
	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');
	return result;
};

/** POST /v1/posts/{id}/publish */
export const publishPost: PostOnceEndpoints['publishPost'] = async (
	ctx,
	input,
) => {
	input = parseInput('publishPost', input);
	const result = await run(
		ctx,
		'publishPost',
		'postonce.posts.publish',
		`posts/${segment(input.id)}/publish`,
		{ method: 'POST' },
		auditPayload(input, ['id']),
	);
	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');
	return result;
};

/** POST /v1/posts/{id}/targets/{targetId}/retry */
export const retryPostTarget: PostOnceEndpoints['retryPostTarget'] = async (
	ctx,
	input,
) => {
	input = parseInput('retryPostTarget', input);
	const result = await run(
		ctx,
		'retryPostTarget',
		'postonce.posts.retryTarget',
		`posts/${segment(input.id)}/targets/${segment(input.targetId)}/retry`,
		{ method: 'POST' },
		auditPayload(input, ['id', 'targetId']),
	);
	await cacheEntity(ctx.db.posts, PostOncePost, result.data, 'post');
	return result;
};

/** GET /v1/posts/{id}/analytics */
export const getPostAnalytics: PostOnceEndpoints['getPostAnalytics'] = async (
	ctx,
	input,
) => {
	input = parseInput('getPostAnalytics', input);
	return run(
		ctx,
		'getPostAnalytics',
		'postonce.posts.getAnalytics',
		`posts/${segment(input.id)}/analytics`,
		{},
		auditPayload(input, ['id']),
	);
};

/** GET /v1/analytics */
export const getAnalytics: PostOnceEndpoints['getAnalytics'] = async (
	ctx,
	input,
) => {
	input = parseInput('getAnalytics', input);
	return run(
		ctx,
		'getAnalytics',
		'postonce.analytics.get',
		'analytics',
		{
			query: compactQuery({
				days: input.days,
				account_id: input.account_id,
				external_user_id: input.external_user_id,
			}),
		},
		auditPayload(input, ['days']),
	);
};

/** GET /v1/drafts */
export const listDrafts: PostOnceEndpoints['listDrafts'] = async (
	ctx,
	input,
) => {
	input = parseInput('listDrafts', input);
	return run(
		ctx,
		'listDrafts',
		'postonce.drafts.list',
		'drafts',
		{
			query: compactQuery({
				limit: input.limit,
				after: input.after,
				after_id: input.after_id,
				status: input.status,
			}),
		},
		auditPayload(input, ['limit', 'status']),
	);
};

/** POST /v1/drafts */
export const createDraft: PostOnceEndpoints['createDraft'] = async (
	ctx,
	input,
) => {
	input = parseInput('createDraft', input);
	const { idempotencyKey, ...fields } = input;
	return run(
		ctx,
		'createDraft',
		'postonce.drafts.create',
		'drafts',
		{ method: 'POST', idempotencyKey, body: compactBody(fields) },
		auditPayload(fields, []),
	);
};

/** GET /v1/drafts/{id} */
export const getDraft: PostOnceEndpoints['getDraft'] = async (ctx, input) => {
	input = parseInput('getDraft', input);
	return run(
		ctx,
		'getDraft',
		'postonce.drafts.get',
		`drafts/${segment(input.id)}`,
		{},
		auditPayload(input, ['id']),
	);
};

/** PATCH /v1/drafts/{id} */
export const updateDraft: PostOnceEndpoints['updateDraft'] = async (
	ctx,
	input,
) => {
	input = parseInput('updateDraft', input);
	const { id, ...fields } = input;
	return run(
		ctx,
		'updateDraft',
		'postonce.drafts.update',
		`drafts/${segment(id)}`,
		{ method: 'PATCH', body: compactBody(fields) },
		auditPayload(input, ['id', 'status']),
	);
};

/** POST /v1/media/uploads */
export const createMediaUpload: PostOnceEndpoints['createMediaUpload'] = async (
	ctx,
	input,
) => {
	input = parseInput('createMediaUpload', input);
	return run(
		ctx,
		'createMediaUpload',
		'postonce.media.createUpload',
		'media/uploads',
		{ method: 'POST', body: { ...input } },
		auditPayload(input, ['content_type']),
	);
};

/** GET /v1/media/{id} */
export const getMedia: PostOnceEndpoints['getMedia'] = async (ctx, input) => {
	input = parseInput('getMedia', input);
	return run(
		ctx,
		'getMedia',
		'postonce.media.get',
		`media/${segment(input.id)}`,
		{},
		{},
	);
};

/** GET /v1/workflows */
export const listWorkflows: PostOnceEndpoints['listWorkflows'] = async (ctx) =>
	run(ctx, 'listWorkflows', 'postonce.workflows.list', 'workflows', {}, {});

/** GET /v1/workflows/{id} */
export const getWorkflow: PostOnceEndpoints['getWorkflow'] = async (
	ctx,
	input,
) => {
	input = parseInput('getWorkflow', input);
	return run(
		ctx,
		'getWorkflow',
		'postonce.workflows.get',
		`workflows/${segment(input.id)}`,
		{},
		auditPayload(input, ['id']),
	);
};

/** POST /v1/workflows */
export const createWorkflow: PostOnceEndpoints['createWorkflow'] = async (
	ctx,
	input,
) => {
	input = parseInput('createWorkflow', input);
	const { idempotencyKey, ...fields } = input;
	return run(
		ctx,
		'createWorkflow',
		'postonce.workflows.create',
		'workflows',
		{ method: 'POST', idempotencyKey, body: compactBody(fields) },
		auditPayload(fields, ['is_active']),
	);
};

/** PUT /v1/workflows/{id} */
export const updateWorkflow: PostOnceEndpoints['updateWorkflow'] = async (
	ctx,
	input,
) => {
	input = parseInput('updateWorkflow', input);
	const { id, ...fields } = input;
	return run(
		ctx,
		'updateWorkflow',
		'postonce.workflows.update',
		`workflows/${segment(id)}`,
		{ method: 'PUT', body: compactBody(fields) },
		auditPayload(input, ['id', 'is_active']),
	);
};

/** DELETE /v1/workflows/{id} */
export const deleteWorkflow: PostOnceEndpoints['deleteWorkflow'] = async (
	ctx,
	input,
) => {
	input = parseInput('deleteWorkflow', input);
	return run(
		ctx,
		'deleteWorkflow',
		'postonce.workflows.delete',
		`workflows/${segment(input.id)}`,
		{ method: 'DELETE' },
		auditPayload(input, ['id']),
	);
};

/** GET /v1/webhooks */
export const listWebhooks: PostOnceEndpoints['listWebhooks'] = async (ctx) =>
	run(ctx, 'listWebhooks', 'postonce.webhooks.list', 'webhooks', {}, {});

/** GET /v1/webhooks/{id} */
export const getWebhook: PostOnceEndpoints['getWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('getWebhook', input);
	return run(
		ctx,
		'getWebhook',
		'postonce.webhooks.get',
		`webhooks/${segment(input.id)}`,
		{},
		auditPayload(input, ['id']),
	);
};

/** POST /v1/webhooks: the reply carries the signing secret, the event does not. */
export const createWebhook: PostOnceEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('createWebhook', input);
	return run(
		ctx,
		'createWebhook',
		'postonce.webhooks.create',
		'webhooks',
		{ method: 'POST', body: compactBody(input) },
		auditPayload(input, []),
	);
};

/** DELETE /v1/webhooks/{id} */
export const deleteWebhook: PostOnceEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('deleteWebhook', input);
	return run(
		ctx,
		'deleteWebhook',
		'postonce.webhooks.delete',
		`webhooks/${segment(input.id)}`,
		{ method: 'DELETE' },
		auditPayload(input, ['id']),
	);
};
