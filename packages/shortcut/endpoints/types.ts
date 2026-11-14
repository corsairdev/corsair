import { z } from 'zod';

// Schemas are generated from Shortcut's official OpenAPI 3.0 specification.
// Source: https://developer.shortcut.com/api/rest/v3/shortcut.openapi.json
export const ShortcutBaseTaskParams = z
	.object({
		description: z.string(),
		complete: z.boolean().optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutBasicWorkspaceInfo = z
	.object({
		id: z.string(),
		created_at: z.string(),
		default_workflow_id: z.number().int(),
		estimate_scale: z.array(z.number().int()),
		name: z.string(),
		url_slug: z.string(),
		utc_offset: z.string(),
		korey_enabled: z.boolean().optional(),
	})
	.strict();

export const ShortcutBranch = z
	.object({
		entity_type: z.string(),
		deleted: z.boolean(),
		name: z.string(),
		persistent: z.boolean(),
		updated_at: z.string().nullable(),
		pull_requests: z.array(z.lazy(() => ShortcutPullRequest)),
		merged_branch_ids: z.array(z.number().int()),
		id: z.number().int().nullable(),
		url: z.string(),
		repository_id: z.number().int(),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutCategory = z
	.object({
		archived: z.boolean(),
		entity_type: z.string(),
		color: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		type: z.string(),
		updated_at: z.string(),
		external_id: z.string().nullable(),
		id: z.number().int(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutCommit = z
	.object({
		entity_type: z.string(),
		author_id: z.string().nullable(),
		hash: z.string(),
		updated_at: z.string().nullable(),
		id: z.number().int().nullable(),
		url: z.string(),
		author_email: z.string(),
		timestamp: z.string(),
		author_identity: z.lazy(() => ShortcutIdentity),
		repository_id: z.number().int().nullable(),
		created_at: z.string(),
		message: z.string(),
	})
	.strict();

export const ShortcutCreateCategory = z
	.object({
		name: z.string(),
		color: z.string().optional(),
		external_id: z.string().optional(),
		type: z
			.unknown() /* unknown because OpenAPI leaves this value unconstrained. */
			.optional(),
	})
	.strict();

export const ShortcutCreateCategoryParams = z
	.object({
		name: z.string(),
		color: z.string().optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutCreateCommentComment = z
	.object({
		text: z.string(),
		author_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutCreateDoc = z
	.object({
		title: z.string(),
		content: z.string(),
		content_format: z.enum(['markdown', 'html']).optional(),
	})
	.strict();

export const ShortcutCreateEntityTemplate = z
	.object({
		name: z.string(),
		author_id: z.string().optional(),
		story_contents: z.lazy(() => ShortcutCreateStoryContents),
	})
	.strict();

export const ShortcutCreateEpic = z
	.object({
		description: z.string().optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		completed_at_override: z.string().optional(),
		objective_ids: z.array(z.number().int()).optional(),
		name: z.string(),
		planned_start_date: z.string().nullable().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		milestone_id: z.number().int().nullable().optional(),
		requested_by_id: z.string().optional(),
		size: z.enum(['small', 'xlarge', 'medium', 'large']).nullable().optional(),
		epic_state_id: z.number().int().optional(),
		started_at_override: z.string().optional(),
		group_id: z.string().nullable().optional(),
		updated_at: z.string().optional(),
		follower_ids: z.array(z.string()).optional(),
		group_ids: z.array(z.string()).optional(),
		converted_from_story_id: z.number().int().nullable().optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		deadline: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.strict();

export const ShortcutCreateEpicComment = z
	.object({
		text: z.string(),
		author_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutCreateEpicHealth = z
	.object({
		status: z.enum(['At Risk', 'On Track', 'Off Track', 'No Health']),
		text: z.string().optional(),
	})
	.strict();

export const ShortcutCreateGenericIntegration = z
	.object({ webhook_url: z.string(), secret: z.string().optional() })
	.strict();

export const ShortcutCreateGroup = z
	.object({
		description: z.string().optional(),
		card_aging_mode: z
			.enum(['off', 'gradual', 'immediate'])
			.nullable()
			.optional(),
		color: z.string().optional(),
		card_aging_threshold_days: z.number().int().nullable().optional(),
		display_icon_id: z.string().optional(),
		mention_name: z.string(),
		name: z.string(),
		color_key: z
			.enum([
				'blue',
				'purple',
				'midnight-blue',
				'orange',
				'yellow-green',
				'brass',
				'gray',
				'fuchsia',
				'yellow',
				'pink',
				'sky-blue',
				'green',
				'red',
				'black',
				'slate',
				'turquoise',
			])
			.optional(),
		member_ids: z.array(z.string()).optional(),
		workflow_ids: z.array(z.number().int()).optional(),
	})
	.strict();

export const ShortcutCreateIteration = z
	.object({
		follower_ids: z.array(z.string()).optional(),
		group_ids: z.array(z.string()).optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		description: z.string().optional(),
		name: z.string(),
		start_date: z.string(),
		end_date: z.string(),
	})
	.strict();

export const ShortcutCreateLabelParams = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		color: z.string().optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutCreateLinkedFile = z
	.object({
		description: z.string().optional(),
		story_id: z.number().int().optional(),
		name: z.string(),
		thumbnail_url: z.string().optional(),
		type: z.enum(['google', 'url', 'dropbox', 'box', 'onedrive']),
		size: z.number().int().optional(),
		uploader_id: z.string().optional(),
		content_type: z.string().optional(),
		url: z.string(),
	})
	.strict();

export const ShortcutCreateMilestone = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		started_at_override: z.string().optional(),
		completed_at_override: z.string().optional(),
		categories: z.array(z.lazy(() => ShortcutCreateCategoryParams)).optional(),
	})
	.strict();

export const ShortcutCreateObjective = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		started_at_override: z.string().optional(),
		completed_at_override: z.string().optional(),
		categories: z.array(z.lazy(() => ShortcutCreateCategoryParams)).optional(),
	})
	.strict();

export const ShortcutCreateObjectiveHealth = z
	.object({
		status: z.enum(['At Risk', 'On Track', 'Off Track', 'No Health']),
		text: z.string().optional(),
	})
	.strict();

export const ShortcutCreateOrDeleteStoryReaction = z
	.object({ emoji: z.string() })
	.strict();

export const ShortcutCreateProject = z
	.object({
		description: z.string().optional(),
		color: z.string().optional(),
		name: z.string(),
		start_time: z.string().optional(),
		updated_at: z.string().optional(),
		follower_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		team_id: z.number().int(),
		iteration_length: z.number().int().optional(),
		abbreviation: z.string().optional(),
		created_at: z.string().optional(),
	})
	.strict();

export const ShortcutCreateStories = z
	.object({ stories: z.array(z.lazy(() => ShortcutCreateStoryParams)) })
	.strict();

export const ShortcutCreateStoryComment = z
	.object({
		text: z.string(),
		author_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		external_id: z.string().optional(),
		parent_id: z.number().int().nullable().optional(),
	})
	.strict();

export const ShortcutCreateStoryCommentParams = z
	.object({
		text: z.string(),
		author_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		external_id: z.string().optional(),
		parent_id: z.number().int().nullable().optional(),
	})
	.strict();

export const ShortcutCreateStoryContents = z
	.object({
		description: z.string().optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		story_type: z.string().optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		file_ids: z.array(z.number().int()).optional(),
		name: z.string().optional(),
		epic_id: z.number().int().nullable().optional(),
		external_links: z.array(z.string()).optional(),
		sub_tasks: z.array(z.lazy(() => ShortcutCreateSubTaskParams)).optional(),
		iteration_id: z.number().int().nullable().optional(),
		tasks: z.array(z.lazy(() => ShortcutBaseTaskParams)).optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().nullable().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		estimate: z.number().int().nullable().optional(),
		project_id: z.number().int().optional(),
		linked_file_ids: z.array(z.number().int()).optional(),
		deadline: z.string().nullable().optional(),
	})
	.strict();

export const ShortcutCreateStoryFromTemplateParams = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		story_links: z
			.array(z.lazy(() => ShortcutCreateStoryLinkParams))
			.optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		external_links_add: z.array(z.string()).optional(),
		story_type: z.enum(['feature', 'chore', 'bug']).optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		move_to: z.enum(['last', 'first']).optional(),
		file_ids: z.array(z.number().int()).optional(),
		source_task_id: z.number().int().nullable().optional(),
		completed_at_override: z.string().optional(),
		name: z.string().optional(),
		file_ids_add: z.array(z.number().int()).optional(),
		file_ids_remove: z.array(z.number().int()).optional(),
		comments: z
			.array(z.lazy(() => ShortcutCreateStoryCommentParams))
			.optional(),
		follower_ids_add: z.array(z.string()).optional(),
		epic_id: z.number().int().nullable().optional(),
		story_template_id: z.string(),
		external_links: z.array(z.string()).optional(),
		follower_ids_remove: z.array(z.string()).optional(),
		sub_tasks: z
			.array(
				z.union([
					z.lazy(() => ShortcutLinkSubTaskParams),
					z.lazy(() => ShortcutCreateSubTaskParams),
				]),
			)
			.optional(),
		linked_file_ids_remove: z.array(z.number().int()).optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		custom_fields_remove: z
			.array(z.lazy(() => ShortcutRemoveCustomFieldParams))
			.optional(),
		tasks: z.array(z.lazy(() => ShortcutCreateTaskParams)).optional(),
		started_at_override: z.string().optional(),
		labels_add: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().optional(),
		updated_at: z.string().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		parent_story_id: z.number().int().nullable().optional(),
		estimate: z.number().int().nullable().optional(),
		owner_ids_remove: z.array(z.string()).optional(),
		custom_fields_add: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		project_id: z.number().int().nullable().optional(),
		linked_file_ids_add: z.array(z.number().int()).optional(),
		linked_file_ids: z.array(z.number().int()).optional(),
		labels_remove: z.array(z.lazy(() => ShortcutRemoveLabelParams)).optional(),
		deadline: z.string().nullable().optional(),
		owner_ids_add: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		external_links_remove: z.array(z.string()).optional(),
	})
	.strict();

export const ShortcutCreateStoryLink = z
	.object({
		verb: z.enum(['blocks', 'duplicates', 'relates to']),
		subject_id: z.number().int(),
		object_id: z.number().int(),
	})
	.strict();

export const ShortcutCreateStoryLinkParams = z
	.object({
		subject_id: z.number().int().optional(),
		verb: z.enum(['blocks', 'duplicates', 'relates to']),
		object_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutCreateStoryParams = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		story_links: z
			.array(z.lazy(() => ShortcutCreateStoryLinkParams))
			.optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		story_type: z.enum(['feature', 'chore', 'bug']).optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		move_to: z.enum(['last', 'first']).optional(),
		file_ids: z.array(z.number().int()).optional(),
		source_task_id: z.number().int().nullable().optional(),
		completed_at_override: z.string().optional(),
		name: z.string(),
		comments: z
			.array(z.lazy(() => ShortcutCreateStoryCommentParams))
			.optional(),
		epic_id: z.number().int().nullable().optional(),
		story_template_id: z.string().nullable().optional(),
		external_links: z.array(z.string()).optional(),
		sub_tasks: z
			.array(
				z.union([
					z.lazy(() => ShortcutLinkSubTaskParams),
					z.lazy(() => ShortcutCreateSubTaskParams),
				]),
			)
			.optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		tasks: z.array(z.lazy(() => ShortcutCreateTaskParams)).optional(),
		started_at_override: z.string().optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().optional(),
		updated_at: z.string().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		parent_story_id: z.number().int().nullable().optional(),
		estimate: z.number().int().nullable().optional(),
		project_id: z.number().int().nullable().optional(),
		linked_file_ids: z.array(z.number().int()).optional(),
		deadline: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.strict();

export const ShortcutCreateSubTaskParams = z
	.object({
		name: z.string(),
		owner_ids: z.array(z.string()).optional(),
		workflow_state_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutCreateTask = z
	.object({
		description: z.string(),
		complete: z.boolean().optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();

export const ShortcutCreateTaskParams = z
	.object({
		description: z.string(),
		complete: z.boolean().optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();

export const ShortcutCustomField = z
	.object({
		description: z.string().optional(),
		icon_set_identifier: z.string().optional(),
		entity_type: z.enum(['custom-field']),
		story_types: z.array(z.string()).optional(),
		last_edited_by_id: z.string().nullable(),
		name: z.string(),
		fixed_position: z.boolean().optional(),
		creator_id: z.string().nullable(),
		updated_at: z.string(),
		id: z.string(),
		values: z.array(z.lazy(() => ShortcutCustomFieldEnumValue)).optional(),
		last_edited_at: z.string().nullable(),
		field_type: z.enum(['enum']),
		position: z.number().int(),
		canonical_name: z.string().optional(),
		enabled: z.boolean(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutCustomFieldEnumValue = z
	.object({
		id: z.string(),
		value: z.string(),
		position: z.number().int(),
		color_key: z.string().nullable(),
		entity_type: z.enum(['custom-field-enum-value']),
		enabled: z.boolean(),
	})
	.strict();

export const ShortcutCustomFieldValueParams = z
	.object({
		field_id: z.string(),
		value_id: z.string(),
		value: z.string().optional(),
	})
	.strict();

export const ShortcutDataConflictError = z
	.object({ error: z.enum(['data-conflict-error']), message: z.string() })
	.strict();

export const ShortcutDeleteStories = z
	.object({ story_ids: z.array(z.number().int()) })
	.strict();

export const ShortcutDisabledFeatureError = z
	.object({ feature_tag: z.string(), message: z.string() })
	.strict();

export const ShortcutDoc = z
	.object({
		id: z.string(),
		title: z.string().nullable(),
		content_markdown: z.string().nullable(),
		content_html: z.string().nullable().optional(),
		app_url: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		archived: z.boolean(),
	})
	.strict();

export const ShortcutDocSearchResults = z
	.object({
		total: z.number().int(),
		data: z.array(z.lazy(() => ShortcutDocSlim)),
		next: z.string().nullable(),
	})
	.strict();

export const ShortcutDocSlim = z
	.object({ id: z.string(), title: z.string().nullable(), app_url: z.string() })
	.strict();

export const ShortcutEntityTemplate = z
	.object({
		entity_type: z.string(),
		id: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		name: z.string(),
		author_id: z.string(),
		last_used_at: z.string(),
		story_contents: z.lazy(() => ShortcutStoryContents),
	})
	.strict();

export const ShortcutEpic = z
	.object({
		app_url: z.string(),
		description: z.string(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		associated_groups: z.array(z.lazy(() => ShortcutEpicAssociatedGroup)),
		project_ids: z.array(z.number().int()),
		stories_without_projects: z.number().int(),
		completed_at_override: z.string().nullable(),
		productboard_plugin_id: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		objective_ids: z.array(z.number().int()),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		comments: z.array(z.lazy(() => ShortcutThreadedComment)),
		productboard_url: z.string().nullable(),
		planned_start_date: z.string().nullable(),
		state: z.string(),
		milestone_id: z.number().int().nullable(),
		requested_by_id: z.string(),
		size: z.string().nullable(),
		epic_state_id: z.number().int(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		productboard_id: z.string().nullable(),
		follower_ids: z.array(z.string()),
		group_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		health: z.lazy(() => ShortcutHealth).optional(),
		position: z.number().int(),
		productboard_name: z.string().nullable(),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutEpicStats),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutEpicAssociatedGroup = z
	.object({
		group_id: z.string(),
		associated_stories_count: z.number().int().optional(),
	})
	.strict();

export const ShortcutEpicPaginatedResults = z
	.object({
		data: z.array(z.lazy(() => ShortcutEpicSlim)),
		next: z.number().int().nullable(),
		total: z.number().int(),
	})
	.strict();

export const ShortcutEpicSearchResult = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		associated_groups: z.array(z.lazy(() => ShortcutEpicAssociatedGroup)),
		project_ids: z.array(z.number().int()),
		stories_without_projects: z.number().int(),
		completed_at_override: z.string().nullable(),
		productboard_plugin_id: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		objective_ids: z.array(z.number().int()),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		comments: z.array(z.lazy(() => ShortcutThreadedComment)).optional(),
		productboard_url: z.string().nullable(),
		planned_start_date: z.string().nullable(),
		state: z.string(),
		milestone_id: z.number().int().nullable(),
		requested_by_id: z.string(),
		size: z.string().nullable(),
		epic_state_id: z.number().int(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		productboard_id: z.string().nullable(),
		follower_ids: z.array(z.string()),
		group_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		health: z.lazy(() => ShortcutHealth).optional(),
		position: z.number().int(),
		productboard_name: z.string().nullable(),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutEpicStats),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutEpicSearchResults = z
	.object({
		total: z.number().int(),
		data: z.array(z.lazy(() => ShortcutEpicSearchResult)),
		next: z.string().nullable(),
	})
	.strict();

export const ShortcutEpicSlim = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		associated_groups: z.array(z.lazy(() => ShortcutEpicAssociatedGroup)),
		project_ids: z.array(z.number().int()),
		stories_without_projects: z.number().int(),
		completed_at_override: z.string().nullable(),
		productboard_plugin_id: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		objective_ids: z.array(z.number().int()),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		productboard_url: z.string().nullable(),
		planned_start_date: z.string().nullable(),
		state: z.string(),
		milestone_id: z.number().int().nullable(),
		requested_by_id: z.string(),
		size: z.string().nullable(),
		epic_state_id: z.number().int(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		productboard_id: z.string().nullable(),
		follower_ids: z.array(z.string()),
		group_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		position: z.number().int(),
		productboard_name: z.string().nullable(),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutEpicStats),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutEpicState = z
	.object({
		description: z.string(),
		entity_type: z.string(),
		color: z.string().optional(),
		name: z.string(),
		global_id: z.string(),
		type: z.string(),
		updated_at: z.string(),
		id: z.number().int(),
		position: z.number().int(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutEpicStats = z
	.object({
		num_points_done: z.number().int(),
		num_related_documents: z.number().int(),
		num_stories_unstarted: z.number().int(),
		num_stories_total: z.number().int(),
		last_story_update: z.string().nullable(),
		num_points_started: z.number().int(),
		num_points_unstarted: z.number().int(),
		num_stories_started: z.number().int(),
		num_stories_unestimated: z.number().int(),
		num_stories_backlog: z.number().int(),
		num_points_backlog: z.number().int(),
		num_points: z.number().int(),
		num_stories_done: z.number().int(),
	})
	.strict();

export const ShortcutEpicWorkflow = z
	.object({
		entity_type: z.string(),
		id: z.number().int(),
		created_at: z.string(),
		updated_at: z.string(),
		default_epic_state_id: z.number().int(),
		epic_states: z.array(z.lazy(() => ShortcutEpicState)),
	})
	.strict();

export const ShortcutGetDoc = z
	.object({ content_format: z.enum(['markdown', 'html']).optional() })
	.strict();

export const ShortcutGroup = z
	.object({
		app_url: z.string(),
		description: z.string(),
		archived: z.boolean(),
		entity_type: z.string(),
		card_aging_mode: z.enum(['off', 'gradual', 'immediate']).nullable(),
		color: z.string().nullable(),
		card_aging_threshold_days: z.number().int().nullable(),
		num_stories_started: z.number().int(),
		mention_name: z.string(),
		name: z.string(),
		global_id: z.string(),
		color_key: z
			.enum([
				'blue',
				'purple',
				'midnight-blue',
				'orange',
				'yellow-green',
				'brass',
				'gray',
				'fuchsia',
				'yellow',
				'pink',
				'sky-blue',
				'green',
				'red',
				'black',
				'slate',
				'turquoise',
			])
			.nullable(),
		num_stories: z.number().int(),
		num_epics_started: z.number().int(),
		creator_id: z.string().nullable(),
		updated_at: z.string(),
		num_stories_backlog: z.number().int(),
		id: z.string(),
		display_icon: z.lazy(() => ShortcutIcon),
		default_workflow_id: z.number().int().nullable().optional(),
		member_ids: z.array(z.string()),
		workflow_ids: z.array(z.number().int()),
		created_at: z.string(),
	})
	.strict();

export const ShortcutHealth = z
	.object({
		entity_type: z.string(),
		author_id: z.string().optional(),
		epic_id: z.number().int().optional(),
		objective_id: z.number().int().optional(),
		updated_at: z.string().optional(),
		status: z.enum(['At Risk', 'On Track', 'Off Track', 'No Health']),
		id: z.string().nullable(),
		created_at: z.string().optional(),
		text: z.string().optional(),
	})
	.strict();

export const ShortcutHistory = z
	.object({
		actor_name: z.string().optional(),
		changed_at: z.string(),
		primary_id: z.union([z.number().int(), z.string()]).optional(),
		references: z
			.array(
				z.union([
					z.lazy(() => ShortcutHistoryReferenceBranch),
					z.lazy(() => ShortcutHistoryReferenceCommit),
					z.lazy(() => ShortcutHistoryReferenceEpic),
					z.lazy(() => ShortcutHistoryReferenceGroup),
					z.lazy(() => ShortcutHistoryReferenceIteration),
					z.lazy(() => ShortcutHistoryReferenceLabel),
					z.lazy(() => ShortcutHistoryReferenceProject),
					z.lazy(() => ShortcutHistoryReferenceStory),
					z.lazy(() => ShortcutHistoryReferenceStoryTask),
					z.lazy(() => ShortcutHistoryReferenceCustomFieldEnumValue),
					z.lazy(() => ShortcutHistoryReferenceWorkflowState),
					z.lazy(() => ShortcutHistoryReferenceGeneral),
				]),
			)
			.optional(),
		actions: z.array(
			z.union([
				z.lazy(() => ShortcutHistoryActionBranchCreate),
				z.lazy(() => ShortcutHistoryActionBranchMerge),
				z.lazy(() => ShortcutHistoryActionBranchPush),
				z.lazy(() => ShortcutHistoryActionLabelCreate),
				z.lazy(() => ShortcutHistoryActionLabelUpdate),
				z.lazy(() => ShortcutHistoryActionLabelDelete),
				z.lazy(() => ShortcutHistoryActionProjectUpdate),
				z.lazy(() => ShortcutHistoryActionPullRequest),
				z.lazy(() => ShortcutHistoryActionStoryCreate),
				z.lazy(() => ShortcutHistoryActionStoryUpdate),
				z.lazy(() => ShortcutHistoryActionStoryDelete),
				z.lazy(() => ShortcutHistoryActionStoryCommentCreate),
				z.lazy(() => ShortcutHistoryActionStoryLinkCreate),
				z.lazy(() => ShortcutHistoryActionStoryLinkUpdate),
				z.lazy(() => ShortcutHistoryActionStoryLinkDelete),
				z.lazy(() => ShortcutHistoryActionTaskCreate),
				z.lazy(() => ShortcutHistoryActionTaskUpdate),
				z.lazy(() => ShortcutHistoryActionTaskDelete),
				z.lazy(() => ShortcutHistoryActionWorkspace2BulkUpdate),
			]),
		),
		member_id: z.string().optional(),
		external_id: z.string().optional(),
		id: z.string(),
		version: z.enum(['v1']),
		webhook_id: z.string().nullable().optional(),
		automation_id: z.string().optional(),
	})
	.strict();

export const ShortcutHistoryActionBranchCreate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		name: z.string(),
		url: z.string(),
		action: z.enum(['create']),
	})
	.strict();

export const ShortcutHistoryActionBranchMerge = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		name: z.string(),
		url: z.string(),
		action: z.enum(['merge']),
	})
	.strict();

export const ShortcutHistoryActionBranchPush = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		name: z.string(),
		url: z.string(),
		action: z.enum(['push']),
	})
	.strict();

export const ShortcutHistoryActionLabelCreate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['create']),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryActionLabelDelete = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['delete']),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryActionLabelUpdate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['update']),
	})
	.strict();

export const ShortcutHistoryActionProjectUpdate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['update']),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryActionPullRequest = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['open', 'update', 'reopen', 'close', 'sync', 'comment']),
		number: z.number().int(),
		title: z.string(),
		url: z.string(),
	})
	.strict();

export const ShortcutHistoryActionStoryCommentCreate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['create']),
		app_url: z.string(),
		author_id: z.string(),
	})
	.strict();

export const ShortcutHistoryActionStoryCreate = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		started: z.boolean().optional(),
		entity_type: z.string(),
		task_ids: z.array(z.number().int()).optional(),
		story_type: z.enum(['feature', 'chore', 'bug']),
		name: z.string(),
		completed: z.boolean().optional(),
		blocker: z.boolean().optional(),
		epic_id: z.number().int().optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		label_ids: z.array(z.number().int()).optional(),
		group_id: z.string().optional(),
		workflow_state_id: z.number().int().optional(),
		object_story_link_ids: z.array(z.number().int()).optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		custom_field_value_ids: z.array(z.string()).optional(),
		id: z.number().int(),
		parent_story_id: z.number().int().optional(),
		estimate: z.number().int().optional(),
		subject_story_link_ids: z.array(z.number().int()).optional(),
		action: z.enum(['create']),
		blocked: z.boolean().optional(),
		project_id: z.number().int().optional(),
		deadline: z.string().optional(),
	})
	.strict();

export const ShortcutHistoryActionStoryDelete = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['delete']),
		name: z.string(),
		story_type: z.enum(['feature', 'chore', 'bug']),
		parent_story_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutHistoryActionStoryLinkCreate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['create']),
		verb: z.enum(['blocks', 'duplicates', 'relates to']),
		subject_id: z.number().int(),
		object_id: z.number().int(),
	})
	.strict();

export const ShortcutHistoryActionStoryLinkDelete = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['delete']),
		verb: z.enum(['blocks', 'duplicates', 'relates to']),
		subject_id: z.number().int().nullable(),
		object_id: z.number().int().nullable(),
	})
	.strict();

export const ShortcutHistoryActionStoryLinkUpdate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['update']),
		verb: z.enum(['blocks', 'duplicates', 'relates to']),
		subject_id: z.number().int(),
		object_id: z.number().int(),
		changes: z.lazy(() => ShortcutHistoryChangesStoryLink),
	})
	.strict();

export const ShortcutHistoryActionStoryUpdate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['update']),
		app_url: z.string(),
		changes: z.lazy(() => ShortcutHistoryChangesStory).optional(),
		name: z.string(),
		story_type: z.enum(['feature', 'chore', 'bug']),
		parent_story_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutHistoryActionTaskCreate = z
	.object({
		description: z.string(),
		entity_type: z.string(),
		mention_ids: z.array(z.string()).optional(),
		group_mention_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		id: z.number().int(),
		action: z.enum(['create']),
		complete: z.boolean(),
		deadline: z.string().optional(),
	})
	.strict();

export const ShortcutHistoryActionTaskDelete = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['delete']),
		description: z.string(),
	})
	.strict();

export const ShortcutHistoryActionTaskUpdate = z
	.object({
		id: z.number().int(),
		entity_type: z.string(),
		action: z.enum(['update']),
		changes: z.lazy(() => ShortcutHistoryChangesTask),
		complete: z.boolean().optional(),
		description: z.string(),
		story_id: z.number().int(),
	})
	.strict();

export const ShortcutHistoryActionWorkspace2BulkUpdate = z
	.object({
		id: z.string(),
		entity_type: z.string(),
		action: z.enum(['bulk-update']),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryChangesStory = z
	.object({
		description: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
		archived: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		started: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		task_ids: z.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt).optional(),
		mention_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
		story_type: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
		name: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
		completed: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		blocker: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		epic_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
		branch_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt)
			.optional(),
		commit_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt)
			.optional(),
		requested_by_id: z
			.lazy(() => ShortcutStoryHistoryChangeOldNewUuid)
			.optional(),
		iteration_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
		label_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt)
			.optional(),
		group_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewUuid).optional(),
		workflow_state_id: z
			.lazy(() => ShortcutStoryHistoryChangeOldNewInt)
			.optional(),
		object_story_link_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt)
			.optional(),
		follower_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
		owner_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
		custom_field_value_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
		parent_story_id: z
			.lazy(() => ShortcutStoryHistoryChangeOldNewInt)
			.optional(),
		estimate: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
		subject_story_link_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesInt)
			.optional(),
		blocked: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		project_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
		deadline: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
	})
	.strict();

export const ShortcutHistoryChangesStoryLink = z
	.object({
		verb: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
		object_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
		subject_id: z.lazy(() => ShortcutStoryHistoryChangeOldNewInt).optional(),
	})
	.strict();

export const ShortcutHistoryChangesTask = z
	.object({
		complete: z.lazy(() => ShortcutStoryHistoryChangeOldNewBool).optional(),
		description: z.lazy(() => ShortcutStoryHistoryChangeOldNewStr).optional(),
		mention_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
		owner_ids: z
			.lazy(() => ShortcutStoryHistoryChangeAddsRemovesUuid)
			.optional(),
	})
	.strict();

export const ShortcutHistoryReferenceBranch = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		name: z.string(),
		url: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceCommit = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		message: z.string(),
		url: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceCustomFieldEnumValue = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		string_value: z.string().nullable(),
		enum_value_enabled: z.boolean().nullable(),
		field_id: z.string(),
		field_type: z.string(),
		field_name: z.string(),
		field_enabled: z.boolean(),
	})
	.strict();

export const ShortcutHistoryReferenceEpic = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceGeneral = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceGroup = z
	.object({ id: z.string(), entity_type: z.string(), name: z.string() })
	.strict();

export const ShortcutHistoryReferenceIteration = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceLabel = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceProject = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		app_url: z.string(),
		name: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceStory = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		app_url: z.string(),
		name: z.string(),
		story_type: z.enum(['feature', 'chore', 'bug']),
		parent_story_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutHistoryReferenceStoryTask = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		description: z.string(),
	})
	.strict();

export const ShortcutHistoryReferenceWorkflowState = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		entity_type: z.string(),
		type: z.enum(['started', 'backlog', 'unstarted', 'done']),
		name: z.string(),
	})
	.strict();

export const ShortcutIcon = z
	.object({
		entity_type: z.string(),
		id: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		url: z.string(),
	})
	.strict();

export const ShortcutIdentity = z
	.object({
		entity_type: z.string(),
		name: z.string().nullable(),
		type: z.enum(['slack', 'github', 'gitlab', 'bitbucket']).nullable(),
	})
	.strict();

export const ShortcutIteration = z
	.object({
		app_url: z.string(),
		description: z.string(),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabel)),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		associated_groups: z.array(z.lazy(() => ShortcutIterationAssociatedGroup)),
		name: z.string(),
		global_id: z.string(),
		label_ids: z.array(z.number().int()),
		updated_at: z.string(),
		group_mention_ids: z.array(z.string()),
		end_date: z.string(),
		follower_ids: z.array(z.string()),
		group_ids: z.array(z.string()),
		start_date: z.string(),
		status: z.string(),
		id: z.number().int(),
		stats: z.lazy(() => ShortcutIterationStats),
		created_at: z.string(),
	})
	.strict();

export const ShortcutIterationAssociatedGroup = z
	.object({
		group_id: z.string(),
		associated_stories_count: z.number().int().optional(),
	})
	.strict();

export const ShortcutIterationSearchResults = z
	.object({
		total: z.number().int(),
		data: z.array(z.lazy(() => ShortcutIterationSlim)),
		next: z.string().nullable(),
	})
	.strict();

export const ShortcutIterationSlim = z
	.object({
		app_url: z.string(),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabel)),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		associated_groups: z.array(z.lazy(() => ShortcutIterationAssociatedGroup)),
		name: z.string(),
		global_id: z.string(),
		label_ids: z.array(z.number().int()),
		updated_at: z.string(),
		group_mention_ids: z.array(z.string()),
		end_date: z.string(),
		follower_ids: z.array(z.string()),
		group_ids: z.array(z.string()),
		start_date: z.string(),
		status: z.string(),
		id: z.number().int(),
		stats: z.lazy(() => ShortcutIterationStats),
		created_at: z.string(),
	})
	.strict();

export const ShortcutIterationStats = z
	.object({
		num_points_done: z.number().int(),
		num_related_documents: z.number().int(),
		average_cycle_time: z.number().int().optional(),
		num_stories_unstarted: z.number().int(),
		num_points_started: z.number().int(),
		num_points_unstarted: z.number().int(),
		num_stories_started: z.number().int(),
		num_stories_unestimated: z.number().int(),
		num_stories_backlog: z.number().int(),
		average_lead_time: z.number().int().optional(),
		num_points_backlog: z.number().int(),
		num_points: z.number().int(),
		num_stories_done: z.number().int(),
	})
	.strict();

export const ShortcutKeyResult = z
	.object({
		id: z.string(),
		name: z.string(),
		objective_id: z.number().int(),
		type: z.enum(['percent', 'boolean', 'numeric']),
		initial_observed_value: z.lazy(() => ShortcutKeyResultValue),
		current_observed_value: z.lazy(() => ShortcutKeyResultValue),
		current_target_value: z.lazy(() => ShortcutKeyResultValue),
		progress: z.number().int(),
	})
	.strict();

export const ShortcutKeyResultValue = z
	.object({
		numeric_value: z.string().optional(),
		boolean_value: z.boolean().optional(),
	})
	.strict();

export const ShortcutLabel = z
	.object({
		app_url: z.string(),
		description: z.string().nullable(),
		archived: z.boolean(),
		entity_type: z.string(),
		color: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		updated_at: z.string().nullable(),
		external_id: z.string().nullable(),
		id: z.number().int(),
		stats: z.lazy(() => ShortcutLabelStats).optional(),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutLabelSlim = z
	.object({
		app_url: z.string(),
		description: z.string().nullable(),
		archived: z.boolean(),
		entity_type: z.string(),
		color: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		updated_at: z.string().nullable(),
		external_id: z.string().nullable(),
		id: z.number().int(),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutLabelStats = z
	.object({
		num_related_documents: z.number().int(),
		num_epics: z.number().int(),
		num_stories_unstarted: z.number().int(),
		num_stories_total: z.number().int(),
		num_epics_unstarted: z.number().int(),
		num_epics_in_progress: z.number().int(),
		num_points_unstarted: z.number().int(),
		num_stories_unestimated: z.number().int(),
		num_points_in_progress: z.number().int(),
		num_epics_total: z.number().int(),
		num_stories_completed: z.number().int(),
		num_points_completed: z.number().int(),
		num_stories_backlog: z.number().int(),
		num_points_total: z.number().int(),
		num_stories_in_progress: z.number().int(),
		num_points_backlog: z.number().int(),
		num_epics_completed: z.number().int(),
	})
	.strict();

export const ShortcutLinkSubTaskParams = z
	.object({ story_id: z.number().int() })
	.strict();

export const ShortcutLinkedFile = z
	.object({
		description: z.string().nullable(),
		entity_type: z.string(),
		story_ids: z.array(z.number().int()),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		name: z.string(),
		thumbnail_url: z.string().nullable(),
		type: z.string(),
		size: z.number().int().nullable(),
		uploader_id: z.string(),
		content_type: z.string().nullable(),
		updated_at: z.string(),
		group_mention_ids: z.array(z.string()),
		id: z.number().int(),
		url: z.string(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutMaxSearchResultsExceededError = z
	.object({
		error: z.enum(['maximum-results-exceeded']),
		message: z.string(),
		'maximum-results': z.enum(['1000']),
	})
	.strict();

export const ShortcutMember = z
	.object({
		role: z.string(),
		entity_type: z.string(),
		disabled: z.boolean(),
		global_id: z.string(),
		state: z.enum(['partial', 'full', 'disabled', 'imported']),
		updated_at: z.string().nullable(),
		created_without_invite: z.boolean(),
		group_ids: z.array(z.string()),
		id: z.string(),
		installation_id: z.string().optional(),
		profile: z.lazy(() => ShortcutProfile),
		created_at: z.string().nullable(),
		replaced_by: z.string().optional(),
	})
	.strict();

export const ShortcutMemberInfo = z
	.object({
		id: z.string(),
		is_owner: z.boolean(),
		mention_name: z.string(),
		name: z.string(),
		role: z.string(),
		workspace2: z.lazy(() => ShortcutBasicWorkspaceInfo),
		organization2: z.lazy(() => ShortcutMemberInfoOrganization2),
	})
	.strict();

export const ShortcutMemberInfoOrganization2 = z
	.object({ id: z.string() })
	.strict();

export const ShortcutMilestone = z
	.object({
		app_url: z.string(),
		description: z.string(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		state: z.string(),
		started_at_override: z.string().nullable(),
		updated_at: z.string(),
		categories: z.array(z.lazy(() => ShortcutCategory)),
		id: z.number().int(),
		key_result_ids: z.array(z.string()),
		position: z.number().int(),
		stats: z.lazy(() => ShortcutMilestoneStats),
		created_at: z.string(),
	})
	.strict();

export const ShortcutMilestoneStats = z
	.object({
		average_cycle_time: z.number().int().optional(),
		average_lead_time: z.number().int().optional(),
		num_related_documents: z.number().int(),
	})
	.strict();

export const ShortcutObjective = z
	.object({
		app_url: z.string(),
		description: z.string(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		state: z.string(),
		started_at_override: z.string().nullable(),
		updated_at: z.string(),
		categories: z.array(z.lazy(() => ShortcutCategory)),
		id: z.number().int(),
		key_result_ids: z.array(z.string()),
		position: z.number().int(),
		stats: z.lazy(() => ShortcutObjectiveStats),
		created_at: z.string(),
	})
	.strict();

export const ShortcutObjectiveSearchResult = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		archived: z.boolean(),
		started: z.boolean(),
		entity_type: z.string(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		state: z.string(),
		started_at_override: z.string().nullable(),
		updated_at: z.string(),
		categories: z.array(z.lazy(() => ShortcutCategory)),
		id: z.number().int(),
		key_result_ids: z.array(z.string()),
		position: z.number().int(),
		stats: z.lazy(() => ShortcutMilestoneStats),
		created_at: z.string(),
	})
	.strict();

export const ShortcutObjectiveSearchResults = z
	.object({
		total: z.number().int(),
		data: z.array(z.lazy(() => ShortcutObjectiveSearchResult)),
		next: z.string().nullable(),
	})
	.strict();

export const ShortcutObjectiveStats = z
	.object({
		average_cycle_time: z.number().int().optional(),
		average_lead_time: z.number().int().optional(),
		num_related_documents: z.number().int(),
	})
	.strict();

export const ShortcutProfile = z
	.object({
		entity_type: z.string(),
		deactivated: z.boolean(),
		two_factor_auth_activated: z.boolean().optional(),
		mention_name: z.string(),
		is_mentionable: z.boolean().optional(),
		name: z.string().nullable(),
		is_agent: z.boolean().optional(),
		gravatar_hash: z.string().nullable(),
		id: z.string(),
		display_icon: z.lazy(() => ShortcutIcon),
		is_owner: z.boolean(),
		is_assignable: z.boolean().optional(),
		email_address: z.string().nullable(),
	})
	.strict();

export const ShortcutProject = z
	.object({
		app_url: z.string(),
		description: z.string().nullable(),
		archived: z.boolean(),
		entity_type: z.string(),
		days_to_thermometer: z.number().int(),
		color: z.string().nullable(),
		workflow_id: z.number().int(),
		name: z.string(),
		global_id: z.string(),
		start_time: z.string(),
		updated_at: z.string().nullable(),
		follower_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		show_thermometer: z.boolean(),
		team_id: z.number().int(),
		iteration_length: z.number().int(),
		abbreviation: z.string().nullable(),
		stats: z.lazy(() => ShortcutProjectStats),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutProjectStats = z
	.object({
		num_stories: z.number().int(),
		num_points: z.number().int(),
		num_related_documents: z.number().int(),
	})
	.strict();

export const ShortcutPullRequest = z
	.object({
		entity_type: z.string(),
		closed: z.boolean(),
		merged: z.boolean(),
		num_added: z.number().int(),
		branch_id: z.number().int(),
		overlapping_stories: z.array(z.number().int()).optional(),
		number: z.number().int(),
		branch_name: z.string(),
		target_branch_name: z.string(),
		num_commits: z.number().int().nullable(),
		title: z.string(),
		updated_at: z.string(),
		has_overlapping_stories: z.boolean(),
		draft: z.boolean(),
		id: z.number().int(),
		vcs_labels: z
			.array(z.lazy(() => ShortcutPullRequestLabel))
			.nullable()
			.optional(),
		url: z.string(),
		num_removed: z.number().int(),
		review_status: z.string().optional(),
		num_modified: z.number().int().nullable(),
		build_status: z.string().optional(),
		target_branch_id: z.number().int(),
		repository_id: z.number().int(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutPullRequestLabel = z
	.object({
		entity_type: z.string(),
		id: z.number().int(),
		color: z.string(),
		description: z.string().nullable().optional(),
		name: z.string(),
	})
	.strict();

export const ShortcutRemoveCustomFieldParams = z
	.object({ field_id: z.string() })
	.strict();

export const ShortcutRemoveLabelParams = z
	.object({ name: z.string() })
	.strict();

export const ShortcutRepository = z
	.object({
		entity_type: z.string(),
		name: z.string().nullable(),
		type: z.enum(['github', 'gitlab', 'bitbucket']),
		updated_at: z.string().nullable(),
		external_id: z.string().nullable(),
		id: z.number().int().nullable(),
		url: z.string().nullable(),
		full_name: z.string().nullable(),
		created_at: z.string().nullable(),
	})
	.strict();

export const ShortcutSearchResults = z
	.object({
		epics: z.lazy(() => ShortcutEpicSearchResults).optional(),
		stories: z.lazy(() => ShortcutStorySearchResults).optional(),
		iterations: z.lazy(() => ShortcutIterationSearchResults).optional(),
		milestones: z.lazy(() => ShortcutObjectiveSearchResults).optional(),
	})
	.strict();

export const ShortcutSearchStories = z
	.object({
		archived: z.boolean().optional(),
		owner_id: z.string().nullable().optional(),
		story_type: z.enum(['feature', 'chore', 'bug']).optional(),
		epic_ids: z.array(z.number().int()).optional(),
		project_ids: z.array(z.number().int().nullable()).optional(),
		updated_at_end: z.string().optional(),
		completed_at_end: z.string().optional(),
		workflow_state_types: z
			.array(z.enum(['started', 'backlog', 'unstarted', 'done']))
			.optional(),
		deadline_end: z.string().optional(),
		created_at_start: z.string().optional(),
		epic_id: z.number().int().nullable().optional(),
		label_name: z.string().optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		label_ids: z.array(z.number().int()).optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().optional(),
		iteration_ids: z.array(z.number().int()).optional(),
		created_at_end: z.string().optional(),
		deadline_start: z.string().optional(),
		group_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		includes_description: z.boolean().optional(),
		estimate: z.number().int().optional(),
		project_id: z.number().int().nullable().optional(),
		completed_at_start: z.string().optional(),
		updated_at_start: z.string().optional(),
	})
	.strict();

export const ShortcutStory = z
	.object({
		app_url: z.string(),
		description: z.string(),
		archived: z.boolean(),
		started: z.boolean(),
		story_links: z.array(z.lazy(() => ShortcutTypedStoryLink)),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		mention_ids: z.array(z.string()),
		synced_item: z.lazy(() => ShortcutSyncedItem).optional(),
		member_mention_ids: z.array(z.string()),
		story_type: z.string(),
		custom_fields: z.array(z.lazy(() => ShortcutStoryCustomField)).optional(),
		linked_files: z.array(z.lazy(() => ShortcutLinkedFile)),
		workflow_id: z.number().int(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		comments: z.array(z.lazy(() => ShortcutStoryComment)),
		blocker: z.boolean(),
		branches: z.array(z.lazy(() => ShortcutBranch)),
		epic_id: z.number().int().nullable(),
		story_template_id: z.string().nullable(),
		external_links: z.array(z.string()),
		previous_iteration_ids: z.array(z.number().int()),
		requested_by_id: z.string(),
		iteration_id: z.number().int().nullable(),
		sub_task_story_ids: z.array(z.number().int()).optional(),
		tasks: z.array(z.lazy(() => ShortcutTask)),
		formatted_vcs_branch_name: z.string().nullable().optional(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		workflow_state_id: z.number().int(),
		updated_at: z.string().nullable(),
		pull_requests: z.array(z.lazy(() => ShortcutPullRequest)),
		group_mention_ids: z.array(z.string()),
		follower_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		lead_time: z.number().int().optional(),
		parent_story_id: z.number().int().nullable().optional(),
		estimate: z.number().int().nullable(),
		commits: z.array(z.lazy(() => ShortcutCommit)),
		files: z.array(z.lazy(() => ShortcutUploadedFile)),
		position: z.number().int(),
		blocked: z.boolean(),
		project_id: z.number().int().nullable(),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutStoryStats),
		cycle_time: z.number().int().optional(),
		created_at: z.string(),
		moved_at: z.string().nullable(),
	})
	.strict();

export const ShortcutStoryComment = z
	.object({
		app_url: z.string(),
		entity_type: z.string(),
		deleted: z.boolean(),
		story_id: z.number().int(),
		mention_ids: z.array(z.string()),
		author_id: z.string().nullable(),
		member_mention_ids: z.array(z.string()),
		blocker: z.boolean().optional(),
		linked_to_slack: z.boolean(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		parent_id: z.number().int().nullable().optional(),
		id: z.number().int(),
		position: z.number().int(),
		unblocks_parent: z.boolean().optional(),
		reactions: z.array(z.lazy(() => ShortcutStoryReaction)),
		created_at: z.string(),
		text: z.string().nullable(),
	})
	.strict();

export const ShortcutStoryContents = z
	.object({
		description: z.string().optional(),
		entity_type: z.string().optional(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)).optional(),
		story_type: z.string().optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		linked_files: z.array(z.lazy(() => ShortcutLinkedFile)).optional(),
		name: z.string().optional(),
		epic_id: z.number().int().optional(),
		external_links: z.array(z.string()).optional(),
		sub_tasks: z.array(z.lazy(() => ShortcutCreateSubTaskParams)).optional(),
		iteration_id: z.number().int().optional(),
		tasks: z.array(z.lazy(() => ShortcutStoryContentsTask)).optional(),
		label_ids: z.array(z.number().int()).optional(),
		group_id: z.string().optional(),
		workflow_state_id: z.number().int().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		estimate: z.number().int().optional(),
		files: z.array(z.lazy(() => ShortcutUploadedFile)).optional(),
		project_id: z.number().int().optional(),
		deadline: z.string().optional(),
	})
	.strict();

export const ShortcutStoryContentsTask = z
	.object({
		description: z.string(),
		position: z.number().int().optional(),
		complete: z.boolean().optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().nullable().optional(),
	})
	.strict();

export const ShortcutStoryCustomField = z
	.object({ field_id: z.string(), value_id: z.string(), value: z.string() })
	.strict();

export const ShortcutStoryHistoryChangeAddsRemovesInt = z
	.object({
		adds: z.array(z.number().int()).optional(),
		removes: z.array(z.number().int()).optional(),
	})
	.strict();

export const ShortcutStoryHistoryChangeAddsRemovesUuid = z
	.object({
		adds: z.array(z.string()).optional(),
		removes: z.array(z.string()).optional(),
	})
	.strict();

export const ShortcutStoryHistoryChangeOldNewBool = z
	.object({ old: z.boolean().optional(), new: z.boolean().optional() })
	.strict();

export const ShortcutStoryHistoryChangeOldNewInt = z
	.object({
		old: z.number().int().optional(),
		new: z.number().int().optional(),
	})
	.strict();

export const ShortcutStoryHistoryChangeOldNewStr = z
	.object({ old: z.string().nullable().optional(), new: z.string().optional() })
	.strict();

export const ShortcutStoryHistoryChangeOldNewUuid = z
	.object({ old: z.string().optional(), new: z.string().optional() })
	.strict();

export const ShortcutStoryLink = z
	.object({
		entity_type: z.string(),
		id: z.number().int(),
		subject_id: z.number().int(),
		subject_workflow_state_id: z.number().int(),
		verb: z.string(),
		object_id: z.number().int(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.strict();

export const ShortcutStoryReaction = z
	.object({ emoji: z.string(), permission_ids: z.array(z.string()) })
	.strict();

export const ShortcutStorySearchResult = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		archived: z.boolean(),
		started: z.boolean(),
		story_links: z.array(z.lazy(() => ShortcutTypedStoryLink)),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		task_ids: z.array(z.number().int()).optional(),
		mention_ids: z.array(z.string()),
		synced_item: z.lazy(() => ShortcutSyncedItem).optional(),
		member_mention_ids: z.array(z.string()),
		story_type: z.string(),
		custom_fields: z.array(z.lazy(() => ShortcutStoryCustomField)).optional(),
		linked_files: z.array(z.lazy(() => ShortcutLinkedFile)).optional(),
		file_ids: z.array(z.number().int()).optional(),
		num_tasks_completed: z.number().int().optional(),
		workflow_id: z.number().int(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		comments: z.array(z.lazy(() => ShortcutStoryComment)).optional(),
		blocker: z.boolean(),
		branches: z.array(z.lazy(() => ShortcutBranch)).optional(),
		epic_id: z.number().int().nullable(),
		story_template_id: z.string().nullable(),
		external_links: z.array(z.string()),
		previous_iteration_ids: z.array(z.number().int()),
		requested_by_id: z.string(),
		iteration_id: z.number().int().nullable(),
		sub_task_story_ids: z.array(z.number().int()).optional(),
		tasks: z.array(z.lazy(() => ShortcutTask)).optional(),
		formatted_vcs_branch_name: z.string().nullable().optional(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		workflow_state_id: z.number().int(),
		updated_at: z.string().nullable(),
		pull_requests: z.array(z.lazy(() => ShortcutPullRequest)).optional(),
		group_mention_ids: z.array(z.string()),
		follower_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		lead_time: z.number().int().optional(),
		parent_story_id: z.number().int().nullable().optional(),
		estimate: z.number().int().nullable(),
		commits: z.array(z.lazy(() => ShortcutCommit)).optional(),
		files: z.array(z.lazy(() => ShortcutUploadedFile)).optional(),
		position: z.number().int(),
		blocked: z.boolean(),
		project_id: z.number().int().nullable(),
		linked_file_ids: z.array(z.number().int()).optional(),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutStoryStats),
		comment_ids: z.array(z.number().int()).optional(),
		cycle_time: z.number().int().optional(),
		created_at: z.string(),
		moved_at: z.string().nullable(),
	})
	.strict();

export const ShortcutStorySearchResults = z
	.object({
		total: z.number().int(),
		data: z.array(z.lazy(() => ShortcutStorySearchResult)),
		next: z.string().nullable(),
	})
	.strict();

export const ShortcutStorySlim = z
	.object({
		app_url: z.string(),
		description: z.string().optional(),
		archived: z.boolean(),
		started: z.boolean(),
		story_links: z.array(z.lazy(() => ShortcutTypedStoryLink)),
		entity_type: z.string(),
		labels: z.array(z.lazy(() => ShortcutLabelSlim)),
		task_ids: z.array(z.number().int()),
		mention_ids: z.array(z.string()),
		synced_item: z.lazy(() => ShortcutSyncedItem).optional(),
		member_mention_ids: z.array(z.string()),
		story_type: z.string(),
		custom_fields: z.array(z.lazy(() => ShortcutStoryCustomField)).optional(),
		file_ids: z.array(z.number().int()),
		num_tasks_completed: z.number().int(),
		workflow_id: z.number().int(),
		completed_at_override: z.string().nullable(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		completed: z.boolean(),
		blocker: z.boolean(),
		epic_id: z.number().int().nullable(),
		story_template_id: z.string().nullable(),
		external_links: z.array(z.string()),
		previous_iteration_ids: z.array(z.number().int()),
		requested_by_id: z.string(),
		iteration_id: z.number().int().nullable(),
		sub_task_story_ids: z.array(z.number().int()).optional(),
		formatted_vcs_branch_name: z.string().nullable().optional(),
		label_ids: z.array(z.number().int()),
		started_at_override: z.string().nullable(),
		group_id: z.string().nullable(),
		workflow_state_id: z.number().int(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		follower_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		lead_time: z.number().int().optional(),
		parent_story_id: z.number().int().nullable().optional(),
		estimate: z.number().int().nullable(),
		position: z.number().int(),
		blocked: z.boolean(),
		project_id: z.number().int().nullable(),
		linked_file_ids: z.array(z.number().int()),
		deadline: z.string().nullable(),
		stats: z.lazy(() => ShortcutStoryStats),
		comment_ids: z.array(z.number().int()),
		cycle_time: z.number().int().optional(),
		created_at: z.string(),
		moved_at: z.string().nullable(),
	})
	.strict();

export const ShortcutStoryStats = z
	.object({ num_related_documents: z.number().int() })
	.strict();

export const ShortcutSyncedItem = z
	.object({ external_id: z.string(), url: z.string() })
	.strict();

export const ShortcutTask = z
	.object({
		description: z.string(),
		entity_type: z.string(),
		story_id: z.number().int(),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		completed_at: z.string().nullable(),
		global_id: z.string(),
		updated_at: z.string().nullable(),
		group_mention_ids: z.array(z.string()),
		owner_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		position: z.number().int(),
		complete: z.boolean(),
		created_at: z.string(),
	})
	.strict();

export type ShortcutThreadedComment = {
	app_url: string;
	entity_type: string;
	deleted: boolean;
	mention_ids: string[];
	author_id: string;
	member_mention_ids: string[];
	comments: ShortcutThreadedComment[];
	updated_at: string;
	group_mention_ids: string[];
	external_id: string | null;
	id: number;
	created_at: string;
	text: string;
};
export const ShortcutThreadedComment: z.ZodType<ShortcutThreadedComment> =
	z.lazy(
		(): z.ZodType<ShortcutThreadedComment> =>
			z
				.object({
					app_url: z.string(),
					entity_type: z.string(),
					deleted: z.boolean(),
					mention_ids: z.array(z.string()),
					author_id: z.string(),
					member_mention_ids: z.array(z.string()),
					comments: z.array(z.lazy(() => ShortcutThreadedComment)),
					updated_at: z.string(),
					group_mention_ids: z.array(z.string()),
					external_id: z.string().nullable(),
					id: z.number().int(),
					created_at: z.string(),
					text: z.string(),
				})
				.strict(),
	);

export const ShortcutTypedStoryLink = z
	.object({
		entity_type: z.string(),
		object_id: z.number().int(),
		verb: z.string(),
		type: z.string(),
		updated_at: z.string(),
		id: z.number().int(),
		subject_id: z.number().int(),
		subject_workflow_state_id: z.number().int(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutUnprocessableError = z
	.object({ message: z.string() })
	.strict();

export const ShortcutUnusableEntitlementError = z
	.object({
		reason_tag: z.enum(['entitlement-violation']),
		entitlement_tag: z.string(),
		message: z.string(),
	})
	.strict();

export const ShortcutUpdateCategory = z
	.object({
		name: z.string().optional(),
		color: z.string().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.strict();

export const ShortcutUpdateComment = z.object({ text: z.string() }).strict();

export const ShortcutUpdateCustomField = z
	.object({
		enabled: z.boolean().optional(),
		name: z.string().optional(),
		values: z
			.array(z.lazy(() => ShortcutUpdateCustomFieldEnumValue))
			.optional(),
		icon_set_identifier: z.string().optional(),
		description: z.string().optional(),
		before_id: z.string().optional(),
		after_id: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateCustomFieldEnumValue = z
	.object({
		id: z.string().optional(),
		value: z.string().optional(),
		color_key: z
			.enum([
				'blue',
				'purple',
				'midnight-blue',
				'orange',
				'yellow-green',
				'brass',
				'gray',
				'fuchsia',
				'yellow',
				'pink',
				'sky-blue',
				'green',
				'red',
				'black',
				'slate',
				'turquoise',
			])
			.nullable()
			.optional(),
		enabled: z.boolean().optional(),
	})
	.strict();

export const ShortcutUpdateDoc = z
	.object({
		title: z.string().optional(),
		content: z.string().optional(),
		content_format: z.enum(['markdown', 'html']).optional(),
	})
	.strict();

export const ShortcutUpdateEntityTemplate = z
	.object({
		name: z.string().optional(),
		story_contents: z.lazy(() => ShortcutUpdateStoryContents).optional(),
	})
	.strict();

export const ShortcutUpdateEpic = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		completed_at_override: z.string().nullable().optional(),
		objective_ids: z.array(z.number().int()).optional(),
		name: z.string().optional(),
		planned_start_date: z.string().nullable().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		milestone_id: z.number().int().nullable().optional(),
		requested_by_id: z.string().optional(),
		size: z.enum(['small', 'xlarge', 'medium', 'large']).nullable().optional(),
		epic_state_id: z.number().int().optional(),
		started_at_override: z.string().nullable().optional(),
		group_id: z.string().nullable().optional(),
		follower_ids: z.array(z.string()).optional(),
		group_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		external_id: z.string().optional(),
		before_id: z.number().int().optional(),
		after_id: z.number().int().optional(),
		deadline: z.string().nullable().optional(),
	})
	.strict();

export const ShortcutUpdateFile = z
	.object({
		description: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		name: z.string().optional(),
		uploader_id: z.string().optional(),
		external_id: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateGroup = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().nullable().optional(),
		card_aging_mode: z
			.enum(['off', 'gradual', 'immediate'])
			.nullable()
			.optional(),
		color: z.string().nullable().optional(),
		card_aging_threshold_days: z.number().int().nullable().optional(),
		display_icon_id: z.string().nullable().optional(),
		mention_name: z.string().optional(),
		name: z.string().optional(),
		color_key: z
			.enum([
				'blue',
				'purple',
				'midnight-blue',
				'orange',
				'yellow-green',
				'brass',
				'gray',
				'fuchsia',
				'yellow',
				'pink',
				'sky-blue',
				'green',
				'red',
				'black',
				'slate',
				'turquoise',
			])
			.optional(),
		default_workflow_id: z.number().int().nullable().optional(),
		member_ids: z.array(z.string()).optional(),
		workflow_ids: z.array(z.number().int()).optional(),
	})
	.strict();

export const ShortcutUpdateHealth = z
	.object({
		status: z
			.enum(['At Risk', 'On Track', 'Off Track', 'No Health'])
			.optional(),
		text: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateIteration = z
	.object({
		follower_ids: z.array(z.string()).optional(),
		group_ids: z.array(z.string()).optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		description: z.string().optional(),
		name: z.string().optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateKeyResult = z
	.object({
		name: z.string().optional(),
		initial_observed_value: z.lazy(() => ShortcutKeyResultValue).optional(),
		observed_value: z.lazy(() => ShortcutKeyResultValue).optional(),
		target_value: z.lazy(() => ShortcutKeyResultValue).optional(),
	})
	.strict();

export const ShortcutUpdateLabel = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		color: z.string().nullable().optional(),
		archived: z.boolean().optional(),
	})
	.strict();

export const ShortcutUpdateLinkedFile = z
	.object({
		description: z.string().optional(),
		story_id: z.number().int().optional(),
		name: z.string().optional(),
		thumbnail_url: z.string().optional(),
		type: z.enum(['google', 'url', 'dropbox', 'box', 'onedrive']).optional(),
		size: z.number().int().optional(),
		uploader_id: z.string().optional(),
		url: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateMilestone = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		completed_at_override: z.string().nullable().optional(),
		name: z.string().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		started_at_override: z.string().nullable().optional(),
		categories: z.array(z.lazy(() => ShortcutCreateCategoryParams)).optional(),
		before_id: z.number().int().optional(),
		after_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutUpdateObjective = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		completed_at_override: z.string().nullable().optional(),
		name: z.string().optional(),
		state: z.enum(['in progress', 'to do', 'done']).optional(),
		started_at_override: z.string().nullable().optional(),
		categories: z.array(z.lazy(() => ShortcutCreateCategoryParams)).optional(),
		before_id: z.number().int().optional(),
		after_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutUpdateProject = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		days_to_thermometer: z.number().int().optional(),
		color: z.string().optional(),
		name: z.string().optional(),
		follower_ids: z.array(z.string()).optional(),
		show_thermometer: z.boolean().optional(),
		team_id: z.number().int().optional(),
		abbreviation: z.string().optional(),
	})
	.strict();

export const ShortcutUpdateStories = z
	.object({
		archived: z.boolean().optional(),
		story_ids: z.array(z.number().int()),
		story_type: z.enum(['feature', 'chore', 'bug']).optional(),
		move_to: z.enum(['last', 'first']).optional(),
		follower_ids_add: z.array(z.string()).optional(),
		epic_id: z.number().int().nullable().optional(),
		external_links: z.array(z.string()).optional(),
		follower_ids_remove: z.array(z.string()).optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		custom_fields_remove: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		labels_add: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().optional(),
		before_id: z.number().int().optional(),
		estimate: z.number().int().nullable().optional(),
		after_id: z.number().int().optional(),
		owner_ids_remove: z.array(z.string()).optional(),
		custom_fields_add: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		project_id: z.number().int().nullable().optional(),
		labels_remove: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		deadline: z.string().nullable().optional(),
		owner_ids_add: z.array(z.string()).optional(),
	})
	.strict();

export const ShortcutUpdateStory = z
	.object({
		description: z.string().optional(),
		archived: z.boolean().optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		pull_request_ids: z.array(z.number().int()).optional(),
		story_type: z.enum(['feature', 'chore', 'bug']).optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		move_to: z.enum(['last', 'first']).optional(),
		file_ids: z.array(z.number().int()).optional(),
		completed_at_override: z.string().nullable().optional(),
		name: z.string().optional(),
		epic_id: z.number().int().nullable().optional(),
		external_links: z.array(z.string()).optional(),
		branch_ids: z.array(z.number().int()).optional(),
		commit_ids: z.array(z.number().int()).optional(),
		sub_tasks: z.array(z.lazy(() => ShortcutLinkSubTaskParams)).optional(),
		requested_by_id: z.string().optional(),
		iteration_id: z.number().int().nullable().optional(),
		started_at_override: z.string().nullable().optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		parent_story_id: z.number().int().nullable().optional(),
		before_id: z.number().int().optional(),
		estimate: z.number().int().nullable().optional(),
		after_id: z.number().int().optional(),
		project_id: z.number().int().nullable().optional(),
		linked_file_ids: z.array(z.number().int()).optional(),
		deadline: z.string().nullable().optional(),
	})
	.strict();

export const ShortcutUpdateStoryComment = z
	.object({ text: z.string() })
	.strict();

export const ShortcutUpdateStoryContents = z
	.object({
		description: z.string().optional(),
		labels: z.array(z.lazy(() => ShortcutCreateLabelParams)).optional(),
		story_type: z.string().optional(),
		custom_fields: z
			.array(z.lazy(() => ShortcutCustomFieldValueParams))
			.optional(),
		file_ids: z.array(z.number().int()).optional(),
		name: z.string().optional(),
		epic_id: z.number().int().nullable().optional(),
		external_links: z.array(z.string()).optional(),
		sub_tasks: z.array(z.lazy(() => ShortcutCreateSubTaskParams)).optional(),
		iteration_id: z.number().int().nullable().optional(),
		tasks: z.array(z.lazy(() => ShortcutBaseTaskParams)).optional(),
		group_id: z.string().nullable().optional(),
		workflow_state_id: z.number().int().nullable().optional(),
		follower_ids: z.array(z.string()).optional(),
		owner_ids: z.array(z.string()).optional(),
		estimate: z.number().int().nullable().optional(),
		project_id: z.number().int().nullable().optional(),
		linked_file_ids: z.array(z.number().int()).optional(),
		deadline: z.string().nullable().optional(),
	})
	.strict();

export const ShortcutUpdateStoryLink = z
	.object({
		verb: z.enum(['blocks', 'duplicates', 'relates to']).optional(),
		subject_id: z.number().int().optional(),
		object_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutUpdateTask = z
	.object({
		description: z.string().optional(),
		owner_ids: z.array(z.string()).optional(),
		complete: z.boolean().optional(),
		before_id: z.number().int().optional(),
		after_id: z.number().int().optional(),
	})
	.strict();

export const ShortcutUploadedFile = z
	.object({
		description: z.string().nullable(),
		entity_type: z.string(),
		story_ids: z.array(z.number().int()),
		mention_ids: z.array(z.string()),
		member_mention_ids: z.array(z.string()),
		name: z.string(),
		thumbnail_url: z.string().nullable(),
		size: z.number().int(),
		uploader_id: z.string(),
		content_type: z.string(),
		updated_at: z.string().nullable(),
		filename: z.string(),
		group_mention_ids: z.array(z.string()),
		external_id: z.string().nullable(),
		id: z.number().int(),
		url: z.string().nullable(),
		created_at: z.string(),
	})
	.strict();

export const ShortcutWorkflow = z
	.object({
		description: z.string(),
		entity_type: z.string(),
		project_ids: z.array(z.number()),
		states: z.array(z.lazy(() => ShortcutWorkflowState)),
		name: z.string(),
		updated_at: z.string(),
		auto_assign_owner: z.boolean(),
		id: z.number().int(),
		team_id: z.number().int(),
		created_at: z.string(),
		default_state_id: z.number().int(),
	})
	.strict();

export const ShortcutWorkflowState = z
	.object({
		description: z.string(),
		entity_type: z.string(),
		color: z.string().optional(),
		verb: z.string().nullable(),
		name: z.string(),
		global_id: z.string(),
		num_stories: z.number().int(),
		type: z.string(),
		updated_at: z.string(),
		id: z.number().int(),
		num_story_templates: z.number().int(),
		position: z.number().int(),
		created_at: z.string(),
	})
	.strict();

export const ListCategoriesInputSchema = z.object({}).strict();

export const ListCategoriesOutputSchema = z.array(
	z.lazy(() => ShortcutCategory),
);

export const CreateCategoryInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateCategory) })
	.strict();

export const CreateCategoryOutputSchema = z.lazy(() => ShortcutCategory);

export const GetCategoryInputSchema = z
	.object({ path: z.object({ categoryPublicId: z.number().int() }).strict() })
	.strict();

export const GetCategoryOutputSchema = z.lazy(() => ShortcutCategory);

export const UpdateCategoryInputSchema = z
	.object({
		path: z.object({ categoryPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateCategory),
	})
	.strict();

export const UpdateCategoryOutputSchema = z.lazy(() => ShortcutCategory);

export const DeleteCategoryInputSchema = z
	.object({ path: z.object({ categoryPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteCategoryOutputSchema = z.undefined();

export const ListCategoryMilestonesInputSchema = z
	.object({ path: z.object({ categoryPublicId: z.number().int() }).strict() })
	.strict();

export const ListCategoryMilestonesOutputSchema = z.array(
	z.lazy(() => ShortcutMilestone),
);

export const ListCategoryObjectivesInputSchema = z
	.object({ path: z.object({ categoryPublicId: z.number().int() }).strict() })
	.strict();

export const ListCategoryObjectivesOutputSchema = z.array(
	z.lazy(() => ShortcutMilestone),
);

export const ListCustomFieldsInputSchema = z.object({}).strict();

export const ListCustomFieldsOutputSchema = z.array(
	z.lazy(() => ShortcutCustomField),
);

export const GetCustomFieldInputSchema = z
	.object({ path: z.object({ customFieldPublicId: z.string() }).strict() })
	.strict();

export const GetCustomFieldOutputSchema = z.lazy(() => ShortcutCustomField);

export const UpdateCustomFieldInputSchema = z
	.object({
		path: z.object({ customFieldPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateCustomField),
	})
	.strict();

export const UpdateCustomFieldOutputSchema = z.lazy(() => ShortcutCustomField);

export const DeleteCustomFieldInputSchema = z
	.object({ path: z.object({ customFieldPublicId: z.string() }).strict() })
	.strict();

export const DeleteCustomFieldOutputSchema = z.undefined();

export const ListDocsInputSchema = z.object({}).strict();

export const ListDocsOutputSchema = z.array(z.lazy(() => ShortcutDocSlim));

export const CreateDocInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateDoc) })
	.strict();

export const CreateDocOutputSchema = z.lazy(() => ShortcutDocSlim);

export const GetDocInputSchema = z
	.object({
		path: z.object({ docPublicId: z.string() }).strict(),
		query: z
			.object({ content_format: z.enum(['markdown', 'html']).optional() })
			.strict(),
	})
	.strict();

export const GetDocOutputSchema = z.lazy(() => ShortcutDoc);

export const UpdateDocInputSchema = z
	.object({
		path: z.object({ docPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateDoc),
	})
	.strict();

export const UpdateDocOutputSchema = z.lazy(() => ShortcutDoc);

export const DeleteDocInputSchema = z
	.object({
		path: z.object({ docPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutGetDoc),
	})
	.strict();

export const DeleteDocOutputSchema = z.undefined();

export const ListDocumentEpicsInputSchema = z
	.object({ path: z.object({ docPublicId: z.string() }).strict() })
	.strict();

export const ListDocumentEpicsOutputSchema = z.array(
	z.lazy(() => ShortcutEpicSlim),
);

export const LinkDocumentToEpicInputSchema = z
	.object({
		path: z
			.object({ docPublicId: z.string(), epicPublicId: z.number().int() })
			.strict(),
	})
	.strict();

export const LinkDocumentToEpicOutputSchema = z.undefined();

export const UnlinkDocumentFromEpicInputSchema = z
	.object({
		path: z
			.object({ docPublicId: z.string(), epicPublicId: z.number().int() })
			.strict(),
	})
	.strict();

export const UnlinkDocumentFromEpicOutputSchema = z.undefined();

export const ListEntityTemplatesInputSchema = z.object({}).strict();

export const ListEntityTemplatesOutputSchema = z.array(
	z.lazy(() => ShortcutEntityTemplate),
);

export const CreateEntityTemplateInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateEntityTemplate) })
	.strict();

export const CreateEntityTemplateOutputSchema = z.lazy(
	() => ShortcutEntityTemplate,
);

export const DisableStoryTemplatesInputSchema = z.object({}).strict();

export const DisableStoryTemplatesOutputSchema = z.undefined();

export const EnableStoryTemplatesInputSchema = z.object({}).strict();

export const EnableStoryTemplatesOutputSchema = z.undefined();

export const GetEntityTemplateInputSchema = z
	.object({ path: z.object({ entityTemplatePublicId: z.string() }).strict() })
	.strict();

export const GetEntityTemplateOutputSchema = z.lazy(
	() => ShortcutEntityTemplate,
);

export const UpdateEntityTemplateInputSchema = z
	.object({
		path: z.object({ entityTemplatePublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateEntityTemplate),
	})
	.strict();

export const UpdateEntityTemplateOutputSchema = z.lazy(
	() => ShortcutEntityTemplate,
);

export const DeleteEntityTemplateInputSchema = z
	.object({ path: z.object({ entityTemplatePublicId: z.string() }).strict() })
	.strict();

export const DeleteEntityTemplateOutputSchema = z.undefined();

export const GetEpicWorkflowInputSchema = z.object({}).strict();

export const GetEpicWorkflowOutputSchema = z.lazy(() => ShortcutEpicWorkflow);

export const ListEpicsInputSchema = z
	.object({
		query: z.object({ includes_description: z.boolean().optional() }).strict(),
	})
	.strict();

export const ListEpicsOutputSchema = z.array(z.lazy(() => ShortcutEpicSlim));

export const CreateEpicInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateEpic) })
	.strict();

export const CreateEpicOutputSchema = z.lazy(() => ShortcutEpic);

export const ListEpicsPaginatedInputSchema = z
	.object({
		query: z
			.object({
				includes_description: z.boolean().optional(),
				page: z.number().int().optional(),
				page_size: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();

export const ListEpicsPaginatedOutputSchema = z.lazy(
	() => ShortcutEpicPaginatedResults,
);

export const GetEpicInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const GetEpicOutputSchema = z.lazy(() => ShortcutEpic);

export const UpdateEpicInputSchema = z
	.object({
		path: z.object({ epicPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateEpic),
	})
	.strict();

export const UpdateEpicOutputSchema = z.lazy(() => ShortcutEpic);

export const DeleteEpicInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteEpicOutputSchema = z.undefined();

export const ListEpicCommentsInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const ListEpicCommentsOutputSchema = z.array(
	z.lazy(() => ShortcutThreadedComment),
);

export const CreateEpicCommentInputSchema = z
	.object({
		path: z.object({ epicPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutCreateEpicComment),
	})
	.strict();

export const CreateEpicCommentOutputSchema = z.lazy(
	() => ShortcutThreadedComment,
);

export const CreateEpicCommentCommentInputSchema = z
	.object({
		path: z
			.object({
				epicPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
		body: z.lazy(() => ShortcutCreateCommentComment),
	})
	.strict();

export const CreateEpicCommentCommentOutputSchema = z.lazy(
	() => ShortcutThreadedComment,
);

export const GetEpicCommentInputSchema = z
	.object({
		path: z
			.object({
				epicPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const GetEpicCommentOutputSchema = z.lazy(() => ShortcutThreadedComment);

export const UpdateEpicCommentInputSchema = z
	.object({
		path: z
			.object({
				epicPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
		body: z.lazy(() => ShortcutUpdateComment),
	})
	.strict();

export const UpdateEpicCommentOutputSchema = z.lazy(
	() => ShortcutThreadedComment,
);

export const DeleteEpicCommentInputSchema = z
	.object({
		path: z
			.object({
				epicPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const DeleteEpicCommentOutputSchema = z.undefined();

export const ListEpicDocumentsInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const ListEpicDocumentsOutputSchema = z.array(
	z.lazy(() => ShortcutDocSlim),
);

export const GetEpicHealthInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const GetEpicHealthOutputSchema = z.lazy(() => ShortcutHealth);

export const CreateEpicHealthInputSchema = z
	.object({
		path: z.object({ epicPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutCreateEpicHealth),
	})
	.strict();

export const CreateEpicHealthOutputSchema = z.lazy(() => ShortcutHealth);

export const ListEpicHealthsInputSchema = z
	.object({ path: z.object({ epicPublicId: z.number().int() }).strict() })
	.strict();

export const ListEpicHealthsOutputSchema = z.array(
	z.lazy(() => ShortcutHealth),
);

export const ListEpicStoriesInputSchema = z
	.object({
		path: z.object({ epicPublicId: z.number().int() }).strict(),
		query: z.object({ includes_description: z.boolean().optional() }).strict(),
	})
	.strict();

export const ListEpicStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const GetExternalLinkStoriesInputSchema = z
	.object({ query: z.object({ external_link: z.string() }).strict() })
	.strict();

export const GetExternalLinkStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const ListFilesInputSchema = z.object({}).strict();

export const ListFilesOutputSchema = z.array(
	z.lazy(() => ShortcutUploadedFile),
);

export const UploadFilesInputSchema = z
	.object({
		body: z
			.object({
				story_id: z.number().int().optional(),
				file0: z.instanceof(Blob),
				file1: z.instanceof(Blob).optional(),
				file2: z.instanceof(Blob).optional(),
				file3: z.instanceof(Blob).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export const UploadFilesOutputSchema = z.array(
	z.lazy(() => ShortcutUploadedFile),
);

export const GetFileInputSchema = z
	.object({ path: z.object({ filePublicId: z.number().int() }).strict() })
	.strict();

export const GetFileOutputSchema = z.lazy(() => ShortcutUploadedFile);

export const UpdateFileInputSchema = z
	.object({
		path: z.object({ filePublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateFile),
	})
	.strict();

export const UpdateFileOutputSchema = z.lazy(() => ShortcutUploadedFile);

export const DeleteFileInputSchema = z
	.object({ path: z.object({ filePublicId: z.number().int() }).strict() })
	.strict();

export const DeleteFileOutputSchema = z.undefined();

export const ListGroupsInputSchema = z
	.object({ query: z.object({ archived: z.boolean().optional() }).strict() })
	.strict();

export const ListGroupsOutputSchema = z.array(z.lazy(() => ShortcutGroup));

export const CreateGroupInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateGroup) })
	.strict();

export const CreateGroupOutputSchema = z.lazy(() => ShortcutGroup);

export const GetGroupInputSchema = z
	.object({ path: z.object({ groupPublicId: z.string() }).strict() })
	.strict();

export const GetGroupOutputSchema = z.lazy(() => ShortcutGroup);

export const UpdateGroupInputSchema = z
	.object({
		path: z.object({ groupPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateGroup),
	})
	.strict();

export const UpdateGroupOutputSchema = z.lazy(() => ShortcutGroup);

export const ListGroupStoriesInputSchema = z
	.object({
		path: z.object({ groupPublicId: z.string() }).strict(),
		query: z
			.object({
				limit: z.number().int().optional(),
				offset: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();

export const ListGroupStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const UpdateHealthInputSchema = z
	.object({
		path: z.object({ healthPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateHealth),
	})
	.strict();

export const UpdateHealthOutputSchema = z.lazy(() => ShortcutHealth);

export const ListIterationsInputSchema = z.object({}).strict();

export const ListIterationsOutputSchema = z.array(
	z.lazy(() => ShortcutIterationSlim),
);

export const CreateIterationInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateIteration) })
	.strict();

export const CreateIterationOutputSchema = z.lazy(() => ShortcutIteration);

export const DisableIterationsInputSchema = z.object({}).strict();

export const DisableIterationsOutputSchema = z.undefined();

export const EnableIterationsInputSchema = z.object({}).strict();

export const EnableIterationsOutputSchema = z.undefined();

export const GetIterationInputSchema = z
	.object({ path: z.object({ iterationPublicId: z.number().int() }).strict() })
	.strict();

export const GetIterationOutputSchema = z.lazy(() => ShortcutIteration);

export const UpdateIterationInputSchema = z
	.object({
		path: z.object({ iterationPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateIteration),
	})
	.strict();

export const UpdateIterationOutputSchema = z.lazy(() => ShortcutIteration);

export const DeleteIterationInputSchema = z
	.object({ path: z.object({ iterationPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteIterationOutputSchema = z.undefined();

export const ListIterationStoriesInputSchema = z
	.object({
		path: z.object({ iterationPublicId: z.number().int() }).strict(),
		query: z.object({ includes_description: z.boolean().optional() }).strict(),
	})
	.strict();

export const ListIterationStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const GetKeyResultInputSchema = z
	.object({ path: z.object({ keyResultPublicId: z.string() }).strict() })
	.strict();

export const GetKeyResultOutputSchema = z.lazy(() => ShortcutKeyResult);

export const UpdateKeyResultInputSchema = z
	.object({
		path: z.object({ keyResultPublicId: z.string() }).strict(),
		body: z.lazy(() => ShortcutUpdateKeyResult),
	})
	.strict();

export const UpdateKeyResultOutputSchema = z.lazy(() => ShortcutKeyResult);

export const ListLabelsInputSchema = z
	.object({ query: z.object({ slim: z.boolean().optional() }).strict() })
	.strict();

export const ListLabelsOutputSchema = z.array(z.lazy(() => ShortcutLabel));

export const CreateLabelInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateLabelParams) })
	.strict();

export const CreateLabelOutputSchema = z.lazy(() => ShortcutLabel);

export const GetLabelInputSchema = z
	.object({ path: z.object({ labelPublicId: z.number().int() }).strict() })
	.strict();

export const GetLabelOutputSchema = z.lazy(() => ShortcutLabel);

export const UpdateLabelInputSchema = z
	.object({
		path: z.object({ labelPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateLabel),
	})
	.strict();

export const UpdateLabelOutputSchema = z.lazy(() => ShortcutLabel);

export const DeleteLabelInputSchema = z
	.object({ path: z.object({ labelPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteLabelOutputSchema = z.undefined();

export const ListLabelEpicsInputSchema = z
	.object({ path: z.object({ labelPublicId: z.number().int() }).strict() })
	.strict();

export const ListLabelEpicsOutputSchema = z.array(
	z.lazy(() => ShortcutEpicSlim),
);

export const ListLabelStoriesInputSchema = z
	.object({
		path: z.object({ labelPublicId: z.number().int() }).strict(),
		query: z.object({ includes_description: z.boolean().optional() }).strict(),
	})
	.strict();

export const ListLabelStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const ListLinkedFilesInputSchema = z.object({}).strict();

export const ListLinkedFilesOutputSchema = z.array(
	z.lazy(() => ShortcutLinkedFile),
);

export const CreateLinkedFileInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateLinkedFile) })
	.strict();

export const CreateLinkedFileOutputSchema = z.lazy(() => ShortcutLinkedFile);

export const GetLinkedFileInputSchema = z
	.object({ path: z.object({ linkedFilePublicId: z.number().int() }).strict() })
	.strict();

export const GetLinkedFileOutputSchema = z.lazy(() => ShortcutLinkedFile);

export const UpdateLinkedFileInputSchema = z
	.object({
		path: z.object({ linkedFilePublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateLinkedFile),
	})
	.strict();

export const UpdateLinkedFileOutputSchema = z.lazy(() => ShortcutLinkedFile);

export const DeleteLinkedFileInputSchema = z
	.object({ path: z.object({ linkedFilePublicId: z.number().int() }).strict() })
	.strict();

export const DeleteLinkedFileOutputSchema = z.undefined();

export const GetCurrentMemberInfoInputSchema = z.object({}).strict();

export const GetCurrentMemberInfoOutputSchema = z.lazy(
	() => ShortcutMemberInfo,
);

export const ListMembersInputSchema = z
	.object({
		query: z
			.object({
				'org-public-id': z.string().optional(),
				disabled: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();

export const ListMembersOutputSchema = z.array(z.lazy(() => ShortcutMember));

export const GetMemberInputSchema = z
	.object({
		path: z.object({ memberPublicId: z.string() }).strict(),
		query: z.object({ 'org-public-id': z.string().optional() }).strict(),
	})
	.strict();

export const GetMemberOutputSchema = z.lazy(() => ShortcutMember);

export const ListMilestonesInputSchema = z.object({}).strict();

export const ListMilestonesOutputSchema = z.array(
	z.lazy(() => ShortcutMilestone),
);

export const CreateMilestoneInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateMilestone) })
	.strict();

export const CreateMilestoneOutputSchema = z.lazy(() => ShortcutMilestone);

export const GetMilestoneInputSchema = z
	.object({ path: z.object({ milestonePublicId: z.number().int() }).strict() })
	.strict();

export const GetMilestoneOutputSchema = z.lazy(() => ShortcutMilestone);

export const UpdateMilestoneInputSchema = z
	.object({
		path: z.object({ milestonePublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateMilestone),
	})
	.strict();

export const UpdateMilestoneOutputSchema = z.lazy(() => ShortcutMilestone);

export const DeleteMilestoneInputSchema = z
	.object({ path: z.object({ milestonePublicId: z.number().int() }).strict() })
	.strict();

export const DeleteMilestoneOutputSchema = z.undefined();

export const ListMilestoneEpicsInputSchema = z
	.object({ path: z.object({ milestonePublicId: z.number().int() }).strict() })
	.strict();

export const ListMilestoneEpicsOutputSchema = z.array(
	z.lazy(() => ShortcutEpicSlim),
);

export const ListObjectivesInputSchema = z.object({}).strict();

export const ListObjectivesOutputSchema = z.array(
	z.lazy(() => ShortcutObjective),
);

export const CreateObjectiveInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateObjective) })
	.strict();

export const CreateObjectiveOutputSchema = z.lazy(() => ShortcutObjective);

export const GetObjectiveInputSchema = z
	.object({ path: z.object({ objectivePublicId: z.number().int() }).strict() })
	.strict();

export const GetObjectiveOutputSchema = z.lazy(() => ShortcutObjective);

export const UpdateObjectiveInputSchema = z
	.object({
		path: z.object({ objectivePublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateObjective),
	})
	.strict();

export const UpdateObjectiveOutputSchema = z.lazy(() => ShortcutObjective);

export const DeleteObjectiveInputSchema = z
	.object({ path: z.object({ objectivePublicId: z.number().int() }).strict() })
	.strict();

export const DeleteObjectiveOutputSchema = z.undefined();

export const ListObjectiveEpicsInputSchema = z
	.object({ path: z.object({ objectivePublicId: z.number().int() }).strict() })
	.strict();

export const ListObjectiveEpicsOutputSchema = z.array(
	z.lazy(() => ShortcutEpicSlim),
);

export const GetObjectiveHealthInputSchema = z
	.object({ path: z.object({ objectivePublicId: z.number().int() }).strict() })
	.strict();

export const GetObjectiveHealthOutputSchema = z.lazy(() => ShortcutHealth);

export const CreateObjectiveHealthInputSchema = z
	.object({
		path: z.object({ objectivePublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutCreateObjectiveHealth),
	})
	.strict();

export const CreateObjectiveHealthOutputSchema = z.lazy(() => ShortcutHealth);

export const ListObjectiveHealthsInputSchema = z
	.object({ path: z.object({ objectivePublicId: z.number().int() }).strict() })
	.strict();

export const ListObjectiveHealthsOutputSchema = z.array(
	z.lazy(() => ShortcutHealth),
);

export const ListProjectsInputSchema = z.object({}).strict();

export const ListProjectsOutputSchema = z.array(z.lazy(() => ShortcutProject));

export const CreateProjectInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateProject) })
	.strict();

export const CreateProjectOutputSchema = z.lazy(() => ShortcutProject);

export const GetProjectInputSchema = z
	.object({ path: z.object({ projectPublicId: z.number().int() }).strict() })
	.strict();

export const GetProjectOutputSchema = z.lazy(() => ShortcutProject);

export const UpdateProjectInputSchema = z
	.object({
		path: z.object({ projectPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateProject),
	})
	.strict();

export const UpdateProjectOutputSchema = z.lazy(() => ShortcutProject);

export const DeleteProjectInputSchema = z
	.object({ path: z.object({ projectPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteProjectOutputSchema = z.undefined();

export const ListStoriesInputSchema = z
	.object({
		path: z.object({ projectPublicId: z.number().int() }).strict(),
		query: z.object({ includes_description: z.boolean().optional() }).strict(),
	})
	.strict();

export const ListStoriesOutputSchema = z.array(z.lazy(() => ShortcutStorySlim));

export const ListRepositoriesInputSchema = z.object({}).strict();

export const ListRepositoriesOutputSchema = z.array(
	z.lazy(() => ShortcutRepository),
);

export const GetRepositoryInputSchema = z
	.object({ path: z.object({ repoPublicId: z.number().int() }).strict() })
	.strict();

export const GetRepositoryOutputSchema = z.lazy(() => ShortcutRepository);

export const SearchInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchOutputSchema = z.lazy(() => ShortcutSearchResults);

export const SearchDocumentsInputSchema = z
	.object({
		query: z
			.object({
				title: z.string(),
				archived: z.boolean().optional(),
				created_by_me: z.boolean().optional(),
				followed_by_me: z.boolean().optional(),
				page_size: z.number().int().optional(),
				next: z.string().optional(),
			})
			.strict(),
	})
	.strict();

export const SearchDocumentsOutputSchema = z.lazy(
	() => ShortcutDocSearchResults,
);

export const SearchEpicsInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchEpicsOutputSchema = z.lazy(() => ShortcutEpicSearchResults);

export const SearchIterationsInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchIterationsOutputSchema = z.lazy(
	() => ShortcutIterationSearchResults,
);

export const SearchMilestonesInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchMilestonesOutputSchema = z.lazy(
	() => ShortcutObjectiveSearchResults,
);

export const SearchObjectivesInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchObjectivesOutputSchema = z.lazy(
	() => ShortcutObjectiveSearchResults,
);

export const SearchStoriesInputSchema = z
	.object({
		query: z
			.object({
				query: z.string(),
				page_size: z.number().int().optional(),
				detail: z.enum(['full', 'slim']).optional(),
				next: z.string().optional(),
				entity_types: z
					.array(
						z.enum(['story', 'milestone', 'epic', 'iteration', 'objective']),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();

export const SearchStoriesOutputSchema = z.lazy(
	() => ShortcutStorySearchResults,
);

export const CreateStoryInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateStoryParams) })
	.strict();

export const CreateStoryOutputSchema = z.lazy(() => ShortcutStory);

export const CreateMultipleStoriesInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateStories) })
	.strict();

export const CreateMultipleStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const UpdateMultipleStoriesInputSchema = z
	.object({ body: z.lazy(() => ShortcutUpdateStories) })
	.strict();

export const UpdateMultipleStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const DeleteMultipleStoriesInputSchema = z
	.object({ body: z.lazy(() => ShortcutDeleteStories) })
	.strict();

export const DeleteMultipleStoriesOutputSchema = z.undefined();

export const CreateStoryFromTemplateInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateStoryFromTemplateParams) })
	.strict();

export const CreateStoryFromTemplateOutputSchema = z.lazy(() => ShortcutStory);

export const QueryStoriesInputSchema = z
	.object({ body: z.lazy(() => ShortcutSearchStories) })
	.strict();

export const QueryStoriesOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const GetStoryInputSchema = z
	.object({ path: z.object({ storyPublicId: z.number().int() }).strict() })
	.strict();

export const GetStoryOutputSchema = z.lazy(() => ShortcutStory);

export const UpdateStoryInputSchema = z
	.object({
		path: z.object({ storyPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateStory),
	})
	.strict();

export const UpdateStoryOutputSchema = z.lazy(() => ShortcutStory);

export const DeleteStoryInputSchema = z
	.object({ path: z.object({ storyPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteStoryOutputSchema = z.undefined();

export const ListStoryCommentInputSchema = z
	.object({ path: z.object({ storyPublicId: z.number().int() }).strict() })
	.strict();

export const ListStoryCommentOutputSchema = z.array(
	z.lazy(() => ShortcutStoryComment),
);

export const CreateStoryCommentInputSchema = z
	.object({
		path: z.object({ storyPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutCreateStoryComment),
	})
	.strict();

export const CreateStoryCommentOutputSchema = z.lazy(
	() => ShortcutStoryComment,
);

export const GetStoryCommentInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const GetStoryCommentOutputSchema = z.lazy(() => ShortcutStoryComment);

export const UpdateStoryCommentInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
		body: z.lazy(() => ShortcutUpdateStoryComment),
	})
	.strict();

export const UpdateStoryCommentOutputSchema = z.lazy(
	() => ShortcutStoryComment,
);

export const DeleteStoryCommentInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const DeleteStoryCommentOutputSchema = z.undefined();

export const CreateStoryReactionInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
		body: z.object({ emoji: z.string() }).strict(),
	})
	.strict();

export const CreateStoryReactionOutputSchema = z.array(
	z.lazy(() => ShortcutStoryReaction),
);

export const DeleteStoryReactionInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
		body: z.object({ emoji: z.string() }).strict(),
	})
	.strict();

export const DeleteStoryReactionOutputSchema = z.undefined();

export const UnlinkCommentThreadFromSlackInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				commentPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const UnlinkCommentThreadFromSlackOutputSchema = z.lazy(
	() => ShortcutStoryComment,
);

export const StoryHistoryInputSchema = z
	.object({ path: z.object({ storyPublicId: z.number().int() }).strict() })
	.strict();

export const StoryHistoryOutputSchema = z.array(z.lazy(() => ShortcutHistory));

export const ListStorySubTasksInputSchema = z
	.object({ path: z.object({ storyPublicId: z.number().int() }).strict() })
	.strict();

export const ListStorySubTasksOutputSchema = z.array(
	z.lazy(() => ShortcutStorySlim),
);

export const CreateTaskInputSchema = z
	.object({
		path: z.object({ storyPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutCreateTask),
	})
	.strict();

export const CreateTaskOutputSchema = z.lazy(() => ShortcutTask);

export const GetTaskInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				taskPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const GetTaskOutputSchema = z.lazy(() => ShortcutTask);

export const UpdateTaskInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				taskPublicId: z.number().int(),
			})
			.strict(),
		body: z.lazy(() => ShortcutUpdateTask),
	})
	.strict();

export const UpdateTaskOutputSchema = z.lazy(() => ShortcutTask);

export const DeleteTaskInputSchema = z
	.object({
		path: z
			.object({
				storyPublicId: z.number().int(),
				taskPublicId: z.number().int(),
			})
			.strict(),
	})
	.strict();

export const DeleteTaskOutputSchema = z.undefined();

export const CreateStoryLinkInputSchema = z
	.object({ body: z.lazy(() => ShortcutCreateStoryLink) })
	.strict();

export const CreateStoryLinkOutputSchema = z.lazy(() => ShortcutStoryLink);

export const GetStoryLinkInputSchema = z
	.object({ path: z.object({ storyLinkPublicId: z.number().int() }).strict() })
	.strict();

export const GetStoryLinkOutputSchema = z.lazy(() => ShortcutStoryLink);

export const UpdateStoryLinkInputSchema = z
	.object({
		path: z.object({ storyLinkPublicId: z.number().int() }).strict(),
		body: z.lazy(() => ShortcutUpdateStoryLink),
	})
	.strict();

export const UpdateStoryLinkOutputSchema = z.lazy(() => ShortcutStoryLink);

export const DeleteStoryLinkInputSchema = z
	.object({ path: z.object({ storyLinkPublicId: z.number().int() }).strict() })
	.strict();

export const DeleteStoryLinkOutputSchema = z.undefined();

export const ListWorkflowsInputSchema = z.object({}).strict();

export const ListWorkflowsOutputSchema = z.array(
	z.lazy(() => ShortcutWorkflow),
);

export const GetWorkflowInputSchema = z
	.object({ path: z.object({ workflowPublicId: z.number().int() }).strict() })
	.strict();

export const GetWorkflowOutputSchema = z.lazy(() => ShortcutWorkflow);

export type ShortcutEndpointInputs = {
	listCategories: z.infer<typeof ListCategoriesInputSchema>;
	createCategory: z.infer<typeof CreateCategoryInputSchema>;
	getCategory: z.infer<typeof GetCategoryInputSchema>;
	updateCategory: z.infer<typeof UpdateCategoryInputSchema>;
	deleteCategory: z.infer<typeof DeleteCategoryInputSchema>;
	listCategoryMilestones: z.infer<typeof ListCategoryMilestonesInputSchema>;
	listCategoryObjectives: z.infer<typeof ListCategoryObjectivesInputSchema>;
	listCustomFields: z.infer<typeof ListCustomFieldsInputSchema>;
	getCustomField: z.infer<typeof GetCustomFieldInputSchema>;
	updateCustomField: z.infer<typeof UpdateCustomFieldInputSchema>;
	deleteCustomField: z.infer<typeof DeleteCustomFieldInputSchema>;
	listDocs: z.infer<typeof ListDocsInputSchema>;
	createDoc: z.infer<typeof CreateDocInputSchema>;
	getDoc: z.infer<typeof GetDocInputSchema>;
	updateDoc: z.infer<typeof UpdateDocInputSchema>;
	deleteDoc: z.infer<typeof DeleteDocInputSchema>;
	listDocumentEpics: z.infer<typeof ListDocumentEpicsInputSchema>;
	linkDocumentToEpic: z.infer<typeof LinkDocumentToEpicInputSchema>;
	unlinkDocumentFromEpic: z.infer<typeof UnlinkDocumentFromEpicInputSchema>;
	listEntityTemplates: z.infer<typeof ListEntityTemplatesInputSchema>;
	createEntityTemplate: z.infer<typeof CreateEntityTemplateInputSchema>;
	disableStoryTemplates: z.infer<typeof DisableStoryTemplatesInputSchema>;
	enableStoryTemplates: z.infer<typeof EnableStoryTemplatesInputSchema>;
	getEntityTemplate: z.infer<typeof GetEntityTemplateInputSchema>;
	updateEntityTemplate: z.infer<typeof UpdateEntityTemplateInputSchema>;
	deleteEntityTemplate: z.infer<typeof DeleteEntityTemplateInputSchema>;
	getEpicWorkflow: z.infer<typeof GetEpicWorkflowInputSchema>;
	listEpics: z.infer<typeof ListEpicsInputSchema>;
	createEpic: z.infer<typeof CreateEpicInputSchema>;
	listEpicsPaginated: z.infer<typeof ListEpicsPaginatedInputSchema>;
	getEpic: z.infer<typeof GetEpicInputSchema>;
	updateEpic: z.infer<typeof UpdateEpicInputSchema>;
	deleteEpic: z.infer<typeof DeleteEpicInputSchema>;
	listEpicComments: z.infer<typeof ListEpicCommentsInputSchema>;
	createEpicComment: z.infer<typeof CreateEpicCommentInputSchema>;
	createEpicCommentComment: z.infer<typeof CreateEpicCommentCommentInputSchema>;
	getEpicComment: z.infer<typeof GetEpicCommentInputSchema>;
	updateEpicComment: z.infer<typeof UpdateEpicCommentInputSchema>;
	deleteEpicComment: z.infer<typeof DeleteEpicCommentInputSchema>;
	listEpicDocuments: z.infer<typeof ListEpicDocumentsInputSchema>;
	getEpicHealth: z.infer<typeof GetEpicHealthInputSchema>;
	createEpicHealth: z.infer<typeof CreateEpicHealthInputSchema>;
	listEpicHealths: z.infer<typeof ListEpicHealthsInputSchema>;
	listEpicStories: z.infer<typeof ListEpicStoriesInputSchema>;
	getExternalLinkStories: z.infer<typeof GetExternalLinkStoriesInputSchema>;
	listFiles: z.infer<typeof ListFilesInputSchema>;
	uploadFiles: z.infer<typeof UploadFilesInputSchema>;
	getFile: z.infer<typeof GetFileInputSchema>;
	updateFile: z.infer<typeof UpdateFileInputSchema>;
	deleteFile: z.infer<typeof DeleteFileInputSchema>;
	listGroups: z.infer<typeof ListGroupsInputSchema>;
	createGroup: z.infer<typeof CreateGroupInputSchema>;
	getGroup: z.infer<typeof GetGroupInputSchema>;
	updateGroup: z.infer<typeof UpdateGroupInputSchema>;
	listGroupStories: z.infer<typeof ListGroupStoriesInputSchema>;
	updateHealth: z.infer<typeof UpdateHealthInputSchema>;
	listIterations: z.infer<typeof ListIterationsInputSchema>;
	createIteration: z.infer<typeof CreateIterationInputSchema>;
	disableIterations: z.infer<typeof DisableIterationsInputSchema>;
	enableIterations: z.infer<typeof EnableIterationsInputSchema>;
	getIteration: z.infer<typeof GetIterationInputSchema>;
	updateIteration: z.infer<typeof UpdateIterationInputSchema>;
	deleteIteration: z.infer<typeof DeleteIterationInputSchema>;
	listIterationStories: z.infer<typeof ListIterationStoriesInputSchema>;
	getKeyResult: z.infer<typeof GetKeyResultInputSchema>;
	updateKeyResult: z.infer<typeof UpdateKeyResultInputSchema>;
	listLabels: z.infer<typeof ListLabelsInputSchema>;
	createLabel: z.infer<typeof CreateLabelInputSchema>;
	getLabel: z.infer<typeof GetLabelInputSchema>;
	updateLabel: z.infer<typeof UpdateLabelInputSchema>;
	deleteLabel: z.infer<typeof DeleteLabelInputSchema>;
	listLabelEpics: z.infer<typeof ListLabelEpicsInputSchema>;
	listLabelStories: z.infer<typeof ListLabelStoriesInputSchema>;
	listLinkedFiles: z.infer<typeof ListLinkedFilesInputSchema>;
	createLinkedFile: z.infer<typeof CreateLinkedFileInputSchema>;
	getLinkedFile: z.infer<typeof GetLinkedFileInputSchema>;
	updateLinkedFile: z.infer<typeof UpdateLinkedFileInputSchema>;
	deleteLinkedFile: z.infer<typeof DeleteLinkedFileInputSchema>;
	getCurrentMemberInfo: z.infer<typeof GetCurrentMemberInfoInputSchema>;
	listMembers: z.infer<typeof ListMembersInputSchema>;
	getMember: z.infer<typeof GetMemberInputSchema>;
	listMilestones: z.infer<typeof ListMilestonesInputSchema>;
	createMilestone: z.infer<typeof CreateMilestoneInputSchema>;
	getMilestone: z.infer<typeof GetMilestoneInputSchema>;
	updateMilestone: z.infer<typeof UpdateMilestoneInputSchema>;
	deleteMilestone: z.infer<typeof DeleteMilestoneInputSchema>;
	listMilestoneEpics: z.infer<typeof ListMilestoneEpicsInputSchema>;
	listObjectives: z.infer<typeof ListObjectivesInputSchema>;
	createObjective: z.infer<typeof CreateObjectiveInputSchema>;
	getObjective: z.infer<typeof GetObjectiveInputSchema>;
	updateObjective: z.infer<typeof UpdateObjectiveInputSchema>;
	deleteObjective: z.infer<typeof DeleteObjectiveInputSchema>;
	listObjectiveEpics: z.infer<typeof ListObjectiveEpicsInputSchema>;
	getObjectiveHealth: z.infer<typeof GetObjectiveHealthInputSchema>;
	createObjectiveHealth: z.infer<typeof CreateObjectiveHealthInputSchema>;
	listObjectiveHealths: z.infer<typeof ListObjectiveHealthsInputSchema>;
	listProjects: z.infer<typeof ListProjectsInputSchema>;
	createProject: z.infer<typeof CreateProjectInputSchema>;
	getProject: z.infer<typeof GetProjectInputSchema>;
	updateProject: z.infer<typeof UpdateProjectInputSchema>;
	deleteProject: z.infer<typeof DeleteProjectInputSchema>;
	listStories: z.infer<typeof ListStoriesInputSchema>;
	listRepositories: z.infer<typeof ListRepositoriesInputSchema>;
	getRepository: z.infer<typeof GetRepositoryInputSchema>;
	search: z.infer<typeof SearchInputSchema>;
	searchDocuments: z.infer<typeof SearchDocumentsInputSchema>;
	searchEpics: z.infer<typeof SearchEpicsInputSchema>;
	searchIterations: z.infer<typeof SearchIterationsInputSchema>;
	searchMilestones: z.infer<typeof SearchMilestonesInputSchema>;
	searchObjectives: z.infer<typeof SearchObjectivesInputSchema>;
	searchStories: z.infer<typeof SearchStoriesInputSchema>;
	createStory: z.infer<typeof CreateStoryInputSchema>;
	createMultipleStories: z.infer<typeof CreateMultipleStoriesInputSchema>;
	updateMultipleStories: z.infer<typeof UpdateMultipleStoriesInputSchema>;
	deleteMultipleStories: z.infer<typeof DeleteMultipleStoriesInputSchema>;
	createStoryFromTemplate: z.infer<typeof CreateStoryFromTemplateInputSchema>;
	queryStories: z.infer<typeof QueryStoriesInputSchema>;
	getStory: z.infer<typeof GetStoryInputSchema>;
	updateStory: z.infer<typeof UpdateStoryInputSchema>;
	deleteStory: z.infer<typeof DeleteStoryInputSchema>;
	listStoryComment: z.infer<typeof ListStoryCommentInputSchema>;
	createStoryComment: z.infer<typeof CreateStoryCommentInputSchema>;
	getStoryComment: z.infer<typeof GetStoryCommentInputSchema>;
	updateStoryComment: z.infer<typeof UpdateStoryCommentInputSchema>;
	deleteStoryComment: z.infer<typeof DeleteStoryCommentInputSchema>;
	createStoryReaction: z.infer<typeof CreateStoryReactionInputSchema>;
	deleteStoryReaction: z.infer<typeof DeleteStoryReactionInputSchema>;
	unlinkCommentThreadFromSlack: z.infer<
		typeof UnlinkCommentThreadFromSlackInputSchema
	>;
	storyHistory: z.infer<typeof StoryHistoryInputSchema>;
	listStorySubTasks: z.infer<typeof ListStorySubTasksInputSchema>;
	createTask: z.infer<typeof CreateTaskInputSchema>;
	getTask: z.infer<typeof GetTaskInputSchema>;
	updateTask: z.infer<typeof UpdateTaskInputSchema>;
	deleteTask: z.infer<typeof DeleteTaskInputSchema>;
	createStoryLink: z.infer<typeof CreateStoryLinkInputSchema>;
	getStoryLink: z.infer<typeof GetStoryLinkInputSchema>;
	updateStoryLink: z.infer<typeof UpdateStoryLinkInputSchema>;
	deleteStoryLink: z.infer<typeof DeleteStoryLinkInputSchema>;
	listWorkflows: z.infer<typeof ListWorkflowsInputSchema>;
	getWorkflow: z.infer<typeof GetWorkflowInputSchema>;
};
export type ShortcutEndpointOutputs = {
	listCategories: z.infer<typeof ListCategoriesOutputSchema>;
	createCategory: z.infer<typeof CreateCategoryOutputSchema>;
	getCategory: z.infer<typeof GetCategoryOutputSchema>;
	updateCategory: z.infer<typeof UpdateCategoryOutputSchema>;
	deleteCategory: z.infer<typeof DeleteCategoryOutputSchema>;
	listCategoryMilestones: z.infer<typeof ListCategoryMilestonesOutputSchema>;
	listCategoryObjectives: z.infer<typeof ListCategoryObjectivesOutputSchema>;
	listCustomFields: z.infer<typeof ListCustomFieldsOutputSchema>;
	getCustomField: z.infer<typeof GetCustomFieldOutputSchema>;
	updateCustomField: z.infer<typeof UpdateCustomFieldOutputSchema>;
	deleteCustomField: z.infer<typeof DeleteCustomFieldOutputSchema>;
	listDocs: z.infer<typeof ListDocsOutputSchema>;
	createDoc: z.infer<typeof CreateDocOutputSchema>;
	getDoc: z.infer<typeof GetDocOutputSchema>;
	updateDoc: z.infer<typeof UpdateDocOutputSchema>;
	deleteDoc: z.infer<typeof DeleteDocOutputSchema>;
	listDocumentEpics: z.infer<typeof ListDocumentEpicsOutputSchema>;
	linkDocumentToEpic: z.infer<typeof LinkDocumentToEpicOutputSchema>;
	unlinkDocumentFromEpic: z.infer<typeof UnlinkDocumentFromEpicOutputSchema>;
	listEntityTemplates: z.infer<typeof ListEntityTemplatesOutputSchema>;
	createEntityTemplate: z.infer<typeof CreateEntityTemplateOutputSchema>;
	disableStoryTemplates: z.infer<typeof DisableStoryTemplatesOutputSchema>;
	enableStoryTemplates: z.infer<typeof EnableStoryTemplatesOutputSchema>;
	getEntityTemplate: z.infer<typeof GetEntityTemplateOutputSchema>;
	updateEntityTemplate: z.infer<typeof UpdateEntityTemplateOutputSchema>;
	deleteEntityTemplate: z.infer<typeof DeleteEntityTemplateOutputSchema>;
	getEpicWorkflow: z.infer<typeof GetEpicWorkflowOutputSchema>;
	listEpics: z.infer<typeof ListEpicsOutputSchema>;
	createEpic: z.infer<typeof CreateEpicOutputSchema>;
	listEpicsPaginated: z.infer<typeof ListEpicsPaginatedOutputSchema>;
	getEpic: z.infer<typeof GetEpicOutputSchema>;
	updateEpic: z.infer<typeof UpdateEpicOutputSchema>;
	deleteEpic: z.infer<typeof DeleteEpicOutputSchema>;
	listEpicComments: z.infer<typeof ListEpicCommentsOutputSchema>;
	createEpicComment: z.infer<typeof CreateEpicCommentOutputSchema>;
	createEpicCommentComment: z.infer<
		typeof CreateEpicCommentCommentOutputSchema
	>;
	getEpicComment: z.infer<typeof GetEpicCommentOutputSchema>;
	updateEpicComment: z.infer<typeof UpdateEpicCommentOutputSchema>;
	deleteEpicComment: z.infer<typeof DeleteEpicCommentOutputSchema>;
	listEpicDocuments: z.infer<typeof ListEpicDocumentsOutputSchema>;
	getEpicHealth: z.infer<typeof GetEpicHealthOutputSchema>;
	createEpicHealth: z.infer<typeof CreateEpicHealthOutputSchema>;
	listEpicHealths: z.infer<typeof ListEpicHealthsOutputSchema>;
	listEpicStories: z.infer<typeof ListEpicStoriesOutputSchema>;
	getExternalLinkStories: z.infer<typeof GetExternalLinkStoriesOutputSchema>;
	listFiles: z.infer<typeof ListFilesOutputSchema>;
	uploadFiles: z.infer<typeof UploadFilesOutputSchema>;
	getFile: z.infer<typeof GetFileOutputSchema>;
	updateFile: z.infer<typeof UpdateFileOutputSchema>;
	deleteFile: z.infer<typeof DeleteFileOutputSchema>;
	listGroups: z.infer<typeof ListGroupsOutputSchema>;
	createGroup: z.infer<typeof CreateGroupOutputSchema>;
	getGroup: z.infer<typeof GetGroupOutputSchema>;
	updateGroup: z.infer<typeof UpdateGroupOutputSchema>;
	listGroupStories: z.infer<typeof ListGroupStoriesOutputSchema>;
	updateHealth: z.infer<typeof UpdateHealthOutputSchema>;
	listIterations: z.infer<typeof ListIterationsOutputSchema>;
	createIteration: z.infer<typeof CreateIterationOutputSchema>;
	disableIterations: z.infer<typeof DisableIterationsOutputSchema>;
	enableIterations: z.infer<typeof EnableIterationsOutputSchema>;
	getIteration: z.infer<typeof GetIterationOutputSchema>;
	updateIteration: z.infer<typeof UpdateIterationOutputSchema>;
	deleteIteration: z.infer<typeof DeleteIterationOutputSchema>;
	listIterationStories: z.infer<typeof ListIterationStoriesOutputSchema>;
	getKeyResult: z.infer<typeof GetKeyResultOutputSchema>;
	updateKeyResult: z.infer<typeof UpdateKeyResultOutputSchema>;
	listLabels: z.infer<typeof ListLabelsOutputSchema>;
	createLabel: z.infer<typeof CreateLabelOutputSchema>;
	getLabel: z.infer<typeof GetLabelOutputSchema>;
	updateLabel: z.infer<typeof UpdateLabelOutputSchema>;
	deleteLabel: z.infer<typeof DeleteLabelOutputSchema>;
	listLabelEpics: z.infer<typeof ListLabelEpicsOutputSchema>;
	listLabelStories: z.infer<typeof ListLabelStoriesOutputSchema>;
	listLinkedFiles: z.infer<typeof ListLinkedFilesOutputSchema>;
	createLinkedFile: z.infer<typeof CreateLinkedFileOutputSchema>;
	getLinkedFile: z.infer<typeof GetLinkedFileOutputSchema>;
	updateLinkedFile: z.infer<typeof UpdateLinkedFileOutputSchema>;
	deleteLinkedFile: z.infer<typeof DeleteLinkedFileOutputSchema>;
	getCurrentMemberInfo: z.infer<typeof GetCurrentMemberInfoOutputSchema>;
	listMembers: z.infer<typeof ListMembersOutputSchema>;
	getMember: z.infer<typeof GetMemberOutputSchema>;
	listMilestones: z.infer<typeof ListMilestonesOutputSchema>;
	createMilestone: z.infer<typeof CreateMilestoneOutputSchema>;
	getMilestone: z.infer<typeof GetMilestoneOutputSchema>;
	updateMilestone: z.infer<typeof UpdateMilestoneOutputSchema>;
	deleteMilestone: z.infer<typeof DeleteMilestoneOutputSchema>;
	listMilestoneEpics: z.infer<typeof ListMilestoneEpicsOutputSchema>;
	listObjectives: z.infer<typeof ListObjectivesOutputSchema>;
	createObjective: z.infer<typeof CreateObjectiveOutputSchema>;
	getObjective: z.infer<typeof GetObjectiveOutputSchema>;
	updateObjective: z.infer<typeof UpdateObjectiveOutputSchema>;
	deleteObjective: z.infer<typeof DeleteObjectiveOutputSchema>;
	listObjectiveEpics: z.infer<typeof ListObjectiveEpicsOutputSchema>;
	getObjectiveHealth: z.infer<typeof GetObjectiveHealthOutputSchema>;
	createObjectiveHealth: z.infer<typeof CreateObjectiveHealthOutputSchema>;
	listObjectiveHealths: z.infer<typeof ListObjectiveHealthsOutputSchema>;
	listProjects: z.infer<typeof ListProjectsOutputSchema>;
	createProject: z.infer<typeof CreateProjectOutputSchema>;
	getProject: z.infer<typeof GetProjectOutputSchema>;
	updateProject: z.infer<typeof UpdateProjectOutputSchema>;
	deleteProject: z.infer<typeof DeleteProjectOutputSchema>;
	listStories: z.infer<typeof ListStoriesOutputSchema>;
	listRepositories: z.infer<typeof ListRepositoriesOutputSchema>;
	getRepository: z.infer<typeof GetRepositoryOutputSchema>;
	search: z.infer<typeof SearchOutputSchema>;
	searchDocuments: z.infer<typeof SearchDocumentsOutputSchema>;
	searchEpics: z.infer<typeof SearchEpicsOutputSchema>;
	searchIterations: z.infer<typeof SearchIterationsOutputSchema>;
	searchMilestones: z.infer<typeof SearchMilestonesOutputSchema>;
	searchObjectives: z.infer<typeof SearchObjectivesOutputSchema>;
	searchStories: z.infer<typeof SearchStoriesOutputSchema>;
	createStory: z.infer<typeof CreateStoryOutputSchema>;
	createMultipleStories: z.infer<typeof CreateMultipleStoriesOutputSchema>;
	updateMultipleStories: z.infer<typeof UpdateMultipleStoriesOutputSchema>;
	deleteMultipleStories: z.infer<typeof DeleteMultipleStoriesOutputSchema>;
	createStoryFromTemplate: z.infer<typeof CreateStoryFromTemplateOutputSchema>;
	queryStories: z.infer<typeof QueryStoriesOutputSchema>;
	getStory: z.infer<typeof GetStoryOutputSchema>;
	updateStory: z.infer<typeof UpdateStoryOutputSchema>;
	deleteStory: z.infer<typeof DeleteStoryOutputSchema>;
	listStoryComment: z.infer<typeof ListStoryCommentOutputSchema>;
	createStoryComment: z.infer<typeof CreateStoryCommentOutputSchema>;
	getStoryComment: z.infer<typeof GetStoryCommentOutputSchema>;
	updateStoryComment: z.infer<typeof UpdateStoryCommentOutputSchema>;
	deleteStoryComment: z.infer<typeof DeleteStoryCommentOutputSchema>;
	createStoryReaction: z.infer<typeof CreateStoryReactionOutputSchema>;
	deleteStoryReaction: z.infer<typeof DeleteStoryReactionOutputSchema>;
	unlinkCommentThreadFromSlack: z.infer<
		typeof UnlinkCommentThreadFromSlackOutputSchema
	>;
	storyHistory: z.infer<typeof StoryHistoryOutputSchema>;
	listStorySubTasks: z.infer<typeof ListStorySubTasksOutputSchema>;
	createTask: z.infer<typeof CreateTaskOutputSchema>;
	getTask: z.infer<typeof GetTaskOutputSchema>;
	updateTask: z.infer<typeof UpdateTaskOutputSchema>;
	deleteTask: z.infer<typeof DeleteTaskOutputSchema>;
	createStoryLink: z.infer<typeof CreateStoryLinkOutputSchema>;
	getStoryLink: z.infer<typeof GetStoryLinkOutputSchema>;
	updateStoryLink: z.infer<typeof UpdateStoryLinkOutputSchema>;
	deleteStoryLink: z.infer<typeof DeleteStoryLinkOutputSchema>;
	listWorkflows: z.infer<typeof ListWorkflowsOutputSchema>;
	getWorkflow: z.infer<typeof GetWorkflowOutputSchema>;
};
export const ShortcutEndpointInputSchemas = {
	listCategories: ListCategoriesInputSchema,
	createCategory: CreateCategoryInputSchema,
	getCategory: GetCategoryInputSchema,
	updateCategory: UpdateCategoryInputSchema,
	deleteCategory: DeleteCategoryInputSchema,
	listCategoryMilestones: ListCategoryMilestonesInputSchema,
	listCategoryObjectives: ListCategoryObjectivesInputSchema,
	listCustomFields: ListCustomFieldsInputSchema,
	getCustomField: GetCustomFieldInputSchema,
	updateCustomField: UpdateCustomFieldInputSchema,
	deleteCustomField: DeleteCustomFieldInputSchema,
	listDocs: ListDocsInputSchema,
	createDoc: CreateDocInputSchema,
	getDoc: GetDocInputSchema,
	updateDoc: UpdateDocInputSchema,
	deleteDoc: DeleteDocInputSchema,
	listDocumentEpics: ListDocumentEpicsInputSchema,
	linkDocumentToEpic: LinkDocumentToEpicInputSchema,
	unlinkDocumentFromEpic: UnlinkDocumentFromEpicInputSchema,
	listEntityTemplates: ListEntityTemplatesInputSchema,
	createEntityTemplate: CreateEntityTemplateInputSchema,
	disableStoryTemplates: DisableStoryTemplatesInputSchema,
	enableStoryTemplates: EnableStoryTemplatesInputSchema,
	getEntityTemplate: GetEntityTemplateInputSchema,
	updateEntityTemplate: UpdateEntityTemplateInputSchema,
	deleteEntityTemplate: DeleteEntityTemplateInputSchema,
	getEpicWorkflow: GetEpicWorkflowInputSchema,
	listEpics: ListEpicsInputSchema,
	createEpic: CreateEpicInputSchema,
	listEpicsPaginated: ListEpicsPaginatedInputSchema,
	getEpic: GetEpicInputSchema,
	updateEpic: UpdateEpicInputSchema,
	deleteEpic: DeleteEpicInputSchema,
	listEpicComments: ListEpicCommentsInputSchema,
	createEpicComment: CreateEpicCommentInputSchema,
	createEpicCommentComment: CreateEpicCommentCommentInputSchema,
	getEpicComment: GetEpicCommentInputSchema,
	updateEpicComment: UpdateEpicCommentInputSchema,
	deleteEpicComment: DeleteEpicCommentInputSchema,
	listEpicDocuments: ListEpicDocumentsInputSchema,
	getEpicHealth: GetEpicHealthInputSchema,
	createEpicHealth: CreateEpicHealthInputSchema,
	listEpicHealths: ListEpicHealthsInputSchema,
	listEpicStories: ListEpicStoriesInputSchema,
	getExternalLinkStories: GetExternalLinkStoriesInputSchema,
	listFiles: ListFilesInputSchema,
	uploadFiles: UploadFilesInputSchema,
	getFile: GetFileInputSchema,
	updateFile: UpdateFileInputSchema,
	deleteFile: DeleteFileInputSchema,
	listGroups: ListGroupsInputSchema,
	createGroup: CreateGroupInputSchema,
	getGroup: GetGroupInputSchema,
	updateGroup: UpdateGroupInputSchema,
	listGroupStories: ListGroupStoriesInputSchema,
	updateHealth: UpdateHealthInputSchema,
	listIterations: ListIterationsInputSchema,
	createIteration: CreateIterationInputSchema,
	disableIterations: DisableIterationsInputSchema,
	enableIterations: EnableIterationsInputSchema,
	getIteration: GetIterationInputSchema,
	updateIteration: UpdateIterationInputSchema,
	deleteIteration: DeleteIterationInputSchema,
	listIterationStories: ListIterationStoriesInputSchema,
	getKeyResult: GetKeyResultInputSchema,
	updateKeyResult: UpdateKeyResultInputSchema,
	listLabels: ListLabelsInputSchema,
	createLabel: CreateLabelInputSchema,
	getLabel: GetLabelInputSchema,
	updateLabel: UpdateLabelInputSchema,
	deleteLabel: DeleteLabelInputSchema,
	listLabelEpics: ListLabelEpicsInputSchema,
	listLabelStories: ListLabelStoriesInputSchema,
	listLinkedFiles: ListLinkedFilesInputSchema,
	createLinkedFile: CreateLinkedFileInputSchema,
	getLinkedFile: GetLinkedFileInputSchema,
	updateLinkedFile: UpdateLinkedFileInputSchema,
	deleteLinkedFile: DeleteLinkedFileInputSchema,
	getCurrentMemberInfo: GetCurrentMemberInfoInputSchema,
	listMembers: ListMembersInputSchema,
	getMember: GetMemberInputSchema,
	listMilestones: ListMilestonesInputSchema,
	createMilestone: CreateMilestoneInputSchema,
	getMilestone: GetMilestoneInputSchema,
	updateMilestone: UpdateMilestoneInputSchema,
	deleteMilestone: DeleteMilestoneInputSchema,
	listMilestoneEpics: ListMilestoneEpicsInputSchema,
	listObjectives: ListObjectivesInputSchema,
	createObjective: CreateObjectiveInputSchema,
	getObjective: GetObjectiveInputSchema,
	updateObjective: UpdateObjectiveInputSchema,
	deleteObjective: DeleteObjectiveInputSchema,
	listObjectiveEpics: ListObjectiveEpicsInputSchema,
	getObjectiveHealth: GetObjectiveHealthInputSchema,
	createObjectiveHealth: CreateObjectiveHealthInputSchema,
	listObjectiveHealths: ListObjectiveHealthsInputSchema,
	listProjects: ListProjectsInputSchema,
	createProject: CreateProjectInputSchema,
	getProject: GetProjectInputSchema,
	updateProject: UpdateProjectInputSchema,
	deleteProject: DeleteProjectInputSchema,
	listStories: ListStoriesInputSchema,
	listRepositories: ListRepositoriesInputSchema,
	getRepository: GetRepositoryInputSchema,
	search: SearchInputSchema,
	searchDocuments: SearchDocumentsInputSchema,
	searchEpics: SearchEpicsInputSchema,
	searchIterations: SearchIterationsInputSchema,
	searchMilestones: SearchMilestonesInputSchema,
	searchObjectives: SearchObjectivesInputSchema,
	searchStories: SearchStoriesInputSchema,
	createStory: CreateStoryInputSchema,
	createMultipleStories: CreateMultipleStoriesInputSchema,
	updateMultipleStories: UpdateMultipleStoriesInputSchema,
	deleteMultipleStories: DeleteMultipleStoriesInputSchema,
	createStoryFromTemplate: CreateStoryFromTemplateInputSchema,
	queryStories: QueryStoriesInputSchema,
	getStory: GetStoryInputSchema,
	updateStory: UpdateStoryInputSchema,
	deleteStory: DeleteStoryInputSchema,
	listStoryComment: ListStoryCommentInputSchema,
	createStoryComment: CreateStoryCommentInputSchema,
	getStoryComment: GetStoryCommentInputSchema,
	updateStoryComment: UpdateStoryCommentInputSchema,
	deleteStoryComment: DeleteStoryCommentInputSchema,
	createStoryReaction: CreateStoryReactionInputSchema,
	deleteStoryReaction: DeleteStoryReactionInputSchema,
	unlinkCommentThreadFromSlack: UnlinkCommentThreadFromSlackInputSchema,
	storyHistory: StoryHistoryInputSchema,
	listStorySubTasks: ListStorySubTasksInputSchema,
	createTask: CreateTaskInputSchema,
	getTask: GetTaskInputSchema,
	updateTask: UpdateTaskInputSchema,
	deleteTask: DeleteTaskInputSchema,
	createStoryLink: CreateStoryLinkInputSchema,
	getStoryLink: GetStoryLinkInputSchema,
	updateStoryLink: UpdateStoryLinkInputSchema,
	deleteStoryLink: DeleteStoryLinkInputSchema,
	listWorkflows: ListWorkflowsInputSchema,
	getWorkflow: GetWorkflowInputSchema,
} as const;
export const ShortcutEndpointOutputSchemas = {
	listCategories: ListCategoriesOutputSchema,
	createCategory: CreateCategoryOutputSchema,
	getCategory: GetCategoryOutputSchema,
	updateCategory: UpdateCategoryOutputSchema,
	deleteCategory: DeleteCategoryOutputSchema,
	listCategoryMilestones: ListCategoryMilestonesOutputSchema,
	listCategoryObjectives: ListCategoryObjectivesOutputSchema,
	listCustomFields: ListCustomFieldsOutputSchema,
	getCustomField: GetCustomFieldOutputSchema,
	updateCustomField: UpdateCustomFieldOutputSchema,
	deleteCustomField: DeleteCustomFieldOutputSchema,
	listDocs: ListDocsOutputSchema,
	createDoc: CreateDocOutputSchema,
	getDoc: GetDocOutputSchema,
	updateDoc: UpdateDocOutputSchema,
	deleteDoc: DeleteDocOutputSchema,
	listDocumentEpics: ListDocumentEpicsOutputSchema,
	linkDocumentToEpic: LinkDocumentToEpicOutputSchema,
	unlinkDocumentFromEpic: UnlinkDocumentFromEpicOutputSchema,
	listEntityTemplates: ListEntityTemplatesOutputSchema,
	createEntityTemplate: CreateEntityTemplateOutputSchema,
	disableStoryTemplates: DisableStoryTemplatesOutputSchema,
	enableStoryTemplates: EnableStoryTemplatesOutputSchema,
	getEntityTemplate: GetEntityTemplateOutputSchema,
	updateEntityTemplate: UpdateEntityTemplateOutputSchema,
	deleteEntityTemplate: DeleteEntityTemplateOutputSchema,
	getEpicWorkflow: GetEpicWorkflowOutputSchema,
	listEpics: ListEpicsOutputSchema,
	createEpic: CreateEpicOutputSchema,
	listEpicsPaginated: ListEpicsPaginatedOutputSchema,
	getEpic: GetEpicOutputSchema,
	updateEpic: UpdateEpicOutputSchema,
	deleteEpic: DeleteEpicOutputSchema,
	listEpicComments: ListEpicCommentsOutputSchema,
	createEpicComment: CreateEpicCommentOutputSchema,
	createEpicCommentComment: CreateEpicCommentCommentOutputSchema,
	getEpicComment: GetEpicCommentOutputSchema,
	updateEpicComment: UpdateEpicCommentOutputSchema,
	deleteEpicComment: DeleteEpicCommentOutputSchema,
	listEpicDocuments: ListEpicDocumentsOutputSchema,
	getEpicHealth: GetEpicHealthOutputSchema,
	createEpicHealth: CreateEpicHealthOutputSchema,
	listEpicHealths: ListEpicHealthsOutputSchema,
	listEpicStories: ListEpicStoriesOutputSchema,
	getExternalLinkStories: GetExternalLinkStoriesOutputSchema,
	listFiles: ListFilesOutputSchema,
	uploadFiles: UploadFilesOutputSchema,
	getFile: GetFileOutputSchema,
	updateFile: UpdateFileOutputSchema,
	deleteFile: DeleteFileOutputSchema,
	listGroups: ListGroupsOutputSchema,
	createGroup: CreateGroupOutputSchema,
	getGroup: GetGroupOutputSchema,
	updateGroup: UpdateGroupOutputSchema,
	listGroupStories: ListGroupStoriesOutputSchema,
	updateHealth: UpdateHealthOutputSchema,
	listIterations: ListIterationsOutputSchema,
	createIteration: CreateIterationOutputSchema,
	disableIterations: DisableIterationsOutputSchema,
	enableIterations: EnableIterationsOutputSchema,
	getIteration: GetIterationOutputSchema,
	updateIteration: UpdateIterationOutputSchema,
	deleteIteration: DeleteIterationOutputSchema,
	listIterationStories: ListIterationStoriesOutputSchema,
	getKeyResult: GetKeyResultOutputSchema,
	updateKeyResult: UpdateKeyResultOutputSchema,
	listLabels: ListLabelsOutputSchema,
	createLabel: CreateLabelOutputSchema,
	getLabel: GetLabelOutputSchema,
	updateLabel: UpdateLabelOutputSchema,
	deleteLabel: DeleteLabelOutputSchema,
	listLabelEpics: ListLabelEpicsOutputSchema,
	listLabelStories: ListLabelStoriesOutputSchema,
	listLinkedFiles: ListLinkedFilesOutputSchema,
	createLinkedFile: CreateLinkedFileOutputSchema,
	getLinkedFile: GetLinkedFileOutputSchema,
	updateLinkedFile: UpdateLinkedFileOutputSchema,
	deleteLinkedFile: DeleteLinkedFileOutputSchema,
	getCurrentMemberInfo: GetCurrentMemberInfoOutputSchema,
	listMembers: ListMembersOutputSchema,
	getMember: GetMemberOutputSchema,
	listMilestones: ListMilestonesOutputSchema,
	createMilestone: CreateMilestoneOutputSchema,
	getMilestone: GetMilestoneOutputSchema,
	updateMilestone: UpdateMilestoneOutputSchema,
	deleteMilestone: DeleteMilestoneOutputSchema,
	listMilestoneEpics: ListMilestoneEpicsOutputSchema,
	listObjectives: ListObjectivesOutputSchema,
	createObjective: CreateObjectiveOutputSchema,
	getObjective: GetObjectiveOutputSchema,
	updateObjective: UpdateObjectiveOutputSchema,
	deleteObjective: DeleteObjectiveOutputSchema,
	listObjectiveEpics: ListObjectiveEpicsOutputSchema,
	getObjectiveHealth: GetObjectiveHealthOutputSchema,
	createObjectiveHealth: CreateObjectiveHealthOutputSchema,
	listObjectiveHealths: ListObjectiveHealthsOutputSchema,
	listProjects: ListProjectsOutputSchema,
	createProject: CreateProjectOutputSchema,
	getProject: GetProjectOutputSchema,
	updateProject: UpdateProjectOutputSchema,
	deleteProject: DeleteProjectOutputSchema,
	listStories: ListStoriesOutputSchema,
	listRepositories: ListRepositoriesOutputSchema,
	getRepository: GetRepositoryOutputSchema,
	search: SearchOutputSchema,
	searchDocuments: SearchDocumentsOutputSchema,
	searchEpics: SearchEpicsOutputSchema,
	searchIterations: SearchIterationsOutputSchema,
	searchMilestones: SearchMilestonesOutputSchema,
	searchObjectives: SearchObjectivesOutputSchema,
	searchStories: SearchStoriesOutputSchema,
	createStory: CreateStoryOutputSchema,
	createMultipleStories: CreateMultipleStoriesOutputSchema,
	updateMultipleStories: UpdateMultipleStoriesOutputSchema,
	deleteMultipleStories: DeleteMultipleStoriesOutputSchema,
	createStoryFromTemplate: CreateStoryFromTemplateOutputSchema,
	queryStories: QueryStoriesOutputSchema,
	getStory: GetStoryOutputSchema,
	updateStory: UpdateStoryOutputSchema,
	deleteStory: DeleteStoryOutputSchema,
	listStoryComment: ListStoryCommentOutputSchema,
	createStoryComment: CreateStoryCommentOutputSchema,
	getStoryComment: GetStoryCommentOutputSchema,
	updateStoryComment: UpdateStoryCommentOutputSchema,
	deleteStoryComment: DeleteStoryCommentOutputSchema,
	createStoryReaction: CreateStoryReactionOutputSchema,
	deleteStoryReaction: DeleteStoryReactionOutputSchema,
	unlinkCommentThreadFromSlack: UnlinkCommentThreadFromSlackOutputSchema,
	storyHistory: StoryHistoryOutputSchema,
	listStorySubTasks: ListStorySubTasksOutputSchema,
	createTask: CreateTaskOutputSchema,
	getTask: GetTaskOutputSchema,
	updateTask: UpdateTaskOutputSchema,
	deleteTask: DeleteTaskOutputSchema,
	createStoryLink: CreateStoryLinkOutputSchema,
	getStoryLink: GetStoryLinkOutputSchema,
	updateStoryLink: UpdateStoryLinkOutputSchema,
	deleteStoryLink: DeleteStoryLinkOutputSchema,
	listWorkflows: ListWorkflowsOutputSchema,
	getWorkflow: GetWorkflowOutputSchema,
} as const;
