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
import {
	EventCategories,
	Events,
	Forms,
	Site,
	Subscribers,
	Waivers,
	Webhooks,
} from './endpoints';
import type {
	WaiverFileEndpointInputs,
	WaiverFileEndpointOutputs,
} from './endpoints/types';
import {
	WaiverFileEndpointInputSchemas,
	WaiverFileEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WaiverFileSchema } from './schema';

export type WaiverFilePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The API key and the site ID it belongs to, separated by a newline:
	 * `<apiKey>\n<siteID>`. Every route needs both, and there is only one key
	 * slot.
	 */
	key?: string;
	hooks?: InternalWaiverFilePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof waiverFileEndpointsNested>;
};

export type WaiverFileContext = CorsairPluginContext<
	typeof WaiverFileSchema,
	WaiverFilePluginOptions
>;

export type WaiverFileKeyBuilderContext =
	KeyBuilderContext<WaiverFilePluginOptions>;

export type WaiverFileBoundEndpoints = BindEndpoints<
	typeof waiverFileEndpointsNested
>;

type WaiverFileEndpoint<K extends keyof WaiverFileEndpointOutputs> =
	CorsairEndpoint<
		WaiverFileContext,
		WaiverFileEndpointInputs[K],
		WaiverFileEndpointOutputs[K]
	>;

export type WaiverFileEndpoints = {
	ping: WaiverFileEndpoint<'ping'>;
	siteGet: WaiverFileEndpoint<'siteGet'>;
	waiversGet: WaiverFileEndpoint<'waiversGet'>;
	waiversGetLite: WaiverFileEndpoint<'waiversGetLite'>;
	waiversSearch: WaiverFileEndpoint<'waiversSearch'>;
	waiversByReference: WaiverFileEndpoint<'waiversByReference'>;
	waiversList: WaiverFileEndpoint<'waiversList'>;
	waiversListLite: WaiverFileEndpoint<'waiversListLite'>;
	waiversPageCount: WaiverFileEndpoint<'waiversPageCount'>;
	waiversData: WaiverFileEndpoint<'waiversData'>;
	waiversDataCount: WaiverFileEndpoint<'waiversDataCount'>;
	waiversPdf: WaiverFileEndpoint<'waiversPdf'>;
	formsActive: WaiverFileEndpoint<'formsActive'>;
	formsAll: WaiverFileEndpoint<'formsAll'>;
	eventsByDateRange: WaiverFileEndpoint<'eventsByDateRange'>;
	eventsByCategory: WaiverFileEndpoint<'eventsByCategory'>;
	eventsUpcoming: WaiverFileEndpoint<'eventsUpcoming'>;
	eventsWaivers: WaiverFileEndpoint<'eventsWaivers'>;
	eventsCreate: WaiverFileEndpoint<'eventsCreate'>;
	eventsUpdate: WaiverFileEndpoint<'eventsUpdate'>;
	eventsDelete: WaiverFileEndpoint<'eventsDelete'>;
	eventsInviteManagers: WaiverFileEndpoint<'eventsInviteManagers'>;
	eventsRemoveManagers: WaiverFileEndpoint<'eventsRemoveManagers'>;
	eventCategoriesList: WaiverFileEndpoint<'eventCategoriesList'>;
	eventCategoriesCreate: WaiverFileEndpoint<'eventCategoriesCreate'>;
	eventCategoriesUpdate: WaiverFileEndpoint<'eventCategoriesUpdate'>;
	eventCategoriesDelete: WaiverFileEndpoint<'eventCategoriesDelete'>;
	subscribersList: WaiverFileEndpoint<'subscribersList'>;
	subscribersOptedOut: WaiverFileEndpoint<'subscribersOptedOut'>;
	webhooksSubscribe: WaiverFileEndpoint<'webhooksSubscribe'>;
	webhooksUnsubscribe: WaiverFileEndpoint<'webhooksUnsubscribe'>;
};

const waiverFileEndpointsNested = {
	ping: {
		check: Site.ping,
	},
	site: {
		get: Site.get,
	},
	waivers: {
		get: Waivers.get,
		getLite: Waivers.getLite,
		search: Waivers.search,
		byReference: Waivers.byReference,
		list: Waivers.list,
		listLite: Waivers.listLite,
		pageCount: Waivers.pageCount,
		data: Waivers.data,
		dataCount: Waivers.dataCount,
		pdf: Waivers.pdf,
	},
	forms: {
		active: Forms.active,
		all: Forms.all,
	},
	events: {
		byDateRange: Events.byDateRange,
		byCategory: Events.byCategory,
		upcoming: Events.upcoming,
		waivers: Events.waivers,
		create: Events.create,
		update: Events.update,
		delete: Events.remove,
		inviteManagers: Events.inviteManagers,
		removeManagers: Events.removeManagers,
	},
	eventCategories: {
		list: EventCategories.list,
		create: EventCategories.create,
		update: EventCategories.update,
		delete: EventCategories.remove,
	},
	subscribers: {
		list: Subscribers.list,
		optedOut: Subscribers.optedOut,
	},
	webhooks: {
		subscribe: Webhooks.subscribe,
		unsubscribe: Webhooks.unsubscribe,
	},
} as const;

export const waiverFileEndpointSchemas = {
	'ping.check': {
		input: WaiverFileEndpointInputSchemas.ping,
		output: WaiverFileEndpointOutputSchemas.ping,
	},
	'site.get': {
		input: WaiverFileEndpointInputSchemas.siteGet,
		output: WaiverFileEndpointOutputSchemas.siteGet,
	},
	'waivers.get': {
		input: WaiverFileEndpointInputSchemas.waiversGet,
		output: WaiverFileEndpointOutputSchemas.waiversGet,
	},
	'waivers.getLite': {
		input: WaiverFileEndpointInputSchemas.waiversGetLite,
		output: WaiverFileEndpointOutputSchemas.waiversGetLite,
	},
	'waivers.search': {
		input: WaiverFileEndpointInputSchemas.waiversSearch,
		output: WaiverFileEndpointOutputSchemas.waiversSearch,
	},
	'waivers.byReference': {
		input: WaiverFileEndpointInputSchemas.waiversByReference,
		output: WaiverFileEndpointOutputSchemas.waiversByReference,
	},
	'waivers.list': {
		input: WaiverFileEndpointInputSchemas.waiversList,
		output: WaiverFileEndpointOutputSchemas.waiversList,
	},
	'waivers.listLite': {
		input: WaiverFileEndpointInputSchemas.waiversListLite,
		output: WaiverFileEndpointOutputSchemas.waiversListLite,
	},
	'waivers.pageCount': {
		input: WaiverFileEndpointInputSchemas.waiversPageCount,
		output: WaiverFileEndpointOutputSchemas.waiversPageCount,
	},
	'waivers.data': {
		input: WaiverFileEndpointInputSchemas.waiversData,
		output: WaiverFileEndpointOutputSchemas.waiversData,
	},
	'waivers.dataCount': {
		input: WaiverFileEndpointInputSchemas.waiversDataCount,
		output: WaiverFileEndpointOutputSchemas.waiversDataCount,
	},
	'waivers.pdf': {
		input: WaiverFileEndpointInputSchemas.waiversPdf,
		output: WaiverFileEndpointOutputSchemas.waiversPdf,
	},
	'forms.active': {
		input: WaiverFileEndpointInputSchemas.formsActive,
		output: WaiverFileEndpointOutputSchemas.formsActive,
	},
	'forms.all': {
		input: WaiverFileEndpointInputSchemas.formsAll,
		output: WaiverFileEndpointOutputSchemas.formsAll,
	},
	'events.byDateRange': {
		input: WaiverFileEndpointInputSchemas.eventsByDateRange,
		output: WaiverFileEndpointOutputSchemas.eventsByDateRange,
	},
	'events.byCategory': {
		input: WaiverFileEndpointInputSchemas.eventsByCategory,
		output: WaiverFileEndpointOutputSchemas.eventsByCategory,
	},
	'events.upcoming': {
		input: WaiverFileEndpointInputSchemas.eventsUpcoming,
		output: WaiverFileEndpointOutputSchemas.eventsUpcoming,
	},
	'events.waivers': {
		input: WaiverFileEndpointInputSchemas.eventsWaivers,
		output: WaiverFileEndpointOutputSchemas.eventsWaivers,
	},
	'events.create': {
		input: WaiverFileEndpointInputSchemas.eventsCreate,
		output: WaiverFileEndpointOutputSchemas.eventsCreate,
	},
	'events.update': {
		input: WaiverFileEndpointInputSchemas.eventsUpdate,
		output: WaiverFileEndpointOutputSchemas.eventsUpdate,
	},
	'events.delete': {
		input: WaiverFileEndpointInputSchemas.eventsDelete,
		output: WaiverFileEndpointOutputSchemas.eventsDelete,
	},
	'events.inviteManagers': {
		input: WaiverFileEndpointInputSchemas.eventsInviteManagers,
		output: WaiverFileEndpointOutputSchemas.eventsInviteManagers,
	},
	'events.removeManagers': {
		input: WaiverFileEndpointInputSchemas.eventsRemoveManagers,
		output: WaiverFileEndpointOutputSchemas.eventsRemoveManagers,
	},
	'eventCategories.list': {
		input: WaiverFileEndpointInputSchemas.eventCategoriesList,
		output: WaiverFileEndpointOutputSchemas.eventCategoriesList,
	},
	'eventCategories.create': {
		input: WaiverFileEndpointInputSchemas.eventCategoriesCreate,
		output: WaiverFileEndpointOutputSchemas.eventCategoriesCreate,
	},
	'eventCategories.update': {
		input: WaiverFileEndpointInputSchemas.eventCategoriesUpdate,
		output: WaiverFileEndpointOutputSchemas.eventCategoriesUpdate,
	},
	'eventCategories.delete': {
		input: WaiverFileEndpointInputSchemas.eventCategoriesDelete,
		output: WaiverFileEndpointOutputSchemas.eventCategoriesDelete,
	},
	'subscribers.list': {
		input: WaiverFileEndpointInputSchemas.subscribersList,
		output: WaiverFileEndpointOutputSchemas.subscribersList,
	},
	'subscribers.optedOut': {
		input: WaiverFileEndpointInputSchemas.subscribersOptedOut,
		output: WaiverFileEndpointOutputSchemas.subscribersOptedOut,
	},
	'webhooks.subscribe': {
		input: WaiverFileEndpointInputSchemas.webhooksSubscribe,
		output: WaiverFileEndpointOutputSchemas.webhooksSubscribe,
	},
	'webhooks.unsubscribe': {
		input: WaiverFileEndpointInputSchemas.webhooksUnsubscribe,
		output: WaiverFileEndpointOutputSchemas.webhooksUnsubscribe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof waiverFileEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const waiverFileEndpointMeta = {
	'ping.check': {
		riskLevel: 'read',
		description:
			'Check that the service is up and that the API key and site ID are valid; the cheapest way to verify credentials',
	},
	'site.get': {
		riskLevel: 'read',
		description:
			'Read the site behind the credentials: its name, timezone and contact details',
	},
	'waivers.get': {
		riskLevel: 'read',
		description:
			'Read a signed waiver in full: the agreement accepted, every participant, the signatures and the form answers',
	},
	'waivers.getLite': {
		riskLevel: 'read',
		description:
			'Read a signed waiver without the agreement text, event detail or signatures',
	},
	'waivers.search': {
		riskLevel: 'read',
		description:
			'Search waivers by name, or by whatever the site configures as quick-search fields',
	},
	'waivers.byReference': {
		riskLevel: 'read',
		description:
			'Find waivers by your own reference IDs, exactly matching any of the three fields',
	},
	'waivers.list': {
		riskLevel: 'read',
		description:
			'Page through full waivers signed in a date range; pageIndex starts at 0',
	},
	'waivers.listLite': {
		riskLevel: 'read',
		description:
			'Page through waivers signed in a date range, with the collected data only',
	},
	'waivers.pageCount': {
		riskLevel: 'read',
		description: 'Count the waivers in a date range, to plan the paging',
	},
	'waivers.data': {
		riskLevel: 'read',
		description:
			'Read report-style rows, one per participant, optionally with custom form columns; pageIndex starts at 1',
	},
	'waivers.dataCount': {
		riskLevel: 'read',
		description: 'Count the report rows a date range would return',
	},
	'waivers.pdf': {
		riskLevel: 'read',
		description:
			'Download a signed waiver as a PDF, returned base64-encoded in `content` with its byte length',
	},
	'forms.active': {
		riskLevel: 'read',
		description: 'List the waiver forms currently active on the site',
	},
	'forms.all': {
		riskLevel: 'read',
		description:
			'List every waiver form, including disabled and deleted ones, to resolve an older waiver',
	},
	'events.byDateRange': {
		riskLevel: 'read',
		description: 'List events in any category that fall within a date range',
	},
	'events.byCategory': {
		riskLevel: 'read',
		description: 'List events in one category within a date range',
	},
	'events.upcoming': {
		riskLevel: 'read',
		description: 'List events within a date range, capped at 3,000 by the API',
	},
	'events.waivers': {
		riskLevel: 'read',
		description: 'List the waivers signed for one event',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Create an event with its dates, category, attached forms and manager invitations; the credentials go in the body on this route',
	},
	'events.update': {
		riskLevel: 'write',
		description:
			'Change an event name, dates, category and attached forms; omitting the form list attaches every active form',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an event (marked deleted; signed waivers stay); the call is a GET, so it is not replayed on a failure',
	},
	'events.inviteManagers': {
		riskLevel: 'write',
		description:
			'Invite people to manage an event, optionally skipping those who already have an account',
	},
	'events.removeManagers': {
		riskLevel: 'write',
		description: 'Remove event manager access for the given addresses',
	},
	'eventCategories.list': {
		riskLevel: 'read',
		description: 'List event categories, optionally including disabled ones',
	},
	'eventCategories.create': {
		riskLevel: 'write',
		description: 'Create an event category, active or not',
	},
	'eventCategories.update': {
		riskLevel: 'write',
		description: 'Rename an event category and set whether it is active',
	},
	'eventCategories.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an event category; the events in it survive and lose their category',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description: 'List SMS subscribers added within a date range',
	},
	'subscribers.optedOut': {
		riskLevel: 'read',
		description:
			'List subscribers who opted out within a date range, which is what a suppression list needs',
	},
	'webhooks.subscribe': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to one WaiverFile trigger, such as newwaiver or newevent, so it is posted to on each occurrence',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe a URL from one trigger, which stops its deliveries without touching any other URL',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof waiverFileEndpointsNested
>;

export type BaseWaiverFilePlugin<T extends WaiverFilePluginOptions> =
	CorsairPlugin<
		'waiverfile',
		typeof WaiverFileSchema,
		typeof waiverFileEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalWaiverFilePlugin =
	BaseWaiverFilePlugin<WaiverFilePluginOptions>;

export type ExternalWaiverFilePlugin<T extends WaiverFilePluginOptions> =
	BaseWaiverFilePlugin<T>;

export function waiverfile<const T extends WaiverFilePluginOptions>(
	incomingOptions: WaiverFilePluginOptions & T = {} as WaiverFilePluginOptions &
		T,
): ExternalWaiverFilePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'waiverfile',
		schema: WaiverFileSchema,
		options: options,
		hooks: options.hooks,
		endpoints: waiverFileEndpointsNested,
		webhooks: {},
		endpointMeta: waiverFileEndpointMeta,
		endpointSchemas: waiverFileEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WaiverFileKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('waiverfile', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWaiverFilePlugin;
}

export {
	isWaiverFileFailure,
	parseWaiverFileKey,
	requireWaiverFileKey,
	WAIVERFILE_API_BASE,
	WaiverFileAPIError,
	WaiverFileConfigurationError,
} from './client';
export type {
	CategoriesCreateInput,
	CategoriesDeleteInput,
	CategoriesListInput,
	CategoriesResponse,
	CategoriesUpdateInput,
	CategoryMutationResponse,
	CountResponse,
	EventDeleteResponse,
	EventManagersResponse,
	EventResponse,
	EventsByCategoryInput,
	EventsByDateRangeInput,
	EventsCreateInput,
	EventsDeleteInput,
	EventsManagersInput,
	EventsResponse,
	EventsUpcomingInput,
	EventsUpdateInput,
	EventsWaiversInput,
	EventsWaiversResponse,
	FormsActiveInput,
	FormsAllInput,
	FormsResponse,
	PingInput,
	PingResponse,
	SearchResponse,
	SiteGetInput,
	SiteGetResponse,
	SubscribeInput,
	SubscribeResponse,
	SubscribersListInput,
	SubscribersOptedOutInput,
	SubscribersResponse,
	WaiverFileDataRow,
	WaiverFileEndpointInputs,
	WaiverFileEndpointOutputs,
	WaiverFileEvent,
	WaiverFileEventCategory,
	WaiverFileForm,
	WaiverFileParticipant,
	WaiverFileSite,
	WaiverFileSubscriber,
	WaiverFileTrigger,
	WaiverFileWaiver,
	WaiverFileWaiverLite,
	WaiverLiteResponse,
	WaiverResponse,
	WaiversByReferenceInput,
	WaiversDataCountInput,
	WaiversDataInput,
	WaiversDataResponse,
	WaiversGetInput,
	WaiversGetLiteInput,
	WaiversListInput,
	WaiversListLiteInput,
	WaiversListLiteResponse,
	WaiversListResponse,
	WaiversPageCountInput,
	WaiversPdfInput,
	WaiversPdfResponse,
	WaiversSearchInput,
} from './endpoints/types';
export { WAIVERFILE_WEBHOOK_TRIGGERS } from './endpoints/types';
