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
import { Reads } from './endpoints';
import type {
	DeskTimeEndpointInputs,
	DeskTimeEndpointOutputs,
} from './endpoints/types';
import {
	DeskTimeEndpointInputSchemas,
	DeskTimeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DeskTimeSchema } from './schema';

export type DeskTimePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDeskTimePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof deskTimeEndpointsNested>;
};

export type DeskTimeContext = CorsairPluginContext<
	typeof DeskTimeSchema,
	DeskTimePluginOptions
>;

export type DeskTimeKeyBuilderContext =
	KeyBuilderContext<DeskTimePluginOptions>;

export type DeskTimeBoundEndpoints = BindEndpoints<
	typeof deskTimeEndpointsNested
>;

type DeskTimeEndpoint<K extends keyof DeskTimeEndpointOutputs> =
	CorsairEndpoint<
		DeskTimeContext,
		DeskTimeEndpointInputs[K],
		DeskTimeEndpointOutputs[K]
	>;

export type DeskTimeEndpoints = {
	ping: DeskTimeEndpoint<'ping'>;
	company: DeskTimeEndpoint<'company'>;
	employees: DeskTimeEndpoint<'employees'>;
	employeeBasic: DeskTimeEndpoint<'employeeBasic'>;
	employeeApps: DeskTimeEndpoint<'employeeApps'>;
	employeeProjects: DeskTimeEndpoint<'employeeProjects'>;
	projects: DeskTimeEndpoint<'projects'>;
};

const deskTimeEndpointsNested = {
	ping: {
		get: Reads.ping,
	},
	company: {
		get: Reads.company,
	},
	employees: {
		list: Reads.employees,
	},
	employee: {
		basic: Reads.employeeBasic,
		apps: Reads.employeeApps,
		projects: Reads.employeeProjects,
	},
	projects: {
		list: Reads.list,
	},
} as const;

export const deskTimeEndpointSchemas = {
	'ping.get': {
		input: DeskTimeEndpointInputSchemas.ping,
		output: DeskTimeEndpointOutputSchemas.ping,
	},
	'company.get': {
		input: DeskTimeEndpointInputSchemas.company,
		output: DeskTimeEndpointOutputSchemas.company,
	},
	'employees.list': {
		input: DeskTimeEndpointInputSchemas.employees,
		output: DeskTimeEndpointOutputSchemas.employees,
	},
	'employee.basic': {
		input: DeskTimeEndpointInputSchemas.employeeBasic,
		output: DeskTimeEndpointOutputSchemas.employeeBasic,
	},
	'employee.apps': {
		input: DeskTimeEndpointInputSchemas.employeeApps,
		output: DeskTimeEndpointOutputSchemas.employeeApps,
	},
	'employee.projects': {
		input: DeskTimeEndpointInputSchemas.employeeProjects,
		output: DeskTimeEndpointOutputSchemas.employeeProjects,
	},
	'projects.list': {
		input: DeskTimeEndpointInputSchemas.projects,
		output: DeskTimeEndpointOutputSchemas.projects,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof deskTimeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// Every operation here reads. DeskTime's write actions (`create-project`,
// `start-project`, `stop-project`) are not part of this plugin.
const deskTimeEndpointMeta = {
	'ping.get': {
		riskLevel: 'read',
		description:
			'Check that the DeskTime API answers. A configured key is still required, because the runtime resolves the account key before any endpoint runs',
	},
	'company.get': {
		riskLevel: 'read',
		description:
			"Read the account's name, work hours, tracking window and timezone",
	},
	'employees.list': {
		riskLevel: 'read',
		description:
			'List every employee for a day, week or month with their arrival, tracked time and productivity, nested by date then employee id',
	},
	'employee.basic': {
		riskLevel: 'read',
		description:
			"Read one employee's arrival, departure, tracked time and productivity for a day, defaulting to the key owner and today",
	},
	'employee.apps': {
		riskLevel: 'read',
		description:
			'Read the apps one employee used on a day, grouped as unrated, neutral and productive',
	},
	'employee.projects': {
		riskLevel: 'read',
		description: 'Read the projects one employee tracked time against on a day',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			"List the account's active projects with their tasks. Archived projects are left out",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof deskTimeEndpointsNested>;

export type BaseDeskTimePlugin<T extends DeskTimePluginOptions> = CorsairPlugin<
	'desktime',
	typeof DeskTimeSchema,
	typeof deskTimeEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDeskTimePlugin = BaseDeskTimePlugin<DeskTimePluginOptions>;

export type ExternalDeskTimePlugin<T extends DeskTimePluginOptions> =
	BaseDeskTimePlugin<T>;

export function desktime<const T extends DeskTimePluginOptions>(
	incomingOptions: DeskTimePluginOptions & T = {} as DeskTimePluginOptions & T,
): ExternalDeskTimePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'desktime',
		schema: DeskTimeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: deskTimeEndpointsNested,
		webhooks: {},
		endpointMeta: deskTimeEndpointMeta,
		endpointSchemas: deskTimeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DeskTimeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('desktime', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDeskTimePlugin;
}

export { DeskTimeAPIError } from './client';

export type {
	CompanyInput,
	CompanyResponse,
	DeskTimeEmployee,
	DeskTimeEndpointInputs,
	DeskTimeEndpointOutputs,
	EmployeeAppsResponse,
	EmployeeBasicInput,
	EmployeeBasicResponse,
	EmployeeInput,
	EmployeeProjectsResponse,
	EmployeesInput,
	EmployeesResponse,
	PingInput,
	PingResponse,
	ProjectsInput,
	ProjectsResponse,
} from './endpoints/types';
