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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Files, Models, Queue, Requests, Usage } from './endpoints';
import type { FalEndpointInputs, FalEndpointOutputs } from './endpoints/types';
import {
	FalEndpointInputSchemas,
	FalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FalSchema } from './schema';
import { RequestWebhooks } from './webhooks';
import { matchFalTenantWebhook } from './webhooks/tenant-matcher';
import type {
	FalWebhookOutputs,
	RequestCompletedEvent,
} from './webhooks/types';
import { isFalWebhook, RequestCompletedEventSchema } from './webhooks/types';

export type FalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A fal API key (fal.ai/dashboard/keys). Overrides the stored key. */
	key?: string;
	hooks?: InternalFalPlugin['hooks'];
	webhookHooks?: InternalFalPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof falEndpointsNested>;
};

export type FalContext = CorsairPluginContext<
	typeof FalSchema,
	FalPluginOptions
>;

export type FalKeyBuilderContext = KeyBuilderContext<FalPluginOptions>;

export type FalBoundEndpoints = BindEndpoints<typeof falEndpointsNested>;

type FalEndpoint<K extends keyof FalEndpointOutputs> = CorsairEndpoint<
	FalContext,
	FalEndpointInputs[K],
	FalEndpointOutputs[K]
>;

export type FalEndpoints = {
	queueSubmit: FalEndpoint<'queueSubmit'>;
	queueStatus: FalEndpoint<'queueStatus'>;
	queueResult: FalEndpoint<'queueResult'>;
	queueCancel: FalEndpoint<'queueCancel'>;
	modelsRun: FalEndpoint<'modelsRun'>;
	modelsSearch: FalEndpoint<'modelsSearch'>;
	modelsPricing: FalEndpoint<'modelsPricing'>;
	modelsEstimateCost: FalEndpoint<'modelsEstimateCost'>;
	requestsList: FalEndpoint<'requestsList'>;
	requestsDeletePayloads: FalEndpoint<'requestsDeletePayloads'>;
	usageGet: FalEndpoint<'usageGet'>;
	usageBillingEvents: FalEndpoint<'usageBillingEvents'>;
	accountBilling: FalEndpoint<'accountBilling'>;
	filesUpload: FalEndpoint<'filesUpload'>;
};

type FalWebhook<K extends keyof FalWebhookOutputs, TEvent> = CorsairWebhook<
	FalContext,
	TEvent,
	FalWebhookOutputs[K]
>;

export type FalWebhooks = {
	requestCompleted: FalWebhook<'requestCompleted', RequestCompletedEvent>;
};

export type FalBoundWebhooks = BindWebhooks<typeof falWebhooksNested>;

const falEndpointsNested = {
	queue: {
		submit: Queue.submit,
		status: Queue.status,
		result: Queue.result,
		cancel: Queue.cancel,
	},
	models: {
		run: Models.run,
		search: Models.search,
		pricing: Models.pricing,
		estimateCost: Models.estimateCost,
	},
	requests: {
		list: Requests.list,
		deletePayloads: Requests.deletePayloads,
	},
	usage: {
		get: Usage.get,
		billingEvents: Usage.billingEvents,
	},
	account: {
		billing: Account.billing,
	},
	files: {
		upload: Files.upload,
	},
} as const;

const falWebhooksNested = {
	requests: {
		completed: RequestWebhooks.completed,
	},
} as const;

export const falEndpointSchemas = {
	'queue.submit': {
		input: FalEndpointInputSchemas.queueSubmit,
		output: FalEndpointOutputSchemas.queueSubmit,
	},
	'queue.status': {
		input: FalEndpointInputSchemas.queueStatus,
		output: FalEndpointOutputSchemas.queueStatus,
	},
	'queue.result': {
		input: FalEndpointInputSchemas.queueResult,
		output: FalEndpointOutputSchemas.queueResult,
	},
	'queue.cancel': {
		input: FalEndpointInputSchemas.queueCancel,
		output: FalEndpointOutputSchemas.queueCancel,
	},
	'models.run': {
		input: FalEndpointInputSchemas.modelsRun,
		output: FalEndpointOutputSchemas.modelsRun,
	},
	'models.search': {
		input: FalEndpointInputSchemas.modelsSearch,
		output: FalEndpointOutputSchemas.modelsSearch,
	},
	'models.pricing': {
		input: FalEndpointInputSchemas.modelsPricing,
		output: FalEndpointOutputSchemas.modelsPricing,
	},
	'models.estimateCost': {
		input: FalEndpointInputSchemas.modelsEstimateCost,
		output: FalEndpointOutputSchemas.modelsEstimateCost,
	},
	'requests.list': {
		input: FalEndpointInputSchemas.requestsList,
		output: FalEndpointOutputSchemas.requestsList,
	},
	'requests.deletePayloads': {
		input: FalEndpointInputSchemas.requestsDeletePayloads,
		output: FalEndpointOutputSchemas.requestsDeletePayloads,
	},
	'usage.get': {
		input: FalEndpointInputSchemas.usageGet,
		output: FalEndpointOutputSchemas.usageGet,
	},
	'usage.billingEvents': {
		input: FalEndpointInputSchemas.usageBillingEvents,
		output: FalEndpointOutputSchemas.usageBillingEvents,
	},
	'account.billing': {
		input: FalEndpointInputSchemas.accountBilling,
		output: FalEndpointOutputSchemas.accountBilling,
	},
	'files.upload': {
		input: FalEndpointInputSchemas.filesUpload,
		output: FalEndpointOutputSchemas.filesUpload,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof falEndpointsNested>;

const falWebhookSchemas = {
	'requests.completed': {
		description:
			'A queued request finished: status OK with the model output, or ERROR with the error. Signed by fal (Ed25519).',
		payload: RequestCompletedEventSchema,
		response: RequestCompletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof falWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// A queued request runs on fal after submit returns. Status values are the
// derived `state` (endpoints/types.ts QUEUE_STATES); jobs.test.ts keeps them
// in step. responseUrl is the one id that both reads and cancels it.
const QUEUE_JOB = {
	idPath: 'response_url',
	status: {
		op: 'queue.status',
		idArg: 'responseUrl',
		statusPath: 'state',
		done: ['SUCCEEDED'],
		failed: ['FAILED'],
	},
	cancel: { op: 'queue.cancel', idArg: 'responseUrl' },
} as const;

const falEndpointMeta = {
	'queue.submit': {
		riskLevel: 'write',
		description:
			'Queue a model run (image, video, audio, 3D…) and get a request id back at once; spends fal credits. Follow it with queue.status until state is SUCCEEDED or FAILED, or pass webhookUrl.',
		job: QUEUE_JOB,
	},
	'queue.status': {
		riskLevel: 'read',
		description:
			'Where a queued request stands. Once done it returns state SUCCEEDED with the output, or FAILED with the error.',
	},
	'queue.result': {
		riskLevel: 'read',
		description: 'The output of a completed queued request',
	},
	'queue.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a queued request: removed if still waiting, asked to stop if running',
	},
	'models.run': {
		riskLevel: 'write',
		description:
			'Run a model and wait up to waitSeconds (default 10) for its output; spends fal credits. SUCCEEDED and FAILED are final. IN_QUEUE or IN_PROGRESS is a job to follow with queue.status; video, audio and training usually take longer than the wait.',
		job: QUEUE_JOB,
	},
	'models.search': {
		riskLevel: 'read',
		description:
			'Find fal models by text, category or endpoint id; includeOpenApi returns their input and output fields',
	},
	'models.pricing': {
		riskLevel: 'read',
		description: 'Unit price of fal models (per image, megapixel, second…)',
	},
	'models.estimateCost': {
		riskLevel: 'read',
		description: 'Estimate what a number of calls or output units will cost',
	},
	'requests.list': {
		riskLevel: 'read',
		description:
			'Past requests to given endpoints, with timing and status; optionally their inputs and outputs',
	},
	'requests.deletePayloads': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a request's stored input and output payloads and the files it generated on fal's CDN (files it took as input stay)",
	},
	'usage.get': {
		riskLevel: 'read',
		description: 'Usage and cost by endpoint over a date range',
	},
	'usage.billingEvents': {
		riskLevel: 'read',
		description: 'Billed requests one by one, with their cost',
	},
	'account.billing': {
		riskLevel: 'read',
		description:
			"The account's credit balance (needs a key with billing read access)",
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload a file to fal storage and get a public URL to pass as a model input',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof falEndpointsNested>;

export const falAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFalPlugin<T extends FalPluginOptions> = CorsairPlugin<
	'fal',
	typeof FalSchema,
	typeof falEndpointsNested,
	typeof falWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFalPlugin = BaseFalPlugin<FalPluginOptions>;

export type ExternalFalPlugin<T extends FalPluginOptions> = BaseFalPlugin<T>;

export function fal<const T extends FalPluginOptions>(
	incomingOptions: FalPluginOptions & T = {} as FalPluginOptions & T,
): ExternalFalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fal',
		authConfig: falAuthConfig,
		schema: FalSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: falEndpointsNested,
		webhooks: falWebhooksNested,
		endpointMeta: falEndpointMeta,
		endpointSchemas: falEndpointSchemas,
		webhookSchemas: falWebhookSchemas,
		pluginWebhookMatcher: isFalWebhook,
		pluginTenantWebhookMatcher: matchFalTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FalKeyBuilderContext, source) => {
			// Webhooks are checked against fal's public keys, not a secret.
			if (source === 'webhook') return '';

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('fal', 'api_key');
				return key;
			}

			throw new AuthMissingError('fal', 'api_key');
		},
	} satisfies InternalFalPlugin;
}

export type {
	AccountBillingInput,
	AccountBillingResponse,
	FalEndpointInputs,
	FalEndpointOutputs,
	FilesUploadInput,
	FilesUploadResponse,
	ModelsEstimateCostInput,
	ModelsEstimateCostResponse,
	ModelsPricingInput,
	ModelsPricingResponse,
	ModelsRunInput,
	ModelsRunResponse,
	ModelsSearchInput,
	ModelsSearchResponse,
	QueueCancelInput,
	QueueCancelResponse,
	QueueResultInput,
	QueueResultResponse,
	QueueStatusInput,
	QueueStatusResponse,
	QueueSubmitInput,
	QueueSubmitResponse,
	RequestsDeletePayloadsInput,
	RequestsDeletePayloadsResponse,
	RequestsListInput,
	RequestsListResponse,
	UsageBillingEventsInput,
	UsageBillingEventsResponse,
	UsageGetInput,
	UsageGetResponse,
} from './endpoints/types';

export type {
	FalJwk,
	FalVerifyOptions,
	FalWebhookOutputs,
	RequestCompletedEvent,
} from './webhooks/types';
export {
	FAL_JWKS_URL,
	resetFalJwksCache,
	verifyFalWebhookSignature,
} from './webhooks/types';
