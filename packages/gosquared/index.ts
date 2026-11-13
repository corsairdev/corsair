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
	Auth,
	Chat,
	Now,
	People,
	Tracking,
	Trends,
} from './endpoints';
import type {
	GosquaredEndpointInputs,
	GosquaredEndpointOutputs,
} from './endpoints/types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GosquaredSchema } from './schema';

export type GosquaredPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	siteToken?: string;
	hooks?: InternalGosquaredPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gosquaredEndpointsNested>;
};

export type GosquaredContext = CorsairPluginContext<
	typeof GosquaredSchema,
	GosquaredPluginOptions
>;

export type GosquaredKeyBuilderContext =
	KeyBuilderContext<GosquaredPluginOptions>;

export type GosquaredBoundEndpoints = BindEndpoints<
	typeof gosquaredEndpointsNested
>;

export type GosquaredEndpoint<K extends keyof GosquaredEndpointOutputs> =
	CorsairEndpoint<
		GosquaredContext,
		GosquaredEndpointInputs[K],
		GosquaredEndpointOutputs[K]
	>;

export type GosquaredEndpoints = {
	[K in keyof GosquaredEndpointOutputs]: GosquaredEndpoint<K>;
};

const gosquaredEndpointsNested = {
	account: {
		getSites: Account.getSites,
		createSite: Account.createSite,
		getSite: Account.getSite,
		getSharedUsers: Account.getSharedUsers,
		getBlocked: Account.getBlocked,
	},
	now: {
		getOverview: Now.getOverview,
		getConcurrents: Now.getConcurrents,
		getPages: Now.getPages,
		getSources: Now.getSources,
		getTimeSeries: Now.getTimeSeries,
		getBrowsers: Now.getBrowsers,
		getCountries: Now.getCountries,
		getPlatforms: Now.getPlatforms,
		getVisitors: Now.getVisitors,
		getGeo: Now.getGeo,
		getCampaigns: Now.getCampaigns,
	},
	trends: {
		getAggregate: Trends.getAggregate,
		getBrowser: Trends.getBrowser,
		getCountry: Trends.getCountry,
		getEvent: Trends.getEvent,
		getLanguage: Trends.getLanguage,
		getOrganisation: Trends.getOrganisation,
		getOs: Trends.getOs,
		getPage: Trends.getPage,
		getPath1: Trends.getPath1,
		getScreenDimensions: Trends.getScreenDimensions,
		getSources: Trends.getSources,
	},
	people: {
		getPeople: People.getPeople,
		getPerson: People.getPerson,
		getPersonFeed: People.getPersonFeed,
		getPersonDevices: People.getPersonDevices,
		getSmartGroups: People.getSmartGroups,
		getDevices: People.getDevices,
		getDevice: People.getDevice,
		getEventTypes: People.getEventTypes,
		getPropertyTypes: People.getPropertyTypes,
	},
	tracking: {
		trackEvent: Tracking.trackEvent,
		identify: Tracking.identify,
		trackTransaction: Tracking.trackTransaction,
		trackPageview: Tracking.trackPageview,
	},
	chat: {
		getChats: Chat.getChats,
		getChat: Chat.getChat,
		getChatFeed: Chat.getChatFeed,
		archiveChat: Chat.archiveChat,
		unarchiveChat: Chat.unarchiveChat,
		sendMessage: Chat.sendMessage,
	},
	auth: {
		getTokenInfo: Auth.getTokenInfo,
	},
} as const;

export const gosquaredEndpointSchemas = {
	'account.getSites': {
		input: GosquaredEndpointInputSchemas['account.getSites'],
		output: GosquaredEndpointOutputSchemas['account.getSites'],
	},
	'account.createSite': {
		input: GosquaredEndpointInputSchemas['account.createSite'],
		output: GosquaredEndpointOutputSchemas['account.createSite'],
	},
	'account.getSite': {
		input: GosquaredEndpointInputSchemas['account.getSite'],
		output: GosquaredEndpointOutputSchemas['account.getSite'],
	},
	'account.getSharedUsers': {
		input: GosquaredEndpointInputSchemas['account.getSharedUsers'],
		output: GosquaredEndpointOutputSchemas['account.getSharedUsers'],
	},
	'account.getBlocked': {
		input: GosquaredEndpointInputSchemas['account.getBlocked'],
		output: GosquaredEndpointOutputSchemas['account.getBlocked'],
	},
	'now.getOverview': {
		input: GosquaredEndpointInputSchemas['now.getOverview'],
		output: GosquaredEndpointOutputSchemas['now.getOverview'],
	},
	'now.getConcurrents': {
		input: GosquaredEndpointInputSchemas['now.getConcurrents'],
		output: GosquaredEndpointOutputSchemas['now.getConcurrents'],
	},
	'now.getPages': {
		input: GosquaredEndpointInputSchemas['now.getPages'],
		output: GosquaredEndpointOutputSchemas['now.getPages'],
	},
	'now.getSources': {
		input: GosquaredEndpointInputSchemas['now.getSources'],
		output: GosquaredEndpointOutputSchemas['now.getSources'],
	},
	'now.getTimeSeries': {
		input: GosquaredEndpointInputSchemas['now.getTimeSeries'],
		output: GosquaredEndpointOutputSchemas['now.getTimeSeries'],
	},
	'now.getBrowsers': {
		input: GosquaredEndpointInputSchemas['now.getBrowsers'],
		output: GosquaredEndpointOutputSchemas['now.getBrowsers'],
	},
	'now.getCountries': {
		input: GosquaredEndpointInputSchemas['now.getCountries'],
		output: GosquaredEndpointOutputSchemas['now.getCountries'],
	},
	'now.getPlatforms': {
		input: GosquaredEndpointInputSchemas['now.getPlatforms'],
		output: GosquaredEndpointOutputSchemas['now.getPlatforms'],
	},
	'now.getVisitors': {
		input: GosquaredEndpointInputSchemas['now.getVisitors'],
		output: GosquaredEndpointOutputSchemas['now.getVisitors'],
	},
	'now.getGeo': {
		input: GosquaredEndpointInputSchemas['now.getGeo'],
		output: GosquaredEndpointOutputSchemas['now.getGeo'],
	},
	'now.getCampaigns': {
		input: GosquaredEndpointInputSchemas['now.getCampaigns'],
		output: GosquaredEndpointOutputSchemas['now.getCampaigns'],
	},
	'trends.getAggregate': {
		input: GosquaredEndpointInputSchemas['trends.getAggregate'],
		output: GosquaredEndpointOutputSchemas['trends.getAggregate'],
	},
	'trends.getBrowser': {
		input: GosquaredEndpointInputSchemas['trends.getBrowser'],
		output: GosquaredEndpointOutputSchemas['trends.getBrowser'],
	},
	'trends.getCountry': {
		input: GosquaredEndpointInputSchemas['trends.getCountry'],
		output: GosquaredEndpointOutputSchemas['trends.getCountry'],
	},
	'trends.getEvent': {
		input: GosquaredEndpointInputSchemas['trends.getEvent'],
		output: GosquaredEndpointOutputSchemas['trends.getEvent'],
	},
	'trends.getLanguage': {
		input: GosquaredEndpointInputSchemas['trends.getLanguage'],
		output: GosquaredEndpointOutputSchemas['trends.getLanguage'],
	},
	'trends.getOrganisation': {
		input: GosquaredEndpointInputSchemas['trends.getOrganisation'],
		output: GosquaredEndpointOutputSchemas['trends.getOrganisation'],
	},
	'trends.getOs': {
		input: GosquaredEndpointInputSchemas['trends.getOs'],
		output: GosquaredEndpointOutputSchemas['trends.getOs'],
	},
	'trends.getPage': {
		input: GosquaredEndpointInputSchemas['trends.getPage'],
		output: GosquaredEndpointOutputSchemas['trends.getPage'],
	},
	'trends.getPath1': {
		input: GosquaredEndpointInputSchemas['trends.getPath1'],
		output: GosquaredEndpointOutputSchemas['trends.getPath1'],
	},
	'trends.getScreenDimensions': {
		input: GosquaredEndpointInputSchemas['trends.getScreenDimensions'],
		output: GosquaredEndpointOutputSchemas['trends.getScreenDimensions'],
	},
	'trends.getSources': {
		input: GosquaredEndpointInputSchemas['trends.getSources'],
		output: GosquaredEndpointOutputSchemas['trends.getSources'],
	},
	'people.getPeople': {
		input: GosquaredEndpointInputSchemas['people.getPeople'],
		output: GosquaredEndpointOutputSchemas['people.getPeople'],
	},
	'people.getPerson': {
		input: GosquaredEndpointInputSchemas['people.getPerson'],
		output: GosquaredEndpointOutputSchemas['people.getPerson'],
	},
	'people.getPersonFeed': {
		input: GosquaredEndpointInputSchemas['people.getPersonFeed'],
		output: GosquaredEndpointOutputSchemas['people.getPersonFeed'],
	},
	'people.getPersonDevices': {
		input: GosquaredEndpointInputSchemas['people.getPersonDevices'],
		output: GosquaredEndpointOutputSchemas['people.getPersonDevices'],
	},
	'people.getSmartGroups': {
		input: GosquaredEndpointInputSchemas['people.getSmartGroups'],
		output: GosquaredEndpointOutputSchemas['people.getSmartGroups'],
	},
	'people.getDevices': {
		input: GosquaredEndpointInputSchemas['people.getDevices'],
		output: GosquaredEndpointOutputSchemas['people.getDevices'],
	},
	'people.getDevice': {
		input: GosquaredEndpointInputSchemas['people.getDevice'],
		output: GosquaredEndpointOutputSchemas['people.getDevice'],
	},
	'people.getEventTypes': {
		input: GosquaredEndpointInputSchemas['people.getEventTypes'],
		output: GosquaredEndpointOutputSchemas['people.getEventTypes'],
	},
	'people.getPropertyTypes': {
		input: GosquaredEndpointInputSchemas['people.getPropertyTypes'],
		output: GosquaredEndpointOutputSchemas['people.getPropertyTypes'],
	},
	'tracking.trackEvent': {
		input: GosquaredEndpointInputSchemas['tracking.trackEvent'],
		output: GosquaredEndpointOutputSchemas['tracking.trackEvent'],
	},
	'tracking.identify': {
		input: GosquaredEndpointInputSchemas['tracking.identify'],
		output: GosquaredEndpointOutputSchemas['tracking.identify'],
	},
	'tracking.trackTransaction': {
		input: GosquaredEndpointInputSchemas['tracking.trackTransaction'],
		output: GosquaredEndpointOutputSchemas['tracking.trackTransaction'],
	},
	'tracking.trackPageview': {
		input: GosquaredEndpointInputSchemas['tracking.trackPageview'],
		output: GosquaredEndpointOutputSchemas['tracking.trackPageview'],
	},
	'chat.getChats': {
		input: GosquaredEndpointInputSchemas['chat.getChats'],
		output: GosquaredEndpointOutputSchemas['chat.getChats'],
	},
	'chat.getChat': {
		input: GosquaredEndpointInputSchemas['chat.getChat'],
		output: GosquaredEndpointOutputSchemas['chat.getChat'],
	},
	'chat.getChatFeed': {
		input: GosquaredEndpointInputSchemas['chat.getChatFeed'],
		output: GosquaredEndpointOutputSchemas['chat.getChatFeed'],
	},
	'chat.archiveChat': {
		input: GosquaredEndpointInputSchemas['chat.archiveChat'],
		output: GosquaredEndpointOutputSchemas['chat.archiveChat'],
	},
	'chat.unarchiveChat': {
		input: GosquaredEndpointInputSchemas['chat.unarchiveChat'],
		output: GosquaredEndpointOutputSchemas['chat.unarchiveChat'],
	},
	'chat.sendMessage': {
		input: GosquaredEndpointInputSchemas['chat.sendMessage'],
		output: GosquaredEndpointOutputSchemas['chat.sendMessage'],
	},
	'auth.getTokenInfo': {
		input: GosquaredEndpointInputSchemas['auth.getTokenInfo'],
		output: GosquaredEndpointOutputSchemas['auth.getTokenInfo'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gosquaredEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const gosquaredEndpointMeta = {
	'account.getSites': {
		riskLevel: 'read',
		description: 'Retrieve all sites accessible by the GoSquared account',
	},
	'account.createSite': {
		riskLevel: 'write',
		description: 'Create and provision a new site for tracking in GoSquared',
	},
	'account.getSite': {
		riskLevel: 'read',
		description: 'Retrieve configuration and details for a specific site',
	},
	'account.getSharedUsers': {
		riskLevel: 'read',
		description: 'Retrieve team members with access to a GoSquared project',
	},
	'account.getBlocked': {
		riskLevel: 'read',
		description: 'Retrieve blocked IP addresses and bot settings for a site',
	},
	'now.getOverview': {
		riskLevel: 'read',
		description:
			'Retrieve real-time summary of concurrent visitors and traffic',
	},
	'now.getConcurrents': {
		riskLevel: 'read',
		description: 'Retrieve current count of concurrent visitors online',
	},
	'now.getPages': {
		riskLevel: 'read',
		description: 'Retrieve top active pages viewed right now',
	},
	'now.getSources': {
		riskLevel: 'read',
		description: 'Retrieve current traffic sources referring active visitors',
	},
	'now.getTimeSeries': {
		riskLevel: 'read',
		description: 'Retrieve recent time series of concurrent visitor activity',
	},
	'now.getBrowsers': {
		riskLevel: 'read',
		description: 'Retrieve browsers currently in use by active visitors',
	},
	'now.getCountries': {
		riskLevel: 'read',
		description: 'Retrieve countries of origin for active online visitors',
	},
	'now.getPlatforms': {
		riskLevel: 'read',
		description: 'Retrieve operating platforms used by active online visitors',
	},
	'now.getVisitors': {
		riskLevel: 'read',
		description: 'Retrieve detailed list of active concurrent visitors',
	},
	'now.getGeo': {
		riskLevel: 'read',
		description: 'Retrieve real-time visitor geographic coordinate clusters',
	},
	'now.getCampaigns': {
		riskLevel: 'read',
		description: 'Retrieve active marketing campaigns driving current traffic',
	},
	'trends.getAggregate': {
		riskLevel: 'read',
		description: 'Retrieve aggregate historical trends and total metrics',
	},
	'trends.getBrowser': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic breakdown by browser',
	},
	'trends.getCountry': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic breakdown by country',
	},
	'trends.getEvent': {
		riskLevel: 'read',
		description: 'Retrieve historical custom event tracking metrics',
	},
	'trends.getLanguage': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic breakdown by visitor language',
	},
	'trends.getOrganisation': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic by visiting organization/ISP',
	},
	'trends.getOs': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic breakdown by operating system',
	},
	'trends.getPage': {
		riskLevel: 'read',
		description: 'Retrieve historical pageview and URL performance metrics',
	},
	'trends.getPath1': {
		riskLevel: 'read',
		description: 'Retrieve historical top-level URL path segment metrics',
	},
	'trends.getScreenDimensions': {
		riskLevel: 'read',
		description: 'Retrieve historical screen resolution metrics',
	},
	'trends.getSources': {
		riskLevel: 'read',
		description: 'Retrieve historical traffic sources and referral channels',
	},
	'people.getPeople': {
		riskLevel: 'read',
		description: 'Search and query customer profiles in People CRM',
	},
	'people.getPerson': {
		riskLevel: 'read',
		description: 'Retrieve a specific person profile by ID or email',
	},
	'people.getPersonFeed': {
		riskLevel: 'read',
		description: 'Retrieve chronological interaction feed for a person',
	},
	'people.getPersonDevices': {
		riskLevel: 'read',
		description: 'Retrieve devices associated with a person in People CRM',
	},
	'people.getSmartGroups': {
		riskLevel: 'read',
		description: 'Retrieve saved smart groups and segment criteria',
	},
	'people.getDevices': {
		riskLevel: 'read',
		description: 'Retrieve paginated list of all tracked user devices',
	},
	'people.getDevice': {
		riskLevel: 'read',
		description: 'Retrieve technical specifications for a single device',
	},
	'people.getEventTypes': {
		riskLevel: 'read',
		description: 'Retrieve custom event type definitions in People CRM',
	},
	'people.getPropertyTypes': {
		riskLevel: 'read',
		description: 'Retrieve user property type definitions in People CRM',
	},
	'tracking.trackEvent': {
		riskLevel: 'write',
		description: 'Track a custom user event with optional event data',
	},
	'tracking.identify': {
		riskLevel: 'write',
		description: 'Identify or update user profile traits in People CRM',
	},
	'tracking.trackTransaction': {
		riskLevel: 'write',
		description: 'Track an e-commerce purchase transaction with line items',
	},
	'tracking.trackPageview': {
		riskLevel: 'write',
		description: 'Track a pageview with URL and page title',
	},
	'chat.getChats': {
		riskLevel: 'read',
		description: 'Retrieve active conversation threads in GoSquared Live Chat',
	},
	'chat.getChat': {
		riskLevel: 'read',
		description: 'Retrieve a specific live chat conversation by ID',
	},
	'chat.getChatFeed': {
		riskLevel: 'read',
		description: 'Retrieve message history and event feed for a chat',
	},
	'chat.archiveChat': {
		riskLevel: 'write',
		description: 'Archive an active chat conversation',
	},
	'chat.unarchiveChat': {
		riskLevel: 'write',
		description: 'Unarchive a previously archived chat conversation',
	},
	'chat.sendMessage': {
		riskLevel: 'destructive',
		description: 'Send a message in a chat conversation',
	},
	'auth.getTokenInfo': {
		riskLevel: 'read',
		description:
			'Validate API key and retrieve associated scopes and token info',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof gosquaredEndpointsNested
>;

export const gosquaredAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGosquaredPlugin<T extends GosquaredPluginOptions> =
	CorsairPlugin<
		'gosquared',
		typeof GosquaredSchema,
		typeof gosquaredEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalGosquaredPlugin =
	BaseGosquaredPlugin<GosquaredPluginOptions>;

export type ExternalGosquaredPlugin<T extends GosquaredPluginOptions> =
	BaseGosquaredPlugin<T>;

export function gosquared<const T extends GosquaredPluginOptions>(
	incomingOptions: GosquaredPluginOptions & T = {} as GosquaredPluginOptions &
		T,
): ExternalGosquaredPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const combinedErrorHandlers: CorsairErrorHandler = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'gosquared',
		authConfig: gosquaredAuthConfig,
		schema: GosquaredSchema,
		options,
		hooks: options.hooks,
		endpoints: gosquaredEndpointsNested,
		webhooks: {},
		endpointMeta: gosquaredEndpointMeta,
		endpointSchemas: gosquaredEndpointSchemas,
		errorHandlers: combinedErrorHandlers,
		keyBuilder: async (ctx: GosquaredKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('gosquared', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('gosquared', 'api_key');
			return apiKey;
		},
	} satisfies InternalGosquaredPlugin;
}

export type {
	GosquaredEndpointInputs,
	GosquaredEndpointOutputs,
	Site,
} from './endpoints/types';
