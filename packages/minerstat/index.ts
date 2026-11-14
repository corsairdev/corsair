import type {
	BindEndpoints,
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
	algorithms_get,
	algorithms_list,
	coins_get,
	coins_history,
	coins_list,
	hardware_get,
	hardware_list,
	pools_get,
	pools_list,
	profitability_rank,
} from './endpoints';
import * as schemas from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MinerstatSchema } from './schema';

export type MinerstatPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMinerstatPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof minerstatEndpointsNested>;
};
export type MinerstatContext = CorsairPluginContext<
	typeof MinerstatSchema,
	MinerstatPluginOptions
>;
export type MinerstatKeyBuilderContext =
	KeyBuilderContext<MinerstatPluginOptions>;
const minerstatEndpointsNested = {
	coins: { list: coins_list, get: coins_get, history: coins_history },
	hardware: { list: hardware_list, get: hardware_get },
	algorithms: { list: algorithms_list, get: algorithms_get },
	pools: { list: pools_list, get: pools_get },
	profitability: { rank: profitability_rank },
} as const;
export type MinerstatBoundEndpoints = BindEndpoints<
	typeof minerstatEndpointsNested
>;
export const minerstatEndpointSchemas = {
	'coins.list': {
		input: schemas.coins_listInput,
		output: schemas.coins_listOutput,
	},
	'coins.get': {
		input: schemas.coins_getInput,
		output: schemas.coins_getOutput,
	},
	'coins.history': {
		input: schemas.coins_historyInput,
		output: schemas.coins_historyOutput,
	},
	'hardware.list': {
		input: schemas.hardware_listInput,
		output: schemas.hardware_listOutput,
	},
	'hardware.get': {
		input: schemas.hardware_getInput,
		output: schemas.hardware_getOutput,
	},
	'algorithms.list': {
		input: schemas.algorithms_listInput,
		output: schemas.algorithms_listOutput,
	},
	'algorithms.get': {
		input: schemas.algorithms_getInput,
		output: schemas.algorithms_getOutput,
	},
	'pools.list': {
		input: schemas.pools_listInput,
		output: schemas.pools_listOutput,
	},
	'pools.get': {
		input: schemas.pools_getInput,
		output: schemas.pools_getOutput,
	},
	'profitability.rank': {
		input: schemas.profitability_rankInput,
		output: schemas.profitability_rankOutput,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof minerstatEndpointsNested
>;
const minerstatEndpointMeta = {
	'coins.list': { riskLevel: 'read', description: 'List coins' },
	'coins.get': { riskLevel: 'read', description: 'Get coins' },
	'coins.history': { riskLevel: 'read', description: 'History coins' },
	'hardware.list': { riskLevel: 'read', description: 'List hardware' },
	'hardware.get': { riskLevel: 'read', description: 'Get hardware' },
	'algorithms.list': { riskLevel: 'read', description: 'List algorithms' },
	'algorithms.get': { riskLevel: 'read', description: 'Get algorithms' },
	'pools.list': { riskLevel: 'read', description: 'List pools' },
	'pools.get': { riskLevel: 'read', description: 'Get pools' },
	'profitability.rank': {
		riskLevel: 'read',
		description: 'Rank profitability',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof minerstatEndpointsNested
>;
export const minerstatAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;
export type BaseMinerstatPlugin<T extends MinerstatPluginOptions> =
	CorsairPlugin<
		'minerstat',
		typeof MinerstatSchema,
		typeof minerstatEndpointsNested,
		Record<string, never>,
		T,
		'api_key'
	>;
export type InternalMinerstatPlugin =
	BaseMinerstatPlugin<MinerstatPluginOptions>;
export type ExternalMinerstatPlugin<T extends MinerstatPluginOptions> =
	BaseMinerstatPlugin<T>;
export function minerstat<const T extends MinerstatPluginOptions>(
	incomingOptions: MinerstatPluginOptions & T = {} as MinerstatPluginOptions &
		T,
): ExternalMinerstatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	const { DEFAULT, ...specificHandlers } = {
		...errorHandlers,
		...options.errorHandlers,
	};
	return {
		id: 'minerstat',
		authConfig: minerstatAuthConfig,
		schema: MinerstatSchema,
		options,
		hooks: options.hooks,
		endpoints: minerstatEndpointsNested,
		webhooks: {},
		endpointMeta: minerstatEndpointMeta,
		endpointSchemas: minerstatEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: { ...specificHandlers, DEFAULT },
		keyBuilder: async (ctx: MinerstatKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			const key = process.env.MINERSTAT_API_KEY;
			if (key?.trim()) return key;
			throw new AuthMissingError('minerstat', 'api_key');
		},
	} satisfies InternalMinerstatPlugin;
}
export * from './endpoints/types';
