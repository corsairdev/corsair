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
import {
	Account,
	Colleagues,
	Contacts,
	CustomerFamilies,
	Customers,
	ProductFamilies,
	Products,
	PurchaseInvoices,
	Receipts,
	SaleCredits,
	SaleInvoices,
	SaleQuotes,
	Suppliers,
	WebhookSubscriptions,
} from './endpoints';
import type {
	AltovizEndpointInputs,
	AltovizEndpointOutputs,
} from './endpoints/types';
import {
	AltovizEndpointInputSchemas,
	AltovizEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AltovizSchema } from './schema';

export type AltovizPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAltovizPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof altovizEndpointsNested>;
};

export type AltovizContext = CorsairPluginContext<
	typeof AltovizSchema,
	AltovizPluginOptions
>;

export type AltovizKeyBuilderContext = KeyBuilderContext<AltovizPluginOptions>;

export type AltovizBoundEndpoints = BindEndpoints<
	typeof altovizEndpointsNested
>;

type AltovizEndpoint<K extends keyof AltovizEndpointOutputs> = CorsairEndpoint<
	AltovizContext,
	AltovizEndpointInputs[K],
	AltovizEndpointOutputs[K]
>;

export type AltovizEndpoints = {
	customers: {
		create: AltovizEndpoint<'customersCreate'>;
		update: AltovizEndpoint<'customersUpdate'>;
		delete: AltovizEndpoint<'customersDelete'>;
		get: AltovizEndpoint<'customersGet'>;
		getByInternalId: AltovizEndpoint<'customersGetByInternalId'>;
		find: AltovizEndpoint<'customersFind'>;
		list: AltovizEndpoint<'customersList'>;
		getContacts: AltovizEndpoint<'customersGetContacts'>;
	};
	customerFamilies: {
		create: AltovizEndpoint<'customerFamiliesCreate'>;
		get: AltovizEndpoint<'customerFamiliesGet'>;
		delete: AltovizEndpoint<'customerFamiliesDelete'>;
		list: AltovizEndpoint<'customerFamiliesList'>;
	};
	suppliers: {
		get: AltovizEndpoint<'suppliersGet'>;
		list: AltovizEndpoint<'suppliersList'>;
		update: AltovizEndpoint<'suppliersUpdate'>;
		delete: AltovizEndpoint<'suppliersDelete'>;
		getContacts: AltovizEndpoint<'suppliersGetContacts'>;
	};
	contacts: {
		create: AltovizEndpoint<'contactsCreate'>;
		get: AltovizEndpoint<'contactsGet'>;
		find: AltovizEndpoint<'contactsFind'>;
		list: AltovizEndpoint<'contactsList'>;
	};
	colleagues: {
		get: AltovizEndpoint<'colleaguesGet'>;
		list: AltovizEndpoint<'colleaguesList'>;
		update: AltovizEndpoint<'colleaguesUpdate'>;
		delete: AltovizEndpoint<'colleaguesDelete'>;
	};
	account: {
		getCurrentUser: AltovizEndpoint<'accountGetCurrentUser'>;
		testApiKey: AltovizEndpoint<'accountTestApiKey'>;
		getSettings: AltovizEndpoint<'accountGetSettings'>;
		getUnits: AltovizEndpoint<'accountGetUnits'>;
		getVats: AltovizEndpoint<'accountGetVats'>;
		getClassifications: AltovizEndpoint<'accountGetClassifications'>;
	};
	webhookSubscriptions: {
		list: AltovizEndpoint<'webhookSubscriptionsList'>;
		register: AltovizEndpoint<'webhookSubscriptionsRegister'>;
		unregister: AltovizEndpoint<'webhookSubscriptionsUnregister'>;
	};
	products: {
		create: AltovizEndpoint<'productsCreate'>;
		delete: AltovizEndpoint<'productsDelete'>;
		get: AltovizEndpoint<'productsGet'>;
		find: AltovizEndpoint<'productsFind'>;
		findByNumberOrId: AltovizEndpoint<'productsFindByNumberOrId'>;
	};
	productFamilies: {
		create: AltovizEndpoint<'productFamiliesCreate'>;
		get: AltovizEndpoint<'productFamiliesGet'>;
		delete: AltovizEndpoint<'productFamiliesDelete'>;
		list: AltovizEndpoint<'productFamiliesList'>;
	};
	saleInvoices: {
		create: AltovizEndpoint<'saleInvoicesCreate'>;
		get: AltovizEndpoint<'saleInvoicesGet'>;
		find: AltovizEndpoint<'saleInvoicesFind'>;
		list: AltovizEndpoint<'saleInvoicesList'>;
		delete: AltovizEndpoint<'saleInvoicesDelete'>;
		download: AltovizEndpoint<'saleInvoicesDownload'>;
	};
	saleCredits: {
		create: AltovizEndpoint<'saleCreditsCreate'>;
		update: AltovizEndpoint<'saleCreditsUpdate'>;
		get: AltovizEndpoint<'saleCreditsGet'>;
		find: AltovizEndpoint<'saleCreditsFind'>;
		list: AltovizEndpoint<'saleCreditsList'>;
		delete: AltovizEndpoint<'saleCreditsDelete'>;
		download: AltovizEndpoint<'saleCreditsDownload'>;
	};
	saleQuotes: {
		find: AltovizEndpoint<'saleQuotesFind'>;
		list: AltovizEndpoint<'saleQuotesList'>;
		delete: AltovizEndpoint<'saleQuotesDelete'>;
	};
	receipts: {
		create: AltovizEndpoint<'receiptsCreate'>;
		update: AltovizEndpoint<'receiptsUpdate'>;
		get: AltovizEndpoint<'receiptsGet'>;
		find: AltovizEndpoint<'receiptsFind'>;
		list: AltovizEndpoint<'receiptsList'>;
		delete: AltovizEndpoint<'receiptsDelete'>;
	};
	purchaseInvoices: {
		upload: AltovizEndpoint<'purchaseInvoicesUpload'>;
		download: AltovizEndpoint<'purchaseInvoicesDownload'>;
	};
};

const altovizEndpointsNested = {
	customers: Customers,
	customerFamilies: CustomerFamilies,
	suppliers: Suppliers,
	contacts: Contacts,
	colleagues: Colleagues,
	account: Account,
	webhookSubscriptions: WebhookSubscriptions,
	products: Products,
	productFamilies: ProductFamilies,
	saleInvoices: SaleInvoices,
	saleCredits: SaleCredits,
	saleQuotes: SaleQuotes,
	receipts: Receipts,
	purchaseInvoices: PurchaseInvoices,
} as const;

export const altovizEndpointSchemas = {
	'customers.create': {
		input: AltovizEndpointInputSchemas.customersCreate,
		output: AltovizEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: AltovizEndpointInputSchemas.customersUpdate,
		output: AltovizEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: AltovizEndpointInputSchemas.customersDelete,
		output: AltovizEndpointOutputSchemas.customersDelete,
	},
	'customers.get': {
		input: AltovizEndpointInputSchemas.customersGet,
		output: AltovizEndpointOutputSchemas.customersGet,
	},
	'customers.getByInternalId': {
		input: AltovizEndpointInputSchemas.customersGetByInternalId,
		output: AltovizEndpointOutputSchemas.customersGetByInternalId,
	},
	'customers.find': {
		input: AltovizEndpointInputSchemas.customersFind,
		output: AltovizEndpointOutputSchemas.customersFind,
	},
	'customers.list': {
		input: AltovizEndpointInputSchemas.customersList,
		output: AltovizEndpointOutputSchemas.customersList,
	},
	'customers.getContacts': {
		input: AltovizEndpointInputSchemas.customersGetContacts,
		output: AltovizEndpointOutputSchemas.customersGetContacts,
	},

	'customerFamilies.create': {
		input: AltovizEndpointInputSchemas.customerFamiliesCreate,
		output: AltovizEndpointOutputSchemas.customerFamiliesCreate,
	},
	'customerFamilies.get': {
		input: AltovizEndpointInputSchemas.customerFamiliesGet,
		output: AltovizEndpointOutputSchemas.customerFamiliesGet,
	},
	'customerFamilies.delete': {
		input: AltovizEndpointInputSchemas.customerFamiliesDelete,
		output: AltovizEndpointOutputSchemas.customerFamiliesDelete,
	},
	'customerFamilies.list': {
		input: AltovizEndpointInputSchemas.customerFamiliesList,
		output: AltovizEndpointOutputSchemas.customerFamiliesList,
	},

	'suppliers.get': {
		input: AltovizEndpointInputSchemas.suppliersGet,
		output: AltovizEndpointOutputSchemas.suppliersGet,
	},
	'suppliers.list': {
		input: AltovizEndpointInputSchemas.suppliersList,
		output: AltovizEndpointOutputSchemas.suppliersList,
	},
	'suppliers.update': {
		input: AltovizEndpointInputSchemas.suppliersUpdate,
		output: AltovizEndpointOutputSchemas.suppliersUpdate,
	},
	'suppliers.delete': {
		input: AltovizEndpointInputSchemas.suppliersDelete,
		output: AltovizEndpointOutputSchemas.suppliersDelete,
	},
	'suppliers.getContacts': {
		input: AltovizEndpointInputSchemas.suppliersGetContacts,
		output: AltovizEndpointOutputSchemas.suppliersGetContacts,
	},

	'contacts.create': {
		input: AltovizEndpointInputSchemas.contactsCreate,
		output: AltovizEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: AltovizEndpointInputSchemas.contactsGet,
		output: AltovizEndpointOutputSchemas.contactsGet,
	},
	'contacts.find': {
		input: AltovizEndpointInputSchemas.contactsFind,
		output: AltovizEndpointOutputSchemas.contactsFind,
	},
	'contacts.list': {
		input: AltovizEndpointInputSchemas.contactsList,
		output: AltovizEndpointOutputSchemas.contactsList,
	},

	'colleagues.get': {
		input: AltovizEndpointInputSchemas.colleaguesGet,
		output: AltovizEndpointOutputSchemas.colleaguesGet,
	},
	'colleagues.list': {
		input: AltovizEndpointInputSchemas.colleaguesList,
		output: AltovizEndpointOutputSchemas.colleaguesList,
	},
	'colleagues.update': {
		input: AltovizEndpointInputSchemas.colleaguesUpdate,
		output: AltovizEndpointOutputSchemas.colleaguesUpdate,
	},
	'colleagues.delete': {
		input: AltovizEndpointInputSchemas.colleaguesDelete,
		output: AltovizEndpointOutputSchemas.colleaguesDelete,
	},

	'account.getCurrentUser': {
		input: AltovizEndpointInputSchemas.accountGetCurrentUser,
		output: AltovizEndpointOutputSchemas.accountGetCurrentUser,
	},
	'account.testApiKey': {
		input: AltovizEndpointInputSchemas.accountTestApiKey,
		output: AltovizEndpointOutputSchemas.accountTestApiKey,
	},
	'account.getSettings': {
		input: AltovizEndpointInputSchemas.accountGetSettings,
		output: AltovizEndpointOutputSchemas.accountGetSettings,
	},
	'account.getUnits': {
		input: AltovizEndpointInputSchemas.accountGetUnits,
		output: AltovizEndpointOutputSchemas.accountGetUnits,
	},
	'account.getVats': {
		input: AltovizEndpointInputSchemas.accountGetVats,
		output: AltovizEndpointOutputSchemas.accountGetVats,
	},
	'account.getClassifications': {
		input: AltovizEndpointInputSchemas.accountGetClassifications,
		output: AltovizEndpointOutputSchemas.accountGetClassifications,
	},

	'webhookSubscriptions.list': {
		input: AltovizEndpointInputSchemas.webhookSubscriptionsList,
		output: AltovizEndpointOutputSchemas.webhookSubscriptionsList,
	},
	'webhookSubscriptions.register': {
		input: AltovizEndpointInputSchemas.webhookSubscriptionsRegister,
		output: AltovizEndpointOutputSchemas.webhookSubscriptionsRegister,
	},
	'webhookSubscriptions.unregister': {
		input: AltovizEndpointInputSchemas.webhookSubscriptionsUnregister,
		output: AltovizEndpointOutputSchemas.webhookSubscriptionsUnregister,
	},

	'products.create': {
		input: AltovizEndpointInputSchemas.productsCreate,
		output: AltovizEndpointOutputSchemas.productsCreate,
	},
	'products.delete': {
		input: AltovizEndpointInputSchemas.productsDelete,
		output: AltovizEndpointOutputSchemas.productsDelete,
	},
	'products.get': {
		input: AltovizEndpointInputSchemas.productsGet,
		output: AltovizEndpointOutputSchemas.productsGet,
	},
	'products.find': {
		input: AltovizEndpointInputSchemas.productsFind,
		output: AltovizEndpointOutputSchemas.productsFind,
	},
	'products.findByNumberOrId': {
		input: AltovizEndpointInputSchemas.productsFindByNumberOrId,
		output: AltovizEndpointOutputSchemas.productsFindByNumberOrId,
	},

	'productFamilies.create': {
		input: AltovizEndpointInputSchemas.productFamiliesCreate,
		output: AltovizEndpointOutputSchemas.productFamiliesCreate,
	},
	'productFamilies.get': {
		input: AltovizEndpointInputSchemas.productFamiliesGet,
		output: AltovizEndpointOutputSchemas.productFamiliesGet,
	},
	'productFamilies.delete': {
		input: AltovizEndpointInputSchemas.productFamiliesDelete,
		output: AltovizEndpointOutputSchemas.productFamiliesDelete,
	},
	'productFamilies.list': {
		input: AltovizEndpointInputSchemas.productFamiliesList,
		output: AltovizEndpointOutputSchemas.productFamiliesList,
	},

	'saleInvoices.create': {
		input: AltovizEndpointInputSchemas.saleInvoicesCreate,
		output: AltovizEndpointOutputSchemas.saleInvoicesCreate,
	},
	'saleInvoices.get': {
		input: AltovizEndpointInputSchemas.saleInvoicesGet,
		output: AltovizEndpointOutputSchemas.saleInvoicesGet,
	},
	'saleInvoices.find': {
		input: AltovizEndpointInputSchemas.saleInvoicesFind,
		output: AltovizEndpointOutputSchemas.saleInvoicesFind,
	},
	'saleInvoices.list': {
		input: AltovizEndpointInputSchemas.saleInvoicesList,
		output: AltovizEndpointOutputSchemas.saleInvoicesList,
	},
	'saleInvoices.delete': {
		input: AltovizEndpointInputSchemas.saleInvoicesDelete,
		output: AltovizEndpointOutputSchemas.saleInvoicesDelete,
	},
	'saleInvoices.download': {
		input: AltovizEndpointInputSchemas.saleInvoicesDownload,
		output: AltovizEndpointOutputSchemas.saleInvoicesDownload,
	},

	'saleCredits.create': {
		input: AltovizEndpointInputSchemas.saleCreditsCreate,
		output: AltovizEndpointOutputSchemas.saleCreditsCreate,
	},
	'saleCredits.update': {
		input: AltovizEndpointInputSchemas.saleCreditsUpdate,
		output: AltovizEndpointOutputSchemas.saleCreditsUpdate,
	},
	'saleCredits.get': {
		input: AltovizEndpointInputSchemas.saleCreditsGet,
		output: AltovizEndpointOutputSchemas.saleCreditsGet,
	},
	'saleCredits.find': {
		input: AltovizEndpointInputSchemas.saleCreditsFind,
		output: AltovizEndpointOutputSchemas.saleCreditsFind,
	},
	'saleCredits.list': {
		input: AltovizEndpointInputSchemas.saleCreditsList,
		output: AltovizEndpointOutputSchemas.saleCreditsList,
	},
	'saleCredits.delete': {
		input: AltovizEndpointInputSchemas.saleCreditsDelete,
		output: AltovizEndpointOutputSchemas.saleCreditsDelete,
	},
	'saleCredits.download': {
		input: AltovizEndpointInputSchemas.saleCreditsDownload,
		output: AltovizEndpointOutputSchemas.saleCreditsDownload,
	},

	'saleQuotes.find': {
		input: AltovizEndpointInputSchemas.saleQuotesFind,
		output: AltovizEndpointOutputSchemas.saleQuotesFind,
	},
	'saleQuotes.list': {
		input: AltovizEndpointInputSchemas.saleQuotesList,
		output: AltovizEndpointOutputSchemas.saleQuotesList,
	},
	'saleQuotes.delete': {
		input: AltovizEndpointInputSchemas.saleQuotesDelete,
		output: AltovizEndpointOutputSchemas.saleQuotesDelete,
	},

	'receipts.create': {
		input: AltovizEndpointInputSchemas.receiptsCreate,
		output: AltovizEndpointOutputSchemas.receiptsCreate,
	},
	'receipts.update': {
		input: AltovizEndpointInputSchemas.receiptsUpdate,
		output: AltovizEndpointOutputSchemas.receiptsUpdate,
	},
	'receipts.get': {
		input: AltovizEndpointInputSchemas.receiptsGet,
		output: AltovizEndpointOutputSchemas.receiptsGet,
	},
	'receipts.find': {
		input: AltovizEndpointInputSchemas.receiptsFind,
		output: AltovizEndpointOutputSchemas.receiptsFind,
	},
	'receipts.list': {
		input: AltovizEndpointInputSchemas.receiptsList,
		output: AltovizEndpointOutputSchemas.receiptsList,
	},
	'receipts.delete': {
		input: AltovizEndpointInputSchemas.receiptsDelete,
		output: AltovizEndpointOutputSchemas.receiptsDelete,
	},

	'purchaseInvoices.upload': {
		input: AltovizEndpointInputSchemas.purchaseInvoicesUpload,
		output: AltovizEndpointOutputSchemas.purchaseInvoicesUpload,
	},
	'purchaseInvoices.download': {
		input: AltovizEndpointInputSchemas.purchaseInvoicesDownload,
		output: AltovizEndpointOutputSchemas.purchaseInvoicesDownload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof altovizEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const altovizEndpointMeta = {
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer. type is Business | Consumer | Government - NOT the Company/Individual the catalog description documents.',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update a customer. Read-modify-write internally, because Altoviz PUT clears any field the caller omits.',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a customer. Evicts the auto-created contact from the mirror if one is cached.',
	},
	'customers.get': { riskLevel: 'read', description: 'Get a customer by id' },
	'customers.getByInternalId': {
		riskLevel: 'read',
		description: 'Get a customer by the caller-supplied internalId',
	},
	'customers.find': {
		riskLevel: 'read',
		description:
			'Find customers by email, internalId or number - returns an array, possibly empty',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers, paged (PageIndex is 1-based)',
	},
	'customers.getContacts': {
		riskLevel: 'read',
		description:
			"List a customer's contacts, including the one auto-created when the customer was created",
	},

	'customerFamilies.create': {
		riskLevel: 'write',
		description: 'Create a customer family (segment)',
	},
	'customerFamilies.get': {
		riskLevel: 'read',
		description: 'Get a customer family by id',
	},
	'customerFamilies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a customer family. Refused with a conflict if it still has members - it does not cascade.',
	},
	'customerFamilies.list': {
		riskLevel: 'read',
		description: 'List customer families, paged',
	},

	'suppliers.get': { riskLevel: 'read', description: 'Get a supplier by id' },
	'suppliers.list': { riskLevel: 'read', description: 'List suppliers, paged' },
	'suppliers.update': {
		riskLevel: 'write',
		description:
			'Update a supplier. Read-modify-write internally, same clearing-PUT behaviour as customers.',
	},
	'suppliers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a supplier. Evicts the auto-created contact from the mirror if one is cached.',
	},
	'suppliers.getContacts': {
		riskLevel: 'read',
		description: "List a supplier's contacts",
	},

	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a standalone contact. There is no customerId field on this route - it cannot be attached to a customer here.',
	},
	'contacts.get': { riskLevel: 'read', description: 'Get a contact by id' },
	'contacts.find': {
		riskLevel: 'read',
		description:
			'Find contacts by email or internalId - returns an array, possibly empty',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts, paged. Includes shadow contacts auto-created by customer/supplier/colleague writes.',
	},

	'colleagues.get': { riskLevel: 'read', description: 'Get a colleague by id' },
	'colleagues.list': {
		riskLevel: 'read',
		description: 'List colleagues, paged',
	},
	'colleagues.update': {
		riskLevel: 'write',
		description:
			'Update a colleague. Read-modify-write internally - a partial body is a 500 on this route, not just a clearing PUT.',
	},
	'colleagues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a colleague',
	},

	'account.getCurrentUser': {
		riskLevel: 'read',
		description: 'Get the authenticated user',
	},
	'account.testApiKey': {
		riskLevel: 'read',
		description:
			'Verify the API key and get the account identity - takes no parameters',
	},
	'account.getSettings': {
		riskLevel: 'read',
		description:
			'Get accounting, company, emailing, sales, social and VAT settings',
	},
	'account.getUnits': {
		riskLevel: 'read',
		description: 'List measurement units - reference data, mirrored',
	},
	'account.getVats': {
		riskLevel: 'read',
		description: 'List VAT rates - reference data, mirrored',
	},
	'account.getClassifications': {
		riskLevel: 'read',
		description:
			'List accounting classifications, optionally filtered by type (Sale | Expense | Other)',
	},

	'webhookSubscriptions.list': {
		riskLevel: 'read',
		description: 'List registered webhook subscriptions',
	},
	'webhookSubscriptions.register': {
		riskLevel: 'write',
		description:
			'Register a webhook subscription. The response id is 0 - list immediately after to get the real id.',
	},
	'webhookSubscriptions.unregister': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unregister a webhook subscription by id or url. Exactly one of the two is required.',
	},

	'products.create': {
		riskLevel: 'write',
		description:
			'Create a product. unit/vat/family are resolved from an id to their value form before the request is sent.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a product',
	},
	'products.get': { riskLevel: 'read', description: 'Get a product by id' },
	'products.find': {
		riskLevel: 'read',
		description: 'Find a product by number - returns an array',
	},
	'products.findByNumberOrId': {
		riskLevel: 'read',
		description:
			'Find a product by number or internalId - same route as products.find, superset of parameters',
	},

	'productFamilies.create': {
		riskLevel: 'write',
		description: 'Create a product family',
	},
	'productFamilies.get': {
		riskLevel: 'read',
		description: 'Get a product family by id',
	},
	'productFamilies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a product family. Refused with a conflict if it still has members.',
	},
	'productFamilies.list': {
		riskLevel: 'read',
		description: 'List product families, paged',
	},

	'saleInvoices.create': {
		riskLevel: 'write',
		description:
			'Create a draft sale invoice. Lines use taxExcludedPrice, never unitPrice - unitPrice is silently ignored and prices the line at zero.',
	},
	'saleInvoices.get': {
		riskLevel: 'read',
		description: 'Get a sale invoice by id',
	},
	'saleInvoices.find': {
		riskLevel: 'read',
		description: 'Find sale invoices by internalId - returns an array',
	},
	'saleInvoices.list': {
		riskLevel: 'read',
		description:
			'List sale invoices, paged, filterable by date range, customer and status',
	},
	'saleInvoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a draft sale invoice. Drafts only.',
	},
	'saleInvoices.download': {
		riskLevel: 'read',
		description:
			'Download a sale invoice as PDF. May not be byte-exact - see the core text-decoding note.',
	},

	'saleCredits.create': {
		riskLevel: 'write',
		description: 'Create a draft credit note (avoir)',
	},
	'saleCredits.update': {
		riskLevel: 'write',
		description:
			'Update a draft credit note. Drafts only; lines must be resent in full or the credit is emptied.',
	},
	'saleCredits.get': {
		riskLevel: 'read',
		description: 'Get a sale credit by id',
	},
	'saleCredits.find': {
		riskLevel: 'read',
		description: 'Find sale credits by internalId - returns an array',
	},
	'saleCredits.list': {
		riskLevel: 'read',
		description:
			'List sale credits, paged, filterable by date range and customer',
	},
	'saleCredits.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a draft sale credit. Drafts only.',
	},
	'saleCredits.download': {
		riskLevel: 'read',
		description:
			'Download a sale credit as PDF. May not be byte-exact - see the core text-decoding note.',
	},

	'saleQuotes.find': {
		riskLevel: 'read',
		description: 'Find sale quotes by internalId - returns an array',
	},
	'saleQuotes.list': {
		riskLevel: 'read',
		description:
			'List sale quotes, paged, filterable by date range and customer. No working status filter - the spec one is a generator artefact.',
	},
	'saleQuotes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a sale quote. Deleting a quote that does not exist also returns 200.',
	},

	'receipts.create': {
		riskLevel: 'write',
		description:
			'Create a receipt. links to a draft document are refused - the document must be finalized first, which is outside this plugin.',
	},
	'receipts.update': {
		riskLevel: 'write',
		description:
			'Update a receipt. Read-modify-write internally; a customer reference is required even on update.',
	},
	'receipts.get': { riskLevel: 'read', description: 'Get a receipt by id' },
	'receipts.find': {
		riskLevel: 'read',
		description:
			"Find receipts by the receipt's own internalId - returns an array",
	},
	'receipts.list': { riskLevel: 'read', description: 'List receipts, paged' },
	'receipts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a receipt',
	},

	'purchaseInvoices.upload': {
		riskLevel: 'write',
		description:
			'Upload a purchase invoice file (PDF or image). There is no delete for this anywhere in the API - only the Altoviz UI can remove it.',
	},
	'purchaseInvoices.download': {
		riskLevel: 'read',
		description: 'Download a purchase invoice as PDF',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof altovizEndpointsNested>;

export const altovizAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAltovizPlugin<T extends AltovizPluginOptions> = CorsairPlugin<
	'altoviz',
	typeof AltovizSchema,
	typeof altovizEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAltovizPlugin = BaseAltovizPlugin<AltovizPluginOptions>;

export type ExternalAltovizPlugin<T extends AltovizPluginOptions> =
	BaseAltovizPlugin<T>;

/**
 * Builds the Altoviz plugin.
 *
 * A single API key in the `X-API-KEY` header is the entire auth surface - no
 * OAuth, no tenant subdomain, no second credential - so `api_key: {}` and
 * `ctx.keys.get_api_key()` are all this plugin needs. A missing key raises
 * `AuthMissingError` rather than sending an empty header, which the provider
 * would answer with a 401 carrying a completely empty body - unhelpful for
 * diagnosing a configuration gap.
 */
export function altoviz<const T extends AltovizPluginOptions>(
	incomingOptions: AltovizPluginOptions & T = {} as AltovizPluginOptions & T,
): ExternalAltovizPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'altoviz',
		schema: AltovizSchema,
		options,
		authConfig: altovizAuthConfig,
		hooks: options.hooks,
		endpoints: altovizEndpointsNested,
		webhooks: {},
		endpointMeta: altovizEndpointMeta,
		endpointSchemas: altovizEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AltovizKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[ALTOVIZ] API key missing - connect Altoviz or pass key in plugin options.',
					);
					throw new AuthMissingError('altoviz', 'api_key');
				}
				return res;
			}

			console.error(
				'[ALTOVIZ] Authentication required for Altoviz API requests.',
			);
			throw new AuthMissingError('altoviz', 'api_key');
		},
	} satisfies InternalAltovizPlugin;
}

export type {
	AltovizEndpointInputs,
	AltovizEndpointOutputs,
} from './endpoints/types';
export { altovizEndpointsNested };
