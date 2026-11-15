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
	Company,
	Contacts,
	EmailAddresses,
	Invoices,
	Projects,
	RecurringInvoices,
	TrackingGroups,
} from './endpoints';
import type {
	FreeAgentEndpointInputs,
	FreeAgentEndpointOutputs,
} from './endpoints/types';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FreeAgentSchema } from './schema';

export type FreeAgentPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalFreeAgentPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freeAgentEndpointsNested>;
};

export type FreeAgentContext = CorsairPluginContext<
	typeof FreeAgentSchema,
	FreeAgentPluginOptions
>;
export type FreeAgentKeyBuilderContext =
	KeyBuilderContext<FreeAgentPluginOptions>;
export type FreeAgentBoundEndpoints = BindEndpoints<
	typeof freeAgentEndpointsNested
>;

type Endpoint<K extends keyof FreeAgentEndpointOutputs> = CorsairEndpoint<
	FreeAgentContext,
	FreeAgentEndpointInputs[K],
	FreeAgentEndpointOutputs[K]
>;

export type FreeAgentEndpoints = {
	companyGet: Endpoint<'companyGet'>;
	companyBusinessCategories: Endpoint<'companyBusinessCategories'>;
	companyTaxTimeline: Endpoint<'companyTaxTimeline'>;
	emailAddressesList: Endpoint<'emailAddressesList'>;
	contactsList: Endpoint<'contactsList'>;
	contactsGet: Endpoint<'contactsGet'>;
	contactsCreate: Endpoint<'contactsCreate'>;
	contactsUpdate: Endpoint<'contactsUpdate'>;
	contactsDelete: Endpoint<'contactsDelete'>;
	projectsList: Endpoint<'projectsList'>;
	projectsGet: Endpoint<'projectsGet'>;
	projectsCreate: Endpoint<'projectsCreate'>;
	projectsUpdate: Endpoint<'projectsUpdate'>;
	projectsDelete: Endpoint<'projectsDelete'>;
	invoicesList: Endpoint<'invoicesList'>;
	invoicesGet: Endpoint<'invoicesGet'>;
	invoicesCreate: Endpoint<'invoicesCreate'>;
	invoicesUpdate: Endpoint<'invoicesUpdate'>;
	invoicesDelete: Endpoint<'invoicesDelete'>;
	invoicesMarkSent: Endpoint<'invoicesMarkSent'>;
	invoicesSendEmail: Endpoint<'invoicesSendEmail'>;
	invoicesDuplicate: Endpoint<'invoicesDuplicate'>;
	invoicesMarkScheduled: Endpoint<'invoicesMarkScheduled'>;
	invoicesMarkDraft: Endpoint<'invoicesMarkDraft'>;
	invoicesMarkCancelled: Endpoint<'invoicesMarkCancelled'>;
	invoicesDirectDebit: Endpoint<'invoicesDirectDebit'>;
	invoicesTimeline: Endpoint<'invoicesTimeline'>;
	invoicesDefaultAdditionalTextGet: Endpoint<'invoicesDefaultAdditionalTextGet'>;
	invoicesDefaultAdditionalTextUpdate: Endpoint<'invoicesDefaultAdditionalTextUpdate'>;
	invoicesDefaultAdditionalTextDelete: Endpoint<'invoicesDefaultAdditionalTextDelete'>;
	invoicesPdf: Endpoint<'invoicesPdf'>;
	invoicesConvertToCreditNote: Endpoint<'invoicesConvertToCreditNote'>;
	recurringInvoicesList: Endpoint<'recurringInvoicesList'>;
	recurringInvoicesGet: Endpoint<'recurringInvoicesGet'>;
	trackingGroupsList: Endpoint<'trackingGroupsList'>;
	trackingGroupsGet: Endpoint<'trackingGroupsGet'>;
};

const freeAgentEndpointsNested = {
	company: {
		get: Company.get,
		businessCategories: Company.businessCategories,
		taxTimeline: Company.taxTimeline,
	},
	emailAddresses: {
		list: EmailAddresses.list,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.remove,
		markSent: Invoices.markSent,
		sendEmail: Invoices.sendEmail,
		duplicate: Invoices.duplicate,
		markScheduled: Invoices.markScheduled,
		markDraft: Invoices.markDraft,
		markCancelled: Invoices.markCancelled,
		directDebit: Invoices.directDebit,
		timeline: Invoices.timeline,
		getDefaultAdditionalText: Invoices.getDefaultAdditionalText,
		updateDefaultAdditionalText: Invoices.updateDefaultAdditionalText,
		deleteDefaultAdditionalText: Invoices.deleteDefaultAdditionalText,
		pdf: Invoices.pdf,
		convertToCreditNote: Invoices.convertToCreditNote,
	},
	recurringInvoices: {
		list: RecurringInvoices.list,
		get: RecurringInvoices.get,
	},
	trackingGroups: {
		list: TrackingGroups.list,
		get: TrackingGroups.get,
	},
} as const;

export const freeAgentEndpointSchemas = {
	'company.get': {
		input: FreeAgentEndpointInputSchemas.companyGet,
		output: FreeAgentEndpointOutputSchemas.companyGet,
	},
	'company.businessCategories': {
		input: FreeAgentEndpointInputSchemas.companyBusinessCategories,
		output: FreeAgentEndpointOutputSchemas.companyBusinessCategories,
	},
	'company.taxTimeline': {
		input: FreeAgentEndpointInputSchemas.companyTaxTimeline,
		output: FreeAgentEndpointOutputSchemas.companyTaxTimeline,
	},
	'emailAddresses.list': {
		input: FreeAgentEndpointInputSchemas.emailAddressesList,
		output: FreeAgentEndpointOutputSchemas.emailAddressesList,
	},
	'contacts.list': {
		input: FreeAgentEndpointInputSchemas.contactsList,
		output: FreeAgentEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: FreeAgentEndpointInputSchemas.contactsGet,
		output: FreeAgentEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: FreeAgentEndpointInputSchemas.contactsCreate,
		output: FreeAgentEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: FreeAgentEndpointInputSchemas.contactsUpdate,
		output: FreeAgentEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: FreeAgentEndpointInputSchemas.contactsDelete,
		output: FreeAgentEndpointOutputSchemas.contactsDelete,
	},
	'projects.list': {
		input: FreeAgentEndpointInputSchemas.projectsList,
		output: FreeAgentEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: FreeAgentEndpointInputSchemas.projectsGet,
		output: FreeAgentEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: FreeAgentEndpointInputSchemas.projectsCreate,
		output: FreeAgentEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: FreeAgentEndpointInputSchemas.projectsUpdate,
		output: FreeAgentEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: FreeAgentEndpointInputSchemas.projectsDelete,
		output: FreeAgentEndpointOutputSchemas.projectsDelete,
	},
	'invoices.list': {
		input: FreeAgentEndpointInputSchemas.invoicesList,
		output: FreeAgentEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: FreeAgentEndpointInputSchemas.invoicesGet,
		output: FreeAgentEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: FreeAgentEndpointInputSchemas.invoicesCreate,
		output: FreeAgentEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: FreeAgentEndpointInputSchemas.invoicesUpdate,
		output: FreeAgentEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: FreeAgentEndpointInputSchemas.invoicesDelete,
		output: FreeAgentEndpointOutputSchemas.invoicesDelete,
	},
	'invoices.markSent': {
		input: FreeAgentEndpointInputSchemas.invoicesMarkSent,
		output: FreeAgentEndpointOutputSchemas.invoicesMarkSent,
	},
	'invoices.sendEmail': {
		input: FreeAgentEndpointInputSchemas.invoicesSendEmail,
		output: FreeAgentEndpointOutputSchemas.invoicesSendEmail,
	},
	'invoices.duplicate': {
		input: FreeAgentEndpointInputSchemas.invoicesDuplicate,
		output: FreeAgentEndpointOutputSchemas.invoicesDuplicate,
	},
	'invoices.markScheduled': {
		input: FreeAgentEndpointInputSchemas.invoicesMarkScheduled,
		output: FreeAgentEndpointOutputSchemas.invoicesMarkScheduled,
	},
	'invoices.markDraft': {
		input: FreeAgentEndpointInputSchemas.invoicesMarkDraft,
		output: FreeAgentEndpointOutputSchemas.invoicesMarkDraft,
	},
	'invoices.markCancelled': {
		input: FreeAgentEndpointInputSchemas.invoicesMarkCancelled,
		output: FreeAgentEndpointOutputSchemas.invoicesMarkCancelled,
	},
	'invoices.directDebit': {
		input: FreeAgentEndpointInputSchemas.invoicesDirectDebit,
		output: FreeAgentEndpointOutputSchemas.invoicesDirectDebit,
	},
	'invoices.timeline': {
		input: FreeAgentEndpointInputSchemas.invoicesTimeline,
		output: FreeAgentEndpointOutputSchemas.invoicesTimeline,
	},
	'invoices.getDefaultAdditionalText': {
		input: FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextGet,
		output: FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextGet,
	},
	'invoices.updateDefaultAdditionalText': {
		input: FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextUpdate,
		output: FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextUpdate,
	},
	'invoices.deleteDefaultAdditionalText': {
		input: FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextDelete,
		output: FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextDelete,
	},
	'invoices.pdf': {
		input: FreeAgentEndpointInputSchemas.invoicesPdf,
		output: FreeAgentEndpointOutputSchemas.invoicesPdf,
	},
	'invoices.convertToCreditNote': {
		input: FreeAgentEndpointInputSchemas.invoicesConvertToCreditNote,
		output: FreeAgentEndpointOutputSchemas.invoicesConvertToCreditNote,
	},
	'recurringInvoices.list': {
		input: FreeAgentEndpointInputSchemas.recurringInvoicesList,
		output: FreeAgentEndpointOutputSchemas.recurringInvoicesList,
	},
	'recurringInvoices.get': {
		input: FreeAgentEndpointInputSchemas.recurringInvoicesGet,
		output: FreeAgentEndpointOutputSchemas.recurringInvoicesGet,
	},
	'trackingGroups.list': {
		input: FreeAgentEndpointInputSchemas.trackingGroupsList,
		output: FreeAgentEndpointOutputSchemas.trackingGroupsList,
	},
	'trackingGroups.get': {
		input: FreeAgentEndpointInputSchemas.trackingGroupsGet,
		output: FreeAgentEndpointOutputSchemas.trackingGroupsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof freeAgentEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2';

const freeAgentEndpointMeta = {
	'company.get': {
		riskLevel: 'read',
		description: 'Get the authenticated company profile',
	},
	'company.businessCategories': {
		riskLevel: 'read',
		description: 'List the documented business categories for company profiles',
	},
	'company.taxTimeline': {
		riskLevel: 'read',
		description: 'List upcoming tax events and due dates for the company',
	},
	'emailAddresses.list': {
		riskLevel: 'read',
		description: 'List verified sender email addresses for the company',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with documented filters and pagination',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by its FreeAgent ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact using documented contact fields',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update documented fields on a contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with documented filters and pagination',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by its FreeAgent ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project with documented project fields',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update documented fields on a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices with documented filters and pagination',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice by its FreeAgent ID',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create an invoice in Draft status',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an invoice without changing its status',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice',
	},
	'invoices.markSent': {
		riskLevel: 'destructive',
		description: 'Mark an invoice as sent or reopen a cancelled invoice',
	},
	'invoices.sendEmail': {
		riskLevel: 'destructive',
		description: 'Send an invoice email to its recipient',
	},
	'invoices.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate an invoice as a new draft using the next reference',
	},
	'invoices.markScheduled': {
		riskLevel: 'destructive',
		description: 'Schedule an invoice to be emailed',
	},
	'invoices.markDraft': {
		riskLevel: 'destructive',
		description: 'Return an invoice to Draft status',
	},
	'invoices.markCancelled': {
		riskLevel: 'destructive',
		description: 'Cancel and write off an eligible sent invoice',
	},
	'invoices.directDebit': {
		riskLevel: 'destructive',
		description: 'Take payment using an eligible GoCardless mandate',
	},
	'invoices.timeline': {
		riskLevel: 'read',
		description: 'List invoice timeline entries',
	},
	'invoices.getDefaultAdditionalText': {
		riskLevel: 'read',
		description: 'Get the default additional text for company invoices',
	},
	'invoices.updateDefaultAdditionalText': {
		riskLevel: 'write',
		description: 'Update the default additional text for company invoices',
	},
	'invoices.deleteDefaultAdditionalText': {
		riskLevel: 'write',
		description: 'Remove the default additional text from company invoices',
	},
	'invoices.pdf': {
		riskLevel: 'read',
		description: 'Get the invoice PDF as base64 encoded JSON content',
	},
	'invoices.convertToCreditNote': {
		riskLevel: 'destructive',
		description: 'Convert a draft negative invoice into a credit note',
	},
	'recurringInvoices.list': {
		riskLevel: 'read',
		description:
			'List recurring invoices with documented filters and pagination',
	},
	'recurringInvoices.get': {
		riskLevel: 'read',
		description: 'Get a recurring invoice by its FreeAgent ID',
	},
	'trackingGroups.list': {
		riskLevel: 'read',
		description: 'List tracking groups with documented filters and pagination',
	},
	'trackingGroups.get': {
		riskLevel: 'read',
		description: 'Get a tracking group and its labels by FreeAgent ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof freeAgentEndpointsNested
>;

export const freeAgentAuthConfig = {
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseFreeAgentPlugin<T extends FreeAgentPluginOptions> =
	CorsairPlugin<
		'freeagent',
		typeof FreeAgentSchema,
		typeof freeAgentEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalFreeAgentPlugin =
	BaseFreeAgentPlugin<FreeAgentPluginOptions>;
export type ExternalFreeAgentPlugin<T extends FreeAgentPluginOptions> =
	BaseFreeAgentPlugin<T>;

export function freeagent<const T extends FreeAgentPluginOptions>(
	incomingOptions: FreeAgentPluginOptions & T = {} as FreeAgentPluginOptions &
		T,
): ExternalFreeAgentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freeagent',
		authConfig: freeAgentAuthConfig,
		schema: FreeAgentSchema,
		options,
		hooks: options.hooks,
		endpoints: freeAgentEndpointsNested,
		webhooks: {},
		endpointMeta: freeAgentEndpointMeta,
		endpointSchemas: freeAgentEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FreeAgentKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (!ctx.keys) throw new AuthMissingError('freeagent', 'oauth_2');
			const accessToken = await ctx.keys.get_access_token();
			if (!accessToken) throw new AuthMissingError('freeagent', 'oauth_2');
			return accessToken;
		},
	} satisfies InternalFreeAgentPlugin;
}

export type {
	FreeAgentEndpointInputs,
	FreeAgentEndpointOutputs,
} from './endpoints/types';
