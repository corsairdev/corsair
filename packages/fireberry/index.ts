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
	Batch,
	CustomFields,
	CustomObjects,
	Files,
	Metadata,
	Records,
} from './endpoints';
import type {
	FireberryEndpointInputs,
	FireberryEndpointOutputs,
} from './endpoints/types';
import {
	FireberryEndpointInputSchemas,
	FireberryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FireberrySchema } from './schema';

export type FireberryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFireberryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fireberryEndpointsNested>;
};

export type FireberryContext = CorsairPluginContext<
	typeof FireberrySchema,
	FireberryPluginOptions
>;
export type FireberryKeyBuilderContext =
	KeyBuilderContext<FireberryPluginOptions>;
export type FireberryBoundEndpoints = BindEndpoints<
	typeof fireberryEndpointsNested
>;

type FireberryEndpoint<K extends keyof FireberryEndpointOutputs> =
	CorsairEndpoint<
		FireberryContext,
		FireberryEndpointInputs[K],
		FireberryEndpointOutputs[K]
	>;

export type FireberryEndpoints = {
	list: FireberryEndpoint<'list'>;
	get: FireberryEndpoint<'get'>;
	create: FireberryEndpoint<'create'>;
	update: FireberryEndpoint<'update'>;
	delete: FireberryEndpoint<'delete'>;
	query: FireberryEndpoint<'query'>;
	legacyQuery: FireberryEndpoint<'legacyQuery'>;
	related: FireberryEndpoint<'related'>;
	items: FireberryEndpoint<'items'>;
	objects: FireberryEndpoint<'objects'>;
	object: FireberryEndpoint<'object'>;
	fields: FireberryEndpoint<'fields'>;
	field: FireberryEndpoint<'field'>;
	picklist: FireberryEndpoint<'picklist'>;
	customFieldCreate: FireberryEndpoint<'customFieldCreate'>;
	customFieldUpdate: FireberryEndpoint<'customFieldUpdate'>;
	customFieldDelete: FireberryEndpoint<'customFieldDelete'>;
	customObjectCreate: FireberryEndpoint<'customObjectCreate'>;
	customObjectUpdate: FireberryEndpoint<'customObjectUpdate'>;
	customObjectDelete: FireberryEndpoint<'customObjectDelete'>;
	fileUpload: FireberryEndpoint<'fileUpload'>;
	batchCreate: FireberryEndpoint<'batchCreate'>;
	batchUpdate: FireberryEndpoint<'batchUpdate'>;
	batchDelete: FireberryEndpoint<'batchDelete'>;
};

const fireberryEndpointsNested = {
	records: {
		list: Records.list,
		get: Records.get,
		create: Records.create,
		update: Records.update,
		delete: Records.delete,
		query: Records.query,
		legacyQuery: Records.legacyQuery,
		related: Records.related,
		items: Records.items,
	},
	metadata: {
		objects: Metadata.objects,
		object: Metadata.object,
		fields: Metadata.fields,
		field: Metadata.field,
		picklist: Metadata.picklist,
	},
	customFields: {
		create: CustomFields.create,
		update: CustomFields.update,
		delete: CustomFields.delete,
	},
	customObjects: {
		create: CustomObjects.create,
		update: CustomObjects.update,
		delete: CustomObjects.delete,
	},
	files: { create: Files.create },
	batch: {
		create: Batch.create,
		update: Batch.update,
		delete: Batch.delete,
	},
} as const;

export const fireberryEndpointSchemas = {
	'records.list': {
		input: FireberryEndpointInputSchemas.list,
		output: FireberryEndpointOutputSchemas.list,
	},
	'records.get': {
		input: FireberryEndpointInputSchemas.get,
		output: FireberryEndpointOutputSchemas.get,
	},
	'records.create': {
		input: FireberryEndpointInputSchemas.create,
		output: FireberryEndpointOutputSchemas.create,
	},
	'records.update': {
		input: FireberryEndpointInputSchemas.update,
		output: FireberryEndpointOutputSchemas.update,
	},
	'records.delete': {
		input: FireberryEndpointInputSchemas.delete,
		output: FireberryEndpointOutputSchemas.delete,
	},
	'records.query': {
		input: FireberryEndpointInputSchemas.query,
		output: FireberryEndpointOutputSchemas.query,
	},
	'records.legacyQuery': {
		input: FireberryEndpointInputSchemas.legacyQuery,
		output: FireberryEndpointOutputSchemas.legacyQuery,
	},
	'records.related': {
		input: FireberryEndpointInputSchemas.related,
		output: FireberryEndpointOutputSchemas.related,
	},
	'records.items': {
		input: FireberryEndpointInputSchemas.items,
		output: FireberryEndpointOutputSchemas.items,
	},
	'metadata.objects': {
		input: FireberryEndpointInputSchemas.objects,
		output: FireberryEndpointOutputSchemas.objects,
	},
	'metadata.object': {
		input: FireberryEndpointInputSchemas.object,
		output: FireberryEndpointOutputSchemas.object,
	},
	'metadata.fields': {
		input: FireberryEndpointInputSchemas.fields,
		output: FireberryEndpointOutputSchemas.fields,
	},
	'metadata.field': {
		input: FireberryEndpointInputSchemas.field,
		output: FireberryEndpointOutputSchemas.field,
	},
	'metadata.picklist': {
		input: FireberryEndpointInputSchemas.picklist,
		output: FireberryEndpointOutputSchemas.picklist,
	},
	'customFields.create': {
		input: FireberryEndpointInputSchemas.customFieldCreate,
		output: FireberryEndpointOutputSchemas.customFieldCreate,
	},
	'customFields.update': {
		input: FireberryEndpointInputSchemas.customFieldUpdate,
		output: FireberryEndpointOutputSchemas.customFieldUpdate,
	},
	'customFields.delete': {
		input: FireberryEndpointInputSchemas.customFieldDelete,
		output: FireberryEndpointOutputSchemas.customFieldDelete,
	},
	'customObjects.create': {
		input: FireberryEndpointInputSchemas.customObjectCreate,
		output: FireberryEndpointOutputSchemas.customObjectCreate,
	},
	'customObjects.update': {
		input: FireberryEndpointInputSchemas.customObjectUpdate,
		output: FireberryEndpointOutputSchemas.customObjectUpdate,
	},
	'customObjects.delete': {
		input: FireberryEndpointInputSchemas.customObjectDelete,
		output: FireberryEndpointOutputSchemas.customObjectDelete,
	},
	'files.create': {
		input: FireberryEndpointInputSchemas.fileUpload,
		output: FireberryEndpointOutputSchemas.fileUpload,
	},
	'batch.create': {
		input: FireberryEndpointInputSchemas.batchCreate,
		output: FireberryEndpointOutputSchemas.batchCreate,
	},
	'batch.update': {
		input: FireberryEndpointInputSchemas.batchUpdate,
		output: FireberryEndpointOutputSchemas.batchUpdate,
	},
	'batch.delete': {
		input: FireberryEndpointInputSchemas.batchDelete,
		output: FireberryEndpointOutputSchemas.batchDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fireberryEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fireberryEndpointMeta = {
	'records.list': {
		riskLevel: 'read',
		description: 'List records for a documented Fireberry object',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Retrieve a Fireberry record by ID',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a Fireberry record',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update a Fireberry record',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a Fireberry record',
	},
	'records.query': {
		riskLevel: 'read',
		description: 'Filter, sort, group, and paginate Fireberry records',
	},
	'records.legacyQuery': {
		riskLevel: 'read',
		description:
			'Search and paginate Fireberry records using the legacy query API',
	},
	'records.related': {
		riskLevel: 'read',
		description: 'List records related to a Fireberry record',
	},
	'records.items': {
		riskLevel: 'read',
		description:
			'Retrieve line items associated with a Fireberry order, invoice, or receipt',
	},
	'metadata.objects': {
		riskLevel: 'read',
		description: 'List Fireberry object metadata',
	},
	'metadata.object': {
		riskLevel: 'read',
		description: 'Retrieve Fireberry object metadata',
	},
	'metadata.fields': {
		riskLevel: 'read',
		description: 'List fields for a Fireberry object',
	},
	'metadata.field': {
		riskLevel: 'read',
		description: 'Retrieve details for a Fireberry field',
	},
	'metadata.picklist': {
		riskLevel: 'read',
		description: 'List values for a Fireberry picklist field',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a tenant-defined Fireberry field',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: 'Update a tenant-defined Fireberry field',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tenant-defined Fireberry field',
	},
	'customObjects.create': {
		riskLevel: 'write',
		description: 'Create a custom Fireberry object',
	},
	'customObjects.update': {
		riskLevel: 'write',
		description: 'Update a custom Fireberry object',
	},
	'customObjects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom Fireberry object and its record definition',
	},
	'files.create': {
		riskLevel: 'write',
		description: 'Upload a file attachment to a Fireberry record',
	},
	'batch.create': {
		riskLevel: 'write',
		description: 'Create multiple Fireberry records in one request',
	},
	'batch.update': {
		riskLevel: 'write',
		description: 'Update multiple Fireberry records in one request',
	},
	'batch.delete': {
		riskLevel: 'destructive',
		description: 'Delete up to 20 Fireberry records in one request',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof fireberryEndpointsNested
>;

export const fireberryAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseFireberryPlugin<T extends FireberryPluginOptions> =
	CorsairPlugin<
		'fireberry',
		typeof FireberrySchema,
		typeof fireberryEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalFireberryPlugin =
	BaseFireberryPlugin<FireberryPluginOptions>;
export type ExternalFireberryPlugin<T extends FireberryPluginOptions> =
	BaseFireberryPlugin<T>;

export function fireberry<const T extends FireberryPluginOptions>(
	incomingOptions: FireberryPluginOptions & T = {} as FireberryPluginOptions &
		T,
): ExternalFireberryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fireberry',
		authConfig: fireberryAuthConfig,
		schema: FireberrySchema,
		options,
		hooks: options.hooks,
		endpoints: fireberryEndpointsNested,
		webhooks: {},
		endpointMeta: fireberryEndpointMeta,
		endpointSchemas: fireberryEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FireberryKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (options.key.length === 0)
					throw new AuthMissingError('fireberry', 'api_key');
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('fireberry', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('fireberry', 'api_key');
			return key;
		},
	} satisfies InternalFireberryPlugin;
}

export type {
	FireberryEndpointInputs,
	FireberryEndpointOutputs,
} from './endpoints/types';
