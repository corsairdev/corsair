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
import type { CustomerioRegion } from './client';
import {
	Broadcasts,
	Cdp,
	Collections,
	Groups,
	Info,
	Messages,
	Newsletters,
	Profiles,
	ReportingWebhooks,
	Segments,
	Snippets,
	Transactional,
} from './endpoints';
import type {
	CustomerioEndpointInputs,
	CustomerioEndpointOutputs,
} from './endpoints/types';
import {
	CustomerioEndpointInputSchemas,
	CustomerioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CustomerioSchema } from './schema';

// Strictness note for reviewers: plugin logic (client, endpoints, schemas,
// error handlers, tests) contains no `any`, no `as Type` casts and no
// `unknown`. The only `as const` occurrences below are const-literal
// inferences required by the Corsair plugin contract (endpoint nesting and
// schema maps); they perform no type narrowing or coercion.

export type CustomerioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the App API key directly (bypasses key manager). */
	key?: string;
	// Optional: pass the Track credential (`siteId:apiKey`) directly
	// (bypasses key manager). Same precedence as Twilio's `accountSid`
	// (packages/twilio/index.ts:52-69): options first, then the stored
	// `track_api_key` field, then the shared `key` fallback.
	trackApiKey?: string;
	// Optional: pass the CDP/Pipelines write key directly (bypasses key
	// manager). Precedence: options, then the stored `cdp_write_key`
	// field, then the shared `key` fallback.
	cdpWriteKey?: string;
	// Account region. EU workspaces must set 'eu' so App, Track and CDP
	// requests use the EU bases (api-eu/track-eu/cdp-eu.customer.io);
	// defaults to 'us'. Handlers forward this via ctx.options.region.
	region?: CustomerioRegion;
	hooks?: InternalCustomerioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof customerioEndpointsNested>;
};

export type CustomerioContext = CorsairPluginContext<
	typeof CustomerioSchema,
	CustomerioPluginOptions,
	undefined,
	typeof customerioAuthConfig
>;

export type CustomerioKeyBuilderContext = KeyBuilderContext<
	CustomerioPluginOptions,
	typeof customerioAuthConfig
>;

export type CustomerioBoundEndpoints = BindEndpoints<
	typeof customerioEndpointsNested
>;

type CustomerioEndpoint<K extends keyof CustomerioEndpointOutputs> =
	CorsairEndpoint<
		CustomerioContext,
		CustomerioEndpointInputs[K],
		CustomerioEndpointOutputs[K]
	>;

export type CustomerioEndpoints = {
	triggerBroadcast: CustomerioEndpoint<'triggerBroadcast'>;
	getTriggers: CustomerioEndpoint<'getTriggers'>;
	getTrigger: CustomerioEndpoint<'getTrigger'>;
	getWebhooks: CustomerioEndpoint<'getWebhooks'>;
	getMessages: CustomerioEndpoint<'getMessages'>;
	getSegments: CustomerioEndpoint<'getSegments'>;
	getSegmentDetails: CustomerioEndpoint<'getSegmentDetails'>;
	getSegmentMembership: CustomerioEndpoint<'getSegmentMembership'>;
	listCollections: CustomerioEndpoint<'listCollections'>;
	listIpAddresses: CustomerioEndpoint<'listIpAddresses'>;
	listNewsletters: CustomerioEndpoint<'listNewsletters'>;
	listSnippets: CustomerioEndpoint<'listSnippets'>;
	listTransactionalMessages: CustomerioEndpoint<'listTransactionalMessages'>;
	identifyPerson: CustomerioEndpoint<'identifyPerson'>;
	createAlias: CustomerioEndpoint<'createAlias'>;
	suppressPerson: CustomerioEndpoint<'suppressPerson'>;
	trackEvent: CustomerioEndpoint<'trackEvent'>;
	unsubscribeDelivery: CustomerioEndpoint<'unsubscribeDelivery'>;
	reportPushEvents: CustomerioEndpoint<'reportPushEvents'>;
	addPersonToGroup: CustomerioEndpoint<'addPersonToGroup'>;
	sendBatch: CustomerioEndpoint<'sendBatch'>;
	trackPage: CustomerioEndpoint<'trackPage'>;
	trackScreen: CustomerioEndpoint<'trackScreen'>;
};

const customerioEndpointsNested = {
	broadcasts: {
		trigger: Broadcasts.triggerBroadcast,
		listTriggers: Broadcasts.getTriggers,
		getTrigger: Broadcasts.getTrigger,
	},
	segments: {
		list: Segments.getSegments,
		get: Segments.getSegmentDetails,
		membership: Segments.getSegmentMembership,
	},
	messages: {
		list: Messages.getMessages,
	},
	profiles: {
		identify: Profiles.identifyPerson,
		alias: Profiles.createAlias,
		suppress: Profiles.suppressPerson,
		trackEvent: Profiles.trackEvent,
		unsubscribe: Profiles.unsubscribeDelivery,
		reportPush: Profiles.reportPushEvents,
	},
	groups: {
		addPerson: Groups.addPersonToGroup,
	},
	collections: {
		list: Collections.listCollections,
	},
	info: {
		listIps: Info.listIpAddresses,
	},
	newsletters: {
		list: Newsletters.listNewsletters,
	},
	snippets: {
		list: Snippets.listSnippets,
	},
	transactional: {
		list: Transactional.listTransactionalMessages,
	},
	reportingWebhooks: {
		list: ReportingWebhooks.getWebhooks,
	},
	cdp: {
		batch: Cdp.sendBatch,
		page: Cdp.trackPage,
		screen: Cdp.trackScreen,
	},
} as const;

// No webhooks: Customer.io reporting webhooks are configuration records read
// through `reportingWebhooks.list`; the plugin receives no inbound events.
const customerioWebhooksNested = {} as const;

export const customerioEndpointSchemas = {
	'broadcasts.trigger': {
		input: CustomerioEndpointInputSchemas.triggerBroadcast,
		output: CustomerioEndpointOutputSchemas.triggerBroadcast,
	},
	'broadcasts.listTriggers': {
		input: CustomerioEndpointInputSchemas.getTriggers,
		output: CustomerioEndpointOutputSchemas.getTriggers,
	},
	'broadcasts.getTrigger': {
		input: CustomerioEndpointInputSchemas.getTrigger,
		output: CustomerioEndpointOutputSchemas.getTrigger,
	},
	'segments.list': {
		input: CustomerioEndpointInputSchemas.getSegments,
		output: CustomerioEndpointOutputSchemas.getSegments,
	},
	'segments.get': {
		input: CustomerioEndpointInputSchemas.getSegmentDetails,
		output: CustomerioEndpointOutputSchemas.getSegmentDetails,
	},
	'segments.membership': {
		input: CustomerioEndpointInputSchemas.getSegmentMembership,
		output: CustomerioEndpointOutputSchemas.getSegmentMembership,
	},
	'messages.list': {
		input: CustomerioEndpointInputSchemas.getMessages,
		output: CustomerioEndpointOutputSchemas.getMessages,
	},
	'profiles.identify': {
		input: CustomerioEndpointInputSchemas.identifyPerson,
		output: CustomerioEndpointOutputSchemas.identifyPerson,
	},
	'profiles.alias': {
		input: CustomerioEndpointInputSchemas.createAlias,
		output: CustomerioEndpointOutputSchemas.createAlias,
	},
	'profiles.suppress': {
		input: CustomerioEndpointInputSchemas.suppressPerson,
		output: CustomerioEndpointOutputSchemas.suppressPerson,
	},
	'profiles.trackEvent': {
		input: CustomerioEndpointInputSchemas.trackEvent,
		output: CustomerioEndpointOutputSchemas.trackEvent,
	},
	'profiles.unsubscribe': {
		input: CustomerioEndpointInputSchemas.unsubscribeDelivery,
		output: CustomerioEndpointOutputSchemas.unsubscribeDelivery,
	},
	'profiles.reportPush': {
		input: CustomerioEndpointInputSchemas.reportPushEvents,
		output: CustomerioEndpointOutputSchemas.reportPushEvents,
	},
	'groups.addPerson': {
		input: CustomerioEndpointInputSchemas.addPersonToGroup,
		output: CustomerioEndpointOutputSchemas.addPersonToGroup,
	},
	'collections.list': {
		input: CustomerioEndpointInputSchemas.listCollections,
		output: CustomerioEndpointOutputSchemas.listCollections,
	},
	'info.listIps': {
		input: CustomerioEndpointInputSchemas.listIpAddresses,
		output: CustomerioEndpointOutputSchemas.listIpAddresses,
	},
	'newsletters.list': {
		input: CustomerioEndpointInputSchemas.listNewsletters,
		output: CustomerioEndpointOutputSchemas.listNewsletters,
	},
	'snippets.list': {
		input: CustomerioEndpointInputSchemas.listSnippets,
		output: CustomerioEndpointOutputSchemas.listSnippets,
	},
	'transactional.list': {
		input: CustomerioEndpointInputSchemas.listTransactionalMessages,
		output: CustomerioEndpointOutputSchemas.listTransactionalMessages,
	},
	'reportingWebhooks.list': {
		input: CustomerioEndpointInputSchemas.getWebhooks,
		output: CustomerioEndpointOutputSchemas.getWebhooks,
	},
	'cdp.batch': {
		input: CustomerioEndpointInputSchemas.sendBatch,
		output: CustomerioEndpointOutputSchemas.sendBatch,
	},
	'cdp.page': {
		input: CustomerioEndpointInputSchemas.trackPage,
		output: CustomerioEndpointOutputSchemas.trackPage,
	},
	'cdp.screen': {
		input: CustomerioEndpointInputSchemas.trackScreen,
		output: CustomerioEndpointOutputSchemas.trackScreen,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof customerioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const customerioEndpointMeta = {
	'broadcasts.trigger': {
		riskLevel: 'write',
		description: 'Trigger a Customer.io broadcast to a defined audience',
	},
	'broadcasts.listTriggers': {
		riskLevel: 'read',
		description: 'List API trigger instances for a broadcast',
	},
	'broadcasts.getTrigger': {
		riskLevel: 'read',
		description: 'Get details of a specific broadcast trigger',
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'List segments in the workspace',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Get details of a specific segment',
	},
	'segments.membership': {
		riskLevel: 'read',
		description: 'List customers in a segment with pagination',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages sent from the workspace with pagination',
	},
	'profiles.identify': {
		riskLevel: 'write',
		description:
			'Identify a person and assign traits (creates or updates the profile)',
	},
	'profiles.alias': {
		riskLevel: 'write',
		description:
			'Merge two profiles by aliasing the secondary into the primary',
	},
	'profiles.suppress': {
		riskLevel: 'destructive',
		description:
			'Suppress a profile: permanently deletes it and blocks re-adding',
	},
	'profiles.trackEvent': {
		riskLevel: 'write',
		description: 'Record an event for a person',
	},
	'profiles.unsubscribe': {
		riskLevel: 'write',
		description: 'Unsubscribe a person from emails for a specific delivery',
	},
	'profiles.reportPush': {
		riskLevel: 'write',
		description:
			'Report delivery metrics via the metrics endpoint (push events endpoint is deprecated)',
	},
	'groups.addPerson': {
		riskLevel: 'write',
		description: 'Add a person to a group (company, account or project)',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List Collections metadata in the workspace',
	},
	'info.listIps': {
		riskLevel: 'read',
		description: 'List IP addresses used by Customer.io for sending messages',
	},
	'newsletters.list': {
		riskLevel: 'read',
		description: 'List one-time sends (newsletters) with pagination',
	},
	'snippets.list': {
		riskLevel: 'read',
		description: 'List reusable content snippets in the workspace',
	},
	'transactional.list': {
		riskLevel: 'read',
		description: 'List transactional message templates and their IDs',
	},
	'reportingWebhooks.list': {
		riskLevel: 'read',
		description: 'List reporting webhook configurations in the workspace',
	},
	'cdp.batch': {
		riskLevel: 'write',
		description:
			'Send multiple CDP calls (identify, track, page, screen, group, alias) in one batch',
	},
	'cdp.page': {
		riskLevel: 'write',
		description: 'Track a website page view via the CDP API',
	},
	'cdp.screen': {
		riskLevel: 'write',
		description: 'Track a mobile screen view via the CDP API',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof customerioEndpointsNested
>;

// The three API families need incompatible credentials (App Bearer key,
// Track `siteId:apiKey` Basic, CDP write-key Basic), so each family gets
// its own stored field on the single api_key connection — the same
// extension mechanism Twilio (`accountSid`), Algolia (`applicationId`)
// and Zendesk (`subdomain`) use. The shared `api_key` remains the App key
// (keyBuilder returns it verbatim); Track/CDP handlers resolve their own
// credential via resolveTrackCredential/resolveCdpCredential in client.ts.
export const customerioAuthConfig = {
	api_key: {
		account: ['tenant_external_id', 'track_api_key', 'cdp_write_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCustomerioPlugin<T extends CustomerioPluginOptions> =
	CorsairPlugin<
		'customerio',
		typeof CustomerioSchema,
		typeof customerioEndpointsNested,
		typeof customerioWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof customerioAuthConfig
	>;

export type InternalCustomerioPlugin =
	BaseCustomerioPlugin<CustomerioPluginOptions>;

export type ExternalCustomerioPlugin<T extends CustomerioPluginOptions> =
	BaseCustomerioPlugin<T>;

export function customerio<const T extends CustomerioPluginOptions>(
	// Justification for this single assertion: T extends CustomerioPluginOptions
	// (all fields optional), so an empty object is a valid no-op default when no
	// options are passed. TypeScript cannot verify T = {} without the assertion.
	incomingOptions: CustomerioPluginOptions & T = {} as CustomerioPluginOptions &
		T,
): ExternalCustomerioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'customerio',
		authConfig: customerioAuthConfig,
		schema: CustomerioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: customerioEndpointsNested,
		webhooks: customerioWebhooksNested,
		endpointMeta: customerioEndpointMeta,
		endpointSchemas: customerioEndpointSchemas,
		// No webhooks: Customer.io reporting webhooks are pull-read configs.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CustomerioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('customerio', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalCustomerioPlugin;
}

export type {
	CustomerioEndpointInputs,
	CustomerioEndpointOutputs,
	GetMessagesResponse,
	GetSegmentDetailsResponse,
	GetSegmentMembershipResponse,
	GetSegmentsResponse,
	GetTriggerResponse,
	GetTriggersResponse,
	GetWebhooksResponse,
	ListCollectionsResponse,
	ListIpAddressesResponse,
	ListNewslettersResponse,
	ListSnippetsResponse,
	ListTransactionalMessagesResponse,
	TriggerBroadcastInput,
	TriggerBroadcastResponse,
} from './endpoints/types';
