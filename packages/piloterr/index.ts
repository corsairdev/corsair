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
import { Account, Email, Google, LinkedIn, Web } from './endpoints';
import type {
	PiloterrEndpointInputs,
	PiloterrEndpointOutputs,
} from './endpoints/types';
import {
	PiloterrEndpointInputSchemas,
	PiloterrEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PiloterrSchema } from './schema';

export type PiloterrPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPiloterrPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof piloterrEndpointsNested>;
};

export type PiloterrContext = CorsairPluginContext<
	typeof PiloterrSchema,
	PiloterrPluginOptions,
	undefined,
	typeof piloterrAuthConfig
>;

export type PiloterrKeyBuilderContext = KeyBuilderContext<
	PiloterrPluginOptions,
	typeof piloterrAuthConfig
>;

export type PiloterrBoundEndpoints = BindEndpoints<
	typeof piloterrEndpointsNested
>;

type PiloterrEndpoint<K extends keyof PiloterrEndpointOutputs> =
	CorsairEndpoint<
		PiloterrContext,
		PiloterrEndpointInputs[K],
		PiloterrEndpointOutputs[K]
	>;

export type PiloterrEndpoints = {
	[K in keyof PiloterrEndpointOutputs]: PiloterrEndpoint<K>;
};

const piloterrEndpointsNested = {
	web: {
		crawler: Web.crawler,
		rendering: Web.rendering,
		screenshot: Web.screenshot,
		technology: Web.technology,
		emailPhoneExtractor: Web.emailPhoneExtractor,
		webunlocker: Web.webunlocker,
	},
	google: {
		search: Google.search,
		searchAutocomplete: Google.searchAutocomplete,
		news: Google.news,
	},
	linkedin: {
		companyInfo: LinkedIn.companyInfo,
		profileInfo: LinkedIn.profileInfo,
		jobInfo: LinkedIn.jobInfo,
		jobSearch: LinkedIn.jobSearch,
		postInfo: LinkedIn.postInfo,
	},
	email: {
		finder: Email.finder,
		verify: Email.verify,
		analyzes: Email.analyzes,
	},
	account: {
		usage: Account.usage,
		getJob: Account.getJob,
	},
} as const;

export const piloterrEndpointSchemas = {
	'web.crawler': {
		input: PiloterrEndpointInputSchemas.webCrawler,
		output: PiloterrEndpointOutputSchemas.webCrawler,
	},
	'web.rendering': {
		input: PiloterrEndpointInputSchemas.webRendering,
		output: PiloterrEndpointOutputSchemas.webRendering,
	},
	'web.screenshot': {
		input: PiloterrEndpointInputSchemas.webScreenshot,
		output: PiloterrEndpointOutputSchemas.webScreenshot,
	},
	'web.technology': {
		input: PiloterrEndpointInputSchemas.webTechnology,
		output: PiloterrEndpointOutputSchemas.webTechnology,
	},
	'web.emailPhoneExtractor': {
		input: PiloterrEndpointInputSchemas.webEmailPhoneExtractor,
		output: PiloterrEndpointOutputSchemas.webEmailPhoneExtractor,
	},
	'web.webunlocker': {
		input: PiloterrEndpointInputSchemas.webWebunlocker,
		output: PiloterrEndpointOutputSchemas.webWebunlocker,
	},
	'google.search': {
		input: PiloterrEndpointInputSchemas.googleSearch,
		output: PiloterrEndpointOutputSchemas.googleSearch,
	},
	'google.searchAutocomplete': {
		input: PiloterrEndpointInputSchemas.googleSearchAutocomplete,
		output: PiloterrEndpointOutputSchemas.googleSearchAutocomplete,
	},
	'google.news': {
		input: PiloterrEndpointInputSchemas.googleNews,
		output: PiloterrEndpointOutputSchemas.googleNews,
	},
	'linkedin.companyInfo': {
		input: PiloterrEndpointInputSchemas.linkedinCompanyInfo,
		output: PiloterrEndpointOutputSchemas.linkedinCompanyInfo,
	},
	'linkedin.profileInfo': {
		input: PiloterrEndpointInputSchemas.linkedinProfileInfo,
		output: PiloterrEndpointOutputSchemas.linkedinProfileInfo,
	},
	'linkedin.jobInfo': {
		input: PiloterrEndpointInputSchemas.linkedinJobInfo,
		output: PiloterrEndpointOutputSchemas.linkedinJobInfo,
	},
	'linkedin.jobSearch': {
		input: PiloterrEndpointInputSchemas.linkedinJobSearch,
		output: PiloterrEndpointOutputSchemas.linkedinJobSearch,
	},
	'linkedin.postInfo': {
		input: PiloterrEndpointInputSchemas.linkedinPostInfo,
		output: PiloterrEndpointOutputSchemas.linkedinPostInfo,
	},
	'email.finder': {
		input: PiloterrEndpointInputSchemas.emailFinder,
		output: PiloterrEndpointOutputSchemas.emailFinder,
	},
	'email.verify': {
		input: PiloterrEndpointInputSchemas.emailVerify,
		output: PiloterrEndpointOutputSchemas.emailVerify,
	},
	'email.analyzes': {
		input: PiloterrEndpointInputSchemas.emailAnalyzes,
		output: PiloterrEndpointOutputSchemas.emailAnalyzes,
	},
	'account.usage': {
		input: PiloterrEndpointInputSchemas.usageGet,
		output: PiloterrEndpointOutputSchemas.usageGet,
	},
	'account.getJob': {
		input: PiloterrEndpointInputSchemas.jobsGet,
		output: PiloterrEndpointOutputSchemas.jobsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof piloterrEndpointsNested
>;

export const piloterrEndpointMeta = {
	'web.crawler': {
		riskLevel: 'read',
		description: 'Fetch a public page with fast HTTP crawling, no JavaScript',
	},
	'web.rendering': {
		riskLevel: 'read',
		description: 'Render a JavaScript-heavy page in a headless browser',
	},
	'web.screenshot': {
		riskLevel: 'read',
		description: 'Capture a webpage as an image or PDF file',
	},
	'web.technology': {
		riskLevel: 'read',
		description: 'Detect the technology stack behind a website',
	},
	'web.emailPhoneExtractor': {
		riskLevel: 'read',
		description:
			'Extract emails, phone numbers and social profiles from a site',
	},
	'web.webunlocker': {
		riskLevel: 'read',
		description: 'Unlock a bot-protected page on a whitelisted domain',
	},
	'google.search': {
		riskLevel: 'read',
		description: 'Scrape Google search results with filters and pagination',
	},
	'google.searchAutocomplete': {
		riskLevel: 'read',
		description: 'Fetch Google autocomplete suggestions for a query',
	},
	'google.news': {
		riskLevel: 'read',
		description: 'Scrape Google News results for a query',
	},
	'linkedin.companyInfo': {
		riskLevel: 'read',
		description:
			'Read LinkedIn company firmographics by slug, URL, ID or domain',
	},
	'linkedin.profileInfo': {
		riskLevel: 'read',
		description: 'Read a LinkedIn member profile by username, URL or member ID',
	},
	'linkedin.jobInfo': {
		riskLevel: 'read',
		description: 'Read a LinkedIn job posting by ID or URL',
	},
	'linkedin.jobSearch': {
		riskLevel: 'read',
		description:
			'Search LinkedIn jobs with seniority, type and location filters',
	},
	'linkedin.postInfo': {
		riskLevel: 'read',
		description: 'Read a LinkedIn post with its comments',
	},
	'email.finder': {
		riskLevel: 'read',
		description: 'Find a verified professional email by name and company',
	},
	'email.verify': {
		riskLevel: 'read',
		description: 'Verify whether an email address is deliverable',
	},
	'email.analyzes': {
		riskLevel: 'read',
		description: 'Analyze a domain email infrastructure and SPF records',
	},
	'account.usage': {
		riskLevel: 'read',
		description: 'Read remaining quota, packs, credits and rate limits (free)',
	},
	'account.getJob': {
		riskLevel: 'read',
		description: 'Poll the status and result of an async job (free)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof piloterrEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const piloterrAuthConfig = {
	api_key: {
		// Piloterr issues one API key per key record in the dashboard; no
		// account-level field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePiloterrPlugin<T extends PiloterrPluginOptions> = CorsairPlugin<
	'piloterr',
	typeof PiloterrSchema,
	typeof piloterrEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof piloterrAuthConfig
>;

export type InternalPiloterrPlugin = BasePiloterrPlugin<PiloterrPluginOptions>;

export type ExternalPiloterrPlugin<T extends PiloterrPluginOptions> =
	BasePiloterrPlugin<T>;

export function piloterr<const T extends PiloterrPluginOptions>(
	incomingOptions: PiloterrPluginOptions & T = {} as PiloterrPluginOptions & T,
): ExternalPiloterrPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'piloterr',
		authConfig: piloterrAuthConfig,
		schema: PiloterrSchema,
		options: options,
		hooks: options.hooks,
		endpoints: piloterrEndpointsNested,
		webhooks: {},
		endpointMeta: piloterrEndpointMeta,
		endpointSchemas: piloterrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PiloterrKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('piloterr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPiloterrPlugin;
}

export { PiloterrAPIError } from './client';

export type {
	JobStatus,
	OrganicResult,
	Pagination,
	PiloterrEndpointInputs,
	PiloterrEndpointOutputs,
	ScreenshotFile,
} from './endpoints/types';
