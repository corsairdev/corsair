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
import { Clicks, Domains, Links, Webhooks, Workspaces } from './endpoints';
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
};

const linklyEndpointsNested = {
	workspaces: {
		listWorkspaces: Workspaces.listWorkspaces,
	},
	links: {
		list: Links.list,
		get: Links.get,
		create: Links.create,
		update: Links.update,
		delete: Links.remove,
		restore: Links.restore,
		export: Links.export,
	},
	clicks: {
		getTimeSeries: Clicks.getTimeSeries,
		getCounters: Clicks.getCounters,
	},
	domains: {
		list: Domains.list,
	},
	webhooks: {
		list: Webhooks.list,
		subscribe: Webhooks.subscribe,
		unsubscribe: Webhooks.unsubscribe,
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
		irreversible: true,
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
			'Export every link in a workspace with their click counts, unpaginated',
	},
	'clicks.getTimeSeries': {
		riskLevel: 'read',
		description:
			'Read click counts over time for a workspace, filtered by link, date range, country and device, optionally pivoted into a links-by-date matrix',
	},
	'clicks.getCounters': {
		riskLevel: 'read',
		description:
			'Group a workspace’s clicks by one dimension, such as country or UTM campaign, ordered by count',
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			'List the custom domains attached to a workspace, usable as links.create domain values',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhook URLs registered on a workspace to receive a POST for each click',
	},
	'webhooks.subscribe': {
		riskLevel: 'write',
		description:
			'Register a webhook URL on a workspace; Linkly then POSTs there for every click. Deliveries arrive at that URL, not to this plugin',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'write',
		description:
			'Remove a webhook registration from a workspace by its URL, so it stops receiving click events',
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

export { LinklyAPIError, LINKLY_API_BASE } from './client';

export type {
	ClicksGetCountersInput,
	ClicksGetCountersResponse,
	ClicksGetTimeSeriesInput,
	ClicksGetTimeSeriesResponse,
	ClicksPivotResponse,
	DomainsListInput,
	DomainsListResponse,
	LinklyEndpointInputs,
	LinklyEndpointOutputs,
	LinklyLink,
	LinklyWorkspaceLink,
	LinksCreateInput,
	LinksCreateResponse,
	LinksDeleteInput,
	LinksDeleteResponse,
	LinksExportInput,
	LinksExportResponse,
	LinksGetInput,
	LinksGetResponse,
	LinksListInput,
	LinksListResponse,
	LinksRestoreInput,
	LinksRestoreResponse,
	LinksUpdateInput,
	LinksUpdateResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksSubscribeInput,
	WebhooksSubscribeResponse,
	WebhooksUnsubscribeInput,
	WebhooksUnsubscribeResponse,
	WorkspacesListWorkspacesInput,
	WorkspacesListWorkspacesResponse,
} from './endpoints/types';
