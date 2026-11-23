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
	Activities,
	Companies,
	Contacts,
	Deals,
	Invoices,
	Profile,
	Projects,
	Session,
	Users,
} from './endpoints';
import type {
	MocoEndpointInputs,
	MocoEndpointOutputs,
} from './endpoints/types';
import {
	MocoEndpointInputSchemas,
	MocoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MocoSchema } from './schema';

export type MocoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Moco API key, from profile > Integrations or the account settings. */
	key?: string;
	/** The account subdomain: `{subdomain}.mocoapp.com`. */
	subdomain?: string;
	hooks?: InternalMocoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mocoEndpointsNested>;
};

export type MocoContext = CorsairPluginContext<
	typeof MocoSchema,
	MocoPluginOptions,
	undefined,
	typeof mocoAuthConfig
>;

export type MocoKeyBuilderContext = KeyBuilderContext<
	MocoPluginOptions,
	typeof mocoAuthConfig
>;

export type MocoBoundEndpoints = BindEndpoints<typeof mocoEndpointsNested>;

type MocoEndpoint<K extends keyof MocoEndpointOutputs> = CorsairEndpoint<
	MocoContext,
	MocoEndpointInputs[K],
	MocoEndpointOutputs[K]
>;

export type MocoEndpoints = {
	sessionVerify: MocoEndpoint<'sessionVerify'>;
	profileGet: MocoEndpoint<'profileGet'>;
	activitiesList: MocoEndpoint<'activitiesList'>;
	activitiesGet: MocoEndpoint<'activitiesGet'>;
	activitiesCreate: MocoEndpoint<'activitiesCreate'>;
	activitiesUpdate: MocoEndpoint<'activitiesUpdate'>;
	activitiesDelete: MocoEndpoint<'activitiesDelete'>;
	projectsList: MocoEndpoint<'projectsList'>;
	projectsGet: MocoEndpoint<'projectsGet'>;
	projectsCreate: MocoEndpoint<'projectsCreate'>;
	projectsUpdate: MocoEndpoint<'projectsUpdate'>;
	projectsArchive: MocoEndpoint<'projectsArchive'>;
	projectsUnarchive: MocoEndpoint<'projectsUnarchive'>;
	projectsReport: MocoEndpoint<'projectsReport'>;
	companiesList: MocoEndpoint<'companiesList'>;
	companiesGet: MocoEndpoint<'companiesGet'>;
	companiesCreate: MocoEndpoint<'companiesCreate'>;
	companiesUpdate: MocoEndpoint<'companiesUpdate'>;
	companiesArchive: MocoEndpoint<'companiesArchive'>;
	companiesUnarchive: MocoEndpoint<'companiesUnarchive'>;
	contactsList: MocoEndpoint<'contactsList'>;
	contactsGet: MocoEndpoint<'contactsGet'>;
	contactsCreate: MocoEndpoint<'contactsCreate'>;
	contactsUpdate: MocoEndpoint<'contactsUpdate'>;
	contactsDelete: MocoEndpoint<'contactsDelete'>;
	dealsList: MocoEndpoint<'dealsList'>;
	dealsGet: MocoEndpoint<'dealsGet'>;
	dealsCreate: MocoEndpoint<'dealsCreate'>;
	dealsUpdate: MocoEndpoint<'dealsUpdate'>;
	dealsDelete: MocoEndpoint<'dealsDelete'>;
	invoicesList: MocoEndpoint<'invoicesList'>;
	invoicesGet: MocoEndpoint<'invoicesGet'>;
	invoicesUpdateStatus: MocoEndpoint<'invoicesUpdateStatus'>;
	usersList: MocoEndpoint<'usersList'>;
	usersGet: MocoEndpoint<'usersGet'>;
};

const mocoEndpointsNested = {
	session: {
		verify: Session.verify,
	},
	profile: {
		get: Profile.get,
	},
	activities: {
		list: Activities.list,
		get: Activities.get,
		create: Activities.create,
		update: Activities.update,
		delete: Activities.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		archive: Projects.archive,
		unarchive: Projects.unarchive,
		report: Projects.report,
	},
	companies: {
		list: Companies.list,
		get: Companies.get,
		create: Companies.create,
		update: Companies.update,
		archive: Companies.archive,
		unarchive: Companies.unarchive,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	deals: {
		list: Deals.list,
		get: Deals.get,
		create: Deals.create,
		update: Deals.update,
		delete: Deals.remove,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		updateStatus: Invoices.updateStatus,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
} as const;

export const mocoEndpointSchemas = {
	'session.verify': {
		input: MocoEndpointInputSchemas.sessionVerify,
		output: MocoEndpointOutputSchemas.sessionVerify,
	},
	'profile.get': {
		input: MocoEndpointInputSchemas.profileGet,
		output: MocoEndpointOutputSchemas.profileGet,
	},
	'activities.list': {
		input: MocoEndpointInputSchemas.activitiesList,
		output: MocoEndpointOutputSchemas.activitiesList,
	},
	'activities.get': {
		input: MocoEndpointInputSchemas.activitiesGet,
		output: MocoEndpointOutputSchemas.activitiesGet,
	},
	'activities.create': {
		input: MocoEndpointInputSchemas.activitiesCreate,
		output: MocoEndpointOutputSchemas.activitiesCreate,
	},
	'activities.update': {
		input: MocoEndpointInputSchemas.activitiesUpdate,
		output: MocoEndpointOutputSchemas.activitiesUpdate,
	},
	'activities.delete': {
		input: MocoEndpointInputSchemas.activitiesDelete,
		output: MocoEndpointOutputSchemas.activitiesDelete,
	},
	'projects.list': {
		input: MocoEndpointInputSchemas.projectsList,
		output: MocoEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: MocoEndpointInputSchemas.projectsGet,
		output: MocoEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: MocoEndpointInputSchemas.projectsCreate,
		output: MocoEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: MocoEndpointInputSchemas.projectsUpdate,
		output: MocoEndpointOutputSchemas.projectsUpdate,
	},
	'projects.archive': {
		input: MocoEndpointInputSchemas.projectsArchive,
		output: MocoEndpointOutputSchemas.projectsArchive,
	},
	'projects.unarchive': {
		input: MocoEndpointInputSchemas.projectsUnarchive,
		output: MocoEndpointOutputSchemas.projectsUnarchive,
	},
	'projects.report': {
		input: MocoEndpointInputSchemas.projectsReport,
		output: MocoEndpointOutputSchemas.projectsReport,
	},
	'companies.list': {
		input: MocoEndpointInputSchemas.companiesList,
		output: MocoEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: MocoEndpointInputSchemas.companiesGet,
		output: MocoEndpointOutputSchemas.companiesGet,
	},
	'companies.create': {
		input: MocoEndpointInputSchemas.companiesCreate,
		output: MocoEndpointOutputSchemas.companiesCreate,
	},
	'companies.update': {
		input: MocoEndpointInputSchemas.companiesUpdate,
		output: MocoEndpointOutputSchemas.companiesUpdate,
	},
	'companies.archive': {
		input: MocoEndpointInputSchemas.companiesArchive,
		output: MocoEndpointOutputSchemas.companiesArchive,
	},
	'companies.unarchive': {
		input: MocoEndpointInputSchemas.companiesUnarchive,
		output: MocoEndpointOutputSchemas.companiesUnarchive,
	},
	'contacts.list': {
		input: MocoEndpointInputSchemas.contactsList,
		output: MocoEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: MocoEndpointInputSchemas.contactsGet,
		output: MocoEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: MocoEndpointInputSchemas.contactsCreate,
		output: MocoEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: MocoEndpointInputSchemas.contactsUpdate,
		output: MocoEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: MocoEndpointInputSchemas.contactsDelete,
		output: MocoEndpointOutputSchemas.contactsDelete,
	},
	'deals.list': {
		input: MocoEndpointInputSchemas.dealsList,
		output: MocoEndpointOutputSchemas.dealsList,
	},
	'deals.get': {
		input: MocoEndpointInputSchemas.dealsGet,
		output: MocoEndpointOutputSchemas.dealsGet,
	},
	'deals.create': {
		input: MocoEndpointInputSchemas.dealsCreate,
		output: MocoEndpointOutputSchemas.dealsCreate,
	},
	'deals.update': {
		input: MocoEndpointInputSchemas.dealsUpdate,
		output: MocoEndpointOutputSchemas.dealsUpdate,
	},
	'deals.delete': {
		input: MocoEndpointInputSchemas.dealsDelete,
		output: MocoEndpointOutputSchemas.dealsDelete,
	},
	'invoices.list': {
		input: MocoEndpointInputSchemas.invoicesList,
		output: MocoEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: MocoEndpointInputSchemas.invoicesGet,
		output: MocoEndpointOutputSchemas.invoicesGet,
	},
	'invoices.updateStatus': {
		input: MocoEndpointInputSchemas.invoicesUpdateStatus,
		output: MocoEndpointOutputSchemas.invoicesUpdateStatus,
	},
	'users.list': {
		input: MocoEndpointInputSchemas.usersList,
		output: MocoEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: MocoEndpointInputSchemas.usersGet,
		output: MocoEndpointOutputSchemas.usersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mocoEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const mocoEndpointMeta = {
	'session.verify': {
		riskLevel: 'read',
		description: 'Verify the API key and read the user identity it belongs to',
	},
	'profile.get': {
		riskLevel: 'read',
		description: 'Read the profile of the authenticated user',
	},
	'activities.list': {
		riskLevel: 'read',
		description:
			'List time entries with date, user, project, task, billable and billed filters, one page at a time',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Read one time entry',
	},
	'activities.create': {
		riskLevel: 'write',
		description:
			'Create a time entry on a project task for the authenticated user, in hours or seconds',
	},
	'activities.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'activities.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a time entry; billed entries cannot be deleted this way',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects with company, leader, tag, date and archive filters, one page at a time',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project, optionally embedding the client',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project for a client',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.archive': {
		riskLevel: 'write',
		description: 'Archive a project; unarchive reverses it',
	},
	'projects.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a project',
	},
	'projects.report': {
		riskLevel: 'read',
		description:
			'Read a project business report: budget, invoiced totals, hours and costs',
	},
	'companies.list': {
		riskLevel: 'read',
		description:
			'List clients, suppliers and organizations, one page at a time',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Read one company',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a client, supplier or organization',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update a company',
	},
	'companies.archive': {
		riskLevel: 'write',
		description: 'Archive a company; unarchive reverses it',
	},
	'companies.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a company',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contact persons, one page at a time',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact person',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact person for a company',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact person',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact person',
	},
	'deals.list': {
		riskLevel: 'read',
		description:
			'List deals with status, close date, company and contact filters, one page at a time',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Read one deal',
	},
	'deals.create': {
		riskLevel: 'write',
		description: 'Create a deal in a deal category',
	},
	'deals.update': {
		riskLevel: 'write',
		description: 'Update a deal, including its status',
	},
	'deals.delete': {
		riskLevel: 'destructive',
		description: 'Delete a deal',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices with status, date, client and project filters, one page at a time',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Read one invoice with its line items, payments and reminders',
	},
	'invoices.updateStatus': {
		riskLevel: 'write',
		description:
			'Move an invoice to created, sent, overdue or ignored; locked invoices refuse the change',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List account users, one page at a time',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mocoEndpointsNested>;

/**
 * The API key travels in the Authorization header; the account subdomain is
 * a second account-level field the request builder needs.
 */
export const mocoAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMocoPlugin<T extends MocoPluginOptions> = CorsairPlugin<
	'moco',
	typeof MocoSchema,
	typeof mocoEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof mocoAuthConfig
>;

export type InternalMocoPlugin = BaseMocoPlugin<MocoPluginOptions>;

export type ExternalMocoPlugin<T extends MocoPluginOptions> = BaseMocoPlugin<T>;

export function moco<const T extends MocoPluginOptions>(
	incomingOptions: MocoPluginOptions & T = {} as MocoPluginOptions & T,
): ExternalMocoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moco',
		schema: MocoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mocoEndpointsNested,
		webhooks: {},
		authConfig: mocoAuthConfig,
		endpointMeta: mocoEndpointMeta,
		endpointSchemas: mocoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MocoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('moco', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMocoPlugin;
}

export { MocoAPIError } from './client';

export type {
	ActivitiesListInput,
	Activity,
	ActivityDeleteResponse,
	ActivityUpsertInput,
	CompaniesListInput,
	Company,
	CompanyArchiveResponse,
	CompanyUpsertInput,
	ContactDeleteResponse,
	ContactPerson,
	ContactsListInput,
	ContactUpsertInput,
	Deal,
	DealDeleteResponse,
	DealsListInput,
	DealUpsertInput,
	IdInput,
	Invoice,
	InvoiceDetail,
	InvoicesListInput,
	InvoiceUpdateStatusInput,
	InvoiceUpdateStatusResponse,
	MocoEndpointInputs,
	MocoEndpointOutputs,
	MocoUser,
	Profile,
	Project,
	ProjectArchiveResponse,
	ProjectGetInput,
	ProjectReportResponse,
	ProjectsListInput,
	ProjectUpsertInput,
	SessionVerifyResponse,
	UserGetInput,
	UsersListInput,
} from './endpoints/types';
