import { z } from 'zod';
import {
	BreatheHrAbsence,
	BreatheHrAccount,
	BreatheHrEmployee,
	BreatheHrEmployeeExpense,
	BreatheHrLeaveRequest,
	BreatheHrSickness,
} from '../schema';

const PageQuery = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(100).optional(),
});

const Root = z.record(z.string(), z.unknown());
const IdInput = z.object({ id: z.union([z.number().int(), z.string()]) });

function listOut(item: z.ZodType) {
	return z.object({}).catchall(z.array(item).or(z.unknown())).loose();
}

export const AccountGetInputSchema = z.object({});
export const AccountGetResponseSchema = z
	.object({ account: BreatheHrAccount.optional() })
	.loose();

export const EmployeesListInputSchema = PageQuery.extend({
	filter: z.enum(['hr', 'line_manager', 'either']).optional(),
	rotacloud: z.boolean().optional(),
});
export const EmployeesListResponseSchema = z
	.object({ employees: z.array(BreatheHrEmployee).optional() })
	.loose();

export const EmployeesGetInputSchema = z.object({ id: z.number().int() });
export const EmployeesGetResponseSchema = EmployeesListResponseSchema;

export const EmployeesCreateInputSchema = z
	.object({
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		email: z.string().email(),
		company_join_date: z.string().optional(),
		join_date: z.string().optional(),
		job_title: z.string().optional(),
		job_start_date: z.string().optional(),
		hr: z.boolean().optional(),
		dob: z.string().optional(),
		gender: z.string().optional(),
		status: z.string().optional(),
		person_type: z.string().optional(),
		department: z.number().int().optional(),
		division: z.number().int().optional(),
		location: z.number().int().optional(),
		working_pattern: z.number().int().optional(),
		working_pattern_id: z.number().int().optional(),
		holiday_allowance: z.number().int().optional(),
		holiday_allowance_id: z.number().int().optional(),
		middle_name: z.string().optional(),
		work_mobile: z.string().optional(),
		home_telephone: z.string().optional(),
		personal_mobile: z.string().optional(),
		employee_ref: z.string().optional(),
		full_or_part_time: z.string().optional(),
		receives_statutory_holidays: z.boolean().optional(),
	})
	.refine((value) => Boolean(value.join_date || value.company_join_date), {
		message: 'join_date or company_join_date is required',
	});
export const EmployeesCreateResponseSchema = EmployeesListResponseSchema;

export const EmployeesCreateChangeRequestInputSchema = z.object({
	id: z.union([z.number().int(), z.string()]),
	field: z.string().min(1),
	value: z.string(),
	approved: z.boolean().optional(),
});
export const EmployeesCreateChangeRequestResponseSchema = Root;

export const EmployeesCreateExpenseInputSchema = z.object({
	employee_id: z.number().int(),
	amount: z.number(),
	description: z.string().min(1),
	expense_date: z.string(),
	payable_to_employee: z.boolean(),
	company_expense_type_id: z.number().int(),
	vat: z.number().optional(),
	miles: z.number().optional(),
	client_name: z.string().optional(),
	has_receipt: z.boolean().optional(),
	company_project_id: z.number().int().optional(),
	chargeable_to_client: z.boolean().optional(),
	company_mileage_rate_id: z.number().int().optional(),
});
export const EmployeesCreateExpenseResponseSchema = z
	.object({ employee_expenses: z.array(BreatheHrEmployeeExpense).optional() })
	.loose();

export const EmployeesCreateExpenseClaimInputSchema = z.object({
	employee_id: z.number().int(),
	employee_expense_ids: z.array(z.number().int()).min(1),
});
export const EmployeesCreateExpenseClaimResponseSchema = Root;

export const EmployeesCreateSicknessInputSchema = z.object({
	id: z.number().int(),
	start_date: z.string(),
	company_sicknesstype_id: z.number().int(),
	reason: z.string().optional(),
	status: z.string().optional(),
	end_date: z.string().optional(),
	half_day: z.boolean().optional(),
	half_end: z.boolean().optional(),
	half_start: z.boolean().optional(),
	review_notes: z.string().optional(),
	half_end_am_pm: z.enum(['am', 'pm']).optional(),
	half_start_am_pm: z.enum(['am', 'pm']).optional(),
});
export const EmployeesCreateSicknessResponseSchema = z
	.object({ sicknesses: z.array(BreatheHrSickness).optional() })
	.loose();

export const EmployeeExpensesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export const EmployeeExpensesDeleteResponseSchema = z
	.object({ deleted: z.boolean().optional() })
	.loose();

export const EmployeeTrainingCoursesDeleteInputSchema = IdInput;
export const EmployeeTrainingCoursesDeleteResponseSchema =
	EmployeeExpensesDeleteResponseSchema;

export const EmployeeExpensesGetInputSchema = z.object({
	id: z.number().int(),
});
export const EmployeeExpensesGetResponseSchema =
	EmployeesCreateExpenseResponseSchema;

export const LeaveRequestsGetInputSchema = z.object({ id: z.number().int() });
export const LeaveRequestsGetResponseSchema = z
	.object({ leave_requests: z.array(BreatheHrLeaveRequest).optional() })
	.loose();

export const LeaveRequestsGetCancellingInputSchema = z.object({
	id: z.number().int(),
});
export const LeaveRequestsGetCancellingResponseSchema =
	LeaveRequestsGetResponseSchema;

export const LeaveRequestsApproveInputSchema = z.object({
	id: z.number().int(),
});
export const LeaveRequestsApproveResponseSchema =
	LeaveRequestsGetResponseSchema;

export const LeaveRequestsRejectInputSchema = z.object({
	id: z.number().int(),
	rejection_reason: z.string().min(1),
});
export const LeaveRequestsRejectResponseSchema = LeaveRequestsGetResponseSchema;

export const AbsencesListInputSchema = PageQuery.extend({
	type: z.enum(['Holiday', 'OtherLeave']).optional(),
	end_date: z.string().optional(),
	start_date: z.string().optional(),
	rotacloud: z.boolean().optional(),
	employee_id: z.number().int().optional(),
	department_id: z.number().int().optional(),
	other_leave_reason_id: z.number().int().optional(),
	exclude_cancelled_absences: z.boolean().optional(),
});
export const AbsencesListResponseSchema = z
	.object({ absences: z.array(BreatheHrAbsence).optional() })
	.loose();

export const BenefitsListInputSchema = PageQuery;
export const BenefitsListResponseSchema = listOut(z.object({}).loose());

export const BonusesListInputSchema = PageQuery;
export const BonusesListResponseSchema = listOut(z.object({}).loose());

export const ChangeRequestsListInputSchema = PageQuery;
export const ChangeRequestsListResponseSchema = listOut(z.object({}).loose());

export const CompanyDocumentsListInputSchema = PageQuery;
export const CompanyDocumentsListResponseSchema = listOut(z.object({}).loose());

export const CompanyProjectsListInputSchema = PageQuery;
export const CompanyProjectsListResponseSchema = listOut(z.object({}).loose());

export const CompanyTrainingTypesListInputSchema = PageQuery;
export const CompanyTrainingTypesListResponseSchema = listOut(
	z.object({}).loose(),
);

export const DepartmentsListInputSchema = PageQuery;
export const DepartmentsListResponseSchema = listOut(z.object({}).loose());

export const DepartmentsListAbsencesInputSchema = IdInput.merge(
	PageQuery,
).extend({
	exclude_cancelled_absences: z.boolean().optional(),
});
export const DepartmentsListAbsencesResponseSchema = AbsencesListResponseSchema;

export const DepartmentsListBenefitsInputSchema = IdInput.merge(PageQuery);
export const DepartmentsListBenefitsResponseSchema = BenefitsListResponseSchema;

export const DepartmentsListBonusesInputSchema = IdInput.merge(PageQuery);
export const DepartmentsListBonusesResponseSchema = BonusesListResponseSchema;

export const DepartmentsListLeaveRequestsInputSchema = z
	.object({ id: z.number().int() })
	.merge(PageQuery)
	.extend({ exclude_cancelled_requests: z.boolean().optional() });
export const DepartmentsListLeaveRequestsResponseSchema =
	LeaveRequestsGetResponseSchema;

export const DepartmentsListSalariesInputSchema = IdInput.merge(PageQuery);
export const DepartmentsListSalariesResponseSchema = listOut(
	z.object({}).loose(),
);

export const DivisionsListInputSchema = z.object({});
export const DivisionsListResponseSchema = listOut(z.object({}).loose());

export const EmployeesListAbsencesInputSchema = z
	.object({ id: z.number().int() })
	.merge(PageQuery)
	.extend({ exclude_cancelled_absences: z.boolean().optional() });
export const EmployeesListAbsencesResponseSchema = AbsencesListResponseSchema;

export const EmployeesListBenefitsInputSchema = IdInput.merge(PageQuery);
export const EmployeesListBenefitsResponseSchema = BenefitsListResponseSchema;

export const EmployeesListBonusesInputSchema = IdInput.merge(PageQuery);
export const EmployeesListBonusesResponseSchema = BonusesListResponseSchema;

export const EmployeesListChangeRequestsInputSchema = IdInput.merge(PageQuery);
export const EmployeesListChangeRequestsResponseSchema =
	ChangeRequestsListResponseSchema;

export const EmployeeExpenseClaimsListInputSchema = PageQuery.extend({
	employee_id: z.number().int().optional(),
	state_filter: z.enum(['submitted', 'approved', 'completed']).optional(),
});
export const EmployeeExpenseClaimsListResponseSchema = listOut(
	z.object({}).loose(),
);

export const EmployeeExpensesListInputSchema = PageQuery.extend({
	employee_id: z.number().int().optional(),
	show_claimed: z.boolean().optional(),
});
export const EmployeeExpensesListResponseSchema =
	EmployeesCreateExpenseResponseSchema;

export const EmployeesListHolidayYearsInputSchema = z.object({
	id: z.number().int(),
	for_date: z.string().optional(),
});
export const EmployeesListHolidayYearsResponseSchema = listOut(
	z.object({}).loose(),
);

export const EmployeeJobsListInputSchema = PageQuery.extend({
	employee_id: z.number().int().optional(),
});
export const EmployeeJobsListResponseSchema = listOut(z.object({}).loose());

export const EmployeesListLeaveRequestsInputSchema = z.object({
	id: z.number().int(),
	exclude_cancelled_requests: z.boolean().optional(),
});
export const EmployeesListLeaveRequestsResponseSchema =
	LeaveRequestsGetResponseSchema;

export const EmployeesListSalariesInputSchema = IdInput.merge(PageQuery);
export const EmployeesListSalariesResponseSchema = listOut(
	z.object({}).loose(),
);

export const EmployeeTrainingCoursesListInputSchema = PageQuery.extend({
	employee_id: z.number().int().optional(),
});
export const EmployeeTrainingCoursesListResponseSchema = listOut(
	z.object({}).loose(),
);

export const HolidayAllowancesListInputSchema = z.object({});
export const HolidayAllowancesListResponseSchema = listOut(
	z.object({}).loose(),
);

export const LeaveRequestsListInputSchema = PageQuery.extend({
	end_date: z.string().optional(),
	start_date: z.string().optional(),
	rotacloud: z.boolean().optional(),
	employee_id: z.number().int().optional(),
	department_id: z.number().int().optional(),
	exclude_cancelled_requests: z.boolean().optional(),
});
export const LeaveRequestsListResponseSchema = LeaveRequestsGetResponseSchema;

export const LocationsListInputSchema = PageQuery;
export const LocationsListResponseSchema = listOut(z.object({}).loose());

export const OtherLeaveReasonsListInputSchema = z.object({});
export const OtherLeaveReasonsListResponseSchema = listOut(
	z.object({}).loose(),
);

export const SalariesListInputSchema = PageQuery;
export const SalariesListResponseSchema = listOut(z.object({}).loose());

export const SicknessesListInputSchema = PageQuery.extend({
	end_date: z.string().optional(),
	start_date: z.string().optional(),
	rotacloud: z.boolean().optional(),
	employee_id: z.number().int().optional(),
	department_id: z.number().int().optional(),
});
export const SicknessesListResponseSchema =
	EmployeesCreateSicknessResponseSchema;

export const WorkingPatternsListInputSchema = PageQuery;
export const WorkingPatternsListResponseSchema = listOut(z.object({}).loose());

export const EmployeeExpenseClaimsUpdateInputSchema = z.object({
	id: z.number().int(),
	approve: z.boolean(),
	approver_rejector_id: z.number().int(),
	rejection_reason: z.string().optional(),
});
export const EmployeeExpenseClaimsUpdateResponseSchema = Root;

export const EmployeeTrainingCoursesUpdateInputSchema = IdInput.extend({
	cost: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	end_on: z.string().optional(),
	status: z.string().optional(),
	outcome: z.string().optional(),
	half_day: z.boolean().optional(),
	start_on: z.string().optional(),
	followup_date: z.string().optional(),
	half_day_am_pm: z.enum(['am', 'pm']).optional(),
	company_training_type_id: z.number().int().optional(),
	remuneration_currency_id: z.number().int().optional(),
	company_training_category_id: z.number().int().optional(),
	company_training_provider_id: z.number().int().optional(),
});
export const EmployeeTrainingCoursesUpdateResponseSchema = Root;

export const SicknessesUpdateInputSchema = z.object({
	id: z.number().int(),
	reason: z.string().optional(),
	status: z.string().optional(),
	end_date: z.string().optional(),
	half_day: z.boolean().optional(),
	half_end: z.boolean().optional(),
	half_start: z.boolean().optional(),
	start_date: z.string().optional(),
	review_notes: z.string().optional(),
	half_end_am_pm: z.enum(['am', 'pm']).optional(),
	half_start_am_pm: z.enum(['am', 'pm']).optional(),
	company_sicknesstype_id: z.number().int().optional(),
});
export const SicknessesUpdateResponseSchema =
	EmployeesCreateSicknessResponseSchema;

export const BreatheHrEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	employeesList: EmployeesListInputSchema,
	employeesGet: EmployeesGetInputSchema,
	employeesCreate: EmployeesCreateInputSchema,
	employeesCreateChangeRequest: EmployeesCreateChangeRequestInputSchema,
	employeesCreateExpense: EmployeesCreateExpenseInputSchema,
	employeesCreateExpenseClaim: EmployeesCreateExpenseClaimInputSchema,
	employeesCreateSickness: EmployeesCreateSicknessInputSchema,
	employeeExpensesDelete: EmployeeExpensesDeleteInputSchema,
	employeeTrainingCoursesDelete: EmployeeTrainingCoursesDeleteInputSchema,
	employeeExpensesGet: EmployeeExpensesGetInputSchema,
	leaveRequestsGet: LeaveRequestsGetInputSchema,
	leaveRequestsGetCancelling: LeaveRequestsGetCancellingInputSchema,
	leaveRequestsApprove: LeaveRequestsApproveInputSchema,
	leaveRequestsReject: LeaveRequestsRejectInputSchema,
	absencesList: AbsencesListInputSchema,
	benefitsList: BenefitsListInputSchema,
	bonusesList: BonusesListInputSchema,
	changeRequestsList: ChangeRequestsListInputSchema,
	companyDocumentsList: CompanyDocumentsListInputSchema,
	companyProjectsList: CompanyProjectsListInputSchema,
	companyTrainingTypesList: CompanyTrainingTypesListInputSchema,
	departmentsList: DepartmentsListInputSchema,
	departmentsListAbsences: DepartmentsListAbsencesInputSchema,
	departmentsListBenefits: DepartmentsListBenefitsInputSchema,
	departmentsListBonuses: DepartmentsListBonusesInputSchema,
	departmentsListLeaveRequests: DepartmentsListLeaveRequestsInputSchema,
	departmentsListSalaries: DepartmentsListSalariesInputSchema,
	divisionsList: DivisionsListInputSchema,
	employeesListAbsences: EmployeesListAbsencesInputSchema,
	employeesListBenefits: EmployeesListBenefitsInputSchema,
	employeesListBonuses: EmployeesListBonusesInputSchema,
	employeesListChangeRequests: EmployeesListChangeRequestsInputSchema,
	employeeExpenseClaimsList: EmployeeExpenseClaimsListInputSchema,
	employeeExpensesList: EmployeeExpensesListInputSchema,
	employeesListHolidayYears: EmployeesListHolidayYearsInputSchema,
	employeeJobsList: EmployeeJobsListInputSchema,
	employeesListLeaveRequests: EmployeesListLeaveRequestsInputSchema,
	employeesListSalaries: EmployeesListSalariesInputSchema,
	employeeTrainingCoursesList: EmployeeTrainingCoursesListInputSchema,
	holidayAllowancesList: HolidayAllowancesListInputSchema,
	leaveRequestsList: LeaveRequestsListInputSchema,
	locationsList: LocationsListInputSchema,
	otherLeaveReasonsList: OtherLeaveReasonsListInputSchema,
	salariesList: SalariesListInputSchema,
	sicknessesList: SicknessesListInputSchema,
	workingPatternsList: WorkingPatternsListInputSchema,
	employeeExpenseClaimsUpdate: EmployeeExpenseClaimsUpdateInputSchema,
	employeeTrainingCoursesUpdate: EmployeeTrainingCoursesUpdateInputSchema,
	sicknessesUpdate: SicknessesUpdateInputSchema,
} as const;

export const BreatheHrEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	employeesList: EmployeesListResponseSchema,
	employeesGet: EmployeesGetResponseSchema,
	employeesCreate: EmployeesCreateResponseSchema,
	employeesCreateChangeRequest: EmployeesCreateChangeRequestResponseSchema,
	employeesCreateExpense: EmployeesCreateExpenseResponseSchema,
	employeesCreateExpenseClaim: EmployeesCreateExpenseClaimResponseSchema,
	employeesCreateSickness: EmployeesCreateSicknessResponseSchema,
	employeeExpensesDelete: EmployeeExpensesDeleteResponseSchema,
	employeeTrainingCoursesDelete: EmployeeTrainingCoursesDeleteResponseSchema,
	employeeExpensesGet: EmployeeExpensesGetResponseSchema,
	leaveRequestsGet: LeaveRequestsGetResponseSchema,
	leaveRequestsGetCancelling: LeaveRequestsGetCancellingResponseSchema,
	leaveRequestsApprove: LeaveRequestsApproveResponseSchema,
	leaveRequestsReject: LeaveRequestsRejectResponseSchema,
	absencesList: AbsencesListResponseSchema,
	benefitsList: BenefitsListResponseSchema,
	bonusesList: BonusesListResponseSchema,
	changeRequestsList: ChangeRequestsListResponseSchema,
	companyDocumentsList: CompanyDocumentsListResponseSchema,
	companyProjectsList: CompanyProjectsListResponseSchema,
	companyTrainingTypesList: CompanyTrainingTypesListResponseSchema,
	departmentsList: DepartmentsListResponseSchema,
	departmentsListAbsences: DepartmentsListAbsencesResponseSchema,
	departmentsListBenefits: DepartmentsListBenefitsResponseSchema,
	departmentsListBonuses: DepartmentsListBonusesResponseSchema,
	departmentsListLeaveRequests: DepartmentsListLeaveRequestsResponseSchema,
	departmentsListSalaries: DepartmentsListSalariesResponseSchema,
	divisionsList: DivisionsListResponseSchema,
	employeesListAbsences: EmployeesListAbsencesResponseSchema,
	employeesListBenefits: EmployeesListBenefitsResponseSchema,
	employeesListBonuses: EmployeesListBonusesResponseSchema,
	employeesListChangeRequests: EmployeesListChangeRequestsResponseSchema,
	employeeExpenseClaimsList: EmployeeExpenseClaimsListResponseSchema,
	employeeExpensesList: EmployeeExpensesListResponseSchema,
	employeesListHolidayYears: EmployeesListHolidayYearsResponseSchema,
	employeeJobsList: EmployeeJobsListResponseSchema,
	employeesListLeaveRequests: EmployeesListLeaveRequestsResponseSchema,
	employeesListSalaries: EmployeesListSalariesResponseSchema,
	employeeTrainingCoursesList: EmployeeTrainingCoursesListResponseSchema,
	holidayAllowancesList: HolidayAllowancesListResponseSchema,
	leaveRequestsList: LeaveRequestsListResponseSchema,
	locationsList: LocationsListResponseSchema,
	otherLeaveReasonsList: OtherLeaveReasonsListResponseSchema,
	salariesList: SalariesListResponseSchema,
	sicknessesList: SicknessesListResponseSchema,
	workingPatternsList: WorkingPatternsListResponseSchema,
	employeeExpenseClaimsUpdate: EmployeeExpenseClaimsUpdateResponseSchema,
	employeeTrainingCoursesUpdate: EmployeeTrainingCoursesUpdateResponseSchema,
	sicknessesUpdate: SicknessesUpdateResponseSchema,
} as const;

export type BreatheHrEndpointInputs = {
	[K in keyof typeof BreatheHrEndpointInputSchemas]: z.infer<
		(typeof BreatheHrEndpointInputSchemas)[K]
	>;
};

export type BreatheHrEndpointOutputs = {
	[K in keyof typeof BreatheHrEndpointOutputSchemas]: z.infer<
		(typeof BreatheHrEndpointOutputSchemas)[K]
	>;
};
