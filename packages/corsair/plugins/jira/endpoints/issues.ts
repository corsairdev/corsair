import { logEventFromContext } from '../../utils/events';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const create: JiraEndpoints['issuesCreate'] = async (ctx, input) => {
	// Build ADF description if plain text provided
	const descriptionAdf = input.description
		? {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: input.description }],
					},
				],
			}
		: undefined;

	// any is used here because Jira issue fields are highly dynamic and not fully typed
	const fields: Record<string, unknown> = {
		project: { key: input.project_key },
		summary: input.summary,
		issuetype: { name: input.issue_type ?? 'Task' },
	};
	if (descriptionAdf) fields.description = descriptionAdf;
	if (input.assignee) fields.assignee = { accountId: input.assignee };
	if (input.priority) fields.priority = { name: input.priority };
	if (input.labels) fields.labels = input.labels;
	if (input.due_date) fields.duedate = input.due_date;
	if (input.parent) fields.parent = { key: input.parent };

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesCreate']>(
		'issue',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: { fields },
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

	await logEventFromContext(ctx, 'jira.issues.create', { ...input }, 'completed');
	return result;
};

export const get: JiraEndpoints['issuesGet'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['issuesGet']>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
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
	// any is used here because Jira issue field update structure is highly dynamic
	const fields: Record<string, unknown> = {};
	const update: Record<string, unknown> = {};

	if (input.summary !== undefined) fields.summary = input.summary;
	if (input.assignee !== undefined) fields.assignee = input.assignee ? { accountId: input.assignee } : null;
	if (input.priority !== undefined) fields.priority = { name: input.priority };
	if (input.labels !== undefined) fields.labels = input.labels;
	if (input.due_date !== undefined) fields.duedate = input.due_date;

	if (input.description !== undefined) {
		fields.description = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: input.description }],
				},
			],
		};
	}

	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'PUT',
			body: {
				fields,
				update,
				notifyUsers: input.notify_users ?? true,
			},
		},
	);

	// DB update is skipped here because we only have issue_id_or_key (may be a key, not numeric id)
	// The next issues.get call will refresh the DB with the updated data

	await logEventFromContext(ctx, 'jira.issues.edit', { ...input }, 'completed');
	return { success: true, issue_key: input.issue_id_or_key };
};

export const deleteIssue: JiraEndpoints['issuesDelete'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'DELETE',
			query: {
				deleteSubtasks: input.delete_subtasks ? 'true' : 'false',
			},
		},
	);

	await logEventFromContext(ctx, 'jira.issues.delete', { ...input }, 'completed');
	return { success: true, message: `Issue ${input.issue_id_or_key} deleted` };
};

export const search: JiraEndpoints['issuesSearch'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['issuesSearch']>(
		'search/jql',
		ctx.key,
		ctx.options.cloudUrl ?? '',
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

	await logEventFromContext(ctx, 'jira.issues.search', { ...input }, 'completed');
	return result;
};

export const assign: JiraEndpoints['issuesAssign'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/assignee`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'PUT',
			body: { accountId: input.account_id ?? null },
		},
	);

	// DB update skipped: only issue_id_or_key is available (may be a key, not numeric id)
	// The next issues.get call will refresh the DB with the updated data

	await logEventFromContext(ctx, 'jira.issues.assign', { ...input }, 'completed');
	return { success: true };
};

export const getTransitions: JiraEndpoints['issuesGetTransitions'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['issuesGetTransitions']>(
		`issue/${input.issue_id_or_key}/transitions`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'jira.issues.getTransitions', { ...input }, 'completed');
	return result;
};

export const transition: JiraEndpoints['issuesTransition'] = async (ctx, input) => {
	// any is used here because the transition body shape is dynamic and comment may be ADF or plain text
	const body: Record<string, unknown> = {
		transition: { id: input.transition_id },
	};

	if (input.comment) {
		body.update = {
			comment: [
				{
					add: {
						body: {
							version: 1,
							type: 'doc',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: input.comment }],
								},
							],
						},
					},
				},
			],
		};
	}

	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/transitions`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(ctx, 'jira.issues.transition', { ...input }, 'completed');
	return { success: true };
};

export const bulkCreate: JiraEndpoints['issuesBulkCreate'] = async (ctx, input) => {
	const issueUpdates = input.issues.map((issue) => ({
		fields: {
			project: { key: issue.project_key },
			summary: issue.summary,
			issuetype: { name: issue.issue_type ?? 'Task' },
			...(issue.assignee ? { assignee: { accountId: issue.assignee } } : {}),
			...(issue.priority ? { priority: { name: issue.priority } } : {}),
			...(issue.description
				? {
						description: {
							version: 1,
							type: 'doc',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: issue.description }],
								},
							],
						},
					}
				: {}),
		},
	}));

	const result = await makeJiraRequest<JiraEndpointOutputs['issuesBulkCreate']>(
		'issue/bulk',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: { issueUpdates },
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

	await logEventFromContext(ctx, 'jira.issues.bulkCreate', { count: input.issues.length }, 'completed');
	return result;
};

export const bulkFetch: JiraEndpoints['issuesBulkFetch'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['issuesBulkFetch']>(
		'issue/bulkfetch',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: {
				issueIdsOrKeys: input.issue_ids_or_keys,
				...(input.fields ? { fields: input.fields } : {}),
				...(input.expand ? { expand: [input.expand] } : {}),
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

	await logEventFromContext(ctx, 'jira.issues.bulkFetch', { count: input.issue_ids_or_keys.length }, 'completed');
	return result;
};

export const addAttachment: JiraEndpoints['issuesAddAttachment'] = async (ctx, input) => {
	// Jira attachment upload uses multipart/form-data; returning a structured response
	const result = await makeJiraRequest<JiraEndpointOutputs['issuesAddAttachment']>(
		`issue/${input.issue_id_or_key}/attachments`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: {
				filename: input.file_name,
				content: input.file_content,
				mimeType: input.mime_type ?? 'application/octet-stream',
			},
		},
	);

	await logEventFromContext(ctx, 'jira.issues.addAttachment', { ...input }, 'completed');
	return result;
};

export const addWatcher: JiraEndpoints['issuesAddWatcher'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/watchers`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: input.account_id as unknown as Record<string, unknown>,
		},
	);

	await logEventFromContext(ctx, 'jira.issues.addWatcher', { ...input }, 'completed');
	return { success: true };
};

export const removeWatcher: JiraEndpoints['issuesRemoveWatcher'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/watchers`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'DELETE',
			query: { accountId: input.account_id },
		},
	);

	await logEventFromContext(ctx, 'jira.issues.removeWatcher', { ...input }, 'completed');
	return { success: true };
};

export const linkIssues: JiraEndpoints['issuesLinkIssues'] = async (ctx, input) => {
	// any is used here because comment body structure varies and is optional
	const body: Record<string, unknown> = {
		type: { name: input.link_type },
		inwardIssue: { key: input.inward_issue_key },
		outwardIssue: { key: input.outward_issue_key },
	};

	if (input.comment) {
		body.comment = {
			body: {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: input.comment }],
					},
				],
			},
		};
	}

	await makeJiraRequest<void>(
		'issueLink',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(ctx, 'jira.issues.linkIssues', { ...input }, 'completed');
	return { success: true };
};
