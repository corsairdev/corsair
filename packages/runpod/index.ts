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
	createCluster,
	createSecret,
	deleteRegistryAuth,
	deleteTemplate,
	getGpuTypes,
	getMyself,
	getPod,
	listCpuTypes,
	listPods,
	saveEndpoint,
	saveRegistryAuth,
	saveTemplate,
	updateRegistryAuth,
	updateUserSettings,
} from './endpoints';
import type {
	RunpodEndpointInputs,
	RunpodEndpointOutputs,
} from './endpoints/types';
import {
	RunpodEndpointInputSchemas,
	RunpodEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RunpodSchema } from './schema';

export type RunpodPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRunpodPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof runpodEndpointsNested>;
};

export type RunpodContext = CorsairPluginContext<
	typeof RunpodSchema,
	RunpodPluginOptions
>;

export type RunpodKeyBuilderContext = KeyBuilderContext<RunpodPluginOptions>;

export type RunpodBoundEndpoints = BindEndpoints<typeof runpodEndpointsNested>;

type RunpodEndpoint<K extends keyof RunpodEndpointOutputs> = CorsairEndpoint<
	RunpodContext,
	RunpodEndpointInputs[K],
	RunpodEndpointOutputs[K]
>;

export type RunpodEndpoints = {
	getMyself: RunpodEndpoint<'getMyself'>;
	updateUserSettings: RunpodEndpoint<'updateUserSettings'>;
	getGpuTypes: RunpodEndpoint<'getGpuTypes'>;
	listCpuTypes: RunpodEndpoint<'listCpuTypes'>;
	listPods: RunpodEndpoint<'listPods'>;
	getPod: RunpodEndpoint<'getPod'>;
	createCluster: RunpodEndpoint<'createCluster'>;
	createSecret: RunpodEndpoint<'createSecret'>;
	saveRegistryAuth: RunpodEndpoint<'saveRegistryAuth'>;
	updateRegistryAuth: RunpodEndpoint<'updateRegistryAuth'>;
	deleteRegistryAuth: RunpodEndpoint<'deleteRegistryAuth'>;
	saveTemplate: RunpodEndpoint<'saveTemplate'>;
	deleteTemplate: RunpodEndpoint<'deleteTemplate'>;
	saveEndpoint: RunpodEndpoint<'saveEndpoint'>;
};

const runpodEndpointsNested = {
	account: {
		myself: getMyself,
		updateSettings: updateUserSettings,
	},
	catalog: {
		gpuTypes: getGpuTypes,
		cpuTypes: listCpuTypes,
	},
	pods: {
		list: listPods,
		get: getPod,
	},
	clusters: {
		create: createCluster,
	},
	secrets: {
		create: createSecret,
	},
	registries: {
		save: saveRegistryAuth,
		update: updateRegistryAuth,
		delete: deleteRegistryAuth,
	},
	templates: {
		save: saveTemplate,
		delete: deleteTemplate,
	},
	endpoints: {
		save: saveEndpoint,
	},
} as const;

const runpodWebhooksNested = {} as const;

export const runpodEndpointSchemas = {
	'account.myself': {
		input: RunpodEndpointInputSchemas.getMyself,
		output: RunpodEndpointOutputSchemas.getMyself,
	},
	'account.updateSettings': {
		input: RunpodEndpointInputSchemas.updateUserSettings,
		output: RunpodEndpointOutputSchemas.updateUserSettings,
	},
	'catalog.gpuTypes': {
		input: RunpodEndpointInputSchemas.getGpuTypes,
		output: RunpodEndpointOutputSchemas.getGpuTypes,
	},
	'catalog.cpuTypes': {
		input: RunpodEndpointInputSchemas.listCpuTypes,
		output: RunpodEndpointOutputSchemas.listCpuTypes,
	},
	'pods.list': {
		input: RunpodEndpointInputSchemas.listPods,
		output: RunpodEndpointOutputSchemas.listPods,
	},
	'pods.get': {
		input: RunpodEndpointInputSchemas.getPod,
		output: RunpodEndpointOutputSchemas.getPod,
	},
	'clusters.create': {
		input: RunpodEndpointInputSchemas.createCluster,
		output: RunpodEndpointOutputSchemas.createCluster,
	},
	'secrets.create': {
		input: RunpodEndpointInputSchemas.createSecret,
		output: RunpodEndpointOutputSchemas.createSecret,
	},
	'registries.save': {
		input: RunpodEndpointInputSchemas.saveRegistryAuth,
		output: RunpodEndpointOutputSchemas.saveRegistryAuth,
	},
	'registries.update': {
		input: RunpodEndpointInputSchemas.updateRegistryAuth,
		output: RunpodEndpointOutputSchemas.updateRegistryAuth,
	},
	'registries.delete': {
		input: RunpodEndpointInputSchemas.deleteRegistryAuth,
		output: RunpodEndpointOutputSchemas.deleteRegistryAuth,
	},
	'templates.save': {
		input: RunpodEndpointInputSchemas.saveTemplate,
		output: RunpodEndpointOutputSchemas.saveTemplate,
	},
	'templates.delete': {
		input: RunpodEndpointInputSchemas.deleteTemplate,
		output: RunpodEndpointOutputSchemas.deleteTemplate,
	},
	'endpoints.save': {
		input: RunpodEndpointInputSchemas.saveEndpoint,
		output: RunpodEndpointOutputSchemas.saveEndpoint,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof runpodEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const runpodEndpointMeta = {
	'account.myself': {
		riskLevel: 'read',
		description:
			'Get the authenticated RunPod user id, email, MFA, and SSH public key',
	},
	'account.updateSettings': {
		riskLevel: 'write',
		description: 'Update the account SSH public key used for Pod access',
	},
	'catalog.gpuTypes': {
		riskLevel: 'read',
		description:
			'List GPU types with memory, cloud availability, pricing, and stock',
	},
	'catalog.cpuTypes': {
		riskLevel: 'read',
		description: 'List CPU types with vCPU range, RAM, and pricing',
	},
	'pods.list': {
		riskLevel: 'read',
		description:
			'List Pods with optional status, GPU, image, and location filters',
	},
	'pods.get': {
		riskLevel: 'read',
		description: 'Get a Pod by id including status, cost, GPU, and memory',
	},
	'clusters.create': {
		riskLevel: 'write',
		description: 'Create a multi-node GPU cluster for distributed workloads',
	},
	'secrets.create': {
		riskLevel: 'write',
		description:
			'Create an encrypted secret referenced as RUNPOD_SECRET_<name>',
	},
	'registries.save': {
		riskLevel: 'write',
		description: 'Store credentials for a private container registry',
	},
	'registries.update': {
		riskLevel: 'write',
		description: 'Update username or password for a saved registry auth',
	},
	'registries.delete': {
		riskLevel: 'write',
		description: 'Delete stored container registry credentials',
	},
	'templates.save': {
		riskLevel: 'write',
		description: 'Create or update a reusable Pod or Serverless template',
	},
	'templates.delete': {
		riskLevel: 'write',
		description: 'Delete a template that is not in use by pods or endpoints',
	},
	'endpoints.save': {
		riskLevel: 'write',
		description: 'Create or update a Serverless endpoint and scaling settings',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof runpodEndpointsNested>;

export const runpodAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRunpodPlugin<T extends RunpodPluginOptions> = CorsairPlugin<
	'runpod',
	typeof RunpodSchema,
	typeof runpodEndpointsNested,
	typeof runpodWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRunpodPlugin = BaseRunpodPlugin<RunpodPluginOptions>;

export type ExternalRunpodPlugin<T extends RunpodPluginOptions> =
	BaseRunpodPlugin<T>;

export function runpod<const T extends RunpodPluginOptions>(
	incomingOptions: RunpodPluginOptions & T = {} as RunpodPluginOptions & T,
): ExternalRunpodPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'runpod',
		authConfig: runpodAuthConfig,
		schema: RunpodSchema,
		options,
		hooks: options.hooks,
		endpoints: runpodEndpointsNested,
		webhooks: runpodWebhooksNested,
		endpointMeta: runpodEndpointMeta,
		endpointSchemas: runpodEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RunpodKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('runpod', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('runpod', 'api_key');
		},
	} satisfies InternalRunpodPlugin;
}

export type {
	CreateClusterInput,
	CreateSecretInput,
	DeleteRegistryAuthInput,
	DeleteTemplateInput,
	GetGpuTypesInput,
	GetPodInput,
	ListCpuTypesInput,
	ListPodsInput,
	RunpodEndpointInputs,
	RunpodEndpointOutputs,
	SaveEndpointInput,
	SaveRegistryAuthInput,
	SaveTemplateInput,
	UpdateRegistryAuthInput,
	UpdateUserSettingsInput,
} from './endpoints/types';
