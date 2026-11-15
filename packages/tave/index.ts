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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Billing, Jobs, Organization, Work } from './endpoints';
import type {
	TaveEndpointInputs,
	TaveEndpointOutputs,
} from './endpoints/types';
import {
	TaveEndpointInputSchemas,
	TaveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TaveSchema } from './schema';

export type TavePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTavePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof taveEndpointsNested>;
};

export type TaveContext = CorsairPluginContext<
	typeof TaveSchema,
	TavePluginOptions
>;

export type TaveKeyBuilderContext = KeyBuilderContext<TavePluginOptions>;

export type TaveBoundEndpoints = BindEndpoints<typeof taveEndpointsNested>;

type TaveEndpoint<K extends keyof TaveEndpointOutputs> = CorsairEndpoint<
	TaveContext,
	TaveEndpointInputs[K],
	TaveEndpointOutputs[K]
>;

export type TaveEndpoints = {
	jobsList: TaveEndpoint<'jobsList'>;
	jobsGet: TaveEndpoint<'jobsGet'>;
	jobsCreate: TaveEndpoint<'jobsCreate'>;
	jobsUpdate: TaveEndpoint<'jobsUpdate'>;
	jobsRemove: TaveEndpoint<'jobsRemove'>;
	jobsPayments: TaveEndpoint<'jobsPayments'>;
	productsList: TaveEndpoint<'productsList'>;
	productsGet: TaveEndpoint<'productsGet'>;
	productsCreate: TaveEndpoint<'productsCreate'>;
	productsUpdate: TaveEndpoint<'productsUpdate'>;
	productsRemove: TaveEndpoint<'productsRemove'>;
	paymentsList: TaveEndpoint<'paymentsList'>;
	paymentsGet: TaveEndpoint<'paymentsGet'>;
	paymentsCreate: TaveEndpoint<'paymentsCreate'>;
	paymentsUpdate: TaveEndpoint<'paymentsUpdate'>;
	paymentsRemove: TaveEndpoint<'paymentsRemove'>;
	tasksList: TaveEndpoint<'tasksList'>;
	tasksCreate: TaveEndpoint<'tasksCreate'>;
	tasksUpdate: TaveEndpoint<'tasksUpdate'>;
	tasksRemove: TaveEndpoint<'tasksRemove'>;
	taskListsList: TaveEndpoint<'taskListsList'>;
	notesList: TaveEndpoint<'notesList'>;
	notesCreate: TaveEndpoint<'notesCreate'>;
	notesRemove: TaveEndpoint<'notesRemove'>;
	jobTypesList: TaveEndpoint<'jobTypesList'>;
	leadSourcesList: TaveEndpoint<'leadSourcesList'>;
	leadStatusesList: TaveEndpoint<'leadStatusesList'>;
	brandsList: TaveEndpoint<'brandsList'>;
	studioGet: TaveEndpoint<'studioGet'>;
};

const taveEndpointsNested = {
	jobs: {
		list: Jobs.list,
		get: Jobs.get,
		create: Jobs.create,
		update: Jobs.update,
		delete: Jobs.remove,
		payments: Jobs.payments,
	},
	products: {
		list: Billing.productsList,
		get: Billing.productsGet,
		create: Billing.productsCreate,
		update: Billing.productsUpdate,
		delete: Billing.productsRemove,
	},
	payments: {
		list: Billing.paymentsList,
		get: Billing.paymentsGet,
		create: Billing.paymentsCreate,
		update: Billing.paymentsUpdate,
		delete: Billing.paymentsRemove,
	},
	tasks: {
		list: Work.tasksList,
		create: Work.tasksCreate,
		update: Work.tasksUpdate,
		delete: Work.tasksRemove,
	},
	taskLists: {
		list: Work.taskListsList,
	},
	notes: {
		list: Work.notesList,
		create: Work.notesCreate,
		delete: Work.notesRemove,
	},
	jobTypes: {
		list: Organization.jobTypesList,
	},
	leadSources: {
		list: Organization.leadSourcesList,
	},
	leadStatuses: {
		list: Organization.leadStatusesList,
	},
	brands: {
		list: Organization.brandsList,
	},
	studio: {
		get: Organization.studioGet,
	},
} as const;

export const taveEndpointSchemas = {
	'jobs.list': {
		input: TaveEndpointInputSchemas.jobsList,
		output: TaveEndpointOutputSchemas.jobsList,
	},
	'jobs.get': {
		input: TaveEndpointInputSchemas.jobsGet,
		output: TaveEndpointOutputSchemas.jobsGet,
	},
	'jobs.create': {
		input: TaveEndpointInputSchemas.jobsCreate,
		output: TaveEndpointOutputSchemas.jobsCreate,
	},
	'jobs.update': {
		input: TaveEndpointInputSchemas.jobsUpdate,
		output: TaveEndpointOutputSchemas.jobsUpdate,
	},
	'jobs.delete': {
		input: TaveEndpointInputSchemas.jobsRemove,
		output: TaveEndpointOutputSchemas.jobsRemove,
	},
	'jobs.payments': {
		input: TaveEndpointInputSchemas.jobsPayments,
		output: TaveEndpointOutputSchemas.jobsPayments,
	},
	'products.list': {
		input: TaveEndpointInputSchemas.productsList,
		output: TaveEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: TaveEndpointInputSchemas.productsGet,
		output: TaveEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: TaveEndpointInputSchemas.productsCreate,
		output: TaveEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: TaveEndpointInputSchemas.productsUpdate,
		output: TaveEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: TaveEndpointInputSchemas.productsRemove,
		output: TaveEndpointOutputSchemas.productsRemove,
	},
	'payments.list': {
		input: TaveEndpointInputSchemas.paymentsList,
		output: TaveEndpointOutputSchemas.paymentsList,
	},
	'payments.get': {
		input: TaveEndpointInputSchemas.paymentsGet,
		output: TaveEndpointOutputSchemas.paymentsGet,
	},
	'payments.create': {
		input: TaveEndpointInputSchemas.paymentsCreate,
		output: TaveEndpointOutputSchemas.paymentsCreate,
	},
	'payments.update': {
		input: TaveEndpointInputSchemas.paymentsUpdate,
		output: TaveEndpointOutputSchemas.paymentsUpdate,
	},
	'payments.delete': {
		input: TaveEndpointInputSchemas.paymentsRemove,
		output: TaveEndpointOutputSchemas.paymentsRemove,
	},
	'tasks.list': {
		input: TaveEndpointInputSchemas.tasksList,
		output: TaveEndpointOutputSchemas.tasksList,
	},
	'tasks.create': {
		input: TaveEndpointInputSchemas.tasksCreate,
		output: TaveEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: TaveEndpointInputSchemas.tasksUpdate,
		output: TaveEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: TaveEndpointInputSchemas.tasksRemove,
		output: TaveEndpointOutputSchemas.tasksRemove,
	},
	'taskLists.list': {
		input: TaveEndpointInputSchemas.taskListsList,
		output: TaveEndpointOutputSchemas.taskListsList,
	},
	'notes.list': {
		input: TaveEndpointInputSchemas.notesList,
		output: TaveEndpointOutputSchemas.notesList,
	},
	'notes.create': {
		input: TaveEndpointInputSchemas.notesCreate,
		output: TaveEndpointOutputSchemas.notesCreate,
	},
	'notes.delete': {
		input: TaveEndpointInputSchemas.notesRemove,
		output: TaveEndpointOutputSchemas.notesRemove,
	},
	'jobTypes.list': {
		input: TaveEndpointInputSchemas.jobTypesList,
		output: TaveEndpointOutputSchemas.jobTypesList,
	},
	'leadSources.list': {
		input: TaveEndpointInputSchemas.leadSourcesList,
		output: TaveEndpointOutputSchemas.leadSourcesList,
	},
	'leadStatuses.list': {
		input: TaveEndpointInputSchemas.leadStatusesList,
		output: TaveEndpointOutputSchemas.leadStatusesList,
	},
	'brands.list': {
		input: TaveEndpointInputSchemas.brandsList,
		output: TaveEndpointOutputSchemas.brandsList,
	},
	'studio.get': {
		input: TaveEndpointInputSchemas.studioGet,
		output: TaveEndpointOutputSchemas.studioGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof taveEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const taveEndpointMeta = {
	'jobs.list': {
		riskLevel: 'read',
		description:
			'List jobs with their stage, balances and event dates, filtered by stage, lead status or event date range',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Read one job with its contacts, orders, invoices and totals',
	},
	'jobs.create': {
		riskLevel: 'write',
		description:
			'Create a lead or job with its type, lead source, brand and event date',
	},
	'jobs.update': {
		riskLevel: 'write',
		description:
			"Change a job's stage, dates, type, lead source, brand or closed state",
	},
	'jobs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a job with its orders, invoices and notes',
	},
	'jobs.payments': {
		riskLevel: 'read',
		description: 'List the payments recorded against one job',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List the products in your price list',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Read one product with its price, SKU and flags',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Add a product to the price list',
	},
	'products.update': {
		riskLevel: 'write',
		description: "Change a product's name, price, SKU or flags",
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a product; orders that already include it keep their line item',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List payments with their job, amount, status and method',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Read one payment with its refunded amount and memo',
	},
	'payments.create': {
		riskLevel: 'write',
		description:
			'Record a payment against a job, which changes that job balance',
	},
	'payments.update': {
		riskLevel: 'write',
		description: "Change a payment's amount, status, memo or method",
	},
	'payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a payment, which removes it from the job balance',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks with their list, assignee and due date',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a task list, optionally on a job',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: "Change a task's name, assignee, due date or completed state",
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a task',
	},
	'taskLists.list': {
		riskLevel: 'read',
		description: 'List the task lists, whose IDs tasks.create takes',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes, optionally only those on one job',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add an HTML note to a job or a contact',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a note',
	},
	'jobTypes.list': {
		riskLevel: 'read',
		description: 'List the job types, whose IDs jobs.create takes',
	},
	'leadSources.list': {
		riskLevel: 'read',
		description: 'List the lead sources, for reporting where a lead came from',
	},
	'leadStatuses.list': {
		riskLevel: 'read',
		description: 'List the lead statuses, whose IDs jobs.list filters by',
	},
	'brands.list': {
		riskLevel: 'read',
		description: 'List the brands of the studio',
	},
	'studio.get': {
		riskLevel: 'read',
		description: 'Read the studio profile, including its currency and timezone',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof taveEndpointsNested>;

export type BaseTavePlugin<T extends TavePluginOptions> = CorsairPlugin<
	'tave',
	typeof TaveSchema,
	typeof taveEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTavePlugin = BaseTavePlugin<TavePluginOptions>;

export type ExternalTavePlugin<T extends TavePluginOptions> = BaseTavePlugin<T>;

export function tave<const T extends TavePluginOptions>(
	incomingOptions: TavePluginOptions & T = {} as TavePluginOptions & T,
): ExternalTavePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tave',
		schema: TaveSchema,
		options: options,
		hooks: options.hooks,
		endpoints: taveEndpointsNested,
		webhooks: {},
		endpointMeta: taveEndpointMeta,
		endpointSchemas: taveEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TaveKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('tave', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTavePlugin;
}

export { TaveAPIError } from './client';

export type {
	DeletedResponse,
	JobsCreateInput,
	JobsCreateResponse,
	JobsGetInput,
	JobsListInput,
	JobsListResponse,
	JobsUpdateInput,
	NotesCreateInput,
	NotesListInput,
	NotesListResponse,
	PaymentsCreateInput,
	PaymentsGetInput,
	PaymentsListInput,
	PaymentsListResponse,
	PaymentsUpdateInput,
	ProductsCreateInput,
	ProductsGetInput,
	ProductsListInput,
	ProductsListResponse,
	ProductsUpdateInput,
	StudioResponse,
	TaskListsListResponse,
	TasksCreateInput,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TaveEndpointInputs,
	TaveEndpointOutputs,
	TaveJob,
	TaveNamedResource,
	TaveNote,
	TavePayment,
	TaveProduct,
	TaveStudio,
	TaveTask,
} from './endpoints/types';
