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
import { Media, Objects, ObjectTypes, Revisions } from './endpoints';
import type {
	CosmicEndpointInputs,
	CosmicEndpointOutputs,
} from './endpoints/types';
import {
	CosmicEndpointInputSchemas,
	CosmicEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CosmicSchema } from './schema';

const cosmicEndpointsNested = {
	objects: {
		find: Objects.find,
		findOne: Objects.findOne,
		getById: Objects.getById,
		insert: Objects.insert,
		update: Objects.update,
		delete: Objects.delete,
		batch: Objects.batch,
	},
	revisions: {
		find: Revisions.find,
		findOne: Revisions.findOne,
		insert: Revisions.insert,
	},
	media: {
		find: Media.find,
		findOne: Media.findOne,
		insert: Media.insert,
		update: Media.update,
		delete: Media.delete,
	},
	objectTypes: {
		find: ObjectTypes.find,
		findOne: ObjectTypes.findOne,
		insert: ObjectTypes.insert,
		update: ObjectTypes.update,
		delete: ObjectTypes.delete,
	},
} as const;

const cosmicWebhooksNested = {} as const;

export type CosmicPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	readKey?: string;
	bucketSlug?: string;
	hooks?: InternalCosmicPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cosmicEndpointsNested>;
};

export type CosmicContext = CorsairPluginContext<
	typeof CosmicSchema,
	CosmicPluginOptions
>;

export type CosmicKeyBuilderContext = KeyBuilderContext<CosmicPluginOptions>;

type CosmicEndpoint<K extends keyof CosmicEndpointOutputs> = CorsairEndpoint<
	CosmicContext,
	CosmicEndpointInputs[K],
	CosmicEndpointOutputs[K]
>;

export type CosmicEndpoints = {
	objectsFind: CosmicEndpoint<'objectsFind'>;
	objectsFindOne: CosmicEndpoint<'objectsFindOne'>;
	objectsGetById: CosmicEndpoint<'objectsGetById'>;
	objectsInsert: CosmicEndpoint<'objectsInsert'>;
	objectsUpdate: CosmicEndpoint<'objectsUpdate'>;
	objectsDelete: CosmicEndpoint<'objectsDelete'>;
	objectsBatch: CosmicEndpoint<'objectsBatch'>;
	revisionsFind: CosmicEndpoint<'revisionsFind'>;
	revisionsFindOne: CosmicEndpoint<'revisionsFindOne'>;
	revisionsInsert: CosmicEndpoint<'revisionsInsert'>;
	mediaFind: CosmicEndpoint<'mediaFind'>;
	mediaFindOne: CosmicEndpoint<'mediaFindOne'>;
	mediaInsert: CosmicEndpoint<'mediaInsert'>;
	mediaUpdate: CosmicEndpoint<'mediaUpdate'>;
	mediaDelete: CosmicEndpoint<'mediaDelete'>;
	objectTypesFind: CosmicEndpoint<'objectTypesFind'>;
	objectTypesFindOne: CosmicEndpoint<'objectTypesFindOne'>;
	objectTypesInsert: CosmicEndpoint<'objectTypesInsert'>;
	objectTypesUpdate: CosmicEndpoint<'objectTypesUpdate'>;
	objectTypesDelete: CosmicEndpoint<'objectTypesDelete'>;
};

export type CosmicBoundEndpoints = BindEndpoints<typeof cosmicEndpointsNested>;

export const cosmicEndpointSchemas = {
	'objects.find': {
		input: CosmicEndpointInputSchemas.objectsFind,
		output: CosmicEndpointOutputSchemas.objectsFind,
	},
	'objects.findOne': {
		input: CosmicEndpointInputSchemas.objectsFindOne,
		output: CosmicEndpointOutputSchemas.objectsFindOne,
	},
	'objects.getById': {
		input: CosmicEndpointInputSchemas.objectsGetById,
		output: CosmicEndpointOutputSchemas.objectsGetById,
	},
	'objects.insert': {
		input: CosmicEndpointInputSchemas.objectsInsert,
		output: CosmicEndpointOutputSchemas.objectsInsert,
	},
	'objects.update': {
		input: CosmicEndpointInputSchemas.objectsUpdate,
		output: CosmicEndpointOutputSchemas.objectsUpdate,
	},
	'objects.delete': {
		input: CosmicEndpointInputSchemas.objectsDelete,
		output: CosmicEndpointOutputSchemas.objectsDelete,
	},
	'objects.batch': {
		input: CosmicEndpointInputSchemas.objectsBatch,
		output: CosmicEndpointOutputSchemas.objectsBatch,
	},
	'revisions.find': {
		input: CosmicEndpointInputSchemas.revisionsFind,
		output: CosmicEndpointOutputSchemas.revisionsFind,
	},
	'revisions.findOne': {
		input: CosmicEndpointInputSchemas.revisionsFindOne,
		output: CosmicEndpointOutputSchemas.revisionsFindOne,
	},
	'revisions.insert': {
		input: CosmicEndpointInputSchemas.revisionsInsert,
		output: CosmicEndpointOutputSchemas.revisionsInsert,
	},
	'media.find': {
		input: CosmicEndpointInputSchemas.mediaFind,
		output: CosmicEndpointOutputSchemas.mediaFind,
	},
	'media.findOne': {
		input: CosmicEndpointInputSchemas.mediaFindOne,
		output: CosmicEndpointOutputSchemas.mediaFindOne,
	},
	'media.insert': {
		input: CosmicEndpointInputSchemas.mediaInsert,
		output: CosmicEndpointOutputSchemas.mediaInsert,
	},
	'media.update': {
		input: CosmicEndpointInputSchemas.mediaUpdate,
		output: CosmicEndpointOutputSchemas.mediaUpdate,
	},
	'media.delete': {
		input: CosmicEndpointInputSchemas.mediaDelete,
		output: CosmicEndpointOutputSchemas.mediaDelete,
	},
	'objectTypes.find': {
		input: CosmicEndpointInputSchemas.objectTypesFind,
		output: CosmicEndpointOutputSchemas.objectTypesFind,
	},
	'objectTypes.findOne': {
		input: CosmicEndpointInputSchemas.objectTypesFindOne,
		output: CosmicEndpointOutputSchemas.objectTypesFindOne,
	},
	'objectTypes.insert': {
		input: CosmicEndpointInputSchemas.objectTypesInsert,
		output: CosmicEndpointOutputSchemas.objectTypesInsert,
	},
	'objectTypes.update': {
		input: CosmicEndpointInputSchemas.objectTypesUpdate,
		output: CosmicEndpointOutputSchemas.objectTypesUpdate,
	},
	'objectTypes.delete': {
		input: CosmicEndpointInputSchemas.objectTypesDelete,
		output: CosmicEndpointOutputSchemas.objectTypesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cosmicEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const cosmicEndpointMeta = {
	'objects.find': {
		riskLevel: 'read',
		description: 'List Objects in a Bucket with filtering and pagination',
	},
	'objects.findOne': {
		riskLevel: 'read',
		description: 'Get a single Object by type and slug',
	},
	'objects.getById': {
		riskLevel: 'read',
		description: 'Get a single Object by id',
	},
	'objects.insert': {
		riskLevel: 'write',
		description: 'Create an Object in a Bucket',
	},
	'objects.update': {
		riskLevel: 'write',
		description: 'Update an Object by id',
	},
	'objects.delete': {
		riskLevel: 'write',
		description: 'Delete an Object by id',
	},
	'objects.batch': {
		riskLevel: 'write',
		description: 'Run up to 25 Object operations in one request',
	},
	'revisions.find': {
		riskLevel: 'read',
		description: 'List Revisions for an Object',
	},
	'revisions.findOne': {
		riskLevel: 'read',
		description: 'Get a single Revision by id',
	},
	'revisions.insert': {
		riskLevel: 'write',
		description: 'Add a draft Revision to an Object',
	},
	'media.find': {
		riskLevel: 'read',
		description: 'List Media in a Bucket',
	},
	'media.findOne': {
		riskLevel: 'read',
		description: 'Get a single Media item by name',
	},
	'media.insert': {
		riskLevel: 'write',
		description: 'Upload Media to a Bucket',
	},
	'media.update': {
		riskLevel: 'write',
		description: 'Update Media metadata by id',
	},
	'media.delete': {
		riskLevel: 'write',
		description: 'Delete Media by id',
	},
	'objectTypes.find': {
		riskLevel: 'read',
		description: 'List Object types in a Bucket',
	},
	'objectTypes.findOne': {
		riskLevel: 'read',
		description: 'Get a single Object type by slug',
	},
	'objectTypes.insert': {
		riskLevel: 'write',
		description: 'Create an Object type',
	},
	'objectTypes.update': {
		riskLevel: 'write',
		description: 'Update an Object type by slug',
	},
	'objectTypes.delete': {
		riskLevel: 'write',
		description: 'Delete an Object type by slug',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cosmicEndpointsNested>;

export const cosmicAuthConfig = {
	api_key: {
		account: ['bucket_slug'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCosmicPlugin<T extends CosmicPluginOptions> = CorsairPlugin<
	'cosmic',
	typeof CosmicSchema,
	typeof cosmicEndpointsNested,
	typeof cosmicWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCosmicPlugin = BaseCosmicPlugin<CosmicPluginOptions>;

export type ExternalCosmicPlugin<T extends CosmicPluginOptions> =
	BaseCosmicPlugin<T>;

export function cosmic<const T extends CosmicPluginOptions>(
	incomingOptions: CosmicPluginOptions & T = {} as CosmicPluginOptions & T,
): ExternalCosmicPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cosmic',
		authConfig: cosmicAuthConfig,
		schema: CosmicSchema,
		options,
		hooks: options.hooks,
		endpoints: cosmicEndpointsNested,
		webhooks: cosmicWebhooksNested,
		endpointMeta: cosmicEndpointMeta,
		endpointSchemas: cosmicEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CosmicKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (key) {
					return key;
				}

				if (options.readKey) {
					return options.readKey;
				}

				throw new AuthMissingError('cosmic', 'api_key');
			}

			throw new AuthMissingError('cosmic', 'api_key');
		},
	} satisfies InternalCosmicPlugin;
}

export type {
	CosmicEndpointInputs,
	CosmicEndpointOutputs,
	CosmicObject,
	Media,
	MediaInsertInput,
	ObjectInsertInput,
	ObjectsBatchInput,
	ObjectsBatchResponse,
	ObjectsFindInput,
	ObjectsFindResponse,
	ObjectType,
	ObjectUpdateInput,
	Revision,
} from './endpoints/types';
