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
	deleteItem,
	deleteLocation,
	getItem,
	getItemAttribute,
	getLocation,
	getMember,
	getTeamInfo,
	listBasic,
	listItemAttributes,
	listItems,
	listLocation,
	listLocations,
	listMembers,
	listPartners,
} from './endpoints';
import type {
	BoxheroEndpointInputs,
	BoxheroEndpointOutputs,
} from './endpoints/types';
import {
	BoxheroEndpointInputSchemas,
	BoxheroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoxheroSchema } from './schema';

export type BoxheroPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBoxheroPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boxheroEndpointsNested>;
};

/**
 * BoxHero authenticates with a team-bound API token as `Authorization: Bearer`.
 *
 * @see https://rest.boxhero-app.com/docs/api
 */
export const boxheroAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BoxheroContext = CorsairPluginContext<
	typeof BoxheroSchema,
	BoxheroPluginOptions,
	undefined,
	typeof boxheroAuthConfig
>;

export type BoxheroKeyBuilderContext = KeyBuilderContext<BoxheroPluginOptions>;

export type BoxheroBoundEndpoints = BindEndpoints<
	typeof boxheroEndpointsNested
>;

type BoxheroEndpoint<K extends keyof BoxheroEndpointOutputs> = CorsairEndpoint<
	BoxheroContext,
	BoxheroEndpointInputs[K],
	BoxheroEndpointOutputs[K]
>;

export type BoxheroEndpoints = {
	locationsDelete: BoxheroEndpoint<'locationsDelete'>;
	locationsList: BoxheroEndpoint<'locationsList'>;
	locationsGet: BoxheroEndpoint<'locationsGet'>;
	transactionsListBasic: BoxheroEndpoint<'transactionsListBasic'>;
	transactionsListLocation: BoxheroEndpoint<'transactionsListLocation'>;
	partnersList: BoxheroEndpoint<'partnersList'>;
	itemsDelete: BoxheroEndpoint<'itemsDelete'>;
	itemsGet: BoxheroEndpoint<'itemsGet'>;
	itemsList: BoxheroEndpoint<'itemsList'>;
	itemAttributesList: BoxheroEndpoint<'itemAttributesList'>;
	itemAttributesGet: BoxheroEndpoint<'itemAttributesGet'>;
	teamsGetInfo: BoxheroEndpoint<'teamsGetInfo'>;
	membersList: BoxheroEndpoint<'membersList'>;
	membersGet: BoxheroEndpoint<'membersGet'>;
};

const boxheroEndpointsNested = {
	locations: {
		list: listLocations,
		get: getLocation,
		delete: deleteLocation,
	},
	transactions: {
		listBasic,
		listLocation,
	},
	partners: {
		list: listPartners,
	},
	items: {
		list: listItems,
		get: getItem,
		delete: deleteItem,
	},
	itemAttributes: {
		list: listItemAttributes,
		get: getItemAttribute,
	},
	teams: {
		getInfo: getTeamInfo,
	},
	members: {
		list: listMembers,
		get: getMember,
	},
} as const;

export const boxheroEndpointSchemas = {
	'locations.delete': {
		input: BoxheroEndpointInputSchemas.locationsDelete,
		output: BoxheroEndpointOutputSchemas.locationsDelete,
	},
	'locations.list': {
		input: BoxheroEndpointInputSchemas.locationsList,
		output: BoxheroEndpointOutputSchemas.locationsList,
	},
	'locations.get': {
		input: BoxheroEndpointInputSchemas.locationsGet,
		output: BoxheroEndpointOutputSchemas.locationsGet,
	},
	'transactions.listBasic': {
		input: BoxheroEndpointInputSchemas.transactionsListBasic,
		output: BoxheroEndpointOutputSchemas.transactionsListBasic,
	},
	'transactions.listLocation': {
		input: BoxheroEndpointInputSchemas.transactionsListLocation,
		output: BoxheroEndpointOutputSchemas.transactionsListLocation,
	},
	'partners.list': {
		input: BoxheroEndpointInputSchemas.partnersList,
		output: BoxheroEndpointOutputSchemas.partnersList,
	},
	'items.delete': {
		input: BoxheroEndpointInputSchemas.itemsDelete,
		output: BoxheroEndpointOutputSchemas.itemsDelete,
	},
	'items.get': {
		input: BoxheroEndpointInputSchemas.itemsGet,
		output: BoxheroEndpointOutputSchemas.itemsGet,
	},
	'items.list': {
		input: BoxheroEndpointInputSchemas.itemsList,
		output: BoxheroEndpointOutputSchemas.itemsList,
	},
	'itemAttributes.list': {
		input: BoxheroEndpointInputSchemas.itemAttributesList,
		output: BoxheroEndpointOutputSchemas.itemAttributesList,
	},
	'itemAttributes.get': {
		input: BoxheroEndpointInputSchemas.itemAttributesGet,
		output: BoxheroEndpointOutputSchemas.itemAttributesGet,
	},
	'teams.getInfo': {
		input: BoxheroEndpointInputSchemas.teamsGetInfo,
		output: BoxheroEndpointOutputSchemas.teamsGetInfo,
	},
	'members.list': {
		input: BoxheroEndpointInputSchemas.membersList,
		output: BoxheroEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: BoxheroEndpointInputSchemas.membersGet,
		output: BoxheroEndpointOutputSchemas.membersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof boxheroEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const boxheroEndpointMeta = {
	'locations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a warehouse location',
	},
	'locations.list': {
		riskLevel: 'read',
		description: 'List active warehouse locations',
	},
	'locations.get': {
		riskLevel: 'read',
		description: 'Get a warehouse location',
	},
	'transactions.listBasic': {
		riskLevel: 'read',
		description: 'List inventory transactions without line items',
	},
	'transactions.listLocation': {
		riskLevel: 'read',
		description: 'List location-mode inventory transactions',
	},
	'partners.list': {
		riskLevel: 'read',
		description: 'List partners (suppliers and customers)',
	},
	'items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an inventory item',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Get an inventory item',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'List inventory items',
	},
	'itemAttributes.list': {
		riskLevel: 'read',
		description: 'List item attribute specs',
	},
	'itemAttributes.get': {
		riskLevel: 'read',
		description: 'Get an item attribute spec',
	},
	'teams.getInfo': {
		riskLevel: 'read',
		description: 'Get the team linked to the API token',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List team members',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get a team member',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boxheroEndpointsNested>;

export type BaseBoxheroPlugin<T extends BoxheroPluginOptions> = CorsairPlugin<
	'boxhero',
	typeof BoxheroSchema,
	typeof boxheroEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBoxheroPlugin = BaseBoxheroPlugin<BoxheroPluginOptions>;

export type ExternalBoxheroPlugin<T extends BoxheroPluginOptions> =
	BaseBoxheroPlugin<T>;

/**
 * BoxHero plugin.
 *
 * **No inbound webhooks.** BoxHero Open API is request/response only.
 */
export function boxhero<const T extends BoxheroPluginOptions>(
	incomingOptions: BoxheroPluginOptions & T = {} as BoxheroPluginOptions & T,
): ExternalBoxheroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boxhero',
		authConfig: boxheroAuthConfig,
		schema: BoxheroSchema,
		options,
		hooks: options.hooks,
		endpoints: boxheroEndpointsNested,
		webhooks: {},
		endpointMeta: boxheroEndpointMeta,
		endpointSchemas: boxheroEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoxheroKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('boxhero', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('boxhero', ctx.authType);
		},
	} satisfies InternalBoxheroPlugin;
}

export type {
	BoxheroEndpointInputs,
	BoxheroEndpointOutputs,
	Item,
	ItemAttribute,
	ItemAttributeDefinition,
	ItemAttributeGetInput,
	ItemAttributeGetResponse,
	ItemAttributesListInput,
	ItemAttributesListResponse,
	ItemsDeleteInput,
	ItemsDeleteResponse,
	ItemsGetInput,
	ItemsGetResponse,
	ItemsListInput,
	ItemsListResponse,
	LocationsDeleteInput,
	LocationsDeleteResponse,
	LocationsGetInput,
	LocationsGetResponse,
	LocationsListInput,
	LocationsListResponse,
	Member,
	MembersGetInput,
	MembersGetResponse,
	MembersListInput,
	MembersListResponse,
	Partner,
	PartnersListInput,
	PartnersListResponse,
	Team,
	TeamsGetInput,
	TeamsGetResponse,
	TransactionsListBasicInput,
	TransactionsListBasicResponse,
	TransactionsListLocationInput,
	TransactionsListLocationResponse,
} from './endpoints/types';
