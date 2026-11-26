import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PubloraRequestOptions } from '../client';
import {
	compactBody,
	compactQuery,
	makePubloraRequest,
	segment,
} from '../client';
import type { PubloraEndpoints } from '../index';
import { PubloraAccount, PubloraPost } from '../schema/database';
import type { PubloraEndpointOutputs } from './types';
import {
	PubloraEndpointInputSchemas,
	PubloraEndpointOutputSchemas,
} from './types';

// `unknown` in this file marks data not yet checked: Publora replies before
// the output schema parses them, raw input before parseInput, and cached
// records before their entity schema. Each one is parsed before use.
type CallCtx = {
	key: string;
};

type Store<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

async function publoraCall<T>(
	ctx: CallCtx,
	endpoint: string,
	options: PubloraRequestOptions = {},
): Promise<T> {
	return await makePubloraRequest<T>(endpoint, ctx.key, options);
}

/**
 * Core does not parse endpoint input or output, so each handler checks its
 * input before building the request and its reply before caching, logging or
 * returning it. The parsed input is a fresh copy, so the request and the
 * event log see the same values.
 */
function parseInput<K extends keyof PubloraEndpointOutputs>(
	operation: K,
	input: unknown,
): z.infer<(typeof PubloraEndpointInputSchemas)[K]> {
	return PubloraEndpointInputSchemas[operation].parse(input) as z.infer<
		(typeof PubloraEndpointInputSchemas)[K]
	>;
}

function parseOutput<K extends keyof PubloraEndpointOutputs>(
	operation: K,
	raw: unknown,
): PubloraEndpointOutputs[K] {
	return PubloraEndpointOutputSchemas[operation].parse(
		raw,
	) as PubloraEndpointOutputs[K];
}

/**
 * Event payload: the identifiers named, plus which fields were sent. Post
 * text, media URLs, connection ids and webhook URLs are left out.
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
	idKey: 'platformId' | 'postGroupId',
	record: unknown,
	label: string,
): Promise<void> {
	if (!store || record == null) return;
	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[PUBLORA] skipped caching a ${label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}
	const rawId = (parsed.data as Record<string, unknown>)[idKey];
	const id = typeof rawId === 'string' && rawId.length > 0 ? rawId : undefined;
	if (!id) return;
	try {
		await store.upsertByEntityId(id, parsed.data);
	} catch (error) {
		console.warn(`[PUBLORA] failed to cache ${label} ${id}:`, error);
	}
}

async function cacheEntities<Schema extends z.ZodType>(
	store: Store<z.infer<Schema>> | undefined,
	schema: Schema,
	idKey: 'platformId' | 'postGroupId',
	records: readonly unknown[] | undefined | null,
	label: string,
): Promise<void> {
	if (!store || !records?.length) return;
	await Promise.all(
		records.map((record) => cacheEntity(store, schema, idKey, record, label)),
	);
}

/** GET /platform-connections */
export const listAccounts: PubloraEndpoints['listAccounts'] = async (
	ctx,
	input,
) => {
	input = parseInput('listAccounts', input);
	const result = parseOutput(
		'listAccounts',
		await publoraCall<unknown>(ctx, 'platform-connections'),
	);

	await cacheEntities(
		ctx.db.accounts,
		PubloraAccount,
		'platformId',
		result.connections,
		'account',
	);

	await logEventFromContext(
		ctx,
		'publora.accounts.list',
		{ ...auditPayload(input, []), count: result.connections.length },
		'completed',
	);
	return result;
};

/** GET /account-context */
export const getContext: PubloraEndpoints['getContext'] = async (
	ctx,
	input,
) => {
	input = parseInput('getContext', input);
	const result = parseOutput(
		'getContext',
		await publoraCall<unknown>(ctx, 'account-context', {
			query: compactQuery({ scheduledTime: input.scheduledTime }),
		}),
	);

	await logEventFromContext(
		ctx,
		'publora.accounts.getContext',
		{
			...auditPayload(input, ['scheduledTime']),
			plan: result.context.plan?.key,
		},
		'completed',
	);
	return result;
};

/** POST /create-post */
export const createPost: PubloraEndpoints['createPost'] = async (
	ctx,
	input,
) => {
	input = parseInput('createPost', input);
	const result = parseOutput(
		'createPost',
		await publoraCall<unknown>(ctx, 'create-post', {
			method: 'POST',
			idempotencyKey: input.idempotencyKey,
			body: compactBody({
				content: input.content,
				platforms: input.platforms,
				scheduledTime: input.scheduledTime,
				publishNow: input.publishNow,
				platformSettings: input.platformSettings,
				firstComments: input.firstComments,
				mediaUrls: input.mediaUrls,
			}),
		}),
	);

	await logEventFromContext(
		ctx,
		'publora.posts.create',
		{
			...auditPayload(input, ['scheduledTime', 'publishNow']),
			postGroupId: result.postGroupId,
			platforms: input.platforms.length,
		},
		'completed',
	);
	return result;
};

/** GET /get-post/{postGroupId} */
export const getPost: PubloraEndpoints['getPost'] = async (ctx, input) => {
	input = parseInput('getPost', input);
	const result = parseOutput(
		'getPost',
		await publoraCall<unknown>(ctx, `get-post/${segment(input.postGroupId)}`),
	);

	await cacheEntity(ctx.db.posts, PubloraPost, 'postGroupId', result, 'post');

	await logEventFromContext(
		ctx,
		'publora.posts.get',
		{ ...auditPayload(input, ['postGroupId']), status: result.status },
		'completed',
	);
	return result;
};

/** GET /list-posts */
export const listPosts: PubloraEndpoints['listPosts'] = async (ctx, input) => {
	input = parseInput('listPosts', input);
	const result = parseOutput(
		'listPosts',
		await publoraCall<unknown>(ctx, 'list-posts', {
			query: compactQuery({
				page: input.page,
				limit: input.limit,
				status: input.status,
				platform: input.platform,
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
				fromDate: input.fromDate,
				toDate: input.toDate,
			}),
		}),
	);

	await cacheEntities(
		ctx.db.posts,
		PubloraPost,
		'postGroupId',
		result.posts,
		'post',
	);

	await logEventFromContext(
		ctx,
		'publora.posts.list',
		{
			...auditPayload(input, ['page', 'limit', 'status', 'platform']),
			count: result.posts.length,
		},
		'completed',
	);
	return result;
};

/** PUT /update-post/{postGroupId} */
export const updatePost: PubloraEndpoints['updatePost'] = async (
	ctx,
	input,
) => {
	input = parseInput('updatePost', input);
	const { postGroupId, idempotencyKey, ...fields } = input;
	const result = parseOutput(
		'updatePost',
		await publoraCall<unknown>(ctx, `update-post/${segment(postGroupId)}`, {
			method: 'PUT',
			idempotencyKey,
			body: compactBody(fields),
		}),
	);

	await logEventFromContext(
		ctx,
		'publora.posts.update',
		{
			...auditPayload(input, ['postGroupId', 'status', 'publishNow']),
			resultStatus: result.postGroup?.status,
		},
		'completed',
	);
	return result;
};

/** DELETE /delete-post/{postGroupId} */
export const deletePost: PubloraEndpoints['deletePost'] = async (
	ctx,
	input,
) => {
	input = parseInput('deletePost', input);
	const result = parseOutput(
		'deletePost',
		await publoraCall<unknown>(
			ctx,
			`delete-post/${segment(input.postGroupId)}`,
			{
				method: 'DELETE',
			},
		),
	);

	// Publora removes the group and its media, so the cached copy goes too.
	if (ctx.db.posts) {
		try {
			await ctx.db.posts.deleteByEntityId(input.postGroupId);
		} catch (error) {
			console.warn(
				`[PUBLORA] failed to evict post ${input.postGroupId}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'publora.posts.delete',
		auditPayload(input, ['postGroupId']),
		'completed',
	);
	return result;
};

/**
 * Calls Publora, checks the reply against the operation's output schema,
 * and logs the event with identifiers only (no post text, URLs or secrets).
 */
async function run<K extends keyof PubloraEndpointOutputs>(
	ctx: Parameters<PubloraEndpoints[K]>[0],
	operation: K,
	event: string,
	endpoint: string,
	options: PubloraRequestOptions,
	payload: Record<string, unknown>,
): Promise<PubloraEndpointOutputs[K]> {
	const raw = await publoraCall<unknown>(ctx, endpoint, options);
	const result = parseOutput(operation, raw);
	await logEventFromContext(ctx, event, payload, 'completed');
	return result;
}

/** POST /get-upload-url */
export const createMediaUpload: PubloraEndpoints['createMediaUpload'] = async (
	ctx,
	input,
) => {
	input = parseInput('createMediaUpload', input);
	return await run(
		ctx,
		'createMediaUpload',
		'publora.media.createUpload',
		'get-upload-url',
		{
			method: 'POST',
			body: compactBody({
				postGroupId: input.postGroupId,
				fileName: input.fileName,
				contentType: input.contentType,
				type: input.type,
			}),
		},
		auditPayload(input, ['postGroupId', 'contentType']),
	);
};

/** POST /complete-media/{mediaFileId} */
export const completeMedia: PubloraEndpoints['completeMedia'] = async (
	ctx,
	input,
) => {
	input = parseInput('completeMedia', input);
	return await run(
		ctx,
		'completeMedia',
		'publora.media.complete',
		`complete-media/${segment(input.mediaId)}`,
		{ method: 'POST', body: {} },
		auditPayload(input, ['mediaId']),
	);
};

/** DELETE /media/{mediaId} */
export const deleteMedia: PubloraEndpoints['deleteMedia'] = async (
	ctx,
	input,
) => {
	input = parseInput('deleteMedia', input);
	return await run(
		ctx,
		'deleteMedia',
		'publora.media.delete',
		`media/${segment(input.mediaId)}`,
		{ method: 'DELETE' },
		auditPayload(input, ['mediaId']),
	);
};

/** GET /webhooks */
export const listWebhooks: PubloraEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	input = parseInput('listWebhooks', input);
	return await run(
		ctx,
		'listWebhooks',
		'publora.webhooks.list',
		'webhooks',
		{},
		auditPayload(input, []),
	);
};

/** POST /webhooks */
export const createWebhook: PubloraEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('createWebhook', input);
	return await run(
		ctx,
		'createWebhook',
		'publora.webhooks.create',
		'webhooks',
		{
			method: 'POST',
			body: { name: input.name, url: input.url, events: input.events },
		},
		{ ...auditPayload(input, []), events: input.events },
	);
};

/** PATCH /webhooks/{id} */
export const updateWebhook: PubloraEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('updateWebhook', input);
	const { id, ...fields } = input;
	return await run(
		ctx,
		'updateWebhook',
		'publora.webhooks.update',
		`webhooks/${segment(id)}`,
		{ method: 'PATCH', body: compactBody(fields) },
		auditPayload(input, ['id', 'isActive']),
	);
};

/** DELETE /webhooks/{id} */
export const deleteWebhook: PubloraEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	input = parseInput('deleteWebhook', input);
	return await run(
		ctx,
		'deleteWebhook',
		'publora.webhooks.delete',
		`webhooks/${segment(input.id)}`,
		{ method: 'DELETE' },
		auditPayload(input, ['id']),
	);
};
