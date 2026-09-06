import { z } from 'zod';

const Ref = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
	})
	.loose();

/**
 * Breathe HR account.
 * Official: GET /v1/account
 * https://developer.breathehr.com/documentation/getting_started
 */
export const BreatheHrAccount = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		domain: z.string().optional(),
		uuid: z.string().optional(),
		using_rta: z.boolean().optional(),
		health_and_safety_enabled: z.boolean().optional(),
	})
	.loose();

export type BreatheHrAccount = z.infer<typeof BreatheHrAccount>;

/**
 * Breathe HR employee.
 * Official: GET/POST /v1/employees — plural root `employees`
 * https://developer.breathehr.com/documentation/request_and_response
 */
export const BreatheHrEmployee = z
	.object({
		id: z.number().optional(),
		account_id: z.number().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		status: z.string().optional(),
		join_date: z.string().optional(),
		company_join_date: z.string().optional(),
		job_start_date: z.string().nullable().optional(),
		department: Ref.nullable().optional(),
		division: Ref.nullable().optional(),
		location: Ref.nullable().optional(),
		working_pattern: Ref.nullable().optional(),
		holiday_allowance: Ref.nullable().optional(),
		line_manager: Ref.nullable().optional(),
		hr: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();

export type BreatheHrEmployee = z.infer<typeof BreatheHrEmployee>;

/**
 * Breathe HR leave request.
 * Official: GET /v1/leave_requests
 * https://developer.breathehr.com/
 */
export const BreatheHrLeaveRequest = z
	.object({
		id: z.number().optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		notes: z.string().nullable().optional(),
	})
	.loose();

export type BreatheHrLeaveRequest = z.infer<typeof BreatheHrLeaveRequest>;

/**
 * Breathe HR absence.
 * Official: GET /v1/absences
 * https://developer.breathehr.com/
 */
export const BreatheHrAbsence = z
	.object({
		id: z.number().optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();

export type BreatheHrAbsence = z.infer<typeof BreatheHrAbsence>;

/**
 * Breathe HR department.
 * Official: GET /v1/departments
 * https://developer.breathehr.com/
 */
export const BreatheHrDepartment = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
	})
	.loose();

export type BreatheHrDepartment = z.infer<typeof BreatheHrDepartment>;

/**
 * Breathe HR sickness.
 * Official: GET /v1/sicknesses
 * https://developer.breathehr.com/
 */
export const BreatheHrSickness = z
	.object({
		id: z.number().optional(),
		start_date: z.string().optional(),
		end_date: z.string().nullable().optional(),
		status: z.string().optional(),
		reason: z.string().optional(),
	})
	.loose();

export type BreatheHrSickness = z.infer<typeof BreatheHrSickness>;

/**
 * Breathe HR employee expense.
 * Official: GET /v1/employee_expenses
 * https://developer.breathehr.com/
 */
export const BreatheHrEmployeeExpense = z
	.object({
		id: z.number().optional(),
		amount: z.union([z.number(), z.string()]).optional(),
		description: z.string().optional(),
		expense_date: z.string().optional(),
	})
	.loose();

export type BreatheHrEmployeeExpense = z.infer<typeof BreatheHrEmployeeExpense>;
