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
import { AuthMissingError } from 'corsair/core';
import { packCloudcartKey } from './client';
import {
	Blogs,
	Cart,
	Categories,
	Customers,
	Discounts,
	Misc,
	Orders,
	Products,
	Properties,
	Subscribers,
	Variants,
	Webhooks,
} from './endpoints';
import type {
	CloudcartEndpointInputs,
	CloudcartEndpointOutputs,
} from './endpoints/types';
import {
	CloudcartEndpointInputSchemas,
	CloudcartEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudcartSchema } from './schema';
import { CloudcartWebhooks } from './webhooks';
import { matchCloudcartTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CloudcartWebhookOutputs,
	CustomerCreatedEvent,
	OrderCreatedEvent,
	ProductCreatedEvent,
} from './webhooks/types';
import {
	CustomerCreatedEventSchema,
	matchCloudcartWebhook,
	OrderCreatedEventSchema,
	ProductCreatedEventSchema,
} from './webhooks/types';

export type CloudcartPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	storeUrl?: string;
	webhookSecret?: string;
	hooks?: InternalCloudcartPlugin['hooks'];
	webhookHooks?: InternalCloudcartPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudcartEndpointsNested>;
};

export const cloudcartAuthConfig = {
	api_key: {
		account: ['store_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type CloudcartContext = CorsairPluginContext<
	typeof CloudcartSchema,
	CloudcartPluginOptions,
	undefined,
	typeof cloudcartAuthConfig
>;

export type CloudcartKeyBuilderContext = KeyBuilderContext<
	CloudcartPluginOptions,
	typeof cloudcartAuthConfig
>;

export type CloudcartBoundEndpoints = BindEndpoints<
	typeof cloudcartEndpointsNested
>;

type CloudcartEndpoint<K extends keyof CloudcartEndpointOutputs> =
	CorsairEndpoint<
		CloudcartContext,
		CloudcartEndpointInputs[K],
		CloudcartEndpointOutputs[K]
	>;

export type CloudcartEndpoints = {
	[K in keyof CloudcartEndpointInputs]: CloudcartEndpoint<K>;
};

type CloudcartWebhook<
	K extends keyof CloudcartWebhookOutputs,
	TEvent,
> = CorsairWebhook<CloudcartContext, TEvent, CloudcartWebhookOutputs[K]>;

export type CloudcartWebhooks = {
	orderCreated: CloudcartWebhook<'order.created', OrderCreatedEvent>;
	productCreated: CloudcartWebhook<'product.created', ProductCreatedEvent>;
	customerCreated: CloudcartWebhook<'customer.created', CustomerCreatedEvent>;
};

export type CloudcartBoundWebhooks = BindWebhooks<CloudcartWebhooks>;

const cloudcartEndpointsNested = {
	products: {
		createProduct: Products.createProduct,
		getProduct: Products.getProduct,
		getProductWithRelations: Products.getProductWithRelations,
		listProducts: Products.listProducts,
		updateProduct: Products.updateProduct,
		deleteProduct: Products.deleteProduct,
		createLinkedProducts: Products.createLinkedProducts,
		getProductsLinkedProduct: Products.getProductsLinkedProduct,
		getProductsLinkedProducts: Products.getProductsLinkedProducts,
		updateLinkedProduct: Products.updateLinkedProduct,
		deleteLinkedProducts: Products.deleteLinkedProducts,
		createImage: Products.createImage,
		getImage: Products.getImage,
		listImages: Products.listImages,
		deleteImage: Products.deleteImage,
	},
	categories: {
		createCategory: Categories.createCategory,
		getCategory: Categories.getCategory,
		listCategories: Categories.listCategories,
		updateCategory: Categories.updateCategory,
		deleteCategory: Categories.deleteCategory,
		getCategoryProperties: Categories.getCategoryProperties,
		addCategoryProperties: Categories.addCategoryProperties,
	},
	properties: {
		createProperty: Properties.createProperty,
		getProperty: Properties.getProperty,
		listProperties: Properties.listProperties,
		updateProperty: Properties.updateProperty,
		deleteProperty: Properties.deleteProperty,
		createPropertyOption: Properties.createPropertyOption,
		getPropertyOption: Properties.getPropertyOption,
		listPropertyOptions: Properties.listPropertyOptions,
		updatePropertyOption: Properties.updatePropertyOption,
		deletePropertyOption: Properties.deletePropertyOption,
		createProductsPropertyOptions: Properties.createProductsPropertyOptions,
		getPropertyOptionsRelationship: Properties.getPropertyOptionsRelationship,
	},
	variants: {
		createVariant: Variants.createVariant,
		getVariant: Variants.getVariant,
		listVariants: Variants.listVariants,
		updateVariant: Variants.updateVariant,
		deleteVariant: Variants.deleteVariant,
		createVariantOption: Variants.createVariantOption,
		createVariantOptions: Variants.createVariantOptions,
		getVariantOption: Variants.getVariantOption,
		listVariantOptions: Variants.listVariantOptions,
		updateVariantOption: Variants.updateVariantOption,
		deleteVariantOption: Variants.deleteVariantOption,
		createVariantParameter: Variants.createVariantParameter,
		createVariantParameterForVariant: Variants.createVariantParameterForVariant,
		getVariantParameter: Variants.getVariantParameter,
		listVariantParameters: Variants.listVariantParameters,
		updateVariantParameter: Variants.updateVariantParameter,
		deleteVariantParameter: Variants.deleteVariantParameter,
	},
	customers: {
		createCustomer: Customers.createCustomer,
		getCustomer: Customers.getCustomer,
		listCustomers: Customers.listCustomers,
		updateCustomer: Customers.updateCustomer,
		deleteCustomer: Customers.deleteCustomer,
		createCustomerGroup: Customers.createCustomerGroup,
		getCustomerGroup: Customers.getCustomerGroup,
		listCustomerGroups: Customers.listCustomerGroups,
		getCustomerGroupsCustomers: Customers.getCustomerGroupsCustomers,
		updateCustomerGroup: Customers.updateCustomerGroup,
		deleteCustomerGroup: Customers.deleteCustomerGroup,
		createCustomerBillingAddress: Customers.createCustomerBillingAddress,
		getCustomerBillingAddress: Customers.getCustomerBillingAddress,
		listCustomerBillingAddresses: Customers.listCustomerBillingAddresses,
		updateCustomerBillingAddress: Customers.updateCustomerBillingAddress,
		deleteCustomerBillingAddress: Customers.deleteCustomerBillingAddress,
		createCustomerShippingAddress: Customers.createCustomerShippingAddress,
		getCustomerShippingAddress: Customers.getCustomerShippingAddress,
		listCustomerShippingAddresses: Customers.listCustomerShippingAddresses,
		updateCustomerShippingAddress: Customers.updateCustomerShippingAddress,
		deleteCustomerShippingAddress: Customers.deleteCustomerShippingAddress,
		createCustomerTag: Customers.createCustomerTag,
		getCustomerTag: Customers.getCustomerTag,
		listCustomerTags: Customers.listCustomerTags,
		updateCustomerTag: Customers.updateCustomerTag,
		deleteCustomerTag: Customers.deleteCustomerTag,
	},
	orders: {
		createOrder: Orders.createOrder,
		listOrders: Orders.listOrders,
		updateOrder: Orders.updateOrder,
		deleteOrder: Orders.deleteOrder,
		listOrderBillingAddresses: Orders.listOrderBillingAddresses,
		listOrderShippingAddresses: Orders.listOrderShippingAddresses,
		listOrderProducts: Orders.listOrderProducts,
		listOrderProductsOptions: Orders.listOrderProductsOptions,
		listOrderPayments: Orders.listOrderPayments,
		listOrderPaymentV2: Orders.listOrderPaymentV2,
		listOrderShipping: Orders.listOrderShipping,
		listOrderStatus: Orders.listOrderStatus,
	},
	cart: {
		getCart: Cart.getCart,
		addToCart: Cart.addToCart,
		updateCartItem: Cart.updateCartItem,
		removeFromCart: Cart.removeFromCart,
		clearCart: Cart.clearCart,
	},
	discounts: {
		createDiscount: Discounts.createDiscount,
		deleteDiscount: Discounts.deleteDiscount,
		createDiscountCode: Discounts.createDiscountCode,
		listDiscountCodes: Discounts.listDiscountCodes,
		updateDiscountCode: Discounts.updateDiscountCode,
		deleteDiscountCode: Discounts.deleteDiscountCode,
		generateDiscountCodes: Discounts.generateDiscountCodes,
		createProductToDiscount: Discounts.createProductToDiscount,
		deleteProductToDiscount: Discounts.deleteProductToDiscount,
	},
	subscribers: {
		createSubscriber: Subscribers.createSubscriber,
		getSubscriber: Subscribers.getSubscriber,
		listSubscribers: Subscribers.listSubscribers,
		updateSubscriber: Subscribers.updateSubscriber,
		deleteSubscriber: Subscribers.deleteSubscriber,
		createSubscriberChannel: Subscribers.createSubscriberChannel,
		getSubscribersChannel: Subscribers.getSubscribersChannel,
		listSubscribersChannels: Subscribers.listSubscribersChannels,
		updateSubscribersChannel: Subscribers.updateSubscribersChannel,
		deleteSubscribersChannel: Subscribers.deleteSubscribersChannel,
		createSubscriberTag: Subscribers.createSubscriberTag,
		getSubscriberTag: Subscribers.getSubscriberTag,
		listSubscribersTags: Subscribers.listSubscribersTags,
		updateSubscriberTag: Subscribers.updateSubscriberTag,
		deleteSubscriberTag: Subscribers.deleteSubscriberTag,
	},
	blogs: {
		createBlogPost: Blogs.createBlogPost,
		getBlogPost: Blogs.getBlogPost,
		listBlogPosts: Blogs.listBlogPosts,
		updateBlogPost: Blogs.updateBlogPost,
		deleteBlogPost: Blogs.deleteBlogPost,
		createBlogCategory: Blogs.createBlogCategory,
		getBlogCategory: Blogs.getBlogCategory,
		listBlogCategories: Blogs.listBlogCategories,
		updateBlogCategory: Blogs.updateBlogCategory,
		deleteBlogCategory: Blogs.deleteBlogCategory,
		createBlogTag: Blogs.createBlogTag,
		getBlogTag: Blogs.getBlogTag,
		listBlogTags: Blogs.listBlogTags,
		updateBlogTag: Blogs.updateBlogTag,
		deleteBlogTag: Blogs.deleteBlogTag,
		getBlogAuthor: Blogs.getBlogAuthor,
	},
	misc: {
		createVendor: Misc.createVendor,
		getVendor: Misc.getVendor,
		listVendors: Misc.listVendors,
		updateVendor: Misc.updateVendor,
		deleteVendor: Misc.deleteVendor,
		createRedirect: Misc.createRedirect,
		listRedirects: Misc.listRedirects,
		deleteRedirect: Misc.deleteRedirect,
		getPaymentMethods: Misc.getPaymentMethods,
		listPaymentProviders: Misc.listPaymentProviders,
		getShippingMethods: Misc.getShippingMethods,
		listShippingProviders: Misc.listShippingProviders,
	},
	webhooks: {
		createWebhook: Webhooks.createWebhook,
		getWebhook: Webhooks.getWebhook,
		listWebhooks: Webhooks.listWebhooks,
		updateWebhook: Webhooks.updateWebhook,
		deleteWebhook: Webhooks.deleteWebhook,
	},
} as const;

const cloudcartWebhooksNested = {
	order: {
		created: CloudcartWebhooks.orderCreated,
	},
	product: {
		created: CloudcartWebhooks.productCreated,
	},
	customer: {
		created: CloudcartWebhooks.customerCreated,
	},
} as const;

export const cloudcartEndpointSchemas = {
	'products.createProduct': {
		input: CloudcartEndpointInputSchemas.createProduct,
		output: CloudcartEndpointOutputSchemas.createProduct,
	},
	'products.getProduct': {
		input: CloudcartEndpointInputSchemas.getProduct,
		output: CloudcartEndpointOutputSchemas.getProduct,
	},
	'products.getProductWithRelations': {
		input: CloudcartEndpointInputSchemas.getProductWithRelations,
		output: CloudcartEndpointOutputSchemas.getProductWithRelations,
	},
	'products.listProducts': {
		input: CloudcartEndpointInputSchemas.listProducts,
		output: CloudcartEndpointOutputSchemas.listProducts,
	},
	'products.updateProduct': {
		input: CloudcartEndpointInputSchemas.updateProduct,
		output: CloudcartEndpointOutputSchemas.updateProduct,
	},
	'products.deleteProduct': {
		input: CloudcartEndpointInputSchemas.deleteProduct,
		output: CloudcartEndpointOutputSchemas.deleteProduct,
	},
	'products.createLinkedProducts': {
		input: CloudcartEndpointInputSchemas.createLinkedProducts,
		output: CloudcartEndpointOutputSchemas.createLinkedProducts,
	},
	'products.getProductsLinkedProduct': {
		input: CloudcartEndpointInputSchemas.getProductsLinkedProduct,
		output: CloudcartEndpointOutputSchemas.getProductsLinkedProduct,
	},
	'products.getProductsLinkedProducts': {
		input: CloudcartEndpointInputSchemas.getProductsLinkedProducts,
		output: CloudcartEndpointOutputSchemas.getProductsLinkedProducts,
	},
	'products.updateLinkedProduct': {
		input: CloudcartEndpointInputSchemas.updateLinkedProduct,
		output: CloudcartEndpointOutputSchemas.updateLinkedProduct,
	},
	'products.deleteLinkedProducts': {
		input: CloudcartEndpointInputSchemas.deleteLinkedProducts,
		output: CloudcartEndpointOutputSchemas.deleteLinkedProducts,
	},
	'products.createImage': {
		input: CloudcartEndpointInputSchemas.createImage,
		output: CloudcartEndpointOutputSchemas.createImage,
	},
	'products.getImage': {
		input: CloudcartEndpointInputSchemas.getImage,
		output: CloudcartEndpointOutputSchemas.getImage,
	},
	'products.listImages': {
		input: CloudcartEndpointInputSchemas.listImages,
		output: CloudcartEndpointOutputSchemas.listImages,
	},
	'products.deleteImage': {
		input: CloudcartEndpointInputSchemas.deleteImage,
		output: CloudcartEndpointOutputSchemas.deleteImage,
	},

	'categories.createCategory': {
		input: CloudcartEndpointInputSchemas.createCategory,
		output: CloudcartEndpointOutputSchemas.createCategory,
	},
	'categories.getCategory': {
		input: CloudcartEndpointInputSchemas.getCategory,
		output: CloudcartEndpointOutputSchemas.getCategory,
	},
	'categories.listCategories': {
		input: CloudcartEndpointInputSchemas.listCategories,
		output: CloudcartEndpointOutputSchemas.listCategories,
	},
	'categories.updateCategory': {
		input: CloudcartEndpointInputSchemas.updateCategory,
		output: CloudcartEndpointOutputSchemas.updateCategory,
	},
	'categories.deleteCategory': {
		input: CloudcartEndpointInputSchemas.deleteCategory,
		output: CloudcartEndpointOutputSchemas.deleteCategory,
	},
	'categories.getCategoryProperties': {
		input: CloudcartEndpointInputSchemas.getCategoryProperties,
		output: CloudcartEndpointOutputSchemas.getCategoryProperties,
	},
	'categories.addCategoryProperties': {
		input: CloudcartEndpointInputSchemas.addCategoryProperties,
		output: CloudcartEndpointOutputSchemas.addCategoryProperties,
	},

	'properties.createProperty': {
		input: CloudcartEndpointInputSchemas.createProperty,
		output: CloudcartEndpointOutputSchemas.createProperty,
	},
	'properties.getProperty': {
		input: CloudcartEndpointInputSchemas.getProperty,
		output: CloudcartEndpointOutputSchemas.getProperty,
	},
	'properties.listProperties': {
		input: CloudcartEndpointInputSchemas.listProperties,
		output: CloudcartEndpointOutputSchemas.listProperties,
	},
	'properties.updateProperty': {
		input: CloudcartEndpointInputSchemas.updateProperty,
		output: CloudcartEndpointOutputSchemas.updateProperty,
	},
	'properties.deleteProperty': {
		input: CloudcartEndpointInputSchemas.deleteProperty,
		output: CloudcartEndpointOutputSchemas.deleteProperty,
	},
	'properties.createPropertyOption': {
		input: CloudcartEndpointInputSchemas.createPropertyOption,
		output: CloudcartEndpointOutputSchemas.createPropertyOption,
	},
	'properties.getPropertyOption': {
		input: CloudcartEndpointInputSchemas.getPropertyOption,
		output: CloudcartEndpointOutputSchemas.getPropertyOption,
	},
	'properties.listPropertyOptions': {
		input: CloudcartEndpointInputSchemas.listPropertyOptions,
		output: CloudcartEndpointOutputSchemas.listPropertyOptions,
	},
	'properties.updatePropertyOption': {
		input: CloudcartEndpointInputSchemas.updatePropertyOption,
		output: CloudcartEndpointOutputSchemas.updatePropertyOption,
	},
	'properties.deletePropertyOption': {
		input: CloudcartEndpointInputSchemas.deletePropertyOption,
		output: CloudcartEndpointOutputSchemas.deletePropertyOption,
	},
	'properties.createProductsPropertyOptions': {
		input: CloudcartEndpointInputSchemas.createProductsPropertyOptions,
		output: CloudcartEndpointOutputSchemas.createProductsPropertyOptions,
	},
	'properties.getPropertyOptionsRelationship': {
		input: CloudcartEndpointInputSchemas.getPropertyOptionsRelationship,
		output: CloudcartEndpointOutputSchemas.getPropertyOptionsRelationship,
	},

	'variants.createVariant': {
		input: CloudcartEndpointInputSchemas.createVariant,
		output: CloudcartEndpointOutputSchemas.createVariant,
	},
	'variants.getVariant': {
		input: CloudcartEndpointInputSchemas.getVariant,
		output: CloudcartEndpointOutputSchemas.getVariant,
	},
	'variants.listVariants': {
		input: CloudcartEndpointInputSchemas.listVariants,
		output: CloudcartEndpointOutputSchemas.listVariants,
	},
	'variants.updateVariant': {
		input: CloudcartEndpointInputSchemas.updateVariant,
		output: CloudcartEndpointOutputSchemas.updateVariant,
	},
	'variants.deleteVariant': {
		input: CloudcartEndpointInputSchemas.deleteVariant,
		output: CloudcartEndpointOutputSchemas.deleteVariant,
	},
	'variants.createVariantOption': {
		input: CloudcartEndpointInputSchemas.createVariantOption,
		output: CloudcartEndpointOutputSchemas.createVariantOption,
	},
	'variants.createVariantOptions': {
		input: CloudcartEndpointInputSchemas.createVariantOptions,
		output: CloudcartEndpointOutputSchemas.createVariantOptions,
	},
	'variants.getVariantOption': {
		input: CloudcartEndpointInputSchemas.getVariantOption,
		output: CloudcartEndpointOutputSchemas.getVariantOption,
	},
	'variants.listVariantOptions': {
		input: CloudcartEndpointInputSchemas.listVariantOptions,
		output: CloudcartEndpointOutputSchemas.listVariantOptions,
	},
	'variants.updateVariantOption': {
		input: CloudcartEndpointInputSchemas.updateVariantOption,
		output: CloudcartEndpointOutputSchemas.updateVariantOption,
	},
	'variants.deleteVariantOption': {
		input: CloudcartEndpointInputSchemas.deleteVariantOption,
		output: CloudcartEndpointOutputSchemas.deleteVariantOption,
	},
	'variants.createVariantParameter': {
		input: CloudcartEndpointInputSchemas.createVariantParameter,
		output: CloudcartEndpointOutputSchemas.createVariantParameter,
	},
	'variants.createVariantParameterForVariant': {
		input: CloudcartEndpointInputSchemas.createVariantParameterForVariant,
		output: CloudcartEndpointOutputSchemas.createVariantParameterForVariant,
	},
	'variants.getVariantParameter': {
		input: CloudcartEndpointInputSchemas.getVariantParameter,
		output: CloudcartEndpointOutputSchemas.getVariantParameter,
	},
	'variants.listVariantParameters': {
		input: CloudcartEndpointInputSchemas.listVariantParameters,
		output: CloudcartEndpointOutputSchemas.listVariantParameters,
	},
	'variants.updateVariantParameter': {
		input: CloudcartEndpointInputSchemas.updateVariantParameter,
		output: CloudcartEndpointOutputSchemas.updateVariantParameter,
	},
	'variants.deleteVariantParameter': {
		input: CloudcartEndpointInputSchemas.deleteVariantParameter,
		output: CloudcartEndpointOutputSchemas.deleteVariantParameter,
	},

	'customers.createCustomer': {
		input: CloudcartEndpointInputSchemas.createCustomer,
		output: CloudcartEndpointOutputSchemas.createCustomer,
	},
	'customers.getCustomer': {
		input: CloudcartEndpointInputSchemas.getCustomer,
		output: CloudcartEndpointOutputSchemas.getCustomer,
	},
	'customers.listCustomers': {
		input: CloudcartEndpointInputSchemas.listCustomers,
		output: CloudcartEndpointOutputSchemas.listCustomers,
	},
	'customers.updateCustomer': {
		input: CloudcartEndpointInputSchemas.updateCustomer,
		output: CloudcartEndpointOutputSchemas.updateCustomer,
	},
	'customers.deleteCustomer': {
		input: CloudcartEndpointInputSchemas.deleteCustomer,
		output: CloudcartEndpointOutputSchemas.deleteCustomer,
	},
	'customers.createCustomerGroup': {
		input: CloudcartEndpointInputSchemas.createCustomerGroup,
		output: CloudcartEndpointOutputSchemas.createCustomerGroup,
	},
	'customers.getCustomerGroup': {
		input: CloudcartEndpointInputSchemas.getCustomerGroup,
		output: CloudcartEndpointOutputSchemas.getCustomerGroup,
	},
	'customers.listCustomerGroups': {
		input: CloudcartEndpointInputSchemas.listCustomerGroups,
		output: CloudcartEndpointOutputSchemas.listCustomerGroups,
	},
	'customers.getCustomerGroupsCustomers': {
		input: CloudcartEndpointInputSchemas.getCustomerGroupsCustomers,
		output: CloudcartEndpointOutputSchemas.getCustomerGroupsCustomers,
	},
	'customers.updateCustomerGroup': {
		input: CloudcartEndpointInputSchemas.updateCustomerGroup,
		output: CloudcartEndpointOutputSchemas.updateCustomerGroup,
	},
	'customers.deleteCustomerGroup': {
		input: CloudcartEndpointInputSchemas.deleteCustomerGroup,
		output: CloudcartEndpointOutputSchemas.deleteCustomerGroup,
	},
	'customers.createCustomerBillingAddress': {
		input: CloudcartEndpointInputSchemas.createCustomerBillingAddress,
		output: CloudcartEndpointOutputSchemas.createCustomerBillingAddress,
	},
	'customers.getCustomerBillingAddress': {
		input: CloudcartEndpointInputSchemas.getCustomerBillingAddress,
		output: CloudcartEndpointOutputSchemas.getCustomerBillingAddress,
	},
	'customers.listCustomerBillingAddresses': {
		input: CloudcartEndpointInputSchemas.listCustomerBillingAddresses,
		output: CloudcartEndpointOutputSchemas.listCustomerBillingAddresses,
	},
	'customers.updateCustomerBillingAddress': {
		input: CloudcartEndpointInputSchemas.updateCustomerBillingAddress,
		output: CloudcartEndpointOutputSchemas.updateCustomerBillingAddress,
	},
	'customers.deleteCustomerBillingAddress': {
		input: CloudcartEndpointInputSchemas.deleteCustomerBillingAddress,
		output: CloudcartEndpointOutputSchemas.deleteCustomerBillingAddress,
	},
	'customers.createCustomerShippingAddress': {
		input: CloudcartEndpointInputSchemas.createCustomerShippingAddress,
		output: CloudcartEndpointOutputSchemas.createCustomerShippingAddress,
	},
	'customers.getCustomerShippingAddress': {
		input: CloudcartEndpointInputSchemas.getCustomerShippingAddress,
		output: CloudcartEndpointOutputSchemas.getCustomerShippingAddress,
	},
	'customers.listCustomerShippingAddresses': {
		input: CloudcartEndpointInputSchemas.listCustomerShippingAddresses,
		output: CloudcartEndpointOutputSchemas.listCustomerShippingAddresses,
	},
	'customers.updateCustomerShippingAddress': {
		input: CloudcartEndpointInputSchemas.updateCustomerShippingAddress,
		output: CloudcartEndpointOutputSchemas.updateCustomerShippingAddress,
	},
	'customers.deleteCustomerShippingAddress': {
		input: CloudcartEndpointInputSchemas.deleteCustomerShippingAddress,
		output: CloudcartEndpointOutputSchemas.deleteCustomerShippingAddress,
	},
	'customers.createCustomerTag': {
		input: CloudcartEndpointInputSchemas.createCustomerTag,
		output: CloudcartEndpointOutputSchemas.createCustomerTag,
	},
	'customers.getCustomerTag': {
		input: CloudcartEndpointInputSchemas.getCustomerTag,
		output: CloudcartEndpointOutputSchemas.getCustomerTag,
	},
	'customers.listCustomerTags': {
		input: CloudcartEndpointInputSchemas.listCustomerTags,
		output: CloudcartEndpointOutputSchemas.listCustomerTags,
	},
	'customers.updateCustomerTag': {
		input: CloudcartEndpointInputSchemas.updateCustomerTag,
		output: CloudcartEndpointOutputSchemas.updateCustomerTag,
	},
	'customers.deleteCustomerTag': {
		input: CloudcartEndpointInputSchemas.deleteCustomerTag,
		output: CloudcartEndpointOutputSchemas.deleteCustomerTag,
	},

	'orders.createOrder': {
		input: CloudcartEndpointInputSchemas.createOrder,
		output: CloudcartEndpointOutputSchemas.createOrder,
	},
	'orders.listOrders': {
		input: CloudcartEndpointInputSchemas.listOrders,
		output: CloudcartEndpointOutputSchemas.listOrders,
	},
	'orders.updateOrder': {
		input: CloudcartEndpointInputSchemas.updateOrder,
		output: CloudcartEndpointOutputSchemas.updateOrder,
	},
	'orders.deleteOrder': {
		input: CloudcartEndpointInputSchemas.deleteOrder,
		output: CloudcartEndpointOutputSchemas.deleteOrder,
	},
	'orders.listOrderBillingAddresses': {
		input: CloudcartEndpointInputSchemas.listOrderBillingAddresses,
		output: CloudcartEndpointOutputSchemas.listOrderBillingAddresses,
	},
	'orders.listOrderShippingAddresses': {
		input: CloudcartEndpointInputSchemas.listOrderShippingAddresses,
		output: CloudcartEndpointOutputSchemas.listOrderShippingAddresses,
	},
	'orders.listOrderProducts': {
		input: CloudcartEndpointInputSchemas.listOrderProducts,
		output: CloudcartEndpointOutputSchemas.listOrderProducts,
	},
	'orders.listOrderProductsOptions': {
		input: CloudcartEndpointInputSchemas.listOrderProductsOptions,
		output: CloudcartEndpointOutputSchemas.listOrderProductsOptions,
	},
	'orders.listOrderPayments': {
		input: CloudcartEndpointInputSchemas.listOrderPayments,
		output: CloudcartEndpointOutputSchemas.listOrderPayments,
	},
	'orders.listOrderPaymentV2': {
		input: CloudcartEndpointInputSchemas.listOrderPaymentV2,
		output: CloudcartEndpointOutputSchemas.listOrderPaymentV2,
	},
	'orders.listOrderShipping': {
		input: CloudcartEndpointInputSchemas.listOrderShipping,
		output: CloudcartEndpointOutputSchemas.listOrderShipping,
	},
	'orders.listOrderStatus': {
		input: CloudcartEndpointInputSchemas.listOrderStatus,
		output: CloudcartEndpointOutputSchemas.listOrderStatus,
	},

	'cart.getCart': {
		input: CloudcartEndpointInputSchemas.getCart,
		output: CloudcartEndpointOutputSchemas.getCart,
	},
	'cart.addToCart': {
		input: CloudcartEndpointInputSchemas.addToCart,
		output: CloudcartEndpointOutputSchemas.addToCart,
	},
	'cart.updateCartItem': {
		input: CloudcartEndpointInputSchemas.updateCartItem,
		output: CloudcartEndpointOutputSchemas.updateCartItem,
	},
	'cart.removeFromCart': {
		input: CloudcartEndpointInputSchemas.removeFromCart,
		output: CloudcartEndpointOutputSchemas.removeFromCart,
	},
	'cart.clearCart': {
		input: CloudcartEndpointInputSchemas.clearCart,
		output: CloudcartEndpointOutputSchemas.clearCart,
	},

	'discounts.createDiscount': {
		input: CloudcartEndpointInputSchemas.createDiscount,
		output: CloudcartEndpointOutputSchemas.createDiscount,
	},
	'discounts.deleteDiscount': {
		input: CloudcartEndpointInputSchemas.deleteDiscount,
		output: CloudcartEndpointOutputSchemas.deleteDiscount,
	},
	'discounts.createDiscountCode': {
		input: CloudcartEndpointInputSchemas.createDiscountCode,
		output: CloudcartEndpointOutputSchemas.createDiscountCode,
	},
	'discounts.listDiscountCodes': {
		input: CloudcartEndpointInputSchemas.listDiscountCodes,
		output: CloudcartEndpointOutputSchemas.listDiscountCodes,
	},
	'discounts.updateDiscountCode': {
		input: CloudcartEndpointInputSchemas.updateDiscountCode,
		output: CloudcartEndpointOutputSchemas.updateDiscountCode,
	},
	'discounts.deleteDiscountCode': {
		input: CloudcartEndpointInputSchemas.deleteDiscountCode,
		output: CloudcartEndpointOutputSchemas.deleteDiscountCode,
	},
	'discounts.generateDiscountCodes': {
		input: CloudcartEndpointInputSchemas.generateDiscountCodes,
		output: CloudcartEndpointOutputSchemas.generateDiscountCodes,
	},
	'discounts.createProductToDiscount': {
		input: CloudcartEndpointInputSchemas.createProductToDiscount,
		output: CloudcartEndpointOutputSchemas.createProductToDiscount,
	},
	'discounts.deleteProductToDiscount': {
		input: CloudcartEndpointInputSchemas.deleteProductToDiscount,
		output: CloudcartEndpointOutputSchemas.deleteProductToDiscount,
	},

	'subscribers.createSubscriber': {
		input: CloudcartEndpointInputSchemas.createSubscriber,
		output: CloudcartEndpointOutputSchemas.createSubscriber,
	},
	'subscribers.getSubscriber': {
		input: CloudcartEndpointInputSchemas.getSubscriber,
		output: CloudcartEndpointOutputSchemas.getSubscriber,
	},
	'subscribers.listSubscribers': {
		input: CloudcartEndpointInputSchemas.listSubscribers,
		output: CloudcartEndpointOutputSchemas.listSubscribers,
	},
	'subscribers.updateSubscriber': {
		input: CloudcartEndpointInputSchemas.updateSubscriber,
		output: CloudcartEndpointOutputSchemas.updateSubscriber,
	},
	'subscribers.deleteSubscriber': {
		input: CloudcartEndpointInputSchemas.deleteSubscriber,
		output: CloudcartEndpointOutputSchemas.deleteSubscriber,
	},
	'subscribers.createSubscriberChannel': {
		input: CloudcartEndpointInputSchemas.createSubscriberChannel,
		output: CloudcartEndpointOutputSchemas.createSubscriberChannel,
	},
	'subscribers.getSubscribersChannel': {
		input: CloudcartEndpointInputSchemas.getSubscribersChannel,
		output: CloudcartEndpointOutputSchemas.getSubscribersChannel,
	},
	'subscribers.listSubscribersChannels': {
		input: CloudcartEndpointInputSchemas.listSubscribersChannels,
		output: CloudcartEndpointOutputSchemas.listSubscribersChannels,
	},
	'subscribers.updateSubscribersChannel': {
		input: CloudcartEndpointInputSchemas.updateSubscribersChannel,
		output: CloudcartEndpointOutputSchemas.updateSubscribersChannel,
	},
	'subscribers.deleteSubscribersChannel': {
		input: CloudcartEndpointInputSchemas.deleteSubscribersChannel,
		output: CloudcartEndpointOutputSchemas.deleteSubscribersChannel,
	},
	'subscribers.createSubscriberTag': {
		input: CloudcartEndpointInputSchemas.createSubscriberTag,
		output: CloudcartEndpointOutputSchemas.createSubscriberTag,
	},
	'subscribers.getSubscriberTag': {
		input: CloudcartEndpointInputSchemas.getSubscriberTag,
		output: CloudcartEndpointOutputSchemas.getSubscriberTag,
	},
	'subscribers.listSubscribersTags': {
		input: CloudcartEndpointInputSchemas.listSubscribersTags,
		output: CloudcartEndpointOutputSchemas.listSubscribersTags,
	},
	'subscribers.updateSubscriberTag': {
		input: CloudcartEndpointInputSchemas.updateSubscriberTag,
		output: CloudcartEndpointOutputSchemas.updateSubscriberTag,
	},
	'subscribers.deleteSubscriberTag': {
		input: CloudcartEndpointInputSchemas.deleteSubscriberTag,
		output: CloudcartEndpointOutputSchemas.deleteSubscriberTag,
	},

	'blogs.createBlogPost': {
		input: CloudcartEndpointInputSchemas.createBlogPost,
		output: CloudcartEndpointOutputSchemas.createBlogPost,
	},
	'blogs.getBlogPost': {
		input: CloudcartEndpointInputSchemas.getBlogPost,
		output: CloudcartEndpointOutputSchemas.getBlogPost,
	},
	'blogs.listBlogPosts': {
		input: CloudcartEndpointInputSchemas.listBlogPosts,
		output: CloudcartEndpointOutputSchemas.listBlogPosts,
	},
	'blogs.updateBlogPost': {
		input: CloudcartEndpointInputSchemas.updateBlogPost,
		output: CloudcartEndpointOutputSchemas.updateBlogPost,
	},
	'blogs.deleteBlogPost': {
		input: CloudcartEndpointInputSchemas.deleteBlogPost,
		output: CloudcartEndpointOutputSchemas.deleteBlogPost,
	},
	'blogs.createBlogCategory': {
		input: CloudcartEndpointInputSchemas.createBlogCategory,
		output: CloudcartEndpointOutputSchemas.createBlogCategory,
	},
	'blogs.getBlogCategory': {
		input: CloudcartEndpointInputSchemas.getBlogCategory,
		output: CloudcartEndpointOutputSchemas.getBlogCategory,
	},
	'blogs.listBlogCategories': {
		input: CloudcartEndpointInputSchemas.listBlogCategories,
		output: CloudcartEndpointOutputSchemas.listBlogCategories,
	},
	'blogs.updateBlogCategory': {
		input: CloudcartEndpointInputSchemas.updateBlogCategory,
		output: CloudcartEndpointOutputSchemas.updateBlogCategory,
	},
	'blogs.deleteBlogCategory': {
		input: CloudcartEndpointInputSchemas.deleteBlogCategory,
		output: CloudcartEndpointOutputSchemas.deleteBlogCategory,
	},
	'blogs.createBlogTag': {
		input: CloudcartEndpointInputSchemas.createBlogTag,
		output: CloudcartEndpointOutputSchemas.createBlogTag,
	},
	'blogs.getBlogTag': {
		input: CloudcartEndpointInputSchemas.getBlogTag,
		output: CloudcartEndpointOutputSchemas.getBlogTag,
	},
	'blogs.listBlogTags': {
		input: CloudcartEndpointInputSchemas.listBlogTags,
		output: CloudcartEndpointOutputSchemas.listBlogTags,
	},
	'blogs.updateBlogTag': {
		input: CloudcartEndpointInputSchemas.updateBlogTag,
		output: CloudcartEndpointOutputSchemas.updateBlogTag,
	},
	'blogs.deleteBlogTag': {
		input: CloudcartEndpointInputSchemas.deleteBlogTag,
		output: CloudcartEndpointOutputSchemas.deleteBlogTag,
	},
	'blogs.getBlogAuthor': {
		input: CloudcartEndpointInputSchemas.getBlogAuthor,
		output: CloudcartEndpointOutputSchemas.getBlogAuthor,
	},

	'misc.createVendor': {
		input: CloudcartEndpointInputSchemas.createVendor,
		output: CloudcartEndpointOutputSchemas.createVendor,
	},
	'misc.getVendor': {
		input: CloudcartEndpointInputSchemas.getVendor,
		output: CloudcartEndpointOutputSchemas.getVendor,
	},
	'misc.listVendors': {
		input: CloudcartEndpointInputSchemas.listVendors,
		output: CloudcartEndpointOutputSchemas.listVendors,
	},
	'misc.updateVendor': {
		input: CloudcartEndpointInputSchemas.updateVendor,
		output: CloudcartEndpointOutputSchemas.updateVendor,
	},
	'misc.deleteVendor': {
		input: CloudcartEndpointInputSchemas.deleteVendor,
		output: CloudcartEndpointOutputSchemas.deleteVendor,
	},
	'misc.createRedirect': {
		input: CloudcartEndpointInputSchemas.createRedirect,
		output: CloudcartEndpointOutputSchemas.createRedirect,
	},
	'misc.listRedirects': {
		input: CloudcartEndpointInputSchemas.listRedirects,
		output: CloudcartEndpointOutputSchemas.listRedirects,
	},
	'misc.deleteRedirect': {
		input: CloudcartEndpointInputSchemas.deleteRedirect,
		output: CloudcartEndpointOutputSchemas.deleteRedirect,
	},
	'misc.getPaymentMethods': {
		input: CloudcartEndpointInputSchemas.getPaymentMethods,
		output: CloudcartEndpointOutputSchemas.getPaymentMethods,
	},
	'misc.listPaymentProviders': {
		input: CloudcartEndpointInputSchemas.listPaymentProviders,
		output: CloudcartEndpointOutputSchemas.listPaymentProviders,
	},
	'misc.getShippingMethods': {
		input: CloudcartEndpointInputSchemas.getShippingMethods,
		output: CloudcartEndpointOutputSchemas.getShippingMethods,
	},
	'misc.listShippingProviders': {
		input: CloudcartEndpointInputSchemas.listShippingProviders,
		output: CloudcartEndpointOutputSchemas.listShippingProviders,
	},

	'webhooks.createWebhook': {
		input: CloudcartEndpointInputSchemas.createWebhook,
		output: CloudcartEndpointOutputSchemas.createWebhook,
	},
	'webhooks.getWebhook': {
		input: CloudcartEndpointInputSchemas.getWebhook,
		output: CloudcartEndpointOutputSchemas.getWebhook,
	},
	'webhooks.listWebhooks': {
		input: CloudcartEndpointInputSchemas.listWebhooks,
		output: CloudcartEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.updateWebhook': {
		input: CloudcartEndpointInputSchemas.updateWebhook,
		output: CloudcartEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.deleteWebhook': {
		input: CloudcartEndpointInputSchemas.deleteWebhook,
		output: CloudcartEndpointOutputSchemas.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudcartEndpointsNested
>;

const cloudcartWebhookSchemas = {
	'order.created': {
		description: 'Order created webhook event',
		payload: OrderCreatedEventSchema,
		response: OrderCreatedEventSchema,
	},
	'product.created': {
		description: 'Product created webhook event',
		payload: ProductCreatedEventSchema,
		response: ProductCreatedEventSchema,
	},
	'customer.created': {
		description: 'Customer created webhook event',
		payload: CustomerCreatedEventSchema,
		response: CustomerCreatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof cloudcartWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudcartEndpointMeta = {
	'products.createProduct': {
		riskLevel: 'write',
		description: 'Create product',
	},
	'products.getProduct': { riskLevel: 'read', description: 'Get product' },
	'products.getProductWithRelations': {
		riskLevel: 'read',
		description: 'Get product with relations',
	},
	'products.listProducts': { riskLevel: 'read', description: 'List products' },
	'products.updateProduct': {
		riskLevel: 'write',
		description: 'Update product',
	},
	'products.deleteProduct': {
		riskLevel: 'destructive',
		description: 'Delete product',
	},
	'products.createLinkedProducts': {
		riskLevel: 'write',
		description: 'Create linked products',
	},
	'products.getProductsLinkedProduct': {
		riskLevel: 'read',
		description: 'Get product linked product',
	},
	'products.getProductsLinkedProducts': {
		riskLevel: 'read',
		description: 'Get products linked products',
	},
	'products.updateLinkedProduct': {
		riskLevel: 'write',
		description: 'Update linked product',
	},
	'products.deleteLinkedProducts': {
		riskLevel: 'destructive',
		description: 'Delete linked products',
	},
	'products.createImage': { riskLevel: 'write', description: 'Create image' },
	'products.getImage': { riskLevel: 'read', description: 'Get image' },
	'products.listImages': { riskLevel: 'read', description: 'List images' },
	'products.deleteImage': {
		riskLevel: 'destructive',
		description: 'Delete image',
	},

	'categories.createCategory': {
		riskLevel: 'write',
		description: 'Create category',
	},
	'categories.getCategory': { riskLevel: 'read', description: 'Get category' },
	'categories.listCategories': {
		riskLevel: 'read',
		description: 'List categories',
	},
	'categories.updateCategory': {
		riskLevel: 'write',
		description: 'Update category',
	},
	'categories.deleteCategory': {
		riskLevel: 'destructive',
		description: 'Delete category',
	},
	'categories.getCategoryProperties': {
		riskLevel: 'read',
		description: 'Get category properties',
	},
	'categories.addCategoryProperties': {
		riskLevel: 'write',
		description: 'Add category properties',
	},

	'properties.createProperty': {
		riskLevel: 'write',
		description: 'Create property',
	},
	'properties.getProperty': { riskLevel: 'read', description: 'Get property' },
	'properties.listProperties': {
		riskLevel: 'read',
		description: 'List properties',
	},
	'properties.updateProperty': {
		riskLevel: 'write',
		description: 'Update property',
	},
	'properties.deleteProperty': {
		riskLevel: 'destructive',
		description: 'Delete property',
	},
	'properties.createPropertyOption': {
		riskLevel: 'write',
		description: 'Create property option',
	},
	'properties.getPropertyOption': {
		riskLevel: 'read',
		description: 'Get property option',
	},
	'properties.listPropertyOptions': {
		riskLevel: 'read',
		description: 'List property options',
	},
	'properties.updatePropertyOption': {
		riskLevel: 'write',
		description: 'Update property option',
	},
	'properties.deletePropertyOption': {
		riskLevel: 'destructive',
		description: 'Delete property option',
	},
	'properties.createProductsPropertyOptions': {
		riskLevel: 'write',
		description: 'Create product property options',
	},
	'properties.getPropertyOptionsRelationship': {
		riskLevel: 'read',
		description: 'Get property options relationship',
	},

	'variants.createVariant': {
		riskLevel: 'write',
		description: 'Create variant',
	},
	'variants.getVariant': { riskLevel: 'read', description: 'Get variant' },
	'variants.listVariants': { riskLevel: 'read', description: 'List variants' },
	'variants.updateVariant': {
		riskLevel: 'write',
		description: 'Update variant',
	},
	'variants.deleteVariant': {
		riskLevel: 'destructive',
		description: 'Delete variant',
	},
	'variants.createVariantOption': {
		riskLevel: 'write',
		description: 'Create variant option',
	},
	'variants.createVariantOptions': {
		riskLevel: 'write',
		description: 'Create variant options',
	},
	'variants.getVariantOption': {
		riskLevel: 'read',
		description: 'Get variant option',
	},
	'variants.listVariantOptions': {
		riskLevel: 'read',
		description: 'List variant options',
	},
	'variants.updateVariantOption': {
		riskLevel: 'write',
		description: 'Update variant option',
	},
	'variants.deleteVariantOption': {
		riskLevel: 'destructive',
		description: 'Delete variant option',
	},
	'variants.createVariantParameter': {
		riskLevel: 'write',
		description: 'Create variant parameter',
	},
	'variants.createVariantParameterForVariant': {
		riskLevel: 'write',
		description: 'Create variant parameter for variant',
	},
	'variants.getVariantParameter': {
		riskLevel: 'read',
		description: 'Get variant parameter',
	},
	'variants.listVariantParameters': {
		riskLevel: 'read',
		description: 'List variant parameters',
	},
	'variants.updateVariantParameter': {
		riskLevel: 'write',
		description: 'Update variant parameter',
	},
	'variants.deleteVariantParameter': {
		riskLevel: 'destructive',
		description: 'Delete variant parameter',
	},

	'customers.createCustomer': {
		riskLevel: 'write',
		description: 'Create customer',
	},
	'customers.getCustomer': { riskLevel: 'read', description: 'Get customer' },
	'customers.listCustomers': {
		riskLevel: 'read',
		description: 'List customers',
	},
	'customers.updateCustomer': {
		riskLevel: 'write',
		description: 'Update customer',
	},
	'customers.deleteCustomer': {
		riskLevel: 'destructive',
		description: 'Delete customer',
	},
	'customers.createCustomerGroup': {
		riskLevel: 'write',
		description: 'Create customer group',
	},
	'customers.getCustomerGroup': {
		riskLevel: 'read',
		description: 'Get customer group',
	},
	'customers.listCustomerGroups': {
		riskLevel: 'read',
		description: 'List customer groups',
	},
	'customers.getCustomerGroupsCustomers': {
		riskLevel: 'read',
		description: 'Get customer group customers',
	},
	'customers.updateCustomerGroup': {
		riskLevel: 'write',
		description: 'Update customer group',
	},
	'customers.deleteCustomerGroup': {
		riskLevel: 'destructive',
		description: 'Delete customer group',
	},
	'customers.createCustomerBillingAddress': {
		riskLevel: 'write',
		description: 'Create customer billing address',
	},
	'customers.getCustomerBillingAddress': {
		riskLevel: 'read',
		description: 'Get customer billing address',
	},
	'customers.listCustomerBillingAddresses': {
		riskLevel: 'read',
		description: 'List customer billing addresses',
	},
	'customers.updateCustomerBillingAddress': {
		riskLevel: 'write',
		description: 'Update customer billing address',
	},
	'customers.deleteCustomerBillingAddress': {
		riskLevel: 'destructive',
		description: 'Delete customer billing address',
	},
	'customers.createCustomerShippingAddress': {
		riskLevel: 'write',
		description: 'Create customer shipping address',
	},
	'customers.getCustomerShippingAddress': {
		riskLevel: 'read',
		description: 'Get customer shipping address',
	},
	'customers.listCustomerShippingAddresses': {
		riskLevel: 'read',
		description: 'List customer shipping addresses',
	},
	'customers.updateCustomerShippingAddress': {
		riskLevel: 'write',
		description: 'Update customer shipping address',
	},
	'customers.deleteCustomerShippingAddress': {
		riskLevel: 'destructive',
		description: 'Delete customer shipping address',
	},
	'customers.createCustomerTag': {
		riskLevel: 'write',
		description: 'Create customer tag',
	},
	'customers.getCustomerTag': {
		riskLevel: 'read',
		description: 'Get customer tag',
	},
	'customers.listCustomerTags': {
		riskLevel: 'read',
		description: 'List customer tags',
	},
	'customers.updateCustomerTag': {
		riskLevel: 'write',
		description: 'Update customer tag',
	},
	'customers.deleteCustomerTag': {
		riskLevel: 'destructive',
		description: 'Delete customer tag',
	},

	'orders.createOrder': { riskLevel: 'write', description: 'Create order' },
	'orders.listOrders': { riskLevel: 'read', description: 'List orders' },
	'orders.updateOrder': { riskLevel: 'write', description: 'Update order' },
	'orders.deleteOrder': {
		riskLevel: 'destructive',
		description: 'Delete order',
	},
	'orders.listOrderBillingAddresses': {
		riskLevel: 'read',
		description: 'List order billing addresses',
	},
	'orders.listOrderShippingAddresses': {
		riskLevel: 'read',
		description: 'List order shipping addresses',
	},
	'orders.listOrderProducts': {
		riskLevel: 'read',
		description: 'List order products',
	},
	'orders.listOrderProductsOptions': {
		riskLevel: 'read',
		description: 'List order products options',
	},
	'orders.listOrderPayments': {
		riskLevel: 'read',
		description: 'List order payments',
	},
	'orders.listOrderPaymentV2': {
		riskLevel: 'read',
		description: 'List order payment v2',
	},
	'orders.listOrderShipping': {
		riskLevel: 'read',
		description: 'List order shipping',
	},
	'orders.listOrderStatus': {
		riskLevel: 'read',
		description: 'List order statuses',
	},

	'cart.getCart': { riskLevel: 'read', description: 'Get cart' },
	'cart.addToCart': { riskLevel: 'write', description: 'Add item to cart' },
	'cart.updateCartItem': {
		riskLevel: 'write',
		description: 'Update cart item',
	},
	'cart.removeFromCart': {
		riskLevel: 'destructive',
		description: 'Remove item from cart',
	},
	'cart.clearCart': { riskLevel: 'destructive', description: 'Clear cart' },

	'discounts.createDiscount': {
		riskLevel: 'write',
		description: 'Create discount',
	},
	'discounts.deleteDiscount': {
		riskLevel: 'destructive',
		description: 'Delete discount',
	},
	'discounts.createDiscountCode': {
		riskLevel: 'write',
		description: 'Create discount code',
	},
	'discounts.listDiscountCodes': {
		riskLevel: 'read',
		description: 'List discount codes',
	},
	'discounts.updateDiscountCode': {
		riskLevel: 'write',
		description: 'Update discount code',
	},
	'discounts.deleteDiscountCode': {
		riskLevel: 'destructive',
		description: 'Delete discount code',
	},
	'discounts.generateDiscountCodes': {
		riskLevel: 'write',
		description: 'Generate discount codes',
	},
	'discounts.createProductToDiscount': {
		riskLevel: 'write',
		description: 'Create product to discount',
	},
	'discounts.deleteProductToDiscount': {
		riskLevel: 'destructive',
		description: 'Delete product to discount',
	},

	'subscribers.createSubscriber': {
		riskLevel: 'write',
		description: 'Create subscriber',
	},
	'subscribers.getSubscriber': {
		riskLevel: 'read',
		description: 'Get subscriber',
	},
	'subscribers.listSubscribers': {
		riskLevel: 'read',
		description: 'List subscribers',
	},
	'subscribers.updateSubscriber': {
		riskLevel: 'write',
		description: 'Update subscriber',
	},
	'subscribers.deleteSubscriber': {
		riskLevel: 'destructive',
		description: 'Delete subscriber',
	},
	'subscribers.createSubscriberChannel': {
		riskLevel: 'write',
		description: 'Create subscriber channel',
	},
	'subscribers.getSubscribersChannel': {
		riskLevel: 'read',
		description: 'Get subscriber channel',
	},
	'subscribers.listSubscribersChannels': {
		riskLevel: 'read',
		description: 'List subscriber channels',
	},
	'subscribers.updateSubscribersChannel': {
		riskLevel: 'write',
		description: 'Update subscriber channel',
	},
	'subscribers.deleteSubscribersChannel': {
		riskLevel: 'destructive',
		description: 'Delete subscriber channel',
	},
	'subscribers.createSubscriberTag': {
		riskLevel: 'write',
		description: 'Create subscriber tag',
	},
	'subscribers.getSubscriberTag': {
		riskLevel: 'read',
		description: 'Get subscriber tag',
	},
	'subscribers.listSubscribersTags': {
		riskLevel: 'read',
		description: 'List subscriber tags',
	},
	'subscribers.updateSubscriberTag': {
		riskLevel: 'write',
		description: 'Update subscriber tag',
	},
	'subscribers.deleteSubscriberTag': {
		riskLevel: 'destructive',
		description: 'Delete subscriber tag',
	},

	'blogs.createBlogPost': {
		riskLevel: 'write',
		description: 'Create blog post',
	},
	'blogs.getBlogPost': { riskLevel: 'read', description: 'Get blog post' },
	'blogs.listBlogPosts': { riskLevel: 'read', description: 'List blog posts' },
	'blogs.updateBlogPost': {
		riskLevel: 'write',
		description: 'Update blog post',
	},
	'blogs.deleteBlogPost': {
		riskLevel: 'destructive',
		description: 'Delete blog post',
	},
	'blogs.createBlogCategory': {
		riskLevel: 'write',
		description: 'Create blog category',
	},
	'blogs.getBlogCategory': {
		riskLevel: 'read',
		description: 'Get blog category',
	},
	'blogs.listBlogCategories': {
		riskLevel: 'read',
		description: 'List blog categories',
	},
	'blogs.updateBlogCategory': {
		riskLevel: 'write',
		description: 'Update blog category',
	},
	'blogs.deleteBlogCategory': {
		riskLevel: 'destructive',
		description: 'Delete blog category',
	},
	'blogs.createBlogTag': { riskLevel: 'write', description: 'Create blog tag' },
	'blogs.getBlogTag': { riskLevel: 'read', description: 'Get blog tag' },
	'blogs.listBlogTags': { riskLevel: 'read', description: 'List blog tags' },
	'blogs.updateBlogTag': { riskLevel: 'write', description: 'Update blog tag' },
	'blogs.deleteBlogTag': {
		riskLevel: 'destructive',
		description: 'Delete blog tag',
	},
	'blogs.getBlogAuthor': { riskLevel: 'read', description: 'Get blog author' },

	'misc.createVendor': { riskLevel: 'write', description: 'Create vendor' },
	'misc.getVendor': { riskLevel: 'read', description: 'Get vendor' },
	'misc.listVendors': { riskLevel: 'read', description: 'List vendors' },
	'misc.updateVendor': { riskLevel: 'write', description: 'Update vendor' },
	'misc.deleteVendor': {
		riskLevel: 'destructive',
		description: 'Delete vendor',
	},
	'misc.createRedirect': { riskLevel: 'write', description: 'Create redirect' },
	'misc.listRedirects': { riskLevel: 'read', description: 'List redirects' },
	'misc.deleteRedirect': {
		riskLevel: 'destructive',
		description: 'Delete redirect',
	},
	'misc.getPaymentMethods': {
		riskLevel: 'read',
		description: 'Get payment methods',
	},
	'misc.listPaymentProviders': {
		riskLevel: 'read',
		description: 'List payment providers',
	},
	'misc.getShippingMethods': {
		riskLevel: 'read',
		description: 'Get shipping methods',
	},
	'misc.listShippingProviders': {
		riskLevel: 'read',
		description: 'List shipping providers',
	},

	'webhooks.createWebhook': {
		riskLevel: 'write',
		description: 'Create webhook',
	},
	'webhooks.getWebhook': { riskLevel: 'read', description: 'Get webhook' },
	'webhooks.listWebhooks': { riskLevel: 'read', description: 'List webhooks' },
	'webhooks.updateWebhook': {
		riskLevel: 'write',
		description: 'Update webhook',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Delete webhook',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudcartEndpointsNested
>;

export type BaseCloudcartPlugin<T extends CloudcartPluginOptions> =
	CorsairPlugin<
		'cloudcart',
		typeof CloudcartSchema,
		typeof cloudcartEndpointsNested,
		typeof cloudcartWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof cloudcartAuthConfig
	>;

export type InternalCloudcartPlugin =
	BaseCloudcartPlugin<CloudcartPluginOptions>;

export type ExternalCloudcartPlugin<T extends CloudcartPluginOptions> =
	BaseCloudcartPlugin<T>;

export function cloudcart<const T extends CloudcartPluginOptions>(
	incomingOptions: CloudcartPluginOptions & T = {} as CloudcartPluginOptions &
		T,
): ExternalCloudcartPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
	return {
		id: 'cloudcart',
		authConfig: cloudcartAuthConfig,
		schema: CloudcartSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cloudcartEndpointsNested,
		webhooks: cloudcartWebhooksNested,
		endpointMeta: cloudcartEndpointMeta,
		endpointSchemas: cloudcartEndpointSchemas,
		webhookSchemas: cloudcartWebhookSchemas,
		pluginWebhookMatcher: matchCloudcartWebhook,
		pluginTenantWebhookMatcher: matchCloudcartTenantWebhook,
		errorHandlers: {
			...specificDefaults,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
		},
		keyBuilder: async (ctx: CloudcartKeyBuilderContext, source) => {
			if (source === 'webhook') {
				const secret =
					options.webhookSecret ??
					options.key ??
					(await ctx.keys?.get_webhook_signature?.()) ??
					(ctx.authType === 'api_key'
						? await ctx.keys?.get_api_key?.()
						: undefined);
				if (!secret) {
					throw new AuthMissingError('cloudcart', 'api_key');
				}
				return secret;
			}

			const apiKey =
				options.key ??
				(ctx.authType === 'api_key'
					? await ctx.keys?.get_api_key?.()
					: undefined);
			if (!apiKey) {
				throw new AuthMissingError('cloudcart', 'api_key');
			}

			const storeUrl = options.storeUrl ?? (await ctx.keys?.get_store_url?.());
			if (!storeUrl) {
				throw new AuthMissingError('cloudcart', 'store_url');
			}

			return packCloudcartKey(apiKey, storeUrl);
		},
	} satisfies InternalCloudcartPlugin;
}

export * from './endpoints';
export * from './endpoints/types';
export * from './webhooks/types';
