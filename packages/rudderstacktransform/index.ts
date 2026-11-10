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
import type { RudderStackTransformationRegion } from './client';
import { Libraries, Transformations } from './endpoints';
import type {
	RudderStackTransformationEndpointInputs,
	RudderStackTransformationEndpointOutputs,
} from './endpoints/types';
import {
	RudderStackTransformationEndpointInputSchemas,
	RudderStackTransformationEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RudderStackTransformationSchema } from './schema';

export type RudderStackTransformationPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The region the workspace lives in. A token only works on its own region, so
	 * a workspace on `api.eu.rudderstack.com` must set `region: 'eu'`.
	 */
	region?: RudderStackTransformationRegion;
	hooks?: InternalRudderStackTransformationPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof rudderStackTransformationEndpointsNested
	>;
};

export type RudderStackTransformationContext = CorsairPluginContext<
	typeof RudderStackTransformationSchema,
	RudderStackTransformationPluginOptions
>;

export type RudderStackTransformationKeyBuilderContext =
	KeyBuilderContext<RudderStackTransformationPluginOptions>;

export type RudderStackTransformationBoundEndpoints = BindEndpoints<
	typeof rudderStackTransformationEndpointsNested
>;

type RudderStackTransformationEndpoint<
	K extends keyof RudderStackTransformationEndpointOutputs,
> = CorsairEndpoint<
	RudderStackTransformationContext,
	RudderStackTransformationEndpointInputs[K],
	RudderStackTransformationEndpointOutputs[K]
>;

export type RudderStackTransformationEndpoints = {
	transformationsList: RudderStackTransformationEndpoint<'transformationsList'>;
	transformationsCreate: RudderStackTransformationEndpoint<'transformationsCreate'>;
	transformationsGet: RudderStackTransformationEndpoint<'transformationsGet'>;
	transformationsUpdate: RudderStackTransformationEndpoint<'transformationsUpdate'>;
	transformationsDelete: RudderStackTransformationEndpoint<'transformationsDelete'>;
	transformationsListVersions: RudderStackTransformationEndpoint<'transformationsListVersions'>;
	transformationsGetVersion: RudderStackTransformationEndpoint<'transformationsGetVersion'>;
	transformationsConnect: RudderStackTransformationEndpoint<'transformationsConnect'>;
	transformationsDisconnect: RudderStackTransformationEndpoint<'transformationsDisconnect'>;
	librariesCreate: RudderStackTransformationEndpoint<'librariesCreate'>;
	librariesList: RudderStackTransformationEndpoint<'librariesList'>;
	librariesGet: RudderStackTransformationEndpoint<'librariesGet'>;
	librariesListVersions: RudderStackTransformationEndpoint<'librariesListVersions'>;
	librariesGetVersion: RudderStackTransformationEndpoint<'librariesGetVersion'>;
	librariesUpdate: RudderStackTransformationEndpoint<'librariesUpdate'>;
	librariesDelete: RudderStackTransformationEndpoint<'librariesDelete'>;
	librariesPublish: RudderStackTransformationEndpoint<'librariesPublish'>;
};

const rudderStackTransformationEndpointsNested = {
	transformations: {
		list: Transformations.list,
		create: Transformations.create,
		get: Transformations.get,
		update: Transformations.update,
		delete: Transformations.remove,
		listVersions: Transformations.listVersions,
		getVersion: Transformations.getVersion,
		connect: Transformations.connect,
		disconnect: Transformations.disconnect,
	},
	libraries: {
		create: Libraries.create,
		list: Libraries.list,
		get: Libraries.get,
		listVersions: Libraries.listVersions,
		getVersion: Libraries.getVersion,
		update: Libraries.update,
		delete: Libraries.remove,
		publish: Libraries.publish,
	},
} as const;

export const rudderStackTransformationEndpointSchemas = {
	'transformations.list': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsList,
		output: RudderStackTransformationEndpointOutputSchemas.transformationsList,
	},
	'transformations.create': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsCreate,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsCreate,
	},
	'transformations.get': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsGet,
		output: RudderStackTransformationEndpointOutputSchemas.transformationsGet,
	},
	'transformations.update': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsUpdate,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsUpdate,
	},
	'transformations.delete': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsDelete,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsDelete,
	},
	'transformations.listVersions': {
		input:
			RudderStackTransformationEndpointInputSchemas.transformationsListVersions,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsListVersions,
	},
	'transformations.getVersion': {
		input:
			RudderStackTransformationEndpointInputSchemas.transformationsGetVersion,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsGetVersion,
	},
	'transformations.connect': {
		input: RudderStackTransformationEndpointInputSchemas.transformationsConnect,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsConnect,
	},
	'transformations.disconnect': {
		input:
			RudderStackTransformationEndpointInputSchemas.transformationsDisconnect,
		output:
			RudderStackTransformationEndpointOutputSchemas.transformationsDisconnect,
	},
	'libraries.create': {
		input: RudderStackTransformationEndpointInputSchemas.librariesCreate,
		output: RudderStackTransformationEndpointOutputSchemas.librariesCreate,
	},
	'libraries.list': {
		input: RudderStackTransformationEndpointInputSchemas.librariesList,
		output: RudderStackTransformationEndpointOutputSchemas.librariesList,
	},
	'libraries.get': {
		input: RudderStackTransformationEndpointInputSchemas.librariesGet,
		output: RudderStackTransformationEndpointOutputSchemas.librariesGet,
	},
	'libraries.listVersions': {
		input: RudderStackTransformationEndpointInputSchemas.librariesListVersions,
		output:
			RudderStackTransformationEndpointOutputSchemas.librariesListVersions,
	},
	'libraries.getVersion': {
		input: RudderStackTransformationEndpointInputSchemas.librariesGetVersion,
		output: RudderStackTransformationEndpointOutputSchemas.librariesGetVersion,
	},
	'libraries.update': {
		input: RudderStackTransformationEndpointInputSchemas.librariesUpdate,
		output: RudderStackTransformationEndpointOutputSchemas.librariesUpdate,
	},
	'libraries.delete': {
		input: RudderStackTransformationEndpointInputSchemas.librariesDelete,
		output: RudderStackTransformationEndpointOutputSchemas.librariesDelete,
	},
	'libraries.publish': {
		input: RudderStackTransformationEndpointInputSchemas.librariesPublish,
		output: RudderStackTransformationEndpointOutputSchemas.librariesPublish,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rudderStackTransformationEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rudderStackTransformationEndpointMeta = {
	'transformations.list': {
		riskLevel: 'read',
		description:
			'List the published transformations in the workspace with their code, language and connected destinations',
	},
	'transformations.create': {
		riskLevel: 'write',
		description:
			'Create a transformation; unpublished unless publish is true, and only a published one can be connected to a destination',
	},
	'transformations.get': {
		riskLevel: 'read',
		description: 'Read one published transformation by ID',
	},
	'transformations.update': {
		riskLevel: 'write',
		description:
			'Update a transformation, which always writes a new revision and makes it live only when publish is true',
	},
	'transformations.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a published transformation; its revisions are never deleted',
	},
	'transformations.listVersions': {
		riskLevel: 'read',
		description:
			'List the revisions of a transformation, newest or oldest first',
	},
	'transformations.getVersion': {
		riskLevel: 'read',
		description: 'Read one revision of a transformation',
	},
	'transformations.connect': {
		riskLevel: 'write',
		description:
			'Connect a published transformation to a destination, replacing any transformation already connected to it',
	},
	'transformations.disconnect': {
		riskLevel: 'write',
		description: 'Disconnect a transformation from a destination',
	},
	'libraries.create': {
		riskLevel: 'write',
		description:
			'Create a reusable library whose importName transformations import it by',
	},
	'libraries.list': {
		riskLevel: 'read',
		description: 'List the published libraries in the workspace',
	},
	'libraries.get': {
		riskLevel: 'read',
		description: 'Read one published library by ID',
	},
	'libraries.listVersions': {
		riskLevel: 'read',
		description:
			'List the revisions of a library and which of them is published',
	},
	'libraries.getVersion': {
		riskLevel: 'read',
		description: 'Read one revision of a library',
	},
	'libraries.update': {
		riskLevel: 'write',
		description:
			'Update a library, writing a new revision and publishing it only when publish is true; the name and language cannot change',
	},
	'libraries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a library by ID',
	},
	'libraries.publish': {
		riskLevel: 'write',
		description:
			'Publish chosen transformation and library revisions after RudderStack runs their code, so a failing test publishes nothing',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof rudderStackTransformationEndpointsNested
>;

export type BaseRudderStackTransformationPlugin<
	T extends RudderStackTransformationPluginOptions,
> = CorsairPlugin<
	'rudderstacktransform',
	typeof RudderStackTransformationSchema,
	typeof rudderStackTransformationEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRudderStackTransformationPlugin =
	BaseRudderStackTransformationPlugin<RudderStackTransformationPluginOptions>;

export type ExternalRudderStackTransformationPlugin<
	T extends RudderStackTransformationPluginOptions,
> = BaseRudderStackTransformationPlugin<T>;

export function rudderstacktransform<
	const T extends RudderStackTransformationPluginOptions,
>(
	incomingOptions: RudderStackTransformationPluginOptions &
		T = {} as RudderStackTransformationPluginOptions & T,
): ExternalRudderStackTransformationPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		region: incomingOptions.region ?? ('us' as const),
	};
	return {
		id: 'rudderstacktransform',
		schema: RudderStackTransformationSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rudderStackTransformationEndpointsNested,
		webhooks: {},
		endpointMeta: rudderStackTransformationEndpointMeta,
		endpointSchemas: rudderStackTransformationEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (
			ctx: RudderStackTransformationKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError(
				'rudderstacktransform',
				ctx.authType ?? 'api_key',
			);
		},
	} satisfies InternalRudderStackTransformationPlugin;
}

export {
	RUDDERSTACK_TRANSFORMATION_HOSTS,
	RudderStackTransformationAPIError,
	type RudderStackTransformationRegion,
} from './client';

export type {
	LibrariesListResponse,
	LibraryCreateInput,
	LibraryCreateResponse,
	LibraryDeleteResponse,
	LibraryGetResponse,
	LibraryUpdateInput,
	LibraryUpdateResponse,
	LibraryVersionInput,
	LibraryVersionResponse,
	LibraryVersionsInput,
	LibraryVersionsResponse,
	PublishInput,
	PublishResponse,
	RudderStackLibrary,
	RudderStackTransformation,
	RudderStackTransformationEndpointInputs,
	RudderStackTransformationEndpointOutputs,
	TransformationConnectInput,
	TransformationConnectResponse,
	TransformationCreateInput,
	TransformationCreateResponse,
	TransformationDeleteResponse,
	TransformationDisconnectInput,
	TransformationDisconnectResponse,
	TransformationGetResponse,
	TransformationsListResponse,
	TransformationUpdateInput,
	TransformationUpdateResponse,
	TransformationVersionInput,
	TransformationVersionResponse,
	TransformationVersionsInput,
	TransformationVersionsResponse,
} from './endpoints/types';
