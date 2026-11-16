import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	teamworkInputSchemas,
	teamworkOutputSchemas,
} from './endpoints/openapi-schema';
import type {
	TeamworkEndpointInputs,
	TeamworkEndpointOutputs,
	TeamworkOperationId,
} from './endpoints/operation-types';
import { teamworkOperationsNested } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import { TeamworkSchema } from './schema';

const teamworkEndpointsNested = teamworkOperationsNested;

export type TeamworkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Global override for single-site setups; otherwise each tenant uses tenant_external_id. */
	siteName?: string;
	hooks?: InternalTeamworkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teamworkEndpointsNested>;
};

export const teamworkAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

type TeamworkAuthContext = CorsairPluginContext<
	typeof TeamworkSchema,
	TeamworkPluginOptions,
	undefined,
	typeof teamworkAuthConfig
>;
export type TeamworkContext = CorsairPluginContext<
	typeof TeamworkSchema,
	TeamworkPluginOptions
> &
	Pick<TeamworkAuthContext, 'keys'>;

export type TeamworkKeyBuilderContext = KeyBuilderContext<
	TeamworkPluginOptions,
	typeof teamworkAuthConfig
>;

export type TeamworkBoundEndpoints = BindEndpoints<
	typeof teamworkEndpointsNested
>;
export type TeamworkEndpoints = {
	[Id in TeamworkOperationId]: CorsairEndpoint<
		TeamworkContext,
		TeamworkEndpointInputs[Id],
		TeamworkEndpointOutputs[Id]
	>;
};

export const teamworkEndpointSchemas = {
	v1_get_projects_json: {
		input: teamworkInputSchemas['v1_get_projects_json'],
		output: teamworkOutputSchemas['v1_get_projects_json'],
	},
	v1_post_projects_json: {
		input: teamworkInputSchemas['v1_post_projects_json'],
		output: teamworkOutputSchemas['v1_post_projects_json'],
	},
	v1_get_projects_id_json: {
		input: teamworkInputSchemas['v1_get_projects_id_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_json'],
	},
	v1_put_projects_id_json: {
		input: teamworkInputSchemas['v1_put_projects_id_json'],
		output: teamworkOutputSchemas['v1_put_projects_id_json'],
	},
	v1_delete_projects_id_json: {
		input: teamworkInputSchemas['v1_delete_projects_id_json'],
		output: teamworkOutputSchemas['v1_delete_projects_id_json'],
	},
	v1_post_projects_id_clone_json: {
		input: teamworkInputSchemas['v1_post_projects_id_clone_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_clone_json'],
	},
	v1_get_companies_id_projects_json: {
		input: teamworkInputSchemas['v1_get_companies_id_projects_json'],
		output: teamworkOutputSchemas['v1_get_companies_id_projects_json'],
	},
	v1_get_projects_starred_json: {
		input: teamworkInputSchemas['v1_get_projects_starred_json'],
		output: teamworkOutputSchemas['v1_get_projects_starred_json'],
	},
	v1_get_projects_id_rates_json: {
		input: teamworkInputSchemas['v1_get_projects_id_rates_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_rates_json'],
	},
	v1_post_projects_id_rates_json: {
		input: teamworkInputSchemas['v1_post_projects_id_rates_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_rates_json'],
	},
	v1_get_projects_id_stats_json: {
		input: teamworkInputSchemas['v1_get_projects_id_stats_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_stats_json'],
	},
	v1_put_projects_id_star_json: {
		input: teamworkInputSchemas['v1_put_projects_id_star_json'],
		output: teamworkOutputSchemas['v1_put_projects_id_star_json'],
	},
	v1_get_projectcategories_json: {
		input: teamworkInputSchemas['v1_get_projectcategories_json'],
		output: teamworkOutputSchemas['v1_get_projectcategories_json'],
	},
	v1_post_projectcategories_json: {
		input: teamworkInputSchemas['v1_post_projectcategories_json'],
		output: teamworkOutputSchemas['v1_post_projectcategories_json'],
	},
	v1_get_projectcategories_id_json: {
		input: teamworkInputSchemas['v1_get_projectcategories_id_json'],
		output: teamworkOutputSchemas['v1_get_projectcategories_id_json'],
	},
	v1_put_projectcategories_id_json: {
		input: teamworkInputSchemas['v1_put_projectcategories_id_json'],
		output: teamworkOutputSchemas['v1_put_projectcategories_id_json'],
	},
	v1_delete_projectcategories_id_json: {
		input: teamworkInputSchemas['v1_delete_projectcategories_id_json'],
		output: teamworkOutputSchemas['v1_delete_projectcategories_id_json'],
	},
	v1_get_projectcategories_categoryid_tasks_json: {
		input:
			teamworkInputSchemas['v1_get_projectcategories_categoryid_tasks_json'],
		output:
			teamworkOutputSchemas['v1_get_projectcategories_categoryid_tasks_json'],
	},
	v1_put_projects_projectid_json: {
		input: teamworkInputSchemas['v1_put_projects_projectid_json'],
		output: teamworkOutputSchemas['v1_put_projects_projectid_json'],
	},
	v1_get_milestones_json: {
		input: teamworkInputSchemas['v1_get_milestones_json'],
		output: teamworkOutputSchemas['v1_get_milestones_json'],
	},
	v1_get_projects_id_milestones_json: {
		input: teamworkInputSchemas['v1_get_projects_id_milestones_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_milestones_json'],
	},
	v1_post_projects_id_milestones_json: {
		input: teamworkInputSchemas['v1_post_projects_id_milestones_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_milestones_json'],
	},
	v1_get_milestones_id_json: {
		input: teamworkInputSchemas['v1_get_milestones_id_json'],
		output: teamworkOutputSchemas['v1_get_milestones_id_json'],
	},
	v1_put_milestones_id_json: {
		input: teamworkInputSchemas['v1_put_milestones_id_json'],
		output: teamworkOutputSchemas['v1_put_milestones_id_json'],
	},
	v1_delete_milestones_id_json: {
		input: teamworkInputSchemas['v1_delete_milestones_id_json'],
		output: teamworkOutputSchemas['v1_delete_milestones_id_json'],
	},
	v1_put_milestones_id_complete_json: {
		input: teamworkInputSchemas['v1_put_milestones_id_complete_json'],
		output: teamworkOutputSchemas['v1_put_milestones_id_complete_json'],
	},
	v1_put_milestones_id_uncomplete_json: {
		input: teamworkInputSchemas['v1_put_milestones_id_uncomplete_json'],
		output: teamworkOutputSchemas['v1_put_milestones_id_uncomplete_json'],
	},
	v1_get_tasklists_json: {
		input: teamworkInputSchemas['v1_get_tasklists_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_json'],
	},
	v1_get_projects_id_tasklists_json: {
		input: teamworkInputSchemas['v1_get_projects_id_tasklists_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_tasklists_json'],
	},
	v1_post_projects_id_tasklists_json: {
		input: teamworkInputSchemas['v1_post_projects_id_tasklists_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_tasklists_json'],
	},
	v1_get_tasklists_id_json: {
		input: teamworkInputSchemas['v1_get_tasklists_id_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_id_json'],
	},
	v1_put_tasklists_id_json: {
		input: teamworkInputSchemas['v1_put_tasklists_id_json'],
		output: teamworkOutputSchemas['v1_put_tasklists_id_json'],
	},
	v1_delete_tasklists_id_json: {
		input: teamworkInputSchemas['v1_delete_tasklists_id_json'],
		output: teamworkOutputSchemas['v1_delete_tasklists_id_json'],
	},
	v1_get_tasklists_templates_json: {
		input: teamworkInputSchemas['v1_get_tasklists_templates_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_templates_json'],
	},
	v1_put_projects_id_tasklists_reorder_json: {
		input: teamworkInputSchemas['v1_put_projects_id_tasklists_reorder_json'],
		output: teamworkOutputSchemas['v1_put_projects_id_tasklists_reorder_json'],
	},
	v1_put_tasklist_id_copy_json: {
		input: teamworkInputSchemas['v1_put_tasklist_id_copy_json'],
		output: teamworkOutputSchemas['v1_put_tasklist_id_copy_json'],
	},
	v1_put_tasklist_id_move_json: {
		input: teamworkInputSchemas['v1_put_tasklist_id_move_json'],
		output: teamworkOutputSchemas['v1_put_tasklist_id_move_json'],
	},
	v1_get_tasks_json: {
		input: teamworkInputSchemas['v1_get_tasks_json'],
		output: teamworkOutputSchemas['v1_get_tasks_json'],
	},
	v1_get_projects_id_tasks_json: {
		input: teamworkInputSchemas['v1_get_projects_id_tasks_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_tasks_json'],
	},
	v1_post_projects_id_tasks_json: {
		input: teamworkInputSchemas['v1_post_projects_id_tasks_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_tasks_json'],
	},
	v1_get_tasklists_id_tasks_json: {
		input: teamworkInputSchemas['v1_get_tasklists_id_tasks_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_id_tasks_json'],
	},
	v1_post_tasklists_id_tasks_json: {
		input: teamworkInputSchemas['v1_post_tasklists_id_tasks_json'],
		output: teamworkOutputSchemas['v1_post_tasklists_id_tasks_json'],
	},
	v1_get_tasks_id_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_json'],
	},
	v1_post_tasks_id_json: {
		input: teamworkInputSchemas['v1_post_tasks_id_json'],
		output: teamworkOutputSchemas['v1_post_tasks_id_json'],
	},
	v1_get_tasks_id_dependencies_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_dependencies_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_dependencies_json'],
	},
	v1_get_completedtasks_json: {
		input: teamworkInputSchemas['v1_get_completedtasks_json'],
		output: teamworkOutputSchemas['v1_get_completedtasks_json'],
	},
	v1_get_tasks_id_predecessors_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_predecessors_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_predecessors_json'],
	},
	v1_get_tasks_parenttaskid_subtasks_json: {
		input: teamworkInputSchemas['v1_get_tasks_parenttaskid_subtasks_json'],
		output: teamworkOutputSchemas['v1_get_tasks_parenttaskid_subtasks_json'],
	},
	v1_get_tasks_taskid_recurring_json: {
		input: teamworkInputSchemas['v1_get_tasks_taskid_recurring_json'],
		output: teamworkOutputSchemas['v1_get_tasks_taskid_recurring_json'],
	},
	v1_post_tasks_id_quickadd_json: {
		input: teamworkInputSchemas['v1_post_tasks_id_quickadd_json'],
		output: teamworkOutputSchemas['v1_post_tasks_id_quickadd_json'],
	},
	v1_post_projects_projectid_tasks_quickadd_json: {
		input:
			teamworkInputSchemas['v1_post_projects_projectid_tasks_quickadd_json'],
		output:
			teamworkOutputSchemas['v1_post_projects_projectid_tasks_quickadd_json'],
	},
	v1_put_tasks_id_complete_json: {
		input: teamworkInputSchemas['v1_put_tasks_id_complete_json'],
		output: teamworkOutputSchemas['v1_put_tasks_id_complete_json'],
	},
	v1_put_tasks_id_uncomplete_json: {
		input: teamworkInputSchemas['v1_put_tasks_id_uncomplete_json'],
		output: teamworkOutputSchemas['v1_put_tasks_id_uncomplete_json'],
	},
	v1_put_tasklists_id_tasks_reorder_json: {
		input: teamworkInputSchemas['v1_put_tasklists_id_tasks_reorder_json'],
		output: teamworkOutputSchemas['v1_put_tasklists_id_tasks_reorder_json'],
	},
	v1_put_tasks_taskid_move_json: {
		input: teamworkInputSchemas['v1_put_tasks_taskid_move_json'],
		output: teamworkOutputSchemas['v1_put_tasks_taskid_move_json'],
	},
	v1_put_tasks_taskid_copy_json: {
		input: teamworkInputSchemas['v1_put_tasks_taskid_copy_json'],
		output: teamworkOutputSchemas['v1_put_tasks_taskid_copy_json'],
	},
	v1_get_tasks_id_reminders_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_reminders_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_reminders_json'],
	},
	v1_post_tasks_id_reminders_json: {
		input: teamworkInputSchemas['v1_post_tasks_id_reminders_json'],
		output: teamworkOutputSchemas['v1_post_tasks_id_reminders_json'],
	},
	v1_put_taskreminders_id_json: {
		input: teamworkInputSchemas['v1_put_taskreminders_id_json'],
		output: teamworkOutputSchemas['v1_put_taskreminders_id_json'],
	},
	v1_delete_taskreminders_id_json: {
		input: teamworkInputSchemas['v1_delete_taskreminders_id_json'],
		output: teamworkOutputSchemas['v1_delete_taskreminders_id_json'],
	},
	v1_get_companies_json: {
		input: teamworkInputSchemas['v1_get_companies_json'],
		output: teamworkOutputSchemas['v1_get_companies_json'],
	},
	v1_post_companies_json: {
		input: teamworkInputSchemas['v1_post_companies_json'],
		output: teamworkOutputSchemas['v1_post_companies_json'],
	},
	v1_get_projects_id_companies_json: {
		input: teamworkInputSchemas['v1_get_projects_id_companies_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_companies_json'],
	},
	v1_get_companies_id_json: {
		input: teamworkInputSchemas['v1_get_companies_id_json'],
		output: teamworkOutputSchemas['v1_get_companies_id_json'],
	},
	v1_put_companies_id_json: {
		input: teamworkInputSchemas['v1_put_companies_id_json'],
		output: teamworkOutputSchemas['v1_put_companies_id_json'],
	},
	v1_delete_companies_id_json: {
		input: teamworkInputSchemas['v1_delete_companies_id_json'],
		output: teamworkOutputSchemas['v1_delete_companies_id_json'],
	},
	v1_get_people_json: {
		input: teamworkInputSchemas['v1_get_people_json'],
		output: teamworkOutputSchemas['v1_get_people_json'],
	},
	v1_post_people_json: {
		input: teamworkInputSchemas['v1_post_people_json'],
		output: teamworkOutputSchemas['v1_post_people_json'],
	},
	v1_get_calendarevents_eventid_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_calendarevents_eventid_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_calendarevents_eventid_availablepeople_json'
			],
	},
	v1_get_projects_projectid_messages_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_messages_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_messages_availablepeople_json'
			],
	},
	v1_get_projects_projectid_milestones_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_milestones_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_milestones_availablepeople_json'
			],
	},
	v1_get_projects_projectid_notebooks_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_notebooks_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_notebooks_availablepeople_json'
			],
	},
	v1_get_projects_projectid_tasks_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_tasks_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_tasks_availablepeople_json'
			],
	},
	v1_get_projects_projectid_files_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_files_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_files_availablepeople_json'
			],
	},
	v1_get_projects_projectid_links_availablepeople_json: {
		input:
			teamworkInputSchemas[
				'v1_get_projects_projectid_links_availablepeople_json'
			],
		output:
			teamworkOutputSchemas[
				'v1_get_projects_projectid_links_availablepeople_json'
			],
	},
	v1_get_projects_projectid_people_json: {
		input: teamworkInputSchemas['v1_get_projects_projectid_people_json'],
		output: teamworkOutputSchemas['v1_get_projects_projectid_people_json'],
	},
	v1_get_companies_id_people_json: {
		input: teamworkInputSchemas['v1_get_companies_id_people_json'],
		output: teamworkOutputSchemas['v1_get_companies_id_people_json'],
	},
	v1_get_me_json: {
		input: teamworkInputSchemas['v1_get_me_json'],
		output: teamworkOutputSchemas['v1_get_me_json'],
	},
	v1_get_stats_json: {
		input: teamworkInputSchemas['v1_get_stats_json'],
		output: teamworkOutputSchemas['v1_get_stats_json'],
	},
	v1_get_people_id_json: {
		input: teamworkInputSchemas['v1_get_people_id_json'],
		output: teamworkOutputSchemas['v1_get_people_id_json'],
	},
	v1_put_people_id_json: {
		input: teamworkInputSchemas['v1_put_people_id_json'],
		output: teamworkOutputSchemas['v1_put_people_id_json'],
	},
	v1_delete_people_id_json: {
		input: teamworkInputSchemas['v1_delete_people_id_json'],
		output: teamworkOutputSchemas['v1_delete_people_id_json'],
	},
	v1_get_people_apikeys_json: {
		input: teamworkInputSchemas['v1_get_people_apikeys_json'],
		output: teamworkOutputSchemas['v1_get_people_apikeys_json'],
	},
	v1_get_people_deleted_json: {
		input: teamworkInputSchemas['v1_get_people_deleted_json'],
		output: teamworkOutputSchemas['v1_get_people_deleted_json'],
	},
	v1_get_statuses_json: {
		input: teamworkInputSchemas['v1_get_statuses_json'],
		output: teamworkOutputSchemas['v1_get_statuses_json'],
	},
	v1_get_people_id_status_json: {
		input: teamworkInputSchemas['v1_get_people_id_status_json'],
		output: teamworkOutputSchemas['v1_get_people_id_status_json'],
	},
	v1_post_people_id_status_json: {
		input: teamworkInputSchemas['v1_post_people_id_status_json'],
		output: teamworkOutputSchemas['v1_post_people_id_status_json'],
	},
	v1_get_me_status_json: {
		input: teamworkInputSchemas['v1_get_me_status_json'],
		output: teamworkOutputSchemas['v1_get_me_status_json'],
	},
	v1_put_me_status_id_json: {
		input: teamworkInputSchemas['v1_put_me_status_id_json'],
		output: teamworkOutputSchemas['v1_put_me_status_id_json'],
	},
	v1_put_people_personid_status_statusid_json: {
		input: teamworkInputSchemas['v1_put_people_personid_status_statusid_json'],
		output:
			teamworkOutputSchemas['v1_put_people_personid_status_statusid_json'],
	},
	v1_delete_people_personid_status_statusid_json: {
		input:
			teamworkInputSchemas['v1_delete_people_personid_status_statusid_json'],
		output:
			teamworkOutputSchemas['v1_delete_people_personid_status_statusid_json'],
	},
	v1_put_people_status_id_json: {
		input: teamworkInputSchemas['v1_put_people_status_id_json'],
		output: teamworkOutputSchemas['v1_put_people_status_id_json'],
	},
	v1_delete_people_status_id_json: {
		input: teamworkInputSchemas['v1_delete_people_status_id_json'],
		output: teamworkOutputSchemas['v1_delete_people_status_id_json'],
	},
	v1_delete_me_status_id_json: {
		input: teamworkInputSchemas['v1_delete_me_status_id_json'],
		output: teamworkOutputSchemas['v1_delete_me_status_id_json'],
	},
	v1_get_tasks_id_files_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_files_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_files_json'],
	},
	v1_post_tasks_id_files_json: {
		input: teamworkInputSchemas['v1_post_tasks_id_files_json'],
		output: teamworkOutputSchemas['v1_post_tasks_id_files_json'],
	},
	v1_get_projects_id_files_json: {
		input: teamworkInputSchemas['v1_get_projects_id_files_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_files_json'],
	},
	v1_post_projects_id_files_json: {
		input: teamworkInputSchemas['v1_post_projects_id_files_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_files_json'],
	},
	v1_post_files_id_json: {
		input: teamworkInputSchemas['v1_post_files_id_json'],
		output: teamworkOutputSchemas['v1_post_files_id_json'],
	},
	v1_delete_files_id_json: {
		input: teamworkInputSchemas['v1_delete_files_id_json'],
		output: teamworkOutputSchemas['v1_delete_files_id_json'],
	},
	v1_get_files_id_sharedlink_json: {
		input: teamworkInputSchemas['v1_get_files_id_sharedlink_json'],
		output: teamworkOutputSchemas['v1_get_files_id_sharedlink_json'],
	},
	v1_put_files_id_copy_json: {
		input: teamworkInputSchemas['v1_put_files_id_copy_json'],
		output: teamworkOutputSchemas['v1_put_files_id_copy_json'],
	},
	v1_get_projects_id_filecategories_json: {
		input: teamworkInputSchemas['v1_get_projects_id_filecategories_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_filecategories_json'],
	},
	v1_post_projects_id_filecategories_json: {
		input: teamworkInputSchemas['v1_post_projects_id_filecategories_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_filecategories_json'],
	},
	v1_get_filecategories_id_json: {
		input: teamworkInputSchemas['v1_get_filecategories_id_json'],
		output: teamworkOutputSchemas['v1_get_filecategories_id_json'],
	},
	v1_put_filecategories_id_json: {
		input: teamworkInputSchemas['v1_put_filecategories_id_json'],
		output: teamworkOutputSchemas['v1_put_filecategories_id_json'],
	},
	v1_delete_filecategories_id_json: {
		input: teamworkInputSchemas['v1_delete_filecategories_id_json'],
		output: teamworkOutputSchemas['v1_delete_filecategories_id_json'],
	},
	v1_get_notebooks_json: {
		input: teamworkInputSchemas['v1_get_notebooks_json'],
		output: teamworkOutputSchemas['v1_get_notebooks_json'],
	},
	v1_get_projects_id_notebooks_json: {
		input: teamworkInputSchemas['v1_get_projects_id_notebooks_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_notebooks_json'],
	},
	v1_post_projects_id_notebooks_json: {
		input: teamworkInputSchemas['v1_post_projects_id_notebooks_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_notebooks_json'],
	},
	v1_get_notebookcategories_id_notebooks_json: {
		input: teamworkInputSchemas['v1_get_notebookcategories_id_notebooks_json'],
		output:
			teamworkOutputSchemas['v1_get_notebookcategories_id_notebooks_json'],
	},
	v1_get_notebooks_id_json: {
		input: teamworkInputSchemas['v1_get_notebooks_id_json'],
		output: teamworkOutputSchemas['v1_get_notebooks_id_json'],
	},
	v1_put_notebooks_id_json: {
		input: teamworkInputSchemas['v1_put_notebooks_id_json'],
		output: teamworkOutputSchemas['v1_put_notebooks_id_json'],
	},
	v1_delete_notebooks_id_json: {
		input: teamworkInputSchemas['v1_delete_notebooks_id_json'],
		output: teamworkOutputSchemas['v1_delete_notebooks_id_json'],
	},
	v1_put_notebooks_id_lock_json: {
		input: teamworkInputSchemas['v1_put_notebooks_id_lock_json'],
		output: teamworkOutputSchemas['v1_put_notebooks_id_lock_json'],
	},
	v1_put_notebooks_id_unlock_json: {
		input: teamworkInputSchemas['v1_put_notebooks_id_unlock_json'],
		output: teamworkOutputSchemas['v1_put_notebooks_id_unlock_json'],
	},
	v1_put_notebooks_id_copy_json: {
		input: teamworkInputSchemas['v1_put_notebooks_id_copy_json'],
		output: teamworkOutputSchemas['v1_put_notebooks_id_copy_json'],
	},
	v1_put_notebooks_id_move_json: {
		input: teamworkInputSchemas['v1_put_notebooks_id_move_json'],
		output: teamworkOutputSchemas['v1_put_notebooks_id_move_json'],
	},
	v1_get_projects_id_notebookcategories_json: {
		input: teamworkInputSchemas['v1_get_projects_id_notebookcategories_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_notebookcategories_json'],
	},
	v1_post_projects_id_notebookcategories_json: {
		input: teamworkInputSchemas['v1_post_projects_id_notebookcategories_json'],
		output:
			teamworkOutputSchemas['v1_post_projects_id_notebookcategories_json'],
	},
	v1_get_notebookcategories_id_json: {
		input: teamworkInputSchemas['v1_get_notebookcategories_id_json'],
		output: teamworkOutputSchemas['v1_get_notebookcategories_id_json'],
	},
	v1_put_notebookcategories_id_json: {
		input: teamworkInputSchemas['v1_put_notebookcategories_id_json'],
		output: teamworkOutputSchemas['v1_put_notebookcategories_id_json'],
	},
	v1_delete_notebookcategories_id_json: {
		input: teamworkInputSchemas['v1_delete_notebookcategories_id_json'],
		output: teamworkOutputSchemas['v1_delete_notebookcategories_id_json'],
	},
	v1_get_projects_id_links_json: {
		input: teamworkInputSchemas['v1_get_projects_id_links_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_links_json'],
	},
	v1_post_projects_id_links_json: {
		input: teamworkInputSchemas['v1_post_projects_id_links_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_links_json'],
	},
	v1_get_links_json: {
		input: teamworkInputSchemas['v1_get_links_json'],
		output: teamworkOutputSchemas['v1_get_links_json'],
	},
	v1_get_links_id_json: {
		input: teamworkInputSchemas['v1_get_links_id_json'],
		output: teamworkOutputSchemas['v1_get_links_id_json'],
	},
	v1_put_links_id_json: {
		input: teamworkInputSchemas['v1_put_links_id_json'],
		output: teamworkOutputSchemas['v1_put_links_id_json'],
	},
	v1_delete_links_id_json: {
		input: teamworkInputSchemas['v1_delete_links_id_json'],
		output: teamworkOutputSchemas['v1_delete_links_id_json'],
	},
	v1_get_projects_id_linkcategories_json: {
		input: teamworkInputSchemas['v1_get_projects_id_linkcategories_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_linkcategories_json'],
	},
	v1_post_projects_id_linkcategories_json: {
		input: teamworkInputSchemas['v1_post_projects_id_linkcategories_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_linkcategories_json'],
	},
	v1_get_linkcategories_id_json: {
		input: teamworkInputSchemas['v1_get_linkcategories_id_json'],
		output: teamworkOutputSchemas['v1_get_linkcategories_id_json'],
	},
	v1_delete_linkcategories_id_json: {
		input: teamworkInputSchemas['v1_delete_linkcategories_id_json'],
		output: teamworkOutputSchemas['v1_delete_linkcategories_id_json'],
	},
	v1_get_time_entries_json: {
		input: teamworkInputSchemas['v1_get_time_entries_json'],
		output: teamworkOutputSchemas['v1_get_time_entries_json'],
	},
	v1_get_projects_id_time_entries_json: {
		input: teamworkInputSchemas['v1_get_projects_id_time_entries_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_time_entries_json'],
	},
	v1_post_projects_id_time_entries_json: {
		input: teamworkInputSchemas['v1_post_projects_id_time_entries_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_time_entries_json'],
	},
	v1_get_tasks_id_time_entries_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_time_entries_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_time_entries_json'],
	},
	v1_post_tasks_id_time_entries_json: {
		input: teamworkInputSchemas['v1_post_tasks_id_time_entries_json'],
		output: teamworkOutputSchemas['v1_post_tasks_id_time_entries_json'],
	},
	v1_get_time_entries_id_json: {
		input: teamworkInputSchemas['v1_get_time_entries_id_json'],
		output: teamworkOutputSchemas['v1_get_time_entries_id_json'],
	},
	v1_put_time_entries_id_json: {
		input: teamworkInputSchemas['v1_put_time_entries_id_json'],
		output: teamworkOutputSchemas['v1_put_time_entries_id_json'],
	},
	v1_delete_time_entries_id_json: {
		input: teamworkInputSchemas['v1_delete_time_entries_id_json'],
		output: teamworkOutputSchemas['v1_delete_time_entries_id_json'],
	},
	v1_get_projects_id_time_total_json: {
		input: teamworkInputSchemas['v1_get_projects_id_time_total_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_time_total_json'],
	},
	v1_get_time_total_json: {
		input: teamworkInputSchemas['v1_get_time_total_json'],
		output: teamworkOutputSchemas['v1_get_time_total_json'],
	},
	v1_get_projects_time_total_json: {
		input: teamworkInputSchemas['v1_get_projects_time_total_json'],
		output: teamworkOutputSchemas['v1_get_projects_time_total_json'],
	},
	v1_get_projects_estimatedtime_total_json: {
		input: teamworkInputSchemas['v1_get_projects_estimatedtime_total_json'],
		output: teamworkOutputSchemas['v1_get_projects_estimatedtime_total_json'],
	},
	v1_get_tasklists_id_time_total_json: {
		input: teamworkInputSchemas['v1_get_tasklists_id_time_total_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_id_time_total_json'],
	},
	v1_get_tasks_id_time_total_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_time_total_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_time_total_json'],
	},
	v1_get_people_id_loggedtime_json: {
		input: teamworkInputSchemas['v1_get_people_id_loggedtime_json'],
		output: teamworkOutputSchemas['v1_get_people_id_loggedtime_json'],
	},
	v1_get_timers_json: {
		input: teamworkInputSchemas['v1_get_timers_json'],
		output: teamworkOutputSchemas['v1_get_timers_json'],
	},
	v1_get_me_timers_json: {
		input: teamworkInputSchemas['v1_get_me_timers_json'],
		output: teamworkOutputSchemas['v1_get_me_timers_json'],
	},
	v1_get_people_id_timers_json: {
		input: teamworkInputSchemas['v1_get_people_id_timers_json'],
		output: teamworkOutputSchemas['v1_get_people_id_timers_json'],
	},
	v1_put_tasks_id_estimatedtime_json: {
		input: teamworkInputSchemas['v1_put_tasks_id_estimatedtime_json'],
		output: teamworkOutputSchemas['v1_put_tasks_id_estimatedtime_json'],
	},
	v1_delete_comments_id_json: {
		input: teamworkInputSchemas['v1_delete_comments_id_json'],
		output: teamworkOutputSchemas['v1_delete_comments_id_json'],
	},
	v1_put_comments_id_json: {
		input: teamworkInputSchemas['v1_put_comments_id_json'],
		output: teamworkOutputSchemas['v1_put_comments_id_json'],
	},
	v1_get_resource_resourceid_comments_json: {
		input: teamworkInputSchemas['v1_get_resource_resourceid_comments_json'],
		output: teamworkOutputSchemas['v1_get_resource_resourceid_comments_json'],
	},
	v1_post_resource_resourceid_comments_json: {
		input: teamworkInputSchemas['v1_post_resource_resourceid_comments_json'],
		output: teamworkOutputSchemas['v1_post_resource_resourceid_comments_json'],
	},
	v1_get_comments_json: {
		input: teamworkInputSchemas['v1_get_comments_json'],
		output: teamworkOutputSchemas['v1_get_comments_json'],
	},
	v1_put_comments_id_markread_json: {
		input: teamworkInputSchemas['v1_put_comments_id_markread_json'],
		output: teamworkOutputSchemas['v1_put_comments_id_markread_json'],
	},
	v1_get_projects_id_boards_columns_json: {
		input: teamworkInputSchemas['v1_get_projects_id_boards_columns_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_boards_columns_json'],
	},
	v1_post_projects_id_boards_columns_json: {
		input: teamworkInputSchemas['v1_post_projects_id_boards_columns_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_boards_columns_json'],
	},
	v1_get_boards_columns_id_cards_json: {
		input: teamworkInputSchemas['v1_get_boards_columns_id_cards_json'],
		output: teamworkOutputSchemas['v1_get_boards_columns_id_cards_json'],
	},
	v1_put_boards_columns_cards_id_move_json: {
		input: teamworkInputSchemas['v1_put_boards_columns_cards_id_move_json'],
		output: teamworkOutputSchemas['v1_put_boards_columns_cards_id_move_json'],
	},
	v1_put_boards_columns_cards_id_json: {
		input: teamworkInputSchemas['v1_put_boards_columns_cards_id_json'],
		output: teamworkOutputSchemas['v1_put_boards_columns_cards_id_json'],
	},
	v1_delete_boards_columns_cards_id_json: {
		input: teamworkInputSchemas['v1_delete_boards_columns_cards_id_json'],
		output: teamworkOutputSchemas['v1_delete_boards_columns_cards_id_json'],
	},
	v1_get_boards_columns_cards_id_json: {
		input: teamworkInputSchemas['v1_get_boards_columns_cards_id_json'],
		output: teamworkOutputSchemas['v1_get_boards_columns_cards_id_json'],
	},
	v1_delete_boards_columns_id_json: {
		input: teamworkInputSchemas['v1_delete_boards_columns_id_json'],
		output: teamworkOutputSchemas['v1_delete_boards_columns_id_json'],
	},
	v1_put_boards_columns_id_json: {
		input: teamworkInputSchemas['v1_put_boards_columns_id_json'],
		output: teamworkOutputSchemas['v1_put_boards_columns_id_json'],
	},
	v1_get_boards_columns_id_json: {
		input: teamworkInputSchemas['v1_get_boards_columns_id_json'],
		output: teamworkOutputSchemas['v1_get_boards_columns_id_json'],
	},
	v1_get_portfolio_boards_json: {
		input: teamworkInputSchemas['v1_get_portfolio_boards_json'],
		output: teamworkOutputSchemas['v1_get_portfolio_boards_json'],
	},
	v1_post_portfolio_boards_json: {
		input: teamworkInputSchemas['v1_post_portfolio_boards_json'],
		output: teamworkOutputSchemas['v1_post_portfolio_boards_json'],
	},
	v1_put_portfolio_boards_boardid_json: {
		input: teamworkInputSchemas['v1_put_portfolio_boards_boardid_json'],
		output: teamworkOutputSchemas['v1_put_portfolio_boards_boardid_json'],
	},
	v1_delete_portfolio_boards_boardid_json: {
		input: teamworkInputSchemas['v1_delete_portfolio_boards_boardid_json'],
		output: teamworkOutputSchemas['v1_delete_portfolio_boards_boardid_json'],
	},
	v1_get_portfolio_boards_boardid_columns_json: {
		input: teamworkInputSchemas['v1_get_portfolio_boards_boardid_columns_json'],
		output:
			teamworkOutputSchemas['v1_get_portfolio_boards_boardid_columns_json'],
	},
	v1_post_portfolio_boards_boardid_columns_json: {
		input:
			teamworkInputSchemas['v1_post_portfolio_boards_boardid_columns_json'],
		output:
			teamworkOutputSchemas['v1_post_portfolio_boards_boardid_columns_json'],
	},
	v1_get_portfolio_columns_columnid_cards_json: {
		input: teamworkInputSchemas['v1_get_portfolio_columns_columnid_cards_json'],
		output:
			teamworkOutputSchemas['v1_get_portfolio_columns_columnid_cards_json'],
	},
	v1_post_portfolio_columns_columnid_cards_json: {
		input:
			teamworkInputSchemas['v1_post_portfolio_columns_columnid_cards_json'],
		output:
			teamworkOutputSchemas['v1_post_portfolio_columns_columnid_cards_json'],
	},
	v1_get_portfolio_cards_cardid_json: {
		input: teamworkInputSchemas['v1_get_portfolio_cards_cardid_json'],
		output: teamworkOutputSchemas['v1_get_portfolio_cards_cardid_json'],
	},
	v1_delete_portfolio_cards_cardid_json: {
		input: teamworkInputSchemas['v1_delete_portfolio_cards_cardid_json'],
		output: teamworkOutputSchemas['v1_delete_portfolio_cards_cardid_json'],
	},
	v1_put_portfolio_cards_cardid_move_json: {
		input: teamworkInputSchemas['v1_put_portfolio_cards_cardid_move_json'],
		output: teamworkOutputSchemas['v1_put_portfolio_cards_cardid_move_json'],
	},
	v1_delete_portfolio_columns_columnid_json: {
		input: teamworkInputSchemas['v1_delete_portfolio_columns_columnid_json'],
		output: teamworkOutputSchemas['v1_delete_portfolio_columns_columnid_json'],
	},
	v1_get_portfolio_columns_columnid_json: {
		input: teamworkInputSchemas['v1_get_portfolio_columns_columnid_json'],
		output: teamworkOutputSchemas['v1_get_portfolio_columns_columnid_json'],
	},
	v1_get_projects_projectid_updates_json: {
		input: teamworkInputSchemas['v1_get_projects_projectid_updates_json'],
		output: teamworkOutputSchemas['v1_get_projects_projectid_updates_json'],
	},
	v1_get_projects_projectid_update_json: {
		input: teamworkInputSchemas['v1_get_projects_projectid_update_json'],
		output: teamworkOutputSchemas['v1_get_projects_projectid_update_json'],
	},
	v1_post_projects_projectid_update_json: {
		input: teamworkInputSchemas['v1_post_projects_projectid_update_json'],
		output: teamworkOutputSchemas['v1_post_projects_projectid_update_json'],
	},
	v1_put_projects_updates_updateid_json: {
		input: teamworkInputSchemas['v1_put_projects_updates_updateid_json'],
		output: teamworkOutputSchemas['v1_put_projects_updates_updateid_json'],
	},
	v1_delete_projects_updates_updateid_json: {
		input: teamworkInputSchemas['v1_delete_projects_updates_updateid_json'],
		output: teamworkOutputSchemas['v1_delete_projects_updates_updateid_json'],
	},
	v1_put_projects_projectid_update_request_json: {
		input:
			teamworkInputSchemas['v1_put_projects_projectid_update_request_json'],
		output:
			teamworkOutputSchemas['v1_put_projects_projectid_update_request_json'],
	},
	v1_post_projects_projectid_people_personid_json: {
		input:
			teamworkInputSchemas['v1_post_projects_projectid_people_personid_json'],
		output:
			teamworkOutputSchemas['v1_post_projects_projectid_people_personid_json'],
	},
	v1_put_projects_projectid_people_personid_json: {
		input:
			teamworkInputSchemas['v1_put_projects_projectid_people_personid_json'],
		output:
			teamworkOutputSchemas['v1_put_projects_projectid_people_personid_json'],
	},
	v1_get_projects_projectid_people_personid_json: {
		input:
			teamworkInputSchemas['v1_get_projects_projectid_people_personid_json'],
		output:
			teamworkOutputSchemas['v1_get_projects_projectid_people_personid_json'],
	},
	v1_get_projects_id_roles_json: {
		input: teamworkInputSchemas['v1_get_projects_id_roles_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_roles_json'],
	},
	v1_get_roles_id_json: {
		input: teamworkInputSchemas['v1_get_roles_id_json'],
		output: teamworkOutputSchemas['v1_get_roles_id_json'],
	},
	v1_put_roles_id_json: {
		input: teamworkInputSchemas['v1_put_roles_id_json'],
		output: teamworkOutputSchemas['v1_put_roles_id_json'],
	},
	v1_delete_roles_id_json: {
		input: teamworkInputSchemas['v1_delete_roles_id_json'],
		output: teamworkOutputSchemas['v1_delete_roles_id_json'],
	},
	v1_get_comments_commentid_reactions_json: {
		input: teamworkInputSchemas['v1_get_comments_commentid_reactions_json'],
		output: teamworkOutputSchemas['v1_get_comments_commentid_reactions_json'],
	},
	v1_get_projects_updates_updateid_reactions_json: {
		input:
			teamworkInputSchemas['v1_get_projects_updates_updateid_reactions_json'],
		output:
			teamworkOutputSchemas['v1_get_projects_updates_updateid_reactions_json'],
	},
	v1_put_comments_commentid_react_json: {
		input: teamworkInputSchemas['v1_put_comments_commentid_react_json'],
		output: teamworkOutputSchemas['v1_put_comments_commentid_react_json'],
	},
	v1_put_projects_updates_updateid_react_json: {
		input: teamworkInputSchemas['v1_put_projects_updates_updateid_react_json'],
		output:
			teamworkOutputSchemas['v1_put_projects_updates_updateid_react_json'],
	},
	v1_put_resource_id_unreact_json: {
		input: teamworkInputSchemas['v1_put_resource_id_unreact_json'],
		output: teamworkOutputSchemas['v1_put_resource_id_unreact_json'],
	},
	v1_post_projects_template_json: {
		input: teamworkInputSchemas['v1_post_projects_template_json'],
		output: teamworkOutputSchemas['v1_post_projects_template_json'],
	},
	v1_get_teams_json: {
		input: teamworkInputSchemas['v1_get_teams_json'],
		output: teamworkOutputSchemas['v1_get_teams_json'],
	},
	v1_post_teams_json: {
		input: teamworkInputSchemas['v1_post_teams_json'],
		output: teamworkOutputSchemas['v1_post_teams_json'],
	},
	v1_delete_teams_json: {
		input: teamworkInputSchemas['v1_delete_teams_json'],
		output: teamworkOutputSchemas['v1_delete_teams_json'],
	},
	v1_get_teams_id_json: {
		input: teamworkInputSchemas['v1_get_teams_id_json'],
		output: teamworkOutputSchemas['v1_get_teams_id_json'],
	},
	v1_put_teams_id_json: {
		input: teamworkInputSchemas['v1_put_teams_id_json'],
		output: teamworkOutputSchemas['v1_put_teams_id_json'],
	},
	v1_delete_teams_id_json: {
		input: teamworkInputSchemas['v1_delete_teams_id_json'],
		output: teamworkOutputSchemas['v1_delete_teams_id_json'],
	},
	v1_put_teams_id_people_json: {
		input: teamworkInputSchemas['v1_put_teams_id_people_json'],
		output: teamworkOutputSchemas['v1_put_teams_id_people_json'],
	},
	v1_get_projects_id_teams_json: {
		input: teamworkInputSchemas['v1_get_projects_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_projects_id_teams_json'],
	},
	v1_post_projects_id_teams_json: {
		input: teamworkInputSchemas['v1_post_projects_id_teams_json'],
		output: teamworkOutputSchemas['v1_post_projects_id_teams_json'],
	},
	v1_get_companies_id_teams_json: {
		input: teamworkInputSchemas['v1_get_companies_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_companies_id_teams_json'],
	},
	v1_get_milestones_id_teams_json: {
		input: teamworkInputSchemas['v1_get_milestones_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_milestones_id_teams_json'],
	},
	v1_get_notebooks_id_teams_json: {
		input: teamworkInputSchemas['v1_get_notebooks_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_notebooks_id_teams_json'],
	},
	v1_get_tasks_id_teams_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_teams_json'],
	},
	v1_get_files_id_teams_json: {
		input: teamworkInputSchemas['v1_get_files_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_files_id_teams_json'],
	},
	v1_get_tasklists_id_teams_json: {
		input: teamworkInputSchemas['v1_get_tasklists_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_id_teams_json'],
	},
	v1_get_links_id_teams_json: {
		input: teamworkInputSchemas['v1_get_links_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_links_id_teams_json'],
	},
	v1_get_portfolio_boards_id_teams_json: {
		input: teamworkInputSchemas['v1_get_portfolio_boards_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_portfolio_boards_id_teams_json'],
	},
	v1_get_comments_id_teams_json: {
		input: teamworkInputSchemas['v1_get_comments_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_comments_id_teams_json'],
	},
	v1_get_teams_id_subteams_json: {
		input: teamworkInputSchemas['v1_get_teams_id_subteams_json'],
		output: teamworkOutputSchemas['v1_get_teams_id_subteams_json'],
	},
	v1_get_people_id_teams_json: {
		input: teamworkInputSchemas['v1_get_people_id_teams_json'],
		output: teamworkOutputSchemas['v1_get_people_id_teams_json'],
	},
	v1_get_milestones_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_milestones_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_milestones_id_comments_teams_json'],
	},
	v1_get_notebooks_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_notebooks_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_notebooks_id_comments_teams_json'],
	},
	v1_get_tasks_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_tasks_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_tasks_id_comments_teams_json'],
	},
	v1_get_files_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_files_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_files_id_comments_teams_json'],
	},
	v1_get_tasklists_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_tasklists_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_tasklists_id_comments_teams_json'],
	},
	v1_get_links_id_comments_teams_json: {
		input: teamworkInputSchemas['v1_get_links_id_comments_teams_json'],
		output: teamworkOutputSchemas['v1_get_links_id_comments_teams_json'],
	},
	v1_get_teams_users_json: {
		input: teamworkInputSchemas['v1_get_teams_users_json'],
		output: teamworkOutputSchemas['v1_get_teams_users_json'],
	},
	v2_get_projects_api_v2_projects_templates_json: {
		input:
			teamworkInputSchemas['v2_get_projects_api_v2_projects_templates_json'],
		output:
			teamworkOutputSchemas['v2_get_projects_api_v2_projects_templates_json'],
	},
	v2_get_projects_api_v2_projects_id_predecessors_json: {
		input:
			teamworkInputSchemas[
				'v2_get_projects_api_v2_projects_id_predecessors_json'
			],
		output:
			teamworkOutputSchemas[
				'v2_get_projects_api_v2_projects_id_predecessors_json'
			],
	},
	v2_get_projects_api_v2_tasklists_id_taskids_json: {
		input:
			teamworkInputSchemas['v2_get_projects_api_v2_tasklists_id_taskids_json'],
		output:
			teamworkOutputSchemas['v2_get_projects_api_v2_tasklists_id_taskids_json'],
	},
	v2_get_projects_api_v2_projects_id_taskids_json: {
		input:
			teamworkInputSchemas['v2_get_projects_api_v2_projects_id_taskids_json'],
		output:
			teamworkOutputSchemas['v2_get_projects_api_v2_projects_id_taskids_json'],
	},
	v2_get_projects_api_v2_projects_json: {
		input: teamworkInputSchemas['v2_get_projects_api_v2_projects_json'],
		output: teamworkOutputSchemas['v2_get_projects_api_v2_projects_json'],
	},
	v2_get_projects_api_v2_tasks_json: {
		input: teamworkInputSchemas['v2_get_projects_api_v2_tasks_json'],
		output: teamworkOutputSchemas['v2_get_projects_api_v2_tasks_json'],
	},
	v2_get_projects_api_v2_tasks_taskid_json: {
		input: teamworkInputSchemas['v2_get_projects_api_v2_tasks_taskid_json'],
		output: teamworkOutputSchemas['v2_get_projects_api_v2_tasks_taskid_json'],
	},
	v2_get_projects_api_v2_projects_projectid_json: {
		input:
			teamworkInputSchemas['v2_get_projects_api_v2_projects_projectid_json'],
		output:
			teamworkOutputSchemas['v2_get_projects_api_v2_projects_projectid_json'],
	},
	v3_get_projects_api_v3_allocations_allocationid_time_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_allocations_allocationid_time_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_allocations_allocationid_time_json'
			],
	},
	v3_get_projects_api_v3_comments_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_comments_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_comments_json'],
	},
	v3_post_projects_api_v3_comments_json: {
		input: teamworkInputSchemas['v3_post_projects_api_v3_comments_json'],
		output: teamworkOutputSchemas['v3_post_projects_api_v3_comments_json'],
	},
	v3_get_projects_api_v3_comments_id_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_comments_id_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_comments_id_json'],
	},
	v3_get_projects_api_v3_comments_id_notified_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_comments_id_notified_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_comments_id_notified_json'],
	},
	v3_get_projects_api_v3_companies_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_companies_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_companies_json'],
	},
	v3_post_projects_api_v3_companies_json: {
		input: teamworkInputSchemas['v3_post_projects_api_v3_companies_json'],
		output: teamworkOutputSchemas['v3_post_projects_api_v3_companies_json'],
	},
	v3_delete_projects_api_v3_companies_domains_id_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_companies_domains_id_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_companies_domains_id_json'
			],
	},
	v3_patch_projects_api_v3_companies_domains_id_json: {
		input:
			teamworkInputSchemas[
				'v3_patch_projects_api_v3_companies_domains_id_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_patch_projects_api_v3_companies_domains_id_json'
			],
	},
	v3_get_projects_api_v3_companies_time_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_companies_time_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_companies_time_json'],
	},
	v3_delete_projects_api_v3_companies_companyid_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_companies_companyid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_companies_companyid_json'
			],
	},
	v3_get_projects_api_v3_companies_companyid_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_companies_companyid_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_companies_companyid_json'],
	},
	v3_patch_projects_api_v3_companies_companyid_json: {
		input:
			teamworkInputSchemas['v3_patch_projects_api_v3_companies_companyid_json'],
		output:
			teamworkOutputSchemas[
				'v3_patch_projects_api_v3_companies_companyid_json'
			],
	},
	v3_patch_projects_api_v3_companies_companyid_rates_json: {
		input:
			teamworkInputSchemas[
				'v3_patch_projects_api_v3_companies_companyid_rates_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_patch_projects_api_v3_companies_companyid_rates_json'
			],
	},
	v3_post_projects_api_v3_companies_id_convert_currency_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_companies_id_convert_currency_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_companies_id_convert_currency_json'
			],
	},
	v3_post_projects_api_v3_companies_id_domains_json: {
		input:
			teamworkInputSchemas['v3_post_projects_api_v3_companies_id_domains_json'],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_companies_id_domains_json'
			],
	},
	v3_get_projects_api_v3_files_fileid_project_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_files_fileid_project_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_files_fileid_project_json'],
	},
	v3_get_projects_api_v3_links_linkid_comments_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_links_linkid_comments_json'],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_links_linkid_comments_json'
			],
	},
	v3_post_projects_api_v3_links_linkid_comments_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_links_linkid_comments_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_links_linkid_comments_json'
			],
	},
	v3_get_projects_api_v3_links_linkid_project_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_links_linkid_project_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_links_linkid_project_json'],
	},
	v3_get_projects_api_v3_me_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_me_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_me_json'],
	},
	v3_get_projects_api_v3_me_personaltasks_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_me_personaltasks_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_me_personaltasks_json'],
	},
	v3_post_projects_api_v3_me_personaltasks_json: {
		input:
			teamworkInputSchemas['v3_post_projects_api_v3_me_personaltasks_json'],
		output:
			teamworkOutputSchemas['v3_post_projects_api_v3_me_personaltasks_json'],
	},
	v3_get_projects_api_v3_me_personaltasks_id_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_me_personaltasks_id_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_me_personaltasks_id_json'],
	},
	v3_get_projects_api_v3_me_timers_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_me_timers_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_me_timers_json'],
	},
	v3_post_projects_api_v3_me_timers_json: {
		input: teamworkInputSchemas['v3_post_projects_api_v3_me_timers_json'],
		output: teamworkOutputSchemas['v3_post_projects_api_v3_me_timers_json'],
	},
	v3_delete_projects_api_v3_me_timers_timerid_json: {
		input:
			teamworkInputSchemas['v3_delete_projects_api_v3_me_timers_timerid_json'],
		output:
			teamworkOutputSchemas['v3_delete_projects_api_v3_me_timers_timerid_json'],
	},
	v3_put_projects_api_v3_me_timers_timerid_json: {
		input:
			teamworkInputSchemas['v3_put_projects_api_v3_me_timers_timerid_json'],
		output:
			teamworkOutputSchemas['v3_put_projects_api_v3_me_timers_timerid_json'],
	},
	v3_put_projects_api_v3_me_timers_timerid_complete_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_complete_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_complete_json'
			],
	},
	v3_put_projects_api_v3_me_timers_timerid_pause_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_pause_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_pause_json'
			],
	},
	v3_put_projects_api_v3_me_timers_timerid_resume_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_resume_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_resume_json'
			],
	},
	v3_put_projects_api_v3_me_timers_timerid_undelete_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_undelete_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_me_timers_timerid_undelete_json'
			],
	},
	v3_get_projects_api_v3_milestones_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_milestones_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_milestones_json'],
	},
	v3_get_projects_api_v3_milestones_metrics_deadlines_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_milestones_metrics_deadlines_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_milestones_metrics_deadlines_json'
			],
	},
	v3_get_projects_api_v3_milestones_milestoneid_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_milestones_milestoneid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_milestones_milestoneid_json'
			],
	},
	v3_get_projects_api_v3_milestones_milestoneid_project_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_milestones_milestoneid_project_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_milestones_milestoneid_project_json'
			],
	},
	v3_get_projects_api_v3_notebooks_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_notebooks_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_notebooks_json'],
	},
	v3_delete_projects_api_v3_notebooks_notebookid_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_notebooks_notebookid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_notebooks_notebookid_json'
			],
	},
	v3_get_projects_api_v3_notebooks_notebookid_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_notebooks_notebookid_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_notebooks_notebookid_json'],
	},
	v3_patch_projects_api_v3_notebooks_notebookid_json: {
		input:
			teamworkInputSchemas[
				'v3_patch_projects_api_v3_notebooks_notebookid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_patch_projects_api_v3_notebooks_notebookid_json'
			],
	},
	v3_get_projects_api_v3_notebooks_notebookid_compare_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_compare_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_compare_json'
			],
	},
	v3_get_projects_api_v3_notebooks_notebookid_project_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_project_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_project_json'
			],
	},
	v3_delete_projects_api_v3_notebooks_notebookid_versions_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_notebooks_notebookid_versions_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_notebooks_notebookid_versions_json'
			],
	},
	v3_get_projects_api_v3_notebooks_notebookid_versions_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_versions_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_versions_json'
			],
	},
	v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json'
			],
	},
	v3_get_projects_api_v3_people_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_people_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_people_json'],
	},
	v3_get_projects_api_v3_people_metrics_performance_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_people_metrics_performance_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_people_metrics_performance_json'
			],
	},
	v3_get_projects_api_v3_people_utilization_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_people_utilization_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_people_utilization_json'],
	},
	v3_delete_projects_api_v3_people_personid_json: {
		input:
			teamworkInputSchemas['v3_delete_projects_api_v3_people_personid_json'],
		output:
			teamworkOutputSchemas['v3_delete_projects_api_v3_people_personid_json'],
	},
	v3_get_projects_api_v3_people_personid_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_people_personid_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_people_personid_json'],
	},
	v3_get_projects_api_v3_projects_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_projects_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_projects_json'],
	},
	v3_get_projects_api_v3_projects_metrics_active_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_active_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_active_json'
			],
	},
	v3_get_projects_api_v3_projects_metrics_billable_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_billable_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_billable_json'
			],
	},
	v3_get_projects_api_v3_projects_metrics_healths_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_healths_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_healths_json'
			],
	},
	v3_get_projects_api_v3_projects_metrics_invoices_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_invoices_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_invoices_json'
			],
	},
	v3_get_projects_api_v3_projects_metrics_owners_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_owners_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_owners_json'
			],
	},
	v3_get_projects_api_v3_projects_metrics_unbilled_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_metrics_unbilled_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_metrics_unbilled_json'
			],
	},
	v3_get_projects_api_v3_projects_number_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_projects_number_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_number_json'],
	},
	v3_put_projects_api_v3_projects_number_json: {
		input: teamworkInputSchemas['v3_put_projects_api_v3_projects_number_json'],
		output:
			teamworkOutputSchemas['v3_put_projects_api_v3_projects_number_json'],
	},
	v3_put_projects_api_v3_projects_people_userid_enqueue_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_projects_people_userid_enqueue_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_projects_people_userid_enqueue_json'
			],
	},
	v3_get_projects_api_v3_projects_starred_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_projects_starred_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_starred_json'],
	},
	v3_get_projects_api_v3_projects_teamwork_samples_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_teamwork_samples_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_teamwork_samples_json'
			],
	},
	v3_get_projects_api_v3_projects_templates_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_projects_templates_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_templates_json'],
	},
	v3_get_projects_api_v3_projects_templates_id_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_projects_templates_id_json'],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_templates_id_json'
			],
	},
	v3_get_projects_api_v3_projects_templates_id_customfields_required_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_templates_id_customfields_required_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_templates_id_customfields_required_json'
			],
	},
	v3_put_projects_api_v3_projects_tentative_projectid_convert_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_projects_tentative_projectid_convert_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_projects_tentative_projectid_convert_json'
			],
	},
	v3_get_projects_api_v3_projects_updates_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_projects_updates_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_updates_json'],
	},
	v3_get_projects_api_v3_projects_projectids_updates_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectids_updates_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectids_updates_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_projects_projectid_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_projects_projectid_json'],
	},
	v3_get_projects_api_v3_projects_projectid_featureorder_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_featureorder_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_featureorder_json'
			],
	},
	v3_put_projects_api_v3_projects_projectid_featureorder_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_projects_projectid_featureorder_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_projects_projectid_featureorder_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_milestones_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_milestones_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_milestones_json'
			],
	},
	v3_post_projects_api_v3_projects_projectid_notebooks_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_projects_projectid_notebooks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_projects_projectid_notebooks_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_people_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_people_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_people_json'
			],
	},
	v3_put_projects_api_v3_projects_projectid_people_json: {
		input:
			teamworkInputSchemas[
				'v3_put_projects_api_v3_projects_projectid_people_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_put_projects_api_v3_projects_projectid_people_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_people_personid_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_people_personid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_people_personid_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_tasklists_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_tasklists_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_tasklists_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_tasks_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_tasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_tasks_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_time_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_time_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_time_json'
			],
	},
	v3_post_projects_api_v3_projects_projectid_time_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_projects_projectid_time_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_projects_projectid_time_json'
			],
	},
	v3_get_projects_api_v3_projects_projectid_time_total_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_projects_projectid_time_total_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_projects_projectid_time_total_json'
			],
	},
	v3_get_projects_api_v3_reporting_dashboards_data_milestones_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_reporting_dashboards_data_milestones_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_reporting_dashboards_data_milestones_json'
			],
	},
	v3_get_projects_api_v3_reporting_dashboards_details_milestones_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_reporting_dashboards_details_milestones_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_reporting_dashboards_details_milestones_json'
			],
	},
	v3_get_projects_api_v3_reporting_precanned_companytime_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_companytime_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_companytime_json'
			],
	},
	v3_get_projects_api_v3_reporting_precanned_tasktime_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_tasktime_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_tasktime_json'
			],
	},
	v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json'
			],
	},
	v3_get_projects_api_v3_statuses_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_statuses_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_statuses_json'],
	},
	v3_get_projects_api_v3_statuses_timeline_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_statuses_timeline_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_statuses_timeline_json'],
	},
	v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json'
			],
	},
	v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json'
			],
	},
	v3_get_projects_api_v3_tasklists_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_tasklists_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_tasklists_json'],
	},
	v3_get_projects_api_v3_tasklists_templates_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasklists_templates_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasklists_templates_json'],
	},
	v3_delete_projects_api_v3_tasklists_tasklistid_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_tasklists_tasklistid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_tasklists_tasklistid_json'
			],
	},
	v3_get_projects_api_v3_tasklists_tasklistid_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasklists_tasklistid_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasklists_tasklistid_json'],
	},
	v3_get_projects_api_v3_tasklists_tasklistid_project_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_project_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_project_json'
			],
	},
	v3_get_projects_api_v3_tasklists_tasklistid_tasks_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_tasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_tasks_json'
			],
	},
	v3_post_projects_api_v3_tasklists_tasklistid_tasks_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_tasklists_tasklistid_tasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_tasklists_tasklistid_tasks_json'
			],
	},
	v3_get_projects_api_v3_tasklists_tasklistid_time_total_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_time_total_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasklists_tasklistid_time_total_json'
			],
	},
	v3_get_projects_api_v3_tasks_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_tasks_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_tasks_json'],
	},
	v3_get_projects_api_v3_tasks_metrics_complete_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_tasks_metrics_complete_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasks_metrics_complete_json'
			],
	},
	v3_get_projects_api_v3_tasks_metrics_late_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasks_metrics_late_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasks_metrics_late_json'],
	},
	v3_get_projects_api_v3_tasks_id_reminders_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasks_id_reminders_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasks_id_reminders_json'],
	},
	v3_delete_projects_api_v3_tasks_taskid_json: {
		input: teamworkInputSchemas['v3_delete_projects_api_v3_tasks_taskid_json'],
		output:
			teamworkOutputSchemas['v3_delete_projects_api_v3_tasks_taskid_json'],
	},
	v3_get_projects_api_v3_tasks_taskid_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_tasks_taskid_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_tasks_taskid_json'],
	},
	v3_patch_projects_api_v3_tasks_taskid_json: {
		input: teamworkInputSchemas['v3_patch_projects_api_v3_tasks_taskid_json'],
		output: teamworkOutputSchemas['v3_patch_projects_api_v3_tasks_taskid_json'],
	},
	v3_put_projects_api_v3_tasks_taskid_json: {
		input: teamworkInputSchemas['v3_put_projects_api_v3_tasks_taskid_json'],
		output: teamworkOutputSchemas['v3_put_projects_api_v3_tasks_taskid_json'],
	},
	v3_get_projects_api_v3_tasks_taskid_project_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasks_taskid_project_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasks_taskid_project_json'],
	},
	v3_post_projects_api_v3_tasks_taskid_reminders_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_tasks_taskid_reminders_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_tasks_taskid_reminders_json'
			],
	},
	v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		input:
			teamworkInputSchemas[
				'v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json'
			],
	},
	v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		input:
			teamworkInputSchemas[
				'v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json'
			],
	},
	v3_get_projects_api_v3_tasks_taskid_subtasks_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasks_taskid_subtasks_json'],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasks_taskid_subtasks_json'
			],
	},
	v3_post_projects_api_v3_tasks_taskid_subtasks_json: {
		input:
			teamworkInputSchemas[
				'v3_post_projects_api_v3_tasks_taskid_subtasks_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_post_projects_api_v3_tasks_taskid_subtasks_json'
			],
	},
	v3_get_projects_api_v3_tasks_taskid_time_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_tasks_taskid_time_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_tasks_taskid_time_json'],
	},
	v3_post_projects_api_v3_tasks_taskid_time_json: {
		input:
			teamworkInputSchemas['v3_post_projects_api_v3_tasks_taskid_time_json'],
		output:
			teamworkOutputSchemas['v3_post_projects_api_v3_tasks_taskid_time_json'],
	},
	v3_get_projects_api_v3_tasks_taskid_time_total_json: {
		input:
			teamworkInputSchemas[
				'v3_get_projects_api_v3_tasks_taskid_time_total_json'
			],
		output:
			teamworkOutputSchemas[
				'v3_get_projects_api_v3_tasks_taskid_time_total_json'
			],
	},
	v3_get_projects_api_v3_time_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_time_json'],
	},
	v3_get_projects_api_v3_time_report_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_report_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_time_report_json'],
	},
	v3_get_projects_api_v3_time_report_totals_json: {
		input:
			teamworkInputSchemas['v3_get_projects_api_v3_time_report_totals_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_time_report_totals_json'],
	},
	v3_get_projects_api_v3_time_report_type_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_report_type_json'],
		output:
			teamworkOutputSchemas['v3_get_projects_api_v3_time_report_type_json'],
	},
	v3_get_projects_api_v3_time_total_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_total_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_time_total_json'],
	},
	v3_get_projects_api_v3_time_validate_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_validate_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_time_validate_json'],
	},
	v3_delete_projects_api_v3_time_timelogid_json: {
		input:
			teamworkInputSchemas['v3_delete_projects_api_v3_time_timelogid_json'],
		output:
			teamworkOutputSchemas['v3_delete_projects_api_v3_time_timelogid_json'],
	},
	v3_get_projects_api_v3_time_timelogid_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_time_timelogid_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_time_timelogid_json'],
	},
	v3_patch_projects_api_v3_time_timelogid_json: {
		input: teamworkInputSchemas['v3_patch_projects_api_v3_time_timelogid_json'],
		output:
			teamworkOutputSchemas['v3_patch_projects_api_v3_time_timelogid_json'],
	},
	v3_put_projects_api_v3_time_timelogid_json: {
		input: teamworkInputSchemas['v3_put_projects_api_v3_time_timelogid_json'],
		output: teamworkOutputSchemas['v3_put_projects_api_v3_time_timelogid_json'],
	},
	v3_get_projects_api_v3_timers_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_timers_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_timers_json'],
	},
	v3_get_projects_api_v3_timers_timerid_json: {
		input: teamworkInputSchemas['v3_get_projects_api_v3_timers_timerid_json'],
		output: teamworkOutputSchemas['v3_get_projects_api_v3_timers_timerid_json'],
	},
} satisfies RequiredPluginEndpointSchemas<typeof teamworkEndpointsNested>;

const teamworkEndpointMeta = {
	v1_get_projects_json: {
		riskLevel: 'read',
		description: 'Retrieve All Projects',
	},
	v1_post_projects_json: { riskLevel: 'write', description: 'Create Project' },
	v1_get_projects_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single Project',
	},
	v1_put_projects_id_json: {
		riskLevel: 'write',
		description: 'Update Project',
	},
	v1_delete_projects_id_json: {
		riskLevel: 'destructive',
		description: 'Delete Project',
	},
	v1_post_projects_id_clone_json: {
		riskLevel: 'write',
		description: 'Copy a project',
	},
	v1_get_companies_id_projects_json: {
		riskLevel: 'read',
		description: 'Retrieve Projects assigned to a specific Company',
	},
	v1_get_projects_starred_json: {
		riskLevel: 'read',
		description: 'Retrieve your Starred Projects',
	},
	v1_get_projects_id_rates_json: {
		riskLevel: 'read',
		description: 'Get Project Rates',
	},
	v1_post_projects_id_rates_json: {
		riskLevel: 'write',
		description: 'Set Project Rates',
	},
	v1_get_projects_id_stats_json: {
		riskLevel: 'read',
		description: 'Get Project Stats',
	},
	v1_put_projects_id_star_json: {
		riskLevel: 'write',
		description: 'Star a Project',
	},
	v1_get_projectcategories_json: {
		riskLevel: 'read',
		description: 'Retrieving all of a Project Categories',
	},
	v1_post_projectcategories_json: {
		riskLevel: 'write',
		description: 'Creating Project Categories',
	},
	v1_get_projectcategories_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single Project Category',
	},
	v1_put_projectcategories_id_json: {
		riskLevel: 'write',
		description: 'Updating a Project Category',
	},
	v1_delete_projectcategories_id_json: {
		riskLevel: 'destructive',
		description: 'Deleting a Project Category',
	},
	v1_get_projectcategories_categoryid_tasks_json: {
		riskLevel: 'read',
		description: 'Retrieving Tasks associated with the Category',
	},
	v1_put_projects_projectid_json: {
		riskLevel: 'write',
		description: 'Setting a Project Owner',
	},
	v1_get_milestones_json: {
		riskLevel: 'read',
		description: 'List All Milestones',
	},
	v1_get_projects_id_milestones_json: {
		riskLevel: 'read',
		description: 'List Milestones on a Project',
	},
	v1_post_projects_id_milestones_json: {
		riskLevel: 'write',
		description: 'Create a Single Milestone',
	},
	v1_get_milestones_id_json: {
		riskLevel: 'read',
		description: 'Get a Single Milestone',
	},
	v1_put_milestones_id_json: {
		riskLevel: 'write',
		description: 'Update a Single Milestone',
	},
	v1_delete_milestones_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Milestone',
	},
	v1_put_milestones_id_complete_json: {
		riskLevel: 'write',
		description: 'Complete a Milestone',
	},
	v1_put_milestones_id_uncomplete_json: {
		riskLevel: 'write',
		description: 'Un-complete a Milestone',
	},
	v1_get_tasklists_json: {
		riskLevel: 'read',
		description: 'Get all Task Lists',
	},
	v1_get_projects_id_tasklists_json: {
		riskLevel: 'read',
		description: 'Get all Task Lists for a Project',
	},
	v1_post_projects_id_tasklists_json: {
		riskLevel: 'write',
		description: 'Create Task List',
	},
	v1_get_tasklists_id_json: {
		riskLevel: 'read',
		description: 'Retrieve Single Task List',
	},
	v1_put_tasklists_id_json: {
		riskLevel: 'write',
		description: 'Update Task List',
	},
	v1_delete_tasklists_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Task List',
	},
	v1_get_tasklists_templates_json: {
		riskLevel: 'read',
		description: 'Template Task Lists: get all template task lists',
	},
	v1_put_projects_id_tasklists_reorder_json: {
		riskLevel: 'write',
		description: 'Reorder Lists',
	},
	v1_put_tasklist_id_copy_json: {
		riskLevel: 'write',
		description: 'Copy a Task List, or Copy a Task List to another Project',
	},
	v1_put_tasklist_id_move_json: {
		riskLevel: 'write',
		description: 'Move a Task List to another Project',
	},
	v1_get_tasks_json: {
		riskLevel: 'read',
		description: 'Get all Tasks across all Projects',
	},
	v1_get_projects_id_tasks_json: {
		riskLevel: 'read',
		description: 'Get all Tasks on a given Project',
	},
	v1_post_projects_id_tasks_json: {
		riskLevel: 'write',
		description: 'Create a Task on a Project',
	},
	v1_get_tasklists_id_tasks_json: {
		riskLevel: 'read',
		description: 'Get all Tasks on a given Task List',
	},
	v1_post_tasklists_id_tasks_json: {
		riskLevel: 'write',
		description: 'Create a Task',
	},
	v1_get_tasks_id_json: { riskLevel: 'read', description: 'Retrieve a Task' },
	v1_post_tasks_id_json: {
		riskLevel: 'write',
		description: 'Create a Sub Task',
	},
	v1_get_tasks_id_dependencies_json: {
		riskLevel: 'read',
		description: 'Retrieve Task Dependencies',
	},
	v1_get_completedtasks_json: {
		riskLevel: 'read',
		description: 'Get completed Tasks',
	},
	v1_get_tasks_id_predecessors_json: {
		riskLevel: 'read',
		description: 'Get Task Predecessors',
	},
	v1_get_tasks_parenttaskid_subtasks_json: {
		riskLevel: 'read',
		description: 'Get Sub Tasks of a Task',
	},
	v1_get_tasks_taskid_recurring_json: {
		riskLevel: 'read',
		description: 'Get Recurring Tasks related to original Task.',
	},
	v1_post_tasks_id_quickadd_json: {
		riskLevel: 'write',
		description: 'Quickly add multiple Sub Tasks',
	},
	v1_post_projects_projectid_tasks_quickadd_json: {
		riskLevel: 'write',
		description: 'Quickly add multiple Tasks',
	},
	v1_put_tasks_id_complete_json: {
		riskLevel: 'write',
		description: 'Mark a Task complete',
	},
	v1_put_tasks_id_uncomplete_json: {
		riskLevel: 'write',
		description: 'Mark a Task uncomplete',
	},
	v1_put_tasklists_id_tasks_reorder_json: {
		riskLevel: 'write',
		description: 'Reorder the Tasks',
	},
	v1_put_tasks_taskid_move_json: {
		riskLevel: 'write',
		description: 'Move a Task from one Project to Another',
	},
	v1_put_tasks_taskid_copy_json: {
		riskLevel: 'write',
		description: 'Copy a Task from one Project to Another',
	},
	v1_get_tasks_id_reminders_json: {
		riskLevel: 'read',
		description: 'Get all Reminders on a Task',
	},
	v1_post_tasks_id_reminders_json: {
		riskLevel: 'destructive',
		description: 'Create a Reminder on a Task',
	},
	v1_put_taskreminders_id_json: {
		riskLevel: 'write',
		description: 'Update an Existing Reminder on a Task',
	},
	v1_delete_taskreminders_id_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing reminder on a Task',
	},
	v1_get_companies_json: {
		riskLevel: 'read',
		description: 'Retrieve Companies',
	},
	v1_post_companies_json: {
		riskLevel: 'write',
		description: 'Create A Company',
	},
	v1_get_projects_id_companies_json: {
		riskLevel: 'read',
		description: 'Retrieving Companies within a Project',
	},
	v1_get_companies_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single Company',
	},
	v1_put_companies_id_json: {
		riskLevel: 'write',
		description: 'Update A Company',
	},
	v1_delete_companies_id_json: {
		riskLevel: 'destructive',
		description: 'Delete A Company',
	},
	v1_get_people_json: { riskLevel: 'read', description: 'Get All People' },
	v1_post_people_json: {
		riskLevel: 'destructive',
		description: 'Creates a new User Account',
	},
	v1_get_calendarevents_eventid_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People for a Calendar Event',
	},
	v1_get_projects_projectid_messages_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People for a Message',
	},
	v1_get_projects_projectid_milestones_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People for a Milestone',
	},
	v1_get_projects_projectid_notebooks_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People for following a Notebook',
	},
	v1_get_projects_projectid_tasks_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People for a Task',
	},
	v1_get_projects_projectid_files_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People to notify when adding a File',
	},
	v1_get_projects_projectid_links_availablepeople_json: {
		riskLevel: 'read',
		description: 'Get available People to notify when adding a Link',
	},
	v1_get_projects_projectid_people_json: {
		riskLevel: 'read',
		description: 'Get all People (within a Project)',
	},
	v1_get_companies_id_people_json: {
		riskLevel: 'read',
		description: 'Get People (within a Company)',
	},
	v1_get_me_json: {
		riskLevel: 'read',
		description: 'Get Current User Details',
	},
	v1_get_stats_json: {
		riskLevel: 'read',
		description: 'Current User Summary Stats',
	},
	v1_get_people_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Specific Person',
	},
	v1_put_people_id_json: { riskLevel: 'write', description: 'Editing a User' },
	v1_delete_people_id_json: {
		riskLevel: 'destructive',
		description: 'Delete User',
	},
	v1_get_people_apikeys_json: {
		riskLevel: 'read',
		description: 'Retrieve all API Keys for all People on account',
	},
	v1_get_people_deleted_json: {
		riskLevel: 'read',
		description: 'Get all deleted People',
	},
	v1_get_statuses_json: {
		riskLevel: 'read',
		description: 'Retrieve all Statuses',
	},
	v1_get_people_id_status_json: {
		riskLevel: 'read',
		description: 'Retrieve a Persons Status',
	},
	v1_post_people_id_status_json: {
		riskLevel: 'write',
		description: 'Create a User Status',
	},
	v1_get_me_status_json: {
		riskLevel: 'read',
		description: 'Retrieve my Status',
	},
	v1_put_me_status_id_json: {
		riskLevel: 'write',
		description: 'Update my Status',
	},
	v1_put_people_personid_status_statusid_json: {
		riskLevel: 'write',
		description: 'Update User Status',
	},
	v1_delete_people_personid_status_statusid_json: {
		riskLevel: 'destructive',
		description: 'Delete a User Status',
	},
	v1_put_people_status_id_json: {
		riskLevel: 'write',
		description: 'Update Status',
	},
	v1_delete_people_status_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Status',
	},
	v1_delete_me_status_id_json: {
		riskLevel: 'destructive',
		description: 'Delete my Status',
	},
	v1_get_tasks_id_files_json: {
		riskLevel: 'read',
		description: 'List Files on a Task',
	},
	v1_post_tasks_id_files_json: {
		riskLevel: 'write',
		description: 'Add a File to a Task',
	},
	v1_get_projects_id_files_json: {
		riskLevel: 'read',
		description: 'List Files on a Project',
	},
	v1_post_projects_id_files_json: {
		riskLevel: 'write',
		description: 'Add a File to a Project',
	},
	v1_post_files_id_json: {
		riskLevel: 'write',
		description: 'Add a new File Version to a File',
	},
	v1_delete_files_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a File from a Project',
	},
	v1_get_files_id_sharedlink_json: {
		riskLevel: 'read',
		description: 'Get a short URL for sharing a File',
	},
	v1_put_files_id_copy_json: {
		riskLevel: 'write',
		description: 'Copy a File to another Project',
	},
	v1_get_projects_id_filecategories_json: {
		riskLevel: 'read',
		description: 'Retrieving all of a File Categories',
	},
	v1_post_projects_id_filecategories_json: {
		riskLevel: 'write',
		description: 'Creating File Categories',
	},
	v1_get_filecategories_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single File Category',
	},
	v1_put_filecategories_id_json: {
		riskLevel: 'write',
		description: 'Updating a File Category',
	},
	v1_delete_filecategories_id_json: {
		riskLevel: 'destructive',
		description: 'Deleting a File Category',
	},
	v1_get_notebooks_json: {
		riskLevel: 'read',
		description: 'List All Notebooks',
	},
	v1_get_projects_id_notebooks_json: {
		riskLevel: 'read',
		description: 'List Notebooks on a Project',
	},
	v1_post_projects_id_notebooks_json: {
		riskLevel: 'write',
		description: 'Create a Single Notebook',
	},
	v1_get_notebookcategories_id_notebooks_json: {
		riskLevel: 'read',
		description: 'List Notebooks in a Specific Category',
	},
	v1_get_notebooks_id_json: {
		riskLevel: 'read',
		description: 'Get a Single Notebook',
	},
	v1_put_notebooks_id_json: {
		riskLevel: 'write',
		description: 'Update a Single Notebook',
	},
	v1_delete_notebooks_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Single Notebook',
	},
	v1_put_notebooks_id_lock_json: {
		riskLevel: 'write',
		description: 'Lock a Single Notebook for Editing',
	},
	v1_put_notebooks_id_unlock_json: {
		riskLevel: 'write',
		description: 'Unlock a Single Notebook',
	},
	v1_put_notebooks_id_copy_json: {
		riskLevel: 'write',
		description: 'Copy a Notebook to another Project',
	},
	v1_put_notebooks_id_move_json: {
		riskLevel: 'write',
		description: 'Move a Notebook to another Project',
	},
	v1_get_projects_id_notebookcategories_json: {
		riskLevel: 'read',
		description: 'Retrieving all of a Notebook Categories',
	},
	v1_post_projects_id_notebookcategories_json: {
		riskLevel: 'write',
		description: 'Creating Notebook Categories',
	},
	v1_get_notebookcategories_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single Notebook Category',
	},
	v1_put_notebookcategories_id_json: {
		riskLevel: 'write',
		description: 'Updating a Notebook Category',
	},
	v1_delete_notebookcategories_id_json: {
		riskLevel: 'destructive',
		description: 'Deleting a Notebook Category',
	},
	v1_get_projects_id_links_json: {
		riskLevel: 'read',
		description: 'List Links on a Project',
	},
	v1_post_projects_id_links_json: {
		riskLevel: 'write',
		description: 'Create a Single Link',
	},
	v1_get_links_json: { riskLevel: 'read', description: 'List All Links' },
	v1_get_links_id_json: { riskLevel: 'read', description: 'Get a Single Link' },
	v1_put_links_id_json: {
		riskLevel: 'write',
		description: 'Update a Single Link',
	},
	v1_delete_links_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Single Link',
	},
	v1_get_projects_id_linkcategories_json: {
		riskLevel: 'read',
		description: 'Retrieving all of a Link Categories',
	},
	v1_post_projects_id_linkcategories_json: {
		riskLevel: 'write',
		description: 'Creating Link Categories',
	},
	v1_get_linkcategories_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a Single Link Category',
	},
	v1_delete_linkcategories_id_json: {
		riskLevel: 'destructive',
		description: 'Deleting a Link Category',
	},
	v1_get_time_entries_json: {
		riskLevel: 'read',
		description: 'Retrieve all Time Entries across all Projects',
	},
	v1_get_projects_id_time_entries_json: {
		riskLevel: 'read',
		description: 'Retrieve all Time Entries for a Project',
	},
	v1_post_projects_id_time_entries_json: {
		riskLevel: 'write',
		description: 'Create a Time-Entry',
	},
	v1_get_tasks_id_time_entries_json: {
		riskLevel: 'read',
		description: 'Retrieve all Task times',
	},
	v1_post_tasks_id_time_entries_json: {
		riskLevel: 'write',
		description: 'Create a Time-Entry (for a Task)',
	},
	v1_get_time_entries_id_json: {
		riskLevel: 'read',
		description: 'Retrieve single Time-Entry',
	},
	v1_put_time_entries_id_json: {
		riskLevel: 'write',
		description: 'Update a Time Entry',
	},
	v1_delete_time_entries_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Time-Entry',
	},
	v1_get_projects_id_time_total_json: {
		riskLevel: 'read',
		description: 'Time Totals on a Project',
	},
	v1_get_time_total_json: {
		riskLevel: 'read',
		description: 'Get Total Time across an Account',
	},
	v1_get_projects_time_total_json: {
		riskLevel: 'read',
		description: 'Time Totals across Projects',
	},
	v1_get_projects_estimatedtime_total_json: {
		riskLevel: 'read',
		description: 'Estimated Time Totals on Projects',
	},
	v1_get_tasklists_id_time_total_json: {
		riskLevel: 'read',
		description: 'Total Time on a Tasklist',
	},
	v1_get_tasks_id_time_total_json: {
		riskLevel: 'read',
		description: 'Total Time on a Task',
	},
	v1_get_people_id_loggedtime_json: {
		riskLevel: 'read',
		description: 'Get Logged Time by Person',
	},
	v1_get_timers_json: {
		riskLevel: 'read',
		description: 'Get all Running Timers',
	},
	v1_get_me_timers_json: {
		riskLevel: 'read',
		description: 'Get all your Running Timers',
	},
	v1_get_people_id_timers_json: {
		riskLevel: 'read',
		description: 'Get all Running Timers for a specific Person',
	},
	v1_put_tasks_id_estimatedtime_json: {
		riskLevel: 'write',
		description: 'Add a Time estimate to a Task',
	},
	v1_delete_comments_id_json: {
		riskLevel: 'destructive',
		description: 'Deleting a Comment',
	},
	v1_put_comments_id_json: {
		riskLevel: 'write',
		description: 'Updating a Comment',
	},
	v1_get_resource_resourceid_comments_json: {
		riskLevel: 'read',
		description: 'Retrieving Recent Comments',
	},
	v1_post_resource_resourceid_comments_json: {
		riskLevel: 'write',
		description: 'Creating a Comment',
	},
	v1_get_comments_json: {
		riskLevel: 'read',
		description: 'Retrieving Comments across all types',
	},
	v1_put_comments_id_markread_json: {
		riskLevel: 'write',
		description: 'Mark a Comment as Read',
	},
	v1_get_projects_id_boards_columns_json: {
		riskLevel: 'read',
		description: 'List Columns',
	},
	v1_post_projects_id_boards_columns_json: {
		riskLevel: 'write',
		description: 'Create a new Column',
	},
	v1_get_boards_columns_id_cards_json: {
		riskLevel: 'read',
		description: 'List Cards in a Column',
	},
	v1_put_boards_columns_cards_id_move_json: {
		riskLevel: 'write',
		description: 'Move a Card',
	},
	v1_put_boards_columns_cards_id_json: {
		riskLevel: 'write',
		description: 'Edit a Card',
	},
	v1_delete_boards_columns_cards_id_json: {
		riskLevel: 'destructive',
		description: 'Remove a Card',
	},
	v1_get_boards_columns_cards_id_json: {
		riskLevel: 'read',
		description: 'Get a Card ',
	},
	v1_delete_boards_columns_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Column',
	},
	v1_put_boards_columns_id_json: {
		riskLevel: 'write',
		description: 'Edit a Column',
	},
	v1_get_boards_columns_id_json: {
		riskLevel: 'read',
		description: 'Get a Column',
	},
	v1_get_portfolio_boards_json: {
		riskLevel: 'read',
		description: 'Boards in Portfolio View',
	},
	v1_post_portfolio_boards_json: {
		riskLevel: 'write',
		description: 'Create a new Board',
	},
	v1_put_portfolio_boards_boardid_json: {
		riskLevel: 'write',
		description: 'Edit a Board',
	},
	v1_delete_portfolio_boards_boardid_json: {
		riskLevel: 'destructive',
		description: 'Delete a board',
	},
	v1_get_portfolio_boards_boardid_columns_json: {
		riskLevel: 'read',
		description: 'Columns inside a Portfolio Board',
	},
	v1_post_portfolio_boards_boardid_columns_json: {
		riskLevel: 'write',
		description: 'Add a column to the given Board',
	},
	v1_get_portfolio_columns_columnid_cards_json: {
		riskLevel: 'read',
		description: 'Get Cards inside a Portfolio Column',
	},
	v1_post_portfolio_columns_columnid_cards_json: {
		riskLevel: 'write',
		description: 'Adding a Project to a Column from Backlog',
	},
	v1_get_portfolio_cards_cardid_json: {
		riskLevel: 'read',
		description: 'Get a specific Card inside a Column',
	},
	v1_delete_portfolio_cards_cardid_json: {
		riskLevel: 'destructive',
		description: 'Delete a Card in a Portfolio Column',
	},
	v1_put_portfolio_cards_cardid_move_json: {
		riskLevel: 'write',
		description: 'Move Projects on a Portfolio Board',
	},
	v1_delete_portfolio_columns_columnid_json: {
		riskLevel: 'destructive',
		description: 'Delete a Portfolio Column',
	},
	v1_get_portfolio_columns_columnid_json: {
		riskLevel: 'read',
		description: 'Get a Portfolio Column',
	},
	v1_get_projects_projectid_updates_json: {
		riskLevel: 'read',
		description: 'Get Project Updates',
	},
	v1_get_projects_projectid_update_json: {
		riskLevel: 'read',
		description: 'Get most recent Update',
	},
	v1_post_projects_projectid_update_json: {
		riskLevel: 'destructive',
		description: 'Create a Project Update',
	},
	v1_put_projects_updates_updateid_json: {
		riskLevel: 'write',
		description: 'Modify a Project Update',
	},
	v1_delete_projects_updates_updateid_json: {
		riskLevel: 'destructive',
		description: 'Delete a Project Update',
	},
	v1_put_projects_projectid_update_request_json: {
		riskLevel: 'destructive',
		description: 'Requesting a Project Update from a Project Owner',
	},
	v1_post_projects_projectid_people_personid_json: {
		riskLevel: 'write',
		description: 'Add a New User to a Project',
	},
	v1_put_projects_projectid_people_personid_json: {
		riskLevel: 'destructive',
		description: 'Remove a User from a Project',
	},
	v1_get_projects_projectid_people_personid_json: {
		riskLevel: 'read',
		description: 'Get a Users Permissions on a Project',
	},
	v1_get_projects_id_roles_json: {
		riskLevel: 'read',
		description: 'List Roles on a Project',
	},
	v1_get_roles_id_json: {
		riskLevel: 'read',
		description: 'Get an Individual Role',
	},
	v1_put_roles_id_json: {
		riskLevel: 'write',
		description: 'Update a Role on a Project',
	},
	v1_delete_roles_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a Role',
	},
	v1_get_comments_commentid_reactions_json: {
		riskLevel: 'read',
		description: 'Get Reactions on a specific Comment',
	},
	v1_get_projects_updates_updateid_reactions_json: {
		riskLevel: 'read',
		description: 'Get Reactions to a Project Update',
	},
	v1_put_comments_commentid_react_json: {
		riskLevel: 'write',
		description: 'React to a Comment',
	},
	v1_put_projects_updates_updateid_react_json: {
		riskLevel: 'write',
		description: 'React to a Project Update',
	},
	v1_put_resource_id_unreact_json: {
		riskLevel: 'write',
		description: 'Unreacting to a Comment/Message/ProjectUpdate',
	},
	v1_post_projects_template_json: {
		riskLevel: 'write',
		description: 'Create a Project Template',
	},
	v1_get_teams_json: { riskLevel: 'read', description: 'Get All Teams' },
	v1_post_teams_json: { riskLevel: 'write', description: 'Creates a new Team' },
	v1_delete_teams_json: {
		riskLevel: 'destructive',
		description: 'Delete teams in bulk',
	},
	v1_get_teams_id_json: {
		riskLevel: 'read',
		description: "Returns a single team identified by it's ID",
	},
	v1_put_teams_id_json: { riskLevel: 'write', description: 'Updates a team' },
	v1_delete_teams_id_json: {
		riskLevel: 'destructive',
		description: 'Delete a team by id',
	},
	v1_put_teams_id_people_json: {
		riskLevel: 'destructive',
		description: 'Add or replace members of a team',
	},
	v1_get_projects_id_teams_json: {
		riskLevel: 'read',
		description: "Get a project's teams",
	},
	v1_post_projects_id_teams_json: {
		riskLevel: 'write',
		description: 'Creates a new Project-Specific Team',
	},
	v1_get_companies_id_teams_json: {
		riskLevel: 'read',
		description: 'Get Teams for company id',
	},
	v1_get_milestones_id_teams_json: {
		riskLevel: 'read',
		description: "Get a milestone's teams",
	},
	v1_get_notebooks_id_teams_json: {
		riskLevel: 'read',
		description: "Get a notebook's teams",
	},
	v1_get_tasks_id_teams_json: {
		riskLevel: 'read',
		description: "Get a task's teams",
	},
	v1_get_files_id_teams_json: {
		riskLevel: 'read',
		description: "Get a file's teams",
	},
	v1_get_tasklists_id_teams_json: {
		riskLevel: 'read',
		description: "Get a tasklist's teams",
	},
	v1_get_links_id_teams_json: {
		riskLevel: 'read',
		description: "Get a link's teams",
	},
	v1_get_portfolio_boards_id_teams_json: {
		riskLevel: 'read',
		description: "Get a portfolio board's teams",
	},
	v1_get_comments_id_teams_json: {
		riskLevel: 'read',
		description: "Get a comment's teams",
	},
	v1_get_teams_id_subteams_json: {
		riskLevel: 'read',
		description: "Get a team's subteams",
	},
	v1_get_people_id_teams_json: {
		riskLevel: 'read',
		description: "Get a person's teams",
	},
	v1_get_milestones_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a milestone's teams",
	},
	v1_get_notebooks_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a notebook's teams",
	},
	v1_get_tasks_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a task's teams",
	},
	v1_get_files_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a file's teams",
	},
	v1_get_tasklists_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a tasklist's teams",
	},
	v1_get_links_id_comments_teams_json: {
		riskLevel: 'read',
		description: "Get a link's teams",
	},
	v1_get_teams_users_json: {
		riskLevel: 'read',
		description: 'Get all user ids for all teams',
	},
	v2_get_projects_api_v2_projects_templates_json: {
		riskLevel: 'read',
		description: 'Get Project Templates',
	},
	v2_get_projects_api_v2_projects_id_predecessors_json: {
		riskLevel: 'read',
		description:
			'Retrieve all Task Predecessors/Dependencies on a given Project',
	},
	v2_get_projects_api_v2_tasklists_id_taskids_json: {
		riskLevel: 'read',
		description: 'Get all Task IDs on a given Task List',
	},
	v2_get_projects_api_v2_projects_id_taskids_json: {
		riskLevel: 'read',
		description: 'Get all Tasks IDs on a given Project',
	},
	v2_get_projects_api_v2_projects_json: {
		riskLevel: 'read',
		description: 'Get Custom Fields on projects',
	},
	v2_get_projects_api_v2_tasks_json: {
		riskLevel: 'read',
		description: 'Get Custom Fields on tasks',
	},
	v2_get_projects_api_v2_tasks_taskid_json: {
		riskLevel: 'read',
		description: 'Get Custom Fields on a task',
	},
	v2_get_projects_api_v2_projects_projectid_json: {
		riskLevel: 'read',
		description: 'Get Custom Fields on a project',
	},
	v3_get_projects_api_v3_allocations_allocationid_time_json: {
		riskLevel: 'read',
		description: 'Get time entries for a specific allocation',
	},
	v3_get_projects_api_v3_comments_json: {
		riskLevel: 'read',
		description: 'Get a list of comments',
	},
	v3_post_projects_api_v3_comments_json: {
		riskLevel: 'write',
		description: 'Create a comment',
	},
	v3_get_projects_api_v3_comments_id_json: {
		riskLevel: 'read',
		description: 'Retrieve a specific comment',
	},
	v3_get_projects_api_v3_comments_id_notified_json: {
		riskLevel: 'read',
		description: 'List users notified for a comment',
	},
	v3_get_projects_api_v3_companies_json: {
		riskLevel: 'read',
		description: 'Get all companies.',
	},
	v3_post_projects_api_v3_companies_json: {
		riskLevel: 'write',
		description: 'Create a company.',
	},
	v3_delete_projects_api_v3_companies_domains_id_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing company domain.',
	},
	v3_patch_projects_api_v3_companies_domains_id_json: {
		riskLevel: 'write',
		description: 'Update an existing company domain.',
	},
	v3_get_projects_api_v3_companies_time_json: {
		riskLevel: 'read',
		description: 'Get all time entries, grouped by company ID',
	},
	v3_delete_projects_api_v3_companies_companyid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing company.',
	},
	v3_get_projects_api_v3_companies_companyid_json: {
		riskLevel: 'read',
		description: 'Get a specific company.',
	},
	v3_patch_projects_api_v3_companies_companyid_json: {
		riskLevel: 'write',
		description: 'Update an existing company.',
	},
	v3_patch_projects_api_v3_companies_companyid_rates_json: {
		riskLevel: 'write',
		description: 'Set client rates for a company.',
	},
	v3_post_projects_api_v3_companies_id_convert_currency_json: {
		riskLevel: 'destructive',
		description: "Convert a company's currency",
	},
	v3_post_projects_api_v3_companies_id_domains_json: {
		riskLevel: 'write',
		description: 'Create a new company domains.',
	},
	v3_get_projects_api_v3_files_fileid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific file.',
	},
	v3_get_projects_api_v3_links_linkid_comments_json: {
		riskLevel: 'read',
		description: 'Get a list of comments for a link item',
	},
	v3_post_projects_api_v3_links_linkid_comments_json: {
		riskLevel: 'write',
		description: 'Create a comment on a link item.',
	},
	v3_get_projects_api_v3_links_linkid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific link item.',
	},
	v3_get_projects_api_v3_me_json: {
		riskLevel: 'read',
		description: 'Get logged user information',
	},
	v3_get_projects_api_v3_me_personaltasks_json: {
		riskLevel: 'read',
		description: "Get the current user's personal tasks.",
	},
	v3_post_projects_api_v3_me_personaltasks_json: {
		riskLevel: 'write',
		description: 'Creates a personal task.',
	},
	v3_get_projects_api_v3_me_personaltasks_id_json: {
		riskLevel: 'read',
		description: 'Get a specific personal task.',
	},
	v3_get_projects_api_v3_me_timers_json: {
		riskLevel: 'read',
		description: 'Get all your running timers',
	},
	v3_post_projects_api_v3_me_timers_json: {
		riskLevel: 'write',
		description: 'Create a new timer',
	},
	v3_delete_projects_api_v3_me_timers_timerid_json: {
		riskLevel: 'destructive',
		description: 'Delete a timer by ID',
	},
	v3_put_projects_api_v3_me_timers_timerid_json: {
		riskLevel: 'write',
		description: 'Edits a timer',
	},
	v3_put_projects_api_v3_me_timers_timerid_complete_json: {
		riskLevel: 'write',
		description: 'Complete a timer by ID',
	},
	v3_put_projects_api_v3_me_timers_timerid_pause_json: {
		riskLevel: 'write',
		description: 'Pause a timer by ID',
	},
	v3_put_projects_api_v3_me_timers_timerid_resume_json: {
		riskLevel: 'write',
		description: 'Resume a timer by ID',
	},
	v3_put_projects_api_v3_me_timers_timerid_undelete_json: {
		riskLevel: 'write',
		description: 'Restore a deleted timer item.',
	},
	v3_get_projects_api_v3_milestones_json: {
		riskLevel: 'read',
		description: 'Get all milestones',
	},
	v3_get_projects_api_v3_milestones_metrics_deadlines_json: {
		riskLevel: 'read',
		description: 'Get milestones by due date in a time range',
	},
	v3_get_projects_api_v3_milestones_milestoneid_json: {
		riskLevel: 'read',
		description: 'Get a milestone by id.',
	},
	v3_get_projects_api_v3_milestones_milestoneid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific milestone.',
	},
	v3_get_projects_api_v3_notebooks_json: {
		riskLevel: 'read',
		description: 'Get a list of notebooks.',
	},
	v3_delete_projects_api_v3_notebooks_notebookid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing notebook.',
	},
	v3_get_projects_api_v3_notebooks_notebookid_json: {
		riskLevel: 'read',
		description: 'Get a specific notebook.',
	},
	v3_patch_projects_api_v3_notebooks_notebookid_json: {
		riskLevel: 'write',
		description: 'Edits a notebook',
	},
	v3_get_projects_api_v3_notebooks_notebookid_compare_json: {
		riskLevel: 'read',
		description: 'Compare 2 notebook versions',
	},
	v3_get_projects_api_v3_notebooks_notebookid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific notebook.',
	},
	v3_delete_projects_api_v3_notebooks_notebookid_versions_json: {
		riskLevel: 'destructive',
		description: 'Delete notebook versions.',
	},
	v3_get_projects_api_v3_notebooks_notebookid_versions_json: {
		riskLevel: 'read',
		description: 'Get notebook versions',
	},
	v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json: {
		riskLevel: 'read',
		description: 'Get a notebook version',
	},
	v3_get_projects_api_v3_people_json: {
		riskLevel: 'read',
		description: 'Returns a list of people',
	},
	v3_get_projects_api_v3_people_metrics_performance_json: {
		riskLevel: 'read',
		description: 'Performance of users completing the most tasks',
	},
	v3_get_projects_api_v3_people_utilization_json: {
		riskLevel: 'read',
		description: 'Return the user utilization.',
	},
	v3_delete_projects_api_v3_people_personid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing person.',
	},
	v3_get_projects_api_v3_people_personid_json: {
		riskLevel: 'read',
		description: 'Returns a person',
	},
	v3_get_projects_api_v3_projects_json: {
		riskLevel: 'read',
		description: 'Returns a list of projects',
	},
	v3_get_projects_api_v3_projects_metrics_active_json: {
		riskLevel: 'read',
		description: 'Get the total count of active projects',
	},
	v3_get_projects_api_v3_projects_metrics_billable_json: {
		riskLevel: 'read',
		description: 'Get the total billable time per project',
	},
	v3_get_projects_api_v3_projects_metrics_healths_json: {
		riskLevel: 'read',
		description: 'Get a health summary for all projects',
	},
	v3_get_projects_api_v3_projects_metrics_invoices_json: {
		riskLevel: 'read',
		description: 'Return open invoices across all projects',
	},
	v3_get_projects_api_v3_projects_metrics_owners_json: {
		riskLevel: 'read',
		description: 'Get number of owned and un-assigned projects',
	},
	v3_get_projects_api_v3_projects_metrics_unbilled_json: {
		riskLevel: 'read',
		description: 'Return un-billed expenses across all projects',
	},
	v3_get_projects_api_v3_projects_number_json: {
		riskLevel: 'read',
		description: 'Get the project number settings',
	},
	v3_put_projects_api_v3_projects_number_json: {
		riskLevel: 'write',
		description: 'Set the project number settings',
	},
	v3_put_projects_api_v3_projects_people_userid_enqueue_json: {
		riskLevel: 'write',
		description: 'Bulk applies a user to many projects',
	},
	v3_get_projects_api_v3_projects_starred_json: {
		riskLevel: 'read',
		description: 'Returns a list of starred projects',
	},
	v3_get_projects_api_v3_projects_teamwork_samples_json: {
		riskLevel: 'read',
		description: 'Returns a list of teamwork sample projects',
	},
	v3_get_projects_api_v3_projects_templates_json: {
		riskLevel: 'read',
		description: 'Returns a list of projects templates',
	},
	v3_get_projects_api_v3_projects_templates_id_json: {
		riskLevel: 'read',
		description: 'Returns a project template',
	},
	v3_get_projects_api_v3_projects_templates_id_customfields_required_json: {
		riskLevel: 'read',
		description: 'Get required custom fields for a project template',
	},
	v3_put_projects_api_v3_projects_tentative_projectid_convert_json: {
		riskLevel: 'write',
		description: 'Converts the given tentative project into normal',
	},
	v3_get_projects_api_v3_projects_updates_json: {
		riskLevel: 'read',
		description: 'Get all project updates',
	},
	v3_get_projects_api_v3_projects_projectids_updates_json: {
		riskLevel: 'read',
		description: 'Get all updates from a specific project',
	},
	v3_get_projects_api_v3_projects_projectid_json: {
		riskLevel: 'read',
		description: 'Returns a project',
	},
	v3_get_projects_api_v3_projects_projectid_featureorder_json: {
		riskLevel: 'read',
		description: 'Returns a project features order to display in tab',
	},
	v3_put_projects_api_v3_projects_projectid_featureorder_json: {
		riskLevel: 'write',
		description: 'Sets the the features order to display in tab',
	},
	v3_get_projects_api_v3_projects_projectid_milestones_json: {
		riskLevel: 'read',
		description: 'Get milestones in a project',
	},
	v3_post_projects_api_v3_projects_projectid_notebooks_json: {
		riskLevel: 'write',
		description: 'Create a new notebook.',
	},
	v3_get_projects_api_v3_projects_projectid_people_json: {
		riskLevel: 'read',
		description: 'Returns a list of people on a project',
	},
	v3_put_projects_api_v3_projects_projectid_people_json: {
		riskLevel: 'write',
		description: 'Add people to a project',
	},
	v3_get_projects_api_v3_projects_projectid_people_personid_json: {
		riskLevel: 'read',
		description: 'Returns a person on a project',
	},
	v3_get_projects_api_v3_projects_projectid_tasklists_json: {
		riskLevel: 'read',
		description: 'Get tasklists in a project',
	},
	v3_get_projects_api_v3_projects_projectid_tasks_json: {
		riskLevel: 'read',
		description: "Get a specific project's tasks.",
	},
	v3_get_projects_api_v3_projects_projectid_time_json: {
		riskLevel: 'read',
		description: 'Get time entries for a specific project',
	},
	v3_post_projects_api_v3_projects_projectid_time_json: {
		riskLevel: 'write',
		description: 'Create a time entry in a specific project.',
	},
	v3_get_projects_api_v3_projects_projectid_time_total_json: {
		riskLevel: 'read',
		description: 'Get timelog totals for a specific project.',
	},
	v3_get_projects_api_v3_reporting_dashboards_data_milestones_json: {
		riskLevel: 'read',
		description: 'Get milestone chart data.',
	},
	v3_get_projects_api_v3_reporting_dashboards_details_milestones_json: {
		riskLevel: 'read',
		description: 'Get milestone details.',
	},
	v3_get_projects_api_v3_reporting_precanned_companytime_json: {
		riskLevel: 'read',
		description: 'Get all time entries, grouped by company ID',
	},
	v3_get_projects_api_v3_reporting_precanned_tasktime_json: {
		riskLevel: 'read',
		description: 'Generate a precanned task time report.',
	},
	v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json: {
		riskLevel: 'read',
		description: 'Returns task completions for all users',
	},
	v3_get_projects_api_v3_statuses_json: {
		riskLevel: 'read',
		description: 'Get all statuses',
	},
	v3_get_projects_api_v3_statuses_timeline_json: {
		riskLevel: 'read',
		description: 'Get the people statuses timeline.',
	},
	v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		riskLevel: 'read',
		description: "Get a specific taskgroup's tasks.",
	},
	v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		riskLevel: 'write',
		description: 'Creates a task in a taskgroup.',
	},
	v3_get_projects_api_v3_tasklists_json: {
		riskLevel: 'read',
		description: 'Get all tasklists',
	},
	v3_get_projects_api_v3_tasklists_templates_json: {
		riskLevel: 'read',
		description: 'Get all tasklist templates',
	},
	v3_delete_projects_api_v3_tasklists_tasklistid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing tasklist.',
	},
	v3_get_projects_api_v3_tasklists_tasklistid_json: {
		riskLevel: 'read',
		description: 'Get specific tasklist',
	},
	v3_get_projects_api_v3_tasklists_tasklistid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific tasklist.',
	},
	v3_get_projects_api_v3_tasklists_tasklistid_tasks_json: {
		riskLevel: 'read',
		description: "Get a specific tasklist's tasks.",
	},
	v3_post_projects_api_v3_tasklists_tasklistid_tasks_json: {
		riskLevel: 'write',
		description: 'Creates a task.',
	},
	v3_get_projects_api_v3_tasklists_tasklistid_time_total_json: {
		riskLevel: 'read',
		description: 'Get timelog totals for a specific task.',
	},
	v3_get_projects_api_v3_tasks_json: {
		riskLevel: 'read',
		description: 'Get all tasks.',
	},
	v3_get_projects_api_v3_tasks_metrics_complete_json: {
		riskLevel: 'read',
		description: 'Total count of completed tasks',
	},
	v3_get_projects_api_v3_tasks_metrics_late_json: {
		riskLevel: 'read',
		description: 'Get total count of late tasks',
	},
	v3_get_projects_api_v3_tasks_id_reminders_json: {
		riskLevel: 'read',
		description: 'Gets task reminders',
	},
	v3_delete_projects_api_v3_tasks_taskid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing task.',
	},
	v3_get_projects_api_v3_tasks_taskid_json: {
		riskLevel: 'read',
		description: 'Get a specific task.',
	},
	v3_patch_projects_api_v3_tasks_taskid_json: {
		riskLevel: 'write',
		description: 'Update an existing task.',
	},
	v3_put_projects_api_v3_tasks_taskid_json: {
		riskLevel: 'write',
		description: 'Update an existing task.',
	},
	v3_get_projects_api_v3_tasks_taskid_project_json: {
		riskLevel: 'read',
		description: 'Get the parent project for a specific task.',
	},
	v3_post_projects_api_v3_tasks_taskid_reminders_json: {
		riskLevel: 'destructive',
		description: 'Add task reminder',
	},
	v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		riskLevel: 'destructive',
		description: 'Delete task reminder',
	},
	v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		riskLevel: 'write',
		description: 'Update task reminder',
	},
	v3_get_projects_api_v3_tasks_taskid_subtasks_json: {
		riskLevel: 'read',
		description: 'Get all subtasks for a specific task.',
	},
	v3_post_projects_api_v3_tasks_taskid_subtasks_json: {
		riskLevel: 'write',
		description: 'Creates a subtask.',
	},
	v3_get_projects_api_v3_tasks_taskid_time_json: {
		riskLevel: 'read',
		description: 'Get time entries for a specific task',
	},
	v3_post_projects_api_v3_tasks_taskid_time_json: {
		riskLevel: 'write',
		description: 'Create a time entry linked to a specific task.',
	},
	v3_get_projects_api_v3_tasks_taskid_time_total_json: {
		riskLevel: 'read',
		description: 'Get timelog totals for a specific task.',
	},
	v3_get_projects_api_v3_time_json: {
		riskLevel: 'read',
		description: 'Get all time entries',
	},
	v3_get_projects_api_v3_time_report_json: {
		riskLevel: 'read',
		description: 'Get time report',
	},
	v3_get_projects_api_v3_time_report_totals_json: {
		riskLevel: 'read',
		description: 'Get time report totals',
	},
	v3_get_projects_api_v3_time_report_type_json: {
		riskLevel: 'read',
		description: 'Get time report by type',
	},
	v3_get_projects_api_v3_time_total_json: {
		riskLevel: 'read',
		description: 'Get timelog totals.',
	},
	v3_get_projects_api_v3_time_validate_json: {
		riskLevel: 'read',
		description: 'Validate if a timelog can be created',
	},
	v3_delete_projects_api_v3_time_timelogid_json: {
		riskLevel: 'destructive',
		description: 'Delete an existing timelog.',
	},
	v3_get_projects_api_v3_time_timelogid_json: {
		riskLevel: 'read',
		description: 'Get a specific time entry',
	},
	v3_patch_projects_api_v3_time_timelogid_json: {
		riskLevel: 'write',
		description: 'Update an existing time entry.',
	},
	v3_put_projects_api_v3_time_timelogid_json: {
		riskLevel: 'write',
		description: 'Update an existing time entry.',
	},
	v3_get_projects_api_v3_timers_json: {
		riskLevel: 'read',
		description: 'Get all running timers',
	},
	v3_get_projects_api_v3_timers_timerid_json: {
		riskLevel: 'read',
		description: 'Get a specific timer',
	},
} satisfies RequiredPluginEndpointMeta<typeof teamworkEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseTeamworkPlugin<T extends TeamworkPluginOptions> = CorsairPlugin<
	'teamwork',
	typeof TeamworkSchema,
	typeof teamworkEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof teamworkAuthConfig
>;

export type InternalTeamworkPlugin = BaseTeamworkPlugin<TeamworkPluginOptions>;
export type ExternalTeamworkPlugin<T extends TeamworkPluginOptions> =
	BaseTeamworkPlugin<T>;

export function teamwork<const T extends TeamworkPluginOptions>(
	incomingOptions: TeamworkPluginOptions & T = {} as TeamworkPluginOptions & T,
): ExternalTeamworkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teamwork',
		authConfig: teamworkAuthConfig,
		schema: TeamworkSchema,
		options,
		hooks: options.hooks,
		endpoints: teamworkOperationsNested,
		webhooks: {},
		endpointMeta: teamworkEndpointMeta,
		endpointSchemas: teamworkEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TeamworkKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) return options.key;
			if (!ctx.keys) throw new AuthMissingError('teamwork', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('teamwork', 'api_key');
			return apiKey;
		},
	} satisfies InternalTeamworkPlugin;
}

export { TeamworkSchema };
export type { TeamworkEndpointInputs, TeamworkEndpointOutputs };
export { teamworkInputSchemas, teamworkOutputSchemas };
export type {
	TeamworkEndpointInput,
	TeamworkEndpointOutput,
	TeamworkOperationId,
} from './endpoints/operation-types';
export { teamworkOperations } from './endpoints/types';
