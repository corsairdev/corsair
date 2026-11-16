import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Employees, Organization, ReferenceData, TimeOff } from './endpoints';
import type {
	TalentHREndpointInputs,
	TalentHREndpointOutputs,
} from './endpoints/types';
import {
	TalentHREndpointInputSchemas,
	TalentHREndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TalentHRSchema } from './schema';

export type TalentHRPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTalentHRPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof talenthrEndpointsNested>;
};

export type TalentHRContext = CorsairPluginContext<
	typeof TalentHRSchema,
	TalentHRPluginOptions
>;

export type TalentHRKeyBuilderContext =
	KeyBuilderContext<TalentHRPluginOptions>;

export type TalentHRBoundEndpoints = BindEndpoints<
	typeof talenthrEndpointsNested
>;

type TalentHREndpoint<K extends keyof TalentHREndpointOutputs> =
	CorsairEndpoint<
		TalentHRContext,
		TalentHREndpointInputs[K],
		TalentHREndpointOutputs[K]
	>;

export type TalentHREndpoints = {
	employeesDirectory: TalentHREndpoint<'employeesDirectory'>;
	employeesGet: TalentHREndpoint<'employeesGet'>;
	employeesHire: TalentHREndpoint<'employeesHire'>;
	employeesUpdate: TalentHREndpoint<'employeesUpdate'>;
	employeesTerminate: TalentHREndpoint<'employeesTerminate'>;
	employeesRehire: TalentHREndpoint<'employeesRehire'>;
	employeesRemove: TalentHREndpoint<'employeesRemove'>;
	employeesEmploymentStatuses: TalentHREndpoint<'employeesEmploymentStatuses'>;
	timeOffList: TalentHREndpoint<'timeOffList'>;
	timeOffCreate: TalentHREndpoint<'timeOffCreate'>;
	timeOffRemove: TalentHREndpoint<'timeOffRemove'>;
	timeOffReply: TalentHREndpoint<'timeOffReply'>;
	timeOffTypes: TalentHREndpoint<'timeOffTypes'>;
	timeOffBudgets: TalentHREndpoint<'timeOffBudgets'>;
	divisionsList: TalentHREndpoint<'divisionsList'>;
	divisionsGet: TalentHREndpoint<'divisionsGet'>;
	divisionsCreate: TalentHREndpoint<'divisionsCreate'>;
	divisionsUpdate: TalentHREndpoint<'divisionsUpdate'>;
	divisionsRemove: TalentHREndpoint<'divisionsRemove'>;
	departmentsList: TalentHREndpoint<'departmentsList'>;
	departmentsCreate: TalentHREndpoint<'departmentsCreate'>;
	departmentsRemove: TalentHREndpoint<'departmentsRemove'>;
	locationsList: TalentHREndpoint<'locationsList'>;
	jobTitlesList: TalentHREndpoint<'jobTitlesList'>;
	referenceDataEmploymentStatuses: TalentHREndpoint<'referenceDataEmploymentStatuses'>;
};

const talenthrEndpointsNested = {
	employees: {
		directory: Employees.directory,
		get: Employees.get,
		hire: Employees.hire,
		update: Employees.update,
		terminate: Employees.terminate,
		rehire: Employees.rehire,
		delete: Employees.remove,
		employmentStatuses: Employees.employmentStatuses,
	},
	timeOff: {
		list: TimeOff.list,
		create: TimeOff.create,
		delete: TimeOff.remove,
		reply: TimeOff.reply,
		types: TimeOff.types,
		budgets: TimeOff.budgets,
	},
	divisions: {
		list: Organization.divisionsList,
		get: Organization.divisionsGet,
		create: Organization.divisionsCreate,
		update: Organization.divisionsUpdate,
		delete: Organization.divisionsRemove,
	},
	departments: {
		list: Organization.departmentsList,
		create: Organization.departmentsCreate,
		delete: Organization.departmentsRemove,
	},
	locations: {
		list: Organization.locationsList,
	},
	jobTitles: {
		list: Organization.jobTitlesList,
	},
	referenceData: {
		employmentStatuses: ReferenceData.employmentStatuses,
	},
} as const;

export const talenthrEndpointSchemas = {
	'employees.directory': {
		input: TalentHREndpointInputSchemas.employeesDirectory,
		output: TalentHREndpointOutputSchemas.employeesDirectory,
	},
	'employees.get': {
		input: TalentHREndpointInputSchemas.employeesGet,
		output: TalentHREndpointOutputSchemas.employeesGet,
	},
	'employees.hire': {
		input: TalentHREndpointInputSchemas.employeesHire,
		output: TalentHREndpointOutputSchemas.employeesHire,
	},
	'employees.update': {
		input: TalentHREndpointInputSchemas.employeesUpdate,
		output: TalentHREndpointOutputSchemas.employeesUpdate,
	},
	'employees.terminate': {
		input: TalentHREndpointInputSchemas.employeesTerminate,
		output: TalentHREndpointOutputSchemas.employeesTerminate,
	},
	'employees.rehire': {
		input: TalentHREndpointInputSchemas.employeesRehire,
		output: TalentHREndpointOutputSchemas.employeesRehire,
	},
	'employees.delete': {
		input: TalentHREndpointInputSchemas.employeesRemove,
		output: TalentHREndpointOutputSchemas.employeesRemove,
	},
	'employees.employmentStatuses': {
		input: TalentHREndpointInputSchemas.employeesEmploymentStatuses,
		output: TalentHREndpointOutputSchemas.employeesEmploymentStatuses,
	},
	'timeOff.list': {
		input: TalentHREndpointInputSchemas.timeOffList,
		output: TalentHREndpointOutputSchemas.timeOffList,
	},
	'timeOff.create': {
		input: TalentHREndpointInputSchemas.timeOffCreate,
		output: TalentHREndpointOutputSchemas.timeOffCreate,
	},
	'timeOff.delete': {
		input: TalentHREndpointInputSchemas.timeOffRemove,
		output: TalentHREndpointOutputSchemas.timeOffRemove,
	},
	'timeOff.reply': {
		input: TalentHREndpointInputSchemas.timeOffReply,
		output: TalentHREndpointOutputSchemas.timeOffReply,
	},
	'timeOff.types': {
		input: TalentHREndpointInputSchemas.timeOffTypes,
		output: TalentHREndpointOutputSchemas.timeOffTypes,
	},
	'timeOff.budgets': {
		input: TalentHREndpointInputSchemas.timeOffBudgets,
		output: TalentHREndpointOutputSchemas.timeOffBudgets,
	},
	'divisions.list': {
		input: TalentHREndpointInputSchemas.divisionsList,
		output: TalentHREndpointOutputSchemas.divisionsList,
	},
	'divisions.get': {
		input: TalentHREndpointInputSchemas.divisionsGet,
		output: TalentHREndpointOutputSchemas.divisionsGet,
	},
	'divisions.create': {
		input: TalentHREndpointInputSchemas.divisionsCreate,
		output: TalentHREndpointOutputSchemas.divisionsCreate,
	},
	'divisions.update': {
		input: TalentHREndpointInputSchemas.divisionsUpdate,
		output: TalentHREndpointOutputSchemas.divisionsUpdate,
	},
	'divisions.delete': {
		input: TalentHREndpointInputSchemas.divisionsRemove,
		output: TalentHREndpointOutputSchemas.divisionsRemove,
	},
	'departments.list': {
		input: TalentHREndpointInputSchemas.departmentsList,
		output: TalentHREndpointOutputSchemas.departmentsList,
	},
	'departments.create': {
		input: TalentHREndpointInputSchemas.departmentsCreate,
		output: TalentHREndpointOutputSchemas.departmentsCreate,
	},
	'departments.delete': {
		input: TalentHREndpointInputSchemas.departmentsRemove,
		output: TalentHREndpointOutputSchemas.departmentsRemove,
	},
	'locations.list': {
		input: TalentHREndpointInputSchemas.locationsList,
		output: TalentHREndpointOutputSchemas.locationsList,
	},
	'jobTitles.list': {
		input: TalentHREndpointInputSchemas.jobTitlesList,
		output: TalentHREndpointOutputSchemas.jobTitlesList,
	},
	'referenceData.employmentStatuses': {
		input: TalentHREndpointInputSchemas.referenceDataEmploymentStatuses,
		output: TalentHREndpointOutputSchemas.referenceDataEmploymentStatuses,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof talenthrEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const talenthrEndpointMeta = {
	'employees.directory': {
		riskLevel: 'read',
		description:
			'List employees with their job, contact and org details, filtered and paged; the response carries the total match count',
	},
	'employees.get': {
		riskLevel: 'read',
		description:
			'Read one employee, including their user role, seniority, custom fields and manager',
	},
	'employees.hire': {
		riskLevel: 'destructive',
		description:
			'Create an employee with a hire date, employment status and optional job, pay and emergency contact records; TalentHR emails the new employee unless prevent_email is set',
	},
	'employees.update': {
		riskLevel: 'write',
		description:
			'Change an employee’s name, contact, address, SSN, birth date, manager or emergency contact',
	},
	'employees.terminate': {
		riskLevel: 'destructive',
		description:
			'Terminate an employee from a given date, recording the reason and whether the departure was regrettable; TalentHR emails the people given offboarding tasks',
	},
	'employees.rehire': {
		riskLevel: 'destructive',
		description:
			'Return a terminated employee to active status from a new hire date, with a manager and employment status; TalentHR sends a rehire email unless prevent_email is set',
	},
	'employees.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an employee; use terminate when the employment history must be kept',
	},
	'employees.employmentStatuses': {
		riskLevel: 'read',
		description:
			'List an employee’s employment status records, each with its effective date and status name',
	},
	'timeOff.list': {
		riskLevel: 'read',
		description:
			'List one employee’s time off requests with their type, dates, budget and approval state',
	},
	'timeOff.create': {
		riskLevel: 'destructive',
		description:
			'Book time off for an employee, either preapproved or sent to their manager for approval by email',
	},
	'timeOff.delete': {
		riskLevel: 'destructive',
		description:
			'Cancel a time off request, which frees its budget back to the employee',
	},
	'timeOff.reply': {
		riskLevel: 'destructive',
		description:
			'Approve or reject a time off request on behalf of the manager; TalentHR emails the employee the outcome',
	},
	'timeOff.types': {
		riskLevel: 'read',
		description:
			'List the time off types with their budgets, whether they are paid and whether they need approval',
	},
	'timeOff.budgets': {
		riskLevel: 'read',
		description:
			'Read one employee’s time off budgets per type, including used and carried-over amounts',
	},
	'divisions.list': {
		riskLevel: 'read',
		description: 'List the divisions of the company',
	},
	'divisions.get': {
		riskLevel: 'read',
		description: 'Read one division by ID',
	},
	'divisions.create': {
		riskLevel: 'write',
		description: 'Create a division with a name that is unique in the company',
	},
	'divisions.update': {
		riskLevel: 'write',
		description: 'Rename a division',
	},
	'divisions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a division; TalentHR refuses while an active job position uses it, and clears it from other records',
	},
	'departments.list': {
		riskLevel: 'read',
		description: 'List the departments of the company',
	},
	'departments.create': {
		riskLevel: 'write',
		description:
			'Create a department with a name that is unique in the company',
	},
	'departments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a department; TalentHR refuses while an active job position uses it',
	},
	'locations.list': {
		riskLevel: 'read',
		description:
			'List the work locations with their address and whether they are remote',
	},
	'jobTitles.list': {
		riskLevel: 'read',
		description: 'List the job titles of the company',
	},
	'referenceData.employmentStatuses': {
		riskLevel: 'read',
		description:
			'List the employment statuses, whose IDs employees.hire and employees.rehire take',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof talenthrEndpointsNested>;

export type BaseTalentHRPlugin<T extends TalentHRPluginOptions> = CorsairPlugin<
	'talenthr',
	typeof TalentHRSchema,
	typeof talenthrEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTalentHRPlugin = BaseTalentHRPlugin<TalentHRPluginOptions>;

export type ExternalTalentHRPlugin<T extends TalentHRPluginOptions> =
	BaseTalentHRPlugin<T>;

export function talenthr<const T extends TalentHRPluginOptions>(
	incomingOptions: TalentHRPluginOptions & T = {} as TalentHRPluginOptions & T,
): ExternalTalentHRPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'talenthr',
		schema: TalentHRSchema,
		options: options,
		hooks: options.hooks,
		endpoints: talenthrEndpointsNested,
		webhooks: {},
		endpointMeta: talenthrEndpointMeta,
		endpointSchemas: talenthrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TalentHRKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('talenthr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTalentHRPlugin;
}

export { TalentHRAPIError } from './client';

export type {
	DeletedResponse,
	DirectoryInput,
	DirectoryResponse,
	EmployeesEmploymentStatusesResponse,
	EmployeesGetInput,
	EmployeesGetResponse,
	EmployeesHireInput,
	EmployeesHireResponse,
	EmployeesRehireInput,
	EmployeesRehireResponse,
	EmployeesRemoveInput,
	EmployeesTerminateInput,
	EmployeesTerminateResponse,
	EmployeesUpdateInput,
	EmployeesUpdateResponse,
	ListInput,
	NamedObjectCreateInput,
	NamedObjectIdInput,
	NamedObjectListResponse,
	NamedObjectResponse,
	NamedObjectUpdateInput,
	TalentHREmployee,
	TalentHREndpointInputs,
	TalentHREndpointOutputs,
	TimeOffBudgetsResponse,
	TimeOffCreateInput,
	TimeOffCreateResponse,
	TimeOffListInput,
	TimeOffListResponse,
	TimeOffRemoveInput,
	TimeOffReplyInput,
	TimeOffTypesResponse,
} from './endpoints/types';
