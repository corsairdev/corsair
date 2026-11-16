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
	Account,
	Campaigns,
	Compose,
	Leads,
	Places,
	Suppressions,
} from './endpoints';
import type {
	NeedleEndpointInputs,
	NeedleEndpointOutputs,
} from './endpoints/types';
import {
	NeedleEndpointInputSchemas,
	NeedleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NeedleSchema } from './schema';

export type NeedlePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNeedlePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof needleEndpointsNested>;
};

export type NeedleContext = CorsairPluginContext<
	typeof NeedleSchema,
	NeedlePluginOptions
>;

export type NeedleKeyBuilderContext = KeyBuilderContext<NeedlePluginOptions>;

export type NeedleBoundEndpoints = BindEndpoints<typeof needleEndpointsNested>;

type NeedleEndpoint<K extends keyof NeedleEndpointOutputs> = CorsairEndpoint<
	NeedleContext,
	NeedleEndpointInputs[K],
	NeedleEndpointOutputs[K]
>;

export type NeedleEndpoints = {
	accountMe: NeedleEndpoint<'accountMe'>;
	leadsCreate: NeedleEndpoint<'leadsCreate'>;
	leadsUpdate: NeedleEndpoint<'leadsUpdate'>;
	leadsUpsert: NeedleEndpoint<'leadsUpsert'>;
	leadsList: NeedleEndpoint<'leadsList'>;
	leadsGet: NeedleEndpoint<'leadsGet'>;
	leadsRemove: NeedleEndpoint<'leadsRemove'>;
	leadsSearch: NeedleEndpoint<'leadsSearch'>;
	campaignsList: NeedleEndpoint<'campaignsList'>;
	campaignsCreate: NeedleEndpoint<'campaignsCreate'>;
	campaignsGet: NeedleEndpoint<'campaignsGet'>;
	campaignsUpdate: NeedleEndpoint<'campaignsUpdate'>;
	campaignsArchive: NeedleEndpoint<'campaignsArchive'>;
	campaignsStats: NeedleEndpoint<'campaignsStats'>;
	campaignsLeads: NeedleEndpoint<'campaignsLeads'>;
	campaignsEnroll: NeedleEndpoint<'campaignsEnroll'>;
	campaignsStopLeads: NeedleEndpoint<'campaignsStopLeads'>;
	suppressionsList: NeedleEndpoint<'suppressionsList'>;
	suppressionsCreate: NeedleEndpoint<'suppressionsCreate'>;
	suppressionRemove: NeedleEndpoint<'suppressionRemove'>;
	suppressionCheck: NeedleEndpoint<'suppressionCheck'>;
	placesSearch: NeedleEndpoint<'placesSearch'>;
	composePreview: NeedleEndpoint<'composePreview'>;
};

export const needleEndpointsNested = {
	account: {
		me: Account.me,
	},
	leads: {
		create: Leads.create,
		update: Leads.update,
		upsert: Leads.upsert,
		list: Leads.list,
		get: Leads.get,
		delete: Leads.remove,
		search: Leads.search,
	},
	campaigns: {
		list: Campaigns.list,
		create: Campaigns.create,
		get: Campaigns.get,
		update: Campaigns.update,
		delete: Campaigns.archive,
		stats: Campaigns.stats,
		leads: Campaigns.leads,
		enroll: Campaigns.enroll,
		stopLeads: Campaigns.stopLeads,
	},
	suppressions: {
		list: Suppressions.list,
		create: Suppressions.create,
		delete: Suppressions.remove,
		check: Suppressions.check,
	},
	places: {
		search: Places.search,
	},
	compose: {
		preview: Compose.preview,
	},
} as const;

export const needleEndpointSchemas = {
	'account.me': {
		input: NeedleEndpointInputSchemas.accountMe,
		output: NeedleEndpointOutputSchemas.accountMe,
	},
	'leads.create': {
		input: NeedleEndpointInputSchemas.leadsCreate,
		output: NeedleEndpointOutputSchemas.leadsCreate,
	},
	'leads.update': {
		input: NeedleEndpointInputSchemas.leadsUpdate,
		output: NeedleEndpointOutputSchemas.leadsUpdate,
	},
	'leads.upsert': {
		input: NeedleEndpointInputSchemas.leadsUpsert,
		output: NeedleEndpointOutputSchemas.leadsUpsert,
	},
	'leads.list': {
		input: NeedleEndpointInputSchemas.leadsList,
		output: NeedleEndpointOutputSchemas.leadsList,
	},
	'leads.get': {
		input: NeedleEndpointInputSchemas.leadsGet,
		output: NeedleEndpointOutputSchemas.leadsGet,
	},
	'leads.delete': {
		input: NeedleEndpointInputSchemas.leadsRemove,
		output: NeedleEndpointOutputSchemas.leadsRemove,
	},
	'leads.search': {
		input: NeedleEndpointInputSchemas.leadsSearch,
		output: NeedleEndpointOutputSchemas.leadsSearch,
	},
	'campaigns.list': {
		input: NeedleEndpointInputSchemas.campaignsList,
		output: NeedleEndpointOutputSchemas.campaignsList,
	},
	'campaigns.create': {
		input: NeedleEndpointInputSchemas.campaignsCreate,
		output: NeedleEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.get': {
		input: NeedleEndpointInputSchemas.campaignsGet,
		output: NeedleEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.update': {
		input: NeedleEndpointInputSchemas.campaignsUpdate,
		output: NeedleEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: NeedleEndpointInputSchemas.campaignsArchive,
		output: NeedleEndpointOutputSchemas.campaignsArchive,
	},
	'campaigns.stats': {
		input: NeedleEndpointInputSchemas.campaignsStats,
		output: NeedleEndpointOutputSchemas.campaignsStats,
	},
	'campaigns.leads': {
		input: NeedleEndpointInputSchemas.campaignsLeads,
		output: NeedleEndpointOutputSchemas.campaignsLeads,
	},
	'campaigns.enroll': {
		input: NeedleEndpointInputSchemas.campaignsEnroll,
		output: NeedleEndpointOutputSchemas.campaignsEnroll,
	},
	'campaigns.stopLeads': {
		input: NeedleEndpointInputSchemas.campaignsStopLeads,
		output: NeedleEndpointOutputSchemas.campaignsStopLeads,
	},
	'suppressions.list': {
		input: NeedleEndpointInputSchemas.suppressionsList,
		output: NeedleEndpointOutputSchemas.suppressionsList,
	},
	'suppressions.create': {
		input: NeedleEndpointInputSchemas.suppressionsCreate,
		output: NeedleEndpointOutputSchemas.suppressionsCreate,
	},
	'suppressions.delete': {
		input: NeedleEndpointInputSchemas.suppressionRemove,
		output: NeedleEndpointOutputSchemas.suppressionRemove,
	},
	'suppressions.check': {
		input: NeedleEndpointInputSchemas.suppressionCheck,
		output: NeedleEndpointOutputSchemas.suppressionCheck,
	},
	'places.search': {
		input: NeedleEndpointInputSchemas.placesSearch,
		output: NeedleEndpointOutputSchemas.placesSearch,
	},
	'compose.preview': {
		input: NeedleEndpointInputSchemas.composePreview,
		output: NeedleEndpointOutputSchemas.composePreview,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof needleEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const needleEndpointMeta = {
	'account.me': {
		riskLevel: 'read',
		description:
			'Read the user and organization the API key belongs to, with the key’s role',
	},
	'leads.create': {
		riskLevel: 'write',
		description:
			'Create a lead with a LinkedIn or Instagram identity; a duplicate identity is refused with 409, so use leads.upsert to merge instead',
	},
	'leads.update': {
		riskLevel: 'write',
		description:
			'Patch a lead’s fields by id; sending identities replaces the whole set rather than adding to it',
	},
	'leads.upsert': {
		riskLevel: 'write',
		description:
			'Create the lead, or patch the fields onto the one an identity already belongs to, reporting created or matched',
	},
	'leads.list': {
		riskLevel: 'read',
		description: 'Page through the workspace’s leads by cursor',
	},
	'leads.get': {
		riskLevel: 'read',
		description: 'Read one lead by id, with its identities and live enrollment',
	},
	'leads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a lead and its identities permanently; there is no restore call',
	},
	'leads.search': {
		riskLevel: 'read',
		description:
			'Search leads by free text and structured filters, combined with AND, paged by cursor',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'Page through campaigns, optionally filtered by status',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign in draft from a sequence graph; it contacts nobody until campaigns.update sets it active',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Read one campaign, including its sequence graph and status',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			'Rename a campaign, replace its graph, or set active to start sending and paused to halt it',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description:
			'Archive a campaign: it stops sending and leaves the active list, and the record is kept',
	},
	'campaigns.stats': {
		riskLevel: 'read',
		description:
			'Read a campaign’s progress and funnel: invites, messages, replies, and why leads were skipped',
	},
	'campaigns.leads': {
		riskLevel: 'read',
		description:
			'Page through the leads enrolled in a campaign with their status',
	},
	'campaigns.enroll': {
		riskLevel: 'write',
		description:
			'Enroll up to 500 leads at once, with one result per lead so a batch can partly succeed; an enrolled lead can be contacted',
	},
	'campaigns.stopLeads': {
		riskLevel: 'write',
		description:
			'Stop leads in a campaign so no further step reaches them, keeping them in the list',
	},
	'suppressions.list': {
		riskLevel: 'read',
		description:
			'Page through suppression entries, optionally filtered by reason',
	},
	'suppressions.create': {
		riskLevel: 'write',
		description:
			'Suppress up to 1000 leads or company domains, with counts for what was created and what was already listed',
	},
	'suppressions.delete': {
		riskLevel: 'destructive',
		description:
			'Remove a suppression entry, which makes that person or domain contactable again',
	},
	'suppressions.check': {
		riskLevel: 'read',
		description:
			'Check up to 1000 identities against the suppression list and answer contactable with the reason when not',
	},
	'places.search': {
		riskLevel: 'read',
		description:
			'Search places by free text or around a point, returning addresses, coordinates and websites',
	},
	'compose.preview': {
		riskLevel: 'read',
		description:
			'Preview an AI-composed message for a lead without sending it, with the context sources it used',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof needleEndpointsNested>;

export type BaseNeedlePlugin<T extends NeedlePluginOptions> = CorsairPlugin<
	'needle',
	typeof NeedleSchema,
	typeof needleEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNeedlePlugin = BaseNeedlePlugin<NeedlePluginOptions>;

export type ExternalNeedlePlugin<T extends NeedlePluginOptions> =
	BaseNeedlePlugin<T>;

export function needle<const T extends NeedlePluginOptions>(
	incomingOptions: NeedlePluginOptions & T = {} as NeedlePluginOptions & T,
): ExternalNeedlePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'needle',
		schema: NeedleSchema,
		options: options,
		hooks: options.hooks,
		endpoints: needleEndpointsNested,
		webhooks: {},
		endpointMeta: needleEndpointMeta,
		endpointSchemas: needleEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NeedleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('needle', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNeedlePlugin;
}

export { NeedleAPIError } from './client';

export type {
	BulkResultResponse,
	CampaignsArchiveInput,
	CampaignsArchiveResponse,
	CampaignsCreateInput,
	CampaignsCreateResponse,
	CampaignsEnrollInput,
	CampaignsEnrollResponse,
	CampaignsGetInput,
	CampaignsGetResponse,
	CampaignsLeadsInput,
	CampaignsLeadsResponse,
	CampaignsListInput,
	CampaignsListResponse,
	CampaignsStatsInput,
	CampaignsStatsResponse,
	CampaignsStopLeadsInput,
	CampaignsStopLeadsResponse,
	CampaignsUpdateInput,
	CampaignsUpdateResponse,
	ComposeInput,
	ComposeResponse,
	LeadsCreateInput,
	LeadsCreateResponse,
	LeadsGetInput,
	LeadsGetResponse,
	LeadsListInput,
	LeadsListResponse,
	LeadsRemoveInput,
	LeadsRemoveResponse,
	LeadsSearchInput,
	LeadsSearchResponse,
	LeadsUpdateInput,
	LeadsUpdateResponse,
	LeadsUpsertInput,
	LeadsUpsertResponse,
	MeInput,
	MeResponse,
	NeedleCampaign,
	NeedleEndpointInputs,
	NeedleEndpointOutputs,
	NeedleLead,
	NeedlePlace,
	PlacesSearchInput,
	PlacesSearchResponse,
	SuppressionCheckInput,
	SuppressionCheckResponse,
	SuppressionRemoveInput,
	SuppressionRemoveResponse,
	SuppressionsCreateInput,
	SuppressionsCreateResponse,
	SuppressionsListInput,
	SuppressionsListResponse,
} from './endpoints/types';
