import type {
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
import * as Handlers from './endpoints/handlers';
import type {
	AmcardsEndpointInputs,
	AmcardsEndpointOutputs,
} from './endpoints/types';
import {
	AmcardsEndpointInputSchemas,
	AmcardsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmcardsSchema } from './schema';

export type AmcardsPluginOptions = {
	/** Authentication method. AMcards only supports API access tokens. */
	authType?: PickAuth<'api_key'>;
	/**
	 * AMcards API access token, sent as `Authorization: Token <token>`.
	 * When omitted the key is resolved from the account key manager.
	 */
	key?: string;
	hooks?: InternalAmcardsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof amcardsEndpointsNested>;
};

export type AmcardsContext = CorsairPluginContext<
	typeof AmcardsSchema,
	AmcardsPluginOptions
>;

export type AmcardsKeyBuilderContext = KeyBuilderContext<AmcardsPluginOptions>;

export type AmcardsBoundEndpoints = BindEndpoints<
	typeof amcardsEndpointsNested
>;

type AmcardsEndpoint<K extends keyof AmcardsEndpointOutputs> = CorsairEndpoint<
	AmcardsContext,
	AmcardsEndpointInputs[K],
	AmcardsEndpointOutputs[K]
>;

export type AmcardsEndpoints = {
	getApiSchema: AmcardsEndpoint<'getApiSchema'>;
	getCategorySchema: AmcardsEndpoint<'getCategorySchema'>;
	getCards: AmcardsEndpoint<'getCards'>;
	getContacts: AmcardsEndpoint<'getContacts'>;
	getCategory: AmcardsEndpoint<'getCategory'>;
	listCategories: AmcardsEndpoint<'listCategories'>;
	getGift: AmcardsEndpoint<'getGift'>;
	listGifts: AmcardsEndpoint<'listGifts'>;
	getPublicTemplate: AmcardsEndpoint<'getPublicTemplate'>;
	listPublicTemplates: AmcardsEndpoint<'listPublicTemplates'>;
};

const amcardsEndpointsNested = {
	schema: {
		getApi: Handlers.getApiSchema,
		getCategory: Handlers.getCategorySchema,
	},
	cards: {
		list: Handlers.getCards,
	},
	contacts: {
		list: Handlers.getContacts,
	},
	categories: {
		list: Handlers.listCategories,
		get: Handlers.getCategory,
	},
	gifts: {
		list: Handlers.listGifts,
		get: Handlers.getGift,
	},
	templates: {
		list: Handlers.listPublicTemplates,
		get: Handlers.getPublicTemplate,
	},
} as const;

export const amcardsEndpointSchemas = {
	'schema.getApi': {
		input: AmcardsEndpointInputSchemas.getApiSchema,
		output: AmcardsEndpointOutputSchemas.getApiSchema,
	},
	'schema.getCategory': {
		input: AmcardsEndpointInputSchemas.getCategorySchema,
		output: AmcardsEndpointOutputSchemas.getCategorySchema,
	},
	'cards.list': {
		input: AmcardsEndpointInputSchemas.getCards,
		output: AmcardsEndpointOutputSchemas.getCards,
	},
	'contacts.list': {
		input: AmcardsEndpointInputSchemas.getContacts,
		output: AmcardsEndpointOutputSchemas.getContacts,
	},
	'categories.list': {
		input: AmcardsEndpointInputSchemas.listCategories,
		output: AmcardsEndpointOutputSchemas.listCategories,
	},
	'categories.get': {
		input: AmcardsEndpointInputSchemas.getCategory,
		output: AmcardsEndpointOutputSchemas.getCategory,
	},
	'gifts.list': {
		input: AmcardsEndpointInputSchemas.listGifts,
		output: AmcardsEndpointOutputSchemas.listGifts,
	},
	'gifts.get': {
		input: AmcardsEndpointInputSchemas.getGift,
		output: AmcardsEndpointOutputSchemas.getGift,
	},
	'templates.list': {
		input: AmcardsEndpointInputSchemas.listPublicTemplates,
		output: AmcardsEndpointOutputSchemas.listPublicTemplates,
	},
	'templates.get': {
		input: AmcardsEndpointInputSchemas.getPublicTemplate,
		output: AmcardsEndpointOutputSchemas.getPublicTemplate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof amcardsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const amcardsEndpointMeta = {
	'schema.getApi': {
		riskLevel: 'read',
		description: 'Retrieve the AMcards API v1 schema (resource map)',
	},
	'schema.getCategory': {
		riskLevel: 'read',
		description: 'Retrieve the readonly Category resource schema',
	},
	'cards.list': {
		riskLevel: 'read',
		description: 'List cards for the authenticated account',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts, optionally filtered by name or email',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List card template categories ordered by priority',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get a card template category by id',
	},
	'gifts.list': {
		riskLevel: 'read',
		description: 'List available gifts',
	},
	'gifts.get': {
		riskLevel: 'read',
		description: 'Get a gift by id',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List public card templates',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a public card template by id',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof amcardsEndpointsNested>;

export const amcardsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmcardsPlugin<T extends AmcardsPluginOptions> = CorsairPlugin<
	'amcards',
	typeof AmcardsSchema,
	typeof amcardsEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAmcardsPlugin = BaseAmcardsPlugin<AmcardsPluginOptions>;

export type ExternalAmcardsPlugin<T extends AmcardsPluginOptions> =
	BaseAmcardsPlugin<T>;

export function amcards(
	incomingOptions: AmcardsPluginOptions = {},
): InternalAmcardsPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amcards',
		authConfig: amcardsAuthConfig,
		schema: AmcardsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: amcardsEndpointsNested,
		webhooks: {},
		endpointMeta: amcardsEndpointMeta,
		endpointSchemas: amcardsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmcardsKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('amcards', 'api_key');
			}
			if (options.key) return options.key;
			const res = await ctx.keys?.get_api_key();
			if (!res) {
				throw new AuthMissingError('amcards', 'api_key');
			}
			return res;
		},
	} satisfies InternalAmcardsPlugin;
}

export { AMCARDS_API_BASE, AmcardsAPIError } from './client';
export type {
	AmcardsEndpointInputs,
	AmcardsEndpointOutputs,
} from './endpoints/types';
export {
	AmcardsEndpointInputSchemas,
	AmcardsEndpointOutputSchemas,
} from './endpoints/types';
