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
import { Airtable, Deals, Iban, Trello } from './endpoints';
import type {
	ApiLabzEndpointInputs,
	ApiLabzEndpointOutputs,
} from './endpoints/types';
import {
	ApiLabzEndpointInputSchemas,
	ApiLabzEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApiLabzSchema } from './schema';

export type ApiLabzPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApiLabzPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apiLabzEndpointsNested>;
};

export type ApiLabzContext = CorsairPluginContext<
	typeof ApiLabzSchema,
	ApiLabzPluginOptions
>;

export type ApiLabzKeyBuilderContext = KeyBuilderContext<ApiLabzPluginOptions>;

export type ApiLabzBoundEndpoints = BindEndpoints<
	typeof apiLabzEndpointsNested
>;

type ApiLabzEndpoint<K extends keyof ApiLabzEndpointOutputs> = CorsairEndpoint<
	ApiLabzContext,
	ApiLabzEndpointInputs[K],
	ApiLabzEndpointOutputs[K]
>;

export type ApiLabzEndpoints = {
	dealsIntegrate: ApiLabzEndpoint<'dealsIntegrate'>;
	airtableListTables: ApiLabzEndpoint<'airtableListTables'>;
	trelloAiSearchEngine: ApiLabzEndpoint<'trelloAiSearchEngine'>;
	ibanValidate: ApiLabzEndpoint<'ibanValidate'>;
};

const apiLabzEndpointsNested = {
	deals: {
		integrate: Deals.integrate,
	},
	airtable: {
		listTables: Airtable.listTables,
	},
	trello: {
		aiSearchEngine: Trello.aiSearchEngine,
	},
	iban: {
		validate: Iban.validate,
	},
} as const;

const apiLabzWebhooksNested = {} as const;

export const apiLabzEndpointSchemas = {
	'deals.integrate': {
		input: ApiLabzEndpointInputSchemas.dealsIntegrate,
		output: ApiLabzEndpointOutputSchemas.dealsIntegrate,
	},
	'airtable.listTables': {
		input: ApiLabzEndpointInputSchemas.airtableListTables,
		output: ApiLabzEndpointOutputSchemas.airtableListTables,
	},
	'trello.aiSearchEngine': {
		input: ApiLabzEndpointInputSchemas.trelloAiSearchEngine,
		output: ApiLabzEndpointOutputSchemas.trelloAiSearchEngine,
	},
	'iban.validate': {
		input: ApiLabzEndpointInputSchemas.ibanValidate,
		output: ApiLabzEndpointOutputSchemas.ibanValidate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apiLabzEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apiLabzEndpointMeta = {
	'deals.integrate': {
		riskLevel: 'write',
		description: 'Integrate a deal into API Labz',
	},
	'airtable.listTables': {
		riskLevel: 'read',
		description: 'List Airtable tables for a base',
	},
	'trello.aiSearchEngine': {
		riskLevel: 'read',
		description: 'Run AI search across Trello data',
	},
	'iban.validate': {
		riskLevel: 'read',
		description: 'Validate an IBAN',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apiLabzEndpointsNested>;

export const apiLabzAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseApiLabzPlugin<T extends ApiLabzPluginOptions> = CorsairPlugin<
	'apilabz',
	typeof ApiLabzSchema,
	typeof apiLabzEndpointsNested,
	typeof apiLabzWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApiLabzPlugin = BaseApiLabzPlugin<ApiLabzPluginOptions>;

export type ExternalApiLabzPlugin<T extends ApiLabzPluginOptions> =
	BaseApiLabzPlugin<T>;

export function apilabz<const T extends ApiLabzPluginOptions>(
	incomingOptions: ApiLabzPluginOptions & T = {} as ApiLabzPluginOptions & T,
): ExternalApiLabzPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apilabz',
		authConfig: apiLabzAuthConfig,
		schema: ApiLabzSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: apiLabzEndpointsNested,
		webhooks: apiLabzWebhooksNested,
		endpointMeta: apiLabzEndpointMeta,
		endpointSchemas: apiLabzEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApiLabzKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('apilabz', 'api_key');
				}
				return apiKey;
			}

			throw new AuthMissingError('apilabz', 'api_key');
		},
	} satisfies InternalApiLabzPlugin;
}

export type {
	AirtableListTablesInput,
	ApiLabzEndpointInputs,
	ApiLabzEndpointOutputs,
	ApiLabzHubResponse,
	DealsIntegrateInput,
	IbanValidateInput,
	IbanValidateOutput,
	TrelloAiSearchEngineInput,
} from './endpoints/types';
