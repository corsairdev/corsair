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

const WorkableAccount = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		subdomain: z.string().optional(),
		website_url: z.string().optional(),
	})
	// unknown: account payloads carry undocumented extras — catchall keeps parsing loose.
	.catchall(z.unknown());

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
		limit: z.number().int().positive().max(100).optional(),
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
	timeoffBalancesList: z.object({ employee_id: z.string().optional() }),

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

	departmentsList: z
		.object({ departments: z.array(WorkableDepartment) })
		.loose(),
	departmentsCreate: WorkableDepartment,
	departmentsUpdate: WorkableDepartment,
	departmentsMerge: SuccessResponseSchema,
	departmentsDelete: SuccessResponseSchema,

	employeesList: z
		.object({
			employees: z.array(WorkableEmployee),
			totalCount: z.number().optional(),
		})
		.loose(),
	employeesGet: WorkableEmployee,
	employeesCreate: WorkableEmployee,
	employeesUpdate: WorkableEmployee,
	employeesUploadDocuments: SuccessResponseSchema,

	employeeFieldsList: listEnvelope('employee_fields'),

	membersList: z.object({ members: z.array(WorkableMember) }).loose(),
	membersInvite: WorkableMember,
	membersUpdate: WorkableMember,
	membersEnable: SuccessResponseSchema,

	jobsList: z.object({ jobs: z.array(WorkableJob) }).loose(),

	candidatesList: z
		.object({
			candidates: z.array(WorkableCandidate),
			// unknown: opaque paging envelope — shape varies, never read by the plugin.
			paging: z.record(z.string(), z.unknown()).optional(),
		})
		.loose(),

	stagesList: listEnvelope('stages'),
	requisitionsList: listEnvelope('requisitions'),
	recruitersList: listEnvelope('recruiters'),
	legalEntitiesList: listEnvelope('legal_entities'),
	customAttributesList: listEnvelope('custom_attributes'),
	disqualificationReasonsList: listEnvelope('disqualification_reasons'),
	permissionSetsList: listEnvelope('permission_sets'),
	timeoffCategoriesList: listEnvelope('categories'),
	timeoffBalancesList: listEnvelope('balances'),
	workSchedulesList: listEnvelope('work_schedules'),
	eventsList: listEnvelope('events'),

	subscriptionsList: listEnvelope('subscriptions'),
	// unknown: webhook-subscription response is opaque and never read by the plugin.
	subscriptionsCreate: z.record(z.string(), z.unknown()),
	subscriptionsDelete: SuccessResponseSchema,

	publicJobsList: z
		.object({
			name: z.string().optional(),
			description: z.string().optional(),
			// unknown: public job-board row shape varies per posting and is display-only.
			jobs: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.loose(),
	// The locations endpoint returns a bare array (not an envelope object).
	// @see https://workable.readme.io/reference/apiaccountssubdomainlocations
	publicLocationsList: z.array(
		z
			.object({
				code: z.string().optional(),
				name: z.string().optional(),
				count: z.number().optional(),
				url: z.string().optional(),
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
