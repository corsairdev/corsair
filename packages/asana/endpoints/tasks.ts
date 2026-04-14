import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['tasksGet'] = async (ctx, input) => {
	const { task_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksGet']>(
		`tasks/${task_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save task to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.tasks.get', { task_gid }, 'completed');
	return result;
};

export const list: AsanaEndpoints['tasksList'] = async (ctx, input) => {
	const { opt_fields, opt_pretty, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksList']>(
		'tasks',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.tasks) {
		try {
			for (const task of result.data) {
				if (task.gid) {
					await ctx.db.tasks.upsertByEntityId(task.gid, { ...task });
				}
			}
		} catch (error) {
			console.warn('Failed to save tasks to database:', error);
		}
	}

	await logEventFromContext(ctx, 'asana.tasks.list', { ...rest }, 'completed');
	return result;
};

export const create: AsanaEndpoints['tasksCreate'] = async (ctx, input) => {
	const { data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksCreate']>(
		'tasks',
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save task to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.create',
		{ name: data.name },
		'completed',
	);
	return result;
};

export const update: AsanaEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { task_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksUpdate']>(
		`tasks/${task_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to update task in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.update',
		{ task_gid },
		'completed',
	);
	return result;
};

export const deleteTask: AsanaEndpoints['tasksDelete'] = async (ctx, input) => {
	const { task_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksDelete']>(
		`tasks/${task_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.tasks.delete',
		{ task_gid },
		'completed',
	);
	return result;
};

export const duplicate: AsanaEndpoints['tasksDuplicate'] = async (
	ctx,
	input,
) => {
	const { task_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksDuplicate']>(
		`tasks/${task_gid}/duplicate`,
		ctx.key,
		{ method: 'POST', body: data ? { data } : {}, query },
	);

	await logEventFromContext(
		ctx,
		'asana.tasks.duplicate',
		{ task_gid },
		'completed',
	);
	return result;
};

export const search: AsanaEndpoints['tasksSearch'] = async (ctx, input) => {
	const { workspace_gid, opt_fields, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksSearch']>(
		`workspaces/${workspace_gid}/tasks/search`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.tasks) {
		try {
			for (const task of result.data) {
				if (task.gid) {
					await ctx.db.tasks.upsertByEntityId(task.gid, { ...task });
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.search',
		{ workspace_gid },
		'completed',
	);
	return result;
};

export const addFollowers: AsanaEndpoints['tasksAddFollowers'] = async (
	ctx,
	input,
) => {
	const { task_gid, followers, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksAddFollowers']
	>(`tasks/${task_gid}/addFollowers`, ctx.key, {
		method: 'POST',
		body: { data: { followers } },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.addFollowers',
		{ task_gid },
		'completed',
	);
	return result;
};

export const removeFollower: AsanaEndpoints['tasksRemoveFollower'] = async (
	ctx,
	input,
) => {
	const { task_gid, followers, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksRemoveFollower']
	>(`tasks/${task_gid}/removeFollowers`, ctx.key, {
		method: 'POST',
		body: { data: { followers } },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.removeFollower',
		{ task_gid },
		'completed',
	);
	return result;
};

export const addProject: AsanaEndpoints['tasksAddProject'] = async (
	ctx,
	input,
) => {
	const {
		task_gid,
		project,
		section,
		insert_after,
		insert_before,
		opt_pretty,
	} = input;
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksAddProject']
	>(`tasks/${task_gid}/addProject`, ctx.key, {
		method: 'POST',
		body: { data: { project, section, insert_after, insert_before } },
		query: { opt_pretty },
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.addProject',
		{ task_gid, project },
		'completed',
	);
	return result;
};

export const removeProject: AsanaEndpoints['tasksRemoveProject'] = async (
	ctx,
	input,
) => {
	const { task_gid, project, opt_pretty } = input;
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksRemoveProject']
	>(`tasks/${task_gid}/removeProject`, ctx.key, {
		method: 'POST',
		body: { data: { project } },
		query: { opt_pretty },
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.removeProject',
		{ task_gid, project },
		'completed',
	);
	return result;
};

export const addTag: AsanaEndpoints['tasksAddTag'] = async (ctx, input) => {
	const { task_gid, tag, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksAddTag']>(
		`tasks/${task_gid}/addTag`,
		ctx.key,
		{ method: 'POST', body: { data: { tag } }, query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.tasks.addTag',
		{ task_gid, tag },
		'completed',
	);
	return result;
};

export const removeTag: AsanaEndpoints['tasksRemoveTag'] = async (
	ctx,
	input,
) => {
	const { task_gid, tag, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksRemoveTag']>(
		`tasks/${task_gid}/removeTag`,
		ctx.key,
		{ method: 'POST', body: { data: { tag } }, query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.tasks.removeTag',
		{ task_gid, tag },
		'completed',
	);
	return result;
};

export const addDependencies: AsanaEndpoints['tasksAddDependencies'] = async (
	ctx,
	input,
) => {
	const { task_gid, dependencies, opt_pretty } = input;
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksAddDependencies']
	>(`tasks/${task_gid}/addDependencies`, ctx.key, {
		method: 'POST',
		body: { data: { dependencies } },
		query: { opt_pretty },
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.addDependencies',
		{ task_gid },
		'completed',
	);
	return result;
};

export const createSubtask: AsanaEndpoints['tasksCreateSubtask'] = async (
	ctx,
	input,
) => {
	const { task_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksCreateSubtask']
	>(`tasks/${task_gid}/subtasks`, ctx.key, {
		method: 'POST',
		body: { data },
		query,
	});

	if (result.data?.gid && ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to save subtask to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.createSubtask',
		{ task_gid },
		'completed',
	);
	return result;
};

export const getSubtasks: AsanaEndpoints['tasksGetSubtasks'] = async (
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
		AsanaEndpointOutputs['tasksGetSubtasks']
	>(`tasks/${task_gid}/subtasks`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.tasks) {
		try {
			for (const task of result.data) {
				if (task.gid) {
					await ctx.db.tasks.upsertByEntityId(task.gid, { ...task });
				}
			}
		} catch (error) {
			console.warn('Failed to save subtasks to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.getSubtasks',
		{ task_gid },
		'completed',
	);
	return result;
};

export const setParent: AsanaEndpoints['tasksSetParent'] = async (
	ctx,
	input,
) => {
	const { task_gid, parent, insert_after, insert_before, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksSetParent']>(
		`tasks/${task_gid}/setParent`,
		ctx.key,
		{
			method: 'POST',
			body: { data: { parent, insert_after, insert_before } },
			query: { opt_pretty },
		},
	);

	if (result.data?.gid && ctx.db.tasks) {
		try {
			await ctx.db.tasks.upsertByEntityId(result.data.gid, { ...result.data });
		} catch (error) {
			console.warn('Failed to update task parent in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.setParent',
		{ task_gid },
		'completed',
	);
	return result;
};

export const getStories: AsanaEndpoints['tasksGetStories'] = async (
	ctx,
	input,
) => {
	const { task_gid, limit, offset, opt_fields } = input;
	const query: Record<string, string | number | undefined> = { limit, offset };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksGetStories']
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
		'asana.tasks.getStories',
		{ task_gid },
		'completed',
	);
	return result;
};

export const getAttachments: AsanaEndpoints['tasksGetAttachments'] = async (
	ctx,
	input,
) => {
	const { task_gid, limit, offset, opt_fields } = input;
	const query: Record<string, string | number | undefined> = { limit, offset };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksGetAttachments']
	>(`tasks/${task_gid}/attachments`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.tasks.getAttachments',
		{ task_gid },
		'completed',
	);
	return result;
};

export const getTags: AsanaEndpoints['tasksGetTags'] = async (ctx, input) => {
	const { task_gid, limit, offset, opt_fields } = input;
	const query: Record<string, string | number | undefined> = { limit, offset };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['tasksGetTags']>(
		`tasks/${task_gid}/tags`,
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
			console.warn('Failed to save task tags to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.tasks.getTags',
		{ task_gid },
		'completed',
	);
	return result;
};

export const addToSection: AsanaEndpoints['tasksAddToSection'] = async (
	ctx,
	input,
) => {
	const { section_gid, task, insert_before, insert_after, opt_pretty } = input;
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['tasksAddToSection']
	>(`sections/${section_gid}/addTask`, ctx.key, {
		method: 'POST',
		body: { data: { task, insert_before, insert_after } },
		query: { opt_pretty },
	});

	await logEventFromContext(
		ctx,
		'asana.tasks.addToSection',
		{ section_gid, task },
		'completed',
	);
	return result;
};
