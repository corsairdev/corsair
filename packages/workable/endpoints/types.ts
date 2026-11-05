import { z } from 'zod';
import {
	WorkableCandidate,
	WorkableDepartment,
	WorkableEmployee,
	WorkableJob,
	WorkableMember,
} from '../schema/database';

const EmptyInputSchema = z.object({});

const NonEmptyString = z.string().trim().min(1);

const MemberRoleSchema = z.enum([
	'ats.admin',
	'ats.simple',
	'ats.reviewer',
	'hris.admin',
	'hris.employee',
	'hris.limited',
	'workable.superadmin',
]);

/** Builds a loose `{ [key]: row[] }` envelope schema for a reference/config
 * endpoint whose row shape Workable doesn't document in detail (custom
 * attributes, disqualification reasons, permission sets, etc). Loose so a
 * plugin call doesn't fail parsing when the account has custom configuration. */
function listEnvelope(key: string) {
	return (
		z
			// unknown: row shapes are account-configured and undocumented — kept
			// loose so parsing never fails on tenant-specific extras.
			.object({ [key]: z.array(z.record(z.string(), z.unknown())) })
			.loose()
	);
}

/**
 * Rows of a reference endpoint that answers with a bare JSON array rather
 * than an envelope (departments, employee fields, legal entities,
 * disqualification reasons, permission sets, work schedules), matching both
 * Workable's reference and the live API.
 */
function bareList() {
	// unknown: row shapes are account-configured — kept loose, never inspected.
	return z.array(z.record(z.string(), z.unknown()));
}

const WorkableAccount = z
	.object({
		id: z.string().optional(),
		name: z.string().nullish(),
		subdomain: z.string().nullish(),
		description: z.string().nullish(),
		summary: z.string().nullish(),
		website_url: z.string().nullish(),
	})
	// unknown: account payloads carry undocumented extras — catchall keeps parsing loose.
	.catchall(z.unknown());

/**
 * Cursor envelope on /jobs, /candidates and /requisitions. `next` is the URL
 * of the next page; pass its `since_id` back as input to fetch that page.
 */
const PagingSchema = z.object({ next: z.string().optional() }).loose();

const SuccessResponseSchema = z
	.object({
		message: z.string().optional(),
		success: z.boolean().optional(),
	})
	.loose();

export const WorkableEndpointInputSchemas = {
	// accounts
	accountsList: EmptyInputSchema,
	accountsGet: z.object({ subdomain: NonEmptyString.optional() }),

	// departments
	departmentsList: EmptyInputSchema,
	departmentsCreate: z.object({
		name: NonEmptyString,
		parent_id: z.string().nullable().optional(),
	}),
	departmentsUpdate: z.object({
		id: NonEmptyString,
		name: NonEmptyString,
		parent_id: z.string().nullable(),
	}),
	departmentsMerge: z.object({
		id: NonEmptyString,
		target_department_id: NonEmptyString,
		force: z.boolean().optional(),
	}),
	departmentsDelete: z.object({
		id: NonEmptyString,
		force: z.boolean().optional(),
	}),

	// employees
	employeesList: z.object({
		// Workable rejects any other page size with a 400.
		limit: z
			.union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
			.optional(),
		offset: z.number().int().nonnegative().optional(),
		query: z.string().optional(),
		order_by: z.string().optional(),
		member_id: z.string().optional(),
	}),
	employeesGet: z.object({
		id: NonEmptyString,
		member_id: z.string().optional(),
	}),
	employeesCreate: z.object({
		state: z.enum(['draft', 'published']),
		member_id: z.string().optional(),
		// unknown: free-form employee payload — field set varies per account.
		employee: z.record(z.string(), z.unknown()),
	}),
	employeesUpdate: z.object({
		id: NonEmptyString,
		member_id: z.string().optional(),
		// unknown: free-form employee payload — field set varies per account.
		employee: z.record(z.string(), z.unknown()),
	}),
	employeesUploadDocuments: z.object({
		id: NonEmptyString,
		member_id: z.string().optional(),
		documents: z.array(z.object({ url: z.url(), name: NonEmptyString })).min(1),
	}),

	// employee fields
	employeeFieldsList: EmptyInputSchema,

	// members
	membersList: z.object({
		limit: z.number().int().positive().max(100).optional(),
		since_id: z.string().optional(),
		max_id: z.string().optional(),
		role: z.string().optional(),
		shortcode: z.string().optional(),
		email: z.string().optional(),
		name: z.string().optional(),
		status: z.enum(['active', 'inactive', 'all']).optional(),
	}),
	membersInvite: z.object({
		email: z.string().email(),
		roles: z.array(MemberRoleSchema).min(1),
		member_id: z.string().optional(),
		// unknown: collaboration-rule values are account-configured and undocumented.
		collaboration_rules: z.array(z.record(z.string(), z.unknown())).optional(),
	}),
	membersUpdate: z.object({
		id: NonEmptyString,
		roles: z.array(MemberRoleSchema).min(1),
		// unknown: collaboration-rule values are account-configured and undocumented.
		collaboration_rules: z.array(z.record(z.string(), z.unknown())).optional(),
	}),
	membersEnable: z.object({ id: NonEmptyString }),

	// jobs
	jobsList: z.object({
		limit: z.number().int().positive().max(100).optional(),
		state: z.enum(['draft', 'published', 'archived', 'closed']).optional(),
		created_after: z.string().optional(),
		updated_after: z.string().optional(),
		since_id: z.string().optional(),
		max_id: z.string().optional(),
		include_fields: z.string().optional(),
	}),

	// candidates
	candidatesList: z.object({
		email: z.string().optional(),
		shortcode: z.string().optional(),
		stage: z.string().optional(),
		limit: z.number().int().positive().max(100).optional(),
		since_id: z.string().optional(),
		max_id: z.string().optional(),
		created_after: z.string().optional(),
		updated_after: z.string().optional(),
	}),

	// stages
	stagesList: EmptyInputSchema,

	// requisitions
	requisitionsList: z.object({
		limit: z.number().int().positive().max(100).optional(),
		since_id: z.string().optional(),
		max_id: z.string().optional(),
	}),

	// recruiters
	recruitersList: z.object({ shortcode: z.string().optional() }),

	// legal entities
	legalEntitiesList: EmptyInputSchema,

	// custom attributes
	customAttributesList: EmptyInputSchema,

	// disqualification reasons
	disqualificationReasonsList: EmptyInputSchema,

	// permission sets
	permissionSetsList: EmptyInputSchema,

	// timeoff
	timeoffCategoriesList: EmptyInputSchema,
	timeoffBalancesList: z.object({
		employee_id: z
			.string()
			.optional()
			.describe(
				'The employee whose balances to read. Required with an account token; a user token defaults to its own employee.',
			),
	}),

	// work schedules
	workSchedulesList: EmptyInputSchema,

	// events
	eventsList: z.object({
		type: z.enum(['call', 'interview', 'meeting']).optional(),
		limit: z.number().int().positive().max(100).optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		candidate_id: z.string().optional(),
		shortcode: z.string().optional(),
		member_id: z.string().optional(),
		context: z.enum(['user', 'team', 'all']).optional(),
		include_cancelled: z.boolean().optional(),
		since_id: z.string().optional(),
		max_id: z.string().optional(),
	}),

	// subscriptions
	subscriptionsList: EmptyInputSchema,
	subscriptionsCreate: z.object({
		target: z.url(),
		event: z.enum([
			'candidate_created',
			'candidate_moved',
			'employee_created',
			'employee_updated',
			'employee_published',
			'onboarding_completed',
			'timeoff_updated',
		]),
		args: z
			.object({
				account_id: z.string().optional(),
				job_shortcode: z.string().optional(),
				stage_slug: z.string().optional(),
			})
			.optional(),
	}),
	subscriptionsDelete: z.object({ id: NonEmptyString }),

	// public (unauthenticated) job board
	publicJobsList: z.object({
		subdomain: NonEmptyString.optional(),
		details: z.boolean().optional(),
	}),
	// public (unauthenticated) locations — takes no query params per the docs.
	publicLocationsList: z.object({
		subdomain: NonEmptyString.optional(),
	}),
} as const;

export const WorkableEndpointOutputSchemas = {
	accountsList: z.object({ accounts: z.array(WorkableAccount) }).loose(),
	accountsGet: WorkableAccount,

	// GET /departments answers with a bare array.
	departmentsList: z.array(WorkableDepartment),
	departmentsCreate: WorkableDepartment,
	departmentsUpdate: WorkableDepartment,
	// Merge answers with the target department the source was merged into.
	departmentsMerge: WorkableDepartment,
	departmentsDelete: SuccessResponseSchema,

	employeesList: z
		.object({
			employees: z.array(WorkableEmployee),
			// The live API sends `total_count`; Workable's reference shows `totalCount`.
			total_count: z.number().optional(),
			totalCount: z.number().optional(),
		})
		.loose(),
	employeesGet: WorkableEmployee,
	employeesCreate: WorkableEmployee,
	employeesUpdate: WorkableEmployee,
	employeesUploadDocuments: SuccessResponseSchema,

	employeeFieldsList: bareList(),

	membersList: z.object({ members: z.array(WorkableMember) }).loose(),
	membersInvite: WorkableMember,
	membersUpdate: WorkableMember,
	membersEnable: SuccessResponseSchema,

	jobsList: z
		.object({ jobs: z.array(WorkableJob), paging: PagingSchema.optional() })
		.loose(),

	candidatesList: z
		.object({
			candidates: z.array(WorkableCandidate),
			paging: PagingSchema.optional(),
		})
		.loose(),

	stagesList: listEnvelope('stages'),
	requisitionsList: listEnvelope('requisitions').extend({
		paging: PagingSchema.optional(),
	}),
	recruitersList: listEnvelope('recruiters'),
	legalEntitiesList: bareList(),
	customAttributesList: listEnvelope('custom_attributes'),
	disqualificationReasonsList: bareList(),
	permissionSetsList: bareList(),
	timeoffCategoriesList: listEnvelope('categories'),
	timeoffBalancesList: listEnvelope('balances'),
	workSchedulesList: bareList(),
	eventsList: listEnvelope('events'),

	subscriptionsList: listEnvelope('subscriptions'),
	// 201 with the new subscription's id (a number in Workable's reference).
	subscriptionsCreate: z
		.object({ id: z.union([z.number(), z.string()]).optional() })
		.loose(),
	subscriptionsDelete: SuccessResponseSchema,

	publicJobsList: z
		.object({
			name: z.string().nullish(),
			// null when the account has no careers-page description.
			description: z.string().nullish(),
			// unknown: public job-board row shape varies per posting and is display-only.
			jobs: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.loose(),
	// The locations endpoint returns a bare array (not an envelope object).
	// @see https://workable.readme.io/reference/apiaccountssubdomainlocations
	publicLocationsList: z.array(
		z
			.object({
				code: z.string().nullish(),
				name: z.string().nullish(),
				count: z.number().nullish(),
				url: z.string().nullish(),
			})
			.loose(),
	),
} as const;

export type WorkableEndpointInputs = {
	[K in keyof typeof WorkableEndpointInputSchemas]: z.infer<
		(typeof WorkableEndpointInputSchemas)[K]
	>;
};

export type WorkableEndpointOutputs = {
	[K in keyof typeof WorkableEndpointOutputSchemas]: z.infer<
		(typeof WorkableEndpointOutputSchemas)[K]
	>;
};
