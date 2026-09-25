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
import { Accounts, Gifts, NonProfits } from './endpoints';
import type {
	DaffyEndpointInputs,
	DaffyEndpointOutputs,
} from './endpoints/types';
import {
	DaffyEndpointInputSchemas,
	DaffyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DaffySchema } from './schema';

export type DaffyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDaffyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof daffyEndpointsNested>;
};
export type DaffyContext = CorsairPluginContext<
	typeof DaffySchema,
	DaffyPluginOptions
>;
export type DaffyKeyBuilderContext = KeyBuilderContext<DaffyPluginOptions>;
export type DaffyBoundEndpoints = BindEndpoints<typeof daffyEndpointsNested>;
type DaffyEndpoint<K extends keyof DaffyEndpointOutputs> = CorsairEndpoint<
	DaffyContext,
	DaffyEndpointInputs[K],
	DaffyEndpointOutputs[K]
>;
export type DaffyEndpoints = {
	createGift: DaffyEndpoint<'createGift'>;
	getBalance: DaffyEndpoint<'getBalance'>;
	getContributions: DaffyEndpoint<'getContributions'>;
	getDonations: DaffyEndpoint<'getDonations'>;
	getGiftByCode: DaffyEndpoint<'getGiftByCode'>;
	getGifts: DaffyEndpoint<'getGifts'>;
	getNonProfitByEin2: DaffyEndpoint<'getNonProfitByEin2'>;
	getUserCauses: DaffyEndpoint<'getUserCauses'>;
	getUserDonations: DaffyEndpoint<'getUserDonations'>;
	getUserProfile: DaffyEndpoint<'getUserProfile'>;
	getUserByUsername: DaffyEndpoint<'getUserByUsername'>;
	searchNonProfits: DaffyEndpoint<'searchNonProfits'>;
};

const daffyEndpointsNested = {
	accounts: {
		getBalance: Accounts.getBalance,
		getContributions: Accounts.getContributions,
		getDonations: Accounts.getDonations,
		getUserCauses: Accounts.getUserCauses,
		getUserDonations: Accounts.getUserDonations,
		getUserProfile: Accounts.getUserProfile,
		getUserByUsername: Accounts.getUserByUsername,
	},
	gifts: { create: Gifts.create, getByCode: Gifts.getByCode, list: Gifts.list },
	nonProfits: { getByEin: NonProfits.getByEin, search: NonProfits.search },
} as const;

export const daffyEndpointSchemas = {
	'accounts.getBalance': {
		input: DaffyEndpointInputSchemas.getBalance,
		output: DaffyEndpointOutputSchemas.getBalance,
	},
	'accounts.getContributions': {
		input: DaffyEndpointInputSchemas.getContributions,
		output: DaffyEndpointOutputSchemas.getContributions,
	},
	'accounts.getDonations': {
		input: DaffyEndpointInputSchemas.getDonations,
		output: DaffyEndpointOutputSchemas.getDonations,
	},
	'accounts.getUserCauses': {
		input: DaffyEndpointInputSchemas.getUserCauses,
		output: DaffyEndpointOutputSchemas.getUserCauses,
	},
	'accounts.getUserDonations': {
		input: DaffyEndpointInputSchemas.getUserDonations,
		output: DaffyEndpointOutputSchemas.getUserDonations,
	},
	'accounts.getUserProfile': {
		input: DaffyEndpointInputSchemas.getUserProfile,
		output: DaffyEndpointOutputSchemas.getUserProfile,
	},
	'accounts.getUserByUsername': {
		input: DaffyEndpointInputSchemas.getUserByUsername,
		output: DaffyEndpointOutputSchemas.getUserByUsername,
	},
	'gifts.create': {
		input: DaffyEndpointInputSchemas.createGift,
		output: DaffyEndpointOutputSchemas.createGift,
	},
	'gifts.getByCode': {
		input: DaffyEndpointInputSchemas.getGiftByCode,
		output: DaffyEndpointOutputSchemas.getGiftByCode,
	},
	'gifts.list': {
		input: DaffyEndpointInputSchemas.getGifts,
		output: DaffyEndpointOutputSchemas.getGifts,
	},
	'nonProfits.getByEin': {
		input: DaffyEndpointInputSchemas.getNonProfitByEin2,
		output: DaffyEndpointOutputSchemas.getNonProfitByEin2,
	},
	'nonProfits.search': {
		input: DaffyEndpointInputSchemas.searchNonProfits,
		output: DaffyEndpointOutputSchemas.searchNonProfits,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof daffyEndpointsNested>;

const daffyEndpointMeta = {
	'accounts.getBalance': {
		riskLevel: 'read',
		description: "Retrieve the authenticated user's fund balance.",
	},
	'accounts.getContributions': {
		riskLevel: 'read',
		description: 'List contributions made to the authenticated fund.',
	},
	'accounts.getDonations': {
		riskLevel: 'read',
		description: 'List donations made by the authenticated user.',
	},
	'accounts.getUserCauses': {
		riskLevel: 'read',
		description: "Retrieve a user's supported charitable causes.",
	},
	'accounts.getUserDonations': {
		riskLevel: 'read',
		description: "Retrieve a user's public donations.",
	},
	'accounts.getUserProfile': {
		riskLevel: 'read',
		description: "Retrieve the authenticated user's profile.",
	},
	'accounts.getUserByUsername': {
		riskLevel: 'read',
		description: 'Retrieve a public user profile by username.',
	},
	'gifts.create': {
		riskLevel: 'write',
		description: 'Create a Daffy charitable gift for a beneficiary.',
	},
	'gifts.getByCode': {
		riskLevel: 'read',
		description: 'Retrieve a gift by its unique code.',
	},
	'gifts.list': {
		riskLevel: 'read',
		description: 'List gifts associated with the authenticated user.',
	},
	'nonProfits.getByEin': {
		riskLevel: 'read',
		description: 'Retrieve a nonprofit organization by EIN.',
	},
	'nonProfits.search': {
		riskLevel: 'read',
		description: 'Search nonprofit organizations by cause or text.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof daffyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const daffyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseDaffyPlugin<T extends DaffyPluginOptions> = CorsairPlugin<
	'daffy',
	typeof DaffySchema,
	typeof daffyEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof daffyAuthConfig
>;
export type InternalDaffyPlugin = BaseDaffyPlugin<DaffyPluginOptions>;
export type ExternalDaffyPlugin<T extends DaffyPluginOptions> =
	BaseDaffyPlugin<T>;

export function daffy<const T extends DaffyPluginOptions>(
	incomingOptions: DaffyPluginOptions & T = {} as DaffyPluginOptions & T,
): ExternalDaffyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'daffy',
		schema: DaffySchema,
		options,
		hooks: options.hooks,
		endpoints: daffyEndpointsNested,
		webhooks: {},
		endpointMeta: daffyEndpointMeta,
		endpointSchemas: daffyEndpointSchemas,
		authConfig: daffyAuthConfig,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DaffyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('daffy', 'api_key');
		},
	} satisfies InternalDaffyPlugin;
}

export type {
	DaffyEndpointInputs,
	DaffyEndpointOutputs,
} from './endpoints/types';
export {
	DaffyEndpointInputSchemas,
	DaffyEndpointOutputSchemas,
} from './endpoints/types';
export { DaffySchema } from './schema';
