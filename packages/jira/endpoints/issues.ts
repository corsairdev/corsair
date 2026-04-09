import { logEventFromContext } from 'corsair/core';
import type { JiraEndpoints } from '..';
import { makeJiraRequest, uploadJiraAttachment } from '../client';
import type { JiraEndpointOutputs } from './types';
import { makeAdf } from './types';

export const create: JiraEndpoints['issuesCreate'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesCreate']>(
		'issue',
		ctx.key,
		cloudUrl,
		{
			method: 'POST',
			body: {
				fields: {
					project: { key: input.project_key },
					summary: input.summary,
					issuetype: { name: input.issue_type ?? 'Task' },
					...(input.description && { description: makeAdf(input.description) }),
					...(input.assignee && { assignee: { accountId: input.assignee } }),
					...(input.priority && { priority: { name: input.priority } }),
					...(input.labels && { labels: input.labels }),
					...(input.due_date && { duedate: input.due_date }),
					...(input.parent && { parent: { key: input.parent } }),
				},
			},
		},
	);

	if (result.id && result.key && ctx.db.issues) {
		try {
			await ctx.db.issues.upsertByEntityId(result.id, {
				id: result.id,
				key: result.key,
				summary: input.summary,
				issueType: input.issue_type ?? 'Task',
				projectKey: input.project_key,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'jira.issues.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: JiraEndpoints['issuesGet'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesGet']>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		cloudUrl,
		{
			method: 'GET',
			query: {
				fields: input.fields,
				expand: input.expand,
			},
		},
	);

	if (result.id && result.key && ctx.db.issues) {
		try {
			await ctx.db.issues.upsertByEntityId(result.id, {
				id: result.id,
				key: result.key,
				summary: result.fields?.summary,
				status: result.fields?.status?.name,
				assigneeAccountId: result.fields?.assignee?.accountId,
				assigneeDisplayName: result.fields?.assignee?.displayName,
				reporterAccountId: result.fields?.reporter?.accountId,
				reporterDisplayName: result.fields?.reporter?.displayName,
				priority: result.fields?.priority?.name ?? undefined,
				issueType: result.fields?.issuetype?.name,
				projectKey: result.fields?.project?.key,
				projectId: result.fields?.project?.id,
				labels: result.fields?.labels,
				created: result.fields?.created,
				updated: result.fields?.updated,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.issues.get', { ...input }, 'completed');
	return result;
};

export const edit: JiraEndpoints['issuesEdit'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		cloudUrl,
		{
			method: 'PUT',
			body: {
				fields: {
					...(input.summary !== undefined && { summary: input.summary }),
					...(input.description !== undefined && {
						description: makeAdf(input.description),
					}),
					...(input.assignee !== undefined && {
						assignee: input.assignee ? { accountId: input.assignee } : null,
					}),
					...(input.priority !== undefined && {
						priority: { name: input.priority },
					}),
					...(input.labels !== undefined && { labels: input.labels }),
					...(input.due_date !== undefined && { duedate: input.due_date }),
				},
				update: {},
				notifyUsers: input.notify_users ?? true,
			},
		},
	);

	// DB update is skipped here because we only have issue_id_or_key (may be a key, not numeric id)
	// The next issues.get call will refresh the DB with the updated data

	await logEventFromContext(ctx, 'jira.issues.edit', { ...input }, 'completed');
	return { success: true, issue_key: input.issue_id_or_key };
};

export const deleteIssue: JiraEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'DELETE',
			query: { deleteSubtasks: input.delete_subtasks ? 'true' : 'false' },
		},
	);

	await logEventFromContext(
		ctx,
		'jira.issues.delete',
		{ ...input },
		'completed',
	);
	return { success: true, message: `Issue ${input.issue_id_or_key} deleted` };
};

export const search: JiraEndpoints['issuesSearch'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesSearch']>(
		'search/jql',
		ctx.key,
		cloudUrl,
		{
			method: 'GET',
			query: {
				jql: input.jql,
				startAt: input.start_at,
				maxResults: input.max_results,
				fields: input.fields,
				expand: input.expand,
			},
		},
	);

	if (result.issues && ctx.db.issues) {
		for (const issue of result.issues) {
			if (!issue.id || !issue.key) continue;
			try {
				await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					key: issue.key,
					summary: issue.fields?.summary,
					status: issue.fields?.status?.name,
					assigneeAccountId: issue.fields?.assignee?.accountId,
					assigneeDisplayName: issue.fields?.assignee?.displayName,
					priority: issue.fields?.priority?.name ?? undefined,
					issueType: issue.fields?.issuetype?.name,
					projectKey: issue.fields?.project?.key,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.issues.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const assign: JiraEndpoints['issuesAssign'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/assignee`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'PUT',
			body: { accountId: input.account_id ?? null },
		},
	);

	// DB update skipped: only issue_id_or_key is available (may be a key, not numeric id)
	// The next issues.get call will refresh the DB with the updated data

	await logEventFromContext(
		ctx,
		'jira.issues.assign',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const getTransitions: JiraEndpoints['issuesGetTransitions'] = async (
	ctx,
	input,
) => {
	const result = await makeJiraRequest<
		JiraEndpointOutputs['issuesGetTransitions']
	>(
		`issue/${input.issue_id_or_key}/transitions`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'jira.issues.getTransitions',
		{ ...input },
		'completed',
	);
	return result;
};

export const transition: JiraEndpoints['issuesTransition'] = async (
	ctx,
	input,
) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/transitions`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: {
				transition: { id: input.transition_id },
				...(input.comment && {
					update: { comment: [{ add: { body: makeAdf(input.comment) } }] },
				}),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'jira.issues.transition',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const bulkCreate: JiraEndpoints['issuesBulkCreate'] = async (
	ctx,
	input,
) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesBulkCreate']>(
		'issue/bulk',
		ctx.key,
		cloudUrl,
		{
			method: 'POST',
			body: {
				issueUpdates: input.issues.map((issue) => ({
					fields: {
						project: { key: issue.project_key },
						summary: issue.summary,
						issuetype: { name: issue.issue_type ?? 'Task' },
						...(issue.assignee && { assignee: { accountId: issue.assignee } }),
						...(issue.priority && { priority: { name: issue.priority } }),
						...(issue.description && {
							description: makeAdf(issue.description),
						}),
					},
				})),
			},
		},
	);

	if (result.issues && ctx.db.issues) {
		for (const issue of result.issues) {
			if (!issue.id || !issue.key) continue;
			const matchingInput = input.issues.find(
				(_, idx) => result.issues?.[idx]?.key === issue.key,
			);
			try {
				await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					key: issue.key,
					summary: matchingInput?.summary,
					issueType: matchingInput?.issue_type ?? 'Task',
					projectKey: matchingInput?.project_key,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save bulk issue to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.issues.bulkCreate',
		{ count: input.issues.length },
		'completed',
	);
	return result;
};

export const bulkFetch: JiraEndpoints['issuesBulkFetch'] = async (
	ctx,
	input,
) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesBulkFetch']>(
		'issue/bulkfetch',
		ctx.key,
		cloudUrl,
		{
			method: 'POST',
			body: {
				issueIdsOrKeys: input.issue_ids_or_keys,
				...(input.fields && { fields: input.fields }),
				...(input.expand && { expand: [input.expand] }),
			},
		},
	);

	if (result.issues && ctx.db.issues) {
		for (const issue of result.issues) {
			if (!issue.id || !issue.key) continue;
			try {
				await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					key: issue.key,
					summary: issue.fields?.summary,
					status: issue.fields?.status?.name,
					assigneeAccountId: issue.fields?.assignee?.accountId,
					assigneeDisplayName: issue.fields?.assignee?.displayName,
					priority: issue.fields?.priority?.name ?? undefined,
					issueType: issue.fields?.issuetype?.name,
					projectKey: issue.fields?.project?.key,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.issues.bulkFetch',
		{ count: input.issue_ids_or_keys.length },
		'completed',
	);
	return result;
};

export const addAttachment: JiraEndpoints['issuesAddAttachment'] = async (
	ctx,
	input,
) => {
	const result = await uploadJiraAttachment<
		JiraEndpointOutputs['issuesAddAttachment']
	>(input.issue_id_or_key, ctx.key, (await ctx.keys.get_cloud_url()) ?? '', {
		name: input.file_name,
		mimeType: input.mime_type,
		...(input.file_url
			? { url: input.file_url }
			: { content: input.file_content! }),
	});

	await logEventFromContext(
		ctx,
		'jira.issues.addAttachment',
		{ ...input },
		'completed',
	);
	return result;
};

export const addWatcher: JiraEndpoints['issuesAddWatcher'] = async (
	ctx,
	input,
) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/watchers`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			// unknown → Record<string, unknown>: Jira's add-watcher endpoint expects the raw accountId string as the body, but makeJiraRequest types body as Record
			body: input.account_id as unknown as Record<string, unknown>,
		},
	);

	await logEventFromContext(
		ctx,
		'jira.issues.addWatcher',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const removeWatcher: JiraEndpoints['issuesRemoveWatcher'] = async (
	ctx,
	input,
) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/watchers`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'DELETE',
			query: { accountId: input.account_id },
		},
	);

	await logEventFromContext(
		ctx,
		'jira.issues.removeWatcher',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const linkIssues: JiraEndpoints['issuesLinkIssues'] = async (
	ctx,
	input,
) => {
	await makeJiraRequest<void>(
		'issueLink',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: {
				type: { name: input.link_type },
				inwardIssue: { key: input.inward_issue_key },
				outwardIssue: { key: input.outward_issue_key },
				...(input.comment && { comment: { body: makeAdf(input.comment) } }),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'jira.issues.linkIssues',
		{ ...input },
		'completed',
	);
	return { success: true };
};
