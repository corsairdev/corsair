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
import { Links } from './endpoints';
import type {
	CuttlyEndpointInputs,
	CuttlyEndpointOutputs,
} from './endpoints/types';
import {
	CuttlyEndpointInputSchemas,
	CuttlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CuttlySchema } from './schema';

export type CuttlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCuttlyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cuttlyEndpointsNested>;
};
export type CuttlyContext = CorsairPluginContext<
	typeof CuttlySchema,
	CuttlyPluginOptions
>;
export type CuttlyKeyBuilderContext = KeyBuilderContext<CuttlyPluginOptions>;
export type CuttlyBoundEndpoints = BindEndpoints<typeof cuttlyEndpointsNested>;
type CuttlyEndpoint<K extends keyof CuttlyEndpointOutputs> = CorsairEndpoint<
	CuttlyContext,
	CuttlyEndpointInputs[K],
	CuttlyEndpointOutputs[K]
>;
export type CuttlyEndpoints = {
	shorten: CuttlyEndpoint<'shorten'>;
	update: CuttlyEndpoint<'update'>;
	analytics: CuttlyEndpoint<'analytics'>;
};

const cuttlyEndpointsNested = {
	links: {
		shorten: Links.shorten,
		update: Links.update,
		analytics: Links.analytics,
	},
} as const;
export const cuttlyEndpointSchemas = {
	'links.shorten': {
		input: CuttlyEndpointInputSchemas.shorten,
		output: CuttlyEndpointOutputSchemas.shorten,
	},
	'links.update': {
		input: CuttlyEndpointInputSchemas.update,
		output: CuttlyEndpointOutputSchemas.update,
	},
	'links.analytics': {
		input: CuttlyEndpointInputSchemas.analytics,
		output: CuttlyEndpointOutputSchemas.analytics,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cuttlyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
const cuttlyEndpointMeta = {
	'links.shorten': {
		riskLevel: 'write',
		description:
			'Create a Cutt.ly short URL with an optional custom alias and QR code.',
	},
	'links.update': {
		riskLevel: 'write',
		description:
			'Update the destination URL for an existing Cutt.ly short link.',
	},
	'links.analytics': {
		riskLevel: 'read',
		description: 'Retrieve click analytics for a Cutt.ly short link.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cuttlyEndpointsNested>;
export const cuttlyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseCuttlyPlugin<T extends CuttlyPluginOptions> = CorsairPlugin<
	'cuttly',
	typeof CuttlySchema,
	typeof cuttlyEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof cuttlyAuthConfig
>;
export type InternalCuttlyPlugin = BaseCuttlyPlugin<CuttlyPluginOptions>;
export type ExternalCuttlyPlugin<T extends CuttlyPluginOptions> =
	BaseCuttlyPlugin<T>;

export function cuttly<const T extends CuttlyPluginOptions>(
	incomingOptions: CuttlyPluginOptions & T = {} as CuttlyPluginOptions & T,
): ExternalCuttlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cuttly',
		schema: CuttlySchema,
		options,
		hooks: options.hooks,
		endpoints: cuttlyEndpointsNested,
		webhooks: {},
		endpointMeta: cuttlyEndpointMeta,
		endpointSchemas: cuttlyEndpointSchemas,
		authConfig: cuttlyAuthConfig,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: CuttlyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('cuttly', 'api_key');
		},
	} satisfies InternalCuttlyPlugin;
}

export type {
	CuttlyEndpointInputs,
	CuttlyEndpointOutputs,
} from './endpoints/types';
export {
	CuttlyEndpointInputSchemas,
	CuttlyEndpointOutputSchemas,
} from './endpoints/types';
export { CuttlySchema } from './schema';
