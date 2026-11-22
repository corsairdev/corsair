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
	Contacts,
	CreditNotes,
	DownPaymentInvoices,
	Files,
	Invoices,
	Payments,
	PostingCategories,
	Profile,
	Voucherlist,
	Vouchers,
} from './endpoints';
import type {
	LexofficeEndpointInputs,
	LexofficeEndpointOutputs,
} from './endpoints/types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LexofficeSchema } from './schema';

export type LexofficePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLexofficePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lexofficeEndpointsNested>;
};

export type LexofficeContext = CorsairPluginContext<
	typeof LexofficeSchema,
	LexofficePluginOptions
>;

export type LexofficeKeyBuilderContext =
	KeyBuilderContext<LexofficePluginOptions>;

export type LexofficeBoundEndpoints = BindEndpoints<
	typeof lexofficeEndpointsNested
>;

type LexofficeEndpoint<K extends keyof LexofficeEndpointOutputs> =
	CorsairEndpoint<
		LexofficeContext,
		LexofficeEndpointInputs[K],
		LexofficeEndpointOutputs[K]
	>;

export type LexofficeEndpoints = {
	contactsList: LexofficeEndpoint<'contactsList'>;
	contactsGet: LexofficeEndpoint<'contactsGet'>;
	contactsCreate: LexofficeEndpoint<'contactsCreate'>;
	contactsUpdate: LexofficeEndpoint<'contactsUpdate'>;
	voucherListList: LexofficeEndpoint<'voucherListList'>;
	invoicesList: LexofficeEndpoint<'invoicesList'>;
	invoicesGet: LexofficeEndpoint<'invoicesGet'>;
	invoicesCreate: LexofficeEndpoint<'invoicesCreate'>;
	invoicesRender: LexofficeEndpoint<'invoicesRender'>;
	invoicesDownload: LexofficeEndpoint<'invoicesDownload'>;
	vouchersList: LexofficeEndpoint<'vouchersList'>;
	vouchersGet: LexofficeEndpoint<'vouchersGet'>;
	vouchersCreate: LexofficeEndpoint<'vouchersCreate'>;
	vouchersUpdate: LexofficeEndpoint<'vouchersUpdate'>;
	vouchersAttachFile: LexofficeEndpoint<'vouchersAttachFile'>;
	profileGet: LexofficeEndpoint<'profileGet'>;
	creditNotesList: LexofficeEndpoint<'creditNotesList'>;
	creditNotesGet: LexofficeEndpoint<'creditNotesGet'>;
	creditNotesCreate: LexofficeEndpoint<'creditNotesCreate'>;
	creditNotesRender: LexofficeEndpoint<'creditNotesRender'>;
	creditNotesDownload: LexofficeEndpoint<'creditNotesDownload'>;
	downPaymentInvoicesGet: LexofficeEndpoint<'downPaymentInvoicesGet'>;
	downPaymentInvoicesDownload: LexofficeEndpoint<'downPaymentInvoicesDownload'>;
	paymentsGet: LexofficeEndpoint<'paymentsGet'>;
	postingCategoriesList: LexofficeEndpoint<'postingCategoriesList'>;
	filesUpload: LexofficeEndpoint<'filesUpload'>;
	filesDownload: LexofficeEndpoint<'filesDownload'>;
};

const lexofficeEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
	},
	voucherlist: {
		list: Voucherlist.list,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		render: Invoices.render,
		download: Invoices.download,
	},
	vouchers: {
		list: Vouchers.list,
		get: Vouchers.get,
		create: Vouchers.create,
		update: Vouchers.update,
		attachFile: Vouchers.attachFile,
	},
	profile: {
		get: Profile.get,
	},
	creditNotes: {
		list: CreditNotes.list,
		get: CreditNotes.get,
		create: CreditNotes.create,
		render: CreditNotes.render,
		download: CreditNotes.download,
	},
	downPaymentInvoices: {
		get: DownPaymentInvoices.get,
		download: DownPaymentInvoices.download,
	},
	payments: {
		get: Payments.get,
	},
	postingCategories: {
		list: PostingCategories.list,
	},
	files: {
		upload: Files.upload,
		download: Files.download,
	},
} as const;

export const lexofficeEndpointSchemas = {
	'contacts.list': {
		input: LexofficeEndpointInputSchemas.contactsList,
		output: LexofficeEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: LexofficeEndpointInputSchemas.contactsGet,
		output: LexofficeEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: LexofficeEndpointInputSchemas.contactsCreate,
		output: LexofficeEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: LexofficeEndpointInputSchemas.contactsUpdate,
		output: LexofficeEndpointOutputSchemas.contactsUpdate,
	},
	'voucherlist.list': {
		input: LexofficeEndpointInputSchemas.voucherListList,
		output: LexofficeEndpointOutputSchemas.voucherListList,
	},
	'invoices.list': {
		input: LexofficeEndpointInputSchemas.invoicesList,
		output: LexofficeEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: LexofficeEndpointInputSchemas.invoicesGet,
		output: LexofficeEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: LexofficeEndpointInputSchemas.invoicesCreate,
		output: LexofficeEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.render': {
		input: LexofficeEndpointInputSchemas.invoicesRender,
		output: LexofficeEndpointOutputSchemas.invoicesRender,
	},
	'invoices.download': {
		input: LexofficeEndpointInputSchemas.invoicesDownload,
		output: LexofficeEndpointOutputSchemas.invoicesDownload,
	},
	'vouchers.list': {
		input: LexofficeEndpointInputSchemas.vouchersList,
		output: LexofficeEndpointOutputSchemas.vouchersList,
	},
	'vouchers.get': {
		input: LexofficeEndpointInputSchemas.vouchersGet,
		output: LexofficeEndpointOutputSchemas.vouchersGet,
	},
	'vouchers.create': {
		input: LexofficeEndpointInputSchemas.vouchersCreate,
		output: LexofficeEndpointOutputSchemas.vouchersCreate,
	},
	'vouchers.update': {
		input: LexofficeEndpointInputSchemas.vouchersUpdate,
		output: LexofficeEndpointOutputSchemas.vouchersUpdate,
	},
	'vouchers.attachFile': {
		input: LexofficeEndpointInputSchemas.vouchersAttachFile,
		output: LexofficeEndpointOutputSchemas.vouchersAttachFile,
	},
	'profile.get': {
		input: LexofficeEndpointInputSchemas.profileGet,
		output: LexofficeEndpointOutputSchemas.profileGet,
	},
	'creditNotes.list': {
		input: LexofficeEndpointInputSchemas.creditNotesList,
		output: LexofficeEndpointOutputSchemas.creditNotesList,
	},
	'creditNotes.get': {
		input: LexofficeEndpointInputSchemas.creditNotesGet,
		output: LexofficeEndpointOutputSchemas.creditNotesGet,
	},
	'creditNotes.create': {
		input: LexofficeEndpointInputSchemas.creditNotesCreate,
		output: LexofficeEndpointOutputSchemas.creditNotesCreate,
	},
	'creditNotes.render': {
		input: LexofficeEndpointInputSchemas.creditNotesRender,
		output: LexofficeEndpointOutputSchemas.creditNotesRender,
	},
	'creditNotes.download': {
		input: LexofficeEndpointInputSchemas.creditNotesDownload,
		output: LexofficeEndpointOutputSchemas.creditNotesDownload,
	},
	'downPaymentInvoices.get': {
		input: LexofficeEndpointInputSchemas.downPaymentInvoicesGet,
		output: LexofficeEndpointOutputSchemas.downPaymentInvoicesGet,
	},
	'downPaymentInvoices.download': {
		input: LexofficeEndpointInputSchemas.downPaymentInvoicesDownload,
		output: LexofficeEndpointOutputSchemas.downPaymentInvoicesDownload,
	},
	'payments.get': {
		input: LexofficeEndpointInputSchemas.paymentsGet,
		output: LexofficeEndpointOutputSchemas.paymentsGet,
	},
	'postingCategories.list': {
		input: LexofficeEndpointInputSchemas.postingCategoriesList,
		output: LexofficeEndpointOutputSchemas.postingCategoriesList,
	},
	'files.upload': {
		input: LexofficeEndpointInputSchemas.filesUpload,
		output: LexofficeEndpointOutputSchemas.filesUpload,
	},
	'files.download': {
		input: LexofficeEndpointInputSchemas.filesDownload,
		output: LexofficeEndpointOutputSchemas.filesDownload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof lexofficeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lexofficeEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'List and filter Lexoffice contacts with pagination',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a Lexoffice contact by ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new customer or vendor contact in Lexoffice',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact in Lexoffice',
	},
	'voucherlist.list': {
		riskLevel: 'read',
		description: 'Search all documented Lexware voucher types with paging',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List outgoing invoices with pagination',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieve invoice details by ID',
	},
	'invoices.create': {
		riskLevel: 'destructive',
		description: 'Create an invoice in draft or finalized state',
	},
	'invoices.render': {
		riskLevel: 'read',
		description:
			'Use the deprecated invoice document endpoint to retrieve a file ID',
	},
	'invoices.download': {
		riskLevel: 'read',
		description: 'Download an invoice document as base64-encoded binary data',
	},
	'vouchers.list': {
		riskLevel: 'read',
		description:
			'List bookkeeping vouchers with optional voucher number filter',
	},
	'vouchers.get': {
		riskLevel: 'read',
		description: 'Retrieve voucher details by ID',
	},
	'vouchers.create': {
		riskLevel: 'destructive',
		description: 'Create a new bookkeeping voucher',
	},
	'vouchers.update': {
		riskLevel: 'destructive',
		description: 'Update a bookkeeping voucher including its assigned files',
	},
	'vouchers.attachFile': {
		riskLevel: 'destructive',
		description: 'Upload a bookkeeping document to an existing voucher',
	},
	'profile.get': {
		riskLevel: 'read',
		description: 'Retrieve organization and account profile details',
	},
	'creditNotes.list': {
		riskLevel: 'read',
		description: 'List credit notes with pagination',
	},
	'creditNotes.get': {
		riskLevel: 'read',
		description: 'Retrieve credit note details by ID',
	},
	'creditNotes.create': {
		riskLevel: 'destructive',
		description: 'Create a credit note, optionally finalizing or pursuing it',
	},
	'creditNotes.render': {
		riskLevel: 'read',
		description:
			'Use the deprecated credit-note document endpoint to retrieve a file ID',
	},
	'creditNotes.download': {
		riskLevel: 'read',
		description:
			'Download a credit note document as base64-encoded binary data',
	},
	'downPaymentInvoices.get': {
		riskLevel: 'read',
		description: 'Retrieve a down-payment invoice by ID',
	},
	'downPaymentInvoices.download': {
		riskLevel: 'read',
		description: 'Download a down-payment invoice document as base64 data',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Retrieve payment status and payment entries for a voucher',
	},
	'postingCategories.list': {
		riskLevel: 'read',
		description: 'List the available bookkeeping posting categories',
	},
	'files.upload': {
		riskLevel: 'destructive',
		description: 'Upload a voucher file, which creates a bookkeeping voucher',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download a bookkeeping file as base64-encoded binary data',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof lexofficeEndpointsNested
>;

export const lexofficeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLexofficePlugin<T extends LexofficePluginOptions> =
	CorsairPlugin<
		'lexoffice',
		typeof LexofficeSchema,
		typeof lexofficeEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalLexofficePlugin =
	BaseLexofficePlugin<LexofficePluginOptions>;

export type ExternalLexofficePlugin<T extends LexofficePluginOptions> =
	BaseLexofficePlugin<T>;

const PUBLIC_ENDPOINTS = new Set<string>();

export function lexoffice<const T extends LexofficePluginOptions>(
	incomingOptions: LexofficePluginOptions & T = {} as LexofficePluginOptions &
		T,
): ExternalLexofficePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'lexoffice',
		authConfig: lexofficeAuthConfig,
		schema: LexofficeSchema,
		options,
		hooks: options.hooks,
		endpoints: lexofficeEndpointsNested,
		webhooks: {},
		endpointMeta: lexofficeEndpointMeta,
		endpointSchemas: lexofficeEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: LexofficeKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('lexoffice', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('lexoffice', 'api_key');
			return apiKey;
		},
	} satisfies InternalLexofficePlugin;
}

export type {
	Contact,
	ContactAddress,
	ContactCompany,
	ContactCreateInput,
	ContactPerson,
	ContactRoles,
	ContactsGetInput,
	ContactsListInput,
	ContactsListResponse,
	ContactUpdateInput,
	CreditNoteCreateInput,
	CreditNoteDetails,
	CreditNoteSummary,
	CreditNotesDownloadInput,
	CreditNotesGetInput,
	CreditNotesListInput,
	CreditNotesListResponse,
	DownPaymentInvoiceDetails,
	DownPaymentInvoicesDownloadInput,
	DownPaymentInvoicesGetInput,
	FileDownloadInput,
	FileDownloadResponse,
	FilesUploadInput,
	FilesUploadResponse,
	InvoiceCreateInput,
	InvoiceDetails,
	InvoiceSummary,
	InvoicesDownloadInput,
	InvoicesGetInput,
	InvoicesListInput,
	InvoicesListResponse,
	InvoicesRenderInput,
	InvoicesRenderResponse,
	LexofficeEndpointInputs,
	LexofficeEndpointOutputs,
	LineItem,
	PaymentInformation,
	PaymentsGetInput,
	PostingCategoriesListInput,
	PostingCategory,
	ProfileGetInput,
	ProfileGetResponse,
	ResourceMutationResponse,
	VoucherCreateInput,
	VoucherDetails,
	VoucherItem,
	VoucherListInput,
	VoucherListResponse,
	VoucherSummary,
	VouchersAttachFileInput,
	VouchersAttachFileResponse,
	VouchersGetInput,
	VouchersListInput,
	VouchersListResponse,
	VoucherUpdateInput,
} from './endpoints/types';
