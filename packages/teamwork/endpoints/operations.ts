import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeTeamworkRequest } from '../client';
import type { TeamworkContext } from '../index';
import { teamworkInputSchemas, teamworkOutputSchemas } from './openapi-schema';
import type {
	TeamworkEndpointInputs,
	TeamworkEndpointOutputs,
	TeamworkOperationId,
} from './operation-types';
import { TEAMWORK_OPERATION_IDS } from './operation-types';
import type { TeamworkOperationDefinition } from './types';
import { teamworkOperations } from './types';

export type TeamworkOperationEndpoint<Id extends TeamworkOperationId> =
	CorsairEndpoint<
		TeamworkContext,
		TeamworkEndpointInputs[Id],
		TeamworkEndpointOutputs[Id]
	>;

export async function resolveTeamworkSiteName(
	siteNameOverride: string | undefined,
	keys: Pick<TeamworkContext['keys'], 'get_site_name'> | undefined,
): Promise<string> {
	const siteName = siteNameOverride ?? (await keys?.get_site_name()) ?? '';
	if (!siteName) throw new Error('A Teamwork site name is required');
	return siteName;
}

function findOperation(id: TeamworkOperationId): TeamworkOperationDefinition {
	const operation = teamworkOperations.find((candidate) => candidate.id === id);
	if (!operation) throw new Error('Teamwork operation is unavailable');
	return operation;
}

// `unknown` is necessary because each OpenAPI query parameter has its own scalar or array value type.
export function serializeTeamworkQuery(
	operation: TeamworkOperationDefinition,
	query: Record<string, unknown>,
): Record<string, unknown> {
	const serialized = { ...query };
	for (const parameter of operation.parameters) {
		if (parameter.in !== 'query' || parameter.type !== 'array') continue;
		const value = serialized[parameter.name];
		if (!Array.isArray(value) || parameter.collectionFormat === 'multi')
			continue;
		const collectionFormat = parameter.collectionFormat ?? 'csv';
		const separator =
			collectionFormat === 'csv'
				? ','
				: collectionFormat === 'ssv'
					? ' '
					: collectionFormat === 'tsv'
						? '\t'
						: collectionFormat === 'pipes'
							? '|'
							: undefined;
		if (separator === undefined) {
			throw new Error('Unsupported Teamwork query collection format');
		}
		serialized[parameter.name] = value
			.map((item) => String(item))
			.join(separator);
	}
	return serialized;
}

export function createTeamworkOperationEndpoint<Id extends TeamworkOperationId>(
	id: Id,
): TeamworkOperationEndpoint<Id> {
	const operation = findOperation(id);
	return async (ctx, input) => {
		const inputSchema = teamworkInputSchemas[id];
		// Every response field is optional, so sparse `fields[...]` selections parse too.
		const outputSchema = teamworkOutputSchemas[id];
		if (!inputSchema || !outputSchema) {
			throw new Error('Teamwork operation schema is unavailable');
		}
		if (!inputSchema.safeParse(input).success) {
			throw new Error('Invalid Teamwork endpoint input');
		}

		const siteName = await resolveTeamworkSiteName(
			ctx.options.siteName,
			ctx.keys,
		);
		const response = await makeTeamworkRequest({
			apiKey: ctx.key,
			siteName,
			version: operation.version,
			method: operation.method,
			path: operation.path,
			pathParameters: input.path ?? {},
			query: serializeTeamworkQuery(operation, input.query ?? {}),
			body: input.body,
		});

		// `unknown` is necessary because provider response JSON is narrowed by the documented output schema.
		const typedOutputSchema = z.custom<TeamworkEndpointOutputs[Id]>(
			(candidate: unknown) => outputSchema.safeParse(candidate).success,
		);
		let parsedOutput: TeamworkEndpointOutputs[Id];
		try {
			parsedOutput = typedOutputSchema.parse(response);
		} catch {
			throw new Error('Teamwork response did not match its documented schema');
		}

		await logEventFromContext(
			ctx,
			'teamwork.operation',
			{ operationId: operation.id },
			'completed',
		);
		return parsedOutput;
	};
}

export const teamworkOperationsNested = {
	v1_get_projects_json: createTeamworkOperationEndpoint('v1_get_projects_json'),
	v1_post_projects_json: createTeamworkOperationEndpoint(
		'v1_post_projects_json',
	),
	v1_get_projects_id_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_json',
	),
	v1_put_projects_id_json: createTeamworkOperationEndpoint(
		'v1_put_projects_id_json',
	),
	v1_delete_projects_id_json: createTeamworkOperationEndpoint(
		'v1_delete_projects_id_json',
	),
	v1_post_projects_id_clone_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_clone_json',
	),
	v1_get_companies_id_projects_json: createTeamworkOperationEndpoint(
		'v1_get_companies_id_projects_json',
	),
	v1_get_projects_starred_json: createTeamworkOperationEndpoint(
		'v1_get_projects_starred_json',
	),
	v1_get_projects_id_rates_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_rates_json',
	),
	v1_post_projects_id_rates_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_rates_json',
	),
	v1_get_projects_id_stats_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_stats_json',
	),
	v1_put_projects_id_star_json: createTeamworkOperationEndpoint(
		'v1_put_projects_id_star_json',
	),
	v1_get_projectcategories_json: createTeamworkOperationEndpoint(
		'v1_get_projectcategories_json',
	),
	v1_post_projectcategories_json: createTeamworkOperationEndpoint(
		'v1_post_projectcategories_json',
	),
	v1_get_projectcategories_id_json: createTeamworkOperationEndpoint(
		'v1_get_projectcategories_id_json',
	),
	v1_put_projectcategories_id_json: createTeamworkOperationEndpoint(
		'v1_put_projectcategories_id_json',
	),
	v1_delete_projectcategories_id_json: createTeamworkOperationEndpoint(
		'v1_delete_projectcategories_id_json',
	),
	v1_get_projectcategories_categoryid_tasks_json:
		createTeamworkOperationEndpoint(
			'v1_get_projectcategories_categoryid_tasks_json',
		),
	v1_put_projects_projectid_json: createTeamworkOperationEndpoint(
		'v1_put_projects_projectid_json',
	),
	v1_get_milestones_json: createTeamworkOperationEndpoint(
		'v1_get_milestones_json',
	),
	v1_get_projects_id_milestones_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_milestones_json',
	),
	v1_post_projects_id_milestones_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_milestones_json',
	),
	v1_get_milestones_id_json: createTeamworkOperationEndpoint(
		'v1_get_milestones_id_json',
	),
	v1_put_milestones_id_json: createTeamworkOperationEndpoint(
		'v1_put_milestones_id_json',
	),
	v1_delete_milestones_id_json: createTeamworkOperationEndpoint(
		'v1_delete_milestones_id_json',
	),
	v1_put_milestones_id_complete_json: createTeamworkOperationEndpoint(
		'v1_put_milestones_id_complete_json',
	),
	v1_put_milestones_id_uncomplete_json: createTeamworkOperationEndpoint(
		'v1_put_milestones_id_uncomplete_json',
	),
	v1_get_tasklists_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_json',
	),
	v1_get_projects_id_tasklists_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_tasklists_json',
	),
	v1_post_projects_id_tasklists_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_tasklists_json',
	),
	v1_get_tasklists_id_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_id_json',
	),
	v1_put_tasklists_id_json: createTeamworkOperationEndpoint(
		'v1_put_tasklists_id_json',
	),
	v1_delete_tasklists_id_json: createTeamworkOperationEndpoint(
		'v1_delete_tasklists_id_json',
	),
	v1_get_tasklists_templates_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_templates_json',
	),
	v1_put_projects_id_tasklists_reorder_json: createTeamworkOperationEndpoint(
		'v1_put_projects_id_tasklists_reorder_json',
	),
	v1_put_tasklist_id_copy_json: createTeamworkOperationEndpoint(
		'v1_put_tasklist_id_copy_json',
	),
	v1_put_tasklist_id_move_json: createTeamworkOperationEndpoint(
		'v1_put_tasklist_id_move_json',
	),
	v1_get_tasks_json: createTeamworkOperationEndpoint('v1_get_tasks_json'),
	v1_get_projects_id_tasks_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_tasks_json',
	),
	v1_post_projects_id_tasks_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_tasks_json',
	),
	v1_get_tasklists_id_tasks_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_id_tasks_json',
	),
	v1_post_tasklists_id_tasks_json: createTeamworkOperationEndpoint(
		'v1_post_tasklists_id_tasks_json',
	),
	v1_get_tasks_id_json: createTeamworkOperationEndpoint('v1_get_tasks_id_json'),
	v1_post_tasks_id_json: createTeamworkOperationEndpoint(
		'v1_post_tasks_id_json',
	),
	v1_get_tasks_id_dependencies_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_dependencies_json',
	),
	v1_get_completedtasks_json: createTeamworkOperationEndpoint(
		'v1_get_completedtasks_json',
	),
	v1_get_tasks_id_predecessors_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_predecessors_json',
	),
	v1_get_tasks_parenttaskid_subtasks_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_parenttaskid_subtasks_json',
	),
	v1_get_tasks_taskid_recurring_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_taskid_recurring_json',
	),
	v1_post_tasks_id_quickadd_json: createTeamworkOperationEndpoint(
		'v1_post_tasks_id_quickadd_json',
	),
	v1_post_projects_projectid_tasks_quickadd_json:
		createTeamworkOperationEndpoint(
			'v1_post_projects_projectid_tasks_quickadd_json',
		),
	v1_put_tasks_id_complete_json: createTeamworkOperationEndpoint(
		'v1_put_tasks_id_complete_json',
	),
	v1_put_tasks_id_uncomplete_json: createTeamworkOperationEndpoint(
		'v1_put_tasks_id_uncomplete_json',
	),
	v1_put_tasklists_id_tasks_reorder_json: createTeamworkOperationEndpoint(
		'v1_put_tasklists_id_tasks_reorder_json',
	),
	v1_put_tasks_taskid_move_json: createTeamworkOperationEndpoint(
		'v1_put_tasks_taskid_move_json',
	),
	v1_put_tasks_taskid_copy_json: createTeamworkOperationEndpoint(
		'v1_put_tasks_taskid_copy_json',
	),
	v1_get_tasks_id_reminders_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_reminders_json',
	),
	v1_post_tasks_id_reminders_json: createTeamworkOperationEndpoint(
		'v1_post_tasks_id_reminders_json',
	),
	v1_put_taskreminders_id_json: createTeamworkOperationEndpoint(
		'v1_put_taskreminders_id_json',
	),
	v1_delete_taskreminders_id_json: createTeamworkOperationEndpoint(
		'v1_delete_taskreminders_id_json',
	),
	v1_get_companies_json: createTeamworkOperationEndpoint(
		'v1_get_companies_json',
	),
	v1_post_companies_json: createTeamworkOperationEndpoint(
		'v1_post_companies_json',
	),
	v1_get_projects_id_companies_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_companies_json',
	),
	v1_get_companies_id_json: createTeamworkOperationEndpoint(
		'v1_get_companies_id_json',
	),
	v1_put_companies_id_json: createTeamworkOperationEndpoint(
		'v1_put_companies_id_json',
	),
	v1_delete_companies_id_json: createTeamworkOperationEndpoint(
		'v1_delete_companies_id_json',
	),
	v1_get_people_json: createTeamworkOperationEndpoint('v1_get_people_json'),
	v1_post_people_json: createTeamworkOperationEndpoint('v1_post_people_json'),
	v1_get_calendarevents_eventid_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_calendarevents_eventid_availablepeople_json',
		),
	v1_get_projects_projectid_messages_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_messages_availablepeople_json',
		),
	v1_get_projects_projectid_milestones_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_milestones_availablepeople_json',
		),
	v1_get_projects_projectid_notebooks_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_notebooks_availablepeople_json',
		),
	v1_get_projects_projectid_tasks_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_tasks_availablepeople_json',
		),
	v1_get_projects_projectid_files_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_files_availablepeople_json',
		),
	v1_get_projects_projectid_links_availablepeople_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_links_availablepeople_json',
		),
	v1_get_projects_projectid_people_json: createTeamworkOperationEndpoint(
		'v1_get_projects_projectid_people_json',
	),
	v1_get_companies_id_people_json: createTeamworkOperationEndpoint(
		'v1_get_companies_id_people_json',
	),
	v1_get_me_json: createTeamworkOperationEndpoint('v1_get_me_json'),
	v1_get_stats_json: createTeamworkOperationEndpoint('v1_get_stats_json'),
	v1_get_people_id_json: createTeamworkOperationEndpoint(
		'v1_get_people_id_json',
	),
	v1_put_people_id_json: createTeamworkOperationEndpoint(
		'v1_put_people_id_json',
	),
	v1_delete_people_id_json: createTeamworkOperationEndpoint(
		'v1_delete_people_id_json',
	),
	v1_get_people_apikeys_json: createTeamworkOperationEndpoint(
		'v1_get_people_apikeys_json',
	),
	v1_get_people_deleted_json: createTeamworkOperationEndpoint(
		'v1_get_people_deleted_json',
	),
	v1_get_statuses_json: createTeamworkOperationEndpoint('v1_get_statuses_json'),
	v1_get_people_id_status_json: createTeamworkOperationEndpoint(
		'v1_get_people_id_status_json',
	),
	v1_post_people_id_status_json: createTeamworkOperationEndpoint(
		'v1_post_people_id_status_json',
	),
	v1_get_me_status_json: createTeamworkOperationEndpoint(
		'v1_get_me_status_json',
	),
	v1_put_me_status_id_json: createTeamworkOperationEndpoint(
		'v1_put_me_status_id_json',
	),
	v1_put_people_personid_status_statusid_json: createTeamworkOperationEndpoint(
		'v1_put_people_personid_status_statusid_json',
	),
	v1_delete_people_personid_status_statusid_json:
		createTeamworkOperationEndpoint(
			'v1_delete_people_personid_status_statusid_json',
		),
	v1_put_people_status_id_json: createTeamworkOperationEndpoint(
		'v1_put_people_status_id_json',
	),
	v1_delete_people_status_id_json: createTeamworkOperationEndpoint(
		'v1_delete_people_status_id_json',
	),
	v1_delete_me_status_id_json: createTeamworkOperationEndpoint(
		'v1_delete_me_status_id_json',
	),
	v1_get_tasks_id_files_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_files_json',
	),
	v1_post_tasks_id_files_json: createTeamworkOperationEndpoint(
		'v1_post_tasks_id_files_json',
	),
	v1_get_projects_id_files_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_files_json',
	),
	v1_post_projects_id_files_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_files_json',
	),
	v1_post_files_id_json: createTeamworkOperationEndpoint(
		'v1_post_files_id_json',
	),
	v1_delete_files_id_json: createTeamworkOperationEndpoint(
		'v1_delete_files_id_json',
	),
	v1_get_files_id_sharedlink_json: createTeamworkOperationEndpoint(
		'v1_get_files_id_sharedlink_json',
	),
	v1_put_files_id_copy_json: createTeamworkOperationEndpoint(
		'v1_put_files_id_copy_json',
	),
	v1_get_projects_id_filecategories_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_filecategories_json',
	),
	v1_post_projects_id_filecategories_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_filecategories_json',
	),
	v1_get_filecategories_id_json: createTeamworkOperationEndpoint(
		'v1_get_filecategories_id_json',
	),
	v1_put_filecategories_id_json: createTeamworkOperationEndpoint(
		'v1_put_filecategories_id_json',
	),
	v1_delete_filecategories_id_json: createTeamworkOperationEndpoint(
		'v1_delete_filecategories_id_json',
	),
	v1_get_notebooks_json: createTeamworkOperationEndpoint(
		'v1_get_notebooks_json',
	),
	v1_get_projects_id_notebooks_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_notebooks_json',
	),
	v1_post_projects_id_notebooks_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_notebooks_json',
	),
	v1_get_notebookcategories_id_notebooks_json: createTeamworkOperationEndpoint(
		'v1_get_notebookcategories_id_notebooks_json',
	),
	v1_get_notebooks_id_json: createTeamworkOperationEndpoint(
		'v1_get_notebooks_id_json',
	),
	v1_put_notebooks_id_json: createTeamworkOperationEndpoint(
		'v1_put_notebooks_id_json',
	),
	v1_delete_notebooks_id_json: createTeamworkOperationEndpoint(
		'v1_delete_notebooks_id_json',
	),
	v1_put_notebooks_id_lock_json: createTeamworkOperationEndpoint(
		'v1_put_notebooks_id_lock_json',
	),
	v1_put_notebooks_id_unlock_json: createTeamworkOperationEndpoint(
		'v1_put_notebooks_id_unlock_json',
	),
	v1_put_notebooks_id_copy_json: createTeamworkOperationEndpoint(
		'v1_put_notebooks_id_copy_json',
	),
	v1_put_notebooks_id_move_json: createTeamworkOperationEndpoint(
		'v1_put_notebooks_id_move_json',
	),
	v1_get_projects_id_notebookcategories_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_notebookcategories_json',
	),
	v1_post_projects_id_notebookcategories_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_notebookcategories_json',
	),
	v1_get_notebookcategories_id_json: createTeamworkOperationEndpoint(
		'v1_get_notebookcategories_id_json',
	),
	v1_put_notebookcategories_id_json: createTeamworkOperationEndpoint(
		'v1_put_notebookcategories_id_json',
	),
	v1_delete_notebookcategories_id_json: createTeamworkOperationEndpoint(
		'v1_delete_notebookcategories_id_json',
	),
	v1_get_projects_id_links_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_links_json',
	),
	v1_post_projects_id_links_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_links_json',
	),
	v1_get_links_json: createTeamworkOperationEndpoint('v1_get_links_json'),
	v1_get_links_id_json: createTeamworkOperationEndpoint('v1_get_links_id_json'),
	v1_put_links_id_json: createTeamworkOperationEndpoint('v1_put_links_id_json'),
	v1_delete_links_id_json: createTeamworkOperationEndpoint(
		'v1_delete_links_id_json',
	),
	v1_get_projects_id_linkcategories_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_linkcategories_json',
	),
	v1_post_projects_id_linkcategories_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_linkcategories_json',
	),
	v1_get_linkcategories_id_json: createTeamworkOperationEndpoint(
		'v1_get_linkcategories_id_json',
	),
	v1_delete_linkcategories_id_json: createTeamworkOperationEndpoint(
		'v1_delete_linkcategories_id_json',
	),
	v1_get_time_entries_json: createTeamworkOperationEndpoint(
		'v1_get_time_entries_json',
	),
	v1_get_projects_id_time_entries_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_time_entries_json',
	),
	v1_post_projects_id_time_entries_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_time_entries_json',
	),
	v1_get_tasks_id_time_entries_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_time_entries_json',
	),
	v1_post_tasks_id_time_entries_json: createTeamworkOperationEndpoint(
		'v1_post_tasks_id_time_entries_json',
	),
	v1_get_time_entries_id_json: createTeamworkOperationEndpoint(
		'v1_get_time_entries_id_json',
	),
	v1_put_time_entries_id_json: createTeamworkOperationEndpoint(
		'v1_put_time_entries_id_json',
	),
	v1_delete_time_entries_id_json: createTeamworkOperationEndpoint(
		'v1_delete_time_entries_id_json',
	),
	v1_get_projects_id_time_total_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_time_total_json',
	),
	v1_get_time_total_json: createTeamworkOperationEndpoint(
		'v1_get_time_total_json',
	),
	v1_get_projects_time_total_json: createTeamworkOperationEndpoint(
		'v1_get_projects_time_total_json',
	),
	v1_get_projects_estimatedtime_total_json: createTeamworkOperationEndpoint(
		'v1_get_projects_estimatedtime_total_json',
	),
	v1_get_tasklists_id_time_total_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_id_time_total_json',
	),
	v1_get_tasks_id_time_total_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_time_total_json',
	),
	v1_get_people_id_loggedtime_json: createTeamworkOperationEndpoint(
		'v1_get_people_id_loggedtime_json',
	),
	v1_get_timers_json: createTeamworkOperationEndpoint('v1_get_timers_json'),
	v1_get_me_timers_json: createTeamworkOperationEndpoint(
		'v1_get_me_timers_json',
	),
	v1_get_people_id_timers_json: createTeamworkOperationEndpoint(
		'v1_get_people_id_timers_json',
	),
	v1_put_tasks_id_estimatedtime_json: createTeamworkOperationEndpoint(
		'v1_put_tasks_id_estimatedtime_json',
	),
	v1_delete_comments_id_json: createTeamworkOperationEndpoint(
		'v1_delete_comments_id_json',
	),
	v1_put_comments_id_json: createTeamworkOperationEndpoint(
		'v1_put_comments_id_json',
	),
	v1_get_resource_resourceid_comments_json: createTeamworkOperationEndpoint(
		'v1_get_resource_resourceid_comments_json',
	),
	v1_post_resource_resourceid_comments_json: createTeamworkOperationEndpoint(
		'v1_post_resource_resourceid_comments_json',
	),
	v1_get_comments_json: createTeamworkOperationEndpoint('v1_get_comments_json'),
	v1_put_comments_id_markread_json: createTeamworkOperationEndpoint(
		'v1_put_comments_id_markread_json',
	),
	v1_get_projects_id_boards_columns_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_boards_columns_json',
	),
	v1_post_projects_id_boards_columns_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_boards_columns_json',
	),
	v1_get_boards_columns_id_cards_json: createTeamworkOperationEndpoint(
		'v1_get_boards_columns_id_cards_json',
	),
	v1_put_boards_columns_cards_id_move_json: createTeamworkOperationEndpoint(
		'v1_put_boards_columns_cards_id_move_json',
	),
	v1_put_boards_columns_cards_id_json: createTeamworkOperationEndpoint(
		'v1_put_boards_columns_cards_id_json',
	),
	v1_delete_boards_columns_cards_id_json: createTeamworkOperationEndpoint(
		'v1_delete_boards_columns_cards_id_json',
	),
	v1_get_boards_columns_cards_id_json: createTeamworkOperationEndpoint(
		'v1_get_boards_columns_cards_id_json',
	),
	v1_delete_boards_columns_id_json: createTeamworkOperationEndpoint(
		'v1_delete_boards_columns_id_json',
	),
	v1_put_boards_columns_id_json: createTeamworkOperationEndpoint(
		'v1_put_boards_columns_id_json',
	),
	v1_get_boards_columns_id_json: createTeamworkOperationEndpoint(
		'v1_get_boards_columns_id_json',
	),
	v1_get_portfolio_boards_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_boards_json',
	),
	v1_post_portfolio_boards_json: createTeamworkOperationEndpoint(
		'v1_post_portfolio_boards_json',
	),
	v1_put_portfolio_boards_boardid_json: createTeamworkOperationEndpoint(
		'v1_put_portfolio_boards_boardid_json',
	),
	v1_delete_portfolio_boards_boardid_json: createTeamworkOperationEndpoint(
		'v1_delete_portfolio_boards_boardid_json',
	),
	v1_get_portfolio_boards_boardid_columns_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_boards_boardid_columns_json',
	),
	v1_post_portfolio_boards_boardid_columns_json:
		createTeamworkOperationEndpoint(
			'v1_post_portfolio_boards_boardid_columns_json',
		),
	v1_get_portfolio_columns_columnid_cards_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_columns_columnid_cards_json',
	),
	v1_post_portfolio_columns_columnid_cards_json:
		createTeamworkOperationEndpoint(
			'v1_post_portfolio_columns_columnid_cards_json',
		),
	v1_get_portfolio_cards_cardid_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_cards_cardid_json',
	),
	v1_delete_portfolio_cards_cardid_json: createTeamworkOperationEndpoint(
		'v1_delete_portfolio_cards_cardid_json',
	),
	v1_put_portfolio_cards_cardid_move_json: createTeamworkOperationEndpoint(
		'v1_put_portfolio_cards_cardid_move_json',
	),
	v1_delete_portfolio_columns_columnid_json: createTeamworkOperationEndpoint(
		'v1_delete_portfolio_columns_columnid_json',
	),
	v1_get_portfolio_columns_columnid_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_columns_columnid_json',
	),
	v1_get_projects_projectid_updates_json: createTeamworkOperationEndpoint(
		'v1_get_projects_projectid_updates_json',
	),
	v1_get_projects_projectid_update_json: createTeamworkOperationEndpoint(
		'v1_get_projects_projectid_update_json',
	),
	v1_post_projects_projectid_update_json: createTeamworkOperationEndpoint(
		'v1_post_projects_projectid_update_json',
	),
	v1_put_projects_updates_updateid_json: createTeamworkOperationEndpoint(
		'v1_put_projects_updates_updateid_json',
	),
	v1_delete_projects_updates_updateid_json: createTeamworkOperationEndpoint(
		'v1_delete_projects_updates_updateid_json',
	),
	v1_put_projects_projectid_update_request_json:
		createTeamworkOperationEndpoint(
			'v1_put_projects_projectid_update_request_json',
		),
	v1_post_projects_projectid_people_personid_json:
		createTeamworkOperationEndpoint(
			'v1_post_projects_projectid_people_personid_json',
		),
	v1_put_projects_projectid_people_personid_json:
		createTeamworkOperationEndpoint(
			'v1_put_projects_projectid_people_personid_json',
		),
	v1_get_projects_projectid_people_personid_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_projectid_people_personid_json',
		),
	v1_get_projects_id_roles_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_roles_json',
	),
	v1_get_roles_id_json: createTeamworkOperationEndpoint('v1_get_roles_id_json'),
	v1_put_roles_id_json: createTeamworkOperationEndpoint('v1_put_roles_id_json'),
	v1_delete_roles_id_json: createTeamworkOperationEndpoint(
		'v1_delete_roles_id_json',
	),
	v1_get_comments_commentid_reactions_json: createTeamworkOperationEndpoint(
		'v1_get_comments_commentid_reactions_json',
	),
	v1_get_projects_updates_updateid_reactions_json:
		createTeamworkOperationEndpoint(
			'v1_get_projects_updates_updateid_reactions_json',
		),
	v1_put_comments_commentid_react_json: createTeamworkOperationEndpoint(
		'v1_put_comments_commentid_react_json',
	),
	v1_put_projects_updates_updateid_react_json: createTeamworkOperationEndpoint(
		'v1_put_projects_updates_updateid_react_json',
	),
	v1_put_resource_id_unreact_json: createTeamworkOperationEndpoint(
		'v1_put_resource_id_unreact_json',
	),
	v1_post_projects_template_json: createTeamworkOperationEndpoint(
		'v1_post_projects_template_json',
	),
	v1_get_teams_json: createTeamworkOperationEndpoint('v1_get_teams_json'),
	v1_post_teams_json: createTeamworkOperationEndpoint('v1_post_teams_json'),
	v1_delete_teams_json: createTeamworkOperationEndpoint('v1_delete_teams_json'),
	v1_get_teams_id_json: createTeamworkOperationEndpoint('v1_get_teams_id_json'),
	v1_put_teams_id_json: createTeamworkOperationEndpoint('v1_put_teams_id_json'),
	v1_delete_teams_id_json: createTeamworkOperationEndpoint(
		'v1_delete_teams_id_json',
	),
	v1_put_teams_id_people_json: createTeamworkOperationEndpoint(
		'v1_put_teams_id_people_json',
	),
	v1_get_projects_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_projects_id_teams_json',
	),
	v1_post_projects_id_teams_json: createTeamworkOperationEndpoint(
		'v1_post_projects_id_teams_json',
	),
	v1_get_companies_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_companies_id_teams_json',
	),
	v1_get_milestones_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_milestones_id_teams_json',
	),
	v1_get_notebooks_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_notebooks_id_teams_json',
	),
	v1_get_tasks_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_teams_json',
	),
	v1_get_files_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_files_id_teams_json',
	),
	v1_get_tasklists_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_id_teams_json',
	),
	v1_get_links_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_links_id_teams_json',
	),
	v1_get_portfolio_boards_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_portfolio_boards_id_teams_json',
	),
	v1_get_comments_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_comments_id_teams_json',
	),
	v1_get_teams_id_subteams_json: createTeamworkOperationEndpoint(
		'v1_get_teams_id_subteams_json',
	),
	v1_get_people_id_teams_json: createTeamworkOperationEndpoint(
		'v1_get_people_id_teams_json',
	),
	v1_get_milestones_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_milestones_id_comments_teams_json',
	),
	v1_get_notebooks_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_notebooks_id_comments_teams_json',
	),
	v1_get_tasks_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_tasks_id_comments_teams_json',
	),
	v1_get_files_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_files_id_comments_teams_json',
	),
	v1_get_tasklists_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_tasklists_id_comments_teams_json',
	),
	v1_get_links_id_comments_teams_json: createTeamworkOperationEndpoint(
		'v1_get_links_id_comments_teams_json',
	),
	v1_get_teams_users_json: createTeamworkOperationEndpoint(
		'v1_get_teams_users_json',
	),
	v2_get_projects_api_v2_projects_templates_json:
		createTeamworkOperationEndpoint(
			'v2_get_projects_api_v2_projects_templates_json',
		),
	v2_get_projects_api_v2_projects_id_predecessors_json:
		createTeamworkOperationEndpoint(
			'v2_get_projects_api_v2_projects_id_predecessors_json',
		),
	v2_get_projects_api_v2_tasklists_id_taskids_json:
		createTeamworkOperationEndpoint(
			'v2_get_projects_api_v2_tasklists_id_taskids_json',
		),
	v2_get_projects_api_v2_projects_id_taskids_json:
		createTeamworkOperationEndpoint(
			'v2_get_projects_api_v2_projects_id_taskids_json',
		),
	v2_get_projects_api_v2_projects_json: createTeamworkOperationEndpoint(
		'v2_get_projects_api_v2_projects_json',
	),
	v2_get_projects_api_v2_tasks_json: createTeamworkOperationEndpoint(
		'v2_get_projects_api_v2_tasks_json',
	),
	v2_get_projects_api_v2_tasks_taskid_json: createTeamworkOperationEndpoint(
		'v2_get_projects_api_v2_tasks_taskid_json',
	),
	v2_get_projects_api_v2_projects_projectid_json:
		createTeamworkOperationEndpoint(
			'v2_get_projects_api_v2_projects_projectid_json',
		),
	v3_get_projects_api_v3_allocations_allocationid_time_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_allocations_allocationid_time_json',
		),
	v3_get_projects_api_v3_comments_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_comments_json',
	),
	v3_post_projects_api_v3_comments_json: createTeamworkOperationEndpoint(
		'v3_post_projects_api_v3_comments_json',
	),
	v3_get_projects_api_v3_comments_id_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_comments_id_json',
	),
	v3_get_projects_api_v3_comments_id_notified_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_comments_id_notified_json',
		),
	v3_get_projects_api_v3_companies_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_companies_json',
	),
	v3_post_projects_api_v3_companies_json: createTeamworkOperationEndpoint(
		'v3_post_projects_api_v3_companies_json',
	),
	v3_delete_projects_api_v3_companies_domains_id_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_companies_domains_id_json',
		),
	v3_patch_projects_api_v3_companies_domains_id_json:
		createTeamworkOperationEndpoint(
			'v3_patch_projects_api_v3_companies_domains_id_json',
		),
	v3_get_projects_api_v3_companies_time_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_companies_time_json',
	),
	v3_delete_projects_api_v3_companies_companyid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_companies_companyid_json',
		),
	v3_get_projects_api_v3_companies_companyid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_companies_companyid_json',
		),
	v3_patch_projects_api_v3_companies_companyid_json:
		createTeamworkOperationEndpoint(
			'v3_patch_projects_api_v3_companies_companyid_json',
		),
	v3_patch_projects_api_v3_companies_companyid_rates_json:
		createTeamworkOperationEndpoint(
			'v3_patch_projects_api_v3_companies_companyid_rates_json',
		),
	v3_post_projects_api_v3_companies_id_convert_currency_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_companies_id_convert_currency_json',
		),
	v3_post_projects_api_v3_companies_id_domains_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_companies_id_domains_json',
		),
	v3_get_projects_api_v3_files_fileid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_files_fileid_project_json',
		),
	v3_get_projects_api_v3_links_linkid_comments_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_links_linkid_comments_json',
		),
	v3_post_projects_api_v3_links_linkid_comments_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_links_linkid_comments_json',
		),
	v3_get_projects_api_v3_links_linkid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_links_linkid_project_json',
		),
	v3_get_projects_api_v3_me_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_me_json',
	),
	v3_get_projects_api_v3_me_personaltasks_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_me_personaltasks_json',
	),
	v3_post_projects_api_v3_me_personaltasks_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_me_personaltasks_json',
		),
	v3_get_projects_api_v3_me_personaltasks_id_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_me_personaltasks_id_json',
		),
	v3_get_projects_api_v3_me_timers_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_me_timers_json',
	),
	v3_post_projects_api_v3_me_timers_json: createTeamworkOperationEndpoint(
		'v3_post_projects_api_v3_me_timers_json',
	),
	v3_delete_projects_api_v3_me_timers_timerid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_me_timers_timerid_json',
		),
	v3_put_projects_api_v3_me_timers_timerid_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_me_timers_timerid_json',
		),
	v3_put_projects_api_v3_me_timers_timerid_complete_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_me_timers_timerid_complete_json',
		),
	v3_put_projects_api_v3_me_timers_timerid_pause_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_me_timers_timerid_pause_json',
		),
	v3_put_projects_api_v3_me_timers_timerid_resume_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_me_timers_timerid_resume_json',
		),
	v3_put_projects_api_v3_me_timers_timerid_undelete_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_me_timers_timerid_undelete_json',
		),
	v3_get_projects_api_v3_milestones_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_milestones_json',
	),
	v3_get_projects_api_v3_milestones_metrics_deadlines_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_milestones_metrics_deadlines_json',
		),
	v3_get_projects_api_v3_milestones_milestoneid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_milestones_milestoneid_json',
		),
	v3_get_projects_api_v3_milestones_milestoneid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_milestones_milestoneid_project_json',
		),
	v3_get_projects_api_v3_notebooks_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_notebooks_json',
	),
	v3_delete_projects_api_v3_notebooks_notebookid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_notebooks_notebookid_json',
		),
	v3_get_projects_api_v3_notebooks_notebookid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_notebooks_notebookid_json',
		),
	v3_patch_projects_api_v3_notebooks_notebookid_json:
		createTeamworkOperationEndpoint(
			'v3_patch_projects_api_v3_notebooks_notebookid_json',
		),
	v3_get_projects_api_v3_notebooks_notebookid_compare_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_notebooks_notebookid_compare_json',
		),
	v3_get_projects_api_v3_notebooks_notebookid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_notebooks_notebookid_project_json',
		),
	v3_delete_projects_api_v3_notebooks_notebookid_versions_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_notebooks_notebookid_versions_json',
		),
	v3_get_projects_api_v3_notebooks_notebookid_versions_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_notebooks_notebookid_versions_json',
		),
	v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json',
		),
	v3_get_projects_api_v3_people_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_people_json',
	),
	v3_get_projects_api_v3_people_metrics_performance_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_people_metrics_performance_json',
		),
	v3_get_projects_api_v3_people_utilization_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_people_utilization_json',
		),
	v3_delete_projects_api_v3_people_personid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_people_personid_json',
		),
	v3_get_projects_api_v3_people_personid_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_people_personid_json',
	),
	v3_get_projects_api_v3_projects_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_projects_json',
	),
	v3_get_projects_api_v3_projects_metrics_active_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_active_json',
		),
	v3_get_projects_api_v3_projects_metrics_billable_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_billable_json',
		),
	v3_get_projects_api_v3_projects_metrics_healths_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_healths_json',
		),
	v3_get_projects_api_v3_projects_metrics_invoices_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_invoices_json',
		),
	v3_get_projects_api_v3_projects_metrics_owners_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_owners_json',
		),
	v3_get_projects_api_v3_projects_metrics_unbilled_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_metrics_unbilled_json',
		),
	v3_get_projects_api_v3_projects_number_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_projects_number_json',
	),
	v3_put_projects_api_v3_projects_number_json: createTeamworkOperationEndpoint(
		'v3_put_projects_api_v3_projects_number_json',
	),
	v3_put_projects_api_v3_projects_people_userid_enqueue_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_projects_people_userid_enqueue_json',
		),
	v3_get_projects_api_v3_projects_starred_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_projects_starred_json',
	),
	v3_get_projects_api_v3_projects_teamwork_samples_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_teamwork_samples_json',
		),
	v3_get_projects_api_v3_projects_templates_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_templates_json',
		),
	v3_get_projects_api_v3_projects_templates_id_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_templates_id_json',
		),
	v3_get_projects_api_v3_projects_templates_id_customfields_required_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_templates_id_customfields_required_json',
		),
	v3_put_projects_api_v3_projects_tentative_projectid_convert_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_projects_tentative_projectid_convert_json',
		),
	v3_get_projects_api_v3_projects_updates_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_projects_updates_json',
	),
	v3_get_projects_api_v3_projects_projectids_updates_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectids_updates_json',
		),
	v3_get_projects_api_v3_projects_projectid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_json',
		),
	v3_get_projects_api_v3_projects_projectid_featureorder_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_featureorder_json',
		),
	v3_put_projects_api_v3_projects_projectid_featureorder_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_projects_projectid_featureorder_json',
		),
	v3_get_projects_api_v3_projects_projectid_milestones_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_milestones_json',
		),
	v3_post_projects_api_v3_projects_projectid_notebooks_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_projects_projectid_notebooks_json',
		),
	v3_get_projects_api_v3_projects_projectid_people_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_people_json',
		),
	v3_put_projects_api_v3_projects_projectid_people_json:
		createTeamworkOperationEndpoint(
			'v3_put_projects_api_v3_projects_projectid_people_json',
		),
	v3_get_projects_api_v3_projects_projectid_people_personid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_people_personid_json',
		),
	v3_get_projects_api_v3_projects_projectid_tasklists_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_tasklists_json',
		),
	v3_get_projects_api_v3_projects_projectid_tasks_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_tasks_json',
		),
	v3_get_projects_api_v3_projects_projectid_time_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_time_json',
		),
	v3_post_projects_api_v3_projects_projectid_time_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_projects_projectid_time_json',
		),
	v3_get_projects_api_v3_projects_projectid_time_total_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_projects_projectid_time_total_json',
		),
	v3_get_projects_api_v3_reporting_dashboards_data_milestones_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_reporting_dashboards_data_milestones_json',
		),
	v3_get_projects_api_v3_reporting_dashboards_details_milestones_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_reporting_dashboards_details_milestones_json',
		),
	v3_get_projects_api_v3_reporting_precanned_companytime_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_reporting_precanned_companytime_json',
		),
	v3_get_projects_api_v3_reporting_precanned_tasktime_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_reporting_precanned_tasktime_json',
		),
	v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json',
		),
	v3_get_projects_api_v3_statuses_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_statuses_json',
	),
	v3_get_projects_api_v3_statuses_timeline_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_statuses_timeline_json',
		),
	v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json',
		),
	v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json',
		),
	v3_get_projects_api_v3_tasklists_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_tasklists_json',
	),
	v3_get_projects_api_v3_tasklists_templates_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasklists_templates_json',
		),
	v3_delete_projects_api_v3_tasklists_tasklistid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_tasklists_tasklistid_json',
		),
	v3_get_projects_api_v3_tasklists_tasklistid_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasklists_tasklistid_json',
		),
	v3_get_projects_api_v3_tasklists_tasklistid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasklists_tasklistid_project_json',
		),
	v3_get_projects_api_v3_tasklists_tasklistid_tasks_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasklists_tasklistid_tasks_json',
		),
	v3_post_projects_api_v3_tasklists_tasklistid_tasks_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_tasklists_tasklistid_tasks_json',
		),
	v3_get_projects_api_v3_tasklists_tasklistid_time_total_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasklists_tasklistid_time_total_json',
		),
	v3_get_projects_api_v3_tasks_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_tasks_json',
	),
	v3_get_projects_api_v3_tasks_metrics_complete_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_metrics_complete_json',
		),
	v3_get_projects_api_v3_tasks_metrics_late_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_metrics_late_json',
		),
	v3_get_projects_api_v3_tasks_id_reminders_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_id_reminders_json',
		),
	v3_delete_projects_api_v3_tasks_taskid_json: createTeamworkOperationEndpoint(
		'v3_delete_projects_api_v3_tasks_taskid_json',
	),
	v3_get_projects_api_v3_tasks_taskid_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_tasks_taskid_json',
	),
	v3_patch_projects_api_v3_tasks_taskid_json: createTeamworkOperationEndpoint(
		'v3_patch_projects_api_v3_tasks_taskid_json',
	),
	v3_put_projects_api_v3_tasks_taskid_json: createTeamworkOperationEndpoint(
		'v3_put_projects_api_v3_tasks_taskid_json',
	),
	v3_get_projects_api_v3_tasks_taskid_project_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_taskid_project_json',
		),
	v3_post_projects_api_v3_tasks_taskid_reminders_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_tasks_taskid_reminders_json',
		),
	v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json',
		),
	v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json:
		createTeamworkOperationEndpoint(
			'v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json',
		),
	v3_get_projects_api_v3_tasks_taskid_subtasks_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_taskid_subtasks_json',
		),
	v3_post_projects_api_v3_tasks_taskid_subtasks_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_tasks_taskid_subtasks_json',
		),
	v3_get_projects_api_v3_tasks_taskid_time_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_taskid_time_json',
		),
	v3_post_projects_api_v3_tasks_taskid_time_json:
		createTeamworkOperationEndpoint(
			'v3_post_projects_api_v3_tasks_taskid_time_json',
		),
	v3_get_projects_api_v3_tasks_taskid_time_total_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_tasks_taskid_time_total_json',
		),
	v3_get_projects_api_v3_time_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_json',
	),
	v3_get_projects_api_v3_time_report_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_report_json',
	),
	v3_get_projects_api_v3_time_report_totals_json:
		createTeamworkOperationEndpoint(
			'v3_get_projects_api_v3_time_report_totals_json',
		),
	v3_get_projects_api_v3_time_report_type_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_report_type_json',
	),
	v3_get_projects_api_v3_time_total_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_total_json',
	),
	v3_get_projects_api_v3_time_validate_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_validate_json',
	),
	v3_delete_projects_api_v3_time_timelogid_json:
		createTeamworkOperationEndpoint(
			'v3_delete_projects_api_v3_time_timelogid_json',
		),
	v3_get_projects_api_v3_time_timelogid_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_time_timelogid_json',
	),
	v3_patch_projects_api_v3_time_timelogid_json: createTeamworkOperationEndpoint(
		'v3_patch_projects_api_v3_time_timelogid_json',
	),
	v3_put_projects_api_v3_time_timelogid_json: createTeamworkOperationEndpoint(
		'v3_put_projects_api_v3_time_timelogid_json',
	),
	v3_get_projects_api_v3_timers_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_timers_json',
	),
	v3_get_projects_api_v3_timers_timerid_json: createTeamworkOperationEndpoint(
		'v3_get_projects_api_v3_timers_timerid_json',
	),
} satisfies {
	[Id in TeamworkOperationId]: TeamworkOperationEndpoint<Id>;
};

// `unknown` is necessary for the test-only manifest lookup: a runtime string key cannot retain a literal endpoint ID. Consumers use the nested registry, which keeps exact per-operation inputs and outputs.
export const teamworkOperationsById: Record<
	string,
	CorsairEndpoint<TeamworkContext, Record<string, unknown>, unknown>
> = Object.fromEntries(
	TEAMWORK_OPERATION_IDS.map((id) => [id, teamworkOperationsNested[id]]),
);
