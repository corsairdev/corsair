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
	Accounts,
	Assets,
	Attachments,
	BankTransactions,
	Budgets,
	Connections,
	Contacts,
	CreditNotes,
	Files,
	Invoices,
	Items,
	Journals,
	ManualJournals,
	Organisations,
	Payments,
	Projects,
	PurchaseOrders,
	Quotes,
	Reports,
	TaxRates,
	TrackingCategories,
} from './endpoints';
import type {
	XeroEndpointInputs,
	XeroEndpointOutputs,
} from './endpoints/types';
import {
	XeroEndpointInputSchemas,
	XeroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { XeroSchema } from './schema';
import { ContactWebhooks, eventWebhook, InvoiceWebhooks } from './webhooks';
import { resolveXeroOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchXeroTenantWebhook } from './webhooks/tenant-matcher';
import type {
	XeroContactEvent,
	XeroGenericEvent,
	XeroInvoiceEvent,
	XeroWebhookOutputs,
} from './webhooks/types';
import {
	XeroContactEventSchema,
	XeroGenericEventSchema,
	XeroInvoiceEventSchema,
} from './webhooks/types';

export type XeroPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	tenantId?: string;
	webhookSecret?: string;
	hooks?: InternalXeroPlugin['hooks'];
	webhookHooks?: InternalXeroPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof xeroEndpointsNested>;
};

export type XeroContext = CorsairPluginContext<
	typeof XeroSchema,
	XeroPluginOptions
>;

export type XeroKeyBuilderContext = KeyBuilderContext<XeroPluginOptions>;

export type XeroBoundEndpoints = BindEndpoints<typeof xeroEndpointsNested>;

type XeroEndpoint<K extends keyof XeroEndpointOutputs> = CorsairEndpoint<
	XeroContext,
	XeroEndpointInputs[K],
	XeroEndpointOutputs[K]
>;

export type XeroEndpoints = {
	bankTransactionsCreate: XeroEndpoint<'bankTransactionsCreate'>;
	bankTransactionsList: XeroEndpoint<'bankTransactionsList'>;
	contactsCreate: XeroEndpoint<'contactsCreate'>;
	contactsList: XeroEndpoint<'contactsList'>;
	contactsUpdate: XeroEndpoint<'contactsUpdate'>;
	invoicesCreate: XeroEndpoint<'invoicesCreate'>;
	invoicesGet: XeroEndpoint<'invoicesGet'>;
	invoicesList: XeroEndpoint<'invoicesList'>;
	invoicesUpdate: XeroEndpoint<'invoicesUpdate'>;
	itemsCreate: XeroEndpoint<'itemsCreate'>;
	itemsGet: XeroEndpoint<'itemsGet'>;
	itemsList: XeroEndpoint<'itemsList'>;
	paymentsCreate: XeroEndpoint<'paymentsCreate'>;
	paymentsList: XeroEndpoint<'paymentsList'>;
	purchaseOrdersCreate: XeroEndpoint<'purchaseOrdersCreate'>;
	purchaseOrdersGet: XeroEndpoint<'purchaseOrdersGet'>;
	purchaseOrdersList: XeroEndpoint<'purchaseOrdersList'>;
	accountsGet: XeroEndpoint<'accountsGet'>;
	accountsList: XeroEndpoint<'accountsList'>;
	assetsGet: XeroEndpoint<'assetsGet'>;
	assetsList: XeroEndpoint<'assetsList'>;
	reportsGetBalanceSheet: XeroEndpoint<'reportsGetBalanceSheet'>;
	reportsGetProfitLoss: XeroEndpoint<'reportsGetProfitLoss'>;
	budgetsGet: XeroEndpoint<'budgetsGet'>;
	connectionsGet: XeroEndpoint<'connectionsGet'>;
	manualJournalsGet: XeroEndpoint<'manualJournalsGet'>;
	manualJournalsList: XeroEndpoint<'manualJournalsList'>;
	organisationsGet: XeroEndpoint<'organisationsGet'>;
	projectsGet: XeroEndpoint<'projectsGet'>;
	projectsList: XeroEndpoint<'projectsList'>;
	quotesList: XeroEndpoint<'quotesList'>;
	attachmentsList: XeroEndpoint<'attachmentsList'>;
	attachmentsUpload: XeroEndpoint<'attachmentsUpload'>;
	creditNotesList: XeroEndpoint<'creditNotesList'>;
	filesList: XeroEndpoint<'filesList'>;
	filesListFolders: XeroEndpoint<'filesListFolders'>;
	journalsList: XeroEndpoint<'journalsList'>;
	taxRatesList: XeroEndpoint<'taxRatesList'>;
	trackingCategoriesList: XeroEndpoint<'trackingCategoriesList'>;
};

type XeroWebhook<K extends keyof XeroWebhookOutputs, TEvent> = CorsairWebhook<
	XeroContext,
	TEvent,
	XeroWebhookOutputs[K]
>;

export type XeroWebhooks = {
	invoiceCreated: XeroWebhook<'invoiceCreated', XeroInvoiceEvent>;
	invoiceUpdated: XeroWebhook<'invoiceUpdated', XeroInvoiceEvent>;
	contactCreated: XeroWebhook<'contactCreated', XeroContactEvent>;
	contactUpdated: XeroWebhook<'contactUpdated', XeroContactEvent>;
	event: XeroWebhook<'event', XeroGenericEvent>;
};

export type XeroBoundWebhooks = BindWebhooks<XeroWebhooks>;

const xeroEndpointsNested = {
	bankTransactions: {
		create: BankTransactions.create,
		list: BankTransactions.list,
	},
	contacts: {
		create: Contacts.create,
		list: Contacts.list,
		update: Contacts.update,
	},
	invoices: {
		create: Invoices.create,
		get: Invoices.get,
		list: Invoices.list,
		update: Invoices.update,
	},
	items: {
		create: Items.create,
		get: Items.get,
		list: Items.list,
	},
	payments: {
		create: Payments.create,
		list: Payments.list,
	},
	purchaseOrders: {
		create: PurchaseOrders.create,
		get: PurchaseOrders.get,
		list: PurchaseOrders.list,
	},
	accounts: {
		get: Accounts.get,
		list: Accounts.list,
	},
	assets: {
		get: Assets.get,
		list: Assets.list,
	},
	reports: {
		getBalanceSheet: Reports.getBalanceSheet,
		getProfitLoss: Reports.getProfitLoss,
	},
	budgets: {
		get: Budgets.get,
	},
	connections: {
		get: Connections.get,
	},
	manualJournals: {
		get: ManualJournals.get,
		list: ManualJournals.list,
	},
	organisations: {
		get: Organisations.get,
	},
	projects: {
		get: Projects.get,
		list: Projects.list,
	},
	quotes: {
		list: Quotes.list,
	},
	attachments: {
		list: Attachments.list,
		upload: Attachments.upload,
	},
	creditNotes: {
		list: CreditNotes.list,
	},
	files: {
		list: Files.list,
		listFolders: Files.listFolders,
	},
	journals: {
		list: Journals.list,
	},
	taxRates: {
		list: TaxRates.list,
	},
	trackingCategories: {
		list: TrackingCategories.list,
	},
} as const;

const xeroWebhooksNested = {
	invoices: {
		created: InvoiceWebhooks.created,
		updated: InvoiceWebhooks.updated,
	},
	contacts: {
		created: ContactWebhooks.created,
		updated: ContactWebhooks.updated,
	},
	event: {
		event: eventWebhook,
	},
} as const;

export const xeroEndpointSchemas = {
	'bankTransactions.create': {
		input: XeroEndpointInputSchemas.bankTransactionsCreate,
		output: XeroEndpointOutputSchemas.bankTransactionsCreate,
	},
	'bankTransactions.list': {
		input: XeroEndpointInputSchemas.bankTransactionsList,
		output: XeroEndpointOutputSchemas.bankTransactionsList,
	},
	'contacts.create': {
		input: XeroEndpointInputSchemas.contactsCreate,
		output: XeroEndpointOutputSchemas.contactsCreate,
	},
	'contacts.list': {
		input: XeroEndpointInputSchemas.contactsList,
		output: XeroEndpointOutputSchemas.contactsList,
	},
	'contacts.update': {
		input: XeroEndpointInputSchemas.contactsUpdate,
		output: XeroEndpointOutputSchemas.contactsUpdate,
	},
	'invoices.create': {
		input: XeroEndpointInputSchemas.invoicesCreate,
		output: XeroEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.get': {
		input: XeroEndpointInputSchemas.invoicesGet,
		output: XeroEndpointOutputSchemas.invoicesGet,
	},
	'invoices.list': {
		input: XeroEndpointInputSchemas.invoicesList,
		output: XeroEndpointOutputSchemas.invoicesList,
	},
	'invoices.update': {
		input: XeroEndpointInputSchemas.invoicesUpdate,
		output: XeroEndpointOutputSchemas.invoicesUpdate,
	},
	'items.create': {
		input: XeroEndpointInputSchemas.itemsCreate,
		output: XeroEndpointOutputSchemas.itemsCreate,
	},
	'items.get': {
		input: XeroEndpointInputSchemas.itemsGet,
		output: XeroEndpointOutputSchemas.itemsGet,
	},
	'items.list': {
		input: XeroEndpointInputSchemas.itemsList,
		output: XeroEndpointOutputSchemas.itemsList,
	},
	'payments.create': {
		input: XeroEndpointInputSchemas.paymentsCreate,
		output: XeroEndpointOutputSchemas.paymentsCreate,
	},
	'payments.list': {
		input: XeroEndpointInputSchemas.paymentsList,
		output: XeroEndpointOutputSchemas.paymentsList,
	},
	'purchaseOrders.create': {
		input: XeroEndpointInputSchemas.purchaseOrdersCreate,
		output: XeroEndpointOutputSchemas.purchaseOrdersCreate,
	},
	'purchaseOrders.get': {
		input: XeroEndpointInputSchemas.purchaseOrdersGet,
		output: XeroEndpointOutputSchemas.purchaseOrdersGet,
	},
	'purchaseOrders.list': {
		input: XeroEndpointInputSchemas.purchaseOrdersList,
		output: XeroEndpointOutputSchemas.purchaseOrdersList,
	},
	'accounts.get': {
		input: XeroEndpointInputSchemas.accountsGet,
		output: XeroEndpointOutputSchemas.accountsGet,
	},
	'accounts.list': {
		input: XeroEndpointInputSchemas.accountsList,
		output: XeroEndpointOutputSchemas.accountsList,
	},
	'assets.get': {
		input: XeroEndpointInputSchemas.assetsGet,
		output: XeroEndpointOutputSchemas.assetsGet,
	},
	'assets.list': {
		input: XeroEndpointInputSchemas.assetsList,
		output: XeroEndpointOutputSchemas.assetsList,
	},
	'reports.getBalanceSheet': {
		input: XeroEndpointInputSchemas.reportsGetBalanceSheet,
		output: XeroEndpointOutputSchemas.reportsGetBalanceSheet,
	},
	'reports.getProfitLoss': {
		input: XeroEndpointInputSchemas.reportsGetProfitLoss,
		output: XeroEndpointOutputSchemas.reportsGetProfitLoss,
	},
	'budgets.get': {
		input: XeroEndpointInputSchemas.budgetsGet,
		output: XeroEndpointOutputSchemas.budgetsGet,
	},
	'connections.get': {
		input: XeroEndpointInputSchemas.connectionsGet,
		output: XeroEndpointOutputSchemas.connectionsGet,
	},
	'manualJournals.get': {
		input: XeroEndpointInputSchemas.manualJournalsGet,
		output: XeroEndpointOutputSchemas.manualJournalsGet,
	},
	'manualJournals.list': {
		input: XeroEndpointInputSchemas.manualJournalsList,
		output: XeroEndpointOutputSchemas.manualJournalsList,
	},
	'organisations.get': {
		input: XeroEndpointInputSchemas.organisationsGet,
		output: XeroEndpointOutputSchemas.organisationsGet,
	},
	'projects.get': {
		input: XeroEndpointInputSchemas.projectsGet,
		output: XeroEndpointOutputSchemas.projectsGet,
	},
	'projects.list': {
		input: XeroEndpointInputSchemas.projectsList,
		output: XeroEndpointOutputSchemas.projectsList,
	},
	'quotes.list': {
		input: XeroEndpointInputSchemas.quotesList,
		output: XeroEndpointOutputSchemas.quotesList,
	},
	'attachments.list': {
		input: XeroEndpointInputSchemas.attachmentsList,
		output: XeroEndpointOutputSchemas.attachmentsList,
	},
	'attachments.upload': {
		input: XeroEndpointInputSchemas.attachmentsUpload,
		output: XeroEndpointOutputSchemas.attachmentsUpload,
	},
	'creditNotes.list': {
		input: XeroEndpointInputSchemas.creditNotesList,
		output: XeroEndpointOutputSchemas.creditNotesList,
	},
	'files.list': {
		input: XeroEndpointInputSchemas.filesList,
		output: XeroEndpointOutputSchemas.filesList,
	},
	'files.listFolders': {
		input: XeroEndpointInputSchemas.filesListFolders,
		output: XeroEndpointOutputSchemas.filesListFolders,
	},
	'journals.list': {
		input: XeroEndpointInputSchemas.journalsList,
		output: XeroEndpointOutputSchemas.journalsList,
	},
	'taxRates.list': {
		input: XeroEndpointInputSchemas.taxRatesList,
		output: XeroEndpointOutputSchemas.taxRatesList,
	},
	'trackingCategories.list': {
		input: XeroEndpointInputSchemas.trackingCategoriesList,
		output: XeroEndpointOutputSchemas.trackingCategoriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof xeroEndpointsNested>;

const xeroWebhookSchemas = {
	'invoices.created': {
		description: 'Xero invoice created event',
		payload: XeroInvoiceEventSchema,
		response: XeroInvoiceEventSchema,
	},
	'invoices.updated': {
		description: 'Xero invoice updated event',
		payload: XeroInvoiceEventSchema,
		response: XeroInvoiceEventSchema,
	},
	'contacts.created': {
		description: 'Xero contact created event',
		payload: XeroContactEventSchema,
		response: XeroContactEventSchema,
	},
	'contacts.updated': {
		description: 'Xero contact updated event',
		payload: XeroContactEventSchema,
		response: XeroContactEventSchema,
	},
	'event.event': {
		description: 'Xero webhook general event',
		payload: XeroGenericEventSchema,
		response: XeroGenericEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof xeroWebhooksNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const xeroEndpointMeta = {
	'bankTransactions.create': {
		riskLevel: 'write',
		description: 'Create a bank transaction in Xero (SPEND or RECEIVE)',
	},
	'bankTransactions.list': {
		riskLevel: 'read',
		description: 'Retrieve bank transactions from Xero',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact in Xero',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of contacts from Xero',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact in Xero',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create a new invoice in Xero (sales invoice or bill)',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific invoice by ID from Xero',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of invoices from Xero',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an existing invoice in Xero',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create an inventory item in Xero',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific item by ID from Xero',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'Retrieve items (inventory/products) from Xero',
	},
	'payments.create': {
		riskLevel: 'write',
		description: 'Create a payment linking invoice and bank account in Xero',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'Retrieve list of payments from Xero',
	},
	'purchaseOrders.create': {
		riskLevel: 'write',
		description: 'Create a purchase order in Xero',
	},
	'purchaseOrders.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific purchase order by ID from Xero',
	},
	'purchaseOrders.list': {
		riskLevel: 'read',
		description: 'Retrieve list of purchase orders from Xero',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific account from Xero chart of accounts',
	},
	'accounts.list': {
		riskLevel: 'read',
		description: 'Retrieve chart of accounts from Xero',
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific asset by ID from Xero',
	},
	'assets.list': {
		riskLevel: 'read',
		description: 'Retrieve fixed assets from Xero',
	},
	'reports.getBalanceSheet': {
		riskLevel: 'read',
		description: 'Retrieve Balance Sheet report from Xero',
	},
	'reports.getProfitLoss': {
		riskLevel: 'read',
		description: 'Retrieve Profit & Loss report from Xero',
	},
	'budgets.get': {
		riskLevel: 'read',
		description: 'Retrieve a budget from Xero',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'List active Xero tenant connections',
	},
	'manualJournals.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific manual journal by ID from Xero',
	},
	'manualJournals.list': {
		riskLevel: 'read',
		description: 'Retrieve manual journals from Xero',
	},
	'organisations.get': {
		riskLevel: 'read',
		description: 'Retrieve organisation details from Xero',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific project by ID from Xero',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'Retrieve projects from Xero',
	},
	'quotes.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of quotes from Xero',
	},
	'attachments.list': {
		riskLevel: 'read',
		description: 'List all attachments for a specific entity in Xero',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description: 'Upload a file attachment to a Xero entity',
	},
	'creditNotes.list': {
		riskLevel: 'read',
		description: 'Retrieve list of credit notes from Xero',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'Retrieve files from Xero Files',
	},
	'files.listFolders': {
		riskLevel: 'read',
		description: 'Retrieve folders from Xero Files',
	},
	'journals.list': {
		riskLevel: 'read',
		description: 'Retrieve journals from Xero',
	},
	'taxRates.list': {
		riskLevel: 'read',
		description: 'Retrieve tax rates from Xero',
	},
	'trackingCategories.list': {
		riskLevel: 'read',
		description: 'Retrieve tracking categories from Xero',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof xeroEndpointsNested>;

export const xeroAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseXeroPlugin<T extends XeroPluginOptions> = CorsairPlugin<
	'xero',
	typeof XeroSchema,
	typeof xeroEndpointsNested,
	typeof xeroWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalXeroPlugin = BaseXeroPlugin<XeroPluginOptions>;

export type ExternalXeroPlugin<T extends XeroPluginOptions> = BaseXeroPlugin<T>;

export function xero<const T extends XeroPluginOptions>(
	incomingOptions: XeroPluginOptions & T = {} as XeroPluginOptions & T,
): ExternalXeroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'xero',
		authConfig: xeroAuthConfig,
		schema: XeroSchema,
		options: options,
		oauthConfig: {
			providerName: 'Xero',
			authUrl: 'https://login.xero.com/identity/connect/authorize',
			tokenUrl: 'https://identity.xero.com/connect/token',
			scopes: [
				'openid',
				'profile',
				'email',
				'accounting.transactions',
				'accounting.settings',
				'accounting.contacts',
				'accounting.attachments',
				'accounting.reports.read',
				'accounting.budgets.read',
				'assets',
				'projects',
				'files',
				'offline_access',
			],
			tokenAuthMethod: 'basic',
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: xeroEndpointsNested,
		webhooks: xeroWebhooksNested,
		endpointMeta: xeroEndpointMeta,
		endpointSchemas: xeroEndpointSchemas,
		webhookSchemas: xeroWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'x-xero-signature' in request.headers;
		},
		pluginTenantWebhookMatcher: matchXeroTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveXeroOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: XeroKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalXeroPlugin;
}

export type {
	AccountsGetInput,
	AccountsGetResponse,
	AccountsListInput,
	AccountsListResponse,
	AssetsGetInput,
	AssetsGetResponse,
	AssetsListInput,
	AssetsListResponse,
	AttachmentsListInput,
	AttachmentsListResponse,
	AttachmentsUploadInput,
	AttachmentsUploadResponse,
	BankTransactionsCreateInput,
	BankTransactionsCreateResponse,
	BankTransactionsListInput,
	BankTransactionsListResponse,
	BudgetsGetInput,
	BudgetsGetResponse,
	ConnectionsGetInput,
	ConnectionsGetResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	CreditNotesListInput,
	CreditNotesListResponse,
	FilesListFoldersInput,
	FilesListFoldersResponse,
	FilesListInput,
	FilesListResponse,
	InvoicesCreateInput,
	InvoicesCreateResponse,
	InvoicesGetInput,
	InvoicesGetResponse,
	InvoicesListInput,
	InvoicesListResponse,
	InvoicesUpdateInput,
	InvoicesUpdateResponse,
	ItemsCreateInput,
	ItemsCreateResponse,
	ItemsGetInput,
	ItemsGetResponse,
	ItemsListInput,
	ItemsListResponse,
	JournalsListInput,
	JournalsListResponse,
	ManualJournalsGetInput,
	ManualJournalsGetResponse,
	ManualJournalsListInput,
	ManualJournalsListResponse,
	OrganisationsGetInput,
	OrganisationsGetResponse,
	PaymentsCreateInput,
	PaymentsCreateResponse,
	PaymentsListInput,
	PaymentsListResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	PurchaseOrdersCreateInput,
	PurchaseOrdersCreateResponse,
	PurchaseOrdersGetInput,
	PurchaseOrdersGetResponse,
	PurchaseOrdersListInput,
	PurchaseOrdersListResponse,
	QuotesListInput,
	QuotesListResponse,
	ReportsGetBalanceSheetInput,
	ReportsGetBalanceSheetResponse,
	ReportsGetProfitLossInput,
	ReportsGetProfitLossResponse,
	TaxRatesListInput,
	TaxRatesListResponse,
	TrackingCategoriesListInput,
	TrackingCategoriesListResponse,
	XeroEndpointInputs,
	XeroEndpointOutputs,
} from './endpoints/types';
export type {
	XeroContactEvent,
	XeroGenericEvent,
	XeroInvoiceEvent,
	XeroWebhookOutputs,
} from './webhooks/types';
export {
	createXeroEventMatch,
	verifyXeroWebhookSignature,
} from './webhooks/types';
