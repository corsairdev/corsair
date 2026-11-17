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
import {
	Customers,
	Lists,
	Products,
	Purchases,
	Subscriptions,
	Tags,
} from './endpoints';
import type {
	SimpleroEndpointInputs,
	SimpleroEndpointOutputs,
} from './endpoints/types';
import {
	SimpleroEndpointInputSchemas,
	SimpleroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SimpleroSchema } from './schema';

export type SimpleroPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSimpleroPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simpleroEndpointsNested>;
};

export type SimpleroContext = CorsairPluginContext<
	typeof SimpleroSchema,
	SimpleroPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SimpleroEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SimpleroKeyBuilderContext =
	KeyBuilderContext<SimpleroPluginOptions>;

export type SimpleroBoundEndpoints = BindEndpoints<
	typeof simpleroEndpointsNested
>;

type SimpleroEndpoint<K extends keyof SimpleroEndpointOutputs> =
	CorsairEndpoint<
		SimpleroContext,
		SimpleroEndpointInputs[K],
		SimpleroEndpointOutputs[K]
	>;

export type SimpleroEndpoints = {
	customersList: SimpleroEndpoint<'customersList'>;
	customersGet: SimpleroEndpoint<'customersGet'>;
	customersCreate: SimpleroEndpoint<'customersCreate'>;
	customersUpdate: SimpleroEndpoint<'customersUpdate'>;
	customersAddTag: SimpleroEndpoint<'customersAddTag'>;
	customersRemoveTag: SimpleroEndpoint<'customersRemoveTag'>;
	customersAdjustLeadScore: SimpleroEndpoint<'customersAdjustLeadScore'>;
	listsList: SimpleroEndpoint<'listsList'>;
	listsGet: SimpleroEndpoint<'listsGet'>;
	listsCreate: SimpleroEndpoint<'listsCreate'>;
	listsUpdate: SimpleroEndpoint<'listsUpdate'>;
	tagsList: SimpleroEndpoint<'tagsList'>;
	tagsGet: SimpleroEndpoint<'tagsGet'>;
	tagsCreate: SimpleroEndpoint<'tagsCreate'>;
	tagsUpdate: SimpleroEndpoint<'tagsUpdate'>;
	productsList: SimpleroEndpoint<'productsList'>;
	productsGet: SimpleroEndpoint<'productsGet'>;
	productsCreate: SimpleroEndpoint<'productsCreate'>;
	productsUpdate: SimpleroEndpoint<'productsUpdate'>;
	purchasesList: SimpleroEndpoint<'purchasesList'>;
	purchasesGet: SimpleroEndpoint<'purchasesGet'>;
	purchasesUpdate: SimpleroEndpoint<'purchasesUpdate'>;
	subscriptionsList: SimpleroEndpoint<'subscriptionsList'>;
	subscriptionsGet: SimpleroEndpoint<'subscriptionsGet'>;
	subscriptionsUpdate: SimpleroEndpoint<'subscriptionsUpdate'>;
	subscriptionsUnsubscribe: SimpleroEndpoint<'subscriptionsUnsubscribe'>;
	subscriptionsResubscribe: SimpleroEndpoint<'subscriptionsResubscribe'>;
};

const simpleroEndpointsNested = {
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		addTag: Customers.addTag,
		removeTag: Customers.removeTag,
		adjustLeadScore: Customers.adjustLeadScore,
	},
	lists: {
		list: Lists.list,
		get: Lists.get,
		create: Lists.create,
		update: Lists.update,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		create: Tags.create,
		update: Tags.update,
	},
	products: {
		list: Products.list,
		get: Products.get,
		create: Products.create,
		update: Products.update,
	},
	purchases: {
		list: Purchases.list,
		get: Purchases.get,
		update: Purchases.update,
	},
	subscriptions: {
		list: Subscriptions.list,
		get: Subscriptions.get,
		update: Subscriptions.update,
		unsubscribe: Subscriptions.unsubscribe,
		resubscribe: Subscriptions.resubscribe,
	},
} as const;

export const simpleroEndpointSchemas = {
	'customers.list': {
		input: SimpleroEndpointInputSchemas.customersList,
		output: SimpleroEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: SimpleroEndpointInputSchemas.customersGet,
		output: SimpleroEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: SimpleroEndpointInputSchemas.customersCreate,
		output: SimpleroEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: SimpleroEndpointInputSchemas.customersUpdate,
		output: SimpleroEndpointOutputSchemas.customersUpdate,
	},
	'customers.addTag': {
		input: SimpleroEndpointInputSchemas.customersAddTag,
		output: SimpleroEndpointOutputSchemas.customersAddTag,
	},
	'customers.removeTag': {
		input: SimpleroEndpointInputSchemas.customersRemoveTag,
		output: SimpleroEndpointOutputSchemas.customersRemoveTag,
	},
	'customers.adjustLeadScore': {
		input: SimpleroEndpointInputSchemas.customersAdjustLeadScore,
		output: SimpleroEndpointOutputSchemas.customersAdjustLeadScore,
	},
	'lists.list': {
		input: SimpleroEndpointInputSchemas.listsList,
		output: SimpleroEndpointOutputSchemas.listsList,
	},
	'lists.get': {
		input: SimpleroEndpointInputSchemas.listsGet,
		output: SimpleroEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: SimpleroEndpointInputSchemas.listsCreate,
		output: SimpleroEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: SimpleroEndpointInputSchemas.listsUpdate,
		output: SimpleroEndpointOutputSchemas.listsUpdate,
	},
	'tags.list': {
		input: SimpleroEndpointInputSchemas.tagsList,
		output: SimpleroEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: SimpleroEndpointInputSchemas.tagsGet,
		output: SimpleroEndpointOutputSchemas.tagsGet,
	},
	'tags.create': {
		input: SimpleroEndpointInputSchemas.tagsCreate,
		output: SimpleroEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: SimpleroEndpointInputSchemas.tagsUpdate,
		output: SimpleroEndpointOutputSchemas.tagsUpdate,
	},
	'products.list': {
		input: SimpleroEndpointInputSchemas.productsList,
		output: SimpleroEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: SimpleroEndpointInputSchemas.productsGet,
		output: SimpleroEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: SimpleroEndpointInputSchemas.productsCreate,
		output: SimpleroEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: SimpleroEndpointInputSchemas.productsUpdate,
		output: SimpleroEndpointOutputSchemas.productsUpdate,
	},
	'purchases.list': {
		input: SimpleroEndpointInputSchemas.purchasesList,
		output: SimpleroEndpointOutputSchemas.purchasesList,
	},
	'purchases.get': {
		input: SimpleroEndpointInputSchemas.purchasesGet,
		output: SimpleroEndpointOutputSchemas.purchasesGet,
	},
	'purchases.update': {
		input: SimpleroEndpointInputSchemas.purchasesUpdate,
		output: SimpleroEndpointOutputSchemas.purchasesUpdate,
	},
	'subscriptions.list': {
		input: SimpleroEndpointInputSchemas.subscriptionsList,
		output: SimpleroEndpointOutputSchemas.subscriptionsList,
	},
	'subscriptions.get': {
		input: SimpleroEndpointInputSchemas.subscriptionsGet,
		output: SimpleroEndpointOutputSchemas.subscriptionsGet,
	},
	'subscriptions.update': {
		input: SimpleroEndpointInputSchemas.subscriptionsUpdate,
		output: SimpleroEndpointOutputSchemas.subscriptionsUpdate,
	},
	'subscriptions.unsubscribe': {
		input: SimpleroEndpointInputSchemas.subscriptionsUnsubscribe,
		output: SimpleroEndpointOutputSchemas.subscriptionsUnsubscribe,
	},
	'subscriptions.resubscribe': {
		input: SimpleroEndpointInputSchemas.subscriptionsResubscribe,
		output: SimpleroEndpointOutputSchemas.subscriptionsResubscribe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof simpleroEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const simpleroEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description:
			'List contacts with filters for name, email, tag, segment, list, product and stage; page by number or continue with `after`',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Read one contact: their name, email, phone, locale, consent flags, lead score and lifetime value',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a contact. Email and lead score are the required pair; a score sent here replaces rather than adds',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Change part of a contact. Only the fields sent change, so an omitted field keeps its stored value',
	},
	'customers.addTag': {
		riskLevel: 'write',
		description:
			'Add one tag or a list of tags to a contact, which can start the automations that tag is attached to',
	},
	'customers.removeTag': {
		riskLevel: 'write',
		description:
			'Remove one tag or a list of tags from a contact, which can stop the automations that tag is attached to',
	},
	'customers.adjustLeadScore': {
		riskLevel: 'write',
		description:
			"Add to a contact's lead score and record the change in their history; customers.update replaces the score instead",
	},
	'lists.list': {
		riskLevel: 'read',
		description:
			'List the email lists on the account with their names and handles',
	},
	'lists.get': {
		riskLevel: 'read',
		description:
			'Read one list with its sender, confirmation settings and labels',
	},
	'lists.create': {
		riskLevel: 'write',
		description:
			'Create an email list. Name and internal name are both required by Simplero',
	},
	'lists.update': {
		riskLevel: 'write',
		description:
			'Change part of a list, such as its name, sender or whether signups need confirmation',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'List the tags on the account, optionally only those one owner created',
	},
	'tags.get': {
		riskLevel: 'read',
		description:
			'Read one tag with its colour, owner and how many contacts carry it',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag, which contacts can then be tagged with',
	},
	'tags.update': {
		riskLevel: 'write',
		description:
			'Change part of a tag, such as its name, description or colour',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'List the products on the account, filtered by name, listing type or whether they recur',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Read one product with its descriptions, listing type and product type',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a product. Name and internal name are both required by Simplero',
	},
	'products.update': {
		riskLevel: 'write',
		description:
			'Change part of a product, such as its name, summary or listing type',
	},
	'purchases.list': {
		riskLevel: 'read',
		description:
			'List purchases with filters for state, customer, product, price and the purchase, cancel and refund dates',
	},
	'purchases.get': {
		riskLevel: 'read',
		description:
			'Read one purchase with its state, amounts, buyer details and dates',
	},
	'purchases.update': {
		riskLevel: 'write',
		description:
			"Change a purchase's buyer details and marketing preferences. Money movements (refund, cancel, capture, change price) are separate actions and are not wrapped",
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List list subscriptions with filters for state, list, tag, email and the unsubscribe date',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description:
			'Read one subscription with whether it is active and confirmed, and when it was unsubscribed or suspended',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description:
			"Change a subscription's tracking data. Whether a contact is subscribed changes through unsubscribe or resubscribe, not this body",
	},
	'subscriptions.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe a contact from a list; they stop receiving its mailings. Resubscribe puts them back',
	},
	'subscriptions.resubscribe': {
		riskLevel: 'write',
		description:
			'Put an unsubscribed contact back on a list, so they receive its mailings again',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof simpleroEndpointsNested>;

export type BaseSimpleroPlugin<T extends SimpleroPluginOptions> = CorsairPlugin<
	'simplero',
	typeof SimpleroSchema,
	typeof simpleroEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSimpleroPlugin = BaseSimpleroPlugin<SimpleroPluginOptions>;

export type ExternalSimpleroPlugin<T extends SimpleroPluginOptions> =
	BaseSimpleroPlugin<T>;

export function simplero<const T extends SimpleroPluginOptions>(
	incomingOptions: SimpleroPluginOptions & T = {} as SimpleroPluginOptions & T,
): ExternalSimpleroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simplero',
		schema: SimpleroSchema,
		options: options,
		hooks: options.hooks,
		endpoints: simpleroEndpointsNested,
		webhooks: {},
		endpointMeta: simpleroEndpointMeta,
		endpointSchemas: simpleroEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SimpleroKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('simplero', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSimpleroPlugin;
}

export { SimpleroAPIError } from './client';

export type {
	CustomerCreateInput,
	CustomerTagActionInput,
	CustomerUpdateInput,
	ListCreateInput,
	ProductCreateInput,
	SimpleroActionResult,
	SimpleroCustomer,
	SimpleroEndpointInputs,
	SimpleroEndpointOutputs,
	SimpleroList,
	SimpleroPagination,
	SimpleroProduct,
	SimpleroPurchase,
	SimpleroSubscription,
	SimpleroTag,
	SubscriptionUpdateInput,
} from './endpoints/types';
