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
import { Campaigns, Stores } from './endpoints';
import type {
	RemarketyEndpointInputs,
	RemarketyEndpointOutputs,
} from './endpoints/types';
import {
	RemarketyEndpointInputSchemas,
	RemarketyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RemarketySchema } from './schema';

export type RemarketyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRemarketyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof remarketyEndpointsNested>;
};

export type RemarketyContext = CorsairPluginContext<
	typeof RemarketySchema,
	RemarketyPluginOptions
>;

export type RemarketyKeyBuilderContext =
	KeyBuilderContext<RemarketyPluginOptions>;

export type RemarketyBoundEndpoints = BindEndpoints<
	typeof remarketyEndpointsNested
>;

type RemarketyEndpoint<K extends keyof RemarketyEndpointOutputs> =
	CorsairEndpoint<
		RemarketyContext,
		RemarketyEndpointInputs[K],
		RemarketyEndpointOutputs[K]
	>;

export type RemarketyEndpoints = {
	storesCreate: RemarketyEndpoint<'storesCreate'>;
	storesUpdate: RemarketyEndpoint<'storesUpdate'>;
	storesGet: RemarketyEndpoint<'storesGet'>;
	storesDelete: RemarketyEndpoint<'storesDelete'>;
	storeStatus: RemarketyEndpoint<'storeStatus'>;
	contactsCreate: RemarketyEndpoint<'contactsCreate'>;
	contactsUnsubscribe: RemarketyEndpoint<'contactsUnsubscribe'>;
	campaignsCreate: RemarketyEndpoint<'campaignsCreate'>;
	campaignsUpdate: RemarketyEndpoint<'campaignsUpdate'>;
	campaignsGet: RemarketyEndpoint<'campaignsGet'>;
	campaignsDelete: RemarketyEndpoint<'campaignsDelete'>;
	campaignsTypes: RemarketyEndpoint<'campaignsTypes'>;
	emailTemplateGet: RemarketyEndpoint<'emailTemplateGet'>;
	emailTemplateUpdate: RemarketyEndpoint<'emailTemplateUpdate'>;
	masterTemplatesList: RemarketyEndpoint<'masterTemplatesList'>;
	productsList: RemarketyEndpoint<'productsList'>;
	rulesList: RemarketyEndpoint<'rulesList'>;
	rulesGet: RemarketyEndpoint<'rulesGet'>;
	segmentsCount: RemarketyEndpoint<'segmentsCount'>;
	segmentsList: RemarketyEndpoint<'segmentsList'>;
};

const remarketyEndpointsNested = {
	stores: {
		create: Stores.create,
		update: Stores.update,
		get: Stores.get,
		delete: Stores.remove,
		status: Stores.status,
	},
	contacts: {
		create: Stores.createContact,
		unsubscribe: Stores.unsubscribe,
	},
	campaigns: {
		create: Campaigns.create,
		update: Campaigns.update,
		get: Campaigns.get,
		delete: Campaigns.remove,
		types: Campaigns.types,
	},
	emailTemplates: {
		get: Campaigns.template,
		update: Campaigns.updateTemplate,
	},
	masterTemplates: {
		list: Campaigns.masterTemplates,
	},
	products: {
		list: Campaigns.products,
	},
	rules: {
		list: Campaigns.rules,
		get: Campaigns.rule,
	},
	segments: {
		count: Campaigns.segmentCount,
		list: Campaigns.segmentList,
	},
} as const;

export const remarketyEndpointSchemas = {
	'stores.create': {
		input: RemarketyEndpointInputSchemas.storesCreate,
		output: RemarketyEndpointOutputSchemas.storesCreate,
	},
	'stores.update': {
		input: RemarketyEndpointInputSchemas.storesUpdate,
		output: RemarketyEndpointOutputSchemas.storesUpdate,
	},
	'stores.get': {
		input: RemarketyEndpointInputSchemas.storesGet,
		output: RemarketyEndpointOutputSchemas.storesGet,
	},
	'stores.delete': {
		input: RemarketyEndpointInputSchemas.storesDelete,
		output: RemarketyEndpointOutputSchemas.storesDelete,
	},
	'stores.status': {
		input: RemarketyEndpointInputSchemas.storeStatus,
		output: RemarketyEndpointOutputSchemas.storeStatus,
	},
	'contacts.create': {
		input: RemarketyEndpointInputSchemas.contactsCreate,
		output: RemarketyEndpointOutputSchemas.contactsCreate,
	},
	'contacts.unsubscribe': {
		input: RemarketyEndpointInputSchemas.contactsUnsubscribe,
		output: RemarketyEndpointOutputSchemas.contactsUnsubscribe,
	},
	'campaigns.create': {
		input: RemarketyEndpointInputSchemas.campaignsCreate,
		output: RemarketyEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: RemarketyEndpointInputSchemas.campaignsUpdate,
		output: RemarketyEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.get': {
		input: RemarketyEndpointInputSchemas.campaignsGet,
		output: RemarketyEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.delete': {
		input: RemarketyEndpointInputSchemas.campaignsDelete,
		output: RemarketyEndpointOutputSchemas.campaignsDelete,
	},
	'campaigns.types': {
		input: RemarketyEndpointInputSchemas.campaignsTypes,
		output: RemarketyEndpointOutputSchemas.campaignsTypes,
	},
	'emailTemplates.get': {
		input: RemarketyEndpointInputSchemas.emailTemplateGet,
		output: RemarketyEndpointOutputSchemas.emailTemplateGet,
	},
	'emailTemplates.update': {
		input: RemarketyEndpointInputSchemas.emailTemplateUpdate,
		output: RemarketyEndpointOutputSchemas.emailTemplateUpdate,
	},
	'masterTemplates.list': {
		input: RemarketyEndpointInputSchemas.masterTemplatesList,
		output: RemarketyEndpointOutputSchemas.masterTemplatesList,
	},
	'products.list': {
		input: RemarketyEndpointInputSchemas.productsList,
		output: RemarketyEndpointOutputSchemas.productsList,
	},
	'rules.list': {
		input: RemarketyEndpointInputSchemas.rulesList,
		output: RemarketyEndpointOutputSchemas.rulesList,
	},
	'rules.get': {
		input: RemarketyEndpointInputSchemas.rulesGet,
		output: RemarketyEndpointOutputSchemas.rulesGet,
	},
	'segments.count': {
		input: RemarketyEndpointInputSchemas.segmentsCount,
		output: RemarketyEndpointOutputSchemas.segmentsCount,
	},
	'segments.list': {
		input: RemarketyEndpointInputSchemas.segmentsList,
		output: RemarketyEndpointOutputSchemas.segmentsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof remarketyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const remarketyEndpointMeta = {
	'stores.create': {
		riskLevel: 'write',
		description: 'Create a store with the API key Remarkety will sync it with',
	},
	'stores.update': {
		riskLevel: 'write',
		description:
			'Update a store; the id goes in the body because the route is PUT /stores',
	},
	'stores.get': {
		riskLevel: 'read',
		description: 'Read one store by id',
	},
	'stores.delete': {
		riskLevel: 'destructive',
		description: 'Delete a store',
	},
	'stores.status': {
		riskLevel: 'read',
		description:
			'Read the store sync status, including the last error and the last successful sync',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact in a store, optionally with double opt-in and marketing permission',
	},
	'contacts.unsubscribe': {
		riskLevel: 'write',
		description: 'Unsubscribe one email address from a store',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign from a type and its actions, each an email or an api webhook with the rules that decide when it runs',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			'Update a campaign, including its mode, which can start or stop real sending',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Read one campaign by id',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign',
	},
	'campaigns.types': {
		riskLevel: 'read',
		description: 'Read the campaign types the store supports and their options',
	},
	'emailTemplates.get': {
		riskLevel: 'read',
		description: "Read one campaign rule's email template",
	},
	'emailTemplates.update': {
		riskLevel: 'write',
		description: "Replace one campaign rule's email template",
	},
	'masterTemplates.list': {
		riskLevel: 'read',
		description: 'List the master email templates available to a store',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			"Search a store's synced products by name or SKU, with paging and an update-time filter",
	},
	'rules.list': {
		riskLevel: 'read',
		description:
			'Read every rule a campaign action can use, with its operators and possible values',
	},
	'rules.get': {
		riskLevel: 'read',
		description: "Read one rule type's operators and possible values",
	},
	'segments.count': {
		riskLevel: 'read',
		description: 'Count the shoppers matching a segment',
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'List the emails and names matching a segment, with paging',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof remarketyEndpointsNested
>;

export type BaseRemarketyPlugin<T extends RemarketyPluginOptions> =
	CorsairPlugin<
		'remarkety',
		typeof RemarketySchema,
		typeof remarketyEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRemarketyPlugin =
	BaseRemarketyPlugin<RemarketyPluginOptions>;

export type ExternalRemarketyPlugin<T extends RemarketyPluginOptions> =
	BaseRemarketyPlugin<T>;

export function remarkety<const T extends RemarketyPluginOptions>(
	incomingOptions: RemarketyPluginOptions & T = {} as RemarketyPluginOptions &
		T,
): ExternalRemarketyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'remarkety',
		schema: RemarketySchema,
		options: options,
		hooks: options.hooks,
		endpoints: remarketyEndpointsNested,
		webhooks: {},
		endpointMeta: remarketyEndpointMeta,
		endpointSchemas: remarketyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RemarketyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('remarkety', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRemarketyPlugin;
}

export { RemarketyAPIError } from './client';

export type {
	CampaignsCreateInput,
	CampaignsCreateResponse,
	CampaignsDeleteInput,
	CampaignsDeleteResponse,
	CampaignsGetInput,
	CampaignsGetResponse,
	CampaignsTypesInput,
	CampaignsTypesResponse,
	CampaignsUpdateInput,
	CampaignsUpdateResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsUnsubscribeInput,
	ContactsUnsubscribeResponse,
	EmailTemplateGetInput,
	EmailTemplateGetResponse,
	EmailTemplateUpdateInput,
	EmailTemplateUpdateResponse,
	MasterTemplatesListInput,
	MasterTemplatesListResponse,
	ProductsListInput,
	ProductsListResponse,
	RemarketyCampaign,
	RemarketyCampaignActionInput,
	RemarketyEmailTemplate,
	RemarketyEndpointInputs,
	RemarketyEndpointOutputs,
	RemarketyMoney,
	RemarketyStore,
	RulesGetInput,
	RulesGetResponse,
	RulesListInput,
	RulesListResponse,
	SegmentsCountInput,
	SegmentsCountResponse,
	SegmentsListInput,
	SegmentsListResponse,
	StoreStatusInput,
	StoreStatusResponse,
	StoresCreateInput,
	StoresCreateResponse,
	StoresDeleteInput,
	StoresDeleteResponse,
	StoresGetInput,
	StoresGetResponse,
	StoresUpdateInput,
	StoresUpdateResponse,
} from './endpoints/types';
