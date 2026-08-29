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
import { Employees, Leaves } from './endpoints';
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
	permissions?: PluginPermissionsConfig<typeof breatheHrEndpointsNested>;
};

export type BreatheHrContext = CorsairPluginContext<
	typeof BreatheHrSchema,
	BreatheHrPluginOptions,
	undefined,
	typeof breatheHrAuthConfig
>;

export type BreatheHrKeyBuilderContext = KeyBuilderContext<
	BreatheHrPluginOptions,
	typeof breatheHrAuthConfig
>;

export type BreatheHrBoundEndpoints = BindEndpoints<
	typeof breatheHrEndpointsNested
>;

type BreatheHrEndpoint<K extends keyof BreatheHrEndpointOutputs> =
	CorsairEndpoint<
		BreatheHrContext,
		BreatheHrEndpointInputs[K],
		BreatheHrEndpointOutputs[K]
	>;

export type BreatheHrEndpoints = {
	employeesList: BreatheHrEndpoint<'employeesList'>;
	employeesGet: BreatheHrEndpoint<'employeesGet'>;
	employeesCreate: BreatheHrEndpoint<'employeesCreate'>;
	leavesList: BreatheHrEndpoint<'leavesList'>;
	leavesGet: BreatheHrEndpoint<'leavesGet'>;
};

const breatheHrEndpointsNested = {
	employees: {
		list: Employees.list,
		get: Employees.get,
		create: Employees.create,
	},
	leaves: {
		list: Leaves.list,
		get: Leaves.get,
	},
} as const;

const breatheHrWebhooksNested = {} as const;

export const breatheHrEndpointSchemas = {
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
	'leaves.list': {
		input: BreatheHrEndpointInputSchemas.leavesList,
		output: BreatheHrEndpointOutputSchemas.leavesList,
	},
	'leaves.get': {
		input: BreatheHrEndpointInputSchemas.leavesGet,
		output: BreatheHrEndpointOutputSchemas.leavesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof breatheHrEndpointsNested
>;

const breatheHrEndpointMeta = {
	'employees.list': { riskLevel: 'read', description: 'List all employees' },
	'employees.get': {
		riskLevel: 'read',
		description: 'Get employee details by ID',
	},
	'employees.create': {
		riskLevel: 'write',
		description: 'Create a new employee profile',
	},
	'leaves.list': {
		riskLevel: 'read',
		description: 'List employee leaves and absences',
	},
	'leaves.get': {
		riskLevel: 'read',
		description: 'Get a specific leave request',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof breatheHrEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const breatheHrAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBreatheHrPlugin<T extends BreatheHrPluginOptions> =
	CorsairPlugin<
		'breathehr',
		typeof BreatheHrSchema,
		typeof breatheHrEndpointsNested,
		typeof breatheHrWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof breatheHrAuthConfig
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
		authConfig: breatheHrAuthConfig,
		schema: BreatheHrSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: breatheHrEndpointsNested,
		webhooks: breatheHrWebhooksNested,
		endpointMeta: breatheHrEndpointMeta,
		endpointSchemas: breatheHrEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BreatheHrKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint') {
				const res = await ctx.keys?.get_api_key();
				if (res) return res;
			}
			if (options.key) return options.key;
			throw new AuthMissingError('breathehr', 'api_key');
		},
	} satisfies InternalBreatheHrPlugin;
}

export default breathehr;
export * from './endpoints/types';
