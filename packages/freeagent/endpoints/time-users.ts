import { z } from 'zod';
import { lazyModule } from './lazy-module';
import { defineOperation } from './operation';

// Schemas and handlers are built the first time one of these operations runs.
function build() {
	// User, payroll, and timeslip resources include optional fields that depend on permissions, tax-year status, and running timers.
	// Updates and status changes answer with the changed record; deletes answer with no body.
	const EmptyResponse = z.union([z.object({}).passthrough(), z.undefined()]);
	const Decimal = z.union([z.string(), z.number()]);
	const PageQuery = z
		.object({
			page: z.number().int().positive().optional(),
			per_page: z.number().int().min(1).max(100).optional(),
		})
		.strict();
	const Pagination = z.object({
		link: z.string().nullable(),
		total_count: z.string().regex(/^\d+$/).nullable(),
	});

	const PayrollPeriod = z
		.object({
			url: z.string().url().optional(),
			period: z.number().int().min(0).max(11).optional(),
			frequency: z.string().optional(),
			dated_on: z.string().date().optional(),
			status: z
				.enum(['unfiled', 'pending', 'rejected', 'partially_filed', 'filed'])
				.optional(),
			employment_allowance_claimed: z.boolean().optional(),
			employment_allowance_amount: Decimal.optional(),
			construction_industry_scheme_deduction: Decimal.optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const PayrollPayment = z
		.object({
			due_on: z.string().date(),
			amount_due: Decimal,
			status: z.enum(['unpaid', 'paid', 'marked_as_paid']).optional(),
		})
		.passthrough();
	const Payslip = z
		.object({
			user: z.string().url().optional(),
			tax_code: z.string().optional(),
			dated_on: z.string().date().optional(),
			basic_pay: Decimal.optional(),
			tax_deducted: Decimal.optional(),
			employee_ni: Decimal.optional(),
			employer_ni: Decimal.optional(),
			other_deductions: Decimal.optional(),
			student_loan_deduction: Decimal.optional(),
			postgrad_loan_deduction: Decimal.optional(),
			overtime: Decimal.optional(),
			commission: Decimal.optional(),
			bonus: Decimal.optional(),
			allowance: Decimal.optional(),
			statutory_sick_pay: Decimal.optional(),
			statutory_maternity_pay: Decimal.optional(),
			statutory_paternity_pay: Decimal.optional(),
			statutory_adoption_pay: Decimal.optional(),
			statutory_parental_bereavement_pay: Decimal.optional(),
			statutory_neonatal_care_pay: Decimal.optional(),
			absence_payments: Decimal.optional(),
			other_payments: Decimal.optional(),
			employee_pension: Decimal.optional(),
			employer_pension: Decimal.optional(),
			employee_pension_percentage: Decimal.optional(),
			employer_pension_percentage: Decimal.optional(),
			attachments: Decimal.optional(),
			payroll_giving: Decimal.optional(),
			ni_calc_type: z.string().optional(),
			frequency: z.string().optional(),
			additional_statutory_paternity_pay: Decimal.optional(),
			deductions_subject_to_nic_but_not_paye: Decimal.optional(),
			other_deductions_from_net_pay: Decimal.optional(),
			employee_pension_not_under_net_pay: Decimal.optional(),
			other_salary_sacrifice_deductions: Decimal.optional(),
			employee_pension_salary_sacrifice: Decimal.optional(),
			pension_earnings_amount: Decimal.optional(),
			ni_letter: z.string().optional(),
			deduct_student_loan: z.boolean().optional(),
			student_loan_deductions_plan: z.string().optional(),
			deduct_postgrad_loan: z.boolean().optional(),
			week_1_month_1_basis: z.boolean().optional(),
			deduction_free_pay: Decimal.optional(),
			hours_worked: Decimal.optional(),
			leaving_payslip: z.boolean().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const PayrollYearInput = z
		.object({ year: z.string().regex(/^\d{4}$/) })
		.strict();
	const PayrollListOutput = z
		.object({
			periods: z.array(PayrollPeriod),
			payments: z.array(PayrollPayment),
		})
		.passthrough();
	const PayrollGetInput = z
		.object({
			year: z.string().regex(/^\d{4}$/),
			period: z.number().int().min(0).max(11),
		})
		.strict();
	const PayrollGetOutput = z
		.object({
			period: PayrollPeriod.extend({ payslips: z.array(Payslip).optional() }),
		})
		.passthrough();
	const PayrollPaymentInput = z
		.object({
			year: z.string().regex(/^\d{4}$/),
			payment_date: z.string().date(),
		})
		.strict();

	const PayrollProfile = z
		.object({
			user: z.string().url(),
			payroll_reference: z.string().optional(),
			address_line_1: z.string().optional(),
			address_line_2: z.string().optional(),
			address_line_3: z.string().optional(),
			address_line_4: z.string().optional(),
			postcode: z.string().optional(),
			country: z.string().optional(),
			title: z.string().optional(),
			gender: z.string().optional(),
			date_of_birth: z.string().date().optional(),
			total_pay_in_previous_employment: Decimal.optional(),
			total_tax_in_previous_employment: Decimal.optional(),
			employment_starts_on: z.string().date().optional(),
			employment_ends_on: z.string().date().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const PayrollProfilesInput = z
		.object({
			year: z.string().regex(/^\d{4}$/),
			query: PageQuery.extend({ user: z.string().url().optional() }).optional(),
		})
		.strict();
	const PayrollProfilesOutput = z
		.object({ profiles: z.array(PayrollProfile) })
		.passthrough();

	const User = z
		.object({
			url: z.string().url().optional(),
			email: z.string().email().optional(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			ni_number: z.string().optional(),
			unique_tax_reference: z.string().optional(),
			role: z
				.enum([
					'Owner',
					'Director',
					'Partner',
					'Company Secretary',
					'Employee',
					'Shareholder',
					'Accountant',
				])
				.optional(),
			opening_mileage: Decimal.optional(),
			send_invitation: z.boolean().optional(),
			permission_level: z.number().int().min(0).max(8).optional(),
			current_payroll_profile: z
				.object({
					total_pay_in_previous_employment: Decimal.optional(),
					total_tax_in_previous_employment: Decimal.optional(),
				})
				.passthrough()
				.optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const UserFields = z
		.object({
			email: z.string().email().optional(),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			ni_number: z.string().optional(),
			unique_tax_reference: z.string().optional(),
			role: z
				.enum([
					'Owner',
					'Director',
					'Partner',
					'Company Secretary',
					'Employee',
					'Shareholder',
					'Accountant',
				])
				.optional(),
			opening_mileage: Decimal.optional(),
			send_invitation: z.boolean().optional(),
			permission_level: z.number().int().min(0).max(8).optional(),
		})
		.strict();
	const UserCreateInput = z
		.object({
			user: UserFields.extend({
				email: z.string().email(),
				first_name: z.string().min(1),
				last_name: z.string().min(1),
				role: z.enum([
					'Owner',
					'Director',
					'Partner',
					'Company Secretary',
					'Employee',
					'Shareholder',
					'Accountant',
				]),
				opening_mileage: Decimal,
			}),
		})
		.strict();
	const UserUpdateInput = z
		.object({ id: z.string().min(1), user: UserFields })
		.strict();
	const UserMeUpdateInput = z.object({ user: UserFields }).strict();
	const UserGetInput = z.object({ id: z.string().min(1) }).strict();
	const UserListInput = z
		.object({
			query: PageQuery.extend({
				view: z
					.enum(['all', 'staff', 'active_staff', 'advisors', 'active_advisors'])
					.optional(),
			}).optional(),
		})
		.strict();
	const UserListData = z.object({ users: z.array(User) }).passthrough();
	const UserListOutput = UserListData.extend({
		pagination: Pagination,
	}).passthrough();
	const UserOutput = z.object({ user: User }).passthrough();
	const UserMeInput = z.object({}).strict();

	const Task = z
		.object({
			url: z.string().url().optional(),
			project: z.string().url().optional(),
			name: z.string().optional(),
			currency: z.string().optional(),
			is_billable: z.boolean().optional(),
			billing_rate: Decimal.optional(),
			billing_period: z.enum(['day', 'hour']).optional(),
			status: z.enum(['Active', 'Completed', 'Hidden']).optional(),
			is_deletable: z.boolean().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const TaskFields = z
		.object({
			name: z.string().min(1).optional(),
			currency: z.string().optional(),
			is_billable: z.boolean().optional(),
			billing_rate: Decimal.optional(),
			billing_period: z.enum(['day', 'hour']).optional(),
			status: z.enum(['Active', 'Completed', 'Hidden']).optional(),
		})
		.strict();
	const TaskCreateInput = z
		.object({
			project: z.string().url(),
			task: TaskFields.extend({ name: z.string().min(1) }),
		})
		.strict();
	const TaskUpdateInput = z
		.object({ id: z.string().min(1), task: TaskFields })
		.strict();
	const TaskGetInput = z.object({ id: z.string().min(1) }).strict();
	const TaskListInput = z
		.object({
			query: PageQuery.extend({
				view: z.enum(['all', 'active', 'completed', 'hidden']).optional(),
				updated_since: z.string().date().optional(),
				sort: z
					.enum(['name', 'project', 'billing_rate', 'created_at', 'updated_at'])
					.optional(),
				project: z.string().url().optional(),
			}).optional(),
		})
		.strict();
	const TaskListData = z.object({ tasks: z.array(Task) }).passthrough();
	const TaskListOutput = TaskListData.extend({
		pagination: Pagination,
	}).passthrough();
	const TaskOutput = z.object({ task: Task }).passthrough();

	const TimeslipResource = z.union([
		z.string().url(),
		z.object({}).passthrough(),
	]);
	const TimeslipTimer = z
		.object({ running: z.literal(true), start_from: z.string() })
		.passthrough();
	const Timeslip = z
		.object({
			url: z.string().url().optional(),
			task: TimeslipResource.optional(),
			user: TimeslipResource.optional(),
			project: TimeslipResource.optional(),
			dated_on: z.string().date().optional(),
			hours: Decimal.optional(),
			comment: z.string().optional(),
			billed_on_invoice: z.string().url().optional(),
			timer: TimeslipTimer.optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const TimeslipFields = z
		.object({
			task: z.string().url().optional(),
			user: z.string().url().optional(),
			project: z.string().url().optional(),
			dated_on: z.string().date().optional(),
			hours: Decimal.optional(),
			comment: z.string().optional(),
		})
		.strict();
	const TimeslipCreateFields = TimeslipFields.extend({
		task: z.string().url(),
		user: z.string().url(),
		project: z.string().url(),
		dated_on: z.string().date(),
		hours: Decimal,
	});
	const TimeslipCreateInput = z
		.object({ timeslip: TimeslipCreateFields })
		.strict();
	const TimeslipUpdateInput = z
		.object({ id: z.string().min(1), timeslip: TimeslipFields })
		.strict();
	const TimeslipGetInput = z.object({ id: z.string().min(1) }).strict();
	const TimeslipListInput = z
		.object({
			query: PageQuery.extend({
				from_date: z.string().date().optional(),
				to_date: z.string().date().optional(),
				updated_since: z.string().datetime({ offset: true }).optional(),
				view: z.enum(['all', 'unbilled', 'running']).optional(),
				nested: z.boolean().optional(),
				user: z.string().url().optional(),
				task: z.string().url().optional(),
				project: z.string().url().optional(),
			}).optional(),
		})
		.strict();
	const TimeslipListData = z
		.object({ timeslips: z.array(Timeslip) })
		.passthrough();
	const TimeslipListOutput = TimeslipListData.extend({
		pagination: Pagination,
	}).passthrough();
	const TimeslipOutput = z.object({ timeslip: Timeslip }).passthrough();

	const Payroll = {
		list: defineOperation(PayrollYearInput, PayrollListOutput, {
			method: 'GET',
			path: (input) => `/v2/payroll/${encodeURIComponent(input.year)}`,
		}),
		get: defineOperation(PayrollGetInput, PayrollGetOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/payroll/${encodeURIComponent(input.year)}/${input.period}`,
		}),
		markPaymentAsPaid: defineOperation(PayrollPaymentInput, PayrollListOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/payroll/${encodeURIComponent(input.year)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_paid`,
		}),
		markPaymentAsUnpaid: defineOperation(
			PayrollPaymentInput,
			PayrollListOutput,
			{
				method: 'GET',
				path: (input) =>
					`/v2/payroll/${encodeURIComponent(input.year)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_unpaid`,
			},
		),
	};
	const PayrollProfiles = {
		list: defineOperation(PayrollProfilesInput, PayrollProfilesOutput, {
			method: 'GET',
			path: (input) => `/v2/payroll_profiles/${encodeURIComponent(input.year)}`,
			query: (input) => input.query ?? {},
		}),
	};
	const Users = {
		list: defineOperation(UserListInput, UserListOutput, {
			method: 'GET',
			path: () => '/v2/users',
			query: (input) => input.query ?? {},
			paginated: {
				data: UserListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(UserGetInput, UserOutput, {
			method: 'GET',
			path: (input) => `/v2/users/${encodeURIComponent(input.id)}`,
		}),
		me: defineOperation(UserMeInput, UserOutput, {
			method: 'GET',
			path: () => '/v2/users/me',
		}),
		create: defineOperation(UserCreateInput, UserOutput, {
			method: 'POST',
			path: () => '/v2/users',
			body: (input) => ({ user: input.user }),
		}),
		update: defineOperation(UserUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: (input) => `/v2/users/${encodeURIComponent(input.id)}`,
			body: (input) => ({ user: input.user }),
		}),
		updateMe: defineOperation(UserMeUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: () => '/v2/users/me',
			body: (input) => ({ user: input.user }),
		}),
		delete: defineOperation(UserGetInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/users/${encodeURIComponent(input.id)}`,
		}),
	};
	const Tasks = {
		list: defineOperation(TaskListInput, TaskListOutput, {
			method: 'GET',
			path: () => '/v2/tasks',
			query: (input) => input.query ?? {},
			paginated: {
				data: TaskListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(TaskGetInput, TaskOutput, {
			method: 'GET',
			path: (input) => `/v2/tasks/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(TaskCreateInput, TaskOutput, {
			method: 'POST',
			path: (input) => '/v2/tasks',
			query: (input) => ({ project: input.project }),
			body: (input) => ({ task: input.task }),
		}),
		update: defineOperation(TaskUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: (input) => `/v2/tasks/${encodeURIComponent(input.id)}`,
			body: (input) => ({ task: input.task }),
		}),
		// The Tasks docs print DELETE /v2/users/:id; DELETE /v2/tasks/:id is the route that deletes a task (checked on the sandbox).
		delete: defineOperation(TaskGetInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/tasks/${encodeURIComponent(input.id)}`,
		}),
	};
	const Timeslips = {
		list: defineOperation(TimeslipListInput, TimeslipListOutput, {
			method: 'GET',
			path: () => '/v2/timeslips',
			query: (input) => input.query ?? {},
			paginated: {
				data: TimeslipListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(TimeslipGetInput, TimeslipOutput, {
			method: 'GET',
			path: (input) => `/v2/timeslips/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(TimeslipCreateInput, TimeslipOutput, {
			method: 'POST',
			path: () => '/v2/timeslips',
			body: (input) => ({ timeslip: input.timeslip }),
		}),
		update: defineOperation(TimeslipUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: (input) => `/v2/timeslips/${encodeURIComponent(input.id)}`,
			body: (input) => ({ timeslip: input.timeslip }),
		}),
		delete: defineOperation(TimeslipGetInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/timeslips/${encodeURIComponent(input.id)}`,
		}),
		startTimer: defineOperation(TimeslipGetInput, TimeslipOutput, {
			method: 'POST',
			path: (input) => `/v2/timeslips/${encodeURIComponent(input.id)}/timer`,
		}),
		stopTimer: defineOperation(TimeslipGetInput, TimeslipOutput, {
			method: 'DELETE',
			path: (input) => `/v2/timeslips/${encodeURIComponent(input.id)}/timer`,
		}),
	};

	const TimeUserEndpoints = {
		payroll: Payroll,
		payrollProfiles: PayrollProfiles,
		users: Users,
		tasks: Tasks,
		timeslips: Timeslips,
	} as const;
	const TimeUserEndpointSchemas = {
		'payroll.list': { input: PayrollYearInput, output: PayrollListOutput },
		'payroll.get': { input: PayrollGetInput, output: PayrollGetOutput },
		'payroll.markPaymentAsPaid': {
			input: PayrollPaymentInput,
			output: PayrollListOutput,
		},
		'payroll.markPaymentAsUnpaid': {
			input: PayrollPaymentInput,
			output: PayrollListOutput,
		},
		'payrollProfiles.list': {
			input: PayrollProfilesInput,
			output: PayrollProfilesOutput,
		},
		'users.list': { input: UserListInput, output: UserListOutput },
		'users.get': { input: UserGetInput, output: UserOutput },
		'users.me': { input: UserMeInput, output: UserOutput },
		'users.create': { input: UserCreateInput, output: UserOutput },
		'users.update': { input: UserUpdateInput, output: EmptyResponse },
		'users.updateMe': { input: UserMeUpdateInput, output: EmptyResponse },
		'users.delete': { input: UserGetInput, output: EmptyResponse },
		'tasks.list': { input: TaskListInput, output: TaskListOutput },
		'tasks.get': { input: TaskGetInput, output: TaskOutput },
		'tasks.create': { input: TaskCreateInput, output: TaskOutput },
		'tasks.update': { input: TaskUpdateInput, output: EmptyResponse },
		'tasks.delete': { input: TaskGetInput, output: EmptyResponse },
		'timeslips.list': { input: TimeslipListInput, output: TimeslipListOutput },
		'timeslips.get': { input: TimeslipGetInput, output: TimeslipOutput },
		'timeslips.create': { input: TimeslipCreateInput, output: TimeslipOutput },
		'timeslips.update': { input: TimeslipUpdateInput, output: EmptyResponse },
		'timeslips.delete': { input: TimeslipGetInput, output: EmptyResponse },
		'timeslips.startTimer': { input: TimeslipGetInput, output: TimeslipOutput },
		'timeslips.stopTimer': { input: TimeslipGetInput, output: TimeslipOutput },
	} as const;
	return { TimeUserEndpoints, TimeUserEndpointSchemas };
}

export const TimeUserEndpointMeta = {
	'payroll.list': {
		riskLevel: 'read',
		description: 'List payroll periods and payment details for a tax year',
	},
	'payroll.get': {
		riskLevel: 'read',
		description: 'Get a payroll period and its payslips',
	},
	'payroll.markPaymentAsPaid': {
		riskLevel: 'destructive',
		description: 'Mark a payroll payment as paid',
	},
	'payroll.markPaymentAsUnpaid': {
		riskLevel: 'write',
		description:
			'Mark a payroll payment as unpaid using the published GET method',
	},
	'payrollProfiles.list': {
		riskLevel: 'read',
		description:
			'List payroll profiles for a tax year with an optional user filter',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List company users with documented permission filters',
	},
	'users.get': { riskLevel: 'read', description: 'Get a company user' },
	'users.me': {
		riskLevel: 'read',
		description: 'Get the currently active user profile',
	},
	'users.create': {
		riskLevel: 'destructive',
		description: 'Create a company user and optionally send an invitation',
	},
	'users.update': { riskLevel: 'write', description: 'Update a company user' },
	'users.updateMe': {
		riskLevel: 'write',
		description: 'Update the active user profile',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company user',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List time-tracking tasks with documented filters and pagination',
	},
	'tasks.get': { riskLevel: 'read', description: 'Get a task' },
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task under a project',
	},
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
	'timeslips.list': {
		riskLevel: 'read',
		description: 'List timeslips with filters, nesting and pagination',
	},
	'timeslips.get': {
		riskLevel: 'read',
		description: 'Get a timeslip and any running timer',
	},
	'timeslips.create': {
		riskLevel: 'write',
		description: 'Create a timeslip record',
	},
	'timeslips.update': { riskLevel: 'write', description: 'Update a timeslip' },
	'timeslips.delete': {
		riskLevel: 'destructive',
		description: 'Delete a timeslip',
	},
	'timeslips.startTimer': {
		riskLevel: 'write',
		description: 'Start a timer on a timeslip',
	},
	'timeslips.stopTimer': {
		riskLevel: 'write',
		description: 'Stop the timer on a timeslip',
	},
} as const;

const lazy = lazyModule(build, TimeUserEndpointMeta);
export const TimeUserEndpoints = lazy.endpoints(
	(module) => module.TimeUserEndpoints,
);
export const TimeUserEndpointSchemas = lazy.schemas(
	(module) => module.TimeUserEndpointSchemas,
);
