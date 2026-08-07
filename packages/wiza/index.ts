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
import { Credits, IndividualReveals, Lists, Prospects } from './endpoints';
import type {
	WizaEndpointInputs,
	WizaEndpointOutputs,
} from './endpoints/types';
import {
	WizaEndpointInputSchemas,
	WizaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WizaSchema } from './schema';

export type WizaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWizaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wizaEndpointsNested>;
};

export type WizaContext = CorsairPluginContext<
	typeof WizaSchema,
	WizaPluginOptions
>;

export type WizaKeyBuilderContext = KeyBuilderContext<WizaPluginOptions>;

export type WizaBoundEndpoints = BindEndpoints<typeof wizaEndpointsNested>;

type WizaEndpoint<K extends keyof WizaEndpointOutputs> = CorsairEndpoint<
	WizaContext,
	WizaEndpointInputs[K],
	WizaEndpointOutputs[K]
>;

export type WizaEndpoints = {
	creditsGet: WizaEndpoint<'creditsGet'>;
	individualRevealsStart: WizaEndpoint<'individualRevealsStart'>;
	individualRevealsGet: WizaEndpoint<'individualRevealsGet'>;
	listsGet: WizaEndpoint<'listsGet'>;
	prospectsSearch: WizaEndpoint<'prospectsSearch'>;
};

const wizaEndpointsNested = {
	credits: {
		get: Credits.get,
	},
	individualReveals: {
		start: IndividualReveals.start,
		get: IndividualReveals.get,
	},
	lists: {
		get: Lists.get,
	},
	prospects: {
		search: Prospects.search,
	},
} as const;

export const wizaEndpointSchemas = {
	'credits.get': {
		input: WizaEndpointInputSchemas.creditsGet,
		output: WizaEndpointOutputSchemas.creditsGet,
	},
	'individualReveals.start': {
		input: WizaEndpointInputSchemas.individualRevealsStart,
		output: WizaEndpointOutputSchemas.individualRevealsStart,
	},
	'individualReveals.get': {
		input: WizaEndpointInputSchemas.individualRevealsGet,
		output: WizaEndpointOutputSchemas.individualRevealsGet,
	},
	'lists.get': {
		input: WizaEndpointInputSchemas.listsGet,
		output: WizaEndpointOutputSchemas.listsGet,
	},
	'prospects.search': {
		input: WizaEndpointInputSchemas.prospectsSearch,
		output: WizaEndpointOutputSchemas.prospectsSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof wizaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const wizaEndpointMeta = {
	'credits.get': {
		riskLevel: 'read',
		description:
			'Get the number of remaining API credits (emails, phones, exports) in your Wiza account',
	},
	'individualReveals.start': {
		riskLevel: 'write',
		description:
			'Start an individual reveal to enrich a single contact in real time (consumes credits)',
	},
	'individualReveals.get': {
		riskLevel: 'read',
		description:
			'Get the status and enriched results of an individual reveal by ID',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Get the processing status and details of a list by ID',
	},
	'prospects.search': {
		riskLevel: 'read',
		description:
			'Search for prospects matching filters (job title, location, company, industry)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wizaEndpointsNested>;

export const wizaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWizaPlugin<T extends WizaPluginOptions> = CorsairPlugin<
	'wiza',
	typeof WizaSchema,
	typeof wizaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalWizaPlugin = BaseWizaPlugin<WizaPluginOptions>;

export type ExternalWizaPlugin<T extends WizaPluginOptions> = BaseWizaPlugin<T>;

export function wiza<const T extends WizaPluginOptions>(
	incomingOptions: WizaPluginOptions & T = {} as WizaPluginOptions & T,
): ExternalWizaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wiza',
		authConfig: wizaAuthConfig,
		schema: WizaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: wizaEndpointsNested,
		webhooks: {},
		endpointMeta: wizaEndpointMeta,
		endpointSchemas: wizaEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WizaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWizaPlugin;
}

export type {
	GetCreditsInput,
	GetCreditsResponse,
	GetIndividualRevealInput,
	GetIndividualRevealResponse,
	GetListInput,
	GetListResponse,
	ProspectSearchInput,
	ProspectSearchResponse,
	StartIndividualRevealInput,
	StartIndividualRevealResponse,
	WizaEndpointInputs,
	WizaEndpointOutputs,
} from './endpoints/types';
