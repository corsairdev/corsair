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
import { Account, Jobs, Scrape } from './endpoints';
import type {
	ScrapeDoEndpointInputs,
	ScrapeDoEndpointOutputs,
} from './endpoints/types';
import {
	ScrapeDoEndpointInputSchemas,
	ScrapeDoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ScrapeDoSchema } from './schema';

export type ScrapeDoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalScrapeDoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof scrapeDoEndpointsNested>;
};

export type ScrapeDoContext = CorsairPluginContext<
	typeof ScrapeDoSchema,
	ScrapeDoPluginOptions
>;

export type ScrapeDoKeyBuilderContext =
	KeyBuilderContext<ScrapeDoPluginOptions>;

export type ScrapeDoBoundEndpoints = BindEndpoints<
	typeof scrapeDoEndpointsNested
>;

type ScrapeDoEndpoint<K extends keyof ScrapeDoEndpointOutputs> =
	CorsairEndpoint<
		ScrapeDoContext,
		ScrapeDoEndpointInputs[K],
		ScrapeDoEndpointOutputs[K]
	>;

export type ScrapeDoEndpoints = {
	scrapeHtml: ScrapeDoEndpoint<'scrapeHtml'>;
	scrapeMarkdown: ScrapeDoEndpoint<'scrapeMarkdown'>;
	scrapeJson: ScrapeDoEndpoint<'scrapeJson'>;
	scrapeScreenshot: ScrapeDoEndpoint<'scrapeScreenshot'>;
	accountInfo: ScrapeDoEndpoint<'accountInfo'>;
	asyncAccount: ScrapeDoEndpoint<'asyncAccount'>;
	jobsStart: ScrapeDoEndpoint<'jobsStart'>;
	jobsGet: ScrapeDoEndpoint<'jobsGet'>;
	jobsResult: ScrapeDoEndpoint<'jobsResult'>;
	jobsCancel: ScrapeDoEndpoint<'jobsCancel'>;
	jobsList: ScrapeDoEndpoint<'jobsList'>;
};

const scrapeDoEndpointsNested = {
	scrape: {
		html: Scrape.html,
		markdown: Scrape.markdown,
		json: Scrape.json,
		screenshot: Scrape.screenshot,
	},
	account: {
		info: Account.info,
		asyncInfo: Account.asyncInfo,
	},
	jobs: {
		start: Jobs.start,
		get: Jobs.get,
		result: Jobs.result,
		cancel: Jobs.cancel,
		list: Jobs.list,
	},
} as const;

export const scrapeDoEndpointSchemas = {
	'scrape.html': {
		input: ScrapeDoEndpointInputSchemas.scrapeHtml,
		output: ScrapeDoEndpointOutputSchemas.scrapeHtml,
	},
	'scrape.markdown': {
		input: ScrapeDoEndpointInputSchemas.scrapeMarkdown,
		output: ScrapeDoEndpointOutputSchemas.scrapeMarkdown,
	},
	'scrape.json': {
		input: ScrapeDoEndpointInputSchemas.scrapeJson,
		output: ScrapeDoEndpointOutputSchemas.scrapeJson,
	},
	'scrape.screenshot': {
		input: ScrapeDoEndpointInputSchemas.scrapeScreenshot,
		output: ScrapeDoEndpointOutputSchemas.scrapeScreenshot,
	},
	'account.info': {
		input: ScrapeDoEndpointInputSchemas.accountInfo,
		output: ScrapeDoEndpointOutputSchemas.accountInfo,
	},
	'account.asyncInfo': {
		input: ScrapeDoEndpointInputSchemas.asyncAccount,
		output: ScrapeDoEndpointOutputSchemas.asyncAccount,
	},
	'jobs.start': {
		input: ScrapeDoEndpointInputSchemas.jobsStart,
		output: ScrapeDoEndpointOutputSchemas.jobsStart,
	},
	'jobs.get': {
		input: ScrapeDoEndpointInputSchemas.jobsGet,
		output: ScrapeDoEndpointOutputSchemas.jobsGet,
	},
	'jobs.result': {
		input: ScrapeDoEndpointInputSchemas.jobsResult,
		output: ScrapeDoEndpointOutputSchemas.jobsResult,
	},
	'jobs.cancel': {
		input: ScrapeDoEndpointInputSchemas.jobsCancel,
		output: ScrapeDoEndpointOutputSchemas.jobsCancel,
	},
	'jobs.list': {
		input: ScrapeDoEndpointInputSchemas.jobsList,
		output: ScrapeDoEndpointOutputSchemas.jobsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof scrapeDoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Every scrape operation is a read: it fetches a page and changes nothing.
 *
 * `jobs.start` is a write because it creates provider state — a job that holds
 * concurrency and results until they expire — and `jobs.cancel` is a write
 * because it stops work that was asked for. Neither destroys data, so neither is
 * irreversible. `jobs.start` declares an `EndpointJob` so an agent can read the
 * job back instead of polling the scrape.
 */
const scrapeDoEndpointMeta = {
	'scrape.html': {
		riskLevel: 'read',
		description:
			'Fetch a page through the proxy with its status code; costs credits that vary by proxy and rendering',
	},
	'scrape.markdown': {
		riskLevel: 'read',
		description: 'Fetch a page and return it converted to Markdown',
	},
	'scrape.json': {
		riskLevel: 'read',
		description:
			'Fetch a page as a JSON report with its status, content and network requests',
	},
	'scrape.screenshot': {
		riskLevel: 'read',
		description:
			'Render a page in the headless browser and return base64 PNG screenshots',
	},
	'account.info': {
		riskLevel: 'read',
		description:
			'Read the subscription state, concurrency limit and requests left this month; costs nothing but is limited to 10 calls a minute',
	},
	'account.asyncInfo': {
		riskLevel: 'read',
		description:
			'Read the async pool concurrency, active jobs and credits left; costs nothing',
	},
	'jobs.start': {
		riskLevel: 'write',
		description:
			'Start an async job for up to 100 URLs and return its job and task ids; results are held by Scrape.do until they expire',
		job: {
			idPath: 'job_id',
			status: {
				op: 'jobs.get',
				idArg: 'jobId',
				statusPath: 'status',
				// Captured live: queued -> success | error | canceled.
				done: ['success'],
				failed: ['error', 'canceled'],
			},
			cancel: { op: 'jobs.cancel', idArg: 'jobId' },
		},
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Read an async job with its status and one entry per target',
	},
	'jobs.result': {
		riskLevel: 'read',
		description:
			'Read one task result with the page content, its status and when it expires',
	},
	'jobs.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a queued or running job; a finished job cannot be cancelled',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'List async jobs with paging',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof scrapeDoEndpointsNested>;

export type BaseScrapeDoPlugin<T extends ScrapeDoPluginOptions> = CorsairPlugin<
	'scrapedo',
	typeof ScrapeDoSchema,
	typeof scrapeDoEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalScrapeDoPlugin = BaseScrapeDoPlugin<ScrapeDoPluginOptions>;

export type ExternalScrapeDoPlugin<T extends ScrapeDoPluginOptions> =
	BaseScrapeDoPlugin<T>;

export function scrapedo<const T extends ScrapeDoPluginOptions>(
	incomingOptions: ScrapeDoPluginOptions & T = {} as ScrapeDoPluginOptions & T,
): ExternalScrapeDoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'scrapedo',
		schema: ScrapeDoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: scrapeDoEndpointsNested,
		webhooks: {},
		endpointMeta: scrapeDoEndpointMeta,
		endpointSchemas: scrapeDoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ScrapeDoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('scrapedo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalScrapeDoPlugin;
}

export { ScrapeDoAPIError } from './client';

export type {
	AccountInfoResponse,
	AsyncAccountResponse,
	JobsCancelInput,
	JobsCancelResponse,
	JobsGetInput,
	JobsGetResponse,
	JobsListInput,
	JobsListResponse,
	JobsResultInput,
	JobsResultResponse,
	JobsStartInput,
	JobsStartResponse,
	ScrapeDoEndpointInputs,
	ScrapeDoEndpointOutputs,
	ScrapeHtmlInput,
	ScrapeHtmlResponse,
	ScrapeJsonInput,
	ScrapeJsonResponse,
	ScrapeMarkdownInput,
	ScrapeMarkdownResponse,
	ScrapeScreenshotInput,
	ScrapeScreenshotResponse,
} from './endpoints/types';
