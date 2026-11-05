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
import {
	extendCreate,
	framesCreate,
	imageToVideoCreate,
	operationsGet,
	operationsWait,
	referencesCreate,
	textToVideoCreate,
} from './endpoints';
import type { VeoEndpointInputs, VeoEndpointOutputs } from './endpoints/types';
import {
	VeoEndpointInputSchemas,
	VeoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VeoSchema } from './schema';

export type VeoPluginOptions = {
	/** Google OAuth access token sent as Authorization: Bearer. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Google Cloud project id used when a call does not pass projectId. */
	projectId?: string;
	/**
	 * API location. Defaults to us-central1 (the Veo REST samples).
	 * `global` uses https://aiplatform.googleapis.com.
	 */
	location?: string;
	hooks?: InternalVeoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof veoEndpointsNested>;
};

export const veoAuthConfig = {
	api_key: {
		account: ['projectId'] as const,
	},
} as const satisfies PluginAuthConfig;

export type VeoContext = CorsairPluginContext<
	typeof VeoSchema,
	VeoPluginOptions,
	undefined,
	typeof veoAuthConfig
>;

export type VeoKeyBuilderContext = KeyBuilderContext<
	VeoPluginOptions,
	typeof veoAuthConfig
>;

export type VeoBoundEndpoints = BindEndpoints<typeof veoEndpointsNested>;

type VeoEndpoint<K extends keyof VeoEndpointOutputs> = CorsairEndpoint<
	VeoContext,
	VeoEndpointInputs[K],
	VeoEndpointOutputs[K]
>;

export type VeoEndpoints = {
	textToVideo: { create: VeoEndpoint<'textToVideoCreate'> };
	imageToVideo: { create: VeoEndpoint<'imageToVideoCreate'> };
	frames: { create: VeoEndpoint<'framesCreate'> };
	references: { create: VeoEndpoint<'referencesCreate'> };
	extend: { create: VeoEndpoint<'extendCreate'> };
	operations: {
		get: VeoEndpoint<'operationsGet'>;
		wait: VeoEndpoint<'operationsWait'>;
	};
};

const veoEndpointsNested = {
	textToVideo: { create: textToVideoCreate },
	imageToVideo: { create: imageToVideoCreate },
	frames: { create: framesCreate },
	references: { create: referencesCreate },
	extend: { create: extendCreate },
	operations: { get: operationsGet, wait: operationsWait },
} as const;

export const veoEndpointSchemas = {
	'textToVideo.create': {
		input: VeoEndpointInputSchemas.textToVideoCreate,
		output: VeoEndpointOutputSchemas.textToVideoCreate,
	},
	'imageToVideo.create': {
		input: VeoEndpointInputSchemas.imageToVideoCreate,
		output: VeoEndpointOutputSchemas.imageToVideoCreate,
	},
	'frames.create': {
		input: VeoEndpointInputSchemas.framesCreate,
		output: VeoEndpointOutputSchemas.framesCreate,
	},
	'references.create': {
		input: VeoEndpointInputSchemas.referencesCreate,
		output: VeoEndpointOutputSchemas.referencesCreate,
	},
	'extend.create': {
		input: VeoEndpointInputSchemas.extendCreate,
		output: VeoEndpointOutputSchemas.extendCreate,
	},
	'operations.get': {
		input: VeoEndpointInputSchemas.operationsGet,
		output: VeoEndpointOutputSchemas.operationsGet,
	},
	'operations.wait': {
		input: VeoEndpointInputSchemas.operationsWait,
		output: VeoEndpointOutputSchemas.operationsWait,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof veoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const veoEndpointMeta = {
	'textToVideo.create': {
		riskLevel: 'write',
		description:
			'Start a Veo text-to-video generation. Returns a long-running operation name.',
	},
	'imageToVideo.create': {
		riskLevel: 'write',
		description:
			'Start a Veo image-to-video generation from a first-frame image.',
	},
	'frames.create': {
		riskLevel: 'write',
		description:
			'Start a Veo video that begins at one image and ends at another.',
	},
	'references.create': {
		riskLevel: 'write',
		description:
			'Start a Veo video guided by up to three asset reference images.',
	},
	'extend.create': {
		riskLevel: 'write',
		description: 'Extend a Veo video stored in Cloud Storage.',
	},
	'operations.get': {
		riskLevel: 'read',
		description: 'Fetch the status of a Veo predictLongRunning operation.',
	},
	'operations.wait': {
		riskLevel: 'read',
		description:
			'Poll a Veo operation until it finishes, fails, or the timeout is reached.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof veoEndpointsNested>;

export type BaseVeoPlugin<T extends VeoPluginOptions> = CorsairPlugin<
	'veo',
	typeof VeoSchema,
	typeof veoEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof veoAuthConfig
>;

export type InternalVeoPlugin = BaseVeoPlugin<VeoPluginOptions>;

export type ExternalVeoPlugin<T extends VeoPluginOptions> = BaseVeoPlugin<T>;

export function veo<const T extends VeoPluginOptions>(
	incomingOptions: VeoPluginOptions & T = {} as VeoPluginOptions & T,
): ExternalVeoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'veo',
		authConfig: veoAuthConfig,
		schema: VeoSchema,
		options,
		hooks: options.hooks,
		// Veo has no inbound webhooks. Results are long-running operations.
		webhooks: {},
		endpoints: veoEndpointsNested,
		endpointMeta: veoEndpointMeta,
		endpointSchemas: veoEndpointSchemas,
		errorHandlers: (() => {
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: VeoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('veo', 'api_key');
				}
				return storedKey;
			}
			return '';
		},
	} satisfies InternalVeoPlugin;
}

export type {
	ExtendCreateInput,
	FramesCreateInput,
	ImageToVideoCreateInput,
	OperationGetInput,
	OperationWaitInput,
	ReferencesCreateInput,
	TextToVideoCreateInput,
	VeoEndpointInputs,
	VeoEndpointOutputs,
	VeoOperation,
} from './endpoints/types';
