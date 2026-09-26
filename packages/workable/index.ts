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
import * as Accounts from './endpoints/accounts';
import * as Candidates from './endpoints/candidates';
import * as Departments from './endpoints/departments';
import * as Employees from './endpoints/employees';
import * as Jobs from './endpoints/jobs';
import * as Members from './endpoints/members';
import * as PublicJobs from './endpoints/public-jobs';
import * as Reference from './endpoints/reference';
import * as Subscriptions from './endpoints/subscriptions';
import type {
	WorkableEndpointInputs,
	WorkableEndpointOutputs,
} from './endpoints/types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WorkableSchema } from './schema';

/**
 * Workable's public API is bearer-token only - there is no OAuth 2.0
 * authorize/token flow (tokens are generated manually under Settings >
 * Integrations, scoped to a subdomain). `api_key` is therefore the only
 * authType this plugin supports; see the integration issue (#1660) for the
 * corsair.dev/oss listing correction.
 */
export type WorkablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account subdomain - the first segment of
	 * `https://<subdomain>.workable.com`. Workable hosts every account on its
	 * own subdomain and it cannot be derived from the access token, so it is
	 * required alongside it, the same way ActiveCampaign's account slug is.
	 */
	account?: string;
	hooks?: InternalWorkablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof workableEndpointsNested>;
};

/**
 * Declaring `account: ['account']` generates `ctx.keys.get_account()`, which
 * is how the subdomain half of the credential reaches an endpoint when it is
 * not passed as a plugin option.
 */
export const workableAuthConfig = {
	api_key: {
		account: ['account'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WorkableContext = CorsairPluginContext<
	typeof WorkableSchema,
	WorkablePluginOptions,
	undefined,
	typeof workableAuthConfig
>;

export type WorkableKeyBuilderContext = KeyBuilderContext<
	WorkablePluginOptions,
	typeof workableAuthConfig
>;

export type WorkableBoundEndpoints = BindEndpoints<
	typeof workableEndpointsNested
>;

type WorkableEndpoint<K extends keyof WorkableEndpointOutputs> =
	CorsairEndpoint<
		WorkableContext,
		WorkableEndpointInputs[K],
		WorkableEndpointOutputs[K]
	>;

export type WorkableEndpoints = {
	accountsList: WorkableEndpoint<'accountsList'>;
	accountsGet: WorkableEndpoint<'accountsGet'>;
	departmentsList: WorkableEndpoint<'departmentsList'>;
	departmentsCreate: WorkableEndpoint<'departmentsCreate'>;
	departmentsUpdate: WorkableEndpoint<'departmentsUpdate'>;
	departmentsMerge: WorkableEndpoint<'departmentsMerge'>;
	departmentsDelete: WorkableEndpoint<'departmentsDelete'>;
	employeesList: WorkableEndpoint<'employeesList'>;
	employeesGet: WorkableEndpoint<'employeesGet'>;
	employeesCreate: WorkableEndpoint<'employeesCreate'>;
	employeesUpdate: WorkableEndpoint<'employeesUpdate'>;
	employeesUploadDocuments: WorkableEndpoint<'employeesUploadDocuments'>;
	employeeFieldsList: WorkableEndpoint<'employeeFieldsList'>;
	membersList: WorkableEndpoint<'membersList'>;
	membersInvite: WorkableEndpoint<'membersInvite'>;
	membersUpdate: WorkableEndpoint<'membersUpdate'>;
	membersEnable: WorkableEndpoint<'membersEnable'>;
	jobsList: WorkableEndpoint<'jobsList'>;
	candidatesList: WorkableEndpoint<'candidatesList'>;
	stagesList: WorkableEndpoint<'stagesList'>;
	requisitionsList: WorkableEndpoint<'requisitionsList'>;
	recruitersList: WorkableEndpoint<'recruitersList'>;
	legalEntitiesList: WorkableEndpoint<'legalEntitiesList'>;
	customAttributesList: WorkableEndpoint<'customAttributesList'>;
	disqualificationReasonsList: WorkableEndpoint<'disqualificationReasonsList'>;
	permissionSetsList: WorkableEndpoint<'permissionSetsList'>;
	timeoffCategoriesList: WorkableEndpoint<'timeoffCategoriesList'>;
	timeoffBalancesList: WorkableEndpoint<'timeoffBalancesList'>;
	workSchedulesList: WorkableEndpoint<'workSchedulesList'>;
	eventsList: WorkableEndpoint<'eventsList'>;
	subscriptionsList: WorkableEndpoint<'subscriptionsList'>;
	subscriptionsCreate: WorkableEndpoint<'subscriptionsCreate'>;
	subscriptionsDelete: WorkableEndpoint<'subscriptionsDelete'>;
	publicJobsList: WorkableEndpoint<'publicJobsList'>;
};

const workableEndpointsNested = {
	accounts: { list: Accounts.list, get: Accounts.get },
	departments: {
		list: Departments.list,
		create: Departments.create,
		update: Departments.update,
		merge: Departments.merge,
		delete: Departments.remove,
	},
	employees: {
		list: Employees.list,
		get: Employees.get,
		create: Employees.create,
		update: Employees.update,
		uploadDocuments: Employees.uploadDocuments,
	},
	employeeFields: { list: Reference.employeeFieldsList },
	members: {
		list: Members.list,
		invite: Members.invite,
		update: Members.update,
		enable: Members.enable,
	},
	jobs: { list: Jobs.list },
	candidates: { list: Candidates.list },
	stages: { list: Reference.stagesList },
	requisitions: { list: Reference.requisitionsList },
	recruiters: { list: Reference.recruitersList },
	legalEntities: { list: Reference.legalEntitiesList },
	customAttributes: { list: Reference.customAttributesList },
	disqualificationReasons: { list: Reference.disqualificationReasonsList },
	permissionSets: { list: Reference.permissionSetsList },
	timeoffCategories: { list: Reference.timeoffCategoriesList },
	timeoffBalances: { list: Reference.timeoffBalancesList },
	workSchedules: { list: Reference.workSchedulesList },
	events: { list: Reference.eventsList },
	subscriptions: {
		list: Subscriptions.list,
		create: Subscriptions.create,
		delete: Subscriptions.remove,
	},
	publicJobs: { list: PublicJobs.list },
} as const;

const workableEndpointSchemas = {
	'accounts.list': {
		input: WorkableEndpointInputSchemas.accountsList,
		output: WorkableEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: WorkableEndpointInputSchemas.accountsGet,
		output: WorkableEndpointOutputSchemas.accountsGet,
	},
	'departments.list': {
		input: WorkableEndpointInputSchemas.departmentsList,
		output: WorkableEndpointOutputSchemas.departmentsList,
	},
	'departments.create': {
		input: WorkableEndpointInputSchemas.departmentsCreate,
		output: WorkableEndpointOutputSchemas.departmentsCreate,
	},
	'departments.update': {
		input: WorkableEndpointInputSchemas.departmentsUpdate,
		output: WorkableEndpointOutputSchemas.departmentsUpdate,
	},
	'departments.merge': {
		input: WorkableEndpointInputSchemas.departmentsMerge,
		output: WorkableEndpointOutputSchemas.departmentsMerge,
	},
	'departments.delete': {
		input: WorkableEndpointInputSchemas.departmentsDelete,
		output: WorkableEndpointOutputSchemas.departmentsDelete,
	},
	'employees.list': {
		input: WorkableEndpointInputSchemas.employeesList,
		output: WorkableEndpointOutputSchemas.employeesList,
	},
	'employees.get': {
		input: WorkableEndpointInputSchemas.employeesGet,
		output: WorkableEndpointOutputSchemas.employeesGet,
	},
	'employees.create': {
		input: WorkableEndpointInputSchemas.employeesCreate,
		output: WorkableEndpointOutputSchemas.employeesCreate,
	},
	'employees.update': {
		input: WorkableEndpointInputSchemas.employeesUpdate,
		output: WorkableEndpointOutputSchemas.employeesUpdate,
	},
	'employees.uploadDocuments': {
		input: WorkableEndpointInputSchemas.employeesUploadDocuments,
		output: WorkableEndpointOutputSchemas.employeesUploadDocuments,
	},
	'employeeFields.list': {
		input: WorkableEndpointInputSchemas.employeeFieldsList,
		output: WorkableEndpointOutputSchemas.employeeFieldsList,
	},
	'members.list': {
		input: WorkableEndpointInputSchemas.membersList,
		output: WorkableEndpointOutputSchemas.membersList,
	},
	'members.invite': {
		input: WorkableEndpointInputSchemas.membersInvite,
		output: WorkableEndpointOutputSchemas.membersInvite,
	},
	'members.update': {
		input: WorkableEndpointInputSchemas.membersUpdate,
		output: WorkableEndpointOutputSchemas.membersUpdate,
	},
	'members.enable': {
		input: WorkableEndpointInputSchemas.membersEnable,
		output: WorkableEndpointOutputSchemas.membersEnable,
	},
	'jobs.list': {
		input: WorkableEndpointInputSchemas.jobsList,
		output: WorkableEndpointOutputSchemas.jobsList,
	},
	'candidates.list': {
		input: WorkableEndpointInputSchemas.candidatesList,
		output: WorkableEndpointOutputSchemas.candidatesList,
	},
	'stages.list': {
		input: WorkableEndpointInputSchemas.stagesList,
		output: WorkableEndpointOutputSchemas.stagesList,
	},
	'requisitions.list': {
		input: WorkableEndpointInputSchemas.requisitionsList,
		output: WorkableEndpointOutputSchemas.requisitionsList,
	},
	'recruiters.list': {
		input: WorkableEndpointInputSchemas.recruitersList,
		output: WorkableEndpointOutputSchemas.recruitersList,
	},
	'legalEntities.list': {
		input: WorkableEndpointInputSchemas.legalEntitiesList,
		output: WorkableEndpointOutputSchemas.legalEntitiesList,
	},
	'customAttributes.list': {
		input: WorkableEndpointInputSchemas.customAttributesList,
		output: WorkableEndpointOutputSchemas.customAttributesList,
	},
	'disqualificationReasons.list': {
		input: WorkableEndpointInputSchemas.disqualificationReasonsList,
		output: WorkableEndpointOutputSchemas.disqualificationReasonsList,
	},
	'permissionSets.list': {
		input: WorkableEndpointInputSchemas.permissionSetsList,
		output: WorkableEndpointOutputSchemas.permissionSetsList,
	},
	'timeoffCategories.list': {
		input: WorkableEndpointInputSchemas.timeoffCategoriesList,
		output: WorkableEndpointOutputSchemas.timeoffCategoriesList,
	},
	'timeoffBalances.list': {
		input: WorkableEndpointInputSchemas.timeoffBalancesList,
		output: WorkableEndpointOutputSchemas.timeoffBalancesList,
	},
	'workSchedules.list': {
		input: WorkableEndpointInputSchemas.workSchedulesList,
		output: WorkableEndpointOutputSchemas.workSchedulesList,
	},
	'events.list': {
		input: WorkableEndpointInputSchemas.eventsList,
		output: WorkableEndpointOutputSchemas.eventsList,
	},
	'subscriptions.list': {
		input: WorkableEndpointInputSchemas.subscriptionsList,
		output: WorkableEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.create': {
		input: WorkableEndpointInputSchemas.subscriptionsCreate,
		output: WorkableEndpointOutputSchemas.subscriptionsCreate,
	},
	'subscriptions.delete': {
		input: WorkableEndpointInputSchemas.subscriptionsDelete,
		output: WorkableEndpointOutputSchemas.subscriptionsDelete,
	},
	'publicJobs.list': {
		input: WorkableEndpointInputSchemas.publicJobsList,
		output: WorkableEndpointOutputSchemas.publicJobsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof workableEndpointsNested
>;

const workableEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List all Workable accounts accessible to the authenticated token',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get account metadata by subdomain',
	},
	'departments.list': {
		riskLevel: 'read',
		description: 'List all departments',
	},
	'departments.create': {
		riskLevel: 'write',
		description: 'Create a department',
	},
	'departments.update': {
		riskLevel: 'write',
		description: "Update a department's name or parent",
	},
	'departments.merge': {
		riskLevel: 'write',
		description: 'Merge a department into another department',
	},
	'departments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a department',
	},
	'employees.list': { riskLevel: 'read', description: 'List/search employees' },
	'employees.get': {
		riskLevel: 'read',
		description: 'Get a specific employee by ID',
	},
	'employees.create': {
		riskLevel: 'write',
		description: 'Create an employee in draft or published state',
	},
	'employees.update': {
		riskLevel: 'write',
		description: "Update an employee's details",
	},
	'employees.uploadDocuments': {
		riskLevel: 'write',
		description: 'Upload documents for an employee',
	},
	'employeeFields.list': {
		riskLevel: 'read',
		description: 'List employee field definitions',
	},
	'members.list': { riskLevel: 'read', description: 'List account members' },
	'members.invite': {
		riskLevel: 'write',
		description: 'Invite a new member by email',
	},
	'members.update': {
		riskLevel: 'write',
		description: "Update a member's roles or collaboration rules",
	},
	'members.enable': {
		riskLevel: 'write',
		description: 'Reactivate a deactivated member',
	},
	'jobs.list': { riskLevel: 'read', description: 'List jobs' },
	'candidates.list': {
		riskLevel: 'read',
		description: 'List candidates across all jobs',
	},
	'stages.list': {
		riskLevel: 'read',
		description: 'List recruitment pipeline stages',
	},
	'requisitions.list': { riskLevel: 'read', description: 'List requisitions' },
	'recruiters.list': {
		riskLevel: 'read',
		description: 'List external recruiters',
	},
	'legalEntities.list': {
		riskLevel: 'read',
		description: 'List account legal entities',
	},
	'customAttributes.list': {
		riskLevel: 'read',
		description: 'List custom attributes configured on the account',
	},
	'disqualificationReasons.list': {
		riskLevel: 'read',
		description: 'List disqualification reasons',
	},
	'permissionSets.list': {
		riskLevel: 'read',
		description: 'List permission sets',
	},
	'timeoffCategories.list': {
		riskLevel: 'read',
		description: 'List time-off categories',
	},
	'timeoffBalances.list': {
		riskLevel: 'read',
		description: 'List employee time-off balances',
	},
	'workSchedules.list': {
		riskLevel: 'read',
		description: 'List work schedules',
	},
	'events.list': { riskLevel: 'read', description: 'List scheduled events' },
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'subscriptions.create': {
		riskLevel: 'write',
		description: 'Subscribe to a candidate or employee webhook event',
	},
	'subscriptions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription',
	},
	'publicJobs.list': {
		riskLevel: 'read',
		description:
			"List an account's public job postings (no authentication required)",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof workableEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseWorkablePlugin<T extends WorkablePluginOptions> = CorsairPlugin<
	'workable',
	typeof WorkableSchema,
	typeof workableEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof workableAuthConfig
>;

export type InternalWorkablePlugin = BaseWorkablePlugin<WorkablePluginOptions>;
export type ExternalWorkablePlugin<T extends WorkablePluginOptions> =
	BaseWorkablePlugin<T>;

export function workable<const T extends WorkablePluginOptions>(
	incomingOptions: WorkablePluginOptions & T = {} as WorkablePluginOptions & T,
): ExternalWorkablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'workable',
		authConfig: workableAuthConfig,
		schema: WorkableSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: workableEndpointsNested,
		webhooks: {},
		endpointMeta: workableEndpointMeta,
		endpointSchemas: workableEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WorkableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = (await ctx.keys.get_api_key()) ?? '';
				if (!key) throw new AuthMissingError('workable', 'api_key');
				return key;
			}
			throw new AuthMissingError('workable', 'api_key');
		},
	} satisfies InternalWorkablePlugin;
}

export type {
	WorkableEndpointInputs,
	WorkableEndpointOutputs,
} from './endpoints/types';
