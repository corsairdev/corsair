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
	Account,
	Activities,
	Budgets,
	Contacts,
	Estimates,
	Files,
	Invoices,
	Jobs,
	MaterialOrders,
	Payments,
	Products,
	Tasks,
	WorkOrders,
} from './endpoints';
import type {
	JobNimbusEndpointInputs,
	JobNimbusEndpointOutputs,
} from './endpoints/types';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JobNimbusSchema } from './schema';

export type JobNimbusPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalJobNimbusPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof jobNimbusEndpointsNested>;
};

export type JobNimbusContext = CorsairPluginContext<
	typeof JobNimbusSchema,
	JobNimbusPluginOptions
>;

export type JobNimbusKeyBuilderContext =
	KeyBuilderContext<JobNimbusPluginOptions>;

export type JobNimbusBoundEndpoints = BindEndpoints<
	typeof jobNimbusEndpointsNested
>;

type JobNimbusEndpoint<K extends keyof JobNimbusEndpointOutputs> =
	CorsairEndpoint<
		JobNimbusContext,
		JobNimbusEndpointInputs[K],
		JobNimbusEndpointOutputs[K]
	>;

export type JobNimbusEndpoints = {
	// Contacts
	contactsCreate: JobNimbusEndpoint<'contactsCreate'>;
	contactsUpdate: JobNimbusEndpoint<'contactsUpdate'>;
	contactsDelete: JobNimbusEndpoint<'contactsDelete'>;
	contactsGet: JobNimbusEndpoint<'contactsGet'>;
	contactsList: JobNimbusEndpoint<'contactsList'>;

	// Jobs
	jobsCreate: JobNimbusEndpoint<'jobsCreate'>;
	jobsUpdate: JobNimbusEndpoint<'jobsUpdate'>;
	jobsDelete: JobNimbusEndpoint<'jobsDelete'>;
	jobsGet: JobNimbusEndpoint<'jobsGet'>;
	jobsList: JobNimbusEndpoint<'jobsList'>;

	// Tasks
	tasksCreate: JobNimbusEndpoint<'tasksCreate'>;
	tasksUpdate: JobNimbusEndpoint<'tasksUpdate'>;
	tasksDelete: JobNimbusEndpoint<'tasksDelete'>;
	tasksGet: JobNimbusEndpoint<'tasksGet'>;
	tasksList: JobNimbusEndpoint<'tasksList'>;

	// Activities
	activitiesCreate: JobNimbusEndpoint<'activitiesCreate'>;
	activitiesGet: JobNimbusEndpoint<'activitiesGet'>;
	activitiesList: JobNimbusEndpoint<'activitiesList'>;

	// Files
	filesCreate: JobNimbusEndpoint<'filesCreate'>;
	filesCreateFromUrl: JobNimbusEndpoint<'filesCreateFromUrl'>;
	filesRequestSinglePartUpload: JobNimbusEndpoint<'filesRequestSinglePartUpload'>;
	filesCompleteSinglePartUpload: JobNimbusEndpoint<'filesCompleteSinglePartUpload'>;
	filesRequestMultipartUpload: JobNimbusEndpoint<'filesRequestMultipartUpload'>;
	filesCompleteMultipartUpload: JobNimbusEndpoint<'filesCompleteMultipartUpload'>;
	filesAbortMultipartUpload: JobNimbusEndpoint<'filesAbortMultipartUpload'>;
	filesList: JobNimbusEndpoint<'filesList'>;
	filesGet: JobNimbusEndpoint<'filesGet'>;

	// Products
	productsCreate: JobNimbusEndpoint<'productsCreate'>;
	productsUpdate: JobNimbusEndpoint<'productsUpdate'>;
	productsDelete: JobNimbusEndpoint<'productsDelete'>;
	productsGet: JobNimbusEndpoint<'productsGet'>;
	productsList: JobNimbusEndpoint<'productsList'>;

	// MaterialOrders
	materialOrdersCreate: JobNimbusEndpoint<'materialOrdersCreate'>;
	materialOrdersUpdate: JobNimbusEndpoint<'materialOrdersUpdate'>;
	materialOrdersDelete: JobNimbusEndpoint<'materialOrdersDelete'>;
	materialOrdersGet: JobNimbusEndpoint<'materialOrdersGet'>;
	materialOrdersList: JobNimbusEndpoint<'materialOrdersList'>;

	// WorkOrders
	workOrdersCreate: JobNimbusEndpoint<'workOrdersCreate'>;
	workOrdersUpdate: JobNimbusEndpoint<'workOrdersUpdate'>;
	workOrdersDelete: JobNimbusEndpoint<'workOrdersDelete'>;
	workOrdersGet: JobNimbusEndpoint<'workOrdersGet'>;
	workOrdersList: JobNimbusEndpoint<'workOrdersList'>;

	// Estimates
	estimatesCreate: JobNimbusEndpoint<'estimatesCreate'>;
	estimatesUpdate: JobNimbusEndpoint<'estimatesUpdate'>;
	estimatesDelete: JobNimbusEndpoint<'estimatesDelete'>;
	estimatesGet: JobNimbusEndpoint<'estimatesGet'>;
	estimatesList: JobNimbusEndpoint<'estimatesList'>;

	// Invoices
	invoicesCreate: JobNimbusEndpoint<'invoicesCreate'>;
	invoicesUpdate: JobNimbusEndpoint<'invoicesUpdate'>;
	invoicesDelete: JobNimbusEndpoint<'invoicesDelete'>;
	invoicesGet: JobNimbusEndpoint<'invoicesGet'>;
	invoicesList: JobNimbusEndpoint<'invoicesList'>;

	// Payments
	paymentsList: JobNimbusEndpoint<'paymentsList'>;
	paymentsCreate: JobNimbusEndpoint<'paymentsCreate'>;

	// Budgets
	budgetsList: JobNimbusEndpoint<'budgetsList'>;

	// Account
	accountGetSettings: JobNimbusEndpoint<'accountGetSettings'>;
	accountGetGroups: JobNimbusEndpoint<'accountGetGroups'>;
	accountGetUsers: JobNimbusEndpoint<'accountGetUsers'>;
	accountGetUoms: JobNimbusEndpoint<'accountGetUoms'>;
	accountCreateWorkflow: JobNimbusEndpoint<'accountCreateWorkflow'>;
	accountCreateWorkflowStatus: JobNimbusEndpoint<'accountCreateWorkflowStatus'>;
	accountCreateLeadSource: JobNimbusEndpoint<'accountCreateLeadSource'>;
	accountCreateCustomField: JobNimbusEndpoint<'accountCreateCustomField'>;
	accountCreateFileType: JobNimbusEndpoint<'accountCreateFileType'>;
	accountCreateTaskType: JobNimbusEndpoint<'accountCreateTaskType'>;
	accountCreateActivityType: JobNimbusEndpoint<'accountCreateActivityType'>;
	accountCreateLocation: JobNimbusEndpoint<'accountCreateLocation'>;
};

const jobNimbusEndpointsNested = {
	contacts: {
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.delete,
		get: Contacts.get,
		list: Contacts.list,
	},
	jobs: {
		create: Jobs.create,
		update: Jobs.update,
		delete: Jobs.delete,
		get: Jobs.get,
		list: Jobs.list,
	},
	tasks: {
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
		get: Tasks.get,
		list: Tasks.list,
	},
	activities: {
		create: Activities.create,
		get: Activities.get,
		list: Activities.list,
	},
	files: {
		create: Files.create,
		createFromUrl: Files.createFromUrl,
		requestSinglePartUpload: Files.requestSinglePartUpload,
		completeSinglePartUpload: Files.completeSinglePartUpload,
		requestMultipartUpload: Files.requestMultipartUpload,
		completeMultipartUpload: Files.completeMultipartUpload,
		abortMultipartUpload: Files.abortMultipartUpload,
		list: Files.list,
		get: Files.get,
	},
	products: {
		create: Products.create,
		update: Products.update,
		delete: Products.delete,
		get: Products.get,
		list: Products.list,
	},
	materialOrders: {
		create: MaterialOrders.create,
		update: MaterialOrders.update,
		delete: MaterialOrders.delete,
		get: MaterialOrders.get,
		list: MaterialOrders.list,
	},
	workOrders: {
		create: WorkOrders.create,
		update: WorkOrders.update,
		delete: WorkOrders.delete,
		get: WorkOrders.get,
		list: WorkOrders.list,
	},
	estimates: {
		create: Estimates.create,
		update: Estimates.update,
		delete: Estimates.delete,
		get: Estimates.get,
		list: Estimates.list,
	},
	invoices: {
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.delete,
		get: Invoices.get,
		list: Invoices.list,
	},
	payments: {
		list: Payments.list,
		create: Payments.create,
	},
	budgets: {
		list: Budgets.list,
	},
	account: {
		getSettings: Account.getSettings,
		getGroups: Account.getGroups,
		getUsers: Account.getUsers,
		getUoms: Account.getUoms,
		createWorkflow: Account.createWorkflow,
		createWorkflowStatus: Account.createWorkflowStatus,
		createLeadSource: Account.createLeadSource,
		createCustomField: Account.createCustomField,
		createFileType: Account.createFileType,
		createTaskType: Account.createTaskType,
		createActivityType: Account.createActivityType,
		createLocation: Account.createLocation,
	},
} as const;

export const jobNimbusEndpointSchemas = {
	// Contacts
	'contacts.create': {
		input: JobNimbusEndpointInputSchemas.contactsCreate,
		output: JobNimbusEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: JobNimbusEndpointInputSchemas.contactsUpdate,
		output: JobNimbusEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: JobNimbusEndpointInputSchemas.contactsDelete,
		output: JobNimbusEndpointOutputSchemas.contactsDelete,
	},
	'contacts.get': {
		input: JobNimbusEndpointInputSchemas.contactsGet,
		output: JobNimbusEndpointOutputSchemas.contactsGet,
	},
	'contacts.list': {
		input: JobNimbusEndpointInputSchemas.contactsList,
		output: JobNimbusEndpointOutputSchemas.contactsList,
	},

	// Jobs
	'jobs.create': {
		input: JobNimbusEndpointInputSchemas.jobsCreate,
		output: JobNimbusEndpointOutputSchemas.jobsCreate,
	},
	'jobs.update': {
		input: JobNimbusEndpointInputSchemas.jobsUpdate,
		output: JobNimbusEndpointOutputSchemas.jobsUpdate,
	},
	'jobs.delete': {
		input: JobNimbusEndpointInputSchemas.jobsDelete,
		output: JobNimbusEndpointOutputSchemas.jobsDelete,
	},
	'jobs.get': {
		input: JobNimbusEndpointInputSchemas.jobsGet,
		output: JobNimbusEndpointOutputSchemas.jobsGet,
	},
	'jobs.list': {
		input: JobNimbusEndpointInputSchemas.jobsList,
		output: JobNimbusEndpointOutputSchemas.jobsList,
	},

	// Tasks
	'tasks.create': {
		input: JobNimbusEndpointInputSchemas.tasksCreate,
		output: JobNimbusEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: JobNimbusEndpointInputSchemas.tasksUpdate,
		output: JobNimbusEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: JobNimbusEndpointInputSchemas.tasksDelete,
		output: JobNimbusEndpointOutputSchemas.tasksDelete,
	},
	'tasks.get': {
		input: JobNimbusEndpointInputSchemas.tasksGet,
		output: JobNimbusEndpointOutputSchemas.tasksGet,
	},
	'tasks.list': {
		input: JobNimbusEndpointInputSchemas.tasksList,
		output: JobNimbusEndpointOutputSchemas.tasksList,
	},

	// Activities
	'activities.create': {
		input: JobNimbusEndpointInputSchemas.activitiesCreate,
		output: JobNimbusEndpointOutputSchemas.activitiesCreate,
	},
	'activities.get': {
		input: JobNimbusEndpointInputSchemas.activitiesGet,
		output: JobNimbusEndpointOutputSchemas.activitiesGet,
	},
	'activities.list': {
		input: JobNimbusEndpointInputSchemas.activitiesList,
		output: JobNimbusEndpointOutputSchemas.activitiesList,
	},

	// Files
	'files.create': {
		input: JobNimbusEndpointInputSchemas.filesCreate,
		output: JobNimbusEndpointOutputSchemas.filesCreate,
	},
	'files.createFromUrl': {
		input: JobNimbusEndpointInputSchemas.filesCreateFromUrl,
		output: JobNimbusEndpointOutputSchemas.filesCreateFromUrl,
	},
	'files.requestSinglePartUpload': {
		input: JobNimbusEndpointInputSchemas.filesRequestSinglePartUpload,
		output: JobNimbusEndpointOutputSchemas.filesRequestSinglePartUpload,
	},
	'files.completeSinglePartUpload': {
		input: JobNimbusEndpointInputSchemas.filesCompleteSinglePartUpload,
		output: JobNimbusEndpointOutputSchemas.filesCompleteSinglePartUpload,
	},
	'files.requestMultipartUpload': {
		input: JobNimbusEndpointInputSchemas.filesRequestMultipartUpload,
		output: JobNimbusEndpointOutputSchemas.filesRequestMultipartUpload,
	},
	'files.completeMultipartUpload': {
		input: JobNimbusEndpointInputSchemas.filesCompleteMultipartUpload,
		output: JobNimbusEndpointOutputSchemas.filesCompleteMultipartUpload,
	},
	'files.abortMultipartUpload': {
		input: JobNimbusEndpointInputSchemas.filesAbortMultipartUpload,
		output: JobNimbusEndpointOutputSchemas.filesAbortMultipartUpload,
	},
	'files.list': {
		input: JobNimbusEndpointInputSchemas.filesList,
		output: JobNimbusEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: JobNimbusEndpointInputSchemas.filesGet,
		output: JobNimbusEndpointOutputSchemas.filesGet,
	},

	// Products
	'products.create': {
		input: JobNimbusEndpointInputSchemas.productsCreate,
		output: JobNimbusEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: JobNimbusEndpointInputSchemas.productsUpdate,
		output: JobNimbusEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: JobNimbusEndpointInputSchemas.productsDelete,
		output: JobNimbusEndpointOutputSchemas.productsDelete,
	},
	'products.get': {
		input: JobNimbusEndpointInputSchemas.productsGet,
		output: JobNimbusEndpointOutputSchemas.productsGet,
	},
	'products.list': {
		input: JobNimbusEndpointInputSchemas.productsList,
		output: JobNimbusEndpointOutputSchemas.productsList,
	},

	// MaterialOrders
	'materialOrders.create': {
		input: JobNimbusEndpointInputSchemas.materialOrdersCreate,
		output: JobNimbusEndpointOutputSchemas.materialOrdersCreate,
	},
	'materialOrders.update': {
		input: JobNimbusEndpointInputSchemas.materialOrdersUpdate,
		output: JobNimbusEndpointOutputSchemas.materialOrdersUpdate,
	},
	'materialOrders.delete': {
		input: JobNimbusEndpointInputSchemas.materialOrdersDelete,
		output: JobNimbusEndpointOutputSchemas.materialOrdersDelete,
	},
	'materialOrders.get': {
		input: JobNimbusEndpointInputSchemas.materialOrdersGet,
		output: JobNimbusEndpointOutputSchemas.materialOrdersGet,
	},
	'materialOrders.list': {
		input: JobNimbusEndpointInputSchemas.materialOrdersList,
		output: JobNimbusEndpointOutputSchemas.materialOrdersList,
	},

	// WorkOrders
	'workOrders.create': {
		input: JobNimbusEndpointInputSchemas.workOrdersCreate,
		output: JobNimbusEndpointOutputSchemas.workOrdersCreate,
	},
	'workOrders.update': {
		input: JobNimbusEndpointInputSchemas.workOrdersUpdate,
		output: JobNimbusEndpointOutputSchemas.workOrdersUpdate,
	},
	'workOrders.delete': {
		input: JobNimbusEndpointInputSchemas.workOrdersDelete,
		output: JobNimbusEndpointOutputSchemas.workOrdersDelete,
	},
	'workOrders.get': {
		input: JobNimbusEndpointInputSchemas.workOrdersGet,
		output: JobNimbusEndpointOutputSchemas.workOrdersGet,
	},
	'workOrders.list': {
		input: JobNimbusEndpointInputSchemas.workOrdersList,
		output: JobNimbusEndpointOutputSchemas.workOrdersList,
	},

	// Estimates
	'estimates.create': {
		input: JobNimbusEndpointInputSchemas.estimatesCreate,
		output: JobNimbusEndpointOutputSchemas.estimatesCreate,
	},
	'estimates.update': {
		input: JobNimbusEndpointInputSchemas.estimatesUpdate,
		output: JobNimbusEndpointOutputSchemas.estimatesUpdate,
	},
	'estimates.delete': {
		input: JobNimbusEndpointInputSchemas.estimatesDelete,
		output: JobNimbusEndpointOutputSchemas.estimatesDelete,
	},
	'estimates.get': {
		input: JobNimbusEndpointInputSchemas.estimatesGet,
		output: JobNimbusEndpointOutputSchemas.estimatesGet,
	},
	'estimates.list': {
		input: JobNimbusEndpointInputSchemas.estimatesList,
		output: JobNimbusEndpointOutputSchemas.estimatesList,
	},

	// Invoices
	'invoices.create': {
		input: JobNimbusEndpointInputSchemas.invoicesCreate,
		output: JobNimbusEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: JobNimbusEndpointInputSchemas.invoicesUpdate,
		output: JobNimbusEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: JobNimbusEndpointInputSchemas.invoicesDelete,
		output: JobNimbusEndpointOutputSchemas.invoicesDelete,
	},
	'invoices.get': {
		input: JobNimbusEndpointInputSchemas.invoicesGet,
		output: JobNimbusEndpointOutputSchemas.invoicesGet,
	},
	'invoices.list': {
		input: JobNimbusEndpointInputSchemas.invoicesList,
		output: JobNimbusEndpointOutputSchemas.invoicesList,
	},

	// Payments
	'payments.list': {
		input: JobNimbusEndpointInputSchemas.paymentsList,
		output: JobNimbusEndpointOutputSchemas.paymentsList,
	},
	'payments.create': {
		input: JobNimbusEndpointInputSchemas.paymentsCreate,
		output: JobNimbusEndpointOutputSchemas.paymentsCreate,
	},

	// Budgets
	'budgets.list': {
		input: JobNimbusEndpointInputSchemas.budgetsList,
		output: JobNimbusEndpointOutputSchemas.budgetsList,
	},

	// Account
	'account.getSettings': {
		input: JobNimbusEndpointInputSchemas.accountGetSettings,
		output: JobNimbusEndpointOutputSchemas.accountGetSettings,
	},
	'account.getGroups': {
		input: JobNimbusEndpointInputSchemas.accountGetGroups,
		output: JobNimbusEndpointOutputSchemas.accountGetGroups,
	},
	'account.getUsers': {
		input: JobNimbusEndpointInputSchemas.accountGetUsers,
		output: JobNimbusEndpointOutputSchemas.accountGetUsers,
	},
	'account.getUoms': {
		input: JobNimbusEndpointInputSchemas.accountGetUoms,
		output: JobNimbusEndpointOutputSchemas.accountGetUoms,
	},
	'account.createWorkflow': {
		input: JobNimbusEndpointInputSchemas.accountCreateWorkflow,
		output: JobNimbusEndpointOutputSchemas.accountCreateWorkflow,
	},
	'account.createWorkflowStatus': {
		input: JobNimbusEndpointInputSchemas.accountCreateWorkflowStatus,
		output: JobNimbusEndpointOutputSchemas.accountCreateWorkflowStatus,
	},
	'account.createLeadSource': {
		input: JobNimbusEndpointInputSchemas.accountCreateLeadSource,
		output: JobNimbusEndpointOutputSchemas.accountCreateLeadSource,
	},
	'account.createCustomField': {
		input: JobNimbusEndpointInputSchemas.accountCreateCustomField,
		output: JobNimbusEndpointOutputSchemas.accountCreateCustomField,
	},
	'account.createFileType': {
		input: JobNimbusEndpointInputSchemas.accountCreateFileType,
		output: JobNimbusEndpointOutputSchemas.accountCreateFileType,
	},
	'account.createTaskType': {
		input: JobNimbusEndpointInputSchemas.accountCreateTaskType,
		output: JobNimbusEndpointOutputSchemas.accountCreateTaskType,
	},
	'account.createActivityType': {
		input: JobNimbusEndpointInputSchemas.accountCreateActivityType,
		output: JobNimbusEndpointOutputSchemas.accountCreateActivityType,
	},
	'account.createLocation': {
		input: JobNimbusEndpointInputSchemas.accountCreateLocation,
		output: JobNimbusEndpointOutputSchemas.accountCreateLocation,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof jobNimbusEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const jobNimbusEndpointMeta = {
	// Contacts
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact in JobNimbus',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact in JobNimbus',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a contact in JobNimbus',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve a contact by ID in JobNimbus',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'Retrieve all contacts in JobNimbus',
	},

	// Jobs
	'jobs.create': {
		riskLevel: 'write',
		description: 'Create a new job in JobNimbus',
	},
	'jobs.update': {
		riskLevel: 'write',
		description: 'Update an existing job in JobNimbus',
	},
	'jobs.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a job in JobNimbus',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Retrieve a job by ID in JobNimbus',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'Retrieve all jobs in JobNimbus',
	},

	// Tasks
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a new task in JobNimbus',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update an existing task in JobNimbus',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a task in JobNimbus',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Retrieve a task by ID in JobNimbus',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'Retrieve all tasks in JobNimbus',
	},

	// Activities
	'activities.create': {
		riskLevel: 'write',
		description: 'Create a new activity note in JobNimbus',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Retrieve an activity by ID in JobNimbus',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'Retrieve all activities in JobNimbus',
	},

	// Files
	'files.create': {
		riskLevel: 'write',
		description: 'Create a file attachment with base64 data in JobNimbus',
	},
	'files.createFromUrl': {
		riskLevel: 'write',
		description: 'Create a file attachment from a URL in JobNimbus',
	},
	'files.requestSinglePartUpload': {
		riskLevel: 'write',
		description:
			'Request a presigned URL for single part file upload in JobNimbus',
	},
	'files.completeSinglePartUpload': {
		riskLevel: 'write',
		description: 'Complete a single part file upload in JobNimbus',
	},
	'files.requestMultipartUpload': {
		riskLevel: 'write',
		description:
			'Request presigned URLs for multipart file upload in JobNimbus',
	},
	'files.completeMultipartUpload': {
		riskLevel: 'write',
		description: 'Complete a multipart file upload in JobNimbus',
	},
	'files.abortMultipartUpload': {
		riskLevel: 'destructive',
		description: 'Abort a multipart file upload in JobNimbus',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'Retrieve list of file attachments in JobNimbus',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Retrieve a file attachment by ID in JobNimbus',
	},

	// Products
	'products.create': {
		riskLevel: 'write',
		description: 'Create a new product in JobNimbus',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update an existing product in JobNimbus',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a product in JobNimbus',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Retrieve a product by ID in JobNimbus',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'Retrieve all products in JobNimbus',
	},

	// MaterialOrders
	'materialOrders.create': {
		riskLevel: 'write',
		description: 'Create a new material order in JobNimbus',
	},
	'materialOrders.update': {
		riskLevel: 'write',
		description: 'Update an existing material order in JobNimbus',
	},
	'materialOrders.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a material order in JobNimbus',
	},
	'materialOrders.get': {
		riskLevel: 'read',
		description: 'Retrieve a material order by ID in JobNimbus',
	},
	'materialOrders.list': {
		riskLevel: 'read',
		description: 'Retrieve all material orders in JobNimbus',
	},

	// WorkOrders
	'workOrders.create': {
		riskLevel: 'write',
		description: 'Create a new work order in JobNimbus',
	},
	'workOrders.update': {
		riskLevel: 'write',
		description: 'Update an existing work order in JobNimbus',
	},
	'workOrders.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) a work order in JobNimbus',
	},
	'workOrders.get': {
		riskLevel: 'read',
		description: 'Retrieve a work order by ID in JobNimbus',
	},
	'workOrders.list': {
		riskLevel: 'read',
		description: 'Retrieve all work orders in JobNimbus',
	},

	// Estimates
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create a new estimate in JobNimbus',
	},
	'estimates.update': {
		riskLevel: 'write',
		description: 'Update an existing estimate in JobNimbus',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) an estimate in JobNimbus',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Retrieve an estimate by ID in JobNimbus',
	},
	'estimates.list': {
		riskLevel: 'read',
		description: 'Retrieve all estimates in JobNimbus',
	},

	// Invoices
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create a new invoice in JobNimbus',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an existing invoice in JobNimbus',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete (deactivate) an invoice in JobNimbus',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieve an invoice by ID in JobNimbus',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'Retrieve all invoices in JobNimbus',
	},

	// Payments
	'payments.list': {
		riskLevel: 'read',
		description: 'Retrieve all payments in JobNimbus',
	},
	'payments.create': {
		riskLevel: 'write',
		description: 'Create a payment in JobNimbus',
	},

	// Budgets
	'budgets.list': {
		riskLevel: 'read',
		description: 'Retrieve all budgets in JobNimbus',
	},

	// Account
	'account.getSettings': {
		riskLevel: 'read',
		description: 'Retrieve account settings configuration in JobNimbus',
	},
	'account.getGroups': {
		riskLevel: 'read',
		description: 'Retrieve group configuration in JobNimbus',
	},
	'account.getUsers': {
		riskLevel: 'read',
		description: 'Retrieve users and team members in JobNimbus',
	},
	'account.getUoms': {
		riskLevel: 'read',
		description: 'Retrieve units of measurement in JobNimbus',
	},
	'account.createWorkflow': {
		riskLevel: 'write',
		description: 'Create a workflow in JobNimbus',
	},
	'account.createWorkflowStatus': {
		riskLevel: 'write',
		description: 'Create a status within a workflow in JobNimbus',
	},
	'account.createLeadSource': {
		riskLevel: 'write',
		description: 'Create a lead source in JobNimbus',
	},
	'account.createCustomField': {
		riskLevel: 'write',
		description: 'Create a custom field in JobNimbus',
	},
	'account.createFileType': {
		riskLevel: 'write',
		description: 'Create a file attachment type in JobNimbus',
	},
	'account.createTaskType': {
		riskLevel: 'write',
		description: 'Create a task type in JobNimbus',
	},
	'account.createActivityType': {
		riskLevel: 'write',
		description: 'Create an activity type in JobNimbus',
	},
	'account.createLocation': {
		riskLevel: 'write',
		description: 'Create a company location in JobNimbus',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof jobNimbusEndpointsNested
>;

export const jobNimbusAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseJobNimbusPlugin<T extends JobNimbusPluginOptions> =
	CorsairPlugin<
		'jobnimbus',
		typeof JobNimbusSchema,
		typeof jobNimbusEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalJobNimbusPlugin =
	BaseJobNimbusPlugin<JobNimbusPluginOptions>;

export type ExternalJobNimbusPlugin<T extends JobNimbusPluginOptions> =
	BaseJobNimbusPlugin<T>;

export function jobnimbus<const T extends JobNimbusPluginOptions>(
	incomingOptions: JobNimbusPluginOptions & T = {} as JobNimbusPluginOptions &
		T,
): ExternalJobNimbusPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtInErrorHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerErrorHandlers } =
		options.errorHandlers ?? {};

	const orderedErrorHandlers = {
		...callerErrorHandlers,
		...builtInErrorHandlers,
		...callerErrorHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'jobnimbus',
		authConfig: jobNimbusAuthConfig,
		schema: JobNimbusSchema,
		options,
		hooks: options.hooks,
		endpoints: jobNimbusEndpointsNested,
		webhooks: {},
		endpointMeta: jobNimbusEndpointMeta,
		endpointSchemas: jobNimbusEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: JobNimbusKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('jobnimbus', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('jobnimbus', 'api_key');
			return apiKey;
		},
	} satisfies InternalJobNimbusPlugin;
}

export type { JobNimbusEndpointInputs, JobNimbusEndpointOutputs };
