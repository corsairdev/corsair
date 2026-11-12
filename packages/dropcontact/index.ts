import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	credits,
	enrich,
	getWebhook,
	removeWebhook,
	results,
	setWebhook,
} from './endpoints';
import type {
	DropcontactEndpointInputs,
	DropcontactEndpointOutputs,
} from './endpoints/types';
import {
	DropcontactEndpointInputSchemas,
	DropcontactEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DropcontactSchema } from './schema';

export type DropcontactPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDropcontactPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dropcontactEndpointsNested>;
};

export type DropcontactContext = CorsairPluginContext<
	typeof DropcontactSchema,
	DropcontactPluginOptions
>;

export type DropcontactKeyBuilderContext =
	KeyBuilderContext<DropcontactPluginOptions>;

export type DropcontactBoundEndpoints = BindEndpoints<
	typeof dropcontactEndpointsNested
>;

type DropcontactEndpoint<K extends keyof DropcontactEndpointOutputs> =
	CorsairEndpoint<
		DropcontactContext,
		DropcontactEndpointInputs[K],
		DropcontactEndpointOutputs[K]
	>;

export type DropcontactEndpoints = {
	enrichmentEnrich: DropcontactEndpoint<'enrichmentEnrich'>;
	enrichmentResults: DropcontactEndpoint<'enrichmentResults'>;
	accountCredits: DropcontactEndpoint<'accountCredits'>;
	webhookGet: DropcontactEndpoint<'webhookGet'>;
	webhookSet: DropcontactEndpoint<'webhookSet'>;
	webhookRemove: DropcontactEndpoint<'webhookRemove'>;
};

const dropcontactEndpointsNested = {
	enrichment: {
		enrich,
		results,
	},
	account: {
		credits,
	},
	webhook: {
		get: getWebhook,
		set: setWebhook,
		remove: removeWebhook,
	},
} as const;

export const dropcontactEndpointSchemas = {
	'enrichment.enrich': {
		input: DropcontactEndpointInputSchemas.enrichmentEnrich,
		output: DropcontactEndpointOutputSchemas.enrichmentEnrich,
	},
	'enrichment.results': {
		input: DropcontactEndpointInputSchemas.enrichmentResults,
		output: DropcontactEndpointOutputSchemas.enrichmentResults,
	},
	'account.credits': {
		input: DropcontactEndpointInputSchemas.accountCredits,
		output: DropcontactEndpointOutputSchemas.accountCredits,
	},
	'webhook.get': {
		input: DropcontactEndpointInputSchemas.webhookGet,
		output: DropcontactEndpointOutputSchemas.webhookGet,
	},
	'webhook.set': {
		input: DropcontactEndpointInputSchemas.webhookSet,
		output: DropcontactEndpointOutputSchemas.webhookSet,
	},
	'webhook.remove': {
		input: DropcontactEndpointInputSchemas.webhookRemove,
		output: DropcontactEndpointOutputSchemas.webhookRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dropcontactEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const dropcontactEndpointMeta = {
	'enrichment.enrich': {
		riskLevel: 'write',
		// Enrichment spends a credit per contact and is not reversible: there is no
		// cancel operation and no refund call.
		description:
			'Submit up to 250 contacts for email finding, verification and company enrichment; spends one credit per contact and returns a request_id, not the results',
		job: {
			idPath: 'request_id',
			status: {
				op: 'enrichment.results',
				idArg: 'request_id',
				// A result is ready when success is true and no record is still
				// in progress. The endpoint sets `status` only under force_results.
				statusPath: 'status',
				done: ['ready'],
				failed: ['failed'],
			},
		},
	},
	'enrichment.results': {
		riskLevel: 'read',
		description:
			'Read the enriched contacts for a request_id: qualified emails, LinkedIn, phone and company data; reports success false with a reason while the batch is still processing',
	},
	'account.credits': {
		riskLevel: 'read',
		description:
			'Read the enrichment credits left on the account; costs no credits',
	},
	'webhook.get': {
		riskLevel: 'read',
		description:
			'Read the default webhook callback URL used by enrichment requests that carry no custom callback of their own',
	},
	'webhook.set': {
		riskLevel: 'write',
		description:
			'Set the account default webhook callback URL, replacing any previous one; enrichment requests without their own callback POST their results there',
	},
	'webhook.remove': {
		riskLevel: 'destructive',
		description:
			'Delete the account default webhook callback URL; afterwards only requests carrying their own custom_callback_url notify anything',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dropcontactEndpointsNested
>;

export type BaseDropcontactPlugin<T extends DropcontactPluginOptions> =
	CorsairPlugin<
		'dropcontact',
		typeof DropcontactSchema,
		typeof dropcontactEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalDropcontactPlugin =
	BaseDropcontactPlugin<DropcontactPluginOptions>;

export type ExternalDropcontactPlugin<T extends DropcontactPluginOptions> =
	BaseDropcontactPlugin<T>;

export function dropcontact<const T extends DropcontactPluginOptions>(
	incomingOptions: DropcontactPluginOptions &
		T = {} as DropcontactPluginOptions & T,
): ExternalDropcontactPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dropcontact',
		schema: DropcontactSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dropcontactEndpointsNested,
		// Dropcontact signs nothing: a delivery is a bare POST with no signature
		// header, so there is no way to tell a real one from a forged one. The
		// plugin therefore exposes no webhook route, and results are read
		// through `enrichment.results`.
		webhooks: {},
		endpointMeta: dropcontactEndpointMeta,
		endpointSchemas: dropcontactEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DropcontactKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('dropcontact', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDropcontactPlugin;
}

export { DropcontactAPIError } from './client';

export type {
	CreditsInput,
	CreditsResponse,
	DropcontactEndpointInputs,
	DropcontactEndpointOutputs,
	DropcontactInputRecord,
	EmailResult,
	EnrichedRecord,
	EnrichInput,
	EnrichResponse,
	PostRecord,
	RecordErrors,
	RecordWarnings,
	ResultsInput,
	ResultsResponse,
	WebhookGetInput,
	WebhookGetResponse,
	WebhookRemoveInput,
	WebhookRemoveResponse,
	WebhookSetInput,
	WebhookSetResponse,
} from './endpoints/types';
