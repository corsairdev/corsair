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
import { Endpoints } from './endpoints';
import type {
	RaiselyEndpointInputs,
	RaiselyEndpointOutputs,
} from './endpoints/types';
import {
	RaiselyEndpointInputSchemas,
	RaiselyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RaiselySchema } from './schema';

export type RaiselyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRaiselyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof raiselyEndpointsNested>;
};

export type RaiselyContext = CorsairPluginContext<
	typeof RaiselySchema,
	RaiselyPluginOptions
>;

export type RaiselyKeyBuilderContext = KeyBuilderContext<RaiselyPluginOptions>;

export type RaiselyBoundEndpoints = BindEndpoints<
	typeof raiselyEndpointsNested
>;

type RaiselyEndpoint<K extends keyof RaiselyEndpointOutputs> = CorsairEndpoint<
	RaiselyContext,
	RaiselyEndpointInputs[K],
	RaiselyEndpointOutputs[K]
>;

export type RaiselyEndpoints = {
	campaignsList: RaiselyEndpoint<'campaignsList'>;
	campaignsGet: RaiselyEndpoint<'campaignsGet'>;
	donationsList: RaiselyEndpoint<'donationsList'>;
	donationsGet: RaiselyEndpoint<'donationsGet'>;
	donationsCreate: RaiselyEndpoint<'donationsCreate'>;
	profilesList: RaiselyEndpoint<'profilesList'>;
	profilesGet: RaiselyEndpoint<'profilesGet'>;
	profilesUpdate: RaiselyEndpoint<'profilesUpdate'>;
	designationsList: RaiselyEndpoint<'designationsList'>;
};

const raiselyEndpointsNested = {
	campaigns: {
		list: Endpoints.campaignsList,
		get: Endpoints.campaignsGet,
	},
	donations: {
		list: Endpoints.donationsList,
		get: Endpoints.donationsGet,
		create: Endpoints.donationsCreate,
	},
	profiles: {
		list: Endpoints.profilesList,
		get: Endpoints.profilesGet,
		update: Endpoints.profilesUpdate,
	},
	designations: {
		list: Endpoints.designationsList,
	},
} as const;

export const raiselyEndpointSchemas = {
	'campaigns.list': {
		input: RaiselyEndpointInputSchemas.campaignsList,
		output: RaiselyEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: RaiselyEndpointInputSchemas.campaignsGet,
		output: RaiselyEndpointOutputSchemas.campaignsGet,
	},
	'donations.list': {
		input: RaiselyEndpointInputSchemas.donationsList,
		output: RaiselyEndpointOutputSchemas.donationsList,
	},
	'donations.get': {
		input: RaiselyEndpointInputSchemas.donationsGet,
		output: RaiselyEndpointOutputSchemas.donationsGet,
	},
	'donations.create': {
		input: RaiselyEndpointInputSchemas.donationsCreate,
		output: RaiselyEndpointOutputSchemas.donationsCreate,
	},
	'profiles.list': {
		input: RaiselyEndpointInputSchemas.profilesList,
		output: RaiselyEndpointOutputSchemas.profilesList,
	},
	'profiles.get': {
		input: RaiselyEndpointInputSchemas.profilesGet,
		output: RaiselyEndpointOutputSchemas.profilesGet,
	},
	'profiles.update': {
		input: RaiselyEndpointInputSchemas.profilesUpdate,
		output: RaiselyEndpointOutputSchemas.profilesUpdate,
	},
	'designations.list': {
		input: RaiselyEndpointInputSchemas.designationsList,
		output: RaiselyEndpointOutputSchemas.designationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof raiselyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const raiselyEndpointMeta = {
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List the organisation’s campaigns with path, mode and status filters plus offset paging',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Fetch one campaign by uuid or path, including its totals, goal and public URL',
	},
	'donations.list': {
		riskLevel: 'read',
		description:
			'List donations with campaign, profile, status, mode and currency filters plus offset paging',
	},
	'donations.get': {
		riskLevel: 'read',
		description:
			'Fetch one donation by uuid with its amount, gateway state and designation',
	},
	'donations.create': {
		riskLevel: 'write',
		description:
			'Record a donation for a campaign, with the donor details and the gateway it came through',
	},
	'profiles.list': {
		riskLevel: 'read',
		description:
			'List the fundraising profiles in a campaign with their totals, goals and donation counts',
	},
	'profiles.get': {
		riskLevel: 'read',
		description:
			'Fetch one fundraising profile by its path, including its totals and goal',
	},
	'profiles.update': {
		riskLevel: 'write',
		description:
			'Update a fundraising profile: its name, description, goal, photo or custom values',
	},
	'designations.list': {
		riskLevel: 'read',
		description:
			'List the designations a donation can be attributed to, optionally for one campaign',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof raiselyEndpointsNested>;

export type BaseRaiselyPlugin<T extends RaiselyPluginOptions> = CorsairPlugin<
	'raisely',
	typeof RaiselySchema,
	typeof raiselyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRaiselyPlugin = BaseRaiselyPlugin<RaiselyPluginOptions>;

export type ExternalRaiselyPlugin<T extends RaiselyPluginOptions> =
	BaseRaiselyPlugin<T>;

export function raisely<const T extends RaiselyPluginOptions>(
	incomingOptions: RaiselyPluginOptions & T = {} as RaiselyPluginOptions & T,
): ExternalRaiselyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'raisely',
		schema: RaiselySchema,
		options: options,
		hooks: options.hooks,
		endpoints: raiselyEndpointsNested,
		webhooks: {},
		endpointMeta: raiselyEndpointMeta,
		endpointSchemas: raiselyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RaiselyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('raisely', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRaiselyPlugin;
}

export { RaiselyAPIError } from './client';

export type {
	CampaignsGetInput,
	CampaignsGetResponse,
	CampaignsListInput,
	CampaignsListResponse,
	DesignationsListInput,
	DesignationsListResponse,
	DonationsCreateInput,
	DonationsCreateResponse,
	DonationsGetInput,
	DonationsGetResponse,
	DonationsListInput,
	DonationsListResponse,
	ProfilesGetInput,
	ProfilesGetResponse,
	ProfilesListInput,
	ProfilesListResponse,
	ProfilesUpdateInput,
	ProfilesUpdateResponse,
	RaiselyCampaign,
	RaiselyDesignation,
	RaiselyDonation,
	RaiselyEndpointInputs,
	RaiselyEndpointOutputs,
	RaiselyProfile,
} from './endpoints/types';
