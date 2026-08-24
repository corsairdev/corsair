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
	Clients,
	Company,
	Contacts,
	Estimates,
	Expenses,
	Invoices,
	Projects,
	Tasks,
	TimeEntries,
	Users,
} from './endpoints';
import type {
	HarvestEndpointInputs,
	HarvestEndpointOutputs,
} from './endpoints/types';
import {
	HarvestEndpointInputSchemas,
	HarvestEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HarvestSchema } from './schema';

export type HarvestPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	/**
	 * The Harvest account the token should act against.
	 *
	 * A Harvest access token can reach several accounts, so the account is a
	 * second credential rather than something the token implies. When it is
	 * omitted the plugin falls back to the stored `account_id` key, and finally
	 * to Harvest ID discovery, which only resolves when the token can reach
	 * exactly one Harvest account.
	 */
	accountId?: string;
	hooks?: InternalHarvestPlugin['hooks'];
	webhookHooks?: InternalHarvestPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof harvestEndpointsNested>;
};

export const harvestAuthConfig = {
	oauth_2: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type HarvestContext = CorsairPluginContext<
	typeof HarvestSchema,
	HarvestPluginOptions,
	undefined,
	typeof harvestAuthConfig
>;

export type HarvestKeyBuilderContext = KeyBuilderContext<HarvestPluginOptions>;

export type HarvestBoundEndpoints = BindEndpoints<
	typeof harvestEndpointsNested
>;

type HarvestEndpoint<K extends keyof HarvestEndpointOutputs> = CorsairEndpoint<
	HarvestContext,
	HarvestEndpointInputs[K],
	HarvestEndpointOutputs[K]
>;

export type HarvestEndpoints = {
	clientsList: HarvestEndpoint<'clientsList'>;
	clientsGet: HarvestEndpoint<'clientsGet'>;
	clientsCreate: HarvestEndpoint<'clientsCreate'>;
	clientsUpdate: HarvestEndpoint<'clientsUpdate'>;
	clientsDelete: HarvestEndpoint<'clientsDelete'>;
	contactsList: HarvestEndpoint<'contactsList'>;
	contactsCreate: HarvestEndpoint<'contactsCreate'>;
	contactsUpdate: HarvestEndpoint<'contactsUpdate'>;
	contactsDelete: HarvestEndpoint<'contactsDelete'>;
	companyGet: HarvestEndpoint<'companyGet'>;
	companyUpdate: HarvestEndpoint<'companyUpdate'>;
	projectsList: HarvestEndpoint<'projectsList'>;
	projectsGet: HarvestEndpoint<'projectsGet'>;
	projectsCreate: HarvestEndpoint<'projectsCreate'>;
	projectsUpdate: HarvestEndpoint<'projectsUpdate'>;
	projectsDelete: HarvestEndpoint<'projectsDelete'>;
	tasksList: HarvestEndpoint<'tasksList'>;
	tasksGet: HarvestEndpoint<'tasksGet'>;
	tasksCreate: HarvestEndpoint<'tasksCreate'>;
	tasksUpdate: HarvestEndpoint<'tasksUpdate'>;
	tasksDelete: HarvestEndpoint<'tasksDelete'>;
	timeEntriesList: HarvestEndpoint<'timeEntriesList'>;
	timeEntriesGet: HarvestEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: HarvestEndpoint<'timeEntriesCreate'>;
	timeEntriesUpdate: HarvestEndpoint<'timeEntriesUpdate'>;
	timeEntriesDelete: HarvestEndpoint<'timeEntriesDelete'>;
	usersList: HarvestEndpoint<'usersList'>;
	usersGet: HarvestEndpoint<'usersGet'>;
	usersCreate: HarvestEndpoint<'usersCreate'>;
	usersUpdate: HarvestEndpoint<'usersUpdate'>;
	usersDelete: HarvestEndpoint<'usersDelete'>;
	expensesCreate: HarvestEndpoint<'expensesCreate'>;
	expensesUpdate: HarvestEndpoint<'expensesUpdate'>;
	expenseCategoriesList: HarvestEndpoint<'expenseCategoriesList'>;
	invoicesList: HarvestEndpoint<'invoicesList'>;
	invoicesGet: HarvestEndpoint<'invoicesGet'>;
	invoicesCreate: HarvestEndpoint<'invoicesCreate'>;
	invoicesUpdate: HarvestEndpoint<'invoicesUpdate'>;
	invoicesDelete: HarvestEndpoint<'invoicesDelete'>;
	invoiceMessagesList: HarvestEndpoint<'invoiceMessagesList'>;
	invoiceMessagesCreate: HarvestEndpoint<'invoiceMessagesCreate'>;
	invoiceMessagesDelete: HarvestEndpoint<'invoiceMessagesDelete'>;
	invoicePaymentsList: HarvestEndpoint<'invoicePaymentsList'>;
	invoicePaymentsCreate: HarvestEndpoint<'invoicePaymentsCreate'>;
	invoicePaymentsDelete: HarvestEndpoint<'invoicePaymentsDelete'>;
	invoiceItemCategoriesList: HarvestEndpoint<'invoiceItemCategoriesList'>;
	invoiceItemCategoriesCreate: HarvestEndpoint<'invoiceItemCategoriesCreate'>;
	invoiceItemCategoriesDelete: HarvestEndpoint<'invoiceItemCategoriesDelete'>;
	estimatesGet: HarvestEndpoint<'estimatesGet'>;
	estimatesCreate: HarvestEndpoint<'estimatesCreate'>;
	estimatesUpdate: HarvestEndpoint<'estimatesUpdate'>;
	estimatesDelete: HarvestEndpoint<'estimatesDelete'>;
	estimateMessagesList: HarvestEndpoint<'estimateMessagesList'>;
	estimateMessagesCreate: HarvestEndpoint<'estimateMessagesCreate'>;
	estimateMessagesDelete: HarvestEndpoint<'estimateMessagesDelete'>;
	estimateItemCategoriesCreate: HarvestEndpoint<'estimateItemCategoriesCreate'>;
	estimateItemCategoriesUpdate: HarvestEndpoint<'estimateItemCategoriesUpdate'>;
};

/**
 * Harvest has no webhook, callback or streaming mechanism, so there are no
 * triggers to register. The OSS catalog lists zero triggers accordingly.
 */
export type HarvestWebhooks = Record<string, never>;

export type HarvestBoundWebhooks = BindWebhooks<HarvestWebhooks>;

const harvestEndpointsNested = {
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
		delete: Clients.remove,
	},
	contacts: {
		list: Contacts.list,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	company: {
		get: Company.get,
		update: Company.update,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.remove,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		delete: TimeEntries.remove,
	},
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		update: Users.update,
		delete: Users.remove,
	},
	expenses: {
		create: Expenses.create,
		update: Expenses.update,
		listCategories: Expenses.listCategories,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.remove,
		listMessages: Invoices.listMessages,
		createMessage: Invoices.createMessage,
		deleteMessage: Invoices.removeMessage,
		listPayments: Invoices.listPayments,
		createPayment: Invoices.createPayment,
		deletePayment: Invoices.removePayment,
		listItemCategories: Invoices.listItemCategories,
		createItemCategory: Invoices.createItemCategory,
		deleteItemCategory: Invoices.removeItemCategory,
	},
	estimates: {
		get: Estimates.get,
		create: Estimates.create,
		update: Estimates.update,
		delete: Estimates.remove,
		listMessages: Estimates.listMessages,
		createMessage: Estimates.createMessage,
		deleteMessage: Estimates.removeMessage,
		createItemCategory: Estimates.createItemCategory,
		updateItemCategory: Estimates.updateItemCategory,
	},
} as const;

const harvestWebhooksNested = {} as const;

export const harvestEndpointSchemas = {
	'clients.list': {
		input: HarvestEndpointInputSchemas.clientsList,
		output: HarvestEndpointOutputSchemas.clientsList,
	},
	'clients.get': {
		input: HarvestEndpointInputSchemas.clientsGet,
		output: HarvestEndpointOutputSchemas.clientsGet,
	},
	'clients.create': {
		input: HarvestEndpointInputSchemas.clientsCreate,
		output: HarvestEndpointOutputSchemas.clientsCreate,
	},
	'clients.update': {
		input: HarvestEndpointInputSchemas.clientsUpdate,
		output: HarvestEndpointOutputSchemas.clientsUpdate,
	},
	'clients.delete': {
		input: HarvestEndpointInputSchemas.clientsDelete,
		output: HarvestEndpointOutputSchemas.clientsDelete,
	},
	'contacts.list': {
		input: HarvestEndpointInputSchemas.contactsList,
		output: HarvestEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: HarvestEndpointInputSchemas.contactsCreate,
		output: HarvestEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: HarvestEndpointInputSchemas.contactsUpdate,
		output: HarvestEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: HarvestEndpointInputSchemas.contactsDelete,
		output: HarvestEndpointOutputSchemas.contactsDelete,
	},
	'company.get': {
		input: HarvestEndpointInputSchemas.companyGet,
		output: HarvestEndpointOutputSchemas.companyGet,
	},
	'company.update': {
		input: HarvestEndpointInputSchemas.companyUpdate,
		output: HarvestEndpointOutputSchemas.companyUpdate,
	},
	'projects.list': {
		input: HarvestEndpointInputSchemas.projectsList,
		output: HarvestEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: HarvestEndpointInputSchemas.projectsGet,
		output: HarvestEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: HarvestEndpointInputSchemas.projectsCreate,
		output: HarvestEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: HarvestEndpointInputSchemas.projectsUpdate,
		output: HarvestEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: HarvestEndpointInputSchemas.projectsDelete,
		output: HarvestEndpointOutputSchemas.projectsDelete,
	},
	'tasks.list': {
		input: HarvestEndpointInputSchemas.tasksList,
		output: HarvestEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: HarvestEndpointInputSchemas.tasksGet,
		output: HarvestEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: HarvestEndpointInputSchemas.tasksCreate,
		output: HarvestEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: HarvestEndpointInputSchemas.tasksUpdate,
		output: HarvestEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: HarvestEndpointInputSchemas.tasksDelete,
		output: HarvestEndpointOutputSchemas.tasksDelete,
	},
	'timeEntries.list': {
		input: HarvestEndpointInputSchemas.timeEntriesList,
		output: HarvestEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.get': {
		input: HarvestEndpointInputSchemas.timeEntriesGet,
		output: HarvestEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: HarvestEndpointInputSchemas.timeEntriesCreate,
		output: HarvestEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: HarvestEndpointInputSchemas.timeEntriesUpdate,
		output: HarvestEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: HarvestEndpointInputSchemas.timeEntriesDelete,
		output: HarvestEndpointOutputSchemas.timeEntriesDelete,
	},
	'users.list': {
		input: HarvestEndpointInputSchemas.usersList,
		output: HarvestEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: HarvestEndpointInputSchemas.usersGet,
		output: HarvestEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: HarvestEndpointInputSchemas.usersCreate,
		output: HarvestEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: HarvestEndpointInputSchemas.usersUpdate,
		output: HarvestEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: HarvestEndpointInputSchemas.usersDelete,
		output: HarvestEndpointOutputSchemas.usersDelete,
	},
	'expenses.create': {
		input: HarvestEndpointInputSchemas.expensesCreate,
		output: HarvestEndpointOutputSchemas.expensesCreate,
	},
	'expenses.update': {
		input: HarvestEndpointInputSchemas.expensesUpdate,
		output: HarvestEndpointOutputSchemas.expensesUpdate,
	},
	'expenses.listCategories': {
		input: HarvestEndpointInputSchemas.expenseCategoriesList,
		output: HarvestEndpointOutputSchemas.expenseCategoriesList,
	},
	'invoices.list': {
		input: HarvestEndpointInputSchemas.invoicesList,
		output: HarvestEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: HarvestEndpointInputSchemas.invoicesGet,
		output: HarvestEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: HarvestEndpointInputSchemas.invoicesCreate,
		output: HarvestEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: HarvestEndpointInputSchemas.invoicesUpdate,
		output: HarvestEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: HarvestEndpointInputSchemas.invoicesDelete,
		output: HarvestEndpointOutputSchemas.invoicesDelete,
	},
	'invoices.listMessages': {
		input: HarvestEndpointInputSchemas.invoiceMessagesList,
		output: HarvestEndpointOutputSchemas.invoiceMessagesList,
	},
	'invoices.createMessage': {
		input: HarvestEndpointInputSchemas.invoiceMessagesCreate,
		output: HarvestEndpointOutputSchemas.invoiceMessagesCreate,
	},
	'invoices.deleteMessage': {
		input: HarvestEndpointInputSchemas.invoiceMessagesDelete,
		output: HarvestEndpointOutputSchemas.invoiceMessagesDelete,
	},
	'invoices.listPayments': {
		input: HarvestEndpointInputSchemas.invoicePaymentsList,
		output: HarvestEndpointOutputSchemas.invoicePaymentsList,
	},
	'invoices.createPayment': {
		input: HarvestEndpointInputSchemas.invoicePaymentsCreate,
		output: HarvestEndpointOutputSchemas.invoicePaymentsCreate,
	},
	'invoices.deletePayment': {
		input: HarvestEndpointInputSchemas.invoicePaymentsDelete,
		output: HarvestEndpointOutputSchemas.invoicePaymentsDelete,
	},
	'invoices.listItemCategories': {
		input: HarvestEndpointInputSchemas.invoiceItemCategoriesList,
		output: HarvestEndpointOutputSchemas.invoiceItemCategoriesList,
	},
	'invoices.createItemCategory': {
		input: HarvestEndpointInputSchemas.invoiceItemCategoriesCreate,
		output: HarvestEndpointOutputSchemas.invoiceItemCategoriesCreate,
	},
	'invoices.deleteItemCategory': {
		input: HarvestEndpointInputSchemas.invoiceItemCategoriesDelete,
		output: HarvestEndpointOutputSchemas.invoiceItemCategoriesDelete,
	},
	'estimates.get': {
		input: HarvestEndpointInputSchemas.estimatesGet,
		output: HarvestEndpointOutputSchemas.estimatesGet,
	},
	'estimates.create': {
		input: HarvestEndpointInputSchemas.estimatesCreate,
		output: HarvestEndpointOutputSchemas.estimatesCreate,
	},
	'estimates.update': {
		input: HarvestEndpointInputSchemas.estimatesUpdate,
		output: HarvestEndpointOutputSchemas.estimatesUpdate,
	},
	'estimates.delete': {
		input: HarvestEndpointInputSchemas.estimatesDelete,
		output: HarvestEndpointOutputSchemas.estimatesDelete,
	},
	'estimates.listMessages': {
		input: HarvestEndpointInputSchemas.estimateMessagesList,
		output: HarvestEndpointOutputSchemas.estimateMessagesList,
	},
	'estimates.createMessage': {
		input: HarvestEndpointInputSchemas.estimateMessagesCreate,
		output: HarvestEndpointOutputSchemas.estimateMessagesCreate,
	},
	'estimates.deleteMessage': {
		input: HarvestEndpointInputSchemas.estimateMessagesDelete,
		output: HarvestEndpointOutputSchemas.estimateMessagesDelete,
	},
	'estimates.createItemCategory': {
		input: HarvestEndpointInputSchemas.estimateItemCategoriesCreate,
		output: HarvestEndpointOutputSchemas.estimateItemCategoriesCreate,
	},
	'estimates.updateItemCategory': {
		input: HarvestEndpointInputSchemas.estimateItemCategoriesUpdate,
		output: HarvestEndpointOutputSchemas.estimateItemCategoriesUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof harvestEndpointsNested
>;

export const harvestWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof harvestWebhooksNested
	>;

export const harvestEndpointMeta = {
	'clients.list': {
		riskLevel: 'read',
		description: 'List clients',
	},
	'clients.get': {
		riskLevel: 'read',
		description: 'Get a client by id',
	},
	'clients.create': {
		riskLevel: 'write',
		description: 'Create a client',
	},
	'clients.update': {
		riskLevel: 'write',
		description: 'Update a client',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		description: 'Delete a client',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List client contacts',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a client contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a client contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a client contact',
	},
	'company.get': {
		riskLevel: 'read',
		description: 'Get company settings',
	},
	'company.update': {
		riskLevel: 'write',
		description: 'Update the writable company settings',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by id',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and its time entries and expenses',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task by id',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a time entry by id',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Log time against a project and task',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a time entry',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List team members',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a team member by id',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a team member and email them an invitation',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a team member',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team member',
	},
	'expenses.create': {
		riskLevel: 'write',
		description: 'Record an expense against a project',
	},
	'expenses.update': {
		riskLevel: 'write',
		description: 'Update an expense',
	},
	'expenses.listCategories': {
		riskLevel: 'read',
		description: 'List expense categories',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice by id',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create a draft invoice',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an invoice',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice',
	},
	'invoices.listMessages': {
		riskLevel: 'read',
		description: 'List the messages recorded against an invoice',
	},
	'invoices.createMessage': {
		riskLevel: 'write',
		description:
			'Create an invoice message; event_type "send" emails the client',
	},
	'invoices.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Delete an invoice message',
	},
	'invoices.listPayments': {
		riskLevel: 'read',
		description: 'List payments recorded against an invoice',
	},
	'invoices.createPayment': {
		riskLevel: 'write',
		description: 'Record a payment against an invoice',
	},
	'invoices.deletePayment': {
		riskLevel: 'destructive',
		description: 'Delete a recorded payment',
	},
	'invoices.listItemCategories': {
		riskLevel: 'read',
		description: 'List invoice item categories',
	},
	'invoices.createItemCategory': {
		riskLevel: 'write',
		description: 'Create an invoice item category',
	},
	'invoices.deleteItemCategory': {
		riskLevel: 'destructive',
		description: 'Delete an unused invoice item category',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Get an estimate by id',
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create a draft estimate',
	},
	'estimates.update': {
		riskLevel: 'write',
		description: 'Update an estimate',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an estimate',
	},
	'estimates.listMessages': {
		riskLevel: 'read',
		description: 'List the messages recorded against an estimate',
	},
	'estimates.createMessage': {
		riskLevel: 'write',
		description:
			'Create an estimate message; event_type "send" emails the client',
	},
	'estimates.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Delete an estimate message',
	},
	'estimates.createItemCategory': {
		riskLevel: 'write',
		description: 'Create an estimate item category',
	},
	'estimates.updateItemCategory': {
		riskLevel: 'write',
		description: 'Rename an estimate item category',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof harvestEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseHarvestPlugin<T extends HarvestPluginOptions> = CorsairPlugin<
	'harvest',
	typeof HarvestSchema,
	typeof harvestEndpointsNested,
	typeof harvestWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHarvestPlugin = BaseHarvestPlugin<HarvestPluginOptions>;

export type ExternalHarvestPlugin<T extends HarvestPluginOptions> =
	BaseHarvestPlugin<T>;

/**
 * Builds the Harvest plugin.
 *
 * Harvest authenticates with a bearer token — an OAuth 2.0 access token, or a
 * personal access token, which is byte-compatible with one — alongside a
 * `Harvest-Account-Id` header naming the account it should act on.
 */
export function harvest<const T extends HarvestPluginOptions>(
	incomingOptions: HarvestPluginOptions & T = {} as HarvestPluginOptions & T,
): ExternalHarvestPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'harvest',
		authConfig: harvestAuthConfig,
		schema: HarvestSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: harvestEndpointsNested,
		webhooks: harvestWebhooksNested,
		endpointMeta: harvestEndpointMeta,
		endpointSchemas: harvestEndpointSchemas,
		webhookSchemas: harvestWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HarvestKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalHarvestPlugin;
}

export type {
	HarvestEndpointInputs,
	HarvestEndpointOutputs,
	HarvestLineItem,
	HarvestLineItemInput,
} from './endpoints/types';
export type {
	HarvestClientEntity,
	HarvestCompanyEntity,
	HarvestContactEntity,
	HarvestEstimateEntity,
	HarvestExpenseCategoryEntity,
	HarvestInvoiceEntity,
	HarvestInvoiceItemCategoryEntity,
	HarvestProjectEntity,
	HarvestTaskEntity,
	HarvestUserEntity,
} from './schema/database';
