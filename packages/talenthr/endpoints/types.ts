import { z } from 'zod';

// Inputs use TalentHR's own parameter names. Outputs are `.loose()` and their
// optional fields nullish, so a field TalentHR adds or omits cannot fail a call
// that has already happened. Every response is `{ success, data }` on success
// and `{ success: false, error }` on failure; the client turns the second into
// a TalentHRAPIError before any output schema sees it.
// Field reference: https://apidocs.talenthr.io

const EmployeeIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The employee ID, from `employees.directory` or `employees.hire`.');

const IsoDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD.')
	.describe('A calendar date as "YYYY-MM-DD".');

// ── Shared output pieces ──────────────────────────────────────────────────

const UserRoleSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
	})
	.loose();

const SenioritySchema = z
	.object({
		years: z.number().nullish(),
		months: z.number().nullish(),
		days: z.number().nullish(),
	})
	.loose();

const CustomFieldValueSchema = z
	.object({
		value: z.string().nullish(),
	})
	.loose();

const EmployeeCustomFieldSchema = z
	.object({
		custom_field_id: z.number().nullish(),
		custom_field_slug: z.string().nullish(),
		custom_field_name: z.string().nullish(),
		values: z.array(CustomFieldValueSchema).nullish(),
	})
	.loose();

/**
 * One employee as `GET /employees/{id}` returns it. TalentHR sends `null` for
 * most optional columns and `""` for an empty `termination_reason`, so each is
 * nullish rather than optional-only.
 */
export const TalentHREmployeeSchema = z
	.object({
		id: z.number(),
		ssn: z.string().nullish(),
		birth_date: z.string().nullish(),
		hire_date: z.string().nullish(),
		hire_date_utc: z.string().nullish(),
		personal_email: z.string().nullish(),
		marital_status: z.string().nullish(),
		nationality: z.string().nullish(),
		work_phone: z.string().nullish(),
		mobile_phone: z.string().nullish(),
		phone: z.string().nullish(),
		country: z.string().nullish(),
		address: z.string().nullish(),
		postal_code: z.string().nullish(),
		city: z.string().nullish(),
		linked_in_url: z.string().nullish(),
		photo_url: z.string().nullish(),
		citizenship: z.string().nullish(),
		termination_date: z.string().nullish(),
		gender: z.string().nullish(),
		job_title_id: z.number().nullish(),
		division_id: z.number().nullish(),
		department_id: z.number().nullish(),
		location_id: z.number().nullish(),
		employee_number: z.string().nullish(),
		user_role: UserRoleSchema.nullish(),
		seniority: SenioritySchema.nullish(),
		termination_reason: z.string().nullish(),
		custom_fields: z.array(EmployeeCustomFieldSchema).nullish(),
		default_avatar: z.boolean().nullish(),
		location_name: z.string().nullish(),
		division_name: z.string().nullish(),
		department_name: z.string().nullish(),
		job_title_name: z.string().nullish(),
		is_terminated: z.boolean().nullish(),
		visa_status: z.string().nullish(),
		user: z
			.object({
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				middle_name: z.string().nullish(),
				email: z.string().nullish(),
				last_login_at: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type TalentHREmployee = z.infer<typeof TalentHREmployeeSchema>;

/**
 * A named reference record: divisions, departments, locations, job titles and
 * time off types all answer this shape from their list and single routes.
 */
const NamedObjectSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		object_type: z.string().nullish(),
		// Locations carry this and the other three collections do not, so every
		// key it is documented with is optional.
		field_data: z
			.object({
				address: z.string().nullish(),
				is_remote: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

// ── employees.directory ───────────────────────────────────────────────────

export const DirectoryInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Rows per page. Defaults to 10; TalentHR caps it at 100.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Rows to skip. Defaults to 0.'),
	filter: z
		.string()
		.optional()
		.describe(
			'Filter IDs joined by commas, in the form `field:id` (for example `department_id:6,division_id:13`). TalentHR lists the filter IDs at `GET /directory/filters`, which this plugin does not wrap; the IDs come from the division, department, location and job title lists.',
		),
	customFields: z
		.string()
		.optional()
		.describe(
			'Custom field slugs joined by commas, as set up in TalentHR (its `GET /custom-fields`, which this plugin does not wrap). TalentHR returns them under each row.',
		),
});

export type DirectoryInput = z.infer<typeof DirectoryInputSchema>;

const DirectoryRowSchema = z
	.object({
		id: z.number(),
		user_id: z.number().nullish(),
		u_id: z.number().nullish(),
		reports_to_employee_id: z.number().nullish(),
		photo_url: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		division_id: z.number().nullish(),
		division: z.string().nullish(),
		employment_status_id: z.number().nullish(),
		employment_status_name: z.string().nullish(),
		department_id: z.number().nullish(),
		department: z.string().nullish(),
		job_title_id: z.number().nullish(),
		job_title: z.string().nullish(),
		location_id: z.number().nullish(),
		location: z.string().nullish(),
		termination_date: z.string().nullish(),
		hire_date: z.string().nullish(),
		linked_in_url: z.string().nullish(),
		work_phone: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		postal_code: z.string().nullish(),
		country: z.string().nullish(),
		sec_address: z.string().nullish(),
		sec_city: z.string().nullish(),
		sec_postal_code: z.string().nullish(),
		sec_country: z.string().nullish(),
		custom_fields: z.array(EmployeeCustomFieldSchema).nullish(),
		user_role: UserRoleSchema.nullish(),
	})
	.loose();

/**
 * `data` is `{ total, rows }`. `total` is the match count for the whole
 * filter, not the page, so the caller pages with `offset`.
 */
export const DirectoryResponseSchema = z
	.object({
		total: z.number(),
		rows: z.array(DirectoryRowSchema),
	})
	.loose();

export type DirectoryResponse = z.infer<typeof DirectoryResponseSchema>;

// ── employees.get ─────────────────────────────────────────────────────────

export const EmployeesGetInputSchema = z.object({
	employeeId: EmployeeIdSchema,
});

export type EmployeesGetInput = z.infer<typeof EmployeesGetInputSchema>;

export const EmployeesGetResponseSchema = TalentHREmployeeSchema;

export type EmployeesGetResponse = z.infer<typeof EmployeesGetResponseSchema>;

// ── employees.hire ────────────────────────────────────────────────────────

const CompensationRecordSchema = z
	.object({
		pay_rate: z.number().describe('The wage, to two decimals.'),
		pay_rate_period: z
			.enum(['hour', 'day', 'week', 'month', 'quarter', 'year'])
			.optional()
			.describe('The period the wage covers.'),
		pay_rate_schedule: z
			.enum(['once-per-month', 'twice-per-month', 'every-other-week'])
			.optional()
			.describe('How often the wage is paid.'),
		overtime_status: z
			.enum(['exempt', 'non-exempt'])
			.optional()
			.describe('Whether the employee is exempt from overtime.'),
	})
	.loose();

const JobRecordSchema = z
	.object({
		job_title_id: z.number().int().nullish(),
		location_id: z.number().int().nullish(),
		division_id: z.number().int().nullish(),
		department_id: z.number().int().nullish(),
	})
	.loose();

const EmergencyContactSchema = z
	.object({
		full_name: z.string().max(191),
		relationship_type_id: z.number().int(),
		phone: z.string().max(191).optional(),
		address: z.string().max(191).optional(),
	})
	.loose();

export const EmployeesHireInputSchema = z.object({
	first_name: z.string().min(1).max(191).describe('The employee first name.'),
	last_name: z.string().min(1).max(191).describe('The employee last name.'),
	email: z
		.string()
		.max(191)
		.describe(
			'The work email. TalentHR requires a valid address that no other employee uses.',
		),
	hire_date: IsoDateSchema.describe('The hire date.'),
	employment_status: z
		.object({ employment_status_id: z.number().int().positive() })
		.describe(
			'The starting status. Get the ID from `referenceData.employmentStatuses`.',
		),
	reports_to_employee_id: z
		.number()
		.int()
		.nullable()
		.describe(
			'The manager employee ID. Send `null` to make this employee the head of the company.',
		),
	job_record: JobRecordSchema.optional().describe(
		'Job title, location, division and department. Get each ID from its list route.',
	),
	compensation_record: CompensationRecordSchema.optional().describe(
		'The initial pay record.',
	),
	emergency_contact: EmergencyContactSchema.optional().describe(
		'The emergency contact.',
	),
	employee_number: z.string().max(191).optional(),
	prevent_email: z
		.boolean()
		.optional()
		.describe('When true, TalentHR sends no welcome email.'),
});

export type EmployeesHireInput = z.input<typeof EmployeesHireInputSchema>;

/**
 * The hire answer repeats the created employee. It also carries a
 * `hire_packet` object, which the plugin passes through untyped because
 * TalentHR documents it only by example.
 */
export const EmployeesHireResponseSchema = TalentHREmployeeSchema;

export type EmployeesHireResponse = z.infer<typeof EmployeesHireResponseSchema>;

// ── employees.update ──────────────────────────────────────────────────────

export const EmployeesUpdateInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	// TalentHR requires all three on this route: it treats the body as the
	// full contact record, not a patch, and refuses a request without them.
	first_name: z.string().min(1).max(191),
	last_name: z.string().min(1).max(191),
	email: z.string().max(191),
	ssn: z.string().max(191).optional(),
	birth_date: IsoDateSchema.optional(),
	personal_email: z.string().max(191).optional(),
	marital_status: z
		.enum(['Single', 'Separated', 'Married', 'Widowed'])
		.optional(),
	gender: z.enum(['Male', 'Female', 'Non-binary']).optional(),
	nationality: z.string().optional(),
	citizenship: z.string().optional(),
	work_phone: z.string().max(191).optional(),
	mobile_phone: z.string().max(191).optional(),
	phone: z.string().max(191).optional(),
	address: z.string().max(191).optional(),
	country: z.string().optional(),
	postal_code: z.string().max(191).optional(),
	city: z.string().max(191).optional(),
	reports_to_employee_id: z.number().int().nullable().optional(),
	linked_in_url: z.string().optional(),
	employee_number: z.string().max(191).optional(),
	emergency_contact: EmergencyContactSchema.optional(),
});

export type EmployeesUpdateInput = z.input<typeof EmployeesUpdateInputSchema>;

export const EmployeesUpdateResponseSchema = TalentHREmployeeSchema;

export type EmployeesUpdateResponse = z.infer<
	typeof EmployeesUpdateResponseSchema
>;

// ── employees.terminate ───────────────────────────────────────────────────

export const EmployeesTerminateInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	effective_date: IsoDateSchema.describe('The date the termination starts.'),
	termination_reason: z
		.string()
		.max(4000)
		.describe('The reason for the dismissal.'),
	termination_type: z
		.string()
		.optional()
		.describe(
			'The kind of termination. TalentHR defaults it to "termination".',
		),
	regrettable_status: z
		.string()
		.optional()
		.describe('Whether the termination is regrettable.'),
});

export type EmployeesTerminateInput = z.input<
	typeof EmployeesTerminateInputSchema
>;

const EmploymentStatusRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		object_type: z.string().nullish(),
	})
	.loose();

/** TalentHR answers the termination with the employment status record it wrote. */
export const EmployeesTerminateResponseSchema = z
	.object({
		id: z.number(),
		employee_id: z.number().nullish(),
		effective_date: z.string().nullish(),
		employment_status_id: z.number().nullish(),
		// TalentHR sends 0 or 1 here, not a boolean.
		is_active: z.union([z.boolean(), z.number()]).nullish(),
		end_date: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		deleted_at: z.string().nullish(),
		termination_reason: z.string().nullish(),
		termination_type: z.string().nullish(),
		regrettable_status: z.string().nullish(),
		employment_status: EmploymentStatusRefSchema.nullish(),
	})
	.loose();

export type EmployeesTerminateResponse = z.infer<
	typeof EmployeesTerminateResponseSchema
>;

// ── employees.rehire ──────────────────────────────────────────────────────

export const EmployeesRehireInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	hire_date: IsoDateSchema.describe(
		'The new hire date. It must fall after the latest termination date.',
	),
	reports_to_employee_id: z
		.number()
		.int()
		.positive()
		.describe(
			'The manager employee ID. It must be active and not this employee.',
		),
	employment_status: z
		.object({ employment_status_id: z.number().int().positive() })
		.describe('The status the employee returns to.'),
	job_record: JobRecordSchema.optional(),
	prevent_email: z
		.boolean()
		.optional()
		.describe('When true, TalentHR sends no rehire notification email.'),
});

export type EmployeesRehireInput = z.input<typeof EmployeesRehireInputSchema>;

// TalentHR answers a rehire with only the employee ID.
export const EmployeesRehireResponseSchema = z
	.object({ employee_id: z.number() })
	.loose();

export type EmployeesRehireResponse = z.infer<
	typeof EmployeesRehireResponseSchema
>;

// ── employees.remove ──────────────────────────────────────────────────────

export const EmployeesRemoveInputSchema = z.object({
	employeeId: EmployeeIdSchema,
});

export type EmployeesRemoveInput = z.infer<typeof EmployeesRemoveInputSchema>;

/** TalentHR answers a delete with `{ success: true }` and no data key. */
export const DeletedResponseSchema = z
	.object({ success: z.literal(true) })
	.loose();

export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

// ── employees.employmentStatuses ──────────────────────────────────────────

export const EmployeesEmploymentStatusesInputSchema = z.object({
	employeeId: EmployeeIdSchema,
});

export type EmployeesEmploymentStatusesInput = z.infer<
	typeof EmployeesEmploymentStatusesInputSchema
>;

const EmploymentStatusRecordSchema = z
	.object({
		id: z.number(),
		employee_id: z.number().nullish(),
		cycle_id: z.number().nullish(),
		effective_date: z.string().nullish(),
		employment_status_id: z.number().nullish(),
		is_hire_event: z.union([z.boolean(), z.number()]).nullish(),
		working_hours: z.number().nullish(),
		end_date: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		deleted_at: z.string().nullish(),
		termination_reason: z.string().nullish(),
		termination_type: z.string().nullish(),
		regrettable_status: z.string().nullish(),
		employment_status: EmploymentStatusRefSchema.nullish(),
	})
	.loose();

export const EmployeesEmploymentStatusesResponseSchema = z.array(
	EmploymentStatusRecordSchema,
);

export type EmployeesEmploymentStatusesResponse = z.infer<
	typeof EmployeesEmploymentStatusesResponseSchema
>;

// ── timeOff.list ──────────────────────────────────────────────────────────

export const TimeOffListInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	limit: z.number().int().min(1).optional().describe('Rows per page.'),
	offset: z.number().int().min(0).optional().describe('Rows to skip.'),
	sort: z
		.string()
		.optional()
		.describe('The column to sort by, for example `start_date`.'),
});

export type TimeOffListInput = z.infer<typeof TimeOffListInputSchema>;

const TimeOffRequestSchema = z
	.object({
		id: z.number(),
		approved: z.boolean().nullish(),
		note: z.string().nullish(),
		// TalentHR sends budgets as strings with three decimals, e.g. "2.000".
		budget: z.string().nullish(),
		is_canceled: z.boolean().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		employee_id: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		deleted_at: z.string().nullish(),
		timeoff_type_id: z.number().nullish(),
		timeoff_type_name: z.string().nullish(),
		timeoff_type_slug: z.string().nullish(),
		allow_cancel: z.boolean().nullish(),
	})
	.loose();

export const TimeOffListResponseSchema = z
	.object({
		total: z.number(),
		rows: z.array(TimeOffRequestSchema),
	})
	.loose();

export type TimeOffListResponse = z.infer<typeof TimeOffListResponseSchema>;

// ── timeOff.create ────────────────────────────────────────────────────────

export const TimeOffCreateInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	start_date: IsoDateSchema.describe('The first day of the absence.'),
	end_date: IsoDateSchema.describe('The last day of the absence.'),
	timeoff_type_id: z
		.number()
		.int()
		.positive()
		.describe('The time off type. Get the ID from `timeOff.types`.'),
	preapproved: z
		.boolean()
		.optional()
		.describe(
			'When true, TalentHR approves the request without manager action if the caller may. Otherwise it emails the manager for approval.',
		),
	note: z.string().max(255).optional().describe('A note on the request.'),
	amountOptions: z
		.record(
			z.string(),
			z.union([
				z.number(),
				z
					.object({
						amount_days: z.number().nullish(),
						amount_hours: z.number().nullish(),
					})
					.loose(),
			]),
		)
		.optional()
		.describe(
			'Per-day amounts keyed by "YYYY-MM-DD", covering every day from start_date through end_date. Use a number for days, or `{ amount_days, amount_hours }`.',
		),
});

export type TimeOffCreateInput = z.input<typeof TimeOffCreateInputSchema>;

export const TimeOffCreateResponseSchema = z
	.object({
		id: z.number(),
		timeoff_type_id: z.number().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		employee_id: z.number().nullish(),
		budget: z.string().nullish(),
		approved: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		deleted_at: z.string().nullish(),
		working_hours: z.number().nullish(),
		budget_days: z.string().nullish(),
		budget_hours: z.string().nullish(),
		attachment_url: z.string().nullish(),
		attachment_name: z.string().nullish(),
		time_off_type: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				slug: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type TimeOffCreateResponse = z.infer<typeof TimeOffCreateResponseSchema>;

// ── timeOff.remove ────────────────────────────────────────────────────────

export const TimeOffRemoveInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	timeOffRequestId: z
		.number()
		.int()
		.positive()
		.describe('The time off request.'),
});

export type TimeOffRemoveInput = z.infer<typeof TimeOffRemoveInputSchema>;

// ── timeOff.reply ─────────────────────────────────────────────────────────

export const TimeOffReplyInputSchema = z.object({
	employeeId: EmployeeIdSchema,
	timeOffRequestId: z
		.number()
		.int()
		.positive()
		.describe('The time off request.'),
	accept: z.boolean().describe('True approves the request, false rejects it.'),
});

export type TimeOffReplyInput = z.infer<typeof TimeOffReplyInputSchema>;

// ── timeOff.types ─────────────────────────────────────────────────────────

export const TimeOffTypesInputSchema = z.object({});

export type TimeOffTypesInput = z.infer<typeof TimeOffTypesInputSchema>;

const TimeOffTypeSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		// Documented as a string with three decimals, e.g. "5.000".
		budget: z.string().nullish(),
		period: z.string().nullish(),
		paid: z.boolean().nullish(),
		is_default: z.boolean().nullish(),
		is_disabled: z.boolean().nullish(),
		needs_approval: z.boolean().nullish(),
		calendar_blocking: z.boolean().nullish(),
		visible_internally: z.boolean().nullish(),
		allow_exceeding: z.boolean().nullish(),
		use_calendar_days: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		deleted_at: z.string().nullish(),
	})
	.loose();

export const TimeOffTypesResponseSchema = z.array(TimeOffTypeSchema);

export type TimeOffTypesResponse = z.infer<typeof TimeOffTypesResponseSchema>;

// ── timeOff.budgets ───────────────────────────────────────────────────────

export const TimeOffBudgetsInputSchema = z.object({
	employeeId: EmployeeIdSchema,
});

export type TimeOffBudgetsInput = z.infer<typeof TimeOffBudgetsInputSchema>;

const TimeOffBudgetSchema = z
	.object({
		id: z.number(),
		employee_id: z.number().nullish(),
		// Every budget amount is a string with three decimals, e.g. "10.000".
		budget: z.string().nullish(),
		time_off_cycle_id: z.number().nullish(),
		timeoff_type_id: z.number().nullish(),
		timeoff_type_name: z.string().nullish(),
		timeoff_type_slug: z.string().nullish(),
		timeoff_allow_exceeding: z.boolean().nullish(),
		original_budget: z.string().nullish(),
		used_budget: z.string().nullish(),
		paid: z.boolean().nullish(),
		has_unlimited_timeoff: z.boolean().nullish(),
		unlimited_used_budget: z.string().nullish(),
		employee_has_accrual: z.boolean().nullish(),
		accrual_original_budget: z.string().nullish(),
		accrual_budget: z.string().nullish(),
		accrual_used_budget: z.string().nullish(),
		accrual_carry_on_budget: z.string().nullish(),
		accrual_carry_on_used_budget: z.string().nullish(),
		accrual_carry_on_original_budget: z.string().nullish(),
	})
	.loose();

export const TimeOffBudgetsResponseSchema = z.array(TimeOffBudgetSchema);

export type TimeOffBudgetsResponse = z.infer<
	typeof TimeOffBudgetsResponseSchema
>;

// ── teams: divisions, departments, locations, job titles ──────────────────

export const ListInputSchema = z.object({});

export type ListInput = z.infer<typeof ListInputSchema>;

export const NamedObjectListResponseSchema = z.array(NamedObjectSchema);

export type NamedObjectListResponse = z.infer<
	typeof NamedObjectListResponseSchema
>;

export const NamedObjectResponseSchema = NamedObjectSchema;

export type NamedObjectResponse = z.infer<typeof NamedObjectResponseSchema>;

export const NamedObjectIdInputSchema = z.object({
	id: z.number().int().positive().describe('The record ID.'),
});

export type NamedObjectIdInput = z.infer<typeof NamedObjectIdInputSchema>;

export const NamedObjectCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.describe(
			'The name, up to 255 characters. TalentHR requires it to be unique in its collection.',
		),
});

export type NamedObjectCreateInput = z.infer<
	typeof NamedObjectCreateInputSchema
>;

export const NamedObjectUpdateInputSchema = z.object({
	id: z.number().int().positive().describe('The record to rename.'),
	name: z
		.string()
		.min(1)
		.max(255)
		.describe(
			'The new name, up to 255 characters. TalentHR requires it to be unique in its collection.',
		),
});

export type NamedObjectUpdateInput = z.infer<
	typeof NamedObjectUpdateInputSchema
>;

// ── referenceData.employmentStatuses ──────────────────────────────────────

export const ReferenceListInputSchema = z.object({});

export type ReferenceListInput = z.infer<typeof ReferenceListInputSchema>;

const EmploymentStatusOptionSchema = z
	.object({ id: z.number(), name: z.string().nullish() })
	.loose();

export const EmploymentStatusOptionsResponseSchema = z.array(
	EmploymentStatusOptionSchema,
);

export type EmploymentStatusOptionsResponse = z.infer<
	typeof EmploymentStatusOptionsResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export type TalentHREndpointInputs = {
	employeesDirectory: DirectoryInput;
	employeesGet: EmployeesGetInput;
	employeesHire: EmployeesHireInput;
	employeesUpdate: EmployeesUpdateInput;
	employeesTerminate: EmployeesTerminateInput;
	employeesRehire: EmployeesRehireInput;
	employeesRemove: EmployeesRemoveInput;
	employeesEmploymentStatuses: EmployeesEmploymentStatusesInput;
	timeOffList: TimeOffListInput;
	timeOffCreate: TimeOffCreateInput;
	timeOffRemove: TimeOffRemoveInput;
	timeOffReply: TimeOffReplyInput;
	timeOffTypes: TimeOffTypesInput;
	timeOffBudgets: TimeOffBudgetsInput;
	divisionsList: ListInput;
	divisionsGet: NamedObjectIdInput;
	divisionsCreate: NamedObjectCreateInput;
	divisionsUpdate: NamedObjectUpdateInput;
	divisionsRemove: NamedObjectIdInput;
	departmentsList: ListInput;
	departmentsCreate: NamedObjectCreateInput;
	departmentsRemove: NamedObjectIdInput;
	locationsList: ListInput;
	jobTitlesList: ListInput;
	referenceDataEmploymentStatuses: ReferenceListInput;
};

export type TalentHREndpointOutputs = {
	employeesDirectory: DirectoryResponse;
	employeesGet: EmployeesGetResponse;
	employeesHire: EmployeesHireResponse;
	employeesUpdate: EmployeesUpdateResponse;
	employeesTerminate: EmployeesTerminateResponse;
	employeesRehire: EmployeesRehireResponse;
	employeesRemove: DeletedResponse;
	employeesEmploymentStatuses: EmployeesEmploymentStatusesResponse;
	timeOffList: TimeOffListResponse;
	timeOffCreate: TimeOffCreateResponse;
	timeOffRemove: DeletedResponse;
	timeOffReply: DeletedResponse;
	timeOffTypes: TimeOffTypesResponse;
	timeOffBudgets: TimeOffBudgetsResponse;
	divisionsList: NamedObjectListResponse;
	divisionsGet: NamedObjectResponse;
	divisionsCreate: NamedObjectResponse;
	divisionsUpdate: NamedObjectResponse;
	divisionsRemove: DeletedResponse;
	departmentsList: NamedObjectListResponse;
	departmentsCreate: NamedObjectResponse;
	departmentsRemove: DeletedResponse;
	locationsList: NamedObjectListResponse;
	jobTitlesList: NamedObjectListResponse;
	referenceDataEmploymentStatuses: EmploymentStatusOptionsResponse;
};

export const TalentHREndpointInputSchemas = {
	employeesDirectory: DirectoryInputSchema,
	employeesGet: EmployeesGetInputSchema,
	employeesHire: EmployeesHireInputSchema,
	employeesUpdate: EmployeesUpdateInputSchema,
	employeesTerminate: EmployeesTerminateInputSchema,
	employeesRehire: EmployeesRehireInputSchema,
	employeesRemove: EmployeesRemoveInputSchema,
	employeesEmploymentStatuses: EmployeesEmploymentStatusesInputSchema,
	timeOffList: TimeOffListInputSchema,
	timeOffCreate: TimeOffCreateInputSchema,
	timeOffRemove: TimeOffRemoveInputSchema,
	timeOffReply: TimeOffReplyInputSchema,
	timeOffTypes: TimeOffTypesInputSchema,
	timeOffBudgets: TimeOffBudgetsInputSchema,
	divisionsList: ListInputSchema,
	divisionsGet: NamedObjectIdInputSchema,
	divisionsCreate: NamedObjectCreateInputSchema,
	divisionsUpdate: NamedObjectUpdateInputSchema,
	divisionsRemove: NamedObjectIdInputSchema,
	departmentsList: ListInputSchema,
	departmentsCreate: NamedObjectCreateInputSchema,
	departmentsRemove: NamedObjectIdInputSchema,
	locationsList: ListInputSchema,
	jobTitlesList: ListInputSchema,
	referenceDataEmploymentStatuses: ReferenceListInputSchema,
} as const;

export const TalentHREndpointOutputSchemas = {
	employeesDirectory: DirectoryResponseSchema,
	employeesGet: EmployeesGetResponseSchema,
	employeesHire: EmployeesHireResponseSchema,
	employeesUpdate: EmployeesUpdateResponseSchema,
	employeesTerminate: EmployeesTerminateResponseSchema,
	employeesRehire: EmployeesRehireResponseSchema,
	employeesRemove: DeletedResponseSchema,
	employeesEmploymentStatuses: EmployeesEmploymentStatusesResponseSchema,
	timeOffList: TimeOffListResponseSchema,
	timeOffCreate: TimeOffCreateResponseSchema,
	timeOffRemove: DeletedResponseSchema,
	timeOffReply: DeletedResponseSchema,
	timeOffTypes: TimeOffTypesResponseSchema,
	timeOffBudgets: TimeOffBudgetsResponseSchema,
	divisionsList: NamedObjectListResponseSchema,
	divisionsGet: NamedObjectResponseSchema,
	divisionsCreate: NamedObjectResponseSchema,
	divisionsUpdate: NamedObjectResponseSchema,
	divisionsRemove: DeletedResponseSchema,
	departmentsList: NamedObjectListResponseSchema,
	departmentsCreate: NamedObjectResponseSchema,
	departmentsRemove: DeletedResponseSchema,
	locationsList: NamedObjectListResponseSchema,
	jobTitlesList: NamedObjectListResponseSchema,
	referenceDataEmploymentStatuses: EmploymentStatusOptionsResponseSchema,
} as const;
