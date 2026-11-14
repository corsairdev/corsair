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
import { AuthMissingError } from 'corsair/core';
import { Businesses, Customers } from './endpoints';
import type {
	GatherupEndpointInputs,
	GatherupEndpointOutputs,
} from './endpoints/types';
import {
	GatherupEndpointInputSchemas,
	GatherupEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GatherupSchema } from './schema';

export type GatherupPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The client ID, which every call carries as the `clientId` parameter. */
	key?: string;
	/** The bearer token, which is the account's `api_secret` field. */
	apiKey?: string;
	/** The client ID, when it is set as an option rather than stored. */
	clientId?: string;
	/**
	 * The agent ID. Only needed when the token belongs to an owner acting on
	 * behalf of a client.
	 */
	agent?: string;
	hooks?: InternalGatherupPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gatherupEndpointsNested>;
};

/**
 * GatherUp needs a bearer token **and** a client ID on every call. The client ID
 * is the key, because it names which account the call is about, and the token
 * is an account-level field beside it. `get_integration_credentials` is only
 * installed for `oauth_2`, so the pair lives on the account.
 */
export const gatherupAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type GatherupContext = CorsairPluginContext<
	typeof GatherupSchema,
	GatherupPluginOptions,
	undefined,
	typeof gatherupAuthConfig
>;

export type GatherupKeyBuilderContext = KeyBuilderContext<
	GatherupPluginOptions,
	typeof gatherupAuthConfig
>;

export type GatherupBoundEndpoints = BindEndpoints<
	typeof gatherupEndpointsNested
>;

type GatherupEndpoint<K extends keyof GatherupEndpointOutputs> =
	CorsairEndpoint<
		GatherupContext,
		GatherupEndpointInputs[K],
		GatherupEndpointOutputs[K]
	>;

export type GatherupEndpoints = {
	businessesList: GatherupEndpoint<'businessesList'>;
	businessesGet: GatherupEndpoint<'businessesGet'>;
	businessesSearch: GatherupEndpoint<'businessesSearch'>;
	businessesTypes: GatherupEndpoint<'businessesTypes'>;
	businessesCreate: GatherupEndpoint<'businessesCreate'>;
	businessesUpdate: GatherupEndpoint<'businessesUpdate'>;
	businessesDeactivate: GatherupEndpoint<'businessesDeactivate'>;
	businessesReactivate: GatherupEndpoint<'businessesReactivate'>;
	businessesRemove: GatherupEndpoint<'businessesRemove'>;
	customersList: GatherupEndpoint<'customersList'>;
	customersGet: GatherupEndpoint<'customersGet'>;
	customersCreate: GatherupEndpoint<'customersCreate'>;
	customersUpdate: GatherupEndpoint<'customersUpdate'>;
	customersRemove: GatherupEndpoint<'customersRemove'>;
	feedbackRequest: GatherupEndpoint<'feedbackRequest'>;
	feedbacksList: GatherupEndpoint<'feedbacksList'>;
};

const gatherupEndpointsNested = {
	businesses: {
		list: Businesses.list,
		get: Businesses.get,
		search: Businesses.search,
		types: Businesses.types,
		create: Businesses.create,
		update: Businesses.update,
		deactivate: Businesses.deactivate,
		reactivate: Businesses.reactivate,
		delete: Businesses.remove,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		delete: Customers.remove,
		requestFeedback: Customers.requestFeedback,
	},
	feedbacks: {
		list: Customers.feedbacks,
	},
} as const;

export const gatherupEndpointSchemas = {
	'businesses.list': {
		input: GatherupEndpointInputSchemas.businessesList,
		output: GatherupEndpointOutputSchemas.businessesList,
	},
	'businesses.get': {
		input: GatherupEndpointInputSchemas.businessesGet,
		output: GatherupEndpointOutputSchemas.businessesGet,
	},
	'businesses.search': {
		input: GatherupEndpointInputSchemas.businessesSearch,
		output: GatherupEndpointOutputSchemas.businessesSearch,
	},
	'businesses.types': {
		input: GatherupEndpointInputSchemas.businessesTypes,
		output: GatherupEndpointOutputSchemas.businessesTypes,
	},
	'businesses.create': {
		input: GatherupEndpointInputSchemas.businessesCreate,
		output: GatherupEndpointOutputSchemas.businessesCreate,
	},
	'businesses.update': {
		input: GatherupEndpointInputSchemas.businessesUpdate,
		output: GatherupEndpointOutputSchemas.businessesUpdate,
	},
	'businesses.deactivate': {
		input: GatherupEndpointInputSchemas.businessesDeactivate,
		output: GatherupEndpointOutputSchemas.businessesDeactivate,
	},
	'businesses.reactivate': {
		input: GatherupEndpointInputSchemas.businessesReactivate,
		output: GatherupEndpointOutputSchemas.businessesReactivate,
	},
	'businesses.delete': {
		input: GatherupEndpointInputSchemas.businessesRemove,
		output: GatherupEndpointOutputSchemas.businessesRemove,
	},
	'customers.list': {
		input: GatherupEndpointInputSchemas.customersList,
		output: GatherupEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: GatherupEndpointInputSchemas.customersGet,
		output: GatherupEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: GatherupEndpointInputSchemas.customersCreate,
		output: GatherupEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: GatherupEndpointInputSchemas.customersUpdate,
		output: GatherupEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: GatherupEndpointInputSchemas.customersRemove,
		output: GatherupEndpointOutputSchemas.customersRemove,
	},
	'customers.requestFeedback': {
		input: GatherupEndpointInputSchemas.feedbackRequest,
		output: GatherupEndpointOutputSchemas.feedbackRequest,
	},
	'feedbacks.list': {
		input: GatherupEndpointInputSchemas.feedbacksList,
		output: GatherupEndpointOutputSchemas.feedbacksList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gatherupEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const gatherupEndpointMeta = {
	'businesses.list': {
		riskLevel: 'read',
		description:
			'Businesses on the account, paged; `next_page` gives the next page',
	},
	'businesses.get': {
		riskLevel: 'read',
		description:
			'One business with its address, short feedback URL, package and ratings received',
	},
	'businesses.search': {
		riskLevel: 'read',
		description:
			'Find a business ID by its `customField` or `extraField` value',
	},
	'businesses.types': {
		riskLevel: 'read',
		description: 'The Google business types a business can be created with',
	},
	'businesses.create': {
		riskLevel: 'write',
		description:
			'Create a business. The body uses `businessName` and `businessType`, not the `name` and `organisationType` a read returns',
	},
	'businesses.update': {
		riskLevel: 'write',
		description:
			'Update a business, including its name, type, address and thresholds',
	},
	'businesses.deactivate': {
		riskLevel: 'write',
		description:
			'Suspend a business so no feedback requests go out. Nothing is deleted, and `businesses.reactivate` reverses it',
	},
	'businesses.reactivate': {
		riskLevel: 'write',
		description: 'Bring a deactivated business back into service',
	},
	'businesses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a business with its customers and feedback; it cannot be restored',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'Customers of a business, paged, with their rating, review and request status',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'One customer with their status, rating and review',
	},
	'customers.create': {
		riskLevel: 'destructive',
		description:
			'Add a customer to a business. The body uses `customerFirstName` and `customerEmail`; an email or a phone is needed. Destructive because it can message the customer: a feedback request goes out when `sendFeedbackRequest` is true, and a business in automatic mode sends one on its own schedule',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update a customer. This route spells the phone `customerPhoneNumber`, where create spells it `customerPhone`',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a customer and their feedback record',
	},
	'customers.requestFeedback': {
		riskLevel: 'destructive',
		description:
			'Send a feedback request to a customer, which is a message to a real person',
	},
	'feedbacks.list': {
		riskLevel: 'read',
		description:
			'Feedback a business received, with its rating, NPS answer and text, paged',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gatherupEndpointsNested>;

export type BaseGatherupPlugin<T extends GatherupPluginOptions> = CorsairPlugin<
	'gatherup',
	typeof GatherupSchema,
	typeof gatherupEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof gatherupAuthConfig
>;

export type InternalGatherupPlugin = BaseGatherupPlugin<GatherupPluginOptions>;

export type ExternalGatherupPlugin<T extends GatherupPluginOptions> =
	BaseGatherupPlugin<T>;

export function gatherup<const T extends GatherupPluginOptions>(
	incomingOptions: GatherupPluginOptions & T = {} as GatherupPluginOptions & T,
): ExternalGatherupPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gatherup',
		schema: GatherupSchema,
		options,
		hooks: options.hooks,
		endpoints: gatherupEndpointsNested,
		webhooks: {},
		authConfig: gatherupAuthConfig,
		endpointMeta: gatherupEndpointMeta,
		endpointSchemas: gatherupEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GatherupKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('gatherup', ctx.authType ?? 'api_key');
			}

			// The key is the client ID. The bearer token is checked here too, so an
			// account with only one of the pair gets the connect flow instead of a
			// call GatherUp refuses.
			const clientId =
				options.clientId ??
				options.key ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_key() : null);
			const token =
				options.apiKey ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_secret() : null);
			if (!clientId || !token) {
				throw new AuthMissingError('gatherup', ctx.authType ?? 'api_key');
			}
			return clientId;
		},
	} satisfies InternalGatherupPlugin;
}

export type { GatherupErrorInfo } from './client';
export { GatherupAPIError, gatherupErrorInfo } from './client';

export type {
	BusinessActiveInput,
	BusinessCreateInput,
	BusinessesListInput,
	BusinessesListResponse,
	BusinessGetInput,
	BusinessRemoveInput,
	BusinessResponse,
	BusinessSearchInput,
	BusinessSearchResponse,
	BusinessTypesInput,
	BusinessTypesResponse,
	BusinessUpdateInput,
	BusinessWriteResponse,
	CustomerCreateInput,
	CustomerCreateResponse,
	CustomerGetInput,
	CustomerRemoveInput,
	CustomerResponse,
	CustomersListInput,
	CustomersListResponse,
	CustomerUpdateInput,
	FeedbackRequestInput,
	FeedbacksListInput,
	FeedbacksListResponse,
	GatherupBusiness,
	GatherupBusinessListRow,
	GatherupBusinessType,
	GatherupCustomer,
	GatherupEndpointInputs,
	GatherupEndpointOutputs,
	GatherupFeedback,
	SuccessResponse,
} from './endpoints/types';
