import type {
	AuthTypes,
	BindEndpoints,
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
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import { tryGetStoredKey } from './client';
import {
	Admin,
	Answers,
	Images,
	Llm,
	Local,
	News,
	Spellcheck,
	Suggest,
	Videos,
	Web,
} from './endpoints';
import {
	BraveSearchEndpointInputSchemas as Inputs,
	BraveSearchEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BraveSearchSchema } from './schema';

export type BraveSearchPluginOptions = {
	/** `managed_pricing` runs searches on Corsair's Brave Search key, billed in Corsair credits. */
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	/** Search API key, sent as `X-Subscription-Token`. */
	key?: string;
	/**
	 * Admin key (`bsk_admin_...`) for the `admin.*` operations only. Brave's
	 * Admin API takes a separate key, made on the dashboard's Admin keys page;
	 * a search key can't call it. Without it, the account's stored
	 * `admin_key` is used.
	 */
	adminKey?: string;
	hooks?: InternalBraveSearchPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof braveSearchEndpointsNested>;
};

/** `admin_key` is the optional Admin API key; searches never use it. */
export const braveSearchAuthConfig = {
	api_key: {
		account: ['admin_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BraveSearchContext = CorsairPluginContext<
	typeof BraveSearchSchema,
	BraveSearchPluginOptions,
	undefined,
	typeof braveSearchAuthConfig
>;

export type BraveSearchKeyBuilderContext = KeyBuilderContext<
	BraveSearchPluginOptions,
	typeof braveSearchAuthConfig
>;

const braveSearchEndpointsNested = {
	web: { search: Web.search, rich: Web.rich },
	llm: { context: Llm.context },
	news: { search: News.search },
	videos: { search: Videos.search },
	images: { search: Images.search },
	local: {
		placeSearch: Local.placeSearch,
		pois: Local.pois,
		descriptions: Local.descriptions,
	},
	suggest: { search: Suggest.search },
	spellcheck: { search: Spellcheck.search },
	answers: { create: Answers.create, research: Answers.research },
	admin: {
		me: Admin.me,
		usage: Admin.usage,
		listApiKeys: Admin.listApiKeys,
		listAdminKeys: Admin.listAdminKeys,
	},
} as const;

export type BraveSearchBoundEndpoints = BindEndpoints<
	typeof braveSearchEndpointsNested
>;

type Id = keyof typeof Inputs;
function schemas<const K extends readonly Id[]>(ids: K) {
	return Object.fromEntries(
		ids.map((id) => [id, { input: Inputs[id], output: Outputs[id] }]),
	) as {
		[P in K[number]]: {
			input: (typeof Inputs)[P];
			output: (typeof Outputs)[P];
		};
	};
}

export const braveSearchEndpointSchemas = schemas([
	'web.search',
	'web.rich',
	'llm.context',
	'news.search',
	'videos.search',
	'images.search',
	'local.placeSearch',
	'local.pois',
	'local.descriptions',
	'suggest.search',
	'spellcheck.search',
	'answers.create',
	'answers.research',
	'admin.me',
	'admin.usage',
	'admin.listApiKeys',
	'admin.listAdminKeys',
] as const) satisfies RequiredPluginEndpointSchemas<
	typeof braveSearchEndpointsNested
>;

// Every search is a metered read: its only cost is one request against the
// key's plan (R8). Research mode runs up to 50 searches for minutes and bills
// per search and per token, so it is marked destructive.
const braveSearchEndpointMeta = {
	'web.search': {
		riskLevel: 'read',
		description:
			'Search the web: ranked pages with snippets, plus news, videos, discussions, FAQ, infobox and local sections',
	},
	'web.rich': {
		riskLevel: 'read',
		description:
			'Get live rich data (weather, stocks, sports, currency ...) for a web.search callback key',
	},
	'llm.context': {
		riskLevel: 'read',
		description:
			'Search the web and get extracted page text, token-budgeted, for grounding an LLM',
	},
	'news.search': { riskLevel: 'read', description: 'Search news articles' },
	'videos.search': { riskLevel: 'read', description: 'Search videos' },
	'images.search': { riskLevel: 'read', description: 'Search images' },
	'local.placeSearch': {
		riskLevel: 'read',
		description:
			'Search businesses, landmarks and other places in an area by text or coordinates',
	},
	'local.pois': {
		riskLevel: 'read',
		description:
			'Get details (address, hours, rating, contact) for location ids from a search',
	},
	'local.descriptions': {
		riskLevel: 'read',
		description: 'Get AI-written descriptions for location ids from a search',
	},
	'suggest.search': {
		riskLevel: 'read',
		description: 'Get query autocomplete suggestions',
	},
	'spellcheck.search': {
		riskLevel: 'read',
		description: 'Get the spell-corrected form of a query',
	},
	'answers.create': {
		riskLevel: 'read',
		description:
			'Answer a question from one web search, with optional inline citations (Answers plan)',
	},
	'answers.research': {
		riskLevel: 'destructive',
		description:
			'Answer a question with multi-search deep research; can run minutes and bills per search and token (Answers plan)',
	},
	'admin.me': {
		riskLevel: 'read',
		description: 'Check the admin key and its organization',
	},
	'admin.usage': {
		riskLevel: 'read',
		description: 'Get API usage in time buckets by key, endpoint or plan',
	},
	'admin.listApiKeys': {
		riskLevel: 'read',
		description: "List the organization's search API keys (no secrets)",
	},
	'admin.listAdminKeys': {
		riskLevel: 'read',
		description: "List the organization's admin keys (no secrets)",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof braveSearchEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// Short-lived keys Hub mints for Corsair's own Brave Search key, one per
// metered operation, cached until they expire.
const braveSearchManagedPricingCache = createManagedPricingCredentialCache();

export type BaseBraveSearchPlugin<T extends BraveSearchPluginOptions> =
	CorsairPlugin<
		'bravesearch',
		typeof BraveSearchSchema,
		typeof braveSearchEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof braveSearchAuthConfig
	>;

export type InternalBraveSearchPlugin =
	BaseBraveSearchPlugin<BraveSearchPluginOptions>;

export type ExternalBraveSearchPlugin<T extends BraveSearchPluginOptions> =
	BaseBraveSearchPlugin<T>;

export function bravesearch<const T extends BraveSearchPluginOptions>(
	incomingOptions: BraveSearchPluginOptions &
		T = {} as BraveSearchPluginOptions & T,
): ExternalBraveSearchPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	// managed_pricing runs on Corsair's key, which core gets from Hub without
	// asking the keyBuilder, so an explicit key would be dropped silently and
	// the call billed to Corsair credits. The two can't both apply.
	if (options.authType === 'managed_pricing' && options.key) {
		throw new Error(
			"bravesearch: `key` can't be used with authType 'managed_pricing', which runs on Corsair's Brave Search key. Drop `key`, or use authType 'api_key' to call Brave with your own key.",
		);
	}
	return {
		id: 'bravesearch',
		authConfig: braveSearchAuthConfig,
		schema: BraveSearchSchema,
		options,
		hooks: options.hooks,
		endpoints: braveSearchEndpointsNested,
		webhooks: {},
		endpointMeta: braveSearchEndpointMeta,
		endpointSchemas: braveSearchEndpointSchemas,
		errorHandlers: (() => {
			// Core takes the first handler that matches and DEFAULT matches
			// everything, so DEFAULT stays last after a caller's handlers.
			const { DEFAULT: builtInDefault, ...specific } = errorHandlers;
			const { DEFAULT: callerDefault, ...caller } = options.errorHandlers ?? {};
			return {
				...specific,
				...caller,
				DEFAULT: callerDefault ?? builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: BraveSearchKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			// The Admin API takes its own key (bsk_admin_...), never the search
			// key: the adminKey option, else the stored admin_key. Hub prices no
			// admin.* operation, so managed_pricing refuses them before here.
			if (ctx.meteredOperationId?.startsWith('admin.')) {
				const adminKey =
					options.adminKey?.trim() ||
					(await tryGetStoredKey(
						// Only api_key accounts declare the admin_key field.
						ctx.keys && 'get_admin_key' in ctx.keys
							? ctx.keys.get_admin_key
							: undefined,
					));
				if (adminKey) return adminKey;
				throw new AuthMissingError('bravesearch', 'admin_key');
			}
			if (options.key?.trim()) return options.key;
			if (ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'bravesearch',
					cache: braveSearchManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}
			const stored = await tryGetStoredKey(ctx.keys?.get_api_key);
			if (stored) return stored;
			throw new AuthMissingError('bravesearch', 'api_key');
		},
	} satisfies InternalBraveSearchPlugin;
}

export {
	type AssembledAnswer,
	assembleAnswerStream,
	BRAVE_ADMIN_BASE,
	BRAVE_SEARCH_BASE,
} from './client';
export {
	BraveSearchEndpointInputSchemas,
	type BraveSearchEndpointInputs,
	BraveSearchEndpointOutputSchemas,
	type BraveSearchEndpointOutputs,
} from './endpoints/types';
