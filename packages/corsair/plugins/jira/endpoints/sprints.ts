import { logEventFromContext } from '../../utils/events';
import type { JiraEndpoints } from '..';
import { makeJiraAgileRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const create: JiraEndpoints['sprintsCreate'] = async (ctx, input) => {
	const result = await makeJiraAgileRequest<JiraEndpointOutputs['sprintsCreate']>(
		'sprint',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: {
				originBoardId: input.origin_board_id,
				name: input.name,
				goal: input.goal,
				startDate: input.start_date,
				endDate: input.end_date,
			},
		},
	);

	if (result.id && ctx.db.sprints) {
		try {
			await ctx.db.sprints.upsertByEntityId(String(result.id), {
				id: result.id,
				name: result.name,
				state: result.state,
				goal: result.goal,
				startDate: result.startDate,
				endDate: result.endDate,
				originBoardId: result.originBoardId,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save sprint to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.sprints.create', { ...input }, 'completed');
	return result;
};

export const list: JiraEndpoints['sprintsList'] = async (ctx, input) => {
	const result = await makeJiraAgileRequest<JiraEndpointOutputs['sprintsList']>(
		`board/${input.board_id}/sprint`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'GET',
			query: {
				state: input.state,
				startAt: input.start_at,
				maxResults: input.max_results,
			},
		},
	);

	if (result.values && ctx.db.sprints) {
		for (const sprint of result.values) {
			if (!sprint.id) continue;
			try {
				await ctx.db.sprints.upsertByEntityId(String(sprint.id), {
					id: sprint.id,
					name: sprint.name,
					state: sprint.state,
					goal: sprint.goal,
					startDate: sprint.startDate,
					endDate: sprint.endDate,
					originBoardId: sprint.originBoardId,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save sprint to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'jira.sprints.list', { ...input }, 'completed');
	return result;
};

export const moveIssues: JiraEndpoints['sprintsMoveIssues'] = async (ctx, input) => {
	await makeJiraAgileRequest<void>(
		`sprint/${input.sprint_id}/issue`,
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: { issues: input.issue_keys },
		},
	);

	await logEventFromContext(ctx, 'jira.sprints.moveIssues', { ...input }, 'completed');
	return { success: true };
};

export const listBoards: JiraEndpoints['sprintsListBoards'] = async (ctx, input) => {
	const result = await makeJiraAgileRequest<JiraEndpointOutputs['sprintsListBoards']>(
		'board',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'GET',
			query: {
				projectKeyOrId: input.project_key_or_id,
				type: input.type,
				name: input.name,
				startAt: input.start_at,
				maxResults: input.max_results,
			},
		},
	);

	await logEventFromContext(ctx, 'jira.sprints.listBoards', { ...input }, 'completed');
	return result;
};
