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
import { Account, Lists, Verify } from './endpoints';
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
	listsDelete: ListcleanEndpoint<'listsDelete'>;
	accountGetCredits: ListcleanEndpoint<'accountGetCredits'>;
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
		delete: Lists.delete,
	},
	account: {
		getCredits: Account.getCredits,
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
} as const satisfies RequiredPluginEndpointSchemas<
	typeof listcleanEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * The batch job: submit answers `list_id`, and the status read is
 * `lists.getList`, which answers an array holding the one list, so its
 * `0.status` moves SUBMITTED → INPROCESS → COMPLETED. Listclean documents no
 * failed status for this flow, so `failed` is empty.
 */
const BATCH_JOB = {
	idPath: 'list_id',
	status: {
		op: 'lists.getList',
		idArg: 'list_id',
		statusPath: '0.status',
		done: ['COMPLETED'],
		failed: [],
	},
} as const;

const listcleanEndpointMeta = {
	'verify.verifyEmail': {
		riskLevel: 'read',
		description:
			'Verify one email address and read back its verdict, MX and mailbox details. Billed: this spends one credit per call even when the answer is lost, so it is never retried.',
	},
	'verify.startBatchVerification': {
		riskLevel: 'write',
		description:
			'Start an async bulk verification of up to 3000 addresses; each one spends a credit when the job runs. Answers the list id to poll with lists.getList and fetch with lists.getListResults. Not replayed on failure: a repeat would start a second billed job.',
		job: BATCH_JOB,
	},
	'verify.getVerificationLogs': {
		riskLevel: 'read',
		description:
			'Read past verifications in a date range of up to 30 days, with optional email, source and status filters and offset paging',
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
	'lists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a list and its results; there is no undo and the rows cannot be fetched again afterwards',
	},
	'account.getCredits': {
		riskLevel: 'read',
		description:
			'Read the remaining credit balance; useful before billed calls, which spend one credit per address',
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

export { LISTCLEAN_API_BASE, ListcleanAPIError } from './client';

export type {
	GetAnalyticsInput,
	GetAnalyticsResponse,
	GetCreditsInput,
	GetCreditsResponse,
	GetListInput,
	GetListResponse,
	GetListResultsInput,
	GetListResultsResponse,
	GetVerificationLogsInput,
	GetVerificationLogsResponse,
	ListcleanEndpointInputs,
	ListcleanEndpointOutputs,
	ListcleanList,
	ListcleanVerification,
	ListListsInput,
	ListListsResponse,
	StartBatchVerificationInput,
	StartBatchVerificationResponse,
	VerifyEmailInput,
	VerifyEmailResponse,
} from './endpoints/types';
