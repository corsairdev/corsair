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
	Auth,
	Clicks,
	Conversions,
	Domains,
	Links,
	Webhooks,
	Workspaces,
} from './endpoints';
import type {
	LinklyEndpointInputs,
	LinklyEndpointOutputs,
} from './endpoints/types';
import {
	LinklyEndpointInputSchemas,
	LinklyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LinklySchema } from './schema';

export type LinklyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLinklyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof linklyEndpointsNested>;
};

export type LinklyContext = CorsairPluginContext<
	typeof LinklySchema,
	LinklyPluginOptions
>;

export type LinklyKeyBuilderContext = KeyBuilderContext<LinklyPluginOptions>;

export type LinklyBoundEndpoints = BindEndpoints<typeof linklyEndpointsNested>;

type LinklyEndpoint<K extends keyof LinklyEndpointOutputs> = CorsairEndpoint<
	LinklyContext,
	LinklyEndpointInputs[K],
	LinklyEndpointOutputs[K]
>;

export type LinklyEndpoints = {
	workspacesListWorkspaces: LinklyEndpoint<'workspacesListWorkspaces'>;
	linksList: LinklyEndpoint<'linksList'>;
	linksGet: LinklyEndpoint<'linksGet'>;
	linksCreate: LinklyEndpoint<'linksCreate'>;
	linksUpdate: LinklyEndpoint<'linksUpdate'>;
	linksDelete: LinklyEndpoint<'linksDelete'>;
	linksRestore: LinklyEndpoint<'linksRestore'>;
	linksExport: LinklyEndpoint<'linksExport'>;
	clicksGetTimeSeries: LinklyEndpoint<'clicksGetTimeSeries'>;
	clicksGetCounters: LinklyEndpoint<'clicksGetCounters'>;
	domainsList: LinklyEndpoint<'domainsList'>;
	webhooksList: LinklyEndpoint<'webhooksList'>;
	webhooksSubscribe: LinklyEndpoint<'webhooksSubscribe'>;
	webhooksUnsubscribe: LinklyEndpoint<'webhooksUnsubscribe'>;
	linksGetDetails: LinklyEndpoint<'linksGetDetails'>;
	linksBulkUpsert: LinklyEndpoint<'linksBulkUpsert'>;
	linksDeleteMany: LinklyEndpoint<'linksDeleteMany'>;
	clicksExport: LinklyEndpoint<'clicksExport'>;
	domainsCreate: LinklyEndpoint<'domainsCreate'>;
	domainsDelete: LinklyEndpoint<'domainsDelete'>;
	domainsUpdateFavicon: LinklyEndpoint<'domainsUpdateFavicon'>;
	webhooksListForLink: LinklyEndpoint<'webhooksListForLink'>;
	webhooksSubscribeToLink: LinklyEndpoint<'webhooksSubscribeToLink'>;
	webhooksUnsubscribeFromLink: LinklyEndpoint<'webhooksUnsubscribeFromLink'>;
	conversionsList: LinklyEndpoint<'conversionsList'>;
	conversionsCreate: LinklyEndpoint<'conversionsCreate'>;
	workspacesUpdate: LinklyEndpoint<'workspacesUpdate'>;
	authTest: LinklyEndpoint<'authTest'>;
};

const linklyEndpointsNested = {
	auth: {
		test: Auth.test,
	},
	workspaces: {
		listWorkspaces: Workspaces.listWorkspaces,
		update: Workspaces.update,
	},
	links: {
		list: Links.list,
		get: Links.get,
		getDetails: Links.getDetails,
		create: Links.create,
		update: Links.update,
		bulkUpsert: Links.bulkUpsert,
		delete: Links.remove,
		deleteMany: Links.removeMany,
		restore: Links.restore,
		export: Links.export,
	},
	clicks: {
		getTimeSeries: Clicks.getTimeSeries,
		getCounters: Clicks.getCounters,
		export: Clicks.export,
	},
	domains: {
		list: Domains.list,
		create: Domains.create,
		delete: Domains.delete,
		updateFavicon: Domains.updateFavicon,
	},
	webhooks: {
		list: Webhooks.list,
		subscribe: Webhooks.subscribe,
		unsubscribe: Webhooks.unsubscribe,
		listForLink: Webhooks.listForLink,
		subscribeToLink: Webhooks.subscribeToLink,
		unsubscribeFromLink: Webhooks.unsubscribeFromLink,
	},
	conversions: {
		list: Conversions.list,
		create: Conversions.create,
	},
} as const;

export const linklyEndpointSchemas = {
	'workspaces.listWorkspaces': {
		input: LinklyEndpointInputSchemas.workspacesListWorkspaces,
		output: LinklyEndpointOutputSchemas.workspacesListWorkspaces,
	},
	'links.list': {
		input: LinklyEndpointInputSchemas.linksList,
		output: LinklyEndpointOutputSchemas.linksList,
	},
	'links.get': {
		input: LinklyEndpointInputSchemas.linksGet,
		output: LinklyEndpointOutputSchemas.linksGet,
	},
	'links.create': {
		input: LinklyEndpointInputSchemas.linksCreate,
		output: LinklyEndpointOutputSchemas.linksCreate,
	},
	'links.update': {
		input: LinklyEndpointInputSchemas.linksUpdate,
		output: LinklyEndpointOutputSchemas.linksUpdate,
	},
	'links.delete': {
		input: LinklyEndpointInputSchemas.linksDelete,
		output: LinklyEndpointOutputSchemas.linksDelete,
	},
	'links.restore': {
		input: LinklyEndpointInputSchemas.linksRestore,
		output: LinklyEndpointOutputSchemas.linksRestore,
	},
	'links.export': {
		input: LinklyEndpointInputSchemas.linksExport,
		output: LinklyEndpointOutputSchemas.linksExport,
	},
	'clicks.getTimeSeries': {
		input: LinklyEndpointInputSchemas.clicksGetTimeSeries,
		output: LinklyEndpointOutputSchemas.clicksGetTimeSeries,
	},
	'clicks.getCounters': {
		input: LinklyEndpointInputSchemas.clicksGetCounters,
		output: LinklyEndpointOutputSchemas.clicksGetCounters,
	},
	'domains.list': {
		input: LinklyEndpointInputSchemas.domainsList,
		output: LinklyEndpointOutputSchemas.domainsList,
	},
	'webhooks.list': {
		input: LinklyEndpointInputSchemas.webhooksList,
		output: LinklyEndpointOutputSchemas.webhooksList,
	},
	'webhooks.subscribe': {
		input: LinklyEndpointInputSchemas.webhooksSubscribe,
		output: LinklyEndpointOutputSchemas.webhooksSubscribe,
	},
	'webhooks.unsubscribe': {
		input: LinklyEndpointInputSchemas.webhooksUnsubscribe,
		output: LinklyEndpointOutputSchemas.webhooksUnsubscribe,
	},
	'auth.test': {
		input: LinklyEndpointInputSchemas.authTest,
		output: LinklyEndpointOutputSchemas.authTest,
	},
	'workspaces.update': {
		input: LinklyEndpointInputSchemas.workspacesUpdate,
		output: LinklyEndpointOutputSchemas.workspacesUpdate,
	},
	'links.getDetails': {
		input: LinklyEndpointInputSchemas.linksGetDetails,
		output: LinklyEndpointOutputSchemas.linksGetDetails,
	},
	'links.bulkUpsert': {
		input: LinklyEndpointInputSchemas.linksBulkUpsert,
		output: LinklyEndpointOutputSchemas.linksBulkUpsert,
	},
	'links.deleteMany': {
		input: LinklyEndpointInputSchemas.linksDeleteMany,
		output: LinklyEndpointOutputSchemas.linksDeleteMany,
	},
	'clicks.export': {
		input: LinklyEndpointInputSchemas.clicksExport,
		output: LinklyEndpointOutputSchemas.clicksExport,
	},
	'domains.create': {
		input: LinklyEndpointInputSchemas.domainsCreate,
		output: LinklyEndpointOutputSchemas.domainsCreate,
	},
	'domains.delete': {
		input: LinklyEndpointInputSchemas.domainsDelete,
		output: LinklyEndpointOutputSchemas.domainsDelete,
	},
	'domains.updateFavicon': {
		input: LinklyEndpointInputSchemas.domainsUpdateFavicon,
		output: LinklyEndpointOutputSchemas.domainsUpdateFavicon,
	},
	'webhooks.listForLink': {
		input: LinklyEndpointInputSchemas.webhooksListForLink,
		output: LinklyEndpointOutputSchemas.webhooksListForLink,
	},
	'webhooks.subscribeToLink': {
		input: LinklyEndpointInputSchemas.webhooksSubscribeToLink,
		output: LinklyEndpointOutputSchemas.webhooksSubscribeToLink,
	},
	'webhooks.unsubscribeFromLink': {
		input: LinklyEndpointInputSchemas.webhooksUnsubscribeFromLink,
		output: LinklyEndpointOutputSchemas.webhooksUnsubscribeFromLink,
	},
	'conversions.list': {
		input: LinklyEndpointInputSchemas.conversionsList,
		output: LinklyEndpointOutputSchemas.conversionsList,
	},
	'conversions.create': {
		input: LinklyEndpointInputSchemas.conversionsCreate,
		output: LinklyEndpointOutputSchemas.conversionsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof linklyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const linklyEndpointMeta = {
	'workspaces.listWorkspaces': {
		riskLevel: 'read',
		description: 'List the workspaces the API key can reach, with their IDs',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			'List the links in a workspace with their click counts, one page at a time',
	},
	'links.get': {
		riskLevel: 'read',
		description:
			'Read one link by ID: destination, short URL and settings, without click counts',
	},
	'links.create': {
		riskLevel: 'write',
		description:
			'Create a tracked short link in a workspace, with its destination, UTM fields and optional rules',
	},
	'links.update': {
		riskLevel: 'write',
		description:
			'Update an existing link in place by sending its ID with the fields to change',
	},
	'links.delete': {
		riskLevel: 'destructive',
		description:
			'Move a link to the trash: its short URL stops redirecting straight away. links.restore can undo this while the link is still in the trash, and deleting a trashed link again is a harmless no-op',
	},
	'links.restore': {
		riskLevel: 'write',
		description:
			'Take deleted links out of the trash by ID; a restored link whose back-half is taken reports a conflict',
	},
	'links.export': {
		riskLevel: 'read',
		description:
			"Export every link in a workspace with their click counts, unpaginated. Counts against the workspace's analytics allowance",
	},
	'clicks.getTimeSeries': {
		riskLevel: 'read',
		description:
			"Read click counts over time for a workspace, filtered by link, date range, country and device, optionally pivoted into a links-by-date matrix. Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack).",
	},
	'clicks.getCounters': {
		riskLevel: 'read',
		description:
			"Group a workspace's clicks by one dimension, such as country or UTM campaign, ordered by count (top 10,000 values). Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack).",
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			'List the custom domains attached to a workspace, usable as links.create domain values',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhook URLs registered on a workspace',
	},
	'webhooks.subscribe': {
		riskLevel: 'write',
		description:
			'Register a webhook URL on a workspace; Linkly then POSTs there for every click, link.created, link.updated and link.deleted. Deliveries arrive at that URL, not to this plugin',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'write',
		description:
			'Remove a webhook registration from a workspace by its URL, so it stops receiving events',
	},
	'auth.test': {
		riskLevel: 'read',
		description: 'Check that the API key is valid',
	},
	'workspaces.update': {
		riskLevel: 'destructive',
		description:
			"Rename a workspace or replace its whole webhook list. Sending webhooks overwrites every registered URL, so a missing one stops receiving events. Not in Linkly's OpenAPI spec; Linkly's own MCP server uses it",
	},
	'links.getDetails': {
		riskLevel: 'read',
		description:
			"Read one link with its lifetime and recent click counts, plus the workspace's domains",
	},
	'links.bulkUpsert': {
		riskLevel: 'write',
		description:
			"Create or update up to 1000 links in one call: items with an id update, items without create. Answers 200 even when some items fail; check each item's status",
	},
	'links.deleteMany': {
		riskLevel: 'destructive',
		description:
			'Move several links to the trash at once: their short URLs stop redirecting straight away. links.restore can bring them back while they are in the trash',
	},
	'clicks.export': {
		riskLevel: 'read',
		description:
			"Export raw click rows (time, browser, country, destination, platform, referer, bot, ISP, params) for a workspace or one link. Not in Linkly's OpenAPI spec; Linkly's analytics docs and MCP server use it. Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack).",
	},
	'domains.create': {
		riskLevel: 'write',
		description:
			'Attach a custom domain to a workspace. Its CNAME must already point at domains.linklyhq.com',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a custom domain from a workspace. Every short link on that domain stops working',
	},
	'domains.updateFavicon': {
		riskLevel: 'write',
		description: 'Set or clear the favicon URL for a custom domain',
	},
	'webhooks.listForLink': {
		riskLevel: 'read',
		description: 'List the webhook URLs registered on one link',
	},
	'webhooks.subscribeToLink': {
		riskLevel: 'write',
		description:
			'Register a webhook URL on one link; Linkly then POSTs its clicks, link.updated and link.deleted there. Deliveries arrive at that URL, not to this plugin',
	},
	'webhooks.unsubscribeFromLink': {
		riskLevel: 'write',
		description: 'Remove a webhook registration from one link by its URL',
	},
	'conversions.list': {
		riskLevel: 'read',
		description:
			"List a workspace's attributed conversions (leads, sales, custom events), newest first or paged oldest-first with since and after",
	},
	'conversions.create': {
		riskLevel: 'write',
		description:
			'Report a lead, sale or custom event and attribute it to the link that drove it through its linkly_cid. Unattributable events are discarded and answer attributed: false. Pass event_id so a repeat does not count twice',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof linklyEndpointsNested>;

export type BaseLinklyPlugin<T extends LinklyPluginOptions> = CorsairPlugin<
	'linkly',
	typeof LinklySchema,
	typeof linklyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLinklyPlugin = BaseLinklyPlugin<LinklyPluginOptions>;

export type ExternalLinklyPlugin<T extends LinklyPluginOptions> =
	BaseLinklyPlugin<T>;

export function linkly<const T extends LinklyPluginOptions>(
	incomingOptions: LinklyPluginOptions & T = {} as LinklyPluginOptions & T,
): ExternalLinklyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'linkly',
		schema: LinklySchema,
		options: options,
		hooks: options.hooks,
		endpoints: linklyEndpointsNested,
		webhooks: {},
		endpointMeta: linklyEndpointMeta,
		endpointSchemas: linklyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LinklyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('linkly', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLinklyPlugin;
}

export { LINKLY_API_BASE, linklyRequestFacts } from './client';

export type {
	AuthTestInput,
	AuthTestResponse,
	ClicksExportInput,
	ClicksExportResponse,
	ClicksGetCountersInput,
	ClicksGetCountersResponse,
	ClicksGetTimeSeriesInput,
	ClicksGetTimeSeriesResponse,
	ClicksPivotResponse,
	ConversionsCreateInput,
	ConversionsCreateResponse,
	ConversionsListInput,
	ConversionsListResponse,
	DomainsCreateInput,
	DomainsCreateResponse,
	DomainsDeleteInput,
	DomainsDeleteResponse,
	DomainsListInput,
	DomainsListResponse,
	DomainsUpdateFaviconInput,
	DomainsUpdateFaviconResponse,
	LinklyEndpointInputs,
	LinklyEndpointOutputs,
	LinklyLink,
	LinklyWorkspaceLink,
	LinksBulkUpsertInput,
	LinksBulkUpsertResponse,
	LinksCreateInput,
	LinksCreateResponse,
	LinksDeleteInput,
	LinksDeleteManyInput,
	LinksDeleteManyResponse,
	LinksDeleteResponse,
	LinksExportInput,
	LinksExportResponse,
	LinksGetDetailsInput,
	LinksGetDetailsResponse,
	LinksGetInput,
	LinksGetResponse,
	LinksListInput,
	LinksListResponse,
	LinksRestoreInput,
	LinksRestoreResponse,
	LinksUpdateInput,
	LinksUpdateResponse,
	WebhooksListForLinkInput,
	WebhooksListForLinkResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksSubscribeInput,
	WebhooksSubscribeResponse,
	WebhooksSubscribeToLinkInput,
	WebhooksSubscribeToLinkResponse,
	WebhooksUnsubscribeFromLinkInput,
	WebhooksUnsubscribeFromLinkResponse,
	WebhooksUnsubscribeInput,
	WebhooksUnsubscribeResponse,
	WorkspacesListWorkspacesInput,
	WorkspacesListWorkspacesResponse,
	WorkspacesUpdateInput,
	WorkspacesUpdateResponse,
} from './endpoints/types';
