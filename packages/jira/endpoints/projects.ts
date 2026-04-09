import { logEventFromContext } from 'corsair/core';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const create: JiraEndpoints['projectsCreate'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['projectsCreate']>(
		'project',
		ctx.key,
		cloudUrl,
		{
			method: 'POST',
			body: {
				key: input.key,
				name: input.name,
				projectTypeKey: input.project_type_key ?? 'software',
				assigneeType: input.assignee_type ?? 'UNASSIGNED',
				...(input.description && { description: input.description }),
				...(input.lead_account_id && { leadAccountId: input.lead_account_id }),
			},
		},
	);

	if (result.id && result.key && ctx.db.projects) {
		try {
			// Jira returns project id as number from create; normalize to string for DB
			const projectId = String(result.id);
			await ctx.db.projects.upsertByEntityId(projectId, {
				id: projectId,
				key: result.key,
				name: input.name,
				...(input.description && { description: input.description }),
				projectTypeKey: input.project_type_key ?? 'software',
				...(input.lead_account_id && { leadAccountId: input.lead_account_id }),
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'jira.projects.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: JiraEndpoints['projectsGet'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['projectsGet']>(
		`project/${input.project_id_or_key}`,
		ctx.key,
		cloudUrl,
		{
			method: 'GET',
			query: { ...(input.expand && { expand: input.expand }) },
		},
	);

	if (result.id && result.key && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.id, {
				id: result.id,
				key: result.key,
				...(result.name && { name: result.name }),
				...(result.description && { description: result.description }),
				...(result.projectTypeKey && { projectTypeKey: result.projectTypeKey }),
				...(result.lead?.accountId && { leadAccountId: result.lead.accountId }),
				...(result.lead?.displayName && {
					leadDisplayName: result.lead.displayName,
				}),
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'jira.projects.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: JiraEndpoints['projectsList'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['projectsList']>(
		'project/search',
		ctx.key,
		cloudUrl,
		{
			method: 'GET',
			query: {
				...(input.query && { query: input.query }),
				...(input.order_by && { orderBy: input.order_by }),
				...(input.start_at !== undefined && { startAt: input.start_at }),
				...(input.max_results !== undefined && {
					maxResults: input.max_results,
				}),
				...(input.expand && { expand: input.expand }),
			},
		},
	);

	if (result.values && ctx.db.projects) {
		for (const project of result.values) {
			if (!project.id || !project.key) continue;
			try {
				await ctx.db.projects.upsertByEntityId(project.id, {
					id: project.id,
					key: project.key,
					...(project.name && { name: project.name }),
					...(project.description && { description: project.description }),
					...(project.projectTypeKey && {
						projectTypeKey: project.projectTypeKey,
					}),
					...(project.lead?.accountId && {
						leadAccountId: project.lead.accountId,
					}),
					...(project.lead?.displayName && {
						leadDisplayName: project.lead.displayName,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.projects.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRoles: JiraEndpoints['projectsGetRoles'] = async (
	ctx,
	input,
) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['projectsGetRoles']>(
		`project/${input.project_id_or_key}/role`,
		ctx.key,
		cloudUrl,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'jira.projects.getRoles',
		{ ...input },
		'completed',
	);
	return result;
};
