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
	Databases,
	Extensions,
	Images,
	InstanceTypes,
	Organizations,
	Records,
	Regions,
	Workspaces,
} from './endpoints';
import type {
	XataEndpointInputs,
	XataEndpointOutputs,
} from './endpoints/types';
import {
	XataEndpointInputSchemas,
	XataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { XataSchema } from './schema';

export type XataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	workspaceId?: string;
	region?: string;
	defaultBranch?: string;
	hooks?: InternalXataPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof xataEndpointsNested>;
};

export type XataContext = CorsairPluginContext<
	typeof XataSchema,
	XataPluginOptions
>;

export type XataKeyBuilderContext = KeyBuilderContext<XataPluginOptions>;

export type XataBoundEndpoints = BindEndpoints<typeof xataEndpointsNested>;

type XataEndpoint<K extends keyof XataEndpointOutputs> = CorsairEndpoint<
	XataContext,
	XataEndpointInputs[K],
	XataEndpointOutputs[K]
>;

export type XataEndpoints = {
	workspacesList: XataEndpoint<'workspacesList'>;
	databasesList: XataEndpoint<'databasesList'>;
	recordsCreate: XataEndpoint<'recordsCreate'>;
	recordsGet: XataEndpoint<'recordsGet'>;
	recordsUpdate: XataEndpoint<'recordsUpdate'>;
	recordsDelete: XataEndpoint<'recordsDelete'>;
	recordsQuery: XataEndpoint<'recordsQuery'>;
	organizationsList: XataEndpoint<'organizationsList'>;
	organizationsGet: XataEndpoint<'organizationsGet'>;
	organizationsUpdate: XataEndpoint<'organizationsUpdate'>;
	organizationsGetLimits: XataEndpoint<'organizationsGetLimits'>;
	organizationsGetProjectLimits: XataEndpoint<'organizationsGetProjectLimits'>;
	organizationsListApiKeys: XataEndpoint<'organizationsListApiKeys'>;
	regionsList: XataEndpoint<'regionsList'>;
	imagesList: XataEndpoint<'imagesList'>;
	instanceTypesList: XataEndpoint<'instanceTypesList'>;
	extensionsList: XataEndpoint<'extensionsList'>;
};

// Exported so endpoint files can use XataEndpoints[key] typing without circular issues
export type XataEndpointFunctions = XataEndpoints;

const xataEndpointsNested = {
	workspaces: {
		list: Workspaces.list,
	},
	databases: {
		list: Databases.list,
	},
	records: {
		create: Records.create,
		get: Records.get,
		update: Records.update,
		delete: Records.deleteRecord,
		query: Records.query,
	},
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
		update: Organizations.update,
		getLimits: Organizations.getLimits,
		getProjectLimits: Organizations.getProjectLimits,
		listApiKeys: Organizations.listApiKeys,
	},
	regions: {
		list: Regions.list,
	},
	images: {
		list: Images.list,
	},
	instanceTypes: {
		list: InstanceTypes.list,
	},
	extensions: {
		list: Extensions.list,
	},
} as const;

export const xataEndpointSchemas = {
	'workspaces.list': {
		input: XataEndpointInputSchemas.workspacesList,
		output: XataEndpointOutputSchemas.workspacesList,
	},
	'databases.list': {
		input: XataEndpointInputSchemas.databasesList,
		output: XataEndpointOutputSchemas.databasesList,
	},
	'records.create': {
		input: XataEndpointInputSchemas.recordsCreate,
		output: XataEndpointOutputSchemas.recordsCreate,
	},
	'records.get': {
		input: XataEndpointInputSchemas.recordsGet,
		output: XataEndpointOutputSchemas.recordsGet,
	},
	'records.update': {
		input: XataEndpointInputSchemas.recordsUpdate,
		output: XataEndpointOutputSchemas.recordsUpdate,
	},
	'records.delete': {
		input: XataEndpointInputSchemas.recordsDelete,
		output: XataEndpointOutputSchemas.recordsDelete,
	},
	'records.query': {
		input: XataEndpointInputSchemas.recordsQuery,
		output: XataEndpointOutputSchemas.recordsQuery,
	},
	'organizations.list': {
		input: XataEndpointInputSchemas.organizationsList,
		output: XataEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: XataEndpointInputSchemas.organizationsGet,
		output: XataEndpointOutputSchemas.organizationsGet,
	},
	'organizations.update': {
		input: XataEndpointInputSchemas.organizationsUpdate,
		output: XataEndpointOutputSchemas.organizationsUpdate,
	},
	'organizations.getLimits': {
		input: XataEndpointInputSchemas.organizationsGetLimits,
		output: XataEndpointOutputSchemas.organizationsGetLimits,
	},
	'organizations.getProjectLimits': {
		input: XataEndpointInputSchemas.organizationsGetProjectLimits,
		output: XataEndpointOutputSchemas.organizationsGetProjectLimits,
	},
	'organizations.listApiKeys': {
		input: XataEndpointInputSchemas.organizationsListApiKeys,
		output: XataEndpointOutputSchemas.organizationsListApiKeys,
	},
	'regions.list': {
		input: XataEndpointInputSchemas.regionsList,
		output: XataEndpointOutputSchemas.regionsList,
	},
	'images.list': {
		input: XataEndpointInputSchemas.imagesList,
		output: XataEndpointOutputSchemas.imagesList,
	},
	'instanceTypes.list': {
		input: XataEndpointInputSchemas.instanceTypesList,
		output: XataEndpointOutputSchemas.instanceTypesList,
	},
	'extensions.list': {
		input: XataEndpointInputSchemas.extensionsList,
		output: XataEndpointOutputSchemas.extensionsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof xataEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const xataEndpointMeta = {
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List accessible Xata workspaces',
	},
	'databases.list': {
		riskLevel: 'read',
		description: 'List databases in a Xata workspace',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a record in a Xata table',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Get a record by ID from a Xata table',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update an existing record in a Xata table',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Delete a record from a Xata table [DESTRUCTIVE]',
	},
	'records.query': {
		riskLevel: 'read',
		description:
			'Query records from a Xata table with filter/sort/page options',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List all organizations the authenticated user belongs to',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get detailed information about a specific organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update organization details such as name',
	},
	'organizations.getLimits': {
		riskLevel: 'read',
		description: 'Get membership/resource limits for an organization',
	},
	'organizations.getProjectLimits': {
		riskLevel: 'read',
		description: 'Get project resource limits for an organization',
	},
	'organizations.listApiKeys': {
		riskLevel: 'read',
		description: 'List API keys associated with an organization',
	},
	'regions.list': {
		riskLevel: 'read',
		description:
			'List available regions for deploying branches in an organization',
	},
	'images.list': {
		riskLevel: 'read',
		description:
			'List available Postgres images for an organization and region',
	},
	'instanceTypes.list': {
		riskLevel: 'read',
		description:
			'List available instance types for an organization in a region',
	},
	'extensions.list': {
		riskLevel: 'read',
		description: 'List available PostgreSQL extensions for a given image',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof xataEndpointsNested>;

export const xataAuthConfig = {
	api_key: {
		account: ['workspace_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseXataPlugin<T extends XataPluginOptions> = CorsairPlugin<
	'xata',
	typeof XataSchema,
	typeof xataEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalXataPlugin = BaseXataPlugin<XataPluginOptions>;

export type ExternalXataPlugin<T extends XataPluginOptions> = BaseXataPlugin<T>;

export function xata<const T extends XataPluginOptions>(
	incomingOptions: XataPluginOptions & T = {} as XataPluginOptions & T,
): ExternalXataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'xata',
		authConfig: xataAuthConfig,
		schema: XataSchema,
		options: options,
		hooks: options.hooks,
		endpoints: xataEndpointsNested,
		webhooks: {},
		endpointMeta: xataEndpointMeta,
		endpointSchemas: xataEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: XataKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('xata', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('xata', ctx.authType);
		},
	} satisfies InternalXataPlugin;
}

export type {
	DatabasesListInput,
	DatabasesListResponse,
	ExtensionsListInput,
	ExtensionsListResponse,
	ImagesListInput,
	ImagesListResponse,
	InstanceTypesListInput,
	InstanceTypesListResponse,
	OrganizationsGetInput,
	OrganizationsGetLimitsInput,
	OrganizationsGetLimitsResponse,
	OrganizationsGetProjectLimitsInput,
	OrganizationsGetProjectLimitsResponse,
	OrganizationsGetResponse,
	OrganizationsListApiKeysInput,
	OrganizationsListApiKeysResponse,
	OrganizationsListInput,
	OrganizationsListResponse,
	OrganizationsUpdateInput,
	OrganizationsUpdateResponse,
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsGetInput,
	RecordsGetResponse,
	RecordsQueryInput,
	RecordsQueryResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
	RegionsListInput,
	RegionsListResponse,
	WorkspacesListInput,
	WorkspacesListResponse,
	XataEndpointInputs,
	XataEndpointOutputs,
	XataRecord,
} from './endpoints/types';
