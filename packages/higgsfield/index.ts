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
import { Files, Generations, Models, Requests, Usage } from './endpoints';
import type {
	HiggsfieldEndpointInputs,
	HiggsfieldEndpointOutputs,
} from './endpoints/types';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HiggsfieldSchema } from './schema';
import { RequestWebhooks } from './webhooks';
import type {
	HiggsfieldWebhookOutputs,
	RequestCompletedPayload,
} from './webhooks/types';
import {
	isHiggsfieldWebhook,
	RequestCompletedEventSchema,
	RequestCompletedPayloadSchema,
} from './webhooks/types';

export type HiggsfieldPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Higgsfield API key as `<key id>:<key secret>`. Overrides the stored key. */
	key?: string;
	/** The account's `whsec_` webhook signing secret. Overrides the stored one. */
	webhookSecret?: string;
	hooks?: InternalHiggsfieldPlugin['hooks'];
	webhookHooks?: InternalHiggsfieldPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof higgsfieldEndpointsNested>;
};

export type HiggsfieldContext = CorsairPluginContext<
	typeof HiggsfieldSchema,
	HiggsfieldPluginOptions
>;

export type HiggsfieldKeyBuilderContext =
	KeyBuilderContext<HiggsfieldPluginOptions>;

export type HiggsfieldBoundEndpoints = BindEndpoints<
	typeof higgsfieldEndpointsNested
>;

type HiggsfieldEndpoint<K extends keyof HiggsfieldEndpointOutputs> =
	CorsairEndpoint<
		HiggsfieldContext,
		HiggsfieldEndpointInputs[K],
		HiggsfieldEndpointOutputs[K]
	>;

export type HiggsfieldEndpoints = {
	generationsSubmit: HiggsfieldEndpoint<'generationsSubmit'>;
	generationsRun: HiggsfieldEndpoint<'generationsRun'>;
	generationsEstimate: HiggsfieldEndpoint<'generationsEstimate'>;
	requestsStatus: HiggsfieldEndpoint<'requestsStatus'>;
	requestsCancel: HiggsfieldEndpoint<'requestsCancel'>;
	requestsDelete: HiggsfieldEndpoint<'requestsDelete'>;
	filesCreateUploadUrl: HiggsfieldEndpoint<'filesCreateUploadUrl'>;
	filesUpload: HiggsfieldEndpoint<'filesUpload'>;
	modelsList: HiggsfieldEndpoint<'modelsList'>;
	modelsGet: HiggsfieldEndpoint<'modelsGet'>;
	usageGet: HiggsfieldEndpoint<'usageGet'>;
};

type HiggsfieldWebhook<
	K extends keyof HiggsfieldWebhookOutputs,
	TEvent,
> = CorsairWebhook<HiggsfieldContext, TEvent, HiggsfieldWebhookOutputs[K]>;

export type HiggsfieldWebhooks = {
	requestCompleted: HiggsfieldWebhook<
		'requestCompleted',
		RequestCompletedPayload
	>;
};

export type HiggsfieldBoundWebhooks = BindWebhooks<
	typeof higgsfieldWebhooksNested
>;

const higgsfieldEndpointsNested = {
	generations: {
		submit: Generations.submit,
		run: Generations.run,
		estimate: Generations.estimate,
	},
	requests: {
		status: Requests.status,
		cancel: Requests.cancel,
		delete: Requests.delete,
	},
	files: {
		createUploadUrl: Files.createUploadUrl,
		upload: Files.upload,
	},
	models: {
		list: Models.list,
		get: Models.get,
	},
	usage: {
		get: Usage.get,
	},
} as const;

const higgsfieldWebhooksNested = {
	requests: {
		completed: RequestWebhooks.completed,
	},
} as const;

export const higgsfieldEndpointSchemas = {
	'generations.submit': {
		input: HiggsfieldEndpointInputSchemas.generationsSubmit,
		output: HiggsfieldEndpointOutputSchemas.generationsSubmit,
	},
	'generations.run': {
		input: HiggsfieldEndpointInputSchemas.generationsRun,
		output: HiggsfieldEndpointOutputSchemas.generationsRun,
	},
	'generations.estimate': {
		input: HiggsfieldEndpointInputSchemas.generationsEstimate,
		output: HiggsfieldEndpointOutputSchemas.generationsEstimate,
	},
	'requests.status': {
		input: HiggsfieldEndpointInputSchemas.requestsStatus,
		output: HiggsfieldEndpointOutputSchemas.requestsStatus,
	},
	'requests.cancel': {
		input: HiggsfieldEndpointInputSchemas.requestsCancel,
		output: HiggsfieldEndpointOutputSchemas.requestsCancel,
	},
	'requests.delete': {
		input: HiggsfieldEndpointInputSchemas.requestsDelete,
		output: HiggsfieldEndpointOutputSchemas.requestsDelete,
	},
	'files.createUploadUrl': {
		input: HiggsfieldEndpointInputSchemas.filesCreateUploadUrl,
		output: HiggsfieldEndpointOutputSchemas.filesCreateUploadUrl,
	},
	'files.upload': {
		input: HiggsfieldEndpointInputSchemas.filesUpload,
		output: HiggsfieldEndpointOutputSchemas.filesUpload,
	},
	'models.list': {
		input: HiggsfieldEndpointInputSchemas.modelsList,
		output: HiggsfieldEndpointOutputSchemas.modelsList,
	},
	'models.get': {
		input: HiggsfieldEndpointInputSchemas.modelsGet,
		output: HiggsfieldEndpointOutputSchemas.modelsGet,
	},
	'usage.get': {
		input: HiggsfieldEndpointInputSchemas.usageGet,
		output: HiggsfieldEndpointOutputSchemas.usageGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof higgsfieldEndpointsNested
>;

const higgsfieldWebhookSchemas = {
	'requests.completed': {
		description:
			'A request reached completed (with its output), failed or nsfw. Signed with Standard Webhooks; only signed deliveries are accepted.',
		payload: RequestCompletedPayloadSchema,
		response: RequestCompletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof higgsfieldWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// A request runs at Higgsfield after the submit returns. Status values are the
// ones the API documents (endpoints/types.ts REQUEST_STATUSES); jobs.test.ts
// keeps them in step. nsfw and canceled are told apart from failed in `status`,
// but all three ended without an output, so the job counts them as failed.
const GENERATION_JOB = {
	idPath: 'request_id',
	status: {
		op: 'requests.status',
		idArg: 'requestId',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed', 'nsfw', 'canceled'],
	},
	cancel: { op: 'requests.cancel', idArg: 'requestId' },
} as const;

const higgsfieldEndpointMeta = {
	'generations.submit': {
		riskLevel: 'write',
		description:
			'Queue a generation (image, video…) and get a request id back at once; spends account balance when it completes. Follow it with requests.status until it is completed, failed, nsfw or canceled, or pass webhookUrl. Outputs expire after 7 days by default. Repeating with the returned idempotency_key is never charged twice.',
		job: GENERATION_JOB,
	},
	'generations.run': {
		riskLevel: 'write',
		description:
			'Generate and wait up to waitSeconds (default 10, at most 15) for the output; spends account balance when it completes. Answers like requests.status: queued or in_progress is a job to follow with requests.status, and video usually takes longer than the wait. Outputs expire after 7 days by default.',
		job: GENERATION_JOB,
	},
	'generations.estimate': {
		riskLevel: 'read',
		description:
			'What a generation with these inputs would cost, in US dollars and credits. Free; nothing runs.',
	},
	'requests.status': {
		riskLevel: 'read',
		description:
			'Where a request stands, with its output URLs once completed. Output URLs stop working at expires_at, 7 days after it finished by default.',
	},
	'requests.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a request that is still queued and refund it. Once it has started it cannot be canceled, and this errors.',
	},
	'requests.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a finished request's files, prompt and parameters now. Billing records stay. A request still running gets a 409.",
	},
	'files.createUploadUrl': {
		riskLevel: 'write',
		description:
			'Get a presigned URL to PUT an input file to yourself, and the public URL it will have. For most uses files.upload does both steps.',
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload an image, audio or video file from base64 and get the public URL to pass as a model input. A file already at a public https URL needs no upload: pass that URL to the model.',
	},
	'models.list': {
		riskLevel: 'read',
		description:
			'Find Higgsfield models by text, output type or operation; includeSchema adds their input fields',
	},
	'models.get': {
		riskLevel: 'read',
		description:
			'One model by its path, with its input fields (input_schema). Read this before a generation: every model takes its own fields.',
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			'Completed generations and their estimated cost by model and time bucket. For monitoring: it can lag and is not a billing record.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof higgsfieldEndpointsNested
>;

export const higgsfieldAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHiggsfieldPlugin<T extends HiggsfieldPluginOptions> =
	CorsairPlugin<
		'higgsfield',
		typeof HiggsfieldSchema,
		typeof higgsfieldEndpointsNested,
		typeof higgsfieldWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHiggsfieldPlugin =
	BaseHiggsfieldPlugin<HiggsfieldPluginOptions>;

export type ExternalHiggsfieldPlugin<T extends HiggsfieldPluginOptions> =
	BaseHiggsfieldPlugin<T>;

/**
 * Core takes the first handler whose match says yes, in key order, so anything
 * added after DEFAULT might never run. A custom DEFAULT replaces this plugin's,
 * and every other custom handler sits ahead of it.
 */
function mergeErrorHandlers(custom: CorsairErrorHandler = {}) {
	const { DEFAULT: ownDefault, ...own } = errorHandlers;
	const { DEFAULT: customDefault, ...named } = custom;
	return { ...own, ...named, DEFAULT: customDefault ?? ownDefault };
}

export function higgsfield<const T extends HiggsfieldPluginOptions>(
	incomingOptions: HiggsfieldPluginOptions & T = {} as HiggsfieldPluginOptions &
		T,
): ExternalHiggsfieldPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	// No tenant matcher: nothing in a delivery names the account (the envelope and
	// headers carry no account id; checked on a real delivery), so a multi-tenant
	// app routes by passing `?tenantId=` on the webhookUrl it submits.
	return {
		id: 'higgsfield',
		authConfig: higgsfieldAuthConfig,
		schema: HiggsfieldSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: higgsfieldEndpointsNested,
		webhooks: higgsfieldWebhooksNested,
		endpointMeta: higgsfieldEndpointMeta,
		endpointSchemas: higgsfieldEndpointSchemas,
		webhookSchemas: higgsfieldWebhookSchemas,
		pluginWebhookMatcher: isHiggsfieldWebhook,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: HiggsfieldKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('higgsfield', 'api_key');
				return key;
			}

			throw new AuthMissingError('higgsfield', 'api_key');
		},
	} satisfies InternalHiggsfieldPlugin;
}

export {
	HiggsfieldAPIError,
	HiggsfieldError,
} from './client';

export type {
	FilesCreateUploadUrlInput,
	FilesCreateUploadUrlResponse,
	FilesUploadInput,
	FilesUploadResponse,
	GenerationsEstimateInput,
	GenerationsEstimateResponse,
	GenerationsRunInput,
	GenerationsRunResponse,
	GenerationsSubmitInput,
	GenerationsSubmitResponse,
	HiggsfieldEndpointInputs,
	HiggsfieldEndpointOutputs,
	ModelsGetInput,
	ModelsGetResponse,
	ModelsListInput,
	ModelsListResponse,
	RequestsCancelInput,
	RequestsCancelResponse,
	RequestsDeleteInput,
	RequestsDeleteResponse,
	RequestsStatusInput,
	RequestsStatusResponse,
	UsageGetInput,
	UsageGetResponse,
} from './endpoints/types';

export type {
	HiggsfieldVerifyOptions,
	HiggsfieldWebhookOutputs,
	RequestCompletedEvent,
	RequestCompletedPayload,
} from './webhooks/types';
export { verifyHiggsfieldWebhookSignature } from './webhooks/types';
