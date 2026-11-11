import type {
	AccountKeyManagerFor,
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
import { AuthMissingError } from 'corsair/core';
import { Billing, Contacts, Products, Tax } from './endpoints';
import type {
	QuadernoEndpointInputs,
	QuadernoEndpointOutputs,
} from './endpoints/types';
import {
	QuadernoEndpointInputSchemas,
	QuadernoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { QuadernoSchema } from './schema';

export type QuadernoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Quaderno API key, `sk_live_…` or `sk_test_…`. Overrides the stored key. */
	key?: string;
	/**
	 * The account subdomain, such as `acme-123456`. There is no shared host:
	 * every account answers on its own. Overrides the stored value.
	 */
	account?: string;
	hooks?: InternalQuadernoPlugin['hooks'];
	webhookHooks?: InternalQuadernoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof quadernoEndpointsNested>;
};

/**
 * The account key manager this plugin reads: the stored key plus the account
 * name, both generated from `quadernoAuthConfig`'s `account: ['account_name']`.
 * Passing the auth config through is what gives `keys` the `get_account_name`
 * accessor; declaring the type by hand would not match the runtime manager.
 */
export type QuadernoKeyBuilderContext = KeyBuilderContext<
	QuadernoPluginOptions,
	typeof quadernoAuthConfig
>;

/**
 * What an endpoint reads. Core spreads `key` onto the context, and `ctx.keys`
 * is there too; the account name is read through it because the host is
 * per-account and core has no hook for threading a second credential.
 */
export type QuadernoContext = CorsairPluginContext<
	typeof QuadernoSchema,
	QuadernoPluginOptions
> & {
	keys: AccountKeyManagerFor<'api_key', typeof quadernoAuthConfig>;
	/** The plugin's own options, so an explicit `account` wins over storage. */
	options: QuadernoPluginOptions;
};

export type QuadernoBoundEndpoints = BindEndpoints<
	typeof quadernoEndpointsNested
>;

type QuadernoEndpoint<K extends keyof QuadernoEndpointOutputs> =
	CorsairEndpoint<
		QuadernoContext,
		QuadernoEndpointInputs[K],
		QuadernoEndpointOutputs[K]
	>;

export type QuadernoEndpoints = {
	ping: QuadernoEndpoint<'ping'>;
	authorization: QuadernoEndpoint<'authorization'>;
	contactsList: QuadernoEndpoint<'contactsList'>;
	contactsCreate: QuadernoEndpoint<'contactsCreate'>;
	contactsGet: QuadernoEndpoint<'contactsGet'>;
	contactsUpdate: QuadernoEndpoint<'contactsUpdate'>;
	contactsDelete: QuadernoEndpoint<'contactsDelete'>;
	productsList: QuadernoEndpoint<'productsList'>;
	productsCreate: QuadernoEndpoint<'productsCreate'>;
	productsGet: QuadernoEndpoint<'productsGet'>;
	productsUpdate: QuadernoEndpoint<'productsUpdate'>;
	productsDelete: QuadernoEndpoint<'productsDelete'>;
	invoicesList: QuadernoEndpoint<'invoicesList'>;
	invoicesCreate: QuadernoEndpoint<'invoicesCreate'>;
	invoicesGet: QuadernoEndpoint<'invoicesGet'>;
	invoicesUpdate: QuadernoEndpoint<'invoicesUpdate'>;
	invoicesVoid: QuadernoEndpoint<'invoicesVoid'>;
	invoicesMarkUncollectible: QuadernoEndpoint<'invoicesMarkUncollectible'>;
	invoicesRecordPayment: QuadernoEndpoint<'invoicesRecordPayment'>;
	invoicesDeliver: QuadernoEndpoint<'invoicesDeliver'>;
	receiptsList: QuadernoEndpoint<'receiptsList'>;
	receiptsCreate: QuadernoEndpoint<'receiptsCreate'>;
	receiptsGet: QuadernoEndpoint<'receiptsGet'>;
	receiptsVoid: QuadernoEndpoint<'receiptsVoid'>;
	receiptsDeliver: QuadernoEndpoint<'receiptsDeliver'>;
	creditsList: QuadernoEndpoint<'creditsList'>;
	creditsCreate: QuadernoEndpoint<'creditsCreate'>;
	creditsGet: QuadernoEndpoint<'creditsGet'>;
	creditsUpdate: QuadernoEndpoint<'creditsUpdate'>;
	creditsVoid: QuadernoEndpoint<'creditsVoid'>;
	creditsDeliver: QuadernoEndpoint<'creditsDeliver'>;
	proformasList: QuadernoEndpoint<'proformasList'>;
	proformasCreate: QuadernoEndpoint<'proformasCreate'>;
	proformasGet: QuadernoEndpoint<'proformasGet'>;
	proformasUpdate: QuadernoEndpoint<'proformasUpdate'>;
	proformasAccept: QuadernoEndpoint<'proformasAccept'>;
	proformasDecline: QuadernoEndpoint<'proformasDecline'>;
	proformasRevert: QuadernoEndpoint<'proformasRevert'>;
	proformasConvert: QuadernoEndpoint<'proformasConvert'>;
	proformasDeliver: QuadernoEndpoint<'proformasDeliver'>;
	taxRatesCalculate: QuadernoEndpoint<'taxRatesCalculate'>;
	taxIdsValidate: QuadernoEndpoint<'taxIdsValidate'>;
	taxCodesList: QuadernoEndpoint<'taxCodesList'>;
	taxCodesGet: QuadernoEndpoint<'taxCodesGet'>;
	jurisdictionsList: QuadernoEndpoint<'jurisdictionsList'>;
	jurisdictionsGet: QuadernoEndpoint<'jurisdictionsGet'>;
	transactionsCreate: QuadernoEndpoint<'transactionsCreate'>;
	webhooksList: QuadernoEndpoint<'webhooksList'>;
};

/**
 * Quaderno sends webhooks and signs each delivery with that endpoint's
 * `auth_key`. This plugin does not receive them yet: no inbound webhook is
 * registered and `pluginWebhookMatcher` refuses everything, so an unverified
 * delivery can never be accepted by mistake.
 */
export type QuadernoWebhooks = Record<never, never>;

export type QuadernoBoundWebhooks = BindWebhooks<typeof quadernoWebhooksNested>;

const quadernoEndpointsNested = {
	ping: Tax.ping,
	authorization: Tax.authorization,
	contacts: {
		list: Contacts.list,
		create: Contacts.create,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	products: {
		list: Products.list,
		create: Products.create,
		get: Products.get,
		update: Products.update,
		delete: Products.remove,
	},
	invoices: {
		list: Billing.list,
		create: Billing.create,
		get: Billing.get,
		update: Billing.update,
		void: Billing.voidInvoice,
		markUncollectible: Billing.markUncollectible,
		recordPayment: Billing.recordPayment,
		deliver: Billing.deliver,
	},
	receipts: {
		list: Billing.receiptsList,
		create: Billing.receiptsCreate,
		get: Billing.receiptsGet,
		void: Billing.receiptsVoid,
		deliver: Billing.receiptsDeliver,
	},
	credits: {
		list: Billing.creditsList,
		create: Billing.creditsCreate,
		get: Billing.creditsGet,
		update: Billing.creditsUpdate,
		void: Billing.creditsVoid,
		deliver: Billing.creditsDeliver,
	},
	proformas: {
		list: Billing.proformasList,
		create: Billing.proformasCreate,
		get: Billing.proformasGet,
		update: Billing.proformasUpdate,
		accept: Billing.proformasAccept,
		decline: Billing.proformasDecline,
		revert: Billing.proformasRevert,
		convert: Billing.proformasConvert,
		deliver: Billing.proformasDeliver,
	},
	taxRates: {
		calculate: Tax.calculate,
	},
	taxIds: {
		validate: Tax.validateTaxId,
	},
	taxCodes: {
		list: Tax.taxCodesList,
		get: Tax.taxCodesGet,
	},
	jurisdictions: {
		list: Tax.jurisdictionsList,
		get: Tax.jurisdictionsGet,
	},
	transactions: {
		create: Tax.createTransaction,
	},
	webhooks: {
		list: Tax.webhooksList,
	},
} as const;

const quadernoWebhooksNested = {} as const;

/**
 * One entry per operation, written out so `satisfies` checks the key set against
 * the registered endpoints. A literal needs no cast; `Object.fromEntries` over a
 * tuple map widens the keys to `string` and would have to be asserted back.
 */
export const quadernoEndpointSchemas = {
	ping: {
		input: QuadernoEndpointInputSchemas.ping,
		output: QuadernoEndpointOutputSchemas.ping,
	},
	authorization: {
		input: QuadernoEndpointInputSchemas.authorization,
		output: QuadernoEndpointOutputSchemas.authorization,
	},
	'contacts.list': {
		input: QuadernoEndpointInputSchemas.contactsList,
		output: QuadernoEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: QuadernoEndpointInputSchemas.contactsCreate,
		output: QuadernoEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: QuadernoEndpointInputSchemas.contactsGet,
		output: QuadernoEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: QuadernoEndpointInputSchemas.contactsUpdate,
		output: QuadernoEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: QuadernoEndpointInputSchemas.contactsDelete,
		output: QuadernoEndpointOutputSchemas.contactsDelete,
	},
	'products.list': {
		input: QuadernoEndpointInputSchemas.productsList,
		output: QuadernoEndpointOutputSchemas.productsList,
	},
	'products.create': {
		input: QuadernoEndpointInputSchemas.productsCreate,
		output: QuadernoEndpointOutputSchemas.productsCreate,
	},
	'products.get': {
		input: QuadernoEndpointInputSchemas.productsGet,
		output: QuadernoEndpointOutputSchemas.productsGet,
	},
	'products.update': {
		input: QuadernoEndpointInputSchemas.productsUpdate,
		output: QuadernoEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: QuadernoEndpointInputSchemas.productsDelete,
		output: QuadernoEndpointOutputSchemas.productsDelete,
	},
	'invoices.list': {
		input: QuadernoEndpointInputSchemas.invoicesList,
		output: QuadernoEndpointOutputSchemas.invoicesList,
	},
	'invoices.create': {
		input: QuadernoEndpointInputSchemas.invoicesCreate,
		output: QuadernoEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.get': {
		input: QuadernoEndpointInputSchemas.invoicesGet,
		output: QuadernoEndpointOutputSchemas.invoicesGet,
	},
	'invoices.update': {
		input: QuadernoEndpointInputSchemas.invoicesUpdate,
		output: QuadernoEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.void': {
		input: QuadernoEndpointInputSchemas.invoicesVoid,
		output: QuadernoEndpointOutputSchemas.invoicesVoid,
	},
	'invoices.markUncollectible': {
		input: QuadernoEndpointInputSchemas.invoicesMarkUncollectible,
		output: QuadernoEndpointOutputSchemas.invoicesMarkUncollectible,
	},
	'invoices.recordPayment': {
		input: QuadernoEndpointInputSchemas.invoicesRecordPayment,
		output: QuadernoEndpointOutputSchemas.invoicesRecordPayment,
	},
	'invoices.deliver': {
		input: QuadernoEndpointInputSchemas.invoicesDeliver,
		output: QuadernoEndpointOutputSchemas.invoicesDeliver,
	},
	'receipts.list': {
		input: QuadernoEndpointInputSchemas.receiptsList,
		output: QuadernoEndpointOutputSchemas.receiptsList,
	},
	'receipts.create': {
		input: QuadernoEndpointInputSchemas.receiptsCreate,
		output: QuadernoEndpointOutputSchemas.receiptsCreate,
	},
	'receipts.get': {
		input: QuadernoEndpointInputSchemas.receiptsGet,
		output: QuadernoEndpointOutputSchemas.receiptsGet,
	},
	'receipts.void': {
		input: QuadernoEndpointInputSchemas.receiptsVoid,
		output: QuadernoEndpointOutputSchemas.receiptsVoid,
	},
	'receipts.deliver': {
		input: QuadernoEndpointInputSchemas.receiptsDeliver,
		output: QuadernoEndpointOutputSchemas.receiptsDeliver,
	},
	'credits.list': {
		input: QuadernoEndpointInputSchemas.creditsList,
		output: QuadernoEndpointOutputSchemas.creditsList,
	},
	'credits.create': {
		input: QuadernoEndpointInputSchemas.creditsCreate,
		output: QuadernoEndpointOutputSchemas.creditsCreate,
	},
	'credits.get': {
		input: QuadernoEndpointInputSchemas.creditsGet,
		output: QuadernoEndpointOutputSchemas.creditsGet,
	},
	'credits.update': {
		input: QuadernoEndpointInputSchemas.creditsUpdate,
		output: QuadernoEndpointOutputSchemas.creditsUpdate,
	},
	'credits.void': {
		input: QuadernoEndpointInputSchemas.creditsVoid,
		output: QuadernoEndpointOutputSchemas.creditsVoid,
	},
	'credits.deliver': {
		input: QuadernoEndpointInputSchemas.creditsDeliver,
		output: QuadernoEndpointOutputSchemas.creditsDeliver,
	},
	'proformas.list': {
		input: QuadernoEndpointInputSchemas.proformasList,
		output: QuadernoEndpointOutputSchemas.proformasList,
	},
	'proformas.create': {
		input: QuadernoEndpointInputSchemas.proformasCreate,
		output: QuadernoEndpointOutputSchemas.proformasCreate,
	},
	'proformas.get': {
		input: QuadernoEndpointInputSchemas.proformasGet,
		output: QuadernoEndpointOutputSchemas.proformasGet,
	},
	'proformas.update': {
		input: QuadernoEndpointInputSchemas.proformasUpdate,
		output: QuadernoEndpointOutputSchemas.proformasUpdate,
	},
	'proformas.accept': {
		input: QuadernoEndpointInputSchemas.proformasAccept,
		output: QuadernoEndpointOutputSchemas.proformasAccept,
	},
	'proformas.decline': {
		input: QuadernoEndpointInputSchemas.proformasDecline,
		output: QuadernoEndpointOutputSchemas.proformasDecline,
	},
	'proformas.revert': {
		input: QuadernoEndpointInputSchemas.proformasRevert,
		output: QuadernoEndpointOutputSchemas.proformasRevert,
	},
	'proformas.convert': {
		input: QuadernoEndpointInputSchemas.proformasConvert,
		output: QuadernoEndpointOutputSchemas.proformasConvert,
	},
	'proformas.deliver': {
		input: QuadernoEndpointInputSchemas.proformasDeliver,
		output: QuadernoEndpointOutputSchemas.proformasDeliver,
	},
	'taxRates.calculate': {
		input: QuadernoEndpointInputSchemas.taxRatesCalculate,
		output: QuadernoEndpointOutputSchemas.taxRatesCalculate,
	},
	'taxIds.validate': {
		input: QuadernoEndpointInputSchemas.taxIdsValidate,
		output: QuadernoEndpointOutputSchemas.taxIdsValidate,
	},
	'taxCodes.list': {
		input: QuadernoEndpointInputSchemas.taxCodesList,
		output: QuadernoEndpointOutputSchemas.taxCodesList,
	},
	'taxCodes.get': {
		input: QuadernoEndpointInputSchemas.taxCodesGet,
		output: QuadernoEndpointOutputSchemas.taxCodesGet,
	},
	'jurisdictions.list': {
		input: QuadernoEndpointInputSchemas.jurisdictionsList,
		output: QuadernoEndpointOutputSchemas.jurisdictionsList,
	},
	'jurisdictions.get': {
		input: QuadernoEndpointInputSchemas.jurisdictionsGet,
		output: QuadernoEndpointOutputSchemas.jurisdictionsGet,
	},
	'transactions.create': {
		input: QuadernoEndpointInputSchemas.transactionsCreate,
		output: QuadernoEndpointOutputSchemas.transactionsCreate,
	},
	'webhooks.list': {
		input: QuadernoEndpointInputSchemas.webhooksList,
		output: QuadernoEndpointOutputSchemas.webhooksList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof quadernoEndpointsNested
>;

const quadernoWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof quadernoWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const quadernoEndpointMeta = {
	ping: {
		riskLevel: 'read',
		description:
			'Checks that the key and account name are valid. The docs say it does not consume an API call. Answers `{"status":"OK"}`.',
	},
	authorization: {
		riskLevel: 'read',
		description:
			'Which account this key belongs to: `identity.href` is that account\u2019s base URL, so this is how a caller finds the subdomain to pass as `account`. Also returns the default API version.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Customers, newest first, answered as a bare array. Search with `q` and page with `created_before`; `next_created_before` carries the next cursor.',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Adds a customer. `first_name` is required, and holds the company name for a `company`. Give an `email` if documents will be delivered to this contact.',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'One customer by id. An unknown id answers **401**, not 404, with \u201cUnauthorized access or contact does not exist\u201d; the plugin reports it as `not_found_or_denied`.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Changes a customer. Fields left out are left unchanged by the API, not cleared.',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a customer. Quaderno refuses with 422 while the contact still has documents attached, so invoices must be voided first. Answers 204 with no body.',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'Your product catalogue, newest first, from the `/items` route. A bare array; page with `created_before`.',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Adds a product. `name`, `code` and `unit_cost` are required, and `kind` is `one_off` or `subscription`, not the value the spec\u2019s example suggests.',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'One product by id, with its price, tax class and the currency it is sold in.',
	},
	'products.update': {
		riskLevel: 'write',
		description:
			'Changes a product. Existing documents keep the line they were issued with, so past invoices are unaffected.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a product. Existing documents keep the line they were issued with, so past invoices are unaffected.',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'Invoices, newest first, as a bare array. Filter by date, state, contact or processor id, search with `q`, and page with `created_before`.',
	},
	'invoices.create': {
		riskLevel: 'write',
		description:
			'Issues an invoice and **allocates a document number**, which is not recoverable: invoices cannot be deleted, only voided. Passing `payment_method` records a full payment immediately and marks it paid. Needs a `contact` id and at least one line item.',
	},
	'invoices.get': {
		riskLevel: 'read',
		description:
			'One invoice with its lines, taxes and payments. An unknown id answers 401 rather than 404.',
	},
	'invoices.update': {
		riskLevel: 'write',
		description:
			'Changes an invoice. Only the fields you send are changed. An issued invoice is legally immutable: Quaderno then accepts only `notes`, `payment_details` and `tag_list`, so correct anything else by voiding it and issuing a new one.',
	},
	'invoices.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reverses an invoice the way tax law requires. It cannot be deleted: voiding records an `offset` payment for the full amount and issues a credit note beside it. `void_reason` is required and the API answers 422 without it.',
	},
	'invoices.markUncollectible': {
		riskLevel: 'write',
		description:
			'Marks an unpaid invoice as bad debt. Reversible by recording a payment later, unlike a void.',
	},
	'invoices.recordPayment': {
		riskLevel: 'write',
		description:
			'Records a payment against an invoice; reaching the total marks it paid. This creates a real financial record, not a note.',
	},
	'invoices.deliver': {
		riskLevel: 'write',
		description:
			'Sends the invoice by email to the address on file for its contact, using the account template. A **GET that mutates**, so it is a write here and never replayed: delivering twice emails twice. The contact needs a valid email. Answers no document, only `delivered: true`.',
	},
	'receipts.list': {
		riskLevel: 'read',
		description:
			'Receipts, newest first, as a bare array. Filter by a `date` range or `contact`, and page with `created_before`.',
	},
	'receipts.create': {
		riskLevel: 'write',
		description:
			'Issues a receipt for a sale that is already paid, so `payment_method` is required. Like an invoice, it consumes a document number and cannot be deleted or updated, only voided.',
	},
	'receipts.get': {
		riskLevel: 'read',
		description:
			'One receipt by id, with its lines, payments and the invoice it settles.',
	},
	'receipts.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Voids a receipt. `void_reason` is required, as for an invoice.',
	},
	'receipts.deliver': {
		riskLevel: 'write',
		description:
			'Emails the receipt to the address on file for its contact. A GET that mutates, so it is a write and is never replayed. Answers `delivered: true`.',
	},
	'credits.list': {
		riskLevel: 'read',
		description:
			'Credit notes, newest first, as a bare array. A voided invoice leaves one of these beside it.',
	},
	'credits.create': {
		riskLevel: 'write',
		description:
			'Issues a credit note against an existing invoice, by `invoice_id`, and records the refund. It credits the whole invoice unless `credited_amount` is given. It consumes a document number and cannot be deleted, only voided.',
	},
	'credits.get': {
		riskLevel: 'read',
		description:
			'One credit note by id, with its lines, payments and the document it credits.',
	},
	'credits.update': {
		riskLevel: 'write',
		description:
			'Changes the administrative fields of a credit note: `notes`, `payment_details` and `tag_list`. Amounts, lines and the customer are immutable once it is issued.',
	},
	'credits.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Voids a credit note. `void_reason` is required, exactly as for an invoice.',
	},
	'credits.deliver': {
		riskLevel: 'write',
		description:
			'Emails the credit note to the address on file for its contact. A GET that mutates, so it is a write and is never replayed. Answers `delivered: true`.',
	},
	'proformas.list': {
		riskLevel: 'read',
		description:
			'Proforma invoices, newest first, as a bare array. A proforma is not a tax document, so it carries no invoice number.',
	},
	'proformas.create': {
		riskLevel: 'write',
		description:
			'Creates a proforma. Unlike an invoice this is not a tax document, so it does not consume an invoice number.',
	},
	'proformas.get': {
		riskLevel: 'read',
		description:
			'One proforma by id, with its lines and the state it was accepted or declined in.',
	},
	'proformas.update': {
		riskLevel: 'write',
		description:
			'Changes a proforma. Only the id is required. An accepted or invoiced proforma cannot be changed. It stays a proforma until `proformas.convert` issues a real invoice.',
	},
	'proformas.accept': {
		riskLevel: 'write',
		description:
			'Marks a proforma accepted. A state change the customer would normally trigger; reversible with `proformas.revert`.',
	},
	'proformas.decline': {
		riskLevel: 'write',
		description:
			'Marks a proforma declined. Reversible with `proformas.revert`.',
	},
	'proformas.revert': {
		riskLevel: 'write',
		description:
			'Puts an accepted or declined proforma back to its open state.',
	},
	'proformas.convert': {
		riskLevel: 'write',
		description:
			'Converts an accepted proforma into a real invoice, which **consumes an invoice number and cannot be undone**. Only a proforma in the accepted state can be converted. Returns the new invoice under `invoice`.',
	},
	'proformas.deliver': {
		riskLevel: 'write',
		description:
			'Emails the proforma to the address on file for its contact. A GET that mutates, so it is a write and is never replayed. Answers `delivered: true`.',
	},
	'taxRates.calculate': {
		riskLevel: 'read',
		description:
			'The tax rate Quaderno would charge for a customer country and tax code, with the resulting total. `tax_code` and `amount` are required from API version 20210316, which this plugin targets.',
	},
	'taxIds.validate': {
		riskLevel: 'read',
		description:
			'Checks a VAT or tax number against the country\u2019s registry. `valid` is true or false, or null when the registry could not be reached, which does not mean the number is invalid.',
	},
	'taxCodes.list': {
		riskLevel: 'read',
		description:
			'The tax codes available on the account, as a bare array. This route honours `limit`, unlike `jurisdictions.list`.',
	},
	'taxCodes.get': {
		riskLevel: 'read',
		description: 'One tax code by its identifier, such as `standard`.',
	},
	'jurisdictions.list': {
		riskLevel: 'read',
		description:
			'Every tax jurisdiction Quaderno knows, about 290 rows, as a bare array. Verified live: this route ignores `limit` and always returns the full list.',
	},
	'jurisdictions.get': {
		riskLevel: 'read',
		description:
			'One tax jurisdiction by id, naming the country and any region whose tax rules apply.',
	},
	'transactions.create': {
		riskLevel: 'write',
		description:
			'Records a sale or a refund in one call: it creates the document and its payment together, which is what distinguishes it from `invoices.create`. The body is not an invoice body: the buyer is `customer`, each line carries its total as `amount`, and `payment.method` is required. A real financial record.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'The webhook subscriptions on the account, with the events each one receives. Read only here: this plugin registers no inbound handler. The signing secret (`auth_key`) is left out of the result.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof quadernoEndpointsNested>;

/**
 * The key and the account name are both account-level credentials: there is one
 * per Quaderno account, and no shared host to point at. Declaring `account_name`
 * here makes core generate `get_account_name`/`set_account_name` on the account
 * key manager, which the binding uses to put `account` on the context.
 */
export const quadernoAuthConfig = {
	api_key: {
		account: ['account_name'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseQuadernoPlugin<T extends QuadernoPluginOptions> = CorsairPlugin<
	'quaderno',
	typeof QuadernoSchema,
	typeof quadernoEndpointsNested,
	typeof quadernoWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof quadernoAuthConfig
>;

export type InternalQuadernoPlugin = BaseQuadernoPlugin<QuadernoPluginOptions>;

export type ExternalQuadernoPlugin<T extends QuadernoPluginOptions> =
	BaseQuadernoPlugin<T>;

export function quaderno<const T extends QuadernoPluginOptions>(
	incomingOptions: QuadernoPluginOptions & T = {} as QuadernoPluginOptions & T,
): ExternalQuadernoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'quaderno',
		authConfig: quadernoAuthConfig,
		schema: QuadernoSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: quadernoEndpointsNested,
		webhooks: quadernoWebhooksNested,
		endpointMeta: quadernoEndpointMeta,
		endpointSchemas: quadernoEndpointSchemas,
		webhookSchemas: quadernoWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: QuadernoKeyBuilderContext, source) => {
			// No webhooks are registered, so a webhook source is unreachable. It is
			// refused rather than handed the API key.
			if (source === 'webhook') {
				throw new AuthMissingError('quaderno', 'webhook');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('quaderno', 'api_key');
			return key;
		},
	} satisfies InternalQuadernoPlugin;
}

export {
	accountBaseUrl,
	QUADERNO_ROOT_HOST,
	QuadernoAPIError,
	QuadernoError,
	QuadernoTransportError,
} from './client';
export type {
	QuadernoEndpointInputs,
	QuadernoEndpointOutputs,
} from './endpoints/types';
