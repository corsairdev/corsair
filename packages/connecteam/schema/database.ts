import { z } from 'zod';

/**
 * Locally persisted Connecteam entities.
 *
 * Field names match official JSON keys from
 * https://developer.connecteam.com/llms.txt and the OpenAPI components on
 * each reference page. Each field is labeled from that spec. Only the
 * primary key is required: Connecteam omits or nulls fields by plan,
 * permission, and feature enablement.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * User. Official: https://developer.connecteam.com/reference/get_users_users_v1_users_get
 * OpenAPI `User`.
 */
export const ConnecteamUserEntity = z
	.object({
		/** The user's unique id. */
		userId: z.number(),
		/** The user's first name. */
		firstName: S,
		/** The user's last name. */
		lastName: S,
		/** The user's phone number. Unique identifier on create. */
		phoneNumber: S,
		/** user | manager | owner. */
		userType: S,
		/** The user's email (mandatory for managers and owners). */
		email: S,
		/** The user's custom fields. */
		customFields: z.array(z.unknown()).optional(),
		/** The user's archived status. */
		isArchived: B,
		/** The code for the user to access the kiosk app. */
		kioskCode: S,
		/** Unix timestamp when the user was first created. */
		createdAt: N,
		/** Unix timestamp of the most recent change to any user field. */
		modifiedAt: N,
		/** Unix timestamp when the user was archived. */
		archivedAt: N,
		/** Last login timestamp; docs default 0. */
		lastLogin: N,
		/** Smart group ids the user is a member of. */
		smartGroupsIds: z.array(z.number()).optional(),
		/** Whether the user is invited to be a manager. */
		invitedToBeManager: B,
		/** Profile picture URL; null if unset. */
		profilePictureUrl: S,
		/** Mobile device model from last app login. */
		mobileDevice: S,
		/** Mobile OS version from last app login. */
		osVersion: S,
		/** Connecteam mobile app version. */
		appVersion: S,
		/** Unique identifier of the user's mobile device. */
		mobileDeviceId: S,
	})
	.loose();
export type ConnecteamUserEntity = z.infer<typeof ConnecteamUserEntity>;

/**
 * Custom field definition.
 * Docs: https://developer.connecteam.com/docs/get-custom-fields
 */
export const ConnecteamCustomFieldEntity = z
	.object({
		/** Custom field unique id. */
		id: z.number(),
		/** Display name. */
		name: S,
		/** Field type (email, date, phone, number, str, dropdown, …). */
		type: S,
		/** Category this field belongs to. */
		categoryId: N,
		/** Whether the field is required. */
		isRequired: B,
		/** Visible to all admins. */
		isVisibleToAllAdmins: B,
		/** Editable by all admins. */
		isEditableForAllAdmins: B,
		/** Visible to users. */
		isVisibleToUsers: B,
		/** Editable by users. */
		isEditableForUsers: B,
		/** Dropdown: allow multiple selected values. */
		isMultiSelect: B,
		/** Dropdown options when type is dropdown. */
		dropdownOptions: z.array(z.unknown()).optional(),
	})
	.loose();
export type ConnecteamCustomFieldEntity = z.infer<
	typeof ConnecteamCustomFieldEntity
>;

/**
 * Custom field category.
 * Docs: https://developer.connecteam.com/docs/get-custom-fields-categories
 */
export const ConnecteamCustomFieldCategoryEntity = z
	.object({
		/** Category unique id. */
		id: z.number(),
		/** Category name. */
		name: S,
	})
	.loose();
export type ConnecteamCustomFieldCategoryEntity = z.infer<
	typeof ConnecteamCustomFieldCategoryEntity
>;

/**
 * Smart group. Official: GET /users/v1/smart-groups
 * Docs: https://developer.connecteam.com/docs/smart-groups
 */
export const ConnecteamSmartGroupEntity = z
	.object({
		/** Smart group unique id. */
		id: z.number().optional(),
		/** Some responses use smartGroupId. */
		smartGroupId: N,
		/** Unique name. */
		name: S,
		/** Segment this group belongs to. */
		groupSegmentId: N,
		/** Description. */
		description: S,
	})
	.loose();
export type ConnecteamSmartGroupEntity = z.infer<
	typeof ConnecteamSmartGroupEntity
>;

/**
 * Form definition.
 * Docs: https://developer.connecteam.com/docs/forms-get-forms
 */
export const ConnecteamFormEntity = z
	.object({
		/** Unique form identifier. */
		formId: z.number(),
		/** Form title. */
		formName: S,
		/** Creation time (Unix timestamp). */
		createdAt: N,
		/** Last update time (Unix timestamp). */
		lastUpdatedAt: N,
		/** Form questions. */
		questions: z.array(z.unknown()).optional(),
		/** Form configuration. */
		settings: z.unknown().optional(),
	})
	.loose();
export type ConnecteamFormEntity = z.infer<typeof ConnecteamFormEntity>;

/**
 * Job / resource.
 * Docs: https://developer.connecteam.com/docs/get-jobs
 */
export const ConnecteamJobEntity = z
	.object({
		/** Unique job identifier (UUID string). */
		jobId: z.string(),
		/** Job title. */
		title: S,
		/** Job code. */
		code: S,
		/** Display color. */
		color: S,
		/** Description. */
		description: S,
		/** GPS address / lat / lng. */
		gps: z.unknown().optional(),
		/** Soft-deleted flag. */
		isDeleted: B,
		/** Assignment (type, userIds, groupIds). */
		assign: z.unknown().optional(),
		/** Whether sub-job inherits parent data. */
		useParentData: B,
		/** Parent job id for sub-jobs. */
		parentId: z.union([z.string(), z.null()]).optional(),
		/** Nested sub-jobs. */
		subJobs: z.array(z.unknown()).optional(),
		/** Scheduler or time-clock instance ids. */
		instanceIds: z.array(z.number()).optional(),
		/** Resource custom fields. */
		customFields: z.array(z.unknown()).optional(),
	})
	.loose();
export type ConnecteamJobEntity = z.infer<typeof ConnecteamJobEntity>;

/**
 * Scheduler.
 * Docs: https://developer.connecteam.com/docs/scheduler-get-schedulers
 */
export const ConnecteamSchedulerEntity = z
	.object({
		/** Unique identifier for the scheduler. */
		schedulerId: z.number(),
		/** Display name of the scheduler. */
		name: S,
		/** Whether the scheduler is archived (read-only when true). */
		isArchived: B,
		/** Timezone in IANA format. */
		timezone: S,
	})
	.loose();
export type ConnecteamSchedulerEntity = z.infer<
	typeof ConnecteamSchedulerEntity
>;

/**
 * Task board. Official: GET /tasks/v1/taskboards
 */
export const ConnecteamTaskBoardEntity = z
	.object({
		/** Task board unique id. */
		id: z.union([z.number(), z.string()]).optional(),
		taskBoardId: N,
		/** Display name. */
		name: S,
		title: S,
		/** Whether the task board is archived. */
		isArchived: B,
	})
	.loose();
export type ConnecteamTaskBoardEntity = z.infer<
	typeof ConnecteamTaskBoardEntity
>;

/**
 * Custom publisher. Official: GET /publishers/v1/publishers
 * Docs: https://developer.connecteam.com/docs/chat-custom-publishers
 */
export const ConnecteamPublisherEntity = z
	.object({
		/** Publisher unique id. */
		id: z.number().optional(),
		publisherId: N,
		/** Display name. */
		name: S,
	})
	.loose();
export type ConnecteamPublisherEntity = z.infer<
	typeof ConnecteamPublisherEntity
>;

/**
 * Team chat or channel. Official: GET /chat/v1/conversations
 * Docs: https://developer.connecteam.com/docs/chat-conversations
 */
export const ConnecteamConversationEntity = z
	.object({
		/** Conversation unique id. */
		id: z.union([z.number(), z.string()]).optional(),
		conversationId: z.union([z.number(), z.string()]).optional(),
		/** team | channel. */
		type: S,
		/** Conversation title. */
		title: S,
	})
	.loose();
export type ConnecteamConversationEntity = z.infer<
	typeof ConnecteamConversationEntity
>;

/**
 * Time-off policy type. Official: GET /time-off/v1/policy-types
 * Docs: https://developer.connecteam.com/docs/time-off-policies-balances
 */
const ConnecteamTimeOffPolicy = z
	.object({
		/** Policy unique id. */
		id: z.union([z.string(), z.number()]).optional(),
		/** Policy display name. */
		name: S,
		/** Balance unit (hours/days). */
		unit: S,
		/** Accrual type for this policy. */
		accrualType: S,
	})
	.loose();

export const ConnecteamPolicyTypeEntity = z
	.object({
		/** Policy type id. */
		id: z.union([z.string(), z.number()]).optional(),
		policyTypeId: z.union([z.string(), z.number()]).optional(),
		/** Display name. */
		name: S,
		/** Policies under this type. */
		policies: z.array(ConnecteamTimeOffPolicy).optional(),
	})
	.loose();
export type ConnecteamPolicyTypeEntity = z.infer<
	typeof ConnecteamPolicyTypeEntity
>;

/**
 * Performance metric indicator.
 * Official: GET /users/v1/performance-indicators
 */
export const ConnecteamPerformanceIndicatorEntity = z
	.object({
		/** Indicator unique id. */
		id: z.union([z.string(), z.number()]).optional(),
		/** Display name. */
		name: S,
	})
	.loose();
export type ConnecteamPerformanceIndicatorEntity = z.infer<
	typeof ConnecteamPerformanceIndicatorEntity
>;

/**
 * Authenticated account. Official: GET /me — OpenAPI `MeResponse`.
 */
export const ConnecteamAccountEntity = z
	.object({
		/** Unique identifier of the company. */
		companyId: z.string(),
		/** Name of the company. */
		companyName: S,
	})
	.loose();
export type ConnecteamAccountEntity = z.infer<typeof ConnecteamAccountEntity>;
