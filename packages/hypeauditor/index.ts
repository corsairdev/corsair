import type {
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
	asHypeAuditorKeys,
	packCredentials,
	resolveCredentials,
} from './client';
import { Account, Discovery, Lists, Media, Reports } from './endpoints';
import type {
	HypeAuditorEndpointInputs,
	HypeAuditorEndpointOutputs,
} from './endpoints/types';
import {
	HypeAuditorEndpointInputSchemas,
	HypeAuditorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { HypeAuditorSchema } from './schema';

export type HypeAuditorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	hooks?: InternalHypeAuditorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hypeauditorEndpointsNested>;
};

export type HypeAuditorContext = CorsairPluginContext<
	typeof HypeAuditorSchema,
	HypeAuditorPluginOptions
>;

export type HypeAuditorKeyBuilderContext = KeyBuilderContext<
	HypeAuditorPluginOptions,
	typeof hypeauditorAuthConfig
>;

export type HypeAuditorBoundEndpoints = BindEndpoints<
	typeof hypeauditorEndpointsNested
>;

type HypeAuditorEndpoint<K extends keyof HypeAuditorEndpointOutputs> =
	CorsairEndpoint<
		HypeAuditorContext,
		HypeAuditorEndpointInputs[K],
		HypeAuditorEndpointOutputs[K]
	>;

export type HypeAuditorEndpoints = {
	reportsInstagram: HypeAuditorEndpoint<'reports.instagram'>;
	reportsYoutube: HypeAuditorEndpoint<'reports.youtube'>;
	reportsTiktok: HypeAuditorEndpoint<'reports.tiktok'>;
	reportsTwitch: HypeAuditorEndpoint<'reports.twitch'>;
	reportsTwitter: HypeAuditorEndpoint<'reports.twitter'>;
	reportsSnapchat: HypeAuditorEndpoint<'reports.snapchat'>;
	mediaInstagram: HypeAuditorEndpoint<'media.instagram'>;
	mediaYoutube: HypeAuditorEndpoint<'media.youtube'>;
	mediaTiktok: HypeAuditorEndpoint<'media.tiktok'>;
	historyInstagram: HypeAuditorEndpoint<'history.instagram'>;
	historyYoutube: HypeAuditorEndpoint<'history.youtube'>;
	historyTiktok: HypeAuditorEndpoint<'history.tiktok'>;
	historyTwitch: HypeAuditorEndpoint<'history.twitch'>;
	historyTwitter: HypeAuditorEndpoint<'history.twitter'>;
	mentionsYoutube: HypeAuditorEndpoint<'mentions.youtube'>;
	mentionsTiktok: HypeAuditorEndpoint<'mentions.tiktok'>;
	discoverySearch: HypeAuditorEndpoint<'discovery.search'>;
	discoveryKeywords: HypeAuditorEndpoint<'discovery.keywords'>;
	listsList: HypeAuditorEndpoint<'lists.list'>;
	listsItems: HypeAuditorEndpoint<'lists.items'>;
	listsAdd: HypeAuditorEndpoint<'lists.add'>;
	listsRemove: HypeAuditorEndpoint<'lists.remove'>;
	accountPlanInfo: HypeAuditorEndpoint<'account.planInfo'>;
	accountUnlockedReports: HypeAuditorEndpoint<'account.unlockedReports'>;
	suggesterGet: HypeAuditorEndpoint<'suggester.get'>;
	taxonomyGet: HypeAuditorEndpoint<'taxonomy.get'>;
};

const hypeauditorEndpointsNested = {
	reports: {
		instagram: Reports.instagram,
		youtube: Reports.youtube,
		tiktok: Reports.tiktok,
		twitch: Reports.twitch,
		twitter: Reports.twitter,
		snapchat: Reports.snapchat,
	},
	media: {
		instagram: Media.instagramMedia,
		youtube: Media.youtubeMedia,
		tiktok: Media.tiktokMedia,
	},
	history: {
		instagram: Media.instagramHistory,
		youtube: Media.youtubeHistory,
		tiktok: Media.tiktokHistory,
		twitch: Media.twitchHistory,
		twitter: Media.twitterHistory,
	},
	mentions: {
		youtube: Media.youtubeMentions,
		tiktok: Media.tiktokMentions,
	},
	discovery: {
		search: Discovery.search,
		keywords: Discovery.keywords,
	},
	lists: {
		list: Lists.list,
		items: Lists.items,
		add: Lists.add,
		remove: Lists.remove,
	},
	account: {
		planInfo: Account.planInfo,
		unlockedReports: Account.unlockedReports,
	},
	suggester: {
		get: Account.suggester,
	},
	taxonomy: {
		get: Account.taxonomy,
	},
} as const;

export const hypeauditorEndpointSchemas = {
	'reports.instagram': {
		input: HypeAuditorEndpointInputSchemas['reports.instagram'],
		output: HypeAuditorEndpointOutputSchemas['reports.instagram'],
	},
	'reports.youtube': {
		input: HypeAuditorEndpointInputSchemas['reports.youtube'],
		output: HypeAuditorEndpointOutputSchemas['reports.youtube'],
	},
	'reports.tiktok': {
		input: HypeAuditorEndpointInputSchemas['reports.tiktok'],
		output: HypeAuditorEndpointOutputSchemas['reports.tiktok'],
	},
	'reports.twitch': {
		input: HypeAuditorEndpointInputSchemas['reports.twitch'],
		output: HypeAuditorEndpointOutputSchemas['reports.twitch'],
	},
	'reports.twitter': {
		input: HypeAuditorEndpointInputSchemas['reports.twitter'],
		output: HypeAuditorEndpointOutputSchemas['reports.twitter'],
	},
	'reports.snapchat': {
		input: HypeAuditorEndpointInputSchemas['reports.snapchat'],
		output: HypeAuditorEndpointOutputSchemas['reports.snapchat'],
	},
	'media.instagram': {
		input: HypeAuditorEndpointInputSchemas['media.instagram'],
		output: HypeAuditorEndpointOutputSchemas['media.instagram'],
	},
	'media.youtube': {
		input: HypeAuditorEndpointInputSchemas['media.youtube'],
		output: HypeAuditorEndpointOutputSchemas['media.youtube'],
	},
	'media.tiktok': {
		input: HypeAuditorEndpointInputSchemas['media.tiktok'],
		output: HypeAuditorEndpointOutputSchemas['media.tiktok'],
	},
	'history.instagram': {
		input: HypeAuditorEndpointInputSchemas['history.instagram'],
		output: HypeAuditorEndpointOutputSchemas['history.instagram'],
	},
	'history.youtube': {
		input: HypeAuditorEndpointInputSchemas['history.youtube'],
		output: HypeAuditorEndpointOutputSchemas['history.youtube'],
	},
	'history.tiktok': {
		input: HypeAuditorEndpointInputSchemas['history.tiktok'],
		output: HypeAuditorEndpointOutputSchemas['history.tiktok'],
	},
	'history.twitch': {
		input: HypeAuditorEndpointInputSchemas['history.twitch'],
		output: HypeAuditorEndpointOutputSchemas['history.twitch'],
	},
	'history.twitter': {
		input: HypeAuditorEndpointInputSchemas['history.twitter'],
		output: HypeAuditorEndpointOutputSchemas['history.twitter'],
	},
	'mentions.youtube': {
		input: HypeAuditorEndpointInputSchemas['mentions.youtube'],
		output: HypeAuditorEndpointOutputSchemas['mentions.youtube'],
	},
	'mentions.tiktok': {
		input: HypeAuditorEndpointInputSchemas['mentions.tiktok'],
		output: HypeAuditorEndpointOutputSchemas['mentions.tiktok'],
	},
	'discovery.search': {
		input: HypeAuditorEndpointInputSchemas['discovery.search'],
		output: HypeAuditorEndpointOutputSchemas['discovery.search'],
	},
	'discovery.keywords': {
		input: HypeAuditorEndpointInputSchemas['discovery.keywords'],
		output: HypeAuditorEndpointOutputSchemas['discovery.keywords'],
	},
	'lists.list': {
		input: HypeAuditorEndpointInputSchemas['lists.list'],
		output: HypeAuditorEndpointOutputSchemas['lists.list'],
	},
	'lists.items': {
		input: HypeAuditorEndpointInputSchemas['lists.items'],
		output: HypeAuditorEndpointOutputSchemas['lists.items'],
	},
	'lists.add': {
		input: HypeAuditorEndpointInputSchemas['lists.add'],
		output: HypeAuditorEndpointOutputSchemas['lists.add'],
	},
	'lists.remove': {
		input: HypeAuditorEndpointInputSchemas['lists.remove'],
		output: HypeAuditorEndpointOutputSchemas['lists.remove'],
	},
	'account.planInfo': {
		input: HypeAuditorEndpointInputSchemas['account.planInfo'],
		output: HypeAuditorEndpointOutputSchemas['account.planInfo'],
	},
	'account.unlockedReports': {
		input: HypeAuditorEndpointInputSchemas['account.unlockedReports'],
		output: HypeAuditorEndpointOutputSchemas['account.unlockedReports'],
	},
	'suggester.get': {
		input: HypeAuditorEndpointInputSchemas['suggester.get'],
		output: HypeAuditorEndpointOutputSchemas['suggester.get'],
	},
	'taxonomy.get': {
		input: HypeAuditorEndpointInputSchemas['taxonomy.get'],
		output: HypeAuditorEndpointOutputSchemas['taxonomy.get'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hypeauditorEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * The API token is the account's base `api_key` field, so a connect form asks
 * for it as the key; the Client ID is the one extra account field. Both are
 * read with the getters core generates (`get_api_key`, `get_client_id`).
 */
export const hypeauditorAuthConfig = {
	api_key: {
		account: ['client_id'] as const,
	},
} as const satisfies PluginAuthConfig;

/**
 * A report read and a discovery page spend a credit on the first request, but
 * they only return data: metered reads stay `read`, as in the Ahrefs plugin
 * (R8's `destructive` covers sends, purchases, paid generation jobs and
 * irreversible changes). The descriptions say which calls spend credits.
 */
export const hypeauditorEndpointMeta = {
	'reports.instagram': {
		riskLevel: 'read',
		description:
			'Read the Instagram report by username or user ID; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'reports.youtube': {
		riskLevel: 'read',
		description:
			'Read the YouTube report by channel ID or username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'reports.tiktok': {
		riskLevel: 'read',
		description:
			'Read the TikTok report by username or user ID; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'reports.twitch': {
		riskLevel: 'read',
		description:
			'Read the Twitch report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'reports.twitter': {
		riskLevel: 'read',
		description:
			'Read the Twitter report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'reports.snapchat': {
		riskLevel: 'read',
		description:
			'Read the Snapchat report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl`',
	},
	'media.instagram': {
		riskLevel: 'read',
		description:
			'Read an Instagram account’s recent media, which is free and safe to repeat',
	},
	'media.youtube': {
		riskLevel: 'read',
		description:
			'Read a YouTube channel’s media, one page at a time, which is free and safe to repeat',
	},
	'media.tiktok': {
		riskLevel: 'read',
		description:
			'Read a TikTok account’s media by channel ID, which is free and safe to repeat',
	},
	'history.instagram': {
		riskLevel: 'read',
		description:
			'Read the Instagram metrics history for a username. HypeAuditor unlocks the creator’s report on this call, so the first request for a creator spends a credit; repeating it is free',
	},
	'history.youtube': {
		riskLevel: 'read',
		description:
			'Read the YouTube metrics history for a channel. HypeAuditor documents that history calls unlock the creator’s report on the other networks, so treat the first request as spending a credit; repeating it is free',
	},
	'history.tiktok': {
		riskLevel: 'read',
		description:
			'Read the TikTok metrics history for a channel. HypeAuditor unlocks the creator’s report on this call, so the first request for a creator spends a credit; repeating it is free',
	},
	'history.twitch': {
		riskLevel: 'read',
		description:
			'Read the Twitch metrics history for a channel. HypeAuditor unlocks the creator’s report on this call, so the first request for a creator spends a credit; repeating it is free',
	},
	'history.twitter': {
		riskLevel: 'read',
		description:
			'Read the Twitter metrics history for a channel. HypeAuditor unlocks the creator’s report on this call, so the first request for a creator spends a credit; repeating it is free',
	},
	'mentions.youtube': {
		riskLevel: 'read',
		description:
			'Read the brands a YouTube channel’s videos mention, which is free and safe to repeat',
	},
	'mentions.tiktok': {
		riskLevel: 'read',
		description:
			'Read the brands a TikTok account’s videos mention, which is free and safe to repeat',
	},
	'discovery.search': {
		riskLevel: 'read',
		description:
			'Search creators with the documented filters, 20 per page; each page costs one discovery call, and `sandbox` answers sample data without spending one',
	},
	'discovery.keywords': {
		riskLevel: 'read',
		description:
			'Read the posts behind a keyword search by their content IDs, which is free and safe to repeat',
	},
	'lists.list': {
		riskLevel: 'read',
		description:
			'List the saved lists in the account; the default "Recent searches" list is `id: 0`',
	},
	'lists.items': {
		riskLevel: 'read',
		description:
			'Read the reports saved in one list, up to 100 per page, which is free and safe to repeat',
	},
	'lists.add': {
		riskLevel: 'write',
		description:
			'Add a report to a saved list; repeating it leaves the report in the list, so it is safe to retry',
	},
	'lists.remove': {
		riskLevel: 'write',
		description:
			'Remove a report from a saved list; the default "Recent searches" list cannot be changed',
	},
	'account.planInfo': {
		riskLevel: 'read',
		description:
			'Read the report credits and discovery calls left in the plan; API subscriptions only',
	},
	'account.unlockedReports': {
		riskLevel: 'read',
		description:
			'List the reports unlocked on the account, with `refunded` marking a credit returned after a failed build',
	},
	'suggester.get': {
		riskLevel: 'read',
		description:
			'Suggest a channel name from a partial one, which is free and safe to repeat',
	},
	'taxonomy.get': {
		riskLevel: 'read',
		description:
			'Read the category, thematics and language ids the discovery filters take',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof hypeauditorEndpointsNested
>;

export type BaseHypeAuditorPlugin<T extends HypeAuditorPluginOptions> =
	CorsairPlugin<
		'hypeauditor',
		typeof HypeAuditorSchema,
		typeof hypeauditorEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof hypeauditorAuthConfig
	>;

export type InternalHypeAuditorPlugin =
	BaseHypeAuditorPlugin<HypeAuditorPluginOptions>;

export type ExternalHypeAuditorPlugin<T extends HypeAuditorPluginOptions> =
	BaseHypeAuditorPlugin<T>;

export function hypeauditor<const T extends HypeAuditorPluginOptions>(
	incomingOptions: HypeAuditorPluginOptions &
		T = {} as HypeAuditorPluginOptions & T,
): ExternalHypeAuditorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hypeauditor',
		authConfig: hypeauditorAuthConfig,
		schema: HypeAuditorSchema,
		options,
		hooks: options.hooks,
		endpoints: hypeauditorEndpointsNested,
		webhooks: {},
		endpointMeta: hypeauditorEndpointMeta,
		endpointSchemas: hypeauditorEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: HypeAuditorKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('hypeauditor', 'api_key');
			}

			// Credentials come only from the stored account (R8), packed into the
			// one key string the binder hands endpoints as `ctx.key`.
			return packCredentials(
				await resolveCredentials(asHypeAuditorKeys(ctx.keys), 'hypeauditor'),
			);
		},
	} satisfies InternalHypeAuditorPlugin;
}

export type {
	HypeAuditorCredentials,
	HypeAuditorKeyManager,
} from './client';
export {
	HYPEAUDITOR_API_BASE,
	HYPEAUDITOR_API_VERSION,
	HypeAuditorAPIError,
	resolveCredentials,
} from './client';

export type {
	DiscoveryKeywordsInput,
	DiscoverySearchInput,
	HypeAuditorBooleanResult,
	HypeAuditorDiscoveryResponse,
	HypeAuditorEndpointInputs,
	HypeAuditorEndpointOutputs,
	HypeAuditorHistoryResponse,
	HypeAuditorList,
	HypeAuditorListItem,
	HypeAuditorListItemsResponse,
	HypeAuditorListsResponse,
	HypeAuditorMediaResponse,
	HypeAuditorMentionsResponse,
	HypeAuditorPlanInfoResponse,
	HypeAuditorReport,
	HypeAuditorReportOrPending,
	HypeAuditorReportPending,
	HypeAuditorReportResponse,
	HypeAuditorSuggesterResponse,
	HypeAuditorTaxonomyResponse,
	HypeAuditorUnlockedReport,
	HypeAuditorUnlockedReportsResponse,
	ListAddInput,
	ListItemsInput,
	ListRemoveInput,
	ListsInput,
	PlanInfoInput,
	ReportsByChannelInput,
	ReportsInstagramInput,
	ReportsTiktokInput,
	ReportsYoutubeInput,
	SuggesterInput,
	TaxonomyInput,
	UnlockedReportsInput,
	YoutubeMediaInput,
} from './endpoints/types';
