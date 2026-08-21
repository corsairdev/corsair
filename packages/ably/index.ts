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

import { Application, Channels, Push } from './endpoints';

import type {
	AblyEndpointInputs,
	AblyEndpointOutputs,
} from './endpoints/types';

import {
	AblyEndpointInputSchemas,
	AblyEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { AblySchema } from './schema';

/* -------------------------------------------------------------------------- */
/* Plugin options                                                              */
/* -------------------------------------------------------------------------- */

export type AblyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAblyPlugin['hooks'];
	webhookHooks?: InternalAblyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ablyEndpointsNested>;
};

export type AblyContext = CorsairPluginContext<
	typeof AblySchema,
	AblyPluginOptions
>;

export type AblyKeyBuilderContext = KeyBuilderContext<AblyPluginOptions>;

export type AblyBoundEndpoints = BindEndpoints<typeof ablyEndpointsNested>;

type AblyEndpoint<K extends keyof AblyEndpointOutputs> = CorsairEndpoint<
	AblyContext,
	AblyEndpointInputs[K],
	AblyEndpointOutputs[K]
>;

/* -------------------------------------------------------------------------- */
/* Endpoint types                                                              */
/* -------------------------------------------------------------------------- */

export type AblyEndpoints = {
	publishBatchMessages: AblyEndpoint<'publishBatchMessages'>;
	getChannelDetails: AblyEndpoint<'getChannelDetails'>;
	getChannelHistory: AblyEndpoint<'getChannelHistory'>;
	getChannelPresence: AblyEndpoint<'getChannelPresence'>;
	getPresenceHistory: AblyEndpoint<'getPresenceHistory'>;
	getMessageVersions: AblyEndpoint<'getMessageVersions'>;
	listChannels: AblyEndpoint<'listChannels'>;
	publishMessageToChannel: AblyEndpoint<'publishMessageToChannel'>;
	batchPresence: AblyEndpoint<'batchPresence'>;
	batchPresenceHistory: AblyEndpoint<'batchPresenceHistory'>;

	getServiceTime: AblyEndpoint<'getServiceTime'>;
	getStats: AblyEndpoint<'getStats'>;
	requestAccessToken: AblyEndpoint<'requestAccessToken'>;

	publishPushNotificationsBatch: AblyEndpoint<'publishPushNotificationsBatch'>;
	deleteChannelSubscription: AblyEndpoint<'deleteChannelSubscription'>;
	createPushChannelSubscription: AblyEndpoint<'createPushChannelSubscription'>;
	getPushDevice: AblyEndpoint<'getPushDevice'>;
	listPushChannelSubscriptions: AblyEndpoint<'listPushChannelSubscriptions'>;
	listPushChannels: AblyEndpoint<'listPushChannels'>;
	listRegisteredPushDevices: AblyEndpoint<'listRegisteredPushDevices'>;
	patchPushDeviceRegistration: AblyEndpoint<'patchPushDeviceRegistration'>;
	publishPushNotification: AblyEndpoint<'publishPushNotification'>;
	registerPushDevice: AblyEndpoint<'registerPushDevice'>;
	unregisterAllPushDevices: AblyEndpoint<'unregisterAllPushDevices'>;
	unregisterPushDevice: AblyEndpoint<'unregisterPushDevice'>;
	updatePushDevice: AblyEndpoint<'updatePushDevice'>;
};

/* -------------------------------------------------------------------------- */
/* Webhooks                                                                    */
/* -------------------------------------------------------------------------- */

export type AblyWebhooks = Record<string, never>;

export type AblyBoundWebhooks = BindWebhooks<AblyWebhooks>;

/* -------------------------------------------------------------------------- */
/* Endpoint tree                                                               */
/* -------------------------------------------------------------------------- */

const ablyEndpointsNested = {
	application: {
		getServiceTime: Application.getServiceTime,
		getStats: Application.getStats,
		requestAccessToken: Application.requestAccessToken,
	},

	channels: {
		publishBatchMessages: Channels.publishBatchMessages,
		getChannelDetails: Channels.getChannelDetails,
		getChannelHistory: Channels.getChannelHistory,
		getChannelPresence: Channels.getChannelPresence,
		getPresenceHistory: Channels.getPresenceHistory,
		getMessageVersions: Channels.getMessageVersions,
		listChannels: Channels.listChannels,
		publishMessageToChannel: Channels.publishMessageToChannel,
		batchPresence: Channels.batchPresence,
		batchPresenceHistory: Channels.batchPresenceHistory,
	},

	push: {
		publishPushNotificationsBatch: Push.publishPushNotificationsBatch,
		deleteChannelSubscription: Push.deleteChannelSubscription,
		createPushChannelSubscription: Push.createPushChannelSubscription,
		getPushDevice: Push.getPushDevice,
		listPushChannelSubscriptions: Push.listPushChannelSubscriptions,
		listPushChannels: Push.listPushChannels,
		listRegisteredPushDevices: Push.listRegisteredPushDevices,
		patchPushDeviceRegistration: Push.patchPushDeviceRegistration,
		publishPushNotification: Push.publishPushNotification,
		registerPushDevice: Push.registerPushDevice,
		unregisterAllPushDevices: Push.unregisterAllPushDevices,
		unregisterPushDevice: Push.unregisterPushDevice,
		updatePushDevice: Push.updatePushDevice,
	},
} as const;

const ablyWebhooksNested = {} as const;

/* -------------------------------------------------------------------------- */
/* Schemas                                                                     */
/* -------------------------------------------------------------------------- */

export const ablyEndpointSchemas = {
	'application.getServiceTime': {
		input: AblyEndpointInputSchemas.getServiceTime,
		output: AblyEndpointOutputSchemas.getServiceTime,
	},
	'application.getStats': {
		input: AblyEndpointInputSchemas.getStats,
		output: AblyEndpointOutputSchemas.getStats,
	},
	'application.requestAccessToken': {
		input: AblyEndpointInputSchemas.requestAccessToken,
		output: AblyEndpointOutputSchemas.requestAccessToken,
	},

	'channels.publishBatchMessages': {
		input: AblyEndpointInputSchemas.publishBatchMessages,
		output: AblyEndpointOutputSchemas.publishBatchMessages,
	},
	'channels.getChannelDetails': {
		input: AblyEndpointInputSchemas.getChannelDetails,
		output: AblyEndpointOutputSchemas.getChannelDetails,
	},
	'channels.getChannelHistory': {
		input: AblyEndpointInputSchemas.getChannelHistory,
		output: AblyEndpointOutputSchemas.getChannelHistory,
	},
	'channels.getChannelPresence': {
		input: AblyEndpointInputSchemas.getChannelPresence,
		output: AblyEndpointOutputSchemas.getChannelPresence,
	},
	'channels.getPresenceHistory': {
		input: AblyEndpointInputSchemas.getPresenceHistory,
		output: AblyEndpointOutputSchemas.getPresenceHistory,
	},
	'channels.getMessageVersions': {
		input: AblyEndpointInputSchemas.getMessageVersions,
		output: AblyEndpointOutputSchemas.getMessageVersions,
	},
	'channels.listChannels': {
		input: AblyEndpointInputSchemas.listChannels,
		output: AblyEndpointOutputSchemas.listChannels,
	},
	'channels.publishMessageToChannel': {
		input: AblyEndpointInputSchemas.publishMessageToChannel,
		output: AblyEndpointOutputSchemas.publishMessageToChannel,
	},
	'channels.batchPresence': {
		input: AblyEndpointInputSchemas.batchPresence,
		output: AblyEndpointOutputSchemas.batchPresence,
	},
	'channels.batchPresenceHistory': {
		input: AblyEndpointInputSchemas.batchPresenceHistory,
		output: AblyEndpointOutputSchemas.batchPresenceHistory,
	},

	'push.publishPushNotificationsBatch': {
		input: AblyEndpointInputSchemas.publishPushNotificationsBatch,
		output: AblyEndpointOutputSchemas.publishPushNotificationsBatch,
	},
	'push.deleteChannelSubscription': {
		input: AblyEndpointInputSchemas.deleteChannelSubscription,
		output: AblyEndpointOutputSchemas.deleteChannelSubscription,
	},
	'push.createPushChannelSubscription': {
		input: AblyEndpointInputSchemas.createPushChannelSubscription,
		output: AblyEndpointOutputSchemas.createPushChannelSubscription,
	},
	'push.getPushDevice': {
		input: AblyEndpointInputSchemas.getPushDevice,
		output: AblyEndpointOutputSchemas.getPushDevice,
	},
	'push.listPushChannelSubscriptions': {
		input: AblyEndpointInputSchemas.listPushChannelSubscriptions,
		output: AblyEndpointOutputSchemas.listPushChannelSubscriptions,
	},
	'push.listPushChannels': {
		input: AblyEndpointInputSchemas.listPushChannels,
		output: AblyEndpointOutputSchemas.listPushChannels,
	},
	'push.listRegisteredPushDevices': {
		input: AblyEndpointInputSchemas.listRegisteredPushDevices,
		output: AblyEndpointOutputSchemas.listRegisteredPushDevices,
	},
	'push.patchPushDeviceRegistration': {
		input: AblyEndpointInputSchemas.patchPushDeviceRegistration,
		output: AblyEndpointOutputSchemas.patchPushDeviceRegistration,
	},
	'push.publishPushNotification': {
		input: AblyEndpointInputSchemas.publishPushNotification,
		output: AblyEndpointOutputSchemas.publishPushNotification,
	},
	'push.registerPushDevice': {
		input: AblyEndpointInputSchemas.registerPushDevice,
		output: AblyEndpointOutputSchemas.registerPushDevice,
	},
	'push.unregisterAllPushDevices': {
		input: AblyEndpointInputSchemas.unregisterAllPushDevices,
		output: AblyEndpointOutputSchemas.unregisterAllPushDevices,
	},
	'push.unregisterPushDevice': {
		input: AblyEndpointInputSchemas.unregisterPushDevice,
		output: AblyEndpointOutputSchemas.unregisterPushDevice,
	},
	'push.updatePushDevice': {
		input: AblyEndpointInputSchemas.updatePushDevice,
		output: AblyEndpointOutputSchemas.updatePushDevice,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ablyEndpointsNested>;

const ablyWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof ablyWebhooksNested
>;

/* -------------------------------------------------------------------------- */
/* Endpoint metadata                                                           */
/* -------------------------------------------------------------------------- */

const ablyEndpointMeta = {
	'application.getServiceTime': {
		riskLevel: 'read',
		description: 'Get the current Ably service time.',
	},
	'application.getStats': {
		riskLevel: 'read',
		description: 'Retrieve application usage statistics.',
	},
	'application.requestAccessToken': {
		riskLevel: 'write',
		description: 'Request an Ably access token.',
	},

	'channels.publishBatchMessages': {
		riskLevel: 'write',
		description: 'Publish messages to multiple Ably channels.',
	},
	'channels.getChannelDetails': {
		riskLevel: 'read',
		description: 'Retrieve details for an active channel.',
	},
	'channels.getChannelHistory': {
		riskLevel: 'read',
		description: 'Retrieve message history for a channel.',
	},
	'channels.getChannelPresence': {
		riskLevel: 'read',
		description: 'Retrieve current channel presence members.',
	},
	'channels.getPresenceHistory': {
		riskLevel: 'read',
		description: 'Retrieve presence history for a channel.',
	},
	'channels.getMessageVersions': {
		riskLevel: 'read',
		description: 'Retrieve historical versions of a message.',
	},
	'channels.listChannels': {
		riskLevel: 'read',
		description: 'List active Ably channels.',
	},
	'channels.publishMessageToChannel': {
		riskLevel: 'write',
		description: 'Publish a message to an Ably channel.',
	},
	'channels.batchPresence': {
		riskLevel: 'read',
		description: 'Retrieve presence information for multiple channels.',
	},
	'channels.batchPresenceHistory': {
		riskLevel: 'read',
		description: 'Retrieve presence history for multiple channels.',
	},

	'push.publishPushNotificationsBatch': {
		riskLevel: 'write',
		description: 'Publish a batch of push notifications.',
	},
	'push.deleteChannelSubscription': {
		riskLevel: 'destructive',
		description: 'Delete matching push channel subscriptions.',
	},
	'push.createPushChannelSubscription': {
		riskLevel: 'write',
		description: 'Subscribe a device or client to a push channel.',
	},
	'push.getPushDevice': {
		riskLevel: 'read',
		description: 'Retrieve a push device registration.',
	},
	'push.listPushChannelSubscriptions': {
		riskLevel: 'read',
		description: 'List push channel subscriptions.',
	},
	'push.listPushChannels': {
		riskLevel: 'read',
		description: 'List channels with push subscribers.',
	},
	'push.listRegisteredPushDevices': {
		riskLevel: 'read',
		description: 'List registered push notification devices.',
	},
	'push.patchPushDeviceRegistration': {
		riskLevel: 'write',
		description: 'Partially update a push device registration.',
	},
	'push.publishPushNotification': {
		riskLevel: 'write',
		description: 'Publish a push notification.',
	},
	'push.registerPushDevice': {
		riskLevel: 'write',
		description: 'Register a device for push notifications.',
	},
	'push.unregisterAllPushDevices': {
		riskLevel: 'destructive',
		description: 'Delete matching push device registrations.',
	},
	'push.unregisterPushDevice': {
		riskLevel: 'destructive',
		description: 'Delete a push device registration.',
	},
	'push.updatePushDevice': {
		riskLevel: 'write',
		description: 'Create or replace a push device registration.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ablyEndpointsNested>;

/* -------------------------------------------------------------------------- */
/* Authentication                                                              */
/* -------------------------------------------------------------------------- */

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ablyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

/* -------------------------------------------------------------------------- */
/* Plugin                                                                      */
/* -------------------------------------------------------------------------- */

export type BaseAblyPlugin<T extends AblyPluginOptions> = CorsairPlugin<
	'ably',
	typeof AblySchema,
	typeof ablyEndpointsNested,
	typeof ablyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAblyPlugin = BaseAblyPlugin<AblyPluginOptions>;

export type ExternalAblyPlugin<T extends AblyPluginOptions> = BaseAblyPlugin<T>;

export function ably<const T extends AblyPluginOptions>(
	incomingOptions: AblyPluginOptions & T = {} as AblyPluginOptions & T,
): ExternalAblyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ably',
		authConfig: ablyAuthConfig,
		schema: AblySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ablyEndpointsNested,
		webhooks: ablyWebhooksNested,
		endpointMeta: ablyEndpointMeta,
		endpointSchemas: ablyEndpointSchemas,
		webhookSchemas: ablyWebhookSchemas,
		pluginWebhookMatcher: () => false,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: AblyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAblyPlugin;
}

export type {
	AblyDevice,
	AblyEndpointInputs,
	AblyEndpointOutputs,
	AblyMessage,
	AblyPresenceMessage,
} from './endpoints/types';
