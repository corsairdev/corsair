import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['storiesGet'] = async (ctx, input) => {
	const { story_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['storiesGet']>(
		`stories/${story_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.stories) {
		try {
			await ctx.db.stories.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save story to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.stories.get',
		{ story_gid },
		'completed',
	);
	return result;
};

export const listForTask: AsanaEndpoints['storiesListForTask'] = async (
	ctx,
	input,
) => {
	const { task_gid, limit, offset, opt_fields } = input;
	const query: Record<string, string | number | undefined> = { limit, offset };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['storiesListForTask']
	>(`tasks/${task_gid}/stories`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.stories) {
		try {
			for (const story of result.data) {
				if (story.gid) {
					await ctx.db.stories.upsertByEntityId(story.gid, { ...story });
				}
			}
		} catch (error) {
			console.warn('Failed to save stories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.stories.listForTask',
		{ task_gid },
		'completed',
	);
	return result;
};

export const createComment: AsanaEndpoints['storiesCreateComment'] = async (
	ctx,
	input,
) => {
	const { task_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['storiesCreateComment']
	>(`tasks/${task_gid}/stories`, ctx.key, {
		method: 'POST',
		body: { data },
		query,
	});

	if (result.data?.gid && ctx.db.stories) {
		try {
			await ctx.db.stories.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save story to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.stories.createComment',
		{ task_gid },
		'completed',
	);
	return result;
};

export const update: AsanaEndpoints['storiesUpdate'] = async (ctx, input) => {
	const { story_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['storiesUpdate']>(
		`stories/${story_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.stories) {
		try {
			await ctx.db.stories.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to update story in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.stories.update',
		{ story_gid },
		'completed',
	);
	return result;
};

export const deleteStory: AsanaEndpoints['storiesDelete'] = async (
	ctx,
	input,
) => {
	const { story_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['storiesDelete']>(
		`stories/${story_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.stories.delete',
		{ story_gid },
		'completed',
	);
	return result;
};
