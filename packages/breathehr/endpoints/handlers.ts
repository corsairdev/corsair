import { makeBreatheHrRequest } from '../client';
import type { BreatheHrEndpoints } from '../index';

type Ctx = Parameters<BreatheHrEndpoints['accountGet']>[0];

function call<T>(
	ctx: Ctx,
	path: string,
	options: Parameters<typeof makeBreatheHrRequest>[2] = {},
): Promise<T> {
	return makeBreatheHrRequest<T>(path, ctx.key, options);
}

function omit<T extends Record<string, unknown>>(
	input: T,
	keys: string[],
): Record<string, unknown> {
	const body = { ...input };
	for (const key of keys) delete body[key];
	return body;
}

export const accountGet: BreatheHrEndpoints['accountGet'] = (ctx) =>
	call(ctx, '/account');

export const employeesList: BreatheHrEndpoints['employeesList'] = (
	ctx,
	input,
) => call(ctx, '/employees', { query: input });

export const employeesGet: BreatheHrEndpoints['employeesGet'] = (ctx, input) =>
	call(ctx, `/employees/${input.id}`);

export const employeesCreate: BreatheHrEndpoints['employeesCreate'] = (
	ctx,
	input,
) =>
	call(ctx, '/employees', {
		method: 'POST',
		body: {
			employee: {
				...input,
				join_date: input.join_date ?? input.company_join_date,
			},
		},
	});

export const employeesCreateChangeRequest: BreatheHrEndpoints['employeesCreateChangeRequest'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/change_requests`, {
			method: 'POST',
			body: {
				change_request: omit(input, ['id']),
			},
		});

export const employeesCreateExpense: BreatheHrEndpoints['employeesCreateExpense'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.employee_id}/employee_expenses`, {
			method: 'POST',
			body: { employee_expense: omit(input, ['employee_id']) },
		});

export const employeesCreateExpenseClaim: BreatheHrEndpoints['employeesCreateExpenseClaim'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.employee_id}/employee_expense_claims`, {
			method: 'POST',
			body: { employee_expense_claim: omit(input, ['employee_id']) },
		});

export const employeesCreateSickness: BreatheHrEndpoints['employeesCreateSickness'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/sicknesses`, {
			method: 'POST',
			body: { sickness: omit(input, ['id']) },
		});

export const employeeExpensesDelete: BreatheHrEndpoints['employeeExpensesDelete'] =
	(ctx, input) =>
		call(ctx, `/employee_expenses/${input.id}`, { method: 'DELETE' });

export const employeeTrainingCoursesDelete: BreatheHrEndpoints['employeeTrainingCoursesDelete'] =
	(ctx, input) =>
		call(ctx, `/employee_training_courses/${input.id}`, { method: 'DELETE' });

export const employeeExpensesGet: BreatheHrEndpoints['employeeExpensesGet'] = (
	ctx,
	input,
) => call(ctx, `/employee_expenses/${input.id}`);

export const leaveRequestsGet: BreatheHrEndpoints['leaveRequestsGet'] = (
	ctx,
	input,
) => call(ctx, `/leave_requests/${input.id}`);

export const leaveRequestsGetCancelling: BreatheHrEndpoints['leaveRequestsGetCancelling'] =
	(ctx, input) => call(ctx, `/leave_requests/${input.id}/cancelling`);

export const leaveRequestsApprove: BreatheHrEndpoints['leaveRequestsApprove'] =
	(ctx, input) =>
		call(ctx, `/leave_requests/${input.id}/approve`, { method: 'POST' });

export const leaveRequestsReject: BreatheHrEndpoints['leaveRequestsReject'] = (
	ctx,
	input,
) =>
	call(ctx, `/leave_requests/${input.id}/reject`, {
		method: 'POST',
		body: { rejection_reason: input.rejection_reason },
	});

export const absencesList: BreatheHrEndpoints['absencesList'] = (ctx, input) =>
	call(ctx, '/absences', { query: input });

export const benefitsList: BreatheHrEndpoints['benefitsList'] = (ctx, input) =>
	call(ctx, '/employee_benefits', { query: input });

export const bonusesList: BreatheHrEndpoints['bonusesList'] = (ctx, input) =>
	call(ctx, '/employee_bonuses', { query: input });

export const changeRequestsList: BreatheHrEndpoints['changeRequestsList'] = (
	ctx,
	input,
) => call(ctx, '/change_requests', { query: input });

export const companyDocumentsList: BreatheHrEndpoints['companyDocumentsList'] =
	(ctx, input) => call(ctx, '/company_documents', { query: input });

export const companyProjectsList: BreatheHrEndpoints['companyProjectsList'] = (
	ctx,
	input,
) => call(ctx, '/company_projects', { query: input });

export const companyTrainingTypesList: BreatheHrEndpoints['companyTrainingTypesList'] =
	(ctx, input) => call(ctx, '/company_training_types', { query: input });

export const departmentsList: BreatheHrEndpoints['departmentsList'] = (
	ctx,
	input,
) => call(ctx, '/departments', { query: input });

export const departmentsListAbsences: BreatheHrEndpoints['departmentsListAbsences'] =
	(ctx, input) =>
		call(ctx, `/departments/${input.id}/absences`, {
			query: omit(input, ['id']),
		});

export const departmentsListBenefits: BreatheHrEndpoints['departmentsListBenefits'] =
	(ctx, input) =>
		call(ctx, `/departments/${input.id}/benefits`, {
			query: omit(input, ['id']),
		});

export const departmentsListBonuses: BreatheHrEndpoints['departmentsListBonuses'] =
	(ctx, input) =>
		call(ctx, `/departments/${input.id}/bonuses`, {
			query: omit(input, ['id']),
		});

export const departmentsListLeaveRequests: BreatheHrEndpoints['departmentsListLeaveRequests'] =
	(ctx, input) =>
		call(ctx, `/departments/${input.id}/leave_requests`, {
			query: omit(input, ['id']),
		});

export const departmentsListSalaries: BreatheHrEndpoints['departmentsListSalaries'] =
	(ctx, input) =>
		call(ctx, `/departments/${input.id}/salaries`, {
			query: omit(input, ['id']),
		});

export const divisionsList: BreatheHrEndpoints['divisionsList'] = (ctx) =>
	call(ctx, '/divisions');

export const employeesListAbsences: BreatheHrEndpoints['employeesListAbsences'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/absences`, {
			query: omit(input, ['id']),
		});

export const employeesListBenefits: BreatheHrEndpoints['employeesListBenefits'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/benefits`, {
			query: omit(input, ['id']),
		});

export const employeesListBonuses: BreatheHrEndpoints['employeesListBonuses'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/bonuses`, {
			query: omit(input, ['id']),
		});

export const employeesListChangeRequests: BreatheHrEndpoints['employeesListChangeRequests'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/change_requests`, {
			query: omit(input, ['id']),
		});

export const employeeExpenseClaimsList: BreatheHrEndpoints['employeeExpenseClaimsList'] =
	(ctx, input) => call(ctx, '/employee_expense_claims', { query: input });

export const employeeExpensesList: BreatheHrEndpoints['employeeExpensesList'] =
	(ctx, input) => call(ctx, '/employee_expenses', { query: input });

export const employeesListHolidayYears: BreatheHrEndpoints['employeesListHolidayYears'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/holiday_years`, {
			query: omit(input, ['id']),
		});

export const employeeJobsList: BreatheHrEndpoints['employeeJobsList'] = (
	ctx,
	input,
) => call(ctx, '/employee_jobs', { query: input });

export const employeesListLeaveRequests: BreatheHrEndpoints['employeesListLeaveRequests'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/leave_requests`, {
			query: omit(input, ['id']),
		});

export const employeesListSalaries: BreatheHrEndpoints['employeesListSalaries'] =
	(ctx, input) =>
		call(ctx, `/employees/${input.id}/salaries`, {
			query: omit(input, ['id']),
		});

export const employeeTrainingCoursesList: BreatheHrEndpoints['employeeTrainingCoursesList'] =
	(ctx, input) => call(ctx, '/employee_training_courses', { query: input });

export const holidayAllowancesList: BreatheHrEndpoints['holidayAllowancesList'] =
	(ctx) => call(ctx, '/holiday_allowances');

export const leaveRequestsList: BreatheHrEndpoints['leaveRequestsList'] = (
	ctx,
	input,
) => call(ctx, '/leave_requests', { query: input });

export const locationsList: BreatheHrEndpoints['locationsList'] = (
	ctx,
	input,
) => call(ctx, '/locations', { query: input });

export const otherLeaveReasonsList: BreatheHrEndpoints['otherLeaveReasonsList'] =
	(ctx) => call(ctx, '/other_leave_reasons');

export const salariesList: BreatheHrEndpoints['salariesList'] = (ctx, input) =>
	call(ctx, '/salaries', { query: input });

export const sicknessesList: BreatheHrEndpoints['sicknessesList'] = (
	ctx,
	input,
) => call(ctx, '/sicknesses', { query: input });

export const workingPatternsList: BreatheHrEndpoints['workingPatternsList'] = (
	ctx,
	input,
) => call(ctx, '/working_patterns', { query: input });

export const employeeExpenseClaimsUpdate: BreatheHrEndpoints['employeeExpenseClaimsUpdate'] =
	(ctx, input) =>
		call(ctx, `/employee_expense_claims/${input.id}`, {
			method: 'PUT',
			body: { employee_expense_claim: omit(input, ['id']) },
		});

export const employeeTrainingCoursesUpdate: BreatheHrEndpoints['employeeTrainingCoursesUpdate'] =
	(ctx, input) =>
		call(ctx, `/employee_training_courses/${input.id}`, {
			method: 'PUT',
			body: { employee_training_course: omit(input, ['id']) },
		});

export const sicknessesUpdate: BreatheHrEndpoints['sicknessesUpdate'] = (
	ctx,
	input,
) =>
	call(ctx, `/sicknesses/${input.id}`, {
		method: 'PUT',
		body: { sickness: omit(input, ['id']) },
	});
