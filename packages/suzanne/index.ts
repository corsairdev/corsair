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
import { tryGetStoredKey } from './client';
import { Generations, Jobs, Models, Uploads } from './endpoints';
import type {
	SuzanneEndpointInputs,
	SuzanneEndpointOutputs,
} from './endpoints/types';
import {
	SuzanneEndpointInputSchemas,
	SuzanneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SuzanneSchema } from './schema';

export type SuzannePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalSuzannePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof suzanneEndpointsNested>;
};

export const suzanneAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type SuzanneContext = CorsairPluginContext<
	typeof SuzanneSchema,
	SuzannePluginOptions,
	undefined,
	typeof suzanneAuthConfig
>;

export type SuzanneKeyBuilderContext = KeyBuilderContext<
	SuzannePluginOptions,
	typeof suzanneAuthConfig
>;

export type SuzanneBoundEndpoints = BindEndpoints<
	typeof suzanneEndpointsNested
>;

type SuzanneEndpoint<K extends keyof SuzanneEndpointOutputs> = CorsairEndpoint<
	SuzanneContext,
	SuzanneEndpointInputs[K],
	SuzanneEndpointOutputs[K]
>;

export type SuzanneEndpoints = {
	textTo3d: SuzanneEndpoint<'textTo3d'>;
	photoTo3d: SuzanneEndpoint<'photoTo3d'>;
	createUpload: SuzanneEndpoint<'createUpload'>;
	getJob: SuzanneEndpoint<'getJob'>;
	cancelJob: SuzanneEndpoint<'cancelJob'>;
	downloadModel: SuzanneEndpoint<'downloadModel'>;
};

const suzanneEndpointsNested = {
	generations: {
		textTo3d: Generations.textTo3d,
		photoTo3d: Generations.photoTo3d,
	},
	uploads: {
		create: Uploads.create,
	},
	jobs: {
		get: Jobs.get,
		cancel: Jobs.cancel,
	},
	models: {
		download: Models.download,
	},
} as const;

export const suzanneEndpointSchemas = {
	'generations.textTo3d': {
		input: SuzanneEndpointInputSchemas.textTo3d,
		output: SuzanneEndpointOutputSchemas.textTo3d,
	},
	'generations.photoTo3d': {
		input: SuzanneEndpointInputSchemas.photoTo3d,
		output: SuzanneEndpointOutputSchemas.photoTo3d,
	},
	'uploads.create': {
		input: SuzanneEndpointInputSchemas.createUpload,
		output: SuzanneEndpointOutputSchemas.createUpload,
	},
	'jobs.get': {
		input: SuzanneEndpointInputSchemas.getJob,
		output: SuzanneEndpointOutputSchemas.getJob,
	},
	'jobs.cancel': {
		input: SuzanneEndpointInputSchemas.cancelJob,
		output: SuzanneEndpointOutputSchemas.cancelJob,
	},
	'models.download': {
		input: SuzanneEndpointInputSchemas.downloadModel,
		output: SuzanneEndpointOutputSchemas.downloadModel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof suzanneEndpointsNested
>;

const suzanneEndpointMeta = {
	'generations.textTo3d': {
		riskLevel: 'write',
		description: 'Submit a text prompt and queue a 3D mesh job',
	},
	'generations.photoTo3d': {
		riskLevel: 'write',
		description: 'Submit one to four photos and queue a 3D mesh job',
	},
	'uploads.create': {
		riskLevel: 'write',
		description: 'Create a presigned URL for a JPEG or PNG upload',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Read a generation job and its download URLs',
	},
	'jobs.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a queued or running generation job',
	},
	'models.download': {
		riskLevel: 'read',
		description: 'Mint a fresh download URL for a finished mesh',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof suzanneEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};
	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

export type BaseSuzannePlugin<T extends SuzannePluginOptions> = CorsairPlugin<
	'suzanne',
	typeof SuzanneSchema,
	typeof suzanneEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof suzanneAuthConfig
>;

export type InternalSuzannePlugin = BaseSuzannePlugin<SuzannePluginOptions>;
export type ExternalSuzannePlugin<T extends SuzannePluginOptions> =
	BaseSuzannePlugin<T>;

export function suzanne<const T extends SuzannePluginOptions>(
	// Empty options still have to satisfy the caller's T.
	incomingOptions: SuzannePluginOptions & T = {} as SuzannePluginOptions & T,
): ExternalSuzannePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'suzanne',
		schema: SuzanneSchema,
		options,
		hooks: options.hooks,
		endpoints: suzanneEndpointsNested,
		webhooks: {},
		endpointMeta: suzanneEndpointMeta,
		endpointSchemas: suzanneEndpointSchemas,
		authConfig: suzanneAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SuzanneKeyBuilderContext) => {
			if (options.key) return options.key;
			const key = await tryGetStoredKey(() => ctx.keys.get_api_key());
			if (!key) throw new AuthMissingError('suzanne', 'api_key');
			return key;
		},
	} satisfies InternalSuzannePlugin;
}

export { SuzanneAPIError } from './client';
export type {
	AcceptedJob,
	CancelJob,
	Download,
	DownloadInput,
	PhotoTo3dInput,
	SuzanneEndpointInputs,
	SuzanneEndpointOutputs,
	SuzanneJob,
	TextTo3dInput,
	Upload,
} from './endpoints/types';
export {
	SuzanneEndpointInputSchemas,
	SuzanneEndpointOutputSchemas,
} from './endpoints/types';
