import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	absencesList,
	accountGet,
	benefitsList,
	bonusesList,
	changeRequestsList,
	companyDocumentsList,
	companyProjectsList,
	companyTrainingTypesList,
	departmentsList,
	departmentsListAbsences,
	departmentsListBenefits,
	departmentsListBonuses,
	departmentsListLeaveRequests,
	departmentsListSalaries,
	divisionsList,
	employeeExpenseClaimsList,
	employeeExpenseClaimsUpdate,
	employeeExpensesDelete,
	employeeExpensesGet,
	employeeExpensesList,
	employeeJobsList,
	employeesCreate,
	employeesCreateChangeRequest,
	employeesCreateExpense,
	employeesCreateExpenseClaim,
	employeesCreateSickness,
	employeesGet,
	employeesList,
	employeesListAbsences,
	employeesListBenefits,
	employeesListBonuses,
	employeesListChangeRequests,
	employeesListHolidayYears,
	employeesListLeaveRequests,
	employeesListSalaries,
	employeeTrainingCoursesDelete,
	employeeTrainingCoursesList,
	employeeTrainingCoursesUpdate,
	holidayAllowancesList,
	leaveRequestsApprove,
	leaveRequestsGet,
	leaveRequestsGetCancelling,
	leaveRequestsList,
	leaveRequestsReject,
	locationsList,
	otherLeaveReasonsList,
	salariesList,
	sicknessesList,
	sicknessesUpdate,
	workingPatternsList,
} from './endpoints';
import type {
	BreatheHrEndpointInputs,
	BreatheHrEndpointOutputs,
} from './endpoints/types';
import {
	BreatheHrEndpointInputSchemas,
	BreatheHrEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BreatheHrSchema } from './schema';

export type BreatheHrPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBreatheHrPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof breathehrEndpointsNested>;
};

export type BreatheHrContext = CorsairPluginContext<
	typeof BreatheHrSchema,
	BreatheHrPluginOptions
>;

export type BreatheHrKeyBuilderContext =
	KeyBuilderContext<BreatheHrPluginOptions>;

export type BreatheHrBoundEndpoints = BindEndpoints<
	typeof breathehrEndpointsNested
>;

type BreatheHrEndpoint<K extends keyof BreatheHrEndpointOutputs> =
	CorsairEndpoint<
		BreatheHrContext,
		BreatheHrEndpointInputs[K],
		BreatheHrEndpointOutputs[K]
	>;

export type BreatheHrEndpoints = {
	[K in keyof BreatheHrEndpointOutputs]: BreatheHrEndpoint<K>;
};

const breathehrEndpointsNested = {
	account: { get: accountGet },
	employees: {
		list: employeesList,
		get: employeesGet,
		create: employeesCreate,
		createChangeRequest: employeesCreateChangeRequest,
		createExpense: employeesCreateExpense,
		createExpenseClaim: employeesCreateExpenseClaim,
		createSickness: employeesCreateSickness,
		listAbsences: employeesListAbsences,
		listBenefits: employeesListBenefits,
		listBonuses: employeesListBonuses,
		listChangeRequests: employeesListChangeRequests,
		listHolidayYears: employeesListHolidayYears,
		listLeaveRequests: employeesListLeaveRequests,
		listSalaries: employeesListSalaries,
	},
	employeeExpenses: {
		list: employeeExpensesList,
		get: employeeExpensesGet,
		delete: employeeExpensesDelete,
	},
	employeeExpenseClaims: {
		list: employeeExpenseClaimsList,
		update: employeeExpenseClaimsUpdate,
	},
	employeeTrainingCourses: {
		list: employeeTrainingCoursesList,
		delete: employeeTrainingCoursesDelete,
		update: employeeTrainingCoursesUpdate,
	},
	employeeJobs: { list: employeeJobsList },
	leaveRequests: {
		list: leaveRequestsList,
		get: leaveRequestsGet,
		getCancelling: leaveRequestsGetCancelling,
		approve: leaveRequestsApprove,
		reject: leaveRequestsReject,
	},
	absences: { list: absencesList },
	benefits: { list: benefitsList },
	bonuses: { list: bonusesList },
	changeRequests: { list: changeRequestsList },
	companyDocuments: { list: companyDocumentsList },
	companyProjects: { list: companyProjectsList },
	companyTrainingTypes: { list: companyTrainingTypesList },
	departments: {
		list: departmentsList,
		listAbsences: departmentsListAbsences,
		listBenefits: departmentsListBenefits,
		listBonuses: departmentsListBonuses,
		listLeaveRequests: departmentsListLeaveRequests,
		listSalaries: departmentsListSalaries,
	},
	divisions: { list: divisionsList },
	holidayAllowances: { list: holidayAllowancesList },
	locations: { list: locationsList },
	otherLeaveReasons: { list: otherLeaveReasonsList },
	salaries: { list: salariesList },
	sicknesses: { list: sicknessesList, update: sicknessesUpdate },
	workingPatterns: { list: workingPatternsList },
} as const;

const breathehrWebhooksNested = {} as const;

export const breathehrEndpointSchemas = {
	'account.get': {
		input: BreatheHrEndpointInputSchemas.accountGet,
		output: BreatheHrEndpointOutputSchemas.accountGet,
	},
	'employees.list': {
		input: BreatheHrEndpointInputSchemas.employeesList,
		output: BreatheHrEndpointOutputSchemas.employeesList,
	},
	'employees.get': {
		input: BreatheHrEndpointInputSchemas.employeesGet,
		output: BreatheHrEndpointOutputSchemas.employeesGet,
	},
	'employees.create': {
		input: BreatheHrEndpointInputSchemas.employeesCreate,
		output: BreatheHrEndpointOutputSchemas.employeesCreate,
	},
	'employees.createChangeRequest': {
		input: BreatheHrEndpointInputSchemas.employeesCreateChangeRequest,
		output: BreatheHrEndpointOutputSchemas.employeesCreateChangeRequest,
	},
	'employees.createExpense': {
		input: BreatheHrEndpointInputSchemas.employeesCreateExpense,
		output: BreatheHrEndpointOutputSchemas.employeesCreateExpense,
	},
	'employees.createExpenseClaim': {
		input: BreatheHrEndpointInputSchemas.employeesCreateExpenseClaim,
		output: BreatheHrEndpointOutputSchemas.employeesCreateExpenseClaim,
	},
	'employees.createSickness': {
		input: BreatheHrEndpointInputSchemas.employeesCreateSickness,
		output: BreatheHrEndpointOutputSchemas.employeesCreateSickness,
	},
	'employees.listAbsences': {
		input: BreatheHrEndpointInputSchemas.employeesListAbsences,
		output: BreatheHrEndpointOutputSchemas.employeesListAbsences,
	},
	'employees.listBenefits': {
		input: BreatheHrEndpointInputSchemas.employeesListBenefits,
		output: BreatheHrEndpointOutputSchemas.employeesListBenefits,
	},
	'employees.listBonuses': {
		input: BreatheHrEndpointInputSchemas.employeesListBonuses,
		output: BreatheHrEndpointOutputSchemas.employeesListBonuses,
	},
	'employees.listChangeRequests': {
		input: BreatheHrEndpointInputSchemas.employeesListChangeRequests,
		output: BreatheHrEndpointOutputSchemas.employeesListChangeRequests,
	},
	'employees.listHolidayYears': {
		input: BreatheHrEndpointInputSchemas.employeesListHolidayYears,
		output: BreatheHrEndpointOutputSchemas.employeesListHolidayYears,
	},
	'employees.listLeaveRequests': {
		input: BreatheHrEndpointInputSchemas.employeesListLeaveRequests,
		output: BreatheHrEndpointOutputSchemas.employeesListLeaveRequests,
	},
	'employees.listSalaries': {
		input: BreatheHrEndpointInputSchemas.employeesListSalaries,
		output: BreatheHrEndpointOutputSchemas.employeesListSalaries,
	},
	'employeeExpenses.list': {
		input: BreatheHrEndpointInputSchemas.employeeExpensesList,
		output: BreatheHrEndpointOutputSchemas.employeeExpensesList,
	},
	'employeeExpenses.get': {
		input: BreatheHrEndpointInputSchemas.employeeExpensesGet,
		output: BreatheHrEndpointOutputSchemas.employeeExpensesGet,
	},
	'employeeExpenses.delete': {
		input: BreatheHrEndpointInputSchemas.employeeExpensesDelete,
		output: BreatheHrEndpointOutputSchemas.employeeExpensesDelete,
	},
	'employeeExpenseClaims.list': {
		input: BreatheHrEndpointInputSchemas.employeeExpenseClaimsList,
		output: BreatheHrEndpointOutputSchemas.employeeExpenseClaimsList,
	},
	'employeeExpenseClaims.update': {
		input: BreatheHrEndpointInputSchemas.employeeExpenseClaimsUpdate,
		output: BreatheHrEndpointOutputSchemas.employeeExpenseClaimsUpdate,
	},
	'employeeTrainingCourses.list': {
		input: BreatheHrEndpointInputSchemas.employeeTrainingCoursesList,
		output: BreatheHrEndpointOutputSchemas.employeeTrainingCoursesList,
	},
	'employeeTrainingCourses.delete': {
		input: BreatheHrEndpointInputSchemas.employeeTrainingCoursesDelete,
		output: BreatheHrEndpointOutputSchemas.employeeTrainingCoursesDelete,
	},
	'employeeTrainingCourses.update': {
		input: BreatheHrEndpointInputSchemas.employeeTrainingCoursesUpdate,
		output: BreatheHrEndpointOutputSchemas.employeeTrainingCoursesUpdate,
	},
	'employeeJobs.list': {
		input: BreatheHrEndpointInputSchemas.employeeJobsList,
		output: BreatheHrEndpointOutputSchemas.employeeJobsList,
	},
	'leaveRequests.list': {
		input: BreatheHrEndpointInputSchemas.leaveRequestsList,
		output: BreatheHrEndpointOutputSchemas.leaveRequestsList,
	},
	'leaveRequests.get': {
		input: BreatheHrEndpointInputSchemas.leaveRequestsGet,
		output: BreatheHrEndpointOutputSchemas.leaveRequestsGet,
	},
	'leaveRequests.getCancelling': {
		input: BreatheHrEndpointInputSchemas.leaveRequestsGetCancelling,
		output: BreatheHrEndpointOutputSchemas.leaveRequestsGetCancelling,
	},
	'leaveRequests.approve': {
		input: BreatheHrEndpointInputSchemas.leaveRequestsApprove,
		output: BreatheHrEndpointOutputSchemas.leaveRequestsApprove,
	},
	'leaveRequests.reject': {
		input: BreatheHrEndpointInputSchemas.leaveRequestsReject,
		output: BreatheHrEndpointOutputSchemas.leaveRequestsReject,
	},
	'absences.list': {
		input: BreatheHrEndpointInputSchemas.absencesList,
		output: BreatheHrEndpointOutputSchemas.absencesList,
	},
	'benefits.list': {
		input: BreatheHrEndpointInputSchemas.benefitsList,
		output: BreatheHrEndpointOutputSchemas.benefitsList,
	},
	'bonuses.list': {
		input: BreatheHrEndpointInputSchemas.bonusesList,
		output: BreatheHrEndpointOutputSchemas.bonusesList,
	},
	'changeRequests.list': {
		input: BreatheHrEndpointInputSchemas.changeRequestsList,
		output: BreatheHrEndpointOutputSchemas.changeRequestsList,
	},
	'companyDocuments.list': {
		input: BreatheHrEndpointInputSchemas.companyDocumentsList,
		output: BreatheHrEndpointOutputSchemas.companyDocumentsList,
	},
	'companyProjects.list': {
		input: BreatheHrEndpointInputSchemas.companyProjectsList,
		output: BreatheHrEndpointOutputSchemas.companyProjectsList,
	},
	'companyTrainingTypes.list': {
		input: BreatheHrEndpointInputSchemas.companyTrainingTypesList,
		output: BreatheHrEndpointOutputSchemas.companyTrainingTypesList,
	},
	'departments.list': {
		input: BreatheHrEndpointInputSchemas.departmentsList,
		output: BreatheHrEndpointOutputSchemas.departmentsList,
	},
	'departments.listAbsences': {
		input: BreatheHrEndpointInputSchemas.departmentsListAbsences,
		output: BreatheHrEndpointOutputSchemas.departmentsListAbsences,
	},
	'departments.listBenefits': {
		input: BreatheHrEndpointInputSchemas.departmentsListBenefits,
		output: BreatheHrEndpointOutputSchemas.departmentsListBenefits,
	},
	'departments.listBonuses': {
		input: BreatheHrEndpointInputSchemas.departmentsListBonuses,
		output: BreatheHrEndpointOutputSchemas.departmentsListBonuses,
	},
	'departments.listLeaveRequests': {
		input: BreatheHrEndpointInputSchemas.departmentsListLeaveRequests,
		output: BreatheHrEndpointOutputSchemas.departmentsListLeaveRequests,
	},
	'departments.listSalaries': {
		input: BreatheHrEndpointInputSchemas.departmentsListSalaries,
		output: BreatheHrEndpointOutputSchemas.departmentsListSalaries,
	},
	'divisions.list': {
		input: BreatheHrEndpointInputSchemas.divisionsList,
		output: BreatheHrEndpointOutputSchemas.divisionsList,
	},
	'holidayAllowances.list': {
		input: BreatheHrEndpointInputSchemas.holidayAllowancesList,
		output: BreatheHrEndpointOutputSchemas.holidayAllowancesList,
	},
	'locations.list': {
		input: BreatheHrEndpointInputSchemas.locationsList,
		output: BreatheHrEndpointOutputSchemas.locationsList,
	},
	'otherLeaveReasons.list': {
		input: BreatheHrEndpointInputSchemas.otherLeaveReasonsList,
		output: BreatheHrEndpointOutputSchemas.otherLeaveReasonsList,
	},
	'salaries.list': {
		input: BreatheHrEndpointInputSchemas.salariesList,
		output: BreatheHrEndpointOutputSchemas.salariesList,
	},
	'sicknesses.list': {
		input: BreatheHrEndpointInputSchemas.sicknessesList,
		output: BreatheHrEndpointOutputSchemas.sicknessesList,
	},
	'sicknesses.update': {
		input: BreatheHrEndpointInputSchemas.sicknessesUpdate,
		output: BreatheHrEndpointOutputSchemas.sicknessesUpdate,
	},
	'workingPatterns.list': {
		input: BreatheHrEndpointInputSchemas.workingPatternsList,
		output: BreatheHrEndpointOutputSchemas.workingPatternsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof breathehrEndpointsNested
>;

const breathehrEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Retrieve Breathe HR account details',
	},
	'employees.list': {
		riskLevel: 'read',
		description: 'List employees with pagination',
	},
	'employees.get': { riskLevel: 'read', description: 'Get an employee by ID' },
	'employees.create': { riskLevel: 'write', description: 'Create an employee' },
	'employees.createChangeRequest': {
		riskLevel: 'write',
		description: 'Create an employee change request',
	},
	'employees.createExpense': {
		riskLevel: 'write',
		description: 'Create an employee expense',
	},
	'employees.createExpenseClaim': {
		riskLevel: 'write',
		description: 'Create an employee expense claim',
	},
	'employees.createSickness': {
		riskLevel: 'write',
		description: 'Create an employee sickness record',
	},
	'employees.listAbsences': {
		riskLevel: 'read',
		description: 'List absences for an employee',
	},
	'employees.listBenefits': {
		riskLevel: 'read',
		description: 'List benefits for an employee',
	},
	'employees.listBonuses': {
		riskLevel: 'read',
		description: 'List bonuses for an employee',
	},
	'employees.listChangeRequests': {
		riskLevel: 'read',
		description: 'List change requests for an employee',
	},
	'employees.listHolidayYears': {
		riskLevel: 'read',
		description: 'List holiday years for an employee',
	},
	'employees.listLeaveRequests': {
		riskLevel: 'read',
		description: 'List leave requests for an employee',
	},
	'employees.listSalaries': {
		riskLevel: 'read',
		description: 'List salaries for an employee',
	},
	'employeeExpenses.list': {
		riskLevel: 'read',
		description: 'List employee expenses',
	},
	'employeeExpenses.get': {
		riskLevel: 'read',
		description: 'Get an employee expense by ID',
	},
	'employeeExpenses.delete': {
		riskLevel: 'destructive',
		description: 'Delete an employee expense',
	},
	'employeeExpenseClaims.list': {
		riskLevel: 'read',
		description: 'List employee expense claims',
	},
	'employeeExpenseClaims.update': {
		riskLevel: 'write',
		description: 'Approve or reject an expense claim',
	},
	'employeeTrainingCourses.list': {
		riskLevel: 'read',
		description: 'List employee training courses',
	},
	'employeeTrainingCourses.delete': {
		riskLevel: 'destructive',
		description: 'Delete an employee training course',
	},
	'employeeTrainingCourses.update': {
		riskLevel: 'write',
		description: 'Update an employee training course',
	},
	'employeeJobs.list': { riskLevel: 'read', description: 'List employee jobs' },
	'leaveRequests.list': {
		riskLevel: 'read',
		description: 'List leave requests',
	},
	'leaveRequests.get': {
		riskLevel: 'read',
		description: 'Get a leave request by ID',
	},
	'leaveRequests.getCancelling': {
		riskLevel: 'read',
		description: 'Get the leave request being cancelled',
	},
	'leaveRequests.approve': {
		riskLevel: 'write',
		description: 'Approve a leave request',
	},
	'leaveRequests.reject': {
		riskLevel: 'write',
		description: 'Reject a leave request',
	},
	'absences.list': { riskLevel: 'read', description: 'List absences' },
	'benefits.list': { riskLevel: 'read', description: 'List employee benefits' },
	'bonuses.list': { riskLevel: 'read', description: 'List employee bonuses' },
	'changeRequests.list': {
		riskLevel: 'read',
		description: 'List change requests',
	},
	'companyDocuments.list': {
		riskLevel: 'read',
		description: 'List company documents',
	},
	'companyProjects.list': {
		riskLevel: 'read',
		description: 'List company projects',
	},
	'companyTrainingTypes.list': {
		riskLevel: 'read',
		description: 'List company training types',
	},
	'departments.list': { riskLevel: 'read', description: 'List departments' },
	'departments.listAbsences': {
		riskLevel: 'read',
		description: 'List absences for a department',
	},
	'departments.listBenefits': {
		riskLevel: 'read',
		description: 'List benefits for a department',
	},
	'departments.listBonuses': {
		riskLevel: 'read',
		description: 'List bonuses for a department',
	},
	'departments.listLeaveRequests': {
		riskLevel: 'read',
		description: 'List leave requests for a department',
	},
	'departments.listSalaries': {
		riskLevel: 'read',
		description: 'List salaries for a department',
	},
	'divisions.list': { riskLevel: 'read', description: 'List divisions' },
	'holidayAllowances.list': {
		riskLevel: 'read',
		description: 'List holiday allowances',
	},
	'locations.list': { riskLevel: 'read', description: 'List locations' },
	'otherLeaveReasons.list': {
		riskLevel: 'read',
		description: 'List other leave reasons',
	},
	'salaries.list': { riskLevel: 'read', description: 'List salaries' },
	'sicknesses.list': {
		riskLevel: 'read',
		description: 'List sickness records',
	},
	'sicknesses.update': {
		riskLevel: 'write',
		description: 'Update a sickness record',
	},
	'workingPatterns.list': {
		riskLevel: 'read',
		description: 'List working patterns',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof breathehrEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const breathehrAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBreatheHrPlugin<T extends BreatheHrPluginOptions> =
	CorsairPlugin<
		'breathehr',
		typeof BreatheHrSchema,
		typeof breathehrEndpointsNested,
		typeof breathehrWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBreatheHrPlugin =
	BaseBreatheHrPlugin<BreatheHrPluginOptions>;
export type ExternalBreatheHrPlugin<T extends BreatheHrPluginOptions> =
	BaseBreatheHrPlugin<T>;

export function breathehr<const T extends BreatheHrPluginOptions>(
	incomingOptions: BreatheHrPluginOptions & T = {} as BreatheHrPluginOptions &
		T,
): ExternalBreatheHrPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'breathehr',
		authConfig: breathehrAuthConfig,
		schema: BreatheHrSchema,
		options,
		hooks: options.hooks,
		endpoints: breathehrEndpointsNested,
		webhooks: breathehrWebhooksNested,
		endpointMeta: breathehrEndpointMeta,
		endpointSchemas: breathehrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BreatheHrKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('breathehr', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('breathehr', 'api_key');
		},
	} satisfies InternalBreatheHrPlugin;
}

export type {
	BreatheHrEndpointInputs,
	BreatheHrEndpointOutputs,
} from './endpoints/types';
export {
	BreatheHrEndpointInputSchemas,
	BreatheHrEndpointOutputSchemas,
} from './endpoints/types';
