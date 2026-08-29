import type {
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
import { getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import type { ZohoInventoryRegion } from './client';
import {
	zohoInventoryOAuthAuthUrl,
	zohoInventoryOAuthTokenUrl,
} from './client';
import {
	ContactsEndpoints,
	ItemsEndpoints,
	OrganizationsEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	ZohoInventoryEndpointInputs,
	ZohoInventoryEndpointOutputs,
} from './endpoints/types';
import {
	ZohoInventoryEndpointInputSchemas,
	ZohoInventoryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ZohoInventoryCredentials } from './schema';
import { ZohoInventorySchema } from './schema';
import { resolveZohoInventoryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

/** Zoho Inventory uses OAuth2 with organization_id as the tenant identifier. */
export const zohoInventoryAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
	managed: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ZohoInventoryPluginOptions = {
	authType?: PickAuth<'oauth_2' | 'managed'>;
	/** Zoho datacenter region. Selects the accounts.zoho.* and zohoapis.* hosts. Default 'us'. */
	region?: ZohoInventoryRegion;
	/** Optional API domain override (e.g. 'https://www.zohoapis.com') */
	apiDomain?: string;
	key?: string;
	credentials?: ZohoInventoryCredentials;
	hooks?: InternalZohoInventoryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Zoho Inventory plugin.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof zohoInventoryEndpointsNested>;
};

export type ZohoInventoryContext = CorsairPluginContext<
	typeof ZohoInventorySchema,
	ZohoInventoryPluginOptions,
	undefined,
	typeof zohoInventoryAuthConfig
>;

export type ZohoInventoryKeyBuilderContext = KeyBuilderContext<
	ZohoInventoryPluginOptions,
	typeof zohoInventoryAuthConfig
>;

type ZohoInventoryEndpoint<K extends keyof ZohoInventoryEndpointOutputs> =
	CorsairEndpoint<
		ZohoInventoryContext,
		ZohoInventoryEndpointInputs[K],
		ZohoInventoryEndpointOutputs[K]
	>;

export type ZohoInventoryEndpoints = {
	organizationsList: ZohoInventoryEndpoint<'organizationsList'>;
	itemsList: ZohoInventoryEndpoint<'itemsList'>;
	contactsList: ZohoInventoryEndpoint<'contactsList'>;
	usersList: ZohoInventoryEndpoint<'usersList'>;
};

export const zohoInventoryEndpointsNested = {
	organizations: {
		list: OrganizationsEndpoints.list,
	},
	items: {
		list: ItemsEndpoints.list,
	},
	contacts: {
		list: ContactsEndpoints.list,
	},
	users: {
		list: UsersEndpoints.list,
	},
} as const;

export type ZohoInventoryBoundEndpoints = BindEndpoints<
	typeof zohoInventoryEndpointsNested
>;

const zohoInventoryWebhooksNested = {} as const;

export const zohoInventoryEndpointSchemas = {
	'organizations.list': {
		input: ZohoInventoryEndpointInputSchemas.organizationsList,
		output: ZohoInventoryEndpointOutputSchemas.organizationsList,
	},
	'items.list': {
		input: ZohoInventoryEndpointInputSchemas.itemsList,
		output: ZohoInventoryEndpointOutputSchemas.itemsList,
	},
	'contacts.list': {
		input: ZohoInventoryEndpointInputSchemas.contactsList,
		output: ZohoInventoryEndpointOutputSchemas.contactsList,
	},
	'users.list': {
		input: ZohoInventoryEndpointInputSchemas.usersList,
		output: ZohoInventoryEndpointOutputSchemas.usersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoInventoryEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const zohoInventoryEndpointMeta = {
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations in Zoho Inventory',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'List inventory items for an organization',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts (customers/vendors) for an organization',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users associated with an organization',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof zohoInventoryEndpointsNested
>;

export type BaseZohoInventoryPlugin<T extends ZohoInventoryPluginOptions> =
	CorsairPlugin<
		'zohoinventory',
		typeof ZohoInventorySchema,
		typeof zohoInventoryEndpointsNested,
		typeof zohoInventoryWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof zohoInventoryAuthConfig
	>;

export type InternalZohoInventoryPlugin =
	BaseZohoInventoryPlugin<ZohoInventoryPluginOptions>;

export type ExternalZohoInventoryPlugin<T extends ZohoInventoryPluginOptions> =
	BaseZohoInventoryPlugin<T>;

export function zohoinventory<const T extends ZohoInventoryPluginOptions>(
	incomingOptions: ZohoInventoryPluginOptions &
		T = {} as ZohoInventoryPluginOptions & T,
): ExternalZohoInventoryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const region = options.region;

	return {
		id: 'zohoinventory',
		schema: ZohoInventorySchema,
		options: options,
		authConfig: zohoInventoryAuthConfig,
		oauthConfig: {
			providerName: 'Zoho',
			authUrl: zohoInventoryOAuthAuthUrl(region),
			tokenUrl: zohoInventoryOAuthTokenUrl(region),
			scopes: [
				'ZohoInventory.settings.READ',
				'ZohoInventory.items.READ',
				'ZohoInventory.contacts.READ',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: zohoInventoryEndpointsNested,
		webhooks: zohoInventoryWebhooksNested,
		endpointMeta: zohoInventoryEndpointMeta,
		endpointSchemas: zohoInventoryEndpointSchemas,
		webhookSchemas: undefined,
		pluginWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: resolveZohoInventoryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoInventoryKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'zohoinventory',
					tokenUrl: zohoInventoryOAuthTokenUrl(ctx.options.region),
					tokenAuthMethod: 'body',
				});
			}

			if (ctx.authType === 'managed') {
				if (!ctx.hub) {
					throw new Error(
						'[auth-missing:zohoinventory:managed]: Hub config is required for managed auth. Pass hub: { ... } to createCorsair().',
					);
				}

				const managedContext = {
					keys: ctx.keys,
					hub: ctx.hub,
					plugin: 'zohoinventory',
					tenantId: ctx.tenantId,
				};

				const result = await getManagedAccessToken(managedContext);
				await attachManagedRefreshAuth(ctx, managedContext);
				return result.accessToken;
			}

			throw new Error(
				`[auth-missing:zohoinventory:${authType}]: Zoho Inventory key is missing`,
			);
		},
	} satisfies InternalZohoInventoryPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { ZohoInventoryRegion } from './client';
export type {
	ListContactsInput,
	ListContactsResponse,
	ListItemsInput,
	ListItemsResponse,
	ListOrganizationsInput,
	ListOrganizationsResponse,
	ListUsersInput,
	ListUsersResponse,
	ZohoInventoryEndpointInputs,
	ZohoInventoryEndpointOutputs,
} from './endpoints/types';
export type { ZohoInventoryCredentials } from './schema';
export { ZohoInventorySchema } from './schema';
export type * from './types';
export { resolveZohoInventoryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
