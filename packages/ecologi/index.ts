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
import type { EcologiContext } from './context';
import {
	getCarbonOffset,
	getCarbonRemoval,
	getHabitat,
	getImpact,
	getTrees,
} from './endpoints';
import {
	ImpactResponseSchema,
	TotalResponseSchema,
	UsernameInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EcologiSchema } from './schema';

export type { EcologiContext };

export type EcologiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEcologiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ecologiEndpointsNested>;
};

export type EcologiKeyBuilderContext = KeyBuilderContext<EcologiPluginOptions>;

const ecologiEndpointsNested = {
	trees: { get: getTrees },
	carbonOffsets: { get: getCarbonOffset },
	carbonRemovals: { get: getCarbonRemoval },
	habitats: { get: getHabitat },
	impacts: { get: getImpact },
} as const;

const ecologiWebhooksNested = {} as const;

const total = { input: UsernameInputSchema, output: TotalResponseSchema };

export const ecologiEndpointSchemas = {
	'trees.get': total,
	'carbonOffsets.get': total,
	'carbonRemovals.get': total,
	'habitats.get': total,
	'impacts.get': { input: UsernameInputSchema, output: ImpactResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ecologiEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const ecologiEndpointMeta = {
	'trees.get': read('Read the trees funded by an Ecologi username.'),
	'carbonOffsets.get': read('Read the CO2e avoided by an Ecologi username.'),
	'carbonRemovals.get': read('Read the CO2e removed by an Ecologi username.'),
	'habitats.get': read('Read the habitat restored by an Ecologi username.'),
	'impacts.get': read('Read the combined impact for an Ecologi username.'),
} as const satisfies RequiredPluginEndpointMeta<typeof ecologiEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const ecologiAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseEcologiPlugin<T extends EcologiPluginOptions> = CorsairPlugin<
	'ecologi',
	typeof EcologiSchema,
	typeof ecologiEndpointsNested,
	typeof ecologiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEcologiPlugin = BaseEcologiPlugin<EcologiPluginOptions>;
export type ExternalEcologiPlugin<T extends EcologiPluginOptions> =
	BaseEcologiPlugin<T>;

export function ecologi<const T extends EcologiPluginOptions>(
	incomingOptions: EcologiPluginOptions & T = {} as EcologiPluginOptions & T,
): ExternalEcologiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ecologi',
		authConfig: ecologiAuthConfig,
		schema: EcologiSchema,
		options,
		hooks: options.hooks,
		endpoints: ecologiEndpointsNested,
		webhooks: ecologiWebhooksNested,
		endpointMeta: ecologiEndpointMeta,
		endpointSchemas: ecologiEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: EcologiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalEcologiPlugin;
}
