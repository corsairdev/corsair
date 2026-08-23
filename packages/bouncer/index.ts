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
import { Account, Email, Toxicity } from './endpoints';
import type {
	BouncerEndpointInputs,
	BouncerEndpointOutputs,
} from './endpoints/types';
import {
	BouncerEndpointInputSchemas,
	BouncerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BouncerSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type BouncerPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Direct API key for Bouncer (bypasses key manager). */
	key?: string;
	/** Optional lifecycle hooks for endpoints */
	hooks?: InternalBouncerPlugin['hooks'];
	/** Optional custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for Bouncer endpoints */
	permissions?: PluginPermissionsConfig<typeof bouncerEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type BouncerContext = CorsairPluginContext<
	typeof BouncerSchema,
	BouncerPluginOptions,
	undefined,
	typeof bouncerAuthConfig
>;

export type BouncerKeyBuilderContext = KeyBuilderContext<
	BouncerPluginOptions,
	typeof bouncerAuthConfig
>;

export type BouncerBoundEndpoints = BindEndpoints<
	typeof bouncerEndpointsNested
>;

type BouncerEndpoint<K extends keyof BouncerEndpointOutputs> = CorsairEndpoint<
	BouncerContext,
	BouncerEndpointInputs[K],
	BouncerEndpointOutputs[K]
>;

export type BouncerEndpoints = {
	verifyEmail: BouncerEndpoint<'verifyEmail'>;
	verifyDomain: BouncerEndpoint<'verifyDomain'>;
	createBatchRequest: BouncerEndpoint<'createBatchRequest'>;
	getBatchResults: BouncerEndpoint<'getBatchResults'>;
	finishBatch: BouncerEndpoint<'finishBatch'>;
	deleteBatchRequest: BouncerEndpoint<'deleteBatchRequest'>;
	createToxicityListJob: BouncerEndpoint<'createToxicityListJob'>;
	checkToxicityListJobStatus: BouncerEndpoint<'checkToxicityListJobStatus'>;
	deleteToxicityListJob: BouncerEndpoint<'deleteToxicityListJob'>;
	getCredits: BouncerEndpoint<'getCredits'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const bouncerEndpointsNested = {
	email: {
		verifyEmail: Email.verifyEmail,
		verifyDomain: Email.verifyDomain,
		createBatchRequest: Email.createBatchRequest,
		getBatchResults: Email.getBatchResults,
		finishBatch: Email.finishBatch,
		deleteBatchRequest: Email.deleteBatchRequest,
	},
	toxicity: {
		createToxicityListJob: Toxicity.createToxicityListJob,
		checkToxicityListJobStatus: Toxicity.checkToxicityListJobStatus,
		deleteToxicityListJob: Toxicity.deleteToxicityListJob,
	},
	account: {
		getCredits: Account.getCredits,
	},
} as const;

const bouncerWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const bouncerEndpointSchemas = {
	'email.verifyEmail': {
		input: BouncerEndpointInputSchemas.verifyEmail,
		output: BouncerEndpointOutputSchemas.verifyEmail,
	},
	'email.verifyDomain': {
		input: BouncerEndpointInputSchemas.verifyDomain,
		output: BouncerEndpointOutputSchemas.verifyDomain,
	},
	'email.createBatchRequest': {
		input: BouncerEndpointInputSchemas.createBatchRequest,
		output: BouncerEndpointOutputSchemas.createBatchRequest,
	},
	'email.getBatchResults': {
		input: BouncerEndpointInputSchemas.getBatchResults,
		output: BouncerEndpointOutputSchemas.getBatchResults,
	},
	'email.finishBatch': {
		input: BouncerEndpointInputSchemas.finishBatch,
		output: BouncerEndpointOutputSchemas.finishBatch,
	},
	'email.deleteBatchRequest': {
		input: BouncerEndpointInputSchemas.deleteBatchRequest,
		output: BouncerEndpointOutputSchemas.deleteBatchRequest,
	},
	'toxicity.createToxicityListJob': {
		input: BouncerEndpointInputSchemas.createToxicityListJob,
		output: BouncerEndpointOutputSchemas.createToxicityListJob,
	},
	'toxicity.checkToxicityListJobStatus': {
		input: BouncerEndpointInputSchemas.checkToxicityListJobStatus,
		output: BouncerEndpointOutputSchemas.checkToxicityListJobStatus,
	},
	'toxicity.deleteToxicityListJob': {
		input: BouncerEndpointInputSchemas.deleteToxicityListJob,
		output: BouncerEndpointOutputSchemas.deleteToxicityListJob,
	},
	'account.getCredits': {
		input: BouncerEndpointInputSchemas.getCredits,
		output: BouncerEndpointOutputSchemas.getCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bouncerEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta
// ─────────────────────────────────────────────────────────────────────────────

const bouncerEndpointMeta = {
	'email.verifyEmail': {
		riskLevel: 'read',
		description: 'Verify a single email address in real-time',
	},
	'email.verifyDomain': {
		riskLevel: 'read',
		description: 'Verify domain MX records and catch-all setup',
	},
	'email.createBatchRequest': {
		riskLevel: 'write',
		description: 'Initiate an asynchronous batch email verification request',
	},
	'email.getBatchResults': {
		riskLevel: 'read',
		description: 'Retrieve the results of a batch email verification process',
	},
	'email.finishBatch': {
		riskLevel: 'write',
		description: 'Mark a batch verification process as finished early',
	},
	'email.deleteBatchRequest': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a batch email verification request and its data',
	},
	'toxicity.createToxicityListJob': {
		riskLevel: 'write',
		description: 'Create a toxicity analysis job for a list of email addresses',
	},
	'toxicity.checkToxicityListJobStatus': {
		riskLevel: 'read',
		description: 'Check the status and results of a toxicity list job',
	},
	'toxicity.deleteToxicityListJob': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specific toxicity list job by ID',
	},
	'account.getCredits': {
		riskLevel: 'read',
		description: 'Retrieve current credit balance for the Bouncer account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bouncerEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const bouncerAuthConfig = {
	api_key: {
		account: ['api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseBouncerPlugin<T extends BouncerPluginOptions> = CorsairPlugin<
	'bouncer',
	typeof BouncerSchema,
	typeof bouncerEndpointsNested,
	typeof bouncerWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof bouncerAuthConfig
>;

export type InternalBouncerPlugin = BaseBouncerPlugin<BouncerPluginOptions>;

export type ExternalBouncerPlugin<T extends BouncerPluginOptions> =
	BaseBouncerPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function bouncer<const T extends BouncerPluginOptions>(
	incomingOptions: BouncerPluginOptions & T = {} as BouncerPluginOptions & T,
): ExternalBouncerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bouncer',
		authConfig: bouncerAuthConfig,
		schema: BouncerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: bouncerEndpointsNested,
		webhooks: bouncerWebhooksNested,
		endpointMeta: bouncerEndpointMeta,
		endpointSchemas: bouncerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BouncerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBouncerPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BatchRecipient,
	BouncerEndpointInputs,
	BouncerEndpointOutputs,
	CheckToxicityListJobStatusInput,
	CheckToxicityListJobStatusResponse,
	CreateBatchRequestInput,
	CreateBatchRequestResponse,
	CreateToxicityListJobInput,
	CreateToxicityListJobResponse,
	DeleteBatchRequestInput,
	DeleteBatchRequestResponse,
	DeleteToxicityListJobInput,
	DeleteToxicityListJobResponse,
	FinishBatchInput,
	FinishBatchResponse,
	GetBatchResultsInput,
	GetBatchResultsResponse,
	GetCreditsInput,
	GetCreditsResponse,
	VerifyDomainInput,
	VerifyDomainResponse,
	VerifyEmailInput,
	VerifyEmailResponse,
} from './endpoints/types';

export {
	BatchRecipientSchema,
	BouncerEndpointInputSchemas,
	BouncerEndpointOutputSchemas,
	CheckToxicityListJobStatusInputSchema,
	CheckToxicityListJobStatusResponseSchema,
	CreateBatchRequestInputSchema,
	CreateBatchRequestResponseSchema,
	CreateToxicityListJobInputSchema,
	CreateToxicityListJobResponseSchema,
	DeleteBatchRequestInputSchema,
	DeleteBatchRequestResponseSchema,
	DeleteToxicityListJobInputSchema,
	DeleteToxicityListJobResponseSchema,
	FinishBatchInputSchema,
	FinishBatchResponseSchema,
	GetBatchResultsInputSchema,
	GetBatchResultsResponseSchema,
	GetCreditsInputSchema,
	GetCreditsResponseSchema,
	VerifyDomainInputSchema,
	VerifyDomainResponseSchema,
	VerifyEmailInputSchema,
	VerifyEmailResponseSchema,
} from './endpoints/types';
