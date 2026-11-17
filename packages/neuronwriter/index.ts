import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { NeuronwriterContext } from './context';
import { importContent } from './endpoints';
import { ImportInputSchema, ImportResponseSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NeuronwriterSchema } from './schema';

export type { NeuronwriterContext };

export type NeuronwriterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNeuronwriterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neuronwriterEndpointsNested>;
};

export type NeuronwriterKeyBuilderContext =
	KeyBuilderContext<NeuronwriterPluginOptions>;

const neuronwriterEndpointsNested = {
	content: { import: importContent },
} as const;

const neuronwriterWebhooksNested = {} as const;

export const neuronwriterEndpointSchemas = {
	'content.import': { input: ImportInputSchema, output: ImportResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof neuronwriterEndpointsNested
>;

const neuronwriterEndpointMeta = {
	'content.import': {
		riskLevel: 'write',
		description:
			'Import HTML or a page into a query. The content is not stored.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof neuronwriterEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const neuronwriterAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseNeuronwriterPlugin<T extends NeuronwriterPluginOptions> =
	CorsairPlugin<
		'neuronwriter',
		typeof NeuronwriterSchema,
		typeof neuronwriterEndpointsNested,
		typeof neuronwriterWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalNeuronwriterPlugin =
	BaseNeuronwriterPlugin<NeuronwriterPluginOptions>;
export type ExternalNeuronwriterPlugin<T extends NeuronwriterPluginOptions> =
	BaseNeuronwriterPlugin<T>;

export function neuronwriter<const T extends NeuronwriterPluginOptions>(
	incomingOptions: NeuronwriterPluginOptions &
		T = {} as NeuronwriterPluginOptions & T,
): ExternalNeuronwriterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'neuronwriter',
		authConfig: neuronwriterAuthConfig,
		schema: NeuronwriterSchema,
		options,
		hooks: options.hooks,
		endpoints: neuronwriterEndpointsNested,
		webhooks: neuronwriterWebhooksNested,
		endpointMeta: neuronwriterEndpointMeta,
		endpointSchemas: neuronwriterEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: NeuronwriterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalNeuronwriterPlugin;
}
