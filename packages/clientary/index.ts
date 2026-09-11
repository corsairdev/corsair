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
import { tryGetStoredValue } from './client';
import {
	Clients,
	Contacts,
	Estimates,
	Expenses,
	Hours,
	Invoices,
	Leads,
	PaymentProfiles,
	Payments,
	Projects,
	Recurring,
	Staff,
	Tasks,
} from './endpoints';
import type {
	ClientaryEndpointInputs,
	ClientaryEndpointOutputs,
} from './endpoints/types';
import {
	ClientaryEndpointInputSchemas,
	ClientaryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClientarySchema } from './schema';

export type ClientaryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Account subdomain, e.g. `acme`. Resolves to `https://acme.clientary.com/api/v2`. */
	domain?: string;
	hooks?: InternalClientaryPlugin['hooks'];
	webhookHooks?: InternalClientaryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clientaryEndpointsNested>;
};

export type ClientaryContext = CorsairPluginContext<
	typeof ClientarySchema,
	ClientaryPluginOptions,
	never,
	typeof clientaryAuthConfig
>;

export type ClientaryKeyBuilderContext =
	KeyBuilderContext<ClientaryPluginOptions>;

type ClientaryEndpoint<K extends keyof ClientaryEndpointOutputs> =
	CorsairEndpoint<
		ClientaryContext,
		ClientaryEndpointInputs[K],
		ClientaryEndpointOutputs[K]
	>;

export type ClientaryEndpoints = {
	// Clients
	clientsList: ClientaryEndpoint<'clientsList'>;
	clientsGet: ClientaryEndpoint<'clientsGet'>;
	clientsCreate: ClientaryEndpoint<'clientsCreate'>;
	clientsUpdate: ClientaryEndpoint<'clientsUpdate'>;
	clientsDelete: ClientaryEndpoint<'clientsDelete'>;
	// Contacts
	contactsList: ClientaryEndpoint<'contactsList'>;
	contactsListForClient: ClientaryEndpoint<'contactsListForClient'>;
	contactsGet: ClientaryEndpoint<'contactsGet'>;
	contactsCreate: ClientaryEndpoint<'contactsCreate'>;
	contactsUpdate: ClientaryEndpoint<'contactsUpdate'>;
	contactsDelete: ClientaryEndpoint<'contactsDelete'>;
	// Estimates
	estimatesList: ClientaryEndpoint<'estimatesList'>;
	estimatesListForClient: ClientaryEndpoint<'estimatesListForClient'>;
	estimatesListForProject: ClientaryEndpoint<'estimatesListForProject'>;
	estimatesGet: ClientaryEndpoint<'estimatesGet'>;
	estimatesCreate: ClientaryEndpoint<'estimatesCreate'>;
	estimatesUpdate: ClientaryEndpoint<'estimatesUpdate'>;
	estimatesDelete: ClientaryEndpoint<'estimatesDelete'>;
	estimatesSend: ClientaryEndpoint<'estimatesSend'>;
	// Expenses
	expensesList: ClientaryEndpoint<'expensesList'>;
	expensesListForClient: ClientaryEndpoint<'expensesListForClient'>;
	expensesListForProject: ClientaryEndpoint<'expensesListForProject'>;
	expensesGet: ClientaryEndpoint<'expensesGet'>;
	expensesCreate: ClientaryEndpoint<'expensesCreate'>;
	expensesUpdate: ClientaryEndpoint<'expensesUpdate'>;
	expensesDelete: ClientaryEndpoint<'expensesDelete'>;
	// Hours
	hoursListForProject: ClientaryEndpoint<'hoursListForProject'>;
	hoursGet: ClientaryEndpoint<'hoursGet'>;
	hoursCreate: ClientaryEndpoint<'hoursCreate'>;
	hoursUpdate: ClientaryEndpoint<'hoursUpdate'>;
	hoursDelete: ClientaryEndpoint<'hoursDelete'>;
	// Invoices
	invoicesList: ClientaryEndpoint<'invoicesList'>;
	invoicesListForClient: ClientaryEndpoint<'invoicesListForClient'>;
	invoicesListForProject: ClientaryEndpoint<'invoicesListForProject'>;
	invoicesListForRecurring: ClientaryEndpoint<'invoicesListForRecurring'>;
	invoicesGet: ClientaryEndpoint<'invoicesGet'>;
	invoicesCreate: ClientaryEndpoint<'invoicesCreate'>;
	invoicesUpdate: ClientaryEndpoint<'invoicesUpdate'>;
	invoicesDelete: ClientaryEndpoint<'invoicesDelete'>;
	invoicesSend: ClientaryEndpoint<'invoicesSend'>;
	// Leads
	leadsList: ClientaryEndpoint<'leadsList'>;
	leadsGet: ClientaryEndpoint<'leadsGet'>;
	leadsCreate: ClientaryEndpoint<'leadsCreate'>;
	leadsUpdate: ClientaryEndpoint<'leadsUpdate'>;
	leadsDelete: ClientaryEndpoint<'leadsDelete'>;
	// Payments
	paymentsList: ClientaryEndpoint<'paymentsList'>;
	paymentsCreate: ClientaryEndpoint<'paymentsCreate'>;
	paymentsDelete: ClientaryEndpoint<'paymentsDelete'>;
	// Payment Profiles
	paymentProfilesListForClient: ClientaryEndpoint<'paymentProfilesListForClient'>;
	paymentProfilesCreate: ClientaryEndpoint<'paymentProfilesCreate'>;
	paymentProfilesDelete: ClientaryEndpoint<'paymentProfilesDelete'>;
	// Projects
	projectsList: ClientaryEndpoint<'projectsList'>;
	projectsListForClient: ClientaryEndpoint<'projectsListForClient'>;
	projectsGet: ClientaryEndpoint<'projectsGet'>;
	projectsCreate: ClientaryEndpoint<'projectsCreate'>;
	projectsUpdate: ClientaryEndpoint<'projectsUpdate'>;
	projectsDelete: ClientaryEndpoint<'projectsDelete'>;
	// Recurring Schedules
	recurringList: ClientaryEndpoint<'recurringList'>;
	recurringGet: ClientaryEndpoint<'recurringGet'>;
	recurringCreate: ClientaryEndpoint<'recurringCreate'>;
	recurringUpdate: ClientaryEndpoint<'recurringUpdate'>;
	recurringDelete: ClientaryEndpoint<'recurringDelete'>;
	// Staff
	staffList: ClientaryEndpoint<'staffList'>;
	staffGet: ClientaryEndpoint<'staffGet'>;
	// Tasks
	tasksList: ClientaryEndpoint<'tasksList'>;
	tasksListForProject: ClientaryEndpoint<'tasksListForProject'>;
	tasksGet: ClientaryEndpoint<'tasksGet'>;
	tasksCreate: ClientaryEndpoint<'tasksCreate'>;
	tasksUpdate: ClientaryEndpoint<'tasksUpdate'>;
	tasksDelete: ClientaryEndpoint<'tasksDelete'>;
};

export type ClientaryBoundEndpoints = BindEndpoints<
	typeof clientaryEndpointsNested
>;

const clientaryEndpointsNested = {
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
		delete: Clients.delete,
	},
	contacts: {
		list: Contacts.list,
		listForClient: Contacts.listForClient,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.delete,
	},
	estimates: {
		list: Estimates.list,
		listForClient: Estimates.listForClient,
		listForProject: Estimates.listForProject,
		get: Estimates.get,
		create: Estimates.create,
		update: Estimates.update,
		delete: Estimates.delete,
		send: Estimates.send,
	},
	expenses: {
		list: Expenses.list,
		listForClient: Expenses.listForClient,
		listForProject: Expenses.listForProject,
		get: Expenses.get,
		create: Expenses.create,
		update: Expenses.update,
		delete: Expenses.delete,
	},
	hours: {
		listForProject: Hours.listForProject,
		get: Hours.get,
		create: Hours.create,
		update: Hours.update,
		delete: Hours.delete,
	},
	invoices: {
		list: Invoices.list,
		listForClient: Invoices.listForClient,
		listForProject: Invoices.listForProject,
		listForRecurring: Invoices.listForRecurring,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.delete,
		send: Invoices.send,
	},
	leads: {
		list: Leads.list,
		get: Leads.get,
		create: Leads.create,
		update: Leads.update,
		delete: Leads.delete,
	},
	payments: {
		list: Payments.list,
		create: Payments.create,
		delete: Payments.delete,
	},
	paymentProfiles: {
		listForClient: PaymentProfiles.listForClient,
		create: PaymentProfiles.create,
		delete: PaymentProfiles.delete,
	},
	projects: {
		list: Projects.list,
		listForClient: Projects.listForClient,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	recurring: {
		list: Recurring.list,
		get: Recurring.get,
		create: Recurring.create,
		update: Recurring.update,
		delete: Recurring.delete,
	},
	staff: {
		list: Staff.list,
		get: Staff.get,
	},
	tasks: {
		list: Tasks.list,
		listForProject: Tasks.listForProject,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
	},
} as const;

export const clientaryEndpointSchemas = {
	'clients.list': {
		input: ClientaryEndpointInputSchemas.clientsList,
		output: ClientaryEndpointOutputSchemas.clientsList,
	},
	'clients.get': {
		input: ClientaryEndpointInputSchemas.clientsGet,
		output: ClientaryEndpointOutputSchemas.clientsGet,
	},
	'clients.create': {
		input: ClientaryEndpointInputSchemas.clientsCreate,
		output: ClientaryEndpointOutputSchemas.clientsCreate,
	},
	'clients.update': {
		input: ClientaryEndpointInputSchemas.clientsUpdate,
		output: ClientaryEndpointOutputSchemas.clientsUpdate,
	},
	'clients.delete': {
		input: ClientaryEndpointInputSchemas.clientsDelete,
		output: ClientaryEndpointOutputSchemas.clientsDelete,
	},
	'contacts.list': {
		input: ClientaryEndpointInputSchemas.contactsList,
		output: ClientaryEndpointOutputSchemas.contactsList,
	},
	'contacts.listForClient': {
		input: ClientaryEndpointInputSchemas.contactsListForClient,
		output: ClientaryEndpointOutputSchemas.contactsListForClient,
	},
	'contacts.get': {
		input: ClientaryEndpointInputSchemas.contactsGet,
		output: ClientaryEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: ClientaryEndpointInputSchemas.contactsCreate,
		output: ClientaryEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: ClientaryEndpointInputSchemas.contactsUpdate,
		output: ClientaryEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: ClientaryEndpointInputSchemas.contactsDelete,
		output: ClientaryEndpointOutputSchemas.contactsDelete,
	},
	'estimates.list': {
		input: ClientaryEndpointInputSchemas.estimatesList,
		output: ClientaryEndpointOutputSchemas.estimatesList,
	},
	'estimates.listForClient': {
		input: ClientaryEndpointInputSchemas.estimatesListForClient,
		output: ClientaryEndpointOutputSchemas.estimatesListForClient,
	},
	'estimates.listForProject': {
		input: ClientaryEndpointInputSchemas.estimatesListForProject,
		output: ClientaryEndpointOutputSchemas.estimatesListForProject,
	},
	'estimates.get': {
		input: ClientaryEndpointInputSchemas.estimatesGet,
		output: ClientaryEndpointOutputSchemas.estimatesGet,
	},
	'estimates.create': {
		input: ClientaryEndpointInputSchemas.estimatesCreate,
		output: ClientaryEndpointOutputSchemas.estimatesCreate,
	},
	'estimates.update': {
		input: ClientaryEndpointInputSchemas.estimatesUpdate,
		output: ClientaryEndpointOutputSchemas.estimatesUpdate,
	},
	'estimates.delete': {
		input: ClientaryEndpointInputSchemas.estimatesDelete,
		output: ClientaryEndpointOutputSchemas.estimatesDelete,
	},
	'estimates.send': {
		input: ClientaryEndpointInputSchemas.estimatesSend,
		output: ClientaryEndpointOutputSchemas.estimatesSend,
	},
	'expenses.list': {
		input: ClientaryEndpointInputSchemas.expensesList,
		output: ClientaryEndpointOutputSchemas.expensesList,
	},
	'expenses.listForClient': {
		input: ClientaryEndpointInputSchemas.expensesListForClient,
		output: ClientaryEndpointOutputSchemas.expensesListForClient,
	},
	'expenses.listForProject': {
		input: ClientaryEndpointInputSchemas.expensesListForProject,
		output: ClientaryEndpointOutputSchemas.expensesListForProject,
	},
	'expenses.get': {
		input: ClientaryEndpointInputSchemas.expensesGet,
		output: ClientaryEndpointOutputSchemas.expensesGet,
	},
	'expenses.create': {
		input: ClientaryEndpointInputSchemas.expensesCreate,
		output: ClientaryEndpointOutputSchemas.expensesCreate,
	},
	'expenses.update': {
		input: ClientaryEndpointInputSchemas.expensesUpdate,
		output: ClientaryEndpointOutputSchemas.expensesUpdate,
	},
	'expenses.delete': {
		input: ClientaryEndpointInputSchemas.expensesDelete,
		output: ClientaryEndpointOutputSchemas.expensesDelete,
	},
	'hours.listForProject': {
		input: ClientaryEndpointInputSchemas.hoursListForProject,
		output: ClientaryEndpointOutputSchemas.hoursListForProject,
	},
	'hours.get': {
		input: ClientaryEndpointInputSchemas.hoursGet,
		output: ClientaryEndpointOutputSchemas.hoursGet,
	},
	'hours.create': {
		input: ClientaryEndpointInputSchemas.hoursCreate,
		output: ClientaryEndpointOutputSchemas.hoursCreate,
	},
	'hours.update': {
		input: ClientaryEndpointInputSchemas.hoursUpdate,
		output: ClientaryEndpointOutputSchemas.hoursUpdate,
	},
	'hours.delete': {
		input: ClientaryEndpointInputSchemas.hoursDelete,
		output: ClientaryEndpointOutputSchemas.hoursDelete,
	},
	'invoices.list': {
		input: ClientaryEndpointInputSchemas.invoicesList,
		output: ClientaryEndpointOutputSchemas.invoicesList,
	},
	'invoices.listForClient': {
		input: ClientaryEndpointInputSchemas.invoicesListForClient,
		output: ClientaryEndpointOutputSchemas.invoicesListForClient,
	},
	'invoices.listForProject': {
		input: ClientaryEndpointInputSchemas.invoicesListForProject,
		output: ClientaryEndpointOutputSchemas.invoicesListForProject,
	},
	'invoices.listForRecurring': {
		input: ClientaryEndpointInputSchemas.invoicesListForRecurring,
		output: ClientaryEndpointOutputSchemas.invoicesListForRecurring,
	},
	'invoices.get': {
		input: ClientaryEndpointInputSchemas.invoicesGet,
		output: ClientaryEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: ClientaryEndpointInputSchemas.invoicesCreate,
		output: ClientaryEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: ClientaryEndpointInputSchemas.invoicesUpdate,
		output: ClientaryEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: ClientaryEndpointInputSchemas.invoicesDelete,
		output: ClientaryEndpointOutputSchemas.invoicesDelete,
	},
	'invoices.send': {
		input: ClientaryEndpointInputSchemas.invoicesSend,
		output: ClientaryEndpointOutputSchemas.invoicesSend,
	},
	'leads.list': {
		input: ClientaryEndpointInputSchemas.leadsList,
		output: ClientaryEndpointOutputSchemas.leadsList,
	},
	'leads.get': {
		input: ClientaryEndpointInputSchemas.leadsGet,
		output: ClientaryEndpointOutputSchemas.leadsGet,
	},
	'leads.create': {
		input: ClientaryEndpointInputSchemas.leadsCreate,
		output: ClientaryEndpointOutputSchemas.leadsCreate,
	},
	'leads.update': {
		input: ClientaryEndpointInputSchemas.leadsUpdate,
		output: ClientaryEndpointOutputSchemas.leadsUpdate,
	},
	'leads.delete': {
		input: ClientaryEndpointInputSchemas.leadsDelete,
		output: ClientaryEndpointOutputSchemas.leadsDelete,
	},
	'payments.list': {
		input: ClientaryEndpointInputSchemas.paymentsList,
		output: ClientaryEndpointOutputSchemas.paymentsList,
	},
	'payments.create': {
		input: ClientaryEndpointInputSchemas.paymentsCreate,
		output: ClientaryEndpointOutputSchemas.paymentsCreate,
	},
	'payments.delete': {
		input: ClientaryEndpointInputSchemas.paymentsDelete,
		output: ClientaryEndpointOutputSchemas.paymentsDelete,
	},
	'paymentProfiles.listForClient': {
		input: ClientaryEndpointInputSchemas.paymentProfilesListForClient,
		output: ClientaryEndpointOutputSchemas.paymentProfilesListForClient,
	},
	'paymentProfiles.create': {
		input: ClientaryEndpointInputSchemas.paymentProfilesCreate,
		output: ClientaryEndpointOutputSchemas.paymentProfilesCreate,
	},
	'paymentProfiles.delete': {
		input: ClientaryEndpointInputSchemas.paymentProfilesDelete,
		output: ClientaryEndpointOutputSchemas.paymentProfilesDelete,
	},
	'projects.list': {
		input: ClientaryEndpointInputSchemas.projectsList,
		output: ClientaryEndpointOutputSchemas.projectsList,
	},
	'projects.listForClient': {
		input: ClientaryEndpointInputSchemas.projectsListForClient,
		output: ClientaryEndpointOutputSchemas.projectsListForClient,
	},
	'projects.get': {
		input: ClientaryEndpointInputSchemas.projectsGet,
		output: ClientaryEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: ClientaryEndpointInputSchemas.projectsCreate,
		output: ClientaryEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: ClientaryEndpointInputSchemas.projectsUpdate,
		output: ClientaryEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: ClientaryEndpointInputSchemas.projectsDelete,
		output: ClientaryEndpointOutputSchemas.projectsDelete,
	},
	'recurring.list': {
		input: ClientaryEndpointInputSchemas.recurringList,
		output: ClientaryEndpointOutputSchemas.recurringList,
	},
	'recurring.get': {
		input: ClientaryEndpointInputSchemas.recurringGet,
		output: ClientaryEndpointOutputSchemas.recurringGet,
	},
	'recurring.create': {
		input: ClientaryEndpointInputSchemas.recurringCreate,
		output: ClientaryEndpointOutputSchemas.recurringCreate,
	},
	'recurring.update': {
		input: ClientaryEndpointInputSchemas.recurringUpdate,
		output: ClientaryEndpointOutputSchemas.recurringUpdate,
	},
	'recurring.delete': {
		input: ClientaryEndpointInputSchemas.recurringDelete,
		output: ClientaryEndpointOutputSchemas.recurringDelete,
	},
	'staff.list': {
		input: ClientaryEndpointInputSchemas.staffList,
		output: ClientaryEndpointOutputSchemas.staffList,
	},
	'staff.get': {
		input: ClientaryEndpointInputSchemas.staffGet,
		output: ClientaryEndpointOutputSchemas.staffGet,
	},
	'tasks.list': {
		input: ClientaryEndpointInputSchemas.tasksList,
		output: ClientaryEndpointOutputSchemas.tasksList,
	},
	'tasks.listForProject': {
		input: ClientaryEndpointInputSchemas.tasksListForProject,
		output: ClientaryEndpointOutputSchemas.tasksListForProject,
	},
	'tasks.get': {
		input: ClientaryEndpointInputSchemas.tasksGet,
		output: ClientaryEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: ClientaryEndpointInputSchemas.tasksCreate,
		output: ClientaryEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: ClientaryEndpointInputSchemas.tasksUpdate,
		output: ClientaryEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: ClientaryEndpointInputSchemas.tasksDelete,
		output: ClientaryEndpointOutputSchemas.tasksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clientaryEndpointsNested
>;

const clientaryEndpointMeta = {
	'clients.list': { riskLevel: 'read', description: 'List clients' },
	'clients.get': { riskLevel: 'read', description: 'Get a client by ID' },
	'clients.create': { riskLevel: 'write', description: 'Create a client' },
	'clients.update': { riskLevel: 'write', description: 'Update a client' },
	'clients.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a client and all associated projects, invoices, estimates, and contacts',
	},
	'contacts.list': { riskLevel: 'read', description: 'List contacts' },
	'contacts.listForClient': {
		riskLevel: 'read',
		description: 'List contacts belonging to a client',
	},
	'contacts.get': { riskLevel: 'read', description: 'Get a contact by ID' },
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.update': { riskLevel: 'write', description: 'Update a contact' },
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'estimates.list': { riskLevel: 'read', description: 'List estimates' },
	'estimates.listForClient': {
		riskLevel: 'read',
		description: 'List estimates belonging to a client',
	},
	'estimates.listForProject': {
		riskLevel: 'read',
		description: 'List estimates belonging to a project',
	},
	'estimates.get': { riskLevel: 'read', description: 'Get an estimate by ID' },
	'estimates.create': { riskLevel: 'write', description: 'Create an estimate' },
	'estimates.update': { riskLevel: 'write', description: 'Update an estimate' },
	'estimates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an estimate',
	},
	'estimates.send': {
		riskLevel: 'write',
		description: 'Send an estimate via email',
	},
	'expenses.list': { riskLevel: 'read', description: 'List expenses' },
	'expenses.listForClient': {
		riskLevel: 'read',
		description: 'List expenses belonging to a client',
	},
	'expenses.listForProject': {
		riskLevel: 'read',
		description: 'List expenses belonging to a project',
	},
	'expenses.get': { riskLevel: 'read', description: 'Get an expense by ID' },
	'expenses.create': { riskLevel: 'write', description: 'Create an expense' },
	'expenses.update': { riskLevel: 'write', description: 'Update an expense' },
	'expenses.delete': {
		riskLevel: 'destructive',
		description: 'Delete an expense',
	},
	'hours.listForProject': {
		riskLevel: 'read',
		description: 'List hours logged against a project',
	},
	'hours.get': { riskLevel: 'read', description: 'Get an hours entry by ID' },
	'hours.create': { riskLevel: 'write', description: 'Log hours to a project' },
	'hours.update': { riskLevel: 'write', description: 'Update an hours entry' },
	'hours.delete': {
		riskLevel: 'destructive',
		description: 'Delete an hours entry',
	},
	'invoices.list': { riskLevel: 'read', description: 'List invoices' },
	'invoices.listForClient': {
		riskLevel: 'read',
		description: 'List invoices belonging to a client',
	},
	'invoices.listForProject': {
		riskLevel: 'read',
		description: 'List invoices belonging to a project',
	},
	'invoices.listForRecurring': {
		riskLevel: 'read',
		description: 'List invoices generated by a recurring schedule',
	},
	'invoices.get': { riskLevel: 'read', description: 'Get an invoice by ID' },
	'invoices.create': { riskLevel: 'write', description: 'Create an invoice' },
	'invoices.update': { riskLevel: 'write', description: 'Update an invoice' },
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice',
	},
	'invoices.send': {
		riskLevel: 'write',
		description: 'Send an invoice via email',
	},
	'leads.list': { riskLevel: 'read', description: 'List leads' },
	'leads.get': { riskLevel: 'read', description: 'Get a lead by ID' },
	'leads.create': { riskLevel: 'write', description: 'Create a lead' },
	'leads.update': { riskLevel: 'write', description: 'Update a lead' },
	'leads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a lead',
	},
	'payments.list': { riskLevel: 'read', description: 'List payments' },
	'payments.create': { riskLevel: 'write', description: 'Record a payment' },
	'payments.delete': {
		riskLevel: 'destructive',
		description: 'Delete (void) a payment',
	},
	'paymentProfiles.listForClient': {
		riskLevel: 'read',
		description: 'List payment profiles for a client',
	},
	'paymentProfiles.create': {
		riskLevel: 'write',
		description: 'Create a payment profile for a client',
	},
	'paymentProfiles.delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment profile',
	},
	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'projects.listForClient': {
		riskLevel: 'read',
		description: 'List projects belonging to a client',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a project by ID' },
	'projects.create': { riskLevel: 'write', description: 'Create a project' },
	'projects.update': { riskLevel: 'write', description: 'Update a project' },
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project',
	},
	'recurring.list': {
		riskLevel: 'read',
		description: 'List recurring schedules',
	},
	'recurring.get': {
		riskLevel: 'read',
		description: 'Get a recurring schedule by ID',
	},
	'recurring.create': {
		riskLevel: 'write',
		description: 'Create a recurring schedule',
	},
	'recurring.update': {
		riskLevel: 'write',
		description: 'Update a recurring schedule',
	},
	'recurring.delete': {
		riskLevel: 'destructive',
		description: 'Delete a recurring schedule',
	},
	'staff.list': { riskLevel: 'read', description: 'List staff members' },
	'staff.get': { riskLevel: 'read', description: 'Get a staff member by ID' },
	'tasks.list': { riskLevel: 'read', description: 'List tasks' },
	'tasks.listForProject': {
		riskLevel: 'read',
		description: 'List tasks belonging to a project',
	},
	'tasks.get': { riskLevel: 'read', description: 'Get a task by ID' },
	'tasks.create': { riskLevel: 'write', description: 'Create a task' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clientaryEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const clientaryAuthConfig = {
	api_key: {
		account: ['domain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClientaryPlugin<T extends ClientaryPluginOptions> =
	CorsairPlugin<
		'clientary',
		typeof ClientarySchema,
		typeof clientaryEndpointsNested,
		never,
		T,
		typeof defaultAuthType
	>;

export type InternalClientaryPlugin =
	BaseClientaryPlugin<ClientaryPluginOptions>;

export type ExternalClientaryPlugin<T extends ClientaryPluginOptions> =
	BaseClientaryPlugin<T>;

export function clientary<const T extends ClientaryPluginOptions>(
	incomingOptions: ClientaryPluginOptions & T = {} as ClientaryPluginOptions &
		T,
): ExternalClientaryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clientary',
		authConfig: clientaryAuthConfig,
		schema: ClientarySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: clientaryEndpointsNested,
		endpointMeta: clientaryEndpointMeta,
		endpointSchemas: clientaryEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClientaryKeyBuilderContext, source) => {
			if (options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await tryGetStoredValue(() => ctx.keys.get_api_key());
				if (!res) {
					throw new AuthMissingError('clientary', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('clientary', 'api_key');
		},
	} satisfies InternalClientaryPlugin;
}

export type {
	ClientaryEndpointInputs,
	ClientaryEndpointOutputs,
} from './endpoints/types';
