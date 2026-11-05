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
import { Islands, RemoteControl } from './endpoints';
import type {
	EpicGamesEndpointInputs,
	EpicGamesEndpointOutputs,
} from './endpoints/types';
import {
	EpicGamesEndpointInputSchemas,
	EpicGamesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EpicGamesSchema } from './schema';

export type EpicGamesPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** OAuth access token override for local scripts. */
	key?: string;
	/** Unreal Web Remote Control base URL (default http://127.0.0.1:30010). */
	remoteControlBaseUrl?: string;
	/** When true, explicitly send the Epic token on Remote Control calls (default: false). */
	remoteControlBearer?: boolean;
	hooks?: InternalEpicGamesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof epicgamesEndpointsNested>;
};

export type EpicGamesContext = CorsairPluginContext<
	typeof EpicGamesSchema,
	EpicGamesPluginOptions
>;

export type EpicGamesKeyBuilderContext =
	KeyBuilderContext<EpicGamesPluginOptions>;

export type EpicGamesBoundEndpoints = BindEndpoints<
	typeof epicgamesEndpointsNested
>;

type EpicGamesEndpoint<K extends keyof EpicGamesEndpointOutputs> =
	CorsairEndpoint<
		EpicGamesContext,
		EpicGamesEndpointInputs[K],
		EpicGamesEndpointOutputs[K]
	>;

export type EpicGamesEndpoints = {
	islandsList: EpicGamesEndpoint<'islandsList'>;
	islandsGet: EpicGamesEndpoint<'islandsGet'>;
	islandsGetMetricsByInterval: EpicGamesEndpoint<'islandsGetMetricsByInterval'>;
	islandsGetPlays: EpicGamesEndpoint<'islandsGetPlays'>;
	islandsGetUniquePlayers: EpicGamesEndpoint<'islandsGetUniquePlayers'>;
	islandsGetMinutesPlayed: EpicGamesEndpoint<'islandsGetMinutesPlayed'>;
	islandsGetAvgMinutesPerPlayer: EpicGamesEndpoint<'islandsGetAvgMinutesPerPlayer'>;
	islandsGetPeakCcu: EpicGamesEndpoint<'islandsGetPeakCcu'>;
	islandsGetFavorites: EpicGamesEndpoint<'islandsGetFavorites'>;
	islandsGetRecommendations: EpicGamesEndpoint<'islandsGetRecommendations'>;
	islandsGetRetention: EpicGamesEndpoint<'islandsGetRetention'>;

	remoteInitiateSession: EpicGamesEndpoint<'remoteInitiateSession'>;
	remoteBatch: EpicGamesEndpoint<'remoteBatch'>;
	remoteCorsPreflight: EpicGamesEndpoint<'remoteCorsPreflight'>;
	remoteGetPreset: EpicGamesEndpoint<'remoteGetPreset'>;
	remoteGetPresetMetadata: EpicGamesEndpoint<'remoteGetPresetMetadata'>;
	remoteGetPresetMetadataKey: EpicGamesEndpoint<'remoteGetPresetMetadataKey'>;
	remotePutPresetMetadataKey: EpicGamesEndpoint<'remotePutPresetMetadataKey'>;
	remoteDeletePresetMetadataKey: EpicGamesEndpoint<'remoteDeletePresetMetadataKey'>;
	remoteGetPresetProperty: EpicGamesEndpoint<'remoteGetPresetProperty'>;
	remoteUpdatePresetProperty: EpicGamesEndpoint<'remoteUpdatePresetProperty'>;
	remoteInvokePresetFunction: EpicGamesEndpoint<'remoteInvokePresetFunction'>;
	remoteDescribeObject: EpicGamesEndpoint<'remoteDescribeObject'>;
	remoteCallObjectFunction: EpicGamesEndpoint<'remoteCallObjectFunction'>;
	remotePutObjectProperty: EpicGamesEndpoint<'remotePutObjectProperty'>;
	remoteGetObjectThumbnail: EpicGamesEndpoint<'remoteGetObjectThumbnail'>;
	remoteListBlueprintCallableFunctions: EpicGamesEndpoint<'remoteListBlueprintCallableFunctions'>;
	remoteWaitForObjectEvent: EpicGamesEndpoint<'remoteWaitForObjectEvent'>;
};

const epicgamesEndpointsNested = {
	islands: {
		list: Islands.list,
		get: Islands.get,
		getMetricsByInterval: Islands.getMetricsByInterval,
		getPlays: Islands.getPlays,
		getUniquePlayers: Islands.getUniquePlayers,
		getMinutesPlayed: Islands.getMinutesPlayed,
		getAvgMinutesPerPlayer: Islands.getAvgMinutesPerPlayer,
		getPeakCcu: Islands.getPeakCcu,
		getFavorites: Islands.getFavorites,
		getRecommendations: Islands.getRecommendations,
		getRetention: Islands.getRetention,
	},
	remote: {
		initiateSession: RemoteControl.initiateSession,
		batch: RemoteControl.batch,
		corsPreflight: RemoteControl.corsPreflight,
		getPreset: RemoteControl.getPreset,
		getPresetMetadata: RemoteControl.getPresetMetadata,
		getPresetMetadataKey: RemoteControl.getPresetMetadataKey,
		putPresetMetadataKey: RemoteControl.putPresetMetadataKey,
		deletePresetMetadataKey: RemoteControl.deletePresetMetadataKey,
		getPresetProperty: RemoteControl.getPresetProperty,
		updatePresetProperty: RemoteControl.updatePresetProperty,
		invokePresetFunction: RemoteControl.invokePresetFunction,
		describeObject: RemoteControl.describeObject,
		callObjectFunction: RemoteControl.callObjectFunction,
		putObjectProperty: RemoteControl.putObjectProperty,
		getObjectThumbnail: RemoteControl.getObjectThumbnail,
		listBlueprintCallableFunctions:
			RemoteControl.listBlueprintCallableFunctions,
		waitForObjectEvent: RemoteControl.waitForObjectEvent,
	},
} as const;

export const epicgamesEndpointSchemas = {
	'islands.list': {
		input: EpicGamesEndpointInputSchemas.islandsList,
		output: EpicGamesEndpointOutputSchemas.islandsList,
	},
	'islands.get': {
		input: EpicGamesEndpointInputSchemas.islandsGet,
		output: EpicGamesEndpointOutputSchemas.islandsGet,
	},
	'islands.getMetricsByInterval': {
		input: EpicGamesEndpointInputSchemas.islandsGetMetricsByInterval,
		output: EpicGamesEndpointOutputSchemas.islandsGetMetricsByInterval,
	},
	'islands.getPlays': {
		input: EpicGamesEndpointInputSchemas.islandsGetPlays,
		output: EpicGamesEndpointOutputSchemas.islandsGetPlays,
	},
	'islands.getUniquePlayers': {
		input: EpicGamesEndpointInputSchemas.islandsGetUniquePlayers,
		output: EpicGamesEndpointOutputSchemas.islandsGetUniquePlayers,
	},
	'islands.getMinutesPlayed': {
		input: EpicGamesEndpointInputSchemas.islandsGetMinutesPlayed,
		output: EpicGamesEndpointOutputSchemas.islandsGetMinutesPlayed,
	},
	'islands.getAvgMinutesPerPlayer': {
		input: EpicGamesEndpointInputSchemas.islandsGetAvgMinutesPerPlayer,
		output: EpicGamesEndpointOutputSchemas.islandsGetAvgMinutesPerPlayer,
	},
	'islands.getPeakCcu': {
		input: EpicGamesEndpointInputSchemas.islandsGetPeakCcu,
		output: EpicGamesEndpointOutputSchemas.islandsGetPeakCcu,
	},
	'islands.getFavorites': {
		input: EpicGamesEndpointInputSchemas.islandsGetFavorites,
		output: EpicGamesEndpointOutputSchemas.islandsGetFavorites,
	},
	'islands.getRecommendations': {
		input: EpicGamesEndpointInputSchemas.islandsGetRecommendations,
		output: EpicGamesEndpointOutputSchemas.islandsGetRecommendations,
	},
	'islands.getRetention': {
		input: EpicGamesEndpointInputSchemas.islandsGetRetention,
		output: EpicGamesEndpointOutputSchemas.islandsGetRetention,
	},

	'remote.initiateSession': {
		input: EpicGamesEndpointInputSchemas.remoteInitiateSession,
		output: EpicGamesEndpointOutputSchemas.remoteInitiateSession,
	},
	'remote.batch': {
		input: EpicGamesEndpointInputSchemas.remoteBatch,
		output: EpicGamesEndpointOutputSchemas.remoteBatch,
	},
	'remote.corsPreflight': {
		input: EpicGamesEndpointInputSchemas.remoteCorsPreflight,
		output: EpicGamesEndpointOutputSchemas.remoteCorsPreflight,
	},
	'remote.getPreset': {
		input: EpicGamesEndpointInputSchemas.remoteGetPreset,
		output: EpicGamesEndpointOutputSchemas.remoteGetPreset,
	},
	'remote.getPresetMetadata': {
		input: EpicGamesEndpointInputSchemas.remoteGetPresetMetadata,
		output: EpicGamesEndpointOutputSchemas.remoteGetPresetMetadata,
	},
	'remote.getPresetMetadataKey': {
		input: EpicGamesEndpointInputSchemas.remoteGetPresetMetadataKey,
		output: EpicGamesEndpointOutputSchemas.remoteGetPresetMetadataKey,
	},
	'remote.putPresetMetadataKey': {
		input: EpicGamesEndpointInputSchemas.remotePutPresetMetadataKey,
		output: EpicGamesEndpointOutputSchemas.remotePutPresetMetadataKey,
	},
	'remote.deletePresetMetadataKey': {
		input: EpicGamesEndpointInputSchemas.remoteDeletePresetMetadataKey,
		output: EpicGamesEndpointOutputSchemas.remoteDeletePresetMetadataKey,
	},
	'remote.getPresetProperty': {
		input: EpicGamesEndpointInputSchemas.remoteGetPresetProperty,
		output: EpicGamesEndpointOutputSchemas.remoteGetPresetProperty,
	},
	'remote.updatePresetProperty': {
		input: EpicGamesEndpointInputSchemas.remoteUpdatePresetProperty,
		output: EpicGamesEndpointOutputSchemas.remoteUpdatePresetProperty,
	},
	'remote.invokePresetFunction': {
		input: EpicGamesEndpointInputSchemas.remoteInvokePresetFunction,
		output: EpicGamesEndpointOutputSchemas.remoteInvokePresetFunction,
	},
	'remote.describeObject': {
		input: EpicGamesEndpointInputSchemas.remoteDescribeObject,
		output: EpicGamesEndpointOutputSchemas.remoteDescribeObject,
	},
	'remote.callObjectFunction': {
		input: EpicGamesEndpointInputSchemas.remoteCallObjectFunction,
		output: EpicGamesEndpointOutputSchemas.remoteCallObjectFunction,
	},
	'remote.putObjectProperty': {
		input: EpicGamesEndpointInputSchemas.remotePutObjectProperty,
		output: EpicGamesEndpointOutputSchemas.remotePutObjectProperty,
	},
	'remote.getObjectThumbnail': {
		input: EpicGamesEndpointInputSchemas.remoteGetObjectThumbnail,
		output: EpicGamesEndpointOutputSchemas.remoteGetObjectThumbnail,
	},
	'remote.listBlueprintCallableFunctions': {
		input: EpicGamesEndpointInputSchemas.remoteListBlueprintCallableFunctions,
		output: EpicGamesEndpointOutputSchemas.remoteListBlueprintCallableFunctions,
	},
	'remote.waitForObjectEvent': {
		input: EpicGamesEndpointInputSchemas.remoteWaitForObjectEvent,
		output: EpicGamesEndpointOutputSchemas.remoteWaitForObjectEvent,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof epicgamesEndpointsNested
>;

const defaultAuthType = 'oauth_2';

const epicgamesEndpointMeta = {
	'islands.list': {
		riskLevel: 'read',
		description: 'List public discoverable Fortnite Creative islands',
	},
	'islands.get': {
		riskLevel: 'read',
		description: 'Get metadata for a Fortnite island by code',
	},
	'islands.getMetricsByInterval': {
		riskLevel: 'read',
		description: 'Get island usage metrics aggregated by time interval',
	},
	'islands.getPlays': {
		riskLevel: 'read',
		description: 'Get island play/session-start counts for an interval',
	},
	'islands.getUniquePlayers': {
		riskLevel: 'read',
		description: 'Get unique player counts for an island over an interval',
	},
	'islands.getMinutesPlayed': {
		riskLevel: 'read',
		description: 'Get total minutes played on an island for an interval',
	},
	'islands.getAvgMinutesPerPlayer': {
		riskLevel: 'read',
		description: 'Get average minutes per unique player for an island',
	},
	'islands.getPeakCcu': {
		riskLevel: 'read',
		description: 'Get peak concurrent users for an island over an interval',
	},
	'islands.getFavorites': {
		riskLevel: 'read',
		description: 'Get island favorites metrics for an interval',
	},
	'islands.getRecommendations': {
		riskLevel: 'read',
		description: 'Get island recommendation counts for an interval',
	},
	'islands.getRetention': {
		riskLevel: 'read',
		description: 'Get day-over-day retention metrics for an island',
	},
	'remote.initiateSession': {
		riskLevel: 'write',
		description: 'Initiate an Unreal Web Remote Control session',
	},
	'remote.batch': {
		riskLevel: 'write',
		description: 'Batch multiple Remote Control API calls into one request',
	},
	'remote.corsPreflight': {
		riskLevel: 'read',
		description: 'CORS preflight OPTIONS against the Remote Control API',
	},
	'remote.getPreset': {
		riskLevel: 'read',
		description: 'Get a Remote Control preset by name',
	},
	'remote.getPresetMetadata': {
		riskLevel: 'read',
		description: 'Get all metadata entries for a Remote Control preset',
	},
	'remote.getPresetMetadataKey': {
		riskLevel: 'read',
		description: 'Get a single metadata key for a Remote Control preset',
	},
	'remote.putPresetMetadataKey': {
		riskLevel: 'write',
		description: 'Create or update a metadata key on a Remote Control preset',
	},
	'remote.deletePresetMetadataKey': {
		riskLevel: 'write',
		description: 'Delete a metadata key from a Remote Control preset',
	},
	'remote.getPresetProperty': {
		riskLevel: 'read',
		description: 'Read a property exposed on a Remote Control preset',
	},
	'remote.updatePresetProperty': {
		riskLevel: 'write',
		description: 'Update a property exposed on a Remote Control preset',
	},
	'remote.invokePresetFunction': {
		riskLevel: 'write',
		description: 'Invoke a function exposed on a Remote Control preset',
	},
	'remote.describeObject': {
		riskLevel: 'read',
		description: 'Describe a UObject by path via Remote Control',
	},
	'remote.callObjectFunction': {
		riskLevel: 'write',
		description: 'Call a Blueprint-callable function on a UObject',
	},
	'remote.putObjectProperty': {
		riskLevel: 'write',
		description: 'Read or set UObject property values via Remote Control',
	},
	'remote.getObjectThumbnail': {
		riskLevel: 'read',
		description: 'Fetch Content Browser thumbnail for an asset path',
	},
	'remote.listBlueprintCallableFunctions': {
		riskLevel: 'read',
		description: 'List Blueprint-callable functions exposed by a UObject',
	},
	'remote.waitForObjectEvent': {
		riskLevel: 'write',
		description:
			'Wait for a UObject event (experimental; requires EnableExperimentalRoutes)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof epicgamesEndpointsNested
>;

export const epicgamesAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEpicGamesPlugin<T extends EpicGamesPluginOptions> =
	CorsairPlugin<
		'epicgames',
		typeof EpicGamesSchema,
		typeof epicgamesEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof epicgamesAuthConfig
	>;

export type InternalEpicGamesPlugin =
	BaseEpicGamesPlugin<EpicGamesPluginOptions>;

export type ExternalEpicGamesPlugin<T extends EpicGamesPluginOptions> =
	BaseEpicGamesPlugin<T>;

// Type assertion required: all options fields are optional, so `{}` is a valid
// runtime default, but TypeScript cannot prove `{}` satisfies arbitrary T.
export function epicgames<const T extends EpicGamesPluginOptions>(
	incomingOptions: EpicGamesPluginOptions & T = {} as EpicGamesPluginOptions &
		T,
): ExternalEpicGamesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'epicgames',
		schema: EpicGamesSchema,
		options,
		hooks: options.hooks,
		endpoints: epicgamesEndpointsNested,
		webhooks: {},
		endpointMeta: epicgamesEndpointMeta,
		endpointSchemas: epicgamesEndpointSchemas,
		authConfig: epicgamesAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be last.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: EpicGamesKeyBuilderContext, source) => {
			// Fortnite Data API GETs and local UE Remote Control work without a token.
			// Never throw for a missing OAuth token — Bearer is attached only when present.
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				return (await ctx.keys.get_access_token()) ?? '';
			}

			return '';
		},
	} satisfies InternalEpicGamesPlugin;
}

export type {
	EpicGamesEndpointInputs,
	EpicGamesEndpointOutputs,
} from './endpoints/types';

export {
	EpicGamesEndpointInputSchemas,
	EpicGamesEndpointOutputSchemas,
} from './endpoints/types';
