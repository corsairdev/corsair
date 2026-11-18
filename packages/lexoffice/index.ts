import {
	AuthMissingError,
	type AuthTypes,
	type BindEndpoints,
	type CorsairEndpoint,
	type CorsairErrorHandler,
	type CorsairPlugin,
	type CorsairPluginContext,
	type KeyBuilderContext,
	type PickAuth,
	type PluginAuthConfig,
	type PluginPermissionsConfig,
	type RequiredPluginEndpointMeta,
	type RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	Contacts,
	CreditNotes,
	Invoices,
	Profile,
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
	invoicesList: LexofficeEndpoint<'invoicesList'>;
	invoicesGet: LexofficeEndpoint<'invoicesGet'>;
	invoicesCreate: LexofficeEndpoint<'invoicesCreate'>;
	invoicesRender: LexofficeEndpoint<'invoicesRender'>;
	vouchersList: LexofficeEndpoint<'vouchersList'>;
	vouchersGet: LexofficeEndpoint<'vouchersGet'>;
	vouchersCreate: LexofficeEndpoint<'vouchersCreate'>;
	profileGet: LexofficeEndpoint<'profileGet'>;
	creditNotesList: LexofficeEndpoint<'creditNotesList'>;
	creditNotesGet: LexofficeEndpoint<'creditNotesGet'>;
};

const lexofficeEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		render: Invoices.render,
	},
	vouchers: {
		list: Vouchers.list,
		get: Vouchers.get,
		create: Vouchers.create,
	},
	profile: {
		get: Profile.get,
	},
	creditNotes: {
		list: CreditNotes.list,
		get: CreditNotes.get,
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
	'invoices.list': {
		riskLevel: 'read',
		description: 'List outgoing invoices with pagination',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieve invoice details by ID',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create an invoice in draft or finalized state',
	},
	'invoices.render': {
		riskLevel: 'read',
		description:
			'Render an invoice PDF and retrieve its document file ID',
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
		riskLevel: 'write',
		description: 'Create a new bookkeeping voucher',
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
} as const satisfies RequiredPluginEndpointMeta<typeof lexofficeEndpointsNested>;

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

export type InternalLexofficePlugin = BaseLexofficePlugin<LexofficePluginOptions>;

export type ExternalLexofficePlugin<T extends LexofficePluginOptions> =
	BaseLexofficePlugin<T>;

const PUBLIC_ENDPOINTS = new Set<string>();

export function lexoffice<const T extends LexofficePluginOptions>(
	incomingOptions: LexofficePluginOptions & T = {} as LexofficePluginOptions & T,
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
	CreditNoteDetails,
	CreditNotesGetInput,
	CreditNotesListInput,
	CreditNotesListResponse,
	CreditNoteSummary,
	InvoiceCreateInput,
	InvoiceDetails,
	InvoicesGetInput,
	InvoicesListInput,
	InvoicesListResponse,
	InvoicesRenderInput,
	InvoicesRenderResponse,
	InvoiceSummary,
	LexofficeEndpointInputs,
	LexofficeEndpointOutputs,
	LineItem,
	ProfileGetInput,
	ProfileGetResponse,
	ResourceMutationResponse,
	VoucherCreateInput,
	VoucherDetails,
	VoucherItem,
	VouchersGetInput,
	VouchersListInput,
	VouchersListResponse,
	VoucherSummary,
} from './endpoints/types';
