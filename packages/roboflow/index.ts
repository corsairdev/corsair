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
import { Inference, Platform } from './endpoints';
import type {
	RoboflowEndpointInputs,
	RoboflowEndpointOutputs,
} from './endpoints/types';
import {
	RoboflowEndpointInputSchemas,
	RoboflowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RoboflowSchema } from './schema';

export type RoboflowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRoboflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof roboflowEndpointsNested>;
};

export type RoboflowContext = CorsairPluginContext<
	typeof RoboflowSchema,
	RoboflowPluginOptions
>;

export type RoboflowKeyBuilderContext =
	KeyBuilderContext<RoboflowPluginOptions>;

export type RoboflowBoundEndpoints = BindEndpoints<
	typeof roboflowEndpointsNested
>;

type RoboflowEndpoint<K extends keyof RoboflowEndpointOutputs> =
	CorsairEndpoint<
		RoboflowContext,
		RoboflowEndpointInputs[K],
		RoboflowEndpointOutputs[K]
	>;

export type RoboflowEndpoints = {
	accountGet: RoboflowEndpoint<'accountGet'>;
	workspaceGet: RoboflowEndpoint<'workspaceGet'>;
	projectGet: RoboflowEndpoint<'projectGet'>;
	projectCreate: RoboflowEndpoint<'projectCreate'>;
	projectDelete: RoboflowEndpoint<'projectDelete'>;
	versionGet: RoboflowEndpoint<'versionGet'>;
	versionDelete: RoboflowEndpoint<'versionDelete'>;
	modelsList: RoboflowEndpoint<'modelsList'>;
	imageUpload: RoboflowEndpoint<'imageUpload'>;
	infer: RoboflowEndpoint<'infer'>;
};

const roboflowEndpointsNested = {
	account: {
		get: Platform.account,
	},
	workspace: {
		get: Platform.workspace,
	},
	project: {
		get: Platform.project,
		create: Platform.create,
		delete: Platform.remove,
	},
	version: {
		get: Platform.version,
		delete: Platform.deleteVersion,
	},
	models: {
		list: Platform.models,
	},
	images: {
		upload: Platform.upload,
	},
	infer: Inference.infer,
} as const;

export const roboflowEndpointSchemas = {
	'account.get': {
		input: RoboflowEndpointInputSchemas.accountGet,
		output: RoboflowEndpointOutputSchemas.accountGet,
	},
	'workspace.get': {
		input: RoboflowEndpointInputSchemas.workspaceGet,
		output: RoboflowEndpointOutputSchemas.workspaceGet,
	},
	'project.get': {
		input: RoboflowEndpointInputSchemas.projectGet,
		output: RoboflowEndpointOutputSchemas.projectGet,
	},
	'project.create': {
		input: RoboflowEndpointInputSchemas.projectCreate,
		output: RoboflowEndpointOutputSchemas.projectCreate,
	},
	'project.delete': {
		input: RoboflowEndpointInputSchemas.projectDelete,
		output: RoboflowEndpointOutputSchemas.projectDelete,
	},
	'version.get': {
		input: RoboflowEndpointInputSchemas.versionGet,
		output: RoboflowEndpointOutputSchemas.versionGet,
	},
	'version.delete': {
		input: RoboflowEndpointInputSchemas.versionDelete,
		output: RoboflowEndpointOutputSchemas.versionDelete,
	},
	'models.list': {
		input: RoboflowEndpointInputSchemas.modelsList,
		output: RoboflowEndpointOutputSchemas.modelsList,
	},
	'images.upload': {
		input: RoboflowEndpointInputSchemas.imageUpload,
		output: RoboflowEndpointOutputSchemas.imageUpload,
	},
	infer: {
		input: RoboflowEndpointInputSchemas.infer,
		output: RoboflowEndpointOutputSchemas.infer,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof roboflowEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const roboflowEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Check that the key works; the route answers 200 either way, so `authenticated` reports whether a workspace actually came back',
	},
	'workspace.get': {
		riskLevel: 'read',
		description:
			'Read a workspace and its projects with image, annotation and version counts',
	},
	'project.get': {
		riskLevel: 'read',
		description:
			'Read a project with its classes, splits and dataset versions, newest first',
	},
	'project.create': {
		riskLevel: 'write',
		description:
			'Create a project of a given type in an annotation group, optionally licensed onto Universe',
	},
	'project.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and its images, versions and models',
	},
	'version.get': {
		riskLevel: 'read',
		description:
			'Read a dataset version with its image count, splits, and the preprocessing and augmentation it applied',
	},
	'version.delete': {
		riskLevel: 'destructive',
		description: 'Delete a dataset version',
	},
	'models.list': {
		riskLevel: 'read',
		description:
			"List a project's trained models with their task, architecture and metrics; each `url` is the model ID `infer` takes",
	},
	'images.upload': {
		riskLevel: 'write',
		description:
			'Upload one image to a project by URL or base64; a duplicate is reported as such rather than as a failure',
	},
	infer: {
		riskLevel: 'write',
		description:
			'Run a trained model on an image on the serverless inference host, returning predictions and their count; billed per image',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof roboflowEndpointsNested>;

export type BaseRoboflowPlugin<T extends RoboflowPluginOptions> = CorsairPlugin<
	'roboflow',
	typeof RoboflowSchema,
	typeof roboflowEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRoboflowPlugin = BaseRoboflowPlugin<RoboflowPluginOptions>;

export type ExternalRoboflowPlugin<T extends RoboflowPluginOptions> =
	BaseRoboflowPlugin<T>;

export function roboflow<const T extends RoboflowPluginOptions>(
	incomingOptions: RoboflowPluginOptions & T = {} as RoboflowPluginOptions & T,
): ExternalRoboflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'roboflow',
		schema: RoboflowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: roboflowEndpointsNested,
		webhooks: {},
		endpointMeta: roboflowEndpointMeta,
		endpointSchemas: roboflowEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RoboflowKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('roboflow', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRoboflowPlugin;
}

export { RoboflowAPIError } from './client';

export type {
	AccountGetResponse,
	ImageUploadInput,
	ImageUploadResponse,
	InferInput,
	InferResponse,
	ModelsListInput,
	ModelsListResponse,
	ProjectCreateInput,
	ProjectCreateResponse,
	ProjectDeleteInput,
	ProjectDeleteResponse,
	ProjectGetInput,
	ProjectGetResponse,
	RoboflowEndpointInputs,
	RoboflowEndpointOutputs,
	RoboflowModel,
	RoboflowProjectSummary,
	VersionDeleteInput,
	VersionDeleteResponse,
	VersionGetInput,
	VersionGetResponse,
	WorkspaceGetInput,
	WorkspaceGetResponse,
} from './endpoints/types';
