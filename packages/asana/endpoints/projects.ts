import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['projectsGet'] = async (ctx, input) => {
	const { project_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['projectsGet']>(
		`projects/${project_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.gid && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.get',
		{ project_gid },
		'completed',
	);
	return result;
};

export const list: AsanaEndpoints['projectsList'] = async (ctx, input) => {
	const { opt_fields, opt_pretty, ...rest } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		...rest,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['projectsList']>(
		'projects',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.data?.length && ctx.db.projects) {
		try {
			for (const project of result.data) {
				if (project.gid) {
					await ctx.db.projects.upsertByEntityId(project.gid, { ...project });
				}
			}
		} catch (error) {
			console.warn('Failed to save projects to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.list',
		{ ...rest },
		'completed',
	);
	return result;
};

export const create: AsanaEndpoints['projectsCreate'] = async (ctx, input) => {
	const { data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['projectsCreate']>(
		'projects',
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.create',
		{ name: data.name },
		'completed',
	);
	return result;
};

export const createForTeam: AsanaEndpoints['projectsCreateForTeam'] = async (
	ctx,
	input,
) => {
	const { team_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsCreateForTeam']
	>(`teams/${team_gid}/projects`, ctx.key, {
		method: 'POST',
		body: { data },
		query,
	});

	if (result.data?.gid && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.createForTeam',
		{ team_gid, name: data.name },
		'completed',
	);
	return result;
};

export const createForWorkspace: AsanaEndpoints['projectsCreateForWorkspace'] =
	async (ctx, input) => {
		const { workspace_gid, data, opt_fields, opt_pretty } = input;
		const query: Record<string, string | boolean | undefined> = { opt_pretty };
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['projectsCreateForWorkspace']
		>(`workspaces/${workspace_gid}/projects`, ctx.key, {
			method: 'POST',
			body: { data },
			query,
		});

		if (result.data?.gid && ctx.db.projects) {
			try {
				await ctx.db.projects.upsertByEntityId(result.data.gid, {
					...result.data,
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'asana.projects.createForWorkspace',
			{ workspace_gid, name: data.name },
			'completed',
		);
		return result;
	};

export const update: AsanaEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { project_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['projectsUpdate']>(
		`projects/${project_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	if (result.data?.gid && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.data.gid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to update project in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.update',
		{ project_gid },
		'completed',
	);
	return result;
};

export const deleteProject: AsanaEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const { project_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['projectsDelete']>(
		`projects/${project_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.projects.delete',
		{ project_gid },
		'completed',
	);
	return result;
};

export const duplicate: AsanaEndpoints['projectsDuplicate'] = async (
	ctx,
	input,
) => {
	const { project_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsDuplicate']
	>(`projects/${project_gid}/duplicate`, ctx.key, {
		method: 'POST',
		body: { data },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.projects.duplicate',
		{ project_gid },
		'completed',
	);
	return result;
};

export const addFollowers: AsanaEndpoints['projectsAddFollowers'] = async (
	ctx,
	input,
) => {
	const { project_gid, followers, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsAddFollowers']
	>(`projects/${project_gid}/addFollowers`, ctx.key, {
		method: 'POST',
		body: { data: { followers } },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.projects.addFollowers',
		{ project_gid },
		'completed',
	);
	return result;
};

export const removeFollowers: AsanaEndpoints['projectsRemoveFollowers'] =
	async (ctx, input) => {
		const { project_gid, followers, opt_fields, opt_pretty } = input;
		const query: Record<string, string | boolean | undefined> = { opt_pretty };
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['projectsRemoveFollowers']
		>(`projects/${project_gid}/removeFollowers`, ctx.key, {
			method: 'POST',
			body: { data: { followers } },
			query,
		});

		await logEventFromContext(
			ctx,
			'asana.projects.removeFollowers',
			{ project_gid },
			'completed',
		);
		return result;
	};

export const addMembers: AsanaEndpoints['projectsAddMembers'] = async (
	ctx,
	input,
) => {
	const { project_gid, members, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsAddMembers']
	>(`projects/${project_gid}/addMembers`, ctx.key, {
		method: 'POST',
		body: { data: { members } },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.projects.addMembers',
		{ project_gid },
		'completed',
	);
	return result;
};

export const removeMembers: AsanaEndpoints['projectsRemoveMembers'] = async (
	ctx,
	input,
) => {
	const { project_gid, members, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsRemoveMembers']
	>(`projects/${project_gid}/removeMembers`, ctx.key, {
		method: 'POST',
		body: { data: { members } },
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.projects.removeMembers',
		{ project_gid },
		'completed',
	);
	return result;
};

export const getTasks: AsanaEndpoints['projectsGetTasks'] = async (
	ctx,
	input,
) => {
	const {
		project_gid,
		completed_since,
		limit,
		offset,
		opt_fields,
		opt_pretty,
	} = input;
	const query: Record<string, string | number | boolean | undefined> = {
		completed_since,
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsGetTasks']
	>(`projects/${project_gid}/tasks`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.tasks) {
		try {
			for (const task of result.data) {
				if (task.gid) {
					await ctx.db.tasks.upsertByEntityId(task.gid, { ...task });
				}
			}
		} catch (error) {
			console.warn('Failed to save project tasks to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.getTasks',
		{ project_gid },
		'completed',
	);
	return result;
};

export const getTaskCounts: AsanaEndpoints['projectsGetTaskCounts'] = async (
	ctx,
	input,
) => {
	const { project_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['projectsGetTaskCounts']
	>(`projects/${project_gid}/task_counts`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.projects.getTaskCounts',
		{ project_gid },
		'completed',
	);
	return result;
};

export const listForWorkspace: AsanaEndpoints['workspaceProjectsList'] = async (
	ctx,
	input,
) => {
	const { workspace_gid, archived, limit, offset, opt_fields, opt_pretty } =
		input;
	const query: Record<string, string | number | boolean | undefined> = {
		archived,
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['workspaceProjectsList']
	>(`workspaces/${workspace_gid}/projects`, ctx.key, { method: 'GET', query });

	if (result.data?.length && ctx.db.projects) {
		try {
			for (const project of result.data) {
				if (project.gid) {
					await ctx.db.projects.upsertByEntityId(project.gid, { ...project });
				}
			}
		} catch (error) {
			console.warn('Failed to save workspace projects to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'asana.projects.listForWorkspace',
		{ workspace_gid },
		'completed',
	);
	return result;
};
