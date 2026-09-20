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
import { Credits, Enrichment, LeadFinder } from './endpoints';
import type {
	BetterContactEndpointInputs,
	BetterContactEndpointOutputs,
} from './endpoints/types';
import {
	BetterContactEndpointInputSchemas,
	BetterContactEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BetterContactSchema } from './schema';

export type BetterContactPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBetterContactPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof betterContactEndpointsNested>;
};

export type BetterContactContext = CorsairPluginContext<
	typeof BetterContactSchema,
	BetterContactPluginOptions
>;

export type BetterContactKeyBuilderContext =
	KeyBuilderContext<BetterContactPluginOptions>;

export type BetterContactBoundEndpoints = BindEndpoints<
	typeof betterContactEndpointsNested
>;

type BetterContactEndpoint<K extends keyof BetterContactEndpointOutputs> =
	CorsairEndpoint<
		BetterContactContext,
		BetterContactEndpointInputs[K],
		BetterContactEndpointOutputs[K]
	>;

export type BetterContactEndpoints = {
	creditsGet: BetterContactEndpoint<'creditsGet'>;
	leadFinderCreate: BetterContactEndpoint<'leadFinderCreate'>;
	leadFinderGetResults: BetterContactEndpoint<'leadFinderGetResults'>;
	enrichmentEnrich: BetterContactEndpoint<'enrichmentEnrich'>;
	enrichmentGetResults: BetterContactEndpoint<'enrichmentGetResults'>;
};

const betterContactEndpointsNested = {
	credits: {
		get: Credits.get,
	},
	leadFinder: {
		create: LeadFinder.create,
		getResults: LeadFinder.getResults,
	},
	enrichment: {
		enrich: Enrichment.enrich,
		getResults: Enrichment.getResults,
	},
} as const;

export const betterContactEndpointSchemas = {
	'credits.get': {
		input: BetterContactEndpointInputSchemas.creditsGet,
		output: BetterContactEndpointOutputSchemas.creditsGet,
	},
	'leadFinder.create': {
		input: BetterContactEndpointInputSchemas.leadFinderCreate,
		output: BetterContactEndpointOutputSchemas.leadFinderCreate,
	},
	'leadFinder.getResults': {
		input: BetterContactEndpointInputSchemas.leadFinderGetResults,
		output: BetterContactEndpointOutputSchemas.leadFinderGetResults,
	},
	'enrichment.enrich': {
		input: BetterContactEndpointInputSchemas.enrichmentEnrich,
		output: BetterContactEndpointOutputSchemas.enrichmentEnrich,
	},
	'enrichment.getResults': {
		input: BetterContactEndpointInputSchemas.enrichmentGetResults,
		output: BetterContactEndpointOutputSchemas.enrichmentGetResults,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof betterContactEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const betterContactEndpointMeta = {
	'credits.get': {
		riskLevel: 'read',
		description: 'Check remaining API credits balance',
	},
	'leadFinder.create': {
		riskLevel: 'write',
		description:
			'Create a new Lead Finder search to discover leads based on criteria',
	},
	'leadFinder.getResults': {
		riskLevel: 'read',
		description: 'Retrieve results from a submitted Lead Finder search',
	},
	'enrichment.enrich': {
		riskLevel: 'write',
		description:
			'Submit lead enrichment request for work emails and phone numbers',
	},
	'enrichment.getResults': {
		riskLevel: 'read',
		description: 'Retrieve results for a submitted enrichment request',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof betterContactEndpointsNested
>;

export const betterContactAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBetterContactPlugin<T extends BetterContactPluginOptions> =
	CorsairPlugin<
		'bettercontact',
		typeof BetterContactSchema,
		typeof betterContactEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBetterContactPlugin =
	BaseBetterContactPlugin<BetterContactPluginOptions>;

export type ExternalBetterContactPlugin<T extends BetterContactPluginOptions> =
	BaseBetterContactPlugin<T>;

export function bettercontact<const T extends BetterContactPluginOptions>(
	incomingOptions: BetterContactPluginOptions &
		T = {} as BetterContactPluginOptions & T,
): ExternalBetterContactPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bettercontact',
		authConfig: betterContactAuthConfig,
		schema: BetterContactSchema,
		options: options,
		hooks: options.hooks,
		endpoints: betterContactEndpointsNested,
		webhooks: {},
		endpointMeta: betterContactEndpointMeta,
		endpointSchemas: betterContactEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BetterContactKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			const envKey = process.env.BETTERCONTACT_API_KEY;
			if (envKey) return envKey;

			throw new AuthMissingError('bettercontact', 'api_key');
		},
	} satisfies InternalBetterContactPlugin;
}

export type {
	BetterContactEndpointInputs,
	BetterContactEndpointOutputs,
	CreditsGetInput,
	CreditsGetResponse,
	EnrichmentEnrichInput,
	EnrichmentEnrichResponse,
	EnrichmentGetResultsInput,
	EnrichmentGetResultsResponse,
	LeadFinderCreateInput,
	LeadFinderCreateResponse,
	LeadFinderGetResultsInput,
	LeadFinderGetResultsResponse,
} from './endpoints/types';
