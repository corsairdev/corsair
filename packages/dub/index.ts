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
	Analytics,
	Customers,
	Domains,
	Events,
	Folders,
	Links,
	Qr,
	Tags,
	Track,
} from './endpoints';
import type { DubEndpointInputs, DubEndpointOutputs } from './endpoints/types';
import {
	DubEndpointInputSchemas,
	DubEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DubSchema } from './schema';

// Scope note: v1 covers core link management, analytics, events, QR codes,
// tags, domains, folders, conversion tracking and customers. Intentionally
// excluded: the Dub Partners program surface (partners.*, programApplications,
// commissions, payouts, discountCodes, bounties, messages,
// tokens.embedReferrals), domains.register (it buys a domain) and
// domains.status (a domain-shopping helper).

export type DubPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dubEndpointsNested>;
};

export type DubContext = CorsairPluginContext<
	typeof DubSchema,
	DubPluginOptions
>;

export type DubKeyBuilderContext = KeyBuilderContext<DubPluginOptions>;

export type DubBoundEndpoints = BindEndpoints<typeof dubEndpointsNested>;

type DubEndpoint<K extends keyof DubEndpointOutputs> = CorsairEndpoint<
	DubContext,
	DubEndpointInputs[K],
	DubEndpointOutputs[K]
>;

export type DubEndpoints = {
	linksCreate: DubEndpoint<'linksCreate'>;
	linksList: DubEndpoint<'linksList'>;
	linksGet: DubEndpoint<'linksGet'>;
	linksUpdate: DubEndpoint<'linksUpdate'>;
	linksUpsert: DubEndpoint<'linksUpsert'>;
	linksCount: DubEndpoint<'linksCount'>;
	linksDelete: DubEndpoint<'linksDelete'>;
	linksBulkCreate: DubEndpoint<'linksBulkCreate'>;
	linksBulkUpdate: DubEndpoint<'linksBulkUpdate'>;
	linksBulkDelete: DubEndpoint<'linksBulkDelete'>;
	analyticsRetrieve: DubEndpoint<'analyticsRetrieve'>;
	eventsList: DubEndpoint<'eventsList'>;
	qrGet: DubEndpoint<'qrGet'>;
	tagsCreate: DubEndpoint<'tagsCreate'>;
	tagsList: DubEndpoint<'tagsList'>;
	tagsUpdate: DubEndpoint<'tagsUpdate'>;
	tagsDelete: DubEndpoint<'tagsDelete'>;
	domainsCreate: DubEndpoint<'domainsCreate'>;
	domainsList: DubEndpoint<'domainsList'>;
	domainsUpdate: DubEndpoint<'domainsUpdate'>;
	domainsDelete: DubEndpoint<'domainsDelete'>;
	foldersCreate: DubEndpoint<'foldersCreate'>;
	foldersList: DubEndpoint<'foldersList'>;
	foldersUpdate: DubEndpoint<'foldersUpdate'>;
	foldersDelete: DubEndpoint<'foldersDelete'>;
	trackLead: DubEndpoint<'trackLead'>;
	trackSale: DubEndpoint<'trackSale'>;
	customersList: DubEndpoint<'customersList'>;
	customersGet: DubEndpoint<'customersGet'>;
	customersUpdate: DubEndpoint<'customersUpdate'>;
	customersDelete: DubEndpoint<'customersDelete'>;
};

const dubEndpointsNested = {
	links: {
		create: Links.create,
		list: Links.list,
		get: Links.get,
		update: Links.update,
		upsert: Links.upsert,
		count: Links.count,
		delete: Links.remove,
		bulkCreate: Links.bulkCreate,
		bulkUpdate: Links.bulkUpdate,
		bulkDelete: Links.bulkDelete,
	},
	analytics: {
		retrieve: Analytics.retrieve,
	},
	events: {
		list: Events.list,
	},
	qr: {
		get: Qr.get,
	},
	tags: {
		create: Tags.create,
		list: Tags.list,
		update: Tags.update,
		delete: Tags.remove,
	},
	domains: {
		create: Domains.create,
		list: Domains.list,
		update: Domains.update,
		delete: Domains.remove,
	},
	folders: {
		create: Folders.create,
		list: Folders.list,
		update: Folders.update,
		delete: Folders.remove,
	},
	track: {
		lead: Track.lead,
		sale: Track.sale,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		update: Customers.update,
		delete: Customers.remove,
	},
} as const;

export const dubEndpointSchemas = {
	'links.create': {
		input: DubEndpointInputSchemas.linksCreate,
		output: DubEndpointOutputSchemas.linksCreate,
	},
	'links.list': {
		input: DubEndpointInputSchemas.linksList,
		output: DubEndpointOutputSchemas.linksList,
	},
	'links.get': {
		input: DubEndpointInputSchemas.linksGet,
		output: DubEndpointOutputSchemas.linksGet,
	},
	'links.update': {
		input: DubEndpointInputSchemas.linksUpdate,
		output: DubEndpointOutputSchemas.linksUpdate,
	},
	'links.upsert': {
		input: DubEndpointInputSchemas.linksUpsert,
		output: DubEndpointOutputSchemas.linksUpsert,
	},
	'links.count': {
		input: DubEndpointInputSchemas.linksCount,
		output: DubEndpointOutputSchemas.linksCount,
	},
	'links.delete': {
		input: DubEndpointInputSchemas.linksDelete,
		output: DubEndpointOutputSchemas.linksDelete,
	},
	'links.bulkCreate': {
		input: DubEndpointInputSchemas.linksBulkCreate,
		output: DubEndpointOutputSchemas.linksBulkCreate,
	},
	'links.bulkUpdate': {
		input: DubEndpointInputSchemas.linksBulkUpdate,
		output: DubEndpointOutputSchemas.linksBulkUpdate,
	},
	'links.bulkDelete': {
		input: DubEndpointInputSchemas.linksBulkDelete,
		output: DubEndpointOutputSchemas.linksBulkDelete,
	},
	'analytics.retrieve': {
		input: DubEndpointInputSchemas.analyticsRetrieve,
		output: DubEndpointOutputSchemas.analyticsRetrieve,
	},
	'events.list': {
		input: DubEndpointInputSchemas.eventsList,
		output: DubEndpointOutputSchemas.eventsList,
	},
	'qr.get': {
		input: DubEndpointInputSchemas.qrGet,
		output: DubEndpointOutputSchemas.qrGet,
	},
	'tags.create': {
		input: DubEndpointInputSchemas.tagsCreate,
		output: DubEndpointOutputSchemas.tagsCreate,
	},
	'tags.list': {
		input: DubEndpointInputSchemas.tagsList,
		output: DubEndpointOutputSchemas.tagsList,
	},
	'tags.update': {
		input: DubEndpointInputSchemas.tagsUpdate,
		output: DubEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: DubEndpointInputSchemas.tagsDelete,
		output: DubEndpointOutputSchemas.tagsDelete,
	},
	'domains.create': {
		input: DubEndpointInputSchemas.domainsCreate,
		output: DubEndpointOutputSchemas.domainsCreate,
	},
	'domains.list': {
		input: DubEndpointInputSchemas.domainsList,
		output: DubEndpointOutputSchemas.domainsList,
	},
	'domains.update': {
		input: DubEndpointInputSchemas.domainsUpdate,
		output: DubEndpointOutputSchemas.domainsUpdate,
	},
	'domains.delete': {
		input: DubEndpointInputSchemas.domainsDelete,
		output: DubEndpointOutputSchemas.domainsDelete,
	},
	'folders.create': {
		input: DubEndpointInputSchemas.foldersCreate,
		output: DubEndpointOutputSchemas.foldersCreate,
	},
	'folders.list': {
		input: DubEndpointInputSchemas.foldersList,
		output: DubEndpointOutputSchemas.foldersList,
	},
	'folders.update': {
		input: DubEndpointInputSchemas.foldersUpdate,
		output: DubEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: DubEndpointInputSchemas.foldersDelete,
		output: DubEndpointOutputSchemas.foldersDelete,
	},
	'track.lead': {
		input: DubEndpointInputSchemas.trackLead,
		output: DubEndpointOutputSchemas.trackLead,
	},
	'track.sale': {
		input: DubEndpointInputSchemas.trackSale,
		output: DubEndpointOutputSchemas.trackSale,
	},
	'customers.list': {
		input: DubEndpointInputSchemas.customersList,
		output: DubEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: DubEndpointInputSchemas.customersGet,
		output: DubEndpointOutputSchemas.customersGet,
	},
	'customers.update': {
		input: DubEndpointInputSchemas.customersUpdate,
		output: DubEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: DubEndpointInputSchemas.customersDelete,
		output: DubEndpointOutputSchemas.customersDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof dubEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const dubEndpointMeta = {
	'links.create': {
		riskLevel: 'write',
		description:
			'Create a short link; a duplicate domain and slug answers 409 conflict',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			'List short links with filters and cursor paging; the next cursor is the last link id',
	},
	'links.get': {
		riskLevel: 'read',
		description:
			'Retrieve one link by id, externalId, or a domain and slug pair',
	},
	'links.update': {
		riskLevel: 'write',
		description: 'Update a short link by id (or externalId prefixed with ext_)',
	},
	'links.upsert': {
		riskLevel: 'write',
		description:
			'Idempotent create-or-update keyed on domain and slug (or externalId); safe to retry',
	},
	'links.count': {
		riskLevel: 'read',
		description:
			'Count links matching the filters, optionally grouped by domain, tag, folder or user',
	},
	'links.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a short link; recreating it does not restore its analytics',
	},
	'links.bulkCreate': {
		riskLevel: 'write',
		description:
			'Create up to 100 links in one call; the answer carries one row per link, including per-link errors',
	},
	'links.bulkUpdate': {
		riskLevel: 'write',
		description:
			'Apply one set of field changes to up to 100 links named by id or externalId',
	},
	'links.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete up to 100 links in one call; their analytics are not recoverable',
	},
	'analytics.retrieve': {
		riskLevel: 'read',
		description:
			'Read aggregated click, lead and sale analytics, grouped by count, timeseries, country, device, link and more',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'List raw click, lead and sale events with filters, newest first',
	},
	'qr.get': {
		riskLevel: 'read',
		description:
			'Generate an SVG QR code for a URL; the document comes back as the svg string',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag with an optional color',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags with search, sorting and page paging',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Rename a tag or change its color',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a tag and remove it from every link',
	},
	'domains.create': {
		riskLevel: 'write',
		description:
			'Add a domain to the workspace; it still needs DNS verification in the dashboard',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List the workspace domains with search and page paging',
	},
	'domains.update': {
		riskLevel: 'write',
		description:
			'Update a domain or rename it with newSlug; redirects and branding are editable here',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a domain; its links stop resolving and analytics are not restored on recreate',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder to group links, with an access level',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders with search and page paging',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Rename a folder, change its description or access level',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a folder; its links keep existing',
	},
	'track.lead': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Record a lead conversion attributed to a click; there is no delete, so a tracked lead cannot be undone',
	},
	'track.sale': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Record a sale conversion in cents attributed to a customer; invoiceId deduplicates, but a tracked sale cannot be undone',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with filters and cursor paging; the next cursor is the last customer id',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Retrieve one customer by their Dub id, or their externalId prefixed with ext_',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a customer email, name, avatar or country',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a customer; past events keep their recorded data',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dubEndpointsNested>;

export type BaseDubPlugin<T extends DubPluginOptions> = CorsairPlugin<
	'dub',
	typeof DubSchema,
	typeof dubEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDubPlugin = BaseDubPlugin<DubPluginOptions>;

export type ExternalDubPlugin<T extends DubPluginOptions> = BaseDubPlugin<T>;

export function dub<const T extends DubPluginOptions>(
	incomingOptions: DubPluginOptions & T = {} as DubPluginOptions & T,
): ExternalDubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dub',
		schema: DubSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dubEndpointsNested,
		webhooks: {},
		endpointMeta: dubEndpointMeta,
		endpointSchemas: dubEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DubKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('dub', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDubPlugin;
}

export { DubAPIError } from './client';

export type {
	CustomersListResponse,
	DubAnalyticsResponse,
	DubCustomer,
	DubDomain,
	DubEndpointInputs,
	DubEndpointOutputs,
	DubEvent,
	DubFolder,
	DubLink,
	DubTag,
	EventsListResponse,
	LinkCreateInput,
	LinksBulkCreateInput,
	LinksBulkCreateResponse,
	LinksCountResponse,
	LinksListInput,
	LinksListResponse,
	QrGetInput,
	QrGetResponse,
	TrackLeadInput,
	TrackSaleInput,
} from './endpoints/types';
