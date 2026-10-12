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
import {
	Account,
	Classify,
	Edit,
	Extract,
	Files,
	Jobs,
	Parse,
	Pipeline,
	Split,
} from './endpoints';
import type {
	ReductoEndpointInputs,
	ReductoEndpointOutputs,
} from './endpoints/types';
import {
	ReductoEndpointInputSchemas,
	ReductoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ReductoSchema } from './schema';

export type ReductoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * API origin. Defaults to `https://platform.reducto.ai`. Paid plans can
	 * point this at a regional host.
	 */
	baseUrl?: string;
	hooks?: InternalReductoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof reductoEndpointsNested>;
};

export type ReductoContext = CorsairPluginContext<
	typeof ReductoSchema,
	ReductoPluginOptions
>;

export type ReductoKeyBuilderContext = KeyBuilderContext<ReductoPluginOptions>;

export type ReductoBoundEndpoints = BindEndpoints<
	typeof reductoEndpointsNested
>;

type ReductoEndpoint<K extends keyof ReductoEndpointOutputs> = CorsairEndpoint<
	ReductoContext,
	ReductoEndpointInputs[K],
	ReductoEndpointOutputs[K]
>;

export type ReductoEndpoints = {
	parse: ReductoEndpoint<'parse'>;
	parseAsync: ReductoEndpoint<'parseAsync'>;
	extract: ReductoEndpoint<'extract'>;
	extractAsync: ReductoEndpoint<'extractAsync'>;
	split: ReductoEndpoint<'split'>;
	splitAsync: ReductoEndpoint<'splitAsync'>;
	edit: ReductoEndpoint<'edit'>;
	editAsync: ReductoEndpoint<'editAsync'>;
	classify: ReductoEndpoint<'classify'>;
	classifyAsync: ReductoEndpoint<'classifyAsync'>;
	pipeline: ReductoEndpoint<'pipeline'>;
	pipelineAsync: ReductoEndpoint<'pipelineAsync'>;
	getJob: ReductoEndpoint<'getJob'>;
	listJobs: ReductoEndpoint<'listJobs'>;
	cancelJob: ReductoEndpoint<'cancelJob'>;
	deleteJob: ReductoEndpoint<'deleteJob'>;
	upload: ReductoEndpoint<'upload'>;
	deleteUpload: ReductoEndpoint<'deleteUpload'>;
	version: ReductoEndpoint<'version'>;
	configureWebhook: ReductoEndpoint<'configureWebhook'>;
};

const reductoEndpointsNested = {
	parse: {
		parse: Parse.parse,
		parseAsync: Parse.parseAsync,
	},
	extract: {
		extract: Extract.extract,
		extractAsync: Extract.extractAsync,
	},
	split: {
		split: Split.split,
		splitAsync: Split.splitAsync,
	},
	edit: {
		edit: Edit.edit,
		editAsync: Edit.editAsync,
	},
	classify: {
		classify: Classify.classify,
		classifyAsync: Classify.classifyAsync,
	},
	pipeline: {
		run: Pipeline.run,
		runAsync: Pipeline.runAsync,
	},
	jobs: {
		get: Jobs.get,
		list: Jobs.list,
		cancel: Jobs.cancel,
		delete: Jobs.remove,
	},
	files: {
		upload: Files.upload,
		delete: Files.remove,
	},
	account: {
		version: Account.version,
		configureWebhook: Account.configureWebhook,
	},
} as const;

export const reductoEndpointSchemas = {
	'parse.parse': {
		input: ReductoEndpointInputSchemas.parse,
		output: ReductoEndpointOutputSchemas.parse,
	},
	'parse.parseAsync': {
		input: ReductoEndpointInputSchemas.parseAsync,
		output: ReductoEndpointOutputSchemas.parseAsync,
	},
	'extract.extract': {
		input: ReductoEndpointInputSchemas.extract,
		output: ReductoEndpointOutputSchemas.extract,
	},
	'extract.extractAsync': {
		input: ReductoEndpointInputSchemas.extractAsync,
		output: ReductoEndpointOutputSchemas.extractAsync,
	},
	'split.split': {
		input: ReductoEndpointInputSchemas.split,
		output: ReductoEndpointOutputSchemas.split,
	},
	'split.splitAsync': {
		input: ReductoEndpointInputSchemas.splitAsync,
		output: ReductoEndpointOutputSchemas.splitAsync,
	},
	'edit.edit': {
		input: ReductoEndpointInputSchemas.edit,
		output: ReductoEndpointOutputSchemas.edit,
	},
	'edit.editAsync': {
		input: ReductoEndpointInputSchemas.editAsync,
		output: ReductoEndpointOutputSchemas.editAsync,
	},
	'classify.classify': {
		input: ReductoEndpointInputSchemas.classify,
		output: ReductoEndpointOutputSchemas.classify,
	},
	'classify.classifyAsync': {
		input: ReductoEndpointInputSchemas.classifyAsync,
		output: ReductoEndpointOutputSchemas.classifyAsync,
	},
	'pipeline.run': {
		input: ReductoEndpointInputSchemas.pipeline,
		output: ReductoEndpointOutputSchemas.pipeline,
	},
	'pipeline.runAsync': {
		input: ReductoEndpointInputSchemas.pipelineAsync,
		output: ReductoEndpointOutputSchemas.pipelineAsync,
	},
	'jobs.get': {
		input: ReductoEndpointInputSchemas.getJob,
		output: ReductoEndpointOutputSchemas.getJob,
	},
	'jobs.list': {
		input: ReductoEndpointInputSchemas.listJobs,
		output: ReductoEndpointOutputSchemas.listJobs,
	},
	'jobs.cancel': {
		input: ReductoEndpointInputSchemas.cancelJob,
		output: ReductoEndpointOutputSchemas.cancelJob,
	},
	'jobs.delete': {
		input: ReductoEndpointInputSchemas.deleteJob,
		output: ReductoEndpointOutputSchemas.deleteJob,
	},
	'files.upload': {
		input: ReductoEndpointInputSchemas.upload,
		output: ReductoEndpointOutputSchemas.upload,
	},
	'files.delete': {
		input: ReductoEndpointInputSchemas.deleteUpload,
		output: ReductoEndpointOutputSchemas.deleteUpload,
	},
	'account.version': {
		input: ReductoEndpointInputSchemas.version,
		output: ReductoEndpointOutputSchemas.version,
	},
	'account.configureWebhook': {
		input: ReductoEndpointInputSchemas.configureWebhook,
		output: ReductoEndpointOutputSchemas.configureWebhook,
	},
} satisfies RequiredPluginEndpointSchemas<typeof reductoEndpointsNested>;

const reductoEndpointMeta = {
	'parse.parse': {
		riskLevel: 'write',
		description:
			'Parse a document into chunks of text, tables, and figures with bounding boxes',
	},
	'parse.parseAsync': {
		riskLevel: 'write',
		description: 'Start a parse job and return its job id',
	},
	'extract.extract': {
		riskLevel: 'write',
		description: 'Extract fields from a document using a JSON schema',
	},
	'extract.extractAsync': {
		riskLevel: 'write',
		description: 'Start an extract job and return its job id',
	},
	'split.split': {
		riskLevel: 'write',
		description: 'Split a document into named sections by page',
	},
	'split.splitAsync': {
		riskLevel: 'write',
		description: 'Start a split job and return its job id',
	},
	'edit.edit': {
		riskLevel: 'write',
		description:
			'Fill or edit a PDF or DOCX from natural language instructions',
	},
	'edit.editAsync': {
		riskLevel: 'write',
		description: 'Start an edit job and return its job id',
	},
	'classify.classify': {
		riskLevel: 'write',
		description: 'Classify a document against a list of categories',
	},
	'classify.classifyAsync': {
		riskLevel: 'write',
		description: 'Start a classify job and return its job id',
	},
	'pipeline.run': {
		riskLevel: 'write',
		description: 'Run a Studio pipeline against a document',
	},
	'pipeline.runAsync': {
		riskLevel: 'write',
		description: 'Start a Studio pipeline job and return its job id',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Retrieve a job status and, when finished, its result',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'List jobs, page by page, using cursor and limit',
	},
	'jobs.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a running job',
	},
	'jobs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a job and its stored artifacts. Returns 202. Free plans return 422 NOT_APPLICABLE',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file and return a reducto:// file id',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an uploaded file. Free plans return 422 NOT_APPLICABLE; Growth and Enterprise delete it',
	},
	'account.version': {
		riskLevel: 'read',
		description: 'Read the Reducto API version',
	},
	'account.configureWebhook': {
		riskLevel: 'write',
		description: 'Open the Svix webhook portal URL for this account',
	},
} satisfies RequiredPluginEndpointMeta<typeof reductoEndpointsNested>;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};

	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

const defaultAuthType: AuthTypes = 'api_key' as const;

export const reductoAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReductoPlugin<T extends ReductoPluginOptions> = CorsairPlugin<
	'reducto',
	typeof ReductoSchema,
	typeof reductoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof reductoAuthConfig
>;

export type InternalReductoPlugin = BaseReductoPlugin<ReductoPluginOptions>;

export type ExternalReductoPlugin<T extends ReductoPluginOptions> =
	BaseReductoPlugin<T>;

export function reducto<const T extends ReductoPluginOptions>(
	// Empty options still have to satisfy the caller's T. There is no value
	// that is both `{}` and an arbitrary T, so the default is asserted.
	incomingOptions: ReductoPluginOptions & T = {} as ReductoPluginOptions & T,
): ExternalReductoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'reducto',
		schema: ReductoSchema,
		options,
		hooks: options.hooks,
		endpoints: reductoEndpointsNested,
		webhooks: {},
		endpointMeta: reductoEndpointMeta,
		endpointSchemas: reductoEndpointSchemas,
		authConfig: reductoAuthConfig,
		// Job webhooks are configured per request (direct URL or Svix). Reducto
		// does not send a header that is unique to this plugin, so incoming
		// webhook routing is left to the app.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ReductoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('reducto', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('reducto', 'api_key');
		},
	} satisfies InternalReductoPlugin;
}

export { ReductoAPIError } from './client';
export type {
	AsyncJobIdResponse,
	CancelJobResponse,
	ClassifyAsyncInput,
	ClassifyInput,
	ClassifyResponse,
	ConfigureWebhookInput,
	ConfigureWebhookResponse,
	DeleteJobInput,
	DeleteJobResponse,
	DeleteUploadInput,
	DeleteUploadResponse,
	EditAsyncInput,
	EditInput,
	EditResponse,
	ExtractAsyncInput,
	ExtractInput,
	ExtractResponse,
	JobIdInput,
	JobResponse,
	ListJobsInput,
	ListJobsResponse,
	ParseAsyncInput,
	ParseInput,
	ParseResponse,
	PipelineAsyncInput,
	PipelineInput,
	PipelineResponse,
	ReductoEndpointInputs,
	ReductoEndpointOutputs,
	SplitAsyncInput,
	SplitInput,
	SplitResponse,
	UploadInput,
	UploadResponse,
	VersionInput,
	VersionResponse,
} from './endpoints/types';
export {
	ReductoEndpointInputSchemas,
	ReductoEndpointOutputSchemas,
} from './endpoints/types';
