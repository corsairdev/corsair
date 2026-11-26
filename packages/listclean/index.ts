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
import { Account, Lists, Uploads, Verify } from './endpoints';
import type {
	ListcleanEndpointInputs,
	ListcleanEndpointOutputs,
} from './endpoints/types';
import {
	ListcleanEndpointInputSchemas,
	ListcleanEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ListcleanSchema } from './schema';

export type ListcleanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalListcleanPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof listcleanEndpointsNested>;
};

export type ListcleanContext = CorsairPluginContext<
	typeof ListcleanSchema,
	ListcleanPluginOptions
>;

export type ListcleanKeyBuilderContext =
	KeyBuilderContext<ListcleanPluginOptions>;

export type ListcleanBoundEndpoints = BindEndpoints<
	typeof listcleanEndpointsNested
>;

type ListcleanEndpoint<K extends keyof ListcleanEndpointOutputs> =
	CorsairEndpoint<
		ListcleanContext,
		ListcleanEndpointInputs[K],
		ListcleanEndpointOutputs[K]
	>;

export type ListcleanEndpoints = {
	verifyVerifyEmail: ListcleanEndpoint<'verifyVerifyEmail'>;
	verifyStartBatchVerification: ListcleanEndpoint<'verifyStartBatchVerification'>;
	verifyGetVerificationLogs: ListcleanEndpoint<'verifyGetVerificationLogs'>;
	verifyGetAnalytics: ListcleanEndpoint<'verifyGetAnalytics'>;
	listsListLists: ListcleanEndpoint<'listsListLists'>;
	listsGetList: ListcleanEndpoint<'listsGetList'>;
	listsGetListResults: ListcleanEndpoint<'listsGetListResults'>;
	listsGetListResultsCsv: ListcleanEndpoint<'listsGetListResultsCsv'>;
	listsDelete: ListcleanEndpoint<'listsDelete'>;
	uploadsListUploads: ListcleanEndpoint<'uploadsListUploads'>;
	uploadsStartUpload: ListcleanEndpoint<'uploadsStartUpload'>;
	uploadsUploadChunk: ListcleanEndpoint<'uploadsUploadChunk'>;
	uploadsGetUpload: ListcleanEndpoint<'uploadsGetUpload'>;
	accountGetCredits: ListcleanEndpoint<'accountGetCredits'>;
	accountGetProfile: ListcleanEndpoint<'accountGetProfile'>;
	accountUpdateProfile: ListcleanEndpoint<'accountUpdateProfile'>;
};

const listcleanEndpointsNested = {
	verify: {
		verifyEmail: Verify.verifyEmail,
		startBatchVerification: Verify.startBatchVerification,
		getVerificationLogs: Verify.getVerificationLogs,
		getAnalytics: Verify.getAnalytics,
	},
	lists: {
		listLists: Lists.listLists,
		getList: Lists.getList,
		getListResults: Lists.getListResults,
		getListResultsCsv: Lists.getListResultsCsv,
		delete: Lists.delete,
	},
	uploads: {
		listUploads: Uploads.listUploads,
		startUpload: Uploads.startUpload,
		uploadChunk: Uploads.uploadChunk,
		getUpload: Uploads.getUpload,
	},
	account: {
		getCredits: Account.getCredits,
		getProfile: Account.getProfile,
		updateProfile: Account.updateProfile,
	},
} as const;

export const listcleanEndpointSchemas = {
	'verify.verifyEmail': {
		input: ListcleanEndpointInputSchemas.verifyVerifyEmail,
		output: ListcleanEndpointOutputSchemas.verifyVerifyEmail,
	},
	'verify.startBatchVerification': {
		input: ListcleanEndpointInputSchemas.verifyStartBatchVerification,
		output: ListcleanEndpointOutputSchemas.verifyStartBatchVerification,
	},
	'verify.getVerificationLogs': {
		input: ListcleanEndpointInputSchemas.verifyGetVerificationLogs,
		output: ListcleanEndpointOutputSchemas.verifyGetVerificationLogs,
	},
	'verify.getAnalytics': {
		input: ListcleanEndpointInputSchemas.verifyGetAnalytics,
		output: ListcleanEndpointOutputSchemas.verifyGetAnalytics,
	},
	'lists.listLists': {
		input: ListcleanEndpointInputSchemas.listsListLists,
		output: ListcleanEndpointOutputSchemas.listsListLists,
	},
	'lists.getList': {
		input: ListcleanEndpointInputSchemas.listsGetList,
		output: ListcleanEndpointOutputSchemas.listsGetList,
	},
	'lists.getListResults': {
		input: ListcleanEndpointInputSchemas.listsGetListResults,
		output: ListcleanEndpointOutputSchemas.listsGetListResults,
	},
	'lists.delete': {
		input: ListcleanEndpointInputSchemas.listsDelete,
		output: ListcleanEndpointOutputSchemas.listsDelete,
	},
	'account.getCredits': {
		input: ListcleanEndpointInputSchemas.accountGetCredits,
		output: ListcleanEndpointOutputSchemas.accountGetCredits,
	},
	'lists.getListResultsCsv': {
		input: ListcleanEndpointInputSchemas.listsGetListResultsCsv,
		output: ListcleanEndpointOutputSchemas.listsGetListResultsCsv,
	},
	'uploads.listUploads': {
		input: ListcleanEndpointInputSchemas.uploadsListUploads,
		output: ListcleanEndpointOutputSchemas.uploadsListUploads,
	},
	'uploads.startUpload': {
		input: ListcleanEndpointInputSchemas.uploadsStartUpload,
		output: ListcleanEndpointOutputSchemas.uploadsStartUpload,
	},
	'uploads.uploadChunk': {
		input: ListcleanEndpointInputSchemas.uploadsUploadChunk,
		output: ListcleanEndpointOutputSchemas.uploadsUploadChunk,
	},
	'uploads.getUpload': {
		input: ListcleanEndpointInputSchemas.uploadsGetUpload,
		output: ListcleanEndpointOutputSchemas.uploadsGetUpload,
	},
	'account.getProfile': {
		input: ListcleanEndpointInputSchemas.accountGetProfile,
		output: ListcleanEndpointOutputSchemas.accountGetProfile,
	},
	'account.updateProfile': {
		input: ListcleanEndpointInputSchemas.accountUpdateProfile,
		output: ListcleanEndpointOutputSchemas.accountUpdateProfile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof listcleanEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * The batch job: submit answers `list_id`, and the status read is
 * `lists.getList`, whose endpoint unwraps Listclean's one-element array into
 * `list`, so `list.status` moves SUBMITTED → INPROCESS → COMPLETED. Listclean
 * documents no failed status for this flow, so `failed` is empty.
 */
const BATCH_JOB = {
	idPath: 'list_id',
	status: {
		op: 'lists.getList',
		idArg: 'list_id',
		statusPath: 'list.status',
		done: ['COMPLETED'],
		failed: [],
	},
} as const;

const listcleanEndpointMeta = {
	'verify.verifyEmail': {
		riskLevel: 'read',
		description:
			'Verify one email address and read back its verdict, MX and mailbox details. Billed: one credit per call, spent even when the answer is lost, so it is not retried after a 5xx or a dropped connection (a 429 is, since Listclean refused it before running).',
	},
	'verify.startBatchVerification': {
		// A metered verification that also creates a list: `write`, not
		// `destructive` (PLUGIN_PR_RULES R8/R9: spending prepaid credits on
		// verification is metered use, not a purchase or a send).
		riskLevel: 'write',
		description:
			'Start an async bulk verification of up to 3000 addresses; each one spends a credit when the job runs. Answers the list id to poll with lists.getList and fetch with lists.getListResults. Not replayed after a 5xx or a lost answer, since a repeat would start a second billed job; a 429 is retried by core because Listclean refused it before running.',
		job: BATCH_JOB,
	},
	'verify.getVerificationLogs': {
		riskLevel: 'read',
		description:
			'Read past verifications in a date range of up to 30 days, with optional email, source and status filters and offset paging; answers the logs and their total_count',
	},
	'verify.getAnalytics': {
		riskLevel: 'read',
		description:
			'Read verification totals, per-date summaries and graph data for a date range, with optional source and status filters',
	},
	'lists.listLists': {
		riskLevel: 'read',
		description:
			'List the bulk lists with their status, per-list analytics and cost, newest page first',
	},
	'lists.getList': {
		riskLevel: 'read',
		description:
			'Read one list, including its SUBMITTED, INPROCESS or COMPLETED status and its analytics once done; this is how a batch job is polled',
	},
	'lists.getListResults': {
		riskLevel: 'read',
		description:
			"Download one completed list's verified rows as JSON, choosing the clean, dirty or unknown addresses",
	},
	'lists.getListResultsCsv': {
		riskLevel: 'read',
		description:
			"Download one completed list's verified rows as the CSV file Listclean builds, choosing the clean, dirty or unknown addresses",
	},
	'lists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a list and its results; there is no undo and the rows cannot be fetched again afterwards',
	},
	'uploads.listUploads': {
		riskLevel: 'read',
		description:
			'List the chunked CSV uploads with their id, status, file names and record counts',
	},
	'uploads.startUpload': {
		riskLevel: 'write',
		description:
			'Open a chunked CSV upload: name the file, its chunk count and chunk size, and optional CSV characters and fast mode. Answers the upload id the chunks go to. Once every chunk is in, the list is verified and spends one credit per address.',
	},
	'uploads.uploadChunk': {
		riskLevel: 'write',
		description:
			'Send one base64-encoded chunk of an upload, with its sequence number and an optional md5 checksum. The last chunk starts the billed verification. Not replayed after a 5xx or a lost answer.',
	},
	'uploads.getUpload': {
		riskLevel: 'read',
		description:
			'Read one upload: its inprocess, success or error status, progress, chunk counts and the request id of the list it became',
	},
	'account.getCredits': {
		riskLevel: 'read',
		description:
			'Read the remaining credit balance; useful before billed calls, which spend one credit per address',
	},
	'account.getProfile': {
		riskLevel: 'read',
		description:
			'Read the account profile: name, address, phone, company, website, social handles and billing details',
	},
	'account.updateProfile': {
		riskLevel: 'write',
		description:
			'Update account profile fields; only the fields given are sent',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof listcleanEndpointsNested
>;

export type BaseListcleanPlugin<T extends ListcleanPluginOptions> =
	CorsairPlugin<
		'listclean',
		typeof ListcleanSchema,
		typeof listcleanEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalListcleanPlugin =
	BaseListcleanPlugin<ListcleanPluginOptions>;

export type ExternalListcleanPlugin<T extends ListcleanPluginOptions> =
	BaseListcleanPlugin<T>;

export function listclean<const T extends ListcleanPluginOptions>(
	incomingOptions: ListcleanPluginOptions & T = {} as ListcleanPluginOptions &
		T,
): ExternalListcleanPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'listclean',
		schema: ListcleanSchema,
		options: options,
		hooks: options.hooks,
		endpoints: listcleanEndpointsNested,
		webhooks: {},
		endpointMeta: listcleanEndpointMeta,
		endpointSchemas: listcleanEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ListcleanKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('listclean', ctx.authType ?? 'api_key');
		},
	} satisfies InternalListcleanPlugin;
}

export { LISTCLEAN_API_BASE } from './client';

export type {
	GetAnalyticsInput,
	GetAnalyticsResponse,
	GetCreditsInput,
	GetCreditsResponse,
	GetListInput,
	GetListResponse,
	GetListResultsCsvInput,
	GetListResultsCsvResponse,
	GetListResultsInput,
	GetListResultsResponse,
	GetProfileInput,
	GetProfileResponse,
	GetUploadInput,
	GetUploadResponse,
	GetVerificationLogsInput,
	GetVerificationLogsResponse,
	ListcleanEndpointInputs,
	ListcleanEndpointOutputs,
	ListcleanList,
	ListcleanVerification,
	ListListsInput,
	ListListsResponse,
	ListUploadsInput,
	ListUploadsResponse,
	StartBatchVerificationInput,
	StartBatchVerificationResponse,
	StartUploadInput,
	StartUploadResponse,
	UpdateProfileInput,
	UpdateProfileResponse,
	UploadChunkInput,
	UploadChunkResponse,
	VerifyEmailInput,
	VerifyEmailResponse,
} from './endpoints/types';
