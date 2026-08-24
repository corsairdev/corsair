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
	APALEO_AUTH_URL,
	APALEO_TOKEN_URL,
	getValidApaleoAccessToken,
} from './client';
import { Properties, UnitAttributes, UnitGroups, Units } from './endpoints';
import type {
	ApaleoEndpointInputs,
	ApaleoEndpointOutputs,
} from './endpoints/types';
import {
	ApaleoEndpointInputSchemas,
	ApaleoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApaleoSchema } from './schema';

export type ApaleoPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Pre-resolved bearer token. */
	key?: string;
	hooks?: InternalApaleoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apaleoEndpointsNested>;
	scopes?: string[];
};

export type ApaleoContext = CorsairPluginContext<
	typeof ApaleoSchema,
	ApaleoPluginOptions
>;

export type ApaleoKeyBuilderContext = KeyBuilderContext<ApaleoPluginOptions>;

export type ApaleoBoundEndpoints = BindEndpoints<typeof apaleoEndpointsNested>;

type ApaleoEndpoint<K extends keyof ApaleoEndpointOutputs> = CorsairEndpoint<
	ApaleoContext,
	ApaleoEndpointInputs[K],
	ApaleoEndpointOutputs[K]
>;

export type ApaleoEndpoints = {
	propertiesList: ApaleoEndpoint<'propertiesList'>;
	propertiesCreate: ApaleoEndpoint<'propertiesCreate'>;
	propertiesCount: ApaleoEndpoint<'propertiesCount'>;
	propertiesExists: ApaleoEndpoint<'propertiesExists'>;
	propertiesGet: ApaleoEndpoint<'propertiesGet'>;
	propertiesClone: ApaleoEndpoint<'propertiesClone'>;
	propertiesArchive: ApaleoEndpoint<'propertiesArchive'>;
	propertiesSetLive: ApaleoEndpoint<'propertiesSetLive'>;
	propertiesReset: ApaleoEndpoint<'propertiesReset'>;
	propertiesCountries: ApaleoEndpoint<'propertiesCountries'>;
	unitsGet: ApaleoEndpoint<'unitsGet'>;
	unitsExists: ApaleoEndpoint<'unitsExists'>;
	unitsDelete: ApaleoEndpoint<'unitsDelete'>;
	unitsList: ApaleoEndpoint<'unitsList'>;
	unitsCreate: ApaleoEndpoint<'unitsCreate'>;
	unitsCount: ApaleoEndpoint<'unitsCount'>;
	unitsCreateBulk: ApaleoEndpoint<'unitsCreateBulk'>;
	unitAttributesGet: ApaleoEndpoint<'unitAttributesGet'>;
	unitAttributesDelete: ApaleoEndpoint<'unitAttributesDelete'>;
	unitAttributesExists: ApaleoEndpoint<'unitAttributesExists'>;
	unitAttributesList: ApaleoEndpoint<'unitAttributesList'>;
	unitAttributesCreate: ApaleoEndpoint<'unitAttributesCreate'>;
	unitGroupsCreate: ApaleoEndpoint<'unitGroupsCreate'>;
	unitGroupsList: ApaleoEndpoint<'unitGroupsList'>;
	unitGroupsCount: ApaleoEndpoint<'unitGroupsCount'>;
	unitGroupsExists: ApaleoEndpoint<'unitGroupsExists'>;
	unitGroupsGet: ApaleoEndpoint<'unitGroupsGet'>;
	unitGroupsReplace: ApaleoEndpoint<'unitGroupsReplace'>;
	unitGroupsDelete: ApaleoEndpoint<'unitGroupsDelete'>;
};

const apaleoEndpointsNested = {
	properties: {
		list: Properties.list,
		create: Properties.create,
		count: Properties.count,
		exists: Properties.exists,
		get: Properties.get,
		clone: Properties.clone,
		archive: Properties.archive,
		setLive: Properties.setLive,
		reset: Properties.reset,
		countries: Properties.countries,
	},
	units: {
		get: Units.get,
		exists: Units.exists,
		delete: Units.remove,
		list: Units.list,
		create: Units.create,
		count: Units.count,
		createBulk: Units.createBulk,
	},
	unitAttributes: {
		get: UnitAttributes.get,
		delete: UnitAttributes.remove,
		exists: UnitAttributes.exists,
		list: UnitAttributes.list,
		create: UnitAttributes.create,
	},
	unitGroups: {
		create: UnitGroups.create,
		list: UnitGroups.list,
		count: UnitGroups.count,
		exists: UnitGroups.exists,
		get: UnitGroups.get,
		replace: UnitGroups.replace,
		delete: UnitGroups.remove,
	},
} as const;

const apaleoWebhooksNested = {} as const;

export const apaleoEndpointSchemas = {
	'properties.list': {
		input: ApaleoEndpointInputSchemas.propertiesList,
		output: ApaleoEndpointOutputSchemas.propertiesList,
	},
	'properties.create': {
		input: ApaleoEndpointInputSchemas.propertiesCreate,
		output: ApaleoEndpointOutputSchemas.propertiesCreate,
	},
	'properties.count': {
		input: ApaleoEndpointInputSchemas.propertiesCount,
		output: ApaleoEndpointOutputSchemas.propertiesCount,
	},
	'properties.exists': {
		input: ApaleoEndpointInputSchemas.propertiesExists,
		output: ApaleoEndpointOutputSchemas.propertiesExists,
	},
	'properties.get': {
		input: ApaleoEndpointInputSchemas.propertiesGet,
		output: ApaleoEndpointOutputSchemas.propertiesGet,
	},
	'properties.clone': {
		input: ApaleoEndpointInputSchemas.propertiesClone,
		output: ApaleoEndpointOutputSchemas.propertiesClone,
	},
	'properties.archive': {
		input: ApaleoEndpointInputSchemas.propertiesArchive,
		output: ApaleoEndpointOutputSchemas.propertiesArchive,
	},
	'properties.setLive': {
		input: ApaleoEndpointInputSchemas.propertiesSetLive,
		output: ApaleoEndpointOutputSchemas.propertiesSetLive,
	},
	'properties.reset': {
		input: ApaleoEndpointInputSchemas.propertiesReset,
		output: ApaleoEndpointOutputSchemas.propertiesReset,
	},
	'properties.countries': {
		input: ApaleoEndpointInputSchemas.propertiesCountries,
		output: ApaleoEndpointOutputSchemas.propertiesCountries,
	},
	'units.get': {
		input: ApaleoEndpointInputSchemas.unitsGet,
		output: ApaleoEndpointOutputSchemas.unitsGet,
	},
	'units.exists': {
		input: ApaleoEndpointInputSchemas.unitsExists,
		output: ApaleoEndpointOutputSchemas.unitsExists,
	},
	'units.delete': {
		input: ApaleoEndpointInputSchemas.unitsDelete,
		output: ApaleoEndpointOutputSchemas.unitsDelete,
	},
	'units.list': {
		input: ApaleoEndpointInputSchemas.unitsList,
		output: ApaleoEndpointOutputSchemas.unitsList,
	},
	'units.create': {
		input: ApaleoEndpointInputSchemas.unitsCreate,
		output: ApaleoEndpointOutputSchemas.unitsCreate,
	},
	'units.count': {
		input: ApaleoEndpointInputSchemas.unitsCount,
		output: ApaleoEndpointOutputSchemas.unitsCount,
	},
	'units.createBulk': {
		input: ApaleoEndpointInputSchemas.unitsCreateBulk,
		output: ApaleoEndpointOutputSchemas.unitsCreateBulk,
	},
	'unitAttributes.get': {
		input: ApaleoEndpointInputSchemas.unitAttributesGet,
		output: ApaleoEndpointOutputSchemas.unitAttributesGet,
	},
	'unitAttributes.delete': {
		input: ApaleoEndpointInputSchemas.unitAttributesDelete,
		output: ApaleoEndpointOutputSchemas.unitAttributesDelete,
	},
	'unitAttributes.exists': {
		input: ApaleoEndpointInputSchemas.unitAttributesExists,
		output: ApaleoEndpointOutputSchemas.unitAttributesExists,
	},
	'unitAttributes.list': {
		input: ApaleoEndpointInputSchemas.unitAttributesList,
		output: ApaleoEndpointOutputSchemas.unitAttributesList,
	},
	'unitAttributes.create': {
		input: ApaleoEndpointInputSchemas.unitAttributesCreate,
		output: ApaleoEndpointOutputSchemas.unitAttributesCreate,
	},
	'unitGroups.create': {
		input: ApaleoEndpointInputSchemas.unitGroupsCreate,
		output: ApaleoEndpointOutputSchemas.unitGroupsCreate,
	},
	'unitGroups.list': {
		input: ApaleoEndpointInputSchemas.unitGroupsList,
		output: ApaleoEndpointOutputSchemas.unitGroupsList,
	},
	'unitGroups.count': {
		input: ApaleoEndpointInputSchemas.unitGroupsCount,
		output: ApaleoEndpointOutputSchemas.unitGroupsCount,
	},
	'unitGroups.exists': {
		input: ApaleoEndpointInputSchemas.unitGroupsExists,
		output: ApaleoEndpointOutputSchemas.unitGroupsExists,
	},
	'unitGroups.get': {
		input: ApaleoEndpointInputSchemas.unitGroupsGet,
		output: ApaleoEndpointOutputSchemas.unitGroupsGet,
	},
	'unitGroups.replace': {
		input: ApaleoEndpointInputSchemas.unitGroupsReplace,
		output: ApaleoEndpointOutputSchemas.unitGroupsReplace,
	},
	'unitGroups.delete': {
		input: ApaleoEndpointInputSchemas.unitGroupsDelete,
		output: ApaleoEndpointOutputSchemas.unitGroupsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apaleoEndpointsNested
>;

/**
 * Inventory scopes from the official swagger + setup umbrella scopes.
 * https://apaleo.dev/guides/api/scopes.html
 * https://api.apaleo.com/swagger/inventory-v1/swagger.json
 */
export const defaultApaleoScopes = [
	'offline_access',
	'setup.read',
	'setup.manage',
] as const;

export const apaleoEndpointMeta = {
	'properties.list': {
		riskLevel: 'read',
		description: 'Get the list of properties',
	},
	'properties.create': {
		riskLevel: 'write',
		description: 'Create a new property',
	},
	'properties.count': {
		riskLevel: 'read',
		description: 'Return total count of properties',
	},
	'properties.exists': {
		riskLevel: 'read',
		description: 'Check if a property exists by id',
	},
	'properties.get': {
		riskLevel: 'read',
		description: 'Get a property by id',
	},
	'properties.clone': {
		riskLevel: 'write',
		description:
			'Clone a property, creating a new property with inventory and rate plans',
	},
	'properties.archive': {
		riskLevel: 'write',
		description: 'Archive a live property (sets isArchived to true)',
	},
	'properties.setLive': {
		riskLevel: 'write',
		description: 'Move a test property to Live status',
	},
	'properties.reset': {
		riskLevel: 'write',
		description: 'Delete transactional data for a property in Test status',
	},
	'properties.countries': {
		riskLevel: 'read',
		description: 'List ISO country codes that can be used to create properties',
	},
	'units.get': {
		riskLevel: 'read',
		description: 'Get a unit by id',
	},
	'units.exists': {
		riskLevel: 'read',
		description: 'Check if a unit exists by id',
	},
	'units.delete': {
		riskLevel: 'write',
		description: 'Delete a unit',
	},
	'units.list': {
		riskLevel: 'read',
		description: 'Get the list of units',
	},
	'units.create': {
		riskLevel: 'write',
		description: 'Create a new unit',
	},
	'units.count': {
		riskLevel: 'read',
		description: 'Return number of units matching the filter',
	},
	'units.createBulk': {
		riskLevel: 'write',
		description: 'Create multiple units',
	},
	'unitAttributes.get': {
		riskLevel: 'read',
		description: 'Get a unit attribute by id',
	},
	'unitAttributes.delete': {
		riskLevel: 'write',
		description: 'Delete a unit attribute',
	},
	'unitAttributes.exists': {
		riskLevel: 'read',
		description: 'Check if a unit attribute exists',
	},
	'unitAttributes.list': {
		riskLevel: 'read',
		description: 'Get the unit attribute list',
	},
	'unitAttributes.create': {
		riskLevel: 'write',
		description: 'Create a new unit attribute',
	},
	'unitGroups.create': {
		riskLevel: 'write',
		description: 'Create a new unit group',
	},
	'unitGroups.list': {
		riskLevel: 'read',
		description: 'Get the list of unit groups',
	},
	'unitGroups.count': {
		riskLevel: 'read',
		description: 'Return number of unit groups matching the filter',
	},
	'unitGroups.exists': {
		riskLevel: 'read',
		description: 'Check if a unit group exists by id',
	},
	'unitGroups.get': {
		riskLevel: 'read',
		description: 'Get a unit group by id',
	},
	'unitGroups.replace': {
		riskLevel: 'write',
		description: 'Replace a unit group',
	},
	'unitGroups.delete': {
		riskLevel: 'write',
		description: 'Delete a unit group',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apaleoEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2';

export const apaleoAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseApaleoPlugin<T extends ApaleoPluginOptions> = CorsairPlugin<
	'apaleo',
	typeof ApaleoSchema,
	typeof apaleoEndpointsNested,
	typeof apaleoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApaleoPlugin = BaseApaleoPlugin<ApaleoPluginOptions>;
export type ExternalApaleoPlugin<T extends ApaleoPluginOptions> =
	BaseApaleoPlugin<T>;

export function apaleo<const T extends ApaleoPluginOptions>(
	incomingOptions: ApaleoPluginOptions & T = {} as ApaleoPluginOptions & T,
): ExternalApaleoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apaleo',
		authConfig: apaleoAuthConfig,
		schema: ApaleoSchema,
		options,
		oauthConfig: {
			providerName: 'Apaleo',
			authUrl: APALEO_AUTH_URL,
			tokenUrl: APALEO_TOKEN_URL,
			scopes: [...(options.scopes ?? defaultApaleoScopes)],
		},
		hooks: options.hooks,
		endpoints: apaleoEndpointsNested,
		webhooks: apaleoWebhooksNested,
		endpointMeta: apaleoEndpointMeta,
		endpointSchemas: apaleoEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ApaleoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source !== 'endpoint' || ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('apaleo', 'oauth_2');
			}
			const [accessToken, expiresAt, refreshToken, credentials] =
				await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
					ctx.keys.get_integration_credentials(),
				]);
			if (!credentials.client_id || !credentials.client_secret) {
				throw new Error(
					'[auth-missing:apaleo:client_credentials]: Apaleo client credentials are missing',
				);
			}
			const result = await getValidApaleoAccessToken({
				accessToken,
				expiresAt,
				refreshToken,
				clientId: credentials.client_id,
				clientSecret: credentials.client_secret,
			});
			if (result.refreshed) {
				await Promise.all([
					ctx.keys.set_access_token(result.accessToken),
					ctx.keys.set_expires_at(String(result.expiresAt)),
					result.refreshToken
						? ctx.keys.set_refresh_token(result.refreshToken)
						: Promise.resolve(),
				]);
			}
			return result.accessToken;
		},
	} satisfies InternalApaleoPlugin;
}

export { apaleoEndpointsNested };
export type {
	ApaleoEndpointInputs,
	ApaleoEndpointOutputs,
} from './endpoints/types';
