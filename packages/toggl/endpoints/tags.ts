import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheTag, evictEntity } from './persist';
import type { TogglEndpointOutputs } from './types';

/** Lists a workspace's tags and mirrors each into the cache. */
export const list: TogglEndpoints['tagsList'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tagsList']>(
		`workspaces/${input.workspace_id}/tags`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				per_page: input.per_page,
				search: input.search,
			},
		},
	);

	const tags = result ?? [];

	for (const tag of tags) {
		await cacheTag(ctx.db.tags, tag);
	}

	await logEventFromContext(
		ctx,
		'toggl.tags.list',
		auditPayload(input, ['workspace_id', 'page', 'per_page']),
		'completed',
	);
	return tags;
};

/** Creates a tag in a workspace. */
export const create: TogglEndpoints['tagsCreate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tagsCreate']>(
		`workspaces/${input.workspace_id}/tags`,
		ctx.key,
		{
			method: 'POST',
			body: { name: input.name },
		},
	);

	await cacheTag(ctx.db.tags, result);

	await logEventFromContext(
		ctx,
		'toggl.tags.create',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result;
};

/** Renames a tag. */
export const update: TogglEndpoints['tagsUpdate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tagsUpdate']>(
		`workspaces/${input.workspace_id}/tags/${input.tag_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: { name: input.name },
		},
	);

	await cacheTag(ctx.db.tags, result);

	await logEventFromContext(
		ctx,
		'toggl.tags.update',
		auditPayload(input, ['workspace_id', 'tag_id']),
		'completed',
	);
	return result;
};

/** Deletes a tag and evicts it from the cache. */
export const remove: TogglEndpoints['tagsDelete'] = async (ctx, input) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/tags/${input.tag_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.tags, input.tag_id, 'tag');

	await logEventFromContext(
		ctx,
		'toggl.tags.delete',
		auditPayload(input, ['workspace_id', 'tag_id']),
		'completed',
	);
	return { deleted: true, id: input.tag_id };
};
