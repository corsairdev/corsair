import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['tagsGet'] = async (ctx, input) => {
	const { tag_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsGet']>(
		`tags/${tag_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.tags) {
		try {
			await ctx.db.tags.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save tag to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.tags.get', { tag_gid }, 'completed');
	return result;
};

export const list: AsanaEndpoints['tagsList'] = async (ctx, input) => {
	const { opt_fields, opt_pretty, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsList']>(
		'tags',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.tags) {
		try {
			for (const tag of result.data) {
				if (tag.gid) {
					await ctx.db.tags.upsertByEntityId(tag.gid, { ...tag });
				}
			}
		} catch (error) {
			console.warn('Failed to save tags to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.tags.list', { ...rest }, 'completed');
	return result;
};

export const listForWorkspace: AsanaEndpoints['tagsListForWorkspace'] = async (
	ctx,
	input,
) => {
	const { workspace_gid, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tagsListForWorkspace']
	>(`workspaces/${workspace_gid}/tags`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.tags) {
		try {
			for (const tag of result.data) {
				if (tag.gid) {
					await ctx.db.tags.upsertByEntityId(tag.gid, { ...tag });
				}
			}
		} catch (error) {
			console.warn('Failed to save workspace tags to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tags.listForWorkspace',
		{ workspace_gid },
		'completed',
	);
	return result;
};

export const listForTask: AsanaEndpoints['tagsListForTask'] = async (
	ctx,
	input,
) => {
	const { task_gid, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tagsListForTask']
	>(`tasks/${task_gid}/tags`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.tags) {
		try {
			for (const tag of result.data) {
				if (tag.gid) {
					await ctx.db.tags.upsertByEntityId(tag.gid, { ...tag });
				}
			}
		} catch (error) {
			console.warn('Failed to save task tags to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tags.listForTask',
		{ task_gid },
		'completed',
	);
	return result;
};

export const create: AsanaEndpoints['tagsCreate'] = async (ctx, input) => {
	const { data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsCreate']>(
		'tags',
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.tags) {
		try {
			await ctx.db.tags.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save tag to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tags.create',
		{ name: data.name },
		'completed',
	);
	return result;
};

export const createInWorkspace: AsanaEndpoints['tagsCreateInWorkspace'] =
	async (ctx, input) => {
		const { workspace_gid, data, opt_fields, opt_pretty } = input;
		const query: Record<string, string | boolean | undefined> = { opt_pretty };
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['tagsCreateInWorkspace']
		>(`workspaces/${workspace_gid}/tags`, ctx.key, {
			method: 'POST',
			body: { data },
			query,
		});

		if (result.data?.gid && ctx.db.tags) {
			try {
				await ctx.db.tags.upsertByEntityId(result.data.gid, { ...result.data });
			} catch (error) {
				console.warn('Failed to save tag to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'asana.tags.createInWorkspace',
			{ workspace_gid, name: data.name },
			'completed',
		);
		return result;
	};

export const update: AsanaEndpoints['tagsUpdate'] = async (ctx, input) => {
	const { tag_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsUpdate']>(
		`tags/${tag_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.tags) {
		try {
			await ctx.db.tags.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to update tag in database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.tags.update', { tag_gid }, 'completed');
	return result;
};

export const deleteTag: AsanaEndpoints['tagsDelete'] = async (ctx, input) => {
	const { tag_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsDelete']>(
		`tags/${tag_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(ctx, 'asana.tags.delete', { tag_gid }, 'completed');
	return result;
};

export const getTasks: AsanaEndpoints['tagsGetTasks'] = async (ctx, input) => {
	const { tag_gid, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tagsGetTasks']>(
		`tags/${tag_gid}/tasks`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'asana.tags.getTasks',
		{ tag_gid },
		'completed',
	);
	return result;
};
