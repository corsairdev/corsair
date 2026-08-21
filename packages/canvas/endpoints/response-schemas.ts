import { z } from 'zod';
import type { CanvasOperation, CanvasOperationName } from './operations';
import { canvasOperations } from './operations';

/**
 * Response schemas aligned with Canvas LMS REST API object shapes
 * (https://canvas.instructure.com/doc/api/). Extra fields allowed via passthrough;
 * required `id` rejects empty/malformed objects for entity endpoints.
 */

const idSchema = z.union([z.string(), z.number()]);

export const CanvasEntitySchema = z
	.object({
		id: idSchema,
	})
	.passthrough();
export type CanvasEntity = z.infer<typeof CanvasEntitySchema>;

export const CanvasEntityListSchema = z.array(CanvasEntitySchema);
export type CanvasEntityList = z.infer<typeof CanvasEntityListSchema>;

/** Course — https://canvas.instructure.com/doc/api/courses.html */
export const CanvasCourseSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		course_code: z.string().optional(),
		uuid: z.string().optional(),
		sis_course_id: z.string().nullable().optional(),
		account_id: idSchema.optional(),
		root_account_id: idSchema.optional(),
		enrollment_term_id: idSchema.optional(),
		workflow_state: z
			.enum(['unpublished', 'available', 'completed', 'deleted'])
			.or(z.string())
			.optional(),
		start_at: z.string().nullable().optional(),
		end_at: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();
export type CanvasCourse = z.infer<typeof CanvasCourseSchema>;

/** Account — https://canvas.instructure.com/doc/api/accounts.html */
export const CanvasAccountSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		uuid: z.string().optional(),
		parent_account_id: idSchema.nullable().optional(),
		root_account_id: idSchema.optional(),
		default_storage_quota_mb: z.number().optional(),
		default_user_storage_quota_mb: z.number().optional(),
		default_group_storage_quota_mb: z.number().optional(),
		default_time_zone: z.string().optional(),
		sis_account_id: z.string().nullable().optional(),
		workflow_state: z.string().optional(),
	})
	.passthrough();
export type CanvasAccount = z.infer<typeof CanvasAccountSchema>;

/** User — https://canvas.instructure.com/doc/api/users.html */
export const CanvasUserSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		sortable_name: z.string().optional(),
		short_name: z.string().optional(),
		sis_user_id: z.string().nullable().optional(),
		login_id: z.string().optional(),
		email: z.string().optional(),
		avatar_url: z.string().optional(),
		locale: z.string().nullable().optional(),
		effective_locale: z.string().optional(),
	})
	.passthrough();
export type CanvasUser = z.infer<typeof CanvasUserSchema>;

/** Assignment — https://canvas.instructure.com/doc/api/assignments.html */
export const CanvasAssignmentSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		due_at: z.string().nullable().optional(),
		lock_at: z.string().nullable().optional(),
		unlock_at: z.string().nullable().optional(),
		course_id: idSchema.optional(),
		assignment_group_id: idSchema.optional(),
		points_possible: z.number().nullable().optional(),
		grading_type: z.string().optional(),
		published: z.boolean().optional(),
		submission_types: z.array(z.string()).optional(),
	})
	.passthrough();
export type CanvasAssignment = z.infer<typeof CanvasAssignmentSchema>;

/** Enrollment — https://canvas.instructure.com/doc/api/enrollments.html */
export const CanvasEnrollmentSchema = z
	.object({
		id: idSchema,
		user_id: idSchema.optional(),
		course_id: idSchema.optional(),
		type: z.string().optional(),
		enrollment_state: z.string().optional(),
		role: z.string().optional(),
		role_id: idSchema.optional(),
		last_activity_at: z.string().nullable().optional(),
		last_attended_at: z.string().nullable().optional(),
	})
	.passthrough();
export type CanvasEnrollment = z.infer<typeof CanvasEnrollmentSchema>;

/** Quiz — https://canvas.instructure.com/doc/api/quizzes.html */
export const CanvasQuizSchema = z
	.object({
		id: idSchema,
		title: z.string().optional(),
		html_url: z.string().optional(),
		mobile_url: z.string().optional(),
		description: z.string().nullable().optional(),
		quiz_type: z.string().optional(),
		assignment_id: idSchema.nullable().optional(),
		time_limit: z.number().nullable().optional(),
		published: z.boolean().optional(),
		points_possible: z.number().nullable().optional(),
	})
	.passthrough();
export type CanvasQuiz = z.infer<typeof CanvasQuizSchema>;

/** Module — https://canvas.instructure.com/doc/api/modules.html */
export const CanvasModuleSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		position: z.number().optional(),
		unlock_at: z.string().nullable().optional(),
		require_sequential_progress: z.boolean().optional(),
		publish_final_grade: z.boolean().nullable().optional(),
		prerequisite_module_ids: z.array(idSchema).optional(),
		published: z.boolean().optional(),
		items_count: z.number().optional(),
	})
	.passthrough();
export type CanvasModule = z.infer<typeof CanvasModuleSchema>;

/** DiscussionTopic — https://canvas.instructure.com/doc/api/discussion_topics.html */
export const CanvasDiscussionTopicSchema = z
	.object({
		id: idSchema,
		title: z.string().optional(),
		message: z.string().optional(),
		html_url: z.string().optional(),
		posted_at: z.string().nullable().optional(),
		discussion_type: z.string().optional(),
		published: z.boolean().optional(),
		locked: z.boolean().optional(),
		pinned: z.boolean().optional(),
	})
	.passthrough();
export type CanvasDiscussionTopic = z.infer<typeof CanvasDiscussionTopicSchema>;

/** Conversation — https://canvas.instructure.com/doc/api/conversations.html */
export const CanvasConversationSchema = z
	.object({
		id: idSchema,
		subject: z.string().nullable().optional(),
		workflow_state: z.string().optional(),
		last_message: z.string().nullable().optional(),
		last_message_at: z.string().nullable().optional(),
		message_count: z.number().optional(),
		subscribed: z.boolean().optional(),
		private: z.boolean().optional(),
		starred: z.boolean().optional(),
	})
	.passthrough();
export type CanvasConversation = z.infer<typeof CanvasConversationSchema>;

/** File — https://canvas.instructure.com/doc/api/files.html */
export const CanvasFileSchema = z
	.object({
		id: idSchema,
		uuid: z.string().optional(),
		folder_id: idSchema.optional(),
		display_name: z.string().optional(),
		filename: z.string().optional(),
		content_type: z.string().optional(),
		url: z.string().optional(),
		size: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type CanvasFile = z.infer<typeof CanvasFileSchema>;

/** Group — https://canvas.instructure.com/doc/api/groups.html */
export const CanvasGroupSchema = z
	.object({
		id: idSchema,
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		is_public: z.boolean().optional(),
		followed_by_user: z.boolean().optional(),
		join_level: z.string().optional(),
		members_count: z.number().optional(),
		avatar_url: z.string().optional(),
		context_type: z.string().optional(),
		course_id: idSchema.optional(),
		account_id: idSchema.optional(),
	})
	.passthrough();
export type CanvasGroup = z.infer<typeof CanvasGroupSchema>;

/** Page — https://canvas.instructure.com/doc/api/pages.html */
export const CanvasPageSchema = z
	.object({
		page_id: idSchema.optional(),
		url: z.string().optional(),
		title: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		hide_from_students: z.boolean().optional(),
		editing_roles: z.string().optional(),
		published: z.boolean().optional(),
		front_page: z.boolean().optional(),
		html_url: z.string().optional(),
	})
	.passthrough()
	.refine(
		(value) =>
			value.page_id !== undefined ||
			value.url !== undefined ||
			value.title !== undefined,
		'Canvas page responses require page_id, url, or title',
	);
export type CanvasPage = z.infer<typeof CanvasPageSchema>;

export const CanvasGraphqlResponseSchema = z
	.object({
		data: z.unknown().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.passthrough();
export type CanvasGraphqlResponse = z.infer<typeof CanvasGraphqlResponseSchema>;

export const CanvasDeleteResponseSchema = z.union([
	CanvasEntitySchema,
	CanvasEntityListSchema,
	z.undefined(),
	z.null(),
]);
export type CanvasDeleteResponse = z.infer<typeof CanvasDeleteResponseSchema>;

export const CanvasTextResponseSchema = z.union([
	z.string(),
	CanvasEntitySchema,
	z.undefined(),
]);
export type CanvasTextResponse = z.infer<typeof CanvasTextResponseSchema>;

export const CanvasPermissionsSchema = z.record(z.string(), z.boolean());
export type CanvasPermissions = z.infer<typeof CanvasPermissionsSchema>;

export const CanvasUnreadCountSchema = z
	.object({
		unread_count: z.number(),
	})
	.passthrough();
export type CanvasUnreadCount = z.infer<typeof CanvasUnreadCountSchema>;

export const CanvasQuotaSchema = z
	.object({
		quota: z.number().optional(),
		quota_used: z.number().optional(),
	})
	.passthrough();
export type CanvasQuota = z.infer<typeof CanvasQuotaSchema>;

export const CanvasSubmissionSummarySchema = z
	.object({
		graded: z.number().optional(),
		ungraded: z.number().optional(),
		not_submitted: z.number().optional(),
	})
	.passthrough();
export type CanvasSubmissionSummary = z.infer<
	typeof CanvasSubmissionSummarySchema
>;

export const CanvasJsonObjectSchema = z.record(z.string(), z.unknown());
export type CanvasJsonObject = z.infer<typeof CanvasJsonObjectSchema>;

export const CanvasJsonArraySchema = z.array(z.unknown());
export type CanvasJsonArray = z.infer<typeof CanvasJsonArraySchema>;

/** GET .../statistics → `{ quiz_statistics: [...] }` */
export const CanvasQuizStatisticsResponseSchema = z
	.object({
		quiz_statistics: z.array(z.unknown()),
	})
	.passthrough();

/** GET .../outcome_results → `{ outcome_results: [...], linked?: ... }` */
export const CanvasOutcomeResultsResponseSchema = z
	.object({
		outcome_results: z.array(z.unknown()),
		linked: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

/** POST batch assignment overrides → array of overrides */
export const CanvasAssignmentOverrideListSchema = z.array(CanvasEntitySchema);

/** Polls API wraps creates as `{ polls: [...] }` etc. */
export const CanvasPollsWrapperSchema = z
	.object({ polls: z.array(z.unknown()) })
	.passthrough();
export const CanvasPollChoicesWrapperSchema = z
	.object({ poll_choices: z.array(z.unknown()) })
	.passthrough();
export const CanvasPollSessionsWrapperSchema = z
	.object({ poll_sessions: z.array(z.unknown()) })
	.passthrough();
export const CanvasPollSubmissionsWrapperSchema = z
	.object({ poll_submissions: z.array(z.unknown()) })
	.passthrough();

const LIST_NAME =
	/^(getAll|find|getAccountsThat|getAccountNotifications|getEnrollmentInvitations|getCourses12|getAUsersMostRecently|getAllPeer|getAllOutcome|getAllEPortfolios|getAligned|getCoursesBlueprint)/i;

function isListOperation(name: string, operation: CanvasOperation): boolean {
	if (LIST_NAME.test(name)) return true;
	if (operation.method !== 'GET') return false;
	const path = operation.path;
	// Singletons / non-collection GETs from Canvas docs.
	if (
		/\/(self|unread_count|quota|permissions|upload|kaltura|brand_variables|late_policy|root_outcome_group)(\/|$)/.test(
			path,
		)
	) {
		return false;
	}
	const last = path.split('/').pop() ?? '';
	if (!last || last.includes('{')) return false;
	// Plural resource segment → collection list.
	return /s$/.test(last) || last === 'recipients' || last === 'overrides';
}

function resourceSchemaFor(
	name: string,
	operation: CanvasOperation,
): z.ZodTypeAny {
	const path = operation.path.toLowerCase();
	const key = name.toLowerCase();

	if (key.includes('permission')) return CanvasPermissionsSchema;
	if (key.includes('unreadcount')) return CanvasUnreadCountSchema;
	if (key.includes('quota')) return CanvasQuotaSchema;
	if (key.includes('submissionsummary')) return CanvasSubmissionSummarySchema;
	if (name === 'getQuizStatistics') return CanvasQuizStatisticsResponseSchema;
	if (name === 'getOutcomeResults') return CanvasOutcomeResultsResponseSchema;
	if (name === 'createBatchOverridesInACourse') {
		return CanvasAssignmentOverrideListSchema;
	}
	if (name === 'createSinglePoll') return CanvasPollsWrapperSchema;
	if (name === 'createSinglePollChoice') return CanvasPollChoicesWrapperSchema;
	if (name === 'createSinglePollSession') {
		return CanvasPollSessionsWrapperSchema;
	}
	if (name === 'createSinglePollSubmission') {
		return CanvasPollSubmissionsWrapperSchema;
	}

	if (
		key.includes('customcolors') ||
		key.includes('dashboardpositions') ||
		key.includes('brandvariables') ||
		key.includes('kalturaconfig') ||
		key.includes('readstate') ||
		key.includes('latepolicy') ||
		key.includes('moduleitemsequence') ||
		key.includes('helplinks') ||
		key.includes('customcolor') ||
		key.includes('statusoflastreport') ||
		key.includes('fulltopic')
	) {
		return CanvasJsonObjectSchema;
	}
	if (key.includes('participationdata') || key.includes('activitystream')) {
		return CanvasJsonArraySchema;
	}

	if (key.includes('page') || path.includes('/pages')) return CanvasPageSchema;
	if (key.includes('quiz') || path.includes('/quizzes'))
		return CanvasQuizSchema;
	if (key.includes('module') || path.includes('/modules')) {
		return CanvasModuleSchema;
	}
	if (
		key.includes('discussion') ||
		key.includes('topic') ||
		path.includes('/discussion_topics')
	) {
		return CanvasDiscussionTopicSchema;
	}
	if (key.includes('conversation') || path.includes('/conversations')) {
		return CanvasConversationSchema;
	}
	if (
		key.includes('file') ||
		key.includes('folder') ||
		path.includes('/files') ||
		path.includes('/folders')
	) {
		return CanvasFileSchema;
	}
	if (key.includes('group') || path.includes('/groups')) {
		return CanvasGroupSchema;
	}
	if (key.includes('enrollment') || path.includes('/enrollments')) {
		return CanvasEnrollmentSchema;
	}
	if (key.includes('assignment') || path.includes('/assignments')) {
		return CanvasAssignmentSchema;
	}
	if (
		key.includes('course') ||
		key.includes('favorite') ||
		(path.includes('/courses') && !path.includes('/users/'))
	) {
		return CanvasCourseSchema;
	}
	if (
		(key.includes('account') && !key.includes('notification')) ||
		(path.includes('/accounts') && !path.includes('/courses'))
	) {
		return CanvasAccountSchema;
	}
	if (
		key.includes('user') ||
		key.includes('profile') ||
		key.includes('recipient') ||
		path.includes('/users')
	) {
		return CanvasUserSchema;
	}

	return CanvasEntitySchema;
}

/**
 * Operation-specific Canvas output schema (resource + list/singleton cardinality).
 */
export function createResponseSchema(
	name: CanvasOperationName,
	operation: CanvasOperation,
): z.ZodTypeAny {
	if (operation.path === '/api/graphql') {
		return CanvasGraphqlResponseSchema;
	}
	if (operation.method === 'DELETE') {
		return CanvasDeleteResponseSchema;
	}
	if (operation.path.includes('/upload')) {
		return CanvasTextResponseSchema;
	}

	const resource = resourceSchemaFor(name, operation);
	if (
		resource === CanvasPermissionsSchema ||
		resource === CanvasUnreadCountSchema ||
		resource === CanvasQuotaSchema ||
		resource === CanvasSubmissionSummarySchema ||
		resource === CanvasJsonObjectSchema ||
		resource === CanvasJsonArraySchema ||
		resource === CanvasQuizStatisticsResponseSchema ||
		resource === CanvasOutcomeResultsResponseSchema ||
		resource === CanvasAssignmentOverrideListSchema ||
		resource === CanvasPollsWrapperSchema ||
		resource === CanvasPollChoicesWrapperSchema ||
		resource === CanvasPollSessionsWrapperSchema ||
		resource === CanvasPollSubmissionsWrapperSchema
	) {
		return resource;
	}

	if (isListOperation(name, operation)) {
		return z.array(resource);
	}

	return resource;
}

/** True when the operation's Zod output expects a top-level JSON array. */
export function expectsListResponse(
	name: CanvasOperationName,
	operation: CanvasOperation = canvasOperations[name],
): boolean {
	if (operation.path === '/api/graphql') return false;
	if (operation.method === 'DELETE') return false;
	if (operation.path.includes('/upload')) return false;
	if (name === 'createBatchOverridesInACourse') return true;
	const resource = resourceSchemaFor(name, operation);
	if (
		resource === CanvasPermissionsSchema ||
		resource === CanvasUnreadCountSchema ||
		resource === CanvasQuotaSchema ||
		resource === CanvasSubmissionSummarySchema ||
		resource === CanvasJsonObjectSchema ||
		resource === CanvasJsonArraySchema ||
		resource === CanvasQuizStatisticsResponseSchema ||
		resource === CanvasOutcomeResultsResponseSchema ||
		resource === CanvasPollsWrapperSchema ||
		resource === CanvasPollChoicesWrapperSchema ||
		resource === CanvasPollSessionsWrapperSchema ||
		resource === CanvasPollSubmissionsWrapperSchema
	) {
		return resource === CanvasJsonArraySchema;
	}
	if (resource === CanvasAssignmentOverrideListSchema) return true;
	return isListOperation(name, operation);
}

export const CanvasEndpointOutputSchemas = Object.fromEntries(
	Object.entries(canvasOperations).map(([name, operation]) => [
		name,
		createResponseSchema(name as CanvasOperationName, operation),
	]),
) as { [K in CanvasOperationName]: z.ZodTypeAny };

/** Public per-operation output types — not a blanket `unknown`. */
export type CanvasEndpointOutputs = {
	[K in CanvasOperationName]: z.infer<(typeof CanvasEndpointOutputSchemas)[K]>;
};
