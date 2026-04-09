import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { Profile, Summary } from './endpoints';
import type {
	OuraEndpointInputs,
	OuraEndpointOutputs,
} from './endpoints/types';
import {
	OuraEndpointInputSchemas,
	OuraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OuraSchema } from './schema';
import { SummaryWebhooks } from './webhooks';
import type {
	DailyActivityWebhookEvent,
	DailyReadinessWebhookEvent,
	DailySleepWebhookEvent,
	OuraWebhookOutputs,
} from './webhooks/types';

export type OuraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalOuraPlugin['hooks'];
	webhookHooks?: InternalOuraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Oura plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Oura endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof ouraEndpointsNested>;
};

export type OuraContext = CorsairPluginContext<
	typeof OuraSchema,
	OuraPluginOptions
>;

export type OuraKeyBuilderContext = KeyBuilderContext<OuraPluginOptions>;

export type OuraBoundEndpoints = BindEndpoints<typeof ouraEndpointsNested>;

type OuraEndpoint<K extends keyof OuraEndpointOutputs, Input> = CorsairEndpoint<
	OuraContext,
	Input,
	OuraEndpointOutputs[K]
>;

export type OuraEndpoints = {
	profileGet: OuraEndpoint<'profileGet', OuraEndpointInputs['profileGet']>;
	summaryGetActivity: OuraEndpoint<
		'summaryGetActivity',
		OuraEndpointInputs['summaryGetActivity']
	>;
	summaryGetReadiness: OuraEndpoint<
		'summaryGetReadiness',
		OuraEndpointInputs['summaryGetReadiness']
	>;
	summaryGetSleep: OuraEndpoint<
		'summaryGetSleep',
		OuraEndpointInputs['summaryGetSleep']
	>;
};

type OuraWebhook<K extends keyof OuraWebhookOutputs, TEvent> = CorsairWebhook<
	OuraContext,
	TEvent,
	OuraWebhookOutputs[K]
>;

export type OuraWebhooks = {
	dailyActivity: OuraWebhook<'dailyActivity', DailyActivityWebhookEvent>;
	dailyReadiness: OuraWebhook<'dailyReadiness', DailyReadinessWebhookEvent>;
	dailySleep: OuraWebhook<'dailySleep', DailySleepWebhookEvent>;
};

export type OuraBoundWebhooks = BindWebhooks<OuraWebhooks>;

const ouraEndpointsNested = {
	profile: {
		get: Profile.get,
	},
	summary: {
		getActivity: Summary.getActivity,
		getReadiness: Summary.getReadiness,
		getSleep: Summary.getSleep,
	},
} as const;

const ouraWebhooksNested = {
	summary: {
		dailyActivity: SummaryWebhooks.dailyActivity,
		dailyReadiness: SummaryWebhooks.dailyReadiness,
		dailySleep: SummaryWebhooks.dailySleep,
	},
} as const;

export const ouraEndpointSchemas = {
	'profile.get': {
		input: OuraEndpointInputSchemas.profileGet,
		output: OuraEndpointOutputSchemas.profileGet,
	},
	'summary.getActivity': {
		input: OuraEndpointInputSchemas.summaryGetActivity,
		output: OuraEndpointOutputSchemas.summaryGetActivity,
	},
	'summary.getReadiness': {
		input: OuraEndpointInputSchemas.summaryGetReadiness,
		output: OuraEndpointOutputSchemas.summaryGetReadiness,
	},
	'summary.getSleep': {
		input: OuraEndpointInputSchemas.summaryGetSleep,
		output: OuraEndpointOutputSchemas.summaryGetSleep,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ouraEndpointMeta = {
	'profile.get': {
		riskLevel: 'read',
		description: 'Get the authenticated user Oura profile and personal info',
	},
	'summary.getActivity': {
		riskLevel: 'read',
		description: 'Get daily activity summary data for a date range',
	},
	'summary.getReadiness': {
		riskLevel: 'read',
		description: 'Get daily readiness summary data for a date range',
	},
	'summary.getSleep': {
		riskLevel: 'read',
		description: 'Get daily sleep summary data for a date range',
	},
} satisfies RequiredPluginEndpointMeta<typeof ouraEndpointsNested>;

export const ouraAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOuraPlugin<T extends OuraPluginOptions> = CorsairPlugin<
	'oura',
	typeof OuraSchema,
	typeof ouraEndpointsNested,
	typeof ouraWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOuraPlugin = BaseOuraPlugin<OuraPluginOptions>;

export type ExternalOuraPlugin<T extends OuraPluginOptions> = BaseOuraPlugin<T>;

export function oura<const T extends OuraPluginOptions>(
	incomingOptions: OuraPluginOptions & T = {} as OuraPluginOptions & T,
): ExternalOuraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'oura',
		schema: OuraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ouraEndpointsNested,
		webhooks: ouraWebhooksNested,
		endpointMeta: ouraEndpointMeta,
		endpointSchemas: ouraEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-oura-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OuraKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalOuraPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DailyActivityWebhookEvent,
	DailyReadinessWebhookEvent,
	DailySleepWebhookEvent,
	OuraWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	OuraEndpointInputs,
	OuraEndpointOutputs,
	ProfileGetInput,
	ProfileGetResponse,
	SummaryGetActivityInput,
	SummaryGetActivityResponse,
	SummaryGetReadinessInput,
	SummaryGetReadinessResponse,
	SummaryGetSleepInput,
	SummaryGetSleepResponse,
} from './endpoints/types';
