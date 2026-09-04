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
	addContact,
	deleteSegment,
	deleteServiceCategory,
	getAccountInfo,
	getAllWebhooks,
	getBroadcastById,
	getBroadcasts,
	getContacts,
	getMessagesOfContact,
	getSegments,
	getServiceById,
	getServiceCategories,
	getServices,
	getStaffAvailabilityBlocks,
	getStaffById,
	getStaffs,
	updateService,
} from './endpoints';
import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './endpoints/types';
import {
	WhautomateEndpointInputSchemas,
	WhautomateEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WhautomateSchema } from './schema';

export type WhautomatePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiHost?: string;
	hooks?: InternalWhautomatePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof whautomateEndpointsNested>;
};

export type WhautomateContext = CorsairPluginContext<
	typeof WhautomateSchema,
	WhautomatePluginOptions
>;

export type WhautomateKeyBuilderContext =
	KeyBuilderContext<WhautomatePluginOptions>;

export type WhautomateBoundEndpoints = BindEndpoints<
	typeof whautomateEndpointsNested
>;

type WhautomateEndpoint<K extends keyof WhautomateEndpointOutputs> =
	CorsairEndpoint<
		WhautomateContext,
		WhautomateEndpointInputs[K],
		WhautomateEndpointOutputs[K]
	>;

export type WhautomateEndpoints = {
	addContact: WhautomateEndpoint<'addContact'>;
	getContacts: WhautomateEndpoint<'getContacts'>;
	getMessagesOfContact: WhautomateEndpoint<'getMessagesOfContact'>;
	getSegments: WhautomateEndpoint<'getSegments'>;
	deleteSegment: WhautomateEndpoint<'deleteSegment'>;
	getServiceCategories: WhautomateEndpoint<'getServiceCategories'>;
	deleteServiceCategory: WhautomateEndpoint<'deleteServiceCategory'>;
	getAccountInfo: WhautomateEndpoint<'getAccountInfo'>;
	getAllWebhooks: WhautomateEndpoint<'getAllWebhooks'>;
	getBroadcasts: WhautomateEndpoint<'getBroadcasts'>;
	getBroadcastById: WhautomateEndpoint<'getBroadcastById'>;
	getServices: WhautomateEndpoint<'getServices'>;
	getServiceById: WhautomateEndpoint<'getServiceById'>;
	updateService: WhautomateEndpoint<'updateService'>;
	getStaffs: WhautomateEndpoint<'getStaffs'>;
	getStaffById: WhautomateEndpoint<'getStaffById'>;
	getStaffAvailabilityBlocks: WhautomateEndpoint<'getStaffAvailabilityBlocks'>;
};

type WhautomateWebhook<
	K extends keyof WhautomateWebhookOutputs,
	TEvent,
> = CorsairWebhook<WhautomateContext, TEvent, WhautomateWebhookOutputs[K]>;

export type WhautomateWebhooks = {};

export type WhautomateBoundWebhooks = BindWebhooks<WhautomateWebhooks>;

type WhautomateWebhookOutputs = {};

const whautomateEndpointsNested = {
	contacts: {
		addContact,
		getContacts,
		getMessagesOfContact,
	},
	segments: {
		getSegments,
		deleteSegment,
	},
	serviceCategories: {
		getServiceCategories,
		deleteServiceCategory,
	},
	account: {
		getAccountInfo,
	},
	webhooks: {
		getAllWebhooks,
	},
	broadcasts: {
		getBroadcasts,
		getBroadcastById,
	},
	services: {
		getServices,
		getServiceById,
		updateService,
	},
	staff: {
		getStaffs,
		getStaffById,
		getStaffAvailabilityBlocks,
	},
} as const;

export const whautomateEndpointSchemas = {
	'contacts.addContact': {
		input: WhautomateEndpointInputSchemas.addContact,
		output: WhautomateEndpointOutputSchemas.addContact,
	},
	'contacts.getContacts': {
		input: WhautomateEndpointInputSchemas.getContacts,
		output: WhautomateEndpointOutputSchemas.getContacts,
	},
	'contacts.getMessagesOfContact': {
		input: WhautomateEndpointInputSchemas.getMessagesOfContact,
		output: WhautomateEndpointOutputSchemas.getMessagesOfContact,
	},
	'segments.getSegments': {
		input: WhautomateEndpointInputSchemas.getSegments,
		output: WhautomateEndpointOutputSchemas.getSegments,
	},
	'segments.deleteSegment': {
		input: WhautomateEndpointInputSchemas.deleteSegment,
		output: WhautomateEndpointOutputSchemas.deleteSegment,
	},
	'serviceCategories.getServiceCategories': {
		input: WhautomateEndpointInputSchemas.getServiceCategories,
		output: WhautomateEndpointOutputSchemas.getServiceCategories,
	},
	'serviceCategories.deleteServiceCategory': {
		input: WhautomateEndpointInputSchemas.deleteServiceCategory,
		output: WhautomateEndpointOutputSchemas.deleteServiceCategory,
	},
	'account.getAccountInfo': {
		input: WhautomateEndpointInputSchemas.getAccountInfo,
		output: WhautomateEndpointOutputSchemas.getAccountInfo,
	},
	'webhooks.getAllWebhooks': {
		input: WhautomateEndpointInputSchemas.getAllWebhooks,
		output: WhautomateEndpointOutputSchemas.getAllWebhooks,
	},
	'broadcasts.getBroadcasts': {
		input: WhautomateEndpointInputSchemas.getBroadcasts,
		output: WhautomateEndpointOutputSchemas.getBroadcasts,
	},
	'broadcasts.getBroadcastById': {
		input: WhautomateEndpointInputSchemas.getBroadcastById,
		output: WhautomateEndpointOutputSchemas.getBroadcastById,
	},
	'services.getServices': {
		input: WhautomateEndpointInputSchemas.getServices,
		output: WhautomateEndpointOutputSchemas.getServices,
	},
	'services.getServiceById': {
		input: WhautomateEndpointInputSchemas.getServiceById,
		output: WhautomateEndpointOutputSchemas.getServiceById,
	},
	'services.updateService': {
		input: WhautomateEndpointInputSchemas.updateService,
		output: WhautomateEndpointOutputSchemas.updateService,
	},
	'staff.getStaffs': {
		input: WhautomateEndpointInputSchemas.getStaffs,
		output: WhautomateEndpointOutputSchemas.getStaffs,
	},
	'staff.getStaffById': {
		input: WhautomateEndpointInputSchemas.getStaffById,
		output: WhautomateEndpointOutputSchemas.getStaffById,
	},
	'staff.getStaffAvailabilityBlocks': {
		input: WhautomateEndpointInputSchemas.getStaffAvailabilityBlocks,
		output: WhautomateEndpointOutputSchemas.getStaffAvailabilityBlocks,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof whautomateEndpointsNested
>;

const whautomateWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof whautomateWebhooksNested
	>;

const whautomateWebhooksNested = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const whautomateEndpointMeta = {
	'contacts.addContact': {
		riskLevel: 'write' as const,
		description: 'Create a new contact',
	},
	'contacts.getContacts': {
		riskLevel: 'read' as const,
		description: 'List contacts with pagination and filters',
	},
	'contacts.getMessagesOfContact': {
		riskLevel: 'read' as const,
		description:
			'Get chat messages for a contact with pagination and date filters',
	},
	'segments.getSegments': {
		riskLevel: 'read' as const,
		description: 'List segments with name filter and pagination',
	},
	'segments.deleteSegment': {
		riskLevel: 'destructive' as const,
		description: 'Delete a segment by ID',
	},
	'serviceCategories.getServiceCategories': {
		riskLevel: 'read' as const,
		description: 'List service categories with pagination',
	},
	'serviceCategories.deleteServiceCategory': {
		riskLevel: 'destructive' as const,
		description: 'Delete a service category by ID',
	},
	'account.getAccountInfo': {
		riskLevel: 'read' as const,
		description: 'Fetch account name and owner email',
	},
	'webhooks.getAllWebhooks': {
		riskLevel: 'read' as const,
		description: 'Retrieve registered webhooks',
	},
	'broadcasts.getBroadcasts': {
		riskLevel: 'read' as const,
		description: 'List broadcasts with status and date filters',
	},
	'broadcasts.getBroadcastById': {
		riskLevel: 'read' as const,
		description: 'Fetch a single broadcast by ID',
	},
	'services.getServices': {
		riskLevel: 'read' as const,
		description: 'List services with filters',
	},
	'services.getServiceById': {
		riskLevel: 'read' as const,
		description: 'Fetch a single service by ID',
	},
	'services.updateService': {
		riskLevel: 'write' as const,
		description: 'Update service name, pricing, duration, and active status',
	},
	'staff.getStaffs': {
		riskLevel: 'read' as const,
		description: 'List staff members with pagination and search',
	},
	'staff.getStaffById': {
		riskLevel: 'read' as const,
		description: 'Fetch a single staff member by ID',
	},
	'staff.getStaffAvailabilityBlocks': {
		riskLevel: 'read' as const,
		description: 'Get staff availability blocks by date range',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof whautomateEndpointsNested
>;

export const whautomateAuthConfig = {
	api_key: {
		account: ['api_host', 'api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWhautomatePlugin<T extends WhautomatePluginOptions> =
	CorsairPlugin<
		'whautomate',
		typeof WhautomateSchema,
		typeof whautomateEndpointsNested,
		typeof whautomateWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalWhautomatePlugin =
	BaseWhautomatePlugin<WhautomatePluginOptions>;

export type ExternalWhautomatePlugin<T extends WhautomatePluginOptions> =
	BaseWhautomatePlugin<T>;

export function whautomate<const T extends WhautomatePluginOptions>(
	incomingOptions: WhautomatePluginOptions & T = {} as WhautomatePluginOptions &
		T,
): ExternalWhautomatePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'whautomate',
		authConfig: whautomateAuthConfig,
		schema: WhautomateSchema,
		options: options,
		hooks: options.hooks,
		endpoints: whautomateEndpointsNested,
		webhooks: whautomateWebhooksNested,
		endpointMeta: whautomateEndpointMeta,
		endpointSchemas: whautomateEndpointSchemas,
		webhookSchemas: whautomateWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WhautomateKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWhautomatePlugin;
}

export type {
	AddContactInput,
	AddContactResponse,
	DeleteSegmentInput,
	DeleteSegmentResponse,
	DeleteServiceCategoryInput,
	DeleteServiceCategoryResponse,
	GetAccountInfoInput,
	GetAccountInfoResponse,
	GetAllWebhooksInput,
	GetAllWebhooksResponse,
	GetBroadcastByIdInput,
	GetBroadcastByIdResponse,
	GetBroadcastsInput,
	GetBroadcastsResponse,
	GetContactsInput,
	GetContactsResponse,
	GetMessagesOfContactInput,
	GetMessagesOfContactResponse,
	GetSegmentsInput,
	GetSegmentsResponse,
	GetServiceByIdInput,
	GetServiceByIdResponse,
	GetServiceCategoriesInput,
	GetServiceCategoriesResponse,
	GetServicesInput,
	GetServicesResponse,
	GetStaffAvailabilityBlocksInput,
	GetStaffAvailabilityBlocksResponse,
	GetStaffByIdInput,
	GetStaffByIdResponse,
	GetStaffsInput,
	GetStaffsResponse,
	UpdateServiceInput,
	UpdateServiceResponse,
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './endpoints/types';
