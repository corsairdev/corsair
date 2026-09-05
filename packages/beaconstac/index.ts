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
	analyticsPeriodOverview,
	analyticsProductOverview,
	bulkQrcodesList,
	organizationsList,
	placesCreate,
	placesList,
	placesUpdate,
	qrcodesDelete,
	qrcodesGet,
	qrcodesUpdate,
	qrTemplatesCreate,
	qrTemplatesDelete,
	qrTemplatesList,
	tagsCreate,
	tagsDelete,
	tagsList,
	tagsUpdate,
	usersCreate,
	usersGet,
	usersList,
	usersUpdate,
} from './endpoints';
import type {
	BeaconstacEndpointInputs,
	BeaconstacEndpointOutputs,
} from './endpoints/types';
import {
	BeaconstacEndpointInputSchemas,
	BeaconstacEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BeaconstacSchema } from './schema';

export type BeaconstacPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBeaconstacPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof beaconstacEndpointsNested>;
};

export type BeaconstacContext = CorsairPluginContext<
	typeof BeaconstacSchema,
	BeaconstacPluginOptions
>;

export type BeaconstacKeyBuilderContext =
	KeyBuilderContext<BeaconstacPluginOptions>;

export type BeaconstacBoundEndpoints = BindEndpoints<
	typeof beaconstacEndpointsNested
>;

type BeaconstacEndpoint<K extends keyof BeaconstacEndpointOutputs> =
	CorsairEndpoint<
		BeaconstacContext,
		BeaconstacEndpointInputs[K],
		BeaconstacEndpointOutputs[K]
	>;

export type BeaconstacEndpoints = {
	placesCreate: BeaconstacEndpoint<'placesCreate'>;
	placesList: BeaconstacEndpoint<'placesList'>;
	placesUpdate: BeaconstacEndpoint<'placesUpdate'>;
	qrTemplatesCreate: BeaconstacEndpoint<'qrTemplatesCreate'>;
	qrTemplatesList: BeaconstacEndpoint<'qrTemplatesList'>;
	qrTemplatesDelete: BeaconstacEndpoint<'qrTemplatesDelete'>;
	tagsCreate: BeaconstacEndpoint<'tagsCreate'>;
	tagsList: BeaconstacEndpoint<'tagsList'>;
	tagsUpdate: BeaconstacEndpoint<'tagsUpdate'>;
	tagsDelete: BeaconstacEndpoint<'tagsDelete'>;
	usersCreate: BeaconstacEndpoint<'usersCreate'>;
	usersList: BeaconstacEndpoint<'usersList'>;
	usersGet: BeaconstacEndpoint<'usersGet'>;
	usersUpdate: BeaconstacEndpoint<'usersUpdate'>;
	qrcodesGet: BeaconstacEndpoint<'qrcodesGet'>;
	qrcodesUpdate: BeaconstacEndpoint<'qrcodesUpdate'>;
	qrcodesDelete: BeaconstacEndpoint<'qrcodesDelete'>;
	bulkQrcodesList: BeaconstacEndpoint<'bulkQrcodesList'>;
	organizationsList: BeaconstacEndpoint<'organizationsList'>;
	analyticsPeriodOverview: BeaconstacEndpoint<'analyticsPeriodOverview'>;
	analyticsProductOverview: BeaconstacEndpoint<'analyticsProductOverview'>;
};

const beaconstacEndpointsNested = {
	places: {
		create: placesCreate,
		list: placesList,
		update: placesUpdate,
	},
	qrTemplates: {
		create: qrTemplatesCreate,
		list: qrTemplatesList,
		delete: qrTemplatesDelete,
	},
	tags: {
		create: tagsCreate,
		list: tagsList,
		update: tagsUpdate,
		delete: tagsDelete,
	},
	users: {
		create: usersCreate,
		list: usersList,
		get: usersGet,
		update: usersUpdate,
	},
	qrcodes: {
		get: qrcodesGet,
		update: qrcodesUpdate,
		delete: qrcodesDelete,
	},
	bulkQrcodes: {
		list: bulkQrcodesList,
	},
	organizations: {
		list: organizationsList,
	},
	analytics: {
		periodOverview: analyticsPeriodOverview,
		productOverview: analyticsProductOverview,
	},
} as const;

const beaconstacWebhooksNested = {} as const;

export const beaconstacEndpointSchemas = {
	'places.create': {
		input: BeaconstacEndpointInputSchemas.placesCreate,
		output: BeaconstacEndpointOutputSchemas.placesCreate,
	},
	'places.list': {
		input: BeaconstacEndpointInputSchemas.placesList,
		output: BeaconstacEndpointOutputSchemas.placesList,
	},
	'places.update': {
		input: BeaconstacEndpointInputSchemas.placesUpdate,
		output: BeaconstacEndpointOutputSchemas.placesUpdate,
	},
	'qrTemplates.create': {
		input: BeaconstacEndpointInputSchemas.qrTemplatesCreate,
		output: BeaconstacEndpointOutputSchemas.qrTemplatesCreate,
	},
	'qrTemplates.list': {
		input: BeaconstacEndpointInputSchemas.qrTemplatesList,
		output: BeaconstacEndpointOutputSchemas.qrTemplatesList,
	},
	'qrTemplates.delete': {
		input: BeaconstacEndpointInputSchemas.qrTemplatesDelete,
		output: BeaconstacEndpointOutputSchemas.qrTemplatesDelete,
	},
	'tags.create': {
		input: BeaconstacEndpointInputSchemas.tagsCreate,
		output: BeaconstacEndpointOutputSchemas.tagsCreate,
	},
	'tags.list': {
		input: BeaconstacEndpointInputSchemas.tagsList,
		output: BeaconstacEndpointOutputSchemas.tagsList,
	},
	'tags.update': {
		input: BeaconstacEndpointInputSchemas.tagsUpdate,
		output: BeaconstacEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: BeaconstacEndpointInputSchemas.tagsDelete,
		output: BeaconstacEndpointOutputSchemas.tagsDelete,
	},
	'users.create': {
		input: BeaconstacEndpointInputSchemas.usersCreate,
		output: BeaconstacEndpointOutputSchemas.usersCreate,
	},
	'users.list': {
		input: BeaconstacEndpointInputSchemas.usersList,
		output: BeaconstacEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: BeaconstacEndpointInputSchemas.usersGet,
		output: BeaconstacEndpointOutputSchemas.usersGet,
	},
	'users.update': {
		input: BeaconstacEndpointInputSchemas.usersUpdate,
		output: BeaconstacEndpointOutputSchemas.usersUpdate,
	},
	'qrcodes.get': {
		input: BeaconstacEndpointInputSchemas.qrcodesGet,
		output: BeaconstacEndpointOutputSchemas.qrcodesGet,
	},
	'qrcodes.update': {
		input: BeaconstacEndpointInputSchemas.qrcodesUpdate,
		output: BeaconstacEndpointOutputSchemas.qrcodesUpdate,
	},
	'qrcodes.delete': {
		input: BeaconstacEndpointInputSchemas.qrcodesDelete,
		output: BeaconstacEndpointOutputSchemas.qrcodesDelete,
	},
	'bulkQrcodes.list': {
		input: BeaconstacEndpointInputSchemas.bulkQrcodesList,
		output: BeaconstacEndpointOutputSchemas.bulkQrcodesList,
	},
	'organizations.list': {
		input: BeaconstacEndpointInputSchemas.organizationsList,
		output: BeaconstacEndpointOutputSchemas.organizationsList,
	},
	'analytics.periodOverview': {
		input: BeaconstacEndpointInputSchemas.analyticsPeriodOverview,
		output: BeaconstacEndpointOutputSchemas.analyticsPeriodOverview,
	},
	'analytics.productOverview': {
		input: BeaconstacEndpointInputSchemas.analyticsProductOverview,
		output: BeaconstacEndpointOutputSchemas.analyticsProductOverview,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof beaconstacEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const beaconstacEndpointMeta = {
	'places.create': {
		riskLevel: 'write',
		description: 'Create a new place for location-based assets',
	},
	'places.list': {
		riskLevel: 'read',
		description: 'List places with filtering, search, and pagination',
	},
	'places.update': {
		riskLevel: 'write',
		description: 'Update a place name, address, or coordinates',
	},
	'qrTemplates.create': {
		riskLevel: 'write',
		description: 'Create a reusable QR Code design template',
	},
	'qrTemplates.list': {
		riskLevel: 'read',
		description: 'List QR Code templates for an organization',
	},
	'qrTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a QR Code template by ID',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag for organizing QR Codes',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags with optional filtering and pagination',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update a tag name or color',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag by ID',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a user under an organization (Reseller+)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users with filtering, search, and pagination',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve a user by ID',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a user profile or organization',
	},
	'qrcodes.get': {
		riskLevel: 'read',
		description: 'Retrieve a QR Code by ID',
	},
	'qrcodes.update': {
		riskLevel: 'write',
		description: 'Update a QR Code name, design, tags, or content',
	},
	'qrcodes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a QR Code by ID',
	},
	'bulkQrcodes.list': {
		riskLevel: 'read',
		description: 'List bulk QR Code collections',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations accessible to the authenticated account',
	},
	'analytics.periodOverview': {
		riskLevel: 'read',
		description: 'Period overview analytics for a product type',
	},
	'analytics.productOverview': {
		riskLevel: 'read',
		description: 'Product overview analytics for a time interval',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof beaconstacEndpointsNested
>;

export const beaconstacAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBeaconstacPlugin<T extends BeaconstacPluginOptions> =
	CorsairPlugin<
		'beaconstac',
		typeof BeaconstacSchema,
		typeof beaconstacEndpointsNested,
		typeof beaconstacWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBeaconstacPlugin =
	BaseBeaconstacPlugin<BeaconstacPluginOptions>;

export type ExternalBeaconstacPlugin<T extends BeaconstacPluginOptions> =
	BaseBeaconstacPlugin<T>;

export function beaconstac<const T extends BeaconstacPluginOptions>(
	incomingOptions: BeaconstacPluginOptions & T = {} as BeaconstacPluginOptions &
		T,
): ExternalBeaconstacPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'beaconstac',
		authConfig: beaconstacAuthConfig,
		schema: BeaconstacSchema,
		options,
		hooks: options.hooks,
		endpoints: beaconstacEndpointsNested,
		webhooks: beaconstacWebhooksNested,
		endpointMeta: beaconstacEndpointMeta,
		endpointSchemas: beaconstacEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BeaconstacKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('beaconstac', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('beaconstac', 'api_key');
		},
	} satisfies InternalBeaconstacPlugin;
}

export type {
	AnalyticsPeriodOverviewInput,
	AnalyticsPeriodOverviewResponse,
	AnalyticsProductOverviewInput,
	AnalyticsProductOverviewResponse,
	BeaconstacEndpointInputs,
	BeaconstacEndpointOutputs,
	BulkQrcodesListInput,
	BulkQrcodesListResponse,
	OrganizationsListInput,
	OrganizationsListResponse,
	PlacesCreateInput,
	PlacesCreateResponse,
	PlacesListInput,
	PlacesListResponse,
	PlacesUpdateInput,
	PlacesUpdateResponse,
	QrcodesDeleteInput,
	QrcodesDeleteResponse,
	QrcodesGetInput,
	QrcodesGetResponse,
	QrcodesUpdateInput,
	QrcodesUpdateResponse,
	QrTemplatesCreateInput,
	QrTemplatesCreateResponse,
	QrTemplatesDeleteInput,
	QrTemplatesDeleteResponse,
	QrTemplatesListInput,
	QrTemplatesListResponse,
	TagsCreateInput,
	TagsCreateResponse,
	TagsDeleteInput,
	TagsDeleteResponse,
	TagsListInput,
	TagsListResponse,
	TagsUpdateInput,
	TagsUpdateResponse,
	UsersCreateInput,
	UsersCreateResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListResponse,
	UsersUpdateInput,
	UsersUpdateResponse,
} from './endpoints/types';

export {
	BeaconstacEndpointInputSchemas,
	BeaconstacEndpointOutputSchemas,
} from './endpoints/types';
