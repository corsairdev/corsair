import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Clients,
	Estimates,
	Expenses,
	Invoices,
	Projects,
	Tasks,
	TimeEntries,
	Users,
} from './endpoints';
import type {
	FreshBooksEndpointInputs,
	FreshBooksEndpointOutputs,
} from './endpoints/types';
import {
	FreshBooksEndpointInputSchemas,
	FreshBooksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { FreshBooksSchema } from './schema';

export type FreshBooksPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFreshBooksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freshBooksEndpointsNested>;
};

export type FreshBooksContext = CorsairPluginContext<
	typeof FreshBooksSchema,
	FreshBooksPluginOptions
>;

export type FreshBooksKeyBuilderContext =
	KeyBuilderContext<FreshBooksPluginOptions>;

export type FreshBooksBoundEndpoints = BindEndpoints<
	typeof freshBooksEndpointsNested
>;

type FreshBooksEndpoint<K extends keyof FreshBooksEndpointOutputs> =
	CorsairEndpoint<
		FreshBooksContext,
		FreshBooksEndpointInputs[K],
		FreshBooksEndpointOutputs[K]
	>;

export type FreshBooksEndpoints = {
	usersMe: FreshBooksEndpoint<'usersMe'>;
	clientsList: FreshBooksEndpoint<'clientsList'>;
	clientsGet: FreshBooksEndpoint<'clientsGet'>;
	clientsCreate: FreshBooksEndpoint<'clientsCreate'>;
	clientsUpdate: FreshBooksEndpoint<'clientsUpdate'>;
	clientsDelete: FreshBooksEndpoint<'clientsDelete'>;
	invoicesList: FreshBooksEndpoint<'invoicesList'>;
	invoicesGet: FreshBooksEndpoint<'invoicesGet'>;
	invoicesCreate: FreshBooksEndpoint<'invoicesCreate'>;
	invoicesUpdate: FreshBooksEndpoint<'invoicesUpdate'>;
	invoicesMarkSent: FreshBooksEndpoint<'invoicesMarkSent'>;
	invoicesSendEmail: FreshBooksEndpoint<'invoicesSendEmail'>;
	invoicesDelete: FreshBooksEndpoint<'invoicesDelete'>;
	estimatesList: FreshBooksEndpoint<'estimatesList'>;
	estimatesGet: FreshBooksEndpoint<'estimatesGet'>;
	estimatesCreate: FreshBooksEndpoint<'estimatesCreate'>;
	estimatesUpdate: FreshBooksEndpoint<'estimatesUpdate'>;
	estimatesDelete: FreshBooksEndpoint<'estimatesDelete'>;
	expensesList: FreshBooksEndpoint<'expensesList'>;
	expensesGet: FreshBooksEndpoint<'expensesGet'>;
	expensesCreate: FreshBooksEndpoint<'expensesCreate'>;
	expensesUpdate: FreshBooksEndpoint<'expensesUpdate'>;
	expensesDelete: FreshBooksEndpoint<'expensesDelete'>;
	tasksList: FreshBooksEndpoint<'tasksList'>;
	tasksGet: FreshBooksEndpoint<'tasksGet'>;
	tasksCreate: FreshBooksEndpoint<'tasksCreate'>;
	tasksUpdate: FreshBooksEndpoint<'tasksUpdate'>;
	tasksDelete: FreshBooksEndpoint<'tasksDelete'>;
	projectsList: FreshBooksEndpoint<'projectsList'>;
	projectsGet: FreshBooksEndpoint<'projectsGet'>;
	projectsCreate: FreshBooksEndpoint<'projectsCreate'>;
	projectsUpdate: FreshBooksEndpoint<'projectsUpdate'>;
	projectsDelete: FreshBooksEndpoint<'projectsDelete'>;
	timeEntriesList: FreshBooksEndpoint<'timeEntriesList'>;
	timeEntriesGet: FreshBooksEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: FreshBooksEndpoint<'timeEntriesCreate'>;
	timeEntriesUpdate: FreshBooksEndpoint<'timeEntriesUpdate'>;
	timeEntriesDelete: FreshBooksEndpoint<'timeEntriesDelete'>;
};

const freshBooksEndpointsNested = {
	users: {
		me: Users.me,
	},
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
		delete: Clients.remove,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		markSent: Invoices.markSent,
		sendEmail: Invoices.sendEmail,
		delete: Invoices.remove,
	},
	estimates: {
		list: Estimates.list,
		get: Estimates.get,
		create: Estimates.create,
		update: Estimates.update,
		delete: Estimates.remove,
	},
	expenses: {
		list: Expenses.list,
		get: Expenses.get,
		create: Expenses.create,
		update: Expenses.update,
		delete: Expenses.remove,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		delete: TimeEntries.remove,
	},
} as const;

export const freshBooksEndpointSchemas = {
	'users.me': {
		input: FreshBooksEndpointInputSchemas.usersMe,
		output: FreshBooksEndpointOutputSchemas.usersMe,
	},
	'clients.list': {
		input: FreshBooksEndpointInputSchemas.clientsList,
		output: FreshBooksEndpointOutputSchemas.clientsList,
	},
	'clients.get': {
		input: FreshBooksEndpointInputSchemas.clientsGet,
		output: FreshBooksEndpointOutputSchemas.clientsGet,
	},
	'clients.create': {
		input: FreshBooksEndpointInputSchemas.clientsCreate,
		output: FreshBooksEndpointOutputSchemas.clientsCreate,
	},
	'clients.update': {
		input: FreshBooksEndpointInputSchemas.clientsUpdate,
		output: FreshBooksEndpointOutputSchemas.clientsUpdate,
	},
	'clients.delete': {
		input: FreshBooksEndpointInputSchemas.clientsDelete,
		output: FreshBooksEndpointOutputSchemas.clientsDelete,
	},
	'invoices.list': {
		input: FreshBooksEndpointInputSchemas.invoicesList,
		output: FreshBooksEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: FreshBooksEndpointInputSchemas.invoicesGet,
		output: FreshBooksEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: FreshBooksEndpointInputSchemas.invoicesCreate,
		output: FreshBooksEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: FreshBooksEndpointInputSchemas.invoicesUpdate,
		output: FreshBooksEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.markSent': {
		input: FreshBooksEndpointInputSchemas.invoicesMarkSent,
		output: FreshBooksEndpointOutputSchemas.invoicesMarkSent,
	},
	'invoices.sendEmail': {
		input: FreshBooksEndpointInputSchemas.invoicesSendEmail,
		output: FreshBooksEndpointOutputSchemas.invoicesSendEmail,
	},
	'invoices.delete': {
		input: FreshBooksEndpointInputSchemas.invoicesDelete,
		output: FreshBooksEndpointOutputSchemas.invoicesDelete,
	},
	'estimates.list': {
		input: FreshBooksEndpointInputSchemas.estimatesList,
		output: FreshBooksEndpointOutputSchemas.estimatesList,
	},
	'estimates.get': {
		input: FreshBooksEndpointInputSchemas.estimatesGet,
		output: FreshBooksEndpointOutputSchemas.estimatesGet,
	},
	'estimates.create': {
		input: FreshBooksEndpointInputSchemas.estimatesCreate,
		output: FreshBooksEndpointOutputSchemas.estimatesCreate,
	},
	'estimates.update': {
		input: FreshBooksEndpointInputSchemas.estimatesUpdate,
		output: FreshBooksEndpointOutputSchemas.estimatesUpdate,
	},
	'estimates.delete': {
		input: FreshBooksEndpointInputSchemas.estimatesDelete,
		output: FreshBooksEndpointOutputSchemas.estimatesDelete,
	},
	'expenses.list': {
		input: FreshBooksEndpointInputSchemas.expensesList,
		output: FreshBooksEndpointOutputSchemas.expensesList,
	},
	'expenses.get': {
		input: FreshBooksEndpointInputSchemas.expensesGet,
		output: FreshBooksEndpointOutputSchemas.expensesGet,
	},
	'expenses.create': {
		input: FreshBooksEndpointInputSchemas.expensesCreate,
		output: FreshBooksEndpointOutputSchemas.expensesCreate,
	},
	'expenses.update': {
		input: FreshBooksEndpointInputSchemas.expensesUpdate,
		output: FreshBooksEndpointOutputSchemas.expensesUpdate,
	},
	'expenses.delete': {
		input: FreshBooksEndpointInputSchemas.expensesDelete,
		output: FreshBooksEndpointOutputSchemas.expensesDelete,
	},
	'tasks.list': {
		input: FreshBooksEndpointInputSchemas.tasksList,
		output: FreshBooksEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: FreshBooksEndpointInputSchemas.tasksGet,
		output: FreshBooksEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: FreshBooksEndpointInputSchemas.tasksCreate,
		output: FreshBooksEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: FreshBooksEndpointInputSchemas.tasksUpdate,
		output: FreshBooksEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: FreshBooksEndpointInputSchemas.tasksDelete,
		output: FreshBooksEndpointOutputSchemas.tasksDelete,
	},
	'projects.list': {
		input: FreshBooksEndpointInputSchemas.projectsList,
		output: FreshBooksEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: FreshBooksEndpointInputSchemas.projectsGet,
		output: FreshBooksEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: FreshBooksEndpointInputSchemas.projectsCreate,
		output: FreshBooksEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: FreshBooksEndpointInputSchemas.projectsUpdate,
		output: FreshBooksEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: FreshBooksEndpointInputSchemas.projectsDelete,
		output: FreshBooksEndpointOutputSchemas.projectsDelete,
	},
	'timeEntries.list': {
		input: FreshBooksEndpointInputSchemas.timeEntriesList,
		output: FreshBooksEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.get': {
		input: FreshBooksEndpointInputSchemas.timeEntriesGet,
		output: FreshBooksEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: FreshBooksEndpointInputSchemas.timeEntriesCreate,
		output: FreshBooksEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: FreshBooksEndpointInputSchemas.timeEntriesUpdate,
		output: FreshBooksEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: FreshBooksEndpointInputSchemas.timeEntriesDelete,
		output: FreshBooksEndpointOutputSchemas.timeEntriesDelete,
	},
	// No `satisfies RequiredPluginEndpointSchemas` here: with 37 operations and
	// these schema sizes, instantiating it exceeds TypeScript's depth limit, as
	// hubspot's larger registry already does. Exhaustiveness is still checked by
	// `satisfies InternalFreshBooksPlugin` on the plugin object below.
} as const;

const defaultAuthType = 'api_key' as const;

const freshBooksEndpointMeta = {
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the authenticated FreshBooks identity, including the accountId and businessId the other endpoints need',
	},
	'clients.list': {
		riskLevel: 'read',
		description: 'List clients with paging',
	},
	'clients.get': {
		riskLevel: 'read',
		description: 'Read one client',
	},
	'clients.create': {
		riskLevel: 'write',
		description: 'Create a client',
	},
	'clients.update': {
		riskLevel: 'write',
		description: 'Change client fields',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft-delete a client by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices with paging',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Read one invoice, including its amount and status',
	},
	'invoices.create': {
		riskLevel: 'write',
		description:
			'Create a draft invoice. Concurrent creates without invoice_number can collide (409); retrying succeeds',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Change invoice fields on a draft or sent invoice',
	},
	'invoices.markSent': {
		riskLevel: 'write',
		description:
			'Mark a draft invoice as sent without emailing anyone; the client-facing status changes',
	},
	'invoices.sendEmail': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Email the invoice to the client now. The email goes out immediately and cannot be unsent',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft-delete an invoice by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it',
	},
	'estimates.list': {
		riskLevel: 'read',
		description: 'List estimates with paging',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Read one estimate, including its status',
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create an estimate for a client',
	},
	'estimates.update': {
		riskLevel: 'write',
		description: 'Change estimate fields',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft-delete an estimate by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it',
	},
	'expenses.list': {
		riskLevel: 'read',
		description: 'List expenses with paging',
	},
	'expenses.get': {
		riskLevel: 'read',
		description: 'Read one expense',
	},
	'expenses.create': {
		riskLevel: 'write',
		description: 'Record an expense',
	},
	'expenses.update': {
		riskLevel: 'write',
		description: 'Change expense fields',
	},
	'expenses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft-delete an expense by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List billable tasks with paging',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Read one billable task, including its rate',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a billable task',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Change task fields',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft-delete a billable task by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with paging',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project, including its services and group',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a fixed-price or hourly project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Change project fields',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a project outright. FreshBooks does not mark it; the data is gone',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description:
			'List time entries with paging, optionally filtered by start time, update time or billed state',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Read one time entry, including its duration and timer',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Log a time entry (duration and start time), or start a timer when is_logged is false',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Change time entry fields',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a time entry outright. FreshBooks does not mark it; the data is gone',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof freshBooksEndpointsNested
>;

export type BaseFreshBooksPlugin<T extends FreshBooksPluginOptions> =
	CorsairPlugin<
		'freshbooks',
		typeof FreshBooksSchema,
		typeof freshBooksEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalFreshBooksPlugin =
	BaseFreshBooksPlugin<FreshBooksPluginOptions>;

export type ExternalFreshBooksPlugin<T extends FreshBooksPluginOptions> =
	BaseFreshBooksPlugin<T>;

/**
 * The stored key is a FreshBooks OAuth 2 access token, valid for 12 hours;
 * refresh tokens are single-use and rotate, so a caller pastes a fresh access
 * token from their own FreshBooks app when the old one expires. FreshBooks
 * sends webhook callbacks, but this plugin does not handle inbound
 * deliveries, so there is no webhook secret or matcher.
 */
export function freshbooks<const T extends FreshBooksPluginOptions>(
	incomingOptions: FreshBooksPluginOptions & T = {} as FreshBooksPluginOptions &
		T,
): ExternalFreshBooksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freshbooks',
		schema: FreshBooksSchema,
		options: options,
		hooks: options.hooks,
		endpoints: freshBooksEndpointsNested,
		webhooks: {},
		endpointMeta: freshBooksEndpointMeta,
		endpointSchemas: freshBooksEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: FreshBooksKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('freshbooks', ctx.authType ?? 'api_key');
		},
	} satisfies InternalFreshBooksPlugin;
}

export { FreshBooksAPIError } from './client';

export type {
	FreshBooksClient,
	FreshBooksEndpointInputs,
	FreshBooksEndpointOutputs,
	FreshBooksEstimate,
	FreshBooksExpense,
	FreshBooksInvoice,
	FreshBooksProject,
	FreshBooksTask,
	FreshBooksTimeEntry,
	FreshBooksUsersMeResponse,
} from './endpoints/types';
