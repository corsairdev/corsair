import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Categories,
	Customers,
	Discounts,
	Employees,
	Inventory,
	Items,
	Merchant,
	Modifiers,
	Oidc,
	PaymentTypes,
	PosDevices,
	Receipts,
	Shifts,
	Stores,
	Suppliers,
	Taxes,
	Variants,
	Webhooks,
} from './endpoints';
import type {
	LoyverseEndpointInputs,
	LoyverseEndpointOutputs,
} from './endpoints/types';
import {
	LoyverseEndpointInputSchemas,
	LoyverseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LoyverseSchema } from './schema';

export type LoyversePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalLoyversePlugin['hooks'];
	webhookHooks?: InternalLoyversePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof loyverseEndpointsNested>;
};

/**
 * Loyverse offers OAuth 2.0 and personal access tokens, and both are presented
 * the same way - `Authorization: Bearer <token>` - so a personal access token is
 * byte-compatible with an OAuth access token and the runtime-supplied key works
 * for either.
 *
 * There is no second credential: unlike Harvest's account id or Zendesk's
 * subdomain, the token alone identifies the account, so no `account` keys are
 * declared and there is no resolution chain to get wrong.
 */
export const loyverseAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type LoyverseContext = CorsairPluginContext<
	typeof LoyverseSchema,
	LoyversePluginOptions,
	undefined,
	typeof loyverseAuthConfig
>;

export type LoyverseKeyBuilderContext =
	KeyBuilderContext<LoyversePluginOptions>;

export type LoyverseBoundEndpoints = BindEndpoints<
	typeof loyverseEndpointsNested
>;

type LoyverseEndpoint<K extends keyof LoyverseEndpointOutputs> =
	CorsairEndpoint<
		LoyverseContext,
		LoyverseEndpointInputs[K],
		LoyverseEndpointOutputs[K]
	>;

export type LoyverseEndpoints = {
	itemsList: LoyverseEndpoint<'itemsList'>;
	itemsGet: LoyverseEndpoint<'itemsGet'>;
	itemsUpsert: LoyverseEndpoint<'itemsUpsert'>;
	itemsDelete: LoyverseEndpoint<'itemsDelete'>;
	itemsUploadImage: LoyverseEndpoint<'itemsUploadImage'>;
	itemsDeleteImage: LoyverseEndpoint<'itemsDeleteImage'>;
	variantsList: LoyverseEndpoint<'variantsList'>;
	variantsGet: LoyverseEndpoint<'variantsGet'>;
	variantsUpsert: LoyverseEndpoint<'variantsUpsert'>;
	variantsDelete: LoyverseEndpoint<'variantsDelete'>;
	categoriesList: LoyverseEndpoint<'categoriesList'>;
	categoriesGet: LoyverseEndpoint<'categoriesGet'>;
	categoriesUpsert: LoyverseEndpoint<'categoriesUpsert'>;
	categoriesDelete: LoyverseEndpoint<'categoriesDelete'>;
	modifiersList: LoyverseEndpoint<'modifiersList'>;
	modifiersGet: LoyverseEndpoint<'modifiersGet'>;
	modifiersUpsert: LoyverseEndpoint<'modifiersUpsert'>;
	modifiersDelete: LoyverseEndpoint<'modifiersDelete'>;
	discountsList: LoyverseEndpoint<'discountsList'>;
	discountsListFiltered: LoyverseEndpoint<'discountsListFiltered'>;
	discountsGet: LoyverseEndpoint<'discountsGet'>;
	discountsUpsert: LoyverseEndpoint<'discountsUpsert'>;
	discountsDelete: LoyverseEndpoint<'discountsDelete'>;
	taxesList: LoyverseEndpoint<'taxesList'>;
	taxesGet: LoyverseEndpoint<'taxesGet'>;
	taxesUpsert: LoyverseEndpoint<'taxesUpsert'>;
	taxesDelete: LoyverseEndpoint<'taxesDelete'>;
	customersList: LoyverseEndpoint<'customersList'>;
	customersGet: LoyverseEndpoint<'customersGet'>;
	customersUpsert: LoyverseEndpoint<'customersUpsert'>;
	customersDelete: LoyverseEndpoint<'customersDelete'>;
	suppliersList: LoyverseEndpoint<'suppliersList'>;
	suppliersGet: LoyverseEndpoint<'suppliersGet'>;
	suppliersUpsert: LoyverseEndpoint<'suppliersUpsert'>;
	suppliersDelete: LoyverseEndpoint<'suppliersDelete'>;
	posDevicesList: LoyverseEndpoint<'posDevicesList'>;
	posDevicesGet: LoyverseEndpoint<'posDevicesGet'>;
	posDevicesUpsert: LoyverseEndpoint<'posDevicesUpsert'>;
	posDevicesDelete: LoyverseEndpoint<'posDevicesDelete'>;
	webhooksList: LoyverseEndpoint<'webhooksList'>;
	webhooksGet: LoyverseEndpoint<'webhooksGet'>;
	webhooksUpsert: LoyverseEndpoint<'webhooksUpsert'>;
	webhooksDelete: LoyverseEndpoint<'webhooksDelete'>;
	inventoryList: LoyverseEndpoint<'inventoryList'>;
	inventoryUpdate: LoyverseEndpoint<'inventoryUpdate'>;
	employeesList: LoyverseEndpoint<'employeesList'>;
	employeesGet: LoyverseEndpoint<'employeesGet'>;
	paymentTypesList: LoyverseEndpoint<'paymentTypesList'>;
	paymentTypesGet: LoyverseEndpoint<'paymentTypesGet'>;
	storesList: LoyverseEndpoint<'storesList'>;
	storesGet: LoyverseEndpoint<'storesGet'>;
	shiftsList: LoyverseEndpoint<'shiftsList'>;
	receiptsList: LoyverseEndpoint<'receiptsList'>;
	receiptsGet: LoyverseEndpoint<'receiptsGet'>;
	receiptsCreate: LoyverseEndpoint<'receiptsCreate'>;
	receiptsRefund: LoyverseEndpoint<'receiptsRefund'>;
	merchantGet: LoyverseEndpoint<'merchantGet'>;
	oidcDiscovery: LoyverseEndpoint<'oidcDiscovery'>;
	oidcJwks: LoyverseEndpoint<'oidcJwks'>;
};

/**
 * Loyverse does publish webhooks - five events, administered by the
 * `webhooks.*` operations below - but this plugin registers no Corsair triggers,
 * matching the OSS catalog, which lists zero triggers for Loyverse. Notifications
 * from a subscription created with a personal access token are unsigned, so there
 * would be nothing to verify a delivery against.
 */
export type LoyverseWebhooks = Record<string, never>;

export type LoyverseBoundWebhooks = BindWebhooks<LoyverseWebhooks>;

/**
 * The 59 operations of the catalog surface.
 *
 * `upsert` rather than separate create and update entries because Loyverse
 * exposes one endpoint for both: a collection POST carrying an `id` updates that
 * record, and without one creates a new record.
 */
const loyverseEndpointsNested = {
	items: {
		list: Items.list,
		get: Items.get,
		upsert: Items.upsert,
		delete: Items.remove,
		uploadImage: Items.uploadImage,
		deleteImage: Items.deleteImage,
	},
	variants: {
		list: Variants.list,
		get: Variants.get,
		upsert: Variants.upsert,
		delete: Variants.remove,
	},
	categories: {
		list: Categories.list,
		get: Categories.get,
		upsert: Categories.upsert,
		delete: Categories.remove,
	},
	modifiers: {
		list: Modifiers.list,
		get: Modifiers.get,
		upsert: Modifiers.upsert,
		delete: Modifiers.remove,
	},
	discounts: {
		list: Discounts.list,
		listFiltered: Discounts.listFiltered,
		get: Discounts.get,
		upsert: Discounts.upsert,
		delete: Discounts.remove,
	},
	taxes: {
		list: Taxes.list,
		get: Taxes.get,
		upsert: Taxes.upsert,
		delete: Taxes.remove,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		upsert: Customers.upsert,
		delete: Customers.remove,
	},
	suppliers: {
		list: Suppliers.list,
		get: Suppliers.get,
		upsert: Suppliers.upsert,
		delete: Suppliers.remove,
	},
	posDevices: {
		list: PosDevices.list,
		get: PosDevices.get,
		upsert: PosDevices.upsert,
		delete: PosDevices.remove,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		upsert: Webhooks.upsert,
		delete: Webhooks.remove,
	},
	inventory: {
		list: Inventory.list,
		update: Inventory.update,
	},
	employees: {
		list: Employees.list,
		get: Employees.get,
	},
	paymentTypes: {
		list: PaymentTypes.list,
		get: PaymentTypes.get,
	},
	stores: {
		list: Stores.list,
		get: Stores.get,
	},
	shifts: {
		list: Shifts.list,
	},
	receipts: {
		list: Receipts.list,
		get: Receipts.get,
		create: Receipts.create,
		refund: Receipts.refund,
	},
	merchant: {
		get: Merchant.get,
	},
	oidc: {
		discovery: Oidc.discovery,
		jwks: Oidc.jwks,
	},
} as const;

const loyverseWebhooksNested = {} as const;

export const loyverseEndpointSchemas = {
	'items.list': {
		input: LoyverseEndpointInputSchemas.itemsList,
		output: LoyverseEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: LoyverseEndpointInputSchemas.itemsGet,
		output: LoyverseEndpointOutputSchemas.itemsGet,
	},
	'items.upsert': {
		input: LoyverseEndpointInputSchemas.itemsUpsert,
		output: LoyverseEndpointOutputSchemas.itemsUpsert,
	},
	'items.delete': {
		input: LoyverseEndpointInputSchemas.itemsDelete,
		output: LoyverseEndpointOutputSchemas.itemsDelete,
	},
	'items.uploadImage': {
		input: LoyverseEndpointInputSchemas.itemsUploadImage,
		output: LoyverseEndpointOutputSchemas.itemsUploadImage,
	},
	'items.deleteImage': {
		input: LoyverseEndpointInputSchemas.itemsDeleteImage,
		output: LoyverseEndpointOutputSchemas.itemsDeleteImage,
	},
	'variants.list': {
		input: LoyverseEndpointInputSchemas.variantsList,
		output: LoyverseEndpointOutputSchemas.variantsList,
	},
	'variants.get': {
		input: LoyverseEndpointInputSchemas.variantsGet,
		output: LoyverseEndpointOutputSchemas.variantsGet,
	},
	'variants.upsert': {
		input: LoyverseEndpointInputSchemas.variantsUpsert,
		output: LoyverseEndpointOutputSchemas.variantsUpsert,
	},
	'variants.delete': {
		input: LoyverseEndpointInputSchemas.variantsDelete,
		output: LoyverseEndpointOutputSchemas.variantsDelete,
	},
	'categories.list': {
		input: LoyverseEndpointInputSchemas.categoriesList,
		output: LoyverseEndpointOutputSchemas.categoriesList,
	},
	'categories.get': {
		input: LoyverseEndpointInputSchemas.categoriesGet,
		output: LoyverseEndpointOutputSchemas.categoriesGet,
	},
	'categories.upsert': {
		input: LoyverseEndpointInputSchemas.categoriesUpsert,
		output: LoyverseEndpointOutputSchemas.categoriesUpsert,
	},
	'categories.delete': {
		input: LoyverseEndpointInputSchemas.categoriesDelete,
		output: LoyverseEndpointOutputSchemas.categoriesDelete,
	},
	'modifiers.list': {
		input: LoyverseEndpointInputSchemas.modifiersList,
		output: LoyverseEndpointOutputSchemas.modifiersList,
	},
	'modifiers.get': {
		input: LoyverseEndpointInputSchemas.modifiersGet,
		output: LoyverseEndpointOutputSchemas.modifiersGet,
	},
	'modifiers.upsert': {
		input: LoyverseEndpointInputSchemas.modifiersUpsert,
		output: LoyverseEndpointOutputSchemas.modifiersUpsert,
	},
	'modifiers.delete': {
		input: LoyverseEndpointInputSchemas.modifiersDelete,
		output: LoyverseEndpointOutputSchemas.modifiersDelete,
	},
	'discounts.list': {
		input: LoyverseEndpointInputSchemas.discountsList,
		output: LoyverseEndpointOutputSchemas.discountsList,
	},
	'discounts.listFiltered': {
		input: LoyverseEndpointInputSchemas.discountsListFiltered,
		output: LoyverseEndpointOutputSchemas.discountsListFiltered,
	},
	'discounts.get': {
		input: LoyverseEndpointInputSchemas.discountsGet,
		output: LoyverseEndpointOutputSchemas.discountsGet,
	},
	'discounts.upsert': {
		input: LoyverseEndpointInputSchemas.discountsUpsert,
		output: LoyverseEndpointOutputSchemas.discountsUpsert,
	},
	'discounts.delete': {
		input: LoyverseEndpointInputSchemas.discountsDelete,
		output: LoyverseEndpointOutputSchemas.discountsDelete,
	},
	'taxes.list': {
		input: LoyverseEndpointInputSchemas.taxesList,
		output: LoyverseEndpointOutputSchemas.taxesList,
	},
	'taxes.get': {
		input: LoyverseEndpointInputSchemas.taxesGet,
		output: LoyverseEndpointOutputSchemas.taxesGet,
	},
	'taxes.upsert': {
		input: LoyverseEndpointInputSchemas.taxesUpsert,
		output: LoyverseEndpointOutputSchemas.taxesUpsert,
	},
	'taxes.delete': {
		input: LoyverseEndpointInputSchemas.taxesDelete,
		output: LoyverseEndpointOutputSchemas.taxesDelete,
	},
	'customers.list': {
		input: LoyverseEndpointInputSchemas.customersList,
		output: LoyverseEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: LoyverseEndpointInputSchemas.customersGet,
		output: LoyverseEndpointOutputSchemas.customersGet,
	},
	'customers.upsert': {
		input: LoyverseEndpointInputSchemas.customersUpsert,
		output: LoyverseEndpointOutputSchemas.customersUpsert,
	},
	'customers.delete': {
		input: LoyverseEndpointInputSchemas.customersDelete,
		output: LoyverseEndpointOutputSchemas.customersDelete,
	},
	'suppliers.list': {
		input: LoyverseEndpointInputSchemas.suppliersList,
		output: LoyverseEndpointOutputSchemas.suppliersList,
	},
	'suppliers.get': {
		input: LoyverseEndpointInputSchemas.suppliersGet,
		output: LoyverseEndpointOutputSchemas.suppliersGet,
	},
	'suppliers.upsert': {
		input: LoyverseEndpointInputSchemas.suppliersUpsert,
		output: LoyverseEndpointOutputSchemas.suppliersUpsert,
	},
	'suppliers.delete': {
		input: LoyverseEndpointInputSchemas.suppliersDelete,
		output: LoyverseEndpointOutputSchemas.suppliersDelete,
	},
	'posDevices.list': {
		input: LoyverseEndpointInputSchemas.posDevicesList,
		output: LoyverseEndpointOutputSchemas.posDevicesList,
	},
	'posDevices.get': {
		input: LoyverseEndpointInputSchemas.posDevicesGet,
		output: LoyverseEndpointOutputSchemas.posDevicesGet,
	},
	'posDevices.upsert': {
		input: LoyverseEndpointInputSchemas.posDevicesUpsert,
		output: LoyverseEndpointOutputSchemas.posDevicesUpsert,
	},
	'posDevices.delete': {
		input: LoyverseEndpointInputSchemas.posDevicesDelete,
		output: LoyverseEndpointOutputSchemas.posDevicesDelete,
	},
	'webhooks.list': {
		input: LoyverseEndpointInputSchemas.webhooksList,
		output: LoyverseEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: LoyverseEndpointInputSchemas.webhooksGet,
		output: LoyverseEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.upsert': {
		input: LoyverseEndpointInputSchemas.webhooksUpsert,
		output: LoyverseEndpointOutputSchemas.webhooksUpsert,
	},
	'webhooks.delete': {
		input: LoyverseEndpointInputSchemas.webhooksDelete,
		output: LoyverseEndpointOutputSchemas.webhooksDelete,
	},
	'inventory.list': {
		input: LoyverseEndpointInputSchemas.inventoryList,
		output: LoyverseEndpointOutputSchemas.inventoryList,
	},
	'inventory.update': {
		input: LoyverseEndpointInputSchemas.inventoryUpdate,
		output: LoyverseEndpointOutputSchemas.inventoryUpdate,
	},
	'employees.list': {
		input: LoyverseEndpointInputSchemas.employeesList,
		output: LoyverseEndpointOutputSchemas.employeesList,
	},
	'employees.get': {
		input: LoyverseEndpointInputSchemas.employeesGet,
		output: LoyverseEndpointOutputSchemas.employeesGet,
	},
	'paymentTypes.list': {
		input: LoyverseEndpointInputSchemas.paymentTypesList,
		output: LoyverseEndpointOutputSchemas.paymentTypesList,
	},
	'paymentTypes.get': {
		input: LoyverseEndpointInputSchemas.paymentTypesGet,
		output: LoyverseEndpointOutputSchemas.paymentTypesGet,
	},
	'stores.list': {
		input: LoyverseEndpointInputSchemas.storesList,
		output: LoyverseEndpointOutputSchemas.storesList,
	},
	'stores.get': {
		input: LoyverseEndpointInputSchemas.storesGet,
		output: LoyverseEndpointOutputSchemas.storesGet,
	},
	'shifts.list': {
		input: LoyverseEndpointInputSchemas.shiftsList,
		output: LoyverseEndpointOutputSchemas.shiftsList,
	},
	'receipts.list': {
		input: LoyverseEndpointInputSchemas.receiptsList,
		output: LoyverseEndpointOutputSchemas.receiptsList,
	},
	'receipts.get': {
		input: LoyverseEndpointInputSchemas.receiptsGet,
		output: LoyverseEndpointOutputSchemas.receiptsGet,
	},
	'receipts.create': {
		input: LoyverseEndpointInputSchemas.receiptsCreate,
		output: LoyverseEndpointOutputSchemas.receiptsCreate,
	},
	'receipts.refund': {
		input: LoyverseEndpointInputSchemas.receiptsRefund,
		output: LoyverseEndpointOutputSchemas.receiptsRefund,
	},
	'merchant.get': {
		input: LoyverseEndpointInputSchemas.merchantGet,
		output: LoyverseEndpointOutputSchemas.merchantGet,
	},
	'oidc.discovery': {
		input: LoyverseEndpointInputSchemas.oidcDiscovery,
		output: LoyverseEndpointOutputSchemas.oidcDiscovery,
	},
	'oidc.jwks': {
		input: LoyverseEndpointInputSchemas.oidcJwks,
		output: LoyverseEndpointOutputSchemas.oidcJwks,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof loyverseEndpointsNested
>;

export const loyverseWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof loyverseWebhooksNested
	>;

/**
 * Risk levels follow what the operation can destroy.
 *
 * `destructive` is every delete, plus the two receipt writes: a sale and a refund
 * move money and cannot be withdrawn once recorded. The upserts are `write` -
 * they can overwrite a record but not remove one. Reads are `read`.
 */
export const loyverseEndpointMeta = {
	'items.list': { riskLevel: 'read', description: 'List items' },
	'items.get': { riskLevel: 'read', description: 'Get a single item' },
	'items.upsert': {
		riskLevel: 'write',
		description: 'Create or update an item',
	},
	'items.delete': { riskLevel: 'destructive', description: 'Delete an item' },
	'items.uploadImage': {
		riskLevel: 'write',
		description: "Upload an item's image",
	},
	'items.deleteImage': {
		riskLevel: 'destructive',
		description: "Delete an item's image",
	},
	'variants.list': { riskLevel: 'read', description: 'List item variants' },
	'variants.get': { riskLevel: 'read', description: 'Get a single variant' },
	'variants.upsert': {
		riskLevel: 'write',
		description: 'Create or update an item variant',
	},
	'variants.delete': {
		riskLevel: 'destructive',
		description: 'Delete an item variant',
	},
	'categories.list': { riskLevel: 'read', description: 'List categories' },
	'categories.get': { riskLevel: 'read', description: 'Get a single category' },
	'categories.upsert': {
		riskLevel: 'write',
		description: 'Create or update a category',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a category',
	},
	'modifiers.list': { riskLevel: 'read', description: 'List modifiers' },
	'modifiers.get': { riskLevel: 'read', description: 'Get a single modifier' },
	'modifiers.upsert': {
		riskLevel: 'write',
		description: 'Create or update a modifier',
	},
	'modifiers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a modifier',
	},
	'discounts.list': { riskLevel: 'read', description: 'List discounts' },
	'discounts.listFiltered': {
		riskLevel: 'read',
		description:
			'List discounts filtered by id, timestamp range or deleted status',
	},
	'discounts.get': { riskLevel: 'read', description: 'Get a single discount' },
	'discounts.upsert': {
		riskLevel: 'write',
		description: 'Create or update a discount',
	},
	'discounts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a discount',
	},
	'taxes.list': { riskLevel: 'read', description: 'List taxes' },
	'taxes.get': { riskLevel: 'read', description: 'Get a single tax' },
	'taxes.upsert': { riskLevel: 'write', description: 'Create or update a tax' },
	'taxes.delete': { riskLevel: 'destructive', description: 'Delete a tax' },
	'customers.list': { riskLevel: 'read', description: 'List customers' },
	'customers.get': { riskLevel: 'read', description: 'Get a single customer' },
	'customers.upsert': {
		riskLevel: 'write',
		description: 'Create or update a customer',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a customer permanently',
	},
	'suppliers.list': { riskLevel: 'read', description: 'List suppliers' },
	'suppliers.get': { riskLevel: 'read', description: 'Get a single supplier' },
	'suppliers.upsert': {
		riskLevel: 'write',
		description: 'Create or update a supplier',
	},
	'suppliers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a supplier',
	},
	'posDevices.list': { riskLevel: 'read', description: 'List POS devices' },
	'posDevices.get': {
		riskLevel: 'read',
		description: 'Get a single POS device',
	},
	'posDevices.upsert': {
		riskLevel: 'write',
		description: 'Create or update a POS device',
	},
	'posDevices.delete': {
		riskLevel: 'destructive',
		description: 'Delete a POS device',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a single webhook subscription',
	},
	'webhooks.upsert': {
		riskLevel: 'write',
		description: 'Create or update a webhook subscription',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription',
	},
	'inventory.list': { riskLevel: 'read', description: 'List inventory levels' },
	'inventory.update': {
		riskLevel: 'write',
		description: 'Set inventory levels for item variants',
	},
	'employees.list': { riskLevel: 'read', description: 'List employees' },
	'employees.get': { riskLevel: 'read', description: 'Get a single employee' },
	'paymentTypes.list': { riskLevel: 'read', description: 'List payment types' },
	'paymentTypes.get': {
		riskLevel: 'read',
		description: 'Get a single payment type',
	},
	'stores.list': { riskLevel: 'read', description: 'List stores' },
	'stores.get': { riskLevel: 'read', description: 'Get a single store' },
	'shifts.list': { riskLevel: 'read', description: 'List shifts' },
	'receipts.list': { riskLevel: 'read', description: 'List receipts' },
	'receipts.get': { riskLevel: 'read', description: 'Get a single receipt' },
	'receipts.create': {
		riskLevel: 'destructive',
		description: 'Record a sale, which cannot be withdrawn once created',
	},
	'receipts.refund': {
		riskLevel: 'destructive',
		description: 'Refund a receipt, which returns money to the customer',
	},
	'merchant.get': {
		riskLevel: 'read',
		description: 'Get merchant information',
	},
	'oidc.discovery': {
		riskLevel: 'read',
		description: 'Get the OpenID Connect discovery document',
	},
	'oidc.jwks': {
		riskLevel: 'read',
		description: 'Get the JSON Web Key Set',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof loyverseEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseLoyversePlugin<T extends LoyversePluginOptions> = CorsairPlugin<
	'loyverse',
	typeof LoyverseSchema,
	typeof loyverseEndpointsNested,
	typeof loyverseWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLoyversePlugin = BaseLoyversePlugin<LoyversePluginOptions>;

export type ExternalLoyversePlugin<T extends LoyversePluginOptions> =
	BaseLoyversePlugin<T>;

/**
 * Builds the Loyverse plugin.
 *
 * Loyverse authenticates with a bearer token - an OAuth 2.0 access token, or a
 * personal access token, which is byte-compatible with one. Nothing else is
 * required: no account header, no subdomain, no `User-Agent`.
 */
export function loyverse<const T extends LoyversePluginOptions>(
	incomingOptions: LoyversePluginOptions & T = {} as LoyversePluginOptions & T,
): ExternalLoyversePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'loyverse',
		authConfig: loyverseAuthConfig,
		schema: LoyverseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: loyverseEndpointsNested,
		webhooks: loyverseWebhooksNested,
		endpointMeta: loyverseEndpointMeta,
		endpointSchemas: loyverseEndpointSchemas,
		webhookSchemas: loyverseWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LoyverseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalLoyversePlugin;
}

export type {
	LoyverseEndpointInputs,
	LoyverseEndpointOutputs,
	LoyverseInventoryLevel,
	LoyverseReceipt,
	LoyverseShift,
	LoyverseWebhook,
} from './endpoints/types';
export type {
	LoyverseCategoryEntity,
	LoyverseCustomerEntity,
	LoyverseDiscountEntity,
	LoyverseEmployeeEntity,
	LoyverseItemEntity,
	LoyverseMerchantEntity,
	LoyverseModifierEntity,
	LoyversePaymentTypeEntity,
	LoyversePosDeviceEntity,
	LoyverseStoreEntity,
	LoyverseSupplierEntity,
	LoyverseTaxEntity,
	LoyverseVariantEntity,
} from './schema/database';
