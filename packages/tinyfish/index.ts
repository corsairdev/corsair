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
import {
	Agent,
	Browser,
	Fetch,
	Profiles,
	Research,
	Search,
	Vault,
	Wallet,
} from './endpoints';
import type {
	TinyFishEndpointInputs,
	TinyFishEndpointOutputs,
} from './endpoints/types';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TinyFishSchema } from './schema';
import { TinyFishRunWebhooks } from './webhooks';
import type {
	RunCancelledEvent,
	RunCompletedEvent,
	RunFailedEvent,
	TinyFishWebhookOutputs,
} from './webhooks/types';
import {
	matchTinyFishPluginWebhook,
	RunCancelledEventSchema,
	RunCompletedEventSchema,
	RunFailedEventSchema,
} from './webhooks/types';

export type TinyFishPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTinyFishPlugin['hooks'];
	webhookHooks?: InternalTinyFishPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tinyFishEndpointsNested>;
};

export type TinyFishContext = CorsairPluginContext<
	typeof TinyFishSchema,
	TinyFishPluginOptions
>;

export type TinyFishKeyBuilderContext =
	KeyBuilderContext<TinyFishPluginOptions>;

export type TinyFishBoundEndpoints = BindEndpoints<
	typeof tinyFishEndpointsNested
>;

type TinyFishEndpoint<K extends keyof TinyFishEndpointOutputs> =
	CorsairEndpoint<
		TinyFishContext,
		TinyFishEndpointInputs[K],
		TinyFishEndpointOutputs[K]
	>;

export type TinyFishEndpoints = {
	search: TinyFishEndpoint<'search'>;
	searchUsage: TinyFishEndpoint<'searchUsage'>;
	fetch: TinyFishEndpoint<'fetch'>;
	fetchUsage: TinyFishEndpoint<'fetchUsage'>;
	createBrowserSession: TinyFishEndpoint<'createBrowserSession'>;
	terminateBrowserSession: TinyFishEndpoint<'terminateBrowserSession'>;
	browserUsage: TinyFishEndpoint<'browserUsage'>;
	run: TinyFishEndpoint<'run'>;
	runAsync: TinyFishEndpoint<'runAsync'>;
	runBatch: TinyFishEndpoint<'runBatch'>;
	listRuns: TinyFishEndpoint<'listRuns'>;
	getRun: TinyFishEndpoint<'getRun'>;
	getRuns: TinyFishEndpoint<'getRuns'>;
	cancelRun: TinyFishEndpoint<'cancelRun'>;
	cancelRuns: TinyFishEndpoint<'cancelRuns'>;
	getStepScreenshot: TinyFishEndpoint<'getStepScreenshot'>;
	getStepHtml: TinyFishEndpoint<'getStepHtml'>;
	startResearch: TinyFishEndpoint<'startResearch'>;
	listResearchRuns: TinyFishEndpoint<'listResearchRuns'>;
	getResearchRun: TinyFishEndpoint<'getResearchRun'>;
	cancelResearchRun: TinyFishEndpoint<'cancelResearchRun'>;
	listProfiles: TinyFishEndpoint<'listProfiles'>;
	createProfile: TinyFishEndpoint<'createProfile'>;
	getProfile: TinyFishEndpoint<'getProfile'>;
	updateProfile: TinyFishEndpoint<'updateProfile'>;
	deleteProfile: TinyFishEndpoint<'deleteProfile'>;
	getWallet: TinyFishEndpoint<'getWallet'>;
	listVaultItems: TinyFishEndpoint<'listVaultItems'>;
};

type TinyFishWebhook<
	K extends keyof TinyFishWebhookOutputs,
	TEvent,
> = CorsairWebhook<TinyFishContext, TEvent, TinyFishWebhookOutputs[K]>;

export type TinyFishWebhooks = {
	runCompleted: TinyFishWebhook<'runCompleted', RunCompletedEvent>;
	runFailed: TinyFishWebhook<'runFailed', RunFailedEvent>;
	runCancelled: TinyFishWebhook<'runCancelled', RunCancelledEvent>;
};

export type TinyFishBoundWebhooks = BindWebhooks<TinyFishWebhooks>;

const tinyFishEndpointsNested = {
	search: Search,
	fetch: Fetch,
	browser: Browser,
	agent: Agent,
	research: Research,
	profiles: Profiles,
	wallet: Wallet,
	vault: Vault,
} as const;

const tinyFishWebhooksNested = {
	run: {
		completed: TinyFishRunWebhooks.runCompleted,
		failed: TinyFishRunWebhooks.runFailed,
		cancelled: TinyFishRunWebhooks.runCancelled,
	},
} as const;

export const tinyfishEndpointSchemas = {
	'search.search': {
		input: TinyFishEndpointInputSchemas.search,
		output: TinyFishEndpointOutputSchemas.search,
	},
	'search.usage': {
		input: TinyFishEndpointInputSchemas.searchUsage,
		output: TinyFishEndpointOutputSchemas.searchUsage,
	},
	'fetch.fetch': {
		input: TinyFishEndpointInputSchemas.fetch,
		output: TinyFishEndpointOutputSchemas.fetch,
	},
	'fetch.usage': {
		input: TinyFishEndpointInputSchemas.fetchUsage,
		output: TinyFishEndpointOutputSchemas.fetchUsage,
	},
	'browser.createSession': {
		input: TinyFishEndpointInputSchemas.createBrowserSession,
		output: TinyFishEndpointOutputSchemas.createBrowserSession,
	},
	'browser.terminateSession': {
		input: TinyFishEndpointInputSchemas.terminateBrowserSession,
		output: TinyFishEndpointOutputSchemas.terminateBrowserSession,
	},
	'browser.usage': {
		input: TinyFishEndpointInputSchemas.browserUsage,
		output: TinyFishEndpointOutputSchemas.browserUsage,
	},
	'agent.run': {
		input: TinyFishEndpointInputSchemas.run,
		output: TinyFishEndpointOutputSchemas.run,
	},
	'agent.runAsync': {
		input: TinyFishEndpointInputSchemas.runAsync,
		output: TinyFishEndpointOutputSchemas.runAsync,
	},
	'agent.runBatch': {
		input: TinyFishEndpointInputSchemas.runBatch,
		output: TinyFishEndpointOutputSchemas.runBatch,
	},
	'agent.listRuns': {
		input: TinyFishEndpointInputSchemas.listRuns,
		output: TinyFishEndpointOutputSchemas.listRuns,
	},
	'agent.getRun': {
		input: TinyFishEndpointInputSchemas.getRun,
		output: TinyFishEndpointOutputSchemas.getRun,
	},
	'agent.getRuns': {
		input: TinyFishEndpointInputSchemas.getRuns,
		output: TinyFishEndpointOutputSchemas.getRuns,
	},
	'agent.cancelRun': {
		input: TinyFishEndpointInputSchemas.cancelRun,
		output: TinyFishEndpointOutputSchemas.cancelRun,
	},
	'agent.cancelRuns': {
		input: TinyFishEndpointInputSchemas.cancelRuns,
		output: TinyFishEndpointOutputSchemas.cancelRuns,
	},
	'agent.getStepScreenshot': {
		input: TinyFishEndpointInputSchemas.getStepScreenshot,
		output: TinyFishEndpointOutputSchemas.getStepScreenshot,
	},
	'agent.getStepHtml': {
		input: TinyFishEndpointInputSchemas.getStepHtml,
		output: TinyFishEndpointOutputSchemas.getStepHtml,
	},
	'research.start': {
		input: TinyFishEndpointInputSchemas.startResearch,
		output: TinyFishEndpointOutputSchemas.startResearch,
	},
	'research.list': {
		input: TinyFishEndpointInputSchemas.listResearchRuns,
		output: TinyFishEndpointOutputSchemas.listResearchRuns,
	},
	'research.get': {
		input: TinyFishEndpointInputSchemas.getResearchRun,
		output: TinyFishEndpointOutputSchemas.getResearchRun,
	},
	'research.cancel': {
		input: TinyFishEndpointInputSchemas.cancelResearchRun,
		output: TinyFishEndpointOutputSchemas.cancelResearchRun,
	},
	'profiles.list': {
		input: TinyFishEndpointInputSchemas.listProfiles,
		output: TinyFishEndpointOutputSchemas.listProfiles,
	},
	'profiles.create': {
		input: TinyFishEndpointInputSchemas.createProfile,
		output: TinyFishEndpointOutputSchemas.createProfile,
	},
	'profiles.get': {
		input: TinyFishEndpointInputSchemas.getProfile,
		output: TinyFishEndpointOutputSchemas.getProfile,
	},
	'profiles.update': {
		input: TinyFishEndpointInputSchemas.updateProfile,
		output: TinyFishEndpointOutputSchemas.updateProfile,
	},
	'profiles.delete': {
		input: TinyFishEndpointInputSchemas.deleteProfile,
		output: TinyFishEndpointOutputSchemas.deleteProfile,
	},
	'wallet.get': {
		input: TinyFishEndpointInputSchemas.getWallet,
		output: TinyFishEndpointOutputSchemas.getWallet,
	},
	'vault.list': {
		input: TinyFishEndpointInputSchemas.listVaultItems,
		output: TinyFishEndpointOutputSchemas.listVaultItems,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tinyFishEndpointsNested
>;

const tinyFishWebhookSchemas = {
	'run.completed': {
		description: 'A run reached COMPLETED with its results attached',
		payload: RunCompletedEventSchema,
		response: RunCompletedEventSchema,
	},
	'run.failed': {
		description: 'A run reached FAILED with its error attached',
		payload: RunFailedEventSchema,
		response: RunFailedEventSchema,
	},
	'run.cancelled': {
		description: 'A run reached CANCELLED',
		payload: RunCancelledEventSchema,
		response: RunCancelledEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof tinyFishWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tinyFishEndpointMeta = {
	'search.search': {
		riskLevel: 'read',
		description:
			'Search the web with intent, date, domain and academic filters',
	},
	'search.usage': {
		riskLevel: 'read',
		description: 'List recent search requests and their stored results',
	},
	'fetch.fetch': {
		riskLevel: 'read',
		description:
			'Fetch up to 10 URLs as markdown, HTML or JSON with cache revalidation',
	},
	'fetch.usage': {
		riskLevel: 'read',
		description: 'List recent fetch requests and their outcomes',
	},
	'browser.createSession': {
		riskLevel: 'write',
		description:
			'Start a cloud browser session and return its CDP connection URL',
	},
	'browser.terminateSession': {
		riskLevel: 'write',
		description: 'Terminate a cloud browser session',
	},
	'browser.usage': {
		riskLevel: 'read',
		description: 'List browser session usage and byte volumes',
	},
	'agent.run': {
		riskLevel: 'write',
		description:
			'Automate a goal on a live website and wait for the result (billed per step)',
	},
	'agent.runAsync': {
		riskLevel: 'write',
		description:
			'Queue a web automation run and return its run ID (billed per step)',
	},
	'agent.runBatch': {
		riskLevel: 'write',
		description:
			'Queue up to 100 automation runs in a single atomic request (billed per step)',
	},
	'agent.listRuns': {
		riskLevel: 'read',
		description: 'List automation runs with status and date filters',
	},
	'agent.getRun': {
		riskLevel: 'read',
		description: 'Get one run with its steps, screenshots and HTML artifacts',
	},
	'agent.getRuns': {
		riskLevel: 'read',
		description: 'Get up to 100 runs by ID in one request',
	},
	'agent.cancelRun': {
		riskLevel: 'write',
		description: 'Cancel a pending or running run',
	},
	'agent.cancelRuns': {
		riskLevel: 'write',
		description: 'Cancel up to 100 runs in one request',
	},
	'agent.getStepScreenshot': {
		riskLevel: 'read',
		description: 'Get the JPEG screenshot captured at one step of a run',
	},
	'agent.getStepHtml': {
		riskLevel: 'read',
		description: 'Get the full-page HTML snapshot captured at one step',
	},
	'research.start': {
		riskLevel: 'write',
		description: 'Start a cited research run and return its research run ID',
	},
	'research.list': {
		riskLevel: 'read',
		description: 'List research runs with status and date filters',
	},
	'research.get': {
		riskLevel: 'read',
		description: 'Get a research run with its plan, evidence and report',
	},
	'research.cancel': {
		riskLevel: 'write',
		description: 'Cancel a research run',
	},
	'profiles.list': {
		riskLevel: 'read',
		description: 'List Browser Context Profiles',
	},
	'profiles.create': {
		riskLevel: 'write',
		description: 'Create a Browser Context Profile',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get a profile with the domains it has saved state for',
	},
	'profiles.update': {
		riskLevel: 'write',
		description:
			'Rename a profile or change its proxy country and default flag',
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a profile and all of its saved cookies and sessions',
	},
	'wallet.get': {
		riskLevel: 'read',
		description: 'Get the wallet balance, pending top-up and per-product rates',
	},
	'vault.list': {
		riskLevel: 'read',
		description:
			'List vault items and the credential IDs a run body can reference',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tinyFishEndpointsNested>;

export const tinyFishAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTinyFishPlugin<T extends TinyFishPluginOptions> = CorsairPlugin<
	'tinyfish',
	typeof TinyFishSchema,
	typeof tinyFishEndpointsNested,
	typeof tinyFishWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTinyFishPlugin = BaseTinyFishPlugin<TinyFishPluginOptions>;

export type ExternalTinyFishPlugin<T extends TinyFishPluginOptions> =
	BaseTinyFishPlugin<T>;

export function tinyfish<const T extends TinyFishPluginOptions>(
	incomingOptions: TinyFishPluginOptions & T = {} as TinyFishPluginOptions & T,
): ExternalTinyFishPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tinyfish',
		authConfig: tinyFishAuthConfig,
		schema: TinyFishSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: tinyFishEndpointsNested,
		webhooks: tinyFishWebhooksNested,
		endpointMeta: tinyFishEndpointMeta,
		endpointSchemas: tinyfishEndpointSchemas,
		webhookSchemas: tinyFishWebhookSchemas,
		pluginWebhookMatcher: matchTinyFishPluginWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TinyFishKeyBuilderContext, source) => {
			// TinyFish deliveries are unsigned, so there is no secret to
			// resolve for webhook sources; handlers validate the payload.
			if (source === 'webhook') {
				return '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) {
					return key;
				}
			}

			throw new AuthMissingError('tinyfish', 'api_key');
		},
	} satisfies InternalTinyFishPlugin;
}

export type {
	AgentRun,
	BrowserSession,
	BrowserUsageInput,
	BrowserUsageResponse,
	CancelResearchRunInput,
	CancelResearchRunResponse,
	CancelRunInput,
	CancelRunResponse,
	CancelRunsInput,
	CancelRunsResponse,
	CreateBrowserSessionInput,
	CreateProfileInput,
	CreateProfileResponse,
	DeleteProfileInput,
	DeleteProfileResponse,
	FetchInput,
	FetchResponse,
	FetchResult,
	FetchUsageInput,
	FetchUsageResponse,
	GetProfileInput,
	GetResearchRunInput,
	GetRunInput,
	GetRunsInput,
	GetRunsResponse,
	GetStepHtmlInput,
	GetStepHtmlResponse,
	GetStepScreenshotInput,
	GetStepScreenshotResponse,
	GetWalletInput,
	ListProfilesInput,
	ListProfilesResponse,
	ListResearchRunsInput,
	ListResearchRunsResponse,
	ListRunsInput,
	ListRunsResponse,
	ListVaultItemsInput,
	ListVaultItemsResponse,
	Profile,
	ResearchRun,
	RunAsyncInput,
	RunAsyncResponse,
	RunBatchInput,
	RunBatchResponse,
	RunInput,
	RunResponse,
	RunStep,
	RunSummary,
	SearchInput,
	SearchResponse,
	SearchResult,
	SearchUsageInput,
	SearchUsageResponse,
	StartResearchInput,
	StartResearchResponse,
	TerminateBrowserSessionInput,
	TinyFishEndpointInputs,
	TinyFishEndpointOutputs,
	UpdateProfileInput,
	VaultItem,
	Wallet,
} from './endpoints/types';
export type {
	RunCancelledEvent,
	RunCompletedEvent,
	RunFailedEvent,
	TinyFishWebhookOutputs,
	TinyFishWebhookPayload,
} from './webhooks/types';
