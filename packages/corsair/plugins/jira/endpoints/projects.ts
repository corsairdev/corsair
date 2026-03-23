import { logEventFromContext } from '../../utils/events';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const create: JiraEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['projectsCreate']>(
		'project',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: {
				key: input.key,
				name: input.name,
				projectTypeKey: input.project_type_key ?? 'software',
				description: input.description,
				leadAccountId: input.lead_account_id,
				assigneeType: input.assignee_type ?? 'UNASSIGNED',
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
				description: input.description,
				projectTypeKey: input.project_type_key ?? 'software',
				leadAccountId: input.lead_account_id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.projects.create', { ...input }, 'completed');
	return result;
};

export const get: JiraEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['projectsGet']>(
		`project/${input.project_id_or_key}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: { expand: input.expand },
		},
	);

	if (result.id && result.key && ctx.db.projects) {
		try {
			await ctx.db.projects.upsertByEntityId(result.id, {
				id: result.id,
				key: result.key,
				name: result.name,
				description: result.description,
				projectTypeKey: result.projectTypeKey,
				leadAccountId: result.lead?.accountId,
				leadDisplayName: result.lead?.displayName,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.projects.get', { ...input }, 'completed');
	return result;
};

export const list: JiraEndpoints['projectsList'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['projectsList']>(
		'project/search',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: {
				query: input.query,
				orderBy: input.order_by,
				startAt: input.start_at,
				maxResults: input.max_results,
				expand: input.expand,
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
					name: project.name,
					description: project.description,
					projectTypeKey: project.projectTypeKey,
					leadAccountId: project.lead?.accountId,
					leadDisplayName: project.lead?.displayName,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'jira.projects.list', { ...input }, 'completed');
	return result;
};

export const getRoles: JiraEndpoints['projectsGetRoles'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['projectsGetRoles']>(
		`project/${input.project_id_or_key}/role`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'jira.projects.getRoles', { ...input }, 'completed');
	return result;
};
