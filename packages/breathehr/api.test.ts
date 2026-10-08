import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import {
	BREATHE_HR_API_BASE,
	BREATHE_HR_SANDBOX_API_BASE,
	BreatheHrAPIError,
	BreatheHrRateLimitError,
	breatheHrBaseUrl,
	makeBreatheHrRequest,
} from './client';
import * as handlers from './endpoints/handlers';
import { BreatheHrEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { breathehr } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ ok: true } as never);
});

const ctx = { key: 'prod-test-key' } as never;

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	return mockRequest.mock.calls[0]?.[1];
}

const cases: Array<{
	name: keyof typeof handlers;
	input: Record<string, unknown>;
	url: string;
	method?: string;
}> = [
	{ name: 'accountGet', input: {}, url: '/account' },
	{ name: 'employeesList', input: { page: 1 }, url: '/employees' },
	{ name: 'employeesGet', input: { id: 1 }, url: '/employees/1' },
	{
		name: 'employeesCreate',
		input: {
			first_name: 'A',
			last_name: 'B',
			email: 'a@b.com',
			company_join_date: '2024-01-01',
		},
		url: '/employees',
		method: 'POST',
	},
	{
		name: 'employeesCreateChangeRequest',
		input: { id: 1, field: 'job_title', value: 'Eng' },
		url: '/employees/1/change_requests',
		method: 'POST',
	},
	{
		name: 'employeesCreateExpense',
		input: {
			employee_id: 1,
			amount: 10,
			description: 'x',
			expense_date: '2024-01-01',
			payable_to_employee: true,
			company_expense_type_id: 1,
		},
		url: '/employees/1/employee_expenses',
		method: 'POST',
	},
	{
		name: 'employeesCreateExpenseClaim',
		input: { employee_id: 1, employee_expense_ids: [2] },
		url: '/employees/1/employee_expense_claims',
		method: 'POST',
	},
	{
		name: 'employeesCreateSickness',
		input: { id: 1, start_date: '2024-01-01', company_sicknesstype_id: 1 },
		url: '/employees/1/sicknesses',
		method: 'POST',
	},
	{
		name: 'employeeExpensesDelete',
		input: { id: 9 },
		url: '/employee_expenses/9',
		method: 'DELETE',
	},
	{
		name: 'employeeTrainingCoursesDelete',
		input: { id: '9' },
		url: '/employee_training_courses/9',
		method: 'DELETE',
	},
	{
		name: 'employeeExpensesGet',
		input: { id: 9 },
		url: '/employee_expenses/9',
	},
	{ name: 'leaveRequestsGet', input: { id: 3 }, url: '/leave_requests/3' },
	{
		name: 'leaveRequestsGetCancelling',
		input: { id: 3 },
		url: '/leave_requests/3/cancelling',
	},
	{
		name: 'leaveRequestsApprove',
		input: { id: 3 },
		url: '/leave_requests/3/approve',
		method: 'POST',
	},
	{
		name: 'leaveRequestsReject',
		input: { id: 3, rejection_reason: 'busy' },
		url: '/leave_requests/3/reject',
		method: 'POST',
	},
	{ name: 'absencesList', input: { page: 1 }, url: '/absences' },
	{ name: 'benefitsList', input: { page: 1 }, url: '/employee_benefits' },
	{ name: 'bonusesList', input: { page: 1 }, url: '/employee_bonuses' },
	{ name: 'changeRequestsList', input: { page: 1 }, url: '/change_requests' },
	{
		name: 'companyDocumentsList',
		input: { page: 1 },
		url: '/company_documents',
	},
	{ name: 'companyProjectsList', input: { page: 1 }, url: '/company_projects' },
	{
		name: 'companyTrainingTypesList',
		input: { page: 1 },
		url: '/company_training_types',
	},
	{ name: 'departmentsList', input: { page: 1 }, url: '/departments' },
	{
		name: 'departmentsListAbsences',
		input: { id: 4 },
		url: '/departments/4/absences',
	},
	{
		name: 'departmentsListBenefits',
		input: { id: 4 },
		url: '/departments/4/benefits',
	},
	{
		name: 'departmentsListBonuses',
		input: { id: 4 },
		url: '/departments/4/bonuses',
	},
	{
		name: 'departmentsListLeaveRequests',
		input: { id: 4 },
		url: '/departments/4/leave_requests',
	},
	{
		name: 'departmentsListSalaries',
		input: { id: 4 },
		url: '/departments/4/salaries',
	},
	{ name: 'divisionsList', input: {}, url: '/divisions' },
	{
		name: 'employeesListAbsences',
		input: { id: 1 },
		url: '/employees/1/absences',
	},
	{
		name: 'employeesListBenefits',
		input: { id: 1 },
		url: '/employees/1/benefits',
	},
	{
		name: 'employeesListBonuses',
		input: { id: 1 },
		url: '/employees/1/bonuses',
	},
	{
		name: 'employeesListChangeRequests',
		input: { id: 1 },
		url: '/employees/1/change_requests',
	},
	{
		name: 'employeeExpenseClaimsList',
		input: { page: 1 },
		url: '/employee_expense_claims',
	},
	{
		name: 'employeeExpensesList',
		input: { page: 1 },
		url: '/employee_expenses',
	},
	{
		name: 'employeesListHolidayYears',
		input: { id: 1 },
		url: '/employees/1/holiday_years',
	},
	{ name: 'employeeJobsList', input: { page: 1 }, url: '/employee_jobs' },
	{
		name: 'employeesListLeaveRequests',
		input: { id: 1 },
		url: '/employees/1/leave_requests',
	},
	{
		name: 'employeesListSalaries',
		input: { id: 1 },
		url: '/employees/1/salaries',
	},
	{
		name: 'employeeTrainingCoursesList',
		input: { page: 1 },
		url: '/employee_training_courses',
	},
	{ name: 'holidayAllowancesList', input: {}, url: '/holiday_allowances' },
	{ name: 'leaveRequestsList', input: { page: 1 }, url: '/leave_requests' },
	{ name: 'locationsList', input: { page: 1 }, url: '/locations' },
	{ name: 'otherLeaveReasonsList', input: {}, url: '/other_leave_reasons' },
	{ name: 'salariesList', input: { page: 1 }, url: '/salaries' },
	{ name: 'sicknessesList', input: { page: 1 }, url: '/sicknesses' },
	{ name: 'workingPatternsList', input: { page: 1 }, url: '/working_patterns' },
	{
		name: 'employeeExpenseClaimsUpdate',
		input: { id: 8, approve: true, approver_rejector_id: 1 },
		url: '/employee_expense_claims/8',
		method: 'PUT',
	},
	{
		name: 'employeeTrainingCoursesUpdate',
		input: { id: '8', name: 'Course' },
		url: '/employee_training_courses/8',
		method: 'PUT',
	},
	{
		name: 'sicknessesUpdate',
		input: { id: 8, status: 'returned' },
		url: '/sicknesses/8',
		method: 'PUT',
	},
];

describe('Breathe HR plugin', () => {
	it('registers 50 endpoints and api_key auth', () => {
		const plugin = breathehr();
		expect(plugin.id).toBe('breathehr');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(50);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = breathehr({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError without a key', async () => {
		const plugin = breathehr();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('routes sandbox keys to the official sandbox host', () => {
		expect(breatheHrBaseUrl('sandbox-abc')).toBe(BREATHE_HR_SANDBOX_API_BASE);
		expect(breatheHrBaseUrl('prod-abc')).toBe(BREATHE_HR_API_BASE);
	});

	it.each(cases)('$name hits $url', async ({ name, input, url, method }) => {
		const fn = handlers[name] as (
			c: typeof ctx,
			i: Record<string, unknown>,
		) => Promise<unknown>;
		await fn(ctx, input);
		const call = lastCall();
		expect(call?.url).toBe(url);
		expect(call?.method ?? 'GET').toBe(method ?? 'GET');
	});

	it('maps company_join_date to official join_date', async () => {
		await handlers.employeesCreate(ctx, {
			first_name: 'A',
			last_name: 'B',
			email: 'a@b.com',
			company_join_date: '2024-01-01',
		});
		const body = lastCall()?.body as { employee: { join_date?: string } };
		expect(body.employee.join_date).toBe('2024-01-01');
	});

	it('sends X-API-KEY on requests', async () => {
		await makeBreatheHrRequest('/account', 'prod-key');
		const config = mockRequest.mock.calls[0]?.[0];
		const headers = config?.HEADERS as Record<string, string> | undefined;
		expect(headers?.['X-API-KEY']).toBe('prod-key');
		expect(config?.BASE).toBe(BREATHE_HR_API_BASE);
	});

	it('classifies 429 as rate limit', async () => {
		const err = new BreatheHrRateLimitError('Rate Limit Reached', 1000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1000,
		});
	});

	it('classifies 401 as auth', () => {
		const err = new BreatheHrAPIError('unauthorized', 401, 401);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
	});

	it('validates required create-employee fields', () => {
		expect(() =>
			BreatheHrEndpointInputSchemas.employeesCreate.parse({
				first_name: 'A',
			}),
		).toThrow();
	});
});
