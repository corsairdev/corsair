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
import { Auth, Images } from './endpoints';
import type {
	ImgBBEndpointInputs,
	ImgBBEndpointOutputs,
} from './endpoints/types';
import {
	ImgBBEndpointInputSchemas,
	ImgBBEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ImgBBSchema } from './schema';

export type ImgBBPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalImgBBPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof imgBBEndpointsNested>;
};

export type ImgBBContext = CorsairPluginContext<
	typeof ImgBBSchema,
	ImgBBPluginOptions
>;

export type ImgBBKeyBuilderContext = KeyBuilderContext<ImgBBPluginOptions>;

export type ImgBBBoundEndpoints = BindEndpoints<typeof imgBBEndpointsNested>;

type ImgBBEndpoint<K extends keyof ImgBBEndpointOutputs> = CorsairEndpoint<
	ImgBBContext,
	ImgBBEndpointInputs[K],
	ImgBBEndpointOutputs[K]
>;

export type ImgBBEndpoints = {
	getApiKey: ImgBBEndpoint<'getApiKey'>;
	upload: ImgBBEndpoint<'upload'>;
};

const imgBBEndpointsNested = {
	auth: {
		getApiKey: Auth.getApiKey,
	},
	images: {
		upload: Images.upload,
	},
} as const;

const imgBBWebhooksNested = {} as const;

export const imgBBEndpointSchemas = {
	'auth.getApiKey': {
		input: ImgBBEndpointInputSchemas.getApiKey,
		output: ImgBBEndpointOutputSchemas.getApiKey,
	},
	'images.upload': {
		input: ImgBBEndpointInputSchemas.upload,
		output: ImgBBEndpointOutputSchemas.upload,
	},
} satisfies RequiredPluginEndpointSchemas<typeof imgBBEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const imgBBEndpointMeta = {
	'auth.getApiKey': {
		riskLevel: 'read',
		description:
			'Confirm an ImgBB API key is configured for this account and return a masked preview of it',
	},
	'images.upload': {
		riskLevel: 'write',
		description:
			'Upload an image to ImgBB and return the hosted image URLs and metadata',
	},
} satisfies RequiredPluginEndpointMeta<typeof imgBBEndpointsNested>;

export const imgBBAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseImgBBPlugin<T extends ImgBBPluginOptions> = CorsairPlugin<
	'imgbb',
	typeof ImgBBSchema,
	typeof imgBBEndpointsNested,
	typeof imgBBWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalImgBBPlugin = BaseImgBBPlugin<ImgBBPluginOptions>;

export type ExternalImgBBPlugin<T extends ImgBBPluginOptions> =
	BaseImgBBPlugin<T>;

export function imgbb<const T extends ImgBBPluginOptions>(
	incomingOptions: ImgBBPluginOptions & T = {} as ImgBBPluginOptions & T,
): ExternalImgBBPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'imgbb',
		authConfig: imgBBAuthConfig,
		schema: ImgBBSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: imgBBEndpointsNested,
		webhooks: imgBBWebhooksNested,
		endpointMeta: imgBBEndpointMeta,
		endpointSchemas: imgBBEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ImgBBKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('imgbb', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('imgbb', 'api_key');
		},
	} satisfies InternalImgBBPlugin;
}

export type {
	GetApiKeyInput,
	GetApiKeyResponse,
	ImgBBEndpointInputs,
	ImgBBEndpointOutputs,
	ImgBBUploadEnvelope,
	UploadImageInput,
	UploadImageResponse,
} from './endpoints/types';

export {
	GetApiKeyInputSchema,
	GetApiKeyResponseSchema,
	ImgBBEndpointInputSchemas,
	ImgBBEndpointOutputSchemas,
	ImgBBImage,
	ImgBBImageVariant,
	ImgBBUploadEnvelopeSchema,
	UploadImageInputSchema,
	UploadImageResponseSchema,
} from './endpoints/types';

export { ImgBBSchema } from './schema';
