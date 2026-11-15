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
	Activities,
	Deals,
	Organizations,
	Persons,
	Products,
	Tasks,
} from './endpoints';
import type {
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
} from './endpoints/types';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PipedriveSchema } from './schema';

export type PipedrivePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalPipedrivePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pipedriveEndpointsNested>;
};

export type PipedriveContext = CorsairPluginContext<
	typeof PipedriveSchema,
	PipedrivePluginOptions
>;
export type PipedriveKeyBuilderContext =
	KeyBuilderContext<PipedrivePluginOptions>;
export type PipedriveBoundEndpoints = BindEndpoints<
	typeof pipedriveEndpointsNested
>;

type PipedriveEndpoint<K extends keyof PipedriveEndpointOutputs> =
	CorsairEndpoint<
		PipedriveContext,
		PipedriveEndpointInputs[K],
		PipedriveEndpointOutputs[K]
	>;

export type PipedriveEndpoints = {
	dealList: PipedriveEndpoint<'dealList'>;
	dealGet: PipedriveEndpoint<'dealGet'>;
	dealCreate: PipedriveEndpoint<'dealCreate'>;
	dealUpdate: PipedriveEndpoint<'dealUpdate'>;
	dealDelete: PipedriveEndpoint<'dealDelete'>;
	personList: PipedriveEndpoint<'personList'>;
	personGet: PipedriveEndpoint<'personGet'>;
	personCreate: PipedriveEndpoint<'personCreate'>;
	personUpdate: PipedriveEndpoint<'personUpdate'>;
	personDelete: PipedriveEndpoint<'personDelete'>;
	organizationList: PipedriveEndpoint<'organizationList'>;
	organizationGet: PipedriveEndpoint<'organizationGet'>;
	organizationCreate: PipedriveEndpoint<'organizationCreate'>;
	organizationUpdate: PipedriveEndpoint<'organizationUpdate'>;
	organizationDelete: PipedriveEndpoint<'organizationDelete'>;
	activityList: PipedriveEndpoint<'activityList'>;
	activityGet: PipedriveEndpoint<'activityGet'>;
	activityCreate: PipedriveEndpoint<'activityCreate'>;
	activityUpdate: PipedriveEndpoint<'activityUpdate'>;
	activityDelete: PipedriveEndpoint<'activityDelete'>;
	taskList: PipedriveEndpoint<'taskList'>;
	taskGet: PipedriveEndpoint<'taskGet'>;
	taskCreate: PipedriveEndpoint<'taskCreate'>;
	taskUpdate: PipedriveEndpoint<'taskUpdate'>;
	taskDelete: PipedriveEndpoint<'taskDelete'>;
	productList: PipedriveEndpoint<'productList'>;
	productCreate: PipedriveEndpoint<'productCreate'>;
	productSearch: PipedriveEndpoint<'productSearch'>;
	productGet: PipedriveEndpoint<'productGet'>;
	productUpdate: PipedriveEndpoint<'productUpdate'>;
	productDelete: PipedriveEndpoint<'productDelete'>;
	productDuplicate: PipedriveEndpoint<'productDuplicate'>;
	productVariationList: PipedriveEndpoint<'productVariationList'>;
	productVariationCreate: PipedriveEndpoint<'productVariationCreate'>;
	productVariationUpdate: PipedriveEndpoint<'productVariationUpdate'>;
	productVariationDelete: PipedriveEndpoint<'productVariationDelete'>;
	productImageGet: PipedriveEndpoint<'productImageGet'>;
	productImageUpload: PipedriveEndpoint<'productImageUpload'>;
	productImageUpdate: PipedriveEndpoint<'productImageUpdate'>;
	productImageDelete: PipedriveEndpoint<'productImageDelete'>;
	productFollowerList: PipedriveEndpoint<'productFollowerList'>;
	productFollowerCreate: PipedriveEndpoint<'productFollowerCreate'>;
	productFollowerChangelog: PipedriveEndpoint<'productFollowerChangelog'>;
	productFollowerDelete: PipedriveEndpoint<'productFollowerDelete'>;
};

const pipedriveEndpointsNested = {
	deals: {
		list: Deals.list,
		get: Deals.get,
		create: Deals.create,
		update: Deals.update,
		delete: Deals.delete,
	},
	persons: {
		list: Persons.list,
		get: Persons.get,
		create: Persons.create,
		update: Persons.update,
		delete: Persons.delete,
	},
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
		create: Organizations.create,
		update: Organizations.update,
		delete: Organizations.delete,
	},
	activities: {
		list: Activities.list,
		get: Activities.get,
		create: Activities.create,
		update: Activities.update,
		delete: Activities.delete,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
	},
	products: {
		list: Products.list,
		create: Products.create,
		search: Products.search,
		get: Products.get,
		update: Products.update,
		delete: Products.delete,
		duplicate: Products.duplicate,
		variations: {
			list: Products.variations.list,
			create: Products.variations.create,
			update: Products.variations.update,
			delete: Products.variations.delete,
		},
		images: {
			get: Products.images.get,
			upload: Products.images.upload,
			update: Products.images.update,
			delete: Products.images.delete,
		},
		followers: {
			list: Products.followers.list,
			create: Products.followers.create,
			changelog: Products.followers.changelog,
			delete: Products.followers.delete,
		},
	},
} as const;

export const pipedriveEndpointSchemas = {
	'deals.list': {
		input: PipedriveEndpointInputSchemas.dealList,
		output: PipedriveEndpointOutputSchemas.dealList,
	},
	'deals.get': {
		input: PipedriveEndpointInputSchemas.dealGet,
		output: PipedriveEndpointOutputSchemas.dealGet,
	},
	'deals.create': {
		input: PipedriveEndpointInputSchemas.dealCreate,
		output: PipedriveEndpointOutputSchemas.dealCreate,
	},
	'deals.update': {
		input: PipedriveEndpointInputSchemas.dealUpdate,
		output: PipedriveEndpointOutputSchemas.dealUpdate,
	},
	'deals.delete': {
		input: PipedriveEndpointInputSchemas.dealDelete,
		output: PipedriveEndpointOutputSchemas.dealDelete,
	},
	'persons.list': {
		input: PipedriveEndpointInputSchemas.personList,
		output: PipedriveEndpointOutputSchemas.personList,
	},
	'persons.get': {
		input: PipedriveEndpointInputSchemas.personGet,
		output: PipedriveEndpointOutputSchemas.personGet,
	},
	'persons.create': {
		input: PipedriveEndpointInputSchemas.personCreate,
		output: PipedriveEndpointOutputSchemas.personCreate,
	},
	'persons.update': {
		input: PipedriveEndpointInputSchemas.personUpdate,
		output: PipedriveEndpointOutputSchemas.personUpdate,
	},
	'persons.delete': {
		input: PipedriveEndpointInputSchemas.personDelete,
		output: PipedriveEndpointOutputSchemas.personDelete,
	},
	'organizations.list': {
		input: PipedriveEndpointInputSchemas.organizationList,
		output: PipedriveEndpointOutputSchemas.organizationList,
	},
	'organizations.get': {
		input: PipedriveEndpointInputSchemas.organizationGet,
		output: PipedriveEndpointOutputSchemas.organizationGet,
	},
	'organizations.create': {
		input: PipedriveEndpointInputSchemas.organizationCreate,
		output: PipedriveEndpointOutputSchemas.organizationCreate,
	},
	'organizations.update': {
		input: PipedriveEndpointInputSchemas.organizationUpdate,
		output: PipedriveEndpointOutputSchemas.organizationUpdate,
	},
	'organizations.delete': {
		input: PipedriveEndpointInputSchemas.organizationDelete,
		output: PipedriveEndpointOutputSchemas.organizationDelete,
	},
	'activities.list': {
		input: PipedriveEndpointInputSchemas.activityList,
		output: PipedriveEndpointOutputSchemas.activityList,
	},
	'activities.get': {
		input: PipedriveEndpointInputSchemas.activityGet,
		output: PipedriveEndpointOutputSchemas.activityGet,
	},
	'activities.create': {
		input: PipedriveEndpointInputSchemas.activityCreate,
		output: PipedriveEndpointOutputSchemas.activityCreate,
	},
	'activities.update': {
		input: PipedriveEndpointInputSchemas.activityUpdate,
		output: PipedriveEndpointOutputSchemas.activityUpdate,
	},
	'activities.delete': {
		input: PipedriveEndpointInputSchemas.activityDelete,
		output: PipedriveEndpointOutputSchemas.activityDelete,
	},
	'tasks.list': {
		input: PipedriveEndpointInputSchemas.taskList,
		output: PipedriveEndpointOutputSchemas.taskList,
	},
	'tasks.get': {
		input: PipedriveEndpointInputSchemas.taskGet,
		output: PipedriveEndpointOutputSchemas.taskGet,
	},
	'tasks.create': {
		input: PipedriveEndpointInputSchemas.taskCreate,
		output: PipedriveEndpointOutputSchemas.taskCreate,
	},
	'tasks.update': {
		input: PipedriveEndpointInputSchemas.taskUpdate,
		output: PipedriveEndpointOutputSchemas.taskUpdate,
	},
	'tasks.delete': {
		input: PipedriveEndpointInputSchemas.taskDelete,
		output: PipedriveEndpointOutputSchemas.taskDelete,
	},
	'products.list': {
		input: PipedriveEndpointInputSchemas.productList,
		output: PipedriveEndpointOutputSchemas.productList,
	},
	'products.create': {
		input: PipedriveEndpointInputSchemas.productCreate,
		output: PipedriveEndpointOutputSchemas.productCreate,
	},
	'products.search': {
		input: PipedriveEndpointInputSchemas.productSearch,
		output: PipedriveEndpointOutputSchemas.productSearch,
	},
	'products.get': {
		input: PipedriveEndpointInputSchemas.productGet,
		output: PipedriveEndpointOutputSchemas.productGet,
	},
	'products.update': {
		input: PipedriveEndpointInputSchemas.productUpdate,
		output: PipedriveEndpointOutputSchemas.productUpdate,
	},
	'products.delete': {
		input: PipedriveEndpointInputSchemas.productDelete,
		output: PipedriveEndpointOutputSchemas.productDelete,
	},
	'products.duplicate': {
		input: PipedriveEndpointInputSchemas.productDuplicate,
		output: PipedriveEndpointOutputSchemas.productDuplicate,
	},
	'products.variations.list': {
		input: PipedriveEndpointInputSchemas.productVariationList,
		output: PipedriveEndpointOutputSchemas.productVariationList,
	},
	'products.variations.create': {
		input: PipedriveEndpointInputSchemas.productVariationCreate,
		output: PipedriveEndpointOutputSchemas.productVariationCreate,
	},
	'products.variations.update': {
		input: PipedriveEndpointInputSchemas.productVariationUpdate,
		output: PipedriveEndpointOutputSchemas.productVariationUpdate,
	},
	'products.variations.delete': {
		input: PipedriveEndpointInputSchemas.productVariationDelete,
		output: PipedriveEndpointOutputSchemas.productVariationDelete,
	},
	'products.images.get': {
		input: PipedriveEndpointInputSchemas.productImageGet,
		output: PipedriveEndpointOutputSchemas.productImageGet,
	},
	'products.images.upload': {
		input: PipedriveEndpointInputSchemas.productImageUpload,
		output: PipedriveEndpointOutputSchemas.productImageUpload,
	},
	'products.images.update': {
		input: PipedriveEndpointInputSchemas.productImageUpdate,
		output: PipedriveEndpointOutputSchemas.productImageUpdate,
	},
	'products.images.delete': {
		input: PipedriveEndpointInputSchemas.productImageDelete,
		output: PipedriveEndpointOutputSchemas.productImageDelete,
	},
	'products.followers.list': {
		input: PipedriveEndpointInputSchemas.productFollowerList,
		output: PipedriveEndpointOutputSchemas.productFollowerList,
	},
	'products.followers.create': {
		input: PipedriveEndpointInputSchemas.productFollowerCreate,
		output: PipedriveEndpointOutputSchemas.productFollowerCreate,
	},
	'products.followers.changelog': {
		input: PipedriveEndpointInputSchemas.productFollowerChangelog,
		output: PipedriveEndpointOutputSchemas.productFollowerChangelog,
	},
	'products.followers.delete': {
		input: PipedriveEndpointInputSchemas.productFollowerDelete,
		output: PipedriveEndpointOutputSchemas.productFollowerDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pipedriveEndpointsNested
>;

const pipedriveEndpointMeta = {
	'deals.list': {
		riskLevel: 'read',
		description: 'List deals with cursor pagination and filters',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Get a deal by its numeric ID',
	},
	'deals.create': { riskLevel: 'write', description: 'Create a deal' },
	'deals.update': { riskLevel: 'write', description: 'Update a deal' },
	'deals.delete': { riskLevel: 'destructive', description: 'Delete a deal' },
	'persons.list': {
		riskLevel: 'read',
		description: 'List persons with cursor pagination and filters',
	},
	'persons.get': {
		riskLevel: 'read',
		description: 'Get a person by its numeric ID',
	},
	'persons.create': { riskLevel: 'write', description: 'Create a person' },
	'persons.update': { riskLevel: 'write', description: 'Update a person' },
	'persons.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations with cursor pagination and filters',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by its numeric ID',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create an organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an organization',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'List activities with cursor pagination and filters',
	},
	'activities.get': {
		riskLevel: 'read',
		description: 'Get an activity by its numeric ID',
	},
	'activities.create': {
		riskLevel: 'write',
		description: 'Create a calendar activity',
	},
	'activities.update': {
		riskLevel: 'write',
		description: 'Update a calendar activity',
	},
	'activities.delete': {
		riskLevel: 'destructive',
		description: 'Mark an activity deleted',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List project tasks with cursor pagination',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task by its numeric ID',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a project',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a project task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project task and its subtasks',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List products with filters and cursor pagination',
	},
	'products.create': { riskLevel: 'write', description: 'Create a product' },
	'products.search': {
		riskLevel: 'read',
		description: 'Search products by term',
	},
	'products.get': { riskLevel: 'read', description: 'Get a product by ID' },
	'products.update': { riskLevel: 'write', description: 'Update a product' },
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product',
	},
	'products.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a product and its documented fields',
	},
	'products.variations.list': {
		riskLevel: 'read',
		description: 'List product variations with cursor pagination',
	},
	'products.variations.create': {
		riskLevel: 'write',
		description: 'Create a product variation',
	},
	'products.variations.update': {
		riskLevel: 'write',
		description: 'Update a product variation',
	},
	'products.variations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product variation',
	},
	'products.images.get': {
		riskLevel: 'read',
		description: 'Get product image metadata and public URL',
	},
	'products.images.upload': {
		riskLevel: 'write',
		description: 'Upload a binary image for a product',
	},
	'products.images.update': {
		riskLevel: 'write',
		description: 'Replace a product image with binary data',
	},
	'products.images.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product image',
	},
	'products.followers.list': {
		riskLevel: 'read',
		description: 'List product followers with cursor pagination',
	},
	'products.followers.create': {
		riskLevel: 'write',
		description: 'Add a user as a product follower',
	},
	'products.followers.changelog': {
		riskLevel: 'read',
		description: 'List product follower changes with cursor pagination',
	},
	'products.followers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a product follower',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pipedriveEndpointsNested
>;

export const pipedriveAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BasePipedrivePlugin<T extends PipedrivePluginOptions> =
	CorsairPlugin<
		'pipedrive',
		typeof PipedriveSchema,
		typeof pipedriveEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalPipedrivePlugin =
	BasePipedrivePlugin<PipedrivePluginOptions>;
export type ExternalPipedrivePlugin<T extends PipedrivePluginOptions> =
	BasePipedrivePlugin<T>;

export function pipedrive<const T extends PipedrivePluginOptions>(
	incomingOptions: PipedrivePluginOptions & T = {} as PipedrivePluginOptions &
		T,
): ExternalPipedrivePlugin<T> {
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
		id: 'pipedrive',
		authConfig: pipedriveAuthConfig,
		schema: PipedriveSchema,
		options,
		hooks: options.hooks,
		endpoints: pipedriveEndpointsNested,
		webhooks: {},
		endpointMeta: pipedriveEndpointMeta,
		endpointSchemas: pipedriveEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: PipedriveKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('pipedrive', ctx.authType);
			const credential =
				ctx.authType === 'oauth_2'
					? await ctx.keys.get_access_token()
					: await ctx.keys.get_api_key();
			if (!credential) throw new AuthMissingError('pipedrive', ctx.authType);
			return credential;
		},
	} satisfies InternalPipedrivePlugin;
}

export type {
	ActivityCreateInput,
	ActivityDeleteResponse,
	ActivityGetInput,
	ActivityListInput,
	ActivityListResponse,
	ActivityResponse,
	ActivityUpdateInput,
	DealCreateInput,
	DealDeleteResponse,
	DealGetInput,
	DealListInput,
	DealListResponse,
	DealResponse,
	DealUpdateInput,
	OrganizationCreateInput,
	OrganizationDeleteResponse,
	OrganizationGetInput,
	OrganizationIdInput,
	OrganizationListInput,
	OrganizationListResponse,
	OrganizationResponse,
	OrganizationUpdateInput,
	PersonCreateInput,
	PersonDeleteResponse,
	PersonGetInput,
	PersonListInput,
	PersonListResponse,
	PersonResponse,
	PersonUpdateInput,
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
	TaskCreateInput,
	TaskDeleteResponse,
	TaskIdInput,
	TaskListInput,
	TaskListResponse,
	TaskResponse,
	TaskUpdateInput,
} from './endpoints/types';
