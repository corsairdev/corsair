import { logEventFromContext } from 'corsair/core';
import type { JiraEndpoints } from '..';
import { makeJiraAgileRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const create: JiraEndpoints['sprintsCreate'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraAgileRequest<
		JiraEndpointOutputs['sprintsCreate']
	>('sprint', ctx.key, cloudUrl, {
		method: 'POST',
		body: {
			originBoardId: input.origin_board_id,
			name: input.name,
			...(input.goal && { goal: input.goal }),
			...(input.start_date && { startDate: input.start_date }),
			...(input.end_date && { endDate: input.end_date }),
		},
	});

	if (result.id && ctx.db.sprints) {
		try {
			await ctx.db.sprints.upsertByEntityId(String(result.id), {
				id: result.id,
				...(result.name && { name: result.name }),
				...(result.state && { state: result.state }),
				...(result.goal && { goal: result.goal }),
				...(result.startDate && { startDate: result.startDate }),
				...(result.endDate && { endDate: result.endDate }),
				...(result.originBoardId && { originBoardId: result.originBoardId }),
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save sprint to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'jira.sprints.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: JiraEndpoints['sprintsList'] = async (ctx, input) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraAgileRequest<JiraEndpointOutputs['sprintsList']>(
		`board/${input.board_id}/sprint`,
		ctx.key,
		cloudUrl,
		{
			method: 'GET',
			query: {
				...(input.state && { state: input.state }),
				...(input.start_at !== undefined && { startAt: input.start_at }),
				...(input.max_results !== undefined && {
					maxResults: input.max_results,
				}),
			},
		},
	);

	if (result.values && ctx.db.sprints) {
		for (const sprint of result.values) {
			if (!sprint.id) continue;
			try {
				await ctx.db.sprints.upsertByEntityId(String(sprint.id), {
					id: sprint.id,
					...(sprint.name && { name: sprint.name }),
					...(sprint.state && { state: sprint.state }),
					...(sprint.goal && { goal: sprint.goal }),
					...(sprint.startDate && { startDate: sprint.startDate }),
					...(sprint.endDate && { endDate: sprint.endDate }),
					...(sprint.originBoardId && { originBoardId: sprint.originBoardId }),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save sprint to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.sprints.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const moveIssues: JiraEndpoints['sprintsMoveIssues'] = async (
	ctx,
	input,
) => {
	await makeJiraAgileRequest<void>(
		`sprint/${input.sprint_id}/issue`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: { issues: input.issue_keys },
		},
	);

	await logEventFromContext(
		ctx,
		'jira.sprints.moveIssues',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const listBoards: JiraEndpoints['sprintsListBoards'] = async (
	ctx,
	input,
) => {
	const cloudUrl = (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeJiraAgileRequest<
		JiraEndpointOutputs['sprintsListBoards']
	>('board', ctx.key, cloudUrl, {
		method: 'GET',
		query: {
			...(input.project_key_or_id && {
				projectKeyOrId: input.project_key_or_id,
			}),
			...(input.type && { type: input.type }),
			...(input.name && { name: input.name }),
			...(input.start_at !== undefined && { startAt: input.start_at }),
			...(input.max_results !== undefined && { maxResults: input.max_results }),
		},
	});

	if (result.values && ctx.db.boards) {
		for (const board of result.values) {
			if (!board.id) continue;
			try {
				await ctx.db.boards.upsertByEntityId(String(board.id), {
					id: board.id,
					...(board.name && { name: board.name }),
					...(board.type && { type: board.type }),
					...(board.location?.projectId && {
						projectId: board.location.projectId,
					}),
					...(board.location?.projectKey && {
						projectKey: board.location.projectKey,
					}),
					...(board.location?.projectName && {
						projectName: board.location.projectName,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save board to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.sprints.listBoards',
		{ ...input },
		'completed',
	);
	return result;
};
