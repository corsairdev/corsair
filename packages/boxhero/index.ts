import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	ItemAttributes,
	Items,
	Locations,
	Members,
	Partners,
	Teams,
	Transactions,
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
import { ExampleWebhooks } from './webhooks';
import { resolveBoxheroOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBoxheroTenantWebhook } from './webhooks/tenant-matcher';
import type { BoxheroWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BoxheroPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBoxheroPlugin['hooks'];
	webhookHooks?: InternalBoxheroPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boxheroEndpointsNested>;
};

export type BoxheroContext = CorsairPluginContext<
	typeof BoxheroSchema,
	BoxheroPluginOptions
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

type BoxheroWebhook<
	K extends keyof BoxheroWebhookOutputs,
	TEvent,
> = CorsairWebhook<BoxheroContext, TEvent, BoxheroWebhookOutputs[K]>;

export type BoxheroWebhooks = {
	example: BoxheroWebhook<'example', ExampleEvent>;
};

export type BoxheroBoundWebhooks = BindWebhooks<BoxheroWebhooks>;

const boxheroEndpointsNested = {
	locations: {
		list: Locations.list,
		get: Locations.get,
		delete: Locations.delete,
	},
	transactions: {
		listBasic: Transactions.listBasic,
		listLocation: Transactions.listLocation,
	},
	partners: {
		list: Partners.list,
	},
	items: {
		list: Items.list,
		get: Items.get,
		delete: Items.delete,
	},
	itemAttributes: {
		list: ItemAttributes.list,
		get: ItemAttributes.get,
	},
	teams: {
		getInfo: Teams.getInfo,
	},
	members: {
		list: Members.list,
		get: Members.get,
	},
} as const;

const boxheroWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
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

const boxheroWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof boxheroWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const boxheroEndpointMeta = {
	'locations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a warehouse location [DESTRUCTIVE · IRREVERSIBLE]',
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
		description: 'List basic inventory transactions',
	},
	'transactions.listLocation': {
		riskLevel: 'read',
		description: 'List location-based inventory transactions',
	},
	'partners.list': {
		riskLevel: 'read',
		description: 'List inventory partners',
	},
	'items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an inventory item [DESTRUCTIVE · IRREVERSIBLE]',
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
		description: 'List item attribute definitions',
	},
	'itemAttributes.get': {
		riskLevel: 'read',
		description: 'Get an item attribute definition',
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

export const boxheroAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoxheroPlugin<T extends BoxheroPluginOptions> = CorsairPlugin<
	'boxhero',
	typeof BoxheroSchema,
	typeof boxheroEndpointsNested,
	typeof boxheroWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoxheroPlugin = BaseBoxheroPlugin<BoxheroPluginOptions>;

export type ExternalBoxheroPlugin<T extends BoxheroPluginOptions> =
	BaseBoxheroPlugin<T>;

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
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boxheroEndpointsNested,
		webhooks: boxheroWebhooksNested,
		endpointMeta: boxheroEndpointMeta,
		endpointSchemas: boxheroEndpointSchemas,
		webhookSchemas: boxheroWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-boxhero-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBoxheroTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBoxheroOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoxheroKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
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
export type {
	BoxheroWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
